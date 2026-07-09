import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/api-auth';
import { createAuditLog } from '@/lib/audit-log';
import { getClientIp } from '@/lib/server-rate-limiter';

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

/**
 * Try to get the database client. Returns null if unavailable (Vercel serverless).
 */
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
    const db = await getDb();

    // ── Database available (local dev) ─────────────────────────────────────
    if (db) {
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
      const speakeasy = await import('speakeasy');
      const secret = speakeasy.generateSecret({
        name: `Paliwal Secure (${adminUser.email})`,
        issuer: 'Paliwal Secure',
        length: 32,
      });

      // Generate QR code
      const QRCode = await import('qrcode');
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
        manualEntry: (secret as any).manual_entry ?? secret.base32,
      });
    }

    // ── No database (Vercel/serverless) — use env vars ────────────────────
    if (ADMIN_TOTP_SECRET) {
      // MFA already configured via env var
      return NextResponse.json(
        { success: false, error: 'MFA is already enabled. Disable it first to set up again.' },
        { status: 400 }
      );
    }

    // Generate new TOTP secret for env-based setup
    const speakeasy = await import('speakeasy');
    const secret = speakeasy.generateSecret({
      name: `Paliwal Secure (${process.env.ADMIN_EMAIL || 'admin'})`,
      issuer: 'Paliwal Secure',
      length: 32,
    });

    const QRCode = await import('qrcode');
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url ?? '', {
      width: 256,
      margin: 2,
      color: { dark: '#1e293b', light: '#ffffff' },
    });

    // Create a short-lived setup token containing the secret
    // This allows the verify step to know the secret without database
    const jwt = await import('jsonwebtoken');
    const setupToken = jwt.sign(
      { setupStep: true, totpSecret: secret.base32, userId: user.userId },
      getMfaJwtSecret(),
      { expiresIn: '10m' }
    );

    return NextResponse.json({
      success: true,
      secret: secret.base32,
      qrCodeUrl,
      manualEntry: (secret as any).manual_entry ?? secret.base32,
      setupToken, // Client sends this back during verify
      isEnvSetup: true, // Flag for frontend to show env var instructions
    });
  } catch (error) {
    console.error('[MFA_SETUP_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate MFA setup' },
      { status: 500 }
    );
  }
}
