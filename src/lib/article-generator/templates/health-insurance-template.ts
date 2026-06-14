// ============================================================================
// Health Insurance Template — For health insurance articles
// ============================================================================

import type { ArticleContent, ArticleMetadata, ArticleFAQ, ArticleSection } from './base-template';
import { getDisclaimerSection, getAuthorBox, getCTA, getBaseInternalLinks, generateBaseSchema } from './base-template';
import type { ScoredTrend } from '@/lib/trends';

interface HealthTemplateInput {
  trend: ScoredTrend;
  llmContent: {
    summary: string;
    keyPoints: string[];
    coverage: string;
    premiumImpact: string;
    waitingPeriods: string;
    claimProcess: string;
    taxBenefits: string;
    tips: string;
    faqs: ArticleFAQ[];
    expertInsight: string;
  };
}

export function buildHealthArticle(input: HealthTemplateInput): ArticleContent {
  const { trend, llmContent } = input;

  const sections: ArticleSection[] = [
    {
      heading: 'Quick Overview',
      content: llmContent.summary,
    },
    {
      heading: 'Key Points Every Policyholder Should Know',
      content: llmContent.keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n'),
    },
    {
      heading: 'Coverage Details: What Is Covered and What Is Not',
      content: llmContent.coverage,
    },
    {
      heading: 'How This Affects Your Premium',
      content: llmContent.premiumImpact,
    },
    {
      heading: 'Waiting Periods You Should Be Aware Of',
      content: llmContent.waitingPeriods,
    },
    {
      heading: 'Cashless Claim Process: Step by Step',
      content: llmContent.claimProcess,
    },
    {
      heading: 'Tax Benefits Under Section 80D',
      content: llmContent.taxBenefits,
    },
    {
      heading: 'Practical Tips for Choosing the Right Plan',
      content: llmContent.tips,
    },
    getDisclaimerSection(),
    getAuthorBox(),
  ];

  return {
    title: trend.title,
    quickAnswer: llmContent.summary.slice(0, 200) + (llmContent.summary.length > 200 ? '...' : ''),
    sections,
    faqs: llmContent.faqs,
    expertInsight: llmContent.expertInsight,
    cta: getCTA(),
  };
}

export function buildHealthMetadata(trend: ScoredTrend, article: ArticleContent): ArticleMetadata {
  const keywords = [
    ...trend.tags,
    'health insurance',
    'medical insurance India',
    'cashless health insurance',
    'IRDAI health insurance',
    'health insurance claim',
    'Section 80D',
    trend.title.split(' ').filter((w) => w.length > 3).slice(0, 5),
  ].flat().filter(Boolean);

  return {
    metaDescription: article.quickAnswer.slice(0, 155),
    keywords: [...new Set(keywords)],
    ogTitle: trend.title,
    ogDescription: article.quickAnswer.slice(0, 155),
    schemaMarkup: generateBaseSchema(trend.title, trend.slug, trend.category, article.faqs),
    internalLinks: getBaseInternalLinks('health'),
  };
}

export function getHealthLLMPrompt(trend: ScoredTrend): string {
  return `You are an expert Indian health insurance content writer for Paliwal Secure (paliwalsecure.in), writing for an Indian audience. You must follow IRDAI compliance guidelines — never use words like "guaranteed", "best", "cheapest", "number one", or make absolute claims about any insurer.

Write a comprehensive health insurance article about the following trending topic:

**Topic:** ${trend.title}
**Category:** ${trend.category}
**Tags:** ${trend.tags.join(', ')}

You MUST respond with a valid JSON object (no markdown, no code fences) with exactly these fields:

{
  "summary": "A clear 3-4 sentence overview of the topic, written in simple Indian English with Hinglish words where natural",
  "keyPoints": ["Point 1 with specific ₹ amounts or percentages", "Point 2", "Point 3", "Point 4", "Point 5"],
  "coverage": "Explain what is covered and what is not covered under this topic. Be specific about inclusions and exclusions. Mention day-care procedures, pre/post hospitalization, ambulance charges, etc. where relevant.",
  "premiumImpact": "Explain how this affects health insurance premiums. Give specific ₹ ranges for different sum insured levels (₹5L, ₹10L, ₹25L). Include family floater vs individual estimates. Mention medical inflation of 14%.",
  "waitingPeriods": "Explain relevant waiting periods: initial (30 days), PED (24-48 months), specific diseases (1-2 years). Give examples from major insurers.",
  "claimProcess": "Step-by-step cashless and reimbursement claim process. Include IRDAI mandates: 1-hour cashless approval, 3-hour discharge. Include Bima Bharosa portal and IGMS complaint reference.",
  "taxBenefits": "Section 80D deduction details: ₹25,000 self+family, ₹50,000 for senior citizens, ₹5,000 preventive check-up. Give calculation examples.",
  "tips": "5 practical tips for choosing the right health insurance plan. Mention CSR, network hospitals, room rent limit, co-payment, restoration benefit.",
  "faqs": [
    {"question": "Question 1 about health insurance in Hinglish?", "answer": "Clear, factual answer"},
    {"question": "Question 2?", "answer": "Answer"},
    {"question": "Question 3?", "answer": "Answer"},
    {"question": "Question 4?", "answer": "Answer"},
    {"question": "Question 5?", "answer": "Answer"},
    {"question": "Question 6?", "answer": "Answer"}
  ],
  "expertInsight": "A 2-3 sentence expert opinion from Himanshu Paliwal, IRDAI POSP (Code: IP429834). Give practical advice about health insurance choices."
}

IMPORTANT RULES:
- Use Indian English with natural Hinglish words
- Include ₹ amounts and percentages where relevant
- Reference IRDAI guidelines, claim settlement ratios, and Bima Bharosa portal
- Never say "best" — say "suitable" or "appropriate for your needs"
- Never say "guaranteed" — say "likely" or "expected"
- Include specific insurer examples with their CSR percentages
- Mention IRDAI cashless mandate: 1-hour approval, 3-hour discharge
- Reference Section 80D tax benefits with specific ₹ amounts
- Include medical inflation rate of 14% where relevant
- Mention that 700M+ Indians are uninsured or underinsured`;
}
