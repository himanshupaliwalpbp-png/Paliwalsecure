'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { MessageSquare, ClipboardList, Send, Activity, Banknote } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

/* ── Types ─────────────────────────────────────────────────────────── */
interface ClaimStep {
  key: string;
  number: number;
  icon: React.ElementType;
}

const claimSteps: ClaimStep[] = [
  { key: 'tellUs', number: 1, icon: MessageSquare },
  { key: 'docChecklist', number: 2, icon: ClipboardList },
  { key: 'submitOnYourBehalf', number: 3, icon: Send },
  { key: 'trackRealTime', number: 4, icon: Activity },
  { key: 'moneyInAccount', number: 5, icon: Banknote },
];

/* ── Inline translations ───────────────────────────────────────────── */
const stepTitles: Record<string, { en: string; hi: string; hg: string }> = {
  tellUs: { en: 'Tell us what happened', hi: 'बताइए क्या हुआ', hg: 'Bataiye kya hua' },
  docChecklist: { en: 'Doc checklist', hi: 'दस्तावेज़ सूची', hg: 'Document list' },
  submitOnYourBehalf: { en: 'Submit on your behalf', hi: 'आपकी ओर से जमा करें', hg: 'Hum file karein' },
  trackRealTime: { en: 'Track in real time', hi: 'रीयल टाइम में ट्रैक करें', hg: 'Real-time tracking' },
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
function getStepVariants(i: number): Variants {
  return {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.14, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
  };
}

/* ── Component ─────────────────────────────────────────────────────── */
export default function ClaimsTimeline() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const isEnglish = language === 'en';

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
    <section className="py-24 md:py-32 px-4">
      <div className="mx-auto max-w-5xl">
        {/* ── Header ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          className="mb-14 text-center"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {heading}
          </h2>
          <p className="mt-3 text-muted-foreground text-base md:text-lg max-w-lg mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* ── Desktop: Horizontal Timeline ────────────────────────── */}
        <div className="hidden md:flex items-start justify-between relative">
          {/* Horizontal connecting line */}
          <div className="absolute top-8 left-[8%] right-[8%] h-px bg-border" />

          {claimSteps.map((step, i) => {
            const Icon = step.icon;
            const isLast = i === claimSteps.length - 1;

            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.14, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
                className="flex flex-col items-center text-center flex-1 relative"
              >
                {/* Step circle on the line */}
                <div className="relative z-10 mb-5">
                  <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" strokeWidth={1.8} />
                  </div>
                  {/* Step number badge */}
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[11px] font-mono font-bold text-primary-foreground">
                    {step.number}
                  </span>
                </div>

                {/* Accent dot on line between steps */}
                {!isLast && (
                  <div className="absolute top-[30px] right-0 translate-x-1/2 w-2 h-2 rounded-full bg-primary z-20" />
                )}

                {/* Title */}
                <h3 className="font-heading font-semibold text-foreground text-sm mb-1 max-w-[140px]">
                  {getStepTitle(step.key)}
                </h3>

                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed max-w-[62ch]">
                  {getStepDesc(step.key)}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* ── Mobile: Vertical Timeline ───────────────────────────── */}
        <div className="md:hidden relative pl-8">
          {/* Vertical connecting line */}
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />

          {claimSteps.map((step, i) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.14, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
                className="flex items-start gap-4 mb-7 last:mb-0 relative"
              >
                {/* Dot + icon on the line */}
                <div className="relative z-10 shrink-0">
                  <div className="w-11 h-11 rounded-full bg-card border border-border flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" strokeWidth={1.8} />
                  </div>
                  {/* Step number badge */}
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-mono font-bold text-primary-foreground">
                    {step.number}
                  </span>
                </div>

                {/* Text content */}
                <div className="pt-1">
                  <h3 className="font-heading font-semibold text-foreground text-sm mb-1">
                    {getStepTitle(step.key)}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-[62ch]">
                    {getStepDesc(step.key)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
