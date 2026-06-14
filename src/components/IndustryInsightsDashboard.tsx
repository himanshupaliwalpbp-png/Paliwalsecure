'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  IndianRupee,
  Globe,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Source: IRDAI Annual Report FY25, Swiss Re Sigma 2025

// ── Market Size Data ──────────────────────────────────────
const marketSizeCards = [
  {
    icon: IndianRupee,
    label: 'Total Premium',
    value: '₹11.9L Cr',
    subtitle: 'FY25',
    yoy: '+12.3%',
    yoyPositive: true,
    gradient: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/30',
    borderLight: 'border-emerald-200 dark:border-emerald-800/50',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: TrendingUp,
    label: 'Gross Written Premium',
    value: '₹3.6T',
    subtitle: 'FY25',
    yoy: '+14.7%',
    yoyPositive: true,
    gradient: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50 dark:bg-amber-950/30',
    borderLight: 'border-amber-200 dark:border-amber-800/50',
    iconBg: 'bg-amber-100 dark:bg-amber-900/40',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    icon: BarChart3,
    label: 'Assets Under Management',
    value: '₹74.4L Cr',
    subtitle: 'FY25',
    yoy: '+16.2%',
    yoyPositive: true,
    gradient: 'from-violet-500 to-purple-600',
    bgLight: 'bg-violet-50 dark:bg-violet-950/30',
    borderLight: 'border-violet-200 dark:border-violet-800/50',
    iconBg: 'bg-violet-100 dark:bg-violet-900/40',
    iconColor: 'text-violet-600 dark:text-violet-400',
  },
];

// ── GWP Projection Data (10% CAGR) ──────────────────────
const gwpProjectionData = [
  { year: '2026', gwp: 3.96 },
  { year: '2027', gwp: 4.36 },
  { year: '2028', gwp: 4.79 },
  { year: '2029', gwp: 5.27 },
  { year: '2030', gwp: 5.40 },
];

// ── Penetration vs Density Data ──────────────────────────
const penetrationData = [
  { category: 'India', penetration: 3.7, density: 97 },
  { category: 'Global Avg', penetration: 7.0, density: 650 },
];

// ── Segment Share Data ───────────────────────────────────
const segmentData = [
  { name: 'Health', value: 40.9, color: '#ef4444' },
  { name: 'Motor', value: 31.7, color: '#f59e0b' },
  { name: 'Life', value: 15.2, color: '#C98A1C' },
  { name: 'Others', value: 12.2, color: '#C98A1C' },
];

// ── Custom Tooltip for GWP ───────────────────────────────
function GwpTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg shadow-xl p-3">
      <p className="text-xs font-bold text-foreground mb-1">{label}</p>
      <p className="text-sm font-semibold text-teal-600 dark:text-teal-400">₹{payload[0].value}T</p>
      <p className="text-[10px] text-muted-foreground">Gross Written Premium</p>
    </div>
  );
}

// ── Custom Tooltip for Penetration ────────────────────────
function PenetrationTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg shadow-xl p-3">
      <p className="text-xs font-bold text-foreground mb-1">{label}</p>
      {payload.map((entry, idx) => (
        <div key={idx} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground">{entry.dataKey === 'penetration' ? 'Penetration' : 'Density (USD)'}</span>
          <span className="font-bold text-foreground ml-auto">
            {entry.dataKey === 'penetration' ? `${entry.value}%` : `$${entry.value}`}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Custom Label for Pie Chart ───────────────────────────
function renderCustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: { cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; percent: number }) {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
}

// ── Animation Variants ───────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ── Main Component ───────────────────────────────────────
export default function IndustryInsightsDashboard() {
  return (
    <section id="industry-insights" className="py-16 sm:py-20 bg-background scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <Badge className="mb-4 bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800 rounded-full px-4 py-1">
            <Globe className="w-3.5 h-3.5 mr-1" />
            Industry Insights
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            India Insurance <span className="gradient-text">Market Overview</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            IRDAI data se poora industry ka nazara — market size, growth projections, aur segment breakdown
          </p>
        </motion.div>

        {/* ── Market Size Cards ──────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8"
        >
          {marketSizeCards.map((card) => {
            const IconComp = card.icon;
            return (
              <motion.div key={card.label} variants={itemVariants}>
                <Card className={`overflow-hidden border ${card.borderLight} hover:shadow-lg transition-shadow duration-300`}>
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                        <IconComp className={`w-5 h-5 ${card.iconColor}`} />
                      </div>
                      <Badge
                        className={`text-[10px] font-semibold px-2 py-0.5 ${
                          card.yoyPositive
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-0'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-0'
                        }`}
                      >
                        {card.yoyPositive ? '↑' : '↓'} {card.yoy} YoY
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium mb-1">{card.label}</p>
                    <p className="text-2xl sm:text-3xl font-extrabold text-foreground">{card.value}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{card.subtitle}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Charts Row ────────────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-8"
        >
          {/* GWP Projection Area Chart */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden border-0 shadow-lg h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">GWP Projection (2026–2030)</CardTitle>
                    <CardDescription className="text-[11px]">10% CAGR reaching ₹5.4T by 2030</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[260px] sm:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={gwpProjectionData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="gwpGradient" x1="0" y1="0" x2="0" y2="1">
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
                        tickFormatter={(v: number) => `₹${v}T`}
                        domain={[3, 6]}
                      />
                      <RechartsTooltip content={<GwpTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="gwp"
                        stroke="#14b8a6"
                        strokeWidth={3}
                        fill="url(#gwpGradient)"
                        dot={{ r: 5, strokeWidth: 2, fill: '#fff', stroke: '#14b8a6' }}
                        activeDot={{ r: 7, strokeWidth: 2, stroke: '#14b8a6' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Penetration vs Density Bar Chart */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden border-0 shadow-lg h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">Penetration vs Density</CardTitle>
                    <CardDescription className="text-[11px]">India vs Global Average comparison</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[260px] sm:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={penetrationData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }} barGap={8}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis
                        dataKey="category"
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        tickLine={false}
                      />
                      <YAxis
                        yAxisId="penetration"
                        orientation="left"
                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        tickLine={false}
                        tickFormatter={(v: number) => `${v}%`}
                        domain={[0, 8]}
                        label={{
                          value: 'Penetration %',
                          angle: -90,
                          position: 'insideLeft',
                          style: { fontSize: 10, fill: 'hsl(var(--muted-foreground))' },
                        }}
                      />
                      <YAxis
                        yAxisId="density"
                        orientation="right"
                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        tickLine={false}
                        tickFormatter={(v: number) => `$${v}`}
                        domain={[0, 750]}
                        label={{
                          value: 'Density (USD)',
                          angle: 90,
                          position: 'insideRight',
                          style: { fontSize: 10, fill: 'hsl(var(--muted-foreground))' },
                        }}
                      />
                      <RechartsTooltip content={<PenetrationTooltip />} />
                      <Legend
                        wrapperStyle={{ fontSize: 11 }}
                      />
                      <Bar
                        yAxisId="penetration"
                        dataKey="penetration"
                        name="Penetration %"
                        fill="#f43f5e"
                        radius={[6, 6, 0, 0]}
                        barSize={40}
                      />
                      <Bar
                        yAxisId="density"
                        dataKey="density"
                        name="Density (USD)"
                        fill="#C98A1C"
                        radius={[6, 6, 0, 0]}
                        barSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* ── Segment Share Donut Chart ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="overflow-hidden border-0 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                  <PieChartIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Insurance Segment Share</CardTitle>
                  <CardDescription className="text-[11px]">Non-Life premium distribution by segment (FY25)</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="grid lg:grid-cols-2 gap-6 items-center">
                <div className="h-[280px] sm:h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={segmentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={3}
                        dataKey="value"
                        labelLine={false}
                        label={renderCustomLabel}
                        animationBegin={0}
                        animationDuration={800}
                      >
                        {segmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={2} stroke="hsl(var(--background))" />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value: number, name: string) => [`${value}%`, name]}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend / Breakdown Cards */}
                <div className="grid grid-cols-2 gap-3">
                  {segmentData.map((segment) => (
                    <div
                      key={segment.name}
                      className="rounded-xl border border-border p-4 flex items-start gap-3 hover:shadow-md transition-shadow"
                    >
                      <div
                        className="w-4 h-4 rounded-full mt-0.5 shrink-0"
                        style={{ backgroundColor: segment.color }}
                      />
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">{segment.name}</p>
                        <p className="text-xl font-extrabold text-foreground">{segment.value}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Source Attribution */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[10px] text-muted-foreground/60 mt-6 text-center"
        >
          {'// Source: IRDAI Annual Report FY25, Swiss Re Sigma 2025'}
        </motion.p>
      </div>
    </section>
  );
}
