import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { professions, getProfessionBySlug } from '@/data/professions';
import { baseHealthPremium } from '@/data/irdai-rates';
import { QuickAnswerBox } from '@/components/geo/QuickAnswerBox';
import { ExpertInsight } from '@/components/geo/ExpertInsight';
import { FAQSection } from '@/components/geo/FAQSection';
import { ClaimTips } from '@/components/geo/ClaimTips';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Briefcase, AlertTriangle, ShieldCheck, ArrowRight,
  Phone, MessageCircle, ChevronRight, Heart, TrendingUp
} from 'lucide-react';
import Link from 'next/link';

// ── Static Params ────────────────────────────────────────────────────
export function generateStaticParams() {
  return professions.map((p) => ({ profession: p.slug }));
}

// ── Metadata ─────────────────────────────────────────────────────────
export function generateMetadata({ params }: { params: Promise<{ profession: string }> }): Promise<Metadata> {
  return params.then(({ profession }) => {
    const prof = getProfessionBySlug(profession);
    if (!prof) return { title: 'Profession Not Found | Paliwal Secure AI' };

    const premium = Math.round(baseHealthPremium * prof.healthLoadingFactor);

    return {
      title: `Best Health Insurance for ${prof.name}s in India ${new Date().getFullYear()} | ₹${premium.toLocaleString('en-IN')}/yr | Paliwal Secure AI`,
      description: `Health insurance for ${prof.name}s in India. Premium ₹${premium.toLocaleString('en-IN')}/yr for ₹5L cover. Career-specific advice, risk factors, and recommended plans. Get free quote.`,
      keywords: [
        `health insurance for ${prof.name.toLowerCase()}`,
        `${prof.name.toLowerCase()} health insurance India`,
        `best health insurance ${prof.category.toLowerCase()}`,
        `${prof.name.toLowerCase()} insurance premium`,
        `health insurance ${prof.category.toLowerCase()} professionals`,
        `medical insurance working professionals`,
      ],
      openGraph: {
        title: `Health Insurance for ${prof.name}s — ₹${premium.toLocaleString('en-IN')}/yr | Paliwal Secure AI`,
        description: `Career-specific health insurance guide for ${prof.name}s. Coverage tips, premium comparison, and expert advice.`,
        url: `https://paliwalsecure.in/health-insurance/profession-${prof.slug}`,
        siteName: 'Paliwal Secure AI',
        type: 'article',
      },
      alternates: {
        canonical: `https://paliwalsecure.in/health-insurance/profession-${prof.slug}`,
      },
    };
  });
}

// ── Page Component ───────────────────────────────────────────────────
export default async function ProfessionHealthInsurancePage({ params }: { params: Promise<{ profession: string }> }) {
  const { profession } = await params;
  const prof = getProfessionBySlug(profession);
  if (!prof) notFound();

  const premium5L = Math.round(baseHealthPremium * prof.healthLoadingFactor);
  const premium10L = Math.round(premium5L * 1.75);
  const premium25L = Math.round(premium5L * 3.2);
  const loadingPercent = Math.round((prof.healthLoadingFactor - 1) * 100);
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  // Profession-specific FAQs
  const faqs = [
    {
      question: `Why do ${prof.name}s need special health insurance?`,
      answer: `${prof.name}s face unique health risks: ${prof.commonRisks.slice(0, 3).join(', ')}. Standard health insurance may not cover these occupation-specific risks. ${prof.healthLoadingFactor > 1 ? `Premiums are ${loadingPercent}% higher due to elevated health risk factors in the ${prof.category} profession.` : 'Your profession has standard risk levels, so premiums are at base rate.'} Career-specific plans offer tailored coverage for your needs.`,
    },
    {
      question: `How much does health insurance cost for a ${prof.name}?`,
      answer: `Health insurance for a ${prof.name} (30-year-old) starts at ₹${premium5L.toLocaleString('en-IN')}/year for ₹5L sum insured. For ₹10L cover, expect ₹${premium10L.toLocaleString('en-IN')}/yr. ${prof.healthLoadingFactor > 1 ? `The ${loadingPercent}% occupational loading factor reflects higher health risk in ${prof.category} profession.` : ''} We recommend ${prof.recommendedSumInsured} based on your profession's risk profile.`,
    },
    {
      question: `What sum insured should a ${prof.name} buy?`,
      answer: `For ${prof.name}s, we recommend ${prof.recommendedSumInsured} sum insured. ${prof.healthLoadingFactor > 1.1 ? `Higher coverage is essential due to occupational health risks in ${prof.category}.` : prof.healthLoadingFactor < 1 ? `Your profession qualifies for slightly lower premiums — use the savings for higher sum insured.` : `Standard coverage with occupation-specific riders provides adequate protection.`} Key features to look for: ${prof.keyFeatures.slice(0, 3).join(', ')}.`,
    },
    {
      question: `Which insurer is best for ${prof.name}s?`,
      answer: `Top insurers for ${prof.name}s include: ${prof.topInsurers.join(', ')}. ${prof.name}s should look for plans with ${prof.keyFeatures.slice(0, 2).join(' and ')}. Compare quotes from at least 3 insurers to find the best value.`,
    },
    {
      question: `Can ${prof.name}s get corporate health insurance portability?`,
      answer: `Yes, if you have employer-provided health insurance, IRDAI allows portability when changing jobs. Your waiting period credits transfer to the new insurer. ${prof.category === 'IT & Technology' ? 'IT professionals frequently switch jobs — always port your corporate insurance instead of letting it lapse.' : 'Apply for portability at least 45 days before your current policy expires.'} Paliwal Secure can help with the portability process.`,
    },
    {
      question: `What health risks do ${prof.name}s commonly face?`,
      answer: `${prof.name}s commonly face: ${prof.commonRisks.join(', ')}. ${prof.healthLoadingFactor > 1.1 ? `These risks result in a ${loadingPercent}% loading on health insurance premiums.` : 'While these risks are manageable, proper health insurance ensures financial protection.'} Regular health check-ups (covered by most plans) and ${prof.keyFeatures[0]?.toLowerCase() || 'wellness programs'} help manage these risks.`,
    },
  ];

  // JSON-LD Schemas
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Best Health Insurance for ${prof.name}s in India — ₹${premium5L.toLocaleString('en-IN')}/yr`,
    description: prof.description,
    author: { '@type': 'Person', name: 'Himanshu Paliwal', url: 'https://paliwalsecure.in' },
    publisher: { '@type': 'Organization', name: 'Paliwal Secure AI', url: 'https://paliwalsecure.in' },
    datePublished: '2025-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    mainEntityOfPage: `https://paliwalsecure.in/health-insurance/profession-${prof.slug}`,
  };

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
      { '@type': 'ListItem', position: 2, name: 'Health Insurance', item: 'https://paliwalsecure.in/health-insurance' },
      { '@type': 'ListItem', position: 3, name: `${prof.name} Insurance`, item: `https://paliwalsecure.in/health-insurance/profession-${prof.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/health-insurance" className="hover:text-primary">Health Insurance</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">{prof.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <Badge variant="secondary">{prof.category}</Badge>
            <Badge variant="outline">Loading: {prof.healthLoadingFactor}x</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Best Health Insurance for {prof.name}s in India {new Date().getFullYear()}
          </h1>
          <p className="text-muted-foreground">{prof.description}</p>
        </div>

        {/* Key Takeaway Box */}
        <section className="mb-8">
          <QuickAnswerBox
            title={`Health Insurance for ${prof.name}s — Key Takeaway`}
            answers={[
              { label: '₹5L Cover', value: `₹${premium5L.toLocaleString('en-IN')}/yr`, highlight: true },
              { label: '₹10L Cover', value: `₹${premium10L.toLocaleString('en-IN')}/yr` },
              { label: 'Recommended SI', value: prof.recommendedSumInsured },
              { label: 'Risk Loading', value: loadingPercent > 0 ? `+${loadingPercent}%` : 'Base rate' },
            ]}
            summary={`As a ${prof.name}, your health insurance premium is ₹${premium5L.toLocaleString('en-IN')}/yr for ₹5L cover. ${loadingPercent > 0 ? `Occupation adds ${loadingPercent}% loading due to ${prof.commonRisks[0]?.toLowerCase() || 'health risks'}.` : 'Your profession has standard risk levels.'} Recommended: ${prof.recommendedSumInsured} with ${prof.keyFeatures[0]?.toLowerCase() || 'comprehensive coverage'}.`}
          />
        </section>

        {/* Premium Table */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Premium for {prof.name} (30-year-old)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 font-semibold">Sum Insured</th>
                      <th className="text-right py-3 font-semibold">With Loading ({prof.healthLoadingFactor}x)</th>
                      <th className="text-right py-3 font-semibold">Base Rate (1.0x)</th>
                      <th className="text-right py-3 font-semibold">Difference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { si: '₹5L', loaded: premium5L, base: baseHealthPremium },
                      { si: '₹10L', loaded: premium10L, base: Math.round(baseHealthPremium * 1.75) },
                      { si: '₹25L', loaded: premium25L, base: Math.round(baseHealthPremium * 3.2) },
                    ].map((row) => (
                      <tr key={row.si} className="border-b">
                        <td className="py-3">{row.si}</td>
                        <td className="text-right py-3 font-medium text-primary">₹{row.loaded.toLocaleString('en-IN')}</td>
                        <td className="text-right py-3 text-muted-foreground">₹{row.base.toLocaleString('en-IN')}</td>
                        <td className="text-right py-3 text-sm">
                          {loadingPercent > 0 ? (
                            <span className="text-amber-600">+₹{(row.loaded - row.base).toLocaleString('en-IN')}</span>
                          ) : loadingPercent < 0 ? (
                            <span className="text-green-600">-₹{(row.base - row.loaded).toLocaleString('en-IN')}</span>
                          ) : (
                            <span className="text-muted-foreground">₹0</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                * Occupational loading factor of {prof.healthLoadingFactor}x applies for {prof.category} profession.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Risk & Coverage */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Health Risks & Coverage for {prof.name}s
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-red-600 dark:text-red-400">Common Health Risks</h4>
                  <ul className="space-y-1.5">
                    {prof.commonRisks.map((risk) => (
                      <li key={risk} className="text-sm text-muted-foreground flex items-start gap-2">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />{risk}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-green-600 dark:text-green-400">Essential Coverage Features</h4>
                  <ul className="space-y-1.5">
                    {prof.keyFeatures.map((feature) => (
                      <li key={feature} className="text-sm text-muted-foreground flex items-start gap-2">
                        <ShieldCheck className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />{feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold">Recommended insurers: </span>{prof.topInsurers.join(', ')}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Claim Tips */}
        <section className="mb-8">
          <ClaimTips />
        </section>

        {/* Expert Insight */}
        <section className="mb-8">
          <ExpertInsight
            insight={`As a ${prof.name}, your biggest insurance risk is ${prof.commonRisks[0]?.toLowerCase() || 'occupation-related health issues'}. ${prof.healthLoadingFactor > 1.1 ? `The ${loadingPercent}% occupational loading is standard for ${prof.category} — don't skip coverage because of it. Instead, focus on plans that cover your specific risks like ${prof.keyFeatures[0]?.toLowerCase() || 'comprehensive coverage'}.` : `Your profession qualifies for favorable premiums. Use this advantage to buy higher sum insured — ${prof.recommendedSumInsured} is ideal for ${prof.name}s.`} ${prof.category === 'IT & Technology' || prof.category === 'Gig Economy' ? 'Since you may not have stable employer coverage, an individual comprehensive plan is essential.' : ''}`}
          />
        </section>

        {/* FAQ Section */}
        <section className="mb-8">
          <FAQSection faqs={faqs} />
        </section>

        {/* Related Professions */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Health Insurance by Profession</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-2">
                {professions
                  .filter((p) => p.slug !== prof.slug)
                  .slice(0, 6)
                  .map((p) => (
                    <Link
                      key={p.slug}
                      href={`/health-insurance/profession-${p.slug}`}
                      className="flex items-center gap-2 p-2.5 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm"
                    >
                      <Briefcase className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>Health Insurance for {p.name}s</span>
                    </Link>
                  ))}
              </div>
              <div className="grid sm:grid-cols-2 gap-2 mt-2">
                <Link href="/health-insurance/age-30" className="flex items-center gap-2 p-2.5 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm">
                  <ArrowRight className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Health Insurance by Age</span>
                </Link>
                <Link href="/compare" className="flex items-center gap-2 p-2.5 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm">
                  <ArrowRight className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Compare Health Plans</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="mb-8">
          <Card className="border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-bold mb-2">Get Health Insurance Quote for {prof.name}s</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Career-specific coverage from top insurers. Save up to 35% on premiums.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg">
                  <a href={`https://wa.me/919257877312?text=Hi%2C%20I%20am%20a%20${encodeURIComponent(prof.name)}%20and%20need%20health%20insurance`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp Quote
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="tel:+919257877312">
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
          Last updated: {today} | Source: IRDAI, Industry Data | © Paliwal Secure AI
        </p>
      </div>
    </div>
  );
}
