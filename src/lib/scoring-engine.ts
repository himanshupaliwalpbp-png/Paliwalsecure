// ============================================================================
// InsureGPT - Personalized Scoring Engine
// RAG-based recommendation scoring with IRDAI compliance
// ============================================================================

import {
  type InsurancePlan,
  type UserProfile,
  allInsurancePlans,
  IRDAI_PROHIBITED_WORDS,
  IRDAI_MANDATORY_DISCLAIMER,
  IRDAI_TAX_DISCLAIMER,
  IRDAI_CLAIM_DISCLAIMER,
  searchKnowledgeBase,
} from './insurance-data';

// ============================================================================
// SCORE TYPES
// ============================================================================
export interface ScoreBreakdown {
  planId: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  breakdown: {
    ageMatch: { score: number; max: number; reason: string };
    incomeFit: { score: number; max: number; reason: string };
    claimHistory: { score: number; max: number; reason: string };
    coverageFit: { score: number; max: number; reason: string };
    lifestyleMatch: { score: number; max: number; reason: string };
    priorityMatch: { score: number; max: number; reason: string };
    networkScore: { score: number; max: number; reason: string };
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
// SCORING WEIGHTS
// ============================================================================
const WEIGHTS = {
  ageMatch: 15,
  incomeFit: 20,
  claimHistory: 20,
  coverageFit: 15,
  lifestyleMatch: 10,
  priorityMatch: 15,
  networkScore: 5,
};

const MAX_TOTAL_SCORE = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);

// ============================================================================
// INCOME BRACKETS
// ============================================================================
function getIncomeBracket(income: string): { min: number; max: number } {
  switch (income) {
    case 'below-3l': return { min: 0, max: 300000 };
    case '3-5l': return { min: 300000, max: 500000 };
    case '5-10l': return { min: 500000, max: 1000000 };
    case '10-25l': return { min: 1000000, max: 2500000 };
    case '25-50l': return { min: 2500000, max: 5000000 };
    case 'above-50l': return { min: 5000000, max: Infinity };
    default: return { min: 0, max: Infinity };
  }
}

// ============================================================================
// INDIVIDUAL SCORING FUNCTIONS
// ============================================================================
function scoreAgeMatch(plan: InsurancePlan, profile: UserProfile): { score: number; max: number; reason: string } {
  const max = WEIGHTS.ageMatch;
  const { minAge, maxAge } = plan.eligibility;

  if (profile.age < minAge || profile.age > maxAge) {
    return { score: 0, max, reason: `Not eligible: Age ${profile.age} is outside the allowed range (${minAge}-${maxAge})` };
  }

  // Higher score for being in the sweet spot
  const range = maxAge - minAge;
  const midPoint = minAge + range * 0.3; // Slightly lower is better for most plans
  const distance = Math.abs(profile.age - midPoint);
  const normalizedScore = 1 - (distance / (range / 2));

  return {
    score: Math.round(Math.max(0.3, Math.min(1, normalizedScore)) * max),
    max,
    reason: `Age ${profile.age} is within the eligible range (${minAge}-${maxAge})`,
  };
}

function scoreIncomeFit(plan: InsurancePlan, profile: UserProfile): { score: number; max: number; reason: string } {
  const max = WEIGHTS.incomeFit;
  const incomeBracket = getIncomeBracket(profile.income as string || '5-10l');
  const midIncome = incomeBracket.min === Infinity ? 10000000 : (incomeBracket.min + Math.min(incomeBracket.max, 10000000)) / 2;

  const premiumRatio = plan.premium.min / midIncome;

  if (premiumRatio > 0.1) {
    return { score: Math.round(max * 0.3), max, reason: `Premium may be high relative to your income` };
  }
  if (premiumRatio > 0.05) {
    return { score: Math.round(max * 0.7), max, reason: `Premium is moderate for your income level` };
  }
  return { score: max, max, reason: `Premium is affordable for your income level` };
}

function scoreClaimHistory(plan: InsurancePlan): { score: number; max: number; reason: string } {
  const max = WEIGHTS.claimHistory;
  const csr = plan.claimSettlementRatio;

  if (csr >= 95) return { score: max, max, reason: `Excellent claim settlement ratio of ${csr}%` };
  if (csr >= 90) return { score: Math.round(max * 0.85), max, reason: `Very good claim settlement ratio of ${csr}%` };
  if (csr >= 85) return { score: Math.round(max * 0.7), max, reason: `Good claim settlement ratio of ${csr}%` };
  if (csr >= 80) return { score: Math.round(max * 0.55), max, reason: `Average claim settlement ratio of ${csr}%` };
  return { score: Math.round(max * 0.3), max, reason: `Below average claim settlement ratio of ${csr}%` };
}

function scoreCoverageFit(plan: InsurancePlan, profile: UserProfile): { score: number; max: number; reason: string } {
  const max = WEIGHTS.coverageFit;
  let score = 0;

  // Medical history matching
  if (profile.medicalHistory?.includes('none') && plan.claimSettlementRatio >= 85) {
    score += 0.3;
  }
  if (profile.medicalHistory?.some(m => ['diabetes', 'hypertension', 'heart-disease'].includes(m))) {
    if (plan.category === 'health' && plan.features.some(f => f.toLowerCase().includes('pre-existing'))) {
      score += 0.4;
    } else if (plan.category === 'life' && plan.claimSettlementRatio >= 95) {
      score += 0.3;
    }
  }

  // Dependent coverage
  if (profile.dependents > 0 && plan.category === 'health') {
    if (plan.features.some(f => f.toLowerCase().includes('family') || f.toLowerCase().includes('restoration'))) {
      score += 0.3;
    }
  }

  // Sum insured adequacy
  const incomeBracket = getIncomeBracket(profile.income as string || '5-10l');
  if (plan.sumInsured.max >= incomeBracket.min * 10) {
    score += 0.2;
  }

  return {
    score: Math.round(Math.min(1, score) * max),
    max,
    reason: score >= 0.7 ? 'Excellent coverage match for your profile' : 
            score >= 0.4 ? 'Good coverage match for your profile' :
            'Basic coverage match for your profile',
  };
}

function scoreLifestyleMatch(plan: InsurancePlan, profile: UserProfile): { score: number; max: number; reason: string } {
  const max = WEIGHTS.lifestyleMatch;
  let score = 0.5; // Base score

  if (profile.lifestyle?.includes('smoker')) {
    if (plan.category === 'health') {
      score -= 0.2; // Health insurance becomes more important but also more expensive
    }
    if (plan.category === 'life' && plan.features.some(f => f.toLowerCase().includes('non-smoker') || f.toLowerCase().includes('special rate'))) {
      score -= 0.3; // Won't get special rates
    }
  }

  if (profile.lifestyle?.includes('exercise')) {
    score += 0.2; // Wellness benefits more useful
    if (plan.features.some(f => f.toLowerCase().includes('wellness') || f.toLowerCase().includes('health check'))) {
      score += 0.2;
    }
  }

  if (profile.lifestyle?.includes('sedentary')) {
    if (plan.category === 'health') {
      score += 0.1; // More likely to need health insurance
    }
  }

  return {
    score: Math.round(Math.max(0, Math.min(1, score)) * max),
    max,
    reason: score >= 0.7 ? 'Great lifestyle-plan match' : 
            score >= 0.4 ? 'Moderate lifestyle-plan match' :
            'Consider lifestyle factors when choosing',
  };
}

function scorePriorityMatch(plan: InsurancePlan, profile: UserProfile): { score: number; max: number; reason: string } {
  const max = WEIGHTS.priorityMatch;
  const priority = profile.priority || 'health';

  const priorityCategoryMap: Record<string, InsurancePlan['category'][]> = {
    health: ['health'],
    protection: ['life'],
    savings: ['life', 'health'],
    investment: ['life'],
    motor: ['motor'],
  };

  const matchingCategories = priorityCategoryMap[priority] || ['health'];
  if (matchingCategories.includes(plan.category)) {
    return { score: max, max, reason: `Matches your priority of ${priority} insurance` };
  }

  return { score: Math.round(max * 0.2), max, reason: `Does not match your primary priority (${priority})` };
}

function scoreNetwork(plan: InsurancePlan): { score: number; max: number; reason: string } {
  const max = WEIGHTS.networkScore;
  const hospitals = plan.networkHospitals || 0;

  if (hospitals >= 15000) return { score: max, max, reason: `Extensive network of ${hospitals.toLocaleString()}+ hospitals` };
  if (hospitals >= 10000) return { score: Math.round(max * 0.8), max, reason: `Large network of ${hospitals.toLocaleString()}+ hospitals` };
  if (hospitals >= 5000) return { score: Math.round(max * 0.6), max, reason: `Good network of ${hospitals.toLocaleString()}+ hospitals` };
  if (hospitals >= 1000) return { score: Math.round(max * 0.4), max, reason: `Moderate network of ${hospitals.toLocaleString()}+ hospitals` };
  return { score: Math.round(max * 0.2), max, reason: `Limited network information` };
}

// ============================================================================
// MAIN SCORING FUNCTION
// ============================================================================
export function scorePlan(plan: InsurancePlan, profile: UserProfile): ScoreBreakdown {
  const ageMatch = scoreAgeMatch(plan, profile);
  const incomeFit = scoreIncomeFit(plan, profile);
  const claimHistory = scoreClaimHistory(plan);
  const coverageFit = scoreCoverageFit(plan, profile);
  const lifestyleMatch = scoreLifestyleMatch(plan, profile);
  const priorityMatch = scorePriorityMatch(plan, profile);
  const networkScore = scoreNetwork(plan);

  const totalScore = ageMatch.score + incomeFit.score + claimHistory.score + 
                     coverageFit.score + lifestyleMatch.score + priorityMatch.score + networkScore.score;

  const disclaimers = [
    IRDAI_MANDATORY_DISCLAIMER,
    plan.taxBenefit !== 'N/A' ? IRDAI_TAX_DISCLAIMER : '',
    IRDAI_CLAIM_DISCLAIMER,
  ].filter(Boolean);

  return {
    planId: plan.id,
    totalScore,
    maxScore: MAX_TOTAL_SCORE,
    percentage: Math.round((totalScore / MAX_TOTAL_SCORE) * 100),
    breakdown: {
      ageMatch,
      incomeFit,
      claimHistory,
      coverageFit,
      lifestyleMatch,
      priorityMatch,
      networkScore,
    },
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
    const ageScore = scoreAgeMatch(p, profile);
    return ageScore.score > 0;
  });

  const scored = plans
    .map(plan => {
      const score = scorePlan(plan, profile);
      const whyRecommended = generateWhyRecommended(plan, score, profile);
      const personalizedMessage = generatePersonalizedMessage(plan, score, profile);
      return { plan, score, whyRecommended, personalizedMessage };
    })
    .sort((a, b) => b.score.percentage - a.score.percentage)
    .slice(0, limit);

  return scored;
}

// ============================================================================
// EXPLAINABILITY - WHY RECOMMENDED
// ============================================================================
function generateWhyRecommended(
  plan: InsurancePlan,
  score: ScoreBreakdown,
  profile: UserProfile
): string {
  const reasons: string[] = [];

  if (score.breakdown.claimHistory.score >= WEIGHTS.claimHistory * 0.8) {
    reasons.push(`${plan.provider} has a strong ${plan.claimSettlementRatio}% claim settlement ratio`);
  }

  if (score.breakdown.priorityMatch.score >= WEIGHTS.priorityMatch) {
    reasons.push(`Matches your priority for ${profile.priority} coverage`);
  }

  if (score.breakdown.coverageFit.score >= WEIGHTS.coverageFit * 0.7) {
    reasons.push(`Coverage features align well with your profile`);
  }

  if (score.breakdown.incomeFit.score >= WEIGHTS.incomeFit * 0.8) {
    reasons.push(`Premium is affordable for your income level`);
  }

  if (plan.networkHospitals && plan.networkHospitals >= 10000) {
    reasons.push(`Extensive hospital network with ${plan.networkHospitals.toLocaleString()}+ cashless facilities`);
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
  if (score.percentage >= 80) {
    return `Based on your profile, ${plan.name} is an excellent match! It offers great value with a ${plan.claimSettlementRatio}% claim settlement ratio and premiums starting at just ₹${plan.premium.min.toLocaleString()}/year.`;
  }
  if (score.percentage >= 60) {
    return `${plan.name} is a good option for you. With a claim settlement ratio of ${plan.claimSettlementRatio}%, it provides reliable coverage at a reasonable premium.`;
  }
  return `${plan.name} is worth considering. Review the features carefully to see if it meets your specific needs.`;
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
      sanitizedText = sanitizedText.replace(regex, `[removed - IRDAI prohibited term]`);
    }
  });

  return {
    isCompliant: violations.length === 0,
    violations,
    sanitizedText,
  };
}

// ============================================================================
// RAG-BASED RESPONSE GENERATION
// ============================================================================
export function buildRAGContext(userQuery: string, profile?: UserProfile): string {
  const relevantKB = searchKnowledgeBase(userQuery);
  
  let context = `You are InsureGPT, an AI-powered insurance assistant for India. You help people understand insurance, compare plans, and make informed decisions.

IMPORTANT RULES:
1. NEVER use these prohibited words: ${IRDAI_PROHIBITED_WORDS.join(', ')}
2. ALWAYS include the IRDAI disclaimer when discussing specific plans
3. NEVER recommend a single plan as the "best" - always present options
4. Use simple, jargon-free language suitable for first-time insurance buyers
5. Include specific numbers and facts when available
6. If you don't know something, say so honestly - never hallucinate

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

  context += `\nAVAILABLE PLANS SUMMARY:
${allInsurancePlans.map(p => `- ${p.name} by ${p.provider}: ₹${p.premium.min}-${p.premium.max}/yr, CSR: ${p.claimSettlementRatio}%, Category: ${p.category}`).join('\n')}

Always be helpful, accurate, and compliant with IRDAI regulations. When in doubt, suggest the user consult a licensed insurance advisor.`;

  return context;
}
