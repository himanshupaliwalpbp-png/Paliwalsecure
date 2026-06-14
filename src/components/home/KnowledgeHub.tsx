'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Heart, Car, ArrowRight, BookOpen, Shield, TrendingUp, CheckCircle2, Languages } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

/* ── Article data ────────────────────────────────────────────── */
interface ArticleData {
  articleKey: string;
  icon: React.ReactNode;
  slug: string;
  titles: { en: string; hi: string; hg: string };
  categories: { en: string; hi: string; hg: string };
  readTimes: { en: string; hi: string; hg: string };
  keyPoints: { en: string[]; hi: string[]; hg: string[] };
  summaries: { en: string; hi: string; hg: string };
  color: string;
}

const articles: ArticleData[] = [
  {
    articleKey: 'article1',
    icon: <Shield className="w-5 h-5" />,
    slug: 'term-insurance-guide-india',
    color: '#2563EB',
    titles: { en: 'Term vs Whole Life — explained in 3 min', hi: 'Term vs Whole Life — 3 minute mein samjhein', hg: 'Term vs Whole Life — 3 minute mein samjhein' },
    categories: { en: 'Insurance Guide', hi: 'बीमा गाइड', hg: 'Insurance Guide' },
    readTimes: { en: '3 min read', hi: '3 मिनट पढ़ें', hg: '3 min read' },
    keyPoints: {
      en: ['Term = pure protection, lowest premium', 'Whole life = insurance + savings, 5-10x more', 'Best: Term Plan + Mutual Fund SIP separately'],
      hi: ['Term = सिर्फ सुरक्षा, सबसे कम प्रीमियम', 'Whole life = बीमा + बचत, 5-10 गुना ज्यादा', 'बेस्ट: Term Plan + Mutual Fund SIP अलग से'],
      hg: ['Term = sirf protection, sabse kam premium', 'Whole life = insurance + savings, 5-10x zyada', 'Best: Term Plan + Mutual Fund SIP alag se'],
    },
    summaries: { en: 'Term insurance gives you maximum life cover at minimum cost. Our recommendation: Buy term for protection, invest the difference.', hi: 'Term insurance कम से कम लागत पर अधिकतम जीवन कवर देता है। हमारी सलाह: सुरक्षा के लिए Term खरीदें।', hg: 'Term insurance minimum cost pe maximum life cover deta hai. Recommendation: Protection ke liye Term buy karo.' },
  },
  {
    articleKey: 'article2',
    icon: <Heart className="w-5 h-5" />,
    slug: 'family-health-insurance-guide',
    color: '#EF4444',
    titles: { en: 'How much health cover does a Jaipur family of 4 need?', hi: 'जयपुर के 4-सदस्य परिवार को कितना हेल्थ कवर चाहिए?', hg: 'Jaipur ke 4-member parivaar ko kitna health cover chahiye?' },
    categories: { en: 'Health Insurance', hi: 'हेल्थ इंश्योरेंस', hg: 'Health Insurance' },
    readTimes: { en: '5 min read', hi: '5 मिनट पढ़ें', hg: '5 min read' },
    keyPoints: {
      en: ['₹10-15 Lakh family floater is minimum', 'Super Top-Up adds ₹1 Crore for ₹3,000/yr', 'Room rent capping is critical'],
      hi: ['₹10-15 लाख फैमिली फ्लोटर न्यूनतम', 'सुपर टॉप-अप ₹3,000/साल में ₹1 करोड़ जोड़ सकता है', 'रूम रेंट कैपिंग बहुत जरूरी'],
      hg: ['₹10-15 Lakh family floater minimum', 'Super Top-Up ₹3,000/year mein ₹1 Crore add karta hai', 'Room rent capping critical hai'],
    },
    summaries: { en: 'For a Jaipur family of 4, we recommend ₹10-15 Lakh base + ₹1 Crore Super Top-Up. Total cost: ₹8,000-₹15,000/year.', hi: 'जयपुर के 4-सदस्य परिवार के लिए, हम ₹10-15 लाख बेस + ₹1 करोड़ सुपर टॉप-अप की सलाह देते हैं।', hg: 'Jaipur ke 4-member family ke liye, hum ₹10-15 Lakh base + ₹1 Crore Super Top-Up recommend karte hain.' },
  },
  {
    articleKey: 'article3',
    icon: <Car className="w-5 h-5" />,
    slug: 'insurance-claim-rejection-reasons',
    color: '#10B981',
    titles: { en: 'Motor insurance claim rejected? Do this.', hi: 'मोटर इंश्योरेंस क्लेम रिजेक्ट हो गया? ये करें।', hg: 'Motor insurance claim reject ho gaya? Ye karein.' },
    categories: { en: 'Claims Help', hi: 'क्लेम सहायता', hg: 'Claims Help' },
    readTimes: { en: '4 min read', hi: '4 मिनट पढ़ें', hg: '4 min read' },
    keyPoints: {
      en: ['Not informing insurer within 48-72 hrs = common reason', 'Driving without valid license = automatic rejection', 'File appeal with insurer first, then IRDAI'],
      hi: ['48-72 घंटे में सूचित नहीं करना = आम वजह', 'बिना वैलिड लाइसेंस = ऑटोमैटिक रिजेक्शन', 'पहले इंश्योरर के पास अपील करें, फिर IRDAI'],
      hg: ['48-72 hrs mein inform nahi karna = common reason', 'Bina valid license = automatic rejection', 'Pehle insurer ke paas appeal karo, phir IRDAI'],
    },
    summaries: { en: "Don't panic if your motor claim is rejected. Get the rejection in writing, file an appeal within 15 days. IRDAI resolves 90%+ cases in favor of policyholders.", hi: 'अगर आपका मोटर क्लेम रिजेक्ट हो गया है तो घबराएं नहीं। 15 दिन में अपील करें। IRDAI 90%+ मामले ग्राहक के पक्ष में करता है।', hg: 'Agar motor claim reject ho gaya toh ghabrayein nahi. 15 din mein appeal karein. IRDAI 90%+ cases policyholder ke favour mein solve karta hai.' },
  },
];

/* ── Helper ────────────────────────────────────────────────────── */
function tr(data: { en: string; hi: string; hg: string }, isHindi: boolean, isEnglish: boolean) {
  return isHindi ? data.hi : isEnglish ? data.en : data.hg;
}

/* ── Article Card ─────────────────────────────────────────────── */
function ArticleCard({ article, isHindi, isEnglish, index }: { article: ArticleData; isHindi: boolean; isEnglish: boolean; index: number }) {
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
      className="bg-white dark:bg-card/60 border border-[#E2E8F0] dark:border-white/10 rounded-2xl overflow-hidden relative p-6 sm:p-7 flex flex-col h-full group cursor-pointer block transition-all duration-500 hover:-translate-y-1 hover:shadow-premium-lg"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-2.5 mb-4 flex-wrap">
        <span
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundColor: `${article.color}15`, color: article.color }}
        >
          {article.icon}
        </span>
        <span className="text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full text-[#64748B] dark:text-[#A6AEC7] bg-[#F1F5F9] dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 font-body">
          {category}
        </span>
        <span className="text-xs font-mono text-[#10B981] ml-auto flex items-center gap-1">
          <Languages className="w-3 h-3" />
          {readHindiLabel}
        </span>
      </div>

      <h3 className="font-display text-sm sm:text-base lg:text-lg font-bold text-[#0F172A] dark:text-[#F8F6F0] leading-snug mb-2.5 tracking-tight">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#A6AEC7] leading-relaxed mb-4 font-body">
        {summary}
      </p>

      <div className="space-y-2 mb-5 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#2563EB] dark:text-[#D4A853] flex items-center gap-1.5 font-body">
          <TrendingUp className="w-3 h-3" />
          {keyTakeawayLabel}
        </p>
        {keyPoints.slice(0, 3).map((point, i) => (
          <div key={i} className="flex items-start gap-2">
            <CheckCircle2 className="w-3 h-3 text-[#2563EB]/70 dark:text-[#D4A853]/70 shrink-0 mt-0.5" />
            <span className="text-[11px] text-[#64748B] dark:text-[#A6AEC7] leading-snug font-body">{point}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0] dark:border-white/10">
        <span className="text-sm font-semibold flex items-center gap-1.5 transition-all duration-300 group-hover:gap-2.5 text-[#2563EB] dark:text-[#D4A853] underline-offset-4 hover:underline font-body">
          {readGuide}
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
        <span className="text-[10px] text-[#64748B] dark:text-[#A6AEC7] flex items-center gap-1 font-mono">
          <Clock className="w-3 h-3" />
          {readTime}
        </span>
      </div>
    </motion.a>
  );
}

/* ── Main Component ────────────────────────────────────────── */
export default function KnowledgeHub() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const isEnglish = language === 'en';

  const heading = isHindi ? 'इंश्योरेंस ज्ञान' : isEnglish ? 'Insurance Knowledge' : 'Insurance Gyaan';
  const headingAccent = isHindi ? 'केंद्र' : isEnglish ? 'Hub' : 'Kendra';
  const subtitle = isHindi
    ? 'बीमा की बातें आसान भाषा में — हिंदी में समझें, सही फैसला लें'
    : isEnglish
    ? 'Insurance explained simply — understand in Hindi, make the right choice'
    : 'Insurance ki baatein aasan bhasha mein — samjho, sahi faisla lo';
  const cta = isHindi ? 'सभी गाइड देखें →' : isEnglish ? 'Browse all guides →' : 'Sab guides dekhein →';

  return (
    <section className="py-24 bg-white dark:bg-[#0A1330]">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F8FAFC] dark:bg-white/5 rounded-full border border-[#E2E8F0] dark:border-white/10 mb-5 shadow-premium">
            <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" />
            <span className="text-sm font-medium text-[#0F172A] dark:text-[#F8F6F0] font-body">InsureGyaan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8F6F0] leading-[1.1] font-display">
            {heading} <span className="gradient-text-blue-emerald">{headingAccent}</span>
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] dark:text-[#A6AEC7] max-w-lg mx-auto mt-4 leading-relaxed font-body">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {articles.map((article, index) => (
            <ArticleCard key={article.articleKey} article={article} isHindi={isHindi} isEnglish={isEnglish} index={index} />
          ))}
        </div>

        <motion.div
          className="text-center mt-12 sm:mt-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <a
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 hover:gap-3 text-[#2563EB] dark:text-[#D4A853] underline-offset-4 hover:underline font-body"
          >
            {cta}
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
