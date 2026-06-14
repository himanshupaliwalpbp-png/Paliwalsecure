// ═══════════════════════════════════════════════════════════════
// Age-Based Insurance Data — IRDAI 2024-25 & Industry Rates
// ═══════════════════════════════════════════════════════════════
// Sources:
// - IRDAI Annual Report 2024-25
// - Industry premium tables for Health & Term Life
// - IRDAI 2025-26 Age-Related Guidelines
// - Senior Citizen Health Plan comparisons (2026)
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// 1. Health Insurance Age-Based Premium Table (₹10L cover)
// Source: Industry premium data 2024-25
// Base: Healthy non-smoker, ₹10 Lakh sum insured
// ═══════════════════════════════════════════════════════════════
export const HEALTH_AGE_PREMIUM_10L: {
  age: number;
  annual: number;
  label: string;
}[] = [
  { age: 25, annual: 8500, label: 'Young Adult' },
  { age: 30, annual: 10000, label: 'Base Rate' },
  { age: 35, annual: 14000, label: 'Mid-Career' },
  { age: 40, annual: 18000, label: 'Pre-Senior' },
  { age: 45, annual: 24000, label: 'Senior Entry' },
  { age: 50, annual: 32000, label: 'Senior' },
  { age: 55, annual: 42000, label: 'Senior Plus' },
  { age: 60, annual: 60000, label: 'Super Senior' },
];

// Loading factors for health insurance
export const HEALTH_LOADINGS = {
  smoker: 0.25,       // +25%
  diabetes: 0.30,     // +30%
  hypertension: 0.15, // +15%
  heart: 0.50,        // +50%
} as const;

// Sum Insured scaling from ₹10L base
export const SI_SCALING_FROM_10L: Record<number, number> = {
  3: 0.45,    // ₹3 Lakh
  5: 0.65,    // ₹5 Lakh
  10: 1.0,    // ₹10 Lakh (Base)
  15: 1.30,   // ₹15 Lakh
  25: 1.75,   // ₹25 Lakh
  50: 2.40,   // ₹50 Lakh
  100: 3.20,  // ₹1 Crore
};

// ═══════════════════════════════════════════════════════════════
// 2. Senior Citizen Health Plans (2026)
// Source: Insurer product brochures & IRDAI filings
// ═══════════════════════════════════════════════════════════════
export interface SeniorPlan {
  name: string;
  insurer: string;
  entryAge: string;
  coPay: string;
  pedWaiting: string;
  sumInsuredRange: string;
  renewalAge: string;
  highlights: string[];
  premiumFrom: number;   // Approximate annual premium for ₹5L, age 65
  csr: number;
  rating: number;        // Out of 5
}

export const SENIOR_CITIZEN_PLANS: SeniorPlan[] = [
  {
    name: 'Red Carpet',
    insurer: 'Star Health',
    entryAge: '60–75 yrs',
    coPay: '20%',
    pedWaiting: '12 months',
    sumInsuredRange: '₹1L – ₹25L',
    renewalAge: 'Lifelong',
    highlights: [
      'Shortest PED waiting: 12 months only',
      'No pre-medical check-up up to 65 yrs',
      'Day care procedures covered',
      'AYUSH treatment covered',
    ],
    premiumFrom: 28500,
    csr: 87.5,
    rating: 4.2,
  },
  {
    name: 'Senior Plan',
    insurer: 'Care Health',
    entryAge: '60+ yrs',
    coPay: '20%',
    pedWaiting: '24 months',
    sumInsuredRange: '₹3L – ₹25L',
    renewalAge: 'Lifelong',
    highlights: [
      'Annual health check-up included',
      'Automatic 10% sum insured restoration',
      'Domiciliary hospitalization covered',
      'No capping on room rent',
    ],
    premiumFrom: 26000,
    csr: 89.2,
    rating: 4.0,
  },
  {
    name: 'Senior First',
    insurer: 'Niva Bupa',
    entryAge: '60–80 yrs',
    coPay: '10%',
    pedWaiting: '24 months',
    sumInsuredRange: '₹5L – ₹25L',
    renewalAge: 'Lifelong',
    highlights: [
      'Lowest co-pay: only 10%',
      'Modern treatment methods covered',
      'In-built personal accident cover',
      'Worldwide emergency cover',
    ],
    premiumFrom: 31000,
    csr: 86.8,
    rating: 4.3,
  },
  {
    name: 'Optima Senior',
    insurer: 'HDFC ERGO',
    entryAge: '61+ yrs',
    coPay: '0–10% (optional)',
    pedWaiting: '36 months',
    sumInsuredRange: '₹5L – ₹75L',
    renewalAge: 'Lifelong',
    highlights: [
      'Optional co-pay: 0% possible!',
      'Highest sum insured: up to ₹75L',
      'Restore benefit up to 100%',
      'HDFC brand trust & wide network',
    ],
    premiumFrom: 35000,
    csr: 98.85,
    rating: 4.5,
  },
];

// ═══════════════════════════════════════════════════════════════
// 3. Term Insurance Premium Chart (₹1 Crore, till age 65)
// Source: Industry term life premium rates 2024-25
// Healthy non-smoker male
// ═══════════════════════════════════════════════════════════════
export interface TermPremiumRange {
  age: number;
  minPremium: number;
  maxPremium: number;
  avgPremium: number;
  coverAmount: string;
  policyTerm: string;
}

export const TERM_PREMIUM_CHART: TermPremiumRange[] = [
  {
    age: 25,
    minPremium: 15951,
    maxPremium: 19333,
    avgPremium: 17642,
    coverAmount: '₹1 Crore',
    policyTerm: 'Till age 65',
  },
  {
    age: 30,
    minPremium: 19093,
    maxPremium: 24660,
    avgPremium: 21877,
    coverAmount: '₹1 Crore',
    policyTerm: 'Till age 65',
  },
  {
    age: 35,
    minPremium: 21906,
    maxPremium: 25932,
    avgPremium: 23919,
    coverAmount: '₹1 Crore',
    policyTerm: 'Till age 65',
  },
  {
    age: 40,
    minPremium: 28806,
    maxPremium: 30126,
    avgPremium: 29466,
    coverAmount: '₹1 Crore',
    policyTerm: 'Till age 65',
  },
];

// Term life loading factors
export const TERM_LOADINGS = {
  femaleDiscount: 0.10,    // -10%
  smokerMin: 0.25,         // +25% to +50%
  diabetes: 0.50,          // +50%
  hypertension: 0.25,      // +25%
  heart: 0.75,             // +75%
} as const;

// ═══════════════════════════════════════════════════════════════
// 4. IRDAI 2025-26 Age-Related Guidelines
// Source: IRDAI (Health Insurance) Regulations 2025-26
// ═══════════════════════════════════════════════════════════════
export interface IRDAIGuideline {
  title: string;
  description: string;
  icon: string;
  impact: 'positive' | 'neutral' | 'important';
  effectiveFrom: string;
}

export const IRDAI_AGE_GUIDELINES: IRDAIGuideline[] = [
  {
    title: 'No Upper Age Limit for Buying Policies',
    description: 'IRDAI ne insurance companies ko mandate kiya hai ki woh kisi bhi age pe policy nahi refuse kar sakte. Ab 60+, 70+, ya 80+ me bhi naya policy khareed sakte hain.',
    icon: '🎂',
    impact: 'positive',
    effectiveFrom: 'April 2025',
  },
  {
    title: 'PED Waiting Period: Maximum 3 Years',
    description: 'Pre-existing diseases ka waiting period ab maximum 3 years hai. Kuch insurers 1-2 year bhi dete hain. Star Health Red Carpet sirf 12 months!',
    icon: '⏳',
    impact: 'important',
    effectiveFrom: 'April 2025',
  },
  {
    title: 'Moratorium Period: 5 Years',
    description: '5 years continuous renewal ke baad insurer policy reject nahi kar sakta. Matlab 5 saal baad aapki policy guaranteed hai — koi claim reject nahi hoga older diseases ke liye.',
    icon: '🔒',
    impact: 'positive',
    effectiveFrom: 'April 2025',
  },
  {
    title: 'Lifelong Renewability Guaranteed',
    description: 'Ek baar policy le li toh lifetime renew kar sakte hain. Insurer refuse nahi kar sakta, chahe kitni bhi claims ho. Bas premium time pe bhariye.',
    icon: '♾️',
    impact: 'positive',
    effectiveFrom: 'April 2025',
  },
];

// ═══════════════════════════════════════════════════════════════
// 5. HLV (Human Life Value) Configuration
// ═══════════════════════════════════════════════════════════════
export interface HLVResult {
  annualIncome: number;
  annualExpenses: number;
  currentAge: number;
  retirementAge: number;
  outstandingDebts: number;
  hlv: number;
  recommendedCover: number;
  ageMultiplier: number;
  premiumEstimate: number;
}

// Age-based multipliers for HLV recommendation
export const HLV_AGE_MULTIPLIERS: { maxAge: number; multiplier: number; label: string }[] = [
  { maxAge: 25, multiplier: 20, label: 'Early career — zyada cover chahiye' },
  { maxAge: 30, multiplier: 18, label: 'Career building — adequate cover zaroori' },
  { maxAge: 35, multiplier: 15, label: 'Family responsibilities at peak' },
  { maxAge: 40, multiplier: 12, label: 'Mid-career — review your cover' },
  { maxAge: 45, multiplier: 10, label: 'Pre-retirement — debt reduction focus' },
  { maxAge: 50, multiplier: 8, label: 'Near retirement — reduce cover gradually' },
  { maxAge: 55, multiplier: 5, label: 'Pre-retirement — minimal cover needed' },
  { maxAge: 60, multiplier: 3, label: 'Retirement — only debt cover needed' },
  { maxAge: 100, multiplier: 2, label: 'Post-retirement — final expenses only' },
];

export function getAgeMultiplier(age: number): { multiplier: number; label: string } {
  const bracket = HLV_AGE_MULTIPLIERS.find(b => age <= b.maxAge) ?? HLV_AGE_MULTIPLIERS[HLV_AGE_MULTIPLIERS.length - 1];
  return { multiplier: bracket.multiplier, label: bracket.label };
}

export function calculateHLV(
  annualIncome: number,
  annualExpenses: number,
  currentAge: number,
  retirementAge: number,
  outstandingDebts: number,
): HLVResult {
  const yearsToRetirement = Math.max(retirementAge - currentAge, 1);
  const annualSavings = annualIncome - annualExpenses;
  const hlv = annualSavings * yearsToRetirement;
  const { multiplier, label } = getAgeMultiplier(currentAge);
  const recommendedCover = hlv + outstandingDebts;
  // Estimate premium at ~1% of cover (rough term insurance rate)
  const premiumEstimate = Math.round(recommendedCover * 0.01);

  return {
    annualIncome,
    annualExpenses,
    currentAge,
    retirementAge,
    outstandingDebts,
    hlv,
    recommendedCover,
    ageMultiplier: multiplier,
    premiumEstimate,
  };
}

// ═══════════════════════════════════════════════════════════════
// 6. Format Helpers (re-exported for components)
// ═══════════════════════════════════════════════════════════════
export function formatIndianCurrency(amount: number): string {
  const str = amount.toString();
  let lastThree = str.substring(str.length - 3);
  const otherNumbers = str.substring(0, str.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
}

export function formatRupees(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  return `₹${formatIndianCurrency(amount)}`;
}

export function formatRupeesFull(amount: number): string {
  return `₹${formatIndianCurrency(amount)}`;
}

// ═══════════════════════════════════════════════════════════════
// 7. Health Premium Calculator Function
// ═══════════════════════════════════════════════════════════════
export interface AgeHealthCalcInput {
  age: number;
  sumInsured: number; // in lakhs
  smoker: boolean;
  diabetes: boolean;
  hypertension: boolean;
  heart: boolean;
  familyFloater: boolean;
  oldestMemberAge?: number; // For family floater
}

export interface AgeHealthCalcResult {
  basePremium: number;
  siLoading: number;
  smokerLoading: number;
  pedLoadings: { name: string; amount: number }[];
  familyFloaterLoading: number;
  subtotal: number;
  gst: number;
  totalYearly: number;
  totalMonthly: number;
  premiumAge: number; // Effective age used for calculation
  warnings: string[];
}

export function calculateAgeBasedHealthPremium(input: AgeHealthCalcInput): AgeHealthCalcResult {
  const warnings: string[] = [];
  const pedLoadings: { name: string; amount: number }[] = [];

  // For family floater, use oldest member's age
  const effectiveAge = input.familyFloater && input.oldestMemberAge
    ? Math.max(input.age, input.oldestMemberAge)
    : input.age;

  if (input.familyFloater && input.oldestMemberAge && input.oldestMemberAge > input.age) {
    warnings.push(`Family floater mein sabse bade member ki age (${input.oldestMemberAge}) se premium calculate hoga`);
  }

  // Step 1: Base premium from age table (₹10L)
  let basePremium: number;
  const exact = HEALTH_AGE_PREMIUM_10L.find(r => r.age === effectiveAge);
  if (exact) {
    basePremium = exact.annual;
  } else {
    // Interpolate
    const sorted = [...HEALTH_AGE_PREMIUM_10L].sort((a, b) => a.age - b.age);
    let lower = sorted[0];
    let upper = sorted[sorted.length - 1];
    for (let i = 0; i < sorted.length - 1; i++) {
      if (effectiveAge >= sorted[i].age && effectiveAge <= sorted[i + 1].age) {
        lower = sorted[i];
        upper = sorted[i + 1];
        break;
      }
    }
    if (effectiveAge < sorted[0].age) {
      basePremium = sorted[0].annual;
    } else if (effectiveAge > sorted[sorted.length - 1].age) {
      // Extrapolate beyond 60
      const lastEntry = sorted[sorted.length - 1];
      const secondLast = sorted[sorted.length - 2];
      const yearDiff = lastEntry.age - secondLast.age;
      const premDiff = lastEntry.annual - secondLast.annual;
      const extraYears = effectiveAge - lastEntry.age;
      basePremium = Math.round(lastEntry.annual + (premDiff / yearDiff) * extraYears);
    } else {
      const ratio = (effectiveAge - lower.age) / (upper.age - lower.age);
      basePremium = Math.round(lower.annual + ratio * (upper.annual - lower.annual));
    }
  }

  // Step 2: Sum Insured scaling
  const siFactor = SI_SCALING_FROM_10L[input.sumInsured] ?? 1.0;
  let premium = Math.round(basePremium * siFactor);
  const siLoading = premium - basePremium;

  // Step 3: PED loadings
  if (input.diabetes) {
    const amount = Math.round(premium * HEALTH_LOADINGS.diabetes);
    pedLoadings.push({ name: 'Diabetes (+30%)', amount });
    premium += amount;
  }
  if (input.hypertension) {
    const amount = Math.round(premium * HEALTH_LOADINGS.hypertension);
    pedLoadings.push({ name: 'Hypertension/BP (+15%)', amount });
    premium += amount;
  }
  if (input.heart) {
    const amount = Math.round(premium * HEALTH_LOADINGS.heart);
    pedLoadings.push({ name: 'Heart Condition (+50%)', amount });
    premium += amount;
  }

  // Step 4: Smoker loading
  let smokerLoading = 0;
  if (input.smoker) {
    smokerLoading = Math.round(premium * HEALTH_LOADINGS.smoker);
    premium += smokerLoading;
  }

  // Step 5: Family floater loading
  let familyFloaterLoading = 0;
  if (input.familyFloater) {
    familyFloaterLoading = Math.round(premium * 0.30);
    premium += familyFloaterLoading;
  }

  if (effectiveAge >= 50) {
    warnings.push('Age 50+ pe premium significantly badh jaata hai — jaldi karein, kam pay karein!');
  }
  if (input.heart && input.diabetes) {
    warnings.push('Heart + Diabetes dono hone pe premium bahut zyada hota hai. Compare karein multiple insurers.');
  }

  const subtotal = Math.max(premium, 2000);
  const gst = Math.round(subtotal * 0.18);
  const totalYearly = subtotal + gst;
  const totalMonthly = Math.round(totalYearly / 12);

  return {
    basePremium,
    siLoading,
    smokerLoading,
    pedLoadings,
    familyFloaterLoading,
    subtotal,
    gst,
    totalYearly,
    totalMonthly,
    premiumAge: effectiveAge,
    warnings,
  };
}
