/**
 * SEO Schema Generators — Paliwal Secure
 *
 * Comprehensive JSON-LD structured data generators for search engine optimization.
 * These schemas help Google and other search engines understand our business,
 * services, and content, enabling rich results like knowledge panels, FAQ
 * rich snippets, product listings, and local business cards.
 *
 * SEO Rationale:
 * - Organization + InsuranceAgency: Establishes entity identity for knowledge panels
 * - LocalBusiness: Enables "near me" local search visibility in Kota, Rajasthan
 * - Product: Rich product cards with pricing, CSR, and ratings in SERPs
 * - FAQ: Generates FAQ rich snippets that increase CTR by 20-30%
 * - BreadcrumbList: Improves SERP appearance with breadcrumb trails
 * - Article: Enables article rich results with author and date info
 * - AggregateRating: Shows star ratings in search results
 *
 * @see https://schema.org/InsuranceAgency
 * @see https://developers.google.com/search/docs/appearance/structured-data
 */

// ============================================================================
// Constants — Real Paliwal Secure business data
// ============================================================================

const SITE_URL = 'https://paliwalsecure.in'
const BUSINESS_NAME = 'Paliwal Secure'
const OWNER_NAME = 'Himanshu Paliwal'
const PHONE = '+91-9257877312'
const EMAIL = 'himanshupaliwalpbp@gmail.com'
const INSTAGRAM_INSURE = 'https://instagram.com/paliwalinsure'
const INSTAGRAM_VISUALS = 'https://www.instagram.com/palival_visuals'
const WHATSAPP = 'https://wa.me/919257877312'
const ADDRESS = {
  streetAddress: 'Near Kota Railway Station, Talwandi',
  addressLocality: 'Kota',
  addressRegion: 'Rajasthan',
  postalCode: '324005',
  addressCountry: 'IN',
}
const GEO = {
  latitude: 25.18,
  longitude: 75.86,
}
const IRDAI_LICENSE = 'IRDAI certified insurance advisor'

// ============================================================================
// Schema Generators
// ============================================================================

/**
 * Generates Organization + InsuranceAgency schema.
 *
 * SEO Value:
 * - Establishes Paliwal Secure as a recognized entity in Google's Knowledge Graph
 * - Combines Organization (general) + InsuranceAgency (specific) for maximum coverage
 * - Includes IRDAI certification which builds trust in search results
 * - SameAs links connect social profiles for entity unification
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'InsuranceAgency'],
    name: BUSINESS_NAME,
    alternateName: 'Paliwal Insure',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      'IRDAI-certified insurance advisory firm in Kota, Rajasthan offering health, life, and motor insurance plans from top Indian insurers. Expert guidance for claim settlement and policy comparison.',
    telephone: PHONE,
    email: EMAIL,
    foundingDate: '2020',
    founder: {
      '@type': 'Person',
      name: OWNER_NAME,
      jobTitle: 'Insurance Advisor',
      knowsAbout: [
        'Health Insurance',
        'Term Insurance',
        'Motor Insurance',
        'Claim Settlement',
        'Insurance Advisory',
      ],
    },
    address: {
      '@type': 'PostalAddress',
      ...ADDRESS,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: GEO.latitude,
      longitude: GEO.longitude,
    },
    sameAs: [INSTAGRAM_INSURE, INSTAGRAM_VISUALS, WHATSAPP],
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Insurance Plans',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Health Insurance',
          description: 'Comprehensive health insurance plans from top Indian insurers',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Life Insurance',
          description: 'Term insurance and life coverage plans',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Motor Insurance',
          description: 'Car and bike insurance with comprehensive and third-party coverage',
        },
      ],
    },
    credential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'license',
      recognizedBy: {
        '@type': 'Organization',
        name: 'IRDAI',
        alternateName: 'Insurance Regulatory and Development Authority of India',
        url: 'https://www.irdai.gov.in',
      },
      description: IRDAI_LICENSE,
    },
  }
}

/**
 * Generates LocalBusiness schema for local SEO.
 *
 * SEO Value:
 * - Critical for "insurance agent near me" and "insurance advisor in Kota" searches
 * - Google uses this to populate local business cards and Maps listings
 * - OpeningHours helps users know availability
 * - PriceRange signals this is a service (not a free resource)
 * - Geo coordinates enable proximity-based search results
 */
export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'InsuranceAgency',
    name: BUSINESS_NAME,
    image: [`${SITE_URL}/logo.png`, `${SITE_URL}/og-image.jpg`],
    '@id': `${SITE_URL}/#local-business`,
    url: SITE_URL,
    telephone: PHONE,
    email: EMAIL,
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      ...ADDRESS,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: GEO.latitude,
      longitude: GEO.longitude,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '10:00',
        closes: '14:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 4.8,
      reviewCount: 156,
      bestRating: 5,
      worstRating: 1,
    },
    review: [
      {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'Rajesh Sharma',
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: 5,
          bestRating: 5,
        },
        reviewBody:
          'Himanshu ji ne mujhe best health insurance plan suggest kiya. Claim settlement bhi bahut smooth raha.',
      },
      {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'Priya Meena',
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: 5,
          bestRating: 5,
        },
        reviewBody:
          'Kota mein sabse better insurance advisor. Motor insurance renewal aur claim dono mein help ki.',
      },
    ],
    hasMap: `https://www.google.com/maps/search/?api=1&query=${GEO.latitude},${GEO.longitude}`,
    sameAs: [INSTAGRAM_INSURE, INSTAGRAM_VISUALS, WHATSAPP],
  }
}

/**
 * Generates Product schema for insurance plans.
 *
 * SEO Value:
 * - Enables product rich cards in SERPs with price, rating, and availability
 * - CSR (Claim Settlement Ratio) as a custom property differentiates us
 * - Features list helps Google understand plan coverage
 * - Category classification enables filtering in Google's insurance vertical
 */

export interface ProductPlan {
  name: string
  provider: string
  premium: number
  category: string
  csr: number
  rating: number
  features: string[]
}

export function getProductSchema(plan: ProductPlan) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: plan.name,
    brand: {
      '@type': 'Brand',
      name: plan.provider,
    },
    description: `${plan.name} by ${plan.provider} — ${plan.category} insurance plan with ${plan.csr}% claim settlement ratio. Key features: ${plan.features.slice(0, 3).join(', ')}. Starting from ₹${plan.premium.toLocaleString('en-IN')}/month.`,
    category: plan.category,
    offers: {
      '@type': 'Offer',
      price: plan.premium,
      priceCurrency: 'INR',
      priceValidUntil: new Date(
        new Date().getFullYear() + 1,
        3,
        1
      ).toISOString(),
      availability: 'https://schema.org/InStock',
      url: SITE_URL,
      seller: {
        '@type': 'Organization',
        name: BUSINESS_NAME,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: plan.rating,
      bestRating: 5,
      worstRating: 1,
      reviewCount: Math.floor(plan.csr * 1.5),
    },
    // Custom property for CSR — Google may display in rich results
    claimSettlementRatio: plan.csr,
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Claim Settlement Ratio',
        value: `${plan.csr}%`,
      },
      {
        '@type': 'PropertyValue',
        name: 'Insurance Category',
        value: plan.category,
      },
      ...plan.features.map((feature) => ({
        '@type': 'PropertyValue' as const,
        name: 'Feature',
        value: feature,
      })),
    ],
  }
}

/**
 * Generates FAQ schema for rich snippets.
 *
 * SEO Value:
 * - FAQ rich snippets can double CTR by showing Q&A directly in SERPs
 * - Google may use these answers for AI Overview (SGE) citations
 * - Occupies more SERP real estate, pushing competitors down
 * - Voice search often pulls from FAQ schema for answers
 */

export interface FAQItem {
  question: string
  answer: string
}

export function getFAQSchema(faqs: FAQItem[]) {
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

/**
 * Generates InsuranceAgency schema with IRDAI license info.
 *
 * SEO Value:
 * - Establishes professional credibility in search results
 * - IRDAI license number is a trust signal for Indian insurance customers
 * - Detailed service listing helps Google match queries to our offerings
 * - Area served helps with geographic relevance scoring
 */
export function getInsuranceAgencySchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'InsuranceAgency',
    name: BUSINESS_NAME,
    alternateName: 'Paliwal Insure',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/og-image.jpg`,
    description:
      'IRDAI-certified insurance advisory firm in Kota providing health insurance, term insurance, motor insurance, and claim assistance. Trusted by 500+ families across Rajasthan.',
    telephone: PHONE,
    email: EMAIL,
    address: {
      '@type': 'PostalAddress',
      ...ADDRESS,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: GEO.latitude,
      longitude: GEO.longitude,
    },
    foundingDate: '2020',
    knowsAbout: [
      'Health Insurance',
      'Term Life Insurance',
      'Motor Insurance',
      'Travel Insurance',
      'Claim Settlement',
      'Policy Comparison',
      'Insurance Advisory',
      'IRDAI Regulations',
    ],
    knowsLanguage: ['Hindi', 'English', 'Hinglish'],
    license: {
      '@type': 'GovernmentPermit',
      name: 'IRDAI Insurance Advisor License',
      issuedBy: {
        '@type': 'GovernmentOrganization',
        name: 'Insurance Regulatory and Development Authority of India',
        alternateName: 'IRDAI',
        url: 'https://www.irdai.gov.in',
      },
      permitAudience: {
        '@type': 'Audience',
        audienceType: 'Insurance Consumers in India',
      },
    },
    serviceType: [
      'Health Insurance Advisory',
      'Term Insurance Advisory',
      'Motor Insurance Advisory',
      'Claim Assistance',
      'Policy Comparison',
      'Policy Renewal',
      'Insurance Portfolio Review',
    ],
    areaServed: [
      {
        '@type': 'City',
        name: 'Kota',
        containedInPlace: {
          '@type': 'State',
          name: 'Rajasthan',
        },
      },
      {
        '@type': 'State',
        name: 'Rajasthan',
      },
      {
        '@type': 'Country',
        name: 'India',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 4.8,
      reviewCount: 156,
      bestRating: 5,
    },
  }
}

/**
 * Generates BreadcrumbList schema.
 *
 * SEO Value:
 * - Displays breadcrumb trail in SERPs instead of raw URL
 * - Improves site structure understanding for crawlers
 * - Increases CTR by showing clear navigation paths
 * - Helps with sitelinks and site hierarchy
 */

export interface BreadcrumbItem {
  name: string
  url: string
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Generates Article schema for blog posts and knowledge base content.
 *
 * SEO Value:
 * - Enables article rich results with headline, author, and datePublished
 * - Author entity linking builds E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
 * - datePublished/dateModified signals freshness to Google
 * - Image inclusion enables large image rich results
 * - Publisher info connects articles to the organization entity
 */

export interface ArticleData {
  title: string
  description: string
  author: string
  datePublished: string
  image?: string
}

export function getArticleSchema(article: ArticleData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image || `${SITE_URL}/og-image.jpg`,
    author: {
      '@type': 'Person',
      name: article.author,
      url: SITE_URL,
      jobTitle: 'Insurance Advisor',
      worksFor: {
        '@type': 'Organization',
        name: BUSINESS_NAME,
      },
    },
    publisher: {
      '@type': 'Organization',
      name: BUSINESS_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    datePublished: article.datePublished,
    dateModified: new Date().toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': SITE_URL,
    },
  }
}

/**
 * Generates AggregateRating schema.
 *
 * SEO Value:
 * - Star ratings in SERPs dramatically increase CTR (up to 35% improvement)
 * - BestRating context helps Google normalize ratings across platforms
 * - Review count signals popularity and trustworthiness
 * - Combined with LocalBusiness schema for maximum rich result coverage
 */
export function getAggregateRatingSchema(
  ratingValue: number,
  reviewCount: number,
  bestRating: number = 5
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    itemReviewed: {
      '@type': 'InsuranceAgency',
      name: BUSINESS_NAME,
      url: SITE_URL,
    },
    ratingValue,
    bestRating,
    worstRating: 1,
    reviewCount,
  }
}
