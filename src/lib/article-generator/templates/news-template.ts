// ============================================================================
// News Template — For IRDAI/regulation news articles
// ============================================================================

import type { ArticleContent, ArticleMetadata, ArticleFAQ, ArticleSection } from './base-template';
import { getDisclaimerSection, getAuthorBox, getCTA, getBaseInternalLinks, generateBaseSchema } from './base-template';
import type { ScoredTrend } from '@/lib/trends';

interface NewsTemplateInput {
  trend: ScoredTrend;
  llmContent: {
    summary: string;
    keyChanges: string[];
    impact: string;
    timeline: string;
    whatItMeans: string;
    faqs: ArticleFAQ[];
    expertInsight: string;
  };
}

export function buildNewsArticle(input: NewsTemplateInput): ArticleContent {
  const { trend, llmContent } = input;

  const sections: ArticleSection[] = [
    {
      heading: 'What Happened?',
      content: llmContent.summary,
    },
    {
      heading: 'Key Changes',
      content: llmContent.keyChanges.map((change, i) => `${i + 1}. ${change}`).join('\n'),
    },
    {
      heading: 'Impact on Policyholders',
      content: llmContent.impact,
    },
    {
      heading: 'Timeline',
      content: llmContent.timeline,
    },
    {
      heading: 'What This Means for You',
      content: llmContent.whatItMeans,
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

export function buildNewsMetadata(trend: ScoredTrend, article: ArticleContent): ArticleMetadata {
  const keywords = [
    ...trend.tags,
    trend.category,
    'IRDAI',
    'insurance India',
    'insurance regulation',
    trend.title.split(' ').filter((w) => w.length > 3).slice(0, 5),
  ].flat().filter(Boolean);

  return {
    metaDescription: article.quickAnswer.slice(0, 155),
    keywords: [...new Set(keywords)],
    ogTitle: trend.title,
    ogDescription: article.quickAnswer.slice(0, 155),
    schemaMarkup: generateBaseSchema(trend.title, trend.slug, trend.category, article.faqs),
    internalLinks: getBaseInternalLinks(trend.category),
  };
}

export function getNewsLLMPrompt(trend: ScoredTrend): string {
  return `You are an expert Indian insurance content writer for Paliwal Secure (paliwalsecure.in), writing for an Indian audience. You must follow IRDAI compliance guidelines — never use words like "guaranteed", "best", "cheapest", "number one", or make absolute claims about any insurer.

Write a comprehensive news article about the following trending insurance topic in India:

**Topic:** ${trend.title}
**Category:** ${trend.category}
**Tags:** ${trend.tags.join(', ')}

You MUST respond with a valid JSON object (no markdown, no code fences) with exactly these fields:

{
  "summary": "A clear 3-4 sentence summary of what happened, written in simple Indian English with Hinglish words where natural",
  "keyChanges": ["Change 1", "Change 2", "Change 3", "Change 4"],
  "impact": "2-3 paragraphs explaining how this affects Indian policyholders. Include specific numbers where possible (premiums in ₹, percentages, dates).",
  "timeline": "When this takes effect, key dates, and deadlines. Include specific dates or timeframes.",
  "whatItMeans": "Practical steps a policyholder should take right now. Be specific and actionable. Include any IRDAI portal links or references.",
  "faqs": [
    {"question": "Question 1 in Hinglish?", "answer": "Clear, factual answer in Hinglish"},
    {"question": "Question 2?", "answer": "Answer"},
    {"question": "Question 3?", "answer": "Answer"},
    {"question": "Question 4?", "answer": "Answer"},
    {"question": "Question 5?", "answer": "Answer"}
  ],
  "expertInsight": "A 2-3 sentence expert opinion from Himanshu Paliwal, IRDAI POSP (Code: IP429834). Give practical, grounded advice. No hype."
}

IMPORTANT RULES:
- Use Indian English with natural Hinglish words (like "policy", "premium", "claim", "cashless")
- Include ₹ amounts and percentages where relevant
- Reference IRDAI guidelines specifically where applicable
- Never say "best" — say "suitable" or "appropriate"
- Never say "guaranteed" — say "likely" or "expected"
- Be factual, not promotional
- Include mention of Bima Bharosa portal or IGMS for complaints where relevant`;
}
