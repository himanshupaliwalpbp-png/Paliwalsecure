// ============================================================================
// Paliwal Secure — Single Trend API (Neon PostgreSQL via @neondatabase/serverless)
// GET:   Fetch a single trend by ID
// PATCH: Update a trend (mark as processed, etc.)
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  isNeonAvailable,
  fetchTrendById,
  updateTrend,
} from '@/lib/neon-db';

// ── Helper: Format trend for response ──────────────────────────────────────

function formatTrend(trend: NonNullable<Awaited<ReturnType<typeof fetchTrendById>>>) {
  return {
    id: trend.id,
    title: trend.title,
    description: trend.description,
    category: trend.category,
    source: trend.source,
    sourceUrl: trend.source_url,
    triggerDate: typeof trend.trigger_date === 'string' ? trend.trigger_date : new Date(trend.trigger_date).toISOString(),
    processed: trend.processed,
    createdAt: typeof trend.created_at === 'string' ? trend.created_at : new Date(trend.created_at).toISOString(),
  };
}

// ── PATCH: Update a trend ──────────────────────────────────────────────────

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isNeonAvailable()) {
      return NextResponse.json(
        { error: 'Neon database is not configured. Set DATABASE_URL_NEON environment variable.' },
        { status: 503 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Trend ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { processed, title, description, category, source, sourceUrl } = body as {
      processed?: boolean;
      title?: string;
      description?: string;
      category?: string;
      source?: string;
      sourceUrl?: string;
    };

    // Check if trend exists
    const existingTrend = await fetchTrendById(id);

    if (!existingTrend) {
      return NextResponse.json(
        { error: 'Trend not found', id },
        { status: 404 }
      );
    }

    // Update the trend
    const updatedTrend = await updateTrend(id, {
      processed,
      title,
      description,
      category,
      source,
      sourceUrl,
    });

    if (!updatedTrend) {
      return NextResponse.json(
        { error: 'Failed to update trend' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      trend: formatTrend(updatedTrend),
    });
  } catch (error) {
    console.error('[api/trends/[id]] PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to update trend' },
      { status: 500 }
    );
  }
}

// ── GET: Fetch a single trend by ID ────────────────────────────────────────

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isNeonAvailable()) {
      return NextResponse.json(
        { error: 'Neon database is not configured. Set DATABASE_URL_NEON environment variable.' },
        { status: 503 }
      );
    }

    const { id } = await params;

    const trend = await fetchTrendById(id);

    if (!trend) {
      return NextResponse.json(
        { error: 'Trend not found', id },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      trend: formatTrend(trend),
    });
  } catch (error) {
    console.error('[api/trends/[id]] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trend' },
      { status: 500 }
    );
  }
}
