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
  const aiAdvisorLabel = isHindi ? 'Quick Adviser' : 'Quick Adviser';
  const whatsAppLabel = isHindi ? 'WhatsApp' : 'WhatsApp';

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
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-md border-t border-border"
        >
          <div
            className="flex items-stretch gap-2 p-3"
            style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
          >
            {/* Quick Adviser button */}
            <button
              onClick={handleAIDvisorClick}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-medium text-sm bg-primary text-primary-foreground"
            >
              <Brain className="w-4 h-4" />
              {aiAdvisorLabel}
            </button>

            {/* WhatsApp button */}
            <a
              href="https://wa.me/919257877312"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-medium text-sm bg-[#25D366] text-white"
            >
              <MessageCircle className="w-4 h-4" />
              {whatsAppLabel}
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
