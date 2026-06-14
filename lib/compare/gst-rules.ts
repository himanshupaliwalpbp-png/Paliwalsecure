// =============================================================================
// GST Rules for Insurance — FY 2025-26
// Reflects GST Council 56th Meeting decisions (22 Sept 2025)
// =============================================================================

// ---------------------------------------------------------------------------
// Category-specific GST rates
// ---------------------------------------------------------------------------
export interface GSTRateConfig {
  category: string;
  standardRate: number;     // Normal GST rate
  groupRate: number;        // Rate for group policies (if different)
  exemptionDate: string | null; // Date from which GST is 0%
  isExempt: boolean;        // Currently exempt?
}

export const GST_RATE_TABLE: Record<string, GSTRateConfig> = {
  motor: {
    category: 'motor',
    standardRate: 0.18,
    groupRate: 0.18,
    exemptionDate: null,
    isExempt: false,
  },
  health: {
    category: 'health',
    standardRate: 0.18,
    groupRate: 0.18,
    exemptionDate: '2025-09-22',
    isExempt: true,
  },
  life: {
    category: 'life',
    standardRate: 0.18,
    groupRate: 0.18,
    exemptionDate: '2025-09-22',
    isExempt: true,
  },
  travel: {
    category: 'travel',
    standardRate: 0.18,
    groupRate: 0.18,
    exemptionDate: null,
    isExempt: false,
  },
  home: {
    category: 'home',
    standardRate: 0.18,
    groupRate: 0.18,
    exemptionDate: null,
    isExempt: false,
  },
  commercial: {
    category: 'commercial',
    standardRate: 0.18,
    groupRate: 0.18,
    exemptionDate: null,
    isExempt: false,
  },
};

// ---------------------------------------------------------------------------
// Key Exemption Dates
// ---------------------------------------------------------------------------
export const HEALTH_GST_EXEMPTION_DATE = '2025-09-22';
export const LIFE_GST_EXEMPTION_DATE = '2025-09-22';

// ---------------------------------------------------------------------------
// Helper: Get GST Rate for a category
// ---------------------------------------------------------------------------
/**
 * Returns the applicable GST rate for a given insurance category.
 *
 * @param category - Insurance category key (motor, health, life, travel, home, commercial)
 * @param isGroup  - Whether the policy is a group policy (currently same rate for all)
 * @returns GST rate as a decimal (e.g., 0.18 for 18%, 0 for exempt)
 */
export function getGSTRate(category: string, isGroup: boolean = false): number {
  const config = GST_RATE_TABLE[category];
  if (!config) {
    // Default to 18% for unknown categories
    return 0.18;
  }

  if (config.isExempt) {
    return 0;
  }

  return isGroup ? config.groupRate : config.standardRate;
}

// ---------------------------------------------------------------------------
// Helper: Check if a category is GST-exempt
// ---------------------------------------------------------------------------
/**
 * Checks whether the given insurance category is currently GST-exempt.
 *
 * @param category - Insurance category key
 * @returns true if the category is exempt from GST
 */
export function isGSTExempt(category: string): boolean {
  const config = GST_RATE_TABLE[category];
  if (!config) return false;
  return config.isExempt;
}

// ---------------------------------------------------------------------------
// Helper: Calculate GST amount
// ---------------------------------------------------------------------------
/**
 * Calculates the GST amount for a given base premium and category.
 *
 * @param basePremium - The base premium amount (₹)
 * @param category    - Insurance category key
 * @param isGroup     - Whether the policy is a group policy
 * @returns GST amount in ₹
 */
export function calculateGST(basePremium: number, category: string, isGroup: boolean = false): number {
  const rate = getGSTRate(category, isGroup);
  return Math.round(basePremium * rate);
}

// ---------------------------------------------------------------------------
// Helper: Get GST summary for a category
// ---------------------------------------------------------------------------
/**
 * Returns a human-readable GST summary for the category.
 */
export function getGSTSummary(category: string): string {
  const config = GST_RATE_TABLE[category];
  if (!config) return 'GST @ 18% applicable';

  if (config.isExempt && config.exemptionDate) {
    return `GST exempted w.e.f. ${config.exemptionDate} (GST Council 56th Meeting)`;
  }

  return `GST @ ${(config.standardRate * 100).toFixed(0)}% applicable`;
}
