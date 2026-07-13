// ── Structured Data (JSON-LD Schemas) for Paliwal Secure AI ─────────────────
// Generates schema.org markup for Organization, LocalBusiness, Product, FAQ,
// WebSite (with SearchAction), and BreadcrumbList

interface SchemaType {
  type: 'organization' | 'localBusiness' | 'product' | 'faq' | 'breadcrumb' | 'website';
  data?: Record<string, unknown>;
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://paliwalsecure.in/#organization',
  name: 'Paliwal Secure AI',
  alternateName: ['InsureGPT', 'Paliwal Insurance', 'Paliwal Secure'],
  url: 'https://paliwalsecure.in',
  logo: 'https://paliwalsecure.in/logo.svg',
  description:
    "India's #1 AI-powered insurance advisor. Compare 51+ IRDAI-registered insurers, get personalized recommendations with InsureGPT AI, hassle-free claims support & save up to ₹75,000 under Section 80D.",
  founder: {
    '@type': 'Person',
    name: 'Himanshu Paliwal',
    jobTitle: 'IRDAI Registered POSP',
    identifier: 'IP429834',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kota',
    addressRegion: 'Rajasthan',
    postalCode: '324001',
    addressCountry: 'IN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-9257877312',
    contactType: 'customer service',
    availableLanguage: ['English', 'Hindi', 'Hinglish'],
  },
  sameAs: [
    'https://twitter.com/PaliwalSecureAI',
    'https://linkedin.com/company/paliwal-secure-ai',
    'https://instagram.com/paliwalinsure',
    'https://youtube.com/@PaliwalSecureAI',
  ],
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://paliwalsecure.in/#localbusiness',
  name: 'Paliwal Secure AI — Insurance Advisor',
  image: 'https://paliwalsecure.in/logo.svg',
  url: 'https://paliwalsecure.in',
  telephone: '+91-9257877312',
  email: 'himanshupaliwalpbp@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Near MBS Hospital, Kota',
    addressLocality: 'Kota',
    addressRegion: 'Rajasthan',
    postalCode: '324001',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 25.18,
    longitude: 75.8648,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
    opens: '09:00',
    closes: '20:00',
  },
  priceRange: '₹₹',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '500',
  },
  areaServed: [
    { '@type': 'City', name: 'Kota' },
    { '@type': 'State', name: 'Rajasthan' },
    { '@type': 'Country', name: 'India' },
  ],
};

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Paliwal Secure AI — Insurance Comparison & Advisory',
  description:
    'AI-powered insurance comparison tool for Indian families. Compare health, motor, life, and travel insurance from 51+ IRDAI-registered insurers. Free consultation available.',
  brand: { '@type': 'Brand', name: 'Paliwal Secure AI' },
  image: 'https://paliwalsecure.in/logo.svg',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
    availability: 'https://schema.org/InStock',
    url: 'https://paliwalsecure.in',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '500',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the best health insurance in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The best health insurance depends on your needs — age, family size, pre-existing conditions, and budget. Star Health Comprehensive, HDFC ERGO Optima Secure, and Care Health Advantage are top choices. Use Paliwal Secure AI to compare 51+ insurers instantly for free.',
      },
    },
    {
      '@type': 'Question',
      name: 'How to file an insurance claim in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For cashless claims: visit a network hospital → show health card → hospital coordinates with insurer. For reimbursement: collect all bills → fill claim form → submit to insurer within 30 days. Paliwal Secure AI provides free claim assistance — call 9257877312.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is claim settlement ratio (CSR) in insurance?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CSR is the percentage of claims an insurer settles out of total claims received. A CSR above 90% is considered good. Star Health has 87% CSR, HDFC ERGO 92%, LIC 98.6%. Always check CSR before buying insurance.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much term insurance coverage do I need?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Financial experts recommend term insurance coverage of 10-15 times your annual income. For ₹5L annual income, get ₹50-75L coverage. Premium starts from ₹500/month for ₹1Cr coverage. Compare plans on Paliwal Secure AI.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I get health insurance with pre-existing diseases like diabetes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! IRDAI mandates that all health insurance must cover pre-existing diseases after a maximum waiting period of 3 years (reduced from 4 years in 2024). Some plans offer Day 1 cover for diabetes and hypertension. Star Health Diabetes Safe and Care Health Supreme are popular options.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is zero depreciation car insurance?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Zero depreciation (zero dep) car insurance means the insurer pays the full cost of repairs without deducting depreciation on parts. It costs 15-20% more than comprehensive but saves ₹10,000-50,000 per claim. Highly recommended for cars under 5 years old.',
      },
    },
    {
      '@type': 'Question',
      name: 'How to save tax under Section 80D with health insurance?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Under Section 80D: Self/family health insurance premium up to ₹25,000 (₹50,000 for senior citizens) is deductible. Parents health insurance: additional ₹25,000 (₹50,000 if senior citizens). Preventive health check-up: up to ₹5,000. Maximum total deduction: ₹1,00,000.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Paliwal Secure AI a registered insurance advisor?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Paliwal Secure AI is operated by Himanshu Paliwal, an IRDAI Registered POSP (Point of Sales Person) with certification code IP429834. All insurance products sold through us are from IRDAI-registered insurers. Free consultation available — call 9257877312.',
      },
    },
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://paliwalsecure.in/#website',
  name: 'Paliwal Secure AI',
  alternateName: ['InsureGPT', 'Paliwal Insurance', 'Paliwal Secure'],
  url: 'https://paliwalsecure.in',
  description:
    "India's #1 AI-powered insurance advisor. Compare 51+ IRDAI-registered insurers, get personalized recommendations with InsureGPT AI.",
  inLanguage: ['en-IN', 'hi-IN'],
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://paliwalsecure.in/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
  publisher: {
    '@id': 'https://paliwalsecure.in/#organization',
  },
};

// Default homepage breadcrumb
const defaultBreadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://paliwalsecure.in',
    },
  ],
};

export default function StructuredData({ type, data }: SchemaType) {
  const schema = (() => {
    switch (type) {
      case 'organization':
        return organizationSchema;
      case 'localBusiness':
        return localBusinessSchema;
      case 'product':
        return productSchema;
      case 'faq':
        return faqSchema;
      case 'website':
        return websiteSchema;
      case 'breadcrumb':
        return data && Object.keys(data).length > 0
          ? {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: data.itemListElement || defaultBreadcrumbSchema.itemListElement,
            }
          : defaultBreadcrumbSchema;
      default:
        return organizationSchema;
    }
  })();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
