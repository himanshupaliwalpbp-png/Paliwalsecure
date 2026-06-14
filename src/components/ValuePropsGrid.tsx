'use client';

import { motion } from 'framer-motion';
import { Brain, ShieldCheck, Mic } from 'lucide-react';
import { useLanguage } from '@/components/LanguageToggle';
import { t } from '@/lib/i18n';

const cards = [
  {
    emoji: '🤖',
    icon: Brain,
    titleKey: 'valueProps.aiSujhav.title',
    descriptionKey: 'valueProps.aiSujhav.description',
    gradient: 'from-violet-500 to-fuchsia-500',
    accentGradient: 'from-violet-500 to-fuchsia-500',
  },
  {
    emoji: '🛡️',
    icon: ShieldCheck,
    titleKey: 'valueProps.irdai.title',
    descriptionKey: 'valueProps.irdai.description',
    gradient: 'from-emerald-500 to-teal-500',
    accentGradient: 'from-emerald-500 to-teal-500',
  },
  {
    emoji: '🗣️',
    icon: Mic,
    titleKey: 'valueProps.aasanBhasha.title',
    descriptionKey: 'valueProps.aasanBhasha.description',
    gradient: 'from-amber-500 to-orange-500',
    accentGradient: 'from-amber-500 to-orange-500',
  },
] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export default function ValuePropsGrid() {
  const { language } = useLanguage();

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-64px' }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.titleKey}
            variants={cardVariants}
            className="group relative rounded-2xl border border-border bg-card p-6
                       transition-all duration-300 ease-out
                       hover:shadow-lg hover:-translate-y-1"
          >
            {/* Gradient top accent bar */}
            <div
              className={`absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-gradient-to-r ${card.accentGradient}`}
            />

            {/* Icon circle */}
            <div
              className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full
                          bg-gradient-to-br ${card.gradient} text-white shadow-md`}
            >
              <Icon className="h-7 w-7" strokeWidth={1.8} />
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-foreground">
              {card.emoji} {t(card.titleKey, language)}
            </h3>

            {/* Description */}
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t(card.descriptionKey, language)}
            </p>
          </motion.div>
        );
      })}
    </motion.section>
  );
}
