import { NextRequest, NextResponse } from "next/server";
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/auth";
import { loginRateLimiter, getClientIp } from "@/lib/server-rate-limiter";
import { adminLoginSchema, validateInput, sanitizeString } from "@/lib/validation";
import { isIpAllowed } from "@/lib/ip-whitelist";

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 60 * 60 * 1000; // 1 hour
let _mfaJwtSecret: string | undefined;
function getMfaJwtSecret(): string {
  if (_mfaJwtSecret !== undefined) return _mfaJwtSecret;
  const v = process.env.JWT_SECRET;
  if (v) { _mfaJwtSecret = v; return v; }
  if (process.env.NODE_ENV === "production") {
    throw new Error("FATAL: JWT_SECRET environment variable is required in production.");
  }
  _mfaJwtSecret = "paliwal-secure-jwt-secret-dev-placeholder";
  return _mfaJwtSecret;
}

// ── Environment Variable Admin (works on Vercel without database) ──────────
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "";
const ADMIN_TOTP_SECRET = process.env.ADMIN_TOTP_SECRET || "";

/**
 * Try login using environment variable credentials.
 * This is the PRIMARY method on Vercel/serverless where SQLite doesn't exist.
 * If ADMIN_TOTP_SECRET is set, returns MFA-required response instead of direct login.
 */
async function tryEnvLogin(
  email: string,
  password: string
): Promise<{
  user: { userId: string; email: string; name: string; role: string } | null;
  mfaRequired?: boolean;
}> {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH) return { user: null };

  const normalizedEmail = email.toLowerCase().trim();
  if (normalizedEmail !== ADMIN_EMAIL.toLowerCase().trim()) return { user: null };

  const isMatch = await comparePassword(password, ADMIN_PASSWORD_HASH);
  if (!isMatch) return { user: null };

  const envUser = {
    userId: "env-admin-001",
    email: ADMIN_EMAIL,
    name: "Admin",
    role: "ADMIN",
  };

  // Check if MFA is configured via env var
  if (ADMIN_TOTP_SECRET) {
    return { user: envUser, mfaRequired: true };
  }

  return { user: envUser, mfaRequired: false };
}

/**
 * Try login using database (SQLite - local dev only).
 * Returns null if database is unavailable or user not found.
 */
async function tryDbLogin(
  email: string,
  password: string,
  clientIp: string,
  userAgent?: string
): Promise<{
  success: boolean;
  response?: NextResponse;
  error?: string;
} | null> {
  let db: any;
  try {
    const dbModule = await import("@/lib/db");
    db = dbModule.db;
  } catch {
    // Prisma/SQLite not available (Vercel serverless)
    return null;
  }

  try {
    const adminUser = await db.adminUser.findUnique({
      where: { email: sanitizeString(email.toLowerCase().trim()) },
    });

    if (!adminUser) return { success: false, error: "NOT_FOUND" };

    // Check locked
    if (adminUser.lockedUntil && new Date(adminUser.lockedUntil) > new Date()) {
      const remainingMs = new Date(adminUser.lockedUntil).getTime() - Date.now();
      return {
        success: false,
        error: `Account is temporarily locked. Try again in ${Math.ceil(remainingMs / 60000)} minutes.`,
      };
    }

    // Check active
    if (!adminUser.isActive) {
      return { success: false, error: "Account is deactivated. Contact admin." };
    }

    // Compare password
    const isMatch = await comparePassword(password, adminUser.passwordHash);
    if (!isMatch) {
      const newFailedAttempts = adminUser.failedLoginAttempts + 1;
      const shouldLock = newFailedAttempts >= MAX_FAILED_ATTEMPTS;

      try {
        await db.adminUser.update({
          where: { id: adminUser.id },
          data: {
            failedLoginAttempts: newFailedAttempts,
            lockedUntil: shouldLock ? new Date(Date.now() + LOCK_DURATION_MS) : adminUser.lockedUntil,
          },
        });
      } catch { /* ignore */ }

      if (shouldLock) {
        return { success: false, error: "Account locked due to too many failed attempts. Try again in 1 hour." };
      }

      const attemptsRemaining = MAX_FAILED_ATTEMPTS - newFailedAttempts;
      return {
        success: false,
        error: `Invalid email or password. ${attemptsRemaining} attempt${attemptsRemaining !== 1 ? 's' : ''} remaining.`,
      };
    }

    // Success — reset failed attempts
    try {
      await db.adminUser.update({
        where: { id: adminUser.id },
        data: { failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
      });
    } catch { /* ignore */ }

    // Check MFA
    if (adminUser.mfaEnabled && adminUser.totpSecret) {
      const jwt = await import('jsonwebtoken');
      const mfaToken = jwt.sign(
        { userId: adminUser.id, mfaStep: true },
        getMfaJwtSecret(),
        { expiresIn: "5m" }
      );

      return {
        success: true,
        response: NextResponse.json({
          success: true,
          mfaRequired: true,
          mfaToken,
          user: { userId: adminUser.id, email: adminUser.email, name: adminUser.name },
        }),
      };
    }

    // Generate tokens
    const tokenPayload = { userId: adminUser.id, email: adminUser.email, role: adminUser.role };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    const response = NextResponse.json({
      success: true,
      accessToken,
      user: { userId: adminUser.id, email: adminUser.email, role: adminUser.role, name: adminUser.name },
    });

    // ── Refresh token: httpOnly cookie, scoped to refresh endpoint ─────────
    response.cookies.set("admin_refresh_token", refreshToken, {
      path: "/api/admin/auth/refresh",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
    });

    // ── Access token: also httpOnly (XSS-safe). Client keeps only user info
    //    in memory; middleware reads the cookie for edge-side auth. ─────────
    response.cookies.set("admin_access_token", accessToken, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60, // 15 min — matches JWT expiry
    });

    return { success: true, response };
  } catch (error) {
    console.error("[LOGIN_DB_ERROR]", error);
    return null; // Fall back to env login
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const userAgent = request.headers.get("user-agent") ?? undefined;

    // ── IP Whitelist check ─────────────────────────────────────────────────
    if (!isIpAllowed(clientIp)) {
      return NextResponse.json(
        { success: false, error: "Access denied from this IP address." },
        { status: 403 }
      );
    }

    // ── Rate limiting ──────────────────────────────────────────────────────
    const rateLimit = loginRateLimiter.check(clientIp, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many login attempts. Please try again later.",
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
        },
        { status: 429 }
      );
    }

    // ── Validate input ────────────────────────────────────────────────────
    const body = await request.json();
    const validation = validateInput(adminLoginSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.errors[0] },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // ── Step 1: Try environment variable login (works on Vercel) ───────────
    const envResult = await tryEnvLogin(email, password);
    if (envResult.user) {
      loginRateLimiter.reset(clientIp);

      // Check if MFA is required for env-admin (ADMIN_TOTP_SECRET set)
      if (envResult.mfaRequired) {
        const jwt = await import('jsonwebtoken');
        const mfaToken = jwt.sign(
          { userId: envResult.user.userId, mfaStep: true },
          getMfaJwtSecret(),
          { expiresIn: "5m" }
        );

        return NextResponse.json({
          success: true,
          mfaRequired: true,
          mfaToken,
          user: { userId: envResult.user.userId, email: envResult.user.email, name: envResult.user.name },
        });
      }

      const tokenPayload = { userId: envResult.user.userId, email: envResult.user.email, role: envResult.user.role };
      const accessToken = generateAccessToken(tokenPayload);
      const refreshToken = generateRefreshToken(tokenPayload);

      const response = NextResponse.json({
        success: true,
        accessToken,
        user: envResult.user,
      });

      response.cookies.set("admin_refresh_token", refreshToken, {
        path: "/api/admin/auth/refresh",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60,
      });

      return response;
    }

    // ── Step 2: Try database login (works on local dev with SQLite) ────────
    const dbResult = await tryDbLogin(email, password, clientIp, userAgent);

    if (dbResult === null) {
      // Database not available and env login failed
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!dbResult.success) {
      // Database found but login failed (wrong password, locked, etc.)
      const status = dbResult.error?.includes("locked") ? 423 : 401;
      return NextResponse.json(
        { success: false, error: dbResult.error },
        { status }
      );
    }

    // Database login succeeded
    loginRateLimiter.reset(clientIp);
    return dbResult.response!;
  } catch (error) {
    console.error("[LOGIN_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
