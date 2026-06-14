'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import BlogContentRenderer from '@/components/BlogContentRenderer';
import { Button } from '@/components/ui/button';
import { Loader2, Globe, X, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage, type Language } from '@/lib/i18n';

interface BlogTranslationWrapperProps {
  content: string;
}

type TranslationLang = 'en' | 'hi' | 'hing';

const LANGUAGE_LABELS: Record<TranslationLang, { label: string; native: string }> = {
  en: { label: 'English', native: 'English' },
  hi: { label: 'Hindi', native: 'हिंदी' },
  hing: { label: 'Hinglish', native: 'Hinglish' },
};

export default function BlogTranslationWrapper({ content }: BlogTranslationWrapperProps) {
  const { language: globalLanguage, t } = useLanguage();
  const [language, setLanguage] = useState<TranslationLang>('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translationCache, setTranslationCache] = useState<Record<string, string>>({});
  const [showAutoSuggestBanner, setShowAutoSuggestBanner] = useState(false);
  const [showHindiBanner, setShowHindiBanner] = useState(true);
  const [translationProgress, setTranslationProgress] = useState<{ current: number; total: number } | null>(null);
  const [partialTranslation, setPartialTranslation] = useState<string | null>(null);
  // Track the last global language we auto-translated from — allows re-translation when language changes
  const lastAutoTranslatedGlobal = useRef<Language | null>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  // Use ref for translationCache to avoid stale closure issues in handleTranslate
  const cacheRef = useRef<Record<string, string>>({});
  cacheRef.current = translationCache;

  // ── Define handleTranslate BEFORE the effects that use it ─────────────
  const handleTranslate = useCallback(async (targetLang: TranslationLang) => {
    // If switching to English, just switch — no API call needed
    if (targetLang === 'en') {
      setLanguage('en');
      setError(null);
      setPartialTranslation(null);
      return;
    }

    // Check cache first (use ref to avoid stale closure)
    const cacheKey = `${targetLang}:${content}`;
    if (cacheRef.current[cacheKey]) {
      setLanguage(targetLang);
      setError(null);
      setPartialTranslation(null);
      return;
    }

    setIsTranslating(true);
    setError(null);
    setPartialTranslation(null);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, language: targetLang }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('blog.translationError'));
      }

      if (data.success && data.translatedContent) {
        // Cache the translation
        setTranslationCache((prev) => ({
          ...prev,
          [cacheKey]: data.translatedContent,
        }));
        setLanguage(targetLang);
      } else {
        throw new Error(data.error || t('blog.translationError'));
      }
    } catch (err) {
      console.error('Translation error:', err);
      const errMsg = err instanceof Error ? err.message : t('blog.translationError');
      setError(errMsg);
      // Stay on current language if translation fails
    } finally {
      setIsTranslating(false);
      setTranslationProgress(null);
    }
  }, [content, t]);

  // ── Auto-detect browser language and show suggestion banner ────────────
  useEffect(() => {
    try {
      const browserLangs = navigator.languages || [navigator.language || ''];
      const isHindiPreferred = browserLangs.some((lang) =>
        lang.toLowerCase().startsWith('hi')
      );
      if (isHindiPreferred) {
        setShowAutoSuggestBanner(true);
      }
    } catch {
      // SSR or navigator not available
    }
  }, []);

  // ── Auto-translate when global language changes to Hindi/Hinglish ──────
  useEffect(() => {
    // Map global Language to our TranslationLang
    let targetLang: TranslationLang | null = null;
    if (globalLanguage === 'hi') targetLang = 'hi';
    else if (globalLanguage === 'hinglish') targetLang = 'hing';
    else targetLang = 'en';

    // Skip if already showing in the correct language, or if this is the same global language we already auto-translated from
    if (!targetLang || targetLang === 'en') {
      // If global language is English, just switch to English
      if (language !== 'en' && globalLanguage === 'en') {
        setLanguage('en');
        setError(null);
      }
      return;
    }

    // Only auto-translate if the global language has actually changed since last auto-translate
    if (lastAutoTranslatedGlobal.current === globalLanguage) return;
    // Also skip if already showing in the target language
    if (language === targetLang && !error) return;

    lastAutoTranslatedGlobal.current = globalLanguage;
    handleTranslate(targetLang);
  }, [globalLanguage, language, handleTranslate, error]);

  // ── Also auto-translate for Hindi browser users on first load ────────
  useEffect(() => {
    if (lastAutoTranslatedGlobal.current) return; // Already auto-translated
    try {
      const browserLangs = navigator.languages || [navigator.language || ''];
      const isHindiPreferred = browserLangs.some((lang) =>
        lang.toLowerCase().startsWith('hi')
      );
      if (isHindiPreferred && language === 'en') {
        lastAutoTranslatedGlobal.current = 'hi';
        handleTranslate('hi');
      }
    } catch {
      // SSR
    }
  }, [language, handleTranslate]);

  const currentContent =
    language !== 'en' && translationCache[`${language}:${content}`]
      ? translationCache[`${language}:${content}`]
      : partialTranslation || content;

  const handleAutoSuggestSwitch = (lang: TranslationLang) => {
    setShowAutoSuggestBanner(false);
    handleTranslate(lang);
  };

  return (
    <div>
      {/* ── Prominent "Read in Hindi" Banner ───────────────────────────────── */}
      {language === 'en' && !isTranslating && showHindiBanner && (
        <div
          className="mb-8 p-4 sm:p-5 rounded-xl bg-gradient-to-r from-amber-50 via-amber-50 to-emerald-50 dark:from-amber-950/30 dark:via-amber-950/20 dark:to-emerald-950/30 border-2 border-amber-300 dark:border-amber-700/50 shadow-sm"
          role="banner"
          aria-label="Hindi translation available"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📖</span>
              <p className="text-base sm:text-lg font-bold text-amber-800 dark:text-amber-200">
                {t('blog.readInHindiBanner')}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Button
                onClick={() => { setShowHindiBanner(false); handleTranslate('hi'); }}
                className="h-10 px-5 text-sm font-bold bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-white hover:shadow-lg rounded-full gap-1.5"
              >
                {t('blog.readInHindiButton')} <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => { setShowHindiBanner(false); handleTranslate('hing'); }}
                variant="outline"
                className="h-10 px-5 text-sm font-semibold border-[#C98A1C]/50 dark:border-[#C98A1C]/50 text-[#C98A1C] dark:text-[#C98A1C] hover:bg-[#C98A1C]/5 dark:hover:bg-[#C98A1C]/10 rounded-full"
              >
                Hinglish
              </Button>
              <button
                onClick={() => setShowHindiBanner(false)}
                className="p-1.5 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-500 transition"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Auto-Suggest Banner for Hindi Browser Users ──────────────────── */}
      {showAutoSuggestBanner && language === 'en' && (
        <div
          className="mb-6 p-3.5 rounded-xl bg-gradient-to-r from-amber-50 to-amber-50 dark:from-amber-950/30 dark:to-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-center gap-3"
          role="banner"
          aria-label="Hindi language suggestion"
        >
          <Globe className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <p className="text-sm text-amber-800 dark:text-amber-200 flex-1">
            <span className="font-medium">{t('blog.alsoAvailableInHindi')}</span>
            <span className="text-amber-600 dark:text-amber-300 ml-1">{t('blog.alsoAvailableInHindiEn')}</span>
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              onClick={() => handleAutoSuggestSwitch('hi')}
              className="h-7 px-3 text-xs font-semibold bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-white hover:shadow-md rounded-full"
            >
              {t('blog.readInHindiButton')}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleAutoSuggestSwitch('hing')}
              className="h-7 px-3 text-xs font-medium text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-full"
            >
              Hinglish
            </Button>
            <button
              onClick={() => setShowAutoSuggestBanner(false)}
              className="p-1 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-500 transition"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Sticky Language Toggle ──────────────────────────────────────── */}
      <div ref={stickyRef} className="sticky top-16 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-background/95 backdrop-blur-xl border-b border-border/50 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Globe className="w-5 h-5 text-primary" />
            <span>{t('blog.languageLabel')}</span>
          </div>
          <div className="inline-flex items-center rounded-full border border-border bg-background p-1 shadow-sm">
            {(['en', 'hi', 'hing'] as TranslationLang[]).map((lang) => {
              const isActive = language === lang;
              const isCurrentTranslating = isTranslating && isActive && lang !== 'en';
              return (
                <Button
                  key={lang}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTranslate(lang)}
                  disabled={isTranslating}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all min-h-[40px] ${
                    isActive
                      ? 'bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-white shadow-sm hover:shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-transparent'
                  }`}
                  aria-label={`Switch to ${LANGUAGE_LABELS[lang].label}`}
                  aria-pressed={isActive}
                >
                  {isCurrentTranslating ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      {LANGUAGE_LABELS[lang].native}
                    </span>
                  ) : (
                    LANGUAGE_LABELS[lang].native
                  )}
                </Button>
              );
            })}
          </div>
          {language !== 'en' && !isTranslating && (
            <span className="text-xs text-muted-foreground/60 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
              {t('blog.aiTranslated')}
            </span>
          )}
          {/* Hindi available badge */}
          {language === 'en' && (
            <span className="text-xs font-medium text-[#C98A1C] dark:text-[#C98A1C] bg-[#C98A1C]/5 dark:bg-[#C98A1C]/10 px-2.5 py-1 rounded-full border border-[#C98A1C]/20 dark:border-[#C98A1C]/30 flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {t('blog.hindiAvailable')}
            </span>
          )}
        </div>
      </div>

      {/* ── Error Banner ───────────────────────────────────────────────── */}
      {error && (
        <div
          className="mb-6 p-3.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-300 text-sm flex items-start gap-2"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <strong>{t('blog.translationUnavailable')}</strong> {error}{' '}
            {t('blog.showingOriginalContent')}
          </div>
        </div>
      )}

      {/* ── Loading Overlay with Progress ────────────────────────────────── */}
      {isTranslating && (
        <div className="relative">
          <div className="absolute inset-0 z-10 bg-background/70 backdrop-blur-[3px] flex items-center justify-center rounded-lg min-h-[200px]">
            <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-xl shadow-lg border border-border max-w-sm w-full">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#C98A1C] to-[#E0A830] flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-foreground">
                  {t('blog.translatingToLang').replace('{lang}', LANGUAGE_LABELS[language]?.native || 'हिंदी')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('blog.translatingToLangEn').replace('{lang}', LANGUAGE_LABELS[language]?.label || 'Hindi')}
                </p>
              </div>
              {translationProgress && (
                <div className="w-full">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span>
                      {t('blog.sectionProgress').replace('{current}', String(translationProgress.current)).replace('{total}', String(translationProgress.total))}
                    </span>
                    <span>{Math.round((translationProgress.current / translationProgress.total) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#C98A1C] to-[#E0A830] rounded-full transition-all duration-500"
                      style={{ width: `${(translationProgress.current / translationProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              <p className="text-[11px] text-muted-foreground">
                {t('blog.pleaseWaitSeconds')}
              </p>
            </div>
          </div>
          <BlogContentRenderer content={content} language="en" />
        </div>
      )}

      {/* ── Rendered Content ───────────────────────────────────────────── */}
      {!isTranslating && (
        <BlogContentRenderer content={currentContent} language={language === 'hing' ? 'hinglish' : language} />
      )}

      {/* ── Post-translation feedback ─────────────────────────────────────── */}
      {language !== 'en' && !isTranslating && !error && (
        <div className="mt-8 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {t('blog.aiTranslatedFeedback')}
        </div>
      )}
    </div>
  );
}
