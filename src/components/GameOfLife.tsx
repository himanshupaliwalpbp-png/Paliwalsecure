'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  ChevronRight,
  RotateCcw,
  TrendingDown,
  TrendingUp,
  Shield,
  Heart,
  AlertTriangle,
  PiggyBank,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { gameOfLifeScenarios, formatCurrency } from '@/lib/insurance-data';

// ── Animated Counter Hook ──────────────────────────────────────────────────
function useAnimatedCounter(target: number, duration = 800) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Cancel any running animation
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (target === 0) {
      return;
    }

    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        rafRef.current = null;
      }
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [target, duration]);

  return count;
}

// ── Scenario Icon Mapper ───────────────────────────────────────────────────
function getScenarioIcon(index: number) {
  const icons = [Heart, AlertTriangle, Shield, Heart, TrendingDown, AlertTriangle, Heart, Shield];
  return icons[index % icons.length];
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function GameOfLife() {
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1); // -1 = not started
  const [isFinished, setIsFinished] = useState(false);

  // Running totals
  const totalWithoutInsurance = gameOfLifeScenarios
    .slice(0, currentStep + 1)
    .reduce((sum, s) => sum + s.costWithoutInsurance, 0);
  const totalWithInsurance = gameOfLifeScenarios
    .slice(0, currentStep + 1)
    .reduce((sum, s) => sum + s.costWithInsurance, 0);
  const totalSavings = totalWithoutInsurance - totalWithInsurance;

  // Grand totals for final screen
  const grandTotalWithout = gameOfLifeScenarios.reduce(
    (sum, s) => sum + s.costWithoutInsurance,
    0
  );
  const grandTotalWith = gameOfLifeScenarios.reduce(
    (sum, s) => sum + s.costWithInsurance,
    0
  );
  const grandTotalSavings = grandTotalWithout - grandTotalWith;
  const savingsPercentage = ((grandTotalSavings / grandTotalWithout) * 100).toFixed(1);

  // Animated counters
  const animatedWithout = useAnimatedCounter(totalWithoutInsurance);
  const animatedWith = useAnimatedCounter(totalWithInsurance);
  const animatedSavings = useAnimatedCounter(totalSavings);

  // Progress
  const ageProgress =
    currentStep >= 0
      ? ((gameOfLifeScenarios[currentStep].age - 25) / (55 - 25)) * 100
      : 0;

  const handleStart = useCallback(() => {
    setStarted(true);
    setCurrentStep(0);
    setIsFinished(false);
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < gameOfLifeScenarios.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  }, [currentStep]);

  const handleRestart = useCallback(() => {
    setStarted(false);
    setCurrentStep(-1);
    setIsFinished(false);
  }, []);

  const currentScenario = currentStep >= 0 ? gameOfLifeScenarios[currentStep] : null;

  // ── Start Screen ──────────────────────────────────────────────────────────
  if (!started) {
    return (
      <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-red-50 py-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-lg"
        >
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-5 sm:p-8 text-white text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 mb-4"
              >
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </motion.div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Game of Life</h1>
              <p className="text-blue-100 text-sm sm:text-base">
                Walk through 30 years of life events and discover how insurance protects your finances
              </p>
            </div>
            <CardContent className="pt-6 text-center space-y-4">
              <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
                <div className="rounded-lg bg-red-50 p-2 sm:p-3">
                  <p className="text-[10px] sm:text-xs text-red-600 font-medium">Without Insurance</p>
                  <p className="text-sm sm:text-lg font-bold text-red-700">{formatCurrency(grandTotalWithout)}</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-2 sm:p-3">
                  <p className="text-[10px] sm:text-xs text-blue-600 font-medium">With Insurance</p>
                  <p className="text-sm sm:text-lg font-bold text-blue-700">{formatCurrency(grandTotalWith)}</p>
                </div>
                <div className="rounded-lg bg-amber-50 p-2 sm:p-3">
                  <p className="text-[10px] sm:text-xs text-amber-600 font-medium">You Save</p>
                  <p className="text-sm sm:text-lg font-bold text-amber-700">{formatCurrency(grandTotalSavings)}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Experience 8 real-life scenarios from age 25 to 55 and see the financial impact of being insured vs. uninsured.
              </p>
            </CardContent>
            <CardFooter className="justify-center pb-6">
              <Button
                size="lg"
                onClick={handleStart}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 text-base gap-2"
              >
                <Play className="w-5 h-5" />
                Start Life Journey
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }

  // ── Finished Screen ───────────────────────────────────────────────────────
  if (isFinished) {
    return (
      <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-red-50 py-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-5 sm:p-8 text-white text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 mb-4"
              >
                <PiggyBank className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </motion.div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-1">Journey Complete!</h2>
              <p className="text-blue-100 text-sm sm:text-base">
                30 years of life — here&apos;s your financial report card
              </p>
            </div>
            <CardContent className="pt-6 space-y-5">
              {/* Savings comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-xl bg-red-50 border border-red-200 p-4 text-center"
                >
                  <TrendingDown className="w-6 h-6 text-red-500 mx-auto mb-2" />
                  <p className="text-xs font-medium text-red-600 mb-1">Without Insurance</p>
                  <p className="text-2xl font-bold text-red-700">
                    {formatCurrency(grandTotalWithout)}
                  </p>
                  <p className="text-[11px] text-red-500 mt-1">
                    Out-of-pocket expenses over 30 years
                  </p>
                </motion.div>
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-center"
                >
                  <TrendingUp className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-xs font-medium text-blue-600 mb-1">With Insurance</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {formatCurrency(grandTotalWith)}
                  </p>
                  <p className="text-[11px] text-blue-500 mt-1">
                    Your share with comprehensive coverage
                  </p>
                </motion.div>
              </div>

              {/* Total savings card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 p-5 text-center text-white"
              >
                <PiggyBank className="w-8 h-8 mx-auto mb-2 opacity-90" />
                <p className="text-sm font-medium opacity-90">Total Savings with Insurance</p>
                <p className="text-3xl sm:text-4xl font-bold mt-1">
                  {formatCurrency(grandTotalSavings)}
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  {savingsPercentage}% savings
                </div>
              </motion.div>

              {/* Scenario recap */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  All Scenarios at a Glance
                </h3>
                <div className="max-h-64 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                  {gameOfLifeScenarios.map((s, i) => (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + i * 0.05 }}
                      className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-base">{s.emotion}</span>
                        <span className="truncate font-medium">{s.event}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 text-xs">
                        <span className="text-red-600 line-through">
                          {formatCurrency(s.costWithoutInsurance)}
                        </span>
                        <span className="text-blue-600 font-semibold">
                          {formatCurrency(s.costWithInsurance)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4 pb-6">
              <Button
                size="lg"
                onClick={handleRestart}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2 w-full sm:w-auto"
              >
                <RotateCcw className="w-5 h-5" />
                Play Again
              </Button>
              <p className="text-[11px] text-center text-muted-foreground leading-relaxed max-w-sm">
                For more details on risk factors, terms and conditions, please read the sales
                brochure/policy wording carefully before concluding a sale. Insurance is the subject
                matter of solicitation. | IRDAI Regulated
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }

  // ── Active Scenario Screen ────────────────────────────────────────────────
  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-red-50 py-4">
      <div className="w-full max-w-lg">
        {/* Progress bar section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">
            <span className="font-medium">
              Step {currentStep + 1} of {gameOfLifeScenarios.length}
            </span>
            <span className="font-medium">Age {currentScenario?.age ?? 25}</span>
          </div>
          <Progress value={ageProgress} className="h-2 sm:h-3 bg-blue-100" />
          <div className="flex justify-between mt-1 sm:mt-1.5 text-[10px] text-muted-foreground">
            <span>Age 25</span>
            <span>Age 55</span>
          </div>
        </motion.div>

        {/* Running totals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-3 gap-2 sm:gap-3 mb-4"
        >
          <div className="rounded-lg bg-red-50 border border-red-100 p-2 sm:p-3 text-center">
            <p className="text-[10px] sm:text-xs font-medium text-red-600 mb-0.5">
              Without Insurance
            </p>
            <p className="text-sm sm:text-xl font-bold text-red-700">
              {formatCurrency(animatedWithout)}
            </p>
          </div>
          <div className="rounded-lg bg-blue-50 border border-blue-100 p-2 sm:p-3 text-center">
            <p className="text-[10px] sm:text-xs font-medium text-blue-600 mb-0.5">
              With Insurance
            </p>
            <p className="text-sm sm:text-xl font-bold text-blue-700">
              {formatCurrency(animatedWith)}
            </p>
          </div>
          <div className="rounded-lg bg-amber-50 border border-amber-100 p-2 sm:p-3 text-center">
            <p className="text-[10px] sm:text-xs font-medium text-amber-600 mb-0.5">
              You Save
            </p>
            <p className="text-sm sm:text-xl font-bold text-amber-700">
              {formatCurrency(animatedSavings)}
            </p>
          </div>
        </motion.div>

        {/* Scenario Card */}
        <AnimatePresence mode="wait">
          {currentScenario && (
            <motion.div
              key={currentScenario.id}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <Card className="border-0 shadow-xl overflow-hidden">
                {/* Card header with age badge */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-3 sm:p-6 text-white">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-semibold">
                          Age {currentScenario.age}
                        </span>
                        <span className="text-xl">{currentScenario.emotion}</span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold leading-tight">
                        {currentScenario.title}
                      </h2>
                    </div>
                    {(() => {
                      const Icon = getScenarioIcon(currentStep);
                      return (
                        <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white/80" />
                        </div>
                      );
                    })()}
                  </div>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                    {currentScenario.description}
                  </p>
                </div>

                <CardContent className="pt-5 space-y-4">
                  {/* Event name */}
                  <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-sm font-semibold text-slate-700">
                      Event: {currentScenario.event}
                    </span>
                  </div>

                  {/* Cost comparison */}
                  <div className="space-y-3">
                    {/* Without insurance */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-red-600 flex items-center gap-1">
                          <TrendingDown className="w-3.5 h-3.5" />
                          Without Insurance
                        </span>
                        <span className="text-sm font-bold text-red-700">
                          {formatCurrency(currentScenario.costWithoutInsurance)}
                        </span>
                      </div>
                      <div className="h-3 rounded-full bg-red-100 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.min(
                              (currentScenario.costWithoutInsurance / 1500000) * 100,
                              100
                            )}%`,
                          }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full rounded-full bg-gradient-to-r from-red-400 to-red-500"
                        />
                      </div>
                    </div>

                    {/* With insurance */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-blue-600 flex items-center gap-1">
                          <Shield className="w-3.5 h-3.5" />
                          With Insurance
                        </span>
                        <span className="text-sm font-bold text-blue-700">
                          {formatCurrency(currentScenario.costWithInsurance)}
                        </span>
                      </div>
                      <div className="h-3 rounded-full bg-blue-100 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.min(
                              (currentScenario.costWithInsurance / 1500000) * 100,
                              100
                            )}%`,
                          }}
                          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                          className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Savings callout */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="rounded-lg bg-blue-50 border border-blue-200 p-3 flex items-center gap-3"
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <PiggyBank className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 font-medium">You save on this event</p>
                      <p className="text-lg font-bold text-blue-700">
                        {formatCurrency(
                          currentScenario.costWithoutInsurance - currentScenario.costWithInsurance
                        )}
                      </p>
                    </div>
                  </motion.div>
                </CardContent>

                <CardFooter className="pb-5">
                  <Button
                    size="lg"
                    onClick={handleNext}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
                  >
                    {currentStep < gameOfLifeScenarios.length - 1 ? (
                      <>
                        Next Scenario
                        <ChevronRight className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        See Final Report
                        <TrendingUp className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* IRDAI Disclaimer */}
        <p className="mt-4 text-center text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
          For more details on risk factors, terms and conditions, please read the sales
          brochure/policy wording carefully before concluding a sale. Insurance is the subject matter
          of solicitation. | IRDAI Regulated
        </p>
      </div>
    </div>
  );
}
