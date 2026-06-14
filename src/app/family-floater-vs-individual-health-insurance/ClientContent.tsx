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
import { Users, User, ArrowRight, MessageCircle, Scale, CheckCircle2, XCircle, BookOpen } from 'lucide-react';

type TEntry = { en: string; hi: string; hinglish: string };
const pt = (obj: TEntry, lang: Language): string => obj[lang] || obj.en;

const comparisonRows = [
  { feature: { en: "Cover Type", hi: "कवर प्रकार", hinglish: "Cover Type" }, floater: { en: "One policy for entire family", hi: "पूरे परिवार के लिए एक पॉलिसी", hinglish: "One policy for entire family" }, individual: { en: "Separate policy per person", hi: "प्रति व्यक्ति अलग पॉलिसी", hinglish: "Separate policy per person" } },
  { feature: { en: "Sum Insured", hi: "बीमित राशि", hinglish: "Sum Insured" }, floater: { en: "Shared pool (e.g., ₹10L for 4 members)", hi: "साझा पूल (जैसे 4 सदस्यों के लिए ₹10L)", hinglish: "Shared pool (₹10L for 4 members)" }, individual: { en: "Dedicated per person (₹10L each)", hi: "प्रति व्यक्ति समर्पित (प्रत्येक ₹10L)", hinglish: "Dedicated per person (₹10L each)" } },
  { feature: { en: "Premium", hi: "प्रीमियम", hinglish: "Premium" }, floater: { en: "Lower (one premium for all)", hi: "कम (सभी के लिए एक प्रीमियम)", hinglish: "Lower (one premium for all)" }, individual: { en: "Higher (multiple premiums)", hi: "अधिक (कई प्रीमियम)", hinglish: "Higher (multiple premiums)" } },
  { feature: { en: "If One Claims", hi: "यदि एक क्लेम करे", hinglish: "If One Claims" }, floater: { en: "SI reduces for all members", hi: "सभी सदस्यों के लिए SI कम होता है", hinglish: "SI reduces for all members" }, individual: { en: "No impact on others", hi: "अन्य पर कोई प्रभाव नहीं", hinglish: "No impact on others" } },
  { feature: { en: "Best For", hi: "सर्वोत्तम", hinglish: "Best For" }, floater: { en: "Young families (under 45)", hi: "युवा परिवार (45 से कम)", hinglish: "Young families (under 45)" }, individual: { en: "Families with senior citizens", hi: "वरिष्ठ नागरिकों वाले परिवार", hinglish: "Families with senior citizens" } },
  { feature: { en: "Verdict", hi: "निर्णय", hinglish: "Verdict" }, floater: { en: "✅ Budget-friendly for young families", hi: "✅ युवा परिवारों के लिए बजट-अनुकूल", hinglish: "✅ Budget-friendly for young families" }, individual: { en: "✅ Better protection per person", hi: "✅ प्रति व्यक्ति बेहतर सुरक्षा", hinglish: "✅ Better protection per person" } },
];

const faqs = [
  { q: { en: "Is family floater better than individual?", hi: "क्या फैमिली फ्लोटर इंडिविजुअल से बेहतर है?", hinglish: "Kya family floater individual se better hai?" }, a: { en: "It depends. Family floater is more affordable and works well for young, healthy families. Individual plans are better if you have senior citizens, members with pre-existing conditions, or if you want dedicated coverage per person. Many experts recommend a combination: floater for young family + individual for seniors.", hi: "यह निर्भर करता है। फैमिली फ्लोटर अधिक किफ़ायती है। इंडिविजुअल प्लान तब बेहतर हैं जब वरिष्ठ नागरिक या पूर्व-मौजूदा स्थितियाँ हों। कई विशेषज्ञ संयोजन की सिफारिश करते हैं।", hinglish: "Depends karta hai. Family floater more affordable hai. Individual plans tab better hain jab senior citizens ya pre-existing conditions hon. Kai experts combination recommend karte hain." } },
  { q: { en: "What happens if two family members claim in the same year?", hi: "यदि एक ही वर्ष में दो परिवार के सदस्य क्लेम करें तो क्या होगा?", hinglish: "Agar same year mein do family members claim karein toh kya hoga?" }, a: { en: "In a family floater, both claims are paid from the same sum insured pool. For example, if you have ₹10L floater and one member uses ₹6L, only ₹4L remains for the rest of the family that year. This is the biggest risk of floater plans — multiple claims can exhaust the shared coverage.", hi: "फैमिली फ्लोटर में, दोनों क्लेम एक ही बीमित राशि पूल से चुकाए जाते हैं। उदाहरण के लिए, यदि आपके पास ₹10L फ्लोटर है और एक सदस्य ₹6L उपयोग करता है, तो बाकी परिवार के लिए केवल ₹4L बचता है।", hinglish: "Family floater mein, dono claims same sum insured pool se chukaye jate hain. Example, agar ₹10L floater hai aur ek member ₹6L use karta hai, toh baaki family ke liye sirf ₹4L bachta hai." } },
];

export default function FamilyFloaterVsIndividualClientContent() {
  const { language } = useLanguage();
  const lang = language as Language;

  const articleSchema = generateArticleSchema({
    title: "Family Floater vs Individual Health Insurance 2026",
    description: "Should you buy family floater or individual health insurance? Compare pros, cons, premiums, and claim scenarios.",
    slug: "family-floater-vs-individual-health-insurance",
    datePublished: "2025-02-15",
    dateModified: "2026-03-04",
  });
  const faqSchema = generateFAQSchema(faqs.map(f => ({ q: pt(f.q, lang), a: pt(f.a, lang) })));

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="relative py-12 sm:py-20 bg-gradient-to-b from-[#0A1330] to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <Badge className="mb-4 bg-[#C98A1C]/20 text-[#C98A1C] border-[#C98A1C]/30 rounded-full px-4 py-1">
            <BookOpen className="w-3.5 h-3.5 mr-1" />Health Insurance Guide 2026
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            <span className="gradient-text">Family Floater vs Individual</span>{' '}
            <span className="text-[#7ED3E6]">Health Insurance</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
            {lang === 'hi' ? 'क्या आपको फैमिली फ्लोटर खरीदना चाहिए या इंडिविजुअल? फायदे, नुकसान, प्रीमियम और क्लेम परिदृश्यों की तुलना करें।' : 'Should you buy family floater or individual? Compare pros, cons, premiums, and claim scenarios.'}
          </p>
        </div>
      </section>

      {/* Comparison Cards */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <Card className="rounded-2xl border-2 border-[#7ED3E6]/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-8 h-8 text-[#7ED3E6]" />
                <h2 className="text-xl font-bold text-foreground">Family Floater</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{lang === 'hi' ? 'एक पॉलिसी, साझा बीमित राशि पूल' : 'One policy, shared sum insured pool'}</p>
              <div className="space-y-2">
                {[lang === 'hi' ? '✅ कम प्रीमियम' : '✅ Lower premium', lang === 'hi' ? '✅ सभी सदस्य कवर' : '✅ All members covered', lang === 'hi' ? '⚠️ एक क्लेम सबकी SI कम करता है' : '⚠️ One claim reduces SI for all', lang === 'hi' ? '❌ वरिष्ठ नागरिकों के लिए जोखिम' : '❌ Risky for senior citizens'].map((item, i) => (
                  <p key={i} className="text-sm">{item}</p>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-2 border-[#C98A1C]/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-8 h-8 text-[#C98A1C]" />
                <h2 className="text-xl font-bold text-foreground">Individual</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{lang === 'hi' ? 'प्रति व्यक्ति अलग पॉलिसी, समर्पित SI' : 'Separate policy per person, dedicated SI'}</p>
              <div className="space-y-2">
                {[lang === 'hi' ? '✅ समर्पित कवरेज प्रति व्यक्ति' : '✅ Dedicated coverage per person', lang === 'hi' ? '✅ एक क्लेम दूसरे को प्रभावित नहीं करता' : '✅ One claim doesn\'t affect others', lang === 'hi' ? '⚠️ अधिक प्रीमियम' : '⚠️ Higher premium', lang === 'hi' ? '✅ वरिष्ठ नागरिकों के लिए सर्वोत्तम' : '✅ Best for senior citizens'].map((item, i) => (
                  <p key={i} className="text-sm">{item}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Comparison */}
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-semibold">Feature</th>
                <th className="text-left p-3 font-semibold text-[#7ED3E6]">Family Floater</th>
                <th className="text-left p-3 font-semibold text-[#C98A1C]">Individual</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr key={i} className="border-t border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{pt(row.feature, lang)}</td>
                  <td className="p-3 text-sm">{pt(row.floater, lang)}</td>
                  <td className="p-3 text-sm">{pt(row.individual, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">FAQ</h2>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-card rounded-2xl border border-border px-4">
              <AccordionTrigger className="text-left text-sm font-medium hover:no-underline py-4">{pt(faq.q, lang)}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">{pt(faq.a, lang)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="p-4 bg-muted/50 rounded-2xl border border-border/50">
          <div className="flex items-start gap-3"><Scale className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" /><p className="text-xs text-muted-foreground leading-relaxed">{irdaiDisclaimer[lang]}</p></div>
        </div>
      </section>
      <AuthorBio />

      <section className="py-16 bg-gradient-to-b from-[#0A1330] to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{lang === 'hi' ? 'सही प्लान चुनें' : 'Choose the Right Plan'}</h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">{lang === 'hi' ? 'WhatsApp पर मुफ़्त सलाह प्राप्त करें।' : 'Get free advice on WhatsApp — we\'ll help you decide.'}</p>
          <a href={getWhatsAppCTA('Hi! I need help choosing between family floater and individual health insurance.')}>
            <ShinyButton className="bg-[#25D366] hover:bg-[#20BD5A] text-white text-lg px-8 py-4"><MessageCircle className="w-5 h-5 mr-2" />Chat on WhatsApp</ShinyButton>
          </a>
        </div>
      </section>
    </div>
  );
}
