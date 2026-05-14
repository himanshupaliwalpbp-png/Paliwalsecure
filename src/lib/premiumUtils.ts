// ── Health Insurance Types & Calculation ──────────────────
export interface HealthCalcInput {
  age: number;
  sumInsured: number; // in lakhs
  familyComposition: 'self' | 'self-spouse' | 'self-spouse-kids' | 'self-parents';
  preExistingDiseases: string[]; // 'diabetes' | 'bp' | 'heart'
  cityTier: 1 | 2 | 3;
  smoker: boolean;
}

export interface TermCalcInput {
  age: number;
  sumAssured: number; // in crores
  policyTerm: number; // years
  gender: 'male' | 'female';
  smoker: boolean;
}

export interface MotorCalcInput {
  vehicleType: 'car' | 'bike';
  registrationYear: number;
  idv: number; // in ₹
  ncb: number; // percentage 0,20,25,35,45,50
  addOns: string[]; // 'zeroDep' | 'engineCover' | 'rsa'
}

export interface PremiumBreakdown {
  base: number;
  loadings: { name: string; amount: number }[];
  subtotal: number;
  gst: number;
  totalMonthly: number;
  totalYearly: number;
}

export function calculateHealthPremium(input: HealthCalcInput): PremiumBreakdown {
  // Base: ₹500/month for 30-year-old, ₹5L sum insured, Tier-2, non-smoker
  let base = 500;
  const loadings: { name: string; amount: number }[] = [];

  // Age loading: +5% for every 5 years above 30
  if (input.age > 30) {
    const ageBands = Math.floor((input.age - 30) / 5);
    const ageLoading = Math.round(base * 0.05 * ageBands);
    loadings.push({ name: `Age loading (${input.age} yrs)`, amount: ageLoading });
    base += ageLoading;
  }

  // Sum insured loading
  const siLoadingMap: Record<number, number> = { 5: 0, 10: 0.10, 25: 0.25, 50: 0.50, 100: 1.0 };
  const siRate = siLoadingMap[input.sumInsured] ?? 0.5;
  if (siRate > 0) {
    const siLoading = Math.round(500 * siRate);
    loadings.push({ name: `Sum Insured loading (₹${input.sumInsured}L)`, amount: siLoading });
    base += siLoading;
  }

  // Family composition loading
  const familyLoadingMap: Record<string, number> = {
    'self': 0, 'self-spouse': 0.20, 'self-spouse-kids': 0.30, 'self-parents': 0.50,
  };
  const familyRate = familyLoadingMap[input.familyComposition] ?? 0;
  if (familyRate > 0) {
    const familyLoading = Math.round(base * familyRate);
    loadings.push({ name: `Family loading`, amount: familyLoading });
    base += familyLoading;
  }

  // PED loading
  if (input.preExistingDiseases.length > 0) {
    let pedRate = 0;
    if (input.preExistingDiseases.includes('heart')) pedRate += 0.30;
    if (input.preExistingDiseases.includes('diabetes')) pedRate += 0.15;
    if (input.preExistingDiseases.includes('bp')) pedRate += 0.15;
    if (input.preExistingDiseases.length > 1) pedRate = Math.min(pedRate + 0.10, 0.50);
    const pedLoading = Math.round(base * pedRate);
    loadings.push({ name: `PED loading (${input.preExistingDiseases.join(', ')})`, amount: pedLoading });
    base += pedLoading;
  }

  // City loading
  if (input.cityTier === 1) {
    const cityLoading = Math.round(base * 0.15);
    loadings.push({ name: 'Tier-1 city loading', amount: cityLoading });
    base += cityLoading;
  } else if (input.cityTier === 3) {
    const cityDiscount = Math.round(base * 0.10);
    loadings.push({ name: 'Tier-3 city discount', amount: -cityDiscount });
    base -= cityDiscount;
  }

  // Smoker loading
  if (input.smoker) {
    const smokerLoading = Math.round(base * 0.25);
    loadings.push({ name: 'Smoker loading', amount: smokerLoading });
    base += smokerLoading;
  }

  const subtotal = base;
  const gst = Math.round(subtotal * 0.18);
  const totalMonthly = subtotal + gst;
  const totalYearly = totalMonthly * 12;

  return { base: 500, loadings, subtotal, gst, totalMonthly, totalYearly };
}

export function calculateTermPremium(input: TermCalcInput): PremiumBreakdown {
  // Base: ₹750/month for 30-year-old male, ₹1Cr cover, 30-year term, non-smoker
  let base = 750;
  const loadings: { name: string; amount: number }[] = [];

  // Age loading: +8% per year above 30
  if (input.age > 30) {
    const ageLoading = Math.round(base * 0.08 * (input.age - 30));
    loadings.push({ name: `Age loading (${input.age} yrs)`, amount: ageLoading });
    base += ageLoading;
  }

  // Sum assured scaling
  const saLoadingMap: Record<number, number> = { 0.5: -0.15, 1: 0, 2: 0.25, 5: 0.60 };
  const saRate = saLoadingMap[input.sumAssured] ?? 0.25;
  if (saRate !== 0) {
    const saLoading = Math.round(750 * saRate);
    loadings.push({ name: `Sum Assured scaling (₹${input.sumAssured}Cr)`, amount: saLoading });
    base += saLoading;
  }

  // Female discount
  if (input.gender === 'female') {
    const femaleDiscount = Math.round(base * 0.10);
    loadings.push({ name: 'Female discount', amount: -femaleDiscount });
    base -= femaleDiscount;
  }

  // Smoker loading
  if (input.smoker) {
    const smokerLoading = Math.round(base * 0.30);
    loadings.push({ name: 'Smoker loading', amount: smokerLoading });
    base += smokerLoading;
  }

  const subtotal = base;
  const gst = Math.round(subtotal * 0.18);
  const totalMonthly = subtotal + gst;
  const totalYearly = totalMonthly * 12;

  return { base: 750, loadings, subtotal, gst, totalMonthly, totalYearly };
}

export function calculateMotorPremium(input: MotorCalcInput): PremiumBreakdown {
  const loadings: { name: string; amount: number }[] = [];

  // OD Premium
  const odRate = input.vehicleType === 'car' ? 0.035 : 0.05;
  let odPremium = Math.round(input.idv * odRate);
  const base = odPremium;

  // NCB discount on OD
  if (input.ncb > 0) {
    const ncbDiscount = Math.round(odPremium * (input.ncb / 100));
    loadings.push({ name: `NCB discount (${input.ncb}%)`, amount: -ncbDiscount });
    odPremium -= ncbDiscount;
  }

  // TP Premium (IRDAI 2025 rates)
  let tpPremium = input.vehicleType === 'bike' ? 1000 : 2094; // default <1000cc car
  loadings.push({ name: 'Third-party premium', amount: tpPremium });

  // Add-ons
  if (input.addOns.includes('zeroDep')) {
    const zeroDep = 2500;
    loadings.push({ name: 'Zero Depreciation', amount: zeroDep });
    odPremium += zeroDep;
  }
  if (input.addOns.includes('engineCover')) {
    const engineCover = 1500;
    loadings.push({ name: 'Engine Cover', amount: engineCover });
    odPremium += engineCover;
  }
  if (input.addOns.includes('rsa')) {
    const rsa = 800;
    loadings.push({ name: 'Roadside Assistance', amount: rsa });
    odPremium += rsa;
  }

  const subtotal = odPremium + tpPremium;
  const gst = Math.round(subtotal * 0.18);
  const totalYearly = subtotal + gst;

  return { base, loadings, subtotal, gst, totalMonthly: Math.round(totalYearly / 12), totalYearly };
}

// ── Indian Number Formatting ──────────────────────────────
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
  return `₹${formatIndianCurrency(amount)}`;
}
