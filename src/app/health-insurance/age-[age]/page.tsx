import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ageMultipliers, baseHealthPremium } from '@/data/irdai-rates';
import { QuickAnswerBox } from '@/components/geo/QuickAnswerBox';
import { ExpertInsight } from '@/components/geo/ExpertInsight';
import { FAQSection } from '@/components/geo/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar, Heart, TrendingUp, ArrowRight, Phone,
  MessageCircle, ChevronRight, ShieldCheck, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

const VALID_AGES = [25, 30, 35, 40, 45, 50, 55, 60];

// ── Static Params ────────────────────────────────────────────────────
export function generateStaticParams() {
  return VALID_AGES.map((age) => ({ age: String(age) }));
}

// ── Age Group Info ───────────────────────────────────────────────────
interface AgeGroupInfo {
  label: string;
  recommendedSI: string;
  keyRisks: string[];
  coverageTips: string[];
  criticalIllnessNeeded: boolean;
  maternityNeeded: boolean;
  topUpRecommended: boolean;
}

function getAgeGroupInfo(age: number): AgeGroupInfo {
  if (age <= 25) return {
    label: 'Young Adult',
    recommendedSI: '₹5L - ₹10L',
    keyRisks: ['Accidents', 'Sports injuries', 'Dengue/Malaria', 'Viral infections'],
    coverageTips: ['Base plan with OPD cover', 'Accident cover important', 'Wellness rewards for healthy lifestyle', 'Low premium — lock in early'],
    criticalIllnessNeeded: false,
    maternityNeeded: false,
    topUpRecommended: false,
  };
  if (age <= 30) return {
    label: 'Early Career',
    recommendedSI: '₹5L - ₹15L',
    keyRisks: ['Lifestyle diseases emerging', 'Accidents', 'Dengue/Vector-borne', 'Mental health'],
    coverageTips: ['Family floater if married', 'Maternity cover if planning family', 'Mental health coverage', 'Corporate portability option'],
    criticalIllnessNeeded: false,
    maternityNeeded: true,
    topUpRecommended: false,
  };
  if (age <= 35) return {
    label: 'Family Builder',
    recommendedSI: '₹10L - ₹25L',
    keyRisks: ['Hypertension onset', 'Diabetes risk', 'Stress-related illness', 'Maternity needs'],
    coverageTips: ['Family floater with maternity', 'Daycare procedures cover', 'Restoration benefit essential', 'Consider super top-up'],
    criticalIllnessNeeded: false,
    maternityNeeded: true,
    topUpRecommended: true,
  };
  if (age <= 40) return {
    label: 'Mid-Career',
    recommendedSI: '₹10L - ₹25L',
    keyRisks: ['Hypertension', 'Diabetes', 'Heart disease risk', 'Orthopedic issues'],
    coverageTips: ['Pre-existing disease disclosure', 'Critical illness rider recommended', 'Annual health check-up cover', 'Higher sum insured essential'],
    criticalIllnessNeeded: true,
    maternityNeeded: false,
    topUpRecommended: true,
  };
  if (age <= 45) return {
    label: 'Pre-Retirement Planning',
    recommendedSI: '₹15L - ₹50L',
    keyRisks: ['Heart disease', 'Diabetes complications', 'Cancer risk', 'Joint problems'],
    coverageTips: ['Maximum sum insured possible', 'Critical illness cover mandatory', 'No room rent capping', 'Day 1 PED cover if available'],
    criticalIllnessNeeded: true,
    maternityNeeded: false,
    topUpRecommended: true,
  };
  if (age <= 50) return {
    label: 'Peak Risk',
    recommendedSI: '₹15L - ₹1Cr',
    keyRisks: ['Cardiac issues', 'Cancer', 'Stroke', 'Kidney disease'],
    coverageTips: ['Highest affordable sum insured', 'Critical illness + health combo', 'Deductible-based top-up plans', 'Disclose all pre-existing conditions'],
    criticalIllnessNeeded: true,
    maternityNeeded: false,
    topUpRecommended: true,
  };
  if (age <= 55) return {
    label: 'Pre-Senior',
    recommendedSI: '₹25L - ₹1Cr',
    keyRisks: ['Multiple chronic conditions', 'Cancer', 'Heart attack', 'Osteoporosis'],
    coverageTips: ['Senior-focused plans available', 'Co-pay acceptable for lower premium', 'Worldwide cover for medical tourism', 'Inflation-adjusted sum insured'],
    criticalIllnessNeeded: true,
    maternityNeeded: false,
    topUpRecommended: true,
  };
  return {
    label: 'Senior Citizen',
    recommendedSI: '₹25L - ₹1Cr',
    keyRisks: ['Multiple chronic conditions', 'Cancer', 'Heart disease', 'Joint replacement', 'Cataract'],
    coverageTips: ['Senior-specific plans with PED cover', 'Co-pay 10-20% standard', 'Domiciliary treatment cover', 'AYUSH coverage included'],
    criticalIllnessNeeded: true,
    maternityNeeded: false,
    topUpRecommended: true,
  };
}

// ── Metadata ─────────────────────────────────────────────────────────
export function generateMetadata({ params }: { params: Promise<{ age: string }> }): Promise<Metadata> {
  return params.then(({ age: ageStr }) => {
    const age = parseInt(ageStr);
    if (!VALID_AGES.includes(age)) return { title: 'Age Not Found | Paliwal Secure AI' };

    const multiplier = ageMultipliers[age] || 1.0;
    const premium5L = Math.round(baseHealthPremium * multiplier);
    const info = getAgeGroupInfo(age);

    return {
      title: `Best Health Insurance for ${age}-Year-Old in India ${new Date().getFullYear()} | ₹${premium5L.toLocaleString('en-IN')}/yr | Paliwal Secure AI`,
      description: `Health insurance for ${age}-year-old in India starts at ₹${premium5L.toLocaleString('en-IN')}/yr for ₹5L cover. ${info.label} coverage recommendations, premium comparison, and age-specific tips. Get free quote.`,
      keywords: [
        `health insurance ${age} year old`,
        `best health insurance for ${age} years`,
        `health insurance premium ${age} age`,
        `medical insurance ${age} years India`,
        `${info.label.toLowerCase()} health insurance`,
        `health insurance cost age ${age}`,
        `sum insured for ${age} year old`,
      ],
      openGraph: {
        title: `Health Insurance for ${age}-Year-Old — ₹${premium5L.toLocaleString('en-IN')}/yr | Paliwal Secure AI`,
        description: `Age-specific health insurance guide for ${age}-year-olds. Premiums, coverage tips, and plan recommendations.`,
        url: `https://paliwalsecure.in/health-insurance/age-${age}`,
        siteName: 'Paliwal Secure AI',
        type: 'article',
      },
      alternates: {
        canonical: `https://paliwalsecure.in/health-insurance/age-${age}`,
      },
    };
  });
}

// ── Page Component ───────────────────────────────────────────────────
export default async function AgeHealthInsurancePage({ params }: { params: Promise<{ age: string }> }) {
  const { age: ageStr } = await params;
  const age = parseInt(ageStr);
  if (!VALID_AGES.includes(age)) notFound();

  const multiplier = ageMultipliers[age] || 1.0;
  const premium5L = Math.round(baseHealthPremium * multiplier);
  const premium10L = Math.round(baseHealthPremium * multiplier * 1.75);
  const premium25L = Math.round(baseHealthPremium * multiplier * 3.2);
  const premium50L = Math.round(baseHealthPremium * multiplier * 5.5);
  const info = getAgeGroupInfo(age);
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  // Age-specific FAQs
  const faqs = [
    {
      question: `How much does health insurance cost for a ${age}-year-old in India?`,
      answer: `Health insurance for a ${age}-year-old starts at ₹${premium5L.toLocaleString('en-IN')}/year for ₹5L sum insured. For ₹10L cover, expect ₹${premium10L.toLocaleString('en-IN')}/yr. Premiums at age ${age} are ${multiplier > 1 ? `${Math.round((multiplier - 1) * 100)}% higher than` : multiplier < 1 ? `${Math.round((1 - multiplier) * 100)}% lower than` : 'at'} the base rate (age 30). Buy early to lock in lower premiums.`,
    },
    {
      question: `What sum insured should a ${age}-year-old buy?`,
      answer: `For a ${age}-year-old (${info.label}), we recommend ${info.recommendedSI} sum insured. ${age >= 40 ? 'At this age, healthcare costs escalate rapidly — higher sum insured provides crucial financial protection.' : age >= 30 ? 'Family responsibilities and rising medical costs make adequate coverage essential.' : 'Even a basic plan provides important financial protection against unexpected hospitalization.'} Consider a super top-up plan for additional coverage at low cost.`,
    },
    {
      question: `Is critical illness cover needed at age ${age}?`,
      answer: info.criticalIllnessNeeded
        ? `Yes, critical illness cover is strongly recommended at age ${age}. Risks of heart disease, cancer, and stroke increase significantly. A ₹${Math.round(premium5L * 0.3).toLocaleString('en-IN')} - ₹${Math.round(premium5L * 0.5).toLocaleString('en-IN')}/yr critical illness rider provides ₹10-25L lump sum on diagnosis of listed conditions. This is separate from your health insurance sum insured.`
        : `Critical illness cover is optional at age ${age} but worth considering if you have a family history of cancer, heart disease, or stroke. Premiums are lower when bought young. A ₹10L critical illness plan costs just ₹${Math.round(premium5L * 0.15).toLocaleString('en-IN')} - ₹${Math.round(premium5L * 0.25).toLocaleString('en-IN')}/yr at your age.`,
    },
    {
      question: `What health risks should a ${age}-year-old watch for?`,
      answer: `At age ${age}, key health risks include: ${info.keyRisks.join(', ')}. ${age >= 40 ? 'Regular health check-ups (covered by most plans) help with early detection.' : 'Maintaining a healthy lifestyle and annual check-ups are important.'} ${info.criticalIllnessNeeded ? 'Consider critical illness cover for financial protection against major diseases.' : ''}`,
    },
    {
      question: `Can a ${age}-year-old get health insurance with pre-existing conditions?`,
      answer: `Yes, IRDAI mandates that insurers cannot reject policies based on pre-existing conditions. However, PED coverage has a waiting period of 24-48 months depending on the insurer. Some plans (like Niva Bupa ReAssure 2.0, Acko Health Plus) offer Day 1 PED cover at a higher premium. Always disclose all conditions honestly to avoid claim rejection later.`,
    },
    {
      question: `Should a ${age}-year-old buy individual or family floater?`,
      answer: age < 30
        ? `At ${age}, an individual plan is usually sufficient unless you're married. If married, a family floater covering both spouses costs less than two individual plans. Add maternity cover if planning children.`
        : age < 45
        ? `At ${age}, a family floater is recommended if you have dependents. It covers spouse and children under one sum insured at a lower total cost. However, consider a base individual plan + super top-up if any family member has higher health risks.`
        : `At ${age}, consider individual plans for each family member rather than a floater. Why? With older members, one major claim can exhaust the floater sum insured, leaving others uncovered. Individual plans ensure each person has dedicated coverage.`,
    },
  ];

  // JSON-LD Schemas
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Best Health Insurance for ${age}-Year-Old in India — ₹${premium5L.toLocaleString('en-IN')}/yr`,
    description: `Age-specific health insurance guide for ${age}-year-olds in India. Premiums, coverage tips, and plan recommendations.`,
    author: { '@type': 'Person', name: 'Himanshu Paliwal', url: 'https://paliwalsecure.in' },
    publisher: { '@type': 'Organization', name: 'Paliwal Secure AI', url: 'https://paliwalsecure.in' },
    datePublished: '2025-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    mainEntityOfPage: `https://paliwalsecure.in/health-insurance/age-${age}`,
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
      { '@type': 'ListItem', position: 3, name: `Age ${age}`, item: `https://paliwalsecure.in/health-insurance/age-${age}` },
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
          <span className="text-foreground font-medium">Age {age}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-primary" />
            <Badge variant="secondary">{info.label}</Badge>
            <Badge variant="outline">Age {age}</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Best Health Insurance for {age}-Year-Old in India {new Date().getFullYear()}
          </h1>
          <p className="text-muted-foreground">
            Age-specific health insurance guide: premiums, coverage recommendations, and expert tips for {age}-year-old Indians.
          </p>
        </div>

        {/* Key Takeaway Box */}
        <section className="mb-8">
          <QuickAnswerBox
            title={`Health Insurance at Age ${age} — Key Takeaway`}
            answers={[
              { label: '₹5L Cover', value: `₹${premium5L.toLocaleString('en-IN')}/yr` },
              { label: '₹10L Cover', value: `₹${premium10L.toLocaleString('en-IN')}/yr` },
              { label: '₹25L Cover', value: `₹${premium25L.toLocaleString('en-IN')}/yr`, highlight: true },
              { label: 'Multiplier', value: `${multiplier}x base` },
            ]}
            summary={`At age ${age}, health insurance premium is ${multiplier > 1 ? `${Math.round((multiplier - 1) * 100)}% higher than` : multiplier < 1 ? `${Math.round((1 - multiplier) * 100)}% lower than` : 'at'} the base rate (age 30). Recommended sum insured: ${info.recommendedSI}. ${info.criticalIllnessNeeded ? 'Critical illness cover is recommended.' : ''}`}
          />
        </section>

        {/* Premium Table by Sum Insured */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Premium Table — {age}-Year-Old Individual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 font-semibold">Sum Insured</th>
                      <th className="text-right py-3 font-semibold">Annual Premium</th>
                      <th className="text-right py-3 font-semibold">Monthly EMI</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3">₹5 Lakh</td>
                      <td className="text-right py-3 font-medium">₹{premium5L.toLocaleString('en-IN')}</td>
                      <td className="text-right py-3 text-muted-foreground">₹{Math.round(premium5L / 12).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">₹10 Lakh</td>
                      <td className="text-right py-3 font-medium">₹{premium10L.toLocaleString('en-IN')}</td>
                      <td className="text-right py-3 text-muted-foreground">₹{Math.round(premium10L / 12).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr className="border-b bg-primary/5">
                      <td className="py-3 font-semibold">₹25 Lakh <Badge variant="default" className="text-xs ml-1">Recommended</Badge></td>
                      <td className="text-right py-3 font-bold text-primary">₹{premium25L.toLocaleString('en-IN')}</td>
                      <td className="text-right py-3 font-medium">₹{Math.round(premium25L / 12).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">₹50 Lakh</td>
                      <td className="text-right py-3 font-medium">₹{premium50L.toLocaleString('en-IN')}</td>
                      <td className="text-right py-3 text-muted-foreground">₹{Math.round(premium50L / 12).toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                * Indicative premiums for {age}-year-old, no pre-existing conditions. Multiplier: {multiplier}x base rate.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Age Comparison Table */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Premium by Age — ₹5L Sum Insured
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 font-semibold">Age</th>
                      <th className="text-right py-3 font-semibold">Multiplier</th>
                      <th className="text-right py-3 font-semibold">₹5L Premium</th>
                      <th className="text-right py-3 font-semibold">₹10L Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    {VALID_AGES.map((a) => {
                      const m = ageMultipliers[a] || 1.0;
                      const p5 = Math.round(baseHealthPremium * m);
                      const p10 = Math.round(baseHealthPremium * m * 1.75);
                      const isCurrentAge = a === age;
                      return (
                        <tr key={a} className={`border-b ${isCurrentAge ? 'bg-primary/10 font-bold' : ''}`}>
                          <td className="py-2.5">
                            {isCurrentAge ? <Badge variant="default" className="text-xs">{a} years</Badge> : `${a} years`}
                          </td>
                          <td className="text-right py-2.5">{m}x</td>
                          <td className="text-right py-2.5 text-primary">₹{p5.toLocaleString('en-IN')}</td>
                          <td className="text-right py-2.5">₹{p10.toLocaleString('en-IN')}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Coverage Recommendations */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Coverage Recommendations for Age {age} ({info.label})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" /> Key Health Risks
                  </h4>
                  <ul className="space-y-1">
                    {info.keyRisks.map((risk) => (
                      <li key={risk} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-red-400 mt-1">•</span>{risk}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-green-600 dark:text-green-400 flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4" /> Coverage Tips
                  </h4>
                  <ul className="space-y-1">
                    {info.coverageTips.map((tip) => (
                      <li key={tip} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>{tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {info.criticalIllnessNeeded && <Badge variant="destructive" className="text-xs">Critical Illness Cover Recommended</Badge>}
                {info.maternityNeeded && <Badge variant="secondary" className="text-xs">Maternity Cover If Planning Family</Badge>}
                {info.topUpRecommended && <Badge variant="outline" className="text-xs">Super Top-Up Recommended</Badge>}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Expert Insight */}
        <section className="mb-8">
          <ExpertInsight
            insight={`At age ${age}, you're in the '${info.label}' category. ${age < 30 ? 'Buy insurance NOW — premiums are lowest and you get through waiting periods while still healthy. Lock in a 3-year plan for additional discounts.' : age < 45 ? 'Your health insurance needs are growing with family responsibilities. Ensure your sum insured is at least ' + info.recommendedSI + '. A restoration benefit ensures you have coverage even after a major claim.' : 'Don\'t compromise on sum insured at age ' + age + '. Medical inflation means today\'s ₹10L cover may be insufficient in 5 years. I recommend ' + info.recommendedSI + ' with a super top-up for catastrophic coverage.'}`}
          />
        </section>

        {/* FAQ Section */}
        <section className="mb-8">
          <FAQSection faqs={faqs} />
        </section>

        {/* Related Ages */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Health Insurance by Age</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {VALID_AGES.filter((a) => a !== age).map((a) => (
                  <Link
                    key={a}
                    href={`/health-insurance/age-${a}`}
                    className="flex items-center justify-center gap-1 p-3 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm"
                  >
                    <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Age {a}</span>
                  </Link>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 gap-2 mt-3">
                <Link href="/health-insurance/delhi" className="flex items-center gap-2 p-2.5 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm">
                  <ArrowRight className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Health Insurance by City</span>
                </Link>
                <Link href="/compare" className="flex items-center gap-2 p-2.5 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm">
                  <ArrowRight className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Compare Plans</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="mb-8">
          <Card className="border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-bold mb-2">Get Age-Optimized Health Insurance Quote</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Personalized recommendations for {age}-year-olds. Compare 10+ insurers in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg">
                  <a href={`https://wa.me/919257877312?text=Hi%2C%20I%20am%20${age}%20years%20old%20and%20need%20health%20insurance`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp Quote
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
          Last updated: {today} | Source: IRDAI, Market Data | © Paliwal Secure AI
        </p>
      </div>
    </div>
  );
}
