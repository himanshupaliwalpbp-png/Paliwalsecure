import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/auth";
import { loginRateLimiter, getClientIp } from "@/lib/server-rate-limiter";
import { adminLoginSchema, validateInput, sanitizeString } from "@/lib/validation";
import { createAuditLog } from "@/lib/audit-log";
import { isIpAllowed } from "@/lib/ip-whitelist";

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 60 * 60 * 1000; // 1 hour
const MFA_JWT_SECRET = process.env.JWT_SECRET || "paliwal-secure-jwt-secret-dev-placeholder";

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const userAgent = request.headers.get("user-agent") ?? undefined;

    // ── IP Whitelist check ─────────────────────────────────────────────────
    if (!isIpAllowed(clientIp)) {
      await createAuditLog({
        action: "IP_BLOCKED",
        entity: "AdminUser",
        details: { ip: clientIp, reason: "IP not in whitelist" },
        userAgent,
        ipAddress: clientIp,
      });

      return NextResponse.json(
        { success: false, error: "Access denied from this IP address." },
        { status: 403 }
      );
    }

    // ── Rate limiting: 5 attempts per 15 min per IP ──────────────────────
    const rateLimit = loginRateLimiter.check(clientIp, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many login attempts. Please try again later.",
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // ── Validate input with Zod ──────────────────────────────────────────
    const body = await request.json();
    const validation = validateInput(adminLoginSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.errors[0] },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // ── Find admin user ──────────────────────────────────────────────────
    const adminUser = await db.adminUser.findUnique({
      where: { email: sanitizeString(email.toLowerCase().trim()) },
    });

    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        {
          status: 401,
          headers: { "X-RateLimit-Remaining": String(rateLimit.remaining) },
        }
      );
    }

    // ── Check if account is locked ───────────────────────────────────────
    if (adminUser.lockedUntil && new Date(adminUser.lockedUntil) > new Date()) {
      const remainingMs = new Date(adminUser.lockedUntil).getTime() - Date.now();
      return NextResponse.json(
        {
          success: false,
          error: `Account is temporarily locked due to too many failed attempts. Please try again in ${Math.ceil(remainingMs / 60000)} minutes.`,
        },
        { status: 423 }
      );
    }

    // ── Check if account is active ───────────────────────────────────────
    if (!adminUser.isActive) {
      return NextResponse.json(
        { success: false, error: "Account is deactivated. Contact admin." },
        { status: 401 }
      );
    }

    // ── Compare password ─────────────────────────────────────────────────
    const isMatch = await comparePassword(password, adminUser.passwordHash);
    if (!isMatch) {
      // ── Increment failed login attempts ────────────────────────────────
      const newFailedAttempts = adminUser.failedLoginAttempts + 1;
      const shouldLock = newFailedAttempts >= MAX_FAILED_ATTEMPTS;

      await db.adminUser.update({
        where: { id: adminUser.id },
        data: {
          failedLoginAttempts: newFailedAttempts,
          lockedUntil: shouldLock ? new Date(Date.now() + LOCK_DURATION_MS) : adminUser.lockedUntil,
        },
      });

      // ── Audit log for failed attempt ───────────────────────────────────
      await createAuditLog({
        action: shouldLock ? "ACCOUNT_LOCKED" : "LOGIN_FAILED",
        entity: "AdminUser",
        entityId: adminUser.id,
        details: {
          email: adminUser.email,
          failedAttempts: newFailedAttempts,
          locked: shouldLock,
          ip: clientIp,
        },
        userAgent,
        ipAddress: clientIp,
      });

      if (shouldLock) {
        return NextResponse.json(
          {
            success: false,
            error: "Account has been locked due to too many failed attempts. Please try again in 1 hour.",
          },
          { status: 423 }
        );
      }

      const attemptsRemaining = MAX_FAILED_ATTEMPTS - newFailedAttempts;
      return NextResponse.json(
        {
          success: false,
          error: `Invalid email or password. ${attemptsRemaining} attempt${attemptsRemaining !== 1 ? 's' : ''} remaining before account lockout.`,
        },
        {
          status: 401,
          headers: { "X-RateLimit-Remaining": String(rateLimit.remaining) },
        }
      );
    }

    // ── Successful login: reset failed attempts and lock ──────────────────
    await db.adminUser.update({
      where: { id: adminUser.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    });

    // ── Reset IP rate limiter on successful login ────────────────────────
    loginRateLimiter.reset(clientIp);

    // ── Check if MFA is enabled ──────────────────────────────────────────
    if (adminUser.mfaEnabled && adminUser.totpSecret) {
      // Generate short-lived MFA step token (5 minutes)
      const mfaToken = jwt.sign(
        { userId: adminUser.id, mfaStep: true },
        MFA_JWT_SECRET,
        { expiresIn: "5m" }
      );

      // Audit MFA step initiated
      await createAuditLog({
        action: "LOGIN_MFA_REQUIRED",
        entity: "AdminUser",
        entityId: adminUser.id,
        details: { email: adminUser.email, ip: clientIp },
        userAgent,
        ipAddress: clientIp,
      });

      return NextResponse.json({
        success: true,
        mfaRequired: true,
        mfaToken,
        user: {
          userId: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
        },
      });
    }

    // ── No MFA: generate tokens normally ──────────────────────────────────
    const tokenPayload = {
      userId: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // ── Create audit log ─────────────────────────────────────────────────
    await createAuditLog({
      action: "LOGIN",
      entity: "AdminUser",
      entityId: adminUser.id,
      details: { email: adminUser.email },
      userId: adminUser.id,
      userAgent,
      ipAddress: clientIp,
    });

    // ── Set access token + refresh token as cookies ──────────────────────
    const response = NextResponse.json({
      success: true,
      accessToken,
      user: {
        userId: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        name: adminUser.name,
      },
    });

    // Set access token as cookie so middleware can read it
    response.cookies.set("admin_access_token", accessToken, {
      path: "/",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, // 15 min
    });

    response.cookies.set("admin_refresh_token", refreshToken, {
      path: "/api/admin/auth/refresh",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("[LOGIN_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
