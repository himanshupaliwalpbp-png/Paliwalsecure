'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  Shield,
  Lightbulb,
  Share2,
  Twitter,
  Linkedin,
  Link2,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';

/**
 * TrendArticle — Trend Article Template for GEO
 *
 * For auto-generated trend articles (new vehicle launches,
 * IRDAI updates, regulatory changes, etc.)
 *
 * Features:
 * - Article schema + BreadcrumbList + FAQPage JSON-LD
 * - Expert insight box with E-E-A-T credentials
 * - Internal linking suggestions
 * - Author box (Himanshu Paliwal, IRDAI POSP Code: IP429834)
 * - Social share buttons
 * - Structured content sections
 */

interface TrendArticleContent {
  sections: {
    heading: string;
    body: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

interface TrendArticleProps {
  title: string;
  slug: string;
  category: string;
  date: string;
  content: TrendArticleContent;
  tags: string[];
  expertInsight?: string;
  internalLinks?: { label: string; href: string }[];
  className?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  health: 'from-[#C98A1C] to-[#E0A830]',
  life: 'from-emerald-500 to-green-400',
  motor: 'from-[#C98A1C] to-[#E0A830]',
  travel: 'from-[#C98A1C] to-emerald-400',
  home: 'from-amber-500 to-orange-400',
  irdai: 'from-rose-500 to-pink-400',
  ev: 'from-green-500 to-lime-400',
  default: 'from-[#C98A1C] to-[#E0A830]',
};

export function TrendArticle({
  title,
  slug,
  category,
  date,
  content,
  tags,
  expertInsight,
  internalLinks,
  className,
}: TrendArticleProps) {
  const articleUrl = `https://paliwalsecure.com/blog/${slug}`;
  const gradientColor =
    CATEGORY_COLORS[category.toLowerCase()] || CATEGORY_COLORS.default;

  // ── Article Schema ──────────────────────────────────────────────
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    datePublished: date,
    dateModified: date,
    author: {
      '@type': 'Person',
      name: 'Himanshu Paliwal',
      jobTitle: 'IRDAI Certified Insurance Advisor',
      url: 'https://paliwalsecure.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Paliwal Secure AI',
      logo: {
        '@type': 'ImageObject',
        url: 'https://paliwalsecure.com/icon.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    description: content.sections[0]?.body?.substring(0, 160) || '',
    keywords: tags.join(', '),
  };

  // ── BreadcrumbList Schema ───────────────────────────────────────
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://paliwalsecure.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://paliwalsecure.com/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: articleUrl,
      },
    ],
  };

  // ── FAQPage Schema ──────────────────────────────────────────────
  const faqSchema =
    content.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: content.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }
      : null;

  const handleShare = (platform: string) => {
    const text = encodeURIComponent(`${title} — Paliwal Secure AI`);
    const url = encodeURIComponent(articleUrl);
    const shareLinks: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      copy: articleUrl,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(articleUrl).catch(() => {});
      return;
    }

    if (shareLinks[platform]) {
      window.open(shareLinks[platform], '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <article
        itemScope
        itemType="https://schema.org/Article"
        className={cn('max-w-4xl mx-auto', className)}
      >
        {/* ── Breadcrumb ────────────────────────────────────────── */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
            <li className="flex items-center gap-1.5">
              <a
                href="/"
                className="hover:text-foreground transition-colors font-medium"
              >
                Home
              </a>
              <ChevronRight className="w-3.5 h-3.5" />
            </li>
            <li className="flex items-center gap-1.5">
              <a
                href="/blog"
                className="hover:text-foreground transition-colors"
              >
                Blog
              </a>
              <ChevronRight className="w-3.5 h-3.5" />
            </li>
            <li>
              <span className="text-[#C98A1C] dark:text-[#C98A1C] font-semibold line-clamp-1">
                {title}
              </span>
            </li>
          </ol>
        </nav>

        {/* ── Article Header ────────────────────────────────────── */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Badge
              className={cn(
                'text-[10px] text-white border-0',
                `bg-gradient-to-r ${gradientColor}`
              )}
            >
              {category.toUpperCase()}
            </Badge>
            <time
              dateTime={date}
              className="text-xs text-muted-foreground"
              itemProp="datePublished"
            >
              {new Date(date).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>

          <h1
            itemProp="headline"
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight leading-tight mb-4"
          >
            {title}
          </h1>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-[10px] font-normal"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Social Share Buttons */}
          <div className="flex items-center gap-2">
            <Share2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">
              Share:
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs gap-1"
              onClick={() => handleShare('twitter')}
              aria-label="Share on Twitter"
            >
              <Twitter className="h-3.5 w-3.5" />
              Twitter
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs gap-1"
              onClick={() => handleShare('linkedin')}
              aria-label="Share on LinkedIn"
            >
              <Linkedin className="h-3.5 w-3.5" />
              LinkedIn
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs gap-1 text-green-600"
              onClick={() => handleShare('whatsapp')}
              aria-label="Share on WhatsApp"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs gap-1"
              onClick={() => handleShare('copy')}
              aria-label="Copy link"
            >
              <Link2 className="h-3.5 w-3.5" />
              Copy Link
            </Button>
          </div>
        </header>

        {/* ── Content Sections ──────────────────────────────────── */}
        <div itemProp="articleBody" className="space-y-8 mb-8">
          {content.sections.map((section, idx) => (
            <section key={idx}>
              <h2 className="text-lg sm:text-xl font-bold text-foreground mb-3">
                {section.heading}
              </h2>
              <div
                className="prose prose-sm dark:prose-invert max-w-none text-foreground/80 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: section.body }}
              />
            </section>
          ))}
        </div>

        {/* ── Expert Insight Box ────────────────────────────────── */}
        {expertInsight && (
          <Card className="border-amber-200 dark:border-amber-900/50 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10 mb-8">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-bold text-amber-900 dark:text-amber-200">
                  Expert Insight
                </h3>
              </div>
              <blockquote className="text-sm text-foreground/90 leading-relaxed border-l-3 border-amber-400 pl-4">
                &ldquo;{expertInsight}&rdquo;
              </blockquote>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-amber-200/50 dark:border-amber-800/30">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                  HP
                </div>
                <div>
                  <p className="text-xs font-semibold">Himanshu Paliwal</p>
                  <p className="text-xs text-muted-foreground">
                    IRDAI Certified Insurance Advisor | POSP Code: IP429834
                  </p>
                </div>
                <a
                  href="https://wa.me/919257877312"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto flex items-center gap-1 text-xs font-medium text-green-600 hover:text-green-700"
                >
                  <MessageCircle className="h-4 w-4" />
                  Ask Expert
                </a>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Internal Linking Suggestions ──────────────────────── */}
        {internalLinks && internalLinks.length > 0 && (
          <Card className="bg-muted/30 mb-8">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-3">
                <Link2 className="h-4 w-4 text-[#C98A1C] dark:text-[#C98A1C]" />
                <h3 className="text-sm font-bold text-foreground">
                  Related Articles
                </h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {internalLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/60 hover:bg-background border border-border/30 transition-colors text-sm text-foreground/80 hover:text-foreground"
                  >
                    <ChevronRight className="h-3.5 w-3.5 text-[#C98A1C] dark:text-[#C98A1C] flex-shrink-0" />
                    <span className="line-clamp-1">{link.label}</span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── FAQ Section ───────────────────────────────────────── */}
        {content.faqs.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {content.faqs.map((faq, idx) => (
                <Card key={idx} className="bg-background/60">
                  <CardContent className="p-4 sm:p-5">
                    <h3
                      className="text-sm font-bold text-foreground mb-2"
                      itemProp="mainEntity"
                      itemScope
                      itemType="https://schema.org/Question"
                    >
                      <span itemProp="name">{faq.question}</span>
                    </h3>
                    <div
                      itemProp="acceptedAnswer"
                      itemScope
                      itemType="https://schema.org/Answer"
                    >
                      <p
                        itemProp="text"
                        className="text-sm text-foreground/70 leading-relaxed"
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        <Separator className="my-8" />

        {/* ── Author Box (E-E-A-T Credentials) ──────────────────── */}
        <Card className="bg-gradient-to-br from-amber-50/50 to-amber-50/30 dark:from-amber-950/20 dark:to-amber-950/10 mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#C98A1C] to-[#E0A830] flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  HP
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-foreground">
                    Himanshu Paliwal
                  </h3>
                  <Badge className="text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-0">
                    Verified Author
                  </Badge>
                </div>
                <p className="text-sm text-foreground/70 mb-2">
                  IRDAI Certified Insurance Advisor | POSP Code: IP429834
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Himanshu is an IRDAI-registered Point of Sale Person (POSP)
                  with deep expertise in health, life, motor, and travel
                  insurance. He helps Indian families find the right insurance
                  through AI-powered recommendations and transparent, unbiased
                  advice.
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Shield className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    IRDAI POSP Verified
                  </div>
                  <a
                    href="https://wa.me/919257877312"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-medium text-green-600 hover:text-green-700"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── IRDAI Disclaimer ──────────────────────────────────── */}
        <div className="text-[10px] text-muted-foreground leading-relaxed p-3 rounded-lg bg-muted/30 border border-border/30">
          <strong>Disclaimer:</strong> Insurance is the subject matter of
          solicitation. Paliwal Secure AI is an IRDAI-registered POSP (Code:
          IP429834). The information provided is for educational purposes only
          and does not constitute financial advice. Premium amounts, claim
          settlement ratios, and coverage details are indicative and may vary.
          Please read the policy document carefully before purchasing.
        </div>
      </article>
    </>
  );
}
