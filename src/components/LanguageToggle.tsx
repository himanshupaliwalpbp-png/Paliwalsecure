'use client';

import * as React from 'react';
import { useLanguage } from '@/lib/i18n';
// Re-export useLanguage for backward compatibility with components that import from here
export { useLanguage } from '@/lib/i18n';
import { Globe, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── All 3 languages — equal weight, no hierarchy ────────────────────────────
// Hinglish (default for Indian audience 18-45), Hindi (Devanagari), English
// Each has its own flag (🇮🇳 for Indian languages, 🌐 for English as global)
const languageOptions = [
  {
    value: 'hinglish' as const,
    label: 'Hing',
    display: 'Hinglish',
    nativeName: 'हिंग्लिश',
    flag: '🇮🇳',
    description: 'Hindi + English mix (Roman script)',
    sample: 'Aapko health insurance chahiye?',
  },
  {
    value: 'hi' as const,
    label: 'हिं',
    display: 'हिंदी',
    nativeName: 'Hindi',
    flag: '🇮🇳',
    description: 'Devanagari script — pure Hindi',
    sample: 'आपको स्वास्थ्य बीमा चाहिए?',
  },
  {
    value: 'en' as const,
    label: 'EN',
    display: 'English',
    nativeName: 'English',
    flag: '🌐',
    description: 'Professional English',
    sample: 'Do you need health insurance?',
  },
];

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Escape key closes dropdown
  React.useEffect(() => {
    if (!isOpen) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const currentOption = languageOptions.find((o) => o.value === language) || languageOptions[0];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ── Trigger Button ──────────────────────────────────────────────── */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.02 }}
        className="
          relative flex items-center gap-1.5 h-9 px-3 rounded-full
          transition-all duration-300
          bg-[#FAF7F2] dark:bg-[#1A1F27]
          hover:bg-white dark:hover:bg-[#242935]
          border border-[rgba(15,19,32,0.10)] dark:border-[rgba(201,168,76,0.18)]
          text-[#0E1116] dark:text-[#FAF7F2]
          text-xs font-semibold
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8482C]/40 dark:focus-visible:ring-[#E8C872]/40
          min-w-[78px] justify-center
          shadow-sm hover:shadow-md
        "
        aria-label={`Current language: ${currentOption.display}. Click to change language.`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <Globe className="w-3.5 h-3.5 text-[#B8482C] dark:text-[#E8C872]" />
        <span>{currentOption.label}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[8px] opacity-60"
        >
          ▼
        </motion.span>
      </motion.button>

      {/* ── Dropdown ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="
              absolute right-0 top-full mt-2 z-[100]
              bg-white dark:bg-[#161A24]
              border border-[rgba(15,19,32,0.10)] dark:border-[rgba(201,168,76,0.20)]
              rounded-xl shadow-2xl shadow-black/10 dark:shadow-black/40
              overflow-hidden min-w-[280px] sm:min-w-[320px]
            "
            role="menu"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-[rgba(15,19,32,0.06)] dark:border-[rgba(201,168,76,0.12)] bg-[#FAF7F2] dark:bg-[#1A1F27]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#B8482C] dark:text-[#E8C872]">
                🌐 Choose Language / भाषा चुनें
              </p>
              <p className="text-[10px] text-[#4A4F57] dark:text-[#A8B0C2] mt-0.5">
                All 3 languages supported equally — sabhi equal hain
              </p>
            </div>

            {/* Language Options */}
            <div className="py-1">
              {languageOptions.map((option) => {
                const isActive = language === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setLanguage(option.value);
                      setIsOpen(false);
                    }}
                    role="menuitemradio"
                    aria-checked={isActive}
                    className={`
                      w-full flex items-start gap-3 px-4 py-3 text-left
                      transition-all duration-150
                      ${isActive
                        ? 'bg-[#FBE8E1] dark:bg-[rgba(184,72,44,0.10)]'
                        : 'hover:bg-[#FAF7F2] dark:hover:bg-[#1A1F27]'
                      }
                    `}
                  >
                    {/* Flag */}
                    <span className="text-2xl leading-none mt-0.5">{option.flag}</span>

                    {/* Language info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${isActive ? 'text-[#B8482C] dark:text-[#E8C872]' : 'text-[#0E1116] dark:text-[#FAF7F2]'}`}>
                          {option.display}
                        </span>
                        <span className="text-[10px] text-[#8B9099] dark:text-[#A8B0C2] uppercase tracking-wider">
                          {option.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#4A4F57] dark:text-[#A8B0C2] mt-0.5 leading-snug">
                        {option.description}
                      </p>
                      <p className="text-[11px] italic text-[#8B9099] dark:text-[#8B9099] mt-1 leading-snug">
                        &ldquo;{option.sample}&rdquo;
                      </p>
                    </div>

                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="flex-shrink-0 mt-1"
                      >
                        <div className="w-5 h-5 rounded-full bg-[#B8482C] dark:bg-[#E8C872] flex items-center justify-center">
                          <Check className="w-3 h-3 text-white dark:text-[#161A24]" strokeWidth={3} />
                        </div>
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-[rgba(15,19,32,0.06)] dark:border-[rgba(201,168,76,0.12)] bg-[#FAF7F2] dark:bg-[#1A1F27]">
              <p className="text-[10px] text-[#8B9099] dark:text-[#A8B0C2] text-center">
                InsureGPT + sabhi pages 3 bhashaon me available hain
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
