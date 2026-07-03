import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronDown, Check, Shield, Smartphone, CreditCard, Banknote, Headphones, ArrowRight, Lock, TrendingUp, Gift, Zap } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// METADATA — SEO + OpenGraph + canonical
// ═══════════════════════════════════════════════════════════════════════════

export const metadata: Metadata = {
  title: 'Kotak 811 Super Savings Account — Premium Banking, Zero Balance | Paliwal Secure',
  description:
    'Open Kotak 811 Super Savings Account with zero balance. Get up to 5% interest with ActivMoney, free Platinum Debit Card, 5% cashback up to ₹6,000/year, ₹1 lakh daily withdrawal, and free NEFT/RTGS/IMPS. Video KYC in 5 minutes.',
  keywords: [
    'Kotak 811 Super Savings Account',
    'zero balance savings account',
    'Kotak 811 super',
    'best savings account India',
    '5% interest savings account',
    'ActivMoney Kotak',
    'Platinum Debit Card',
    'cashback savings account',
    'online bank account opening',
    'Video KYC bank account',
    'Kotak Mahindra Bank',
    'Paliwal Secure banking',
  ],
  alternates: {
    canonical: 'https://paliwalsecure.in/products/kotak-811-super-savings-account',
  },
  openGraph: {
    title: 'Kotak 811 Super Savings Account — Premium Banking, Zero Balance',
    description:
      'Zero balance, up to 5% interest, free Platinum Debit Card, 5% cashback up to ₹6,000/year. Open in 5 minutes with Video KYC.',
    url: 'https://paliwalsecure.in/products/kotak-811-super-savings-account',
    siteName: 'Paliwal Secure',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kotak 811 Super Savings Account — Zero Balance, 5% Interest',
    description: 'Premium banking with zero balance. Up to 5% interest, Platinum Debit Card, cashback. Open in 5 mins.',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const APPLY_URL =
  'https://sales.gromo.in/otp?token=fUcH6NT1ZXcOXLib8y3KorGlHIKqC3NHBjyoL6MgZYtOAAhz7Bbfomm%2Bbh06Z5lN7EJ5bLcuW8EL0%2FRTeB2XZ24JEGSeCZHD2y04D0ttoWbWg8AF5rFqFcgNch09yRrU&productCode=KOTAK&versionCode=null&leadSource=GP_WEBSITE&leadSubSource=null';

const FEATURES = [
  {
    icon: Banknote,
    title: 'Zero Balance Account',
    description: 'No minimum balance requirement. Maintain ₹0 — no penalty, no charges. Banking should be stress-free.',
  },
  {
    icon: TrendingUp,
    title: 'Up to 5% Interest with ActivMoney',
    description: 'Auto-sweep excess funds into fixed deposits earning up to 5% p.a. Your idle money earns while you sleep.',
  },
  {
    icon: CreditCard,
    title: 'Free Platinum RuPay Debit Card',
    description: 'Premium Platinum Debit Card + Chequebook at no cost. Shop online, withdraw cash, pay bills — all free.',
  },
  {
    icon: Gift,
    title: '5% Cashback up to ₹6,000/year',
    description: 'Earn 5% cashback on spends — up to ₹500/month (₹6,000/year). Online shopping, fuel, dining — all eligible.',
  },
  {
    icon: Zap,
    title: '₹1 Lakh Daily Withdrawal Limit',
    description: 'High daily withdrawal limit of ₹1,00,000 at ATMs and ₹2,00,000 for POS transactions. Freedom to spend.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Customer Service',
    description: 'Priority customer support for 811 Super account holders. Faster response, dedicated helpline, email support.',
  },
  {
    icon: Smartphone,
    title: 'Free NEFT / RTGS / IMPS',
    description: 'Unlimited free money transfers via NEFT, RTGS, and IMPS. Send money to any bank in India — zero charges.',
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'RBI-regulated, DICGC insured up to ₹5 lakh. Your deposits are protected by Kotak Mahindra Bank\'s security infrastructure.',
  },
] as const;

const STEPS = [
  {
    number: '01',
    title: 'Click "Apply Now"',
    description: 'Tap the apply button on this page. You\'ll be redirected to Kotak\'s secure application portal via Gromo.',
  },
  {
    number: '02',
    title: 'Enter Basic Details',
    description: 'Provide your PAN, Aadhaar number, and mobile number. OTP verification takes 30 seconds.',
  },
  {
    number: '03',
    title: 'Complete Video KYC',
    description: 'A Kotak representative conducts a quick Video KYC call — takes 3-5 minutes. Keep your original Aadhaar and PAN ready.',
  },
  {
    number: '04',
    title: 'Account Activated',
    description: 'Your Kotak 811 Super Savings Account is activated within 24 hours. Debit Card delivered to your address in 5-7 days.',
  },
] as const;

const FAQS = [
  {
    question: 'What is Kotak 811 Super Savings Account?',
    answer:
      'Kotak 811 Super is a premium zero-balance savings account offered by Kotak Mahindra Bank. It includes a free Platinum RuPay Debit Card, up to 5% interest via ActivMoney, 5% cashback on spends (up to ₹6,000/year), and free NEFT/RTGS/IMPS transfers. It is an exclusive upgrade from the regular Kotak 811 account.',
  },
  {
    question: 'Is there really no minimum balance requirement?',
    answer:
      'Yes, Kotak 811 Super is a genuine zero-balance account. You can maintain ₹0 balance without any penalty or non-maintenance charges. This makes it ideal for students, freelancers, first-time account holders, and anyone who wants hassle-free banking.',
  },
  {
    question: 'How does ActivMoney work to earn up to 5% interest?',
    answer:
      'ActivMoney is an auto-sweep feature. When your account balance exceeds a threshold (default ₹25,000), the excess amount is automatically transferred to a fixed deposit in multiples of ₹5,000. This FD earns up to 5% p.a. interest. When you need the money, the FD is automatically broken — no manual intervention needed.',
  },
  {
    question: 'What documents are required to open the account?',
    answer:
      'You need three documents: (1) PAN Card, (2) Aadhaar Card, and (3) a mobile number linked to your Aadhaar. During Video KYC, keep your original PAN and Aadhaar physically available for verification by the Kotak representative.',
  },
  {
    question: 'How long does it take to open the account?',
    answer:
      'The entire process takes 15-20 minutes: 2 minutes for basic details, 3-5 minutes for Video KYC, and account activation within 24 hours. Your Platinum Debit Card is delivered to your address within 5-7 business days.',
  },
  {
    question: 'What is the cashback offer and how do I get it?',
    answer:
      'You earn 5% cashback on eligible debit card spends — up to ₹500 per month (₹6,000 per year). Cashback is automatically credited to your account. Eligible categories include online shopping, fuel, dining, and utility payments. Terms and conditions apply.',
  },
  {
    question: 'Is Kotak 811 Super available for everyone?',
    answer:
      'Kotak 811 Super is an exclusive program. Not all applicants qualify — eligibility is checked during the application process via the Kotak app. If you don\'t qualify for Super, you may be offered the regular Kotak 811 account instead.',
  },
  {
    question: 'Can I open this account if I already have a Kotak account?',
    answer:
      'No. Kotak 811 is designed for customers who do not have an existing relationship with Kotak Mahindra Bank. If you already hold a Kotak savings account, you are not eligible for 811 Super. You can explore other Kotak account variants instead.',
  },
] as const;

// ═══════════════════════════════════════════════════════════════════════════
// FAQ JSON-LD SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Kotak 811 Super Savings Account',
  description:
    'Zero balance savings account with up to 5% interest, free Platinum Debit Card, 5% cashback up to ₹6,000/year, and free NEFT/RTGS/IMPS.',
  brand: { '@type': 'Brand', name: 'Kotak Mahindra Bank' },
  category: 'Banking > Savings Account',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
    availability: 'https://schema.org/InStock',
    url: APPLY_URL,
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://paliwalsecure.in' },
    { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://paliwalsecure.in/products' },
    { '@type': 'ListItem', position: 3, name: 'Kotak 811 Super Savings Account', item: 'https://paliwalsecure.in/products/kotak-811-super-savings-account' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function Kotak811SuperSavingsPage() {
  return (
    <main className="flex-1 bg-[#0A0F1A] text-white">
      {/* ═══ JSON-LD Schemas ═══ */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* ═══════════════════════════════════════════════════════════════════
          1. HERO SECTION
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212, 168, 83, 0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(27, 77, 74, 0.06) 0%, transparent 50%)',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-28 md:pb-24">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-xs text-white/40">
              <li>
                <Link href="/" className="hover:text-white/60 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/products" className="hover:text-white/60 transition-colors">
                  Products
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-white/60" aria-current="page">
                Kotak 811 Super
              </li>
            </ol>
          </nav>

          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-white/5 border border-white/10">
            <Shield className="w-3.5 h-3.5 text-[#D4A853]" aria-hidden="true" />
            <span className="text-xs font-medium text-white/70 tracking-wide">
              RBI Regulated · DICGC Insured up to ₹5 Lakh
            </span>
          </div>

          {/* H1 */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6 max-w-4xl">
            Kotak 811 Super{' '}
            <span className="text-[#D4A853]">Savings Account</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mb-8 leading-relaxed">
            Premium banking, zero balance. Earn up to 5% interest with ActivMoney, get a free
            Platinum Debit Card, and 5% cashback up to ₹6,000/year. Open in 5 minutes with Video KYC.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={APPLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#D4A853] text-[#0A0F1A] font-semibold text-base hover:bg-[#E0B86A] transition-all duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F1A]"
              aria-label="Apply now for Kotak 811 Super Savings Account"
            >
              Apply Now — Open in 5 Minutes
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-base hover:bg-white/10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F1A]"
            >
              Explore Features
            </a>
          </div>

          {/* Quick stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Min. Balance', value: '₹0' },
              { label: 'Interest Rate', value: 'Up to 5%' },
              { label: 'Annual Cashback', value: '₹6,000' },
              { label: 'Daily Withdrawal', value: '₹1 Lakh' },
            ].map((stat) => (
              <div key={stat.label} className="border-l border-white/10 pl-4">
                <p className="text-2xl md:text-3xl font-bold text-[#D4A853]">{stat.value}</p>
                <p className="text-xs text-white/40 mt-1 tracking-wide uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2. KEY FEATURES
          ═══════════════════════════════════════════════════════════════════ */}
      <section id="features" className="py-16 md:py-24 border-t border-white/5 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Everything included, nothing hidden
          </h2>
          <p className="text-white/50 text-lg mb-12 max-w-2xl">
            Kotak 811 Super gives you premium banking features without any minimum balance commitment.
            Here is exactly what you get.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-[#D4A853]/20 transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#D4A853]/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#D4A853]" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          3. HOW TO OPEN — 4-STEP PROCESS
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Open your account in 4 simple steps
          </h2>
          <p className="text-white/50 text-lg mb-12">
            No branch visits. No paperwork. Just your phone, PAN, and Aadhaar.
          </p>

          <div className="space-y-8">
            {STEPS.map((step) => (
              <div key={step.number} className="flex gap-6">
                <div className="shrink-0 w-12 h-12 rounded-full border border-[#D4A853]/30 flex items-center justify-center text-[#D4A853] font-mono font-bold text-sm">
                  {step.number}
                </div>
                <div className="flex-1 pb-8 border-b border-white/5 last:border-0">
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-white/50 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA after steps */}
          <div className="mt-12 text-center">
            <a
              href={APPLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#D4A853] text-[#0A0F1A] font-semibold text-base hover:bg-[#E0B86A] transition-all duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F1A]"
            >
              Start Your Application
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          4. ELIGIBILITY NOTE
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 md:p-8 rounded-2xl bg-[#D4A853]/[0.04] border border-[#D4A853]/15">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-[#D4A853]/10 flex items-center justify-center">
                <Lock className="w-4 h-4 text-[#D4A853]" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Eligibility — 811 Super is Exclusive</h2>
                <p className="text-white/50 leading-relaxed text-sm">
                  Kotak 811 Super is an exclusive program, not available to everyone. Eligibility is
                  checked during the application process via the Kotak app. If you do not qualify for
                  Super, you may be offered the regular Kotak 811 account instead. Basic eligibility
                  criteria:
                </p>
                <ul className="mt-4 space-y-2 text-sm text-white/50">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#D4A853] shrink-0 mt-0.5" aria-hidden="true" />
                    Indian resident aged 18 years or above
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#D4A853] shrink-0 mt-0.5" aria-hidden="true" />
                    Valid PAN Card and Aadhaar Card
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#D4A853] shrink-0 mt-0.5" aria-hidden="true" />
                    Mobile number linked to Aadhaar
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#D4A853] shrink-0 mt-0.5" aria-hidden="true" />
                    No existing Kotak Mahindra Bank account
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          5. FAQ SECTION (with JSON-LD schema rendered above)
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Frequently asked questions
          </h2>
          <p className="text-white/50 text-lg mb-12">
            Everything you need to know about Kotak 811 Super Savings Account.
          </p>

          <div className="space-y-3">
            {FAQS.map((faq, index) => (
              <details
                key={index}
                className="group rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden focus-within:ring-2 focus-within:ring-[#D4A853]/30 transition-colors"
              >
                <summary
                  className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none font-medium text-base hover:bg-white/[0.02] transition-colors focus-visible:outline-none"
                  aria-label={`Toggle answer for: ${faq.question}`}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className="w-4 h-4 text-white/40 shrink-0 transition-transform duration-200 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="px-5 pb-5 text-sm text-white/50 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          6. FINAL CTA
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Ready to open your Kotak 811 Super?
          </h2>
          <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">
            Zero balance. Up to 5% interest. Free Platinum Debit Card. All in 5 minutes.
          </p>
          <a
            href={APPLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-[#D4A853] text-[#0A0F1A] font-semibold text-lg hover:bg-[#E0B86A] transition-all duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F1A]"
          >
            Apply Now
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          7. COMPLIANCE DISCLOSURE
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5">
            <h3 className="text-sm font-semibold text-white/60 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#D4A853]" aria-hidden="true" />
              Compliance Disclosure
            </h3>
            <p className="text-xs text-white/30 leading-relaxed">
              Paliwal Secure is a registered referral partner for Kotak 811 via Gromo. We are not the
              account provider; banking services are provided directly by Kotak Mahindra Bank Ltd.
              (RBI License No. DBU.NBD.811). Deposits are insured by DICGC up to ₹5,00,000 per
              depositor. Paliwal Secure does not collect, store, or process any banking information —
              all data is handled securely by Kotak Mahindra Bank on their official platform.
            </p>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              8. RATES DISCLAIMER
              ═══════════════════════════════════════════════════════════════ */}
          <div className="mt-4 p-5 rounded-xl bg-white/[0.02] border border-white/5">
            <h3 className="text-sm font-semibold text-white/60 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#D4A853]" aria-hidden="true" />
              Rates &amp; Offers Disclaimer
            </h3>
            <p className="text-xs text-white/30 leading-relaxed">
              Rates and offers subject to change; please verify on the official Kotak app before
              applying. Interest rates, cashback percentages, withdrawal limits, and other features
              mentioned on this page are based on information available as of June 2026. Kotak
              Mahindra Bank reserves the right to modify these terms without prior notice. For the
              most current rates and terms, visit{' '}
              <a
                href="https://www.kotak.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4A853] hover:underline"
              >
                kotak.com
              </a>{' '}
              or the Kotak 811 mobile app.
            </p>
          </div>

          {/* Back to home */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/60 transition-colors"
            >
              ← Back to Paliwal Secure
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
