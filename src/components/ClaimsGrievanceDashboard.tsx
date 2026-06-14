'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
  ThumbsUp,
  ShieldAlert,
  MessageSquareWarning,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Source: IRDAI Annual Report FY25

// ── Claims Stats Data ────────────────────────────────────
const claimsStats = [
  {
    icon: CheckCircle2,
    label: 'Claims Settled',
    value: '32.6M',
    subtitle: 'Total claims settled FY25',
    gradient: 'from-emerald-500 to-teal-600',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-200 dark:border-emerald-800/50',
  },
  {
    icon: ThumbsUp,
    label: 'Approval Rate',
    value: '87%',
    subtitle: 'Industry average claim approval',
    gradient: 'from-amber-500 to-orange-600',
    iconBg: 'bg-amber-100 dark:bg-amber-900/40',
    iconColor: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-200 dark:border-amber-800/50',
  },
  {
    icon: IndianRupee,
    label: 'Avg Payout',
    value: '₹28,910',
    subtitle: 'Average claim settlement amount',
    gradient: 'from-violet-500 to-purple-600',
    iconBg: 'bg-violet-100 dark:bg-violet-900/40',
    iconColor: 'text-violet-600 dark:text-violet-400',
    borderColor: 'border-violet-200 dark:border-violet-800/50',
  },
];

// ── Complaint Rankings Data ──────────────────────────────
type ComplaintLevel = 'red' | 'yellow' | 'green';

interface ComplaintEntry {
  insurer: string;
  grievances: number;
  change: string;
  changePositive: boolean;
  topComplaint: string;
  level: ComplaintLevel;
}

const complaintData: ComplaintEntry[] = [
  {
    insurer: 'Star Health',
    grievances: 20527,
    change: '+22%',
    changePositive: false,
    topComplaint: 'Claim repudiation',
    level: 'red',
  },
  {
    insurer: 'Care Health',
    grievances: 10281,
    change: '+49%',
    changePositive: false,
    topComplaint: 'Claim repudiation',
    level: 'red',
  },
  {
    insurer: 'Niva Bupa',
    grievances: 7970,
    change: '+50%',
    changePositive: false,
    topComplaint: 'Claim delays',
    level: 'yellow',
  },
  {
    insurer: 'Aditya Birla Health',
    grievances: 5329,
    change: '+37%',
    changePositive: false,
    topComplaint: 'Claim repudiation',
    level: 'yellow',
  },
];

function getLevelStyle(level: ComplaintLevel) {
  switch (level) {
    case 'red':
      return {
        badge: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-0',
        dot: 'bg-rose-500',
        rowBg: 'bg-rose-50/40 dark:bg-rose-950/10',
        label: 'High',
      };
    case 'yellow':
      return {
        badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-0',
        dot: 'bg-amber-500',
        rowBg: 'bg-amber-50/40 dark:bg-amber-950/10',
        label: 'Medium',
      };
    case 'green':
      return {
        badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-0',
        dot: 'bg-emerald-500',
        rowBg: 'bg-emerald-50/40 dark:bg-emerald-950/10',
        label: 'Low',
      };
  }
}

function formatNumber(num: number): string {
  return num.toLocaleString('en-IN');
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
export default function ClaimsGrievanceDashboard() {
  return (
    <section id="claims-grievance" className="py-16 sm:py-20 bg-background scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <Badge className="mb-4 bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800 rounded-full px-4 py-1">
            <ShieldAlert className="w-3.5 h-3.5 mr-1" />
            Claims & Grievance Data
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Claims Settlement & <span className="gradient-text">Complaint Tracker</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Kitne claims settle hue, kitni complaints — sab data ek nazara mein
          </p>
        </motion.div>

        {/* ── Claims Stats Cards ────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8"
        >
          {claimsStats.map((stat) => {
            const IconComp = stat.icon;
            return (
              <motion.div key={stat.label} variants={itemVariants}>
                <Card className={`overflow-hidden border ${stat.borderColor} hover:shadow-lg transition-shadow duration-300`}>
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-11 h-11 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                        <IconComp className={`w-5 h-5 ${stat.iconColor}`} />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium mb-1">{stat.label}</p>
                    <p className="text-2xl sm:text-3xl font-extrabold text-foreground">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{stat.subtitle}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Complaint Rankings Table ──────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="overflow-hidden border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center">
                  <MessageSquareWarning className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Complaint Rankings — Health Insurers</CardTitle>
                  <CardDescription className="text-[11px]">FY25 grievance data by IRDAI — color coded by complaint volume</CardDescription>
                </div>
              </div>

              {/* Color Legend */}
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-[10px] text-muted-foreground">&gt;10K complaints (High)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-[10px] text-muted-foreground">5K–10K (Medium)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-muted-foreground">&lt;5K (Low)</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="rounded-xl border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="text-xs font-bold">Insurer</TableHead>
                      <TableHead className="text-xs font-bold text-center">Grievances (FY25)</TableHead>
                      <TableHead className="text-xs font-bold text-center">% Change (YoY)</TableHead>
                      <TableHead className="text-xs font-bold">Top Complaint Type</TableHead>
                      <TableHead className="text-xs font-bold text-center">Level</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complaintData.map((row, idx) => {
                      const style = getLevelStyle(row.level);
                      return (
                        <TableRow key={idx} className={style.rowBg}>
                          <TableCell className="text-sm font-semibold text-foreground">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                              {row.insurer}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-center font-bold text-foreground">
                            {formatNumber(row.grievances)}
                          </TableCell>
                          <TableCell className="text-sm text-center">
                            <Badge
                              className={`text-[10px] font-semibold ${
                                row.changePositive
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-0'
                                  : 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-0'
                              }`}
                            >
                              {row.changePositive ? '↑' : '↑'} {row.change}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {row.topComplaint}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={`text-[10px] font-semibold ${style.badge}`}>
                              {style.label}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Source Footer ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-6 flex items-start gap-2 px-1"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0 mt-0.5" />
          <p className="text-[10px] text-muted-foreground/70 leading-relaxed">
            Source: IRDAI Annual Report FY25. Complaint data indicative hai aur insurer ki underwriting policy ke according vary kar sakta hai.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
