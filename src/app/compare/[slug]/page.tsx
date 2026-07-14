import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { healthInsurers, generateComparisonSlugs, parseComparisonSlug } from '@/data/insurers';
import { QuickAnswerBox } from '@/components/geo/QuickAnswerBox';
import { ExpertInsight } from '@/components/geo/ExpertInsight';
import { FAQSection } from '@/components/geo/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Scale, Trophy, ThumbsUp, ThumbsDown, ArrowRight,
  Phone, MessageCircle, ChevronRight, CheckCircle2, XCircle, Crown
} from 'lucide-react';
import Link from 'next/link';

// Helper to get display name
function getShortName(i: { logoPlaceholder?: string; name: string }): string {
  return i.logoPlaceholder || i.name;
}

// ── Static Params ────────────────────────────────────────────────────
export function generateStaticParams() {
  return generateComparisonSlugs().map((slug) => ({ slug }));
}

// ── Metadata ─────────────────────────────────────────────────────────
export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const comparison = parseComparisonSlug(slug);
    if (!comparison || !comparison.insurerA || !comparison.insurerB) return { title: 'Comparison Not Found | Paliwal Secure AI' };

    const i1 = comparison.insurerA;
    const i2 = comparison.insurerB;
    const n1 = getShortName(i1);
    const n2 = getShortName(i2);

    return {
      title: `${n1} vs ${n2} Health Insurance Comparison ${new Date().getFullYear()} | Paliwal Secure AI`,
      description: `Compare ${n1} vs ${n2} health insurance. CSR ${i1.csr}% vs ${i2.csr}%, premiums, hospital networks, and more. Find the winner.`,
      keywords: [
        `${n1} vs ${n2}`,
        `${n1} vs ${n2} health insurance`,
        `compare ${n1} ${n2}`,
        `${n1} or ${n2} which is better`,
        `health insurance comparison India`,
        `${n1} vs ${n2} claim settlement`,
      ],
      openGraph: {
        title: `${n1} vs ${n2} — Health Insurance Comparison`,
        description: `Side-by-side comparison of ${n1} and ${n2} health insurance. CSR, premiums, hospital network, and more.`,
        url: `https://paliwalsecure.in/compare/${slug}`,
        siteName: 'Paliwal Secure AI',
        type: 'article',
        images: [{
          url: `https://paliwalsecure.in/api/og?title=${encodeURIComponent(`${n1} vs ${n2}`)}&type=compare&description=${encodeURIComponent(`Health Insurance Comparison — CSR, premiums, hospital network`)}`,
          width: 1200,
          height: 630,
          alt: `${n1} vs ${n2} Health Insurance Comparison`,
          type: 'image/png',
        }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${n1} vs ${n2} — Health Insurance Comparison`,
        description: `Side-by-side comparison of ${n1} and ${n2} health insurance.`,
        images: [`https://paliwalsecure.in/api/og?title=${encodeURIComponent(`${n1} vs ${n2}`)}&type=compare`],
      },
      alternates: {
        canonical: `https://paliwalsecure.in/compare/${slug}`,
      },
    };
  });
}

// ── Comparison Logic ─────────────────────────────────────────────────
function getWinner(i1: typeof healthInsurers[0], i2: typeof healthInsurers[0]) {
  const n1 = getShortName(i1);
  const n2 = getShortName(i2);
  const categories = {
    price: i1.premiumFor10L < i2.premiumFor10L ? n1 : n2,
    coverage: i1.networkHospitals > i2.networkHospitals ? n1 : n2,
    claims: i1.csr > i2.csr ? n1 : n2,
  };
  return categories;
}

function getHeadToHead(i1: typeof healthInsurers[0], i2: typeof healthInsurers[0]) {
  const n1 = getShortName(i1);
  const n2 = getShortName(i2);
  return [
    {
      factor: 'Claim Settlement Ratio',
      i1Value: `${i1.csr}%`,
      i2Value: `${i2.csr}%`,
      winner: i1.csr >= i2.csr ? n1 : n2,
    },
    {
      factor: 'Network Hospitals',
      i1Value: `${(i1.networkHospitals ?? 0).toLocaleString()}`,
      i2Value: `${(i2.networkHospitals ?? 0).toLocaleString()}`,
      winner: (i1.networkHospitals ?? 0) >= (i2.networkHospitals ?? 0) ? n1 : n2,
    },
    {
      factor: 'Premium for ₹10L (Age 30)',
      i1Value: `₹${(i1.premiumFor10L ?? 0).toLocaleString('en-IN')}`,
      i2Value: `₹${(i2.premiumFor10L ?? 0).toLocaleString('en-IN')}`,
      winner: (i1.premiumFor10L ?? 99999) <= (i2.premiumFor10L ?? 99999) ? n1 : n2,
    },
  ];
}

// ── Page Component ───────────────────────────────────────────────────
export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const comparison = parseComparisonSlug(slug);
  if (!comparison || !comparison.insurerA || !comparison.insurerB) notFound();

  const i1 = comparison.insurerA;
  const i2 = comparison.insurerB;
  const n1 = getShortName(i1);
  const n2 = getShortName(i2);

  const winner = getWinner(i1, i2);
  const headToHead = getHeadToHead(i1, i2);
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  // Count wins
  const i1Wins = headToHead.filter((h) => h.winner === n1).length;
  const i2Wins = headToHead.filter((h) => h.winner === n2).length;
  const overallWinnerName = i1Wins >= i2Wins ? n1 : n2;

  // Comparison FAQs
  const faqs = [
    {
      question: `Which is better — ${n1} or ${n2} health insurance?`,
      answer: `${overallWinnerName} wins this comparison with ${Math.max(i1Wins, i2Wins)} out of 3 key factors. ${n1} excels in CSR (${i1.csr}%) and ${i1.networkHospitals > i2.networkHospitals ? 'hospital network' : 'premium pricing'}. ${n2} leads in ${i2.networkHospitals > i1.networkHospitals ? 'hospital network' : i2.csr > i1.csr ? 'claim settlement' : 'premium pricing'}. Choose based on your priority: ${winner.claims} for claims, ${winner.coverage} for coverage, ${winner.price} for price.`,
    },
    {
      question: `How does ${n1} claim settlement compare to ${n2}?`,
      answer: `${n1} has a CSR of ${i1.csr}% while ${n2} has CSR of ${i2.csr}%. ${i1.csr > i2.csr ? `${n1} has a slightly better claim settlement record.` : `${n2} has a slightly better claim settlement record.`} Both are around the industry average. CSR is just one factor — also consider hospital network, premium, and waiting periods.`,
    },
    {
      question: `Which has more network hospitals — ${n1} or ${n2}?`,
      answer: `${n1} has ${(i1.networkHospitals ?? 0).toLocaleString()} network hospitals, while ${n2} has ${(i2.networkHospitals ?? 0).toLocaleString()}. ${i1.networkHospitals > i2.networkHospitals ? `${n1} has ${i1.networkHospitals - i2.networkHospitals} more hospitals.` : `${n2} has ${i2.networkHospitals - i1.networkHospitals} more hospitals.`} More hospitals means better cashless claim access in your city.`,
    },
    {
      question: `Is ${n1} cheaper than ${n2}?`,
      answer: `${n1}'s premium for ₹10L cover (age 30) is approximately ₹${(i1.premiumFor10L ?? 0).toLocaleString('en-IN')}/year vs ${n2}'s ₹${(i2.premiumFor10L ?? 0).toLocaleString('en-IN')}/year. ${i1.premiumFor10L < i2.premiumFor10L ? `${n1} is more affordable.` : `${n2} is more affordable.`} Premium depends on your age, city, sum insured, and plan type. Get personalized quotes from both insurers to compare actual pricing.`,
    },
    {
      question: `Can I switch from ${n1} to ${n2}?`,
      answer: `Yes, IRDAI allows health insurance portability. You can switch from ${n1} to ${n2} while retaining waiting period credits. Apply at least 45 days before renewal. The process takes 30-45 days. Paliwal Secure can help with portability — call +91 9257877312 for free assistance.`,
    },
    {
      question: `What are the key differences between ${n1} and ${n2}?`,
      answer: `Key differences: (1) CSR: ${n1} ${i1.csr}% vs ${n2} ${i2.csr}%, (2) Hospital network: ${(i1.networkHospitals ?? 0).toLocaleString()} vs ${(i2.networkHospitals ?? 0).toLocaleString()}, (3) Premium: ₹${(i1.premiumFor10L ?? 0).toLocaleString('en-IN')} vs ₹${(i2.premiumFor10L ?? 0).toLocaleString('en-IN')} for ₹10L cover. Choose ${n1} for ${i1.csr > i2.csr ? 'better claims' : i1.networkHospitals > i2.networkHospitals ? 'wider coverage' : 'lower premium'} or ${n2} for ${i2.csr > i1.csr ? 'better claims' : i2.networkHospitals > i1.networkHospitals ? 'wider coverage' : 'lower premium'}.`,
    },
  ];

  // JSON-LD
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${n1} vs ${n2} Health Insurance Comparison`,
    description: `Detailed comparison of ${n1} vs ${n2} health insurance plans.`,
    author: { '@type': 'Person', name: 'Himanshu Paliwal', url: 'https://paliwalsecure.in' },
    publisher: { '@type': 'Organization', name: 'Paliwal Secure AI', url: 'https://paliwalsecure.in' },
    datePublished: '2025-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    mainEntityOfPage: `https://paliwalsecure.in/compare/${slug}`,
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
      { '@type': 'ListItem', position: 2, name: 'Compare', item: 'https://paliwalsecure.in/compare' },
      { '@type': 'ListItem', position: 3, name: `${n1} vs ${n2}`, item: `https://paliwalsecure.in/compare/${slug}` },
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
          <Link href="/compare" className="hover:text-primary">Compare</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">{n1} vs {n2}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="h-5 w-5 text-primary" />
            <Badge variant="secondary">Health Insurance Comparison</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {n1} vs {n2} — Health Insurance Comparison
          </h1>
          <p className="text-muted-foreground">
            Detailed side-by-side comparison of {i1.name} and {i2.name}. Find out which insurer is better for your needs.
          </p>
        </div>

        {/* Quick Verdict */}
        <section className="mb-8">
          <QuickAnswerBox
            title="Quick Verdict"
            answers={[
              { label: 'Best Price', value: winner.price },
              { label: 'Best Coverage', value: winner.coverage },
              { label: 'Best Claims', value: winner.claims },
              { label: 'Overall Winner', value: overallWinnerName, highlight: true },
            ]}
            summary={`${overallWinnerName} wins the overall comparison with ${Math.max(i1Wins, i2Wins)}/3 key factors. ${overallWinnerName === n1 ? n2 : n1} is competitive in some areas. Choose based on your priority: claims settlement, hospital network, or premium cost.`}
          />
        </section>

        {/* Side-by-Side Comparison Table */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                {n1} vs {n2} — Comparison Table
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 font-semibold">Feature</th>
                      <th className="text-center py-3 font-semibold">{n1}</th>
                      <th className="text-center py-3 font-semibold">{n2}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: 'Claim Settlement Ratio', v1: `${i1.csr}%`, v2: `${i2.csr}%` },
                      { label: 'Network Hospitals', v1: (i1.networkHospitals ?? 0).toLocaleString(), v2: (i2.networkHospitals ?? 0).toLocaleString() },
                      { label: 'Premium (₹10L, Age 30)', v1: `₹${(i1.premiumFor10L ?? 0).toLocaleString('en-IN')}/yr`, v2: `₹${(i2.premiumFor10L ?? 0).toLocaleString('en-IN')}/yr` },
                      { label: 'Waiting Period', v1: i1.waitingPeriod || 'Standard', v2: i2.waitingPeriod || 'Standard' },
                      { label: 'Room Rent Policy', v1: i1.roomRent || 'Varies by plan', v2: i2.roomRent || 'Varies by plan' },
                      { label: 'Restoration Benefit', v1: i1.restoration || 'Available', v2: i2.restoration || 'Available' },
                    ].map((row) => (
                      <tr key={row.label} className="border-b">
                        <td className="py-3 font-medium">{row.label}</td>
                        <td className="text-center py-3">{row.v1}</td>
                        <td className="text-center py-3">{row.v2}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Head-to-Head */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-500" />
                Head-to-Head — 3 Key Factors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {headToHead.map((item) => (
                  <div key={item.factor} className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="text-sm font-medium">{item.factor}</span>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm ${item.winner === n1 ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                        {item.i1Value}
                      </span>
                      <span className="text-xs text-muted-foreground">vs</span>
                      <span className={`text-sm ${item.winner === n2 ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                        {item.i2Value}
                      </span>
                    </div>
                    <Badge variant={item.winner === overallWinnerName ? 'default' : 'secondary'} className="text-xs">
                      <Trophy className="h-3 w-3 mr-1" />{item.winner}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-lg bg-primary/10 text-center">
                <span className="font-bold text-primary">{overallWinnerName}</span> wins {Math.max(i1Wins, i2Wins)} out of 3 factors
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Pros & Cons */}
        <section className="mb-8">
          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{n1}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-green-600 mb-2 flex items-center gap-1"><ThumbsUp className="h-4 w-4" />Pros</h4>
                  <ul className="space-y-1">
                    {(i1.pros || []).map((pro: string) => (
                      <li key={pro} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />{pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-1"><ThumbsDown className="h-4 w-4" />Cons</h4>
                  <ul className="space-y-1">
                    {(i1.cons || []).map((con: string) => (
                      <li key={con} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <XCircle className="h-3.5 w-3.5 text-red-500 mt-0.5 shrink-0" />{con}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{n2}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-green-600 mb-2 flex items-center gap-1"><ThumbsUp className="h-4 w-4" />Pros</h4>
                  <ul className="space-y-1">
                    {(i2.pros || []).map((pro: string) => (
                      <li key={pro} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />{pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-1"><ThumbsDown className="h-4 w-4" />Cons</h4>
                  <ul className="space-y-1">
                    {(i2.cons || []).map((con: string) => (
                      <li key={con} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <XCircle className="h-3.5 w-3.5 text-red-500 mt-0.5 shrink-0" />{con}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Expert Recommendation */}
        <section className="mb-8">
          <ExpertInsight
            title="Expert Recommendation — Paliwal Secure AI"
            insight={`After comparing ${n1} and ${n2}, our recommendation: Choose ${overallWinnerName} for ${i1Wins > i2Wins ? 'better claim settlement and overall reliability' : i2Wins > i1Wins ? 'superior coverage and value' : 'balanced performance across key factors'}. However, the best insurer depends on YOUR specific needs — city, age, family size, and health conditions. Get a personalized comparison based on your profile.`}
          />
        </section>

        {/* FAQ Section */}
        <section className="mb-8">
          <FAQSection faqs={faqs} />
        </section>

        {/* Related Comparisons */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">More Health Insurance Comparisons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-2">
                {generateComparisonSlugs()
                  .filter((s) => s !== slug)
                  .slice(0, 6)
                  .map((s) => {
                    const parts = s.split('-vs-');
                    const cn1 = healthInsurers.find((ins) => ins.slug === parts[0]);
                    const cn2 = healthInsurers.find((ins) => ins.slug === parts[1]);
                    return (
                      <Link
                        key={s}
                        href={`/compare/${s}`}
                        className="flex items-center gap-2 p-2.5 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm"
                      >
                        <Scale className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>{cn1 ? getShortName(cn1) : parts[0]} vs {cn2 ? getShortName(cn2) : parts[1]}</span>
                      </Link>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="mb-8">
          <Card className="border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-bold mb-2">Get Personalized Comparison</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Tell us your age, city, and needs — we&apos;ll compare {n1} & {n2} for YOUR profile.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg">
                  <a href={`https://wa.me/919257877312?text=Hi%2C%20compare%20${encodeURIComponent(n1)}%20vs%20${encodeURIComponent(n2)}%20for%20me`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp Comparison
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
          Last updated: {today} | Source: IRDAI Annual Report | © Paliwal Secure AI
        </p>
      </div>
    </div>
  );
}
