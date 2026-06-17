'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/lib/i18n';
import { Heart, Car, Shield, Plane, ArrowRight, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface CardData {
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
  priceKey: string;
  featured?: boolean;
  exploreKey: string;
  /** 3-tone color family: emerald (protection) / sienna (action) / gold (premium) */
  colorFamily: 'emerald' | 'sienna' | 'gold';
}

const cards: CardData[] = [
  {
    icon: Heart,
    titleKey: 'insuranceCards.v2.health.title',
    descKey: 'insuranceCards.v2.health.desc',
    priceKey: 'insuranceCards.v2.health.price',
    featured: true,
    exploreKey: 'insuranceCards.v2.explore',
    colorFamily: 'emerald', // Health = trust, protection
  },
  {
    icon: Car,
    titleKey: 'insuranceCards.v2.motor.title',
    descKey: 'insuranceCards.v2.motor.desc',
    priceKey: 'insuranceCards.v2.motor.price',
    exploreKey: 'insuranceCards.v2.explore',
    colorFamily: 'sienna', // Motor = action, energy
  },
  {
    icon: Shield,
    titleKey: 'insuranceCards.v2.life.title',
    descKey: 'insuranceCards.v2.life.desc',
    priceKey: 'insuranceCards.v2.life.price',
    exploreKey: 'insuranceCards.v2.explore',
    colorFamily: 'emerald', // Life = trust, protection
  },
  {
    icon: Plane,
    titleKey: 'insuranceCards.v2.travel.title',
    descKey: 'insuranceCards.v2.travel.desc',
    priceKey: 'insuranceCards.v2.travel.price',
    exploreKey: 'insuranceCards.v2.explore',
    colorFamily: 'gold', // Travel = premium, valuable
  },
];

// 3-tone color map — each family has its own icon tint, badge bg, accent text
const colorConfig = {
  emerald: {
    iconBg: 'bg-[#E6F4EF] dark:bg-[rgba(45,106,79,0.18)]',
    iconBorder: 'border-[rgba(45,106,79,0.20)] dark:border-[rgba(45,106,79,0.30)]',
    iconColor: 'text-[#2D6A4F] dark:text-[#6EE7B7]',
    iconHoverBg: 'group-hover:bg-[#D5EDE3] dark:group-hover:bg-[rgba(45,106,79,0.28)]',
    accent: 'text-[#2D6A4F] dark:text-[#6EE7B7]',
    badgeBg: 'bg-[#E6F4EF] dark:bg-[rgba(45,106,79,0.18)]',
    badgeText: 'text-[#2D6A4F] dark:text-[#6EE7B7]',
    glow: 'rgba(45,106,79,0.18)',
  },
  sienna: {
    iconBg: 'bg-[#FBE8E1] dark:bg-[rgba(184,72,44,0.18)]',
    iconBorder: 'border-[rgba(184,72,44,0.20)] dark:border-[rgba(184,72,44,0.32)]',
    iconColor: 'text-[#B8482C] dark:text-[#F0A88B]',
    iconHoverBg: 'group-hover:bg-[#F8DDD2] dark:group-hover:bg-[rgba(184,72,44,0.28)]',
    accent: 'text-[#B8482C] dark:text-[#F0A88B]',
    badgeBg: 'bg-[#FBE8E1] dark:bg-[rgba(184,72,44,0.18)]',
    badgeText: 'text-[#B8482C] dark:text-[#F0A88B]',
    glow: 'rgba(184,72,44,0.18)',
  },
  gold: {
    iconBg: 'bg-[#FBF3DD] dark:bg-[rgba(184,134,11,0.18)]',
    iconBorder: 'border-[rgba(184,134,11,0.22)] dark:border-[rgba(232,200,114,0.32)]',
    iconColor: 'text-[#B8860B] dark:text-[#E8C872]',
    iconHoverBg: 'group-hover:bg-[#F8EAC4] dark:group-hover:bg-[rgba(184,134,11,0.28)]',
    accent: 'text-[#B8860B] dark:text-[#E8C872]',
    badgeBg: 'bg-[#FBF3DD] dark:bg-[rgba(184,134,11,0.18)]',
    badgeText: 'text-[#8B6508] dark:text-[#E8C872]',
    glow: 'rgba(184,134,11,0.20)',
  },
} as const;

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
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
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
            const colors = colorConfig[card.colorFamily];

            return (
              <motion.div
                key={card.titleKey}
                variants={cardVariants}
                whileHover={{
                  scale: 1.03,
                  transition: { type: 'spring', stiffness: 300, damping: 20 },
                }}
                className={`
                  group glass-card p-6 sm:p-8 flex flex-col gap-4 cursor-pointer relative
                  ${isFeatured ? 'md:col-span-2 lg:col-span-2' : ''}
                `}
              >
                {/* Featured badge */}
                {isFeatured && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${colors.badgeBg} ${colors.badgeText} text-xs font-bold border ${colors.iconBorder}`}>
                      <Sparkles className="w-3 h-3" strokeWidth={2.5} />
                      {t('insuranceCards.v2.featured')}
                    </span>
                  </div>
                )}

                {/* Icon — colored by category family */}
                <div className={`w-12 h-12 rounded-2xl ${colors.iconBg} ${colors.iconHoverBg} border ${colors.iconBorder} flex items-center justify-center transition-all duration-300 ${isFeatured ? 'w-14 h-14' : ''}`}>
                  <IconComp className={`w-6 h-6 ${colors.iconColor} transition-colors duration-300 ${isFeatured ? 'w-7 h-7' : ''}`} strokeWidth={2} />
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl lg:text-3xl font-bold text-[#0E1116] dark:text-[#FAF7F2] font-heading leading-tight">
                  {t(card.titleKey)}
                </h3>

                {/* Description */}
                <p className="text-sm lg:text-lg text-[#4A4F57] dark:text-[#A8B0C2] leading-relaxed flex-1">
                  {t(card.descKey)}
                </p>

                {/* Price — accent color by category */}
                <p className={`text-base sm:text-lg lg:text-2xl font-bold font-mono ${colors.accent}`}>
                  {t(card.priceKey)}
                </p>

                {/* Explore link */}
                <div className={`flex items-center gap-2 ${colors.accent} transition-colors duration-300`}>
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
