// ============================================================================
// Paliwal Secure — Cron: Daily Article Generation
// Runs article generation for top trends
// Called by Vercel Cron at 2:00 AM daily
//
// INTEGRATION: Also triggers auto-publish for Neon-based trends
// Uses @neondatabase/serverless for direct SQL queries
// ============================================================================

import { NextResponse } from 'next/server';
import { getTrendsForArticleGeneration } from '@/lib/trends';
import { generateArticle, batchGenerateArticles } from '@/lib/article-generator';
import {
  isNeonAvailable,
  fetchUnprocessedTrends,
  createArticle,
  markTrendAsProcessed,
} from '@/lib/neon-db';

export const maxDuration = 60;

export async function GET() {
  const startTime = Date.now();

  try {
    // ── Part 1: Existing trend-based article generation (SQLite) ───────────
    const trends = getTrendsForArticleGeneration(5);
    let sqliteResults: Array<{
      slug?: string;
      title?: string;
      success: boolean;
      wordCount?: number;
      error?: string;
    }> = [];

    if (trends.length > 0) {
      const results = await batchGenerateArticles(trends);
      sqliteResults = results.map(r => ({
        slug: r.slug,
        title: r.title,
        success: r.success,
        wordCount: r.wordCount,
        error: r.error,
      }));
    }

    const sqliteSuccess = sqliteResults.filter(r => r.success);
    const sqliteFailed = sqliteResults.filter(r => !r.success);

    // ── Part 2: Auto-publish integration (Neon DB trends) ─────────────────
    let autoPublishResults: Array<{
      trendId?: string;
      trendTitle?: string;
      success: boolean;
      slug?: string;
      wordCount?: number;
      error?: string;
    }> = [];

    if (isNeonAvailable()) {
      try {
        // Fetch unprocessed trends from Neon
        const neonTrends = await fetchUnprocessedTrends(3);

        if (neonTrends && neonTrends.length > 0) {
          console.log(`[cron/generate] Found ${neonTrends.length} unprocessed Neon trends`);

          // Import auto-publish logic
          const { generateAutoArticle, inferTemplateType, inferCategory } = await import('@/lib/auto-article-generator');

          for (const trend of neonTrends) {
            try {
              const keywords = trend.title
                .toLowerCase()
                .split(/\s+/)
                .filter((w: string) => w.length > 3)
                .slice(0, 6);

              const templateType = inferTemplateType(trend.category, keywords);
              const { category, categoryHindi } = inferCategory(templateType, keywords);

              const article = generateAutoArticle({
                title: trend.title,
                slug: trend.title
                  .toLowerCase()
                  .replace(/[^a-z0-9\s-]/g, '')
                  .replace(/\s+/g, '-')
                  .replace(/-+/g, '-')
                  .replace(/^-|-$/g, ''),
                templateType,
                category,
                categoryHindi,
                description: trend.description || `Complete guide about ${trend.title} for Indian policyholders.`,
                keywords,
                trendData: {
                  source: trend.source || undefined,
                  sourceUrl: trend.source_url || undefined,
                  summary: trend.description || undefined,
                },
              });

              // Write markdown file
              const { writeFile, mkdir } = await import('fs/promises');
              const { existsSync } = await import('fs');
              const path = await import('path');

              const contentDir = path.join(process.cwd(), 'content', 'blog');
              if (!existsSync(contentDir)) {
                await mkdir(contentDir, { recursive: true });
              }
              await writeFile(
                path.join(contentDir, `${article.slug}.md`),
                article.markdown,
                'utf-8'
              );

              // Save article to Neon DB
              const articleStatus = article.complianceIssues.length === 0 ? 'published' : 'draft';
              await createArticle({
                slug: article.slug,
                title: article.title,
                seoTitle: article.title,
                seoDescription: (article.frontmatter.description as string) || '',
                content: article.markdown,
                jsonLd: JSON.stringify(article.jsonLdSuggestion),
                category: article.category,
                trendId: trend.id,
                status: articleStatus,
              });

              // Mark trend as processed
              await markTrendAsProcessed(trend.id);

              autoPublishResults.push({
                trendId: trend.id,
                trendTitle: trend.title,
                success: true,
                slug: article.slug,
                wordCount: article.wordCount,
              });
            } catch (autoError) {
              console.error(`[cron/generate] Auto-publish error for trend "${trend.title}":`, autoError);
              autoPublishResults.push({
                trendId: trend.id,
                trendTitle: trend.title,
                success: false,
                error: autoError instanceof Error ? autoError.message : 'Unknown error',
              });
            }
          }
        }
      } catch (neonError) {
        console.error('[cron/generate] Neon auto-publish error (non-fatal):', neonError);
      }
    }

    const autoPublishSuccess = autoPublishResults.filter(r => r.success);

    // ── Combined Response ──────────────────────────────────────────────────
    return NextResponse.json({
      success: true,
      message: `Generated ${sqliteSuccess.length + autoPublishSuccess.length} article(s) total`,
      sqliteGeneration: {
        articlesGenerated: sqliteSuccess.length,
        failed: sqliteFailed.length,
        results: sqliteResults,
      },
      autoPublish: {
        neonAvailable: isNeonAvailable(),
        articlesGenerated: autoPublishSuccess.length,
        results: autoPublishResults,
      },
      totalArticlesGenerated: sqliteSuccess.length + autoPublishSuccess.length,
      duration: `${((Date.now() - startTime) / 1000).toFixed(1)}s`,
    });
  } catch (error) {
    console.error('Cron generate error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during article generation',
        duration: `${((Date.now() - startTime) / 1000).toFixed(1)}s`,
      },
      { status: 500 },
    );
  }
}

// Also support POST for manual triggering
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { limit = 3, forceRegenerate = false } = body as { limit?: number; forceRegenerate?: boolean };

    const startTime = Date.now();
    const trends = getTrendsForArticleGeneration(limit);

    if (trends.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No trends eligible for article generation',
        articlesGenerated: 0,
        duration: `${((Date.now() - startTime) / 1000).toFixed(1)}s`,
      });
    }

    const results = await batchGenerateArticles(trends);
    const successful = results.filter(r => r.success);

    return NextResponse.json({
      success: true,
      message: `Generated ${successful.length} article(s) from ${trends.length} trend(s)`,
      articlesGenerated: successful.length,
      results: results.map(r => ({
        slug: r.slug,
        title: r.title,
        success: r.success,
        wordCount: r.wordCount,
        error: r.error,
      })),
      duration: `${((Date.now() - startTime) / 1000).toFixed(1)}s`,
    });
  } catch (error) {
    console.error('Manual generate error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
