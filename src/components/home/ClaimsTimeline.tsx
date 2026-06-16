'use client';

import React, { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { MessageSquare, ClipboardList, Send, Activity, Banknote } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

/* ── Types ─────────────────────────────────────────────────────────── */
interface ClaimStep {
  key: string;
  number: number;
  icon: React.ElementType;
  color: string;
}

const claimSteps: ClaimStep[] = [
  { key: 'tellUs', number: 1, icon: MessageSquare, color: '#B8482C' },
  { key: 'docChecklist', number: 2, icon: ClipboardList, color: '#1B4D4A' },
  { key: 'submitOnYourBehalf', number: 3, icon: Send, color: '#B8482C' },
  { key: 'trackRealTime', number: 4, icon: Activity, color: '#1B4D4A' },
  { key: 'moneyInAccount', number: 5, icon: Banknote, color: '#B8482C' },
];

/* ── Inline translations ───────────────────────────────────────────── */
const stepTitles: Record<string, { en: string; hi: string; hg: string }> = {
  tellUs: { en: 'Tell us what happened', hi: 'बताइए क्या हुआ', hg: 'Bataiye kya hua' },
  docChecklist: { en: 'Doc checklist', hi: 'दस्तावेज़ सूची', hg: 'Document List' },
  submitOnYourBehalf: { en: 'Submit on your behalf', hi: 'आपकी ओर से जमा करें', hg: 'Hum file karein' },
  trackRealTime: { en: 'Track in real time', hi: 'रीयल टाइम में ट्रैक करें', hg: 'Real-time Tracking' },
  moneyInAccount: { en: 'Money in your account', hi: 'पैसे आपके खाते में', hg: 'Paisa aapke account mein' },
};

const stepDescs: Record<string, { en: string; hi: string; hg: string }> = {
  tellUs: { en: 'Form or WhatsApp — your choice', hi: 'फॉर्म या WhatsApp — आपकी पसंद', hg: 'Form ya WhatsApp — aapki pasand' },
  docChecklist: { en: 'We send the exact list you need', hi: 'हम आपको वह सटीक सूची भेजते हैं जो आपको चाहिए', hg: 'Hum exact list bhejte hain jo aapko chahiye' },
  submitOnYourBehalf: { en: 'We file with the insurer for you', hi: 'हम आपके लिए बीमाकर्ता के पास दाखिल करते हैं', hg: 'Hum aapke liye insurer ke paas file karte hain' },
  trackRealTime: { en: 'Status updates at every step', hi: 'हर कदम पर स्टेटस अपडेट', hg: 'Har step par status updates' },
  moneyInAccount: { en: 'We follow up till closure', hi: 'हम बंद होने तक फॉलो-अप करते हैं', hg: 'Hum closure tak follow-up karte hain' },
};

/* ── Animation ─────────────────────────────────────────────────────── */
const stepVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const lineVariants: Variants = {
  hidden: { scaleY: 0, originY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/* ── Component ─────────────────────────────────────────────────────── */
export default function ClaimsTimeline() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const isEnglish = language === 'en';

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const heading = isHindi ? 'आपकी क्लेम यात्रा' : isEnglish ? 'Your claims journey' : 'Aapki claim yatra';
  const subtitle = isHindi ? 'हम फाइलिंग से भुगतान तक सब संभालते हैं' : isEnglish ? 'We handle everything from filing to payout' : 'Hum filing se payout tak sab sambhalte hain';

  const getStepTitle = (key: string) => isHindi
    ? stepTitles[key]?.hi ?? stepTitles[key]?.en
    : isEnglish
      ? stepTitles[key]?.en
      : stepTitles[key]?.hg ?? stepTitles[key]?.en;

  const getStepDesc = (key: string) => isHindi
    ? stepDescs[key]?.hi ?? stepDescs[key]?.en
    : isEnglish
      ? stepDescs[key]?.en
      : stepDescs[key]?.hg ?? stepDescs[key]?.en;

  return (
    <section ref={sectionRef} className="section-premium bg-[#FAF7F2] dark:bg-[#0E1116]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mb-16 md:mb-20 text-center"
        >
          <div className="btn-pill-dot mb-5 bg-[#F4E5DD] dark:bg-[#3A1E14] text-[#8B3520] dark:text-[#E89572]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#B8482C] dark:bg-[#D4633F]" />
            <span className="text-caption-premium text-[#8B3520] dark:text-[#E89572] font-body">{isHindi ? 'क्लेम प्रक्रिया' : isEnglish ? 'Claims Process' : 'Claims Process'}</span>
          </div>
          <h2 className="text-display-h2 font-display text-[#0E1116] dark:text-[#FAF7F2]">
            {heading}
          </h2>
          <p className="mt-4 text-lead-premium text-[#4A4F57] dark:text-[#B8BCC2] max-w-md mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Vertical Timeline */}
        <div className="relative">
          {/* Animated vertical hairline line — was thick gradient */}
          <motion.div
            variants={lineVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="absolute left-6 md:left-8 top-4 bottom-4 w-px bg-[rgba(14,17,22,0.08)] dark:bg-white/[0.08]"
          />

          {/* Steps */}
          <div className="space-y-6 md:space-y-8">
            {claimSteps.map((step, i) => {
              const Icon = step.icon;
              const isTeal = step.color === '#1B4D4A';
              return (
                <motion.div
                  key={step.key}
                  custom={i}
                  variants={stepVariants}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  className="relative flex items-start gap-5 md:gap-7"
                >
                  {/* Step number circle — positioned on the timeline, Fraunces serif number */}
                  <div className="relative z-10 shrink-0">
                    <div
                      className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white font-display text-sm md:text-base tabular-nums ring-4 ring-[#FAF7F2] dark:ring-[#0E1116] transition-transform duration-300"
                      style={{ backgroundColor: step.color, fontWeight: 500 }}
                    >
                      {step.number}
                    </div>
                  </div>

                  {/* Card content — paper surface */}
                  <div className="bg-white dark:bg-[#161A22] border border-[rgba(14,17,22,0.08)] dark:border-white/[0.08] rounded-2xl shadow-sm hover:shadow-premium flex-1 flex items-start gap-4 group p-5 md:p-6 transition-all duration-300">
                    {/* Icon — sienna tint or teal tint derived from step.color */}
                    <div
                      className={`shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                        isTeal
                          ? 'bg-[#E6EFEE] dark:bg-[#0F2A28]'
                          : 'bg-[#F4E5DD] dark:bg-[#3A1E14]'
                      }`}
                    >
                      <Icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: step.color }} strokeWidth={1.6} />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <h3 className="font-display text-[#0E1116] dark:text-[#FAF7F2] text-base md:text-lg mb-1 tracking-tight" style={{ fontWeight: 500 }}>
                        {getStepTitle(step.key)}
                      </h3>
                      <p className="text-body-premium text-[#4A4F57] dark:text-[#B8BCC2]">
                        {getStepDesc(step.key)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
