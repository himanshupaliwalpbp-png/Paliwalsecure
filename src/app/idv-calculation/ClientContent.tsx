'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { Language } from '@/lib/i18n-strings';
import { ShinyButton } from '@/components/ui/shiny-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import AuthorBio from '@/components/AuthorBio';
import { generateFAQSchema, generateArticleSchema, irdaiDisclaimer, relatedArticlesMap, getWhatsAppCTA } from '@/lib/content-templates';
import { BookOpen, ArrowRight, MessageCircle, Scale, Calculator, Car, TrendingDown, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

type TEntry = { en: string; hi: string; hinglish: string };
const pt = (obj: TEntry, lang: Language): string => obj[lang] || obj.en;

const depRates = [
  { age: { en: "0-6 months", hi: "0-6 महीने", hinglish: "0-6 months" }, dep: "5%", example: "₹10L car → ₹9.5L IDV" },
  { age: { en: "6 months - 1 year", hi: "6 महीने - 1 साल", hinglish: "6 months - 1 year" }, dep: "15%", example: "₹10L car → ₹8.5L IDV" },
  { age: { en: "1-2 years", hi: "1-2 साल", hinglish: "1-2 years" }, dep: "20%", example: "₹10L car → ₹8.0L IDV" },
  { age: { en: "2-3 years", hi: "2-3 साल", hinglish: "2-3 years" }, dep: "30%", example: "₹10L car → ₹7.0L IDV" },
  { age: { en: "3-4 years", hi: "3-4 साल", hinglish: "3-4 years" }, dep: "40%", example: "₹10L car → ₹6.0L IDV" },
  { age: { en: "4-5 years", hi: "4-5 साल", hinglish: "4-5 years" }, dep: "50%", example: "₹10L car → ₹5.0L IDV" },
  { age: { en: "5+ years", hi: "5+ साल", hinglish: "5+ years" }, dep: "Mutual agreement", example: "Negotiated with insurer" },
];

const faqs = [
  { q: { en: "What is IDV in car insurance?", hi: "कार इंश्योरेंस में IDV क्या है?", hinglish: "Car insurance mein IDV kya hai?" }, a: { en: "IDV (Insured Declared Value) is the maximum amount your insurer will pay if your car is stolen or totally damaged (beyond repair). It's approximately the current market value of your car minus depreciation. Higher IDV = higher premium but better claim payout.", hi: "IDV (इंश्योर्ड डिक्लेयर्ड वैल्यू) अधिकतम राशि है जो आपका बीमाकर्ता चुकाएगा यदि आपकी कार चोरी हो जाए या पूरी तरह नष्ट हो जाए। यह लगभग आपकी कार का वर्तमान बाजार मूल्य घटा डेप्रिसिएशन है।", hinglish: "IDV (Insured Declared Value) maximum amount hai jo insurer pay karega agar car chori ho jaye ya total damage ho jaye. Ye approximately car ka current market value minus depreciation hai." } },
  { q: { en: "How is IDV calculated?", hi: "IDV की गणना कैसे होती है?", hinglish: "IDV ki ganana kaise hoti hai?" }, a: { en: "IDV = (Manufacturer's Ex-Showroom Price - Depreciation) + Accessories Value. Depreciation is fixed by IRDAI based on car age: 5% for new, up to 50% for 5-year-old cars. Example: A ₹10L car that's 2 years old has 20% depreciation, so IDV = ₹10L - ₹2L = ₹8L.", hi: "IDV = (निर्माता का एक्स-शोरूम मूल्य - डेप्रिसिएशन) + एक्सेसरीज़ मूल्य। डेप्रिसिएशन IRDAI द्वारा कार की उम्र के आधार पर तय किया जाता है।", hinglish: "IDV = (Manufacturer Ex-Showroom Price - Depreciation) + Accessories Value. Depreciation IRDAI dwara car ki age ke aadhar par fix kiya jata hai." } },
  { q: { en: "Should I set IDV high or low?", hi: "क्या मुझे IDV अधिक या कम रखना चाहिए?", hinglish: "Kya mujhe IDV zyada ya kam rakhna chahiye?" }, a: { en: "Set IDV close to your car's actual market value. Too low IDV means insufficient claim payout in theft/total loss. Too high IDV means you're overpaying premium. IRDAI allows IDV to be set ±5% from the calculated value. Our recommendation: Set at 90-95% of market value for the best balance.", hi: "IDV अपनी कार के वास्तविक बाजार मूल्य के करीब रखें। बहुत कम IDV का अर्थ है अपर्याप्त क्लेम भुगतान। बहुत अधिक IDV का अर्थ है अधिक प्रीमियम। हमारी सिफारिश: बाजार मूल्य के 90-95% पर सेट करें।", hinglish: "IDV apni car ke actual market value ke kareeb rakhein. Bahut kam IDV matlab insufficient claim payout. Bahut zyada IDV matlab zyada premium. Recommendation: Market value ke 90-95% pe set karein." } },
  { q: { en: "Does IDV affect premium?", hi: "क्या IDV प्रीमियम को प्रभावित करता है?", hinglish: "Kya IDV premium ko affect karta hai?" }, a: { en: "Yes, IDV directly affects your comprehensive insurance premium. Higher IDV = higher premium, lower IDV = lower premium. The own-damage premium is calculated as a percentage of IDV. For every ₹1L increase in IDV, premium typically increases by ₹800-1,200 per year.", hi: "हाँ, IDV सीधे आपके कॉम्प्रिहेंसिव प्रीमियम को प्रभावित करता है। अधिक IDV = अधिक प्रीमियम। IDV में हर ₹1L वृद्धि पर प्रीमियम आमतौर पर ₹800-1,200/वर्ष बढ़ता है।", hinglish: "Haan, IDV directly aapke comprehensive premium ko affect karta hai. Higher IDV = higher premium. IDV mein har ₹1L badhne pe premium usually ₹800-1,200/year badhta hai." } },
  { q: { en: "Can I increase IDV of my car?", hi: "क्या मैं अपनी कार का IDV बढ़ा सकता हूँ?", hinglish: "Kya main apni car ka IDV bada sakta hoon?" }, a: { en: "Yes, IRDAI allows you to increase IDV by up to 5-10% above the calculated value. You can also request a higher IDV if you've recently added expensive accessories. However, significantly inflating IDV beyond market value is not allowed and won't result in higher claim payout.", hi: "हाँ, IRDAI आपको गणना किए गए मूल्य से 5-10% अधिक IDV बढ़ाने की अनुमति देता है। हालांकि, बाजार मूल्य से बहुत अधिक IDV अनुमत नहीं है।", hinglish: "Haan, IRDAI aapko calculated value se 5-10% zyada IDV badhane ki anumati deta hai. Lekin market value se bahut zyada IDV allowed nahi hai." } },
];

export default function IDVCalculationClientContent() {
  const { language } = useLanguage();
  const lang = language as Language;

  const [exShowroom, setExShowroom] = useState(1000000);
  const [carAge, setCarAge] = useState(2);
  const [accessories, setAccessories] = useState(0);

  const depPercentages: Record<number, number> = { 0: 5, 1: 15, 2: 20, 3: 30, 4: 40, 5: 50 };
  const depPct = depPercentages[carAge] || 50;
  const idv = Math.round((exShowroom * (100 - depPct)) / 100 + accessories);

  const faqSchema = generateFAQSchema(faqs.map(f => ({ q: pt(f.q, lang), a: pt(f.a, lang) })));
  const articleSchema = generateArticleSchema({
    title: "IDV Calculation — How Your Car's Value is Decided 2026",
    description: "Understand IDV calculation for car insurance — how it's calculated, depreciation rates, and how to set the right IDV.",
    slug: "idv-calculation",
    datePublished: "2025-02-05",
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
            <Car className="w-3.5 h-3.5 mr-1" />
            {lang === 'hi' ? 'मोटर इंश्योरेंस गाइड 2026' : 'Motor Insurance Guide 2026'}
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            <span className="gradient-text">IDV Calculation</span>{' '}
            <span className="text-[#7ED3E6]">{lang === 'hi' ? 'आपकी कार का मूल्य कैसे तय होता है' : "How Your Car's Value is Decided"}</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
            {lang === 'hi'
              ? 'IDV (इंश्योर्ड डिक्लेयर्ड वैल्यू) आपकी कार का अधिकतम बीमा मूल्य है। समझें कि यह कैसे गणना होता है, डेप्रिसिएशन दरें, और सही IDV कैसे सेट करें।'
              : 'IDV (Insured Declared Value) is the maximum insured value of your car. Understand how it\'s calculated, depreciation rates, and how to set the right IDV.'}
          </p>
        </div>
      </section>

      {/* What is IDV */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <Card className="rounded-2xl border-[#C98A1C]/20">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Info className="w-6 h-6 text-[#C98A1C]" />
              What is IDV?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {lang === 'hi'
                ? 'IDV = निर्माता का एक्स-शोरूम मूल्य - डेप्रिसिएशन + एक्सेसरीज़ का मूल्य। यह वह अधिकतम राशि है जो आपको चोरी या पूर्ण नुकसान की स्थिति में मिलेगी। उच्च IDV = अधिक प्रीमियम लेकिन बेहतर क्लेम भुगतान।'
                : 'IDV = Manufacturer\'s Ex-Showroom Price - Depreciation + Value of Accessories. This is the maximum amount you\'ll receive if your car is stolen or totally damaged. Higher IDV = higher premium but better claim payout.'}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* IDV Calculator */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
          <Calculator className="w-7 h-7 text-[#C98A1C]" />
          {lang === 'hi' ? 'IDV कैलकुलेटर' : 'IDV Calculator'}
        </h2>
        <Card className="rounded-2xl border-[#C98A1C]/20">
          <CardContent className="p-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    {lang === 'hi' ? 'एक्स-शोरूम मूल्य (₹)' : 'Ex-Showroom Price (₹)'}
                  </label>
                  <input
                    type="range"
                    min={200000}
                    max={5000000}
                    step={50000}
                    value={exShowroom}
                    onChange={(e) => setExShowroom(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground mt-1">₹{(exShowroom / 100000).toFixed(1)} Lakh</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    {lang === 'hi' ? 'कार की उम्र' : 'Car Age'}
                  </label>
                  <select
                    value={carAge}
                    onChange={(e) => setCarAge(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-border bg-background text-sm"
                  >
                    <option value={0}>{lang === 'hi' ? 'नई (0-6 महीने)' : 'New (0-6 months)'}</option>
                    <option value={1}>{lang === 'hi' ? '6 महीने - 1 साल' : '6 months - 1 year'}</option>
                    <option value={2}>{lang === 'hi' ? '1-2 साल' : '1-2 years'}</option>
                    <option value={3}>{lang === 'hi' ? '2-3 साल' : '2-3 years'}</option>
                    <option value={4}>{lang === 'hi' ? '3-4 साल' : '3-4 years'}</option>
                    <option value={5}>{lang === 'hi' ? '4-5 साल' : '4-5 years'}</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    {lang === 'hi' ? 'एक्सेसरीज़ मूल्य (₹)' : 'Accessories Value (₹)'}
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={200000}
                    step={5000}
                    value={accessories}
                    onChange={(e) => setAccessories(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground mt-1">₹{accessories.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Result */}
              <div className="space-y-4">
                <div className="p-6 bg-gradient-to-br from-[#C98A1C]/10 to-[#7ED3E6]/10 rounded-2xl text-center">
                  <p className="text-sm text-muted-foreground mb-2">{lang === 'hi' ? 'आपकी कार का IDV' : 'Your Car\'s IDV'}</p>
                  <p className="text-4xl font-extrabold text-[#C98A1C]">₹{(idv / 100000).toFixed(2)} L</p>
                  <p className="text-xs text-muted-foreground mt-2">₹{idv.toLocaleString('en-IN')}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground">{lang === 'hi' ? 'एक्स-शोरूम मूल्य' : 'Ex-Showroom Price'}</span>
                    <span className="font-semibold">₹{(exShowroom / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground">{lang === 'hi' ? 'डेप्रिसिएशन' : 'Depreciation'}</span>
                    <span className="font-semibold text-red-600">{depPct}% (₹{((exShowroom * depPct) / 100 / 100000).toFixed(1)}L)</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground">{lang === 'hi' ? 'एक्सेसरीज़' : 'Accessories'}</span>
                    <span className="font-semibold">₹{(accessories / 100000).toFixed(2)}L</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Depreciation Rates */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
          <TrendingDown className="w-7 h-7 text-red-500" />
          {lang === 'hi' ? 'IRDAI डेप्रिसिएशन दरें' : 'IRDAI Depreciation Rates'}
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-semibold">{lang === 'hi' ? 'कार की उम्र' : 'Car Age'}</th>
                <th className="text-left p-3 font-semibold">{lang === 'hi' ? 'डेप्रिसिएशन %' : 'Depreciation %'}</th>
                <th className="text-left p-3 font-semibold">{lang === 'hi' ? 'उदाहरण' : 'Example'}</th>
              </tr>
            </thead>
            <tbody>
              {depRates.map((row, i) => (
                <tr key={i} className="border-t border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{pt(row.age, lang)}</td>
                  <td className="p-3"><Badge variant="destructive" className="text-xs">{row.dep}</Badge></td>
                  <td className="p-3 text-muted-foreground">{row.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
          IDV <span className="gradient-text">FAQ</span>
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
          {(relatedArticlesMap['motor'] || []).map((link) => (
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
            {lang === 'hi' ? 'सही IDV सेट करने में मदद चाहिए?' : 'Need help setting the right IDV?'}
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            {lang === 'hi'
              ? 'WhatsApp पर हिमांशु पालीवाल से चैट करें — मुफ़्त सलाह।'
              : 'Chat with Himanshu Paliwal on WhatsApp — free advice on IDV and car insurance.'}
          </p>
          <a href={getWhatsAppCTA('Hi! I need help with IDV calculation for my car insurance.')}>
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
