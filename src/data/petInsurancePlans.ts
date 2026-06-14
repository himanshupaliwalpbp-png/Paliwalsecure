// ============================================================================
// Paliwal Secure - Pet Insurance Plans Data
// IRDAI-Compliant | Source: Indian Pet Insurance Market 2024-25
// Apne furry dost ki suraksha — kyunki pet bhi parivaar hai
// ============================================================================

export interface PetInsuranceProduct {
  id: string;
  name: string;
  insurer: string;
  petTypes: string[];
  ageLimit: string;
  sumInsured: number;
  premiumMonthly: number;
  features: string[];
  exclusions: string[];
  vetNetwork: string;
  rating: number;
  irdaiRegNo: string;
}

export const petInsurancePlans: PetInsuranceProduct[] = [
  {
    id: 'pet-001',
    name: 'Future Generali Pet Suraksha',
    insurer: 'Future Generali India Insurance Co. Ltd.',
    petTypes: ['Dogs', 'Cats'],
    ageLimit: '3 months – 10 years',
    sumInsured: 30000,
    premiumMonthly: 450,
    features: [
      'Hospitalization & surgical cover for pets',
      'Accidental injury treatment',
      'Illness & disease coverage',
      'Third-party liability up to ₹1L',
      'Vaccination reimbursement (partial)',
      'OPD consultations covered',
      'Death due to accident/illness cover',
      'Burial/cremation expenses reimbursement',
    ],
    exclusions: [
      'Pre-existing conditions',
      'Cosmetic & elective procedures (tail docking, ear cropping)',
      'Breeding & pregnancy-related expenses',
      'Dental cleaning & routine check-ups',
      'Parasite prevention (tick/flea medication)',
      'Behavioral training costs',
    ],
    vetNetwork: '2,500+ empaneled veterinary clinics across India',
    rating: 4.2,
    irdaiRegNo: 'IRDA/NL322/GI/2015-16',
  },
  {
    id: 'pet-002',
    name: 'Bajaj Allianz Pet Insurance',
    insurer: 'Bajaj Allianz General Insurance Co. Ltd.',
    petTypes: ['Dogs'],
    ageLimit: '6 months – 8 years',
    sumInsured: 40000,
    premiumMonthly: 550,
    features: [
      'Comprehensive dog health cover',
      'Accidental death & disability cover',
      'Hospitalization expenses for illness',
      'Surgical procedure reimbursement',
      'Third-party legal liability',
      'Emergency vet consultations',
      'Microchipping cost reimbursement',
      'Sum insured restoration (once per year)',
    ],
    exclusions: [
      'Pre-existing diseases',
      'Routine vaccination & deworming',
      'Breeding & whelping costs',
      'Cosmetic procedures',
      'Aggression-related injuries to others (without liability add-on)',
      'Pet shows & competition expenses',
    ],
    vetNetwork: '1,800+ network veterinary hospitals & clinics',
    rating: 4.1,
    irdaiRegNo: 'IRDA/NL495/GI/2017-18',
  },
  {
    id: 'pet-003',
    name: 'Digit Pet Insurance',
    insurer: 'Go Digit General Insurance Ltd.',
    petTypes: ['Dogs', 'Cats'],
    ageLimit: '3 months – 10 years',
    sumInsured: 25000,
    premiumMonthly: 350,
    features: [
      'Digital-first pet insurance',
      'Quick online claim via app',
      'Accidental injury & illness cover',
      'Surgery & hospitalization expenses',
      'Third-party liability cover',
      'Vaccination benefit (select plans)',
      'No physical documents needed',
      'Cashless treatment at network vets',
    ],
    exclusions: [
      'Pre-existing conditions',
      'Routine grooming & dental',
      'Pregnancy & birth-related expenses',
      'Elective/cosmetic surgeries',
      'Pet behavioral issues',
      'Loss due to war/nuclear events',
    ],
    vetNetwork: '1,200+ veterinary clinics pan-India',
    rating: 4.3,
    irdaiRegNo: 'IRDA/NL699/GI/2021-22',
  },
  {
    id: 'pet-004',
    name: 'Pawtect Pet Care Plus',
    insurer: 'Pawtect Insurance (Underwritten by New India Assurance)',
    petTypes: ['Dogs', 'Cats'],
    ageLimit: '8 weeks – 12 years',
    sumInsured: 50000,
    premiumMonthly: 700,
    features: [
      'Premium pet health cover up to ₹50K',
      'Accident & emergency treatment',
      'Chronic illness management (after waiting)',
      'Cancer treatment cover',
      'Specialist vet consultations',
      'Diagnostic tests & imaging covered',
      'Prescription diet reimbursement (partial)',
      'Online vet consultation included',
      'Pet lost & found assistance',
    ],
    exclusions: [
      'Pre-existing conditions (lifetime exclusion)',
      'Routine wellness & preventive care',
      'Breeding, pregnancy & neonatal care',
      'Cosmetic & elective surgeries',
      'Experimental or alternative treatments',
      'Injury from organized fighting/racing',
    ],
    vetNetwork: '3,000+ partner veterinary clinics & specialty hospitals',
    rating: 4.4,
    irdaiRegNo: 'IRDA/NL190/GI/2012-13',
  },
];
