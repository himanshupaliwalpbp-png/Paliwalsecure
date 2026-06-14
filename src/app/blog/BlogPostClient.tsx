'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Clock, ArrowLeft, ArrowRight, Share2, ShieldCheck, Phone, BookOpen, Languages, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import BlogContentRenderer from '@/components/BlogContentRenderer';
import { useLanguage, type Language } from '@/lib/i18n';
import { blogPosts, blogCategoriesHindi, blogCategoriesHinglish, type BlogPostSummary } from '@/lib/blog-data';

// ── Language options ──────────────────────────────────────────────────────
const LANG_OPTIONS: { value: Language; shortLabel: string; fullLabel: string }[] = [
  { value: 'en', shortLabel: 'EN', fullLabel: 'English' },
  { value: 'hi', shortLabel: 'हिं', fullLabel: 'हिन्दी' },
  { value: 'hinglish', shortLabel: 'Hg', fullLabel: 'Hinglish' },
];

// ── Helper: Get localized text from blog-data.ts ──────────────────────────
function getLocalizedTitle(post: BlogPostSummary | undefined, lang: Language, fallback: string): string {
  if (!post) return fallback;
  if (lang === 'hi' && post.titleHindi) return post.titleHindi;
  if (lang === 'hinglish' && post.titleHinglish) return post.titleHinglish;
  return fallback;
}

function getLocalizedExcerpt(post: BlogPostSummary | undefined, lang: Language, fallback: string): string {
  if (!post) return fallback;
  if (lang === 'hi' && post.excerptHindi) return post.excerptHindi;
  if (lang === 'hinglish' && post.excerptHinglish) return post.excerptHinglish;
  return fallback;
}

function getLocalizedCategory(category: string, lang: Language): string {
  if (lang === 'hi' && blogCategoriesHindi[category]) return blogCategoriesHindi[category];
  if (lang === 'hinglish' && blogCategoriesHinglish[category]) return blogCategoriesHinglish[category];
  return category;
}

// ── Translation cache ─────────────────────────────────────────────────────
const clientTranslationCache = new Map<string, { content: string; title: string; description: string }>();

// ── Props ──────────────────────────────────────────────────────────────────
interface BlogPostClientProps {
  slug: string;
  title: string;
  description: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  relatedPosts: Array<{
    slug: string;
    title: string;
    description: string;
    category: string;
    readTime: string;
  }>;
}

// ── Component ──────────────────────────────────────────────────────────────
export default function BlogPostClient({
  slug,
  title,
  description,
  content,
  author,
  date,
  category,
  readTime,
  relatedPosts,
}: BlogPostClientProps) {
  const { language, setLanguage, t } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [translatedTitle, setTranslatedTitle] = useState<string | null>(null);
  const [translatedDescription, setTranslatedDescription] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationFailed, setTranslationFailed] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Find the blog-data.ts entry for this slug
  const blogExtra = blogPosts.find((p) => p.slug === slug);

  // Get the display title/description based on language
  const displayTitle = language === 'en'
    ? title
    : (translatedTitle || getLocalizedTitle(blogExtra, language, title));
  const displayDescription = language === 'en'
    ? description
    : (translatedDescription || getLocalizedExcerpt(blogExtra, language, description));
  const displayContent = language === 'en' ? content : (translatedContent || content);
  const displayCategory = getLocalizedCategory(category, language);

  // ── Translation fetch with auto-retry ──────────────────────────────────
  const fetchTranslation = useCallback(async (lang: Language, isRetry = false) => {
    if (lang === 'en') {
      setTranslatedContent(null);
      setTranslatedTitle(null);
      setTranslatedDescription(null);
      setTranslationFailed(false);
      return;
    }

    // Check client cache first
    const cacheKey = `${slug}:${lang}`;
    const cached = clientTranslationCache.get(cacheKey);
    if (cached) {
      setTranslatedContent(cached.content);
      setTranslatedTitle(cached.title);
      setTranslatedDescription(cached.description);
      setTranslationFailed(false);
      return;
    }

    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsTranslating(true);
    setTranslationFailed(false);

    const attemptTranslation = async (): Promise<boolean> => {
      try {
        // Use Next.js API route which has built-in fallback logic
        // (tries microservice internally, then LLM SDK, then returns English gracefully)
        const response = await fetch('/api/blog-translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content,
            language: lang,
            title,
            description,
            slug,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Translation failed: ${response.status}`);
        }

        const data = await response.json();

        // Always use whatever we got from the API (it gracefully falls back to English)
        if (data.translatedContent) setTranslatedContent(data.translatedContent);
        if (data.translatedTitle) setTranslatedTitle(data.translatedTitle);
        if (data.translatedDescription) setTranslatedDescription(data.translatedDescription);

        if (data.success && data.translatedContent) {
          // Cache successful translations
          clientTranslationCache.set(cacheKey, {
            content: data.translatedContent,
            title: data.translatedTitle,
            description: data.translatedDescription,
          });
        }
        return true;
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          // Request was cancelled, ignore
          return true;
        }
        console.error('Translation error:', err);
        return false;
      }
    };

    const success = await attemptTranslation();

    if (!success && !isRetry) {
      // Auto-retry once after 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Check if the request was aborted during the wait
      if (controller.signal.aborted) return;
      const retrySuccess = await attemptTranslation();
      if (!retrySuccess) {
        setTranslationFailed(true);
      }
    } else if (!success && isRetry) {
      setTranslationFailed(true);
    }

    setIsTranslating(false);
  }, [content, title, description, slug]);

  // Fetch translation when language changes
  useEffect(() => {
    fetchTranslation(language);
  }, [language, fetchTranslation]);

  // ── Localized strings (via t()) ──────────────────────────────────────────────
  const backToBlog = t('blog.backToBlog');
  const shareText = t('blog.share');
  const relatedText = t('blog.relatedArticles');
  const readText = t('blog.readMore');
  const translatingText = t('blog.translating');
  const ctaHeading = t('blog.ctaHeading');
  const ctaDesc = t('blog.ctaDesc');
  const askInsureGPT = t('blog.askInsureGPT');
  const chatWhatsApp = t('blog.chatWhatsApp');
  const compareSave = t('blog.compareSave');
  const takeAction = t('blog.takeAction');
  const startAudit = t('blog.startAudit');

  return (
    <>
      {/* Breadcrumb & Back */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-primary transition">
                {t('nav.home')}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/blog" className="hover:text-primary transition">
                {t('nav.blog')}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
              {displayTitle}
            </li>
          </ol>
        </nav>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition"
          >
            <ArrowLeft className="w-4 h-4" />
            {backToBlog}
          </Link>

          {/* Language Toggle */}
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline">भाषा:</span>
            <div className="flex gap-1">
              {LANG_OPTIONS.map((opt) => {
                const isSelected = language === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setLanguage(opt.value)}
                    className={`
                      flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 min-h-[32px]
                      ${isSelected
                        ? 'bg-[#C98A1C] text-white shadow-sm shadow-[#C98A1C]/25'
                        : 'bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-[#C98A1C]/40'
                      }
                    `}
                    aria-label={`Switch to ${opt.fullLabel}`}
                    aria-pressed={isSelected}
                  >
                    <span className="font-bold">{opt.shortLabel}</span>
                    <span className="hidden sm:inline text-[10px]">{opt.fullLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              {displayCategory}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {readTime.replace(/\s*min read\s*/i, '')} {t('blog.readTime')}
            </span>
            {language !== 'en' && (
              <Badge variant="secondary" className="text-[10px] px-2 py-0 bg-[#C98A1C]/10 dark:bg-[#C98A1C]/20 text-[#C98A1C] dark:text-[#C98A1C] border-[#C98A1C]/20 dark:border-[#C98A1C]/30">
                {language === 'hi' ? 'हिंदी' : 'Hinglish'}
              </Badge>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 leading-tight break-words">
            {displayTitle}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed break-words">
            {displayDescription}
          </p>

          {/* Translation status banner */}
          {language !== 'en' && (isTranslating || translationFailed) && (
            <div
              className={`mt-4 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium border ${
                isTranslating
                  ? 'bg-[#C98A1C]/10 border-[#C98A1C]/20 text-[#C98A1C] dark:text-[#C98A1C]'
                  : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
              }`}
              role="status"
              aria-live="polite"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>{translatingText}</span>
                  <span className="text-xs opacity-70 ml-1">({t('blog.titleTranslated')})</span>
                </>
              ) : (
                <span>{t('blog.translationFailed') || 'Translation unavailable. Showing English content.'}</span>
              )}
            </div>
          )}

          {/* Author & Share Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 pt-6 border-t border-border/50">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C98A1C] to-[#0A1330] flex items-center justify-center text-sm font-bold text-white"
                aria-hidden="true"
              >
                HP
              </div>
              <div>
                <p className="text-sm font-semibold">{author}</p>
                <p className="text-xs text-muted-foreground">
                  {t('blog.irdaiAdvisorPosp')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(date).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <a
              href={`https://wa.me/919257877312?text=${encodeURIComponent(`Check out: ${title} - https://paliwalsecure.in/blog/${slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border border-border bg-card hover:bg-accent transition"
              aria-label="Share this article"
            >
              <Share2 className="w-3.5 h-3.5" />
              {shareText}
            </a>
          </div>
        </header>

        {/* Markdown Content with translation overlay */}
        <div className="relative">
          {isTranslating && language !== 'en' && (
            <div className="absolute inset-0 z-10 flex items-start justify-center pt-8 pointer-events-none">
              <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#C98A1C] text-white shadow-lg shadow-[#C98A1C]/25 text-sm font-semibold animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{translatingText}</span>
              </div>
            </div>
          )}
          <div className={isTranslating && language !== 'en' ? 'opacity-40 transition-opacity duration-300' : 'transition-opacity duration-300'}>
            <BlogContentRenderer content={displayContent} language={language} />
          </div>
        </div>

        {/* Inline CTA after content */}
        <div className="mt-10 p-6 rounded-xl bg-gradient-to-r from-[#C98A1C]/5 to-[#0A1330]/5 border border-primary/20">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold mb-1">
                {ctaHeading}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {ctaDesc}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/insuregpt"
                  className="inline-block bg-gradient-to-r from-[#C98A1C] to-[#0A1330] text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg transition text-sm"
                >
                  🤖 {askInsureGPT}
                </Link>
                <a
                  href="https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20read%20your%20blog%20and%20need%20advice"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold border border-border bg-card text-foreground hover:bg-accent transition text-sm"
                >
                  <Phone className="w-4 h-4 text-emerald-500" />
                  {chatWhatsApp}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Author Bio */}
        <div className="mt-10 p-6 rounded-xl bg-card border border-border">
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-full bg-gradient-to-br from-[#C98A1C] to-[#0A1330] flex items-center justify-center text-lg font-bold text-white shrink-0"
              aria-hidden="true"
            >
              HP
            </div>
            <div>
              <h3 className="text-lg font-semibold">{author}</h3>
              <p className="text-xs text-primary font-medium mb-2">
                {t('blog.irdaiPospAdvisor')}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('blog.authorBio')}
              </p>
              <div className="flex gap-3 mt-3">
                <Link
                  href="/insuregpt"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  {t('blog.chatWithInsureGPT')}
                </Link>
                <a
                  href="https://wa.me/919257877312"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  {t('blog.whatsappConsultation')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="py-16 md:py-24 bg-card/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2 mb-8">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="text-2xl sm:text-3xl font-bold">
                {relatedText}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((related) => {
                const relatedExtra = blogPosts.find((p) => p.slug === related.slug);
                const relatedTitle = language === 'en'
                  ? related.title
                  : getLocalizedTitle(relatedExtra, language, related.title);
                const relatedDesc = language === 'en'
                  ? related.description
                  : getLocalizedExcerpt(relatedExtra, language, related.description);
                const relatedCat = getLocalizedCategory(related.category, language);

                return (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group"
                  >
                    <article className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md border border-border/50 transition-all h-full flex flex-col">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-3 w-fit">
                        {relatedCat}
                      </span>
                      <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition line-clamp-2">
                        {relatedTitle}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-2">
                        {relatedDesc}
                      </p>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {related.readTime.replace(/\s*min read\s*/i, '')} {t('blog.readTime')}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all">
                          {readText}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {compareSave}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {takeAction}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/#reverse-audit"
              className="inline-block bg-gradient-to-r from-[#C98A1C] to-[#0A1330] text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition"
            >
              {startAudit}
            </Link>
            <a
              href="https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20want%20to%20compare%20insurance%20plans"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold border border-border bg-card text-foreground hover:bg-accent transition"
            >
              <Phone className="w-5 h-5 text-emerald-500" />
              {chatWhatsApp}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
