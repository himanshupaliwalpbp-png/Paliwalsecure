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
import { CSR_ICR_DATA } from '@/data/irdai-datasets';
import { BookOpen, ArrowRight, MessageCircle, Scale, TrendingUp, Award, AlertTriangle, Info } from 'lucide-react';

type TEntry = { en: string; hi: string; hinglish: string };
const pt = (obj: TEntry, lang: Language): string => obj[lang] || obj.en;

const faqs = [
  { q: { en: "What is claim settlement ratio (CSR)?", hi: "क्लेम सेटलमेंट रेश्यो (CSR) क्या है?", hinglish: "Claim Settlement Ratio (CSR) kya hai?" }, a: { en: "Claim Settlement Ratio is the percentage of insurance claims an insurer settles (approves) out of the total claims received in a financial year. For example, if an insurer receives 1000 claims and settles 980, the CSR is 98%. A higher CSR means the insurer is more reliable in paying claims.", hi: "क्लेम सेटलमेंट रेश्यो एक वित्तीय वर्ष में प्राप्त कुल क्लेम में से बीमाकर्ता द्वारा निपटाए गए क्लेम का प्रतिशत है। उदाहरण के लिए, यदि बीमाकर्ता को 1000 क्लेम प्राप्त होते हैं और 980 निपटाता है, तो CSR 98% है।", hinglish: "Claim Settlement Ratio woh percentage hai jo insurer settle (approve) karta hai total claims received mein se ek financial year mein. Example, agar insurer ko 1000 claims milte hain aur 980 settle karta hai, toh CSR 98% hai." } },
  { q: { en: "What is a good claim settlement ratio?", hi: "अच्छा क्लेम सेटलमेंट रेश्यो क्या है?", hinglish: "Achha claim settlement ratio kya hai?" }, a: { en: "A CSR above 95% is considered excellent, 90-95% is good, and below 90% needs improvement. For term insurance (life), look for CSR above 97%. For health insurance, CSR above 90% is acceptable. However, CSR should not be the only metric — also consider incurred claim ratio, solvency ratio, and claim turnaround time.", hi: "95% से अधिक CSR उत्कृष्ट, 90-95% अच्छा, और 90% से कम सुधार की ज़रूरत माना जाता है। टर्म इंश्योरेंस के लिए 97% से अधिक CSR देखें। हेल्थ इंश्योरेंस के लिए 90% से अधिक स्वीकार्य है।", hinglish: "95% se adhik CSR excellent, 90-95% achha, aur 90% se kam improvement ki zaroorat mana jata hai. Term insurance ke liye 97% se adhik CSR dekhein." } },
  { q: { en: "Is claim settlement ratio the only thing to check?", hi: "क्या क्लेम सेटलमेंट रेश्यो ही एकमात्र जाँचने की चीज़ है?", hinglish: "Kya CSR hi ekmatra check karne ki cheez hai?" }, a: { en: "No! CSR alone can be misleading. A very high CSR (99%+) with a very low ICR (below 50%) might mean the insurer is rejecting valid claims to save money. Always check: (1) CSR, (2) ICR (ideal: 60-80%), (3) Solvency Ratio (>1.5), (4) Complaints per 10K policies, and (5) Claim Turnaround Time. The Paliwal Secure Score™ combines all 6 metrics for a comprehensive rating.", hi: "नहीं! CSR अकेला भ्रामक हो सकता है। बहुत उच्च CSR (99%+) बहुत कम ICR (50% से कम) के साथ हो सकता है जिसका अर्थ है कि बीमाकर्ता पैसे बचाने के लिए वैध क्लेम अस्वीकार कर रहा है। हमेशा CSR, ICR, सॉल्वेंसी रेश्यो, शिकायतें और क्लेम टर्नअराउंड समय जाँचें।", hinglish: "Nahi! CSR akelea misleading ho sakta hai. Bahut high CSR (99%+) bahut low ICR (50% se kam) ke saath ho sakta hai jiska matlab hai ki insurer valid claims reject kar raha hai. Hamesha CSR, ICR, Solvency Ratio, Complaints aur Turnaround Time check karein." } },
  { q: { en: "What is the difference between CSR and ICR?", hi: "CSR और ICR में क्या अंतर है?", hinglish: "CSR aur ICR mein kya antar hai?" }, a: { en: "CSR (Claim Settlement Ratio) measures what percentage of claims are approved. ICR (Incurred Claim Ratio) measures how much the insurer pays in claims vs. how much it collects in premiums. ICR of 70% means the insurer pays ₹70 in claims for every ₹100 collected as premium. An ideal ICR is 60-80% — below 50% suggests the insurer is too strict; above 100% means they're paying more than collecting (financially unsustainable).", hi: "CSR मापता है कि कितने प्रतिशत क्लेम स्वीकृत होते हैं। ICR मापता है कि बीमाकर्ता क्लेम में कितना चुकाता है बनाम प्रीमियम में कितना एकत्र करता है। 70% का ICR अर्थ है बीमाकर्ता ₹100 प्रीमियम पर ₹70 क्लेम में चुकाता है।", hinglish: "CSR measure karta hai kitne percent claims approve hote hain. ICR measure karta hai insurer kitna claims mein pay karta hai vs kitna premium mein collect karta hai." } },
  { q: { en: "Which insurer has the highest claim settlement ratio in India?", hi: "भारत में किस बीमाकर्ता का सबसे अधिक CSR है?", hinglish: "India mein kis insurer ka sabse adhik CSR hai?" }, a: { en: "Based on IRDAI data 2025-26: For health/general insurance, Acko (99.91%), Reliance General (99.32%), and HDFC ERGO (98.85%) have the highest CSR. For life insurance, LIC (98.52%), Max Life (99.35%), and HDFC Life (99.39%) lead. Remember to also check ICR, solvency, and complaints data alongside CSR.", hi: "IRDAI डेटा 2025-26 के आधार पर: हेल्थ/जनरल इंश्योरेंस के लिए Acko (99.91%), Reliance General (99.32%), और HDFC ERGO (98.85%) का सबसे अधिक CSR है। लाइफ इंश्योरेंस के लिए LIC (98.52%), Max Life (99.35%), और HDFC Life (99.39%) अग्रणी हैं।", hinglish: "IRDAI data 2025-26 ke aadhar par: Health/General insurance ke liye Acko (99.91%), Reliance General (99.32%), aur HDFC ERGO (98.85%) ka sabse adhik CSR hai." } },
];

export default function ClaimSettlementRatioClientContent() {
  const { language } = useLanguage();
  const lang = language as Language;

  const faqSchema = generateFAQSchema(faqs.map(f => ({ q: pt(f.q, lang), a: pt(f.a, lang) })));
  const articleSchema = generateArticleSchema({
    title: "Claim Settlement Ratio Explained — IRDAI Data 2026",
    description: "What is CSR? How IRDAI measures it, latest CSR data for all Indian insurers, and how to use it when choosing insurance.",
    slug: "claim-settlement-ratio",
    datePublished: "2025-01-25",
    dateModified: "2026-03-04",
  });

  // Get unique insurers from CSR data and sort by CSR
  const sortedCSRData = [...CSR_ICR_DATA].sort((a, b) => b.csr - a.csr);

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="relative py-12 sm:py-20 bg-gradient-to-b from-[#0A1330] to-background overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <Badge className="mb-4 bg-[#C98A1C]/20 text-[#C98A1C] border-[#C98A1C]/30 rounded-full px-4 py-1">
            <Award className="w-3.5 h-3.5 mr-1" />
            IRDAI Data 2026
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            <span className="gradient-text">Claim Settlement Ratio</span>{' '}
            <span className="text-[#7ED3E6]">Explained</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
            {lang === 'hi'
              ? 'क्लेम सेटलमेंट रेश्यो (CSR) एक बीमाकर्ता की विश्वसनीयता का सबसे महत्वपूर्ण माप है। IRDAI के नवीनतम डेटा के साथ, सभी भारतीय बीमाकर्ताओं का CSR समझें।'
              : lang === 'hinglish'
              ? 'Claim Settlement Ratio (CSR) ek insurer ki reliability ka sabse important measure hai. IRDAI ke latest data ke saath, sabhi Indian insurers ka CSR samjho.'
              : 'Claim Settlement Ratio (CSR) is the most important measure of an insurer\'s reliability. Understand CSR for all Indian insurers with the latest IRDAI data.'}
          </p>
        </div>
      </section>

      {/* What is CSR */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <Card className="rounded-2xl border-[#C98A1C]/20">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Info className="w-6 h-6 text-[#C98A1C]" />
              What is Claim Settlement Ratio?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {lang === 'hi'
                ? 'CSR = (निपटाए गए क्लेम / प्राप्त कुल क्लेम) × 100। उदाहरण: यदि बीमाकर्ता को 1000 क्लेम प्राप्त होते हैं और वह 980 निपटाता है, तो CSR = 98%। IRDAI द्वारा प्रकाशित वार्षिक डेटा यह सबसे विश्वसनीय स्रोत है।'
                : lang === 'hinglish'
                ? 'CSR = (Settled Claims / Total Claims Received) × 100. Example: Agar insurer ko 1000 claims milte hain aur woh 980 settle karta hai, toh CSR = 98%. IRDAI dwara published annual data yeh sabse reliable source hai.'
                : 'CSR = (Claims Settled / Total Claims Received) × 100. Example: If an insurer receives 1000 claims and settles 980, CSR = 98%. Published annually by IRDAI, this is the most reliable source of claim data.'}
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-xl text-center">
                <p className="text-2xl font-extrabold text-green-600">95%+</p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">{lang === 'hi' ? 'उत्कृष्ट' : 'Excellent'}</p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl text-center">
                <p className="text-2xl font-extrabold text-amber-600">90-95%</p>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">{lang === 'hi' ? 'अच्छा' : 'Good'}</p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-xl text-center">
                <p className="text-2xl font-extrabold text-red-600">&lt;90%</p>
                <p className="text-xs text-red-700 dark:text-red-300 mt-1">{lang === 'hi' ? 'सुधार आवश्यक' : 'Needs Improvement'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CSR Data Table */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
          IRDAI CSR Data — <span className="gradient-text">All Insurers 2025-26</span>
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-border max-h-96 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 sticky top-0 z-10">
              <tr>
                <th className="text-left p-3 font-semibold">#</th>
                <th className="text-left p-3 font-semibold">Insurer</th>
                <th className="text-left p-3 font-semibold">CSR (%)</th>
                <th className="text-left p-3 font-semibold">ICR (%)</th>
                <th className="text-left p-3 font-semibold">Classification</th>
              </tr>
            </thead>
            <tbody>
              {sortedCSRData.map((row, i) => (
                <tr key={i} className="border-t border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-3 text-muted-foreground">{i + 1}</td>
                  <td className="p-3 font-medium">{row.insurer}</td>
                  <td className="p-3">
                    <Badge variant={row.csr >= 97 ? 'default' : row.csr >= 90 ? 'secondary' : 'destructive'} className="text-xs">
                      {row.csr}%
                    </Badge>
                  </td>
                  <td className="p-3">{row.icr}%</td>
                  <td className="p-3 text-xs">{row.classification}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Paliwal Ratings */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
          Paliwal Secure Rating™ — <span className="gradient-text">Top Rated Insurers</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {sortedCSRData.slice(0, 4).map((insurer) => (
            <PaliwalSecureRating
              key={insurer.insurer}
              insurerName={insurer.insurer}
              metrics={{
                claimSettlementRatio: insurer.csr,
                incurredClaimRatio: insurer.icr,
              }}
              compact
            />
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
          Claim Settlement Ratio <span className="gradient-text">FAQ</span>
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
            {lang === 'hi' ? 'CSR को लेकर confused?' : lang === 'hinglish' ? 'CSR ke baare mein confused?' : 'Confused about CSR?'}
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            {lang === 'hi'
              ? 'WhatsApp पर हिमांशु पालीवाल से चैट करें — सही बीमाकर्ता चुनने में व्यक्तिगत सलाह प्राप्त करें।'
              : 'Chat with Himanshu Paliwal on WhatsApp — get personalized advice on choosing the right insurer.'}
          </p>
          <a href={getWhatsAppCTA('Hi! I need help understanding claim settlement ratios.')}>
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
