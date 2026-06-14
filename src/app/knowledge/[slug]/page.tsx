'use client';

import { useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Clock, BookOpen, CheckCircle2, ChevronRight,
  Shield, AlertTriangle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbSeparator, BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import {
  knowledgeArticles,
  getArticleBySlug,
  getRelatedArticles,
  getCategoryStyle,
  getCategoryGradient,
  getCategoryIcon,
} from '@/lib/knowledge-data';
import { ThemeToggle } from '@/components/ThemeToggle';

// ── Simple Markdown-like renderer ──────────────────────────────────────────
function renderBody(body: string) {
  const lines = body.trim().split('\n');
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  let tableHeaders: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Table handling
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const cells = line.split('|').filter(c => c.trim() !== '').map(c => c.trim());
      if (cells.every(c => /^[-:]+$/.test(c))) {
        // Separator row — skip
        continue;
      }
      if (!inTable) {
        inTable = true;
        tableHeaders = cells;
        tableRows = [];
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      // End of table — render it
      elements.push(renderTable(tableHeaders, tableRows, elements.length));
      inTable = false;
      tableHeaders = [];
      tableRows = [];
    }

    // Skip empty lines
    if (!line.trim()) continue;

    // Headings
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-lg font-bold text-foreground mt-8 mb-3">
          {line.replace('### ', '')}
        </h3>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-xl sm:text-2xl font-bold text-foreground mt-10 mb-4">
          {line.replace('## ', '')}
        </h2>
      );
    }
    // Numbered list
    else if (/^\d+\.\s/.test(line.trim())) {
      const text = line.trim().replace(/^\d+\.\s/, '');
      elements.push(
        <div key={`ol-${i}`} className="flex items-start gap-3 ml-2 my-1.5">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-bold shrink-0 mt-0.5">
            {line.trim().charAt(0)}
          </span>
          <p className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(text) }} />
        </div>
      );
    }
    // Bullet list
    else if (line.trim().startsWith('- ')) {
      const text = line.trim().replace('- ', '');
      elements.push(
        <div key={`ul-${i}`} className="flex items-start gap-2 ml-2 my-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
          <p className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(text) }} />
        </div>
      );
    }
    // Regular paragraph
    else {
      elements.push(
        <p key={`p-${i}`} className="text-sm text-muted-foreground leading-relaxed my-2" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
      );
    }
  }

  // If table is the last element
  if (inTable && tableHeaders.length > 0) {
    elements.push(renderTable(tableHeaders, tableRows, elements.length));
  }

  return elements;
}

function renderTable(headers: string[], rows: string[][], key: number) {
  return (
    <div key={`table-${key}`} className="overflow-x-auto rounded-xl border border-border my-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50 border-b border-border">
            {headers.map((h, i) => (
              <th key={i} className="text-left px-4 py-2.5 font-semibold text-foreground text-xs">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={`border-b border-border/50 ${ri % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-2.5 text-xs text-muted-foreground" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(cell) }} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="px-1 py-0.5 rounded bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-xs">$1</code>');
}

// ── Main Page Component ────────────────────────────────────────────────────
export default function BlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const article = useMemo(() => getArticleBySlug(slug), [slug]);
  const relatedArticles = useMemo(
    () => article ? getRelatedArticles(article.relatedSlugs) : [],
    [article]
  );

  // 404 State
  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button onClick={() => router.push('/')} className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/50 transition-all group-hover:scale-105">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Paliwal<span className="gradient-text"> Secure</span>
                </span>
              </button>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button variant="ghost" size="sm" onClick={() => router.push('/knowledge')} className="gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600">
                  <ArrowLeft className="w-4 h-4" /> Knowledge Hub
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center px-4">
            <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-blue-500" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Article Not Found</h1>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Yeh article abhi available nahi hai. Kya aap Knowledge Hub pe jaana chahenge?
            </p>
            <Button
              onClick={() => router.push('/knowledge')}
              className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg shadow-blue-500/25"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Knowledge Hub
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ── Navigation Bar ──────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => router.push('/')} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/50 transition-all group-hover:scale-105">
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
                onClick={() => router.push('/knowledge')}
                className="gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Knowledge Hub</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <section className={`relative pt-16 sm:pt-20 overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(article.category)}`} />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 animate-gradient-x bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.05)_50%,transparent_70%)] bg-[length:200%_100%]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Breadcrumb */}
            <div className="mb-6">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="text-white/70 hover:text-white transition-colors">
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-white/40" />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/knowledge" className="text-white/70 hover:text-white transition-colors">
                      Knowledge Hub
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-white/40" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-white font-medium">
                      {article.title.length > 40 ? article.title.substring(0, 40) + '...' : article.title}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Category & Read Time */}
            <div className="flex items-center gap-3 mb-4">
              <Badge className={`text-xs rounded-full border ${getCategoryStyle(article.category)} bg-white/10 border-white/20 text-white`}>
                {getCategoryIcon(article.category)} {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
              </Badge>
              <span className="text-sm text-white/80 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime} min read
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {article.title}
            </h1>

            {/* Summary */}
            <p className="mt-4 text-sm sm:text-base text-white/80 max-w-2xl leading-relaxed">
              {article.summary}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Article Body ─────────────────────────────────────────────── */}
      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_280px] gap-8 lg:gap-12">
            {/* Main Content */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="min-w-0"
            >
              {/* Article Body */}
              <div className="prose-custom glass-liquid rounded-2xl p-5 sm:p-8 border border-border/50">
                {renderBody(article.body)}
              </div>

              {/* Key Takeaways */}
              {article.keyTakeaways.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mt-8 glass-liquid rounded-2xl p-5 sm:p-6 border border-blue-200/50 dark:border-blue-800/50"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Key Takeaways</h3>
                  </div>
                  <div className="space-y-3">
                    {article.keyTakeaways.map((point, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-sm text-muted-foreground leading-relaxed">{point}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* IRDAI Disclaimer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-8 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-1">IRDAI Disclaimer</p>
                    <p className="text-xs text-amber-700/80 dark:text-amber-400/80 leading-relaxed">
                      Insurance is a subject matter of solicitation. The information provided in this article is for educational purposes only and does not constitute financial advice. Policy terms, conditions, and premiums may vary. Please read the policy document carefully and consult a certified insurance advisor before making any purchase decisions.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Back to Knowledge Hub */}
              <div className="mt-8">
                <Button
                  variant="outline"
                  onClick={() => router.push('/knowledge')}
                  className="gap-2 rounded-full border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950/30"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Knowledge Hub
                </Button>
              </div>
            </motion.article>

            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="sticky top-24 space-y-6">
                {/* Article Info Card */}
                <div className="glass-liquid rounded-2xl p-5 border border-border/50">
                  <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    Article Info
                  </h4>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Category</span>
                      <Badge className={`text-[10px] px-2 py-0 border ${getCategoryStyle(article.category)}`}>
                        {article.category}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Read Time</span>
                      <span className="text-xs font-medium text-foreground">{article.readTime} min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Key Points</span>
                      <span className="text-xs font-medium text-foreground">{article.keyTakeaways.length}</span>
                    </div>
                  </div>
                </div>

                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                  <div className="glass-liquid rounded-2xl p-5 border border-border/50">
                    <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      Related Articles
                    </h4>
                    <div className="space-y-3">
                      {relatedArticles.map((rel) => (
                        <button
                          key={rel.slug}
                          onClick={() => router.push(`/knowledge/${rel.slug}`)}
                          className="w-full text-left p-3 rounded-xl border border-border/50 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all duration-200 group"
                        >
                          <div className="flex items-start gap-2">
                            <Badge className={`text-[8px] px-1.5 py-0 border shrink-0 mt-0.5 ${getCategoryStyle(rel.category)}`}>
                              {rel.category}
                            </Badge>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-foreground group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                                {rel.title}
                              </p>
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                                <Clock className="w-2.5 h-2.5" />
                                {rel.readTime} min
                              </span>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-blue-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.aside>
          </div>

          {/* Mobile: Related Articles */}
          {relatedArticles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="lg:hidden mt-8"
            >
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                Related Articles
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {relatedArticles.map((rel) => (
                  <button
                    key={rel.slug}
                    onClick={() => router.push(`/knowledge/${rel.slug}`)}
                    className="card-premium rounded-2xl p-4 bg-card border border-border/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 text-left group"
                  >
                    <Badge className={`text-[9px] px-1.5 py-0 border mb-2 ${getCategoryStyle(rel.category)}`}>
                      {getCategoryIcon(rel.category)} {rel.category}
                    </Badge>
                    <h4 className="font-bold text-foreground text-sm mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{rel.summary}</p>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {rel.readTime} min read
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
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
