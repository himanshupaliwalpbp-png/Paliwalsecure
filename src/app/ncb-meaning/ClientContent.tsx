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
import { Shield, MessageCircle, Scale, BookOpen, TrendingUp, ArrowRight } from 'lucide-react';

type TEntry = { en: string; hi: string; hinglish: string };
const pt = (obj: TEntry, lang: Language): string => obj[lang] || obj.en;

const ncbRates = [
  { year: 1, discount: '0%', desc: { en: "First year — no discount", hi: "पहला साल — कोई छूट नहीं", hinglish: "First year — no discount" } },
  { year: 2, discount: '20%', desc: { en: "1 claim-free year", hi: "1 क्लेम-मुक्त वर्ष", hinglish: "1 claim-free year" } },
  { year: 3, discount: '25%', desc: { en: "2 consecutive claim-free years", hi: "2 लगातार क्लेम-मुक्त वर्ष", hinglish: "2 consecutive claim-free years" } },
  { year: 4, discount: '35%', desc: { en: "3 consecutive claim-free years", hi: "3 लगातार क्लेम-मुक्त वर्ष", hinglish: "3 consecutive claim-free years" } },
  { year: 5, discount: '45%', desc: { en: "4 consecutive claim-free years", hi: "4 लगातार क्लेम-मुक्त वर्ष", hinglish: "4 consecutive claim-free years" } },
  { year: 6, discount: '50%', desc: { en: "5+ consecutive claim-free years (maximum)", hi: "5+ लगातार क्लेम-मुक्त वर्ष (अधिकतम)", hinglish: "5+ consecutive claim-free years (maximum)" } },
];

const faqs = [
  { q: { en: "What is NCB in insurance?", hi: "इंश्योरेंस में NCB क्या है?", hinglish: "Insurance mein NCB kya hai?" }, a: { en: "NCB (No Claim Bonus) is a discount on your insurance premium given for not making any claims during the policy year. It starts at 20% after 1 claim-free year and goes up to 50% after 5+ consecutive claim-free years. NCB applies only to the own-damage portion of your premium, not third-party premium.", hi: "NCB (नो क्लेम बोनस) आपके इंश्योरेंस प्रीमियम पर छूट है जो पॉलिसी वर्ष में कोई क्लेम न करने पर दी जाती है। यह 1 क्लेम-मुक्त वर्ष के बाद 20% से शुरू होकर 5+ वर्षों के बाद 50% तक जाती है।", hinglish: "NCB (No Claim Bonus) ek discount hai insurance premium pe jo policy year mein koi claim na karne pe di jaati hai. Ye 1 claim-free year ke baad 20% se shuru hokar 5+ years ke baad 50% tak jaati hai." } },
  { q: { en: "Do I lose NCB if I make a small claim?", hi: "क्या मैं छोटा क्लेम करने पर NCB खो देता हूँ?", hinglish: "Kya main chhota claim karne pe NCB kho deta hoon?" }, a: { en: "Yes, even a ₹1 claim will reset your NCB to 0%. This is why it's often better to pay small repairs (under ₹5,000-10,000) from your own pocket and preserve the NCB, which can save you ₹10,000-25,000 on renewal premium over the years.", hi: "हाँ, ₹1 का क्लेम भी आपका NCB 0% कर देगा। इसीलिए अक्सर छोटी मरम्मत (₹5,000-10,000 से कम) अपनी जेब से चुकाना बेहतर है और NCB बचाना बेहतर है।", hinglish: "Haan, ₹1 claim bhi aapka NCB 0% kar dega. Isliye often chhoti repairs (under ₹5,000-10,000) apni jeb se chukana better hai aur NCB bachana better hai." } },
  { q: { en: "Can I transfer NCB to a new car?", hi: "क्या मैं NCB नई कार में ट्रांसफर कर सकता हूँ?", hinglish: "Kya main NCB nayi car mein transfer kar sakta hoon?" }, a: { en: "Yes! NCB belongs to the policyholder, not the car. You can transfer your NCB to a new car when you sell the old one. Get an NCB retention letter from your current insurer and submit it to the new insurer. This can save you up to 50% on your new car's premium.", hi: "हाँ! NCB पॉलिसीधारक का है, कार का नहीं। आप पुरानी कार बेचने पर NCB नई कार में ट्रांसफर कर सकते हैं। वर्तमान बीमाकर्ता से NCB रिटेंशन लेटर प्राप्त करें।", hinglish: "Haan! NCB policyholder ka hai, car ka nahi. Aap purani car bechne pe NCB nayi car mein transfer kar sakte hain." } },
  { q: { en: "Should I claim or preserve NCB?", hi: "क्या मैं क्लेम करूँ या NCB बचाऊँ?", hinglish: "Kya main claim karoon ya NCB bachaoon?" }, a: { en: "Do the math: If repair cost < NCB savings on renewal, don't claim. Example: ₹8,000 repair vs 20% NCB on ₹15,000 premium = ₹3,000 saving. Claim it. But if you have 50% NCB (₹7,500 saving on ₹15,000 premium), paying ₹8,000 from pocket to preserve NCB saves you ₹7,500+ every year for as long as you don't claim.", hi: "गणना करें: यदि मरम्मत लागत < नवीनीकरण पर NCB बचत, तो क्लेम न करें। उदाहरण: ₹8,000 मरम्मत बनाम 50% NCB ₹15,000 प्रीमियम पर = ₹7,500 बचत। जेब से चुकाना बेहतर।", hinglish: "Math karo: Agar repair cost < NCB savings on renewal, toh claim mat karo." } },
];

export default function NCBMeaningClientContent() {
  const { language } = useLanguage();
  const lang = language as Language;
  const articleSchema = generateArticleSchema({ title: "NCB Meaning — No Claim Bonus Explained 2026", description: "What is NCB in insurance? How it works, rates, and how to protect it.", slug: "ncb-meaning", datePublished: "2025-03-01", dateModified: "2026-03-04" });
  const faqSchema = generateFAQSchema(faqs.map(f => ({ q: pt(f.q, lang), a: pt(f.a, lang) })));

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="relative py-12 sm:py-20 bg-gradient-to-b from-[#0A1330] to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <Badge className="mb-4 bg-[#C98A1C]/20 text-[#C98A1C] border-[#C98A1C]/30 rounded-full px-4 py-1"><Shield className="w-3.5 h-3.5 mr-1" />Motor Insurance Guide 2026</Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            <span className="gradient-text">NCB Meaning</span>{' '}
            <span className="text-[#7ED3E6]">{lang === 'hi' ? 'नो क्लेम बोनस समझिए' : 'No Claim Bonus Explained'}</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
            {lang === 'hi' ? 'NCB आपके प्रीमियम पर 50% तक की छूट है। समझें कि यह कैसे काम करता है, दरें, और इसे कैसे बचाएँ।' : 'NCB is up to 50% discount on your premium. Understand how it works, rates, and how to protect it.'}
          </p>
        </div>
      </section>

      {/* NCB Rates */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 flex items-center gap-3"><TrendingUp className="w-7 h-7 text-[#C98A1C]" />{lang === 'hi' ? 'NCB दरें — IRDAI' : 'NCB Rates — IRDAI'}</h2>
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-semibold">{lang === 'hi' ? 'क्लेम-मुक्त वर्ष' : 'Claim-Free Year'}</th>
                <th className="text-left p-3 font-semibold">{lang === 'hi' ? 'NCB छूट' : 'NCB Discount'}</th>
                <th className="text-left p-3 font-semibold">{lang === 'hi' ? 'विवरण' : 'Description'}</th>
              </tr>
            </thead>
            <tbody>
              {ncbRates.map((row) => (
                <tr key={row.year} className="border-t border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">Year {row.year}</td>
                  <td className="p-3"><Badge variant={parseInt(row.discount) >= 45 ? 'default' : 'secondary'} className="text-xs">{row.discount}</Badge></td>
                  <td className="p-3 text-muted-foreground">{pt(row.desc, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{lang === 'hi' ? 'NCB बचाने में मदद चाहिए?' : 'Need help protecting your NCB?'}</h2>
          <a href={getWhatsAppCTA('Hi! I need help with NCB and car insurance renewal.')}>
            <ShinyButton className="bg-[#25D366] hover:bg-[#20BD5A] text-white text-lg px-8 py-4"><MessageCircle className="w-5 h-5 mr-2" />Chat on WhatsApp</ShinyButton>
          </a>
        </div>
      </section>
    </div>
  );
}
