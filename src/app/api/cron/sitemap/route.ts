// ============================================================================
// Paliwal Secure — Cron: Weekly Sitemap Regeneration
// Triggers sitemap rebuild via on-demand revalidation
// Called by Vercel Cron at midnight every Sunday
// ============================================================================

import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const startTime = Date.now();

  try {
    // Revalidate the sitemap and related pages
    const pathsToRevalidate = [
      '/sitemap.xml',
      '/',
      '/blog',
      '/health-insurance',
      '/car-insurance',
      '/life-insurance',
      '/bike-insurance',
      '/travel-insurance',
      '/home-insurance',
      '/claim-guide',
      '/insurance-faq',
      '/insurance-glossary',
    ];

    let revalidatedCount = 0;
    const errors: { path: string; error: string }[] = [];

    for (const path of pathsToRevalidate) {
      try {
        revalidatePath(path);
        revalidatedCount++;
      } catch (err) {
        errors.push({
          path,
          error: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    // Also revalidate hub pages
    const hubPaths = [
      '/hub/health-insurance',
      '/hub/motor-insurance',
      '/hub/claims',
    ];

    for (const path of hubPaths) {
      try {
        revalidatePath(path);
        revalidatedCount++;
      } catch (err) {
        errors.push({
          path,
          error: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      message: `Sitemap regeneration complete. Revalidated ${revalidatedCount} path(s).`,
      revalidatedCount,
      errors: errors.length > 0 ? errors : undefined,
      duration: `${((Date.now() - startTime) / 1000).toFixed(1)}s`,
    });
  } catch (error) {
    console.error('Cron sitemap error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during sitemap regeneration',
        duration: `${((Date.now() - startTime) / 1000).toFixed(1)}s`,
      },
      { status: 500 },
    );
  }
}

// POST for manual trigger
export async function POST() {
  return GET();
}
