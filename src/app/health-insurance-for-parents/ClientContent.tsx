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
import { healthInsurancePlans } from '@/lib/insurance-data';
import { Heart, MessageCircle, Scale, BookOpen, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';

type TEntry = { en: string; hi: string; hinglish: string };
const pt = (obj: TEntry, lang: Language): string => obj[lang] || obj.en;

const parentPlans = [
  { insurer: 'Care Health Insurance', plan: 'Care Senior', entryAge: '5-75 years', pedWait: '24 months', copay: '20%', roomRent: 'Single AC', network: '21,700+', verdict: '✅ Best for PED coverage' },
  { insurer: 'Star Health', plan: 'Red Carpet', entryAge: '60-75 years', pedWait: '36 months', copay: '10%', roomRent: '1% of SI', network: '14,000+', verdict: '⚠️ Check room rent' },
  { insurer: 'Niva Bupa', plan: 'Health Companion', entryAge: '18-65 years', pedWait: '24 months', copay: '10%', roomRent: 'Single AC', network: '10,000+', verdict: '✅ Good for younger parents' },
  { insurer: 'HDFC ERGO', plan: 'Optima Secure', entryAge: '18-65 years', pedWait: '24 months', copay: 'No co-pay', roomRent: 'Deluxe room', network: '10,000+', verdict: '✅ Best no co-pay' },
  { insurer: 'New India Assurance', plan: 'Senior Citizen', entryAge: '60-80 years', pedWait: '36 months', copay: '10%', roomRent: 'As per plan', network: '3,000+', verdict: '⚠️ Govt option' },
];

const keyTips = [
  { en: "Buy before age 60 — premiums increase significantly after 60", hi: "60 वर्ष से पहले खरीदें — 60 के बाद प्रीमियम काफी बढ़ता है", hinglish: "60 saal se pehle khareedein — 60 ke baad premium kaafi badhta hai" },
  { en: "Choose zero co-pay or max 10% co-pay — parents have frequent hospital visits", hi: "ज़ीरो को-पे या अधिकतम 10% को-पे चुनें — माता-पिता के अस्पताल आने-जाने अधिक होते हैं", hinglish: "Zero co-pay ya max 10% co-pay chunein — parents ke hospital visits zyada hote hain" },
  { en: "Check PED waiting period — 24 months is best, 48 months is too long for seniors", hi: "PED वेटिंग पीरियड जाँचें — 24 महीने सर्वोत्तम, 48 महीने वरिष्ठों के लिए बहुत लंबे", hinglish: "PED waiting period check karein — 24 months best, 48 months bahut lambe seniors ke liye" },
  { en: "No room rent limit is essential — parents need comfortable rooms for long stays", hi: "कोई रूम रेंट लिमिट ज़रूरी — माता-पिता को लंबे ठहरने के लिए आरामदायक कमरे चाहिए", hinglish: "No room rent limit zaroori — parents ko lambe rehne ke liye comfortable rooms chahiye" },
  { en: "Ensure your local hospitals are in-network for cashless claims", hi: "सुनिश्चित करें कि आपके स्थानीय अस्पताल कैशलेस क्लेम के लिए नेटवर्क में हैं", hinglish: "Ensure karein ki aapke local hospitals network mein hain cashless claims ke liye" },
];

const faqs = [
  { q: { en: "Can I get health insurance for my 65-year-old parents?", hi: "क्या मैं अपने 65 वर्षीय माता-पिता के लिए हेल्थ इंश्योरेंस प्राप्त कर सकता हूँ?", hinglish: "Kya main apne 65-year-old parents ke liye health insurance pa kar sakta hoon?" }, a: { en: "Yes! Care Health Insurance allows entry up to age 75. Star Health Red Carpet is specifically designed for 60-75 age group. However, premiums will be higher and co-pay may apply. Buy before age 60 for best rates.", hi: "हाँ! Care Health Insurance 75 वर्ष तक प्रवेश की अनुमति देता है। Star Health Red Carpet विशेष रूप से 60-75 आयु वर्ग के लिए है।", hinglish: "Haan! Care Health Insurance allows entry up to age 75. Star Health Red Carpet specifically 60-75 age group ke liye hai." } },
  { q: { en: "Should I include parents in my family floater?", hi: "क्या मुझे अपने माता-पिता को अपने फैमिली फ्लोटर में शामिल करना चाहिए?", hinglish: "Kya main apne parents ko family floater mein shamil karna chahiye?" }, a: { en: "No! This is a common mistake. Parents' medical expenses are typically much higher, which will exhaust the shared sum insured quickly. Always buy a separate policy for parents — this protects both your family coverage and gives parents dedicated protection.", hi: "नहीं! यह एक आम गलती है। माता-पिता के चिकित्सा खर्च आमतौर पर बहुत अधिक होते हैं। हमेशा माता-पिता के लिए अलग पॉलिसी खरीदें।", hinglish: "Nahi! Ye ek common galti hai. Parents ke medical expenses typically bahut zyada hote hain. Hamesha parents ke liye alag policy khareedein." } },
  { q: { en: "What is the best health insurance for senior citizens?", hi: "वरिष्ठ नागरिकों के लिए सर्वश्रेष्ठ हेल्थ इंश्योरेंस कौन सा है?", hinglish: "Senior citizens ke liye best health insurance kaunsa hai?" }, a: { en: "Care Health Senior (entry up to 75, 24-month PED wait) and HDFC ERGO Optima Secure (no co-pay, deluxe room) are our top picks. For 60+ specifically, Star Health Red Carpet is also a good option. Always choose zero co-pay and no room rent limit plans for seniors.", hi: "Care Health Senior (75 तक प्रवेश, 24 महीने PED प्रतीक्षा) और HDFC ERGO Optima Secure (कोई को-पे नहीं, डीलक्स कमरा) हमारे शीर्ष चयन हैं।", hinglish: "Care Health Senior aur HDFC ERGO Optima Secure hamare top picks hain." } },
];

export default function HealthInsuranceForParentsClientContent() {
  const { language } = useLanguage();
  const lang = language as Language;
  const articleSchema = generateArticleSchema({ title: "Best Health Insurance for Parents in India 2026", description: "Compare the best health insurance plans for parents.", slug: "health-insurance-for-parents", datePublished: "2025-02-20", dateModified: "2026-03-04" });
  const faqSchema = generateFAQSchema(faqs.map(f => ({ q: pt(f.q, lang), a: pt(f.a, lang) })));

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="relative py-12 sm:py-20 bg-gradient-to-b from-[#0A1330] to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <Badge className="mb-4 bg-[#C98A1C]/20 text-[#C98A1C] border-[#C98A1C]/30 rounded-full px-4 py-1"><Heart className="w-3.5 h-3.5 mr-1" />Parents Insurance Guide 2026</Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            <span className="gradient-text">{lang === 'hi' ? 'माता-पिता के लिए सर्वश्रेष्ठ' : 'Best Health Insurance'}</span>{' '}
            <span className="text-[#7ED3E6]">{lang === 'hi' ? 'हेल्थ इंश्योरेंस' : 'for Parents'}</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
            {lang === 'hi' ? 'माता-पिता के लिए सही हेल्थ इंश्योरेंस चुनना सबसे ज़रूरी निर्णय है। PED कवरेज, को-पे, वेटिंग पीरियड और नेटवर्क अस्पतालों की तुलना करें।' : 'Choosing the right health insurance for your parents is the most important decision. Compare PED coverage, co-pay, waiting periods, and network hospitals.'}
          </p>
        </div>
      </section>

      {/* Key Tips */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl font-bold text-foreground mb-6">{lang === 'hi' ? 'माता-पिता के लिए 5 ज़रूरी टिप्स' : '5 Essential Tips for Parents\' Insurance'}</h2>
        <div className="space-y-3">
          {keyTips.map((tip, i) => (
            <Card key={i} className="rounded-2xl border-l-4 border-l-[#C98A1C]">
              <CardContent className="p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#C98A1C] shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">{pt(tip, lang)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl font-bold text-foreground mb-8">{lang === 'hi' ? 'माता-पिता के लिए प्लान तुलना' : 'Plans Comparison for Parents'}</h2>
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-semibold">Insurer</th>
                <th className="text-left p-3 font-semibold">Plan</th>
                <th className="text-left p-3 font-semibold">Entry Age</th>
                <th className="text-left p-3 font-semibold">PED Wait</th>
                <th className="text-left p-3 font-semibold">Co-Pay</th>
                <th className="text-left p-3 font-semibold">Room</th>
                <th className="text-left p-3 font-semibold">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {parentPlans.map((row, i) => (
                <tr key={i} className="border-t border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{row.insurer}</td>
                  <td className="p-3">{row.plan}</td>
                  <td className="p-3">{row.entryAge}</td>
                  <td className="p-3"><Badge variant={row.pedWait === '24 months' ? 'default' : 'destructive'} className="text-xs">{row.pedWait}</Badge></td>
                  <td className="p-3">{row.copay}</td>
                  <td className="p-3">{row.roomRent}</td>
                  <td className="p-3 text-xs">{row.verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Paliwal Ratings */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl font-bold text-foreground mb-8">Paliwal Secure Rating™</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {healthInsurancePlans.slice(0, 4).map((plan) => (
            <PaliwalSecureRating key={plan.id} insurerName={plan.provider} metrics={{ claimSettlementRatio: plan.claimSettlementRatio, incurredClaimRatio: plan.incurredClaimRatio, networkHospitals: plan.networkHospitals, solvencyRatio: plan.solvencyRatio, complaintsPer10k: plan.complaintsPer10k, claimTurnaroundDays: plan.claimTurnaroundDays }} compact />
          ))}
        </div>
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
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{lang === 'hi' ? 'माता-पिता के लिए सही प्लान चुनें' : 'Choose the Right Plan for Parents'}</h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">{lang === 'hi' ? 'WhatsApp पर मुफ़्त सलाह प्राप्त करें।' : 'Get free personalized advice on WhatsApp.'}</p>
          <a href={getWhatsAppCTA('Hi! I need help choosing health insurance for my parents.')}>
            <ShinyButton className="bg-[#25D366] hover:bg-[#20BD5A] text-white text-lg px-8 py-4"><MessageCircle className="w-5 h-5 mr-2" />Chat on WhatsApp</ShinyButton>
          </a>
        </div>
      </section>
    </div>
  );
}
