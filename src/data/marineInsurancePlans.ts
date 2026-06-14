// ============================================================================
// Paliwal Secure - Marine Insurance Plans Data
// IRDAI-Compliant | Source: Indian Marine Insurance Market 2024-25
// Samundar mein bhi suraksha — cargo ki complete protection
// ============================================================================

export interface MarineInsuranceProduct {
  id: string;
  name: string;
  insurer: string;
  cargoType: string;
  voyageType: string;
  sumInsured: number;
  premiumRate: string;
  features: string[];
  exclusions: string[];
  rating: number;
  irdaiRegNo: string;
}

export const marineInsurancePlans: MarineInsuranceProduct[] = [
  {
    id: 'marine-001',
    name: 'New India Assurance Marine Cargo Policy',
    insurer: 'The New India Assurance Co. Ltd.',
    cargoType: 'General Merchandise, Machinery, Consumer Goods, Chemicals',
    voyageType: 'Import / Export / Coastal',
    sumInsured: 50000000,
    premiumRate: '0.15% – 0.45% of CIF value (varies by cargo & route)',
    features: [
      'India\'s largest PSU marine insurer',
      'Institute Cargo Clauses (A) – All Risk cover',
      'Institute Cargo Clauses (B) – Named perils cover',
      'Institute Cargo Clauses (C) – Basic cover',
      'Warehouse-to-warehouse coverage',
      'Transshipment & deviation covered',
      'General Average contribution covered',
      'Sue & Labour charges reimbursed',
      'Open policy for regular shipments',
      'Specific voyage policy available',
      'Claims settled in INR or foreign currency',
    ],
    exclusions: [
      'Willful misconduct of the insured',
      'Ordinary leakage/breakage or inherent vice',
      'Insufficiency/unsuitability of packing',
      'Delay (even due to insured peril)',
      'Insolvency/financial default of carriers',
      'War & SRCC (unless extension purchased)',
      'Nuclear/atomic weapons risks',
    ],
    rating: 4.4,
    irdaiRegNo: 'IRDA/NL190/GI/2012-13',
  },
  {
    id: 'marine-002',
    name: 'ICICI Lombard Marine Transit Insurance',
    insurer: 'ICICI Lombard General Insurance Co. Ltd.',
    cargoType: 'Electronics, Auto Parts, Textiles, Pharmaceuticals, Perishables',
    voyageType: 'Import / Export / Coastal',
    sumInsured: 30000000,
    premiumRate: '0.20% – 0.50% of invoice value (risk-based)',
    features: [
      'Comprehensive marine cargo protection',
      'Door-to-door transit cover',
      'Institute Cargo Clauses (A, B, C) options',
      'Cold chain & perishable cargo specialist cover',
      'Project cargo insurance for heavy machinery',
      'Annual open policy for regular shippers',
      'Digital policy issuance & endorsement',
      'Quick claim settlement process',
      'Surveyor network across all major ports',
      'Add-on: War & SRCC cover',
    ],
    exclusions: [
      'Loss/damage due to inherent vice',
      'Improper packing or stowage',
      'Willful misconduct',
      'Delay-related losses',
      'Carrier insolvency',
      'War perils (unless extension opted)',
      'Radioactive contamination',
    ],
    rating: 4.3,
    irdaiRegNo: 'IRDA/NL331/GI/2015-16',
  },
  {
    id: 'marine-003',
    name: 'Tata AIG Marine Cargo Insurance',
    insurer: 'Tata AIG General Insurance Co. Ltd.',
    cargoType: 'Engineering Goods, Steel, Chemicals, Food Grains, Project Cargo',
    voyageType: 'Import / Export / Coastal',
    sumInsured: 75000000,
    premiumRate: '0.12% – 0.40% of CIF/invoice value',
    features: [
      'Wide range of cargo coverage',
      'Institute Cargo Clauses (A) – All Risks',
      'Domestic transit insurance (inland)',
      'Erection all risk for project shipments',
      'Storage risk extension at destination',
      'Customs duty cover add-on',
      'Import/export by sea, air, road & rail',
      'Tata AIG global network for claims assistance',
      'Risk engineering & loss prevention advisory',
      'Online policy management portal',
    ],
    exclusions: [
      'Inherent vice & ordinary wear/tear',
      'Loss from insufficient packing',
      'Willful misconduct of insured',
      'Consequential loss from delay',
      'War & nuclear perils (standard exclusion)',
      'Rejection by customs/authorities',
    ],
    rating: 4.5,
    irdaiRegNo: 'IRDA/NL584/GI/2018-19',
  },
  {
    id: 'marine-004',
    name: 'Bajaj Allianz Marine Insurance',
    insurer: 'Bajaj Allianz General Insurance Co. Ltd.',
    cargoType: 'Consumer Durables, FMCG, Auto Components, Bulk Commodities',
    voyageType: 'Import / Export / Coastal',
    sumInsured: 25000000,
    premiumRate: '0.18% – 0.55% of declared value',
    features: [
      'Marine cargo & hull insurance',
      'Institute Cargo Clauses (A/B/C)',
      'Inland transit cover (rail/road)',
      'Open cover for recurring shipments',
      'Buyer\'s interest / Seller\'s interest policies',
      'Stock throughput policy for warehouses',
      'Temperature-controlled cargo cover',
      'Demurrage & detention cover (optional)',
      'Cashless claim settlement at select ports',
      'Dedicated marine claims team',
    ],
    exclusions: [
      'Inherent defect in goods',
      'Ordinary loss from natural shrinkage/evaporation',
      'Delay consequences',
      'Insufficiency of packing',
      'Willful misconduct',
      'War, SRCC & nuclear perils (standard)',
    ],
    rating: 4.2,
    irdaiRegNo: 'IRDA/NL495/GI/2017-18',
  },
  {
    id: 'marine-005',
    name: 'HDFC ERGO Marine Cargo Policy',
    insurer: 'HDFC ERGO General Insurance Co. Ltd.',
    cargoType: 'IT Equipment, Pharmaceuticals, Textiles, Agricultural Produce, Metals',
    voyageType: 'Import / Export / Coastal',
    sumInsured: 40000000,
    premiumRate: '0.15% – 0.48% of CIF value',
    features: [
      'Comprehensive marine cargo solutions',
      'All Risk & named perils options',
      'Sea, air, road & rail transit covered',
      'Annual open policy for businesses',
      'Cold chain & pharma logistics cover',
      'E-commerce shipment insurance',
      'Domestic goods in transit insurance',
      'Warehouse storage extension',
      'General Average & salvage charges covered',
      'HDFC ERGO InstaSpect digital survey',
    ],
    exclusions: [
      'Loss due to inherent vice',
      'Delay-related consequential losses',
      'Willful misconduct or negligence',
      'Unsuitable/inadequate packing',
      'Carrier insolvency',
      'War, nuclear & SRCC perils (unless extension)',
    ],
    rating: 4.2,
    irdaiRegNo: 'IRDA/NL264/GI/2014-15',
  },
];
