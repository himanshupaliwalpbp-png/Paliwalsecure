'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { Bot, User, Send, Sparkles } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const bubbleVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function InsureGPTTeaser() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const { t } = useLanguage();
  const [inputFocused, setInputFocused] = useState(false);

  const handleOpenInsureGPT = () => {
    window.dispatchEvent(new CustomEvent('open-insuregpt'));
  };

  return (
    <section dir="ltr" className="relative py-16 sm:py-24 lg:py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b dark:from-[#060B1E] dark:via-[#0A1330] dark:to-[#060B1E] from-sky-50 via-sky-100 to-sky-50" />
      <div className="absolute inset-0 section-glow" />

      {/* Decorative orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C98A1C]/[0.05] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#162D5A]/[0.08] rounded-full blur-3xl pointer-events-none" />

      <div ref={ref} className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-col items-center"
        >
          {/* Section heading */}
          <motion.div variants={itemVariants} className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C98A1C]/10 border border-[#C98A1C]/20 mb-4">
              <Sparkles className="w-4 h-4 text-[#C98A1C]" />
              <span className="text-xs sm:text-sm font-semibold text-[#C98A1C]">InsureGPT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold font-heading dark:text-white text-slate-900">
              {t('insureGPTTeaser.heading')} <span className="gradient-text italic">InsureGPT</span>
            </h2>
          </motion.div>

          {/* Chat preview card */}
          <motion.div
            variants={itemVariants}
            className="w-full glass-card border-[#C98A1C]/30 overflow-hidden"
          >
            {/* Chat header */}
            <div className="px-4 sm:px-5 py-3 flex items-center justify-between border-b border-[#C98A1C]/15">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C98A1C] to-[#E0A830] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-[#0A1330]" />
                </div>
                <div>
                  <span className="text-sm font-bold dark:text-white text-slate-900">InsureGPT</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[10px] dark:text-[#8A96A8] text-slate-500">{t('insureGPTTeaser.v2.onlineStatus')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat messages */}
            <div className="px-4 sm:px-5 py-5 space-y-4">
              {/* Bot greeting */}
              <motion.div
                variants={bubbleVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-start gap-2.5"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C98A1C] to-[#E0A830] flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-[#0A1330]" />
                </div>
                <div className="dark:bg-white/[0.08] bg-sky-50 dark:border-white/10 border border-sky-200/50 rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-[85%]">
                  <p className="text-sm dark:text-white/90 text-slate-700 leading-relaxed whitespace-pre-line">
                    {t('insureGPTTeaser.v2.botGreeting')}
                  </p>
                </div>
              </motion.div>

              {/* Quick pills */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="flex flex-wrap gap-2 pl-9.5 ml-0"
              >
                {[t('insureGPTTeaser.v2.pillHealth'), t('insureGPTTeaser.v2.pillMotor'), t('insureGPTTeaser.v2.pillLife')].map((pill) => (
                  <span
                    key={pill}
                    className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#C98A1C]/10 border border-[#C98A1C]/25 text-xs font-medium text-[#C98A1C] cursor-pointer hover:bg-[#C98A1C]/20 hover:border-[#C98A1C]/40 transition-all duration-200"
                  >
                    {pill}
                  </span>
                ))}
              </motion.div>

              {/* User message */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="flex items-start gap-2.5 flex-row-reverse"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#162D5A] to-[#0F1C40] flex items-center justify-center shrink-0 border border-[#C98A1C]/20">
                  <User className="w-3.5 h-3.5 text-[#C98A1C]" />
                </div>
                <div className="bg-gradient-to-br from-[#C98A1C] to-[#E0A830] rounded-2xl rounded-tr-sm px-3.5 py-2.5 max-w-[85%]">
                  <p className="text-sm text-[#0A1330] font-medium leading-relaxed">
                    {t('insureGPTTeaser.v2.userMsg')}
                  </p>
                </div>
              </motion.div>

              {/* Bot response */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="flex items-start gap-2.5"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C98A1C] to-[#E0A830] flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-[#0A1330]" />
                </div>
                <div className="dark:bg-white/[0.08] bg-sky-50 dark:border-white/10 border border-sky-200/50 rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-[85%]">
                  <p className="text-sm dark:text-white/90 text-slate-700 leading-relaxed whitespace-pre-line font-mono">
                    {t('insureGPTTeaser.v2.botResponse')}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Chat input */}
            <div className="px-4 sm:px-5 py-3 border-t border-[#C98A1C]/15">
              <div
                className={`flex items-center gap-2 dark:bg-white/[0.05] bg-sky-100/50 rounded-full px-4 py-2.5 border transition-all duration-200 ${inputFocused ? 'border-[#C98A1C]/50 shadow-[0_0_0_3px_rgba(201,138,28,0.1)]' : 'dark:border-white/10 border-sky-200/50'}`}
              >
                <span className="dark:text-white/50 text-slate-400 text-sm flex-1">{t('insureGPTTeaser.v2.placeholder')}</span>
                <button
                  onClick={handleOpenInsureGPT}
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-[#C98A1C] to-[#E0A830] flex items-center justify-center shrink-0 hover:shadow-[0_0_15px_rgba(201,138,28,0.4)] transition-shadow duration-300"
                  aria-label="Send message"
                >
                  <Send className="w-3.5 h-3.5 text-[#0A1330]" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div variants={itemVariants} className="mt-8">
            <button
              onClick={handleOpenInsureGPT}
              className="ps-btn-primary text-base sm:text-lg lg:text-xl px-8 py-4 lg:py-5 rounded-full animate-pulse-gold"
            >
              {t('insureGPTTeaser.v2.cta')}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
