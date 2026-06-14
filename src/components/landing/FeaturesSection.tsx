'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Bot, CheckCircle, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { useThemeAware } from '@/lib/use-theme-aware';

/* ═══════════════════════════════════════════════════════════════════════════
   Feature Card Data
   ═══════════════════════════════════════════════════════════════════════════ */
const features = [
  {
    titleKey: 'landing.features.1.title',
    descKey: 'landing.features.1.desc',
    icon: Shield,
    color: '#F97316',
  },
  {
    titleKey: 'landing.features.2.title',
    descKey: 'landing.features.2.desc',
    icon: Bot,
    color: '#C98A1C',
  },
  {
    titleKey: 'landing.features.3.title',
    descKey: 'landing.features.3.desc',
    icon: CheckCircle,
    color: '#22C55E',
  },
  {
    titleKey: 'landing.features.4.title',
    descKey: 'landing.features.4.desc',
    icon: TrendingUp,
    color: '#162D5A',
  },
] as const;

/* ═══════════════════════════════════════════════════════════════════════════
   Feature Card Component — Theme-aware glass card
   ═══════════════════════════════════════════════════════════════════════════ */
function FeatureCard({
  title,
  description,
  icon: Icon,
  color,
  index,
  isDark,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  index: number;
  isDark: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`group relative rounded-2xl p-6 sm:p-8 transition-all duration-300 ${
        isDark
          ? 'border-white/[0.06] hover:border-white/[0.15] backdrop-blur-xl'
          : 'border-[#E5E2DB] hover:border-[#C98A1C]/30 bg-white shadow-sm hover:shadow-lg'
      }`}
      style={{
        background: isDark
          ? 'rgba(255,255,255,0.04)'
          : 'rgba(255,255,255,0.95)',
      }}
    >
      {/* Subtle glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        aria-hidden="true"
        style={{
          background: isDark
            ? `radial-gradient(circle at 50% 35%, ${color}12 0%, transparent 60%)`
            : `radial-gradient(circle at 50% 35%, ${color}08 0%, transparent 60%)`,
        }}
      />

      {/* Icon Container — Mode-aware background */}
      <div
        className={`relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 ${
          isDark ? '' : 'shadow-sm'
        }`}
        style={{
          background: isDark ? `${color}15` : `${color}10`,
          border: isDark
            ? `1px solid ${color}30`
            : `1px solid ${color}20`,
        }}
      >
        <Icon
          className="w-6 h-6 sm:w-7 sm:h-7"
          style={{ color }}
          aria-hidden="true"
        />
      </div>

      {/* Title */}
      <h3
        className={`relative z-10 text-lg sm:text-xl lg:text-2xl font-bold mb-2 font-[family-name:var(--font-heading)] ${
          isDark ? 'text-white' : 'text-[#0A1330]'
        }`}
      >
        {title}
      </h3>

      {/* Description — Muted text mode-aware */}
      <p
        className={`relative z-10 text-sm sm:text-base lg:text-lg leading-relaxed ${
          isDark ? 'text-[#8A96A8]' : 'text-[#6B7280]'
        }`}
      >
        {description}
      </p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main FeaturesSection Component
   ═══════════════════════════════════════════════════════════════════════════ */
export default function FeaturesSection() {
  const { t } = useLanguage();
  const { isDark } = useThemeAware();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      ref={sectionRef}
      className={`relative py-16 sm:py-20 lg:py-28 overflow-hidden ${
        isDark ? 'bg-[#050B18]' : 'bg-[#FAFAF8]'
      }`}
      style={{
        background: isDark
          ? 'linear-gradient(180deg, #050B18 0%, #0A1330 50%, #0F1D30 100%)'
          : 'linear-gradient(180deg, #FAFAF8 0%, #F0F4FF 50%, #FAFAF8 100%)',
      }}
    >
      {/* Subtle background glow — mode-aware intensity */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at 50% 0%, rgba(201,138,28,0.06) 0%, transparent 60%)'
            : 'radial-gradient(ellipse at 50% 0%, rgba(201,138,28,0.08) 0%, transparent 60%)',
        }}
      />

      {/* Decorative grid pattern — mode-aware */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage: isDark
            ? `linear-gradient(rgba(201,138,28,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,138,28,0.3) 1px, transparent 1px)`
            : `linear-gradient(rgba(10,22,40,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(10,22,40,0.15) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── Section Header ─── */}
        <motion.div
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.h2
            className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-4 font-[family-name:var(--font-heading)] ${
              isDark ? 'text-white' : 'text-[#0A1330]'
            }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t('landing.features.heading')}
          </motion.h2>
          <motion.p
            className={`text-base sm:text-lg lg:text-xl xl:text-2xl max-w-2xl mx-auto leading-relaxed ${
              isDark ? 'text-[#8A96A8]' : 'text-[#6B7280]'
            }`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('landing.features.subheading')}
          </motion.p>
        </motion.div>

        {/* ─── Feature Cards Grid ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.titleKey}
              title={t(feature.titleKey)}
              description={t(feature.descKey)}
              icon={feature.icon}
              color={feature.color}
              index={index}
              isDark={isDark}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
