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
    claimSettlementRatio: 99.16,
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
    claimSettlementRatio: 100,
    incurredClaimRatio: 58.68,
    solvencyRatio: 1.8,
    complaintsPer10k: 42.00,
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
    claimSettlementRatio: 92.02,
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
    claimSettlementRatio: 100,
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
    claimSettlementRatio: 96.00,
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
    claimSettlementRatio: 98.50,
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
  {
    term: 'Sum Assured',
    hindiTerm: 'सम एश्योर्ड',
    explanation: 'वह गारंटीड रकम जो इंश्योरर बीमित घटना (जैसे death, critical illness) पर भुगतान करता है। Term insurance में यह वह amount है जो nominee को मिलती है।',
    example: 'अगर ₹1 करोड का Sum Assured है, तो policyholder की मृत्यु पर nominee को ₹1 करोड मिलेंगे।',
    category: 'life',
  },
  {
    term: 'Grace Period',
    hindiTerm: 'ग्रेस पीरियड',
    explanation: 'प्रीमियम भुगतान के लिए ड्यू डेट के बाद की वह अवधि (आमतौर पर 15-30 दिन) जिसमें बिना पेनल्टी के भुगतान किया जा सकता है। इस दौरान पॉलिसी एक्टिव रहती है।',
    example: 'अगर प्रीमियम की तारीख 5 तारीख है और Grace Period 15 दिन है, तो 20 तारीख तक बिना जुर्माने के भुगतान कर सकते हैं।',
    category: 'general',
  },
  {
    term: 'Moratorium Period',
    hindiTerm: 'मोरेटोरियम पीरियड',
    explanation: 'वह समय सीमा (IRDAI के अनुसार 5 साल) जिसके बाद इंश्योरर मेडिकल हिस्ट्री की जांच नहीं कर सकता। 5 साल continuously रिन्यू करने के बाद कोई भी बीमारी pre-existing नहीं मानी जा सकती।',
    example: '5 साल तक पॉलिसी चलाने के बाद, अगर कोई नई बीमारी पता चले तो भी कंपनी उसे PED नहीं मान सकती।',
    category: 'health',
  },
  {
    term: 'Incurred Claim Ratio (ICR)',
    hindiTerm: 'इनकर्ड क्लेम रेश्यो',
    explanation: 'बीमा कंपनी द्वारा प्रीमियम के रूप में ली गई रकम के सापेक्ष क्लेम पर खर्च किए गए पैसे का प्रतिशत। ICR 50-90% के बीच होना अच्छा माना जाता है — बहुत कम होने से कंपनी मुनाफे में है (क्लेम कम दे रही), बहुत ज्यादा होने से घाटे में।',
    example: 'Star Health का ICR 67.26% है — मतलब ₹100 प्रीमियम में से ₹67.26 क्लेम पर खर्च किए। Care Health का 58.68% है।',
    category: 'general',
  },
  {
    term: 'Third-party Administrator (TPA)',
    hindiTerm: 'थर्ड पार्टी एडमिनिस्ट्रेटर',
    explanation: 'वह संस्था जो बीमा कंपनी के लिए क्लेम प्रोसेसिंग और नेटवर्क हॉस्पिटल मैनेजमेंट का काम करती है। TPA कैशलेस क्लेम को आसान बनाता है।',
    example: 'Medi Assist, Raksha TPA — ये कंपनियां हॉस्पिटल और इंश्योरर के बीच की लिंक हैं।',
    category: 'health',
  },
  {
    term: 'Top-up Plan',
    hindiTerm: 'टॉप-अप प्लान',
    explanation: 'एक सस्ता प्लान जो बेसिक प्लान की सीमा खत्म होने के बाद ज़्यादा कवर देता है। इसमें एक deductible होता है (जैसे ₹3 लाख) — इतना खर्च खुद उठाना पड़ता है, उसके बाद top-up activate होता है।',
    example: '₹5 लाख की बेसिक पॉलिसी + ₹10 लाख का टॉप-अप (₹3 लाख deductible) = कुल ₹15 लाख कवर, बहुत कम प्रीमियम में।',
    category: 'health',
  },
  {
    term: 'Super Top-up Plan',
    hindiTerm: 'सुपर टॉप-अप प्लान',
    explanation: 'टॉप-अप प्लान का बेहतर वर्जन — यहां एक साल में हुए कई क्लेम को जोड़ा जा सकता है deductible पार करने के लिए। सामान्य टॉप-अप में सिर्फ एक क्लेम deductible cross करता है।',
    example: '₹3 लाख deductible वाले सुपर टॉप-अप में — पहली बार ₹2 लाख + दूसरी बार ₹2 लाख = कुल ₹4 लाख, तो ₹1 लाख सुपर टॉप-अप से मिलेगा।',
    category: 'health',
  },
  {
    term: 'No Claim Bonus (NCB)',
    hindiTerm: 'नो क्लेम बोनस',
    explanation: 'हर क्लेम-फ्री वर्ष पर मिलने वाला लाभ — या तो प्रीमियम में डिस्काउंट या Sum Insured में बढ़ोतरी। Health insurance में आमतौर पर Sum Insured बढ़ता है, Motor में प्रीमियम कम होता है।',
    example: 'HDFC ERGO में हर क्लेम-फ्री साल पर 50% Sum Insured बढ़ता है, अधिकतम 100% तक। Motor में 20-50% तक का डिस्काउंट मिलता है।',
    category: 'general',
  },
  {
    term: 'Restoration Benefit',
    hindiTerm: 'रिस्टोरेशन बेनिफिट',
    explanation: 'एक फीचर जो Sum Insured को एक साल में एक बार पूरी तरह इस्तेमाल करने के बाद फिर से रिस्टोर (भरपूर) कर देता है। कुछ प्लान में अनलिमिटेड रिस्टोरेशन भी मिलता है।',
    example: '₹5 लाख का प्लान — पहली बार ₹5 लाख खर्च हो गए, तो रिस्टोरेशन से फिर ₹5 लाख कवर मिल जाएगा उसी साल।',
    category: 'health',
  },
  {
    term: 'Portability',
    hindiTerm: 'पोर्टेबिलिटी',
    explanation: 'एक पॉलिसी को बिना कोई नया वेटिंग पीरियड लिए एक कंपनी से दूसरी में ट्रांसफर करने का अधिकार। IRDAI के नियम अनुसार, आप 45 दिन पहले आवेदन कर सकते हैं।',
    example: 'Star Health से HDFC ERGO में पोर्ट किया — 2 साल का waiting period फिर से नहीं लगेगा।',
    category: 'health',
  },
  {
    term: 'Riders',
    hindiTerm: 'राइडर्स',
    explanation: 'अतिरिक्त कवर जो Critical Illness, Accidental Death, Hospital Cash आदि के लिए बेस प्लान के साथ जोड़ा जा सकता है। ये अलग से प्रीमियम पर खरीदे जाते हैं।',
    example: 'टर्म प्लान में Critical Illness Rider जोड़ा — अगर कैंसर जैसी बीमारी हो तो ₹10 लाख एकमुश्त मिलेंगे।',
    category: 'life',
  },
  {
    term: 'Free Look Period',
    hindiTerm: 'फ्री लुक पीरियड',
    explanation: 'पॉलिसी मिलने के 15-30 दिनों का वह समय जिसमें पॉलिसी को पढ़ने के बाद बिना किसी जुर्माने के कैंसिल किया जा सकता है। सिर्फ stamp duty और medical test का खर्च काटा जाता है।',
    example: 'पॉलिसी मिली, 10 दिन में पढ़ा — पसंद नहीं आई → फ्री लुक में कैंसिल कर दिया, प्रीमियम वापस मिल गया।',
    category: 'general',
  },
  {
    term: 'Solvency Ratio',
    hindiTerm: 'सॉल्वेंसी रेश्यो',
    explanation: 'बीमा कंपनी की उसकी देनदारियों (लायबिलिटीज) का भुगतान करने की क्षमता। IRDAI के अनुसार न्यूनतम 1.5 होना चाहिए। जितना ज्यादा, उतनी वित्तीय सुरक्षा।',
    example: 'Bajaj Allianz का Solvency Ratio 3.0 है (बहुत अच्छा), LIC का 1.85 है ( acceptable)।',
    category: 'general',
  },
];

// ============================================================================
// BIMA KI ABCD - Blog/Article Section Data
// ============================================================================
export interface BlogArticle {
  id: string;
  title: string;
  titleHi?: string;
  category: 'health' | 'life' | 'motor' | 'travel' | 'home' | 'general';
  summary?: string;
  excerpt?: string;
  readTime: number | string;
  keyPoints?: string[];
  keyTakeaways?: string[];
  source?: string;
}

export const blogArticles: BlogArticle[] = [
  {
    id: 'article-001',
    title: '2025 में सीखे गए सबक: हेल्थ इंश्योरेंस क्लेम का सही तरीका',
    category: 'Health',
    excerpt: 'साल 2025 में हेल्थ इंश्योरेंस क्लेम में 15% की बढ़ोतरी हुई। सीख: हमेशा कैशलेस का ऑप्शन चुनें और क्लेम के लिए एडवांस में इंफॉर्म करें।',
    readTime: 5,
    keyTakeaways: [
      'हर हॉस्पिटलाइजेशन से पहले या 24 घंटे में क्लेम इंटीमेट करें',
      'IRDAI के नियमों के अनुसार, कैशलेस क्लेम के लिए एप्रूवल 1 घंटे में मिलना चाहिए',
      'CSR और TAT (Turn Around Time) पर ध्यान दें प्लान चुनते समय',
    ],
    source: 'PayBima 2025',
  },
  {
    id: 'article-002',
    title: '₹1000 प्रति माह में कैसे मिलता है 1 करोड़ का टर्म कवर?',
    category: 'Life',
    excerpt: 'टर्म इंश्योरेंस के प्रीमियम बहुत कम होते हैं। एक 30 साल के युवा के लिए ₹1 करोड़ का टर्म प्लान ₹500 से ₹700 प्रति माह में मिल जाता है।',
    readTime: 4,
    keyTakeaways: [
      'टर्म प्लान सिर्फ आय की सुरक्षा के लिए है, निवेश के लिए नहीं',
      'कम उम्र में लेने पर प्रीमियम बहुत कम हो जाता है',
      '₹1 Cr cover: HDFC Life ~₹933/mo, Max Life ~₹867/mo, SBI Life ~₹800/mo',
    ],
    source: 'Outlook Money 2025',
  },
  {
    id: 'article-003',
    title: 'कार इंश्योरेंस समझें: थर्ड पार्टी बनाम कॉम्प्रिहेंसिव',
    category: 'Motor',
    excerpt: 'थर्ड पार्टी इंश्योरेंस कानूनी तौर पर ज़रूरी है, लेकिन यह आपकी खुद की कार को कवर नहीं करता। कॉम्प्रिहेंसिव पॉलिसी में ज़ीरो डेप्रिसिएशन, RSA और इंजन कवर जैसे ऐड-ऑन जोड़े जा सकते हैं।',
    readTime: 3,
    keyTakeaways: [
      'कॉम्प्रिहेंसिव प्लान से IDV और ऐड-ऑन का ज्ञान भी महत्वपूर्ण है',
      'Zero Depreciation add-on new cars ke liye must hai',
      'NCB (No Claim Bonus) se 50% tak discount mil sakta hai',
    ],
    source: 'IRDAI 2025',
  },
  {
    id: 'article-004',
    title: 'How to Claim Health Insurance in India — Step by Step',
    category: 'Health',
    excerpt: 'Step-by-step guide: Intimate claim → Choose type (Cashless vs Reimbursement) → Submit documents → Insurer processes claim. IRDAI 2025 rules mandate 1-hour cashless approval.',
    readTime: 6,
    keyTakeaways: [
      'Pre-authorization for cashless claims must be approved within 1 hour as per IRDAI 2025 rules',
      'Keep copies of all medical documents and bills for reimbursement claims',
      'Discharge summary is the most critical document for claim processing',
    ],
    source: 'HDFC ERGO 2025',
  },
  {
    id: 'article-005',
    title: 'डायबिटीज़ और BP के लिए स्पेशल इंश्योरेंस प्लान 2025',
    category: 'Health',
    excerpt: 'IRDAI 2024 नियमों के बाद अब डायबिटीज़ और BP मरीजों के लिए विशेष प्लान उपलब्ध हैं — HDFC ERGO Energy, Star Diabetes Safe, और Aditya Birla Activ Health।',
    readTime: 5,
    keyTakeaways: [
      'HDFC ERGO Energy: Day 1 coverage, HbA1c checkup reimbursed, ~₹650/month',
      'Star Diabetes Safe: Zero-day waiting for Plan B, Diabetes care package, ~₹580/month',
      'Aditya Birla Activ Health: 30-day waiting, 100% restoration, Health rewards',
    ],
    source: 'Market Research 2025',
  },
  {
    id: 'article-006',
    title: 'Section 80D: हेल्थ इंश्योरेंस से टैक्स बचाने का पूरा गाइड',
    category: 'General',
    excerpt: 'Section 80D में ₹25,000 (self/family) + ₹25,000 (parents) = कुल ₹50,000 तक की छूट। Senior parents के लिए ₹50,000 — यानी कुल ₹75,000 तक टैक्स बचाना संभव।',
    readTime: 4,
    keyTakeaways: [
      'Self + family: ₹25,000 deduction under 80D',
      'Parents (senior citizen): ₹50,000 additional deduction',
      'Preventive health checkup: ₹5,000 within overall limit',
    ],
    source: 'Income Tax Act 2025-26',
  },
];

// ============================================================================
// MYTH-BUSTERS Section Data
// ============================================================================
export interface MythBuster {
  id: string;
  myth: string;
  mythHi?: string;
  fact?: string;
  reality?: string;
  stat?: string;
  statistic?: string;
  source?: string;
  category?: 'health' | 'life' | 'motor' | 'general';
}

export const mythBusters: MythBuster[] = [
  {
    id: 'myth-001',
    myth: 'सिर्फ बुजुर्गों को ही हेल्थ इंश्योरेंस की ज़रूरत होती है।',
    fact: 'यह सबसे बड़ा मिथ है। 65% पॉलिसी होल्डर अपनी पॉलिसी को सही से समझ नहीं पाते। युवाओं में भी अनहेल्दी लाइफस्टाइल की वजह से बीमारियों का खतरा काफी बढ़ गया है। कम उम्र में पॉलिसी लेने से प्रीमियम भी कम आता है।',
    category: 'health',
    source: 'India Today / PolicyBachat 2025',
    statistic: '65% policyholders don\'t fully understand their policy',
  },
  {
    id: 'myth-002',
    myth: 'हेल्थ इंश्योरेंस के क्लेम बहुत रिजेक्ट होते हैं।',
    fact: '2025-26 IRDAI के डेटा के अनुसार, स्टैंडअलोन हेल्थ इंश्योरेंस (SAHI) का क्लेम सेटलमेंट रेश्यो 99% के ऊपर है। लेकिन इसके बावजूद हेल्थ इंश्योरेंस क्लेम में रिजेक्शन की शिकायतों में 14.5% की बढ़ोतरी हुई है। इसलिए कंपनी के CSR पर ध्यान देना बहुत जरूरी है।',
    category: 'health',
    source: 'IRDAI Annual Report 2025-26 / Business Standard',
    statistic: 'SAHI CSR 99%+ but complaints up 14.5%',
  },
  {
    id: 'myth-003',
    myth: 'मेरे पास पहले से कंपनी का इंश्योरेंस है, मुझे अलग से लेने की ज़रूरत नहीं है।',
    fact: 'कंपनी का इंश्योरेंस (ग्रुप हेल्थ पॉलिसी) आमतौर पर बेसिक होता है। उसके कवर की सीमाएं (सब-लिमिट्स) होती हैं और जॉब छोड़ने के बाद यह पॉलिसी खत्म हो जाती है। रिटायरमेंट के बाद कोई कवर नहीं होता। इसलिए हमेशा एक व्यक्तिगत हेल्थ पॉलिसी ज़रूर लेनी चाहिए।',
    category: 'health',
    source: 'PolicyBachat / Finowings 2025',
    statistic: 'Group policies end when you leave the job',
  },
  {
    id: 'myth-004',
    myth: 'हेल्थ इंश्योरेंस और क्रिटिकल इलनेस का कवर एक ही है।',
    fact: 'यह दोनों अलग-अलग हैं। हेल्थ इंश्योरेंस हॉस्पिटलाइजेशन के खर्चों को कवर करता है, जबकि क्रिटिकल इलनेस पॉलिसी डायग्नोसिस मिलते ही लम्पसम एक बड़ी रकम दे देती है, जिसका इस्तेमाल आप अपनी मर्जी से कर सकते हैं, भले ही आप हॉस्पिटल एडमिट न हुए हों।',
    category: 'health',
    source: 'Canara HSBC 2025',
  },
  {
    id: 'myth-005',
    myth: 'Term insurance का पैसा बर्बाद है — अगर कुछ नहीं हुआ तो पैसे डूब जाते हैं।',
    fact: 'Term insurance सबसे सस्ता जीवन बीमा है — ₹1 करोड का कवर ₹500-700/माह में मिलता है। यह investment नहीं, protection है। अगर कुछ नहीं हुआ तो यह खुशी की बात है! Investment के लिए mutual funds अलग से लें।',
    category: 'life',
    source: 'Outlook Money 2025',
    statistic: '₹1 Cr term cover from just ₹500-700/month for age 30',
  },
  {
    id: 'myth-006',
    myth: 'थर्ड पार्टी इंश्योरेंस काफी है, कॉम्प्रिहेंसिव की ज़रूरत नहीं।',
    fact: 'थर्ड पार्टी इंश्योरेंस कानूनी तौर पर ज़रूरी है, लेकिन यह आपकी खुद की कार को कवर नहीं करता। कॉम्प्रिहेंसिव पॉलिसी में ज़ीरो डेप्रिसिएशन, RSA और इंजन कवर जैसे ऐड-ऑन जोड़े जा सकते हैं जो बड़े accident में बचाते हैं।',
    category: 'motor',
    source: 'IRDAI 2025',
  },
  {
    id: 'myth-007',
    myth: 'ऑनलाइन खरीदी गई पॉलिसी पर क्लेम नहीं मिलता।',
    fact: 'ऑनलाइन और ऑफलाइन पॉलिसी में क्लेम प्रोसेस बिल्कुल एक जैसा है। IRDAI के नियम दोनों पर समान लागू होते हैं। ऑनलाइन पॉलिसी अक्सर सस्ती होती है क्योंकि agent commission नहीं होता।',
    category: 'general',
    source: 'IRDAI Guidelines 2025',
  },
  {
    id: 'myth-008',
    myth: 'अगर मुझे डायबिटीज़ है तो मुझे हेल्थ इंश्योरेंस नहीं मिलेगा।',
    fact: 'IRDAI 2024 के नियमों के अनुसार, डायबिटीज़ और BP जैसी बीमारियों के लिए अब specific disease plans उपलब्ध हैं। HDFC ERGO Energy, Star Diabetes Safe जैसे प्लान Day 1 से कवर देते हैं।',
    category: 'health',
    source: 'IRDAI 2024 / Market Research 2025',
    statistic: 'HDFC ERGO Energy, Star Diabetes Safe — Day 1 coverage for diabetes',
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
// INSURANCE COMPANY PERFORMANCE DATA (IRDAI 2025-26)
// ============================================================================

export interface InsuranceCompany {
  name: string;
  category: 'health' | 'life' | 'motor' | 'general';
  csr2026: number; // Claim Settlement Ratio %
  icr2026?: number; // Incurred Claim Ratio %
  solvencyRatio: number;
  networkHospitals?: number;
  premium1crTerm?: string; // Monthly premium for ₹1 Cr term plan (30yr male)
  features: string[];
  complaintsData: string;
  rating: number;
}

export const insuranceCompanies: InsuranceCompany[] = [
  // Health & General Insurers
  {
    name: 'Acko General Insurance',
    category: 'health',
    csr2026: 99.98,
    icr2026: 57.82,
    solvencyRatio: 1.7,
    networkHospitals: 10000,
    features: ['Digital-first claims', 'Cashless everywhere', 'Quick settlement', 'No room rent limit'],
    complaintsData: '15 per 10,000 policies',
    rating: 4.7,
  },
  {
    name: 'HDFC ERGO General Insurance',
    category: 'health',
    csr2026: 98.85,
    icr2026: 84.85,
    solvencyRatio: 1.9,
    networkHospitals: 10000,
    features: ['Optima Restore', '100% Sum Insured Restoration', 'Fastest claim approval TAT', 'No claim bonus up to 100%'],
    complaintsData: '10.67 per 10,000 policies',
    rating: 4.7,
  },
  {
    name: 'Care Health Insurance',
    category: 'health',
    csr2026: 99.95,
    icr2026: 58.68,
    solvencyRatio: 1.8,
    networkHospitals: 21700,
    features: ['Largest network: 21,700+ hospitals', 'Care Supreme plan', 'Ayurveda coverage', 'Health checkup included'],
    complaintsData: '27.06 per 10,000 policies',
    rating: 4.6,
  },
  {
    name: 'Star Health & Allied Insurance',
    category: 'health',
    csr2026: 99.81,
    icr2026: 67.26,
    solvencyRatio: 2.1,
    networkHospitals: 14000,
    features: ['Standalone health insurer', 'Diabetes care package', 'Maternity cover', 'Family Health Optima'],
    complaintsData: '52.31 per 10,000 policies',
    rating: 4.3,
  },
  {
    name: 'Niva Bupa Health Insurance',
    category: 'health',
    csr2026: 100.00,
    icr2026: 58.10,
    solvencyRatio: 1.9,
    networkHospitals: 10000,
    features: ['ReAssure 2.0', '100% CSR (3-month data)', 'Health return benefit', 'Wellness benefits'],
    complaintsData: '42.85 per 10,000 policies',
    rating: 4.5,
  },
  {
    name: 'Bajaj Allianz General Insurance',
    category: 'health',
    csr2026: 98.56,
    icr2026: 87.31,
    solvencyRatio: 3.0,
    networkHospitals: 8500,
    features: ['Health Guard plan', 'Wellness program', 'NCB up to 50%', 'Highest solvency ratio (3.0)'],
    complaintsData: '25 per 10,000 policies',
    rating: 4.5,
  },
  {
    name: 'ICICI Lombard General Insurance',
    category: 'health',
    csr2026: 98.45,
    icr2026: 82.24,
    solvencyRatio: 1.8,
    networkHospitals: 7500,
    features: ['Elevate plan', 'Global coverage add-on', 'Telemedicine', 'Complete Health Insurance'],
    complaintsData: '27.06 per 10,000 policies',
    rating: 4.4,
  },
  {
    name: 'TATA AIG General Insurance',
    category: 'health',
    csr2026: 94.14,
    icr2026: 76.24,
    solvencyRatio: 2.0,
    networkHospitals: 6500,
    features: ['MediCare plan', 'Critical illness rider', 'Health coach', 'TATA brand trust'],
    complaintsData: '20 per 10,000 policies',
    rating: 4.6,
  },
  {
    name: 'Aditya Birla Health Insurance',
    category: 'health',
    csr2026: 99.41,
    icr2026: 59.18,
    solvencyRatio: 1.8,
    networkHospitals: 10000,
    features: ['Activ One plan', 'Chronic management program', 'HealthReturns reward', 'Day 1 PED cover (select plans)'],
    complaintsData: '34.12 per 10,000 policies',
    rating: 4.5,
  },
  // Life Insurers
  {
    name: 'HDFC Life Insurance',
    category: 'life',
    csr2026: 99.7,
    solvencyRatio: 2.1,
    premium1crTerm: '₹933/month',
    features: ['Click2Protect Super', 'Return of premium option', 'Critical illness rider', 'Flexible payout options'],
    complaintsData: 'Low complaints ratio',
    rating: 4.8,
  },
  {
    name: 'Max Life Insurance',
    category: 'life',
    csr2026: 99.6,
    solvencyRatio: 2.1,
    premium1crTerm: '₹867/month',
    features: ['Smart Term Plan', 'Critical illness add-on', 'Waiver of premium', 'Smart Secure Plus'],
    complaintsData: 'Low complaints ratio',
    rating: 4.7,
  },
  {
    name: 'ICICI Prudential Life',
    category: 'life',
    csr2026: 99.5,
    solvencyRatio: 2.0,
    premium1crTerm: '₹908/month',
    features: ['iProtect Smart', 'Multiple life stage cover', 'Critical illness', 'Wealth+protection'],
    complaintsData: 'Low complaints ratio',
    rating: 4.6,
  },
  {
    name: 'SBI Life Insurance',
    category: 'life',
    csr2026: 98.9,
    solvencyRatio: 2.0,
    premium1crTerm: '₹800/month',
    features: ['eShield Next', 'Government-backed trust', 'Lowest premium ₹1 Cr term', 'Multi-protection rider'],
    complaintsData: 'Moderate complaints',
    rating: 4.7,
  },
  {
    name: 'Bajaj Allianz Life',
    category: 'life',
    csr2026: 99.3,
    solvencyRatio: 5.41,
    premium1crTerm: '₹825/month',
    features: ['eTouch Term Plan', 'Highest solvency ratio (5.41)', 'Payout options', 'Accidental death cover'],
    complaintsData: 'Low complaints',
    rating: 4.5,
  },
  {
    name: 'Tata AIA Life',
    category: 'life',
    csr2026: 99.4,
    solvencyRatio: 2.2,
    premium1crTerm: '₹892/month',
    features: ['Sampoorna Raksha', 'Critical illness', 'Accidental disability', 'TATA brand trust'],
    complaintsData: 'Low complaints',
    rating: 4.6,
  },
  {
    name: 'LIC of India',
    category: 'life',
    csr2026: 98.52,
    solvencyRatio: 1.9,
    premium1crTerm: '₹950/month',
    features: ['Tech Term plan', 'India\'s most trusted brand', 'Sarkari guarantee', 'Largest claim settlement in India'],
    complaintsData: 'Moderate complaints',
    rating: 4.5,
  },
];

// ============================================================================
// DISEASE-SPECIFIC INSURANCE PLANS
// ============================================================================

export interface DiseaseSpecificPlan {
  name: string;
  insurer: string;
  disease: string;
  features: string[];
  startingPremium: string;
  waitingPeriod: string;
  source: string;
}

export const diseaseSpecificPlans: DiseaseSpecificPlan[] = [
  {
    name: 'HDFC ERGO Energy',
    insurer: 'HDFC ERGO',
    disease: 'Diabetes & BP',
    features: ['Day 1 coverage for Diabetes & BP', 'HbA1c checkup reimbursed', 'No co-payment', 'Wellness rewards'],
    startingPremium: '₹650/month',
    waitingPeriod: 'Day 1 (no waiting for diabetes/BP)',
    source: 'Market Research 2025',
  },
  {
    name: 'Star Diabetes Safe (Plan A/B)',
    insurer: 'Star Health',
    disease: 'Diabetes',
    features: ['Plan B: Zero-day waiting period', 'Diabetes care package', 'Regular health checkups', 'Dialysis cover'],
    startingPremium: '₹580/month',
    waitingPeriod: 'Plan A: 12 months, Plan B: Day 1',
    source: 'Market Research 2025',
  },
  {
    name: 'Aditya Birla Activ Health (Diabetes)',
    insurer: 'Aditya Birla Health',
    disease: 'Diabetes',
    features: ['30-day waiting period', '100% Sum Insured restoration', 'Health returns', 'Wellness rewards program'],
    startingPremium: '₹700/month',
    waitingPeriod: '30 days',
    source: 'Market Research 2025',
  },
];

// ============================================================================
// MARKET COMPARISON DATA (Health Plans)
// ============================================================================

export interface MarketComparison {
  planName: string;
  insurer: string;
  coverage: string;
  premium: string;
  waitingPeriod: string;
  uniqueBenefits: string[];
  csr: number;
  category: 'health' | 'life' | 'motor';
}

export const marketComparisons: MarketComparison[] = [
  {
    planName: 'HDFC ERGO Optima Restore',
    insurer: 'HDFC ERGO',
    coverage: '₹5L - ₹50L',
    premium: '₹13,500/year (₹5L cover)',
    waitingPeriod: '30 days initial, 24-48 months PED',
    uniqueBenefits: ['100% Sum Insured Restoration', 'No Claim Bonus up to 100%', 'Fastest claim approval TAT'],
    csr: 98.85,
    category: 'health',
  },
  {
    planName: 'Star Family Health Optima',
    insurer: 'Star Health',
    coverage: '₹5L - ₹25L',
    premium: '₹10,200/year (₹10L cover)',
    waitingPeriod: '30 days initial, 36 months PED',
    uniqueBenefits: ['NCB up to 100%', 'Automatic restoration', 'Maternity cover add-on'],
    csr: 99.81,
    category: 'health',
  },
  {
    planName: 'Niva Bupa Health Companion',
    insurer: 'Niva Bupa',
    coverage: '₹3L - ₹25L',
    premium: '₹11,000/year (₹5L cover)',
    waitingPeriod: '30 days initial, 24 months PED',
    uniqueBenefits: ['Lifetime renewability', 'Health return benefit', 'Wellness benefits', '100% CSR'],
    csr: 100.00,
    category: 'health',
  },
  {
    planName: 'Care Supreme',
    insurer: 'Care Health',
    coverage: '₹5L - ₹25L',
    premium: '₹9,800/year (₹5L cover)',
    waitingPeriod: '30 days initial, 24 months PED',
    uniqueBenefits: ['21,700+ network hospitals', 'Unlimited restoration', 'AYUSH coverage', 'Health checkup'],
    csr: 99.95,
    category: 'health',
  },
  {
    planName: 'ACKO Platinum',
    insurer: 'Acko General',
    coverage: '₹5L - ₹1Cr',
    premium: '₹6,200/year (₹5L cover)',
    waitingPeriod: '30 days initial, 24 months PED',
    uniqueBenefits: ['No room rent limit', 'Cashless everywhere', 'Digital claims in minutes', 'No co-pay'],
    csr: 99.98,
    category: 'health',
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
      const searchable = `${article.title} ${article.titleHi || ''} ${article.summary || ''} ${(article.keyPoints || []).join(' ')} ${article.category}`.toLowerCase();
      words.forEach(word => {
        if (searchable.includes(word)) score += 1;
      });
      return {
        entry: {
          id: `blog-${article.id}`,
          topic: article.title,
          question: article.titleHi,
          answer: `${article.summary || ''} Key points: ${(article.keyPoints || []).join('. ')}`,
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
      const searchable = `${myth.myth} ${myth.mythHi || ''} ${myth.reality || myth.fact || ''} ${myth.stat || myth.statistic || ''} ${myth.source || ''}`.toLowerCase();
      words.forEach(word => {
        if (searchable.includes(word)) score += 1;
      });
      return {
        entry: {
          id: `myth-${myth.id}`,
          topic: `Myth: ${myth.myth}`,
          question: myth.mythHi,
          answer: `Reality: ${myth.reality || myth.fact || ''} Stat: ${myth.stat || myth.statistic || ''} Source: ${myth.source || ''}`,
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

// ============================================================================
// MARKET TRENDS 2026 — Premium Hikes, Growth Data, Tech Shifts
// Source: IRDAI Annual Report 2025-26, Industry Research 2025
// ============================================================================
export interface MarketTrend {
  id: string;
  title: string;
  titleHi: string;
  category: 'premium-hike' | 'market-growth' | 'tech-shift' | 'regulatory' | 'consumer-behavior';
  summary: string;
  summaryHi: string;
  data: string[];
  impact: string;
  impactHi: string;
  source: string;
  year: string;
}

export const marketTrends2026: MarketTrend[] = [
  {
    id: 'trend-001',
    title: 'Health Insurance Premium Hike 10-15%',
    titleHi: 'हेल्थ इंश्योरेंस प्रीमियम में 10-15% की बढ़ोतरी',
    category: 'premium-hike',
    summary: 'Experts predict 10-15% premium hikes in the next 12-18 months due to medical inflation at 14-15%, aging population, and increased claim volumes.',
    summaryHi: 'अगले 12-18 महीनों में हेल्थ इंश्योरेंस प्रीमियम 10-15% तक बढ़ सकते हैं। इसकी वजहें हैं — 14-15% की मेडिकल इंफ्लेशन, बढ़ती उम्र की आबादी और क्लेम में वृद्धि।',
    data: [
      'Medical inflation: 14-15% annually',
      'Hospital costs up 12-18% YoY',
      'Claim frequency increased 22% post-COVID',
      'Standalone health insurers saw 19% growth in FY26',
    ],
    impact: 'If your premium is ₹10,000/year, expect it to rise to ₹11,000-11,500. Buy now to lock in lower rates.',
    impactHi: 'अगर आपका प्रीमियम ₹10,000/साल है, तो यह ₹11,000-11,500 हो सकता है। अभी खरीदकर कम दरें लॉक करें।',
    source: 'IRDAI Annual Report 2025-26 / Business Standard',
    year: '2025-26',
  },
  {
    id: 'trend-002',
    title: 'Non-Life Insurance Industry Crosses ₹3.36 Lakh Crore',
    titleHi: 'नॉन-लाइफ इंश्योरेंस इंडस्ट्री ₹3.36 लाख करोड़ पार',
    category: 'market-growth',
    summary: 'FY26 mein non-life insurance industry gross direct premium of ₹3.36 Lakh Crore tak pahunch gayi. Standalone health insurers ne sabse tez growth dikhayi — 19%.',
    summaryHi: 'FY26 में नॉन-लाइफ इंश्योरेंस इंडस्ट्री ₹3.36 लाख करोड़ के ग्रॉस डायरेक्ट प्रीमियम पर पहुंच गई। स्टैंडअलोन हेल्थ इंश्योरर्स ने 19% की सबसे तेज़ ग्रोथ दिखाई।',
    data: [
      'Non-life GWP: ₹3.36 Lakh Crore (FY26)',
      'Health insurance = 41% of non-life industry (up from 29% in FY20)',
      'Standalone health insurers growth: 19% (FY26)',
      'Motor insurance share declining: from 38% to 28%',
    ],
    impact: 'Health insurance is becoming the dominant segment. More competition = better products, but premiums may rise.',
    impactHi: 'हेल्थ इंश्योरेंस अब सबसे बड़ा सेगमेंट बन गया है। ज्यादा competition = बेहतर products, लेकिन premium बढ़ सकता है।',
    source: 'IRDAI Annual Report 2025-26',
    year: '2025-26',
  },
  {
    id: 'trend-003',
    title: 'AI & InsurTech Revolution — 1-Hour Cashless Claims',
    titleHi: 'AI और इंश्योरटेक क्रांति — 1 घंटे में कैशलेस क्लेम',
    category: 'tech-shift',
    summary: 'India is the 2nd largest InsurTech market in Asia-Pacific. Companies adopting AI and automation tools — cashless approval in 1 hour, discharge in 3 hours.',
    summaryHi: 'भारत एशिया-पैसिफिक में दूसरा सबसे बड़ा इंश्योरटेक मार्केट है। कंपनियां AI और क्लेम ऑटोमेशन अपना रही हैं — 1 घंटे में कैशलेस मंजूरी, 3 घंटे में डिस्चार्ज।',
    data: [
      'India: 2nd largest InsurTech market in APAC',
      'Cashless claim approval: now within 1 hour (IRDAI mandate)',
      'Discharge time: reduced to 3 hours',
      'AI-powered claim assessment: 85% accuracy in auto-approval',
      'Digital-first insurers (Acko, Digit) growing 3x faster',
    ],
    impact: 'Faster claims mean better experience. Choose digital-first insurers for quickest settlement.',
    impactHi: 'तेज़ क्लेम = बेहतर अनुभव। सबसे तेज़ सेटलमेंट के लिए डिजिटल-फर्स्ट इंश्योरर चुनें।',
    source: 'IRDAI 2025-26 / NASSCOM InsurTech Report',
    year: '2025-26',
  },
  {
    id: 'trend-004',
    title: 'Health Insurance Now 41% of Non-Life Industry',
    titleHi: 'हेल्थ इंश्योरेंस अब नॉन-लाइफ इंडस्ट्री का 41%',
    category: 'market-growth',
    summary: 'Health insurance has overtaken motor as the largest segment — from 29% in FY20 to 41% in FY26. This is a major structural shift in Indian insurance.',
    summaryHi: 'हेल्थ इंश्योरेंस ने मोटर को पीछे छोड़ दिया — FY20 में 29% से बढ़कर FY26 में 41%। यह भारतीय इंश्योरेंस में बड़ा बदलाव है।',
    data: [
      'Health insurance share: 29% (FY20) → 41% (FY26)',
      'Motor insurance share: 38% (FY20) → 28% (FY26)',
      'COVID accelerated health insurance adoption by 3-5 years',
      'Group health segment growing 25% annually',
    ],
    impact: 'More health products and better coverage options available now than ever before.',
    impactHi: 'अब पहले से कहीं ज्यादा हेल्थ प्रोडक्ट्स और बेहतर कवरेज उपलब्ध हैं।',
    source: 'IRDAI Annual Report 2025-26',
    year: '2025-26',
  },
  {
    id: 'trend-005',
    title: 'GST Exemption on Retail Health Insurance',
    titleHi: 'रिटेल हेल्थ इंश्योरेंस पर GST में छूट',
    category: 'regulatory',
    summary: 'Government considering GST rate reduction from 18% to 5-12% on retail health insurance premiums. This could save ₹2,000-5,000 per year on typical policies.',
    summaryHi: 'सरकार रिटेल हेल्थ इंश्योरेंस प्रीमियम पर GST दर 18% से घटाकर 5-12% करने पर विचार कर रही है। इससे सामान्य पॉलिसी पर ₹2,000-5,000/साल की बचत हो सकती है।',
    data: [
      'Current GST on health insurance: 18%',
      'Proposed GST: 5-12% for retail health policies',
      'Potential savings: ₹2,000-5,000/year on typical ₹15,000-30,000 policy',
      'Group health policies may also get relief',
    ],
    impact: 'If GST reduces, insurance becomes significantly cheaper. Wait for announcement before renewing.',
    impactHi: 'अगर GST कम हुआ तो इंश्योरेंस काफी सस्ता हो जाएगा। नवीनीकरण से पहले ऐलान का इंतजार करें।',
    source: 'Finance Ministry / IRDAI 2025-26',
    year: '2025-26',
  },
  {
    id: 'trend-006',
    title: 'Young India Buying Insurance Online',
    titleHi: 'युवा भारत ऑनलाइन इंश्योरेंस खरीद रहा है',
    category: 'consumer-behavior',
    summary: '72% of new insurance policies in FY26 were bought online. The average buyer age has dropped from 38 to 31 years. WhatsApp-based insurance sales growing 4x year-on-year.',
    summaryHi: 'FY26 में 72% नई पॉलिसी ऑनलाइन खरीदी गई। खरीदार की औसत उम्र 38 से 31 साल हो गई। WhatsApp पर इंश्योरेंस बिक्री सालाना 4 गुना बढ़ रही है।',
    data: [
      '72% new policies bought online in FY26',
      'Average buyer age: 31 years (down from 38)',
      'WhatsApp insurance sales: 4x YoY growth',
      'Tier-2/3 cities driving 60% of new online purchases',
      'Video-based claims filing growing rapidly',
    ],
    impact: 'Digital-first is the future. Choose insurers with strong app/web experience for best service.',
    impactHi: 'डिजिटल-फर्स्ट भविष्य है। सबसे अच्छी सेवा के लिए मजबूत ऐप/वेब वाले इंश्योरर चुनें।',
    source: 'IRDAI Annual Report / Digital India Survey 2025',
    year: '2025-26',
  },
];

// ============================================================================
// IRDAI REGULATIONS 2025-26 — Latest Guidelines
// Source: IRDAI Official Gazette Notifications 2025
// ============================================================================
export interface IrdaiRegulation {
  id: string;
  title: string;
  titleHi: string;
  category: 'ped' | 'moratorium' | 'claims' | 'gst' | 'consumer-protection' | 'portability';
  effectiveDate: string;
  summary: string;
  summaryHi: string;
  beforeChange: string;
  afterChange: string;
  impactLevel: 'critical' | 'high' | 'medium';
  userAction: string;
  userActionHi: string;
  source: string;
}

export const irdaiRegulations2025: IrdaiRegulation[] = [
  {
    id: 'reg-001',
    title: 'PED Waiting Period Reduced to Max 36 Months',
    titleHi: 'PED वेटिंग पीरियड अब ज्यादा से ज्यादा 36 महीने',
    category: 'ped',
    effectiveDate: 'April 2025',
    summary: 'IRDAI has capped the waiting period for Pre-Existing Diseases (PED) at 36 months maximum. Earlier, some policies had 48-month waiting periods.',
    summaryHi: 'IRDAI ने प्री-एक्जिस्टिंग डिजीज (PED) के लिए वेटिंग पीरियड ज्यादा से ज्यादा 36 महीने तक सीमित कर दिया है। पहले कुछ पॉलिसी में 48 महीने का वेटिंग था।',
    beforeChange: 'PED waiting period: up to 48 months',
    afterChange: 'PED waiting period: maximum 36 months',
    impactLevel: 'critical',
    userAction: 'Check your policy — if it shows 48-month PED waiting, ask your insurer to align with the new IRDAI rule. New policies must comply automatically.',
    userActionHi: 'अपनी पॉलिसी चेक करें — अगर 48 महीने का PED वेटिंग दिखे, तो इंश्योरर से नए IRDAI नियम के हिसाब से बदलाव मांगें।',
    source: 'IRDAI Gazette Notification 2025',
  },
  {
    id: 'reg-002',
    title: 'Moratorium Period Reduced from 8 to 5 Years',
    titleHi: 'मोरेटोरियम पीरियड 8 साल से घटाकर 5 साल',
    category: 'moratorium',
    effectiveDate: 'April 2025',
    summary: 'After 5 years of continuous coverage, insurers cannot investigate your medical history or reject claims based on non-disclosure. Previously this was 8 years.',
    summaryHi: '5 साल तक लगातार कवरेज के बाद, इंश्योरर आपकी मेडिकल हिस्ट्री जांच नहीं कर सकते या नॉन-डिस्क्लोजर के आधार पर क्लेम रिजेक्ट नहीं कर सकते। पहले यह 8 साल था।',
    beforeChange: 'Moratorium period: 8 years',
    afterChange: 'Moratorium period: 5 years',
    impactLevel: 'critical',
    userAction: 'If you have 5+ years of continuous coverage, your insurer cannot reject claims. Make sure you renew on time every year.',
    userActionHi: 'अगर आपके पास 5+ साल का लगातार कवरेज है, तो इंश्योरर क्लेम रिजेक्ट नहीं कर सकता। हर साल समय पर रिन्यू करें।',
    source: 'IRDAI Gazette Notification 2025',
  },
  {
    id: 'reg-003',
    title: 'Cashless Claim Approval Within 1 Hour',
    titleHi: 'कैशलेस क्लेम 1 घंटे में मंजूर',
    category: 'claims',
    effectiveDate: 'January 2025',
    summary: 'IRDAI mandates that all cashless claim pre-authorization requests must be processed within 1 hour. Discharge must happen within 3 hours of final bill submission.',
    summaryHi: 'IRDAI ने अनिवार्य किया कि सभी कैशलेस क्लेम प्री-ऑथराइज़ेशन 1 घंटे में प्रोसेस हों। डिस्चार्ज फाइनल बिल जमा करने के 3 घंटे में होना चाहिए।',
    beforeChange: 'Cashless approval: 4-24 hours',
    afterChange: 'Cashless approval: maximum 1 hour',
    impactLevel: 'critical',
    userAction: 'If your insurer takes more than 1 hour for cashless approval, file a complaint on IRDAI portal (igms.irda.gov.in).',
    userActionHi: 'अगर इंश्योरर 1 घंटे से ज्यादा लेता है, तो IRDAI पोर्टल (igms.irda.gov.in) पर शिकायत दर्ज करें।',
    source: 'IRDAI Protection of Policyholders 2025',
  },
  {
    id: 'reg-004',
    title: 'No Claim Rejection Without Giving Reason',
    titleHi: 'बिना कारण बताए क्लेम रिजेक्ट नहीं कर सकते',
    category: 'consumer-protection',
    effectiveDate: 'April 2025',
    summary: 'Insurers must provide detailed written reasons for claim rejection. They cannot simply say "claim denied" — must specify policy clause, investigation findings, and appeal process.',
    summaryHi: 'इंश्योरर को क्लेम रिजेक्शन की विस्तृत लिखित वजह देनी होगी। बस "क्लेम डिनाइड" नहीं बोल सकते — पॉलिसी क्लॉज, जांच निष्कर्ष और अपील प्रक्रिया बतानी होगी।',
    beforeChange: 'Insurers could reject with vague reasons',
    afterChange: 'Must specify exact clause, findings, and appeal process',
    impactLevel: 'high',
    userAction: 'If your claim is rejected without clear reason, demand written explanation. You have the right to appeal.',
    userActionHi: 'अगर क्लेम बिना स्पष्ट कारण रिजेक्ट होता है, तो लिखित स्पष्टीकरण मांगें। अपील का अधिकार आपका है।',
    source: 'IRDAI Protection of Policyholders 2025',
  },
  {
    id: 'reg-005',
    title: 'Portability Must Be Processed in 15 Days',
    titleHi: 'पोर्टेबिलिटी 15 दिन में प्रोसेस होनी चाहिए',
    category: 'portability',
    effectiveDate: 'April 2025',
    summary: 'When you switch insurers, the new insurer must process portability request within 15 days. Waiting period benefits from old policy must be carried forward.',
    summaryHi: 'जब आप इंश्योरर बदलें, तो नया इंश्योरर 15 दिन में पोर्टेबिलिटी प्रोसेस करे। पुरानी पॉलिसी के वेटिंग पीरियड बेनिफिट आगे बढ़ने चाहिए।',
    beforeChange: 'Portability processing: 30-45 days (often delayed)',
    afterChange: 'Portability processing: maximum 15 days',
    impactLevel: 'high',
    userAction: 'Apply for portability at least 45 days before renewal. New insurer must honor your accumulated waiting periods.',
    userActionHi: 'रिन्यूअल से कम से कम 45 दिन पहले पोर्टेबिलिटी अप्लाई करें। नया इंश्योरर आपका जमा वेटिंग पीरियड मानने को बाध्य है।',
    source: 'IRDAI Portability Guidelines 2025',
  },
  {
    id: 'reg-006',
    title: '500+ Day Care Procedures Must Be Covered',
    titleHi: '500+ डे केयर प्रोसीजर कवर होने अनिवार्य',
    category: 'claims',
    effectiveDate: 'April 2024',
    summary: 'IRDAI has mandated coverage for 500+ day care procedures that do not require 24-hour hospitalization — cataract, chemotherapy, dialysis, etc.',
    summaryHi: 'IRDAI ने 500+ डे केयर प्रोसीजर (जिनमें 24 घंटे अस्पताल में रहने की जरूरत नहीं) को कवर करना अनिवार्य किया — मोतियाबिंद, कीमोथेरेपी, डायलिसिस आदि।',
    beforeChange: 'Only procedures requiring 24hr hospitalization covered',
    afterChange: '500+ day care procedures must be covered',
    impactLevel: 'high',
    userAction: 'Verify your policy covers all day care procedures. If not, you can file a complaint with IRDAI.',
    userActionHi: 'जांचें कि पॉलिसी में सभी डे केयर प्रोसीजर कवर हैं। अगर नहीं, तो IRDAI में शिकायत करें।',
    source: 'IRDAI Guidelines 2024-25',
  },
  {
    id: 'reg-007',
    title: 'GST on Health Insurance Under Review',
    titleHi: 'हेल्थ इंश्योरेंस पर GST समीक्षा में',
    category: 'gst',
    effectiveDate: 'FY 2025-26 (Proposed)',
    summary: 'Government is considering reducing GST on retail health insurance from 18% to 5-12%. If approved, this could save ₹2,000-5,000 per year on a typical ₹15,000-30,000 policy.',
    summaryHi: 'सरकार रिटेल हेल्थ इंश्योरेंस पर GST 18% से घटाकर 5-12% करने पर विचार कर रही है। अगर हुआ तो ₹15,000-30,000 की पॉलिसी पर ₹2,000-5,000/साल की बचत हो सकती है।',
    beforeChange: 'GST on health insurance: 18%',
    afterChange: 'Proposed GST: 5-12% for retail health policies',
    impactLevel: 'high',
    userAction: 'Wait for GST council announcement before renewing. If GST reduces, your premium could drop 6-13%.',
    userActionHi: 'रिन्यूअल से पहले GST काउंसिल के ऐलान का इंतजार करें। अगर GST कम हुआ तो प्रीमियम 6-13% कम हो सकता है।',
    source: 'Finance Ministry / GST Council 2025',
  },
];

// ============================================================================
// STEP-BY-STEP CLAIM GUIDES
// ============================================================================
export interface ClaimGuide {
  id: string;
  title: string;
  titleHi: string;
  type: 'cashless' | 'reimbursement' | 'motor' | 'travel';
  steps: { step: number; title: string; titleHi: string; description: string; descriptionHi: string; timeRequired: string; tip?: string }[];
  documents: string[];
  timeline: string;
  commonMistakes: string[];
  escalationPath: string;
}

export const claimGuides: ClaimGuide[] = [
  {
    id: 'claim-cashless',
    title: 'Cashless Health Insurance Claim',
    titleHi: 'कैशलेस हेल्थ इंश्योरेंस क्लेम',
    type: 'cashless',
    steps: [
      { step: 1, title: 'Visit Network Hospital', titleHi: 'नेटवर्क हॉस्पिटल में जाएं', description: 'Go to any hospital in your insurer\'s network. Show your health card and ID proof at the insurance desk.', descriptionHi: 'इंश्योरर के नेटवर्क में किसी भी हॉस्पिटल में जाएं। इंश्योरेंस डेस्क पर हेल्थ कार्ड और ID प्रूफ दिखाएं।', timeRequired: '15 minutes', tip: 'Find network hospitals on your insurer\'s app or website before going.' },
      { step: 2, title: 'Pre-Authorization Request', titleHi: 'प्री-ऑथराइज़ेशन रिक्वेस्ट', description: 'Hospital sends pre-auth request to insurer/TPA with estimated treatment cost. IRDAI mandates approval within 1 hour.', descriptionHi: 'हॉस्पिटल इंश्योरर/TPA को अनुमानित खर्च के साथ प्री-ऑथ रिक्वेस्ट भेजता है। IRDAI के अनुसार 1 घंटे में एप्रूवल मिलना चाहिए।', timeRequired: '1 hour (IRDAI mandate)', tip: 'If not approved in 1 hour, call insurer helpline immediately.' },
      { step: 3, title: 'Treatment Begins', titleHi: 'इलाज शुरू', description: 'Once approved, treatment starts. Hospital directly coordinates with insurer for all bill payments.', descriptionHi: 'एप्रूवल मिलते ही इलाज शुरू। हॉस्पिटल सीधे इंश्योरर से बिल पेमेंट का कोऑर्डिनेशन करता है।', timeRequired: 'Varies by treatment' },
      { step: 4, title: 'Discharge', titleHi: 'डिस्चार्ज', description: 'Final bill sent to insurer. IRDAI mandates discharge within 3 hours of bill submission. Pay only non-covered items.', descriptionHi: 'फाइनल बिल इंश्योरर को भेजा जाता है। IRDAI के अनुसार बिल जमा करने के 3 घंटे में डिस्चार्ज होना चाहिए। सिर्फ नॉन-कवर आइटम का पेमेंट करें।', timeRequired: '3 hours (IRDAI mandate)', tip: 'Check the final bill for any items marked "not covered" before paying.' },
    ],
    documents: ['Health Card / E-Card', 'Government ID Proof', 'Policy Document', 'Pre-Authorization Form'],
    timeline: 'Total: 1-3 hours for approval + treatment duration',
    commonMistakes: [
      'Going to non-network hospital (no cashless facility)',
      'Not informing insurer within 24 hours of emergency admission',
      'Not checking room rent limits before selecting hospital room',
      'Forgetting to sign discharge documents',
    ],
    escalationPath: 'If cashless denied → Call insurer → File on igms.irda.gov.in → Approach Insurance Ombudsman',
  },
  {
    id: 'claim-reimbursement',
    title: 'Reimbursement Health Insurance Claim',
    titleHi: 'रीइम्बर्समेंट हेल्थ इंश्योरेंस क्लेम',
    type: 'reimbursement',
    steps: [
      { step: 1, title: 'Inform Insurer', titleHi: 'इंश्योरर को सूचित करें', description: 'Notify your insurer within 24-48 hours of hospitalization. Use their app, helpline, or email.', descriptionHi: 'हॉस्पिटलाइज़ेशन के 24-48 घंटे के भीतर इंश्योरर को सूचित करें। उनका ऐप, हेल्पलाइन या ईमेल इस्तेमाल करें।', timeRequired: '30 minutes', tip: 'Always inform before or immediately after admission — delays can cause rejection.' },
      { step: 2, title: 'Pay Hospital Bills', titleHi: 'हॉस्पिटल बिल भरें', description: 'Pay all bills yourself at the hospital. Collect original bills, receipts, and reports.', descriptionHi: 'हॉस्पिटल में सभी बिल खुद भरें। ओरिजिनल बिल, रसीदें और रिपोर्ट्स इकट्ठा करें।', timeRequired: 'During hospitalization' },
      { step: 3, title: 'Submit Claim Documents', titleHi: 'क्लेम डॉक्यूमेंट जमा करें', description: 'Submit claim form + all original documents to insurer within 15-30 days of discharge.', descriptionHi: 'डिस्चार्ज के 15-30 दिन के भीतर क्लेम फॉर्म + सभी ओरिजिनल डॉक्यूमेंट इंश्योरर को जमा करें।', timeRequired: '1-2 hours for document preparation' },
      { step: 4, title: 'Claim Processing', titleHi: 'क्लेम प्रोसेसिंग', description: 'Insurer processes the claim. Usually takes 15-30 days. Amount transferred to your bank account.', descriptionHi: 'इंश्योरर क्लेम प्रोसेस करता है। आमतौर पर 15-30 दिन लगते हैं। रकम आपके बैंक खाते में ट्रांसफर होती है।', timeRequired: '15-30 days', tip: 'Follow up every week if not processed within 15 days.' },
    ],
    documents: ['Claim Form (filled & signed)', 'Original Hospital Bills & Receipts', 'Discharge Summary', 'Doctor\'s Prescription & Reports', 'FIR (if accident)', 'Bank Details for Transfer', 'ID Proof & Policy Copy'],
    timeline: 'Total: 20-45 days from discharge to payment',
    commonMistakes: [
      'Not keeping original bills (photocopies not accepted)',
      'Missing discharge summary (most critical document)',
      'Submitting claim after 30-day deadline',
      'Not mentioning all treatments in claim form',
    ],
    escalationPath: 'Delayed processing → Call insurer → File on igms.irda.gov.in → Insurance Ombudsman',
  },
  {
    id: 'claim-motor',
    title: 'Motor Insurance Claim',
    titleHi: 'मोटर इंश्योरेंस क्लेम',
    type: 'motor',
    steps: [
      { step: 1, title: 'Report Accident', titleHi: 'दुर्घटना की रिपोर्ट करें', description: 'Call insurer helpline immediately. File FIR if third-party involved. Take photos of damage.', descriptionHi: 'तुरंत इंश्योरर हेल्पलाइन कॉल करें। थर्ड पार्टी शामिल हो तो FIR दर्ज कराएं। नुकसान की फोटो लें।', timeRequired: '1-2 hours', tip: 'Always take 4-5 photos from different angles at the spot.' },
      { step: 2, title: 'Surveyor Inspection', titleHi: 'सर्वेयर इंस्पेक्शन', description: 'Insurer sends surveyor to inspect damage. Surveyor estimates repair cost and approves claim amount.', descriptionHi: 'इंश्योरर सर्वेयर भेजता है नुकसान की जांच के लिए। सर्वेयर रिपेयर कॉस्ट का अनुमान लगाता है और क्लेम अमाउंट एप्रूव करता है।', timeRequired: '1-3 days', tip: 'Don\'t start repairs before surveyor inspection.' },
      { step: 3, title: 'Repair at Network Garage', titleHi: 'नेटवर्क गैराज में रिपेयर', description: 'Get vehicle repaired at a network garage for cashless settlement. Or pay and claim reimbursement.', descriptionHi: 'कैशलेस सेटलमेंट के लिए नेटवर्क गैराज में गाड़ी रिपेयर कराएं। या खुद पे करके रीइम्बर्समेंट क्लेम करें।', timeRequired: '2-7 days' },
      { step: 4, title: 'Claim Settlement', titleHi: 'क्लेम सेटलमेंट', description: 'For cashless: insurer pays garage directly. For reimbursement: submit bills and get paid within 7-15 days.', descriptionHi: 'कैशलेस: इंश्योरर सीधे गैराज को पे करता है। रीइम्बर्समेंट: बिल जमा करें और 7-15 दिन में पेमेंट पाएं।', timeRequired: '7-15 days' },
    ],
    documents: ['FIR Copy (if applicable)', 'Driving License', 'Registration Certificate (RC)', 'Insurance Policy Copy', 'Repair Estimate', 'Photos of Damage', 'Surveyor Report'],
    timeline: 'Total: 5-20 days from accident to settlement',
    commonMistakes: [
      'Starting repairs before surveyor inspection',
      'Not filing FIR in third-party accidents',
      'Driving without valid license (claim will be rejected)',
      'Not renewing policy before accident (lapsed policy = no claim)',
    ],
    escalationPath: 'Claim delay → Insurer grievance → igms.irda.gov.in → Consumer Forum',
  },
];

// ============================================================================
// RESPONSE TEMPLATES — High-Pressure Scenarios (Hinglish)
// ============================================================================
export interface ResponseTemplate {
  id: string;
  scenario: string;
  scenarioHi: string;
  trigger: string;
  response: string;
  doThis: string[];
  dontDoThis: string[];
  escalationOptions: string[];
}

export const responseTemplates: ResponseTemplate[] = [
  {
    id: 'tpl-001',
    scenario: 'Claim Rejected',
    scenarioHi: 'क्लेम रिजेक्ट हो गया',
    trigger: /claim.*reject|reject.*claim|क्लेम.*रिजेक्ट|deny|denied/i,
    response: `Mujhe bahut afsoos hai sunke ki aapka claim reject hua hai 🙏. Main samajhta hoon yeh frustrating hai, lekin aapke paas options hain:\n\n**Step 1:** Insurer se **written rejection letter** maangein — IRDAI ke according, woh reason ke bina reject nahi kar sakte.\n\n**Step 2:** Rejection reason samjhein — common reasons hain:\n• Waiting period mein treatment hua\n• PED disclose nahi kiya tha\n• Documents incomplete the\n• Policy conditions mein excluded tha\n\n**Step 3:** Agar reason galat lagta hai, toh **appeal** karein:\n• Insurer ki internal grievance cell mein complaint\n• 30 din mein jawab nahi aaye toh IRDAI portal (igms.irda.gov.in) pe complaint\n• Insurance Ombudsman se contact karein\n\n💡 **Important:** 65% rejected claims reconsideration ke baad approve ho jaate hain!`,
    doThis: ['Demand written rejection with specific clause reference', 'File appeal within 30 days', 'Keep all communication records', 'Approach IRDAI if insurer doesn\'t respond in 30 days'],
    dontDoThis: ['Don\'t accept verbal rejection', 'Don\'t give up without appealing', 'Don\'t miss the 30-day appeal window'],
    escalationOptions: ['Insurer Grievance Cell → IRDAI IGMS → Insurance Ombudsman → Consumer Forum'],
  },
  {
    id: 'tpl-002',
    scenario: 'Premium Hiked',
    scenarioHi: 'प्रीमियम बढ़ गया',
    trigger: /premium.*hike|premium.*increase|प्रीमियम.*बढ़|renewal.*expensive/i,
    response: `Haan, yeh abhi common ho raha hai 📈. 2025-26 mein health insurance premiums 10-15% badh rahe hain, lekin aapke paas options hain:\n\n**Kyun badh raha hai:**\n• Medical inflation: 14-15% annually\n• Claim frequency: 22% increase post-COVID\n• Industry growth: Health insurers ne 19% growth dikhayi\n\n**Aap kya kar sakte hain:**\n1. **Port karein** — Dusri company mein shift karein bina waiting period khoiye (15 din mein process hoga)\n2. **Top-up plan lein** — Base plan kam rakhein + top-up add karein (40-60% sasta)\n3. **Deductible badhayein** — Voluntary deductible se premium 20-30% kam hota hai\n4. **Family floater lein** — Individual plans se sasta padta hai\n5. **Long-term plan lein** — 2-3 saal ka plan lock karein, premium nahi badhega\n\n💡 **Tip:** Renewal se 45 din pehle portability apply karein — naye company mein bhi waiting period carry forward hoga!`,
    doThis: ['Compare 3-4 insurers before renewal', 'Apply portability 45 days before renewal', 'Consider super top-up for additional coverage at low cost', 'Check if NCB can reduce premium'],
    dontDoThis: ['Don\'t let policy lapse (lose all waiting period benefits)', 'Don\'t auto-renew without comparing', 'Don\'t reduce sum insured just to lower premium'],
    escalationOptions: ['Compare on Paliwal Secure → Port to better insurer → Add super top-up'],
  },
  {
    id: 'tpl-003',
    scenario: 'Senior Citizen Buying First Policy',
    scenarioHi: 'वरिष्ठ नागरिक पहली बार पॉलिसी खरीद रहे हैं',
    trigger: /senior.*citizen|elderly|60.*year|70.*year|parents.*insurance|बुजुर्ग|वरिष्ठ/i,
    response: `Bahut accha faisla hai! 🙏 Senior citizens ke liye insurance zaroori hai, aur ab IRDAI ke naye rules se yeh aur aasan ho gaya hai:\n\n**IRDAI ke naye rules (2025):**\n• PED waiting period: Ab maximum 36 mahine (pehle 48 tha)\n• Moratorium period: Ab 5 saal (pehle 8 tha) — iske baad koi bhi beemari pre-existing nahi mani jayegi\n\n**Senior citizens ke liye best options:**\n1. **Star Health Red Carpet** — 60+ ke liye special, Day 1 PED cover (select plans)\n2. **New India Assurance Senior** — Government-backed, affordable\n3. **Care Health Senior** — 21,700+ network hospitals, AYUSH cover\n4. **HDFC ERGO Optima Secure** — 100% restoration, no room rent limit\n\n**Tax benefits:**\n• Section 80D: ₹50,000 deduction (senior citizen)\n• Preventive health checkup: ₹5,000 additional\n\n💡 **Important:** Jaldi lein! Umar badhne ke saath premium badhta hai aur medical tests bhi lag sakte hain.`,
    doThis: ['Buy before age 65 (entry age limit for many plans)', 'Disclose all existing conditions honestly', 'Choose plan with shortest PED waiting period', 'Check network hospitals in your city', 'Consider family floater with spouse'],
    dontDoThis: ['Don\'t hide pre-existing conditions (claim will be rejected later)', 'Don\'t buy without checking room rent limit', 'Don\'t choose very low sum insured (minimum ₹5-10 Lakh recommended)'],
    escalationOptions: ['Compare senior-specific plans → Get expert consultation → Check policyholder.gov.in for all your policies'],
  },
  {
    id: 'tpl-004',
    scenario: 'First Time Insurance Buyer',
    scenarioHi: 'पहली बार इंश्योरेंस खरीद रहे हैं',
    trigger: /first.*time|new.*buyer|pahli.*baar|पहली.*बार|kaise.*kharidein|कैसे.*खरीदें/i,
    response: `Bahut badhiya! 🎉 Aap sahi decision le rahe hain. India mein 700M+ log uninsured hain — aap unme se nahi honge!\n\n**Step-by-step guide:**\n1. **Apni zaroorat samjhein** — Health, Life, ya Motor? (Health sabse pehle)\n2. **Budget set karein** — Monthly income ka 5-10% insurance pe invest karein\n3. **CSR dekhein** — Claim Settlement Ratio 95%+ hone chahiye\n4. **Waiting period check karein** — PED ke liye 24-36 mahine (ab max 36 as per IRDAI)\n5. **Network hospitals dekhein** — Aapke shehar mein kitne hain?\n6. **Compare karein** — Kam se kam 3 plans compare karein\n\n**Quick recommendations (beginner-friendly):**\n• **Health:** Acko Platinum (₹550/mo, 99.91% CSR, no room rent limit)\n• **Life:** SBI Life eShield (₹1,200/mo, ₹1 Cr cover, 98.5% CSR)\n• **Motor:** ICICI Lombard (₹1,899/yr, comprehensive)\n\n💡 **Pro tip:** Hamesha family floater + super top-up ka combo lein — sasta aur powerful!`,
    doThis: ['Start with health insurance (most essential)', 'Compare CSR, ICR, and solvency ratio', 'Buy young — premiums are lower', 'Read policy wording carefully', 'Use Paliwal Secure\'s AI recommendation engine'],
    dontDoThis: ['Don\'t buy the cheapest plan blindly', 'Don\'t skip reading exclusions', 'Don\'t buy investment-cum-insurance (ULIP/endowment) for pure protection', 'Don\'t buy without checking network hospitals in your area'],
    escalationOptions: ['Take our personalization quiz → Get AI recommendations → Compare top 3 plans → Consult expert'],
  },
  {
    id: 'tpl-005',
    scenario: 'Comparing Two Similar Plans',
    scenarioHi: 'दो समान प्लान तुलना कर रहे हैं',
    trigger: /compare|versus|vs|better.*plan|kaun.*sa|कौन.*सा|farq|difference/i,
    response: `Accha sawaal! Main dono plans ko 6 key parameters pe compare karta hoon:\n\n**Comparison Framework:**\n1. **CSR (Claim Settlement Ratio)** — Jitna zyada, utna reliable\n2. **ICR (Incurred Claim Ratio)** — 50-80% ideal hai (90%+ matlab company loss mein, 50% se kam matlab claim nahi deta)\n3. **Solvency Ratio** — Minimum 1.5 (IRDAI), 2.0+ accha\n4. **Network Hospitals** — Aapke shehar mein kitne?\n5. **Waiting Period** — PED ke liye kitne mahine?\n6. **Room Rent Limit** — Koi limit nahi = best\n\n**Quick decision matrix:**\n| Priority | Choose This |\n|----------|-------------|\n| Fastest claim | Acko (digital, minutes mein) |\n| Most hospitals | Care Health (21,700+) |\n| Best restoration | HDFC ERGO (100%) |\n| Lowest premium | SBI Life / LIC |\n| Highest CSR | Niva Bupa (100%) |\n\n💡 Apne specific needs bataiye — main personalized comparison kar dunga!`,
    doThis: ['Compare on CSR, ICR, solvency, network, waiting period, and room rent', 'Consider your specific needs (city, family size, medical history)', 'Check claim process ease — digital-first insurers are faster', 'Look at complaint ratio per 10,000 claims'],
    dontDoThis: ['Don\'t compare CSR across categories (health vs life CSR is calculated differently)', 'Don\'t only look at premium — cheaper may mean less coverage', 'Don\'t ignore complaint ratios — high CSR with high complaints is a red flag'],
    escalationOptions: ['Use our comparison table → Ask InsureGPT for specific comparison → Get personalized recommendation'],
  },
];
