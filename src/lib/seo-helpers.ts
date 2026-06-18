/**
 * SEO Helpers — Paliwal Secure (https://paliwalsecure.in)
 *
 * Reusable utility functions for generating SEO metadata,
 * JSON-LD schemas, and hreflang alternates across the site.
 *
 * Usage:
 * - Import helpers in page.tsx files for generateMetadata()
 * - Use schema generators in server components
 * - Use hreflang helpers for multilingual support
 *
 * Brand Info:
 * - Brand: Paliwal Secure AI / InsureGPT
 * - POSP Code: IP429834
 * - WhatsApp: +91 9257877312
 * - Location: Kota, Rajasthan, India
 * - Website: https://paliwalsecure.in
 * - Author: Himanshu Paliwal
 * - Instagram: @paliwalinsure
 */

import type { Metadata } from 'next'

// ============================================================================
// Constants
// ============================================================================

export const BASE_URL = 'https://paliwalsecure.in'
export const BRAND_NAME = 'Paliwal Secure'
export const BRAND_TAGLINE = 'AI se Best Plan, Humse Easy Claim'
export const AUTHOR_NAME = 'Himanshu Paliwal'
export const POSP_CODE = 'IP429834'
export const WHATSAPP = '+91 9257877312'
export const EMAIL = 'himanshupaliwalpbp@gmail.com'
export const INSTAGRAM = '@paliwalinsure'
export const LOCATION = 'Kota, Rajasthan, India'

// ============================================================================
// Blog Post Metadata Generator
// ============================================================================

export interface BlogPostSEO {
  slug: string
  title: string
  excerpt: string
  category: string
  keywords: string[]
  date: string
  readTime?: string
  image?: string
}

/**
 * Generates comprehensive Next.js Metadata for blog post pages.
 *
 * Includes:
 * - Title with brand suffix
 * - Description optimized for SERP (max 155 chars)
 * - Keywords from blog post data
 * - Open Graph metadata (Facebook, LinkedIn, WhatsApp)
 * - Twitter Card metadata
 * - Canonical URL
 * - hreflang alternates (en, hi, x-default)
 * - Robots directives
 * - Author and publisher info
 */
export function generateBlogPostMetadata(post: BlogPostSEO): Metadata {
  const url = `${BASE_URL}/blog/${post.slug}`
  const title = `${post.title} | ${BRAND_NAME}`
  const description = post.excerpt.length > 155
    ? post.excerpt.substring(0, 152).replace(/\s+\S*$/, '') + '...'
    : post.excerpt
  const imageUrl = post.image || `${BASE_URL}/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category)}`

  return {
    title,
    description,
    keywords: [
      ...post.keywords,
      post.category,
      'insurance India',
      BRAND_NAME,
      'InsureGPT',
      AUTHOR_NAME,
    ],
    authors: [{ name: AUTHOR_NAME, url: BASE_URL }],
    creator: AUTHOR_NAME,
    publisher: BRAND_NAME,
    alternates: {
      canonical: url,
      languages: {
        en: url,
        hi: url,
        'x-default': url,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: BRAND_NAME,
      type: 'article',
      locale: 'en_IN',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${post.title} — ${BRAND_NAME}`,
        },
      ],
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [AUTHOR_NAME],
      tags: post.keywords,
      section: post.category,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@paliwalinsure',
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
  }
}

// ============================================================================
// Hub Page Metadata Generator
// ============================================================================

export interface HubPageSEO {
  slug: string
  title: string
  description: string
  keywords: string[]
  category?: string
}

/**
 * Generates Next.js Metadata for hub pages (/hub/*).
 */
export function generateHubPageMetadata(page: HubPageSEO): Metadata {
  const url = `${BASE_URL}/hub/${page.slug}`
  const title = `${page.title} | ${BRAND_NAME}`

  return {
    title,
    description: page.description,
    keywords: [
      ...page.keywords,
      BRAND_NAME,
      'insurance India',
      AUTHOR_NAME,
    ],
    authors: [{ name: AUTHOR_NAME, url: BASE_URL }],
    creator: AUTHOR_NAME,
    publisher: BRAND_NAME,
    alternates: {
      canonical: url,
      languages: {
        en: url,
        hi: url,
        'x-default': url,
      },
    },
    openGraph: {
      title,
      description: page.description,
      url,
      siteName: BRAND_NAME,
      type: 'website',
      locale: 'en_IN',
      images: [
        {
          url: `${BASE_URL}/api/og?title=${encodeURIComponent(page.title)}&category=${encodeURIComponent(page.category || 'insurance')}`,
          width: 1200,
          height: 630,
          alt: `${page.title} — ${BRAND_NAME}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: page.description,
      creator: '@paliwalinsure',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

// ============================================================================
// BreadcrumbList Schema Generator
// ============================================================================

export interface BreadcrumbItem {
  name: string
  url: string
}

/**
 * Generates a BreadcrumbList JSON-LD schema.
 *
 * Usage:
 * ```tsx
 * const schema = generateBreadcrumbSchema([
 *   { name: 'Home', url: '/' },
 *   { name: 'Blog', url: '/blog' },
 *   { name: 'Article Title', url: '/blog/slug' },
 * ])
 * ```
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  }
}

/**
 * Generates breadcrumbs for blog posts.
 */
export function generateBlogBreadcrumbs(postTitle: string, postSlug: string): BreadcrumbItem[] {
  return [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: postTitle, url: `/blog/${postSlug}` },
  ]
}

/**
 * Generates breadcrumbs for hub pages.
 */
export function generateHubBreadcrumbs(hubName: string, hubSlug: string): BreadcrumbItem[] {
  return [
    { name: 'Home', url: '/' },
    { name: hubName, url: `/hub/${hubSlug}` },
  ]
}

/**
 * Generates breadcrumbs for city-specific pages.
 */
export function generateCityBreadcrumbs(insuranceType: string, cityName: string, citySlug: string): BreadcrumbItem[] {
  return [
    { name: 'Home', url: '/' },
    { name: insuranceType, url: `/${insuranceType.toLowerCase().replace(/\s+/g, '-')}` },
    { name: `${insuranceType} in ${cityName}`, url: `/health-insurance/${citySlug}` },
  ]
}

/**
 * Generates breadcrumbs for vehicle-specific pages.
 */
export function generateVehicleBreadcrumbs(vehicleName: string, vehicleSlug: string): BreadcrumbItem[] {
  return [
    { name: 'Home', url: '/' },
    { name: 'Vehicle Insurance', url: '/hub/motor-insurance' },
    { name: vehicleName, url: `/insurance/${vehicleSlug}` },
  ]
}

// ============================================================================
// Article Schema Generator
// ============================================================================

export interface ArticleSEO {
  title: string
  description: string
  slug: string
  date: string
  modifiedDate?: string
  category: string
  keywords: string[]
  readTime?: string
  image?: string
}

/**
 * Generates an Article JSON-LD schema for blog posts.
 *
 * Optimized for:
 * - Google Rich Results (article carousel)
 * - Google News
 * - AI platform citations
 * - Social media previews
 */
export function generateArticleSchema(article: ArticleSEO): object {
  const url = `${BASE_URL}/blog/${article.slug}`
  const imageUrl = article.image || `${BASE_URL}/api/og?title=${encodeURIComponent(article.title)}&category=${encodeURIComponent(article.category)}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: article.title,
    description: article.description,
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      width: 1200,
      height: 630,
    },
    url,
    datePublished: article.date,
    dateModified: article.modifiedDate || article.date,
    author: {
      '@type': 'Person',
      '@id': 'https://paliwalsecure.in/#person-himanshu',
      name: AUTHOR_NAME,
      url: BASE_URL,
      jobTitle: 'IRDAI Certified Insurance Advisor (POSP)',
    },
    publisher: {
      '@type': 'Organization',
      '@id': 'https://paliwalsecure.in/#organization',
      name: BRAND_NAME,
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: article.category,
    keywords: article.keywords.join(', '),
    wordCount: article.readTime
      ? parseInt(article.readTime) * 200 // rough estimate
      : 1500,
    inLanguage: ['en', 'hi'],
    isAccessibleForFree: true,
  }
}

// ============================================================================
// FAQ Schema Generator
// ============================================================================

export interface FAQItem {
  question: string
  answer: string
}

/**
 * Generates a FAQPage JSON-LD schema.
 *
 * Usage:
 * ```tsx
 * const schema = generateFAQSchema([
 *   { question: 'What is health insurance?', answer: 'Health insurance is...' },
 *   { question: 'How to file a claim?', answer: 'To file a claim...' },
 * ])
 * ```
 *
 * Optimized for:
 * - Google Rich Results (FAQ expandable in SERP)
 * - Voice search (Google Assistant, Siri, Alexa)
 * - AI Overview citations
 * - People Also Ask boxes
 */
export function generateFAQSchema(faqs: FAQItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// ============================================================================
// hreflang Alternates Helper
// ============================================================================

/**
 * Generates hreflang alternates for a given page path.
 *
 * Supported languages:
 * - en: English (primary)
 * - hi: Hindi
 * - x-default: Fallback
 *
 * Usage:
 * ```tsx
 * export const metadata: Metadata = {
 *   alternates: generateHreflangAlternates('/blog/my-article'),
 * }
 * ```
 */
export function generateHreflangAlternates(path: string): {
  canonical: string
  languages: Record<string, string>
} {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`

  return {
    canonical: url,
    languages: {
      en: url,
      hi: url,
      'x-default': url,
    },
  }
}

// ============================================================================
// LocalBusiness Schema Generator (for city-specific pages)
// ============================================================================

export interface CityPageSEO {
  cityName: string
  citySlug: string
  insuranceType: string
  state?: string
}

/**
 * Generates a LocalBusiness JSON-LD schema for city-specific insurance pages.
 *
 * Optimized for:
 * - Google Business Profile
 * - Local search results
 * - "near me" queries
 * - Google Maps integration
 */
export function generateLocalBusinessSchema(city: CityPageSEO): object {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'InsuranceAgency'],
    '@id': `${BASE_URL}/#business-${city.citySlug}`,
    name: `${BRAND_NAME} — ${city.insuranceType} in ${city.cityName}`,
    image: `${BASE_URL}/logo.svg`,
    telephone: WHATSAPP.replace(' ', '-'),
    email: EMAIL,
    url: `${BASE_URL}/health-insurance/${city.citySlug}`,
    description: `${city.insuranceType} advisory service in ${city.cityName}${city.state ? `, ${city.state}` : ''}. IRDAI-certified advisor ${AUTHOR_NAME} provides personalized ${city.insuranceType.toLowerCase()} recommendations from 51+ insurers. Free consultation!`,
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      addressLocality: city.cityName,
      addressRegion: city.state || 'Rajasthan',
      addressCountry: 'IN',
    },
    areaServed: {
      '@type': 'City',
      name: city.cityName,
      containedIn: {
        '@type': 'State',
        name: city.state || 'Rajasthan',
      },
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '20:00',
    },
    sameAs: [
      `https://www.instagram.com/paliwalinsure`,
      `https://wa.me/919257877312`,
    ],
    parentOrganization: {
      '@id': `${BASE_URL}/#organization`,
    },
  }
}

// ============================================================================
// Vehicle Insurance Schema Generator
// ============================================================================

export interface VehiclePageSEO {
  vehicleName: string
  vehicleSlug: string
  brand: string
  category: 'car' | 'bike' | 'scooter'
  isEV: boolean
  exShowroom: number
  idv: number
}

/**
 * Generates a Product JSON-LD schema for vehicle-specific insurance pages.
 */
export function generateVehicleInsuranceSchema(vehicle: VehiclePageSEO): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${vehicle.brand} ${vehicle.vehicleName} Insurance — ${BRAND_NAME}`,
    description: `Comprehensive and third-party insurance for ${vehicle.brand} ${vehicle.vehicleName}. ${vehicle.isEV ? 'EV-specific coverage including battery protection. ' : ''}IDV: ₹${vehicle.idv.toLocaleString('en-IN')}. Zero depreciation, NCB protection, and roadside assistance available. Compare best insurers with ${BRAND_NAME}.`,
    brand: {
      '@type': 'Brand',
      name: vehicle.brand,
    },
    category: `${vehicle.category === 'car' ? 'Car' : vehicle.category === 'bike' ? 'Bike' : 'Scooter'} Insurance`,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: vehicle.category === 'car' ? '5999' : '1199',
      highPrice: vehicle.category === 'car' ? '40000' : '10000',
      offerCount: '12',
      availability: 'https://schema.org/InStock',
    },
    url: `${BASE_URL}/insurance/${vehicle.vehicleSlug}`,
    seller: {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: BRAND_NAME,
    },
  }
}

// ============================================================================
// Comparison Page Schema Generator
// ============================================================================

export interface ComparisonSEO {
  insurerA: string
  insurerB: string
  category: 'health' | 'motor'
}

/**
 * Generates a Product JSON-LD schema for insurer comparison pages.
 */
export function generateComparisonSchema(comparison: ComparisonSEO): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${comparison.insurerA} vs ${comparison.insurerB} — ${comparison.category === 'health' ? 'Health' : 'Motor'} Insurance Comparison | ${BRAND_NAME}`,
    description: `Compare ${comparison.insurerA} vs ${comparison.insurerB} ${comparison.category} insurance plans side-by-side. Claim settlement ratio, premiums, network hospitals, and features compared by IRDAI-certified advisor.`,
    category: `${comparison.category === 'health' ? 'Health' : 'Motor'} Insurance Comparison`,
    brand: {
      '@type': 'Brand',
      name: BRAND_NAME,
    },
    url: `${BASE_URL}/compare/${comparison.insurerA.toLowerCase().replace(/\s+/g, '-')}-vs-${comparison.insurerB.toLowerCase().replace(/\s+/g, '-')}`,
    seller: {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: BRAND_NAME,
    },
  }
}

// ============================================================================
// Render JSON-LD Helper
// ============================================================================

/**
 * Renders a JSON-LD schema as a script tag for use in server components.
 *
 * Usage:
 * ```tsx
 * <script
 *   type="application/ld+json"
 *   dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
 * />
 * ```
 */
export function renderJsonLdScript(schema: object): string {
  return JSON.stringify(schema)
}
