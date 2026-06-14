// ============================================================================
// Trend Detection API Endpoint
// GET: Returns current trends from database + static fallback
// POST: Triggers trend detection and saves to database
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { detectTrends, getTrendsForArticleGeneration, type ScoredTrend } from '@/lib/trends';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const category = searchParams.get('category');
    const trending = searchParams.get('trending');
    const forArticle = searchParams.get('forArticle') === 'true';

    // If requesting trends for article generation
    if (forArticle) {
      const trends = getTrendsForArticleGeneration(limit);
      return NextResponse.json({
        success: true,
        trends,
        count: trends.length,
        source: 'static',
      });
    }

    // Try to get trends from database first
    let dbTrends = await db.trendTopic.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(trending === 'true' ? { isTrending: true } : {}),
      },
      orderBy: { priorityScore: 'desc' },
      take: limit,
    });

    // If database is empty, use static trends
    if (dbTrends.length === 0) {
      const staticTrends = detectTrends();
      const filteredTrends = staticTrends
        .filter((t) => !category || t.category === category)
        .filter((t) => trending !== 'true' || t.isTrending)
        .slice(0, limit);

      return NextResponse.json({
        success: true,
        trends: filteredTrends.map((t) => ({
          ...t,
          id: undefined,
          detectedAt: new Date().toISOString(),
          source: t.source || 'static',
        })),
        count: filteredTrends.length,
        source: 'static',
      });
    }

    return NextResponse.json({
      success: true,
      trends: dbTrends.map((t) => ({
        id: t.id,
        title: t.title,
        slug: t.slug,
        source: t.source,
        sourceUrl: t.sourceUrl,
        category: t.category,
        tags: JSON.parse(t.tags),
        priorityScore: t.priorityScore,
        searchVolume: t.searchVolume,
        isTrending: t.isTrending,
        articleCreated: t.articleCreated,
        detectedAt: t.detectedAt,
        expiresAt: t.expiresAt,
      })),
      count: dbTrends.length,
      source: 'database',
    });
  } catch (error) {
    console.error('Trend detection GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trends' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { saveToDb = true, limit = 20 } = body;

    // Detect trends using the engine
    const trends = detectTrends();

    // Optionally save to database
    let savedCount = 0;
    if (saveToDb) {
      for (const trend of trends.slice(0, limit)) {
        try {
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
              expiresAt: trend.expiresAt,
            },
            update: {
              title: trend.title,
              source: trend.source || 'manual',
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
        } catch (dbError) {
          console.error(`Failed to save trend "${trend.slug}":`, dbError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      detected: trends.length,
      saved: savedCount,
      trends: trends.slice(0, limit).map((t) => ({
        title: t.title,
        slug: t.slug,
        category: t.category,
        tags: t.tags,
        priorityScore: t.priorityScore,
        isTrending: t.isTrending,
        searchVolume: t.searchVolume,
      })),
    });
  } catch (error) {
    console.error('Trend detection POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to detect trends' },
      { status: 500 }
    );
  }
}
