'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Database, RefreshCw, Search, Activity, Clock, AlertTriangle,
  CheckCircle2, Zap, Shield, TrendingUp, BarChart3, Server,
  HardDrive, Wifi, ArrowRight, Loader2, Info, ChevronRight,
  CircleDot, Globe, FileText,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface DataFreshnessEntry {
  lastUpdated: string;
  source: string;
  isStale: boolean;
}

interface PipelineStatus {
  mode: 'scraper' | 'api';
  lastRefresh: string;
  nextRefresh: string;
  dataFreshness: Record<string, DataFreshnessEntry>;
  cacheHitRate: number;
  totalRequests: number;
  apiErrors: number;
  staticFallbackCount: number;
}

interface TrustScoreResult {
  csr: number;
  icr?: number;
  source: string;
  classification: 'Best' | 'Good' | 'Needs Improvement';
  hinglishExplanation: string;
  insurer?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATASET CONFIG — Labels, Hinglish names, icons
// ═══════════════════════════════════════════════════════════════════════════════

const DATASET_CONFIG: Record<string, {
  label: string;
  hinglish: string;
  icon: React.ElementType;
  source: string;
  records: number;
}> = {
  csr: { label: 'CSR & ICR Data', hinglish: 'Claim Settlement Data', icon: Shield, source: 'IRDAI Handbook 2025-26', records: 21 },
  penetration: { label: 'Insurance Penetration', hinglish: 'Insurance Penetration', icon: Globe, source: 'Swiss Re / Economic Survey', records: 5 },
  motor: { label: 'Motor Premium Trends', hinglish: 'Motor Premium Trends', icon: BarChart3, source: 'IRDAI Motor Reports', records: 5 },
  solvency: { label: 'Solvency Ratio', hinglish: 'Solvency Ratio', icon: TrendingUp, source: 'IRDAI Solvency Report', records: 15 },
  medicalInflation: { label: 'Medical Inflation', hinglish: 'Medical Inflation', icon: Activity, source: 'NHFS / IRDAI Data', records: 6 },
  ombudsman: { label: 'Ombudsman Cases', hinglish: 'Ombudsman Data', icon: FileText, source: 'IRDAI Ombudsman Report', records: 5 },
  evInsurance: { label: 'EV Insurance', hinglish: 'EV Insurance Data', icon: Zap, source: 'IRDAI EV Insurance Data', records: 4 },
  claimAutomation: { label: 'Claim Automation', hinglish: 'Claim Automation Rules', icon: CheckCircle2, source: 'IRDAI FMU Guidelines 2026', records: 10 },
  protectionGap: { label: 'Protection Gap', hinglish: 'Protection Gap Analysis', icon: AlertTriangle, source: 'IRDAI Annual Reports', records: 8 },
  globalBenchmarks: { label: 'Global Benchmarks', hinglish: 'Global Benchmarks', icon: Globe, source: 'Swiss Re Sigma Report', records: 12 },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════════════════════════

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMs / 3600000);

    if (diffMin < 1) return 'Abhi abhi';
    if (diffMin < 60) return `${diffMin} min pehle`;
    if (diffHr < 24) return `${diffHr} ghante pehle`;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

function getNextRefreshCountdown(iso: string): string {
  try {
    const next = new Date(iso);
    const now = new Date();
    const diffMs = next.getTime() - now.getTime();
    if (diffMs <= 0) return 'Refreshing soon...';
    const diffHr = Math.floor(diffMs / 3600000);
    const diffMin = Math.floor((diffMs % 3600000) / 60000);
    if (diffHr > 0) return `${diffHr}h ${diffMin}m mein refresh`;
    return `${diffMin}m mein refresh`;
  } catch {
    return 'Calculating...';
  }
}

function getFreshnessIndicator(isStale: boolean, lastUpdated: string): {
  color: string;
  bgClass: string;
  label: string;
  dotColor: string;
} {
  try {
    const ageMs = Date.now() - new Date(lastUpdated).getTime();
    const ageHours = ageMs / 3600000;

    if (!isStale || ageHours < 12) {
      return { color: 'text-emerald-600 dark:text-emerald-400', bgClass: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800', label: 'Taza', dotColor: 'bg-emerald-500' };
    }
    if (ageHours < 24) {
      return { color: 'text-amber-600 dark:text-amber-400', bgClass: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800', label: 'Thoda purana', dotColor: 'bg-amber-500' };
    }
    return { color: 'text-red-600 dark:text-red-400', bgClass: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800', label: 'Bahut purana', dotColor: 'bg-red-500' };
  } catch {
    return { color: 'text-slate-600 dark:text-slate-400', bgClass: 'bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-700', label: 'Unknown', dotColor: 'bg-slate-400' };
  }
}

function getClassificationStyle(classification: string): {
  color: string;
  bg: string;
  border: string;
  emoji: string;
} {
  switch (classification) {
    case 'Best':
      return { color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-200 dark:border-emerald-800', emoji: '🟢' };
    case 'Good':
      return { color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-200 dark:border-amber-800', emoji: '🟡' };
    default:
      return { color: 'text-red-700 dark:text-red-300', bg: 'bg-red-50 dark:bg-red-950/40', border: 'border-red-200 dark:border-red-800', emoji: '🔴' };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SKELETON LOADER
// ═══════════════════════════════════════════════════════════════════════════════

function PipelineSkeleton() {
  return (
    <div className="space-y-6 p-6 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-8 w-32 rounded-lg bg-muted" />
        <div className="h-6 w-20 rounded-full bg-muted" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-muted" />
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="h-52 rounded-xl bg-muted" />
        <div className="h-52 rounded-xl bg-muted" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function DataPipelineStatus() {
  const [status, setStatus] = useState<PipelineStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [trustQuery, setTrustQuery] = useState('');
  const [trustResult, setTrustResult] = useState<TrustScoreResult | null>(null);
  const [trustLoading, setTrustLoading] = useState(false);
  const [trustError, setTrustError] = useState('');
  const [lastPoll, setLastPoll] = useState<Date>(new Date());

  // ── Fetch pipeline status ──────────────────────────────────────────────────
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/data-pipeline?dataset=status');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setStatus(json.data as PipelineStatus);
        }
      }
    } catch (err) {
      console.error('[DataPipelineStatus] Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Trust score lookup ─────────────────────────────────────────────────────
  const lookupTrustScore = useCallback(async () => {
    const insurer = trustQuery.trim();
    if (!insurer) return;

    setTrustLoading(true);
    setTrustError('');
    setTrustResult(null);

    try {
      const res = await fetch(`/api/data-pipeline?dataset=trust-score&insurer=${encodeURIComponent(insurer)}`);
      const json = await res.json();

      if (json.success && json.data) {
        setTrustResult({ ...json.data, insurer });
      } else {
        setTrustError(json.error || `"${insurer}" ke liye koi trust score nahi mila. Try: Star Health, Acko, HDFC ERGO`);
      }
    } catch {
      setTrustError('Network error. Please try again.');
    } finally {
      setTrustLoading(false);
    }
  }, [trustQuery]);

  // ── Manual refresh ─────────────────────────────────────────────────────────
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Note: refresh requires admin auth, so it may fail for public users — that's fine
      await fetch('/api/data-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'refresh' }),
      });
    } catch {
      // Non-admin users can't refresh — silently handle
    }
    // Re-fetch status regardless
    await fetchStatus();
    setRefreshing(false);
  }, [fetchStatus]);

  // ── Poll every 60 seconds ──────────────────────────────────────────────────
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(() => {
      fetchStatus();
      setLastPoll(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  // ── Keyboard handler for trust search ──────────────────────────────────────
  const handleTrustKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') lookupTrustScore();
  }, [lookupTrustScore]);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) return <PipelineSkeleton />;

  // ── Compute freshness counts ───────────────────────────────────────────────
  const freshnessEntries = status?.dataFreshness ? Object.entries(status.dataFreshness) : [];
  const freshCount = freshnessEntries.filter(([, v]) => !v.isStale).length;
  const staleCount = freshnessEntries.filter(([, v]) => v.isStale).length;

  return (
    <section id="data-pipeline" className="py-10 sm:py-16 lg:py-24 bg-background scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-14"
        >
          <Badge className="mb-4 bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800 rounded-full px-4 py-1">
            <Database className="w-3.5 h-3.5 mr-1" />
            Data Hub
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Data <span className="gradient-text">Tazagi</span> & Trust Score
          </h2>
          <p className="mt-4 text-sm sm:text-lg text-muted-foreground">
            IRDAI ka live data — har dataset ki freshness, trust scores, aur pipeline health ek nazar mein
          </p>
        </motion.div>

        {/* ── Top Bar: Pipeline Mode + Refresh + Auto-refresh ───────────────── */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-between gap-4 mb-6"
        >
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Pipeline Mode Badge */}
            <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border text-xs sm:text-sm font-semibold ${
              status?.mode === 'api'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
            }`}>
              <span className={`w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full ${status?.mode === 'api' ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`} />
              {status?.mode === 'api' ? 'API Mode' : 'Scraper Mode'}
              <Server className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>

            {/* Freshness summary */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-[10px] sm:text-xs font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {freshCount} Taza
            </div>
            {staleCount > 0 && (
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-[10px] sm:text-xs font-medium text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                {staleCount} Purana
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Auto-refresh countdown */}
            {status?.nextRefresh && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                <RefreshCw className="w-3 h-3" />
                {getNextRefreshCountdown(status.nextRefresh)}
              </div>
            )}

            {/* Manual Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="gap-1.5 rounded-lg border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/30"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh Karein'}
            </Button>
          </div>
        </motion.div>

        {/* ── Data Freshness Cards Grid ─────────────────────────────────────── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 mb-6 sm:mb-8"
        >
          {freshnessEntries.map(([key, entry]) => {
            const config = DATASET_CONFIG[key];
            if (!config) return null;
            const Icon = config.icon;
            const freshness = getFreshnessIndicator(entry.isStale, entry.lastUpdated);
            return (
              <motion.div key={key} variants={staggerItem}>
                <Card className={`glass-liquid border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${freshness.bgClass}`}>
                  <CardContent className="p-3 sm:p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${freshness.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${freshness.dotColor} ${!entry.isStale ? 'animate-pulse' : ''}`} />
                        <span className={`text-[10px] font-semibold ${freshness.color}`}>{freshness.label}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground truncate">{config.hinglish}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{config.records} records</p>
                    </div>
                    <div className="pt-1.5 border-t border-border/40">
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {formatTimestamp(entry.lastUpdated)}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 truncate" title={config.source}>
                        {config.source}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Main Content: Trust Score + Pipeline Metrics ──────────────────── */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          {/* ── Trust Score Lookup ──────────────────────────────────────────── */}
          <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Card className="glass-liquid border-0 rounded-2xl overflow-hidden h-full">
              <CardHeader className="pb-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                  Trust Score Lookup
                </CardTitle>
                <CardDescription className="text-teal-100 text-[11px] sm:text-sm">
                  Insurer ka naam daalein — CSR, ICR, classification ek nazar mein
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-5 space-y-4">
                {/* Search Input */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Insurer naam daalein (e.g., Star Health, Acko)"
                      value={trustQuery}
                      onChange={(e) => { setTrustQuery(e.target.value); if (trustError) setTrustError(''); }}
                      onKeyDown={handleTrustKeyDown}
                      className="h-11 pr-10 border-border/60 dark:border-white/10 bg-background text-sm"
                      aria-label="Insurer name for trust score lookup"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                  <Button
                    onClick={lookupTrustScore}
                    disabled={trustLoading || !trustQuery.trim()}
                    className="h-11 px-5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white gap-1.5 w-full sm:w-auto"
                  >
                    {trustLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    <span>Check</span>
                  </Button>
                </div>

                {/* Quick suggestions */}
                <div className="flex flex-wrap gap-1.5">
                  {['Star Health', 'Acko', 'HDFC ERGO', 'Care Health', 'Niva Bupa', 'LIC'].map((name) => (
                    <button
                      key={name}
                      onClick={() => { setTrustQuery(name); setTrustError(''); setTrustResult(null); }}
                      className="px-2 py-1 text-[10px] sm:text-[11px] font-medium rounded-full border border-border/60 bg-muted/50 hover:bg-teal-50 hover:border-teal-300 dark:hover:bg-teal-950/30 dark:hover:border-teal-700 transition-all text-muted-foreground hover:text-teal-700 dark:hover:text-teal-300 whitespace-nowrap"
                    >
                      {name}
                    </button>
                  ))}
                </div>

                {/* Error */}
                {trustError && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300"
                  >
                    <AlertTriangle className="w-4 h-4 inline mr-1.5" />
                    {trustError}
                  </motion.div>
                )}

                {/* Trust Score Result */}
                <AnimatePresence mode="wait">
                  {trustResult && (
                    <motion.div
                      key={trustResult.insurer}
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.3 }}
                    >
                      {(() => {
                        const style = getClassificationStyle(trustResult.classification);
                        return (
                          <div className={`rounded-xl border-2 p-3 sm:p-4 ${style.bg} ${style.border}`}>
                            {/* Classification Header */}
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <div className="flex items-center gap-2">
                                <span className="text-lg sm:text-xl">{style.emoji}</span>
                                <span className={`text-xs sm:text-sm font-bold ${style.color}`}>
                                  {trustResult.classification}
                                </span>
                              </div>
                              <Badge className={`${style.bg} ${style.color} ${style.border} border text-[9px] sm:text-xs whitespace-nowrap`}>
                                {trustResult.classification === 'Best' ? '>97% CSR' : trustResult.classification === 'Good' ? '90-97% CSR' : '<90% CSR'}
                              </Badge>
                            </div>

                            {/* CSR Value Display */}
                            <div className="flex items-baseline gap-2 mb-3">
                              <span className="text-2xl sm:text-3xl font-extrabold text-foreground">{trustResult.csr}%</span>
                              <span className="text-xs sm:text-sm text-muted-foreground">CSR</span>
                            </div>

                            {/* CSR Progress Bar */}
                            <div className="mb-3 sm:mb-4">
                              <Progress
                                value={trustResult.csr}
                                className="h-2 sm:h-2.5 bg-muted"
                              />
                              <div className="flex justify-between mt-1 text-[9px] sm:text-[10px] text-muted-foreground">
                                <span>0%</span>
                                <span className="text-amber-600 dark:text-amber-400">90% Good</span>
                                <span className="text-emerald-600 dark:text-emerald-400">97% Best</span>
                              </div>
                            </div>

                            {/* Comparison Format */}
                            {trustResult.insurer && (
                              <div className="p-2.5 sm:p-3 rounded-lg bg-background/80 border border-border/50 mb-2.5 sm:mb-3">
                                <p className="text-xs sm:text-sm font-medium text-foreground leading-relaxed">
                                  {trustResult.insurer}{' '}
                                  <span className={style.color}>{trustResult.csr}%</span>
                                  {trustResult.classification === 'Needs Improvement' && (
                                    <>
                                      {' '}vs Acko{' '}
                                      <span className="text-emerald-600 dark:text-emerald-400">99.91%</span>
                                      : <span className="text-red-600 dark:text-red-400 font-semibold">Major red flag</span>
                                    </>
                                  )}
                                  {trustResult.classification === 'Good' && (
                                    <>
                                      {' '}— <span className="text-amber-600 dark:text-amber-400 font-semibold">Decent, lekin Best se kam</span>
                                    </>
                                  )}
                                  {trustResult.classification === 'Best' && (
                                    <>
                                      {' '}— <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Bahut reliable!</span>
                                    </>
                                  )}
                                </p>
                              </div>
                            )}

                            {/* Hinglish Explanation */}
                            <div className="p-2.5 sm:p-3 rounded-lg bg-background/50 border border-border/30">
                              <p className="text-[11px] sm:text-xs text-muted-foreground flex items-start gap-1.5">
                                <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-teal-500" />
                                {trustResult.hinglishExplanation}
                              </p>
                            </div>

                            {/* Source */}
                            <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              Source: {trustResult.source}
                            </p>
                          </div>
                        );
                      })()}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Empty state */}
                {!trustResult && !trustError && !trustLoading && (
                  <div className="text-center py-6 sm:py-8">
                    <Shield className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-muted-foreground/30 mb-2 sm:mb-3" />
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Insurer ka naam daalein aur Trust Score dekhein
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground/60 mt-1">
                      CSR, ICR, classification — sab ek jagah
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* ── Pipeline Metrics ────────────────────────────────────────────── */}
          <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Card className="glass-liquid border-0 rounded-2xl overflow-hidden h-full">
              <CardHeader className="pb-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
                  Pipeline Metrics
                </CardTitle>
                <CardDescription className="text-violet-100 text-[11px] sm:text-sm">
                  Data pipeline ka health dashboard — cache, errors, aur performance
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-5 space-y-4 sm:space-y-5">
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {/* Cache Hit Rate */}
                  <div className="p-2.5 sm:p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                      <HardDrive className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-[10px] sm:text-xs font-semibold text-emerald-700 dark:text-emerald-300">Cache Hit Rate</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">{status?.cacheHitRate ?? 0}%</p>
                    <Progress value={status?.cacheHitRate ?? 0} className="h-1.5 mt-1.5 sm:mt-2 bg-emerald-200 dark:bg-emerald-900" />
                  </div>

                  {/* Total Requests */}
                  <div className="p-2.5 sm:p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                      <Wifi className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-[10px] sm:text-xs font-semibold text-blue-700 dark:text-blue-300">Total Requests</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-extrabold text-blue-700 dark:text-blue-300">{status?.totalRequests ?? 0}</p>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1">Since last restart</p>
                  </div>

                  {/* API Errors */}
                  <div className="p-2.5 sm:p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                      <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 dark:text-red-400" />
                      <span className="text-[10px] sm:text-xs font-semibold text-red-700 dark:text-red-300">API Errors</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-extrabold text-red-700 dark:text-red-300">{status?.apiErrors ?? 0}</p>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1">
                      {status?.apiErrors === 0 ? 'Sab theek hai! 🎉' : 'Kuch issues hain'}
                    </p>
                  </div>

                  {/* Static Fallback Count */}
                  <div className="p-2.5 sm:p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                      <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
                      <span className="text-[10px] sm:text-xs font-semibold text-amber-700 dark:text-amber-300">Static Fallback</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-extrabold text-amber-700 dark:text-amber-300">{status?.staticFallbackCount ?? 0}</p>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1">
                      {status?.staticFallbackCount === 0 ? 'Live data use ho raha hai' : 'Static data pe fallback'}
                    </p>
                  </div>
                </div>

                {/* Pipeline Health Summary */}
                <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 border border-teal-200 dark:border-teal-800">
                  <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                    <span className="text-xs sm:text-sm font-semibold text-teal-700 dark:text-teal-300">Pipeline Health</span>
                    <Badge className={`${
                      (status?.apiErrors ?? 0) === 0
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                    } border text-[9px] sm:text-xs`}>
                      {(status?.apiErrors ?? 0) === 0 ? '✅ Healthy' : '⚠️ Degraded'}
                    </Badge>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    {/* Last Refresh */}
                    <div className="flex items-center justify-between text-[10px] sm:text-xs">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <RefreshCw className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        Last Refresh
                      </span>
                      <span className="font-medium text-foreground text-right ml-2 truncate max-w-[120px] sm:max-w-none">
                        {status?.lastRefresh ? formatTimestamp(status.lastRefresh) : 'N/A'}
                      </span>
                    </div>

                    {/* Next Refresh */}
                    <div className="flex items-center justify-between text-[10px] sm:text-xs">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        Next Refresh
                      </span>
                      <span className="font-medium text-foreground text-right ml-2 truncate max-w-[120px] sm:max-w-none">
                        {status?.nextRefresh ? getNextRefreshCountdown(status.nextRefresh) : 'N/A'}
                      </span>
                    </div>

                    {/* Mode */}
                    <div className="flex items-center justify-between text-[10px] sm:text-xs">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Server className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        Data Mode
                      </span>
                      <span className={`font-medium ${status?.mode === 'api' ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`}>
                        {status?.mode === 'api' ? 'API (Live)' : 'Scraper (Cached)'}
                      </span>
                    </div>

                    {/* Auto-refresh indicator */}
                    <div className="flex items-center justify-between text-[10px] sm:text-xs">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <CircleDot className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        Auto-refresh
                      </span>
                      <span className="font-medium text-foreground flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Every 60s
                      </span>
                    </div>
                  </div>
                </div>

                {/* Data Flow Diagram */}
                <div className="p-3 sm:p-4 rounded-xl bg-muted/40 border border-border/40">
                  <p className="text-[10px] sm:text-xs font-semibold text-foreground mb-2 sm:mb-3">Data Flow</p>
                  {/* Desktop: Horizontal layout */}
                  <div className="hidden sm:flex items-center gap-2 text-[10px] overflow-x-auto pb-1">
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 whitespace-nowrap border border-blue-200 dark:border-blue-800">
                      <Server className="w-3 h-3" />
                      {status?.mode === 'api' ? 'API' : 'Scraper'}
                    </div>
                    <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 whitespace-nowrap border border-emerald-200 dark:border-emerald-800">
                      <HardDrive className="w-3 h-3" />
                      Cache (12h TTL)
                    </div>
                    <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 whitespace-nowrap border border-amber-200 dark:border-amber-800">
                      <Database className="w-3 h-3" />
                      Static Fallback
                    </div>
                    <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-teal-100 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 whitespace-nowrap border border-teal-200 dark:border-teal-800">
                      <Zap className="w-3 h-3" />
                      Your Screen
                    </div>
                  </div>
                  {/* Mobile: Vertical stacked layout */}
                  <div className="sm:hidden space-y-1.5 text-[10px]">
                    <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      <Server className="w-3 h-3" />
                      {status?.mode === 'api' ? 'API' : 'Scraper'}
                    </div>
                    <div className="flex justify-center">
                      <ChevronRight className="w-3 h-3 text-muted-foreground rotate-90" />
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <HardDrive className="w-3 h-3" />
                      Cache (12h TTL)
                    </div>
                    <div className="flex justify-center">
                      <ChevronRight className="w-3 h-3 text-muted-foreground rotate-90" />
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      <Database className="w-3 h-3" />
                      Static Fallback
                    </div>
                    <div className="flex justify-center">
                      <ChevronRight className="w-3 h-3 text-muted-foreground rotate-90" />
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-teal-100 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                      <Zap className="w-3 h-3" />
                      Your Screen
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ── IRDAI Disclaimer ──────────────────────────────────────────────── */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-8 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50"
        >
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-1">IRDAI Disclaimer</p>
              <p className="text-[11px] text-amber-700 dark:text-amber-400/80 leading-relaxed">
                Yeh data IRDAI Handbook 2025-26, Annual Reports, Swiss Re Sigma Reports, aur official sources se liya gaya hai.
                Trust scores CSR (Claim Settlement Ratio) pe based hain aur sirf informative purpose ke liye hain.
                Actual claim approval insurer ki underwriting policy pe depend karta hai.
                Data 12-hour cache ke saath serve hota hai — real-time accuracy guaranteed nahi hai.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
