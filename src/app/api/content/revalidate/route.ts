// ============================================================================
// Paliwal Secure — On-Demand ISR Revalidation API
// Accepts path(s) to revalidate and triggers next/cache revalidation
// ============================================================================

import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paths } = body as { paths?: string | string[] };

    if (!paths) {
      return NextResponse.json(
        { error: 'Path(s) to revalidate are required. Provide "paths" as a string or string array.' },
        { status: 400 },
      );
    }

    const pathList = Array.isArray(paths) ? paths : [paths];
    const revalidated: string[] = [];
    const errors: { path: string; error: string }[] = [];

    for (const path of pathList) {
      try {
        revalidatePath(path);
        revalidated.push(path);
      } catch (err) {
        errors.push({
          path,
          error: err instanceof Error ? err.message : 'Unknown revalidation error',
        });
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      revalidated,
      errors: errors.length > 0 ? errors : undefined,
      message: `Revalidated ${revalidated.length} path(s)${errors.length > 0 ? ` with ${errors.length} error(s)` : ''}`,
    });
  } catch (error) {
    console.error('Revalidation API error:', error);
    return NextResponse.json(
      { error: 'Failed to process revalidation request' },
      { status: 500 },
    );
  }
}
