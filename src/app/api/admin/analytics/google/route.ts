import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-auth';
import { db } from '@/lib/db';

/**
 * GET /api/admin/analytics/google
 *
 * Fetches real GA4 data using the Google Analytics Data API v1beta.
 * Requires the admin to first configure `ga_service_account_json` via
 * /api/admin/site-config — the JSON credentials downloaded from
 * Google Cloud Console → Service Accounts.
 *
 * Returns:
 *   {
 *     success: true,
 *     data: {
 *       property: string,
 *       range: { start, end, days },
 *       metrics: { totalUsers, newUsers, sessions, pageviews, bounceRate, avgSessionDuration },
 *       topPages: [{ path, views, avgTime }],
 *       topSources: [{ source, users, sessions }],
 *       deviceBreakdown: [{ device, users }],
 *       countryBreakdown: [{ country, users }],
 *       dailyTraffic: [{ date, users, sessions }]
 *     }
 *   }
 *
 * If service account is not configured, returns a friendly "not_configured"
 * response so the frontend can prompt the user to set it up.
 */
export async function GET(request: NextRequest) {
  const admin = requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const days = Math.min(parseInt(searchParams.get('days') || '30', 10), 365);

  try {
    // ── Fetch service account JSON from DB ─────────────────────────────────
    const saSetting = await db.siteSetting.findUnique({
      where: { key: 'ga_service_account_json' },
    });
    const propertySetting = await db.siteSetting.findUnique({
      where: { key: 'search_console_property_id' },
    });

    if (!saSetting || !saSetting.value) {
      return NextResponse.json({
        success: false,
        not_configured: true,
        error: 'Google Analytics service account not configured. Go to Settings → Google Analytics to add your service account JSON.',
      });
    }

    let serviceAccount: { client_email: string; private_key: string; project_id?: string };
    try {
      serviceAccount = JSON.parse(saSetting.value);
    } catch {
      return NextResponse.json({
        success: false,
        error: 'Stored service account JSON is invalid. Please re-upload.',
      }, { status: 500 });
    }

    // ── Generate JWT for Google OAuth2 ─────────────────────────────────────
    const now = Math.floor(Date.now() / 1000);
    const jwtHeader = { alg: 'RS256', typ: 'JWT' };
    const jwtPayload = {
      iss: serviceAccount.client_email,
      scope: 'https://www.googleapis.com/auth/analytics.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    };

    const enc = new TextEncoder();
    const headerB64 = base64Url(enc.encode(JSON.stringify(jwtHeader)));
    const payloadB64 = base64Url(enc.encode(JSON.stringify(jwtPayload)));
    const signingInput = `${headerB64}.${payloadB64}`;

    // Import the private key
    const privateKeyPem = serviceAccount.private_key
      .replace(/\\n/g, '\n')
      .replace('-----BEGIN PRIVATE KEY-----', '')
      .replace('-----END PRIVATE KEY-----', '')
      .replace(/\s/g, '');
    const privateKeyDer = Uint8Array.from(atob(privateKeyPem), c => c.charCodeAt(0));
    const cryptoKey = await crypto.subtle.importKey(
      'pkcs8',
      privateKeyDer,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, enc.encode(signingInput));
    const signatureB64 = base64Url(new Uint8Array(signature));
    const jwt = `${signingInput}.${signatureB64}`;

    // ── Exchange JWT for access token ──────────────────────────────────────
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });
    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error('[GA_TOKEN_ERROR]', errText);
      return NextResponse.json({
        success: false,
        error: 'Failed to authenticate with Google. Check service account credentials.',
      }, { status: 500 });
    }
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // ── Discover GA4 property ──────────────────────────────────────────────
    let propertyId = propertySetting?.value?.replace(/^sc-domain:/, '').replace(/^properties\//, '');

    if (!propertyId) {
      const listRes = await fetch('https://analyticsadmin.googleapis.com/v1beta/properties', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (listRes.ok) {
        const listData = await listRes.json();
        if (listData.properties && listData.properties.length > 0) {
          propertyId = listData.properties[0].name.replace('properties/', '');
        }
      }
    }

    if (!propertyId) {
      return NextResponse.json({
        success: false,
        not_configured: true,
        error: 'No GA4 property found. Make sure your service account has access to a GA4 property.',
      });
    }

    // ── Build date range ───────────────────────────────────────────────────
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    const start = fmt(startDate);
    const end = fmt(endDate);

    // ── Fetch metrics ──────────────────────────────────────────────────────
    const metricsRes = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRanges: [{ startDate: start, endDate: end }],
          metrics: [
            { name: 'totalUsers' },
            { name: 'newUsers' },
            { name: 'sessions' },
            { name: 'screenPageViews' },
            { name: 'bounceRate' },
            { name: 'averageSessionDuration' },
          ],
        }),
      }
    );
    let metrics = { totalUsers: 0, newUsers: 0, sessions: 0, pageviews: 0, bounceRate: 0, avgSessionDuration: 0 };
    if (metricsRes.ok) {
      const metricsData = await metricsRes.json();
      const row = metricsData.rows?.[0]?.metricValues;
      if (row) {
        metrics = {
          totalUsers: parseInt(row[0]?.value || '0', 10),
          newUsers: parseInt(row[1]?.value || '0', 10),
          sessions: parseInt(row[2]?.value || '0', 10),
          pageviews: parseInt(row[3]?.value || '0', 10),
          bounceRate: parseFloat(row[4]?.value || '0'),
          avgSessionDuration: parseFloat(row[5]?.value || '0'),
        };
      }
    }

    // ── Top pages ──────────────────────────────────────────────────────────
    const topPages = await runGaReport(accessToken, propertyId, start, end,
      [{ name: 'pagePath' }],
      [{ name: 'screenPageViews' }, { name: 'averageSessionDuration' }],
      'screenPageViews', 10
    ).then(rows => rows.map(r => ({
      path: r.dimensionValues[0]?.value || '/',
      views: parseInt(r.metricValues[0]?.value || '0', 10),
      avgTime: parseFloat(r.metricValues[1]?.value || '0'),
    }))).catch(() => []);

    // ── Top traffic sources ────────────────────────────────────────────────
    const topSources = await runGaReport(accessToken, propertyId, start, end,
      [{ name: 'sessionDefaultChannelGroup' }],
      [{ name: 'totalUsers' }, { name: 'sessions' }],
      'totalUsers', 10
    ).then(rows => rows.map(r => ({
      source: r.dimensionValues[0]?.value || 'Direct',
      users: parseInt(r.metricValues[0]?.value || '0', 10),
      sessions: parseInt(r.metricValues[1]?.value || '0', 10),
    }))).catch(() => []);

    // ── Device breakdown ───────────────────────────────────────────────────
    const deviceBreakdown = await runGaReport(accessToken, propertyId, start, end,
      [{ name: 'deviceCategory' }],
      [{ name: 'totalUsers' }],
      'totalUsers', 5
    ).then(rows => rows.map(r => ({
      device: r.dimensionValues[0]?.value || 'Unknown',
      users: parseInt(r.metricValues[0]?.value || '0', 10),
    }))).catch(() => []);

    // ── Country breakdown ──────────────────────────────────────────────────
    const countryBreakdown = await runGaReport(accessToken, propertyId, start, end,
      [{ name: 'country' }],
      [{ name: 'totalUsers' }],
      'totalUsers', 10
    ).then(rows => rows.map(r => ({
      country: r.dimensionValues[0]?.value || 'Unknown',
      users: parseInt(r.metricValues[0]?.value || '0', 10),
    }))).catch(() => []);

    // ── Daily traffic ──────────────────────────────────────────────────────
    const dailyRes = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRanges: [{ startDate: start, endDate: end }],
          dimensions: [{ name: 'date' }],
          metrics: [{ name: 'totalUsers' }, { name: 'sessions' }],
          orderBys: [{ dimension: { dimensionName: 'date' } }],
          limit: 400,
        }),
      }
    );
    const dailyTraffic: { date: string; users: number; sessions: number }[] = [];
    if (dailyRes.ok) {
      const dailyData = await dailyRes.json();
      for (const row of dailyData.rows || []) {
        const rawDate = row.dimensionValues[0]?.value || '';
        const isoDate = `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`;
        dailyTraffic.push({
          date: isoDate,
          users: parseInt(row.metricValues[0]?.value || '0', 10),
          sessions: parseInt(row.metricValues[1]?.value || '0', 10),
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        property: propertyId,
        range: { start, end, days },
        metrics,
        topPages,
        topSources,
        deviceBreakdown,
        countryBreakdown,
        dailyTraffic,
      },
    });
  } catch (error) {
    console.error('[GA_ANALYTICS_ERROR]', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: `Google Analytics fetch failed: ${message}` },
      { status: 500 }
    );
  }
}

// ── Helper: run a GA4 report ───────────────────────────────────────────────
async function runGaReport(
  accessToken: string,
  propertyId: string,
  startDate: string,
  endDate: string,
  dimensions: { name: string }[],
  metrics: { name: string }[],
  orderByMetric: string,
  limit: number
): Promise<any[]> {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dateRanges: [{ startDate, endDate }],
        dimensions,
        metrics,
        orderBys: [{ metric: { metricName: orderByMetric }, desc: true }],
        limit,
      }),
    }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.rows || [];
}

function base64Url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
