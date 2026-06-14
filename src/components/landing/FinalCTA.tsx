'use client';
import { useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';
import { useThemeAware } from '@/lib/use-theme-aware';

/* ═══════════════════════════════════════════════════════════════════════════
   FinalCTA — Dramatic Call-to-Action Section
   Design: #0A1330 → #162D5A gradient, Gold accent, pulse-glow
   ═══════════════════════════════════════════════════════════════════════════ */

export default function FinalCTA() {
  const { t } = useLanguage();
  const { isDark } = useThemeAware();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });

  /* ─── Ripple effect on click ───────────────────────────────────────────── */
  const handleRipple = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.4);
        transform: scale(0);
        animation: ripple-anim 0.6s linear;
        pointer-events: none;
        left: ${x}px;
        top: ${y}px;
      `;
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    },
    []
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-28 lg:py-32 overflow-hidden"
      dir="ltr"
    >
      {/* ─── Dramatic Background Gradient ─── */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #050B18 0%, #162D5A 50%, #050B18 100%)'
            : 'linear-gradient(135deg, #FAFAF8 0%, #F0F4FF 50%, #FAFAF8 100%)',
        }}
      />

      {/* ─── Wave Pattern Overlay (8% opacity) ─── */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          opacity: 0.08,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='%23C8922A' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* ─── Decorative orbs — desktop only for performance ─── */}
      <div className="hidden lg:block" aria-hidden="true">
        <motion.div
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(201,138,28,0.12) 0%, transparent 70%)',
            border: '1px solid rgba(201,138,28,0.1)',
          }}
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(201,138,28,0.1) 0%, rgba(26,48,96,0.2) 50%, transparent 70%)',
            filter: 'blur(30px)',
          }}
          animate={{
            y: [0, 15, 0],
            scale: [1, 1.08, 1],
            opacity: [0.6, 0.9, 0.6],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      {/* ─── Content ─── */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* ─── Heading ─── */}
          <motion.h2
            className="text-4xl sm:text-5xl lg:text-5xl font-bold tracking-tight leading-tight mb-5 font-[family-name:var(--font-heading)]"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className={isDark ? 'text-white' : 'text-[#0A1330]'}>{t('landing.finalCTA.heading1')}</span>
            <br />
            <span className="gradient-text-universal italic">{t('landing.finalCTA.heading2')}</span>
          </motion.h2>

          {/* ─── Subtitle ─── */}
          <motion.p
            className={`${isDark ? 'text-white/90' : 'text-[#1A1A2E]/85'} text-base sm:text-lg lg:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed font-[family-name:var(--font-sans)]`}
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('landing.finalCTA.subtitle')}
          </motion.p>

          {/* ─── Main CTA Button ─── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            {/* Gold glow behind CTA */}
            <div
              className="absolute inset-0 -m-8 rounded-full pointer-events-none"
              aria-hidden="true"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(201,138,28,0.25) 0%, rgba(201,138,28,0.08) 40%, transparent 70%)',
                filter: 'blur(20px)',
              }}
            />
            <Link href="/compare">
              <ShinyButton variant="blue" className="relative z-10 text-base sm:text-lg lg:text-xl py-4 lg:py-5 px-8 sm:px-12 lg:px-16">
                {t('landing.finalCTA.buttonText')}
              </ShinyButton>
            </Link>
          </motion.div>

          {/* ─── Below Button Text ─── */}
          <motion.p
            className={`mt-5 ${isDark ? 'text-white/75' : 'text-[#1A1A2E]/60'} text-sm sm:text-base font-[family-name:var(--font-sans)]`}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {t('landing.finalCTA.belowButton')}
          </motion.p>

          {/* ─── Trust Badges Row ─── */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8"
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {[
              t('landing.finalCTA.trustBadge1'),
              t('landing.finalCTA.trustBadge2'),
              t('landing.finalCTA.trustBadge3'),
            ].map((badge, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(10, 22, 40, 0.04)',
                  border: '1px solid rgba(201, 138, 28, 0.15)',
                  color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(10, 22, 40, 0.5)',
                }}
              >
                {badge}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
