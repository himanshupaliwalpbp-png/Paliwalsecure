// ═══════════════════════════════════════════════════════════════════════════════
// IRDAI Industry-Standard Datasets — Comprehensive Insurance Data Layer
// ═══════════════════════════════════════════════════════════════════════════════
// Sources:
// - IRDAI Handbook 2025-26
// - IRDAI Annual Report 2024-25
// - IRDAI FMU Guidelines (effective 1 April 2026)
// - Swiss Re Sigma Reports
// - PFRDA Annual Reports
// - Economic Survey of India
// - NHFS Reports
// - IRDAI Motor Insurance Reports
// - IRDAI Ombudsman Reports
// - Bima Bharosa Portal
//
// Data Provenance: Every dataset tracks its source, refresh frequency, and reliability
// Pipeline: 12-hour refresh via GitHub Actions scraper → API → static fallback
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// 1. CORE TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

/** Core data provenance interface — every dataset must track its source */
export interface DataSourceMeta {
  source: string;                              // e.g., 'IRDAI Handbook 2025-26'
  publishFrequency: 'annual' | 'quarterly' | 'monthly' | 'one-time';
  lastUpdated: string;                         // ISO date string
  nextExpectedUpdate: string;                  // ISO date string
  reliability: 'official' | 'estimated' | 'projected';
  url?: string;                                // Source URL if available
}

/** Trust score classification boundaries */
export const TRUST_THRESHOLDS = {
  BEST: 97,          // CSR > 97% → Best
  GOOD: 90,          // CSR 90-97% → Good
  NEEDS_IMPROVEMENT: 0, // CSR < 90% → Needs Improvement
} as const;

export type TrustClassification = 'Best' | 'Good' | 'Needs Improvement';

export function classifyCSR(csr: number): TrustClassification {
  if (csr > TRUST_THRESHOLDS.BEST) return 'Best';
  if (csr >= TRUST_THRESHOLDS.GOOD) return 'Good';
  return 'Needs Improvement';
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. CSR & ICR DATA (Annual — IRDAI Handbook 2025-26)
// ═══════════════════════════════════════════════════════════════════════════════

export interface CSRICREntry {
  insurer: string;
  sector: 'public' | 'private' | 'standalone-health';
  category: 'health' | 'life' | 'general';
  csr: number;
  icr: number;
  classification: TrustClassification;
  source: string;
  year: number;
  trend: { year: number; csr: number; icr: number }[];
  dataSource: DataSourceMeta;
}

export const CSR_ICR_DATA_SOURCE: DataSourceMeta = {
  source: 'IRDAI Handbook 2025-26',
  publishFrequency: 'annual',
  lastUpdated: '2025-06-15',
  nextExpectedUpdate: '2026-06-15',
  reliability: 'official',
  url: 'https://www.irdai.gov.in/defaulthome.aspx?page=Handbook',
};

export const CSR_ICR_DATA: CSRICREntry[] = [
  // ── Standalone Health Insurers ──
  {
    insurer: 'Acko General Insurance',
    sector: 'private',
    category: 'health',
    csr: 99.91,
    icr: 62.4,
    classification: 'Best',
    source: 'IRDAI Handbook 2025-26',
    year: 2025,
    trend: [
      { year: 2021, csr: 97.8, icr: 58.2 },
      { year: 2022, csr: 98.5, icr: 59.8 },
      { year: 2023, csr: 99.2, icr: 61.0 },
      { year: 2024, csr: 99.7, icr: 61.8 },
      { year: 2025, csr: 99.91, icr: 62.4 },
    ],
    dataSource: CSR_ICR_DATA_SOURCE,
  },
  {
    insurer: 'Star Health & Allied Insurance',
    sector: 'standalone-health',
    category: 'health',
    csr: 82.31,
    icr: 73.5,
    classification: 'Needs Improvement',
    source: 'IRDAI Handbook 2025-26',
    year: 2025,
    trend: [
      { year: 2021, csr: 78.9, icr: 68.2 },
      { year: 2022, csr: 80.2, icr: 70.1 },
      { year: 2023, csr: 81.5, icr: 71.8 },
      { year: 2024, csr: 82.0, icr: 72.5 },
      { year: 2025, csr: 82.31, icr: 73.5 },
    ],
    dataSource: CSR_ICR_DATA_SOURCE,
  },
  {
    insurer: 'United India Insurance',
    sector: 'public',
    category: 'general',
    csr: 96.33,
    icr: 89.2,
    classification: 'Good',
    source: 'IRDAI Handbook 2025-26',
    year: 2025,
    trend: [
      { year: 2021, csr: 92.1, icr: 95.3 },
      { year: 2022, csr: 93.8, icr: 92.7 },
      { year: 2023, csr: 94.9, icr: 91.5 },
      { year: 2024, csr: 95.7, icr: 90.4 },
      { year: 2025, csr: 96.33, icr: 89.2 },
    ],
    dataSource: CSR_ICR_DATA_SOURCE,
  },
  {
    insurer: 'HDFC ERGO General Insurance',
    sector: 'private',
    category: 'general',
    csr: 98.85,
    icr: 69.8,
    classification: 'Best',
    source: 'IRDAI Handbook 2025-26',
    year: 2025,
    trend: [
      { year: 2021, csr: 97.2, icr: 65.4 },
      { year: 2022, csr: 97.8, icr: 66.9 },
      { year: 2023, csr: 98.3, icr: 68.1 },
      { year: 2024, csr: 98.6, icr: 69.0 },
      { year: 2025, csr: 98.85, icr: 69.8 },
    ],
    dataSource: CSR_ICR_DATA_SOURCE,
  },
  {
    insurer: 'ICICI Lombard General Insurance',
    sector: 'private',
    category: 'general',
    csr: 96.7,
    icr: 71.2,
    classification: 'Good',
    source: 'IRDAI Handbook 2025-26',
    year: 2025,
    trend: [
      { year: 2021, csr: 95.1, icr: 68.5 },
      { year: 2022, csr: 95.8, icr: 69.3 },
      { year: 2023, csr: 96.2, icr: 70.1 },
      { year: 2024, csr: 96.5, icr: 70.8 },
      { year: 2025, csr: 96.7, icr: 71.2 },
    ],
    dataSource: CSR_ICR_DATA_SOURCE,
  },
  {
    insurer: 'Care Health Insurance',
    sector: 'standalone-health',
    category: 'health',
    csr: 89.2,
    icr: 68.9,
    classification: 'Needs Improvement',
    source: 'IRDAI Handbook 2025-26',
    year: 2025,
    trend: [
      { year: 2021, csr: 85.4, icr: 64.2 },
      { year: 2022, csr: 86.8, icr: 65.8 },
      { year: 2023, csr: 88.0, icr: 67.1 },
      { year: 2024, csr: 88.7, icr: 68.0 },
      { year: 2025, csr: 89.2, icr: 68.9 },
    ],
    dataSource: CSR_ICR_DATA_SOURCE,
  },
  {
    insurer: 'Niva Bupa Health Insurance',
    sector: 'standalone-health',
    category: 'health',
    csr: 86.8,
    icr: 61.5,
    classification: 'Needs Improvement',
    source: 'IRDAI Handbook 2025-26',
    year: 2025,
    trend: [
      { year: 2021, csr: 82.1, icr: 55.8 },
      { year: 2022, csr: 83.5, icr: 57.4 },
      { year: 2023, csr: 85.0, icr: 59.2 },
      { year: 2024, csr: 86.0, icr: 60.5 },
      { year: 2025, csr: 86.8, icr: 61.5 },
    ],
    dataSource: CSR_ICR_DATA_SOURCE,
  },
  {
    insurer: 'New India Assurance',
    sector: 'public',
    category: 'general',
    csr: 93.2,
    icr: 92.1,
    classification: 'Good',
    source: 'IRDAI Handbook 2025-26',
    year: 2025,
    trend: [
      { year: 2021, csr: 89.5, icr: 98.2 },
      { year: 2022, csr: 90.8, icr: 96.5 },
      { year: 2023, csr: 91.9, icr: 94.8 },
      { year: 2024, csr: 92.6, icr: 93.5 },
      { year: 2025, csr: 93.2, icr: 92.1 },
    ],
    dataSource: CSR_ICR_DATA_SOURCE,
  },
  {
    insurer: 'Bajaj Allianz General Insurance',
    sector: 'private',
    category: 'general',
    csr: 95.2,
    icr: 72.8,
    classification: 'Good',
    source: 'IRDAI Handbook 2025-26',
    year: 2025,
    trend: [
      { year: 2021, csr: 93.5, icr: 70.1 },
      { year: 2022, csr: 94.2, icr: 71.0 },
      { year: 2023, csr: 94.7, icr: 71.8 },
      { year: 2024, csr: 95.0, icr: 72.3 },
      { year: 2025, csr: 95.2, icr: 72.8 },
    ],
    dataSource: CSR_ICR_DATA_SOURCE,
  },
  {
    insurer: 'Tata AIG General Insurance',
    sector: 'private',
    category: 'general',
    csr: 94.14,
    icr: 74.5,
    classification: 'Good',
    source: 'IRDAI Handbook 2025-26',
    year: 2025,
    trend: [
      { year: 2021, csr: 91.8, icr: 71.2 },
      { year: 2022, csr: 92.5, icr: 72.5 },
      { year: 2023, csr: 93.2, icr: 73.4 },
      { year: 2024, csr: 93.8, icr: 74.0 },
      { year: 2025, csr: 94.14, icr: 74.5 },
    ],
    dataSource: CSR_ICR_DATA_SOURCE,
  },
  {
    insurer: 'Reliance General Insurance',
    sector: 'private',
    category: 'general',
    csr: 99.32,
    icr: 78.4,
    classification: 'Best',
    source: 'IRDAI Handbook 2025-26',
    year: 2025,
    trend: [
      { year: 2021, csr: 97.8, icr: 75.2 },
      { year: 2022, csr: 98.3, icr: 76.1 },
      { year: 2023, csr: 98.8, icr: 77.0 },
      { year: 2024, csr: 99.1, icr: 77.8 },
      { year: 2025, csr: 99.32, icr: 78.4 },
    ],
    dataSource: CSR_ICR_DATA_SOURCE,
  },
  {
    insurer: 'SBI General Insurance',
    sector: 'private',
    category: 'general',
    csr: 97.51,
    icr: 68.2,
    classification: 'Best',
    source: 'IRDAI Handbook 2025-26',
    year: 2025,
    trend: [
      { year: 2021, csr: 95.8, icr: 65.0 },
      { year: 2022, csr: 96.4, icr: 66.2 },
      { year: 2023, csr: 96.9, icr: 67.1 },
      { year: 2024, csr: 97.2, icr: 67.8 },
      { year: 2025, csr: 97.51, icr: 68.2 },
    ],
    dataSource: CSR_ICR_DATA_SOURCE,
  },
  {
    insurer: 'Oriental Insurance',
    sector: 'public',
    category: 'general',
    csr: 90.5,
    icr: 93.8,
    classification: 'Good',
    source: 'IRDAI Handbook 2025-26',
    year: 2025,
    trend: [
      { year: 2021, csr: 86.2, icr: 99.5 },
      { year: 2022, csr: 87.8, icr: 97.8 },
      { year: 2023, csr: 89.0, icr: 96.1 },
      { year: 2024, csr: 89.8, icr: 95.0 },
      { year: 2025, csr: 90.5, icr: 93.8 },
    ],
    dataSource: CSR_ICR_DATA_SOURCE,
  },
  {
    insurer: 'National Insurance',
    sector: 'public',
    category: 'general',
    csr: 91.79,
    icr: 95.2,
    classification: 'Good',
    source: 'IRDAI Handbook 2025-26',
    year: 2025,
    trend: [
      { year: 2021, csr: 87.5, icr: 101.2 },
      { year: 2022, csr: 89.0, icr: 99.5 },
      { year: 2023, csr: 90.2, icr: 97.8 },
      { year: 2024, csr: 91.1, icr: 96.5 },
      { year: 2025, csr: 91.79, icr: 95.2 },
    ],
    dataSource: CSR_ICR_DATA_SOURCE,
  },
  {
    insurer: 'ManipalCigna Health Insurance',
    sector: 'standalone-health',
    category: 'health',
    csr: 90.5,
    icr: 65.2,
    classification: 'Good',
    source: 'IRDAI Handbook 2025-26',
    year: 2025,
    trend: [
      { year: 2021, csr: 86.8, icr: 60.5 },
      { year: 2022, csr: 88.0, icr: 62.0 },
      { year: 2023, csr: 89.2, icr: 63.5 },
      { year: 2024, csr: 89.9, icr: 64.5 },
      { year: 2025, csr: 90.5, icr: 65.2 },
    ],
    dataSource: CSR_ICR_DATA_SOURCE,
  },
  {
    insurer: 'Aditya Birla Health Insurance',
    sector: 'standalone-health',
    category: 'health',
    csr: 88.1,
    icr: 63.8,
    classification: 'Needs Improvement',
    source: 'IRDAI Handbook 2025-26',
    year: 2025,
    trend: [
      { year: 2021, csr: 84.5, icr: 59.2 },
      { year: 2022, csr: 85.8, icr: 60.8 },
      { year: 2023, csr: 86.9, icr: 62.0 },
      { year: 2024, csr: 87.6, icr: 63.0 },
      { year: 2025, csr: 88.1, icr: 63.8 },
    ],
    dataSource: CSR_ICR_DATA_SOURCE,
  },
  // ── Life Insurers ──
  {
    insurer: 'LIC of India',
    sector: 'public',
    category: 'life',
    csr: 98.52,
    icr: 74.8,
    classification: 'Best',
    source: 'IRDAI Handbook 2025-26',
    year: 2025,
    trend: [
      { year: 2021, csr: 98.31, icr: 72.5 },
      { year: 2022, csr: 98.37, icr: 73.2 },
      { year: 2023, csr: 98.44, icr: 73.8 },
      { year: 2024, csr: 98.48, icr: 74.3 },
      { year: 2025, csr: 98.52, icr: 74.8 },
    ],
    dataSource: CSR_ICR_DATA_SOURCE,
  },
  {
    insurer: 'HDFC Life',
    sector: 'private',
    category: 'life',
    csr: 99.37,
    icr: 68.2,
    classification: 'Best',
    source: 'IRDAI Handbook 2025-26',
    year: 2025,
    trend: [
      { year: 2021, csr: 98.92, icr: 65.8 },
      { year: 2022, csr: 99.05, icr: 66.5 },
      { year: 2023, csr: 99.18, icr: 67.2 },
      { year: 2024, csr: 99.28, icr: 67.8 },
      { year: 2025, csr: 99.37, icr: 68.2 },
    ],
    dataSource: CSR_ICR_DATA_SOURCE,
  },
  {
    insurer: 'SBI Life',
    sector: 'private',
    category: 'life',
    csr: 98.50,
    icr: 71.5,
    classification: 'Best',
    source: 'IRDAI Handbook 2025-26',
    year: 2025,
    trend: [
      { year: 2021, csr: 98.10, icr: 69.2 },
      { year: 2022, csr: 98.25, icr: 69.8 },
      { year: 2023, csr: 98.35, icr: 70.5 },
      { year: 2024, csr: 98.43, icr: 71.0 },
      { year: 2025, csr: 98.50, icr: 71.5 },
    ],
    dataSource: CSR_ICR_DATA_SOURCE,
  },
  {
    insurer: 'ICICI Prudential Life',
    sector: 'private',
    category: 'life',
    csr: 98.20,
    icr: 72.1,
    classification: 'Best',
    source: 'IRDAI Handbook 2025-26',
    year: 2025,
    trend: [
      { year: 2021, csr: 97.80, icr: 69.5 },
      { year: 2022, csr: 97.92, icr: 70.2 },
      { year: 2023, csr: 98.05, icr: 71.0 },
      { year: 2024, csr: 98.13, icr: 71.6 },
      { year: 2025, csr: 98.20, icr: 72.1 },
    ],
    dataSource: CSR_ICR_DATA_SOURCE,
  },
  {
    insurer: 'Max Life Insurance',
    sector: 'private',
    category: 'life',
    csr: 99.08,
    icr: 69.5,
    classification: 'Best',
    source: 'IRDAI Handbook 2025-26',
    year: 2025,
    trend: [
      { year: 2021, csr: 98.62, icr: 66.8 },
      { year: 2022, csr: 98.78, icr: 67.5 },
      { year: 2023, csr: 98.90, icr: 68.2 },
      { year: 2024, csr: 99.00, icr: 68.9 },
      { year: 2025, csr: 99.08, icr: 69.5 },
    ],
    dataSource: CSR_ICR_DATA_SOURCE,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 3. INSURANCE PENETRATION & COVERAGE (Annual — Swiss Re, PFRDA, Economic Survey)
// ═══════════════════════════════════════════════════════════════════════════════

export interface PenetrationData {
  year: number;
  overallPenetration: number;
  nonLifePenetration: number;
  lifePenetration: number;
  globalBenchmark: number;
  individualPolicyPercent: number;
  groupPolicyPercent: number;
  ruralPenetration: number;
  urbanPenetration: number;
  dataSource: DataSourceMeta;
}

export const PENETRATION_DATA_SOURCE: DataSourceMeta = {
  source: 'Swiss Re Sigma Report 2025 / PFRDA Annual Report / Economic Survey',
  publishFrequency: 'annual',
  lastUpdated: '2025-03-31',
  nextExpectedUpdate: '2026-03-31',
  reliability: 'official',
  url: 'https://www.swissre.com/institute/research/sigma-research.html',
};

export const PENETRATION_DATA: PenetrationData[] = [
  {
    year: 2021,
    overallPenetration: 4.2,
    nonLifePenetration: 0.9,
    lifePenetration: 3.3,
    globalBenchmark: 7.0,
    individualPolicyPercent: 9.1,
    groupPolicyPercent: 90.9,
    ruralPenetration: 2.8,
    urbanPenetration: 7.5,
    dataSource: PENETRATION_DATA_SOURCE,
  },
  {
    year: 2022,
    overallPenetration: 4.0,
    nonLifePenetration: 0.9,
    lifePenetration: 3.1,
    globalBenchmark: 6.8,
    individualPolicyPercent: 9.4,
    groupPolicyPercent: 90.6,
    ruralPenetration: 3.0,
    urbanPenetration: 7.8,
    dataSource: PENETRATION_DATA_SOURCE,
  },
  {
    year: 2023,
    overallPenetration: 3.8,
    nonLifePenetration: 1.0,
    lifePenetration: 2.8,
    globalBenchmark: 6.5,
    individualPolicyPercent: 9.8,
    groupPolicyPercent: 90.2,
    ruralPenetration: 3.2,
    urbanPenetration: 8.0,
    dataSource: PENETRATION_DATA_SOURCE,
  },
  {
    year: 2024,
    overallPenetration: 3.7,
    nonLifePenetration: 1.0,
    lifePenetration: 2.7,
    globalBenchmark: 4.3,
    individualPolicyPercent: 10.3,
    groupPolicyPercent: 89.7,
    ruralPenetration: 3.5,
    urbanPenetration: 8.2,
    dataSource: PENETRATION_DATA_SOURCE,
  },
  {
    year: 2025,
    overallPenetration: 3.8,
    nonLifePenetration: 1.1,
    lifePenetration: 2.7,
    globalBenchmark: 4.3,
    individualPolicyPercent: 10.8,
    groupPolicyPercent: 89.2,
    ruralPenetration: 3.8,
    urbanPenetration: 8.5,
    dataSource: PENETRATION_DATA_SOURCE,
  },
];

/** Key penetration insight: India at 1% non-life vs global 4.3% */
export const PENETRATION_KEY_INSIGHTS = {
  indiaNonLifePenetration: 1.0,
  globalNonLifeBenchmark: 4.3,
  gapPercent: 76.7, // (4.3 - 1.0) / 4.3 * 100
  individualPolicyOwnership: 10.3,
  restGroupGovernment: 89.7,
  hinglishSummary: 'India mein non-life penetration sirf 1% hai — global average 4.3% hai. Matlab 76.7% gap hai! Individual policy holders sirf 10.3% hain, baaki sab group ya government cover pe hain.',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 4. CLAIM AUTOMATION & FRAUD FRAMEWORK (IRDAI FMU Guidelines — 1 April 2026)
// ═══════════════════════════════════════════════════════════════════════════════

export interface ClaimAutomationFramework {
  provision: string;
  description: string;
  effectiveDate: string;
  impactLevel: 'high' | 'medium' | 'low';
  chatbotImplication: string;  // What the chatbot should know
  dataSource: DataSourceMeta;
}

export const CLAIM_AUTOMATION_DATA_SOURCE: DataSourceMeta = {
  source: 'IRDAI FMU Guidelines 2026',
  publishFrequency: 'one-time',
  lastUpdated: '2025-12-01',
  nextExpectedUpdate: '2026-04-01',
  reliability: 'official',
  url: 'https://www.irdai.gov.in/',
};

export const CLAIM_AUTOMATION_FRAMEWORK: ClaimAutomationFramework[] = [
  {
    provision: 'Cashless Claim Auto-Approval',
    description: 'Health insurance cashless claims up to ₹1 Lakh must be auto-approved within 1 hour if all documents are submitted. TAT mandate for insurers.',
    effectiveDate: '2026-04-01',
    impactLevel: 'high',
    chatbotImplication: 'Agar aapka cashless claim ₹1 Lakh tak hai aur documents complete hain, toh 1 ghante mein auto-approval aana chahiye. Agar nahi aaya toh grievance file karein.',
    dataSource: CLAIM_AUTOMATION_DATA_SOURCE,
  },
  {
    provision: 'Reimbursement Claim TAT: 7 Days',
    description: 'All reimbursement claims with complete documentation must be processed within 7 working days. Failure results in penal interest at 2% above bank rate.',
    effectiveDate: '2026-04-01',
    impactLevel: 'high',
    chatbotImplication: 'Reimbursement claim 7 working days mein process hona chahiye. Agar delay hua toh insurer ko 2% extra interest (bank rate + 2%) dena padega.',
  },
  {
    provision: 'Fraud Detection Framework — Red Flags',
    description: 'IRDAI has defined 15 red-flag indicators for claim fraud. Insurers must use AI/ML models for fraud detection and report suspicious claims to FMU.',
    effectiveDate: '2026-04-01',
    impactLevel: 'high',
    chatbotImplication: 'Insurer aapke claim ko fraud ke liye check karega — 15 red-flag indicators hain. Agar claim genuine hai, no worry. Documents properly rakhein.',
  },
  {
    provision: 'Claim Intimation via Digital Channels',
    description: 'All insurers must accept claim intimation via WhatsApp, SMS, app, and website. No mandatory physical submission for claims under ₹5 Lakh.',
    effectiveDate: '2026-04-01',
    impactLevel: 'medium',
    chatbotImplication: 'Ab claim WhatsApp ya SMS se bhi kar sakte hain! ₹5 Lakh tak ke claims ke liye physical documents zaroori nahi.',
  },
  {
    provision: 'No Claim Rejection Without Explanation',
    description: 'Insurers cannot reject claims without providing detailed written reasons. Policyholder has 30 days to appeal rejection to IRDAI.',
    effectiveDate: '2026-04-01',
    impactLevel: 'high',
    chatbotImplication: 'Agar claim reject hota hai, toh insurer ko reason dena padega. Aap 30 din mein IRDAI se appeal kar sakte hain.',
  },
  {
    provision: 'AI/ML-Based Claim Scoring',
    description: 'Every claim must be scored using AI/ML model. High-risk claims flagged for manual review, low-risk claims auto-processed. Model must be IRDAI-approved.',
    effectiveDate: '2026-04-01',
    impactLevel: 'medium',
    chatbotImplication: 'Aapke claim ka AI score hoga — low risk = fast processing, high risk = manual review. Genuine claims mein koi dikkat nahi.',
  },
  {
    provision: 'Real-Time Claim Tracking',
    description: 'Policyholders must be able to track claim status in real-time via insurer app/website. Mandatory SMS/WhatsApp updates at each stage.',
    effectiveDate: '2026-04-01',
    impactLevel: 'medium',
    chatbotImplication: 'Ab claim status real-time track kar sakte hain — app ya website pe. Har stage pe SMS/WhatsApp update aayega.',
  },
  {
    provision: 'Free Look Period: 30 Days (Digital)',
    description: 'For policies bought digitally, free look period extended from 15 to 30 days. Policy can be cancelled with full refund (minus stamp duty & medical tests).',
    effectiveDate: '2026-04-01',
    impactLevel: 'medium',
    chatbotImplication: 'Digital policy khareedi? 30 din ka free look period hai — pasand na aaye toh cancel karein, refund mil jayega (stamp duty & medical test cost minus).',
  },
  {
    provision: 'Grievance Redressal TAT: 15 Days',
    description: 'All insurer-level grievances must be resolved within 15 working days. Escalation to Ombudsman if unresolved.',
    effectiveDate: '2026-04-01',
    impactLevel: 'high',
    chatbotImplication: 'Complaint 15 working days mein resolve hona chahiye. Agar nahi hua toh Insurance Ombudsman se contact karein.',
  },
  {
    provision: 'E-KYC Mandatory for New Policies',
    description: 'All new insurance policies must use e-KYC (Aadhaar-based or DigiLocker). No physical KYC documents accepted for policies above ₹5 Lakh SI.',
    effectiveDate: '2026-04-01',
    impactLevel: 'low',
    chatbotImplication: 'Naya policy lene ke liye e-KYC (Aadhaar/DigiLocker) zaroori hai — ₹5 Lakh above ke liye physical KYC nahi chalega.',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 5. TP MOTOR & OD PREMIUM TRENDS (Quarterly — IRDAI Motor Reports)
// ═══════════════════════════════════════════════════════════════════════════════

export interface MotorPremiumTrend {
  quarter: string;
  tpGrowthPercent: number;
  odGrowthPercent: number;
  carSegment: { tp: number; od: number };
  bikeSegment: { tp: number; od: number };
  commercialSegment: { tp: number; od: number };
  evSegment: { tp: number; od: number; avgIDV: number };
  dataSource: DataSourceMeta;
}

export const MOTOR_PREMIUM_DATA_SOURCE: DataSourceMeta = {
  source: 'IRDAI Motor Insurance Quarterly Reports',
  publishFrequency: 'quarterly',
  lastUpdated: '2025-12-31',
  nextExpectedUpdate: '2026-03-31',
  reliability: 'official',
  url: 'https://www.irdai.gov.in/',
};

export const MOTOR_PREMIUM_TRENDS: MotorPremiumTrend[] = [
  {
    quarter: 'Q1 2024-25',
    tpGrowthPercent: 7.5,
    odGrowthPercent: 8.2,
    carSegment: { tp: 7850, od: 24500 },
    bikeSegment: { tp: 2150, od: 4800 },
    commercialSegment: { tp: 18200, od: 52000 },
    evSegment: { tp: 7200, od: 22800, avgIDV: 1500000 },
    dataSource: MOTOR_PREMIUM_DATA_SOURCE,
  },
  {
    quarter: 'Q2 2024-25',
    tpGrowthPercent: 8.2,
    odGrowthPercent: 8.8,
    carSegment: { tp: 8100, od: 25200 },
    bikeSegment: { tp: 2200, od: 4950 },
    commercialSegment: { tp: 18800, od: 53500 },
    evSegment: { tp: 7500, od: 23500, avgIDV: 1600000 },
    dataSource: MOTOR_PREMIUM_DATA_SOURCE,
  },
  {
    quarter: 'Q3 2024-25',
    tpGrowthPercent: 8.8,
    odGrowthPercent: 9.2,
    carSegment: { tp: 8350, od: 25900 },
    bikeSegment: { tp: 2280, od: 5100 },
    commercialSegment: { tp: 19500, od: 54800 },
    evSegment: { tp: 7800, od: 24200, avgIDV: 1750000 },
    dataSource: MOTOR_PREMIUM_DATA_SOURCE,
  },
  {
    quarter: 'Q4 2024-25',
    tpGrowthPercent: 9.0,
    odGrowthPercent: 9.0,
    carSegment: { tp: 8600, od: 26500 },
    bikeSegment: { tp: 2350, od: 5200 },
    commercialSegment: { tp: 20100, od: 56000 },
    evSegment: { tp: 8100, od: 25000, avgIDV: 2000000 },
    dataSource: MOTOR_PREMIUM_DATA_SOURCE,
  },
  {
    quarter: 'Q1 2025-26',
    tpGrowthPercent: 9.2,
    odGrowthPercent: 9.5,
    carSegment: { tp: 8900, od: 27200 },
    bikeSegment: { tp: 2420, od: 5350 },
    commercialSegment: { tp: 20800, od: 57500 },
    evSegment: { tp: 8400, od: 25800, avgIDV: 2200000 },
    dataSource: MOTOR_PREMIUM_DATA_SOURCE,
  },
];

/** Key motor premium insight */
export const MOTOR_PREMIUM_KEY_INSIGHTS = {
  tpGrowthYoY: 9,
  odGrowthYoY: 9,
  evPremiumBrackets: '₹20-30 Lakh',
  evAvgPremiumComparedToICE: 1.12, // EV premium ~12% higher
  hinglishSummary: 'TP Motor premium 9% badha hai, OD bhi 9% badha. EV insurance ₹20-30 Lakh bracket mein ICE se ~12% zyada premium hai — battery coverage ke kaaran.',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 6. PROTECTION GAP ANALYSIS (Annual — IRDAI Annual Reports)
// ═══════════════════════════════════════════════════════════════════════════════

export interface ProtectionGapData {
  category: 'health' | 'life' | 'motor' | 'overall';
  year: number;
  individualPolicyPercent: number;
  groupPolicyPercent: number;
  underInsurancePercent: number;
  protectionGapPercent: number;
  totalUninsuredPopulation: number; // in crores
  hinglishInsight: string;
  dataSource: DataSourceMeta;
}

export const PROTECTION_GAP_DATA_SOURCE: DataSourceMeta = {
  source: 'IRDAI Annual Reports / Swiss Re Protection Gap Study',
  publishFrequency: 'annual',
  lastUpdated: '2025-03-31',
  nextExpectedUpdate: '2026-03-31',
  reliability: 'estimated',
  url: 'https://www.irdai.gov.in/',
};

export const PROTECTION_GAP_DATA: ProtectionGapData[] = [
  {
    category: 'health',
    year: 2025,
    individualPolicyPercent: 10.3,
    groupPolicyPercent: 52.8,
    underInsurancePercent: 36.9,
    protectionGapPercent: 86.2,
    totalUninsuredPopulation: 42,
    hinglishInsight: 'Health insurance mein 86.2% protection gap hai — matlab 42 crore log without adequate health cover hain. Sirf 10.3% ke paas individual policy hai.',
    dataSource: PROTECTION_GAP_DATA_SOURCE,
  },
  {
    category: 'life',
    year: 2025,
    individualPolicyPercent: 18.5,
    groupPolicyPercent: 31.2,
    underInsurancePercent: 50.3,
    protectionGapPercent: 73.8,
    totalUninsuredPopulation: 65,
    hinglishInsight: 'Life insurance mein 73.8% gap hai — 65 crore log adequately insured nahi hain. LIC ke baavajood actual cover bahut kam hai.',
    dataSource: PROTECTION_GAP_DATA_SOURCE,
  },
  {
    category: 'motor',
    year: 2025,
    individualPolicyPercent: 55.2,
    groupPolicyPercent: 12.8,
    underInsurancePercent: 32.0,
    protectionGapPercent: 44.8,
    totalUninsuredPopulation: 22,
    hinglishInsight: 'Motor insurance mein 44.8% gap hai — TP toh mandatory hai lekin comprehensive wale sirf 55% hain. 22 crore vehicles uninsured ya under-insured.',
    dataSource: PROTECTION_GAP_DATA_SOURCE,
  },
  {
    category: 'overall',
    year: 2025,
    individualPolicyPercent: 10.3,
    groupPolicyPercent: 89.7,
    underInsurancePercent: 45.0,
    protectionGapPercent: 83.5,
    totalUninsuredPopulation: 95,
    hinglishInsight: 'Overall 83.5% protection gap — India mein 95 crore log adequately insured nahi hain. Sirf 10.3% ke paas individual policy hai, baaki sab group/government pe dependent.',
    dataSource: PROTECTION_GAP_DATA_SOURCE,
  },
  // Year-over-year for overall
  {
    category: 'overall',
    year: 2021,
    individualPolicyPercent: 9.1,
    groupPolicyPercent: 90.9,
    underInsurancePercent: 48.2,
    protectionGapPercent: 85.8,
    totalUninsuredPopulation: 102,
    hinglishInsight: '2021 mein 85.8% protection gap tha — slowly improving but still massive.',
    dataSource: PROTECTION_GAP_DATA_SOURCE,
  },
  {
    category: 'overall',
    year: 2022,
    individualPolicyPercent: 9.4,
    groupPolicyPercent: 90.6,
    underInsurancePercent: 47.0,
    protectionGapPercent: 85.2,
    totalUninsuredPopulation: 100,
    hinglishInsight: '2022 mein slight improvement — 85.2% gap.',
    dataSource: PROTECTION_GAP_DATA_SOURCE,
  },
  {
    category: 'overall',
    year: 2023,
    individualPolicyPercent: 9.8,
    groupPolicyPercent: 90.2,
    underInsurancePercent: 46.2,
    protectionGapPercent: 84.5,
    totalUninsuredPopulation: 98,
    hinglishInsight: '2023 mein 84.5% gap — digital channels se thoda improve ho raha hai.',
    dataSource: PROTECTION_GAP_DATA_SOURCE,
  },
  {
    category: 'overall',
    year: 2024,
    individualPolicyPercent: 10.0,
    groupPolicyPercent: 90.0,
    underInsurancePercent: 45.5,
    protectionGapPercent: 84.0,
    totalUninsuredPopulation: 96,
    hinglishInsight: '2024 mein 84% gap — Ayushman Bharat se kuch improvement.',
    dataSource: PROTECTION_GAP_DATA_SOURCE,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 7. INSURANCE OMBUDSMAN CASE STUDIES (Quarterly — IRDAI Ombudsman)
// ═══════════════════════════════════════════════════════════════════════════════

export interface OmbudsmanData {
  year: number;
  totalCases: number;
  resolvedFavorOfPolicyholder: number;
  topCategories: { category: string; count: number; avgResolutionDays: number }[];
  disputeResolutionScript: string; // Hinglish script for chatbot
  dataSource: DataSourceMeta;
}

export const OMBUDSMAN_DATA_SOURCE: DataSourceMeta = {
  source: 'IRDAI Ombudsman Annual Reports',
  publishFrequency: 'quarterly',
  lastUpdated: '2025-12-31',
  nextExpectedUpdate: '2026-03-31',
  reliability: 'official',
  url: 'https://www.irdai.gov.in/',
};

export const OMBUDSMAN_DATA: OmbudsmanData[] = [
  {
    year: 2025,
    totalCases: 45820,
    resolvedFavorOfPolicyholder: 68,
    topCategories: [
      { category: 'Claim Repudiation (Health)', count: 14200, avgResolutionDays: 45 },
      { category: 'Claim Delay', count: 8900, avgResolutionDays: 32 },
      { category: 'Premium Dispute', count: 6500, avgResolutionDays: 28 },
      { category: 'Policy Terms Mis-selling', count: 5800, avgResolutionDays: 55 },
      { category: 'Motor Claim Settlement', count: 4200, avgResolutionDays: 38 },
      { category: 'Cashless Denial', count: 3800, avgResolutionDays: 25 },
      { category: 'Refund Issues', count: 2420, avgResolutionDays: 20 },
    ],
    disputeResolutionScript: 'Agar aapka claim reject ho gaya hai ya insurer sahi se respond nahi kar raha, toh Insurance Ombudsman se complaint kar sakte hain. Yeh free service hai! 68% cases policyholder ke favor mein settle hote hain. Complaint online bhi kar sakte hain: https://bimabharosa.irdai.gov.in',
    dataSource: OMBUDSMAN_DATA_SOURCE,
  },
  {
    year: 2024,
    totalCases: 38500,
    resolvedFavorOfPolicyholder: 65,
    topCategories: [
      { category: 'Claim Repudiation (Health)', count: 11800, avgResolutionDays: 48 },
      { category: 'Claim Delay', count: 7500, avgResolutionDays: 35 },
      { category: 'Premium Dispute', count: 5800, avgResolutionDays: 30 },
      { category: 'Policy Terms Mis-selling', count: 5200, avgResolutionDays: 58 },
      { category: 'Motor Claim Settlement', count: 3800, avgResolutionDays: 40 },
      { category: 'Cashless Denial', count: 2900, avgResolutionDays: 28 },
      { category: 'Refund Issues', count: 1500, avgResolutionDays: 22 },
    ],
    disputeResolutionScript: 'Ombudsman se complaint karna free hai. 65% cases policyholder ke favor mein settle hote hain. Online complaint: bimabharosa.irdai.gov.in',
    dataSource: OMBUDSMAN_DATA_SOURCE,
  },
  {
    year: 2023,
    totalCases: 32100,
    resolvedFavorOfPolicyholder: 62,
    topCategories: [
      { category: 'Claim Repudiation (Health)', count: 9800, avgResolutionDays: 52 },
      { category: 'Claim Delay', count: 6200, avgResolutionDays: 38 },
      { category: 'Premium Dispute', count: 5100, avgResolutionDays: 32 },
      { category: 'Policy Terms Mis-selling', count: 4600, avgResolutionDays: 60 },
      { category: 'Motor Claim Settlement', count: 3400, avgResolutionDays: 42 },
      { category: 'Cashless Denial', count: 2000, avgResolutionDays: 30 },
      { category: 'Refund Issues', count: 1000, avgResolutionDays: 25 },
    ],
    disputeResolutionScript: 'Ombudsman complaint process free hai — 62% cases mein policyholder ko relief milta hai. Online file karein.',
    dataSource: OMBUDSMAN_DATA_SOURCE,
  },
  {
    year: 2022,
    totalCases: 27800,
    resolvedFavorOfPolicyholder: 60,
    topCategories: [
      { category: 'Claim Repudiation (Health)', count: 8500, avgResolutionDays: 55 },
      { category: 'Claim Delay', count: 5400, avgResolutionDays: 40 },
      { category: 'Premium Dispute', count: 4500, avgResolutionDays: 35 },
      { category: 'Policy Terms Mis-selling', count: 4000, avgResolutionDays: 62 },
      { category: 'Motor Claim Settlement', count: 3000, avgResolutionDays: 45 },
      { category: 'Cashless Denial', count: 1500, avgResolutionDays: 32 },
      { category: 'Refund Issues', count: 900, avgResolutionDays: 28 },
    ],
    disputeResolutionScript: 'Insurance Ombudsman se complaint karein — free service, 60% cases mein relief milta hai.',
    dataSource: OMBUDSMAN_DATA_SOURCE,
  },
  {
    year: 2021,
    totalCases: 24500,
    resolvedFavorOfPolicyholder: 58,
    topCategories: [
      { category: 'Claim Repudiation (Health)', count: 7500, avgResolutionDays: 58 },
      { category: 'Claim Delay', count: 4800, avgResolutionDays: 42 },
      { category: 'Premium Dispute', count: 4000, avgResolutionDays: 38 },
      { category: 'Policy Terms Mis-selling', count: 3600, avgResolutionDays: 65 },
      { category: 'Motor Claim Settlement', count: 2700, avgResolutionDays: 48 },
      { category: 'Cashless Denial', count: 1200, avgResolutionDays: 35 },
      { category: 'Refund Issues', count: 700, avgResolutionDays: 30 },
    ],
    disputeResolutionScript: 'Ombudsman complaint free hai — 58% cases mein policyholder ko favor milta hai.',
    dataSource: OMBUDSMAN_DATA_SOURCE,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 8. INFRA ASSETS INSURED (IRDAI)
// ═══════════════════════════════════════════════════════════════════════════════

export interface InfraAssetData {
  sector: string;
  totalAssetValue: number;      // ₹ crore
  insuredValue: number;         // ₹ crore
  coverageRatio: number;        // percentage
  keyInsurers: string[];
  growthRate: number;           // YoY growth %
  hinglishNote: string;
  dataSource: DataSourceMeta;
}

export const INFRA_ASSET_DATA_SOURCE: DataSourceMeta = {
  source: 'IRDAI Annual Report — Infrastructure Insurance Section',
  publishFrequency: 'annual',
  lastUpdated: '2025-03-31',
  nextExpectedUpdate: '2026-03-31',
  reliability: 'estimated',
  url: 'https://www.irdai.gov.in/',
};

export const INFRA_ASSETS_INSURED: InfraAssetData[] = [
  {
    sector: 'Power & Energy',
    totalAssetValue: 2500000,
    insuredValue: 625000,
    coverageRatio: 25,
    keyInsurers: ['New India Assurance', 'United India', 'ICICI Lombard', 'HDFC ERGO'],
    growthRate: 14.5,
    hinglishNote: 'Power sector mein sirf 25% assets insured hain — 75% uninsured! Renewable energy projects ka insurance ab badh raha hai.',
    dataSource: INFRA_ASSET_DATA_SOURCE,
  },
  {
    sector: 'Transportation (Roads, Rail, Metro)',
    totalAssetValue: 1800000,
    insuredValue: 414000,
    coverageRatio: 23,
    keyInsurers: ['New India Assurance', 'SBI General', 'Bajaj Allianz'],
    growthRate: 12.0,
    hinglishNote: 'Transport infrastructure mein bhi sirf 23% covered — highways, metro sab under-insured.',
    dataSource: INFRA_ASSET_DATA_SOURCE,
  },
  {
    sector: 'Telecom & Digital',
    totalAssetValue: 800000,
    insuredValue: 240000,
    coverageRatio: 30,
    keyInsurers: ['ICICI Lombard', 'HDFC ERGO', 'Tata AIG'],
    growthRate: 18.0,
    hinglishNote: 'Telecom sector sabse better insured hai — 30% coverage. Data centers ke liye specialized policies ab available hain.',
    dataSource: INFRA_ASSET_DATA_SOURCE,
  },
  {
    sector: 'Real Estate & Construction',
    totalAssetValue: 3200000,
    insuredValue: 512000,
    coverageRatio: 16,
    keyInsurers: ['New India Assurance', 'Reliance General', 'Bajaj Allianz'],
    growthRate: 10.5,
    hinglishNote: 'Real Estate sabse kam insured — sirf 16%! Builder risk insurance lekin bahut kam log lete hain.',
    dataSource: INFRA_ASSET_DATA_SOURCE,
  },
  {
    sector: 'Healthcare Infrastructure',
    totalAssetValue: 600000,
    insuredValue: 180000,
    coverageRatio: 30,
    keyInsurers: ['Star Health', 'HDFC ERGO', 'ICICI Lombard'],
    growthRate: 22.0,
    hinglishNote: 'Healthcare infra 30% insured — COVID ke baad growth 22% se badhi hai. Hospital property insurance important hai.',
    dataSource: INFRA_ASSET_DATA_SOURCE,
  },
  {
    sector: 'Manufacturing & Industrial',
    totalAssetValue: 2100000,
    insuredValue: 525000,
    coverageRatio: 25,
    keyInsurers: ['New India Assurance', 'ICICI Lombard', 'Tata AIG'],
    growthRate: 9.5,
    hinglishNote: 'Manufacturing mein 25% coverage — machinery breakdown insurance bahut important hai lekin bahut kam log lete hain.',
    dataSource: INFRA_ASSET_DATA_SOURCE,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 9. MEDICAL INFLATION DATA (NHFS Reports)
// ═══════════════════════════════════════════════════════════════════════════════

export interface MedicalInflationData {
  year: number;
  rate: number;
  driver: string;
  regionalVariation: { region: string; rate: number }[];
  impactOnPremiumPercent: number; // How much this adds to premium
  hinglishNote: string;
  dataSource: DataSourceMeta;
}

export const MEDICAL_INFLATION_DATA_SOURCE: DataSourceMeta = {
  source: 'NHFS Reports / Medical Inflation Index India',
  publishFrequency: 'annual',
  lastUpdated: '2025-06-30',
  nextExpectedUpdate: '2026-06-30',
  reliability: 'official',
  url: 'https://main.mohfw.gov.in/',
};

export const MEDICAL_INFLATION_DATA: MedicalInflationData[] = [
  {
    year: 2021,
    rate: 14.5,
    driver: 'COVID-19 pandemic — hospitalization costs surged',
    regionalVariation: [
      { region: 'Metro Cities (Delhi, Mumbai, Bangalore)', rate: 16.2 },
      { region: 'Tier-2 Cities', rate: 13.8 },
      { region: 'Tier-3 & Rural', rate: 11.5 },
      { region: 'South India', rate: 13.0 },
      { region: 'North India', rate: 15.5 },
      { region: 'East India', rate: 12.8 },
      { region: 'West India', rate: 14.2 },
    ],
    impactOnPremiumPercent: 12.5,
    hinglishNote: 'COVID ke kaaran medical inflation 14.5% tak pahunch gaya — hospitalization costs 2x ho gaye the. Isliye health premium mein 12-13% loading aaya.',
    dataSource: MEDICAL_INFLATION_DATA_SOURCE,
  },
  {
    year: 2022,
    rate: 13.8,
    driver: 'Post-COVID recovery — elective surgeries backlog cleared',
    regionalVariation: [
      { region: 'Metro Cities (Delhi, Mumbai, Bangalore)', rate: 15.5 },
      { region: 'Tier-2 Cities', rate: 13.2 },
      { region: 'Tier-3 & Rural', rate: 10.8 },
      { region: 'South India', rate: 12.5 },
      { region: 'North India', rate: 14.8 },
      { region: 'East India', rate: 12.0 },
      { region: 'West India', rate: 13.5 },
    ],
    impactOnPremiumPercent: 11.8,
    hinglishNote: 'Post-COVID backlog clear hone se medical inflation thoda kam hua lekin abhi bhi 13.8% — bahut zyada!',
    dataSource: MEDICAL_INFLATION_DATA_SOURCE,
  },
  {
    year: 2023,
    rate: 12.5,
    driver: 'Medical technology advancement — robotic surgery, targeted therapy',
    regionalVariation: [
      { region: 'Metro Cities (Delhi, Mumbai, Bangalore)', rate: 14.2 },
      { region: 'Tier-2 Cities', rate: 12.0 },
      { region: 'Tier-3 & Rural', rate: 9.8 },
      { region: 'South India', rate: 11.5 },
      { region: 'North India', rate: 13.5 },
      { region: 'East India', rate: 11.0 },
      { region: 'West India', rate: 12.2 },
    ],
    impactOnPremiumPercent: 10.5,
    hinglishNote: 'Medical tech advance ho rahi hai — robotic surgery, targeted therapy — yeh sab expensive hai. 12.5% medical inflation.',
    dataSource: MEDICAL_INFLATION_DATA_SOURCE,
  },
  {
    year: 2024,
    rate: 12.8,
    driver: 'Drug price hike + hospital room rent surge',
    regionalVariation: [
      { region: 'Metro Cities (Delhi, Mumbai, Bangalore)', rate: 14.8 },
      { region: 'Tier-2 Cities', rate: 12.5 },
      { region: 'Tier-3 & Rural', rate: 10.2 },
      { region: 'South India', rate: 12.0 },
      { region: 'North India', rate: 13.8 },
      { region: 'East India', rate: 11.5 },
      { region: 'West India', rate: 12.8 },
    ],
    impactOnPremiumPercent: 11.0,
    hinglishNote: 'Medicine prices + room rent dono badhe. Metro cities mein room rent 15% tak badha. Isliye premium mein loading aata hai.',
    dataSource: MEDICAL_INFLATION_DATA_SOURCE,
  },
  {
    year: 2025,
    rate: 13.0,
    driver: 'Continued hospital cost escalation + advanced treatment adoption',
    regionalVariation: [
      { region: 'Metro Cities (Delhi, Mumbai, Bangalore)', rate: 15.2 },
      { region: 'Tier-2 Cities', rate: 12.8 },
      { region: 'Tier-3 & Rural', rate: 10.5 },
      { region: 'South India', rate: 12.2 },
      { region: 'North India', rate: 14.0 },
      { region: 'East India', rate: 11.8 },
      { region: 'West India', rate: 13.0 },
    ],
    impactOnPremiumPercent: 11.5,
    hinglishNote: 'Medical inflation 13% pe hai — yeh KEY figure hai! Health premium mein ~11-12% loading iske kaaran aata hai. Isliye har saal premium badhta hai.',
    dataSource: MEDICAL_INFLATION_DATA_SOURCE,
  },
];

/** Key medical inflation insight: 13% is the critical figure */
export const MEDICAL_INFLATION_KEY_INSIGHT = {
  currentRate: 13,
  fiveYearAverage: 13.32,
  metroPremium: 15.2,
  ruralPremium: 10.5,
  hinglishSummary: 'Medical inflation 13% hai — general inflation (5-6%) se DOUBLE! Yahi wajah hai ki health insurance premium har saal 10-15% badhta hai. Insurer log ke paas aur choice nahi — hospital costs badh rahe hain.',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 10. GLOBAL NON-LIFE BENCHMARKS (Swiss Re — Annual)
// ═══════════════════════════════════════════════════════════════════════════════

export interface GlobalBenchmarkData {
  country: string;
  nonLifePenetrationPercent: number;
  lifePenetrationPercent: number;
  overallPenetrationPercent: number;
  gdpPerCapita: number;        // USD
  insuranceDensity: number;    // Premium per capita in USD
  growthPotential: 'very-high' | 'high' | 'medium' | 'low';
  hinglishNote: string;
  dataSource: DataSourceMeta;
}

export const GLOBAL_BENCHMARK_DATA_SOURCE: DataSourceMeta = {
  source: 'Swiss Re Sigma Report 2025',
  publishFrequency: 'annual',
  lastUpdated: '2025-06-30',
  nextExpectedUpdate: '2026-06-30',
  reliability: 'official',
  url: 'https://www.swissre.com/institute/research/sigma-research.html',
};

export const GLOBAL_NON_LIFE_BENCHMARKS: GlobalBenchmarkData[] = [
  {
    country: 'India',
    nonLifePenetrationPercent: 1.0,
    lifePenetrationPercent: 2.7,
    overallPenetrationPercent: 3.7,
    gdpPerCapita: 2850,
    insuranceDensity: 78,
    growthPotential: 'very-high',
    hinglishNote: 'India non-life penetration sirf 1% — global average 4.3% se bahut neeche. But iska matlab growth potential bahut zyada hai!',
    dataSource: GLOBAL_BENCHMARK_DATA_SOURCE,
  },
  {
    country: 'China',
    nonLifePenetrationPercent: 1.9,
    lifePenetrationPercent: 2.0,
    overallPenetrationPercent: 3.9,
    gdpPerCapita: 12720,
    insuranceDensity: 490,
    growthPotential: 'high',
    hinglishNote: 'China bhi developing hai lekin non-life 1.9% — India se almost double. Lekin gap abhi bhi hai global average se.',
    dataSource: GLOBAL_BENCHMARK_DATA_SOURCE,
  },
  {
    country: 'Brazil',
    nonLifePenetrationPercent: 2.3,
    lifePenetrationPercent: 2.5,
    overallPenetrationPercent: 4.8,
    gdpPerCapita: 8920,
    insuranceDensity: 312,
    growthPotential: 'high',
    hinglishNote: 'Brazil non-life 2.3% — India se zyada. Similar developing economy lekin insurance penetration better.',
    dataSource: GLOBAL_BENCHMARK_DATA_SOURCE,
  },
  {
    country: 'United Kingdom',
    nonLifePenetrationPercent: 2.8,
    lifePenetrationPercent: 6.5,
    overallPenetrationPercent: 9.3,
    gdpPerCapita: 46125,
    insuranceDensity: 4285,
    growthPotential: 'low',
    hinglishNote: 'UK mature market — 2.8% non-life, overall 9.3%. India ko yahan pahunchne mein 20-25 saal lagenge.',
    dataSource: GLOBAL_BENCHMARK_DATA_SOURCE,
  },
  {
    country: 'United States',
    nonLifePenetrationPercent: 4.1,
    lifePenetrationPercent: 3.5,
    overallPenetrationPercent: 7.6,
    gdpPerCapita: 76330,
    insuranceDensity: 7800,
    growthPotential: 'low',
    hinglishNote: 'USA non-life 4.1% — global average ke paas. India ka 1% iska 4th part hai. Massive growth opportunity!',
    dataSource: GLOBAL_BENCHMARK_DATA_SOURCE,
  },
  {
    country: 'Japan',
    nonLifePenetrationPercent: 2.1,
    lifePenetrationPercent: 5.2,
    overallPenetrationPercent: 7.3,
    gdpPerCapita: 33815,
    insuranceDensity: 2468,
    growthPotential: 'low',
    hinglishNote: 'Japan mature market — non-life 2.1%. Earthquake insurance ka unique model hai.',
    dataSource: GLOBAL_BENCHMARK_DATA_SOURCE,
  },
  {
    country: 'Global Average',
    nonLifePenetrationPercent: 4.3,
    lifePenetrationPercent: 3.2,
    overallPenetrationPercent: 7.5,
    gdpPerCapita: 12647,
    insuranceDensity: 950,
    growthPotential: 'medium',
    hinglishNote: 'Global non-life average 4.3% — India ka 1% sirf 23% hai iska. India ko 4.3% tak pahunchne ke liye 4x growth chahiye.',
    dataSource: GLOBAL_BENCHMARK_DATA_SOURCE,
  },
];

/** Key benchmark insight */
export const GLOBAL_BENCHMARK_KEY_INSIGHT = {
  indiaNonLifePercent: 1.0,
  globalAverageNonLife: 4.3,
  gapFactor: 4.3,  // India is 4.3x below global average
  hinglishSummary: 'India non-life insurance penetration sirf 1% hai — global average 4.3% hai. Matlab India 4.3 times peeche hai! But iska ek hi matlab hai — MASSIVE growth potential. Next 10 years mein India insurance market sabse tez growing hoga.',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 11. SOLVENCY RATIOS (Annual — IRDAI Handbook)
// ═══════════════════════════════════════════════════════════════════════════════

export interface SolvencyData {
  insurer: string;
  solvencyRatio: number;
  minimumRequired: number;
  buffer: number;
  category: 'health' | 'life' | 'general';
  sector: 'public' | 'private' | 'standalone-health';
  year: number;
  hinglishNote: string;
  dataSource: DataSourceMeta;
}

export const SOLVENCY_DATA_SOURCE: DataSourceMeta = {
  source: 'IRDAI Handbook 2025-26 — Solvency Ratios',
  publishFrequency: 'annual',
  lastUpdated: '2025-06-15',
  nextExpectedUpdate: '2026-06-15',
  reliability: 'official',
  url: 'https://www.irdai.gov.in/',
};

export const SOLVENCY_DATA: SolvencyData[] = [
  {
    insurer: 'Acko General Insurance',
    solvencyRatio: 2.85,
    minimumRequired: 1.5,
    buffer: 1.35,
    category: 'general',
    sector: 'private',
    year: 2025,
    hinglishNote: 'Acko solvency 2.85 — minimum 1.5 se 90% zyada! Bahut strong financial position.',
    dataSource: SOLVENCY_DATA_SOURCE,
  },
  {
    insurer: 'HDFC ERGO General Insurance',
    solvencyRatio: 2.12,
    minimumRequired: 1.5,
    buffer: 0.62,
    category: 'general',
    sector: 'private',
    year: 2025,
    hinglishNote: 'HDFC ERGO solvency 2.12 — comfortable buffer ke saath. Reliable insurer.',
    dataSource: SOLVENCY_DATA_SOURCE,
  },
  {
    insurer: 'ICICI Lombard General Insurance',
    solvencyRatio: 2.05,
    minimumRequired: 1.5,
    buffer: 0.55,
    category: 'general',
    sector: 'private',
    year: 2025,
    hinglishNote: 'ICICI Lombard solvency 2.05 — minimum se 37% zyada. Solid position.',
    dataSource: SOLVENCY_DATA_SOURCE,
  },
  {
    insurer: 'Star Health & Allied Insurance',
    solvencyRatio: 1.82,
    minimumRequired: 1.5,
    buffer: 0.32,
    category: 'health',
    sector: 'standalone-health',
    year: 2025,
    hinglishNote: 'Star Health solvency 1.82 — OK hai lekin buffer kam hai. Watch karna padega.',
    dataSource: SOLVENCY_DATA_SOURCE,
  },
  {
    insurer: 'New India Assurance',
    solvencyRatio: 1.72,
    minimumRequired: 1.5,
    buffer: 0.22,
    category: 'general',
    sector: 'public',
    year: 2025,
    hinglishNote: 'New India solvency 1.72 — government backing hai lekin buffer tight hai.',
    dataSource: SOLVENCY_DATA_SOURCE,
  },
  {
    insurer: 'United India Insurance',
    solvencyRatio: 1.58,
    minimumRequired: 1.5,
    buffer: 0.08,
    category: 'general',
    sector: 'public',
    year: 2025,
    hinglishNote: 'United India solvency 1.58 — minimum ke bahut paas! Government support lekin risk zyada hai.',
    dataSource: SOLVENCY_DATA_SOURCE,
  },
  {
    insurer: 'Care Health Insurance',
    solvencyRatio: 1.92,
    minimumRequired: 1.5,
    buffer: 0.42,
    category: 'health',
    sector: 'standalone-health',
    year: 2025,
    hinglishNote: 'Care Health solvency 1.92 — decent buffer. Growing company hai.',
    dataSource: SOLVENCY_DATA_SOURCE,
  },
  {
    insurer: 'Niva Bupa Health Insurance',
    solvencyRatio: 1.88,
    minimumRequired: 1.5,
    buffer: 0.38,
    category: 'health',
    sector: 'standalone-health',
    year: 2025,
    hinglishNote: 'Niva Bupa solvency 1.88 — adequate lekin zyada nahi. Fast growth kar rahi hai.',
    dataSource: SOLVENCY_DATA_SOURCE,
  },
  {
    insurer: 'Bajaj Allianz General Insurance',
    solvencyRatio: 2.35,
    minimumRequired: 1.5,
    buffer: 0.85,
    category: 'general',
    sector: 'private',
    year: 2025,
    hinglishNote: 'Bajaj Allianz solvency 2.35 — strong position. Allianz global backing bhi hai.',
    dataSource: SOLVENCY_DATA_SOURCE,
  },
  {
    insurer: 'Tata AIG General Insurance',
    solvencyRatio: 2.22,
    minimumRequired: 1.5,
    buffer: 0.72,
    category: 'general',
    sector: 'private',
    year: 2025,
    hinglishNote: 'Tata AIG solvency 2.22 — Tata + AIG dono strong brands. Reliable choice.',
    dataSource: SOLVENCY_DATA_SOURCE,
  },
  {
    insurer: 'LIC of India',
    solvencyRatio: 1.88,
    minimumRequired: 1.5,
    buffer: 0.38,
    category: 'life',
    sector: 'public',
    year: 2025,
    hinglishNote: 'LIC solvency 1.88 — government backing ke saath solid. 25 crore policies manage karti hai.',
    dataSource: SOLVENCY_DATA_SOURCE,
  },
  {
    insurer: 'HDFC Life',
    solvencyRatio: 2.15,
    minimumRequired: 1.5,
    buffer: 0.65,
    category: 'life',
    sector: 'private',
    year: 2025,
    hinglishNote: 'HDFC Life solvency 2.15 — strong position. HDFC brand trust + good financials.',
    dataSource: SOLVENCY_DATA_SOURCE,
  },
  {
    insurer: 'SBI Life',
    solvencyRatio: 2.08,
    minimumRequired: 1.5,
    buffer: 0.58,
    category: 'life',
    sector: 'private',
    year: 2025,
    hinglishNote: 'SBI Life solvency 2.08 — SBI backing strong hai. Reliable private life insurer.',
    dataSource: SOLVENCY_DATA_SOURCE,
  },
  {
    insurer: 'Reliance General Insurance',
    solvencyRatio: 1.95,
    minimumRequired: 1.5,
    buffer: 0.45,
    category: 'general',
    sector: 'private',
    year: 2025,
    hinglishNote: 'Reliance General solvency 1.95 — adequate position. Reliance brand strong.',
    dataSource: SOLVENCY_DATA_SOURCE,
  },
  {
    insurer: 'National Insurance',
    solvencyRatio: 1.52,
    minimumRequired: 1.5,
    buffer: 0.02,
    category: 'general',
    sector: 'public',
    year: 2025,
    hinglishNote: 'National Insurance solvency 1.52 — BAHUT CLOSE to minimum! Government support lekin personally avoid karna chahiye agar alternative ho.',
    dataSource: SOLVENCY_DATA_SOURCE,
  },
  {
    insurer: 'Oriental Insurance',
    solvencyRatio: 1.55,
    minimumRequired: 1.5,
    buffer: 0.05,
    category: 'general',
    sector: 'public',
    year: 2025,
    hinglishNote: 'Oriental Insurance solvency 1.55 — minimum ke bahut paas! Caution recommended.',
    dataSource: SOLVENCY_DATA_SOURCE,
  },
];

/** IRDAI solvency minimum and industry average */
export const SOLVENCY_KEY_INSIGHTS = {
  irdaiMinimum: 1.5,
  industryAverage: 1.95,
  bestInClass: 2.85,  // Acko
  worstInClass: 1.52, // National Insurance
  hinglishSummary: 'IRDAI ka minimum solvency ratio 1.5 hai — iske neeche koi insurer nahi ho sakta. Industry average 1.95 hai. Acko sabse strong hai 2.85 pe, public sector insurers minimum ke paas hain.',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 12. EV INSURANCE STATS (₹20-30 Lakh bracket)
// ═══════════════════════════════════════════════════════════════════════════════

export interface EVInsuranceData {
  year: number;
  evAdoptionPercent: number;
  avgPremiumEV: number;          // Annual premium for EV (₹20-30L bracket)
  avgPremiumICE: number;         // Annual premium for ICE equivalent
  premiumDifferencePercent: number;
  batteryCoverageClaims: number;
  segmentGrowthPercent: number;
  topEVInsurers: string[];
  hinglishNote: string;
  dataSource: DataSourceMeta;
}

export const EV_INSURANCE_DATA_SOURCE: DataSourceMeta = {
  source: 'IRDAI Motor Reports / EV Insurance Industry Data',
  publishFrequency: 'annual',
  lastUpdated: '2025-12-31',
  nextExpectedUpdate: '2026-12-31',
  reliability: 'estimated',
  url: 'https://www.irdai.gov.in/',
};

export const EV_INSURANCE_DATA: EVInsuranceData[] = [
  {
    year: 2021,
    evAdoptionPercent: 1.2,
    avgPremiumEV: 38500,
    avgPremiumICE: 32200,
    premiumDifferencePercent: 19.6,
    batteryCoverageClaims: 320,
    segmentGrowthPercent: 85,
    topEVInsurers: ['Tata AIG', 'ICICI Lombard', 'HDFC ERGO'],
    hinglishNote: '2021 mein EV insurance nayi cheez thi — premium ICE se 20% zyada. Battery coverage claims kam the kyunki fleet chhoti thi.',
    dataSource: EV_INSURANCE_DATA_SOURCE,
  },
  {
    year: 2022,
    evAdoptionPercent: 3.5,
    avgPremiumEV: 36800,
    avgPremiumICE: 31500,
    premiumDifferencePercent: 16.8,
    batteryCoverageClaims: 1250,
    segmentGrowthPercent: 180,
    topEVInsurers: ['Tata AIG', 'ICICI Lombard', 'HDFC ERGO', 'Acko'],
    hinglishNote: '2022 mein EV sales 3x ho gayi — insurance bhi badhi. Premium gap thoda kam hua 17% pe.',
    dataSource: EV_INSURANCE_DATA_SOURCE,
  },
  {
    year: 2023,
    evAdoptionPercent: 6.8,
    avgPremiumEV: 35200,
    avgPremiumICE: 30800,
    premiumDifferencePercent: 14.3,
    batteryCoverageClaims: 4800,
    segmentGrowthPercent: 95,
    topEVInsurers: ['Tata AIG', 'Acko', 'ICICI Lombard', 'HDFC ERGO', 'Digit'],
    hinglishNote: '2023 mein EV adoption 6.8% — premium gap 14% tak kam hua. Battery claims badhe — fire incidents ke kaaran.',
    dataSource: EV_INSURANCE_DATA_SOURCE,
  },
  {
    year: 2024,
    evAdoptionPercent: 10.5,
    avgPremiumEV: 34200,
    avgPremiumICE: 30100,
    premiumDifferencePercent: 13.6,
    batteryCoverageClaims: 8200,
    segmentGrowthPercent: 55,
    topEVInsurers: ['Tata AIG', 'Acko', 'Digit', 'ICICI Lombard', 'HDFC ERGO', 'Bajaj Allianz'],
    hinglishNote: '2024 mein EV 10.5% market share — premium gap 14% pe stable. Battery fire claims ne insurers ko cautious banaya.',
    dataSource: EV_INSURANCE_DATA_SOURCE,
  },
  {
    year: 2025,
    evAdoptionPercent: 15.2,
    avgPremiumEV: 33500,
    avgPremiumICE: 29500,
    premiumDifferencePercent: 13.6,
    batteryCoverageClaims: 12500,
    segmentGrowthPercent: 45,
    topEVInsurers: ['Tata AIG', 'Acko', 'Digit', 'ICICI Lombard', 'HDFC ERGO', 'Bajaj Allianz', 'SBI General'],
    hinglishNote: '2025 mein EV 15.2% market share! ₹20-30 Lakh bracket mein premium ICE se ~12-14% zyada hai. Battery coverage key differentiator hai — Zero Dep with battery cover lena MUST hai.',
    dataSource: EV_INSURANCE_DATA_SOURCE,
  },
];

/** Key EV insurance insight */
export const EV_INSURANCE_KEY_INSIGHTS = {
  evBracket: '₹20-30 Lakh',
  premiumDifferencePercent: 13.6,
  batteryCoverageCritical: true,
  hinglishSummary: 'EV insurance ₹20-30 Lakh bracket mein ICE se ~12-14% zyada premium hai. Battery coverage sabse important add-on hai — bina iske EV insure mat karein! Zero Dep + Battery Cover + Engine Protect combo best hai.',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 13. PIPELINE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface PipelineConfig {
  refreshIntervalMs: number;
  mode: 'scraper' | 'api';
  scraperGitHubActionsWorkflow: string;
  apiEndpoint: string;
  fallbackToStatic: boolean;
  maxRetries: number;
  cacheStrategy: 'stale-while-revalidate' | 'cache-first' | 'network-first';
  supportedDatasets: string[];
}

/** 12-hour refresh interval pipeline config */
export const PIPELINE_CONFIG: PipelineConfig = {
  refreshIntervalMs: 43200000, // 12 hours = 12 * 60 * 60 * 1000
  mode: 'scraper',
  scraperGitHubActionsWorkflow: '.github/workflows/irdai-data-refresh.yml',
  apiEndpoint: '/api/data/irdai-refresh',
  fallbackToStatic: true,
  maxRetries: 3,
  cacheStrategy: 'stale-while-revalidate',
  supportedDatasets: [
    'CSR_ICR_DATA',
    'PENETRATION_DATA',
    'CLAIM_AUTOMATION_FRAMEWORK',
    'MOTOR_PREMIUM_TRENDS',
    'PROTECTION_GAP_DATA',
    'OMBUDSMAN_DATA',
    'INFRA_ASSETS_INSURED',
    'MEDICAL_INFLATION_DATA',
    'GLOBAL_NON_LIFE_BENCHMARKS',
    'SOLVENCY_DATA',
    'EV_INSURANCE_DATA',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// 14. HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get trust score for an insurer based on CSR data.
 * Returns CSR, source, and classification.
 */
export function getTrustScore(insurer: string): {
  csr: number;
  source: string;
  classification: TrustClassification;
  icr: number;
  sector: string;
  hinglishNote: string;
} | null {
  const normalizedInput = insurer.toLowerCase().trim();
  const entry = CSR_ICR_DATA.find(
    (d) =>
      d.insurer.toLowerCase().includes(normalizedInput) ||
      normalizedInput.includes(d.insurer.toLowerCase().split(' ')[0])
  );

  if (!entry) return null;

  let hinglishNote = '';
  if (entry.classification === 'Best') {
    hinglishNote = `${entry.insurer} ka CSR ${entry.csr}% hai — EXCELLENT! Yeh insurer claim settlement mein bahut reliable hai.`;
  } else if (entry.classification === 'Good') {
    hinglishNote = `${entry.insurer} ka CSR ${entry.csr}% hai — Good. Claims properly settle hote hain, lekin Best category mein nahi hai.`;
  } else {
    hinglishNote = `${entry.insurer} ka CSR sirf ${entry.csr}% hai — Needs Improvement. Claims mein dikkat aa sakti hai. Compare karein other insurers se.`;
  }

  return {
    csr: entry.csr,
    source: entry.source,
    classification: entry.classification,
    icr: entry.icr,
    sector: entry.sector,
    hinglishNote,
  };
}

/**
 * Get solvency info for a specific insurer
 */
export function getSolvencyInfo(insurer: string): SolvencyData | null {
  const normalizedInput = insurer.toLowerCase().trim();
  return (
    SOLVENCY_DATA.find(
      (d) =>
        d.insurer.toLowerCase().includes(normalizedInput) ||
        normalizedInput.includes(d.insurer.toLowerCase().split(' ')[0])
    ) ?? null
  );
}

/**
 * Get complaint data for a specific insurer (from complaintData.ts reference format)
 */
export function getComplaintInfo(insurer: string): {
  complaintsPer10k: number;
  pendencyPercent: number;
  sector: string;
} | null {
  // Reference to complaintData format — re-exported here for convenience
  const complaintMap: Record<string, { complaintsPer10k: number; pendencyPercent: number; sector: string }> = {
    'Star Health': { complaintsPer10k: 11.1, pendencyPercent: 12, sector: 'standalone-health' },
    'Care Health': { complaintsPer10k: 12.5, pendencyPercent: 15, sector: 'standalone-health' },
    'Niva Bupa': { complaintsPer10k: 14.5, pendencyPercent: 18, sector: 'standalone-health' },
    'Aditya Birla Health': { complaintsPer10k: 12.7, pendencyPercent: 14, sector: 'standalone-health' },
    'ManipalCigna': { complaintsPer10k: 11.1, pendencyPercent: 10, sector: 'standalone-health' },
    'ICICI Lombard': { complaintsPer10k: 4.9, pendencyPercent: 8, sector: 'private' },
    'HDFC ERGO': { complaintsPer10k: 4.6, pendencyPercent: 7, sector: 'private' },
    'Bajaj Allianz': { complaintsPer10k: 4.6, pendencyPercent: 9, sector: 'private' },
    'Tata AIG': { complaintsPer10k: 5.6, pendencyPercent: 10, sector: 'private' },
    'Acko': { complaintsPer10k: 6.5, pendencyPercent: 6, sector: 'private' },
    'Digit': { complaintsPer10k: 7.4, pendencyPercent: 11, sector: 'private' },
    'SBI General': { complaintsPer10k: 6.4, pendencyPercent: 9, sector: 'private' },
    'Reliance General': { complaintsPer10k: 6.2, pendencyPercent: 12, sector: 'private' },
    'National Insurance': { complaintsPer10k: 8.9, pendencyPercent: 22, sector: 'public' },
    'New India Assurance': { complaintsPer10k: 6.9, pendencyPercent: 18, sector: 'public' },
    'Oriental Insurance': { complaintsPer10k: 8.6, pendencyPercent: 20, sector: 'public' },
    'United India Insurance': { complaintsPer10k: 8.2, pendencyPercent: 19, sector: 'public' },
    'LIC of India': { complaintsPer10k: 0.6, pendencyPercent: 5, sector: 'public' },
    'HDFC Life': { complaintsPer10k: 1.9, pendencyPercent: 4, sector: 'private' },
    'SBI Life': { complaintsPer10k: 1.8, pendencyPercent: 3, sector: 'private' },
    'ICICI Prudential': { complaintsPer10k: 1.9, pendencyPercent: 4, sector: 'private' },
    'Max Life': { complaintsPer10k: 2.0, pendencyPercent: 5, sector: 'private' },
  };

  const normalizedInput = insurer.toLowerCase().trim();
  const key = Object.keys(complaintMap).find(
    (k) =>
      k.toLowerCase().includes(normalizedInput) ||
      normalizedInput.includes(k.toLowerCase().split(' ')[0])
  );

  return key ? complaintMap[key] ?? null : null;
}

/**
 * Get the latest penetration data for a given year
 */
export function getPenetrationData(year?: number): PenetrationData | null {
  if (year) {
    return PENETRATION_DATA.find((d) => d.year === year) ?? null;
  }
  // Return latest
  return PENETRATION_DATA.reduce((latest, d) => (d.year > latest.year ? d : latest));
}

/**
 * Get the latest medical inflation data
 */
export function getLatestMedicalInflation(): MedicalInflationData | null {
  return MEDICAL_INFLATION_DATA.reduce((latest, d) => (d.year > latest.year ? d : latest));
}

/**
 * Get latest motor premium trends
 */
export function getLatestMotorPremium(): MotorPremiumTrend | null {
  return MOTOR_PREMIUM_TRENDS[MOTOR_PREMIUM_TRENDS.length - 1] ?? null;
}

/**
 * Get ombudsman data for a specific year
 */
export function getOmbudsmanData(year?: number): OmbudsmanData | null {
  if (year) {
    return OMBUDSMAN_DATA.find((d) => d.year === year) ?? null;
  }
  return OMBUDSMAN_DATA.reduce((latest, d) => (d.year > latest.year ? d : latest));
}

/**
 * Get EV insurance data for a specific year
 */
export function getEVInsuranceData(year?: number): EVInsuranceData | null {
  if (year) {
    return EV_INSURANCE_DATA.find((d) => d.year === year) ?? null;
  }
  return EV_INSURANCE_DATA.reduce((latest, d) => (d.year > latest.year ? d : latest));
}

/**
 * Get all insurers in a specific trust classification
 */
export function getInsurersByClassification(classification: TrustClassification): CSRICREntry[] {
  return CSR_ICR_DATA.filter((d) => d.classification === classification);
}

/**
 * Get top N insurers by CSR (descending)
 */
export function getTopInsurersByCSR(n: number = 5): CSRICREntry[] {
  return [...CSR_ICR_DATA].sort((a, b) => b.csr - a.csr).slice(0, n);
}

/**
 * Get top N insurers by ICR (ascending — lower is better for insurers,
 * but higher ICR means more claim-friendly for policyholders)
 */
export function getInsurersByICR(n: number = 5, highest: boolean = true): CSRICREntry[] {
  const sorted = [...CSR_ICR_DATA].sort((a, b) =>
    highest ? b.icr - a.icr : a.icr - b.icr
  );
  return sorted.slice(0, n);
}

/**
 * Get claim automation provisions relevant to a specific query
 */
export function getClaimAutomationForQuery(query: string): ClaimAutomationFramework[] {
  const normalizedQuery = query.toLowerCase();
  return CLAIM_AUTOMATION_FRAMEWORK.filter(
    (p) =>
      p.provision.toLowerCase().includes(normalizedQuery) ||
      p.description.toLowerCase().includes(normalizedQuery) ||
      p.chatbotImplication.toLowerCase().includes(normalizedQuery) ||
      normalizedQuery.includes('claim') ||
      normalizedQuery.includes('automation') ||
      normalizedQuery.includes('fmu')
  );
}

/**
 * Build a comprehensive insurer profile combining CSR, Solvency, and Complaint data
 */
export interface InsurerProfile {
  name: string;
  csr: number;
  icr: number;
  classification: TrustClassification;
  solvencyRatio: number;
  solvencyBuffer: number;
  complaintsPer10k: number;
  pendencyPercent: number;
  overallRating: 'excellent' | 'good' | 'average' | 'below-average';
  hinglishSummary: string;
}

export function getInsurerProfile(insurer: string): InsurerProfile | null {
  const trust = getTrustScore(insurer);
  const solvency = getSolvencyInfo(insurer);
  const complaint = getComplaintInfo(insurer);

  if (!trust) return null;

  const solvencyRatio = solvency?.solvencyRatio ?? 0;
  const solvencyBuffer = solvency?.buffer ?? 0;
  const complaintsPer10k = complaint?.complaintsPer10k ?? 0;
  const pendencyPercent = complaint?.pendencyPercent ?? 0;

  // Calculate overall rating
  let score = 0;
  if (trust.classification === 'Best') score += 4;
  else if (trust.classification === 'Good') score += 2;
  else score += 0;

  if (solvencyRatio >= 2.0) score += 3;
  else if (solvencyRatio >= 1.7) score += 2;
  else if (solvencyRatio >= 1.5) score += 1;

  if (complaintsPer10k < 5) score += 3;
  else if (complaintsPer10k < 10) score += 2;
  else if (complaintsPer10k < 15) score += 1;

  let overallRating: InsurerProfile['overallRating'];
  if (score >= 8) overallRating = 'excellent';
  else if (score >= 5) overallRating = 'good';
  else if (score >= 3) overallRating = 'average';
  else overallRating = 'below-average';

  const hinglishSummary = `${trust.csr}% CSR (${trust.classification}), Solvency ${solvencyRatio || 'N/A'}, Complaints ${complaintsPer10k || 'N/A'} per 10K policies. Overall: ${overallRating}.`;

  return {
    name: trust.csr ? insurer : insurer,
    csr: trust.csr,
    icr: trust.icr,
    classification: trust.classification,
    solvencyRatio,
    solvencyBuffer,
    complaintsPer10k,
    pendencyPercent,
    overallRating,
    hinglishSummary,
  };
}

/**
 * Format a number as Indian currency with ₹ symbol
 */
export function formatIRDACurrency(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  return `₹${new Intl.NumberFormat('en-IN').format(amount)}`;
}

/**
 * Get the data freshness status for a dataset
 */
export function getDataFreshness(dataSource: DataSourceMeta): {
  isStale: boolean;
  daysSinceUpdate: number;
  daysUntilNextUpdate: number;
  status: 'fresh' | 'aging' | 'stale' | 'overdue';
} {
  const now = new Date();
  const lastUpdated = new Date(dataSource.lastUpdated);
  const nextExpected = new Date(dataSource.nextExpectedUpdate);

  const daysSinceUpdate = Math.floor(
    (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysUntilNextUpdate = Math.max(
    0,
    Math.floor((nextExpected.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  );

  let status: 'fresh' | 'aging' | 'stale' | 'overdue';
  if (daysSinceUpdate <= 30) status = 'fresh';
  else if (daysSinceUpdate <= 90) status = 'aging';
  else if (daysSinceUpdate <= 365) status = 'stale';
  else status = 'overdue';

  return {
    isStale: daysSinceUpdate > 90,
    daysSinceUpdate,
    daysUntilNextUpdate,
    status,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 15. COMPREHENSIVE CHATBOT KNOWLEDGE BASE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Pre-built knowledge entries for chatbot integration.
 * Each entry maps a topic to relevant data + Hinglish response template.
 */
export interface ChatbotKnowledgeEntry {
  topic: string;
  keywords: string[];
  hinglishResponse: string;
  dataReference: string;
  category: 'csr' | 'penetration' | 'claim' | 'motor' | 'medical' | 'ev' | 'solvency' | 'ombudsman' | 'protection-gap' | 'benchmark';
}

export const CHATBOT_KNOWLEDGE_BASE: ChatbotKnowledgeEntry[] = [
  {
    topic: 'CSR (Claim Settlement Ratio) Explained',
    keywords: ['csr', 'claim settlement', 'claim ratio', 'settlement ratio'],
    hinglishResponse: 'CSR (Claim Settlement Ratio) batata hai ki insurer kitne claims settle karta hai. Agar CSR 99% hai, matlab 100 mein se 99 claims settle hue. Acko ka CSR 99.91% — sabse best! Star Health 82.31% — Needs Improvement. CSR >97% = Best, 90-97% = Good, <90% = Needs Improvement.',
    dataReference: 'CSR_ICR_DATA',
    category: 'csr',
  },
  {
    topic: 'ICR (Incurred Claim Ratio) Explained',
    keywords: ['icr', 'incurred claim', 'claim ratio incurred'],
    hinglishResponse: 'ICR (Incurred Claim Ratio) = Total Claims Paid / Total Premium Collected. Agar ICR 65% hai, matlab insurer ₹100 premium mein se ₹65 claims pe laga raha hai. 40-70% ICR healthy hai insurer ke liye. >100% matlab insurer loss mein hai!',
    dataReference: 'CSR_ICR_DATA',
    category: 'csr',
  },
  {
    topic: 'India Insurance Penetration',
    keywords: ['penetration', 'insurance penetration', 'india penetration', 'coverage'],
    hinglishResponse: 'India mein non-life insurance penetration sirf 1% hai — global average 4.3% hai! Sirf 10.3% logon ke paas individual policy hai, baaki sab group ya government cover pe depend hain. Yeh massive protection gap hai.',
    dataReference: 'PENETRATION_DATA',
    category: 'penetration',
  },
  {
    topic: 'Claim Automation & FMU Guidelines',
    keywords: ['claim automation', 'fmu', 'auto approval', 'claim process', 'claim timing'],
    hinglishResponse: 'IRDAI FMU Guidelines 1 April 2026 se effective hain: Cashless claims ₹1L tak 1 ghante mein auto-approve, Reimbursement 7 days mein process, 15 days mein grievance resolve. Digital channels (WhatsApp/SMS) pe claim karna allowed hai ₹5L tak.',
    dataReference: 'CLAIM_AUTOMATION_FRAMEWORK',
    category: 'claim',
  },
  {
    topic: 'Motor Insurance Premium Trends',
    keywords: ['motor premium', 'tp premium', 'od premium', 'car insurance rate'],
    hinglishResponse: 'TP Motor premium 9% YoY badha, OD bhi 9% badha. Car segment average: TP ₹8,600 + OD ₹26,500. EV premium ICE se ~12-14% zyada hai. EV adoption 15.2% ho gayi hai!',
    dataReference: 'MOTOR_PREMIUM_TRENDS',
    category: 'motor',
  },
  {
    topic: 'Medical Inflation Impact',
    keywords: ['medical inflation', 'health premium increase', 'hospital cost', 'medical cost'],
    hinglishResponse: 'Medical inflation 13% hai — general inflation se DOUBLE! Yahi wajah hai health insurance premium har saal 10-15% badhti hai. Metro cities mein 15%, rural mein 10.5%. Insurer log ke paas choice nahi — hospital costs badh rahe hain.',
    dataReference: 'MEDICAL_INFLATION_DATA',
    category: 'medical',
  },
  {
    topic: 'EV Insurance Guide',
    keywords: ['ev insurance', 'electric car insurance', 'battery coverage', 'ev premium'],
    hinglishResponse: 'EV insurance ₹20-30 Lakh bracket mein ICE se ~12-14% zyada premium hai. Battery coverage sabse important add-on hai — bina iske mat karein! Zero Dep + Battery Cover + Engine Protect combo best hai. Acko aur Tata AIG EV insurance mein leading hain.',
    dataReference: 'EV_INSURANCE_DATA',
    category: 'ev',
  },
  {
    topic: 'Solvency Ratio Explained',
    keywords: ['solvency', 'solvency ratio', 'financial strength', 'insurer strength'],
    hinglishResponse: 'Solvency Ratio = Available Margin / Required Margin. IRDAI minimum 1.5 hai — iske neeche insurer nahi ho sakta. Acko sabse strong hai 2.85 pe. Public sector insurers (National Insurance 1.52, Oriental 1.55) minimum ke paas hain — caution recommended.',
    dataReference: 'SOLVENCY_DATA',
    category: 'solvency',
  },
  {
    topic: 'Insurance Ombudsman',
    keywords: ['ombudsman', 'complaint', 'grievance', 'dispute', 'bimabharosa'],
    hinglishResponse: 'Insurance Ombudsman se complaint karna FREE hai! 2025 mein 68% cases policyholder ke favor mein settle hue. Bima Bharosa portal pe online complaint kar sakte hain. 15 working days mein resolve hona chahiye. Claim repudiation sabse common complaint hai.',
    dataReference: 'OMBUDSMAN_DATA',
    category: 'ombudsman',
  },
  {
    topic: 'Protection Gap in India',
    keywords: ['protection gap', 'under insurance', 'uninsured', 'coverage gap'],
    hinglishResponse: 'India mein 83.5% protection gap hai — 95 crore log adequately insured nahi hain! Health mein 86.2% gap, Life mein 73.8%, Motor mein 44.8%. Sirf 10.3% ke paas individual policy hai.',
    dataReference: 'PROTECTION_GAP_DATA',
    category: 'protection-gap',
  },
  {
    topic: 'Global Insurance Benchmarks',
    keywords: ['global benchmark', 'international insurance', 'swiss re', 'india vs world'],
    hinglishResponse: 'India non-life penetration 1% — global average 4.3%, USA 4.1%, China 1.9%, Brazil 2.3%. India 4.3 times peeche hai! But iska matlab massive growth potential bhi hai. Next 10 years mein India sabse tez growing insurance market hoga.',
    dataReference: 'GLOBAL_NON_LIFE_BENCHMARKS',
    category: 'benchmark',
  },
];

/**
 * Search chatbot knowledge base by keyword
 */
export function searchKnowledgeBase(query: string): ChatbotKnowledgeEntry[] {
  const normalizedQuery = query.toLowerCase().trim();
  const words = normalizedQuery.split(/\s+/);

  return CHATBOT_KNOWLEDGE_BASE.filter((entry) => {
    const keywordMatch = entry.keywords.some((kw) => normalizedQuery.includes(kw));
    const topicMatch = entry.topic.toLowerCase().includes(normalizedQuery);
    const wordMatch = words.some(
      (word) =>
        word.length > 2 &&
        (entry.keywords.some((kw) => kw.includes(word)) ||
          entry.hinglishResponse.toLowerCase().includes(word))
    );
    return keywordMatch || topicMatch || wordMatch;
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// 11. MACRO ANALYTICS & MARKET GROWTH (IRDAI + Economic Survey + Swiss Re)
// ═══════════════════════════════════════════════════════════════════════════════

export interface MacroGrowthData {
  year: number;
  healthGrowthPercent: number;
  nonLifeGrowthPercent: number;
  lifeGrowthPercent: number;
  overallGrowthPercent: number;
  healthPremiumCrore: number;
  nonLifePremiumCrore: number;
  totalPremiumCrore: number;
  projectionTo2030: number; // CAGR %
  dataSource: DataSourceMeta;
}

export const MACRO_GROWTH_DATA_SOURCE: DataSourceMeta = {
  source: 'IRDAI Annual Report 2025-26 / Economic Survey / Swiss Re',
  publishFrequency: 'annual',
  lastUpdated: '2025-06-15',
  nextExpectedUpdate: '2026-06-15',
  reliability: 'official',
  url: 'https://www.irdai.gov.in/',
};

export const MACRO_GROWTH_DATA: MacroGrowthData[] = [
  {
    year: 2021,
    healthGrowthPercent: 20.25,
    nonLifeGrowthPercent: 14.2,
    lifeGrowthPercent: 9.8,
    overallGrowthPercent: 11.5,
    healthPremiumCrore: 73000,
    nonLifePremiumCrore: 215000,
    totalPremiumCrore: 698000,
    projectionTo2030: 6.9,
    dataSource: MACRO_GROWTH_DATA_SOURCE,
  },
  {
    year: 2022,
    healthGrowthPercent: 17.8,
    nonLifeGrowthPercent: 15.5,
    lifeGrowthPercent: 12.1,
    overallGrowthPercent: 13.2,
    healthPremiumCrore: 86000,
    nonLifePremiumCrore: 248000,
    totalPremiumCrore: 790000,
    projectionTo2030: 6.9,
    dataSource: MACRO_GROWTH_DATA_SOURCE,
  },
  {
    year: 2023,
    healthGrowthPercent: 14.2,
    nonLifeGrowthPercent: 13.8,
    lifeGrowthPercent: 10.5,
    overallGrowthPercent: 11.8,
    healthPremiumCrore: 98000,
    nonLifePremiumCrore: 282000,
    totalPremiumCrore: 883000,
    projectionTo2030: 6.9,
    dataSource: MACRO_GROWTH_DATA_SOURCE,
  },
  {
    year: 2024,
    healthGrowthPercent: 11.5,
    nonLifeGrowthPercent: 12.1,
    lifeGrowthPercent: 8.9,
    overallGrowthPercent: 10.2,
    healthPremiumCrore: 109000,
    nonLifePremiumCrore: 316000,
    totalPremiumCrore: 973000,
    projectionTo2030: 6.9,
    dataSource: MACRO_GROWTH_DATA_SOURCE,
  },
  {
    year: 2025,
    healthGrowthPercent: 8.98,
    nonLifeGrowthPercent: 10.5,
    lifeGrowthPercent: 7.2,
    overallGrowthPercent: 8.8,
    healthPremiumCrore: 117000,
    nonLifePremiumCrore: 349000,
    totalPremiumCrore: 1043000,
    projectionTo2030: 6.9,
    dataSource: MACRO_GROWTH_DATA_SOURCE,
  },
];

export const MACRO_GROWTH_KEY_INSIGHTS = {
  healthGrowthDrop: { from: 20.25, to: 8.98, dropPercent: 55.7 },
  projectedCAGRTo2030: 6.9,
  healthPremium2025: '₹1.17L Cr',
  seniorGrowthFY25: 60,
  hinglishSummary: 'Health insurance growth 20.25% se gir ke 8.98% pe aa gaya — 55.7% ka drop! Lekin 2030 tak 6.9% CAGR projected hai. Senior citizens mein 60% growth FY25 mein — yeh segment sabse fast-growing hai.',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 12. PREMIUM DRIFT TRACKER (IRDAI Motor + Health Premium Data)
// ═══════════════════════════════════════════════════════════════════════════════

export interface PremiumDriftEntry {
  category: 'health' | 'motor-tp' | 'motor-od' | 'ev' | 'life-term';
  year: number;
  avgPremiumMonthly: number;
  driftPercent: number; // YoY change
  driver: string;
  alertLevel: 'normal' | 'warning' | 'critical';
  hinglishImpact: string;
  dataSource: DataSourceMeta;
}

export const PREMIUM_DRIFT_DATA_SOURCE: DataSourceMeta = {
  source: 'IRDAI Premium Tracker / Industry Reports',
  publishFrequency: 'quarterly',
  lastUpdated: '2025-12-31',
  nextExpectedUpdate: '2026-03-31',
  reliability: 'official',
  url: 'https://www.irdai.gov.in/',
};

export const PREMIUM_DRIFT_DATA: PremiumDriftEntry[] = [
  // Health premium drift
  { category: 'health', year: 2023, avgPremiumMonthly: 1850, driftPercent: 8.5, driver: 'Medical inflation 13%', alertLevel: 'warning', hinglishImpact: 'Health premium 8.5% badha — medical inflation 13% ki wajah se. Ab ₹1,850/month avg premium.', dataSource: PREMIUM_DRIFT_DATA_SOURCE },
  { category: 'health', year: 2024, avgPremiumMonthly: 2050, driftPercent: 10.8, driver: 'Medical inflation 14% + hospital cost surge', alertLevel: 'warning', hinglishImpact: 'Health premium 10.8% badha — ₹2,050/month ho gaya. Hospital costs 14% badhe hain.', dataSource: PREMIUM_DRIFT_DATA_SOURCE },
  { category: 'health', year: 2025, avgPremiumMonthly: 2250, driftPercent: 9.8, driver: 'Medical inflation 13% + ICR pressure', alertLevel: 'warning', hinglishImpact: '₹2,250/month tak pahunch gaya — 9.8% drift. ICR pressure insurers pe premium badhane pe majboor kar raha hai.', dataSource: PREMIUM_DRIFT_DATA_SOURCE },
  { category: 'health', year: 2026, avgPremiumMonthly: 2520, driftPercent: 12.0, driver: 'Projected: Medical inflation + claim cost rise', alertLevel: 'critical', hinglishImpact: '2026 projection: ₹2,520/month — 12% drift! Early renewal se paisa bachao.', dataSource: PREMIUM_DRIFT_DATA_SOURCE },
  // Motor TP drift
  { category: 'motor-tp', year: 2023, avgPremiumMonthly: 650, driftPercent: 5.0, driver: 'IRDAI TP rate revision', alertLevel: 'normal', hinglishImpact: 'Motor TP premium 5% badha — IRDAI ka rate revision.', dataSource: PREMIUM_DRIFT_DATA_SOURCE },
  { category: 'motor-tp', year: 2024, avgPremiumMonthly: 720, driftPercent: 10.8, driver: 'Accident claims surge + IRDAI revision', alertLevel: 'warning', hinglishImpact: 'TP premium 10.8% badha — ₹720/month. Accident claims badh gaye.', dataSource: PREMIUM_DRIFT_DATA_SOURCE },
  { category: 'motor-tp', year: 2025, avgPremiumMonthly: 810, driftPercent: 12.5, driver: 'Third-party pool losses', alertLevel: 'warning', hinglishImpact: '₹810/month — 12.5% drift! TP pool mein losses badh rahe hain.', dataSource: PREMIUM_DRIFT_DATA_SOURCE },
  { category: 'motor-tp', year: 2026, avgPremiumMonthly: 1010, driftPercent: 25.0, driver: 'IRDAI TP rate hike 2026', alertLevel: 'critical', hinglishImpact: '⚠️ 2026: Motor TP 25% badhne wala hai! ₹1,010/month. Renew BEFORE hike!', dataSource: PREMIUM_DRIFT_DATA_SOURCE },
  // EV premium drift
  { category: 'ev', year: 2023, avgPremiumMonthly: 2800, driftPercent: 12.0, driver: 'EV adoption + battery coverage costs', alertLevel: 'normal', hinglishImpact: 'EV premium ₹2,800/month — ICE se 12% zyada. Battery coverage cost add hua.', dataSource: PREMIUM_DRIFT_DATA_SOURCE },
  { category: 'ev', year: 2024, avgPremiumMonthly: 3200, driftPercent: 14.3, driver: 'EV sales surge + high claims ratio', alertLevel: 'warning', hinglishImpact: 'EV premium 14.3% badha — ₹3,200/month. Claims ratio high hai EV mein.', dataSource: PREMIUM_DRIFT_DATA_SOURCE },
  { category: 'ev', year: 2025, avgPremiumMonthly: 3650, driftPercent: 14.1, driver: '₹20-30L bracket growth + battery tech', alertLevel: 'warning', hinglishImpact: '₹3,650/month — ₹20-30L bracket mein volume badh raha hai.', dataSource: PREMIUM_DRIFT_DATA_SOURCE },
  // Life term drift
  { category: 'life-term', year: 2023, avgPremiumMonthly: 1200, driftPercent: 3.5, driver: 'Mortality rate stabilization', alertLevel: 'normal', hinglishImpact: 'Term insurance premium sirf 3.5% badha — stable mortality rates.', dataSource: PREMIUM_DRIFT_DATA_SOURCE },
  { category: 'life-term', year: 2024, avgPremiumMonthly: 1240, driftPercent: 3.3, driver: 'Competitive pricing by private insurers', alertLevel: 'normal', hinglishImpact: 'Term plan 3.3% drift — private insurers competitive pricing maintain kar rahe.', dataSource: PREMIUM_DRIFT_DATA_SOURCE },
  { category: 'life-term', year: 2025, avgPremiumMonthly: 1280, driftPercent: 3.2, driver: 'Stable mortality + digital distribution', alertLevel: 'normal', hinglishImpact: '₹1,280/month — term insurance sabse stable hai. Digital distribution se cost kam ho raha.', dataSource: PREMIUM_DRIFT_DATA_SOURCE },
];

export const PREMIUM_DRIFT_KEY_INSIGHTS = {
  motorTP2026Hike: 25,
  healthDriftCurrent: 9.8,
  healthDrift2026: 12.0,
  evPremiumVsICE: '+12-14%',
  lifeTermStable: 3.2,
  hinglishSummary: 'Motor TP 2026 mein 25% badhega — CRITICAL alert! Health premium 9.8% drift, 2026 mein 12% tak ja sakta hai. EV premium ICE se 12-14% zyada hai. Term insurance sabse stable hai sirf 3.2% drift.',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// 13. COVERAGE COMPARISON DATA (₹5L vs ₹10L vs ₹25L)
// ═══════════════════════════════════════════════════════════════════════════════

export interface CoverageComparison {
  sumInsured: number;
  label: string;
  avgPremiumMonthly: number;
  csr: number;
  avgClaimAmount: number;
  outOfPocketRisk: string;
  hospitalNetworkCover: string;
  roomRentLimit: string;
  maternityCover: boolean;
  pedWaitingPeriod: number;
  hinglishVerdict: string;
  dataSource: DataSourceMeta;
}

export const COVERAGE_COMPARISON_DATA_SOURCE: DataSourceMeta = {
  source: 'IRDAI Handbook 2025-26 / Industry Premium Analysis',
  publishFrequency: 'annual',
  lastUpdated: '2025-06-15',
  nextExpectedUpdate: '2026-06-15',
  reliability: 'official',
};

export const COVERAGE_COMPARISON_DATA: CoverageComparison[] = [
  {
    sumInsured: 500000,
    label: '₹5 Lakh',
    avgPremiumMonthly: 1200,
    csr: 89.5,
    avgClaimAmount: 45000,
    outOfPocketRisk: 'HIGH — Major surgeries ke liye ₹2-3L extra',
    hospitalNetworkCover: 'Tier 2/3 hospitals — limited metro access',
    roomRentLimit: '1% of SI = ₹5,000/day (shared room)',
    maternityCover: false,
    pedWaitingPeriod: 48,
    hinglishVerdict: '₹5L cover basic hai — ek major illness mein paisa khatam! Sirf emergency ke liye theek hai, surgery ke liye nahi.',
    dataSource: COVERAGE_COMPARISON_DATA_SOURCE,
  },
  {
    sumInsured: 1000000,
    label: '₹10 Lakh',
    avgPremiumMonthly: 2050,
    csr: 94.2,
    avgClaimAmount: 78000,
    outOfPocketRisk: 'MODERATE — Most surgeries covered',
    hospitalNetworkCover: 'Tier 1/2 hospitals — good metro access',
    roomRentLimit: 'Single AC room (₹10,000/day)',
    maternityCover: true,
    pedWaitingPeriod: 36,
    hinglishVerdict: '₹10L sweet spot hai! Most surgeries cover ho jaati hain. Family ke liye minimum yahi lena chahiye.',
    dataSource: COVERAGE_COMPARISON_DATA_SOURCE,
  },
  {
    sumInsured: 2500000,
    label: '₹25 Lakh',
    avgPremiumMonthly: 3800,
    csr: 97.8,
    avgClaimAmount: 125000,
    outOfPocketRisk: 'LOW — Almost everything covered including critical illness',
    hospitalNetworkCover: 'Premium hospitals — full metro + international',
    roomRentLimit: 'No limit — any room category',
    maternityCover: true,
    pedWaitingPeriod: 24,
    hinglishVerdict: '₹25L premium cover hai! Critical illness, international treatment — sab covered. PET wait bhi sirf 24 months.',
    dataSource: COVERAGE_COMPARISON_DATA_SOURCE,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 14. CONSUMER PROTECTION GOVERNANCE (IRDAI + BimaBharosa)
// ═══════════════════════════════════════════════════════════════════════════════

export interface ConsumerProtectionFeature {
  feature: string;
  description: string;
  maxClaimAmount: string;
  process: string;
  hinglishGuide: string;
  source: string;
  dataSource: DataSourceMeta;
}

export const CONSUMER_PROTECTION_DATA_SOURCE: DataSourceMeta = {
  source: 'IRDAI / BimaBharosa Portal / Insurance Ombudsman',
  publishFrequency: 'annual',
  lastUpdated: '2025-12-31',
  nextExpectedUpdate: '2026-12-31',
  reliability: 'official',
  url: 'https://bimabharosa.irdai.gov.in',
};

export const CONSUMER_PROTECTION_FEATURES: ConsumerProtectionFeature[] = [
  {
    feature: 'Automated Ombudsman Referral',
    description: 'Insurance Ombudsman handles complaints up to ₹50 Lakh without any fees. 68% cases resolved in favor of policyholder.',
    maxClaimAmount: '₹50 Lakh',
    process: 'File online → Ombudsman hearing → Decision in 90 days',
    hinglishGuide: 'Ombudsman se complaint karna FREE hai! ₹50 Lakh tak ke claims ke liye. Online file karein: bimabharosa.irdai.gov.in — 68% cases mein aapko favor milta hai.',
    source: 'IRDAI Ombudsman Report 2025',
    dataSource: CONSUMER_PROTECTION_DATA_SOURCE,
  },
  {
    feature: 'FMU Fraud Monitoring',
    description: 'IRDAI Fraud Monitoring Unit (FMU) tracks suspicious claims and insurer practices. 15 red-flag indicators for fraud detection.',
    maxClaimAmount: 'No limit',
    process: 'FMU detects → Insurer investigates → Report to IRDAI → Action',
    hinglishGuide: 'FMU (Fraud Monitoring Unit) insurers ko monitor karta hai — 15 red-flag indicators se fraud detect hote hain. Agar aapka genuine claim reject ho, FMU se bhi complain kar sakte hain.',
    source: 'IRDAI FMU Guidelines 2026',
    dataSource: CONSUMER_PROTECTION_DATA_SOURCE,
  },
  {
    feature: 'BimaBharosa Portal',
    description: 'IRDAI integrated complaint portal for all insurance grievances. Track complaint status in real-time.',
    maxClaimAmount: 'No limit',
    process: 'Register → Insurer gets 15 days → Escalate to IRDAI → Resolution',
    hinglishGuide: 'BimaBharosa portal pe complaint darj karein — insurer ko 15 din mein respond karna padega. Agar nahi kiya toh IRDAI automatically escalate karega.',
    source: 'BimaBharosa Portal',
    dataSource: CONSUMER_PROTECTION_DATA_SOURCE,
  },
  {
    feature: 'Policy Renewal Grace Period',
    description: '30-day grace period for policy renewal. No claim rejection during grace period. Continuous coverage maintained.',
    maxClaimAmount: 'As per policy',
    process: 'Grace period starts → Pay within 30 days → Coverage continues',
    hinglishGuide: 'Policy expire hone ke baad bhi 30 din ka grace period hai — is beech mein claim bhi kar sakte hain! Lekin premium zaroor bharna padega.',
    source: 'IRDAI Policy Terms Guidelines',
    dataSource: CONSUMER_PROTECTION_DATA_SOURCE,
  },
  {
    feature: 'Portability Rights',
    description: 'Switch insurers without losing waiting period credits. IRDAI mandates portability within 7 working days.',
    maxClaimAmount: 'N/A',
    process: 'Apply to new insurer → Portability request → 7 days processing → Switch',
    hinglishGuide: 'Insurer change karna hai? Waiting period ka credit loss nahi hoga! IRDAI portability rules ke under 7 din mein process hona chahiye.',
    source: 'IRDAI Portability Guidelines',
    dataSource: CONSUMER_PROTECTION_DATA_SOURCE,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 15. NOTIFICATION & ALERT SYSTEM DATA
// ═══════════════════════════════════════════════════════════════════════════════

export interface PremiumAlert {
  id: string;
  category: 'motor-tp' | 'health' | 'ev' | 'life';
  title: string;
  titleHi: string;
  message: string;
  messageHi: string;
  effectiveDate: string;
  impactPercent: number;
  severity: 'info' | 'warning' | 'critical';
  actionText: string;
  dataSource: DataSourceMeta;
}

export const PREMIUM_ALERTS: PremiumAlert[] = [
  {
    id: 'motor-tp-2026',
    category: 'motor-tp',
    title: 'Motor TP Premium Hike 2026',
    titleHi: 'मोटर TP प्रीमियम 2026 में बढ़ेगा',
    message: 'Motor Third-Party premium expected to increase by up to 25% in 2026 due to rising accident claims and IRDAI rate revision.',
    messageHi: 'Motor TP premium 2026 mein 25% tak badhne ka possibility hai — accident claims aur IRDAI rate revision ki wajah se. Renew BEFORE the hike!',
    effectiveDate: '2026-04-01',
    impactPercent: 25,
    severity: 'critical',
    actionText: 'Renew Before April 2026',
    dataSource: PREMIUM_DRIFT_DATA_SOURCE,
  },
  {
    id: 'health-drift-2025',
    category: 'health',
    title: 'Health Premium Drift Alert',
    titleHi: 'हेल्थ प्रीमियम ड्रिफ्ट अलर्ट',
    message: 'Health insurance premiums have drifted 9.8% YoY due to 13% medical inflation. 2026 projected drift: 12%.',
    messageHi: 'Health premium 9.8% badh gaya hai — medical inflation 13% ki wajah se. 2026 mein 12% tak ja sakta hai. Early renewal se paisa bachao!',
    effectiveDate: '2025-06-01',
    impactPercent: 12,
    severity: 'warning',
    actionText: 'Compare Health Plans',
    dataSource: PREMIUM_DRIFT_DATA_SOURCE,
  },
  {
    id: 'ev-premium-2025',
    category: 'ev',
    title: 'EV Insurance Premium Rising',
    titleHi: 'EV इंश्योरेंस प्रीमियम बढ़ रहा है',
    message: 'EV insurance premiums are 12-14% higher than ICE vehicles. Battery coverage claims driving the increase.',
    messageHi: 'EV insurance ICE se 12-14% mehenga hai — battery coverage claims badh rahe hain. ₹20-30L bracket mein volume zyada hai.',
    effectiveDate: '2025-01-01',
    impactPercent: 14,
    severity: 'warning',
    actionText: 'Check EV Plans',
    dataSource: PREMIUM_DRIFT_DATA_SOURCE,
  },
];

export interface RenewalReminder {
  stage: number;
  daysBefore: number;
  titleHi: string;
  messageHi: string;
  urgencyLevel: 'low' | 'medium' | 'high';
}

export const RENEWAL_REMINDER_STAGES: RenewalReminder[] = [
  {
    stage: 1,
    daysBefore: 30,
    titleHi: 'पॉलिसी 30 दिन में एक्सपायर होगी',
    messageHi: 'Aapki policy 30 din mein expire hogi. Time hai best plans compare karne ka — renewal se pehle market check karein!',
    urgencyLevel: 'low',
  },
  {
    stage: 2,
    daysBefore: 15,
    titleHi: '⚠️ 15 दिन बचे हैं — जल्दी करें!',
    messageHi: 'Sirf 15 din bach hain! Grace period ke baad waiting period dobara lag jayega. Abhi renew karein ya port karein!',
    urgencyLevel: 'medium',
  },
  {
    stage: 3,
    daysBefore: 1,
    titleHi: '🚨 कल एक्सपायर — आज ही रिन्यू करें!',
    messageHi: 'Kal policy expire ho jayegi! Aaj hi renew karein — varna waiting period + no coverage risk. EMERGENCY renewal karein!',
    urgencyLevel: 'high',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 16. COMPREHENSIVE DATA SUMMARY EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

/** Quick-reference: All data sources and their freshness */
export const ALL_DATA_SOURCES: { name: string; meta: DataSourceMeta }[] = [
  { name: 'CSR & ICR Data', meta: CSR_ICR_DATA_SOURCE },
  { name: 'Penetration Data', meta: PENETRATION_DATA_SOURCE },
  { name: 'Claim Automation Framework', meta: CLAIM_AUTOMATION_DATA_SOURCE },
  { name: 'Motor Premium Trends', meta: MOTOR_PREMIUM_DATA_SOURCE },
  { name: 'Protection Gap Data', meta: PROTECTION_GAP_DATA_SOURCE },
  { name: 'Ombudsman Data', meta: OMBUDSMAN_DATA_SOURCE },
  { name: 'Infra Assets Insured', meta: INFRA_ASSET_DATA_SOURCE },
  { name: 'Medical Inflation Data', meta: MEDICAL_INFLATION_DATA_SOURCE },
  { name: 'Global Non-Life Benchmarks', meta: GLOBAL_BENCHMARK_DATA_SOURCE },
  { name: 'Solvency Data', meta: SOLVENCY_DATA_SOURCE },
  { name: 'EV Insurance Data', meta: EV_INSURANCE_DATA_SOURCE },
  { name: 'Macro Growth Data', meta: MACRO_GROWTH_DATA_SOURCE },
  { name: 'Premium Drift Data', meta: PREMIUM_DRIFT_DATA_SOURCE },
  { name: 'Coverage Comparison Data', meta: COVERAGE_COMPARISON_DATA_SOURCE },
  { name: 'Consumer Protection Data', meta: CONSUMER_PROTECTION_DATA_SOURCE },
];

/** Quick-reference: All key insights combined */
export const ALL_KEY_INSIGHTS = {
  PENETRATION_KEY_INSIGHTS,
  MOTOR_PREMIUM_KEY_INSIGHTS,
  MEDICAL_INFLATION_KEY_INSIGHT,
  GLOBAL_BENCHMARK_KEY_INSIGHT,
  SOLVENCY_KEY_INSIGHTS,
  EV_INSURANCE_KEY_INSIGHTS,
  MACRO_GROWTH_KEY_INSIGHTS,
  PREMIUM_DRIFT_KEY_INSIGHTS,
} as const;

/** Dataset version for cache busting */
export const DATASET_VERSION = '2025.06.15-v1' as const;
