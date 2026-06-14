// ============================================================================
// Paliwal Secure - Recommendation Engine
// AI-powered plan recommendation with IRDAI 2025-26 grievance & fraud data
// Source: IRDAI Annual Report 2025-26, IRDAI Grievance Report FY25
// ============================================================================

import {
  type InsurancePlan,
  type UserProfile as InsuranceUserProfile,
  allInsurancePlans,
} from './insurance-data';

// ============================================
// GRIEVANCE & FRAUD DATA (Source: IRDAI 2025-26)
// ============================================

const grievanceData: Record<string, { complaints: number; complaintsPer10k: number; changePercent: number }> = {
  'Star Health & Allied Insurance': { complaints: 20527, complaintsPer10k: 52.31, changePercent: 22 },
  'Care Health Insurance': { complaints: 10281, complaintsPer10k: 27.06, changePercent: 49 },
  'Niva Bupa Health Insurance': { complaints: 7970, complaintsPer10k: 42.85, changePercent: 50 },
  'Aditya Birla Health Insurance': { complaints: 5329, complaintsPer10k: 28.0, changePercent: 37 },
  'HDFC ERGO General Insurance': { complaints: 3200, complaintsPer10k: 10.67, changePercent: 12 },
  'ICICI Lombard General Insurance': { complaints: 2800, complaintsPer10k: 11.5, changePercent: 8 },
  'Bajaj Allianz General Insurance': { complaints: 2100, complaintsPer10k: 9.8, changePercent: 5 },
  'TATA AIG General Insurance': { complaints: 1800, complaintsPer10k: 20.0, changePercent: 3 },
  'Acko General Insurance': { complaints: 950, complaintsPer10k: 15.0, changePercent: -2 },
  'HDFC Life Insurance': { complaints: 1500, complaintsPer10k: 8.5, changePercent: 10 },
  'ICICI Prudential Life Insurance': { complaints: 1200, complaintsPer10k: 7.8, changePercent: 6 },
  'SBI Life Insurance': { complaints: 1800, complaintsPer10k: 9.2, changePercent: 12 },
  'Life Insurance Corporation of India': { complaints: 3500, complaintsPer10k: 6.5, changePercent: 8 },
  'Max Life Insurance': { complaints: 900, complaintsPer10k: 7.2, changePercent: 4 },
  'Bajaj Allianz Life Insurance': { complaints: 800, complaintsPer10k: 8.0, changePercent: 5 },
  'Tata AIA Life Insurance': { complaints: 700, complaintsPer10k: 6.8, changePercent: 3 },
  'Kotak Mahindra Life Insurance': { complaints: 600, complaintsPer10k: 7.5, changePercent: 2 },
  'Reliance General Insurance': { complaints: 1400, complaintsPer10k: 11.0, changePercent: 10 },
  'SBI General Insurance': { complaints: 1600, complaintsPer10k: 12.3, changePercent: 14 },
  'National Insurance': { complaints: 12858, complaintsPer10k: 35.2, changePercent: 126 },
  'New India Assurance': { complaints: 9800, complaintsPer10k: 28.5, changePercent: 45 },
};

// Commission-based risk indicator (banks with high insurance commissions)
const highCommissionInsurers = ['HDFC Bank', 'Axis Bank', 'ICICI Bank']; // bank-led insurers

// ============================================
// SCORING FUNCTIONS
// ============================================

// Mis-selling risk score (higher = more risk)
function getMisSellingRisk(insurerName: string): number {
  // Banks tend to have higher mis-selling due to commission pressure
  if (highCommissionInsurers.some(bank => insurerName.includes(bank))) return 25;
  // Standalone health insurers with rising complaints
  if (grievanceData[insurerName]?.changePercent > 40) return 20;
  if (grievanceData[insurerName]?.changePercent > 20) return 10;
  return 0;
}

// Complaint score (higher is better)
function getComplaintScore(insurerName: string): number {
  const data = grievanceData[insurerName];
  if (!data) return 70; // default neutral
  const per10k = data.complaintsPer10k;
  if (per10k < 10) return 100;
  if (per10k < 20) return 85;
  if (per10k < 30) return 70;
  if (per10k < 50) return 50;
  return 30;
}

// CSR Score (higher is better)
function getCSRScore(csr: number): number {
  if (csr >= 98) return 100;
  if (csr >= 95) return 85;
  if (csr >= 90) return 70;
  if (csr >= 85) return 50;
  return 30;
}

// Premium compatibility score (lower premium = higher score)
function getPremiumScore(premiumMonthly: number, userBudgetMonthly: number): number {
  if (premiumMonthly <= userBudgetMonthly) return 100;
  const excess = (premiumMonthly - userBudgetMonthly) / userBudgetMonthly;
  if (excess <= 0.2) return 80;
  if (excess <= 0.5) return 50;
  return 20;
}

// Family suitability score (based on family composition)
function getFamilySuitabilityScore(plan: InsurancePlan, familySize: number): number {
  if (plan.familyFloater && familySize > 2) return 100;
  if (!plan.familyFloater && familySize === 1) return 100;
  if (plan.familyFloater) return 80;
  return 60;
}

// PED waiting period adjustment (negative penalty for long waits)
function getPEDPenalty(plan: InsurancePlan, userPEDs: string[]): number {
  if (!userPEDs || userPEDs.length === 0) return 0;
  let penalty = 0;
  const wpd = plan.waitingPeriodDetailed;

  for (const ped of userPEDs) {
    const pedLower = ped.toLowerCase();
    if (wpd) {
      if (pedLower.includes('diabetes') && wpd.diabetes > 24) penalty += 15;
      if (pedLower.includes('diabetes') && wpd.diabetes > 36) penalty += 25;
      if (pedLower.includes('bp') || pedLower.includes('hypertension')) {
        if (wpd.bp > 24) penalty += 10;
      }
      if (pedLower.includes('heart') && wpd.heart > 36) penalty += 20;
    } else if (plan.waitingPeriodPED) {
      if (plan.waitingPeriodPED > 36) penalty += 25;
      else if (plan.waitingPeriodPED > 24) penalty += 15;
    }
  }
  return penalty;
}

// ============================================
// TYPES
// ============================================

export interface SimpleUserProfile {
  age: number;
  familySize: number;
  budgetMonthly: number;
  peds: string[];
  smoker: boolean;
  income: number;
  cityTier: 1 | 2 | 3;
  category?: 'health' | 'life' | 'motor' | 'travel' | 'home';
}

export interface PlanRecommendation {
  planId: string;
  name: string;
  insurer: string;
  premium: number;
  csr: number;
  complaintScore: number;
  misSellingRisk: number;
  finalScore: number;
  reasons: string[];
  category: string;
  features: string[];
  sumInsuredMin: number;
  sumInsuredMax: number;
}

// ============================================
// HELPER: Convert InsuranceUserProfile to SimpleUserProfile
// ============================================

function getIncomeMidPoint(income: string): number {
  switch (income) {
    case 'below-3l': return 150000;
    case '3-5l': return 400000;
    case '5-10l': return 750000;
    case '10-25l': return 1750000;
    case '25-50l': return 3750000;
    case 'above-50l': return 7500000;
    default: return 500000;
  }
}

function getFamilySize(dependents: number | string): number {
  if (typeof dependents === 'number') return dependents + 1; // +1 for self
  const parsed = parseInt(dependents as string);
  if (!isNaN(parsed)) return parsed + 1;
  if (dependents === '1-2') return 3;
  if (dependents === '3-4') return 5;
  if (dependents === '5+') return 6;
  return 1;
}

export function profileToSimple(profile: InsuranceUserProfile): SimpleUserProfile {
  const annualIncome = getIncomeMidPoint(profile.income || '5-10l');
  return {
    age: profile.age,
    familySize: getFamilySize(profile.dependents),
    budgetMonthly: Math.round(annualIncome * 0.05 / 12),
    peds: profile.medicalHistory || [],
    smoker: profile.lifestyle?.includes('smoker') || false,
    income: annualIncome,
    cityTier: 2 as const,
    category: profile.priority === 'motor' ? 'motor' : profile.priority === 'protection' ? 'life' : 'health',
  };
}

// ============================================
// MAIN RECOMMENDATION FUNCTION
// ============================================

export function getRecommendations(user: SimpleUserProfile): PlanRecommendation[] {
  const category = user.category || 'health';
  const plans = allInsurancePlans.filter(p => p.category === category);

  const scored = plans.map(plan => {
    const csrScore = getCSRScore(plan.claimSettlementRatio);
    const complaintScore = getComplaintScore(plan.provider);
    const misSellingRisk = getMisSellingRisk(plan.provider);
    const premiumScore = getPremiumScore(plan.premium.monthly, user.budgetMonthly);
    const familyScore = getFamilySuitabilityScore(plan, user.familySize);
    const pedPenalty = getPEDPenalty(plan, user.peds);

    // Weighted final score (max 100)
    let finalScore = (csrScore * 0.25) + (complaintScore * 0.25) + (premiumScore * 0.2) + (familyScore * 0.15);
    finalScore = finalScore - (misSellingRisk / 2) - pedPenalty;
    finalScore = Math.max(0, Math.min(100, finalScore));

    // Build reasons
    const reasons: string[] = [];
    if (csrScore >= 85) reasons.push(`High claim settlement ratio (${plan.claimSettlementRatio}%)`);
    if (complaintScore >= 85) reasons.push(`Low customer complaints (${grievanceData[plan.provider]?.complaintsPer10k || 'N/A'} per 10k policies)`);
    if (premiumScore >= 80) reasons.push(`Fits your budget of \u20B9${user.budgetMonthly.toLocaleString('en-IN')}/month`);
    if (familyScore >= 90) reasons.push(`Suitable for family of ${user.familySize}`);
    if (misSellingRisk > 15) reasons.push(`\u26A0\uFE0F Higher mis-selling risk (bank-led insurer)`);
    if (pedPenalty > 10) reasons.push(`Long waiting period for your condition (${user.peds.join(', ')})`);

    return {
      planId: plan.id,
      name: plan.name,
      insurer: plan.provider,
      premium: plan.premium.monthly,
      csr: plan.claimSettlementRatio,
      complaintScore,
      misSellingRisk,
      finalScore,
      reasons,
      category: plan.category,
      features: plan.features.slice(0, 4),
      sumInsuredMin: plan.sumInsured.min,
      sumInsuredMax: plan.sumInsured.max,
    };
  });

  return scored.sort((a, b) => b.finalScore - a.finalScore).slice(0, 5);
}

// ============================================
// FORMAT RECOMMENDATIONS FOR CHAT
// ============================================

export function formatRecommendationsForChat(recommendations: PlanRecommendation[]): string {
  if (recommendations.length === 0) {
    return "I couldn't find plans matching your profile. Could you share more details about your needs?";
  }

  const topPlan = recommendations[0];
  const lines: string[] = [];

  lines.push(`*Top Recommendation:* **${topPlan.name}** (${topPlan.insurer})`);
  lines.push(`\u2022 *Premium:* \u20B9${topPlan.premium.toLocaleString('en-IN')}/month`);
  lines.push(`\u2022 *Claim Settlement:* ${topPlan.csr}%`);
  lines.push(`\u2022 *Complaint Score:* ${topPlan.complaintScore}/100`);
  if (topPlan.misSellingRisk > 0) {
    lines.push(`\u2022 *Mis-selling Risk:* ${topPlan.misSellingRisk > 15 ? '\u26A0\uFE0F High' : '\u26A0\uFE0F Moderate'}`);
  }
  lines.push(`\u2022 *Reasons:* ${topPlan.reasons.join(', ')}`);
  lines.push('');

  if (recommendations.length > 1) {
    lines.push('*Other plans to compare:*');
    recommendations.slice(1).forEach((plan, i) => {
      lines.push(`${i + 2}. **${plan.name}** — \u20B9${plan.premium.toLocaleString('en-IN')}/mo, CSR ${plan.csr}%, Score ${Math.round(plan.finalScore)}/100`);
    });
  }

  lines.push('');
  lines.push('Would you like me to compare these plans in detail?');

  return lines.join('\n');
}

// ============================================
// GRIEVANCE DATA EXPORT (for use in other components)
// ============================================

export { grievanceData, highCommissionInsurers };
