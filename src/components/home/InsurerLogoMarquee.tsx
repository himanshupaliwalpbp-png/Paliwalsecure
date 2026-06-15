'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/lib/i18n';

// ── Insurer data ───────────────────────────────────────────────────────────────
interface InsurerItem {
  name: string;
  shortName: string;
  color: string;
}

const INSURERS: InsurerItem[] = [
  { name: 'HDFC Ergo', shortName: 'HE', color: 'from-[#003B73] to-[#005A9C]' },
  { name: 'ICICI Lombard', shortName: 'IL', color: 'from-[#F7941D] to-[#F9A825]' },
  { name: 'Star Health', shortName: 'SH', color: 'from-[#C8102E] to-[#E53935]' },
  { name: 'Bajaj Allianz', shortName: 'BA', color: 'from-[#003399] to-[#1565C0]' },
  { name: 'New India Assurance', shortName: 'NI', color: 'from-[#1B5E20] to-[#2E7D32]' },
  { name: 'SBI General', shortName: 'SB', color: 'from-[#00529B] to-[#0277BD]' },
  { name: 'Niva Bupa', shortName: 'NB', color: 'from-[#6A1B9A] to-[#8E24AA]' },
  { name: 'Care Health', shortName: 'CH', color: 'from-[#E65100] to-[#EF6C00]' },
  { name: 'Digit Insurance', shortName: 'DI', color: 'from-[#0D47A1] to-[#1565C0]' },
  { name: 'Go Digit', shortName: 'GD', color: 'from-[#00695C] to-[#00897B]' },
  { name: 'Tata AIG', shortName: 'TA', color: 'from-[#0E1220] to-[#162D5A]' },
  { name: 'Magma HDI', shortName: 'MH', color: 'from-[#B71C1C] to-[#C62828]' },
  { name: 'Royal Sundaram', shortName: 'RS', color: 'from-[#1565C0] to-[#1976D2]' },
  { name: 'Reliance General', shortName: 'RG', color: 'from-[#1A237E] to-[#283593]' },
  { name: 'Universal Sompo', shortName: 'US', color: 'from-[#004D40] to-[#00695C]' },
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
      className="relative w-full py-10 sm:py-12 overflow-hidden bg-[#F6F5F1] dark:bg-[#0F172A] section-luxury-divider"
      aria-label={ariaLabel}
    >
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-[#F6F5F1] dark:from-[#0F172A] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[#F6F5F1] dark:from-[#0F172A] to-transparent z-10 pointer-events-none" />

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
            style={{ animationDuration: '60s' }}
          >
            {allInsurers.map((insurer, idx) => (
              <div
                key={`insurer-${idx}`}
                className="flex items-center gap-3.5 sm:gap-4 px-5 sm:px-6 py-5 sm:py-6 shrink-0 mx-2 sm:mx-2.5 rounded-xl bg-white dark:bg-white/[0.06] border border-[#E8E2D6] dark:border-white/[0.10] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#2563EB]/30 dark:hover:bg-white/[0.10] dark:hover:border-[#3B82F6]/30 cursor-default"
              >
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${insurer.color} flex items-center justify-center shrink-0 shadow-md ring-2 ring-white/30 transition-transform duration-300 group-hover:scale-110`}
                >
                  <span className="text-xs sm:text-sm font-bold text-white font-mono leading-none">
                    {insurer.shortName}
                  </span>
                </div>
                <span className="text-base sm:text-lg font-bold text-[#111111] dark:text-[#F1F5F9] whitespace-nowrap transition-colors duration-300 font-body drop-shadow-sm">
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
