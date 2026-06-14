/**
 * IRDAI Verified Insurance Rate Data for PaliwalSecure.in
 *
 * Sources:
 * - Third-Party Motor Rates: MoRTH GSR 354(E) dated 28.03.2024
 * - IDV Depreciation: IRDAI guidelines
 * - NCB Discount Slabs: IRDAI standard slabs
 * - OD Rates: Estimated ranges per insurer (indicative, not IRDAI-mandated)
 * - Add-on Formulas: Industry estimates based on market data
 * - Claim Settlement Ratios: IRDAI Annual Report 2023-24
 * - Health Insurance GST: CGST Act; note GST-exempt from 22 Sept 2025 per Union Budget
 * - Term Life Premium Rates: Indicative market rates per ₹1 crore cover
 */

// ─────────────────────────────────────────────────────────────
// THIRD-PARTY (TP) MOTOR RATES — MoRTH GSR 354(E) 28.03.2024
// ─────────────────────────────────────────────────────────────

/** Private car TP rates by engine capacity (annual, in ₹) */
export const PRIVATE_CAR_TP_RATES: Record<string, number> = {
  upTo1000cc: 2094,
  '1000to1500cc': 3416,
  above1500cc: 7897,
} as const;

/** Two-wheeler TP rates by engine capacity (annual, in ₹) */
export const TWO_WHEELER_TP_RATES: Record<string, number> = {
  upTo75cc: 538,
  '75to150cc': 714,
  '150to350cc': 1196,
  above350cc: 2323,
} as const;

/**
 * Get the TP premium for a private car based on engine CC.
 */
export function getCarTPRate(engineCC: number): number {
  if (engineCC <= 1000) return PRIVATE_CAR_TP_RATES.upTo1000cc;
  if (engineCC <= 1500) return PRIVATE_CAR_TP_RATES['1000to1500cc'];
  return PRIVATE_CAR_TP_RATES.above1500cc;
}

/**
 * Get the TP premium for a two-wheeler based on engine CC.
 */
export function getBikeTPRate(engineCC: number): number {
  if (engineCC <= 75) return TWO_WHEELER_TP_RATES.upTo75cc;
  if (engineCC <= 150) return TWO_WHEELER_TP_RATES['75to150cc'];
  if (engineCC <= 350) return TWO_WHEELER_TP_RATES['150to350cc'];
  return TWO_WHEELER_TP_RATES.above350cc;
}

// ─────────────────────────────────────────────────────────────
// IDV DEPRECIATION SCHEDULE
// ─────────────────────────────────────────────────────────────

export interface IDVDepreciationSlab {
  minAgeMonths: number;
  maxAgeMonths: number;
  depreciationPercent: number;
  label: string;
}

/** IDV depreciation schedule as per IRDAI guidelines */
export const IDV_DEPRECIATION_SCHEDULE: IDVDepreciationSlab[] = [
  { minAgeMonths: 0, maxAgeMonths: 6, depreciationPercent: 5, label: 'Less than 6 months' },
  { minAgeMonths: 6, maxAgeMonths: 12, depreciationPercent: 15, label: '6 months to 1 year' },
  { minAgeMonths: 12, maxAgeMonths: 24, depreciationPercent: 20, label: '1 to 2 years' },
  { minAgeMonths: 24, maxAgeMonths: 36, depreciationPercent: 25, label: '2 to 3 years' },
  { minAgeMonths: 36, maxAgeMonths: 48, depreciationPercent: 35, label: '3 to 4 years' },
  { minAgeMonths: 48, maxAgeMonths: 60, depreciationPercent: 40, label: '4 to 5 years' },
  { minAgeMonths: 60, maxAgeMonths: 999, depreciationPercent: 50, label: 'Above 5 years (Negotiable, typically 50-60%)' },
] as const;

/**
 * Get depreciation percentage based on vehicle age in months.
 * For vehicles older than 5 years, returns 50% (negotiable up to 60%).
 */
export function getDepreciationPercent(vehicleAgeMonths: number): number {
  for (const slab of IDV_DEPRECIATION_SCHEDULE) {
    if (vehicleAgeMonths >= slab.minAgeMonths && vehicleAgeMonths < slab.maxAgeMonths) {
      return slab.depreciationPercent;
    }
  }
  return 50; // Fallback for very old vehicles
}

/**
 * Calculate IDV (Insured Declared Value) from ex-showroom price and age in years.
 * IDV = Ex-Showroom Price × (1 - Depreciation%)
 */
export function calculateIDV(exShowroomPrice: number, vehicleAgeYears: number): number {
  const ageMonths = vehicleAgeYears * 12;
  const depPercent = getDepreciationPercent(ageMonths);
  const idv = exShowroomPrice * (1 - depPercent / 100);
  return Math.round(idv);
}

// ─────────────────────────────────────────────────────────────
// NCB (NO CLAIM BONUS) DISCOUNT SLABS
// ─────────────────────────────────────────────────────────────

export interface NCBSlab {
  claimFreeYears: number;
  discountPercent: number;
}

/** NCB discount slabs as per IRDAI standard */
export const NCB_DISCOUNT_SLABS: NCBSlab[] = [
  { claimFreeYears: 0, discountPercent: 0 },
  { claimFreeYears: 1, discountPercent: 20 },
  { claimFreeYears: 2, discountPercent: 25 },
  { claimFreeYears: 3, discountPercent: 35 },
  { claimFreeYears: 4, discountPercent: 45 },
  { claimFreeYears: 5, discountPercent: 50 }, // 5+ years
] as const;

/**
 * Get NCB discount percentage based on number of claim-free years.
 * Maximum NCB is 50% for 5+ claim-free years.
 */
export function getNCBDiscount(ncbYears: number): number {
  if (ncbYears >= 5) return 50;
  const slab = NCB_DISCOUNT_SLABS.find((s) => s.claimFreeYears === ncbYears);
  return slab ? slab.discountPercent : 0;
}

// ─────────────────────────────────────────────────────────────
// OD (OWN DAMAGE) RATE RANGES PER INSURER
// ─────────────────────────────────────────────────────────────

export interface ODRateRange {
  insurer: string;
  minRate: number; // as percentage, e.g. 3.0 means 3.0%
  maxRate: number;
}

/**
 * OD rate ranges per insurer (estimates with source note).
 * These are indicative ranges; actual rates vary by model, age, zone, etc.
 * Source: Market estimates based on publicly available premium data.
 */
export const OD_RATE_RANGES: ODRateRange[] = [
  { insurer: 'HDFC ERGO', minRate: 3.0, maxRate: 3.5 },
  { insurer: 'ACKO', minRate: 2.5, maxRate: 3.2 },
  { insurer: 'Go Digit', minRate: 2.8, maxRate: 3.3 },
  { insurer: 'ICICI Lombard', minRate: 3.2, maxRate: 3.8 },
  { insurer: 'TATA AIG', minRate: 3.0, maxRate: 3.5 },
  { insurer: 'Bajaj Allianz', minRate: 3.1, maxRate: 3.6 },
] as const;

/** Zone-based OD rate adjustment factors */
export const ZONE_ADJUSTMENT: Record<string, number> = {
  A: 1.10, // Metro cities (higher risk, higher rates)
  B: 0.95, // Non-metro cities (lower risk, lower rates)
} as const;

/**
 * Get the midpoint OD rate for a given insurer.
 */
export function getMidpointODRate(insurer: string): number {
  const range = OD_RATE_RANGES.find((r) => r.insurer === insurer);
  if (!range) return 3.3; // fallback
  return (range.minRate + range.maxRate) / 2;
}

// ─────────────────────────────────────────────────────────────
// ADD-ON COST FORMULAS
// ─────────────────────────────────────────────────────────────

export interface AddonCostFormula {
  name: string;
  key: string;
  description: string;
  calculate: (odPremium: number, vehicleAgeYears: number) => number;
}

/** Add-on cost calculation formulas based on industry estimates */
export const ADDON_FORMULAS: AddonCostFormula[] = [
  {
    name: 'Zero Depreciation',
    key: 'zeroDep',
    description: 'OD premium × 15-20% (new cars), OD × 20-25% (up to 5 years)',
    calculate: (odPremium: number, vehicleAgeYears: number): number => {
      if (vehicleAgeYears <= 1) return Math.round(odPremium * 0.175); // 15-20% midpoint
      if (vehicleAgeYears <= 5) return Math.round(odPremium * 0.225); // 20-25% midpoint
      return 0; // Not available for cars older than 5 years typically
    },
  },
  {
    name: 'Roadside Assistance (RSA)',
    key: 'rsa',
    description: '₹800-1,500/year flat fee',
    calculate: (_odPremium: number, vehicleAgeYears: number): number => {
      // Slightly higher for older vehicles
      if (vehicleAgeYears <= 3) return 1000;
      return 1300;
    },
  },
  {
    name: 'Return to Invoice (RTI)',
    key: 'rti',
    description: 'OD premium × 8-10%',
    calculate: (odPremium: number): number => {
      return Math.round(odPremium * 0.09); // 8-10% midpoint
    },
  },
  {
    name: 'Engine Protect',
    key: 'engineProtect',
    description: '₹1,500-2,500/year flat fee',
    calculate: (_odPremium: number, vehicleAgeYears: number): number => {
      if (vehicleAgeYears <= 3) return 1800;
      return 2200;
    },
  },
  {
    name: 'Consumables',
    key: 'consumables',
    description: '₹1,000-2,000/year flat fee',
    calculate: (_odPremium: number, vehicleAgeYears: number): number => {
      if (vehicleAgeYears <= 3) return 1200;
      return 1700;
    },
  },
  {
    name: 'NCB Protector',
    key: 'ncbProtector',
    description: 'OD premium × 5-8%',
    calculate: (odPremium: number): number => {
      return Math.round(odPremium * 0.065); // 5-8% midpoint
    },
  },
] as const;

/**
 * Calculate the cost of a specific add-on cover.
 */
export function calculateAddonCost(
  addonKey: string,
  odPremium: number,
  vehicleAgeYears: number
): number {
  const formula = ADDON_FORMULAS.find((f) => f.key === addonKey);
  if (!formula) return 0;
  return formula.calculate(odPremium, vehicleAgeYears);
}

// ─────────────────────────────────────────────────────────────
// HEALTH INSURANCE GST INFO
// ─────────────────────────────────────────────────────────────

export interface GSTInfo {
  category: string;
  gstPercent: number;
  note: string;
}

/** GST rates for health insurance */
export const HEALTH_GST_INFO: GSTInfo[] = [
  {
    category: 'Individual Health',
    gstPercent: 18,
    note: 'GST-exempt from 22 Sept 2025 as per Union Budget 2025-26',
  },
  {
    category: 'Group Health',
    gstPercent: 18,
    note: 'GST-exempt from 22 Sept 2025 as per Union Budget 2025-26',
  },
] as const;

/** Motor insurance GST rate */
export const MOTOR_GST_PERCENT = 18;

/** Current date for GST exemption check */
export function isHealthGSTExempt(date: Date = new Date()): boolean {
  const exemptDate = new Date('2025-09-22');
  return date >= exemptDate;
}

// ─────────────────────────────────────────────────────────────
// TERM LIFE PREMIUM RATES (per ₹1 Crore cover, monthly)
// ─────────────────────────────────────────────────────────────

export interface TermLifeRateKey {
  age: number;
  gender: 'male' | 'female';
  smokingStatus: 'smoker' | 'non-smoker';
}

/** Term life premium rates per ₹1 crore cover, monthly premium in ₹ */
export const TERM_LIFE_RATES: Record<string, number> = {
  // Male, Non-Smoker
  '18-male-non-smoker': 407,
  '19-male-non-smoker': 418,
  '20-male-non-smoker': 432,
  '21-male-non-smoker': 447,
  '22-male-non-smoker': 463,
  '23-male-non-smoker': 480,
  '24-male-non-smoker': 499,
  '25-male-non-smoker': 519,
  '26-male-non-smoker': 541,
  '27-male-non-smoker': 565,
  '28-male-non-smoker': 591,
  '29-male-non-smoker': 620,
  '30-male-non-smoker': 651,
  '31-male-non-smoker': 685,
  '32-male-non-smoker': 722,
  '33-male-non-smoker': 762,
  '34-male-non-smoker': 806,
  '35-male-non-smoker': 854,
  '36-male-non-smoker': 907,
  '37-male-non-smoker': 964,
  '38-male-non-smoker': 1027,
  '39-male-non-smoker': 1096,
  '40-male-non-smoker': 1171,
  '41-male-non-smoker': 1254,
  '42-male-non-smoker': 1345,
  '43-male-non-smoker': 1445,
  '44-male-non-smoker': 1555,
  '45-male-non-smoker': 1676,
  '46-male-non-smoker': 1809,
  '47-male-non-smoker': 1955,
  '48-male-non-smoker': 2116,
  '49-male-non-smoker': 2293,
  '50-male-non-smoker': 2488,
  '55-male-non-smoker': 3852,
  '60-male-non-smoker': 6105,

  // Male, Smoker
  '18-male-smoker': 611,
  '19-male-smoker': 627,
  '20-male-smoker': 648,
  '21-male-smoker': 670,
  '22-male-smoker': 695,
  '23-male-smoker': 721,
  '24-male-smoker': 749,
  '25-male-smoker': 779,
  '26-male-smoker': 811,
  '27-male-smoker': 847,
  '28-male-smoker': 886,
  '29-male-smoker': 929,
  '30-male-smoker': 976,
  '31-male-smoker': 1027,
  '32-male-smoker': 1082,
  '33-male-smoker': 1142,
  '34-male-smoker': 1208,
  '35-male-smoker': 1280,
  '36-male-smoker': 1359,
  '37-male-smoker': 1445,
  '38-male-smoker': 1539,
  '39-male-smoker': 1642,
  '40-male-smoker': 1755,
  '41-male-smoker': 1879,
  '42-male-smoker': 2015,
  '43-male-smoker': 2165,
  '44-male-smoker': 2330,
  '45-male-smoker': 2512,
  '46-male-smoker': 2711,
  '47-male-smoker': 2930,
  '48-male-smoker': 3171,
  '49-male-smoker': 3436,
  '50-male-smoker': 3728,
  '55-male-smoker': 5773,
  '60-male-smoker': 9148,

  // Female, Non-Smoker
  '18-female-non-smoker': 346,
  '19-female-non-smoker': 356,
  '20-female-non-smoker': 367,
  '21-female-non-smoker': 379,
  '22-female-non-smoker': 393,
  '23-female-non-smoker': 407,
  '24-female-non-smoker': 423,
  '25-female-non-smoker': 440,
  '26-female-non-smoker': 459,
  '27-female-non-smoker': 479,
  '28-female-non-smoker': 501,
  '29-female-non-smoker': 525,
  '30-female-non-smoker': 551,
  '31-female-non-smoker': 579,
  '32-female-non-smoker': 609,
  '33-female-non-smoker': 642,
  '34-female-non-smoker': 677,
  '35-female-non-smoker': 715,
  '36-female-non-smoker': 756,
  '37-female-non-smoker': 800,
  '38-female-non-smoker': 848,
  '39-female-non-smoker': 900,
  '40-female-non-smoker': 956,
  '41-female-non-smoker': 1017,
  '42-female-non-smoker': 1083,
  '43-female-non-smoker': 1155,
  '44-female-non-smoker': 1233,
  '45-female-non-smoker': 1318,
  '46-female-non-smoker': 1410,
  '47-female-non-smoker': 1510,
  '48-female-non-smoker': 1619,
  '49-female-non-smoker': 1738,
  '50-female-non-smoker': 1868,
  '55-female-non-smoker': 2891,
  '60-female-non-smoker': 4580,

  // Female, Smoker
  '18-female-smoker': 519,
  '19-female-smoker': 534,
  '20-female-smoker': 551,
  '21-female-smoker': 569,
  '22-female-smoker': 589,
  '23-female-smoker': 610,
  '24-female-smoker': 634,
  '25-female-smoker': 659,
  '26-female-smoker': 687,
  '27-female-smoker': 717,
  '28-female-smoker': 750,
  '29-female-smoker': 786,
  '30-female-smoker': 824,
  '31-female-smoker': 866,
  '32-female-smoker': 911,
  '33-female-smoker': 960,
  '34-female-smoker': 1013,
  '35-female-smoker': 1070,
  '36-female-smoker': 1132,
  '37-female-smoker': 1198,
  '38-female-smoker': 1270,
  '39-female-smoker': 1348,
  '40-female-smoker': 1432,
  '41-female-smoker': 1523,
  '42-female-smoker': 1622,
  '43-female-smoker': 1730,
  '44-female-smoker': 1847,
  '45-female-smoker': 1974,
  '46-female-smoker': 2113,
  '47-female-smoker': 2264,
  '48-female-smoker': 2428,
  '49-female-smoker': 2608,
  '50-female-smoker': 2805,
  '55-female-smoker': 4337,
  '60-female-smoker': 6873,
} as const;

/**
 * Get term life monthly premium rate per ₹1 crore cover.
 * If exact age is not found, interpolates between nearest ages.
 */
export function getTermLifeRate(
  age: number,
  gender: 'male' | 'female',
  smokingStatus: 'smoker' | 'non-smoker'
): number {
  const key = `${age}-${gender}-${smokingStatus}`;
  const exactRate = TERM_LIFE_RATES[key];
  if (exactRate !== undefined) return exactRate;

  // Find nearest available ages for interpolation
  const availableAges = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
    31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
    49, 50, 55, 60];

  // Clamp to available range
  if (age <= availableAges[0]) {
    return TERM_LIFE_RATES[`${availableAges[0]}-${gender}-${smokingStatus}`] ?? 500;
  }
  if (age >= availableAges[availableAges.length - 1]) {
    return TERM_LIFE_RATES[`${availableAges[availableAges.length - 1]}-${gender}-${smokingStatus}`] ?? 7000;
  }

  // Find bracketing ages
  let lowerAge = availableAges[0];
  let upperAge = availableAges[availableAges.length - 1];
  for (let i = 0; i < availableAges.length - 1; i++) {
    if (age >= availableAges[i] && age <= availableAges[i + 1]) {
      lowerAge = availableAges[i];
      upperAge = availableAges[i + 1];
      break;
    }
  }

  const lowerKey = `${lowerAge}-${gender}-${smokingStatus}`;
  const upperKey = `${upperAge}-${gender}-${smokingStatus}`;
  const lowerRate = TERM_LIFE_RATES[lowerKey] ?? 500;
  const upperRate = TERM_LIFE_RATES[upperKey] ?? 7000;

  // Linear interpolation
  const fraction = (age - lowerAge) / (upperAge - lowerAge);
  return Math.round(lowerRate + fraction * (upperRate - lowerRate));
}

// ─────────────────────────────────────────────────────────────
// CLAIM SETTLEMENT RATIOS (IRDAI 2023-24)
// ─────────────────────────────────────────────────────────────

export interface ClaimSettlementRatio {
  insurer: string;
  csrPercent: number;
  year: string;
}

/** Claim Settlement Ratios from IRDAI Annual Report 2023-24 */
export const CLAIM_SETTLEMENT_RATIOS: ClaimSettlementRatio[] = [
  { insurer: 'HDFC Life', csrPercent: 99.3, year: '2023-24' },
  { insurer: 'ICICI Pru', csrPercent: 98.6, year: '2023-24' },
  { insurer: 'SBI Life', csrPercent: 98.2, year: '2023-24' },
  { insurer: 'TATA AIA', csrPercent: 99.1, year: '2023-24' },
  { insurer: 'Max Life', csrPercent: 99.3, year: '2023-24' },
  { insurer: 'Bajaj Allianz', csrPercent: 99.0, year: '2023-24' },
] as const;

/**
 * Get the claim settlement ratio for a given life insurer.
 */
export function getCSR(insurer: string): number {
  const entry = CLAIM_SETTLEMENT_RATIOS.find(
    (c) => c.insurer.toLowerCase() === insurer.toLowerCase()
  );
  return entry ? entry.csrPercent : 0;
}

// ─────────────────────────────────────────────────────────────
// HEALTH INSURANCE BASE RATES (Indicative)
// ─────────────────────────────────────────────────────────────

/**
 * Base health insurance rate per ₹1 lakh sum insured by age band.
 * These are indicative rates; actual premiums vary by insurer, plan type, and city tier.
 */
export const HEALTH_BASE_RATE_PER_LAKH: Record<string, number> = {
  '18-25': 150,
  '26-30': 180,
  '31-35': 220,
  '36-40': 300,
  '41-45': 420,
  '46-50': 580,
  '51-55': 800,
  '56-60': 1100,
  '61-65': 1500,
  '66-70': 2000,
  '71+': 2700,
} as const;

/** City tier adjustment for health insurance */
export const CITY_TIER_ADJUSTMENT: Record<number, number> = {
  1: 1.15, // Tier 1 (Metro): higher medical costs
  2: 0.90, // Tier 2 (Non-metro): lower medical costs
} as const;

/** PED (Pre-Existing Disease) loading factor */
export const PED_LOADING_FACTOR = 1.30; // 30% loading for PED

/** Family floater discount */
export const FAMILY_FLOATER_DISCOUNT: Record<number, number> = {
  2: 0.90, // 10% discount for 2 members
  3: 0.85, // 15% discount for 3 members
  4: 0.80, // 20% discount for 4 members
  5: 0.78, // 22% discount for 5 members
  6: 0.75, // 25% discount for 6+ members
} as const;
