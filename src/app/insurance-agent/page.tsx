import type { Metadata } from 'next';
import { cities } from '@/data/cities';
import Link from 'next/link';
import { MapPin, Building2, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Insurance Agents in India — 100+ Cities Directory | Paliwal Secure AI',
  description:
    'Find IRDAI Registered POSP insurance agents across 100+ Indian cities. Mumbai, Delhi, Bengaluru, Chennai, Hyderabad, Pune, Kolkata, Kota, Jaipur, Lucknow & more. Free consultation by Himanshu Paliwal (IP429834).',
  keywords: [
    'insurance agent india',
    'insurance advisor near me',
    'IRDAI POSP india',
    'insurance agent directory',
    'insurance agent mumbai',
    'insurance agent delhi',
    'insurance agent bengaluru',
    'insurance agent jaipur',
    'insurance agent kota',
    'best insurance advisor india',
    'insurance consultant india',
    'Himanshu Paliwal insurance',
  ],
  alternates: {
    canonical: 'https://paliwalsecure.in/insurance-agent',
  },
  openGraph: {
    title: 'Insurance Agents in India — 100+ Cities | Paliwal Secure AI',
    description: 'Find IRDAI Registered POSP insurance agents across 100+ Indian cities. Free consultation.',
    url: 'https://paliwalsecure.in/insurance-agent',
    type: 'website',
  },
};

export default function InsuranceAgentDirectory() {
  // Group cities by tier
  const metros = cities.filter((c) => c.tier === 'metro');
  const tier2 = cities.filter((c) => c.tier === 'tier2');
  const tier3 = cities.filter((c) => c.tier === 'tier3');

  return (
    <main className="min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116]">
      {/* Hero */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6F4EF] dark:bg-[rgba(45,106,79,0.18)] border border-[rgba(45,106,79,0.25)] text-[#2D6A4F] dark:text-[#6EE7B7] text-xs font-semibold mb-6">
            <MapPin className="w-3.5 h-3.5" />
            100+ Cities · IRDAI POSP IP429834
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0E1116] dark:text-[#FAF7F2] mb-4">
            Insurance Agents in{' '}
            <span className="text-[#B8482C] dark:text-[#E8C872]">100+ Indian Cities</span>
          </h1>
          <p className="text-base sm:text-lg text-[#4A4F57] dark:text-[#A8B0C2] max-w-3xl mx-auto mb-8">
            Find trusted IRDAI Registered POSP insurance advisor in your city.
            Compare 51+ insurers · Get free consultation · Lifetime claim support.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-[#4A4F57] dark:text-[#A8B0C2]">
            <Badge variant="outline" className="bg-white dark:bg-[#161A24] border-[rgba(15,19,32,0.10)]">
              🏙️ {metros.length} Metro cities
            </Badge>
            <Badge variant="outline" className="bg-white dark:bg-[#161A24] border-[rgba(15,19,32,0.10)]">
              🏘️ {tier2.length} Tier-2 cities
            </Badge>
            <Badge variant="outline" className="bg-white dark:bg-[#161A24] border-[rgba(15,19,32,0.10)]">
              🌾 {tier3.length} Tier-3 cities
            </Badge>
          </div>
        </div>
      </section>

      {/* City Directory */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Metro Cities */}
          <div>
            <h2 className="text-2xl font-bold text-[#0E1116] dark:text-[#FAF7F2] mb-4 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-[#B8482C] dark:text-[#E8C872]" />
              Metro Cities
              <Badge variant="secondary" className="text-xs">{metros.length}</Badge>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {metros.map((city) => (
                <Link
                  key={city.slug}
                  href={`/insurance-agent/${city.slug}`}
                  className="group glass-card p-4 hover:scale-[1.03] transition-transform"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-[#0E1116] dark:text-[#FAF7F2]">{city.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#B8482C] dark:text-[#E8C872] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs text-[#4A4F57] dark:text-[#A8B0C2]">{city.state}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Tier-2 Cities */}
          <div>
            <h2 className="text-2xl font-bold text-[#0E1116] dark:text-[#FAF7F2] mb-4 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-[#2D6A4F] dark:text-[#6EE7B7]" />
              Tier-2 Cities
              <Badge variant="secondary" className="text-xs">{tier2.length}</Badge>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {tier2.map((city) => (
                <Link
                  key={city.slug}
                  href={`/insurance-agent/${city.slug}`}
                  className="group glass-card p-4 hover:scale-[1.03] transition-transform"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-[#0E1116] dark:text-[#FAF7F2]">{city.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#2D6A4F] dark:text-[#6EE7B7] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs text-[#4A4F57] dark:text-[#A8B0C2]">{city.state}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Tier-3 Cities */}
          <div>
            <h2 className="text-2xl font-bold text-[#0E1116] dark:text-[#FAF7F2] mb-4 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-[#B8860B] dark:text-[#E8C872]" />
              Tier-3 Cities
              <Badge variant="secondary" className="text-xs">{tier3.length}</Badge>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {tier3.map((city) => (
                <Link
                  key={city.slug}
                  href={`/insurance-agent/${city.slug}`}
                  className="group glass-card p-4 hover:scale-[1.03] transition-transform"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-[#0E1116] dark:text-[#FAF7F2]">{city.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#E8C872] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs text-[#4A4F57] dark:text-[#A8B0C2]">{city.state}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-3xl mx-auto text-center glass-card p-8">
          <h2 className="text-2xl font-bold text-[#0E1116] dark:text-[#FAF7F2] mb-3">
            Can't find your city?
          </h2>
          <p className="text-sm text-[#4A4F57] dark:text-[#A8B0C2] mb-6">
            We serve all Indian cities — even if your city isn't listed, contact us for free consultation.
            Online consultation available pan-India via WhatsApp + InsureGPT AI.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20need%20insurance%20consultation%20for%20my%20city"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2D6A4F] hover:bg-[#235541] text-white text-sm font-semibold"
            >
              WhatsApp Now
            </a>
            <Link
              href="/insuregpt"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#B8482C] text-[#B8482C] dark:text-[#E8C872] hover:bg-[#FBE8E1] dark:hover:bg-[rgba(184,72,44,0.10)] text-sm font-semibold"
            >
              Ask InsureGPT
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
