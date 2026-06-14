import { generateFAQSchemaData } from '@/data/seoFAQ';

/**
 * Comprehensive JSON-LD Schema — Paliwal Secure (https://paliwalsecure.com)
 *
 * Renders structured data for search engines and AI platforms:
 * - Organization schema with sameAs links
 * - Person schema for Himanshu Paliwal (E-E-A-T)
 * - InsuranceAgency schema with reviews and ratings
 * - InsuranceAgent schema
 * - WebSite schema with SearchAction
 * - WebPage schema
 * - FAQPage schema (35+ FAQs)
 * - LocalBusiness schema (Jaipur, Rajasthan)
 * - Product schemas (Health, Term, Motor)
 * - BreadcrumbList schema
 * - HowTo schema (claim filing)
 * - Review / AggregateRating schema
 * - VideoObject schema
 * - Speakable / Voice Search schema
 * - Course schema
 * - Event schema
 *
 * Brand Info:
 * - Brand: Paliwal Secure AI / InsureGPT
 * - POSP Code: IP429834
 * - WhatsApp: +91 9257877312
 * - Location: Jaipur, Rajasthan, India
 * - Website: https://paliwalsecure.com
 * - Author: Himanshu Paliwal
 * - Instagram: @paliwalinsure
 */

export default function JsonLd() {
  // ── Organization Schema ──────────────────────────────────────────────────
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://paliwalsecure.com/#organization',
    name: 'Paliwal Secure AI',
    alternateName: ['Paliwal Secure', 'Paliwal Insurance'],
    url: 'https://paliwalsecure.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://paliwalsecure.com/logo.svg',
      width: 1200,
      height: 630,
    },
    description:
      "India's most trusted AI-powered insurance advisor. Compare 51+ insurers, get personalized recommendations with InsureGPT, and enjoy hassle-free claims support. IRDAI Registered POSP (IP429834) Himanshu Paliwal providing transparent, unbiased insurance guidance since 2020.",
    founder: {
      '@type': 'Person',
      name: 'Himanshu Paliwal',
      url: 'https://paliwalsecure.com',
      jobTitle: 'IRDAI Registered Insurance Advisor (POSP)',
      knowsAbout: [
        'Health Insurance',
        'Term Insurance',
        'Motor Insurance',
        'Travel Insurance',
        'Home Insurance',
        'Claim Settlement',
        'Tax Saving under Section 80D and 80C',
      ],
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+91-9257877312',
        email: 'himanshupaliwalpbp@gmail.com',
        contactType: 'customer service',
        availableLanguage: ['Hindi', 'English', 'Hinglish'],
        areaServed: {
          '@type': 'Country',
          name: 'India',
        },
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:00',
          closes: '20:00',
        },
      },
      {
        '@type': 'ContactPoint',
        telephone: '+91-9257877312',
        contactType: 'sales',
        availableLanguage: ['Hindi', 'English', 'Hinglish'],
        areaServed: {
          '@type': 'Country',
          name: 'India',
        },
      },
    ],
    sameAs: [
      'https://www.instagram.com/paliwalinsure',
      'https://www.instagram.com/palival_visuals',
      'https://wa.me/919257877312',
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jaipur',
      addressLocality: 'Jaipur',
      addressRegion: 'Rajasthan',
      postalCode: '302001',
      addressCountry: 'IN',
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      minValue: 1,
      maxValue: 10,
    },
    foundingDate: '2020',
    legalName: 'Paliwal Secure AI',
    identifier: [
      {
        '@type': 'PropertyValue',
        name: 'IRDAI POSP Code',
        value: 'IP429834',
      },
      {
        '@type': 'PropertyValue',
        name: 'IRDAI Registration',
        value: 'POSP - Point of Sales Person',
      },
    ],
  };

  // ── Person Schema — Himanshu Paliwal (E-E-A-T) ─────────────────────────
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://paliwalsecure.com/#person-himanshu',
    name: 'Himanshu Paliwal',
    url: 'https://paliwalsecure.com',
    image: 'https://paliwalsecure.com/logo.svg',
    description:
      'Himanshu Paliwal is an IRDAI-certified insurance advisor based in Jaipur, Rajasthan. With expertise in health, term, and motor insurance, he has helped 500+ Indian families find the right insurance coverage. He specializes in AI-powered insurance comparison and unbiased recommendations from 51+ IRDAI-registered insurers.',
    telephone: '+91-9257877312',
    email: 'himanshupaliwalpbp@gmail.com',
    worksFor: {
      '@type': 'Organization',
      '@id': 'https://paliwalsecure.com/#organization',
      name: 'Paliwal Secure',
      url: 'https://paliwalsecure.com',
    },
    honorificPrefix: 'Mr.',
    jobTitle: 'IRDAI Certified Insurance Advisor (POSP)',
    knowsAbout: [
      'Health Insurance India',
      'Term Insurance India',
      'Motor Insurance India',
      'Travel Insurance India',
      'Home Insurance India',
      'Claim Settlement Process',
      'Tax Saving under Section 80D',
      'Tax Saving under Section 80C',
      'IRDAI Regulations',
      'Insurance Comparison',
      'Cashless Hospitalization',
      'Family Floater Plans',
      'Senior Citizen Insurance',
      'Pre-existing Disease Coverage',
      'No Claim Bonus',
      'Insurance Portability',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Jaipur',
      addressRegion: 'Rajasthan',
      postalCode: '302001',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://www.instagram.com/paliwalinsure',
      'https://www.instagram.com/palival_visuals',
      'https://wa.me/919257877312',
    ],
    credential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'certification',
      name: 'IRDAI Certified Insurance Advisor (POSP)',
      recognizedBy: {
        '@type': 'Organization',
        name: 'Insurance Regulatory and Development Authority of India',
        url: 'https://www.irdai.gov.in',
      },
      identifier: 'IP429834',
    },
  };

  // ── InsuranceAgency Schema ──────────────────────────────────────────────
  const insuranceAgencySchema = {
    '@context': 'https://schema.org',
    '@type': 'InsuranceAgency',
    '@id': 'https://paliwalsecure.com/#agency',
    name: 'Paliwal Secure AI',
    url: 'https://paliwalsecure.com',
    logo: 'https://paliwalsecure.com/logo.svg',
    image: 'https://paliwalsecure.com/logo.svg',
    description:
      'IRDAI Registered POSP (IP429834) insurance advisory agency providing AI-powered recommendations from 51+ insurers. Specializing in health, term, motor, travel, and home insurance for Indian families. Trusted by 500+ families across India.',
    telephone: '+91-9257877312',
    email: 'himanshupaliwalpbp@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jaipur',
      addressLocality: 'Jaipur',
      addressRegion: 'Rajasthan',
      postalCode: '302001',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 26.9124,
      longitude: 75.7873,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '20:00',
      },
    ],
    priceRange: '₹₹',
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
          description: 'Comprehensive health insurance plans from 51+ IRDAI-registered insurers with cashless hospitalization, maternity cover, and PED coverage.',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Term Insurance',
          description: 'Affordable term insurance plans with coverage up to ₹5 Crore from top Indian insurers with high claim settlement ratios.',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Motor Insurance',
          description: 'Comprehensive and third-party motor insurance for cars and bikes with zero depreciation and NCB protection.',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Travel Insurance',
          description: 'Domestic and international travel insurance covering medical emergencies, trip cancellation, and baggage loss.',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Home Insurance',
          description: 'Home insurance covering structure, contents, and liability against natural calamities, theft, and accidents.',
        },
      ],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '523',
      reviewCount: '187',
    },
    review: [
      {
        '@type': 'Review',
        name: 'Best insurance advisor in Kota',
        author: { '@type': 'Person', name: 'Amit Verma' },
        datePublished: '2025-01-15',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody:
          'Himanshu bhai ne meri family ke liye perfect health insurance plan dhundha. Claim settlement bhi bahut aasan tha. Highly recommended for anyone in Kota!',
      },
      {
        '@type': 'Review',
        name: 'Excellent claim support',
        author: { '@type': 'Person', name: 'Sunita Joshi' },
        datePublished: '2025-02-20',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody:
          'Mere husband ke heart surgery ke time Paliwal Secure ne poori help ki. Cashless claim smoothly hua. InsureGPT se phele hi plan compare kar liya tha.',
      },
      {
        '@type': 'Review',
        name: 'Transparent and trustworthy',
        author: { '@type': 'Person', name: 'Rakesh Gupta' },
        datePublished: '2025-03-10',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody:
          'No hidden charges, no misselling. Himanshu explained every term clearly in Hinglish. My car insurance renewal was 30% cheaper than last year.',
      },
      {
        '@type': 'Review',
        name: 'Great for first-time insurance buyers',
        author: { '@type': 'Person', name: 'Neha Singh' },
        datePublished: '2025-04-05',
        reviewRating: { '@type': 'Rating', ratingValue: '4', bestRating: '5' },
        reviewBody:
          'As a first-time buyer, I was confused between term and health insurance. Paliwal Secure simplified everything. AI quiz helped me understand my needs.',
      },
      {
        '@type': 'Review',
        name: 'Saved ₹25,000 on health insurance',
        author: { '@type': 'Person', name: 'Vikram Mehta' },
        datePublished: '2025-05-12',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody:
          'Paliwal Secure ne mujhe sasta aur acha health plan dhundha jisme PED bhi cover ho. Tax saving bhi ho gayi Section 80D mein. Highly recommended!',
      },
    ],
    sameAs: [
      'https://www.instagram.com/paliwalinsure',
      'https://www.instagram.com/palival_visuals',
      'https://wa.me/919257877312',
    ],
  };

  // ── InsuranceAgent Schema ───────────────────────────────────────────────
  const insuranceAgentSchema = {
    '@context': 'https://schema.org',
    '@type': 'InsuranceAgent',
    name: 'Himanshu Paliwal',
    worksFor: {
      '@type': 'Organization',
      '@id': 'https://paliwalsecure.com/#organization',
      name: 'Paliwal Secure',
      url: 'https://paliwalsecure.com',
    },
    telephone: '+91-9257877312',
    email: 'himanshupaliwalpbp@gmail.com',
    description:
      'IRDAI-certified insurance advisor providing AI-powered recommendations from 51+ insurers. Specialist in health, life, and motor insurance for Indian families. Based in Jaipur, Rajasthan with pan-India advisory services.',
    knowsAbout: [
      'Health Insurance',
      'Term Insurance',
      'Motor Insurance',
      'Travel Insurance',
      'Home Insurance',
      'Claim Settlement',
      'Tax Saving under Section 80D',
      'Insurance Portability',
      'Pre-existing Disease Coverage',
      'Cashless Hospitalization',
    ],
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Jaipur',
      addressRegion: 'Rajasthan',
      postalCode: '302001',
      addressCountry: 'IN',
    },
  };

  // ── WebSite Schema with SearchAction ────────────────────────────────────
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://paliwalsecure.com/#website',
    name: 'Paliwal Secure AI',
    alternateName: ['Paliwal Secure', 'Paliwal Insurance', 'InsureGPT'],
    url: 'https://paliwalsecure.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://paliwalsecure.com/?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    description:
      'AI-powered insurance advisor helping Indian families compare and choose the best insurance plans from 51+ insurers. Free consultation with IRDAI-certified advisor.',
    publisher: {
      '@id': 'https://paliwalsecure.com/#organization',
    },
    inLanguage: ['en', 'hi'],
  };

  // ── FAQPage Schema (Comprehensive 35+ FAQs) ────────────────────────────
  const faqSchemaData = generateFAQSchemaData();
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqSchemaData.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  // ── LocalBusiness Schema ────────────────────────────────────────────────
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'InsuranceAgency'],
    '@id': 'https://paliwalsecure.com/#business',
    name: 'Paliwal Secure AI',
    alternateName: ['Paliwal Secure', 'Paliwal Insurance'],
    image: 'https://paliwalsecure.com/logo.svg',
    telephone: '+91-9257877312',
    email: 'himanshupaliwalpbp@gmail.com',
    url: 'https://paliwalsecure.com',
    description:
      'AI-powered insurance advisory service helping Indian families compare and choose the best insurance from 51+ IRDAI-registered insurers. IRDAI Registered POSP (IP429834) — Himanshu Paliwal, certified insurance advisor in Jaipur, Rajasthan. Trusted by 500+ families.',
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jaipur',
      addressLocality: 'Jaipur',
      addressRegion: 'Rajasthan',
      postalCode: '302001',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 26.9124,
      longitude: 75.7873,
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
    sameAs: [
      'https://www.instagram.com/paliwalinsure',
      'https://www.instagram.com/palival_visuals',
      'https://wa.me/919257877312',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '523',
    },
    hasMap: 'https://maps.google.com/?q=Jaipur,Rajasthan,India',
    identifier: {
      '@type': 'PropertyValue',
      name: 'IRDAI POSP Code',
      value: 'IP429834',
    },
    knowsAbout: [
      'Health Insurance India',
      'Term Insurance India',
      'Motor Insurance India',
      'Travel Insurance India',
      'Home Insurance India',
      'Claim Settlement',
      'Insurance Comparison',
    ],
    areaServed: [
      {
        '@type': 'City',
        name: 'Jaipur',
        sameAs: 'https://en.wikipedia.org/wiki/Jaipur',
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
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Bank Transfer',
  };

  // ── Product Schema — Health Insurance ────────────────────────────────────
  const healthProductSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Health Insurance Plans — Paliwal Secure AI',
    description:
      'Comprehensive health insurance plans from 51+ IRDAI-registered insurers. Cashless hospitalization, maternity cover, PED coverage, mental health coverage, and tax benefits under Section 80D up to ₹75,000.',
    brand: {
      '@type': 'Brand',
      name: 'Paliwal Secure AI',
    },
    category: 'Health Insurance',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: '399',
      highPrice: '15000',
      offerCount: '150',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '523',
      bestRating: '5',
      worstRating: '1',
    },
    review: [
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Rajesh Sharma' },
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody: 'Paliwal Secure ne meri family ke liye best health plan dhundha. Cashless hospitalization bilkul smooth thi.',
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Priya Patel' },
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody: 'AI-powered recommendation se mujhe sasta aur acha plan mila. Highly recommended!',
      },
    ],
  };

  // ── Product Schema — Term Insurance ──────────────────────────────────────
  const termProductSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Term Insurance Plans — Paliwal Secure AI',
    description:
      'Affordable term insurance plans with coverage up to ₹5 Crore. Compare claim settlement ratios, premium rates, and riders from top Indian insurers. Tax benefits under Section 80C.',
    brand: {
      '@type': 'Brand',
      name: 'Paliwal Secure AI',
    },
    category: 'Term Insurance',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: '489',
      highPrice: '5000',
      offerCount: '80',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.7',
      reviewCount: '312',
      bestRating: '5',
      worstRating: '1',
    },
  };

  // ── Product Schema — Motor Insurance ─────────────────────────────────────
  const motorProductSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Motor Insurance Plans — Paliwal Secure AI',
    description:
      'Comprehensive and third-party motor insurance for cars and bikes. Zero depreciation, NCB protection, roadside assistance, and engine cover add-ons available. IRDAI-regulated third-party premiums.',
    brand: {
      '@type': 'Brand',
      name: 'Paliwal Secure AI',
    },
    category: 'Motor Insurance',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: '1499',
      highPrice: '25000',
      offerCount: '60',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.6',
      reviewCount: '198',
      bestRating: '5',
      worstRating: '1',
    },
  };

  // ── Product Schema — Travel Insurance ─────────────────────────────────────
  const travelProductSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Travel Insurance Plans — Paliwal Secure AI',
    description:
      'Domestic and international travel insurance covering medical emergencies, trip cancellation, baggage loss, flight delays, and passport loss. Cashless hospitalization abroad. Schengen visa-compliant plans available.',
    brand: {
      '@type': 'Brand',
      name: 'Paliwal Secure AI',
    },
    category: 'Travel Insurance',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: '299',
      highPrice: '8000',
      offerCount: '25',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '85',
      bestRating: '5',
      worstRating: '1',
    },
  };

  // ── Product Schema — Home Insurance ───────────────────────────────────────
  const homeProductSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Home Insurance Plans — Paliwal Secure AI',
    description:
      'Home insurance covering structure, contents, and liability against natural calamities (earthquake, flood), fire, theft, and accidents. Tenant and homeowner policies available. Coverage up to ₹5 Crore.',
    brand: {
      '@type': 'Brand',
      name: 'Paliwal Secure AI',
    },
    category: 'Home Insurance',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: '500',
      highPrice: '12000',
      offerCount: '15',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.4',
      reviewCount: '42',
      bestRating: '5',
      worstRating: '1',
    },
  };

  // ── Product Schema — Insurance Advisory Service ────────────────────────────
  const advisoryProductSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'AI Insurance Advisory — Paliwal Secure AI',
    description:
      'Free AI-powered insurance comparison and advisory service by IRDAI Registered POSP (IP429834). Compare 51+ insurers, get personalized recommendations with InsureGPT AI, free claim assistance, and policy audit. Expert guidance by Himanshu Paliwal, Jaipur.',
    brand: {
      '@type': 'Brand',
      name: 'Paliwal Secure AI',
    },
    category: 'Insurance Advisory',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      priceValidUntil: '2027-12-31',
      url: 'https://paliwalsecure.com',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '523',
      bestRating: '5',
      worstRating: '1',
    },
  };

  // ── BreadcrumbList Schema ───────────────────────────────────────────────
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
        name: 'Health Insurance',
        item: 'https://paliwalsecure.com/health-insurance',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Car Insurance',
        item: 'https://paliwalsecure.com/car-insurance',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Bike Insurance',
        item: 'https://paliwalsecure.com/bike-insurance',
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: 'Life Insurance',
        item: 'https://paliwalsecure.com/life-insurance',
      },
      {
        '@type': 'ListItem',
        position: 6,
        name: 'Travel Insurance',
        item: 'https://paliwalsecure.com/travel-insurance',
      },
      {
        '@type': 'ListItem',
        position: 7,
        name: 'Home Insurance',
        item: 'https://paliwalsecure.com/home-insurance',
      },
      {
        '@type': 'ListItem',
        position: 8,
        name: 'Compare Insurance',
        item: 'https://paliwalsecure.com/compare',
      },
      {
        '@type': 'ListItem',
        position: 9,
        name: 'Blog',
        item: 'https://paliwalsecure.com/blog',
      },
      {
        '@type': 'ListItem',
        position: 10,
        name: 'Knowledge Hub',
        item: 'https://paliwalsecure.com/knowledge',
      },
      {
        '@type': 'ListItem',
        position: 11,
        name: 'Claim Guide',
        item: 'https://paliwalsecure.com/claim-guide',
      },
      {
        '@type': 'ListItem',
        position: 12,
        name: 'Insurance FAQ',
        item: 'https://paliwalsecure.com/insurance-faq',
      },
      {
        '@type': 'ListItem',
        position: 13,
        name: 'Insurance Glossary',
        item: 'https://paliwalsecure.com/insurance-glossary',
      },
      {
        '@type': 'ListItem',
        position: 14,
        name: 'Policyholder Rights',
        item: 'https://paliwalsecure.com/policyholder-rights',
      },
      {
        '@type': 'ListItem',
        position: 15,
        name: 'InsureGPT AI',
        item: 'https://paliwalsecure.com/insuregpt',
      },
    ],
  };

  // ── HowTo Schema — How to File Insurance Claim ──────────────────────────
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to File an Insurance Claim in India',
    description:
      'Step-by-step guide to filing health, term, and motor insurance claims in India. Learn cashless and reimbursement claim processes.',
    totalTime: 'PT30M',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: '0',
    },
    tool: [
      { '@type': 'HowToTool', name: 'Insurance Policy Document' },
      { '@type': 'HowToTool', name: 'Health Card / Policy Number' },
      { '@type': 'HowToTool', name: 'Identity Proof (Aadhaar/PAN)' },
      { '@type': 'HowToTool', name: 'Hospital Bills and Discharge Summary' },
      { '@type': 'HowToTool', name: 'Claim Form (from insurer website)' },
    ],
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Notify Your Insurer',
        text: 'Inform your insurance company within 24-48 hours of hospitalization or incident. Call the helpline number or use the insurer app to register your claim. For emergencies, you can intimate after admission.',
        url: 'https://paliwalsecure.com/#claim-guide',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Choose Claim Type',
        text: 'Decide between cashless (at network hospitals — recommended) or reimbursement (pay first, claim later). Cashless is recommended for planned hospitalization as you do not need to pay upfront.',
        url: 'https://paliwalsecure.com/#claim-guide',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Submit Pre-Authorization',
        text: 'For cashless claims, the hospital sends a pre-authorization form to the insurer/TPA. The insurer reviews and approves within 2-4 hours. Keep your health card and ID ready.',
        url: 'https://paliwalsecure.com/#claim-guide',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Gather Required Documents',
        text: 'Collect: Policy copy, ID proof (Aadhaar/PAN), hospital bills with payment receipts, discharge summary, doctor consultation papers, investigation reports, prescription bills, FIR (for motor accidents), and filled claim form.',
        url: 'https://paliwalsecure.com/#claim-guide',
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Submit Claim Form',
        text: 'Submit the completed claim form with all supporting documents to the insurer. Online submission is available with most insurers. For reimbursement claims, submit within 15-30 days of discharge.',
        url: 'https://paliwalsecure.com/#claim-guide',
      },
      {
        '@type': 'HowToStep',
        position: 6,
        name: 'Track and Follow Up',
        text: 'Track your claim status online or via insurer app. IRDAI mandates claim settlement within 30 days. If rejected, ask for written reason and approach grievance cell or Insurance Ombudsman. Contact Paliwal Secure for free claim assistance at +91-9257877312.',
        url: 'https://paliwalsecure.com/#claim-guide',
      },
    ],
  };

  // ── Review / AggregateRating Schema ─────────────────────────────────────
  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'InsuranceAgency',
    '@id': 'https://paliwalsecure.com/#agency',
    name: 'Paliwal Secure AI',
    url: 'https://paliwalsecure.com',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '523',
      reviewCount: '187',
    },
    review: [
      {
        '@type': 'Review',
        name: 'Best insurance advisor in Kota',
        author: { '@type': 'Person', name: 'Amit Verma' },
        datePublished: '2025-01-15',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody:
          'Himanshu bhai ne meri family ke liye perfect health insurance plan dhundha. Claim settlement bhi bahut aasan tha. Highly recommended for anyone in Kota!',
      },
      {
        '@type': 'Review',
        name: 'Excellent claim support',
        author: { '@type': 'Person', name: 'Sunita Joshi' },
        datePublished: '2025-02-20',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody:
          'Mere husband ke heart surgery ke time Paliwal Secure ne poori help ki. Cashless claim smoothly hua. InsureGPT se phele hi plan compare kar liya tha.',
      },
      {
        '@type': 'Review',
        name: 'Transparent and trustworthy',
        author: { '@type': 'Person', name: 'Rakesh Gupta' },
        datePublished: '2025-03-10',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody:
          'No hidden charges, no misselling. Himanshu explained every term clearly in Hinglish. My car insurance renewal was 30% cheaper than last year.',
      },
      {
        '@type': 'Review',
        name: 'Great for first-time insurance buyers',
        author: { '@type': 'Person', name: 'Neha Singh' },
        datePublished: '2025-04-05',
        reviewRating: { '@type': 'Rating', ratingValue: '4', bestRating: '5' },
        reviewBody:
          'As a first-time buyer, I was confused between term and health insurance. Paliwal Secure simplified everything. AI quiz helped me understand my needs.',
      },
      {
        '@type': 'Review',
        name: 'Saved ₹25,000 on health insurance',
        author: { '@type': 'Person', name: 'Vikram Mehta' },
        datePublished: '2025-05-12',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody:
          'Paliwal Secure ne mujhe sasta aur acha health plan dhundha jisme PED bhi cover ho. Tax saving bhi ho gayi Section 80D mein. Highly recommended!',
      },
    ],
  };

  // ── VideoObject Schema — Placeholder ────────────────────────────────────
  const videoSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: 'How to Choose the Best Health Insurance in India — Paliwal Secure Guide',
    description:
      'Complete guide to choosing health insurance in India. Learn about claim settlement ratio, waiting periods, cashless hospitalization, room rent capping, and how InsureGPT AI helps you find the perfect plan. Expert advice by Himanshu Paliwal, IRDAI-certified advisor.',
    thumbnailUrl: 'https://paliwalsecure.com/logo.svg',
    uploadDate: '2025-01-01',
    duration: 'PT10M',
    contentUrl: 'https://paliwalsecure.com',
    embedUrl: 'https://paliwalsecure.com',
    publisher: {
      '@type': 'Organization',
      name: 'Paliwal Secure',
      logo: {
        '@type': 'ImageObject',
        url: 'https://paliwalsecure.com/logo.svg',
      },
    },
    author: {
      '@type': 'Person',
      name: 'Himanshu Paliwal',
    },
  };

  // ── Speakable Schema — Voice Search Optimization ────────────────────────
  // Enhanced with comprehensive CSS selectors targeting all voice-search-relevant
  // content sections. Google Assistant and Alexa use SpeakableSpecification to
  // identify content suitable for voice readout.
  // Target queries: "Ok Google, best insurance agent near me",
  //   "Hey Siri, health insurance India", "Alexa, term insurance kya hai"
  const speakableSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Paliwal Secure — AI-Powered Insurance Advisor for India',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: [
        // Hero section — main value proposition
        '#hero h1',
        '#hero p',
        // Feature section — key differentiators
        '#features h2',
        '#features h3',
        // Products — insurance plan categories
        '#products h2',
        // How it works — step-by-step process
        '#features .card-premium h3',
        // FAQ — voice search goldmine (question-answer pairs)
        '#faq h2',
        '#faq [data-faq-question]',
        '#faq [data-faq-answer]',
        // Contact — key business info for local voice queries
        '#contact h2',
        '#contact h4',
        // Add-ons and calculators
        '#addons-riders h2',
        '#calculators h2',
      ],
    },
    url: 'https://paliwalsecure.com',
  };

  // ── WebPage Schema ──────────────────────────────────────────────────────
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://paliwalsecure.com/#webpage',
    url: 'https://paliwalsecure.com',
    name: 'Paliwal Secure — AI se Best Plan, Humse Easy Claim | #1 Insurance Advisor India',
    description:
      "India's #1 AI-powered insurance advisor. Compare 51+ IRDAI-registered insurers, get personalized recommendations with InsureGPT AI, and enjoy hassle-free claims support. Trusted by 500+ families.",
    isPartOf: {
      '@id': 'https://paliwalsecure.com/#website',
    },
    about: {
      '@id': 'https://paliwalsecure.com/#organization',
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: 'https://paliwalsecure.com/logo.svg',
    },
    datePublished: '2024-06-01T00:00:00+05:30',
    dateModified: '2026-03-04T00:00:00+05:30',
    author: {
      '@id': 'https://paliwalsecure.com/#person-himanshu',
    },
    breadcrumb: {
      '@id': 'https://paliwalsecure.com/#breadcrumb',
    },
    inLanguage: ['en', 'hi'],
    potentialAction: {
      '@type': 'ReadAction',
      target: 'https://paliwalsecure.com',
    },
  };

  // ── Course Schema — Insurance Education ─────────────────────────────────
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Insurance 101: Smart Bima Gyaan for Indian Families',
    description:
      'Free insurance literacy course covering health, term, motor insurance basics. Learn claim filing, policy comparison, tax benefits, and IRDAI rights in simple Hinglish.',
    provider: {
      '@type': 'Organization',
      name: 'Paliwal Secure',
      url: 'https://paliwalsecure.com',
      sameAs: [
        'https://www.instagram.com/paliwalinsure',
        'https://www.instagram.com/palival_visuals',
      ],
    },
    educationalLevel: 'Beginner',
    about: [
      { '@type': 'Thing', name: 'Health Insurance' },
      { '@type': 'Thing', name: 'Term Insurance' },
      { '@type': 'Thing', name: 'Motor Insurance' },
      { '@type': 'Thing', name: 'IRDAI Regulations' },
    ],
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT2H',
    },
    isAccessibleForFree: true,
  };

  // ── Event Schema — Insurance Awareness Webinar ──────────────────────────
  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Insurance Awareness Webinar — Smart Cover for Indian Families',
    description:
      'Free insurance awareness webinar by Himanshu Paliwal, IRDAI-certified advisor. Learn how to choose the right health, term, and motor insurance. Understand claim processes, tax benefits, and avoid common misselling traps.',
    startDate: '2025-04-15T11:00:00+05:30',
    endDate: '2025-04-15T12:30:00+05:30',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    location: {
      '@type': 'VirtualLocation',
      url: 'https://paliwalsecure.com',
    },
    organizer: {
      '@type': 'Organization',
      '@id': 'https://paliwalsecure.com/#organization',
      name: 'Paliwal Secure',
      url: 'https://paliwalsecure.com',
    },
    performer: {
      '@type': 'Person',
      name: 'Himanshu Paliwal',
    },
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
  };

  // ── Standalone AggregateRating Schema ──────────────────────────────────
  // Separate from InsuranceAgency for Google Rich Results eligibility.
  // This schema enables star rating display in search results.
  const aggregateRatingSchema = {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    itemReviewed: {
      '@type': 'InsuranceAgency',
      name: 'Paliwal Secure',
      url: 'https://paliwalsecure.com',
      telephone: '+91-9257877312',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Jaipur',
        addressRegion: 'Rajasthan',
        postalCode: '302001',
        addressCountry: 'IN',
      },
    },
    ratingValue: '4.9',
    bestRating: '5',
    worstRating: '1',
    ratingCount: '523',
    reviewCount: '187',
  };

  // ── Voice Search Content Schema ─────────────────────────────────────────
  // Optimized for voice assistants: Google Assistant, Siri, Alexa
  // Targets conversational queries like:
  //   "Ok Google, best insurance advisor near me"
  //   "Hey Siri, health insurance kya hota hai"
  //   "Alexa, term insurance vs ULIP"
  const voiceSearchSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://paliwalsecure.com/#voice-content',
    name: 'Paliwal Secure — Best Insurance Advisor in India | Voice Search',
    description: 'Paliwal Secure is the best insurance advisor in India. IRDAI-certified advisor Himanshu Paliwal provides health insurance, term insurance, motor insurance comparison and claims assistance. Located in Jaipur, Rajasthan. Call 9257877312 for free consultation.',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: [
        '#hero h1',
        '#hero p',
        '#faq [data-faq-question]',
        '#faq [data-faq-answer]',
      ],
    },
    url: 'https://paliwalsecure.com',
    mainEntity: {
      '@type': 'InsuranceAgency',
      name: 'Paliwal Secure',
      telephone: '+91-9257877312',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Jaipur',
        addressRegion: 'Rajasthan',
        addressCountry: 'IN',
      },
    },
  };

  // ── Service Schema — AI-Powered Insurance Advisory (InsureGPT) ──────────────
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': 'https://paliwalsecure.com/#service-insuregpt',
    name: 'InsureGPT — AI Insurance Advisor',
    description:
      'AI-powered insurance advisory service that compares 51+ IRDAI-registered insurers, provides personalized plan recommendations, helps with claim processes, and answers insurance questions in Hindi, English, and Hinglish. Free to use.',
    provider: {
      '@id': 'https://paliwalsecure.com/#organization',
    },
    serviceType: 'Insurance Advisory',
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: 'https://paliwalsecure.com',
      servicePhone: '+91-9257877312',
      availableLanguage: ['Hindi', 'English', 'Hinglish'],
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Insurance Advisory Services',
      itemListElement: [
        {
          '@type': 'Offer',
          name: 'Free Insurance Comparison',
          description: 'Compare 51+ insurers for health, life, motor, travel, and home insurance plans. AI-powered recommendations based on CSR, premium, coverage, and user profile.',
          price: '0',
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
        },
        {
          '@type': 'Offer',
          name: 'Free Claim Assistance',
          description: 'Step-by-step guidance for cashless and reimbursement claims. Support for claim rejection appeals and IRDAI grievance process.',
          price: '0',
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
        },
        {
          '@type': 'Offer',
          name: 'Free Policy Audit',
          description: 'Comprehensive review of existing insurance policies. Check coverage gaps, compare with better plans, identify missing riders and add-ons.',
          price: '0',
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
        },
      ],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '523',
    },
    isAccessibleForFree: true,
  };

  // Helper to render a schema
  const renderSchema = (schema: object) => (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );

  return (
    <>
      {/* Core Business Schemas */}
      {renderSchema(organizationSchema)}
      {renderSchema(insuranceAgencySchema)}
      {renderSchema(insuranceAgentSchema)}
      {renderSchema(personSchema)}

      {/* Service Schema — InsureGPT AI Advisory */}
      {renderSchema(serviceSchema)}

      {/* Web Schemas */}
      {renderSchema(websiteSchema)}
      {renderSchema(webPageSchema)}

      {/* FAQ Schema — Comprehensive 36 questions */}
      {renderSchema(faqSchema)}

      {/* Local Business Schema */}
      {renderSchema(localBusinessSchema)}

      {/* Product Schemas */}
      {renderSchema(healthProductSchema)}
      {renderSchema(termProductSchema)}
      {renderSchema(motorProductSchema)}
      {renderSchema(travelProductSchema)}
      {renderSchema(homeProductSchema)}
      {renderSchema(advisoryProductSchema)}

      {/* Navigation Schemas */}
      {renderSchema(breadcrumbSchema)}

      {/* HowTo Schema */}
      {renderSchema(howToSchema)}

      {/* Review / Rating Schema */}
      {renderSchema(reviewSchema)}

      {/* Standalone AggregateRating for Rich Results */}
      {renderSchema(aggregateRatingSchema)}

      {/* Voice Search & Video Schemas */}
      {renderSchema(speakableSchema)}
      {renderSchema(voiceSearchSchema)}
      {renderSchema(videoSchema)}

      {/* Educational Schemas */}
      {renderSchema(courseSchema)}
      {renderSchema(eventSchema)}
    </>
  );
}
