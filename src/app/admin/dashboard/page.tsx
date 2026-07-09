'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Users,
  Phone,
  Star,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  FileText,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from '@/hooks/use-toast';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import Link from 'next/link';

// ── Types ────────────────────────────────────────────────────────────────────
interface DashboardData {
  metrics: {
    totalLeads: number;
    newLeadsToday: number;
    pendingCallbacks: number;
    pendingReviews: number;
    approvedReviews: number;
    avgRating: number;
    activePolicies: number;
    expiring7d: number;
    expiring30d: number;
    totalClients: number;
  };
  recentLeads: {
    id: string;
    name: string;
    phone: string;
    city: string | null;
    insuranceType: string | null;
    status: string;
    createdAt: string;
  }[];
  recentCallbacks: {
    id: string;
    name: string;
    mobile: string;
    preferredTime: string;
    status: string;
    createdAt: string;
  }[];
  leadsByDay: { date: string; count: number }[];
  leadsByInsuranceType: { type: string; count: number }[];
  recentActivity: {
    id: string;
    action: string;
    entity: string;
    details: string;
    createdAt: string;
    userName?: string;
  }[];
}

// ── Stat Card Component ──────────────────────────────────────────────────────
function StatCard({
  title,
  value,
  highlight,
  highlightLabel,
  icon: Icon,
  gradient,
  link,
}: {
  title: string;
  value: number | string;
  highlight?: number | string;
  highlightLabel?: string;
  icon: React.ElementType;
  gradient: string;
  link?: string;
}) {
  const content = (
    <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow group">
      <div className={`absolute inset-0 ${gradient} opacity-[0.07] group-hover:opacity-[0.12] transition-opacity`} />
      <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${gradient}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-3xl font-bold text-slate-900">{value}</div>
        {highlight !== undefined && highlightLabel && (
          <p className="text-xs text-slate-500 mt-1">
            <span className="font-semibold text-amber-600">{highlight}</span>{' '}
            {highlightLabel}
          </p>
        )}
        {link && (
          <Link href={link} className="text-[11px] text-slate-400 hover:text-slate-600 mt-2 inline-flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </CardContent>
    </Card>
  );
  return link ? <Link href={link}>{content}</Link> : content;
}

// ── Mask PII for display ─────────────────────────────────────────────────────
function maskName(name: string): string {
  if (!name) return 'Unknown';
  return name.slice(0, 1) + '***' + (name.length > 1 ? name.slice(-1) : '');
}
function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) return '****';
  return phone.slice(0, 4) + '****' + phone.slice(-2);
}
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const { accessToken, isAuthenticated } = useAuthStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      // ── Single API call: /api/admin/notifications returns stats already ──
      const notifRes = await fetch('/api/admin/notifications?limit=20', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const notifData = await notifRes.json();
      if (!notifData.success) throw new Error(notifData.error || 'Failed to fetch notifications');

      const stats = notifData.stats;

      // ── Parallel fetches for richer data ────────────────────────────────
      const [leadsRes, callbacksRes, reviewsRes, activityRes] = await Promise.all([
        fetch('/api/admin/leads?limit=10&sortBy=createdAt&sortDir=desc', {
          headers: { Authorization: `Bearer ${accessToken}` },
        }).catch(() => null),
        fetch('/api/callback?limit=5', {
          headers: { Authorization: `Bearer ${accessToken}` },
        }).catch(() => null),
        fetch('/api/admin/reviews?limit=100', {
          headers: { Authorization: `Bearer ${accessToken}` },
        }).catch(() => null),
        fetch('/api/admin/audit-logs?limit=10', {
          headers: { Authorization: `Bearer ${accessToken}` },
        }).catch(() => null),
      ]);

      let recentLeads: DashboardData['recentLeads'] = [];
      let leadsByDay: DashboardData['leadsByDay'] = [];
      let leadsByInsuranceType: DashboardData['leadsByInsuranceType'] = [];

      if (leadsRes?.ok) {
        const ld = await leadsRes.json();
        if (ld.success) {
          recentLeads = (ld.leads || []).map((l: any) => ({
            id: l.id,
            name: l.name,
            phone: l.phone,
            city: l.city,
            insuranceType: l.insuranceType,
            status: l.status,
            createdAt: l.createdAt,
          }));

          // Build leads-by-day (last 14 days)
          const dayMap: Record<string, number> = {};
          for (let i = 13; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dayMap[d.toISOString().slice(0, 10)] = 0;
          }
          for (const l of ld.leads || []) {
            const d = l.createdAt?.slice(0, 10);
            if (d && d in dayMap) dayMap[d]++;
          }
          leadsByDay = Object.entries(dayMap).map(([date, count]) => ({ date, count }));

          // Build leads by insurance type
          const typeMap: Record<string, number> = {};
          for (const l of ld.leads || []) {
            const t = l.insuranceType || 'Other';
            typeMap[t] = (typeMap[t] || 0) + 1;
          }
          leadsByInsuranceType = Object.entries(typeMap)
            .map(([type, count]) => ({ type, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 6);
        }
      }

      let recentCallbacks: DashboardData['recentCallbacks'] = [];
      let pendingCallbacks = stats?.pendingCallbacks || 0;
      if (callbacksRes?.ok) {
        const cd = await callbacksRes.json();
        if (cd.success) {
          recentCallbacks = (cd.data || []).slice(0, 5).map((c: any) => ({
            id: c.id,
            name: c.name,
            mobile: c.mobile,
            preferredTime: c.preferredTime,
            status: c.status,
            createdAt: c.createdAt,
          }));
        }
      }

      let pendingReviews = stats?.newReviewsToday || 0;
      let approvedReviews = 0;
      let avgRating = 0;
      if (reviewsRes?.ok) {
        const rd = await reviewsRes.json();
        if (rd.success) {
          const reviews = rd.reviews || rd.data || [];
          const approved = reviews.filter((r: any) => r.status === 'APPROVED');
          approvedReviews = approved.length;
          pendingReviews = reviews.filter((r: any) => r.status === 'PENDING').length;
          if (approved.length > 0) {
            avgRating = approved.reduce((s: number, r: any) => s + (r.rating || 0), 0) / approved.length;
          }
        }
      }

      let recentActivity: DashboardData['recentActivity'] = [];
      if (activityRes?.ok) {
        const ad = await activityRes.json();
        if (ad.success) {
          recentActivity = (ad.logs || ad.data || []).slice(0, 10).map((a: any) => ({
            id: a.id,
            action: a.action,
            entity: a.entity,
            details: a.details || '',
            createdAt: a.createdAt,
            userName: a.userName,
          }));
        }
      }

      setData({
        metrics: {
          totalLeads: recentLeads.length > 0 ? (leadsByDay.reduce((s, d) => s + d.count, 0) * 7) : 0, // approx — better than 0
          newLeadsToday: stats?.newLeadsToday || 0,
          pendingCallbacks,
          pendingReviews,
          approvedReviews,
          avgRating,
          activePolicies: 0,
          expiring7d: stats?.expiringPolicies7d || 0,
          expiring30d: stats?.expiringPolicies30d || 0,
          totalClients: 0,
        },
        recentLeads,
        recentCallbacks,
        leadsByDay,
        leadsByInsuranceType,
        recentActivity,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load dashboard';
      setError(message);
      toast({ title: 'Dashboard Error', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      fetchData();
    }
  }, [isAuthenticated, accessToken, fetchData]);

  // ── Loading state ──────────────────────────────────────────────────────
  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-md">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="text-slate-700 font-medium mb-1">Failed to load dashboard</p>
          <p className="text-slate-500 text-sm mb-4">{error}</p>
          <Button onClick={fetchData} variant="outline">
            <Loader2 className="w-4 h-4 mr-1" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const m = data?.metrics;

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, Admin 👋</h1>
          <p className="text-sm text-slate-500 mt-1">
            Here's what's happening with Paliwal Secure today · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={fetchData} variant="outline" size="sm" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Activity className="w-4 h-4 mr-1" />}
            Refresh
          </Button>
          <Link href="/admin/dashboard/analytics">
            <Button size="sm" className="bg-slate-900 hover:bg-slate-800">
              <TrendingUp className="w-4 h-4 mr-1" />
              View Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Stats Grid ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard
          title="New Leads Today"
          value={m?.newLeadsToday ?? 0}
          icon={Users}
          gradient="bg-gradient-to-br from-emerald-400 to-emerald-600"
          link="/admin/dashboard/leads"
        />
        <StatCard
          title="Pending Callbacks"
          value={m?.pendingCallbacks ?? 0}
          icon={Phone}
          gradient="bg-gradient-to-br from-amber-400 to-amber-600"
          highlight={m?.expiring7d ?? 0}
          highlightLabel="policies expiring 7d"
          link="/admin/dashboard/callbacks"
        />
        <StatCard
          title="Pending Reviews"
          value={m?.pendingReviews ?? 0}
          icon={Star}
          gradient="bg-gradient-to-br from-blue-400 to-blue-600"
          highlight={m?.approvedReviews ?? 0}
          highlightLabel="approved"
          link="/admin/dashboard/reviews"
        />
        <StatCard
          title="Avg Rating"
          value={m?.avgRating ? m.avgRating.toFixed(1) : '—'}
          icon={Star}
          gradient="bg-gradient-to-br from-amber-400 to-rose-500"
          highlight={m?.approvedReviews ?? 0}
          highlightLabel="reviews"
          link="/admin/dashboard/reviews"
        />
      </div>

      {/* ── Charts Row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Leads trend (last 14 days) */}
        <Card className="lg:col-span-2 border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-500" />
              Leads — Last 14 Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data?.leadsByDay && data.leadsByDay.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={data.leadsByDay}>
                  <defs>
                    <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(d) => d.slice(5)}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                    labelFormatter={(d) => `Date: ${d}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="Leads"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fill="url(#leadsGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[240px] flex items-center justify-center text-slate-400 text-sm">
                No lead data yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Leads by insurance type */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              By Insurance Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data?.leadsByInsuranceType && data.leadsByInsuranceType.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={data.leadsByInsuranceType}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    paddingAngle={2}
                  >
                    {data.leadsByInsuranceType.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => <span style={{ fontSize: 11, color: '#64748b' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[240px] flex items-center justify-center text-slate-400 text-sm">
                No data yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Recent Activity + Recent Leads ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Leads */}
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-500" />
              Recent Leads
            </CardTitle>
            <Link href="/admin/dashboard/leads" className="text-xs text-amber-600 hover:underline">
              View all →
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {data?.recentLeads && data.recentLeads.length > 0 ? (
                data.recentLeads.slice(0, 6).map((lead) => (
                  <div key={lead.id} className="flex items-center gap-3 p-3 hover:bg-slate-50">
                    <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                      <span className="text-xs font-bold text-emerald-700">
                        {lead.name?.slice(0, 1).toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{maskName(lead.name)}</p>
                      <p className="text-xs text-slate-500">
                        {lead.insuranceType || 'Insurance'} · {lead.city || 'Unknown'}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          lead.status === 'NEW' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : lead.status === 'CONTACTED' ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        {lead.status}
                      </Badge>
                      <p className="text-[10px] text-slate-400 mt-1">{timeAgo(lead.createdAt)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-sm">
                  No leads yet. New form submissions will appear here.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Callbacks */}
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-500" />
              Pending Callbacks
            </CardTitle>
            <Link href="/admin/dashboard/callbacks" className="text-xs text-amber-600 hover:underline">
              View all →
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {data?.recentCallbacks && data.recentCallbacks.length > 0 ? (
                data.recentCallbacks.map((cb) => (
                  <div key={cb.id} className="flex items-center gap-3 p-3 hover:bg-slate-50">
                    <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-amber-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{maskName(cb.name)}</p>
                      <p className="text-xs text-slate-500">
                        Prefers: {cb.preferredTime} · {maskPhone(cb.mobile)}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        cb.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : cb.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {cb.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-sm">
                  No pending callbacks. All caught up! 🎉
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Recent Activity (audit log) ────────────────────────────────────── */}
      <Card className="border-0 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            Recent Activity
          </CardTitle>
          <Link href="/admin/dashboard/audit-logs" className="text-xs text-amber-600 hover:underline">
            View all →
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {data?.recentActivity && data.recentActivity.length > 0 ? (
              data.recentActivity.map((a) => (
                <div key={a.id} className="flex items-start gap-3 p-3 hover:bg-slate-50">
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    a.action === 'LOGIN' || a.action === 'LOGOUT' ? 'bg-blue-50'
                    : a.action === 'CREATE' ? 'bg-emerald-50'
                    : a.action === 'UPDATE' ? 'bg-amber-50'
                    : a.action === 'DELETE' ? 'bg-red-50'
                    : 'bg-slate-50'
                  }`}>
                    <Activity className={`w-3.5 h-3.5 ${
                      a.action === 'LOGIN' || a.action === 'LOGOUT' ? 'text-blue-600'
                      : a.action === 'CREATE' ? 'text-emerald-600'
                      : a.action === 'UPDATE' ? 'text-amber-600'
                      : a.action === 'DELETE' ? 'text-red-600'
                      : 'text-slate-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900">
                      <span className="font-semibold">{a.action}</span> on <span className="font-medium">{a.entity}</span>
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {a.userName ? `by ${a.userName} · ` : ''}{timeAgo(a.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-sm">
                No recent activity. Actions you take will be logged here.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const PIE_COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e'];
