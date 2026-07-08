// ============================================================================
// Paliwal Secure — Cron: Auto-Publish from Trends
// Checks Neon DB for pending trends, generates articles, and publishes them
// Called by Vercel Cron at regular intervals (e.g., every 6 hours)
// Uses @neondatabase/serverless for direct SQL queries
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import {
  isNeonAvailable,
  fetchUnprocessedTrends,
  createArticle,
  markTrendAsProcessed,
  createInternalLink,
  updateArticleStatus,
  fetchArticleBySlug,
} from '@/lib/neon-db';
import {
  generateAutoArticle,
  inferTemplateType,
  inferCategory,
  type AutoArticleInput,
  type GeneratedMarkdownArticle,
} from '@/lib/auto-article-generator';
import { blogPosts, type BlogPostSummary } from '@/lib/blog-data';
import { verifyCronSecret, unauthorizedCronResponse } from "@/lib/cron-auth";

export const maxDuration = 60;

// ── Helper: Write markdown file ────────────────────────────────────────────

async function writeMarkdownFile(slug: string, markdown: string): Promise<string> {
  const contentDir = path.join(process.cwd(), 'content', 'blog');
  if (!existsSync(contentDir)) {
    await mkdir(contentDir, { recursive: true });
  }
  const filePath = path.join(contentDir, `${slug}.md`);
  await writeFile(filePath, markdown, 'utf-8');
  return filePath;
}

// ── Helper: Update blog-data.ts ─────────────────────────────────────────────

async function updateBlogData(article: GeneratedMarkdownArticle): Promise<boolean> {
  try {
    const blogDataPath = path.join(process.cwd(), 'src', 'lib', 'blog-data.ts');
    if (!existsSync(blogDataPath)) return false;

    const { readFileSync, writeFileSync } = await import('fs');
    const content = readFileSync(blogDataPath, 'utf-8');

    // Check if slug already exists
    if (content.includes(`slug: "${article.slug}"`)) {
      return true;
    }

    const newEntry: BlogPostSummary = {
      slug: article.slug,
      title: article.title,
      titleHindi: article.title,
      titleHinglish: article.title,
      excerpt: (article.frontmatter.description as string) || article.title,
      excerptHindi: (article.frontmatter.description as string) || article.title,
      excerptHinglish: (article.frontmatter.description as string) || article.title,
      category: article.category,
      categoryHindi: article.categoryHindi,
      readTime: article.readTime,
      author: (article.frontmatter.author as string) || 'Himanshu Paliwal',
      date: (article.frontmatter.date as string) || new Date().toISOString().split('T')[0],
      keywords: article.keywords,
    };

    const esc = (s: string) => s.replace(/"/g, '\\"');
    const entryStr = `  {
    slug: "${newEntry.slug}",
    title: "${esc(newEntry.title)}",
    titleHindi: "${esc(newEntry.titleHindi)}",
    titleHinglish: "${esc(newEntry.titleHinglish)}",
    excerpt: "${esc(newEntry.excerpt)}",
    excerptHindi: "${esc(newEntry.excerptHindi)}",
    excerptHinglish: "${esc(newEntry.excerptHinglish)}",
    category: "${newEntry.category}",
    categoryHindi: "${newEntry.categoryHindi}",
    readTime: "${newEntry.readTime}",
    author: "${newEntry.author}",
    date: "${newEntry.date}",
    keywords: ${JSON.stringify(newEntry.keywords)},
  },`;

    const blogPostsStart = content.indexOf('export const blogPosts');
    if (blogPostsStart === -1) return false;

    const closingIndex = content.indexOf('\n];', blogPostsStart);
    if (closingIndex === -1) return false;

    const updatedContent =
      content.slice(0, closingIndex) +
      '\n' + entryStr + '\n' +
      content.slice(closingIndex);
    writeFileSync(blogDataPath, updatedContent, 'utf-8');
    return true;
  } catch (error) {
    console.error('[cron/auto-publish] Error updating blog-data.ts:', error);
    return false;
  }
}

// ── Process a single trend ─────────────────────────────────────────────────

interface ProcessedTrendResult {
  trendId: string;
  trendTitle: string;
  success: boolean;
  slug?: string;
  wordCount?: number;
  readTime?: string;
  complianceIssues?: string[];
  error?: string;
}

async function processTrend(trend: {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  source?: string | null;
  source_url?: string | null;
}): Promise<ProcessedTrendResult> {
  try {
    // Build article input from trend data
    const keywords = trend.title
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3)
      .slice(0, 6);

    const templateType = inferTemplateType(trend.category, keywords);
    const { category, categoryHindi } = inferCategory(templateType, keywords);

    const articleInput: AutoArticleInput = {
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
      description: trend.description || `Complete guide about ${trend.title} - coverage, premiums, and tips for Indian policyholders.`,
      keywords,
      trendData: {
        source: trend.source || undefined,
        sourceUrl: trend.source_url || undefined,
        summary: trend.description || undefined,
      },
    };

    // Generate the article
    const article = generateAutoArticle(articleInput);

    // Write markdown file
    await writeMarkdownFile(article.slug, article.markdown);

    // Update blog-data.ts
    await updateBlogData(article);

    // Save to Neon DB using helper functions
    let neonArticleId: string | null = null;
    if (isNeonAvailable()) {
      // Create article in Neon DB — draft status, then publish if compliant
      const articleStatus = article.complianceIssues.length === 0 ? 'published' : 'draft';
      const dbArticle = await createArticle({
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

      if (dbArticle) {
        neonArticleId = dbArticle.id;

        // Create internal links
        for (const link of article.internalLinks.slice(0, 5)) {
          try {
            const targetSlug = link.replace('/blog/', '');
            const targetArticle = await fetchArticleBySlug(targetSlug);
            if (targetArticle) {
              await createInternalLink({
                fromArticleId: dbArticle.id,
                toArticleId: targetArticle.id,
                score: 1.0,
              });
            }
          } catch {
            // Non-fatal
          }
        }
      }

      // Mark trend as processed
      await markTrendAsProcessed(trend.id);
    }

    // Revalidate
    try {
      revalidatePath('/blog');
      revalidatePath(`/blog/${article.slug}`);
      revalidatePath('/');
    } catch {
      // Non-fatal
    }

    return {
      trendId: trend.id,
      trendTitle: trend.title,
      success: true,
      slug: article.slug,
      wordCount: article.wordCount,
      readTime: article.readTime,
      complianceIssues: article.complianceIssues,
    };
  } catch (error) {
    console.error(`[cron/auto-publish] Error processing trend "${trend.title}":`, error);
    return {
      trendId: trend.id,
      trendTitle: trend.title,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ── GET: Cron endpoint (called by Vercel Cron) ─────────────────────────────

export async function GET(request: NextRequest) {
    // ── CRON AUTH ───────────────────────────────────────────────────────────
    if (!verifyCronSecret(request)) {
      return unauthorizedCronResponse();
    }

  const startTime = Date.now();

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    const dryRun = searchParams.get('dryRun') === 'true';

    console.log('[cron/auto-publish] Starting auto-publish cron job...');

    if (!isNeonAvailable()) {
      return NextResponse.json({
        success: false,
        message: 'DATABASE_URL_NEON is not configured. Auto-publish requires Neon database.',
        neonAvailable: false,
        duration: `${Date.now() - startTime}ms`,
      });
    }

    // Step 1: Fetch unprocessed trends from Neon DB
    const pendingTrends = await fetchUnprocessedTrends(limit);

    if (pendingTrends.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No pending trends found for auto-publishing',
        articlesGenerated: 0,
        neonAvailable: true,
        duration: `${Date.now() - startTime}ms`,
      });
    }

    console.log(`[cron/auto-publish] Found ${pendingTrends.length} pending trends`);

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
          triggerDate: typeof t.trigger_date === 'string' ? t.trigger_date : new Date(t.trigger_date).toISOString(),
        })),
        duration: `${Date.now() - startTime}ms`,
      });
    }

    // Step 3: Process each trend
    const results: ProcessedTrendResult[] = [];
    for (let i = 0; i < pendingTrends.length; i++) {
      const trend = pendingTrends[i];
      const result = await processTrend(trend);
      results.push(result);

      // Delay between trend processing
      if (i < pendingTrends.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    console.log(`[cron/auto-publish] Completed: ${successful.length} published, ${failed.length} failed`);

    return NextResponse.json({
      success: true,
      message: `Auto-published ${successful.length} article(s) from ${pendingTrends.length} trend(s)`,
      articlesGenerated: successful.length,
      articlesFailed: failed.length,
      neonAvailable: true,
      results: results.map((r) => ({
        trendId: r.trendId,
        trendTitle: r.trendTitle,
        success: r.success,
        slug: r.slug,
        wordCount: r.wordCount,
        readTime: r.readTime,
        complianceIssues: r.complianceIssues,
        error: r.error,
      })),
      duration: `${Date.now() - startTime}ms`,
    });
  } catch (error) {
    console.error('[cron/auto-publish] Cron error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown cron error',
        duration: `${Date.now() - startTime}ms`,
      },
      { status: 500 },
    );
  }
}

// ── POST: Manual trigger ───────────────────────────────────────────────────

export async function POST(request: NextRequest) {
    // ── CRON AUTH ───────────────────────────────────────────────────────────
    if (!verifyCronSecret(request)) {
      return unauthorizedCronResponse();
    }

  try {
    const body = await request.json().catch(() => ({}));
    const { limit = 5, dryRun = false } = body as { limit?: number; dryRun?: boolean };

    // Reuse GET handler logic
    const url = new URL(request.url);
    url.searchParams.set('limit', String(limit));
    if (dryRun) url.searchParams.set('dryRun', 'true');

    return GET(new NextRequest(url));
  } catch (error) {
    console.error('[cron/auto-publish] POST error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
