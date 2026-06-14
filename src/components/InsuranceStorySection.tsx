'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Instagram,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Heart,
  Car,
  Droplets,
  Banknote,
  Phone,
  MessageCircle,
  X,
  Share2,
  Bookmark,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';
import { useThemeAware } from '@/lib/use-theme-aware';

/* ────────────────────────────────────────────────────────────────────────────
   InsuranceStorySection — "Baad Mein" Campaign + Real Stories
   Displays @paliwalinsure Instagram posts as story cards with
   detailed insurance education content
   ──────────────────────────────────────────────────────────────────────────── */

interface StorySlide {
  id: number;
  image: string;
  instagramUrl: string;
}

const stories: StorySlide[] = [
  {
    id: 1,
    image: '/instagram/story-1-baad-mein-third-party.jpg',
    instagramUrl: 'https://instagram.com/paliwalinsure',
  },
  {
    id: 2,
    image: '/instagram/story-2-baad-mein-comprehensive.jpg',
    instagramUrl: 'https://instagram.com/paliwalinsure',
  },
  {
    id: 3,
    image: '/instagram/story-3-baad-mein-upgrade.jpg',
    instagramUrl: 'https://instagram.com/paliwalinsure',
  },
  {
    id: 4,
    image: '/instagram/story-4-baad-mein-sochenge.jpg',
    instagramUrl: 'https://instagram.com/paliwalinsure',
  },
  {
    id: 5,
    image: '/instagram/story-5-baad-mein-flood.jpg',
    instagramUrl: 'https://instagram.com/paliwalinsure',
  },
  {
    id: 6,
    image: '/instagram/story-6-comprehensive-lo.jpg',
    instagramUrl: 'https://instagram.com/paliwalinsure',
  },
];

export default function InsuranceStorySection() {
  const { t } = useLanguage();
  const { isDark } = useThemeAware();
  const [activeStory, setActiveStory] = useState<number | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentStory = stories.find((s) => s.id === activeStory);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  const openStory = (id: number) => {
    setActiveStory(id);
    setShowDetail(true);
  };

  const closeStory = () => {
    setShowDetail(false);
    setTimeout(() => setActiveStory(null), 300);
  };

  const nextStory = () => {
    if (activeStory && activeStory < stories.length) {
      setActiveStory(activeStory + 1);
    }
  };

  const prevStory = () => {
    if (activeStory && activeStory > 1) {
      setActiveStory(activeStory - 1);
    }
  };

  // Helper to get story text by id and field
  const st = (id: number, field: string) => t(`story.${id}.${field}`);

  return (
    <section
      id="stories"
      className="relative py-12 sm:py-16 lg:py-24 overflow-hidden"
      style={{
        background: isDark
          ? 'linear-gradient(180deg, #0F1D30 0%, #0A1330 50%, #060B1E 100%)'
          : 'linear-gradient(180deg, #F0F4FF 0%, #FAFAF8 50%, #F5F4F0 100%)',
      }}
    >
      {/* Background decorations */}
      <div className="absolute top-0 -left-40 w-80 h-80 bg-[#C98A1C]/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-80 h-80 bg-[#162D5A]/[0.05] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── Section Header ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-8 sm:mb-12"
        >
          <Badge className="mb-4 bg-[#E1306C]/10 text-[#E1306C] border border-[#E1306C]/25 px-4 py-1.5 text-xs font-semibold rounded-full">
            <Instagram className="w-3.5 h-3.5 mr-1.5" />
            {t('stories.badge')}
          </Badge>
          <h2 className={`text-2xl sm:text-3xl lg:text-5xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#0A1330]'} leading-tight`}>
            <span className="gradient-text-universal">
              &quot;{t('stories.heading1')}&quot;
            </span>{' '}
            — {t('stories.heading2')}
          </h2>
          <p className={`mt-3 text-sm sm:text-base ${isDark ? 'text-white/80' : 'text-[#1A1A2E]/75'} max-w-2xl mx-auto leading-relaxed`}>
            {t('stories.description')}
          </p>
        </motion.div>

        {/* ── Story Cards Carousel ────────────────────────────────────────── */}
        <div className="relative">
          {/* Scroll buttons */}
          <button
            onClick={scrollLeft}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full border border-[#C98A1C]/30 text-[#C98A1C] hover:bg-[#C98A1C]/10 transition-all -translate-x-2"
            style={{ background: isDark ? 'rgba(10,22,40,0.9)' : 'rgba(255,255,255,0.9)' }}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollRight}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full border border-[#C98A1C]/30 text-[#C98A1C] hover:bg-[#C98A1C]/10 transition-all translate-x-2"
            style={{ background: isDark ? 'rgba(10,22,40,0.9)' : 'rgba(255,255,255,0.9)' }}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 px-2 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="flex-shrink-0 w-[260px] sm:w-[280px] snap-start cursor-pointer group"
                onClick={() => openStory(story.id)}
              >
                <div
                  className={`relative rounded-2xl overflow-hidden border border-[rgba(201,138,28,0.2)] hover:border-[#C98A1C]/50 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-[#C98A1C]/10 ${isDark ? 'bg-white/[0.04]' : 'bg-white'} backdrop-blur-sm lg:backdrop-blur-[12px]`}
                >
                  {/* Story Image */}
                  <div className="relative h-[300px] sm:h-[340px] overflow-hidden">
                    <img
                      src={story.image}
                      alt={st(story.id, 'tagline')}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060B1E] via-[#060B1E]/40 to-transparent opacity-90" />

                    {/* Story number badge */}
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#060B1E]/80 border border-[#C98A1C]/30 text-[10px] font-bold text-[#C98A1C]">
                      {story.id}/{stories.length}
                    </div>

                    {/* Instagram badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#060B1E]/80 border border-[#E1306C]/30">
                      <Instagram className="w-3 h-3 text-[#E1306C]" />
                      <span className="text-[9px] font-semibold text-[#E1306C]">{t('stories.badge')}</span>
                    </div>

                    {/* Text overlay on image */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-sm sm:text-base lg:text-xl font-bold text-white leading-tight mb-1 line-clamp-2">
                        {st(story.id, 'tagline')}
                      </h3>
                      <p className="text-xs text-white/70 line-clamp-1">
                        {st(story.id, 'subtitle')}
                      </p>
                    </div>
                  </div>

                  {/* Bottom action bar */}
                  <div className="flex items-center justify-between px-3 py-2 border-t border-[#C98A1C]/10">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-white/50 font-medium">{t('stories.tapToRead')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ExternalLink className="w-3 h-3 text-[#C98A1C]/60" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Quick Story Stats ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {[
            { icon: AlertTriangle, label: t('stories.stat.mistakes'), value: t('stories.stat.realStories'), color: 'text-red-400' },
            { icon: Banknote, label: t('stories.stat.loss'), value: t('stories.stat.lossAmount'), color: 'text-[#C98A1C]' },
            { icon: ShieldCheck, label: t('stories.stat.saved'), value: t('stories.stat.coveragePercent'), color: 'text-emerald-400' },
            { icon: Heart, label: t('stories.stat.trusted'), value: t('stories.stat.familiesCount'), color: 'text-[#C98A1C]' },
          ].map((stat) => {
            const StatIcon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-xl p-3 sm:p-4 text-center border border-[rgba(201,138,28,0.12)]"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
                }}
              >
                <StatIcon className={`w-5 h-5 ${stat.color} mx-auto mb-1.5`} />
                <div className="text-sm sm:text-base font-bold text-white">{stat.value}</div>
                <div className={`text-[10px] sm:text-xs ${isDark ? 'text-white/50' : 'text-[#6B7280]'} mt-0.5`}>{stat.label}</div>
              </div>
            );
          })}
        </motion.div>

        {/* ── Instagram CTA ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="https://instagram.com/paliwalinsure"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#E1306C] via-[#C13584] to-[#833AB4] hover:from-[#C13584] hover:via-[#833AB4] hover:to-[#E1306C] text-white font-semibold px-6 py-5 rounded-full shadow-lg shadow-[#E1306C]/20 hover:shadow-xl hover:shadow-[#E1306C]/30 transition-all duration-300 group/btn min-h-[48px]"
            >
              <Instagram className="w-5 h-5 mr-2" />
              {t('stories.cta.instagram')}
            </Button>
          </a>
          <a
            href="https://wa.me/919257877312"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ShinyButton
              variant="secondary"
              className="min-h-[48px]"
            >
              <span className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                {t('stories.cta.whatsapp')}
              </span>
            </ShinyButton>
          </a>
        </motion.div>
      </div>

      {/* ── Story Detail Modal ───────────────────────────────────────────── */}
      <AnimatePresence>
        {showDetail && currentStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
            onClick={closeStory}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-[#060B1E]/90 backdrop-blur-sm" />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#C98A1C]/25 shadow-2xl"
              style={{
                background: 'linear-gradient(180deg, #0F1D30 0%, #0A1330 100%)',
                scrollbarWidth: 'thin',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeStory}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-[#060B1E]/80 border border-[#C98A1C]/30 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                aria-label="Close story"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Story Image */}
              <div className="relative h-[220px] sm:h-[300px] overflow-hidden">
                <img
                  src={currentStory.image}
                  alt={st(currentStory.id, 'tagline')}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1330] via-transparent to-transparent" />

                {/* Story number */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#060B1E]/80 border border-[#C98A1C]/30 text-xs font-bold text-[#C98A1C]">
                  {currentStory.id}/{stories.length}
                </div>

                {/* Progress dots */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1">
                  {stories.map((s) => (
                    <div
                      key={s.id}
                      className={`h-[2px] rounded-full transition-all duration-300 ${
                        s.id === currentStory.id
                          ? 'w-8 bg-[#C98A1C]'
                          : s.id < currentStory.id
                            ? 'w-6 bg-[#C98A1C]/60'
                            : 'w-6 bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Story Content */}
              <div className="p-4 sm:p-6 space-y-5">
                {/* Title */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                    {st(currentStory.id, 'tagline')}
                  </h3>
                  <p className="text-sm text-[#C98A1C] mt-1 font-medium">{st(currentStory.id, 'subtitle')}</p>
                </div>

                {/* Story narrative */}
                <div
                  className="rounded-xl p-4 border border-[#C98A1C]/15"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <h4 className="text-sm font-bold text-[#C98A1C] mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    {st(currentStory.id, 'title')}
                  </h4>
                  <p className="text-sm text-white/90 leading-relaxed">
                    {st(currentStory.id, 'content')}
                  </p>
                </div>

                {/* Three info cards */}
                <div className="grid gap-3">
                  {/* Why Buy */}
                  <div
                    className="rounded-xl p-3 sm:p-4 border border-emerald-500/20"
                    style={{ background: 'rgba(16,185,129,0.06)' }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{t('stories.modal.whyBuy')}</h5>
                    </div>
                    <p className="text-sm text-white/85 leading-relaxed">{st(currentStory.id, 'whyBuy')}</p>
                  </div>

                  {/* Loss if Not */}
                  <div
                    className="rounded-xl p-3 sm:p-4 border border-red-500/20"
                    style={{ background: 'rgba(239,68,68,0.06)' }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <h5 className="text-xs font-bold text-red-400 uppercase tracking-wider">{t('stories.modal.lossIfNot')}</h5>
                    </div>
                    <p className="text-sm text-white/85 leading-relaxed">{st(currentStory.id, 'lossIfNot')}</p>
                  </div>

                  {/* Where Used */}
                  <div
                    className="rounded-xl p-3 sm:p-4 border border-[#C98A1C]/20"
                    style={{ background: 'rgba(201,138,28,0.06)' }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Car className="w-4 h-4 text-[#C98A1C]" />
                      <h5 className="text-xs font-bold text-[#C98A1C] uppercase tracking-wider">{t('stories.modal.whereUsed')}</h5>
                    </div>
                    <p className="text-sm text-white/85 leading-relaxed">{st(currentStory.id, 'whereUsed')}</p>
                  </div>
                </div>

                {/* Navigation + CTA */}
                <div className="flex items-center justify-between pt-2 border-t border-[#C98A1C]/10">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={prevStory}
                      disabled={currentStory.id <= 1}
                      className="text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-30"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      {t('stories.modal.prev')}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={nextStory}
                      disabled={currentStory.id >= stories.length}
                      className="text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-30"
                    >
                      {t('stories.modal.next')}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={currentStory.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-[#E1306C] to-[#833AB4] text-white rounded-full text-xs font-semibold"
                      >
                        <Instagram className="w-3.5 h-3.5 mr-1" />
                        {t('stories.instagramBtn')}
                      </Button>
                    </a>
                    <a
                      href="https://wa.me/919257877312"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ShinyButton className="text-xs">
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5" />
                          {st(currentStory.id, 'ctaText')}
                        </span>
                      </ShinyButton>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hide scrollbar */}
      <style jsx global>{`
        .snap-x::-webkit-scrollbar {
          display: none;
        }
        .snap-x {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
