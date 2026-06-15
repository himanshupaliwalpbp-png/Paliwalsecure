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
          <div className="glass-premium border-t border-slate-200/60 dark:border-white/8">
            <div
              className="flex items-stretch gap-2.5 p-3"
              style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
            >
              <button
                onClick={handleAIDvisorClick}
                className="btn-luxury-primary btn-luxury-sm flex-1 flex items-center justify-center gap-2 py-3 rounded-xl"
              >
                <Brain className="w-4 h-4" strokeWidth={2} />
                {aiAdvisorLabel}
              </button>

              <a
                href="https://wa.me/919257877312"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 active:scale-[0.97] transition-all duration-150 font-body"
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
