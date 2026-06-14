'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

// ── Component ──────────────────────────────────────────────────────────────────
export default function StickyMobileCTA() {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  const isHindi = language === 'hi';
  const isEnglish = language === 'en';
  const aiAdvisorLabel = isHindi ? 'क्विक एडवाइज़र' : isEnglish ? 'Quick Adviser' : 'Quick Adviser';
  const whatsAppLabel = isHindi ? 'व्हाट्सएप' : isEnglish ? 'WhatsApp' : 'WhatsApp';

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsVisible(window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAIDvisorClick = () => {
    const el = document.getElementById('advisor-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          <div className="bg-white/90 dark:bg-[#0A1330]/90 backdrop-blur-xl border-t border-[#E2E8F0] dark:border-white/10">
            <div
              className="flex items-stretch gap-2.5 p-3"
              style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
            >
              <button
                onClick={handleAIDvisorClick}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-[#0F172A] dark:bg-[#D4A853] text-white dark:text-[#060E22] shadow-premium active:scale-[0.97] transition-transform duration-150 font-body"
              >
                <Brain className="w-4 h-4" strokeWidth={2} />
                {aiAdvisorLabel}
              </button>

              <a
                href="https://wa.me/919257877312"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-[#25D366] text-white shadow-premium active:scale-[0.97] transition-transform duration-150 font-body"
              >
                <MessageCircle className="w-4 h-4" strokeWidth={2} />
                {whatsAppLabel}
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
