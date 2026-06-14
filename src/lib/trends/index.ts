// ============================================================================
// Paliwal Secure - Trend Detection Engine
// Detects trending insurance topics, scores them, and auto-tags them
// ============================================================================

export interface TrendTopicInput {
  title: string;
  slug: string;
  source?: string;
  sourceUrl?: string;
  category?: string;
  tags?: string[];
  priorityScore?: number;
  searchVolume?: number;
  isTrending?: boolean;
  expiresAt?: Date;
}

export interface ScoredTrend extends TrendTopicInput {
  priorityScore: number;
  tags: string[];
  category: string;
  isTrending: boolean;
}

// ── Tag Categories ──────────────────────────────────────────────────────────
const TAG_RULES: Array<{ tag: string; keywords: string[] }> = [
  { tag: 'motor', keywords: ['car', 'bike', 'vehicle', 'motor', 'tp', 'third-party', 'morth', 'idv', 'ncb', 'zero dep', 'comprehensive', 'od', 'own damage', 'gaadi'] },
  { tag: 'health', keywords: ['health', 'medical', 'hospital', 'cashless', 'disease', 'surgery', 'claim settlement', 'csr', 'waiting period', 'ped', 'pre-existing', 'sum insured', 'family floater'] },
  { tag: 'claim', keywords: ['claim', 'reimbursement', 'cashless', 'settlement', 'rejection', 'ombudsman', 'grievance', 'igms', 'discharge'] },
  { tag: 'regulation', keywords: ['irdai', 'regulation', 'rule', 'mandate', 'guideline', 'circular', 'compliance', 'morth', 'rbi', 'sebi', 'government', 'act'] },
  { tag: 'ev', keywords: ['ev', 'electric', 'battery', 'charging', 'tesla', 'tata nexon ev', 'mg comet', 'ev insurance', 'electric vehicle'] },
  { tag: 'tax', keywords: ['tax', 'gst', '80d', '80c', 'deduction', 'exemption', 'income tax', 'section', 'itr', ' rebate'] },
  { tag: 'life', keywords: ['life', 'term', 'endowment', 'ulip', 'pension', 'annuity', 'sum assured', 'maturity', 'rider', 'critical illness'] },
  { tag: 'senior', keywords: ['senior', 'elderly', 'citizen', 'pensioner', 'retirement', 'old age', '60+', 'super senior'] },
  { tag: 'digital', keywords: ['digital', 'app', 'online', 'insurtech', 'ai', 'chatbot', 'portal', 'platform', 'tech', 'digit'] },
  { tag: 'corporate', keywords: ['corporate', 'group', 'employer', 'employee', 'esic', 'wc', 'workmen', 'company', 'group health'] },
];

const CATEGORY_MAP: Record<string, string> = {
  motor: 'motor',
  health: 'health',
  life: 'life',
  ev: 'motor',
  tax: 'general',
  claim: 'claim',
  regulation: 'regulation',
  senior: 'health',
  digital: 'general',
  corporate: 'health',
};

// ── Static Trend Data (Indian Insurance 2025-26) ───────────────────────────
const STATIC_TRENDS: TrendTopicInput[] = [
  {
    title: 'GST Exemption on Health Insurance Premiums Expected September 2025',
    slug: 'gst-exemption-health-insurance-2025',
    source: 'manual',
    sourceUrl: 'https://www.irdai.gov.in',
    category: 'health',
    tags: ['tax', 'health', 'regulation'],
    searchVolume: 45000,
    isTrending: true,
    expiresAt: new Date('2025-12-31'),
  },
  {
    title: 'MoRTH Third-Party Motor Insurance Rate Revision 2025-26',
    slug: 'morth-tp-rate-revision-2025-26',
    source: 'manual',
    sourceUrl: 'https://morth.nic.in',
    category: 'motor',
    tags: ['motor', 'regulation'],
    searchVolume: 32000,
    isTrending: true,
    expiresAt: new Date('2026-03-31'),
  },
  {
    title: 'IRDAI Mandates 1-Hour Cashless Claim Approval and 3-Hour Discharge Timeline',
    slug: 'irdai-cashless-claim-timeline-mandate-2025',
    source: 'manual',
    sourceUrl: 'https://www.irdai.gov.in',
    category: 'health',
    tags: ['health', 'claim', 'regulation'],
    searchVolume: 55000,
    isTrending: true,
    expiresAt: new Date('2026-06-30'),
  },
  {
    title: 'Electric Vehicle Insurance Market Growing 40% Year-on-Year in India',
    slug: 'ev-insurance-growth-india-2025',
    source: 'manual',
    sourceUrl: 'https://www.irdai.gov.in',
    category: 'motor',
    tags: ['ev', 'motor'],
    searchVolume: 28000,
    isTrending: true,
    expiresAt: new Date('2026-03-31'),
  },
  {
    title: 'Senior Citizen Health Insurance: New IRDAI Guidelines for Entry Age and Renewal',
    slug: 'senior-citizen-health-insurance-irdai-2025',
    source: 'manual',
    sourceUrl: 'https://www.irdai.gov.in',
    category: 'health',
    tags: ['senior', 'health', 'regulation'],
    searchVolume: 38000,
    isTrending: true,
    expiresAt: new Date('2026-06-30'),
  },
  {
    title: 'Bima Bharosa Portal Launch: IRDAI Integrated Grievance Management System',
    slug: 'bima-bharosa-portal-launch-irdai-2025',
    source: 'manual',
    sourceUrl: 'https://bimabharosa.irdai.gov.in',
    category: 'regulation',
    tags: ['regulation', 'claim', 'digital'],
    searchVolume: 22000,
    isTrending: true,
    expiresAt: new Date('2025-12-31'),
  },
  {
    title: 'Insurance Portability Rules: How to Switch Your Health Insurer Without Losing Benefits',
    slug: 'insurance-portability-rules-india-2025',
    source: 'manual',
    sourceUrl: 'https://www.irdai.gov.in',
    category: 'health',
    tags: ['health', 'regulation'],
    searchVolume: 35000,
    isTrending: false,
  },
  {
    title: 'NCB Protection Add-Ons: Keep Your No Claim Bonus Even After a Claim',
    slug: 'ncb-protection-add-on-car-insurance-2025',
    source: 'manual',
    sourceUrl: 'https://www.irdai.gov.in',
    category: 'motor',
    tags: ['motor', 'claim'],
    searchVolume: 25000,
    isTrending: false,
  },
  {
    title: 'Corporate Health Insurance Trends 2025: Employers Enhancing Group Coverage Post-COVID',
    slug: 'corporate-health-insurance-trends-2025',
    source: 'manual',
    sourceUrl: 'https://www.irdai.gov.in',
    category: 'health',
    tags: ['corporate', 'health'],
    searchVolume: 18000,
    isTrending: false,
  },
  {
    title: 'Digital-First Insurers Growing 3x Faster Than Traditional Insurers in India',
    slug: 'digital-first-insurers-growth-india-2025',
    source: 'manual',
    sourceUrl: 'https://www.irdai.gov.in',
    category: 'general',
    tags: ['digital', 'regulation'],
    searchVolume: 20000,
    isTrending: false,
  },
  {
    title: 'IRDAI Removes Entry Age Cap for Health Insurance: No Upper Age Limit',
    slug: 'irdai-removes-health-insurance-entry-age-cap-2025',
    source: 'manual',
    sourceUrl: 'https://www.irdai.gov.in',
    category: 'health',
    tags: ['health', 'senior', 'regulation'],
    searchVolume: 42000,
    isTrending: true,
    expiresAt: new Date('2026-06-30'),
  },
  {
    title: 'Pay-as-You-Drive Motor Insurance: IRDAI Sandbox Approval for Usage-Based Premiums',
    slug: 'pay-as-you-drive-motor-insurance-irdai-2025',
    source: 'manual',
    sourceUrl: 'https://www.irdai.gov.in',
    category: 'motor',
    tags: ['motor', 'regulation', 'digital'],
    searchVolume: 15000,
    isTrending: false,
  },
  {
    title: 'Section 80D Tax Benefits 2025-26: New Limits and Health Insurance Deductions',
    slug: 'section-80d-tax-benefits-health-insurance-2025-26',
    source: 'manual',
    sourceUrl: 'https://www.incometax.gov.in',
    category: 'general',
    tags: ['tax', 'health'],
    searchVolume: 60000,
    isTrending: true,
    expiresAt: new Date('2026-03-31'),
  },
];

// ── tagTopic: Auto-tag a topic based on its title and content ──────────────
export function tagTopic(title: string, additionalText?: string): string[] {
  const textToAnalyze = `${title} ${additionalText || ''}`.toLowerCase();
  const matchedTags: string[] = [];

  for (const rule of TAG_RULES) {
    for (const keyword of rule.keywords) {
      if (textToAnalyze.includes(keyword.toLowerCase())) {
        if (!matchedTags.includes(rule.tag)) {
          matchedTags.push(rule.tag);
        }
        break; // One keyword match per tag is enough
      }
    }
  }

  // Default tag if none matched
  if (matchedTags.length === 0) {
    matchedTags.push('general');
  }

  return matchedTags;
}

// ── scoreTrend: Calculate priority score for a trend topic ─────────────────
export function scoreTrend(trend: TrendTopicInput): number {
  let score = 0;

  // Recency boost (newer = higher score)
  // Base score from search volume (normalized to 0-40)
  if (trend.searchVolume) {
    score += Math.min(40, Math.floor(trend.searchVolume / 1500));
  }

  // Trending flag bonus
  if (trend.isTrending) {
    score += 25;
  }

  // Category priority weights
  const categoryWeights: Record<string, number> = {
    health: 15,
    motor: 12,
    regulation: 10,
    claim: 8,
    life: 7,
    general: 5,
  };
  const category = trend.category || 'general';
  score += categoryWeights[category] || 5;

  // Tag bonuses (certain tags are more newsworthy)
  const tagBonuses: Record<string, number> = {
    regulation: 10,
    tax: 8,
    ev: 7,
    claim: 6,
    senior: 5,
    digital: 4,
  };
  const tags = trend.tags || tagTopic(trend.title);
  for (const tag of tags) {
    score += tagBonuses[tag] || 0;
  }

  // Expiry penalty (if topic is about to expire, boost it to write about it now)
  if (trend.expiresAt) {
    const daysUntilExpiry = Math.floor(
      (trend.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (daysUntilExpiry > 0 && daysUntilExpiry < 30) {
      score += 15; // Urgent — write about it now
    } else if (daysUntilExpiry > 0 && daysUntilExpiry < 90) {
      score += 8; // Still relevant
    }
  }

  return Math.min(100, score); // Cap at 100
}

// ── detectTrends: Main function to detect and return trending topics ───────
export function detectTrends(): ScoredTrend[] {
  const trends: ScoredTrend[] = STATIC_TRENDS.map((trend) => {
    const autoTags = tagTopic(trend.title);
    const mergedTags = Array.from(new Set([...(trend.tags || []), ...autoTags]));
    const category = trend.category || CATEGORY_MAP[mergedTags[0]] || 'general';
    const priorityScore = scoreTrend(trend);

    return {
      ...trend,
      tags: mergedTags,
      category,
      priorityScore,
      isTrending: trend.isTrending ?? priorityScore >= 60,
    };
  });

  // Sort by priority score descending
  trends.sort((a, b) => b.priorityScore - a.priorityScore);

  return trends;
}

// ── getTrendsForArticleGeneration: Get top trends that need articles ───────
export function getTrendsForArticleGeneration(limit: number = 5): ScoredTrend[] {
  const trends = detectTrends();
  return trends
    .filter((t) => t.priorityScore >= 50) // Only trends with sufficient priority
    .slice(0, limit);
}

// ── inferCategoryFromTags: Determine the best category from tags ──────────
export function inferCategoryFromTags(tags: string[]): string {
  for (const tag of tags) {
    if (CATEGORY_MAP[tag]) {
      return CATEGORY_MAP[tag];
    }
  }
  return 'general';
}
