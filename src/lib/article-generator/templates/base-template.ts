// ============================================================================
// Base Article Template — shared interface and common sections
// ============================================================================

export interface ArticleSection {
  heading: string;
  content: string;
}

export interface ArticleFAQ {
  question: string;
  answer: string;
}

export interface ArticleContent {
  title: string;
  quickAnswer: string;
  sections: ArticleSection[];
  faqs: ArticleFAQ[];
  expertInsight: string;
  cta: string;
}

export interface ArticleMetadata {
  metaDescription: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  schemaMarkup: Record<string, unknown>;
  internalLinks: string[];
}

// ── Common sections used across all templates ───────────────────────────────

export function getDisclaimerSection(): ArticleSection {
  return {
    heading: 'Important Disclaimer',
    content: `This article is for informational purposes only and does not constitute financial or insurance advice. Insurance products are subject to terms and conditions of the respective insurer. Please read the policy document carefully before purchase.\n\n**IRDAI POSP Disclosure:** This content is published by Himanshu Paliwal, IRDAI-licensed POSP (Point of Sale Person), POSP Code: IP429834. For personalized advice, please consult with a licensed insurance advisor.\n\n⚠️ Insurance is the subject matter of solicitation.`,
  };
}

export function getAuthorBox(): ArticleSection {
  return {
    heading: 'About the Author',
    content: `**Himanshu Paliwal** is an IRDAI-licensed POSP (Point of Sale Person) with Code IP429834, based in Kota, Rajasthan. He specializes in helping Indian families choose the right insurance coverage — health, motor, life, and travel.\n\n- 🏢 Paliwal Secure — AI-Powered Insurance Advisory\n- 📱 WhatsApp: +91 9257877312\n- 🔗 [paliwalsecure.in](https://paliwalsecure.in)\n- ✅ IRDAI POSP Code: IP429834`,
  };
}

export function getCTA(): string {
  return `**Need help choosing the right insurance?** 🛡️\n\nChat with InsureGPT — your AI insurance advisor — or WhatsApp us directly at **+91 9257877312** for personalized recommendations.\n\n👉 [Get Your Free Insurance Quote](https://paliwalsecure.in) | [Chat on WhatsApp](https://wa.me/919257877312)`;
}

export function getBaseInternalLinks(category: string): string[] {
  const commonLinks = [
    '/claim-guide',
    '/insurance-faq',
    '/insurance-glossary',
    '/policyholder-rights',
  ];

  const categoryLinks: Record<string, string[]> = {
    health: ['/health-insurance', '/best-health-insurance-india', '/family-health-insurance', '/cashless-claim-guide'],
    motor: ['/car-insurance', '/car-insurance-renewal', '/zero-dep-car-insurance', '/bike-insurance'],
    life: ['/life-insurance'],
    claim: ['/claim-guide', '/cashless-claim-guide'],
    regulation: ['/insurance-faq', '/policyholder-rights'],
    general: ['/health-insurance', '/car-insurance', '/life-insurance'],
  };

  return [...(categoryLinks[category] || categoryLinks.general), ...commonLinks];
}

export function generateBaseSchema(title: string, slug: string, category: string, faqs: ArticleFAQ[]): Record<string, unknown> {
  const schemas: Record<string, unknown> = {
    article: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      author: {
        '@type': 'Person',
        name: 'Himanshu Paliwal',
        jobTitle: 'IRDAI Licensed POSP',
        identifier: 'IP429834',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Paliwal Secure',
        url: 'https://paliwalsecure.in',
      },
      url: `https://paliwalsecure.in/blog/${slug}`,
      mainEntityOfPage: `https://paliwalsecure.in/blog/${slug}`,
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      inLanguage: 'en-IN',
    },
    breadcrumb: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://paliwalsecure.in' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://paliwalsecure.in/blog' },
        { '@type': 'ListItem', position: 3, name: title, item: `https://paliwalsecure.in/blog/${slug}` },
      ],
    },
  };

  // Add FAQPage schema if FAQs exist
  if (faqs.length > 0) {
    schemas.faqPage = {
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
    };
  }

  return schemas;
}
