'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/lib/i18n';
import { Shield, Building2, Eye, Headphones } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface BadgeItem {
  icon: LucideIcon;
  labelKey: string;
  descKey: string;
}

const badges: BadgeItem[] = [
  { icon: Shield, labelKey: 'trustBadges.v2.irdai.label', descKey: 'trustBadges.v2.irdai.desc' },
  { icon: Building2, labelKey: 'trustBadges.v2.insurers.label', descKey: 'trustBadges.v2.insurers.desc' },
  { icon: Eye, labelKey: 'trustBadges.v2.transparent.label', descKey: 'trustBadges.v2.transparent.desc' },
  { icon: Headphones, labelKey: 'trustBadges.v2.claims.label', descKey: 'trustBadges.v2.claims.desc' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function TrustBadges() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });
  const { t } = useLanguage();

  return (
    <section dir="ltr" className="relative w-full py-10 sm:py-14 lg:py-12 overflow-hidden">
      {/* Section glow background */}
      <div className="absolute inset-0 section-glow" />
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(201,138,28,0.03)] to-transparent" />

      <div ref={ref} className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {badges.map((badge) => {
            const IconComp = badge.icon;
            return (
              <motion.div
                key={badge.labelKey}
                variants={badgeVariants}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group glass-card p-5 sm:p-6 flex flex-col items-center text-center gap-3"
              >
                {/* Gold icon circle */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#C98A1C] to-[#E0A830] flex items-center justify-center shrink-0 group-hover:shadow-[0_0_20px_rgba(201,138,28,0.4)] transition-shadow duration-300">
                  <IconComp className="w-5 h-5 sm:w-6 sm:h-6 text-[#0A1330]" />
                </div>

                {/* Label */}
                <h3 className="text-sm sm:text-base lg:text-xl font-bold dark:text-white text-slate-900 font-heading leading-snug">
                  {t(badge.labelKey)}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm lg:text-lg dark:text-[#8A96A8] text-slate-500 leading-relaxed">
                  {t(badge.descKey)}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
