// ============================================================================
// Paliwal Secure - Comprehensive Indian Insurance Product Data
// IRDAI-Compliant Static Data | Source: IRDAI Annual Report 2025-26
// ============================================================================

export type InsuranceCategory = 'health' | 'life' | 'motor' | 'travel' | 'home';

// ============================================================================
// CORE PLAN INTERFACES
// ============================================================================
export interface InsurancePlan {
  id: string;
  name: string;
  provider: string;
  category: InsuranceCategory;
  premium: {
    monthly: number;
    annual: number;
    currency: 'INR';
  };
  sumInsured: {
    min: number;
    max: number;
    currency: 'INR';
  };
  claimSettlementRatio: number;
  incurredClaimRatio?: number;
  solvencyRatio?: number;
  claimTurnaroundDays?: number;
  features: string[];
  exclusions: string[];
  eligibility: {
    minAge: number;
    maxAge: number;
    medicalTestRequired: boolean;
  };
  irdaRegistrationNo: string;
  rating: number;
  tagline: string;
  recommendedFor: string[];
  networkHospitals?: number;
  networkGarages?: number;
  waitingPeriod: string;
  noClaimBonus: string;
  taxBenefit: string;
  // Health-specific
  familyFloater?: boolean;
  maternityCover?: boolean;
  wellnessAddons?: boolean;
  roomRentLimit?: string;
  waitingPeriodPED?: number;
  waitingPeriodInitial?: number;
  // Complaints & trust metrics
  complaintsPer10k?: number;
  // Detailed waiting period by condition
  waitingPeriodDetailed?: {
    diabetes: number;
    bp: number;
    heart: number;
  };
  // Life-specific
  ridersAvailable?: string[];
  policyTerm?: number;
  sumAssured?: number;
  aum?: number; // Assets Under Management in ₹ Crores
  // Motor-specific
  idvPercentage?: number;
  addonsAvailable?: string[];
  thirdPartyPremium?: number;
  // Travel-specific
  coverageDays?: number;
  sumInsuredMedical?: number;
  singleTripPremium?: number;
  annualMultiTripPremium?: number;
  // Data provenance
  dataSource: string;
}

// ============================================================================
// HEALTH INSURANCE PLANS (8 plans)
// Source: IRDAI Annual Report 2025-26
// ============================================================================
export const healthInsurancePlans: InsurancePlan[] = [
  {
    id: 'health-001',
    name: 'Acko General Insurance',
    provider: 'Acko General Insurance',
    category: 'health',
    premium: { monthly: 550, annual: 6200, currency: 'INR' },
    sumInsured: { min: 500000, max: 10000000, currency: 'INR' },
    claimSettlementRatio: 99.91,
    incurredClaimRatio: 65,
    solvencyRatio: 1.7,
    complaintsPer10k: 15,
    networkHospitals: 10000,
    waitingPeriod: 'Diabetes: 24 months, BP: 24 months, Heart: 36 months',
    waitingPeriodDetailed: { diabetes: 24, bp: 24, heart: 36 },
    waitingPeriodInitial: 30,
    waitingPeriodPED: 24,
    features: ['Cashless everywhere', 'Quick claim settlement', 'No room rent limit'],
    exclusions: ['Dental treatment', 'Cosmetic surgery', 'Weight loss procedures'],
    eligibility: { minAge: 18, maxAge: 65, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN157202000012020001',
    rating: 4.7,
    tagline: 'Digital-First Health Protection',
    recommendedFor: ['young-professional', 'family', 'digital-savvy'],
    noClaimBonus: 'Cumulative bonus up to 100%',
    taxBenefit: 'Up to ₹75,000 under Section 80D',
    familyFloater: true,
    maternityCover: false,
    wellnessAddons: true,
    roomRentLimit: 'No limit',
    dataSource: 'IRDAI Annual Report 2025-26',
  },
  {
    id: 'health-002',
    name: 'HDFC ERGO General Insurance',
    provider: 'HDFC ERGO General Insurance',
    category: 'health',
    premium: { monthly: 600, annual: 6800, currency: 'INR' },
    sumInsured: { min: 500000, max: 15000000, currency: 'INR' },
    claimSettlementRatio: 98.85,
    incurredClaimRatio: 89.47,
    solvencyRatio: 1.9,
    complaintsPer10k: 10.67,
    networkHospitals: 10000,
    waitingPeriod: 'Diabetes: 36 months, BP: 24 months, Heart: 48 months',
    waitingPeriodDetailed: { diabetes: 36, bp: 24, heart: 48 },
    waitingPeriodInitial: 30,
    waitingPeriodPED: 24,
    features: ['Optima Restore feature', '100% restoration', 'No claim bonus'],
    exclusions: ['Dental treatment', 'Alternative treatments'],
    eligibility: { minAge: 18, maxAge: 65, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN108200100012008014',
    rating: 4.7,
    tagline: 'Restore Your Health, Restore Your Life',
    recommendedFor: ['family', 'high-income', 'working-professional'],
    noClaimBonus: '50% cumulative bonus per year up to 100%',
    taxBenefit: 'Up to ₹75,000 under Section 80D',
    familyFloater: true,
    maternityCover: true,
    wellnessAddons: true,
    roomRentLimit: 'Deluxe room',
    dataSource: 'IRDAI Annual Report 2025-26',
  },
  {
    id: 'health-003',
    name: 'Care Health Insurance',
    provider: 'Care Health Insurance',
    category: 'health',
    premium: { monthly: 500, annual: 5600, currency: 'INR' },
    sumInsured: { min: 500000, max: 15000000, currency: 'INR' },
    claimSettlementRatio: 93.13,
    incurredClaimRatio: 58.68,
    solvencyRatio: 1.8,
    complaintsPer10k: 27.06,
    networkHospitals: 21700,
    waitingPeriod: 'Diabetes: 24 months, BP: 24 months, Heart: 36 months',
    waitingPeriodDetailed: { diabetes: 24, bp: 24, heart: 36 },
    waitingPeriodInitial: 30,
    waitingPeriodPED: 24,
    features: ['Care Supreme plan', 'Ayurveda coverage', 'Health checkup included'],
    exclusions: ['Dental treatment', 'Alternative treatments', 'Cosmetic surgery'],
    eligibility: { minAge: 5, maxAge: 65, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN115200100012009002',
    rating: 4.6,
    tagline: 'Care Like Family',
    recommendedFor: ['family', 'senior-citizen', 'middle-income'],
    noClaimBonus: 'Cumulative bonus up to 100%',
    taxBenefit: 'Up to ₹75,000 under Section 80D',
    familyFloater: true,
    maternityCover: true,
    wellnessAddons: false,
    roomRentLimit: 'Single private room',
    dataSource: 'IRDAI Annual Report 2025-26',
  },
  {
    id: 'health-004',
    name: 'Star Health & Allied Insurance',
    provider: 'Star Health & Allied Insurance',
    category: 'health',
    premium: { monthly: 550, annual: 6200, currency: 'INR' },
    sumInsured: { min: 300000, max: 10000000, currency: 'INR' },
    claimSettlementRatio: 88.34,
    incurredClaimRatio: 67.26,
    solvencyRatio: 2.1,
    complaintsPer10k: 52.31,
    networkHospitals: 14000,
    waitingPeriod: 'Diabetes: 48 months, BP: 36 months, Heart: 48 months',
    waitingPeriodDetailed: { diabetes: 48, bp: 36, heart: 48 },
    waitingPeriodInitial: 30,
    waitingPeriodPED: 36,
    features: ['Star Comprehensive plan', 'Diabetic care package', 'Maternity cover'],
    exclusions: ['Pre-existing diseases (longer waiting period)', 'Cosmetic surgery', 'Self-inflicted injuries'],
    eligibility: { minAge: 18, maxAge: 65, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN103200100012008018',
    rating: 4.3,
    tagline: 'Your Health, Our Priority',
    recommendedFor: ['family', 'budget-conscious', 'senior-citizen'],
    noClaimBonus: '10% increase per claim-free year up to 100%',
    taxBenefit: 'Up to ₹75,000 under Section 80D',
    familyFloater: true,
    maternityCover: true,
    wellnessAddons: false,
    roomRentLimit: 'Single room',
    dataSource: 'IRDAI Annual Report 2025-26',
  },
  {
    id: 'health-005',
    name: 'Niva Bupa Health Insurance',
    provider: 'Niva Bupa Health Insurance',
    category: 'health',
    premium: { monthly: 600, annual: 6800, currency: 'INR' },
    sumInsured: { min: 500000, max: 10000000, currency: 'INR' },
    claimSettlementRatio: 91.22,
    incurredClaimRatio: 58.10,
    solvencyRatio: 1.9,
    complaintsPer10k: 42.85,
    networkHospitals: 10000,
    waitingPeriod: 'Diabetes: 24 months, BP: 24 months, Heart: 36 months',
    waitingPeriodDetailed: { diabetes: 24, bp: 24, heart: 36 },
    waitingPeriodInitial: 30,
    waitingPeriodPED: 24,
    features: ['ReAssure 2.0', 'Health return', 'Wellness benefits'],
    exclusions: ['Dental treatment', 'Alternative treatments'],
    eligibility: { minAge: 18, maxAge: 65, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN120200100012019001',
    rating: 4.5,
    tagline: 'ReAssure Your Health',
    recommendedFor: ['family', 'high-income', 'working-professional'],
    noClaimBonus: 'Cumulative bonus up to 100%',
    taxBenefit: 'Up to ₹75,000 under Section 80D',
    familyFloater: true,
    maternityCover: true,
    wellnessAddons: true,
    roomRentLimit: 'No limit',
    dataSource: 'IRDAI Annual Report 2025-26',
  },
  {
    id: 'health-006',
    name: 'ICICI Lombard General Insurance',
    provider: 'ICICI Lombard General Insurance',
    category: 'health',
    premium: { monthly: 500, annual: 5600, currency: 'INR' },
    sumInsured: { min: 300000, max: 10000000, currency: 'INR' },
    claimSettlementRatio: 91.22,
    incurredClaimRatio: 77.37,
    solvencyRatio: 1.8,
    complaintsPer10k: 27.06,
    networkHospitals: 7500,
    waitingPeriod: 'Diabetes: 36 months, BP: 24 months, Heart: 48 months',
    waitingPeriodDetailed: { diabetes: 36, bp: 24, heart: 48 },
    waitingPeriodInitial: 30,
    waitingPeriodPED: 24,
    features: ['Elevate plan', 'Global coverage add-on', 'Telemedicine'],
    exclusions: ['Pre-existing diseases (waiting period applies)', 'Cosmetic treatment', 'Experimental procedures'],
    eligibility: { minAge: 18, maxAge: 65, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN104200100012004013',
    rating: 4.4,
    tagline: 'Complete Protection, Complete Peace',
    recommendedFor: ['family', 'working-professional'],
    noClaimBonus: '5% cumulative bonus per year up to 50%',
    taxBenefit: 'Up to ₹75,000 under Section 80D',
    familyFloater: true,
    maternityCover: false,
    wellnessAddons: false,
    roomRentLimit: 'Single room',
    dataSource: 'IRDAI Annual Report 2025-26',
  },
  {
    id: 'health-007',
    name: 'TATA AIG General Insurance',
    provider: 'TATA AIG General Insurance',
    category: 'health',
    premium: { monthly: 550, annual: 6200, currency: 'INR' },
    sumInsured: { min: 500000, max: 10000000, currency: 'INR' },
    claimSettlementRatio: 96.67,
    incurredClaimRatio: 94.44,
    solvencyRatio: 2.0,
    complaintsPer10k: 20,
    networkHospitals: 6500,
    waitingPeriod: 'Diabetes: 24 months, BP: 24 months, Heart: 36 months',
    waitingPeriodDetailed: { diabetes: 24, bp: 24, heart: 36 },
    waitingPeriodInitial: 30,
    waitingPeriodPED: 24,
    features: ['MediCare plan', 'Critical illness rider', 'Health coach'],
    exclusions: ['Dental treatment', 'Cosmetic surgery', 'Weight loss procedures'],
    eligibility: { minAge: 18, maxAge: 65, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN109200100012004025',
    rating: 4.6,
    tagline: 'Trusted Protection, Trusted Name',
    recommendedFor: ['family', 'working-professional', 'risk-averse'],
    noClaimBonus: 'Cumulative bonus up to 100%',
    taxBenefit: 'Up to ₹75,000 under Section 80D',
    familyFloater: true,
    maternityCover: false,
    wellnessAddons: true,
    roomRentLimit: 'Single private room',
    dataSource: 'IRDAI Annual Report 2025-26',
  },
  {
    id: 'health-008',
    name: 'Bajaj Allianz General Insurance',
    provider: 'Bajaj Allianz General Insurance',
    category: 'health',
    premium: { monthly: 520, annual: 5800, currency: 'INR' },
    sumInsured: { min: 500000, max: 10000000, currency: 'INR' },
    claimSettlementRatio: 93.65,
    incurredClaimRatio: 54.33,
    solvencyRatio: 3.0,
    complaintsPer10k: 25,
    networkHospitals: 8500,
    waitingPeriod: 'Diabetes: 36 months, BP: 24 months, Heart: 48 months',
    waitingPeriodDetailed: { diabetes: 36, bp: 24, heart: 48 },
    waitingPeriodInitial: 30,
    waitingPeriodPED: 24,
    features: ['Health Guard plan', 'Wellness program', 'NCB up to 50%'],
    exclusions: ['Pre-existing diseases (waiting period applies)', 'Dental treatment', 'Cosmetic surgery'],
    eligibility: { minAge: 18, maxAge: 65, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN102200100012002016',
    rating: 4.5,
    tagline: 'Health Guard, Life Guard',
    recommendedFor: ['family', 'working-professional', 'high-income'],
    noClaimBonus: 'NCB up to 50%',
    taxBenefit: 'Up to ₹75,000 under Section 80D',
    familyFloater: true,
    maternityCover: false,
    wellnessAddons: true,
    roomRentLimit: 'Single private room',
    dataSource: 'IRDAI Annual Report 2025-26',
  },
];

// ============================================================================
// LIFE INSURANCE PLANS (8 plans)
// Source: IRDAI Life Insurance CSR Report 2025-26
// ============================================================================
export const lifeInsurancePlans: InsurancePlan[] = [
  {
    id: 'life-001',
    name: 'HDFC Life Insurance',
    provider: 'HDFC Life Insurance',
    category: 'life',
    premium: { monthly: 1250, annual: 15000, currency: 'INR' },
    sumInsured: { min: 2500000, max: 100000000, currency: 'INR' },
    sumAssured: 10000000,
    claimSettlementRatio: 99.97,
    claimTurnaroundDays: 30,
    solvencyRatio: 2.1,
    aum: 250000,
    policyTerm: 30,
    features: ['Click2Protect', 'Term plan', 'Return of premium option'],
    exclusions: ['Suicide within 1 year'],
    eligibility: { minAge: 18, maxAge: 65, medicalTestRequired: true },
    irdaRegistrationNo: 'IRDAN107200100012004042',
    rating: 4.8,
    tagline: 'Selfless Protection for Selfless Love',
    recommendedFor: ['young-professional', 'sole-earner', 'high-income'],
    ridersAvailable: ['Critical Illness', 'Accidental Death', 'Waiver of Premium'],
    waitingPeriod: 'N/A',
    noClaimBonus: 'N/A - Term plan',
    taxBenefit: 'U/S 80C, 10(10D)',
    dataSource: 'IRDAI Life Insurance CSR Report 2025-26',
  },
  {
    id: 'life-002',
    name: 'Max Life Insurance',
    provider: 'Max Life Insurance',
    category: 'life',
    premium: { monthly: 1350, annual: 16000, currency: 'INR' },
    sumInsured: { min: 2500000, max: 100000000, currency: 'INR' },
    sumAssured: 10000000,
    claimSettlementRatio: 99.08,
    claimTurnaroundDays: 30,
    solvencyRatio: 2.1,
    aum: 150000,
    policyTerm: 30,
    features: ['Smart Term Plan', 'Critical illness add-on', 'Waiver of premium'],
    exclusions: ['Suicide within 1 year', 'Hazardous activities'],
    eligibility: { minAge: 18, maxAge: 60, medicalTestRequired: true },
    irdaRegistrationNo: 'IRDAN124200100012007050',
    rating: 4.7,
    tagline: 'Smart Protection, Secure Future',
    recommendedFor: ['young-professional', 'family', 'women'],
    ridersAvailable: ['Critical Illness', 'Accidental Death', 'Waiver of Premium'],
    waitingPeriod: 'N/A',
    noClaimBonus: 'N/A - Term plan',
    taxBenefit: 'U/S 80C, 10(10D)',
    dataSource: 'IRDAI Life Insurance CSR Report 2025-26',
  },
  {
    id: 'life-003',
    name: 'SBI Life Insurance',
    provider: 'SBI Life Insurance',
    category: 'life',
    premium: { monthly: 1200, annual: 14000, currency: 'INR' },
    sumInsured: { min: 2500000, max: 100000000, currency: 'INR' },
    sumAssured: 10000000,
    claimSettlementRatio: 98.50,
    claimTurnaroundDays: 45,
    solvencyRatio: 2.0,
    aum: 380000,
    policyTerm: 30,
    features: ['eShield Next', 'Multi-protection rider', 'Tax savings'],
    exclusions: ['Suicide within 1 year', 'Criminal activities'],
    eligibility: { minAge: 18, maxAge: 65, medicalTestRequired: true },
    irdaRegistrationNo: 'IRDAN111200100012006032',
    rating: 4.7,
    tagline: 'Suraksha Ke Sath, Vishwas Ke Sath',
    recommendedFor: ['family', 'risk-averse', 'government-employee'],
    ridersAvailable: ['Critical Illness', 'Accidental Death', 'Waiver of Premium'],
    waitingPeriod: 'N/A',
    noClaimBonus: 'N/A - Term plan',
    taxBenefit: 'U/S 80C, 10(10D)',
    dataSource: 'IRDAI Life Insurance CSR Report 2025-26',
  },
  {
    id: 'life-004',
    name: 'ICICI Prudential Life',
    provider: 'ICICI Prudential Life Insurance',
    category: 'life',
    premium: { monthly: 1280, annual: 15000, currency: 'INR' },
    sumInsured: { min: 2500000, max: 100000000, currency: 'INR' },
    sumAssured: 10000000,
    claimSettlementRatio: 98.20,
    claimTurnaroundDays: 45,
    solvencyRatio: 2.0,
    aum: 220000,
    policyTerm: 30,
    features: ['iProtect', 'Multiple life stage cover', 'Critical illness'],
    exclusions: ['Suicide within 1 year', 'Self-inflicted injuries'],
    eligibility: { minAge: 18, maxAge: 60, medicalTestRequired: true },
    irdaRegistrationNo: 'IRDAN105200100012004020',
    rating: 4.6,
    tagline: 'Smart Protection, Smart Choice',
    recommendedFor: ['young-professional', 'family', 'sole-earner'],
    ridersAvailable: ['Critical Illness', 'Accidental Death', 'Waiver of Premium'],
    waitingPeriod: 'N/A',
    noClaimBonus: 'N/A - Term plan',
    taxBenefit: 'U/S 80C, 10(10D)',
    dataSource: 'IRDAI Life Insurance CSR Report 2025-26',
  },
  {
    id: 'life-005',
    name: 'Bajaj Allianz Life',
    provider: 'Bajaj Allianz Life Insurance',
    category: 'life',
    premium: { monthly: 1100, annual: 13000, currency: 'INR' },
    sumInsured: { min: 2500000, max: 100000000, currency: 'INR' },
    sumAssured: 10000000,
    claimSettlementRatio: 97.50,
    claimTurnaroundDays: 45,
    solvencyRatio: 5.41,
    aum: 110000,
    policyTerm: 30,
    features: ['eTouch Term Plan', 'Payout options', 'Accidental death cover'],
    exclusions: ['Suicide within 1 year', 'Criminal activities'],
    eligibility: { minAge: 18, maxAge: 60, medicalTestRequired: true },
    irdaRegistrationNo: 'IRDAN106200100012002030',
    rating: 4.5,
    tagline: 'Smart Protection for Smart Goals',
    recommendedFor: ['family', 'working-professional', 'risk-averse'],
    ridersAvailable: ['Critical Illness', 'Accidental Death', 'Waiver of Premium'],
    waitingPeriod: 'N/A',
    noClaimBonus: 'N/A - Term plan',
    taxBenefit: 'U/S 80C, 10(10D)',
    dataSource: 'IRDAI Life Insurance CSR Report 2025-26',
  },
  {
    id: 'life-006',
    name: 'LIC of India',
    provider: 'Life Insurance Corporation of India',
    category: 'life',
    premium: { monthly: 1000, annual: 12000, currency: 'INR' },
    sumInsured: { min: 2500000, max: 50000000, currency: 'INR' },
    sumAssured: 10000000,
    claimSettlementRatio: 95.55,
    claimTurnaroundDays: 60,
    solvencyRatio: 1.85,
    aum: 5000000,
    policyTerm: 30,
    features: ['Jeevan Amar', 'Bonus options', 'Government backed'],
    exclusions: ['Suicide within first 12 months', 'Death due to criminal activities', 'War/nuclear perils'],
    eligibility: { minAge: 18, maxAge: 50, medicalTestRequired: true },
    irdaRegistrationNo: 'IRDAN101200100012001001',
    rating: 4.7,
    tagline: 'Zindagi Ke Saath Bhi, Zindagi Ke Baad Bhi',
    recommendedFor: ['family', 'risk-averse', 'government-employee'],
    ridersAvailable: ['Accidental Death', 'Waiver of Premium'],
    waitingPeriod: 'N/A',
    noClaimBonus: 'N/A - Term plan',
    taxBenefit: 'U/S 80C, 10(10D)',
    dataSource: 'IRDAI Life Insurance CSR Report 2025-26',
  },
  {
    id: 'life-007',
    name: 'Kotak Mahindra Life',
    provider: 'Kotak Mahindra Life Insurance',
    category: 'life',
    premium: { monthly: 1230, annual: 14500, currency: 'INR' },
    sumInsured: { min: 2500000, max: 100000000, currency: 'INR' },
    sumAssured: 10000000,
    claimSettlementRatio: 97.20,
    claimTurnaroundDays: 45,
    solvencyRatio: 2.0,
    aum: 100000,
    policyTerm: 30,
    features: ['e-Term Plan', 'Premium waiver', 'Return of premium'],
    exclusions: ['Suicide within 1 year', 'Criminal activities'],
    eligibility: { minAge: 18, maxAge: 60, medicalTestRequired: true },
    irdaRegistrationNo: 'IRDAN117200100012009033',
    rating: 4.5,
    tagline: 'Faide Ki Baat, Insurance Ki Raat',
    recommendedFor: ['young-professional', 'family', 'working-professional'],
    ridersAvailable: ['Critical Illness', 'Accidental Death', 'Waiver of Premium'],
    waitingPeriod: 'N/A',
    noClaimBonus: 'N/A - Term plan',
    taxBenefit: 'U/S 80C, 10(10D)',
    dataSource: 'IRDAI Life Insurance CSR Report 2025-26',
  },
  {
    id: 'life-008',
    name: 'Tata AIA Life',
    provider: 'Tata AIA Life Insurance',
    category: 'life',
    premium: { monthly: 1190, annual: 14000, currency: 'INR' },
    sumInsured: { min: 2500000, max: 75000000, currency: 'INR' },
    sumAssured: 10000000,
    claimSettlementRatio: 98.00,
    claimTurnaroundDays: 45,
    solvencyRatio: 2.2,
    aum: 120000,
    policyTerm: 30,
    features: ['Sampoorna Raksha', 'Critical illness', 'Accidental disability'],
    exclusions: ['Suicide within 12 months', 'Adventure sports (without disclosure)', 'Substance abuse related death'],
    eligibility: { minAge: 18, maxAge: 65, medicalTestRequired: true },
    irdaRegistrationNo: 'IRDAN110200100012005029',
    rating: 4.6,
    tagline: 'Raksha That Goes Beyond',
    recommendedFor: ['family', 'working-professional', 'risk-averse'],
    ridersAvailable: ['Critical Illness', 'Accidental Death', 'Waiver of Premium'],
    waitingPeriod: 'N/A',
    noClaimBonus: 'N/A - Term plan',
    taxBenefit: 'U/S 80C, 10(10D)',
    dataSource: 'IRDAI Life Insurance CSR Report 2025-26',
  },
];

// ============================================================================
// MOTOR INSURANCE PLANS (3 plans)
// Source: IRDAI Annual Report 2025-26
// ============================================================================
export const motorInsurancePlans: InsurancePlan[] = [
  {
    id: 'motor-001',
    name: 'ICICI Lombard Motor',
    provider: 'ICICI Lombard General Insurance',
    category: 'motor',
    premium: { monthly: 158, annual: 1899, currency: 'INR' },
    sumInsured: { min: 100000, max: 5000000, currency: 'INR' },
    claimSettlementRatio: 91.22,
    solvencyRatio: 1.8,
    thirdPartyPremium: 850,
    idvPercentage: 85,
    features: ['Zero depreciation cover', '24/7 roadside assistance'],
    exclusions: ['Drunk driving claims', 'Driving without valid license', 'Consequential wear and tear', 'Electrical/mechanical breakdown'],
    eligibility: { minAge: 18, maxAge: 80, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN104200100012004013',
    rating: 4.5,
    tagline: 'Drive Secure, Drive Smart',
    recommendedFor: ['car-owner', 'urban', 'working-professional'],
    networkGarages: 7500,
    waitingPeriod: 'N/A',
    noClaimBonus: 'Up to 50% discount on own damage premium',
    taxBenefit: 'N/A - Motor insurance',
    addonsAvailable: ['Zero Depreciation', 'Roadside Assistance', 'Engine Protection'],
    dataSource: 'IRDAI Annual Report 2025-26',
  },
  {
    id: 'motor-002',
    name: 'HDFC ERGO Motor',
    provider: 'HDFC ERGO General Insurance',
    category: 'motor',
    premium: { monthly: 183, annual: 2200, currency: 'INR' },
    sumInsured: { min: 100000, max: 5000000, currency: 'INR' },
    claimSettlementRatio: 98.85,
    solvencyRatio: 1.9,
    thirdPartyPremium: 950,
    idvPercentage: 85,
    features: ['Engine protect cover', 'No claim bonus up to 50%'],
    exclusions: ['Drunk driving claims', 'Driving without valid license', 'Consequential wear and tear', 'Electrical/mechanical breakdown'],
    eligibility: { minAge: 18, maxAge: 80, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN108200100012008014',
    rating: 4.6,
    tagline: 'Car Insurance Made Simple',
    recommendedFor: ['car-owner', 'urban', 'working-professional'],
    networkGarages: 8500,
    waitingPeriod: 'N/A',
    noClaimBonus: 'Up to 50% discount on own damage premium',
    taxBenefit: 'N/A - Motor insurance',
    addonsAvailable: ['Zero Depreciation', 'Engine Protection', 'Return to Invoice'],
    dataSource: 'IRDAI Annual Report 2025-26',
  },
  {
    id: 'motor-003',
    name: 'Bajaj Allianz Motor',
    provider: 'Bajaj Allianz General Insurance',
    category: 'motor',
    premium: { monthly: 163, annual: 1950, currency: 'INR' },
    sumInsured: { min: 100000, max: 5000000, currency: 'INR' },
    claimSettlementRatio: 93.65,
    solvencyRatio: 3.0,
    thirdPartyPremium: 880,
    idvPercentage: 85,
    features: ['Consumables cover', 'Return to invoice'],
    exclusions: ['Drunk driving claims', 'Driving without valid license', 'Consequential wear and tear', 'Electrical/mechanical breakdown'],
    eligibility: { minAge: 18, maxAge: 80, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN102200100012002016',
    rating: 4.5,
    tagline: 'Smart Car, Smart Insurance',
    recommendedFor: ['car-owner', 'urban', 'family'],
    networkGarages: 6000,
    waitingPeriod: 'N/A',
    noClaimBonus: 'Up to 50% discount on own damage premium',
    taxBenefit: 'N/A - Motor insurance',
    addonsAvailable: ['Zero Depreciation', 'Consumables Cover', 'Return to Invoice'],
    dataSource: 'IRDAI Annual Report 2025-26',
  },
];

// ============================================================================
// TRAVEL INSURANCE PLANS (2 plans)
// Source: IRDAI Annual Report 2025-26
// ============================================================================
export const travelInsurancePlans: InsurancePlan[] = [
  {
    id: 'travel-001',
    name: 'TATA AIG Travel',
    provider: 'TATA AIG General Insurance',
    category: 'travel',
    premium: { monthly: 499, annual: 2499, currency: 'INR' },
    sumInsured: { min: 50000, max: 500000, currency: 'INR' },
    sumInsuredMedical: 50000,
    claimSettlementRatio: 96.67,
    singleTripPremium: 499,
    annualMultiTripPremium: 2499,
    coverageDays: 15,
    features: ['Medical evacuation', 'Trip cancellation', 'Lost baggage'],
    exclusions: ['Pre-existing diseases', 'Risky activities', 'Pregnancy'],
    eligibility: { minAge: 6, maxAge: 85, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN109200100012004025',
    rating: 4.5,
    tagline: 'Travel the World, Worry-Free',
    recommendedFor: ['traveler', 'business-traveler', 'student-abroad'],
    waitingPeriod: 'N/A',
    noClaimBonus: 'N/A',
    taxBenefit: 'N/A - Travel insurance',
    dataSource: 'IRDAI Annual Report 2025-26',
  },
  {
    id: 'travel-002',
    name: 'Care Health Travel',
    provider: 'Care Health Insurance',
    category: 'travel',
    premium: { monthly: 450, annual: 2299, currency: 'INR' },
    sumInsured: { min: 50000, max: 500000, currency: 'INR' },
    sumInsuredMedical: 50000,
    claimSettlementRatio: 93.13,
    singleTripPremium: 450,
    annualMultiTripPremium: 2299,
    coverageDays: 15,
    features: ['Covid cover', 'Flight delay', 'Hijack cover'],
    exclusions: ['Pre-existing diseases', 'Risky activities', 'Pregnancy'],
    eligibility: { minAge: 6, maxAge: 85, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN115200100012009002',
    rating: 4.3,
    tagline: 'Travel Safe, Travel Smart',
    recommendedFor: ['traveler', 'student-abroad', 'business-traveler'],
    waitingPeriod: 'N/A',
    noClaimBonus: 'N/A',
    taxBenefit: 'N/A - Travel insurance',
    dataSource: 'IRDAI Annual Report 2025-26',
  },
];

// ============================================================================
// HOME INSURANCE PLANS (2 plans)
// ============================================================================
export const homeInsurancePlans: InsurancePlan[] = [
  {
    id: 'home-001',
    name: 'HDFC ERGO Home Shield',
    provider: 'HDFC ERGO General Insurance',
    category: 'home',
    premium: { monthly: 125, annual: 1500, currency: 'INR' },
    sumInsured: { min: 500000, max: 50000000, currency: 'INR' },
    claimSettlementRatio: 89.48,
    solvencyRatio: 1.9,
    features: [
      'Structure and content coverage',
      'Fire and allied perils',
      'Burglary and theft',
      'Natural calamity coverage',
      'Terrorism coverage',
      'Rent for alternative accommodation',
      'Personal accident for residents',
      'Liability coverage for domestic help',
    ],
    exclusions: ['Willful destruction', 'War and nuclear perils', 'Wear and tear', 'Pollution and contamination'],
    eligibility: { minAge: 18, maxAge: 80, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN108200100012008014',
    rating: 4.4,
    tagline: 'Protect Your Biggest Investment',
    recommendedFor: ['home-owner', 'urban', 'high-income'],
    waitingPeriod: 'N/A',
    noClaimBonus: '5% discount per claim-free year up to 25%',
    taxBenefit: 'N/A - Home insurance',
    dataSource: 'IRDAI Annual Report 2024-25',
  },
  {
    id: 'home-002',
    name: 'Bajaj Allianz My Home',
    provider: 'Bajaj Allianz General Insurance',
    category: 'home',
    premium: { monthly: 100, annual: 1200, currency: 'INR' },
    sumInsured: { min: 300000, max: 30000000, currency: 'INR' },
    claimSettlementRatio: 97.04,
    solvencyRatio: 2.1,
    features: [
      'Comprehensive home protection',
      'Building + contents coverage',
      'Jewelry and valuables coverage',
      'Fire, flood, earthquake cover',
      'Theft and burglary',
      'Portable equipment coverage',
      'Personal liability',
      'Dog liability cover',
    ],
    exclusions: ['Gradual deterioration', 'Vermin/insect damage', 'War risk', 'Nuclear contamination'],
    eligibility: { minAge: 18, maxAge: 80, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN102200100012002016',
    rating: 4.2,
    tagline: 'Ghar Ki Suraksha, Humara Vaada',
    recommendedFor: ['home-owner', 'family', 'middle-income'],
    waitingPeriod: 'N/A',
    noClaimBonus: 'N/A',
    taxBenefit: 'N/A - Home insurance',
    dataSource: 'IRDAI Annual Report 2024-25',
  },
];

// ============================================================================
// ALL PLANS AGGREGATED
// ============================================================================
export const allInsurancePlans: InsurancePlan[] = [
  ...healthInsurancePlans,
  ...lifeInsurancePlans,
  ...motorInsurancePlans,
  ...travelInsurancePlans,
  ...homeInsurancePlans,
];

// ============================================================================
// CATEGORY METADATA
// ============================================================================
export interface CategoryInfo {
  id: InsuranceCategory;
  name: string;
  icon: string;
  color: string;
  description: string;
  avgClaimSettlementRatio: number;
  planCount: number;
  premiumRange: { min: number; max: number; frequency: string };
  keyFeatures: string[];
  bestFor: string;
}

export const categoryInfo: CategoryInfo[] = [
  {
    id: 'health',
    name: 'Health Insurance',
    icon: 'Heart',
    color: '#ef4444',
    description: 'Protect yourself and your family from rising medical costs. With medical inflation at 14% annually, health insurance is not optional — it\'s essential.',
    avgClaimSettlementRatio: 93.99,
    planCount: healthInsurancePlans.length,
    premiumRange: { min: 500, max: 600, frequency: 'monthly' },
    keyFeatures: ['CSR 88.34–99.91%', 'PED waiting 24–48 months', 'Complaints per 10k: 10.67–52.31'],
    bestFor: 'Individuals, Young Professionals, Nuclear Families',
  },
  {
    id: 'life',
    name: 'Life Insurance',
    icon: 'Shield',
    color: '#10b981',
    description: 'Secure your family\'s financial future with term plans offering ₹1 Crore+ cover starting at just ₹1,000/month. CSR 95.55–99.97% across top insurers.',
    avgClaimSettlementRatio: 98.25,
    planCount: lifeInsurancePlans.length,
    premiumRange: { min: 1000, max: 1350, frequency: 'monthly' },
    keyFeatures: ['₹1 Cr cover from ₹1,000/mo', 'CSR 95.55–99.97%', 'AUM up to ₹50 Lakh Cr (LIC)'],
    bestFor: 'Young earning members, Sole earners, Families',
  },
  {
    id: 'motor',
    name: 'Motor Insurance',
    icon: 'Car',
    color: '#f59e0b',
    description: 'Mandatory third-party and comprehensive coverage for your car. Comprehensive from ₹1,899/yr with CSR 91–99% across top insurers.',
    avgClaimSettlementRatio: 94.57,
    planCount: motorInsurancePlans.length,
    premiumRange: { min: 1899, max: 2200, frequency: 'yearly' },
    keyFeatures: ['Comprehensive from ₹1,899/yr', 'CSR 91–99%', 'Zero depreciation add-on'],
    bestFor: 'Car owners, New vehicle buyers',
  },
  {
    id: 'travel',
    name: 'Travel Insurance',
    icon: 'Plane',
    color: '#8b5cf6',
    description: 'Travel worry-free with coverage for medical emergencies, trip cancellation, and lost baggage — starting at just ₹449/trip.',
    avgClaimSettlementRatio: 94.90,
    planCount: travelInsurancePlans.length,
    premiumRange: { min: 449, max: 2499, frequency: 'per trip' },
    keyFeatures: ['Single trip from ₹449', 'Annual multi-trip from ₹2,299', 'Covid cover available'],
    bestFor: 'Travelers, Business travelers, Students abroad',
  },
  {
    id: 'home',
    name: 'Home Insurance',
    icon: 'Home',
    color: '#06b6d4',
    description: 'Protect your home and belongings against fire, theft, natural disasters, and more — starting at just ₹100/month.',
    avgClaimSettlementRatio: 93.26,
    planCount: homeInsurancePlans.length,
    premiumRange: { min: 100, max: 125, frequency: 'monthly' },
    keyFeatures: ['Structure + contents cover', 'Natural calamity coverage', 'From ₹100/month'],
    bestFor: 'Home owners, Property investors',
  },
];

// ============================================================================
// PREMIUM BREAKDOWN BY TYPE
// ============================================================================
export interface PremiumBreakdown {
  insuranceType: string;
  monthlyPremiumRange: string;
  keyFeatures: string;
  bestFor: string;
}

export const premiumBreakdowns: PremiumBreakdown[] = [
  { insuranceType: 'Health (Individual)', monthlyPremiumRange: '₹500–₹600', keyFeatures: 'CSR 88.34–99.91%, PED waiting 24–48 mo', bestFor: 'Individuals, Young Professionals' },
  { insuranceType: 'Health (Family Floater)', monthlyPremiumRange: '₹1,500–₹5,000', keyFeatures: 'Covers 4-5 members, shared sum insured', bestFor: 'Nuclear Families, Parents' },
  { insuranceType: 'Life (Term)', monthlyPremiumRange: '₹1,000–₹1,350', keyFeatures: '₹1 Cr cover, CSR 95.55–99.97%, low premium', bestFor: 'Young earning members' },
  { insuranceType: 'Motor (Comprehensive)', monthlyPremiumRange: '₹1,899–₹2,200/yr', keyFeatures: 'IDV based, CSR 91–99%', bestFor: 'Car owners' },
  { insuranceType: 'Travel (International)', monthlyPremiumRange: '₹449–₹2,499/trip', keyFeatures: 'Medical + trip cancellation coverage', bestFor: 'Travelers' },
];

// ============================================================================
// IRDAI PROHIBITED WORDS & COMPLIANCE
// ============================================================================
export const IRDAI_PROHIBITED_WORDS: string[] = [
  'guaranteed', 'assured', 'risk-free', 'sure', 'certain', 'promise',
  'warranty', 'best', 'number one', 'cheapest', 'free', 'no-risk',
  '100%', 'zero risk', "can't lose", 'foolproof', 'fail-safe',
  'bulletproof', 'ironclad', 'rock-solid', 'no-lose',
];

export const IRDAI_MANDATORY_DISCLAIMER =
  'For more details on risk factors, terms and conditions, please read the sales brochure/policy wording carefully before concluding a sale. Insurance is the subject matter of solicitation.';

export const IRDAI_TAX_DISCLAIMER =
  'Tax benefits are subject to changes in tax laws. Please consult your tax advisor for details.';

export const IRDAI_CLAIM_DISCLAIMER =
  'Claim settlement ratio is based on IRDAI Annual Report 2024-25 data. Past performance is not indicative of future results.';

export const IRDAI_SOLVENCY_DISCLAIMER =
  'Solvency ratio indicates the financial health of the insurer. IRDAI mandates a minimum solvency ratio of 1.5 for all insurers.';

// ============================================================================
// USER PROFILE TYPES FOR PERSONALIZATION
// ============================================================================
export interface UserProfile {
  age: number;
  income: string;
  pincode: string;
  medicalHistory: string[];
  lifestyle: string[];
  dependents: number | string;
  occupation: string;
  existingInsurance: string[];
  priority: string;
}

// ============================================================================
// ONBOARDING QUESTIONS
// ============================================================================
export interface OnboardingQuestion {
  id: string;
  question: string;
  type: 'number' | 'select' | 'multi-select' | 'text';
  placeholder?: string;
  options?: { label: string; value: string }[];
  required: boolean;
  category: string;
}

export const onboardingQuestions: OnboardingQuestion[] = [
  {
    id: 'age',
    question: 'What is your age?',
    type: 'number',
    placeholder: 'Enter your age',
    required: true,
    category: 'personal',
  },
  {
    id: 'income',
    question: 'What is your annual income?',
    type: 'select',
    options: [
      { label: 'Below ₹3 Lakhs', value: 'below-3l' },
      { label: '₹3-5 Lakhs', value: '3-5l' },
      { label: '₹5-10 Lakhs', value: '5-10l' },
      { label: '₹10-25 Lakhs', value: '10-25l' },
      { label: '₹25-50 Lakhs', value: '25-50l' },
      { label: 'Above ₹50 Lakhs', value: 'above-50l' },
    ],
    required: true,
    category: 'financial',
  },
  {
    id: 'pincode',
    question: 'What is your area pincode?',
    type: 'text',
    placeholder: 'e.g., 110001',
    required: true,
    category: 'personal',
  },
  {
    id: 'dependents',
    question: 'How many dependents do you have?',
    type: 'select',
    options: [
      { label: 'None', value: '0' },
      { label: '1-2', value: '1-2' },
      { label: '3-4', value: '3-4' },
      { label: '5+', value: '5+' },
    ],
    required: true,
    category: 'personal',
  },
  {
    id: 'occupation',
    question: 'What is your occupation?',
    type: 'select',
    options: [
      { label: 'Salaried - Private Sector', value: 'salaried-private' },
      { label: 'Salaried - Government', value: 'salaried-govt' },
      { label: 'Self-Employed', value: 'self-employed' },
      { label: 'Business Owner', value: 'business' },
      { label: 'Student', value: 'student' },
      { label: 'Homemaker', value: 'homemaker' },
      { label: 'Retired', value: 'retired' },
    ],
    required: true,
    category: 'financial',
  },
  {
    id: 'medicalHistory',
    question: 'Do you or your family members have any of these conditions?',
    type: 'multi-select',
    options: [
      { label: 'Diabetes', value: 'diabetes' },
      { label: 'Hypertension', value: 'hypertension' },
      { label: 'Heart Disease', value: 'heart-disease' },
      { label: 'Asthma', value: 'asthma' },
      { label: 'None', value: 'none' },
    ],
    required: true,
    category: 'health',
  },
  {
    id: 'lifestyle',
    question: 'Which of these apply to your lifestyle?',
    type: 'multi-select',
    options: [
      { label: 'Smoker', value: 'smoker' },
      { label: 'Alcohol Consumer', value: 'alcohol' },
      { label: 'Regular Exercise', value: 'exercise' },
      { label: 'Sedentary Work', value: 'sedentary' },
      { label: 'None of the above', value: 'none' },
    ],
    required: false,
    category: 'health',
  },
  {
    id: 'priority',
    question: 'What is your primary insurance priority?',
    type: 'select',
    options: [
      { label: 'Health Protection', value: 'health' },
      { label: 'Family Financial Security', value: 'protection' },
      { label: 'Tax Savings', value: 'savings' },
      { label: 'Investment + Insurance', value: 'investment' },
      { label: 'Vehicle Protection', value: 'motor' },
    ],
    required: true,
    category: 'preference',
  },
  {
    id: 'existingInsurance',
    question: 'Do you already have any insurance?',
    type: 'multi-select',
    options: [
      { label: 'Health Insurance', value: 'health' },
      { label: 'Life Insurance', value: 'life' },
      { label: 'Motor Insurance', value: 'motor' },
      { label: 'None', value: 'none' },
    ],
    required: false,
    category: 'preference',
  },
];

// ============================================================================
// RAG KNOWLEDGE BASE - Insurance Concepts & FAQs
// ============================================================================
export interface KnowledgeEntry {
  id: string;
  topic: string;
  question: string;
  answer: string;
  category: InsuranceCategory | 'general';
  tags: string[];
}

export const knowledgeBase: KnowledgeEntry[] = [
  {
    id: 'kb-001',
    topic: 'What is Health Insurance?',
    question: 'What is health insurance and why do I need it?',
    answer: 'Health insurance is a contract where the insurer pays for your medical expenses in exchange for a premium. In India, with medical inflation at 14% annually, a single hospitalization can cost ₹2-5 Lakhs. Health insurance protects your savings and ensures access to quality healthcare without financial stress.',
    category: 'health',
    tags: ['basics', 'health', 'why-needed'],
  },
  {
    id: 'kb-002',
    topic: 'What is Cashless Treatment?',
    question: 'What does cashless treatment mean?',
    answer: 'Cashless treatment means you don\'t need to pay the hospital bill upfront. The insurance company settles the bill directly with the hospital at network hospitals. ACKO, Niva Bupa, and HDFC ERGO have 8,000-10,000+ network hospitals. Always check if your preferred hospital is in the network before buying.',
    category: 'health',
    tags: ['cashless', 'network', 'claims'],
  },
  {
    id: 'kb-003',
    topic: 'What is Claim Settlement Ratio?',
    question: 'What is Claim Settlement Ratio (CSR) and why does it matter?',
    answer: 'Claim Settlement Ratio (CSR) is the percentage of claims an insurer settles out of the total claims received. Based on IRDAI Annual Report 2024-25: ACKO leads with 99.98% CSR in health, while PNB MetLife and Axis Max Life lead with 99.50-99.51% in life insurance. Look for insurers with CSR above 90% for health and 97% for life insurance.',
    category: 'general',
    tags: ['csr', 'claims', 'reliability'],
  },
  {
    id: 'kb-004',
    topic: 'What is Incurred Claim Ratio?',
    question: 'What is Incurred Claim Ratio (ICR) and how is it different from CSR?',
    answer: 'Incurred Claim Ratio (ICR) is the ratio of total claims paid to total premiums collected. An ICR of 85% means the insurer pays ₹85 in claims for every ₹100 collected as premium. ICR below 100% means the insurer is profitable; above 100% means they\'re paying more than collecting. ACKO has an ICR of 90.39% in health, indicating a healthy balance between claims and premiums.',
    category: 'general',
    tags: ['icr', 'claims', 'financial-health', 'ratio'],
  },
  {
    id: 'kb-005',
    topic: 'What is Solvency Ratio?',
    question: 'What is solvency ratio and why should I check it?',
    answer: 'Solvency ratio measures an insurer\'s ability to meet its long-term debt obligations and claims. IRDAI mandates a minimum solvency ratio of 1.5 for all insurers. Higher is better — Axis Max Life has 2.25, ICICI Prudential has 2.30, and ACKO has 2.2. A solvency ratio above 1.8 indicates strong financial health.',
    category: 'general',
    tags: ['solvency', 'financial-health', 'regulation'],
  },
  {
    id: 'kb-006',
    topic: 'What is Term Insurance?',
    question: 'What is term insurance and how is it different?',
    answer: 'Term insurance is the purest form of life insurance. You pay a small premium for a large cover (sum assured). If something happens during the policy term, your family receives the full amount. A 30-year-old can get ₹1 Crore cover for just ₹800-1,200/month. PNB MetLife offers ₹1 Cr from ₹1,057/month with 99.50% CSR and 0.5-day claim turnaround.',
    category: 'life',
    tags: ['term', 'life', 'basics', 'affordable'],
  },
  {
    id: 'kb-007',
    topic: 'What is No Claim Bonus?',
    question: 'What is No Claim Bonus (NCB) in insurance?',
    answer: 'No Claim Bonus is a reward for not making claims during the policy year. In health insurance, it typically increases your sum insured by 10-100% per claim-free year. In motor insurance, it gives a discount on renewal premium, up to 50% after 5 claim-free years. NCB transfers when you switch insurers.',
    category: 'general',
    tags: ['ncb', 'bonus', 'savings'],
  },
  {
    id: 'kb-008',
    topic: 'Waiting Period in Health Insurance',
    question: 'What is the waiting period in health insurance?',
    answer: 'Waiting period is the time you must wait before certain coverage kicks in: (1) Initial waiting period: 30 days from policy start, (2) Pre-existing diseases: 24-36 months for conditions you already have, (3) Specific diseases: 1-2 years for conditions like hernia, cataract. Most top plans like ACKO, HDFC ERGO, and Care Health have 24-month PED waiting. Star Health and ManipalCigna have 36-month PED waiting.',
    category: 'health',
    tags: ['waiting-period', 'health', 'terms'],
  },
  {
    id: 'kb-009',
    topic: 'Section 80D Tax Benefits',
    question: 'How much tax can I save with health insurance?',
    answer: 'Under Section 80D: (1) Self & family: Up to ₹25,000 deduction, (2) Parents: Additional ₹25,000 (₹50,000 if senior citizens), (3) Preventive health check-up: Up to ₹5,000, (4) Total maximum: ₹75,000 (self + senior citizen parents). For life insurance, Section 80C allows up to ₹1.5 Lakhs deduction.',
    category: 'general',
    tags: ['tax', '80d', '80c', 'savings', 'health'],
  },
  {
    id: 'kb-010',
    topic: 'What is Third-Party Motor Insurance?',
    question: 'Is third-party motor insurance mandatory?',
    answer: 'Yes! Under the Motor Vehicles Act 1988, third-party insurance is legally mandatory for all vehicles. It covers: (1) Death/bodily injury to third parties (unlimited liability), (2) Third-party property damage (up to ₹7.5 Lakhs), (3) Personal accident cover for owner-driver. ACKO offers comprehensive coverage starting at ₹2,200/year with 99.98% CSR.',
    category: 'motor',
    tags: ['motor', 'mandatory', 'third-party', 'legal'],
  },
  {
    id: 'kb-011',
    topic: 'What is Zero Depreciation Cover?',
    question: 'Should I buy zero depreciation add-on for motor insurance?',
    answer: 'Zero depreciation (bumper-to-bumper) cover means the insurer pays the full claim without deducting depreciation on parts. Without it, you bear 30-50% of plastic/fiber costs. It costs 15-20% extra premium but is recommended for: (1) New cars (less than 3 years), (2) Luxury vehicles, (3) Inexperienced drivers. Available as add-on with ACKO and HDFC ERGO.',
    category: 'motor',
    tags: ['zero-dep', 'motor', 'add-on', 'depreciation'],
  },
  {
    id: 'kb-012',
    topic: 'IRDAI and Insurance Regulation',
    question: 'What is IRDAI and how does it protect policyholders?',
    answer: 'IRDAI (Insurance Regulatory and Development Authority of India) is the apex body regulating insurance. It protects policyholders by: (1) Setting solvency margins (min 1.5), (2) Publishing CSR and ICR data annually, (3) Mandating standard policy wordings, (4) Running IGMS for grievance redressal, (5) Requiring guaranteed surrender values. Always buy from IRDAI-registered insurers only.',
    category: 'general',
    tags: ['irdai', 'regulation', 'protection', 'rights'],
  },
  {
    id: 'kb-013',
    topic: 'What is Claim Turnaround Time?',
    question: 'How quickly do insurers settle claims?',
    answer: 'Claim Turnaround Time (TAT) measures how fast an insurer processes claims. Based on IRDAI Life Insurance CSR Report 2025-26: Axis Max Life settles in 0.4 days, PNB MetLife in 0.5 days, HDFC Life in 0.6 days. For health insurance, ACKO offers same-day digital claim settlement. Faster TAT = less stress during emergencies.',
    category: 'general',
    tags: ['turnaround', 'claims', 'speed', 'tat'],
  },
  {
    id: 'kb-014',
    topic: 'Family Floater vs Individual Plan',
    question: 'Should I buy a family floater or individual health plan?',
    answer: 'Family floater covers the entire family under one sum insured (shared). Individual plans give each member separate cover. Choose family floater if: (1) Young family with low medical risk, (2) Want to save on premiums, (3) Family size 3-5. Choose individual if: (1) Senior citizen parents, (2) Members with chronic conditions, (3) Want dedicated coverage. Most top plans (ACKO, HDFC ERGO, Care Health) offer both options.',
    category: 'health',
    tags: ['family-floater', 'individual', 'health', 'comparison'],
  },
  {
    id: 'kb-015',
    topic: 'What Riders Are Available in Life Insurance?',
    question: 'What are riders and which ones should I add?',
    answer: 'Riders are optional add-ons to your base life insurance policy: (1) Critical Illness: Lump sum on diagnosis of 40+ conditions, (2) Accidental Death: Additional payout on accidental death, (3) Waiver of Premium: Future premiums waived on disability/critical illness, (4) Income Benefit: Monthly income for family for 10-15 years. PNB MetLife, HDFC Life, and Axis Max Life offer all four riders. Cost: typically 10-25% extra on base premium.',
    category: 'life',
    tags: ['riders', 'life', 'add-on', 'critical-illness'],
  },
  {
    id: 'kb-016',
    topic: 'Porting Your Health Insurance',
    question: 'Can I switch my health insurance to another company?',
    answer: 'Yes! IRDAI allows health insurance portability. You can switch insurers while: (1) Retaining your waiting period credits, (2) Keeping cumulative bonus benefits, (3) Applying at least 45 days before renewal. The new insurer cannot reject portability based on claims history. Port within the same sum insured range for maximum benefit continuity.',
    category: 'health',
    tags: ['portability', 'switch', 'health', 'rights'],
  },
];

// ============================================================================
// GAME OF LIFE SCENARIOS
// ============================================================================
export interface LifeScenario {
  id: string;
  age: number;
  title: string;
  description: string;
  event: string;
  costWithoutInsurance: number;
  costWithInsurance: number;
  emotion: string;
}

export const gameOfLifeScenarios: LifeScenario[] = [
  {
    id: 'gol-001',
    age: 25,
    title: 'First Job, First Emergency',
    description: 'You just started your career and suddenly need an emergency appendix surgery.',
    event: 'Appendectomy',
    costWithoutInsurance: 150000,
    costWithInsurance: 5000,
    emotion: '😰',
  },
  {
    id: 'gol-002',
    age: 28,
    title: 'Newlywed Nightmare',
    description: 'Your spouse is diagnosed with dengue during monsoon season.',
    event: 'Dengue Hospitalization',
    costWithoutInsurance: 80000,
    costWithInsurance: 2000,
    emotion: '😨',
  },
  {
    id: 'gol-003',
    age: 32,
    title: 'The Big Purchase',
    description: 'You bought your dream car, and it gets damaged in a flood.',
    event: 'Car Flood Damage',
    costWithoutInsurance: 200000,
    costWithInsurance: 3000,
    emotion: '😱',
  },
  {
    id: 'gol-004',
    age: 35,
    title: 'Growing Family, Growing Worries',
    description: 'Your child needs a tonsillectomy surgery.',
    event: 'Child Surgery',
    costWithoutInsurance: 120000,
    costWithInsurance: 3000,
    emotion: '😢',
  },
  {
    id: 'gol-005',
    age: 40,
    title: 'Mid-Life Health Scare',
    description: 'Routine check-up reveals early-stage diabetes needing treatment.',
    event: 'Diabetes Diagnosis & Treatment',
    costWithoutInsurance: 300000,
    costWithInsurance: 10000,
    emotion: '😧',
  },
  {
    id: 'gol-006',
    age: 45,
    title: 'The Unexpected Fall',
    description: 'A parent falls and fractures their hip, needing surgery.',
    event: 'Parent Hip Surgery',
    costWithoutInsurance: 400000,
    costWithInsurance: 15000,
    emotion: '😟',
  },
  {
    id: 'gol-007',
    age: 50,
    title: 'Heart of the Matter',
    description: 'A cardiac emergency strikes — angioplasty is needed.',
    event: 'Heart Angioplasty',
    costWithoutInsurance: 500000,
    costWithInsurance: 20000,
    emotion: '😱',
  },
  {
    id: 'gol-008',
    age: 55,
    title: 'The Silver Tsunami',
    description: 'Critical illness diagnosed — cancer treatment begins.',
    event: 'Cancer Treatment',
    costWithoutInsurance: 1500000,
    costWithInsurance: 50000,
    emotion: '😨',
  },
];

// ============================================================================
// POLICY GLOSSARY - 40+ Terms with Hinglish Explanations
// ============================================================================
export interface GlossaryTerm {
  term: string;
  hindiTerm?: string;
  explanation: string;
  example: string;
  category: 'health' | 'life' | 'motor' | 'general';
}

export const policyGlossary: GlossaryTerm[] = [
  {
    term: 'CSR (Claim Settlement Ratio)',
    hindiTerm: 'क्लेम सेटलमेंट रेश्यो',
    explanation: 'CSR matlab kitne percent claims insurance company ne approve kiye. Jaise agar 100 claims aaye aur 97 settle hue, toh CSR 97% hoga. Jitna zyada CSR, utna reliable company.',
    example: 'PNB MetLife ka CSR 99.50% hai — matlab 1000 mein se 995 claims settle hote hain. Yeh trust dilaata hai.',
    category: 'general',
  },
  {
    term: 'PED (Pre-Existing Disease)',
    hindiTerm: 'पहले से मौजूद बीमारी',
    explanation: 'PED woh beemari hai jo policy leney se pehle se aapke mein maujood thi — jaise diabetes, blood pressure. Inka cover waiting period ke baad hi milta hai.',
    example: 'Agar aapko policy lene se 2 saal pehle diabetes thi, toh uska cover 24-36 mahine ke waiting period ke baad milega.',
    category: 'health',
  },
  {
    term: 'Waiting Period',
    hindiTerm: 'इंतज़ार की अवधि',
    explanation: 'Waiting period woh samay hai jab aapko policy ki poori benefits nahi milti. Initial 30 din, PED ke liye 24-36 mahine, aur kuch specific diseases ke liye 1-2 saal.',
    example: 'Aaj policy li, toh pehle 30 din koi claim nahi hoga (emergency ke alawa). PED ka cover 2-3 saal baad shuru hoga.',
    category: 'health',
  },
  {
    term: 'Deductible',
    hindiTerm: 'डिडक्टिबल (अपनी जेब से)',
    explanation: 'Deductible woh amount hai jo claim karne par aapko khud pay karna padta hai, baaki insurance company deti hai. Yeh premium kam karne mein help karta hai.',
    example: 'Agar deductible ₹5,000 hai aur bill ₹50,000 ka aaya, toh aap ₹5,000 denge aur company ₹45,000 degi.',
    category: 'general',
  },
  {
    term: 'Sum Insured',
    hindiTerm: 'बीमा राशि',
    explanation: 'Sum Insured woh maximum amount hai jo insurance company ek claim par pay kar sakti hai. Yeh aapka coverage limit hai — isse zyada ka bill aapko khud bharna padega.',
    example: 'Agar Sum Insured ₹5 Lakh hai aur hospital bill ₹6 Lakh ka aaya, toh ₹5 Lakh company degi aur ₹1 Lakh aap denge.',
    category: 'health',
  },
  {
    term: 'Premium',
    hindiTerm: 'प्रीमियम (प्रीमियम राशि)',
    explanation: 'Premium woh fixed amount hai jo aapko insurance cover ke liye regularly pay karna hota hai — monthly, quarterly, ya annually. Iske badle company aapko risk se protect karti hai.',
    example: 'ACKO Health Plan ka monthly premium ₹475 hai — yani ₹475/month dekar aapko ₹5 Lakh tak ka health cover milta hai.',
    category: 'general',
  },
  {
    term: 'Co-payment',
    hindiTerm: 'को-पेमेंट (साझा भुगतान)',
    explanation: 'Co-payment mein aapko har bill ka ek fixed percentage khud pay karna padta hai. Yeh usually 10-20% hota hai. Premium kam hota hai lekin har claim mein aapka hissa aata hai.',
    example: 'Agar 20% co-pay hai aur bill ₹1 Lakh ka hai, toh aap ₹20,000 denge aur company ₹80,000 degi.',
    category: 'health',
  },
  {
    term: 'Network Hospital',
    hindiTerm: 'नेटवर्क अस्पताल',
    explanation: 'Network hospitals woh hospitals hain jo insurance company se tied-up hain. Inmein cashless treatment milti hai — aapko bill pay nahi karna padta, company directly settle karti hai.',
    example: 'ACKO ke 8,000+ network hospitals hain. Agar aap inmein kisi mein admit hue, toh bill directly ACKO pay karega.',
    category: 'health',
  },
  {
    term: 'Cashless Claim',
    hindiTerm: 'कैशलेस क्लेम',
    explanation: 'Cashless claim mein aapko hospital mein paisa pay nahi karna padta. Insurance company directly hospital ko pay karti hai. Sirf network hospitals mein yeh facility milti hai.',
    example: 'Aap network hospital mein admit hue — ₹3 Lakh ka bill aaya. Aapne kuch nahi pay kiya, company ne directly settle kiya.',
    category: 'health',
  },
  {
    term: 'Rider',
    hindiTerm: 'राइडर (अतिरिक्त लाभ)',
    explanation: 'Rider ek add-on benefit hai jo aap apni base policy mein extra premium dekar jod sakte hain — jaise Critical Illness, Accidental Death, Waiver of Premium.',
    example: 'Aapne term plan li ₹1,000/month mein. Critical Illness rider add kiya +₹200/month. Ab aapko critical illness diagnosis par additional ₹10 Lakh milega.',
    category: 'life',
  },
  {
    term: 'No Claim Bonus (NCB)',
    hindiTerm: 'नो क्लेम बोनस',
    explanation: 'Jab aap saal bhar koi claim nahi karte, toh company aapko reward deti hai. Health mein sum insured badhta hai, motor mein premium kam hota hai.',
    example: 'Motor insurance mein 5 saal tak claim nahi kiya = 50% discount on renewal premium. Health mein 10-100% sum insured badh jaata hai.',
    category: 'general',
  },
  {
    term: 'IDV (Insured Declared Value)',
    hindiTerm: 'आईडीवी (गाड़ी का बीमा मूल्य)',
    explanation: 'IDV aapki gaadi ki current market value hai — yahi woh maximum amount hai jo theft ya total loss mein company pay karegi. Har saal depreciation ke saath IDV kam hota hai.',
    example: 'Nayi gaadi ₹10 Lakh ki — IDV ₹8.5 Lakh (85%). Agar gaadi chori ho gayi, toh ₹8.5 Lakh mileage.',
    category: 'motor',
  },
  {
    term: 'Third Party Insurance',
    hindiTerm: 'थर्ड पार्टी बीमा',
    explanation: 'Third party insurance woh hai jo dusre ko hui nuksan ko cover karta hai — legally mandatory hai. Isme aapki gaadi ka nuksan cover nahi hota, sirf dusron ka nuksan cover hota hai.',
    example: 'Aapki gaadi se kisi ki gaadi takkar gayi — dusre ki repair cost third party insurance dega. Aapki gaadi ka nuksan nahi milega.',
    category: 'motor',
  },
  {
    term: 'Comprehensive Insurance',
    hindiTerm: 'कॉम्प्रिहेंसिव बीमा (पूर्ण बीमा)',
    explanation: 'Comprehensive insurance mein third party + aapki gaadi ka nuksan dono covered hota hai. Yeh zyada expensive hai lekin complete protection deta hai.',
    example: 'Flood mein gaadi kharab hui — comprehensive insurance repair cost dega. Third party mein yeh nahi milta.',
    category: 'motor',
  },
  {
    term: 'Endorsement',
    hindiTerm: 'एंडोर्समेंट (पॉलिसी में बदलाव)',
    explanation: 'Endorsement woh hai jab aap apni policy mein koi change karwate hain — naam, address, coverage change, ya koi add-on jodna. Company ka approval chahiye hota hai.',
    example: 'Shaadi ke baad spouse ka naam policy mein add karwana = endorsement. Car ka color change karwana bhi endorsement hai.',
    category: 'general',
  },
  {
    term: 'Grace Period',
    hindiTerm: 'ग्रेस पीरियड (अतिरिक्त समय)',
    explanation: 'Grace period woh extra time hai jo aapko premium pay karne ke liye milta hai after due date — usually 15-30 din. Iske andar pay karo toh policy lapse nahi hoti.',
    example: 'Premium due date 5 March hai. 15 din grace period hai. Agar 20 March tak pay kiya, toh policy continue rahegi.',
    category: 'general',
  },
  {
    term: 'Free Look Period',
    hindiTerm: 'फ्री लुक पीरियड (समीक्षा अवधि)',
    explanation: 'Free look period mein aap policy ko padh ke pasand nahi aaye toh cancel kar sakte hain bina penalty ke — 15 din (offline) ya 30 din (online). Premium refund hota hai deductibles ke baad.',
    example: 'Online policy li, 20 din baad terms pasand nahi aaye. Free look mein cancel kiya — premium wapas mil gaya (medical test charges kata).',
    category: 'general',
  },
  {
    term: 'Portability',
    hindiTerm: 'पोर्टेबिलिटी (कंपनी बदलना)',
    explanation: 'Portability ka matlab hai aap apni health insurance dusri company mein shift kar sakte hain bina waiting period ke benefits khoiye. At least 45 din pehle apply karna padta hai.',
    example: 'Aapki 2 saal purani policy hai — PED waiting 24 mahine mein se 24 ho chuke. Ab port kiya — naye company mein bhi PED cover turant milega.',
    category: 'health',
  },
  {
    term: 'Sub-limit',
    hindiTerm: 'सब-लिमिट (उप-सीमा)',
    explanation: 'Sub-limit woh restriction hai jismein sum insured ke andar bhi kuch services par max limit hoti hai — jaise room rent par ₹5,000/day ki limit.',
    example: 'Sum Insured ₹5 Lakh hai lekin room rent limit ₹5,000/day hai. Agar ₹10,000/day ka room liya, toh ₹5,000 aapko dena padega.',
    category: 'health',
  },
  {
    term: 'Room Rent Limit',
    hindiTerm: 'रूम रेंट लिमिट',
    explanation: 'Room rent limit woh maximum amount hai jo hospital room ke liye company pay karegi. Kuch plans mein koi limit nahi hoti, kuch mein 1-2% of sum insured hoti hai.',
    example: 'ACKO mein no room rent limit — koi bhi room lein. Star Health mein single room limit hai — deluxe room ka extra paisa aapko dena padega.',
    category: 'health',
  },
  {
    term: 'Restoration',
    hindiTerm: 'रिस्टोरेशन (कवर वापस)',
    explanation: 'Restoration benefit mein agar saal mein sum insured khatam ho gaya, toh company use refill kar deti hai — 100% ya unlimited. Same illness ke liye nahi, alag illness ke liye milta hai.',
    example: '₹5 Lakh ka plan liya. Pehle claim mein ₹5 Lakh use ho gaye. Restoration se phir ₹5 Lakh mil gaye dusri illness ke liye.',
    category: 'health',
  },
  {
    term: 'Family Floater',
    hindiTerm: 'फैमिली फ्लोटर',
    explanation: 'Family floater mein ek hi policy mein poore family ko cover kiya jaata hai — sum insured sab shared karte hain. Individual plan se sasta padta hai.',
    example: '₹10 Lakh family floater liya — pati, patni, 2 bacche sab covered. Koi bhi member ₹10 Lakh tak claim kar sakta hai.',
    category: 'health',
  },
  {
    term: 'Critical Illness Cover',
    hindiTerm: 'क्रिटिकल इलनेस कवर',
    explanation: 'Critical Illness cover mein agar aapko listed serious beemari (cancer, heart attack, stroke) diagnosis hoti hai, toh lump sum amount milta hai — hospitalization ki zaroorat nahi.',
    example: 'Aapko cancer diagnose hua — ₹10 Lakh lump sum mil gaya. Yeh amount treatment ke liye bhi use kar sakte hain ya kisi bhi zaroorat ke liye.',
    category: 'life',
  },
  {
    term: 'Term Plan',
    hindiTerm: 'टर्म प्लान',
    explanation: 'Term plan sabse sasta life insurance hai — chhota premium, bada cover. Agar policy ke dauran death ho gayi toh family ko lump sum milta hai. Koi maturity benefit nahi.',
    example: '₹1,057/month dekar ₹1 Crore ka term plan liya. 30 saal tak yeh cover rahega. Agar kuch hua toh family ko ₹1 Crore milega.',
    category: 'life',
  },
  {
    term: 'Endowment Plan',
    hindiTerm: 'एंडोमेंट प्लान',
    explanation: 'Endowment plan mein insurance + savings dono hote hain. Agar policy term mein death ho gayi toh sum assured + bonus milta hai. Agar zinda rahe toh maturity par sum assured + bonus milta hai.',
    example: '₹5 Lakh ka endowment plan liya 20 saal ke liye. Zinda rahe toh ₹5 Lakh + bonus milega. Death ho gayi toh bhi ₹5 Lakh + bonus family ko milega.',
    category: 'life',
  },
  {
    term: 'ULIP (Unit Linked Insurance Plan)',
    hindiTerm: 'यूलिप',
    explanation: 'ULIP mein insurance + investment dono hote hain. Premium ka ek part insurance ke liye jaata hai, baaki stock/debt market mein invest hota hai. Returns market par depend karta hai.',
    example: '₹50,000/year premium — ₹10,000 insurance ke liye, ₹40,000 market mein invest. 10 saal baad fund value market performance ke hisaab se milegi.',
    category: 'life',
  },
  {
    term: 'Money Back Policy',
    hindiTerm: 'मनी बैक पॉलिसी',
    explanation: 'Money Back policy mein policy term ke dauran regular intervals par aapko kuch percent amount wapas milta hai. Baaki balance maturity par milta hai.',
    example: '₹10 Lakh ki 20 saal ki policy — har 5 saal mein ₹2 Lakh milenge. 20 saal baad baki ₹4 Lakh + bonus milega.',
    category: 'life',
  },
  {
    term: 'Maturity Benefit',
    hindiTerm: 'मैच्योरिटी बेनिफिट',
    explanation: 'Maturity benefit woh amount hai jo policy term complete hone par aapko milta hai — endowment, money back, ULIP mein. Term plan mein maturity benefit nahi hota (unless return of premium option).',
    example: '20 saal ki endowment policy complete hui — ₹5 Lakh sum assured + ₹2 Lakh bonus = ₹7 Lakh maturity benefit mila.',
    category: 'life',
  },
  {
    term: 'Death Benefit',
    hindiTerm: 'डेथ बेनिफिट',
    explanation: 'Death benefit woh amount hai jo policyholder ki death par nominee/family ko milta hai. Yeh sum assured + bonus (agar hai) hota hai.',
    example: '₹1 Crore ka term plan tha. Policyholder ki death ho gayi — family ko ₹1 Crore death benefit mila.',
    category: 'life',
  },
  {
    term: 'Surrender Value',
    hindiTerm: 'सरेंडर वैल्यू',
    explanation: 'Surrender value woh amount hai jo policy beech mein break karne par milta hai. Minimum 3 saal premium pay karne ke baad hi surrender value milti hai. Bahut kam amount milta hai.',
    example: '₹5 Lakh ki policy 5 saal chalayi. Surrender kiya — sirf ₹1.5 Lakh mila. Isliye policy beech mein break karna loss hai.',
    category: 'life',
  },
  {
    term: 'Paid-up Value',
    hindiTerm: 'पेड-अप वैल्यू',
    explanation: 'Agar aap premium pay karna band kar dete hain lekin policy surrender nahi karte, toh policy paid-up ho jaati hai. Reduced cover milta hai — originally liye hue sum insured se kam.',
    example: '₹10 Lakh ki policy 5 saal premium pay kiya, phir band kiya. Paid-up value ₹3 Lakh hui — ab yahi reduced cover rahega.',
    category: 'life',
  },
  {
    term: 'Annuity',
    hindiTerm: 'एन्युिटी (वार्षिक आय)',
    explanation: 'Annuity mein aap ek lump sum invest karte hain aur uske badle aapko regular monthly/quarterly income milti hai — usually retirement ke baad. Pension plan ka base yahi hai.',
    example: 'Retirement par ₹50 Lakh invest kiya annuity mein — ab har mahine ₹25,000 pension mil rahi hai zindagi bhar.',
    category: 'life',
  },
  {
    term: 'IRDAI',
    hindiTerm: 'आईआरडीएआई',
    explanation: 'IRDAI (Insurance Regulatory and Development Authority of India) woh sarkari body hai jo insurance companies ko regulate karti hai — policyholders ki protection, rules banana, complaints sunna.',
    example: 'IRDAI ne rule banaya ki sab insurance companies ka solvency ratio 1.5 se zyada hona chahiye — taaki claims pay ho sakein.',
    category: 'general',
  },
  {
    term: 'TPA (Third Party Administrator)',
    hindiTerm: 'टीपीए (थर्ड पार्टी एडमिनिस्ट्रेटर)',
    explanation: 'TPA woh intermediate body hai jo insurance company aur hospital ke beech mein kaam karti hai — cashless claims process karna, pre-authorization lena, bills verify karna.',
    example: 'Aap hospital mein admit hue. Hospital ne TPA ko pre-auth request bheja. TPA ne approve kiya. Cashless treatment shuru hui.',
    category: 'health',
  },
  {
    term: 'Pre-authorization',
    hindiTerm: 'प्री-ऑथराइज़ेशन',
    explanation: 'Cashless treatment se pehle hospital ko insurance company/TPA se approval lena padta hai — isko pre-authorization kehte hain. Emergency mein 24 ghante ke andar bhi le sakte hain.',
    example: 'Surgery planned hai. Hospital ne 3 din pehle pre-auth bheja. Company ne approve kiya. Ab cashless surgery ho payegi.',
    category: 'health',
  },
  {
    term: 'Domiciliary Treatment',
    hindiTerm: 'डोमिसाइलरी ट्रीटमेंट (घर पर इलाज)',
    explanation: 'Domiciliary treatment woh hai jismein patient hospital mein admit nahi hota lekin ghar par treatment chal raha hota hai — doctor condition mein hospital nahi ja sakte. Yeh bhi cover hota hai kuch plans mein.',
    example: 'Dada ji itne weak hain ki hospital le jaana possible nahi. Ghar par nurse + doctor treatment kar rahe hain — yeh domiciliary claim hoga.',
    category: 'health',
  },
  {
    term: 'Day Care Procedure',
    hindiTerm: 'डे केयर प्रोसीजर',
    explanation: 'Day care procedures woh hain jismein 24 ghante se kam hospital stay hota hai — jaise cataract surgery, piles surgery. Ab IRDAI ne 500+ day care procedures cover karne mandatory kiya hai.',
    example: 'Cataract surgery — subah gaye, dopahar mein wapas aaye. Yeh day care procedure hai, pura cover hoga.',
    category: 'health',
  },
  {
    term: 'AYUSH Treatment',
    hindiTerm: 'आयुष उपचार',
    explanation: 'AYUSH ka matlab Ayurveda, Yoga, Unani, Siddha, aur Homeopathy. IRDAI ne mandate kiya hai ki sabhi health plans mein AYUSH treatments cover hona chahiye.',
    example: 'Aapko Ayurvedic treatment chahiye — yeh bhi insurance se cover hoga, lekin sirf government-recognized hospital mein.',
    category: 'health',
  },
  {
    term: 'Maternity Cover',
    hindiTerm: 'मैटरनिटी कवर',
    explanation: 'Maternity cover mein pregnancy aur delivery ke expenses cover hote hain — normal delivery, C-section, aur newborn baby care. Usually waiting period 9-36 mahine hoti hai.',
    example: 'Policy lene ke 2 saal baad pregnancy hui — delivery ka ₹50,000-1,50,000 bill insurance se cover hoga.',
    category: 'health',
  },
  {
    term: 'Exclusion',
    hindiTerm: 'एक्सक्लूज़न (छूट हुई चीज़ें)',
    explanation: 'Exclusions woh conditions ya treatments hain jo policy mein cover nahi hote — jaise cosmetic surgery, dental (basic), self-inflicted injuries. Yeh policy document mein clearly listed hote hain.',
    example: 'Aapne teeth whitening karwaya — yeh cosmetic/dental procedure hai, insurance cover nahi karega.',
    category: 'general',
  },
  {
    term: 'Indemnity Plan',
    hindiTerm: 'इंडेम्निटी प्लान',
    explanation: 'Indemnity plan mein actual hospital bill ka payment hota hai — jitna bill, utna cover (sum insured ke andar). Fixed benefit plan mein diagnosis par fixed amount milta hai, bill se independent.',
    example: 'Hospital bill ₹3 Lakh aaya, sum insured ₹5 Lakh — indemnity plan mein ₹3 Lakh milega. Fixed benefit mein ₹5 Lakh milta.',
    category: 'health',
  },
  {
    term: 'Top-up Plan',
    hindiTerm: 'टॉप-अप प्लान',
    explanation: 'Top-up plan ek extra cover hai jo aapki existing policy ke upar lagta hai. Jab bills ek certain threshold (deductible) cross karti hain, tab yeh activate hota hai. Bahut kam premium mein zyada cover.',
    example: 'Base policy ₹5 Lakh hai. ₹5 Lakh deductible wala top-up liya ₹15 Lakh ka. Total cover = ₹20 Lakh, sasta mein.',
    category: 'health',
  },
  {
    term: 'Super Top-up Plan',
    hindiTerm: 'सुपर टॉप-अप प्लान',
    explanation: 'Super top-up bhi top-up jaisa hai, lekin ismein saal bhar ki TOTAL bills deductible cross karti hain — ek bill nahi. Yeh top-up se better hai kyunki multiple claims combine hote hain.',
    example: '₹5 Lakh deductible hai. Pehla bill ₹3 Lakh, dusra bill ₹4 Lakh — total ₹7 Lakh. Super top-up ₹2 Lakh dega (7-5). Normal top-up mein kuch nahi milta.',
    category: 'health',
  },
  {
    term: 'Personal Accident Cover',
    hindiTerm: 'पर्सनल एक्सीडेंट कवर',
    explanation: 'Personal accident cover mein accident ki wajah se death, disability, ya injury par lump sum amount milta hai — 24-hour coverage, duniya mein kahin bhi.',
    example: 'Accident mein leg fracture hua — personal accident cover se ₹5 Lakh mila. Separate health insurance se hospital bill bhi cover hua.',
    category: 'general',
  },
  {
    term: 'Key Person Insurance',
    hindiTerm: 'की पर्सन इंश्योरेंस',
    explanation: 'Business mein sabse important vyakti (key person) ke liye insurance — agar kuch ho jaaye toh business ko financial support milta hai. Company premium pay karti hai, company beneficiary hoti hai.',
    example: 'Startup ka founder insure kiya ₹2 Crore ka. Agar founder ko kuch ho gaya toh company ko ₹2 Crore milenge — business chalane mein help.',
    category: 'life',
  },
];

// ============================================================================
// BIMA KI ABCD - Blog/Article Section Data
// ============================================================================
export interface BlogArticle {
  id: string;
  title: string;
  titleHi: string;
  category: 'health' | 'life' | 'motor' | 'travel' | 'home' | 'general';
  summary: string;
  readTime: string;
  keyPoints: string[];
}

export const blogArticles: BlogArticle[] = [
  {
    id: 'blog-001',
    title: 'What is Term Insurance and Why is it Essential?',
    titleHi: 'Term insurance kya hota hai? Isse kyun jaroori hai?',
    category: 'life',
    summary: 'Term insurance sabse sasta aur sabse zaroori life insurance hai. Chhote premium mein bada cover — lekin log isko ignore kyun karte hain? Samjhiye term plan ki basics aur iski zaroorat.',
    readTime: '5 min',
    keyPoints: [
      'Term plan = pure protection, no investment component',
      '₹1 Crore cover starting ₹800/month for 30-year-old',
      'CSR 97-99.5% across top insurers',
      'Return of Premium option available at extra cost',
      'Tax benefit under Section 80C up to ₹1.5 Lakh',
    ],
  },
  {
    id: 'blog-002',
    title: 'How to File a Health Insurance Claim: Step-by-Step Guide',
    titleHi: 'Health insurance claim kaise karein? Step-by-step guide.',
    category: 'health',
    summary: 'Health insurance claim karna complicated lagta hai, lekin nahi hai. Cashless aur reimbursement — dono tarah ke claims ki complete guide with real examples.',
    readTime: '7 min',
    keyPoints: [
      'Cashless claims: Get pre-authorization from TPA first',
      'Reimbursement: Pay bills, then claim within 15-30 days',
      'Keep all original bills, discharge summary, and reports',
      'Emergency admission: Notify within 24-48 hours',
      'Day care procedures also covered — no 24-hour stay needed',
    ],
  },
  {
    id: 'blog-003',
    title: 'What is Deductible and How Does It Affect Your Premium?',
    titleHi: 'Deductible kya hota hai? Iska premium par kya asar padta hai?',
    category: 'general',
    summary: 'Deductible samjhna bahut zaroori hai — yeh aapke premium ko directly affect karta hai. Jaaniye deductible kaise kaam karta hai aur kya aapke liye sahi hai.',
    readTime: '4 min',
    keyPoints: [
      'Higher deductible = lower premium, but more out-of-pocket',
      'Compulsory vs voluntary deductible — dono alag hain',
      'Top-up plans use deductible to give extra cover at low cost',
      '₹5,000 deductible can save 15-20% on premium',
      'Best for people who can handle small expenses themselves',
    ],
  },
  {
    id: 'blog-004',
    title: 'What is CSR (Claim Settlement Ratio) and Why is it Important?',
    titleHi: 'CSR (Claim Settlement Ratio) kya hai? Kyun important hai?',
    category: 'general',
    summary: 'CSR hi batata hai ki insurance company kitni reliable hai. Jitna zyada CSR, utna zyada chance ki aapka claim settle hoga. Jaaniye kaise check karein aur kya numbers dekhne chahiye.',
    readTime: '5 min',
    keyPoints: [
      'CSR = claims settled / total claims received × 100',
      'Life insurance: Look for CSR above 97%',
      'Health insurance: Look for CSR above 90%',
      'ACKO leads health with 99.98%, Max Life leads life with 99.51%',
      'Check IRDAI Annual Report for official CSR data',
    ],
  },
  {
    id: 'blog-005',
    title: 'Family Floater vs Individual Plan — Which Should You Choose?',
    titleHi: 'Family floater vs individual plan — kya choose karein?',
    category: 'health',
    summary: 'Family floater sasta lagta hai, lekin hamesha sahi nahi hota. Individual plan mein dedicated cover milta hai. Apni family ki need ke hisaab se decide karein.',
    readTime: '6 min',
    keyPoints: [
      'Family floater: One policy, shared sum insured for all members',
      'Individual: Separate cover for each member — no sharing',
      'Young healthy family → floater is better value',
      'Elderly parents or chronic conditions → individual is safer',
      'Mix approach possible: parents individual, rest floater',
    ],
  },
  {
    id: 'blog-006',
    title: 'Types of Life Insurance — Term, Endowment, ULIP, Money Back',
    titleHi: 'Life insurance ke types — Term, Endowment, ULIP, Money Back',
    category: 'life',
    summary: 'Life insurance ke 4 main types hain — har ek ka alag purpose hai. Samjhiye kaunsa plan aapke liye best hai aur kyun term plan se shuru karna chahiye.',
    readTime: '8 min',
    keyPoints: [
      'Term Plan: Pure protection, lowest premium, no returns',
      'Endowment: Protection + savings, guaranteed maturity amount',
      'ULIP: Protection + market-linked investment, high risk-reward',
      'Money Back: Regular payouts during policy term',
      'Rule: Buy term for protection, invest separately for wealth',
    ],
  },
  {
    id: 'blog-007',
    title: 'Motor Insurance — Third Party vs Comprehensive Explained',
    titleHi: 'Motor insurance — Third party vs Comprehensive',
    category: 'motor',
    summary: 'Third party mandatory hai, comprehensive optional. Lekin comprehensive mein aapki gaadi bhi covered hoti hai. Jaaniye kaunsa aapke liye better hai aur kyun.',
    readTime: '5 min',
    keyPoints: [
      'Third party: Legally mandatory, covers damage to others only',
      'Comprehensive: Third party + own damage + theft + natural calamity',
      'New car → always choose comprehensive',
      'Old car (>5 years) → third party may be enough',
      'Zero depreciation add-on: Must for new cars, costs 15-20% extra',
    ],
  },
  {
    id: 'blog-008',
    title: 'Understanding Waiting Period in Health Insurance',
    titleHi: 'Health insurance me waiting period kya hoti hai?',
    category: 'health',
    summary: 'Waiting period sabse common reason hai jisse claims reject hoti hain. Jaaniye kitne tarah ki waiting periods hote hain aur kaise plan karein taaki emergency mein dikkat na aaye.',
    readTime: '6 min',
    keyPoints: [
      'Initial waiting period: 30 days (accidents exempt)',
      'PED waiting: 24-48 months for pre-existing conditions',
      'Specific disease waiting: 1-2 years for cataract, hernia, etc.',
      'Maternity waiting: 9-36 months before delivery covered',
      'Port your policy to carry forward waiting period credits',
    ],
  },
  {
    id: 'blog-009',
    title: 'Tax Benefits Under Section 80D and 80C',
    titleHi: 'Tax benefits under Section 80D and 80C',
    category: 'general',
    summary: 'Insurance se tax bhi bachta hai! Section 80D mein health insurance ke liye ₹75,000 tak deduction, aur 80C mein life insurance ke liye ₹1.5 Lakh tak. Detail mein samjhiye.',
    readTime: '5 min',
    keyPoints: [
      'Section 80D: ₹25,000 self + family, ₹25,000 parents (₹50,000 if senior)',
      'Maximum 80D deduction: ₹75,000 with senior citizen parents',
      'Section 80C: Up to ₹1.5 Lakh for life insurance premium',
      'GST fully exempted on individual life and health policies',
      'Health check-up: ₹5,000 within 80D limit',
    ],
  },
  {
    id: 'blog-010',
    title: 'Pre-Existing Diseases and Insurance Coverage',
    titleHi: 'Pre-existing diseases aur insurance',
    category: 'health',
    summary: 'Agar aapko pehle se koi beemari hai toh insurance milta hai ya nahi? Milta hai — lekin waiting period ke baad. Jaaniye kya declare karna padta hai aur kya nahi.',
    readTime: '6 min',
    keyPoints: [
      'Always declare PED honestly — non-disclosure can reject claims',
      'PED covered after 24-48 months waiting period',
      'Diabetes, hypertension, thyroid — sab PED count hote hain',
      'Some plans offer PED cover from day 1 at extra premium',
      'Porting carries forward PED waiting period credits',
    ],
  },
  {
    id: 'blog-011',
    title: 'No Claim Bonus — What It Is and How It Works',
    titleHi: 'No Claim Bonus — kya hai aur kaise kaam karta hai?',
    category: 'general',
    summary: 'Jab aap saal bhar koi claim nahi karte toh company aapko reward deti hai. Health mein cover badhta hai, motor mein premium kam hota hai. Jaaniye iska poora mechanism.',
    readTime: '4 min',
    keyPoints: [
      'Health NCB: Sum insured increases 10-100% per claim-free year',
      'Motor NCB: Discount on renewal premium up to 50% over 5 years',
      'NCB stays with you even when switching insurers',
      'Making small claims can cost more than losing NCB',
      'NCB protector add-on available in motor insurance',
    ],
  },
  {
    id: 'blog-012',
    title: 'What is Solvency Ratio? Understanding Insurer Financial Strength',
    titleHi: 'Solvency Ratio kya hai? Insurance company ki financial strength',
    category: 'general',
    summary: 'Solvency ratio batata hai ki insurance company claims pay karne mein kitni strong hai. IRDAI ka minimum 1.5 hai — lekin aapko 1.8+ dhundhna chahiye. Jaaniye kyun.',
    readTime: '4 min',
    keyPoints: [
      'Solvency ratio = Available margin / Required margin',
      'IRDAI minimum: 1.5 — below this is risky',
      'Top insurers: ICICI Prudential 2.30, Axis Max Life 2.25, ACKO 2.2',
      'Higher solvency = company can pay even in mass claims scenario',
      'Check solvency in IRDAI Annual Report before choosing insurer',
    ],
  },
  {
    id: 'blog-013',
    title: 'GST Exemption on Insurance — What Has Changed?',
    titleHi: 'GST exemption on insurance — kya badla hai?',
    category: 'general',
    summary: '2025 mein GST fully exempted ho gaya hai individual life and health insurance policies par. Yeh badlav aapke premium ko directly affect karega. Jaaniye kya change hua aur kya nahi.',
    readTime: '3 min',
    keyPoints: [
      'GST fully exempted on individual life and health policies',
      '18% GST earlier applied on all insurance premiums',
      'Group/corporate policies: GST may still apply',
      'Savings of ₹500-₹2,000/year on typical premiums',
      'Check premium breakup to confirm GST exemption applied',
    ],
  },
  {
    id: 'blog-014',
    title: 'Insurance Guide for Young Professionals',
    titleHi: 'Young professionals ke liye insurance guide',
    category: 'general',
    summary: 'Pehli job, pehli salary — insurance last priority lagta hai. Lekin young age mein insurance lena sabse smart move hai. Jaaniye 25-35 age group ke liye kya kya chahiye.',
    readTime: '7 min',
    keyPoints: [
      'Start with term insurance — ₹1 Cr cover from ₹800/month at age 25',
      'Health insurance is must — premium lowest at young age',
      'Employer insurance is NOT enough — it ends with the job',
      'Buy early: No PED, lower premium, waiting period ends sooner',
      'Stack: Term + Health + Personal Accident = complete protection',
    ],
  },
  {
    id: 'blog-015',
    title: 'Health Insurance for Senior Citizens',
    titleHi: 'Senior citizens ke liye health insurance',
    category: 'health',
    summary: 'Senior citizens ke liye insurance lena mushkil lagta hai — lekin options hain. Jaaniye kya dekhna chahiye, kya limitations hain, aur kaunse plans best hain parents ke liye.',
    readTime: '6 min',
    keyPoints: [
      'Entry age up to 65 years in most plans, some go up to 80',
      'Co-payment of 10-20% usually applicable for seniors',
      'Pre-acceptance medical screening may be required above 45',
      'Look for plans with day care, AYUSH, and domiciliary cover',
      'Separate policy for parents is better than adding to family floater',
    ],
  },
];

// ============================================================================
// MYTH-BUSTERS Section Data
// ============================================================================
export interface MythBuster {
  id: string;
  myth: string;
  mythHi: string;
  reality: string;
  stat: string;
  source: string;
}

export const mythBusters: MythBuster[] = [
  {
    id: 'myth-001',
    myth: 'Young people don\'t need life insurance',
    mythHi: 'Jawano ko life insurance ki zaroorat nahi hoti',
    reality: 'Young age mein term insurance lena sabse smart financial move hai — premium sabse kam hota hai aur aapko decades ka protection milta hai. 25 ki umar mein ₹1 Crore cover ₹800/month mein milta hai, 40 mein yeh ₹2,500/month ho jayega.',
    stat: 'Term insurance premium doubles every 7-10 years of age increase',
    source: 'IRDAI Life Insurance Premium Data 2024-25',
  },
  {
    id: 'myth-002',
    myth: 'Health insurance is too expensive for my family',
    mythHi: 'Health insurance meri family ke budget se bahar hai',
    reality: 'Family floater health plan ₹1,500-3,000/month mein milta hai — yeh ek dinner outing ka kharcha hai. Ek emergency hospitalization ₹2-5 Lakh ka bill laa sakti hai. Insurance nahi lena asli mehenga hai.',
    stat: 'Average hospitalization cost in India: ₹2.5 Lakh (private hospital)',
    source: 'National Health Accounts 2024',
  },
  {
    id: 'myth-003',
    myth: 'My employer\'s insurance is enough',
    mythHi: 'Company ka insurance kaafi hai',
    reality: 'Employer insurance coverage limited hota hai (₹3-5 Lakh usually), job change hone par khatam ho jaata hai, aur pre-existing conditions job ke baad insurance lene mein problem banengi. Personal policy zaroori hai.',
    stat: 'Only 30% of employer plans cover ₹5 Lakh+, most cap at ₹3 Lakh',
    source: 'Corporate Benefits Survey 2024',
  },
  {
    id: 'myth-004',
    myth: 'I\'ll just save money instead of buying insurance',
    mythHi: 'Main insurance ki jagah paisa save karunga',
    reality: '₹5,000/month save karne mein 8 saal lagenge ₹5 Lakh bachane mein. Lekin emergency aaj hi aa sakti hai. Insurance ₹500/month mein ₹5 Lakh ka protection turant deta hai — savings kabhi replace nahi kar sakti.',
    stat: '65% of Indians dip into savings for medical emergencies; 25% borrow',
    source: 'NITI Aayog Health Report 2024',
  },
  {
    id: 'myth-005',
    myth: 'Insurance companies don\'t pay claims',
    mythHi: 'Insurance companies claims pay nahi karti',
    reality: 'Top insurers 97-99.5% claims settle karte hain. IRDAI ka strict regulation hai — companies claims reject nahi kar sakti without valid reason. Rejection ki main wajah: wrong information, PED non-disclosure, ya waiting period.',
    stat: 'Life insurance CSR: 97-99.5% | Health CSR: 88-99.98%',
    source: 'IRDAI Annual Report 2024-25',
  },
  {
    id: 'myth-006',
    myth: 'I\'m healthy, I don\'t need health insurance',
    mythHi: 'Main healthy hoon, mujhe health insurance nahi chahiye',
    reality: 'Dengue, COVID, accident — yeh kisi ko bhi kisi bhi waqt ho sakte hain. Healthy hone ka matlab yeh nahi ki emergency nahi aayegi. Insurance healthy logon ke liye hi sabse sasta hota hai — medical test bhi nahi lagta.',
    stat: '60% of hospitalizations in India are unplanned emergencies',
    source: 'WHO India Health Statistics 2024',
  },
  {
    id: 'myth-007',
    myth: 'Term insurance has no returns, so it\'s a waste',
    mythHi: 'Term insurance mein kuch return nahi milta, faltu hai',
    reality: 'Term insurance investment nahi hai — yeh protection hai. Ghar ka insurance bhi return nahi deta, phir bhi log karte hain. ₹800/month = ₹1 Crore protection. Baaki ₹700 invest karo mutual fund mein — returns bhi milenge aur protection bhi.',
    stat: '₹800/month term + ₹700/month SIP = ₹1 Cr protection + ₹45 Lakh in 20 years',
    source: 'Financial Planning Calculation 2025',
  },
  {
    id: 'myth-008',
    myth: 'Buying insurance online is not safe',
    mythHi: 'Online insurance lena safe nahi hai',
    reality: 'Online insurance bilkul safe hai — IRDAI regulated hota hai, same policy terms hote hain, aur often 10-15% cheaper hota hai kyunki agent commission nahi lagta. Free look period mein policy cancel bhi kar sakte hain.',
    stat: 'Online term plans are 10-15% cheaper than offline; 30-day free look for digital',
    source: 'IRDAI Digital Insurance Guidelines 2024',
  },
];

// ============================================================================
// WHATSAPP DRIP CAMPAIGN Data
// ============================================================================
export interface DripMessage {
  day: number;
  type: 'text' | 'pdf' | 'quiz' | 'infographic' | 'prompt';
  content: string;
  contentHi: string;
}

export interface DripCampaign {
  intent: 'health' | 'life' | 'motor';
  welcomeMessage: string;
  messages: DripMessage[];
}

export const dripCampaigns: DripCampaign[] = [
  {
    intent: 'health',
    welcomeMessage: 'Namaste! 🙏 Aapne health insurance ke baare mein dikhava kiya. Main aapko 10 din mein step-by-step sab samjhaunga. Shuru karte hain!',
    messages: [
      {
        day: 1,
        type: 'pdf',
        content: 'Health Insurance 101: Complete Guide for Indian Families',
        contentHi: '📎 PDF bhej raha hoon — "Health Insurance 101: Indian Families ke liye Complete Guide". Isme sab basics hain — sum insured, premium, claims, sab kuch. Dhyan se padhiye!',
      },
      {
        day: 2,
        type: 'text',
        content: 'Did you know? Medical inflation in India is 14% annually. A single hospitalization can cost ₹2-5 Lakhs.',
        contentHi: 'Kya aap jaante the? 🏥 India mein medical inflation 14% saalana hai. Ek hospitalization ka bill ₹2-5 Lakh aa sakta hai. Insurance nahi lena = savings khatam. Sochiye is baare mein!',
      },
      {
        day: 3,
        type: 'quiz',
        content: 'Quick Quiz: What is the minimum waiting period for pre-existing diseases in health insurance? A) 12 months B) 24 months C) 48 months',
        contentHi: 'Quiz time! 🧠 Pre-existing diseases ke liye minimum waiting period kitna hai? A) 12 mahine B) 24 mahine C) 48 mahine. Answer bhejiye!',
      },
      {
        day: 4,
        type: 'text',
        content: 'Answer: B) 24-36 months. Most plans cover PED after 24 months (ACKO, HDFC ERGO) or 36 months (Star Health, ManipalCigna).',
        contentHi: 'Answer: B) 24-36 mahine! ✅ Zyada tar plans 24 mahine baad PED cover karte hain (jaise ACKO, HDFC ERGO). Kuch mein 36 mahine lagte hain. Isliye jaldi lena better hai!',
      },
      {
        day: 5,
        type: 'text',
        content: 'Family Floater vs Individual Plan: Young family = floater saves money. Elderly parents = individual is safer.',
        contentHi: '💡 Aaj ka tip: Family floater sasta hai lekin shared cover. Agar parents bhi add kar rahe hain toh unke liye alag policy better hai. Kyunki unka treatment zyada expensive hota hai.',
      },
      {
        day: 6,
        type: 'text',
        content: 'Cashless vs Reimbursement: Network hospital = no bill payment. Non-network = pay first, claim later.',
        contentHi: '🏥 Cashless treatment samjhiye: Network hospital mein admit huye = bill direct insurance company pay karegi. Aapko paisa nahi dena! Pehle check karo hospital network mein hai ya nahi.',
      },
      {
        day: 7,
        type: 'infographic',
        content: 'Health Insurance Decision Tree: Age → Family Size → Medical History → Budget → Plan Recommendation',
        contentHi: '📊 Infographic bhej raha hoon — "Health Insurance ka Decision Tree". Apni age, family, aur budget dekhke easily samajh aayega kaunsa plan aapke liye best hai!',
      },
      {
        day: 8,
        type: 'text',
        content: 'Section 80D Tax Benefit: Self + family ₹25,000. Parents ₹25,000 (₹50,000 if senior). Total up to ₹75,000 deduction.',
        contentHi: '💰 Tax bachao! Section 80D mein health insurance premium ka deduction milta hai — khud + family ₹25,000, parents ₹25,000 (senior ho toh ₹50,000). Total ₹75,000 tak tax bachat!',
      },
      {
        day: 9,
        type: 'text',
        content: 'Before buying: Check CSR, network hospitals near you, waiting period, room rent limit, and restoration benefit.',
        contentHi: '✅ Kal se pehle yeh 5 cheezein check karein: 1) CSR 90%+ hai? 2) Aapke area mein network hospitals hain? 3) Waiting period kitni hai? 4) Room rent limit hai? 5) Restoration benefit hai?',
      },
      {
        day: 10,
        type: 'prompt',
        content: 'Ready to explore health insurance plans? I can help you compare the best options based on your needs.',
        contentHi: '🛡️ Ab aap ready hain! Agar health insurance explore karna chahte hain toh main aapke liye best plans compare kar sakta hoon — apni age aur budget bataiye, main recommendations dunga!',
      },
    ],
  },
  {
    intent: 'life',
    welcomeMessage: 'Namaste! 🙏 Aapne life insurance ke baare mein interest dikhaya. Main 10 din mein aapko sab kuch samjhaunga — types, benefits, aur kaise choose karein. Chaliye shuru karte hain!',
    messages: [
      {
        day: 1,
        type: 'pdf',
        content: 'Life Insurance Guide: Protecting Your Family\'s Future',
        contentHi: '📎 PDF bhej raha hoon — "Life Insurance Guide: Apne Parivar ka Future Kaise Surakshit Karein". Isme term, endowment, ULIP sab explained hai. Zaroor padhiye!',
      },
      {
        day: 2,
        type: 'text',
        content: 'Why Life Insurance? If something happens to the earning member, how will the family survive? Term insurance gives ₹1 Crore+ cover from ₹800/month.',
        contentHi: '💭 Sochiye: Agar kamane wale ko kuch ho jaaye toh family kaise chalegi? Term insurance ₹800/month mein ₹1 Crore+ ka protection deta hai. Yeh family ki financial security hai.',
      },
      {
        day: 3,
        type: 'quiz',
        content: 'Quiz: Which life insurance type has the lowest premium? A) Endowment B) ULIP C) Term Plan',
        contentHi: 'Quiz time! 🧠 Sabse kam premium kis life insurance type mein hota hai? A) Endowment B) ULIP C) Term Plan. Answer bhejiye!',
      },
      {
        day: 4,
        type: 'text',
        content: 'Answer: C) Term Plan! Pure protection, no investment, lowest premium. ₹1 Crore cover from ₹800/month for a 30-year-old non-smoker.',
        contentHi: 'Answer: C) Term Plan! ✅ Sabse sasta aur sabse effective. Investment ke liye alag se invest karein (mutual fund), protection ke liye term plan. Dono alag rakhein!',
      },
      {
        day: 5,
        type: 'text',
        content: 'Term vs Endowment vs ULIP vs Money Back — each serves a different purpose. Term = protection, others = protection + savings/investment.',
        contentHi: '💡 Types samjhiye: Term = sirf protection (sasta). Endowment = protection + guaranteed savings. ULIP = protection + market investment. Money Back = protection + regular payouts. Aapka goal kya hai?',
      },
      {
        day: 6,
        type: 'text',
        content: 'Key riders: Critical Illness (+₹200/month), Accidental Death (+₹150/month), Waiver of Premium (+₹100/month). Small cost, big protection.',
        contentHi: '🛡️ Riders yaani extra benefits: Critical Illness rider (+₹200/mahine), Accidental Death rider (+₹150/mahine), Waiver of Premium rider (+₹100/mahine). Chhota extra cost, bada fayda!',
      },
      {
        day: 7,
        type: 'infographic',
        content: 'Life Insurance Comparison Chart: Premium vs Coverage vs Returns across all types',
        contentHi: '📊 Infographic bhej raha hoon — "Life Insurance ka Comparison Chart". Term, Endowment, ULIP, Money Back — sabka premium, coverage, aur returns side by side. Clear picture aa jayega!',
      },
      {
        day: 8,
        type: 'text',
        content: 'How much cover do you need? Rule of thumb: 10-15 times your annual income. If you earn ₹10 Lakh/year, get ₹1-1.5 Crore cover.',
        contentHi: '🎯 Kitna cover chahiye? Simple rule: Annual income ka 10-15 guna. Agar ₹10 Lakh/year kamate hain toh ₹1-1.5 Crore ka cover lo. Loans aur future expenses bhi add karein.',
      },
      {
        day: 9,
        type: 'text',
        content: 'Before buying life insurance: Check CSR (97%+), claim turnaround time, solvency ratio (1.8+), and compare quotes from 3+ insurers.',
        contentHi: '✅ Life insurance lene se pehle: 1) CSR 97%+ check karein 2) Claim turnaround time dekhein 3) Solvency ratio 1.8+ hona chahiye 4) 3+ companies se quotes compare karein.',
      },
      {
        day: 10,
        type: 'prompt',
        content: 'Ready to find the right life insurance? Tell me your age and coverage needs — I\'ll recommend the best plans for you.',
        contentHi: '🛡️ Ab aap ready hain! Apni age aur kitna cover chahiye yeh bataiye — main aapke liye best life insurance plans recommend karunga. Simple hai!',
      },
    ],
  },
  {
    intent: 'motor',
    welcomeMessage: 'Namaste! 🚗 Aapne motor insurance ke baare mein pucha. Main 10 din mein aapko sab kuch samjhaunga — third party, comprehensive, add-ons, claims, sab kuch. Chaliye shuru karte hain!',
    messages: [
      {
        day: 1,
        type: 'pdf',
        content: 'Motor Insurance Guide: Everything You Need to Know About Car Insurance in India',
        contentHi: '📎 PDF bhej raha hoon — "Motor Insurance Guide: India mein Car Insurance ki Complete Jaankari". Third party, comprehensive, add-ons, claims — sab included hai. Padhiye!',
      },
      {
        day: 2,
        type: 'text',
        content: 'Third party insurance is MANDATORY by law. Driving without it can lead to ₹2,000 fine and/or 3 months imprisonment. Comprehensive is optional but highly recommended.',
        contentHi: '⚠️ Third party insurance LAW ke hisaab se zaroori hai! Bina insurance driving = ₹2,000 fine + 3 mahine jail. Comprehensive optional hai lekin bahut recommended hai.',
      },
      {
        day: 3,
        type: 'quiz',
        content: 'Quiz: What does IDV stand for in motor insurance? A) Indian Driving Value B) Insured Declared Value C) Insurance Deducted Value',
        contentHi: 'Quiz time! 🧠 Motor insurance mein IDV ka full form kya hai? A) Indian Driving Value B) Insured Declared Value C) Insurance Deducted Value. Answer bhejiye!',
      },
      {
        day: 4,
        type: 'text',
        content: 'Answer: B) Insured Declared Value. IDV is your car\'s current market value — the maximum amount you\'ll get if the car is stolen or totally damaged.',
        contentHi: 'Answer: B) Insured Declared Value! ✅ IDV = aapki gaadi ki current market value. Agar gaadi chori ho ya total damage ho, toh max IDV hi mileage. Har saal depreciation se IDV kam hota hai.',
      },
      {
        day: 5,
        type: 'text',
        content: 'Zero Depreciation Add-on: Without it, you bear 30-50% of plastic/fiber part costs. With it, full claim. Costs 15-20% extra but a must for new cars.',
        contentHi: '💡 Zero Depreciation (Bumper-to-Bumper): Bina iske plastic/fiber parts ke 30-50% aapko dena padega. Iske saath full claim! 15-20% extra premium lekin nayi gaadi ke liye zaroori.',
      },
      {
        day: 6,
        type: 'text',
        content: 'No Claim Bonus in Motor: 5 claim-free years = 50% discount on own damage premium. NCB transfers when you switch insurers. Making small claims can cost more than losing NCB.',
        contentHi: '🏆 Motor mein NCB: 5 saal tak claim nahi kiya = 50% discount! NCB aapke saath rehta hai — company change karo toh bhi. Chhota claim karne se NCB khatam — soch samajh ke claim karein.',
      },
      {
        day: 7,
        type: 'infographic',
        content: 'Motor Insurance Add-ons Comparison: Zero Dep, Engine Protect, Roadside Assist, Return to Invoice, Consumables',
        contentHi: '📊 Infographic bhej raha hoon — "Motor Insurance Add-ons ka Comparison". Zero Dep, Engine Protect, Roadside Assist, Return to Invoice — kya kya cover hota hai, kitna cost hai. Clear picture!',
      },
      {
        day: 8,
        type: 'text',
        content: 'Claims process: 1) Note other driver\'s details 2) Take photos 3) File FIR if needed 4) Inform insurer within 48 hours 5) Get survey done before repair.',
        contentHi: '📋 Accident ke baad kya karein: 1) Dusre driver ki details lein 2) Photos lein 3) FIR file karein (zaroorat ho toh) 4) 48 ghante mein insurer ko bataiye 5) Repair se pehle survey karwayiye.',
      },
      {
        day: 9,
        type: 'text',
        content: 'New car → always comprehensive + zero dep. Old car (>5 years) → third party may be enough. Luxury car → add engine protect and return to invoice.',
        contentHi: '✅ Quick guide: Nayi gaadi = Comprehensive + Zero Dep zaroori. 5+ saal purani = Third party bhi chalta hai. Luxury car = Engine Protect + Return to Invoice add karein.',
      },
      {
        day: 10,
        type: 'prompt',
        content: 'Want to compare motor insurance plans for your car? Share your car model and year — I\'ll find the best coverage options.',
        contentHi: '🚗 Ab compare karein! Apni gaadi ka model aur year bataiye — main aapke liye best motor insurance plans dhundh lunga with great coverage at lowest premium!',
      },
    ],
  },
];

// ============================================================================
// COMPLIANCE CHECKLIST Data
// ============================================================================
export interface ComplianceItem {
  id: string;
  category: 'DPDP' | 'IRDAI' | 'WhatsApp';
  requirement: string;
  description: string;
  status: 'required' | 'recommended' | 'future';
  priority: 'high' | 'medium' | 'low';
}

export const complianceChecklist: ComplianceItem[] = [
  {
    id: 'comp-001',
    category: 'DPDP',
    requirement: 'Explicit Consent Records',
    description: 'Digital Personal Data Protection Act ke under user ka explicit consent lena zaroori hai before collecting, storing, ya processing personal data. Consent record maintain karna padega with timestamp and purpose.',
    status: 'required',
    priority: 'high',
  },
  {
    id: 'comp-002',
    category: 'DPDP',
    requirement: 'Data Security Safeguards',
    description: 'User data ko encrypt karna, access control lagana, aur security breaches se protect karna DPDP Act ke under mandatory hai. Data breach hone par 72 ghante mein users aur government ko notify karna padega.',
    status: 'required',
    priority: 'high',
  },
  {
    id: 'comp-003',
    category: 'DPDP',
    requirement: 'Right to Erasure Implementation',
    description: 'Users ko apna data delete karne ka right hai DPDP Act ke under. Jab user bole toh uska personal data delete karna padega (legal requirements ke alawa). Iske liye mechanism banana zaroori hai.',
    status: 'required',
    priority: 'high',
  },
  {
    id: 'comp-004',
    category: 'DPDP',
    requirement: 'Data Minimization Principle',
    description: 'Sirf woh data collect karna jo purpose ke liye zaroori hai — zyada data collect karna DPDP violation hai. Onboarding mein sirf required fields rakhna chahiye, optional clearly mark hona chahiye.',
    status: 'required',
    priority: 'medium',
  },
  {
    id: 'comp-005',
    category: 'WhatsApp',
    requirement: 'Opt-Out Mechanism',
    description: 'WhatsApp Business API mein har message ke saath opt-out option dena mandatory hai. User "STOP" type kare toh usko messages band ho jaane chahiye. 24-hour window ke baad marketing messages ke liye template approval chahiye.',
    status: 'required',
    priority: 'high',
  },
  {
    id: 'comp-006',
    category: 'WhatsApp',
    requirement: 'Utility vs Marketing Message Classification',
    description: 'WhatsApp par utility messages (policy updates, claim status) aur marketing messages (plan promotions, offers) ko clearly classify karna padega. Utility messages ke alag templates aur marketing ke alag approval process hai.',
    status: 'required',
    priority: 'high',
  },
  {
    id: 'comp-007',
    category: 'WhatsApp',
    requirement: 'Per-Message Pricing Awareness',
    description: 'WhatsApp Business API per-message pricing model hai — har message ka charge lagta hai (₹0.30-₹1.50 depending on type). Marketing messages zyada expensive hain. Budget planning mein yeh include karna zaroori hai.',
    status: 'recommended',
    priority: 'medium',
  },
  {
    id: 'comp-008',
    category: 'IRDAI',
    requirement: 'IRDAI Web Aggregator Registration',
    description: 'Agar platform insurance plans compare/sell karta hai toh IRDAI Web Aggregator registration zaroori hai. Yeh process time-consuming hai aur annual renewal chahiye. Bina registration ke plans recommend karna legal issue ho sakta hai.',
    status: 'future',
    priority: 'high',
  },
  {
    id: 'comp-009',
    category: 'IRDAI',
    requirement: 'Mandatory Disclaimers Display',
    description: 'Har page par IRDAI mandatory disclaimer dikhana zaroori hai: "Insurance is the subject matter of solicitation." Tax, claim, aur solvency disclaimers bhi clearly display hone chahiye.',
    status: 'required',
    priority: 'high',
  },
  {
    id: 'comp-010',
    category: 'IRDAI',
    requirement: 'Prohibited Words Compliance',
    description: 'IRDAI ne certain words prohibit kiye hain — "guaranteed", "assured", "risk-free", "best", "cheapest" etc. Platform par in words ka use nahi hona chahiye kisi bhi context mein.',
    status: 'required',
    priority: 'high',
  },
  {
    id: 'comp-011',
    category: 'IRDAI',
    requirement: 'No-Selling Stance (Educational Platform)',
    description: 'Platform educational hai, selling nahi. Kisi bhi specific plan ki recommendation "guaranteed" ya "best" language mein nahi honi chahiye. Neutral comparison aur education hi platform ka purpose hai.',
    status: 'required',
    priority: 'high',
  },
  {
    id: 'comp-012',
    category: 'DPDP',
    requirement: 'Consent for WhatsApp Communication',
    description: 'User ko WhatsApp par messages bhejne se pehle explicit consent lena zaroori hai — separate checkbox ya clear opt-in flow. Pre-checked boxes se consent valid nahi maana jaayega DPDP Act ke under.',
    status: 'required',
    priority: 'high',
  },
];

// ============================================================================
// MARKET INSIGHTS Data
// ============================================================================
export interface MarketInsight {
  id: string;
  stat: string;
  context: string;
  source: string;
  category: 'opportunity' | 'pain-point' | 'regulatory' | 'competitor-gap';
}

export const marketInsights: MarketInsight[] = [
  {
    id: 'mi-001',
    stat: 'India\'s insurance penetration: 3.7% of GDP',
    context: 'Global average 7.3% hai — India nearly half pe hai. Yeh massive opportunity hai education aur awareness ke through penetration badhane ka. Paliwal Secure jaisa platform is gap ko fill kar sakta hai.',
    source: 'IRDAI Annual Report 2024-25 / Swiss Re Sigma',
    category: 'opportunity',
  },
  {
    id: 'mi-002',
    stat: 'Life insurance penetration fallen 3rd consecutive year to 2.7%',
    context: 'Life insurance penetration tezi se girta ja raha hai — log investment products ki taraf jaa rahe hain, protection products se door. Education ki zaroorat hai ki term insurance investment nahi, protection hai.',
    source: 'IRDAI Life Insurance Penetration Report 2024-25',
    category: 'pain-point',
  },
  {
    id: 'mi-003',
    stat: 'Non-life insurance penetration flat at 1%',
    context: 'Health aur motor insurance penetration 1% par stuck hai — matlab 99% population ke paas non-life insurance nahi hai. Awareness ki kami sabse bada reason hai. Education-first approach se yeh change ho sakta hai.',
    source: 'IRDAI Annual Report 2024-25',
    category: 'opportunity',
  },
  {
    id: 'mi-004',
    stat: '37% of insurance agents admit limited product knowledge',
    context: 'Agents hi confuse hain toh customers kya samjhenge? Yeh massive trust gap hai. Paliwal Secure ka educational approach agents se better clarity de sakta hai kyunki data-backed, unbiased information hai.',
    source: 'IRDAI Agent Survey 2024',
    category: 'competitor-gap',
  },
  {
    id: 'mi-005',
    stat: 'GST fully exempted on individual life and health policies',
    context: 'Yeh game-changing regulatory change hai — 18% GST hatne se insurance effectively sasta ho gaya. Lekin zyada log is baare mein jaante bhi nahi hain. Awareness spread karna zaroori hai.',
    source: 'GST Council Notification 2025',
    category: 'regulatory',
  },
  {
    id: 'mi-006',
    stat: 'Market focused on high-cost distribution, not education',
    context: 'Insurance industry apna 70%+ budget distribution aur commissions par kharcha karti hai — education par bahut kam. Yeh gap Paliwal Secure fill kar sakta hai: education first, selling later.',
    source: 'McKinsey India Insurance Report 2024',
    category: 'competitor-gap',
  },
  {
    id: 'mi-007',
    stat: 'Only 5% of Indian households have health insurance',
    context: '95% families health insurance ke bina hain — ek medical emergency poori savings khatam kar sakti hai. Yeh naa sirf market opportunity hai, balki social impact ka mauka hai.',
    source: 'National Family Health Survey (NFHS-5)',
    category: 'pain-point',
  },
  {
    id: 'mi-008',
    stat: 'Digital insurance adoption grew 35% YoY in 2024',
    context: 'Log digital par trust kar rahe hain — online policy purchase badh raha hai. Paliwal Secure ka WhatsApp-first approach is trend ko aur accelerate kar sakta hai kyunki WhatsApp India ka #1 messaging app hai.',
    source: 'IRDAI Digital Insurance Report 2024',
    category: 'opportunity',
  },
  {
    id: 'mi-009',
    stat: 'DPDP Act 2023 enforcement beginning 2025',
    context: 'Data protection law strict hone wala hai — consent management, data security, right to erasure sab implement karna padega. Early compliance = competitive advantage. Non-compliance = heavy fines up to ₹250 Crore.',
    source: 'Ministry of Electronics & IT, DPDP Act 2023',
    category: 'regulatory',
  },
  {
    id: 'mi-010',
    stat: 'Average Indian spends 6.6% of income on healthcare out-of-pocket',
    context: 'Global average 2.9% hai — India mein double. Yeh out-of-pocket expenditure insurance se avoid ho sakti hai. Education se log samajh sakte hain ki insurance sirf premium nahi, savings hai.',
    source: 'World Bank Health Expenditure Data 2024',
    category: 'pain-point',
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
export function formatCurrency(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
}

export function getPlansByCategory(category: InsuranceCategory): InsurancePlan[] {
  return allInsurancePlans.filter(p => p.category === category);
}

export function searchPlans(query: string): InsurancePlan[] {
  const q = query.toLowerCase();
  return allInsurancePlans.filter(
    p =>
      p.name.toLowerCase().includes(q) ||
      p.provider.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.features.some(f => f.toLowerCase().includes(q)) ||
      p.recommendedFor.some(r => r.toLowerCase().includes(q))
  );
}

export function searchKnowledgeBase(query: string): KnowledgeEntry[] {
  const q = query.toLowerCase();
  const words = q.split(/\s+/).filter(w => w.length > 2);

  // Search existing knowledge base entries
  const kbResults = knowledgeBase
    .map(entry => {
      let score = 0;
      const searchable = `${entry.topic} ${entry.question} ${entry.answer} ${entry.tags.join(' ')}`.toLowerCase();
      words.forEach(word => {
        if (searchable.includes(word)) score += 1;
      });
      return { entry, score };
    })
    .filter(item => item.score > 0);

  // Search glossary terms — convert to KnowledgeEntry format
  const glossaryResults = policyGlossary
    .map(term => {
      let score = 0;
      const searchable = `${term.term} ${term.hindiTerm || ''} ${term.explanation} ${term.example} ${term.category}`.toLowerCase();
      words.forEach(word => {
        if (searchable.includes(word)) score += 1;
      });
      return {
        entry: {
          id: `glossary-${term.term.replace(/\s+/g, '-')}`,
          topic: term.term,
          question: `What is ${term.term}?`,
          answer: `${term.explanation} Example: ${term.example}`,
          category: term.category as InsuranceCategory | 'general',
          tags: [term.category, 'glossary', term.hindiTerm || ''].filter(Boolean),
        } as KnowledgeEntry,
        score,
      };
    })
    .filter(item => item.score > 0);

  // Search blog articles — convert to KnowledgeEntry format
  const blogResults = blogArticles
    .map(article => {
      let score = 0;
      const searchable = `${article.title} ${article.titleHi} ${article.summary} ${article.keyPoints.join(' ')} ${article.category}`.toLowerCase();
      words.forEach(word => {
        if (searchable.includes(word)) score += 1;
      });
      return {
        entry: {
          id: `blog-${article.id}`,
          topic: article.title,
          question: article.titleHi,
          answer: `${article.summary} Key points: ${article.keyPoints.join('. ')}`,
          category: article.category as InsuranceCategory | 'general',
          tags: [article.category, 'blog', 'article'],
        } as KnowledgeEntry,
        score,
      };
    })
    .filter(item => item.score > 0);

  // Search myth busters — convert to KnowledgeEntry format
  const mythResults = mythBusters
    .map(myth => {
      let score = 0;
      const searchable = `${myth.myth} ${myth.mythHi} ${myth.reality} ${myth.stat} ${myth.source}`.toLowerCase();
      words.forEach(word => {
        if (searchable.includes(word)) score += 1;
      });
      return {
        entry: {
          id: `myth-${myth.id}`,
          topic: `Myth: ${myth.myth}`,
          question: myth.mythHi,
          answer: `Reality: ${myth.reality} Stat: ${myth.stat} Source: ${myth.source}`,
          category: 'general' as InsuranceCategory | 'general',
          tags: ['myth-buster', 'fact-check'],
        } as KnowledgeEntry,
        score,
      };
    })
    .filter(item => item.score > 0);

  // Combine all results, sort by score, and return deduplicated entries
  const allResults = [...kbResults, ...glossaryResults, ...blogResults, ...mythResults];
  return allResults
    .sort((a, b) => b.score - a.score)
    .map(item => item.entry);
}
