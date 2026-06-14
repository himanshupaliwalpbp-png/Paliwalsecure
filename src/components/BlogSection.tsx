'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Clock, Calendar, ArrowRight, BookOpen, Heart, Car, Shield, FileText, Plane, Home as HomeIcon, Zap, Bike, MapPin, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage, type Language } from '@/lib/i18n';
import { blogPosts, blogCategories, blogCategoriesHindi, blogCategoriesHinglish } from '@/lib/blog-data';

// ── Category Icon Map ────────────────────────────────────────────────────
const categoryIconMap: Record<string, React.ElementType> = {
  'Health Insurance': Heart,
  'Life Insurance': Shield,
  'Motor Insurance': Car,
  'Tax Saving': FileText,
  'Claims Guide': FileText,
  'Travel Insurance': Plane,
  'Home Insurance': HomeIcon,
  'Insurance Basics': BookOpen,
  'EV Insurance': Zap,
  'Vehicle Guide': Bike,
  'City Guide': MapPin,
};

// ── Category Configuration ────────────────────────────────────────────────
const categoryConfig: Record<string, {
  gradient: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}> = {
  'Health Insurance': {
    gradient: 'from-rose-500 to-pink-500',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/40',
    badgeText: 'text-rose-700 dark:text-rose-300',
    badgeBorder: 'border-rose-200 dark:border-rose-800/50',
  },
  'Life Insurance': {
    gradient: 'from-violet-500 to-purple-500',
    badgeBg: 'bg-violet-50 dark:bg-violet-950/40',
    badgeText: 'text-violet-700 dark:text-violet-300',
    badgeBorder: 'border-violet-200 dark:border-violet-800/50',
  },
  'Motor Insurance': {
    gradient: 'from-amber-500 to-orange-500',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40',
    badgeText: 'text-amber-700 dark:text-amber-300',
    badgeBorder: 'border-amber-200 dark:border-amber-800/50',
  },
  'Tax Saving': {
    gradient: 'from-emerald-500 to-green-500',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    badgeBorder: 'border-emerald-200 dark:border-emerald-800/50',
  },
  'Claims Guide': {
    gradient: 'from-[#C98A1C] to-[#E0A830]',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40',
    badgeText: 'text-amber-700 dark:text-amber-300',
    badgeBorder: 'border-amber-200 dark:border-amber-800/50',
  },
  'Travel Insurance': {
    gradient: 'from-sky-500 to-blue-500',
    badgeBg: 'bg-sky-50 dark:bg-sky-950/40',
    badgeText: 'text-sky-700 dark:text-sky-300',
    badgeBorder: 'border-sky-200 dark:border-sky-800/50',
  },
  'Home Insurance': {
    gradient: 'from-orange-500 to-red-500',
    badgeBg: 'bg-orange-50 dark:bg-orange-950/40',
    badgeText: 'text-orange-700 dark:text-orange-300',
    badgeBorder: 'border-orange-200 dark:border-orange-800/50',
  },
  'Insurance Basics': {
    gradient: 'from-[#C98A1C] to-[#E0A830]',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40',
    badgeText: 'text-amber-700 dark:text-amber-300',
    badgeBorder: 'border-amber-200 dark:border-amber-800/50',
  },
  'EV Insurance': {
    gradient: 'from-lime-500 to-green-500',
    badgeBg: 'bg-lime-50 dark:bg-lime-950/40',
    badgeText: 'text-lime-700 dark:text-lime-300',
    badgeBorder: 'border-lime-200 dark:border-lime-800/50',
  },
  'Vehicle Guide': {
    gradient: 'from-pink-500 to-rose-500',
    badgeBg: 'bg-pink-50 dark:bg-pink-950/40',
    badgeText: 'text-pink-700 dark:text-pink-300',
    badgeBorder: 'border-pink-200 dark:border-pink-800/50',
  },
  'City Guide': {
    gradient: 'from-violet-500 to-purple-500',
    badgeBg: 'bg-violet-50 dark:bg-violet-950/40',
    badgeText: 'text-violet-700 dark:text-violet-300',
    badgeBorder: 'border-violet-200 dark:border-violet-800/50',
  },
};

// Categories to show as filter tabs (most popular ones)
const FILTER_CATEGORIES = [
  'All',
  'Health Insurance',
  'Motor Insurance',
  'Life Insurance',
  'Claims Guide',
  'EV Insurance',
  'Vehicle Guide',
  'Tax Saving',
];

// ── Animation Variants ────────────────────────────────────────────────────
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

// ── Language-aware text helper ──────────────────────────────────────────────
function getBlogText(en: string, hi: string, hinglish: string, lang: Language): string {
  if (lang === 'hi') return hi || en;
  if (lang === 'hinglish') return hinglish || en;
  return en;
}

function getCategoryText(category: string, lang: Language): string {
  if (lang === 'hi') return blogCategoriesHindi[category] || category;
  if (lang === 'hinglish') return blogCategoriesHinglish[category] || category;
  return category;
}

// ── Component ─────────────────────────────────────────────────────────────
export default function BlogSection() {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');

  // Filter and limit posts based on active category
  const displayPosts = useMemo(() => {
    const filtered = activeCategory === 'All'
      ? blogPosts
      : blogPosts.filter((p) => p.category === activeCategory);
    return filtered.slice(0, 6);
  }, [activeCategory]);

  // Count for "View All" button
  const totalCount = activeCategory === 'All'
    ? blogPosts.length
    : blogPosts.filter((p) => p.category === activeCategory).length;

  return (
    <section id="blog" className="py-16 sm:py-24 bg-muted/30 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-8 sm:mb-10"
        >
          <Badge className="mb-4 bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800 rounded-full px-4 py-1">
            <Brain className="w-3.5 h-3.5 mr-1" />
            {t('blog.badge')}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            {t('blog.heading')}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            {t('blog.description')}
          </p>
        </motion.div>

        {/* Category Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-full"
        >
          {FILTER_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const config = cat !== 'All' ? categoryConfig[cat] : null;
            const displayCat = cat === 'All' ? t('blog.allCategories') : getCategoryText(cat, language);
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  min-h-[40px] min-w-[44px] max-w-[180px]
                  ${isActive
                    ? (cat === 'All'
                      ? 'bg-foreground text-background shadow-md'
                      : `shadow-md ${config?.badgeBg || ''} ${config?.badgeText || ''} ${config?.badgeBorder || ''} border`)
                    : 'bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-accent'
                  }
                `}
                aria-pressed={isActive}
              >
                <span className="truncate">{displayCat}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Blog Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: 10 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          >
            {displayPosts.map((post) => {
              const config = categoryConfig[post.category] || categoryConfig['Insurance Basics']!;
              return (
                <motion.div key={post.slug} variants={staggerItem} whileHover={{ y: -6 }}>
                  <Link href={`/blog/${post.slug}`} className="block h-full group cursor-pointer">
                    <Card className="h-full rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border-border/50 group-hover:border-[#C98A1C]/30 dark:group-hover:border-[#C98A1C]/30 flex flex-col">
                      {/* Category Gradient Bar */}
                      <div className={`h-1.5 bg-gradient-to-r ${config.gradient}`} />

                      <CardContent className="p-5 sm:p-6 flex flex-col flex-1">
                        {/* Category Badge with Icon */}
                        <Badge
                          variant="outline"
                          className={`mb-3 inline-flex items-center gap-1 ${config.badgeBg} ${config.badgeText} ${config.badgeBorder} text-xs font-semibold rounded-full px-2.5 py-0.5 w-fit`}
                        >
                          {(() => {
                            const CatIcon = categoryIconMap[post.category] || Tag;
                            return <CatIcon className="w-3 h-3" />;
                          })()}
                          {getCategoryText(post.category, language)}
                        </Badge>

                        {/* Title */}
                        <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug mb-2 line-clamp-2 group-hover:text-[#C98A1C] dark:group-hover:text-[#C98A1C] transition-colors duration-200 overflow-hidden">
                          {getBlogText(post.title, post.titleHindi, post.titleHinglish, language)}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4 overflow-hidden">
                          {getBlogText(post.excerpt, post.excerptHindi, post.excerptHinglish, language)}
                        </p>

                        {/* Spacer to push bottom content down */}
                        <div className="mt-auto" />

                        {/* Meta: Read Time + Date — More prominent */}
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground/80 mb-3">
                          <span className="flex items-center gap-1 bg-muted/60 dark:bg-muted/40 rounded-full px-2 py-0.5">
                            <Clock className="w-3 h-3 text-[#C98A1C] dark:text-[#C98A1C]" />
                            {post.readTime.replace(/\s*min read\s*/i, '')} {t('blog.readTime')}
                          </span>
                          <span className="flex items-center gap-1 bg-muted/60 dark:bg-muted/40 rounded-full px-2 py-0.5">
                            <Calendar className="w-3 h-3 text-[#C98A1C] dark:text-[#C98A1C]" />
                            {new Date(post.date).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { month: 'short', year: 'numeric' })}
                          </span>
                        </div>

                        {/* Read More Link */}
                        <div className="flex items-center justify-between pt-3 border-t border-border/40">
                          <span className="text-sm font-semibold text-[#C98A1C] dark:text-[#C98A1C] flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300">
                            {t('blog.readArticle')}
                            <ArrowRight className="w-4 h-4" />
                          </span>
                          <span className="text-[10px] text-muted-foreground/50 font-medium uppercase tracking-wider">
                            {getCategoryText(post.category, language)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Empty state */}
        {displayPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-muted-foreground">{t('blog.noArticlesFound')}</p>
          </motion.div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-white shadow-lg shadow-[#C98A1C]/20 hover:shadow-[#C98A1C]/40 hover:-translate-y-0.5 transition-all duration-200 min-h-[44px]"
          >
            {t('blog.viewAllArticles').replace('{count}', String(totalCount))}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
