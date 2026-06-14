// =============================================================================
// Life / Term Insurance Rates — FY 2025-26
// GST: 0% from 22 Sept 2025 per GST Council 56th Meeting
// =============================================================================

// ---------------------------------------------------------------------------
// GST on Life Insurance — ZERO effective 22 Sept 2025
// ---------------------------------------------------------------------------
export const LIFE_GST = 0;

// ---------------------------------------------------------------------------
// Term Insurance Annual Premium per ₹1 Crore Sum Assured
// Rates are for NON-SMOKER category by age and gender
// ---------------------------------------------------------------------------
export type LifeInsurer =
  | 'HDFC_LIFE'
  | 'ICICI_PRU'
  | 'SBI_LIFE'
  | 'MAX_LIFE'
  | 'TATA_AIA'
  | 'LIC'
  | 'BAJAJ_LIFE'
  | 'KOTAK';

export type LifeAge = 25 | 30 | 35 | 40 | 45 | 50;

export interface TermPremiumByAge {
  [age: number]: number; // ₹ per crore SA
}

export interface TermPremiumByInsurer {
  [insurer: string]: TermPremiumByAge;
}

// Male Non-Smoker rates
export const TERM_ANNUAL_PREMIUM_PER_CR: Record<string, TermPremiumByAge> = {
  MALE_NON_SMOKER: {
    HDFC_LIFE:     { 25: 4980,  30: 5990,  35: 7540,  40: 10440, 45: 15360, 50: 24410 },
    ICICI_PRU:     { 25: 5160,  30: 6160,  35: 7740,  40: 10680, 45: 15710, 50: 24980 },
    SBI_LIFE:      { 25: 5400,  30: 6460,  35: 8120,  40: 11170, 45: 16390, 50: 26080 },
    MAX_LIFE:      { 25: 4830,  30: 5790,  35: 7300,  40: 10110, 45: 14900, 50: 23700 },
    TATA_AIA:      { 25: 4900,  30: 5880,  35: 7400,  40: 10230, 45: 15070, 50: 23940 },
    LIC:           { 25: 5780,  30: 6910,  35: 8690,  40: 11950, 45: 17540, 50: 27880 },
    BAJAJ_LIFE:    { 25: 5190,  30: 6220,  35: 7820,  40: 10800, 45: 15890, 50: 25270 },
    KOTAK:         { 25: 5040,  30: 6050,  35: 7600,  40: 10510, 45: 15480, 50: 24610 },
  },
  FEMALE_NON_SMOKER: {
    HDFC_LIFE:     { 25: 4140,  30: 4970,  35: 6270,  40: 8660,  45: 12750, 50: 20280 },
    ICICI_PRU:     { 25: 4290,  30: 5120,  35: 6440,  40: 8860,  45: 13040, 50: 20740 },
    SBI_LIFE:      { 25: 4490,  30: 5360,  35: 6750,  40: 9270,  45: 13610, 50: 21650 },
    MAX_LIFE:      { 25: 4010,  30: 4810,  35: 6070,  40: 8390,  45: 12380, 50: 19680 },
    TATA_AIA:      { 25: 4070,  30: 4880,  35: 6150,  40: 8490,  45: 12520, 50: 19880 },
    LIC:           { 25: 4800,  30: 5740,  35: 7220,  40: 9920,  45: 14570, 50: 23160 },
    BAJAJ_LIFE:    { 25: 4310,  30: 5160,  35: 6500,  40: 8960,  45: 13180, 50: 20990 },
    KOTAK:         { 25: 4190,  30: 5020,  35: 6320,  40: 8720,  45: 12860, 50: 20440 },
  },
};

// ---------------------------------------------------------------------------
// Smoker Loading — multiply non-smoker rate by this factor
// ---------------------------------------------------------------------------
export const SMOKER_LOADING = 1.70; // 70% extra for smokers (IRDAI FY24-25)

// ---------------------------------------------------------------------------
// Limited Pay Factors (shorter premium-paying term → higher annual outgo)
// ---------------------------------------------------------------------------
export interface LimitedPayFactors {
  regular: number;   // pay till policy term
  pay5: number;      // pay for 5 years only
  pay7: number;      // pay for 7 years only
  pay10: number;     // pay for 10 years only
  pay12: number;     // pay for 12 years only
  single: number;    // single premium
}

export const LIMITED_PAY: LimitedPayFactors = {
  regular: 1.00,
  pay5: 4.80,
  pay7: 3.60,
  pay10: 2.65,
  pay12: 2.30,
  single: 12.50,
};

// ---------------------------------------------------------------------------
// Return of Premium (ROP) Option — multiplier on base premium
// ---------------------------------------------------------------------------
export const RETURN_OF_PREMIUM = 1.75;

// ---------------------------------------------------------------------------
// Detailed Life Insurer Data
// ---------------------------------------------------------------------------
export interface LifeInsurerDataItem {
  planName: string;
  csr: number;            // Claim Settlement Ratio %
  solvencyRatio: number;  // As per IRDAI mandate (minimum 1.50)
  uniqueFeature: string;
  appRating: number;
  directLink: string;
}

export const LIFE_INSURER_DATA: Record<string, LifeInsurerDataItem> = {
  HDFC_LIFE: {
    planName: 'Click 2 Protect Super',
    csr: 99.37,
    solvencyRatio: 2.01,
    uniqueFeature: 'Option to increase cover at life events (marriage, child)',
    appRating: 4.4,
    directLink: 'https://www.hdfclife.com/term-insurance-plans',
  },
  ICICI_PRU: {
    planName: 'iProtect Smart',
    csr: 98.85,
    solvencyRatio: 2.10,
    uniqueFeature: 'Terminal illness + accidental death benefit built-in',
    appRating: 4.3,
    directLink: 'https://www.iciciprulife.com/term-insurance',
  },
  SBI_LIFE: {
    planName: 'Smart Shield',
    csr: 98.21,
    solvencyRatio: 2.25,
    uniqueFeature: 'Largest public sector insurer — unmatched trust',
    appRating: 4.1,
    directLink: 'https://www.sbilife.co.in/term-insurance',
  },
  MAX_LIFE: {
    planName: 'Smart Secure Plus',
    csr: 99.51,
    solvencyRatio: 1.92,
    uniqueFeature: 'Highest CSR in industry — 99.51% claim settlement',
    appRating: 4.5,
    directLink: 'https://www.maxlifeinsurance.com/term-insurance-plans',
  },
  TATA_AIA: {
    planName: 'Sampoorna Raksha Supreme',
    csr: 99.13,
    solvencyRatio: 2.38,
    uniqueFeature: 'Solvency 2.38 — strongest financial position in sector',
    appRating: 4.4,
    directLink: 'https://www.tataaia.com/term-insurance.html',
  },
  LIC: {
    planName: 'Tech Term',
    csr: 98.52,
    solvencyRatio: 1.90,
    uniqueFeature: 'Sovereign backing — Government of India owned',
    appRating: 3.8,
    directLink: 'https://www.licindia.in/Products/Insurance-Plan/Tech-Term-Plan-854',
  },
  BAJAJ_LIFE: {
    planName: 'Smart Protect Goal',
    csr: 99.04,
    solvencyRatio: 3.42,
    uniqueFeature: 'Highest solvency ratio in private sector — 3.42',
    appRating: 4.2,
    directLink: 'https://www.bajajfinserv.in/term-insurance',
  },
  KOTAK: {
    planName: 'Term Life Plan',
    csr: 98.79,
    solvencyRatio: 2.22,
    uniqueFeature: 'Waiver of premium on critical illness diagnosis',
    appRating: 4.3,
    directLink: 'https://www.kotaklife.com/online-plans/term-insurance',
  },
};
