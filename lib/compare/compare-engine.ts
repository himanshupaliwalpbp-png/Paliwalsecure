// =============================================================================
// Insurance Comparison Engine — Main Calculation Engines
// All functions use IRDAI-mandated rates from the companion data files
// =============================================================================

import {
  IRDAI_TP_ANNUAL,
  BUNDLED_5YR,
  IDV_DEPRECIATION_RATES,
  OD_RATE_PERCENT,
  ADDON_RATE,
  NCB_DISCOUNT,
  MOTOR_GST,
  PA_COVER,
  PENDING_HIKE_NOTE,
} from './motor-rates';

import {
  HEALTH_GST,
  HEALTH_BASE_PREMIUM,
  FLOATER_LOADING,
  ZONE_1_CITIES,
  ZONE_1_LOADING,
  ZONE_2_LOADING,
  PED_LOADING,
  HEALTH_INSURER_DATA,
} from './health-rates';

import {
  LIFE_GST,
  TERM_ANNUAL_PREMIUM_PER_CR,
  SMOKER_LOADING,
  LIMITED_PAY,
  RETURN_OF_PREMIUM,
  LIFE_INSURER_DATA,
} from './life-rates';

import {
  TRAVEL_GST,
  TRAVEL_DAILY_RATES,
  TRAVEL_ADDON_RATES,
} from './travel-rates';

import {
  HOME_GST,
  HOME_STRUCTURE_RATES,
  HOME_CONTENTS_RATES,
  HOME_ZONE_LOADING,
  HIGH_SEISMIC_STATES,
  FLOOD_PRONE_CITIES,
} from './home-rates';

import { getGSTRate, isGSTExempt, calculateGST } from './gst-rules';

// =============================================================================
// Shared Types
// =============================================================================

export interface QuoteBreakdown {
  basePremium: number;
  addOnPremium: number;
  discount: number;
  gstAmount: number;
  totalPremium: number;
  breakdown: Record<string, number>;
  notes: string[];
}

// =============================================================================
// Indian Number Formatting Helper
// =============================================================================

/**
 * Formats a number in Indian numbering system (e.g., 1,23,456.00)
 */
export function formatINR(amount: number): string {
  const fixed = amount.toFixed(2);
  const [intPart, decPart] = fixed.split('.');

  // Indian grouping: first 3 digits from right, then groups of 2
  const isNegative = intPart.startsWith('-');
  const absInt = isNegative ? intPart.slice(1) : intPart;

  let formatted: string;
  if (absInt.length <= 3) {
    formatted = absInt;
  } else {
    const last3 = absInt.slice(-3);
    const rest = absInt.slice(0, -3);
    const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    formatted = `${grouped},${last3}`;
  }

  const prefix = isNegative ? '-' : '₹';
  return `${prefix}${formatted}.${decPart}`;
}

// =============================================================================
// 1. Motor Quote Calculator
// =============================================================================

export type MotorVehicleType = 'Car' | 'Bike' | 'EV_BIKE' | 'EV_CAR';
export type MotorCCBand =
  | 'upTo1000cc' | '1001to1500cc' | 'above1500cc'
  | 'upTo75cc' | '76to150cc' | '151to350cc' | 'above350cc'
  | 'upto4kW' | '4to25kW' | 'above25kW'
  | 'upto30kW' | '30to65kW' | 'above65kW';

export type MotorAddOn =
  | 'zeroDep'
  | 'returnToInvoice'
  | 'engineProtect'
  | 'consumables'
  | 'tyreProtect'
  | 'ncbProtect'
  | 'keyProtect'
  | 'roadSideAssistance'
  | 'evMotorCover'
  | 'electricSurge';

export interface MotorVehicleDetails {
  vehicleType: MotorVehicleType;
  ccBand: MotorCCBand;
  exShowroomPrice: number;  // ₹
  ageYears: number;         // vehicle age in completed years
  zone: 'A' | 'B';
  isNew: boolean;           // brand-new vehicle?
  ncbYears: number;         // 0-5
  isCNG: boolean;           // CNG/LPG kit fitted?
  cngKitValue?: number;     // Value of CNG kit (₹)
}

export function calculateMotorQuote(
  vehicleDetails: MotorVehicleDetails,
  insurer: string,
  selectedAddOns: MotorAddOn[] = []
): QuoteBreakdown {
  const notes: string[] = [];
  const breakdown: Record<string, number> = {};

  // --- 1. IDV Calculation ---
  const depreciationKey = vehicleDetails.isNew
    ? 0
    : (IDV_DEPRECIATION_RATES[vehicleDetails.ageYears] !== undefined
        ? vehicleDetails.ageYears
        : 5); // default to max depreciation

  const depreciationRate = IDV_DEPRECIATION_RATES[depreciationKey] ?? 0.50;
  let idv = Math.round(vehicleDetails.exShowroomPrice * (1 - depreciationRate));

  // Add CNG kit value to IDV if applicable
  if (vehicleDetails.isCNG && vehicleDetails.cngKitValue) {
    idv += vehicleDetails.cngKitValue;
  }

  breakdown['IDV'] = idv;
  notes.push(`IDV: ${formatINR(idv)} (${(depreciationRate * 100).toFixed(0)}% depreciation)`);

  // --- 2. Third-Party Premium ---
  const tpRates = vehicleDetails.isNew
    ? BUNDLED_5YR[vehicleDetails.vehicleType]
    : IRDAI_TP_ANNUAL[vehicleDetails.vehicleType];

  const tpPremium = (tpRates as Record<string, number>)[vehicleDetails.ccBand] ?? 0;
  breakdown['TP_Premium'] = tpPremium;
  notes.push(vehicleDetails.isNew
    ? `5-Year Bundled TP: ${formatINR(tpPremium)}`
    : `Annual TP: ${formatINR(tpPremium)}`);

  // --- 3. Own-Damage Premium ---
  const odRateTable = OD_RATE_PERCENT[vehicleDetails.vehicleType];
  const odRate = odRateTable?.[insurer]?.[vehicleDetails.zone] ?? 3.50;
  let odPremium = Math.round((idv * odRate) / 100);

  breakdown['OD_Rate_%'] = odRate;
  breakdown['OD_Premium_Before_NCB'] = odPremium;

  // --- 4. NCB Discount ---
  const ncbSlab = Math.min(vehicleDetails.ncbYears, 5);
  const ncbDiscountRate = NCB_DISCOUNT[ncbSlab] ?? 0;
  const ncbDiscount = Math.round(odPremium * ncbDiscountRate);
  odPremium = odPremium - ncbDiscount;

  breakdown['NCB_Discount'] = -ncbDiscount;
  if (ncbDiscount > 0) {
    notes.push(`NCB Discount: ${formatINR(ncbDiscount)} (${(ncbDiscountRate * 100).toFixed(0)}%)`);
  }

  breakdown['OD_Premium_After_NCB'] = odPremium;

  // --- 5. Add-On Premiums ---
  let addOnTotal = 0;
  const percentageAddOns: MotorAddOn[] = [
    'zeroDep', 'returnToInvoice', 'engineProtect', 'consumables',
    'tyreProtect', 'ncbProtect', 'keyProtect',
  ];
  const flatAddOns: MotorAddOn[] = ['roadSideAssistance', 'evMotorCover', 'electricSurge'];

  for (const addon of selectedAddOns) {
    const rate = ADDON_RATE[addon as keyof typeof ADDON_RATE];
    if (rate === undefined) continue;

    let addonPremium: number;
    if (percentageAddOns.includes(addon)) {
      // Percentage of OD (before NCB discount for add-on calculation)
      addonPremium = Math.round((breakdown['OD_Premium_Before_NCB'] as number) * (rate as number));
    } else if (flatAddOns.includes(addon)) {
      addonPremium = rate as number;
    } else {
      addonPremium = 0;
    }

    breakdown[`Addon_${addon}`] = addonPremium;
    addOnTotal += addonPremium;
    notes.push(`Add-on ${addon}: ${formatINR(addonPremium)}`);
  }

  breakdown['AddOn_Total'] = addOnTotal;

  // --- 6. PA Cover ---
  breakdown['PA_Cover'] = PA_COVER;

  // --- 7. Base Premium (before GST) ---
  const basePremium = odPremium + tpPremium + addOnTotal + PA_COVER;
  breakdown['Base_Premium'] = basePremium;

  // --- 8. GST ---
  const gstAmount = calculateGST(basePremium, 'motor');
  breakdown['GST'] = gstAmount;

  // --- 9. Total ---
  const totalPremium = basePremium + gstAmount;

  notes.push(PENDING_HIKE_NOTE);

  return {
    basePremium,
    addOnPremium: addOnTotal,
    discount: ncbDiscount,
    gstAmount,
    totalPremium,
    breakdown,
    notes,
  };
}

// =============================================================================
// 2. Health Quote Calculator
// =============================================================================

export type HealthPED = keyof typeof PED_LOADING;

export interface HealthDetails {
  age: number;
  sumInsured: number;      // e.g., 500000 or 1000000
  city: string;
  isFloater: boolean;      // family floater?
  memberCount: number;     // number of members in floater
  ped: HealthPED;          // pre-existing disease
  isGroup: boolean;        // corporate/group policy?
}

function getAgeBand(age: number): string {
  if (age >= 18 && age <= 25) return '18-25';
  if (age >= 26 && age <= 30) return '26-30';
  if (age >= 31 && age <= 35) return '31-35';
  if (age >= 36 && age <= 40) return '36-40';
  if (age >= 41 && age <= 45) return '41-45';
  if (age >= 46 && age <= 50) return '46-50';
  if (age >= 51 && age <= 55) return '51-55';
  if (age >= 56 && age <= 60) return '56-60';
  if (age >= 61 && age <= 65) return '61-65';
  return '61-65'; // default to highest band for ages > 65
}

function getSIKey(sumInsured: number): 'SI_5L' | 'SI_10L' {
  return sumInsured <= 500000 ? 'SI_5L' : 'SI_10L';
}

function isZone1City(city: string): boolean {
  const zone1List = ZONE_1_CITIES as readonly string[];
  return zone1List.some((c) => c.toLowerCase() === city.toLowerCase());
}

export function calculateHealthQuote(
  healthDetails: HealthDetails,
  insurer: string
): QuoteBreakdown {
  const notes: string[] = [];
  const breakdown: Record<string, number> = {};

  // --- 1. Base Premium by Age & SI ---
  const ageBand = getAgeBand(healthDetails.age);
  const siKey = getSIKey(healthDetails.sumInsured);

  const insurerRates = HEALTH_BASE_PREMIUM[insurer];
  if (!insurerRates) {
    return {
      basePremium: 0, addOnPremium: 0, discount: 0,
      gstAmount: 0, totalPremium: 0, breakdown: {},
      notes: [`Insurer ${insurer} not found in health rates`],
    };
  }

  const basePremiumRaw = insurerRates[siKey]?.[ageBand] ?? 0;
  breakdown['Base_Premium_Raw'] = basePremiumRaw;
  notes.push(`Base premium (${ageBand}, ${healthDetails.sumInsured >= 1000000 ? '₹10L' : '₹5L'} SI): ${formatINR(basePremiumRaw)}`);

  // --- 2. Zone Loading ---
  const zoneLoading = isZone1City(healthDetails.city) ? ZONE_1_LOADING : ZONE_2_LOADING;
  const afterZone = Math.round(basePremiumRaw * zoneLoading);
  breakdown['Zone_Loading'] = Math.round(afterZone - basePremiumRaw);
  if (zoneLoading > 1) {
    notes.push(`Zone 1 loading (${(zoneLoading * 100 - 100).toFixed(0)}%): ${formatINR(afterZone)}`);
  }

  // --- 3. Floater Loading ---
  let afterFloater = afterZone;
  if (healthDetails.isFloater) {
    afterFloater = Math.round(afterZone * FLOATER_LOADING);
    breakdown['Floater_Loading'] = Math.round(afterFloater - afterZone);
    notes.push(`Floater loading (×${FLOATER_LOADING}): ${formatINR(afterFloater)}`);
  }

  // --- 4. PED Loading ---
  const pedRate = PED_LOADING[healthDetails.ped] ?? 0;
  let afterPED = afterFloater;
  if (pedRate > 0) {
    afterPED = Math.round(afterFloater * (1 + pedRate));
    breakdown['PED_Loading'] = Math.round(afterPED - afterFloater);
    notes.push(`PED loading (${healthDetails.ped}: +${(pedRate * 100).toFixed(0)}%): ${formatINR(afterPED)}`);
  }

  // --- 5. Member count adjustment (floater) ---
  let afterMembers = afterPED;
  if (healthDetails.isFloater && healthDetails.memberCount > 1) {
    // For floater, the eldest member's age is used for base rate,
    // additional members add ~60% of base each
    const additionalMembers = healthDetails.memberCount - 1;
    const additionalPremium = Math.round(basePremiumRaw * 0.60 * additionalMembers);
    afterMembers = afterPED + additionalPremium;
    breakdown['Additional_Members'] = additionalPremium;
    notes.push(`${additionalMembers} additional member(s): +${formatINR(additionalPremium)}`);
  }

  const basePremium = afterMembers;
  breakdown['Base_Premium_Final'] = basePremium;

  // --- 6. GST (0% for health from 22 Sept 2025) ---
  const gstAmount = calculateGST(basePremium, 'health', healthDetails.isGroup);
  breakdown['GST'] = gstAmount;
  if (gstAmount === 0) {
    notes.push('GST exempt on health insurance w.e.f. 22 Sept 2025');
  }

  // --- 7. Total ---
  const totalPremium = basePremium + gstAmount;

  return {
    basePremium,
    addOnPremium: 0,
    discount: 0,
    gstAmount,
    totalPremium,
    breakdown,
    notes,
  };
}

// =============================================================================
// 3. Life / Term Quote Calculator
// =============================================================================

export type LifePayTerm = 'regular' | 'pay5' | 'pay7' | 'pay10' | 'pay12' | 'single';

export interface LifeDetails {
  age: number;
  sumAssured: number;    // in ₹ (e.g., 10000000 for ₹1 Cr)
  gender: 'MALE' | 'FEMALE';
  isSmoker: boolean;
  payTerm: LifePayTerm;
  isROP: boolean;        // Return of Premium option?
  isGroup: boolean;
}

function getNearestAge(age: number): 25 | 30 | 35 | 40 | 45 | 50 {
  const ages: number[] = [25, 30, 35, 40, 45, 50];
  let nearest = ages[0];
  for (const a of ages) {
    if (Math.abs(age - a) < Math.abs(age - nearest)) {
      nearest = a;
    }
  }
  return nearest as 25 | 30 | 35 | 40 | 45 | 50;
}

export function calculateLifeQuote(
  lifeDetails: LifeDetails,
  insurer: string
): QuoteBreakdown {
  const notes: string[] = [];
  const breakdown: Record<string, number> = {};

  // --- 1. Base Premium per ₹1 Crore ---
  const genderKey = lifeDetails.gender === 'MALE' ? 'MALE_NON_SMOKER' : 'FEMALE_NON_SMOKER';
  const nearestAge = getNearestAge(lifeDetails.age);

  const genderRates = TERM_ANNUAL_PREMIUM_PER_CR[genderKey];
  if (!genderRates) {
    return {
      basePremium: 0, addOnPremium: 0, discount: 0,
      gstAmount: 0, totalPremium: 0, breakdown: {},
      notes: [`Gender ${lifeDetails.gender} not found in life rates`],
    };
  }

  const ratePerCr = genderRates[insurer]?.[nearestAge] ?? 0;
  if (ratePerCr === 0) {
    return {
      basePremium: 0, addOnPremium: 0, discount: 0,
      gstAmount: 0, totalPremium: 0, breakdown: {},
      notes: [`Insurer ${insurer} not found in life rates`],
    };
  }

  // Proportion for actual sum assured
  const proportion = lifeDetails.sumAssured / 10000000;
  let basePremium = Math.round(ratePerCr * proportion);

  breakdown['Rate_Per_Cr'] = ratePerCr;
  breakdown['Base_Premium'] = basePremium;
  notes.push(`Base premium (age ${nearestAge}, ${lifeDetails.gender}, non-smoker): ${formatINR(ratePerCr)}/Cr`);

  // --- 2. Smoker Loading ---
  if (lifeDetails.isSmoker) {
    const beforeSmoker = basePremium;
    basePremium = Math.round(basePremium * SMOKER_LOADING);
    breakdown['Smoker_Loading'] = Math.round(basePremium - beforeSmoker);
    notes.push(`Smoker loading (×${SMOKER_LOADING}): ${formatINR(basePremium)}`);
  }

  // --- 3. Limited Pay Factor ---
  const payFactor = LIMITED_PAY[lifeDetails.payTerm] ?? 1;
  if (payFactor !== 1) {
    const beforePay = basePremium;
    basePremium = Math.round(basePremium * payFactor);
    breakdown['Limited_Pay_Factor'] = Math.round(basePremium - beforePay);
    notes.push(`Limited pay (${lifeDetails.payTerm}, ×${payFactor}): ${formatINR(basePremium)}`);
  }

  // --- 4. Return of Premium ---
  if (lifeDetails.isROP) {
    const beforeROP = basePremium;
    basePremium = Math.round(basePremium * RETURN_OF_PREMIUM);
    breakdown['ROP_Loading'] = Math.round(basePremium - beforeROP);
    notes.push(`Return of Premium (×${RETURN_OF_PREMIUM}): ${formatINR(basePremium)}`);
  }

  breakdown['Base_Premium_Final'] = basePremium;

  // --- 5. GST (0% for life from 22 Sept 2025) ---
  const gstAmount = calculateGST(basePremium, 'life', lifeDetails.isGroup);
  breakdown['GST'] = gstAmount;
  if (gstAmount === 0) {
    notes.push('GST exempt on life insurance w.e.f. 22 Sept 2025');
  }

  // --- 6. Total ---
  const totalPremium = basePremium + gstAmount;

  return {
    basePremium,
    addOnPremium: 0,
    discount: 0,
    gstAmount,
    totalPremium,
    breakdown,
    notes,
  };
}

// =============================================================================
// 4. Travel Quote Calculator
// =============================================================================

export type TravelRegion = 'DOMESTIC' | 'ASIA' | 'WORLDWIDE_EXCL_USA' | 'WORLDWIDE_INCL_USA';
export type TravellerType = 'ADULT' | 'SENIOR' | 'CHILD';

export interface TravelDetails {
  region: TravelRegion;
  tripDurationDays: number;
  travellers: Array<{
    type: TravellerType;
    count: number;
  }>;
  selectedAddons: string[];  // addon names
}

export function calculateTravelQuote(
  travelDetails: TravelDetails,
  insurer: string
): QuoteBreakdown {
  const notes: string[] = [];
  const breakdown: Record<string, number> = {};

  const insurerRates = TRAVEL_DAILY_RATES[insurer];
  if (!insurerRates) {
    return {
      basePremium: 0, addOnPremium: 0, discount: 0,
      gstAmount: 0, totalPremium: 0, breakdown: {},
      notes: [`Insurer ${insurer} not found in travel rates`],
    };
  }

  const regionRates = insurerRates[travelDetails.region];
  if (!regionRates) {
    return {
      basePremium: 0, addOnPremium: 0, discount: 0,
      gstAmount: 0, totalPremium: 0, breakdown: {},
      notes: [`Region ${travelDetails.region} not found for ${insurer}`],
    };
  }

  // --- 1. Base Premium = Σ(daily rate × count × days) ---
  let basePremium = 0;
  for (const traveller of travelDetails.travellers) {
    const dailyRate = (regionRates as Record<string, number>)[traveller.type] ?? 0;
    const travellerPremium = dailyRate * traveller.count * travelDetails.tripDurationDays;
    breakdown[`Traveller_${traveller.type}×${traveller.count}`] = travellerPremium;
    basePremium += travellerPremium;
    notes.push(`${traveller.type} × ${traveller.count}: ${formatINR(travellerPremium)}`);
  }

  // Long-trip discount: >30 days → 5%, >60 days → 10%
  if (travelDetails.tripDurationDays > 60) {
    const discount = Math.round(basePremium * 0.10);
    basePremium -= discount;
    breakdown['Long_Trip_Discount'] = -discount;
    notes.push(`Long-trip discount (10%): -${formatINR(discount)}`);
  } else if (travelDetails.tripDurationDays > 30) {
    const discount = Math.round(basePremium * 0.05);
    basePremium -= discount;
    breakdown['Long_Trip_Discount'] = -discount;
    notes.push(`Long-trip discount (5%): -${formatINR(discount)}`);
  }

  breakdown['Base_Premium'] = basePremium;

  // --- 2. Add-Ons ---
  let addOnTotal = 0;
  for (const addonName of travelDetails.selectedAddons) {
    const addon = TRAVEL_ADDON_RATES.find((a) => a.name === addonName);
    if (!addon) continue;
    const addonPremium = addon.dailyPremium * travelDetails.tripDurationDays;
    breakdown[`Addon_${addonName}`] = addonPremium;
    addOnTotal += addonPremium;
    notes.push(`Add-on ${addonName}: ${formatINR(addonPremium)}`);
  }

  breakdown['AddOn_Total'] = addOnTotal;

  // --- 3. GST ---
  const premiumBeforeGST = basePremium + addOnTotal;
  const gstAmount = calculateGST(premiumBeforeGST, 'travel');
  breakdown['GST'] = gstAmount;

  // --- 4. Total ---
  const totalPremium = premiumBeforeGST + gstAmount;

  return {
    basePremium,
    addOnPremium: addOnTotal,
    discount: 0,
    gstAmount,
    totalPremium,
    breakdown,
    notes,
  };
}

// =============================================================================
// 5. Home Quote Calculator
// =============================================================================

export type HomeCoverType = 'STANDARD' | 'WITH_EARTHQUAKE';
export type HomeContentsCoverType = 'STANDARD' | 'WITH_BURGLARY';

export interface HomeDetails {
  structureSI: number;          // Sum insured for structure (₹)
  contentsSI: number;           // Sum insured for contents (₹)
  structureCover: HomeCoverType;
  contentsCover: HomeContentsCoverType;
  state: string;                // Indian state
  city: string;                 // City name
  isRented: boolean;            // Rented property?
}

function isHighSeismic(state: string): boolean {
  const seismicStates = HIGH_SEISMIC_STATES as readonly string[];
  return seismicStates.some((s) => s.toLowerCase() === state.toLowerCase());
}

function isFloodProne(city: string): boolean {
  const floodCities = FLOOD_PRONE_CITIES as readonly string[];
  return floodCities.some((c) => c.toLowerCase() === city.toLowerCase());
}

export function calculateHomeQuote(
  homeDetails: HomeDetails,
  insurer: string
): QuoteBreakdown {
  const notes: string[] = [];
  const breakdown: Record<string, number> = {};

  // --- 1. Structure Premium ---
  const structureRates = HOME_STRUCTURE_RATES[insurer];
  let structureRatePerK = structureRates?.[homeDetails.structureCover] ?? 0.85;
  let structurePremium = Math.round((homeDetails.structureSI / 1000) * structureRatePerK);

  breakdown['Structure_Rate'] = structureRatePerK;
  breakdown['Structure_Premium'] = structurePremium;
  notes.push(`Structure premium (₹${structureRatePerK}/1000 SI): ${formatINR(structurePremium)}`);

  // --- 2. Contents Premium ---
  let contentsPremium = 0;
  if (homeDetails.contentsSI > 0) {
    const contentsRates = HOME_CONTENTS_RATES[insurer];
    const contentsRatePerK = contentsRates?.[homeDetails.contentsCover] ?? 1.25;
    contentsPremium = Math.round((homeDetails.contentsSI / 1000) * contentsRatePerK);
    breakdown['Contents_Rate'] = contentsRatePerK;
    breakdown['Contents_Premium'] = contentsPremium;
    notes.push(`Contents premium (₹${contentsRatePerK}/1000 SI): ${formatINR(contentsPremium)}`);
  }

  // --- 3. Zone Loading ---
  let totalBeforeLoading = structurePremium + contentsPremium;
  let zoneMultiplier = 1.0;

  if (isHighSeismic(homeDetails.state)) {
    zoneMultiplier *= HOME_ZONE_LOADING.seismic;
    notes.push(`Seismic zone loading (×${HOME_ZONE_LOADING.seismic})`);
  }

  if (isFloodProne(homeDetails.city)) {
    zoneMultiplier *= HOME_ZONE_LOADING.flood;
    notes.push(`Flood-prone city loading (×${HOME_ZONE_LOADING.flood})`);
  }

  if (zoneMultiplier > 1) {
    const afterLoading = Math.round(totalBeforeLoading * zoneMultiplier);
    breakdown['Zone_Loading'] = Math.round(afterLoading - totalBeforeLoading);
    totalBeforeLoading = afterLoading;
  }

  const basePremium = totalBeforeLoading;
  breakdown['Base_Premium'] = basePremium;

  // --- 4. GST ---
  const gstAmount = calculateGST(basePremium, 'home');
  breakdown['GST'] = gstAmount;

  // --- 5. Total ---
  const totalPremium = basePremium + gstAmount;

  return {
    basePremium,
    addOnPremium: 0,
    discount: 0,
    gstAmount,
    totalPremium,
    breakdown,
    notes,
  };
}

// =============================================================================
// Re-export GST helpers for convenience
// =============================================================================
export { getGSTRate, isGSTExempt, calculateGST };
