'use client';
import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { useThemeAware } from '@/lib/use-theme-aware';

/* ═══════════════════════════════════════════════════════════════════════════
   FAQSection — Accordion FAQ with Animated Expand/Collapse
   Design: Dark Premium #0A1330 × Gold #C98A1C, glass-card style
   ═══════════════════════════════════════════════════════════════════════════ */

const faqKeys = [
  { q: 'landing.faq.q1', a: 'landing.faq.a1' },
  { q: 'landing.faq.q2', a: 'landing.faq.a2' },
  { q: 'landing.faq.q3', a: 'landing.faq.a3' },
  { q: 'landing.faq.q4', a: 'landing.faq.a4' },
  { q: 'landing.faq.q5', a: 'landing.faq.a5' },
  { q: 'landing.faq.q6', a: 'landing.faq.a6' },
  { q: 'landing.faq.q7', a: 'landing.faq.a7' },
  { q: 'landing.faq.q8', a: 'landing.faq.a8' },
];

/* ─── FAQ Item Component ────────────────────────────────────────────────── */
function FAQItem({
  questionKey,
  answerKey,
  index,
  isOpen,
  onToggle,
  isInView,
  isDark,
}: {
  questionKey: string;
  answerKey: string;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  isInView: boolean;
  isDark: boolean;
}) {
  const { t } = useLanguage();

  return (
    <motion.div
      className={`overflow-hidden ${isDark ? 'bg-white/[0.04] border border-white/[0.06]' : 'bg-white border border-[#E5E2DB] shadow-sm'}`}
      style={{ borderRadius: '16px' }}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* ─── Question Row ─── */}
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left group transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C98A1C]/50 rounded-2xl ${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-[#F5F4F0]'}`}
        aria-expanded={isOpen}
      >
        <span className={`${isDark ? 'text-[#C98A1C]' : 'text-[#A67C1A]'} lg:text-lg font-semibold text-sm sm:text-base leading-relaxed font-[family-name:var(--font-sans)]`}>
          {t(questionKey)}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex-shrink-0"
        >
          <Plus
            className="w-5 h-5 text-[#C98A1C]"
            strokeWidth={2.5}
            aria-hidden="true"
          />
        </motion.div>
      </button>

      {/* ─── Answer (Animated) ─── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ maxHeight: 0, opacity: 0 }}
            animate={{ maxHeight: 300, opacity: 1 }}
            exit={{ maxHeight: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
              <div className={`border-t pt-4 ${isDark ? 'border-white/[0.06]' : 'border-[#E5E2DB]'}`}>
                <p className={`lg:text-base text-sm sm:text-base leading-relaxed font-[family-name:var(--font-sans)] ${isDark ? 'text-white/95' : 'text-[#1A1A2E]/85'}`}>
                  {t(answerKey)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main FAQSection Component
   ═══════════════════════════════════════════════════════════════════════════ */
export default function FAQSection() {
  const { t } = useLanguage();
  const { isDark } = useThemeAware();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-20 lg:py-24"
      style={{ background: isDark ? '#050B18' : '#FAFAF8' }}
      dir="ltr"
    >
      {/* ─── Section Glow ─── */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(201,138,28,0.06) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-[700px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── Heading ─── */}
        <motion.div
          className="text-center mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className={`text-3xl sm:text-4xl lg:text-4xl font-bold tracking-tight mb-3 font-[family-name:var(--font-heading)] ${isDark ? 'text-white' : 'text-[#0A1330]'}`}>
            <span className="gradient-text-universal">{t('landing.faq.heading')}</span>
          </h2>
          <p className={`text-base sm:text-lg font-[family-name:var(--font-sans)] ${isDark ? 'text-[#D0D8E0]' : 'text-[#6B7280]'}`}>
            {t('landing.faq.subheading')}
          </p>
        </motion.div>

        {/* ─── FAQ Items ─── */}
        <div className="flex flex-col gap-3 sm:gap-4">
          {faqKeys.map((faq, index) => (
            <FAQItem
              key={index}
              questionKey={faq.q}
              answerKey={faq.a}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
              isInView={isInView}
              isDark={isDark}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
