'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Heart, Car, Umbrella, TrendingUp, AlertTriangle,
  CheckCircle2, ArrowRight, Sparkles, Brain,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface CoverageCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  score: number;
  maxScore: number;
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'missing';
  gap: string;
  recommendation: string;
  gradient: string;
  color: string;
}

const coverageData: CoverageCategory[] = [
  {
    id: 'health',
    name: 'Health Insurance',
    icon: Heart,
    score: 72,
    maxScore: 100,
    status: 'good',
    gap: 'No super top-up plan. Family floater limit low for metro cities.',
    recommendation: 'Add ₹25L Super Top-Up for ₹300/mo extra. Upgrade to ₹15L base plan.',
    gradient: 'from-rose-500 to-pink-600',
    color: 'text-rose-600',
  },
  {
    id: 'life',
    name: 'Term Insurance',
    icon: Shield,
    score: 45,
    maxScore: 100,
    status: 'fair',
    gap: 'No critical illness rider. Cover amount less than 10x annual income.',
    recommendation: 'Increase cover to ₹1.5 Cr + add Critical Illness rider (₹200/mo).',
    gradient: 'from-blue-500 to-indigo-600',
    color: 'text-blue-600',
  },
  {
    id: 'motor',
    name: 'Motor Insurance',
    icon: Car,
    score: 85,
    maxScore: 100,
    status: 'excellent',
    gap: 'Minor: Engine protect add-on missing.',
    recommendation: 'Add Engine Protect for ₹500/yr — covers water damage & hydrostatic lock.',
    gradient: 'from-amber-500 to-orange-600',
    color: 'text-amber-600',
  },
  {
    id: 'accident',
    name: 'Personal Accident',
    icon: Umbrella,
    score: 20,
    maxScore: 100,
    status: 'poor',
    gap: 'No personal accident cover! High risk for earning members.',
    recommendation: 'Get ₹1 Cr PA cover for just ₹150/mo — covers disability + death.',
    gradient: 'from-violet-500 to-purple-600',
    color: 'text-violet-600',
  },
];

function getStatusColor(status: CoverageCategory['status']) {
  switch (status) {
    case 'excellent': return 'text-emerald-600 dark:text-emerald-400';
    case 'good': return 'text-blue-600 dark:text-blue-400';
    case 'fair': return 'text-amber-600 dark:text-amber-400';
    case 'poor': return 'text-red-600 dark:text-red-400';
    case 'missing': return 'text-slate-400 dark:text-slate-500';
  }
}

function getStatusLabel(status: CoverageCategory['status']) {
  switch (status) {
    case 'excellent': return 'Excellent';
    case 'good': return 'Good';
    case 'fair': return 'Needs Work';
    case 'poor': return 'Critical';
    case 'missing': return 'Not Covered';
  }
}

function getProgressColor(status: CoverageCategory['status']) {
  switch (status) {
    case 'excellent': return '[&>div]:bg-emerald-500';
    case 'good': return '[&>div]:bg-blue-500';
    case 'fair': return '[&>div]:bg-amber-500';
    case 'poor': return '[&>div]:bg-red-500';
    case 'missing': return '[&>div]:bg-slate-300';
  }
}

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function CoverageScoreSection() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const overallScore = Math.round(coverageData.reduce((sum, c) => sum + c.score, 0) / coverageData.length);

  return (
    <section id="coverage-score" className="py-16 sm:py-24 bg-gradient-to-b from-background via-blue-50/30 to-background dark:from-background dark:via-blue-950/10 dark:to-background scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <Badge className="mb-4 bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800 rounded-full px-4 py-1">
            <Brain className="w-3.5 h-3.5 mr-1" />
            Coverage Score AI Analysis
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Aapka Insurance{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Coverage Score</span>
          </h2>
          <p className="mt-4 text-sm sm:text-lg text-muted-foreground">
            AI jaanta hai aapki insurance mein kya gaps hain — aur kaise fill karein. Apna score dekhiye aur better coverage paayein!
          </p>
        </motion.div>

        {/* Overall Score Card */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-10"
        >
          <Card className="border-2 border-indigo-200 dark:border-indigo-800/40 overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Circular Score */}
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" />
                    <circle cx="60" cy="60" r="54" fill="none" strokeWidth="8" strokeLinecap="round"
                      className="text-indigo-500"
                      strokeDasharray={`${(overallScore / 100) * 339.292} 339.292`}
                      style={{ transition: 'stroke-dasharray 1.5s ease-out' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl sm:text-4xl font-extrabold text-foreground">{overallScore}</span>
                    <span className="text-xs text-muted-foreground">/ 100</span>
                  </div>
                </div>

                {/* Score Details */}
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-1">Overall Coverage Score</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Aapka insurance portfolio {overallScore >= 70 ? 'accha hai' : overallScore >= 50 ? 'thek hai, lekin improve ho sakta hai' : 'mein major gaps hain'}. Neeche har category ka detailed analysis dekhiye.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    {coverageData.map((cat) => {
                      const statusCounts = coverageData.filter(c => c.status === cat.status).length;
                      return (
                        <Badge key={cat.id} variant="outline" className={`${getStatusColor(cat.status)} text-xs`}>
                          {cat.name}: {cat.score}%
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Individual Category Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {coverageData.map((cat) => {
            const IconComp = cat.icon;
            const isExpanded = expandedCard === cat.id;
            return (
              <motion.div key={cat.id} variants={staggerItem} whileHover={{ y: -4 }}>
                <Card
                  className={`h-full cursor-pointer transition-all duration-300 ${isExpanded ? 'ring-2 ring-indigo-400 dark:ring-indigo-600' : 'hover:shadow-lg'}`}
                  onClick={() => setExpandedCard(isExpanded ? null : cat.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-md`}>
                        <IconComp className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-bold ${getStatusColor(cat.status)}`}>{cat.score}%</p>
                        <p className={`text-[10px] font-medium ${getStatusColor(cat.status)}`}>{getStatusLabel(cat.status)}</p>
                      </div>
                    </div>
                    <CardTitle className="text-sm font-semibold mt-2">{cat.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Progress value={cat.score} className={`h-2 mb-3 ${getProgressColor(cat.status)}`} />

                    {!isExpanded ? (
                      <p className="text-xs text-muted-foreground line-clamp-2">{cat.gap}</p>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs font-medium text-amber-700 dark:text-amber-300">Gap Detected</p>
                              <p className="text-xs text-muted-foreground">{cat.gap}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs font-medium text-indigo-700 dark:text-indigo-300">AI Recommendation</p>
                              <p className="text-xs text-muted-foreground">{cat.recommendation}</p>
                            </div>
                          </div>
                          <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer" className="block">
                            <Button size="sm" className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-xs h-8">
                              Fix This Gap <ArrowRight className="ml-1 w-3 h-3" />
                            </Button>
                          </a>
                        </div>
                      </motion.div>
                    )}

                    <p className="text-[10px] text-muted-foreground mt-2 text-center">Click to {isExpanded ? 'collapse' : 'expand'}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full gap-2 shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-4 h-4" />
              Get Free Coverage Analysis
            </Button>
          </a>
          <p className="text-xs text-muted-foreground mt-3">
            Expert se baat karein — personalized recommendations ke liye
          </p>
        </motion.div>
      </div>
    </section>
  );
}
