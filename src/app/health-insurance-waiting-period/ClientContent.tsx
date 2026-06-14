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
import { Clock, ArrowRight, MessageCircle, Scale, BookOpen, AlertTriangle, CheckCircle2, Shield } from 'lucide-react';

type TEntry = { en: string; hi: string; hinglish: string };
const pt = (obj: TEntry, lang: Language): string => obj[lang] || obj.en;

const pageText = {
  hero: {
    badge: { en: "Health Insurance 2026", hi: "हेल्थ इंश्योरेंस 2026", hinglish: "Health Insurance 2026" },
    title: { en: "Health Insurance Waiting Period", hi: "हेल्थ इंश्योरेंस वेटिंग पीरियड", hinglish: "Health Insurance Waiting Period" },
    subtitle: { en: "Explained", hi: "समझिए", hinglish: "Explained" },
    desc: {
      en: "Waiting period is the time you must wait before certain medical conditions are covered by your health insurance. Understand the 4 types of waiting periods, how they affect your coverage, and which plans have the shortest waiting periods.",
      hi: "वेटिंग पीरियड वह समय है जिसके बाद ही कुछ चिकित्सा स्थितियाँ आपके हेल्थ इंश्योरेंस द्वारा कवर होती हैं। 4 प्रकार के वेटिंग पीरियड, वे आपके कवरेज को कैसे प्रभावित करते हैं, और किन प्लान में सबसे कम वेटिंग पीरियड है।",
      hinglish: "Waiting period woh time hai jiske baad hi kuch medical conditions aapke health insurance dwara cover hoti hain. 4 types ki waiting periods, ye aapke coverage ko kaise affect karte hain, aur kin plans mein sabse kam waiting period hai."
    },
  },
  types: {
    heading: { en: "4 Types of Waiting Periods", hi: "वेटिंग पीरियड के 4 प्रकार", hinglish: "4 Types of Waiting Periods" },
  },
  comparison: {
    heading: { en: "Waiting Period Comparison", hi: "वेटिंग पीरियड तुलना", hinglish: "Waiting Period Comparison" },
  },
  faq: {
    heading: { en: "Waiting Period", hi: "वेटिंग पीरियड", hinglish: "Waiting Period" },
    highlight: { en: "FAQ", hi: "सवाल-जवाब", hinglish: "FAQ" },
  },
  cta: {
    heading: { en: "Need help with waiting periods?", hi: "वेटिंग पीरियड में मदद चाहिए?", hinglish: "Waiting period mein madad chahiye?" },
    desc: {
      en: "Chat with Himanshu Paliwal on WhatsApp — get personalized advice on choosing the right health plan with the shortest waiting periods for your needs.",
      hi: "WhatsApp पर हिमांशु पालीवाल से चैट करें — अपनी ज़रूरतों के लिए सबसे कम वेटिंग पीरियड वाली सही हेल्थ प्लान चुनने में सलाह प्राप्त करें।",
      hinglish: "WhatsApp pe Himanshu Paliwal se chat karein — apni needs ke liye sabse kam waiting period wali sahi health plan chunne mein advice paayein."
    },
    ctaWhatsApp: { en: "Chat on WhatsApp", hi: "WhatsApp पर चैट करें", hinglish: "WhatsApp pe Chat Karein" },
  },
  related: { heading: { en: "Related Articles", hi: "संबंधित लेख", hinglish: "Related Articles" } },
};

const waitTypes = [
  { type: { en: "Initial Waiting Period", hi: "प्रारंभिक वेटिंग पीरियड", hinglish: "Initial Waiting Period" }, period: "30 days", desc: { en: "No claims (except accidents) are accepted in the first 30 days of a new policy. This is standard across all insurers and cannot be waived.", hi: "नई पॉलिसी के पहले 30 दिनों में कोई क्लेम (दुर्घटना को छोड़कर) स्वीकार नहीं किया जाता। यह सभी बीमाकर्ताओं में मानक है।", hinglish: "Nayi policy ke pehle 30 dino mein koi claim (accident ko chodke) accept nahi kiya jata. Ye sabhi insurers mein standard hai." }, icon: Clock, color: "blue" },
  { type: { en: "Pre-Existing Disease (PED)", hi: "पूर्व-मौजूदा बीमारी (PED)", hinglish: "Pre-Existing Disease (PED)" }, period: "24-48 months", desc: { en: "Diseases you already have at the time of buying the policy are covered only after a waiting period of 24-48 months. Diabetes, BP, thyroid are common PEDs.", hi: "पॉलिसी खरीदते समय आपकी पहले से मौजूद बीमारियाँ 24-48 महीने की वेटिंग पीरियड के बाद ही कवर होती हैं। डायबिटीज, BP, थायरॉइड सामान्य PED हैं।", hinglish: "Policy kharidte waqt aapki pehle se maujood bimariyan 24-48 mahine ki waiting period ke baad hi cover hoti hain. Diabetes, BP, thyroid common PED hain." }, icon: AlertTriangle, color: "red" },
  { type: { en: "Disease-Specific Waiting Period", hi: "रोग-विशिष्ट वेटिंग पीरियड", hinglish: "Disease-Specific Waiting Period" }, period: "12-24 months", desc: { en: "Specific diseases like hernia, cataract, piles, sinusitis, and joint replacement have a waiting period of 12-24 months, even if you didn't have them before.", hi: "हर्निया, मोतियाबिंद, बवासीर, साइनसाइटिस और जोइंट रिप्लेसमेंट जैसी विशिष्ट बीमारियों की 12-24 महीने की वेटिंग पीरियड होती है।", hinglish: "Hernia, cataract, piles, sinusitis aur joint replacement jaisi specific bimariyon ki 12-24 mahine ki waiting period hoti hai." }, icon: Shield, color: "amber" },
  { type: { en: "Maternity Waiting Period", hi: "मैटर्निटी वेटिंग पीरियड", hinglish: "Maternity Waiting Period" }, period: "9-36 months", desc: { en: "Maternity and newborn baby coverage has the longest waiting period — typically 9-36 months. Plan ahead if you're considering starting a family.", hi: "मैटर्निटी और नवजात शिशु कवरेज में सबसे लंबी वेटिंग पीरियड होती है — आमतौर पर 9-36 महीने। परिवार शुरू करने की सोच रहे हैं तो पहले से योजना बनाएँ।", hinglish: "Maternity aur navjat shishu coverage mein sabse lambi waiting period hoti hai — usually 9-36 mahine. Parivaar shuru karne ki soch rahe hain toh pehle se plan banayein." }, icon: Clock, color: "green" },
];

const waitComparison = [
  { insurer: 'Acko General Insurance', initial: '30 days', ped: '24 months', disease: '24 months', maternity: 'N/A' },
  { insurer: 'Care Health Insurance', initial: '30 days', ped: '24 months', disease: '24 months', maternity: '24 months' },
  { insurer: 'HDFC ERGO General Insurance', initial: '30 days', ped: '24 months', disease: '24 months', maternity: '36 months' },
  { insurer: 'Star Health & Allied Insurance', initial: '30 days', ped: '36-48 months', disease: '24 months', maternity: '36 months' },
  { insurer: 'Niva Bupa Health Insurance', initial: '30 days', ped: '24 months', disease: '24 months', maternity: '24 months' },
  { insurer: 'ICICI Lombard General Insurance', initial: '30 days', ped: '36 months', disease: '24 months', maternity: '36 months' },
];

const faqs = [
  { q: { en: "What is waiting period in health insurance?", hi: "हेल्थ इंश्योरेंस में वेटिंग पीरियड क्या है?", hinglish: "Health insurance mein waiting period kya hai?" }, a: { en: "Waiting period is the time period during which specific medical conditions or treatments are not covered by your health insurance. After the waiting period ends, those conditions become covered. There are 4 types: initial (30 days), PED (24-48 months), disease-specific (12-24 months), and maternity (9-36 months).", hi: "वेटिंग पीरियड वह समय अवधि है जिसमें विशिष्ट चिकित्सा स्थितियाँ या उपचार आपके हेल्थ इंश्योरेंस द्वारा कवर नहीं होते। वेटिंग पीरियड समाप्त होने के बाद, वे स्थितियाँ कवर होने लगती हैं।", hinglish: "Waiting period woh time period hai jismein specific medical conditions ya treatments aapke health insurance dwara cover nahi hote. Waiting period khatam hone ke baad, woh conditions cover hone lagti hain." } },
  { q: { en: "Can I reduce the waiting period?", hi: "क्या मैं वेटिंग पीरियड कम कर सकता हूँ?", hinglish: "Kya main waiting period kam kar sakta hoon?" }, a: { en: "Some insurers offer a PED Waiting Period Waiver add-on that reduces the PED waiting period from 48 months to 12-24 months for an extra premium. Also, if you port your policy (switch insurers), your previous waiting periods are carried forward as per IRDAI guidelines.", hi: "कुछ बीमाकर्ता PED वेटिंग पीरियड वेवर ऐड-ऑन ऑफर करते हैं जो अतिरिक्त प्रीमियम पर PED वेटिंग पीरियड को 48 महीने से 12-24 महीने तक कम कर देता है।", hinglish: "Kuch insurers PED Waiting Period Waiver add-on offer karte hain jo extra premium pe PED waiting period ko 48 months se 12-24 months tak kam kar dete hai." } },
  { q: { en: "Does waiting period apply to accidents?", hi: "क्या वेटिंग पीरियड दुर्घटनाओं पर लागू होती है?", hinglish: "Kya waiting period accidents pe lagu hoti hai?" }, a: { en: "No, accidental hospitalization is covered from Day 1 — there is no waiting period for emergency treatment due to accidents. This is a standard IRDAI guideline across all health insurance policies.", hi: "नहीं, दुर्घटना के कारण अस्पताल में भर्ता दिन 1 से कवर है — दुर्घटना के कारण आपातकालीन उपचार के लिए कोई वेटिंग पीरियड नहीं है।", hinglish: "Nahi, accidental hospitalization Day 1 se cover hai — accident ke kaaran emergency treatment ke liye koi waiting period nahi hai." } },
  { q: { en: "Which health insurance has the shortest PED waiting period?", hi: "किस हेल्थ इंश्योरेंस में सबसे कम PED वेटिंग पीरियड है?", hinglish: "Kis health insurance mein sabse kam PED waiting period hai?" }, a: { en: "Acko, Care Health, and Niva Bupa offer a 24-month PED waiting period, which is the shortest in the industry. Star Health has 36-48 months. With a PED waiver add-on, some plans can reduce this to 12 months.", hi: "Acko, Care Health और Niva Bupa 24 महीने का PED वेटिंग पीरियड ऑफर करते हैं, जो उद्योग में सबसे कम है। Star Health में 36-48 महीने हैं।", hinglish: "Acko, Care Health aur Niva Bupa 24-month PED waiting period offer karte hain, jo industry mein sabse kam hai. Star Health mein 36-48 months hain." } },
  { q: { en: "What is the waiting period for diabetes and BP?", hi: "डायबिटीज और BP के लिए वेटिंग पीरियड क्या है?", hinglish: "Diabetes aur BP ke liye waiting period kya hai?" }, a: { en: "Diabetes and hypertension (BP) are considered pre-existing diseases. The waiting period is 24-48 months depending on the insurer. Acko, Care Health, and Niva Bupa cover them after 24 months, while Star Health may take up to 48 months.", hi: "डायबिटीज और हाइपरटेंशन (BP) पूर्व-मौजूदा बीमारियाँ मानी जाती हैं। वेटिंग पीरियड 24-48 महीने है। Acko, Care Health और Niva Bupa 24 महीने बाद कवर करते हैं।", hinglish: "Diabetes aur hypertension (BP) pre-existing diseases maani jaati hain. Waiting period 24-48 months hai. Acko, Care Health aur Niva Bupa 24 months baad cover karte hain." } },
];

export default function WaitingPeriodClientContent() {
  const { language } = useLanguage();
  const lang = language as Language;

  const faqSchema = generateFAQSchema(faqs.map(f => ({ q: pt(f.q, lang), a: pt(f.a, lang) })));
  const articleSchema = generateArticleSchema({
    title: "Health Insurance Waiting Period Explained 2026",
    description: "Complete guide to health insurance waiting periods — initial, PED, maternity, and disease-specific.",
    slug: "health-insurance-waiting-period",
    datePublished: "2025-02-01",
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
          <div className="mt-8">
            <a href={getWhatsAppCTA('Hi! I need help with health insurance waiting periods.')}>
              <ShinyButton className="bg-[#25D366] hover:bg-[#20BD5A] text-white">
                <MessageCircle className="w-4 h-4 mr-2" />
                {pt(pageText.cta.ctaWhatsApp, lang)}
              </ShinyButton>
            </a>
          </div>
        </div>
      </section>

      {/* 4 Types */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
          {pt(pageText.types.heading, lang)}
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {waitTypes.map((w, i) => {
            const Icon = w.icon;
            const colorMap: Record<string, string> = { blue: '#3B82F6', red: '#EF4444', amber: '#F59E0B', green: '#22C55E' };
            return (
              <Card key={i} className="rounded-2xl">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: colorMap[w.color] + '15' }}>
                      <Icon className="w-5 h-5" style={{ color: colorMap[w.color] }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm">{pt(w.type, lang)}</h3>
                      <Badge variant="outline" className="text-xs mt-0.5">{w.period}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{pt(w.desc, lang)}</p>
                </CardContent>
              </Card>
            );
          })}
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
                <th className="text-left p-3 font-semibold">Insurer</th>
                <th className="text-left p-3 font-semibold">Initial</th>
                <th className="text-left p-3 font-semibold">PED</th>
                <th className="text-left p-3 font-semibold">Disease-Specific</th>
                <th className="text-left p-3 font-semibold">Maternity</th>
              </tr>
            </thead>
            <tbody>
              {waitComparison.map((row, i) => (
                <tr key={i} className="border-t border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{row.insurer}</td>
                  <td className="p-3">{row.initial}</td>
                  <td className="p-3">
                    <Badge variant={row.ped === '24 months' ? 'default' : 'destructive'} className="text-xs">
                      {row.ped}
                    </Badge>
                  </td>
                  <td className="p-3">{row.disease}</td>
                  <td className="p-3">{row.maternity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Paliwal Ratings */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
          Paliwal Secure Rating™ — <span className="gradient-text">Shortest Wait Leaders</span>
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
          {(relatedArticlesMap['health'] || []).map((link) => (
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
            {pt(pageText.cta.heading, lang)}
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">{pt(pageText.cta.desc, lang)}</p>
          <a href={getWhatsAppCTA('Hi! I need help with health insurance waiting periods.')}>
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
