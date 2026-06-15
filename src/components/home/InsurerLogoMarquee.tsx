'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/lib/i18n';

// ── Insurer data with full logo-style display ──────────────────────────────────
interface InsurerItem {
  name: string;
  shortName: string;
  color: string;
  textColor: string;
}

const INSURERS: InsurerItem[] = [
  { name: 'HDFC Ergo', shortName: 'HE', color: '#003B73', textColor: '#FFFFFF' },
  { name: 'ICICI Lombard', shortName: 'IL', color: '#F7941D', textColor: '#FFFFFF' },
  { name: 'Star Health', shortName: 'SH', color: '#C8102E', textColor: '#FFFFFF' },
  { name: 'Bajaj Allianz', shortName: 'BA', color: '#003399', textColor: '#FFFFFF' },
  { name: 'New India Assurance', shortName: 'NI', color: '#1B5E20', textColor: '#FFFFFF' },
  { name: 'SBI General', shortName: 'SB', color: '#00529B', textColor: '#FFFFFF' },
  { name: 'Niva Bupa', shortName: 'NB', color: '#6A1B9A', textColor: '#FFFFFF' },
  { name: 'Care Health', shortName: 'CH', color: '#E65100', textColor: '#FFFFFF' },
  { name: 'Digit Insurance', shortName: 'DI', color: '#0D47A1', textColor: '#FFFFFF' },
  { name: 'Go Digit', shortName: 'GD', color: '#00695C', textColor: '#FFFFFF' },
  { name: 'Tata AIG', shortName: 'TA', color: '#0E1220', textColor: '#FFFFFF' },
  { name: 'Magma HDI', shortName: 'MH', color: '#B71C1C', textColor: '#FFFFFF' },
  { name: 'Royal Sundaram', shortName: 'RS', color: '#1565C0', textColor: '#FFFFFF' },
  { name: 'Reliance General', shortName: 'RG', color: '#1A237E', textColor: '#FFFFFF' },
  { name: 'Universal Sompo', shortName: 'US', color: '#004D40', textColor: '#FFFFFF' },
];

// ── Component ──────────────────────────────────────────────────────────────────
export default function InsurerLogoMarquee() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const isEnglish = language === 'en';
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const ariaLabel = isHindi
    ? 'AI तैयार | IRDAI सत्यापित | पूरे भारत में परिवारों का भरोसा'
    : isEnglish
      ? 'AI Ready | IRDAI Verified | Families trust across India'
      : 'AI Ready | IRDAI Verified | Poori India mein parivaron ka bharosa';

  const allInsurers = [...INSURERS, ...INSURERS];

  return (
    <section
      dir="ltr"
      className="relative w-full py-8 sm:py-10 overflow-hidden bg-background dark:bg-[#0F172A] section-luxury-divider"
      aria-label={ariaLabel}
    >
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-[#A9C0E0] dark:from-[#0F172A] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[#A9C0E0] dark:from-[#0F172A] to-transparent z-10 pointer-events-none" />

      <div ref={ref} className="relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="group flex"
          style={{ width: 'max-content' }}
        >
          <div
            className="flex animate-marquee-left group-hover:[animation-play-state:paused]"
            style={{ animationDuration: '45s' }}
          >
            {allInsurers.map((insurer, idx) => (
              <div
                key={`insurer-${idx}`}
                className="flex items-center gap-3 px-5 sm:px-6 py-3 sm:py-3.5 shrink-0 mx-2 sm:mx-2.5 rounded-2xl bg-white dark:bg-white/5 border border-[#E2E8F0] dark:border-white/8 transition-all duration-300 hover:-translate-y-1 hover:shadow-premium hover:border-[#2563EB]/20 dark:hover:bg-white/8 dark:hover:border-[#3B82F6]/20 cursor-default"
              >
                {/* Logo badge with full company name initial */}
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: insurer.color }}
                >
                  <span className="text-[11px] sm:text-xs font-extrabold text-white font-heading leading-none tracking-wide">
                    {insurer.shortName}
                  </span>
                </div>
                {/* Full company name - prominently displayed */}
                <span className="text-sm sm:text-[15px] font-semibold text-[#0F172A]/80 dark:text-[#F8FAFC]/80 whitespace-nowrap transition-colors duration-300 font-heading tracking-tight">
                  {insurer.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
