import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { healthInsurers, getInsurerBySlug } from '@/data/insurers';
import { ExpertInsight } from '@/components/geo/ExpertInsight';
import { FAQSection } from '@/components/geo/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileText, Phone, MessageCircle, ChevronRight,
  ClipboardList, Upload, Clock, CheckCircle2, AlertCircle, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

// ── Static Params ────────────────────────────────────────────────────
export function generateStaticParams() {
  return healthInsurers.map((i) => ({ insurer: i.slug }));
}

// ── Metadata ─────────────────────────────────────────────────────────
export function generateMetadata({ params }: { params: Promise<{ insurer: string }> }): Promise<Metadata> {
  return params.then(({ insurer }) => {
    const data = getInsurerBySlug(insurer);
    if (!data) return { title: 'Insurer Not Found | Paliwal Secure AI' };

    return {
      title: `${data.logoPlaceholder || data.name} Claim Process ${new Date().getFullYear()} — Step-by-Step Guide | Paliwal Secure AI`,
      description: `Complete guide to filing ${data.logoPlaceholder || data.name} health insurance claims. Cashless & reimbursement process, documents needed, claim timeline, helpline numbers. CSR ${data.csr}%.`,
      keywords: [
        `${data.logoPlaceholder || data.name} claim process`,
        `${data.logoPlaceholder || data.name} health insurance claim`,
        `how to file ${data.logoPlaceholder || data.name} claim`,
        `${data.logoPlaceholder || data.name} cashless claim`,
        `${data.logoPlaceholder || data.name} reimbursement claim`,
        `${data.logoPlaceholder || data.name} claim settlement ratio`,
        `${data.logoPlaceholder || data.name} claim helpline`,
      ],
      openGraph: {
        title: `${data.logoPlaceholder || data.name} Claim Process — Step-by-Step Guide`,
        description: `How to file ${data.logoPlaceholder || data.name} health insurance claim. Cashless & reimbursement process with timeline.`,
        url: `https://paliwalsecure.in/claim-guide/${data.slug}`,
        siteName: 'Paliwal Secure AI',
        type: 'article',
        images: [{
          url: `https://paliwalsecure.in/api/og?title=${encodeURIComponent(`${data.name} Claim Process Guide`)}&type=claim&description=${encodeURIComponent(`How to file ${data.name} health insurance claim`)}`,
          width: 1200,
          height: 630,
          alt: `${data.name} Claim Process Guide`,
          type: 'image/png',
        }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${data.logoPlaceholder || data.name} Claim Process — Step-by-Step Guide`,
        description: `How to file ${data.logoPlaceholder || data.name} health insurance claim.`,
        images: [`https://paliwalsecure.in/api/og?title=${encodeURIComponent(`${data.name} Claim Process Guide`)}&type=claim`],
      },
      alternates: {
        canonical: `https://paliwalsecure.in/claim-guide/${data.slug}`,
      },
    };
  });
}

// ── Claim Steps ──────────────────────────────────────────────────────
interface ClaimStep {
  icon: React.ReactNode;
  title: string;
  description: string;
  timeline: string;
  tips: string;
}

function getClaimSteps(insurerName: string, slug: string): ClaimStep[] {
  return [
    {
      icon: <Phone className="h-5 w-5" />,
      title: 'Notify Insurer Within 24-48 Hours',
      description: `Call ${insurerName} helpline or use their app to register your claim. For planned hospitalization, intimate 3-5 days before admission. Emergency cases can be intimated within 24 hours of admission.`,
      timeline: 'Within 24-48 hours of admission',
      tips: 'Keep your policy number and health card handy. Note down the claim reference number.',
    },
    {
      icon: <ClipboardList className="h-5 w-5" />,
      title: 'Choose Claim Type: Cashless or Reimbursement',
      description: `Cashless: Visit a network hospital — ${insurerName} pays directly. Reimbursement: Pay first, submit bills later. Cashless is recommended as you pay zero upfront at network hospitals.`,
      timeline: 'Decide before admission',
      tips: `Always check if your hospital is in ${insurerName}'s network before choosing cashless.`,
    },
    {
      icon: <Upload className="h-5 w-5" />,
      title: 'Submit Pre-Authorization (Cashless)',
      description: `The hospital sends a pre-authorization form to ${insurerName}. The insurer reviews and approves within 2-4 hours. Show your health card and ID at the hospital helpdesk.`,
      timeline: '2-4 hours for approval',
      tips: 'If pre-auth is partially approved, you can appeal with additional medical documents.',
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: 'Gather Required Documents',
      description: `Collect all documents: Policy copy, ID proof (Aadhaar/PAN), hospital bills with payment receipts, discharge summary, doctor consultation papers, investigation reports, pharmacy bills, and filled claim form.`,
      timeline: 'At discharge',
      tips: 'Take photos of all documents as backup. Get itemized bills instead of consolidated bills.',
    },
    {
      icon: <CheckCircle2 className="h-5 w-5" />,
      title: 'Claim Settlement',
      description: `For cashless: Pay only non-covered amount (deductibles, co-pay). For reimbursement: Submit claim form with all documents within 15-30 days. ${insurerName} processes claims as per IRDAI guidelines.`,
      timeline: 'Cashless: At discharge | Reimbursement: 15-30 days',
      tips: 'IRDAI mandates claim settlement within 30 days. If delayed beyond 30 days, insurer pays interest.',
    },
    {
      icon: <AlertCircle className="h-5 w-5" />,
      title: 'If Claim is Rejected — Appeal',
      description: `If ${insurerName} rejects your claim, ask for written rejection reason. File an appeal with the insurer's grievance cell within 15 days. If unresolved, approach Insurance Ombudsman (free service). Call Paliwal Secure for free claim assistance.`,
      timeline: 'Appeal within 15 days of rejection',
      tips: `Don't accept rejection easily. ${insurerName}'s grievance cell must respond within 15 days. Insurance Ombudsman resolves most cases within 1-3 months.`,
    },
  ];
}

// ── Page Component ───────────────────────────────────────────────────
export default async function ClaimGuidePage({ params }: { params: Promise<{ insurer: string }> }) {
  const { insurer } = await params;
  const data = getInsurerBySlug(insurer);
  if (!data) notFound();

  const shortName = data.logoPlaceholder || data.name;
  const steps = getClaimSteps(shortName, data.slug);
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  // FAQs
  const faqs = [
    {
      question: `How long does ${shortName} take to settle a claim?`,
      answer: `${shortName} typically settles cashless claims in 2-4 hours for pre-authorization. For reimbursement claims, the turnaround time is 15-30 days. IRDAI mandates all claims must be settled within 30 days of receiving all documents. If delayed, the insurer must pay interest at bank rate + 2%.`,
    },
    {
      question: `What is ${shortName}'s claim settlement ratio?`,
      answer: `${shortName} has a claim settlement ratio of ${data.csr}% (IRDAI 2023-24 data). ${data.csr >= 99 ? 'This is excellent — one of the best in the industry.' : data.csr >= 95 ? 'This is above industry average.' : 'This is moderate — ensure you understand policy terms clearly.'} ${shortName} has ${(data.networkHospitals ?? 0).toLocaleString()} network hospitals for cashless claims.`,
    },
    {
      question: `Can I file ${shortName} claims online?`,
      answer: `Yes, ${shortName} allows online claim intimation through their website and mobile app. You can track claim status, upload documents, and get pre-authorization online. For reimbursement claims, all documents can be submitted digitally.`,
    },
    {
      question: `What documents are needed for ${shortName} health insurance claim?`,
      answer: `Documents needed: (1) Policy copy/health card, (2) ID proof (Aadhaar/PAN), (3) Hospital bills with payment receipts, (4) Discharge summary, (5) Doctor consultation papers, (6) Investigation reports (blood tests, X-ray, MRI), (7) Pharmacy bills with prescriptions, (8) Claim form (duly filled), (9) FIR copy (for accident cases), (10) NEFT details for reimbursement payment.`,
    },
    {
      question: `What if ${shortName} rejects my claim?`,
      answer: `If ${shortName} rejects your claim: (1) Ask for written rejection reason, (2) Review your policy terms — check if the reason is valid, (3) File appeal with ${shortName}'s grievance cell within 15 days, (4) If unresolved, approach Insurance Ombudsman (free), (5) Contact Paliwal Secure at +91 9257877312 for free claim assistance. Most rejections happen due to non-disclosure or waiting periods.`,
    },
    {
      question: `Does ${shortName} cover pre-existing diseases?`,
      answer: `${shortName} covers pre-existing diseases after a waiting period of 24-48 months as per the plan. Some plans offer shorter waiting periods. Always disclose all pre-existing conditions at the time of buying the policy to avoid claim rejection later.`,
    },
  ];

  // JSON-LD: HowTo schema
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to File ${shortName} Health Insurance Claim`,
    description: `Step-by-step guide to filing ${shortName} health insurance claim — both cashless and reimbursement process.`,
    totalTime: 'PT30M',
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'INR', value: '0' },
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.description,
    })),
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${shortName} Claim Process — Step-by-Step Guide`,
    description: `Complete guide to filing ${shortName} health insurance claims with cashless and reimbursement process.`,
    author: { '@type': 'Person', name: 'Himanshu Paliwal', url: 'https://paliwalsecure.in' },
    publisher: { '@type': 'Organization', name: 'Paliwal Secure AI', url: 'https://paliwalsecure.in' },
    datePublished: '2025-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    mainEntityOfPage: `https://paliwalsecure.in/claim-guide/${data.slug}`,
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
      { '@type': 'ListItem', position: 2, name: 'Claim Guide', item: 'https://paliwalsecure.in/claim-guide' },
      { '@type': 'ListItem', position: 3, name: `${shortName} Claims`, item: `https://paliwalsecure.in/claim-guide/${data.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/claim-guide" className="hover:text-primary">Claim Guide</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">{shortName}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-primary" />
            <Badge variant="secondary">Claim Process</Badge>
            <Badge variant="outline">CSR {data.csr}%</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {shortName} Health Insurance Claim Process — Step-by-Step Guide
          </h1>
          <p className="text-muted-foreground">
            Complete guide to filing {data.name} health insurance claims. Cashless & reimbursement process, documents, timelines, and expert tips.
          </p>
        </div>

        {/* Quick Stats */}
        <section className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="p-4 text-center">
              <p className="text-xs text-muted-foreground">Claim Settlement</p>
              <p className="text-xl font-bold text-primary">{data.csr}%</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-xs text-muted-foreground">Network Hospitals</p>
              <p className="text-xl font-bold">{(data.networkHospitals ?? 0).toLocaleString()}</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-xs text-muted-foreground">Cashless Time</p>
              <p className="text-xl font-bold text-green-600">2-4hr</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-xs text-muted-foreground">Reimbursement</p>
              <p className="text-xl font-bold">15-30 days</p>
            </Card>
          </div>
        </section>

        {/* Step-by-Step Guide */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                {shortName} Claim Process — Step by Step
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={index} className="relative flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold shrink-0">
                        {index + 1}
                      </div>
                      {index < steps.length - 1 && <div className="w-0.5 flex-1 bg-primary/20 mt-1" />}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-primary">{step.icon}</div>
                        <h3 className="font-semibold text-sm">{step.title}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{step.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />{step.timeline}
                        </Badge>
                      </div>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-start gap-1">
                        <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                        {step.tips}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Documents Checklist */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Documents Checklist for {shortName} Claim
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  'Policy copy / Health Card',
                  'ID Proof (Aadhaar/PAN)',
                  'Hospital bills with payment receipts',
                  'Discharge summary',
                  'Doctor consultation papers',
                  'Investigation reports (blood test, X-ray, MRI)',
                  'Pharmacy bills with prescriptions',
                  'Claim form (duly filled & signed)',
                  'FIR copy (for accident cases)',
                  'NEFT/bank details for reimbursement',
                ].map((doc) => (
                  <div key={doc} className="flex items-center gap-2 text-sm p-2 rounded bg-muted/30">
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                    {doc}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Expert Insight */}
        <section className="mb-8">
          <ExpertInsight
            insight={`${shortName} has a ${data.csr}% claim settlement ratio — ${data.csr >= 90 ? 'above industry average' : 'moderate by industry standards'}. Key tips for ${shortName} claims: (1) Always choose network hospitals for cashless claims, (2) Intimate within 24 hours — don't delay, (3) Keep itemized bills instead of consolidated ones, (4) ${data.waitingPeriod ? data.waitingPeriod : 'Check your specific plan for PED waiting period details.'} If your claim is rejected, don't give up — I can help you appeal and get it settled.`}
          />
        </section>

        {/* FAQ Section */}
        <section className="mb-8">
          <FAQSection faqs={faqs} />
        </section>

        {/* Related Claim Guides */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Other Insurer Claim Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-2">
                {healthInsurers
                  .filter((i) => i.slug !== data.slug)
                  .map((i) => (
                    <Link
                      key={i.slug}
                      href={`/claim-guide/${i.slug}`}
                      className="flex items-center gap-2 p-2.5 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm"
                    >
                      <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{i.logoPlaceholder || i.name} Claim Process</span>
                    </Link>
                  ))}
              </div>
              <div className="grid sm:grid-cols-2 gap-2 mt-2">
                <Link href="/compare" className="flex items-center gap-2 p-2.5 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm">
                  <ArrowRight className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Compare Health Insurance</span>
                </Link>
                <Link href="/health-insurance" className="flex items-center gap-2 p-2.5 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm">
                  <ArrowRight className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Health Insurance Plans</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="mb-8">
          <Card className="border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-bold mb-2">Need Help with {shortName} Claim?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Free claim assistance from IRDAI-certified advisor. Don&apos;t let your claim get rejected.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg">
                  <a href={`https://wa.me/919257877312?text=Hi%2C%20I%20need%20help%20with%20${encodeURIComponent(shortName)}%20claim`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp Claim Help
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
                IRDAI Certified Advisor | POSP Code: IP429834 | Free claim assistance
              </p>
            </CardContent>
          </Card>
        </section>

        <p className="text-xs text-center text-muted-foreground">
          Last updated: {today} | Source: IRDAI, {shortName} | © Paliwal Secure AI
        </p>
      </div>
    </div>
  );
}
