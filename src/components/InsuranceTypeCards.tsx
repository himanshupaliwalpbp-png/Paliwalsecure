'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/lib/i18n';
import { Heart, Car, Shield, Plane, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface CardData {
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
  priceKey: string;
  featured?: boolean;
  exploreKey: string;
}

const cards: CardData[] = [
  {
    icon: Heart,
    titleKey: 'insuranceCards.v2.health.title',
    descKey: 'insuranceCards.v2.health.desc',
    priceKey: 'insuranceCards.v2.health.price',
    featured: true,
    exploreKey: 'insuranceCards.v2.explore',
  },
  {
    icon: Car,
    titleKey: 'insuranceCards.v2.motor.title',
    descKey: 'insuranceCards.v2.motor.desc',
    priceKey: 'insuranceCards.v2.motor.price',
    exploreKey: 'insuranceCards.v2.explore',
  },
  {
    icon: Shield,
    titleKey: 'insuranceCards.v2.life.title',
    descKey: 'insuranceCards.v2.life.desc',
    priceKey: 'insuranceCards.v2.life.price',
    exploreKey: 'insuranceCards.v2.explore',
  },
  {
    icon: Plane,
    titleKey: 'insuranceCards.v2.travel.title',
    descKey: 'insuranceCards.v2.travel.desc',
    priceKey: 'insuranceCards.v2.travel.price',
    exploreKey: 'insuranceCards.v2.explore',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function InsuranceTypeCards() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const { t } = useLanguage();

  return (
    <section dir="ltr" className="relative py-16 sm:py-24 lg:py-20 overflow-hidden">
      {/* Section glow */}
      <div className="absolute inset-0 section-glow" />

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {cards.map((card) => {
            const IconComp = card.icon;
            const isFeatured = card.featured;

            return (
              <motion.div
                key={card.titleKey}
                variants={cardVariants}
                whileHover={{
                  scale: 1.04,
                  transition: { type: 'spring', stiffness: 300, damping: 20 },
                }}
                className={`
                  group glass-card p-6 sm:p-8 flex flex-col gap-4 cursor-pointer relative
                  ${isFeatured ? 'md:col-span-2 lg:col-span-2' : ''}
                `}
                style={{
                  // Gold border glow on hover
                  transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201, 138, 28, 0.5)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 40px -10px rgba(201, 138, 28, 0.35), 0 0 40px rgba(201, 138, 28, 0.2)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201, 138, 28, 0.22)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
                }}
              >
                {/* Featured badge */}
                {isFeatured && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-[#0A1330] text-xs font-bold">
                      ⭐ {t('insuranceCards.v2.featured')}
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C98A1C]/20 to-[#C98A1C]/5 border border-[#C98A1C]/20 flex items-center justify-center group-hover:from-[#C98A1C]/30 group-hover:border-[#C98A1C]/40 transition-all duration-300 ${isFeatured ? 'w-14 h-14' : ''}`}>
                  <IconComp className={`dark:text-[#C98A1C] text-amber-700 dark:group-hover:text-[#C98A1C] group-hover:text-amber-600 transition-colors duration-300 ${isFeatured ? 'w-7 h-7' : 'w-6 h-6'}`} />
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl lg:text-3xl font-bold dark:text-white text-slate-900 font-heading leading-tight">
                  {t(card.titleKey)}
                </h3>

                {/* Description */}
                <p className="text-sm lg:text-lg dark:text-[#8A96A8] text-slate-500 leading-relaxed flex-1">
                  {t(card.descKey)}
                </p>

                {/* Price */}
                <p className="text-base sm:text-lg lg:text-2xl font-bold font-mono gradient-text">
                  {t(card.priceKey)}
                </p>

                {/* Explore link */}
                <div className="flex items-center gap-2 dark:text-[#C98A1C] text-amber-700 dark:group-hover:text-[#C98A1C] group-hover:text-amber-600 transition-colors duration-300">
                  <span className="text-sm font-semibold">{t(card.exploreKey)}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
