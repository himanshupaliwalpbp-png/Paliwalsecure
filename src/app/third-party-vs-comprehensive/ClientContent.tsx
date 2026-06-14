'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { Language } from '@/lib/i18n-strings';
import { ShinyButton } from '@/components/ui/shiny-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AuthorBio from '@/components/AuthorBio';
import { generateArticleSchema, irdaiDisclaimer, relatedArticlesMap, getWhatsAppCTA } from '@/lib/content-templates';
import { Shield, ShieldCheck, MessageCircle, Scale, Car, AlertTriangle, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react';

type TEntry = { en: string; hi: string; hinglish: string };
const pt = (obj: TEntry, lang: Language): string => obj[lang] || obj.en;

const comparisonRows = [
  { feature: { en: "Your Car Damage", hi: "आपकी कार का नुकसान", hinglish: "Your Car Damage" }, thirdParty: "❌ Not covered", comprehensive: "✅ Covered" },
  { feature: { en: "Third-Party Damage", hi: "तीसरे पक्ष का नुकसान", hinglish: "Third-Party Damage" }, thirdParty: "✅ Covered", comprehensive: "✅ Covered" },
  { feature: { en: "Theft", hi: "चोरी", hinglish: "Theft" }, thirdParty: "❌ Not covered", comprehensive: "✅ Covered (IDV amount)" },
  { feature: { en: "Natural Calamity", hi: "प्राकृतिक आपदा", hinglish: "Natural Calamity" }, thirdParty: "❌ Not covered", comprehensive: "✅ Covered" },
  { feature: { en: "Fire/Explosion", hi: "आग/विस्फोट", hinglish: "Fire/Explosion" }, thirdParty: "❌ Not covered", comprehensive: "✅ Covered" },
  { feature: { en: "Personal Accident", hi: "व्यक्तिगत दुर्घटना", hinglish: "Personal Accident" }, thirdParty: "✅ Mandatory cover", comprehensive: "✅ Included" },
  { feature: { en: "Legal Liability", hi: "कानूनी देयता", hinglish: "Legal Liability" }, thirdParty: "✅ Covered", comprehensive: "✅ Covered" },
  { feature: { en: "Add-ons (Zero Dep, NCB, etc.)", hi: "ऐड-ऑन (ज़ीरो डेप, NCB, आदि)", hinglish: "Add-ons" }, thirdParty: "❌ Not available", comprehensive: "✅ Available" },
  { feature: { en: "Cost (₹10L car)", hi: "लागत (₹10L कार)", hinglish: "Cost (₹10L car)" }, thirdParty: "₹3,000-6,000/year", comprehensive: "₹15,000-25,000/year" },
  { feature: { en: "Our Verdict", hi: "हमारा निर्णय", hinglish: "Our Verdict" }, thirdParty: "Only for old/cheap cars", comprehensive: "✅ Recommended for most cars" },
];

export default function ThirdPartyVsComprehensiveClientContent() {
  const { language } = useLanguage();
  const lang = language as Language;
  const articleSchema = generateArticleSchema({ title: "Third Party vs Comprehensive Insurance — Which is Better?", description: "Compare third party vs comprehensive car insurance.", slug: "third-party-vs-comprehensive", datePublished: "2025-03-15", dateModified: "2026-03-04" });

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <section className="relative py-12 sm:py-20 bg-gradient-to-b from-[#0A1330] to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <Badge className="mb-4 bg-[#C98A1C]/20 text-[#C98A1C] border-[#C98A1C]/30 rounded-full px-4 py-1"><Car className="w-3.5 h-3.5 mr-1" />Motor Insurance Guide 2026</Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            <span className="text-red-400">{lang === 'hi' ? 'थर्ड पार्टी' : 'Third Party'}</span>{' '}
            <span className="text-white">vs</span>{' '}
            <span className="text-[#7ED3E6]">{lang === 'hi' ? 'कॉम्प्रिहेंसिव' : 'Comprehensive'}</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
            {lang === 'hi' ? 'थर्ड पार्टी या कॉम्प्रिहेंसिव कार इंश्योरेंस? कवरेज, लागत, फायदे और नुकसान की तुलना करें।' : 'Third party or comprehensive car insurance? Compare coverage, cost, pros and cons.'}
          </p>
        </div>
      </section>

      {/* Side by Side Cards */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <Card className="rounded-2xl border-2 border-red-300 dark:border-red-800/40">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4"><Shield className="w-8 h-8 text-red-500" /><h2 className="text-xl font-bold text-foreground">{lang === 'hi' ? 'थर्ड पार्टी' : 'Third Party'}</h2></div>
              <div className="space-y-2 text-sm">
                <p>✅ {lang === 'hi' ? 'तीसरे पक्ष का नुकसान कवर' : 'Third-party damage covered'}</p>
                <p>✅ {lang === 'hi' ? 'कानूनी देयता कवर' : 'Legal liability covered'}</p>
                <p>✅ {lang === 'hi' ? 'व्यक्तिगत दुर्घटना कवर' : 'Personal accident cover'}</p>
                <p>❌ {lang === 'hi' ? 'अपनी कार का नुकसान नहीं' : 'Your car damage NOT covered'}</p>
                <p>❌ {lang === 'hi' ? 'चोरी कवर नहीं' : 'Theft NOT covered'}</p>
                <p>❌ {lang === 'hi' ? 'ऐड-ऑन उपलब्ध नहीं' : 'Add-ons NOT available'}</p>
              </div>
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/30 rounded-xl"><p className="text-xs text-red-700 dark:text-red-300">{lang === 'hi' ? 'केवल वहीं उपयुक्त जहाँ कार 5+ साल पुरानी हो या कम IDV हो' : 'Only suitable for 5+ year old cars or very low IDV'}</p></div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-2 border-[#7ED3E6]/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4"><ShieldCheck className="w-8 h-8 text-[#7ED3E6]" /><h2 className="text-xl font-bold text-foreground">{lang === 'hi' ? 'कॉम्प्रिहेंसिव' : 'Comprehensive'}</h2></div>
              <div className="space-y-2 text-sm">
                <p>✅ {lang === 'hi' ? 'अपनी कार का नुकसान कवर' : 'Your car damage covered'}</p>
                <p>✅ {lang === 'hi' ? 'तीसरे पक्ष का नुकसान कवर' : 'Third-party damage covered'}</p>
                <p>✅ {lang === 'hi' ? 'चोरी, आग, आपदा कवर' : 'Theft, fire, calamity covered'}</p>
                <p>✅ {lang === 'hi' ? 'ज़ीरो डेप, NCB ऐड-ऑन उपलब्ध' : 'Zero dep, NCB add-ons available'}</p>
                <p>⚠️ {lang === 'hi' ? 'थर्ड पार्टी से अधिक प्रीमियम' : 'Higher premium than third party'}</p>
              </div>
              <div className="mt-4 p-3 bg-[#7ED3E6]/10 rounded-xl"><p className="text-xs text-[#7ED3E6]">{lang === 'hi' ? 'अधिकांश कारों के लिए अनुशंसित' : 'Recommended for most cars'}</p></div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Table */}
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-semibold">Feature</th>
                <th className="text-left p-3 font-semibold text-red-600">Third Party</th>
                <th className="text-left p-3 font-semibold text-[#7ED3E6]">Comprehensive</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr key={i} className="border-t border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{pt(row.feature, lang)}</td>
                  <td className="p-3 text-sm">{row.thirdParty}</td>
                  <td className="p-3 text-sm">{row.comprehensive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6"><div className="p-4 bg-muted/50 rounded-2xl border border-border/50"><div className="flex items-start gap-3"><Scale className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" /><p className="text-xs text-muted-foreground leading-relaxed">{irdaiDisclaimer[lang]}</p></div></div></section>
      <AuthorBio />

      <section className="py-16 bg-gradient-to-b from-[#0A1330] to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{lang === 'hi' ? 'सही इंश्योरेंस चुनें' : 'Choose the Right Insurance'}</h2>
          <a href={getWhatsAppCTA('Hi! I need help choosing between third party and comprehensive car insurance.')}>
            <ShinyButton className="bg-[#25D366] hover:bg-[#20BD5A] text-white text-lg px-8 py-4"><MessageCircle className="w-5 h-5 mr-2" />Chat on WhatsApp</ShinyButton>
          </a>
        </div>
      </section>
    </div>
  );
}
