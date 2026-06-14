import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cities, getCityBySlug, getTierMultiplier } from '@/data/cities';
import { healthPlans } from '@/data/healthPlans';
import { QuickAnswerBox } from '@/components/geo/QuickAnswerBox';
import { ExpertInsight } from '@/components/geo/ExpertInsight';
import { FAQSection } from '@/components/geo/FAQSection';
import { ClaimTips } from '@/components/geo/ClaimTips';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MapPin, Building2, Activity, TrendingUp, ArrowRight,
  Phone, MessageCircle, ChevronRight, Hospital, Heart
} from 'lucide-react';
import Link from 'next/link';

// ── Static Params ────────────────────────────────────────────────────
export function generateStaticParams() {
  return cities.map((c) => ({ city: c.slug }));
}

// ── Metadata ─────────────────────────────────────────────────────────
export function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  return params.then(({ city }) => {
    const cityData = getCityBySlug(city);
    if (!cityData) return { title: 'City Not Found | Paliwal Secure AI' };

    const tierLabel = cityData.tier === 'metro' ? 'Metro' : cityData.tier === 'tier2' ? 'Tier-2' : 'Tier-3';
    const basePrem = cityData.basePremium ?? 6500;
    const premium = Math.round(basePrem * getTierMultiplier(cityData.tier));
    const hospitalCount = cityData.hospitalCount ?? (cityData.tier === 'metro' ? 500 : cityData.tier === 'tier2' ? 150 : 50);

    return {
      title: `Best Health Insurance in ${cityData.name} ${cityData.state} ${new Date().getFullYear()} | Premium ₹${premium.toLocaleString('en-IN')} | Paliwal Secure AI`,
      description: `Compare best health insurance plans in ${cityData.name}, ${cityData.state}. Premium starts at ₹${premium.toLocaleString('en-IN')}/yr for ₹5L cover. ${hospitalCount}+ hospitals, cashless claims, ${tierLabel} city rates. Get free quote.`,
      keywords: [
        `health insurance ${cityData.name}`,
        `best health insurance ${cityData.name} ${cityData.state}`,
        `health insurance premium ${cityData.name}`,
        `cashless hospitals ${cityData.name}`,
        `medical insurance ${cityData.name}`,
        `family health insurance ${cityData.name}`,
        `health insurance ${tierLabel.toLowerCase()} city`,
        `${cityData.name} health insurance plans ${new Date().getFullYear()}`,
      ],
      openGraph: {
        title: `Best Health Insurance in ${cityData.name} — ₹${premium.toLocaleString('en-IN')}/yr | Paliwal Secure AI`,
        description: `Top health insurance plans for ${cityData.name} residents. ${hospitalCount}+ network hospitals. Compare & save.`,
        url: `https://paliwalsecure.in/health-insurance/${cityData.slug}`,
        siteName: 'Paliwal Secure AI',
        type: 'article',
        locale: 'en_IN',
      },
      alternates: {
        canonical: `https://paliwalsecure.in/health-insurance/${cityData.slug}`,
      },
    };
  });
}

// ── Page Component ───────────────────────────────────────────────────
export default async function CityHealthInsurancePage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const cityData = getCityBySlug(city);
  if (!cityData) notFound();

  const tierMultiplier = getTierMultiplier(cityData.tier);
  const basePrem = cityData.basePremium ?? 6500;
  const estimatedPremium = Math.round(basePrem * tierMultiplier);
  const premium5L = estimatedPremium;
  const premium10L = Math.round(estimatedPremium * 1.75);
  const premium25L = Math.round(estimatedPremium * 3.2);
  const tierLabel = cityData.tier === 'metro' ? 'Metro' : cityData.tier === 'tier2' ? 'Tier-2' : 'Tier-3';
  const hospitalCount = cityData.hospitalCount ?? (cityData.tier === 'metro' ? 500 : cityData.tier === 'tier2' ? 150 : 50);
  const networkHospitals = cityData.networkHospitals ?? [
    { name: 'Apollo Hospitals', type: 'Multi-specialty' },
    { name: 'Fortis Healthcare', type: 'Multi-specialty' },
    { name: 'Max Healthcare', type: 'Multi-specialty' },
  ];
  const topInsurers = (cityData as Record<string, unknown>).topInsurers as string[] | undefined ?? ['HDFC ERGO', 'Niva Bupa', 'Care Health', 'Star Health', 'ICICI Lombard'];
  const avgClaimSize = (cityData as Record<string, unknown>).avgClaimSize as number | undefined ?? (cityData.tier === 'metro' ? 52000 : cityData.tier === 'tier2' ? 35000 : 22000);
  const medicalInflation = (cityData as Record<string, unknown>).medicalInflation as number | undefined ?? 14;
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  // Get best plans for this city
  const bestPlans = healthPlans
    .filter((p) => p.csrValue >= 94)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  // City-specific FAQs
  const faqs = [
    {
      question: `What is the best health insurance in ${cityData.name}?`,
      answer: `Based on claim settlement ratio, hospital network, and premiums, the best health insurance plans in ${cityData.name} are: ${bestPlans.slice(0, 3).map((p) => p.name).join(', ')}. ${cityData.name} has ${hospitalCount}+ hospitals with cashless facility. Premium for a 30-year-old starts at ₹${premium5L.toLocaleString('en-IN')}/year for ₹5L sum insured.`,
    },
    {
      question: `How much does health insurance cost in ${cityData.name}?`,
      answer: `Health insurance in ${cityData.name} costs ₹${premium5L.toLocaleString('en-IN')}/year for ₹5L sum insured (30-year-old). Being a ${tierLabel} city, premiums are ${cityData.tier === 'metro' ? '15% higher' : cityData.tier === 'tier3' ? '8% lower' : 'at base rate'} due to ${cityData.tier === 'metro' ? 'higher medical costs and hospital charges' : cityData.tier === 'tier3' ? 'lower healthcare costs' : 'moderate healthcare costs'}. For ₹10L cover, expect ₹${premium10L.toLocaleString('en-IN')}/yr.`,
    },
    {
      question: `Which hospitals in ${cityData.name} offer cashless treatment?`,
      answer: `${cityData.name} has ${hospitalCount}+ network hospitals offering cashless treatment. Top hospital chains include: ${networkHospitals.map((h) => h.name).join(', ')}. Cashless approval typically takes 2-4 hours. Always verify your insurer's hospital network before admission.`,
    },
    {
      question: `What is the average claim size in ${cityData.name}?`,
      answer: `The average health insurance claim in ${cityData.name} is ₹${avgClaimSize.toLocaleString('en-IN')}. With medical inflation at ${medicalInflation}% annually, we recommend a minimum sum insured of ₹${avgClaimSize > 40000 ? '10' : '5'}L for individuals and ₹${avgClaimSize > 40000 ? '15-25' : '10-15'}L for families.`,
    },
    {
      question: `Is medical inflation high in ${cityData.name}? Should I buy higher cover?`,
      answer: `Medical inflation in ${cityData.name} is ${medicalInflation}% — ${medicalInflation > 13 ? 'significantly above the national average of 12%' : 'around the national average of 12%'}. ${medicalInflation > 13 ? 'We strongly recommend buying ₹10-25L sum insured instead of ₹5L.' : 'A ₹10L sum insured provides adequate coverage for most hospitalizations.'} Consider restoration benefit and super top-up plans for additional protection.`,
    },
    {
      question: `Can I port my existing health insurance to a better plan in ${cityData.name}?`,
      answer: `Yes, IRDAI allows health insurance portability. You can switch insurers while retaining your waiting period credits. The process takes 30-45 days. Apply at least 45 days before renewal. Paliwal Secure can help you port to a better plan in ${cityData.name} — call +91 9257877312 for free assistance.`,
    },
  ];

  // JSON-LD Schemas
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Best Health Insurance in ${cityData.name} ${new Date().getFullYear()} — Premium ₹${premium5L.toLocaleString('en-IN')}`,
    description: cityData.description,
    author: { '@type': 'Person', name: 'Himanshu Paliwal', url: 'https://paliwalsecure.in' },
    publisher: { '@type': 'Organization', name: 'Paliwal Secure AI', url: 'https://paliwalsecure.in' },
    datePublished: '2025-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    mainEntityOfPage: `https://paliwalsecure.in/health-insurance/${cityData.slug}`,
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
      { '@type': 'ListItem', position: 3, name: `${cityData.name} Health Insurance`, item: `https://paliwalsecure.in/health-insurance/${cityData.slug}` },
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
          <span className="text-foreground font-medium">{cityData.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-5 w-5 text-primary" />
            <Badge variant="secondary">{tierLabel} City</Badge>
            <Badge variant="outline">{cityData.state}</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Best Health Insurance in {cityData.name} {new Date().getFullYear()}
          </h1>
          <p className="text-muted-foreground">
            Compare top health insurance plans for {cityData.name} residents. {hospitalCount}+ network hospitals, cashless claims, and {tierLabel.toLowerCase()} city premium rates.
          </p>
        </div>

        {/* Key Takeaway Box */}
        <section className="mb-8">
          <QuickAnswerBox
            title={`Health Insurance in ${cityData.name} — Key Takeaway`}
            answers={[
              { label: '₹5L Cover', value: `₹${premium5L.toLocaleString('en-IN')}/yr`, highlight: true },
              { label: '₹10L Cover', value: `₹${premium10L.toLocaleString('en-IN')}/yr` },
              { label: 'Hospitals', value: `${hospitalCount}+` },
              { label: 'Avg Claim', value: `₹${avgClaimSize.toLocaleString('en-IN')}` },
            ]}
            summary={`Health insurance in ${cityData.name} starts at ₹${premium5L.toLocaleString('en-IN')}/yr for ₹5L sum insured (30-year-old). ${cityData.tier === 'metro' ? 'Metro city premiums are 15% higher due to elevated medical costs.' : cityData.tier === 'tier3' ? 'Tier-3 city premiums are 8% lower — great value for residents.' : 'Premiums are at base rate for Tier-2 cities.'} Medical inflation is ${medicalInflation}% — consider ₹${avgClaimSize > 40000 ? '10-25L' : '5-15L'} cover.`}
          />
        </section>

        {/* City Stats */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                {cityData.name} — Healthcare & Insurance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <Building2 className="h-4 w-4 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Hospitals</p>
                  <p className="font-bold">{hospitalCount}+</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <TrendingUp className="h-4 w-4 text-amber-500 mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Med Inflation</p>
                  <p className="font-bold">{medicalInflation}%</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <Heart className="h-4 w-4 text-red-500 mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Health Index</p>
                  <p className="font-bold">{cityData.healthIndex}/10</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <MapPin className="h-4 w-4 text-green-500 mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">City Tier</p>
                  <p className="font-bold">{tierLabel}</p>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-primary/5 text-sm">
                {cityData.description}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Premium Table */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Estimated Premium — {cityData.name} (30-year-old)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 font-semibold">Sum Insured</th>
                      <th className="text-right py-3 font-semibold">Individual</th>
                      <th className="text-right py-3 font-semibold">Family Floater</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3">₹5 Lakh</td>
                      <td className="text-right py-3 font-medium">₹{premium5L.toLocaleString('en-IN')}</td>
                      <td className="text-right py-3 text-muted-foreground">₹{Math.round(premium5L * 1.6).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">₹10 Lakh</td>
                      <td className="text-right py-3 font-medium">₹{premium10L.toLocaleString('en-IN')}</td>
                      <td className="text-right py-3 text-muted-foreground">₹{Math.round(premium10L * 1.6).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr className="border-b bg-primary/5">
                      <td className="py-3 font-semibold">₹25 Lakh <Badge variant="default" className="text-xs ml-1">Recommended</Badge></td>
                      <td className="text-right py-3 font-bold text-primary">₹{premium25L.toLocaleString('en-IN')}</td>
                      <td className="text-right py-3 font-medium">₹{Math.round(premium25L * 1.6).toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                * Indicative premiums for 30-year-old, no pre-existing conditions. {tierLabel} city adjustment: {cityData.tier === 'metro' ? '+15%' : cityData.tier === 'tier3' ? '-8%' : 'Base rate'}.
                Family floater estimated for 2 adults + 1 child.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Best Plans */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Hospital className="h-5 w-5 text-primary" />
                Best Health Insurance Plans in {cityData.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bestPlans.map((plan, i) => (
                  <div key={plan.id} className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/30 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary">#{i + 1}</span>
                        <span className="font-semibold text-sm">{plan.name}</span>
                        <Badge variant="secondary" className="text-xs">CSR {plan.csr}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{plan.insurer} • {plan.networkHospitals.toLocaleString()} network hospitals</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {plan.key_features.slice(0, 3).map((f) => (
                          <Badge key={f} variant="outline" className="text-xs">{f}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">From</p>
                      <p className="font-bold text-primary">₹{Math.round(plan.premium * tierMultiplier).toLocaleString('en-IN')}/yr</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Hospital Network */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Top Hospital Networks in {cityData.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {networkHospitals.map((h) => (
                  <div key={h.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm font-medium">{h.name}</p>
                      <p className="text-xs text-muted-foreground">Cashless network</p>
                    </div>
                    <Badge variant="outline">{h.count} locations</Badge>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Hospital network data is indicative. Verify with your insurer before admission.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Top Insurers */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Health Insurers in {cityData.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {topInsurers.map((insurer) => (
                  <Badge key={insurer} variant="secondary">{insurer}</Badge>
                ))}
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
            insight={`${cityData.name} residents face ${medicalInflation}% medical inflation — ${medicalInflation > 13 ? 'well above the national average' : 'around the national average'}. I recommend a minimum ₹${avgClaimSize > 40000 ? '10L' : '5L'} sum insured for individuals and ₹${avgClaimSize > 40000 ? '25L' : '15L'} for families. Always choose plans with restoration benefit and no room rent capping. ${cityData.name === 'Kota' ? 'As a Kota-based advisor, I personally help families here find the right coverage — call me anytime.' : ''}`}
          />
        </section>

        {/* FAQ Section */}
        <section className="mb-8">
          <FAQSection faqs={faqs} />
        </section>

        {/* Related Cities */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Health Insurance in Other Cities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-2">
                {cities
                  .filter((c) => c.slug !== cityData.slug)
                  .slice(0, 6)
                  .map((c) => (
                    <Link
                      key={c.slug}
                      href={`/health-insurance/${c.slug}`}
                      className="flex items-center gap-2 p-2.5 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm"
                    >
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>Health Insurance in {c.name}</span>
                      <Badge variant="outline" className="text-xs ml-auto">{c.tier === 'metro' ? 'Metro' : c.tier === 'tier2' ? 'T2' : 'T3'}</Badge>
                    </Link>
                  ))}
              </div>
              <div className="grid sm:grid-cols-2 gap-2 mt-2">
                <Link href="/health-insurance/age-30" className="flex items-center gap-2 p-2.5 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm">
                  <ArrowRight className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Health Insurance for 30-Year-Olds</span>
                </Link>
                <Link href="/compare" className="flex items-center gap-2 p-2.5 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm">
                  <ArrowRight className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Compare Health Insurance Plans</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="mb-8">
          <Card className="border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-bold mb-2">Get Free Health Insurance Quote in {cityData.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Compare 10+ insurers. Personalized recommendations for {cityData.name} residents.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg">
                  <a href={`https://wa.me/919257877312?text=Hi%2C%20I%20need%20health%20insurance%20in%20${encodeURIComponent(cityData.name)}`} target="_blank" rel="noopener noreferrer">
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
          Last updated: {today} | Source: IRDAI Annual Report | © Paliwal Secure AI
        </p>
      </div>
    </div>
  );
}
