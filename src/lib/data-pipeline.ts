// ═══════════════════════════════════════════════════════════════════════════════
// Dynamic Data Pipeline — IRDAI Industry Data
// ═══════════════════════════════════════════════════════════════════════════════
// Mode 1: Scraper (GitHub Actions) → reads from data/ JSON files
// Mode 2: API (ENV-based) → fetches from configurable HTTP endpoints
// Both modes: 12-hour cache, stale-while-revalidate, static fallback
//
// Architecture:
//   Scraper Mode ──┐                    ┌── API Mode
//                  ├──→ Cache Layer ────┤
//                  │    (12h TTL, SWR)   │
//                  └──→ Data Merging ────┘
//                       (static fallback)
//                              │
//                   Exported Functions
// ═══════════════════════════════════════════════════════════════════════════════

import {
  CSR_ICR_DATA,
  PENETRATION_DATA,
  MOTOR_PREMIUM_TRENDS,
  CLAIM_AUTOMATION_FRAMEWORK,
  PROTECTION_GAP_DATA,
  OMBUDSMAN_DATA,
  INFRA_ASSETS_INSURED,
  MEDICAL_INFLATION_DATA,
  GLOBAL_NON_LIFE_BENCHMARKS,
  SOLVENCY_DATA,
  EV_INSURANCE_DATA,
  MACRO_GROWTH_DATA,
  PREMIUM_DRIFT_DATA,
  COVERAGE_COMPARISON_DATA,
  CONSUMER_PROTECTION_FEATURES,
  PREMIUM_ALERTS,
  RENEWAL_REMINDER_STAGES,
  MACRO_GROWTH_KEY_INSIGHTS,
  PREMIUM_DRIFT_KEY_INSIGHTS,
  PIPELINE_CONFIG,
  classifyCSR,
  type CSRICREntry,
  type PenetrationData,
  type MotorPremiumTrend,
  type ClaimAutomationFramework,
  type ProtectionGapData,
  type OmbudsmanData,
  type MedicalInflationData,
  type GlobalBenchmarkData,
  type SolvencyData,
  type EVInsuranceData,
  type InfraAssetData,
  type MacroGrowthData,
  type PremiumDriftEntry,
  type CoverageComparison,
  type ConsumerProtectionFeature,
  type PremiumAlert,
  type RenewalReminder,
  type DataSourceMeta,
  type TrustClassification,
} from '@/data/irdai-datasets';

// ═══════════════════════════════════════════════════════════════════════════════
// 1. CACHE INFRASTRUCTURE
// ═══════════════════════════════════════════════════════════════════════════════

/** Cache entry structure with TTL and metadata */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  source: 'static' | 'scraper' | 'api';
  isRevalidating: boolean;
}

/** In-memory cache store — namespaced keys */
const cache = new Map<string, CacheEntry<unknown>>();

/** Pipeline metrics for status reporting */
interface PipelineMetrics {
  totalRequests: number;
  cacheHits: number;
  apiErrors: number;
  staticFallbackCount: number;
  scraperFallbackCount: number;
  lastGlobalRefresh: string;
}

const metrics: PipelineMetrics = {
  totalRequests: 0,
  cacheHits: 0,
  apiErrors: 0,
  staticFallbackCount: 0,
  scraperFallbackCount: 0,
  lastGlobalRefresh: new Date().toISOString(),
};

// ═══════════════════════════════════════════════════════════════════════════════
// 2. PIPELINE STATUS INTERFACE
// ═══════════════════════════════════════════════════════════════════════════════

/** Per-dataset freshness information */
interface DataFreshnessEntry {
  lastUpdated: string;
  source: string;
  isStale: boolean;
}

/** Full pipeline status response */
export interface PipelineStatus {
  mode: 'scraper' | 'api';
  lastRefresh: string;
  nextRefresh: string;
  dataFreshness: {
    csr: DataFreshnessEntry;
    penetration: DataFreshnessEntry;
    motor: DataFreshnessEntry;
    solvency: DataFreshnessEntry;
    medicalInflation: DataFreshnessEntry;
    ombudsman: DataFreshnessEntry;
    evInsurance: DataFreshnessEntry;
    claimAutomation: DataFreshnessEntry;
    protectionGap: DataFreshnessEntry;
    globalBenchmarks: DataFreshnessEntry;
  };
  cacheHitRate: number;
  totalRequests: number;
  apiErrors: number;
  staticFallbackCount: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. TRUST SCORE RESULT
// ═══════════════════════════════════════════════════════════════════════════════

/** Trust score lookup result with Hinglish explanation */
export interface TrustScoreResult {
  csr: number;
  source: string;
  classification: TrustClassification;
  hinglishExplanation: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. PIPELINE MODE DETECTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Returns the current pipeline mode based on the `DATA_PIPELINE_MODE` environment variable.
 * Defaults to 'scraper' mode if not set.
 *
 * - `'scraper'` — Reads from local JSON files placed by GitHub Actions
 * - `'api'` — Fetches from configurable HTTP endpoints via env vars
 */
export function getPipelineMode(): 'scraper' | 'api' {
  const mode = process.env.DATA_PIPELINE_MODE?.toLowerCase().trim();
  if (mode === 'api') return 'api';
  return 'scraper'; // default
}

/**
 * Returns the configured TTL in milliseconds.
 * Default: 12 hours (43200000ms), configurable via `DATA_PIPELINE_TTL_MS` env.
 */
function getConfiguredTTL(): number {
  const envTTL = process.env.DATA_PIPELINE_TTL_MS;
  if (envTTL) {
    const parsed = parseInt(envTTL, 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  return PIPELINE_CONFIG.refreshIntervalMs; // 43200000 = 12 hours
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. GENERIC CACHED DATA FETCHER (Stale-While-Revalidate)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generic cached data fetcher with stale-while-revalidate semantics.
 *
 * - If cache is fresh (within TTL), return cached data immediately
 * - If cache is stale but exists, return stale data AND trigger background refresh
 * - If cache is empty, fetch fresh data and cache it
 * - On fetch failure, fall back to static data from irdai-datasets.ts
 *
 * @param key - Namespaced cache key (e.g., 'pipeline:csr')
 * @param fetcher - Async function that fetches fresh data
 * @param ttlMs - Optional TTL override in milliseconds
 * @returns Cached or freshly fetched data
 */
async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs?: number
): Promise<T> {
  metrics.totalRequests++;
  const ttl = ttlMs ?? getConfiguredTTL();
  const now = Date.now();

  const cached = cache.get(key) as CacheEntry<T> | undefined;

  // ── Cache HIT: Fresh data available ──
  if (cached && (now - cached.timestamp) < ttl) {
    metrics.cacheHits++;
    return cached.data;
  }

  // ── Cache STALE: Return stale data, trigger background refresh ──
  if (cached && !cached.isRevalidating) {
    // Mark as revalidating to prevent duplicate background refreshes
    cached.isRevalidating = true;

    // Return stale data immediately (stale-while-revalidate)
    // Trigger background refresh (fire-and-forget with error handling)
    fetcher()
      .then((freshData) => {
        cache.set(key, {
          data: freshData,
          timestamp: Date.now(),
          ttl,
          source: getPipelineMode() === 'api' ? 'api' : 'scraper',
          isRevalidating: false,
        });
      })
      .catch((err) => {
        console.error(`[data-pipeline] Background refresh failed for ${key}:`, err);
        cached.isRevalidating = false;
      });

    metrics.cacheHits++; // Stale hit still counts as cache hit
    return cached.data;
  }

  // ── Cache MISS: Need to fetch fresh data ──
  try {
    const freshData = await fetcher();
    cache.set(key, {
      data: freshData,
      timestamp: Date.now(),
      ttl,
      source: getPipelineMode() === 'api' ? 'api' : 'scraper',
      isRevalidating: false,
    });
    return freshData;
  } catch (err) {
    console.error(`[data-pipeline] Fetch failed for ${key}, using static fallback:`, err);
    metrics.staticFallbackCount++;
    if (getPipelineMode() === 'api') metrics.apiErrors++;

    // Return stale data if available, otherwise the fetcher should provide static fallback
    if (cached) return cached.data;
    throw err; // Let the caller provide static fallback
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. SCRAPER MODE: Read from local JSON files
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Attempt to read data from local JSON file placed by GitHub Actions scraper.
 * Falls back to static data if file doesn't exist or is unreadable.
 *
 * @param filePath - Path to the JSON file relative to project root
 * @param staticFallback - Static data to use if file read fails
 */
async function readScraperData<T>(filePath: string, staticFallback: T): Promise<T> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const fullPath = path.join(process.cwd(), filePath);

    try {
      await fs.access(fullPath);
    } catch {
      // File doesn't exist — use static fallback
      metrics.scraperFallbackCount++;
      return staticFallback;
    }

    const fileContent = await fs.readFile(fullPath, 'utf-8');
    const parsed = JSON.parse(fileContent) as T;

    // Check file modification time for freshness
    const stat = await fs.stat(fullPath);
    const fileAge = Date.now() - stat.mtimeMs;
    if (fileAge > getConfiguredTTL() * 2) {
      // File is very stale (>24h), log a warning but still use it
      console.warn(
        `[data-pipeline] Scraper file ${filePath} is ${(fileAge / 3600000).toFixed(1)}h old. Consider running the scraper workflow.`
      );
    }

    return parsed;
  } catch (err) {
    console.error(`[data-pipeline] Failed to read scraper file ${filePath}:`, err);
    metrics.scraperFallbackCount++;
    return staticFallback;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. API MODE: Fetch from HTTP endpoints
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Attempt to fetch data from the configured API endpoint.
 * Falls back to static data if the request fails.
 *
 * @param endpoint - API endpoint path (appended to base URL)
 * @param staticFallback - Static data to use if API fails
 */
async function fetchApiData<T>(endpoint: string, staticFallback: T): Promise<T> {
  const baseUrl = process.env.DATA_API_BASE_URL || 'https://api.irdai.gov.in';
  const apiKey = process.env.DATA_API_KEY || '';
  const timeoutMs = parseInt(process.env.DATA_API_TIMEOUT_MS || '10000', 10);

  const url = `${baseUrl}${endpoint}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}: ${response.statusText}`);
    }

    const data = (await response.json()) as T;
    return data;
  } catch (err) {
    console.error(`[data-pipeline] API fetch failed for ${url}:`, err);
    metrics.apiErrors++;
    metrics.staticFallbackCount++;
    return staticFallback;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 8. DATA ACCESS FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Returns CSR (Claim Settlement Ratio) and ICR (Incurred Claims Ratio) data.
 * Optionally filtered by insurer name (partial match supported).
 *
 * @param insurer - Optional insurer name to filter by (case-insensitive partial match)
 * @returns Array of CSR/ICR entries matching the filter, or all entries
 */
export async function getCSRData(insurer?: string): Promise<CSRICREntry[]> {
  return getCachedData<CSRICREntry[]>(
    'pipeline:csr',
    async () => {
      const mode = getPipelineMode();
      let data: CSRICREntry[];

      if (mode === 'api') {
        const endpoint = insurer ? `/v1/csr-icr?insurer=${encodeURIComponent(insurer)}` : '/v1/csr-icr';
        data = await fetchApiData<CSRICREntry[]>(endpoint, CSR_ICR_DATA);
      } else {
        data = await readScraperData<CSRICREntry[]>('data/scraper/csr-icr.json', CSR_ICR_DATA);
      }

      // Apply insurer filter if provided
      if (insurer) {
        const normalizedInput = insurer.toLowerCase().trim();
        return data.filter(
          (entry) =>
            entry.insurer.toLowerCase().includes(normalizedInput) ||
            normalizedInput.includes(entry.insurer.toLowerCase().split(' ')[0])
        );
      }

      return data;
    }
  ).catch(() => {
    metrics.staticFallbackCount++;
    if (insurer) {
      const normalizedInput = insurer.toLowerCase().trim();
      return CSR_ICR_DATA.filter(
        (entry) =>
          entry.insurer.toLowerCase().includes(normalizedInput) ||
          normalizedInput.includes(entry.insurer.toLowerCase().split(' ')[0])
      );
    }
    return CSR_ICR_DATA;
  });
}

/**
 * Returns trust score for a specific insurer with Hinglish explanation.
 * Uses CSR data to classify the insurer as Best, Good, or Needs Improvement.
 *
 * Matches the user's snippet format:
 * ```typescript
 * { csr: 99.91, source: 'IRDAI HANDBOOK 2025-26', classification: 'Best' }
 * ```
 *
 * @param insurer - Insurer name (partial match supported)
 * @returns Trust score result with CSR, source, classification, and Hinglish explanation
 */
export async function getTrustScore(insurer: string): Promise<TrustScoreResult | null> {
  const data = await getCSRData(insurer);
  const entry = data?.[0];

  if (!entry) return null;

  const classification = classifyCSR(entry.csr);

  // Generate Hinglish explanation based on classification
  let hinglishExplanation: string;
  if (classification === 'Best') {
    hinglishExplanation = `${entry.insurer} ka CSR ${entry.csr}% hai — yeh BEST category mein aata hai (>97%). Iska matlab hai ki 100 mein se ${Math.round(entry.csr)} claims settle ho jaate hain. Bahut reliable insurer hai!`;
  } else if (classification === 'Good') {
    hinglishExplanation = `${entry.insurer} ka CSR ${entry.csr}% hai — yeh GOOD category mein aata hai (90-97%). Claims mostly settle ho jaate hain, lekin Best walo se thoda kam. Decent choice hai.`;
  } else {
    hinglishExplanation = `${entry.insurer} ka CSR sirf ${entry.csr}% hai — yeh NEEDS IMPROVEMENT category mein aata hai (<90%). Iska matlab hai ki 10 mein se 1+ claim reject ho sakta hai. Dhyan se sochein before choosing.`;
  }

  return {
    csr: entry.csr,
    source: entry.source,
    classification,
    hinglishExplanation,
  };
}

/**
 * Returns insurance penetration data for India.
 * Optionally filtered by year.
 *
 * @param year - Optional year to filter by (e.g., 2025)
 * @returns Array of penetration data entries, or a single entry for the specified year
 */
export async function getPenetrationData(year?: number): Promise<PenetrationData[]> {
  return getCachedData<PenetrationData[]>(
    'pipeline:penetration',
    async () => {
      const mode = getPipelineMode();
      let data: PenetrationData[];

      if (mode === 'api') {
        const endpoint = year ? `/v1/penetration?year=${year}` : '/v1/penetration';
        data = await fetchApiData<PenetrationData[]>(endpoint, PENETRATION_DATA);
      } else {
        data = await readScraperData<PenetrationData[]>('data/scraper/penetration.json', PENETRATION_DATA);
      }

      if (year) {
        return data.filter((entry) => entry.year === year);
      }

      return data;
    }
  ).catch(() => {
    metrics.staticFallbackCount++;
    if (year) return PENETRATION_DATA.filter((e) => e.year === year);
    return PENETRATION_DATA;
  });
}

/**
 * Returns Third-Party (TP) and Own Damage (OD) motor premium trends.
 * Covers car, bike, commercial, and EV segments.
 */
export async function getMotorTrends(): Promise<MotorPremiumTrend[]> {
  return getCachedData<MotorPremiumTrend[]>(
    'pipeline:motor',
    async () => {
      const mode = getPipelineMode();
      if (mode === 'api') {
        return fetchApiData<MotorPremiumTrend[]>('/v1/motor-premium-trends', MOTOR_PREMIUM_TRENDS);
      }
      return readScraperData<MotorPremiumTrend[]>('data/scraper/motor-premium.json', MOTOR_PREMIUM_TRENDS);
    }
  ).catch(() => {
    metrics.staticFallbackCount++;
    return MOTOR_PREMIUM_TRENDS;
  });
}

/**
 * Returns solvency ratio data for insurers.
 * Optionally filtered by insurer name (partial match).
 *
 * @param insurer - Optional insurer name to filter by
 */
export async function getSolvencyData(insurer?: string): Promise<SolvencyData[]> {
  return getCachedData<SolvencyData[]>(
    'pipeline:solvency',
    async () => {
      const mode = getPipelineMode();
      let data: SolvencyData[];

      if (mode === 'api') {
        const endpoint = insurer ? `/v1/solvency?insurer=${encodeURIComponent(insurer)}` : '/v1/solvency';
        data = await fetchApiData<SolvencyData[]>(endpoint, SOLVENCY_DATA);
      } else {
        data = await readScraperData<SolvencyData[]>('data/scraper/solvency.json', SOLVENCY_DATA);
      }

      if (insurer) {
        const normalizedInput = insurer.toLowerCase().trim();
        return data.filter(
          (entry) =>
            entry.insurer.toLowerCase().includes(normalizedInput) ||
            normalizedInput.includes(entry.insurer.toLowerCase().split(' ')[0])
        );
      }

      return data;
    }
  ).catch(() => {
    metrics.staticFallbackCount++;
    if (insurer) {
      const normalizedInput = insurer.toLowerCase().trim();
      return SOLVENCY_DATA.filter(
        (entry) =>
          entry.insurer.toLowerCase().includes(normalizedInput) ||
          normalizedInput.includes(entry.insurer.toLowerCase().split(' ')[0])
      );
    }
    return SOLVENCY_DATA;
  });
}

/**
 * Returns the latest medical inflation data with premium impact analysis.
 * Medical inflation is the key driver of health insurance premium increases.
 *
 * @returns The most recent medical inflation entry with rate, drivers, and premium impact
 */
export async function getMedicalInflation(): Promise<MedicalInflationData> {
  const allData = await getCachedData<MedicalInflationData[]>(
    'pipeline:medical-inflation',
    async () => {
      const mode = getPipelineMode();
      if (mode === 'api') {
        return fetchApiData<MedicalInflationData[]>('/v1/medical-inflation', MEDICAL_INFLATION_DATA);
      }
      return readScraperData<MedicalInflationData[]>('data/scraper/medical-inflation.json', MEDICAL_INFLATION_DATA);
    }
  ).catch(() => {
    metrics.staticFallbackCount++;
    return MEDICAL_INFLATION_DATA;
  });

  // Return the most recent year's data
  const sorted = [...allData].sort((a, b) => b.year - a.year);
  return sorted[0] ?? MEDICAL_INFLATION_DATA[MEDICAL_INFLATION_DATA.length - 1];
}

/**
 * Returns Ombudsman dispute resolution scripts for chatbot use.
 * These scripts help the chatbot guide users through complaint/escalation processes.
 *
 * @returns Array of Ombudsman data with dispute resolution scripts
 */
export async function getOmbudsmanScripts(): Promise<OmbudsmanData[]> {
  return getCachedData<OmbudsmanData[]>(
    'pipeline:ombudsman',
    async () => {
      const mode = getPipelineMode();
      if (mode === 'api') {
        return fetchApiData<OmbudsmanData[]>('/v1/ombudsman', OMBUDSMAN_DATA);
      }
      return readScraperData<OmbudsmanData[]>('data/scraper/ombudsman.json', OMBUDSMAN_DATA);
    }
  ).catch(() => {
    metrics.staticFallbackCount++;
    return OMBUDSMAN_DATA;
  });
}

/**
 * Returns the IRDAI FMU (Fraud Monitoring Unit) claim automation framework.
 * These guidelines (effective 1 April 2026) define how claims should be processed
 * and what the chatbot should inform users about.
 *
 * @returns Array of claim automation provisions with chatbot implications
 */
export async function getClaimAutomationFramework(): Promise<ClaimAutomationFramework[]> {
  return getCachedData<ClaimAutomationFramework[]>(
    'pipeline:claim-automation',
    async () => {
      const mode = getPipelineMode();
      if (mode === 'api') {
        return fetchApiData<ClaimAutomationFramework[]>('/v1/claim-automation', CLAIM_AUTOMATION_FRAMEWORK);
      }
      return readScraperData<ClaimAutomationFramework[]>('data/scraper/claim-automation.json', CLAIM_AUTOMATION_FRAMEWORK);
    }
  ).catch(() => {
    metrics.staticFallbackCount++;
    return CLAIM_AUTOMATION_FRAMEWORK;
  });
}

/**
 * Returns EV-specific insurance data including premium comparisons with ICE vehicles,
 * battery coverage claims, and adoption trends.
 */
export async function getEVInsuranceData(): Promise<EVInsuranceData[]> {
  return getCachedData<EVInsuranceData[]>(
    'pipeline:ev-insurance',
    async () => {
      const mode = getPipelineMode();
      if (mode === 'api') {
        return fetchApiData<EVInsuranceData[]>('/v1/ev-insurance', EV_INSURANCE_DATA);
      }
      return readScraperData<EVInsuranceData[]>('data/scraper/ev-insurance.json', EV_INSURANCE_DATA);
    }
  ).catch(() => {
    metrics.staticFallbackCount++;
    return EV_INSURANCE_DATA;
  });
}

/**
 * Returns protection gap analysis data showing the gap between insured and uninsured
 * populations across health, life, motor, and overall categories.
 *
 * @param category - Optional category filter: 'health', 'life', 'motor', or 'overall'
 */
export async function getProtectionGap(category?: string): Promise<ProtectionGapData[]> {
  return getCachedData<ProtectionGapData[]>(
    'pipeline:protection-gap',
    async () => {
      const mode = getPipelineMode();
      let data: ProtectionGapData[];

      if (mode === 'api') {
        const endpoint = category ? `/v1/protection-gap?category=${encodeURIComponent(category)}` : '/v1/protection-gap';
        data = await fetchApiData<ProtectionGapData[]>(endpoint, PROTECTION_GAP_DATA);
      } else {
        data = await readScraperData<ProtectionGapData[]>('data/scraper/protection-gap.json', PROTECTION_GAP_DATA);
      }

      if (category) {
        return data.filter((entry) => entry.category === category);
      }

      return data;
    }
  ).catch(() => {
    metrics.staticFallbackCount++;
    if (category) return PROTECTION_GAP_DATA.filter((e) => e.category === category);
    return PROTECTION_GAP_DATA;
  });
}

/**
 * Returns global benchmark data comparing India's insurance penetration
 * with other countries. Data sourced from Swiss Re Sigma Reports.
 */
export async function getGlobalBenchmarks(): Promise<GlobalBenchmarkData[]> {
  return getCachedData<GlobalBenchmarkData[]>(
    'pipeline:global-benchmarks',
    async () => {
      const mode = getPipelineMode();
      if (mode === 'api') {
        return fetchApiData<GlobalBenchmarkData[]>('/v1/global-benchmarks', GLOBAL_NON_LIFE_BENCHMARKS);
      }
      return readScraperData<GlobalBenchmarkData[]>('data/scraper/global-benchmarks.json', GLOBAL_NON_LIFE_BENCHMARKS);
    }
  ).catch(() => {
    metrics.staticFallbackCount++;
    return GLOBAL_NON_LIFE_BENCHMARKS;
  });
}

/**
 * Returns infrastructure assets insured data — coverage ratios across
 * power, transportation, telecom, real estate, healthcare, and manufacturing sectors.
 */
export async function getInfraAssetsData(): Promise<InfraAssetData[]> {
  return getCachedData<InfraAssetData[]>(
    'pipeline:infra-assets',
    async () => {
      const mode = getPipelineMode();
      if (mode === 'api') {
        return fetchApiData<InfraAssetData[]>('/v1/infra-assets', INFRA_ASSETS_INSURED);
      }
      return readScraperData<InfraAssetData[]>('data/scraper/infra-assets.json', INFRA_ASSETS_INSURED);
    }
  ).catch(() => {
    metrics.staticFallbackCount++;
    return INFRA_ASSETS_INSURED;
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// 9. PIPELINE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Force-refresh all cached data.
 * Clears the entire cache, causing all subsequent data access to trigger fresh fetches.
 * Updates the global refresh timestamp.
 */
export function refreshAll(): void {
  cache.clear();
  metrics.lastGlobalRefresh = new Date().toISOString();
  console.info('[data-pipeline] Cache cleared — all data will be re-fetched on next access.');
}

/**
 * Returns the current pipeline health status including:
 * - Active mode (scraper/api)
 * - Last and next refresh times
 * - Per-dataset freshness with staleness indicators
 * - Cache hit rate, total requests, API errors, and static fallback count
 */
export async function getPipelineStatus(): Promise<PipelineStatus> {
  const mode = getPipelineMode();
  const ttl = getConfiguredTTL();
  const now = Date.now();

  /** Helper to determine freshness of a cached dataset */
  function getFreshness(key: string, staticSource: DataSourceMeta): DataFreshnessEntry {
    const cached = cache.get(key);
    if (cached) {
      const age = now - cached.timestamp;
      const isStale = age > ttl;
      return {
        lastUpdated: new Date(cached.timestamp).toISOString(),
        source: cached.source,
        isStale,
      };
    }
    // No cache entry — use static data's lastUpdated
    return {
      lastUpdated: staticSource.lastUpdated,
      source: 'static',
      isStale: true, // Uncached is considered stale (needs first fetch)
    };
  }

  // Import data sources for freshness metadata
  const {
    CSR_ICR_DATA_SOURCE,
    PENETRATION_DATA_SOURCE,
    MOTOR_PREMIUM_DATA_SOURCE,
    SOLVENCY_DATA_SOURCE,
    MEDICAL_INFLATION_DATA_SOURCE,
    OMBUDSMAN_DATA_SOURCE,
    EV_INSURANCE_DATA_SOURCE: _EV_INSURANCE_DATA_SOURCE,
    CLAIM_AUTOMATION_DATA_SOURCE,
    PROTECTION_GAP_DATA_SOURCE,
    GLOBAL_BENCHMARK_DATA_SOURCE,
  } = await import('@/data/irdai-datasets');

  const lastRefresh = metrics.lastGlobalRefresh;
  const nextRefreshDate = new Date(new Date(lastRefresh).getTime() + ttl);

  const totalRequests = metrics.totalRequests || 1; // Avoid division by zero
  const cacheHitRate = Math.round((metrics.cacheHits / totalRequests) * 100);

  return {
    mode,
    lastRefresh,
    nextRefresh: nextRefreshDate.toISOString(),
    dataFreshness: {
      csr: getFreshness('pipeline:csr', CSR_ICR_DATA_SOURCE),
      penetration: getFreshness('pipeline:penetration', PENETRATION_DATA_SOURCE),
      motor: getFreshness('pipeline:motor', MOTOR_PREMIUM_DATA_SOURCE),
      solvency: getFreshness('pipeline:solvency', SOLVENCY_DATA_SOURCE),
      medicalInflation: getFreshness('pipeline:medical-inflation', MEDICAL_INFLATION_DATA_SOURCE),
      ombudsman: getFreshness('pipeline:ombudsman', OMBUDSMAN_DATA_SOURCE),
      evInsurance: getFreshness('pipeline:ev-insurance', _EV_INSURANCE_DATA_SOURCE),
      claimAutomation: getFreshness('pipeline:claim-automation', CLAIM_AUTOMATION_DATA_SOURCE),
      protectionGap: getFreshness('pipeline:protection-gap', PROTECTION_GAP_DATA_SOURCE),
      globalBenchmarks: getFreshness('pipeline:global-benchmarks', GLOBAL_BENCHMARK_DATA_SOURCE),
    },
    cacheHitRate,
    totalRequests: metrics.totalRequests,
    apiErrors: metrics.apiErrors,
    staticFallbackCount: metrics.staticFallbackCount,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 10. CONVENIENCE ALIASES & AGGREGATED HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Returns a comprehensive insurer profile combining CSR, solvency, and classification data.
 * Useful for the chatbot to provide a complete insurer overview in one call.
 *
 * @param insurer - Insurer name (partial match supported)
 */
export async function getInsurerOverview(insurer: string): Promise<{
  csr: CSRICREntry | null;
  solvency: SolvencyData | null;
  trustScore: TrustScoreResult | null;
} | null> {
  const [csrData, solvencyData, trustScore] = await Promise.all([
    getCSRData(insurer),
    getSolvencyData(insurer),
    getTrustScore(insurer),
  ]);

  if (!csrData.length && !solvencyData.length && !trustScore) {
    return null;
  }

  return {
    csr: csrData[0] ?? null,
    solvency: solvencyData[0] ?? null,
    trustScore,
  };
}

/**
 * Returns the latest Ombudsman dispute resolution script for chatbot use.
 * Simplified convenience method that returns just the Hinglish script text.
 */
export async function getLatestOmbudsmanScript(): Promise<string> {
  const data = await getOmbudsmanScripts();
  const sorted = [...data].sort((a, b) => b.year - a.year);
  return sorted[0]?.disputeResolutionScript ??
    'Insurance Ombudsman se complaint karna free hai. Online complaint: https://bimabharosa.irdai.gov.in';
}

/**
 * Returns claim automation provisions relevant to a user's query.
 * Searches provision names, descriptions, and chatbot implications for matches.
 *
 * @param query - User's natural language query about claims
 */
export async function getClaimAutomationForQuery(query: string): Promise<ClaimAutomationFramework[]> {
  const framework = await getClaimAutomationFramework();
  const normalizedQuery = query.toLowerCase().trim();

  const keywords = normalizedQuery.split(/\s+/).filter((w) => w.length > 2);

  if (keywords.length === 0) return framework;

  return framework.filter((provision) => {
    const searchable = `${provision.provision} ${provision.description} ${provision.chatbotImplication}`.toLowerCase();
    return keywords.some((keyword) => searchable.includes(keyword));
  });
}

/**
 * Returns a summary of all key insights across datasets.
 * Useful for the chatbot to provide quick industry overview.
 */
export async function getKeyInsightsSummary(): Promise<{
  penetration: string;
  medicalInflation: string;
  motorPremium: string;
  solvency: string;
  evInsurance: string;
  globalBenchmark: string;
  macroGrowth: string;
  premiumDrift: string;
}> {
  // Import key insights directly (these are static constants, no need for pipeline)
  const {
    PENETRATION_KEY_INSIGHTS,
    MEDICAL_INFLATION_KEY_INSIGHT,
    MOTOR_PREMIUM_KEY_INSIGHTS,
    SOLVENCY_KEY_INSIGHTS,
    EV_INSURANCE_KEY_INSIGHTS,
    GLOBAL_BENCHMARK_KEY_INSIGHT,
    MACRO_GROWTH_KEY_INSIGHTS,
    PREMIUM_DRIFT_KEY_INSIGHTS,
  } = await import('@/data/irdai-datasets');

  return {
    penetration: PENETRATION_KEY_INSIGHTS.hinglishSummary,
    medicalInflation: MEDICAL_INFLATION_KEY_INSIGHT.hinglishSummary,
    motorPremium: MOTOR_PREMIUM_KEY_INSIGHTS.hinglishSummary,
    solvency: SOLVENCY_KEY_INSIGHTS.hinglishSummary,
    evInsurance: EV_INSURANCE_KEY_INSIGHTS.hinglishSummary,
    globalBenchmark: GLOBAL_BENCHMARK_KEY_INSIGHT.hinglishSummary,
    macroGrowth: MACRO_GROWTH_KEY_INSIGHTS.hinglishSummary,
    premiumDrift: PREMIUM_DRIFT_KEY_INSIGHTS.hinglishSummary,
  };
}

/**
 * Returns macro growth data showing market growth trends.
 * Covers health, non-life, life growth percentages and premium data.
 */
export async function getMacroGrowthData(): Promise<MacroGrowthData[]> {
  return getCachedData<MacroGrowthData[]>(
    'pipeline:macro-growth',
    async () => {
      const mode = getPipelineMode();
      if (mode === 'api') {
        return fetchApiData<MacroGrowthData[]>('/v1/macro-growth', MACRO_GROWTH_DATA);
      }
      return readScraperData<MacroGrowthData[]>('data/scraper/macro-growth.json', MACRO_GROWTH_DATA);
    }
  ).catch(() => {
    metrics.staticFallbackCount++;
    return MACRO_GROWTH_DATA;
  });
}

/**
 * Returns premium drift data showing YoY premium changes.
 * Optionally filtered by category (health, motor-tp, motor-od, ev, life-term).
 */
export async function getPremiumDriftData(category?: string): Promise<PremiumDriftEntry[]> {
  return getCachedData<PremiumDriftEntry[]>(
    'pipeline:premium-drift',
    async () => {
      const mode = getPipelineMode();
      let data: PremiumDriftEntry[];
      if (mode === 'api') {
        const endpoint = category ? `/v1/premium-drift?category=${encodeURIComponent(category)}` : '/v1/premium-drift';
        data = await fetchApiData<PremiumDriftEntry[]>(endpoint, PREMIUM_DRIFT_DATA);
      } else {
        data = await readScraperData<PremiumDriftEntry[]>('data/scraper/premium-drift.json', PREMIUM_DRIFT_DATA);
      }
      if (category) {
        return data.filter((entry) => entry.category === category);
      }
      return data;
    }
  ).catch(() => {
    metrics.staticFallbackCount++;
    if (category) return PREMIUM_DRIFT_DATA.filter((e) => e.category === category);
    return PREMIUM_DRIFT_DATA;
  });
}

/**
 * Returns coverage comparison data for ₹5L, ₹10L, and ₹25L plans.
 */
export async function getCoverageComparison(): Promise<CoverageComparison[]> {
  return getCachedData<CoverageComparison[]>(
    'pipeline:coverage-comparison',
    async () => {
      const mode = getPipelineMode();
      if (mode === 'api') {
        return fetchApiData<CoverageComparison[]>('/v1/coverage-comparison', COVERAGE_COMPARISON_DATA);
      }
      return readScraperData<CoverageComparison[]>('data/scraper/coverage-comparison.json', COVERAGE_COMPARISON_DATA);
    }
  ).catch(() => {
    metrics.staticFallbackCount++;
    return COVERAGE_COMPARISON_DATA;
  });
}

/**
 * Returns consumer protection features from IRDAI and BimaBharosa.
 */
export async function getConsumerProtectionFeatures(): Promise<ConsumerProtectionFeature[]> {
  return getCachedData<ConsumerProtectionFeature[]>(
    'pipeline:consumer-protection',
    async () => {
      const mode = getPipelineMode();
      if (mode === 'api') {
        return fetchApiData<ConsumerProtectionFeature[]>('/v1/consumer-protection', CONSUMER_PROTECTION_FEATURES);
      }
      return readScraperData<ConsumerProtectionFeature[]>('data/scraper/consumer-protection.json', CONSUMER_PROTECTION_FEATURES);
    }
  ).catch(() => {
    metrics.staticFallbackCount++;
    return CONSUMER_PROTECTION_FEATURES;
  });
}

/**
 * Returns premium alerts for upcoming premium hikes and drift notifications.
 * This is a synchronous function as alerts are static data.
 */
export function getPremiumAlerts(): PremiumAlert[] {
  return PREMIUM_ALERTS;
}

/**
 * Returns renewal reminder stages (30 days, 15 days, 1 day before expiry).
 * This is a synchronous function as reminders are static data.
 */
export function getRenewalReminders(): RenewalReminder[] {
  return RENEWAL_REMINDER_STAGES;
}

/**
 * Returns all available datasets in a single call.
 * Useful for preloading or bulk data access.
 * Respects the pipeline mode and cache for each dataset.
 */
export async function getAllDatasets(): Promise<{
  csr: CSRICREntry[];
  penetration: PenetrationData[];
  motor: MotorPremiumTrend[];
  solvency: SolvencyData[];
  medicalInflation: MedicalInflationData[];
  ombudsman: OmbudsmanData[];
  evInsurance: EVInsuranceData[];
  claimAutomation: ClaimAutomationFramework[];
  protectionGap: ProtectionGapData[];
  globalBenchmarks: GlobalBenchmarkData[];
  macroGrowth: MacroGrowthData[];
  premiumDrift: PremiumDriftEntry[];
  coverageComparison: CoverageComparison[];
  consumerProtection: ConsumerProtectionFeature[];
  premiumAlerts: PremiumAlert[];
  renewalReminders: RenewalReminder[];
}> {
  const [
    csr,
    penetration,
    motor,
    solvency,
    medicalInflationArr,
    ombudsman,
    evInsurance,
    claimAutomation,
    protectionGap,
    globalBenchmarks,
    macroGrowth,
    premiumDrift,
    coverageComparison,
    consumerProtection,
  ] = await Promise.all([
    getCSRData(),
    getPenetrationData(),
    getMotorTrends(),
    getSolvencyData(),
    getMedicalInflation().then((d) => [d]),
    getOmbudsmanScripts(),
    getEVInsuranceData(),
    getClaimAutomationFramework(),
    getProtectionGap(),
    getGlobalBenchmarks(),
    getMacroGrowthData(),
    getPremiumDriftData(),
    getCoverageComparison(),
    getConsumerProtectionFeatures(),
  ]);

  return {
    csr,
    penetration,
    motor,
    solvency,
    medicalInflation: medicalInflationArr,
    ombudsman,
    evInsurance,
    claimAutomation,
    protectionGap,
    globalBenchmarks,
    macroGrowth,
    premiumDrift,
    coverageComparison,
    consumerProtection,
    premiumAlerts: getPremiumAlerts(),
    renewalReminders: getRenewalReminders(),
  };
}
