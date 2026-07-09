import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAuthUser } from '@/lib/api-auth';
import { createAuditLog } from '@/lib/audit-log';
import { getClientIp } from '@/lib/server-rate-limiter';
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

const mfaVerifySchema = z.object({
  token: z.string().length(6, 'TOTP code must be 6 digits').regex(/^\d+$/, 'Must be numeric'),
  setupToken: z.string().optional(), // For env-based setup (Vercel)
});

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
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const clientIp = getClientIp(request);
    const userAgent = request.headers.get('user-agent') ?? undefined;

    // Validate input
    const body = await request.json();
    const validation = validateInput(mfaVerifySchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.errors[0] },
        { status: 400 }
      );
    }

    const { token, setupToken } = validation.data;
    const db = await getDb();

    // ── Database available (local dev) ─────────────────────────────────────
    if (db) {
      const adminUser = await db.adminUser.findUnique({ where: { id: user.userId } });
      if (!adminUser) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }

      if (adminUser.mfaEnabled) {
        return NextResponse.json(
          { success: false, error: 'MFA is already enabled' },
          { status: 400 }
        );
      }

      if (!adminUser.totpSecret) {
        return NextResponse.json(
          { success: false, error: 'Please set up MFA first' },
          { status: 400 }
        );
      }

      // Verify TOTP token
      const speakeasy = await import('speakeasy');
      const verified = speakeasy.totp.verify({
        secret: adminUser.totpSecret,
        encoding: 'base32',
        token,
        window: 2,
      });

      if (!verified) {
        await createAuditLog({
          action: 'MFA_SETUP_FAILED',
          entity: 'AdminUser',
          entityId: user.userId,
          details: { email: adminUser.email },
          userId: user.userId,
          userAgent,
          ipAddress: clientIp,
        });

        return NextResponse.json(
          { success: false, error: 'Invalid verification code. Please try again.' },
          { status: 400 }
        );
      }

      // Enable MFA
      await db.adminUser.update({
        where: { id: user.userId },
        data: { mfaEnabled: true },
      });

      await createAuditLog({
        action: 'MFA_ENABLED',
        entity: 'AdminUser',
        entityId: user.userId,
        details: { email: adminUser.email },
        userId: user.userId,
        userAgent,
        ipAddress: clientIp,
      });

      return NextResponse.json({
        success: true,
        message: 'MFA has been enabled successfully. Save your secret key as a backup!',
      });
    }

    // ── No database (Vercel/serverless) — use env vars ────────────────────
    if (!setupToken) {
      return NextResponse.json(
        { success: false, error: 'Setup token required. Please restart the MFA setup process.' },
        { status: 400 }
      );
    }

    // Decode the setup token to get the pending TOTP secret
    let setupPayload: { setupStep: boolean; totpSecret: string; userId: string };
    try {
      const jwt = await import('jsonwebtoken');
      setupPayload = jwt.verify(setupToken, getMfaJwtSecret()) as typeof setupPayload;
    } catch {
      return NextResponse.json(
        { success: false, error: 'Setup session expired. Please start the MFA setup again.' },
        { status: 401 }
      );
    }

    if (!setupPayload.setupStep || !setupPayload.totpSecret) {
      return NextResponse.json(
        { success: false, error: 'Invalid setup token' },
        { status: 401 }
      );
    }

    // Verify TOTP token against the pending secret
    const speakeasy = await import('speakeasy');
    const verified = speakeasy.totp.verify({
      secret: setupPayload.totpSecret,
      encoding: 'base32',
      token,
      window: 2,
    });

    if (!verified) {
      return NextResponse.json(
        { success: false, error: 'Invalid verification code. Please try again.' },
        { status: 400 }
      );
    }

    // On Vercel, we can't persist the secret to database.
    // Return success with instructions to add the env var.
    return NextResponse.json({
      success: true,
      message: 'MFA verification successful! To complete setup on Vercel, add the environment variable:',
      envVarInstruction: {
        name: 'ADMIN_TOTP_SECRET',
        value: setupPayload.totpSecret,
        steps: [
          '1. Go to your Vercel project Settings → Environment Variables',
          '2. Add ADMIN_TOTP_SECRET with the value shown below',
          '3. Redeploy the project for changes to take effect',
        ],
      },
      totpSecret: setupPayload.totpSecret,
      isEnvSetup: true,
    });
  } catch (error) {
    console.error('[MFA_VERIFY_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify MFA code' },
      { status: 500 }
    );
  }
}
