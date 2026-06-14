// ═══════════════════════════════════════════════════════════════
// IRDAI Complaint Data — FY 2024-25
// Source: IRDAI Annual Report 2024-25, Bima Bharosa Portal
// ═══════════════════════════════════════════════════════════════

// ── Types ─────────────────────────────────────────────────
export type InsurerSector = 'public' | 'private' | 'standalone-health';

export interface InsurerComplaintData {
  name: string;
  sector: InsurerSector;
  grievancesReported: number;   // FY 2024-25
  percentRise: number;          // Year-on-year % rise
  policiesInForce: number;      // Approximate policies in force (lakhs)
  premiumCollected: number;     // Gross premium collected (₹ crore)
  complaintsPer10k: number;     // Calculated: grievances / policies * 10000
  complaintsPerCrore: number;   // Calculated: grievances / premium (₹ Cr)
  pendencyPercent: number;      // % of complaints unresolved as of Mar 31, 2025
  csr: number;                  // Claim Settlement Ratio %
  category: 'general' | 'health' | 'life';
}

export interface SectorSummary {
  sector: InsurerSector;
  label: string;
  totalGrievances: number;
  percentRise: number;
  insurerCount: number;
  avgComplaintsPer10k: number;
}

// ── Sector Summaries ──────────────────────────────────────
export const SECTOR_SUMMARIES: SectorSummary[] = [
  {
    sector: 'public',
    label: 'Public Sector',
    totalGrievances: 38924,
    percentRise: 56,
    insurerCount: 5,
    avgComplaintsPer10k: 28,
  },
  {
    sector: 'private',
    label: 'Private Sector',
    totalGrievances: 98437,
    percentRise: 41,
    insurerCount: 21,
    avgComplaintsPer10k: 18,
  },
  {
    sector: 'standalone-health',
    label: 'Standalone Health Insurers',
    totalGrievances: 46151,
    percentRise: 33,
    insurerCount: 7,
    avgComplaintsPer10k: 22,
  },
];

// ── Company-wise Complaint Data ───────────────────────────
// Source: IRDAI Annual Report 2024-25, Bima Bharosa Portal
// Premium & policy figures are approximate based on IRDAI market share data
export const INSURER_COMPLAINT_DATA: InsurerComplaintData[] = [
  // ── Standalone Health Insurers ──
  {
    name: 'Star Health',
    sector: 'standalone-health',
    grievancesReported: 20527,
    percentRise: 22,
    policiesInForce: 185,        // 1.85 Cr policies ≈ 185 lakhs
    premiumCollected: 15100,     // ₹15,100 Cr
    complaintsPer10k: 11.1,      // 20527 / 18500000 * 10000
    complaintsPerCrore: 1.36,    // 20527 / 15100
    pendencyPercent: 12,
    csr: 87.5,
    category: 'health',
  },
  {
    name: 'Care Health',
    sector: 'standalone-health',
    grievancesReported: 10281,
    percentRise: 49,
    policiesInForce: 82,         // 82 L policies
    premiumCollected: 7200,      // ₹7,200 Cr
    complaintsPer10k: 12.5,
    complaintsPerCrore: 1.43,
    pendencyPercent: 15,
    csr: 89.2,
    category: 'health',
  },
  {
    name: 'Niva Bupa',
    sector: 'standalone-health',
    grievancesReported: 7970,
    percentRise: 50,
    policiesInForce: 55,         // 55 L policies
    premiumCollected: 4100,      // ₹4,100 Cr
    complaintsPer10k: 14.5,
    complaintsPerCrore: 1.94,
    pendencyPercent: 18,
    csr: 86.8,
    category: 'health',
  },
  {
    name: 'Aditya Birla Health',
    sector: 'standalone-health',
    grievancesReported: 5329,
    percentRise: 37,
    policiesInForce: 42,         // 42 L policies
    premiumCollected: 3200,      // ₹3,200 Cr
    complaintsPer10k: 12.7,
    complaintsPerCrore: 1.67,
    pendencyPercent: 14,
    csr: 88.1,
    category: 'health',
  },
  {
    name: 'ManipalCigna',
    sector: 'standalone-health',
    grievancesReported: 3120,
    percentRise: 28,
    policiesInForce: 28,         // 28 L policies
    premiumCollected: 2100,      // ₹2,100 Cr
    complaintsPer10k: 11.1,
    complaintsPerCrore: 1.49,
    pendencyPercent: 10,
    csr: 90.5,
    category: 'health',
  },
  // ── Private Sector General Insurers ──
  {
    name: 'ICICI Lombard',
    sector: 'private',
    grievancesReported: 15200,
    percentRise: 35,
    policiesInForce: 310,        // 3.1 Cr policies
    premiumCollected: 25800,     // ₹25,800 Cr
    complaintsPer10k: 4.9,
    complaintsPerCrore: 0.59,
    pendencyPercent: 8,
    csr: 96.7,
    category: 'general',
  },
  {
    name: 'HDFC ERGO',
    sector: 'private',
    grievancesReported: 12800,
    percentRise: 30,
    policiesInForce: 280,        // 2.8 Cr policies
    premiumCollected: 23200,     // ₹23,200 Cr
    complaintsPer10k: 4.6,
    complaintsPerCrore: 0.55,
    pendencyPercent: 7,
    csr: 98.85,
    category: 'general',
  },
  {
    name: 'Bajaj Allianz',
    sector: 'private',
    grievancesReported: 11500,
    percentRise: 38,
    policiesInForce: 250,        // 2.5 Cr policies
    premiumCollected: 19500,     // ₹19,500 Cr
    complaintsPer10k: 4.6,
    complaintsPerCrore: 0.59,
    pendencyPercent: 9,
    csr: 95.2,
    category: 'general',
  },
  {
    name: 'Tata AIG',
    sector: 'private',
    grievancesReported: 8900,
    percentRise: 42,
    policiesInForce: 160,        // 1.6 Cr policies
    premiumCollected: 12800,     // ₹12,800 Cr
    complaintsPer10k: 5.6,
    complaintsPerCrore: 0.70,
    pendencyPercent: 10,
    csr: 94.14,
    category: 'general',
  },
  {
    name: 'Acko General',
    sector: 'private',
    grievancesReported: 6200,
    percentRise: 55,
    policiesInForce: 95,         // 95 L policies
    premiumCollected: 3800,      // ₹3,800 Cr
    complaintsPer10k: 6.5,
    complaintsPerCrore: 1.63,
    pendencyPercent: 6,
    csr: 99.98,
    category: 'general',
  },
  {
    name: 'Digit Insurance',
    sector: 'private',
    grievancesReported: 5800,
    percentRise: 48,
    policiesInForce: 78,         // 78 L policies
    premiumCollected: 3200,      // ₹3,200 Cr
    complaintsPer10k: 7.4,
    complaintsPerCrore: 1.81,
    pendencyPercent: 11,
    csr: 96.3,
    category: 'general',
  },
  {
    name: 'SBI General',
    sector: 'private',
    grievancesReported: 5400,
    percentRise: 32,
    policiesInForce: 85,         // 85 L policies
    premiumCollected: 5600,      // ₹5,600 Cr
    complaintsPer10k: 6.4,
    complaintsPerCrore: 0.96,
    pendencyPercent: 9,
    csr: 97.51,
    category: 'general',
  },
  {
    name: 'Reliance General',
    sector: 'private',
    grievancesReported: 8100,
    percentRise: 40,
    policiesInForce: 130,        // 1.3 Cr policies
    premiumCollected: 9500,      // ₹9,500 Cr
    complaintsPer10k: 6.2,
    complaintsPerCrore: 0.85,
    pendencyPercent: 12,
    csr: 99.32,
    category: 'general',
  },
  {
    name: 'Zuno (ERGO)',
    sector: 'private',
    grievancesReported: 3100,
    percentRise: 25,
    policiesInForce: 45,         // 45 L policies
    premiumCollected: 2800,      // ₹2,800 Cr
    complaintsPer10k: 6.9,
    complaintsPerCrore: 1.11,
    pendencyPercent: 8,
    csr: 98.13,
    category: 'general',
  },
  // ── Public Sector Insurers ──
  {
    name: 'National Insurance',
    sector: 'public',
    grievancesReported: 9800,
    percentRise: 62,
    policiesInForce: 110,        // 1.1 Cr policies
    premiumCollected: 8200,      // ₹8,200 Cr
    complaintsPer10k: 8.9,
    complaintsPerCrore: 1.20,
    pendencyPercent: 22,
    csr: 91.79,
    category: 'general',
  },
  {
    name: 'New India Assurance',
    sector: 'public',
    grievancesReported: 12500,
    percentRise: 55,
    policiesInForce: 180,        // 1.8 Cr policies
    premiumCollected: 39500,     // ₹39,500 Cr
    complaintsPer10k: 6.9,
    complaintsPerCrore: 0.32,
    pendencyPercent: 18,
    csr: 93.2,
    category: 'general',
  },
  {
    name: 'Oriental Insurance',
    sector: 'public',
    grievancesReported: 8200,
    percentRise: 58,
    policiesInForce: 95,         // 95 L policies
    premiumCollected: 6100,      // ₹6,100 Cr
    complaintsPer10k: 8.6,
    complaintsPerCrore: 1.34,
    pendencyPercent: 20,
    csr: 90.5,
    category: 'general',
  },
  {
    name: 'United India Insurance',
    sector: 'public',
    grievancesReported: 7200,
    percentRise: 50,
    policiesInForce: 88,         // 88 L policies
    premiumCollected: 5800,      // ₹5,800 Cr
    complaintsPer10k: 8.2,
    complaintsPerCrore: 1.24,
    pendencyPercent: 19,
    csr: 92.1,
    category: 'general',
  },
  // ── Private Life Insurers ──
  {
    name: 'LIC of India',
    sector: 'public',
    grievancesReported: 14200,
    percentRise: 45,
    policiesInForce: 2500,       // 25 Cr policies ≈ 2500 lakhs
    premiumCollected: 475000,    // ₹4.75L Cr
    complaintsPer10k: 0.6,
    complaintsPerCrore: 0.03,
    pendencyPercent: 5,
    csr: 98.52,
    category: 'life',
  },
  {
    name: 'HDFC Life',
    sector: 'private',
    grievancesReported: 9800,
    percentRise: 38,
    policiesInForce: 520,        // 5.2 Cr policies
    premiumCollected: 82000,     // ₹82,000 Cr
    complaintsPer10k: 1.9,
    complaintsPerCrore: 0.12,
    pendencyPercent: 4,
    csr: 99.37,
    category: 'life',
  },
  {
    name: 'SBI Life',
    sector: 'private',
    grievancesReported: 7600,
    percentRise: 35,
    policiesInForce: 430,        // 4.3 Cr policies
    premiumCollected: 68000,     // ₹68,000 Cr
    complaintsPer10k: 1.8,
    complaintsPerCrore: 0.11,
    pendencyPercent: 3,
    csr: 98.50,
    category: 'life',
  },
  {
    name: 'ICICI Prudential Life',
    sector: 'private',
    grievancesReported: 6800,
    percentRise: 30,
    policiesInForce: 350,        // 3.5 Cr policies
    premiumCollected: 55000,     // ₹55,000 Cr
    complaintsPer10k: 1.9,
    complaintsPerCrore: 0.12,
    pendencyPercent: 4,
    csr: 98.20,
    category: 'life',
  },
  {
    name: 'Max Life',
    sector: 'private',
    grievancesReported: 5200,
    percentRise: 33,
    policiesInForce: 260,        // 2.6 Cr policies
    premiumCollected: 32000,     // ₹32,000 Cr
    complaintsPer10k: 2.0,
    complaintsPerCrore: 0.16,
    pendencyPercent: 5,
    csr: 99.08,
    category: 'life',
  },
];

// ── Color Coding ──────────────────────────────────────────
export type ComplaintLevel = 'low' | 'medium' | 'high';

export function getComplaintLevel(per10k: number): ComplaintLevel {
  if (per10k < 10) return 'low';
  if (per10k <= 30) return 'medium';
  return 'high';
}

export function getComplaintLevelColor(level: ComplaintLevel): {
  bg: string;
  text: string;
  dot: string;
  badge: string;
} {
  switch (level) {
    case 'low':
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/30',
        text: 'text-emerald-700 dark:text-emerald-400',
        dot: 'bg-emerald-500',
        badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      };
    case 'medium':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/30',
        text: 'text-amber-700 dark:text-amber-400',
        dot: 'bg-amber-500',
        badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      };
    case 'high':
      return {
        bg: 'bg-red-50 dark:bg-red-950/30',
        text: 'text-red-700 dark:text-red-400',
        dot: 'bg-red-500',
        badge: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-800',
      };
  }
}

// ── Format Helpers ────────────────────────────────────────
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

export function formatCurrencyCrore(num: number): string {
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)}L Cr`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K Cr`;
  return `₹${num.toFixed(2)} Cr`;
}

// ── Key Insights ──────────────────────────────────────────
export const KEY_INSIGHTS = [
  {
    title: 'Total Grievances Soared 42%',
    description: 'Combined grievances across all sectors reached 1,83,512 in FY25 — a 42% jump from FY24.',
    icon: '📈' as const,
    type: 'warning' as const,
  },
  {
    title: 'Public Sector Worst Hit',
    description: 'Public sector insurers saw a 56% YoY rise in complaints, with pendency rates averaging 20%.',
    icon: '🏛️' as const,
    type: 'danger' as const,
  },
  {
    title: 'Standalone Health 33% Rise',
    description: 'Standalone health insurers reported 46,151 grievances — Star Health alone accounts for 44% of these.',
    icon: '🏥' as const,
    type: 'warning' as const,
  },
  {
    title: 'Best Performers: Life Insurers',
    description: 'Life insurers have the lowest complaint ratios — LIC at just 0.6 per 10,000 policies.',
    icon: '✅' as const,
    type: 'success' as const,
  },
  {
    title: 'Niva Bupa Fastest Rising',
    description: 'Niva Bupa complaints surged 50% YoY — the highest among standalone health insurers.',
    icon: '⚠️' as const,
    type: 'danger' as const,
  },
  {
    title: 'Acko: High CSR, Rising Complaints',
    description: 'Acko has the highest CSR at 99.98%, yet complaints rose 55% — indicating rapid policy growth.',
    icon: '📊' as const,
    type: 'info' as const,
  },
];

// ── Source Disclaimer ─────────────────────────────────────
export const IRDAI_SOURCE_DISCLAIMER =
  'Source: IRDAI Annual Report 2024-25. Figures for grievances reported on Bima Bharosa portal. Pendency includes complaints unresolved as of March 31, 2025. Premium and policy figures are approximate based on IRDAI market share data.';

export const ACTIONABLE_TIP =
  'Always check an insurer\'s complaint ratio before buying. Insurers with <10 complaints per 10,000 policies generally have smoother claims processing.';
