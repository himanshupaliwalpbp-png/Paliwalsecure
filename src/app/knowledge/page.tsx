'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, BookOpen, HelpCircle, BookA, Clock, ChevronRight, ArrowLeft,
  Shield, Heart, Car, Info, Sparkles, ArrowRight, Filter,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from '@/components/ui/accordion';
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbSeparator, BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import {
  knowledgeArticles, faqItems, glossaryTerms,
  getCategoryStyle, getCategoryGradient, getCategoryIcon,
  type ArticleCategory,
} from '@/lib/knowledge-data';
import { ThemeToggle } from '@/components/ThemeToggle';

// ── Animation Variants ─────────────────────────────────────────────────────
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ── Main Page ──────────────────────────────────────────────────────────────
export default function KnowledgeHubPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('blog');

  // Blog state
  const [blogSearch, setBlogSearch] = useState('');
  const [blogCategory, setBlogCategory] = useState<ArticleCategory | 'all'>('all');

  // FAQ state
  const [faqSearch, setFaqSearch] = useState('');

  // Glossary state
  const [glossarySearch, setGlossarySearch] = useState('');
  const [glossaryLetter, setGlossaryLetter] = useState<string | null>(null);

  // ── Filtered Data ─────────────────────────────────────────────────────
  const filteredArticles = useMemo(() => {
    let data = [...knowledgeArticles];
    if (blogCategory !== 'all') data = data.filter(a => a.category === blogCategory);
    if (blogSearch.trim()) {
      const q = blogSearch.toLowerCase();
      data = data.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q)
      );
    }
    return data;
  }, [blogSearch, blogCategory]);

  const filteredFaqs = useMemo(() => {
    if (!faqSearch.trim()) return faqItems;
    const q = faqSearch.toLowerCase();
    return faqItems.filter(f =>
      f.question.toLowerCase().includes(q) ||
      f.answer.toLowerCase().includes(q)
    );
  }, [faqSearch]);

  const filteredGlossary = useMemo(() => {
    let data = [...glossaryTerms];
    if (glossaryLetter) {
      data = data.filter(g => g.term.charAt(0).toUpperCase() === glossaryLetter);
    }
    if (glossarySearch.trim()) {
      const q = glossarySearch.toLowerCase();
      data = data.filter(g =>
        g.term.toLowerCase().includes(q) ||
        g.definition.toLowerCase().includes(q)
      );
    }
    return data.sort((a, b) => a.term.localeCompare(b.term));
  }, [glossarySearch, glossaryLetter]);

  // ── Available Letters ─────────────────────────────────────────────────
  const availableLetters = useMemo(() => {
    const letters = new Set(glossaryTerms.map(g => g.term.charAt(0).toUpperCase()));
    return Array.from(letters).sort();
  }, []);

  const categoryOptions: (ArticleCategory | 'all')[] = ['all', 'health', 'life', 'motor', 'general'];

  const tabConfig = [
    { value: 'blog', label: 'Blog', icon: BookOpen, count: knowledgeArticles.length },
    { value: 'faq', label: 'FAQ', icon: HelpCircle, count: faqItems.length },
    { value: 'glossary', label: 'Glossary', icon: BookA, count: glossaryTerms.length },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      {/* ── Navigation Bar ──────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2.5 group"
              aria-label="Go to homepage"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-105">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Paliwal<span className="gradient-text"> Secure</span>
              </span>
            </button>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
                className="gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero Header ─────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-8 sm:pt-24 sm:pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800" />
        <div className="absolute inset-0 animate-gradient-x bg-[linear-gradient(110deg,transparent_30%,rgba(99,102,241,0.1)_50%,transparent_70%)] bg-[length:200%_100%]" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Breadcrumb */}
            <div className="mb-4">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href="/"
                      className="text-blue-300 hover:text-white transition-colors"
                    >
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-blue-400/50" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-white font-medium">
                      Knowledge Hub
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <Badge className="badge-shimmer mb-4 bg-blue-500/20 text-blue-300 border-blue-400/30 px-4 py-1.5 text-sm font-medium rounded-full">
              📚 InsureGyaan — Knowledge Hub
            </Badge>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Insurance ka{' '}
              <span className="gradient-text">Complete Gyaan</span>
            </h1>
            <p className="mt-3 text-sm sm:text-lg text-slate-300 max-w-2xl">
              Blog articles, common FAQs, aur insurance glossary — sab ek jagah.
              Insurance ki har term aasan bhasha mein samjhiye.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Sticky Tabs Section ─────────────────────────────────────── */}
      <div className="sticky top-16 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex gap-2 bg-transparent h-auto p-3 py-2 w-full justify-start sm:justify-center overflow-x-auto">
              {tabConfig.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.value;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={`
                      flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300 whitespace-nowrap
                      data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600
                      data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25
                      data-[state=inactive]:bg-card data-[state=inactive]:border data-[state=inactive]:border-border
                      data-[state=inactive]:hover:border-blue-300 data-[state=inactive]:hover:text-blue-600
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    <Badge className={`text-[10px] px-1.5 py-0 h-4 min-w-[1.25rem] flex items-center justify-center rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300'}`}>
                      {tab.count}
                    </Badge>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* ── Tab Content ─────────────────────────────────────────────── */}
      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* BLOG TAB                                                  */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <AnimatePresence mode="wait">
            {activeTab === 'blog' && (
              <motion.div
                key="blog"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Search + Filter */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search articles..."
                      value={blogSearch}
                      onChange={(e) => setBlogSearch(e.target.value)}
                      className="pl-9 rounded-xl border-blue-200 focus:border-blue-500 dark:border-blue-800 dark:focus:border-blue-500"
                    />
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {categoryOptions.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setBlogCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                          blogCategory === cat
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                            : 'bg-card border border-border text-muted-foreground hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600'
                        }`}
                      >
                        {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-4">
                  {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
                  {blogSearch && ` for "${blogSearch}"`}
                </p>

                {/* Article Cards Grid */}
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {filteredArticles.map((article) => (
                    <motion.div
                      key={article.slug}
                      variants={staggerItem}
                      whileHover={{ y: -6 }}
                      onClick={() => router.push(`/knowledge/${article.slug}`)}
                      className="card-premium rounded-2xl overflow-hidden bg-card cursor-pointer group border border-border/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300"
                    >
                      {/* Image Placeholder with Gradient Overlay */}
                      <div className={`relative h-40 bg-gradient-to-br ${article.imageGradient} overflow-hidden`}>
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-300" />
                        {/* Gradient overlay text */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                          <Badge className={`text-[10px] rounded-full border ${getCategoryStyle(article.category)}`}>
                            {getCategoryIcon(article.category)} {article.category}
                          </Badge>
                        </div>
                        {/* Decorative icon */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20">
                          <BookOpen className="w-16 h-16" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.readTime} min read
                          </span>
                        </div>
                        <h3 className="font-bold text-foreground mb-2 group-hover:text-blue-600 transition-colors text-sm leading-snug line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                          {article.summary}
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-border/30">
                          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                            Read article
                          </span>
                          <ChevronRight className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {filteredArticles.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium">No articles found</p>
                    <p className="text-sm mt-1">Try a different search term or category</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* FAQ TAB                                                    */}
            {/* ═══════════════════════════════════════════════════════════ */}
            {activeTab === 'faq' && (
              <motion.div
                key="faq"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-center max-w-2xl mx-auto mb-8"
                >
                  <Badge className="mb-3 bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800 rounded-full px-4 py-1">
                    <HelpCircle className="w-3.5 h-3.5 mr-1" />
                    Frequently Asked Questions
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                    Insurance ke{' '}
                    <span className="gradient-text">Common Sawaal</span>
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Woh sawaal jo sabse zyada puche jaate hain — simple language mein jawab
                  </p>
                </motion.div>

                {/* Search */}
                <div className="max-w-lg mx-auto mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search FAQs... (e.g., 'waiting period', 'claim')"
                      value={faqSearch}
                      onChange={(e) => setFaqSearch(e.target.value)}
                      className="pl-9 rounded-xl border-blue-200 focus:border-blue-500 dark:border-blue-800 dark:focus:border-blue-500 h-11"
                    />
                  </div>
                  {faqSearch && (
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      {filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''} for &quot;{faqSearch}&quot;
                    </p>
                  )}
                </div>

                {/* FAQ Accordion */}
                <div className="max-w-3xl mx-auto">
                  <Accordion type="multiple" className="space-y-3">
                    {filteredFaqs.map((faq, i) => (
                      <motion.div
                        key={faq.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.05, 0.3) }}
                      >
                        <AccordionItem
                          value={faq.id}
                          className="border border-border/50 rounded-2xl px-4 sm:px-5 data-[state=open]:border-blue-300 data-[state=open]:bg-blue-50/30 dark:data-[state=open]:bg-blue-950/20 data-[state=open]:shadow-sm transition-all"
                        >
                          <AccordionTrigger className="hover:no-underline py-4">
                            <div className="flex items-start gap-3 text-left flex-1 min-w-0">
                              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-foreground text-sm leading-snug">
                                  {faq.question}
                                </p>
                                <Badge className={`mt-1.5 text-[9px] px-1.5 py-0 border ${getCategoryStyle(faq.category)}`}>
                                  {faq.category}
                                </Badge>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="text-sm text-muted-foreground pb-5 pt-1">
                            <div className="pl-10">
                              <p className="leading-relaxed">{faq.answer}</p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </motion.div>
                    ))}
                  </Accordion>

                  {filteredFaqs.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground">
                      <HelpCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <p className="text-lg font-medium">No matching FAQs</p>
                      <p className="text-sm mt-1">Try a different search term</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* GLOSSARY TAB                                               */}
            {/* ═══════════════════════════════════════════════════════════ */}
            {activeTab === 'glossary' && (
              <motion.div
                key="glossary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-center max-w-2xl mx-auto mb-8"
                >
                  <Badge className="mb-3 bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800 rounded-full px-4 py-1">
                    <BookA className="w-3.5 h-3.5 mr-1" />
                    Insurance Glossary A-Z
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                    Insurance{' '}
                    <span className="gradient-text">Terms Dictionary</span>
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    30+ key insurance terms — aasan bhasha mein samjhiye
                  </p>
                </motion.div>

                {/* Search */}
                <div className="max-w-lg mx-auto mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search terms... (e.g., 'premium', 'deductible')"
                      value={glossarySearch}
                      onChange={(e) => setGlossarySearch(e.target.value)}
                      className="pl-9 rounded-xl border-blue-200 focus:border-blue-500 dark:border-blue-800 dark:focus:border-blue-500 h-11"
                    />
                  </div>
                </div>

                {/* A-Z Filter Bar */}
                <div className="flex justify-center mb-6">
                  <div className="flex flex-wrap justify-center gap-1 max-w-2xl">
                    <button
                      onClick={() => setGlossaryLetter(null)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-200 ${
                        glossaryLetter === null
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                          : 'bg-card border border-border text-muted-foreground hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 hover:border-blue-300'
                      }`}
                    >
                      All
                    </button>
                    {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => {
                      const isAvailable = availableLetters.includes(letter);
                      const isActive = glossaryLetter === letter;
                      return (
                        <button
                          key={letter}
                          onClick={() => setGlossaryLetter(isActive ? null : letter)}
                          disabled={!isAvailable}
                          className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-200 ${
                            isActive
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                              : isAvailable
                                ? 'bg-card border border-border text-muted-foreground hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 hover:border-blue-300'
                                : 'bg-muted/30 text-muted-foreground/30 cursor-not-allowed'
                          }`}
                        >
                          {letter}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center mb-4">
                  {filteredGlossary.length} term{filteredGlossary.length !== 1 ? 's' : ''} found
                  {glossaryLetter && ` starting with "${glossaryLetter}"`}
                  {glossarySearch && ` matching "${glossarySearch}"`}
                </p>

                {/* Glossary Cards */}
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto"
                >
                  {filteredGlossary.map((item) => (
                    <motion.div
                      key={item.term}
                      variants={staggerItem}
                      whileHover={{ y: -4 }}
                      className="card-premium rounded-2xl p-4 sm:p-5 bg-card border border-border/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-bold text-foreground text-sm">{item.term}</h4>
                        <Badge className={`text-[9px] px-1.5 py-0 border shrink-0 ${getCategoryStyle(item.category)}`}>
                          {item.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-3">
                        {item.definition}
                      </p>
                      <a
                        href="#"
                        className="text-[10px] text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-1"
                        onClick={(e) => e.preventDefault()}
                      >
                        Read more <ArrowRight className="w-2.5 h-2.5" />
                      </a>
                    </motion.div>
                  ))}
                </motion.div>

                {filteredGlossary.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    <BookA className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium">No terms found</p>
                    <p className="text-sm mt-1">Try a different letter or search term</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-border/50 bg-muted/30 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-muted-foreground">
            ⚠️ <strong>IRDAI Disclaimer:</strong> Insurance is a subject matter of solicitation. The information provided is for educational purposes only and does not constitute financial advice. Please consult a certified insurance advisor before making any purchase decisions.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            © {new Date().getFullYear()} Paliwal Secure. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
