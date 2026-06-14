'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageLayout from '@/components/PageLayout';
import { Clock, ArrowRight, Tag, Search, BookOpen, TrendingUp, Shield, X, Languages } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { blogPosts, blogCategoriesHindi, blogCategoriesHinglish, type BlogPostSummary } from '@/lib/blog-data';
import { useLanguage, type Language } from '@/lib/i18n';

// ── Color Map ──────────────────────────────────────────────────────────────
const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  rose: { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800' },
  violet: { bg: 'bg-violet-50 dark:bg-violet-950/40', text: 'text-violet-700 dark:text-violet-300', border: 'border-violet-200 dark:border-violet-800' },
  sky: { bg: 'bg-sky-50 dark:bg-sky-950/40', text: 'text-sky-700 dark:text-sky-300', border: 'border-sky-200 dark:border-sky-800' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-950/40', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800' },
  teal: { bg: 'bg-[#C98A1C]/10 dark:bg-[#C98A1C]/20', text: 'text-[#C98A1C] dark:text-[#C98A1C]', border: 'border-[#C98A1C]/20 dark:border-[#C98A1C]/30' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' },
  cyan: { bg: 'bg-[#C98A1C]/10 dark:bg-[#C98A1C]/20', text: 'text-[#C98A1C] dark:text-[#C98A1C]', border: 'border-[#C98A1C]/20 dark:border-[#C98A1C]/30' },
  lime: { bg: 'bg-lime-50 dark:bg-lime-950/40', text: 'text-lime-700 dark:text-lime-300', border: 'border-lime-200 dark:border-lime-800' },
  pink: { bg: 'bg-pink-50 dark:bg-pink-950/40', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-200 dark:border-pink-800' },
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800' },
  blue: { bg: 'bg-[#C98A1C]/10 dark:bg-[#C98A1C]/20', text: 'text-[#C98A1C] dark:text-[#C98A1C]', border: 'border-[#C98A1C]/20 dark:border-[#C98A1C]/30' },
};

// ── Language options ──────────────────────────────────────────────────────
const LANG_OPTIONS: { value: Language; shortLabel: string; fullLabel: string }[] = [
  { value: 'en', shortLabel: 'EN', fullLabel: 'English' },
  { value: 'hi', shortLabel: 'हिं', fullLabel: 'हिन्दी' },
  { value: 'hinglish', shortLabel: 'Hg', fullLabel: 'Hinglish' },
];

// ── Category to color mapping ────────────────────────────────────────────
const categoryColorMap: Record<string, string> = {
  'Health Insurance': 'rose',
  'Motor Insurance': 'amber',
  'Life Insurance': 'violet',
  'Travel Insurance': 'sky',
  'Home Insurance': 'orange',
  'Claims Guide': 'blue',
  'Tax Saving': 'emerald',
  'Insurance Basics': 'blue',
  'EV Insurance': 'lime',
  'Vehicle Guide': 'pink',
  'City Guide': 'indigo',
};

// ── Get localized text ────────────────────────────────────────────────────
function getLocalizedTitle(post: BlogPostSummary, lang: Language): string {
  if (lang === 'hi' && post.titleHindi) return post.titleHindi;
  if (lang === 'hinglish' && post.titleHinglish) return post.titleHinglish;
  return post.title;
}

function getLocalizedExcerpt(post: BlogPostSummary, lang: Language): string {
  if (lang === 'hi' && post.excerptHindi) return post.excerptHindi;
  if (lang === 'hinglish' && post.excerptHinglish) return post.excerptHinglish;
  return post.excerpt;
}

function getLocalizedCategory(category: string, lang: Language): string {
  if (lang === 'hi' && blogCategoriesHindi[category]) return blogCategoriesHindi[category];
  if (lang === 'hinglish' && blogCategoriesHinglish && blogCategoriesHinglish[category]) return blogCategoriesHinglish[category];
  return category;
}

// ── Page Client Component ──────────────────────────────────────────────────
export default function BlogPageClient({
  posts,
  categories,
}: {
  posts: BlogPostData[];
  categories: string[];
}) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { language, setLanguage, t } = useLanguage();

  // Build a lookup map from blog-data.ts for Hindi/Hinglish content
  const blogDataMap = useMemo(() => {
    const map: Record<string, BlogPostSummary> = {};
    blogPosts.forEach((p) => { map[p.slug] = p; });
    return map;
  }, []);

  // Filter posts based on category and search
  const filteredPosts = useMemo(() => {
    let result = posts;
    if (activeCategory !== 'All') {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => {
          const blogExtra = blogDataMap[p.frontmatter.slug];
          const titleEn = p.frontmatter.title.toLowerCase();
          const titleHi = blogExtra?.titleHindi?.toLowerCase() || '';
          const titleHg = blogExtra?.titleHinglish?.toLowerCase() || '';
          const descEn = p.frontmatter.description.toLowerCase();
          const descHi = blogExtra?.excerptHindi?.toLowerCase() || '';
          const descHg = blogExtra?.excerptHinglish?.toLowerCase() || '';
          const categoryMatch = p.category.toLowerCase().includes(q);
          const keywordMatch = p.frontmatter.keywords?.some((k) => k.toLowerCase().includes(q));
          return titleEn.includes(q) || titleHi.includes(q) || titleHg.includes(q) ||
                 descEn.includes(q) || descHi.includes(q) || descHg.includes(q) ||
                 categoryMatch || keywordMatch;
        }
      );
    }
    return result;
  }, [posts, activeCategory, searchQuery, blogDataMap]);

  // Featured post (most recent, only when no filters)
  const showFeatured = activeCategory === 'All' && !searchQuery.trim();
  const featured = showFeatured ? filteredPosts[0] : null;
  const restPosts = showFeatured ? filteredPosts.slice(1) : filteredPosts;

  // Get blog-data.ts extra info for a post
  const getExtra = (slug: string): BlogPostSummary | undefined => blogDataMap[slug];

  return (
    <PageLayout>
      <div>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="bg-muted/30 border-b border-border/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
            <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors font-medium">{t('nav.home')}</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-[#C98A1C] dark:text-[#C98A1C] font-semibold">{t('nav.blog')}</li>
            </ol>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 sm:py-20">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C98A1C]/10 dark:bg-[#C98A1C]/20 border border-[#C98A1C]/20 dark:border-[#C98A1C]/30 text-sm font-medium text-[#C98A1C] dark:text-[#C98A1C] mb-6">
              <BookOpen className="w-4 h-4" />
              {t('blog.heading')}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              {t('blog.heroTitle1')}{' '}
              <span className="gradient-text">{t('blog.heroTitle2')}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6 leading-relaxed">
              {t('blog.heroDesc')}{' '}
              <strong className="text-foreground">
                {t('blog.heroDescHighlight')}
              </strong>
            </p>

            {/* Language Toggle */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <Languages className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-medium">{t('blog.languageSwitchLabel')}</span>
              <div className="flex gap-1.5">
                {LANG_OPTIONS.map((opt) => {
                  const isSelected = language === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setLanguage(opt.value)}
                      className={`
                        flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 min-h-[36px]
                        ${isSelected
                          ? 'bg-[#C98A1C] text-white shadow-md shadow-[#C98A1C]/25'
                          : 'bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-[#C98A1C]/40 hover:bg-[#C98A1C]/10 dark:hover:bg-[#C98A1C]/20'
                        }
                      `}
                      aria-label={`Switch to ${opt.fullLabel}`}
                      aria-pressed={isSelected}
                    >
                      <span className="font-bold">{opt.shortLabel}</span>
                      <span className="hidden sm:inline text-xs">{opt.fullLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t('blog.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 pr-10 h-12 rounded-full border-border/50 bg-card text-sm focus-visible:ring-primary/30 focus-visible:border-primary/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-3 h-3 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-full">
              <button
                onClick={() => setActiveCategory('All')}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 min-h-[40px] ${
                  activeCategory === 'All'
                    ? 'bg-foreground text-background shadow-md'
                    : 'bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-accent'
                }`}
                aria-pressed={activeCategory === 'All'}
              >
                <Tag className="w-3.5 h-3.5" />
                {t('blog.allPosts')}
              </button>
              {categories.map((cat) => {
                const catPost = posts.find((p) => p.category === cat);
                const color = catPost?.categoryColor || categoryColorMap[cat] || 'blue';
                const cm = colorMap[color];
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 min-h-[40px] max-w-[200px] ${
                      isActive
                        ? `${cm.bg} ${cm.text} ${cm.border} shadow-md`
                        : 'bg-card border-border/50 text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-accent'
                    }`}
                    aria-pressed={isActive}
                  >
                    <span className="truncate">{getLocalizedCategory(cat, language)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Results summary */}
        {(searchQuery || activeCategory !== 'All') && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4">
            <p className="text-sm text-muted-foreground">
              {t('blog.articlesFoundIn').replace('{count}', String(filteredPosts.length))}
              {activeCategory !== 'All' && <span> {t('blog.inCategory')} <strong className="text-foreground">{getLocalizedCategory(activeCategory, language)}</strong></span>}
              {searchQuery && <span> {t('blog.matching')} &ldquo;<strong className="text-foreground">{searchQuery}</strong>&rdquo;</span>}
            </p>
          </div>
        )}

        {/* Featured Post */}
        {featured && (() => {
          const featuredExtra = getExtra(featured.frontmatter.slug);
          const featuredTitle = featuredExtra ? getLocalizedTitle(featuredExtra, language) : featured.frontmatter.title;
          const featuredDesc = featuredExtra ? getLocalizedExcerpt(featuredExtra, language) : featured.frontmatter.description;
          return (
            <section className="py-4 md:py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <Link href={`/blog/${featured.frontmatter.slug}`} className="group block">
                  <article className="glass-card p-6 sm:p-8 md:p-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#C98A1C] to-[#0A1330]" />
                    <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[#C98A1C] to-[#0A1330] text-white">
                            {t('blog.featured')}
                          </span>
                          {(() => {
                            const cm = colorMap[featured.categoryColor];
                            return (
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${cm.bg} ${cm.text} ${cm.border}`}>
                                {getLocalizedCategory(featured.category, language)}
                              </span>
                            );
                          })()}
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {featured.readTime.replace(/\s*min read\s*/i, '')} {t('blog.readTime')}
                          </span>
                          {language !== 'en' && (
                            <Badge variant="secondary" className="text-[10px] px-2 py-0 bg-[#C98A1C]/10 dark:bg-[#C98A1C]/20 text-[#C98A1C] dark:text-[#C98A1C] border-[#C98A1C]/20 dark:border-[#C98A1C]/30">
                              {language === 'hi' ? 'हिंदी' : 'Hinglish'}
                            </Badge>
                          )}
                        </div>

                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition leading-tight break-words">
                          {featuredTitle}
                        </h2>

                        <p className="text-muted-foreground leading-relaxed mb-6 text-sm sm:text-base break-words">
                          {featuredDesc}
                        </p>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C98A1C] to-[#0A1330] flex items-center justify-center text-sm font-bold text-white">
                              HP
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{featured.frontmatter.author}</p>
                              <p className="text-xs text-muted-foreground">
                                {t('blog.irdaiCertifiedPOSP')} • {new Date(featured.frontmatter.date).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          <span className="flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                            {t('blog.readArticle')} <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              </div>
            </section>
          );
        })()}

        {/* Blog Posts Grid */}
        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2 mb-8">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-2xl sm:text-3xl font-bold">
                {searchQuery ? t('blog.searchTitle') : t('blog.allTitle')}{' '}<span className="gradient-text">{t('blog.articlesTitle')}</span>
              </h2>
              <span className="ml-auto text-sm text-muted-foreground">{t('blog.articlesCount').replace('{count}', String(filteredPosts.length))}</span>
            </div>

            {restPosts.length === 0 ? (
              <div className="text-center py-16">
                <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t('blog.noArticlesFoundTitle')}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {t('blog.tryDifferentSearch')}
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All');
                  }}
                >
                  {t('blog.clearFilters')}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {restPosts.map((post) => {
                  const extra = getExtra(post.frontmatter.slug);
                  const postTitle = extra ? getLocalizedTitle(extra, language) : post.frontmatter.title;
                  const postDesc = extra ? getLocalizedExcerpt(extra, language) : post.frontmatter.description;
                  const cm = colorMap[post.categoryColor];
                  return (
                    <Link
                      key={post.frontmatter.slug}
                      href={`/blog/${post.frontmatter.slug}`}
                      className="group"
                    >
                      <article className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-sm hover:shadow-lg border border-border/50 transition-all h-full flex flex-col relative overflow-hidden">
                        {/* Category color bar */}
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                          post.categoryColor === 'rose' ? 'from-rose-500 to-pink-500' :
                          post.categoryColor === 'amber' ? 'from-amber-500 to-orange-500' :
                          post.categoryColor === 'violet' ? 'from-violet-500 to-purple-500' :
                          post.categoryColor === 'sky' ? 'from-sky-500 to-blue-500' :
                          post.categoryColor === 'orange' ? 'from-orange-500 to-red-500' :
                          post.categoryColor === 'teal' ? 'from-[#0A1330] to-[#C98A1C]' :
                          post.categoryColor === 'blue' ? 'from-[#C98A1C] to-[#0A1330]' :
                          post.categoryColor === 'emerald' ? 'from-emerald-500 to-green-500' :
                          post.categoryColor === 'lime' ? 'from-lime-500 to-green-500' :
                          post.categoryColor === 'pink' ? 'from-pink-500 to-rose-500' :
                          post.categoryColor === 'indigo' ? 'from-indigo-500 to-violet-500' :
                          'from-[#C98A1C] to-[#0A1330]'
                        }`} />

                        {/* Category & Read Time */}
                        <div className="flex items-center justify-between mb-3 mt-1">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cm.bg} ${cm.text} ${cm.border}`}>
                            {getLocalizedCategory(post.category, language)}
                          </span>
                          <div className="flex items-center gap-2">
                            {language !== 'en' && (
                              <Badge variant="secondary" className="text-[9px] px-1.5 py-0 bg-[#C98A1C]/10 dark:bg-[#C98A1C]/20 text-[#C98A1C] dark:text-[#C98A1C] border-[#C98A1C]/20 dark:border-[#C98A1C]/30">
                                {language === 'hi' ? 'हिं' : 'Hg'}
                              </Badge>
                            )}
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {post.readTime.replace(/\s*min read\s*/i, '')} {t('blog.readTime')}
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-base sm:text-lg font-semibold mb-2 group-hover:text-primary transition line-clamp-2 leading-snug">
                          {postTitle}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-3">
                          {postDesc}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-border/50">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C98A1C] to-[#0A1330] flex items-center justify-center text-xs font-bold text-white">
                              HP
                            </div>
                            <div>
                              <p className="text-xs font-medium">{post.frontmatter.author}</p>
                              <p className="text-[10px] text-muted-foreground">{new Date(post.frontmatter.date).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                            </div>
                          </div>
                          <span className="flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all">
                            {t('blog.readMore')} <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* SEO Keywords Section */}
        <section className="py-8 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="glass-card p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">
                  {t('blog.popularTopics')}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  'Health Insurance India', 'Car Insurance Renewal', 'Term Insurance Plans',
                  'Bike Insurance Online', 'Travel Insurance Schengen', 'Home Insurance Policy',
                  'Section 80D Tax Saving', 'Cashless Claim Process', 'Zero Dep Car Insurance',
                  'Insurance Claim Rejection', 'Senior Citizen Insurance', 'Family Floater Plan',
                  'IRDAI Rules 2026', 'Insurance for Young India', 'NCB in Car Insurance',
                  'Best Mediclaim Policy', 'Insurance Hinglish', 'बीमा गाइड हिंदी',
                  'फैमिली हेल्थ इंश्योरेंस', 'कार इंश्योरेंस टिप्स', 'टर्म इंश्योरेंस',
                ].map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => setSearchQuery(keyword)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-muted/60 border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-accent transition-colors cursor-pointer"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C98A1C] to-[#0A1330] mb-6 shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {t('blog.ctaHeadingInsureGPT')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('blog.ctaDescInsureGPT')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/insuregpt"
                className="inline-block bg-gradient-to-r from-[#C98A1C] to-[#0A1330] text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition"
              >
                🤖 {t('blog.askInsureGPTShort')}
              </Link>
              <a
                href="https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20have%20an%20insurance%20question"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold border border-border bg-card text-foreground hover:bg-accent transition"
              >
                💬 {t('blog.chatWhatsApp')}
              </a>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
