'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';
import { useThemeAware } from '@/lib/use-theme-aware';

/* ═══════════════════════════════════════════════════════════════════════════
   HowItWorks — 3-Step Timeline Section
   "Kaise Kaam Karta Hai" — Smart insurance ke liye sirf 3 simple steps
   ═══════════════════════════════════════════════════════════════════════════ */

/* Step data structure */
interface StepData {
  number: string;
  titleKey: string;
  descKey: string;
}

const steps: StepData[] = [
  {
    number: '01',
    titleKey: 'howItWorksNew.step1.title',
    descKey: 'howItWorksNew.step1.desc',
  },
  {
    number: '02',
    titleKey: 'howItWorksNew.step2.title',
    descKey: 'howItWorksNew.step2.desc',
  },
  {
    number: '03',
    titleKey: 'howItWorksNew.step3.title',
    descKey: 'howItWorksNew.step3.desc',
  },
];

/* ─── Step Card Component ─── */
function StepCard({
  step,
  index,
  isInView,
  isDark,
}: {
  step: StepData;
  index: number;
  isInView: boolean;
  isDark: boolean;
}) {
  const { t } = useLanguage();

  return (
    <motion.div
      className="relative flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.65,
        delay: 0.2 + index * 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* ─── Step Number Circle (64px, golden bg, white text) ─── */}
      <motion.div
        className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full mb-6"
        style={{
          background: 'linear-gradient(135deg, #C98A1C, #C98A1C)',
          boxShadow: '0 0 30px rgba(201,138,28,0.3), 0 4px 12px rgba(0,0,0,0.2)',
        }}
        whileHover={{
          scale: 1.08,
          boxShadow: '0 0 40px rgba(201,138,28,0.5), 0 6px 16px rgba(0,0,0,0.3)',
        }}
        transition={{ duration: 0.25 }}
      >
        <span
          className="text-xl font-extrabold text-[#0A1330] font-[family-name:var(--font-mono)]"
          data-mono
        >
          {step.number}
        </span>
      </motion.div>

      {/* ─── Content Box (glass-card style, rounded-24px) ─── */}
      <div
        className={`w-full p-6 sm:p-8 backdrop-blur-sm lg:backdrop-blur-xl border rounded-3xl ${isDark ? 'bg-white/[0.06] border-[rgba(201,138,28,0.22)]' : 'bg-white border-[#E5E2DB] shadow-sm'}`}
      >
        <h3 className={`text-lg sm:text-xl lg:text-xl font-bold mb-3 font-[family-name:var(--font-heading)] ${isDark ? 'text-white' : 'text-[#0A1330]'}`}>
          {t(step.titleKey)}
        </h3>
        <p className={`text-sm sm:text-base lg:text-lg ${isDark ? 'text-white/90' : 'text-[#1A1A2E]/80'} leading-relaxed`}>
          {t(step.descKey)}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Main Component ─── */
export default function HowItWorks() {
  const { t } = useLanguage();
  const { isDark } = useThemeAware();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-20 lg:py-28 overflow-hidden"
      style={{
        background: isDark
          ? 'linear-gradient(180deg, #0A1330 0%, #0F1D30 50%, #0A1330 100%)'
          : 'linear-gradient(180deg, #FAFAF8 0%, #F0F4FF 50%, #FAFAF8 100%)',
      }}
    >
      {/* ─── Background Glow ─── */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse at 50% 20%, rgba(201,138,28,0.07) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── Section Header ─── */}
        <motion.div
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.h2
            className={`text-3xl sm:text-4xl lg:text-4xl font-extrabold mb-4 font-[family-name:var(--font-heading)] ${isDark ? 'text-white' : 'text-[#0A1330]'}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t('howItWorksNew.heading')}
          </motion.h2>
          <motion.p
            className={`text-base sm:text-lg lg:text-xl ${isDark ? 'text-white/90' : 'text-[#1A1A2E]/80'} max-w-2xl mx-auto leading-relaxed`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('howItWorksNew.subheading')}
          </motion.p>
        </motion.div>

        {/* ─── Steps with Connecting Line (Desktop) ─── */}
        <div className="relative">
          {/* ─── Vertical Connecting Line (desktop only) ─── */}
          <div
            className="hidden lg:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 pointer-events-none"
            aria-hidden="true"
            style={{
              width: '2px',
              background: 'linear-gradient(180deg, transparent 0%, #C98A1C 20%, #C98A1C 50%, #C98A1C 80%, transparent 100%)',
              opacity: 0.4,
            }}
          />

          {/* ─── Desktop Layout: 3 columns with connecting line ─── */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <StepCard
                key={step.number}
                step={step}
                index={index}
                isInView={isInView}
                isDark={isDark}
              />
            ))}
          </div>

          {/* ─── Mobile/Tablet Layout: Vertical Stack ─── */}
          <div className="lg:hidden space-y-8">
            {/* Mobile Vertical Connecting Line */}
            <div
              className="absolute left-8 top-16 bottom-16 pointer-events-none"
              aria-hidden="true"
              style={{
                width: '2px',
                background: 'linear-gradient(180deg, transparent 0%, #C98A1C 20%, #C98A1C 50%, #C98A1C 80%, transparent 100%)',
                opacity: 0.3,
              }}
            />
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="relative flex items-start gap-6"
                initial={{ opacity: 0, y: 32 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.65,
                  delay: 0.2 + index * 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                {/* Step Number Circle */}
                <div
                  className="relative z-10 flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #C98A1C, #C98A1C)',
                    boxShadow: '0 0 24px rgba(201,138,28,0.3), 0 4px 12px rgba(0,0,0,0.2)',
                  }}
                >
                  <span
                    className="text-xl font-extrabold text-[#0A1330] font-[family-name:var(--font-mono)]"
                    data-mono
                  >
                    {step.number}
                  </span>
                </div>

                {/* Content Box */}
                <div
                  className={`flex-1 p-5 sm:p-6 backdrop-blur-sm lg:backdrop-blur-xl border rounded-3xl ${isDark ? 'bg-white/[0.06] border-[rgba(201,138,28,0.22)]' : 'bg-white border-[#E5E2DB] shadow-sm'}`}
                >
                  <h3 className={`text-lg sm:text-xl lg:text-xl font-bold mb-2 font-[family-name:var(--font-heading)] ${isDark ? 'text-white' : 'text-[#0A1330]'}`}>
                    {t(step.titleKey)}
                  </h3>
                  <p className={`text-sm sm:text-base lg:text-lg ${isDark ? 'text-white/90' : 'text-[#1A1A2E]/80'} leading-relaxed`}>
                    {t(step.descKey)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
