// =============================================================================
// IRDAI Rate Data — Motor & Health Insurance
// Source: IRDAI Third-Party Premium Order, Tariff Advisory Committee
// Last Updated: FY 2025-26
// =============================================================================

// ---------------------------------------------------------------------------
// Third-Party Premium Rates (Annual) — effective 1 June 2024
// ---------------------------------------------------------------------------
export const tpRates = {
  Car: {
    upTo1000cc: 2094,
    '1001to1500cc': 3416,
    above1500cc: 7897,
  },
  Bike: {
    upTo75cc: 538,
    '76to150cc': 714,
    '151to350cc': 1366,
    above350cc: 2804,
  },
  EV_BIKE: {
    upto4kW: 457,
    '4to25kW': 607,
    above25kW: 1161,
  },
  EV_CAR: {
    upto30kW: 1780,
    '30to65kW': 2904,
    above65kW: 6712,
  },
} as const;

// ---------------------------------------------------------------------------
// IDV Depreciation Rates (age of vehicle → % depreciation)
// ---------------------------------------------------------------------------
export const idvDepreciation: Record<number, number> = {
  0: 0,       // brand new
  0.5: 0.05,  // 6 months
  1: 0.15,
  2: 0.20,
  3: 0.30,
  4: 0.40,
  5: 0.50,
};

// ---------------------------------------------------------------------------
// No-Claim Bonus (NCB) Discount Slabs
// ---------------------------------------------------------------------------
export const ncbSlabs: Record<number, number> = {
  0: 0,
  20: 0.20,   // 1 claim-free year
  25: 0.25,   // 2 claim-free years
  35: 0.35,   // 3 claim-free years
  45: 0.45,   // 4 claim-free years
  50: 0.50,   // 5+ claim-free years
};

// ---------------------------------------------------------------------------
// Add-On Rates (expressed as % of OD premium or flat ₹)
// ---------------------------------------------------------------------------
export const addonRates: Record<string, { type: 'percentage' | 'flat'; value: number; label: string }> = {
  zeroDep: { type: 'percentage', value: 0.27, label: 'Zero Depreciation' },
  rsa: { type: 'flat', value: 850, label: 'Road Side Assistance' },
  engineProtect: { type: 'percentage', value: 0.14, label: 'Engine Protect' },
  consumables: { type: 'percentage', value: 0.027, label: 'Consumables Cover' },
  returnToInvoice: { type: 'percentage', value: 0.13, label: 'Return to Invoice' },
  tyreProtect: { type: 'percentage', value: 0.13, label: 'Tyre Protect' },
  ncbProtect: { type: 'percentage', value: 0.065, label: 'NCB Protect' },
  keyProtect: { type: 'percentage', value: 0.04, label: 'Key Replacement' },
};

// ---------------------------------------------------------------------------
// GST Information
// ---------------------------------------------------------------------------
export const gstInfo = {
  motor: {
    rate: 0.18,
    label: '18% GST on motor insurance',
    isExempt: false,
  },
  health: {
    rate: 0,
    label: 'GST exempt on health insurance w.e.f. 22 Sept 2025 (GST Council 56th Meeting)',
    isExempt: true,
    exemptionDate: '2025-09-22',
  },
  life: {
    rate: 0,
    label: 'GST exempt on life/term insurance w.e.f. 22 Sept 2025',
    isExempt: true,
    exemptionDate: '2025-09-22',
  },
};

// ---------------------------------------------------------------------------
// Age Loading Factors for Health Insurance
// ---------------------------------------------------------------------------
export const ageLoadingFactors: Record<number, number> = {
  25: 0.8,
  30: 1.0,
  35: 1.15,
  40: 1.3,
  45: 1.5,
  50: 1.8,
  55: 2.2,
  60: 2.8,
};

// Alias for backward compatibility
export const ageMultipliers = ageLoadingFactors;

// Base health insurance premium for ₹5L sum insured (30-year-old, individual, no PED)
export const baseHealthPremium = 6500;
