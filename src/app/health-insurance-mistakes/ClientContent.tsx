'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { Language } from '@/lib/i18n-strings';
import { ShinyButton } from '@/components/ui/shiny-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AuthorBio from '@/components/AuthorBio';
import { generateArticleSchema, irdaiDisclaimer, relatedArticlesMap, getWhatsAppCTA } from '@/lib/content-templates';
import { AlertTriangle, MessageCircle, Scale, Lightbulb, BookOpen } from 'lucide-react';

type TEntry = { en: string; hi: string; hinglish: string };
const pt = (obj: TEntry, lang: Language): string => obj[lang] || obj.en;

const mistakes = [
  { title: { en: "Choosing too low sum insured", hi: "बहुत कम बीमित राशि चुनना", hinglish: "Bahut kam sum insured chunna" }, desc: { en: "₹3-5L cover is insufficient in 2026. Metro hospital bills easily cross ₹5-10L. Get at least ₹10L individual, ₹25L family.", hi: "2026 में ₹3-5L कवर अपर्याप्त है। मेट्रो अस्पताल बिल आसानी से ₹5-10L पार करते हैं। कम से कम ₹10L व्यक्तिगत, ₹25L परिवार लें।", hinglish: "₹3-5L cover 2026 mein insufficient hai. Metro hospital bills easily cross ₹5-10L." }, cost: "₹2-5L" },
  { title: { en: "Ignoring room rent limit", hi: "रूम रेंट लिमिट को अनदेखा करना", hinglish: "Room rent limit ignore karna" }, desc: { en: "1% room rent cap causes proportionate deduction on ALL expenses. Choose 'No Room Rent Limit' plans.", hi: "1% रूम रेंट कैप सभी खर्चों पर आनुपातिक कटौती करता है। 'कोई रूम रेंट लिमिट नहीं' प्लान चुनें।", hinglish: "1% room rent cap sabhi expenses pe proportionate deduction karta hai." }, cost: "₹50K-2L" },
  { title: { en: "Not checking co-pay clause", hi: "को-पे क्लॉज़ न जाँचना", hinglish: "Co-pay clause na check karna" }, desc: { en: "20% co-pay means ₹1L out-of-pocket on ₹5L bill. Always choose zero co-pay plans.", hi: "20% को-पे का अर्थ ₹5L बिल पर ₹1L अपनी जेब से। हमेशा ज़ीरो को-पे प्लान चुनें।", hinglish: "20% co-pay matlab ₹5L bill pe ₹1L apni jeb se." }, cost: "₹50K-1L" },
  { title: { en: "Hiding pre-existing diseases", hi: "पूर्व-मौजूदा बीमारियाँ छिपाना", hinglish: "PED chhipana" }, desc: { en: "Non-disclosure leads to claim rejection. Always declare diabetes, BP, thyroid honestly.", hi: "गैर-प्रकटीकरण क्लेम अस्वीकृति का कारण बनता है। हमेशा डायबिटीज, BP, थायरॉइड ईमानदारी से बताएँ।", hinglish: "Non-disclosure claim rejection ka karan banta hai." }, cost: "Full claim" },
  { title: { en: "Relying only on employer insurance", hi: "केवल नियोक्ता बीमे पर निर्भर रहना", hinglish: "Sirf employer insurance pe depend rehna" }, desc: { en: "Corporate insurance stops when you change/lose job. Get personal policy of at least ₹10L.", hi: "कॉर्पोरेट इंश्योरेंस जॉब बदलने/खोने पर बंद हो जाता है। कम से कम ₹10L की व्यक्तिगत पॉलिसी लें।", hinglish: "Corporate insurance job badalne/khone pe band ho jata hai." }, cost: "₹5-10L" },
  { title: { en: "Not buying super top-up", hi: "सुपर टॉप-अप न खरीदना", hinglish: "Super top-up na khareedna" }, desc: { en: "₹15L base + ₹25L super top-up costs less than ₹40L base. Super top-up provides excellent value.", hi: "₹15L बेस + ₹25L सुपर टॉप-अप ₹40L बेस से कम खर्चा। सुपर टॉप-अप उत्कृष्ट मूल्य देता है।", hinglish: "₹15L base + ₹25L super top-up costs less than ₹40L base." }, cost: "₹10-25L" },
  { title: { en: "Not reading waiting periods", hi: "वेटिंग पीरियड न पढ़ना", hinglish: "Waiting periods na padhna" }, desc: { en: "PED waiting of 48 months? Disease-specific wait of 24 months? Know before you buy, not at claim time.", hi: "48 महीने का PED वेट? 24 महीने की रोग-विशिष्ट प्रतीक्षा? खरीदने से पहले जानें।", hinglish: "48 months PED wait? 24 months disease-specific wait? Know before buying." }, cost: "Claim rejection" },
  { title: { en: "Missing renewal date", hi: "नवीनीकरण तिथि छूटना", hinglish: "Renewal date miss karna" }, desc: { en: "Lapsed policy = fresh waiting periods + lost NCB. Set reminders 30 days before expiry.", hi: "समाप्त पॉलिसी = नई वेटिंग पीरियड + खोया NCB। समाप्ति से 30 दिन पहले रिमाइंडर सेट करें।", hinglish: "Lapsed policy = fresh waiting periods + lost NCB." }, cost: "Full coverage gap" },
  { title: { en: "Not checking network hospitals", hi: "नेटवर्क अस्पताल न जाँचना", hinglish: "Network hospitals na check karna" }, desc: { en: "If your hospital isn't in-network, you pay full bill upfront. Check before buying.", hi: "यदि आपका अस्पताल नेटवर्क में नहीं है, तो पूरा बिल पहले चुकाएँ। खरीदने से पहले जाँचें।", hinglish: "Agar aapka hospital network mein nahi hai, toh poora bill pehle chukayein." }, cost: "₹2-5L upfront" },
  { title: { en: "Not using an IRDAI-certified advisor", hi: "IRDAI-प्रमाणित सलाहकार का उपयोग न करना", hinglish: "IRDAI-certified advisor na use karna" }, desc: { en: "Free expert advice from 51+ insurers comparison. Advisor is paid by insurer, not you.", hi: "51+ बीमाकर्ताओं की तुलना से मुफ़्त विशेषज्ञ सलाह। सलाहकार को बीमाकर्ता द्वारा भुगतान, आपसे नहीं।", hinglish: "Free expert advice from 51+ insurers comparison. Advisor is paid by insurer, not you." }, cost: "Wrong plan choice" },
];

export default function HealthInsuranceMistakesClientContent() {
  const { language } = useLanguage();
  const lang = language as Language;
  const articleSchema = generateArticleSchema({ title: "Top 10 Health Insurance Mistakes to Avoid in 2026", description: "Avoid these 10 critical health insurance mistakes.", slug: "health-insurance-mistakes", datePublished: "2025-03-01", dateModified: "2026-03-04" });

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <section className="relative py-12 sm:py-20 bg-gradient-to-b from-[#0A1330] to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <Badge className="mb-4 bg-red-500/20 text-red-400 border-red-500/30 rounded-full px-4 py-1"><AlertTriangle className="w-3.5 h-3.5 mr-1" />Health Insurance Guide 2026</Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            <span className="text-red-400">Top 10 Health Insurance</span> <span className="gradient-text">Mistakes to Avoid</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
            {lang === 'hi' ? 'ये 10 गलतियाँ ₹50,000 से ₹5,00,000 तक का नुकसान करा सकती हैं।' : 'These 10 mistakes can cost you ₹50,000 to ₹5,00,000 or more.'}
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="space-y-4">
          {mistakes.map((m, i) => (
            <Card key={i} className="rounded-2xl border-l-4 border-l-red-400 hover:border-l-[#C98A1C] transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center text-red-600 dark:text-red-400 font-bold text-sm shrink-0">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                      <h3 className="font-bold text-foreground text-sm sm:text-base">{pt(m.title, lang)}</h3>
                      <Badge variant="destructive" className="text-xs">{m.cost}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{pt(m.desc, lang)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6"><div className="p-4 bg-muted/50 rounded-2xl border border-border/50"><div className="flex items-start gap-3"><Scale className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" /><p className="text-xs text-muted-foreground leading-relaxed">{irdaiDisclaimer[lang]}</p></div></div></section>
      <AuthorBio />

      <section className="py-16 bg-gradient-to-b from-[#0A1330] to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{lang === 'hi' ? 'इन गलतियों से बचें!' : 'Avoid These Mistakes!'}</h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">{lang === 'hi' ? 'WhatsApp पर मुफ़्त सलाह प्राप्त करें।' : 'Get free personalized advice on WhatsApp.'}</p>
          <a href={getWhatsAppCTA('Hi! I want to avoid health insurance mistakes.')}>
            <ShinyButton className="bg-[#25D366] hover:bg-[#20BD5A] text-white text-lg px-8 py-4"><MessageCircle className="w-5 h-5 mr-2" />Chat on WhatsApp</ShinyButton>
          </a>
        </div>
      </section>
    </div>
  );
}
