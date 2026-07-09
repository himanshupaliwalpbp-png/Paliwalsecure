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
  ShieldCheck,
  Activity,
  Database,
  Sparkles,
  Zap,
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Link from 'next/link';
import { motion } from 'framer-motion';

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
  recentLeads: any[];
  recentCallbacks: any[];
  leadsByDay: { date: string; count: number }[];
  leadsByInsuranceType: { type: string; count: number }[];
  recentActivity: any[];
  dbConnected?: boolean;
  _demo?: boolean;
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

// ── Premium Stat Card with Sparkline ────────────────────────────────────────
function PremiumStatCard({
  title,
  value,
  delta,
  deltaLabel,
  icon: Icon,
  gradient,
  link,
  index,
}: {
  title: string;
  value: number | string;
  delta?: string;
  deltaLabel?: string;
  icon: React.ElementType;
  gradient: string;
  link?: string;
  index: number;
}) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="group relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-0.5 bg-white">
        {/* Subtle gradient accent on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`} />

        <CardContent className="p-5 relative">
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            {delta && (
              <Badge variant="outline" className="text-[10px] font-semibold border-emerald-200 bg-emerald-50 text-emerald-700">
                <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                {delta}
              </Badge>
            )}
          </div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
          {deltaLabel && (
            <p className="text-xs text-slate-400 mt-1">{deltaLabel}</p>
          )}
          {link && (
            <Link href={link} className="text-[11px] text-slate-400 hover:text-slate-700 mt-3 inline-flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
  return content;
}

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
      const res = await fetch('/api/admin/dashboard-data', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const d = await res.json();
      if (!d.success) throw new Error(d.error || 'Failed to load dashboard');
      setData(d);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load dashboard';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (isAuthenticated && accessToken) fetchData();
  }, [isAuthenticated, accessToken, fetchData]);

  // ── Loading state — premium skeleton ─────────────────────────────────────
  if (loading && !data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 opacity-20 animate-ping" />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">Loading dashboard...</p>
          <p className="text-slate-400 text-xs mt-1">Fetching real-time data</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-slate-800 font-semibold mb-1">Failed to load dashboard</p>
          <p className="text-slate-500 text-sm mb-4">{error}</p>
          <Button onClick={fetchData} variant="outline" size="sm">
            <Loader2 className="w-4 h-4 mr-1.5" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const m = data?.metrics;
  const isDemo = !data?.dbConnected;

  return (
    <div className="space-y-6">
      {/* ── Database not connected banner ───────────────────────────────────── */}
      {isDemo && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-4 flex items-start gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5 text-amber-700" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-amber-900 text-sm flex items-center gap-2">
              Running in Demo Mode
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Database not connected. You're seeing sample data. To save real leads, reviews, and settings,
              {' '}
              <Link href="/admin/dashboard/setup" className="font-semibold underline hover:text-amber-900">
                set up PostgreSQL →
              </Link>
            </p>
          </div>
          <Link href="/admin/dashboard/setup">
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white text-xs">
              Setup Database
            </Button>
          </Link>
        </motion.div>
      )}

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-slate-900 tracking-tight"
          >
            Welcome back 👋
          </motion.h1>
          <p className="text-sm text-slate-500 mt-1">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            {' · '}
            {isDemo ? 'Demo mode' : 'Live data'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={fetchData} variant="outline" size="sm" disabled={loading} className="rounded-xl">
            {loading ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Activity className="w-4 h-4 mr-1.5" />}
            Refresh
          </Button>
          <Link href="/admin/dashboard/analytics">
            <Button size="sm" className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white">
              <TrendingUp className="w-4 h-4 mr-1.5" />
              Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Stats Grid (4 cards) ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <PremiumStatCard
          index={0}
          title="New Leads Today"
          value={m?.newLeadsToday ?? 0}
          delta={m && m.newLeadsToday > 0 ? '+' + m.newLeadsToday : undefined}
          deltaLabel={`${m?.totalLeads ?? 0} total leads`}
          icon={Users}
          gradient="from-emerald-400 to-emerald-600"
          link="/admin/dashboard/leads"
        />
        <PremiumStatCard
          index={1}
          title="Pending Callbacks"
          value={m?.pendingCallbacks ?? 0}
          deltaLabel={m && m.expiring7d > 0 ? `${m.expiring7d} policies expiring 7d` : 'All caught up'}
          icon={Phone}
          gradient="from-amber-400 to-orange-500"
          link="/admin/dashboard/callbacks"
        />
        <PremiumStatCard
          index={2}
          title="Pending Reviews"
          value={m?.pendingReviews ?? 0}
          deltaLabel={`${m?.approvedReviews ?? 0} approved reviews`}
          icon={Star}
          gradient="from-blue-400 to-blue-600"
          link="/admin/dashboard/reviews"
        />
        <PremiumStatCard
          index={3}
          title="Avg Rating"
          value={m?.avgRating ? m.avgRating.toFixed(1) : '—'}
          delta={m && m.avgRating >= 4.5 ? '5★' : undefined}
          deltaLabel={`${m?.approvedReviews ?? 0} customer reviews`}
          icon={Star}
          gradient="from-amber-400 to-rose-500"
          link="/admin/dashboard/reviews"
        />
      </div>

      {/* ── Charts Row ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Leads trend */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                    <Activity className="w-3.5 h-3.5 text-white" />
                  </div>
                  Leads — Last 14 Days
                </CardTitle>
                {data?.leadsByDay && (
                  <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200">
                    {data.leadsByDay.reduce((s, d) => s + d.count, 0)} total
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {data?.leadsByDay && data.leadsByDay.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={data.leadsByDay} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: '#94a3b8' }}
                      tickFormatter={(d) => d.slice(5)}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#94a3b8' }}
                      allowDecimals={false}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: '1px solid #e2e8f0',
                        fontSize: 12,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                      }}
                      labelFormatter={(d) => `📅 ${d}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      name="Leads"
                      stroke="#f59e0b"
                      strokeWidth={2.5}
                      fill="url(#leadsGradient)"
                      dot={{ r: 3, fill: '#f59e0b', strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[260px] flex items-center justify-center text-slate-400 text-sm">
                  No lead data yet
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Insurance type pie */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="border-0 shadow-sm bg-white h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                </div>
                By Insurance Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data?.leadsByInsuranceType && data.leadsByInsuranceType.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={data.leadsByInsuranceType}
                      dataKey="count"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                      innerRadius={50}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {data.leadsByInsuranceType.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: '1px solid #e2e8f0',
                        fontSize: 12,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[260px] flex items-center justify-center text-slate-400 text-sm">
                  No data yet
                </div>
              )}
              {data?.leadsByInsuranceType && data.leadsByInsuranceType.length > 0 && (
                <div className="grid grid-cols-2 gap-1.5 mt-2">
                  {data.leadsByInsuranceType.slice(0, 6).map((t, i) => (
                    <div key={t.type} className="flex items-center gap-1.5 text-[11px]">
                      <span className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-slate-600">{t.type}</span>
                      <span className="text-slate-400 ml-auto">{t.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Recent Activity Row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Leads */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5 text-white" />
                </div>
                Recent Leads
              </CardTitle>
              <Link href="/admin/dashboard/leads" className="text-xs text-amber-600 hover:text-amber-700 font-medium">
                View all →
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {data?.recentLeads && data.recentLeads.length > 0 ? (
                  data.recentLeads.slice(0, 6).map((lead, i) => (
                    <motion.div
                      key={lead.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.05 }}
                      className="flex items-center gap-3 p-3.5 hover:bg-slate-50 transition-colors"
                    >
                      <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                        <span className="text-xs font-bold text-emerald-700">
                          {lead.name?.slice(0, 1).toUpperCase() || '?'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{lead.name}</p>
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
                    </motion.div>
                  ))
                ) : (
                  <div className="p-10 text-center text-slate-400 text-sm">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No leads yet. New form submissions will appear here.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Callbacks */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5 text-white" />
                </div>
                Pending Callbacks
              </CardTitle>
              <Link href="/admin/dashboard/callbacks" className="text-xs text-amber-600 hover:text-amber-700 font-medium">
                View all →
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {data?.recentCallbacks && data.recentCallbacks.length > 0 ? (
                  data.recentCallbacks.map((cb, i) => (
                    <motion.div
                      key={cb.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.05 }}
                      className="flex items-center gap-3 p-3.5 hover:bg-slate-50 transition-colors"
                    >
                      <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
                        <Phone className="w-4 h-4 text-amber-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{cb.name}</p>
                        <p className="text-xs text-slate-500">
                          Prefers: {cb.preferredTime} · {cb.mobile}
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
                    </motion.div>
                  ))
                ) : (
                  <div className="p-10 text-center text-slate-400 text-sm">
                    <Phone className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No pending callbacks. All caught up! 🎉
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Recent Activity ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-white" />
              </div>
              Recent Activity
            </CardTitle>
            <Link href="/admin/dashboard/audit-logs" className="text-xs text-amber-600 hover:text-amber-700 font-medium">
              View all →
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {data?.recentActivity && data.recentActivity.length > 0 ? (
                data.recentActivity.map((a, i) => {
                  const colors: Record<string, string> = {
                    LOGIN: 'bg-blue-50 text-blue-600',
                    LOGOUT: 'bg-slate-50 text-slate-600',
                    CREATE: 'bg-emerald-50 text-emerald-600',
                    UPDATE: 'bg-amber-50 text-amber-600',
                    DELETE: 'bg-red-50 text-red-600',
                    APPROVE: 'bg-emerald-50 text-emerald-600',
                  };
                  return (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.04 }}
                      className="flex items-start gap-3 p-3.5 hover:bg-slate-50 transition-colors"
                    >
                      <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${colors[a.action] || 'bg-slate-50 text-slate-600'}`}>
                        <Activity className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900">
                          <span className="font-semibold">{a.action}</span>
                          {' on '}
                          <span className="font-medium">{a.entity}</span>
                        </p>
                        <p className="text-xs text-slate-500">
                          {a.userName ? `by ${a.userName} · ` : ''}{timeAgo(a.createdAt)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="p-10 text-center text-slate-400 text-sm">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  No recent activity. Actions you take will be logged here.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Quick Actions ───────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {[
          { icon: Database, label: 'Database Setup', desc: 'Connect PostgreSQL', link: '/admin/dashboard/setup', color: 'from-blue-400 to-indigo-600' },
          { icon: ShieldCheck, label: 'Security', desc: 'MFA + Password', link: '/admin/dashboard/security', color: 'from-emerald-400 to-emerald-600' },
          { icon: Zap, label: 'Google Analytics', desc: 'GA4 + Search Console', link: '/admin/dashboard/analytics', color: 'from-amber-400 to-orange-500' },
          { icon: Users, label: 'Manage Leads', desc: 'View all leads', link: '/admin/dashboard/leads', color: 'from-rose-400 to-pink-600' },
        ].map((q, i) => (
          <Link key={i} href={q.link}>
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white">
              <CardContent className="p-4">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${q.color} flex items-center justify-center mb-2`}>
                  <q.icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm font-semibold text-slate-900">{q.label}</p>
                <p className="text-xs text-slate-500">{q.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}

const PIE_COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#14b8a6'];
