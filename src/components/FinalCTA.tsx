'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { Phone, Shield, MessageCircle, ArrowRight } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function FinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const { t } = useLanguage();
  const [phoneNumber, setPhoneNumber] = useState('');

  const whatsappMessage = encodeURIComponent(
    'Hi Paliwal Secure! I need help finding the best insurance plan for my family. Please guide me.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length >= 10) {
      window.open(`https://wa.me/919257877312?text=${encodeURIComponent(`Hi! Please call me back at +91 ${phoneNumber}`)}`, '_blank');
    }
  };

  return (
    <section dir="ltr" className="relative py-16 sm:py-24 lg:py-20 overflow-hidden">
      {/* Background with section glow */}
      <div className="absolute inset-0 bg-gradient-to-b dark:from-[#060B1E] dark:via-[#0A1330] dark:to-[#060B1E] from-sky-50 via-white to-sky-50" />
      <div className="absolute inset-0 section-glow" />

      {/* Gold accent line top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#060B1E] via-[#C98A1C] to-[#060B1E]" />

      {/* Animated gold orbs */}
      <motion.div
        className="absolute top-10 left-10 w-72 h-72 bg-[#C98A1C]/[0.08] rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-96 h-96 bg-[#C98A1C]/[0.05] rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.12, 1], opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <div ref={ref} className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center"
        >
          {/* Heading */}
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight leading-tight mb-4 font-heading dark:text-white text-slate-900"
          >
            {t('finalCTA.v2.heading').split(' ').map((word, i, arr) =>
              i === arr.length - 1 ? (
                <span key={i} className="gradient-text italic"> {word}</span>
              ) : (
                <span key={i}>{i > 0 ? ' ' : ''}{word}</span>
              )
            )}
          </motion.h2>

          {/* Subtitle */}
          <motion.p variants={itemVariants} className="text-base sm:text-lg lg:text-xl dark:text-white/60 text-slate-600 max-w-xl mx-auto mb-10 leading-relaxed">
            {t('finalCTA.v2.subtitle')}
          </motion.p>

          {/* Phone input + CTA */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-6"
          >
            {/* Phone input with +91 prefix */}
            <div className="flex-1 flex items-center dark:bg-white/[0.06] bg-sky-100/50 border border-[#C98A1C]/22 rounded-xl overflow-hidden backdrop-blur-sm focus-within:border-[#C98A1C]/50 focus-within:shadow-[0_0_0_3px_rgba(201,138,28,0.1)] transition-all duration-200">
              <span className="pl-4 pr-2 dark:text-white/50 text-slate-500 text-sm font-mono font-medium">+91</span>
              <div className="w-px h-6 bg-white/10" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder={t('finalCTA.v2.phonePlaceholder')}
                className="flex-1 bg-transparent px-3 py-3.5 dark:text-white text-slate-900 text-sm outline-none dark:placeholder:text-white/30 placeholder:text-slate-400"
                maxLength={10}
              />
            </div>

            {/* Call back button */}
            <button
              type="submit"
              className="ps-btn-primary py-3.5 px-6 rounded-xl text-sm sm:text-base whitespace-nowrap flex items-center justify-center gap-2 min-h-[48px]"
            >
              <Phone className="w-4 h-4" />
              {t('finalCTA.v2.callBack')}
            </button>
          </motion.form>

          {/* WhatsApp link */}
          <motion.div variants={itemVariants} className="mb-10">
            <a
              href={`https://wa.me/919257877312?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#C98A1C] dark:text-[#C98A1C]/80 hover:text-[#C98A1C] transition-colors duration-200 text-sm sm:text-base font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              {t('finalCTA.v2.orChat')}
              <span className="font-mono">{t('finalCTA.v2.whatsappNumber')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full dark:bg-white/[0.05] bg-sky-50 border border-[#C98A1C]/15">
              <Shield className="w-4 h-4 text-[#C98A1C]" />
              <span className="text-xs sm:text-sm font-medium dark:text-white/70 text-slate-600">{t('finalCTA.v2.trustBadge1')}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full dark:bg-white/[0.05] bg-sky-50 border border-[#C98A1C]/15">
              <Phone className="w-4 h-4 text-[#C98A1C]" />
              <span className="text-xs sm:text-sm font-medium dark:text-white/70 text-slate-600">{t('finalCTA.v2.trustBadge2')}</span>
            </div>
          </motion.div>

          {/* Disclaimer */}
          <motion.div variants={itemVariants} className="mt-8 pt-6 dark:border-white/[0.06] border-sky-200/50 border-t">
            <p className="text-xs dark:text-white/55 text-slate-400 max-w-md mx-auto leading-relaxed">
              {t('finalCTA.disclaimer')}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
