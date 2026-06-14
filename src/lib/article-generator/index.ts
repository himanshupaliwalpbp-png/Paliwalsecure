// ============================================================================
// Paliwal Secure - Auto Article Generator
// Takes trend topics and generates full SEO-optimized articles using LLM
// ============================================================================

import { db } from '@/lib/db';
import type { ScoredTrend } from '@/lib/trends';
import type { ArticleContent, ArticleMetadata } from './templates/base-template';
import { buildNewsArticle, buildNewsMetadata, getNewsLLMPrompt } from './templates/news-template';
import { buildVehicleArticle, buildVehicleMetadata, getVehicleLLMPrompt } from './templates/vehicle-insurance-template';
import { buildHealthArticle, buildHealthMetadata, getHealthLLMPrompt } from './templates/health-insurance-template';

// ── IRDAI Compliance Checker ───────────────────────────────────────────────

const PROHIBITED_TERMS = [
  'guaranteed', 'best', 'cheapest', 'number one', '#1', 'lowest',
  'undisputed', 'unbeatable', 'top-rated', 'most trusted',
  '100% claim', 'guaranteed claim', 'assured returns',
  'risk-free', 'no risk', 'sure shot', 'never reject',
];

interface ComplianceResult {
  isCompliant: boolean;
  violations: string[];
  sanitizedContent: string;
}

export function checkIRDAICompliance(content: string): ComplianceResult {
  const violations: string[] = [];
  let sanitizedContent = content;

  for (const term of PROHIBITED_TERMS) {
    const regex = new RegExp(term, 'gi');
    if (regex.test(content)) {
      violations.push(`Prohibited term found: "${term}"`);
      // Replace with appropriate alternatives
      const replacements: Record<string, string> = {
        'guaranteed': 'expected',
        'best': 'suitable',
        'cheapest': 'affordable',
        'number one': 'leading',
        '#1': 'leading',
        'lowest': 'competitive',
        'undisputed': 'established',
        'unbeatable': 'competitive',
        'top-rated': 'well-regarded',
        'most trusted': 'established',
        '100% claim': 'high claim',
        'guaranteed claim': 'expected claim',
        'assured returns': 'potential returns',
        'risk-free': 'low-risk',
        'no risk': 'minimal risk',
        'sure shot': 'likely',
        'never reject': 'rarely reject',
      };
      const replacement = replacements[term.toLowerCase()] || 'appropriate';
      sanitizedContent = sanitizedContent.replace(regex, replacement);
    }
  }

  return {
    isCompliant: violations.length === 0,
    violations,
    sanitizedContent,
  };
}

// ── Template Selection ─────────────────────────────────────────────────────

type TemplateType = 'news' | 'vehicle' | 'health';

function selectTemplate(trend: ScoredTrend): TemplateType {
  const tags = trend.tags.map((t) => t.toLowerCase());
  const category = trend.category.toLowerCase();

  // Vehicle insurance template
  if (tags.includes('motor') || tags.includes('ev') || category === 'motor') {
    return 'vehicle';
  }

  // Health insurance template
  if (tags.includes('health') || tags.includes('senior') || tags.includes('corporate') || category === 'health') {
    return 'health';
  }

  // Default to news template for regulation, claim, general
  return 'news';
}

// ── LLM Content Generation ────────────────────────────────────────────────

async function generateLLMContent(trend: ScoredTrend, templateType: TemplateType): Promise<string> {
  let prompt: string;

  switch (templateType) {
    case 'vehicle':
      prompt = getVehicleLLMPrompt(trend);
      break;
    case 'health':
      prompt = getHealthLLMPrompt(trend);
      break;
    case 'news':
    default:
      prompt = getNewsLLMPrompt(trend);
      break;
  }

  try {
    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: prompt },
        { role: 'user', content: `Generate the article content for: "${trend.title}". Return ONLY valid JSON, no markdown, no code fences.` },
      ],
      thinking: { type: 'disabled' },
    });

    const content = completion?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('Empty LLM response');
    }

    return content;
  } catch (error) {
    console.error('LLM generation error:', error);
    throw error;
  }
}

// ── Parse LLM Response ────────────────────────────────────────────────────

function parseLLMResponse(rawContent: string): Record<string, unknown> {
  // Try to extract JSON from the response
  let jsonStr = rawContent.trim();

  // Remove markdown code fences if present
  const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    jsonStr = fenceMatch[1].trim();
  }

  // Try to find JSON object boundaries
  const startIdx = jsonStr.indexOf('{');
  const endIdx = jsonStr.lastIndexOf('}');
  if (startIdx !== -1 && endIdx !== -1) {
    jsonStr = jsonStr.slice(startIdx, endIdx + 1);
  }

  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error('Failed to parse LLM response as JSON:', e);
    console.error('Raw content:', rawContent.slice(0, 500));
    throw new Error('Failed to parse LLM response as JSON');
  }
}

// ── Generate Metadata ─────────────────────────────────────────────────────

function generateMetadata(trend: ScoredTrend, article: ArticleContent, templateType: TemplateType): ArticleMetadata {
  switch (templateType) {
    case 'vehicle':
      return buildVehicleMetadata(trend, article);
    case 'health':
      return buildHealthMetadata(trend, article);
    case 'news':
    default:
      return buildNewsMetadata(trend, article);
  }
}

// ── Calculate Word Count and Read Time ────────────────────────────────────

function calculateWordCount(content: string): number {
  return content.split(/\s+/).filter(Boolean).length;
}

function calculateReadTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 200)); // 200 WPM average
}

// ── Build Full Article Content as Markdown ─────────────────────────────────

function buildFullMarkdown(article: ArticleContent): string {
  let markdown = `# ${article.title}\n\n`;
  markdown += `## Key Takeaway\n\n${article.quickAnswer}\n\n`;

  for (const section of article.sections) {
    markdown += `## ${section.heading}\n\n${section.content}\n\n`;
  }

  if (article.faqs.length > 0) {
    markdown += `## Frequently Asked Questions\n\n`;
    for (const faq of article.faqs) {
      markdown += `### ${faq.question}\n\n${faq.answer}\n\n`;
    }
  }

  if (article.expertInsight) {
    markdown += `## Expert Insight\n\n${article.expertInsight}\n\n`;
  }

  markdown += `---\n\n${article.cta}\n`;

  return markdown;
}

// ── Main: Generate Article from Trend ─────────────────────────────────────

export interface GeneratedArticleResult {
  success: boolean;
  articleId?: string;
  slug?: string;
  title?: string;
  wordCount?: number;
  readTime?: number;
  complianceChecked?: boolean;
  complianceIssues?: string[];
  error?: string;
}

export async function generateArticle(trend: ScoredTrend): Promise<GeneratedArticleResult> {
  try {
    // Check if article already exists for this trend
    const existingArticle = await db.generatedArticle.findFirst({
      where: { sourceTrendId: trend.slug },
    });
    if (existingArticle) {
      return {
        success: false,
        error: `Article already exists for trend: ${trend.title}`,
      };
    }

    // Select template type
    const templateType = selectTemplate(trend);

    // Generate content using LLM
    const rawLLMContent = await generateLLMContent(trend, templateType);
    const parsedContent = parseLLMResponse(rawLLMContent);

    // Build article using appropriate template
    let article: ArticleContent;
    switch (templateType) {
      case 'vehicle':
        article = buildVehicleArticle({ trend, llmContent: parsedContent as never });
        break;
      case 'health':
        article = buildHealthArticle({ trend, llmContent: parsedContent as never });
        break;
      case 'news':
      default:
        article = buildNewsArticle({ trend, llmContent: parsedContent as never });
        break;
    }

    // Generate metadata
    const metadata = generateMetadata(trend, article, templateType);

    // Build full markdown content
    const fullMarkdown = buildFullMarkdown(article);

    // IRDAI Compliance Check
    const compliance = checkIRDAICompliance(fullMarkdown);
    const finalContent = compliance.sanitizedContent;

    // Calculate word count and read time
    const wordCount = calculateWordCount(finalContent);
    const readTime = calculateReadTime(wordCount);

    // Generate unique slug
    const slug = trend.slug || trend.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // Store article in database
    const dbArticle = await db.generatedArticle.create({
      data: {
        slug,
        title: article.title,
        metaDescription: metadata.metaDescription,
        keywords: JSON.stringify(metadata.keywords),
        category: trend.category,
        templateType,
        content: finalContent,
        quickAnswer: article.quickAnswer,
        faqs: JSON.stringify(article.faqs),
        expertInsight: article.expertInsight,
        ogTitle: metadata.ogTitle,
        ogDescription: metadata.ogDescription,
        schemaMarkup: JSON.stringify(metadata.schemaMarkup),
        internalLinks: JSON.stringify(metadata.internalLinks),
        sourceTrendId: trend.slug,
        status: 'draft',
        complianceChecked: true,
        complianceIssues: JSON.stringify(compliance.violations),
        wordCount,
        readTime,
      },
    });

    // Mark trend as having an article created
    await db.trendTopic.upsert({
      where: { slug: trend.slug },
      create: {
        title: trend.title,
        slug: trend.slug,
        source: trend.source || 'manual',
        sourceUrl: trend.sourceUrl,
        category: trend.category,
        tags: JSON.stringify(trend.tags),
        priorityScore: trend.priorityScore,
        searchVolume: trend.searchVolume,
        isTrending: trend.isTrending,
        articleCreated: true,
        expiresAt: trend.expiresAt,
      },
      update: {
        articleCreated: true,
      },
    });

    return {
      success: true,
      articleId: dbArticle.id,
      slug: dbArticle.slug,
      title: article.title,
      wordCount,
      readTime,
      complianceChecked: true,
      complianceIssues: compliance.violations,
    };
  } catch (error) {
    console.error('Article generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during article generation',
    };
  }
}

// ── Store Article: Save a pre-built article to the database ───────────────

export async function storeArticle(articleData: {
  slug: string;
  title: string;
  metaDescription: string;
  keywords?: string[];
  category?: string;
  templateType?: string;
  content: string;
  quickAnswer?: string;
  faqs?: Array<{ question: string; answer: string }>;
  expertInsight?: string;
  ogTitle?: string;
  ogDescription?: string;
  schemaMarkup?: Record<string, unknown>;
  internalLinks?: string[];
  sourceTrendId?: string;
  status?: string;
  wordCount?: number;
  readTime?: number;
}): Promise<{ id: string; slug: string } | null> {
  try {
    const wordCount = articleData.wordCount || calculateWordCount(articleData.content);
    const readTime = articleData.readTime || calculateReadTime(wordCount);

    const compliance = checkIRDAICompliance(articleData.content);

    const dbArticle = await db.generatedArticle.create({
      data: {
        slug: articleData.slug,
        title: articleData.title,
        metaDescription: articleData.metaDescription,
        keywords: JSON.stringify(articleData.keywords || []),
        category: articleData.category || 'general',
        templateType: articleData.templateType || 'news',
        content: compliance.sanitizedContent,
        quickAnswer: articleData.quickAnswer,
        faqs: JSON.stringify(articleData.faqs || []),
        expertInsight: articleData.expertInsight,
        ogTitle: articleData.ogTitle || articleData.title,
        ogDescription: articleData.ogDescription || articleData.metaDescription,
        schemaMarkup: JSON.stringify(articleData.schemaMarkup || {}),
        internalLinks: JSON.stringify(articleData.internalLinks || []),
        sourceTrendId: articleData.sourceTrendId,
        status: articleData.status || 'draft',
        complianceChecked: true,
        complianceIssues: JSON.stringify(compliance.violations),
        wordCount,
        readTime,
      },
    });

    return { id: dbArticle.id, slug: dbArticle.slug };
  } catch (error) {
    console.error('Store article error:', error);
    return null;
  }
}

// ── Batch Generate: Generate articles for multiple trends ──────────────────

export async function batchGenerateArticles(trends: ScoredTrend[]): Promise<GeneratedArticleResult[]> {
  const results: GeneratedArticleResult[] = [];

  for (const trend of trends) {
    const result = await generateArticle(trend);
    results.push(result);

    // Small delay between LLM calls to avoid rate limiting
    if (trends.indexOf(trend) < trends.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  return results;
}
