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
      {/* Section Title — SAFFRON DAWN v19 eyebrow */}
      <div className="flex justify-center pt-6 sm:pt-8 pb-3 sm:pb-4">
        <h3 className="nl-eyebrow nl-eyebrow-center dark:text-[#E8C872]!">
          {sectionTitle}
        </h3>
      </div>

      {/* Marquee viewport — v19 premium marquee (edge mask + hover pause built in).
          Track gap is zeroed inline; spacing comes from each chip's trailing margin
          so the -50% translate loop is pixel-perfect seamless. */}
      <div ref={ref} className="nl-marquee pb-6 sm:pb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="nl-marquee-track"
            style={{ gap: '0rem', animationDuration: '80s' }}
          >
            {allInsurers.map((insurer, idx) => (
              <div
                key={`insurer-${idx}`}
                aria-hidden={idx >= INSURERS.length || undefined}
                className="group flex items-center gap-3 pl-2.5 sm:pl-3 pr-4 sm:pr-5 py-2 sm:py-2.5 shrink-0 mr-8 sm:mr-14 rounded-full bg-white dark:bg-white/[0.05] border border-[rgba(201,138,28,0.22)] dark:border-[rgba(201,138,28,0.18)] shadow-[0_2px_10px_-4px_rgba(94,18,35,0.15)] hover:border-[rgba(184,72,44,0.45)] dark:hover:border-[rgba(212,99,63,0.5)] hover:shadow-[0_10px_24px_-10px_rgba(184,72,44,0.35)] hover:-translate-y-0.5 transition-all duration-300 cursor-default"
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br ${insurer.color} flex items-center justify-center shrink-0 shadow-md ring-2 ring-white/30 transition-transform duration-300 group-hover:scale-110`}
                >
                  <span className="text-xs sm:text-sm font-bold text-white font-mono leading-none">
                    {insurer.shortName}
                  </span>
                </div>
                <span className="text-sm sm:text-base lg:text-lg font-bold text-[#0E1116] dark:text-[#F1F5F9] whitespace-nowrap transition-colors duration-300 font-body">
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
