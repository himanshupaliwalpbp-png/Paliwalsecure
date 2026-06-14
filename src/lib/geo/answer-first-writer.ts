// ============================================================================
// Paliwal Secure — Answer-First Writer (GEO/AI Search Optimization)
// Transforms content into answer-first format optimized for AI Overviews,
// Google SGE, ChatGPT, Perplexity, and other AI search engines.
// ============================================================================

/**
 * Answer-First Format Pattern:
 * 1. First 40-60 words: Complete, standalone answer
 * 2. Key metrics (prices, percentages, timelines) in the first paragraph
 * 3. Supporting details follow
 * 4. Pattern: "The best X costs ₹Y/month and covers Z. [Supporting details...]"
 */

export interface AnswerFirstInput {
  topic: string;
  answer: string;
  metrics?: AnswerMetric[];
  supportingDetails?: string[];
  cta?: string;
}

export interface AnswerMetric {
  label: string;
  value: string;
  unit?: string;
}

export interface AnswerFirstOutput {
  answerFirstParagraph: string;
  fullContent: string;
  wordCount: number;
  metricsIncluded: number;
}

/**
 * Builds an answer-first paragraph (40-60 words) with key metrics.
 */
export function buildAnswerFirstParagraph(input: AnswerFirstInput): string {
  let paragraph = input.answer;

  // Append metrics inline if provided
  if (input.metrics && input.metrics.length > 0) {
    const metricStrings = input.metrics.map(m => {
      return m.unit ? `${m.label}: ${m.value}${m.unit}` : `${m.label}: ${m.value}`;
    });

    // Integrate metrics naturally into the answer
    if (!paragraph.includes(input.metrics[0].value)) {
      paragraph += ` Key metrics: ${metricStrings.join(', ')}.`;
    }
  }

  return paragraph;
}

/**
 * Transforms content into answer-first format for AI search optimization.
 */
export function transformToAnswerFirst(input: AnswerFirstInput): AnswerFirstOutput {
  const answerFirstParagraph = buildAnswerFirstParagraph(input);

  let fullContent = answerFirstParagraph;

  if (input.supportingDetails && input.supportingDetails.length > 0) {
    fullContent += '\n\n' + input.supportingDetails.join('\n\n');
  }

  if (input.cta) {
    fullContent += `\n\n${input.cta}`;
  }

  const wordCount = fullContent.split(/\s+/).filter(Boolean).length;

  return {
    answerFirstParagraph,
    fullContent,
    wordCount,
    metricsIncluded: input.metrics?.length ?? 0,
  };
}

/**
 * Pre-built answer-first templates for common insurance queries.
 * These are designed to be extracted by AI engines as standalone answers.
 */
export const ANSWER_FIRST_TEMPLATES: Record<string, AnswerFirstInput> = {
  'health-insurance-cost': {
    topic: 'Health Insurance Cost in India',
    answer: 'The average health insurance premium in India costs ₹6,000–₹10,000/year for ₹10 lakh cover at age 30. Premiums increase with age: ₹24,000 at 45 and ₹60,000 at 60. Family floaters cost 30% more than individual plans.',
    metrics: [
      { label: 'Average premium (age 30, ₹10L)', value: '₹6,000', unit: '/year' },
      { label: 'At age 45', value: '₹24,000', unit: '/year' },
      { label: 'At age 60', value: '₹60,000', unit: '/year' },
      { label: 'Family floater extra', value: '30%', unit: '' },
    ],
    supportingDetails: [
      'IRDAI mandates lifelong renewability — insurers cannot refuse renewal based on age or claims.',
      'Section 80D provides tax deduction up to ₹25,000 (₹50,000 for senior citizens) on health insurance premiums.',
      'Loading factors: Diabetes +30%, Hypertension +15%, Heart condition +50%, Smoking +25%.',
      'Metro cities (Mumbai, Delhi, Bengaluru) have 15% higher premiums due to healthcare costs.',
    ],
    cta: 'Compare health insurance plans at PaliwalSecure.in or WhatsApp +91 9257877312 for personalized advice.',
  },
  'car-insurance-cost': {
    topic: 'Car Insurance Cost in India',
    answer: 'Car insurance in India costs ₹3,416–₹7,890/year for third-party (IRDAI fixed rates) and ₹15,000–₹45,000 for comprehensive cover. Zero depreciation adds 15-20% to comprehensive premium. The best value plan covers own damage + TP + zero dep.',
    metrics: [
      { label: 'TP rate (under 1000cc)', value: '₹2,861', unit: '/year' },
      { label: 'TP rate (1000-1500cc)', value: '₹3,416', unit: '/year' },
      { label: 'TP rate (above 1500cc)', value: '₹7,890', unit: '/year' },
      { label: 'EV discount on TP', value: '15%', unit: '' },
    ],
    supportingDetails: [
      'IDV depreciates 5% in year 1, 10% in year 2, up to 50% after 5 years.',
      'NCB ranges from 20% (1 claim-free year) to 50% (5+ claim-free years).',
      'Key add-ons: Zero Depreciation, Engine Protect, Roadside Assistance, Return to Invoice.',
      'IRDAI mandates 3-year TP for new cars and 5-year TP for new two-wheelers.',
    ],
    cta: 'Get instant car insurance quotes at PaliwalSecure.in or WhatsApp +91 9257877312.',
  },
  'term-insurance-cost': {
    topic: 'Term Insurance Cost in India',
    answer: 'Term insurance in India costs ₹15,951–₹24,660/year for ₹1 crore cover till age 65 (age 25-30). Women get 10% discount. Smokers pay 25-50% more. The average claim settlement ratio is 98%+ for top insurers.',
    metrics: [
      { label: '₹1 Cr cover at 25', value: '₹15,951', unit: '/year' },
      { label: '₹1 Cr cover at 30', value: '₹19,093', unit: '/year' },
      { label: '₹1 Cr cover at 40', value: '₹28,806', unit: '/year' },
      { label: 'Women discount', value: '10%', unit: '' },
    ],
    supportingDetails: [
      'Section 80C provides tax deduction up to ₹1.5 lakh on term insurance premiums.',
      'Critical illness rider adds ₹2,000-₹5,000/year but covers 30+ diseases.',
      'Claim settlement ratio: LIC 98.6%, HDFC Life 99.3%, SBI Life 97.8%.',
      'Free-look period: 15-30 days to return policy if unsatisfied.',
    ],
    cta: 'Compare term plans at PaliwalSecure.in or WhatsApp +91 9257877312.',
  },
  'claim-settlement': {
    topic: 'Insurance Claim Settlement in India',
    answer: 'Cashless health insurance claims are approved in 1-2 hours at network hospitals under IRDAI mandate. Reimbursement claims take 15-30 days. The average health insurance CSR is 87-100% for top insurers. File within 15 days of discharge.',
    metrics: [
      { label: 'Cashless approval time', value: '1-2', unit: ' hours' },
      { label: 'Reimbursement timeline', value: '15-30', unit: ' days' },
      { label: 'Average CSR (top insurers)', value: '87-100', unit: '%' },
      { label: 'Filing deadline', value: '15', unit: ' days' },
    ],
    supportingDetails: [
      'IRDAI mandates 1-hour cashless approval and 3-hour discharge authorization.',
      'Documents needed: Policy copy, ID proof, hospital bills, discharge summary, medical reports.',
      'Top 5 claim rejection reasons: Non-disclosure of pre-existing conditions, waiting period violation, policy lapse, exclusion, incorrect documentation.',
      'Grievance redressal: First contact insurer, then IRDAI Bima Bharosa portal, then Insurance Ombudsman.',
    ],
    cta: 'Get claim assistance at PaliwalSecure.in or WhatsApp +91 9257877312.',
  },
  'ev-insurance': {
    topic: 'EV Insurance in India',
    answer: 'EV insurance in India costs 15% less for third-party premiums (IRDAI discount) but comprehensive cover is 10-20% higher due to battery replacement costs. Tata Nexon EV comprehensive costs ₹25,000-₹35,000/year. Battery protection add-on is essential.',
    metrics: [
      { label: 'TP discount for EVs', value: '15', unit: '%' },
      { label: 'Comprehensive premium (EV)', value: '10-20', unit: '% higher' },
      { label: 'Nexon EV comprehensive', value: '₹25,000-₹35,000', unit: '/year' },
      { label: 'Battery replacement cost', value: '₹3-6', unit: ' Lakh' },
    ],
    supportingDetails: [
      'IRDAI provides 15% discount on TP rates for all electric vehicles.',
      'Key EV-specific add-ons: Battery Protect, Charging Cable Cover, Charging Station Liability.',
      'EV insurance covers battery degradation only with specific add-ons, not in base policy.',
      'Ola S1 Pro TP rate: ₹1,015/year vs ₹1,194 for petrol scooter equivalent.',
    ],
    cta: 'Compare EV insurance at PaliwalSecure.in or WhatsApp +91 9257877312.',
  },
};

/**
 * Gets a pre-built answer-first template by key.
 */
export function getAnswerFirstTemplate(key: string): AnswerFirstInput | undefined {
  return ANSWER_FIRST_TEMPLATES[key];
}

/**
 * Generates answer-first content for a given topic with metrics.
 * Useful for programmatic SEO pages.
 */
export function generateAnswerFirstContent(
  topic: string,
  baseAnswer: string,
  metrics: AnswerMetric[],
  details: string[],
): AnswerFirstOutput {
  return transformToAnswerFirst({
    topic,
    answer: baseAnswer,
    metrics,
    supportingDetails: details,
  });
}
