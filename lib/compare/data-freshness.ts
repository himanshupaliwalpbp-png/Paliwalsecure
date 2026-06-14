// =============================================================================
// Data Freshness Tracking — Insurance Comparison Engine
// Tracks when each data category was last updated and next revision date
// =============================================================================

// ---------------------------------------------------------------------------
// Agent / POSP Details
// ---------------------------------------------------------------------------
export const IRDAI_REG_NO = 'IP429834';
export const AGENT_NAME = 'Himanshu Paliwal';
export const AGENT_PHONE = '+91 9258777312';

// ---------------------------------------------------------------------------
// Data Freshness Records
// ---------------------------------------------------------------------------
export interface DataFreshnessEntry {
  lastUpdated: string;    // ISO 8601 date
  nextRevision: string;   // Expected next revision date
  source: string;         // Source of the data
  notes?: string;         // Optional notes
}

export interface DataFreshnessMap {
  [category: string]: DataFreshnessEntry;
}

export const DATA_FRESHNESS: DataFreshnessMap = {
  motor: {
    lastUpdated: '2025-06-01',
    nextRevision: '2026-06-01',
    source: 'IRDAI Third-Party Premium Order (effective 1 June 2024); OD rates from TAC / insurer filings',
    notes: 'TP rates are IRDAI-mandated. OD rates are indicative and vary by insurer filing. Pending FY26-27 TP revision.',
  },
  health: {
    lastUpdated: '2025-09-22',
    nextRevision: '2026-04-01',
    source: 'IRDAI annual returns; insurer product filings; GST Council 56th Meeting notification',
    notes: 'GST on health insurance removed w.e.f. 22 Sept 2025. Premium rates are market averages.',
  },
  life: {
    lastUpdated: '2025-09-22',
    nextRevision: '2026-04-01',
    source: 'IRDAI annual returns; life insurer mortality tables; GST Council 56th Meeting notification',
    notes: 'GST on term life insurance removed w.e.f. 22 Sept 2025. Premiums based on Indian Assured Lives Mortality Table.',
  },
  travel: {
    lastUpdated: '2025-06-01',
    nextRevision: '2026-06-01',
    source: 'Insurer product filings; TAC guidelines',
    notes: 'Daily rates are indicative. Actual premium depends on trip duration, destination, and age.',
  },
  home: {
    lastUpdated: '2025-06-01',
    nextRevision: '2026-06-01',
    source: 'TAC fire tariff; insurer product filings',
    notes: 'Structure rates follow TAC fire tariff guidelines. Earthquake zone loading per IS 1893 seismic map.',
  },
  gst: {
    lastUpdated: '2025-09-22',
    nextRevision: '2026-03-31',
    source: 'GST Council 56th Meeting; CBIC notification',
    notes: 'Health and life insurance GST exemption effective 22 Sept 2025. Motor, travel, home remain at 18%.',
  },
  insurer: {
    lastUpdated: '2025-06-01',
    nextRevision: '2026-06-01',
    source: 'IRDAI annual report; insurer websites; IRDAI solvency disclosures',
    notes: 'CSR, solvency ratios, and network counts are from IRDAI annual report FY24-25 or latest available.',
  },
};

// ---------------------------------------------------------------------------
// Helper: Get freshness info for a category
// ---------------------------------------------------------------------------
export function getDataFreshness(category: string): DataFreshnessEntry | null {
  return DATA_FRESHNESS[category] ?? null;
}

// ---------------------------------------------------------------------------
// Helper: Check if data is stale (more than 365 days since last update)
// ---------------------------------------------------------------------------
export function isDataStale(category: string): boolean {
  const entry = DATA_FRESHNESS[category];
  if (!entry) return true;

  const lastUpdated = new Date(entry.lastUpdated);
  const now = new Date();
  const daysSinceUpdate = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);

  return daysSinceUpdate > 365;
}

// ---------------------------------------------------------------------------
// Helper: Get formatted "last updated" string
// ---------------------------------------------------------------------------
export function getFormattedLastUpdated(category: string): string {
  const entry = DATA_FRESHNESS[category];
  if (!entry) return 'Unknown';

  const date = new Date(entry.lastUpdated);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

// ---------------------------------------------------------------------------
// Helper: Get agent disclosure string
// ---------------------------------------------------------------------------
export function getAgentDisclosure(): string {
  return `IRDAI Reg No: ${IRDAI_REG_NO} | Agent: ${AGENT_NAME} | Phone: ${AGENT_PHONE}`;
}
