// =============================================================================
// IRDAI Motor Insurance Rates — FY 2025-26
// Source: IRDAI Third-Party Premium Order & Tariff Advisory Committee
// =============================================================================

// ---------------------------------------------------------------------------
// Third-Party (TP) Annual Premium — effective 1 June 2024
// ---------------------------------------------------------------------------
export const IRDAI_TP_ANNUAL = {
  Car: {
    upTo1000cc: 2094,
    '1001to1500cc': 3416,
    above1500cc: 7897,
  },
  Bike: {
    upTo75cc: 538,
    '76to150cc': 714,
    '151to350cc': 1366,
    above350cc: 2804,
  },
  EV_BIKE: {
    upto4kW: 457,
    '4to25kW': 607,
    above25kW: 1161,
  },
  EV_CAR: {
    upto30kW: 1780,
    '30to65kW': 2904,
    above65kW: 6712,
  },
} as const;

// ---------------------------------------------------------------------------
// Bundled 5-Year TP (long-term policies for new vehicles)
// ---------------------------------------------------------------------------
export const BUNDLED_5YR = {
  Car: {
    upTo1000cc: 9450,
    '1001to1500cc': 15420,
    above1500cc: 35640,
  },
  Bike: {
    upTo75cc: 2430,
    '76to150cc': 3225,
    '151to350cc': 6165,
    above350cc: 12660,
  },
  EV_BIKE: {
    upto4kW: 2065,
    '4to25kW': 2740,
    above25kW: 5240,
  },
  EV_CAR: {
    upto30kW: 8035,
    '30to65kW': 13110,
    above65kW: 30290,
  },
} as const;

// ---------------------------------------------------------------------------
// IDV Depreciation Rates (age of vehicle → % depreciation)
// ---------------------------------------------------------------------------
export const IDV_DEPRECIATION_RATES: Record<number, number> = {
  0: 0,      // brand new
  0.5: 0.05, // 6 months
  1: 0.15,
  2: 0.20,
  3: 0.30,
  4: 0.40,
  5: 0.50,
};

// ---------------------------------------------------------------------------
// Own-Damage (OD) Rate % — per insurer, per vehicle type, per zone
// Zone A: Metro cities (Delhi, Mumbai, Chennai, Kolkata, Bangalore, Hyderabad, Ahmedabad, Pune)
// Zone B: Rest of India
// ---------------------------------------------------------------------------
export type MotorInsurer =
  | 'HDFC_ERGO'
  | 'ACKO'
  | 'GO_DIGIT'
  | 'ICICI_LOMBARD'
  | 'TATA_AIG'
  | 'BAJAJ_ALLIANZ'
  | 'NEW_INDIA'
  | 'RELIANCE';

export type MotorZone = 'A' | 'B';

export interface ODZoneRate {
  A: number;
  B: number;
}

export interface ODInsurerRate {
  [insurer: string]: ODZoneRate;
}

export const OD_RATE_PERCENT: Record<string, ODInsurerRate> = {
  // Source: Insurer tariff filings + aggregator data 2025-26
  // Zone A: Metro (Delhi, Mumbai, Chennai, Kolkata, Bangalore, Hyderabad, Ahmedabad, Pune)
  // Zone B: Rest of India
  CAR: {
    HDFC_ERGO:      { A: 1.55, B: 1.48 },  // Most competitive
    ACKO:           { A: 1.50, B: 1.43 },  // Cheapest (digital)
    GO_DIGIT:       { A: 1.58, B: 1.52 },
    ICICI_LOMBARD:  { A: 1.62, B: 1.56 },
    TATA_AIG:       { A: 1.65, B: 1.59 },
    BAJAJ_ALLIANZ:  { A: 1.68, B: 1.62 },
    NEW_INDIA:      { A: 1.72, B: 1.66 },  // PSU — base rate
    RELIANCE:       { A: 1.60, B: 1.54 },
  },
  BIKE: {
    HDFC_ERGO:      { A: 0.94, B: 0.90 },
    ACKO:           { A: 0.90, B: 0.86 },
    GO_DIGIT:       { A: 0.96, B: 0.92 },
    ICICI_LOMBARD:  { A: 0.98, B: 0.94 },
    TATA_AIG:       { A: 1.00, B: 0.96 },
    BAJAJ_ALLIANZ:  { A: 1.02, B: 0.98 },
    NEW_INDIA:      { A: 1.04, B: 1.00 },
    RELIANCE:       { A: 0.97, B: 0.93 },
  },
  EV_BIKE: {
    // 15% lower OD than ICE bike
    HDFC_ERGO:      { A: 0.80, B: 0.77 },
    ACKO:           { A: 0.77, B: 0.73 },
    GO_DIGIT:       { A: 0.82, B: 0.78 },
    ICICI_LOMBARD:  { A: 0.83, B: 0.80 },
    TATA_AIG:       { A: 0.85, B: 0.82 },
    BAJAJ_ALLIANZ:  { A: 0.87, B: 0.83 },
    RELIANCE:       { A: 0.82, B: 0.79 },
  },
};

// ---------------------------------------------------------------------------
// Add-On Rates
// zeroDep, returnToInvoice, engineProtect, consumables, tyreProtect,
// ncbProtect, keyProtect are expressed as % of OD premium.
// roadSideAssistance, evMotorCover, electricSurge are flat fees (₹).
// ---------------------------------------------------------------------------
export interface AddonRateDef {
  zeroDep: number;           // % of OD
  returnToInvoice: number;   // % of OD
  engineProtect: number;     // % of OD
  consumables: number;       // % of OD
  tyreProtect: number;       // % of OD
  ncbProtect: number;        // % of OD
  keyProtect: number;        // % of OD
  roadSideAssistance: number; // flat ₹
  evMotorCover: number;       // flat ₹
  electricSurge: number;      // flat ₹
}

// Average add-on rates (used as fallback when per-insurer rates not available)
export const ADDON_RATE: AddonRateDef = {
  zeroDep: 0.27,
  returnToInvoice: 0.13,
  engineProtect: 0.14,
  consumables: 0.027,
  tyreProtect: 0.13,
  ncbProtect: 0.065,
  keyProtect: 0.04,
  roadSideAssistance: 850,
  evMotorCover: 1200,
  electricSurge: 950,
};

// Per-insurer add-on rates (% of OD for percentage-based, flat ₹ for fee-based)
export const ADDON_RATE_BY_INSURER: Record<string, Record<string, number>> = {
  HDFC_ERGO:      { zeroDep: 0.27, returnToInvoice: 0.12, engineProtect: 0.13, consumables: 0.025, tyreProtect: 0.12, ncbProtect: 0.06, keyProtect: 0.04, roadSideAssistance: 79, evMotorCover: 290, electricSurge: 220 },
  ACKO:           { zeroDep: 0.25, returnToInvoice: 0.11, engineProtect: 0.12, consumables: 0.022, tyreProtect: 0.11, ncbProtect: 0.05, keyProtect: 0.03, roadSideAssistance: 0, evMotorCover: 280, electricSurge: 210 },
  GO_DIGIT:       { zeroDep: 0.28, returnToInvoice: 0.13, engineProtect: 0.14, consumables: 0.028, tyreProtect: 0.13, ncbProtect: 0.07, keyProtect: 0.04, roadSideAssistance: 89, evMotorCover: 310, electricSurge: 235 },
  ICICI_LOMBARD:  { zeroDep: 0.28, returnToInvoice: 0.13, engineProtect: 0.13, consumables: 0.026, tyreProtect: 0.13, ncbProtect: 0.07, keyProtect: 0.04, roadSideAssistance: 85, evMotorCover: 320, electricSurge: 240 },
  TATA_AIG:       { zeroDep: 0.30, returnToInvoice: 0.14, engineProtect: 0.15, consumables: 0.030, tyreProtect: 0.15, ncbProtect: 0.08, keyProtect: 0.05, roadSideAssistance: 99, evMotorCover: 374, electricSurge: 280 },
  BAJAJ_ALLIANZ:  { zeroDep: 0.29, returnToInvoice: 0.13, engineProtect: 0.14, consumables: 0.028, tyreProtect: 0.14, ncbProtect: 0.07, keyProtect: 0.04, roadSideAssistance: 95, evMotorCover: 350, electricSurge: 260 },
  NEW_INDIA:      { zeroDep: 0.28, returnToInvoice: 0.12, engineProtect: 0.13, consumables: 0.025, tyreProtect: 0.12, ncbProtect: 0.06, keyProtect: 0.04, roadSideAssistance: 90, evMotorCover: 300, electricSurge: 225 },
  RELIANCE:       { zeroDep: 0.26, returnToInvoice: 0.12, engineProtect: 0.13, consumables: 0.025, tyreProtect: 0.12, ncbProtect: 0.06, keyProtect: 0.03, roadSideAssistance: 80, evMotorCover: 300, electricSurge: 225 },
};

// ---------------------------------------------------------------------------
// No-Claim Bonus (NCB) Discount Slab
// ---------------------------------------------------------------------------
export const NCB_DISCOUNT: Record<number, number> = {
  0: 0,
  1: 0.20,
  2: 0.25,
  3: 0.35,
  4: 0.45,
  5: 0.50,
};

// ---------------------------------------------------------------------------
// GST on Motor Insurance
// ---------------------------------------------------------------------------
export const MOTOR_GST = 0.18;

// ---------------------------------------------------------------------------
// Compulsory Personal Accident Cover (owner-driver)
// ---------------------------------------------------------------------------
export const PA_COVER = 375;

// ---------------------------------------------------------------------------
// Pending hike note — IRDAI has proposed a revision for FY 2026-27
// ---------------------------------------------------------------------------
export const PENDING_HIKE_NOTE =
  'IRDAI has proposed 18-25% TP hike for FY 2025-26 (MoRTH notification pending). ' +
  'Current rates as per GSR 354(E) dated 28.03.2024. Buyers advised to confirm ' +
  'latest applicable TP rates before purchase.';
