'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/lib/i18n';
import { Brain, FileCheck, CheckCircle, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface PillarData {
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
}

const pillars: PillarData[] = [
  { icon: Brain, titleKey: 'whyPaliwal.v2.ai.title', descKey: 'whyPaliwal.v2.ai.desc' },
  { icon: FileCheck, titleKey: 'whyPaliwal.v2.rates.title', descKey: 'whyPaliwal.v2.rates.desc' },
  { icon: CheckCircle, titleKey: 'whyPaliwal.v2.claims.title', descKey: 'whyPaliwal.v2.claims.desc' },
  { icon: Users, titleKey: 'whyPaliwal.v2.support.title', descKey: 'whyPaliwal.v2.support.desc' },
];

const stats = [
  { key: 'whyPaliwal.v2.stat.policies' },
  { key: 'whyPaliwal.v2.stat.claims' },
  { key: 'whyPaliwal.v2.stat.fees' },
  { key: 'whyPaliwal.v2.stat.rating' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const statVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function WhyPaliwal() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const { t } = useLanguage();

  return (
    <section dir="ltr" className="relative py-16 sm:py-24 lg:py-20 overflow-hidden">
      {/* Section glow */}
      <div className="absolute inset-0 section-glow" />

      {/* Decorative orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#C98A1C]/[0.06] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-[#162D5A]/[0.08] rounded-full blur-3xl pointer-events-none" />

      <div ref={ref} className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight font-heading">
            <span className="dark:text-white text-slate-900">{t('whyPaliwal.v2.heading').replace('?', '')} </span>
            <span className="gradient-text italic">?</span>
          </h2>
        </motion.div>

        {/* 4 Pillar Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16"
        >
          {pillars.map((pillar) => {
            const IconComp = pillar.icon;
            return (
              <motion.div
                key={pillar.titleKey}
                variants={cardVariants}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="group glass-card p-5 sm:p-6 flex flex-col items-center text-center gap-4"
              >
                {/* Gold icon */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#C98A1C]/20 to-[#C98A1C]/5 border border-[#C98A1C]/20 flex items-center justify-center group-hover:from-[#C98A1C]/30 group-hover:border-[#C98A1C]/40 transition-all duration-300">
                  <IconComp className="w-6 h-6 sm:w-7 sm:h-7 dark:text-[#C98A1C] text-amber-700 dark:group-hover:text-[#C98A1C] group-hover:text-amber-600 transition-colors duration-300" />
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg lg:text-xl font-bold dark:text-white text-slate-900 font-heading leading-tight">
                  {t(pillar.titleKey)}
                </h3>

                {/* Description */}
                <p className="text-sm dark:text-[#8A96A8] text-slate-500 leading-relaxed">
                  {t(pillar.descKey)}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Stats Row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.key}
              variants={statVariants}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              className="glass-card p-4 sm:p-5 flex flex-col items-center text-center"
            >
              <span className="text-lg sm:text-xl font-bold gradient-text font-mono leading-tight">
                {t(stat.key)}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
