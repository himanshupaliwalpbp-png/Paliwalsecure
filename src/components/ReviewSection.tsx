'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  MessageSquare,
  PenLine,
  ChevronDown,
  Loader2,
  Filter,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { GAEvents } from '@/lib/ga-events';
import { fireConfetti } from '@/components/Confetti';
import { useLanguage } from '@/lib/i18n';

// ── Types ──────────────────────────────────────────────────────────────────
interface Review {
  id: string;
  productName: string;
  insuranceType: string;
  rating: number;
  title: string;
  body: string;
  photoUrl: string | null;
  reviewerName: string;
  isVerifiedPurchase: boolean;
  helpfulYes: number;
  helpfulNo: number;
  createdAt: string;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
  verifiedCount: number;
}

type InsuranceType = 'all' | 'health' | 'life' | 'motor' | 'travel' | 'home';
type SortOption = 'newest' | 'highest' | 'lowest';

// ── Star Rating Component ──────────────────────────────────────────────────
function StarRating({
  rating,
  size = 'sm',
  interactive = false,
  onChange,
}: {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (r: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const sizeClass = size === 'lg' ? 'w-7 h-7' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform disabled:opacity-100`}
          onClick={() => interactive && onChange?.(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
        >
          <Star
            className={`${sizeClass} ${
              star <= (hover || rating)
                ? 'text-amber-400 fill-amber-400'
                : 'text-gray-400 dark:text-slate-600'
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}

// ── Review Card ────────────────────────────────────────────────────────────
function ReviewCard({
  review,
  onVote,
  votedReviews,
}: {
  review: Review;
  onVote: (id: string, type: 'helpful' | 'not_helpful') => void;
  votedReviews: Set<string>;
}) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const isLong = review.body.length > 200;
  const displayBody = isLong && !expanded ? review.body.slice(0, 200) + '...' : review.body;
  const hasVoted = votedReviews.has(review.id);

  const dateStr = new Date(review.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const insuranceLabel: Record<string, string> = {
    health: t('reviewSection.health'),
    life: t('reviewSection.life'),
    motor: t('reviewSection.motor'),
    travel: t('reviewSection.travel'),
    home: t('reviewSection.homeTab'),
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-[#C98A1C]/30 dark:hover:border-[#C98A1C]/40">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C98A1C] to-[#0A1330] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {review.reviewerName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-foreground truncate">
                  {review.reviewerName}
                </span>
                {review.isVerifiedPurchase && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">{dateStr}</p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="text-[10px] px-2 py-0.5 flex-shrink-0 bg-[#C98A1C]/5 text-[#C98A1C] dark:bg-[#C98A1C]/20 dark:text-[#C98A1C] border-[#C98A1C]/20 dark:border-[#C98A1C]/30"
          >
            {insuranceLabel[review.insuranceType] || review.insuranceType}
          </Badge>
        </div>

        {/* Stars + Product */}
        <div className="flex items-center gap-2 mb-2">
          <StarRating rating={review.rating} size="sm" />
          <span className="text-xs text-muted-foreground">
            {t('reviewSection.for')} {review.productName}
          </span>
        </div>

        {/* Title */}
        <h4 className="font-bold text-sm text-foreground mb-1.5">{review.title}</h4>

        {/* Body */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {displayBody}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-[#C98A1C] dark:text-[#C98A1C] hover:underline mt-1 font-medium"
          >
            {expanded ? t('reviewSection.showLess') : t('reviewSection.readMore')}
          </button>
        )}

        {/* Verified badge */}
        {review.isVerifiedPurchase && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="font-medium">{t('reviewSection.verifiedPurchase')}</span>
          </div>
        )}

        {/* Vote buttons */}
        <div className="mt-4 pt-3 border-t border-border/40 flex items-center gap-4">
          <button
            onClick={() => !hasVoted && onVote(review.id, 'helpful')}
            disabled={hasVoted}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              hasVoted
                ? 'text-slate-400 dark:text-slate-500 cursor-not-allowed'
                : 'text-muted-foreground hover:text-[#C98A1C] dark:hover:text-[#C98A1C]'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{t('reviewSection.helpful')} ({review.helpfulYes})</span>
          </button>
          <button
            onClick={() => !hasVoted && onVote(review.id, 'not_helpful')}
            disabled={hasVoted}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              hasVoted
                ? 'text-slate-400 dark:text-slate-500 cursor-not-allowed'
                : 'text-muted-foreground hover:text-red-500 dark:hover:text-red-400'
            }`}
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            <span>({review.helpfulNo})</span>
          </button>
          {hasVoted && (
            <span className="text-[10px] text-muted-foreground ml-auto">{t('reviewSection.voted')}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main Review Section ────────────────────────────────────────────────────
export default function ReviewSection() {
  const { toast } = useToast();
  const { t } = useLanguage();

  // Data state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter / sort state
  const [activeTab, setActiveTab] = useState<InsuranceType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Voted reviews (stored locally)
  const [votedReviews, setVotedReviews] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    try {
      const stored = localStorage.getItem('paliwal_voted_reviews');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form state
  const [form, setForm] = useState({
    productName: '',
    insuranceType: '',
    rating: 0,
    title: '',
    body: '',
    reviewerName: '',
    reviewerEmail: '',
    reviewerPhone: '',
    photoUrl: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // ── Fetch reviews ──────────────────────────────────────────────────────
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        insuranceType: activeTab === 'all' ? '' : activeTab,
        status: 'approved',
        page: String(page),
        limit: '10',
      });
      if (activeTab !== 'all') {
        params.set('insuranceType', activeTab);
      }

      const res = await fetch(`/api/reviews?${params}`);
      const data = await res.json();

      if (res.ok) {
        let sorted = [...(data.reviews || [])];
        if (sortBy === 'highest') {
          sorted.sort((a: Review, b: Review) => b.rating - a.rating);
        } else if (sortBy === 'lowest') {
          sorted.sort((a: Review, b: Review) => a.rating - b.rating);
        }
        setReviews(sorted);
        setTotalPages(data.totalPages || 1);
      }
    } catch {
      // Silently fail — offline mode
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, sortBy]);

  // ── Fetch stats ────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (activeTab !== 'all') {
        params.set('insuranceType', activeTab);
      }

      const res = await fetch(`/api/reviews/stats?${params}`);
      const data = await res.json();
      if (res.ok) {
        setStats(data);
      }
    } catch {
      // Silently fail
    }
  }, [activeTab]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [activeTab, sortBy]);

  // ── Vote handler ──────────────────────────────────────────────────────
  const handleVote = useCallback(
    async (reviewId: string, voteType: 'helpful' | 'not_helpful') => {
      if (votedReviews.has(reviewId)) return;

      try {
        const res = await fetch(`/api/reviews/${reviewId}/vote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ voteType }),
        });

        if (res.ok) {
          const newVoted = new Set(votedReviews);
          newVoted.add(reviewId);
          setVotedReviews(newVoted);
          GAEvents.reviewVote(voteType, reviewId);
          localStorage.setItem(
            'paliwal_voted_reviews',
            JSON.stringify([...newVoted])
          );

          // Optimistic update
          setReviews((prev) =>
            prev.map((r) =>
              r.id === reviewId
                ? {
                    ...r,
                    helpfulYes: voteType === 'helpful' ? r.helpfulYes + 1 : r.helpfulYes,
                    helpfulNo: voteType === 'not_helpful' ? r.helpfulNo + 1 : r.helpfulNo,
                  }
                : r
            )
          );
        } else {
          const data = await res.json();
          toast({
            title: t('reviewSection.voteFailed'),
            description: data.error || t('reviewSection.couldNotRegister'),
            variant: 'destructive',
          });
        }
      } catch {
        toast({
          title: t('reviewSection.networkError'),
          description: t('reviewSection.checkConnection'),
          variant: 'destructive',
        });
      }
    },
    [votedReviews, toast, t]
  );

  // ── Form validation ───────────────────────────────────────────────────
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};

    if (!form.productName.trim()) errors.productName = t('reviewSection.validation.productName');
    if (!form.insuranceType) errors.insuranceType = t('reviewSection.validation.insuranceType');
    if (form.rating < 1 || form.rating > 5) errors.rating = t('reviewSection.validation.rating');
    if (!form.title.trim()) errors.title = t('reviewSection.validation.title');
    if (form.title.length > 100) errors.title = t('reviewSection.validation.titleLength');
    if (!form.body.trim()) errors.body = t('reviewSection.validation.body');
    if (form.body.length > 2000) errors.body = t('reviewSection.validation.bodyLength');
    if (!form.reviewerName.trim()) errors.reviewerName = t('reviewSection.validation.name');
    if (!form.reviewerEmail.trim()) errors.reviewerEmail = t('reviewSection.validation.email');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.reviewerEmail)) {
      errors.reviewerEmail = t('reviewSection.validation.emailInvalid');
    }
    if (form.reviewerPhone && !/^[6-9]\d{9}$/.test(form.reviewerPhone.replace(/\D/g, ''))) {
      errors.reviewerPhone = t('reviewSection.validation.phoneInvalid');
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [form, t]);

  // ── Submit handler ────────────────────────────────────────────────────
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;

      setSubmitting(true);
      try {
        const res = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productName: form.productName,
            insuranceType: form.insuranceType,
            rating: form.rating,
            title: form.title,
            body: form.body,
            reviewerName: form.reviewerName,
            reviewerEmail: form.reviewerEmail,
            reviewerPhone: form.reviewerPhone || null,
            photoUrl: form.photoUrl || null,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          setSubmitSuccess(true);
          fireConfetti();
          GAEvents.reviewSubmit(form.rating, form.insuranceType);
          toast({
            title: t('reviewSection.reviewSubmitted'),
            description: t('reviewSection.reviewPendingApproval'),
          });
          // Reset form
          setForm({
            productName: '',
            insuranceType: '',
            rating: 0,
            title: '',
            body: '',
            reviewerName: '',
            reviewerEmail: '',
            reviewerPhone: '',
            photoUrl: '',
          });
          setFormErrors({});
        } else {
          toast({
            title: t('reviewSection.submissionFailed'),
            description: data.error || t('reviewSection.somethingWrong'),
            variant: 'destructive',
          });
        }
      } catch {
        toast({
          title: t('reviewSection.networkError'),
          description: t('reviewSection.checkConnection'),
          variant: 'destructive',
        });
      } finally {
        setSubmitting(false);
      }
    },
    [form, validateForm, toast, t]
  );

  // ── Max rating count for distribution bars ────────────────────────────
  const maxRatingCount = stats
    ? Math.max(...Object.values(stats.ratingDistribution), 1)
    : 1;

  // ── Inline form state ──────────────────────────────────────────────────
  const [inlineFormOpen, setInlineFormOpen] = useState(false);
  const ratingLabels = ['', t('reviewSection.poor'), t('reviewSection.fair'), t('reviewSection.good'), t('reviewSection.veryGood'), t('reviewSection.excellent')];

  return (
    <section id="reviews" className="py-16 sm:py-24 lg:py-20 bg-gradient-to-b from-background via-[#C98A1C]/5 to-background dark:via-[#C98A1C]/5 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <Badge className="mb-4 bg-[#C98A1C]/5 text-[#C98A1C] border-[#C98A1C]/20 dark:bg-[#C98A1C]/20 dark:text-[#C98A1C] dark:border-[#C98A1C]/30 rounded-full px-4 py-1">
            <MessageSquare className="w-3.5 h-3.5 mr-1" />
            {t('reviewSection.badge')}
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {t('reviewSection.heading')} &{' '}
            <span className="bg-gradient-to-br from-amber-700 via-amber-500 to-amber-400 dark:from-amber-400 dark:via-amber-300 dark:to-amber-200 bg-clip-text text-transparent">{t('reviewSection.headingHighlight')}</span>
          </h2>
          <p className="mt-3 text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('reviewSection.subtitle')}
          </p>
        </motion.div>

        {/* ── 5-Star Review Submit CTA Card ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-10"
        >
          <Card className="border-amber-200/60 dark:border-0 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-amber-950/30">
              <CardContent className="p-5 sm:p-6">
                {!inlineFormOpen ? (
                  /* ── Collapsed CTA ────────────────────────────────────── */
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-7 h-7 text-amber-400 fill-amber-400 drop-shadow-sm" />
                        ))}
                      </div>
                      <span className="text-2xl font-bold text-amber-700 dark:text-amber-300">5.0</span>
                    </div>
                    <div className="text-center sm:text-left flex-1">
                      <h3 className="font-bold text-foreground text-lg">{t('reviewSection.rateExperience')}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {t('reviewSection.rateDesc')}
                      </p>
                    </div>
                    <Button
                      onClick={() => { setInlineFormOpen(true); setForm({ ...form, rating: 5 }); }}
                      className="bg-gradient-to-r from-[#C98A1C] to-[#0A1330] hover:from-[#0A1330] hover:to-[#C98A1C] text-white rounded-xl font-bold shadow-lg shadow-[#C98A1C]/25 gap-2 h-11 px-6 text-sm"
                    >
                      <PenLine className="w-4 h-4" />
                      {t('reviewSection.submitReview')}
                    </Button>
                  </div>
                ) : (
                  /* ── Expanded Inline Form ─────────────────────────────── */
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
                        <PenLine className="w-4 h-4 text-amber-600" />
                        {t('reviewSection.writeReview')}
                      </h3>
                      <button
                        onClick={() => { setInlineFormOpen(false); setFormErrors({}); }}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {submitSuccess ? (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="py-8 text-center space-y-3"
                      >
                        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">{t('reviewSection.thankYou')}</h3>
                        <p className="text-sm text-muted-foreground">
                          {t('reviewSection.reviewPending')}
                        </p>
                        <Button
                          onClick={() => { setInlineFormOpen(false); setSubmitSuccess(false); }}
                          className="rounded-xl bg-gradient-to-r from-[#C98A1C] to-[#0A1330] text-white"
                        >
                          {t('reviewSection.done')}
                        </Button>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        {/* ── Row 1: Rating + Insurance Type ──────────── */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Rating */}
                          <div className="space-y-2">
                            <Label className="text-xs font-semibold flex items-center gap-1.5">
                              {t('reviewSection.yourRating')} <span className="text-red-500">*</span>
                              {form.rating > 0 && (
                                <Badge className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-0 px-2 py-0.5 rounded-full">
                                  {form.rating}/5 — {ratingLabels[form.rating]}
                                </Badge>
                              )}
                            </Label>
                            <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-900 rounded-xl border border-border/60">
                              <StarRating rating={form.rating} size="lg" interactive onChange={(r) => setForm({ ...form, rating: r })} />
                              {form.rating > 0 && (
                                <span className="text-sm font-bold text-amber-600 dark:text-amber-400 ml-1">{form.rating}.0</span>
                              )}
                            </div>
                            {formErrors.rating && <p className="text-xs text-red-500">{formErrors.rating}</p>}
                          </div>
                          {/* Insurance Type */}
                          <div className="space-y-2">
                            <Label className="text-xs font-semibold">
                              {t('reviewSection.insuranceType')} <span className="text-red-500">*</span>
                            </Label>
                            <Select value={form.insuranceType} onValueChange={(v) => setForm({ ...form, insuranceType: v })}>
                              <SelectTrigger className={`text-sm rounded-xl h-[52px] ${formErrors.insuranceType ? 'border-red-400' : ''}`}>
                                <SelectValue placeholder={t('reviewSection.selectType')} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="health">🏥 {t('reviewSection.healthInsurance')}</SelectItem>
                                <SelectItem value="life">🛡️ {t('reviewSection.lifeInsurance')}</SelectItem>
                                <SelectItem value="motor">🚗 {t('reviewSection.motorInsurance')}</SelectItem>
                                <SelectItem value="travel">✈️ {t('reviewSection.travelInsurance')}</SelectItem>
                                <SelectItem value="home">🏠 {t('reviewSection.homeInsurance')}</SelectItem>
                              </SelectContent>
                            </Select>
                            {formErrors.insuranceType && <p className="text-xs text-red-500">{formErrors.insuranceType}</p>}
                          </div>
                        </div>

                        {/* ── Row 2: Product Name ─────────────────────── */}
                        <div className="space-y-2">
                          <Label htmlFor="inlineProductName" className="text-xs font-semibold">
                            {t('reviewSection.planName')} <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="inlineProductName"
                            placeholder={t('reviewSection.planPlaceholder')}
                            value={form.productName}
                            onChange={(e) => setForm({ ...form, productName: e.target.value })}
                            className={`text-sm rounded-xl ${formErrors.productName ? 'border-red-400' : ''}`}
                          />
                          {formErrors.productName && <p className="text-xs text-red-500">{formErrors.productName}</p>}
                        </div>

                        {/* ── Row 3: Title + Body ──────────────────────── */}
                        <div className="space-y-2">
                          <Label htmlFor="inlineTitle" className="text-xs font-semibold">
                            {t('reviewSection.reviewTitle')} <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="inlineTitle"
                            placeholder={t('reviewSection.titlePlaceholder')}
                            maxLength={100}
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className={`text-sm rounded-xl ${formErrors.title ? 'border-red-400' : ''}`}
                          />
                          {formErrors.title && <p className="text-xs text-red-500">{formErrors.title}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="inlineBody" className="text-xs font-semibold">
                            {t('reviewSection.yourReview')} <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="inlineBody"
                            placeholder={t('reviewSection.reviewPlaceholder')}
                            rows={3}
                            maxLength={2000}
                            value={form.body}
                            onChange={(e) => setForm({ ...form, body: e.target.value })}
                            className={`text-sm rounded-xl resize-none ${formErrors.body ? 'border-red-400' : ''}`}
                          />
                          <div className="flex justify-between">
                            {formErrors.body ? (
                              <p className="text-xs text-red-500">{formErrors.body}</p>
                            ) : (
                              <span />
                            )}
                            <span className="text-[10px] text-muted-foreground">{form.body.length}/2000</span>
                          </div>
                        </div>

                        {/* ── Row 4: Name + Email ──────────────────────── */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="inlineName" className="text-xs font-semibold">
                              {t('reviewSection.yourName')} <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="inlineName"
                              placeholder={t('reviewSection.namePlaceholder')}
                              value={form.reviewerName}
                              onChange={(e) => setForm({ ...form, reviewerName: e.target.value })}
                              className={`text-sm rounded-xl ${formErrors.reviewerName ? 'border-red-400' : ''}`}
                            />
                            {formErrors.reviewerName && <p className="text-xs text-red-500">{formErrors.reviewerName}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="inlineEmail" className="text-xs font-semibold">
                              {t('reviewSection.email')} <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="inlineEmail"
                              type="email"
                              placeholder="you@email.com"
                              value={form.reviewerEmail}
                              onChange={(e) => setForm({ ...form, reviewerEmail: e.target.value })}
                              className={`text-sm rounded-xl ${formErrors.reviewerEmail ? 'border-red-400' : ''}`}
                            />
                            {formErrors.reviewerEmail && <p className="text-xs text-red-500">{formErrors.reviewerEmail}</p>}
                          </div>
                        </div>

                        {/* ── Row 5: Phone (optional) ──────────────────── */}
                        <div className="space-y-2">
                          <Label htmlFor="inlinePhone" className="text-xs font-semibold">
                            {t('reviewSection.phone')} <span className="text-muted-foreground font-normal">{t('reviewSection.phoneOptional')}</span>
                          </Label>
                          <Input
                            id="inlinePhone"
                            placeholder={t('reviewSection.phonePlaceholder')}
                            value={form.reviewerPhone}
                            onChange={(e) => setForm({ ...form, reviewerPhone: e.target.value })}
                            className={`text-sm rounded-xl ${formErrors.reviewerPhone ? 'border-red-400' : ''}`}
                          />
                          {formErrors.reviewerPhone && <p className="text-xs text-red-500">{formErrors.reviewerPhone}</p>}
                        </div>

                        {/* ── Submit ────────────────────────────────────── */}
                        <div className="flex items-center gap-3 pt-2">
                          <Button
                            type="submit"
                            disabled={submitting}
                            className="bg-gradient-to-r from-[#C98A1C] to-[#0A1330] hover:from-[#0A1330] hover:to-[#C98A1C] text-white rounded-xl font-bold gap-2 shadow-lg shadow-[#C98A1C]/25 h-11 px-8"
                          >
                            {submitting ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {t('reviewSection.submitting')}
                              </>
                            ) : (
                              <>
                                <Star className="w-4 h-4 fill-white" />
                                {t('reviewSection.submitStarReview').replace('{0}', String(form.rating))}
                              </>
                            )}
                          </Button>
                          <button
                            type="button"
                            onClick={() => { setInlineFormOpen(false); setFormErrors({}); }}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {t('reviewSection.cancel')}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </CardContent>
            </div>
          </Card>
        </motion.div>

        {/* ── Stats Bar ──────────────────────────────────────────────────── */}
        {stats && stats.totalReviews > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-10"
          >
            <Card className="border-border/50 overflow-hidden">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-center">
                  {/* Average Rating */}
                  <div className="text-center">
                    <p className="text-5xl font-bold bg-gradient-to-br from-amber-700 via-amber-500 to-amber-400 dark:from-amber-400 dark:via-amber-300 dark:to-amber-200 bg-clip-text text-transparent">
                      {stats.averageRating}
                    </p>
                    <StarRating rating={Math.round(stats.averageRating)} size="md" />
                    <p className="text-sm text-muted-foreground mt-1">
                      {stats.totalReviews} {stats.totalReviews !== 1 ? t('reviewSection.reviews') : t('reviewSection.reviews').replace('समीक्षाएँ', 'समीक्षा').replace('reviews', 'review')}
                    </p>
                    {stats.verifiedCount > 0 && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {stats.verifiedCount} {t('reviewSection.verified')}
                      </p>
                    )}
                  </div>

                  {/* Rating Distribution */}
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = stats.ratingDistribution[star] || 0;
                      const pct = (count / maxRatingCount) * 100;
                      return (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-xs font-medium text-muted-foreground w-8 text-right">
                            {star}★
                          </span>
                          <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${pct}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: 0.2 + (5 - star) * 0.1 }}
                            />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground w-8">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── Filters + Write Review ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <Tabs
            value={activeTab}
            onValueChange={(v) => { setActiveTab(v as InsuranceType); GAEvents.reviewFilter('insurance_type', v); }}
            className="w-full sm:w-auto"
          >
            <TabsList className="h-9 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <TabsTrigger value="all" className="text-xs px-3 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm">
                {t('reviewSection.all')}
              </TabsTrigger>
              <TabsTrigger value="health" className="text-xs px-3 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm">
                {t('reviewSection.health')}
              </TabsTrigger>
              <TabsTrigger value="life" className="text-xs px-3 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm">
                {t('reviewSection.life')}
              </TabsTrigger>
              <TabsTrigger value="motor" className="text-xs px-3 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm">
                {t('reviewSection.motor')}
              </TabsTrigger>
              <TabsTrigger value="travel" className="text-xs px-3 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm">
                {t('reviewSection.travel')}
              </TabsTrigger>
              <TabsTrigger value="home" className="text-xs px-3 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm">
                {t('reviewSection.homeTab')}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Select
              value={sortBy}
              onValueChange={(v) => { setSortBy(v as SortOption); GAEvents.reviewFilter('sort', v); }}
            >
              <SelectTrigger className="w-[150px] h-9 text-xs rounded-xl">
                <Filter className="w-3.5 h-3.5 mr-1.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t('reviewSection.newestFirst')}</SelectItem>
                <SelectItem value="highest">{t('reviewSection.highestRated')}</SelectItem>
                <SelectItem value="lowest">{t('reviewSection.lowestRated')}</SelectItem>
              </SelectContent>
            </Select>

            {/* Write a Review Dialog */}
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) setSubmitSuccess(false);
            }}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-[#C98A1C] to-[#0A1330] hover:from-[#0A1330] hover:to-[#C98A1C] text-white rounded-xl h-9 text-xs font-semibold shadow-lg shadow-[#C98A1C]/20 gap-1.5">
                  <PenLine className="w-3.5 h-3.5" />
                  {t('reviewSection.writeAReview')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                {submitSuccess ? (
                  /* ── Success State ──────────────────────────────────── */
                  <div className="py-8 text-center space-y-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring' as const, damping: 15 }}
                      className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center"
                    >
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-foreground">Thank You! 🎉</h3>
                    <p className="text-sm text-muted-foreground">
                      Your review has been submitted and is pending approval.
                      We appreciate your feedback!
                    </p>
                    <Button
                      onClick={() => setDialogOpen(false)}
                      className="rounded-xl bg-gradient-to-r from-[#C98A1C] to-[#0A1330] text-white"
                    >
                      Done
                    </Button>
                  </div>
                ) : (
                  /* ── Form ───────────────────────────────────────────── */
                  <>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <PenLine className="w-4 h-4 text-[#C98A1C]" />
                        Write a Review
                      </DialogTitle>
                      <DialogDescription>
                        Share your insurance experience — help others make better decisions
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                      {/* Product Name */}
                      <div className="space-y-1.5">
                        <Label htmlFor="productName" className="text-xs font-medium">
                          Product Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="productName"
                          placeholder="e.g., Star Health Comprehensive"
                          value={form.productName}
                          onChange={(e) => setForm({ ...form, productName: e.target.value })}
                          className={`text-sm rounded-xl ${formErrors.productName ? 'border-red-400' : ''}`}
                        />
                        {formErrors.productName && (
                          <p className="text-xs text-red-500">{formErrors.productName}</p>
                        )}
                      </div>

                      {/* Insurance Type */}
                      <div className="space-y-1.5">
                        <Label htmlFor="insuranceType" className="text-xs font-medium">
                          Insurance Type <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={form.insuranceType}
                          onValueChange={(v) => setForm({ ...form, insuranceType: v })}
                        >
                          <SelectTrigger className={`text-sm rounded-xl ${formErrors.insuranceType ? 'border-red-400' : ''}`}>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="health">Health</SelectItem>
                            <SelectItem value="life">Life</SelectItem>
                            <SelectItem value="motor">Motor</SelectItem>
                            <SelectItem value="travel">Travel</SelectItem>
                            <SelectItem value="home">Home</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.insuranceType && (
                          <p className="text-xs text-red-500">{formErrors.insuranceType}</p>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">
                          Rating <span className="text-red-500">*</span>
                        </Label>
                        <StarRating
                          rating={form.rating}
                          size="lg"
                          interactive
                          onChange={(r) => setForm({ ...form, rating: r })}
                        />
                        {formErrors.rating && (
                          <p className="text-xs text-red-500">{formErrors.rating}</p>
                        )}
                      </div>

                      {/* Title */}
                      <div className="space-y-1.5">
                        <Label htmlFor="reviewTitle" className="text-xs font-medium">
                          Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="reviewTitle"
                          placeholder="Summarize your experience"
                          maxLength={100}
                          value={form.title}
                          onChange={(e) => setForm({ ...form, title: e.target.value })}
                          className={`text-sm rounded-xl ${formErrors.title ? 'border-red-400' : ''}`}
                        />
                        {formErrors.title && (
                          <p className="text-xs text-red-500">{formErrors.title}</p>
                        )}
                      </div>

                      {/* Body */}
                      <div className="space-y-1.5">
                        <Label htmlFor="reviewBody" className="text-xs font-medium">
                          Your Review <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="reviewBody"
                          placeholder="Tell us about your experience..."
                          rows={4}
                          maxLength={2000}
                          value={form.body}
                          onChange={(e) => setForm({ ...form, body: e.target.value })}
                          className={`text-sm rounded-xl resize-none ${formErrors.body ? 'border-red-400' : ''}`}
                        />
                        <div className="flex justify-between">
                          {formErrors.body ? (
                            <p className="text-xs text-red-500">{formErrors.body}</p>
                          ) : (
                            <span />
                          )}
                          <span className="text-[10px] text-muted-foreground">
                            {form.body.length}/2000
                          </span>
                        </div>
                      </div>

                      {/* Name + Email */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="reviewerName" className="text-xs font-medium">
                            Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="reviewerName"
                            placeholder="Your name"
                            value={form.reviewerName}
                            onChange={(e) => setForm({ ...form, reviewerName: e.target.value })}
                            className={`text-sm rounded-xl ${formErrors.reviewerName ? 'border-red-400' : ''}`}
                          />
                          {formErrors.reviewerName && (
                            <p className="text-xs text-red-500">{formErrors.reviewerName}</p>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="reviewerEmail" className="text-xs font-medium">
                            Email <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="reviewerEmail"
                            type="email"
                            placeholder="you@email.com"
                            value={form.reviewerEmail}
                            onChange={(e) => setForm({ ...form, reviewerEmail: e.target.value })}
                            className={`text-sm rounded-xl ${formErrors.reviewerEmail ? 'border-red-400' : ''}`}
                          />
                          {formErrors.reviewerEmail && (
                            <p className="text-xs text-red-500">{formErrors.reviewerEmail}</p>
                          )}
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-1.5">
                        <Label htmlFor="reviewerPhone" className="text-xs font-medium">
                          Phone <span className="text-muted-foreground">(optional)</span>
                        </Label>
                        <Input
                          id="reviewerPhone"
                          placeholder="10-digit mobile number"
                          value={form.reviewerPhone}
                          onChange={(e) => setForm({ ...form, reviewerPhone: e.target.value })}
                          className={`text-sm rounded-xl ${formErrors.reviewerPhone ? 'border-red-400' : ''}`}
                        />
                        {formErrors.reviewerPhone && (
                          <p className="text-xs text-red-500">{formErrors.reviewerPhone}</p>
                        )}
                      </div>

                      {/* Photo URL */}
                      <div className="space-y-1.5">
                        <Label htmlFor="photoUrl" className="text-xs font-medium">
                          Photo URL <span className="text-muted-foreground">(optional)</span>
                        </Label>
                        <Input
                          id="photoUrl"
                          placeholder="https://example.com/photo.jpg"
                          value={form.photoUrl}
                          onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
                          className="text-sm rounded-xl"
                        />
                      </div>

                      {/* Submit */}
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-gradient-to-r from-[#C98A1C] to-[#0A1330] hover:from-[#0A1330] hover:to-[#C98A1C] text-white rounded-xl font-semibold gap-2 shadow-lg shadow-[#C98A1C]/25"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Review
                          </>
                        )}
                      </Button>
                    </form>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* ── Review Cards Grid ─────────────────────────────────────────────── */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-[#C98A1C]/20 border-t-[#C98A1C] rounded-full" />
          </div>
        ) : reviews.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
              <h3 className="font-semibold text-foreground mb-1">No reviews yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Be the first to share your insurance experience!
              </p>
              <Button
                onClick={() => setInlineFormOpen(true)}
                variant="outline"
                className="rounded-xl gap-1.5"
              >
                <PenLine className="w-3.5 h-3.5" />
                Write a Review
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onVote={handleVote}
                  votedReviews={votedReviews}
                />
              ))}
            </div>

            {/* Load more indicator */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-xl text-xs"
                >
                  Previous
                </Button>
                <span className="text-xs text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-xl text-xs"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
