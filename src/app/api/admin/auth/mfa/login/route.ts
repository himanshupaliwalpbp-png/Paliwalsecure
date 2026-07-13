import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateAccessToken, generateRefreshToken, comparePassword } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit-log';
import { getClientIp, loginRateLimiter } from '@/lib/server-rate-limiter';
import { validateInput } from '@/lib/validation';

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
const ADMIN_TOTP_SECRET = process.env.ADMIN_TOTP_SECRET || '';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';

const mfaLoginSchema = z.object({
  mfaToken: z.string().min(1, 'MFA token is required'),
  totpCode: z.string().length(6, 'TOTP code must be 6 digits').regex(/^\d+$/, 'Must be numeric'),
});

interface MfaJwtPayload {
  userId: string;
  mfaStep: boolean;
  iat: number;
  exp: number;
}

async function getDb() {
  try {
    const dbModule = await import('@/lib/db');
    return dbModule.db;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const userAgent = request.headers.get('user-agent') ?? undefined;

    // Rate limit
    const rateLimit = loginRateLimiter.check(clientIp, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // Validate input
    const body = await request.json();
    const validation = validateInput(mfaLoginSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.errors[0] },
        { status: 400 }
      );
    }

    const { mfaToken, totpCode } = validation.data;

    // Verify MFA token
    let mfaPayload: MfaJwtPayload;
    try {
      const jwt = await import('jsonwebtoken');
      mfaPayload = jwt.verify(mfaToken, getMfaJwtSecret()) as MfaJwtPayload;
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired MFA session. Please login again.' },
        { status: 401 }
      );
    }

    // Verify it's actually an MFA step token
    if (!mfaPayload.mfaStep || !mfaPayload.userId) {
      return NextResponse.json(
        { success: false, error: 'Invalid MFA token' },
        { status: 401 }
      );
    }

    const db = await getDb();

    // ── Database available (local dev) ─────────────────────────────────────
    if (db) {
      const adminUser = await db.adminUser.findUnique({
        where: { id: mfaPayload.userId },
      });

      if (!adminUser || !adminUser.isActive) {
        return NextResponse.json(
          { success: false, error: 'Account not found or deactivated' },
          { status: 401 }
        );
      }

      // Verify TOTP code
      const speakeasy = await import('speakeasy');
      const verified = speakeasy.totp.verify({
        secret: adminUser.totpSecret!,
        encoding: 'base32',
        token: totpCode,
        window: 2,
      });

      if (!verified) {
        await createAuditLog({
          action: 'MFA_LOGIN_FAILED',
          entity: 'AdminUser',
          entityId: adminUser.id,
          details: { email: adminUser.email, ip: clientIp },
          userAgent,
          ipAddress: clientIp,
        });

        return NextResponse.json(
          { success: false, error: 'Invalid verification code. Please try again.' },
          { status: 400 }
        );
      }

      // MFA verified — generate real tokens
      const tokenPayload = {
        userId: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
      };

      const accessToken = generateAccessToken(tokenPayload);
      const refreshToken = generateRefreshToken(tokenPayload);

      // Update last login
      await db.adminUser.update({
        where: { id: adminUser.id },
        data: { lastLoginAt: new Date() },
      });

      // Reset rate limiter
      loginRateLimiter.reset(clientIp);

      await createAuditLog({
        action: 'LOGIN',
        entity: 'AdminUser',
        entityId: adminUser.id,
        details: { email: adminUser.email, mfaVerified: true },
        userId: adminUser.id,
        userAgent,
        ipAddress: clientIp,
      });

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

      response.cookies.set('admin_refresh_token', refreshToken, {
        path: '/api/admin/auth/refresh',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60,
      });

      // Access token also httpOnly (XSS-safe)
      response.cookies.set('admin_access_token', accessToken, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60,
      });

      return response;
    }

    // ── No database (Vercel/serverless) — use env vars ────────────────────
    if (!ADMIN_TOTP_SECRET) {
      return NextResponse.json(
        { success: false, error: 'MFA is not configured on this server. Contact your administrator.' },
        { status: 400 }
      );
    }

    // Verify TOTP code against env var secret
    const speakeasy = await import('speakeasy');
    const verified = speakeasy.totp.verify({
      secret: ADMIN_TOTP_SECRET,
      encoding: 'base32',
      token: totpCode,
      window: 2,
    });

    if (!verified) {
      return NextResponse.json(
        { success: false, error: 'Invalid verification code. Please try again.' },
        { status: 400 }
      );
    }

    // MFA verified — generate tokens for env-admin user
    const envUserId = 'env-admin-001';
    const tokenPayload = {
      userId: envUserId,
      email: ADMIN_EMAIL || 'admin@paliwalsecure.in',
      role: 'ADMIN',
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    loginRateLimiter.reset(clientIp);

    const response = NextResponse.json({
      success: true,
      accessToken,
      user: {
        userId: envUserId,
        email: ADMIN_EMAIL || 'admin@paliwalsecure.in',
        role: 'ADMIN',
        name: 'Admin',
      },
    });

    response.cookies.set('admin_refresh_token', refreshToken, {
      path: '/api/admin/auth/refresh',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
    });

    // Access token also httpOnly (XSS-safe)
    response.cookies.set('admin_access_token', accessToken, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60,
    });

    return response;
  } catch (error) {
    console.error('[MFA_LOGIN_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
