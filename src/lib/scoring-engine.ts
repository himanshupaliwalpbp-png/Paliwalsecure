// ============================================================================
// Paliwal Secure - Personalized Scoring Engine
// RAG-based recommendation scoring with IRDAI compliance
// Source: IRDAI Annual Report 2025-26
//
// Scoring Algorithm:
// Trust Score = (CSR * 0.40) + (Solvency * 0.25) + (Complaint Score * 0.20) + (Claim Speed * 0.15)
// Compatibility Score = (Budget Match * 0.35) + (Age/PED Match * 0.25) + (Family Suitability * 0.20) + (Features Match * 0.20)
// Final Score = (Trust Score * 0.60) + (Compatibility Score * 0.40)
// ============================================================================

import {
  type InsurancePlan,
  type UserProfile,
  allInsurancePlans,
  IRDAI_PROHIBITED_WORDS,
  IRDAI_MANDATORY_DISCLAIMER,
  IRDAI_TAX_DISCLAIMER,
  IRDAI_CLAIM_DISCLAIMER,
  IRDAI_SOLVENCY_DISCLAIMER,
  searchKnowledgeBase,
} from './insurance-data';

// ============================================================================
// SCORE TYPES
// ============================================================================
export interface TrustScoreBreakdown {
  csrScore: number;
  solvencyScore: number;
  complaintScore: number;
  claimSpeedScore: number;
  total: number;
}

export interface CompatibilityScoreBreakdown {
  budgetMatch: number;
  agePEDMatch: number;
  familySuitability: number;
  featuresMatch: number;
  total: number;
}

export interface FraudRiskFlags {
  level: 'low' | 'medium' | 'high';
  reasons: string[];
  grievancePenalty: number; // 0-15 point deduction
}

export interface ScoreBreakdown {
  planId: string;
  trustScore: TrustScoreBreakdown;
  compatibilityScore: CompatibilityScoreBreakdown;
  finalScore: number;
  percentage: number;
  fraudRiskFlags: FraudRiskFlags;
  breakdown: {
    ageMatch: { score: number; max: number; reason: string };
    incomeFit: { score: number; max: number; reason: string };
    claimHistory: { score: number; max: number; reason: string };
    solvencyScore: { score: number; max: number; reason: string };
    coverageFit: { score: number; max: number; reason: string };
    lifestyleMatch: { score: number; max: number; reason: string };
    priorityMatch: { score: number; max: number; reason: string };
    networkScore: { score: number; max: number; reason: string };
    turnaroundScore: { score: number; max: number; reason: string };
  };
  disclaimers: string[];
}

export interface RecommendationResult {
  plan: InsurancePlan;
  score: ScoreBreakdown;
  whyRecommended: string;
  personalizedMessage: string;
}

// ============================================================================
// SCORING WEIGHTS (as per exact algorithm)
// ============================================================================
const TRUST_WEIGHTS = {
  csr: 0.40,
  solvency: 0.25,
  complaint: 0.20,
  claimSpeed: 0.15,
};

const COMPATIBILITY_WEIGHTS = {
  budgetMatch: 0.35,
  agePEDMatch: 0.25,
  familySuitability: 0.20,
  featuresMatch: 0.20,
};

const FINAL_WEIGHTS = {
  trust: 0.60,
  compatibility: 0.40,
};

// ============================================================================
// INSURER GRIEVANCE DATA (Source: IRDAI FY25)
// ============================================================================
const INSURER_GRIEVANCE_DATA: Record<string, { grievances: number; change: string; topComplaint: string }> = {
  'Star Health': { grievances: 20527, change: '+22%', topComplaint: 'Claim repudiation' },
  'Care Health': { grievances: 10281, change: '+49%', topComplaint: 'Claim repudiation' },
  'Niva Bupa': { grievances: 7970, change: '+50%', topComplaint: 'Claim delays' },
  'Aditya Birla Health': { grievances: 5329, change: '+37%', topComplaint: 'Claim repudiation' },
  'HDFC ERGO': { grievances: 3200, change: '+12%', topComplaint: 'Claim delays' },
  'ICICI Lombard': { grievances: 2800, change: '+8%', topComplaint: 'Policy cancellation' },
  'Bajaj Allianz': { grievances: 2100, change: '+5%', topComplaint: 'Claim delays' },
  'TATA AIG': { grievances: 1800, change: '+3%', topComplaint: 'Claim delays' },
  'Acko': { grievances: 950, change: '-2%', topComplaint: 'Service quality' },
  'Digit': { grievances: 800, change: '-5%', topComplaint: 'Claim delays' },
};

// ============================================================================
// FRAUD RISK COMPUTATION
// ============================================================================

function computeFraudRisk(plan: InsurancePlan): { level: 'low' | 'medium' | 'high'; reasons: string[]; grievancePenalty: number } {
  const data = INSURER_GRIEVANCE_DATA[plan.provider];
  if (!data) return { level: 'low', reasons: ['No grievance data available'], grievancePenalty: 0 };

  const reasons: string[] = [];
  let penalty = 0;

  if (data.grievances > 12000) {
    reasons.push(`High grievance volume: ${data.grievances.toLocaleString()} complaints (IRDAI FY25)`);
    penalty += 10;
  } else if (data.grievances > 6000) {
    reasons.push(`Moderate grievance volume: ${data.grievances.toLocaleString()} complaints`);
    penalty += 5;
  }

  if (data.change.startsWith('+')) {
    const pct = parseInt(data.change);
    if (pct > 40) {
      reasons.push(`Grievances surged ${data.change} YoY — concerning trend`);
      penalty += 5;
    } else if (pct > 20) {
      reasons.push(`Grievances increased ${data.change} YoY`);
      penalty += 2;
    }
  }

  if (data.topComplaint === 'Claim repudiation') {
    reasons.push('Top complaint is claim repudiation (claim rejection)');
    penalty += 3;
  }

  // Industry-wide fraud estimate
  reasons.push('Industry estimates: ~10-15% of claims involve fraud (drives up premiums)');

  const level = penalty >= 10 ? 'high' : penalty >= 5 ? 'medium' : 'low';
  return { level, reasons, grievancePenalty: Math.min(penalty, 15) };
}

// ============================================================================
// TRUST SCORE CALCULATION
// ============================================================================

/**
 * CSR Score: Direct use of claimSettlementRatio as a score out of 100
 */
function computeCSRScore(plan: InsurancePlan): number {
  return plan.claimSettlementRatio;
}

/**
 * Solvency Score: Normalized from solvency ratio
 * Solvency >= 3.0 → 100, >= 2.5 → 90, >= 2.0 → 80, >= 1.5 → 60, < 1.5 → 30
 */
function computeSolvencyScore(plan: InsurancePlan): number {
  const sr = plan.solvencyRatio;
  if (!sr) return 50; // Default when unknown
  if (sr >= 3.0) return 100;
  if (sr >= 2.5) return 90;
  if (sr >= 2.0) return 80;
  if (sr >= 1.5) return 60;
  return 30;
}

/**
 * Complaint Score = max(0, 100 - (complaintsPer10k * 2))
 */
function computeComplaintScore(plan: InsurancePlan): number {
  const complaints = plan.complaintsPer10k;
  if (complaints === undefined || complaints === null) return 50; // Default when unknown
  return Math.max(0, 100 - (complaints * 2));
}

/**
 * Claim Speed: Based on CSR
 * >95% CSR = 100, 90-95% = 80, 85-90% = 60, <85% = 40
 */
function computeClaimSpeedScore(plan: InsurancePlan): number {
  const csr = plan.claimSettlementRatio;
  if (csr > 95) return 100;
  if (csr >= 90) return 80;
  if (csr >= 85) return 60;
  return 40;
}

/**
 * Trust Score = (CSR * 0.40) + (Solvency * 0.25) + (Complaint Score * 0.20) + (Claim Speed * 0.15)
 */
function computeTrustScore(plan: InsurancePlan): TrustScoreBreakdown {
  const csrScore = computeCSRScore(plan);
  const solvencyScore = computeSolvencyScore(plan);
  const complaintScore = computeComplaintScore(plan);
  const claimSpeedScore = computeClaimSpeedScore(plan);

  const total =
    csrScore * TRUST_WEIGHTS.csr +
    solvencyScore * TRUST_WEIGHTS.solvency +
    complaintScore * TRUST_WEIGHTS.complaint +
    claimSpeedScore * TRUST_WEIGHTS.claimSpeed;

  return {
    csrScore,
    solvencyScore,
    complaintScore,
    claimSpeedScore,
    total: Math.round(total * 100) / 100,
  };
}

// ============================================================================
// COMPATIBILITY SCORE CALCULATION
// ============================================================================

// ============================================================================
// INCOME BRACKETS (for budget estimation)
// ============================================================================
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

function getUserBudget(profile: UserProfile): number {
  // Estimate monthly budget as ~5% of monthly income for insurance
  const annualIncome = getIncomeMidPoint(profile.income || '5-10l');
  return Math.round(annualIncome * 0.05 / 12); // Monthly budget in INR
}

/**
 * Budget Match: 100 if plan premium ≤ user budget,
 * else penalty of 2 points per ₹100 over budget
 */
function computeBudgetMatch(plan: InsurancePlan, profile: UserProfile): number {
  const userBudget = getUserBudget(profile);
  const planPremium = plan.premium.monthly;

  if (planPremium <= userBudget) return 100;

  const overBudget = planPremium - userBudget;
  const penalty = Math.floor(overBudget / 100) * 2;
  return Math.max(0, 100 - penalty);
}

/**
 * Age/PED Match: Starts at 100, applies penalties based on waiting periods
 *
 * PED Penalty:
 * - If user has Diabetes and plan waiting period >24 months → -15 points; if >36 months → -25 points
 * - If user has BP and waiting period >24 months → -10 points
 * - If user has Heart condition and waiting period >36 months → -20 points
 */
function computeAgePEDMatch(plan: InsurancePlan, profile: UserProfile): number {
  let score = 100;
  const medicalHistory = profile.medicalHistory || [];

  // Check age eligibility first
  if (plan.eligibility) {
    if (profile.age < plan.eligibility.minAge || profile.age > plan.eligibility.maxAge) {
      return 0; // Not eligible
    }
  }

  // Get detailed waiting periods
  const wpd = plan.waitingPeriodDetailed;

  // Diabetes PED check
  if (medicalHistory.some(m => ['diabetes', 'diabetes-type-2', 'diabetic'].includes(m.toLowerCase()))) {
    if (wpd) {
      if (wpd.diabetes > 36) {
        score -= 25;
      } else if (wpd.diabetes > 24) {
        score -= 15;
      }
    } else if (plan.waitingPeriodPED && plan.waitingPeriodPED > 24) {
      // Fallback to generic PED waiting period
      if (plan.waitingPeriodPED > 36) {
        score -= 25;
      } else {
        score -= 15;
      }
    }
  }

  // Blood Pressure PED check
  if (medicalHistory.some(m => ['hypertension', 'bp', 'blood-pressure', 'high-bp'].includes(m.toLowerCase()))) {
    if (wpd) {
      if (wpd.bp > 24) {
        score -= 10;
      }
    } else if (plan.waitingPeriodPED && plan.waitingPeriodPED > 24) {
      score -= 10;
    }
  }

  // Heart condition PED check
  if (medicalHistory.some(m => ['heart-disease', 'heart', 'cardiac', 'heart-condition'].includes(m.toLowerCase()))) {
    if (wpd) {
      if (wpd.heart > 36) {
        score -= 20;
      }
    } else if (plan.waitingPeriodPED && plan.waitingPeriodPED > 36) {
      score -= 20;
    }
  }

  return Math.max(0, score);
}

/**
 * Family Suitability: Based on dependents and plan features
 */
function computeFamilySuitability(plan: InsurancePlan, profile: UserProfile): number {
  let score = 50; // Base score

  const dependents = typeof profile.dependents === 'string'
    ? parseInt(profile.dependents as string) || 0
    : (profile.dependents as number) || 0;

  // Family floater is important for people with dependents
  if (dependents > 0 && plan.category === 'health') {
    if (plan.familyFloater) {
      score += 30;
    } else {
      score -= 10;
    }
  }

  // Maternity cover for young families
  if (profile.age >= 25 && profile.age <= 40 && dependents > 0) {
    if (plan.maternityCover) {
      score += 15;
    }
  }

  // Wellness addons for lifestyle-conscious
  if (profile.lifestyle?.includes('exercise') && plan.wellnessAddons) {
    score += 10;
  }

  // Network hospitals/garages accessibility
  const network = plan.networkHospitals || plan.networkGarages || 0;
  if (network >= 10000) score += 10;
  else if (network >= 5000) score += 5;

  return Math.min(100, Math.max(0, score));
}

/**
 * Features Match: Based on how well plan features align with user priority
 */
function computeFeaturesMatch(plan: InsurancePlan, profile: UserProfile): number {
  let score = 50; // Base score

  const priority = profile.priority || 'health';

  // Priority-category alignment
  const priorityCategoryMap: Record<string, InsurancePlan['category'][]> = {
    health: ['health'],
    protection: ['life'],
    savings: ['life', 'health'],
    investment: ['life'],
    motor: ['motor'],
  };

  const matchingCategories = priorityCategoryMap[priority] || ['health'];
  if (matchingCategories.includes(plan.category)) {
    score += 30;
  }

  // Feature richness
  const featureCount = plan.features.length;
  if (featureCount >= 8) score += 10;
  else if (featureCount >= 5) score += 5;

  // Riders available for life insurance
  if (plan.category === 'life' && plan.ridersAvailable && plan.ridersAvailable.length >= 3) {
    score += 10;
  }

  // Add-ons for motor insurance
  if (plan.category === 'motor' && plan.addonsAvailable && plan.addonsAvailable.length >= 3) {
    score += 10;
  }

  return Math.min(100, Math.max(0, score));
}

/**
 * Compatibility Score = (Budget Match * 0.35) + (Age/PED Match * 0.25) + (Family Suitability * 0.20) + (Features Match * 0.20)
 */
function computeCompatibilityScore(plan: InsurancePlan, profile: UserProfile): CompatibilityScoreBreakdown {
  const budgetMatch = computeBudgetMatch(plan, profile);
  const agePEDMatch = computeAgePEDMatch(plan, profile);
  const familySuitability = computeFamilySuitability(plan, profile);
  const featuresMatch = computeFeaturesMatch(plan, profile);

  const total =
    budgetMatch * COMPATIBILITY_WEIGHTS.budgetMatch +
    agePEDMatch * COMPATIBILITY_WEIGHTS.agePEDMatch +
    familySuitability * COMPATIBILITY_WEIGHTS.familySuitability +
    featuresMatch * COMPATIBILITY_WEIGHTS.featuresMatch;

  return {
    budgetMatch,
    agePEDMatch,
    familySuitability,
    featuresMatch,
    total: Math.round(total * 100) / 100,
  };
}

// ============================================================================
// MAIN SCORING FUNCTION
// ============================================================================
export function scorePlan(plan: InsurancePlan, profile: UserProfile): ScoreBreakdown {
  const trustScore = computeTrustScore(plan);
  const compatibilityScore = computeCompatibilityScore(plan, profile);
  const fraudRisk = computeFraudRisk(plan);

  // Final Score = (Trust Score * 0.60) + (Compatibility Score * 0.40) - Grievance Penalty
  let finalScore = Math.round(
    (trustScore.total * FINAL_WEIGHTS.trust +
     compatibilityScore.total * FINAL_WEIGHTS.compatibility) * 100
  ) / 100;

  // Apply grievance penalty and clamp to 0-100
  finalScore = Math.max(0, Math.min(100, finalScore - fraudRisk.grievancePenalty));

  // Build legacy breakdown for backward compatibility
  const breakdown = {
    ageMatch: {
      score: compatibilityScore.agePEDMatch > 0 ? Math.round(compatibilityScore.agePEDMatch / 10) : 0,
      max: 10,
      reason: compatibilityScore.agePEDMatch > 0
        ? `Age ${profile.age} is within eligible range`
        : `Not eligible: Age ${profile.age} is outside the allowed range`,
    },
    incomeFit: {
      score: Math.round(compatibilityScore.budgetMatch / 10),
      max: 10,
      reason: compatibilityScore.budgetMatch >= 80
        ? `Premium ₹${plan.premium.monthly}/mo is affordable`
        : compatibilityScore.budgetMatch >= 50
          ? `Premium ₹${plan.premium.monthly}/mo is moderate for your budget`
          : `Premium ₹${plan.premium.monthly}/mo may be high for your budget`,
    },
    claimHistory: {
      score: Math.round(trustScore.csrScore / 10),
      max: 10,
      reason: `CSR of ${plan.claimSettlementRatio}% (IRDAI 2025-26 data)`,
    },
    solvencyScore: {
      score: Math.round(trustScore.solvencyScore / 10),
      max: 10,
      reason: plan.solvencyRatio
        ? `Solvency ratio of ${plan.solvencyRatio} (IRDAI min: 1.5)`
        : 'Solvency ratio data not available',
    },
    coverageFit: {
      score: Math.round(compatibilityScore.familySuitability / 10),
      max: 10,
      reason: compatibilityScore.familySuitability >= 70
        ? 'Good coverage match for your profile'
        : 'Basic coverage match for your profile',
    },
    lifestyleMatch: {
      score: Math.round(compatibilityScore.featuresMatch / 10),
      max: 10,
      reason: compatibilityScore.featuresMatch >= 70
        ? 'Features align well with your needs'
        : 'Some features match your needs',
    },
    priorityMatch: {
      score: compatibilityScore.featuresMatch >= 70 ? 12 : Math.round(compatibilityScore.featuresMatch / 10),
      max: 12,
      reason: `Matches your priority of ${profile.priority || 'health'} coverage`,
    },
    networkScore: {
      score: (() => {
        const network = plan.networkHospitals || plan.networkGarages || 0;
        if (network >= 10000) return 5;
        if (network >= 5000) return 4;
        if (network >= 1000) return 3;
        return 1;
      })(),
      max: 5,
      reason: `${(plan.networkHospitals || plan.networkGarages || 0).toLocaleString()}+ network facilities`,
    },
    turnaroundScore: {
      score: Math.round(trustScore.claimSpeedScore / 10),
      max: 10,
      reason: trustScore.claimSpeedScore >= 80
        ? 'Fast claim settlement expected'
        : 'Average claim settlement speed',
    },
  };

  const disclaimers = [
    IRDAI_MANDATORY_DISCLAIMER,
    plan.taxBenefit !== 'N/A' ? IRDAI_TAX_DISCLAIMER : '',
    IRDAI_CLAIM_DISCLAIMER,
    plan.solvencyRatio ? IRDAI_SOLVENCY_DISCLAIMER : '',
  ].filter(Boolean);

  // Add fraud risk regulatory explanations
  if (fraudRisk.level === 'high') {
    disclaimers.push('⚠️ This insurer has a high grievance rate per IRDAI FY25 data. Consider comparing with lower-grievance alternatives.');
  } else if (fraudRisk.level === 'medium') {
    disclaimers.push('⚡ This insurer shows moderate grievance trends. Review claim settlement data carefully.');
  }
  disclaimers.push('IRDAI Fraud Monitoring Unit (FMU): Report suspected fraud at irdai.gov.in. Industry fraud rate: ~10-15% of claims.');

  return {
    planId: plan.id,
    trustScore,
    compatibilityScore,
    finalScore,
    percentage: Math.round(finalScore),
    fraudRiskFlags: fraudRisk,
    breakdown,
    disclaimers,
  };
}

// ============================================================================
// GET TOP RECOMMENDATIONS
// ============================================================================
export function getRecommendations(
  profile: UserProfile,
  category?: InsurancePlan['category'],
  limit: number = 5
): RecommendationResult[] {
  let plans = allInsurancePlans;

  if (category) {
    plans = plans.filter(p => p.category === category);
  }

  // Filter out plans where age doesn't match at all
  plans = plans.filter(p => {
    if (!p.eligibility) return true;
    return profile.age >= p.eligibility.minAge && profile.age <= p.eligibility.maxAge;
  });

  const scored = plans
    .map(plan => {
      const score = scorePlan(plan, profile);
      const whyRecommended = generateWhyRecommended(plan, score, profile);
      const personalizedMessage = generatePersonalizedMessage(plan, score, profile);
      return { plan, score, whyRecommended, personalizedMessage };
    })
    .sort((a, b) => b.score.finalScore - a.score.finalScore)
    .slice(0, limit);

  return scored;
}

// ============================================================================
// EXPLAINABILITY
// ============================================================================
function generateWhyRecommended(
  plan: InsurancePlan,
  score: ScoreBreakdown,
  profile: UserProfile
): string {
  const reasons: string[] = [];

  if (score.trustScore.csrScore >= 95) {
    reasons.push(`${plan.provider} has an exceptional ${plan.claimSettlementRatio}% CSR (IRDAI 2025-26)`);
  } else if (score.trustScore.csrScore >= 90) {
    reasons.push(`${plan.provider} has a strong ${plan.claimSettlementRatio}% CSR (IRDAI 2025-26)`);
  }

  if (plan.solvencyRatio && plan.solvencyRatio >= 1.8) {
    reasons.push(`Healthy solvency ratio of ${plan.solvencyRatio} (IRDAI min: 1.5)`);
  }

  if (plan.complaintsPer10k !== undefined && plan.complaintsPer10k <= 15) {
    reasons.push(`Low complaints ratio of ${plan.complaintsPer10k} per 10,000 policies`);
  }

  if (score.compatibilityScore.budgetMatch >= 80) {
    reasons.push(`Premium ₹${plan.premium.monthly}/mo is affordable for your budget`);
  }

  if (score.compatibilityScore.agePEDMatch >= 80) {
    reasons.push('Favourable waiting periods for your medical profile');
  }

  if (plan.networkHospitals && plan.networkHospitals >= 8000) {
    reasons.push(`Extensive hospital network with ${plan.networkHospitals.toLocaleString()}+ cashless facilities`);
  }

  if (plan.familyFloater && profile.dependents && profile.dependents !== '0') {
    reasons.push('Family floater option available for your dependents');
  }

  if (plan.ridersAvailable && plan.ridersAvailable.length >= 3) {
    reasons.push(`${plan.ridersAvailable.length} riders available for customization`);
  }

  // Fraud risk explainability
  const grievanceData = INSURER_GRIEVANCE_DATA[plan.provider];
  if (score.fraudRiskFlags.level === 'low' && grievanceData) {
    reasons.push(`Low grievance profile with ${grievanceData.grievances.toLocaleString()} complaints — below industry average`);
  } else if (score.fraudRiskFlags.level === 'high' && grievanceData) {
    reasons.push(`⚠️ High grievance volume (${grievanceData.grievances.toLocaleString()} complaints) — proceed with caution`);
  }

  return reasons.length > 0
    ? reasons.join('. ') + '.'
    : 'This plan meets your basic eligibility criteria.';
}

function generatePersonalizedMessage(
  plan: InsurancePlan,
  score: ScoreBreakdown,
  profile: UserProfile
): string {
  const trustPct = Math.round(score.trustScore.total);
  const compatPct = Math.round(score.compatibilityScore.total);

  if (score.finalScore >= 80) {
    return `Based on your profile, ${plan.name} is an excellent match! Trust score: ${trustPct}/100, Compatibility: ${compatPct}/100. With a ${plan.claimSettlementRatio}% CSR and premiums starting at ₹${plan.premium.monthly}/mo, it offers outstanding value and reliability.`;
  }
  if (score.finalScore >= 65) {
    return `${plan.name} is a good option for you. Trust score: ${trustPct}/100, Compatibility: ${compatPct}/100. With a CSR of ${plan.claimSettlementRatio}% and premium of ₹${plan.premium.monthly}/mo, it provides reliable coverage at a reasonable cost.`;
  }
  return `${plan.name} is worth considering. Trust score: ${trustPct}/100, Compatibility: ${compatPct}/100. Review the features and waiting periods carefully to see if it meets your specific needs.`;
}

// ============================================================================
// IRDAI COMPLIANCE CHECK
// ============================================================================
export function checkIRDAICompliance(text: string): { isCompliant: boolean; violations: string[]; sanitizedText: string } {
  const violations: string[] = [];
  let sanitizedText = text;

  IRDAI_PROHIBITED_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(text)) {
      violations.push(word);
      sanitizedText = sanitizedText.replace(regex, '[removed - IRDAI prohibited term]');
    }
  });

  return {
    isCompliant: violations.length === 0,
    violations,
    sanitizedText,
  };
}

export { INSURER_GRIEVANCE_DATA };


// ============================================================================
// RAG-BASED RESPONSE GENERATION
// ============================================================================
export function buildRAGContext(userQuery: string, profile?: UserProfile): string {
  const relevantKB = searchKnowledgeBase(userQuery);

  let context = `You are InsureGPT, India's most knowledgeable AI insurance advisor by Paliwal Secure. You are NOT a generic chatbot that lists categories. You are an EXPERT that gives SPECIFIC, ACTIONABLE, DETAILED answers with REAL plan names, premiums, CSR data, and comparisons.

═══════════════════════════════════════════
🔴 ABSOLUTELY FORBIDDEN RESPONSE PATTERNS:
═══════════════════════════════════════════
1. NEVER respond with generic category listings like "You can ask about health, life, motor insurance" or "Aap mujhse pooch sakte hain: health, life, motor..."
2. NEVER ask vague follow-ups like "What would you like to know?" or "Aap kya jaanna chahenge?" or "Would you like more details?"
3. NEVER give a response that only describes WHAT insurance is without naming SPECIFIC plans with premiums
4. NEVER say "I can help you with..." without immediately providing specific data
5. NEVER end a response with a vague question like "Which type interests you?" — instead, GIVE the data for ALL relevant types
6. NEVER say "Take our quiz" or "Click Get Started" without first providing substantive information

═══════════════════════════════════════════
✅ MANDATORY RESPONSE RULES:
═══════════════════════════════════════════
1. When user asks about ANY insurance type, you MUST IMMEDIATELY provide the top 3-5 specific plans with:
   - Plan name and insurer
   - Monthly AND annual premium (₹ amount)
   - Claim Settlement Ratio (CSR %)
   - Key features / benefits (at least 3)
   - Waiting periods (for health) or riders (for life) or add-ons (for motor)
2. ALWAYS compare at least 2-3 insurers when giving recommendations
3. ALWAYS include CSR percentages, solvency ratios, and complaint data when available
4. ALWAYS cite specific data sources: "Source: IRDAI Annual Report 2025-26" or "Source: IRDAI Life Insurance CSR Report 2025-26"
5. If user asks a broad question like "tell me about health insurance", give a FULL substantive answer with plan names, premiums, CSR data, waiting periods, and comparisons — NOT a 2-line description
6. Use simple, jargon-free Hindi-English mix suitable for first-time insurance buyers
7. Include specific numbers and facts from the data ALWAYS
8. For health plans: MUST mention waiting period by condition (diabetes, BP, heart), room rent limit, family floater availability, maternity cover
9. For life plans: MUST mention riders available, AUM, claim settlement time, sum assured range
10. For motor plans: MUST mention IDV %, add-ons available, network garages, third-party premium

═══════════════════════════════════════════
📋 IRDAI COMPLIANCE RULES (NON-NEGOTIABLE):
═══════════════════════════════════════════
1. NEVER use these prohibited words: ${IRDAI_PROHIBITED_WORDS.join(', ')}
2. ALWAYS include the IRDAI disclaimer when discussing specific plans
3. NEVER recommend a single plan as the "best" — always present multiple options
4. If you don't know something, say so honestly — never hallucinate
5. When comparing plans, mention CSR, ICR, solvency ratio, complaint ratio, and claim speed

═══════════════════════════════════════════
📊 SCORING METHODOLOGY:
═══════════════════════════════════════════
- Trust Score = (CSR * 0.40) + (Solvency * 0.25) + (Complaint Score * 0.20) + (Claim Speed * 0.15)
- Complaint Score = max(0, 100 - (complaintsPer10k * 2))
- Claim Speed: >95% CSR = 100, 90-95% = 80, 85-90% = 60, <85% = 40
- Compatibility Score = (Budget Match * 0.35) + (Age/PED Match * 0.25) + (Family Suitability * 0.20) + (Features Match * 0.20)
- Final Score = (Trust Score * 0.60) + (Compatibility Score * 0.40)

═══════════════════════════════════════════
🏥 PED PENALTY RULES:
═══════════════════════════════════════════
- Diabetes + waiting period >24 months → -15 points; >36 months → -25 points
- BP + waiting period >24 months → -10 points
- Heart condition + waiting period >36 months → -20 points

═══════════════════════════════════════════
📚 EXAMPLE GOOD RESPONSE (Health Insurance Query):
═══════════════════════════════════════════
"Here are India's top health insurance plans right now (Source: IRDAI Annual Report 2025-26):

**1. Care Health Insurance** — ₹500/mo (₹5,600/yr)
• CSR: 100% | ICR: 58.68% | Solvency: 1.8 | Complaints/10k: 42
• 21,700+ network hospitals | Family floater ✅ | Maternity ✅
• PED Waiting: Diabetes 24mo, BP 24mo, Heart 36mo
• Room rent: Single private room | No-claim bonus up to 100%

**2. Acko General Insurance** — ₹550/mo (₹6,200/yr)
• CSR: 99.91% | ICR: 65% | Solvency: 1.7 | Complaints/10k: 15
• 10,000+ network hospitals | Family floater ✅ | Maternity ❌
• PED Waiting: Diabetes 24mo, BP 24mo, Heart 36mo
• Room rent: No limit | No-claim bonus up to 100%

**3. HDFC ERGO General Insurance** — ₹600/mo (₹6,800/yr)
• CSR: 99.16% | ICR: 89.47% | Solvency: 1.9 | Complaints/10k: 10.67
• 10,000+ network hospitals | Family floater ✅ | Maternity ✅
• PED Waiting: Diabetes 36mo, BP 24mo, Heart 48mo
• Room rent: Deluxe room | 50% cumulative bonus/year

If you have diabetes or BP, Acko and Care Health have shorter 24-month waiting periods vs HDFC ERGO's 36 months for diabetes."

═══════════════════════════════════════════
📚 EXAMPLE GOOD RESPONSE (Life/Term Insurance Query):
═══════════════════════════════════════════
"Here are India's top term insurance plans (Source: IRDAI Life Insurance CSR Report 2025-26):

**1. HDFC Life Insurance** — ₹1,250/mo (₹15,000/yr) for ₹1 Cr cover
• CSR: 99.97% | Claim turnaround: 30 days | Solvency: 2.1
• AUM: ₹2,50,000 Cr | Riders: Critical Illness, Accidental Death, Waiver of Premium
• Features: Click2Protect, Return of premium option

**2. Max Life Insurance** — ₹1,350/mo (₹16,000/yr) for ₹1 Cr cover
• CSR: 99.08% | Claim turnaround: 30 days | Solvency: 2.1
• AUM: ₹1,50,000 Cr | Riders: Critical Illness, Accidental Death, Waiver of Premium

**3. SBI Life Insurance** — ₹1,200/mo (₹14,000/yr) for ₹1 Cr cover
• CSR: 98.50% | Claim turnaround: 45 days | Solvency: 2.0
• AUM: ₹3,80,000 Cr | Riders: Critical Illness, Accidental Death, Waiver of Premium

HDFC Life has the highest CSR at 99.97% and fastest claim settlement at 30 days. SBI Life has the largest AUM (₹3,80,000 Cr) and lowest premium."

KNOWLEDGE BASE CONTEXT:
`;

  relevantKB.forEach(entry => {
    context += `\nQ: ${entry.question}\nA: ${entry.answer}\n`;
  });

  if (profile) {
    context += `\nUSER PROFILE:
- Age: ${profile.age || 'Not provided'}
- Income bracket: ${profile.income || 'Not provided'}
- Dependents: ${profile.dependents || 'Not provided'}
- Occupation: ${profile.occupation || 'Not provided'}
- Medical history: ${profile.medicalHistory?.join(', ') || 'Not provided'}
- Lifestyle: ${profile.lifestyle?.join(', ') || 'Not provided'}
- Priority: ${profile.priority || 'Not provided'}
- Existing insurance: ${profile.existingInsurance?.join(', ') || 'Not provided'}
`;
  }

  context += `\nAVAILABLE PLANS SUMMARY (Source: IRDAI Annual Report 2025-26):
${allInsurancePlans.map(p => {
  const parts = [`- ${p.name} by ${p.provider}: ₹${p.premium.monthly}/mo (₹${p.premium.annual}/yr), CSR: ${p.claimSettlementRatio}%`];
  if (p.incurredClaimRatio) parts.push(`ICR: ${p.incurredClaimRatio}%`);
  if (p.solvencyRatio) parts.push(`Solvency: ${p.solvencyRatio}`);
  if (p.complaintsPer10k !== undefined) parts.push(`Complaints/10k: ${p.complaintsPer10k}`);
  if (p.waitingPeriodDetailed) parts.push(`PED wait: Diabetes ${p.waitingPeriodDetailed.diabetes}mo, BP ${p.waitingPeriodDetailed.bp}mo, Heart ${p.waitingPeriodDetailed.heart}mo`);
  if (p.familyFloater) parts.push('Family floater ✅');
  if (p.maternityCover) parts.push('Maternity ✅');
  if (p.roomRentLimit) parts.push(`Room rent: ${p.roomRentLimit}`);
  if (p.aum) parts.push(`AUM: ₹${p.aum.toLocaleString()} Cr`);
  if (p.ridersAvailable) parts.push(`Riders: ${p.ridersAvailable.join(', ')}`);
  if (p.addonsAvailable) parts.push(`Add-ons: ${p.addonsAvailable.join(', ')}`);
  if (p.claimTurnaroundDays) parts.push(`Claim turnaround: ${p.claimTurnaroundDays} days`);
  if (p.networkHospitals) parts.push(`Network: ${p.networkHospitals.toLocaleString()}+ hospitals`);
  if (p.networkGarages) parts.push(`Network: ${p.networkGarages.toLocaleString()}+ garages`);
  if (p.idvPercentage) parts.push(`IDV: ${p.idvPercentage}%`);
  if (p.thirdPartyPremium) parts.push(`TP premium: ₹${p.thirdPartyPremium}`);
  parts.push(`Category: ${p.category}`);
  return parts.join(', ');
}).join('\n')}

═══════════════════════════════════════════
🚨 MIS-SELLING AWARENESS:
═══════════════════════════════════════════
- If the user mentions buying insurance from a bank (e.g., HDFC Bank, Axis Bank, SBI, ICICI), warn them: "Banks earn high commissions (Top 15 banks earned ₹21,773 Cr in FY24; HDFC Bank alone ₹6,467 Cr) by selling insurance. While the plans are valid, ensure you're not being mis-sold. Always compare with direct insurer plans."
- If the user mentions guaranteed returns, investment-cum-insurance, or ULIP as "free insurance", warn about mis-selling red flags.
- Advise users to use the free-look period (15-30 days) and verify agent's IRDAI license number.
- If they ask about claim rejection, direct them to our Policyholder Rights page (/policyholder-rights) for the 4-step appeal process.

═══════════════════════════════════════════
🎯 FINAL REMINDER:
═══════════════════════════════════════════
EVERY response MUST contain specific plan names with real premiums and CSR data. NO EXCEPTIONS.
If the user's question is even slightly related to insurance, GIVE them specific plans with numbers.
Do NOT ask "What would you like to know?" — instead, GIVE them the data proactively.
A bad response: "Health insurance covers medical expenses. You can ask about life, motor, travel insurance too."
A good response: "Here are the top 5 health plans with premiums, CSR, waiting periods..." (then list them).`;

  return context;
}
