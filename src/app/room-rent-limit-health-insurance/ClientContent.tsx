'use client';

import { useState } from 'react';
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
import { BedDouble, AlertTriangle, CheckCircle2, XCircle, ArrowRight, MessageCircle, BookOpen, Scale, ChevronRight } from 'lucide-react';

type TEntry = { en: string; hi: string; hinglish: string };
const pt = (obj: TEntry, lang: Language): string => obj[lang] || obj.en;

// ── Page Translations ──────────────────────────────────────────────────────
const pageText = {
  hero: {
    badge: { en: "Health Insurance Guide 2026", hi: "हेल्थ इंश्योरेंस गाइड 2026", hinglish: "Health Insurance Guide 2026" },
    title1: { en: "Room Rent Limit in", hi: "हेल्थ इंश्योरेंस में रूम रेंट", hinglish: "Room Rent Limit in" },
    title2: { en: "Health Insurance", hi: "लिमिट", hinglish: "Health Insurance" },
    subtitle: { en: "Explained", hi: "समझिए", hinglish: "Explained" },
    desc: {
      en: "Room rent limit is one of the most overlooked clauses in health insurance — and it can reduce your claim by ₹50,000 or more. Understand how room rent capping works, the 3 types of limits, and which plans offer no room rent cap.",
      hi: "रूम रेंट लिमिट हेल्थ इंश्योरेंस में सबसे अधिक नज़रअंदाज़ किया गया क्लॉज़ है — और यह आपके क्लेम को ₹50,000 या अधिक तक कम कर सकता है। जानें कि रूम रेंट कैपिंग कैसे काम करती है, लिमिट के 3 प्रकार, और कौन सी प्लान में कोई रूम रेंट कैप नहीं है।",
      hinglish: "Room rent limit health insurance mein sabse zyada ignore kiya gaya clause hai — aur ye aapke claim ko ₹50,000 ya zyada tak kam kar sakta hai. Samjho room rent capping kaise kaam karti hai, 3 types of limits, aur kaunsi plans mein koi room rent cap nahi hai."
    },
  },
  keyTakeaways: {
    heading: { en: "Key Takeaways", hi: "मुख्य बातें", hinglish: "Key Takeaways" },
    items: [
      { icon: "🛏️", text: { en: "Room rent limit caps the daily room charge your insurer will pay — anything above comes from your pocket.", hi: "रूम रेंट लिमिट आपके बीमाकर्ता द्वारा भुगतान की जाने वाली दैनिक कमरे के शुल्क को सीमित करती है — इससे अधिक आपकी जेब से आता है।", hinglish: "Room rent limit caps the daily room charge your insurer will pay — anything above comes from your pocket." } },
      { icon: "📉", text: { en: "Choosing a room above the limit reduces ALL claim expenses proportionally — not just room rent.", hi: "लिमिट से ऊपर का कमरा चुनने से सभी क्लेम खर्चे आनुपातिक रूप से कम हो जाते हैं — केवल रूम रेंट नहीं।", hinglish: "Limit se upar ka room chunne se sabhi claim expenses proportionally kam ho jate hain — sirf room rent nahi." } },
      { icon: "✅", text: { en: "Plans with 'No Room Rent Limit' or 'Single Private Room' are best for families and senior citizens.", hi: "'कोई रूम रेंट लिमिट नहीं' या 'सिंगल प्राइवेट रूम' वाली प्लान परिवारों और वरिष्ठ नागरिकों के लिए सबसे अच्छी हैं।", hinglish: "'No Room Rent Limit' ya 'Single Private Room' wali plans families aur senior citizens ke liye best hain." } },
      { icon: "💡", text: { en: "Even a 1% room rent cap on sum insured can cause huge out-of-pocket expenses in metro hospitals.", hi: "बीमित राशि पर 1% का रूम रेंट कैप भी मेट्रो अस्पतालों में बड़े खर्चे का कारण बन सकता है।", hinglish: "Even 1% room rent cap on sum insured can cause huge out-of-pocket expenses in metro hospitals." } },
    ],
  },
  types: {
    heading1: { en: "3 Types of Room Rent", hi: "रूम रेंट लिमिट के 3 प्रकार", hinglish: "3 Types of Room Rent" },
    heading2: { en: "Limits", hi: "लिमिट", hinglish: "Limits" },
    desc: {
      en: "Health insurance policies in India typically have one of three room rent structures. Understanding the difference can save you lakhs at claim time.",
      hi: "भारत में हेल्थ इंश्योरेंस पॉलिसियों में आमतौर पर तीन प्रकार की रूम रेंट संरचना होती है। अंतर को समझना क्लेम के समय लाखों बचा सकता है।",
      hinglish: "Health insurance policies in India mein usually teen types ki room rent structure hoti hai. Difference samajhna claim time pe lakhs bacha sakta hai."
    },
  },
  comparison: {
    heading1: { en: "Room Rent Limit", hi: "रूम रेंट लिमिट", hinglish: "Room Rent Limit" },
    heading2: { en: "Comparison", hi: "तुलना", hinglish: "Comparison" },
    desc: {
      en: "Here's how top health insurers handle room rent limits. Plans with no limit or single private room are our top recommendations.",
      hi: "शीर्ष हेल्थ बीमाकर्ता रूम रेंट लिमिट को कैसे हैंडल करते हैं। कोई लिमिट नहीं या सिंगल प्राइवेट रूम वाली प्लान हमारी शीर्ष सिफारिशें हैं।",
      hinglish: "Top health insurers room rent limits kaise handle karte hain. No limit ya single private room wali plans hamari top recommendations hain."
    },
    thInsurer: { en: "Insurer", hi: "बीमाकर्ता", hinglish: "Insurer" },
    thLimit: { en: "Room Rent Limit", hi: "रूम रेंट लिमिट", hinglish: "Room Rent Limit" },
    thType: { en: "Type", hi: "प्रकार", hinglish: "Type" },
    thVerdict: { en: "Verdict", hi: "निर्णय", hinglish: "Verdict" },
  },
  impactCalc: {
    heading1: { en: "How Room Rent Limit", hi: "रूम रेंट लिमिट क्लेम को", hinglish: "Room Rent Limit Claim ko" },
    heading2: { en: "Affects Your Claim", hi: "कैसे प्रभावित करती है", hinglish: "Kaise Affect Karti Hai" },
    desc: {
      en: "See the real impact with a practical example. When you choose a room above your policy limit, the insurer applies a proportionate deduction to ALL expenses — not just room rent.",
      hi: "एक व्यावहारिक उदाहरण से वास्तविक प्रभाव देखें। जब आप अपनी पॉलिसी लिमिट से ऊपर का कमरा चुनते हैं, तो बीमाकर्ता सभी खर्चों पर आनुपातिक कटौती लागू करता है।",
      hinglish: "Real impact ek practical example se dekho. Jab aap apni policy limit se upar ka room chunte hain, toh insurer sabhi expenses pe proportionate deduction lagata hai."
    },
  },
  faq: {
    heading: { en: "Room Rent Limit", hi: "रूम रेंट लिमिट", hinglish: "Room Rent Limit" },
    headingHighlight: { en: "FAQ", hi: "सवाल-जवाब", hinglish: "FAQ" },
  },
  cta: {
    heading1: { en: "Still confused about", hi: "रूम रेंट लिमिट को लेकर", hinglish: "Room rent limit ke baare mein" },
    heading2: { en: "room rent limits?", hi: "अभी भी confused?", hinglish: "abhi bhi confused?" },
    desc: {
      en: "Chat with Himanshu Paliwal on WhatsApp — get personalized advice on which health plan has the best room rent terms for your family. Free, no-obligation consultation.",
      hi: "WhatsApp पर हिमांशु पालीवाल से चैट करें — आपके परिवार के लिए कौन सी हेल्थ प्लान में सबसे अच्छी रूम रेंट शर्तें हैं, व्यक्तिगत सलाह प्राप्त करें। मुफ़्त, बिना किसी बाध्यता के।",
      hinglish: "WhatsApp pe Himanshu Paliwal se chat karein — apne family ke liye kaunsi health plan mein best room rent terms hain, personalized advice paayein. Free, no-obligation consultation."
    },
    ctaWhatsApp: { en: "Chat on WhatsApp", hi: "WhatsApp पर चैट करें", hinglish: "WhatsApp pe Chat Karein" },
  },
  related: {
    heading: { en: "Related Articles", hi: "संबंधित लेख", hinglish: "Related Articles" },
  },
};

// ── Room Rent Limit Data ───────────────────────────────────────────────────
const roomRentData = [
  { insurer: 'Acko General Insurance', limit: 'No limit', type: 'No Cap', verdict: '✅ Best', csr: 99.91 },
  { insurer: 'Care Health Insurance', limit: 'Single private room', type: 'Room Category', verdict: '✅ Good', csr: 100 },
  { insurer: 'HDFC ERGO General Insurance', limit: 'Deluxe room', type: 'Room Category', verdict: '✅ Good', csr: 99.16 },
  { insurer: 'Star Health & Allied Insurance', limit: '1% of SI (single AC)', type: 'Percentage Cap', verdict: '⚠️ Limited', csr: 92.02 },
  { insurer: 'ICICI Lombard General Insurance', limit: '1% of SI', type: 'Percentage Cap', verdict: '⚠️ Limited', csr: 96.7 },
  { insurer: 'Niva Bupa Health Insurance', limit: 'Single AC room', type: 'Room Category', verdict: '✅ Good', csr: 86.8 },
  { insurer: 'Bajaj Allianz General Insurance', limit: '1% of SI', type: 'Percentage Cap', verdict: '⚠️ Limited', csr: 95.2 },
];

// ── Impact Example ─────────────────────────────────────────────────────────
const impactExample = {
  sumInsured: 500000,
  roomRentLimit: 5000, // 1% of SI
  actualRoomRent: 10000,
  totalBill: 150000,
  roomDays: 5,
};

function calculateImpact() {
  const { sumInsured, roomRentLimit, actualRoomRent, totalBill, roomDays } = impactExample;
  const eligibleRoom = roomRentLimit;
  const proportionateDeduction = actualRoomRent / eligibleRoom;
  const eligibleTotal = Math.round(totalBill / proportionateDeduction);
  const youPay = totalBill - eligibleTotal;
  return { eligibleTotal, youPay, proportionateDeduction: proportionateDeduction.toFixed(1) };
}

// ── FAQs ───────────────────────────────────────────────────────────────────
const faqs = [
  { q: { en: "What is room rent limit in health insurance?", hi: "हेल्थ इंश्योरेंस में रूम रेंट लिमिट क्या है?", hinglish: "Health insurance mein room rent limit kya hai?" }, a: { en: "Room rent limit is the maximum daily room charge your health insurer will cover. If your hospital room costs more than this limit, the insurer applies a proportionate deduction on ALL treatment expenses — not just room rent. This can significantly reduce your claim amount.", hi: "रूम रेंट लिमिट अधिकतम दैनिक कमरे का शुल्क है जो आपका हेल्थ बीमाकर्ता कवर करेगा। यदि आपका अस्पताल का कमरा इस लिमिट से अधिक है, तो बीमाकर्ता सभी इलाज खर्चों पर आनुपातिक कटौती लागू करता है।", hinglish: "Room rent limit maximum daily room charge hai jo aapka health insurer cover karega. Agar aapka hospital room is limit se zyada hai, toh insurer sabhi treatment expenses pe proportionate deduction lagata hai." } },
  { q: { en: "What happens if I choose a room above the rent limit?", hi: "यदि मैं रूम रेंट लिमिट से ऊपर का कमरा चुनता हूँ तो क्या होगा?", hinglish: "Agar main room rent limit se upar ka room chunoon toh kya hoga?" }, a: { en: "The insurer applies proportionate deduction. For example, if your limit is ₹5,000/day but you take a ₹10,000/day room, the insurer will pay only 50% of ALL expenses — doctor fees, surgery, medicines — not just the room rent difference. You pay the remaining 50% from your pocket.", hi: "बीमाकर्ता आनुपातिक कटौती लागू करता है। उदाहरण के लिए, यदि आपकी लिमिट ₹5,000/दिन है लेकिन आप ₹10,000/दिन का कमरा लेते हैं, तो बीमाकर्ता सभी खर्चों का केवल 50% चुकाएगा।", hinglish: "Insurer proportionate deduction lagata hai. Example ke liye, agar aapki limit ₹5,000/day hai lekin aap ₹10,000/day ka room lete hain, toh insurer sabhi expenses ka sirf 50% pay karega." } },
  { q: { en: "Which health insurance has no room rent limit?", hi: "किस हेल्थ इंश्योरेंस में कोई रूम रेंट लिमिट नहीं है?", hinglish: "Kis health insurance mein koi room rent limit nahi hai?" }, a: { en: "Acko General Insurance offers no room rent limit. Care Health Insurance and HDFC ERGO offer room category-based limits (single private room / deluxe room) which are more flexible than percentage-based caps. These are the best options for avoiding proportionate deductions.", hi: "Acko General Insurance में कोई रूम रेंट लिमिट नहीं है। Care Health Insurance और HDFC ERGO रूम कैटेगरी-आधारित लिमिट ऑफर करते हैं जो प्रतिशत-आधारित कैप से अधिक लचीली हैं।", hinglish: "Acko General Insurance mein koi room rent limit nahi hai. Care Health Insurance aur HDFC ERGO room category-based limits offer karte hain jo percentage-based caps se zyada flexible hain." } },
  { q: { en: "Is 1% room rent cap on sum insured enough?", hi: "बीमित राशि पर 1% रूम रेंट कैप पर्याप्त है?", hinglish: "1% room rent cap on sum insured enough hai?" }, a: { en: "No, a 1% cap is often insufficient in metro cities. For a ₹5L policy, 1% means ₹5,000/day — but private rooms in Delhi/Mumbai hospitals can cost ₹8,000-₹15,000/day. This leads to proportionate deductions that can reduce your claim by 30-50%. Always prefer plans with no cap or room category limits.", hi: "नहीं, 1% कैप अक्सर मेट्रो शहरों में अपर्याप्त है। ₹5L की पॉलिसी के लिए, 1% का अर्थ ₹5,000/दिन है — लेकिन दिल्ली/मुंबई अस्पतालों में प्राइवेट रूम ₹8,000-₹15,000/दिन का हो सकता है।", hinglish: "Nahi, 1% cap often metro cities mein insufficient hai. ₹5L policy ke liye, 1% means ₹5,000/day — lekin Delhi/Mumbai hospitals mein private rooms ₹8,000-₹15,000/day ka ho sakta hai." } },
  { q: { en: "Does room rent limit apply to ICU charges?", hi: "क्या रूम रेंट लिमिट ICU चार्ज पर लागू होती है?", hinglish: "Kya room rent limit ICU charges pe lagu hoti hai?" }, a: { en: "Most policies do not apply room rent limits to ICU charges — ICU is usually covered in full. However, always check your policy wordings carefully as some policies may have ICU sub-limits as well.", hi: "अधिकांश पॉलिसियों में रूम रेंट लिमिट ICU चार्ज पर लागू नहीं होती — ICU आमतौर पर पूरी तरह कवर होता है। हालांकि, हमेशा अपनी पॉलिसी शर्तों की जाँच करें।", hinglish: "Most policies mein room rent limits ICU charges pe apply nahi hoti — ICU usually full cover hota hai. Lekin hamesha apni policy wordings check karein." } },
  { q: { en: "Can I remove room rent limit from my policy?", hi: "क्या मैं अपनी पॉलिसी से रूम रेंट लिमिट हटा सकता हूँ?", hinglish: "Kya main apni policy se room rent limit hata sakta hoon?" }, a: { en: "Yes, many insurers offer a 'Room Rent Waiver' add-on that removes the room rent cap for an additional premium of 10-20%. Alternatively, you can switch to a plan with no room rent limit at your next renewal.", hi: "हाँ, कई बीमाकर्ता 'रूम रेंट वेवर' ऐड-ऑन ऑफर करते हैं जो 10-20% अतिरिक्त प्रीमियम पर रूम रेंट कैप हटा देता है। वैकल्पिक रूप से, आप अगले नवीनीकरण पर कोई रूम रेंट लिमिट नहीं वाली प्लान में स्विच कर सकते हैं।", hinglish: "Haan, kai insurers 'Room Rent Waiver' add-on offer karte hain jo 10-20% additional premium pe room rent cap hata deta hai. Alternatively, aap agle renewal pe koi room rent limit nahi wali plan mein switch kar sakte hain." } },
];

export default function RoomRentLimitClientContent() {
  const { language } = useLanguage();
  const lang = language as Language;
  const [showImpact, setShowImpact] = useState(false);
  const impact = calculateImpact();

  const faqSchema = generateFAQSchema(faqs.map(f => ({ q: pt(f.q, lang), a: pt(f.a, lang) })));
  const articleSchema = generateArticleSchema({
    title: "Room Rent Limit in Health Insurance Explained 2026",
    description: "Understand room rent limit in health insurance — how it affects your claim amount, types of limits, and which plans have no room rent cap.",
    slug: "room-rent-limit-health-insurance",
    datePublished: "2025-01-15",
    dateModified: "2026-03-04",
  });

  const relatedLinks = relatedArticlesMap['health'] || [];

  return (
    <div className="min-h-screen">
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 bg-gradient-to-b from-[#0A1330] to-background overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
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
            <a href={getWhatsAppCTA('Hi! I need help understanding room rent limits in health insurance.')}>
              <ShinyButton className="bg-[#25D366] hover:bg-[#20BD5A] text-white">
                <MessageCircle className="w-4 h-4 mr-2" />
                {pt(pageText.cta.ctaWhatsApp, lang)}
              </ShinyButton>
            </a>
            <Link href="/best-health-insurance-india">
              <ShinyButton className="bg-[#C98A1C] hover:bg-[#B07A18] text-white">
                {pt(pageText.comparison.heading2, lang)} <ArrowRight className="w-4 h-4 ml-2" />
              </ShinyButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Card className="rounded-2xl border-[#C98A1C]/20">
          <CardContent className="p-5">
            <h3 className="font-bold text-sm text-foreground mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#C98A1C]" />
              Table of Contents
            </h3>
            <nav className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { href: '#key-takeaways', label: 'Key Takeaways' },
                { href: '#types', label: '3 Types of Room Rent Limits' },
                { href: '#comparison', label: 'Insurer Comparison Table' },
                { href: '#paliwal-ratings', label: 'Paliwal Secure Rating™' },
                { href: '#impact', label: 'How It Affects Your Claim' },
                { href: '#faq', label: 'Frequently Asked Questions' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#C98A1C] transition-colors"
                >
                  <ChevronRight className="w-3 h-3" />
                  {item.label}
                </a>
              ))}
            </nav>
          </CardContent>
        </Card>
      </section>

      {/* Key Takeaways */}
      <section id="key-takeaways" className="max-w-4xl mx-auto px-4 sm:px-6 py-6 scroll-mt-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
          {pt(pageText.keyTakeaways.heading, lang)}
        </h2>
        <div className="grid gap-4">
          {pageText.keyTakeaways.items.map((item, i) => (
            <Card key={i} className="rounded-2xl border-l-4 border-l-[#C98A1C]">
              <CardContent className="p-4 flex items-start gap-3">
                <span className="text-2xl">{item.icon}</span>
                <p className="text-sm text-foreground leading-relaxed">{pt(item.text, lang)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 3 Types of Limits */}
      <section id="types" className="max-w-4xl mx-auto px-4 sm:px-6 py-10 scroll-mt-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {pt(pageText.types.heading1, lang)}{' '}
          <span className="gradient-text">{pt(pageText.types.heading2, lang)}</span>
        </h2>
        <p className="text-muted-foreground mb-8">{pt(pageText.types.desc, lang)}</p>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Type 1: Fixed Amount Capping */}
          <Card className="rounded-2xl border-red-200 dark:border-red-800/40">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-foreground">Fixed Amount Capping</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {lang === 'hi'
                  ? 'बीमाकर्ता प्रतिदिन एक निश्चित राशि तक कवर करता है (जैसे ₹3,000/दिन)। अधिक राशि वाला कमरा लेने पर सभी खर्चों पर आनुपातिक कटौती होती है।'
                  : lang === 'hinglish'
                  ? 'Insurer ek fixed amount tak cover karta hai per day (jaise ₹3,000/day). Zyada amount wala room lene pe sabhi expenses pe proportionate deduction hota hai.'
                  : 'The insurer covers up to a fixed amount per day (e.g., ₹3,000/day). Taking a more expensive room triggers proportionate deduction on ALL expenses.'}
              </p>
              <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl">
                <p className="text-xs text-red-700 dark:text-red-300 font-medium">
                  {lang === 'hi' ? 'उदाहरण: ₹5L SI पर ₹3,000/दिन' : 'Example: ₹3,000/day on ₹5L SI'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Type 2: Percentage of Sum Insured */}
          <Card className="rounded-2xl border-amber-200 dark:border-amber-800/40">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-foreground">Percentage of SI</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {lang === 'hi'
                  ? 'बीमित राशि का एक निश्चित प्रतिशत (आमतौर पर 1% या 2%) प्रतिदिन रूम रेंट लिमिट के रूप में। यह मेट्रो शहरों में अक्सर अपर्याप्त होता है।'
                  : lang === 'hinglish'
                  ? 'Sum insured ka ek fixed percentage (usually 1% ya 2%) per day room rent limit ke roop mein. Ye metro cities mein often insufficient hota hai.'
                  : 'A fixed percentage of sum insured (usually 1% or 2%) per day as room rent limit. Often insufficient in metro cities.'}
              </p>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl">
                <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                  {lang === 'hi' ? 'उदाहरण: ₹5L SI का 1% = ₹5,000/दिन' : 'Example: 1% of ₹5L SI = ₹5,000/day'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Type 3: No Limit / Room Category */}
          <Card className="rounded-2xl border-green-200 dark:border-green-800/40">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <h3 className="font-bold text-foreground">No Limit / Room Category</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {lang === 'hi'
                  ? 'कोई रूम रेंट लिमिट नहीं या केवल कमरे की श्रेणी (जैसे "सिंगल प्राइवेट रूम")। सबसे लचीला विकल्प — कोई आनुपातिक कटौती नहीं।'
                  : lang === 'hinglish'
                  ? 'Koi room rent limit nahi ya sirf room category (jaise "Single Private Room"). Sabse flexible option — koi proportionate deduction nahi.'
                  : 'No room rent limit or only room category (e.g., "Single Private Room"). Most flexible option — no proportionate deduction.'}
              </p>
              <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-xl">
                <p className="text-xs text-green-700 dark:text-green-300 font-medium">
                  {lang === 'hi' ? 'उदाहरण: कोई लिमिट नहीं या सिंगल AC कमरा' : 'Example: No limit or Single AC room'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Comparison Table */}
      <section id="comparison" className="max-w-4xl mx-auto px-4 sm:px-6 py-10 scroll-mt-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {pt(pageText.comparison.heading1, lang)}{' '}
          <span className="gradient-text">{pt(pageText.comparison.heading2, lang)}</span>
        </h2>
        <p className="text-muted-foreground mb-8">{pt(pageText.comparison.desc, lang)}</p>

        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-semibold">{pt(pageText.comparison.thInsurer, lang)}</th>
                <th className="text-left p-3 font-semibold">{pt(pageText.comparison.thLimit, lang)}</th>
                <th className="text-left p-3 font-semibold">{pt(pageText.comparison.thType, lang)}</th>
                <th className="text-left p-3 font-semibold">{pt(pageText.comparison.thVerdict, lang)}</th>
              </tr>
            </thead>
            <tbody>
              {roomRentData.map((row, i) => (
                <tr key={i} className="border-t border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{row.insurer}</td>
                  <td className="p-3">{row.limit}</td>
                  <td className="p-3">
                    <Badge variant={row.type === 'No Cap' ? 'default' : row.type === 'Room Category' ? 'secondary' : 'outline'} className="text-xs">
                      {row.type}
                    </Badge>
                  </td>
                  <td className="p-3 text-sm">{row.verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Paliwal Secure Ratings */}
      <section id="paliwal-ratings" className="max-w-4xl mx-auto px-4 sm:px-6 py-10 scroll-mt-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
          Paliwal Secure Rating™ —{' '}
          <span className="gradient-text">Room Rent Leaders</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {healthInsurancePlans.slice(0, 4).map((plan) => (
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

      {/* Impact Calculator */}
      <section id="impact" className="max-w-4xl mx-auto px-4 sm:px-6 py-10 scroll-mt-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {pt(pageText.impactCalc.heading1, lang)}{' '}
          <span className="gradient-text">{pt(pageText.impactCalc.heading2, lang)}</span>
        </h2>
        <p className="text-muted-foreground mb-6">{pt(pageText.impactCalc.desc, lang)}</p>

        <Card className="rounded-2xl border-[#C98A1C]/20">
          <CardContent className="p-6">
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Scenario */}
              <div className="space-y-4">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <BedDouble className="w-5 h-5 text-[#C98A1C]" />
                  {lang === 'hi' ? 'परिदृश्य' : 'Scenario'}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground">Sum Insured</span>
                    <span className="font-semibold">₹5,00,000</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground">Room Rent Limit (1% of SI)</span>
                    <span className="font-semibold">₹5,000/day</span>
                  </div>
                  <div className="flex justify-between p-2 bg-red-50 dark:bg-red-950/30 rounded-lg">
                    <span className="text-red-700 dark:text-red-300">Actual Room Rent</span>
                    <span className="font-semibold text-red-700 dark:text-red-300">₹10,000/day</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground">Total Hospital Bill</span>
                    <span className="font-semibold">₹1,50,000</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowImpact(!showImpact)}
                  className="w-full py-2 px-4 rounded-xl bg-[#C98A1C] text-white font-medium text-sm hover:bg-[#B07A18] transition-colors"
                >
                  {showImpact
                    ? (lang === 'hi' ? 'छिपाएँ' : 'Hide Impact')
                    : (lang === 'hi' ? 'प्रभाव देखें' : 'See the Impact')}
                </button>
              </div>

              {/* Result */}
              {showImpact && (
                <div className="space-y-4">
                  <h3 className="font-bold text-foreground flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    {lang === 'hi' ? 'परिणाम — आनुपातिक कटौती' : 'Result — Proportionate Deduction'}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">Deduction Ratio</span>
                      <span className="font-semibold text-red-600">{impact.proportionateDeduction}x</span>
                    </div>
                    <div className="flex justify-between p-2 bg-green-50 dark:bg-green-950/30 rounded-lg">
                      <span className="text-green-700 dark:text-green-300">Insurer Pays</span>
                      <span className="font-semibold text-green-700 dark:text-green-300">₹{impact.eligibleTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-red-50 dark:bg-red-950/30 rounded-lg">
                      <span className="text-red-700 dark:text-red-300">You Pay from Pocket</span>
                      <span className="font-semibold text-red-700 dark:text-red-300">₹{impact.youPay.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/40">
                    <p className="text-xs text-amber-800 dark:text-amber-200">
                      {lang === 'hi'
                        ? '⚠️ आपने सोचा होगा कि केवल ₹25,000 अतिरिक्त रूम रेंट आपको देनी होगी। लेकिन आनुपातिक कटौती के कारण, आप ₹75,000 अपनी जेब से चुकाते हैं!'
                        : '⚠️ You might think you only pay ₹25,000 extra for room rent. But due to proportionate deduction, you pay ₹75,000 from your pocket!'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 py-10 scroll-mt-20">
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

      {/* IRDAI Disclaimer */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="p-4 bg-muted/50 rounded-2xl border border-border/50">
          <div className="flex items-start gap-3">
            <Scale className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {irdaiDisclaimer[lang]}
            </p>
          </div>
        </div>
      </section>

      {/* Author Bio */}
      <AuthorBio />

      {/* Related Articles */}
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

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#0A1330] to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            {pt(pageText.cta.heading1, lang)}{' '}
            <span className="text-[#7ED3E6]">{pt(pageText.cta.heading2, lang)}</span>
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">{pt(pageText.cta.desc, lang)}</p>
          <a href={getWhatsAppCTA('Hi! I need help with room rent limits in health insurance.')}>
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
