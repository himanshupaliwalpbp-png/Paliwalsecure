// ============================================================================
// Vehicle Insurance Template — For car/bike/EV insurance articles
// ============================================================================

import type { ArticleContent, ArticleMetadata, ArticleFAQ, ArticleSection } from './base-template';
import { getDisclaimerSection, getAuthorBox, getCTA, getBaseInternalLinks, generateBaseSchema } from './base-template';
import type { ScoredTrend } from '@/lib/trends';

interface VehicleTemplateInput {
  trend: ScoredTrend;
  llmContent: {
    summary: string;
    keyPoints: string[];
    comparison: string;
    premiumImpact: string;
    addOns: string;
    claimProcess: string;
    tips: string;
    faqs: ArticleFAQ[];
    expertInsight: string;
  };
}

export function buildVehicleArticle(input: VehicleTemplateInput): ArticleContent {
  const { trend, llmContent } = input;

  const sections: ArticleSection[] = [
    {
      heading: 'Quick Overview',
      content: llmContent.summary,
    },
    {
      heading: 'Key Points You Should Know',
      content: llmContent.keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n'),
    },
    {
      heading: 'How This Affects Your Premium',
      content: llmContent.premiumImpact,
    },
    {
      heading: 'Comprehensive vs Third-Party: Which to Choose?',
      content: llmContent.comparison,
    },
    {
      heading: 'Recommended Add-Ons',
      content: llmContent.addOns,
    },
    {
      heading: 'Claim Process for Vehicle Insurance',
      content: llmContent.claimProcess,
    },
    {
      heading: 'Money-Saving Tips',
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

export function buildVehicleMetadata(trend: ScoredTrend, article: ArticleContent): ArticleMetadata {
  const keywords = [
    ...trend.tags,
    'car insurance',
    'bike insurance',
    'motor insurance',
    'vehicle insurance India',
    'comprehensive insurance',
    'third-party insurance',
    'IRDAI',
    trend.title.split(' ').filter((w) => w.length > 3).slice(0, 5),
  ].flat().filter(Boolean);

  return {
    metaDescription: article.quickAnswer.slice(0, 155),
    keywords: [...new Set(keywords)],
    ogTitle: trend.title,
    ogDescription: article.quickAnswer.slice(0, 155),
    schemaMarkup: generateBaseSchema(trend.title, trend.slug, trend.category, article.faqs),
    internalLinks: getBaseInternalLinks('motor'),
  };
}

export function getVehicleLLMPrompt(trend: ScoredTrend): string {
  return `You are an expert Indian motor insurance content writer for Paliwal Secure (paliwalsecure.in), writing for an Indian audience. You must follow IRDAI compliance guidelines — never use words like "guaranteed", "best", "cheapest", "number one", or make absolute claims about any insurer.

Write a comprehensive vehicle insurance article about the following trending topic:

**Topic:** ${trend.title}
**Category:** ${trend.category}
**Tags:** ${trend.tags.join(', ')}

You MUST respond with a valid JSON object (no markdown, no code fences) with exactly these fields:

{
  "summary": "A clear 3-4 sentence overview of the topic, written in simple Indian English with Hinglish words where natural",
  "keyPoints": ["Point 1 with specific ₹ amounts or percentages", "Point 2", "Point 3", "Point 4", "Point 5"],
  "comparison": "Compare comprehensive vs third-party insurance in context of this topic. Include specific ₹ premium estimates for popular cars (Maruti Swift, Hyundai Creta, etc.) and bikes (Hero Splendor, Royal Enfield).",
  "premiumImpact": "Explain how this affects premiums. Give specific ₹ ranges for different vehicle categories. Include IDV calculation examples if relevant.",
  "addOns": "List 4-5 relevant add-on covers with brief explanation of each and approximate ₹ cost. Include Zero Dep, Engine Protect, RSA, NCB Protection, etc.",
  "claimProcess": "Step-by-step motor insurance claim process in India. Include IRDAI timelines and Bima Bharosa portal reference.",
  "tips": "5 practical money-saving tips for vehicle insurance in India. Be specific about NCB, deductible, anti-theft discount, etc.",
  "faqs": [
    {"question": "Question 1 about vehicle insurance in Hinglish?", "answer": "Clear, factual answer"},
    {"question": "Question 2?", "answer": "Answer"},
    {"question": "Question 3?", "answer": "Answer"},
    {"question": "Question 4?", "answer": "Answer"},
    {"question": "Question 5?", "answer": "Answer"}
  ],
  "expertInsight": "A 2-3 sentence expert opinion from Himanshu Paliwal, IRDAI POSP (Code: IP429834). Give practical advice about vehicle insurance choices."
}

IMPORTANT RULES:
- Use Indian English with natural Hinglish words
- Include ₹ amounts and percentages where relevant
- Reference IRDAI TP rates and MoRTH guidelines where applicable
- Never say "best" — say "suitable" or "appropriate for your needs"
- Never say "guaranteed" — say "likely" or "expected"
- Include specific vehicle names and approximate premiums
- Mention NCB slab: 20% (1yr), 25% (2yr), 35% (3yr), 45% (4yr), 50% (5yr+)
- Reference IDV depreciation: 5% (<6mo), 15% (6mo-1yr), 25% (1-2yr), 35% (2-3yr), 40% (3-4yr), 50% (4-5yr)`;
}
