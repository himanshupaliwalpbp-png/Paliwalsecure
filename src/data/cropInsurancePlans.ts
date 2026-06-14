// ============================================================================
// Paliwal Secure - Crop Insurance Plans Data
// IRDAI-Compliant | Source: PMFBY & Indian Crop Insurance Market 2024-25
// Kisan ki mehnat ka insured fasal — anna data ka suraksha kavach
// ============================================================================

export interface CropInsuranceProduct {
  id: string;
  name: string;
  insurer: string;
  crops: string[];
  seasons: string[];
  premiumRate: string;
  sumInsuredPerAcre: number;
  features: string[];
  govtSubsidy: boolean;
  rating: number;
  irdaiRegNo: string;
}

export const cropInsurancePlans: CropInsuranceProduct[] = [
  {
    id: 'crop-001',
    name: 'PMFBY – Pradhan Mantri Fasal Bima Yojana',
    insurer: 'Agriculture Insurance Company of India (AIC) & Empanelled Insurers',
    crops: ['Rice', 'Wheat', 'Maize', 'Sorghum', 'Cotton', 'Sugarcane', 'Soybean', 'Groundnut', 'Tur', 'Moong', 'Gram', 'Mustard', 'Onion', 'Potato', 'Chilli'],
    seasons: ['Kharif', 'Rabi'],
    premiumRate: 'Kharif: 2% | Rabi: 1.5% | Commercial/Horticulture: 5% of sum insured',
    sumInsuredPerAcre: 40000,
    features: [
      'Government of India flagship crop insurance scheme',
      'Covers all food & oilseed crops + annual commercial/horticulture crops',
      'Protection against drought, flood, hailstorm, landslide, cyclone',
      'Post-harvest losses covered (up to 14 days from harvesting)',
      'Prevented sowing cover (if unable to sow due to adverse weather)',
      'On-account payment for mid-season calamities',
      'Use of technology: satellite imagery, drones, weather stations',
      'Claim amount directly credited to bank account (DBT)',
      'No upper limit on government subsidy',
      'Mandatory for loanee farmers; voluntary for non-loanee',
    ],
    govtSubsidy: true,
    rating: 4.3,
    irdaiRegNo: 'IRDA/NL202/GI/2012-13 (AIC)',
  },
  {
    id: 'crop-002',
    name: 'Weather Based Crop Insurance Scheme (WBCIS)',
    insurer: 'Agriculture Insurance Company of India (AIC)',
    crops: ['Rice', 'Wheat', 'Maize', 'Cotton', 'Soybean', 'Groundnut', 'Mustard', 'Gram', 'Tur', 'Sugarcane', 'Coffee', 'Tea', 'Rubber', 'Cardamom'],
    seasons: ['Kharif', 'Rabi'],
    premiumRate: 'Same as PMFBY: Kharif 2% | Rabi 1.5% | Commercial 5%',
    sumInsuredPerAcre: 35000,
    features: [
      'Payout based on weather index (rainfall, temperature, humidity, wind speed)',
      'No need for individual crop loss assessment',
      'Faster claim settlement (weather data triggers payout automatically)',
      'Covers deficit/excess rainfall, unseasonal rain, high temperature, frost',
      'Automatic weather stations (AWS) & rain gauges used',
      'Available for both loanee & non-loanee farmers',
      'Government premium subsidy applicable',
      'Ideal for regions with reliable weather data infrastructure',
    ],
    govtSubsidy: true,
    rating: 4.0,
    irdaiRegNo: 'IRDA/NL202/GI/2012-13 (AIC)',
  },
  {
    id: 'crop-003',
    name: 'Pradhan Mantri Fasal Bima – Revenue Insurance',
    insurer: 'ICICI Lombard General Insurance Co. Ltd. (Implementing Insurer)',
    crops: ['Rice', 'Wheat', 'Cotton', 'Soybean', 'Maize'],
    seasons: ['Kharif', 'Rabi'],
    premiumRate: '3% of sum insured (farmer share)',
    sumInsuredPerAcre: 50000,
    features: [
      'Revenue-based crop insurance pilot scheme',
      'Protects against both yield loss & price fall',
      'Covers decline in farm revenue due to production or market price drop',
      'MSP-linked guarantee for notified crops',
      'State government & central government co-fund premium subsidy',
      'District-level revenue data used for claim calculation',
      'Supports farmers during market crashes & natural calamities',
      'Digital enrollment via PMFBY portal',
    ],
    govtSubsidy: true,
    rating: 3.9,
    irdaiRegNo: 'IRDA/NL331/GI/2015-16',
  },
  {
    id: 'crop-004',
    name: 'Parametric Crop Insurance (Private)',
    insurer: 'Tata AIG General Insurance Co. Ltd.',
    crops: ['Coffee', 'Tea', 'Rubber', 'Cardamom', 'Spices', 'Fruits (Mango, Banana, Grapes)'],
    seasons: ['Kharif', 'Rabi'],
    premiumRate: '5-8% of sum insured (varies by crop & region)',
    sumInsuredPerAcre: 60000,
    features: [
      'Parametric/index-based trigger mechanism',
      'Payout triggered automatically on weather threshold breach',
      'No individual loss assessment required',
      'Covers excessive rainfall, drought, temperature extremes, hailstorm',
      'Designed for high-value horticulture & plantation crops',
      'Quick payout within 15 days of trigger event',
      'Satellite & drone-based monitoring',
      'Customizable for specific crop & region risks',
    ],
    govtSubsidy: false,
    rating: 4.1,
    irdaiRegNo: 'IRDA/NL584/GI/2018-19',
  },
];
