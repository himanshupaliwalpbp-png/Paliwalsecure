'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Shield, FileText, ArrowLeft, Sparkles,
} from 'lucide-react';
import PolicyUpload, { type ExtractedPolicyData } from '@/components/PolicyUpload';
import PolicySummary from '@/components/PolicySummary';
import PolicyComparison from '@/components/PolicyComparison';
import { type UserProfile } from '@/lib/insurance-data';

// ── Animation Variants ───────────────────────────────────────────────────────
const fadeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

// ── Step Configuration ────────────────────────────────────────────────────────
type AnalysisStep = 'upload' | 'summary' | 'comparison';

const steps: { id: AnalysisStep; label: string; icon: React.ElementType }[] = [
  { id: 'upload', label: 'Upload Policy', icon: FileText },
  { id: 'summary', label: 'AI Summary', icon: Sparkles },
  { id: 'comparison', label: 'Compare Plans', icon: Shield },
];

// ── Component ────────────────────────────────────────────────────────────────
interface PolicyAnalysisSectionProps {
  userProfile: UserProfile | null;
}

export default function PolicyAnalysisSection({ userProfile }: PolicyAnalysisSectionProps) {
  const [currentStep, setCurrentStep] = useState<AnalysisStep>('upload');
  const [policyData, setPolicyData] = useState<ExtractedPolicyData | null>(null);

  const handleAnalysisComplete = (data: ExtractedPolicyData) => {
    setPolicyData(data);
    setCurrentStep('summary');
  };

  const handleGoToComparison = () => {
    setCurrentStep('comparison');
  };

  const handleGoBack = () => {
    if (currentStep === 'comparison') setCurrentStep('summary');
    else if (currentStep === 'summary') setCurrentStep('upload');
  };

  const handleReset = () => {
    setPolicyData(null);
    setCurrentStep('upload');
  };

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="w-full">
      {/* ── Step Progress Bar ────────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 sm:mb-10">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = step.id === currentStep;
          const isCompleted = index < currentStepIndex;

          return (
            <div key={step.id} className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => {
                  if (isCompleted || (index === currentStepIndex + 1 && policyData)) {
                    setCurrentStep(step.id);
                  }
                }}
                disabled={!isCompleted && !(index === currentStepIndex + 1 && policyData)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 min-h-[44px] ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                    : isCompleted
                      ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 cursor-pointer hover:bg-emerald-200 dark:hover:bg-emerald-950/60'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                }`}
              >
                <StepIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden">{step.label.split(' ')[0]}</span>
                {isCompleted && (
                  <span className="text-emerald-600">✓</span>
                )}
              </button>
              {index < steps.length - 1 && (
                <div className={`w-6 sm:w-12 h-0.5 rounded-full transition-colors duration-300 ${
                  index < currentStepIndex
                    ? 'bg-emerald-400'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Content Area ─────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {currentStep === 'upload' && (
          <motion.div
            key="upload"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <PolicyUpload onAnalysisComplete={handleAnalysisComplete} />
          </motion.div>
        )}

        {currentStep === 'summary' && policyData && (
          <motion.div
            key="summary"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Navigation buttons */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                onClick={handleGoBack}
                className="gap-2 text-slate-600 dark:text-slate-300"
              >
                <ArrowLeft className="w-4 h-4" />
                Upload New
              </Button>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1 text-xs">
                  <Sparkles className="w-3 h-3" />
                  AI Analyzed
                </Badge>
              </div>
            </div>

            {/* Summary Component */}
            <PolicySummary data={policyData} />

            {/* Next Step CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8 text-center"
            >
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-6 sm:p-8 border border-blue-200/50 dark:border-blue-800/30">
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                  Kya aapko behtar plan chahiye?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Apni policy ko top 3 recommended plans se compare karein — AI scoring engine ke saath!
                </p>
                <Button
                  onClick={handleGoToComparison}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full gap-2 shadow-lg shadow-blue-500/25 font-semibold"
                >
                  <Shield className="w-4 h-4" />
                  Compare with Top Plans
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {currentStep === 'comparison' && policyData && (
          <motion.div
            key="comparison"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Navigation buttons */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                onClick={handleGoBack}
                className="gap-2 text-slate-600 dark:text-slate-300"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Summary
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                className="gap-2 text-sm"
              >
                Upload New Policy
              </Button>
            </div>

            {/* Comparison Component */}
            <PolicyComparison
              uploadedPolicy={policyData}
              userProfile={userProfile}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Info Banner (always visible) ─────────────────────────────────── */}
      {currentStep === 'upload' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-muted-foreground max-w-lg mx-auto leading-relaxed">
            🔒 Aapka document puri tarah secure hai — hum sirf text extract karte hain aur data store karte hain.
            Original PDF file delete ho jaati hai analysis ke baad.{' '}
            <span className="font-medium text-blue-600 dark:text-blue-400">Read our Privacy Policy</span>
          </p>
        </motion.div>
      )}
    </div>
  );
}
