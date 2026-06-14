'use client';

import React, { createContext, useContext, useEffect, useCallback, useSyncExternalStore } from 'react';
import { translations, type Language } from '@/lib/i18n-strings';

// ── Re-export types and data ────────────────────────────────────────────────
export type { Language } from '@/lib/i18n-strings';
export { translations } from '@/lib/i18n-strings';

// ── Standalone t() function for non-hook usage ──────────────────────────────
export function t(key: string, lang: Language): string {
  const entry = translations[key];
  if (!entry) {
    return key;
  }
  return entry[lang] || entry.en || key;
}

// ── React Context for language state ────────────────────────────────────────
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'paliwal-language';
const DEFAULT_LANGUAGE: Language = 'hinglish';

function getStoredLanguage(): Language {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'hi' || stored === 'hinglish') {
      return stored;
    }
  } catch {
    // localStorage not available
  }
  return DEFAULT_LANGUAGE;
}

function storeLanguage(lang: Language): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // localStorage not available
  }
}

// ── External store for language ──────────────────────────────────────────────
let languageListeners: (() => void)[] = [];

// IMPORTANT: Initialize from localStorage IMMEDIATELY at module load time
// This ensures the first client snapshot matches the stored preference,
// preventing the flash from Hinglish (server default) to English (stored).
let currentLanguage: Language = DEFAULT_LANGUAGE;
let isClientInitialized = false;

// Immediately try to read localStorage on the client
if (typeof window !== 'undefined') {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'hi' || stored === 'hinglish') {
      currentLanguage = stored;
    }
    isClientInitialized = true;
  } catch {
    // localStorage not available
  }
}

function subscribeLanguage(listener: () => void) {
  languageListeners.push(listener);
  return () => {
    languageListeners = languageListeners.filter((l) => l !== listener);
  };
}

function getLanguageSnapshot(): Language {
  return currentLanguage;
}

function getLanguageServerSnapshot(): Language {
  return DEFAULT_LANGUAGE;
}

function setLanguageAndNotify(lang: Language): void {
  currentLanguage = lang;
  storeLanguage(lang);
  languageListeners.forEach((l) => l());
}

/**
 * LanguageProvider using useSyncExternalStore for reliable SSR hydration.
 *
 * - SSR: renders with DEFAULT_LANGUAGE (hinglish)
 * - Client: reads localStorage at module load time
 * - Language changes: updates external store + localStorage + DOM attributes
 *
 * The flash issue is resolved because currentLanguage is initialized from
 * localStorage BEFORE React hydration, so the first client snapshot
 * matches the stored preference.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(
    subscribeLanguage,
    getLanguageSnapshot,
    getLanguageServerSnapshot
  );

  // Apply Hindi CSS class and lang attribute when language changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (language === 'hi') {
      document.body.classList.add('hindi-active');
      document.documentElement.lang = 'hi';
    } else {
      document.body.classList.remove('hindi-active');
      document.documentElement.lang = language === 'hinglish' ? 'hi' : 'en';
    }
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageAndNotify(lang);
  }, []);

  const tHook = useCallback((key: string): string => {
    const entry = translations[key];
    if (!entry) {
      return key;
    }
    return entry[language] || entry.hinglish || entry.en || key;
  }, [language]);

  const value = { language, setLanguage, t: tHook };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
