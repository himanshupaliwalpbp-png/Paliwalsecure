// ============================================================================
// Paliwal Secure — Single Article API (Neon PostgreSQL via @neondatabase/serverless)
// GET: Fetch a single article by slug, increment view count
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  isNeonAvailable,
  fetchArticleBySlug,
  incrementArticleViews,
} from '@/lib/neon-db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    if (!isNeonAvailable()) {
      return NextResponse.json(
        { error: 'Neon database is not configured. Set DATABASE_URL_NEON environment variable.' },
        { status: 503 }
      );
    }

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    // Find article by slug
    const article = await fetchArticleBySlug(slug);

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found', slug },
        { status: 404 }
      );
    }

    // Increment view count (non-blocking — fire and forget)
    incrementArticleViews(article.id).catch((err: unknown) => {
      console.error('[api/articles/[slug]] Failed to increment view count:', err);
    });

    // Parse JSON-LD if it's a string
    let jsonLd: Record<string, unknown> | string | null = null;
    if (article.json_ld) {
      try {
        jsonLd = JSON.parse(article.json_ld as string);
      } catch {
        jsonLd = article.json_ld as string;
      }
    }

    return NextResponse.json({
      success: true,
      article: {
        id: article.id,
        slug: article.slug,
        title: article.title,
        seoTitle: article.seo_title,
        seoDescription: article.seo_description,
        content: article.content,
        jsonLd,
        metaKeywords: article.meta_keywords,
        category: article.category,
        trendId: article.trend_id,
        status: article.status,
        publishedAt: article.published_at
          ? (typeof article.published_at === 'string' ? article.published_at : new Date(article.published_at).toISOString())
          : null,
        views: article.views + 1, // Return incremented count
        createdAt: typeof article.created_at === 'string' ? article.created_at : new Date(article.created_at).toISOString(),
      },
    });
  } catch (error) {
    console.error('[api/articles/[slug]] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}
