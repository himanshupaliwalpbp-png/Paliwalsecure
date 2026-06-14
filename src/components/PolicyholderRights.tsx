'use client';

import { motion } from 'framer-motion';
import {
  Shield,
  Clock,
  CheckCircle2,
  ArrowRight,
  Scale,
  UserCheck,
  Gavel,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// ── Appeal Steps Data ────────────────────────────────────
const appealSteps = [
  {
    step: 1,
    icon: UserCheck,
    title: 'Contact Grievance Redressal Officer (GRO)',
    description: 'Apne insurer ke GRO se complaint file karein. Har insurer ka GRO hota hai jo 15 din mein response deta hai.',
    color: 'from-emerald-400 to-emerald-600',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    step: 2,
    icon: Scale,
    title: 'File Complaint on Bima Bharosa Portal',
    description: 'IRDAI ka Bima Bharosa portal (earlier IGMS) pe complaint register karein. Online tracking milta hai aur IRDAI follow-up karta hai.',
    color: 'from-teal-400 to-teal-600',
    iconBg: 'bg-teal-100 dark:bg-teal-900/50',
    iconColor: 'text-teal-600 dark:text-teal-400',
  },
  {
    step: 3,
    icon: Gavel,
    title: 'Approach Insurance Ombudsman',
    description: 'Claims up to ₹50 lakh ke liye Insurance Ombudsman se contact karein. Yeh free hai aur binding decision deta hai.',
    color: 'from-cyan-400 to-cyan-600',
    iconBg: 'bg-cyan-100 dark:bg-cyan-900/50',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
  },
];

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
export default function PolicyholderRights() {
  return (
    <section id="policyholder-rights" className="py-16 sm:py-20 bg-background scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <Badge className="mb-4 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800 rounded-full px-4 py-1">
            <Shield className="w-3.5 h-3.5 mr-1" />
            Your Rights
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Policyholder <span className="gradient-text">Rights & Regulations</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            IRDAI ke dwara diye gaye rights — jaanein, samjhein, aur apna protection badhayein
          </p>
        </motion.div>

        {/* ── Top Row: Moratorium + Cashless ─────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-8"
        >
          {/* ── IRDAI Moratorium Clause Card ──────────────────── */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden border-2 border-emerald-300 dark:border-emerald-700/60 shadow-xl h-full">
              <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-5 sm:p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      5-Year Moratorium Protection
                    </h3>
                    <p className="text-sm text-white/80 mt-0.5">
                      Section 45 — Insurance Act
                    </p>
                  </div>
                </div>
              </div>
              <CardContent className="p-5 sm:p-6">
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 p-4">
                  <p className="text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed">
                    After <span className="font-extrabold text-emerald-700 dark:text-emerald-200">5 continuous years of coverage</span>,{' '}
                    <span className="font-bold">no claim can be rejected for non-disclosure</span> (Section 45 of Insurance Act).
                    Yeh aapka sabse bada protection hai — insurer policy reject nahi kar sakta non-disclosure ki basis pe.
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-0 text-[10px]">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Non-disclosure Protection
                  </Badge>
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-0 text-[10px]">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    5-Year Coverage Required
                  </Badge>
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-0 text-[10px]">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    IRDAI Mandated
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ── Cashless Timeline Card ────────────────────────── */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden border-2 border-teal-300 dark:border-teal-700/60 shadow-xl h-full">
              <div className="bg-gradient-to-br from-teal-600 via-cyan-600 to-sky-600 p-5 sm:p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                    <Clock className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      Cashless Claim Timeline
                    </h3>
                    <p className="text-sm text-white/80 mt-0.5">
                      IRDAI Mandated Timelines
                    </p>
                  </div>
                </div>
              </div>
              <CardContent className="p-5 sm:p-6">
                <div className="space-y-4">
                  {/* 1-Hour Pre-auth */}
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div className="w-0.5 h-6 bg-teal-200 dark:bg-teal-800/50 mt-2" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl font-extrabold text-teal-700 dark:text-teal-300">1 Hour</span>
                        <Badge className="bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border-0 text-[9px]">
                          IRDAI Mandated
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Cashless pre-authorisation — 1 ghante mein approval milna chahiye
                      </p>
                    </div>
                  </div>

                  {/* 3-Hour Discharge */}
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl font-extrabold text-cyan-700 dark:text-cyan-300">3 Hours</span>
                        <Badge className="bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300 border-0 text-[9px]">
                          IRDAI Mandated
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Discharge approval — 3 ghante mein final discharge hona chahiye
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/40 p-3">
                  <p className="text-xs text-teal-700 dark:text-teal-300 leading-relaxed">
                    💡 Agar in timelines pe insurer comply nahi karta, toh aap IRDAI mein complaint file kar sakte hain.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* ── How to Appeal Rejected Claims (3-Step Flow) ───── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="overflow-hidden border-0 shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                  <Scale className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">How to Appeal Rejected Claims</CardTitle>
                  <CardDescription className="text-[11px]">3-step process — IRDAI ke according claim rejection ko challenge karein</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="grid md:grid-cols-3 gap-4 md:gap-0 relative">
                {appealSteps.map((step, idx) => {
                  const StepIcon = step.icon;
                  return (
                    <motion.div
                      key={step.step}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.15 }}
                      className="relative"
                    >
                      <div className="md:px-4">
                        {/* Step Number Circle + Arrow */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                            {step.step}
                          </div>
                          {/* Arrow connector (hidden on last item) */}
                          {idx < appealSteps.length - 1 && (
                            <div className="hidden md:flex items-center absolute -right-3 top-5 z-10">
                              <ArrowRight className="w-5 h-5 text-emerald-400 dark:text-emerald-600" />
                            </div>
                          )}
                          {idx < appealSteps.length - 1 && (
                            <div className="flex md:hidden items-center justify-center ml-auto">
                              <ArrowRight className="w-5 h-5 text-emerald-400 dark:text-emerald-600 rotate-90" />
                            </div>
                          )}
                        </div>

                        {/* Step Content Card */}
                        <div className={`rounded-xl border border-border p-4 hover:shadow-md transition-shadow`}>
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-8 h-8 rounded-lg ${step.iconBg} flex items-center justify-center`}>
                              <StepIcon className={`w-4 h-4 ${step.iconColor}`} />
                            </div>
                            <h4 className="text-sm font-bold text-foreground leading-tight">
                              {step.title}
                            </h4>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom Note */}
              <div className="mt-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-1">
                      Yaad Rakhein
                    </p>
                    <p className="text-xs text-emerald-700/80 dark:text-emerald-400/70 leading-relaxed">
                      Claim rejection ke baad 30 din ke andar complaint file karein. Ombudsman ke paas complaint karne ke liye koi fee nahi lagti. Decision generally 3 months mein aata hai.
                    </p>
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
