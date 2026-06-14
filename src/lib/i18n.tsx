'use client';

import React, { createContext, useContext, useEffect, useCallback, useState, useSyncExternalStore } from 'react';
import { translations, type Language } from '@/lib/i18n-strings';

// ── Re-export types and data ────────────────────────────────────────────────
export type { Language } from '@/lib/i18n-strings';
export { translations } from '@/lib/i18n-strings';

// ── Standalone t() function for non-hook usage ──────────────────────────────
/**
 * Look up a translation key in the given language.
 * Falls back to English if the key or language is missing.
 * Falls back to the key itself if not found at all.
 */
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

// ── External store for language (avoids setState-in-effect lint error) ──────
let languageListeners: (() => void)[] = [];
let currentLanguage: Language = DEFAULT_LANGUAGE;
let isInitialized = false;

function initLanguage(): void {
  if (isInitialized) return;
  isInitialized = true;
  const stored = getStoredLanguage();
  if (stored !== DEFAULT_LANGUAGE) {
    currentLanguage = stored;
  }
}

function subscribeLanguage(listener: () => void) {
  languageListeners.push(listener);
  return () => {
    languageListeners = languageListeners.filter((l) => l !== listener);
  };
}

function getLanguageSnapshot(): Language {
  initLanguage();
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
 * - Client: reads localStorage on first snapshot access
 * - Language changes: updates external store + localStorage + DOM attributes
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
      document.documentElement.lang = 'en';
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
