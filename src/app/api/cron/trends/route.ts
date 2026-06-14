// ============================================================================
// Cron Endpoint for Trend Detection
// GET/POST: Runs trend detection and optionally generates articles
// Designed for Vercel Cron Jobs or external schedulers
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { detectTrends, getTrendsForArticleGeneration, type ScoredTrend } from '@/lib/trends';
import { generateArticle } from '@/lib/article-generator';

export async function GET(request: NextRequest) {
  return runCronJob(request);
}

export async function POST(request: NextRequest) {
  return runCronJob(request);
}

async function runCronJob(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { searchParams } = new URL(request.url);
    const generateArticles = searchParams.get('generate') === 'true';
    const articleLimit = parseInt(searchParams.get('articleLimit') || '3', 10);
    const saveToDb = searchParams.get('save') !== 'false';

    console.log('[CRON] Starting trend detection cron job...');

    // Step 1: Detect trends
    const trends = detectTrends();
    console.log(`[CRON] Detected ${trends.length} trends`);

    // Step 2: Save to database
    let savedCount = 0;
    let updatedCount = 0;

    if (saveToDb) {
      for (const trend of trends) {
        try {
          const existing = await db.trendTopic.findUnique({ where: { slug: trend.slug } });
          if (existing) {
            await db.trendTopic.update({
              where: { slug: trend.slug },
              data: {
                title: trend.title,
                category: trend.category,
                tags: JSON.stringify(trend.tags),
                priorityScore: trend.priorityScore,
                searchVolume: trend.searchVolume,
                isTrending: trend.isTrending,
                expiresAt: trend.expiresAt,
              },
            });
            updatedCount++;
          } else {
            await db.trendTopic.create({
              data: {
                title: trend.title,
                slug: trend.slug,
                source: trend.source || 'cron',
                sourceUrl: trend.sourceUrl,
                category: trend.category,
                tags: JSON.stringify(trend.tags),
                priorityScore: trend.priorityScore,
                searchVolume: trend.searchVolume,
                isTrending: trend.isTrending,
                expiresAt: trend.expiresAt,
              },
            });
            savedCount++;
          }
        } catch (dbError) {
          console.error(`[CRON] DB error for trend "${trend.slug}":`, dbError);
        }
      }
    }

    console.log(`[CRON] Saved ${savedCount} new trends, updated ${updatedCount} existing`);

    // Step 3: Generate articles if requested
    let articlesGenerated = 0;
    let articlesFailed = 0;
    const articleResults: Array<{ slug: string; title: string; success: boolean; error?: string }> = [];

    if (generateArticles) {
      const trendsForArticles = getTrendsForArticleGeneration(articleLimit);

      // Filter out trends that already have articles
      const existingArticles = await db.generatedArticle.findMany({
        where: { sourceTrendId: { in: trendsForArticles.map((t) => t.slug) } },
        select: { sourceTrendId: true },
      });
      const existingSlugs = new Set(existingArticles.map((a) => a.sourceTrendId));
      const newTrends = trendsForArticles.filter((t) => !existingSlugs.has(t.slug));

      console.log(`[CRON] Generating articles for ${newTrends.length} trends`);

      for (const trend of newTrends) {
        try {
          const result = await generateArticle(trend);
          if (result.success) {
            articlesGenerated++;
            articleResults.push({
              slug: result.slug || trend.slug,
              title: result.title || trend.title,
              success: true,
            });
          } else {
            articlesFailed++;
            articleResults.push({
              slug: trend.slug,
              title: trend.title,
              success: false,
              error: result.error,
            });
          }

          // Delay between LLM calls
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } catch (error) {
          articlesFailed++;
          articleResults.push({
            slug: trend.slug,
            title: trend.title,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }
    }

    const duration = Date.now() - startTime;
    console.log(`[CRON] Completed in ${duration}ms`);

    return NextResponse.json({
      success: true,
      cronJob: 'trend-detection',
      duration: `${duration}ms`,
      trends: {
        detected: trends.length,
        saved: savedCount,
        updated: updatedCount,
      },
      articles: generateArticles ? {
        attempted: articleResults.length,
        generated: articlesGenerated,
        failed: articlesFailed,
        results: articleResults,
      } : undefined,
      nextRun: 'Scheduled by Vercel Cron or external scheduler',
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('[CRON] Error:', error);
    return NextResponse.json(
      {
        success: false,
        cronJob: 'trend-detection',
        duration: `${duration}ms`,
        error: error instanceof Error ? error.message : 'Unknown cron error',
      },
      { status: 500 }
    );
  }
}
