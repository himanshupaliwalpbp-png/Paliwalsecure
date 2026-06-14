'use client';

import * as React from 'react';
import { useLanguage } from '@/lib/i18n';
// Re-export useLanguage for backward compatibility with components that import from here
export { useLanguage } from '@/lib/i18n';
import { Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const languageOptions = [
  { value: 'hinglish' as const, label: 'Hing', display: 'Hinglish', flag: '🇮🇳' },
  { value: 'hi' as const, label: 'हिं', display: 'हिंदी', flag: '🇮🇳' },
  { value: 'en' as const, label: 'EN', display: 'English', flag: '🇬🇧' },
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

  const currentOption = languageOptions.find((o) => o.value === language) || languageOptions[2];

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.92 }}
        className="
          relative flex items-center gap-1.5 h-9 px-3 rounded-full
          transition-all duration-300
          bg-amber-50 dark:bg-[#F4B400]/10
          hover:bg-amber-100 dark:hover:bg-[#F4B400]/20
          border border-amber-200 dark:border-[#F4B400]/30
          text-amber-800 dark:text-amber-300
          text-xs font-semibold
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B400]/50
          min-w-[70px] justify-center
          shadow-sm
        "
        aria-label={`Current language: ${currentOption.display}. Click to change.`}
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5" />
        <span>{currentOption.label}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -4 }}
            transition={{ duration: 0.15 }}
            className="
              absolute right-0 top-full mt-1.5 z-50
              bg-white dark:bg-[#0F1929]
              border border-amber-200 dark:border-[#F4B400]/25
              rounded-xl shadow-lg shadow-black/10 dark:shadow-black/30
              overflow-hidden min-w-[160px]
            "
          >
            {languageOptions.map((option) => {
              const isActive = language === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    setLanguage(option.value);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium
                    transition-colors duration-150
                    ${isActive
                      ? 'bg-amber-50 dark:bg-[#F4B400]/15 text-amber-800 dark:text-amber-300'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-amber-50/50 dark:hover:bg-[#F4B400]/8'
                    }
                  `}
                >
                  <span className="text-base leading-none">{option.flag}</span>
                  <span className="font-semibold">{option.display}</span>
                  {isActive && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-[#F4B400]" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
