import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Offers Given So Far — Paliwal Secure AI Exclusive Deals',
  description:
    'Paliwal Secure AI ne ab tak kitne offers diye? Dekhein hamari exclusive offers list — Myntra 70% OFF, insurance deals, aur more. Quiz khelke extra discount paayein!',
  keywords: [
    'paliwal secure offers',
    'myntra 70 off',
    'insurance quiz offer',
    'exclusive deals india',
    'paliwal secure deals',
    'myntra work wear discount',
  ],
  openGraph: {
    title: 'Offers Given So Far — Paliwal Secure AI Exclusive Deals',
    description:
      'Myntra 70% OFF, Quiz offers, aur more. Dekhein hamari saari exclusive offers ek jagah!',
    url: 'https://paliwalsecure.in/offers',
  },
  alternates: {
    canonical: 'https://paliwalsecure.in/offers',
  },
};

// ═══ All offers given so far ═══
const ALL_OFFERS = [
  {
    id: 1,
    brand: 'Myntra',
    title: 'Quiz Me Myntra — Minimum 70% OFF On Work Wear',
    offer: 'Minimum 70% OFF + 30 Days Return Policy',
    description:
      'Find a variety of Fashion, Footwear, Accessories, Personal Care & Lifestyle products for Men, Women & Kids. International brands at your doorstep: Tommy Hilfiger, Kelenji, US Polo, H&M, Forever 21, etc.',
    link: 'https://myntr.it/OuSsbCW',
    buttonText: '🛍️ Shop Myntra Now',
    color: '#B8482C',
    bgColor: 'rgba(184, 72, 44, 0.08)',
    active: true,
    date: 'June 2026',
  },
  {
    id: 2,
    brand: 'Insurance Beast Quiz',
    title: 'Play Quiz & Win Exclusive Insurance Discounts',
    offer: 'Free Insurance IQ Test + Exclusive Deals',
    description:
      'Apna Insurance IQ test karein — 10 questions, 2 minutes. Score ke hisaab se exclusive insurance offers aur discounts paayein. SEO friendly quiz for better insurance decisions.',
    link: '/#insurance-beast-quiz',
    buttonText: '🧠 Play Quiz Now',
    color: '#1B4D4A',
    bgColor: 'rgba(27, 77, 74, 0.08)',
    active: true,
    date: 'Ongoing',
  },
  {
    id: 3,
    brand: 'WhatsApp Free Consultation',
    title: 'Free Insurance Consultation on WhatsApp',
    offer: '100% Free · No Spam · IRDAI Certified Advisor',
    description:
      'Himanshu Paliwal (IRDAI POSP IP429834) se WhatsApp par free insurance consultation lein. Health, Life, Motor, Travel — sab insurance ke liye expert advice.',
    link: 'https://wa.me/919257877312',
    buttonText: '💬 Chat on WhatsApp',
    color: '#2D6A4F',
    bgColor: 'rgba(45, 106, 79, 0.08)',
    active: true,
    date: 'Ongoing',
  },
  {
    id: 4,
    brand: 'Protection Score',
    title: 'Free Protection Score Calculator',
    offer: '100% Free · 2 Minutes · Personalized Report',
    description:
      'Apna Protection Score calculate karein — 0-100 rating jo batata hai aapka insurance coverage kitna strong hai. AI-powered analysis across 51+ insurers.',
    link: '/#advisor-form',
    buttonText: '🛡️ Calculate My Score',
    color: '#B8860B',
    bgColor: 'rgba(184, 134, 11, 0.08)',
    active: true,
    date: 'Ongoing',
  },
];

export default function OffersPage() {
  const activeOffers = ALL_OFFERS.filter((o) => o.active);
  const totalOffers = ALL_OFFERS.length;

  return (
    <main className="flex-1 bg-[#FAF7F2] dark:bg-[#0E1116]">
      {/* Hero */}
      <section className="py-16 md:py-24 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F4E5DD] dark:bg-[#3A1E14]/30 text-[#B8482C] text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse" />
            {totalOffers} Active Offers
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-[#0E1116] dark:text-[#FAF7F2] tracking-tight mb-4">
            Hamne Ab Tak{' '}
            <span className="text-[#B8482C]">{totalOffers} Offers</span> Diye!
          </h1>
          <p className="text-lg sm:text-xl text-[#4A4F57] dark:text-[#A8B0C2] font-body max-w-2xl mx-auto leading-relaxed">
            Paliwal Secure AI ne aapke liye {totalOffers} exclusive offers banaye hain.
            Quiz khelke, Myntra pe shop karke, ya free consultation leke — sab kuch ek jagah.
          </p>
        </div>
      </section>

      {/* Payment Link Banner */}
      <section className="px-4 mb-12">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl p-6 sm:p-8 text-center"
            style={{
              background: 'linear-gradient(135deg, #B8482C 0%, #8B3520 100%)',
              boxShadow: '0 8px 32px rgba(184, 72, 44, 0.2)',
            }}
          >
            <h2 className="text-white font-display text-xl sm:text-2xl font-semibold mb-2">
              💳 Payment Karein
            </h2>
            <p className="text-white/80 text-sm sm:text-base mb-4">
              Insurance premium, consultation fee, ya policy purchase — sab payment yahan se karein.
            </p>
            <a
              href="https://wa.me/919257877312?text=Hi%20Himanshu,%20I%20want%20to%20make%20a%20payment"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#B8482C] font-semibold text-sm hover:scale-105 transition-transform"
            >
              💬 Pay via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* All Offers */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto space-y-6">
          {activeOffers.map((offer, idx) => (
            <div
              key={offer.id}
              className="rounded-2xl p-6 sm:p-8 border-l-4 transition-all hover:translate-y-[-2px] hover:shadow-lg"
              style={{
                borderColor: offer.color,
                background: offer.bgColor,
              }}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2"
                    style={{ background: offer.color, color: '#fff' }}
                  >
                    #{idx + 1} · {offer.brand}
                  </span>
                  <h3 className="font-display text-lg sm:text-xl font-semibold text-[#0E1116] dark:text-[#FAF7F2]">
                    {offer.title}
                  </h3>
                  <p className="font-semibold text-sm mt-1" style={{ color: offer.color }}>
                    {offer.offer}
                  </p>
                </div>
                <span className="text-xs text-[#8B9099] shrink-0">{offer.date}</span>
              </div>
              <p className="text-sm text-[#4A4F57] dark:text-[#A8B0C2] leading-relaxed mb-4">
                {offer.description}
              </p>
              <a
                href={offer.link}
                target={offer.link.startsWith('/') ? undefined : '_blank'}
                rel={offer.link.startsWith('/') ? undefined : 'noopener noreferrer'}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
                style={{ background: offer.color }}
              >
                {offer.buttonText} →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* SEO Quiz CTA */}
      <section className="px-4 pb-20">
        <div className="max-w-3xl mx-auto text-center rounded-2xl p-8 sm:p-10 bg-[#0E1116] dark:bg-[#161A24]">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-4">
            🧠 Insurance IQ Quiz Khelna Bhool Gaya?
          </h2>
          <p className="text-white/70 text-base mb-6 max-w-xl mx-auto">
            Quiz khelo, apna score jano, aur exclusive offers paao. Sirf 2 minute — free!
          </p>
          <Link
            href="/#insurance-beast-quiz"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#E8C872] text-[#0E1116] font-semibold text-sm hover:scale-105 transition-transform"
          >
            🧠 Play Quiz Now →
          </Link>
        </div>
      </section>
    </main>
  );
}
