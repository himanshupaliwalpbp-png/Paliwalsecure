'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { Language } from '@/lib/i18n-strings';
import { ShinyButton } from '@/components/ui/shiny-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import AuthorBio from '@/components/AuthorBio';
import { generateFAQSchema, generateArticleSchema, irdaiDisclaimer, relatedArticlesMap, getWhatsAppCTA } from '@/lib/content-templates';
import { IndianRupee, MessageCircle, Scale, Calculator, AlertTriangle, CheckCircle2, BookOpen } from 'lucide-react';

type TEntry = { en: string; hi: string; hinglish: string };
const pt = (obj: TEntry, lang: Language): string => obj[lang] || obj.en;

const premiumData = [
  { age: 25, monthly: '₹549', annual: '₹6,588', insurers: 'HDFC Life, Tata AIA' },
  { age: 30, monthly: '₹649', annual: '₹7,788', insurers: 'Max Life, HDFC Life' },
  { age: 35, monthly: '₹1,099', annual: '₹13,188', insurers: 'Tata AIA, SBI Life' },
  { age: 40, monthly: '₹1,649', annual: '₹19,788', insurers: 'ICICI Pru, Kotak' },
  { age: 45, monthly: '₹2,999', annual: '₹35,988', insurers: 'LIC, HDFC Life' },
  { age: 50, monthly: '₹4,999', annual: '₹59,988', insurers: 'SBI Life, Max Life' },
];

const faqs = [
  { q: { en: "Is ₹1 Crore term insurance enough?", hi: "क्या ₹1 करोड़ का टर्म इंश्योरेंस पर्याप्त है?", hinglish: "Kya ₹1 Crore term insurance enough hai?" }, a: { en: "For most people earning ₹5-10L/year, ₹1 Crore is the minimum recommended. But if you have a home loan, car loan, or children's education expenses, you may need ₹1.5-2 Crore. Rule of thumb: Cover = 10-15× annual income + all outstanding loans.", hi: "₹5-10L/वर्ष कमाने वाले अधिकांश लोगों के लिए, ₹1 करोड़ न्यूनतम अनुशंसित है। लेकिन यदि आपके पास होम लोन, कार लोन है, तो आपको ₹1.5-2 करोड़ की ज़रूरत हो सकती है।", hinglish: "₹5-10L/year kamane waale logon ke liye, ₹1 Crore minimum recommended hai. Lekin agar home loan, car loan hai, toh ₹1.5-2 Crore ki zaroorat ho sakti hai." } },
  { q: { en: "How much does ₹1 Crore term insurance cost?", hi: "₹1 करोड़ टर्म इंश्योरेंस कितने का होता है?", hinglish: "₹1 Crore term insurance kitne ka hota hai?" }, a: { en: "At age 25: ₹549/month. At age 30: ₹649/month. At age 35: ₹1,099/month. At age 40: ₹1,649/month. Premiums increase significantly with age — buy early to lock in low rates for the entire policy term.", hi: "25 वर्ष: ₹549/माह। 30 वर्ष: ₹649/माह। 35 वर्ष: ₹1,099/माह। 40 वर्ष: ₹1,649/माह। प्रीमियम उम्र के साथ काफी बढ़ता है — कम दरें लॉक करने के लिए जल्दी खरीदें।", hinglish: "Age 25: ₹549/month. Age 30: ₹649/month. Age 35: ₹1,099/month. Age 40: ₹1,649/month." } },
  { q: { en: "What riders should I add to ₹1 Crore term plan?", hi: "₹1 करोड़ टर्म प्लान में कौन से राइडर जोड़ें?", hinglish: "₹1 Crore term plan mein kaun se riders add karein?" }, a: { en: "Must-have riders: (1) Critical Illness ₹25-50L — covers cancer, heart attack with lump sum payment. (2) Accidental Death Benefit — doubles the cover. (3) Waiver of Premium — future premiums waived if you're disabled. These add ₹200-500/month but provide crucial protection.", hi: "ज़रूरी राइडर: (1) क्रिटिकल इलनेस ₹25-50L, (2) एक्सीडेंटल डेथ बेनिफिट, (3) प्रीमियम माफ़ी। ये ₹200-500/माह जोड़ते हैं लेकिन महत्वपूर्ण सुरक्षा देते हैं।", hinglish: "Must-have riders: (1) Critical Illness ₹25-50L, (2) Accidental Death Benefit, (3) Waiver of Premium. Ye ₹200-500/month add karte hain lekin crucial protection dete hain." } },
];

export default function OneCroreTermClientContent() {
  const { language } = useLanguage();
  const lang = language as Language;
  const articleSchema = generateArticleSchema({ title: "₹1 Crore Term Insurance — Is It Enough? 2026", description: "Is ₹1 Crore term insurance enough? Calculate coverage, compare premiums.", slug: "1-crore-term-insurance", datePublished: "2025-03-10", dateModified: "2026-03-04" });
  const faqSchema = generateFAQSchema(faqs.map(f => ({ q: pt(f.q, lang), a: pt(f.a, lang) })));

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="relative py-12 sm:py-20 bg-gradient-to-b from-[#0A1330] to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <Badge className="mb-4 bg-[#C98A1C]/20 text-[#C98A1C] border-[#C98A1C]/30 rounded-full px-4 py-1"><IndianRupee className="w-3.5 h-3.5 mr-1" />Term Insurance 2026</Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            <span className="text-[#C98A1C]">₹1 Crore</span>{' '}
            <span className="gradient-text">{lang === 'hi' ? 'टर्म इंश्योरेंस' : 'Term Insurance'}</span>{' '}
            <span className="text-[#7ED3E6]">{lang === 'hi' ? 'पर्याप्त है?' : 'Is It Enough?'}</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
            {lang === 'hi' ? '₹1 करोड़ का टर्म इंश्योरेंस पर्याप्त है या नहीं? प्रीमियम तुलना, कवरेज कैलकुलेटर, और विशेषज्ञ सलाह।' : 'Is ₹1 Crore term insurance enough? Premium comparison, coverage calculator, and expert advice.'}
          </p>
        </div>
      </section>

      {/* Premium Table */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl font-bold text-foreground mb-8">{lang === 'hi' ? '₹1 करोड़ टर्म प्रीमियम — उम्र के अनुसार' : '₹1 Crore Term Premium — By Age'}</h2>
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-semibold">{lang === 'hi' ? 'आयु' : 'Age'}</th>
                <th className="text-left p-3 font-semibold">{lang === 'hi' ? 'मासिक' : 'Monthly'}</th>
                <th className="text-left p-3 font-semibold">{lang === 'hi' ? 'वार्षिक' : 'Annual'}</th>
                <th className="text-left p-3 font-semibold">{lang === 'hi' ? 'शीर्ष बीमाकर्ता' : 'Top Insurers'}</th>
              </tr>
            </thead>
            <tbody>
              {premiumData.map((row) => (
                <tr key={row.age} className="border-t border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{row.age} {lang === 'hi' ? 'वर्ष' : 'years'}</td>
                  <td className="p-3"><Badge className="text-xs">{row.monthly}</Badge></td>
                  <td className="p-3">{row.annual}</td>
                  <td className="p-3 text-muted-foreground">{row.insurers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">*₹1 Crore cover, non-smoker male, 30-year term. Actual premiums may vary.</p>
      </section>

      {/* Coverage Calculator */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3"><Calculator className="w-7 h-7 text-[#C98A1C]" />{lang === 'hi' ? 'कितना कवर चाहिए?' : 'How Much Cover Do You Need?'}</h2>
        <Card className="rounded-2xl border-[#C98A1C]/20">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-xl text-center">
                  <p className="text-xs text-muted-foreground mb-1">{lang === 'hi' ? 'वार्षिक आय' : 'Annual Income'}</p>
                  <p className="text-2xl font-extrabold text-[#C98A1C]">₹10L</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl text-center">
                  <p className="text-xs text-muted-foreground mb-1">{lang === 'hi' ? 'ऋण' : 'Loans'}</p>
                  <p className="text-2xl font-extrabold text-red-500">₹30L</p>
                </div>
              </div>
              <div className="p-4 bg-[#C98A1C]/10 rounded-xl text-center">
                <p className="text-sm text-muted-foreground mb-1">{lang === 'hi' ? 'अनुशंसित कवरेज' : 'Recommended Cover'}</p>
                <p className="text-3xl font-extrabold text-[#C98A1C]">₹1.3 - ₹1.8 Crore</p>
                <p className="text-xs text-muted-foreground mt-1">10-15× Income + Loans</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl font-bold text-foreground mb-8">FAQ</h2>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-card rounded-2xl border border-border px-4">
              <AccordionTrigger className="text-left text-sm font-medium hover:no-underline py-4">{pt(faq.q, lang)}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">{pt(faq.a, lang)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6"><div className="p-4 bg-muted/50 rounded-2xl border border-border/50"><div className="flex items-start gap-3"><Scale className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" /><p className="text-xs text-muted-foreground leading-relaxed">{irdaiDisclaimer[lang]}</p></div></div></section>
      <AuthorBio />

      <section className="py-16 bg-gradient-to-b from-[#0A1330] to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{lang === 'hi' ? 'सही कवरेज चुनें' : 'Choose the Right Coverage'}</h2>
          <a href={getWhatsAppCTA('Hi! I need help choosing the right term insurance coverage amount.')}>
            <ShinyButton className="bg-[#25D366] hover:bg-[#20BD5A] text-white text-lg px-8 py-4"><MessageCircle className="w-5 h-5 mr-2" />Chat on WhatsApp</ShinyButton>
          </a>
        </div>
      </section>
    </div>
  );
}
