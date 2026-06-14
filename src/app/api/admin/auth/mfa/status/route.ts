import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/api-auth';

const ADMIN_TOTP_SECRET = process.env.ADMIN_TOTP_SECRET || '';

async function getDb() {
  try {
    const dbModule = await import('@/lib/db');
    return dbModule.db;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const db = await getDb();

    // ── Database available (local dev) ─────────────────────────────────────
    if (db) {
      const adminUser = await db.adminUser.findUnique({
        where: { id: authUser.userId },
        select: { mfaEnabled: true, totpSecret: true },
      });

      if (!adminUser) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        mfaEnabled: adminUser.mfaEnabled,
        totpSecret: adminUser.totpSecret ? 'exists' : null,
      });
    }

    // ── No database (Vercel/serverless) — use env vars ────────────────────
    const mfaEnabled = !!ADMIN_TOTP_SECRET;
    return NextResponse.json({
      success: true,
      mfaEnabled,
      totpSecret: mfaEnabled ? 'exists' : null,
      isEnvSetup: true,
    });
  } catch (error) {
    console.error('[MFA_STATUS_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
