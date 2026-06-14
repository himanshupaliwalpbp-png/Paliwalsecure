'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { MessagesSquare, Cpu, UserCheck } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

/* ── Types ─────────────────────────────────────────────────────────── */
interface Step {
  key: string;
  number: number;
  icon: React.ElementType;
}

const steps: Step[] = [
  { key: 'tellUs', number: 1, icon: MessagesSquare },
  { key: 'aiScans', number: 2, icon: Cpu },
  { key: 'advisorConfirms', number: 3, icon: UserCheck },
];

/* ── Inline translations ───────────────────────────────────────────── */
const stepTitles: Record<string, { en: string; hi: string; hg: string }> = {
  tellUs: { en: 'Tell us your needs', hi: 'अपनी ज़रूरत बताएं', hg: 'Apni zaroorat batayein' },
  aiScans: { en: 'AI scans 51+ insurers', hi: 'AI 51+ बीमाकर्ताओं को स्कैन करता है', hg: 'AI 51+ insurers scan kare' },
  advisorConfirms: { en: 'Advisor confirms', hi: 'सलाहकार पुष्टि करता है', hg: 'Advisor tasdeeq kare' },
};

const stepDescs: Record<string, { en: string; hi: string; hg: string }> = {
  tellUs: { en: 'Answer 4 simple questions about your family, budget, and priorities', hi: 'अपने परिवार, बजट और प्राथमिकताओं के बारे में 4 आसान सवालों के जवाब दें', hg: 'Apni family, budget aur priorities ke baare mein 4 aasan sawaalon ke jawaab dein' },
  aiScans: { en: 'Our AI compares hundreds of plans to find the best match for you', hi: 'हमारा AI सैकड़ों प्लानों की तुलना करके आपके लिए सर्वोत्तम मिलान ढूंढता है', hg: 'Humara AI hundreds of plans compare karta hai aapke liye best match dhundhne ke liye' },
  advisorConfirms: { en: 'A licensed human advisor reviews and confirms your recommendation', hi: 'एक लाइसेंस प्राप्त मानव सलाहकार आपकी सिफारिश की समीक्षा और पुष्टि करता है', hg: 'Ek licensed human advisor aapki recommendation review aur confirm karta hai' },
};

/* ── Animation ─────────────────────────────────────────────────────── */
const stepVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.18, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

/* ── Component ─────────────────────────────────────────────────────── */
export default function HowAIWorks() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const isEnglish = language === 'en';

  const heading = isHindi ? 'Quick Adviser कैसे काम करता है' : isEnglish ? 'How the Quick Adviser works' : 'Quick Adviser kaise kaam karta hai';
  const subtitle = isHindi ? 'आपके आदर्श प्लान के लिए 3 आसान कदम' : isEnglish ? '3 simple steps to your perfect plan' : 'Aapke perfect plan ke liye 3 aasan steps';

  return (
    <section className="py-24 px-4">
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

        {/* ── Steps ───────────────────────────────────────────────── */}
        {/* Desktop: horizontal, Mobile: vertical */}
        <div className="flex flex-col md:flex-row items-stretch md:items-start gap-6 md:gap-0 relative">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isLast = i === steps.length - 1;

            const stepTitle = isHindi
              ? stepTitles[step.key]?.hi ?? stepTitles[step.key]?.en
              : isEnglish
                ? stepTitles[step.key]?.en
                : stepTitles[step.key]?.hg ?? stepTitles[step.key]?.en;

            const stepDesc = isHindi
              ? stepDescs[step.key]?.hi ?? stepDescs[step.key]?.en
              : isEnglish
                ? stepDescs[step.key]?.en
                : stepDescs[step.key]?.hg ?? stepDescs[step.key]?.en;

            return (
              <React.Fragment key={step.key}>
                {/* Step card */}
                <motion.div
                  custom={i}
                  variants={stepVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                  className="flex-1 flex flex-col items-center text-center relative z-10"
                >
                  {/* Numbered circle — clean primary */}
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-mono text-sm mb-5">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-primary" strokeWidth={1.8} />
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-semibold text-foreground text-base mb-2">
                    {stepTitle}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-[62ch]">
                    {stepDesc}
                  </p>
                </motion.div>

                {/* Connecting hairline */}
                {!isLast && (
                  <>
                    {/* Desktop: horizontal hairline */}
                    <div className="hidden md:flex flex-1 items-center relative top-5">
                      <div className="w-full border-t border-border" />
                    </div>

                    {/* Mobile: vertical hairline */}
                    <div className="flex md:hidden items-center justify-center h-8">
                      <div className="h-full border-l border-border" />
                    </div>
                  </>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
