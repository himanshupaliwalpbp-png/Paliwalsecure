// =============================================================================
// Barrel Export — Insurance Comparison Engine
// Re-exports everything from all data and engine files
// =============================================================================

// --- Motor Insurance Rates ---
export {
  IRDAI_TP_ANNUAL,
  BUNDLED_5YR,
  IDV_DEPRECIATION_RATES,
  OD_RATE_PERCENT,
  ADDON_RATE,
  NCB_DISCOUNT,
  MOTOR_GST,
  PA_COVER,
  PENDING_HIKE_NOTE,
} from './motor-rates';

export type {
  MotorInsurer,
  MotorZone,
  ODZoneRate,
  ODInsurerRate,
  AddonRateDef,
} from './motor-rates';

// --- Health Insurance Rates ---
export {
  HEALTH_GST,
  HEALTH_BASE_PREMIUM,
  FLOATER_LOADING,
  ZONE_1_CITIES,
  ZONE_1_LOADING,
  ZONE_2_LOADING,
  PED_LOADING,
  PED_DECLINE_LIKELY,
  PED_RECOMMENDATIONS,
  HEALTH_ADDONS,
  HEALTH_INSURER_DATA,
} from './health-rates';

export type {
  HealthInsurer,
  AgeBand,
  SumInsuredKey,
  HealthAgeRates,
  HealthSIRates,
  HealthBasePremium,
  HealthAddon,
  HealthInsurerAddons,
  HealthInsurerDataItem,
  PEDLoading,
} from './health-rates';

// --- Life Insurance Rates ---
export {
  LIFE_GST,
  TERM_ANNUAL_PREMIUM_PER_CR,
  SMOKER_LOADING,
  LIMITED_PAY,
  RETURN_OF_PREMIUM,
  LIFE_INSURER_DATA,
} from './life-rates';

export type {
  LifeInsurer,
  LifeAge,
  TermPremiumByAge,
  TermPremiumByInsurer,
  LimitedPayFactors,
  LifeInsurerDataItem,
} from './life-rates';

// --- Travel Insurance Rates ---
export {
  TRAVEL_GST,
  TRAVEL_SENIOR_MULTIPLIER,
  TRAVEL_DAILY_RATES,
  TRAVEL_ADDON_RATES,
} from './travel-rates';

export type {
  TravelRegion,
  TravellerType,
  TravelInsurer,
  TravelRegionRate,
  TravelDailyRates,
  TravelAddonRate,
} from './travel-rates';

// --- Home Insurance Rates ---
export {
  HOME_GST,
  HOME_STRUCTURE_RATES,
  HOME_CONTENTS_RATES,
  HOME_ZONE_LOADING,
  HIGH_SEISMIC_STATES,
  SEISMIC_LOADING,
  FLOOD_PRONE_CITIES,
  FLOOD_LOADING,
} from './home-rates';

export type {
  HomeInsurer,
  HomeStructureRate,
  HomeStructureRatesByInsurer,
  HomeContentsRate,
  HomeContentsRatesByInsurer,
  HomeZoneLoading,
} from './home-rates';

// --- Insurer Master ---
export {
  INSURER_MASTER,
} from './insurer-master';

export type {
  InsurerCategory,
  InsuranceProduct,
  InsurerRecord,
} from './insurer-master';

// --- GST Rules ---
export {
  GST_RATE_TABLE,
  HEALTH_GST_EXEMPTION_DATE,
  LIFE_GST_EXEMPTION_DATE,
  getGSTRate,
  isGSTExempt,
  calculateGST,
  getGSTSummary,
} from './gst-rules';

export type {
  GSTRateConfig,
} from './gst-rules';

// --- Data Freshness ---
export {
  IRDAI_REG_NO,
  AGENT_NAME,
  AGENT_PHONE,
  DATA_FRESHNESS,
  getDataFreshness,
  isDataStale,
  getFormattedLastUpdated,
  getAgentDisclosure,
} from './data-freshness';

export type {
  DataFreshnessEntry,
  DataFreshnessMap,
} from './data-freshness';

// --- Compare Engine ---
export {
  calculateMotorQuote,
  calculateHealthQuote,
  calculateLifeQuote,
  calculateTravelQuote,
  calculateHomeQuote,
  formatINR,
} from './compare-engine';

export type {
  QuoteBreakdown,
  MotorVehicleType,
  MotorCCBand,
  MotorAddOn,
  MotorVehicleDetails,
  HealthPED,
  HealthDetails,
  LifePayTerm,
  LifeDetails,
  TravellerType as TravelTravellerType,
  TravelDetails,
  HomeCoverType,
  HomeContentsCoverType,
  HomeDetails,
} from './compare-engine';
