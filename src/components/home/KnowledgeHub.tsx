'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Heart, Car, ArrowRight, BookOpen, Shield, TrendingUp, CheckCircle2, Languages } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

/* ── Article data with full content ────────────────────────────────────── */
interface ArticleData {
  articleKey: string;
  icon: React.ReactNode;
  slug: string;
  titles: { en: string; hi: string; hg: string };
  categories: { en: string; hi: string; hg: string };
  readTimes: { en: string; hi: string; hg: string };
  keyPoints: { en: string[]; hi: string[]; hg: string[] };
  summaries: { en: string; hi: string; hg: string };
}

const articles: ArticleData[] = [
  {
    articleKey: 'article1',
    icon: <Shield className="w-5 h-5" />,
    slug: 'term-insurance-guide-india',
    titles: {
      en: 'Term vs Whole Life — explained in 3 min',
      hi: 'Term vs Whole Life — 3 minute mein samjhein',
      hg: 'Term vs Whole Life — 3 minute mein samjhein',
    },
    categories: {
      en: 'Insurance Guide',
      hi: 'बीमा गाइड',
      hg: 'Insurance Guide',
    },
    readTimes: {
      en: '3 min read',
      hi: '3 मिनट पढ़ें',
      hg: '3 min read',
    },
    keyPoints: {
      en: [
        'Term insurance = pure protection, no returns, lowest premium',
        'Whole life = insurance + savings, much higher premium',
        'Term plan ₹1Cr cover costs ~₹800/month; Whole life costs ₹5,000+/month',
        'Best strategy: Term Plan + Mutual Fund SIP separately',
        'Claim Settlement Ratio matters more than returns',
      ],
      hi: [
        'Term insurance = सिर्फ सुरक्षा, कोई रिटर्न नहीं, सबसे कम प्रीमियम',
        'Whole life = बीमा + बचत, बहुत ज्यादा प्रीमियम',
        'Term plan ₹1Cr कवर ~₹800/महीने; Whole life ₹5,000+/महीने',
        'बेस्ट रणनीति: Term Plan + Mutual Fund SIP अलग से',
        'Claim Settlement Ratio रिटर्न से ज्यादा मायने रखता है',
      ],
      hg: [
        'Term insurance = sirf protection, koi returns nahi, sabse kam premium',
        'Whole life = insurance + savings, bahut zyada premium',
        'Term plan ₹1Cr cover ~₹800/month; Whole life ₹5,000+/month',
        'Best strategy: Term Plan + Mutual Fund SIP alag se',
        'Claim Settlement Ratio returns se zyada matter karta hai',
      ],
    },
    summaries: {
      en: 'Term insurance gives you maximum life cover at minimum cost. Whole life mixes insurance with savings but charges 5-10x more. Our recommendation: Buy term for protection, invest the difference in mutual funds.',
      hi: 'Term insurance आपको कम से कम लागत पर अधिकतम जीवन कवर देता है। Whole life बीमा को बचत के साथ मिलाता है लेकिन 5-10 गुना ज्यादा चार्ज करता है। हमारी सलाह: सुरक्षा के लिए Term खरीदें, बाकी mutual fund में invest करें।',
      hg: 'Term insurance aapko minimum cost pe maximum life cover deta hai. Whole life insurance + savings mix karta hai lekin 5-10x zyada charge karta hai. Humari recommendation: Protection ke liye Term buy karo, baaki mutual fund mein invest karo.',
    },
  },
  {
    articleKey: 'article2',
    icon: <Heart className="w-5 h-5" />,
    slug: 'family-health-insurance-guide',
    titles: {
      en: 'How much health cover does a Jaipur family of 4 actually need?',
      hi: 'जयपुर के 4-सदस्य परिवार को कितना हेल्थ कवर चाहिए?',
      hg: 'Jaipur ke 4-member parivaar ko kitna health cover chahiye?',
    },
    categories: {
      en: 'Health Insurance',
      hi: 'हेल्थ इंश्योरेंस',
      hg: 'Health Insurance',
    },
    readTimes: {
      en: '5 min read',
      hi: '5 मिनट पढ़ें',
      hg: '5 min read',
    },
    keyPoints: {
      en: [
        '₹10-15 Lakh family floater is minimum for Jaipur family of 4',
        'Private hospital room rent in Jaipur: ₹3,000-₹8,000/day',
        'Super Top-Up can add ₹1 Crore cover for just ₹3,000/year',
        'Room rent capping is critical — choose no-limit or waiver plans',
        'Include parents separately — floater gets exhausted quickly',
      ],
      hi: [
        '₹10-15 लाख फैमिली फ्लोटर जयपुर के 4-सदस्य परिवार के लिए न्यूनतम है',
        'जयपुर में प्राइवेट हॉस्पिटल रूम रेंट: ₹3,000-₹8,000/दिन',
        'सुपर टॉप-अप सिर्फ ₹3,000/साल में ₹1 करोड़ कवर जोड़ सकता है',
        'रूम रेंट कैपिंग बहुक जरूरी — नो-लिमिट या वेवर प्लान चुनें',
        'माता-पिता को अलग शामिल करें — फ्लोटर जल्दी खत्म हो जाता है',
      ],
      hg: [
        '₹10-15 Lakh family floater minimum hai Jaipur ke 4-member family ke liye',
        'Private hospital room rent Jaipur mein: ₹3,000-₹8,000/day',
        'Super Top-Up sirf ₹3,000/year mein ₹1 Crore cover add kar sakta hai',
        'Room rent capping critical hai — no-limit ya waiver plan choose karo',
        'Parents ko alag include karo — floater jaldi exhaust ho jata hai',
      ],
    },
    summaries: {
      en: 'For a Jaipur family of 4, we recommend ₹10-15 Lakh base family floater + ₹1 Crore Super Top-Up. Room rent waiver is essential since private hospitals charge ₹3,000-₹8,000/day. Total cost: ₹8,000-₹15,000/year.',
      hi: 'जयपुर के 4-सदस्य परिवार के लिए, हम ₹10-15 लाख बेस फैमिली फ्लोटर + ₹1 करोड़ सुपर टॉप-अप की सलाह देते हैं। कुल लागत: ₹8,000-₹15,000/साल।',
      hg: 'Jaipur ke 4-member family ke liye, hum ₹10-15 Lakh base family floater + ₹1 Crore Super Top-Up recommend karte hain. Total cost: ₹8,000-₹15,000/year.',
    },
  },
  {
    articleKey: 'article3',
    icon: <Car className="w-5 h-5" />,
    slug: 'insurance-claim-rejection-reasons',
    titles: {
      en: 'Motor insurance claim rejected? Do this.',
      hi: 'मोटर इंश्योरेंस क्लेम रिजेक्ट हो गया? ये करें।',
      hg: 'Motor insurance claim reject ho gaya? Ye karein.',
    },
    categories: {
      en: 'Claims Help',
      hi: 'क्लेम सहायता',
      hg: 'Claims Help',
    },
    readTimes: {
      en: '4 min read',
      hi: '4 मिनट पढ़ें',
      hg: '4 min read',
    },
    keyPoints: {
      en: [
        'Most common reason: Not informing insurer within 48-72 hours',
        'Driving without valid license = automatic claim rejection',
        'Intoxicated driving claims are always rejected',
        'Consequential damage (driving with existing damage) is not covered',
        'File appeal with insurer first, then IRDAI Grievance Cell',
      ],
      hi: [
        'सबसे आम वजह: 48-72 घंटे के अंदर इंश्योरर को सूचित नहीं करना',
        'बिना वैलिड लाइसेंस चलाना = ऑटोमैटिक क्लेम रिजेक्शन',
        'नशे में ड्राइविंग के क्लेम हमेशा रिजेक्ट होते हैं',
        'पहले से मौजूद नुकसान (consequential damage) कवर नहीं होता',
        'पहले इंश्योरर के पास अपील करें, फिर IRDAI शिकायत सेल में',
      ],
      hg: [
        'Most common reason: 48-72 ghante ke andar insurer ko inform nahi karna',
        'Bina valid license chalana = automatic claim rejection',
        'Nashe mein driving ke claims hamesha reject hote hain',
        'Pehle se existing damage (consequential damage) cover nahi hota',
        'Pehle insurer ke paas appeal karo, phir IRDAI grievance cell mein',
      ],
    },
    summaries: {
      en: 'Don\'t panic if your motor insurance claim is rejected. First, get the rejection reason in writing. Then file an appeal with the insurer within 15 days. If still unresolved, approach IRDAI Grievance Cell — they resolve 90%+ cases in favor of policyholders.',
      hi: 'अगर आपका मोटर इंश्योरेंस क्लेम रिजेक्ट हो गया है तो घबराएं नहीं। पहले रिजेक्शन की वजह लिखित में लें। फिर 15 दिन में इंश्योरर के पास अपील करें। अगर अभी भी समाधान नहीं हुआ तो IRDAI शिकायत सेल से संपर्क करें।',
      hg: 'Agar aapka motor insurance claim reject ho gaya hai toh ghabrayein nahi. Pehle rejection reason writing mein lein. Phir 15 din mein insurer ke paas appeal karein. Agar abhi bhi resolve nahi hua toh IRDAI Grievance Cell se contact karein — woh 90%+ cases policyholder ke favour mein solve karte hain.',
    },
  },
];

/* ── Helper to get trilingual string ───────────────────────────────────── */
function tr(data: { en: string; hi: string; hg: string }, isHindi: boolean, isEnglish: boolean) {
  return isHindi ? data.hi : isEnglish ? data.en : data.hg;
}

/* ── Article Card with full content ─────────────────────────────────────── */
function ArticleCard({
  article,
  isHindi,
  isEnglish,
  index,
}: {
  article: ArticleData;
  isHindi: boolean;
  isEnglish: boolean;
  index: number;
}) {
  const category = tr(article.categories, isHindi, isEnglish);
  const title = tr(article.titles, isHindi, isEnglish);
  const readTime = tr(article.readTimes, isHindi, isEnglish);
  const summary = tr(article.summaries, isHindi, isEnglish);
  const keyPoints = isHindi ? article.keyPoints.hi : isEnglish ? article.keyPoints.en : article.keyPoints.hg;
  const readGuide = isHindi ? 'गाइड पढ़ें →' : isEnglish ? 'Read guide →' : 'Guide padhein →';
  const keyTakeawayLabel = isHindi ? 'मुख्य बातें' : isEnglish ? 'Key Takeaways' : 'Key Takeaways';
  const readHindiLabel = isHindi ? 'हिंदी में पढ़ें' : isEnglish ? 'Read in Hindi' : 'Hindi mein padhein';

  return (
    <motion.a
      href={`/blog/${article.slug}`}
      className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden relative p-6 sm:p-7 flex flex-col h-full group cursor-pointer block transition-all duration-500 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_12px_48px_-12px_rgba(var(--primary),0.08)]"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Category tag + icon + "Read in Hindi" badge */}
      <div className="flex items-center gap-2.5 mb-4 flex-wrap">
        <span
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/[0.07] border border-primary/[0.10] text-primary transition-transform duration-300 group-hover:scale-105"
        >
          {article.icon}
        </span>
        <span
          className="text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full text-muted-foreground bg-muted/40 border border-border/50"
        >
          {category}
        </span>
        {/* "Read in Hindi" badge */}
        <span className="text-xs font-mono text-[var(--trust)] ml-auto flex items-center gap-1">
          <Languages className="w-3 h-3" />
          {readHindiLabel}
        </span>
      </div>

      {/* Title */}
      <h3
        className="font-heading text-sm sm:text-base lg:text-lg font-bold text-foreground leading-snug mb-2.5 tracking-tight"
      >
        {title}
      </h3>

      {/* Summary */}
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
        {summary}
      </p>

      {/* Key Takeaways */}
      <div className="space-y-2 mb-5 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
          <TrendingUp className="w-3 h-3" />
          {keyTakeawayLabel}
        </p>
        {keyPoints.slice(0, 3).map((point, i) => (
          <div key={i} className="flex items-start gap-2">
            <CheckCircle2 className="w-3 h-3 text-primary/70 shrink-0 mt-0.5" />
            <span className="text-[11px] text-muted-foreground leading-snug">{point}</span>
          </div>
        ))}
      </div>

      {/* Read guide link */}
      <div className="flex items-center justify-between pt-4 border-t border-border/40">
        <span
          className="text-sm font-semibold flex items-center gap-1.5 transition-all duration-300 group-hover:gap-2.5 text-primary underline-offset-4 hover:underline"
        >
          {readGuide}
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
        <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
          <Clock className="w-3 h-3" />
          {readTime}
        </span>
      </div>
    </motion.a>
  );
}

/* ── Main Component ────────────────────────────────────────────────────── */
export default function KnowledgeHub() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const isEnglish = language === 'en';

  const heading = isHindi ? 'इंश्योरेंस ज्ञान केंद्र' : isEnglish ? 'Insurance knowledge hub' : 'Insurance gyaan kendra';
  const subtitle = isHindi
    ? 'बीमा की बातें आसान भाषा में — हिंदी में समझें, सही फैसला लें'
    : isEnglish
    ? 'Insurance explained simply — understand in Hindi, make the right choice'
    : 'Insurance ki baatein aasan bhasha mein — samjho, sahi faisla lo';
  const cta = isHindi ? 'सभी गाइड देखें →' : isEnglish ? 'Browse all guides →' : 'Sab guides dekhein →';

  return (
    <section
      dir="ltr"
      className="relative py-28 md:py-36 overflow-hidden bg-background text-foreground"
      aria-label="Insurance knowledge hub"
    >
      {/* Subtle section divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-widest mb-5 bg-primary/[0.07] border border-primary/[0.12] text-primary"
          >
            <BookOpen className="w-3.5 h-3.5" />
            InsureGyaan
          </div>

          {/* Heading */}
          <h2
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.1]"
          >
            {heading
              .split(' ')
              .map((word: string, i: number, arr: string[]) =>
                i === arr.length - 1 ? (
                  <span key={i} className="italic text-primary">
                    {' '}
                    {word}
                  </span>
                ) : (
                  <span key={i}>{i > 0 ? ' ' : ''}{word}</span>
                )
              )}
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto mt-4 leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {articles.map((article, index) => (
            <ArticleCard key={article.articleKey} article={article} isHindi={isHindi} isEnglish={isEnglish} index={index} />
          ))}
        </div>

        {/* Browse all guides CTA */}
        <motion.div
          className="text-center mt-12 sm:mt-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <a
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 hover:gap-3 text-primary underline-offset-4 hover:underline"
          >
            {cta}
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
