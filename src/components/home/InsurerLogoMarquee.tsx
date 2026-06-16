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
  { name: 'HDFC Ergo', shortName: 'HE', color: 'from-[#0E1116] to-[#1B4D4A]' },
  { name: 'ICICI Lombard', shortName: 'IL', color: 'from-[#B8482C] to-[#8B3520]' },
  { name: 'Star Health', shortName: 'SH', color: 'from-[#9B2C2C] to-[#B8482C]' },
  { name: 'Bajaj Allianz', shortName: 'BA', color: 'from-[#1B4D4A] to-[#2D7A77]' },
  { name: 'New India Assurance', shortName: 'NI', color: 'from-[#2D6A4F] to-[#1B4D4A]' },
  { name: 'SBI General', shortName: 'SB', color: 'from-[#0E1116] to-[#4A4F57]' },
  { name: 'Niva Bupa', shortName: 'NB', color: 'from-[#8B3520] to-[#B8482C]' },
  { name: 'Care Health', shortName: 'CH', color: 'from-[#B8860B] to-[#B8482C]' },
  { name: 'Digit Insurance', shortName: 'DI', color: 'from-[#1B4D4A] to-[#0E1116]' },
  { name: 'Go Digit', shortName: 'GD', color: 'from-[#2D6A4F] to-[#1B4D4A]' },
  { name: 'Tata AIG', shortName: 'TA', color: 'from-[#0E1116] to-[#1B4D4A]' },
  { name: 'Magma HDI', shortName: 'MH', color: 'from-[#9B2C2C] to-[#8B3520]' },
  { name: 'Royal Sundaram', shortName: 'RS', color: 'from-[#1B4D4A] to-[#2D7A77]' },
  { name: 'Reliance General', shortName: 'RG', color: 'from-[#0E1116] to-[#1B4D4A]' },
  { name: 'Universal Sompo', shortName: 'US', color: 'from-[#2D6A4F] to-[#1B4D4A]' },
];

// ── Component ──────────────────────────────────────────────────────────────────
export default function InsurerLogoMarquee() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const isEnglish = language === 'en';
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const sectionTitle = isHindi
    ? 'हमारे बीमाकर्ता पार्टनर्स'
    : isEnglish
      ? 'Our Insurance Partners'
      : 'Humare Insurance Partners';

  const ariaLabel = isHindi
    ? 'AI तैयार | IRDAI सत्यापित | पूरे भारत में परिवारों का भरोसा'
    : isEnglish
      ? 'AI Ready | IRDAI Verified | Families trust across India'
      : 'AI Ready | IRDAI Verified | Poori India mein parivaron ka bharosa';

  // Duplicate the list twice for a seamless infinite marquee loop
  const allInsurers = [...INSURERS, ...INSURERS];

  return (
    <section
      dir="ltr"
      className="relative w-full bg-[#FAF7F2] dark:bg-[#0E1116]"
      aria-label={ariaLabel}
    >
      {/* Section Title */}
      <div className="text-center pt-6 sm:pt-8 pb-2 sm:pb-3">
        <h3 className="text-caption-premium text-[#8B9099] dark:text-[#8B9099]">
          {sectionTitle}
        </h3>
      </div>

      {/* Marquee viewport — overflow hidden here so logos scroll, NO fade gradients so all names stay fully visible */}
      <div ref={ref} className="relative pb-6 sm:pb-8 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="group flex"
          style={{ width: 'max-content' }}
        >
          <div
            className="flex animate-marquee-left group-hover:[animation-play-state:paused]"
            style={{ animationDuration: '80s' }}
          >
            {allInsurers.map((insurer, idx) => (
              <div
                key={`insurer-${idx}`}
                className="flex items-center gap-3 sm:gap-4 px-5 sm:px-7 py-3 sm:py-5 shrink-0 mx-2 sm:mx-3 rounded-2xl bg-white dark:bg-white/[0.06] border border-[rgba(14,17,22,0.08)] dark:border-white/[0.10] transition-all duration-300 hover:-translate-y-1 hover:shadow-premium hover:border-[rgba(14,17,22,0.16)] dark:hover:bg-white/[0.10] dark:hover:border-white/[0.20] cursor-default shadow-sm"
              >
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${insurer.color} flex items-center justify-center shrink-0 shadow-md ring-2 ring-white/30 transition-transform duration-300 group-hover:scale-110`}
                >
                  <span className="text-sm sm:text-base font-bold text-white font-mono leading-none">
                    {insurer.shortName}
                  </span>
                </div>
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0E1116] dark:text-[#F1F5F9] whitespace-nowrap transition-colors duration-300 font-body">
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
