'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/lib/i18n';
import { useThemeAware } from '@/lib/use-theme-aware';

interface InsurerData {
  name: string;
  initials: string;
  color: string;
  price: string;
}

const insurers: InsurerData[] = [
  { name: 'LIC', initials: 'LI', color: 'from-[#162D5A] to-[#2A4070]', price: '₹499' },
  { name: 'HDFC ERGO', initials: 'HE', color: 'from-[#0F1C40] to-[#162D5A]', price: '₹549' },
  { name: 'Bajaj Allianz', initials: 'BA', color: 'from-[#0A1330] to-[#162D5A]', price: '₹399' },
  { name: 'Star Health', initials: 'SH', color: 'from-[#C98A1C] to-[#E0A830]', price: '₹499' },
  { name: 'TATA AIG', initials: 'TA', color: 'from-[#162D5A] to-[#1E3870]', price: '₹449' },
  { name: 'ICICI Lombard', initials: 'IL', color: 'from-[#F59E0B] to-[#D97706]', price: '₹529' },
  { name: 'New India Assurance', initials: 'NI', color: 'from-[#0F1C40] to-[#162D5A]', price: '₹479' },
  { name: 'SBI General', initials: 'SB', color: 'from-[#22C55E] to-[#16A34A]', price: '₹399' },
];

export default function InsurerTicker() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });
  const { t } = useLanguage();
  const { isDark } = useThemeAware();

  // Double the array for infinite scroll effect
  const tickerItems = [...insurers, ...insurers];

  return (
    <section dir="ltr" className="relative w-full py-6 overflow-hidden">
      {/* Gold border top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C98A1C]/40 to-transparent" />
      {/* Gold border bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C98A1C]/40 to-transparent" />

      {/* Dark background */}
      <div className={`absolute inset-0 ${isDark ? 'bg-[#060B1E]' : 'bg-[#F5F4F0]'}`} />

      <div ref={ref} className="relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="flex animate-ticker"
          style={{ width: 'max-content' }}
        >
          {tickerItems.map((insurer, index) => (
            <div
              key={`${insurer.name}-${index}`}
              className="flex items-center gap-3 px-6 sm:px-8 py-2 shrink-0"
            >
              {/* Logo placeholder — initials in colored circle */}
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br ${insurer.color} flex items-center justify-center shrink-0 shadow-md`}
              >
                <span className="text-xs sm:text-sm font-bold text-white font-mono">
                  {insurer.initials}
                </span>
              </div>

              {/* Name and price */}
              <div className="flex flex-col gap-0.5">
                <span className={`text-xs sm:text-sm lg:text-base font-semibold whitespace-nowrap ${isDark ? 'text-white' : 'text-[#0A1330]'}`}>
                  {insurer.name}
                </span>
                <span className={`text-[10px] sm:text-xs lg:text-sm whitespace-nowrap font-mono ${isDark ? 'text-[#8A96A8]' : 'text-[#6B7280]'}`}>
                  {t('insurerTicker.v2.from')} {insurer.price}{t('insurerTicker.v2.perMonth')}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
