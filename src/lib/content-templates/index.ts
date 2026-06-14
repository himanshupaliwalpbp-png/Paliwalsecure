// ═══════════════════════════════════════════════════════════════════════════════
// Content Template System — Reusable SEO Article Structures
// ═══════════════════════════════════════════════════════════════════════════════
// Generates SEO-optimized article structures for each insurance category.
// Each template includes: H1, TOC, Key Takeaway, Comparison Table, FAQ,
// Author Bio, IRDAI Disclaimer, Related Articles, WhatsApp CTA
// ═══════════════════════════════════════════════════════════════════════════════

import type { Language } from '@/lib/i18n-strings';

// ── Core Types ─────────────────────────────────────────────────────────────

export interface SEOTemplateConfig {
  slug: string;
  category: 'health' | 'term' | 'motor' | 'claim' | 'education';
  primaryKeyword: string;
  relatedSlugs: string[];
}

export interface FAQItem {
  q: Record<Language, string>;
  a: Record<Language, string>;
}

export interface ComparisonRow {
  label: Record<Language, string>;
  values: string[];
}

export interface TakeawayItem {
  icon: string;
  text: Record<Language, string>;
}

export interface ArticleSection {
  id: string;
  heading: Record<Language, string>;
  content: Record<Language, string>;
}

// ── JSON-LD Generators ─────────────────────────────────────────────────────

export function generateFAQSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}

export function generateArticleSchema(config: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified: string;
  imageUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: config.title,
    description: config.description,
    url: `https://paliwalsecure.in/${config.slug}`,
    datePublished: config.datePublished,
    dateModified: config.dateModified,
    author: {
      '@type': 'Person',
      name: 'Himanshu Paliwal',
      jobTitle: 'IRDAI Certified Insurance Advisor',
      url: 'https://paliwalsecure.in',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Paliwal Secure',
      logo: {
        '@type': 'ImageObject',
        url: 'https://paliwalsecure.in/logo.png',
      },
    },
    image: config.imageUrl || 'https://paliwalsecure.in/og-image.jpg',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://paliwalsecure.in/${config.slug}`,
    },
  };
}

export function generateHowToSchema(config: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: config.name,
    description: config.description,
    step: config.steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

// ── IRDAI Mandatory Disclaimer ─────────────────────────────────────────────

export const irdaiDisclaimer: Record<Language, string> = {
  en: 'IRDAI Mandatory Disclaimer: Insurance is the subject matter of solicitation. This content is for educational purposes only and does not constitute financial advice. Please consult a certified insurance advisor before making any purchase decision. Paliwal Secure is an IRDAI-registered POSP (Code: IP429834).',
  hi: 'IRDAI अनिवार्य अस्वीकरण: बीमा सौदे का विषय है। यह सामग्री केवल शैक्षिक उद्देश्यों के लिए है और वित्तीय सलाह नहीं है। कृपया कोई भी खरीदारी करने से पहले एक प्रमाणित बीमा सलाहकार से परामर्श लें। पालीवाल सिक्योर एक IRDAI-पंजीकृत POSP (कोड: IP429834) है।',
  hinglish: 'IRDAI Mandatory Disclaimer: Insurance solicitation ka subject hai. Ye content sirf educational purpose ke liye hai aur financial advice nahi hai. Please koi bhi purchase karne se pehle certified insurance advisor se consult karein. Paliwal Secure ek IRDAI-registered POSP (Code: IP429834) hai.',
};

// ── Related Article Links ──────────────────────────────────────────────────

export interface RelatedArticle {
  slug: string;
  title: Record<Language, string>;
}

export const relatedArticlesMap: Record<string, RelatedArticle[]> = {
  'health': [
    { slug: '/room-rent-limit-health-insurance', title: { en: 'Room Rent Limit in Health Insurance', hi: 'हेल्थ इंश्योरेंस में रूम रेंट लिमिट', hinglish: 'Room Rent Limit in Health Insurance' } },
    { slug: '/co-pay-meaning-health-insurance', title: { en: 'Co-Pay Meaning in Health Insurance', hi: 'हेल्थ इंश्योरेंस में को-पे का अर्थ', hinglish: 'Co-Pay Meaning in Health Insurance' } },
    { slug: '/health-insurance-waiting-period', title: { en: 'Health Insurance Waiting Period', hi: 'हेल्थ इंश्योरेंस वेटिंग पीरियड', hinglish: 'Health Insurance Waiting Period' } },
    { slug: '/cashless-vs-reimbursement-claim', title: { en: 'Cashless vs Reimbursement Claim', hi: 'कैशलेस बनाम रिम्बर्समेंट क्लेम', hinglish: 'Cashless vs Reimbursement Claim' } },
    { slug: '/best-health-insurance-india', title: { en: 'Best Health Insurance India 2026', hi: 'भारत का सर्वश्रेष्ठ हेल्थ इंश्योरेंस 2026', hinglish: 'Best Health Insurance India 2026' } },
    { slug: '/family-floater-vs-individual-health-insurance', title: { en: 'Family Floater vs Individual', hi: 'फैमिली फ्लोटर बनाम इंडिविजुअल', hinglish: 'Family Floater vs Individual' } },
    { slug: '/health-insurance-mistakes', title: { en: 'Health Insurance Mistakes to Avoid', hi: 'हेल्थ इंश्योरेंस की गलतियाँ', hinglish: 'Health Insurance Mistakes' } },
  ],
  'term': [
    { slug: '/best-term-insurance-india', title: { en: 'Best Term Insurance India 2026', hi: 'भारत का सर्वश्रेष्ठ टर्म इंश्योरेंस 2026', hinglish: 'Best Term Insurance India 2026' } },
    { slug: '/1-crore-term-insurance', title: { en: '₹1 Crore Term Insurance', hi: '₹1 करोड़ टर्म इंश्योरेंस', hinglish: '₹1 Crore Term Insurance' } },
    { slug: '/claim-settlement-ratio', title: { en: 'Claim Settlement Ratio Explained', hi: 'क्लेम सेटलमेंट रेश्यो', hinglish: 'Claim Settlement Ratio Explained' } },
    { slug: '/term-insurance-riders', title: { en: 'Best Riders in Term Insurance', hi: 'टर्म इंश्योरेंस में सर्वश्रेष्ठ राइडर', hinglish: 'Best Riders in Term Insurance' } },
  ],
  'motor': [
    { slug: '/zero-dep-car-insurance', title: { en: 'Zero Dep Car Insurance', hi: 'ज़ीरो डेप कार इंश्योरेंस', hinglish: 'Zero Dep Car Insurance' } },
    { slug: '/idv-calculation', title: { en: 'IDV Calculation Guide', hi: 'IDV गणना गाइड', hinglish: 'IDV Calculation Guide' } },
    { slug: '/ncb-meaning', title: { en: 'NCB Meaning Explained', hi: 'NCB का अर्थ', hinglish: 'NCB Meaning Explained' } },
    { slug: '/third-party-vs-comprehensive', title: { en: 'Third Party vs Comprehensive', hi: 'थर्ड पार्टी बनाम कॉम्प्रिहेंसिव', hinglish: 'Third Party vs Comprehensive' } },
    { slug: '/car-insurance', title: { en: 'Car Insurance Guide', hi: 'कार इंश्योरेंस गाइड', hinglish: 'Car Insurance Guide' } },
  ],
  'claim': [
    { slug: '/how-to-file-health-insurance-claim', title: { en: 'How to File Health Insurance Claim', hi: 'हेल्थ इंश्योरेंस क्लेम कैसे करें', hinglish: 'How to File Health Claim' } },
    { slug: '/claim-rejection-reasons', title: { en: 'Claim Rejection Reasons', hi: 'क्लेम अस्वीकृति के कारण', hinglish: 'Claim Rejection Reasons' } },
    { slug: '/cashless-vs-reimbursement-claim', title: { en: 'Cashless vs Reimbursement', hi: 'कैशलेस बनाम रिम्बर्समेंट', hinglish: 'Cashless vs Reimbursement' } },
    { slug: '/claim-settlement-ratio', title: { en: 'Claim Settlement Ratio', hi: 'क्लेम सेटलमेंट रेश्यो', hinglish: 'Claim Settlement Ratio' } },
  ],
  'education': [
    { slug: '/insurance-mistakes-to-avoid', title: { en: 'Insurance Mistakes to Avoid', hi: 'बीमा की गलतियाँ जो बचनी चाहिए', hinglish: 'Insurance Mistakes to Avoid' } },
    { slug: '/health-insurance-hindi', title: { en: 'Health Insurance Hindi Guide', hi: 'हेल्थ इंश्योरेंस हिंदी गाइड', hinglish: 'Health Insurance Hindi Guide' } },
    { slug: '/insurance-glossary-hindi', title: { en: 'Insurance Glossary Hindi', hi: 'बीमा शब्दावली हिंदी', hinglish: 'Insurance Glossary Hindi' } },
  ],
};

// ── WhatsApp CTA Link ──────────────────────────────────────────────────────

export function getWhatsAppCTA(customMessage?: string): string {
  const msg = customMessage || 'Hi Himanshu! I need help with insurance. Can you guide me?';
  return `https://wa.me/919257877312?text=${encodeURIComponent(msg)}`;
}
