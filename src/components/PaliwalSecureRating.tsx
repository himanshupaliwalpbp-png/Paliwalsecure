'use client';

import { useMemo } from 'react';
import { Shield, Award, TrendingUp, Hospital, Scale, MessageSquareWarning, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/lib/i18n';
import type { PaliwalSecureScore, PaliwalSecureMetrics } from '@/lib/paliwal-secure-score';
import { calculatePaliwalSecureScore } from '@/lib/paliwal-secure-score';

type Language = 'en' | 'hi' | 'hinglish';

interface PaliwalSecureRatingProps {
  /** Pre-computed score, or pass metrics to compute */
  score?: PaliwalSecureScore;
  metrics?: PaliwalSecureMetrics;
  insurerName: string;
  isMotor?: boolean;
  compact?: boolean;
}

const metricIcons = [TrendingUp, Scale, Hospital, Shield, MessageSquareWarning, Clock];

const labels: Record<string, Record<Language, string>> = {
  'Claim Settlement Ratio': {
    en: 'Claim Settlement Ratio',
    hi: 'क्लेम सेटलमेंट रेश्यो',
    hinglish: 'Claim Settlement Ratio',
  },
  'Incurred Claim Ratio': {
    en: 'Incurred Claim Ratio',
    hi: 'इनकर्ड क्लेम रेश्यो',
    hinglish: 'Incurred Claim Ratio',
  },
  'Network Hospitals': {
    en: 'Network Hospitals',
    hi: 'नेटवर्क अस्पताल',
    hinglish: 'Network Hospitals',
  },
  'Network Garages': {
    en: 'Network Garages',
    hi: 'नेटवर्क गैराज',
    hinglish: 'Network Garages',
  },
  'Solvency Ratio': {
    en: 'Solvency Ratio',
    hi: 'सॉल्वेंसी रेश्यो',
    hinglish: 'Solvency Ratio',
  },
  'Complaints per 10K': {
    en: 'Complaints per 10K',
    hi: '10K पर शिकायतें',
    hinglish: 'Complaints per 10K',
  },
  'Claim Turnaround': {
    en: 'Claim Turnaround',
    hi: 'क्लेम टर्नअराउंड',
    hinglish: 'Claim Turnaround',
  },
  'Paliwal Secure Score': {
    en: 'Paliwal Secure Score™',
    hi: 'पालीवाल सिक्योर स्कोर™',
    hinglish: 'Paliwal Secure Score™',
  },
  'out of 100': {
    en: 'out of 100',
    hi: '100 में से',
    hinglish: '100 mein se',
  },
  'Weight': {
    en: 'Weight',
    hi: 'भार',
    hinglish: 'Weight',
  },
  'IRDAI Data': {
    en: 'Based on IRDAI Data 2025-26',
    hi: 'IRDAI डेटा 2025-26 पर आधारित',
    hinglish: 'IRDAI Data 2025-26 par based',
  },
};

function formatMetricValue(key: string, value: number): string {
  if (key === 'Claim Settlement Ratio') return `${value}%`;
  if (key === 'Incurred Claim Ratio') return `${value}%`;
  if (key === 'Network Hospitals' || key === 'Network Garages') return `${value.toLocaleString('en-IN')}`;
  if (key === 'Solvency Ratio') return `${value.toFixed(1)}`;
  if (key === 'Complaints per 10K') return `${value}`;
  if (key === 'Claim Turnaround') return `${value} days`;
  return `${value}`;
}

function getBarColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#eab308';
  if (score >= 40) return '#f97316';
  return '#ef4444';
}

export default function PaliwalSecureRating({
  score: precomputedScore,
  metrics,
  insurerName,
  isMotor = false,
  compact = false,
}: PaliwalSecureRatingProps) {
  const { language } = useLanguage();
  const lang = language as Language;

  const computedScore = useMemo(() => {
    if (precomputedScore) return precomputedScore;
    if (metrics) return calculatePaliwalSecureScore(metrics, isMotor);
    return null;
  }, [precomputedScore, metrics, isMotor]);

  if (!computedScore) return null;

  const { overall, tier, tierLabel, tierColor, metrics: metricScores } = computedScore;

  // SVG circle parameters
  const radius = compact ? 44 : 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overall / 100) * circumference;

  const t = (key: string) => labels[key]?.[lang] || labels[key]?.en || key;

  const metricEntries = Object.values(metricScores);

  return (
    <Card className="overflow-hidden border-2" style={{ borderColor: tierColor + '40' }}>
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ background: `linear-gradient(135deg, ${tierColor}15, ${tierColor}05)` }}
      >
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5" style={{ color: tierColor }} />
          <span className="font-bold text-sm" style={{ color: tierColor }}>
            {t('Paliwal Secure Score')}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">{t('IRDAI Data')}</span>
      </div>

      <CardContent className={compact ? 'p-4' : 'p-6'}>
        <div className={compact ? 'flex flex-col gap-4' : 'flex flex-col md:flex-row gap-6'}>
          {/* Score Circle */}
          <div className="flex flex-col items-center justify-center flex-shrink-0">
            <div className="relative">
              <svg
                width={compact ? 110 : 140}
                height={compact ? 110 : 140}
                viewBox={`0 0 ${compact ? 110 : 140} ${compact ? 110 : 140}`}
              >
                {/* Background circle */}
                <circle
                  cx={compact ? 55 : 70}
                  cy={compact ? 55 : 70}
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  className="text-muted/20"
                  strokeWidth={compact ? 8 : 10}
                />
                {/* Score ring */}
                <circle
                  cx={compact ? 55 : 70}
                  cy={compact ? 55 : 70}
                  r={radius}
                  fill="none"
                  stroke={tierColor}
                  strokeWidth={compact ? 8 : 10}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  transform={`rotate(-90 ${compact ? 55 : 70} ${compact ? 55 : 70})`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-extrabold text-3xl md:text-4xl" style={{ color: tierColor }}>
                  {overall}
                </span>
                <span className="text-[10px] text-muted-foreground">{t('out of 100')}</span>
              </div>
            </div>
            {/* Tier Badge */}
            <div
              className="mt-3 px-3 py-1 rounded-full text-xs font-bold"
              style={{
                background: tierColor + '20',
                color: tierColor,
                border: `1px solid ${tierColor}40`,
              }}
            >
              {tierLabel}
            </div>
            <p className="mt-2 text-xs text-muted-foreground text-center">{insurerName}</p>
          </div>

          {/* Metric Bars */}
          <div className="flex-1 space-y-3 min-w-0">
            {metricEntries.map((metric, i) => {
              const Icon = metricIcons[i] || Shield;
              const barColor = getBarColor(metric.score);
              const label = t(metric.label);

              return (
                <div key={metric.label} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="text-xs font-medium text-foreground truncate">{label}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground">
                        {formatMetricValue(metric.label, metric.value)}
                      </span>
                      <span
                        className="text-xs font-bold px-1.5 py-0.5 rounded"
                        style={{
                          background: barColor + '15',
                          color: barColor,
                        }}
                      >
                        {metric.score}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${metric.score}%`,
                        background: `linear-gradient(90deg, ${barColor}80, ${barColor})`,
                      }}
                    />
                  </div>
                  {compact && (
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {t('Weight')}: {metric.weight}%
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        {!compact && (
          <div className="mt-4 pt-3 border-t border-border/50 text-center">
            <p className="text-[10px] text-muted-foreground">
              Paliwal Secure Score™ is a proprietary rating by Paliwal Secure based on 6 IRDAI metrics.
              Weighted: CSR 25%, ICR 15%, Network 15%, Solvency 15%, Complaints 15%, Turnaround 15%.
              For informational purposes only. Not financial advice.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
