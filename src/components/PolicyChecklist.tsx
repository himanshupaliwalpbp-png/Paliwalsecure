'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardCheck, ShieldCheck, AlertCircle, CheckCircle2, XCircle,
  ArrowRight, MessageCircle, Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n';

// ── Checklist Item Type ──────────────────────────────────────────────────────
interface ChecklistItem {
  id: string;
  question: string;
  hinglish: string;
  hindi: string;
  importance: 'high' | 'medium';
  tip: string;
  tipHinglish: string;
}

// ── Checklist Data ───────────────────────────────────────────────────────────
const checklistItems: ChecklistItem[] = [
  {
    id: 'csr',
    question: 'Claim Settlement Ratio above 90%?',
    hinglish: 'Claim Settlement Ratio 90% se upar hai?',
    hindi: 'क्लेम सेटलमेंट रेश्यो 90% से ऊपर है?',
    importance: 'high',
    tip: 'CSR below 90% means your claim is more likely to be rejected.',
    tipHinglish: 'CSR 90% se neeche matlab zyada chance hai claim reject ho.',
  },
  {
    id: 'room-rent',
    question: 'No room rent limit?',
    hinglish: 'Room rent limit toh nahi hai?',
    hindi: 'कमरा किराया सीमा तो नहीं है?',
    importance: 'high',
    tip: 'Room rent limits can force you to pay thousands daily from pocket.',
    tipHinglish: 'Room rent limit matlab har din jaeb se paisa dena padega.',
  },
  {
    id: 'ped',
    question: 'Pre-existing diseases covered after waiting period?',
    hinglish: 'Purani bimariyan waiting period ke baad cover hain?',
    hindi: 'पुरानी बीमारियाँ वेटिंग पीरियड के बाद कवर हैं?',
    importance: 'high',
    tip: 'Some policies never cover pre-existing diseases — always check.',
    tipHinglish: 'Kuch policies purani bimariyan kabhi cover nahi karti — check karo.',
  },
  {
    id: 'copay',
    question: 'No co-payment clause?',
    hinglish: 'Co-payment clause toh nahi hai?',
    hindi: 'को-पेमेंट शर्त तो नहीं है?',
    importance: 'high',
    tip: 'Copay means you pay 10-20% of every bill from your pocket.',
    tipHinglish: 'Copay matlab har bill ka 10-20% aapko khud dena padega.',
  },
  {
    id: 'floater',
    question: 'Family floater option available?',
    hinglish: 'Family floater option hai?',
    hindi: 'फैमिली फ्लोटर विकल्प उपलब्ध है?',
    importance: 'medium',
    tip: 'Family floater covers all members under one plan — saves money.',
    tipHinglish: 'Family floater ek plan mein sabko cover karta hai — paisa bachata hai.',
  },
  {
    id: 'ncb',
    question: 'No claim bonus offered?',
    hinglish: 'No claim bonus milta hai?',
    hindi: 'नो क्लेम बोनस मिलता है?',
    importance: 'medium',
    tip: 'NCB increases your cover amount every claim-free year.',
    tipHinglish: 'NCB har claim-free saal cover amount badhata hai.',
  },
  {
    id: 'cashless',
    question: 'Cashless network hospitals in your city?',
    hinglish: 'Aapke sheher mein cashless network hospitals hain?',
    hindi: 'आपके शहर में कैशलेस नेटवर्क अस्पताल हैं?',
    importance: 'high',
    tip: 'Without cashless, you must pay first and claim reimbursement later.',
    tipHinglish: 'Cashless nahi toh pehle aapko pay karna padega, phir claim karna padega.',
  },
  {
    id: 'restore',
    question: 'Restore benefit included?',
    hinglish: 'Restore benefit hai?',
    hindi: 'रिस्टोर बेनिफिट शामिल है?',
    importance: 'medium',
    tip: 'Restore benefit refills your sum insured if exhausted during the year.',
    tipHinglish: 'Restore benefit sum insured khatam hone par phir se bharta hai.',
  },
  {
    id: 'ambulance',
    question: 'Ambulance charges covered?',
    hinglish: 'Ambulance charges covered hain?',
    hindi: 'एम्बुलेंस शुल्क कवर्ड हैं?',
    importance: 'medium',
    tip: 'Ambulance costs ₹2,000–₹10,000 — should be part of your plan.',
    tipHinglish: 'Ambulance ₹2,000–₹10,000 lagta hai — plan mein hona chahiye.',
  },
  {
    id: 'daycare',
    question: 'Day care procedures covered?',
    hinglish: 'Day care procedures covered hain?',
    hindi: 'डे केयर प्रक्रियाएँ कवर्ड हैं?',
    importance: 'medium',
    tip: 'Cataract, angioplasty etc. need less than 24hrs — must be covered.',
    tipHinglish: 'Cataract, angioplasty 24 ghante se kam mein — cover hone chahiye.',
  },
  {
    id: 'checkup',
    question: 'Annual health checkup included?',
    hinglish: 'Annual health checkup included hai?',
    hindi: 'वार्षिक स्वास्थ्य जाँच शामिल है?',
    importance: 'medium',
    tip: 'Free health checkup worth ₹2,000–₹5,000 — a nice perk.',
    tipHinglish: 'Free health checkup ₹2,000–₹5,000 ka — achha benefit hai.',
  },
  {
    id: 'ayush',
    question: 'AYUSH treatment covered?',
    hinglish: 'AYUSH treatment covered hai?',
    hindi: 'AYUSH ट्रीटमेंट कवर्ड है?',
    importance: 'medium',
    tip: 'Ayurveda, Homeopathy coverage is now IRDAI-mandated for all plans.',
    tipHinglish: 'Ayurveda, Homeopathy cover ab IRDAI ke rule ke according mandatory hai.',
  },
];

// ── Score Level ──────────────────────────────────────────────────────────────
type ScoreLevel = 'poor' | 'average' | 'excellent';

function getScoreLevel(score: number): ScoreLevel {
  if (score <= 4) return 'poor';
  if (score <= 8) return 'average';
  return 'excellent';
}

function getScoreColor(level: ScoreLevel) {
  switch (level) {
    case 'poor': return { bg: 'bg-red-50 dark:bg-red-950/20', border: 'border-red-200 dark:border-red-800', text: 'text-red-700 dark:text-red-300', badge: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300', gradient: 'from-red-500 to-orange-500' };
    case 'average': return { bg: 'bg-amber-50 dark:bg-amber-950/20', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-300', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300', gradient: 'from-amber-500 to-yellow-500' };
    case 'excellent': return { bg: 'bg-emerald-50 dark:bg-emerald-950/20', border: 'border-emerald-200 dark:border-emerald-800', text: 'text-emerald-700 dark:text-emerald-300', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300', gradient: 'from-emerald-500 to-green-500' };
  }
}

function getScoreMessage(score: number, total: number, lang: string): string {
  const level = getScoreLevel(score);
  if (lang === 'hi') {
    if (level === 'poor') return `आपकी पॉलिसी में गंभीर कमियाँ हैं! तुरंत सुधार करें।`;
    if (level === 'average') return `अच्छी है, लेकिन बेहतर हो सकती है! कुछ और जाँचें।`;
    return `बहुत अच्छी पॉलिसी! लगभग सब कुछ कवर है।`;
  }
  if (lang === 'hinglish') {
    if (level === 'poor') return `Aapki policy mein serious gaps hain! Turant sudharein.`;
    if (level === 'average') return `Achhi hai, lekin better ho sakti hai! Thodi aur check karein.`;
    return `Bahut achhi policy! Almost sab covered hai.`;
  }
  if (level === 'poor') return `Your policy has serious gaps! Get expert help now.`;
  if (level === 'average') return `Good but can be better! Check the missing items.`;
  return `Excellent policy! Almost everything is covered.`;
}

// ── Component ────────────────────────────────────────────────────────────────
export default function PolicyChecklist() {
  const { language } = useLanguage();
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const score = Object.values(checked).filter(Boolean).length;
  const total = checklistItems.length;
  const level = getScoreLevel(score);
  const colors = getScoreColor(level);

  const highImportanceUnchecked = checklistItems
    .filter((item) => item.importance === 'high' && !checked[item.id]);

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <ClipboardCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {language === 'hi' ? 'पॉलिसी चेकलिस्ट' : language === 'hinglish' ? 'Policy Checklist' : 'Policy Checklist'}
            </h3>
            <p className="text-sm text-white/80">
              {language === 'hi' ? 'अपनी पॉलिसी की जाँच करें' : language === 'hinglish' ? 'Apni policy ko check karein' : 'Verify if your insurance policy is good'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        {/* ── Score Display ──────────────────────────────────────────────── */}
        <motion.div
          layout
          className={`p-4 rounded-xl border-2 ${colors.border} ${colors.bg} transition-colors duration-300`}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg`}>
                {level === 'excellent' ? (
                  <Award className="w-6 h-6 text-white" />
                ) : level === 'average' ? (
                  <ShieldCheck className="w-6 h-6 text-white" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <div className={`text-2xl font-extrabold ${colors.text}`}>
                  {score}/{total}
                </div>
                <div className="text-xs text-muted-foreground">
                  {language === 'hi' ? 'पॉलिसी स्कोर' : language === 'hinglish' ? 'Policy Score' : 'Policy Score'}
                </div>
              </div>
            </div>
            <Badge className={`rounded-full px-3 py-1 text-xs font-bold ${colors.badge}`}>
              {level === 'poor' ? '⚠️ ' : level === 'average' ? '🔶 ' : '✅ '}
              {level === 'poor'
                ? language === 'hi' ? 'खराब' : language === 'hinglish' ? 'Poor' : 'Needs Improvement'
                : level === 'average'
                ? language === 'hi' ? 'औसत' : language === 'hinglish' ? 'Average' : 'Good'
                : language === 'hi' ? 'उत्कृष्ट' : language === 'hinglish' ? 'Excellent' : 'Excellent'}
            </Badge>
          </div>
          <p className={`text-sm mt-3 ${colors.text} font-medium`}>
            {getScoreMessage(score, total, language)}
          </p>

          {/* Progress bar */}
          <div className="mt-3 h-2 rounded-full bg-muted/50 overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${colors.gradient}`}
              initial={{ width: 0 }}
              animate={{ width: `${(score / total) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* ── Checklist Items ──────────────────────────────────────────────── */}
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
          {checklistItems.map((item, index) => {
            const isChecked = !!checked[item.id];
            const label = language === 'hinglish' ? item.hinglish : language === 'hi' ? item.hindi : item.question;
            const tipText = language === 'hinglish' ? item.tipHinglish : item.tip;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`group flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  isChecked
                    ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/10'
                    : 'border-border/50 bg-background hover:border-cyan-200 dark:hover:border-cyan-800'
                }`}
                onClick={() => toggleItem(item.id)}
              >
                {/* Checkbox */}
                <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                  isChecked
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'border-muted-foreground/30 hover:border-cyan-500'
                }`}>
                  {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${isChecked ? 'text-emerald-700 dark:text-emerald-300' : 'text-foreground'}`}>
                      {label}
                    </span>
                    {item.importance === 'high' && !isChecked && (
                      <Badge className="text-[9px] px-1.5 py-0 bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 border-0">
                        {language === 'hi' ? 'ज़रूरी' : language === 'hinglish' ? 'Must Have' : 'Must Have'}
                      </Badge>
                    )}
                  </div>
                  {!isChecked && (
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                      💡 {tipText}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── High Importance Warning ──────────────────────────────────────── */}
        <AnimatePresence>
          {highImportanceUnchecked.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 rounded-xl border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/10"
            >
              <div className="flex items-center gap-2 mb-1">
                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-xs font-bold text-red-700 dark:text-red-300">
                  {language === 'hi'
                    ? `${highImportanceUnchecked.length} ज़रूरी चीज़ें गायब हैं!`
                    : language === 'hinglish'
                    ? `${highImportanceUnchecked.length} must-have cheezein missing hain!`
                    : `${highImportanceUnchecked.length} must-have features missing!`}
                </span>
              </div>
              <p className="text-[10px] text-red-600/70 dark:text-red-400/70">
                {language === 'hi'
                  ? 'ये चीज़ें आपके क्लेम को ख़तरे में डाल सकती हैं।'
                  : language === 'hinglish'
                  ? 'Yeh cheezein aapke claim ko risk mein daal sakti hain.'
                  : 'These features put your claims at risk.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── CTA Button ────────────────────────────────────────────────── */}
        <Button
          onClick={() => window.open('https://wa.me/919257877312?text=Hi! I need a free policy audit. My score is ' + score + '/' + total, '_blank')}
          className="w-full h-12 text-base font-bold rounded-xl gap-2 cta-glow"
        >
          <MessageCircle className="w-4 h-4" />
          {language === 'hi'
            ? 'विशेषज्ञ से मुफ़्त पॉलिसी ऑडिट →'
            : language === 'hinglish'
            ? 'Free Policy Audit by Expert →'
            : 'Get Free Policy Audit by Expert →'}
        </Button>
      </div>
    </div>
  );
}
