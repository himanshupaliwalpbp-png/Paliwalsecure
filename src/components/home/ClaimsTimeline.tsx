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
const circleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const lineDrawVariants: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: (i: number) => ({
    scaleX: 1,
    transition: { delay: i * 0.15 + 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const vLineDrawVariants: Variants = {
  hidden: { scaleY: 0, originY: 0 },
  visible: (i: number) => ({
    scaleY: 1,
    transition: { delay: i * 0.15 + 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

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
    <section className="py-28 md:py-36 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-primary/[0.02] rounded-full blur-[100px]" />
      </div>

      <div className="mx-auto max-w-5xl">
        {/* ── Header ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          className="mb-16 md:mb-20 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-widest mb-5 bg-primary/[0.07] border border-primary/[0.12] text-primary">
            Claims Process
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
            {heading}
          </h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-md mx-auto leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* ── Desktop: Horizontal Timeline ────────────────────────── */}
        <div className="hidden md:flex items-start justify-between relative">
          {/* Horizontal connecting line — gradient */}
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
            className="absolute top-10 left-[10%] right-[10%] h-px bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20"
          />

          {claimSteps.map((step, i) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.key}
                custom={i}
                variants={circleVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="flex flex-col items-center text-center flex-1 relative group"
              >
                {/* Step circle — premium glass */}
                <div className="relative z-10 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/60 flex items-center justify-center transition-all duration-500 group-hover:border-primary/25 group-hover:shadow-[0_8px_40px_-12px_rgba(var(--primary),0.12)]">
                    <Icon className="w-6 h-6 text-primary" strokeWidth={1.6} />
                  </div>
                  {/* Step number badge — refined pill */}
                  <span className="absolute -top-2 -right-2 min-w-[22px] h-[22px] rounded-full bg-primary flex items-center justify-center text-[10px] font-mono font-bold text-primary-foreground shadow-sm">
                    {step.number}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-heading font-semibold text-foreground text-sm mb-1.5 max-w-[150px] tracking-tight">
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
        <div className="md:hidden relative pl-10">
          {/* Vertical connecting line */}
          <motion.div
            initial={{ scaleY: 0, originY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
            className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/30 via-primary/20 to-primary/10"
          />

          {claimSteps.map((step, i) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.key}
                custom={i}
                variants={circleVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                className="flex items-start gap-4 mb-8 last:mb-0 relative group"
              >
                {/* Icon on the line — premium glass */}
                <div className="relative z-10 shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-card/80 backdrop-blur-sm border border-border/60 flex items-center justify-center transition-all duration-300 group-hover:border-primary/25">
                    <Icon className="w-4 h-4 text-primary" strokeWidth={1.6} />
                  </div>
                  {/* Step number badge */}
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-primary flex items-center justify-center text-[9px] font-mono font-bold text-primary-foreground shadow-sm">
                    {step.number}
                  </span>
                </div>

                {/* Text content — glass card */}
                <div className="pt-0.5 flex-1 bg-card/40 backdrop-blur-sm border border-border/40 rounded-xl p-3.5 transition-all duration-300 group-hover:border-primary/15">
                  <h3 className="font-heading font-semibold text-foreground text-sm mb-0.5 tracking-tight">
                    {getStepTitle(step.key)}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
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
