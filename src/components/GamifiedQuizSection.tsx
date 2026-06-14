'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Trophy, AlertTriangle, ArrowRight, RotateCcw, Sparkles,
  CheckCircle2, XCircle, Clock, Flame, Star, Zap, Shield,
  Heart, Car, TrendingUp, Award, Target, ChevronRight,
  Lightbulb, Crown, Medal, BookOpen, ArrowLeft, Dices, ListChecks,
  Gift, MessageCircle, Phone, ExternalLink
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { quizQuestions as allQuestions, type QuizQuestion } from '@/data/quizQuestions';
import { useLanguage } from '@/lib/i18n';

// ── Use ALL questions from the data file ──────────────────────────────────
// Every time the quiz starts, questions are shuffled randomly with unique session seed
const questions: QuizQuestion[] = allQuestions;
const TOTAL_QUESTIONS = questions.length;

// ── Badge/Tier System ──────────────────────────────────────────────────
interface QuizBadge {
  nameKey: string;
  nameEmojiKey: string;
  icon: typeof Trophy;
  minScore: number;
  color: string;
  bgColor: string;
}

const quizBadges: QuizBadge[] = [
  { nameKey: 'quiz.badge.newbie', nameEmojiKey: 'quiz.badge.newbieEmoji', icon: Lightbulb, minScore: 0, color: 'text-slate-500', bgColor: 'bg-slate-100 dark:bg-slate-800' },
  { nameKey: 'quiz.badge.beginner', nameEmojiKey: 'quiz.badge.beginnerEmoji', icon: BookOpen, minScore: 50, color: 'text-[#C98A1C] dark:text-[#C98A1C]', bgColor: 'bg-[#C98A1C]/10 dark:bg-[#C98A1C]/20' },
  { nameKey: 'quiz.badge.pro', nameEmojiKey: 'quiz.badge.proEmoji', icon: Shield, minScore: 120, color: 'text-teal-600 dark:text-teal-400', bgColor: 'bg-teal-100 dark:bg-teal-900/30' },
  { nameKey: 'quiz.badge.beast', nameEmojiKey: 'quiz.badge.beastEmoji', icon: Crown, minScore: 200, color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
  { nameKey: 'quiz.badge.god', nameEmojiKey: 'quiz.badge.godEmoji', icon: Trophy, minScore: 280, color: 'text-[#C98A1C] dark:text-[#C98A1C]', bgColor: 'bg-[#C98A1C]/10 dark:bg-[#C98A1C]/20' },
];

const categoryIcons = {
  health: Heart,
  life: Shield,
  motor: Car,
  general: Brain,
  claim: CheckCircle2,
};

const categoryColors = {
  health: { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-300 dark:border-rose-700' },
  life: { bg: 'bg-[#C98A1C]/10 dark:bg-[#C98A1C]/20', text: 'text-[#C98A1C] dark:text-[#C98A1C]', border: 'border-[#C98A1C]/30 dark:border-[#C98A1C]/40' },
  motor: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-300 dark:border-amber-700' },
  general: { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-600 dark:text-teal-400', border: 'border-teal-300 dark:border-teal-700' },
  claim: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-300 dark:border-emerald-700' },
};

const difficultyColors = {
  easy: 'text-green-600 dark:text-green-400',
  medium: 'text-amber-600 dark:text-amber-400',
  hard: 'text-red-600 dark:text-red-400',
};

// ── Category selection config ──────────────────────────────────────────────
type QuizCategory = 'health' | 'life' | 'motor' | 'general' | 'claim';

interface CategoryOption {
  key: QuizCategory;
  emoji: string;
  labelKey: string;
  descKey: string;
  color: string;
  bgColor: string;
  borderColor: string;
  hoverBg: string;
  count: number;
}

// Dynamic category counts from ALL questions
const _categoryCounts = {
  health: questions.filter(q => q.category === 'health').length,
  life: questions.filter(q => q.category === 'life').length,
  motor: questions.filter(q => q.category === 'motor').length,
  general: questions.filter(q => q.category === 'general').length,
  claim: questions.filter(q => q.category === 'claim').length,
};

const categoryOptions: CategoryOption[] = [
  {
    key: 'health',
    emoji: '❤️',
    labelKey: 'quiz.cat.health',
    descKey: 'quiz.cat.healthDesc',
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-50 dark:bg-rose-950/30',
    borderColor: 'border-rose-300 dark:border-rose-700',
    hoverBg: 'hover:bg-rose-100 dark:hover:bg-rose-900/40',
    count: _categoryCounts.health,
  },
  {
    key: 'life',
    emoji: '🛡️',
    labelKey: 'quiz.cat.life',
    descKey: 'quiz.cat.lifeDesc',
    color: 'text-[#C98A1C] dark:text-[#C98A1C]',
    bgColor: 'bg-[#C98A1C]/5 dark:bg-[#C98A1C]/20',
    borderColor: 'border-[#C98A1C]/30 dark:border-[#C98A1C]/40',
    hoverBg: 'hover:bg-[#C98A1C]/10 dark:hover:bg-[#C98A1C]/30',
    count: _categoryCounts.life,
  },
  {
    key: 'motor',
    emoji: '🚗',
    labelKey: 'quiz.cat.motor',
    descKey: 'quiz.cat.motorDesc',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    borderColor: 'border-amber-300 dark:border-amber-700',
    hoverBg: 'hover:bg-amber-100 dark:hover:bg-amber-900/40',
    count: _categoryCounts.motor,
  },
  {
    key: 'general',
    emoji: '🧠',
    labelKey: 'quiz.cat.general',
    descKey: 'quiz.cat.generalDesc',
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-50 dark:bg-teal-950/30',
    borderColor: 'border-teal-300 dark:border-teal-700',
    hoverBg: 'hover:bg-teal-100 dark:hover:bg-teal-900/40',
    count: _categoryCounts.general,
  },
  {
    key: 'claim',
    emoji: '✅',
    labelKey: 'quiz.cat.claims',
    descKey: 'quiz.cat.claimsDesc',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    borderColor: 'border-emerald-300 dark:border-emerald-700',
    hoverBg: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/40',
    count: _categoryCounts.claim,
  },
];

// ── Quiz mode type ─────────────────────────────────────────────────────────
type QuizMode = 'mix' | 'category';

// ── Shuffle helpers with session-based seed for true randomness ──────────

// Simple seeded PRNG (mulberry32) — produces unique shuffle per session
function createSeededRandom(seed: number): () => number {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Generate a unique session seed from timestamp + random noise
function generateSessionSeed(): number {
  return (Date.now() ^ Math.floor(Math.random() * 0xFFFFFFFF)) >>> 0;
}

// Fisher-Yates shuffle with optional seeded random for deterministic shuffles
function shuffleArray<T>(arr: T[], rng?: () => number): T[] {
  const shuffled = [...arr];
  const random = rng ?? Math.random;
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Shuffle options within a question so answer position changes each time
function shuffleQuestionOptions(q: QuizQuestion, rng?: () => number): QuizQuestion {
  const shuffledOptions = shuffleArray(q.options, rng);
  return { ...q, options: shuffledOptions };
}

// Number of questions per quiz round
const QUESTIONS_PER_ROUND = 10;

// Pick questions — supports category filtering, shuffles both questions AND options
// Each call generates a new session seed so every play is unique
function pickQuestions(mode: QuizMode, category?: QuizCategory): QuizQuestion[] {
  const seed = generateSessionSeed();
  const rng = createSeededRandom(seed);

  let pool: QuizQuestion[];
  if (mode === 'category' && category) {
    pool = questions.filter(q => q.category === category);
  } else {
    // Mix mode: shuffle ALL questions and pick with category diversity
    // First, gather all categories that actually have questions
    const availableCategories = (Object.keys(_categoryCounts) as QuizCategory[])
      .filter(cat => _categoryCounts[cat] > 0);

    if (availableCategories.length === 0) {
      pool = questions; // fallback to all
    } else {
      // Strategy: ensure at least 1 question from each available category,
      // then fill the rest randomly from the entire pool
      const guaranteedPerCat = 1;
      const guaranteedQuestions: QuizQuestion[] = [];
      const usedIds = new Set<number>();

      // Pick guaranteed questions from each available category
      for (const cat of availableCategories) {
        const catQuestions = shuffleArray(
          questions.filter(q => q.category === cat),
          rng
        );
        const picked = catQuestions.slice(0, guaranteedPerCat);
        picked.forEach(q => usedIds.add(q.id));
        guaranteedQuestions.push(...picked);
      }

      // Fill remaining spots from entire pool (excluding already picked)
      const remaining = shuffleArray(
        questions.filter(q => !usedIds.has(q.id)),
        rng
      );
      const spotsLeft = Math.max(0, QUESTIONS_PER_ROUND - guaranteedQuestions.length);
      pool = [...guaranteedQuestions, ...remaining.slice(0, spotsLeft)];
    }
  }

  // Final shuffle of the pool and pick QUESTIONS_PER_ROUND
  const shuffled = shuffleArray(pool, rng).slice(0, QUESTIONS_PER_ROUND);
  // Also shuffle options within each question for extra randomness
  return shuffled.map(q => shuffleQuestionOptions(q, rng));
}

// ── Component ───────────────────────────────────────────────────────────────
export default function GamifiedQuizSection() {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { t } = useLanguage();

  // ── Phase: 'mode-select' | 'category-select' | 'playing' | 'result'
  const [phase, setPhase] = useState<'mode-select' | 'category-select' | 'playing'>('mode-select');
  const [quizMode, setQuizMode] = useState<QuizMode>('mix');
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);

  // Initialize quiz with lazy initialization
  const [quizState, setQuizState] = useState(() => {
    const picked = pickQuestions('mix');
    return {
      questions: picked,
      currentQ: 0,
      selectedAnswer: null as string | null,
      isAnswered: false,
      score: 0,
      streak: 0,
      maxStreak: 0,
      correctCount: 0,
      showResult: false,
      showExplanation: false,
      timeLeft: 30,
      timerActive: false,
      answeredQuestions: new Array(picked.length).fill(null) as (boolean | null)[],
    };
  });

  // Extract state from quizState for convenience
  const quizQuestions = quizState.questions;
  const currentQ = quizState.currentQ;
  const selectedAnswer = quizState.selectedAnswer;
  const isAnswered = quizState.isAnswered;
  const score = quizState.score;
  const streak = quizState.streak;
  const maxStreak = quizState.maxStreak;
  const correctCount = quizState.correctCount;
  const showResult = quizState.showResult;
  const showExplanation = quizState.showExplanation;
  const timeLeft = quizState.timeLeft;
  const timerActive = quizState.timerActive;
  const answeredQuestions = quizState.answeredQuestions;

  // Derived values
  const currentQuestion = quizQuestions[currentQ];
  const progress = ((currentQ + (isAnswered ? 1 : 0)) / quizQuestions.length) * 100;

  const updateQuiz = useCallback((updates: Partial<typeof quizState>) => {
    setQuizState((prev) => ({ ...prev, ...updates }));
  }, []);

  const startQuizWithMode = useCallback((mode: QuizMode, category?: QuizCategory) => {
    const picked = pickQuestions(mode, category);
    setQuizMode(mode);
    setSelectedCategory(category ?? null);
    setQuizState({
      questions: picked,
      currentQ: 0,
      selectedAnswer: null,
      isAnswered: false,
      score: 0,
      streak: 0,
      maxStreak: 0,
      correctCount: 0,
      showResult: false,
      showExplanation: false,
      timeLeft: 30,
      timerActive: true,
      answeredQuestions: new Array(picked.length).fill(null),
    });
    setPhase('playing');
  }, []);

  const startQuiz = useCallback(() => {
    startQuizWithMode('mix');
  }, [startQuizWithMode]);

  // Use refs for latest state in timer callback
  const isAnsweredRef = useRef(isAnswered);
  const showResultRef = useRef(showResult);
  const currentQRef = useRef(currentQ);
  const answeredQuestionsRef = useRef(answeredQuestions);

  useEffect(() => {
    isAnsweredRef.current = isAnswered;
    showResultRef.current = showResult;
    currentQRef.current = currentQ;
    answeredQuestionsRef.current = answeredQuestions;
  }, [isAnswered, showResult, currentQ, answeredQuestions]);

  // Timer
  useEffect(() => {
    if (!timerActive) return;

    timerRef.current = setTimeout(() => {
      if (isAnsweredRef.current || showResultRef.current) return;

      const nextTime = quizState.timeLeft - 1;
      if (nextTime <= 0) {
        // Time's up - mark as wrong answer
        const newAQ = [...answeredQuestionsRef.current];
        newAQ[currentQRef.current] = false;
        updateQuiz({
          timeLeft: 0,
          timerActive: false,
          isAnswered: true,
          streak: 0,
          answeredQuestions: newAQ,
          showExplanation: true,
        });
      } else {
        updateQuiz({ timeLeft: nextTime });
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timerActive, updateQuiz, quizState.timeLeft]);

  const handleAnswer = useCallback((value: string) => {
    if (isAnswered) return;

    const isCorrect = value === currentQuestion?.correctAnswer;
    const newAnswered = [...answeredQuestions];
    newAnswered[currentQ] = isCorrect;

    let newScore = score;
    let newStreak = streak;
    let newMaxStreak = maxStreak;
    let newCorrectCount = correctCount;

    if (isCorrect) {
      const streakBonus = Math.min(streak, 5) * 2;
      const timeBonus = Math.floor(timeLeft / 10);
      const totalPoints = currentQuestion.points + streakBonus + timeBonus;
      newScore = score + totalPoints;
      newStreak = streak + 1;
      newMaxStreak = Math.max(maxStreak, newStreak);
      newCorrectCount = correctCount + 1;
    } else {
      newStreak = 0;
    }

    updateQuiz({
      selectedAnswer: value,
      isAnswered: true,
      timerActive: false,
      answeredQuestions: newAnswered,
      score: newScore,
      streak: newStreak,
      maxStreak: newMaxStreak,
      correctCount: newCorrectCount,
      showExplanation: true,
    });
  }, [isAnswered, currentQuestion, streak, timeLeft, currentQ, answeredQuestions, score, maxStreak, correctCount, updateQuiz]);

  const nextQuestion = useCallback(() => {
    if (currentQ < quizQuestions.length - 1) {
      updateQuiz({
        currentQ: currentQ + 1,
        selectedAnswer: null,
        isAnswered: false,
        showExplanation: false,
        timeLeft: 30,
        timerActive: true,
      });
    } else {
      updateQuiz({
        showResult: true,
        timerActive: false,
      });
    }
  }, [currentQ, quizQuestions.length, updateQuiz]);

  // Replay with same mode & category — re-shuffles questions for a fresh round
  const shuffleAndReplay = useCallback(() => {
    startQuizWithMode(quizMode, selectedCategory ?? undefined);
  }, [startQuizWithMode, quizMode, selectedCategory]);

  // Reset to mix mode (legacy, kept for compatibility)
  const resetQuiz = useCallback(() => {
    startQuizWithMode(quizMode, selectedCategory ?? undefined);
  }, [startQuizWithMode, quizMode, selectedCategory]);

  const changeMode = useCallback(() => {
    setPhase('mode-select');
    setQuizState((prev) => ({ ...prev, timerActive: false, showResult: false }));
  }, []);

  // Get badge
  const getBadge = useCallback((s: number) => {
    return [...quizBadges].reverse().find((b) => s >= b.minScore) || quizBadges[0];
  }, []);

  // Get mode display label (inside component so it can use t())
  const getModeLabel = (mode: QuizMode, category?: QuizCategory): string => {
    if (mode === 'mix') return t('quiz.mode.mix');
    if (category) {
      const cat = categoryOptions.find(c => c.key === category);
      return cat ? `${cat.emoji} ${t(cat.labelKey)}` : t('quiz.mode.category');
    }
    return t('quiz.mode.category');
  };

  // Get streak display (inside component so it can use t())
  const getStreakDisplay = () => {
    if (streak >= 5) return { emoji: '🔥🔥🔥', text: t('quiz.streak.onFire'), color: 'text-red-500' };
    if (streak >= 3) return { emoji: '🔥🔥', text: t('quiz.streak.hot'), color: 'text-orange-500' };
    if (streak >= 2) return { emoji: '🔥', text: t('quiz.streak.normal'), color: 'text-amber-500' };
    return null;
  };

  // ── MODE SELECTION SCREEN ──────────────────────────────────────────────
  if (phase === 'mode-select') {
    return (
      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key="mode-select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="bg-white/80 dark:bg-white/5 border-slate-200/60 dark:border-white/10 shadow-sm backdrop-blur-sm lg:backdrop-blur-xl rounded-3xl overflow-hidden">
              <CardContent className="pt-8 pb-8 px-6 space-y-6">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C98A1C] to-[#E0A830] mb-4 shadow-lg shadow-[#C98A1C]/25">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground">
                    {t('quiz.badge')} 🧠
                    <Badge className="ml-2 bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-white border-0 text-[10px] font-bold px-2 py-0.5 align-middle">
                      {t('quiz.offersBadge')}
                    </Badge>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t('quiz.heading')}
                  </p>
                </motion.div>

                {/* Two Mode Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Mix Quiz Card */}
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => startQuizWithMode('mix')}
                    className="group text-left p-6 rounded-3xl border-2 border-[#C98A1C]/20 dark:border-[#C98A1C]/30 bg-gradient-to-br from-[#C98A1C]/5 to-white/50 dark:from-[#C98A1C]/10 dark:to-white/5 hover:from-[#C98A1C]/10 hover:to-[#C98A1C]/5 dark:hover:from-[#C98A1C]/20 dark:hover:to-[#C98A1C]/10 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-[#C98A1C]/20 dark:hover:shadow-[#C98A1C]/20"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C98A1C] to-[#E0A830] flex items-center justify-center shadow-lg shadow-[#C98A1C]/25 group-hover:shadow-[#C98A1C]/40 transition-shadow">
                        <Dices className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-foreground">
                          {t('quiz.mixTitle')}
                        </h4>
                        <p className="text-xs text-[#C98A1C] dark:text-[#C98A1C] font-medium">
                          {t('quiz.mixDesc')}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {QUESTIONS_PER_ROUND} {t('quiz.mixDetail')}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <Badge className="bg-[#C98A1C]/10 dark:bg-[#C98A1C]/20 text-[#C98A1C] dark:text-[#C98A1C] border-[#C98A1C]/30 dark:border-[#C98A1C]/40 border text-[10px] font-semibold px-2 py-0.5">
                        {QUESTIONS_PER_ROUND} {t('quiz.questionsCount')}
                      </Badge>
                      <Badge className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700 border text-[10px] font-semibold px-2 py-0.5">
                        {t('quiz.timerLabel')}
                      </Badge>
                    </div>
                  </motion.button>

                  {/* Category-wise Quiz Card */}
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setPhase('category-select')}
                    className="group text-left p-6 rounded-3xl border-2 border-teal-200 dark:border-teal-800/50 bg-gradient-to-br from-teal-50/80 to-white/50 dark:from-teal-950/30 dark:to-white/5 hover:from-teal-100/80 hover:to-teal-50/60 dark:hover:from-teal-900/40 dark:hover:to-teal-950/30 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-teal-200/30 dark:hover:shadow-teal-900/30"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-700 to-teal-500 flex items-center justify-center shadow-lg shadow-teal-700/25 group-hover:shadow-teal-700/40 transition-shadow">
                        <ListChecks className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-foreground">
                          {t('quiz.categoryTitle')}
                        </h4>
                        <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                          {t('quiz.categoryDesc')}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t('quiz.categoryDetail')}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <Badge className="bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-700 border text-[10px] font-semibold px-2 py-0.5">
                        {t('quiz.fiveCategories')}
                      </Badge>
                      <Badge className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700 border text-[10px] font-semibold px-2 py-0.5">
                        {t('quiz.focused')}
                      </Badge>
                    </div>
                  </motion.button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ── CATEGORY SELECTION SCREEN ──────────────────────────────────────────
  if (phase === 'category-select') {
    return (
      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key="category-select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="bg-white/80 dark:bg-white/5 border-slate-200/60 dark:border-white/10 shadow-sm backdrop-blur-sm lg:backdrop-blur-xl rounded-3xl overflow-hidden">
              <CardContent className="pt-6 pb-6 px-6 space-y-5">
                {/* Back + Header */}
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setPhase('mode-select')}
                    className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 text-foreground" />
                  </motion.button>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      {t('quiz.chooseCategory')}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {t('quiz.chooseCategoryDesc')}
                    </p>
                  </div>
                </div>

                {/* Category Buttons Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categoryOptions.map((cat, idx) => {
                    const CatIcon = categoryIcons[cat.key];
                    return (
                      <motion.button
                        key={cat.key}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + idx * 0.07, type: 'spring', stiffness: 200 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => startQuizWithMode('category', cat.key)}
                        className={`group text-left p-4 rounded-2xl border-2 ${cat.borderColor} ${cat.bgColor} ${cat.hoverBg} transition-all duration-300 shadow-sm hover:shadow-md`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl ${cat.bgColor} flex items-center justify-center`}>
                            <CatIcon className={`w-5 h-5 ${cat.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{cat.emoji}</span>
                              <h4 className="text-sm font-bold text-foreground truncate">
                                {t(cat.labelKey)}
                              </h4>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                              {t(cat.descKey)}
                            </p>
                          </div>
                          <div className="flex flex-col items-end shrink-0">
                            <Badge className={`${cat.bgColor} ${cat.color} ${cat.borderColor} border text-[10px] font-bold px-2 py-0.5`}>
                              {cat.count} Qs
                            </Badge>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ── PLAYING / RESULT PHASE ─────────────────────────────────────────────
  if (!currentQuestion && !showResult) return null;

  const badge = getBadge(score);
  const BadgeIcon = badge.icon;
  const streakDisplay = getStreakDisplay();
  const nextBadge = [...quizBadges].find((b) => b.minScore > score);
  const pointsToNext = nextBadge ? nextBadge.minScore - score : 0;

  return (
    <div className="w-full">
      {/* ── Quiz Header Stats ─────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Change Mode Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={changeMode}
            className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
            title={t('quiz.modeChangeLabel')}
          >
            <ArrowLeft className="w-3 h-3" />
            {t('quiz.modeLabel')}
          </motion.button>
          <Badge className={`${badge.bgColor} ${badge.color} border-0 text-xs font-bold px-2.5 py-1`}>
            <BadgeIcon className="w-3 h-3 mr-1" />
            {t(badge.nameEmojiKey)}
          </Badge>
          {streakDisplay && (
            <motion.span
              key={streak}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-xs font-bold ${streakDisplay.color}`}
            >
              {streakDisplay.emoji} {streakDisplay.text}
            </motion.span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Mode indicator */}
          <Badge className="bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border-0 text-[10px] font-semibold px-2 py-0.5 hidden sm:inline-flex">
            {getModeLabel(quizMode, selectedCategory ?? undefined)}
          </Badge>
          <span className="text-sm font-bold text-foreground flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-500" />
            {score} {t('quiz.points')}
          </span>
        </div>
      </div>

      {/* ── Progress Bar ──────────────────────────────────────────── */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
          <span>Q{Math.min(currentQ + 1, quizQuestions.length)} of {quizQuestions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#0A1330] via-[#C98A1C] to-[#162D5A] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        {/* Answer dots */}
        <div className="flex items-center justify-center gap-1.5 mt-2 flex-wrap">
          {quizQuestions.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === currentQ && !showResult
                  ? 'bg-[#C98A1C] dark:bg-[#C98A1C] scale-125 ring-2 ring-[#C98A1C]/30'
                  : answeredQuestions[i] === true
                  ? 'bg-emerald-500'
                  : answeredQuestions[i] === false
                  ? 'bg-red-400'
                  : 'bg-slate-300 dark:bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Main Quiz Area ────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key={`q-${currentQ}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white/80 dark:bg-white/5 border-slate-200/60 dark:border-white/10 shadow-sm backdrop-blur-sm lg:backdrop-blur-xl rounded-3xl overflow-hidden">
              {/* Timer Bar */}
              <div className="h-1.5 bg-slate-100 dark:bg-white/5">
                <motion.div
                  className={`h-full rounded-full transition-colors duration-300 ${
                    timeLeft > 20 ? 'bg-emerald-500' : timeLeft > 10 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  animate={{ width: `${(timeLeft / 30) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <CardContent className="pt-5 pb-5 space-y-4">
                {/* Category + Difficulty + Timer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const CatIcon = categoryIcons[currentQuestion.category];
                      const catStyle = categoryColors[currentQuestion.category];
                      return (
                        <Badge className={`${catStyle.bg} ${catStyle.text} ${catStyle.border} border text-[10px] font-semibold px-2 py-0.5`}>
                          <CatIcon className="w-3 h-3 mr-1" />
                          {t(`quiz.cat.${currentQuestion.category}`)}
                        </Badge>
                      );
                    })()}
                    <span className={`text-[10px] font-bold uppercase ${difficultyColors[currentQuestion.difficulty]}`}>
                      {currentQuestion.difficulty === 'easy' ? t('quiz.easy') : currentQuestion.difficulty === 'medium' ? t('quiz.medium') : t('quiz.hard')}
                    </span>
                    <span className="text-[10px] text-muted-foreground">+{currentQuestion.points} {t('quiz.points')}</span>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-muted-foreground'}`}>
                    <Clock className="w-3.5 h-3.5" />
                    {timeLeft}s
                  </div>
                </div>

                {/* Question */}
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0A1330] to-[#162D5A] text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-lg">
                    {currentQ + 1}
                  </span>
                  <div>
                    <p className="text-foreground text-sm sm:text-base font-semibold leading-relaxed">
                      {currentQuestion.questionHi}
                    </p>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-2.5">
                  {currentQuestion.options.map((option, idx) => {
                    const isCorrect = option.value === currentQuestion.correctAnswer;
                    const isSelected = selectedAnswer === option.value;
                    let optionStyle = 'border-slate-200 bg-slate-50 text-foreground dark:border-white/10 dark:bg-white/5 dark:text-slate-200 hover:border-[#C98A1C]/40 hover:bg-[#C98A1C]/5 dark:hover:bg-white/10';

                    if (isAnswered) {
                      if (isCorrect) {
                        optionStyle = 'border-emerald-400 bg-emerald-50 text-emerald-800 dark:border-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300 ring-2 ring-emerald-400/30';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'border-red-400 bg-red-50 text-red-800 dark:border-red-600 dark:bg-red-950/40 dark:text-red-300 ring-2 ring-red-400/30';
                      } else {
                        optionStyle = 'border-slate-200 bg-slate-50/50 text-slate-400 dark:border-white/5 dark:bg-white/[0.02] dark:text-slate-500';
                      }
                    }

                    return (
                      <motion.button
                        key={option.value}
                        whileHover={!isAnswered ? { scale: 1.01 } : undefined}
                        whileTap={!isAnswered ? { scale: 0.99 } : undefined}
                        onClick={() => handleAnswer(option.value)}
                        disabled={isAnswered}
                        className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all duration-200 min-h-[48px] flex items-center gap-3 ${optionStyle}`}
                      >
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isAnswered && isCorrect ? 'bg-emerald-500 text-white' :
                          isAnswered && isSelected && !isCorrect ? 'bg-red-500 text-white' :
                          'bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20'
                        }`}>
                          {isAnswered && isCorrect ? <CheckCircle2 className="w-4 h-4" /> :
                           isAnswered && isSelected && !isCorrect ? <XCircle className="w-4 h-4" /> :
                           String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-sm font-medium">{option.labelHi}</span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={`p-4 rounded-2xl ${
                        selectedAnswer === currentQuestion.correctAnswer
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40'
                          : 'bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40'
                      }`}>
                        <div className="flex items-start gap-2">
                          {selectedAnswer === currentQuestion.correctAnswer ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p className="text-sm font-semibold text-foreground mb-1">
                              {selectedAnswer === currentQuestion.correctAnswer ? t('quiz.correct') : timeLeft <= 0 ? t('quiz.timesUp') : t('quiz.wrong')}
                            </p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {currentQuestion.explanationHi}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Next Button */}
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-end"
                  >
                    <Button
                      onClick={nextQuestion}
                      className="bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-[#0A1330] rounded-full gap-2 shadow-lg shadow-[#C98A1C]/25 hover:from-[#E0A830] hover:to-[#C98A1C]"
                    >
                      {currentQ < quizQuestions.length - 1 ? t('quiz.nextQuestion') : t('quiz.viewResult')}
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* ── RESULT SCREEN ────────────────────────────────────────── */
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-full overflow-hidden"
          >
            <Card className="bg-white/80 dark:bg-white/5 border-slate-200/60 dark:border-white/10 shadow-sm backdrop-blur-sm lg:backdrop-blur-xl rounded-3xl overflow-hidden max-w-full">
              <CardContent className="pt-6 pb-6 space-y-5 max-h-[85vh] overflow-y-auto scrollbar-thin break-words">
                {/* Mode/Category Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center"
                >
                  <Badge className="bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border-0 text-xs font-semibold px-3 py-1">
                    {getModeLabel(quizMode, selectedCategory ?? undefined)}
                  </Badge>
                </motion.div>

                {/* Badge Achieved */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="text-center"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full ${badge.bgColor} mb-3`}>
                    <BadgeIcon className={`w-10 h-10 ${badge.color}`} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-foreground break-words">{t(badge.nameEmojiKey)}</h3>
                  <p className="text-xs text-muted-foreground mt-1 break-words">{t('quiz.yourTitle')}</p>
                </motion.div>

                {/* Score Circle */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-amber-400/30 relative overflow-hidden">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(correctCount / quizQuestions.length) * 100}%` }}
                      transition={{ delay: 0.6, duration: 1 }}
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-400/20 to-transparent"
                    />
                    <div className="relative z-10">
                      <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground">{score}</p>
                      <p className="text-[10px] text-muted-foreground">{t('quiz.points')}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="grid grid-cols-3 gap-3"
                >
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 text-center overflow-hidden">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                    <p className="text-base sm:text-lg font-bold text-foreground">{correctCount}/{quizQuestions.length}</p>
                    <p className="text-[10px] text-muted-foreground">{t('quiz.correctLabel')}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/20 text-center overflow-hidden">
                    <Flame className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                    <p className="text-base sm:text-lg font-bold text-foreground">{maxStreak}</p>
                    <p className="text-[10px] text-muted-foreground">{t('quiz.maxStreak')}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#C98A1C]/5 dark:bg-[#C98A1C]/10 text-center overflow-hidden">
                    <Star className="w-5 h-5 text-[#C98A1C] mx-auto mb-1" />
                    <p className="text-base sm:text-lg font-bold text-foreground">{score}</p>
                    <p className="text-[10px] text-muted-foreground">{t('quiz.pointsLabel')}</p>
                  </div>
                </motion.div>

                {/* Progress to Next Badge */}
                {nextBadge && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <div className="flex items-center justify-between text-xs text-muted-foreground gap-2">
                      <span className="truncate">Next: {t(nextBadge.nameEmojiKey)}</span>
                      <span className="shrink-0">{pointsToNext} {t('quiz.nextBadge')}</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#0A1330] to-[#C98A1C] rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((score / nextBadge.minScore) * 100, 100)}%` }}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Question-wise Breakdown */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="space-y-2 max-h-40 overflow-y-auto"
                >
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('quiz.breakdown')}</p>
                  {quizQuestions.map((q, i) => (
                    <div key={q.id} className="flex items-center gap-2 text-xs">
                      {answeredQuestions[i] ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      )}
                      <span className={`font-medium ${answeredQuestions[i] ? 'text-foreground' : 'text-muted-foreground'}`}>
                        Q{i + 1}:
                      </span>
                      <span className="text-muted-foreground truncate flex-1">
                        {q.questionHi.length > 50 ? q.questionHi.slice(0, 50) + '...' : q.questionHi}
                      </span>
                      <span className={`font-bold ${answeredQuestions[i] ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                        +{answeredQuestions[i] ? q.points : 0}
                      </span>
                    </div>
                  ))}
                </motion.div>

                {/* ── Special Offers Section ─────────────────────────────── */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="space-y-3 pt-2"
                >
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-amber-500" />
                    <h4 className="text-sm font-bold text-foreground">
                      {t('quiz.offersTitle')}
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* Health Insurance Offer */}
                    <a
                      href="https://wa.me/919257877312?text=Hi!%20I%20want%20to%20know%20about%20Health%20Insurance%20from%20%E2%82%B9399%2Fmo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block p-3 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 border border-amber-200 dark:border-amber-800/40 hover:shadow-md hover:shadow-amber-200/30 dark:hover:shadow-amber-900/30 transition-all"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shrink-0">
                          <Heart className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">{t('quiz.cat.health')}</p>
                          <p className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">{t('quiz.healthFrom')}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground">{t('quiz.healthBenefit')}</span>
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
                          {t('quiz.getQuote')} <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </a>

                    {/* Term Insurance Offer */}
                    <a
                      href="https://wa.me/919257877312?text=Hi!%20I%20want%20to%20know%20about%20Term%20Insurance%20%E2%82%B91Cr%20from%20%E2%82%B9489%2Fmo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block p-3 rounded-2xl bg-gradient-to-br from-[#C98A1C]/5 to-[#C98A1C]/10 dark:from-[#C98A1C]/10 dark:to-[#C98A1C]/5 border border-[#C98A1C]/20 dark:border-[#C98A1C]/30 hover:shadow-md hover:shadow-[#C98A1C]/10 dark:hover:shadow-[#C98A1C]/20 transition-all"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0A1330] to-[#162D5A] flex items-center justify-center shrink-0">
                          <Shield className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">{t('quiz.cat.life')}</p>
                          <p className="text-[10px] font-semibold text-[#C98A1C] dark:text-[#C98A1C]">{t('quiz.termFrom')}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground">{t('quiz.termBenefit')}</span>
                        <span className="text-[10px] font-bold text-[#C98A1C] dark:text-[#C98A1C] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
                          {t('quiz.getQuote')} <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </a>

                    {/* Motor Insurance Offer */}
                    <a
                      href="https://wa.me/919257877312?text=Hi!%20I%20want%20to%20know%20about%20Motor%20Insurance%20from%20%E2%82%B91%2C899%2Fyr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block p-3 rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-teal-950/30 dark:to-teal-900/20 border border-teal-200 dark:border-teal-800/40 hover:shadow-md hover:shadow-teal-200/30 dark:hover:shadow-teal-900/30 transition-all"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-600 to-teal-500 flex items-center justify-center shrink-0">
                          <Car className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">{t('quiz.cat.motor')}</p>
                          <p className="text-[10px] font-semibold text-teal-600 dark:text-teal-400">{t('quiz.motorFrom')}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground">{t('quiz.motorBenefit')}</span>
                        <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
                          {t('quiz.getQuote')} <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </a>
                  </div>

                  {/* Free Expert Consultation CTA */}
                  <a
                    href="https://wa.me/919257877312?text=Hi!%20I%20want%20a%20Free%20Expert%20Consultation%20for%20insurance"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full bg-gradient-to-r from-[#C98A1C] via-[#E0A830] to-[#C98A1C] hover:from-[#E0A830] hover:via-[#E0A830] hover:to-[#E0A830] text-[#0A1330] rounded-2xl gap-2 shadow-lg shadow-[#C98A1C]/25 h-11 text-sm font-bold">
                      <MessageCircle className="w-4 h-4" />
                      {t('quiz.freeConsultation')}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </a>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-3"
                >
                  <Button
                    onClick={shuffleAndReplay}
                    className="bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-[#0A1330] rounded-full gap-2 w-full sm:w-auto shadow-lg shadow-[#C98A1C]/25 hover:from-[#E0A830] hover:to-[#C98A1C]"
                  >
                    <Dices className="w-4 h-4" />
                    {t('quiz.shufflePlay')}
                  </Button>
                  <Button
                    onClick={changeMode}
                    variant="outline"
                    className="border-border text-foreground dark:border-white/20 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full gap-2 w-full sm:w-auto"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t('quiz.modeChange')}
                  </Button>
                  <Button
                    onClick={resetQuiz}
                    variant="outline"
                    className="border-border text-foreground dark:border-white/20 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full gap-2 w-full sm:w-auto"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {t('quiz.playAgain')}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
