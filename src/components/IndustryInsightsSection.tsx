'use client';

import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
} from 'recharts';
import {
  TrendingUp,
  IndianRupee,
  BarChart3,
  Globe,
  Smartphone,
  MapPin,
  Activity,
  Wifi,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// ── Data ────────────────────────────────────────────────────────────────────

const marketSizeCards = [
  {
    title: 'Total Premium',
    value: '₹11.9L Cr',
    subtitle: 'FY25',
    icon: IndianRupee,
    source: 'IRDAI Annual Report FY25',
  },
  {
    title: 'Gross Written Premium',
    value: '₹3.6 Trillion',
    subtitle: 'GWP FY25',
    icon: TrendingUp,
    source: 'IRDAI Annual Report FY25',
  },
  {
    title: 'Assets Under Management',
    value: '₹74.4L Cr',
    subtitle: 'AUM',
    icon: BarChart3,
    source: 'IRDAI Annual Report FY25',
  },
];

const gwpProjectionData = [
  { year: 'FY26', gwp: 3.96 },
  { year: 'FY27', gwp: 4.36 },
  { year: 'FY28', gwp: 4.79 },
  { year: 'FY29', gwp: 5.27 },
  { year: 'FY30', gwp: 5.40 },
];

const marketSizeData = [
  { year: 'FY21', premium: 830000 },
  { year: 'FY22', premium: 950000 },
  { year: 'FY23', premium: 1050000 },
  { year: 'FY24', premium: 1120000 },
  { year: 'FY25', premium: 1190000 },
  { year: 'FY26', premium: 1320000 },
];

const onlineMarketData = [
  { year: '2025', marketSize: 248.08 },
  { year: '2026', marketSize: 283.26 },
  { year: '2027', marketSize: 323.5 },
  { year: '2028', marketSize: 369.5 },
  { year: '2029', marketSize: 422.0 },
  { year: '2030', marketSize: 481.8 },
  { year: '2031', marketSize: 549.89 },
];

const segmentData = [
  { name: 'Health', value: 40.9, color: '#0d9488' },
  { name: 'Motor', value: 31.7, color: '#f59e0b' },
  { name: 'Life', value: 15.2, color: '#C98A1C' },
  { name: 'Others', value: 12.2, color: '#C98A1C' },
];

const darkSegmentColors = ['#2dd4bf', '#fbbf24', '#C98A1C', '#C98A1C'];

const digitalRegionalData = [
  {
    icon: MapPin,
    label: 'Tier-2/3 Cities',
    value: '62%',
    description: 'of new health policies originate from tier-2 and tier-3 cities',
    accent: true,
  },
  {
    icon: TrendingUp,
    label: '₹10-14L Sum Insured',
    value: '27% → 47%',
    description: 'share grew from FY22 to FY26, reflecting higher coverage demand',
    accent: false,
  },
  {
    icon: Smartphone,
    label: 'Online Insurance Market',
    value: 'USD 283M → 550M',
    description: '2026 to 2031 at 14.18% CAGR, digital-first adoption accelerating',
    accent: true,
  },
  {
    icon: Globe,
    label: 'GDP Growth Driver',
    value: '7.3%',
    description: 'strong economic growth driving insurance demand across sectors',
    accent: false,
  },
];

// ── Animation Variants ──────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

// ── Custom Tooltip for AreaChart ────────────────────────────────────────────

function GwpTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-slate-800 dark:text-white">{label}</p>
      <p className="text-sm font-bold text-teal-700 dark:text-[#00A9A6]">
        ₹{payload[0].value.toFixed(2)}T
      </p>
    </div>
  );
}

// ── Custom Tooltip for BarChart ─────────────────────────────────────────────

function MarketSizeTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  const lakhs = val / 100000;
  return (
    <div className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-slate-800 dark:text-white">{label}</p>
      <p className="text-sm font-bold text-teal-700 dark:text-[#00A9A6]">
        ₹{lakhs.toFixed(1)}L Cr
      </p>
    </div>
  );
}

// ── Custom Tooltip for LineChart ────────────────────────────────────────────

function OnlineMarketTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-slate-800 dark:text-white">{label}</p>
      <p className="text-sm font-bold text-violet-600 dark:text-violet-400">
        USD {payload[0].value.toFixed(2)}M
      </p>
    </div>
  );
}

// ── Custom Label for PieChart ───────────────────────────────────────────────

const RADIAN = Math.PI / 180;
function renderCustomLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  name: string;
}) {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.12) return null;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-[11px] font-semibold"
    >
      {name} {(percent * 100).toFixed(1)}%
    </text>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function IndustryInsightsSection() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-background scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <Badge className="mb-4 bg-teal-50 text-teal-700 border-teal-200 dark:bg-[#00A9A6]/10 dark:text-[#00A9A6] dark:border-[#00A9A6]/30 rounded-full px-4 py-1">
            <BarChart3 className="w-3.5 h-3.5 mr-1" />
            Industry Insights
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white tracking-tight">
            India Insurance{' '}
            <span className="text-teal-700 dark:text-[#00A9A6]">Market Overview</span>
          </h2>
          <p className="mt-4 text-sm sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Comprehensive data on market size, growth projections, segment share, and digital transformation driving India&apos;s insurance landscape.
          </p>
        </motion.div>

        {/* ── 1. Market Size Cards ────────────────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16"
        >
          {marketSizeCards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div key={card.title} variants={itemVariants} whileHover={{ y: -4 }}>
                <Card className="bg-white dark:bg-white/10 border-slate-200 dark:border-white/10 overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {card.title}
                      </CardTitle>
                      <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-[#00A9A6]/15 flex items-center justify-center">
                        <Icon className="w-4.5 h-4.5 text-teal-700 dark:text-[#00A9A6]" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
                      {card.value}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge
                        variant="secondary"
                        className="text-[10px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border-0"
                      >
                        {card.subtitle}
                      </Badge>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {card.source}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── 2. Projection Chart + 3. Penetration vs Density ────────────── */}
        <div className="grid lg:grid-cols-5 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {/* GWP Projection Area Chart */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <Card className="bg-white dark:bg-white/10 border-slate-200 dark:border-white/10 h-full">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white">
                      GWP Projection (10% CAGR)
                    </CardTitle>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Industry projections based on IRDAI data
                    </p>
                  </div>
                  <Badge className="bg-teal-50 text-teal-700 border-teal-200 dark:bg-[#00A9A6]/10 dark:text-[#00A9A6] dark:border-[#00A9A6]/30 text-[10px] rounded-full">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    10% CAGR
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[280px] sm:h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={gwpProjectionData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="gwpGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0d9488" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#0d9488" stopOpacity={0.02} />
                        </linearGradient>
                        <linearGradient id="gwpGradientDark" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00A9A6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#00A9A6" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e2e8f0"
                        className="dark:opacity-20"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="year"
                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                        axisLine={{ stroke: '#e2e8f0' }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v: number) => `₹${v}T`}
                        domain={[3, 6]}
                      />
                      <Tooltip content={<GwpTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="gwp"
                        stroke="#0d9488"
                        strokeWidth={2.5}
                        fill="url(#gwpGradient)"
                        dot={{
                          r: 5,
                          fill: '#0d9488',
                          stroke: '#fff',
                          strokeWidth: 2,
                          className: 'dark:fill-[#00A9A6] dark:stroke-slate-800',
                        }}
                        activeDot={{
                          r: 7,
                          fill: '#0d9488',
                          stroke: '#fff',
                          strokeWidth: 2,
                          className: 'dark:fill-[#00A9A6]',
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Penetration vs Density */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white dark:bg-white/10 border-slate-200 dark:border-white/10 h-full">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white">
                  Penetration vs Density
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  India vs Global Average — the growth gap
                </p>
              </CardHeader>
              <CardContent className="flex flex-col justify-center gap-6 sm:gap-8">
                {/* India Card */}
                <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-500/15 flex items-center justify-center">
                      <span className="text-lg">🇮🇳</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-800 dark:text-white">
                      India
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
                        3.7%
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Insurance Penetration
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
                        $97
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Insurance Density
                      </p>
                    </div>
                  </div>
                </div>

                {/* Gap Indicator */}
                <div className="flex items-center justify-center gap-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 dark:via-white/20 to-transparent" />
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, type: 'spring' as const, stiffness: 200 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-[#00A9A6]/15 flex items-center justify-center border-2 border-teal-300 dark:border-[#00A9A6]/40">
                      <TrendingUp className="w-4 h-4 text-teal-700 dark:text-[#00A9A6]" />
                    </div>
                    <span className="text-[10px] font-semibold text-teal-700 dark:text-[#00A9A6] mt-1 whitespace-nowrap">
                      Massive Growth Gap
                    </span>
                  </motion.div>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 dark:via-white/20 to-transparent" />
                </div>

                {/* Global Average Card */}
                <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/15 flex items-center justify-center">
                      <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-semibold text-slate-800 dark:text-white">
                      Global Average
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
                        7.0%
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Insurance Penetration
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
                        $881
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Insurance Density
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ── NEW: Market Size Growth Bar Chart + Online Insurance Line Chart ── */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {/* Market Size Growth Bar Chart (FY21-FY26) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-white dark:bg-white/10 border-slate-200 dark:border-white/10 h-full">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white">
                      Market Size Growth
                    </CardTitle>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Historical premium growth FY21–FY26
                    </p>
                  </div>
                  <Badge className="bg-teal-50 text-teal-700 border-teal-200 dark:bg-[#00A9A6]/10 dark:text-[#00A9A6] dark:border-[#00A9A6]/30 text-[10px] rounded-full">
                    <Activity className="w-3 h-3 mr-1" />
                    FY21–FY26
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[280px] sm:h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={marketSizeData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0d9488" stopOpacity={1} />
                          <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.8} />
                        </linearGradient>
                        <linearGradient id="barGradientDark" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00A9A6" stopOpacity={1} />
                          <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0.8} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e2e8f0"
                        className="dark:opacity-20"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="year"
                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                        axisLine={{ stroke: '#e2e8f0' }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v: number) => `₹${(v / 100000).toFixed(0)}L Cr`}
                        domain={[600000, 1400000]}
                      />
                      <Tooltip content={<MarketSizeTooltip />} />
                      <Bar
                        dataKey="premium"
                        fill="url(#barGradient)"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={48}
                        className="dark:fill-[#00A9A6]"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 text-right">
                  Source: IRDAI Annual Report FY25
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Online Insurance Market Line Chart (2025-2031) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-white dark:bg-white/10 border-slate-200 dark:border-white/10 h-full">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white">
                      Online Insurance Market
                    </CardTitle>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Projected market size 2025–2031
                    </p>
                  </div>
                  <Badge className="bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/30 text-[10px] rounded-full">
                    <Wifi className="w-3 h-3 mr-1" />
                    14.18% CAGR
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[280px] sm:h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={onlineMarketData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="lineGradientViolet" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#C98A1C" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#C98A1C" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e2e8f0"
                        className="dark:opacity-20"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="year"
                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                        axisLine={{ stroke: '#e2e8f0' }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v: number) => `$${v}M`}
                        domain={[200, 600]}
                      />
                      <Tooltip content={<OnlineMarketTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="marketSize"
                        stroke="#C98A1C"
                        strokeWidth={2.5}
                        dot={{
                          r: 5,
                          fill: '#C98A1C',
                          stroke: '#fff',
                          strokeWidth: 2,
                          className: 'dark:fill-violet-400 dark:stroke-slate-800',
                        }}
                        activeDot={{
                          r: 7,
                          fill: '#C98A1C',
                          stroke: '#fff',
                          strokeWidth: 2,
                          className: 'dark:fill-violet-400',
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 text-right">
                  Source: GlobalData
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ── 4. Segment Share (Donut) + 5. Digital & Regional Data ──────── */}
        <div className="grid lg:grid-cols-5 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {/* Segment Share Donut */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white dark:bg-white/10 border-slate-200 dark:border-white/10 h-full">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white">
                  Segment Share
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  IRDAI Annual Report FY25
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-[260px] sm:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={segmentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={110}
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="name"
                        label={renderCustomLabel}
                        labelLine={false}
                        strokeWidth={0}
                      >
                        {segmentData.map((_entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={_entry.color}
                            className="dark:fill-[var(--segment-color)]"
                            style={{ '--segment-color': darkSegmentColors[index] } as React.CSSProperties}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number, name: string) => [`${value}%`, name]}
                        contentStyle={{
                          backgroundColor: 'var(--background, #fff)',
                          border: '1px solid var(--border, #e2e8f0)',
                          borderRadius: '8px',
                          fontSize: '12px',
                          color: 'var(--foreground, #1e293b)',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {segmentData.map((seg, i) => (
                    <div key={seg.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-sm shrink-0"
                        style={{ backgroundColor: seg.color }}
                      />
                      <span className="text-xs text-slate-600 dark:text-slate-300">
                        {seg.name}
                      </span>
                      <span className="text-xs font-semibold text-slate-800 dark:text-white ml-auto">
                        {seg.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Digital & Regional Data */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <Card className="bg-white dark:bg-white/10 border-slate-200 dark:border-white/10 h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-teal-700 dark:text-[#00A9A6]" />
                  <CardTitle className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white">
                    Digital &amp; Regional Insights
                  </CardTitle>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Emerging trends shaping India&apos;s insurance growth story
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {digitalRegionalData.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1, duration: 0.4 }}
                        className={`rounded-xl border p-4 transition-all duration-300 hover:shadow-md ${
                          item.accent
                            ? 'border-teal-200 dark:border-[#00A9A6]/30 bg-teal-50/50 dark:bg-[#00A9A6]/5'
                            : 'border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                              item.accent
                                ? 'bg-teal-100 dark:bg-[#00A9A6]/20'
                                : 'bg-slate-100 dark:bg-white/10'
                            }`}
                          >
                            <Icon
                              className={`w-4 h-4 ${
                                item.accent
                                  ? 'text-teal-700 dark:text-[#00A9A6]'
                                  : 'text-slate-600 dark:text-slate-300'
                              }`}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                              {item.label}
                            </p>
                            <p className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white mt-0.5 truncate">
                              {item.value}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ── 6. Source Disclaimer ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 sm:px-6 py-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 dark:bg-amber-500 shrink-0" />
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Based on IRDAI regulations 2025-26. Data for reference only, not investment advice.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
