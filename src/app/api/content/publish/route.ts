// ============================================================================
// Paliwal Secure — Publish Article API
// Changes article status from "draft" to "published", sets publishedAt
// Triggers revalidation for the blog page
// ============================================================================

import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug } = body as { slug?: string };

    if (!slug) {
      return NextResponse.json(
        { error: 'Article slug is required' },
        { status: 400 },
      );
    }

    // Find the article
    const article = await db.generatedArticle.findUnique({
      where: { slug },
    });

    if (!article) {
      return NextResponse.json(
        { error: `Article with slug "${slug}" not found` },
        { status: 404 },
      );
    }

    if (article.status === 'published') {
      return NextResponse.json(
        { message: 'Article is already published', article: { slug: article.slug, status: article.status, publishedAt: article.publishedAt } },
        { status: 200 },
      );
    }

    // Update status to published
    const updatedArticle = await db.generatedArticle.update({
      where: { slug },
      data: {
        status: 'published',
        publishedAt: new Date(),
      },
    });

    // Trigger revalidation for the blog pages
    try {
      revalidatePath('/blog');
      revalidatePath(`/blog/${slug}`);
      revalidatePath('/');
    } catch (revalError) {
      console.error('Revalidation error (non-fatal):', revalError);
    }

    return NextResponse.json({
      success: true,
      message: `Article "${slug}" published successfully`,
      article: {
        id: updatedArticle.id,
        slug: updatedArticle.slug,
        title: updatedArticle.title,
        status: updatedArticle.status,
        publishedAt: updatedArticle.publishedAt,
      },
    });
  } catch (error) {
    console.error('Publish article error:', error);
    return NextResponse.json(
      { error: 'Failed to publish article' },
      { status: 500 },
    );
  }
}
