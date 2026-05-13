// ============================================================================
// InsureGPT - Personalized Scoring Engine
// RAG-based recommendation scoring with IRDAI compliance
// Source: IRDAI Annual Report 2024-25
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
export interface ScoreBreakdown {
  planId: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
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
// SCORING WEIGHTS
// ============================================================================
const WEIGHTS = {
  ageMatch: 10,
  incomeFit: 15,
  claimHistory: 15,
  solvencyScore: 10,
  coverageFit: 15,
  lifestyleMatch: 10,
  priorityMatch: 12,
  networkScore: 5,
  turnaroundScore: 8,
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

  const range = maxAge - minAge;
  const midPoint = minAge + range * 0.3;
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
  const incomeBracket = getIncomeBracket(profile.income || '5-10l');
  const midIncome = incomeBracket.min === Infinity ? 10000000 : (incomeBracket.min + Math.min(incomeBracket.max, 10000000)) / 2;
  const premiumRatio = plan.premium.annual / midIncome;

  if (premiumRatio > 0.1) {
    return { score: Math.round(max * 0.3), max, reason: `Annual premium ₹${plan.premium.annual.toLocaleString()} may be high relative to your income` };
  }
  if (premiumRatio > 0.05) {
    return { score: Math.round(max * 0.7), max, reason: `Annual premium ₹${plan.premium.annual.toLocaleString()} is moderate for your income level` };
  }
  return { score: max, max, reason: `Annual premium ₹${plan.premium.annual.toLocaleString()} is affordable for your income level` };
}

function scoreClaimHistory(plan: InsurancePlan): { score: number; max: number; reason: string } {
  const max = WEIGHTS.claimHistory;
  const csr = plan.claimSettlementRatio;

  if (csr >= 99) return { score: max, max, reason: `Exceptional CSR of ${csr}% (IRDAI 2024-25 data)` };
  if (csr >= 97) return { score: Math.round(max * 0.9), max, reason: `Very strong CSR of ${csr}% (IRDAI 2024-25 data)` };
  if (csr >= 93) return { score: Math.round(max * 0.75), max, reason: `Good CSR of ${csr}% (IRDAI 2024-25 data)` };
  if (csr >= 90) return { score: Math.round(max * 0.6), max, reason: `Above average CSR of ${csr}% (IRDAI 2024-25 data)` };
  if (csr >= 85) return { score: Math.round(max * 0.45), max, reason: `Average CSR of ${csr}% (IRDAI 2024-25 data)` };
  return { score: Math.round(max * 0.25), max, reason: `Below average CSR of ${csr}% (IRDAI 2024-25 data)` };
}

function scoreSolvency(plan: InsurancePlan): { score: number; max: number; reason: string } {
  const max = WEIGHTS.solvencyScore;
  const sr = plan.solvencyRatio;

  if (!sr) return { score: Math.round(max * 0.5), max, reason: 'Solvency ratio data not available' };

  if (sr >= 2.2) return { score: max, max, reason: `Excellent solvency ratio of ${sr} (IRDAI min: 1.5)` };
  if (sr >= 2.0) return { score: Math.round(max * 0.85), max, reason: `Strong solvency ratio of ${sr} (IRDAI min: 1.5)` };
  if (sr >= 1.8) return { score: Math.round(max * 0.7), max, reason: `Good solvency ratio of ${sr} (IRDAI min: 1.5)` };
  if (sr >= 1.5) return { score: Math.round(max * 0.5), max, reason: `Meets IRDAI minimum solvency of 1.5 (actual: ${sr})` };
  return { score: Math.round(max * 0.2), max, reason: `Below recommended solvency ratio at ${sr}` };
}

function scoreCoverageFit(plan: InsurancePlan, profile: UserProfile): { score: number; max: number; reason: string } {
  const max = WEIGHTS.coverageFit;
  let score = 0;

  // Medical history matching
  if (profile.medicalHistory?.includes('none') && plan.claimSettlementRatio >= 85) {
    score += 0.2;
  }
  if (profile.medicalHistory?.some(m => ['diabetes', 'hypertension', 'heart-disease'].includes(m))) {
    if (plan.category === 'health') {
      if (plan.waitingPeriodPED && plan.waitingPeriodPED <= 24) {
        score += 0.35;
      } else {
        score += 0.15;
      }
    }
    if (plan.category === 'life' && plan.ridersAvailable?.includes('Critical Illness')) {
      score += 0.3;
    }
  }

  // Family floater for dependents
  if (profile.dependents && profile.dependents !== '0' && plan.category === 'health') {
    if (plan.familyFloater) {
      score += 0.25;
    }
  }

  // Maternity for young families
  if (profile.age >= 25 && profile.age <= 40 && plan.category === 'health' && plan.maternityCover) {
    score += 0.15;
  }

  // Wellness for fitness-oriented
  if (profile.lifestyle?.includes('exercise') && plan.wellnessAddons) {
    score += 0.15;
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
  let score = 0.5;

  if (profile.lifestyle?.includes('smoker')) {
    if (plan.category === 'health') score -= 0.2;
    if (plan.category === 'life' && !plan.features.some(f => f.toLowerCase().includes('non-smoker'))) {
      score -= 0.1;
    }
  }

  if (profile.lifestyle?.includes('exercise')) {
    score += 0.15;
    if (plan.wellnessAddons) score += 0.15;
  }

  if (profile.lifestyle?.includes('sedentary')) {
    if (plan.category === 'health') score += 0.1;
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
  const garages = plan.networkGarages || 0;
  const network = Math.max(hospitals, garages);

  if (network >= 10000) return { score: max, max, reason: `Extensive network of ${network.toLocaleString()}+ facilities` };
  if (network >= 8000) return { score: Math.round(max * 0.85), max, reason: `Large network of ${network.toLocaleString()}+ facilities` };
  if (network >= 5000) return { score: Math.round(max * 0.65), max, reason: `Good network of ${network.toLocaleString()}+ facilities` };
  if (network >= 1000) return { score: Math.round(max * 0.4), max, reason: `Moderate network of ${network.toLocaleString()}+ facilities` };
  return { score: Math.round(max * 0.2), max, reason: 'Limited network information' };
}

function scoreTurnaround(plan: InsurancePlan): { score: number; max: number; reason: string } {
  const max = WEIGHTS.turnaroundScore;
  const tat = plan.claimTurnaroundDays;

  if (tat === undefined || tat === null) return { score: Math.round(max * 0.5), max, reason: 'Claim turnaround data not available' };

  if (tat <= 0.5) return { score: max, max, reason: `Ultra-fast claim settlement in ${tat} days` };
  if (tat <= 1) return { score: Math.round(max * 0.85), max, reason: `Fast claim settlement in ${tat} days` };
  if (tat <= 2) return { score: Math.round(max * 0.6), max, reason: `Claim settlement in ${tat} days` };
  return { score: Math.round(max * 0.3), max, reason: `Claim settlement takes ${tat}+ days` };
}

// ============================================================================
// MAIN SCORING FUNCTION
// ============================================================================
export function scorePlan(plan: InsurancePlan, profile: UserProfile): ScoreBreakdown {
  const ageMatch = scoreAgeMatch(plan, profile);
  const incomeFit = scoreIncomeFit(plan, profile);
  const claimHistory = scoreClaimHistory(plan);
  const solvencyScore = scoreSolvency(plan);
  const coverageFit = scoreCoverageFit(plan, profile);
  const lifestyleMatch = scoreLifestyleMatch(plan, profile);
  const priorityMatch = scorePriorityMatch(plan, profile);
  const networkScore = scoreNetwork(plan);
  const turnaroundScore = scoreTurnaround(plan);

  const totalScore = ageMatch.score + incomeFit.score + claimHistory.score +
    solvencyScore.score + coverageFit.score + lifestyleMatch.score +
    priorityMatch.score + networkScore.score + turnaroundScore.score;

  const disclaimers = [
    IRDAI_MANDATORY_DISCLAIMER,
    plan.taxBenefit !== 'N/A' ? IRDAI_TAX_DISCLAIMER : '',
    IRDAI_CLAIM_DISCLAIMER,
    plan.solvencyRatio ? IRDAI_SOLVENCY_DISCLAIMER : '',
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
      solvencyScore,
      coverageFit,
      lifestyleMatch,
      priorityMatch,
      networkScore,
      turnaroundScore,
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
// EXPLAINABILITY
// ============================================================================
function generateWhyRecommended(
  plan: InsurancePlan,
  score: ScoreBreakdown,
  profile: UserProfile
): string {
  const reasons: string[] = [];

  if (score.breakdown.claimHistory.score >= WEIGHTS.claimHistory * 0.85) {
    reasons.push(`${plan.provider} has a strong ${plan.claimSettlementRatio}% CSR (IRDAI 2024-25)`);
  }

  if (plan.solvencyRatio && plan.solvencyRatio >= 1.8) {
    reasons.push(`Healthy solvency ratio of ${plan.solvencyRatio} (IRDAI min: 1.5)`);
  }

  if (plan.claimTurnaroundDays && plan.claimTurnaroundDays <= 1) {
    reasons.push(`Fast claim settlement in ${plan.claimTurnaroundDays} day(s)`);
  }

  if (score.breakdown.priorityMatch.score >= WEIGHTS.priorityMatch) {
    reasons.push(`Matches your priority for ${profile.priority} coverage`);
  }

  if (score.breakdown.coverageFit.score >= WEIGHTS.coverageFit * 0.7) {
    reasons.push('Coverage features align well with your profile');
  }

  if (score.breakdown.incomeFit.score >= WEIGHTS.incomeFit * 0.8) {
    reasons.push(`Premium ₹${plan.premium.monthly}/mo is affordable for your income`);
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
    return `Based on your profile, ${plan.name} is an excellent match! With a ${plan.claimSettlementRatio}% CSR, solvency ratio of ${plan.solvencyRatio || 'N/A'}, and premiums starting at just ₹${plan.premium.monthly}/mo, it offers outstanding value and reliability.`;
  }
  if (score.percentage >= 60) {
    return `${plan.name} is a good option for you. With a CSR of ${plan.claimSettlementRatio}% and premium of ₹${plan.premium.monthly}/mo, it provides reliable coverage at a reasonable cost.`;
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
      sanitizedText = sanitizedText.replace(regex, '[removed - IRDAI prohibited term]');
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

  let context = `You are InsureGPT, an AI-powered insurance assistant for India targeting 700M uninsured/underinsured people. You help people understand insurance, compare plans, and make informed decisions.

IMPORTANT RULES:
1. NEVER use these prohibited words: ${IRDAI_PROHIBITED_WORDS.join(', ')}
2. ALWAYS include the IRDAI disclaimer when discussing specific plans
3. NEVER recommend a single plan as the "best" — always present options
4. Use simple, jargon-free Hindi-English mix suitable for first-time insurance buyers
5. Include specific numbers and facts from the data when available
6. Cite data sources (IRDAI Annual Report 2024-25, CSR Report 2025-26)
7. If you don't know something, say so honestly — never hallucinate
8. When comparing plans, mention CSR, ICR, solvency ratio, and claim turnaround
9. For health plans, mention waiting period (PED), room rent limit, family floater, maternity
10. For life plans, mention riders available and claim turnaround time

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

  context += `\nAVAILABLE PLANS SUMMARY (Source: IRDAI Annual Report 2024-25):
${allInsurancePlans.map(p => {
  const parts = [`- ${p.name} by ${p.provider}: ₹${p.premium.monthly}/mo (₹${p.premium.annual}/yr), CSR: ${p.claimSettlementRatio}%`];
  if (p.incurredClaimRatio) parts.push(`ICR: ${p.incurredClaimRatio}%`);
  if (p.solvencyRatio) parts.push(`Solvency: ${p.solvencyRatio}`);
  if (p.claimTurnaroundDays !== undefined) parts.push(`TAT: ${p.claimTurnaroundDays} days`);
  if (p.waitingPeriodPED) parts.push(`PED wait: ${p.waitingPeriodPED} mo`);
  if (p.familyFloater) parts.push('Family floater');
  if (p.maternityCover) parts.push('Maternity');
  parts.push(`Category: ${p.category}`);
  return parts.join(', ');
}).join('\n')}

Always be helpful, accurate, and compliant with IRDAI regulations. When in doubt, suggest the user consult a licensed insurance advisor.`;

  return context;
}
