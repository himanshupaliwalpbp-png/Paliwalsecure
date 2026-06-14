// ============================================================================
// Paliwal Secure — Articles API (Neon PostgreSQL via @neondatabase/serverless)
// GET:          Fetch articles from Neon DB (with optional status filter)
// GET ?slug=x:  Fetch single article by slug
// PATCH:        Update article status (e.g., publish a draft)
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  isNeonAvailable,
  fetchArticles,
  fetchArticleBySlug,
  updateArticleStatus,
  type NeonArticle,
} from '@/lib/neon-db';

// ── GET: Fetch articles or single article by slug ──────────────────────────

export async function GET(request: NextRequest) {
  try {
    if (!isNeonAvailable()) {
      return NextResponse.json(
        {
          error: 'Neon database is not configured. Set DATABASE_URL_NEON environment variable.',
          articles: [],
          total: 0,
        },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'published';
    const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 100);
    const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0);

    // If slug is provided, fetch single article
    if (slug) {
      const article = await fetchArticleBySlug(slug);

      if (!article) {
        return NextResponse.json(
          { error: 'Article not found', slug },
          { status: 404 }
        );
      }

      // Increment view count (non-blocking)
      const { incrementArticleViews } = await import('@/lib/neon-db');
      incrementArticleViews(article.id).catch((err: unknown) => {
        console.error('[api/articles] Failed to increment view count:', err);
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
    }

    // Otherwise fetch articles list
    const { articles, total } = await fetchArticles({
      status,
      category: category || undefined,
      limit,
      offset,
    });

    // Format response — exclude full content for list view
    const formattedArticles = articles.map((article: NeonArticle) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      seoTitle: article.seo_title,
      seoDescription: article.seo_description,
      category: article.category,
      status: article.status,
      publishedAt: article.published_at
        ? (typeof article.published_at === 'string' ? article.published_at : new Date(article.published_at).toISOString())
        : null,
      views: article.views,
      createdAt: typeof article.created_at === 'string' ? article.created_at : new Date(article.created_at).toISOString(),
    }));

    return NextResponse.json({
      success: true,
      articles: formattedArticles,
      total,
      limit,
      offset,
      hasMore: offset + articles.length < total,
    });
  } catch (error) {
    console.error('[api/articles] GET error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch articles',
        articles: [],
        total: 0,
      },
      { status: 500 }
    );
  }
}

// ── PATCH: Update article status (publish/unpublish) ───────────────────────

export async function PATCH(request: NextRequest) {
  try {
    if (!isNeonAvailable()) {
      return NextResponse.json(
        { error: 'Neon database is not configured. Set DATABASE_URL_NEON environment variable.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { id, slug, status } = body as {
      id?: string;
      slug?: string;
      status?: string;
    };

    if (!status || !['draft', 'published', 'archived'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status is required (draft, published, or archived)' },
        { status: 400 }
      );
    }

    let articleId = id;

    // If slug is provided instead of id, look up the article
    if (!articleId && slug) {
      const article = await fetchArticleBySlug(slug);
      if (!article) {
        return NextResponse.json(
          { error: 'Article not found', slug },
          { status: 404 }
        );
      }
      articleId = article.id;
    }

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article id or slug is required' },
        { status: 400 }
      );
    }

    const updatedArticle = await updateArticleStatus(articleId, status);

    if (!updatedArticle) {
      return NextResponse.json(
        { error: 'Failed to update article status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      article: {
        id: updatedArticle.id,
        slug: updatedArticle.slug,
        title: updatedArticle.title,
        status: updatedArticle.status,
        publishedAt: updatedArticle.published_at
          ? (typeof updatedArticle.published_at === 'string' ? updatedArticle.published_at : new Date(updatedArticle.published_at).toISOString())
          : null,
      },
      message: `Article status updated to "${status}"`,
    });
  } catch (error) {
    console.error('[api/articles] PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to update article status' },
      { status: 500 }
    );
  }
}
