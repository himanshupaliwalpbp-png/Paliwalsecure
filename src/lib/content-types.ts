// ============================================================================
// Enterprise Content Engine — TypeScript Interfaces
// Paliwal Secure AI / InsureGPT
// ============================================================================

/** Hub configuration for content hubs */
export interface HubConfig {
  id: string;
  name: string;
  hindiName: string;
  description: string;
  hindiDescription: string;
  icon: string;
  color: string;
  slug: string;
  gradient: string;
}

/** Comparison table row */
export interface ComparisonRow {
  feature: string;
  col1: string;
  col2: string;
  highlight?: 'col1' | 'col2';
}

/** FAQ item */
export interface FAQItem {
  question: string;
  answer: string;
  hindiQuestion?: string;
  hindiAnswer?: string;
}

/** Full article content model for enterprise content engine */
export interface ArticleContent {
  // ── SEO Fields ──────────────────────────────────────────────────────────
  slug: string;
  seoTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogTitle: string;
  keywords: string[];

  // ── Content Fields ──────────────────────────────────────────────────────
  h1: string;
  quickAnswer: string;
  tldrSummary: string[];
  definition: string;
  insuranceImpact: string;
  benefits: string[];
  risks: string[];
  comparisonTable?: {
    title: string;
    col1Header: string;
    col2Header: string;
    rows: ComparisonRow[];
  };
  expertInsight: string;
  faqs: FAQItem[];
  conclusion: string;
  internalLinks: string[];
  schemaSuggestions: string[];
  relatedPosts: string[];

  // ── Classification ──────────────────────────────────────────────────────
  category: ArticleCategory;
  hub: ArticleHub;
  readTime: string;
  author: string;
  date: string;
  lastModified: string;

  // ── i18n ────────────────────────────────────────────────────────────────
  hindiTitle: string;
  hinglishTitle: string;
  hindiExcerpt: string;
  hinglishExcerpt: string;
}

export type ArticleCategory =
  | 'health'
  | 'motor'
  | 'claims'
  | 'vehicle-launch'
  | 'ev'
  | 'insurance-basics'
  | 'programmatic-seo';

export type ArticleHub =
  | 'health-hub'
  | 'motor-hub'
  | 'claims-hub'
  | 'vehicle-launch-hub'
  | 'news-hub'
  | 'glossary-hub'
  | 'faq-hub';

/** Lightweight article card data for listing pages */
export interface ArticleCard {
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  hub: ArticleHub;
  readTime: string;
  date: string;
  hindiTitle: string;
  hinglishTitle: string;
  keywords: string[];
}
