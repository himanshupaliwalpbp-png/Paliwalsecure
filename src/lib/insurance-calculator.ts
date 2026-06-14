/**
 * Insurance Calculator Library for PaliwalSecure.in
 *
 * Provides premium calculation functions for:
 * - Motor Insurance (Car & Bike) across 6 insurers
 * - Health Insurance estimation
 * - Term Life Insurance premium calculation
 *
 * All calculations use IRDAI verified data from irdai-rates.ts
 */

import {
  getCarTPRate,
  getBikeTPRate,
  calculateIDV,
  getNCBDiscount,
  getMidpointODRate,
  calculateAddonCost,
  getTermLifeRate,
  OD_RATE_RANGES,
  ZONE_ADJUSTMENT,
  HEALTH_BASE_RATE_PER_LAKH,
  CITY_TIER_ADJUSTMENT,
  PED_LOADING_FACTOR,
  FAMILY_FLOATER_DISCOUNT,
  MOTOR_GST_PERCENT,
} from './irdai-rates';

// ─────────────────────────────────────────────────────────────
// MOTOR INSURANCE TYPES & CALCULATOR
// ─────────────────────────────────────────────────────────────

export interface MotorAddons {
  zeroDep: boolean;
  rsa: boolean;
  rti: boolean;
  engineProtect: boolean;
  consumables: boolean;
  ncbProtector: boolean;
}

export interface MotorCalcInput {
  vehicleType: 'car' | 'bike';
  engineCC: number;
  exShowroomPrice: number;
  vehicleAge: number; // in years
  ncbYears: number; // years of no-claim bonus
  zone: 'A' | 'B'; // A = Metro, B = Non-metro
  addons: MotorAddons;
}

export interface MotorCalcResult {
  insurer: string;
  idv: number;
  tpPremium: number;
  odPremium: number;
  ncbDiscount: number;
  addonCosts: Record<string, number>;
  totalPremium: number;
  isCheapest: boolean;
}

/** List of motor insurers for comparison */
const MOTOR_INSURERS = OD_RATE_RANGES.map((r) => r.insurer);

/**
 * Calculate motor insurance premium for all 6 insurers.
 *
 * Returns results sorted by totalPremium ascending.
 * The cheapest insurer is marked with isCheapest = true.
 *
 * Formula:
 *   IDV = Ex-Showroom Price × (1 - Depreciation%)
 *   Base OD = IDV × OD Rate%
 *   Zone-adjusted OD = Base OD × Zone Factor
 *   NCB Discount = Zone-adjusted OD × NCB%
 *   Net OD = Zone-adjusted OD - NCB Discount
 *   TP Premium = IRDAI fixed rate by CC
 *   Add-ons calculated individually
 *   Total = Net OD + TP + Sum of Add-ons + GST on (Net OD + Add-ons)
 */
export function calculateMotorPremium(input: MotorCalcInput): MotorCalcResult[] {
  const {
    vehicleType,
    engineCC,
    exShowroomPrice,
    vehicleAge,
    ncbYears,
    zone,
    addons,
  } = input;

  // Step 1: Calculate IDV
  const idv = calculateIDV(exShowroomPrice, vehicleAge);

  // Step 2: Get TP premium based on vehicle type and CC
  const tpPremium = vehicleType === 'car'
    ? getCarTPRate(engineCC)
    : getBikeTPRate(engineCC);

  // Step 3: Get NCB discount percentage
  const ncbPercent = getNCBDiscount(ncbYears);

  // Step 4: Zone adjustment factor
  const zoneFactor = ZONE_ADJUSTMENT[zone] ?? 1.0;

  // Step 5: Calculate for each insurer
  const results: MotorCalcResult[] = MOTOR_INSURERS.map((insurer) => {
    // Get OD rate for this insurer (use midpoint of range)
    const odRatePercent = getMidpointODRate(insurer);

    // Base OD premium = IDV × OD Rate%
    const baseOD = idv * (odRatePercent / 100);

    // Zone-adjusted OD
    const zoneAdjustedOD = baseOD * zoneFactor;

    // NCB discount on OD
    const ncbDiscount = Math.round(zoneAdjustedOD * (ncbPercent / 100));

    // Net OD premium (after NCB)
    const netOD = Math.round(zoneAdjustedOD - ncbDiscount);

    // Calculate add-on costs
    const addonCosts: Record<string, number> = {};

    if (addons.zeroDep) {
      const cost = calculateAddonCost('zeroDep', zoneAdjustedOD, vehicleAge);
      if (cost > 0) addonCosts['Zero Depreciation'] = cost;
    }

    if (addons.rsa) {
      addonCosts['RSA'] = calculateAddonCost('rsa', zoneAdjustedOD, vehicleAge);
    }

    if (addons.rti) {
      addonCosts['RTI'] = calculateAddonCost('rti', zoneAdjustedOD, vehicleAge);
    }

    if (addons.engineProtect && vehicleType === 'car') {
      addonCosts['Engine Protect'] = calculateAddonCost('engineProtect', zoneAdjustedOD, vehicleAge);
    }

    if (addons.consumables) {
      addonCosts['Consumables'] = calculateAddonCost('consumables', zoneAdjustedOD, vehicleAge);
    }

    if (addons.ncbProtector && ncbYears > 0) {
      addonCosts['NCB Protector'] = calculateAddonCost('ncbProtector', zoneAdjustedOD, vehicleAge);
    }

    // Sum of add-on costs
    const totalAddonCost = Object.values(addonCosts).reduce((sum, cost) => sum + cost, 0);

    // GST on OD + Add-ons (TP already includes GST per IRDAI structure)
    const gstOnODAndAddons = Math.round((netOD + totalAddonCost) * (MOTOR_GST_PERCENT / 100));

    // Total premium = Net OD + Add-ons + GST + TP (TP is separate, no additional GST)
    const totalPremium = netOD + totalAddonCost + gstOnODAndAddons + tpPremium;

    return {
      insurer,
      idv,
      tpPremium,
      odPremium: netOD,
      ncbDiscount,
      addonCosts,
      totalPremium,
      isCheapest: false, // will be set after sorting
    };
  });

  // Step 6: Sort by total premium ascending
  results.sort((a, b) => a.totalPremium - b.totalPremium);

  // Step 7: Mark the cheapest
  if (results.length > 0) {
    results[0].isCheapest = true;
  }

  return results;
}

// ─────────────────────────────────────────────────────────────
// HEALTH INSURANCE TYPES & CALCULATOR
// ─────────────────────────────────────────────────────────────

export interface HealthCalcInput {
  age: number;
  sumInsured: number; // in ₹
  cityTier: 1 | 2;
  familyMembers: number;
  preExistingDisease: boolean;
}

/**
 * Estimate health insurance annual premium.
 *
 * Formula:
 *   Base Rate = Rate per ₹1 lakh × (Sum Insured / 1,00,000)
 *   Age-adjusted rate from lookup table
 *   City tier multiplier applied
 *   PED loading of 30% if applicable
 *   Family floater discount based on number of members
 *   GST added on top (18%, or 0% if post Sept 2025)
 *
 * Returns approximate annual premium in ₹.
 */
export function estimateHealthPremium(input: HealthCalcInput): number {
  const { age, sumInsured, cityTier, familyMembers, preExistingDisease } = input;

  // Step 1: Determine age band and get base rate per lakh
  const ageBand = getAgeBand(age);
  const ratePerLakh = HEALTH_BASE_RATE_PER_LAKH[ageBand] ?? 500;

  // Step 2: Base premium = rate per lakh × number of lakhs
  const sumInsuredInLakhs = sumInsured / 100000;
  let basePremium = ratePerLakh * sumInsuredInLakhs;

  // Step 3: Sum insured discount (larger sum insured gets slight discount)
  basePremium = applySumInsuredDiscount(basePremium, sumInsured);

  // Step 4: City tier adjustment
  const tierMultiplier = CITY_TIER_ADJUSTMENT[cityTier] ?? 1.0;
  basePremium = basePremium * tierMultiplier;

  // Step 5: Family floater discount
  if (familyMembers > 1) {
    const discountFactor = FAMILY_FLOATER_DISCOUNT[Math.min(familyMembers, 6)] ?? 0.75;
    basePremium = basePremium * discountFactor * familyMembers;
  }

  // Step 6: PED loading
  if (preExistingDisease) {
    basePremium = basePremium * PED_LOADING_FACTOR;
  }

  // Step 7: Round to nearest integer
  const annualPremium = Math.round(basePremium);

  return annualPremium;
}

/**
 * Get age band string for health insurance rate lookup.
 */
function getAgeBand(age: number): string {
  if (age <= 25) return '18-25';
  if (age <= 30) return '26-30';
  if (age <= 35) return '31-35';
  if (age <= 40) return '36-40';
  if (age <= 45) return '41-45';
  if (age <= 50) return '46-50';
  if (age <= 55) return '51-55';
  if (age <= 60) return '56-60';
  if (age <= 65) return '61-65';
  if (age <= 70) return '66-70';
  return '71+';
}

/**
 * Apply sum insured discount — larger covers get progressively cheaper per unit.
 */
function applySumInsuredDiscount(premium: number, sumInsured: number): number {
  if (sumInsured >= 2500000) return premium * 0.82; // 18% discount for ₹25L+
  if (sumInsured >= 1500000) return premium * 0.87; // 13% discount for ₹15L+
  if (sumInsured >= 1000000) return premium * 0.90; // 10% discount for ₹10L+
  if (sumInsured >= 500000) return premium * 0.95; // 5% discount for ₹5L+
  return premium; // No discount for less than ₹5L
}

// ─────────────────────────────────────────────────────────────
// TERM LIFE INSURANCE TYPES & CALCULATOR
// ─────────────────────────────────────────────────────────────

export interface TermCalcInput {
  age: number;
  sumAssured: number; // in ₹
  gender: 'male' | 'female';
  smokingStatus: 'smoker' | 'non-smoker';
  term: number; // policy term in years
}

/**
 * Calculate approximate monthly term life insurance premium.
 *
 * Formula:
 *   Base rate = Rate per ₹1 crore cover (from lookup table by age, gender, smoking)
 *   Proportional rate = Base rate × (Sum Assured / 1,00,00,000)
 *   Term adjustment = slight discount for longer terms
 *   GST: Life insurance is GST-exempt per current rules
 *
 * Returns approximate monthly premium in ₹.
 */
export function calculateTermPremium(input: TermCalcInput): number {
  const { age, sumAssured, gender, smokingStatus, term } = input;

  // Step 1: Get base monthly rate for ₹1 crore cover
  const baseRatePerCrore = getTermLifeRate(age, gender, smokingStatus);

  // Step 2: Proportional calculation for desired sum assured
  const sumAssuredInCrores = sumAssured / 10000000;
  let monthlyPremium = baseRatePerCrore * sumAssuredInCrores;

  // Step 3: Term length adjustment (longer terms get slight discount)
  const termDiscount = getTermDiscount(term);
  monthlyPremium = monthlyPremium * termDiscount;

  // Step 4: Round to nearest integer
  return Math.round(monthlyPremium);
}

/**
 * Get discount factor based on policy term length.
 * Longer terms get slight discount as insurer locks in premium for longer.
 */
function getTermDiscount(term: number): number {
  if (term >= 40) return 0.88;
  if (term >= 35) return 0.90;
  if (term >= 30) return 0.92;
  if (term >= 25) return 0.94;
  if (term >= 20) return 0.96;
  if (term >= 15) return 0.98;
  return 1.0; // No discount for terms under 15 years
}

// ─────────────────────────────────────────────────────────────
// UTILITY HELPERS
// ─────────────────────────────────────────────────────────────

/**
 * Format a number as Indian currency string (e.g., ₹1,23,456).
 */
export function formatIndianCurrency(amount: number): string {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
}

/**
 * Calculate the total add-on cost from a MotorCalcResult.
 */
export function getTotalAddonCost(result: MotorCalcResult): number {
  return Object.values(result.addonCosts).reduce((sum, cost) => sum + cost, 0);
}

/**
 * Get the savings amount between the most expensive and cheapest insurer.
 */
export function calculateMotorSavings(results: MotorCalcResult[]): number {
  if (results.length < 2) return 0;
  const mostExpensive = results[results.length - 1].totalPremium;
  const cheapest = results[0].totalPremium;
  return mostExpensive - cheapest;
}

/**
 * Get a summary of motor premium comparison for display.
 */
export interface MotorPremiumSummary {
  cheapestInsurer: string;
  cheapestPremium: number;
  mostExpensiveInsurer: string;
  mostExpensivePremium: number;
  savings: number;
  averagePremium: number;
  idv: number;
}

export function getMotorPremiumSummary(results: MotorCalcResult[]): MotorPremiumSummary | null {
  if (results.length === 0) return null;

  const sorted = [...results].sort((a, b) => a.totalPremium - b.totalPremium);
  const cheapest = sorted[0];
  const mostExpensive = sorted[sorted.length - 1];
  const averagePremium = Math.round(
    sorted.reduce((sum, r) => sum + r.totalPremium, 0) / sorted.length
  );

  return {
    cheapestInsurer: cheapest.insurer,
    cheapestPremium: cheapest.totalPremium,
    mostExpensiveInsurer: mostExpensive.insurer,
    mostExpensivePremium: mostExpensive.totalPremium,
    savings: mostExpensive.totalPremium - cheapest.totalPremium,
    averagePremium,
    idv: cheapest.idv,
  };
}
