'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, BookOpen, AlertTriangle, ChevronRight, ArrowUpDown,
  ArrowUp, ArrowDown, CheckCircle2, XCircle, Star, Clock,
  Shield, Heart, Car, Info, Sparkles, TrendingUp, Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from '@/components/ui/tabs';
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from '@/components/ui/accordion';
import {
  policyGlossary, blogArticles, mythBusters,
  insuranceCompanies, diseaseSpecificPlans, marketComparisons,
} from '@/lib/insurance-data';

// ── Types ─────────────────────────────────────────────────────────────────
type GlossaryCategory = 'all' | 'health' | 'life' | 'motor' | 'general';
type MythCategory = 'all' | 'health' | 'life' | 'motor' | 'general';
type CompareCategory = 'all' | 'health' | 'life';
type SortKey = 'name' | 'csr' | 'icr' | 'solvency' | 'rating';
type SortDir = 'asc' | 'desc';

// ── Color helpers ─────────────────────────────────────────────────────────
function getGlossaryCatStyle(cat: string) {
  switch (cat) {
    case 'health': return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
    case 'life': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
    case 'motor': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
    default: return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/40 dark:text-slate-300 dark:border-slate-700';
  }
}

function getImportanceStyle(importance: string) {
  switch (importance) {
    case 'critical': return 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300';
    case 'high': return 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300';
    default: return 'bg-slate-100 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400';
  }
}

function getCsrColor(csr: number): string {
  if (csr >= 99) return 'text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30';
  if (csr >= 95) return 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30';
  return 'text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/30';
}

function getIcrColor(icr: number): string {
  if (icr >= 50 && icr <= 80) return 'text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30';
  if (icr > 80 && icr <= 90) return 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30';
  if (icr > 90) return 'text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/30';
  return 'text-slate-600 bg-slate-50';
}

function getSolvencyColor(ratio: number): string {
  if (ratio >= 2.0) return 'text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30';
  if (ratio >= 1.5) return 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30';
  return 'text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/30';
}

function getMythCatIcon(cat: string) {
  switch (cat) {
    case 'health': return Heart;
    case 'life': return Shield;
    case 'motor': return Car;
    default: return AlertTriangle;
  }
}

// ── Sort icon component ──────────────────────────────────────────────────
function SortIcon({ column, sortKey, sortDir }: { column: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (sortKey !== column) return <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />;
  return sortDir === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />;
}

// ── Main Component ────────────────────────────────────────────────────────
export default function KnowledgeBaseSection() {
  const [activeTab, setActiveTab] = useState('glossary');

  // Glossary state
  const [glossarySearch, setGlossarySearch] = useState('');
  const [glossaryCat, setGlossaryCat] = useState<GlossaryCategory>('all');

  // Articles state
  const [articleSearch, setArticleSearch] = useState('');
  const [articleCat, setArticleCat] = useState('all');

  // Myth busters state
  const [mythCat, setMythCat] = useState<MythCategory>('all');

  // Comparison state
  const [compareCat, setCompareCat] = useState<CompareCategory>('all');
  const [sortKey, setSortKey] = useState<SortKey>('csr');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  // ── Filtered data ──────────────────────────────────────────────────────
  const filteredGlossary = useMemo(() => {
    let data = [...policyGlossary];
    if (glossaryCat !== 'all') data = data.filter(g => g.category === glossaryCat);
    if (glossarySearch.trim()) {
      const q = glossarySearch.toLowerCase();
      data = data.filter(g =>
        g.term.toLowerCase().includes(q) ||
        (g.hindiTerm && g.hindiTerm.includes(glossarySearch)) ||
        g.explanation.toLowerCase().includes(q)
      );
    }
    return data;
  }, [glossarySearch, glossaryCat]);

  const filteredArticles = useMemo(() => {
    let data = [...blogArticles];
    if (articleCat !== 'all') data = data.filter(a => a.category.toLowerCase() === articleCat.toLowerCase());
    if (articleSearch.trim()) {
      const q = articleSearch.toLowerCase();
      data = data.filter(a =>
        a.title.toLowerCase().includes(q) ||
        (a.excerpt && a.excerpt.toLowerCase().includes(q))
      );
    }
    return data;
  }, [articleSearch, articleCat]);

  const filteredMyths = useMemo(() => {
    if (mythCat === 'all') return mythBusters;
    return mythBusters.filter(m => m.category === mythCat);
  }, [mythCat]);

  const filteredCompanies = useMemo(() => {
    let data = [...insuranceCompanies];
    if (compareCat !== 'all') data = data.filter(c => c.category === compareCat);
    data.sort((a, b) => {
      const aVal = a[sortKey as keyof typeof a] ?? 0;
      const bVal = b[sortKey as keyof typeof b] ?? 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    return data;
  }, [compareCat, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const tabConfig = [
    { value: 'glossary', label: 'Glossary', icon: BookOpen, count: policyGlossary.length },
    { value: 'articles', label: 'Articles', icon: Sparkles, count: blogArticles.length },
    { value: 'myths', label: 'Myth Busters', icon: AlertTriangle, count: mythBusters.length },
    { value: 'compare', label: 'Compare', icon: TrendingUp, count: insuranceCompanies.length },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex flex-wrap justify-center gap-2 bg-transparent h-auto p-0 mb-6">
          {tabConfig.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.value;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={`
                  flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300
                  data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600
                  data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25
                  data-[state=inactive]:bg-card data-[state=inactive]:border data-[state=inactive]:border-border
                  data-[state=inactive]:hover:border-blue-300 data-[state=inactive]:hover:text-blue-600
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                <Badge className={`text-[10px] px-1.5 py-0 h-4 min-w-[1.25rem] flex items-center justify-center rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300'}`}>
                  {tab.count}
                </Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* GLOSSARY TAB                                                       */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <TabsContent value="glossary" className="space-y-4">
          {/* Search + Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search terms... (e.g., 'premium', 'क्लेम')"
                value={glossarySearch}
                onChange={(e) => setGlossarySearch(e.target.value)}
                className="pl-9 rounded-xl border-blue-200 focus:border-blue-500 dark:border-blue-800 dark:focus:border-blue-500"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {(['all', 'health', 'life', 'motor', 'general'] as GlossaryCategory[]).map(cat => (
                <button
                  key={cat}
                  onClick={() => setGlossaryCat(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    glossaryCat === cat
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-card border border-border text-muted-foreground hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            {filteredGlossary.length} terms found {glossarySearch && `for "${glossarySearch}"`}
          </p>

          {/* Glossary Accordion */}
          <div className="max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
            <Accordion type="multiple" className="space-y-2">
              {filteredGlossary.map((term, i) => (
                <motion.div
                  key={`${term.term}-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                >
                  <AccordionItem
                    value={`${term.term}-${i}`}
                    className="border border-border/50 rounded-2xl px-4 data-[state=open]:border-blue-300 data-[state=open]:bg-blue-50/30 dark:data-[state=open]:bg-blue-950/20 transition-all"
                  >
                    <AccordionTrigger className="hover:no-underline py-3">
                      <div className="flex items-center gap-3 text-left flex-1 min-w-0">
                        <span className="font-semibold text-foreground text-sm truncate">{term.term}</span>
                        {term.hindiTerm && (
                          <span className="text-xs text-blue-600 dark:text-blue-400 shrink-0">({term.hindiTerm})</span>
                        )}
                        <Badge className={`text-[10px] px-1.5 py-0 border shrink-0 ${getGlossaryCatStyle(term.category)}`}>
                          {term.category}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground pb-4 space-y-3">
                      <p className="leading-relaxed">{term.explanation}</p>
                      {term.example && (
                        <div className="p-3 bg-muted/50 rounded-xl border border-border/30">
                          <p className="text-xs font-medium text-foreground mb-1">💡 Example:</p>
                          <p className="text-xs text-muted-foreground">{term.example}</p>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
            {filteredGlossary.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No terms found. Try a different search.</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* ARTICLES TAB                                                       */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <TabsContent value="articles" className="space-y-4">
          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={articleSearch}
                onChange={(e) => setArticleSearch(e.target.value)}
                className="pl-9 rounded-xl border-blue-200 focus:border-blue-500 dark:border-blue-800 dark:focus:border-blue-500"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {['all', 'health', 'life', 'motor', 'general'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setArticleCat(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    articleCat === cat
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-card border border-border text-muted-foreground hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Article Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.08, 0.4) }}
                whileHover={{ y: -4 }}
                className="card-premium rounded-2xl p-5 bg-card cursor-pointer group border border-border/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={`text-[10px] rounded-full ${article.category.toLowerCase() === 'health' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300' : article.category.toLowerCase() === 'life' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' : article.category.toLowerCase() === 'motor' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' : 'bg-slate-50 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300'}`}>
                    {article.category}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime} min
                  </span>
                </div>
                <h4 className="font-bold text-foreground mb-2 group-hover:text-blue-600 transition-colors text-sm leading-snug line-clamp-3">
                  {article.title}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{article.excerpt}</p>

                {article.keyTakeaways && article.keyTakeaways.length > 0 && (
                  <div className="space-y-1.5 mb-3">
                    {article.keyTakeaways.slice(0, 2).map((point, pi) => (
                      <div key={pi} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-muted-foreground line-clamp-1">{point}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/30">
                  <span className="text-[9px] text-muted-foreground/60">{article.source}</span>
                  <ChevronRight className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
          {filteredArticles.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No articles found.</p>
            </div>
          )}
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* MYTH BUSTERS TAB                                                   */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <TabsContent value="myths" className="space-y-4">
          {/* Category Filter */}
          <div className="flex gap-1.5 flex-wrap">
            {(['all', 'health', 'life', 'motor', 'general'] as MythCategory[]).map(cat => {
              const Icon = getMythCatIcon(cat);
              return (
                <button
                  key={cat}
                  onClick={() => setMythCat(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    mythCat === cat
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-card border border-border text-muted-foreground hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              );
            })}
          </div>

          {/* Myth Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {filteredMyths.map((myth, i) => (
              <motion.div
                key={myth.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.08, 0.4) }}
                whileHover={{ y: -4 }}
                className="card-premium rounded-2xl p-5 bg-card border border-border/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300"
              >
                {/* Category Badge */}
                <Badge className={`mb-3 text-[10px] ${myth.category === 'health' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300' : myth.category === 'life' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' : myth.category === 'motor' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' : 'bg-slate-50 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300'}`}>
                  {myth.category}
                </Badge>

                {/* Myth */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center shrink-0">
                    <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1">Myth</p>
                    <p className="text-sm font-semibold text-foreground leading-snug">{myth.myth}</p>
                  </div>
                </div>

                {/* Fact */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-green-100 dark:bg-green-950/40 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider mb-1">Fact</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{myth.fact || myth.reality}</p>
                  </div>
                </div>

                {/* Stat + Source */}
                {(myth.statistic || myth.stat) && (
                  <div className="mt-3 p-2.5 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-blue-500" />
                      <p className="text-[10px] font-semibold text-blue-700 dark:text-blue-300">
                        {myth.statistic || myth.stat}
                      </p>
                    </div>
                  </div>
                )}
                {myth.source && (
                  <p className="text-[9px] text-muted-foreground/50 mt-2">Source: {myth.source}</p>
                )}
              </motion.div>
            ))}
          </div>
          {filteredMyths.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No myths found for this category.</p>
            </div>
          )}
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* COMPARE TAB — Company Comparison Table                             */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <TabsContent value="compare" className="space-y-4">
          {/* Category Filter + Legend */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {(['all', 'health', 'life'] as CompareCategory[]).map(cat => (
                <button
                  key={cat}
                  onClick={() => setCompareCat(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    compareCat === cat
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-card border border-border text-muted-foreground hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600'
                  }`}
                >
                  {cat === 'all' ? 'All Companies' : cat === 'health' ? '🏥 Health & General' : '🛡️ Life Insurance'}
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-100 dark:bg-green-950/50 border border-green-200" /> High (&ge;99% CSR)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-100 dark:bg-amber-950/50 border border-amber-200" /> Medium (95-99%)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-rose-100 dark:bg-rose-950/50 border border-rose-200" /> Low (&lt;95%)</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left px-4 py-3 font-semibold text-foreground">
                    <button onClick={() => handleSort('name')} className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                      Company <SortIcon column="name" sortKey={sortKey} sortDir={sortDir} />
                    </button>
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-foreground">Type</th>
                  <th className="text-center px-4 py-3 font-semibold text-foreground">
                    <button onClick={() => handleSort('csr')} className="flex items-center gap-1 mx-auto hover:text-blue-600 transition-colors">
                      CSR 2026 <SortIcon column="csr" sortKey={sortKey} sortDir={sortDir} />
                    </button>
                  </th>
                  {compareCat !== 'life' && (
                    <th className="text-center px-4 py-3 font-semibold text-foreground">
                      <button onClick={() => handleSort('icr')} className="flex items-center gap-1 mx-auto hover:text-blue-600 transition-colors">
                        ICR <SortIcon column="icr" sortKey={sortKey} sortDir={sortDir} />
                      </button>
                    </th>
                  )}
                  <th className="text-center px-4 py-3 font-semibold text-foreground">
                    <button onClick={() => handleSort('solvency')} className="flex items-center gap-1 mx-auto hover:text-blue-600 transition-colors">
                      Solvency <SortIcon column="solvency" sortKey={sortKey} sortDir={sortDir} />
                    </button>
                  </th>
                  {compareCat === 'life' && (
                    <th className="text-center px-4 py-3 font-semibold text-foreground">₹1 Cr Term</th>
                  )}
                  {compareCat !== 'life' && (
                    <th className="text-center px-4 py-3 font-semibold text-foreground">Network</th>
                  )}
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Key Features</th>
                  <th className="text-center px-4 py-3 font-semibold text-foreground">
                    <button onClick={() => handleSort('rating')} className="flex items-center gap-1 mx-auto hover:text-blue-600 transition-colors">
                      Rating <SortIcon column="rating" sortKey={sortKey} sortDir={sortDir} />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((company, i) => (
                  <tr key={company.name} className={`border-b border-border/50 hover:bg-blue-50/30 dark:hover:bg-blue-950/10 transition-colors ${i % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}>
                    <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">{company.name}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant="outline" className={`text-[10px] ${company.category === 'health' ? 'border-rose-200 text-rose-600 dark:border-rose-800 dark:text-rose-400' : 'border-blue-200 text-blue-600 dark:border-blue-800 dark:text-blue-400'}`}>
                        {company.category === 'health' ? 'Health' : 'Life'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold ${getCsrColor(company.csr2026)}`}>
                        {company.csr2026}%
                      </span>
                    </td>
                    {compareCat !== 'life' && (
                      <td className="px-4 py-3 text-center">
                        {company.icr2026 ? (
                          <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold ${getIcrColor(company.icr2026)}`}>
                            {company.icr2026}%
                          </span>
                        ) : '—'}
                      </td>
                    )}
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold ${getSolvencyColor(company.solvencyRatio)}`}>
                        {company.solvencyRatio}
                      </span>
                    </td>
                    {compareCat === 'life' && (
                      <td className="px-4 py-3 text-center text-sm font-medium text-foreground">{company.premium1crTerm || '—'}</td>
                    )}
                    {compareCat !== 'life' && (
                      <td className="px-4 py-3 text-center text-sm text-muted-foreground">
                        {company.networkHospitals ? `${(company.networkHospitals / 1000).toFixed(1)}K` : '—'}
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {company.features.slice(0, 2).map((f, fi) => (
                          <span key={fi} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300 whitespace-nowrap">{f}</span>
                        ))}
                        {company.features.length > 2 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">+{company.features.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-bold text-amber-500">{'★'.repeat(Math.round(company.rating))}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Disease-Specific Plans */}
          <div className="mt-6">
            <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              Disease-Specific Insurance Plans
            </h4>
            <div className="grid sm:grid-cols-3 gap-3">
              {diseaseSpecificPlans.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -3 }}
                  className="card-premium rounded-xl p-4 bg-card border border-border/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-[9px] rounded-full">
                      {plan.disease}
                    </Badge>
                  </div>
                  <h5 className="font-bold text-foreground text-xs mb-1">{plan.name}</h5>
                  <p className="text-[10px] text-muted-foreground mb-2">by {plan.insurer}</p>
                  <div className="space-y-1 mb-2">
                    {plan.features.slice(0, 2).map((f, fi) => (
                      <div key={fi} className="flex items-start gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-green-500 shrink-0 mt-0.5" />
                        <p className="text-[9px] text-muted-foreground line-clamp-1">{f}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border/30">
                    <span className="text-[10px] font-semibold gradient-text">{plan.startingPremium}</span>
                    <span className="text-[9px] text-muted-foreground/60">{plan.waitingPeriod}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Market Comparison Cards */}
          <div className="mt-6">
            <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              Top Health Plans Comparison
            </h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {marketComparisons.map((plan, i) => (
                <motion.div
                  key={plan.planName}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -3 }}
                  className="card-premium rounded-xl p-4 bg-card border border-border/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-bold text-foreground text-xs">{plan.planName}</h5>
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${getCsrColor(plan.csr)}`}>
                      {plan.csr}% CSR
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-2">by {plan.insurer}</p>
                  <div className="grid grid-cols-2 gap-2 mb-2 text-[9px]">
                    <div>
                      <span className="text-muted-foreground">Coverage</span>
                      <p className="font-semibold text-foreground">{plan.coverage}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Premium</span>
                      <p className="font-semibold text-foreground">{plan.premium}</p>
                    </div>
                  </div>
                  <p className="text-[9px] text-muted-foreground mb-2">Waiting: {plan.waitingPeriod}</p>
                  <div className="flex flex-wrap gap-1">
                    {plan.uniqueBenefits.slice(0, 2).map((b, bi) => (
                      <span key={bi} className="text-[8px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">{b}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Info className="w-3 h-3" />
            Source: IRDAI Annual Report 2025-26 | CSR = Claim Settlement Ratio | ICR = Incurred Claim Ratio | Solvency min. 1.5 (IRDAI)
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
