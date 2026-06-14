// ============================================================================
// Paliwal Secure - Term Insurance Riders Data
// ============================================================================

export interface TermRider {
  id: string;
  name: string;
  description: string;
  avgCostIncrease: string;
  bestFor: string;
}

export const termRiders: TermRider[] = [
  {
    id: 'tr-001',
    name: 'Critical Illness Rider',
    description: 'Provides lump sum payout on diagnosis of listed critical illnesses like cancer, heart attack, stroke, kidney failure etc. Waives future premiums.',
    avgCostIncrease: '₹2,000 - ₹5,000/year',
    bestFor: 'People with family history of critical illnesses, smokers, or high-stress lifestyles',
  },
  {
    id: 'tr-002',
    name: 'Accidental Death Benefit Rider',
    description: 'Pays additional sum assured in case of death due to accident. Some plans also cover permanent disability from accidents.',
    avgCostIncrease: '₹500 - ₹1,500/year',
    bestFor: 'People with high-risk occupations, frequent travelers, or those seeking extra accidental coverage',
  },
  {
    id: 'tr-003',
    name: 'Waiver of Premium Rider',
    description: 'Waives all future premiums if the policyholder is diagnosed with a critical illness or becomes totally disabled.',
    avgCostIncrease: '₹800 - ₹2,000/year',
    bestFor: 'Sole earners and people who want their policy to continue even if they cannot pay premiums',
  },
  {
    id: 'tr-004',
    name: 'Income Accelerator Rider',
    description: 'Increases the death benefit payout by a fixed percentage every year, keeping up with inflation.',
    avgCostIncrease: '₹1,000 - ₹3,000/year',
    bestFor: 'People who want their coverage to increase with inflation over the policy term',
  },
  {
    id: 'tr-005',
    name: 'Terminal Illness Rider',
    description: 'Provides early payout of sum assured if diagnosed with a terminal illness with limited life expectancy.',
    avgCostIncrease: '₹500 - ₹1,200/year',
    bestFor: 'Anyone wanting financial support during terminal illness for medical and personal expenses',
  },
  {
    id: 'tr-006',
    name: 'Disability Income Rider',
    description: 'Provides monthly income if the policyholder becomes totally and permanently disabled due to accident or illness.',
    avgCostIncrease: '₹1,500 - ₹3,500/year',
    bestFor: 'Working professionals whose income would be severely affected by disability',
  },
];
