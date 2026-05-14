import { NextRequest, NextResponse } from 'next/server';
import speakeasy from 'speakeasy';
import { z } from 'zod';
import { getAuthUser } from '@/lib/api-auth';
import { db } from '@/lib/db';
import { createAuditLog } from '@/lib/audit-log';
import { getClientIp } from '@/lib/server-rate-limiter';
import { validateInput } from '@/lib/validation';

const mfaVerifySchema = z.object({
  token: z.string().length(6, 'TOTP code must be 6 digits').regex(/^\d+$/, 'Must be numeric'),
});

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

    const { token } = validation.data;

    // Get admin user
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
    const verified = speakeasy.totp.verify({
      secret: adminUser.totpSecret,
      encoding: 'base32',
      token,
      window: 2, // Allow 2 steps before/after for clock drift
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

    // Audit log
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
  } catch (error) {
    console.error('[MFA_VERIFY_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify MFA code' },
      { status: 500 }
    );
  }
}
