import { NextRequest, NextResponse } from 'next/server';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { getAuthUser } from '@/lib/api-auth';
import { db } from '@/lib/db';
import { createAuditLog } from '@/lib/audit-log';
import { getClientIp } from '@/lib/server-rate-limiter';

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const clientIp = getClientIp(request);
    const userAgent = request.headers.get('user-agent') ?? undefined;

    // Check if MFA is already enabled
    const adminUser = await db.adminUser.findUnique({ where: { id: user.userId } });
    if (!adminUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    if (adminUser.mfaEnabled) {
      return NextResponse.json(
        { success: false, error: 'MFA is already enabled. Disable it first to set up again.' },
        { status: 400 }
      );
    }

    // Generate TOTP secret
    const secret = speakeasy.generateSecret({
      name: `Paliwal Secure (${adminUser.email})`,
      issuer: 'Paliwal Secure',
      length: 32,
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url ?? '', {
      width: 256,
      margin: 2,
      color: { dark: '#1e293b', light: '#ffffff' },
    });

    // Store the secret temporarily (will be confirmed on verify)
    await db.adminUser.update({
      where: { id: user.userId },
      data: { totpSecret: secret.base32 },
    });

    // Audit log
    await createAuditLog({
      action: 'MFA_SETUP_INITIATED',
      entity: 'AdminUser',
      entityId: user.userId,
      details: { email: adminUser.email },
      userId: user.userId,
      userAgent,
      ipAddress: clientIp,
    });

    return NextResponse.json({
      success: true,
      secret: secret.base32,
      qrCodeUrl,
      manualEntry: secret.manual_entry ?? secret.base32,
    });
  } catch (error) {
    console.error('[MFA_SETUP_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate MFA setup' },
      { status: 500 }
    );
  }
}
