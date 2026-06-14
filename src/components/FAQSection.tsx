'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Bot, ArrowRight, ChevronDown, HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n';

/* ──────────────────────────────────────────────
   FAQ Item keys — mapped to i18n
   ────────────────────────────────────────────── */
const faqKeys = [
  { id: 'faq-1', qKey: 'faq.q1', aKey: 'faq.a1' },
  { id: 'faq-2', qKey: 'faq.q2', aKey: 'faq.a2' },
  { id: 'faq-3', qKey: 'faq.q3', aKey: 'faq.a3' },
  { id: 'faq-4', qKey: 'faq.q4', aKey: 'faq.a4' },
  { id: 'faq-5', qKey: 'faq.q5', aKey: 'faq.a5' },
  { id: 'faq-6', qKey: 'faq.q6', aKey: 'faq.a6' },
  { id: 'faq-7', qKey: 'faq.q7', aKey: 'faq.a7' },
  { id: 'faq-8', qKey: 'faq.q8', aKey: 'faq.a8' },
];

/* ──────────────────────────────────────────────
   Animation variants
   ────────────────────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ──────────────────────────────────────────────
   Main FAQSection Component
   ────────────────────────────────────────────── */
export default function FAQSection() {
  const { t } = useLanguage();

  const handleInsureGPT = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-insuregpt'));
    }
  }, []);

  return (
    <section
      dir="ltr"
      className="relative py-20 sm:py-24 lg:py-28 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 50%, #F8FAFC 100%)',
      }}
    >
      {/* Dark mode background */}
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background: 'linear-gradient(180deg, #081221 0%, #0C1F3A 50%, #081221 100%)',
        }}
        aria-hidden="true"
      />
      {/* Light mode background overlay */}
      <div className="absolute inset-0 dark:hidden" aria-hidden="true" />

      {/* Decorative radial glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] opacity-[0.06] dark:opacity-[0.08]"
          style={{
            background: 'radial-gradient(ellipse at center, #F4B400 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-80 h-80 opacity-[0.04] dark:opacity-[0.06]"
          style={{
            background: 'radial-gradient(ellipse at center, #2563EB 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Badge */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Badge
            variant="outline"
            className="inline-flex items-center gap-2 bg-white/70 dark:bg-[#071B3B]/60 backdrop-blur-sm border border-[#F4B400]/20 dark:border-[#F4B400]/30 text-[#071B3B] dark:text-[#F4B400] px-4 py-1.5 text-sm font-medium rounded-full shadow-sm"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            {t('faqSection.badge')}
          </Badge>
        </motion.div>

        {/* Heading */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2
            className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight text-[#071B3B] dark:text-white"
            style={{ fontFamily: 'Sora, system-ui, sans-serif' }}
          >
            {t('faqSection.heading')}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#071B3B]/60 dark:text-white/50 font-medium max-w-xl mx-auto">
            {t('faqSection.subheading')}
          </p>
        </motion.div>

        {/* FAQ Accordion with glassmorphic cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
            {faqKeys.map((faq, index) => (
              <motion.div key={faq.id} variants={itemVariants}>
                <AccordionItem
                  value={faq.id}
                  className="group/card border-0 rounded-2xl overflow-hidden transition-all duration-300 bg-white/70 dark:bg-[#071B3B]/60 backdrop-blur-xl border border-white/40 dark:border-[#F4B400]/15 shadow-lg shadow-black/[0.03] dark:shadow-black/20 data-[state=open]:border-[#F4B400]/40 dark:data-[state=open]:border-[#F4B400]/40 data-[state=open]:shadow-[0_0_24px_rgba(244,180,0,0.08)] dark:data-[state=open]:shadow-[0_0_24px_rgba(244,180,0,0.12)]"
                >
                  <AccordionTrigger
                    className="py-5 px-5 sm:px-6 hover:no-underline hover:bg-white/30 dark:hover:bg-white/[0.03] transition-colors duration-200 [&[data-state=open]]:text-[#071B3B] dark:[&[data-state=open]]:text-[#F4B400]"
                  >
                    <div className="flex items-start gap-3 text-left flex-1">
                      <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-[#071B3B]/[0.06] dark:bg-[#F4B400]/10 flex items-center justify-center text-xs font-bold text-[#071B3B] dark:text-[#F4B400] mt-0.5 group-data-[state=open]/card:bg-[#F4B400] group-data-[state=open]/card:text-white transition-colors duration-300">
                        {index + 1}
                      </span>
                      <span className="block text-sm sm:text-base font-semibold leading-snug pt-0.5">
                        {t(faq.qKey)}
                      </span>
                    </div>
                    <ChevronDown className="flex-shrink-0 ml-2 w-5 h-5 text-[#071B3B]/40 dark:text-white/30 group-data-[state=open]/card:text-[#F4B400] transition-colors duration-300" />
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 sm:pb-6 px-5 sm:px-6">
                    <div className="pl-11 sm:pl-12 space-y-3">
                      {/* Gold accent line */}
                      <div
                        className="w-12 h-0.5 rounded-full"
                        style={{
                          background: 'linear-gradient(90deg, #F4B400, #C89E00)',
                        }}
                      />
                      <p className="text-sm sm:text-base text-[#071B3B]/80 dark:text-white/70 leading-relaxed">
                        {t(faq.aKey)}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-14 sm:mt-16 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="text-base sm:text-lg text-[#071B3B]/60 dark:text-white/50 mb-6 font-medium">
            {t('faqSection.stillQuestions')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* InsureGPT Button */}
            <button
              onClick={handleInsureGPT}
              className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-[#071B3B] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1E3A5F] text-white font-semibold py-3 px-7 rounded-full transition-all duration-300 shadow-lg shadow-[#071B3B]/15 hover:shadow-[#071B3B]/25 hover:scale-[1.03] active:scale-[0.98]"
            >
              <Bot className="w-5 h-5" aria-hidden="true" />
              {t('faqSection.chatWithInsureGPT')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </button>

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/919257877312"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#075E54] text-white font-semibold py-3 px-7 rounded-full transition-all duration-300 shadow-lg shadow-[#25D366]/15 hover:shadow-[#25D366]/25 hover:scale-[1.03] active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5" aria-hidden="true" />
              {t('faqSection.whatsappUs')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
