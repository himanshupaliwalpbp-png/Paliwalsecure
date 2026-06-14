// ============================================================================
// Paliwal Secure - Advanced AI Recommendation Engine
// Hinglish-powered, explainable insurance recommendations with IRDAI compliance
// ============================================================================

import { healthPlans, type HealthPlan } from '@/data/healthPlans';
import { healthRiders, type HealthRider } from '@/data/healthRiders';
import { termPlans, type TermPlan } from '@/data/termPlans';
import { termRiders, type TermRider } from '@/data/termRiders';
import { motorAddons, type MotorAddon } from '@/data/motorAddons';
import { seniorCitizenPlans, type SeniorCitizenPlan } from '@/data/seniorCitizenPlans';
import { criticalIllnessPlans, type CriticalIllnessPlan } from '@/data/criticalIllnessPlans';

// ============================================================================
// PERSONA INTERFACE
// ============================================================================

/**
 * Represents a user persona for insurance recommendation.
 * Contains demographic, financial, medical, and preference data.
 */
export interface Persona {
  /** Age of the user in years */
  age: number;
  /** Annual income bracket (e.g. '5-10l', '10-25l') */
  income: string;
  /** Total family size including the user */
  familySize: number;
  /** Number of dependents (children, elderly parents) */
  dependents: number;
  /** Medical conditions the user has (e.g. 'diabetes', 'bp', 'heart-disease') */
  medicalHistory: string[];
  /** Lifestyle factors (e.g. 'smoker', 'exercise', 'sedentary') */
  lifestyle: string[];
  /** Primary purchase intent driving the recommendation */
  purchaseIntent: 'budget' | 'premium' | 'family' | 'ped_specific' | 'comprehensive';
  /** Preferred hospital names or areas */
  preferredHospitals: string[];
  /** Age of vehicle in years (for motor insurance) */
  vehicleAge?: number;
  /** List of existing insurance policies */
  existingInsurance: string[];
  /** Profile completeness score 0-100 */
  profileCompleteness: number;
}

// ============================================================================
// SCORED PLAN INTERFACE
// ============================================================================

/**
 * Represents a scored and ranked insurance plan with explanations.
 */
export interface ScoredPlan {
  /** Unique plan identifier */
  planId: string;
  /** Display name of the plan */
  planName: string;
  /** Insurer company name */
  insurer: string;
  /** Insurance category */
  category: 'health' | 'term' | 'motor' | 'senior' | 'critical-illness';
  /** Overall score 0-100 */
  score: number;
  /** Trust score based on CSR, solvency, complaints 0-100 */
  trustScore: number;
  /** Compatibility with user persona 0-100 */
  compatibilityScore: number;
  /** Recommended riders/add-ons with reasons */
  recommendedRiders: Array<{ id: string; name: string; reason: string }>;
  /** Hinglish explanation of why this plan is recommended */
  explanation: string;
  /** IRDAI compliance warning flags */
  flags: string[];
}

// ============================================================================
// DYNAMIC WEIGHT MAPS
// ============================================================================

interface WeightConfig {
  premium: number;
  csr: number;
  complaints: number;
  features: number;
  family: number;
  network: number;
  solvency: number;
  pedMatch: number;
  waitingPeriod: number;
}

const WEIGHT_MAPS: Record<Persona['purchaseIntent'], WeightConfig> = {
  budget: {
    premium: 40, csr: 20, complaints: 15, features: 15,
    family: 10, network: 0, solvency: 0, pedMatch: 0, waitingPeriod: 0,
  },
  premium: {
    premium: 10, csr: 30, complaints: 0, features: 20,
    family: 0, network: 25, solvency: 15, pedMatch: 0, waitingPeriod: 0,
  },
  family: {
    premium: 20, csr: 25, complaints: 0, features: 15,
    family: 30, network: 10, solvency: 0, pedMatch: 0, waitingPeriod: 0,
  },
  ped_specific: {
    premium: 10, csr: 25, complaints: 0, features: 0,
    family: 0, network: 10, solvency: 0, pedMatch: 35, waitingPeriod: 20,
  },
  comprehensive: {
    premium: 15, csr: 25, complaints: 0, features: 20,
    family: 15, network: 15, solvency: 10, pedMatch: 0, waitingPeriod: 0,
  },
};

// ============================================================================
// 1. PERSONA CREATION
// ============================================================================

/**
 * Creates a Persona object from partial user input, filling in sensible defaults
 * for missing fields and calculating profile completeness.
 *
 * @param userInput - Partial persona data from the user
 * @returns Complete Persona with defaults and computed profileCompleteness
 */
export function createPersona(userInput: Partial<Persona>): Persona {
  const defaults: Persona = {
    age: 30,
    income: '5-10l',
    familySize: 2,
    dependents: 0,
    medicalHistory: [],
    lifestyle: [],
    purchaseIntent: 'budget',
    preferredHospitals: [],
    existingInsurance: [],
    profileCompleteness: 0,
  };

  const merged: Persona = {
    age: userInput.age ?? defaults.age,
    income: userInput.income ?? defaults.income,
    familySize: userInput.familySize ?? defaults.familySize,
    dependents: userInput.dependents ?? defaults.dependents,
    medicalHistory: userInput.medicalHistory ?? defaults.medicalHistory,
    lifestyle: userInput.lifestyle ?? defaults.lifestyle,
    purchaseIntent: userInput.purchaseIntent ?? defaults.purchaseIntent,
    preferredHospitals: userInput.preferredHospitals ?? defaults.preferredHospitals,
    vehicleAge: userInput.vehicleAge,
    existingInsurance: userInput.existingInsurance ?? defaults.existingInsurance,
    profileCompleteness: 0, // Will be calculated below
  };

  // Calculate profile completeness based on which fields were explicitly provided
  const fieldsToCheck: Array<{ value: unknown; isDefault: (v: unknown, d: unknown) => boolean; weight: number }> = [
    { value: userInput.age, isDefault: (v, d) => v === undefined, weight: 15 },
    { value: userInput.income, isDefault: (v, d) => v === undefined, weight: 15 },
    { value: userInput.familySize, isDefault: (v, d) => v === undefined, weight: 10 },
    { value: userInput.dependents, isDefault: (v, d) => v === undefined, weight: 10 },
    { value: userInput.medicalHistory, isDefault: (v) => v === undefined || (Array.isArray(v) && v.length === 0), weight: 15 },
    { value: userInput.lifestyle, isDefault: (v) => v === undefined || (Array.isArray(v) && v.length === 0), weight: 10 },
    { value: userInput.purchaseIntent, isDefault: (v, d) => v === undefined, weight: 10 },
    { value: userInput.preferredHospitals, isDefault: (v) => v === undefined || (Array.isArray(v) && v.length === 0), weight: 5 },
    { value: userInput.vehicleAge, isDefault: (v) => v === undefined, weight: 5 },
    { value: userInput.existingInsurance, isDefault: (v) => v === undefined || (Array.isArray(v) && v.length === 0), weight: 5 },
  ];

  let completeness = 0;
  for (const field of fieldsToCheck) {
    if (!field.isDefault(field.value, undefined)) {
      completeness += field.weight;
    }
  }

  merged.profileCompleteness = Math.min(100, completeness);
  return merged;
}

// ============================================================================
// INCOME HELPERS
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

function getAnnualBudget(persona: Persona): number {
  const annualIncome = getIncomeMidPoint(persona.income);
  return Math.round(annualIncome * 0.05); // ~5% of income for insurance
}

// ============================================================================
// INDIVIDUAL SCORE COMPONENTS
// ============================================================================

function computePremiumScore(premium: number, persona: Persona): number {
  const budget = getAnnualBudget(persona);
  if (premium <= budget) return 100;
  const overBudget = premium - budget;
  const penalty = Math.floor(overBudget / 500) * 3;
  return Math.max(0, 100 - penalty);
}

function computeCSRScore(csrValue: number): number {
  if (csrValue >= 99) return 100;
  if (csrValue >= 97) return 90;
  if (csrValue >= 95) return 80;
  if (csrValue >= 90) return 65;
  if (csrValue >= 85) return 45;
  return 25;
}

function computeComplaintScore(complaintsPer10k: number | undefined): number {
  if (complaintsPer10k === undefined) return 50;
  if (complaintsPer10k <= 15) return 100;
  if (complaintsPer10k <= 25) return 80;
  if (complaintsPer10k <= 40) return 60;
  if (complaintsPer10k <= 55) return 40;
  return 20;
}

function computeNetworkScore(networkHospitals: number): number {
  if (networkHospitals >= 15000) return 100;
  if (networkHospitals >= 10000) return 85;
  if (networkHospitals >= 7000) return 70;
  if (networkHospitals >= 5000) return 55;
  if (networkHospitals >= 3000) return 40;
  return 25;
}

function computeSolvencyScore(solvencyRatio: number): number {
  if (solvencyRatio >= 3.0) return 100;
  if (solvencyRatio >= 2.5) return 90;
  if (solvencyRatio >= 2.0) return 80;
  if (solvencyRatio >= 1.5) return 60;
  return 30;
}

function computeFamilyScore(plan: { maternityCover?: boolean; networkHospitals?: number }, persona: Persona): number {
  let score = 50;
  if (persona.familySize > 3) {
    if (plan.maternityCover) score += 20;
    score += Math.min(20, persona.dependents * 10);
  }
  if (persona.dependents > 0 && persona.age >= 25 && persona.age <= 40) {
    if (plan.maternityCover) score += 10;
  }
  if (plan.networkHospitals && plan.networkHospitals >= 10000) score += 10;
  return Math.min(100, score);
}

function computePEDMatchScore(
  waitingPeriods: { ped: number; diabetes: number; bp: number; heart: number } | undefined,
  persona: Persona
): number {
  let score = 100;
  const medHistory = persona.medicalHistory.map(m => m.toLowerCase());

  if (!waitingPeriods) return score;

  // Diabetes match
  if (medHistory.some(m => ['diabetes', 'diabetic', 'diabetes-type-2'].includes(m))) {
    if (waitingPeriods.diabetes > 36) score -= 30;
    else if (waitingPeriods.diabetes > 24) score -= 15;
    else score += 5;
  }

  // BP match
  if (medHistory.some(m => ['bp', 'hypertension', 'blood-pressure', 'high-bp'].includes(m))) {
    if (waitingPeriods.bp > 36) score -= 25;
    else if (waitingPeriods.bp > 24) score -= 10;
    else score += 5;
  }

  // Heart match
  if (medHistory.some(m => ['heart-disease', 'heart', 'cardiac', 'heart-condition'].includes(m))) {
    if (waitingPeriods.heart > 48) score -= 35;
    else if (waitingPeriods.heart > 36) score -= 20;
    else score += 5;
  }

  return Math.max(0, Math.min(100, score));
}

function computeWaitingPeriodScore(
  waitingPeriods: { ped: number; diabetes: number; bp: number; heart: number } | undefined,
  persona: Persona
): number {
  if (!waitingPeriods) return 50;
  const medHistory = persona.medicalHistory.map(m => m.toLowerCase());

  // If no PED, just check generic PED waiting
  if (medHistory.length === 0) {
    if (waitingPeriods.ped <= 24) return 90;
    if (waitingPeriods.ped <= 36) return 70;
    return 40;
  }

  // Calculate average relevant waiting period
  let totalMonths = 0;
  let count = 0;

  if (medHistory.some(m => ['diabetes', 'diabetic'].includes(m))) {
    totalMonths += waitingPeriods.diabetes;
    count++;
  }
  if (medHistory.some(m => ['bp', 'hypertension'].includes(m))) {
    totalMonths += waitingPeriods.bp;
    count++;
  }
  if (medHistory.some(m => ['heart-disease', 'heart', 'cardiac'].includes(m))) {
    totalMonths += waitingPeriods.heart;
    count++;
  }

  if (count === 0) {
    if (waitingPeriods.ped <= 24) return 90;
    if (waitingPeriods.ped <= 36) return 70;
    return 40;
  }

  const avgMonths = totalMonths / count;
  if (avgMonths <= 24) return 95;
  if (avgMonths <= 30) return 80;
  if (avgMonths <= 36) return 60;
  if (avgMonths <= 48) return 35;
  return 15;
}

// ============================================================================
// IRDAI COMPLIANCE FLAGS
// ============================================================================

function generateIRDAIFlags(
  plan: { csrValue?: number; csr?: string; solvencyRatio?: number; waiting_periods?: { ped: number }; waitingPeriodPED?: string; coPayment?: string },
  category: string
): string[] {
  const flags: string[] = [];

  if (plan.csrValue !== undefined && plan.csrValue < 90) {
    flags.push(`⚠️ CSR ${plan.csr} — IRDAI ke hisaab se 90% se neeche ka CSR risky hai. Claim rejection ka chance zyada hai.`);
  }

  if (plan.solvencyRatio !== undefined && plan.solvencyRatio < 1.5) {
    flags.push(`⚠️ Solvency Ratio ${plan.solvencyRatio} — IRDAI ka minimum 1.5 hai. Is insurer ki financial stability kam hai.`);
  }

  if (plan.waiting_periods && plan.waiting_periods.ped > 36) {
    flags.push(`⏳ PED waiting period ${plan.waiting_periods.ped} months hai — industry average 24-36 months se zyada hai.`);
  }

  if (category === 'senior' && plan.coPayment) {
    const copayNum = parseInt(plan.coPayment);
    if (copayNum >= 30) {
      flags.push(`💰 Co-payment ${plan.coPayment} hai — matlab aapko 30%+ khud pay karna hoga. Budget mein rakhein.`);
    }
  }

  return flags;
}

// ============================================================================
// 2. MULTI-FACTOR SCORING WITH DYNAMIC WEIGHTS
// ============================================================================

/**
 * Scores all available plans for a given category using dynamic weights
 * based on the user's purchaseIntent.
 *
 * Weight distribution by purchaseIntent:
 * - budget: Premium 40%, CSR 20%, Complaints 15%, Features 15%, Family 10%
 * - premium: CSR 30%, Network 25%, Features 20%, Solvency 15%, Premium 10%
 * - family: Family 30%, CSR 25%, Premium 20%, Features 15%, Network 10%
 * - ped_specific: PED Match 35%, CSR 25%, Waiting Period 20%, Premium 10%, Network 10%
 * - comprehensive: CSR 25%, Features 20%, Premium 15%, Family 15%, Network 15%, Solvency 10%
 *
 * @param persona - User persona with preferences and medical history
 * @param category - Insurance category to score ('health', 'term', 'motor', 'senior', 'critical-illness')
 * @returns Array of ScoredPlan sorted by score descending
 */
export function scorePlans(persona: Persona, category: string): ScoredPlan[] {
  const weights = WEIGHT_MAPS[persona.purchaseIntent];

  // Normalize weights to sum to 100
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);

  const normalizeWeight = (w: number) => totalWeight > 0 ? w / totalWeight : 0;

  const scoredPlans: ScoredPlan[] = [];

  switch (category) {
    case 'health':
      for (const plan of healthPlans) {
        const premiumScore = computePremiumScore(plan.premium, persona);
        const csrScore = computeCSRScore(plan.csrValue);
        const complaintScore = computeComplaintScore(undefined); // Not in HealthPlan interface, default
        const featureScore = Math.min(100, 40 + plan.key_features.length * 8 + (plan.restoration ? 10 : 0) + (plan.wellnessAddons ? 10 : 0));
        const familyScore = computeFamilyScore(plan, persona);
        const networkScore = computeNetworkScore(plan.networkHospitals);
        const solvencyScore = 70; // Default for health plans
        const pedMatchScore = computePEDMatchScore(plan.waiting_periods, persona);
        const waitingPeriodScore = computeWaitingPeriodScore(plan.waiting_periods, persona);

        const weightedScore =
          premiumScore * normalizeWeight(weights.premium) +
          csrScore * normalizeWeight(weights.csr) +
          complaintScore * normalizeWeight(weights.complaints) +
          featureScore * normalizeWeight(weights.features) +
          familyScore * normalizeWeight(weights.family) +
          networkScore * normalizeWeight(weights.network) +
          solvencyScore * normalizeWeight(weights.solvency) +
          pedMatchScore * normalizeWeight(weights.pedMatch) +
          waitingPeriodScore * normalizeWeight(weights.waitingPeriod);

        const trustScore = Math.round(
          (csrScore * 0.5) + (solvencyScore * 0.3) + (complaintScore * 0.2)
        );

        const compatibilityScore = Math.round(
          (premiumScore * 0.25) + (pedMatchScore * 0.2) + (familyScore * 0.2) +
          (featureScore * 0.2) + (networkScore * 0.15)
        );

        const flags = generateIRDAIFlags(
          { csrValue: plan.csrValue, csr: plan.csr, waiting_periods: plan.waiting_periods },
          category
        );

        const riders = matchRiders(persona, plan.id, category);

        const scoredPlan: ScoredPlan = {
          planId: plan.id,
          planName: plan.name,
          insurer: plan.insurer,
          category: 'health',
          score: Math.round(Math.max(0, Math.min(100, weightedScore))),
          trustScore,
          compatibilityScore,
          recommendedRiders: riders,
          explanation: '',
          flags,
        };

        scoredPlan.explanation = generateExplanation(persona, scoredPlan);
        scoredPlans.push(scoredPlan);
      }
      break;

    case 'term':
      for (const plan of termPlans) {
        const premiumScore = computePremiumScore(plan.premium1Cr, persona);
        const csrScore = computeCSRScore(plan.csrValue);
        const featureScore = Math.min(100, 40 + plan.features.length * 8 + plan.ridersAvailable.length * 5);
        const familyScore = Math.min(100, 50 + (persona.dependents > 0 ? 25 : 0) + (persona.familySize > 3 ? 15 : 0));
        const solvencyScore = computeSolvencyScore(plan.solvencyRatio);
        const networkScore = 70; // Not applicable for term, neutral

        const weightedScore =
          premiumScore * normalizeWeight(weights.premium) +
          csrScore * normalizeWeight(weights.csr) +
          featureScore * normalizeWeight(weights.features) +
          familyScore * normalizeWeight(weights.family) +
          solvencyScore * normalizeWeight(weights.solvency);

        const trustScore = Math.round(
          (csrScore * 0.4) + (solvencyScore * 0.35) + (Math.max(0, 100 - plan.claimTurnaroundDays * 1.5) * 0.25)
        );

        const compatibilityScore = Math.round(
          (premiumScore * 0.3) + (familyScore * 0.25) + (featureScore * 0.25) + (csrScore * 0.2)
        );

        const flags = generateIRDAIFlags(
          { csrValue: plan.csrValue, csr: plan.csr, solvencyRatio: plan.solvencyRatio },
          category
        );

        const riders = matchRiders(persona, plan.id, category);

        const scoredPlan: ScoredPlan = {
          planId: plan.id,
          planName: plan.name,
          insurer: plan.insurer,
          category: 'term',
          score: Math.round(Math.max(0, Math.min(100, weightedScore))),
          trustScore,
          compatibilityScore,
          recommendedRiders: riders,
          explanation: '',
          flags,
        };

        scoredPlan.explanation = generateExplanation(persona, scoredPlan);
        scoredPlans.push(scoredPlan);
      }
      break;

    case 'motor':
      // Motor plans are add-on focused — score add-ons and create a generic motor scored plan
      for (const addon of motorAddons) {
        let relevanceScore = 50;

        if (persona.vehicleAge !== undefined) {
          if (persona.vehicleAge <= 3 && ['Zero Depreciation Cover', 'Return to Invoice (RTI)'].includes(addon.name)) {
            relevanceScore = 95;
          } else if (persona.vehicleAge <= 5 && addon.name === 'Zero Depreciation Cover') {
            relevanceScore = 85;
          } else if (persona.vehicleAge > 5 && addon.name === 'No Claim Bonus Protection') {
            relevanceScore = 80;
          } else if (addon.bestForVehicleAge === 'Any age') {
            relevanceScore = 70;
          } else {
            relevanceScore = 40;
          }
        } else if (addon.recommended) {
          relevanceScore = 75;
        }

        if (persona.purchaseIntent === 'comprehensive') {
          relevanceScore = Math.min(100, relevanceScore + 15);
        }

        const scoredPlan: ScoredPlan = {
          planId: addon.id,
          planName: addon.name,
          insurer: 'Multiple Insurers',
          category: 'motor',
          score: Math.round(relevanceScore),
          trustScore: 70,
          compatibilityScore: Math.round(relevanceScore * 0.8),
          recommendedRiders: [],
          explanation: generateMotorAddonExplanation(addon, persona),
          flags: [],
        };

        scoredPlans.push(scoredPlan);
      }
      break;

    case 'senior':
      for (const plan of seniorCitizenPlans) {
        const premiumScore = computePremiumScore(plan.premium, persona);
        const csrScore = computeCSRScore(parseFloat(plan.csr));
        const featureScore = Math.min(100, 40 + plan.keyFeatures.length * 8);
        const familyScore = 60; // Senior plans are inherently family-focused
        const networkScore = 60;
        const pedMatchScore = plan.waitingPeriodPED === '24 months' ? 90 : plan.waitingPeriodPED === '36 months' ? 65 : 35;

        const weightedScore =
          premiumScore * normalizeWeight(weights.premium) +
          csrScore * normalizeWeight(weights.csr) +
          featureScore * normalizeWeight(weights.features) +
          familyScore * normalizeWeight(weights.family) +
          networkScore * normalizeWeight(weights.network) +
          pedMatchScore * normalizeWeight(weights.pedMatch);

        const trustScore = Math.round(
          (csrScore * 0.5) + (premiumScore * 0.3) + (featureScore * 0.2)
        );

        const compatibilityScore = Math.round(
          (premiumScore * 0.25) + (pedMatchScore * 0.3) + (featureScore * 0.25) + (familyScore * 0.2)
        );

        const flags = generateIRDAIFlags(
          {
            csrValue: parseFloat(plan.csr),
            csr: plan.csr,
            waitingPeriodPED: plan.waitingPeriodPED,
            coPayment: plan.coPayment,
          },
          category
        );

        const riders = matchRiders(persona, plan.id, category);

        const scoredPlan: ScoredPlan = {
          planId: plan.id,
          planName: plan.name,
          insurer: plan.insurer,
          category: 'senior',
          score: Math.round(Math.max(0, Math.min(100, weightedScore))),
          trustScore,
          compatibilityScore,
          recommendedRiders: riders,
          explanation: '',
          flags,
        };

        scoredPlan.explanation = generateExplanation(persona, scoredPlan);
        scoredPlans.push(scoredPlan);
      }
      break;

    case 'critical-illness':
      for (const plan of criticalIllnessPlans) {
        const premiumScore = computePremiumScore(plan.premium, persona);
        const illnessMatchScore = computeIllnessMatchScore(plan.illnesses, persona);
        const featureScore = Math.min(100, 40 + plan.illnesses.length * 5);
        const csrScore = 75; // Generic for CI plans

        const weightedScore =
          premiumScore * normalizeWeight(weights.premium) +
          csrScore * normalizeWeight(weights.csr) +
          featureScore * normalizeWeight(weights.features) +
          illnessMatchScore * normalizeWeight(weights.pedMatch);

        const trustScore = Math.round(
          (csrScore * 0.4) + (illnessMatchScore * 0.3) + (premiumScore * 0.3)
        );

        const compatibilityScore = Math.round(
          (illnessMatchScore * 0.4) + (premiumScore * 0.3) + (featureScore * 0.3)
        );

        const riders = matchRiders(persona, plan.id, category);

        const scoredPlan: ScoredPlan = {
          planId: plan.id,
          planName: plan.name,
          insurer: plan.insurer,
          category: 'critical-illness',
          score: Math.round(Math.max(0, Math.min(100, weightedScore))),
          trustScore,
          compatibilityScore,
          recommendedRiders: riders,
          explanation: '',
          flags: [],
        };

        scoredPlan.explanation = generateExplanation(persona, scoredPlan);
        scoredPlans.push(scoredPlan);
      }
      break;

    default:
      break;
  }

  // Sort by score descending
  return scoredPlans.sort((a, b) => b.score - a.score);
}

/**
 * Computes how well a critical illness plan's covered illnesses match the user's medical history.
 */
function computeIllnessMatchScore(illnesses: string[], persona: Persona): number {
  const medHistory = persona.medicalHistory.map(m => m.toLowerCase());
  if (medHistory.length === 0) return 60; // Neutral if no medical history

  let matchCount = 0;
  const illnessLower = illnesses.map(i => i.toLowerCase());

  for (const condition of medHistory) {
    if (condition.includes('heart') && illnessLower.some(i => i.includes('heart'))) matchCount++;
    if (condition.includes('cancer') && illnessLower.some(i => i.includes('cancer'))) matchCount++;
    if (condition.includes('stroke') && illnessLower.some(i => i.includes('stroke'))) matchCount++;
    if (condition.includes('kidney') && illnessLower.some(i => i.includes('kidney'))) matchCount++;
    if (['diabetes', 'diabetic'].includes(condition) && illnessLower.some(i => i.includes('kidney') || i.includes('organ'))) matchCount++;
    if (condition.includes('bp') && illnessLower.some(i => i.includes('heart') || i.includes('stroke'))) matchCount++;
  }

  if (matchCount >= 3) return 100;
  if (matchCount >= 2) return 85;
  if (matchCount >= 1) return 70;
  return 50;
}

// ============================================================================
// 3. SMART ADD-ON & RIDER MATCHING
// ============================================================================

/**
 * Matches relevant riders/add-ons for a given plan and persona.
 * Uses medical history, family size, age, lifestyle, and vehicle age
 * to determine the most beneficial riders.
 *
 * Rules:
 * - heart-disease → Critical Illness Rider
 * - diabetes → Consumables Cover + Critical Illness Rider
 * - familySize > 3 → Maternity Cover (if applicable) + Family Floater
 * - purchaseIntent === 'comprehensive' → suggest all relevant riders
 * - age > 55 → Senior Citizen plans
 * - vehicleAge <= 3 → Zero Dep + RTI
 * - smoker → Critical Illness Rider
 *
 * @param persona - User persona
 * @param planId - The plan ID to match riders for
 * @param category - Insurance category
 * @returns Array of recommended riders with reasons
 */
export function matchRiders(
  persona: Persona,
  planId: string,
  category: string
): Array<{ id: string; name: string; reason: string }> {
  const riders: Array<{ id: string; name: string; reason: string }> = [];
  const medHistory = persona.medicalHistory.map(m => m.toLowerCase());
  const hasComprehensive = persona.purchaseIntent === 'comprehensive';

  // ----- HEALTH RIDERS -----
  if (category === 'health') {
    const plan = healthPlans.find(p => p.id === planId);

    // Heart disease → Critical Illness Rider
    if (medHistory.some(m => ['heart-disease', 'heart', 'cardiac'].includes(m))) {
      riders.push({
        id: 'hr-001',
        name: 'Critical Illness Rider',
        reason: 'Aapke heart condition ke liye Critical Illness Rider bahut important hai — isse heart attack par lump sum payment milega.',
      });
    }

    // Diabetes → Consumables Cover + Critical Illness
    if (medHistory.some(m => ['diabetes', 'diabetic', 'diabetes-type-2'].includes(m))) {
      riders.push({
        id: 'hr-005',
        name: 'Consumables Cover',
        reason: 'Diabetes patients ko zyada hospitalizations hote hain — Consumables Cover se PPE kits, syringes, etc. ka expense bhi cover hoga.',
      });

      if (!riders.some(r => r.id === 'hr-001')) {
        riders.push({
          id: 'hr-001',
          name: 'Critical Illness Rider',
          reason: 'Diabetes se kidney failure ka risk badh jaata hai — Critical Illness Rider se aap financially protected rahenge.',
        });
      }
    }

    // Smoker → Critical Illness Rider
    if (persona.lifestyle.some(l => l.toLowerCase() === 'smoker')) {
      if (!riders.some(r => r.id === 'hr-001')) {
        riders.push({
          id: 'hr-001',
          name: 'Critical Illness Rider',
          reason: 'Smoking se cancer aur heart disease ka risk zyada hota hai — Critical Illness Rider aapko extra protection dega.',
        });
      }
    }

    // Family size > 3 → Maternity + Family Floater suggestions
    if (persona.familySize > 3) {
      if (plan?.maternityCover || plan?.availableRiders.includes('maternity-plus')) {
        riders.push({
          id: 'hr-004',
          name: 'Maternity Plus Rider',
          reason: 'Aapki family badi hai — Maternity Cover se delivery aur newborn care ka expense bhi cover hoga.',
        });
      }

      if (plan?.coverage_type?.includes('Floater')) {
        riders.push({
          id: 'hr-007',
          name: 'OPD Cover Rider',
          reason: 'Badi family mein OPD visits zyada hoti hain — OPD Cover se doctor consultation aur tests bhi cover honge.',
        });
      }
    }

    // Comprehensive intent → add all relevant riders
    if (hasComprehensive) {
      const availableRiders = plan?.availableRiders || [];
      for (const riderId of availableRiders) {
        if (!riders.some(r => r.id === riderId || r.id === `hr-${riderId}`)) {
          const riderData = healthRiders.find(r => r.id === riderId || r.category === riderId);
          if (riderData) {
            riders.push({
              id: riderData.id,
              name: riderData.name,
              reason: `Comprehensive coverage ke liye ${riderData.name} add karna smart move hai — ${riderData.bestFor.toLowerCase()}.`,
            });
          }
        }
      }
    }

    // Hospital Cash for sedentary lifestyle
    if (persona.lifestyle.some(l => l.toLowerCase() === 'sedentary')) {
      if (!riders.some(r => r.id === 'hr-002')) {
        riders.push({
          id: 'hr-002',
          name: 'Hospital Cash Rider',
          reason: 'Sedentary lifestyle se hospitalization ka risk badh jaata hai — Hospital Cash Rider se daily allowance milega.',
        });
      }
    }
  }

  // ----- TERM RIDERS -----
  if (category === 'term') {
    const plan = termPlans.find(p => p.id === planId);

    // Heart disease → Critical Illness Rider
    if (medHistory.some(m => ['heart-disease', 'heart', 'cardiac'].includes(m))) {
      riders.push({
        id: 'tr-001',
        name: 'Critical Illness Rider',
        reason: 'Heart condition ke liye Critical Illness Rider zaroori hai — diagnosis par lump sum payment milega aur future premiums bhi waive ho jayenge.',
      });
    }

    // Diabetes → Critical Illness + Waiver of Premium
    if (medHistory.some(m => ['diabetes', 'diabetic'].includes(m))) {
      if (!riders.some(r => r.id === 'tr-001')) {
        riders.push({
          id: 'tr-001',
          name: 'Critical Illness Rider',
          reason: 'Diabetes se critical illness ka risk badhta hai — Critical Illness Rider se aap protected rahenge.',
        });
      }
      riders.push({
        id: 'tr-003',
        name: 'Waiver of Premium Rider',
        reason: 'Diabetes ki wajah se agar aap kaam nahi kar paaye toh Waiver of Premium Rider se policy continue rahegi bina premium ke.',
      });
    }

    // Smoker → Critical Illness + Terminal Illness
    if (persona.lifestyle.some(l => l.toLowerCase() === 'smoker')) {
      if (!riders.some(r => r.id === 'tr-001')) {
        riders.push({
          id: 'tr-001',
          name: 'Critical Illness Rider',
          reason: 'Smoking se cancer aur heart attack ka risk zyada hai — Critical Illness Rider extra protection dega.',
        });
      }
      riders.push({
        id: 'tr-005',
        name: 'Terminal Illness Rider',
        reason: 'Smokers ke liye terminal illness ka risk badhta hai — early payout se medical aur personal expenses cover honge.',
      });
    }

    // Sole earner → Accidental Death + Disability Income
    if (persona.dependents > 0 && persona.familySize > 2) {
      riders.push({
        id: 'tr-002',
        name: 'Accidental Death Benefit Rider',
        reason: 'Aapke dependents hain — Accidental Death Benefit Rider se unhe extra financial protection milega.',
      });
      riders.push({
        id: 'tr-006',
        name: 'Disability Income Rider',
        reason: 'Agar accident se disability aa jaye toh Disability Income Rider se monthly income continue rahega.',
      });
    }

    // Comprehensive intent → all riders
    if (hasComprehensive && plan) {
      for (const riderId of plan.ridersAvailable) {
        if (!riders.some(r => r.id === riderId || r.id === `tr-${riderId}`)) {
          const riderData = termRiders.find(r => r.id === riderId || r.name.toLowerCase().includes(riderId.replace(/-/g, ' ')));
          if (riderData) {
            riders.push({
              id: riderData.id,
              name: riderData.name,
              reason: `Comprehensive protection ke liye ${riderData.name} add karein — ${riderData.bestFor.toLowerCase()}.`,
            });
          }
        }
      }
    }
  }

  // ----- MOTOR ADD-ONS -----
  if (category === 'motor') {
    // Vehicle age <= 3 → Zero Dep + RTI
    if (persona.vehicleAge !== undefined && persona.vehicleAge <= 3) {
      riders.push({
        id: 'ma-001',
        name: 'Zero Depreciation Cover',
        reason: 'Aapki gaadi nayi hai (3 saal se kam) — Zero Dep se full claim settlement milega bina depreciation deduct kiye.',
      });
      riders.push({
        id: 'ma-002',
        name: 'Return to Invoice (RTI)',
        reason: 'Nayi gaadi ke liye RTI best hai — agar total loss ho toh full invoice value milega, IDV nahi.',
      });
    }

    // Vehicle age <= 5 → Zero Dep + Engine Protection
    if (persona.vehicleAge !== undefined && persona.vehicleAge <= 5 && persona.vehicleAge > 3) {
      riders.push({
        id: 'ma-001',
        name: 'Zero Depreciation Cover',
        reason: '5 saal tak Zero Dep useful rehta hai — repair cost mein depreciation nahi kategi.',
      });
      riders.push({
        id: 'ma-003',
        name: 'Engine Protection Cover',
        reason: 'Monsoon mein water logging se engine damage common hai — Engine Protection Cover se ye expense bhi cover hoga.',
      });
    }

    // Always recommend roadside assistance and PA cover
    riders.push({
      id: 'ma-004',
      name: 'Roadside Assistance',
      reason: 'Highway ya raaste mein breakdown ho toh 24/7 roadside assistance bahut kaam aata hai.',
    });

    if (!riders.some(r => r.id === 'ma-006')) {
      riders.push({
        id: 'ma-006',
        name: 'Personal Accident Cover',
        reason: 'IRDAI ke according mandatory hai — accidental death aur disability cover ke liye.',
      });
    }

    // Comprehensive intent → add consumables and NCB protection
    if (hasComprehensive) {
      riders.push({
        id: 'ma-005',
        name: 'Consumables Cover',
        reason: 'Comprehensive coverage ke liye — engine oil, nuts-bolts jo normally exclude hote hain wo bhi cover honge.',
      });
      riders.push({
        id: 'ma-007',
        name: 'No Claim Bonus Protection',
        reason: 'Agar ek claim bhi karoge toh NCB zero nahi hoga — renewal discount safe rahegi.',
      });
    }
  }

  // ----- SENIOR CITIZEN RIDERS -----
  if (category === 'senior') {
    // Always suggest critical illness for seniors
    riders.push({
      id: 'hr-001',
      name: 'Critical Illness Rider',
      reason: 'Senior citizens mein critical illness ka risk zyada hota hai — ye rider extra lump sum payment dega.',
    });

    if (medHistory.some(m => ['diabetes', 'bp', 'heart-disease', 'heart'].includes(m.toLowerCase()) || ['diabetes', 'bp', 'heart-disease', 'heart'].includes(m))) {
      riders.push({
        id: 'hr-005',
        name: 'Consumables Cover',
        reason: 'Aapki medical condition ke karan hospital visits zyada ho sakti hain — Consumables Cover se extra expenses bhi cover honge.',
      });
    }
  }

  // ----- CRITICAL ILLNESS RIDERS -----
  if (category === 'critical-illness') {
    // Suggest term plan rider if they don't have life insurance
    if (!persona.existingInsurance.some(e => e.toLowerCase().includes('term') || e.toLowerCase().includes('life'))) {
      riders.push({
        id: 'tr-003',
        name: 'Waiver of Premium Rider',
        reason: 'Critical Illness Plan ke saath Waiver of Premium rider add karein — agar diagnosis ho toh future premiums maaf.',
      });
    }
  }

  return riders;
}

// ============================================================================
// 4. HINGLISH EXPLANATION GENERATOR
// ============================================================================

/**
 * Generates a natural Hinglish (Hindi-English mix) explanation for why
 * a particular plan is recommended for the user.
 *
 * @param persona - User persona
 * @param plan - Scored plan with all scores computed
 * @returns Hinglish explanation string
 */
export function generateExplanation(persona: Persona, plan: ScoredPlan): string {
  const parts: string[] = [];

  // Opening based on score
  if (plan.score >= 85) {
    parts.push(`Yeh plan aapke liye excellent match hai!`);
  } else if (plan.score >= 70) {
    parts.push(`Yeh plan aapke liye bahut accha option hai.`);
  } else if (plan.score >= 55) {
    parts.push(`Yeh plan aapke liye decent option hai.`);
  } else {
    parts.push(`Yeh plan consider kar sakte hain, lekin aur options bhi compare karein.`);
  }

  // Trust explanation
  if (plan.trustScore >= 85) {
    parts.push(`Iska trust score ${plan.trustScore}/100 hai — matlab yeh insurer reliable hai aur claims settle karne mein acha hai.`);
  } else if (plan.trustScore >= 65) {
    parts.push(`Trust score ${plan.trustScore}/100 hai — average se thoda better, lekin CSR check zaroor karein.`);
  } else {
    parts.push(`Trust score sirf ${plan.trustScore}/100 hai — claim settlement mein dikkat aa sakti hai, dhyan se decide karein.`);
  }

  // Category-specific explanations
  switch (plan.category) {
    case 'health': {
      const healthPlan = healthPlans.find(p => p.id === plan.planId);
      if (healthPlan) {
        // CSR
        parts.push(`Iska CSR ${healthPlan.csr} hai — matlab claim rejection ka risk ${healthPlan.csrValue >= 99 ? 'bahut kam' : healthPlan.csrValue >= 95 ? 'kam' : 'moderate'} hai.`);

        // Waiting period for PED
        const medHistory = persona.medicalHistory.map(m => m.toLowerCase());
        if (medHistory.some(m => ['diabetes', 'diabetic'].includes(m))) {
          parts.push(`Aapke diabetes ke liye waiting period ${healthPlan.waiting_periods.diabetes} months hai, jo ${healthPlan.waiting_periods.diabetes <= 24 ? 'industry average se better hai' : healthPlan.waiting_periods.diabetes <= 36 ? 'industry average ke aas-paas hai' : 'industry average se zyada hai — dhyan rakhein'}.`);
        }
        if (medHistory.some(m => ['bp', 'hypertension'].includes(m))) {
          parts.push(`BP ke liye waiting period ${healthPlan.waiting_periods.bp} months hai — ${healthPlan.waiting_periods.bp <= 24 ? 'yeh achha hai' : 'yeh thoda zyada hai'}.`);
        }
        if (medHistory.some(m => ['heart-disease', 'heart', 'cardiac'].includes(m))) {
          parts.push(`Heart condition ke liye waiting period ${healthPlan.waiting_periods.heart} months hai — ${healthPlan.waiting_periods.heart <= 36 ? 'acceptable hai' : 'bahut lamba hai, compare karein'}.`);
        }

        // Premium affordability
        const budget = getAnnualBudget(persona);
        if (healthPlan.premium <= budget) {
          parts.push(`Budget bhi match karta hai — ₹${healthPlan.premium.toLocaleString()}/year aapki pocket mein easily aayega.`);
        } else {
          const over = healthPlan.premium - budget;
          parts.push(`Premium ₹${healthPlan.premium.toLocaleString()}/year hai, jo aapke budget se ₹${over.toLocaleString()} zyada hai — lekin features justify karte hain.`);
        }

        // Network hospitals
        if (healthPlan.networkHospitals >= 10000) {
          parts.push(`${healthPlan.networkHospitals.toLocaleString()}+ network hospitals hain — cashless treatment ke liye options bahut hain.`);
        }

        // Family features
        if (persona.familySize > 3 && healthPlan.maternityCover) {
          parts.push(`Maternity cover bhi hai — badi family ke liye yeh plus point hai.`);
        }
        if (healthPlan.restoration) {
          parts.push(`Sum insured restoration feature hai — agar ek claim mein sum exhaust ho jaye toh dobara restore hota hai.`);
        }
      }
      break;
    }

    case 'term': {
      const termPlan = termPlans.find(p => p.id === plan.planId);
      if (termPlan) {
        parts.push(`CSR ${termPlan.csr} hai — ${termPlan.csrValue >= 99 ? 'almost guaranteed claim settlement' : termPlan.csrValue >= 97 ? 'very reliable claim settlement' : 'decent claim settlement record'}.`);

        if (termPlan.solvencyRatio >= 2.0) {
          parts.push(`Solvency ratio ${termPlan.solvencyRatio} hai — IRDAI minimum 1.5 se kaafi better, insurer financially strong hai.`);
        }

        parts.push(`₹1 Cr cover ke liye premium ₹${termPlan.premium1Cr.toLocaleString()}/year hai — ${termPlan.premium1Cr <= 12000 ? 'bahut affordable' : termPlan.premium1Cr <= 15000 ? 'reasonable' : 'thoda premium'}.`);

        if (termPlan.claimTurnaroundDays <= 30) {
          parts.push(`Claim turnaround sirf ${termPlan.claimTurnaroundDays} days — bahut fast!`);
        }

        if (persona.dependents > 0) {
          parts.push(`Aapke ${persona.dependents} dependents ke liye yeh term plan solid protection dega.`);
        }
      }
      break;
    }

    case 'motor': {
      parts.push(`Yeh add-on aapke vehicle ke liye useful hai.`);
      if (persona.vehicleAge !== undefined && persona.vehicleAge <= 3) {
        parts.push(`Aapki gaadi relatively nayi hai — naye vehicle ke liye yeh add-on best return dega.`);
      }
      break;
    }

    case 'senior': {
      const seniorPlan = seniorCitizenPlans.find(p => p.id === plan.planId);
      if (seniorPlan) {
        parts.push(`Entry age ${seniorPlan.entryAge} hai — ${persona.age >= 60 ? 'aap eligible hain' : 'age requirement check karein'}.`);
        parts.push(`Co-payment ${seniorPlan.coPayment} hai — matlab har claim mein aapko itna percent khud dena hoga.`);
        parts.push(`PED waiting period ${seniorPlan.waitingPeriodPED} hai — ${seniorPlan.waitingPeriodPED === '24 months' ? 'yeh industry mein sabse kam hai!' : seniorPlan.waitingPeriodPED === '36 months' ? 'yeh average hai' : 'yeh kaafi lamba hai'}.`);
      }
      break;
    }

    case 'critical-illness': {
      const ciPlan = criticalIllnessPlans.find(p => p.id === plan.planId);
      if (ciPlan) {
        parts.push(`Yeh plan ${ciPlan.illnesses.length} critical illnesses cover karta hai including ${ciPlan.illnesses.slice(0, 3).join(', ')}.`);
        parts.push(`Waiting period ${ciPlan.waitingPeriod} hai aur survival period ${ciPlan.survivalPeriod} hai.`);
        parts.push(`Payout type ${ciPlan.payoutType} hai — matlab diagnosis par ek lump sum amount milega.`);
      }
      break;
    }
  }

  // Flags as warnings
  if (plan.flags.length > 0) {
    parts.push(`⚠️ Important: ${plan.flags.join(' ')}`);
  }

  return parts.join(' ');
}

/**
 * Generates a Hinglish explanation for a motor add-on.
 */
function generateMotorAddonExplanation(addon: MotorAddon, persona: Persona): string {
  const parts: string[] = [];

  parts.push(`${addon.name}: ${addon.description}`);

  if (addon.recommended) {
    parts.push('Yeh add-on highly recommended hai industry experts dwara.');
  }

  if (persona.vehicleAge !== undefined) {
    if (addon.bestForVehicleAge === 'Any age') {
      parts.push('Kisi bhi age ki gaadi ke liye suitable hai.');
    } else if (persona.vehicleAge <= 3 && addon.bestForVehicleAge.includes('0-3')) {
      parts.push('Aapki nayi gaadi ke liye yeh perfect add-on hai!');
    } else if (persona.vehicleAge <= 5 && addon.bestForVehicleAge.includes('0-5')) {
      parts.push('Aapki gaadi ke liye yeh add-on bahut useful rahega.');
    }
  }

  parts.push(`Average cost: ${addon.avgCost}.`);

  return parts.join(' ');
}

// ============================================================================
// 5. REAL-TIME RE-RANKING
// ============================================================================

/**
 * Re-ranks existing recommendations based on user feedback/interaction.
 * Adjusts the weight priorities dynamically and re-sorts the results.
 *
 * @param persona - Current user persona
 * @param currentRecommendations - Existing scored plans to re-rank
 * @param userFeedback - Type of feedback from user interaction
 * @returns Re-ranked array of scored plans
 */
export function reRankBasedOnInteraction(
  persona: Persona,
  currentRecommendations: ScoredPlan[],
  userFeedback: 'lower_premium' | 'higher_csr' | 'better_coverage' | 'family_focused' | 'ped_focused'
): ScoredPlan[] {
  const reRanked = currentRecommendations.map(plan => {
    let adjustedScore = plan.score;
    let adjustedTrust = plan.trustScore;
    let adjustedCompat = plan.compatibilityScore;

    switch (userFeedback) {
      case 'lower_premium': {
        // Boost plans with lower premiums (infer from score components)
        // Premium-competitive plans get a boost
        const premiumBoost = plan.category === 'health'
          ? (healthPlans.find(p => p.id === plan.planId)?.premium ?? 0) < 6000 ? 10 : 0
          : plan.category === 'term'
            ? (termPlans.find(p => p.id === plan.planId)?.premium1Cr ?? 0) < 12000 ? 10 : 0
            : 0;
        adjustedScore = Math.min(100, adjustedScore + premiumBoost);
        adjustedCompat = Math.min(100, adjustedCompat + Math.round(premiumBoost * 0.5));
        break;
      }

      case 'higher_csr': {
        // Boost plans with higher CSR
        const csrBoost = plan.trustScore >= 90 ? 12 : plan.trustScore >= 80 ? 8 : 0;
        adjustedScore = Math.min(100, adjustedScore + csrBoost);
        adjustedTrust = Math.min(100, adjustedTrust + Math.round(csrBoost * 0.7));
        break;
      }

      case 'better_coverage': {
        // Boost plans with more features
        const featureBoost = plan.compatibilityScore >= 80 ? 10 : plan.compatibilityScore >= 60 ? 5 : 0;
        adjustedScore = Math.min(100, adjustedScore + featureBoost);
        adjustedCompat = Math.min(100, adjustedCompat + Math.round(featureBoost * 0.6));
        break;
      }

      case 'family_focused': {
        // Boost family-friendly plans
        const familyBoost = plan.category === 'health'
          ? (healthPlans.find(p => p.id === plan.planId)?.maternityCover ?? false) ? 12 : 0
          : persona.dependents > 0 ? 8 : 0;
        adjustedScore = Math.min(100, adjustedScore + familyBoost);
        adjustedCompat = Math.min(100, adjustedCompat + Math.round(familyBoost * 0.5));
        break;
      }

      case 'ped_focused': {
        // Boost PED-friendly plans (lower waiting periods)
        const pedBoost = plan.category === 'health'
          ? (() => {
              const hp = healthPlans.find(p => p.id === plan.planId);
              if (!hp) return 0;
              if (hp.waiting_periods.ped <= 24) return 15;
              if (hp.waiting_periods.ped <= 36) return 8;
              return 0;
            })()
          : plan.category === 'senior'
            ? (() => {
                const sp = seniorCitizenPlans.find(p => p.id === plan.planId);
                if (!sp) return 0;
                if (sp.waitingPeriodPED === '24 months') return 15;
                if (sp.waitingPeriodPED === '36 months') return 8;
                return 0;
              })()
            : 0;
        adjustedScore = Math.min(100, adjustedScore + pedBoost);
        adjustedCompat = Math.min(100, adjustedCompat + Math.round(pedBoost * 0.5));
        break;
      }
    }

    return {
      ...plan,
      score: Math.round(adjustedScore),
      trustScore: Math.round(adjustedTrust),
      compatibilityScore: Math.round(adjustedCompat),
    };
  });

  // Re-sort by adjusted score
  return reRanked.sort((a, b) => b.score - a.score);
}

// ============================================================================
// 6. PROFILE STRENGTH CALCULATOR
// ============================================================================

/**
 * Calculates the profile strength based on completeness of the persona data.
 * Returns a score from 0-100, along with missing fields and tips to improve.
 *
 * @param persona - User persona to evaluate
 * @returns Object with score, missing field descriptions, and improvement tips
 */
export function calculateProfileStrength(persona: Persona): {
  score: number;
  missing: string[];
  tips: string[];
} {
  const missing: string[] = [];
  const tips: string[] = [];
  let score = 100;

  // Age check
  if (!persona.age || persona.age === 30) {
    // 30 is our default, might be user input or default
    score -= 10;
    tips.push('Apni age batayein — isse better recommendations milenge (e.g., 25, 35, 45).');
  }

  // Income check
  if (persona.income === '5-10l') {
    // This is the default, might not be explicitly set
    score -= 10;
    tips.push('Apni annual income bracket batayein — premium affordability accurately calculate hogi.');
  }

  // Family size
  if (persona.familySize <= 1) {
    score -= 5;
    tips.push('Family size update karein — family floater aur maternity cover suggestions improve honge.');
  }

  // Dependents
  if (persona.dependents === 0 && persona.age >= 30) {
    score -= 10;
    missing.push('Dependents ki information');
    tips.push('Agar aapke dependents hain (bachhe, parents) toh batayein — term aur health plan better suggest honge.');
  }

  // Medical history
  if (persona.medicalHistory.length === 0) {
    score -= 15;
    missing.push('Medical history');
    tips.push('Agar aapko koi condition hai (diabetes, BP, heart disease) toh batayein — PED waiting period ke hisaab se better plan milega.');
  } else {
    // Check for incomplete medical history
    if (persona.age > 40 && persona.medicalHistory.length === 0) {
      score -= 5;
      tips.push('40+ age mein medical checkup karayein aur results share karein — accurate recommendations ke liye.');
    }
  }

  // Lifestyle
  if (persona.lifestyle.length === 0) {
    score -= 10;
    missing.push('Lifestyle information');
    tips.push('Lifestyle details share karein (smoker, exercise, sedentary) — isse risk assessment better hogi.');
  }

  // Purchase intent
  if (persona.purchaseIntent === 'budget') {
    // Might be default
    score -= 5;
    tips.push('Apna primary focus batayein — budget, premium coverage, family protection, ya PED-specific? Isse weights adjust honge.');
  }

  // Preferred hospitals
  if (persona.preferredHospitals.length === 0) {
    score -= 5;
    missing.push('Preferred hospitals');
    tips.push('Preferred hospitals batayein — network hospital matching improve hogi.');
  }

  // Vehicle age (only for motor)
  if (persona.vehicleAge === undefined) {
    score -= 3;
    tips.push('Agar vehicle insurance chahiye toh gaadi ki age batayein — Zero Dep aur RTI suggestions accurate honge.');
  }

  // Existing insurance
  if (persona.existingInsurance.length === 0) {
    score -= 5;
    missing.push('Existing insurance details');
    tips.push('Existing insurance policies batayein — overlapping coverage avoid hogi aur gaps fill honge.');
  }

  // Positive tips
  if (persona.medicalHistory.length > 0) {
    tips.push('👍 Medical history share karne ke liye — aapko PED-specific plans accurately milenge.');
  }

  if (persona.familySize > 2) {
    tips.push('👍 Family size ke hisaab se — family floater aur maternity options automatically recommend honge.');
  }

  score = Math.max(0, Math.min(100, score));

  return { score, missing, tips };
}

// ============================================================================
// 7. MAIN RECOMMEND FUNCTION
// ============================================================================

/**
 * Main recommendation function that provides comprehensive insurance recommendations.
 * Returns top plans, suggested riders, profile strength analysis, and a Hinglish summary.
 *
 * @param persona - User persona with preferences and medical history
 * @param category - Optional category filter ('health', 'term', 'motor', 'senior', 'critical-illness')
 * @returns Complete recommendation result with plans, riders, profile analysis, and summary
 */
export function recommend(persona: Persona, category?: string): {
  topPlans: ScoredPlan[];
  suggestedRiders: Array<{ id: string; name: string; reason: string }>;
  profileStrength: { score: number; missing: string[]; tips: string[] };
  summary: string;
} {
  // Determine which categories to score
  const categories: string[] = category
    ? [category]
    : (persona.age > 55
        ? ['health', 'term', 'senior']
        : persona.medicalHistory.some(m =>
            ['heart-disease', 'heart', 'cancer', 'stroke'].includes(m.toLowerCase())
          )
          ? ['health', 'term', 'critical-illness']
          : ['health', 'term']);

  // Score plans across categories
  let allScoredPlans: ScoredPlan[] = [];

  for (const cat of categories) {
    const scored = scorePlans(persona, cat);
    allScoredPlans = allScoredPlans.concat(scored);
  }

  // Sort all plans by score
  allScoredPlans.sort((a, b) => b.score - a.score);

  // Take top plans (max 5 per category, 10 overall)
  const topPlans = allScoredPlans.slice(0, 10);

  // Collect all suggested riders from top plans (deduplicated)
  const riderMap = new Map<string, { id: string; name: string; reason: string }>();
  for (const plan of topPlans) {
    for (const rider of plan.recommendedRiders) {
      if (!riderMap.has(rider.id)) {
        riderMap.set(rider.id, rider);
      }
    }
  }
  const suggestedRiders = Array.from(riderMap.values());

  // Calculate profile strength
  const profileStrength = calculateProfileStrength(persona);

  // Generate Hinglish summary
  const summary = generateSummary(persona, topPlans, profileStrength);

  return {
    topPlans,
    suggestedRiders,
    profileStrength,
    summary,
  };
}

/**
 * Generates a comprehensive Hinglish summary of all recommendations.
 */
function generateSummary(
  persona: Persona,
  topPlans: ScoredPlan[],
  profileStrength: { score: number; missing: string[]; tips: string[] }
): string {
  const parts: string[] = [];

  // Greeting based on profile
  if (persona.age < 30) {
    parts.push('Aap young professional hain — abhi insurance lena sabse smart decision hai!');
  } else if (persona.age >= 30 && persona.age < 45) {
    parts.push('Aapki age mein insurance lena bahut important hai — family aur future dono secure honge.');
  } else if (persona.age >= 45 && persona.age < 55) {
    parts.push('45+ age mein health insurance lena zaroori hai — medical expenses badh sakte hain.');
  } else {
    parts.push('Senior citizen ke liye special plans available hain — healthcare expenses ke liye tayyar rahiye.');
  }

  // Profile strength
  if (profileStrength.score >= 80) {
    parts.push(`Aapka profile ${profileStrength.score}% complete hai — recommendations accurate hain!`);
  } else if (profileStrength.score >= 60) {
    parts.push(`Profile ${profileStrength.score}% complete hai — aur details dene se better recommendations milenge.`);
  } else {
    parts.push(`Profile sirf ${profileStrength.score}% complete hai — missing info fill karein toh personalized suggestions milenge.`);
  }

  // Top recommendation
  if (topPlans.length > 0) {
    const top = topPlans[0];
    parts.push(`Humari #1 recommendation: ${top.planName} by ${top.insurer} (Score: ${top.score}/100).`);
    parts.push(top.explanation);
  }

  // Coverage suggestions based on gaps
  if (persona.medicalHistory.length > 0 && !topPlans.some(p => p.category === 'critical-illness')) {
    parts.push('💡 Aapki medical history dekh ke Critical Illness plan bhi consider karein — extra protection milegi.');
  }

  if (persona.dependents > 0 && !topPlans.some(p => p.category === 'term')) {
    parts.push('💡 Aapke dependents hain — Term Insurance zaroor lein taaki unka financial future secure rahe.');
  }

  if (persona.age > 55 && !topPlans.some(p => p.category === 'senior')) {
    parts.push('💡 55+ age ke liye Senior Citizen Health Plans check karein — regular plans se better benefits milenge.');
  }

  // IRDAI disclaimer
  parts.push('📌 IRDAI Disclaimer: Insurance is subject matter of solicitation. Recommendations are based on publicly available data. Please verify all details with the insurer before purchasing.');

  return parts.join(' ');
}

// ============================================================================
// UTILITY EXPORTS
// ============================================================================

/**
 * Gets all available plans for a given category.
 * Useful for building plan selection UIs.
 */
export function getAllPlans(category: string): Array<{ id: string; name: string; insurer: string }> {
  switch (category) {
    case 'health':
      return healthPlans.map(p => ({ id: p.id, name: p.name, insurer: p.insurer }));
    case 'term':
      return termPlans.map(p => ({ id: p.id, name: p.name, insurer: p.insurer }));
    case 'motor':
      return motorAddons.map(a => ({ id: a.id, name: a.name, insurer: 'Multiple' }));
    case 'senior':
      return seniorCitizenPlans.map(p => ({ id: p.id, name: p.name, insurer: p.insurer }));
    case 'critical-illness':
      return criticalIllnessPlans.map(p => ({ id: p.id, name: p.name, insurer: p.insurer }));
    default:
      return [];
  }
}

/**
 * Gets a specific plan's detailed data by ID and category.
 */
export function getPlanDetail(planId: string, category: string): HealthPlan | TermPlan | MotorAddon | SeniorCitizenPlan | CriticalIllnessPlan | null {
  switch (category) {
    case 'health':
      return healthPlans.find(p => p.id === planId) ?? null;
    case 'term':
      return termPlans.find(p => p.id === planId) ?? null;
    case 'motor':
      return motorAddons.find(a => a.id === planId) ?? null;
    case 'senior':
      return seniorCitizenPlans.find(p => p.id === planId) ?? null;
    case 'critical-illness':
      return criticalIllnessPlans.find(p => p.id === planId) ?? null;
    default:
      return null;
  }
}

/**
 * Gets all available riders for a given category.
 */
export function getRidersForCategory(category: string): Array<{ id: string; name: string; description: string }> {
  switch (category) {
    case 'health':
    case 'senior':
    case 'critical-illness':
      return healthRiders.map(r => ({ id: r.id, name: r.name, description: r.description }));
    case 'term':
      return termRiders.map(r => ({ id: r.id, name: r.name, description: r.description }));
    case 'motor':
      return motorAddons.map(a => ({ id: a.id, name: a.name, description: a.description }));
    default:
      return [];
  }
}
