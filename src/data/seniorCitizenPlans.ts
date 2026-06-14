// ============================================================================
// Paliwal Secure - Senior Citizen Health Insurance Plans Data
// IRDAI-Compliant | Source: IRDAI Annual Report 2025-26
// ============================================================================

export interface SeniorCitizenPlan {
  id: string;
  name: string;
  insurer: string;
  entryAge: string;
  csr: string;
  coPayment: string;
  sumInsuredRange: string;
  premium: number;
  keyFeatures: string[];
  waitingPeriodPED: string;
  rating: number;
}

export const seniorCitizenPlans: SeniorCitizenPlan[] = [
  {
    id: 'sc-001',
    name: 'Star Health Red Carpet',
    insurer: 'Star Health & Allied Insurance',
    entryAge: '60-80 years',
    csr: '99.81%',
    coPayment: '20%',
    sumInsuredRange: '1L - 25L',
    premium: 18000,
    keyFeatures: ['Dedicated senior citizen plan', 'No medical test up to 65 years', 'Day care procedures', 'Domiciliary treatment'],
    waitingPeriodPED: '48 months',
    rating: 4.2,
  },
  {
    id: 'sc-002',
    name: 'Care Health Senior Advantage',
    insurer: 'Care Health Insurance',
    entryAge: '60-80 years',
    csr: '99.95%',
    coPayment: '20%',
    sumInsuredRange: '3L - 25L',
    premium: 22000,
    keyFeatures: ['Senior Advantage plan', 'Health checkup included', 'AYUSH treatment', 'Domiciliary hospitalization'],
    waitingPeriodPED: '36 months',
    rating: 4.4,
  },
  {
    id: 'sc-003',
    name: 'New India Assurance Senior',
    insurer: 'The New India Assurance Co. Ltd.',
    entryAge: '60-80 years',
    csr: '87.00%',
    coPayment: '30%',
    sumInsuredRange: '1L - 10L',
    premium: 12000,
    keyFeatures: ['PSU insurer', 'Budget-friendly', 'Government-backed', 'Basic senior coverage'],
    waitingPeriodPED: '48 months',
    rating: 3.6,
  },
  {
    id: 'sc-004',
    name: 'Niva Bupa Senior First',
    insurer: 'Niva Bupa Health Insurance',
    entryAge: '60-75 years',
    csr: '100%',
    coPayment: '20%',
    sumInsuredRange: '5L - 25L',
    premium: 25000,
    keyFeatures: ['Senior First plan', 'Day 1 coverage for select conditions', 'Wellness benefits', 'Home healthcare'],
    waitingPeriodPED: '24 months',
    rating: 4.5,
  },
  {
    id: 'sc-005',
    name: 'Aditya Birla Senior Care',
    insurer: 'Aditya Birla Health Insurance',
    entryAge: '60-80 years',
    csr: '99.41%',
    coPayment: '20%',
    sumInsuredRange: '3L - 25L',
    premium: 20000,
    keyFeatures: ['Senior Care plan', 'Chronic management', 'HealthReturns reward', 'Activ Health benefits'],
    waitingPeriodPED: '24 months',
    rating: 4.3,
  },
  {
    id: 'sc-006',
    name: 'ICICI Lombard Senior Revive',
    insurer: 'ICICI Lombard General Insurance',
    entryAge: '60-80 years',
    csr: '98.45%',
    coPayment: '20%',
    sumInsuredRange: '3L - 25L',
    premium: 19000,
    keyFeatures: ['Senior Revive plan', 'Home healthcare', 'Telemedicine', 'Day care procedures'],
    waitingPeriodPED: '36 months',
    rating: 4.1,
  },
  {
    id: 'sc-007',
    name: 'HDFC ERGO Senior Citizen',
    insurer: 'HDFC ERGO General Insurance',
    entryAge: '60-75 years',
    csr: '99.16%',
    coPayment: '20%',
    sumInsuredRange: '5L - 25L',
    premium: 23000,
    keyFeatures: ['Senior Citizen plan', 'Restoration benefit', 'Annual health checkup', 'Domiciliary treatment'],
    waitingPeriodPED: '24 months',
    rating: 4.4,
  },
  {
    id: 'sc-008',
    name: 'Oriental Insurance Senior',
    insurer: 'The Oriental Insurance Co. Ltd.',
    entryAge: '60-80 years',
    csr: '86.00%',
    coPayment: '30%',
    sumInsuredRange: '1L - 10L',
    premium: 10000,
    keyFeatures: ['PSU insurer', 'Lowest premium', 'Government-backed', 'Basic coverage'],
    waitingPeriodPED: '48 months',
    rating: 3.5,
  },
];
