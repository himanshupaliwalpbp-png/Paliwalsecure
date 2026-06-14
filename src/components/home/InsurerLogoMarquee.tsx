'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/lib/i18n';

// ── Insurer data ───────────────────────────────────────────────────────────────
interface InsurerItem {
  name: string;
  shortName: string;
  color: string; // gradient from/to colors
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

  // Duplicate for seamless loop
  const allInsurers = [...INSURERS, ...INSURERS];

  return (
    <section
      dir="ltr"
      className="relative w-full py-8 sm:py-10 overflow-hidden border-y border-border/40"
      aria-label={ariaLabel}
    >
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div ref={ref} className="relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="group flex"
          style={{ width: 'max-content' }}
        >
          {/* Marquee track — pauses on hover via CSS */}
          <div
            className="flex animate-marquee-left group-hover:[animation-play-state:paused]"
            style={{ animationDuration: '45s' }}
          >
            {allInsurers.map((insurer, idx) => (
              <div
                key={`insurer-${idx}`}
                className="flex items-center gap-2.5 px-4 sm:px-5 py-2.5 shrink-0 mx-1.5 sm:mx-2 rounded-xl bg-card/60 backdrop-blur-sm border border-border/40 transition-all duration-300 hover:bg-card hover:border-border/70 grayscale hover:grayscale-0 cursor-default"
              >
                {/* Logo circle */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br ${insurer.color} flex items-center justify-center shrink-0 shadow-sm ring-1 ring-white/10`}
                >
                  <span className="text-[9px] sm:text-[10px] font-bold text-white font-mono leading-none">
                    {insurer.shortName}
                  </span>
                </div>
                {/* Name */}
                <span className="text-xs sm:text-sm font-medium text-foreground/70 group-hover/item:text-foreground whitespace-nowrap transition-colors duration-300">
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
