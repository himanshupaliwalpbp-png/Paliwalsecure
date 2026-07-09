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
  Globe,
  FileText,
  ArrowLeft,
  Sparkles,
  Database,
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
} from 'recharts';
import Link from 'next/link';
import { motion } from 'framer-motion';

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
  const [demoMode, setDemoMode] = useState(false);
  const [days, setDays] = useState(30);

  const fetchData = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/analytics/google?days=${days}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const d = await res.json();
      if (d.demo) setDemoMode(true);
      else setDemoMode(false);
      if (d.data) {
        setData(d.data);
      } else if (!d.success) {
        throw new Error(d.error || 'Failed to fetch analytics');
      }
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 opacity-20 animate-ping" />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">Fetching analytics...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
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
      {/* ── Demo mode banner ──────────────────────────────────────────────── */}
      {demoMode && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 flex items-start gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-blue-700" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-blue-900 text-sm">Demo Analytics Data</p>
            <p className="text-xs text-blue-700 mt-0.5">
              Showing sample data. To see REAL Google Analytics data,{' '}
              <Link href="/admin/dashboard/settings" className="font-semibold underline hover:text-blue-900">
                configure your GA4 service account →
              </Link>
            </p>
          </div>
        </motion.div>
      )}

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Link href="/admin/dashboard" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-2">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            Google Analytics
          </motion.h1>
          <p className="text-sm text-slate-500 mt-1">
            {demoMode ? 'Sample data' : 'Property'}: <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">{data.property}</code>
            {' · '}Last {data.range.days} days
          </p>
        </div>
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
          {[7, 30, 90].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                days === d ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI Cards (6) ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Users', value: m.totalUsers.toLocaleString('en-IN'), icon: Users, color: 'from-emerald-400 to-emerald-600' },
          { label: 'New Users', value: m.newUsers.toLocaleString('en-IN'), icon: Users, color: 'from-blue-400 to-blue-600' },
          { label: 'Sessions', value: m.sessions.toLocaleString('en-IN'), icon: TrendingUp, color: 'from-amber-400 to-orange-500' },
          { label: 'Page Views', value: m.pageviews.toLocaleString('en-IN'), icon: Eye, color: 'from-violet-400 to-violet-600' },
          { label: 'Bounce Rate', value: `${m.bounceRate.toFixed(1)}%`, icon: AlertCircle, color: 'from-rose-400 to-rose-600' },
          { label: 'Avg Session', value: `${Math.floor(m.avgSessionDuration / 60)}m ${Math.floor(m.avgSessionDuration % 60)}s`, icon: Clock, color: 'from-teal-400 to-teal-600' },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.4 }}
          >
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white relative overflow-hidden group">
              <div className={`absolute inset-0 bg-gradient-to-br ${kpi.color} opacity-0 group-hover:opacity-[0.04] transition-opacity`} />
              <CardContent className="p-4 relative">
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${kpi.color} flex items-center justify-center mb-2 shadow-sm`}>
                  <kpi.icon className="w-3.5 h-3.5 text-white" />
                </div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">{kpi.label}</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{kpi.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ── Daily Traffic ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-white" />
              </div>
              Daily Traffic
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.dailyTraffic.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={data.dailyTraffic} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="sessionsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
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
                  />
                  <Area type="monotone" dataKey="users" name="Users" stroke="#3b82f6" strokeWidth={2.5} fill="url(#usersGradient)" />
                  <Area type="monotone" dataKey="sessions" name="Sessions" stroke="#f59e0b" strokeWidth={2.5} fill="url(#sessionsGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[320px] flex items-center justify-center text-slate-400 text-sm">No traffic data</div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Top Pages + Sources ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5 text-white" />
                </div>
                Top Pages
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {data.topPages.length > 0 ? (
                  data.topPages.map((p, i) => (
                    <div key={p.path} className="flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors">
                      <span className="text-xs font-bold text-slate-400 w-6">#{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{p.path}</p>
                        <p className="text-xs text-slate-500">{p.views.toLocaleString('en-IN')} views · avg {Math.floor(p.avgTime)}s</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 text-sm">No page data</div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                  <Globe className="w-3.5 h-3.5 text-white" />
                </div>
                Traffic Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {data.topSources.length > 0 ? (
                  data.topSources.map((s) => (
                    <div key={s.source} className="flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors">
                      <div className="shrink-0 w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <Globe className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">{s.source}</p>
                        <p className="text-xs text-slate-500">{s.users.toLocaleString('en-IN')} users · {s.sessions.toLocaleString('en-IN')} sessions</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 text-sm">No source data</div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Device + Country ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center">
                  <Smartphone className="w-3.5 h-3.5 text-white" />
                </div>
                Device Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.deviceBreakdown.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={data.deviceBreakdown}
                        dataKey="users"
                        nameKey="device"
                        cx="50%"
                        cy="50%"
                        outerRadius={75}
                        innerRadius={45}
                        paddingAngle={3}
                        stroke="none"
                      >
                        {data.deviceBreakdown.map((d, i) => (
                          <Cell key={i} fill={
                            d.device === 'mobile' ? '#8b5cf6'
                            : d.device === 'desktop' ? '#3b82f6'
                            : '#10b981'
                          } />
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
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {data.deviceBreakdown.map((d, i) => (
                      <div key={i} className="text-center">
                        <p className="text-[10px] uppercase tracking-wider text-slate-400">{d.device}</p>
                        <p className="text-sm font-bold text-slate-900">{d.users.toLocaleString('en-IN')}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-slate-400 text-sm">No device data</div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <Globe className="w-3.5 h-3.5 text-white" />
                </div>
                Top Countries
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {data.countryBreakdown.length > 0 ? (
                  data.countryBreakdown.map((c, i) => (
                    <div key={c.country + i} className="flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors">
                      <span className="text-xs font-bold text-slate-400 w-6">#{i + 1}</span>
                      <span className="flex-1 text-sm text-slate-800">{c.country}</span>
                      <span className="text-xs font-medium text-slate-600">{c.users.toLocaleString('en-IN')} users</span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 text-sm">No country data</div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Setup CTA (only in demo mode) ──────────────────────────────────── */}
      {demoMode && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6 text-center">
              <Database className="w-10 h-10 mx-auto mb-3 text-blue-600" />
              <p className="text-base font-semibold text-slate-900 mb-1">See Real Analytics Data</p>
              <p className="text-sm text-slate-600 mb-4">
                Connect your Google Analytics 4 service account to see real visitor data instead of demo numbers.
              </p>
              <Link href="/admin/dashboard/settings">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Configure GA4 Service Account →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
