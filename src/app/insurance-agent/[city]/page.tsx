import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cities, getCityBySlug, type City } from '@/data/cities';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MapPin, Phone, MessageCircle, ShieldCheck, Award, Users,
  Heart, Car, Bike, Plane, Home, TrendingUp, CheckCircle2,
  Building2, Star, Clock, ArrowRight, Sparkles, Calculator,
} from 'lucide-react';

// ────────────────────────────────────────────────────────────────────────────
// Static Params — generate page for each city
// ────────────────────────────────────────────────────────────────────────────
export function generateStaticParams() {
  return cities.map((c) => ({ city: c.slug }));
}

// ────────────────────────────────────────────────────────────────────────────
// Metadata — SEO optimized per city
// ────────────────────────────────────────────────────────────────────────────
export function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  return params.then(({ city }) => {
    const cityData = getCityBySlug(city);
    if (!cityData) return { title: 'City Not Found | Paliwal Secure AI' };

    const tierLabel = cityData.tier === 'metro' ? 'Metro' : cityData.tier === 'tier2' ? 'Tier-2' : 'Tier-3';

    return {
      title: `Insurance Agent in ${cityData.name} ${cityData.state} ${new Date().getFullYear()} | IRDAI POSP IP429834 | Paliwal Secure AI`,
      description: `Best insurance agent in ${cityData.name}, ${cityData.state}. Compare 51+ insurers for health, car, bike, life, travel & home insurance. Free consultation by IRDAI Registered POSP (IP429834). 500+ families served. ${tierLabel} city rates. Call 9258777312.`,
      keywords: [
        `insurance agent ${cityData.name}`,
        `insurance advisor ${cityData.name} ${cityData.state}`,
        `best insurance agent in ${cityData.name}`,
        `health insurance ${cityData.name}`,
        `car insurance ${cityData.name}`,
        `bike insurance ${cityData.name}`,
        `life insurance ${cityData.name}`,
        `term insurance ${cityData.name}`,
        `insurance consultant ${cityData.name}`,
        `IRDAI POSP ${cityData.name}`,
        `insurance agent near me ${cityData.name}`,
        `${cityData.name} insurance advisor`,
        `insurance comparison ${cityData.name}`,
        `cashless hospital ${cityData.name}`,
        `motor insurance ${cityData.name}`,
        `travel insurance ${cityData.name}`,
        `home insurance ${cityData.name}`,
        `insurance agent ${cityData.state}`,
        `${tierLabel} city insurance ${cityData.name}`,
        `Himanshu Paliwal insurance ${cityData.name}`,
      ],
      openGraph: {
        title: `Insurance Agent in ${cityData.name} — IRDAI POSP IP429834 | Paliwal Secure AI`,
        description: `Trusted insurance advisor in ${cityData.name}, ${cityData.state}. Compare 51+ insurers. Free consultation by IRDAI Registered POSP. Call 9258777312.`,
        url: `https://paliwalsecure.in/insurance-agent/${cityData.slug}`,
        siteName: 'Paliwal Secure AI',
        type: 'profile',
        locale: 'en_IN',
      },
      twitter: {
        card: 'summary_large_image',
        title: `Insurance Agent ${cityData.name} — Paliwal Secure AI`,
        description: `IRDAI POSP IP429834. Compare 51+ insurers. Free consultation. ${cityData.name}, ${cityData.state}.`,
      },
      alternates: {
        canonical: `https://paliwalsecure.in/insurance-agent/${cityData.slug}`,
      },
      robots: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    };
  });
}

// ────────────────────────────────────────────────────────────────────────────
// Helper: format currency
// ────────────────────────────────────────────────────────────────────────────
function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

// ────────────────────────────────────────────────────────────────────────────
// Main Page Component
// ────────────────────────────────────────────────────────────────────────────
export default async function CityInsuranceAgentPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const cityData = getCityBySlug(city);
  if (!cityData) notFound();

  const tierLabel = cityData.tier === 'metro' ? 'Metro' : cityData.tier === 'tier2' ? 'Tier-2' : 'Tier-3';
  const tierMultiplier = cityData.tier === 'metro' ? 1.15 : cityData.tier === 'tier2' ? 1.0 : 0.92;

  // City-specific estimates
  const basePremium = 6500;
  const healthPremium = Math.round(basePremium * tierMultiplier);
  const carPremium = Math.round(4500 * tierMultiplier);
  const bikePremium = Math.round(1200 * tierMultiplier);
  const termPremium = Math.round(15000 * tierMultiplier);
  const hospitalCount = cityData.hospitalCount ?? (cityData.tier === 'metro' ? 500 : cityData.tier === 'tier2' ? 150 : 50);
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  // City-specific FAQ schema (JSON-LD)
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Who is the best insurance agent in ${cityData.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Himanshu Paliwal — IRDAI Registered POSP (Code: IP429834) — is one of the top insurance advisors in ${cityData.name}, ${cityData.state}. With 500+ families served and 4.9★ rating, he offers free consultation across health, motor, life, travel, and home insurance from 51+ IRDAI-registered insurers. Contact: +91-92587-77312.`,
        },
      },
      {
        '@type': 'Question',
        name: `How much does health insurance cost in ${cityData.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Health insurance in ${cityData.name} (${tierLabel} city) starts at ${formatINR(healthPremium)}/year for ₹5 Lakh cover for a 30-year-old. Being a ${tierLabel} city, premiums are ${cityData.tier === 'metro' ? '~15% higher due to medical costs' : cityData.tier === 'tier3' ? '~8% lower than metros' : 'at base rate'}. For ₹10 Lakh cover, expect ${formatINR(Math.round(healthPremium * 1.75))}/yr. Family floater for 4 members: ${formatINR(Math.round(healthPremium * 2.2))}/yr.`,
        },
      },
      {
        '@type': 'Question',
        name: `Which insurers are available in ${cityData.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `All 51+ IRDAI-registered insurers serve ${cityData.name}: HDFC ERGO, ICICI Lombard, Star Health, Bajaj Allianz, TATA AIG, Care Health, Niva Bupa, ACKO, Digit, SBI General, New India Assurance, Royal Sundaram, Reliance General, Universal Sompo, Magma HDI, and more. ${hospitalCount}+ network hospitals in ${cityData.name} offer cashless treatment.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is cashless health insurance available in ${cityData.name} hospitals?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes, ${hospitalCount}+ hospitals in ${cityData.name} offer cashless treatment through insurer networks. IRDAI mandates cashless claim approval within 1 hour and discharge within 3 hours. Major networks include Apollo, Fortis, Max, AIIMS, and local multi-specialty hospitals. Paliwal Secure helps you find plans with maximum network hospitals in ${cityData.name}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Can I get insurance consultation at home in ${cityData.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes! Himanshu Paliwal offers free home/office consultation in ${cityData.name} and nearby areas. WhatsApp +91-92587-77312 to schedule. Alternatively, InsureGPT AI chatbot (24/7 on paliwalsecure.in) provides instant Hinglish/Hindi/English guidance on insurance queries.`,
        },
      },
    ],
  };

  // Local business JSON-LD
  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'InsuranceAgency',
    name: 'Paliwal Secure AI — Insurance Advisor',
    description: `IRDAI Registered POSP insurance advisor in ${cityData.name}, ${cityData.state}. Health, motor, life, travel, home insurance from 51+ insurers.`,
    url: `https://paliwalsecure.in/insurance-agent/${cityData.slug}`,
    telephone: '+91-92587-77312',
    email: 'himanshupaliwalpbp@gmail.com',
    areaServed: {
      '@type': 'City',
      name: cityData.name,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: cityData.name,
      addressRegion: cityData.state,
      addressCountry: 'IN',
    },
    founder: {
      '@type': 'Person',
      name: 'Himanshu Paliwal',
      jobTitle: 'IRDAI Registered POSP',
      identifier: 'IP429834',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '200',
    },
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116]">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />

      {/* ═══════════════════════════════════════════════════════════════
          HERO SECTION
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative pt-16 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 section-glow" />
        <div className="relative max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[#4A4F57] dark:text-[#A8B0C2] mb-6">
            <Link href="/" className="hover:text-[#B8482C] dark:hover:text-[#E8C872]">Home</Link>
            <span>›</span>
            <Link href="/insurance-agent" className="hover:text-[#B8482C] dark:hover:text-[#E8C872]">Insurance Agents</Link>
            <span>›</span>
            <span className="text-[#0E1116] dark:text-[#FAF7F2] font-medium">{cityData.name}</span>
          </nav>

          <div className="text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6F4EF] dark:bg-[rgba(45,106,79,0.18)] border border-[rgba(45,106,79,0.25)] text-[#2D6A4F] dark:text-[#6EE7B7] text-xs font-semibold mb-6"
            >
              <MapPin className="w-3.5 h-3.5" />
              {cityData.name}, {cityData.state} · {tierLabel} City
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0E1116] dark:text-[#FAF7F2] mb-4">
              Insurance Agent in{' '}
              <span className="text-[#B8482C] dark:text-[#E8C872]">{cityData.name}</span>
            </h1>
            <p className="text-base sm:text-lg text-[#4A4F57] dark:text-[#A8B0C2] max-w-3xl mx-auto mb-8">
              IRDAI Registered POSP (IP429834) · 51+ insurers compared · 500+ families served in {cityData.state}
              <br />
              <span className="text-sm">Free consultation · {tierLabel} city rates · Cashless claims support</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <a href="https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20need%20insurance%20consultation%20in%20{cityData.name}" target="_blank" rel="noopener noreferrer">
                <Button className="bg-[#2D6A4F] hover:bg-[#235541] text-white">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp Now
                </Button>
              </a>
              <a href="tel:+919257877312">
                <Button variant="outline" className="border-[#B8482C] text-[#B8482C] hover:bg-[#FBE8E1]">
                  <Phone className="w-4 h-4 mr-2" />
                  Call 92587-77312
                </Button>
              </a>
              <Link href="/insuregpt">
                <Button variant="outline" className="border-[#B8860B] text-[#B8860B] hover:bg-[#FBF3DD]">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Ask InsureGPT
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#4A4F57] dark:text-[#A8B0C2]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2D6A4F]" />
                IRDAI POSP IP429834
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-[#B8860B]" />
                4.9/5 (200+ reviews)
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#B8482C]" />
                500+ families
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#2D6A4F]" />
                24/7 support
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          INSURANCE TYPES WITH CITY-SPECIFIC PREMIUMS
         ═══════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#0E1116] dark:text-[#FAF7F2] mb-3">
            Insurance Plans Available in {cityData.name}
          </h2>
          <p className="text-center text-sm text-[#4A4F57] dark:text-[#A8B0C2] mb-10 max-w-2xl mx-auto">
            {tierLabel} city rates · Real-time premium estimates · All 51+ IRDAI-registered insurers
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Health Insurance */}
            <Link href="/health-insurance" className="block">
              <Card className="card-ivory-vault h-full hover:scale-[1.02] transition-transform">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-[#E6F4EF] dark:bg-[rgba(45,106,79,0.18)] flex items-center justify-center">
                      <Heart className="w-6 h-6 text-[#2D6A4F]" />
                    </div>
                    <Badge variant="outline" className="bg-[#E6F4EF] text-[#2D6A4F] border-[rgba(45,106,79,0.25)]">
                      {hospitalCount}+ hospitals
                    </Badge>
                  </div>
                  <h3 className="font-bold text-[#0E1116] dark:text-[#FAF7F2] mb-1">Health Insurance</h3>
                  <p className="text-xs text-[#4A4F57] dark:text-[#A8B0C2] mb-3">Cashless treatment in {cityData.name}</p>
                  <p className="text-sm text-[#4A4F57] dark:text-[#A8B0C2]">Starting</p>
                  <p className="text-2xl font-bold text-[#2D6A4F]">{formatINR(healthPremium)}<span className="text-sm font-normal text-[#4A4F57] dark:text-[#A8B0C2]">/yr</span></p>
                </CardContent>
              </Card>
            </Link>

            {/* Car Insurance */}
            <Link href="/car-insurance" className="block">
              <Card className="card-ivory-vault h-full hover:scale-[1.02] transition-transform">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-[#FBE8E1] dark:bg-[rgba(184,72,44,0.18)] flex items-center justify-center">
                      <Car className="w-6 h-6 text-[#B8482C]" />
                    </div>
                    <Badge variant="outline" className="bg-[#FBE8E1] text-[#B8482C] border-[rgba(184,72,44,0.25)]">
                      Comprehensive
                    </Badge>
                  </div>
                  <h3 className="font-bold text-[#0E1116] dark:text-[#FAF7F2] mb-1">Car Insurance</h3>
                  <p className="text-xs text-[#4A4F57] dark:text-[#A8B0C2] mb-3">Zero dep + IDV + NCB</p>
                  <p className="text-sm text-[#4A4F57] dark:text-[#A8B0C2]">Starting</p>
                  <p className="text-2xl font-bold text-[#B8482C]">{formatINR(carPremium)}<span className="text-sm font-normal text-[#4A4F57] dark:text-[#A8B0C2]">/yr</span></p>
                </CardContent>
              </Card>
            </Link>

            {/* Bike Insurance */}
            <Link href="/bike-insurance" className="block">
              <Card className="card-ivory-vault h-full hover:scale-[1.02] transition-transform">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-[#FBE8E1] dark:bg-[rgba(184,72,44,0.18)] flex items-center justify-center">
                      <Bike className="w-6 h-6 text-[#B8482C]" />
                    </div>
                    <Badge variant="outline" className="bg-[#FBE8E1] text-[#B8482C] border-[rgba(184,72,44,0.25)]">
                      Comprehensive
                    </Badge>
                  </div>
                  <h3 className="font-bold text-[#0E1116] dark:text-[#FAF7F2] mb-1">Bike Insurance</h3>
                  <p className="text-xs text-[#4A4F57] dark:text-[#A8B0C2] mb-3">Third party + Own damage</p>
                  <p className="text-sm text-[#4A4F57] dark:text-[#A8B0C2]">Starting</p>
                  <p className="text-2xl font-bold text-[#B8482C]">{formatINR(bikePremium)}<span className="text-sm font-normal text-[#4A4F57] dark:text-[#A8B0C2]">/yr</span></p>
                </CardContent>
              </Card>
            </Link>

            {/* Life/Term Insurance */}
            <Link href="/life-insurance" className="block">
              <Card className="card-ivory-vault h-full hover:scale-[1.02] transition-transform">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-[#E6F4EF] dark:bg-[rgba(45,106,79,0.18)] flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-[#2D6A4F]" />
                    </div>
                    <Badge variant="outline" className="bg-[#E6F4EF] text-[#2D6A4F] border-[rgba(45,106,79,0.25)]">
                      ₹1 Cr cover
                    </Badge>
                  </div>
                  <h3 className="font-bold text-[#0E1116] dark:text-[#FAF7F2] mb-1">Life / Term Insurance</h3>
                  <p className="text-xs text-[#4A4F57] dark:text-[#A8B0C2] mb-3">Secure family's future</p>
                  <p className="text-sm text-[#4A4F57] dark:text-[#A8B0C2]">Starting</p>
                  <p className="text-2xl font-bold text-[#2D6A4F]">{formatINR(termPremium)}<span className="text-sm font-normal text-[#4A4F57] dark:text-[#A8B0C2]">/yr</span></p>
                </CardContent>
              </Card>
            </Link>

            {/* Travel Insurance */}
            <Link href="/travel-insurance" className="block">
              <Card className="card-ivory-vault h-full hover:scale-[1.02] transition-transform">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-[#FBF3DD] dark:bg-[rgba(184,134,11,0.18)] flex items-center justify-center">
                      <Plane className="w-6 h-6 text-[#B8860B]" />
                    </div>
                    <Badge variant="outline" className="bg-[#FBF3DD] text-[#8B6508] border-[rgba(184,134,11,0.25)]">
                      International
                    </Badge>
                  </div>
                  <h3 className="font-bold text-[#0E1116] dark:text-[#FAF7F2] mb-1">Travel Insurance</h3>
                  <p className="text-xs text-[#4A4F57] dark:text-[#A8B0C2] mb-3">From {cityData.name} airport</p>
                  <p className="text-sm text-[#4A4F57] dark:text-[#A8B0C2]">Starting</p>
                  <p className="text-2xl font-bold text-[#B8860B]">₹256<span className="text-sm font-normal text-[#4A4F57] dark:text-[#A8B0C2]">/trip</span></p>
                </CardContent>
              </Card>
            </Link>

            {/* Home Insurance */}
            <Link href="/home-insurance" className="block">
              <Card className="card-ivory-vault h-full hover:scale-[1.02] transition-transform">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-[#FBF3DD] dark:bg-[rgba(184,134,11,0.18)] flex items-center justify-center">
                      <Home className="w-6 h-6 text-[#B8860B]" />
                    </div>
                    <Badge variant="outline" className="bg-[#FBF3DD] text-[#8B6508] border-[rgba(184,134,11,0.25)]">
                      Structure + Contents
                    </Badge>
                  </div>
                  <h3 className="font-bold text-[#0E1116] dark:text-[#FAF7F2] mb-1">Home Insurance</h3>
                  <p className="text-xs text-[#4A4F57] dark:text-[#A8B0C2] mb-3">Protect your {cityData.name} property</p>
                  <p className="text-sm text-[#4A4F57] dark:text-[#A8B0C2]">Starting</p>
                  <p className="text-2xl font-bold text-[#B8860B]">₹1,500<span className="text-sm font-normal text-[#4A4F57] dark:text-[#A8B0C2]">/yr</span></p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHY CHOOSE US
         ═══════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 bg-white dark:bg-[#161A24] border-y border-[rgba(15,19,32,0.06)] dark:border-[rgba(232,200,114,0.10)]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#0E1116] dark:text-[#FAF7F2] mb-10">
            Why {cityData.name} Residents Choose Paliwal Secure
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Award,
                title: 'IRDAI Certified',
                desc: `Registered POSP (IP429834) — legally authorized to sell insurance in ${cityData.name} and across India.`,
                color: 'emerald',
              },
              {
                icon: Users,
                title: '500+ Families',
                desc: `Trusted by 500+ Indian families including many in ${cityData.name} and ${cityData.state}.`,
                color: 'sienna',
              },
              {
                icon: TrendingUp,
                title: 'Best Price Promise',
                desc: `Compare 51+ insurers to find lowest premium for ${cityData.name} (${tierLabel} city rates).`,
                color: 'gold',
              },
              {
                icon: ShieldCheck,
                title: 'Claim Support',
                desc: `End-to-end claim assistance — from filing to payout. Local ${cityData.name} hospital network support.`,
                color: 'emerald',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              const colors = {
                emerald: 'bg-[#E6F4EF] dark:bg-[rgba(45,106,79,0.18)] text-[#2D6A4F] dark:text-[#6EE7B7] border-[rgba(45,106,79,0.20)]',
                sienna: 'bg-[#FBE8E1] dark:bg-[rgba(184,72,44,0.18)] text-[#B8482C] dark:text-[#F0A88B] border-[rgba(184,72,44,0.20)]',
                gold: 'bg-[#FBF3DD] dark:bg-[rgba(184,134,11,0.18)] text-[#B8860B] dark:text-[#E8C872] border-[rgba(184,134,11,0.22)]',
              };
              return (
                <div key={i} className="text-center">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 border ${colors[item.color as keyof typeof colors]}`}>
                    <Icon className="w-6 h-6" strokeWidth={2} />
                  </div>
                  <h3 className="text-base font-bold text-[#0E1116] dark:text-[#FAF7F2] mb-2">{item.title}</h3>
                  <p className="text-sm text-[#4A4F57] dark:text-[#A8B0C2] leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CITY-SPECIFIC INFO
         ═══════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#0E1116] dark:text-[#FAF7F2] mb-8">
            Insurance in {cityData.name} — Complete Guide
          </h2>

          <div className="prose prose-sm sm:prose-base max-w-none text-[#4A4F57] dark:text-[#A8B0C2] space-y-4">
            <p>
              <strong className="text-[#0E1116] dark:text-[#FAF7F2]">{cityData.name}</strong>, located in{' '}
              <strong className="text-[#0E1116] dark:text-[#FAF7F2]">{cityData.state}</strong>, is classified as a{' '}
              <strong className="text-[#B8482C] dark:text-[#E8C872]">{tierLabel} city</strong> by IRDAI for insurance premium calculation.
              {cityData.tier === 'metro' && ' Being a metro, medical costs are ~15% higher, reflecting in health insurance premiums.'}
              {cityData.tier === 'tier2' && ' Tier-2 cities have standard insurance rates — moderate healthcare costs.'}
              {cityData.tier === 'tier3' && ' Tier-3 cities enjoy ~8% lower premiums due to lower healthcare costs.'}
            </p>

            <p>
              As of <strong>{today}</strong>, residents of {cityData.name} have access to{' '}
              <strong className="text-[#2D6A4F]">{hospitalCount}+ network hospitals</strong> offering cashless treatment
              across all major insurers. IRDAI mandates cashless claim approval within <strong>1 hour</strong> and discharge
              within <strong>3 hours</strong> — a rule that applies to all hospitals in {cityData.name}.
            </p>

            <p>
              <strong className="text-[#0E1116] dark:text-[#FAF7F2]">Himanshu Paliwal</strong> — IRDAI Registered POSP
              (Code: <strong>IP429834</strong>) — serves {cityData.name} and nearby areas with comprehensive insurance
              advisory. With <strong>500+ families served</strong> and a <strong>4.9★ rating</strong>, he offers free
              consultation across health, motor (car + bike), life/term, travel, and home insurance from{' '}
              <strong>51+ IRDAI-registered insurers</strong>.
            </p>

            <h3 className="text-xl font-bold text-[#0E1116] dark:text-[#FAF7F2] mt-6 mb-3">
              Insurance Premium Estimates for {cityData.name}
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#2D6A4F] shrink-0 mt-0.5" />
                <span><strong>Health Insurance (₹5L cover, 30-yr-old):</strong> {formatINR(healthPremium)}/year</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#2D6A4F] shrink-0 mt-0.5" />
                <span><strong>Health Insurance (₹10L cover):</strong> {formatINR(Math.round(healthPremium * 1.75))}/year</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#2D6A4F] shrink-0 mt-0.5" />
                <span><strong>Family Floater (4 members, ₹10L):</strong> {formatINR(Math.round(healthPremium * 2.2))}/year</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#2D6A4F] shrink-0 mt-0.5" />
                <span><strong>Car Insurance (Comprehensive):</strong> {formatINR(carPremium)}/year</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#2D6A4F] shrink-0 mt-0.5" />
                <span><strong>Bike Insurance (Comprehensive):</strong> {formatINR(bikePremium)}/year</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#2D6A4F] shrink-0 mt-0.5" />
                <span><strong>Term Insurance (₹1 Cr cover, 30-yr-old):</strong> {formatINR(termPremium)}/year</span>
              </li>
            </ul>

            <h3 className="text-xl font-bold text-[#0E1116] dark:text-[#FAF7F2] mt-6 mb-3">
              Top Insurers Available in {cityData.name}
            </h3>
            <p>
              All 51+ IRDAI-registered insurers serve {cityData.name}, including: HDFC ERGO, ICICI Lombard, Star Health,
              Bajaj Allianz, TATA AIG, Care Health, Niva Bupa, ACKO, Digit, SBI General, New India Assurance, Royal
              Sundaram, Reliance General, Universal Sompo, Magma HDI, and more. Compare plans side-by-side on our{' '}
              <Link href="/compare" className="text-[#B8482C] dark:text-[#E8C872] underline">compare page</Link>.
            </p>

            <h3 className="text-xl font-bold text-[#0E1116] dark:text-[#FAF7F2] mt-6 mb-3">
              How to Get Insurance in {cityData.name}
            </h3>
            <ol className="space-y-2 list-decimal list-inside">
              <li><strong>Free Consultation:</strong> WhatsApp +91-92587-77312 or call to schedule a meeting in {cityData.name}.</li>
              <li><strong>Compare Plans:</strong> Use our <Link href="/compare" className="text-[#B8482C] dark:text-[#E8C872] underline">comparison tool</Link> to see 51+ insurers side-by-side.</li>
              <li><strong>Use Calculators:</strong> Get accurate premium estimates on our <Link href="/calculators" className="text-[#B8482C] dark:text-[#E8C872] underline">calculators page</Link>.</li>
              <li><strong>Ask InsureGPT:</strong> 24/7 AI chatbot for Hinglish/Hindi/English insurance queries on <Link href="/insuregpt" className="text-[#B8482C] dark:text-[#E8C872] underline">InsureGPT page</Link>.</li>
              <li><strong>Buy & Get Policy:</strong> Digital issuance — policy documents delivered via email within 24 hours.</li>
              <li><strong>Claim Support:</strong> End-to-end claim assistance — we file, track, and follow up until payout.</li>
            </ol>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FAQ SECTION
         ═══════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 bg-white dark:bg-[#161A24] border-y border-[rgba(15,19,32,0.06)] dark:border-[rgba(232,200,114,0.10)]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#0E1116] dark:text-[#FAF7F2] mb-8">
            {cityData.name} Insurance — Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqJsonLd.mainEntity.map((faq, i) => (
              <details key={i} className="group rounded-xl border border-[rgba(15,19,32,0.08)] dark:border-[rgba(232,200,114,0.15)] bg-[#FAF7F2] dark:bg-[#1A1F27] p-4 cursor-pointer">
                <summary className="font-semibold text-[#0E1116] dark:text-[#FAF7F2] text-sm sm:text-base flex items-center justify-between">
                  {faq.name}
                  <ArrowRight className="w-4 h-4 transition-transform group-open:rotate-90 text-[#B8482C] dark:text-[#E8C872]" />
                </summary>
                <p className="mt-3 text-sm text-[#4A4F57] dark:text-[#A8B0C2] leading-relaxed">
                  {faq.acceptedAnswer.text}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CTA SECTION
         ═══════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="card-ivory-vault p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0E1116] dark:text-[#FAF7F2] mb-4">
              Get Free Insurance Consultation in {cityData.name}
            </h2>
            <p className="text-sm sm:text-base text-[#4A4F57] dark:text-[#A8B0C2] mb-6 max-w-2xl mx-auto">
              Contact Himanshu Paliwal — IRDAI Registered POSP (IP429834) — for personalized insurance advice.
              Compare 51+ insurers, get best {tierLabel.toLowerCase()} city rates, and enjoy lifetime claim support.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={`https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20need%20insurance%20consultation%20in%20${encodeURIComponent(cityData.name)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-[#2D6A4F] hover:bg-[#235541] text-white">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp Now
                </Button>
              </a>
              <Link href="/calculators">
                <Button variant="outline" className="border-[#B8860B] text-[#B8860B] hover:bg-[#FBF3DD]">
                  <Calculator className="w-4 h-4 mr-2" />
                  Use Calculators
                </Button>
              </Link>
              <Link href="/insuregpt">
                <Button variant="outline" className="border-[#B8482C] text-[#B8482C] hover:bg-[#FBE8E1]">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Ask InsureGPT
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          DISCLAIMER
         ═══════════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-[#8B9099] leading-relaxed">
            ⚠️ Insurance is the subject matter of solicitation. This page is for informational purposes only.
            Premium estimates are based on IRDAI Annual Report 2025-26 rates and may vary based on individual
            underwriting. Please consult IRDAI-certified advisor before making any financial decision.
            <br /><br />
            <span className="font-semibold text-[#B8482C] dark:text-[#E8C872]">
              Paliwal Secure • IRDAI Registered POSP • Code: IP429834 • {cityData.name}, {cityData.state}
            </span>
            <br />
            Last updated: {today}
          </p>
        </div>
      </section>
    </main>
  );
}
