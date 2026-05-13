// ============================================================================
// InsureGPT - Comprehensive Indian Insurance Product Data
// IRDAI-Compliant Static Data for Initial Deployment
// ============================================================================

export type InsuranceCategory = 'health' | 'life' | 'motor' | 'travel' | 'home';

export interface InsurancePlan {
  id: string;
  name: string;
  provider: string;
  category: InsuranceCategory;
  premium: {
    min: number;
    max: number;
    currency: 'INR';
  };
  sumInsured: {
    min: number;
    max: number;
    currency: 'INR';
  };
  claimSettlementRatio: number; // percentage
  features: string[];
  exclusions: string[];
  eligibility: {
    minAge: number;
    maxAge: number;
    medicalTestRequired: boolean;
  };
  irdaRegistrationNo: string;
  rating: number; // out of 5
  tagline: string;
  recommendedFor: string[]; // demographic tags
  networkHospitals?: number;
  waitingPeriod: string;
  noClaimBonus: string;
  taxBenefit: string;
}

// ============================================================================
// HEALTH INSURANCE PLANS
// ============================================================================
export const healthInsurancePlans: InsurancePlan[] = [
  {
    id: 'health-001',
    name: 'Star Health Comprehensive',
    provider: 'Star Health and Allied Insurance',
    category: 'health',
    premium: { min: 5000, max: 25000, currency: 'INR' },
    sumInsured: { min: 300000, max: 10000000, currency: 'INR' },
    claimSettlementRatio: 87.4,
    features: [
      'Cashless treatment at 14,000+ network hospitals',
      'No medical check-up up to 45 years',
      'Automatic restoration of sum insured',
      'Day care procedures covered',
      'Pre & post hospitalization expenses',
      'Ambulance charges covered up to ₹2,500',
      'AYUSH treatment covered',
      'Organ donor expenses covered',
    ],
    exclusions: [
      'Pre-existing diseases (waiting period 48 months)',
      'Cosmetic surgery',
      'Self-inflicted injuries',
      'Maternity expenses (first 2 years)',
    ],
    eligibility: { minAge: 18, maxAge: 65, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN103200100012008018',
    rating: 4.5,
    tagline: 'Your Health, Our Priority',
    recommendedFor: ['young-professional', 'family', 'senior-citizen'],
    networkHospitals: 14000,
    waitingPeriod: '30 days initial, 48 months pre-existing',
    noClaimBonus: '10% increase per claim-free year up to 100%',
    taxBenefit: 'Up to ₹75,000 under Section 80D',
  },
  {
    id: 'health-002',
    name: 'HDFC ERGO Optima Secure',
    provider: 'HDFC ERGO General Insurance',
    category: 'health',
    premium: { min: 6000, max: 35000, currency: 'INR' },
    sumInsured: { min: 500000, max: 15000000, currency: 'INR' },
    claimSettlementRatio: 89.2,
    features: [
      'Infinite sum insured restoration',
      'Cashless at 13,000+ hospitals',
      'Modern treatment methods covered',
      'Global coverage for emergencies',
      'Annual health check-up',
      'Mental illness coverage',
      'Bariatric surgery covered',
      'Air ambulance cover up to ₹2.5 Lakhs',
    ],
    exclusions: [
      'Pre-existing diseases (waiting period 36 months)',
      'Dental treatment (unless due to accident)',
      'War and nuclear perils',
      'Experimental treatments',
    ],
    eligibility: { minAge: 18, maxAge: 65, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN108200100012008014',
    rating: 4.6,
    tagline: 'Secure Your Tomorrow',
    recommendedFor: ['young-professional', 'family', 'high-income'],
    networkHospitals: 13000,
    waitingPeriod: '30 days initial, 36 months pre-existing',
    noClaimBonus: '50% cumulative bonus per year up to 100%',
    taxBenefit: 'Up to ₹75,000 under Section 80D',
  },
  {
    id: 'health-003',
    name: 'Care Health Insurance (formerly Religare)',
    provider: 'Care Health Insurance',
    category: 'health',
    premium: { min: 4500, max: 20000, currency: 'INR' },
    sumInsured: { min: 300000, max: 6000000, currency: 'INR' },
    claimSettlementRatio: 91.5,
    features: [
      'No co-payment',
      'Cashless at 20,000+ hospitals',
      'Unlimited automatic restoration',
      'Annual health check-up included',
      'Domiciliary hospitalization',
      'Second medical opinion',
      'No capping on room rent',
      'Consumables cover',
    ],
    exclusions: [
      'Pre-existing diseases (waiting period 36 months)',
      'Non-allopathic treatment (unless specified)',
      'Congenital conditions',
      'Refractive errors correction',
    ],
    eligibility: { minAge: 5, maxAge: 65, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN115200100012009002',
    rating: 4.7,
    tagline: 'Care Like Family',
    recommendedFor: ['family', 'senior-citizen', 'middle-income'],
    networkHospitals: 20000,
    waitingPeriod: '30 days initial, 36 months pre-existing',
    noClaimBonus: '10% per claim-free year up to 50%',
    taxBenefit: 'Up to ₹75,000 under Section 80D',
  },
  {
    id: 'health-004',
    name: 'Niva Bupa Health Companion',
    provider: 'Niva Bupa Health Insurance',
    category: 'health',
    premium: { min: 4000, max: 18000, currency: 'INR' },
    sumInsured: { min: 200000, max: 5000000, currency: 'INR' },
    claimSettlementRatio: 86.8,
    features: [
      'No claim-based loading',
      'Cashless at 10,000+ hospitals',
      'OPD expenses covered',
      'Wellness rewards program',
      'Teleconsultation free',
      'Day 1 coverage for accidents',
      'AYUSH treatment covered',
      'Personal accident cover add-on',
    ],
    exclusions: [
      'Pre-existing diseases (waiting period 48 months)',
      'Obesity/weight management treatment',
      'Infertility treatment',
      'Self-inflicted injuries',
    ],
    eligibility: { minAge: 18, maxAge: 65, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN120200100012019001',
    rating: 4.3,
    tagline: 'Healthwise, Lifewise',
    recommendedFor: ['young-professional', 'budget-conscious'],
    networkHospitals: 10000,
    waitingPeriod: '30 days initial, 48 months pre-existing',
    noClaimBonus: '20% increase per claim-free year up to 100%',
    taxBenefit: 'Up to ₹75,000 under Section 80D',
  },
  {
    id: 'health-005',
    name: 'ICICI Lombard Complete Health',
    provider: 'ICICI Lombard General Insurance',
    category: 'health',
    premium: { min: 5500, max: 30000, currency: 'INR' },
    sumInsured: { min: 300000, max: 10000000, currency: 'INR' },
    claimSettlementRatio: 85.7,
    features: [
      'Cashless at 6,500+ hospitals',
      'In-patient and day care treatment',
      'Pre-hospitalization 60 days, post 180 days',
      'Ambulance charges up to ₹3,000',
      'Organ donor expenses',
      'Domiciliary treatment',
      'AYUSH treatment',
      'Air ambulance cover',
    ],
    exclusions: [
      'Pre-existing diseases (waiting period 48 months)',
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
    waitingPeriod: '30 days initial, 48 months pre-existing',
    noClaimBonus: '5% cumulative bonus per year up to 50%',
    taxBenefit: 'Up to ₹75,000 under Section 80D',
  },
  {
    id: 'health-006',
    name: 'SBI General Arogya Premier',
    provider: 'SBI General Insurance',
    category: 'health',
    premium: { min: 4800, max: 22000, currency: 'INR' },
    sumInsured: { min: 300000, max: 5000000, currency: 'INR' },
    claimSettlementRatio: 84.3,
    features: [
      'Cashless at 6,000+ hospitals',
      'No co-payment',
      'Wellness incentives',
      'Modern treatments covered',
      'AYUSH treatment',
      'Restore benefit',
      'Annual health check-up',
      'Infant baby covered from Day 1',
    ],
    exclusions: [
      'Pre-existing diseases (waiting period 36 months)',
      'External congenital anomalies',
      'Treatment outside India',
      'Maternity (first year)',
    ],
    eligibility: { minAge: 18, maxAge: 65, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN122200100012009019',
    rating: 4.1,
    tagline: 'Arogya - Your Wellness Partner',
    recommendedFor: ['middle-income', 'family', 'sbi-customers'],
    networkHospitals: 6000,
    waitingPeriod: '30 days initial, 36 months pre-existing',
    noClaimBonus: '10% per claim-free year up to 100%',
    taxBenefit: 'Up to ₹75,000 under Section 80D',
  },
];

// ============================================================================
// LIFE INSURANCE PLANS
// ============================================================================
export const lifeInsurancePlans: InsurancePlan[] = [
  {
    id: 'life-001',
    name: 'LIC New Jeevan Anand',
    provider: 'Life Insurance Corporation of India',
    category: 'life',
    premium: { min: 12000, max: 200000, currency: 'INR' },
    sumInsured: { min: 100000, max: 50000000, currency: 'INR' },
    claimSettlementRatio: 98.62,
    features: [
      'Endowment plan with savings component',
      'Death benefit + maturity benefit',
      'Loan available against policy',
      'Accident benefit rider available',
      'Premium waiver on disability',
      'Surrender value after 3 years',
      'Participation in profits',
      'Tax benefits under Section 80C & 10(10D)',
    ],
    exclusions: [
      'Suicide within first 12 months',
      'Death due to participation in criminal activities',
      'Death due to war/nuclear perils',
    ],
    eligibility: { minAge: 18, maxAge: 50, medicalTestRequired: true },
    irdaRegistrationNo: 'IRDAN101200100012001001',
    rating: 4.8,
    tagline: 'Zindagi Ke Saath Bhi, Zindagi Ke Baad Bhi',
    recommendedFor: ['family', 'long-term-saver', 'risk-averse'],
    waitingPeriod: 'N/A',
    noClaimBonus: 'N/A - Endowment plan',
    taxBenefit: 'Up to ₹1.5 Lakhs under Section 80C',
  },
  {
    id: 'life-002',
    name: 'HDFC Life Click 2 Protect Super',
    provider: 'HDFC Life Insurance',
    category: 'life',
    premium: { min: 5000, max: 100000, currency: 'INR' },
    sumInsured: { min: 2500000, max: 100000000, currency: 'INR' },
    claimSettlementRatio: 99.39,
    features: [
      'Pure term insurance - high cover at low cost',
      '4 plan options: Life, Life Plus, Life Income, Life Income Plus',
      'Accidental death benefit',
      'Critical illness rider',
      'Terminal illness benefit',
      'Flexible payout options',
      'Online purchase discount',
      'Increase cover at key life events',
    ],
    exclusions: [
      'Suicide within first 12 months',
      'Death due to dangerous activities',
      'Pre-existing conditions not declared',
    ],
    eligibility: { minAge: 18, maxAge: 65, medicalTestRequired: true },
    irdaRegistrationNo: 'IRDAN107200100012004042',
    rating: 4.7,
    tagline: 'Selfless Protection for Selfless Love',
    recommendedFor: ['young-professional', 'sole-earner', 'high-income'],
    waitingPeriod: 'N/A',
    noClaimBonus: 'N/A - Term plan',
    taxBenefit: 'Up to ₹1.5 Lakhs under Section 80C',
  },
  {
    id: 'life-003',
    name: 'SBI Life eShield Next',
    provider: 'SBI Life Insurance',
    category: 'life',
    premium: { min: 4500, max: 80000, currency: 'INR' },
    sumInsured: { min: 2000000, max: 50000000, currency: 'INR' },
    claimSettlementRatio: 97.01,
    features: [
      'Pure term plan with increasing cover',
      'Option to increase cover by 10% yearly',
      'Accidental death benefit',
      'Terminal illness benefit',
      'Online-only plan - lower premiums',
      '4 plan variants',
      'Flexi payout options',
      'Special rates for non-smokers',
    ],
    exclusions: [
      'Suicide within 12 months',
      'Self-inflicted injury',
      'Criminal activities',
    ],
    eligibility: { minAge: 18, maxAge: 60, medicalTestRequired: true },
    irdaRegistrationNo: 'IRDAN123200100012006046',
    rating: 4.5,
    tagline: 'Shielding Your Loved Ones',
    recommendedFor: ['young-professional', 'family', 'budget-conscious'],
    waitingPeriod: 'N/A',
    noClaimBonus: 'N/A - Term plan',
    taxBenefit: 'Up to ₹1.5 Lakhs under Section 80C',
  },
  {
    id: 'life-004',
    name: 'Tata AIA Sampoorna Raksha Supreme',
    provider: 'Tata AIA Life Insurance',
    category: 'life',
    premium: { min: 6000, max: 120000, currency: 'INR' },
    sumInsured: { min: 2500000, max: 75000000, currency: 'INR' },
    claimSettlementRatio: 99.13,
    features: [
      'Term plan with return of premium option',
      'Accidental death benefit up to ₹1 Crore',
      'Critical illness rider',
      'Total & permanent disability benefit',
      'Premium waiver on critical illness',
      'Multiple payout options',
      'Online discount up to 15%',
      'Exit option at age 60',
    ],
    exclusions: [
      'Suicide within 12 months',
      'Adventure sports (without disclosure)',
      'Substance abuse related death',
    ],
    eligibility: { minAge: 18, maxAge: 65, medicalTestRequired: true },
    irdaRegistrationNo: 'IRDAN110200100012005029',
    rating: 4.6,
    tagline: 'Raksha That Goes Beyond',
    recommendedFor: ['family', 'working-professional', 'risk-averse'],
    waitingPeriod: 'N/A',
    noClaimBonus: 'N/A - Term plan',
    taxBenefit: 'Up to ₹1.5 Lakhs under Section 80C',
  },
  {
    id: 'life-005',
    name: 'Max Life Smart Secure Plus',
    provider: 'Max Life Insurance',
    category: 'life',
    premium: { min: 5500, max: 90000, currency: 'INR' },
    sumInsured: { min: 2000000, max: 50000000, currency: 'INR' },
    claimSettlementRatio: 99.35,
    features: [
      'Guaranteed death benefit',
      'Return of premium option',
      'Accidental death benefit rider',
      'Critical illness + disability rider',
      'Premium break option',
      'Joint life protection',
      'Flexible premium payment terms',
      'Special premium rates for women',
    ],
    exclusions: [
      'Suicide within 12 months',
      'HIV/AIDS (unless disclosed)',
      'Criminal activities',
    ],
    eligibility: { minAge: 18, maxAge: 60, medicalTestRequired: true },
    irdaRegistrationNo: 'IRDAN124200100012007050',
    rating: 4.6,
    tagline: 'Smart Protection, Secure Future',
    recommendedFor: ['young-professional', 'family', 'women'],
    waitingPeriod: 'N/A',
    noClaimBonus: 'N/A - Term plan',
    taxBenefit: 'Up to ₹1.5 Lakhs under Section 80C',
  },
];

// ============================================================================
// MOTOR INSURANCE PLANS
// ============================================================================
export const motorInsurancePlans: InsurancePlan[] = [
  {
    id: 'motor-001',
    name: 'Bajaj Allianz Comprehensive Car',
    provider: 'Bajaj Allianz General Insurance',
    category: 'motor',
    premium: { min: 3000, max: 25000, currency: 'INR' },
    sumInsured: { min: 100000, max: 5000000, currency: 'INR' },
    claimSettlementRatio: 88.3,
    features: [
      'Own damage + third-party liability',
      'Cashless claims at 7,500+ garages',
      'Zero depreciation add-on',
      'Roadside assistance 24x7',
      'Engine protect cover',
      'Personal accident cover up to ₹15 Lakhs',
      'No documentation renewal',
      'Instant policy issuance',
    ],
    exclusions: [
      'Drunk driving claims',
      'Driving without valid license',
      'Consequential wear and tear',
      'Electrical/mechanical breakdown',
    ],
    eligibility: { minAge: 18, maxAge: 80, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN102200100012002016',
    rating: 4.4,
    tagline: 'Car Insurance Made Simple',
    recommendedFor: ['car-owner', 'urban', 'working-professional'],
    waitingPeriod: 'N/A',
    noClaimBonus: 'Up to 50% discount on own damage premium',
    taxBenefit: 'N/A - Motor insurance',
  },
  {
    id: 'motor-002',
    name: 'ICICI Lombard Bike Insurance',
    provider: 'ICICI Lombard General Insurance',
    category: 'motor',
    premium: { min: 800, max: 8000, currency: 'INR' },
    sumInsured: { min: 30000, max: 300000, currency: 'INR' },
    claimSettlementRatio: 85.7,
    features: [
      'Comprehensive two-wheeler coverage',
      'Cashless at 3,500+ garages',
      'Personal accident cover ₹15 Lakhs',
      'Third-party liability coverage',
      'Zero depreciation add-on',
      'Roadside assistance',
      'Instant online renewal',
      'No inspection for renewal',
    ],
    exclusions: [
      'Racing and speed testing',
      'Drunk driving',
      'Wear and tear',
      'Depreciation (without add-on)',
    ],
    eligibility: { minAge: 18, maxAge: 70, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN104200100012004013',
    rating: 4.2,
    tagline: 'Ride With Confidence',
    recommendedFor: ['bike-owner', 'young-professional', 'budget-conscious'],
    waitingPeriod: 'N/A',
    noClaimBonus: 'Up to 50% discount on own damage premium',
    taxBenefit: 'N/A - Motor insurance',
  },
  {
    id: 'motor-003',
    name: 'New India Assurance Motor Package',
    provider: 'The New India Assurance Co. Ltd',
    category: 'motor',
    premium: { min: 2500, max: 20000, currency: 'INR' },
    sumInsured: { min: 100000, max: 5000000, currency: 'INR' },
    claimSettlementRatio: 86.5,
    features: [
      'Government-backed insurer',
      'Wide garage network across India',
      'Own damage + third party',
      'Personal accident cover',
      'Legal liability to paid driver',
      'Nil depreciation add-on',
      'Consumables cover',
      'Key replacement cover',
    ],
    exclusions: [
      'Contractual liability',
      'War and nuclear perils',
      'Drunk driving',
      'Invalid license',
    ],
    eligibility: { minAge: 18, maxAge: 80, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN109200100012001019',
    rating: 4.0,
    tagline: 'India\'s Trusted Public Sector Insurer',
    recommendedFor: ['car-owner', 'government-employee', 'rural'],
    waitingPeriod: 'N/A',
    noClaimBonus: 'Up to 50% discount on own damage premium',
    taxBenefit: 'N/A - Motor insurance',
  },
];

// ============================================================================
// TRAVEL INSURANCE PLANS
// ============================================================================
export const travelInsurancePlans: InsurancePlan[] = [
  {
    id: 'travel-001',
    name: 'ICICI Lombard Travel Insurance',
    provider: 'ICICI Lombard General Insurance',
    category: 'travel',
    premium: { min: 500, max: 8000, currency: 'INR' },
    sumInsured: { min: 50000, max: 1000000, currency: 'INR' },
    claimSettlementRatio: 85.7,
    features: [
      'Medical emergency coverage abroad',
      'Trip cancellation/interruption',
      'Baggage loss/delay coverage',
      'Passport loss assistance',
      'Flight delay compensation',
      'Emergency evacuation',
      'Personal liability coverage',
      '24x7 global assistance helpline',
    ],
    exclusions: [
      'Pre-existing conditions',
      'Adventure sports (unless covered)',
      'War and terrorism',
      'Self-inflicted injuries',
    ],
    eligibility: { minAge: 6, maxAge: 85, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN104200100012004013',
    rating: 4.1,
    tagline: 'Travel the World, Worry-Free',
    recommendedFor: ['traveler', 'business-traveler', 'student-abroad'],
    waitingPeriod: 'N/A',
    noClaimBonus: 'N/A',
    taxBenefit: 'N/A - Travel insurance',
  },
  {
    id: 'travel-002',
    name: 'Bajaj Allianz Travel Companion',
    provider: 'Bajaj Allianz General Insurance',
    category: 'travel',
    premium: { min: 400, max: 6000, currency: 'INR' },
    sumInsured: { min: 30000, max: 500000, currency: 'INR' },
    claimSettlementRatio: 88.3,
    features: [
      'Worldwide coverage (except US/Canada options)',
      'Medical expenses coverage',
      'Dental emergency coverage',
      'Trip delay/cancellation',
      'Baggage coverage',
      'Hijack distress allowance',
      'Home burglary cover',
      'Cashless hospitalization abroad',
    ],
    exclusions: [
      'Pre-existing diseases',
      'Self-inflicted injury',
      'Nuclear perils',
      'Travel against medical advice',
    ],
    eligibility: { minAge: 6, maxAge: 70, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN102200100012002016',
    rating: 4.3,
    tagline: 'Your Perfect Travel Partner',
    recommendedFor: ['traveler', 'family-vacation', 'senior-traveler'],
    waitingPeriod: 'N/A',
    noClaimBonus: 'N/A',
    taxBenefit: 'N/A - Travel insurance',
  },
];

// ============================================================================
// HOME INSURANCE PLANS
// ============================================================================
export const homeInsurancePlans: InsurancePlan[] = [
  {
    id: 'home-001',
    name: 'HDFC ERGO Home Shield',
    provider: 'HDFC ERGO General Insurance',
    category: 'home',
    premium: { min: 1500, max: 15000, currency: 'INR' },
    sumInsured: { min: 500000, max: 50000000, currency: 'INR' },
    claimSettlementRatio: 89.2,
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
    exclusions: [
      'Willful destruction',
      'War and nuclear perils',
      'Wear and tear',
      'Pollution and contamination',
    ],
    eligibility: { minAge: 18, maxAge: 80, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN108200100012008014',
    rating: 4.4,
    tagline: 'Protect Your Biggest Investment',
    recommendedFor: ['home-owner', 'urban', 'high-income'],
    waitingPeriod: 'N/A',
    noClaimBonus: '5% discount per claim-free year up to 25%',
    taxBenefit: 'N/A - Home insurance',
  },
  {
    id: 'home-002',
    name: 'Bajaj Allianz My Home',
    provider: 'Bajaj Allianz General Insurance',
    category: 'home',
    premium: { min: 1200, max: 12000, currency: 'INR' },
    sumInsured: { min: 300000, max: 30000000, currency: 'INR' },
    claimSettlementRatio: 88.3,
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
    exclusions: [
      'Gradual deterioration',
      'Vermin/insect damage',
      'War risk',
      'Nuclear contamination',
    ],
    eligibility: { minAge: 18, maxAge: 80, medicalTestRequired: false },
    irdaRegistrationNo: 'IRDAN102200100012002016',
    rating: 4.2,
    tagline: 'Ghar Ki Suraksha, Humara Vaada',
    recommendedFor: ['home-owner', 'family', 'middle-income'],
    waitingPeriod: 'N/A',
    noClaimBonus: 'N/A',
    taxBenefit: 'N/A - Home insurance',
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
}

export const categoryInfo: CategoryInfo[] = [
  {
    id: 'health',
    name: 'Health Insurance',
    icon: 'Heart',
    color: '#ef4444',
    description: 'Protect yourself and your family from rising medical costs with comprehensive health coverage.',
    avgClaimSettlementRatio: 87.48,
    planCount: healthInsurancePlans.length,
  },
  {
    id: 'life',
    name: 'Life Insurance',
    icon: 'Shield',
    color: '#10b981',
    description: 'Secure your family\'s financial future with life insurance plans tailored for Indian families.',
    avgClaimSettlementRatio: 98.7,
    planCount: lifeInsurancePlans.length,
  },
  {
    id: 'motor',
    name: 'Motor Insurance',
    icon: 'Car',
    color: '#f59e0b',
    description: 'Mandatory third-party and comprehensive coverage for your car and two-wheeler.',
    avgClaimSettlementRatio: 86.83,
    planCount: motorInsurancePlans.length,
  },
  {
    id: 'travel',
    name: 'Travel Insurance',
    icon: 'Plane',
    color: '#8b5cf6',
    description: 'Travel worry-free with coverage for medical emergencies, baggage loss, and trip cancellations.',
    avgClaimSettlementRatio: 87.0,
    planCount: travelInsurancePlans.length,
  },
  {
    id: 'home',
    name: 'Home Insurance',
    icon: 'Home',
    color: '#06b6d4',
    description: 'Protect your home and belongings against fire, theft, natural disasters, and more.',
    avgClaimSettlementRatio: 88.75,
    planCount: homeInsurancePlans.length,
  },
];

// ============================================================================
// IRDAI PROHIBITED WORDS & COMPLIANCE
// ============================================================================
export const IRDAI_PROHIBITED_WORDS: string[] = [
  'guaranteed',
  'assured',
  'risk-free',
  'sure',
  'certain',
  'promise',
  'warranty',
  'best',
  'number one',
  'cheapest',
  'free',
  'no-risk',
  '100%',
  'zero risk',
  'can\'t lose',
  'foolproof',
  'fail-safe',
  'bulletproof',
  'ironclad',
  'rock-solid',
];

export const IRDAI_MANDATORY_DISCLAIMER = 
  'For more details on risk factors, terms and conditions, please read the sales brochure/policy wording carefully before concluding a sale. Insurance is the subject matter of solicitation.';

export const IRDAI_TAX_DISCLAIMER = 
  'Tax benefits are subject to changes in tax laws. Please consult your tax advisor for details.';

export const IRDAI_CLAIM_DISCLAIMER = 
  'Claim settlement ratio is based on previous year\'s data. Past performance is not indicative of future results.';

// ============================================================================
// USER PROFILE TYPES FOR PERSONALIZATION
// ============================================================================
export interface UserProfile {
  age: number;
  income: number; // annual in INR
  pincode: string;
  medicalHistory: string[];
  lifestyle: string[];
  dependents: number;
  occupation: string;
  existingInsurance: string[];
  priority: string; // e.g., 'health', 'savings', 'protection'
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
    answer: 'Cashless treatment means you don\'t need to pay the hospital bill upfront. The insurance company settles the bill directly with the hospital. This works at network hospitals — hospitals that have a tie-up with your insurer. Always check if your preferred hospital is in the network before buying.',
    category: 'health',
    tags: ['cashless', 'network', 'claims'],
  },
  {
    id: 'kb-003',
    topic: 'What is Claim Settlement Ratio?',
    question: 'What is Claim Settlement Ratio (CSR) and why does it matter?',
    answer: 'Claim Settlement Ratio (CSR) is the percentage of claims an insurer settles out of the total claims received. For example, a 95% CSR means 95 out of 100 claims were approved. A higher CSR indicates the insurer is more reliable. IRDAI publishes CSR data annually. Look for insurers with CSR above 85% for health and 95% for life insurance.',
    category: 'general',
    tags: ['csr', 'claims', 'reliability'],
  },
  {
    id: 'kb-004',
    topic: 'What is Term Insurance?',
    question: 'What is term insurance and how is it different?',
    answer: 'Term insurance is the purest form of life insurance. You pay a small premium for a large cover (sum assured). If something happens to you during the policy term, your family receives the full amount. Unlike endowment plans, there\'s no maturity benefit — but premiums are 90% cheaper. A 30-year-old can get ₹1 Crore cover for just ₹600-800/month.',
    category: 'life',
    tags: ['term', 'life', 'basics', 'affordable'],
  },
  {
    id: 'kb-005',
    topic: 'What is No Claim Bonus?',
    question: 'What is No Claim Bonus (NCB) in insurance?',
    answer: 'No Claim Bonus is a reward from the insurer for not making any claims during the policy year. In health insurance, it typically increases your sum insured by 10-50% per claim-free year. In motor insurance, it gives a discount on your renewal premium, up to 50% after 5 claim-free years. NCB transfers when you switch insurers.',
    category: 'general',
    tags: ['ncb', 'bonus', 'savings'],
  },
  {
    id: 'kb-006',
    topic: 'Waiting Period in Health Insurance',
    question: 'What is the waiting period in health insurance?',
    answer: 'Waiting period is the time you must wait before certain coverage kicks in: (1) Initial waiting period: 30 days from policy start, (2) Pre-existing diseases: 24-48 months for conditions you already have, (3) Specific diseases: 1-2 years for conditions like hernia, cataract, (4) Maternity: 9-36 months. Always check waiting periods before buying.',
    category: 'health',
    tags: ['waiting-period', 'health', 'terms'],
  },
  {
    id: 'kb-007',
    topic: 'Section 80D Tax Benefits',
    question: 'How much tax can I save with health insurance?',
    answer: 'Under Section 80D of the Income Tax Act: (1) Self & family: Up to ₹25,000 deduction on premium, (2) Parents: Additional ₹25,000 (₹50,000 if senior citizens), (3) Preventive health check-up: Up to ₹5,000 within the above limits, (4) Total maximum: ₹75,000 (self + senior citizen parents). This is over and above Section 80C benefits.',
    category: 'general',
    tags: ['tax', '80d', 'savings', 'health'],
  },
  {
    id: 'kb-008',
    topic: 'What is Third-Party Motor Insurance?',
    question: 'Is third-party motor insurance mandatory?',
    answer: 'Yes! Under the Motor Vehicles Act 1988, third-party insurance is legally mandatory for all vehicles in India. It covers: (1) Death/bodily injury to third parties (unlimited liability), (2) Third-party property damage (up to ₹7.5 Lakhs), (3) Personal accident cover for owner-driver. Driving without it attracts fines up to ₹2,000 and/or imprisonment up to 3 months.',
    category: 'motor',
    tags: ['motor', 'mandatory', 'third-party', 'legal'],
  },
  {
    id: 'kb-009',
    topic: 'How Much Life Insurance Do I Need?',
    question: 'How much life insurance cover should I take?',
    answer: 'The general rule is 10-15 times your annual income. For example, if you earn ₹10 Lakhs/year, you should have ₹1-1.5 Crore cover. Consider: (1) Outstanding loans (home loan, car loan), (2) Children\'s education fund, (3) Daily expenses for family for 10-15 years, (4) Any other liabilities. Use our calculator for a personalized recommendation.',
    category: 'life',
    tags: ['cover-amount', 'life', 'calculation'],
  },
  {
    id: 'kb-010',
    topic: 'What is Zero Depreciation Cover?',
    question: 'Should I buy zero depreciation add-on for motor insurance?',
    answer: 'Zero depreciation (or bumper-to-bumper) cover means the insurer pays the full claim amount without deducting depreciation on parts. Without it, you bear 30-50% of plastic/fiber part costs. It costs 15-20% extra premium but is highly recommended for: (1) New cars (less than 3 years old), (2) Luxury vehicles, (3) Inexperienced drivers. Most insurers allow it for vehicles up to 5 years old.',
    category: 'motor',
    tags: ['zero-dep', 'motor', 'add-on', 'depreciation'],
  },
  {
    id: 'kb-011',
    topic: 'IRDAI and Insurance Regulation',
    question: 'What is IRDAI and how does it protect policyholders?',
    answer: 'IRDAI (Insurance Regulatory and Development Authority of India) is the apex body regulating insurance in India. It protects policyholders by: (1) Setting solvency margins for insurers, (2) Publishing claim settlement ratios, (3) Mandating standard policy wordings, (4) Running the Integrated Grievance Management System (IGMS), (5) Requiring insurers to have a guaranteed surrender value. Always buy from IRDAI-registered insurers only.',
    category: 'general',
    tags: ['irdai', 'regulation', 'protection', 'rights'],
  },
  {
    id: 'kb-012',
    topic: 'Porting Your Health Insurance',
    question: 'Can I switch my health insurance to another company?',
    answer: 'Yes! IRDAI allows health insurance portability. You can switch insurers while: (1) Retaining your waiting period credits, (2) Keeping cumulative bonus benefits, (3) Applying at least 45 days before renewal date. The new insurer cannot reject portability based on your claims history. Port within the same sum insured range for maximum benefit continuity.',
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
