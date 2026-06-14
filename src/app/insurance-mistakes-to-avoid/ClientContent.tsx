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
import { BookOpen, ArrowRight, MessageCircle, Scale, AlertTriangle, XCircle, Lightbulb } from 'lucide-react';

type TEntry = { en: string; hi: string; hinglish: string };
const pt = (obj: TEntry, lang: Language): string => obj[lang] || obj.en;

const mistakes = [
  { num: 1, title: { en: "Choosing too low sum insured", hi: "बहुत कम बीमित राशि चुनना", hinglish: "Bahut kam sum insured chunna" }, desc: { en: "A ₹3-5L sum insured is insufficient in 2026. A single hospitalization in a metro city can cost ₹5-10L. Always choose at least ₹10L for individuals and ₹15-25L for families.", hi: "2026 में ₹3-5L की बीमित राशि अपर्याप्त है। मेट्रो शहर में एक अस्पताल में भर्ती ₹5-10L का हो सकता है। हमेशा व्यक्तिगत रूप से कम से कम ₹10L और परिवारों के लिए ₹15-25L चुनें।", hinglish: "₹3-5L sum insured 2026 mein insufficient hai. Metro city mein ek hospitalization ₹5-10L ka ho sakta hai. Hamesha individual ke liye kam se kam ₹10L aur families ke liye ₹15-25L chunein." }, cost: "₹2-5L", fix: { en: "Get at least ₹10L cover; ₹25L for families", hi: "कम से कम ₹10L कवर लें; परिवारों के लिए ₹25L", hinglish: "Kam se kam ₹10L cover lein; families ke liye ₹25L" } },
  { num: 2, title: { en: "Ignoring room rent limit", hi: "रूम रेंट लिमिट को अनदेखा करना", hinglish: "Room rent limit ko ignore karna" }, desc: { en: "Room rent limit causes proportionate deduction on ALL expenses, not just room rent. A 1% cap can reduce your claim by 50%. Always choose plans with no room rent limit.", hi: "रूम रेंट लिमिट सभी खर्चों पर आनुपातिक कटौती का कारण बनती है। 1% कैप आपके क्लेम को 50% तक कम कर सकता है। हमेशा बिना रूम रेंट लिमिट वाली प्लान चुनें।", hinglish: "Room rent limit sabhi expenses pe proportionate deduction ka karan banti hai. 1% cap aapka claim 50% tak kam kar sakta hai." }, cost: "₹50K-2L", fix: { en: "Choose 'No Room Rent Limit' plans", hi: "'कोई रूम रेंट लिमिट नहीं' प्लान चुनें", hinglish: "'No Room Rent Limit' plans chunein" } },
  { num: 3, title: { en: "Not reading co-pay clause", hi: "को-पे क्लॉज़ न पढ़ना", hinglish: "Co-pay clause na padhna" }, desc: { en: "A 20% co-pay means you pay ₹1L on a ₹5L bill. Many people discover co-pay only at claim time. Always check for co-pay before buying.", hi: "20% को-पे का अर्थ है ₹5L बिल पर आप ₹1L चुकाते हैं। कई लोग को-पे केवल क्लेम के समय जानते हैं। खरीदने से पहले हमेशा को-पे जाँचें।", hinglish: "20% co-pay matlab ₹5L bill pe aap ₹1L chukate hain. Kai log co-pay sirf claim ke time jaante hain." }, cost: "₹50K-1L", fix: { en: "Choose zero co-pay plans or add waiver", hi: "ज़ीरो को-पे प्लान या वेवर जोड़ें", hinglish: "Zero co-pay plans ya waiver add karein" } },
  { num: 4, title: { en: "Buying only employer-provided insurance", hi: "केवल नियोक्ता द्वारा प्रदान किया गया बीमा खरीदना", hinglish: "Sirf employer-provided insurance lena" }, desc: { en: "Corporate insurance covers ₹3-5L, stops when you change jobs, and doesn't cover your parents. You need a personal health insurance policy independent of your employer.", hi: "कॉर्पोरेट इंश्योरेंस ₹3-5L कवर करता है, जॉब बदलने पर बंद हो जाता है, और आपके माता-पिता को कवर नहीं करता। आपको एक व्यक्तिगत हेल्थ इंश्योरेंस चाहिए।", hinglish: "Corporate insurance ₹3-5L cover karta hai, job badalne pe band ho jata hai, aur aapke parents ko cover nahi karta." }, cost: "₹5-10L", fix: { en: "Buy personal health insurance of at least ₹10L", hi: "कम से कम ₹10L का व्यक्तिगत हेल्थ इंश्योरेंस खरीदें", hinglish: "Kam se kam ₹10L ka personal health insurance khareedein" } },
  { num: 5, title: { en: "Hiding pre-existing diseases", hi: "पूर्व-मौजूदा बीमारियाँ छिपाना", hinglish: "Pre-existing diseases chhipana" }, desc: { en: "Not declaring diabetes, BP, or thyroid at the time of buying leads to claim rejection. Always declare all existing conditions — the insurer will cover them after the PED waiting period.", hi: "खरीदते समय डायबिटीज, BP या थायरॉइड न बताने से क्लेम अस्वीकृत होता है। हमेशा सभी मौजूदा स्थितियाँ बताएँ।", hinglish: "Khareedte waqt diabetes, BP ya thyroid na batane se claim reject hota hai. Hamesha sabhi conditions declare karein." }, cost: "Full claim", fix: { en: "Declare all conditions honestly", hi: "सभी स्थितियाँ ईमानदारी से बताएँ", hinglish: "Sabhi conditions honestly declare karein" } },
  { num: 6, title: { en: "Buying term insurance too late", hi: "टर्म इंश्योरेंस बहुत देर से खरीदना", hinglish: "Term insurance bahut der se khareedna" }, desc: { en: "Premium doubles every 5-7 years. A ₹1Cr term plan at age 25 costs ₹600/month, at 35 it's ₹1,200/month, at 45 it's ₹3,000/month. Buy term insurance as early as possible.", hi: "हर 5-7 वर्ष में प्रीमियम दोगुना होता है। 25 वर्ष पर ₹1Cr टर्म ₹600/माह, 35 पर ₹1,200/माह, 45 पर ₹3,000/माह। जितना जल्दी हो सके टर्म खरीदें।", hinglish: "Premium doubles har 5-7 saal mein. 25 years pe ₹1Cr term ₹600/month, 35 pe ₹1,200/month, 45 pe ₹3,000/month." }, cost: "₹50K-2L (extra premium)", fix: { en: "Buy term insurance before age 30", hi: "30 वर्ष की आयु से पहले टर्म खरीदें", hinglish: "30 saal ki age se pehle term khareedein" } },
  { num: 7, title: { en: "Choosing wrong IDV in motor insurance", hi: "मोटर इंश्योरेंस में गलत IDV चुनना", hinglish: "Motor insurance mein galat IDV chunna" }, desc: { en: "Low IDV means low premium but also low claim payout. High IDV means higher premium but better theft/total loss coverage. Always choose IDV close to your car's actual market value.", hi: "कम IDV का अर्थ कम प्रीमियम लेकिन कम क्लेम भुगतान भी। उच्च IDV का अर्थ अधिक प्रीमियम लेकिन बेहतर कवरेज। हमेशा अपनी कार के वास्तविक बाजार मूल्य के करीब IDV चुनें।", hinglish: "Low IDV matlab low premium lekin low claim payout bhi. High IDV matlab higher premium lekin better coverage." }, cost: "₹1-5L", fix: { en: "Set IDV at 90-95% of market value", hi: "बाजार मूल्य के 90-95% पर IDV सेट करें", hinglish: "Market value ke 90-95% pe IDV set karein" } },
  { num: 8, title: { en: "Not comparing before renewing", hi: "नवीनीकरण से पहले तुलना न करना", hinglish: "Renewal se pehle compare na karna" }, desc: { en: "Loyalty doesn't pay in insurance — insurers often increase premiums for existing customers while offering discounts to new ones. Always compare 3-5 insurers at renewal time.", hi: "बीमा में वफ़ादारी काम नहीं आती — बीमाकर्ता अक्सर मौजूदा ग्राहकों के लिए प्रीमियम बढ़ाते हैं। नवीनीकरण के समय हमेशा 3-5 बीमाकर्ताओं की तुलना करें।", hinglish: "Insurance mein loyalty kaam nahi aata — insurers often premiums badhate hain. Renewal pe hamesha 3-5 insurers compare karein." }, cost: "₹5-20K/year", fix: { en: "Compare and port if needed", hi: "तुलना करें और आवश्यकता पर पोर्ट करें", hinglish: "Compare karein aur agar zaroorat ho toh port karein" } },
  { num: 9, title: { en: "Missing the renewal date", hi: "नवीनीकरण तिथि छूटना", hinglish: "Renewal date miss karna" }, desc: { en: "If your policy lapses, you lose continuity benefits (waiting periods reset, NCB is lost). There's usually a 30-day grace period, but after that, you need a new policy with fresh waiting periods.", hi: "यदि आपकी पॉलिसी समाप्त हो जाती है, तो आप निरंतरता लाभ खो देते हैं। आमतौर पर 30 दिन की छूट होती है, लेकिन उसके बाद नई पॉलिसी की ज़रूरत होती है।", hinglish: "Agar aapki policy lapse ho jaati hai, toh aap continuity benefits kho dete hain. Usually 30-day grace period hai." }, cost: "Full coverage gap", fix: { en: "Set reminders 30 days before expiry", hi: "समाप्ति से 30 दिन पहले रिमाइंडर सेट करें", hinglish: "Expiry se 30 din pehle reminders set karein" } },
  { num: 10, title: { en: "Not buying critical illness rider", hi: "क्रिटिकल इलनेस राइडर न खरीदना", hinglish: "Critical illness rider na khareedna" }, desc: { en: "Health insurance pays hospital bills, but critical illness rider gives you a lump sum on diagnosis of cancer, heart attack, stroke etc. This covers loss of income during treatment.", hi: "हेल्थ इंश्योरेंस अस्पताल बिल चुकाता है, लेकिन क्रिटिकल इलनेस राइडर कैंसर, हार्ट अटैक आदि की पहचान पर एकमुश्त राशि देता है।", hinglish: "Health insurance hospital bills chukata hai, lekin critical illness rider diagnosis pe lump sum deta hai." }, cost: "₹5-10L", fix: { en: "Add critical illness rider of ₹25-50L", hi: "₹25-50L का क्रिटिकल इलनेस राइडर जोड़ें", hinglish: "₹25-50L ka critical illness rider add karein" } },
  { num: 11, title: { en: "Not understanding deductible", hi: "डिडक्टिबल न समझना", hinglish: "Deductible na samajhna" }, desc: { en: "Compulsory deductible means the first ₹1,000-5,000 of every claim is paid by you. Voluntary deductible reduces premium but increases your liability. Choose wisely based on claim frequency.", hi: "अनिवार्य डिडक्टिबल का अर्थ है कि हर क्लेम का पहला ₹1,000-5,000 आप चुकाते हैं। स्वैच्छिक डिडक्टिबल प्रीमियम कम करता है लेकिन आपकी देनदारी बढ़ाता है।", hinglish: "Compulsory deductible matlab har claim ka pehla ₹1,000-5,000 aap chukate hain. Voluntary deductible premium kam karta hai lekin liability badhata hai." }, cost: "₹1-5K/claim", fix: { en: "Understand deductible before choosing", hi: "चुनने से पहले डिडक्टिबल समझें", hinglish: "Choose karne se pehle deductible samjhein" } },
  { num: 12, title: { en: "Skipping super top-up", hi: "सुपर टॉप-अप छोड़ना", hinglish: "Super top-up skip karna" }, desc: { en: "A ₹15L base + ₹25L super top-up costs less than a ₹40L base plan. Super top-up kicks in after deductible is met and provides excellent coverage at low cost.", hi: "₹15L बेस + ₹25L सुपर टॉप-अप ₹40L बेस प्लान से कम का खर्चा है। सुपर टॉप-अप डिडक्टिबल पूरा होने के बाद शुरू होता है।", hinglish: "₹15L base + ₹25L super top-up ₹40L base plan se kam kharcha hai. Super top-up deductible poori hone ke baad shuru hota hai." }, cost: "₹10-25L", fix: { en: "Add super top-up of ₹25L over base plan", hi: "बेस प्लान पर ₹25L का सुपर टॉप-अप जोड़ें", hinglish: "Base plan pe ₹25L ka super top-up add karein" } },
  { num: 13, title: { en: "Not checking network hospitals", hi: "नेटवर्क अस्पताल न जाँचना", hinglish: "Network hospitals na check karna" }, desc: { en: "If your preferred hospital is not in the insurer's network, you'll have to go the reimbursement route — which means paying upfront and waiting 15-30 days. Always check if your local hospitals are in-network.", hi: "यदि आपका पसंदीदा अस्पताल बीमाकर्ता के नेटवर्क में नहीं है, तो आपको रिम्बर्समेंट रूट जाना होगा। हमेशा जाँचें कि आपके स्थानीय अस्पताल नेटवर्क में हैं।", hinglish: "Agar aapka preferred hospital insurer ke network mein nahi hai, toh aapko reimbursement route jana hoga." }, cost: "Time + interest cost", fix: { en: "Check network hospital list before buying", hi: "खरीदने से पहले नेटवर्क अस्पताल सूची जाँचें", hinglish: "Khareedne se pehle network hospital list check karein" } },
  { num: 14, title: { en: "Buying insurance for tax saving only", hi: "केवल कर बचत के लिए बीमा खरीदना", hinglish: "Sirf tax bachat ke liye insurance khareedna" }, desc: { en: "Buying a ₹5L policy just to save ₹15,000 tax under 80D is penny-wise and pound-foolish. Buy adequate coverage first (₹10-25L), then enjoy the tax benefit as a bonus.", hi: "80D के तहत ₹15,000 कर बचाने के लिए ₹5L की पॉलिसी खरीदना छोटी बचत बड़ा नुकसान है। पहले पर्याप्त कवरेज (₹10-25L) खरीदें, फिर कर लाभ का आनंद लें।", hinglish: "80D ke tahat ₹15,000 tax bachane ke liye ₹5L policy khareedna chhoti bachat bada nuksan hai." }, cost: "₹3-10L (underinsurance)", fix: { en: "Buy adequate coverage first, tax saving is bonus", hi: "पहले पर्याप्त कवरेज खरीदें, कर बचत बोनस है", hinglish: "Pehle adequate coverage khareedein, tax saving bonus hai" } },
  { num: 15, title: { en: "Not using an IRDAI-certified advisor", hi: "IRDAI-प्रमाणित सलाहकार का उपयोग न करना", hinglish: "IRDAI-certified advisor ka use na karna" }, desc: { en: "Buying insurance online without guidance often leads to wrong choices. An IRDAI-certified advisor like Himanshu Paliwal can compare 51+ insurers and find the best plan for your needs at no extra cost (insurers pay the advisor, not you).", hi: "बिना मार्गदर्शन के ऑनलाइन बीमा खरीदना अक्सर गलत चुनाव का कारण बनता है। हिमांशु पालीवाल जैसे IRDAI-प्रमाणित सलाहकार 51+ बीमाकर्ताओं की तुलना कर सकते हैं।", hinglish: "Bina guidance ke online insurance khareedna often galat choice ka karan banta hai. IRDAI-certified advisor 51+ insurers compare kar sakta hai." }, cost: "Wrong plan = ₹50K-5L", fix: { en: "Consult an IRDAI-certified advisor (free!)", hi: "IRDAI-प्रमाणित सलाहकार से परामर्श करें (मुफ़्त!)", hinglish: "IRDAI-certified advisor se consult karein (free!)" } },
];

const faqs = [
  { q: { en: "What is the biggest mistake people make with health insurance?", hi: "हेल्थ इंश्योरेंस में लोग सबसे बड़ी गलती क्या करते हैं?", hinglish: "Health insurance mein log sabse badi galti kya karte hain?" }, a: { en: "The biggest mistake is buying too low a sum insured. In 2026, a ₹3-5L policy is completely insufficient. Hospital bills in metro cities routinely exceed ₹5-10L. Always buy at least ₹10L for individuals and ₹25L for families.", hi: "सबसे बड़ी गलती बहुत कम बीमित राशि खरीदना है। 2026 में, ₹3-5L पॉलिसी पूरी तरह अपर्याप्त है। मेट्रो शहरों में अस्पताल बिल ₹5-10L से अधिक होते हैं।", hinglish: "Sabse badi galti bahut kam sum insured khareedna hai. 2026 mein, ₹3-5L policy completely insufficient hai." } },
  { q: { en: "How much money can insurance mistakes cost me?", hi: "बीमा की गलतियाँ मुझे कितना पैसा खर्च करा सकती हैं?", hinglish: "Insurance ki galtiyan mujhe kitna paisa kharcha kar sakti hain?" }, a: { en: "A single mistake can cost ₹50,000 to ₹5,00,000 or more. The most expensive mistakes are: too low sum insured (₹2-5L loss), ignoring room rent limit (₹50K-2L loss), hiding PED (full claim rejection), and relying only on employer insurance (₹5-10L loss if you lose your job during illness).", hi: "एक गलती ₹50,000 से ₹5,00,000 या अधिक का खर्चा करा सकती है। सबसे महंगी गलतियाँ हैं: बहुत कम बीमित राशि, रूम रेंट लिमिट को अनदेखा करना, PED छिपाना।", hinglish: "Ek galti ₹50,000 se ₹5,00,000 ya zyada ka kharcha kara sakti hai." } },
];

export default function InsuranceMistakesClientContent() {
  const { language } = useLanguage();
  const lang = language as Language;

  const faqSchema = generateFAQSchema(faqs.map(f => ({ q: pt(f.q, lang), a: pt(f.a, lang) })));
  const articleSchema = generateArticleSchema({
    title: "15 Insurance Mistakes That Cost You Lakhs",
    description: "Don't make these 15 common insurance mistakes — from wrong sum insured to ignoring room rent limits and co-pay.",
    slug: "insurance-mistakes-to-avoid",
    datePublished: "2025-02-15",
    dateModified: "2026-03-04",
  });

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="relative py-12 sm:py-20 bg-gradient-to-b from-[#0A1330] to-background overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <Badge className="mb-4 bg-red-500/20 text-red-400 border-red-500/30 rounded-full px-4 py-1">
            <AlertTriangle className="w-3.5 h-3.5 mr-1" />
            {lang === 'hi' ? 'चेतावनी गाइड 2026' : 'Warning Guide 2026'}
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            <span className="text-red-400">15 Insurance Mistakes</span>{' '}
            <span className="text-white">{lang === 'hi' ? 'जो आपको लाखों चुकाती हैं' : 'That Cost You Lakhs'}</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
            {lang === 'hi'
              ? 'ये 15 आम गलतियाँ ₹50,000 से ₹5,00,000 तक का नुकसान करा सकती हैं। हर गलती के समाधान के साथ पूरी गाइड पढ़ें।'
              : 'These 15 common mistakes can cost you ₹50,000 to ₹5,00,000 or more. Read the complete guide with fixes for each mistake.'}
          </p>
        </div>
      </section>

      {/* Mistakes List */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="space-y-4">
          {mistakes.map((m) => (
            <Card key={m.num} className="rounded-2xl border-l-4 border-l-red-400 hover:border-l-[#C98A1C] transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center text-red-600 dark:text-red-400 font-bold text-sm shrink-0">
                    {m.num}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                      <h3 className="font-bold text-foreground text-sm sm:text-base">{pt(m.title, lang)}</h3>
                      <Badge variant="destructive" className="text-xs">
                        {lang === 'hi' ? 'नुकसान:' : 'Cost:'} {m.cost}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{pt(m.desc, lang)}</p>
                    <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950/30 rounded-xl">
                      <Lightbulb className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-green-700 dark:text-green-300">{lang === 'hi' ? 'समाधान:' : 'Fix:'}</span>
                        <span className="text-xs text-green-700 dark:text-green-300 ml-1">{pt(m.fix, lang)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
          Insurance Mistakes <span className="gradient-text">FAQ</span>
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

      {/* CTA */}
      <section className="py-16 bg-gradient-to-b from-[#0A1330] to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            {lang === 'hi' ? 'इन गलतियों से बचें!' : 'Avoid These Mistakes!'}
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            {lang === 'hi'
              ? 'WhatsApp पर हिमांशु पालीवाल से चैट करें — मुफ़्त, व्यक्तिगत सलाह प्राप्त करें।'
              : 'Chat with Himanshu Paliwal on WhatsApp — get free, personalized advice to avoid these costly mistakes.'}
          </p>
          <a href={getWhatsAppCTA('Hi! I want to make sure I\'m not making any insurance mistakes.')}>
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
