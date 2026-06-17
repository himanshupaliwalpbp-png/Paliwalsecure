'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage, type Language } from '@/lib/i18n';
import { getBlogPost, blogCategoriesHindi, blogCategoriesHinglish } from '@/lib/blog-data';
import { Globe, Info, Clock, Share2, ShieldCheck, Phone, ArrowRight, BookOpen } from 'lucide-react';

// ── Component 1: Language Toggle + Hindi Summary Box ─────────────────────
interface BlogLanguageHeaderProps {
  slug: string;
  title: string;
  description: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
}

export function BlogLanguageHeader({
  slug,
  title,
  description,
  category,
  author,
  date,
  readTime,
}: BlogLanguageHeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const blogPost = getBlogPost(slug);

  const isHindi = language === 'hi';
  const isHinglish = language === 'hinglish';

  // Localized fields
  const localizedTitle =
    isHindi && blogPost?.titleHindi ? blogPost.titleHindi
    : isHinglish && blogPost?.titleHinglish ? blogPost.titleHinglish
    : title;

  const localizedExcerpt =
    isHindi && blogPost?.excerptHindi ? blogPost.excerptHindi
    : isHinglish && blogPost?.excerptHinglish ? blogPost.excerptHinglish
    : description;

  const localizedCategory =
    isHindi ? (blogPost?.categoryHindi || blogCategoriesHindi[category] || category)
    : isHinglish ? (blogCategoriesHinglish[category] || category)
    : category;

  const formattedDate = new Date(date).toLocaleDateString(
    isHindi ? 'hi-IN' : 'en-IN',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <>
      {/* Language Toggle */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 shadow-sm">
          <Globe className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">
            {t('blog.languageLabel')}
          </span>
          {(['en', 'hinglish', 'hi'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 min-h-[32px] min-w-[44px] ${
                language === lang
                  ? 'bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
              aria-label={`Switch to ${lang === 'en' ? 'English' : lang === 'hi' ? 'Hindi' : 'Hinglish'}`}
              aria-pressed={language === lang}
            >
              {lang === 'en' ? t('blog.english') : lang === 'hi' ? 'हिंदी' : t('blog.hinglish')}
            </button>
          ))}
          {(isHindi || isHinglish) && (
            <span className="text-[11px] text-muted-foreground/60 flex items-center gap-1 ml-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
              {t('blog.aiTranslated')}
            </span>
          )}
        </div>
      </div>

      {/* Article Header with localized content */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            {localizedCategory}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {readTime}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 leading-tight">
          {localizedTitle}
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          {localizedExcerpt}
        </p>

        {/* Hindi/Hinglish Summary Box */}
        {(isHindi || isHinglish) && blogPost && (
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-amber-50 dark:from-amber-950/30 dark:to-amber-950/30 border border-amber-200 dark:border-amber-800/50">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">
                  {t('blog.summaryLabel')}
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300 font-medium mb-2">
                  {isHindi ? blogPost.titleHindi : blogPost.titleHinglish}
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 leading-relaxed">
                  {isHindi ? blogPost.excerptHindi : blogPost.excerptHinglish}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Author & Share Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 pt-6 border-t border-border/50">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C98A1C] to-[#E0A830] flex items-center justify-center text-sm font-bold text-white"
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
                {formattedDate}
              </p>
            </div>
          </div>
          <a
            href={`https://wa.me/919257877312?text=${encodeURIComponent(`Check out: ${title} - https://paliwalsecure.com/blog/${slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border border-border bg-card hover:bg-accent transition"
            aria-label="Share this article"
          >
            <Share2 className="w-3.5 h-3.5" />
            {t('blog.share')}
          </a>
        </div>
      </header>
    </>
  );
}

// ── Component 2: Translated CTA, Author Bio, IRDAI Disclaimer ───────────
export function BlogDetailFooter({ slug }: { slug: string }) {
  const { t } = useLanguage();

  return (
    <>
      {/* Inline CTA after content */}
      <div className="mt-10 p-6 rounded-xl bg-gradient-to-r from-[#C98A1C]/5 to-[#E0A830]/5 border border-primary/20">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold mb-1">
              {t('blog.ctaHeading')}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('blog.ctaDesc')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/insuregpt"
                className="inline-block bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg transition text-sm"
              >
                {t('blog.askInsureGPT')}
              </Link>
              <a
                href="https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20read%20your%20blog%20and%20need%20advice"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold border border-border bg-card text-foreground hover:bg-accent transition text-sm"
              >
                <Phone className="w-4 h-4 text-emerald-500" />
                {t('blog.chatWhatsApp')}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Author Bio */}
      <div className="mt-10 p-6 rounded-xl bg-card border border-border">
        <div className="flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-full bg-gradient-to-br from-[#C98A1C] to-[#E0A830] flex items-center justify-center text-lg font-bold text-white shrink-0"
            aria-hidden="true"
          >
            HP
          </div>
          <div>
            <h3 className="text-lg font-semibold">Himanshu Paliwal</h3>
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

      {/* IRDAI Disclaimer */}
      <div className="mt-6 text-center">
        <p className="text-[11px] text-muted-foreground/60">{t('blog.irdaiDisclaimer')}</p>
      </div>
    </>
  );
}

// ── Component 3: Related Articles section with translated labels ─────────
interface RelatedArticle {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
}

export function BlogRelatedArticles({ articles }: { articles: RelatedArticle[] }) {
  const { language, t } = useLanguage();
  const isHindi = language === 'hi';
  const isHinglish = language === 'hinglish';

  // Get localized data for each article
  const getLocalizedTitle = (slug: string, fallback: string) => {
    const post = getBlogPost(slug);
    if (!post) return fallback;
    if (isHindi && post.titleHindi) return post.titleHindi;
    if (isHinglish && post.titleHinglish) return post.titleHinglish;
    return fallback;
  };

  const getLocalizedCategory = (slug: string, fallback: string) => {
    const post = getBlogPost(slug);
    if (!post) return blogCategoriesHindi[fallback] || fallback;
    if (isHindi) return post.categoryHindi || blogCategoriesHindi[fallback] || fallback;
    if (isHinglish) return blogCategoriesHinglish[fallback] || fallback;
    return fallback;
  };

  if (articles.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 mb-8">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="text-2xl sm:text-3xl font-bold">
            {t('blog.relatedArticles')}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((related) => (
            <Link
              key={related.slug}
              href={`/blog/${related.slug}`}
              className="group"
            >
              <article className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md border border-border/50 transition-all h-full flex flex-col">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-3 w-fit">
                  {getLocalizedCategory(related.slug, related.category)}
                </span>
                <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition line-clamp-2">
                  {getLocalizedTitle(related.slug, related.title)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-2">
                  {related.description}
                </p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {related.readTime}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all">
                    {t('blog.readMore')}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Component 4: Final CTA section with translated labels ────────────────
export function BlogFinalCTA() {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          {t('blog.compareSave')}
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          {t('blog.takeAction')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/free-audit"
            className="inline-block bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition"
          >
            {t('blog.startAudit')}
          </Link>
          <a
            href="https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20want%20to%20compare%20insurance%20plans"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold border border-border bg-card text-foreground hover:bg-accent transition"
          >
            <Phone className="w-5 h-5 text-emerald-500" />
            {t('blog.chatWhatsApp')}
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Component 5: Breadcrumb with translated labels ───────────────────────
export function BlogBreadcrumb({ title, slug }: { title: string; slug: string }) {
  const { language, t } = useLanguage();

  // Get localized title
  const blogPost = getBlogPost(slug);
  const localizedTitle = language === 'hi' && blogPost?.titleHindi ? blogPost.titleHindi : title;

  return (
    <>
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
            {localizedTitle}
          </li>
        </ol>
      </nav>
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition mb-6"
      >
        ← {t('blog.backToBlog')}
      </Link>
    </>
  );
}
