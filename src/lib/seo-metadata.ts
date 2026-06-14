// ============================================================================
// SEO Metadata Utilities — Paliwal Secure AI / InsureGPT
// Enterprise-grade schema generation, metadata helpers, and SEO utilities
// ============================================================================

import { Metadata } from 'next';
import { ArticleContent, FAQItem, ComparisonRow } from './content-types';

const BASE_URL = 'https://paliwalsecure.in';
const SITE_NAME = 'Paliwal Secure AI';

// ── JSON-LD Schema Generators ────────────────────────────────────────────────

export function generateArticleSchema(article: ArticleContent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.seoTitle,
    description: article.metaDescription,
    datePublished: article.date,
    dateModified: article.lastModified,
    author: {
      '@type': 'Person',
      name: 'Himanshu Paliwal',
      url: BASE_URL,
      jobTitle: 'IRDAI Certified POSP Insurance Advisor',
      knowsAbout: ['Insurance', 'Health Insurance', 'Motor Insurance', 'Life Insurance'],
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      alternateName: 'InsureGPT',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${article.slug}`,
    },
    keywords: article.keywords.join(', '),
    inLanguage: ['en', 'hi'],
    image: `${BASE_URL}/og-blog-${article.slug}.jpg`,
  };
}

export function generateFAQSchema(faqs: FAQItem[]) {
  if (!faqs || faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateHowToSchema(name: string, description: string, steps: { name: string; text: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateSpeakableSchema(url: string, cssSelector: string[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector,
    },
  };
}

// ── Next.js Metadata Generator ───────────────────────────────────────────────

export function generateArticleMetadata(article: ArticleContent): Metadata {
  const url = `${BASE_URL}/blog/${article.slug}`;
  return {
    title: `${article.seoTitle} | ${SITE_NAME}`,
    description: article.metaDescription,
    keywords: article.keywords,
    alternates: {
      canonical: article.canonicalUrl || url,
      languages: {
        'en': url,
        'hi': url,
      },
    },
    openGraph: {
      title: article.ogTitle || article.seoTitle,
      description: article.metaDescription,
      url,
      siteName: SITE_NAME,
      type: 'article',
      locale: 'en_IN',
      publishedTime: article.date,
      modifiedTime: article.lastModified,
      authors: ['Himanshu Paliwal'],
      images: [{ url: `${BASE_URL}/og-blog-${article.slug}.jpg`, width: 1200, height: 630, alt: article.seoTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.ogTitle || article.seoTitle,
      description: article.metaDescription,
      images: [`${BASE_URL}/og-blog-${article.slug}.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateHubMetadata(hub: { name: string; hindiName: string; description: string; slug: string }): Metadata {
  const url = `${BASE_URL}/blog/${hub.slug}`;
  return {
    title: `${hub.name} — Insurance Guides & Tips | ${SITE_NAME}`,
    description: hub.description,
    alternates: {
      canonical: url,
      languages: { 'en': url, 'hi': url },
    },
    openGraph: {
      title: `${hub.name} | ${SITE_NAME}`,
      description: hub.description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_IN',
    },
  };
}

// ── Sitemap Entry Generator ──────────────────────────────────────────────────

export function generateSitemapEntry(article: ArticleContent) {
  return {
    url: `${BASE_URL}/blog/${article.slug}`,
    lastModified: new Date(article.lastModified),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    alternates: {
      languages: { 'en': `${BASE_URL}/blog/${article.slug}`, 'hi': `${BASE_URL}/blog/${article.slug}` },
    },
  };
}

// ── SEO Content Optimizer ────────────────────────────────────────────────────

/** Extract plain text from article for AI overview optimization */
export function extractPlainText(article: ArticleContent): string {
  const parts = [
    article.h1,
    article.quickAnswer,
    article.definition,
    article.insuranceImpact,
    article.expertInsight,
    article.conclusion,
    ...article.faqs.map(f => `${f.question} ${f.answer}`),
  ];
  return parts.join(' ');
}

/** Generate hreflang tags */
export function generateHreflang(url: string) {
  return {
    'en': url,
    'hi': url,
    'hi-Latn': url, // Hinglish
  };
}

/** Generate entity SEO markup */
export function generateEntitySchema(article: ArticleContent) {
  const entityMap: Record<string, string> = {
    health: 'HealthInsurance',
    motor: 'MotorInsurance',
    claims: 'InsuranceClaim',
    'vehicle-launch': 'VehicleInsurance',
    ev: 'ElectricVehicleInsurance',
    'insurance-basics': 'Insurance',
    'programmatic-seo': 'Insurance',
  };

  return {
    '@context': 'https://schema.org',
    '@type': entityMap[article.category] || 'Insurance',
    name: article.h1,
    description: article.metaDescription,
  };
}
