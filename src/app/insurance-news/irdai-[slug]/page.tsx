import { Metadata } from 'next';
import { ExpertInsight } from '@/components/geo/ExpertInsight';
import { FAQSection } from '@/components/geo/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Newspaper, AlertTriangle, TrendingUp, ShieldCheck,
  Phone, MessageCircle, ChevronRight, ArrowRight, Info
} from 'lucide-react';
import Link from 'next/link';

// ── Force dynamic rendering — slug is not available at build time ─
export const dynamic = 'force-dynamic';

interface NewsTopic {
  slug: string;
  title: string;
  shortTitle: string;
  date: string;
  category: string;
  whatHappened: string;
  impact: string[];
  whatToDo: string[];
  expertAnalysis: string;
  faqs: { question: string; answer: string }[];
}

const newsTopics: Record<string, NewsTopic> = {
  'gst-exempt-health-insurance': {
    slug: 'gst-exempt-health-insurance',
    title: 'IRDAI Removes GST on Health Insurance — What It Means for You',
    shortTitle: 'GST Exempt on Health Insurance',
    date: '2025-07-01',
    category: 'Tax & Premium',
    whatHappened: 'The Union Budget 2025-26 announced that GST on health insurance premiums will be exempted from 22 September 2025. This means health insurance premiums will become approximately 18% cheaper. The exemption applies to both individual and group health insurance policies. This is one of the most significant changes to health insurance pricing in India\'s history.',
    impact: [
      'Health insurance premiums will drop by ~18% from 22 Sept 2025',
      'A ₹10,000/year policy will cost approximately ₹8,475 — saving ₹1,525/year',
      'More Indians can now afford health insurance — potential 15-20% increase in penetration',
      'Group health insurance for corporates becomes cheaper too',
      'Senior citizen health insurance becomes significantly more affordable',
    ],
    whatToDo: [
      'If your renewal is before Sept 22, 2025 — renew now and get GST refund later, or wait if possible',
      'Consider upgrading to a higher sum insured with the saved premium amount',
      'Don\'t reduce your sum insured just because premiums are lower — medical inflation continues',
      'Add critical illness rider with the saved premium for better protection',
      'Compare plans — the GST exemption may shift which insurer offers best value',
    ],
    expertAnalysis: 'This is a game-changer for Indian health insurance. An 18% reduction in premiums will bring health insurance within reach of millions more families. However, don\'t let lower premiums tempt you into buying inadequate coverage. Use the savings to upgrade your sum insured or add critical illness cover. The GST exemption applies to new and renewal policies from 22 Sept 2025.',
    faqs: [
      { question: 'When will GST be removed from health insurance?', answer: 'GST on health insurance will be exempt from 22 September 2025 as per the Union Budget 2025-26 announcement. Policies bought or renewed after this date will not include the 18% GST component.' },
      { question: 'How much will I save on health insurance after GST removal?', answer: 'You will save approximately 18% on your health insurance premium. For example, a policy costing ₹10,000/year (including GST) will cost approximately ₹8,475 after GST exemption. For a family floater of ₹25,000/year, you save about ₹4,500/year.' },
      { question: 'Does the GST exemption apply to existing policies?', answer: 'The exemption applies from 22 Sept 2025. If your policy renewal falls after this date, you\'ll pay the lower premium without GST. For policies renewed before this date, the GST paid is not refundable. Time your renewal strategically.' },
      { question: 'Should I wait until September to buy health insurance?', answer: 'If you\'re currently uninsured, don\'t wait — buy now. Medical emergencies don\'t wait for tax changes. However, if your renewal is due in August-September 2025, you might consider a short-term extension to align with the GST exemption date.' },
    ],
  },
  'tp-rate-revision-2024': {
    slug: 'tp-rate-revision-2024',
    title: 'MoRTH Revises Third-Party Motor Insurance Rates — Impact on Your Premium',
    shortTitle: 'TP Rate Revision 2024',
    date: '2024-04-01',
    category: 'Motor Insurance',
    whatHappened: 'The Ministry of Road Transport and Highways (MoRTH) revised third-party motor insurance rates via GSR 354(E) dated 28 March 2024. Key changes: Private car TP rates remain stable for most segments, while EVs continue to enjoy 15% discount on TP premium. The new rates are effective from 1 April 2024.',
    impact: [
      'Private car TP (up to 1000cc): ₹2,094 — unchanged',
      'Private car TP (1000-1500cc): ₹3,416 — unchanged',
      'Private car TP (above 1500cc): ₹7,897 — unchanged',
      'EV discount on TP: 15% continues — making EVs cheaper to insure',
      'Two-wheeler TP rates stable across all engine capacities',
    ],
    whatToDo: [
      'If you own an EV, you already save 15% on TP premium — factor this into purchase decisions',
      'Compare comprehensive policies — TP is fixed, but OD varies by insurer',
      'Don\'t buy TP-only policies for expensive vehicles — comprehensive is better value',
      'Use the NCB from your previous policy to reduce OD premium',
      'Consider multi-year TP (3-year for cars, 5-year for bikes) to lock in rates',
    ],
    expertAnalysis: 'The stability in TP rates is good news for vehicle owners. The real savings come from the 15% EV discount on TP premiums, making electric vehicles even more cost-effective to insure. For comprehensive insurance, focus on comparing OD premiums and add-on costs — that\'s where the real differences between insurers lie.',
    faqs: [
      { question: 'What are the new third-party insurance rates for cars?', answer: 'As per MoRTH GSR 354(E) dated 28.03.2024: Up to 1000cc — ₹2,094, 1000-1500cc — ₹3,416, Above 1500cc — ₹7,897. These rates are unchanged from the previous year.' },
      { question: 'Do electric vehicles get a discount on TP insurance?', answer: 'Yes, EVs get a 15% discount on third-party insurance premiums as per MoRTH guidelines. For example, if the standard TP rate is ₹3,416, EV owners pay ₹2,904 — a saving of ₹512/year.' },
      { question: 'Should I buy multi-year TP insurance?', answer: 'Yes, multi-year TP (3 years for cars, 5 years for bikes) locks in current rates and avoids annual renewal hassle. You also avoid potential future rate increases.' },
    ],
  },
};

function getNewsTopic(slug: string): NewsTopic | null {
  return newsTopics[slug] || null;
}

// ── Metadata ─────────────────────────────────────────────────────────
export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const topic = getNewsTopic(slug);
    if (!topic) {
      return {
        title: 'IRDAI Insurance News | Paliwal Secure AI',
        description: 'Latest IRDAI news and updates affecting your insurance policies. Expert analysis and actionable advice.',
      };
    }

    return {
      title: `${topic.shortTitle} — IRDAI News Analysis | Paliwal Secure AI`,
      description: topic.whatHappened.substring(0, 160),
      keywords: ['IRDAI news', topic.shortTitle, 'insurance regulation India', 'insurance policy changes', topic.category.toLowerCase()],
      openGraph: {
        title: `${topic.shortTitle} — Expert Analysis | Paliwal Secure AI`,
        description: topic.whatHappened.substring(0, 160),
        url: `https://paliwalsecure.in/insurance-news/irdai-${slug}`,
        siteName: 'Paliwal Secure AI',
        type: 'article',
      },
      alternates: {
        canonical: `https://paliwalsecure.in/insurance-news/irdai-${slug}`,
      },
    };
  });
}

// ── Page Component ───────────────────────────────────────────────────
export default async function IRDAINewsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getNewsTopic(slug);
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const slugTitle = (slug || '').split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const defaultFAQs = [
    { question: 'How does this IRDAI change affect my existing insurance policy?', answer: 'IRDAI changes typically apply to new policies and renewals after the effective date. Your existing policy terms remain unchanged until renewal. Contact Paliwal Secure at +91 9257877312 for specific guidance.' },
    { question: 'Should I switch my insurer after an IRDAI regulation change?', answer: 'Not necessarily. Regulation changes usually apply across all insurers. However, the competitive landscape may shift, making some insurers more attractive. Compare quotes at your next renewal.' },
    { question: 'How often does IRDAI update insurance regulations?', answer: 'IRDAI continuously monitors the insurance sector and issues updates as needed. Major regulatory changes happen 2-4 times per year. Annual changes like TP rate revisions typically occur in April.' },
  ];

  const faqs = topic ? topic.faqs : defaultFAQs;

  // JSON-LD Schemas
  const newsArticleSchema = topic ? {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: topic.title,
    description: topic.whatHappened.substring(0, 200),
    datePublished: topic.date,
    dateModified: new Date().toISOString().split('T')[0],
    author: { '@type': 'Person', name: 'Himanshu Paliwal', url: 'https://paliwalsecure.in' },
    publisher: { '@type': 'Organization', name: 'Paliwal Secure AI', url: 'https://paliwalsecure.in', logo: { '@type': 'ImageObject', url: 'https://paliwalsecure.in/logo.svg' } },
    mainEntityOfPage: `https://paliwalsecure.in/insurance-news/irdai-${slug}`,
    articleSection: topic.category,
  } : {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: 'IRDAI Insurance News & Updates',
    description: 'Latest IRDAI news and updates affecting your insurance policies in India.',
    datePublished: new Date().toISOString().split('T')[0],
    publisher: { '@type': 'Organization', name: 'Paliwal Secure AI', url: 'https://paliwalsecure.in' },
  };

  const articleSchema = topic ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: topic.title,
    description: topic.whatHappened.substring(0, 200),
    author: { '@type': 'Person', name: 'Himanshu Paliwal' },
    publisher: { '@type': 'Organization', name: 'Paliwal Secure AI' },
    datePublished: topic.date,
    dateModified: new Date().toISOString().split('T')[0],
  } : null;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://paliwalsecure.in' },
      { '@type': 'ListItem', position: 2, name: 'Insurance News', item: 'https://paliwalsecure.in/insurance-news' },
      { '@type': 'ListItem', position: 3, name: topic?.shortTitle || 'IRDAI News', item: `https://paliwalsecure.in/insurance-news/irdai-${slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleSchema) }} />
      {articleSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/insurance-news" className="hover:text-primary">Insurance News</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">{topic?.shortTitle || slug}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Newspaper className="h-5 w-5 text-primary" />
            <Badge variant="secondary">{topic?.category || 'IRDAI Update'}</Badge>
            {topic && <Badge variant="outline">{new Date(topic.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</Badge>}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {topic?.title || `IRDAI Update: ${slugTitle}`}
          </h1>
          <p className="text-muted-foreground">
            Expert analysis and actionable guidance on the latest IRDAI regulation changes affecting your insurance.
          </p>
        </div>

        {/* What Happened */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                What Happened
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">
                {topic?.whatHappened || `This IRDAI update (${slug}) affects insurance policies in India. Stay informed about regulatory changes that impact your coverage, premiums, and rights as a policyholder. Contact Paliwal Secure at +91 9257877312 for details.`}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Impact */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-amber-500" />
                Impact on Policyholders
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topic ? (
                <ul className="space-y-2">
                  {topic.impact.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Impact analysis will be available once this regulation is formally notified.</p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* What to Do */}
        <section className="mb-8">
          <Card className="border-green-200 dark:border-green-900/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-green-700 dark:text-green-400">
                <ShieldCheck className="h-5 w-5" />
                What You Should Do
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topic ? (
                <ul className="space-y-2">
                  {topic.whatToDo.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <ShieldCheck className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Action items will be updated once the regulation details are confirmed.</p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Expert Analysis */}
        <section className="mb-8">
          <ExpertInsight
            title="Expert Analysis — IRDAI Update"
            insight={topic?.expertAnalysis || `This IRDAI update is significant for Indian insurance policyholders. As regulations evolve, review your coverage regularly. Don't make hasty decisions — consult an IRDAI-certified advisor. Call +91 9257877312 for personalized guidance.`}
          />
        </section>

        {/* FAQ Section */}
        <section className="mb-8">
          <FAQSection faqs={faqs} title="FAQs About This IRDAI Update" />
        </section>

        {/* Related News */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Other IRDAI Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-2">
                {Object.entries(newsTopics)
                  .filter(([key]) => key !== slug)
                  .map(([key, t]) => (
                    <Link key={key} href={`/insurance-news/irdai-${key}`} className="flex items-center gap-2 p-2.5 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm">
                      <Newspaper className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{t.shortTitle}</span>
                    </Link>
                  ))}
                <Link href="/health-insurance" className="flex items-center gap-2 p-2.5 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm">
                  <ArrowRight className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Health Insurance Plans</span>
                </Link>
                <Link href="/compare" className="flex items-center gap-2 p-2.5 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm">
                  <ArrowRight className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Compare Insurance</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="mb-8">
          <Card className="border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-bold mb-2">Confused About This IRDAI Update?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get clarity on how this regulation affects YOUR insurance. Free consultation.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg">
                  <a href="https://wa.me/919257877312?text=Hi%2C%20I%20have%20a%20question%20about%20the%20latest%20IRDAI%20update" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Ask Expert on WhatsApp
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="https://wa.me/919257877312">
                    <Phone className="h-4 w-4 mr-2" />
                    Call +91 9257877312
                  </a>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                IRDAI Certified Advisor | POSP Code: IP429834
              </p>
            </CardContent>
          </Card>
        </section>

        <p className="text-xs text-center text-muted-foreground">
          Last updated: {today} | Source: IRDAI, MoRTH | © Paliwal Secure AI
        </p>
      </div>
    </div>
  );
}
