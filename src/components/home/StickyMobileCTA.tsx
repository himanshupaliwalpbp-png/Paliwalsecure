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
          {/* Frosted glass bar */}
          <div className="bg-background/80 backdrop-blur-xl border-t border-border/60">
            {/* Subtle top glow line */}
            <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            <div
              className="flex items-stretch gap-2.5 p-3"
              style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
            >
              {/* Quick Adviser button — premium */}
              <button
                onClick={handleAIDvisorClick}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-primary text-primary-foreground shadow-[0_4px_20px_-4px_rgba(var(--primary),0.25)] active:scale-[0.97] transition-transform duration-150"
              >
                <Brain className="w-4 h-4" strokeWidth={2} />
                {aiAdvisorLabel}
              </button>

              {/* WhatsApp button — refined */}
              <a
                href="https://wa.me/919257877312"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-[#25D366] text-white shadow-[0_4px_20px_-4px_rgba(37,211,102,0.25)] active:scale-[0.97] transition-transform duration-150"
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
