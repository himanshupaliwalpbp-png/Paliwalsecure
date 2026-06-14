// ============================================================================
// Paliwal Secure - Health Insurance Riders Data
// ============================================================================

export interface HealthRider {
  id: string;
  name: string;
  category: string;
  description: string;
  avgCost: number;
  waitingPeriod: string;
  eligibleConditions: string[];
  bestFor: string;
}

export const healthRiders: HealthRider[] = [
  {
    id: 'hr-001',
    name: 'Critical Illness Rider',
    category: 'critical-illness',
    description: 'Lump sum payout on diagnosis of major illnesses like cancer, heart attack, stroke, kidney failure etc.',
    avgCost: 2500,
    waitingPeriod: '90 days',
    eligibleConditions: ['cancer', 'heart-attack', 'stroke', 'kidney-failure', 'organ-transplant'],
    bestFor: 'People with family history of critical illnesses or smokers',
  },
  {
    id: 'hr-002',
    name: 'Hospital Cash Rider',
    category: 'hospital-cash',
    description: 'Daily cash allowance for each day of hospitalization to cover non-medical expenses.',
    avgCost: 800,
    waitingPeriod: '30 days',
    eligibleConditions: ['any-hospitalization'],
    bestFor: 'People who want extra cash support during hospital stays',
  },
  {
    id: 'hr-003',
    name: 'Personal Accident Rider',
    category: 'personal-accident',
    description: 'Covers accidental death, permanent disability, and temporary disability with lump sum payout.',
    avgCost: 1200,
    waitingPeriod: 'None',
    eligibleConditions: ['accidental-injury', 'accidental-death', 'disability'],
    bestFor: 'People with high-risk jobs or frequent travelers',
  },
  {
    id: 'hr-004',
    name: 'Maternity Plus Rider',
    category: 'maternity',
    description: 'Covers maternity expenses including normal delivery, C-section, and newborn baby cover from Day 1.',
    avgCost: 3500,
    waitingPeriod: '9-36 months',
    eligibleConditions: ['maternity', 'delivery', 'newborn-care'],
    bestFor: 'Couples planning a family or expecting parents',
  },
  {
    id: 'hr-005',
    name: 'Consumables Cover',
    category: 'consumables',
    description: 'Covers cost of consumables like PPE kits, gloves, syringes, and other non-medical items during hospitalization.',
    avgCost: 600,
    waitingPeriod: '30 days',
    eligibleConditions: ['any-hospitalization'],
    bestFor: 'People who want complete coverage including consumables not covered by base plan',
  },
  {
    id: 'hr-006',
    name: 'Global Cover Rider',
    category: 'global-cover',
    description: 'Extends health insurance coverage to international hospitals for treatment abroad.',
    avgCost: 4000,
    waitingPeriod: '90 days',
    eligibleConditions: ['treatment-abroad', 'emergency-overseas'],
    bestFor: 'Frequent international travelers and NRIs',
  },
  {
    id: 'hr-007',
    name: 'OPD Cover Rider',
    category: 'opd',
    description: 'Covers outpatient department expenses including doctor consultations, diagnostic tests, and pharmacy bills.',
    avgCost: 1800,
    waitingPeriod: '30 days',
    eligibleConditions: ['opd-consultation', 'diagnostic-tests', 'pharmacy'],
    bestFor: 'People with frequent doctor visits or chronic conditions needing regular consultation',
  },
  {
    id: 'hr-008',
    name: 'Room Rent Upgrade Rider',
    category: 'room-upgrade',
    description: 'Upgrades room rent limit to deluxe or suite room during hospitalization.',
    avgCost: 900,
    waitingPeriod: '30 days',
    eligibleConditions: ['any-hospitalization'],
    bestFor: 'People who prefer premium hospital rooms',
  },
];
