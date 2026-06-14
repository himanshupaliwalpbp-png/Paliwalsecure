'use client';

import { motion } from 'framer-motion';
import {
  Shield,
  Brain,
  ShieldCheck,
  Headphones,
  Lock,
  Languages,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { Badge } from '@/components/ui/badge';
import type { LucideIcon } from 'lucide-react';

interface TrustCard {
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
  iconGradient: string;
}

const trustCards: TrustCard[] = [
  {
    icon: Shield,
    titleKey: 'whyUs.trust.irdai.title',
    descKey: 'whyUs.trust.irdai.desc',
    iconGradient: 'from-[#071B3B] to-[#2563EB]',
  },
  {
    icon: Brain,
    titleKey: 'whyUs.trust.ai.title',
    descKey: 'whyUs.trust.ai.desc',
    iconGradient: 'from-[#2563EB] to-[#071B3B]',
  },
  {
    icon: ShieldCheck,
    titleKey: 'whyUs.trust.noMisSell.title',
    descKey: 'whyUs.trust.noMisSell.desc',
    iconGradient: 'from-[#F4B400] to-[#C89E00]',
  },
  {
    icon: Headphones,
    titleKey: 'whyUs.trust.claim.title',
    descKey: 'whyUs.trust.claim.desc',
    iconGradient: 'from-[#071B3B] to-[#1E3A5F]',
  },
  {
    icon: Lock,
    titleKey: 'whyUs.trust.privacy.title',
    descKey: 'whyUs.trust.privacy.desc',
    iconGradient: 'from-[#2563EB] to-[#071B3B]',
  },
  {
    icon: Languages,
    titleKey: 'whyUs.trust.hinglish.title',
    descKey: 'whyUs.trust.hinglish.desc',
    iconGradient: 'from-[#F4B400] to-[#2563EB]',
  },
  {
    icon: MessageCircle,
    titleKey: 'whyUs.trust.whatsapp.title',
    descKey: 'whyUs.trust.whatsapp.desc',
    iconGradient: 'from-[#071B3B] to-[#F4B400]',
  },
  {
    icon: Phone,
    titleKey: 'whyUs.trust.consultation.title',
    descKey: 'whyUs.trust.consultation.desc',
    iconGradient: 'from-[#2563EB] to-[#F4B400]',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function WhyUs() {
  const { t } = useLanguage();

  return (
    <section
      dir="ltr"
      className="py-16 sm:py-24 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden"
    >
      {/* Decorative radial glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#071B3B]/[0.03] dark:bg-[#F4B400]/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#F4B400]/[0.03] dark:bg-[#071B3B]/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <Badge
            variant="outline"
            className="mb-5 px-4 py-1.5 rounded-full text-sm font-medium border-[#F4B400]/30 bg-[#F4B400]/10 text-[#C89E00] dark:border-[#F4B400]/40 dark:bg-[#F4B400]/10 dark:text-[#F4B400]"
          >
            {t('whyUs.badge')}
          </Badge>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight font-heading">
            Insurance You Can{' '}
            <span className="gradient-text">{t('whyUs.headingHighlight')}</span>
          </h2>

          <p className="mt-4 text-muted-foreground text-base sm:text-lg leading-relaxed">
            {t('whyUs.description')}
          </p>
          <p className="text-sm text-[#F4B400] mt-2 font-medium">
            {t('whyUs.hinglishDesc')}
          </p>
        </motion.div>

        {/* Trust Signal Cards — 2 cols on mobile, 4 cols on desktop */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {trustCards.map((card) => {
            const IconComp = card.icon;
            return (
              <motion.div
                key={card.titleKey}
                variants={cardVariants}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="group relative bg-white/80 dark:bg-[#071B3B]/70 backdrop-blur-xl border border-white/20 dark:border-[#F4B400]/15 rounded-2xl p-4 sm:p-6 flex flex-col items-center text-center hover:border-[#F4B400]/50 dark:hover:border-[#F4B400]/50 hover:shadow-[0_0_20px_rgba(244,180,0,0.12)] transition-shadow duration-300"
              >
                {/* Icon circle */}
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${card.iconGradient} flex items-center justify-center mb-4 shadow-lg shrink-0`}
                >
                  <IconComp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-base font-bold text-[#071B3B] dark:text-[#F4B400] font-heading mb-1.5 leading-snug">
                  {t(card.titleKey)}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {t(card.descKey)}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
