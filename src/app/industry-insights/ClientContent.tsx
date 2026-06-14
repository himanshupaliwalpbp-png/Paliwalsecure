'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  ArrowLeft,
  TrendingUp,
  Shield,
  BookOpen,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Home,
  Search,
  Filter,
  BarChart3,
  Scale,
  ClipboardCheck,
  Lightbulb,
  MessageCircle,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ShinyButton } from '@/components/ui/shiny-button';
import { useLanguage } from '@/lib/i18n';
import { t } from '@/lib/i18n';
import {
  marketTrends2026,
  insuranceCompanies,
  irdaiRegulations2025,
  marketInsights,
  complianceChecklist,
  IRDAI_MANDATORY_DISCLAIMER,
} from '@/lib/insurance-data';

const InsurerPerformanceChart = dynamic(
  () => import('@/components/InsurerPerformanceChart'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full" />
      </div>
    ),
  }
);

/* ── Translation type & helper ─────────────────────────────────────────── */
type Tr = { en: string; hi: string; hinglish: string };

const pageText = {
  hero: {
    title1: { en: 'Insurance Industry Insights', hi: 'बीमा उद्योग अंतर्दृष्टि', hinglish: 'Insurance Industry Insights' },
    titleHighlight: { en: '2025-26', hi: '2025-26', hinglish: '2025-26' },
    subtitle: { en: "Data-driven analysis of India's insurance market — CSR trends, regulatory updates, and market opportunities", hi: "भारत के बीमा बाज़ार का डेटा-आधारित विश्लेषण — CSR रुझान, नियामक अपडेट, और बाज़ार के अवसर", hinglish: "India ke insurance market ka data-driven analysis — CSR trends, regulatory updates, aur market opportunities" },
    backToHome: { en: 'Back to Home', hi: 'होम पेज वापस', hinglish: 'Back to Home' },
    breadcrumb: { en: 'Industry Insights', hi: 'उद्योग अंतर्दृष्टि', hinglish: 'Industry Insights' },
  },
  tabs: {
    marketTrends: { en: 'Market Trends', hi: 'बाज़ार रुझान', hinglish: 'Market Trends' },
    csrIcr: { en: 'CSR & ICR', hi: 'CSR और ICR', hinglish: 'CSR & ICR' },
    irdaiRules: { en: 'IRDAI Rules', hi: 'IRDAI नियम', hinglish: 'IRDAI Rules' },
    insights: { en: 'Insights', hi: 'अंतर्दृष्टि', hinglish: 'Insights' },
    compliance: { en: 'Compliance', hi: 'अनुपालन', hinglish: 'Compliance' },
  },
  filters: {
    all: { en: 'All', hi: 'सभी', hinglish: 'All' },
    searchTrends: { en: 'Search trends...', hi: 'रुझान खोजें...', hinglish: 'Trends search karein...' },
    searchRegulations: { en: 'Search regulations...', hi: 'नियम खोजें...', hinglish: 'Regulations search karein...' },
    searchInsights: { en: 'Search insights...', hi: 'अंतर्दृष्टि खोजें...', hinglish: 'Insights search karein...' },
    searchCompliance: { en: 'Search compliance items...', hi: 'अनुपालन खोजें...', hinglish: 'Compliance items search karein...' },
    noResults: { en: 'No results match your search.', hi: 'आपकी खोज से कोई परिणाम मेल नहीं खाता।', hinglish: 'Koi results aapki search se match nahi karte.' },
  },
  trendCategories: {
    'premium-hike': { en: 'Premium Hike', hi: 'प्रीमियम वृद्धि', hinglish: 'Premium Hike' },
    'market-growth': { en: 'Market Growth', hi: 'बाज़ार वृद्धि', hinglish: 'Market Growth' },
    'tech-shift': { en: 'Tech Shift', hi: 'तकनीकी बदलाव', hinglish: 'Tech Shift' },
    'regulatory': { en: 'Regulatory', hi: 'नियामक', hinglish: 'Regulatory' },
    'consumer-behavior': { en: 'Consumer Behavior', hi: 'उपभोक्ता व्यवहार', hinglish: 'Consumer Behavior' },
  },
  csr: {
    allCategories: { en: 'All Categories', hi: 'सभी श्रेणियाँ', hinglish: 'All Categories' },
    companyPerformance: { en: 'Company Performance Comparison', hi: 'कंपनी प्रदर्शन तुलना', hinglish: 'Company Performance Comparison' },
    csrIcrDesc: { en: 'CSR, ICR, and Solvency data from IRDAI Annual Report 2025-26', hi: 'IRDAI वार्षिक रिपोर्ट 2025-26 से CSR, ICR और सॉल्वेंसी डेटा', hinglish: 'IRDAI Annual Report 2025-26 se CSR, ICR aur Solvency data' },
    insurer: { en: 'Insurer', hi: 'बीमाकर्ता', hinglish: 'Insurer' },
    category: { en: 'Category', hi: 'श्रेणी', hinglish: 'Category' },
    csrPercent: { en: 'CSR %', hi: 'CSR %', hinglish: 'CSR %' },
    icrPercent: { en: 'ICR %', hi: 'ICR %', hinglish: 'ICR %' },
    solvency: { en: 'Solvency', hi: 'सॉल्वेंसी', hinglish: 'Solvency' },
    rating: { en: 'Rating', hi: 'रेटिंग', hinglish: 'Rating' },
    keyFeatures: { en: 'Key Features', hi: 'मुख्य विशेषताएँ', hinglish: 'Key Features' },
    footnote: { en: 'CSR = Claim Settlement Ratio (higher is better). ICR = Incurred Claim Ratio (<100% = insurer profitable). Solvency >1.5 is IRDAI mandated minimum.', hi: 'CSR = क्लेम निपटान अनुपात (अधिक बेहतर)। ICR = प्राप्त क्लेम अनुपात (<100% = बीमाकर्ता लाभदायक)। सॉल्वेंसी >1.5 IRDAI अनिवार्य न्यूनतम है।', hinglish: 'CSR = Claim Settlement Ratio (higher is better). ICR = Incurred Claim Ratio (<100% = insurer profitable). Solvency >1.5 IRDAI mandated minimum hai.' },
  },
  regulations: {
    before: { en: 'BEFORE', hi: 'पहले', hinglish: 'BEFORE' },
    after: { en: 'AFTER', hi: 'बाद', hinglish: 'AFTER' },
    whatYouShouldDo: { en: 'What You Should Do', hi: 'आपको क्या करना चाहिए', hinglish: 'Aapko Kya Karna Chahiye' },
    impact: { en: 'Impact', hi: 'प्रभाव', hinglish: 'Impact' },
    effective: { en: 'Effective:', hi: 'प्रभावी:', hinglish: 'Effective:' },
  },
  insightCategories: {
    'opportunity': { en: 'Opportunity', hi: 'अवसर', hinglish: 'Opportunity' },
    'pain-point': { en: 'Pain Point', hi: 'समस्या', hinglish: 'Pain Point' },
    'regulatory': { en: 'Regulatory', hi: 'नियामक', hinglish: 'Regulatory' },
    'competitor-gap': { en: 'Competitor Gap', hi: 'प्रतिस्पर्धी अंतर', hinglish: 'Competitor Gap' },
  },
  compliance: {
    statusLabels: {
      'compliant': { en: 'Compliant', hi: 'अनुपालित', hinglish: 'Compliant' },
      'required': { en: 'Required', hi: 'आवश्यक', hinglish: 'Required' },
      'recommended': { en: 'Recommended', hi: 'अनुशंसित', hinglish: 'Recommended' },
      'future': { en: 'Future', hi: 'भविष्य', hinglish: 'Future' },
    },
  },
  cta: {
    chatLabel: { en: 'Chat on WhatsApp', hi: 'व्हाट्सएप पर चैट करें', hinglish: 'WhatsApp pe Chat Karein' },
    askInsureGPT: { en: 'Ask InsureGPT', hi: 'InsureGPT से पूछें', hinglish: 'InsureGPT se Poochein' },
  },
};

/* ── Color Helpers ─────────────────────────────────────── */
function getTrendCategoryColor(cat: string) {
  switch (cat) {
    case 'premium-hike': return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
    case 'market-growth': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
    case 'tech-shift': return 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800';
    case 'regulatory': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
    case 'consumer-behavior': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
    default: return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/40 dark:text-slate-300 dark:border-slate-700';
  }
}

function getInsightStyle(cat: string) {
  switch (cat) {
    case 'opportunity': return { color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/40', border: 'border-blue-200 dark:border-blue-700/50', icon: TrendingUp };
    case 'pain-point': return { color: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/40', border: 'border-rose-200 dark:border-rose-700/50', icon: AlertTriangle };
    case 'regulatory': return { color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/40', border: 'border-amber-200 dark:border-amber-700/50', icon: Shield };
    case 'competitor-gap': return { color: 'text-violet-700 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/40', border: 'border-violet-200 dark:border-violet-700/50', icon: Sparkles };
    default: return { color: 'text-slate-700 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-800/50', border: 'border-slate-200 dark:border-slate-700/50', icon: TrendingUp };
  }
}

function getImpactLevelStyle(level: string) {
  switch (level) {
    case 'critical': return 'bg-red-100 text-red-700 border-red-300 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800';
    case 'high': return 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
    default: return 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-700';
  }
}

function getCsrColor(csr: number) {
  if (csr >= 99) return 'text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30';
  if (csr >= 95) return 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30';
  return 'text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/30';
}

function getRegulationCategoryColor(cat: string) {
  switch (cat) {
    case 'ped': return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
    case 'moratorium': return 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800';
    case 'claims': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
    case 'gst': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
    case 'consumer-protection': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
    case 'portability': return 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800';
    default: return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/40 dark:text-slate-300 dark:border-slate-700';
  }
}

function getComplianceStatusStyle(status: string) {
  switch (status) {
    case 'compliant': return { icon: CheckCircle2, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/30', symbol: '\u2713' };
    case 'required': return { icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30', symbol: '\u23F1' };
    case 'recommended': return { icon: Lightbulb, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30', symbol: '\uD83D\uDCA1' };
    case 'future': return { icon: Sparkles, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/30', symbol: '\u2728' };
    default: return { icon: Clock, color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-800/30', symbol: '?' };
  }
}

function getPriorityStyle(priority: string) {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300';
    case 'medium': return 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300';
    default: return 'bg-slate-100 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400';
  }
}

/* ── Filter Bar ──────────────────────────────── */
function FilterBar({ searchValue, onSearchChange, filters, activeFilter, onFilterChange, placeholder }: {
  searchValue: string; onSearchChange: (v: string) => void;
  filters: { value: string; label: string }[]; activeFilter: string; onFilterChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={searchValue} onChange={(e) => onSearchChange(e.target.value)} placeholder={placeholder} className="pl-9 rounded-xl h-10" />
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {filters.map((f) => (
          <Button key={f.value} variant={activeFilter === f.value ? 'default' : 'outline'} size="sm"
            onClick={() => onFilterChange(f.value)}
            className={`rounded-lg text-xs h-8 px-3 ${activeFilter === f.value ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'hover:bg-primary/10 hover:text-primary'}`}>
            {f.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

/* ── Main Client Component ───────────────────────── */
export default function IndustryInsightsClientContent() {
  const { language } = useLanguage();
  const pt = (obj: Tr) => obj[language] || obj.en;

  const [trendSearch, setTrendSearch] = useState('');
  const [trendFilter, setTrendFilter] = useState('all');
  const [companyCategoryFilter, setCompanyCategoryFilter] = useState('all');
  const [regSearch, setRegSearch] = useState('');
  const [regFilter, setRegFilter] = useState('all');
  const [insightSearch, setInsightSearch] = useState('');
  const [compSearch, setCompSearch] = useState('');
  const [compFilter, setCompFilter] = useState('all');

  const filteredTrends = useMemo(() => marketTrends2026.filter((trend) => {
    const matchesFilter = trendFilter === 'all' || trend.category === trendFilter;
    const matchesSearch = !trendSearch || trend.title.toLowerCase().includes(trendSearch.toLowerCase()) || trend.summary.toLowerCase().includes(trendSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  }), [trendSearch, trendFilter]);

  const filteredCompanies = useMemo(() => insuranceCompanies.filter((c) => companyCategoryFilter === 'all' || c.category === companyCategoryFilter), [companyCategoryFilter]);

  const filteredRegulations = useMemo(() => irdaiRegulations2025.filter((reg) => {
    const matchesFilter = regFilter === 'all' || reg.category === regFilter;
    const matchesSearch = !regSearch || reg.title.toLowerCase().includes(regSearch.toLowerCase()) || reg.summary.toLowerCase().includes(regSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  }), [regSearch, regFilter]);

  const filteredInsights = useMemo(() => marketInsights.filter((ins) => !insightSearch || ins.stat.toLowerCase().includes(insightSearch.toLowerCase()) || ins.context.toLowerCase().includes(insightSearch.toLowerCase())), [insightSearch]);

  const filteredCompliance = useMemo(() => complianceChecklist.filter((item) => {
    const matchesFilter = compFilter === 'all' || item.category === compFilter;
    const matchesSearch = !compSearch || item.requirement.toLowerCase().includes(compSearch.toLowerCase()) || item.description.toLowerCase().includes(compSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  }), [compSearch, compFilter]);

  /* ── Trend/Reg category labels using i18n ────────── */
  const getTrendCategoryLabel = (cat: string) => {
    const key = cat as keyof typeof pageText.trendCategories;
    return key in pageText.trendCategories ? pt(pageText.trendCategories[key]) : cat;
  };
  const getInsightCategoryLabel = (cat: string) => {
    const key = cat as keyof typeof pageText.insightCategories;
    return key in pageText.insightCategories ? pt(pageText.insightCategories[key]) : cat;
  };
  const getRegulationCategoryLabel = (cat: string) => {
    const map: Record<string, Tr> = {
      'ped': { en: 'PED', hi: 'PED', hinglish: 'PED' },
      'moratorium': { en: 'Moratorium', hi: 'मोराटोरियम', hinglish: 'Moratorium' },
      'claims': { en: 'Claims', hi: 'क्लेम', hinglish: 'Claims' },
      'gst': { en: 'GST', hi: 'GST', hinglish: 'GST' },
      'consumer-protection': { en: 'Consumer Protection', hi: 'उपभोक्ता सुरक्षा', hinglish: 'Consumer Protection' },
      'portability': { en: 'Portability', hi: 'पोर्टेबिलिटी', hinglish: 'Portability' },
    };
    return cat in map ? pt(map[cat]) : cat;
  };
  const getComplianceStatusLabel = (status: string) => {
    const key = status as keyof typeof pageText.compliance.statusLabels;
    return key in pageText.compliance.statusLabels ? pt(pageText.compliance.statusLabels[key]) : status;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* ── Header ──────────────────────────────── */}
      <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
            <Home className="h-3.5 w-3.5" />
            <span>{t('nav.home', language)}</span>
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{pt(pageText.hero.breadcrumb)}</span>
        </nav>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {pt(pageText.hero.title1)}{' '}
              <span className="gradient-text">{pt(pageText.hero.titleHighlight)}</span>
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">{pt(pageText.hero.subtitle)}</p>
          </div>
          <Link href="/">
            <Button variant="outline" className="rounded-xl gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary/30">
              <ArrowLeft className="h-4 w-4" />
              {pt(pageText.hero.backToHome)}
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────── */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto gap-1 bg-muted/50 p-1 rounded-2xl">
          {[
            { value: 'trends', Icon: TrendingUp, text: pageText.tabs.marketTrends },
            { value: 'csr', Icon: BarChart3, text: pageText.tabs.csrIcr },
            { value: 'regulations', Icon: Scale, text: pageText.tabs.irdaiRules },
            { value: 'insights', Icon: Lightbulb, text: pageText.tabs.insights },
            { value: 'compliance', Icon: ClipboardCheck, text: pageText.tabs.compliance },
          ].map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}
              className={`rounded-xl text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5 py-2.5 ${tab.value === 'compliance' ? 'col-span-2 sm:col-span-1' : ''}`}>
              <tab.Icon className="h-3.5 w-3.5 hidden sm:block" />
              {pt(tab.text)}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ── Tab 1: Market Trends ──────────────── */}
        <TabsContent value="trends">
          <FilterBar searchValue={trendSearch} onSearchChange={setTrendSearch}
            activeFilter={trendFilter} onFilterChange={setTrendFilter}
            placeholder={pt(pageText.filters.searchTrends)}
            filters={[
              { value: 'all', label: pt(pageText.filters.all) },
              ...Object.entries(pageText.trendCategories).map(([k, v]) => ({ value: k, label: pt(v) })),
            ]}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTrends.map((trend) => (
              <Card key={trend.id} className="rounded-2xl border hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300 h-full glass-card">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-semibold leading-snug">
                      {language === 'hi' ? trend.titleHi : trend.title}
                    </CardTitle>
                    <Badge variant="outline" className={`shrink-0 text-[10px] px-2 py-0.5 border ${getTrendCategoryColor(trend.category)}`}>
                      {getTrendCategoryLabel(trend.category)}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs mt-1">{trend.year} &middot; {trend.source}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {language === 'hi' ? trend.summaryHi : trend.summary}
                  </p>
                  <div className="space-y-1.5">
                    {trend.data.map((point, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <ChevronRight className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                        <span className="text-foreground/80">{point}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
                    <p className="text-xs font-medium text-primary flex items-center gap-1 mb-1">
                      <TrendingUp className="h-3 w-3" /> {pt(pageText.regulations.impact)}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {language === 'hi' ? trend.impactHi : trend.impact}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredTrends.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Filter className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">{pt(pageText.filters.noResults)}</p>
            </div>
          )}
        </TabsContent>

        {/* ── Tab 2: CSR & ICR ──────────────────── */}
        <TabsContent value="csr">
          <div className="mb-8"><InsurerPerformanceChart /></div>
          <div className="flex gap-1.5 flex-wrap mb-4">
            {[
              { value: 'all', text: pageText.csr.allCategories },
              { value: 'health', text: { en: 'Health', hi: 'हेल्थ', hinglish: 'Health' } },
              { value: 'life', text: { en: 'Life', hi: 'लाइफ', hinglish: 'Life' } },
              { value: 'motor', text: { en: 'Motor', hi: 'मोटर', hinglish: 'Motor' } },
              { value: 'travel', text: { en: 'Travel', hi: 'ट्रैवल', hinglish: 'Travel' } },
              { value: 'home', text: { en: 'Home', hi: 'होम', hinglish: 'Home' } },
            ].map((f) => (
              <Button key={f.value} variant={companyCategoryFilter === f.value ? 'default' : 'outline'} size="sm"
                onClick={() => setCompanyCategoryFilter(f.value)}
                className={`rounded-lg text-xs h-8 px-3 ${companyCategoryFilter === f.value ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'hover:bg-primary/10 hover:text-primary'}`}>
                {pt(f.text)}
              </Button>
            ))}
          </div>
          <Card className="rounded-2xl overflow-hidden glass-card">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                {pt(pageText.csr.companyPerformance)}
              </CardTitle>
              <CardDescription>{pt(pageText.csr.csrIcrDesc)}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/30">
                      {[pageText.csr.insurer, pageText.csr.category, pageText.csr.csrPercent, pageText.csr.icrPercent, pageText.csr.solvency, pageText.csr.rating, pageText.csr.keyFeatures].map((h, i) => (
                        <th key={i} className={`px-4 py-3 text-xs font-bold sticky top-0 bg-muted/30 ${i >= 2 && i <= 5 ? 'text-center' : 'text-left'}`}>{pt(h)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredCompanies.map((company) => (
                      <tr key={company.name} className="hover:bg-primary/5 transition-colors">
                        <td className="px-4 py-3 text-xs font-semibold text-foreground">{company.name}</td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className={`text-[10px] px-2 py-0.5 border ${company.category === 'health' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : company.category === 'life' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' : company.category === 'motor' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' : 'bg-slate-50 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300'}`}>
                            {company.category.charAt(0).toUpperCase() + company.category.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md text-xs font-bold ${getCsrColor(company.csr2026)}`}>{company.csr2026}%</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-center text-muted-foreground">{company.icr2026 ? `${company.icr2026}%` : 'N/A'}</td>
                        <td className="px-4 py-3 text-xs text-center">
                          <span className={`font-medium ${company.solvencyRatio >= 2 ? 'text-green-700 dark:text-green-400' : company.solvencyRatio >= 1.5 ? 'text-amber-700 dark:text-amber-400' : 'text-rose-700 dark:text-rose-400'}`}>{company.solvencyRatio}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-center"><span className="font-medium text-primary">{company.rating}/5</span></td>
                        <td className="px-4 py-3 text-xs text-muted-foreground max-w-[200px]">
                          <div className="flex flex-wrap gap-1">
                            {company.features.slice(0, 2).map((f, i) => (
                              <span key={i} className="inline-block px-1.5 py-0.5 rounded bg-muted/50 text-[10px]">{f}</span>
                            ))}
                            {company.features.length > 2 && <span className="inline-block px-1.5 py-0.5 rounded bg-muted/50 text-[10px]">+{company.features.length - 2}</span>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 text-[10px] text-muted-foreground border-t border-border">{pt(pageText.csr.footnote)}</div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab 3: IRDAI Regulations ──────────── */}
        <TabsContent value="regulations">
          <FilterBar searchValue={regSearch} onSearchChange={setRegSearch}
            activeFilter={regFilter} onFilterChange={setRegFilter}
            placeholder={pt(pageText.filters.searchRegulations)}
            filters={[
              { value: 'all', label: pt(pageText.filters.all) },
              { value: 'ped', label: getRegulationCategoryLabel('ped') },
              { value: 'moratorium', label: getRegulationCategoryLabel('moratorium') },
              { value: 'claims', label: getRegulationCategoryLabel('claims') },
              { value: 'gst', label: getRegulationCategoryLabel('gst') },
              { value: 'consumer-protection', label: getRegulationCategoryLabel('consumer-protection') },
              { value: 'portability', label: getRegulationCategoryLabel('portability') },
            ]}
          />
          <div className="space-y-4">
            {filteredRegulations.map((reg) => (
              <Card key={reg.id} className="rounded-2xl border hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300 glass-card">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <CardTitle className="text-base font-semibold leading-snug flex items-center gap-2">
                      <Scale className="h-4 w-4 text-primary shrink-0" />
                      {language === 'hi' ? reg.titleHi : reg.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className={`text-[10px] px-2 py-0.5 border ${getRegulationCategoryColor(reg.category)}`}>{getRegulationCategoryLabel(reg.category)}</Badge>
                      <Badge variant="outline" className={`text-[10px] px-2 py-0.5 border ${getImpactLevelStyle(reg.impactLevel)}`}>
                        {reg.impactLevel.charAt(0).toUpperCase() + reg.impactLevel.slice(1)} {pt(pageText.regulations.impact)}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-xs mt-1">
                    {pt(pageText.regulations.effective)} {reg.effectiveDate} &middot; {reg.source}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{language === 'hi' ? reg.summaryHi : reg.summary}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-800/30">
                      <p className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 mb-1">{pt(pageText.regulations.before)}</p>
                      <p className="text-xs text-rose-700/80 dark:text-rose-300/80">{reg.beforeChange}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30">
                      <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mb-1">{pt(pageText.regulations.after)}</p>
                      <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80">{reg.afterChange}</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30">
                    <p className="text-xs font-medium text-amber-800 dark:text-amber-300 flex items-center gap-1 mb-1">
                      <AlertTriangle className="h-3 w-3" /> {pt(pageText.regulations.whatYouShouldDo)}
                    </p>
                    <p className="text-xs text-amber-700/80 dark:text-amber-400/80 leading-relaxed">
                      {language === 'hi' ? reg.userActionHi : reg.userAction}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredRegulations.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Filter className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">{pt(pageText.filters.noResults)}</p>
            </div>
          )}
        </TabsContent>

        {/* ── Tab 4: Market Insights ────────────── */}
        <TabsContent value="insights">
          <div className="relative mb-6 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={insightSearch} onChange={(e) => setInsightSearch(e.target.value)} placeholder={pt(pageText.filters.searchInsights)} className="pl-9 rounded-xl h-10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredInsights.map((insight) => {
              const style = getInsightStyle(insight.category);
              const IconComp = style.icon;
              return (
                <Card key={insight.id} className={`rounded-2xl border hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300 h-full ${style.border} glass-card`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${style.bg}`}>
                        <IconComp className={`h-4.5 w-4.5 ${style.color}`} />
                      </div>
                      <Badge variant="outline" className={`text-[10px] px-2 py-0.5 border ${style.bg} ${style.color}`}>
                        {getInsightCategoryLabel(insight.category)}
                      </Badge>
                    </div>
                    <CardTitle className={`text-base font-semibold leading-snug mt-2 ${style.color}`}>{insight.stat}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{insight.context}</p>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
                      <BookOpen className="h-3 w-3" /><span>{insight.source}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {filteredInsights.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Filter className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">{pt(pageText.filters.noResults)}</p>
            </div>
          )}
        </TabsContent>

        {/* ── Tab 5: Compliance ─────────────────── */}
        <TabsContent value="compliance">
          <FilterBar searchValue={compSearch} onSearchChange={setCompSearch}
            activeFilter={compFilter} onFilterChange={setCompFilter}
            placeholder={pt(pageText.filters.searchCompliance)}
            filters={[
              { value: 'all', label: pt(pageText.filters.all) },
              { value: 'DPDP', label: 'DPDP' },
              { value: 'IRDAI', label: 'IRDAI' },
              { value: 'WhatsApp', label: 'WhatsApp' },
            ]}
          />
          <div className="space-y-4">
            {filteredCompliance.map((item) => {
              const statusStyle = getComplianceStatusStyle(item.status);
              const StatusIcon = statusStyle.icon;
              return (
                <Card key={item.id} className="rounded-2xl border hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300 glass-card">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${statusStyle.bg}`}>
                        <StatusIcon className={`h-4.5 w-4.5 ${statusStyle.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-sm font-semibold text-foreground">{item.requirement}</h3>
                          <Badge variant="outline" className={`text-[10px] px-2 py-0.5 border ${statusStyle.bg} ${statusStyle.color}`}>
                            {statusStyle.symbol} {getComplianceStatusLabel(item.status)}
                          </Badge>
                          <Badge variant="outline" className={`text-[10px] px-2 py-0.5 border ${getPriorityStyle(item.priority)}`}>
                            {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {filteredCompliance.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Filter className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">{pt(pageText.filters.noResults)}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ── Section Divider ─────────────────────── */}
      <div className="flex items-center justify-center py-8">
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="mx-3 h-1.5 w-1.5 rounded-full bg-primary/40" />
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      {/* ── IRDAI Disclaimer + CTA ──────────────── */}
      <div className="mt-8 rounded-2xl p-5 text-center glass-card" style={{ border: '1px solid rgba(201,138,28,0.15)' }}>
        <Shield className="w-8 h-8 mx-auto mb-3 text-primary" />
        <p className="text-xs text-muted-foreground max-w-2xl mx-auto mb-4">{IRDAI_MANDATORY_DISCLAIMER}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer">
            <ShinyButton variant="blue" className="rounded-xl px-6 py-3 text-sm">
              <span className="flex items-center gap-2"><MessageCircle className="w-4 h-4" /> {pt(pageText.cta.chatLabel)}</span>
            </ShinyButton>
          </a>
          <Link href="/#insuregpt-chat">
            <ShinyButton variant="secondary" className="rounded-xl px-6 py-3 text-sm">
              <span>{pt(pageText.cta.askInsureGPT)}</span>
            </ShinyButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
