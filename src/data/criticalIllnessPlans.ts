// ============================================================================
// Paliwal Secure - Critical Illness Plans Data
// ============================================================================

export interface CriticalIllnessPlan {
  id: string;
  name: string;
  insurer: string;
  coverAmount: string;
  illnesses: string[];
  waitingPeriod: string;
  survivalPeriod: string;
  premium: number;
  payoutType: string;
  rating: number;
}

export const criticalIllnessPlans: CriticalIllnessPlan[] = [
  {
    id: 'ci-001',
    name: 'HDFC Life Critical Illness Plus',
    insurer: 'HDFC Life Insurance',
    coverAmount: '5L - 1Cr',
    illnesses: ['Cancer', 'Heart Attack', 'Stroke', 'Kidney Failure', 'Organ Transplant', 'Paralysis', 'Multiple Sclerosis', 'Major Burns'],
    waitingPeriod: '90 days',
    survivalPeriod: '30 days',
    premium: 3500,
    payoutType: 'Lump Sum',
    rating: 4.6,
  },
  {
    id: 'ci-002',
    name: 'Max Life Critical Illness Rider',
    insurer: 'Max Life Insurance',
    coverAmount: '5L - 50L',
    illnesses: ['Cancer', 'Heart Attack', 'Stroke', 'Kidney Failure', 'Organ Transplant', 'Coronary Artery Surgery'],
    waitingPeriod: '90 days',
    survivalPeriod: '30 days',
    premium: 2800,
    payoutType: 'Lump Sum',
    rating: 4.5,
  },
  {
    id: 'ci-003',
    name: 'ICICI Pru Heart/Cancer Protect',
    insurer: 'ICICI Prudential Life Insurance',
    coverAmount: '5L - 50L',
    illnesses: ['Cancer', 'Heart Attack', 'Stroke', 'Coronary Artery Bypass Surgery'],
    waitingPeriod: '90 days',
    survivalPeriod: '30 days',
    premium: 2500,
    payoutType: 'Lump Sum',
    rating: 4.4,
  },
  {
    id: 'ci-004',
    name: 'Star Health Critical Illness',
    insurer: 'Star Health & Allied Insurance',
    coverAmount: '3L - 25L',
    illnesses: ['Cancer', 'Heart Attack', 'Stroke', 'Kidney Failure', 'Organ Transplant', 'Paralysis', 'Major Burns', 'Aorta Surgery', 'Benign Brain Tumor'],
    waitingPeriod: '90 days',
    survivalPeriod: '30 days',
    premium: 3200,
    payoutType: 'Lump Sum',
    rating: 4.2,
  },
  {
    id: 'ci-005',
    name: 'Care Health Critical Illness',
    insurer: 'Care Health Insurance',
    coverAmount: '5L - 1Cr',
    illnesses: ['Cancer', 'Heart Attack', 'Stroke', 'Kidney Failure', 'Organ Transplant', 'Paralysis', 'Multiple Sclerosis', 'Major Burns', 'Coma'],
    waitingPeriod: '90 days',
    survivalPeriod: '30 days',
    premium: 3000,
    payoutType: 'Lump Sum',
    rating: 4.3,
  },
  {
    id: 'ci-006',
    name: 'Bajaj Allianz Critical Illness',
    insurer: 'Bajaj Allianz General Insurance',
    coverAmount: '5L - 50L',
    illnesses: ['Cancer', 'Heart Attack', 'Stroke', 'Kidney Failure', 'Organ Transplant', 'Paralysis'],
    waitingPeriod: '90 days',
    survivalPeriod: '30 days',
    premium: 2700,
    payoutType: 'Lump Sum',
    rating: 4.4,
  },
];
