// ============================================================================
// Paliwal Secure — Trends API (Neon PostgreSQL via @neondatabase/serverless)
// GET:  Fetch trends (with optional filter for processed/unprocessed)
// POST: Add a new trend (e.g., new vehicle launch, IRDAI regulation change)
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  isNeonAvailable,
  fetchTrends,
  createTrend,
} from '@/lib/neon-db';

// ── GET: Fetch trends with filtering ───────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    if (!isNeonAvailable()) {
      return NextResponse.json(
        {
          error: 'Neon database is not configured. Set DATABASE_URL_NEON environment variable.',
          trends: [],
          total: 0,
        },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const processed = searchParams.get('processed');
    const category = searchParams.get('category');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);
    const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0);

    // Build filter options
    const options: Parameters<typeof fetchTrends>[0] = { limit, offset };

    if (processed !== null && processed !== undefined && processed !== '') {
      options.processed = processed === 'true';
    }

    if (category) {
      options.category = category;
    }

    // Fetch trends using helper
    const { trends, total } = await fetchTrends(options);

    return NextResponse.json({
      success: true,
      trends: trends.map((trend) => ({
        id: trend.id,
        title: trend.title,
        description: trend.description,
        category: trend.category,
        source: trend.source,
        sourceUrl: trend.source_url,
        triggerDate: typeof trend.trigger_date === 'string' ? trend.trigger_date : new Date(trend.trigger_date).toISOString(),
        processed: trend.processed,
        createdAt: typeof trend.created_at === 'string' ? trend.created_at : new Date(trend.created_at).toISOString(),
      })),
      total,
      limit,
      offset,
      hasMore: offset + trends.length < total,
    });
  } catch (error) {
    console.error('[api/trends] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trends', trends: [], total: 0 },
      { status: 500 }
    );
  }
}

// ── POST: Create a new trend ───────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    if (!isNeonAvailable()) {
      return NextResponse.json(
        { error: 'Neon database is not configured. Set DATABASE_URL_NEON environment variable.' },
        { status: 503 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const { title, description, category, source, sourceUrl } = body as {
      title?: string;
      description?: string;
      category?: string;
      source?: string;
      sourceUrl?: string;
    };

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      );
    }

    // Validate category against known categories
    const validCategories = [
      'vehicle-launch',
      'irdai-update',
      'health-insurance',
      'motor-insurance',
      'life-insurance',
      'claim-guide',
      'news',
      'ev-launch',
      'term-insurance',
      'travel-insurance',
      'home-insurance',
      'general',
    ];

    if (!validCategories.includes(category)) {
      return NextResponse.json(
        {
          error: `Invalid category. Must be one of: ${validCategories.join(', ')}`,
          validCategories,
        },
        { status: 400 }
      );
    }

    // Create the trend
    const trend = await createTrend({
      title,
      description: description || null,
      category,
      source: source || null,
      sourceUrl: sourceUrl || null,
    });

    if (!trend) {
      return NextResponse.json(
        { error: 'Failed to create trend in database' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        trend: {
          id: trend.id,
          title: trend.title,
          description: trend.description,
          category: trend.category,
          source: trend.source,
          sourceUrl: trend.source_url,
          triggerDate: typeof trend.trigger_date === 'string' ? trend.trigger_date : new Date(trend.trigger_date).toISOString(),
          processed: trend.processed,
          createdAt: typeof trend.created_at === 'string' ? trend.created_at : new Date(trend.created_at).toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[api/trends] POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create trend' },
      { status: 500 }
    );
  }
}
