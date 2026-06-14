// =============================================================================
// Home Insurance Rates — FY 2025-26
// =============================================================================

// ---------------------------------------------------------------------------
// GST on Home Insurance
// ---------------------------------------------------------------------------
export const HOME_GST = 0.18;

// ---------------------------------------------------------------------------
// Home Structure Rates (per ₹1,000 of sum insured, annual)
// STANDARD = Fire, lightning, explosion, aircraft damage, riot, storm, etc.
// WITH_EARTHQUAKE = Standard + earthquake / seismic cover
// ---------------------------------------------------------------------------
export type HomeInsurer =
  | 'HDFC_ERGO'
  | 'ICICI_LOMBARD'
  | 'BAJAJ_ALLIANZ'
  | 'TATA_AIG'
  | 'RELIANCE'
  | 'GO_DIGIT'
  | 'NEW_INDIA'
  | 'SBI_GENERAL';

export interface HomeStructureRate {
  STANDARD: number;         // ₹ per ₹1000 SI
  WITH_EARTHQUAKE: number;  // ₹ per ₹1000 SI
}

export interface HomeStructureRatesByInsurer {
  [insurer: string]: HomeStructureRate;
}

export const HOME_STRUCTURE_RATES: HomeStructureRatesByInsurer = {
  HDFC_ERGO:     { STANDARD: 0.90, WITH_EARTHQUAKE: 1.38 },
  ICICI_LOMBARD: { STANDARD: 0.96, WITH_EARTHQUAKE: 1.47 },
  BAJAJ_ALLIANZ: { STANDARD: 0.93, WITH_EARTHQUAKE: 1.42 },
  TATA_AIG:      { STANDARD: 0.99, WITH_EARTHQUAKE: 1.52 },
  RELIANCE:      { STANDARD: 0.88, WITH_EARTHQUAKE: 1.35 },
  GO_DIGIT:      { STANDARD: 0.85, WITH_EARTHQUAKE: 1.30 },
  NEW_INDIA:     { STANDARD: 1.02, WITH_EARTHQUAKE: 1.56 },
  SBI_GENERAL:   { STANDARD: 0.94, WITH_EARTHQUAKE: 1.44 },
};

// ---------------------------------------------------------------------------
// Home Contents Rates (per ₹1,000 of sum insured, annual)
// STANDARD = Fire, natural calamity, etc.
// WITH_BURGLARY = Standard + theft / burglary cover
// ---------------------------------------------------------------------------
export interface HomeContentsRate {
  STANDARD: number;        // ₹ per ₹1000 SI
  WITH_BURGLARY: number;   // ₹ per ₹1000 SI
}

export interface HomeContentsRatesByInsurer {
  [insurer: string]: HomeContentsRate;
}

export const HOME_CONTENTS_RATES: HomeContentsRatesByInsurer = {
  HDFC_ERGO:     { STANDARD: 1.35, WITH_BURGLARY: 2.70 },
  ICICI_LOMBARD: { STANDARD: 1.44, WITH_BURGLARY: 2.88 },
  BAJAJ_ALLIANZ: { STANDARD: 1.40, WITH_BURGLARY: 2.80 },
  TATA_AIG:      { STANDARD: 1.49, WITH_BURGLARY: 2.98 },
  RELIANCE:      { STANDARD: 1.32, WITH_BURGLARY: 2.64 },
  GO_DIGIT:      { STANDARD: 1.28, WITH_BURGLARY: 2.56 },
  NEW_INDIA:     { STANDARD: 1.52, WITH_BURGLARY: 3.04 },
  SBI_GENERAL:   { STANDARD: 1.42, WITH_BURGLARY: 2.84 },
};

// ---------------------------------------------------------------------------
// Zone Loading for Home Insurance
// High-seismic states and flood-prone cities attract additional loading
// ---------------------------------------------------------------------------
export const HIGH_SEISMIC_STATES = [
  'Gujarat',
  'Maharashtra',
  'Bihar',
  'North-East',
  'Himachal Pradesh',
  'Uttarakhand',
  'Jammu & Kashmir',
  'Sikkim',
] as const;

export const SEISMIC_LOADING = 1.25;

export const FLOOD_PRONE_CITIES = [
  'Mumbai',
  'Chennai',
  'Kolkata',
  'Hyderabad',
  'Patna',
  'Guwahati',
  'Srinagar',
] as const;

export const FLOOD_LOADING = 1.20;

// ---------------------------------------------------------------------------
// Home Zone Loading Helper
// ---------------------------------------------------------------------------
export interface HomeZoneLoading {
  seismic: number;
  flood: number;
}

export const HOME_ZONE_LOADING: HomeZoneLoading = {
  seismic: 1.30,
  flood: 1.25,
};
