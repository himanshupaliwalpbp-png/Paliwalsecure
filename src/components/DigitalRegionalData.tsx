'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp,
  MapPin,
  BarChart3,
  Globe,
  ArrowUpRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Source: IRDAI Digital Report 2025, Economic Survey 2025, Swiss Re

// ── Sum Insured Shift Data ───────────────────────────────
const sumInsuredData = [
  { range: '₹10–14L', fy22: 27, fy26: 47 },
  { range: '₹5–9L', fy22: 38, fy26: 29 },
  { range: '₹15–24L', fy22: 20, fy26: 16 },
  { range: '₹25L+', fy22: 15, fy26: 8 },
];

// ── Online Insurance Market Data ─────────────────────────
const onlineMarketData = [
  { year: '2026', value: 283 },
  { year: '2027', value: 323 },
  { year: '2028', value: 369 },
  { year: '2029', value: 421 },
  { year: '2030', value: 481 },
  { year: '2031', value: 550 },
];

// ── Custom Tooltip for Sum Insured ───────────────────────
function SumInsuredTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg shadow-xl p-3">
      <p className="text-xs font-bold text-foreground mb-2">{label} Sum Insured</p>
      {payload.map((entry, idx) => (
        <div key={idx} className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground">{entry.dataKey === 'fy22' ? 'FY22' : 'FY26'}</span>
          <span className="font-bold text-foreground ml-auto">{entry.value}%</span>
        </div>
      ))}
    </div>
  );
}

// ── Custom Tooltip for Online Market ─────────────────────
function OnlineMarketTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg shadow-xl p-3">
      <p className="text-xs font-bold text-foreground mb-1">{label}</p>
      <p className="text-sm font-semibold text-teal-600 dark:text-teal-400">USD {payload[0].value}M</p>
      <p className="text-[10px] text-muted-foreground">Online Insurance Market</p>
    </div>
  );
}

// ── Animation Variants ───────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ── Main Component ───────────────────────────────────────
export default function DigitalRegionalData() {
  return (
    <section id="digital-regional" className="py-16 sm:py-20 bg-background scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <Badge className="mb-4 bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800 rounded-full px-4 py-1">
            <Globe className="w-3.5 h-3.5 mr-1" />
            Digital & Regional Trends
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Digital Adoption & <span className="gradient-text">Regional Growth</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Tier-2/3 cities ka growth, sum insured shift, aur online insurance market ka future
          </p>
        </motion.div>

        {/* ── Top Row: Tier-2/3 Growth + GDP Card ───────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6"
        >
          {/* Tier-2/3 City Growth Card */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden border-0 shadow-lg h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/40 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">Tier-2/3 City Growth</CardTitle>
                    <CardDescription className="text-[11px]">New health policies from non-metro cities</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="rounded-xl bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800/40 p-5">
                  <div className="flex items-end justify-between mb-3">
                    <div>
                      <p className="text-xs text-cyan-600 dark:text-cyan-400 font-medium mb-1">Share of New Health Policies</p>
                      <p className="text-4xl font-extrabold text-cyan-700 dark:text-cyan-300">62%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">from Tier-2/3</p>
                      <Badge className="bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300 border-0 text-[10px] mt-1">
                        <ArrowUpRight className="w-3 h-3 mr-0.5" />
                        Growing Fast
                      </Badge>
                    </div>
                  </div>
                  <Progress value={62} className="h-3 bg-cyan-200/60 dark:bg-cyan-800/30 [&>div]:bg-gradient-to-r [&>div]:from-cyan-400 [&>div]:to-cyan-600" />
                  <p className="text-[10px] text-muted-foreground mt-2">
                    62% of new health policies ab Tier-2/3 cities se aa rahe hain — digital penetration ka asar
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* GDP Growth Connection Card */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden border-0 shadow-lg h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">GDP Growth Connection</CardTitle>
                    <CardDescription className="text-[11px]">Economic growth driving insurance demand</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 p-5">
                  <div className="flex items-end justify-between mb-3">
                    <div>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-1">India GDP Growth Rate</p>
                      <p className="text-4xl font-extrabold text-emerald-700 dark:text-emerald-300">7.3%</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-0 text-[10px]">
                        <TrendingUp className="w-3 h-3 mr-0.5" />
                        Driving Insurance
                      </Badge>
                    </div>
                  </div>
                  <Progress value={73} className="h-3 bg-emerald-200/60 dark:bg-emerald-800/30 [&>div]:bg-gradient-to-r [&>div]:from-emerald-400 [&>div]:to-emerald-600" />
                  <p className="text-[10px] text-muted-foreground mt-2">
                    7.3% GDP growth insurance demand drive kar rahi hai — higher income = more insurance awareness
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* ── Bottom Row: Sum Insured + Online Market Charts ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid lg:grid-cols-2 gap-4 sm:gap-6"
        >
          {/* Sum Insured Shift Chart */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden border-0 shadow-lg h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">Sum Insured Shift</CardTitle>
                    <CardDescription className="text-[11px]">₹10–14L range mein big jump — FY22 vs FY26</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[260px] sm:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sumInsuredData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }} barGap={6}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis
                        dataKey="range"
                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        tickLine={false}
                        tickFormatter={(v: number) => `${v}%`}
                        domain={[0, 55]}
                      />
                      <RechartsTooltip content={<SumInsuredTooltip />} />
                      <Bar
                        dataKey="fy22"
                        name="FY22"
                        fill="#94a3b8"
                        radius={[4, 4, 0, 0]}
                        barSize={28}
                      />
                      <Bar
                        dataKey="fy26"
                        name="FY26"
                        fill="#f59e0b"
                        radius={[4, 4, 0, 0]}
                        barSize={28}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {/* Highlight box */}
                <div className="mt-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 p-3">
                  <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                    📈 <span className="font-bold">₹10–14L sum insured</span> range mein share <span className="font-bold">27% → 47%</span> tak badh gaya — log ab better coverage choose kar rahe hain.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Online Insurance Market Chart */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden border-0 shadow-lg h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">Online Insurance Market</CardTitle>
                    <CardDescription className="text-[11px]">USD 283M (2026) → USD 550M (2031) at 14.18% CAGR</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[260px] sm:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={onlineMarketData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="onlineGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis
                        dataKey="year"
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        tickLine={false}
                        tickFormatter={(v: number) => `$${v}M`}
                        domain={[200, 600]}
                      />
                      <RechartsTooltip content={<OnlineMarketTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#14b8a6"
                        strokeWidth={3}
                        fill="url(#onlineGradient)"
                        dot={{ r: 5, strokeWidth: 2, fill: '#fff', stroke: '#14b8a6' }}
                        activeDot={{ r: 7, strokeWidth: 2, stroke: '#14b8a6' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                {/* CAGR Highlight */}
                <div className="mt-3 rounded-lg bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/40 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-teal-700 dark:text-teal-300 leading-relaxed">
                      🚀 Online insurance market <span className="font-bold">14.18% CAGR</span> se grow kar raha hai — 2026 mein USD 283M se 2031 mein USD 550M tak.
                    </p>
                    <Badge className="bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border-0 text-[10px] ml-2 shrink-0">
                      14.18% CAGR
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Source Attribution */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[10px] text-muted-foreground/60 mt-6 text-center"
        >
          {'// Source: IRDAI Digital Report 2025, Economic Survey 2025, Swiss Re'}
        </motion.p>
      </div>
    </section>
  );
}
