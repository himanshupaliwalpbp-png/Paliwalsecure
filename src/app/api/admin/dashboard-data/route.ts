import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-auth';
import { isDbAvailable, getDemoDashboardData } from '@/lib/db-status';

/**
 * GET /api/admin/dashboard-data
 *
 * Single endpoint that returns everything the dashboard needs:
 *   - metrics (stat cards)
 *   - recentLeads
 *   - recentCallbacks
 *   - leadsByDay (for chart)
 *   - leadsByInsuranceType (for chart)
 *   - recentActivity (audit log)
 *   - dbConnected (flag — false means demo mode)
 *
 * When DB is not connected, returns demo data with `dbConnected: false`.
 */
export async function GET(request: NextRequest) {
  const admin = requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const dbAvailable = await isDbAvailable();
    if (!dbAvailable) {
      return NextResponse.json({
        success: true,
        ...getDemoDashboardData(),
        dbConnected: false,
      });
    }

    const { db } = await import('@/lib/db');
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // ── Parallel fetches ───────────────────────────────────────────────────
    const [newLeadsToday, pendingCallbacks, pendingReviews, approvedReviews, expiring7d, expiring30d, totalClients, activePolicies, recentLeads, recentCallbacks, recentActivity, allLeadsLast14d] = await Promise.all([
      db.lead.count({ where: { createdAt: { gte: todayStart } } }).catch(() => 0),
      db.callbackRequest.count({ where: { status: 'PENDING' } }).catch(() => 0),
      db.review.count({ where: { status: 'PENDING' } }).catch(() => 0),
      db.review.count({ where: { status: 'APPROVED' } }).catch(() => 0),
      db.insurancePolicy.count({ where: { odEndDate: { gte: now, lte: sevenDaysLater }, status: 'ACTIVE' } }).catch(() => 0),
      db.insurancePolicy.count({ where: { odEndDate: { gte: now, lte: thirtyDaysLater }, status: 'ACTIVE' } }).catch(() => 0),
      db.insuranceClient.count().catch(() => 0),
      db.insurancePolicy.count({ where: { status: 'ACTIVE' } }).catch(() => 0),
      db.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 10, select: { id: true, name: true, phone: true, city: true, insuranceType: true, status: true, createdAt: true } }).catch(() => []),
      db.callbackRequest.findMany({ where: { status: 'PENDING' }, orderBy: { createdAt: 'desc' }, take: 5 }).catch(() => []),
      db.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 10, select: { id: true, action: true, entity: true, details: true, createdAt: true, userId: true } }).catch(() => []),
      db.lead.findMany({ where: { createdAt: { gte: fourteenDaysAgo } }, select: { insuranceType: true, createdAt: true } }).catch(() => []),
    ]);

    // ── Calculate avg rating ───────────────────────────────────────────────
    let avgRating = 0;
    try {
      const reviews = await db.review.findMany({ where: { status: 'APPROVED' }, select: { rating: true } });
      if (reviews.length > 0) {
        avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
      }
    } catch { /* ignore */ }

    // ── Build leads-by-day chart data ──────────────────────────────────────
    const dayMap: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dayMap[d.toISOString().slice(0, 10)] = 0;
    }
    for (const l of allLeadsLast14d) {
      const d = l.createdAt?.toISOString().slice(0, 10);
      if (d && d in dayMap) dayMap[d]++;
    }
    const leadsByDay = Object.entries(dayMap).map(([date, count]) => ({ date, count }));

    // ── Build leads by insurance type ──────────────────────────────────────
    const typeMap: Record<string, number> = {};
    for (const l of allLeadsLast14d) {
      const t = l.insuranceType || 'Other';
      typeMap[t] = (typeMap[t] || 0) + 1;
    }
    const leadsByInsuranceType = Object.entries(typeMap)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // ── Mask PII in recentLeads ────────────────────────────────────────────
    const maskedLeads = recentLeads.map(l => ({
      ...l,
      name: l.name ? (l.name.slice(0, 1) + '***' + (l.name.length > 1 ? l.name.slice(-1) : '')) : 'Unknown',
      phone: l.phone ? (l.phone.slice(0, 4) + '****' + l.phone.slice(-2)) : '****',
    }));

    // ── Mask PII in callbacks ──────────────────────────────────────────────
    const maskedCallbacks = recentCallbacks.map(c => ({
      ...c,
      name: c.name ? (c.name.slice(0, 1) + '***' + (c.name.length > 1 ? c.name.slice(-1) : '')) : 'Unknown',
      mobile: c.mobile ? (c.mobile.slice(0, 4) + '****' + c.mobile.slice(-2)) : '****',
    }));

    // ── Format activity ────────────────────────────────────────────────────
    const formattedActivity = recentActivity.map(a => ({
      id: a.id,
      action: a.action,
      entity: a.entity,
      details: a.details || '',
      createdAt: a.createdAt instanceof Date ? a.createdAt.toISOString() : String(a.createdAt),
      userName: a.userId || undefined,
    }));

    // ── Total leads count ──────────────────────────────────────────────────
    const totalLeads = await db.lead.count().catch(() => 0);

    return NextResponse.json({
      success: true,
      metrics: {
        totalLeads,
        newLeadsToday,
        pendingCallbacks,
        pendingReviews,
        approvedReviews,
        avgRating,
        activePolicies,
        expiring7d,
        expiring30d,
        totalClients,
      },
      recentLeads: maskedLeads,
      recentCallbacks: maskedCallbacks,
      leadsByDay,
      leadsByInsuranceType,
      recentActivity: formattedActivity,
      dbConnected: true,
    });
  } catch (error) {
    console.error('[DASHBOARD_DATA_ERROR]', error);
    // Fallback to demo data
    return NextResponse.json({
      success: true,
      ...getDemoDashboardData(),
      dbConnected: false,
    });
  }
}
