// =============================================================================
// Travel Insurance Rates — FY 2025-26
// =============================================================================

// ---------------------------------------------------------------------------
// GST on Travel Insurance
// ---------------------------------------------------------------------------
export const TRAVEL_GST = 0.18;

// ---------------------------------------------------------------------------
// Senior Citizen Multiplier (applied on top of adult rates for 61-70 age)
// ---------------------------------------------------------------------------
export const TRAVEL_SENIOR_MULTIPLIER = 2.8;

// ---------------------------------------------------------------------------
// Daily Premium Rates (₹ per day) by Geography & Traveller Type
// ADULT: 18-60 years
// SENIOR: 61-70 years
// CHILD: 0-17 years (typically 50% of adult rate)
// ---------------------------------------------------------------------------
export type TravelRegion =
  | 'DOMESTIC'
  | 'ASIA'
  | 'WORLDWIDE_EXCL_USA'
  | 'WORLDWIDE_INCL_USA';

export type TravellerType = 'ADULT' | 'SENIOR' | 'CHILD';

export type TravelInsurer =
  | 'HDFC_ERGO'
  | 'BAJAJ_ALLIANZ'
  | 'ICICI_LOMBARD'
  | 'TATA_AIG'
  | 'RELIANCE'
  | 'GO_DIGIT'
  | 'STAR_HEALTH';

export interface TravelRegionRate {
  [region: string]: {
    [travellerType: string]: number; // ₹ per day
  };
}

export interface TravelDailyRates {
  [insurer: string]: TravelRegionRate;
}

export const TRAVEL_DAILY_RATES: TravelDailyRates = {
  HDFC_ERGO: {
    DOMESTIC:            { ADULT: 52,  SENIOR: 146,  CHILD: 26 },
    ASIA:                { ADULT: 145, SENIOR: 406, CHILD: 72 },
    WORLDWIDE_EXCL_USA:  { ADULT: 255, SENIOR: 714, CHILD: 128 },
    WORLDWIDE_INCL_USA:  { ADULT: 360, SENIOR: 1008, CHILD: 180 },
  },
  BAJAJ_ALLIANZ: {
    DOMESTIC:            { ADULT: 55,  SENIOR: 154,  CHILD: 28 },
    ASIA:                { ADULT: 152, SENIOR: 426, CHILD: 76 },
    WORLDWIDE_EXCL_USA:  { ADULT: 265, SENIOR: 742, CHILD: 132 },
    WORLDWIDE_INCL_USA:  { ADULT: 375, SENIOR: 1050, CHILD: 188 },
  },
  ICICI_LOMBARD: {
    DOMESTIC:            { ADULT: 48,  SENIOR: 134,  CHILD: 24 },
    ASIA:                { ADULT: 136, SENIOR: 381, CHILD: 68 },
    WORLDWIDE_EXCL_USA:  { ADULT: 242, SENIOR: 678, CHILD: 121 },
    WORLDWIDE_INCL_USA:  { ADULT: 345, SENIOR: 966, CHILD: 172 },
  },
  TATA_AIG: {
    DOMESTIC:            { ADULT: 58,  SENIOR: 162,  CHILD: 29 },
    ASIA:                { ADULT: 160, SENIOR: 448, CHILD: 80 },
    WORLDWIDE_EXCL_USA:  { ADULT: 278, SENIOR: 778, CHILD: 139 },
    WORLDWIDE_INCL_USA:  { ADULT: 392, SENIOR: 1098, CHILD: 196 },
  },
  RELIANCE: {
    DOMESTIC:            { ADULT: 46,  SENIOR: 129,  CHILD: 23 },
    ASIA:                { ADULT: 132, SENIOR: 370, CHILD: 66 },
    WORLDWIDE_EXCL_USA:  { ADULT: 236, SENIOR: 661, CHILD: 118 },
    WORLDWIDE_INCL_USA:  { ADULT: 335, SENIOR: 938, CHILD: 168 },
  },
  GO_DIGIT: {
    DOMESTIC:            { ADULT: 44,  SENIOR: 123,  CHILD: 22 },
    ASIA:                { ADULT: 126, SENIOR: 353, CHILD: 63 },
    WORLDWIDE_EXCL_USA:  { ADULT: 224, SENIOR: 627, CHILD: 112 },
    WORLDWIDE_INCL_USA:  { ADULT: 318, SENIOR: 890, CHILD: 159 },
  },
  STAR_HEALTH: {
    DOMESTIC:            { ADULT: 50,  SENIOR: 140,  CHILD: 25 },
    ASIA:                { ADULT: 140, SENIOR: 392, CHILD: 70 },
    WORLDWIDE_EXCL_USA:  { ADULT: 248, SENIOR: 694, CHILD: 124 },
    WORLDWIDE_INCL_USA:  { ADULT: 352, SENIOR: 986, CHILD: 176 },
  },
};

// ---------------------------------------------------------------------------
// Travel Insurance Add-On Rates
// ---------------------------------------------------------------------------
export interface TravelAddonRate {
  name: string;
  dailyPremium: number; // ₹ per day (flat)
  description: string;
}

export const TRAVEL_ADDON_RATES: TravelAddonRate[] = [
  {
    name: 'Adventure Sports Cover',
    dailyPremium: 35,
    description: 'Covers injuries from adventure activities like skiing, scuba diving, bungee jumping',
  },
  {
    name: 'Golf Cover',
    dailyPremium: 25,
    description: 'Covers golf equipment loss/damage and golfing injuries',
  },
  {
    name: 'Home Burglary Cover',
    dailyPremium: 20,
    description: 'Covers burglary at your home while you are travelling',
  },
  {
    name: 'Hijack Distress Allowance',
    dailyPremium: 15,
    description: 'Daily allowance if your flight is hijacked',
  },
  {
    name: 'Loss of Passport',
    dailyPremium: 18,
    description: 'Covers cost of obtaining a replacement passport abroad',
  },
  {
    name: 'Trip Cancellation & Curtailment',
    dailyPremium: 40,
    description: 'Reimburses non-refundable trip costs if cancelled/curtailed due to covered reasons',
  },
  {
    name: ' Rental Vehicle Damage Waiver',
    dailyPremium: 30,
    description: 'Covers damage to rented vehicle abroad (excess waiver)',
  },
  {
    name: 'Emergency Cash Advance',
    dailyPremium: 22,
    description: 'Emergency cash advance if wallet/traveller cheques lost',
  },
  {
    name: 'Personal Liability',
    dailyPremium: 12,
    description: 'Covers legal liability for accidental injury/damage to third party abroad',
  },
  {
    name: 'Study Interruption Cover',
    dailyPremium: 28,
    description: 'Reimburses tuition fees if studies interrupted due to medical emergency',
  },
];
