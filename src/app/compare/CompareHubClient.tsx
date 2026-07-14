'use client';

import { motion, type Variants } from 'framer-motion';
import { Shield, ShieldCheck, Clock, Sparkles, CheckCircle2, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CategoryHub from '@/components/compare/CategoryHub';

/* ────────────────────────────────────────────────────────────────────────────
   Compare Hub Client Page
   ──────────────────────────────────────────────────────────────────────────── */

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function CompareHubClient() {
  return (
    <div className="min-h-screen">
      {/* ================================================================ */}
      {/* HERO SECTION — Insurance Compare Engine                          */}
      {/* ================================================================ */}
      <section className="relative overflow-hidden pt-12 sm:pt-16 pb-16 sm:pb-24">
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800" />

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 animate-gradient-x bg-[linear-gradient(110deg,transparent_30%,rgba(99,102,241,0.1)_50%,transparent_70%)] bg-[length:200%_100%]" />

        {/* Floating orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* Floating decorative shapes */}
        <motion.div
          className="hidden lg:block absolute top-24 left-[10%] w-14 h-14 bg-amber-400/10 rounded-2xl rotate-12"
          animate={{ y: [-8, 8, -8], rotate: [12, 20, 12] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' as const }}
        />
        <motion.div
          className="hidden lg:block absolute bottom-20 right-[12%] w-18 h-18 bg-blue-400/10 rounded-full"
          animate={{ y: [6, -6, 6] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' as const }}
        />
        <motion.div
          className="hidden lg:block absolute top-32 right-[30%] w-10 h-10 bg-teal-400/10 rounded-xl rotate-45"
          animate={{ y: [5, -5, 5], rotate: [45, 55, 45] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' as const }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="badge-shimmer mb-4 sm:mb-6 bg-amber-500/20 text-amber-300 border-amber-400/30 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                IRDAI Certified POSP — Accurate Rates
              </Badge>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[1.8rem] sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.15]"
            >
              <span className="gradient-text">Insurance Compare Engine</span>
              <br />
              <span className="gradient-text-amber">IRDAI Accurate Rates</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
            >
              Compare real premiums from IRDAI-registered insurers. No fake discounts — only
              regulator-approved rates with transparent breakdowns. Save up to{' '}
              <span className="text-amber-400 font-semibold">18% GST</span> on Health &amp; Life via POSP route.
            </motion.p>

            {/* Key benefits */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 flex flex-wrap justify-center gap-2.5 sm:gap-4"
            >
              {[
                { icon: ShieldCheck, text: 'IRDAI Mandated Rates' },
                { icon: Sparkles, text: '5 Insurance Categories' },
                { icon: Clock, text: 'Updated FY 2024-25' },
              ].map((benefit) => {
                const BIcon = benefit.icon;
                return (
                  <div
                    key={benefit.text}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15"
                  >
                    <BIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs sm:text-sm font-medium text-white/90">
                      {benefit.text}
                    </span>
                  </div>
                );
              })}
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 sm:mt-14 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto"
            >
              {[
                { value: '5', label: 'Categories' },
                { value: '8+', label: 'Insurers' },
                { value: '0%', label: 'GST (Health/Life)' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-xl sm:text-3xl font-bold text-white counter-glow">
                    {stat.value}
                  </p>
                  <p className="text-[10px] sm:text-sm text-slate-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* ================================================================ */}
      {/* CATEGORY CARDS GRID                                              */}
      {/* ================================================================ */}
      <section className="py-12 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center max-w-2xl mx-auto mb-10 sm:mb-14"
          >
            <Badge className="mb-4 bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800 rounded-full px-4 py-1">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Choose Your Category
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
              Compare Insurance Across{' '}
              <span className="gradient-text-amber">5 Categories</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground">
              Select a category below to get instant, accurate premium comparisons from
              IRDAI-registered insurers.
            </p>
          </motion.div>

          {/* Category Cards — rendered via reusable component */}
          <CategoryHub />
        </div>
      </section>

      {/* ================================================================ */}
      {/* DATA FRESHNESS SECTION                                           */}
      {/* ================================================================ */}
      <section className="py-10 sm:py-16 bg-muted/30 border-y border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
              Data Freshness Guarantee
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              All rates sourced from{' '}
              <span className="font-semibold text-foreground">
                IRDAI FY 2024-25
              </span>{' '}
              mandated third-party tariffs, insurer filing records, and POSP advisory guidelines.
              Premiums are updated quarterly to reflect the latest regulatory changes.
            </p>

            {/* Data sources */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {[
                'IRDAI Tariff Orders',
                'Insurer Rate Filings',
                'POSP Advisory Circulars',
                'GST Exemption Rules',
              ].map((source) => (
                <span
                  key={source}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border/60 text-xs font-medium text-muted-foreground"
                >
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  {source}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* POSP INFO CARD                                                   */}
      {/* ================================================================ */}
      <section className="py-10 sm:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <div className="glass-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Why Paliwal Secure?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                As an IRDAI-certified POSP (Point of Sales Person), we can offer health and life
                insurance at <span className="font-semibold text-green-600 dark:text-green-400">0% GST</span>,
                saving you up to 18% on your premiums. Every quote is backed by regulator-approved
                rates — no inflated discounts, no hidden charges.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer">
                  <Button className="cta-amber btn-ripple rounded-full gap-2 shadow-md shadow-amber-600/20">
                    🎯 Get Best Plan
                  </Button>
                </a>
                <a href="https://wa.me/919257877312">
                  <Button variant="outline" className="rounded-full gap-2">
                    <Phone className="w-4 h-4" />
                    WhatsApp
                  </Button>
                </a>
              </div>

              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-[10px] text-muted-foreground">
                  IRDAI POSP: <span className="font-semibold">IP429834</span> • Agent: Himanshu Paliwal • Regulated by IRDAI of India
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
