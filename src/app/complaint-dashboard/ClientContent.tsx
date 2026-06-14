'use client';

import { useState } from 'react';
import {
  Shield, ArrowLeft, AlertTriangle, Lightbulb,
  BookOpen, ExternalLink, ChevronRight, Info,
  MessageCircle,
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShinyButton } from '@/components/ui/shiny-button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useLanguage } from '@/lib/i18n';
import StatsCards from './components/StatsCards';
import ComplaintTable from './components/ComplaintTable';
import {
  KEY_INSIGHTS,
  IRDAI_SOURCE_DISCLAIMER,
  ACTIONABLE_TIP,
} from '@/lib/complaintData';

/* ── Translation type & helper ─────────────────────────────────────────── */
type Tr = { en: string; hi: string; hinglish: string };

const pageText = {
  nav: {
    backToHome: { en: 'Back to Home', hi: 'होम पेज वापस', hinglish: 'Back to Home' },
    back: { en: 'Back', hi: 'वापस', hinglish: 'Back' },
    title: { en: 'Complaint Dashboard', hi: 'शिकायत डैशबोर्ड', hinglish: 'Complaint Dashboard' },
    subtitle: { en: 'IRDAI 2024-25', hi: 'IRDAI 2024-25', hinglish: 'IRDAI 2024-25' },
  },
  hero: {
    badge: { en: 'IRDAI Grievance Report', hi: 'IRDAI शिकायत रिपोर्ट', hinglish: 'IRDAI Grievance Report' },
    title1: { en: 'Insurance Complaint', hi: 'बीमा शिकायत', hinglish: 'Insurance Complaint' },
    titleHighlight: { en: 'Dashboard', hi: 'डैशबोर्ड', hinglish: 'Dashboard' },
    description: { en: "IRDAI's latest complaint data reveals which insurer is best and which is worst. Grievances, complaint ratio, and pendency rate — all in one place.", hi: 'IRDAI के नवीनतम शिकायत डेटा से जानिए कौन सा बीमाकर्ता सबसे अच्छा है और कौन सा सबसे खराब। शिकायतें, शिकायत अनुपात, और लंबित दर — सब एक जगह।', hinglish: "IRDAI ke latest complaint data se jaaniye kaunsa insurer best hai aur kaunsa worst. Grievances, complaint ratio, aur pendency rate — sab ek jagah." },
  },
  insights: {
    heading: { en: 'Key Insights', hi: 'मुख्य अंतर्दृष्टि', hinglish: 'Key Insights' },
  },
  table: {
    heading: { en: 'Company-wise Complaint Data', hi: 'कंपनीवार शिकायत डेटा', hinglish: 'Company-wise Complaint Data' },
  },
  proTip: {
    title: { en: 'Pro Tip from Paliwal Secure', hi: 'पालीवाल सिक्योर से प्रो टिप', hinglish: 'Paliwal Secure se Pro Tip' },
  },
  methodology: {
    heading: { en: 'How We Calculate', hi: 'हम कैसे गणना करते हैं', hinglish: 'Hum Kaise Calculate Karte Hain' },
    col1Title: { en: 'Complaints per 10,000 Policies', hi: '10,000 नीतियों पर शिकायतें', hinglish: 'Complaints per 10,000 Policies' },
    col1Desc: { en: 'Total grievances reported ÷ Policies in Force × 10,000. This normalizes for insurer size.', hi: 'कुल शिकायतें ÷ प्रभाव में नीतियाँ × 10,000। यह बीमाकर्ता आकार को सामान्य करता है।', hinglish: 'Total grievances ÷ Policies in Force × 10,000. Yeh insurer size ke liye normalize karta hai.' },
    col2Title: { en: 'Complaints per ₹1 Crore Premium', hi: '₹1 करोड़ प्रीमियम पर शिकायतें', hinglish: 'Complaints per ₹1 Crore Premium' },
    col2Desc: { en: 'Total grievances reported ÷ Gross Premium Collected (₹ Cr). Shows complaint intensity relative to premium volume.', hi: 'कुल शिकायतें ÷ सकल प्रीमियम संग्रह (₹ करोड़)। प्रीमियम मात्रा के सापेक्ष शिकायत तीव्रता दिखाता है।', hinglish: 'Total grievances ÷ Gross Premium Collected (₹ Cr). Premium volume ke relative complaint intensity dikhata hai.' },
    col3Title: { en: 'Pendency Rate', hi: 'लंबित दर', hinglish: 'Pendency Rate' },
    col3Desc: { en: 'Percentage of complaints unresolved as of March 31, 2025. Higher pendency = slower resolution.', hi: '31 मार्च 2025 तक अनसुलझी शिकायतों का प्रतिशत। अधिक लंबित = धीमा समाधान।', hinglish: '31 March 2025 tak unresolved complaints ka percentage. Higher pendency = slower resolution.' },
  },
  cta: {
    question: { en: 'Want personalized insurer recommendations based on complaint data?', hi: 'शिकायत डेटा के आधार पर व्यक्तिगत बीमाकर्ता सिफारिशें चाहिए?', hinglish: 'Complaint data ke basis pe personalized insurer recommendations chahiye?' },
    askInsureGPT: { en: 'Ask InsureGPT', hi: 'InsureGPT से पूछें', hinglish: 'InsureGPT se Poochein' },
    chatOnWhatsApp: { en: 'Chat on WhatsApp', hi: 'व्हाट्सएप पर चैट करें', hinglish: 'WhatsApp pe Chat Karein' },
    backToHome: { en: 'Back to Home', hi: 'होम पेज वापस', hinglish: 'Back to Home' },
  },
  footer: {
    byline: { en: 'By Himanshu Paliwal • Data: IRDAI Annual Report 2024-25', hi: 'हिमांशु पालीवाल द्वारा • डेटा: IRDAI वार्षिक रिपोर्ट 2024-25', hinglish: 'By Himanshu Paliwal • Data: IRDAI Annual Report 2024-25' },
  },
};

/* ── Insight Card ────────────────────────────────────────── */
function InsightCard({ insight, index }: { insight: typeof KEY_INSIGHTS[0]; index: number }) {
  const { language } = useLanguage();
  const pt = (obj: Tr) => obj[language] || obj.en;

  const typeStyles = {
    warning: { bg: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40', accent: 'text-amber-600 dark:text-amber-400' },
    danger: { bg: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/40', accent: 'text-red-600 dark:text-red-400' },
    success: { bg: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40', accent: 'text-emerald-600 dark:text-emerald-400' },
    info: { bg: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/40', accent: 'text-blue-600 dark:text-blue-400' },
  };
  const style = typeStyles[insight.type];

  return (
    <Card className={`border ${style.bg} hover:shadow-md hover:translate-y-[-2px] transition-all duration-300 glass-card`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl shrink-0 mt-0.5">{insight.icon}</span>
          <div>
            <p className={`text-sm font-semibold ${style.accent}`}>{insight.title}</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{insight.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Main Client Component ───────────────────────────────── */
export default function ComplaintDashboardClientContent() {
  const { language } = useLanguage();
  const pt = (obj: Tr) => obj[language] || obj.en;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ── Sticky Navigation Bar ── */}
      <nav className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <Link href="/">
                <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">{pt(pageText.nav.backToHome)}</span>
                  <span className="sm:hidden">{pt(pageText.nav.back)}</span>
                </button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-md">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-foreground leading-none">{pt(pageText.nav.title)}</h1>
                  <p className="text-[10px] text-muted-foreground">{pt(pageText.nav.subtitle)}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] px-2 py-0.5 rounded-full border-red-200 text-red-700 dark:border-red-800 dark:text-red-400">
                FY 2024-25
              </Badge>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-10">
        {/* ── Hero Section ── */}
        <div className="text-center max-w-3xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Badge className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800 rounded-full px-4 py-1 text-xs font-medium">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {pt(pageText.hero.badge)}
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
            {pt(pageText.hero.title1)}{' '}
            <span className="gradient-text">{pt(pageText.hero.titleHighlight)}</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {pt(pageText.hero.description)}
          </p>
        </div>

        {/* ── Stats Cards ── */}
        <StatsCards />

        {/* ── Key Insights ── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">{pt(pageText.insights.heading)}</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {KEY_INSIGHTS.map((insight, i) => (
              <InsightCard key={insight.title} insight={insight} index={i} />
            ))}
          </div>
        </div>

        {/* ── Complaint Table ── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">{pt(pageText.table.heading)}</h3>
          </div>
          <ComplaintTable />
        </div>

        {/* ── Section Divider ── */}
        <div className="flex items-center justify-center py-2">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="mx-3 h-1.5 w-1.5 rounded-full bg-primary/40" />
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>

        {/* ── Actionable Tip ── */}
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 p-5 sm:p-6 glass-card">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground mb-1">{pt(pageText.proTip.title)}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{ACTIONABLE_TIP}</p>
            </div>
          </div>
        </div>

        {/* ── Methodology ── */}
        <div className="rounded-2xl bg-muted/30 border border-border p-5 sm:p-6 space-y-4 glass-card">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-bold text-foreground">{pt(pageText.methodology.heading)}</h3>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 text-xs text-muted-foreground leading-relaxed">
            <div>
              <p className="font-semibold text-foreground mb-1">{pt(pageText.methodology.col1Title)}</p>
              <p>{pt(pageText.methodology.col1Desc)}</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">{pt(pageText.methodology.col2Title)}</p>
              <p>{pt(pageText.methodology.col2Desc)}</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">{pt(pageText.methodology.col3Title)}</p>
              <p>{pt(pageText.methodology.col3Desc)}</p>
            </div>
          </div>
        </div>

        {/* ── Source Disclaimer ── */}
        <div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-border p-4">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">{IRDAI_SOURCE_DISCLAIMER}</p>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="text-center space-y-3 py-4">
          <p className="text-sm text-muted-foreground font-medium">{pt(pageText.cta.question)}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/#insuregpt-chat">
              <ShinyButton variant="blue" className="rounded-xl px-6 py-3 text-sm">
                <span className="flex items-center gap-2"><MessageCircle className="w-4 h-4" /> {pt(pageText.cta.askInsureGPT)}</span>
              </ShinyButton>
            </Link>
            <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer">
              <ShinyButton variant="secondary" className="rounded-xl px-6 py-3 text-sm">
                <span>{pt(pageText.cta.chatOnWhatsApp)}</span>
              </ShinyButton>
            </a>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="mt-auto border-t border-border bg-muted/20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-foreground">
              Paliwal<span className="gradient-text"> Secure</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{pt(pageText.footer.byline)}</p>
        </div>
      </footer>
    </div>
  );
}
