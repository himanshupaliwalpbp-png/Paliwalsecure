// ============================================================================
// Paliwal Secure — Auto Article Generator
// Generates complete markdown articles with SEO-optimized content
// Supports template types: vehicle-insurance, health-insurance, claim-guide, news, glossary
// ============================================================================

import { blogPosts } from '@/lib/blog-data';
import { checkIRDAICompliance } from '@/lib/article-generator';

// ── Types ───────────────────────────────────────────────────────────────────

export type ArticleTemplateType =
  | 'vehicle-insurance'
  | 'health-insurance'
  | 'claim-guide'
  | 'news'
  | 'glossary';

export interface AutoArticleInput {
  /** Title of the article */
  title: string;
  /** URL-friendly slug */
  slug: string;
  /** Template type to use for generation */
  templateType: ArticleTemplateType;
  /** Category from blogCategories */
  category: string;
  /** Category name in Hindi */
  categoryHindi: string;
  /** Brief description / excerpt (150-160 chars for SEO) */
  description: string;
  /** Keywords for SEO */
  keywords: string[];
  /** Optional vehicle/trend-specific data */
  vehicleData?: VehicleData;
  /** Optional trend-specific data */
  trendData?: TrendData;
  /** Author name (default: "Himanshu Paliwal") */
  author?: string;
  /** Date string (default: today) */
  date?: string;
  /** Image path (default: "/blog/{slug}.jpg") */
  image?: string;
  /** Whether to auto-publish or keep as draft */
  autoPublish?: boolean;
}

export interface VehicleData {
  make?: string;
  model?: string;
  variant?: string;
  year?: number;
  fuelType?: 'PETROL' | 'DIESEL' | 'CNG' | 'ELECTRIC' | 'HYBRID';
  exShowroomPrice?: number;
  idv?: number;
  tpPremium?: number;
  comprehensivePremium?: number;
  zeroDepAddOn?: number;
  topInsurers?: Array<{
    name: string;
    premium: number;
    claimSettlement: string;
    specialFeature: string;
  }>;
}

export interface TrendData {
  source?: string;
  sourceUrl?: string;
  summary?: string;
  keyChanges?: string[];
  effectiveDate?: string;
}

export interface GeneratedMarkdownArticle {
  slug: string;
  title: string;
  frontmatter: Record<string, unknown>;
  markdown: string;
  category: string;
  categoryHindi: string;
  keywords: string[];
  wordCount: number;
  readTime: string;
  complianceChecked: boolean;
  complianceIssues: string[];
  internalLinks: string[];
  jsonLdSuggestion: Record<string, unknown>;
}

// ── Helper Functions ────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function today(): string {
  return new Date().toISOString().split('T')[0];
}

function calculateReadTime(wordCount: number): string {
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min read`;
}

/**
 * Find related blog posts for internal linking based on category and keywords
 */
function findRelatedPosts(
  category: string,
  keywords: string[],
  excludeSlug: string,
  limit: number = 5
): Array<{ slug: string; title: string }> {
  const scored = blogPosts
    .filter((p) => p.slug !== excludeSlug)
    .map((post) => {
      let score = 0;
      // Category match
      if (post.category === category) score += 3;
      // Keyword overlap
      const overlap = post.keywords.filter((k) =>
        keywords.some((kw) => kw.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(kw.toLowerCase()))
      );
      score += overlap.length;
      return { ...post, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map((p) => ({ slug: p.slug, title: p.title }));
}

/**
 * Build JSON-LD structured data for the article
 */
function buildJsonLd(
  title: string,
  slug: string,
  description: string,
  date: string,
  templateType: ArticleTemplateType,
  faqs: Array<{ question: string; answer: string }>
): Record<string, unknown> {
  const baseUrl = 'https://paliwalsecure.in';

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': templateType === 'news' ? 'NewsArticle' : 'Article',
    headline: title,
    description: description,
    author: {
      '@type': 'Person',
      name: 'Himanshu Paliwal',
      jobTitle: 'IRDAI Licensed POSP',
      identifier: 'IP429834',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Paliwal Secure',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    url: `${baseUrl}/blog/${slug}`,
    mainEntityOfPage: `${baseUrl}/blog/${slug}`,
    datePublished: date,
    dateModified: date,
    inLanguage: 'en-IN',
  };

  // Add FAQ schema
  if (faqs.length > 0) {
    const faqSchema: Record<string, unknown> = {
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
    return { article: schema, faqPage: faqSchema };
  }

  return { article: schema };
}

// ── Template: Vehicle Insurance ─────────────────────────────────────────────

function generateVehicleInsuranceArticle(input: AutoArticleInput): GeneratedMarkdownArticle {
  const v = input.vehicleData || {};
  const vehicleName = [v.make, v.model, v.variant].filter(Boolean).join(' ') || input.title;
  const year = v.year || new Date().getFullYear();
  const fuelType = v.fuelType || 'PETROL';
  const isEV = fuelType === 'ELECTRIC';
  const date = input.date || today();
  const author = input.author || 'Himanshu Paliwal';
  const image = input.image || `/blog/${input.slug}.jpg`;

  const tpPremium = v.tpPremium || (isEV ? 4800 : 6000);
  const compPremium = v.comprehensivePremium || (isEV ? 10500 : 12000);
  const zeroDep = v.zeroDepAddOn || Math.round(compPremium * 0.2);
  const exShowroom = v.exShowroomPrice || 800000;
  const idv = v.idv || Math.round(exShowroom * 0.75);

  const faqs = [
    {
      question: `${vehicleName} ka insurance kitne ka aata hai?`,
      answer: `${vehicleName} ka third-party premium ₹${tpPremium.toLocaleString('en-IN')} se shuru hota hai, aur comprehensive policy ₹${compPremium.toLocaleString('en-IN')}/year mein mil jayegi. Zero dep add-on ₹${zeroDep.toLocaleString('en-IN')} extra lagega. Premium IDV, city, aur NCB pe depend karta hai.`,
    },
    {
      question: `${vehicleName} ke liye comprehensive ya third-party — kya lein?`,
      answer: `Agar aapki ${vehicleName} ka IDV ₹${idv.toLocaleString('en-IN')} hai, toh comprehensive policy lena smart hai — apne damage bhi cover hoga. Third-party sirf dusre ki damage cover karta hai. 3 saal se purani car ho toh third-party bhi consider kar sakte hain.`,
    },
    {
      question: `${vehicleName} insurance renewal kaise karein online?`,
      answer: `${vehicleName} insurance renewal 5 minute mein online ho jata hai: 1) PaliwalSecure.in pe jayen, 2) Registration number daalen, 3) Quotes compare karein, 4) Payment karein. NCB transfer automatically ho jayega. Expired policy 90 din tak renew ho sakti hai.`,
    },
    {
      question: `${vehicleName} mein kaun se add-ons zaroori hain?`,
      answer: `${isEV ? 'Battery cover sabse zaroori hai EV ke liye (₹500-₹2,000 extra), ' : ''}Zero depreciation (₹${zeroDep.toLocaleString('en-IN')}), Engine Protect, aur Roadside Assistance — ye teen add-ons sabse value for money hain. RTI (Return to Invoice) bhi agar naye vehicle ho toh consider karein.`,
    },
    {
      question: `${vehicleName} ke liye NCB kitna bachata hai?`,
      answer: `NCB (No Claim Bonus) aapke premium ka 20% se 50% tak bachata hai: 1 saal claim-free = 20%, 2 saal = 25%, 3 saal = 35%, 4 saal = 45%, 5+ saal = 50%. NCB protector add-on se claim ke baad bhi NCB safe rehta hai.`,
    },
  ];

  const topInsurers = v.topInsurers || [
    { name: 'Tata AIG', premium: compPremium, claimSettlement: '98.2%', specialFeature: 'Quick claim settlement' },
    { name: 'ICICI Lombard', premium: compPremium + 500, claimSettlement: '97.8%', specialFeature: 'Wide network' },
    { name: 'Bajaj Allianz', premium: compPremium - 300, claimSettlement: '97.5%', specialFeature: 'Digital claims' },
    { name: 'HDFC ERGO', premium: compPremium + 800, claimSettlement: '97.1%', specialFeature: 'Cashless garages' },
    { name: 'Digit Insurance', premium: compPremium - 500, claimSettlement: '97.3%', specialFeature: 'Custom IDV' },
  ];

  const markdown = `---
title: "${input.title}"
date: "${date}"
author: "${author}"
slug: "${input.slug}"
keywords: ${JSON.stringify(input.keywords)}
description: "${input.description}"
image: "${image}"
---

## Key Takeaway

${vehicleName} ${year} ka insurance ₹${tpPremium.toLocaleString('en-IN')}/year (third-party) se shuru hota hai. Comprehensive policy ₹${compPremium.toLocaleString('en-IN')}/year mein milegi, zero depreciation add-on ke saath ₹${(compPremium + zeroDep).toLocaleString('en-IN')}/year. ${isEV ? 'IRDAI ke green discount ke karan EV ka premium 15-20% kam hota hai. Battery cover add-on zaroor lena — battery replacement ₹50,000 se ₹3 Lakh tak ho sakti hai.' : 'IDV ₹' + idv.toLocaleString('en-IN') + ' ke hisaab se premium calculate hota hai. NCB se upar 50% tak discount milta hai.'}

## ${vehicleName} Insurance Premium & Coverage

${vehicleName} ${year} ke liye insurance premium kai factors pe depend karta hai — IDV, city, age, claim history, aur add-ons. Yahan hum aapko complete breakdown de rahe hain:

### Premium Breakdown

| Coverage Type | Premium Range | What's Covered |
|---|---|---|
| Third-Party Only | ₹${tpPremium.toLocaleString('en-IN')}/year | Dusre ki damage/liability (IRDAI fixed) |
| Comprehensive | ₹${compPremium.toLocaleString('en-IN')}/year | TP + Apne vehicle ka damage |
| Zero Dep Add-on | +₹${zeroDep.toLocaleString('en-IN')}/year | Depreciation deduct nahi hoga |
| ${isEV ? 'Battery Cover' : 'Engine Protect'} | +₹${isEV ? '800' : '1,200'}/year | ${isEV ? 'Battery degradation & damage' : 'Engine damage cover'} |
| Roadside Assistance | +₹${isEV ? '400' : '500'}/year | Towing, flat tyre, fuel delivery |
| Return to Invoice | +₹${Math.round(idv * 0.02).toLocaleString('en-IN')}/year | Total loss mein invoice value |

## ${vehicleName} Insurance Comparison Table

| Insurance Company | Premium (Comp.) | Claim Settlement | ${isEV ? 'Battery Cover' : 'Special Feature'} | Best For |
|---|---|---|---|---|
${topInsurers.map((ins) => `| ${ins.name} | ₹${ins.premium.toLocaleString('en-IN')}/yr | ${ins.claimSettlement} | ${ins.specialFeature} | ${ins.name === 'Digit Insurance' ? 'Budget conscious' : ins.name === 'Tata AIG' ? 'Quick claims' : 'Overall value'} |`).join('\n')}

> **Pro Tip**: Kam premium nahi, claim settlement ratio aur network garages dekhke insurer choose karein. PaliwalSecure.in pe 15+ insurers compare karein — FREE!

## ${vehicleName} ke liye Zaroori Add-Ons

### 1. Zero Depreciation (Zero Dep)
Sabse popular add-on — claim pe depreciation deduct nahi hota. ${isEV ? 'EV ke liye battery zero dep alag se check karein — standard zero dep mein battery exclude hoti hai.' : 'Nayi car ke liye MUST hai — 5 saal tak available rehta hai.'}

### 2. ${isEV ? 'Battery Cover' : 'Engine Protect'}
${isEV ? 'Battery replacement cost ₹50,000 se ₹3 Lakh — battery cover add-on se ye risk covered hota hai. Battery degradation (70% capacity se neeche) bhi cover hoga.' : 'Monsoon mein waterlogging se engine damage — ₹30,000-₹1,50,000 repair bill. Engine protect add-on ₹1,200-₹2,000 mein ye risk cover karta hai.'}

### 3. NCB Protector
Ek claim ke baad bhi NCB safe rehta hai. ₹${Math.round(compPremium * 0.03).toLocaleString('en-IN')}/year mein upar 50% NCB protect — bahut value for money!

### 4. Return to Invoice (RTI)
Total loss ya theft mein aapko invoice value milta hai, IDV nahi. ${isEV ? '' : 'Nayi car ke liye strongly recommended — '}₹${Math.round(idv * 0.02).toLocaleString('en-IN')}/year mein mental peace.

## ${vehicleName} Insurance Claim Process

1. **Immediate Action**: Accident ke baad 24-48 hours mein insurer ko inform karein
2. **FIR**: Serious accident ya theft mein FIR zaroori hai
3. **Documentation**: Photos, RC copy, driving license, claim form
4. **Surveyor Visit**: Insurance surveyor vehicle inspect karega
5. **Repair Approval**: Cashless garage mein direct approval; reimbursement mein bills save karein
6. **Settlement**: Cashless mein insurer directly pay karta hai; reimbursement mein 7-15 days

> **IRDAI Rule**: 2024 se cashless claims mein 1-hour approval aur 3-hour discharge timeline mandatory hai. Bima Bharosa portal pe complaint bhi file kar sakte hain.

## ${vehicleName} Insurance Renewal Tips

- ✅ Har renewal se pehle 3-4 insurers compare karein
- ✅ NCB certificate preserve karein — insurer change karne par bhi transfer hota hai
- ✅ IDV negotiate karein — kam IDV = kam premium lekin claim mein loss
- ✅ Add-ons review karein — vehicle age ke hisaab se add-ons adjust karein
- ❌ Expired policy se 90 din baad NCB khatam — time pe renew karein

## FAQs

${faqs.map((faq) => `### ${faq.question}\n\n${faq.answer}`).join('\n\n')}

## Expert Advice

**Himanshu Paliwal** (IRDAI POSP Code: IP429834): "${vehicleName} ke liye comprehensive policy with zero dep lena smart choice hai. ${isEV ? 'EV ke liye battery cover add-on bilkul zaroori hai — battery cost sabse biggest risk hai.' : 'Premium bachane ke liye NCB aur voluntary deductible ka combination use karein.'} PaliwalSecure.in pe free comparison karein aur WhatsApp pe personalized advice lein."

---

*By ${author} — IRDAI Certified POSP Insurance Advisor (POSP Code: IP429834). For personalized advice, [WhatsApp us](https://wa.me/919257877312) or chat with [InsureGPT](/insuregpt).*

⚠️ Insurance is the subject matter of solicitation. This article is for informational purposes only.
`;

  const wordCount = markdown.split(/\s+/).filter(Boolean).length;
  const compliance = checkIRDAICompliance(markdown);
  const relatedPosts = findRelatedPosts(input.category, input.keywords, input.slug);
  const jsonLd = buildJsonLd(input.title, input.slug, input.description, date, input.templateType, faqs);

  return {
    slug: input.slug,
    title: input.title,
    frontmatter: {
      title: input.title,
      date,
      author,
      slug: input.slug,
      keywords: input.keywords,
      description: input.description,
      image,
    },
    markdown: compliance.sanitizedContent,
    category: input.category,
    categoryHindi: input.categoryHindi,
    keywords: input.keywords,
    wordCount,
    readTime: calculateReadTime(wordCount),
    complianceChecked: true,
    complianceIssues: compliance.violations,
    internalLinks: relatedPosts.map((p) => `/blog/${p.slug}`),
    jsonLdSuggestion: jsonLd,
  };
}

// ── Template: Health Insurance ──────────────────────────────────────────────

function generateHealthInsuranceArticle(input: AutoArticleInput): GeneratedMarkdownArticle {
  const date = input.date || today();
  const author = input.author || 'Himanshu Paliwal';
  const image = input.image || `/blog/${input.slug}.jpg`;

  const faqs = [
    {
      question: `${input.title} mein kya kya cover hota hai?`,
      answer: `Standard health insurance mein hospitalization, surgery, day-care procedures, pre/post hospitalization (30/60 days), ambulance charges covered hote hain. Specific coverage policy ke terms pe depend karta hai — policy document zaroor padhein.`,
    },
    {
      question: `Health insurance ka waiting period kya hota hai?`,
      answer: `Initial waiting period: 30 days, Pre-existing diseases: 24-48 months, Specific diseases: 1-2 years. Portability karne par waiting period credits transfer hote hain.`,
    },
    {
      question: `Section 80D mein kitna tax benefit milta hai?`,
      answer: `Self + family: ₹25,000 (below 60), ₹50,000 (60+). Parents ke liye alag: ₹25,000 (below 60), ₹50,000 (60+). Preventive health check-up: ₹5,000. Total maximum: ₹1,00,000.`,
    },
    {
      question: `Cashless claim kaise karein?`,
      answer: `1) Network hospital mein admit karein, 2) Insurance card ya e-card dikhayein, 3) Pre-authorization form fill karein, 4) Insurer 1 hour mein approve karega (IRDAI mandate), 5) Discharge ke 3 hours ke andar settlement.`,
    },
    {
      question: `Room rent limit kya hai aur kyun important hai?`,
      answer: `Room rent limit aapke room category decide karta hai. Agar limit se zyada ka room lein, toh poora bill proportionally cut hota hai — sirf room nahi, doctor fees, surgery sab kam refund milega. No sub-limit wali policy choose karein.`,
    },
  ];

  const markdown = `---
title: "${input.title}"
date: "${date}"
author: "${author}"
slug: "${input.slug}"
keywords: ${JSON.stringify(input.keywords)}
description: "${input.description}"
image: "${image}"
---

## Key Takeaway

${input.description} Health insurance premium ₹3,000-₹25,000/year mein mil jayega, sum insured aur age ke hisaab se. Section 80D ke under upar ₹75,000 tak tax benefit bhi milta hai.

## ${input.title}

India mein health insurance bahut important hai — medical inflation 14% se zyada hai, aur 700 million+ Indians uninsured ya underinsured hain. ${input.category} ke liye sahi plan choose karna bahut zaroori hai.

### Key Points

1. **Medical inflation 14%** — har saal treatment cost badhta hai, insurance bina insurance mein ₹5-₹25 Lakh ka bill aa sakta hai
2. **Cashless claims ab faster** — IRDAI ne 1-hour approval aur 3-hour discharge mandatory kiya hai
3. **Section 80D tax benefit** — upar ₹75,000 tak deduction claim kar sakte hain
4. **Waiting period samjho** — initial 30 days, PED 24-48 months, specific diseases 1-2 years
5. **Corporate cover enough nahi** — job gaya, insurance gaya — personal health insurance zaroor rakhein

## Premium Comparison Table

| Sum Insured | Age 25-35 | Age 35-45 | Age 45-55 | Age 55+ |
|---|---|---|---|---|
| ₹5 Lakh | ₹3,000-₹5,000 | ₹5,000-₹8,000 | ₹8,000-₹15,000 | ₹15,000-₹25,000 |
| ₹10 Lakh | ₹4,000-₹7,000 | ₹7,000-₹12,000 | ₹12,000-₹20,000 | ₹20,000-₹35,000 |
| ₹25 Lakh | ₹6,000-₹10,000 | ₹10,000-₹18,000 | ₹18,000-₹30,000 | ₹30,000-₹50,000 |
| ₹1 Crore (Super Top-Up) | ₹2,500-₹4,000 | ₹4,000-₹6,000 | ₹6,000-₹10,000 | ₹10,000-₹18,000 |

> **Pro Tip**: Base plan ₹10 Lakh + Super Top-Up ₹1 Crore = ₹6,000-₹13,000/year mein complete protection!

## What's Covered and What's Not

### ✅ Covered (Inclusions)
- Hospitalization expenses (room, surgery, medicines)
- Day-care procedures (cataract, dialysis, etc.)
- Pre-hospitalization (30 days) & Post-hospitalization (60 days)
- Ambulance charges (up to ₹2,000-₹5,000)
- AYUSH treatment (Ayurveda, Yoga, Unani, Siddha, Homeopathy)
- Organ donor expenses
- Domiciliary hospitalization

### ❌ Not Covered (Exclusions)
- Cosmetic surgery (unless reconstructive)
- Dental treatment (unless due to accident)
- Self-inflicted injuries
- War/nuclear risks
- Experimental treatments
- Maternity (unless separate cover)
- Pre-existing diseases (during waiting period)

## Cashless vs Reimbursement Claims

| Feature | Cashless | Reimbursement |
|---|---|---|
| Payment | Insurer directly pays | You pay first, then claim |
| Hospital | Network hospital only | Any hospital |
| Approval | 1 hour (IRDAI mandate) | 7-15 days processing |
| Paperwork | Minimal | All bills & reports needed |
| Best For | Planned & emergency | Non-network emergencies |

## Section 80D Tax Benefits

| Category | Deduction Limit |
|---|---|
| Self + Family (below 60) | ₹25,000 |
| Self + Family (60+) | ₹50,000 |
| Parents (below 60) | ₹25,000 |
| Parents (60+) | ₹50,000 |
| Preventive Health Check-up | ₹5,000 |
| **Maximum Total** | **₹1,00,000** |

## FAQs

${faqs.map((faq) => `### ${faq.question}\n\n${faq.answer}`).join('\n\n')}

## Expert Advice

**Himanshu Paliwal** (IRDAI POSP Code: IP429834): "Health insurance sabse pehle buy karna chahiye — medical emergency kisi bhi time aa sakti hai. Base plan + Super Top-Up ka combination sabse smart choice hai. PaliwalSecure.in pe free comparison karein."

---

*By ${author} — IRDAI Certified POSP Insurance Advisor (POSP Code: IP429834). For personalized advice, [WhatsApp us](https://wa.me/919257877312) or chat with [InsureGPT](/insuregpt).*

⚠️ Insurance is the subject matter of solicitation. This article is for informational purposes only.
`;

  const wordCount = markdown.split(/\s+/).filter(Boolean).length;
  const compliance = checkIRDAICompliance(markdown);
  const relatedPosts = findRelatedPosts(input.category, input.keywords, input.slug);
  const jsonLd = buildJsonLd(input.title, input.slug, input.description, date, input.templateType, faqs);

  return {
    slug: input.slug,
    title: input.title,
    frontmatter: {
      title: input.title,
      date,
      author,
      slug: input.slug,
      keywords: input.keywords,
      description: input.description,
      image,
    },
    markdown: compliance.sanitizedContent,
    category: input.category,
    categoryHindi: input.categoryHindi,
    keywords: input.keywords,
    wordCount,
    readTime: calculateReadTime(wordCount),
    complianceChecked: true,
    complianceIssues: compliance.violations,
    internalLinks: relatedPosts.map((p) => `/blog/${p.slug}`),
    jsonLdSuggestion: jsonLd,
  };
}

// ── Template: Claim Guide ───────────────────────────────────────────────────

function generateClaimGuideArticle(input: AutoArticleInput): GeneratedMarkdownArticle {
  const date = input.date || today();
  const author = input.author || 'Himanshu Paliwal';
  const image = input.image || `/blog/${input.slug}.jpg`;

  const faqs = [
    {
      question: `Insurance claim kaise file karein?`,
      answer: `Claim file karne ke liye: 1) Insurer ko 24-48 hours mein inform karein, 2) Required documents collect karein (FIR, bills, reports), 3) Claim form fill karein, 4) Surveyor inspection (motor claims), 5) Approval ke baad settlement. Cashless mein insurer directly pay karta hai.`,
    },
    {
      question: `Claim reject hone ke main reasons kya hain?`,
      answer: `Top rejection reasons: 1) Wrong information declaration, 2) Waiting period mein claim, 3) Excluded treatment, 4) Delayed intimation, 5) Policy lapse. Honest declaration aur time pe intimation se claim rejection avoid ho sakti hai.`,
    },
    {
      question: `Cashless claim mein kitna time lagta hai?`,
      answer: `IRDAI ke naye rules ke hisaab se: 1-hour mein pre-authorization approve hona chahiye, aur discharge ke 3 hours ke andar final settlement hona chahiye. Agar delay ho toh Bima Bharosa portal pe complaint karein.`,
    },
    {
      question: `Claim rejection ke baad kya karein?`,
      answer: `3 options hain: 1) Insurer ki grievance cell mein complaint, 2) IRDAI Bima Bharosa portal pe online complaint (free, lawyer nahi chahiye), 3) Insurance Ombudsman (₹30 Lakh tak cases). Ombudsman 3 months mein decision deta hai.`,
    },
    {
      question: `Reimbursement claim mein kya documents chahiye?`,
      answer: `Original bills, discharge summary, doctor prescription, lab reports, FIR (accident cases), payment receipts, bank details, aur claim form. Sab documents ke copy apne paas rakhein.`,
    },
  ];

  const markdown = `---
title: "${input.title}"
date: "${date}"
author: "${author}"
slug: "${input.slug}"
keywords: ${JSON.stringify(input.keywords)}
description: "${input.description}"
image: "${image}"
---

## Key Takeaway

${input.description} IRDAI ke naye rules ke hisaab se cashless claims 1-hour mein approve hone chahiye, discharge 3 hours mein hona chahiye. Agar claim reject ho toh Bima Bharosa portal (free) ya Insurance Ombudsman (₹30 Lakh tak) se complaint karein.

## ${input.title}

Insurance claim process samajhna bahut zaroori hai — kyunki claim rejection se aapke premiums waste ho jaate hain. Yahan hum aapko complete step-by-step guide de rahe hain.

### Claim Process Timeline

| Step | Cashless | Reimbursement |
|---|---|---|
| Intimation | Immediately | Within 48-72 hours |
| Pre-auth Approval | 1 hour (IRDAI) | N/A |
| Treatment | At network hospital | Any hospital |
| Document Submission | Minimal | All original bills |
| Final Settlement | 3 hours (discharge) | 7-15 days |

## Step-by-Step Claim Process

### Step 1: Intimate Your Insurer
Accident ya hospitalization ke baad **immediately** insurer ko inform karein. Phone, app, ya email se intimation kar sakte hain. 24-48 hours ke andar intimation zaroori hai — late intimation se claim reject ho sakti hai.

### Step 2: Document Collection
- **Health claims**: Discharge summary, bills, reports, prescription
- **Motor claims**: FIR, photos, RC, driving license, repair estimate
- **Travel claims**: Boarding pass, passport copy, bills, police report

### Step 3: Surveyor / Pre-Authorization
- **Cashless**: Network hospital pre-auth form fill karega → insurer 1 hour mein approve
- **Motor**: Surveyor vehicle inspect karega → repair estimate approve

### Step 4: Treatment / Repair
- **Cashless**: Insurer directly hospital/ko pay karega
- **Motor cashless**: Network garage mein repair, insurer directly pay

### Step 5: Settlement
- **Cashless**: Discharge ke 3 hours mein (IRDAI mandate)
- **Reimbursement**: Bills submit ke 7-15 days mein refund

## Common Claim Mistakes to Avoid

| ❌ Mistake | ✅ What to Do Instead |
|---|---|
| Late intimation | Immediately inform insurer |
| Wrong information in proposal | Honest declaration from day 1 |
| Non-network hospital (cashless) | Check network hospital list |
| Missing documents | Keep all originals safe |
| Not reading policy terms | Understand exclusions before buying |
| Ignading claim settlement ratio | Check CSR before choosing insurer |

## FAQs

${faqs.map((faq) => `### ${faq.question}\n\n${faq.answer}`).join('\n\n')}

## Expert Advice

**Himanshu Paliwal** (IRDAI POSP Code: IP429834): "Claim process pehle se samajh lein — emergency mein confusion nahi hona chahiye. Honest declaration aur time pe intimation se 90%+ claims smoothly settle ho jaate hain. PaliwalSecure.in pe free claim guidance lein."

---

*By ${author} — IRDAI Certified POSP Insurance Advisor (POSP Code: IP429834). For personalized advice, [WhatsApp us](https://wa.me/919257877312) or chat with [InsureGPT](/insuregpt).*

⚠️ Insurance is the subject matter of solicitation. This article is for informational purposes only.
`;

  const wordCount = markdown.split(/\s+/).filter(Boolean).length;
  const compliance = checkIRDAICompliance(markdown);
  const relatedPosts = findRelatedPosts(input.category, input.keywords, input.slug);
  const jsonLd = buildJsonLd(input.title, input.slug, input.description, date, input.templateType, faqs);

  return {
    slug: input.slug,
    title: input.title,
    frontmatter: {
      title: input.title,
      date,
      author,
      slug: input.slug,
      keywords: input.keywords,
      description: input.description,
      image,
    },
    markdown: compliance.sanitizedContent,
    category: input.category,
    categoryHindi: input.categoryHindi,
    keywords: input.keywords,
    wordCount,
    readTime: calculateReadTime(wordCount),
    complianceChecked: true,
    complianceIssues: compliance.violations,
    internalLinks: relatedPosts.map((p) => `/blog/${p.slug}`),
    jsonLdSuggestion: jsonLd,
  };
}

// ── Template: News ──────────────────────────────────────────────────────────

function generateNewsArticle(input: AutoArticleInput): GeneratedMarkdownArticle {
  const date = input.date || today();
  const author = input.author || 'Himanshu Paliwal';
  const image = input.image || `/blog/${input.slug}.jpg`;
  const trend = input.trendData || {};

  const faqs = [
    {
      question: `Ye change kab se effective hai?`,
      answer: trend.effectiveDate
        ? `Ye change ${trend.effectiveDate} se effective hai. Naye rules ke hisaab se apna policy review karein aur zaroori changes karein.`
        : `IRDAI ke guidelines ke hisaab se ye change recently effective hua hai. Apna policy document check karein aur naye rules ke hisaab se review karein.`,
    },
    {
      question: `Kya mujhe apni policy change karni chahiye?`,
      answer: `Naye rules ke hisaab se apni existing policy review zaroor karein. Agar aapki policy mein naye benefits automatically add ho gaye hain toh change ki zaroorat nahi, lekin agar naye rules se better coverage mile toh portability consider karein.`,
    },
    {
      question: `Bima Bharosa portal pe complaint kaise karein?`,
      answer: `Bima Bharosa portal (bimabharosa.irdai.gov.in) pe online complaint file karein — FREE hai, lawyer nahi chahiye. Complaint number milega, 30 days mein response aana chahiye. Agar satisfied nahi ho toh Ombudsman se contact karein.`,
    },
    {
      question: `Kya purani policy mein ye changes apply honge?`,
      answer: `IRDAI ke most guidelines existing policies pe bhi apply hote hain, lekin kuch rules sirf naye policies pe lagu hote hain. Apne insurer se confirm karein ya PaliwalSecure.in pe free consultation lein.`,
    },
    {
      question: `Insurance advisor se baat karni chahiye?`,
      answer: `Haan, naye rules ke baad apna insurance portfolio review karwana smart move hai. IRDAI-licensed POSP se personalized advice lein — WhatsApp pe +91 9257877312 pe free consultation available hai.`,
    },
  ];

  const markdown = `---
title: "${input.title}"
date: "${date}"
author: "${author}"
slug: "${input.slug}"
keywords: ${JSON.stringify(input.keywords)}
description: "${input.description}"
image: "${image}"
---

## Key Takeaway

${input.description} ${trend.summary || 'IRDAI ke naye guidelines ka direct impact policyholders pe hoga — apni policy review karein aur zaroori changes karein.'}

## What Happened?

${trend.summary || input.description}

${trend.keyChanges ? `### Key Changes\n\n${trend.keyChanges.map((change, i) => `${i + 1}. ${change}`).join('\n')}` : ''}

## Impact on Policyholders

Ye change ka direct impact Indian insurance policyholders pe hoga. Ab insurance products mein zyada transparency hogi, claim process faster hoga, aur policyholders ke rights stronger honge.

| Before | After |
|---|---|
| Slow claim processing | 1-hour cashless approval (IRDAI) |
| Limited grievance options | Bima Bharosa portal (free complaint) |
| Hidden charges | Transparent premium breakdown |
| Complex policy terms | Simplified wording mandatory |

## What You Should Do Now

1. **Review your existing policy** — naye rules ke hisaab se coverage check karein
2. **Check for new benefits** — automatically add hua hai ya nahi
3. **Compare plans** — naye rules ke baad better plans available hain
4. **Port if needed** — agar current insurer naye benefits nahi de raha toh switch karein
5. **Stay informed** — PaliwalSecure.in pe latest insurance news padhein

## Important Dates

${trend.effectiveDate ? `- **Effective Date**: ${trend.effectiveDate}` : '- Check IRDAI website for specific effective dates'}
- **Complaint Deadline**: No deadline — Bima Bharosa portal pe anytime complaint kar sakte hain
- **Free Look Period**: Policy ke 15 days ke andar cancel kar sakte hain

## FAQs

${faqs.map((faq) => `### ${faq.question}\n\n${faq.answer}`).join('\n\n')}

## Expert Advice

**Himanshu Paliwal** (IRDAI POSP Code: IP429834): "IRDAI ke naye changes policyholders ke liye positive hain. Apni policy review zaroor karein — naye rules se better coverage mil sakti hai. PaliwalSecure.in pe free comparison karein."

---

*By ${author} — IRDAI Certified POSP Insurance Advisor (POSP Code: IP429834). For personalized advice, [WhatsApp us](https://wa.me/919257877312) or chat with [InsureGPT](/insuregpt).*

⚠️ Insurance is the subject matter of solicitation. This article is for informational purposes only.
`;

  const wordCount = markdown.split(/\s+/).filter(Boolean).length;
  const compliance = checkIRDAICompliance(markdown);
  const relatedPosts = findRelatedPosts(input.category, input.keywords, input.slug);
  const jsonLd = buildJsonLd(input.title, input.slug, input.description, date, input.templateType, faqs);

  return {
    slug: input.slug,
    title: input.title,
    frontmatter: {
      title: input.title,
      date,
      author,
      slug: input.slug,
      keywords: input.keywords,
      description: input.description,
      image,
    },
    markdown: compliance.sanitizedContent,
    category: input.category,
    categoryHindi: input.categoryHindi,
    keywords: input.keywords,
    wordCount,
    readTime: calculateReadTime(wordCount),
    complianceChecked: true,
    complianceIssues: compliance.violations,
    internalLinks: relatedPosts.map((p) => `/blog/${p.slug}`),
    jsonLdSuggestion: jsonLd,
  };
}

// ── Template: Glossary ──────────────────────────────────────────────────────

function generateGlossaryArticle(input: AutoArticleInput): GeneratedMarkdownArticle {
  const date = input.date || today();
  const author = input.author || 'Himanshu Paliwal';
  const image = input.image || `/blog/${input.slug}.jpg`;

  const faqs = [
    {
      question: `Insurance ke sabse important terms kaun se hain?`,
      answer: `Sabse important terms hain: Premium (aapka payment), Sum Insured (maximum coverage), Deductible (aapka share), Waiting Period (coverage shuru hone ka time), NCB (claim-free discount), IDV (vehicle ki value). Ye terms samajhna policy choose karne ke liye zaroori hai.`,
    },
    {
      question: `Hindi mein insurance terms kahan padh sakte hain?`,
      answer: `PaliwalSecure.in ke glossary page pe 25+ insurance terms Hindi/Hinglish mein explain hain. Har term ke saath example aur practical tip bhi diya gaya hai.`,
    },
    {
      question: `Deductible aur Co-payment mein kya fark hai?`,
      answer: `Deductible fixed amount hai jo har claim mein aapko pay karna padta hai (e.g., ₹5,000). Co-payment percentage hai — agar 20% co-pay hai aur bill ₹1 Lakh hai, toh aap ₹20,000 pay kareinge. Dono premium kam karte hain lekin out-of-pocket expense badhate hain.`,
    },
  ];

  const markdown = `---
title: "${input.title}"
date: "${date}"
author: "${author}"
slug: "${input.slug}"
keywords: ${JSON.stringify(input.keywords)}
description: "${input.description}"
image: "${image}"
---

## Key Takeaway

${input.description} Insurance terms Hindi/Hinglish mein samajhna bahut zaroori hai — kyunki policy document mein ye terms aate hain aur galat samajhne se claim rejection ho sakti hai.

## ${input.title}

Insurance documents mein bahut technical terms aate hain. Inhe samajhna zaroori hai kyunki policy choose karte time, claim karte time, aur policy renewal karte time — har jagah ye terms aate hain.

### Important Insurance Terms (Hindi/Hinglish)

| English Term | Hindi | Meaning |
|---|---|---|
| Premium | प्रीमियम | Aapka periodic payment (monthly/yearly) |
| Sum Insured | बीमा राशि | Maximum coverage amount |
| Deductible | कटौती | Aapka fixed share har claim mein |
| Co-payment | सह-भुगतान | Aapka percentage share bill mein |
| Waiting Period | प्रतीक्षा अवधि | Coverage shuru hone ka time |
| NCB | नो क्लेम बोनस | Claim-free discount (20-50%) |
| IDV | बीमित घोषित मूल्य | Vehicle ki insured value |
| CSR | क्लेम सेटलमेंट रेश्यो | Claims settle karne ka percentage |
| PED | पूर्व-मौजूदा बीमारी | Pehle se existing disease |
| Cashless | कैशलेस | Direct insurer payment |
| Reimbursement | प्रतिपूर्ति | Pehle khud pay, phir refund |
| TP | थर्ड पार्टी | Dusre ki damage cover |
| Comprehensive | कम्प्रिहेंसिव | TP + apne damage dono |
| Rider / Add-on | राइडर | Extra coverage option |
| Free Look Period | फ्री लुक पीरियड | 15 days cancellation window |

## FAQs

${faqs.map((faq) => `### ${faq.question}\n\n${faq.answer}`).join('\n\n')}

## Expert Advice

**Himanshu Paliwal** (IRDAI POSP Code: IP429834): "Insurance terms samajhna policy choose karne ka pehla step hai. Koi bhi term na samajh aaye toh humse poochein — WhatsApp pe free guidance available hai."

---

*By ${author} — IRDAI Certified POSP Insurance Advisor (POSP Code: IP429834). For personalized advice, [WhatsApp us](https://wa.me/919257877312) or chat with [InsureGPT](/insuregpt).*

⚠️ Insurance is the subject matter of solicitation. This article is for informational purposes only.
`;

  const wordCount = markdown.split(/\s+/).filter(Boolean).length;
  const compliance = checkIRDAICompliance(markdown);
  const relatedPosts = findRelatedPosts(input.category, input.keywords, input.slug);
  const jsonLd = buildJsonLd(input.title, input.slug, input.description, date, input.templateType, faqs);

  return {
    slug: input.slug,
    title: input.title,
    frontmatter: {
      title: input.title,
      date,
      author,
      slug: input.slug,
      keywords: input.keywords,
      description: input.description,
      image,
    },
    markdown: compliance.sanitizedContent,
    category: input.category,
    categoryHindi: input.categoryHindi,
    keywords: input.keywords,
    wordCount,
    readTime: calculateReadTime(wordCount),
    complianceChecked: true,
    complianceIssues: compliance.violations,
    internalLinks: relatedPosts.map((p) => `/blog/${p.slug}`),
    jsonLdSuggestion: jsonLd,
  };
}

// ── Main: Auto Article Generator ────────────────────────────────────────────

/**
 * Generate a complete markdown article from input data.
 * Selects the appropriate template based on `templateType`.
 */
export function generateAutoArticle(input: AutoArticleInput): GeneratedMarkdownArticle {
  // Ensure slug is valid
  if (!input.slug) {
    input.slug = slugify(input.title);
  }

  switch (input.templateType) {
    case 'vehicle-insurance':
      return generateVehicleInsuranceArticle(input);
    case 'health-insurance':
      return generateHealthInsuranceArticle(input);
    case 'claim-guide':
      return generateClaimGuideArticle(input);
    case 'news':
      return generateNewsArticle(input);
    case 'glossary':
      return generateGlossaryArticle(input);
    default:
      return generateNewsArticle(input);
  }
}

/**
 * Infer the template type from category and keywords
 */
export function inferTemplateType(
  category: string,
  keywords: string[]
): ArticleTemplateType {
  const cat = category.toLowerCase();
  const kws = keywords.map((k) => k.toLowerCase());

  if (
    cat.includes('motor') ||
    cat.includes('vehicle') ||
    cat.includes('ev') ||
    kws.some((k) => k.includes('car') || k.includes('bike') || k.includes('vehicle') || k.includes('ev '))
  ) {
    return 'vehicle-insurance';
  }

  if (
    cat.includes('claim') ||
    kws.some((k) => k.includes('claim') || k.includes('reimbursement') || k.includes('cashless'))
  ) {
    return 'claim-guide';
  }

  if (
    cat.includes('health') ||
    kws.some((k) => k.includes('health') || k.includes('mediclaim') || k.includes('medical'))
  ) {
    return 'health-insurance';
  }

  if (
    cat.includes('glossary') ||
    kws.some((k) => k.includes('glossary') || k.includes('terms') || k.includes('meaning'))
  ) {
    return 'glossary';
  }

  return 'news';
}

/**
 * Infer blog category and Hindi category from template type and keywords
 */
export function inferCategory(
  templateType: ArticleTemplateType,
  keywords: string[]
): { category: string; categoryHindi: string } {
  const kws = keywords.map((k) => k.toLowerCase());

  switch (templateType) {
    case 'vehicle-insurance': {
      if (kws.some((k) => k.includes('ev') || k.includes('electric'))) {
        return { category: 'EV Insurance', categoryHindi: 'EV बीमा' };
      }
      if (kws.some((k) => k.includes('bike') || k.includes('scooter') || k.includes('two-wheeler'))) {
        return { category: 'Motor Insurance', categoryHindi: 'मोटर बीमा' };
      }
      return { category: 'Vehicle Guide', categoryHindi: 'वाहन गाइड' };
    }
    case 'health-insurance':
      return { category: 'Health Insurance', categoryHindi: 'स्वास्थ्य बीमा' };
    case 'claim-guide':
      return { category: 'Claims Guide', categoryHindi: 'क्लेम गाइड' };
    case 'glossary':
      return { category: 'Insurance Basics', categoryHindi: 'बीमा मूल बातें' };
    case 'news':
    default:
      if (kws.some((k) => k.includes('irdai') || k.includes('regulation'))) {
        return { category: 'Insurance Basics', categoryHindi: 'बीमा मूल बातें' };
      }
      return { category: 'Insurance Basics', categoryHindi: 'बीमा मूल बातें' };
  }
}
