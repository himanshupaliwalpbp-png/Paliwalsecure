// ═══════════════════════════════════════════════════════════════════════════════
// Data Pipeline API Route — IRDAI Industry Data
// ═══════════════════════════════════════════════════════════════════════════════
// GET  /api/data-pipeline?dataset=csr&insurer=Acko
// GET  /api/data-pipeline?dataset=penetration&year=2024
// GET  /api/data-pipeline?dataset=motor-trends
// GET  /api/data-pipeline?dataset=solvency&insurer=HDFC
// GET  /api/data-pipeline?dataset=medical-inflation
// GET  /api/data-pipeline?dataset=ombudsman
// GET  /api/data-pipeline?dataset=ev-insurance
// GET  /api/data-pipeline?dataset=claim-automation
// GET  /api/data-pipeline?dataset=protection-gap&category=health
// GET  /api/data-pipeline?dataset=global-benchmarks
// GET  /api/data-pipeline?dataset=trust-score&insurer=Star Health
// GET  /api/data-pipeline?dataset=macro-growth
// GET  /api/data-pipeline?dataset=premium-drift&category=health
// GET  /api/data-pipeline?dataset=coverage-comparison
// GET  /api/data-pipeline?dataset=consumer-protection
// GET  /api/data-pipeline?dataset=premium-alerts
// GET  /api/data-pipeline?dataset=status
// GET  /api/data-pipeline?dataset=all
//
// POST /api/data-pipeline  { action: 'refresh' }   ← Admin only
// POST /api/data-pipeline  { action: 'status' }    ← Detailed status
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  getCSRData,
  getTrustScore,
  getPenetrationData,
  getMotorTrends,
  getSolvencyData,
  getMedicalInflation,
  getOmbudsmanScripts,
  getEVInsuranceData,
  getClaimAutomationFramework,
  getProtectionGap,
  getGlobalBenchmarks,
  getClaimAutomationForQuery,
  getKeyInsightsSummary,
  getAllDatasets,
  getPipelineStatus,
  refreshAll,
  getPipelineMode,
  getMacroGrowthData,
  getPremiumDriftData,
  getCoverageComparison,
  getConsumerProtectionFeatures,
  getPremiumAlerts,
  getRenewalReminders,
} from '@/lib/data-pipeline';
import { apiRateLimiter, getClientIp } from '@/lib/server-rate-limiter';
import { requireAdmin } from '@/lib/api-auth';

// ═══════════════════════════════════════════════════════════════════════════════
// 1. ZOD VALIDATION SCHEMAS
// ═══════════════════════════════════════════════════════════════════════════════

/** Supported dataset identifiers */
const DATASET_VALUES = [
  'csr',
  'penetration',
  'motor-trends',
  'solvency',
  'medical-inflation',
  'ombudsman',
  'ev-insurance',
  'claim-automation',
  'protection-gap',
  'global-benchmarks',
  'trust-score',
  'macro-growth',
  'premium-drift',
  'coverage-comparison',
  'consumer-protection',
  'premium-alerts',
  'status',
  'all',
] as const;

/** GET query parameter schema */
const getQuerySchema = z.object({
  dataset: z.enum(DATASET_VALUES, {
    errorMap: () => ({
      message: `dataset must be one of: ${DATASET_VALUES.join(', ')}`,
    }),
  }),
  insurer: z.string().min(1).max(200).optional(),
  year: z
    .string()
    .regex(/^\d{4}$/, 'Year must be a 4-digit number')
    .optional(),
  category: z.string().max(100).optional(),
  query: z.string().min(1).max(500).optional(),
});

/** POST body schema */
const postBodySchema = z.object({
  action: z.enum(['refresh', 'status'], {
    errorMap: () => ({
      message: "action must be one of: 'refresh', 'status'",
    }),
  }),
});

// ═══════════════════════════════════════════════════════════════════════════════
// 2. RESPONSE HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/** Standard API response metadata */
interface ResponseMeta {
  source: string;
  lastUpdated: string;
  pipelineMode: string;
  cached: boolean;
  dataset?: string;
  [key: string]: unknown;
}

/** Structured success response */
function successResponse<T>(data: T, meta: ResponseMeta, status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      meta,
    },
    {
      status,
      headers: corsHeaders(),
    }
  );
}

/** Structured error response — never leaks internal details */
function errorResponse(
  message: string,
  status: number = 400,
  code?: string,
  details?: unknown
) {
  return NextResponse.json(
    {
      success: false,
      data: null,
      meta: {
        source: 'api',
        lastUpdated: new Date().toISOString(),
        pipelineMode: getPipelineMode(),
        cached: false,
      },
      error: message,
      ...(code ? { code } : {}),
      ...(details ? { details } : {}),
    },
    {
      status,
      headers: corsHeaders(),
    }
  );
}

/** CORS headers for API mode compatibility */
function corsHeaders(): HeadersInit {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  };
}

/** Build metadata from data source info */
function buildMeta(
  dataset: string,
  source: string = 'IRDAI Handbook 2025-26',
  lastUpdated: string = new Date().toISOString(),
  cached: boolean = true
): ResponseMeta {
  return {
    source,
    lastUpdated,
    pipelineMode: getPipelineMode(),
    cached,
    dataset,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. OPTIONS HANDLER (CORS Preflight)
// ═══════════════════════════════════════════════════════════════════════════════

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. GET HANDLER
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  try {
    // ── Rate limiting ────────────────────────────────────────────────────────
    const clientIp = getClientIp(request);
    const rateLimit = apiRateLimiter.check(clientIp, 30, 60 * 1000); // 30 req/min
    if (!rateLimit.allowed) {
      return errorResponse(
        'Rate limit exceeded. Please try again later.',
        429,
        'RATE_LIMITED',
        { retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000) }
      );
    }

    // ── Parse and validate query parameters ──────────────────────────────────
    const { searchParams } = new URL(request.url);
    const rawParams: Record<string, string | undefined> = {
      dataset: searchParams.get('dataset') ?? undefined,
      insurer: searchParams.get('insurer') ?? undefined,
      year: searchParams.get('year') ?? undefined,
      category: searchParams.get('category') ?? undefined,
      query: searchParams.get('query') ?? undefined,
    };

    const parseResult = getQuerySchema.safeParse(rawParams);
    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((e) => e.message).join('; ');
      return errorResponse(`Invalid query parameters: ${errors}`, 400, 'VALIDATION_ERROR');
    }

    const { dataset, insurer, year, category, query } = parseResult.data;

    // ── Route to dataset handler ─────────────────────────────────────────────
    switch (dataset) {
      // ── CSR Data ────────────────────────────────────────────────────────
      case 'csr': {
        const allCSR = await getCSRData();
        // Apply insurer filter at API level (pipeline cache may return unfiltered data)
        const data = insurer
          ? allCSR.filter((entry) => {
              const normalized = insurer.toLowerCase().trim();
              return (
                entry.insurer.toLowerCase().includes(normalized) ||
                normalized.includes(entry.insurer.toLowerCase().split(' ')[0])
              );
            })
          : allCSR;
        if (insurer && data.length === 0) {
          return errorResponse(
            `No CSR data found for insurer: "${insurer}"`,
            404,
            'NOT_FOUND'
          );
        }
        const source = data[0]?.source ?? 'IRDAI Handbook 2025-26';
        const lastUpdated = data[0]?.dataSource?.lastUpdated ?? new Date().toISOString();
        return successResponse(data, buildMeta('csr', source, lastUpdated));
      }

      // ── Trust Score ─────────────────────────────────────────────────────
      case 'trust-score': {
        if (!insurer) {
          return errorResponse(
            'The "insurer" query parameter is required for trust-score dataset',
            400,
            'MISSING_PARAM'
          );
        }
        const data = await getTrustScore(insurer);
        if (!data) {
          return errorResponse(
            `No trust score found for insurer: "${insurer}"`,
            404,
            'NOT_FOUND'
          );
        }
        return successResponse(
          data,
          buildMeta('trust-score', data.source, new Date().toISOString())
        );
      }

      // ── Penetration Data ────────────────────────────────────────────────
      case 'penetration': {
        const yearNum = year ? parseInt(year, 10) : undefined;
        const data = await getPenetrationData(yearNum);
        if (yearNum && data.length === 0) {
          return errorResponse(
            `No penetration data found for year: ${year}`,
            404,
            'NOT_FOUND'
          );
        }
        return successResponse(
          data,
          buildMeta('penetration', 'IRDAI Annual Report', new Date().toISOString())
        );
      }

      // ── Motor Premium Trends ────────────────────────────────────────────
      case 'motor-trends': {
        const data = await getMotorTrends();
        return successResponse(
          data,
          buildMeta('motor-trends', 'IRDAI Motor Premium Data', new Date().toISOString())
        );
      }

      // ── Solvency Data ──────────────────────────────────────────────────
      case 'solvency': {
        const allSolvency = await getSolvencyData();
        // Apply insurer filter at API level (pipeline cache may return unfiltered data)
        const data = insurer
          ? allSolvency.filter((entry) => {
              const normalized = insurer.toLowerCase().trim();
              return (
                entry.insurer.toLowerCase().includes(normalized) ||
                normalized.includes(entry.insurer.toLowerCase().split(' ')[0])
              );
            })
          : allSolvency;
        if (insurer && data.length === 0) {
          return errorResponse(
            `No solvency data found for insurer: "${insurer}"`,
            404,
            'NOT_FOUND'
          );
        }
        return successResponse(
          data,
          buildMeta('solvency', 'IRDAI Solvency Report', new Date().toISOString())
        );
      }

      // ── Medical Inflation ──────────────────────────────────────────────
      case 'medical-inflation': {
        const data = await getMedicalInflation();
        return successResponse(
          data,
          buildMeta(
            'medical-inflation',
            'IRDAI Medical Inflation Data',
            new Date().toISOString()
          )
        );
      }

      // ── Ombudsman Data ─────────────────────────────────────────────────
      case 'ombudsman': {
        const data = await getOmbudsmanScripts();
        return successResponse(
          data,
          buildMeta('ombudsman', 'IRDAI Ombudsman Report', new Date().toISOString())
        );
      }

      // ── EV Insurance ───────────────────────────────────────────────────
      case 'ev-insurance': {
        const data = await getEVInsuranceData();
        return successResponse(
          data,
          buildMeta('ev-insurance', 'IRDAI EV Insurance Data', new Date().toISOString())
        );
      }

      // ── Claim Automation Framework ─────────────────────────────────────
      case 'claim-automation': {
        let data;
        if (query) {
          data = await getClaimAutomationForQuery(query);
        } else {
          data = await getClaimAutomationFramework();
        }
        return successResponse(
          data,
          buildMeta(
            'claim-automation',
            'IRDAI FMU Claim Automation Guidelines',
            new Date().toISOString()
          )
        );
      }

      // ── Protection Gap ─────────────────────────────────────────────────
      case 'protection-gap': {
        const data = await getProtectionGap(category);
        if (category && data.length === 0) {
          return errorResponse(
            `No protection gap data found for category: "${category}"`,
            404,
            'NOT_FOUND'
          );
        }
        return successResponse(
          data,
          buildMeta(
            'protection-gap',
            'IRDAI Protection Gap Analysis',
            new Date().toISOString()
          )
        );
      }

      // ── Global Benchmarks ──────────────────────────────────────────────
      case 'global-benchmarks': {
        const data = await getGlobalBenchmarks();
        return successResponse(
          data,
          buildMeta(
            'global-benchmarks',
            'Swiss Re Sigma Report',
            new Date().toISOString()
          )
        );
      }

      // ── Macro Growth Data ───────────────────────────────────────────────
      case 'macro-growth': {
        const data = await getMacroGrowthData();
        return successResponse(
          data,
          buildMeta('macro-growth', 'IRDAI Annual Report / Economic Survey / Swiss Re', new Date().toISOString())
        );
      }

      // ── Premium Drift Data ───────────────────────────────────────────────
      case 'premium-drift': {
        const data = await getPremiumDriftData(category);
        if (category && data.length === 0) {
          return errorResponse(
            `No premium drift data found for category: "${category}"`,
            404,
            'NOT_FOUND'
          );
        }
        return successResponse(
          data,
          buildMeta('premium-drift', 'IRDAI Premium Tracker / Industry Reports', new Date().toISOString())
        );
      }

      // ── Coverage Comparison Data ──────────────────────────────────────────
      case 'coverage-comparison': {
        const data = await getCoverageComparison();
        return successResponse(
          data,
          buildMeta('coverage-comparison', 'IRDAI Handbook / Industry Premium Analysis', new Date().toISOString())
        );
      }

      // ── Consumer Protection Features ──────────────────────────────────────
      case 'consumer-protection': {
        const data = await getConsumerProtectionFeatures();
        return successResponse(
          data,
          buildMeta('consumer-protection', 'IRDAI / BimaBharosa Portal / Insurance Ombudsman', new Date().toISOString())
        );
      }

      // ── Premium Alerts ───────────────────────────────────────────────────
      case 'premium-alerts': {
        const data = getPremiumAlerts();
        const reminders = getRenewalReminders();
        return successResponse(
          { alerts: data, renewalReminders: reminders },
          buildMeta('premium-alerts', 'IRDAI Premium Tracker', new Date().toISOString())
        );
      }

      // ── Pipeline Status ────────────────────────────────────────────────
      case 'status': {
        const status = await getPipelineStatus();
        return successResponse(
          status,
          buildMeta('status', 'Pipeline Health Check', new Date().toISOString(), false)
        );
      }

      // ── All Datasets ───────────────────────────────────────────────────
      case 'all': {
        const [allData, insights] = await Promise.all([
          getAllDatasets(),
          getKeyInsightsSummary(),
        ]);
        return successResponse(
          { datasets: allData, insights },
          buildMeta('all', 'IRDAI Complete Dataset', new Date().toISOString())
        );
      }

      default: {
        // Exhaustive check — this should never be reached due to Zod validation
        const _exhaustive: never = dataset;
        return errorResponse(`Unknown dataset: ${_exhaustive}`, 400, 'UNKNOWN_DATASET');
      }
    }
  } catch (err) {
    console.error('[DATA_PIPELINE_API_ERROR]', err);
    return errorResponse(
      'An unexpected error occurred while fetching data. Please try again.',
      422,
      'INTERNAL_PIPELINE_ERROR'
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. POST HANDLER
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  try {
    // ── Rate limiting ────────────────────────────────────────────────────────
    const clientIp = getClientIp(request);
    const rateLimit = apiRateLimiter.check(clientIp, 10, 60 * 1000); // 10 req/min for POST
    if (!rateLimit.allowed) {
      return errorResponse(
        'Rate limit exceeded. Please try again later.',
        429,
        'RATE_LIMITED',
        { retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000) }
      );
    }

    // ── Parse and validate body ──────────────────────────────────────────────
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse('Invalid JSON body', 400, 'INVALID_JSON');
    }

    const parseResult = postBodySchema.safeParse(body);
    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((e) => e.message).join('; ');
      return errorResponse(`Invalid request body: ${errors}`, 400, 'VALIDATION_ERROR');
    }

    const { action } = parseResult.data;

    // ── Route by action ──────────────────────────────────────────────────────
    switch (action) {
      // ── Refresh: Admin-only cache invalidation ────────────────────────
      case 'refresh': {
        const user = requireAdmin(request);
        if (!user) {
          return errorResponse(
            'Admin authentication required for cache refresh',
            401,
            'UNAUTHORIZED'
          );
        }

        const statusBefore = await getPipelineStatus();
        refreshAll();

        return successResponse(
          {
            message:
              'Pipeline cache refreshed successfully. All datasets will be re-fetched on next access.',
            refreshedBy: user.email,
            previousRefresh: statusBefore.lastRefresh,
            refreshedAt: new Date().toISOString(),
          },
          buildMeta('refresh', 'Admin Action', new Date().toISOString(), false)
        );
      }

      // ── Status: Detailed pipeline health ──────────────────────────────
      case 'status': {
        const status = await getPipelineStatus();
        return successResponse(
          status,
          buildMeta('status', 'Pipeline Health Check', new Date().toISOString(), false)
        );
      }

      default: {
        // Exhaustive check
        const _exhaustive: never = action;
        return errorResponse(`Unknown action: ${_exhaustive}`, 400, 'UNKNOWN_ACTION');
      }
    }
  } catch (err) {
    console.error('[DATA_PIPELINE_POST_ERROR]', err);
    return errorResponse(
      'An unexpected error occurred. Please try again.',
      422,
      'INTERNAL_PIPELINE_ERROR'
    );
  }
}
