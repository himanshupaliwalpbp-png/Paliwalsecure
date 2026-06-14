// =============================================================================
// Health Insurance Rates — IRDAI / Market Rates FY 2025-26
// GST: 0% from 22 Sept 2025 per GST Council 56th Meeting
// =============================================================================

// ---------------------------------------------------------------------------
// GST on Health Insurance — ZERO effective 22 Sept 2025
// ---------------------------------------------------------------------------
export const HEALTH_GST = 0;

// ---------------------------------------------------------------------------
// Base Annual Premium (₹) by Sum Insured and Age Band
// Rates are per person, individual policy, Zone 2 baseline
// ---------------------------------------------------------------------------
export type HealthInsurer =
  | 'HDFC_ERGO'
  | 'ACKO'
  | 'STAR'
  | 'NIVA_BUPA'
  | 'CARE'
  | 'ADITYA_BIRLA'
  | 'ICICI_LOMBARD';

export type AgeBand =
  | '18-25'
  | '26-30'
  | '31-35'
  | '36-40'
  | '41-45'
  | '46-50'
  | '51-55'
  | '56-60'
  | '61-65';

export type SumInsuredKey = 'SI_5L' | 'SI_10L';

export interface HealthAgeRates {
  [ageBand: string]: number;
}

export interface HealthSIRates {
  SI_5L: HealthAgeRates;
  SI_10L: HealthAgeRates;
}

export interface HealthBasePremium {
  [insurer: string]: HealthSIRates;
}

export const HEALTH_BASE_PREMIUM: HealthBasePremium = {
  HDFC_ERGO: {
    SI_5L: {
      '18-25': 6100, '26-30': 7400, '31-35': 8600, '36-40': 10500,
      '41-45': 13200, '46-50': 17100, '51-55': 22400, '56-60': 29700, '61-65': 38900,
    },
    SI_10L: {
      '18-25': 9200, '26-30': 11200, '31-35': 13000, '36-40': 15900,
      '41-45': 19900, '46-50': 25800, '51-55': 33900, '56-60': 44800, '61-65': 58700,
    },
  },
  ACKO: {
    SI_5L: {
      '18-25': 5400, '26-30': 6500, '31-35': 7700, '36-40': 9400,
      '41-45': 11800, '46-50': 15300, '51-55': 20100, '56-60': 26600, '61-65': 34800,
    },
    SI_10L: {
      '18-25': 8200, '26-30': 10000, '31-35': 11600, '36-40': 14200,
      '41-45': 17800, '46-50': 23100, '51-55': 30400, '56-60': 40200, '61-65': 52600,
    },
  },
  STAR: {
    SI_5L: {
      '18-25': 6600, '26-30': 8000, '31-35': 9300, '36-40': 11400,
      '41-45': 14300, '46-50': 18500, '51-55': 24300, '56-60': 32200, '61-65': 42200,
    },
    SI_10L: {
      '18-25': 9900, '26-30': 12100, '31-35': 14100, '36-40': 17200,
      '41-45': 21600, '46-50': 28000, '51-55': 36700, '56-60': 48600, '61-65': 63700,
    },
  },
  NIVA_BUPA: {
    SI_5L: {
      '18-25': 6300, '26-30': 7700, '31-35': 8900, '36-40': 10900,
      '41-45': 13700, '46-50': 17700, '51-55': 23200, '56-60': 30700, '61-65': 40200,
    },
    SI_10L: {
      '18-25': 9500, '26-30': 11600, '31-35': 13400, '36-40': 16500,
      '41-45': 20700, '46-50': 26700, '51-55': 35100, '56-60': 46400, '61-65': 60800,
    },
  },
  CARE: {
    SI_5L: {
      '18-25': 5900, '26-30': 7200, '31-35': 8400, '36-40': 10200,
      '41-45': 12800, '46-50': 16600, '51-55': 21700, '56-60': 28800, '61-65': 37700,
    },
    SI_10L: {
      '18-25': 8900, '26-30': 10900, '31-35': 12600, '36-40': 15400,
      '41-45': 19300, '46-50': 25100, '51-55': 32900, '56-60': 43500, '61-65': 57000,
    },
  },
  ADITYA_BIRLA: {
    SI_5L: {
      '18-25': 6200, '26-30': 7500, '31-35': 8700, '36-40': 10600,
      '41-45': 13300, '46-50': 17200, '51-55': 22500, '56-60': 29900, '61-65': 39100,
    },
    SI_10L: {
      '18-25': 9300, '26-30': 11300, '31-35': 13100, '36-40': 16000,
      '41-45': 20000, '46-50': 26000, '51-55': 34100, '56-60': 45100, '61-65': 59100,
    },
  },
  ICICI_LOMBARD: {
    SI_5L: {
      '18-25': 6400, '26-30': 7800, '31-35': 9000, '36-40': 11000,
      '41-45': 13800, '46-50': 17900, '51-55': 23400, '56-60': 31000, '61-65': 40600,
    },
    SI_10L: {
      '18-25': 9700, '26-30': 11800, '31-35': 13600, '36-40': 16700,
      '41-45': 20800, '46-50': 27000, '51-55': 35500, '56-60': 46900, '61-65': 61500,
    },
  },
};

// ---------------------------------------------------------------------------
// Floater Loading (multiplier for family floater vs individual)
// ---------------------------------------------------------------------------
export const FLOATER_LOADING = 1.10;

// ---------------------------------------------------------------------------
// Zone-based City Loading
// Zone 1 = Metro / Tier-1 → higher medical costs
// Zone 2 = Rest of India → baseline
// ---------------------------------------------------------------------------
export const ZONE_1_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad',
  'Kolkata', 'Pune', 'Ahmedabad', 'Navi Mumbai', 'Thane',
  'Gurgaon', 'Noida', 'Faridabad', 'Ghaziabad',
] as const;

export const ZONE_1_LOADING = 1.12;
export const ZONE_2_LOADING = 1.00;

// ---------------------------------------------------------------------------
// Pre-Existing Disease (PED) Loading
// Applied as % addition to base premium
// ---------------------------------------------------------------------------
export interface PEDLoading {
  diabetes: number;
  hypertension: number;
  heartDisease: number;
  cancer: number;
  thyroid: number;
  asthma: number;
  none: number;
}

export const PED_LOADING: PEDLoading = {
  diabetes: 0.20,
  hypertension: 0.15,
  heartDisease: 0.50,
  cancer: 0.90,
  thyroid: 0.10,
  asthma: 0.10,
  none: 0,
};

export const PED_DECLINE_LIKELY = ['cancer', 'heartDisease'];

export const PED_RECOMMENDATIONS: Record<string, string[]> = {
  diabetes: ['CARE', 'NIVA_BUPA', 'HDFC_ERGO'],
  hypertension: ['HDFC_ERGO', 'STAR', 'ACKO'],
  heartDisease: ['HDFC_ERGO', 'NIVA_BUPA'],
  cancer: ['NIVA_BUPA', 'CARE'],
};

// ---------------------------------------------------------------------------
// Health Insurance Add-Ons (per insurer)
// ---------------------------------------------------------------------------
export interface HealthAddon {
  name: string;
  premiumPercent: number; // % of base premium
  description: string;
}

export interface HealthInsurerAddons {
  [insurer: string]: HealthAddon[];
}

export const HEALTH_ADDONS: HealthInsurerAddons = {
  HDFC_ERGO: [
    { name: 'Super Top-Up', premiumPercent: 0.15, description: 'Additional cover above SI' },
    { name: 'Maternity Cover', premiumPercent: 0.20, description: 'Maternity & newborn expenses' },
    { name: 'Global Coverage', premiumPercent: 0.25, description: 'Worldwide hospitalization' },
    { name: 'Personal Accident', premiumPercent: 0.10, description: 'Accidental injury cover' },
  ],
  ACKO: [
    { name: 'ACKO Super Top-Up', premiumPercent: 0.12, description: 'Unlimited restoration' },
    { name: 'Maternity & Newborn', premiumPercent: 0.18, description: 'Delivery & newborn cover' },
    { name: 'OPD Cover', premiumPercent: 0.14, description: 'Out-patient expenses' },
  ],
  STAR: [
    { name: 'Star Super Surplus', premiumPercent: 0.16, description: 'Super top-up cover' },
    { name: 'Maternity Plus', premiumPercent: 0.22, description: 'Maternity & delivery' },
    { name: 'Star Wellness', premiumPercent: 0.08, description: 'Wellness & preventive' },
  ],
  NIVA_BUPA: [
    { name: 'ReAssure', premiumPercent: 0.17, description: 'Unlimited restoration' },
    { name: 'Maternity Care', premiumPercent: 0.21, description: 'Comprehensive maternity' },
    { name: 'International Second Opinion', premiumPercent: 0.06, description: 'Global expert opinion' },
  ],
  CARE: [
    { name: 'Care Super Saver', premiumPercent: 0.13, description: 'Super top-up add-on' },
    { name: 'Maternity Benefit', premiumPercent: 0.19, description: 'Delivery & newborn' },
    { name: 'OPD Care', premiumPercent: 0.15, description: 'Out-patient cover' },
  ],
  ADITYA_BIRLA: [
    { name: 'Super Restore', premiumPercent: 0.16, description: 'Unlimited SI restoration' },
    { name: 'Maternity & Baby', premiumPercent: 0.20, description: 'Maternity cover' },
    { name: 'Active Wellness', premiumPercent: 0.09, description: 'Wellness benefits' },
  ],
  ICICI_LOMBARD: [
    { name: 'iShield Super Top-Up', premiumPercent: 0.14, description: 'Extra cover beyond SI' },
    { name: 'Maternity Plus', premiumPercent: 0.20, description: 'Delivery & newborn' },
    { name: 'Wellness Reward', premiumPercent: 0.07, description: 'Health & wellness' },
  ],
};

// ---------------------------------------------------------------------------
// Detailed Insurer Plan Data
// ---------------------------------------------------------------------------
export interface HealthInsurerDataItem {
  planName: string;
  networkHospitals: number;
  csr: number;            // Claim Settlement Ratio %
  roomRentLimit: string;
  coPayment: string;
  restoration: string;
  waitingPeriod: string;
  ncb: string;
  preAuthTime: string;
  cashlessEverywhere: boolean;
  uniqueFeature: string;
  appRating: number;
  directLink: string;
}

export const HEALTH_INSURER_DATA: Record<string, HealthInsurerDataItem> = {
  HDFC_ERGO: {
    planName: 'HDFC ERGO Optima Restore',
    networkHospitals: 13000,
    csr: 98.85,
    roomRentLimit: 'No limit',
    coPayment: '10% for 61+',
    restoration: '100% once',
    waitingPeriod: '30 days / 2 yr PED / 4 yr specific',
    ncb: '10% per year up to 100%',
    preAuthTime: '2 hours',
    cashlessEverywhere: true,
    uniqueFeature: 'Infinite Illness Cover — unlimited reinstatement',
    appRating: 4.3,
    directLink: 'https://www.hdfcergo.com/health-insurance/optima-secure',
  },
  ACKO: {
    planName: 'ACKO Platinum Health',
    networkHospitals: 10000,
    csr: 99.98,
    roomRentLimit: 'No limit',
    coPayment: 'None',
    restoration: '100% unlimited',
    waitingPeriod: '30 days / 2 yr PED / 3 yr specific',
    ncb: '10% per year up to 50%',
    preAuthTime: '30 minutes',
    cashlessEverywhere: true,
    uniqueFeature: 'Zero deduction at claim — no copay, no room rent cap',
    appRating: 4.5,
    directLink: 'https://www.acko.com/health-insurance',
  },
  STAR: {
    planName: 'Star Comprehensive',
    networkHospitals: 14000,
    csr: 99.09,
    roomRentLimit: 'Single AC',
    coPayment: '20% for 61+',
    restoration: '100% once',
    waitingPeriod: '30 days / 2 yr PED / 4 yr specific',
    ncb: '5% per year up to 25%',
    preAuthTime: '2 hours',
    cashlessEverywhere: true,
    uniqueFeature: 'Automatic SI restoration for same illness after 45 days',
    appRating: 4.1,
    directLink: 'https://www.starhealth.in/health-insurance',
  },
  NIVA_BUPA: {
    planName: 'Niva Bupa ReAssure 2.0',
    networkHospitals: 10000,
    csr: 100,
    roomRentLimit: 'No limit',
    coPayment: '10% for 61+',
    restoration: '100% unlimited',
    waitingPeriod: '30 days / 2 yr PED / 3 yr specific',
    ncb: '10% per year up to 100%',
    preAuthTime: '1.5 hours',
    cashlessEverywhere: true,
    uniqueFeature: 'Unlimited restoration for unrelated & related illnesses',
    appRating: 4.4,
    directLink: 'https://www.nivabupa.com/health-insurance-plans.html',
  },
  CARE: {
    planName: 'Care Supreme',
    networkHospitals: 22350,
    csr: 100,
    roomRentLimit: 'No limit',
    coPayment: 'None',
    restoration: '100% once',
    waitingPeriod: '30 days / 2 yr PED / 3 yr specific',
    ncb: '10% per year up to 150%',
    preAuthTime: '2 hours',
    cashlessEverywhere: true,
    uniqueFeature: 'NCB up to 150% — highest in market',
    appRating: 4.2,
    directLink: 'https://www.careinsurance.com/health-insurance',
  },
  ADITYA_BIRLA: {
    planName: 'Aditya Birla Activ Health Platinum',
    networkHospitals: 11000,
    csr: 100,
    roomRentLimit: 'No limit',
    coPayment: '10% for 61+',
    restoration: '100% unlimited',
    waitingPeriod: '30 days / 2 yr PED / 3 yr specific',
    ncb: '10% per year up to 100%',
    preAuthTime: '1 hour',
    cashlessEverywhere: true,
    uniqueFeature: 'Chronic Management Program — lifelong cover for chronic conditions',
    appRating: 4.3,
    directLink: 'https://www.adityabirlacapital.com/healthinsurance',
  },
  ICICI_LOMBARD: {
    planName: 'ICICI Lombard Elevate',
    networkHospitals: 9400,
    csr: 98.45,
    roomRentLimit: 'No limit',
    coPayment: '10% for 61+',
    restoration: '100% once',
    waitingPeriod: '30 days / 2 yr PED / 4 yr specific',
    ncb: '10% per year up to 100%',
    preAuthTime: '2 hours',
    cashlessEverywhere: true,
    uniqueFeature: 'Wellness rewards up to 25% premium discount',
    appRating: 4.2,
    directLink: 'https://www.icicilombard.com/health-insurance',
  },
};
