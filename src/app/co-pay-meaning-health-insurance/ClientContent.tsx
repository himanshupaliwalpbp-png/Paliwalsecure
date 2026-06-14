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
import { BookOpen, ArrowRight, MessageCircle, Scale, ChevronRight, Percent, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

type TEntry = { en: string; hi: string; hinglish: string };
const pt = (obj: TEntry, lang: Language): string => obj[lang] || obj.en;

const pageText = {
  hero: {
    badge: { en: "Health Insurance Guide 2026", hi: "हेल्थ इंश्योरेंस गाइड 2026", hinglish: "Health Insurance Guide 2026" },
    title1: { en: "Co-Pay Meaning in", hi: "हेल्थ इंश्योरेंस में को-पे का", hinglish: "Co-Pay Meaning in" },
    title2: { en: "Health Insurance", hi: "अर्थ", hinglish: "Health Insurance" },
    subtitle: { en: "Complete Guide", hi: "पूरी गाइड", hinglish: "Complete Guide" },
    desc: {
      en: "Co-pay (co-payment) means you share a fixed percentage of every medical bill with the insurer. While it lowers your premium, it can significantly increase your out-of-pocket expenses during claims. Understand how co-pay works, when it applies, and how to choose the right plan.",
      hi: "को-पे (को-पेमेंट) का अर्थ है कि आप हर मेडिकल बिल का एक निश्चित प्रतिशत बीमाकर्ता के साथ साझा करते हैं। जबकि यह आपका प्रीमियम कम करता है, यह क्लेम के दौरान आपके खर्चे काफी बढ़ा सकता है।",
      hinglish: "Co-pay (co-payment) matlab aap har medical bill ka ek fixed percentage insurer ke saath share karte hain. Jabki ye aapka premium kam karta hai, ye claim ke dauran aapke expenses kaafi badha sakta hai."
    },
  },
  definition: {
    heading: { en: "What is Co-Pay in Health Insurance?", hi: "हेल्थ इंश्योरेंस में को-पे क्या है?", hinglish: "Health Insurance mein Co-Pay kya hai?" },
    content: {
      en: "Co-pay is a clause in health insurance where the policyholder agrees to pay a fixed percentage of the medical expenses out of pocket, while the insurer pays the rest. For example, with a 20% co-pay on a ₹1,00,000 bill, you pay ₹20,000 and the insurer pays ₹80,000. It is different from deductible — co-pay is a percentage, while deductible is a fixed amount.",
      hi: "को-पे हेल्थ इंश्योरेंस में एक शर्त है जिसमें पॉलिसीधारक चिकित्सा खर्चों का एक निश्चित प्रतिशत अपनी जेब से चुकाने के लिए सहमत होता है, जबकि बीमाकर्ता बाकी चुकाता है। उदाहरण के लिए, ₹1,00,000 के बिल पर 20% को-पे के साथ, आप ₹20,000 चुकाते हैं और बीमाकर्ता ₹80,000 चुकाता है।",
      hinglish: "Co-pay ek clause hai health insurance mein jahan policyholder medical expenses ka ek fixed percentage apni jeb se chukane ke liye sehmat hota hai, jabki insurer baaki chukata hai. Example ke liye, ₹1,00,000 ke bill pe 20% co-pay ke saath, aap ₹20,000 chukate hain aur insurer ₹80,000 chukata hai."
    },
  },
  copayTypes: {
    heading: { en: "Common Co-Pay Structures", hi: "सामान्य को-पे संरचनाएँ", hinglish: "Common Co-Pay Structures" },
  },
  comparison: {
    heading1: { en: "Co-Pay", hi: "को-पे", hinglish: "Co-Pay" },
    heading2: { en: "Comparison Table", hi: "तुलना तालिका", hinglish: "Comparison Table" },
  },
  faq: {
    heading: { en: "Co-Pay", hi: "को-पे", hinglish: "Co-Pay" },
    headingHighlight: { en: "FAQ", hi: "सवाल-जवाब", hinglish: "FAQ" },
  },
  cta: {
    heading1: { en: "Not sure about co-pay?", hi: "को-पे को लेकर confused?", hinglish: "Co-pay ke baare mein confused?" },
    heading2: { en: "Get expert advice", hi: "विशेषज्ञ सलाह लें", hinglish: "Expert advice lo" },
    desc: {
      en: "Chat with Himanshu Paliwal on WhatsApp — get personalized advice on choosing the right health plan with the best co-pay structure for your needs. Free, no-obligation consultation.",
      hi: "WhatsApp पर हिमांशु पालीवाल से चैट करें — अपनी ज़रूरतों के लिए सही को-पे संरचना वाली हेल्थ प्लान चुनने में व्यक्तिगत सलाह प्राप्त करें।",
      hinglish: "WhatsApp pe Himanshu Paliwal se chat karein — apni needs ke liye sahi co-pay structure wali health plan chunne mein personalized advice paayein."
    },
    ctaWhatsApp: { en: "Chat on WhatsApp", hi: "WhatsApp पर चैट करें", hinglish: "WhatsApp pe Chat Karein" },
  },
  related: { heading: { en: "Related Articles", hi: "संबंधित लेख", hinglish: "Related Articles" } },
};

const copayStructures = [
  { type: { en: "No Co-Pay", hi: "कोई को-पे नहीं", hinglish: "No Co-Pay" }, pct: "0%", desc: { en: "Best option — insurer pays 100% of covered expenses. Premium is higher but zero out-of-pocket at claim time.", hi: "सबसे अच्छा विकल्प — बीमाकर्ता कवर किए गए खर्चों का 100% चुकाता है। प्रीमियम अधिक है लेकिन क्लेम के समय शून्य खर्चा।", hinglish: "Best option — insurer pays 100% of covered expenses. Premium higher but zero out-of-pocket at claim time." }, verdict: "✅ Best" },
  { type: { en: "10% Co-Pay", hi: "10% को-पे", hinglish: "10% Co-Pay" }, pct: "10%", desc: { en: "You pay 10% of every bill. Common in senior citizen plans. On a ₹5L bill, you pay ₹50,000.", hi: "आप हर बिल का 10% चुकाते हैं। वरिष्ठ नागरिक योजनाओं में आम। ₹5L के बिल पर, आप ₹50,000 चुकाते हैं।", hinglish: "Aap har bill ka 10% chukate hain. Senior citizen plans mein common. ₹5L ke bill pe, aap ₹50,000 chukate hain." }, verdict: "⚠️ Moderate" },
  { type: { en: "20% Co-Pay", hi: "20% को-पे", hinglish: "20% Co-Pay" }, pct: "20%", desc: { en: "You pay 20% of every bill. Often found in cheaper plans. On a ₹5L bill, you pay ₹1,00,000 — very expensive!", hi: "आप हर बिल का 20% चुकाते हैं। सस्ती प्लान में अक्सर मिलता है। ₹5L के बिल पर, आप ₹1,00,000 चुकाते हैं — बहुत महंगा!", hinglish: "Aap har bill ka 20% chukate hain. Sasti plans mein often milta hai. ₹5L ke bill pe, aap ₹1,00,000 chukate hain — bahut mehnaga!" }, verdict: "❌ Avoid" },
  { type: { en: "Zone-based Co-Pay", hi: "ज़ोन-आधारित को-पे", hinglish: "Zone-based Co-Pay" }, pct: "10-20%", desc: { en: "Co-pay applies if you get treated in a non-network hospital or a different zone/city. Common in tier-2/3 city policies.", hi: "यदि आप गैर-नेटवर्क अस्पताल या अलग शहर में इलाज कराते हैं तो को-पे लागू होता है।", hinglish: "Co-pay apply hota hai agar aap non-network hospital ya alag city mein treatment karate hain." }, verdict: "⚠️ Check" },
];

const copayComparison = [
  { insurer: 'Acko General Insurance', copay: 'No co-pay', premiumImpact: 'Standard', verdict: '✅ Best' },
  { insurer: 'Care Health Insurance', copay: 'No co-pay (most plans)', premiumImpact: 'Standard', verdict: '✅ Best' },
  { insurer: 'HDFC ERGO General Insurance', copay: 'No co-pay', premiumImpact: 'Standard', verdict: '✅ Best' },
  { insurer: 'Star Health & Allied Insurance', copay: '10-20% (senior plans)', premiumImpact: 'Lower premium', verdict: '⚠️ Check' },
  { insurer: 'Niva Bupa Health Insurance', copay: '10% on select plans', premiumImpact: 'Slightly lower', verdict: '⚠️ Check' },
  { insurer: 'ICICI Lombard General Insurance', copay: 'No co-pay (most plans)', premiumImpact: 'Standard', verdict: '✅ Best' },
];

const faqs = [
  { q: { en: "What is co-pay in health insurance?", hi: "हेल्थ इंश्योरेंस में को-पे क्या है?", hinglish: "Health insurance mein co-pay kya hai?" }, a: { en: "Co-pay (co-payment) is a fixed percentage of the medical bill that you must pay out of pocket, while the insurer pays the remaining percentage. For example, with a 20% co-pay on a ₹1,00,000 bill, you pay ₹20,000 and the insurer pays ₹80,000.", hi: "को-पे (को-पेमेंट) मेडिकल बिल का एक निश्चित प्रतिशत है जो आपको अपनी जेब से चुकाना होता है, जबकि बीमाकर्ता शेष प्रतिशत चुकाता है।", hinglish: "Co-pay (co-payment) medical bill ka ek fixed percentage hai jo aapko apni jeb se chukana hota hai, jabki insurer remaining percentage chukata hai." } },
  { q: { en: "Is co-pay good or bad?", hi: "को-पे अच्छा है या बुरा?", hinglish: "Co-pay achha hai ya bura?" }, a: { en: "Co-pay lowers your premium but increases your out-of-pocket expenses during claims. For young, healthy individuals, a small co-pay (5-10%) might save on premiums. For families and senior citizens, no co-pay is strongly recommended to avoid large bills during hospitalization.", hi: "को-पे आपका प्रीमियम कम करता है लेकिन क्लेम के दौरान आपके खर्चे बढ़ाता है। युवा, स्वस्थ व्यक्तियों के लिए, छोटा को-पे (5-10%) प्रीमियम में बचत कर सकता है। परिवारों और वरिष्ठ नागरिकों के लिए, कोई को-पे नहीं वाली प्लान अनुशंसित है।", hinglish: "Co-pay aapka premium kam karta hai lekin claim ke dauran aapke expenses badhata hai. Young, healthy individuals ke liye, chhota co-pay (5-10%) premium mein bachat kar sakta hai. Families aur senior citizens ke liye, no co-pay strongly recommended hai." } },
  { q: { en: "What is the difference between co-pay and deductible?", hi: "को-पे और डिडक्टिबल में क्या अंतर है?", hinglish: "Co-pay aur deductible mein kya antar hai?" }, a: { en: "Co-pay is a percentage of the bill you pay every time (e.g., 20% of ₹1L = ₹20,000). Deductible is a fixed amount you pay once before the insurer starts paying (e.g., first ₹5,000 per claim). Co-pay applies to every bill; deductible applies only once per claim or policy year.", hi: "को-पे बिल का एक प्रतिशत है जो आप हर बार चुकाते हैं। डिडक्टिबल एक निश्चित राशि है जो आप बीमाकर्ता के भुगतान शुरू करने से पहले एक बार चुकाते हैं।", hinglish: "Co-pay bill ka ek percentage hai jo aap har baar chukate hain. Deductible ek fixed amount hai jo aap insurer ke payment shuru karne se pehle ek baar chukate hain." } },
  { q: { en: "Can I remove co-pay from my health insurance?", hi: "क्या मैं अपने हेल्थ इंश्योरेंस से को-पे हटा सकता हूँ?", hinglish: "Kya main apne health insurance se co-pay hata sakta hoon?" }, a: { en: "Yes, at the time of policy renewal, you can switch to a plan variant without co-pay. This will increase your premium by 10-25%, but it ensures you pay nothing out of pocket during claims. This is strongly recommended for senior citizens and families.", hi: "हाँ, पॉलिसी नवीनीकरण के समय, आप को-पे के बिना प्लान वेरिएंट में स्विच कर सकते हैं। इससे आपका प्रीमियम 10-25% बढ़ेगा, लेकिन यह सुनिश्चित करता है कि क्लेम के दौरान आपको कुछ भी अपनी जेब से नहीं देना पड़े।", hinglish: "Haan, policy renewal ke time, aap co-pay ke bina plan variant mein switch kar sakte hain. Ye aapka premium 10-25% badhayega, lekin ye ensure karta hai ki claim ke dauran aapko kuch bhi apni jeb se nahi dena pade." } },
  { q: { en: "Does Star Health have co-pay?", hi: "क्या Star Health में को-पे है?", hinglish: "Kya Star Health mein co-pay hai?" }, a: { en: "Star Health's senior citizen plans (like Star Health Red Carpet) have a co-pay of 10-20%. Their regular plans may not have co-pay. Always check the policy wordings carefully before purchasing, as co-pay terms vary significantly between plans.", hi: "Star Health की वरिष्ठ नागरिक योजनाओं (जैसे Star Health Red Carpet) में 10-20% का को-पे है। उनकी नियमित प्लान में को-पे नहीं हो सकता।", hinglish: "Star Health ke senior citizen plans (jaise Star Health Red Carpet) mein 10-20% ka co-pay hai. Unki regular plans mein co-pay nahi ho sakta." } },
];

export default function CoPayClientContent() {
  const { language } = useLanguage();
  const lang = language as Language;

  const faqSchema = generateFAQSchema(faqs.map(f => ({ q: pt(f.q, lang), a: pt(f.a, lang) })));
  const articleSchema = generateArticleSchema({
    title: "Co-Pay Meaning in Health Insurance — Complete Guide 2026",
    description: "What is co-pay in health insurance? Understand how co-payment works, its impact on premiums and claims.",
    slug: "co-pay-meaning-health-insurance",
    datePublished: "2025-01-20",
    dateModified: "2026-03-04",
  });

  const relatedLinks = relatedArticlesMap['health'] || [];

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="relative py-12 sm:py-20 bg-gradient-to-b from-[#0A1330] to-background overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <Badge className="mb-4 bg-[#C98A1C]/20 text-[#C98A1C] border-[#C98A1C]/30 rounded-full px-4 py-1">
            <BookOpen className="w-3.5 h-3.5 mr-1" />
            {pt(pageText.hero.badge, lang)}
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {pt(pageText.hero.title1, lang)}{' '}
            <span className="gradient-text">{pt(pageText.hero.title2, lang)}</span>{' '}
            <span className="text-[#7ED3E6]">{pt(pageText.hero.subtitle, lang)}</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
            {pt(pageText.hero.desc, lang)}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href={getWhatsAppCTA('Hi! I need help understanding co-pay in health insurance.')}>
              <ShinyButton className="bg-[#25D366] hover:bg-[#20BD5A] text-white">
                <MessageCircle className="w-4 h-4 mr-2" />
                {pt(pageText.cta.ctaWhatsApp, lang)}
              </ShinyButton>
            </a>
          </div>
        </div>
      </section>

      {/* Definition */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <Card className="rounded-2xl border-[#C98A1C]/20">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Info className="w-6 h-6 text-[#C98A1C]" />
              {pt(pageText.definition.heading, lang)}
            </h2>
            <p className="text-muted-foreground leading-relaxed">{pt(pageText.definition.content, lang)}</p>
            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/40">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Co-pay Example:</strong> {lang === 'hi' ? '₹5,00,000 बिल पर 20% को-पे = आप ₹1,00,000 चुकाते हैं, बीमाकर्ता ₹4,00,000' : lang === 'hinglish' ? '₹5,00,000 bill pe 20% co-pay = aap ₹1,00,000 chukate hain, insurer ₹4,00,000' : '₹5,00,000 bill with 20% co-pay = You pay ₹1,00,000, Insurer pays ₹4,00,000'}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Co-Pay Structures */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
          {pt(pageText.copayTypes.heading, lang)}
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {copayStructures.map((s, i) => (
            <Card key={i} className="rounded-2xl">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-foreground">{pt(s.type, lang)}</h3>
                  <Badge className="text-xs">{s.pct}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{pt(s.desc, lang)}</p>
                <p className="text-sm font-medium">{s.verdict}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
          {pt(pageText.comparison.heading1, lang)}{' '}
          <span className="gradient-text">{pt(pageText.comparison.heading2, lang)}</span>
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-semibold">Insurer</th>
                <th className="text-left p-3 font-semibold">Co-Pay</th>
                <th className="text-left p-3 font-semibold">Premium Impact</th>
                <th className="text-left p-3 font-semibold">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {copayComparison.map((row, i) => (
                <tr key={i} className="border-t border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{row.insurer}</td>
                  <td className="p-3">{row.copay}</td>
                  <td className="p-3">{row.premiumImpact}</td>
                  <td className="p-3 text-sm">{row.verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Paliwal Ratings */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
          Paliwal Secure Rating™ — <span className="gradient-text">No Co-Pay Leaders</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {healthInsurancePlans.filter(p => !p.roomRentLimit?.includes('1%')).slice(0, 4).map((plan) => (
            <PaliwalSecureRating
              key={plan.id}
              insurerName={plan.provider}
              metrics={{
                claimSettlementRatio: plan.claimSettlementRatio,
                incurredClaimRatio: plan.incurredClaimRatio,
                networkHospitals: plan.networkHospitals,
                solvencyRatio: plan.solvencyRatio,
                complaintsPer10k: plan.complaintsPer10k,
                claimTurnaroundDays: plan.claimTurnaroundDays,
              }}
              compact
            />
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
          {pt(pageText.faq.heading, lang)}{' '}
          <span className="gradient-text">{pt(pageText.faq.headingHighlight, lang)}</span>
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
        <h2 className="text-2xl font-bold text-foreground mb-6">{pt(pageText.related.heading, lang)}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedLinks.map((link) => (
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
            {pt(pageText.cta.heading1, lang)}{' '}
            <span className="text-[#7ED3E6]">{pt(pageText.cta.heading2, lang)}</span>
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">{pt(pageText.cta.desc, lang)}</p>
          <a href={getWhatsAppCTA('Hi! I need help with co-pay in health insurance.')}>
            <ShinyButton className="bg-[#25D366] hover:bg-[#20BD5A] text-white text-lg px-8 py-4">
              <MessageCircle className="w-5 h-5 mr-2" />
              {pt(pageText.cta.ctaWhatsApp, lang)}
            </ShinyButton>
          </a>
        </div>
      </section>
    </div>
  );
}
