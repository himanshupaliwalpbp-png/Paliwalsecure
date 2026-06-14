'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Instagram,
  Heart,
  X,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Bookmark,
  Send,
  Play,
  CheckCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n';
import { useThemeAware } from '@/lib/use-theme-aware';

/* ────────────────────────────────────────────────────────────────────────────
   InstagramFeedSection — Instagram-style feed with stories & posts
   Displays @paliwalinsure content with real Instagram embeds
   ──────────────────────────────────────────────────────────────────────────── */

// ── Story Highlight Data ──────────────────────────────────────────────────────
interface StoryHighlight {
  id: number;
  label: string;
  image: string;
  gradient: string;
  caption: string;
}

const storyHighlights: StoryHighlight[] = [
  {
    id: 1,
    label: 'Third Party',
    image: '/instagram/story-1-baad-mein-third-party.jpg',
    gradient: 'from-orange-500 to-red-500',
    caption: 'Third Party Insurance ke fayde jaaniye! Minimum legally required cover hai — lekin kya kaafi hai?',
  },
  {
    id: 2,
    label: 'Comprehensive',
    image: '/instagram/story-2-baad-mein-comprehensive.jpg',
    gradient: 'from-purple-500 to-pink-500',
    caption: 'Comprehensive cover = Third Party + Own Damage. Apni car bhi insured, doosri car bhi! 🚗',
  },
  {
    id: 3,
    label: 'Upgrade',
    image: '/instagram/story-3-baad-mein-upgrade.jpg',
    gradient: 'from-blue-500 to-cyan-500',
    caption: 'Insurance upgrade kab karein? Jab NCB 20%+ ho ya car 3 saal purani ho — better coverage ka time hai!',
  },
  {
    id: 4,
    label: 'Sochenge',
    image: '/instagram/story-4-baad-mein-sochenge.jpg',
    gradient: 'from-amber-500 to-orange-500',
    caption: '"Baad mein sochenge" = risk lena! Accident ke baad sochne ka time nahi milta 😰',
  },
  {
    id: 5,
    label: 'Flood',
    image: '/instagram/story-5-baad-mein-flood.jpg',
    gradient: 'from-teal-500 to-blue-600',
    caption: 'Baarish mein car dubi? Engine protect add-on nahi toh ₹80,000 ka nuksan khud! 🌧️',
  },
  {
    id: 6,
    label: 'Le Lo',
    image: '/instagram/story-6-comprehensive-lo.jpg',
    gradient: 'from-rose-500 to-pink-600',
    caption: 'Comprehensive insurance le lo — pehle sochte the mehenga hai, ab samjho sasta hai! 💪',
  },
];

// ── Post Data ─────────────────────────────────────────────────────────────────
interface InstagramPost {
  id: number;
  caption: string;
  likes: number;
  comments: number;
  gradient: string;
  iconEmoji: string;
  hashtag: string;
  image?: string;
  isReel?: boolean;
  reelUrl?: string;
  embedUrl?: string;
}

const instagramPosts: InstagramPost[] = [
  {
    id: 1,
    caption: '🚗 Car insurance renewal bhool gaye? 90 din baad NCB khatam! Jaldi renew karo ₹20,000+ bachao',
    likes: 342,
    comments: 28,
    gradient: 'from-blue-600 via-indigo-600 to-purple-700',
    iconEmoji: '🚗',
    hashtag: '#CarInsurance #NCB',
    image: '/insurance-posts/car-insurance-renewal.jpg',
  },
  {
    id: 2,
    caption: '🏥 Health insurance bina PED waiting ke? Star Health ka plan dekho — 2 saal baad purani bimari cover',
    likes: 518,
    comments: 45,
    gradient: 'from-emerald-500 via-teal-600 to-cyan-600',
    iconEmoji: '🏥',
    hashtag: '#HealthInsurance #PED',
    image: '/insurance-posts/health-insurance-waiting.jpg',
  },
  {
    id: 3,
    caption: '💡 Zero Dep nahi liya? ₹50,000 ka repair bill mein ₹25,000 khud dena padega! #ZeroDepZarooriHai',
    likes: 429,
    comments: 36,
    gradient: 'from-yellow-500 via-amber-500 to-orange-500',
    iconEmoji: '💡',
    hashtag: '#ZeroDep #CarInsurance',
    image: '/insurance-posts/zero-dep-car.jpg',
  },
  {
    id: 4,
    caption: '🌧️ Baarish mein car dubi? Engine protect add-on nahi toh ₹80,000 ka nuksan khud! #FloodInsurance',
    likes: 603,
    comments: 52,
    gradient: 'from-slate-600 via-blue-700 to-indigo-800',
    iconEmoji: '🌧️',
    hashtag: '#FloodInsurance #EngineProtect',
    image: '/insurance-posts/engine-protect-flood.jpg',
  },
  {
    id: 5,
    caption: '👨‍👩‍👧‍👦 Family floater vs Individual? 4 log milke ₹10L use karo — sasta + smart! #FamilyInsurance',
    likes: 387,
    comments: 31,
    gradient: 'from-pink-500 via-rose-500 to-red-500',
    iconEmoji: '👨‍👩‍👧‍👦',
    hashtag: '#FamilyInsurance #Floater',
    image: '/insurance-posts/family-floaters-health.jpg',
  },
  {
    id: 6,
    caption: '⚡ EV insurance alag hai! Battery cover ₹4,500/saal — ₹10L+ replacement cost bachao #EVInsurance',
    likes: 276,
    comments: 22,
    gradient: 'from-green-500 via-emerald-600 to-teal-600',
    iconEmoji: '⚡',
    hashtag: '#EVInsurance #ElectricCar',
    image: '/insurance-posts/ev-insurance.jpg',
  },
  {
    id: 7,
    caption: '📋 Term insurance ₹700/month mein ₹1 Crore! Family ka future secure karo #TermPlan',
    likes: 892,
    comments: 67,
    gradient: 'from-violet-600 via-purple-600 to-fuchsia-600',
    iconEmoji: '📋',
    hashtag: '#TermInsurance #LifeCover',
    image: '/insurance-posts/term-insurance-1cr.jpg',
  },
  {
    id: 8,
    caption: '🔄 Insurance company pasand nahi? Port karo bina waiting period khoye! #Portability',
    likes: 315,
    comments: 29,
    gradient: 'from-orange-500 via-red-500 to-pink-500',
    iconEmoji: '🔄',
    hashtag: '#Portability #SwitchInsurer',
    image: '/insurance-posts/insurance-portability.jpg',
  },
  {
    id: 9,
    caption: '⚠️ Room rent limit check kiya? ₹5K limit pe ₹8K room = poore bill mein cut! #RoomRentLimit',
    likes: 456,
    comments: 38,
    gradient: 'from-red-600 via-rose-600 to-pink-600',
    iconEmoji: '⚠️',
    hashtag: '#RoomRentLimit #HealthInsurance',
    image: '/insurance-posts/room-rent-limit.jpg',
  },
  {
    id: 10,
    caption: '🚨 Cancer, Heart Attack, Kidney Failure... Kya aap financially tayaar hain? Critical Illness Insurance = Diagnosis pe lump sum payout! Normal health insurance sirf hospital bills cover karta hai 🛡️',
    likes: 1247,
    comments: 89,
    gradient: 'from-red-600 via-rose-600 to-pink-600',
    iconEmoji: '🛡️',
    hashtag: '#CriticalIllness #InsuranceTips',
    image: '/insurance-posts/car-insurance-renewal.jpg',
    isReel: true,
    reelUrl: 'https://www.instagram.com/reel/DXeKuKyEW5q/',
    embedUrl: 'https://www.instagram.com/reel/DXeKuKyEW5q/embed/',
  },
  {
    id: 11,
    caption: '📱 Insurance kharidna ab itna easy hai! InsureGPT se apni zaroorat batao, best plan 2 minute mein! AI-powered comparison = better choice 💪',
    likes: 654,
    comments: 43,
    gradient: 'from-cyan-600 via-blue-600 to-indigo-600',
    iconEmoji: '📱',
    hashtag: '#InsureGPT #AIInsurance',
    image: '/insurance-posts/term-insurance-1cr.jpg',
  },
];

// ── Instagram Ring Animation Keyframes ────────────────────────────────────────
const INSTAGRAM_GRADIENT = 'linear-gradient(45deg, #F58529, #DD2A7B, #8134AF, #515BD4)';

// ── Instagram Embed Component ─────────────────────────────────────────────────
// Reusable component for rendering real Instagram embed iframes
// with loading state and fallback
function InstagramEmbed({
  embedUrl,
  fallbackUrl,
  width = '100%',
  height = 480,
  className = '',
  aspectClass = 'aspect-[9/16]',
  maxHClass = 'max-h-[480px]',
  loadingGradient = 'from-red-600 via-rose-600 to-pink-700',
  loadingEmoji = '🛡️',
  showCaption = true,
  t,
}: {
  embedUrl: string;
  fallbackUrl: string;
  width?: string;
  height?: number;
  className?: string;
  aspectClass?: string;
  maxHClass?: string;
  loadingGradient?: string;
  loadingEmoji?: string;
  showCaption?: boolean;
  t: (key: string) => string;
}) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeFailed, setIframeFailed] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Timeout: if iframe doesn't load in 15s, show fallback
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!iframeLoaded) {
        setIframeFailed(true);
      }
    }, 15000);
    return () => clearTimeout(timeout);
  }, [iframeLoaded]);

  // If failed, show the styled fallback card
  if (iframeFailed) {
    return (
      <a
        href={fallbackUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`block relative ${aspectClass} ${maxHClass} rounded-xl overflow-hidden group/fallback ${className}`}
      >
        <div className={`w-full h-full bg-gradient-to-br ${loadingGradient} flex flex-col items-center justify-center gap-3 p-4`}>
          <span className="text-6xl opacity-60 group-hover/fallback:opacity-80 transition-opacity">{loadingEmoji}</span>
          <AlertCircle className="w-6 h-6 text-white/50" />
          <p className="text-xs text-white/70 text-center">{t('igFeed.embedError')}</p>
          <div className="flex items-center gap-1.5 text-white/90 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mt-1">
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">{t('igFeed.embedFallback')}</span>
          </div>
        </div>
      </a>
    );
  }

  return (
    <div className={`relative ${aspectClass} ${maxHClass} rounded-xl overflow-hidden ${className}`}>
      {/* Loading skeleton */}
      {!iframeLoaded && (
        <div className={`absolute inset-0 z-10 bg-gradient-to-br ${loadingGradient} flex flex-col items-center justify-center gap-3`}>
          <span className="text-6xl opacity-40">{loadingEmoji}</span>
          <div className="flex items-center gap-2 text-white/60">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs">{t('igFeed.embedLoading')}</span>
          </div>
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
        </div>
      )}

      {/* Real Instagram embed iframe */}
      <iframe
        ref={iframeRef}
        src={embedUrl}
        width={width}
        height={height}
        className={`w-full h-full border-0 transition-opacity duration-500 ${iframeLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
        scrolling={showCaption ? 'auto' : 'no'}
        onLoad={() => setIframeLoaded(true)}
        onError={() => setIframeFailed(true)}
        title="Instagram embed"
        loading="lazy"
      />
    </div>
  );
}

export default function InstagramFeedSection() {
  const { t } = useLanguage();
  const { isDark } = useThemeAware();
  const [activeStory, setActiveStory] = useState<number | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const storyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const STORY_DURATION = 5000; // 5 seconds per story

  // ── Story auto-advance ──────────────────────────────────────────────────
  const clearStoryTimer = useCallback(() => {
    if (storyTimerRef.current) {
      clearInterval(storyTimerRef.current);
      storyTimerRef.current = null;
    }
  }, []);

  // Timer effect - runs directly in useEffect to avoid setState-in-effect lint issue
  useEffect(() => {
    if (activeStory === null) {
      clearStoryTimer();
      return;
    }

    // Clear any existing timer
    clearStoryTimer();

    const startTime = Date.now();
    storyTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / STORY_DURATION) * 100, 100);
      setStoryProgress(progress);
      if (progress >= 100) {
        clearStoryTimer();
        // Auto advance to next story
        setActiveStory((prev) => {
          if (prev !== null && prev < storyHighlights.length) {
            return prev + 1;
          }
          return null; // Close if last story
        });
      }
    }, 50);

    return () => clearStoryTimer();
  }, [activeStory, clearStoryTimer]);

  const openStory = (id: number) => {
    setActiveStory(id);
    setStoryProgress(0);
  };

  const closeStory = () => {
    clearStoryTimer();
    setActiveStory(null);
    setStoryProgress(0);
  };

  const nextStory = () => {
    if (activeStory !== null && activeStory < storyHighlights.length) {
      setActiveStory(activeStory + 1);
      setStoryProgress(0);
    } else {
      closeStory();
    }
  };

  const prevStory = () => {
    if (activeStory !== null && activeStory > 1) {
      setActiveStory(activeStory - 1);
      setStoryProgress(0);
    }
  };

  const currentHighlight = storyHighlights.find((s) => s.id === activeStory);

  return (
    <section
      id="instagram-feed"
      className="relative py-12 sm:py-16 lg:py-24 overflow-hidden"
      style={{
        background: isDark
          ? 'linear-gradient(180deg, #0A1330 0%, #0F1D30 50%, #0A1330 100%)'
          : 'linear-gradient(180deg, #FAFAF8 0%, #F0F4FF 50%, #FAFAF8 100%)',
      }}
    >
      {/* Background decorations */}
      <div className="absolute top-20 -left-40 w-80 h-80 bg-[#E1306C]/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -right-40 w-80 h-80 bg-[#8134AF]/[0.04] rounded-full blur-3xl pointer-events-none" />

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
            {t('igFeed.badge')}
          </Badge>
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#0A1330]'} leading-tight`}>
            {t('igFeed.title')}{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(45deg, #F58529, #DD2A7B, #8134AF)' }}
            >
              @paliwalinsure
            </span>
          </h2>
          <p className={`mt-3 text-sm sm:text-base lg:text-lg ${isDark ? 'text-white/70' : 'text-[#1A1A2E]/70'} max-w-2xl mx-auto leading-relaxed`}>
            {t('igFeed.subtitle')}
          </p>
        </motion.div>

        {/* ── Featured Reel Section with Real Embed ───────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 sm:mb-14"
        >
          <div className="relative rounded-2xl overflow-hidden border-2 border-[#C98A1C]/40 hover:border-[#C98A1C]/70 transition-all duration-500"
            style={{
              background: 'linear-gradient(135deg, rgba(220,38,38,0.15) 0%, rgba(225,29,108,0.12) 40%, rgba(159,18,57,0.10) 100%)',
              backdropFilter: 'blur(16px)',
            }}
          >
            {/* Inner glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-rose-900/10 to-crimson-900/10 pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-pink-600" />

            <div className="relative z-10 p-4 sm:p-6 lg:p-8">
              {/* Instagram-style header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full p-[2px]"
                    style={{ background: INSTAGRAM_GRADIENT }}
                  >
                    <div className="w-full h-full rounded-full bg-[#0A1330] flex items-center justify-center">
                      <span className="text-sm sm:text-base font-bold text-[#C98A1C]">P</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm sm:text-base font-bold text-white">paliwalinsure</span>
                      <CheckCircle className="w-4 h-4 text-[#C98A1C] fill-[#C98A1C]" />
                    </div>
                    <span className="text-[10px] sm:text-xs text-white/50">{t('igFeed.originalAudio')}</span>
                  </div>
                </div>
                <Badge className="bg-[#C98A1C]/20 text-[#C98A1C] border border-[#C98A1C]/40 px-3 py-1 text-xs font-bold rounded-full">
                  {t('igFeed.latestReel')}
                </Badge>
              </div>

              {/* Reel content area — real Instagram embed */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Left: Real Instagram Embed */}
                <InstagramEmbed
                  embedUrl="https://www.instagram.com/reel/DXeKuKyEW5q/embed/"
                  fallbackUrl="https://www.instagram.com/reel/DXeKuKyEW5q/"
                  height={580}
                  aspectClass="aspect-[9/14]"
                  maxHClass="max-h-[580px]"
                  loadingGradient="from-red-600 via-rose-600 to-pink-700"
                  loadingEmoji="🛡️"
                  showCaption={true}
                  t={t}
                />

                {/* Right: Reel description */}
                <div className="flex flex-col justify-center space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-red-600/20 text-red-400 border border-red-600/30 px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full">
                      {t('igFeed.featuredReel')}
                    </Badge>
                    <Badge className="bg-white/10 text-white/70 border border-white/10 px-2.5 py-0.5 text-[10px] sm:text-xs font-medium rounded-full">
                      #CriticalIllness
                    </Badge>
                  </div>

                  <div className="text-white/90 text-xs sm:text-sm leading-relaxed space-y-1.5 whitespace-pre-line font-medium">
                    <p>🚨 Cancer, Heart Attack, Kidney Failure…</p>
                    <p className="text-white font-bold">Kya aap financially tayaar hain?</p>
                    <p className="text-white/70">India me har saal lakhon cases hote hain —</p>
                    <p className="text-white/70">aur treatment cost ₹5 lakh se ₹50 lakh tak ja sakti hai 💸</p>
                    <p className="mt-2 text-rose-400 font-bold">⚠️ Sabse bada myth:</p>
                    <p className="text-white/80 italic">&quot;Health Insurance hai toh sab cover hai&quot;</p>
                    <p className="text-white/70">👉 Reality: Normal health insurance sirf hospital bills cover karta hai</p>
                    <p className="mt-2 text-emerald-400 font-bold">🛡️ Critical Illness Insurance kya karta hai?</p>
                    <p className="text-white/80">✔ Diagnosis par lump sum payout</p>
                    <p className="text-white/80">✔ Income loss ko cover karta hai</p>
                    <p className="text-white/80">✔ Family ko financial stress se bachata hai</p>
                    <p className="mt-2 text-[#C98A1C] font-bold">💡 Smart move: Health Insurance + Critical Illness = Complete protection</p>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <a
                      href="https://www.instagram.com/reel/DXeKuKyEW5q/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#833AB4] text-white rounded-full text-xs sm:text-sm font-semibold px-5 py-2.5 shadow-lg shadow-rose-900/30 hover:shadow-xl hover:shadow-rose-800/40 transition-all duration-300 min-h-[44px]"
                      >
                        <Play className="w-4 h-4 mr-2 fill-white" />
                        {t('igFeed.watchOnInstagram')}
                      </Button>
                    </a>
                    <a
                      href="https://wa.me/919257877312"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#C98A1C]/40 text-[#C98A1C] hover:bg-[#C98A1C]/10 hover:border-[#C98A1C]/60 rounded-full text-xs sm:text-sm font-semibold px-5 py-2.5 transition-all duration-300 backdrop-blur-sm bg-transparent min-h-[44px]"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {t('igFeed.whatsappBtn')}
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Golden accent border glow */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C98A1C]/60 to-transparent" />
          </div>
        </motion.div>

        {/* ── Story Highlights Row ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 sm:mb-14"
        >
          <h3 className={`text-xs font-semibold ${isDark ? 'text-white/50' : 'text-[#6B7280]'} uppercase tracking-wider mb-4 text-center`}>
            {t('igFeed.storyHighlights')}
          </h3>
          <div
            className="flex gap-4 sm:gap-6 justify-center flex-wrap"
          >
            {storyHighlights.map((highlight, index) => (
              <motion.div
                key={highlight.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="flex flex-col items-center gap-1.5 cursor-pointer group"
                onClick={() => openStory(highlight.id)}
              >
                {/* Instagram-style gradient ring */}
                <div
                  className="relative p-[3px] rounded-full"
                  style={{ background: INSTAGRAM_GRADIENT }}
                >
                  <div className="rounded-full p-[3px] bg-[#0F1D30]">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden relative">
                      <img
                        src={highlight.image}
                        alt={highlight.label}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.parentElement) {
                            target.parentElement.style.background = `linear-gradient(135deg, var(--tw-gradient-stops))`;
                            target.parentElement.innerHTML = `<span class="flex items-center justify-center w-full h-full text-2xl">${highlight.label.charAt(0)}</span>`;
                          }
                        }}
                      />
                      {/* Fallback gradient overlay */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${highlight.gradient} opacity-30 mix-blend-overlay`}
                      />
                    </div>
                  </div>
                </div>
                <span className={`text-[10px] sm:text-xs ${isDark ? 'text-white/70' : 'text-[#6B7280]'} font-medium group-hover:text-white transition-colors text-center max-w-[72px] truncate`}>
                  {highlight.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Instagram Feed Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {instagramPosts.map((post, index) => {
            const postLink = post.isReel && post.reelUrl ? post.reelUrl : 'https://instagram.com/paliwalinsure';

            // For the reel post with embed URL, render a real embed card
            if (post.isReel && post.embedUrl) {
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="group relative rounded-2xl overflow-hidden transition-all duration-300 border border-[#C98A1C]/30 hover:border-[#C98A1C]/60"
                  style={{
                    background: 'rgba(220,38,38,0.06)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  {/* Real Instagram Embed for the reel post */}
                  <div className="relative overflow-hidden">
                    <InstagramEmbed
                      embedUrl={post.embedUrl}
                      fallbackUrl={post.reelUrl || postLink}
                      height={520}
                      aspectClass="aspect-square"
                      maxHClass="max-h-[520px]"
                      loadingGradient={post.gradient}
                      loadingEmoji={post.iconEmoji}
                      showCaption={true}
                      t={t}
                    />
                  </div>

                  {/* Caption Area */}
                  <div className="p-3 sm:p-4 space-y-2.5">
                    {/* Action buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-white/70 hover:text-red-500 transition-colors cursor-pointer" />
                        <MessageCircle className="w-5 h-5 text-white/70 hover:text-white transition-colors cursor-pointer" />
                        <Send className="w-5 h-5 text-white/70 hover:text-white transition-colors cursor-pointer" />
                      </div>
                      <Bookmark className="w-5 h-5 text-white/70 hover:text-[#C98A1C] transition-colors cursor-pointer" />
                    </div>

                    {/* Like count */}
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                      <span className="text-xs font-bold text-white">
                        {post.likes.toLocaleString()}
                      </span>
                      <span className={`text-xs ${isDark ? 'text-white/50' : 'text-[#6B7280]'}`}>{t('igFeed.post.likes')}</span>
                    </div>

                    {/* Caption */}
                    <p className={`text-xs sm:text-sm ${isDark ? 'text-white/85' : 'text-[#1A1A2E]/75'} leading-relaxed line-clamp-3`}>
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-[#0A1330]'}`}>paliwalinsure</span>{' '}
                      {post.caption}
                    </p>

                    {/* Hashtag */}
                    <p className="text-[10px] sm:text-xs text-[#E1306C]/80 font-medium">
                      {post.hashtag}
                    </p>

                    {/* Watch Reel link */}
                    <a
                      href={postLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium transition-colors"
                      style={{ color: '#C98A1C' }}
                      onMouseEnter={(e) => { (e.target as HTMLElement).style.color = '#E1306C'; }}
                      onMouseLeave={(e) => { (e.target as HTMLElement).style.color = '#C98A1C'; }}
                    >
                      <Play className="w-3 h-3" />
                      {t('igFeed.watchReel')} →
                    </a>
                  </div>
                </motion.div>
              );
            }

            // Standard post cards with images
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="group relative rounded-2xl overflow-hidden transition-all duration-300 border border-white/[0.06] hover:border-[#E1306C]/30"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {/* Square Image Area (real image + gradient fallback) */}
                <div className="relative aspect-square overflow-hidden">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.caption.slice(0, 50)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : null}
                  {/* Gradient overlay for visual consistency */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${post.gradient} ${post.image ? 'opacity-20 mix-blend-overlay' : 'opacity-100'} flex items-center justify-center`}
                  >
                    {!post.image && (
                      <span className="text-6xl sm:text-7xl opacity-60 group-hover:opacity-80 transition-opacity duration-300 group-hover:scale-110 transform">
                        {post.iconEmoji}
                      </span>
                    )}
                  </div>

                  {/* Hover overlay with engagement stats */}
                  <a
                    href={postLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6 z-20"
                  >
                    <div className="flex items-center gap-1.5 text-white">
                      <Heart className="w-5 h-5 fill-white" />
                      <span className="text-sm font-bold">{post.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-bold">{post.comments}</span>
                    </div>
                  </a>

                  {/* Instagram top bar */}
                  <div className="absolute top-0 left-0 right-0 p-2.5 flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ background: INSTAGRAM_GRADIENT }}
                      >
                        <div className="w-5 h-5 rounded-full bg-[#0F1D30] flex items-center justify-center">
                          <span className="text-[8px] font-bold text-[#C98A1C]">P</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-white drop-shadow-md">
                        paliwalinsure
                      </span>
                    </div>
                    <a href={postLink} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Caption Area */}
                <div className="p-3 sm:p-4 space-y-2.5">
                  {/* Action buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-white/70 hover:text-red-500 transition-colors cursor-pointer" />
                      <MessageCircle className="w-5 h-5 text-white/70 hover:text-white transition-colors cursor-pointer" />
                      <Send className="w-5 h-5 text-white/70 hover:text-white transition-colors cursor-pointer" />
                    </div>
                    <Bookmark className="w-5 h-5 text-white/70 hover:text-[#C98A1C] transition-colors cursor-pointer" />
                  </div>

                  {/* Like count */}
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                    <span className="text-xs font-bold text-white">
                      {post.likes.toLocaleString()}
                    </span>
                    <span className={`text-xs ${isDark ? 'text-white/50' : 'text-[#6B7280]'}`}>{t('igFeed.post.likes')}</span>
                  </div>

                  {/* Caption */}
                  <p className={`text-xs sm:text-sm ${isDark ? 'text-white/85' : 'text-[#1A1A2E]/75'} leading-relaxed line-clamp-3`}>
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-[#0A1330]'}`}>paliwalinsure</span>{' '}
                    {post.caption}
                  </p>

                  {/* Hashtag */}
                  <p className="text-[10px] sm:text-xs text-[#E1306C]/80 font-medium">
                    {post.hashtag}
                  </p>

                  {/* Open on Instagram link */}
                  <a
                    href={postLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium transition-colors"
                    style={{ color: '#C98A1C' }}
                    onMouseEnter={(e) => { (e.target as HTMLElement).style.color = '#E1306C'; }}
                    onMouseLeave={(e) => { (e.target as HTMLElement).style.color = '#C98A1C'; }}
                  >
                    <Instagram className="w-3 h-3" />
                    {t('igFeed.post.openInstagram')}
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── CTA Section ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 sm:mt-14 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="https://instagram.com/paliwalinsure"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#833AB4] hover:from-[#DD2A7B] hover:via-[#833AB4] hover:to-[#F58529] text-white font-semibold px-6 py-5 rounded-full shadow-lg shadow-[#E1306C]/20 hover:shadow-xl hover:shadow-[#E1306C]/30 transition-all duration-300 group/btn min-h-[48px]"
            >
              <Instagram className="w-5 h-5 mr-2" />
              {t('igFeed.followBtn')}
            </Button>
          </a>
          <a
            href="https://wa.me/919257877312"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              variant="outline"
              className="border-[#C98A1C]/30 text-[#C98A1C] hover:bg-[#C98A1C]/10 hover:border-[#C98A1C]/50 font-semibold px-6 py-5 rounded-full transition-all duration-300 backdrop-blur-sm bg-transparent min-h-[48px]"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              {t('igFeed.whatsappBtn')}
            </Button>
          </a>
        </motion.div>
      </div>

      {/* ── Story Modal (Instagram-style) ──────────────────────────────────── */}
      <AnimatePresence>
        {activeStory !== null && currentHighlight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            onClick={closeStory}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/95" />

            {/* Story Content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative w-full max-w-sm sm:max-w-md aspect-[9/16] max-h-[85vh] rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Progress bar at top */}
              <div className="absolute top-0 left-0 right-0 z-20 p-2 flex gap-1">
                {storyHighlights.map((s) => (
                  <div
                    key={s.id}
                    className="h-[2px] flex-1 rounded-full bg-white/30 overflow-hidden"
                  >
                    <div
                      className="h-full bg-white rounded-full transition-all duration-100"
                      style={{
                        width:
                          s.id < currentHighlight.id
                            ? '100%'
                            : s.id === currentHighlight.id
                              ? `${storyProgress}%`
                              : '0%',
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Header */}
              <div className="absolute top-6 left-0 right-0 z-20 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full p-[2px]"
                    style={{ background: INSTAGRAM_GRADIENT }}
                  >
                    <div className="w-full h-full rounded-full bg-[#0A1330] flex items-center justify-center">
                      <span className="text-[9px] font-bold text-[#C98A1C]">P</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-white">paliwalinsure</span>
                  <span className="text-[10px] text-white/50">2h</span>
                </div>
                <button
                  onClick={closeStory}
                  className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                  aria-label="Close story"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Story Image */}
              <div className="w-full h-full relative">
                <img
                  src={currentHighlight.image}
                  alt={currentHighlight.label}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      target.parentElement.style.background = `linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)`;
                    }
                  }}
                />
                {/* Fallback gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${currentHighlight.gradient} opacity-40 mix-blend-overlay`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                {/* Story caption */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                    {currentHighlight.label}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                    {currentHighlight.caption}
                  </p>

                  {/* CTA buttons */}
                  <div className="flex gap-3 mt-4">
                    <a
                      href="https://instagram.com/paliwalinsure"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#833AB4] text-white rounded-full text-xs font-semibold px-4"
                      >
                        <Instagram className="w-3.5 h-3.5 mr-1.5" />
                        {t('igFeed.story.followBtn')}
                      </Button>
                    </a>
                    <a
                      href="https://wa.me/919257877312"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-[#060B1E] rounded-full text-xs font-bold px-4"
                      >
                        <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                        {t('igFeed.story.whatsappBtn')}
                      </Button>
                    </a>
                  </div>
                </div>
              </div>

              {/* Navigation arrows */}
              {activeStory > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevStory();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 transition-all"
                  aria-label="Previous story"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              {activeStory < storyHighlights.length && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextStory();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 transition-all"
                  aria-label="Next story"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
