'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  BarChart3,
  Star,
  Users,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from '@/hooks/use-toast';

// ── Types ────────────────────────────────────────────────────────────────────
interface ReviewStats {
  total: number;
  avgRating: number;
  ratingDistribution: Record<number, number>;
}

interface LeadFunnel {
  NEW: number;
  CONTACTED: number;
  QUALIFIED: number;
  CONVERTED: number;
  LOST: number;
  total: number;
}

interface InsuranceDistribution {
  type: string;
  count: number;
  color: string;
}

// ── CSS Bar Component ────────────────────────────────────────────────────────
function CssBar({
  value,
  max,
  color,
  label,
  showValue = true,
}: {
  value: number;
  max: number;
  color: string;
  label?: string;
  showValue?: boolean;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      {label && (
        <span className="text-sm text-slate-600 w-8 text-right shrink-0">{label}</span>
      )}
      <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${Math.max(pct, 1)}%` }}
        />
      </div>
      {showValue && (
        <span className="text-sm font-medium text-slate-700 w-10 shrink-0">{value}</span>
      )}
    </div>
  );
}

// ── Funnel Step ──────────────────────────────────────────────────────────────
function FunnelStep({
  label,
  count,
  total,
  color,
  bg,
  isFirst,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
  bg: string;
  isFirst?: boolean;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-4">
      <div className={`w-24 shrink-0 text-right`}>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="text-xs text-slate-400">{pct}%</p>
      </div>
      <div className="flex-1">
        <div className={`h-10 rounded-lg flex items-center justify-end pr-3 transition-all duration-700 ${bg}`}
          style={{
            width: `${total > 0 ? Math.max((count / total) * 100, isFirst ? 100 : 5) : (isFirst ? 100 : 5)}%`,
            minWidth: '40px',
          }}
        >
          <span className={`text-sm font-bold ${color}`}>{count}</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const { accessToken } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [leadFunnel, setLeadFunnel] = useState<LeadFunnel | null>(null);
  const [insuranceDist, setInsuranceDist] = useState<InsuranceDistribution[]>([]);

  const fetchData = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      // Fetch all reviews for stats
      const reviewsRes = await fetch('/api/admin/reviews?limit=100', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const reviewsData = await reviewsRes.json();
      const reviews = reviewsData.reviews || [];

      // Calculate review stats
      const ratingDist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let totalRating = 0;
      reviews.forEach((r: { rating: number }) => {
        ratingDist[r.rating] = (ratingDist[r.rating] || 0) + 1;
        totalRating += r.rating;
      });

      setReviewStats({
        total: reviewsData.total || 0,
        avgRating: reviews.length > 0 ? Math.round((totalRating / reviews.length) * 10) / 10 : 0,
        ratingDistribution: ratingDist,
      });

      // Fetch leads for funnel
      const leadStatuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'];
      const leadCounts: Record<string, number> = {};
      let totalLeads = 0;

      await Promise.all(
        leadStatuses.map(async (status) => {
          const res = await fetch(`/api/admin/leads?status=${status}&limit=1`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const data = await res.json();
          leadCounts[status] = data.pagination?.total || 0;
          totalLeads += data.pagination?.total || 0;
        })
      );

      setLeadFunnel({
        ...leadCounts,
        total: totalLeads,
      } as LeadFunnel);

      // Fetch insurance type distribution from reviews
      const insuranceTypes = ['health', 'life', 'motor', 'travel', 'home'];
      const colors = [
        'bg-emerald-500',
        'bg-blue-500',
        'bg-amber-500',
        'bg-violet-500',
        'bg-rose-500',
      ];

      const dist: InsuranceDistribution[] = [];
      await Promise.all(
        insuranceTypes.map(async (type, i) => {
          const res = await fetch(`/api/admin/reviews?insuranceType=${type}&limit=1`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const data = await res.json();
          const count = data.total || 0;
          if (count > 0) {
            dist.push({ type, count, color: colors[i] });
          }
        })
      );
      dist.sort((a, b) => b.count - a.count);
      setInsuranceDist(dist);
    } catch {
      toast({ title: 'Error', description: 'Failed to load analytics', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  const maxRating = reviewStats
    ? Math.max(...Object.values(reviewStats.ratingDistribution), 1)
    : 1;
  const maxInsurance = insuranceDist.length > 0 ? insuranceDist[0].count : 1;

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Analytics Overview</h2>
          <p className="text-sm text-slate-500">Performance metrics and distribution insights</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Review Stats ──────────────────────────────────────────────────── */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              <CardTitle className="text-base">Review Statistics</CardTitle>
            </div>
            <CardDescription>
              Total Reviews: <strong>{reviewStats?.total ?? 0}</strong> · Avg Rating:{' '}
              <strong>{reviewStats?.avgRating ?? 0}/5</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12 shrink-0">
                  <span className="text-sm font-medium text-slate-600">{rating}</span>
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                </div>
                <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-700"
                    style={{
                      width: `${reviewStats ? (reviewStats.ratingDistribution[rating] / maxRating) * 100 : 0}%`,
                      minWidth: reviewStats?.ratingDistribution[rating] ? '4px' : '0',
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-700 w-8 text-right shrink-0">
                  {reviewStats?.ratingDistribution[rating] ?? 0}
                </span>
              </div>
            ))}

            {/* Quick stat badges */}
            <div className="flex flex-wrap gap-2 pt-3 border-t">
              <Badge variant="secondary" className="bg-amber-50 text-amber-700">
                <Star className="w-3 h-3 mr-1 fill-amber-500 text-amber-500" />
                {reviewStats?.avgRating ?? 0} avg
              </Badge>
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                {((reviewStats?.ratingDistribution[4] || 0) + (reviewStats?.ratingDistribution[5] || 0))} positive (4-5★)
              </Badge>
              <Badge variant="secondary" className="bg-red-50 text-red-700">
                {((reviewStats?.ratingDistribution[1] || 0) + (reviewStats?.ratingDistribution[2] || 0))} negative (1-2★)
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* ── Lead Funnel ───────────────────────────────────────────────────── */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-500" />
              <CardTitle className="text-base">Lead Funnel</CardTitle>
            </div>
            <CardDescription>
              Total Leads: <strong>{leadFunnel?.total ?? 0}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <FunnelStep
              label="New"
              count={leadFunnel?.NEW ?? 0}
              total={leadFunnel?.total ?? 1}
              color="text-blue-700"
              bg="bg-blue-100"
              isFirst
            />
            <FunnelStep
              label="Contacted"
              count={leadFunnel?.CONTACTED ?? 0}
              total={leadFunnel?.total ?? 1}
              color="text-amber-700"
              bg="bg-amber-100"
            />
            <FunnelStep
              label="Qualified"
              count={leadFunnel?.QUALIFIED ?? 0}
              total={leadFunnel?.total ?? 1}
              color="text-emerald-700"
              bg="bg-emerald-100"
            />
            <FunnelStep
              label="Converted"
              count={leadFunnel?.CONVERTED ?? 0}
              total={leadFunnel?.total ?? 1}
              color="text-teal-700"
              bg="bg-teal-100"
            />
            <FunnelStep
              label="Lost"
              count={leadFunnel?.LOST ?? 0}
              total={leadFunnel?.total ?? 1}
              color="text-red-700"
              bg="bg-red-100"
            />

            {/* Conversion rate */}
            <div className="pt-3 border-t">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-slate-600">
                  Conversion Rate:{' '}
                  <strong className="text-emerald-700">
                    {leadFunnel && leadFunnel.total > 0
                      ? Math.round(((leadFunnel.CONVERTED || 0) / leadFunnel.total) * 100)
                      : 0}
                    %
                  </strong>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Insurance Type Distribution ───────────────────────────────────── */}
        <Card className="border-0 shadow-md lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-violet-500" />
              <CardTitle className="text-base">Insurance Type Distribution</CardTitle>
            </div>
            <CardDescription>
              Review count by insurance category
            </CardDescription>
          </CardHeader>
          <CardContent>
            {insuranceDist.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p>No distribution data available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {insuranceDist.map((item) => (
                  <div key={item.type} className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-600 w-20 capitalize shrink-0">
                      {item.type}
                    </span>
                    <div className="flex-1 bg-slate-100 rounded-full h-8 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                        style={{
                          width: `${(item.count / maxInsurance) * 100}%`,
                          minWidth: '8px',
                        }}
                      />
                    </div>
                    <span className="text-sm font-bold text-slate-700 w-12 text-right shrink-0">
                      {item.count}
                    </span>
                    <span className="text-xs text-slate-400 w-12 text-right shrink-0">
                      {reviewStats && reviewStats.total > 0
                        ? Math.round((item.count / reviewStats.total) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                ))}

                {/* Summary badges */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  {insuranceDist.map((item) => (
                    <Badge
                      key={item.type}
                      variant="outline"
                      className="capitalize"
                    >
                      <div className={`w-2 h-2 rounded-full mr-1.5 ${item.color}`} />
                      {item.type}: {item.count}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
