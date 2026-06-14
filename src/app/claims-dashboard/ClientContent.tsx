'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Area,
} from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, FileCheck, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';

// ============================================
// DATA (Source: IRDAI Annual Report 2025-26, Bima Bharosa Portal)
// ============================================

const claimsSettlementData = [
  { year: 'FY22', claimsSettled: 24500000, settlementRatio: 83 },
  { year: 'FY23', claimsSettled: 27800000, settlementRatio: 85 },
  { year: 'FY24', claimsSettled: 30500000, settlementRatio: 86 },
  { year: 'FY25', claimsSettled: 32600000, settlementRatio: 87 },
];

const grievanceData = [
  { name: 'Star Health', grievances: 20527, change: 22, category: 'standalone', complaintsPer10k: 52.31 },
  { name: 'Care Health', grievances: 10281, change: 49, category: 'standalone', complaintsPer10k: 27.06 },
  { name: 'Niva Bupa', grievances: 7970, change: 50, category: 'standalone', complaintsPer10k: 42.85 },
  { name: 'Aditya Birla Health', grievances: 5329, change: 37, category: 'standalone', complaintsPer10k: 28.0 },
  { name: 'HDFC ERGO', grievances: 1200, change: 15, category: 'private', complaintsPer10k: 10.67 },
  { name: 'ICICI Lombard', grievances: 2100, change: 18, category: 'private', complaintsPer10k: 11.50 },
  { name: 'Bajaj Allianz', grievances: 1850, change: 12, category: 'private', complaintsPer10k: 9.80 },
  { name: 'National Insurance', grievances: 12858, change: 126, category: 'public', complaintsPer10k: 35.20 },
  { name: 'New India Assurance', grievances: 9800, change: 45, category: 'public', complaintsPer10k: 28.50 },
  { name: 'Oriental Insurance', grievances: 7500, change: 38, category: 'public', complaintsPer10k: 26.80 },
  { name: 'United India', grievances: 8700, change: 52, category: 'public', complaintsPer10k: 30.10 },
];

const complaintReasons = [
  { reason: 'Claim repudiation / delay', percentage: 69, color: '#EF4444' },
  { reason: 'Policy servicing issues', percentage: 15, color: '#F97316' },
  { reason: 'Premium / refund disputes', percentage: 10, color: '#FBBF24' },
  { reason: 'Mis-selling / transparency', percentage: 6, color: '#C98A1C' },
];

const pendingGrievancesData = [
  { year: 'FY22', pending: 3800 },
  { year: 'FY23', pending: 4200 },
  { year: 'FY24', pending: 5492 },
  { year: 'FY25', pending: 10160 },
];

const claimPayoutData = [
  { year: 'FY22', totalPayout: 65000, avgPayout: 28500 },
  { year: 'FY23', totalPayout: 78000, avgPayout: 29500 },
  { year: 'FY24', totalPayout: 83493, avgPayout: 31086 },
  { year: 'FY25', totalPayout: 94248, avgPayout: 28910 },
];

const csrHealthData = [
  { name: 'Acko', csr: 99.91, category: 'private' },
  { name: 'Reliance General', csr: 99.32, category: 'private' },
  { name: 'HDFC ERGO', csr: 98.85, category: 'private' },
  { name: 'SBI General', csr: 97.51, category: 'private' },
  { name: 'Tata AIG', csr: 94.14, category: 'private' },
  { name: 'Care Health', csr: 93.13, category: 'standalone' },
  { name: 'Star Health', csr: 88.34, category: 'standalone' },
];

const csrLifeData = [
  { name: 'HDFC Life', csr: 99.97 },
  { name: 'Max Life', csr: 99.08 },
  { name: 'ICICI Prudential', csr: 98.50 },
  { name: 'SBI Life', csr: 98.20 },
  { name: 'Bajaj Allianz Life', csr: 97.50 },
  { name: 'LIC', csr: 95.55 },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

const getSeverityColor = (grievances: number) => {
  if (grievances > 15000) return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
  if (grievances > 5000) return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
  return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
};

const getChangeIcon = (change: number) => {
  if (change > 0) return <TrendingUp className="h-3 w-3 text-red-500" />;
  if (change < 0) return <TrendingDown className="h-3 w-3 text-green-500" />;
  return null;
};

// ============================================
// ANIMATION VARIANTS
// ============================================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function ClaimsDashboardPage() {
  return (
    <>
      <motion.div
        className="container mx-auto px-4 py-8 max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">
            Claims &amp; Grievance Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Latest claims settlement trends, insurer complaint data, and policyholder grievance insights from IRDAI 2025-26.
          </p>
        </motion.div>

        {/* Key Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/90 dark:bg-white/10 border-slate-200 dark:border-white/10 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-teal-700 dark:text-[#00A9A6]" /> Claims Settled (FY25)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800 dark:text-white">3.26 Cr</div>
              <p className="text-xs text-slate-400 dark:text-slate-500">+6.9% from FY24</p>
              <div className="mt-2 flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                <TrendingUp className="h-3 w-3" /> Settlement ratio 87%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-white/10 border-slate-200 dark:border-white/10 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" /> Total Grievances (FY25)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800 dark:text-white">1.37 Lakh</div>
              <p className="text-xs text-slate-400 dark:text-slate-500">General &amp; Health insurance</p>
              <div className="mt-2 flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                <TrendingUp className="h-3 w-3" /> +41% YoY
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-white/10 border-slate-200 dark:border-white/10 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" /> Pending Grievances
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800 dark:text-white">10,160</div>
              <p className="text-xs text-slate-400 dark:text-slate-500">As of March 31, 2025</p>
              <div className="mt-2 flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                <TrendingUp className="h-3 w-3" /> +90% from FY24
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-white/10 border-slate-200 dark:border-white/10 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-teal-700 dark:text-[#00A9A6]" /> Average Claim Payout
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800 dark:text-white">₹28,910</div>
              <p className="text-xs text-slate-400 dark:text-slate-500">Health insurance (FY25)</p>
              <div className="mt-2 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                Down from ₹31,086 (FY24)
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="claims" className="mb-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="claims">Claims Trends</TabsTrigger>
              <TabsTrigger value="grievances">Grievance Rankings</TabsTrigger>
              <TabsTrigger value="csr">CSR by Insurer</TabsTrigger>
              <TabsTrigger value="insights">Key Insights</TabsTrigger>
            </TabsList>

            {/* Tab 1: Claims Trends */}
            <TabsContent value="claims">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/90 dark:bg-white/10 border-slate-200 dark:border-white/10">
                  <CardHeader>
                    <CardTitle className="text-slate-800 dark:text-white">Claims Settled (Health Insurance)</CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400">Number of claims settled and settlement ratio trend</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={claimsSettlementData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                        <XAxis dataKey="year" tick={{ fontSize: 12, fill: 'currentColor' }} className="text-slate-500 dark:text-slate-400" />
                        <YAxis yAxisId="left" tick={{ fontSize: 12, fill: 'currentColor' }} className="text-slate-500 dark:text-slate-400" tickFormatter={(value) => `${(value / 1e6).toFixed(0)}Cr`} />
                        <YAxis yAxisId="right" orientation="right" domain={[80, 90]} tick={{ fontSize: 12, fill: 'currentColor' }} className="text-slate-500 dark:text-slate-400" tickFormatter={(value) => `${value}%`} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            borderColor: 'rgba(226,232,240,0.8)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            color: '#1e293b',
                          }}
                        />
                        <Legend />
                        <Bar yAxisId="left" dataKey="claimsSettled" name="Claims Settled" fill="#0d9488" radius={[4, 4, 0, 0]} />
                        <Line yAxisId="right" type="monotone" dataKey="settlementRatio" name="Settlement Ratio %" stroke="#F97316" strokeWidth={3} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 dark:bg-white/10 border-slate-200 dark:border-white/10">
                  <CardHeader>
                    <CardTitle className="text-slate-800 dark:text-white">Claim Payout (₹ Crore) &amp; Average Claim</CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400">Total payout vs average claim amount</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={claimPayoutData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                        <XAxis dataKey="year" tick={{ fontSize: 12, fill: 'currentColor' }} className="text-slate-500 dark:text-slate-400" />
                        <YAxis yAxisId="left" tick={{ fontSize: 12, fill: 'currentColor' }} className="text-slate-500 dark:text-slate-400" tickFormatter={(value) => `₹${value / 1000}K Cr`} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: 'currentColor' }} className="text-slate-500 dark:text-slate-400" tickFormatter={(value) => `₹${value.toLocaleString()}`} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            borderColor: 'rgba(226,232,240,0.8)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            color: '#1e293b',
                          }}
                        />
                        <Legend />
                        <Bar yAxisId="left" dataKey="totalPayout" name="Total Payout (₹ Cr)" fill="#10B981" radius={[4, 4, 0, 0]} />
                        <Line yAxisId="right" type="monotone" dataKey="avgPayout" name="Avg Payout (₹)" stroke="#C98A1C" strokeWidth={3} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab 2: Grievance Rankings */}
            <TabsContent value="grievances">
              <Card className="bg-white/90 dark:bg-white/10 border-slate-200 dark:border-white/10">
                <CardHeader>
                  <CardTitle className="text-slate-800 dark:text-white">Insurer-wise Grievances (FY25)</CardTitle>
                  <CardDescription className="text-slate-500 dark:text-slate-400">Total grievances reported on Bima Bharosa portal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-white/10">
                          <th className="text-left py-3 px-2 font-semibold text-slate-800 dark:text-white">Insurer</th>
                          <th className="text-right py-3 px-2 font-semibold text-slate-800 dark:text-white">Grievances</th>
                          <th className="text-right py-3 px-2 font-semibold text-slate-800 dark:text-white">% Change</th>
                          <th className="text-right py-3 px-2 font-semibold text-slate-800 dark:text-white">Complaints per 10k</th>
                          <th className="text-center py-3 px-2 font-semibold text-slate-800 dark:text-white">Category</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grievanceData.map((item, idx) => (
                          <tr key={idx} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                            <td className="py-3 px-2 font-medium text-slate-800 dark:text-white">{item.name}</td>
                            <td className={`text-right py-3 px-2 font-semibold ${getSeverityColor(item.grievances)}`}>
                              {item.grievances.toLocaleString()}
                            </td>
                            <td className="text-right py-3 px-2">
                              <div className="flex items-center justify-end gap-1">
                                {getChangeIcon(item.change)}
                                <span className={item.change > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                                  {item.change > 0 ? '+' : ''}{item.change}%
                                </span>
                              </div>
                            </td>
                            <td className="text-right py-3 px-2 text-slate-700 dark:text-slate-300 tabular-nums">{item.complaintsPer10k.toFixed(2)}</td>
                            <td className="text-center py-3 px-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                item.category === 'standalone' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                item.category === 'private' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                              }`}>
                                {item.category === 'standalone' ? 'Standalone Health' :
                                 item.category === 'private' ? 'Private' : 'Public'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 text-xs text-slate-400 dark:text-slate-500">
                    Source: IRDAI Annual Report 2025-26. Standalone health insurers saw 33% rise in grievances overall.
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card className="bg-white/90 dark:bg-white/10 border-slate-200 dark:border-white/10">
                  <CardHeader>
                    <CardTitle className="text-slate-800 dark:text-white">Top Complaint Reasons</CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400">% of total grievances (General &amp; Health)</CardDescription>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={complaintReasons}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ reason, percent }) => `${reason}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="percentage"
                        >
                          {complaintReasons.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            borderColor: 'rgba(226,232,240,0.8)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            color: '#1e293b',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="text-center text-sm text-slate-500 dark:text-slate-400 mt-2">
                      69% of grievances are claim-related (repudiation or delay)
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 dark:bg-white/10 border-slate-200 dark:border-white/10">
                  <CardHeader>
                    <CardTitle className="text-slate-800 dark:text-white">Pending Grievances Trend</CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400">Unresolved complaints at year end</CardDescription>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={pendingGrievancesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                        <XAxis dataKey="year" tick={{ fontSize: 12, fill: 'currentColor' }} className="text-slate-500 dark:text-slate-400" />
                        <YAxis tick={{ fontSize: 12, fill: 'currentColor' }} className="text-slate-500 dark:text-slate-400" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            borderColor: 'rgba(226,232,240,0.8)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            color: '#1e293b',
                          }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="pending" name="Pending Grievances" stroke="#EF4444" strokeWidth={3} />
                        <Area type="monotone" dataKey="pending" fill="#EF4444" fillOpacity={0.1} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab 3: CSR by Insurer */}
            <TabsContent value="csr">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/90 dark:bg-white/10 border-slate-200 dark:border-white/10">
                  <CardHeader>
                    <CardTitle className="text-slate-800 dark:text-white">Health Insurance CSR (Top Performers)</CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400">Claim Settlement Ratio – claims paid within 3 months</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={csrHealthData} layout="vertical" margin={{ top: 20, right: 30, left: 60, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                        <XAxis type="number" domain={[85, 100]} tick={{ fontSize: 12, fill: 'currentColor' }} className="text-slate-500 dark:text-slate-400" tickFormatter={(value) => `${value}%`} />
                        <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12, fill: 'currentColor' }} className="text-slate-700 dark:text-slate-300" />
                        <Tooltip
                          formatter={(value) => [`${value}%`, 'CSR']}
                          contentStyle={{
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            borderColor: 'rgba(226,232,240,0.8)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            color: '#1e293b',
                          }}
                        />
                        <Bar dataKey="csr" name="CSR %" fill="#0d9488" radius={[0, 8, 8, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                  <CardContent className="pt-0">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      <CheckCircle className="inline h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
                      Acko (99.91%), Reliance General (99.32%), HDFC ERGO (98.85%) top the charts.
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 dark:bg-white/10 border-slate-200 dark:border-white/10">
                  <CardHeader>
                    <CardTitle className="text-slate-800 dark:text-white">Life Insurance CSR</CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400">Claim Settlement Ratio (within 30 days)</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={csrLifeData} layout="vertical" margin={{ top: 20, right: 30, left: 60, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                        <XAxis type="number" domain={[94, 100]} tick={{ fontSize: 12, fill: 'currentColor' }} className="text-slate-500 dark:text-slate-400" tickFormatter={(value) => `${value}%`} />
                        <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12, fill: 'currentColor' }} className="text-slate-700 dark:text-slate-300" />
                        <Tooltip
                          formatter={(value) => [`${value}%`, 'CSR']}
                          contentStyle={{
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            borderColor: 'rgba(226,232,240,0.8)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            color: '#1e293b',
                          }}
                        />
                        <Bar dataKey="csr" name="CSR %" fill="#F97316" radius={[0, 8, 8, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                  <CardContent className="pt-0">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      <CheckCircle className="inline h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
                      HDFC Life (99.97%), Max Life (99.08%) lead with near-perfect settlement.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab 4: Key Insights */}
            <TabsContent value="insights">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-red-200 dark:border-red-800/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white">
                      <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      Red Flags for Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <span className="text-red-600">⚠️</span>
                        <span>Public sector insurers saw grievance rise of <strong>+126% (National Insurance)</strong></span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <span className="text-orange-600">📈</span>
                        <span>Standalone health insurers&apos; grievances up <strong>33% YoY</strong> – Star Health (20,527), Care Health (10,281), Niva Bupa (7,970)</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <span className="text-amber-600">⏳</span>
                        <span>Pending grievances nearly doubled from 5,492 to <strong>10,160</strong></span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <span className="text-purple-600">📊</span>
                        <span>Average claim payout decreased to ₹28,910 – more smaller-ticket claims being settled</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 border-green-200 dark:border-green-800/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white">
                      <ThumbsUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                      Positive Takeaways
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <span className="text-green-600">✅</span>
                        <span>Overall claims settlement ratio improved to <strong>87%</strong> (from 83%)</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <span className="text-green-600">💰</span>
                        <span>Total claim payouts increased 13% to ₹94,248 Crore – more money reaching policyholders</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <span className="text-green-600">🏆</span>
                        <span>Acko (99.91%), Reliance General (99.32%), HDFC ERGO (98.85%) – industry leading CSR</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <span className="text-green-600">📉</span>
                        <span>Incurred Claim Ratio (ICR) for health improved to 86.98% – better profitability for insurers</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2 bg-white/90 dark:bg-white/10 border-slate-200 dark:border-white/10">
                  <CardHeader>
                    <CardTitle className="text-slate-800 dark:text-white">IRDAI Consumer Protection Guidelines – You Should Know</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800/30">
                        <strong className="text-blue-700 dark:text-blue-300">Moratorium Period:</strong> <span className="text-slate-600 dark:text-slate-400">After 5 continuous years, no claim rejection for non-disclosure (except fraud).</span>
                      </div>
                      <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800/30">
                        <strong className="text-orange-700 dark:text-orange-300">Cashless Timeline:</strong> <span className="text-slate-600 dark:text-slate-400">Pre-authorisation within 1 hour, discharge approval within 3 hours (IRDAI mandate).</span>
                      </div>
                      <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800/30">
                        <strong className="text-purple-700 dark:text-purple-300">Ombudsman Access:</strong> <span className="text-slate-600 dark:text-slate-400">Appeal rejected claims up to ₹50 lakh – free and fast redressal.</span>
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-slate-400 dark:text-slate-500">
                      Source: IRDAI Annual Report 2025-26, Bima Bharosa portal data, Insurance Ombudsman annual report.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </>
  );
}
