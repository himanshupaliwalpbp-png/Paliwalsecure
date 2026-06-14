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
// Updated to match IRDAI standard + common market practice:
//   New:  5% dep  → 95% IDV
//   1yr: 15% dep  → 85% IDV
//   2yr: 20% dep  → 80% IDV
//   3yr: 25% dep  → 75% IDV  (was 30%)
//   4yr: 30% dep  → 70% IDV  (was 40%)
//   5yr: 45% dep  → 55% IDV  (was 50%)
// ---------------------------------------------------------------------------
export const IDV_DEPRECIATION_RATES: Record<number, number> = {
  0: 0.05,     // brand new → 95% IDV
  0.5: 0.05,   // 6 months
  1: 0.15,     // 1 year → 85% IDV
  2: 0.20,     // 2 years → 80% IDV
  3: 0.25,     // 3 years → 75% IDV
  4: 0.30,     // 4 years → 70% IDV
  5: 0.45,     // 5+ years → 55% IDV
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
  EV_CAR: {
    // 15% lower OD than ICE car
    HDFC_ERGO:      { A: 1.32, B: 1.26 },
    ACKO:           { A: 1.28, B: 1.21 },
    GO_DIGIT:       { A: 1.34, B: 1.29 },
    ICICI_LOMBARD:  { A: 1.38, B: 1.33 },
    TATA_AIG:       { A: 1.40, B: 1.35 },
    BAJAJ_ALLIANZ:  { A: 1.43, B: 1.38 },
    NEW_INDIA:      { A: 1.46, B: 1.41 },
    RELIANCE:       { A: 1.36, B: 1.31 },
  },
};

// ---------------------------------------------------------------------------
// Add-On Rate Definitions
//
// Two types of add-on rate:
//   1. Percentage of OD premium (before NCB) — key has `ratePercent`
//   2. Flat fee in ₹ — key has `flatRate`
//
// Per-insurer rates are provided for accuracy.
// The `ADDON_DEFINITIONS` array drives the UI (labels, descriptions, order).
// ---------------------------------------------------------------------------
export interface AddonDefinition {
  id: string;                    // matches MotorAddOn type
  label: string;                 // display name
  description: string;           // short description for UI
  type: 'percent' | 'flat';     // how the premium is calculated
  defaultRatePercent?: number;   // % of OD premium before NCB
  defaultFlatRate?: number;      // flat ₹
  minRate?: number;              // for display: minimum expected cost
  maxRate?: number;              // for display: maximum expected cost
  appliesTo: ('Car' | 'Bike' | 'EV_BIKE' | 'EV_CAR')[];  // which vehicle types
}

export const ADDON_DEFINITIONS: AddonDefinition[] = [
  {
    id: 'zeroDep',
    label: 'Zero Depreciation',
    description: 'Full claim without depreciation deduction on parts',
    type: 'percent',
    defaultRatePercent: 0.20,
    minRate: 1500,
    maxRate: 15000,
    appliesTo: ['Car', 'Bike', 'EV_BIKE', 'EV_CAR'],
  },
  {
    id: 'engineProtect',
    label: 'Engine Protection',
    description: 'Covers engine/gearbox damage due to water ingression, lubricant leakage',
    type: 'flat',
    defaultFlatRate: 900,
    minRate: 500,
    maxRate: 1500,
    appliesTo: ['Car', 'EV_CAR'],
  },
  {
    id: 'roadSideAssistance',
    label: 'Roadside Assistance (RSA)',
    description: '24×7 towing, flat tyre, fuel delivery, jump-start',
    type: 'flat',
    defaultFlatRate: 500,
    minRate: 300,
    maxRate: 800,
    appliesTo: ['Car', 'Bike', 'EV_BIKE', 'EV_CAR'],
  },
  {
    id: 'returnToInvoice',
    label: 'Return to Invoice',
    description: 'Get full invoice value in case of total loss or theft',
    type: 'percent',
    defaultRatePercent: 0.12,
    minRate: 1000,
    maxRate: 12000,
    appliesTo: ['Car', 'EV_CAR'],
  },
  {
    id: 'consumables',
    label: 'Consumables Cover',
    description: 'Covers engine oil, coolant, nuts, bolts, grease, AC gas during claims',
    type: 'flat',
    defaultFlatRate: 600,
    minRate: 400,
    maxRate: 900,
    appliesTo: ['Car', 'Bike', 'EV_BIKE', 'EV_CAR'],
  },
  {
    id: 'personalAccident',
    label: 'Personal Accident (Passenger)',
    description: 'Personal accident cover for unnamed passengers up to ₹2 Lakh each',
    type: 'flat',
    defaultFlatRate: 400,
    minRate: 300,
    maxRate: 500,
    appliesTo: ['Car', 'Bike', 'EV_BIKE', 'EV_CAR'],
  },
  {
    id: 'keyProtect',
    label: 'Key Replacement',
    description: 'Covers cost of lost/stolen keys & lock replacement',
    type: 'flat',
    defaultFlatRate: 300,
    minRate: 200,
    maxRate: 400,
    appliesTo: ['Car', 'EV_CAR'],
  },
  {
    id: 'tyreProtect',
    label: 'Tyre Protection',
    description: 'Covers accidental tyre damage & replacement (not wear & tear)',
    type: 'flat',
    defaultFlatRate: 1200,
    minRate: 800,
    maxRate: 2000,
    appliesTo: ['Car', 'Bike', 'EV_BIKE', 'EV_CAR'],
  },
  {
    id: 'ncbProtect',
    label: 'NCB Protection',
    description: 'Your NCB stays unchanged even after one claim in the policy period',
    type: 'percent',
    defaultRatePercent: 0.065,
    minRate: 500,
    maxRate: 5000,
    appliesTo: ['Car', 'Bike', 'EV_BIKE', 'EV_CAR'],
  },
  // EV-specific add-ons
  {
    id: 'evMotorCover',
    label: 'EV Motor Cover',
    description: 'Covers electric motor damage, battery pack water ingression',
    type: 'flat',
    defaultFlatRate: 1200,
    minRate: 800,
    maxRate: 2000,
    appliesTo: ['EV_BIKE', 'EV_CAR'],
  },
  {
    id: 'electricSurge',
    label: 'Electric Surge Protection',
    description: 'Covers damage to EV electronics from voltage surge/spike while charging',
    type: 'flat',
    defaultFlatRate: 950,
    minRate: 600,
    maxRate: 1500,
    appliesTo: ['EV_BIKE', 'EV_CAR'],
  },
];

// ---------------------------------------------------------------------------
// Per-Insurer Add-On Rates
// For percentage-based addons: value = % of OD premium before NCB (e.g., 0.27 = 27%)
// For flat-rate addons: value = flat ₹ amount
// ---------------------------------------------------------------------------
export const ADDON_RATE_BY_INSURER: Record<string, Record<string, { type: 'percent' | 'flat'; value: number }>> = {
  HDFC_ERGO: {
    zeroDep: { type: 'percent', value: 0.27 },
    returnToInvoice: { type: 'percent', value: 0.12 },
    engineProtect: { type: 'flat', value: 850 },
    consumables: { type: 'flat', value: 550 },
    tyreProtect: { type: 'flat', value: 1200 },
    ncbProtect: { type: 'percent', value: 0.06 },
    keyProtect: { type: 'flat', value: 350 },
    roadSideAssistance: { type: 'flat', value: 450 },
    personalAccident: { type: 'flat', value: 400 },
    evMotorCover: { type: 'flat', value: 1200 },
    electricSurge: { type: 'flat', value: 900 },
  },
  ACKO: {
    zeroDep: { type: 'percent', value: 0.25 },
    returnToInvoice: { type: 'percent', value: 0.11 },
    engineProtect: { type: 'flat', value: 750 },
    consumables: { type: 'flat', value: 500 },
    tyreProtect: { type: 'flat', value: 1100 },
    ncbProtect: { type: 'percent', value: 0.05 },
    keyProtect: { type: 'flat', value: 300 },
    roadSideAssistance: { type: 'flat', value: 0 },    // Free with ACKO comprehensive
    personalAccident: { type: 'flat', value: 350 },
    evMotorCover: { type: 'flat', value: 1100 },
    electricSurge: { type: 'flat', value: 850 },
  },
  GO_DIGIT: {
    zeroDep: { type: 'percent', value: 0.28 },
    returnToInvoice: { type: 'percent', value: 0.13 },
    engineProtect: { type: 'flat', value: 900 },
    consumables: { type: 'flat', value: 600 },
    tyreProtect: { type: 'flat', value: 1300 },
    ncbProtect: { type: 'percent', value: 0.07 },
    keyProtect: { type: 'flat', value: 350 },
    roadSideAssistance: { type: 'flat', value: 500 },
    personalAccident: { type: 'flat', value: 400 },
    evMotorCover: { type: 'flat', value: 1300 },
    electricSurge: { type: 'flat', value: 950 },
  },
  ICICI_LOMBARD: {
    zeroDep: { type: 'percent', value: 0.28 },
    returnToInvoice: { type: 'percent', value: 0.13 },
    engineProtect: { type: 'flat', value: 850 },
    consumables: { type: 'flat', value: 580 },
    tyreProtect: { type: 'flat', value: 1250 },
    ncbProtect: { type: 'percent', value: 0.07 },
    keyProtect: { type: 'flat', value: 350 },
    roadSideAssistance: { type: 'flat', value: 480 },
    personalAccident: { type: 'flat', value: 400 },
    evMotorCover: { type: 'flat', value: 1250 },
    electricSurge: { type: 'flat', value: 900 },
  },
  TATA_AIG: {
    zeroDep: { type: 'percent', value: 0.30 },
    returnToInvoice: { type: 'percent', value: 0.14 },
    engineProtect: { type: 'flat', value: 1000 },
    consumables: { type: 'flat', value: 650 },
    tyreProtect: { type: 'flat', value: 1400 },
    ncbProtect: { type: 'percent', value: 0.08 },
    keyProtect: { type: 'flat', value: 400 },
    roadSideAssistance: { type: 'flat', value: 550 },
    personalAccident: { type: 'flat', value: 450 },
    evMotorCover: { type: 'flat', value: 1400 },
    electricSurge: { type: 'flat', value: 1050 },
  },
  BAJAJ_ALLIANZ: {
    zeroDep: { type: 'percent', value: 0.29 },
    returnToInvoice: { type: 'percent', value: 0.13 },
    engineProtect: { type: 'flat', value: 950 },
    consumables: { type: 'flat', value: 620 },
    tyreProtect: { type: 'flat', value: 1350 },
    ncbProtect: { type: 'percent', value: 0.07 },
    keyProtect: { type: 'flat', value: 380 },
    roadSideAssistance: { type: 'flat', value: 520 },
    personalAccident: { type: 'flat', value: 420 },
    evMotorCover: { type: 'flat', value: 1350 },
    electricSurge: { type: 'flat', value: 980 },
  },
  NEW_INDIA: {
    zeroDep: { type: 'percent', value: 0.28 },
    returnToInvoice: { type: 'percent', value: 0.12 },
    engineProtect: { type: 'flat', value: 800 },
    consumables: { type: 'flat', value: 550 },
    tyreProtect: { type: 'flat', value: 1200 },
    ncbProtect: { type: 'percent', value: 0.06 },
    keyProtect: { type: 'flat', value: 320 },
    roadSideAssistance: { type: 'flat', value: 470 },
    personalAccident: { type: 'flat', value: 380 },
    evMotorCover: { type: 'flat', value: 1150 },
    electricSurge: { type: 'flat', value: 870 },
  },
  RELIANCE: {
    zeroDep: { type: 'percent', value: 0.26 },
    returnToInvoice: { type: 'percent', value: 0.12 },
    engineProtect: { type: 'flat', value: 800 },
    consumables: { type: 'flat', value: 530 },
    tyreProtect: { type: 'flat', value: 1180 },
    ncbProtect: { type: 'percent', value: 0.06 },
    keyProtect: { type: 'flat', value: 300 },
    roadSideAssistance: { type: 'flat', value: 440 },
    personalAccident: { type: 'flat', value: 370 },
    evMotorCover: { type: 'flat', value: 1180 },
    electricSurge: { type: 'flat', value: 880 },
  },
};

// Legacy: keep ADDON_RATE for backward compatibility (used as fallback)
export interface AddonRateDef {
  zeroDep: number;           // % of OD
  returnToInvoice: number;   // % of OD
  engineProtect: number;     // % of OD (legacy, now flat)
  consumables: number;       // % of OD (legacy, now flat)
  tyreProtect: number;       // % of OD (legacy, now flat)
  ncbProtect: number;        // % of OD
  keyProtect: number;        // % of OD (legacy, now flat)
  roadSideAssistance: number; // flat ₹
  evMotorCover: number;       // flat ₹
  electricSurge: number;      // flat ₹
}

export const ADDON_RATE: AddonRateDef = {
  zeroDep: 0.20,
  returnToInvoice: 0.12,
  engineProtect: 0.14,
  consumables: 0.027,
  tyreProtect: 0.13,
  ncbProtect: 0.065,
  keyProtect: 0.04,
  roadSideAssistance: 500,
  evMotorCover: 1200,
  electricSurge: 950,
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
