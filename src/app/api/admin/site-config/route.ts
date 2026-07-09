import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-auth';
import { db } from '@/lib/db';

/**
 * GET /api/admin/site-config
 *   Returns all site settings (key → value)
 *
 * POST /api/admin/site-config
 *   Body: { key, value, description? }
 *   Upserts a single setting. Admin-only.
 *
 * Settings managed here include:
 *   - ga_measurement_id          (e.g. "G-TKQ9X6G5HX")
 *   - google_site_verification   (e.g. "google8fc09a8ee177a7d9")
 *   - gtm_container_id           (e.g. "GTM-P47L386Z")
 *   - ga_service_account_json    (JSON credentials for GA4 Data API — encrypted at rest)
 *   - search_console_property_id (e.g. "sc-domain:paliwalsecure.in")
 */
export async function GET(request: NextRequest) {
  const admin = requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const settings = await db.siteSetting.findMany({
      orderBy: { key: 'asc' },
    });

    // Return as a key→value map for easy frontend consumption
    const config: Record<string, { value: string; description?: string; updatedAt: string }> = {};
    for (const s of settings) {
      config[s.key] = {
        value: s.value,
        description: s.description ?? undefined,
        updatedAt: s.updatedAt.toISOString(),
      };
    }

    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error('[SITE_CONFIG_GET_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch site config' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const admin = requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { key, value, description } = body as { key: string; value: string; description?: string };

    if (!key || typeof key !== 'string' || !key.trim()) {
      return NextResponse.json({ success: false, error: 'Setting key is required' }, { status: 400 });
    }
    if (value === undefined || value === null || typeof value !== 'string') {
      return NextResponse.json({ success: false, error: 'Setting value is required' }, { status: 400 });
    }

    // ── Allowlist of editable keys (prevent arbitrary key injection) ────────
    const ALLOWED_KEYS = [
      'ga_measurement_id',
      'google_site_verification',
      'gtm_container_id',
      'ga_service_account_json',
      'search_console_property_id',
      'site_name',
      'contact_phone',
      'contact_email',
      'whatsapp_number',
    ];
    if (!ALLOWED_KEYS.includes(key)) {
      return NextResponse.json(
        { success: false, error: `Setting key "${key}" is not allowed. Allowed: ${ALLOWED_KEYS.join(', ')}` },
        { status: 400 }
      );
    }

    // ── Basic format validation ────────────────────────────────────────────
    if (key === 'ga_measurement_id' && value && !/^G-[A-Z0-9]{6,}$/.test(value)) {
      return NextResponse.json(
        { success: false, error: 'GA4 Measurement ID must be in format G-XXXXXXXXXX' },
        { status: 400 }
      );
    }
    if (key === 'google_site_verification' && value && !/^google[a-z0-9]{10,}$/i.test(value)) {
      return NextResponse.json(
        { success: false, error: 'Google verification code must look like googleXXXXXXXXXXXX' },
        { status: 400 }
      );
    }
    if (key === 'gtm_container_id' && value && !/^GTM-[A-Z0-9]{6,}$/.test(value)) {
      return NextResponse.json(
        { success: false, error: 'GTM Container ID must be in format GTM-XXXXXXX' },
        { status: 400 }
      );
    }
    if (key === 'ga_service_account_json' && value) {
      // Validate JSON structure
      try {
        const parsed = JSON.parse(value);
        if (!parsed.client_email || !parsed.private_key) {
          return NextResponse.json(
            { success: false, error: 'Service account JSON must contain client_email and private_key' },
            { status: 400 }
          );
        }
      } catch {
        return NextResponse.json(
          { success: false, error: 'Service account value is not valid JSON' },
          { status: 400 }
        );
      }
    }

    // ── Upsert setting ─────────────────────────────────────────────────────
    const updated = await db.siteSetting.upsert({
      where: { key },
      update: {
        value,
        description: description ?? undefined,
        updatedBy: admin.userId,
      },
      create: {
        key,
        value,
        description: description ?? undefined,
        updatedBy: admin.userId,
      },
    });

    // ── Audit log ──────────────────────────────────────────────────────────
    try {
      await db.auditLog.create({
        data: {
          action: 'UPDATE',
          entity: 'SiteSetting',
          entityId: updated.id,
          details: JSON.stringify({ key, valuePreview: value.slice(0, 50) + (value.length > 50 ? '...' : '') }),
          userId: admin.userId,
          userAgent: request.headers.get('user-agent') ?? undefined,
          ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown',
        },
      });
    } catch { /* non-fatal */ }

    return NextResponse.json({
      success: true,
      setting: {
        key: updated.key,
        value: updated.value,
        description: updated.description,
        updatedAt: updated.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('[SITE_CONFIG_POST_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save site config' },
      { status: 500 }
    );
  }
}
