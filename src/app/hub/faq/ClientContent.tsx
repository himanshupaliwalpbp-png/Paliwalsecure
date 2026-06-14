'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n';
import type { Language } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';
import { FAQSection } from '@/components/geo/FAQSection';
import {
  HelpCircle, Heart, Car, ShieldCheck, IndianRupee,
  ArrowRight, MessageCircle, ChevronRight, Scale, FileText,
  Users, Clock, Zap, TrendingUp, BookOpen,
} from 'lucide-react';

type TEntry = { en: string; hi: string; hinglish: string };
const pt = (obj: TEntry, lang: Language): string => obj[lang] || obj.en;

const pageText = {
  hero: {
    badge: { en: "50+ Questions Answered", hi: "50+ सवालों के जवाब", hinglish: "50+ Questions Answered" },
    title1: { en: "Insurance FAQ Hub", hi: "बीमा सवाल-जवाब हब", hinglish: "Insurance FAQ Hub" },
    title2: { en: "50+ Most Asked Questions Answered", hi: "50+ सबसे अधिक पूछे जाने वाले सवालों के जवाब", hinglish: "50+ Most Asked Questions Answered" },
    desc: { en: "IRDAI-compliant answers to the most frequently asked questions about health, motor, life, claims, tax, and regulation in India.", hi: "भारत में स्वास्थ्य, मोटर, जीवन, क्लेम, कर और विनियमन के बारे में सबसे अक्सर पूछे जाने वाले सवालों के IRDAI-अनुपालित जवाब।", hinglish: "Health, motor, life, claims, tax, aur regulation ke baare mein sabse frequently puche jaane wale sawaalon ke IRDAI-compliant jawaab." },
    ctaWhatsApp: { en: "💬 Ask Your Question", hi: "💬 अपना सवाल पूछें", hinglish: "💬 Apna Sawaal Poochiye" },
    ctaFullPage: { en: "Full FAQ Page (50+) →", hi: "पूर्ण FAQ पृष्ठ (50+) →", hinglish: "Full FAQ Page (50+) →" },
  },
  browse: {
    heading: { en: "Browse by Category", hi: "श्रेणी के अनुसार ब्राउज़ करें", hinglish: "Browse by Category" },
    desc: { en: "Select a category to find answers to your insurance questions.", hi: "अपने बीमा सवालों के जवाब खोजने के लिए एक श्रेणी चुनें।", hinglish: "Apne insurance sawaalon ke jawaab dhoondhne ke liye ek category choose karein." },
    viewAll: { en: "View All", hi: "सभी देखें", hinglish: "View All" },
  },
  whenToBuy: {
    heading: { en: "When Should You Buy Insurance?", hi: "आपको बीमा कब खरीदना चाहिए?", hinglish: "Insurance Kab Khareedna Chahiye?" },
    desc: { en: "Insurance is cheapest when you're young and healthy. Here's the ideal buying timeline.", hi: "जब आप युवा और स्वस्थ होते हैं तब बीमा सबसे सस्ता होता है। यहाँ आदर्श खरीद समयरेखा है।", hinglish: "Insurance sabse sasta hota hai jab aap young aur healthy hote hain. Yahan ideal buying timeline hai." },
    thType: { en: "Insurance Type", hi: "बीमा प्रकार", hinglish: "Insurance Type" },
    thAge: { en: "Ideal Age to Buy", hi: "खरीदने की आदर्श आयु", hinglish: "Ideal Age to Buy" },
    thWhy: { en: "Why Early?", hi: "जल्दी क्यों?", hinglish: "Why Early?" },
    thDelay: { en: "Cost of Delay", hi: "देरी की लागत", hinglish: "Cost of Delay" },
  },
  general: {
    heading: { en: "General Insurance FAQ", hi: "सामान्य बीमा सवाल-जवाब", hinglish: "General Insurance FAQ" },
    desc: { en: "Common questions about buying, renewing, and managing insurance in India.", hi: "भारत में बीमा खरीदने, नवीनीकरण और प्रबंधन के बारे में सामान्य सवाल।", hinglish: "Insurance khareedne, renewal, aur management ke baare mein common sawaal." },
  },
  cta: {
    heading: { en: "Still Have Insurance Questions?", hi: "अभी भी बीमा सवाल हैं?", hinglish: "Abhi Bhi Insurance Sawaal Hain?" },
    desc: { en: "Get personalized answers from IRDAI-certified advisor Himanshu Paliwal (POSP Code: IP429834). Free consultation on WhatsApp — no spam, no pressure.", hi: "IRDAI-प्रमाणित सलाहकार हिमांशु पालीवाल से व्यक्तिगत जवाब प्राप्त करें। WhatsApp पर मुफ़्त परामर्श — कोई स्पैम नहीं।", hinglish: "IRDAI-certified advisor Himanshu Paliwal se personalized jawaab paayein. WhatsApp pe free consultation — no spam, no pressure." },
    ctaWhatsApp: { en: "💬 Ask on WhatsApp", hi: "💬 WhatsApp पर पूछें", hinglish: "💬 WhatsApp pe Poochiye" },
    ctaFullPage: { en: "Full FAQ Page (50+) →", hi: "पूर्ण FAQ पृष्ठ (50+) →", hinglish: "Full FAQ Page (50+) →" },
  },
};

const faqCategories = [
  {
    title: pt({ en: "Health Insurance", hi: "हेल्थ इंश्योरेंस", hinglish: "Health Insurance" }, 'en'),
    titleKey: { en: "Health Insurance", hi: "हेल्थ इंश्योरेंस", hinglish: "Health Insurance" },
    icon: Heart, color: 'text-rose-600', count: 12,
    descriptionKey: { en: "Premiums, waiting period, cashless, PED, copay, and more", hi: "प्रीमियम, प्रतीक्षा अवधि, कैशलेस, PED, कोपे और अधिक", hinglish: "Premiums, waiting period, cashless, PED, copay, aur more" },
    topFaqs: [
      { question: 'How much health insurance do I need?', answer: 'IRDAI recommends minimum ₹5 Lakh. For metro cities, aim for ₹10-25 Lakh. Rule of thumb: coverage should be at least 50% of your annual income.' },
      { question: 'What is the waiting period in health insurance?', answer: 'Initial waiting period: 30 days. Pre-existing disease (PED): 1-4 years (IRDAI caps at max 3 years). Specific diseases (cataract, hernia): 1-2 years.' },
      { question: 'Can I get health insurance with pre-existing diseases?', answer: 'Yes. Most insurers cover PEDs after a waiting period of 1-4 years. IRDAI has capped the maximum PED waiting period at 3 years. Always declare your conditions honestly.' },
      { question: 'What is cashless hospitalization?', answer: 'Cashless means the insurer pays the hospital directly — you don\'t pay upfront. IRDAI mandates 1-hour approval for emergency cashless and 3-hour discharge authorization.' },
    ],
  },
  {
    titleKey: { en: "Motor Insurance", hi: "मोटर इंश्योरेंस", hinglish: "Motor Insurance" },
    icon: Car, color: 'text-sky-600', count: 12,
    descriptionKey: { en: "Car, bike, EV insurance — TP, OD, IDV, NCB, add-ons", hi: "कार, बाइक, EV बीमा — TP, OD, IDV, NCB, ऐड-ऑन", hinglish: "Car, bike, EV insurance — TP, OD, IDV, NCB, add-ons" },
    topFaqs: [
      { question: 'Is car insurance mandatory in India?', answer: 'Yes, at minimum Third-Party (TP) insurance is mandatory under the Motor Vehicles Act. Driving without it attracts a fine of ₹2,000 and/or imprisonment up to 3 months.' },
      { question: 'What is the difference between TP and Comprehensive insurance?', answer: 'TP covers damage/injury to others — mandatory, cheaper, limited. Comprehensive = TP + damage to your own vehicle. Always prefer comprehensive for expensive vehicles.' },
      { question: 'What is Zero Depreciation cover?', answer: 'Zero Dep means the insurer pays full cost of parts replacement without deducting depreciation. Available for vehicles up to 5-7 years. Must-have for new cars.' },
      { question: 'What is NCB in car insurance?', answer: 'No Claim Bonus (NCB) is a discount on OD premium for claim-free years: 20% after 1 year, up to 50% after 5+ years. NCB belongs to you, not the vehicle.' },
    ],
  },
  {
    titleKey: { en: "Life Insurance", hi: "लाइफ इंश्योरेंस", hinglish: "Life Insurance" },
    icon: ShieldCheck, color: 'text-emerald-600', count: 10,
    descriptionKey: { en: "Term insurance, endowment, ULIP, riders, claims", hi: "टर्म इंश्योरेंस, एंडोमेंट, ULIP, राइडर, क्लेम", hinglish: "Term insurance, endowment, ULIP, riders, claims" },
    topFaqs: [
      { question: 'How much life insurance coverage do I need?', answer: 'Financial experts recommend 10-15 times your annual income. If you earn ₹10 Lakh/year, aim for ₹1-1.5 crore. Also factor in outstanding loans and children\'s education.' },
      { question: 'Should I buy term insurance or endowment plans?', answer: 'Buy term insurance for pure protection — ₹1 crore cover for ₹800/month. Endowment gives only ₹1 crore for ₹15,000+/month with 4-6% returns.' },
      { question: 'Is the life insurance claim amount taxable?', answer: 'Life insurance death claims are tax-free under Section 10(10D) if premium doesn\'t exceed 10% of sum assured. Maturity proceeds are also tax-free under the same conditions.' },
      { question: 'What are riders in life insurance?', answer: 'Riders are optional add-ons: Critical Illness (lump sum on diagnosis), Accidental Death Benefit (extra payout), Waiver of Premium. Riders cost ₹200-2,000/year extra.' },
    ],
  },
  {
    titleKey: { en: "Insurance Claims", hi: "बीमा क्लेम", hinglish: "Insurance Claims" },
    icon: FileText, color: 'text-amber-600', count: 10,
    descriptionKey: { en: "Cashless, reimbursement, documents, timelines, rejection", hi: "कैशलेस, प्रतिपूर्ति, दस्तावेज़, समय-सीमा, अस्वीकृति", hinglish: "Cashless, reimbursement, documents, timelines, rejection" },
    topFaqs: [
      { question: 'How do I file a health insurance claim?', answer: 'Cashless: Inform insurer within 24-48 hours → Show health card at network hospital → Get treated → Insurer pays directly. Reimbursement: Pay hospital → Collect bills → Submit claim form within 30 days → Get reimbursed in 7-30 days.' },
      { question: 'Why do insurance claims get rejected?', answer: 'Top 5 reasons: (1) Non-disclosure of pre-existing diseases, (2) Claims during waiting period, (3) Policy lapsed, (4) Treatment not covered, (5) Incomplete documentation.' },
      { question: 'How long does claim settlement take?', answer: 'IRDAI mandates: Cashless health — 1-2 hours for approval, 7 days for settlement. Reimbursement — within 30 days. Motor claims — within 30 days of surveyor report.' },
      { question: 'Can I appeal a claim rejection?', answer: 'Yes. Steps: (1) Write to insurer\'s grievance cell, (2) Approach IRDAI Bima Bharosa, (3) File complaint with Insurance Ombudsman (free), (4) Consumer forum as last resort.' },
    ],
  },
  {
    titleKey: { en: "Tax Benefits", hi: "कर लाभ", hinglish: "Tax Benefits" },
    icon: IndianRupee, color: 'text-green-600', count: 6,
    descriptionKey: { en: "Section 80D, 80C, 80EEB — tax savings on insurance", hi: "धारा 80D, 80C, 80EEB — बीमे पर कर बचत", hinglish: "Section 80D, 80C, 80EEB — insurance pe tax savings" },
    topFaqs: [
      { question: 'What tax benefits do I get on health insurance?', answer: 'Section 80D: ₹25,000 for self/family premium (₹50,000 for senior citizens). Additional ₹25,000 for parents\' premium (₹50,000 if parents are senior citizens). Maximum total deduction: ₹75,000/year.' },
      { question: 'Is EV insurance eligible for tax deduction?', answer: 'Yes! Under Section 80EEB, you can claim deduction up to ₹1,50,000 on interest paid on loan for EV purchase. This includes EV insurance premium as part of the loan cost.' },
      { question: 'What is the tax benefit on life insurance premium?', answer: 'Section 80C: Life insurance premium up to ₹1,50,000/year is deductible. Death claims are tax-free under Section 10(10D) if premium doesn\'t exceed 10% of sum assured.' },
    ],
  },
  {
    titleKey: { en: "IRDAI & Regulation", hi: "IRDAI और विनियमन", hinglish: "IRDAI & Regulation" },
    icon: Scale, color: 'text-violet-600', count: 6,
    descriptionKey: { en: "IRDAI rules, policyholder rights, Ombudsman, regulations", hi: "IRDAI नियम, पॉलिसीधारक अधिकार, लोकपाल, विनियमन", hinglish: "IRDAI rules, policyholder rights, Ombudsman, regulations" },
    topFaqs: [
      { question: 'What is IRDAI and how does it protect policyholders?', answer: 'IRDAI is the insurance regulator in India. It protects you by: Setting solvency ratio requirements, mandating grievance redressal, regulating TP motor insurance rates, running the Insurance Ombudsman scheme.' },
      { question: 'What is the Insurance Ombudsman?', answer: 'A free, independent dispute resolution body created by IRDAI. File online at ciio.co.in. Resolution within 3 months. No lawyer needed. There are 17 Ombudsman offices across India.' },
      { question: 'What are my rights as a policyholder in 2025?', answer: 'Key rights: (1) No age limit for health insurance, (2) 1-hour cashless approval, (3) 30-day free-look period, (4) Lifelong renewability, (5) Portability within 30 days, (6) Interest on delayed claims, (7) Max 3-year PED waiting period.' },
    ],
  },
];

const generalFaqs = [
  { question: 'Should I buy insurance online or through an agent?', answer: 'Both work. Online is 10-15% cheaper (no agent commission) and gives instant policy. Through an IRDAI-certified advisor (like Paliwal Secure, POSP IP429834), you get personalized comparison, claim assistance, and ongoing support.' },
  { question: 'How often should I review my insurance coverage?', answer: 'Review annually at renewal. Key triggers: salary increase (upgrade cover), new family member (add to floater), vehicle purchase (new policy), loan taken (increase life cover), health diagnosis (review waiting periods).' },
  { question: 'What is the difference between insurance agent and broker?', answer: 'An agent represents ONE insurer and can sell only that company\'s policies. A broker represents YOU and can compare policies from multiple insurers. For better comparison and unbiased advice, prefer an IRDAI-licensed advisor.' },
  { question: 'Can I have multiple health insurance policies?', answer: 'Yes, you can have multiple policies. In case of a claim, you can choose to claim from one or split across insurers. The total claim cannot exceed the actual bill amount.' },
];

export default function ClientContent() {
  const { language } = useLanguage();
  const totalFaqs = faqCategories.reduce((sum, cat) => sum + cat.count, 0) + generalFaqs.length;

  return (
    <div className="min-h-screen">
      <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-primary/10 overflow-hidden">
        <div className="orb-1 absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="orb-2 absolute bottom-10 right-20 w-48 h-48 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-primary">{pt({ en: "Home", hi: "होम", hinglish: "Home" }, language)}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">{pt(pageText.hero.title1, language)}</span>
          </nav>
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20"><HelpCircle className="h-3.5 w-3.5 mr-1" />{totalFaqs}+ {pt({ en: "Questions Answered", hi: "सवालों के जवाब", hinglish: "Questions Answered" }, language)}</Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">{pt(pageText.hero.title1, language)}{' '}<span className="gradient-text">{pt(pageText.hero.title2, language)}</span></h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">{pt(pageText.hero.desc, language)}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { icon: HelpCircle, label: pt({ en: "Total FAQs", hi: "कुल FAQ", hinglish: "Total FAQs" }, language), value: `${totalFaqs}+` },
                { icon: BookOpen, label: pt({ en: "Categories", hi: "श्रेणियाँ", hinglish: "Categories" }, language), value: `${faqCategories.length}` },
                { icon: Users, label: pt({ en: "Families Helped", hi: "परिवार मदद", hinglish: "Families Helped" }, language), value: '500+' },
                { icon: ShieldCheck, label: pt({ en: "IRDAI Certified", hi: "IRDAI प्रमाणित", hinglish: "IRDAI Certified" }, language), value: 'POSP IP429834' },
              ].map((stat, i) => (<Card key={i} className="glass-card bg-background/80"><CardContent className="p-3 text-center"><stat.icon className="h-5 w-5 text-primary mx-auto mb-1" /><p className="text-xs text-muted-foreground">{stat.label}</p><p className="text-sm font-bold">{stat.value}</p></CardContent></Card>))}
            </div>
            <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer"><ShinyButton variant="blue"><span>{pt(pageText.hero.ctaWhatsApp, language)}</span></ShinyButton></a>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Category Navigation */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><BookOpen className="h-6 w-6 text-primary" /><span className="gradient-text">{pt(pageText.browse.heading, language)}</span></h2>
          <p className="text-muted-foreground mb-6">{pt(pageText.browse.desc, language)}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {faqCategories.map((cat, i) => (
              <Link key={i} href={`#faq-${pt(cat.titleKey, language).toLowerCase().replace(/\s+/g, '-')}`}>
                <Card className="hover:translate-y-[-2px] hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer h-full">
                  <CardContent className="p-3 text-center">
                    <cat.icon className={`h-6 w-6 ${cat.color} mx-auto mb-2`} />
                    <p className="text-sm font-semibold">{pt(cat.titleKey, language)}</p>
                    <Badge variant="secondary" className="mt-1 text-[10px]">{cat.count} {pt(pageText.browse.viewAll, language)}</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* FAQ Sections by Category */}
        {faqCategories.map((category, catIdx) => (
          <section key={catIdx} id={`faq-${pt(category.titleKey, language).toLowerCase().replace(/\s+/g, '-')}`} className="scroll-mt-20">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><category.icon className={`h-6 w-6 ${category.color}`} /><span className="gradient-text">{pt(category.titleKey, language)} FAQ</span></h2>
            <p className="text-muted-foreground mb-6">{pt(category.descriptionKey, language)}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {category.topFaqs.map((faq, i) => (
                <Card key={i} className="glass-card hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300 h-full">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2 mb-2"><span className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">Q</span><h3 className="font-semibold text-sm">{faq.question}</h3></div>
                    <p className="text-xs text-muted-foreground leading-relaxed pl-8">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-4"><Link href={`/insurance-faq`}><ShinyButton variant="secondary"><span>{pt(pageText.browse.viewAll, language)} {pt(category.titleKey, language)} FAQs ({category.count}+)</span></ShinyButton></Link></div>
          </section>
        ))}

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* General FAQ */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><TrendingUp className="h-6 w-6 text-primary" /><span className="gradient-text">{pt(pageText.general.heading, language)}</span></h2>
          <p className="text-muted-foreground mb-6">{pt(pageText.general.desc, language)}</p>
          <FAQSection faqs={generalFaqs} title={pt(pageText.general.heading, language)} />
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* When to Buy */}
        <section>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Clock className="h-6 w-6 text-primary" /><span className="gradient-text">{pt(pageText.whenToBuy.heading, language)}</span></h2>
          <p className="text-muted-foreground mb-6">{pt(pageText.whenToBuy.desc, language)}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead><tr className="border-b"><th className="text-left p-3 font-semibold">{pt(pageText.whenToBuy.thType, language)}</th><th className="text-center p-3 font-semibold">{pt(pageText.whenToBuy.thAge, language)}</th><th className="text-center p-3 font-semibold">{pt(pageText.whenToBuy.thWhy, language)}</th><th className="text-center p-3 font-semibold">{pt(pageText.whenToBuy.thDelay, language)}</th></tr></thead>
              <tbody>{[
                { type: pt({ en: "Health Insurance", hi: "हेल्थ इंश्योरेंस", hinglish: "Health Insurance" }, language), age: '25-30', why: pt({ en: "Lower premium, no PED", hi: "कम प्रीमियम, कोई PED नहीं", hinglish: "Lower premium, no PED" }, language), delay: pt({ en: "Premium doubles every 10 years", hi: "प्रीमियम हर 10 वर्ष में दोगुना", hinglish: "Premium doubles every 10 years" }, language) },
                { type: pt({ en: "Term Insurance", hi: "टर्म इंश्योरेंस", hinglish: "Term Insurance" }, language), age: '25-30', why: pt({ en: "Lowest premium for life", hi: "जीवन के लिए सबसे कम प्रीमियम", hinglish: "Lowest premium for life" }, language), delay: pt({ en: "₹1Cr: ₹700/mo at 25 vs ₹2,500/mo at 45", hi: "₹1Cr: 25 पर ₹700/माह vs 45 पर ₹2,500/माह", hinglish: "₹1Cr: ₹700/mo at 25 vs ₹2,500/mo at 45" }, language) },
                { type: pt({ en: "Car Insurance", hi: "कार बीमा", hinglish: "Car Insurance" }, language), age: pt({ en: "At vehicle purchase", hi: "वाहन खरीद पर", hinglish: "At vehicle purchase" }, language), why: pt({ en: "Mandatory, protects new asset", hi: "अनिवार्य, नई संपत्ति की रक्षा", hinglish: "Mandatory, protects new asset" }, language), delay: pt({ en: "Driving without TP is illegal (₹2,000 fine)", hi: "TP के बिना गाड़ी चलाना अवैध (₹2,000 जुर्माना)", hinglish: "Driving without TP illegal (₹2,000 fine)" }, language) },
                { type: pt({ en: "Critical Illness", hi: "गंभीर बीमारी", hinglish: "Critical Illness" }, language), age: '30-35', why: pt({ en: "Lower premium, fewer exclusions", hi: "कम प्रीमियम, कम अपवर्जन", hinglish: "Lower premium, fewer exclusions" }, language), delay: pt({ en: "Premium rises 30-50% after age 40", hi: "40 वर्ष के बाद प्रीमियम 30-50% बढ़ता है", hinglish: "Premium rises 30-50% after age 40" }, language) },
                { type: pt({ en: "Super Top-up", hi: "सुपर टॉप-अप", hinglish: "Super Top-up" }, language), age: '30-35', why: pt({ en: "Cheap additional coverage", hi: "सस्ती अतिरिक्त कवरेज", hinglish: "Cheap additional coverage" }, language), delay: pt({ en: "₹15L top-up costs just ₹3,000/yr at 30", hi: "₹15L टॉप-अप 30 पर सिर्फ ₹3,000/वर्ष", hinglish: "₹15L top-up costs just ₹3,000/yr at 30" }, language) },
              ].map((row, i) => (<tr key={i} className={i % 2 === 0 ? 'bg-muted/30' : ''}><td className="p-3 font-medium">{row.type}</td><td className="p-3 text-center font-semibold">{row.age}</td><td className="p-3 text-center text-muted-foreground">{row.why}</td><td className="p-3 text-center text-amber-700 dark:text-amber-400">{row.delay}</td></tr>))}</tbody>
            </table>
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* CTA */}
        <section className="text-center py-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl">
          <h2 className="text-2xl font-bold mb-3 gradient-text">{pt(pageText.cta.heading, language)}</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">{pt(pageText.cta.desc, language)}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer"><ShinyButton variant="blue"><span>{pt(pageText.cta.ctaWhatsApp, language)}</span></ShinyButton></a>
            <Link href="/insurance-faq"><ShinyButton variant="secondary"><span>{pt(pageText.cta.ctaFullPage, language)}</span></ShinyButton></Link>
          </div>
        </section>
      </div>
    </div>
  );
}
