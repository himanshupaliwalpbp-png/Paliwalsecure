'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Star,
  Users,
  FileText,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from '@/hooks/use-toast';

// ── Types ────────────────────────────────────────────────────────────────────
interface DashboardStats {
  totalReviews: number;
  pendingReviews: number;
  totalLeads: number;
  newLeads: number;
  publishedContent: number;
  avgRating: number;
}

interface ActivityItem {
  id: string;
  action: string;
  entity: string;
  details: string;
  createdAt: string;
  userName?: string;
}

// ── Stat Card Component ──────────────────────────────────────────────────────
function StatCard({
  title,
  value,
  highlight,
  highlightLabel,
  icon: Icon,
  gradient,
}: {
  title: string;
  value: number | string;
  highlight?: number | string;
  highlightLabel?: string;
  icon: React.ElementType;
  gradient: string;
}) {
  return (
    <Card className="relative overflow-hidden border-0 shadow-md">
      <div className={`absolute inset-0 ${gradient} opacity-[0.07]`} />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${gradient}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-slate-900">{value}</div>
        {highlight !== undefined && highlightLabel && (
          <p className="text-xs text-slate-500 mt-1">
            <span className="font-semibold text-amber-600">{highlight}</span>{' '}
            {highlightLabel}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ── Activity Icon ────────────────────────────────────────────────────────────
function getActivityIcon(action: string) {
  switch (action) {
    case 'APPROVE':
      return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    case 'REJECT':
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    case 'FLAG':
      return <AlertCircle className="w-4 h-4 text-orange-500" />;
    case 'CREATE':
      return <FileText className="w-4 h-4 text-blue-500" />;
    case 'UPDATE':
      return <TrendingUp className="w-4 h-4 text-amber-500" />;
    case 'DELETE':
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    default:
      return <Clock className="w-4 h-4 text-slate-400" />;
  }
}

function formatActivityDescription(item: ActivityItem): string {
  const entityMap: Record<string, string> = {
    Review: 'review',
    Lead: 'lead',
    GlossaryTerm: 'glossary term',
    Article: 'article',
    AdminUser: 'admin user',
  };
  const actionMap: Record<string, string> = {
    CREATE: 'Created',
    UPDATE: 'Updated',
    DELETE: 'Deleted',
    APPROVE: 'Approved',
    REJECT: 'Rejected',
    FLAG: 'Flagged',
    LOGIN: 'Logged in',
    LOGOUT: 'Logged out',
  };

  const entity = entityMap[item.entity] || item.entity.toLowerCase();
  const action = actionMap[item.action] || item.action;

  return `${action} a ${entity}`;
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function DashboardHomePage() {
  const router = useRouter();
  const { accessToken, user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    if (!accessToken) return;

    try {
      setLoading(true);

      // Fetch reviews stats
      const reviewsRes = await fetch('/api/admin/reviews?limit=1', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const reviewsData = await reviewsRes.json();

      // Fetch pending reviews count
      const pendingRes = await fetch('/api/admin/reviews?status=pending&limit=1', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const pendingData = await pendingRes.json();

      // Fetch leads stats
      const leadsRes = await fetch('/api/admin/leads?limit=1', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const leadsData = await leadsRes.json();

      // Fetch new leads count
      const newLeadsRes = await fetch('/api/admin/leads?status=NEW&limit=1', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const newLeadsData = await newLeadsRes.json();

      // Fetch glossary & articles counts
      const glossaryRes = await fetch('/api/admin/content/glossary?status=published&limit=1', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const glossaryData = await glossaryRes.json();

      const articlesRes = await fetch('/api/admin/content/articles?status=published&limit=1', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const articlesData = await articlesRes.json();

      // Calculate average rating from reviews
      const allReviewsRes = await fetch('/api/admin/reviews?limit=100', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const allReviewsData = await allReviewsRes.json();

      const reviews = allReviewsData.reviews || [];
      const avgRating =
        reviews.length > 0
          ? reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) /
            reviews.length
          : 0;

      setStats({
        totalReviews: reviewsData.total || 0,
        pendingReviews: pendingData.total || 0,
        totalLeads: leadsData.pagination?.total || 0,
        newLeads: newLeadsData.pagination?.total || 0,
        publishedContent:
          (glossaryData.pagination?.total || 0) + (articlesData.pagination?.total || 0),
        avgRating: Math.round(avgRating * 10) / 10,
      });

      // Use reviews as mock "recent activity" from audit logs
      const recentActions: ActivityItem[] = (allReviewsData.reviews || [])
        .slice(0, 5)
        .map((r: { id: string; status: string; title: string; reviewerName: string; createdAt: string }) => ({
          id: r.id,
          action: r.status === 'pending' ? 'CREATE' : r.status === 'approved' ? 'APPROVE' : r.status === 'rejected' ? 'REJECT' : 'UPDATE',
          entity: 'Review',
          details: r.title,
          createdAt: r.createdAt,
          userName: r.reviewerName,
        }));
      setActivities(recentActions);
    } catch {
      toast({ title: 'Error', description: 'Failed to load dashboard data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Welcome Section ────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Welcome back, {user?.name || 'Admin'} 👋
        </h2>
        <p className="text-slate-500 mt-1">
          Here&apos;s what&apos;s happening with Paliwal Secure today.
        </p>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Reviews"
          value={stats?.totalReviews ?? 0}
          highlight={stats?.pendingReviews}
          highlightLabel="pending review"
          icon={Star}
          gradient="bg-gradient-to-br from-amber-400 to-amber-600"
        />
        <StatCard
          title="Total Leads"
          value={stats?.totalLeads ?? 0}
          highlight={stats?.newLeads}
          highlightLabel="new lead"
          icon={Users}
          gradient="bg-gradient-to-br from-emerald-400 to-emerald-600"
        />
        <StatCard
          title="Published Content"
          value={stats?.publishedContent ?? 0}
          icon={FileText}
          gradient="bg-gradient-to-br from-blue-400 to-blue-600"
        />
        <StatCard
          title="Avg Rating"
          value={stats?.avgRating ?? 0}
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-violet-400 to-violet-600"
        />
      </div>

      {/* ── Quick Actions + Recent Activity ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Quick Actions ─────────────────────────────────────────────────── */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-between bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-sm"
              onClick={() => router.push('/admin/dashboard/reviews')}
            >
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Review Pending Reviews
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              className="w-full justify-between bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-sm"
              onClick={() => router.push('/admin/dashboard/leads')}
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                View New Leads
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => router.push('/admin/dashboard/content')}
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Manage Content
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => router.push('/admin/dashboard/analytics')}
            >
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                View Analytics
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        {/* ── Recent Activity ───────────────────────────────────────────────── */}
        <Card className="lg:col-span-2 border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <Badge variant="secondary" className="text-xs">
              Last 5 actions
            </Badge>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="mt-0.5">{getActivityIcon(item.action)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700">
                        {formatActivityDescription(item)}
                      </p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {item.details}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                      {item.userName && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          by {item.userName}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
