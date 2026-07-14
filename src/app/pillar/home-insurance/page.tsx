import type { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';
import { Shield, CheckCircle2, Users, Calculator, FileText, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Home Insurance India 2026: Complete Guide',
  description: 'Complete home insurance guide India 2026. Compare plans, premiums, CSR. 4+ articles. By IRDAI POSP IP429834.',
  alternates: { canonical: 'https://paliwalsecure.in/pillar/home-insurance' },
};

export default function PillarPage() {
  const title2 = 'Home Insurance India 2026: Complete Guide';
  const text2 = 'home insurance';
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/10">
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://paliwalsecure.in' },
        { name: 'Home Insurance India 2026', url: 'https://paliwalsecure.in/pillar/home-insurance' },
      ]} />
      
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary">Pillar Guide</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{title2}</h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            India&apos;s most comprehensive {text2} guide. 4+ articles. Real IRDAI data, expert insights.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/compare" className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg hover:shadow-xl transition-all">
              Compare Plans
            </Link>
            <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-lg transition-all">
              WhatsApp Advisor
            </a>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Quick Answer
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This pillar guide covers all aspects of {text2} in India. Compare 51+ IRDAI-registered insurers.
              Verify claim settlement ratio from IRDAI Annual Report. Read policy wording carefully.
              Consult IRDAI-certified advisor Himanshu Paliwal (POSP IP429834) for personalized recommendations.
              WhatsApp +91-92587-77312 for free consultation.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-semibold mb-6">What This Guide Covers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card rounded-xl p-5 shadow-sm border border-border/50">
              <Calculator className="w-6 h-6 text-primary mb-3" />
              <h3 className="font-semibold text-sm mb-1">Premium Calculation</h3>
              <p className="text-xs text-muted-foreground">Real IRDAI tariff rates, depreciation schedules, NCB discounts</p>
            </div>
            <div className="bg-card rounded-xl p-5 shadow-sm border border-border/50">
              <Users className="w-6 h-6 text-primary mb-3" />
              <h3 className="font-semibold text-sm mb-1">Insurer Comparison</h3>
              <p className="text-xs text-muted-foreground">Side-by-side comparison of 51+ insurers with CSR data</p>
            </div>
            <div className="bg-card rounded-xl p-5 shadow-sm border border-border/50">
              <FileText className="w-6 h-6 text-primary mb-3" />
              <h3 className="font-semibold text-sm mb-1">Claim Process</h3>
              <p className="text-xs text-muted-foreground">Step-by-step guidance for cashless and reimbursement claims</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-semibold mb-6">Key Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Link href="/blog" className="block p-4 rounded-lg bg-card border border-border/50 hover:border-primary/30 transition-all">
              <span className="text-sm font-medium">Complete Insurance Articles</span>
              <p className="text-xs text-muted-foreground mt-1">4+ in-depth articles with real IRDAI data</p>
            </Link>
            <Link href="/compare" className="block p-4 rounded-lg bg-card border border-border/50 hover:border-primary/30 transition-all">
              <span className="text-sm font-medium">Compare Insurance Plans</span>
              <p className="text-xs text-muted-foreground mt-1">Side-by-side comparison of 51+ insurers</p>
            </Link>
            <Link href="/insuregpt" className="block p-4 rounded-lg bg-card border border-border/50 hover:border-primary/30 transition-all">
              <span className="text-sm font-medium">Ask InsureGPT AI</span>
              <p className="text-xs text-muted-foreground mt-1">24/7 AI insurance advisor in Hindi, English, Hinglish</p>
            </Link>
            <Link href="/insurance-faq" className="block p-4 rounded-lg bg-card border border-border/50 hover:border-primary/30 transition-all">
              <span className="text-sm font-medium">Insurance FAQ</span>
              <p className="text-xs text-muted-foreground mt-1">Common insurance questions answered</p>
            </Link>
            <Link href="/claim-settlement-ratio" className="block p-4 rounded-lg bg-card border border-border/50 hover:border-primary/30 transition-all">
              <span className="text-sm font-medium">Claim Settlement Ratio</span>
              <p className="text-xs text-muted-foreground mt-1">IRDAI CSR data for all major insurers</p>
            </Link>
            <Link href="/insurance-glossary" className="block p-4 rounded-lg bg-card border border-border/50 hover:border-primary/30 transition-all">
              <span className="text-sm font-medium">Insurance Glossary</span>
              <p className="text-xs text-muted-foreground mt-1">Complete insurance terminology guide</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="glass-card bg-card rounded-xl p-6 shadow-sm border border-primary/10">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-[#081221]">HP</span>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-1">Expert Insight</h2>
                <p className="text-xs text-muted-foreground mb-4">
                  Himanshu Paliwal - IRDAI Registered POSP (Code: IP429834) - 500+ families served
                </p>
                <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
                  <p>
                    This pillar guide consolidates 4+ articles into one authoritative resource.
                    Every recommendation is based on real IRDAI data and 5+ years of experience.
                  </p>
                  <p>
                    Do not choose insurance based on brand alone - compare CSR, network, premium, and add-ons.
                    Use our comparison tools or consult me on WhatsApp for personalized advice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Personalized Advice?</h2>
          <p className="text-muted-foreground mb-6">
            Get expert advice from Himanshu Paliwal, IRDAI-certified advisor. Free consultation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-lg transition-all">
              WhatsApp +91-92587-77312
            </a>
            <Link href="/compare" className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-lg transition-all">
              Compare Plans
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            IRDAI POSP Code: IP429834. Insurance is the subject matter of solicitation.
          </p>
        </div>
      </section>
    </div>
  );
}
