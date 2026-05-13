// ============================================================================
// InsureGPT - Comprehensive Indian Insurance Product Data
// IRDAI-Compliant Static Data | Source: IRDAI Annual Report 2024-25
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
  // Life-specific
  ridersAvailable?: string[];
  policyTerm?: number;
  sumAssured?: number;
  // Motor-specific
  idvPercentage?: number;
  addonsAvailable?: string[];
  // Travel-specific
  coverageDays?: number;
  sumInsuredMedical?: number;
  // Data provenance
  dataSource: string;
}

// ============================================================================
// HEALTH INSURANCE PLANS (10 plans)
// Source: IRDAI Annual Report 2024-25
// ============================================================================
export const healthInsurancePlans: InsurancePlan[] = [
  {
    id: 'health-001',
    name: 'ACKO Family Health Plan',
    provider: 'ACKO General Insurance',
    category: 'health',
    premium: { monthly: 475, annual: 5700, currency: 'INR' },
    sumInsured: { min: 500000, max: 10000000, currency: 'INR' },
    claimSettlementRatio: 99.98,
    incurredClaimRatio: 90.39,
    solvencyRatio: 2.2,
    features: [
      'Day care procedures covered',
      'Pre-hospitalization (30 days)',
      'Post-hospitalization (60 days)',
      'No room rent limit',
      'Wellness add-ons available',
      'Family floater option',
      'Cashless at 8,000+ network hospitals',
      'Instant policy issuance (digital-first)',
    ],
    exclusions: ['Dental treatment', 'Cosmetic surgery', 'Weight loss procedures'],
    eligibility: { minAge: 18, maxAge: 65, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN157202000012020001',
    rating: 4.8,
    tagline: 'Digital-First Health Protection',
    recommendedFor: ['young-professional', 'family', 'digital-savvy'],
    networkHospitals: 8000,
    waitingPeriod: '30 days initial, 24 months pre-existing',
    waitingPeriodInitial: 30,
    waitingPeriodPED: 24,
    noClaimBonus: 'Cumulative bonus up to 100%',
    taxBenefit: 'Up to ₹75,000 under Section 80D',
    familyFloater: true,
    maternityCover: false,
    wellnessAddons: true,
    roomRentLimit: 'No limit',
    dataSource: 'IRDAI Annual Report 2024-25',
  },
  {
    id: 'health-002',
    name: 'HDFC ERGO Optima Restore',
    provider: 'HDFC ERGO General Insurance',
    category: 'health',
    premium: { monthly: 540, annual: 6480, currency: 'INR' },
    sumInsured: { min: 500000, max: 15000000, currency: 'INR' },
    claimSettlementRatio: 99.16,
    incurredClaimRatio: 85.33,
    solvencyRatio: 1.9,
    features: [
      'Restore benefit (100% sum insured restored)',
      'Day care procedures covered',
      'Pre & Post hospitalization',
      'Annual health check-up',
      'Deluxe room coverage',
      'Maternity cover available',
      'Wellness add-ons',
      'Cashless at 9,000+ network hospitals',
    ],
    exclusions: ['Dental treatment', 'Alternative treatments'],
    eligibility: { minAge: 18, maxAge: 65, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN108200100012008014',
    rating: 4.7,
    tagline: 'Restore Your Health, Restore Your Life',
    recommendedFor: ['family', 'high-income', 'working-professional'],
    networkHospitals: 9000,
    waitingPeriod: '30 days initial, 24 months pre-existing',
    waitingPeriodInitial: 30,
    waitingPeriodPED: 24,
    noClaimBonus: '50% cumulative bonus per year up to 100%',
    taxBenefit: 'Up to ₹75,000 under Section 80D',
    familyFloater: true,
    maternityCover: true,
    wellnessAddons: true,
    roomRentLimit: 'Deluxe room',
    dataSource: 'IRDAI Annual Report 2024-25',
  },
  {
    id: 'health-003',
    name: 'Aditya Birla Activ Health',
    provider: 'Aditya Birla Health Insurance',
    category: 'health',
    premium: { monthly: 480, annual: 5760, currency: 'INR' },
    sumInsured: { min: 300000, max: 10000000, currency: 'INR' },
    claimSettlementRatio: 92.97,
    incurredClaimRatio: 68.06,
    solvencyRatio: 2.0,
    features: [
      'Activity-based wellness rewards',
      'Day care procedures covered',
      'Pre & Post hospitalization',
      'Private room coverage',
      'Wellness add-ons with rewards',
      'Family floater option',
      'Health returns up to 30% of premium',
      'Cashless at 7,000+ network hospitals',
    ],
    exclusions: ['Dental treatment', 'Alternative treatments'],
    eligibility: { minAge: 18, maxAge: 65, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN113200100012016001',
    rating: 4.5,
    tagline: 'Active Health, Active Life',
    recommendedFor: ['young-professional', 'fitness-enthusiast', 'family'],
    networkHospitals: 7000,
    waitingPeriod: '30 days initial, 24 months pre-existing',
    waitingPeriodInitial: 30,
    waitingPeriodPED: 24,
    noClaimBonus: 'Cumulative bonus up to 100%',
    taxBenefit: 'Up to ₹75,000 under Section 80D',
    familyFloater: true,
    maternityCover: false,
    wellnessAddons: true,
    roomRentLimit: 'Private room',
    dataSource: 'IRDAI Annual Report 2024-25',
  },
  {
    id: 'health-004',
    name: 'Care Health Supreme',
    provider: 'Care Health Insurance',
    category: 'health',
    premium: { monthly: 460, annual: 5520, currency: 'INR' },
    sumInsured: { min: 500000, max: 15000000, currency: 'INR' },
    claimSettlementRatio: 93.00,
    incurredClaimRatio: 85.34,
    solvencyRatio: 1.8,
    features: [
      'Cumulative bonus up to 100%',
      'Day care procedures covered',
      'Pre & Post hospitalization',
      'Annual health check-up',
      'Single private room coverage',
      'Maternity cover available',
      'Unlimited automatic restoration',
      'Cashless at 8,500+ network hospitals',
    ],
    exclusions: ['Dental treatment', 'Alternative treatments', 'Cosmetic surgery'],
    eligibility: { minAge: 5, maxAge: 65, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN115200100012009002',
    rating: 4.7,
    tagline: 'Care Like Family',
    recommendedFor: ['family', 'senior-citizen', 'middle-income'],
    networkHospitals: 8500,
    waitingPeriod: '30 days initial, 24 months pre-existing',
    waitingPeriodInitial: 30,
    waitingPeriodPED: 24,
    noClaimBonus: 'Cumulative bonus up to 100%',
    taxBenefit: 'Up to ₹75,000 under Section 80D',
    familyFloater: true,
    maternityCover: true,
    wellnessAddons: false,
    roomRentLimit: 'Single private room',
    dataSource: 'IRDAI Annual Report 2024-25',
  },
  {
    id: 'health-005',
    name: 'Niva Bupa ReAssure 2.0',
    provider: 'Niva Bupa Health Insurance',
    category: 'health',
    premium: { monthly: 520, annual: 6240, currency: 'INR' },
    sumInsured: { min: 500000, max: 10000000, currency: 'INR' },
    claimSettlementRatio: 97.94,
    incurredClaimRatio: 85.34,
    solvencyRatio: 2.1,
    features: [
      'ReAssure benefit (unlimited restoration)',
      'Day care procedures covered',
      'Pre & Post hospitalization',
      'Annual health check-up',
      'Cumulative bonus up to 100%',
      'No room rent limit',
      'Maternity cover available',
      'Cashless at 10,000+ network hospitals',
    ],
    exclusions: ['Dental treatment', 'Alternative treatments'],
    eligibility: { minAge: 18, maxAge: 65, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN120200100012019001',
    rating: 4.6,
    tagline: 'ReAssure Your Health',
    recommendedFor: ['family', 'high-income', 'working-professional'],
    networkHospitals: 10000,
    waitingPeriod: '30 days initial, 24 months pre-existing',
    waitingPeriodInitial: 30,
    waitingPeriodPED: 24,
    noClaimBonus: 'Cumulative bonus up to 100%',
    taxBenefit: 'Up to ₹75,000 under Section 80D',
    familyFloater: true,
    maternityCover: true,
    wellnessAddons: true,
    roomRentLimit: 'No limit',
    dataSource: 'IRDAI Annual Report 2024-25',
  },
  {
    id: 'health-006',
    name: 'Star Health Family Floater',
    provider: 'Star Health and Allied Insurance',
    category: 'health',
    premium: { monthly: 399, annual: 4788, currency: 'INR' },
    sumInsured: { min: 300000, max: 10000000, currency: 'INR' },
    claimSettlementRatio: 90.00,
    incurredClaimRatio: 85.34,
    solvencyRatio: 1.8,
    features: [
      'Family floater coverage',
      'No medical check-up up to 45 years',
      'Automatic restoration of sum insured',
      'Day care procedures covered',
      'Pre & Post hospitalization',
      'AYUSH treatment covered',
      'Ambulance charges covered',
      'Cashless at 7,500+ network hospitals',
    ],
    exclusions: [
      'Pre-existing diseases (waiting period 36 months)',
      'Cosmetic surgery',
      'Self-inflicted injuries',
      'Maternity expenses (first 2 years)',
    ],
    eligibility: { minAge: 18, maxAge: 65, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN103200100012008018',
    rating: 4.4,
    tagline: 'Your Health, Our Priority',
    recommendedFor: ['family', 'budget-conscious', 'senior-citizen'],
    networkHospitals: 7500,
    waitingPeriod: '30 days initial, 36 months pre-existing',
    waitingPeriodInitial: 30,
    waitingPeriodPED: 36,
    noClaimBonus: '10% increase per claim-free year up to 100%',
    taxBenefit: 'Up to ₹75,000 under Section 80D',
    familyFloater: true,
    maternityCover: false,
    wellnessAddons: false,
    roomRentLimit: 'Single room',
    dataSource: 'IRDAI Annual Report 2024-25',
  },
  {
    id: 'health-007',
    name: 'ICICI Lombard Complete Health',
    provider: 'ICICI Lombard General Insurance',
    category: 'health',
    premium: { monthly: 500, annual: 6000, currency: 'INR' },
    sumInsured: { min: 300000, max: 10000000, currency: 'INR' },
    claimSettlementRatio: 89.48,
    incurredClaimRatio: 82.88,
    solvencyRatio: 2.0,
    features: [
      'In-patient and day care treatment',
      'Pre-hospitalization 60 days, post 180 days',
      'Ambulance charges up to ₹3,000',
      'Organ donor expenses',
      'Domiciliary treatment',
      'AYUSH treatment',
      'Air ambulance cover',
      'Cashless at 6,500+ network hospitals',
    ],
    exclusions: [
      'Pre-existing diseases (waiting period 24 months)',
      'Cosmetic treatment',
      'Non-medical items',
      'Experimental procedures',
    ],
    eligibility: { minAge: 18, maxAge: 65, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN104200100012004013',
    rating: 4.2,
    tagline: 'Complete Protection, Complete Peace',
    recommendedFor: ['family', 'working-professional'],
    networkHospitals: 6500,
    waitingPeriod: '30 days initial, 24 months pre-existing',
    waitingPeriodInitial: 30,
    waitingPeriodPED: 24,
    noClaimBonus: '5% cumulative bonus per year up to 50%',
    taxBenefit: 'Up to ₹75,000 under Section 80D',
    familyFloater: true,
    maternityCover: false,
    wellnessAddons: false,
    roomRentLimit: 'Single room',
    dataSource: 'IRDAI Annual Report 2024-25',
  },
  {
    id: 'health-008',
    name: 'ManipalCigna ProHealth Select',
    provider: 'ManipalCigna Health Insurance',
    category: 'health',
    premium: { monthly: 430, annual: 5160, currency: 'INR' },
    sumInsured: { min: 300000, max: 10000000, currency: 'INR' },
    claimSettlementRatio: 88.00,
    incurredClaimRatio: 82.88,
    solvencyRatio: 1.9,
    features: [
      'Comprehensive health coverage',
      'Day care procedures covered',
      'Pre & Post hospitalization',
      'No co-payment option',
      'AYUSH treatment covered',
      'Cumulative bonus up to 100%',
      'Modern treatment methods covered',
      'Cashless at 7,200+ network hospitals',
    ],
    exclusions: [
      'Pre-existing diseases (waiting period 36 months)',
      'Cosmetic surgery',
      'Self-inflicted injuries',
      'Maternity (first year)',
    ],
    eligibility: { minAge: 18, maxAge: 65, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN125200100012014017',
    rating: 4.1,
    tagline: 'ProHealth for ProActive Living',
    recommendedFor: ['middle-income', 'family', 'budget-conscious'],
    networkHospitals: 7200,
    waitingPeriod: '30 days initial, 36 months pre-existing',
    waitingPeriodInitial: 30,
    waitingPeriodPED: 36,
    noClaimBonus: 'Cumulative bonus up to 100%',
    taxBenefit: 'Up to ₹75,000 under Section 80D',
    familyFloater: true,
    maternityCover: false,
    wellnessAddons: false,
    roomRentLimit: 'Single room',
    dataSource: 'IRDAI Annual Report 2024-25',
  },
  {
    id: 'health-009',
    name: 'Bajaj Allianz Health Guard',
    provider: 'Bajaj Allianz General Insurance',
    category: 'health',
    premium: { monthly: 550, annual: 6600, currency: 'INR' },
    sumInsured: { min: 500000, max: 10000000, currency: 'INR' },
    claimSettlementRatio: 97.04,
    incurredClaimRatio: 85.33,
    solvencyRatio: 2.1,
    features: [
      'Comprehensive hospitalization cover',
      'Day care procedures covered',
      'Pre & Post hospitalization',
      'Cumulative bonus up to 100%',
      'AYUSH treatment covered',
      'Ambulance charges covered',
      'Organ donor expenses',
      'Cashless at 6,800+ network hospitals',
    ],
    exclusions: [
      'Pre-existing diseases (waiting period 24 months)',
      'Dental treatment',
      'Cosmetic surgery',
      'Weight loss procedures',
    ],
    eligibility: { minAge: 18, maxAge: 65, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN102200100012002016',
    rating: 4.5,
    tagline: 'Health Guard, Life Guard',
    recommendedFor: ['family', 'working-professional', 'high-income'],
    networkHospitals: 6800,
    waitingPeriod: '30 days initial, 24 months pre-existing',
    waitingPeriodInitial: 30,
    waitingPeriodPED: 24,
    noClaimBonus: 'Cumulative bonus up to 100%',
    taxBenefit: 'Up to ₹75,000 under Section 80D',
    familyFloater: true,
    maternityCover: false,
    wellnessAddons: false,
    roomRentLimit: 'Single private room',
    dataSource: 'IRDAI Annual Report 2024-25',
  },
  {
    id: 'health-010',
    name: 'Galaxy Health IPD-OPD',
    provider: 'Galaxy Health and Allied Insurance',
    category: 'health',
    premium: { monthly: 510, annual: 6120, currency: 'INR' },
    sumInsured: { min: 300000, max: 10000000, currency: 'INR' },
    claimSettlementRatio: 92.00,
    features: [
      'IPD + OPD coverage combined',
      'Day care procedures covered',
      'Pre & Post hospitalization',
      'Out-patient department coverage',
      'Doctor consultation coverage',
      'Diagnostic tests covered',
      'Pharmacy benefits',
      'Digital-first claims process',
    ],
    exclusions: [
      'Pre-existing diseases (waiting period 24 months)',
      'Dental treatment',
      'Cosmetic surgery',
    ],
    eligibility: { minAge: 18, maxAge: 65, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN158202000012020002',
    rating: 4.0,
    tagline: 'IPD + OPD, Complete Health Cover',
    recommendedFor: ['young-professional', 'budget-conscious', 'digital-savvy'],
    waitingPeriod: '30 days initial, 24 months pre-existing',
    waitingPeriodInitial: 30,
    waitingPeriodPED: 24,
    noClaimBonus: 'Cumulative bonus up to 50%',
    taxBenefit: 'Up to ₹75,000 under Section 80D',
    familyFloater: true,
    maternityCover: false,
    wellnessAddons: false,
    roomRentLimit: 'Single room',
    dataSource: 'IRDAI Annual Report 2024-25',
  },
];

// ============================================================================
// LIFE INSURANCE PLANS (7 plans)
// Source: IRDAI Life Insurance CSR Report 2025-26
// ============================================================================
export const lifeInsurancePlans: InsurancePlan[] = [
  {
    id: 'life-001',
    name: 'PNB MetLife Mera Term Plan',
    provider: 'PNB MetLife',
    category: 'life',
    premium: { monthly: 1057, annual: 12683, currency: 'INR' },
    sumInsured: { min: 2500000, max: 100000000, currency: 'INR' },
    sumAssured: 10000000,
    claimSettlementRatio: 99.50,
    claimTurnaroundDays: 0.5,
    solvencyRatio: 2.10,
    policyTerm: 30,
    features: [
      'Death Benefit',
      'Terminal Illness coverage',
      'Critical Illness rider available',
      'Accidental Death rider available',
      'Waiver of Premium rider',
      'Flexible payout options',
      'Online purchase discount',
      'Tax benefits U/S 80C, 10(10D)',
    ],
    exclusions: ['Suicide within 1 year', 'Criminal activities'],
    eligibility: { minAge: 18, maxAge: 65, medicalTestRequired: true },
    irdaRegistrationNo: 'IRDAN112200100012003044',
    rating: 4.8,
    tagline: 'Mera Life, Mera Protection',
    recommendedFor: ['young-professional', 'sole-earner', 'family'],
    ridersAvailable: ['Critical Illness', 'Accidental Death', 'Waiver of Premium'],
    waitingPeriod: 'N/A',
    noClaimBonus: 'N/A - Term plan',
    taxBenefit: 'U/S 80C, 10(10D)',
    dataSource: 'IRDAI Life Insurance CSR Report 2025-26',
  },
  {
    id: 'life-002',
    name: 'Axis Max Life Smart Secure Plus',
    provider: 'Axis Max Life Insurance',
    category: 'life',
    premium: { monthly: 995, annual: 11937, currency: 'INR' },
    sumInsured: { min: 2500000, max: 100000000, currency: 'INR' },
    sumAssured: 10000000,
    claimSettlementRatio: 99.51,
    claimTurnaroundDays: 0.4,
    solvencyRatio: 2.25,
    policyTerm: 30,
    features: [
      'Death Benefit',
      'Terminal Illness coverage',
      '200% Premium Refund option',
      'Critical Illness rider available',
      'Accidental Death rider available',
      'Income Benefit rider',
      'Special rates for non-smokers',
      'Tax benefits U/S 80C, 10(10D)',
    ],
    exclusions: ['Suicide within 1 year', 'Hazardous activities'],
    eligibility: { minAge: 18, maxAge: 60, medicalTestRequired: true },
    irdaRegistrationNo: 'IRDAN124200100012007050',
    rating: 4.8,
    tagline: 'Smart Protection, Secure Future',
    recommendedFor: ['young-professional', 'family', 'women'],
    ridersAvailable: ['Critical Illness', 'Accidental Death', 'Income Benefit'],
    waitingPeriod: 'N/A',
    noClaimBonus: 'N/A - Term plan',
    taxBenefit: 'U/S 80C, 10(10D)',
    dataSource: 'IRDAI Life Insurance CSR Report 2025-26',
  },
  {
    id: 'life-003',
    name: 'HDFC Life Click 2 Protect',
    provider: 'HDFC Life',
    category: 'life',
    premium: { monthly: 1125, annual: 13500, currency: 'INR' },
    sumInsured: { min: 2500000, max: 100000000, currency: 'INR' },
    sumAssured: 10000000,
    claimSettlementRatio: 99.50,
    claimTurnaroundDays: 0.6,
    solvencyRatio: 2.15,
    policyTerm: 30,
    features: [
      'Death Benefit',
      'Terminal Illness coverage',
      'Multiple plan options (Life, Plus, Income)',
      'Critical Illness rider available',
      'Accidental Death rider available',
      'Waiver of Premium rider',
      'Increase cover at key life events',
      'Tax benefits U/S 80C, 10(10D)',
    ],
    exclusions: ['Suicide within 1 year'],
    eligibility: { minAge: 18, maxAge: 65, medicalTestRequired: true },
    irdaRegistrationNo: 'IRDAN107200100012004042',
    rating: 4.7,
    tagline: 'Selfless Protection for Selfless Love',
    recommendedFor: ['young-professional', 'sole-earner', 'high-income'],
    ridersAvailable: ['Critical Illness', 'Accidental Death', 'Waiver of Premium'],
    waitingPeriod: 'N/A',
    noClaimBonus: 'N/A - Term plan',
    taxBenefit: 'U/S 80C, 10(10D)',
    dataSource: 'IRDAI Life Insurance CSR Report 2025-26',
  },
  {
    id: 'life-004',
    name: 'ICICI Prudential iProtect Smart',
    provider: 'ICICI Prudential Life Insurance',
    category: 'life',
    premium: { monthly: 1071, annual: 12850, currency: 'INR' },
    sumInsured: { min: 2500000, max: 100000000, currency: 'INR' },
    sumAssured: 10000000,
    claimSettlementRatio: 99.30,
    claimTurnaroundDays: 1.1,
    solvencyRatio: 2.30,
    policyTerm: 30,
    features: [
      'Death Benefit with terminal illness cover',
      'Accidental death benefit',
      'Critical illness cover (optional)',
      'Income payout option',
      'Lump sum + income combination',
      'Waiver of premium on critical illness',
      'Online-only competitive rates',
      'Tax benefits U/S 80C, 10(10D)',
    ],
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
    name: 'Bajaj Allianz Smart Protect Goal',
    provider: 'Bajaj Allianz Life Insurance',
    category: 'life',
    premium: { monthly: 1000, annual: 12000, currency: 'INR' },
    sumInsured: { min: 2500000, max: 100000000, currency: 'INR' },
    sumAssured: 10000000,
    claimSettlementRatio: 99.29,
    claimTurnaroundDays: 0.7,
    solvencyRatio: 2.00,
    policyTerm: 30,
    features: [
      'Death Benefit with terminal illness',
      'Return of premium option',
      'Critical Illness rider (40+ conditions)',
      'Accidental Death rider',
      'Waiver of Premium on CI',
      'Flexible payout options',
      'Online discount up to 10%',
      'Tax benefits U/S 80C, 10(10D)',
    ],
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
    name: 'Tata AIA Sampoorna Raksha',
    provider: 'Tata AIA Life Insurance',
    category: 'life',
    premium: { monthly: 1033, annual: 12400, currency: 'INR' },
    sumInsured: { min: 2500000, max: 75000000, currency: 'INR' },
    sumAssured: 10000000,
    claimSettlementRatio: 98.50,
    claimTurnaroundDays: 0.9,
    solvencyRatio: 2.05,
    policyTerm: 30,
    features: [
      'Term plan with return of premium option',
      'Accidental death benefit up to ₹1 Crore',
      'Critical illness rider',
      'Total & permanent disability benefit',
      'Premium waiver on critical illness',
      'Multiple payout options',
      'Online discount up to 15%',
      'Tax benefits U/S 80C, 10(10D)',
    ],
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
  {
    id: 'life-007',
    name: 'LIC Jeevan Amar',
    provider: 'Life Insurance Corporation of India',
    category: 'life',
    premium: { monthly: 1183, annual: 14200, currency: 'INR' },
    sumInsured: { min: 2500000, max: 50000000, currency: 'INR' },
    sumAssured: 10000000,
    claimSettlementRatio: 97.08,
    claimTurnaroundDays: 2.0,
    solvencyRatio: 1.85,
    policyTerm: 30,
    features: [
      'Non-linked, non-participating term plan',
      'Death benefit + optional maturity benefit',
      'Flexible premium payment terms',
      'Accident benefit rider available',
      'Premium waiver on disability',
      'Surrender value available',
      'Government-backed insurer',
      'Tax benefits U/S 80C, 10(10D)',
    ],
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
];

// ============================================================================
// MOTOR INSURANCE PLANS (2 plans)
// ============================================================================
export const motorInsurancePlans: InsurancePlan[] = [
  {
    id: 'motor-001',
    name: 'ACKO Car Insurance',
    provider: 'ACKO General Insurance',
    category: 'motor',
    premium: { monthly: 183, annual: 2200, currency: 'INR' },
    sumInsured: { min: 100000, max: 5000000, currency: 'INR' },
    claimSettlementRatio: 99.98,
    incurredClaimRatio: 85.51,
    solvencyRatio: 2.2,
    idvPercentage: 85,
    features: [
      'Own Damage coverage',
      'Third Party Liability',
      'Personal Accident cover',
      'Cashless at 8,000+ garages',
      'Instant digital claims',
      'Zero paperwork',
      'Same-day claim settlement',
      '24x7 roadside assistance (add-on)',
    ],
    exclusions: ['Drunk driving claims', 'Driving without valid license', 'Consequential wear and tear', 'Electrical/mechanical breakdown'],
    eligibility: { minAge: 18, maxAge: 80, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN157202000012020001',
    rating: 4.6,
    tagline: 'Digital-First Car Insurance',
    recommendedFor: ['car-owner', 'urban', 'digital-savvy'],
    networkGarages: 8000,
    waitingPeriod: 'N/A',
    noClaimBonus: 'Up to 50% discount on own damage premium',
    taxBenefit: 'N/A - Motor insurance',
    addonsAvailable: ['Zero Depreciation', 'Engine Protection', 'Roadside Assistance', 'Return to Invoice'],
    dataSource: 'IRDAI Annual Report 2024-25',
  },
  {
    id: 'motor-002',
    name: 'HDFC ERGO Car Insurance',
    provider: 'HDFC ERGO General Insurance',
    category: 'motor',
    premium: { monthly: 208, annual: 2500, currency: 'INR' },
    sumInsured: { min: 100000, max: 5000000, currency: 'INR' },
    claimSettlementRatio: 89.48,
    incurredClaimRatio: 85.51,
    solvencyRatio: 1.9,
    idvPercentage: 85,
    features: [
      'Own Damage coverage',
      'Third Party Liability',
      'Personal Accident cover',
      'Cashless at 6,800+ garages',
      'Instant online renewal',
      'No inspection for renewal',
      'Key replacement add-on',
      'Consumables cover add-on',
    ],
    exclusions: ['Drunk driving claims', 'Driving without valid license', 'Consequential wear and tear', 'Electrical/mechanical breakdown'],
    eligibility: { minAge: 18, maxAge: 80, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN108200100012008014',
    rating: 4.4,
    tagline: 'Car Insurance Made Simple',
    recommendedFor: ['car-owner', 'urban', 'working-professional'],
    networkGarages: 6800,
    waitingPeriod: 'N/A',
    noClaimBonus: 'Up to 50% discount on own damage premium',
    taxBenefit: 'N/A - Motor insurance',
    addonsAvailable: ['Zero Depreciation', 'Engine Protection', 'Key Replacement', 'Consumables Cover'],
    dataSource: 'IRDAI Annual Report 2024-25',
  },
];

// ============================================================================
// TRAVEL INSURANCE PLANS (1 plan)
// ============================================================================
export const travelInsurancePlans: InsurancePlan[] = [
  {
    id: 'travel-001',
    name: 'International Travel Insurance',
    provider: 'Multiple Providers',
    category: 'travel',
    premium: { monthly: 899, annual: 899, currency: 'INR' },
    sumInsured: { min: 50000, max: 500000, currency: 'INR' },
    sumInsuredMedical: 50000,
    claimSettlementRatio: 90.0,
    coverageDays: 15,
    features: [
      'Medical Emergency coverage',
      'Trip Cancellation protection',
      'Baggage Loss coverage',
      'Flight Delay compensation',
      'Passport loss assistance',
      'Emergency evacuation',
      'Personal liability coverage',
      '24x7 global assistance helpline',
    ],
    exclusions: ['Pre-existing diseases', 'Risky activities', 'Pregnancy'],
    eligibility: { minAge: 6, maxAge: 85, medicalTestRequired: false },
    irdaRegistrationNo: 'Multiple',
    rating: 4.2,
    tagline: 'Travel the World, Worry-Free',
    recommendedFor: ['traveler', 'business-traveler', 'student-abroad'],
    waitingPeriod: 'N/A',
    noClaimBonus: 'N/A',
    taxBenefit: 'N/A - Travel insurance',
    dataSource: 'IRDAI Annual Report 2024-25',
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
    avgClaimSettlementRatio: 93.95,
    planCount: healthInsurancePlans.length,
    premiumRange: { min: 399, max: 550, frequency: 'monthly' },
    keyFeatures: ['CSR 90–99.98%', 'PED waiting 24–36 months', 'Family floater available'],
    bestFor: 'Individuals, Young Professionals, Nuclear Families',
  },
  {
    id: 'life',
    name: 'Life Insurance',
    icon: 'Shield',
    color: '#10b981',
    description: 'Secure your family\'s financial future with term plans offering ₹1 Crore+ cover starting at just ₹800/month. CSR 97–99.5% across top insurers.',
    avgClaimSettlementRatio: 99.10,
    planCount: lifeInsurancePlans.length,
    premiumRange: { min: 995, max: 1183, frequency: 'monthly' },
    keyFeatures: ['₹1 Cr cover from ₹800/mo', 'CSR 97–99.5%', 'Claim turnaround < 1 day'],
    bestFor: 'Young earning members, Sole earners, Families',
  },
  {
    id: 'motor',
    name: 'Motor Insurance',
    icon: 'Car',
    color: '#f59e0b',
    description: 'Mandatory third-party and comprehensive coverage for your car. IDV-based pricing with claim ratio 85%+ across top insurers.',
    avgClaimSettlementRatio: 94.73,
    planCount: motorInsurancePlans.length,
    premiumRange: { min: 183, max: 208, frequency: 'monthly' },
    keyFeatures: ['IDV based pricing', 'Claim ratio 85%+', 'Zero depreciation add-on'],
    bestFor: 'Car owners, New vehicle buyers',
  },
  {
    id: 'travel',
    name: 'Travel Insurance',
    icon: 'Plane',
    color: '#8b5cf6',
    description: 'Travel worry-free with coverage for medical emergencies, baggage loss, and trip cancellations — starting at just ₹499/trip.',
    avgClaimSettlementRatio: 90.0,
    planCount: travelInsurancePlans.length,
    premiumRange: { min: 499, max: 1500, frequency: 'per trip' },
    keyFeatures: ['Medical + trip cancellation', 'Baggage loss coverage', '15-day trips from ₹899'],
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
  { insuranceType: 'Health (Individual)', monthlyPremiumRange: '₹399–₹550', keyFeatures: 'CSR 90–99.98%, PED waiting 24–36 mo', bestFor: 'Individuals, Young Professionals' },
  { insuranceType: 'Health (Family Floater)', monthlyPremiumRange: '₹1,500–₹5,000', keyFeatures: 'Covers 4-5 members, shared sum insured', bestFor: 'Nuclear Families, Parents' },
  { insuranceType: 'Life (Term)', monthlyPremiumRange: '₹800–₹1,200', keyFeatures: '₹1 Cr cover, CSR 97–99.5%, low premium', bestFor: 'Young earning members' },
  { insuranceType: 'Motor (Comprehensive)', monthlyPremiumRange: '₹1,500–₹2,500/yr', keyFeatures: 'IDV based, claim ratio 85%+', bestFor: 'Car owners' },
  { insuranceType: 'Travel (International)', monthlyPremiumRange: '₹499–₹1,500/trip', keyFeatures: 'Medical + trip cancellation coverage', bestFor: 'Travelers' },
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
  return knowledgeBase
    .map(entry => {
      let score = 0;
      const searchable = `${entry.topic} ${entry.question} ${entry.answer} ${entry.tags.join(' ')}`.toLowerCase();
      words.forEach(word => {
        if (searchable.includes(word)) score += 1;
      });
      return { entry, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.entry);
}
