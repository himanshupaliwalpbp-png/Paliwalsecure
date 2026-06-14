'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, Loader2, CheckCircle, Shield, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/* ── Design Tokens ──────────────────────────────────────────────────────── */
const NAVY = '#0A1330';
const GOLD = '#C98A1C';
const GOLD_400 = '#C98A1C';
const MUTED = '#8A96A8';
const MUTED_LIGHT = '#64748B';

/* ── Types ──────────────────────────────────────────────────────────────── */
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

interface FormData {
  reviewerName: string;
  reviewerEmail: string;
  reviewerPhone: string;
  insuranceType: string;
  rating: number;
  title: string;
  body: string;
}

interface FormErrors {
  [key: string]: string;
}

const INITIAL_FORM: FormData = {
  reviewerName: '',
  reviewerEmail: '',
  reviewerPhone: '',
  insuranceType: '',
  rating: 0,
  title: '',
  body: '',
};

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

const INSURANCE_TYPES = [
  { value: 'health', label: '🏥 Health Insurance' },
  { value: 'term', label: '🛡️ Term Insurance' },
  { value: 'life', label: '👨‍👩‍👧 Life Insurance (Endowment/ULIP)' },
  { value: 'motor-car', label: '🚗 Car Insurance' },
  { value: 'motor-bike', label: '🏍️ Bike Insurance' },
  { value: 'travel', label: '✈️ Travel Insurance' },
  { value: 'home', label: '🏠 Home Insurance' },
  { value: 'critical-illness', label: '🫀 Critical Illness Insurance' },
  { value: 'personal-accident', label: '⚠️ Personal Accident Insurance' },
  { value: 'pension', label: '👴 Pension / Retirement Plan' },
  { value: 'corporate', label: '🏢 Corporate / Group Insurance' },
  { value: 'fire', label: '🔥 Fire / Marine Insurance' },
  { value: 'crop', label: '🌾 Crop Insurance' },
  { value: 'other', label: '❓ Other / Not Sure' },
];

/* ── Interactive Star Rating ────────────────────────────────────────────── */
function InteractiveStarRating({
  rating,
  onChange,
}: {
  rating: number;
  onChange: (r: number) => void;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="cursor-pointer transition-transform hover:scale-110 focus:outline-none"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
        >
          <Star
            className={`w-7 h-7 transition-colors ${
              star <= (hover || rating)
                ? 'fill-current'
                : 'text-slate-300 fill-slate-100 dark:text-white/15 dark:fill-white/5'
            }`}
            style={{
              color: star <= (hover || rating) ? GOLD : undefined,
            }}
          />
        </button>
      ))}
      {rating > 0 && (
        <span
          className="ml-2 text-sm font-bold"
          style={{ color: GOLD_400 }}
        >
          {rating}/5 — {RATING_LABELS[rating]}
        </span>
      )}
    </div>
  );
}

/* ── Display Star Rating ────────────────────────────────────────────────── */
function DisplayStarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'fill-current' : 'text-slate-300 fill-slate-100 dark:text-white/15 dark:fill-white/5'}`}
          style={{ color: star <= rating ? GOLD : undefined }}
        />
      ))}
    </div>
  );
}

/* ── Review Card ────────────────────────────────────────────────────────── */
function ReviewCard({ review, index }: { review: Review; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.body.length > 150;
  const displayBody = isLong && !expanded ? review.body.slice(0, 150) + '...' : review.body;

  const dateStr = new Date(review.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const insuranceLabel: Record<string, string> = {
    health: 'Health',
    life: 'Life',
    motor: 'Motor',
    travel: 'Travel',
    home: 'Home',
  };

  return (
    <motion.div
      className="glass-card p-5 sm:p-6 flex flex-col h-full relative overflow-hidden group"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Insurance type badge */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
          style={{
            background: 'rgba(201,138,28,0.12)',
            color: GOLD_400,
            border: '1px solid rgba(201,138,28,0.2)',
          }}
        >
          {insuranceLabel[review.insuranceType] || review.insuranceType}
        </span>
        {review.isVerifiedPurchase && (
          <div
            className="flex items-center gap-1 rounded-full px-2 py-0.5"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}
          >
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] font-semibold text-emerald-400">Verified</span>
          </div>
        )}
      </div>

      {/* Stars */}
      <div className="mb-2">
        <DisplayStarRating rating={review.rating} />
      </div>

      {/* Title */}
      <h4
        className="font-bold text-sm dark:text-white text-slate-900 mb-1.5 line-clamp-2"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        {review.title}
      </h4>

      {/* Body */}
      <p
        className="text-xs sm:text-sm leading-relaxed flex-1 mb-3 dark:text-white/70 text-slate-600"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        {displayBody}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-medium mb-3 transition-colors hover:underline"
          style={{ color: GOLD }}
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}

      {/* Divider */}
      <div
        className="w-full h-px mb-3"
        style={{ background: 'linear-gradient(to right, transparent, rgba(201,138,28,0.2), transparent)' }}
      />

      {/* Author info */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
          style={{ background: `linear-gradient(135deg, ${NAVY}, ${GOLD})` }}
        >
          {review.reviewerName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold dark:text-white text-slate-900 truncate">
            {review.reviewerName}
          </p>
          <p className="text-[10px] dark:text-white/40 text-slate-400">
            {dateStr}
          </p>
        </div>
        <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
      </div>
    </motion.div>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────── */
export default function ReviewsSection() {
  const { t } = useLanguage();

  // ── Form state ──────────────────────────────────────────────────────────
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // ── Reviews state ───────────────────────────────────────────────────────
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Fetch approved reviews ──────────────────────────────────────────────
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reviews?status=approved&limit=6');
      const data = await res.json();
      if (res.ok && data.reviews) {
        setReviews(data.reviews);
      }
    } catch {
      // Silently fail — offline mode
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // ── Form validation ─────────────────────────────────────────────────────
  const validateForm = useCallback((): boolean => {
    const errors: FormErrors = {};

    if (!form.reviewerName.trim()) errors.reviewerName = 'Naam daalna zaroori hai';
    if (!form.reviewerEmail.trim()) errors.reviewerEmail = 'Email daalna zaroori hai';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.reviewerEmail)) {
      errors.reviewerEmail = 'Sahi email daalein';
    }
    if (form.reviewerPhone && !/^[6-9]\d{9}$/.test(form.reviewerPhone.replace(/\D/g, ''))) {
      errors.reviewerPhone = 'Sahi 10-digit mobile number daalein';
    }
    if (!form.insuranceType) errors.insuranceType = 'Insurance type choose karein';
    if (form.rating < 1 || form.rating > 5) errors.rating = '1 se 5 stars choose karein';
    if (!form.title.trim()) errors.title = 'Title daalna zaroori hai';
    if (form.title.length > 100) errors.title = 'Title 100 characters se kam hona chahiye';
    if (!form.body.trim()) errors.body = 'Review likhna zaroori hai';
    if (form.body.length > 2000) errors.body = 'Review 2000 characters se kam hona chahiye';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [form]);

  // ── Submit handler ──────────────────────────────────────────────────────
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
            productName: `${form.insuranceType} Insurance`,
            insuranceType: form.insuranceType,
            rating: form.rating,
            title: form.title.trim(),
            body: form.body.trim(),
            reviewerName: form.reviewerName.trim(),
            reviewerEmail: form.reviewerEmail.trim().toLowerCase(),
            reviewerPhone: form.reviewerPhone?.trim() || null,
            photoUrl: null,
          }),
        });

        if (res.ok) {
          setSubmitSuccess(true);
          setForm(INITIAL_FORM);
          setFormErrors({});
        } else {
          const data = await res.json();
          setFormErrors({ submit: data.error || 'Kuch gadbad ho gayi, dubara try karein' });
        }
      } catch {
        setFormErrors({ submit: 'Network error, please check connection aur dubara try karein' });
      } finally {
        setSubmitting(false);
      }
    },
    [form, validateForm]
  );

  // ── Update form field helper ────────────────────────────────────────────
  const updateField = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  return (
    <section
      id="reviews"
      dir="ltr"
      className="relative py-16 sm:py-20 lg:py-24 overflow-hidden dark:bg-gradient-to-b dark:from-[#060B1E] dark:via-[#0A1330] dark:to-[#060B1E] bg-gradient-to-b from-amber-50/50 via-cream to-amber-50/50"
      aria-label="Customer reviews"
    >
      {/* Decorative orbs */}
      <div
        className="absolute top-0 right-1/4 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: GOLD, filter: 'blur(120px)', opacity: 0.05 }}
      />
      <div
        className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: NAVY, filter: 'blur(80px)', opacity: 0.15 }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ────────────────────────────────────────────────── */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'rgba(201,138,28,0.12)', color: GOLD, border: '1px solid rgba(201,138,28,0.25)' }}
          >
            ⭐ {t('reviews.badge')}
          </div>

          {/* Heading with gold italic on "Kehte Hain" */}
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight dark:text-white text-slate-900"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('testimonials.v2.heading').split(' ').map((word, i, arr) => {
              // Find "Kehte" and "Hain" words to italicize in gold
              const isKehteHain = word === 'Kehte' || word === 'कहते';
              const isHain = word === 'Hain' || word === 'हैं';
              if (isKehteHain || isHain) {
                return (
                  <span key={i} className="italic gradient-text"> {word}</span>
                );
              }
              return <span key={i}>{i > 0 ? ' ' : ''}{word}</span>;
            })}
          </h2>

          {/* Trust summary */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-300 dark:text-emerald-300 text-emerald-600">IRDAI Verified</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" style={{ color: GOLD }} />
              <span className="text-xs font-medium dark:text-white/50 text-slate-500">
                All reviews verified
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Review Submission Form ────────────────────────────────────────── */}
        <motion.div
          className="mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="glass-card p-5 sm:p-8 relative overflow-hidden">
            {/* Decorative corner glow */}
            <div
              className="absolute -top-20 -right-20 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: GOLD, filter: 'blur(60px)', opacity: 0.08 }}
            />

            <div className="relative z-10">
              {/* Form heading */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_400})` }}
                >
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3
                    className="text-lg sm:text-xl font-bold dark:text-white text-slate-900"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Apna Review Delein
                  </h3>
                  <p className="text-xs dark:text-white/50 text-slate-500">
                    Aapka honest feedback 700M+ Indians ki madad karta hai 🇮🇳
                  </p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {submitSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="py-8 text-center space-y-3"
                  >
                    <div
                      className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(34,197,94,0.15)' }}
                    >
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h4 className="text-xl font-bold dark:text-white text-slate-900">
                      Shukriya! 🎉
                    </h4>
                    <p className="text-sm dark:text-white/70 text-slate-600 max-w-md mx-auto">
                      Aapka review submit ho gaya hai aur approval ke baad dikhega. Aapki honest feedback ke liye dhanyavaad!
                    </p>
                    <Button
                      onClick={() => setSubmitSuccess(false)}
                      className="mt-4 rounded-xl font-semibold gap-2"
                      style={{
                        background: `linear-gradient(135deg, ${GOLD}, ${GOLD_400})`,
                        color: NAVY,
                      }}
                    >
                      Aur Review Likhein
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    {/* ── Row 1: Rating + Insurance Type ───────────────────── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Rating */}
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold dark:text-white/90 text-slate-700 flex items-center gap-1.5">
                          Rating <span className="text-red-400">*</span>
                          {form.rating > 0 && (
                            <span
                              className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                              style={{ background: 'rgba(201,138,28,0.15)', color: GOLD_400 }}
                            >
                              {form.rating}/5
                            </span>
                          )}
                        </Label>
                        <div
                          className="flex items-center gap-2 p-3 rounded-xl dark:bg-white/[0.04] bg-amber-50/50"
                          style={{
                            border: formErrors.rating ? '1px solid #EF4444' : '1px solid rgba(201,138,28,0.15)',
                          }}
                        >
                          <InteractiveStarRating
                            rating={form.rating}
                            onChange={(r) => updateField('rating', r)}
                          />
                        </div>
                        {formErrors.rating && <p className="text-xs text-red-400">{formErrors.rating}</p>}
                      </div>

                      {/* Insurance Type */}
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold dark:text-white/90 text-slate-700">
                          Insurance Type <span className="text-red-400">*</span>
                        </Label>
                        <Select
                          value={form.insuranceType}
                          onValueChange={(v) => updateField('insuranceType', v)}
                        >
                          <SelectTrigger
                            className={`w-full text-sm rounded-xl h-[52px] dark:bg-white/[0.04] bg-white ${
                              formErrors.insuranceType ? 'border-red-400' : ''
                            }`}
                          >
                            <SelectValue placeholder="Type choose karein" />
                          </SelectTrigger>
                          <SelectContent>
                            {INSURANCE_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {formErrors.insuranceType && (
                          <p className="text-xs text-red-400">{formErrors.insuranceType}</p>
                        )}
                      </div>
                    </div>

                    {/* ── Row 2: Title ──────────────────────────────────────── */}
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold dark:text-white/90 text-slate-700">
                        Review Title <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        placeholder="Ek line mein apna experience summarize karein"
                        maxLength={100}
                        value={form.title}
                        onChange={(e) => updateField('title', e.target.value)}
                        className={`text-sm rounded-xl ps-input ${
                          formErrors.title ? 'border-red-400' : ''
                        }`}
                      />
                      <div className="flex justify-between">
                        {formErrors.title ? (
                          <p className="text-xs text-red-400">{formErrors.title}</p>
                        ) : (
                          <span />
                        )}
                        <span className="text-[10px] dark:text-white/40 text-slate-400">
                          {form.title.length}/100
                        </span>
                      </div>
                    </div>

                    {/* ── Row 3: Review Body ────────────────────────────────── */}
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold dark:text-white/90 text-slate-700">
                        Aapka Review <span className="text-red-400">*</span>
                      </Label>
                      <Textarea
                        placeholder="Apna experience share karein — claim process, customer service, coverage, etc."
                        rows={4}
                        maxLength={2000}
                        value={form.body}
                        onChange={(e) => updateField('body', e.target.value)}
                        className={`text-sm rounded-xl resize-none ps-input ${
                          formErrors.body ? 'border-red-400' : ''
                        }`}
                      />
                      <div className="flex justify-between">
                        {formErrors.body ? (
                          <p className="text-xs text-red-400">{formErrors.body}</p>
                        ) : (
                          <span />
                        )}
                        <span className="text-[10px] dark:text-white/40 text-slate-400">
                          {form.body.length}/2000
                        </span>
                      </div>
                    </div>

                    {/* ── Row 4: Name + Email ────────────────────────────────── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold dark:text-white/90 text-slate-700">
                          Naam <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          placeholder="e.g., Rajesh Kumar"
                          value={form.reviewerName}
                          onChange={(e) => updateField('reviewerName', e.target.value)}
                          className={`text-sm rounded-xl ps-input ${
                            formErrors.reviewerName ? 'border-red-400' : ''
                          }`}
                        />
                        {formErrors.reviewerName && (
                          <p className="text-xs text-red-400">{formErrors.reviewerName}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold dark:text-white/90 text-slate-700">
                          Email <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          type="email"
                          placeholder="aapka@email.com"
                          value={form.reviewerEmail}
                          onChange={(e) => updateField('reviewerEmail', e.target.value)}
                          className={`text-sm rounded-xl ps-input ${
                            formErrors.reviewerEmail ? 'border-red-400' : ''
                          }`}
                        />
                        {formErrors.reviewerEmail && (
                          <p className="text-xs text-red-400">{formErrors.reviewerEmail}</p>
                        )}
                      </div>
                    </div>

                    {/* ── Row 5: Phone (optional) ────────────────────────────── */}
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold dark:text-white/90 text-slate-700">
                        Phone <span className="font-normal dark:text-white/40 text-slate-400">(optional)</span>
                      </Label>
                      <Input
                        placeholder="10-digit mobile number"
                        value={form.reviewerPhone}
                        onChange={(e) => updateField('reviewerPhone', e.target.value)}
                        className={`text-sm rounded-xl ps-input max-w-xs ${
                          formErrors.reviewerPhone ? 'border-red-400' : ''
                        }`}
                      />
                      {formErrors.reviewerPhone && (
                        <p className="text-xs text-red-400">{formErrors.reviewerPhone}</p>
                      )}
                    </div>

                    {/* ── Submit error ──────────────────────────────────────── */}
                    {formErrors.submit && (
                      <div
                        className="p-3 rounded-xl text-xs text-red-300"
                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
                      >
                        {formErrors.submit}
                      </div>
                    )}

                    {/* ── Submit Button ─────────────────────────────────────── */}
                    <div className="flex items-center gap-3 pt-1">
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="rounded-xl font-bold gap-2 h-11 px-8 shadow-lg transition-all"
                        style={{
                          background: `linear-gradient(135deg, ${GOLD}, ${GOLD_400})`,
                          color: NAVY,
                          boxShadow: `0 4px 20px rgba(201,138,28,0.35)`,
                        }}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Submit {form.rating > 0 ? `${form.rating}-Star` : ''} Review
                          </>
                        )}
                      </Button>
                      <span className="text-xs dark:text-white/40 text-slate-400">
                        Review approval ke baad dikhega
                      </span>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* ── Approved Reviews Grid (only shown when reviews exist) ─────────── */}
        {!loading && reviews.length > 0 && (
        <div>
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <MessageSquare className="w-5 h-5" style={{ color: GOLD }} />
            <h3
              className="text-lg sm:text-xl font-bold dark:text-white text-slate-900"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Approved Reviews
            </h3>
            <div
              className="h-px flex-1"
              style={{ background: 'linear-gradient(to right, rgba(201,138,28,0.2), transparent)' }}
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {reviews.map((review, index) => (
              <ReviewCard key={review.id} review={review} index={index} />
            ))}
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
