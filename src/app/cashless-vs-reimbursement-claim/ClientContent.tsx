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
import { BookOpen, ArrowRight, MessageCircle, Scale, CheckCircle2, XCircle, Clock, Wallet, ShieldCheck, FileText, Phone } from 'lucide-react';

type TEntry = { en: string; hi: string; hinglish: string };
const pt = (obj: TEntry, lang: Language): string => obj[lang] || obj.en;

const pageText = {
  hero: {
    badge: { en: "Claim Guide 2026", hi: "क्लेम गाइड 2026", hinglish: "Claim Guide 2026" },
    title: { en: "Cashless vs Reimbursement Claim", hi: "कैशलेस बनाम रिम्बर्समेंट क्लेम", hinglish: "Cashless vs Reimbursement Claim" },
    subtitle: { en: "Which is Better?", hi: "कौन सा बेहतर?", hinglish: "Kaun Sa Better?" },
    desc: {
      en: "When you need to use your health insurance, you can either go cashless (insurer pays hospital directly) or reimbursement (you pay first, insurer reimburses later). Understanding the difference can save you from major financial stress during a medical emergency.",
      hi: "जब आपको अपना हेल्थ इंश्योरेंस इस्तेमाल करना हो, तो आप या तो कैशलेस (बीमाकर्ता सीधे अस्पताल को भुगतान करता है) या रिम्बर्समेंट (आप पहले भुगतान करते हैं, बीमाकर्ता बाद में वापस करता है) जा सकते हैं।",
      hinglish: "Jab aapko apna health insurance istemal karna ho, toh aap ya toh cashless (insurer seedha hospital ko payment karta hai) ya reimbursement (aap pehle payment karte hain, insurer baad mein wapas karta hai) ja sakte hain."
    },
  },
  cashless: {
    heading: { en: "Cashless Claim Process", hi: "कैशलेस क्लेम प्रक्रिया", hinglish: "Cashless Claim Process" },
  },
  reimbursement: {
    heading: { en: "Reimbursement Claim Process", hi: "रिम्बर्समेंट क्लेम प्रक्रिया", hinglish: "Reimbursement Claim Process" },
  },
  comparison: {
    heading: { en: "Cashless vs Reimbursement — Side by Side", hi: "कैशलेस बनाम रिम्बर्समेंट — साथ-साथ", hinglish: "Cashless vs Reimbursement — Side by Side" },
  },
  faq: {
    heading: { en: "Cashless vs Reimbursement", hi: "कैशलेस बनाम रिम्बर्समेंट", hinglish: "Cashless vs Reimbursement" },
    highlight: { en: "FAQ", hi: "सवाल-जवाब", hinglish: "FAQ" },
  },
  cta: {
    heading: { en: "Need help filing a claim?", hi: "क्लेम करने में मदद चाहिए?", hinglish: "Claim karne mein madad chahiye?" },
    desc: {
      en: "Chat with Himanshu Paliwal on WhatsApp — get step-by-step guidance on filing your health insurance claim, whether cashless or reimbursement. Free consultation.",
      hi: "WhatsApp पर हिमांशु पालीवाल से चैट करें — कैशलेस या रिम्बर्समेंट, अपना हेल्थ इंश्योरेंस क्लेम करने में चरण-दर-चरण मार्गदर्शन प्राप्त करें।",
      hinglish: "WhatsApp pe Himanshu Paliwal se chat karein — cashless ya reimbursement, apna health insurance claim karne mein step-by-step guidance paayein."
    },
    ctaWhatsApp: { en: "Chat on WhatsApp", hi: "WhatsApp पर चैट करें", hinglish: "WhatsApp pe Chat Karein" },
  },
  related: { heading: { en: "Related Articles", hi: "संबंधित लेख", hinglish: "Related Articles" } },
};

const cashlessSteps = [
  { step: 1, title: { en: "Visit Network Hospital", hi: "नेटवर्क अस्पताल में जाएँ", hinglish: "Network Hospital mein jaayein" }, desc: { en: "Go to a hospital in your insurer's network. You can find network hospitals on the insurer's website or app.", hi: "अपने बीमाकर्ता के नेटवर्क में अस्पताल में जाएँ।", hinglish: "Apne insurer ke network mein hospital mein jaayein." } },
  { step: 2, title: { en: "Show Health Card", hi: "हेल्थ कार्ड दिखाएँ", hinglish: "Health Card dikhayein" }, desc: { en: "Show your health insurance card or policy number at the insurance desk. They will verify your coverage.", hi: "इंश्योरेंस डेस्क पर अपना हेल्थ इंश्योरेंस कार्ड या पॉलिसी नंबर दिखाएँ।", hinglish: "Insurance desk pe apna health insurance card ya policy number dikhayein." } },
  { step: 3, title: { en: "Get Pre-Authorization", hi: "प्री-ऑथराइज़ेशन प्राप्त करें", hinglish: "Pre-authorization paayein" }, desc: { en: "The hospital sends a pre-authorization request to the insurer. This is usually approved within 1-2 hours for emergency and 24 hours for planned treatments.", hi: "अस्पताल बीमाकर्ता को प्री-ऑथराइज़ेशन अनुरोध भेजता है। यह आपातकाल के लिए 1-2 घंटे और नियोजित उपचार के लिए 24 घंटे में स्वीकृत होता है।", hinglish: "Hospital insurer ko pre-authorization request bhejta hai. Ye emergency ke liye 1-2 ghante aur planned treatment ke liye 24 ghante mein approve hota hai." } },
  { step: 4, title: { en: "Treatment & Discharge", hi: "इलाज और छुट्टी", hinglish: "Treatment & Discharge" }, desc: { en: "Get treated. At discharge, the insurer settles the bill directly with the hospital. You only pay for non-covered items and co-pay if applicable.", hi: "इलाज कराएँ। छुट्टी पर, बीमाकर्ता बिल सीधे अस्पताल के साथ निपटाता है। आप केवल गैर-कवर वाली चीज़ें और को-पे चुकाते हैं।", hinglish: "Treatment karayein. Discharge pe, insurer bill seedha hospital ke saath settle karta hai. Aap sirf non-covered items aur co-pay chukate hain." } },
];

const reimbursementSteps = [
  { step: 1, title: { en: "Get Treated at Any Hospital", hi: "किसी भी अस्पताल में इलाज कराएँ", hinglish: "Kisi bhi hospital mein treatment karayein" }, desc: { en: "You can go to any hospital — network or non-network. Pay all bills from your pocket.", hi: "आप किसी भी अस्पताल में जा सकते हैं — नेटवर्क या गैर-नेटवर्क। सभी बिल अपनी जेब से चुकाएँ।", hinglish: "Aap kisi bhi hospital mein ja sakte hain — network ya non-network. Sabhi bills apni jeb se chukayein." } },
  { step: 2, title: { en: "Collect All Documents", hi: "सभी दस्तावेज़ इकट्ठा करें", hinglish: "Sabhi documents ikatthe karein" }, desc: { en: "Collect discharge summary, bills, prescriptions, investigation reports, and payment receipts. All documents must be originals or certified copies.", hi: "डिस्चार्ज सारांश, बिल, पर्चे, जाँच रिपोर्ट और भुगतान रसीदें इकट्ठा करें।", hinglish: "Discharge summary, bills, prescriptions, investigation reports aur payment receipts ikatthe karein." } },
  { step: 3, title: { en: "File Claim Within Time Limit", hi: "समय सीमा के भीतर क्लेम दाखिल करें", hinglish: "Time limit ke bheetar claim daayil karein" }, desc: { en: "Submit the claim form with all documents to the insurer within 7-15 days of discharge (varies by insurer). Late filing can lead to rejection.", hi: "छुट्टी के 7-15 दिनों के भीतर सभी दस्तावेज़ों के साथ क्लेम फॉर्म बीमाकर्ता को जमा करें।", hinglish: "Discharge ke 7-15 dino ke bheetar sabhi documents ke saath claim form insurer ko jamaa karein." } },
  { step: 4, title: { en: "Receive Reimbursement", hi: "रिम्बर्समेंट प्राप्त करें", hinglish: "Reimbursement paayein" }, desc: { en: "The insurer processes the claim in 15-30 days and transfers the approved amount to your bank account. Deductions may apply for non-covered items and co-pay.", hi: "बीमाकर्ता 15-30 दिनों में क्लेम प्रोसेस करता है और स्वीकृत राशि आपके बैंक खाते में ट्रांसफर करता है।", hinglish: "Insurer 15-30 dino mein claim process karta hai aur approved amount aapke bank account mein transfer karta hai." } },
];

const comparisonData = [
  { feature: { en: "Payment", hi: "भुगतान", hinglish: "Payment" }, cashless: { en: "Insurer pays hospital directly", hi: "बीमाकर्ता सीधे अस्पताल को भुगतान करता है", hinglish: "Insurer seedha hospital ko pay karta hai" }, reimbursement: { en: "You pay first, get reimbursed later", hi: "आप पहले भुगतान करें, बाद में रिम्बर्समेंट मिलेगा", hinglish: "Aap pehle pay karein, baad mein reimbursement milega" } },
  { feature: { en: "Hospital Choice", hi: "अस्पताल चुनाव", hinglish: "Hospital Choice" }, cashless: { en: "Only network hospitals", hi: "केवल नेटवर्क अस्पताल", hinglish: "Sirf network hospitals" }, reimbursement: { en: "Any hospital in India", hi: "भारत में कोई भी अस्पताल", hinglish: "India mein koi bhi hospital" } },
  { feature: { en: "Out-of-Pocket", hi: "अपनी जेब से", hinglish: "Out-of-Pocket" }, cashless: { en: "Minimal (only non-covered items)", hi: "न्यूनतम (केवल गैर-कवर वाली चीज़ें)", hinglish: "Minimal (sirf non-covered items)" }, reimbursement: { en: "Full bill upfront", hi: "पूरा बिल पहले", hinglish: "Full bill pehle" } },
  { feature: { en: "Processing Time", hi: "प्रोसेसिंग समय", hinglish: "Processing Time" }, cashless: { en: "1-2 hours (emergency)", hi: "1-2 घंटे (आपातकाल)", hinglish: "1-2 ghante (emergency)" }, reimbursement: { en: "15-30 days after submission", hi: "जमा करने के बाद 15-30 दिन", hinglish: "15-30 days submission ke baad" } },
  { feature: { en: "Documentation", hi: "दस्तावेज़ीकरण", hinglish: "Documentation" }, cashless: { en: "Hospital handles most paperwork", hi: "अस्पताल अधिकांश कागज़ात संभालता है", hinglish: "Hospital handles most paperwork" }, reimbursement: { en: "You must collect and submit all docs", hi: "आपको सभी दस्तावेज़ इकट्ठा और जमा करने होंगे", hinglish: "Aapko sabhi documents collect aur submit karne honge" } },
  { feature: { en: "Risk of Rejection", hi: "अस्वीकृति का जोखिम", hinglish: "Risk of Rejection" }, cashless: { en: "Low (pre-authorized)", hi: "कम (पूर्व-अधिकृत)", hinglish: "Low (pre-authorized)" }, reimbursement: { en: "Higher (documentation issues)", hi: "अधिक (दस्तावेज़ीकरण समस्याएँ)", hinglish: "Higher (documentation issues)" } },
  { feature: { en: "Our Recommendation", hi: "हमारी सिफारिश", hinglish: "Our Recommendation" }, cashless: { en: "✅ Preferred for planned & emergency", hi: "✅ नियोजित और आपातकाल के लिए प्राथमिक", hinglish: "✅ Preferred for planned & emergency" }, reimbursement: { en: "Only if network hospital unavailable", hi: "केवल यदि नेटवर्क अस्पताल उपलब्ध नहीं", hinglish: "Only if network hospital unavailable" } },
];

const faqs = [
  { q: { en: "Is cashless claim better than reimbursement?", hi: "क्या कैशलेस क्लेम रिम्बर्समेंट से बेहतर है?", hinglish: "Kya cashless claim reimbursement se better hai?" }, a: { en: "Yes, cashless claims are generally better because the insurer pays the hospital directly, so you don't need to arrange large sums of money during a medical emergency. However, cashless is only available at network hospitals. Reimbursement is a backup when network hospitals aren't available.", hi: "हाँ, कैशलेस क्लेम आमतौर पर बेहतर है क्योंकि बीमाकर्ता सीधे अस्पताल को भुगतान करता है। हालांकि, कैशलेस केवल नेटवर्क अस्पतालों में उपलब्ध है।", hinglish: "Haan, cashless claims generally better hain kyunki insurer seedha hospital ko payment karta hai. Lekin cashless sirf network hospitals mein available hai." } },
  { q: { en: "Can I convert a reimbursement claim to cashless?", hi: "क्या मैं रिम्बर्समेंट क्लेम को कैशलेस में बदल सकता हूँ?", hinglish: "Kya main reimbursement claim ko cashless mein badal sakta hoon?" }, a: { en: "If you initially go to a non-network hospital but want to shift to a network hospital, you can request a transfer (subject to medical feasibility). However, expenses already incurred at the non-network hospital will be processed as reimbursement only.", hi: "यदि आप शुरू में गैर-नेटवर्क अस्पताल में गए हैं लेकिन नेटवर्क अस्पताल में शिफ्ट करना चाहते हैं, तो आप ट्रांसफर का अनुरोध कर सकते हैं।", hinglish: "Agar aap shuru mein non-network hospital mein gaye hain lekin network hospital mein shift karna chahte hain, toh aap transfer ka request kar sakte hain." } },
  { q: { en: "What documents are needed for reimbursement claim?", hi: "रिम्बर्समेंट क्लेम के लिए कौन से दस्तावेज़ चाहिए?", hinglish: "Reimbursement claim ke liye kaun se documents chahiye?" }, a: { en: "You need: (1) Claim form, (2) Discharge summary, (3) Original bills and payment receipts, (4) Doctor's prescriptions, (5) Investigation reports (X-ray, MRI, blood tests), (6) Pharmacy bills with prescriptions, (7) NEFT/bank details for payment, (8) Copy of ID and health card.", hi: "आपको चाहिए: (1) क्लेम फॉर्म, (2) डिस्चार्ज सारांश, (3) मूल बिल और भुगतान रसीदें, (4) डॉक्टर के पर्चे, (5) जाँच रिपोर्ट, (6) फार्मेसी बिल, (7) बैंक विवरण, (8) ID और हेल्थ कार्ड की कॉपी।", hinglish: "Aapko chahiye: (1) Claim form, (2) Discharge summary, (3) Original bills aur payment receipts, (4) Doctor ke prescriptions, (5) Investigation reports, (6) Pharmacy bills, (7) Bank details, (8) ID aur health card copy." } },
  { q: { en: "How long does a cashless claim take to approve?", hi: "कैशलेस क्लेम को स्वीकृत होने में कितना समय लगता है?", hinglish: "Cashless claim ko approve hone mein kitna time lagta hai?" }, a: { en: "Emergency cashless claims are usually approved within 1-2 hours. Planned treatments (like surgeries) should be pre-authorized at least 48-72 hours before admission. The TPA (Third Party Administrator) processes the request and communicates approval/denial to the hospital.", hi: "आपातकालीन कैशलेस क्लेम आमतौर पर 1-2 घंटे में स्वीकृत होते हैं। नियोजित उपचार प्रवेश से कम से कम 48-72 घंटे पहले पूर्व-अधिकृत होने चाहिए।", hinglish: "Emergency cashless claims usually 1-2 ghante mein approve hote hain. Planned treatments admission se kam se kam 48-72 ghante pehle pre-authorized hone chahiye." } },
];

export default function CashlessVsReimbursementClientContent() {
  const { language } = useLanguage();
  const lang = language as Language;

  const faqSchema = generateFAQSchema(faqs.map(f => ({ q: pt(f.q, lang), a: pt(f.a, lang) })));
  const articleSchema = generateArticleSchema({
    title: "Cashless vs Reimbursement Claim — Which is Better?",
    description: "Understand the difference between cashless and reimbursement health insurance claims.",
    slug: "cashless-vs-reimbursement-claim",
    datePublished: "2025-02-10",
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
            <BookOpen className="w-3.5 h-3.5 mr-1" />
            {pt(pageText.hero.badge, lang)}
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            <span className="gradient-text">{pt(pageText.hero.title, lang)}</span>{' '}
            <span className="text-[#7ED3E6]">{pt(pageText.hero.subtitle, lang)}</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
            {pt(pageText.hero.desc, lang)}
          </p>
        </div>
      </section>

      {/* Cashless Process */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
          <ShieldCheck className="w-7 h-7 text-green-500" />
          {pt(pageText.cashless.heading, lang)}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {cashlessSteps.map((s) => (
            <Card key={s.step} className="rounded-2xl border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center text-green-700 dark:text-green-400 font-bold text-sm">
                    {s.step}
                  </div>
                  <h3 className="font-bold text-foreground text-sm">{pt(s.title, lang)}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{pt(s.desc, lang)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Reimbursement Process */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
          <Wallet className="w-7 h-7 text-amber-500" />
          {pt(pageText.reimbursement.heading, lang)}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {reimbursementSteps.map((s) => (
            <Card key={s.step} className="rounded-2xl border-l-4 border-l-amber-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold text-sm">
                    {s.step}
                  </div>
                  <h3 className="font-bold text-foreground text-sm">{pt(s.title, lang)}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{pt(s.desc, lang)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
          {pt(pageText.comparison.heading, lang)}
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-semibold">Feature</th>
                <th className="text-left p-3 font-semibold text-green-700 dark:text-green-400">Cashless ✅</th>
                <th className="text-left p-3 font-semibold text-amber-700 dark:text-amber-400">Reimbursement</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, i) => (
                <tr key={i} className="border-t border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{pt(row.feature, lang)}</td>
                  <td className="p-3 text-sm">{pt(row.cashless, lang)}</td>
                  <td className="p-3 text-sm">{pt(row.reimbursement, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
          {pt(pageText.faq.heading, lang)}{' '}
          <span className="gradient-text">{pt(pageText.faq.highlight, lang)}</span>
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
          {(relatedArticlesMap['claim'] || []).map((link) => (
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
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{pt(pageText.cta.heading, lang)}</h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">{pt(pageText.cta.desc, lang)}</p>
          <a href={getWhatsAppCTA('Hi! I need help filing a health insurance claim.')}>
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
