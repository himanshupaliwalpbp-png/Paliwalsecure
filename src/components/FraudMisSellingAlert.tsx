'use client';

import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ShieldAlert,
  Info,
  Eye,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// ── Animation Variants ───────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ── Main Component ───────────────────────────────────────
export default function FraudMisSellingAlert() {
  return (
    <section id="fraud-alerts" className="py-16 sm:py-20 bg-background scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <Badge className="mb-4 bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800 rounded-full px-4 py-1">
            <Eye className="w-3.5 h-3.5 mr-1" />
            Consumer Awareness
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Fraud & Mis-Selling <span className="gradient-text">Alerts</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Dhyan rakhein — insurance mein fraud aur mis-selling ke signs pehchanein
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-6"
        >
          {/* ── Fraud Alert Card ──────────────────────────────── */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden border-amber-300 dark:border-amber-800/60 shadow-lg h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-amber-800 dark:text-amber-300">
                      Claim Fraud Estimate
                    </CardTitle>
                    <CardDescription className="text-[11px] text-amber-600/70 dark:text-amber-400/60">
                      Awareness indicator — NOT a verified fact
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 p-4">
                  {/* Visual indicator bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-amber-700 dark:text-amber-400">Estimated Fraud Range</span>
                      <span className="text-sm font-extrabold text-amber-800 dark:text-amber-300">10–15%</span>
                    </div>
                    <div className="w-full h-3 bg-amber-200/60 dark:bg-amber-800/30 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '15%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-700 rounded-full"
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[9px] text-amber-600/60 dark:text-amber-400/40">0%</span>
                      <span className="text-[9px] text-amber-600/60 dark:text-amber-400/40">100%</span>
                    </div>
                  </div>

                  <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                    Industry estimates suggest <span className="font-bold">10–15% of claims may involve fraud elements</span>{' '}
                    (Source: IRDAI/FMIC reports). This is for awareness only.
                  </p>
                </div>

                <div className="mt-3 flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-amber-500/70 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-600/60 dark:text-amber-400/50 leading-relaxed">
                    Yeh ek reference indicator hai, koi verified fact nahi. Fraud estimates vary karte hain source aur methodology ke according.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ── Mis-Selling Warning Card ──────────────────────── */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden border-rose-300 dark:border-rose-800/60 shadow-lg h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-rose-800 dark:text-rose-300">
                      Mis-Selling Warning
                    </CardTitle>
                    <CardDescription className="text-[11px] text-rose-600/70 dark:text-rose-400/60">
                      High-commission products ke pratyekshit dhyan rakhein
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 p-4">
                  <p className="text-sm text-rose-800 dark:text-rose-300 leading-relaxed mb-3">
                    Be aware of <span className="font-bold">high-commission products pushed by agents</span>. Agents may prioritize products that earn them more commission, not necessarily the best fit for you.
                  </p>

                  {/* Commission Data Box */}
                  <div className="rounded-lg bg-rose-100/60 dark:bg-rose-900/30 border border-rose-300/50 dark:border-rose-700/40 p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold text-rose-700 dark:text-rose-300">Key Data Point</span>
                    </div>
                    <p className="text-sm text-rose-800 dark:text-rose-300 leading-relaxed">
                      <span className="font-extrabold">HDFC Bank earned ₹6,467 Cr</span> in commission from insurance sales (FY25). Bank-led insurers may prioritize high-commission products.
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-rose-500/70 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-rose-600/60 dark:text-rose-400/50 leading-relaxed">
                    Mis-selling se bachne ke liye hamesha policy document padhein, free-look period use karein, aur multiple insurers compare karein.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* ── Regulatory Disclaimer Box ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="overflow-hidden border-blue-300 dark:border-blue-800/60 shadow-lg">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                  <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                    ⚠️ Important Regulatory Information
                  </h3>
                  <p className="text-sm text-blue-800/90 dark:text-blue-300/80 leading-relaxed">
                    IRDAI mandates that <span className="font-bold">no claim can be rejected for non-disclosure after 5 continuous years</span>{' '}
                    (moratorium period). However, insurers&apos; overall claim settlement ratios and complaint data vary.{' '}
                    <span className="font-semibold">Check individual insurer stats</span> before making a decision.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-0 text-[10px]">
                      Section 45 — Insurance Act
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-0 text-[10px]">
                      IRDAI Moratorium Clause
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-0 text-[10px]">
                      5-Year Protection
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
