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
      className="relative w-full py-8 sm:py-10 overflow-hidden bg-[#FBF5ED] dark:bg-[#021E29] section-luxury-divider"
      aria-label={ariaLabel}
    >
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-[#FBF5ED] dark:from-[#021E29] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[#FBF5ED] dark:from-[#021E29] to-transparent z-10 pointer-events-none" />

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
                className="flex items-center gap-2.5 px-4 sm:px-5 py-2.5 shrink-0 mx-1.5 sm:mx-2 rounded-xl bg-[#EED9BE] dark:bg-white/5 border border-[#D7C2A5] dark:border-white/8 transition-all duration-300 hover:-translate-y-1 hover:shadow-premium hover:border-[#043C50]/20 dark:hover:bg-white/8 dark:hover:border-[#3DB8D8]/20 cursor-default"
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br ${insurer.color} flex items-center justify-center shrink-0 shadow-sm ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-110`}
                >
                  <span className="text-[9px] sm:text-[10px] font-bold text-white font-mono leading-none">
                    {insurer.shortName}
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-[#043C50]/70 dark:text-[#EED9BE]/70 whitespace-nowrap transition-colors duration-300 font-body">
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
