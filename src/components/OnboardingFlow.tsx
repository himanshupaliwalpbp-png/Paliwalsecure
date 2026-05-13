'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Wallet,
  HeartPulse,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import {
  onboardingQuestions,
  type OnboardingQuestion,
  type UserProfile,
} from '@/lib/insurance-data';

// ============================================================================
// Types & Constants
// ============================================================================

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void;
  onSkip: () => void;
}

type FormValues = Record<string, string | string[]>;

interface StepConfig {
  category: string;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  questions: OnboardingQuestion[];
}

const DEPENDENTS_MAP: Record<string, number> = {
  '0': 0,
  '1-2': 2,
  '3-4': 4,
  '5+': 5,
};

const STEP_CONFIGS: Omit<StepConfig, 'questions'>[] = [
  {
    category: 'personal',
    label: 'Personal Details',
    icon: User,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  {
    category: 'financial',
    label: 'Financial Info',
    icon: Wallet,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  {
    category: 'health',
    label: 'Health & Lifestyle',
    icon: HeartPulse,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
  },
  {
    category: 'preference',
    label: 'Your Preferences',
    icon: SlidersHorizontal,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
  },
];

// ============================================================================
// Confetti Particle Component
// ============================================================================

function ConfettiParticle({ delay, x, color }: { delay: number; x: number; color: string }) {
  return (
    <motion.div
      className="absolute top-0 w-2 h-2 rounded-full"
      style={{ left: `${x}%`, backgroundColor: color }}
      initial={{ y: -10, opacity: 1, scale: 0 }}
      animate={{
        y: ['0vh', '100vh'],
        opacity: [1, 1, 0],
        scale: [0, 1, 0.5],
        rotate: [0, 360, 720],
      }}
      transition={{
        duration: 3,
        delay,
        ease: 'easeOut',
      }}
    />
  );
}

function ConfettiAnimation() {
  const colors = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];
  const particles = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <ConfettiParticle key={p.id} delay={p.delay} x={p.x} color={p.color} />
      ))}
    </div>
  );
}

// ============================================================================
// Animated Checkmark
// ============================================================================

function AnimatedCheckmark() {
  return (
    <div className="relative w-24 h-24 mx-auto">
      <motion.div
        className="absolute inset-0 rounded-full bg-emerald-100"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      />
      <motion.div
        className="absolute inset-2 rounded-full bg-emerald-500 flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
      >
        <motion.svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            d="M5 13l4 4L19 7"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
          />
        </motion.svg>
      </motion.div>
    </div>
  );
}

// ============================================================================
// Question Renderer Components
// ============================================================================

function NumberQuestion({
  question,
  value,
  onChange,
}: {
  question: OnboardingQuestion;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="space-y-3">
      <Input
        type="number"
        placeholder={question.placeholder || 'Enter value'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 text-lg px-4"
        min={question.id === 'age' ? 18 : undefined}
        max={question.id === 'age' ? 100 : undefined}
      />
    </div>
  );
}

function TextQuestion({
  question,
  value,
  onChange,
}: {
  question: OnboardingQuestion;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="space-y-3">
      <Input
        type="text"
        placeholder={question.placeholder || 'Enter value'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 text-lg px-4"
        maxLength={question.id === 'pincode' ? 6 : undefined}
      />
    </div>
  );
}

function SelectQuestion({
  question,
  value,
  onChange,
  accentColor,
}: {
  question: OnboardingQuestion;
  value: string;
  onChange: (val: string) => void;
  accentColor: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {question.options?.map((option) => {
        const isSelected = value === option.value;
        return (
          <motion.button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              relative p-4 rounded-xl border-2 text-left transition-all duration-200
              min-h-[56px] flex items-center
              ${
                isSelected
                  ? `border-emerald-500 bg-emerald-50 shadow-md ring-1 ring-emerald-200`
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3 w-full">
              <div
                className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                  ${isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'}
                `}
              >
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </div>
              <span
                className={`text-sm font-medium ${
                  isSelected ? 'text-emerald-700' : 'text-gray-700'
                }`}
              >
                {option.label}
              </span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

function MultiSelectQuestion({
  question,
  values,
  onChange,
}: {
  question: OnboardingQuestion;
  values: string[];
  onChange: (vals: string[]) => void;
}) {
  const handleToggle = useCallback(
    (optionValue: string) => {
      // "None" option deselects everything else
      if (optionValue === 'none') {
        onChange(['none']);
        return;
      }
      // Deselect "none" if any other is chosen
      let newValues = values.filter((v) => v !== 'none');
      if (newValues.includes(optionValue)) {
        newValues = newValues.filter((v) => v !== optionValue);
      } else {
        newValues = [...newValues, optionValue];
      }
      onChange(newValues.length === 0 ? [] : newValues);
    },
    [values, onChange]
  );

  return (
    <div className="flex flex-wrap gap-3">
      {question.options?.map((option) => {
        const isSelected = values.includes(option.value);
        return (
          <motion.button
            key={option.value}
            type="button"
            onClick={() => handleToggle(option.value)}
            className="focus:outline-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge
              className={`
                px-4 py-2.5 text-sm font-medium cursor-pointer transition-all duration-200 border-2
                ${
                  isSelected
                    ? 'bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600 shadow-md'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                }
              `}
              variant="outline"
            >
              {isSelected && <Check className="w-3.5 h-3.5 mr-1.5 inline" />}
              {option.label}
            </Badge>
          </motion.button>
        );
      })}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormValues>({});
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [isComplete, setIsComplete] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Group questions by category into steps
  const steps: StepConfig[] = useMemo(() => {
    return STEP_CONFIGS.map((config) => ({
      ...config,
      questions: onboardingQuestions.filter((q) => q.category === config.category),
    }));
  }, []);

  const totalSteps = steps.length;
  const currentStepData = steps[currentStep];
  const progressPercent = ((currentStep + (isComplete ? 1 : 0)) / totalSteps) * 100;

  // Get form value for a question
  const getValue = useCallback(
    (questionId: string): string => {
      const val = formData[questionId];
      return typeof val === 'string' ? val : '';
    },
    [formData]
  );

  const getMultiValue = useCallback(
    (questionId: string): string[] => {
      const val = formData[questionId];
      return Array.isArray(val) ? val : [];
    },
    [formData]
  );

  // Update form value
  const setValue = useCallback((questionId: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [questionId]: value }));
    setValidationError(null);
  }, []);

  // Validate current step
  const validateCurrentStep = useCallback((): boolean => {
    if (!currentStepData) return false;
    for (const question of currentStepData.questions) {
      if (question.required) {
        const val = formData[question.id];
        if (!val || (typeof val === 'string' && val.trim() === '') || (Array.isArray(val) && val.length === 0)) {
          setValidationError('Please fill in all required fields to continue.');
          return false;
        }
      }
    }
    setValidationError(null);
    return true;
  }, [currentStepData, formData]);

  // Navigate to next step
  const handleNext = useCallback(() => {
    if (!validateCurrentStep()) return;
    if (currentStep < totalSteps - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    } else {
      // Complete the onboarding
      setIsComplete(true);
      const profile = buildUserProfile(formData);
      // Delay callback to show completion screen
      setTimeout(() => {
        onComplete(profile);
      }, 2500);
    }
  }, [currentStep, totalSteps, validateCurrentStep, formData, onComplete]);

  // Navigate to previous step
  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
      setValidationError(null);
    }
  }, [currentStep]);

  // Animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="relative overflow-hidden border-0 shadow-2xl">
          {/* Progress bar at top */}
          <div className="absolute top-0 left-0 right-0 z-10">
            <Progress value={progressPercent} className="h-1.5 rounded-none" />
          </div>

          {/* Close / Skip button */}
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={onSkip}
              className="rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              aria-label="Skip onboarding"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            {isComplete ? (
              /* ========== COMPLETION SCREEN ========== */
              <motion.div
                key="complete"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                <CardContent className="pt-14 pb-10 px-6 text-center">
                  <ConfettiAnimation />
                  <div className="relative z-10 space-y-6">
                    <AnimatedCheckmark />
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h2 className="text-2xl font-bold text-gray-900">
                        Your personalized recommendations are ready!
                      </h2>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <p className="text-gray-500 text-base">
                        We&apos;ve analyzed your profile to find the best insurance plans for you.
                      </p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="flex items-center justify-center gap-2 text-emerald-600 font-medium"
                    >
                      <Sparkles className="w-5 h-5" />
                      <span>Tailored just for you with AI-powered insights</span>
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                  </div>
                </CardContent>
              </motion.div>
            ) : (
              /* ========== STEP SCREEN ========== */
              <motion.div
                key={`step-${currentStep}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                <CardContent className="pt-10 pb-6 px-6 space-y-6">
                  {/* Step indicator */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-400">
                      Step {currentStep + 1} of {totalSteps}
                    </span>
                    {currentStepData && (
                      <span
                        className={`text-sm font-semibold ${currentStepData.color}`}
                      >
                        {currentStepData.label}
                      </span>
                    )}
                  </div>

                  {/* Category icon & title */}
                  {currentStepData && (
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-14 h-14 rounded-2xl ${currentStepData.bgColor} flex items-center justify-center`}
                      >
                        <currentStepData.icon className={`w-7 h-7 ${currentStepData.color}`} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          {currentStepData.label}
                        </h2>
                        <p className="text-sm text-gray-500">
                          Help us understand you better
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Questions */}
                  <div className="space-y-6">
                    {currentStepData?.questions.map((question, qIndex) => (
                      <motion.div
                        key={question.id}
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: qIndex * 0.1 + 0.15 }}
                      >
                        <Label className="text-base font-semibold text-gray-800">
                          {question.question}
                          {question.required && (
                            <span className="text-emerald-500 ml-1">*</span>
                          )}
                        </Label>

                        {question.type === 'number' && (
                          <NumberQuestion
                            question={question}
                            value={getValue(question.id)}
                            onChange={(val) => setValue(question.id, val)}
                          />
                        )}
                        {question.type === 'text' && (
                          <TextQuestion
                            question={question}
                            value={getValue(question.id)}
                            onChange={(val) => setValue(question.id, val)}
                          />
                        )}
                        {question.type === 'select' && (
                          <SelectQuestion
                            question={question}
                            value={getValue(question.id)}
                            onChange={(val) => setValue(question.id, val)}
                            accentColor={currentStepData?.color || ''}
                          />
                        )}
                        {question.type === 'multi-select' && (
                          <MultiSelectQuestion
                            question={question}
                            values={getMultiValue(question.id)}
                            onChange={(vals) => setValue(question.id, vals)}
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Validation error */}
                  <AnimatePresence>
                    {validationError && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-sm text-red-500 font-medium text-center"
                      >
                        {validationError}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Navigation buttons */}
                  <div className="flex items-center justify-between pt-2">
                    {currentStep > 0 ? (
                      <Button
                        variant="ghost"
                        onClick={handlePrev}
                        className="gap-1 text-gray-600 hover:text-gray-900"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                      </Button>
                    ) : (
                      <div />
                    )}
                    <Button
                      onClick={handleNext}
                      className="gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-6 h-11 text-base font-semibold rounded-xl shadow-lg shadow-emerald-200"
                    >
                      {currentStep === totalSteps - 1 ? 'Get Recommendations' : 'Continue'}
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Skip for now */}
                  <div className="text-center pt-1 pb-2">
                    <button
                      type="button"
                      onClick={onSkip}
                      className="text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
                    >
                      Skip for now
                    </button>
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
}

// ============================================================================
// Helper: Build UserProfile from form data
// ============================================================================

function buildUserProfile(formData: FormValues): UserProfile {
  const dependentsStr = (formData['dependents'] as string) || '0';

  return {
    age: parseInt((formData['age'] as string) || '25', 10) || 25,
    income: (formData['income'] as string) || '5-10l',
    pincode: (formData['pincode'] as string) || '',
    medicalHistory: Array.isArray(formData['medicalHistory'])
      ? (formData['medicalHistory'] as string[]).filter((v) => v !== 'none')
      : [],
    lifestyle: Array.isArray(formData['lifestyle'])
      ? (formData['lifestyle'] as string[]).filter((v) => v !== 'none')
      : [],
    dependents: DEPENDENTS_MAP[dependentsStr] ?? parseInt(dependentsStr, 10) ?? 0,
    occupation: (formData['occupation'] as string) || '',
    existingInsurance: Array.isArray(formData['existingInsurance'])
      ? (formData['existingInsurance'] as string[]).filter((v) => v !== 'none')
      : [],
    priority: (formData['priority'] as string) || 'health',
  };
}
