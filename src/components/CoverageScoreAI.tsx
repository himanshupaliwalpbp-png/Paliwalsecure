'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Heart,
  Car,
  Umbrella,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Brain,
  TrendingUp,
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageToggle';
import { t } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// ============================================================================
// TYPES
// ============================================================================

interface CoverageScoreAIProps {
  onGetRecommendations: () => void;
  onAskInsureGPT: () => void;
}

interface CategoryData {
  key: string;
  icon: React.ElementType;
  labelEn: string;
  labelHi: string;
  labelHinglish: string;
  score: number;
  gapLabelEn: string;
  gapLabelHi: string;
  gapLabelHinglish: string;
  severity: 'critical' | 'urgent' | 'moderate' | 'low';
  colorFrom: string;
  colorTo: string;
  ringColor: string;
  ringBg: string;
  iconBg: string;
  iconColor: string;
  descriptionEn: string;
  descriptionHi: string;
  descriptionHinglish: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const CATEGORIES: CategoryData[] = [
  {
    key: 'health',
    icon: Heart,
    labelEn: 'Health Insurance',
    labelHi: 'स्वास्थ्य बीमा',
    labelHinglish: 'Health Insurance (Swasthya Bima)',
    score: 42,
    gapLabelEn: 'High Gap — Critical',
    gapLabelHi: 'उच्च अंतर — गंभीर',
    gapLabelHinglish: 'Zyada Gap — Bahut Zaroori',
    severity: 'critical',
    colorFrom: 'from-rose-500',
    colorTo: 'to-red-500',
    ringColor: '#f43f5e',
    ringBg: 'rgba(244, 63, 94, 0.12)',
    iconBg: 'bg-rose-100 dark:bg-rose-950/40',
    iconColor: 'text-rose-600 dark:text-rose-400',
    descriptionEn: 'Your health cover is dangerously low. Medical inflation makes this a top priority.',
    descriptionHi: 'आपका स्वास्थ्य कवर खतरनाक रूप से कम है। मेडिकल महंगाई इसे प्राथमिकता बनाती है।',
    descriptionHinglish: 'Aapka health cover bahut kam hai. Medical inflation ise top priority bana deta hai — abhi sudharein!',
  },
  {
    key: 'life',
    icon: Shield,
    labelEn: 'Life/Term Insurance',
    labelHi: 'जीवन/टर्म बीमा',
    labelHinglish: 'Life/Term Insurance (Jeevan Bima)',
    score: 28,
    gapLabelEn: 'High Gap — Urgent',
    gapLabelHi: 'उच्च अंतर — तत्काल',
    gapLabelHinglish: 'Zyada Gap — Turant Karo',
    severity: 'urgent',
    colorFrom: 'from-emerald-500',
    colorTo: 'to-green-600',
    ringColor: '#10b981',
    ringBg: 'rgba(16, 185, 129, 0.12)',
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/40',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    descriptionEn: 'Life cover is severely insufficient. Your family could face financial hardship.',
    descriptionHi: 'जीवन बीमा गंभीर रूप से अपर्याप्त है। आपके परिवार को वित्तीय कठिनाई हो सकती है।',
    descriptionHinglish: 'Life cover bahut kam hai. Aapki family financial hardship face kar sakti hai — turant badhayein!',
  },
  {
    key: 'motor',
    icon: Car,
    labelEn: 'Motor Insurance',
    labelHi: 'मोटर बीमा',
    labelHinglish: 'Motor Insurance (Gadi Bima)',
    score: 65,
    gapLabelEn: 'Moderate Gap',
    gapLabelHi: 'मध्यम अंतर',
    gapLabelHinglish: 'Thoda Gap Hai',
    severity: 'moderate',
    colorFrom: 'from-amber-400',
    colorTo: 'to-orange-500',
    ringColor: '#f59e0b',
    ringBg: 'rgba(245, 158, 11, 0.12)',
    iconBg: 'bg-amber-100 dark:bg-amber-950/40',
    iconColor: 'text-amber-600 dark:text-amber-400',
    descriptionEn: 'Motor coverage is decent but has gaps. Add-ons like zero depreciation recommended.',
    descriptionHi: 'मोटर कवर ठीक है लेकिन कुछ कमियाँ हैं। ज़ीरो डेप्रिसिएशन ऐड-ऑन सुझावित।',
    descriptionHinglish: 'Motor coverage theek hai par gaps hain. Zero depreciation jaise add-ons zaroori hain.',
  },
  {
    key: 'other',
    icon: Umbrella,
    labelEn: 'Other Insurance',
    labelHi: 'अन्य बीमा',
    labelHinglish: 'Other Insurance (Anya Bima)',
    score: 78,
    gapLabelEn: 'Low Gap',
    gapLabelHi: 'कम अंतर',
    gapLabelHinglish: 'Kam Gap — Achha Hai',
    severity: 'low',
    colorFrom: 'from-violet-500',
    colorTo: 'to-purple-600',
    ringColor: '#C98A1C',
    ringBg: 'rgba(139, 92, 246, 0.12)',
    iconBg: 'bg-violet-100 dark:bg-violet-950/40',
    iconColor: 'text-violet-600 dark:text-violet-400',
    descriptionEn: 'Your other insurance portfolio is relatively strong. Keep optimizing!',
    descriptionHi: 'आपका अन्य बीमा पोर्टफोलियो अपेक्षाकृत मजबूत है। बनाए रखें!',
    descriptionHinglish: 'Other insurance portfolio kaafi strong hai. Optimize karte rahein!',
  },
];

const ANALYSIS_DURATION = 2000; // 2 seconds simulated loading

// ============================================================================
// HELPERS
// ============================================================================

function getScoreColor(score: number): string {
  if (score >= 80) return '#10b981'; // emerald
  if (score >= 50) return '#f59e0b'; // amber
  return '#ef4444'; // red
}

function getScoreLabel(score: number, lang: string): string {
  if (score >= 80) {
    if (lang === 'hi') return 'कम अंतर';
    if (lang === 'hinglish') return 'Kam Gap — Achha Hai';
    return 'Low Gap';
  }
  if (score >= 50) {
    if (lang === 'hi') return 'मध्यम अंतर';
    if (lang === 'hinglish') return 'Thoda Gap Hai';
    return 'Moderate Gap';
  }
  if (score >= 30) {
    if (lang === 'hi') return 'उच्च अंतर — तत्काल';
    if (lang === 'hinglish') return 'Zyada Gap — Turant Karo';
    return 'High Gap — Urgent';
  }
  if (lang === 'hi') return 'उच्च अंतर — गंभीर';
  if (lang === 'hinglish') return 'Zyada Gap — Bahut Zaroori';
  return 'High Gap — Critical';
}

function getSeverityBadgeClasses(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800';
    case 'urgent':
      return 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
    case 'moderate':
      return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
    case 'low':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
    default:
      return '';
  }
}

function getOverallScoreLevel(avg: number, lang: string): { label: string; color: string } {
  if (avg >= 80) {
    return {
      label: lang === 'hi' ? 'उत्कृष्ट' : lang === 'hinglish' ? 'Utkrisht' : 'Excellent',
      color: 'text-emerald-500',
    };
  }
  if (avg >= 50) {
    return {
      label: lang === 'hi' ? 'औसत' : lang === 'hinglish' ? 'Theek Hai' : 'Average',
      color: 'text-amber-500',
    };
  }
  return {
    label: lang === 'hi' ? 'कमज़ोर' : lang === 'hinglish' ? 'Kamzor' : 'Weak',
    color: 'text-red-500',
  };
}

// ============================================================================
// CIRCULAR PROGRESS RING COMPONENT
// ============================================================================

function CircularProgressRing({
  score,
  color,
  size = 100,
  strokeWidth = 8,
  animate = false,
  delay = 0,
}: {
  score: number;
  color: string;
  size?: number;
  strokeWidth?: number;
  animate?: boolean;
  delay?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const center = size / 2;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        {/* Foreground ring */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={animate ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
          transition={{
            duration: 1.2,
            delay: delay + 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      </svg>
    </div>
  );
}

// ============================================================================
// COUNT-UP HOOK
// ============================================================================

function useCountUp(target: number, isActive: boolean, delay: number, duration: number = 1000) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const delayTimer = setTimeout(() => {
      const start = performance.now();

      const step = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setAnimatedValue(Math.round(eased * target));

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    }, delay);

    return () => clearTimeout(delayTimer);
  }, [target, isActive, delay, duration]);

  // When not active, display 0; when active, show animated value
  return isActive ? animatedValue : 0;
}

// ============================================================================
// SCORE CARD COMPONENT
// ============================================================================

function ScoreCard({
  category,
  index,
  isRevealed,
  lang,
}: {
  category: CategoryData;
  index: number;
  isRevealed: boolean;
  lang: string;
}) {
  const Icon = category.icon;
  const countValue = useCountUp(category.score, isRevealed, index * 200 + 400);
  const scoreColor = getScoreColor(category.score);

  const label =
    lang === 'hi'
      ? category.labelHi
      : lang === 'hinglish'
        ? category.labelHinglish
        : category.labelEn;

  const description =
    lang === 'hi'
      ? category.descriptionHi
      : lang === 'hinglish'
        ? category.descriptionHinglish
        : category.descriptionEn;

  const gapLabel = getScoreLabel(category.score, lang);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.5,
        delay: index * 0.12,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="h-full"
    >
      <Card className="glass-card rounded-2xl border-0 shadow-lg h-full overflow-hidden cursor-default">
        <CardContent className="p-4 sm:p-5 flex flex-col items-center text-center gap-3">
          {/* Icon + Label */}
          <div className="flex items-center gap-2 w-full">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${category.iconBg} flex items-center justify-center shrink-0`}
            >
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${category.iconColor}`} />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-foreground truncate">{label}</h3>
          </div>

          {/* Circular Progress Ring + Score */}
          <div className="relative flex items-center justify-center">
            <CircularProgressRing
              score={category.score}
              color={scoreColor}
              size={90}
              strokeWidth={7}
              animate={isRevealed}
              delay={index * 0.15}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className="text-2xl sm:text-3xl font-extrabold tabular-nums"
                style={{ color: scoreColor }}
              >
                {isRevealed ? countValue : 0}
              </motion.span>
              <span className="text-[10px] text-muted-foreground font-medium">/100</span>
            </div>
          </div>

          {/* Gap Label Badge */}
          <Badge
            className={`text-[11px] font-semibold px-2.5 py-0.5 border ${getSeverityBadgeClasses(category.severity)}`}
          >
            {category.severity === 'critical' || category.severity === 'urgent' ? (
              <AlertTriangle className="w-3 h-3 mr-1" />
            ) : category.severity === 'moderate' ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <CheckCircle2 className="w-3 h-3 mr-1" />
            )}
            {gapLabel}
          </Badge>

          {/* Description */}
          <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-3">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CoverageScoreAI({ onGetRecommendations, onAskInsureGPT }: CoverageScoreAIProps) {
  const { language } = useLanguage();
  const [phase, setPhase] = useState<'idle' | 'analyzing' | 'revealed'>('idle');
  const [loadingDots, setLoadingDots] = useState(1);

  // Overall score
  const overallScore = Math.round(
    CATEGORIES.reduce((sum, c) => sum + c.score, 0) / CATEGORIES.length
  );
  const overallCount = useCountUp(overallScore, phase === 'revealed', 200);
  const overallLevel = getOverallScoreLevel(overallScore, language);

  // Loading dots animation
  useEffect(() => {
    if (phase !== 'analyzing') return;

    const interval = setInterval(() => {
      setLoadingDots((prev) => (prev % 3) + 1);
    }, 400);

    return () => clearInterval(interval);
  }, [phase]);

  // Handle Analyze Now click
  const handleAnalyze = useCallback(() => {
    if (phase !== 'idle') return;
    setPhase('analyzing');
    setLoadingDots(1);

    setTimeout(() => {
      setPhase('revealed');
    }, ANALYSIS_DURATION);
  }, [phase]);

  // Localized strings
  const sectionTitle =
    language === 'hi'
      ? 'कवरेज स्कोर AI विश्लेषण'
      : language === 'hinglish'
        ? 'Coverage Score AI Analysis'
        : 'Coverage Score AI Analysis';
  const sectionSubtitle =
    language === 'hi'
      ? 'आपका बीमा कवरेज कितना मजबूत है? AI से जानिए!'
      : language === 'hinglish'
        ? 'Aapka insurance coverage kitna strong hai? AI se jaaniye!'
        : 'How strong is your insurance coverage? Let AI analyze it for you!';

  const analyzeButtonText =
    language === 'hi'
      ? 'AI से विश्लेषण करें'
      : language === 'hinglish'
        ? 'Analyze Now — AI se Jaaniye'
        : 'Analyze Now';

  const analyzingText =
    language === 'hi'
      ? 'AI विश्लेषण कर रहा है'
      : language === 'hinglish'
        ? 'AI analyze kar raha hai'
        : 'AI is analyzing';

  const overallLabel =
    language === 'hi'
      ? 'कुल कवरेज स्कोर'
      : language === 'hinglish'
        ? 'Overall Coverage Score'
        : 'Overall Coverage Score';

  const recButtonLabel =
    language === 'hi'
      ? 'व्यक्तिगत सिफारिशें प्राप्त करें'
      : language === 'hinglish'
        ? 'Get Personalized Recommendations'
        : 'Get Personalized Recommendations';

  const askGPTLabel =
    language === 'hi'
      ? 'InsureGPT से पूछें'
      : language === 'hinglish'
        ? 'InsureGPT se Poochiye'
        : 'Ask InsureGPT';

  const disclaimerText =
    language === 'hi'
      ? 'यह AI-आधारित विश्लेषण अनुमानित है। विस्तृत सलाह के लिए विशेषज्ञ से बात करें।'
      : language === 'hinglish'
        ? 'Yeh AI-based analysis estimated hai. Detailed advice ke liye expert se baat karein.'
        : 'This AI-based analysis is estimated. Consult an expert for detailed advice.';

  return (
    <section className="w-full">
      <div className="space-y-6 sm:space-y-8">
        {/* ─── Header ──────────────────────────────────────────────── */}
        <div className="text-center space-y-3">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-2"
          >
            <Badge className="badge-shimmer bg-gradient-to-r from-[#C98A1C] to-[#0A1330] text-white border-0 text-xs font-semibold px-3 py-1">
              <Brain className="w-3.5 h-3.5 mr-1" />
              AI Analysis
            </Badge>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold gradient-text"
          >
            {sectionTitle}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto"
          >
            {sectionSubtitle}
          </motion.p>
        </div>

        {/* ─── Idle State: Analyze Now CTA ─────────────────────────── */}
        <AnimatePresence mode="wait">
          {phase === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-6 py-8 sm:py-12"
            >
              {/* Decorative shield */}
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-[#C98A1C]/10 to-[#0A1330]/10 flex items-center justify-center">
                  <Shield className="w-12 h-12 sm:w-14 sm:h-14 text-[#C98A1C]/60" />
                </div>
                <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <Brain className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

              <div className="text-center space-y-2 max-w-md">
                <p className="text-sm text-muted-foreground">
                  {language === 'hi'
                    ? 'AI आपके बीमा पोर्टफोलियो को 4 श्रेणियों में विश्लेषण करेगा और कवरेज अंतर दिखाएगा।'
                    : language === 'hinglish'
                      ? 'AI aapke insurance portfolio ko 4 categories mein analyze karega aur coverage gaps dikhayega.'
                      : 'AI will analyze your insurance portfolio across 4 categories and reveal coverage gaps.'}
                </p>
              </div>

              <Button
                onClick={handleAnalyze}
                className="bg-gradient-to-r from-[#C98A1C] via-[#0A1330] to-[#0F1C40] hover:from-[#0A1330] hover:via-[#0F1C40] hover:to-[#0F1C40] text-white rounded-xl h-12 sm:h-13 px-6 sm:px-8 text-base font-semibold gap-2 shadow-lg shadow-[#C98A1C]/20 hover:shadow-[#C98A1C]/30 transition-all duration-300"
              >
                <Brain className="w-5 h-5" />
                {analyzeButtonText}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {/* ─── Analyzing State: Loading Animation ────────────────── */}
          {phase === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-6 py-8 sm:py-12"
            >
              {/* Pulsing brain */}
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 flex items-center justify-center">
                  <Brain className="w-12 h-12 sm:w-14 sm:h-14 text-teal-500" />
                </div>
                {/* Pulse ring */}
                <motion.div
                  className="absolute inset-0 rounded-3xl border-2 border-teal-500/40"
                  animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                />
              </motion.div>

              <div className="text-center space-y-2">
                <p className="text-base sm:text-lg font-semibold text-foreground">
                  {analyzingText}
                  {'.'.repeat(loadingDots)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'hi'
                    ? 'कृपया प्रतीक्षा करें, AI आपका डेटा स्कैन कर रहा है...'
                    : language === 'hinglish'
                      ? 'Please wait, AI aapka data scan kar raha hai...'
                      : 'Please wait, AI is scanning your data...'}
                </p>
              </div>

              {/* Animated progress bar */}
              <div className="w-64 sm:w-80 h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: ANALYSIS_DURATION / 1000, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          )}

          {/* ─── Revealed State: Score Cards + Overall ─────────────── */}
          {phase === 'revealed' && (
            <motion.div
              key="revealed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6 sm:space-y-8"
            >
              {/* Overall Score Display */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col items-center text-center gap-2"
              >
                <div className="relative flex items-center justify-center">
                  <CircularProgressRing
                    score={overallScore}
                    color={getScoreColor(overallScore)}
                    size={140}
                    strokeWidth={10}
                    animate={true}
                    delay={0}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      className="text-4xl sm:text-5xl font-extrabold tabular-nums"
                      style={{ color: getScoreColor(overallScore) }}
                    >
                      {overallCount}
                    </motion.span>
                    <span className="text-xs text-muted-foreground font-medium">/100</span>
                  </div>
                </div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  {overallLabel}
                </p>
                <p className={`text-lg font-bold ${overallLevel.color}`}>{overallLevel.label}</p>
              </motion.div>

              {/* Category Score Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CATEGORIES.map((category, idx) => (
                  <ScoreCard
                    key={category.key}
                    category={category}
                    index={idx}
                    isRevealed={phase === 'revealed'}
                    lang={language}
                  />
                ))}
              </div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
              >
                <Button
                  onClick={onGetRecommendations}
                  className="bg-gradient-to-r from-[#C98A1C] to-[#0A1330] hover:from-[#0A1330] hover:to-[#0F1C40] text-white rounded-xl h-12 px-6 sm:px-8 text-base font-semibold gap-2 shadow-lg shadow-[#C98A1C]/20 w-full sm:w-auto"
                >
                  <TrendingUp className="w-4 h-4" />
                  {recButtonLabel}
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  onClick={onAskInsureGPT}
                  variant="outline"
                  className="rounded-xl h-12 px-6 sm:px-8 text-base font-semibold gap-2 border-[#C98A1C]/40 text-[#C98A1C] dark:text-[#C98A1C] hover:bg-[#C98A1C]/10 dark:hover:bg-[#C98A1C]/20 w-full sm:w-auto"
                >
                  <Brain className="w-4 h-4" />
                  {askGPTLabel}
                </Button>
              </motion.div>

              {/* Disclaimer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="text-[10px] text-muted-foreground text-center flex items-start justify-center gap-1.5 max-w-lg mx-auto"
              >
                <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                {disclaimerText}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
