'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { Language } from '@/lib/i18n-strings';
import { ShinyButton } from '@/components/ui/shiny-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import PaliwalSecureRating from '@/components/PaliwalSecureRating';
import AuthorBio from '@/components/AuthorBio';
import { generateFAQSchema, generateArticleSchema, irdaiDisclaimer, relatedArticlesMap, getWhatsAppCTA } from '@/lib/content-templates';
import { BookOpen, ArrowRight, MessageCircle, Scale, Shield, TrendingUp, Award } from 'lucide-react';

type TEntry = { en: string; hi: string; hinglish: string };
const pt = (obj: TEntry, lang: Language): string => obj[lang] || obj.en;

const termPlans = [
  { insurer: 'HDFC Life', plan: 'Click 2 Protect Super', csr: 99.39, premium25: '₹649/m', premium35: '₹1,099/m', riders: ['Critical Illness', 'Accidental Death', 'Waiver of Premium'], claimTime: '12 days', solvency: 2.01, rating: 96 },
  { insurer: 'Max Life', plan: 'Smart Secure Plus', csr: 99.35, premium25: '₹679/m', premium35: '₹1,149/m', riders: ['Critical Illness', 'Accidental Death', 'Income Benefit'], claimTime: '10 days', solvency: 1.82, rating: 95 },
  { insurer: 'Tata AIA Life', plan: 'Sampoorna Raksha Supreme', csr: 99.13, premium25: '₹629/m', premium35: '₹1,079/m', riders: ['Critical Illness', 'Accidental Death', 'Terminal Illness'], claimTime: '11 days', solvency: 2.15, rating: 94 },
  { insurer: 'ICICI Prudential', plan: 'iProtect Smart', csr: 98.79, premium25: '₹659/m', premium35: '₹1,129/m', riders: ['Critical Illness', 'Accidental Death', 'Waiver of Premium'], claimTime: '14 days', solvency: 2.10, rating: 93 },
  { insurer: 'SBI Life', plan: 'eShield Next', csr: 98.65, premium25: '₹609/m', premium35: '₹1,049/m', riders: ['Accidental Death', 'Critical Illness'], claimTime: '13 days', solvency: 2.30, rating: 92 },
  { insurer: 'Kotak Life', plan: 'e-Term Plan', csr: 98.41, premium25: '₹589/m', premium35: '₹999/m', riders: ['Critical Illness', 'Accidental Death'], claimTime: '15 days', solvency: 2.05, rating: 91 },
  { insurer: 'LIC', plan: 'Tech Term', csr: 98.52, premium25: '₹729/m', premium35: '₹1,299/m', riders: ['Accidental Death Benefit'], claimTime: '18 days', solvency: 1.88, rating: 90 },
];

const faqs = [
  { q: { en: "Which is the best term insurance plan in India 2026?", hi: "2026 में भारत का सबसे अच्छा टर्म इंश्योरेंस प्लान कौन सा है?", hinglish: "2026 mein India ka sabse achha term insurance plan kaunsa hai?" }, a: { en: "Based on our Paliwal Secure Score™ analysis, HDFC Life Click 2 Protect Super and Max Life Smart Secure Plus are the top-rated plans for 2026. Both offer 99%+ claim settlement ratio, comprehensive riders, and competitive premiums. Choose HDFC Life for flexibility and Max Life for income benefit rider.", hi: "हमारे Paliwal Secure Score™ विश्लेषण के आधार पर, HDFC Life Click 2 Protect Super और Max Life Smart Secure Plus 2026 के सर्वश्रेष्ठ प्लान हैं। दोनों 99%+ CSR और व्यापक राइडर ऑफर करते हैं।", hinglish: "Hamare Paliwal Secure Score analysis ke aadhar par, HDFC Life Click 2 Protect Super aur Max Life Smart Secure Plus 2026 ke best plans hain." } },
  { q: { en: "How much term insurance do I need?", hi: "मुझे कितने का टर्म इंश्योरेंस चाहिए?", hinglish: "Mujhe kitne ka term insurance chahiye?" }, a: { en: "A common rule is 10-15 times your annual income. If you earn ₹10L/year, you need ₹1-1.5 Cr cover. Also consider: outstanding loans, future expenses (children's education, marriage), and replacement income for dependents. For most Indians aged 25-40, ₹1 Crore is the minimum recommended.", hi: "सामान्य नियम आपकी वार्षिक आय का 10-15 गुना है। यदि आप ₹10L/वर्ष कमाते हैं, तो आपको ₹1-1.5 Cr कवर चाहिए। अधिकांश भारतीयों के लिए ₹1 करोड़ न्यूनतम अनुशंसित है।", hinglish: "Common rule aapki annual income ka 10-15 guna hai. Agar aap ₹10L/year kamate hain, toh aapko ₹1-1.5 Cr cover chahiye." } },
  { q: { en: "What is the right age to buy term insurance?", hi: "टर्म इंश्योरेंस खरीदने की सही उम्र क्या है?", hinglish: "Term insurance khareedne ki sahi umar kya hai?" }, a: { en: "The earlier, the better! Premiums increase with age. At 25, a ₹1Cr plan costs ~₹650/month. At 35, it's ~₹1,100/month. At 45, it's ~₹3,000/month. Buy as soon as you have financial dependents — ideally before age 30.", hi: "जितना जल्दी, उतना अच्छा! प्रीमियम उम्र के साथ बढ़ता है। 25 पर ₹1Cr ₹650/माह, 35 पर ₹1,100/माह, 45 पर ₹3,000/माह। वित्तीय आश्रित होते ही खरीदें।", hinglish: "Jitna jaldi, utna achha! Premium age ke saath badhta hai. 25 pe ₹1Cr ₹650/month, 35 pe ₹1,100/month, 45 pe ₹3,000/month." } },
  { q: { en: "Should I buy riders with term insurance?", hi: "क्या मुझे टर्म इंश्योरेंस के साथ राइडर खरीदने चाहिए?", hinglish: "Kya mujhe term insurance ke saath riders khareedne chahiye?" }, a: { en: "Yes, the Critical Illness rider and Accidental Death Benefit rider are highly recommended. Critical Illness pays a lump sum on diagnosis of cancer, heart attack, etc. — covering loss of income. Accidental Death doubles the cover amount. Both add only ₹100-300/month to your premium.", hi: "हाँ, क्रिटिकल इलनेस राइडर और एक्सीडेंटल डेथ बेनिफिट राइडर अत्यधिक अनुशंसित हैं। क्रिटिकल इलनेस कैंसर आदि की पहचान पर एकमुश्त राशि देता है।", hinglish: "Haan, Critical Illness rider aur Accidental Death Benefit rider highly recommended hain." } },
  { q: { en: "Is LIC term insurance good?", hi: "क्या LIC टर्म इंश्योरेंस अच्छा है?", hinglish: "Kya LIC term insurance achha hai?" }, a: { en: "LIC has a strong claim settlement ratio (98.52%) and the highest trust among Indians. However, LIC's premiums are 20-30% higher than private insurers, and they offer fewer rider options. If trust and brand value are your priority, LIC is good. If you want better value and features, consider HDFC Life or Max Life.", hi: "LIC का मजबूत CSR (98.52%) है और भारतीयों में सबसे अधिक भरोसा है। हालांकि, LIC के प्रीमियम निजी बीमाकर्ताओं से 20-30% अधिक हैं।", hinglish: "LIC ka strong CSR (98.52%) hai aur Indians mein sabse zyada bharosa hai. Lekin, LIC ke premiums private insurers se 20-30% zyada hain." } },
];

export default function BestTermInsuranceClientContent() {
  const { language } = useLanguage();
  const lang = language as Language;

  const faqSchema = generateFAQSchema(faqs.map(f => ({ q: pt(f.q, lang), a: pt(f.a, lang) })));
  const articleSchema = generateArticleSchema({
    title: "Best Term Insurance Plans in India 2026",
    description: "Compare the best term insurance plans ranked by CSR, premium, riders, and Paliwal Secure Score™.",
    slug: "best-term-insurance-india",
    datePublished: "2025-01-30",
    dateModified: "2026-03-04",
  });

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="relative py-12 sm:py-20 bg-gradient-to-b from-[#0A1330] to-background overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <Badge className="mb-4 bg-[#C98A1C]/20 text-[#C98A1C] border-[#C98A1C]/30 rounded-full px-4 py-1">
            <Award className="w-3.5 h-3.5 mr-1" />
            {lang === 'hi' ? '2026 के सर्वश्रेष्ठ प्लान' : 'Best Plans 2026'}
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            <span className="gradient-text">{lang === 'hi' ? 'भारत का सर्वश्रेष्ठ' : 'Best Term Insurance'}</span>{' '}
            <span className="text-[#7ED3E6]">{lang === 'hi' ? 'टर्म इंश्योरेंस 2026' : 'India 2026'}</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
            {lang === 'hi'
              ? 'हमने 25+ टर्म प्लान की CSR, प्रीमियम, राइडर और Paliwal Secure Score™ द्वारा तुलना की। यहाँ शीर्ष 7 प्लान हैं।'
              : 'We compared 25+ term plans by CSR, premium, riders, and Paliwal Secure Score™. Here are the top 7 plans.'}
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
          Top 7 Term Plans — <span className="gradient-text">Quick Comparison</span>
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-semibold">Insurer</th>
                <th className="text-left p-3 font-semibold">Plan</th>
                <th className="text-left p-3 font-semibold">CSR</th>
                <th className="text-left p-3 font-semibold">Age 25</th>
                <th className="text-left p-3 font-semibold">Age 35</th>
                <th className="text-left p-3 font-semibold">Score</th>
              </tr>
            </thead>
            <tbody>
              {termPlans.map((plan, i) => (
                <tr key={i} className="border-t border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{plan.insurer}</td>
                  <td className="p-3 text-muted-foreground">{plan.plan}</td>
                  <td className="p-3">
                    <Badge variant={plan.csr >= 99 ? 'default' : 'secondary'} className="text-xs">
                      {plan.csr}%
                    </Badge>
                  </td>
                  <td className="p-3">{plan.premium25}</td>
                  <td className="p-3">{plan.premium35}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <div className="w-8 h-8 rounded-full bg-[#C98A1C]/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-[#C98A1C]">{plan.rating}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          * Premiums shown for ₹1 Crore cover, non-smoker male, 30-year policy term. Actual premiums may vary.
        </p>
      </section>

      {/* Paliwal Ratings */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
          Paliwal Secure Rating™ — <span className="gradient-text">Term Insurance Leaders</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {termPlans.slice(0, 4).map((plan) => (
            <PaliwalSecureRating
              key={plan.insurer}
              insurerName={plan.insurer}
              metrics={{
                claimSettlementRatio: plan.csr,
                solvencyRatio: plan.solvency,
                claimTurnaroundDays: parseInt(plan.claimTime),
              }}
              compact
            />
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
          Term Insurance <span className="gradient-text">FAQ</span>
        </h2>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-card rounded-2xl border border-border px-4">
              <AccordionTrigger className="text-left text-sm font-medium hover:no-underline py-4">
                {pt(faq.q, lang)}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                {pt(faq.a, lang)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Disclaimer */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="p-4 bg-muted/50 rounded-2xl border border-border/50">
          <div className="flex items-start gap-3">
            <Scale className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">{irdaiDisclaimer[lang]}</p>
          </div>
        </div>
      </section>

      <AuthorBio />

      {/* Related */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl font-bold text-foreground mb-6">Related Articles</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(relatedArticlesMap['term'] || []).map((link) => (
            <Link key={link.slug} href={link.slug} className="group">
              <Card className="rounded-2xl h-full hover:border-[#C98A1C]/50 transition-colors">
                <CardContent className="p-4 flex items-center gap-3">
                  <ArrowRight className="w-4 h-4 text-[#C98A1C] group-hover:translate-x-1 transition-transform" />
                  <span className="text-sm font-medium text-foreground">{pt(link.title, lang)}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-b from-[#0A1330] to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            {lang === 'hi' ? 'सही टर्म प्लान चुनें' : 'Choose the Right Term Plan'}
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            {lang === 'hi'
              ? 'WhatsApp पर हिमांशु पालीवाल से चैट करें — मुफ़्त व्यक्तिगत सिफारिश।'
              : 'Chat with Himanshu Paliwal on WhatsApp — free personalized recommendation from 51+ insurers.'}
          </p>
          <a href={getWhatsAppCTA('Hi! I need help choosing the best term insurance plan.')}>
            <ShinyButton className="bg-[#25D366] hover:bg-[#20BD5A] text-white text-lg px-8 py-4">
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat on WhatsApp
            </ShinyButton>
          </a>
        </div>
      </section>
    </div>
  );
}
