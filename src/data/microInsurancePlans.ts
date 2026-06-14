// ============================================================================
// Paliwal Secure - Micro Insurance Plans Data
// IRDAI-Compliant | Source: PMJJBY, PMSBY, Ayushman Bharat & Micro Insurance
// Chhota premium, badi suraksha — sabke liye bima ka adhikar
// ============================================================================

export interface MicroInsuranceProduct {
  id: string;
  name: string;
  insurer: string;
  sumInsured: number;
  premiumMonthly: number;
  features: string[];
  targetAudience: string;
  govtScheme: boolean;
  enrollmentMethod: string;
}

export const microInsurancePlans: MicroInsuranceProduct[] = [
  {
    id: 'micro-001',
    name: 'PMJJBY – Pradhan Mantri Jeevan Jyoti Bima Yojana',
    insurer: 'Life Insurance Corporation of India (Administered)',
    sumInsured: 200000,
    premiumMonthly: 36.5,
    features: [
      'Life cover of ₹2L on death (any cause)',
      'Annual premium ₹436 (auto-debit from bank)',
      'Age group: 18-50 years',
      'No medical examination required',
      'Run by LIC / other life insurers via banks',
      'Renewal auto-debit every year',
      'Maturity benefit: NIL (pure term cover)',
    ],
    targetAudience: 'Jan Dhan account holders, low-income families, rural population',
    govtScheme: true,
    enrollmentMethod: 'Through savings bank account (auto-debit) via nearby bank branch or net banking',
  },
  {
    id: 'micro-002',
    name: 'PMSBY – Pradhan Mantri Suraksha Bima Yojana',
    insurer: 'New India Assurance / UIIC (Administered)',
    sumInsured: 200000,
    premiumMonthly: 16.7,
    features: [
      'Accidental death cover: ₹2L',
      'Permanent disability cover: ₹2L',
      'Partial disability cover: ₹1L',
      'Annual premium ₹20 (auto-debit)',
      'Age group: 18-70 years',
      'No medical check-up needed',
      'Covers road & rail accidents',
    ],
    targetAudience: 'All bank account holders, daily wage workers, migrant labor',
    govtScheme: true,
    enrollmentMethod: 'Through savings bank account (auto-debit) — enrol via bank or mobile app',
  },
  {
    id: 'micro-003',
    name: 'Ayushman Bharat – Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)',
    insurer: 'National Health Authority (Government of India)',
    sumInsured: 500000,
    premiumMonthly: 0,
    features: [
      'Health cover up to ₹5L per family per year',
      'Cashless & paperless treatment at empaneled hospitals',
      'Covers 1,929 procedures including pre & post hospitalization',
      'No cap on family size or age',
      'Pre-existing diseases covered from Day 1',
      '1,500+ empaneled hospitals across India',
      'Free for eligible families — zero premium',
      'e-card based access via Ayushman Bharat portal',
    ],
    targetAudience: 'SECC 2011 deprived households, ration card holders, vulnerable families',
    govtScheme: true,
    enrollmentMethod: 'Check eligibility at pmjay.gov.in or nearest CSC (Common Service Centre); Ayushman card issued free',
  },
  {
    id: 'micro-004',
    name: 'PMFBY – Pradhan Mantri Fasal Bima Yojana (Crop Insurance)',
    insurer: 'AIC of India / SBI General / ICICI Lombard (Administered)',
    sumInsured: 100000,
    premiumMonthly: 42,
    features: [
      'Crop insurance for Kharif & Rabi seasons',
      'Kharif premium: 2% of sum insured',
      'Rabi premium: 1.5% of sum insured',
      'Commercial/horticulture crops: 5% premium',
      'Covers drought, flood, pest attack, hailstorm',
      'Post-harvest losses covered up to 14 days',
      'Government subsidizes balance premium',
      'Claims via bank account (DBT)',
    ],
    targetAudience: 'Farmers, agricultural laborers, sharecroppers, tenant farmers',
    govtScheme: true,
    enrollmentMethod: 'Through nearest bank branch, CSC, or PMFBY portal before season cut-off date',
  },
  {
    id: 'micro-005',
    name: 'Atal Pension Yojana (APY)',
    insurer: 'Pension Fund Regulatory & Development Authority (PFRDA)',
    sumInsured: 5000000,
    premiumMonthly: 42,
    features: [
      'Guaranteed monthly pension ₹1,000 to ₹5,000',
      'Age of entry: 18-40 years',
      'Pension starts at age 60',
      'Government co-contribution of 50% (up to ₹1,000/yr) for eligible subscribers',
      'Spouse receives pension on subscriber death',
      'Nominee receives corpus on death of both',
      'Auto-debit from bank account',
      'Tax benefit under Section 80CCD(1)',
    ],
    targetAudience: 'Unorganized sector workers, daily wage earners, self-employed, small vendors',
    govtScheme: true,
    enrollmentMethod: 'Through bank account (auto-debit) — visit bank branch or use internet banking',
  },
  {
    id: 'micro-006',
    name: 'Bajaj Allianz Micro Health Plan',
    insurer: 'Bajaj Allianz General Insurance Co. Ltd.',
    sumInsured: 100000,
    premiumMonthly: 150,
    features: [
      'Micro health cover up to ₹1L',
      'Hospitalization expenses covered',
      'Day care procedures included',
      'No medical check-up up to age 45',
      'Cashless at 6,500+ network hospitals',
      'Pre-existing diseases after 2-year waiting',
      'Affordable monthly premium option',
      'Sum insured restores 100% on exhaustion',
    ],
    targetAudience: 'Low-income families, informal sector workers, rural households',
    govtScheme: false,
    enrollmentMethod: 'Online via insurer website, mobile app, or through nearest Bajaj Allianz branch/agent',
  },
];
