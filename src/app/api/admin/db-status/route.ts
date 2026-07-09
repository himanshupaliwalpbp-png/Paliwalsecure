import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-auth';
import { isDbAvailable } from '@/lib/db-status';

/**
 * GET /api/admin/db-status
 *
 * Returns whether the database is connected. Used by the frontend to show
 * a "Database not connected" banner with setup instructions.
 */
export async function GET(request: NextRequest) {
  const admin = requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const dbConnected = await isDbAvailable();
  const databaseUrl = process.env.DATABASE_URL || '';
  const isPostgres = databaseUrl.startsWith('postgres');
  const isSqlite = databaseUrl.startsWith('file:');

  return NextResponse.json({
    success: true,
    dbConnected,
    databaseUrlPrefix: databaseUrl ? databaseUrl.slice(0, 20) + '...' : 'not set',
    databaseType: isPostgres ? 'postgresql' : isSqlite ? 'sqlite' : 'unknown',
    recommendation: !dbConnected
      ? 'Set up a PostgreSQL database (Neon, Vercel Postgres, or Supabase) and update DATABASE_URL environment variable. SQLite does not work on Vercel serverless.'
      : null,
  });
}
