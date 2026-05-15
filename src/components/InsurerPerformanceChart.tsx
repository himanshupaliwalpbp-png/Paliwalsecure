'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  ShieldCheck,
  Info,
  BarChart3,
  AlertCircle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip as UiTooltip,
  TooltipContent as UiTooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// ── Types ─────────────────────────────────────────────────
interface InsurerData {
  name: string;
  shortName: string;
  csr: number[];
  icr: number[];
  color: string;
  icrColor: string;
}

interface ChartDataPoint {
  year: number;
  [key: string]: number | undefined;
}

// ── Mock Data (IRDAI-based) ──────────────────────────────
const YEARS = [2021, 2022, 2023, 2024, 2025];

const INSURERS: InsurerData[] = [
  {
    name: 'HDFC ERGO',
    shortName: 'hdfc',
    csr: [92.5, 94.2, 96.1, 97.8, 99.16],
    icr: [78.5, 81.2, 84.5, 87.3, 89.47],
    color: '#6366f1', // indigo
    icrColor: '#818cf8',
  },
  {
    name: 'Star Health',
    shortName: 'star',
    csr: [82.1, 84.5, 87.3, 90.2, 92.02],
    icr: [55.2, 58.7, 62.1, 65.3, 67.26],
    color: '#f43f5e', // rose
    icrColor: '#fb7185',
  },
  {
    name: 'Care Health',
    shortName: 'care',
    csr: [88.3, 91.2, 94.5, 97.1, 100],
    icr: [48.5, 52.3, 55.1, 57.8, 58.68],
    color: '#10b981', // emerald
    icrColor: '#34d399',
  },
  {
    name: 'Niva Bupa',
    shortName: 'niva',
    csr: [85.2, 88.7, 92.3, 96.5, 100],
    icr: [42.1, 47.5, 52.3, 56.1, 58.10],
    color: '#f59e0b', // amber
    icrColor: '#fbbf24',
  },
  {
    name: 'Acko',
    shortName: 'acko',
    csr: [90.1, 93.5, 96.8, 98.5, 99.91],
    icr: [55.3, 60.2, 65.7, 72.1, 81.23],
    color: '#8b5cf6', // violet
    icrColor: '#a78bfa',
  },
];

// ── Custom Tooltip Component ─────────────────────────────
function CustomTooltip({
  active,
  payload,
  label,
  selectedInsurer,
}: {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number; color: string }>;
  label?: string | number;
  selectedInsurer: string;
}) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-card border border-border rounded-xl shadow-xl p-3 min-w-[180px]">
      <p className="text-sm font-bold text-foreground mb-2">
        📅 {label}
      </p>
      <div className="space-y-1.5">
        {payload.map((entry, idx) => {
          const isCsr = entry.dataKey.endsWith('_csr');
          const isIcr = entry.dataKey.endsWith('_icr');
          const insurerKey = entry.dataKey.replace(/_csr$|_icr$/, '');
          const insurer = INSURERS.find((i) => i.shortName === insurerKey);

          return (
            <div key={idx} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-muted-foreground">
                  {insurer ? (isCsr ? `${insurer.name} CSR` : `${insurer.name} ICR`) : entry.dataKey}
                </span>
              </div>
              <span className="text-xs font-bold text-foreground">
                {entry.value}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Custom Legend Component ──────────────────────────────
function CustomLegend({
  payload,
  selectedInsurer,
}: {
  payload?: Array<{ value: string; color: string; dataKey: string }>;
  selectedInsurer: string;
}) {
  if (!payload) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-2">
      {payload.map((entry, idx) => {
        const isIcr = entry.dataKey.endsWith('_icr');
        const insurerKey = entry.dataKey.replace(/_csr$|_icr$/, '');
        const insurer = INSURERS.find((i) => i.shortName === insurerKey);
        const displayName = insurer
          ? isIcr
            ? `${insurer.name} ICR`
            : insurer.name
          : entry.value;

        return (
          <div key={idx} className="flex items-center gap-1.5">
            <span
              className={`w-3 h-0.5 rounded-full ${isIcr ? 'border-t-2 border-dashed' : ''}`}
              style={{
                backgroundColor: isIcr ? 'transparent' : entry.color,
                borderColor: isIcr ? entry.color : 'transparent',
                borderWidth: isIcr ? '2px' : '0',
                width: isIcr ? '16px' : '12px',
                height: isIcr ? '0' : '3px',
              }}
            />
            <span className="text-[11px] text-muted-foreground font-medium">
              {displayName}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Info Tooltip Helper ──────────────────────────────────
function InfoTip({ text }: { text: string }) {
  return (
    <TooltipProvider delayDuration={0}>
      <UiTooltip>
        <TooltipTrigger asChild>
          <button
            className="inline-flex items-center text-muted-foreground hover:text-blue-500 transition-colors"
            aria-label="Info"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </TooltipTrigger>
        <UiTooltipContent side="top" className="max-w-[240px] text-xs leading-relaxed">
          {text}
        </UiTooltipContent>
      </UiTooltip>
    </TooltipProvider>
  );
}

// ── Main Component ───────────────────────────────────────
export default function InsurerPerformanceChart() {
  const [selectedInsurer, setSelectedInsurer] = useState<string>('hdfc');

  // Build chart data based on selection
  const chartData = useMemo<ChartDataPoint[]>(() => {
    return YEARS.map((year, idx) => {
      const point: ChartDataPoint = { year };

      if (selectedInsurer === 'all') {
        // All insurers mode — CSR only
        INSURERS.forEach((ins) => {
          point[`${ins.shortName}_csr`] = ins.csr[idx];
        });
      } else {
        // Single insurer — CSR + ICR
        const ins = INSURERS.find((i) => i.shortName === selectedInsurer);
        if (ins) {
          point[`${ins.shortName}_csr`] = ins.csr[idx];
          point[`${ins.shortName}_icr`] = ins.icr[idx];
        }
      }

      return point;
    });
  }, [selectedInsurer]);

  // Build lines based on selection
  const lines = useMemo(() => {
    if (selectedInsurer === 'all') {
      return INSURERS.map((ins) => (
        <Line
          key={`${ins.shortName}_csr`}
          yAxisId="csr"
          type="monotone"
          dataKey={`${ins.shortName}_csr`}
          stroke={ins.color}
          strokeWidth={2.5}
          dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
          activeDot={{ r: 6, strokeWidth: 2 }}
          name={ins.name}
        />
      ));
    }

    const ins = INSURERS.find((i) => i.shortName === selectedInsurer);
    if (!ins) return null;

    return (
      <>
        <Line
          yAxisId="csr"
          type="monotone"
          dataKey={`${ins.shortName}_csr`}
          stroke={ins.color}
          strokeWidth={3}
          dot={{ r: 5, strokeWidth: 2, fill: '#fff' }}
          activeDot={{ r: 7, strokeWidth: 2 }}
          name={`${ins.name} CSR`}
        />
        <Line
          yAxisId="icr"
          type="monotone"
          dataKey={`${ins.shortName}_icr`}
          stroke={ins.icrColor}
          strokeWidth={2.5}
          strokeDasharray="8 4"
          dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
          activeDot={{ r: 6, strokeWidth: 2 }}
          name={`${ins.name} ICR`}
        />
      </>
    );
  }, [selectedInsurer]);

  // Table data for selected insurer
  const tableData = useMemo(() => {
    if (selectedInsurer === 'all') {
      return YEARS.map((year, idx) => {
        const row: { year: number; [key: string]: number | string } = { year };
        INSURERS.forEach((ins) => {
          row[`${ins.shortName}_csr`] = ins.csr[idx];
        });
        return row;
      });
    }

    const ins = INSURERS.find((i) => i.shortName === selectedInsurer);
    if (!ins) return [];

    return YEARS.map((year, idx) => ({
      year,
      csr: ins.csr[idx],
      icr: ins.icr[idx],
    }));
  }, [selectedInsurer]);

  // Get current insurer object
  const currentInsurer = INSURERS.find((i) => i.shortName === selectedInsurer);

  // CSR trend indicator
  const csrTrend = useMemo(() => {
    if (selectedInsurer === 'all') return null;
    const ins = INSURERS.find((i) => i.shortName === selectedInsurer);
    if (!ins) return null;
    const latest = ins.csr[ins.csr.length - 1];
    const prev = ins.csr[ins.csr.length - 2];
    return {
      latest,
      change: latest - prev,
      positive: latest >= prev,
    };
  }, [selectedInsurer]);

  const icrTrend = useMemo(() => {
    if (selectedInsurer === 'all') return null;
    const ins = INSURERS.find((i) => i.shortName === selectedInsurer);
    if (!ins) return null;
    const latest = ins.icr[ins.icr.length - 1];
    const prev = ins.icr[ins.icr.length - 2];
    return {
      latest,
      change: latest - prev,
      positive: latest >= prev,
    };
  }, [selectedInsurer]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <Card className="overflow-hidden border-0 shadow-xl rounded-2xl bg-card">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-6 py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">CSR & ICR Trends</h3>
                <p className="text-white/80 text-xs">
                  Claim Settlement Ratio aur Incurred Claim Ratio ka 5-year trend
                </p>
              </div>
            </div>

            {/* Insurer Selector */}
            <div className="flex items-center gap-2">
              <span className="text-white/70 text-xs font-medium hidden sm:inline">
                Insurer Select Karein:
              </span>
              <Select value={selectedInsurer} onValueChange={setSelectedInsurer}>
                <SelectTrigger className="w-[180px] bg-white/15 border-white/25 text-white rounded-xl h-9 text-sm backdrop-blur-sm hover:bg-white/25 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Insurers (Compare)</SelectItem>
                  {INSURERS.map((ins) => (
                    <SelectItem key={ins.shortName} value={ins.shortName}>
                      {ins.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <CardContent className="p-4 sm:p-6">
          {/* Quick Stats Cards (single insurer mode) */}
          <AnimatePresence mode="wait">
            {selectedInsurer !== 'all' && currentInsurer && csrTrend && icrTrend && (
              <motion.div
                key={selectedInsurer}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 gap-3 mb-6"
              >
                {/* CSR Quick Stat */}
                <div className="rounded-xl border border-border bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      CSR (2025)
                      <InfoTip text="Claim Settlement Ratio — kitne claims settle kiye gaye. Zyada CSR = zyada reliable insurer." />
                    </span>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] px-1.5 py-0 ${
                        csrTrend.positive
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                      }`}
                    >
                      {csrTrend.positive ? '↑' : '↓'} {Math.abs(csrTrend.change).toFixed(2)}%
                    </Badge>
                  </div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-foreground">
                    {csrTrend.latest}%
                  </p>
                </div>

                {/* ICR Quick Stat */}
                <div className="rounded-xl border border-border bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                      ICR (2025)
                      <InfoTip text="Incurred Claim Ratio — claims ka total premium ka kitna percent hai. ICR <100% = insurer profitable, >100% = insurer loss mein." />
                    </span>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] px-1.5 py-0 ${
                        icrTrend.positive
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                      }`}
                    >
                      {icrTrend.positive ? '↑' : '↓'} {Math.abs(icrTrend.change).toFixed(2)}%
                    </Badge>
                  </div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-foreground">
                    {icrTrend.latest}%
                  </p>
                </div>
              </motion.div>
            )}

            {/* All Insurers mode — color legend cards */}
            {selectedInsurer === 'all' && (
              <motion.div
                key="all-legend"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-wrap gap-2 mb-5"
              >
                {INSURERS.map((ins) => (
                  <div
                    key={ins.shortName}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card"
                  >
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: ins.color }}
                    />
                    <span className="text-xs font-medium text-foreground">
                      {ins.name}
                    </span>
                    <Badge variant="outline" className="text-[9px] px-1 py-0 ml-1">
                      CSR
                    </Badge>
                  </div>
                ))}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-border bg-muted/30">
                  <AlertCircle className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">
                    ICR hidden in compare mode
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full overflow-x-auto"
          >
            <div className="min-w-[400px] h-[320px] sm:h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: selectedInsurer === 'all' ? 20 : 40, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={false}
                  />
                  {/* CSR Y-axis (left) */}
                  <YAxis
                    yAxisId="csr"
                    orientation="left"
                    domain={selectedInsurer === 'all' ? [75, 105] : [40, 105]}
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={false}
                    tickFormatter={(v: number) => `${v}%`}
                    label={{
                      value: 'CSR %',
                      angle: -90,
                      position: 'insideLeft',
                      style: { fontSize: 11, fill: 'hsl(var(--muted-foreground))' },
                    }}
                  />
                  {/* ICR Y-axis (right) — only in single insurer mode */}
                  {selectedInsurer !== 'all' && (
                    <YAxis
                      yAxisId="icr"
                      orientation="right"
                      domain={[30, 100]}
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                      tickLine={false}
                      tickFormatter={(v: number) => `${v}%`}
                      label={{
                        value: 'ICR %',
                        angle: 90,
                        position: 'insideRight',
                        style: { fontSize: 11, fill: 'hsl(var(--muted-foreground))' },
                      }}
                    />
                  )}
                  <Tooltip
                    content={<CustomTooltip selectedInsurer={selectedInsurer} />}
                  />
                  <Legend
                    content={<CustomLegend selectedInsurer={selectedInsurer} />}
                  />

                  {/* 100% CSR reference line */}
                  <ReferenceLine
                    yAxisId="csr"
                    y={100}
                    stroke="hsl(var(--muted-foreground))"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                    opacity={0.5}
                    label={{
                      value: '100% CSR',
                      position: 'left',
                      style: { fontSize: 10, fill: 'hsl(var(--muted-foreground))' },
                    }}
                  />

                  {/* Lines */}
                  {lines}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Chart explanation note */}
          <div className="flex items-start gap-2 mt-4 mb-6 px-1">
            <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center shrink-0 mt-0.5">
              <Info className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {selectedInsurer === 'all'
                ? 'Compare mode mein sirf CSR lines dikhti hain clarity ke liye. Kisi bhi insurer ka detailed ICR dekhne ke liye individually select karein.'
                : 'Solid line = CSR (Claim Settlement Ratio), Dashed line = ICR (Incurred Claim Ratio). CSR zyada = better claim settlement, ICR <100% = insurer profitable.'}
            </p>
          </div>

          {/* Data Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="bg-muted/40 px-4 py-2.5 border-b border-border">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-muted-foreground" />
                  Exact Values — Year Wise Data
                </h4>
              </div>

              <div className="overflow-x-auto max-h-64 overflow-y-auto">
                {selectedInsurer === 'all' ? (
                  /* All insurers table */
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/20">
                        <TableHead className="text-xs font-bold">Year</TableHead>
                        {INSURERS.map((ins) => (
                          <TableHead
                            key={ins.shortName}
                            className="text-xs font-bold text-center"
                          >
                            <div className="flex items-center justify-center gap-1">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: ins.color }}
                              />
                              {ins.name}
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tableData.map((row, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="text-xs font-semibold text-foreground">
                            {row.year}
                          </TableCell>
                          {INSURERS.map((ins) => (
                            <TableCell key={ins.shortName} className="text-xs text-center">
                              <span
                                className="font-medium"
                                style={{ color: ins.color }}
                              >
                                {(row as Record<string, number | string>)[`${ins.shortName}_csr`]}%
                              </span>
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  /* Single insurer table */
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/20">
                        <TableHead className="text-xs font-bold">Year</TableHead>
                        <TableHead className="text-xs font-bold text-center">
                          <div className="flex items-center justify-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                            CSR (%)
                          </div>
                        </TableHead>
                        <TableHead className="text-xs font-bold text-center">
                          <div className="flex items-center justify-center gap-1">
                            <TrendingUp className="w-3 h-3 text-amber-500" />
                            ICR (%)
                          </div>
                        </TableHead>
                        <TableHead className="text-xs font-bold text-center">
                          Assessment
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tableData.map((row, idx) => {
                        const r = row as { year: number; csr: number; icr: number };
                        const isLatestYear = idx === tableData.length - 1;
                        const assessment = r.csr >= 95
                          ? { label: 'Excellent', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30' }
                          : r.csr >= 90
                            ? { label: 'Good', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30' }
                            : r.csr >= 85
                              ? { label: 'Average', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30' }
                              : { label: 'Below Avg', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/30' };

                        return (
                          <TableRow key={idx} className={isLatestYear ? 'bg-emerald-50/30 dark:bg-emerald-950/10' : ''}>
                            <TableCell className="text-xs font-semibold text-foreground">
                              {r.year}
                              {isLatestYear && (
                                <Badge className="ml-1.5 text-[8px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-0 rounded px-1 py-0">
                                  Latest
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-xs text-center">
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                {r.csr}%
                              </span>
                            </TableCell>
                            <TableCell className="text-xs text-center">
                              <span className="font-medium text-amber-600 dark:text-amber-400">
                                {r.icr}%
                              </span>
                            </TableCell>
                            <TableCell className="text-xs text-center">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${assessment.color} ${assessment.bg}`}>
                                {assessment.label}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="mt-4 flex items-start gap-2 px-1"
          >
            <AlertCircle className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground/70 leading-relaxed">
              Data source: IRDAI Annual Reports. CSR aur ICR values indicative hain aur actual values mein thoda farq ho sakta hai.
              ICR &gt;100% ka matlab insurer ko loss ho raha hai claims par. CSR zyada hone ka matlab aapki claim zyada probability se settle hogi.
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
