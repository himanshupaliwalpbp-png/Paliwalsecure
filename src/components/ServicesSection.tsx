'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Heart, Shield, Car, Bike, Plane, Home as HomeIcon } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const categories = [
  {
    emoji: '🏥',
    icon: Heart,
    titleKey: 'services.health.title',
    descKey: 'services.health.desc',
    priceKey: 'services.health.price',
    href: '/compare?tab=health',
  },
  {
    emoji: '🛡️',
    icon: Shield,
    titleKey: 'services.term.title',
    descKey: 'services.term.desc',
    priceKey: 'services.term.price',
    href: '/compare?tab=term',
  },
  {
    emoji: '🚗',
    icon: Car,
    titleKey: 'services.car.title',
    descKey: 'services.car.desc',
    priceKey: 'services.car.price',
    href: '/compare?tab=motor',
  },
  {
    emoji: '🛵',
    icon: Bike,
    titleKey: 'services.bike.title',
    descKey: 'services.bike.desc',
    priceKey: 'services.bike.price',
    href: '/compare?tab=motor',
  },
  {
    emoji: '✈️',
    icon: Plane,
    titleKey: 'services.travel.title',
    descKey: 'services.travel.desc',
    priceKey: 'services.travel.price',
    href: '/compare?tab=travel',
  },
  {
    emoji: '🏠',
    icon: HomeIcon,
    titleKey: 'services.home.title',
    descKey: 'services.home.desc',
    priceKey: 'services.home.price',
    href: '/compare?tab=home',
  },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function ServicesSection() {
  const { t, language } = useLanguage();

  return (
    <section
      dir="ltr"
      className="relative py-16 sm:py-24 bg-[#F8FAFC] dark:bg-[#071B3B] scroll-mt-16 overflow-hidden"
    >
      {/* Decorative radial glows */}
      <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-[#2563EB]/[0.04] dark:bg-[#2563EB]/[0.06] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-[#F4B400]/[0.04] dark:bg-[#F4B400]/[0.06] rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
        >
          <Badge
            variant="outline"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 dark:bg-[#F4B400]/10 border border-[#F4B400]/30 dark:border-[#F4B400]/25 text-sm font-semibold text-[#071B3B] dark:text-[#F4B400] mb-5 backdrop-blur-sm"
          >
            🛡️ {t('services.badge')}
          </Badge>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight font-heading text-[#071B3B] dark:text-white">
            {t('services.heading')}
          </h2>

          <p className="mt-4 text-[#071B3B]/70 dark:text-white/70 leading-relaxed text-base sm:text-lg">
            {t('services.description')}
          </p>
        </motion.div>

        {/* Category Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {categories.map((cat) => {
            const IconComp = cat.icon;
            return (
              <motion.div
                key={cat.href + cat.titleKey}
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group"
              >
                <Link href={cat.href} className="block h-full">
                  <div className="relative h-full rounded-2xl bg-white/80 dark:bg-[#071B3B]/70 backdrop-blur-xl border border-white/20 dark:border-[#F4B400]/15 shadow-lg shadow-black/[0.03] dark:shadow-black/20 p-5 sm:p-6 flex flex-col transition-all duration-300 group-hover:border-[#F4B400]/40 dark:group-hover:border-[#F4B400]/40 group-hover:shadow-xl group-hover:shadow-[#F4B400]/[0.08] dark:group-hover:shadow-[#F4B400]/[0.12]">
                    {/* Emoji + Icon row */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl leading-none">{cat.emoji}</span>
                      <div className="w-10 h-10 rounded-xl bg-[#071B3B]/[0.06] dark:bg-[#F4B400]/10 flex items-center justify-center group-hover:bg-[#F4B400]/15 dark:group-hover:bg-[#F4B400]/20 transition-colors">
                        <IconComp className="w-5 h-5 text-[#071B3B]/70 dark:text-[#F4B400]" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-[#071B3B] dark:text-white font-heading leading-tight mb-1">
                      {t(cat.titleKey)}
                    </h3>

                    {/* Price */}
                    <p className="text-base sm:text-lg font-bold text-[#F4B400] dark:text-[#F4B400] mb-2">
                      {t(cat.priceKey)}
                    </p>

                    {/* Key feature */}
                    <p className="text-sm text-[#071B3B]/60 dark:text-white/60 leading-relaxed flex-1 mb-4">
                      {t(cat.descKey)}
                    </p>

                    {/* CTA Button */}
                    <div className="mt-auto pt-3 border-t border-[#071B3B]/[0.06] dark:border-white/10">
                      <Button
                        variant="outline"
                        size="sm"
                        className="group/btn inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold border-[#071B3B]/20 dark:border-[#F4B400]/30 text-[#071B3B] dark:text-[#F4B400] hover:bg-[#F4B400] hover:text-white hover:border-[#F4B400] dark:hover:bg-[#F4B400] dark:hover:text-[#071B3B] dark:hover:border-[#F4B400] transition-all duration-200 bg-transparent"
                      >
                        {t('services.cta')}
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Button>
                    </div>

                    {/* Hover gold border glow overlay */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#F4B400]/20 transition-all duration-300 pointer-events-none" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
