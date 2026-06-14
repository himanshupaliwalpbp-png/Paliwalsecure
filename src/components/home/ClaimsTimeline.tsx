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
  color: string;
}

const claimSteps: ClaimStep[] = [
  { key: 'tellUs', number: 1, icon: MessageSquare, color: '#2563EB' },
  { key: 'docChecklist', number: 2, icon: ClipboardList, color: '#10B981' },
  { key: 'submitOnYourBehalf', number: 3, icon: Send, color: '#E8C872' },
  { key: 'trackRealTime', number: 4, icon: Activity, color: '#8B5CF6' },
  { key: 'moneyInAccount', number: 5, icon: Banknote, color: '#EF4444' },
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
    <section className="py-24 bg-[#F8FAFC] dark:bg-[#060E22]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          className="mb-16 md:mb-20 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 rounded-full border border-[#E2E8F0] dark:border-white/10 mb-5 shadow-premium">
            <span className="text-sm font-medium text-[#0F172A] dark:text-[#F8F6F0] font-body">Claims Process</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8F6F0] leading-[1.1] font-display">
            {heading}
          </h2>
          <p className="mt-4 text-[#64748B] dark:text-[#A6AEC7] text-base md:text-lg max-w-md mx-auto leading-relaxed font-body">
            {subtitle}
          </p>
        </motion.div>

        {/* Desktop: Horizontal Timeline */}
        <div className="hidden md:flex items-start justify-between relative">
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
            className="absolute top-10 left-[10%] right-[10%] h-px bg-gradient-to-r from-[#2563EB]/20 via-[#10B981]/30 to-[#E8C872]/20"
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
                <div className="relative z-10 mb-6">
                  <div
                    className="w-20 h-20 rounded-2xl bg-white dark:bg-card/80 border border-[#E2E8F0] dark:border-white/10 flex items-center justify-center transition-all duration-500 group-hover:shadow-premium-lg"
                    style={{ boxShadow: `0 4px 20px -4px ${step.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: step.color }} strokeWidth={1.6} />
                  </div>
                  <span
                    className="absolute -top-2 -right-2 min-w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.number}
                  </span>
                </div>
                <h3 className="font-semibold text-[#0F172A] dark:text-[#F8F6F0] text-sm mb-1.5 max-w-[150px] tracking-tight font-display">
                  {getStepTitle(step.key)}
                </h3>
                <p className="text-xs text-[#64748B] dark:text-[#A6AEC7] leading-relaxed max-w-[62ch] font-body">
                  {getStepDesc(step.key)}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile: Vertical Timeline */}
        <div className="md:hidden relative pl-10">
          <motion.div
            initial={{ scaleY: 0, originY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
            className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-[#2563EB]/30 via-[#10B981]/20 to-[#E8C872]/10"
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
                <div className="relative z-10 shrink-0">
                  <div
                    className="w-10 h-10 rounded-xl bg-white dark:bg-card/80 border border-[#E2E8F0] dark:border-white/10 flex items-center justify-center"
                    style={{ boxShadow: `0 2px 12px -4px ${step.color}15` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: step.color }} strokeWidth={1.6} />
                  </div>
                  <span
                    className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-sm"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.number}
                  </span>
                </div>
                <div className="pt-0.5 flex-1 bg-white dark:bg-card/40 border border-[#E2E8F0] dark:border-white/10 rounded-xl p-3.5">
                  <h3 className="font-semibold text-[#0F172A] dark:text-[#F8F6F0] text-sm mb-0.5 tracking-tight font-display">
                    {getStepTitle(step.key)}
                  </h3>
                  <p className="text-xs text-[#64748B] dark:text-[#A6AEC7] leading-relaxed font-body">
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
