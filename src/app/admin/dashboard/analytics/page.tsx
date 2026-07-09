'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Users,
  TrendingUp,
  Eye,
  Clock,
  AlertCircle,
  Loader2,
  Smartphone,
  Monitor,
  Globe,
  FileText,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/auth-store';
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

interface GaData {
  property: string;
  range: { start: string; end: string; days: number };
  metrics: {
    totalUsers: number;
    newUsers: number;
    sessions: number;
    pageviews: number;
    bounceRate: number;
    avgSessionDuration: number;
  };
  topPages: { path: string; views: number; avgTime: number }[];
  topSources: { source: string; users: number; sessions: number }[];
  deviceBreakdown: { device: string; users: number }[];
  countryBreakdown: { country: string; users: number }[];
  dailyTraffic: { date: string; users: number; sessions: number }[];
}

export default function AnalyticsPage() {
  const { accessToken } = useAuthStore();
  const [data, setData] = useState<GaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notConfigured, setNotConfigured] = useState(false);
  const [days, setDays] = useState(30);

  const fetchData = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    setNotConfigured(false);
    try {
      const res = await fetch(`/api/admin/analytics/google?days=${days}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const d = await res.json();
      if (d.not_configured) {
        setNotConfigured(true);
        return;
      }
      if (!d.success) throw new Error(d.error || 'Failed to fetch analytics');
      setData(d.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [accessToken, days]);

  useEffect(() => {
    if (accessToken) fetchData();
  }, [accessToken, fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Fetching Google Analytics data...</p>
          <p className="text-slate-400 text-xs mt-1">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  // ── Not configured state ───────────────────────────────────────────────
  if (notConfigured) {
    return (
      <div className="max-w-2xl mx-auto">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <Card className="border-2 border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Google Analytics Not Configured
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              To see real Google Analytics data here, you need to add a Google service account JSON.
              This is a one-time setup that takes about 5 minutes.
            </p>
            <div className="bg-white rounded-lg p-4 border border-amber-200 space-y-3">
              <p className="text-sm font-semibold text-slate-800">Setup steps:</p>
              <ol className="space-y-2 text-sm text-slate-600 list-decimal list-inside">
                <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">Google Cloud Console <ExternalLink className="w-3 h-3" /></a></li>
                <li>Create a new project (or use existing)</li>
                <li>Enable <strong>Google Analytics Data API</strong></li>
                <li>Create a Service Account → generate JSON key</li>
                <li>Add the service account email to your GA4 property as a Viewer</li>
                <li>Paste the JSON in <Link href="/admin/dashboard/settings" className="text-blue-600 hover:underline">Settings → Google Analytics</Link></li>
              </ol>
            </div>
            <Link href="/admin/dashboard/settings">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                Go to Settings →
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <Card className="border-2 border-red-200">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <p className="font-medium text-slate-800 mb-1">Failed to load analytics</p>
            <p className="text-sm text-slate-500 mb-4">{error}</p>
            <Button onClick={fetchData} variant="outline">Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const m = data.metrics;

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Link href="/admin/dashboard" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-2">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-amber-500" />
            Google Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Property: <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">{data.property}</code> ·
            Last {data.range.days} days ({data.range.start} → {data.range.end})
          </p>
        </div>
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
          {[7, 30, 90].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                days === d ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard label="Total Users" value={m.totalUsers} icon={Users} color="emerald" />
        <KpiCard label="New Users" value={m.newUsers} icon={Users} color="blue" />
        <KpiCard label="Sessions" value={m.sessions} icon={TrendingUp} color="amber" />
        <KpiCard label="Page Views" value={m.pageviews} icon={Eye} color="violet" />
        <KpiCard label="Bounce Rate" value={`${m.bounceRate.toFixed(1)}%`} icon={AlertCircle} color="rose" />
        <KpiCard label="Avg Session" value={`${Math.floor(m.avgSessionDuration / 60)}m ${Math.floor(m.avgSessionDuration % 60)}s`} icon={Clock} color="teal" />
      </div>

      {/* ── Daily Traffic Chart ────────────────────────────────────────────── */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-500" />
            Daily Traffic
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.dailyTraffic.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.dailyTraffic}>
                <defs>
                  <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="sessionsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
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
                />
                <Legend formatter={(v) => <span style={{ fontSize: 11, color: '#64748b' }}>{v}</span>} />
                <Area type="monotone" dataKey="users" name="Users" stroke="#3b82f6" strokeWidth={2} fill="url(#usersGradient)" />
                <Area type="monotone" dataKey="sessions" name="Sessions" stroke="#f59e0b" strokeWidth={2} fill="url(#sessionsGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-400 text-sm">No traffic data</div>
          )}
        </CardContent>
      </Card>

      {/* ── Top Pages + Top Sources ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              Top Pages (by views)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {data.topPages.length > 0 ? (
                data.topPages.map((p, i) => (
                  <div key={p.path} className="flex items-center gap-3 p-3">
                    <span className="text-xs font-bold text-slate-400 w-5">#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{p.path}</p>
                      <p className="text-xs text-slate-500">{p.views} views · avg {Math.floor(p.avgTime)}s</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-sm">No page data</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Top Traffic Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {data.topSources.length > 0 ? (
                data.topSources.map((s) => (
                  <div key={s.source} className="flex items-center gap-3 p-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <Globe className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{s.source}</p>
                      <p className="text-xs text-slate-500">{s.users} users · {s.sessions} sessions</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-sm">No source data</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Device + Country breakdown ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-violet-500" />
              Device Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.deviceBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={data.deviceBreakdown}
                    dataKey="users"
                    nameKey="device"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(e) => `${e.device}: ${e.users}`}
                    labelLine={false}
                  >
                    {data.deviceBreakdown.map((d, i) => (
                      <Cell key={i} fill={
                        d.device === 'mobile' ? '#8b5cf6'
                        : d.device === 'desktop' ? '#3b82f6'
                        : '#10b981'
                      } />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-slate-400 text-sm">No device data</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              Top Countries
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {data.countryBreakdown.length > 0 ? (
                data.countryBreakdown.map((c, i) => (
                  <div key={c.country + i} className="flex items-center gap-3 p-2.5">
                    <span className="text-xs font-bold text-slate-400 w-5">#{i + 1}</span>
                    <span className="flex-1 text-sm text-slate-800">{c.country}</span>
                    <span className="text-xs font-medium text-slate-600">{c.users} users</span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-sm">No country data</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ── KPI Card sub-component ──────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: 'emerald' | 'blue' | 'amber' | 'violet' | 'rose' | 'teal';
}) {
  const colors = {
    emerald: 'from-emerald-400 to-emerald-600',
    blue: 'from-blue-400 to-blue-600',
    amber: 'from-amber-400 to-amber-600',
    violet: 'from-violet-400 to-violet-600',
    rose: 'from-rose-400 to-rose-600',
    teal: 'from-teal-400 to-teal-600',
  };
  return (
    <Card className="border-0 shadow-md relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${colors[color]} opacity-[0.07]`} />
      <CardContent className="p-3 relative">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">{label}</p>
          <div className={`p-1 rounded bg-gradient-to-br ${colors[color]}`}>
            <Icon className="w-3 h-3 text-white" />
          </div>
        </div>
        <p className="text-xl font-bold text-slate-900">{value}</p>
      </CardContent>
    </Card>
  );
}
