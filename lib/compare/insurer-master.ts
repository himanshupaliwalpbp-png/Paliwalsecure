// =============================================================================
// Insurer Master Data — All Insurers
// Covers: General Insurers, Standalone Health Insurers, Life Insurers
// =============================================================================

// ---------------------------------------------------------------------------
// Insurer Category Types
// ---------------------------------------------------------------------------
export type InsurerCategory = 'general' | 'standalone_health' | 'life';

export type InsuranceProduct =
  | 'motor'
  | 'health'
  | 'life'
  | 'travel'
  | 'home'
  | 'commercial';

// ---------------------------------------------------------------------------
// Individual Insurer Record
// ---------------------------------------------------------------------------
export interface InsurerRecord {
  name: string;
  shortName: string;
  type: InsurerCategory;
  categories: InsuranceProduct[];
  CSR: number;                // Claim Settlement Ratio %
  motorCSR?: number;          // Motor-specific CSR (IRDAI FY24-25)
  healthCSR?: number;         // Health-specific CSR (IRDAI FY24-25)
  garages: number;            // Network garages (motor)
  hospitals: number;          // Network hospitals (health)
  appRating: number;
  claimTime: string;          // Average claim settlement time
  solvencyRatio: number;      // IRDAI mandated (min 1.50 for life, min 1.50 for general)
  customerCare: string;
  websiteUrl: string;
}

// ---------------------------------------------------------------------------
// Master Insurer Data
// ---------------------------------------------------------------------------
export const INSURER_MASTER: Record<string, InsurerRecord> = {
  // ─── General Insurers ───────────────────────────────────────────────────
  HDFC_ERGO: {
    name: 'HDFC ERGO General Insurance',
    shortName: 'HDFC ERGO',
    type: 'general',
    categories: ['motor', 'health', 'travel', 'home', 'commercial'],
    CSR: 98.85,
    motorCSR: 98.85,
    healthCSR: 98.85,
    garages: 8200,
    hospitals: 13000,
    appRating: 4.3,
    claimTime: '7 days',
    solvencyRatio: 1.82,
    customerCare: '1800-266-0700',
    websiteUrl: 'https://www.hdfcergo.com',
  },
  ACKO: {
    name: 'ACKO General Insurance',
    shortName: 'ACKO',
    type: 'general',
    categories: ['motor', 'health'],
    CSR: 99.98,
    motorCSR: 99.98,
    healthCSR: 99.98,
    garages: 5400,
    hospitals: 10000,
    appRating: 4.5,
    claimTime: '3 days',
    solvencyRatio: 1.68,
    customerCare: '1800-266-0111',
    websiteUrl: 'https://www.acko.com',
  },
  TATA_AIG: {
    name: 'TATA AIG General Insurance',
    shortName: 'TATA AIG',
    type: 'general',
    categories: ['motor', 'health', 'travel', 'home', 'commercial'],
    CSR: 98.0,
    motorCSR: 98.0,
    garages: 7500,
    hospitals: 9800,
    appRating: 4.2,
    claimTime: '7 days',
    solvencyRatio: 1.95,
    customerCare: '1800-266-7780',
    websiteUrl: 'https://www.tataaig.com',
  },
  GO_DIGIT: {
    name: 'Go Digit General Insurance',
    shortName: 'Go Digit',
    type: 'general',
    categories: ['motor', 'health', 'travel', 'home'],
    CSR: 90.4,
    garages: 6100,
    hospitals: 7900,
    appRating: 4.4,
    claimTime: '5 days',
    solvencyRatio: 1.72,
    customerCare: '1800-103-4448',
    websiteUrl: 'https://www.godigit.com',
  },
  BAJAJ_ALLIANZ: {
    name: 'Bajaj Allianz General Insurance',
    shortName: 'Bajaj Allianz',
    type: 'general',
    categories: ['motor', 'health', 'travel', 'home', 'commercial'],
    CSR: 93.5,
    garages: 8800,
    hospitals: 11200,
    appRating: 4.1,
    claimTime: '7 days',
    solvencyRatio: 2.14,
    customerCare: '1800-209-5858',
    websiteUrl: 'https://www.bajajallianz.com',
  },
  ICICI_LOMBARD: {
    name: 'ICICI Lombard General Insurance',
    shortName: 'ICICI Lombard',
    type: 'general',
    categories: ['motor', 'health', 'travel', 'home', 'commercial'],
    CSR: 98.45,
    motorCSR: 98.45,
    healthCSR: 98.45,
    garages: 7900,
    hospitals: 9400,
    appRating: 4.2,
    claimTime: '7 days',
    solvencyRatio: 2.08,
    customerCare: '1800-2666',
    websiteUrl: 'https://www.icicilombard.com',
  },
  RELIANCE: {
    name: 'Reliance General Insurance',
    shortName: 'Reliance',
    type: 'general',
    categories: ['motor', 'health', 'travel', 'home'],
    CSR: 99.32,
    motorCSR: 99.32,
    garages: 6800,
    hospitals: 8500,
    appRating: 3.9,
    claimTime: '10 days',
    solvencyRatio: 1.62,
    customerCare: '1800-3009',
    websiteUrl: 'https://www.reliancegeneral.co.in',
  },
  NEW_INDIA: {
    name: 'The New India Assurance Co. Ltd.',
    shortName: 'New India',
    type: 'general',
    categories: ['motor', 'health', 'travel', 'home', 'commercial'],
    CSR: 91.75,
    motorCSR: 91.75,
    garages: 5900,
    hospitals: 7200,
    appRating: 3.6,
    claimTime: '14 days',
    solvencyRatio: 1.75,
    customerCare: '1800-209-1415',
    websiteUrl: 'https://www.newindia.co.in',
  },

  // ─── Standalone Health Insurers ─────────────────────────────────────────
  STAR_HEALTH: {
    name: 'Star Health & Allied Insurance',
    shortName: 'Star Health',
    type: 'standalone_health',
    categories: ['health', 'travel'],
    CSR: 99.09,
    healthCSR: 99.09,
    garages: 0,
    hospitals: 14000,
    appRating: 4.1,
    claimTime: '7 days',
    solvencyRatio: 1.82,
    customerCare: '1800-425-2255',
    websiteUrl: 'https://www.starhealth.in',
  },
  NIVA_BUPA: {
    name: 'Niva Bupa Health Insurance',
    shortName: 'Niva Bupa',
    type: 'standalone_health',
    categories: ['health'],
    CSR: 100,
    healthCSR: 100,
    garages: 0,
    hospitals: 10000,
    appRating: 4.4,
    claimTime: '5 days',
    solvencyRatio: 1.88,
    customerCare: '1800-301-0202',
    websiteUrl: 'https://www.nivabupa.com',
  },
  CARE_HEALTH: {
    name: 'Care Health Insurance',
    shortName: 'Care Health',
    type: 'standalone_health',
    categories: ['health'],
    CSR: 100,
    healthCSR: 100,
    garages: 0,
    hospitals: 22350,
    appRating: 4.2,
    claimTime: '7 days',
    solvencyRatio: 1.74,
    customerCare: '1800-102-4466',
    websiteUrl: 'https://www.careinsurance.com',
  },
  ADITYA_BIRLA: {
    name: 'Aditya Birla Health Insurance',
    shortName: 'Aditya Birla Health',
    type: 'standalone_health',
    categories: ['health'],
    CSR: 100,
    healthCSR: 100,
    garages: 0,
    hospitals: 11000,
    appRating: 4.3,
    claimTime: '7 days',
    solvencyRatio: 1.80,
    customerCare: '1800-270-7000',
    websiteUrl: 'https://www.adityabirlacapital.com/healthinsurance',
  },

  // ─── Life Insurers ──────────────────────────────────────────────────────
  HDFC_LIFE: {
    name: 'HDFC Life Insurance',
    shortName: 'HDFC Life',
    type: 'life',
    categories: ['life'],
    CSR: 99.37,
    garages: 0,
    hospitals: 0,
    appRating: 4.4,
    claimTime: '12 days',
    solvencyRatio: 2.01,
    customerCare: '1800-267-9999',
    websiteUrl: 'https://www.hdfclife.com',
  },
  MAX_LIFE: {
    name: 'Max Life Insurance',
    shortName: 'Max Life',
    type: 'life',
    categories: ['life'],
    CSR: 99.51,
    garages: 0,
    hospitals: 0,
    appRating: 4.5,
    claimTime: '10 days',
    solvencyRatio: 1.92,
    customerCare: '1800-419-9026',
    websiteUrl: 'https://www.maxlifeinsurance.com',
  },
  LIC: {
    name: 'Life Insurance Corporation of India',
    shortName: 'LIC',
    type: 'life',
    categories: ['life'],
    CSR: 98.52,
    garages: 0,
    hospitals: 0,
    appRating: 3.8,
    claimTime: '30 days',
    solvencyRatio: 1.90,
    customerCare: '1800-22-4078',
    websiteUrl: 'https://www.licindia.in',
  },
  SBI_LIFE: {
    name: 'SBI Life Insurance',
    shortName: 'SBI Life',
    type: 'life',
    categories: ['life'],
    CSR: 98.21,
    garages: 0,
    hospitals: 0,
    appRating: 4.1,
    claimTime: '12 days',
    solvencyRatio: 2.25,
    customerCare: '1800-267-9090',
    websiteUrl: 'https://www.sbilife.co.in',
  },
  KOTAK: {
    name: 'Kotak Mahindra Life Insurance',
    shortName: 'Kotak Life',
    type: 'life',
    categories: ['life'],
    CSR: 98.79,
    garages: 0,
    hospitals: 0,
    appRating: 4.3,
    claimTime: '10 days',
    solvencyRatio: 2.22,
    customerCare: '1800-209-8888',
    websiteUrl: 'https://www.kotaklife.com',
  },
  BAJAJ_LIFE: {
    name: 'Bajaj Allianz Life Insurance',
    shortName: 'Bajaj Life',
    type: 'life',
    categories: ['life'],
    CSR: 99.04,
    garages: 0,
    hospitals: 0,
    appRating: 4.2,
    claimTime: '10 days',
    solvencyRatio: 3.42,
    customerCare: '1800-209-7272',
    websiteUrl: 'https://www.bajajallianzlife.com',
  },
  TATA_AIA: {
    name: 'TATA AIA Life Insurance',
    shortName: 'TATA AIA Life',
    type: 'life',
    categories: ['life'],
    CSR: 99.13,
    garages: 0,
    hospitals: 0,
    appRating: 4.4,
    claimTime: '8 days',
    solvencyRatio: 2.38,
    customerCare: '1800-266-0011',
    websiteUrl: 'https://www.tataaia.com',
  },
};
