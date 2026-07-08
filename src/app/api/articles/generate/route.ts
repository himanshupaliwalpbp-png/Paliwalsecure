// ============================================================================
// Article Generation API Endpoint
// POST: Generates an article from a trend topic using LLM
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { detectTrends, getTrendsForArticleGeneration, type ScoredTrend } from '@/lib/trends';
import { generateArticle, batchGenerateArticles, checkIRDAICompliance } from '@/lib/article-generator';
import { requireAdmin } from '@/lib/api-auth';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    // ── AUTH: admin-only (LLM cost protection) ───────────────────────────────
    const admin = requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { trendSlug, trendTitle, autoSelect = false, limit = 1 } = body;

    let targetTrends: ScoredTrend[] = [];

    // Mode 1: Generate article for a specific trend by slug or title
    if (trendSlug || trendTitle) {
      const allTrends = detectTrends();
      const target = allTrends.find(
        (t) =>
          t.slug === trendSlug ||
          t.title.toLowerCase() === (trendTitle || '').toLowerCase()
      );

      if (!target) {
        return NextResponse.json(
          {
            success: false,
            error: `Trend not found: ${trendSlug || trendTitle}`,
            availableTrends: allTrends.map((t) => ({ slug: t.slug, title: t.title })),
          },
          { status: 404 }
        );
      }

      targetTrends = [target];
    }
    // Mode 2: Auto-select top trends for article generation
    else if (autoSelect) {
      targetTrends = getTrendsForArticleGeneration(limit);
    }
    // Mode 3: No target specified
    else {
      return NextResponse.json(
        {
          success: false,
          error: 'Provide either trendSlug, trendTitle, or set autoSelect=true',
          usage: {
            specificTrend: { trendSlug: 'gst-exemption-health-insurance-2025' },
            byTitle: { trendTitle: 'GST Exemption on Health Insurance Premiums' },
            autoSelect: { autoSelect: true, limit: 3 },
          },
        },
        { status: 400 }
      );
    }

    // Check if articles already exist for these trends
    const existingSlugs = targetTrends.map((t) => t.slug);
    const existingArticles = await db.generatedArticle.findMany({
      where: { sourceTrendId: { in: existingSlugs } },
      select: { sourceTrendId: true, slug: true, title: true, status: true },
    });

    if (existingArticles.length > 0) {
      // Filter out trends that already have articles
      const existingTrendSlugs = new Set(existingArticles.map((a) => a.sourceTrendId));
      const newTrends = targetTrends.filter((t) => !existingTrendSlugs.has(t.slug));

      if (newTrends.length === 0) {
        return NextResponse.json({
          success: false,
          message: 'Articles already exist for all specified trends',
          existingArticles,
        });
      }

      targetTrends = newTrends;
    }

    // Generate articles
    if (targetTrends.length === 1) {
      const result = await generateArticle(targetTrends[0]);
      return NextResponse.json({
        success: result.success,
        article: result.success ? {
          id: result.articleId,
          slug: result.slug,
          title: result.title,
          wordCount: result.wordCount,
          readTime: result.readTime,
          complianceChecked: result.complianceChecked,
          complianceIssues: result.complianceIssues,
        } : undefined,
        error: result.error,
      });
    } else {
      const results = await batchGenerateArticles(targetTrends);
      return NextResponse.json({
        success: results.every((r) => r.success),
        totalAttempted: results.length,
        totalSucceeded: results.filter((r) => r.success).length,
        totalFailed: results.filter((r) => !r.success).length,
        articles: results.map((r) => ({
          success: r.success,
          slug: r.slug,
          title: r.title,
          wordCount: r.wordCount,
          readTime: r.readTime,
          error: r.error,
        })),
      });
    }
  } catch (error) {
    console.error('Article generation API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate article' },
      { status: 500 }
    );
  }
}

// GET: List generated articles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const articles = await db.generatedArticle.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(category ? { category } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        slug: true,
        title: true,
        metaDescription: true,
        category: true,
        templateType: true,
        status: true,
        wordCount: true,
        readTime: true,
        complianceChecked: true,
        complianceIssues: true,
        sourceTrendId: true,
        createdAt: true,
        publishedAt: true,
      },
    });

    // Stats
    const totalArticles = await db.generatedArticle.count();
    const draftCount = await db.generatedArticle.count({ where: { status: 'draft' } });
    const publishedCount = await db.generatedArticle.count({ where: { status: 'published' } });

    return NextResponse.json({
      success: true,
      articles: articles.map((a) => ({
        ...a,
        complianceIssues: JSON.parse(a.complianceIssues),
      })),
      stats: {
        total: totalArticles,
        drafts: draftCount,
        published: publishedCount,
      },
    });
  } catch (error) {
    console.error('Article list API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list articles' },
      { status: 500 }
    );
  }
}
