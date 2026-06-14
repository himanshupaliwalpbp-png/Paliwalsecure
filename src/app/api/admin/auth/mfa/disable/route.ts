import { NextRequest, NextResponse } from 'next/server';
import speakeasy from 'speakeasy';
import { z } from 'zod';
import { getAuthUser } from '@/lib/api-auth';
import { comparePassword } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit-log';
import { getClientIp } from '@/lib/server-rate-limiter';
import { validateInput } from '@/lib/validation';

const ADMIN_TOTP_SECRET = process.env.ADMIN_TOTP_SECRET || '';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';

const mfaDisableSchema = z.object({
  password: z.string().min(1, 'Current password is required'),
  token: z.string().length(6, 'TOTP code must be 6 digits').regex(/^\d+$/, 'Must be numeric'),
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
    const validation = validateInput(mfaDisableSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.errors[0] },
        { status: 400 }
      );
    }

    const { password, token } = validation.data;
    const db = await getDb();

    // ── Database available (local dev) ─────────────────────────────────────
    if (db) {
      const adminUser = await db.adminUser.findUnique({ where: { id: user.userId } });
      if (!adminUser) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }

      if (!adminUser.mfaEnabled) {
        return NextResponse.json(
          { success: false, error: 'MFA is not enabled' },
          { status: 400 }
        );
      }

      // Verify current password
      const isPasswordValid = await comparePassword(password, adminUser.passwordHash);
      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, error: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      // Verify TOTP token
      const verified = speakeasy.totp.verify({
        secret: adminUser.totpSecret!,
        encoding: 'base32',
        token,
        window: 2,
      });

      if (!verified) {
        await createAuditLog({
          action: 'MFA_DISABLE_FAILED',
          entity: 'AdminUser',
          entityId: user.userId,
          details: { email: adminUser.email },
          userId: user.userId,
          userAgent,
          ipAddress: clientIp,
        });

        return NextResponse.json(
          { success: false, error: 'Invalid TOTP code' },
          { status: 400 }
        );
      }

      // Disable MFA and clear secret
      await db.adminUser.update({
        where: { id: user.userId },
        data: { mfaEnabled: false, totpSecret: null },
      });

      await createAuditLog({
        action: 'MFA_DISABLED',
        entity: 'AdminUser',
        entityId: user.userId,
        details: { email: adminUser.email },
        userId: user.userId,
        userAgent,
        ipAddress: clientIp,
      });

      return NextResponse.json({
        success: true,
        message: 'MFA has been disabled successfully.',
      });
    }

    // ── No database (Vercel/serverless) — use env vars ────────────────────
    if (!ADMIN_TOTP_SECRET) {
      return NextResponse.json(
        { success: false, error: 'MFA is not enabled on this server.' },
        { status: 400 }
      );
    }

    // Verify password against env var hash
    if (!ADMIN_PASSWORD_HASH) {
      return NextResponse.json(
        { success: false, error: 'Cannot verify password. Contact administrator.' },
        { status: 500 }
      );
    }

    const isPasswordValid = await comparePassword(password, ADMIN_PASSWORD_HASH);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Verify TOTP token
    const verified = speakeasy.totp.verify({
      secret: ADMIN_TOTP_SECRET,
      encoding: 'base32',
      token,
      window: 2,
    });

    if (!verified) {
      return NextResponse.json(
        { success: false, error: 'Invalid TOTP code' },
        { status: 400 }
      );
    }

    // On Vercel, we can't remove env vars at runtime.
    // Return instructions for the user to remove it manually.
    return NextResponse.json({
      success: true,
      message: 'MFA verification successful. To complete disabling MFA on Vercel:',
      envVarInstruction: {
        steps: [
          '1. Go to your Vercel project Settings → Environment Variables',
          '2. Remove the ADMIN_TOTP_SECRET environment variable',
          '3. Redeploy the project for changes to take effect',
        ],
      },
      isEnvSetup: true,
    });
  } catch (error) {
    console.error('[MFA_DISABLE_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to disable MFA' },
      { status: 500 }
    );
  }
}
