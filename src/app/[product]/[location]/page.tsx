import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  productCategories,
  locations,
  conditions,
  generateLocationPageSEO,
  generateConditionPageSEO,
  generateFAQSchema,
  generateOfferSchema,
  type SEOProductCategory,
} from '@/lib/programmaticSEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { MapPin, Shield, Phone, ArrowLeft, Building2, Users, Lightbulb, Heart, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';

// ============================================================================
// Helpers
// ============================================================================

function findProduct(productSlug: string): SEOProductCategory | undefined {
  return productCategories.find((p) => p.slug === productSlug);
}

function findLocation(locationSlug: string) {
  return locations.find((l) => l.slug === locationSlug);
}

function findCondition(conditionSlug: string) {
  return conditions.find((c) => c.slug === conditionSlug);
}

function isConditionPage(locationParam: string): boolean {
  return locationParam.startsWith('for-');
}

function extractConditionSlug(locationParam: string): string {
  return locationParam.replace(/^for-/, '');
}

/** Get nearby cities in the same state */
function getNearbyCities(location: (typeof locations)[0], count = 4) {
  return locations
    .filter((l) => l.state === location.state && l.slug !== location.slug)
    .slice(0, count);
}

/** Local tips for a product in a location */
function getLocalTips(product: SEOProductCategory, location: (typeof locations)[0]): string[] {
  const baseTips: Record<string, string[]> = {
    'health-insurance': [
      `Check cashless network hospitals near ${location.name} — top insurers have 50+ empanelled hospitals in ${location.tier} cities`,
      `${location.state} state government health schemes may complement your private health insurance`,
      `${location.tier} city residents often get 5-15% lower premiums than metro cities for the same cover`,
      `Ensure your preferred hospital in ${location.name} is in the insurer's cashless network before buying`,
    ],
    'life-insurance': [
      `${location.name} residents should consider term insurance with 10-15x annual income as cover`,
      `Online term plans are 30-40% cheaper than offline — buy directly from insurer websites`,
      `Medical tests for term insurance in ${location.name} can be done at home — most insurers offer doorstep medicals`,
      `Add critical illness rider to your term plan for comprehensive protection at minimal extra cost`,
    ],
    'motor-insurance': [
      `Traffic density in ${location.name} is ${location.tier === 'Tier-1' ? 'very high' : 'moderate'} — zero depreciation cover is essential`,
      `Ensure your motor insurance covers flood damage — ${location.name} experiences ${location.tier === 'Tier-1' ? 'heavy monsoon flooding' : 'seasonal waterlogging'}`,
      `Compare NCB protection add-on — it preserves your discount even after small claims`,
      `Roadside assistance is crucial for ${location.name} — check 24/7 availability in your area`,
    ],
    'travel-insurance': [
      `If flying from ${location.name} airport, ensure travel insurance covers flight delays and cancellations`,
      `Schengen visa applicants from ${location.name} need minimum €30,000 medical coverage`,
      `Check if your travel insurance covers adventure activities if traveling to hill stations`,
      `Compare baggage loss coverage limits — budget airlines have higher incident rates`,
    ],
    'home-insurance': [
      `${location.name} properties should include ${location.tier === 'Tier-1' ? 'flood and heavy rain' : 'natural disaster'} coverage`,
      `Tenants in ${location.name} should insure contents — landlords' insurance won't cover your belongings`,
      `Get property valued by an approved surveyor in ${location.name} for accurate sum insured`,
      `Earthquake cover is an add-on — ${location.state} may be in a seismic zone, check before skipping`,
    ],
    'cyber-insurance': [
      `${location.name} has ${location.tier === 'Tier-1' ? 'very high' : 'growing'} digital transaction volume — cyber insurance is essential`,
      `UPI fraud cases in ${location.state} are rising — ensure your cyber policy covers digital payment fraud`,
      `Cyber insurance covers social media account hacking — important for active users`,
      `Check if your cyber policy covers IT consultant costs for data recovery`,
    ],
    'micro-insurance': [
      `PMJJBY and PMSBY enrollment is through your bank account — visit any branch in ${location.name}`,
      `Ayushman Bharat health card can be made at nearest CSC center in ${location.name}`,
      `Atal Pension Yojana gives guaranteed pension — enroll before age 40 for best benefits`,
      `All micro-insurance schemes have auto-debit from bank accounts — ensure sufficient balance`,
    ],
    'pet-insurance': [
      `Veterinary costs in ${location.name} are ${location.tier === 'Tier-1' ? '20-30% higher' : 'more affordable'} than other cities`,
      `Check if your preferred vet clinic in ${location.name} accepts cashless pet insurance claims`,
      `Pet insurance in India primarily covers dogs and cats — check breed-specific conditions`,
      `Vaccination records are mandatory for pet insurance claims — maintain proper documentation`,
    ],
    'crop-insurance': [
      `Kharif season PMFBY deadline in ${location.state} is typically June-July — apply through your bank or CSC`,
      `Rabi season cut-off is October-November — don't miss the enrollment window`,
      `Weather-based crop insurance uses ${location.name} IMD data — more objective claim settlement`,
      `PMFBY premium is subsidized — farmers pay only 1.5-2% of sum insured for food crops`,
    ],
    'marine-insurance': [
      `${location.tier === 'Tier-1' ? 'Major port city — ensure marine policy covers port storage risks' : 'Inland transit insurance covers goods moving through ' + location.name}`,
      `Open marine policy is better for regular shipments — covers all transit automatically`,
      `Check warehouse-to-warehouse clause — covers goods from origin godown to destination godown`,
      `Marine insurance claim requires survey report — report damage within 24-48 hours`,
    ],
    'senior-citizen-insurance': [
      `Senior citizens in ${location.name} get ₹50,000 deduction under Section 80D — use it fully`,
      `Co-payment of 10-30% is standard in senior citizen plans — compare before buying`,
      `Day 1 PED cover is available from select insurers — ideal for senior citizens with existing conditions`,
      `Pre-policy health check-up may be required — ${location.name} has many empanelled diagnostic centers`,
    ],
    'critical-illness-insurance': [
      `CI insurance pays lumpsum on diagnosis — use for treatment, lifestyle adjustment, or income replacement`,
      `Critical illness cover is independent of health insurance — buy both for complete protection`,
      `Check the list of covered illnesses — standard plans cover 15-40 conditions`,
      `Survival period clause: most CI plans require surviving 30 days after diagnosis for claim`,
    ],
  };
  return baseTips[product.slug] || [
    `Compare multiple ${product.name.toLowerCase()} plans available in ${location.name} before deciding`,
    `Online purchase of ${product.name.toLowerCase()} is typically 10-30% cheaper than offline`,
    `Read the policy wordings carefully — understand exclusions and waiting periods`,
    `Keep all documents handy for smooth claim settlement in ${location.name}`,
  ];
}

/** Tips for getting insured with a specific condition */
function getConditionTips(product: SEOProductCategory, condition: (typeof conditions)[0]): string[] {
  const baseConditionTips: Record<string, Record<string, string[]>> = {
    diabetes: {
      'health-insurance': [
        'Declare diabetes honestly — non-disclosure can lead to claim rejection',
        'IRDAI mandates max 36-month PED waiting period (2024 guidelines)',
        'Day 1 PED cover available from Aditya Birla Activ One and Star Health',
        'Monitor HbA1c levels — insurers may offer better terms for controlled diabetes',
        'Group health insurance through employer covers diabetes from Day 1',
      ],
      'critical-illness-insurance': [
        'Diabetes complications (kidney failure, heart attack) are covered under CI plans',
        'CI insurance pays lumpsum regardless of diabetes history — buy it alongside health insurance',
        'Declare diabetes — some CI plans have diabetes-specific exclusions for related conditions',
      ],
      'senior-citizen-insurance': [
        'Senior citizen plans with co-payment are more lenient on diabetes disclosure',
        'Star Health Senior Citizen Red Carpet covers diabetes after waiting period',
        'Pre-policy check-up may include blood sugar tests — be prepared',
      ],
      _default: [
        'Declare diabetes in your insurance application — honesty prevents claim rejection',
        'Compare plans that specifically mention diabetes coverage',
        'Maintain good medical records for smoother claim processing',
      ],
    },
    hypertension: {
      'health-insurance': [
        'Hypertension is classified as a pre-existing disease — declare it upfront',
        'Controlled hypertension with medication may get standard premiums from some insurers',
        'Include cardiac check-up rider for hypertension monitoring',
        'Cashless claims for BP-related hospitalization are widely accepted',
      ],
      _default: [
        'Declare hypertension — it affects underwriting but non-disclosure is worse',
        'Regular BP monitoring records help in claims processing',
        'Some insurers offer better terms for controlled hypertension',
      ],
    },
    'heart-disease': {
      'health-insurance': [
        'Heart disease is covered after PED waiting period (24-48 months typically)',
        'Day 1 cover available from select insurers at higher premium',
        'Include cardiac-specific riders for comprehensive heart coverage',
        'Post-surgery follow-ups are covered under most health plans',
      ],
      'critical-illness-insurance': [
        'Heart attack and bypass surgery are standard CI covered conditions',
        'CI payout can fund expensive cardiac procedures beyond health insurance limits',
        'Survival period of 30 days applies for heart-related CI claims',
      ],
      _default: [
        'Heart patients should have both health insurance and CI cover',
        'Declare all cardiac history including minor procedures',
        'Maintain cardiac reports for claim documentation',
      ],
    },
    cancer: {
      'health-insurance': [
        'Cancer treatment (chemo, radiation, surgery) is covered under comprehensive health plans',
        'Day 1 cancer cover available from ICICI Pru Heart/Cancer Protect',
        'Health insurance covers hospitalization but may not cover all chemo drugs — check formulary',
        'Restoration benefit restores sum insured after cancer claim — look for this feature',
      ],
      'critical-illness-insurance': [
        'Cancer at any stage is covered under most CI plans — lumpsum payout on diagnosis',
        'CI payout is tax-free and can be used for any purpose',
        'Early-stage cancer also triggers CI claim in comprehensive plans',
      ],
      _default: [
        'Cancer insurance should be bought early — premiums rise with age',
        'Both health + CI insurance recommended for comprehensive cancer coverage',
        'Declare family history of cancer — affects premium but ensures claim validity',
      ],
    },
    _default: {
      _default: [
        'Always declare your medical condition honestly in the insurance application',
        'Compare waiting periods for pre-existing disease coverage across insurers',
        'IRDAI mandates max 48-month PED waiting period — know your rights',
        'Keep medical records organized for smooth claim processing',
        'Consider Day 1 PED cover if available — eliminates waiting period',
      ],
    },
  };

  const conditionTips = baseConditionTips[condition.slug] || baseConditionTips._default;
  return conditionTips[product.slug] || conditionTips._default || baseConditionTips._default._default;
}

/** Relevant plan recommendations based on product & condition */
function getRelevantPlans(product: SEOProductCategory, condition: (typeof conditions)[0]): { name: string; highlight: string }[] {
  const planMap: Record<string, Record<string, { name: string; highlight: string }[]>> = {
    diabetes: {
      'health-insurance': [
        { name: 'Aditya Birla Activ One', highlight: 'Day 1 PED cover — diabetes covered from policy start' },
        { name: 'Star Health Comprehensive', highlight: 'Diabetes-specific wellness program included' },
        { name: 'Niva Bupa ReAssure', highlight: 'No PED loading for controlled diabetes' },
        { name: 'HDFC ERGO Optima Secure', highlight: 'Shorter 24-month PED waiting period' },
      ],
      'critical-illness-insurance': [
        { name: 'HDFC Life Critical Illness', highlight: 'Covers diabetes complications — kidney failure, heart attack' },
        { name: 'Max Life CI Rider', highlight: 'Add to life insurance for comprehensive protection' },
      ],
      _default: [
        { name: 'Star Health Diabetes Safe', highlight: 'Designed specifically for diabetic patients' },
        { name: 'Aditya Birla Activ Health', highlight: 'Day 1 PED cover + wellness rewards' },
      ],
    },
    cancer: {
      'health-insurance': [
        { name: 'ICICI Pru Heart/Cancer Protect', highlight: 'Dedicated cancer cover with lumpsum payout' },
        { name: 'Star Health Comprehensive', highlight: 'Covers chemotherapy, radiation, and surgery' },
        { name: 'Niva Bupa ReAssure', highlight: 'Unlimited restoration benefit for cancer claims' },
      ],
      'critical-illness-insurance': [
        { name: 'HDFC Life Critical Illness', highlight: 'Covers all stages of cancer — early to advanced' },
        { name: 'Aditya Birla CI Cover', highlight: 'Tax-free lumpsum on cancer diagnosis' },
      ],
      _default: [
        { name: 'ICICI Pru Cancer Cover', highlight: 'Affordable dedicated cancer insurance' },
      ],
    },
    _default: {
      _default: [
        { name: product.featuredPlans[0] || 'Comprehensive Plan', highlight: 'Top-rated plan with wide coverage' },
        { name: product.featuredPlans[1] || 'Value Plan', highlight: 'Best value for money — compare premiums' },
        { name: product.featuredPlans[2] || 'Premium Plan', highlight: 'Maximum coverage with add-ons' },
      ],
    },
  };

  const conditionPlans = planMap[condition.slug] || planMap._default;
  return conditionPlans[product.slug] || conditionPlans._default || planMap._default._default;
}

// ============================================================================
// generateStaticParams — Pre-render top pages
// ============================================================================

const TOP_LOCATIONS = 20;
const TOP_PRODUCTS = 6;

export function generateStaticParams() {
  const params: { product: string; location: string }[] = [];

  const topProducts = productCategories.slice(0, TOP_PRODUCTS);
  const topLocations = locations.slice(0, TOP_LOCATIONS);

  // Product × Location pages
  for (const product of topProducts) {
    for (const location of topLocations) {
      params.push({
        product: product.slug,
        location: location.slug,
      });
    }
  }

  // Product × Condition pages (all combinations where condition is relevant)
  for (const product of productCategories) {
    const relevantConditions = conditions.filter((c) =>
      c.relatedProducts.includes(product.slug)
    );
    for (const condition of relevantConditions) {
      params.push({
        product: product.slug,
        location: `for-${condition.slug}`,
      });
    }
  }

  return params;
}

// ============================================================================
// generateMetadata — Unique SEO meta tags
// ============================================================================

export function generateMetadata({
  params,
}: {
  params: Promise<{ product: string; location: string }>;
}): Promise<Metadata> {
  return params.then((resolvedParams) => {
    const { product: productSlug, location: locationParam } = resolvedParams;
    const product = findProduct(productSlug);

    if (!product) {
      return { title: 'Page Not Found | Paliwal Secure' };
    }

    if (isConditionPage(locationParam)) {
      const conditionSlug = extractConditionSlug(locationParam);
      const condition = findCondition(conditionSlug);

      if (!condition || !condition.relatedProducts.includes(productSlug)) {
        return { title: 'Page Not Found | Paliwal Secure' };
      }

      const seoData = generateConditionPageSEO(product, condition);

      return {
        title: seoData.title,
        description: seoData.description,
        keywords: seoData.keywords,
        openGraph: {
          title: seoData.ogTitle,
          description: seoData.ogDescription,
          url: seoData.url,
          siteName: 'Paliwal Secure',
          type: 'website',
          locale: 'en_IN',
        },
        twitter: {
          card: 'summary_large_image',
          title: seoData.ogTitle,
          description: seoData.ogDescription,
        },
        alternates: {
          canonical: seoData.canonical,
        },
      };
    }

    // Location page
    const location = findLocation(locationParam);

    if (!location) {
      return { title: 'Page Not Found | Paliwal Secure' };
    }

    const seoData = generateLocationPageSEO(product, location);

    return {
      title: seoData.title,
      description: seoData.description,
      keywords: seoData.keywords,
      openGraph: {
        title: seoData.ogTitle,
        description: seoData.ogDescription,
        url: seoData.url,
        siteName: 'Paliwal Secure',
        type: 'website',
        locale: 'en_IN',
      },
      twitter: {
        card: 'summary_large_image',
        title: seoData.ogTitle,
        description: seoData.ogDescription,
      },
      alternates: {
        canonical: seoData.canonical,
      },
    };
  });
}

// ============================================================================
// Page Component
// ============================================================================

export default async function ProductLocationPage({
  params,
}: {
  params: Promise<{ product: string; location: string }>;
}) {
  const { product: productSlug, location: locationParam } = await params;

  const product = findProduct(productSlug);
  if (!product) {
    notFound();
  }

  // --------------------------------------------------
  // CONDITION PAGE
  // --------------------------------------------------
  if (isConditionPage(locationParam)) {
    const conditionSlug = extractConditionSlug(locationParam);
    const condition = findCondition(conditionSlug);

    if (!condition || !condition.relatedProducts.includes(productSlug)) {
      notFound();
    }

    const seoData = generateConditionPageSEO(product, condition);
    const tips = getConditionTips(product, condition);
    const relevantPlans = getRelevantPlans(product, condition);

    // Build FAQ list: product FAQs + condition-specific
    const faqItems = [
      ...product.faqs,
      {
        q: `Can I get ${product.name.toLowerCase()} if I have ${condition.name}?`,
        a: `Yes! Under IRDAI guidelines, insurers cannot deny ${product.name.toLowerCase()} based on ${condition.name} alone. However, there may be a waiting period (24-48 months for pre-existing diseases) or premium loading. Some plans offer Day 1 PED cover.`,
      },
      {
        q: `What documents do I need to declare ${condition.name} in my ${product.name.toLowerCase()} application?`,
        a: `You'll need medical reports confirming your ${condition.name} diagnosis, current medication details, and recent test results. Honest disclosure ensures smooth claim settlement later.`,
      },
      {
        q: `Will my premium be higher because of ${condition.name}?`,
        a: `It depends on the severity and control of your ${condition.name}. Some insurers charge 10-30% extra (loading) for pre-existing conditions. Compare multiple insurers — some like Aditya Birla and Star Health offer standard premiums for controlled conditions.`,
      },
    ];

    const faqSchema = generateFAQSchema(faqItems);
    const offerSchema = generateOfferSchema(product);

    return (
      <div className="min-h-screen bg-background">
        {/* JSON-LD Schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seoData.schemaMarkup) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(offerSchema) }}
        />

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-amber-50 dark:from-emerald-950/30 dark:via-background dark:to-amber-950/20 border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href={`/${product.slug}`} className="hover:text-primary transition-colors">{product.name}</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-medium">For {condition.name}</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs">
                    <Heart className="w-3 h-3 mr-1" />
                    {condition.nameHindi}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {product.icon} {product.name}
                  </Badge>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                  {product.name} for{' '}
                  <span className="text-emerald-600 dark:text-emerald-400">{condition.name}</span>{' '}
                  Patients
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mb-6">
                  {condition.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/#quote">
                    <Button size="lg" className="gap-2">
                      <Phone className="w-4 h-4" />
                      Request a Quote
                    </Button>
                  </Link>
                  <Link href={`/${product.slug}`}>
                    <Button size="lg" variant="outline" className="gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      {product.name} Overview
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Quick Info Card */}
              <Card className="w-full md:w-80 shrink-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    Quick Facts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Product</span>
                    <span className="font-medium">{product.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Condition</span>
                    <span className="font-medium">{condition.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg. Premium</span>
                    <span className="font-medium">{product.avgPremium}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cover Range</span>
                    <span className="font-medium">{product.sumInsuredRange}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">PED Waiting</span>
                    <span className="font-medium">24-48 months</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Relates */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                How {condition.name} Affects Your {product.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>
                Having <strong>{condition.name}</strong> doesn&apos;t mean you can&apos;t get{' '}
                <strong>{product.name}</strong>. IRDAI guidelines ensure that insurance companies
                cannot outright reject your application based on a pre-existing condition. However,
                there are important considerations:
              </p>
              <ul className="mt-3 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Waiting Period:</strong> Pre-existing conditions like {condition.name} typically have a 24-48 month waiting period before coverage begins</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Premium Loading:</strong> Some insurers may charge 10-30% extra premium based on your condition severity</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Day 1 PED Cover:</strong> Select plans now offer coverage from Day 1 — no waiting period for pre-existing conditions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Mandatory Disclosure:</strong> Always declare {condition.name} — non-disclosure can lead to claim rejection</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Tips for Getting Insured */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-amber-500" />
            Tips for Getting {product.name} with {condition.name}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tips.map((tip, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 text-emerald-600 text-sm font-bold">
                      {i + 1}
                    </div>
                    <p className="text-sm leading-relaxed">{tip}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Recommended Plans */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-600" />
            Recommended Plans for {condition.name} Patients
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {relevantPlans.map((plan, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow border-emerald-200 dark:border-emerald-800">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">{plan.highlight}</p>
                    </div>
                    <Badge variant="secondary" className="shrink-0 text-xs">Recommended</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-sm sm:text-base">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Other Conditions for this Product */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-2xl font-bold mb-6">Other Conditions Covered Under {product.name}</h2>
          <div className="flex flex-wrap gap-2">
            {conditions
              .filter((c) => c.relatedProducts.includes(product.slug) && c.slug !== condition.slug)
              .map((c) => (
                <Link key={c.slug} href={`/${product.slug}/for-${c.slug}`}>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors py-2 px-3"
                  >
                    {c.name} ({c.nameHindi})
                  </Badge>
                </Link>
              ))}
          </div>
        </section>

        {/* IRDAI Disclaimer */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                  <p className="font-semibold mb-1">IRDAI Disclaimer</p>
                  <p>
                    Insurance is a subject matter of solicitation. Paliwal Secure is an IRDAI-registered
                    insurance advisory platform. All insurance products are offered by IRDAI-licensed
                    insurance companies. Premium rates, coverage, and terms are subject to change as per
                    insurer policies. Pre-existing disease coverage is subject to waiting periods and
                    policy terms. Please read the policy document carefully before purchase. For
                    grievances, contact IRDAI at 1800-267-0076 or grievances@irdai.gov.in.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    );
  }

  // --------------------------------------------------
  // LOCATION PAGE
  // --------------------------------------------------
  const location = findLocation(locationParam);

  if (!location) {
    notFound();
  }

  const seoData = generateLocationPageSEO(product, location);
  const nearbyCities = getNearbyCities(location);
  const localTips = getLocalTips(product, location);

  // Build FAQ list: product FAQs + location-specific
  const faqItems = [
    ...product.faqs,
    {
      q: `What is the average ${product.name.toLowerCase()} premium in ${location.name}?`,
      a: `The average ${product.name.toLowerCase()} premium in ${location.name}, ${location.state} starts from ${product.avgPremium}. Premiums in ${location.tier} cities are typically ${location.tier === 'Tier-1' ? '10-20% higher' : '5-15% lower'} compared to other cities. Your actual premium depends on age, sum insured, and health condition.`,
    },
    {
      q: `Which are the best ${product.name.toLowerCase()} companies in ${location.name}?`,
      a: `Top ${product.name.toLowerCase()} providers in ${location.name} include ${product.featuredPlans.slice(0, 3).join(', ')}. Compare claim settlement ratios, network hospitals, and customer reviews before choosing.`,
    },
    {
      q: `How to file a ${product.name.toLowerCase()} claim in ${location.name}?`,
      a: `For cashless claims, visit any network hospital/center in ${location.name} and show your e-card. For reimbursement, submit bills and documents to the insurer within 30-60 days. Most insurers now offer app-based claims for faster processing.`,
    },
  ];

  const faqSchema = generateFAQSchema(faqItems);
  const offerSchema = generateOfferSchema(product);

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(seoData.schemaMarkup) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerSchema) }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-sky-50 dark:from-emerald-950/30 dark:via-background dark:to-sky-950/20 border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/${product.slug}`} className="hover:text-primary transition-colors">{product.name}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">{location.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="text-xs">
                  <MapPin className="w-3 h-3 mr-1" />
                  {location.tier} City
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {product.icon} {product.name}
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                {product.name} in{' '}
                <span className="text-emerald-600 dark:text-emerald-400">{location.name}</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-6">
                Compare the best {product.name.toLowerCase()} plans available in {location.name},{' '}
                {location.state}. {product.description}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/#quote">
                  <Button size="lg" className="gap-2">
                    <Phone className="w-4 h-4" />
                    Request a Quote
                  </Button>
                </Link>
                <Link href={`/${product.slug}`}>
                  <Button size="lg" variant="outline" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    {product.name} Overview
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Info Card */}
            <Card className="w-full md:w-80 shrink-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  {location.name} at a Glance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">City</span>
                  <span className="font-medium">{location.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">State</span>
                  <span className="font-medium">{location.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Population</span>
                  <span className="font-medium">{location.population}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">City Tier</span>
                  <span className="font-medium">{location.tier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg. Premium</span>
                  <span className="font-medium">{product.avgPremium}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cover Range</span>
                  <span className="font-medium">{product.sumInsuredRange}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Plans for this City */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Shield className="w-6 h-6 text-emerald-600" />
          Top {product.name} Plans in {location.name}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {product.featuredPlans.map((plan, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-lg shrink-0">
                    {product.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm leading-tight">{plan}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Available in {location.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <span className="text-xs text-muted-foreground">Starting</span>
                  <span className="font-bold text-emerald-600 text-sm">{product.avgPremium}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Local Tips */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-amber-500" />
          Local Tips for {location.name}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {localTips.map((tip, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0 text-amber-600 text-sm font-bold">
                    {i + 1}
                  </div>
                  <p className="text-sm leading-relaxed">{tip}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Request a Quote CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Card className="bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-800 dark:to-emerald-900 text-white border-0">
          <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold mb-2">
                Get Personalized {product.name} Quotes for {location.name}
              </h2>
              <p className="text-emerald-100 text-sm sm:text-base">
                Our AI-powered engine compares 51+ insurers to find you the best {product.name.toLowerCase()}{' '}
                plan in {location.name}, {location.state}. Free comparison, no spam.
              </p>
            </div>
            <Link href="/#quote">
              <Button size="lg" variant="secondary" className="gap-2 shrink-0">
                <Phone className="w-4 h-4" />
                Request a Quote
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* FAQ Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-bold mb-6">
          {product.name} in {location.name} — FAQs
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-sm sm:text-base">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Nearby Cities */}
      {nearbyCities.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-sky-500" />
            {product.name} in Nearby Cities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {nearbyCities.map((city) => (
              <Link key={city.slug} href={`/${product.slug}/${city.slug}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-sky-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm group-hover:text-emerald-600 transition-colors">
                        {city.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{city.state}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Other Conditions for this Product */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Users className="w-6 h-6 text-violet-500" />
          {product.name} for Specific Conditions
        </h2>
        <div className="flex flex-wrap gap-2">
          {conditions
            .filter((c) => c.relatedProducts.includes(product.slug))
            .map((c) => (
              <Link key={c.slug} href={`/${product.slug}/for-${c.slug}`}>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors py-2 px-3"
                >
                  For {c.name} ({c.nameHindi})
                </Badge>
              </Link>
            ))}
        </div>
      </section>

      {/* Other Products in this City */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Shield className="w-6 h-6 text-emerald-600" />
          Other Insurance in {location.name}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {productCategories
            .filter((p) => p.slug !== product.slug)
            .map((p) => (
              <Link key={p.slug} href={`/${p.slug}/${location.slug}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-4 flex items-center gap-3">
                    <span className="text-xl">{p.icon}</span>
                    <p className="font-medium text-sm group-hover:text-emerald-600 transition-colors">
                      {p.name}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
        </div>
      </section>

      {/* IRDAI Disclaimer */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                <p className="font-semibold mb-1">IRDAI Disclaimer</p>
                <p>
                  Insurance is a subject matter of solicitation. Paliwal Secure is an IRDAI-registered
                  insurance advisory platform. All insurance products are offered by IRDAI-licensed
                  insurance companies. Premium rates, coverage, and terms are subject to change as per
                  insurer policies. {location.name}-specific premiums and network availability may vary.
                  Please read the policy document carefully before purchase. For grievances, contact IRDAI
                  at 1800-267-0076 or grievances@irdai.gov.in.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
