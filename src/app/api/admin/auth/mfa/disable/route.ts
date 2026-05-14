import { NextRequest, NextResponse } from 'next/server';
import speakeasy from 'speakeasy';
import { z } from 'zod';
import { getAuthUser } from '@/lib/api-auth';
import { db } from '@/lib/db';
import { comparePassword } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit-log';
import { getClientIp } from '@/lib/server-rate-limiter';
import { validateInput } from '@/lib/validation';

const mfaDisableSchema = z.object({
  password: z.string().min(1, 'Current password is required'),
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
    const validation = validateInput(mfaDisableSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.errors[0] },
        { status: 400 }
      );
    }

    const { password, token } = validation.data;

    // Get admin user
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

    // Audit log
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
  } catch (error) {
    console.error('[MFA_DISABLE_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to disable MFA' },
      { status: 500 }
    );
  }
}
