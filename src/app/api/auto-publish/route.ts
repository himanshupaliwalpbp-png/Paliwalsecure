// ============================================================================
// Paliwal Secure — Auto-Publish API (Neon PostgreSQL + z-ai-web-dev-sdk LLM)
// POST: Auto-publishing pipeline — finds unprocessed trends, generates
//       articles via z-ai-web-dev-sdk LLM, saves to Neon DB, marks processed
// GET:  Checks for unprocessed trends (for monitoring/triggering)
// Articles are saved with status 'draft' by default.
// Use /api/articles/publish endpoint to publish drafts.
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  isNeonAvailable,
  fetchUnprocessedTrends,
  createArticle,
  markTrendAsProcessed,
  createInternalLink,
  type NeonTrend,
} from '@/lib/neon-db';
import { requireAdmin } from '@/lib/api-auth';

export const maxDuration = 60;

// ── Rate Limiting (simple in-memory) ────────────────────────────────────────

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

// ── LLM Article Generation ─────────────────────────────────────────────────

interface LLMArticleResult {
  title: string;
  seoTitle: string;
  seoDescription: string;
  content: string;
  category: string;
  slug: string;
  keywords: string[];
}

/**
 * Generate an SEO-optimized article using z-ai-web-dev-sdk LLM
 * Articles are generated in Hinglish by default (Hindi words in Roman script + English)
 */
async function generateArticleWithLLM(
  trendTitle: string,
  trendDescription: string | null,
  trendCategory: string,
  trendSource: string | null
): Promise<LLMArticleResult | null> {
  try {
    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    const zai = await ZAI.create();

    const slug = trendTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Determine category mapping
    const categoryMap: Record<string, string> = {
      'vehicle_launch': 'Vehicle Guide',
      'vehicle-launch': 'Vehicle Guide',
      'irdai-update': 'Insurance News',
      'regulatory': 'Insurance News',
      'health-insurance': 'Health Insurance',
      'health_insurance': 'Health Insurance',
      'motor-insurance': 'Motor Insurance',
      'motor_insurance': 'Motor Insurance',
      'life-insurance': 'Life Insurance',
      'life_insurance': 'Life Insurance',
      'claim-guide': 'Claims Guide',
      'claim_guide': 'Claims Guide',
      'news': 'Insurance News',
      'ev-launch': 'EV Insurance',
      'ev_launch': 'EV Insurance',
      'market_trend': 'Insurance News',
      'market-trend': 'Insurance News',
    };
    const category = categoryMap[trendCategory] || 'Insurance Basics';

    const systemPrompt = `You are an expert insurance content writer for PaliwalSecure.in — an IRDAI-licensed insurance advisory platform run by Himanshu Paliwal (POSP Code: IP429834). 

You write SEO-optimized, trilingual (Hindi/Hinglish/English) insurance articles for Indian audiences. Your articles are:
- Factual and IRDAI-compliant (no misleading claims, no "best" language)
- Written in Hinglish (Hindi words in Roman script + English, as Indians naturally speak)
- Include comparison tables, FAQs, and actionable tips
- Reference IRDAI regulations and claim settlement ratios
- Include the IRDAI disclaimer at the bottom

CRITICAL RULES:
1. Never say "best" insurance — use "suitable", "recommended", "popular"
2. Always mention IRDAI POSP Code: IP429834
3. Include Section 80D/80C tax benefits where relevant
4. Include WhatsApp CTA: https://wa.me/919257877312
5. Articles must be 1500+ words
6. Include at least one comparison table
7. Include 5 FAQs
8. Add JSON-LD compatible structured data hints`;

    const userPrompt = `Write a comprehensive, SEO-optimized insurance article about: "${trendTitle}"

Trend Details:
- Category: ${category}
- Description: ${trendDescription || 'N/A'}
- Source: ${trendSource || 'Industry Update'}

ARTICLE STRUCTURE (follow this exactly):
1. **Quick Answer** — 2-3 sentence featured snippet optimized answer (Hinglish)
2. **Main Content** — Detailed explanation with:
   - What happened / What this means for policyholders
   - Comparison table (premiums, features, or before/after)
   - Key points with bullet lists
   - Actionable tips for readers
3. **FAQs** — 5 frequently asked questions with detailed answers
4. **Expert Advice** — Quote from Himanshu Paliwal (IRDAI POSP Code: IP429834)
5. **Footer** — IRDAI disclaimer + WhatsApp CTA

RESPONSE FORMAT — Return ONLY a valid JSON object (no markdown code blocks):
{
  "title": "Article title in Hinglish",
  "seoTitle": "SEO optimized title (60 chars max)",
  "seoDescription": "Meta description for search engines (155 chars max)",
  "content": "Full article content in markdown format (1500+ words)",
  "category": "${category}",
  "slug": "${slug}",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      thinking: { type: 'disabled' },
    });

    const responseText = completion?.choices?.[0]?.message?.content;
    if (!responseText) {
      console.error('[auto-publish] LLM returned empty response');
      return null;
    }

    // Parse the JSON response — handle potential markdown code block wrapping
    let cleanResponse = responseText.trim();
    if (cleanResponse.startsWith('```json')) {
      cleanResponse = cleanResponse.slice(7);
    } else if (cleanResponse.startsWith('```')) {
      cleanResponse = cleanResponse.slice(3);
    }
    if (cleanResponse.endsWith('```')) {
      cleanResponse = cleanResponse.slice(0, -3);
    }
    cleanResponse = cleanResponse.trim();

    const parsed = JSON.parse(cleanResponse) as LLMArticleResult;

    // Validate required fields
    if (!parsed.title || !parsed.content) {
      console.error('[auto-publish] LLM response missing required fields');
      return null;
    }

    // Ensure slug is valid
    if (!parsed.slug) {
      parsed.slug = slug;
    }

    // Ensure keywords array
    if (!parsed.keywords || !Array.isArray(parsed.keywords)) {
      parsed.keywords = trendTitle.toLowerCase().split(' ').filter(w => w.length > 3).slice(0, 5);
    }

    return parsed;
  } catch (error) {
    console.error('[auto-publish] LLM generation error:', error);
    return null;
  }
}

// ── Build JSON-LD for article ──────────────────────────────────────────────

function buildArticleJsonLd(
  title: string,
  slug: string,
  seoDescription: string,
  category: string
): Record<string, unknown> {
  const baseUrl = 'https://paliwalsecure.in';
  const date = new Date().toISOString().split('T')[0];

  return {
    article: {
      '@context': 'https://schema.org',
      '@type': category === 'Insurance News' ? 'NewsArticle' : 'Article',
      headline: title,
      description: seoDescription,
      author: {
        '@type': 'Person',
        name: 'Himanshu Paliwal',
        jobTitle: 'IRDAI Licensed POSP',
        identifier: 'IP429834',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Paliwal Secure',
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo.png`,
        },
      },
      url: `${baseUrl}/blog/${slug}`,
      mainEntityOfPage: `${baseUrl}/blog/${slug}`,
      datePublished: date,
      dateModified: date,
      inLanguage: 'en-IN',
    },
  };
}

// ── Process a single trend into an article ──────────────────────────────────

interface ProcessedTrendResult {
  trendId: string;
  trendTitle: string;
  success: boolean;
  articleId?: string;
  slug?: string;
  wordCount?: number;
  error?: string;
}

async function processTrendToArticle(
  trend: NeonTrend
): Promise<ProcessedTrendResult> {
  try {
    console.log(`[auto-publish] Processing trend: "${trend.title}"`);

    // Step 1: Generate article using LLM
    const articleData = await generateArticleWithLLM(
      trend.title,
      trend.description,
      trend.category,
      trend.source
    );

    if (!articleData) {
      return {
        trendId: trend.id,
        trendTitle: trend.title,
        success: false,
        error: 'LLM article generation failed',
      };
    }

    // Step 2: Build JSON-LD
    const jsonLd = buildArticleJsonLd(
      articleData.title,
      articleData.slug,
      articleData.seoDescription || articleData.title,
      articleData.category
    );

    // Step 3: Create article in Neon DB — status is 'draft' by default
    const dbArticle = await createArticle({
      slug: articleData.slug,
      title: articleData.title,
      seoTitle: articleData.seoTitle || articleData.title,
      seoDescription: articleData.seoDescription || '',
      content: articleData.content,
      jsonLd: JSON.stringify(jsonLd),
      metaKeywords: articleData.keywords,
      category: articleData.category,
      trendId: trend.id,
      status: 'draft', // Default: articles are saved as drafts
    });

    if (!dbArticle) {
      return {
        trendId: trend.id,
        trendTitle: trend.title,
        success: false,
        error: 'Failed to create article in database',
      };
    }

    // Step 4: Mark the trend as processed
    await markTrendAsProcessed(trend.id);

    const wordCount = articleData.content.split(/\s+/).filter(Boolean).length;

    console.log(`[auto-publish] Article created as draft: "${articleData.title}" (${wordCount} words)`);

    return {
      trendId: trend.id,
      trendTitle: trend.title,
      success: true,
      articleId: dbArticle.id,
      slug: articleData.slug,
      wordCount,
    };
  } catch (error) {
    console.error(`[auto-publish] Error processing trend "${trend.title}":`, error);
    return {
      trendId: trend.id,
      trendTitle: trend.title,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ── POST: Auto-Publishing Pipeline ─────────────────────────────────────────

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // ── AUTH: admin-only (LLM cost + content mutation) ───────────────────────
    const admin = requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Try again in a minute.', articlesCreated: 0 },
        { status: 429 }
      );
    }

    if (!isNeonAvailable()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Neon database is not configured. Set DATABASE_URL_NEON environment variable.',
          articlesCreated: 0,
        },
        { status: 503 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const limit = Math.min(body.limit || 5, 20); // Max 20 trends per run
    const dryRun = body.dryRun === true;
    const autoPublish = body.autoPublish === true; // If true, publish drafts immediately

    // Step 1: Find unprocessed trends
    const pendingTrends = await fetchUnprocessedTrends(limit);

    if (pendingTrends.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No unprocessed trends found for auto-publishing',
        articlesCreated: 0,
        duration: `${Date.now() - startTime}ms`,
      });
    }

    console.log(`[auto-publish] Found ${pendingTrends.length} unprocessed trend(s)`);

    // Step 2: Dry run — just return what would be processed
    if (dryRun) {
      return NextResponse.json({
        success: true,
        message: 'Dry run — no articles generated',
        dryRun: true,
        pendingTrends: pendingTrends.map((t) => ({
          id: t.id,
          title: t.title,
          category: t.category,
          description: t.description,
          triggerDate: typeof t.trigger_date === 'string' ? t.trigger_date : new Date(t.trigger_date).toISOString(),
        })),
        wouldCreate: pendingTrends.length,
        duration: `${Date.now() - startTime}ms`,
      });
    }

    // Step 3: Process each trend
    const results: ProcessedTrendResult[] = [];
    for (let i = 0; i < pendingTrends.length; i++) {
      const trend = pendingTrends[i];
      const result = await processTrendToArticle(trend);
      results.push(result);

      // If autoPublish is enabled, publish the draft immediately
      if (autoPublish && result.success && result.articleId) {
        const { updateArticleStatus } = await import('@/lib/neon-db');
        await updateArticleStatus(result.articleId, 'published');
      }

      // Small delay between trend processing to avoid rate limiting
      if (i < pendingTrends.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    // Step 4: Trigger revalidation for published articles
    try {
      revalidatePath('/blog');
      revalidatePath('/');
      for (const result of successful) {
        if (result.slug) {
          revalidatePath(`/blog/${result.slug}`);
        }
      }
    } catch (revalError) {
      console.error('[auto-publish] Revalidation error (non-fatal):', revalError);
    }

    const duration = Date.now() - startTime;

    console.log(
      `[auto-publish] Pipeline complete: ${successful.length} created (as ${autoPublish ? 'published' : 'drafts'}), ${failed.length} failed in ${duration}ms`
    );

    return NextResponse.json({
      success: true,
      message: `Created ${successful.length} article(s) as ${autoPublish ? 'published' : 'drafts'} from ${pendingTrends.length} trend(s)`,
      articlesCreated: successful.length,
      articlesFailed: failed.length,
      defaultStatus: autoPublish ? 'published' : 'draft',
      results: results.map((r) => ({
        trendId: r.trendId,
        trendTitle: r.trendTitle,
        success: r.success,
        articleId: r.articleId,
        slug: r.slug,
        wordCount: r.wordCount,
        error: r.error,
      })),
      duration: `${duration}ms`,
    });
  } catch (error) {
    console.error('[auto-publish] POST pipeline error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        articlesCreated: 0,
        duration: `${Date.now() - startTime}ms`,
      },
      { status: 500 }
    );
  }
}

// ── GET: Check for unprocessed trends ──────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    // ── AUTH: admin-only ─────────────────────────────────────────────────────
    const admin = requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const neonAvailable = isNeonAvailable();

    let pendingTrends: Array<{
      id: string;
      title: string;
      category: string;
      description: string | null;
      triggerDate: string;
    }> = [];

    if (neonAvailable) {
      const trends = await fetchUnprocessedTrends(10);
      pendingTrends = trends.map((t) => ({
        id: t.id,
        title: t.title,
        category: t.category,
        description: t.description,
        triggerDate: typeof t.trigger_date === 'string' ? t.trigger_date : new Date(t.trigger_date).toISOString(),
      }));
    }

    return NextResponse.json({
      success: true,
      neonAvailable,
      pendingTrends,
      totalPending: pendingTrends.length,
      message: pendingTrends.length > 0
        ? `${pendingTrends.length} pending trend(s) found for article generation`
        : 'No pending trends found',
    });
  } catch (error) {
    console.error('[auto-publish] GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
