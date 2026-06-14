'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import BlogContentRenderer from '@/components/BlogContentRenderer';
import { Languages, Loader2, AlertCircle, RefreshCw, Clock, WifiOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import type { Language } from '@/lib/i18n';
import { useLanguage } from '@/lib/i18n';

// ── Language options (same as blog listing page) ──────────────────────────
const LANG_OPTIONS: { value: Language; shortLabel: string; fullLabel: string }[] = [
  { value: 'en', shortLabel: 'EN', fullLabel: 'English' },
  { value: 'hi', shortLabel: 'हिं', fullLabel: 'हिन्दी' },
  { value: 'hinglish', shortLabel: 'Hg', fullLabel: 'Hinglish' },
];

// ── Translation cache type ────────────────────────────────────────────────
interface TranslationCache {
  en: string;
  hi: string | null;
  hinglish: string | null;
}

// ── Error types for translation failures ──────────────────────────────────
type TranslationErrorType = 'network' | 'rate_limit' | 'server' | 'timeout' | 'unknown';

interface TranslationError {
  type: TranslationErrorType;
  message: string;
  retryAfter?: number; // seconds until retry is allowed (for rate limiting)
}

// ── Props ─────────────────────────────────────────────────────────────────
interface BlogPostClientProps {
  englishContent: string;
  articleTitle: string;
}

// ── BlogPostClient Component ──────────────────────────────────────────────
export default function BlogPostClient({
  englishContent,
  articleTitle,
}: BlogPostClientProps) {
  // Initialize from the global language context so that a user who has
  // already selected Hindi or Hinglish site-wide sees the blog in that
  // language right away (translation will be fetched automatically).
  const { language: globalLanguage, t } = useLanguage();
  const [language, setLanguage] = useState<Language>(globalLanguage);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);
  const [translationError, setTranslationError] = useState<TranslationError | null>(null);
  const [translationCache, setTranslationCache] = useState<TranslationCache>({
    en: englishContent,
    hi: null,
    hinglish: null,
  });

  // Track the language we're currently translating to (for retry purposes)
  const translatingToLang = useRef<'hi' | 'hinglish' | null>(null);

  // Get the current content based on selected language
  const currentContent =
    language === 'en'
      ? translationCache.en
      : language === 'hi'
        ? translationCache.hi
        : translationCache.hinglish;

  // ── Classify error from API response ────────────────────────────────────
  const classifyError = useCallback((status: number, data?: { error?: string; retryAfter?: number }): TranslationError => {
    if (status === 429) {
      const retryAfter = data?.retryAfter;
      return {
        type: 'rate_limit',
        message: retryAfter
          ? t('blog.rateLimitRetry').replace('{seconds}', String(retryAfter))
          : t('blog.rateLimitMessage'),
        retryAfter,
      };
    }
    if (status === 503) {
      return {
        type: 'server',
        message: t('blog.serviceUnavailable'),
      };
    }
    if (status === 502) {
      return {
        type: 'server',
        message: t('blog.noAIResponse'),
      };
    }
    if (status === 413) {
      return {
        type: 'server',
        message: t('blog.articleTooLong'),
      };
    }
    return {
      type: 'unknown',
      message: t('blog.translationFailed').replace('{status}', String(status)),
    };
  }, []);

  // Abort controller ref for cancelling in-flight requests
  const abortControllerRef = useRef<AbortController | null>(null);

  // Ref to track translation cache for stale-closure-safe checks
  const translationCacheRef = useRef<TranslationCache>(translationCache);
  translationCacheRef.current = translationCache;

  // Client-side timeout: 240 seconds (4 min — increased for reliability with long articles + smaller chunks)
  const CLIENT_TIMEOUT_MS = 240_000;

  // Fetch translation from API
  const fetchTranslation = useCallback(
    async (targetLang: 'hi' | 'hinglish') => {
      // Already cached — no need to fetch (use ref for latest value to avoid stale closure)
      if (translationCacheRef.current[targetLang] !== null) return;

      // Cancel any previous in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create a new AbortController for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // Set up client-side timeout to abort the request
      const clientTimeout = setTimeout(() => {
        abortController.abort();
      }, CLIENT_TIMEOUT_MS);

      // Clear previous error and start translating
      setTranslationError(null);
      setIsTranslating(true);
      setTranslationProgress(10);
      translatingToLang.current = targetLang;

      try {
        setTranslationProgress(20);

        const res = await fetch('/api/blog-translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: englishContent,
            language: targetLang === 'hi' ? 'hi' : 'hing',
            title: articleTitle,
          }),
          signal: abortController.signal,
        });

        // If request was aborted while waiting for response, bail out silently
        if (abortController.signal.aborted) return;

        setTranslationProgress(70);

        if (!res.ok) {
          let errorData: { error?: string; retryAfter?: number } = {};
          try {
            errorData = await res.json();
          } catch {
            // If we can't parse JSON, use default error
          }

          const classifiedError = classifyError(res.status, errorData);
          setTranslationError(classifiedError);
          setTranslationProgress(0);

          // Show toast notification for the error
          if (classifiedError.type === 'rate_limit') {
            toast.error(t('blog.errorRateLimit'), {
              description: classifiedError.message,
              duration: 8000,
            });
          } else if (classifiedError.type === 'server' || classifiedError.type === 'timeout') {
            toast.error(t('blog.errorServiceError'), {
              description: classifiedError.message,
              duration: 6000,
            });
          } else {
            toast.error(t('blog.translationError'), {
              description: classifiedError.message,
              duration: 6000,
            });
          }

          return;
        }

        const data = await res.json();

        // If request was aborted while parsing, bail out silently
        if (abortController.signal.aborted) return;

        setTranslationProgress(90);

        if (data.translatedContent) {
          setTranslationCache((prev) => ({
            ...prev,
            [targetLang]: data.translatedContent,
          }));
          setTranslationProgress(100);
          toast.success(
            targetLang === 'hi'
              ? t('blog.translatedToHindi')
              : t('blog.translatedToHinglish'),
            { duration: 3000 }
          );
        } else {
          const err: TranslationError = {
            type: 'server',
            message: t('blog.noAIContent'),
          };
          setTranslationError(err);
          setTranslationProgress(0);
          toast.error(t('blog.translationError'), { description: err.message, duration: 6000 });
        }
      } catch (error) {
        // Don't show error if the request was intentionally aborted (user switched language)
        if (abortController.signal.aborted) {
          return;
        }

        console.error('Translation fetch error:', error);

        // Check for timeout (AbortError due to client-side timeout)
        const isTimeout = error instanceof DOMException && error.name === 'AbortError';

        const err: TranslationError = isTimeout
          ? { type: 'timeout', message: t('blog.translationTimeout') }
          : error instanceof TypeError && error.message.includes('fetch')
            ? { type: 'network', message: t('blog.networkError') }
            : { type: 'network', message: t('blog.requestFailed') };

        setTranslationError(err);
        setTranslationProgress(0);
        toast.error(
          isTimeout ? t('blog.errorTimedOut') : t('blog.errorNetwork'),
          { description: err.message, duration: 6000 }
        );
      } finally {
        clearTimeout(clientTimeout);
        // Only update state if this request is still the current one.
        // If the user switched language during translation, a new request
        // will have replaced abortControllerRef.current — in that case,
        // updating isTranslating/progress here would prematurely kill the
        // loading state of the new translation.
        if (abortControllerRef.current === abortController) {
          setIsTranslating(false);
          // Delay progress reset so the bar reaches 100% visually
          setTimeout(() => setTranslationProgress(0), 600);
        }
      }
    },
    [englishContent, articleTitle, classifyError]
  );

  // Handle language change
  const handleLanguageChange = useCallback(
    (newLang: Language) => {
      if (newLang === language) {
        // Allow re-clicking the same non-English language to retry
        // if the translation is not cached and not already translating
        if (newLang !== 'en' && !isTranslating && translationCacheRef.current[newLang] === null) {
          fetchTranslation(newLang as 'hi' | 'hinglish');
        }
        return;
      }

      // Always allow switching back to English — it's already available
      if (newLang === 'en') {
        // Abort any in-flight translation request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
        }
        setLanguage('en');
        setIsTranslating(false);
        setTranslationError(null);
        setTranslationProgress(0);
        return;
      }

      // If already cached, switch immediately (even during another translation)
      if (translationCacheRef.current[newLang] !== null) {
        // Abort any in-flight request for a different language
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
        }
        setLanguage(newLang);
        setIsTranslating(false);
        setTranslationError(null);
        setTranslationProgress(0);
        return;
      }

      // If translating to a different language, abort current and start new translation
      if (isTranslating) {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
        }
        setIsTranslating(false);
      }

      // Clear previous error when switching
      setTranslationError(null);

      // Switch language first, then fetch
      setLanguage(newLang);
      fetchTranslation(newLang);
    },
    [language, fetchTranslation, isTranslating]
  );

  // Abort in-flight translation request on unmount to save resources
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Sync with global language context on first mount.
  // If the user has already selected Hindi or Hinglish site-wide,
  // automatically trigger translation for the blog post content.
  //
  // IMPORTANT: On the first render, `globalLanguage` may still be the
  // server-side default ('hinglish') because the LanguageProvider's
  // useEffect (which reads localStorage) hasn't run yet.  To avoid
  // triggering an unnecessary translation with the wrong language, we
  // read the stored preference directly from localStorage here.
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      // Read the *actual* stored language — globalLanguage may be stale
      // on the very first render (before the LanguageProvider hydrates).
      let effectiveLang = globalLanguage;
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('paliwal-language');
          if (stored === 'en' || stored === 'hi' || stored === 'hinglish') {
            effectiveLang = stored;
          }
        } catch {
          // localStorage not available
        }
      }
      // Sync local state if it was initialised with the wrong value
      if (effectiveLang !== language) {
        setLanguage(effectiveLang);
      }
      if (effectiveLang !== 'en') {
        fetchTranslation(effectiveLang as 'hi' | 'hinglish');
      }
    }
    // We intentionally run this effect only once on mount and do NOT
    // sync subsequent global language changes, because the user may have
    // manually switched language on this blog post.
  }, [globalLanguage, fetchTranslation, language]);

  // Retry translation
  const handleRetry = useCallback(() => {
    if (translatingToLang.current) {
      fetchTranslation(translatingToLang.current);
    }
  }, [fetchTranslation]);

  // Switch back to English from error state
  const handleSwitchToEnglish = useCallback(() => {
    // Abort any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLanguage('en');
    setTranslationError(null);
    setIsTranslating(false);
    setTranslationProgress(0);
  }, []);

  // Map Language to BlogContentRenderer's language prop format
  const rendererLanguage: 'en' | 'hi' | 'hinglish' = language;

  // ── Get error icon based on error type ──────────────────────────────────
  const getErrorIcon = (errorType: TranslationErrorType) => {
    switch (errorType) {
      case 'rate_limit':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'network':
        return <WifiOff className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  // ── Get error title based on error type ─────────────────────────────────
  const getErrorTitle = (error: TranslationError) => {
    switch (error.type) {
      case 'rate_limit':
        return t('blog.errorRateLimit');
      case 'network':
        return t('blog.errorNetwork');
      case 'timeout':
        return t('blog.errorTimedOut');
      case 'server':
        return t('blog.errorServiceError');
      default:
        return t('blog.translationError');
    }
  };

  return (
    <>
      {/* Language Toggle Bar */}
      <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-background/95 backdrop-blur-md border-b border-border/30 mb-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-medium hidden sm:inline">
              {t('blog.languageLabel')}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {LANG_OPTIONS.map((opt) => {
              const isSelected = language === opt.value;
              const isLoading = isTranslating && language === opt.value;
              const hasError = translationError !== null && language === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleLanguageChange(opt.value)}
                  className={`
                    flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 min-h-[36px]
                    ${isSelected && !hasError
                      ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/25'
                      : hasError
                        ? 'bg-red-500/10 border border-red-300 text-red-600 dark:text-red-400 dark:border-red-800 dark:bg-red-950/30'
                        : 'bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/30'
                    }
                  `}
                  aria-label={`Switch to ${opt.fullLabel}`}
                  aria-pressed={isSelected}
                >
                  <span className="font-bold">{opt.shortLabel}</span>
                  <span className="hidden sm:inline text-xs">{opt.fullLabel}</span>
                  {isLoading && (
                    <Loader2 className="w-3 h-3 animate-spin ml-1" />
                  )}
                  {hasError && !isLoading && (
                    <AlertCircle className="w-3 h-3 ml-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Translating indicator */}
          {isTranslating && (
            <div className="flex items-center gap-2 text-sm text-cyan-600 dark:text-cyan-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="hidden sm:inline">
                {t('blog.translating')}
              </span>
            </div>
          )}

          {/* Language badge when non-English */}
          {!isTranslating && !translationError && language !== 'en' && (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
              {language === 'hi' ? 'हिंदी' : 'Hinglish'}
            </span>
          )}
        </div>

        {/* Progress bar for translation */}
        {isTranslating && translationProgress > 0 && (
          <div className="mt-2">
            <Progress value={translationProgress} className="h-1.5 bg-cyan-100 dark:bg-cyan-950/40 [&>div]:bg-cyan-500" />
          </div>
        )}
      </div>

      {/* Inline error banner — content remains readable below */}
      {translationError && !isTranslating && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-950/50 shrink-0 mt-0.5">
              {getErrorIcon(translationError.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                {getErrorTitle(translationError)}
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1 leading-relaxed">
                {translationError.message}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Button
                  onClick={handleRetry}
                  size="sm"
                  className="bg-cyan-500 hover:bg-cyan-600 text-white gap-1.5 h-7 text-xs"
                >
                  <RefreshCw className="w-3 h-3" />
                  {t('blog.retryTranslation')}
                </Button>
                <Button
                  onClick={handleSwitchToEnglish}
                  variant="outline"
                  size="sm"
                  className="gap-1.5 h-7 text-xs"
                >
                  {t('blog.readInEnglish')}
                </Button>
              </div>
            </div>
            <button
              onClick={() => setTranslationError(null)}
              className="shrink-0 p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>
      )}

      {/* Content Area — always fully readable */}
      <div>
        {/* Show translated content if available, otherwise English */}
        <BlogContentRenderer
          content={currentContent || englishContent}
          language={rendererLanguage}
        />

        {/* Subtle inline notice when showing English fallback during/after failed translation */}
        {language !== 'en' && !currentContent && !isTranslating && !translationError && (
          <p className="text-xs text-muted-foreground italic mt-4">
            {t('blog.showingEnglishContent')}
          </p>
        )}
      </div>
    </>
  );
}
