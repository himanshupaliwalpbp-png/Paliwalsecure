import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-auth';

/**
 * GET /api/admin/notifications
 *
 * Returns the latest notifications + unread counts for the admin dashboard.
 * The frontend polls this every 30 seconds; new items trigger a notification
 * bell + ringtone (see /components/admin/AdminNotificationCenter).
 */
export async function GET(request: NextRequest) {
  const admin = requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50);

  try {
    const { db } = await import('@/lib/db');

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const [newLeadsToday, pendingCallbacks, newReviewsToday, expiringPolicies7d, expiringPolicies30d] = await Promise.all([
      db.lead.count({ where: { createdAt: { gte: todayStart } } }).catch(() => 0),
      db.callbackRequest.count({ where: { status: 'PENDING' } }).catch(() => 0),
      db.review.count({ where: { createdAt: { gte: todayStart }, status: 'PENDING' } }).catch(() => 0),
      db.insurancePolicy.count({
        where: { odEndDate: { gte: now, lte: sevenDaysLater }, status: 'ACTIVE' }
      }).catch(() => 0),
      db.insurancePolicy.count({
        where: { odEndDate: { gte: now, lte: thirtyDaysLater }, status: 'ACTIVE' }
      }).catch(() => 0),
    ]);

    type Notification = {
      id: string;
      type: 'lead' | 'callback' | 'review' | 'policy' | 'system';
      title: string;
      message: string;
      severity: 'info' | 'warning' | 'success' | 'critical';
      createdAt: string;
      link?: string;
    };

    const notifications: Notification[] = [];

    try {
      const recentLeads = await db.lead.findMany({
        where: { createdAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });
      for (const lead of recentLeads) {
        const nameMasked = lead.name ? (lead.name.slice(0, 1) + '***') : 'Unknown';
        notifications.push({
          id: `lead-${lead.id}`,
          type: 'lead',
          title: 'New Lead Received',
          message: `${nameMasked} from ${lead.city || 'Unknown'} — ${lead.insuranceType || 'Insurance'}`,
          severity: 'success',
          createdAt: lead.createdAt.toISOString(),
          link: '/admin/dashboard/leads',
        });
      }
    } catch { /* ignore */ }

    try {
      const callbacks = await db.callbackRequest.findMany({
        where: { status: 'PENDING', createdAt: { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });
      for (const cb of callbacks) {
        notifications.push({
          id: `callback-${cb.id}`,
          type: 'callback',
          title: 'Callback Request Pending',
          message: `Preferred time: ${cb.preferredTime} — awaiting call`,
          severity: 'warning',
          createdAt: cb.createdAt.toISOString(),
          link: '/admin/dashboard/callbacks',
        });
      }
    } catch { /* ignore */ }

    try {
      const reviews = await db.review.findMany({
        where: { status: 'PENDING' },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });
      for (const review of reviews) {
        notifications.push({
          id: `review-${review.id}`,
          type: 'review',
          title: 'New Review Awaiting Approval',
          message: `Rating: ${review.rating}/5 — needs moderation`,
          severity: 'info',
          createdAt: review.createdAt.toISOString(),
          link: '/admin/dashboard/reviews',
        });
      }
    } catch { /* ignore */ }

    if (expiringPolicies7d > 0) {
      notifications.push({
        id: `policy-expiry-7d-${now.toISOString().slice(0, 10)}`,
        type: 'policy',
        title: `${expiringPolicies7d} Polic${expiringPolicies7d === 1 ? 'y' : 'ies'} Expiring Within 7 Days`,
        message: 'Renewal window closing — contact client immediately',
        severity: 'critical',
        createdAt: now.toISOString(),
        link: '/admin/dashboard',
      });
    } else if (expiringPolicies30d > 0) {
      notifications.push({
        id: `policy-expiry-30d-${now.toISOString().slice(0, 10)}`,
        type: 'policy',
        title: `${expiringPolicies30d} Policies Expiring Within 30 Days`,
        message: 'Plan renewal outreach recommended',
        severity: 'warning',
        createdAt: now.toISOString(),
        link: '/admin/dashboard',
      });
    }

    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const finalList = notifications.slice(0, limit);

    return NextResponse.json({
      success: true,
      unread: finalList.length,
      notifications: finalList,
      stats: {
        newLeadsToday,
        pendingCallbacks,
        newReviewsToday,
        expiringPolicies7d,
        expiringPolicies30d,
      },
    });
  } catch (error) {
    console.error('[NOTIFICATIONS_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
