'use client';

import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ShieldCheck, AlertTriangle, IndianRupee, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const overviewStats = [
  {
    icon: ShieldCheck,
    value: '32.6 Million',
    label: 'Claims Settled',
    source: 'IRDAI Annual Report FY25',
    accent: 'text-teal-700 dark:text-[#00A9A6]',
    bgAccent: 'bg-teal-50 dark:bg-teal-900/20',
  },
  {
    icon: AlertTriangle,
    value: '87%',
    label: 'Approval Rate',
    source: 'IRDAI Annual Report FY25',
    accent: 'text-amber-600 dark:text-amber-400',
    bgAccent: 'bg-amber-50 dark:bg-amber-900/20',
  },
  {
    icon: IndianRupee,
    value: '₹28,910',
    label: 'Average Payout',
    source: 'IRDAI Annual Report FY25',
    accent: 'text-emerald-600 dark:text-emerald-400',
    bgAccent: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
];

type GrievanceRow = {
  insurer: string;
  grievances: number;
  change: string;
  topComplaint: string;
  status: 'High' | 'Medium' | 'Low';
};

const grievanceData: GrievanceRow[] = [
  { insurer: 'Star Health', grievances: 20_527, change: '+22%', topComplaint: 'Claim repudiation', status: 'High' },
  { insurer: 'Care Health', grievances: 10_281, change: '+49%', topComplaint: 'Claim repudiation', status: 'Medium' },
  { insurer: 'Niva Bupa', grievances: 7_970, change: '+50%', topComplaint: 'Claim delays', status: 'Medium' },
  { insurer: 'Aditya Birla Health', grievances: 5_329, change: '+37%', topComplaint: 'Claim repudiation', status: 'Low' },
];

/* colour helper — green < 6 000, yellow 6 000-12 000, red > 12 000 */
function grievanceColor(count: number) {
  if (count > 12_000) return '#ef4444'; // red-500
  if (count >= 6_000) return '#eab308'; // yellow-500
  return '#22c55e'; // green-500
}

function grievanceColorClass(count: number) {
  if (count > 12_000) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  if (count >= 6_000) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
  return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
}

const chartData = grievanceData.map((d) => ({
  name: d.insurer,
  grievances: d.grievances,
  fill: grievanceColor(d.grievances),
}));

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ClaimsDashboardSection() {
  return (
    <section className="w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="mx-auto max-w-6xl space-y-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {/* ---- Section Header ---- */}
        <motion.div variants={itemVariants} className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 dark:bg-teal-900/20 px-4 py-1.5 text-sm font-medium text-teal-700 dark:text-[#00A9A6]">
            <AlertCircle className="h-4 w-4" />
            IRDAI FY25 Data
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white">
            Claims &amp; Grievance Dashboard
          </h2>
          <p className="max-w-2xl mx-auto text-slate-500 dark:text-slate-400 text-base sm:text-lg">
            Track industry-wide claim settlement performance and grievance trends reported by IRDAI for FY&nbsp;2024‑25.
          </p>
        </motion.div>

        {/* ---- 1. Overview Stat Cards ---- */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {overviewStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className="bg-white/90 dark:bg-white/10 border border-slate-200 dark:border-white/10 backdrop-blur-sm hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2.5 ${stat.bgAccent}`}>
                      <Icon className={`h-5 w-5 ${stat.accent}`} />
                    </div>
                    <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {stat.label}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    Source: {stat.source}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* ---- 2. Grievance Rankings Table ---- */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/90 dark:bg-white/10 border border-slate-200 dark:border-white/10 backdrop-blur-sm overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg text-slate-800 dark:text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Grievance Rankings — FY25
              </CardTitle>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Source: IRDAI Annual Report FY25
              </p>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/10">
                      <th className="text-left px-6 py-3 font-semibold text-slate-800 dark:text-white">Insurer</th>
                      <th className="text-right px-6 py-3 font-semibold text-slate-800 dark:text-white">Grievances</th>
                      <th className="text-right px-6 py-3 font-semibold text-slate-800 dark:text-white">% Change</th>
                      <th className="text-left px-6 py-3 font-semibold text-slate-800 dark:text-white">Top Complaint</th>
                      <th className="text-center px-6 py-3 font-semibold text-slate-800 dark:text-white">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grievanceData.map((row) => (
                      <tr
                        key={row.insurer}
                        className="border-b border-slate-100 dark:border-white/5 last:border-b-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-3.5 font-medium text-slate-800 dark:text-white">
                          {row.insurer}
                        </td>
                        <td className="px-6 py-3.5 text-right text-slate-700 dark:text-slate-300 tabular-nums">
                          {row.grievances.toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-3.5 text-right font-medium text-red-600 dark:text-red-400">
                          {row.change}
                        </td>
                        <td className="px-6 py-3.5 text-slate-600 dark:text-slate-300">
                          {row.topComplaint}
                        </td>
                        <td className="px-6 py-3.5 text-center">
                          <Badge
                            className={`${grievanceColorClass(row.grievances)} border-0 text-xs`}
                          >
                            {row.status === 'High' && '🔴 '}
                            {row.status === 'Medium' && '🟡 '}
                            {row.status === 'Low' && '🟢 '}
                            {row.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile card list */}
              <div className="sm:hidden divide-y divide-slate-200 dark:divide-white/10">
                {grievanceData.map((row) => (
                  <div key={row.insurer} className="px-6 py-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 dark:text-white">{row.insurer}</span>
                      <Badge
                        className={`${grievanceColorClass(row.grievances)} border-0 text-xs`}
                      >
                        {row.status === 'High' && '🔴 '}
                        {row.status === 'Medium' && '🟡 '}
                        {row.status === 'Low' && '🟢 '}
                        {row.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                      <span>Grievances</span>
                      <span className="tabular-nums">{row.grievances.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-300">% Change</span>
                      <span className="font-medium text-red-600 dark:text-red-400">{row.change}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                      <span>Top Complaint</span>
                      <span>{row.topComplaint}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ---- 3. Grievance Bar Chart ---- */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/90 dark:bg-white/10 border border-slate-200 dark:border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg text-slate-800 dark:text-white flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-teal-700 dark:text-[#00A9A6]" />
                Grievance Volume by Insurer
              </CardTitle>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Colour key:&nbsp;
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-green-500" /> Green (&lt;6k)
                </span>
                &ensp;
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-yellow-500" /> Yellow (6k–12k)
                </span>
                &ensp;
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-red-500" /> Red (&gt;12k)
                </span>
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-72 sm:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 4, right: 24, bottom: 4, left: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" horizontal={false} />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 12, fill: 'currentColor' }}
                      className="text-slate-500 dark:text-slate-400"
                      tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={120}
                      tick={{ fontSize: 13, fill: 'currentColor' }}
                      className="text-slate-700 dark:text-slate-300"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        borderColor: 'rgba(226,232,240,0.8)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        color: '#1e293b',
                      }}
                      formatter={(value: number) => [value.toLocaleString('en-IN'), 'Grievances']}
                    />
                    <Bar dataKey="grievances" radius={[0, 6, 6, 0]} barSize={28}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ---- 4. Source Disclaimer ---- */}
        <motion.div variants={itemVariants} className="text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Based on IRDAI Annual Report FY25. Grievance data for reference only. Individual experiences may vary.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
