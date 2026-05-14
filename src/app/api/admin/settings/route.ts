import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAccessToken } from '@/lib/auth';
import { isIpAllowed } from '@/lib/ip-whitelist';
import { getClientIp } from '@/lib/server-rate-limiter';
import { createAuditLog } from '@/lib/audit-log';

// Helper to verify admin token
function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  try {
    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    if (!decoded || !['ADMIN', 'MODERATOR'].includes(decoded.role)) return null;
    return decoded;
  } catch {
    return null;
  }
}

// GET — Fetch all site settings (or specific key via ?key=xxx)
export async function GET(request: NextRequest) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (key) {
      const setting = await db.siteSetting.findUnique({ where: { key } });
      return NextResponse.json({
        success: true,
        setting: setting || null,
      });
    }

    const settings = await db.siteSetting.findMany({
      orderBy: { key: 'asc' },
    });

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT — Update or create a site setting
export async function PUT(request: NextRequest) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  // ── IP Whitelist check ──────────────────────────────────────────────────
  const clientIp = getClientIp(request);
  if (!isIpAllowed(clientIp)) {
    await createAuditLog({
      action: 'IP_BLOCKED',
      entity: 'SiteSetting',
      details: { ip: clientIp, endpoint: 'settings-update' },
      userId: admin.userId,
      ipAddress: clientIp,
    });
    return NextResponse.json(
      { success: false, error: 'Access denied from this IP address' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { key, value, description } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { success: false, error: 'Key and value are required' },
        { status: 400 }
      );
    }

    // Upsert the setting
    const setting = await db.siteSetting.upsert({
      where: { key },
      update: {
        value,
        description: description || undefined,
        updatedBy: admin.userId,
      },
      create: {
        key,
        value,
        description: description || undefined,
        updatedBy: admin.userId,
      },
    });

    // Create audit log
    await db.auditLog.create({
      data: {
        action: 'UPDATE',
        entity: 'SiteSetting',
        entityId: setting.id,
        details: JSON.stringify({ key, value }),
        userId: admin.userId,
      },
    });

    return NextResponse.json({
      success: true,
      setting,
    });
  } catch (error) {
    console.error('Error updating setting:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update setting' },
      { status: 500 }
    );
  }
}
