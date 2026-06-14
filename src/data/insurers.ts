export interface HealthInsurer {
  slug: string;
  name: string;
  type: 'health';
  logoPlaceholder: string;
  csr: number; // Claim Settlement Ratio FY24-25 (%)
  networkHospitals: number;
  premiumFor10L: number; // approximate annual premium for ₹10L at age 30
  features: string[];
  pros: string[];
  cons: string[];
  waitingPeriod: string;
  roomRent: string;
  restoration: string;
}

export interface MotorInsurer {
  slug: string;
  name: string;
  type: 'motor';
  logoPlaceholder: string;
  csr: number; // Claim Settlement Ratio FY24-25 (%)
  networkGarages: number;
  odRatePercent: number; // OD rate as % of IDV
  features: string[];
  pros: string[];
  cons: string[];
  claimProcessRating: number; // 1-5
}

// ============================================================
// HEALTH INSURERS (6)
// ============================================================
export const healthInsurers: HealthInsurer[] = [
  {
    slug: 'hdfc-ergo-health',
    name: 'HDFC ERGO',
    type: 'health',
    logoPlaceholder: 'HDFC ERGO',
    csr: 89,
    networkHospitals: 13000,
    premiumFor10L: 8500,
    features: [
      'Cashless claim at 13,000+ network hospitals',
      'No medical check-up up to 45 years for ₹10L sum insured',
      'Day care procedures covered',
      'AYUSH treatment covered',
      'Automatic sum insured restoration up to 100%',
      'Annual health check-up included',
      'Worldwide emergency cover available',
    ],
    pros: [
      'Strong brand with HDFC backing',
      'Large hospital network across India',
      'Quick cashless approval process',
      'Wide range of plans for all age groups',
      'Good customer service and digital experience',
    ],
    cons: [
      'Premium slightly higher than competitors',
      'Strict pre-existing disease waiting period of 4 years',
      'Room rent capping in some plans',
      'Co-payment applicable for senior citizen plans',
    ],
    waitingPeriod: 'Initial 30 days, 2 years for specific diseases, 4 years for pre-existing conditions',
    roomRent: '1% of sum insured per day (standard plans); No capping in Optima Secure',
    restoration: '100% restoration once in a policy year for unrelated illness',
  },
  {
    slug: 'niva-bupa',
    name: 'Niva Bupa',
    type: 'health',
    logoPlaceholder: 'Niva Bupa',
    csr: 91,
    networkHospitals: 10000,
    premiumFor10L: 7800,
    features: [
      'Cashless claim at 10,000+ network hospitals',
      'ReAssure benefit: unlimited restoration of sum insured',
      'No claim-based loading on renewal premium',
      'Day care procedures covered (590+ listed)',
      'AYUSH treatment covered',
      'Mental health cover included',
      'Modern treatment methods covered',
    ],
    pros: [
      'High claim settlement ratio',
      'Unlimited restoration benefit',
      'No premium loading based on claims',
      'Mental health coverage included',
      'Good digital claims experience',
    ],
    cons: [
      'Smaller hospital network vs HDFC ERGO',
      'Limited add-on riders available',
      'Room rent limit in base plans',
      'Customer service can be slow during peak season',
    ],
    waitingPeriod: 'Initial 30 days, 2 years for specific diseases, 3 years for pre-existing conditions (select plans)',
    roomRent: 'Single AC room up to 1% of sum insured; No cap in ReAssure plan',
    restoration: 'Unlimited restoration for unrelated illness (ReAssure); 100% once for related illness',
  },
  {
    slug: 'care-health',
    name: 'Care Health Insurance',
    type: 'health',
    logoPlaceholder: 'Care Health',
    csr: 93,
    networkHospitals: 20000,
    premiumFor10L: 7500,
    features: [
      'Cashless claim at 20,000+ network hospitals (largest network)',
      'Automatic 2x sum insured enhancement after claim-free years',
      'No co-payment in select plans',
      'Day care procedures covered',
      'AYUSH treatment covered',
      'Annual health check-up included',
      'Smart claim with 2-hour cashless approval',
      'Unlimited automatic restoration',
    ],
    pros: [
      'Largest hospital network in India',
      'Highest claim settlement ratio among standalone insurers',
      'Fast 2-hour cashless approval',
      'No co-payment in Care Advantage plan',
      'Competitive premiums for young adults',
    ],
    cons: [
      'Strict underwriting for pre-existing conditions',
      'Premium increase at renewal can be significant',
      'Limited international coverage',
      'Some plans have room rent sub-limits',
    ],
    waitingPeriod: 'Initial 30 days, 2 years for specific diseases, 3 years for pre-existing conditions (Care Advantage)',
    roomRent: 'No room rent capping in Care Advantage; Single AC room in base plans',
    restoration: 'Unlimited automatic restoration for unrelated illness; 100% for related illness in select plans',
  },
  {
    slug: 'star-health',
    name: 'Star Health Insurance',
    type: 'health',
    logoPlaceholder: 'Star Health',
    csr: 87,
    networkHospitals: 14000,
    premiumFor10L: 8000,
    features: [
      'Cashless claim at 14,000+ network hospitals',
      'Specialized plans for diabetes, cardiac, and senior citizens',
      'No medical check-up up to 45 years for select plans',
      'Day care procedures covered',
      'AYUSH treatment covered',
      'Automatic sum insured restoration',
      'Hospital cash benefit available',
    ],
    pros: [
      'Pioneer in standalone health insurance in India',
      'Specialized disease-specific plans (diabetes, cardiac)',
      'Strong senior citizen plans',
      'In-house claim settlement team (no TPA)',
      'Good cashless network in South India',
    ],
    cons: [
      'Customer service inconsistent in North India',
      'Room rent capping in most plans',
      'Co-payment applicable for senior citizen plans',
      'Claim settlement ratio slightly lower than peers',
    ],
    waitingPeriod: 'Initial 30 days, 2 years for specific diseases, 4 years for pre-existing conditions',
    roomRent: 'Single AC room up to sum insured based capping; varies by plan',
    restoration: '100% restoration once in a policy year for unrelated illness',
  },
  {
    slug: 'icici-lombard-health',
    name: 'ICICI Lombard',
    type: 'health',
    logoPlaceholder: 'ICICI Lombard',
    csr: 86,
    networkHospitals: 6500,
    premiumFor10L: 8200,
    features: [
      'Cashless claim at 6,500+ network hospitals',
      'Wellness rewards program with premium discounts',
      'Day care procedures covered',
      'AYUSH treatment covered',
      'Global coverage for emergencies',
      'Domiciliary hospitalization covered',
      'No claim bonus up to 100%',
    ],
    pros: [
      'Strong brand with ICICI backing',
      'Innovative wellness rewards program',
      'Global emergency coverage available',
      'Good digital experience and app',
      'Bundled product options (health + personal accident)',
    ],
    cons: [
      'Smaller hospital network compared to competitors',
      'Lower claim settlement ratio',
      'Room rent capping in most plans',
      'Pre-existing disease waiting period of 4 years',
    ],
    waitingPeriod: 'Initial 30 days, 2 years for specific diseases, 4 years for pre-existing conditions',
    roomRent: '1% of sum insured per day (standard plans); No capping in Elevate plan',
    restoration: '100% restoration once in a policy year for unrelated illness',
  },
  {
    slug: 'acko-health',
    name: 'ACKO',
    type: 'health',
    logoPlaceholder: 'ACKO',
    csr: 88,
    networkHospitals: 5000,
    premiumFor10L: 6800,
    features: [
      'Cashless claim at 5,000+ network hospitals',
      'Zero deduction at claim (no room rent, co-pay, or sub-limit deductions)',
      'No claim-based premium loading',
      'Day care procedures covered',
      'AYUSH treatment covered',
      '100% sum insured restoration',
      'Completely digital experience',
      'No medical check-up up to 55 years',
    ],
    pros: [
      'Most affordable premiums among top insurers',
      'Zero deduction at claim — full sum insured usable',
      'No premium loading for claims',
      'Completely digital, fast onboarding',
      'No co-payment in any plan',
    ],
    cons: [
      'Smallest hospital network among top insurers',
      'Limited plan variants available',
      'No in-person branch support',
      'Relatively new in health insurance market',
      'Cashless may be limited in tier-3 cities',
    ],
    waitingPeriod: 'Initial 30 days, 2 years for specific diseases, 3 years for pre-existing conditions',
    roomRent: 'No room rent capping — any room up to sum insured',
    restoration: '100% restoration once in a policy year for unrelated illness',
  },
];

// ============================================================
// MOTOR INSURERS (6)
// ============================================================
export const motorInsurers: MotorInsurer[] = [
  {
    slug: 'hdfc-ergo-motor',
    name: 'HDFC ERGO',
    type: 'motor',
    logoPlaceholder: 'HDFC ERGO',
    csr: 84,
    networkGarages: 7500,
    odRatePercent: 3.5,
    features: [
      '7,500+ cashless network garages',
      'Instant policy issuance online',
      'Comprehensive add-on options (zero dep, engine protect, RSA)',
      'Quick cashless claim settlement',
      'Personal accident cover included',
      'No inspection required for renewal within 90 days',
    ],
    pros: [
      'Large garage network across India',
      'Strong brand and reliable claim settlement',
      'Good digital experience',
      'Quick roadside assistance response',
      'Wide add-on coverage options',
    ],
    cons: [
      'Premium slightly higher than digital-first insurers',
      'Strict documentation for claims',
      'OD rates can be higher for luxury vehicles',
    ],
    claimProcessRating: 4,
  },
  {
    slug: 'acko-motor',
    name: 'ACKO',
    type: 'motor',
    logoPlaceholder: 'ACKO',
    csr: 89,
    networkGarages: 2000,
    odRatePercent: 2.8,
    features: [
      '2,000+ cashless network garages',
      'Lowest premiums with direct-to-consumer model',
      'Instant digital claims for minor damage',
      'Zero depreciation cover available',
      'Engine protection and RSA add-ons',
      'No paperwork — fully digital',
    ],
    pros: [
      'Most affordable motor insurance premiums',
      'Fastest digital claim settlement for minor damage',
      'No paperwork or middlemen',
      'Transparent pricing — no hidden charges',
      'High claim settlement ratio',
    ],
    cons: [
      'Smallest garage network',
      'No in-person support or branches',
      'Limited cashless options in rural areas',
      'Complex claims may require more follow-up',
    ],
    claimProcessRating: 4,
  },
  {
    slug: 'go-digit-motor',
    name: 'Go Digit',
    type: 'motor',
    logoPlaceholder: 'Go Digit',
    csr: 86,
    networkGarages: 5000,
    odRatePercent: 3.0,
    features: [
      '5,000+ cashless network garages',
      'Smartphone-based self-inspection for claims',
      'Quick claim settlement with photo-based process',
      'Zero depreciation, engine protect, and RSA add-ons',
      'Tyre protect and return-to-invoice add-ons',
      'Customizable plans — choose what you need',
    ],
    pros: [
      'Innovative claim process with photo-based settlement',
      'Customizable add-on selection',
      'Good balance of price and coverage',
      'Strong digital-first experience',
      'Quick policy issuance',
    ],
    cons: [
      'Limited branch network',
      'Customer support can be slow during peak claims',
      'Cashless garages limited in tier-3 cities',
    ],
    claimProcessRating: 4,
  },
  {
    slug: 'icici-lombard-motor',
    name: 'ICICI Lombard',
    type: 'motor',
    logoPlaceholder: 'ICICI Lombard',
    csr: 83,
    networkGarages: 6000,
    odRatePercent: 3.4,
    features: [
      '6,000+ cashless network garages',
      'Garage cash facility for immediate repairs',
      'Comprehensive add-on options',
      'Quick roadside assistance',
      'Personal accident cover up to ₹15L',
      'No inspection for renewal within 90 days',
    ],
    pros: [
      'Strong brand with ICICI backing',
      'Garage cash facility is unique and helpful',
      'Good coverage for high-value vehicles',
      'Strong roadside assistance network',
    ],
    cons: [
      'Premium on the higher side',
      'Claim settlement ratio lower than competitors',
      'Documentation-heavy claim process',
      'Add-on prices can be expensive',
    ],
    claimProcessRating: 3,
  },
  {
    slug: 'tata-aig-motor',
    name: 'TATA AIG',
    type: 'motor',
    logoPlaceholder: 'TATA AIG',
    csr: 85,
    networkGarages: 5000,
    odRatePercent: 3.2,
    features: [
      '5,000+ cashless network garages',
      'Comprehensive add-on suite including zero dep, engine protect, RSA',
      'Consumables cover available',
      'Key replacement cover',
      'Personal accident cover up to ₹15L',
      'No depreciation on metal parts (select plans)',
    ],
    pros: [
      'Trusted TATA brand',
      'Good claim settlement ratio',
      'Consumables and key replacement add-ons available',
      'Competitive pricing for mid-segment vehicles',
      'Good roadside assistance',
    ],
    cons: [
      'Customer service inconsistent in some regions',
      'Cashless garage network smaller than HDFC ERGO',
      'Complex claim documentation required',
    ],
    claimProcessRating: 4,
  },
  {
    slug: 'bajaj-allianz-motor',
    name: 'Bajaj Allianz',
    type: 'motor',
    logoPlaceholder: 'Bajaj Allianz',
    csr: 82,
    networkGarages: 6000,
    odRatePercent: 3.3,
    features: [
      '6,000+ cashless network garages',
      'Instant claim settlement for minor damage via Motor OTS',
      'Comprehensive add-on options including zero dep, engine protect',
      'Convenience cover (loss of keys, hotel stay, travel expenses)',
      'Personal accident cover up to ₹15L',
      '24x7 roadside assistance',
    ],
    pros: [
      'Motor OTS (On-the-Spot) settlement for minor claims',
      'Unique convenience cover add-on',
      'Strong brand presence across India',
      'Good coverage for two-wheelers',
    ],
    cons: [
      'Lowest claim settlement ratio among top motor insurers',
      'Premium can be higher for comprehensive plans',
      'Cashless approval can be slow for major claims',
      'Limited digital experience compared to ACKO/Digit',
    ],
    claimProcessRating: 3,
  },
];

// Helper functions
export function getInsurerBySlug(slug: string): HealthInsurer | MotorInsurer | undefined {
  return [...healthInsurers, ...motorInsurers].find(i => i.slug === slug);
}

export function parseComparisonSlug(slug: string): { insurerA: HealthInsurer | MotorInsurer | null; insurerB: HealthInsurer | MotorInsurer | null } {
  const parts = slug.split('-vs-');
  if (parts.length !== 2) return { insurerA: null, insurerB: null };
  const allInsurers = [...healthInsurers, ...motorInsurers];
  const insurerA = allInsurers.find(i => i.slug === parts[0]) || null;
  const insurerB = allInsurers.find(i => i.slug === parts[1]) || null;
  return { insurerA, insurerB };
}

export function generateComparisonSlugs(): string[] {
  const slugs: string[] = [];
  for (let i = 0; i < healthInsurers.length; i++) {
    for (let j = i + 1; j < healthInsurers.length; j++) {
      slugs.push(`${healthInsurers[i].slug}-vs-${healthInsurers[j].slug}`);
    }
  }
  for (let i = 0; i < motorInsurers.length; i++) {
    for (let j = i + 1; j < motorInsurers.length; j++) {
      slugs.push(`${motorInsurers[i].slug}-vs-${motorInsurers[j].slug}`);
    }
  }
  return slugs;
}
