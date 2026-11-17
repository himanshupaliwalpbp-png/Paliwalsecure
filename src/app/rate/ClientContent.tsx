'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  ShieldCheck,
  Lock,
  Loader2,
  CheckCircle2,
  MessageCircle,
  RotateCcw,
  ArrowRight,
  BadgeCheck,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ReviewsCarousel, { type PublicReview } from './ReviewsCarousel';

const WA_OWNER = 'https://wa.me/919257877312';

const TYPES = [
  { value: 'health', label: 'Health Insurance' },
  { value: 'motor', label: 'Motor (Car/Bike)' },
  { value: 'life', label: 'Life / Term' },
  { value: 'travel', label: 'Travel' },
  { value: 'home', label: 'Home' },
] as const;

const RATING_LABELS: Record<number, string> = {
  1: 'Bahut Bura',
  2: 'Bura Tha',
  3: 'Theek Tha',
  4: 'Bahut Achha!',
  5: 'Excellent Service!',
};

const RATING_WORD_STYLES: Record<number, string> = {
  1: 'text-[#6B6250]',
  2: 'text-[#8A8272]',
  3: 'text-[#8A6A28]',
  4: 'text-[#B8482C]',
  5: 'gradient-text',
};

export default function RateClientContent() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [insuranceType, setInsuranceType] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [stats, setStats] = useState<{ averageRating: number; totalReviews: number } | null>(null);
  const [recent, setRecent] = useState<PublicReview[]>([]);

  useEffect(() => {
    fetch('/api/reviews/stats')
      .then((r) => r.json())
      .then((d) => {
        if (d && typeof d.totalReviews === 'number' && d.totalReviews > 0) setStats(d);
      })
      .catch(() => {});
    fetch('/api/reviews?limit=6')
      .then((r) => r.json())
      .then((d) => {
        if (d && Array.isArray(d.reviews)) setRecent(d.reviews);
      })
      .catch(() => {});
  }, []);

  const active = hover || rating;
  const typeLabel = TYPES.find((t) => t.value === insuranceType)?.label ?? '';

  const submit = async () => {
    setErrorMsg('');
    if (!rating) {
      setErrorMsg('Pehle apni rating dein — upar stars tap karein.');
      return;
    }
    if (name.trim().length < 2) {
      setErrorMsg('Apna naam likhein (minimum 2 letters).');
      return;
    }
    if (!insuranceType) {
      setErrorMsg('Kaunsi insurance service li thi — ek type chunein.');
      return;
    }
    setSubmitting(true);
    const cleanMsg = message.trim().replace(/\s+/g, ' ');
    const title =
      cleanMsg.length <= 90
        ? cleanMsg || `${rating}-Star Customer Rating`
        : cleanMsg.slice(0, 90).replace(/\s+\S*$/, '') + '…';
    const body =
      cleanMsg || `${rating} star rating — customer rated Paliwal Secure service via the rate page.`;
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: `${typeLabel} · Paliwal Secure`,
          insuranceType,
          rating,
          title,
          body,
          reviewerName: name.trim(),
          reviewerEmail: `rate-${Date.now().toString(36)}-${Math.random()
            .toString(36)
            .slice(2, 7)}@rate.paliwalsecure.in`,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Submit failed');
      setSubmitted(true);
    } catch {
      setErrorMsg(
        'Network issue aa raha hai. Thodi der baad dobara try karein — ya apni rating seedha WhatsApp par bhej dein.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const waShareText = encodeURIComponent(
    `Namaste Himanshu ji! Meri rating:${'\n'}${'★'.repeat(rating)} (${rating}/5)${'\n'}Name: ${name.trim()}${'\n'}Service: ${typeLabel}${
      message.trim() ? `${'\n'}Experience: ${message.trim()}` : ''
    }${'\n'}— via paliwalsecure.in/rate`
  );

  const reset = () => {
    setRating(0);
    setHover(0);
    setName('');
    setCity('');
    setInsuranceType('');
    setMessage('');
    setSubmitted(false);
    setErrorMsg('');
  };

  return (
    <div className="relative">
      {/* ── DARK HERO ─────────────────────────────────────────────────────── */}
      <section className="nl-dark-hero relative overflow-hidden bg-[#1A130C]">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#1A130C_0%,#8B3520_52%,#0E1116_100%)] opacity-90" />
          <div className="absolute -top-24 -left-16 w-72 h-72 rounded-full bg-[#B8482C]/30 blur-3xl" />
          <div className="absolute top-8 -right-24 w-80 h-80 rounded-full bg-[#C98A1C]/25 blur-3xl" />
          <div className="absolute -bottom-20 left-1/4 w-72 h-72 rounded-full bg-[#8B3520]/40 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E8C97E]/40 bg-[#E8C97E]/10 text-[#F7E8B8] text-[0.7rem] font-bold tracking-[0.22em] uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            Paliwal Secure · Customer Rating
          </span>

          <h1 className="mt-6 text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.08] text-balance">
            Kaisa raha aapka{' '}
            <span className="gradient-text italic">Experience?</span>
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Sirf 30 second — 5 tap rating, naam aur ek chhota message. Aapki rating Paliwal
            Secure ko aur behtar service dene mein madad karti hai.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            {stats && stats.totalReviews > 0 && (
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E8C97E]/30 bg-white/5 text-[#F7E8B8] text-sm font-semibold">
                <Star className="w-4 h-4 text-[#E8C97E] fill-[#E8C97E]" />
                {stats.averageRating ? stats.averageRating.toFixed(1) : '5.0'} Average
              </span>
            )}
            {stats && stats.totalReviews > 0 && (
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E8C97E]/30 bg-white/5 text-[#F7E8B8] text-sm font-semibold">
                <BadgeCheck className="w-4 h-4 text-[#E8C97E]" />
                {stats.totalReviews} Genuine Ratings
              </span>
            )}
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E8C97E]/30 bg-white/5 text-[#F7E8B8] text-sm font-semibold">
              <Lock className="w-4 h-4 text-[#E8C97E]" />
              100% Private
            </span>
          </div>
        </div>

        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-background"
        />
      </section>

      {/* ── RATING CARD (floats over hero edge) ───────────────────────────── */}
      <section className="relative max-w-2xl mx-auto px-4 sm:px-6 -mt-14 sm:-mt-18 z-10">
        <div className="nl-glass p-6 sm:p-10">
          {!submitted ? (
            <div className="space-y-7">
              {/* Step 1 — stars */}
              <div className="text-center">
                <p className="text-[0.7rem] font-bold tracking-[0.18em] uppercase text-[#8A8272]">
                  Step 1 — Apni rating dein
                </p>
                <div
                  className="mt-4 flex items-center justify-center gap-2 sm:gap-3"
                  role="radiogroup"
                  aria-label="Star rating"
                >
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.button
                      key={i}
                      type="button"
                      role="radio"
                      aria-checked={rating === i}
                      aria-label={`${i} star`}
                      onClick={() => setRating(i)}
                      onMouseEnter={() => setHover(i)}
                      onMouseLeave={() => setHover(0)}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center cursor-pointer"
                    >
                      <Star
                        className={`w-8 h-8 sm:w-9 sm:h-9 transition-all duration-200 ${
                          i <= active
                            ? 'text-[#C98A1C] fill-[#C98A1C] scale-110'
                            : 'text-[#C98A1C]/30 fill-transparent'
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>
                <div className="mt-4 min-h-[3rem] sm:min-h-[3.6rem] flex items-center justify-center" aria-live="polite">
                  <AnimatePresence mode="wait" initial={false}>
                    {active ? (
                      <motion.p
                        key={`label-${active}`}
                        initial={{ opacity: 0, y: 16, scale: 0.82 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -12, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                        className={`text-2xl sm:text-4xl font-extrabold tracking-tight text-center px-4 ${
                          RATING_WORD_STYLES[active] ?? ''
                        }`}
                      >
                        {RATING_LABELS[active]}
                      </motion.p>
                    ) : (
                      <motion.p
                        key="label-hint"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm font-semibold text-[#8A8272]"
                      >
                        Stars tap karke rating dein
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-[#C98A1C]/30 to-transparent" />

              {/* Step 2 — name / city */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="rate-name"
                    className="text-[0.7rem] font-bold tracking-[0.18em] uppercase text-[#8A8272]"
                  >
                    Step 2 — Aapka naam *
                  </label>
                  <Input
                    id="rate-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Sharma"
                    maxLength={60}
                    className="h-12 border-[#C98A1C]/30 bg-white/80 focus-visible:border-[#B8482C]/60 focus-visible:ring-[#B8482C]/25"
                    disabled={submitting}
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="rate-city"
                    className="text-[0.7rem] font-bold tracking-[0.18em] uppercase text-[#8A8272]"
                  >
                    City (optional)
                  </label>
                  <Input
                    id="rate-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Kota"
                    maxLength={40}
                    className="h-12 border-[#C98A1C]/30 bg-white/80 focus-visible:border-[#B8482C]/60 focus-visible:ring-[#B8482C]/25"
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Step 3 — insurance type */}
              <div className="space-y-1.5">
                <p className="text-[0.7rem] font-bold tracking-[0.18em] uppercase text-[#8A8272]">
                  Step 3 — Kaunsi service li thi? *
                </p>
                <div className="flex flex-wrap gap-2">
                  {TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setInsuranceType(t.value)}
                      aria-pressed={insuranceType === t.value}
                      className={`min-h-11 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer ${
                        insuranceType === t.value
                          ? 'border-[#B8482C] bg-[#B8482C]/10 text-[#8B3520] shadow-[0_4px_14px_-6px_rgba(184,72,44,0.4)]'
                          : 'border-black/10 bg-white/70 text-[#4A4F57] hover:border-[#C98A1C]/50 hover:text-[#8B3520]'
                      }`}
                      disabled={submitting}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4 — message */}
              <div className="space-y-1.5">
                <label
                  htmlFor="rate-msg"
                  className="text-[0.7rem] font-bold tracking-[0.18em] uppercase text-[#8A8272]"
                >
                  Step 4 — Apna experience likhein (optional)
                </label>
                <Textarea
                  id="rate-msg"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Claim settlement, premium saving, guidance — jo bhi feel hua!"
                  maxLength={600}
                  rows={4}
                  className="border-[#C98A1C]/30 bg-white/80 focus-visible:border-[#B8482C]/60 focus-visible:ring-[#B8482C]/25"
                  disabled={submitting}
                />
              </div>

              {errorMsg && (
                <div className="rounded-xl border border-[#B8482C]/30 bg-[#B8482C]/10 px-4 py-3 text-sm font-medium text-[#8B3520] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#B8482C] shrink-0" />
                  {errorMsg}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="button"
                  onClick={submit}
                  disabled={submitting}
                  className="nl-cta w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Bhej rahe hain…
                    </>
                  ) : (
                    <>
                  Rating Submit Karein
                  <ArrowRight className="nl-cta-arrow w-5 h-5" />
                    </>
                  )}
                </button>
                <p className="flex items-center gap-1.5 text-xs text-[#8A8272] text-center sm:text-left">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  Aapki rating admin approval ke baad website par dikhti hai — naam ke alawa
                  koi personal detail save nahi hoti.
                </p>
              </div>
            </div>
          ) : (
            /* ── SUCCESS STATE ───────────────────────────────────────────── */
            <div className="text-center py-4">
              <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-[#E8C97E] to-[#C98A1C] flex items-center justify-center shadow-[0_14px_36px_-10px_rgba(201,138,28,0.55)]">
                <CheckCircle2 className="w-10 h-10 text-[#1A130C]" />
              </div>
              <div className="mt-5 flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-7 h-7 ${
                      i <= rating
                        ? 'text-[#C98A1C] fill-[#C98A1C]'
                        : 'text-[#C98A1C]/25 fill-transparent'
                    }`}
                  />
                ))}
              </div>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-[#17130E]">
                Dhanyawad, {name.trim().split(' ')[0]}!
              </h2>
              <p className="mt-3 text-lg text-[#57503F] max-w-md mx-auto leading-relaxed">
                Aapki <strong className="text-[#8B3520]">{rating}-star rating</strong> mil gayi
                — jaldi hi website par live hogi (admin approval ke baad). Aapke support ke liye
                dhanyawad!
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`${WA_OWNER}?text=${waShareText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nl-cta-wa nl-cta w-full sm:w-auto"
                >
                  <MessageCircle className="w-5 h-5" />
                  Owner ko WhatsApp par bhejein (optional)
                </a>
                <Link href="/" className="nl-cta-ghost nl-cta w-full sm:w-auto">
                  Home par wapas jaayein
                </Link>
              </div>

              <button
                type="button"
                onClick={reset}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#8A8272] hover:text-[#8B3520] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Ek aur rating dein
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── RECENT RATINGS ────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C98A1C]/40 bg-[#C98A1C]/8 text-[#8B3520] text-[0.7rem] font-bold tracking-[0.22em] uppercase">
            <Star className="w-3.5 h-3.5 text-[#C98A1C] fill-[#C98A1C]" />
            Log Kya Kehte Hain
          </span>
          <h2 className="mt-5 text-3xl sm:text-5xl font-bold tracking-tight text-[#17130E] leading-[1.12]">
            Recent Customer{' '}
            <span className="gradient-text italic">Ratings</span>
          </h2>
          <p className="mt-4 text-lg text-[#57503F] max-w-2xl mx-auto leading-relaxed">
            Real customers ki genuine ratings — admin verification ke baad publish hoti hain.
          </p>
        </div>

        {recent.length > 0 ? (
          <ReviewsCarousel reviews={recent} />
        ) : (
          <p className="text-center text-[#8A8272]">
            Abhi tak koi rating publish nahi hui — pehli rating aap ho sakte hain!
          </p>
        )}
      </section>

      {/* ── CTA BAND ──────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="relative overflow-hidden rounded-3xl bg-[#1A130C] px-6 sm:px-12 py-10 sm:py-14">
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#1A130C_0%,#8B3520_55%,#0E1116_100%)] opacity-80" />
            <div className="absolute -top-16 -right-10 w-64 h-64 rounded-full bg-[#C98A1C]/20 blur-3xl" />
          </div>
          <div className="relative flex flex-col lg:flex-row items-center gap-8 text-center lg:text-left">
            <div className="flex-1">
              <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-[1.12]">
                Insurance ya tax-saving plan{' '}
                <span className="gradient-text-amber italic">chahiye?</span>
              </h3>
              <p className="mt-3 text-white/80 text-lg leading-relaxed max-w-xl">
                IRDAI accurate rates compare karein ya seedha Himanshu ji se baat karein —
                free consultation, koi pressure nahi.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/compare" className="nl-cta">
                Compare Karein
                <ArrowRight className="nl-cta-arrow w-5 h-5" />
              </Link>
              <a
                href={WA_OWNER}
                target="_blank"
                rel="noopener noreferrer"
                className="nl-cta-wa nl-cta"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Karein
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
