'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  FileText,
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from '@/hooks/use-toast';

// ── Types ────────────────────────────────────────────────────────────────────
interface GlossaryTerm {
  id: string;
  term: string;
  hindiTerm: string | null;
  explanation: string;
  example: string | null;
  category: string;
  importance: string;
  status: string;
  version: number;
  createdAt: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  keyTakeaways: string | null;
  readTime: number;
  status: string;
  version: number;
  author: string | null;
  source: string | null;
  publishedAt: string | null;
  createdAt: string;
}

// ── Status Badge ─────────────────────────────────────────────────────────────
function ContentStatusBadge({ status }: { status: string }) {
  const config: Record<string, { className: string }> = {
    draft: { className: 'bg-amber-100 text-amber-700 border-amber-200' },
    published: { className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    archived: { className: 'bg-slate-100 text-slate-600 border-slate-200' },
  };
  const c = config[status] || { className: 'bg-slate-100 text-slate-700 border-slate-200' };
  return (
    <Badge variant="outline" className={`text-xs ${c.className}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function ContentModerationPage() {
  const { accessToken, user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  // ── Glossary State ─────────────────────────────────────────────────────
  const [glossaryTerms, setGlossaryTerms] = useState<GlossaryTerm[]>([]);
  const [glossaryTotal, setGlossaryTotal] = useState(0);
  const [glossaryPage, setGlossaryPage] = useState(1);
  const [glossaryTotalPages, setGlossaryTotalPages] = useState(1);
  const [glossaryLoading, setGlossaryLoading] = useState(true);
  const [glossarySearch, setGlossarySearch] = useState('');
  const [glossarySearchInput, setGlossarySearchInput] = useState('');

  // Glossary dialog
  const [glossaryDialogOpen, setGlossaryDialogOpen] = useState(false);
  const [editingGlossary, setEditingGlossary] = useState<GlossaryTerm | null>(null);
  const [gForm, setGForm] = useState({
    term: '',
    hindiTerm: '',
    explanation: '',
    example: '',
    category: 'general',
    importance: 'medium',
    status: 'draft',
  });
  const [gSaving, setGSaving] = useState(false);

  // Glossary delete dialog
  const [glossaryDeleteId, setGlossaryDeleteId] = useState<string | null>(null);
  const [gDeleting, setGDeleting] = useState(false);

  // ── Articles State ─────────────────────────────────────────────────────
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesTotal, setArticlesTotal] = useState(0);
  const [articlesPage, setArticlesPage] = useState(1);
  const [articlesTotalPages, setArticlesTotalPages] = useState(1);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [articlesSearch, setArticlesSearch] = useState('');
  const [articlesSearchInput, setArticlesSearchInput] = useState('');

  // Article dialog
  const [articleDialogOpen, setArticleDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [aForm, setAForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'general',
    keyTakeaways: '',
    readTime: 5,
    status: 'draft',
    author: '',
    source: '',
  });
  const [aSaving, setASaving] = useState(false);

  // Article delete dialog
  const [articleDeleteId, setArticleDeleteId] = useState<string | null>(null);
  const [aDeleting, setADeleting] = useState(false);

  const glossaryLimit = 10;
  const articlesLimit = 10;

  // ── Fetch Glossary ─────────────────────────────────────────────────────
  const fetchGlossary = useCallback(async () => {
    if (!accessToken) return;
    setGlossaryLoading(true);
    try {
      const params = new URLSearchParams({
        page: glossaryPage.toString(),
        limit: glossaryLimit.toString(),
      });
      if (glossarySearch) params.set('search', glossarySearch);

      const res = await fetch(`/api/admin/content/glossary?${params}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      setGlossaryTerms(data.data || []);
      setGlossaryTotal(data.pagination?.total || 0);
      setGlossaryTotalPages(data.pagination?.totalPages || 1);
    } catch {
      toast({ title: 'Error', description: 'Failed to load glossary', variant: 'destructive' });
    } finally {
      setGlossaryLoading(false);
    }
  }, [accessToken, glossaryPage, glossarySearch]);

  // ── Fetch Articles ─────────────────────────────────────────────────────
  const fetchArticles = useCallback(async () => {
    if (!accessToken) return;
    setArticlesLoading(true);
    try {
      const params = new URLSearchParams({
        page: articlesPage.toString(),
        limit: articlesLimit.toString(),
      });
      if (articlesSearch) params.set('search', articlesSearch);

      const res = await fetch(`/api/admin/content/articles?${params}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      setArticles(data.data || []);
      setArticlesTotal(data.pagination?.total || 0);
      setArticlesTotalPages(data.pagination?.totalPages || 1);
    } catch {
      toast({ title: 'Error', description: 'Failed to load articles', variant: 'destructive' });
    } finally {
      setArticlesLoading(false);
    }
  }, [accessToken, articlesPage, articlesSearch]);

  useEffect(() => {
    fetchGlossary();
  }, [fetchGlossary]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  useEffect(() => {
    setGlossaryPage(1);
  }, [glossarySearch]);

  useEffect(() => {
    setArticlesPage(1);
  }, [articlesSearch]);

  // ── Glossary CRUD ──────────────────────────────────────────────────────
  const openGlossaryDialog = (term?: GlossaryTerm) => {
    if (term) {
      setEditingGlossary(term);
      setGForm({
        term: term.term,
        hindiTerm: term.hindiTerm || '',
        explanation: term.explanation,
        example: term.example || '',
        category: term.category,
        importance: term.importance,
        status: term.status,
      });
    } else {
      setEditingGlossary(null);
      setGForm({
        term: '',
        hindiTerm: '',
        explanation: '',
        example: '',
        category: 'general',
        importance: 'medium',
        status: 'draft',
      });
    }
    setGlossaryDialogOpen(true);
  };

  const saveGlossary = async () => {
    if (!accessToken) return;
    setGSaving(true);
    try {
      const url = editingGlossary
        ? `/api/admin/content/glossary/${editingGlossary.id}`
        : '/api/admin/content/glossary';
      const method = editingGlossary ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gForm),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Save failed');
      toast({ title: 'Success', description: `Glossary term ${editingGlossary ? 'updated' : 'created'}` });
      setGlossaryDialogOpen(false);
      fetchGlossary();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to save glossary',
        variant: 'destructive',
      });
    } finally {
      setGSaving(false);
    }
  };

  const deleteGlossary = async () => {
    if (!accessToken || !glossaryDeleteId) return;
    setGDeleting(true);
    try {
      const res = await fetch(`/api/admin/content/glossary/${glossaryDeleteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Delete failed');
      toast({ title: 'Success', description: 'Glossary term deleted' });
      setGlossaryDeleteId(null);
      fetchGlossary();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to delete',
        variant: 'destructive',
      });
    } finally {
      setGDeleting(false);
    }
  };

  // ── Article CRUD ───────────────────────────────────────────────────────
  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

  const openArticleDialog = (article?: Article) => {
    if (article) {
      setEditingArticle(article);
      setAForm({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt || '',
        content: article.content,
        category: article.category,
        keyTakeaways: article.keyTakeaways || '',
        readTime: article.readTime,
        status: article.status,
        author: article.author || '',
        source: article.source || '',
      });
    } else {
      setEditingArticle(null);
      setAForm({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: 'general',
        keyTakeaways: '',
        readTime: 5,
        status: 'draft',
        author: '',
        source: '',
      });
    }
    setArticleDialogOpen(true);
  };

  const saveArticle = async () => {
    if (!accessToken) return;
    setASaving(true);
    try {
      const url = editingArticle
        ? `/api/admin/content/articles/${editingArticle.id}`
        : '/api/admin/content/articles';
      const method = editingArticle ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aForm),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Save failed');
      toast({ title: 'Success', description: `Article ${editingArticle ? 'updated' : 'created'}` });
      setArticleDialogOpen(false);
      fetchArticles();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to save article',
        variant: 'destructive',
      });
    } finally {
      setASaving(false);
    }
  };

  const deleteArticle = async () => {
    if (!accessToken || !articleDeleteId) return;
    setADeleting(true);
    try {
      const res = await fetch(`/api/admin/content/articles/${articleDeleteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Delete failed');
      toast({ title: 'Success', description: 'Article deleted' });
      setArticleDeleteId(null);
      fetchArticles();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to delete',
        variant: 'destructive',
      });
    } finally {
      setADeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="glossary">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="glossary" className="gap-1.5">
            <BookOpen className="w-4 h-4" />
            Glossary
          </TabsTrigger>
          <TabsTrigger value="articles" className="gap-1.5">
            <FileText className="w-4 h-4" />
            Articles
          </TabsTrigger>
        </TabsList>

        {/* ══════════════════════════════════════════════════════════════════════
            GLOSSARY TAB
        ══════════════════════════════════════════════════════════════════════ */}
        <TabsContent value="glossary" className="space-y-4 mt-4">
          {/* Toolbar */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <Input
                  placeholder="Search glossary..."
                  value={glossarySearchInput}
                  onChange={(e) => setGlossarySearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setGlossarySearch(glossarySearchInput);
                      setGlossaryPage(1);
                    }
                  }}
                  className="max-w-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setGlossarySearch(glossarySearchInput);
                    setGlossaryPage(1);
                  }}
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
              <Button
                className="bg-amber-500 hover:bg-amber-600 text-white"
                onClick={() => openGlossaryDialog()}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Term
              </Button>
            </CardContent>
          </Card>

          {/* Table */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-0">
              {glossaryLoading ? (
                <div className="flex items-center justify-center h-48">
                  <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                </div>
              ) : glossaryTerms.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p>No glossary terms found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Term</TableHead>
                        <TableHead>Hindi</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Importance</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Version</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {glossaryTerms.map((term) => (
                        <TableRow key={term.id}>
                          <TableCell>
                            <p className="font-medium text-sm text-slate-700">{term.term}</p>
                            <p className="text-xs text-slate-400 truncate max-w-[200px]">
                              {term.explanation}
                            </p>
                          </TableCell>
                          <TableCell className="text-sm text-slate-600">
                            {term.hindiTerm || '—'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize text-xs">
                              {term.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                term.importance === 'critical'
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : term.importance === 'high'
                                  ? 'bg-orange-50 text-orange-700 border-orange-200'
                                  : 'bg-slate-50 text-slate-600 border-slate-200'
                              }`}
                            >
                              {term.importance}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <ContentStatusBadge status={term.status} />
                          </TableCell>
                          <TableCell className="text-sm text-slate-500">v{term.version}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                onClick={() => openGlossaryDialog(term)}
                              >
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              {isAdmin && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => setGlossaryDeleteId(term.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {glossaryTotalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Total: {glossaryTotal} terms
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={glossaryPage <= 1}
                  onClick={() => setGlossaryPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-slate-600">
                  {glossaryPage} / {glossaryTotalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={glossaryPage >= glossaryTotalPages}
                  onClick={() => setGlossaryPage((p) => p + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* ══════════════════════════════════════════════════════════════════════
            ARTICLES TAB
        ══════════════════════════════════════════════════════════════════════ */}
        <TabsContent value="articles" className="space-y-4 mt-4">
          {/* Toolbar */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <Input
                  placeholder="Search articles..."
                  value={articlesSearchInput}
                  onChange={(e) => setArticlesSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setArticlesSearch(articlesSearchInput);
                      setArticlesPage(1);
                    }
                  }}
                  className="max-w-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setArticlesSearch(articlesSearchInput);
                    setArticlesPage(1);
                  }}
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
              <Button
                className="bg-amber-500 hover:bg-amber-600 text-white"
                onClick={() => openArticleDialog()}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Article
              </Button>
            </CardContent>
          </Card>

          {/* Table */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-0">
              {articlesLoading ? (
                <div className="flex items-center justify-center h-48">
                  <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                </div>
              ) : articles.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p>No articles found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Read Time</TableHead>
                        <TableHead>Version</TableHead>
                        <TableHead>Published</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {articles.map((article) => (
                        <TableRow key={article.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm text-slate-700">{article.title}</p>
                              <p className="text-xs text-slate-400">/{article.slug}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize text-xs">
                              {article.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <ContentStatusBadge status={article.status} />
                          </TableCell>
                          <TableCell className="text-sm text-slate-600">
                            {article.readTime} min
                          </TableCell>
                          <TableCell className="text-sm text-slate-500">
                            v{article.version}
                          </TableCell>
                          <TableCell className="text-xs text-slate-500">
                            {article.publishedAt
                              ? new Date(article.publishedAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : '—'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                onClick={() => openArticleDialog(article)}
                              >
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              {isAdmin && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => setArticleDeleteId(article.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {articlesTotalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Total: {articlesTotal} articles</p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={articlesPage <= 1}
                  onClick={() => setArticlesPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-slate-600">
                  {articlesPage} / {articlesTotalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={articlesPage >= articlesTotalPages}
                  onClick={() => setArticlesPage((p) => p + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ════════════════════════════════════════════════════════════════════════
          GLOSSARY DIALOG
      ════════════════════════════════════════════════════════════════════════ */}
      <Dialog open={glossaryDialogOpen} onOpenChange={setGlossaryDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-500" />
              {editingGlossary ? 'Edit Glossary Term' : 'Add Glossary Term'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Term *</Label>
              <Input
                className="mt-1"
                value={gForm.term}
                onChange={(e) => setGForm({ ...gForm, term: e.target.value })}
                placeholder="Insurance term..."
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Hindi Term</Label>
              <Input
                className="mt-1"
                value={gForm.hindiTerm}
                onChange={(e) => setGForm({ ...gForm, hindiTerm: e.target.value })}
                placeholder="Hindi translation..."
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Explanation *</Label>
              <Textarea
                className="mt-1"
                rows={3}
                value={gForm.explanation}
                onChange={(e) => setGForm({ ...gForm, explanation: e.target.value })}
                placeholder="Explain the term..."
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Example</Label>
              <Textarea
                className="mt-1"
                rows={2}
                value={gForm.example}
                onChange={(e) => setGForm({ ...gForm, example: e.target.value })}
                placeholder="Example usage..."
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-sm font-medium">Category</Label>
                <Select
                  value={gForm.category}
                  onValueChange={(v) => setGForm({ ...gForm, category: v })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="life">Life</SelectItem>
                    <SelectItem value="motor">Motor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Importance</Label>
                <Select
                  value={gForm.importance}
                  onValueChange={(v) => setGForm({ ...gForm, importance: v })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <Select
                  value={gForm.status}
                  onValueChange={(v) => setGForm({ ...gForm, status: v })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGlossaryDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-amber-500 hover:bg-amber-600 text-white"
              onClick={saveGlossary}
              disabled={gSaving || !gForm.term.trim() || !gForm.explanation.trim()}
            >
              {gSaving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
              {editingGlossary ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════════════════════════════════════
          ARTICLE DIALOG
      ════════════════════════════════════════════════════════════════════════ */}
      <Dialog open={articleDialogOpen} onOpenChange={setArticleDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              {editingArticle ? 'Edit Article' : 'Add Article'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Title *</Label>
              <Input
                className="mt-1"
                value={aForm.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setAForm({
                    ...aForm,
                    title,
                    slug: editingArticle ? aForm.slug : generateSlug(title),
                  });
                }}
                placeholder="Article title..."
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Slug *</Label>
              <Input
                className="mt-1"
                value={aForm.slug}
                onChange={(e) => setAForm({ ...aForm, slug: e.target.value })}
                placeholder="article-url-slug"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Excerpt</Label>
              <Textarea
                className="mt-1"
                rows={2}
                value={aForm.excerpt}
                onChange={(e) => setAForm({ ...aForm, excerpt: e.target.value })}
                placeholder="Brief description..."
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Content *</Label>
              <Textarea
                className="mt-1"
                rows={6}
                value={aForm.content}
                onChange={(e) => setAForm({ ...aForm, content: e.target.value })}
                placeholder="Article content (markdown)..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium">Category</Label>
                <Select
                  value={aForm.category}
                  onValueChange={(v) => setAForm({ ...aForm, category: v })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="life">Life</SelectItem>
                    <SelectItem value="motor">Motor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <Select
                  value={aForm.status}
                  onValueChange={(v) => setAForm({ ...aForm, status: v })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Key Takeaways (comma-separated)</Label>
              <Input
                className="mt-1"
                value={aForm.keyTakeaways}
                onChange={(e) => setAForm({ ...aForm, keyTakeaways: e.target.value })}
                placeholder="Takeaway 1, Takeaway 2, Takeaway 3"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium">Read Time (min)</Label>
                <Input
                  type="number"
                  className="mt-1"
                  value={aForm.readTime}
                  onChange={(e) => setAForm({ ...aForm, readTime: parseInt(e.target.value) || 5 })}
                  min={1}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Author</Label>
                <Input
                  className="mt-1"
                  value={aForm.author}
                  onChange={(e) => setAForm({ ...aForm, author: e.target.value })}
                  placeholder="Author name..."
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Source</Label>
              <Input
                className="mt-1"
                value={aForm.source}
                onChange={(e) => setAForm({ ...aForm, source: e.target.value })}
                placeholder="Source URL or reference..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setArticleDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-amber-500 hover:bg-amber-600 text-white"
              onClick={saveArticle}
              disabled={aSaving || !aForm.title.trim() || !aForm.content.trim()}
            >
              {aSaving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
              {editingArticle ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════════════════════════════════════
          DELETE CONFIRMATION DIALOGS
      ════════════════════════════════════════════════════════════════════════ */}
      <Dialog
        open={!!glossaryDeleteId}
        onOpenChange={(open) => !open && setGlossaryDeleteId(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Glossary Term?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500">
            This action cannot be undone. The glossary term will be permanently removed.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGlossaryDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteGlossary} disabled={gDeleting}>
              {gDeleting && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!articleDeleteId}
        onOpenChange={(open) => !open && setArticleDeleteId(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Article?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500">
            This action cannot be undone. The article will be permanently removed.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setArticleDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteArticle} disabled={aDeleting}>
              {aDeleting && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
