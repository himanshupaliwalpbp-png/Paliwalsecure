'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, Lock, Star, Award } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { useThemeAware } from '@/lib/use-theme-aware';

/* ═══════════════════════════════════════════════════════════════════════════
   TrustBadgesSection — Trust & Credibility Badges
   Design: #0A1330 bg, Gold #C98A1C icons with glow pulse
   ═══════════════════════════════════════════════════════════════════════════ */

interface BadgeData {
  icon: React.ElementType;
  titleKey: string;
  subtitleKey: string;
  direction: 'left' | 'right';
}

const badges: BadgeData[] = [
  {
    icon: ShieldCheck,
    titleKey: 'landing.trustBadges.irdai.title',
    subtitleKey: 'landing.trustBadges.irdai.subtitle',
    direction: 'left',
  },
  {
    icon: Lock,
    titleKey: 'landing.trustBadges.security.title',
    subtitleKey: 'landing.trustBadges.security.subtitle',
    direction: 'right',
  },
  {
    icon: Star,
    titleKey: 'landing.trustBadges.satisfaction.title',
    subtitleKey: 'landing.trustBadges.satisfaction.subtitle',
    direction: 'left',
  },
  {
    icon: Award,
    titleKey: 'landing.trustBadges.recognition.title',
    subtitleKey: 'landing.trustBadges.recognition.subtitle',
    direction: 'right',
  },
];

/* ─── Glow Pulse Keyframe via inline style ───────────────────────────── */
const glowPulseStyle = `
  @keyframes badgeGlow {
    0%, 100% {
      filter: drop-shadow(0 0 6px rgba(201, 138, 28, 0.3));
    }
    50% {
      filter: drop-shadow(0 0 16px rgba(201, 138, 28, 0.6)) drop-shadow(0 0 30px rgba(201, 138, 28, 0.2));
    }
  }
`;

/* ─── Single Badge Component ────────────────────────────────────────────── */
function BadgeItem({
  badge,
  index,
  isInView,
  isDark,
}: {
  badge: BadgeData;
  index: number;
  isInView: boolean;
  isDark: boolean;
}) {
  const { t } = useLanguage();
  const Icon = badge.icon;

  const initialX = badge.direction === 'left' ? -50 : 50;

  return (
    <motion.div
      className="flex flex-col items-center text-center gap-2"
      initial={{ opacity: 0, x: initialX }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: initialX }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* ─── Icon with continuous glow pulse ─── */}
      <motion.div
        className="flex items-center justify-center w-20 h-20 rounded-2xl mb-1"
        style={{
          background: 'rgba(201, 138, 28, 0.08)',
          border: '1px solid rgba(201, 138, 28, 0.2)',
          animation: 'badgeGlow 2s ease-in-out infinite',
        }}
      >
        <Icon
          className="w-10 h-10"
          style={{ color: '#C98A1C' }}
          aria-hidden="true"
        />
      </motion.div>

      {/* ─── Title ─── */}
      <h3 className={`font-semibold text-sm sm:text-base lg:text-xl font-[family-name:var(--font-sans)] ${isDark ? 'text-white' : 'text-[#0A1330]'}`}>
        {t(badge.titleKey)}
      </h3>

      {/* ─── Subtitle ─── */}
      <p className={`text-xs sm:text-sm max-w-[200px] font-[family-name:var(--font-sans)] ${isDark ? 'text-white/85' : 'text-[#1A1A2E]/70'}`}>
        {t(badge.subtitleKey)}
      </p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main TrustBadgesSection Component
   ═══════════════════════════════════════════════════════════════════════════ */
export default function TrustBadgesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });
  const { isDark } = useThemeAware();

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-20 lg:py-[100px] px-5 sm:px-10 lg:px-[40px]"
      style={{ background: isDark ? '#0A1330' : '#FAFAF8' }}
      dir="ltr"
    >
      {/* ─── Inject glow keyframes ─── */}
      <style dangerouslySetInnerHTML={{ __html: glowPulseStyle }} />

      {/* ─── Subtle background glow ─── */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(201,138,28,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* ─── Badges Grid: 1 col mobile, 2x2 tablet, 4 row desktop ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {badges.map((badge, index) => (
            <BadgeItem
              key={index}
              badge={badge}
              index={index}
              isInView={isInView}
              isDark={isDark}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
