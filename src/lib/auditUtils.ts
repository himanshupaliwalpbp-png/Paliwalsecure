/**
 * Audit Utilities — Mock data and helper functions for the Insurance Reverse Audit feature.
 * 
 * This module provides:
 * - Mock comparison data for demonstration
 * - Audit score calculation helpers
 * - Plan recommendation logic
 * 
 * In production, these would connect to real APIs (PBPartner, insurer databases).
 */

// ── Types ──────────────────────────────────────────────────────────────────

export interface AuditComparison {
  currentPlan: AuditPlanDetails;
  recommendedPlans: AuditPlanDetails[];
  savingsAmount: number;
  savingsPercentage: number;
  healthScore: number;
  riskFactors: RiskFactor[];
}

export interface AuditPlanDetails {
  name: string;
  provider: string;
  category: 'health' | 'term' | 'motor' | 'travel' | 'home';
  premium: {
    monthly: number;
    annual: number;
  };
  claimSettlementRatio: number;
  coverageAmount: number;
  waitingPeriod: {
    initial: number; // days
    ped: number; // months
    specificDiseases: number; // months
  };
  maternityCover: boolean;
  networkHospitals: number;
  roomRentLimit: string;
  addons: string[];
  keyFeatures: string[];
}

export interface RiskFactor {
  type: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  recommendation: string;
}

// ── Mock Comparison Data ──────────────────────────────────────────────────

export const MOCK_CURRENT_PLAN: AuditPlanDetails = {
  name: 'Your Current Plan',
  provider: 'Current Insurer',
  category: 'health',
  premium: { monthly: 708, annual: 8500 },
  claimSettlementRatio: 87,
  coverageAmount: 500000,
  waitingPeriod: { initial: 30, ped: 48, specificDiseases: 24 },
  maternityCover: false,
  networkHospitals: 3500,
  roomRentLimit: 'Capped at ₹3,000/day',
  addons: [],
  keyFeatures: ['Basic hospitalization cover'],
};

export const MOCK_RECOMMENDED_PLANS: AuditPlanDetails[] = [
  {
    name: 'Care Health Insurance',
    provider: 'Care Health',
    category: 'health',
    premium: { monthly: 500, annual: 5600 },
    claimSettlementRatio: 100,
    coverageAmount: 1000000,
    waitingPeriod: { initial: 30, ped: 24, specificDiseases: 12 },
    maternityCover: true,
    networkHospitals: 21700,
    roomRentLimit: 'No limit (Single AC)',
    addons: ['Zero Depreciation', 'Super Top-up', 'Consumables Cover'],
    keyFeatures: [
      '100% CSR — Highest in industry',
      '21,700+ cashless hospitals',
      'PED covered from 24 months',
      'Day 1 cover for accidents',
      'Unlimited automatic restoration',
    ],
  },
  {
    name: 'Acko General Insurance',
    provider: 'Acko',
    category: 'health',
    premium: { monthly: 550, annual: 6200 },
    claimSettlementRatio: 99.91,
    coverageAmount: 1000000,
    waitingPeriod: { initial: 30, ped: 24, specificDiseases: 12 },
    maternityCover: false,
    networkHospitals: 10000,
    roomRentLimit: 'No limit (Single AC)',
    addons: ['Zero Depreciation', 'Super Top-up'],
    keyFeatures: [
      '99.91% CSR',
      '10,000+ cashless hospitals',
      'PED covered from 24 months',
      'Instant claim approval (1 hour)',
      'No co-payment',
    ],
  },
];

// ── Comparison Rows for UI Table ──────────────────────────────────────────

export interface ComparisonRow {
  label: string;
  current: string;
  recommended: string;
  highlight?: boolean;
  isBetter?: boolean;
}

export const MOCK_COMPARISON_ROWS: ComparisonRow[] = [
  { label: 'Annual Premium', current: '₹8,500/yr', recommended: '₹5,600/yr', highlight: true, isBetter: true },
  { label: 'Claim Settlement Ratio', current: '87%', recommended: '100%', isBetter: true },
  { label: 'Coverage Amount', current: '₹5 Lakh', recommended: '₹10 Lakh', isBetter: true },
  { label: 'PED Waiting Period', current: '48 months', recommended: '24 months', isBetter: true },
  { label: 'Maternity Cover', current: '❌ Not covered', recommended: '✅ Covered', isBetter: true },
  { label: 'Network Hospitals', current: '3,500+', recommended: '21,700+', isBetter: true },
  { label: 'Room Rent', current: 'Capped at ₹3,000/day', recommended: 'No limit (Single AC)', isBetter: true },
  { label: 'Add-ons', current: 'None', recommended: 'Zero Dep, Super Top-up', isBetter: true },
];

// ── Audit Score Calculation ───────────────────────────────────────────────

/**
 * Calculate the health score of an insurance plan (0-100).
 * Higher is better.
 */
export function calculatePlanScore(plan: AuditPlanDetails): number {
  let score = 0;

  // CSR scoring (0-30 points)
  if (plan.claimSettlementRatio >= 99) score += 30;
  else if (plan.claimSettlementRatio >= 95) score += 25;
  else if (plan.claimSettlementRatio >= 90) score += 18;
  else if (plan.claimSettlementRatio >= 85) score += 12;
  else score += 5;

  // Coverage scoring (0-20 points)
  if (plan.coverageAmount >= 1000000) score += 20;
  else if (plan.coverageAmount >= 500000) score += 15;
  else if (plan.coverageAmount >= 300000) score += 10;
  else score += 5;

  // Premium efficiency (0-20 points) — lower premium for same or better coverage
  const premiumPerLakh = (plan.premium.annual / plan.coverageAmount) * 100000;
  if (premiumPerLakh <= 600) score += 20;
  else if (premiumPerLakh <= 1000) score += 15;
  else if (premiumPerLakh <= 1500) score += 10;
  else score += 5;

  // PED waiting period (0-15 points)
  if (plan.waitingPeriod.ped <= 24) score += 15;
  else if (plan.waitingPeriod.ped <= 36) score += 10;
  else score += 3;

  // Network size (0-15 points)
  if (plan.networkHospitals >= 15000) score += 15;
  else if (plan.networkHospitals >= 7000) score += 10;
  else if (plan.networkHospitals >= 3000) score += 7;
  else score += 3;

  return Math.min(100, score);
}

/**
 * Calculate savings between current and recommended plan.
 */
export function calculateSavings(current: AuditPlanDetails, recommended: AuditPlanDetails): {
  amount: number;
  percentage: number;
} {
  const savings = current.premium.annual - recommended.premium.annual;
  const percentage = Math.round((savings / current.premium.annual) * 100);
  return { amount: Math.max(0, savings), percentage: Math.max(0, percentage) };
}

/**
 * Identify risk factors in the current plan.
 */
export function identifyRiskFactors(plan: AuditPlanDetails): RiskFactor[] {
  const risks: RiskFactor[] = [];

  if (plan.claimSettlementRatio < 90) {
    risks.push({
      type: 'high',
      title: 'Low Claim Settlement Ratio',
      description: `CSR of ${plan.claimSettlementRatio}% is below the IRDAI recommended threshold.`,
      recommendation: 'Switch to an insurer with 95%+ CSR for better claim assurance.',
    });
  }

  if (plan.waitingPeriod.ped > 36) {
    risks.push({
      type: 'high',
      title: 'Long PED Waiting Period',
      description: `${plan.waitingPeriod.ped}-month PED waiting is above industry average of 24-36 months.`,
      recommendation: 'Consider plans with 24-month PED waiting (Care Health, Acko, TATA AIG).',
    });
  }

  if (!plan.maternityCover) {
    risks.push({
      type: 'medium',
      title: 'No Maternity Cover',
      description: 'Your current plan does not cover maternity expenses.',
      recommendation: 'Add maternity cover or switch to a plan that includes it (Care Health, HDFC ERGO).',
    });
  }

  if (plan.coverageAmount < 1000000) {
    risks.push({
      type: 'medium',
      title: 'Low Coverage Amount',
      description: `₹${(plan.coverageAmount / 100000).toFixed(0)} Lakh coverage may not be sufficient for family hospitalization.`,
      recommendation: 'Increase to at least ₹10 Lakh for adequate family coverage.',
    });
  }

  if (plan.networkHospitals < 5000) {
    risks.push({
      type: 'low',
      title: 'Limited Hospital Network',
      description: `${plan.networkHospitals.toLocaleString()} hospitals is below the 10,000+ average of top insurers.`,
      recommendation: 'Switch to an insurer with a wider cashless hospital network.',
    });
  }

  if (plan.addons.length === 0) {
    risks.push({
      type: 'low',
      title: 'No Add-on Covers',
      description: 'Your plan has no add-on covers like Zero Dep or Super Top-up.',
      recommendation: 'Add Zero Depreciation and Super Top-up for comprehensive coverage.',
    });
  }

  return risks;
}

/**
 * Generate a full audit comparison from a current plan.
 * In production, this would call real APIs.
 */
export function generateAuditComparison(currentPlan: AuditPlanDetails): AuditComparison {
  const recommendedPlans = MOCK_RECOMMENDED_PLANS;
  const bestPlan = recommendedPlans[0];
  const savings = calculateSavings(currentPlan, bestPlan);
  const riskFactors = identifyRiskFactors(currentPlan);

  // Calculate health score based on risk factors
  let healthScore = 100;
  for (const risk of riskFactors) {
    if (risk.type === 'high') healthScore -= 20;
    else if (risk.type === 'medium') healthScore -= 12;
    else healthScore -= 5;
  }

  return {
    currentPlan,
    recommendedPlans,
    savingsAmount: savings.amount,
    savingsPercentage: savings.percentage,
    healthScore: Math.max(0, healthScore),
    riskFactors,
  };
}

/**
 * Format a number as Indian currency.
 */
export function formatIndianCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get the health score label and color.
 */
export function getHealthScoreInfo(score: number): {
  label: string;
  color: string;
  bgColor: string;
} {
  if (score >= 80) return { label: 'Excellent', color: 'text-green-400', bgColor: 'bg-green-950/30' };
  if (score >= 60) return { label: 'Good', color: 'text-amber-400', bgColor: 'bg-amber-950/30' };
  if (score >= 40) return { label: 'Fair', color: 'text-orange-400', bgColor: 'bg-orange-950/30' };
  return { label: 'Poor', color: 'text-red-400', bgColor: 'bg-red-950/30' };
}
