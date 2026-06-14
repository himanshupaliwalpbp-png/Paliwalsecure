import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  productCategories,
  locations,
  conditions,
  generateProductPageSEO,
  generateFAQSchema,
  generateOfferSchema,
} from '@/lib/programmaticSEO';
import { healthPlans } from '@/data/healthPlans';
import { termPlans } from '@/data/termPlans';
import { travelInsurancePlans } from '@/data/travelInsurancePlans';
import { cyberInsurancePlans } from '@/data/cyberInsurancePlans';
import { microInsurancePlans } from '@/data/microInsurancePlans';
import { petInsurancePlans } from '@/data/petInsurancePlans';
import { cropInsurancePlans } from '@/data/cropInsurancePlans';
import { marineInsurancePlans } from '@/data/marineInsurancePlans';
import { seniorCitizenPlans } from '@/data/seniorCitizenPlans';
import { criticalIllnessPlans } from '@/data/criticalIllnessPlans';
import { motorAddons } from '@/data/motorAddons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FAQSection } from './FAQSection';
import { QuoteForm } from './QuoteForm';

// ============================================================================
// NORMALIZED PLAN TYPE FOR DISPLAY
// ============================================================================
interface NormalizedPlan {
  id: string;
  name: string;
  insurer: string;
  premium: string;
  premiumLabel: string;
  keyFeatures: string[];
  rating: number;
  sumInsuredRange: string;
}

// ============================================================================
// MAP PRODUCT SLUG TO NORMALIZED PLANS
// ============================================================================
function getPlansForProduct(slug: string): NormalizedPlan[] {
  switch (slug) {
    case 'health-insurance':
      return healthPlans.slice(0, 4).map((p) => ({
        id: p.id,
        name: p.name,
        insurer: p.insurer,
        premium: `₹${(p.premium / 12).toLocaleString('en-IN')}/mo`,
        premiumLabel: 'Starting Premium',
        keyFeatures: p.key_features,
        rating: p.rating,
        sumInsuredRange: p.sumInsuredRange,
      }));
    case 'life-insurance':
      return termPlans.slice(0, 4).map((p) => ({
        id: p.id,
        name: p.name,
        insurer: p.insurer,
        premium: `₹${p.premium1Cr.toLocaleString('en-IN')}/yr`,
        premiumLabel: '₹1Cr Cover',
        keyFeatures: p.features,
        rating: p.rating,
        sumInsuredRange: `₹25L – ₹10Cr`,
      }));
    case 'motor-insurance':
      return [
        {
          id: 'motor-1',
          name: 'Acko Car Insurance',
          insurer: 'Acko General Insurance',
          premium: '₹1,599/yr',
          premiumLabel: 'Comprehensive',
          keyFeatures: ['Zero depreciation', 'Instant claims', 'Cashless garages', 'Roadside assistance'],
          rating: 4.6,
          sumInsuredRange: '₹30K – ₹50L',
        },
        {
          id: 'motor-2',
          name: 'HDFC ERGO Motor',
          insurer: 'HDFC ERGO General Insurance',
          premium: '₹2,100/yr',
          premiumLabel: 'Comprehensive',
          keyFeatures: ['NCB protection', 'Engine cover', 'Return to invoice', '24x7 roadside help'],
          rating: 4.5,
          sumInsuredRange: '₹30K – ₹50L',
        },
        {
          id: 'motor-3',
          name: 'ICICI Lombard Motor',
          insurer: 'ICICI Lombard General Insurance',
          premium: '₹1,850/yr',
          premiumLabel: 'Comprehensive',
          keyFeatures: ['Zero dep add-on', 'Cashless 6,500+ garages', 'Quick settlement', 'Personal accident'],
          rating: 4.4,
          sumInsuredRange: '₹30K – ₹50L',
        },
        {
          id: 'motor-4',
          name: 'Digit Motor Insurance',
          insurer: 'Go Digit General Insurance',
          premium: '₹1,499/yr',
          premiumLabel: 'Comprehensive',
          keyFeatures: ['Smartphone claims', 'No paperwork', 'Customizable IDV', 'Instant policy'],
          rating: 4.5,
          sumInsuredRange: '₹30K – ₹50L',
        },
      ];
    case 'travel-insurance':
      return travelInsurancePlans.slice(0, 4).map((p) => ({
        id: p.id,
        name: p.name,
        insurer: p.insurer,
        premium: `₹${p.singleTripPremium.toLocaleString('en-IN')}/trip`,
        premiumLabel: 'Single Trip',
        keyFeatures: p.features.slice(0, 5),
        rating: p.rating,
        sumInsuredRange: `$50K – $5L`,
      }));
    case 'home-insurance':
      return [
        {
          id: 'home-1',
          name: 'HDFC ERGO Home Insurance',
          insurer: 'HDFC ERGO General Insurance',
          premium: '₹150/mo',
          premiumLabel: 'Starting Premium',
          keyFeatures: ['Fire & burglary cover', 'Natural disaster add-on', 'Contents insurance', 'Tenants cover available'],
          rating: 4.4,
          sumInsuredRange: '₹5L – ₹5Cr',
        },
        {
          id: 'home-2',
          name: 'ICICI Lombard Home Insurance',
          insurer: 'ICICI Lombard General Insurance',
          premium: '₹180/mo',
          premiumLabel: 'Starting Premium',
          keyFeatures: ['Structure + contents', 'Earthquake cover', 'Terrorism cover', 'Rent alternative accommodation'],
          rating: 4.3,
          sumInsuredRange: '₹5L – ₹5Cr',
        },
        {
          id: 'home-3',
          name: 'Bajaj Allianz Home Insurance',
          insurer: 'Bajaj Allianz General Insurance',
          premium: '₹160/mo',
          premiumLabel: 'Starting Premium',
          keyFeatures: ['Long-term policy', 'Valuable items cover', 'Public liability', 'All-risk contents cover'],
          rating: 4.4,
          sumInsuredRange: '₹5L – ₹5Cr',
        },
        {
          id: 'home-4',
          name: 'New India Assurance Home',
          insurer: 'The New India Assurance Co. Ltd.',
          premium: '₹120/mo',
          premiumLabel: 'Starting Premium',
          keyFeatures: ['PSU insurer trust', 'Budget-friendly', 'Fire & special perils', 'Government-backed'],
          rating: 4.0,
          sumInsuredRange: '₹5L – ₹5Cr',
        },
      ];
    case 'cyber-insurance':
      return cyberInsurancePlans.slice(0, 4).map((p) => ({
        id: p.id,
        name: p.name,
        insurer: p.insurer,
        premium: `₹${p.premiumMonthly.toLocaleString('en-IN')}/mo`,
        premiumLabel: 'Monthly Premium',
        keyFeatures: p.features.slice(0, 5),
        rating: p.rating,
        sumInsuredRange: `₹2.5L – ₹15L`,
      }));
    case 'micro-insurance':
      return microInsurancePlans.slice(0, 4).map((p) => ({
        id: p.id,
        name: p.name.split('–')[0].trim(),
        insurer: p.insurer.split('(')[0].trim(),
        premium: p.premiumMonthly === 0 ? 'FREE' : `₹${p.premiumMonthly.toFixed(0)}/mo`,
        premiumLabel: p.premiumMonthly === 0 ? 'No Premium' : 'Monthly Premium',
        keyFeatures: p.features.slice(0, 5),
        rating: p.govtScheme ? 4.5 : 4.0,
        sumInsuredRange: `₹${(p.sumInsured / 100000).toFixed(0)}L`,
      }));
    case 'pet-insurance':
      return petInsurancePlans.slice(0, 4).map((p) => ({
        id: p.id,
        name: p.name,
        insurer: p.insurer,
        premium: `₹${p.premiumMonthly.toLocaleString('en-IN')}/mo`,
        premiumLabel: 'Monthly Premium',
        keyFeatures: p.features.slice(0, 5),
        rating: p.rating,
        sumInsuredRange: `₹30K – ₹5L`,
      }));
    case 'crop-insurance':
      return cropInsurancePlans.slice(0, 4).map((p) => ({
        id: p.id,
        name: p.name.split('–')[0].trim(),
        insurer: p.insurer.split('(')[0].trim(),
        premium: p.premiumRate.split('|')[0].trim(),
        premiumLabel: 'Farmer Premium',
        keyFeatures: p.features.slice(0, 5),
        rating: p.rating,
        sumInsuredRange: `₹${(p.sumInsuredPerAcre / 1000).toFixed(0)}K – ₹5L/acre`,
      }));
    case 'marine-insurance':
      return marineInsurancePlans.slice(0, 4).map((p) => ({
        id: p.id,
        name: p.name,
        insurer: p.insurer,
        premium: p.premiumRate.split('–')[0].trim(),
        premiumLabel: 'Premium Rate',
        keyFeatures: p.features.slice(0, 5),
        rating: p.rating,
        sumInsuredRange: '₹1L – ₹100Cr',
      }));
    case 'senior-citizen-insurance':
      return seniorCitizenPlans.slice(0, 4).map((p) => ({
        id: p.id,
        name: p.name,
        insurer: p.insurer,
        premium: `₹${(p.premium / 12).toLocaleString('en-IN')}/mo`,
        premiumLabel: 'Starting Premium',
        keyFeatures: p.keyFeatures,
        rating: p.rating,
        sumInsuredRange: p.sumInsuredRange,
      }));
    case 'critical-illness-insurance':
      return criticalIllnessPlans.slice(0, 4).map((p) => ({
        id: p.id,
        name: p.name,
        insurer: p.insurer,
        premium: `₹${(p.premium / 12).toLocaleString('en-IN')}/mo`,
        premiumLabel: 'Starting Premium',
        keyFeatures: p.illnesses.slice(0, 5),
        rating: p.rating,
        sumInsuredRange: p.coverAmount,
      }));
    default:
      return [];
  }
}

// ============================================================================
// GENERATE STATIC PARAMS
// ============================================================================
export function generateStaticParams() {
  return productCategories.map((cat) => ({
    product: cat.slug,
  }));
}

// ============================================================================
// GENERATE METADATA
// ============================================================================
export function generateMetadata({
  params,
}: {
  params: Promise<{ product: string }>;
}): Promise<Metadata> {
  return params.then(({ product: slug }) => {
    const product = productCategories.find((cat) => cat.slug === slug);
    if (!product) {
      return { title: 'Product Not Found | Paliwal Secure' };
    }

    const seo = generateProductPageSEO(product);

    return {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
      alternates: { canonical: seo.canonical },
      openGraph: {
        title: seo.ogTitle,
        description: seo.ogDescription,
        type: 'website',
        siteName: 'Paliwal Secure',
      },
      twitter: {
        card: 'summary_large_image',
        title: seo.ogTitle,
        description: seo.ogDescription,
      },
    };
  });
}

// ============================================================================
// STAR RATING COMPONENT
// ============================================================================
function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: full }).map((_, i) => (
        <span key={`f${i}`} className="text-amber-400 text-sm">★</span>
      ))}
      {half && <span className="text-amber-400 text-sm">★</span>}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`e${i}`} className="text-gray-300 text-sm">★</span>
      ))}
      <span className="ml-1 text-xs text-muted-foreground font-medium">{rating}</span>
    </span>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
export default async function ProductLandingPage({
  params,
}: {
  params: Promise<{ product: string }>;
}) {
  const { product: slug } = await params;
  const product = productCategories.find((cat) => cat.slug === slug);

  if (!product) {
    notFound();
  }

  const plans = getPlansForProduct(slug);
  const topLocations = locations.slice(0, 10);
  const relatedConditions = conditions.filter((c) =>
    c.relatedProducts.includes(slug)
  );

  // Generate schema markup
  const seo = generateProductPageSEO(product);
  const faqSchema = generateFAQSchema(product.faqs);
  const offerSchema = generateOfferSchema(product);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 via-white to-white">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.schemaMarkup) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerSchema) }}
      />

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              <span className="text-xl">🛡️</span>
              <span>Paliwal Secure</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-emerald-700 transition-colors"
              >
                ← Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* ===== HERO SECTION ===== */}
        <section className="relative py-12 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800" />
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtMmgtNHYyaC0ydjRoLTJ2Mmg0djJoMnYtMmgydi0yem0tOC02aDR2MmgtNHYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')]" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="text-5xl md:text-7xl mb-4">{product.icon}</div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
              {product.name}
            </h1>
            <p className="text-emerald-100 text-lg md:text-xl mb-2 font-medium">
              {product.nameHindi}
            </p>
            <p className="text-emerald-50/90 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              {product.description}
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Badge className="bg-white/20 text-white border-white/30 text-sm px-3 py-1">
                💰 Avg Premium: {product.avgPremium}
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 text-sm px-3 py-1">
                📊 Cover: {product.sumInsuredRange}
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 text-sm px-3 py-1">
                ✅ IRDAI Compliant
              </Badge>
            </div>
            <a href="#quote-form">
              <Button
                size="lg"
                className="bg-white text-emerald-700 hover:bg-emerald-50 font-bold text-base px-8 h-12 shadow-lg"
              >
                Request a Quote →
              </Button>
            </a>
          </div>
        </section>

        {/* ===== FEATURED PLANS SECTION ===== */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
              Top {product.name} Plans
            </h2>
            <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
              Compare the best {product.name.toLowerCase()} plans in India for 2026. Handpicked by our insurance experts.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className="relative hover:shadow-lg transition-shadow border-emerald-100 hover:border-emerald-300"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base leading-snug">
                        {plan.name}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className="bg-emerald-50 text-emerald-700 shrink-0 text-xs"
                      >
                        ⭐ Featured
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {plan.insurer}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">{plan.premiumLabel}</p>
                      <p className="text-xl font-bold text-emerald-700">{plan.premium}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Sum Insured</p>
                      <p className="text-sm font-semibold">{plan.sumInsuredRange}</p>
                    </div>
                    <StarRating rating={plan.rating} />
                    <ul className="space-y-1 pt-1">
                      {plan.keyFeatures.slice(0, 4).map((feature, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <a href="#quote-form">
                      <Button
                        variant="outline"
                        className="w-full mt-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 text-xs"
                      >
                        Get Quote
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ===== MOTOR ADD-ONS SECTION (for motor insurance only) ===== */}
        {slug === 'motor-insurance' && (
          <section className="py-12 md:py-16 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
                Essential Motor Insurance Add-ons
              </h2>
              <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
                Supercharge your motor insurance with these recommended add-on covers.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
                {motorAddons.map((addon) => (
                  <Card key={addon.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{addon.name}</h3>
                        {addon.recommended && (
                          <Badge className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0">
                            Recommended
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{addon.description}</p>
                      <div className="flex justify-between text-xs">
                        <span className="text-emerald-700 font-semibold">{addon.avgCost}</span>
                        <span className="text-muted-foreground">Best for: {addon.bestForVehicleAge}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== FAQ SECTION ===== */}
        <section className="bg-gray-50/50">
          <FAQSection faqs={product.faqs} />
        </section>

        {/* ===== QUOTE FORM SECTION ===== */}
        <section id="quote-form" className="py-12 md:py-16">
          <div className="max-w-xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
              Request a Free Quote
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              Get personalized {product.name.toLowerCase()} recommendations from our expert advisors.
            </p>
            <Card className="border-emerald-200 shadow-md">
              <CardContent className="p-6">
                <QuoteForm productName={product.name} />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ===== LOCATION LINKS SECTION ===== */}
        <section className="py-12 md:py-16 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
              {product.name} in Top Cities
            </h2>
            <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
              Find the best {product.name.toLowerCase()} plans available in your city with local premium rates and network providers.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-h-64 overflow-y-auto">
              {topLocations.map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/${slug}/${loc.slug}`}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all text-sm group"
                >
                  <span className="text-emerald-600 group-hover:text-emerald-700">📍</span>
                  <div>
                    <p className="font-medium text-xs leading-tight">{loc.name}</p>
                    <p className="text-[10px] text-muted-foreground">{loc.state}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CONDITION LINKS SECTION ===== */}
        {relatedConditions.length > 0 && (
          <section className="py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
                {product.name} for Specific Needs
              </h2>
              <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
                Looking for {product.name.toLowerCase()} with a specific condition? We have you covered.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {relatedConditions.map((cond) => (
                  <Link
                    key={cond.slug}
                    href={`/${slug}/for-${cond.slug}`}
                    className="block p-4 rounded-xl bg-white border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-sm group-hover:text-emerald-700 transition-colors">
                        {cond.name}
                      </h3>
                      <span className="text-xs text-muted-foreground">{cond.nameHindi}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {cond.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== KEYWORDS/SEO SECTION ===== */}
        <section className="py-10 bg-gray-50/50 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs text-muted-foreground text-center mb-3">
              Popular searches for {product.name.toLowerCase()}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {product.keywords.slice(0, 8).map((kw) => (
                <Badge
                  key={kw}
                  variant="outline"
                  className="text-xs text-muted-foreground border-gray-200"
                >
                  {kw}
                </Badge>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛡️</span>
              <span className="font-bold text-white">Paliwal Secure</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/#quiz" className="hover:text-white transition-colors">
                Bima Beast Quiz
              </Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-500 leading-relaxed max-w-3xl mx-auto">
              <strong className="text-gray-400">Disclaimer:</strong> IRDAI compliant — educational purpose only. Not investment advice.
              Insurance is a subject matter of solicitation. All plans, premiums, and features mentioned are indicative and may vary.
              Please read policy documents carefully before purchase. Paliwal Secure is an insurance comparison platform and is not
              a registered insurance intermediary. Product information is sourced from public IRDAI data and insurer disclosures.
            </p>
          </div>
          <p className="text-xs text-gray-600 text-center mt-4">
            © {new Date().getFullYear()} Paliwal Secure. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
