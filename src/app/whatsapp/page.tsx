import type { Metadata } from 'next';
import { WhatsAppHero } from '@/components/WhatsAppBot';
import { WhatsAppQR, WHATSAPP_TEMPLATES, WhatsAppButton } from '@/components/WhatsAppBot';
import Link from 'next/link';
import { CheckCircle2, MessageCircle, Clock, ShieldCheck, Sparkles, Users, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'WhatsApp Insurance Advisor — InsureGPT on WhatsApp | Paliwal Secure AI',
  description:
    'Chat with IRDAI Registered POSP Himanshu Paliwal on WhatsApp. Get instant insurance advice, compare 51+ insurers, file claims, tax savings help. Hinglish/Hindi/English. Free consultation. +91-92587-77312.',
  keywords: [
    'whatsapp insurance advisor',
    'whatsapp insurance bot india',
    'insurance agent whatsapp',
    'Himanshu Paliwal whatsapp',
    'IRDAI POSP whatsapp',
    'insurance consultation whatsapp',
    'whatsapp insurance help',
    'free insurance advice whatsapp',
    'Paliwal Secure whatsapp',
    'insurance chatbot whatsapp',
  ],
  alternates: {
    canonical: 'https://paliwalsecure.in/whatsapp',
  },
  openGraph: {
    title: 'WhatsApp Insurance Advisor — InsureGPT on WhatsApp | Paliwal Secure AI',
    description: 'Chat with IRDAI POSP on WhatsApp. Free insurance consultation. Hinglish/Hindi/English.',
    url: 'https://paliwalsecure.in/whatsapp',
    type: 'website',
  },
};

export default function WhatsAppPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116]">
      {/* Hero */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <WhatsAppHero />
      </section>

      {/* QR Code Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0E1116] dark:text-[#FAF7F2] mb-3">
              Scan & Chat Instantly
            </h2>
            <p className="text-sm text-[#4A4F57] dark:text-[#A8B0C2] mb-8 max-w-xl mx-auto">
              Open WhatsApp on your phone, scan this QR code, and start chatting with Himanshu immediately.
              No need to save the number manually.
            </p>
            <div className="flex justify-center">
              <WhatsAppQR size={220} message={WHATSAPP_TEMPLATES.general} />
            </div>
            <p className="text-xs text-[#8B9099] mt-6">
              Or save manually: <strong className="text-[#2D6A4F]">+91-92587-77312</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Quick Message Templates */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 bg-white dark:bg-[#161A24] border-y border-[rgba(15,19,32,0.06)] dark:border-[rgba(232,200,114,0.10)]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#0E1116] dark:text-[#FAF7F2] mb-3">
            Quick Start — Pick Your Topic
          </h2>
          <p className="text-center text-sm text-[#4A4F57] dark:text-[#A8B0C2] mb-10 max-w-2xl mx-auto">
            Click any topic below to open WhatsApp with a pre-filled message. Himanshu will respond personally.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { emoji: '🏥', title: 'Health Insurance', desc: 'Family floater, senior citizen, disease-specific', msg: WHATSAPP_TEMPLATES.healthConsult, color: 'emerald' },
              { emoji: '🚗', title: 'Car Insurance', desc: 'Comprehensive, zero dep, IDV, NCB', msg: WHATSAPP_TEMPLATES.carInsurance, color: 'sienna' },
              { emoji: '🏍️', title: 'Bike Insurance', desc: 'Third party, comprehensive, add-ons', msg: WHATSAPP_TEMPLATES.bikeInsurance, color: 'sienna' },
              { emoji: '🛡️', title: 'Term Insurance', desc: '₹1 Cr+ cover, return of premium, riders', msg: WHATSAPP_TEMPLATES.lifeInsurance, color: 'emerald' },
              { emoji: '✈️', title: 'Travel Insurance', desc: 'International, multi-trip, student', msg: WHATSAPP_TEMPLATES.travelInsurance, color: 'gold' },
              { emoji: '🏠', title: 'Home Insurance', desc: 'Structure, contents, natural disaster', msg: WHATSAPP_TEMPLATES.homeInsurance, color: 'gold' },
              { emoji: '📄', title: 'Claim Help', desc: 'Cashless, reimbursement, appeal', msg: WHATSAPP_TEMPLATES.claimHelp, color: 'sienna' },
              { emoji: '🔍', title: 'Policy Review', desc: 'Free audit of existing policy', msg: WHATSAPP_TEMPLATES.policyReview, color: 'emerald' },
              { emoji: '💰', title: 'Tax Savings (80D)', desc: 'Max ₹75,000 deduction help', msg: WHATSAPP_TEMPLATES.taxSavings, color: 'gold' },
            ].map((item, i) => {
              const colors = {
                emerald: 'bg-[#E6F4EF] dark:bg-[rgba(45,106,79,0.18)] text-[#2D6A4F] dark:text-[#6EE7B7] border-[rgba(45,106,79,0.20)]',
                sienna: 'bg-[#FBE8E1] dark:bg-[rgba(184,72,44,0.18)] text-[#B8482C] dark:text-[#F0A88B] border-[rgba(184,72,44,0.20)]',
                gold: 'bg-[#FBF3DD] dark:bg-[rgba(184,134,11,0.18)] text-[#B8860B] dark:text-[#E8C872] border-[rgba(184,134,11,0.22)]',
              };
              return (
                <a
                  key={i}
                  href={`https://wa.me/919257877312?text=${encodeURIComponent(item.msg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card p-5 hover:scale-[1.02] transition-transform group"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3 border ${colors[item.color as keyof typeof colors]}`}>
                    <span className="text-2xl">{item.emoji}</span>
                  </div>
                  <h3 className="font-bold text-[#0E1116] dark:text-[#FAF7F2] mb-1">{item.title}</h3>
                  <p className="text-xs text-[#4A4F57] dark:text-[#A8B0C2] mb-3">{item.desc}</p>
                  <span className={`text-xs font-semibold ${colors[item.color as keyof typeof colors].split(' ').find(c => c.startsWith('text-'))}`}>
                    Open WhatsApp →
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why WhatsApp */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#0E1116] dark:text-[#FAF7F2] mb-10">
            Why Chat on WhatsApp?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Clock, title: 'Instant Response', desc: 'Average reply time: 5 minutes during business hours. 24/7 for urgent queries.', color: 'emerald' },
              { icon: ShieldCheck, title: 'IRDAI Certified', desc: 'Chat with IRDAI Registered POSP (IP429834). Legally authorized insurance advisor.', color: 'sienna' },
              { icon: Users, title: 'Personal Service', desc: 'Himanshu personally responds — no bots, no call centers. Direct expert access.', color: 'gold' },
              { icon: TrendingUp, title: 'Best Price Promise', desc: 'Compare 51+ insurers to find lowest premium. Free consultation, no obligation.', color: 'emerald' },
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

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card p-8 sm:p-12 text-center">
            <Sparkles className="w-10 h-10 mx-auto mb-4 text-[#2D6A4F]" />
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0E1116] dark:text-[#FAF7F2] mb-3">
              Ready to Secure Your Future?
            </h2>
            <p className="text-sm text-[#4A4F57] dark:text-[#A8B0C2] mb-6 max-w-xl mx-auto">
              Start your WhatsApp chat now. Free consultation, no spam, no obligation.
              Himanshu will guide you through every step — from choosing the right plan to filing claims.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <WhatsAppButton
                message={WHATSAPP_TEMPLATES.general}
                label="Start WhatsApp Chat"
                variant="default"
              />
              <Link href="/insuregpt">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-[#B8482C] text-[#B8482C] hover:bg-[#FBE8E1] font-semibold">
                  <Sparkles className="w-4 h-4" />
                  Try InsureGPT AI
                </button>
              </Link>
            </div>
            <p className="text-xs text-[#8B9099] mt-6">
              📞 Prefer calling? <a href="tel:+919257877312" className="text-[#2D6A4F] font-semibold underline">+91-92587-77312</a>
              <br />
              📧 Email: <a href="mailto:himanshupaliwalpbp@gmail.com" className="text-[#2D6A4F] font-semibold underline">himanshupaliwalpbp@gmail.com</a>
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs text-[#8B9099] leading-relaxed">
            ⚠️ Insurance is the subject matter of solicitation. WhatsApp consultation is for general guidance only.
            Please consult IRDAI-certified advisor before making any financial decision.
            <br /><br />
            <span className="font-semibold text-[#2D6A4F]">
              Paliwal Secure • IRDAI Registered POSP • Code: IP429834 • Kota, Rajasthan
            </span>
          </p>
        </div>
      </section>
    </main>
  );
}
