// ============================================================================
// Paliwal Secure - Travel Insurance Plans Data
// IRDAI-Compliant | Source: Indian Travel Insurance Market 2024-25
// Safar bhi safe, aur safar wala bhi — travel ki complete suraksha
// ============================================================================

export interface TravelInsuranceProduct {
  id: string;
  name: string;
  insurer: string;
  coverageDays: number;
  sumInsuredMedical: number;
  singleTripPremium: number;
  annualMultiTripPremium: number;
  features: string[];
  exclusions: string[];
  countries: string;
  rating: number;
  irdaiRegNo: string;
}

export const travelInsurancePlans: TravelInsuranceProduct[] = [
  {
    id: 'travel-001',
    name: 'Tata AIG Travel Guard',
    insurer: 'Tata AIG General Insurance Co. Ltd.',
    coverageDays: 30,
    sumInsuredMedical: 500000,
    singleTripPremium: 1200,
    annualMultiTripPremium: 8500,
    features: [
      'Medical emergency cover up to $5,00,000',
      'Trip cancellation & curtailment cover',
      'Baggage loss/delay compensation',
      'Passport loss assistance up to $500',
      'Flight delay cover (6+ hours)',
      'Emergency evacuation & repatriation',
      'Personal liability cover',
      'Adventure sports cover (optional add-on)',
      '24/7 global assistance helpline',
    ],
    exclusions: [
      'Pre-existing medical conditions (unless declared)',
      'War & nuclear risks',
      'Self-inflicted injuries',
      'Travel to restricted/high-risk countries',
      'Loss due to intoxication or substance abuse',
    ],
    countries: 'Worldwide (excluding USA/Canada) & Worldwide (including USA/Canada)',
    rating: 4.6,
    irdaiRegNo: 'IRDA/NL584/GI/2018-19',
  },
  {
    id: 'travel-002',
    name: 'Bajaj Allianz Travel Companion',
    insurer: 'Bajaj Allianz General Insurance Co. Ltd.',
    coverageDays: 30,
    sumInsuredMedical: 300000,
    singleTripPremium: 950,
    annualMultiTripPremium: 7200,
    features: [
      'Medical expenses cover up to $3,00,000',
      'Trip cancellation & interruption cover',
      'Baggage delay compensation (12+ hours)',
      'Emergency dental treatment',
      'Hijack distress allowance',
      'Home burglary cover during travel',
      'Personal accident cover',
      'Cashless hospitalization abroad',
      'Schengen visa compliant plans',
    ],
    exclusions: [
      'Pre-existing diseases (unless covered)',
      'Adventure sports without add-on',
      'Loss due to fraud or illegal acts',
      'Cosmetic treatment abroad',
      'Mental illness treatment',
    ],
    countries: 'Domestic / Asia / Schengen / Worldwide',
    rating: 4.4,
    irdaiRegNo: 'IRDA/NL495/GI/2017-18',
  },
  {
    id: 'travel-003',
    name: 'ICICI Lombard Travel Insurance',
    insurer: 'ICICI Lombard General Insurance Co. Ltd.',
    coverageDays: 30,
    sumInsuredMedical: 500000,
    singleTripPremium: 1100,
    annualMultiTripPremium: 7800,
    features: [
      'Medical emergency cover up to $5,00,000',
      'Deductible-free claim option',
      'Trip delay & cancellation cover',
      'Emergency cash advance',
      'Lost baggage & passport assistance',
      'Personal liability up to $2,00,000',
      'Compassionate visit cover',
      'Study interruption cover (students)',
      'Golfers equipment cover (optional)',
    ],
    exclusions: [
      'Pre-existing conditions (standard plans)',
      'Self-inflicted injury or suicide',
      'Nuclear/chemical/biological threats',
      'Racing & professional sports',
      'Treatment in India after return',
    ],
    countries: 'Asia / Schengen / Worldwide (incl. USA/Canada)',
    rating: 4.5,
    irdaiRegNo: 'IRDA/NL331/GI/2015-16',
  },
  {
    id: 'travel-004',
    name: 'HDFC ERGO Travel Optima',
    insurer: 'HDFC ERGO General Insurance Co. Ltd.',
    coverageDays: 30,
    sumInsuredMedical: 250000,
    singleTripPremium: 850,
    annualMultiTripPremium: 6500,
    features: [
      'Medical expenses cover up to $2,50,000',
      'Trip cancellation & delay cover',
      'Baggage loss compensation',
      'Emergency medical evacuation',
      'Personal accident cover up to ₹25L',
      'Home insurance during travel',
      'Automatic extension up to 7 days',
      'Schengen visa approved',
    ],
    exclusions: [
      'Pre-existing medical conditions',
      'War & terrorism losses',
      'Self-inflicted injuries',
      'Loss due to drug/alcohol use',
      'Treatment not medically necessary',
    ],
    countries: 'Domestic / Asia / Schengen / Worldwide',
    rating: 4.3,
    irdaiRegNo: 'IRDA/NL264/GI/2014-15',
  },
  {
    id: 'travel-005',
    name: 'Digit Travel Insurance',
    insurer: 'Go Digit General Insurance Ltd.',
    coverageDays: 30,
    sumInsuredMedical: 500000,
    singleTripPremium: 1050,
    annualMultiTripPremium: 7000,
    features: [
      'Smartphone-based claim process',
      'Medical cover up to $5,00,000',
      'Zero deduction on baggage claim',
      'Trip delay from 4 hours (not 6)',
      'Missed flight connection cover',
      'Adventure sports included (select plans)',
      'Covid-19 treatment covered',
      'Quick digital claim settlement',
    ],
    exclusions: [
      'Pre-existing diseases',
      'Losses from travelling against medical advice',
      'Nuclear/war perils',
      'Self-inflicted injuries',
      'Tour cancellation due to visa rejection',
    ],
    countries: 'Asia / Schengen / Worldwide (excl. USA) / Worldwide (incl. USA)',
    rating: 4.5,
    irdaiRegNo: 'IRDA/NL699/GI/2021-22',
  },
  {
    id: 'travel-006',
    name: 'Religare Travel Insurance',
    insurer: 'Religare Health Insurance Co. Ltd.',
    coverageDays: 30,
    sumInsuredMedical: 500000,
    singleTripPremium: 1300,
    annualMultiTripPremium: 9500,
    features: [
      'Medical cover up to $5,00,000',
      'Comprehensive hospitalization cover',
      'Pre-existing disease cover (life-threatening)',
      'Trip cancellation & interruption',
      'Baggage loss & delay cover',
      'Emergency medical evacuation',
      'Personal liability protection',
      'Daily allowance during hospitalization',
      'Cover for senior citizens up to 85 years',
    ],
    exclusions: [
      'Non-life-threatening pre-existing conditions',
      'Self-inflicted injuries',
      'War & nuclear risks',
      'Adventure sports (unless add-on purchased)',
      'Treatment unrelated to emergency',
    ],
    countries: 'Domestic / Asia / Schengen / Worldwide',
    rating: 4.3,
    irdaiRegNo: 'IRDA/NL616/GI/2019-20',
  },
];
