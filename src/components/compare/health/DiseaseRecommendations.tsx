'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface DiseaseRecommendationsProps {
  ped: string[];
  className?: string;
}

// ---------------------------------------------------------------------------
// Disease-specific insurer recommendations
// ---------------------------------------------------------------------------
interface InsurerPEDInfo {
  insurerId: string;
  insurerName: string;
  status: 'accepted' | 'loading' | 'decline_likely';
  loadingPercent: number;
  note: string;
}

interface DiseaseRecommendation {
  diseaseId: string;
  diseaseName: string;
  insurers: InsurerPEDInfo[];
}

const DISEASE_RECOMMENDATIONS: Record<string, DiseaseRecommendation> = {
  diabetes: {
    diseaseId: 'diabetes',
    diseaseName: 'Diabetes',
    insurers: [
      { insurerId: 'CARE', insurerName: 'Care Health', status: 'loading', loadingPercent: 20, note: 'Accepted with 20% loading. Chronic Management Program available.' },
      { insurerId: 'NIVA_BUPA', insurerName: 'Niva Bupa', status: 'loading', loadingPercent: 20, note: 'Accepted with 20% loading after medical checkup.' },
      { insurerId: 'HDFC_ERGO', insurerName: 'HDFC ERGO', status: 'loading', loadingPercent: 20, note: 'Accepted with 20% loading. Waiting period 2-4 years.' },
      { insurerId: 'ADITYA_BIRLA', insurerName: 'Aditya Birla Health', status: 'loading', loadingPercent: 15, note: 'Chronic Management Program — best for diabetes.' },
      { insurerId: 'ACKO', insurerName: 'ACKO', status: 'loading', loadingPercent: 20, note: 'Accepted with loading. No copay for diabetes claims.' },
      { insurerId: 'ICICI_LOMBARD', insurerName: 'ICICI Lombard', status: 'loading', loadingPercent: 25, note: 'Accepted with loading. Wellness rewards available.' },
      { insurerId: 'STAR', insurerName: 'Star Health', status: 'loading', loadingPercent: 20, note: 'Diabetes Safe plan available. Loading applies.' },
    ],
  },
  hypertension: {
    diseaseId: 'hypertension',
    diseaseName: 'Hypertension',
    insurers: [
      { insurerId: 'CARE', insurerName: 'Care Health', status: 'loading', loadingPercent: 15, note: 'Accepted with 15% loading.' },
      { insurerId: 'NIVA_BUPA', insurerName: 'Niva Bupa', status: 'loading', loadingPercent: 15, note: 'Accepted with 15% loading.' },
      { insurerId: 'HDFC_ERGO', insurerName: 'HDFC ERGO', status: 'loading', loadingPercent: 15, note: 'Accepted with loading. Standard waiting period.' },
      { insurerId: 'ADITYA_BIRLA', insurerName: 'Aditya Birla Health', status: 'accepted', loadingPercent: 10, note: 'Chronic Management — best for hypertension.' },
      { insurerId: 'ACKO', insurerName: 'ACKO', status: 'loading', loadingPercent: 15, note: 'Accepted with loading.' },
      { insurerId: 'ICICI_LOMBARD', insurerName: 'ICICI Lombard', status: 'loading', loadingPercent: 15, note: 'Accepted with loading.' },
      { insurerId: 'STAR', insurerName: 'Star Health', status: 'loading', loadingPercent: 15, note: 'Accepted with loading.' },
    ],
  },
  heartDisease: {
    diseaseId: 'heartDisease',
    diseaseName: 'Heart Disease',
    insurers: [
      { insurerId: 'CARE', insurerName: 'Care Health', status: 'loading', loadingPercent: 40, note: 'May accept with 40% loading after cardiac evaluation.' },
      { insurerId: 'NIVA_BUPA', insurerName: 'Niva Bupa', status: 'decline_likely', loadingPercent: 50, note: 'Decline likely. May consider mild cases with heavy loading.' },
      { insurerId: 'HDFC_ERGO', insurerName: 'HDFC ERGO', status: 'decline_likely', loadingPercent: 50, note: 'Decline likely for major cardiac conditions.' },
      { insurerId: 'ADITYA_BIRLA', insurerName: 'Aditya Birla Health', status: 'loading', loadingPercent: 35, note: 'Chronic Management Program may cover stable conditions.' },
      { insurerId: 'ACKO', insurerName: 'ACKO', status: 'decline_likely', loadingPercent: 50, note: 'Decline likely. Very limited acceptance.' },
      { insurerId: 'ICICI_LOMBARD', insurerName: 'ICICI Lombard', status: 'decline_likely', loadingPercent: 50, note: 'Decline likely. Case-by-case evaluation.' },
      { insurerId: 'STAR', insurerName: 'Star Health', status: 'loading', loadingPercent: 40, note: 'Cardiac-specific plans may be available.' },
    ],
  },
  cancer: {
    diseaseId: 'cancer',
    diseaseName: 'Cancer',
    insurers: [
      { insurerId: 'CARE', insurerName: 'Care Health', status: 'decline_likely', loadingPercent: 55, note: 'Decline likely for active cancer. May consider after 5-year remission.' },
      { insurerId: 'NIVA_BUPA', insurerName: 'Niva Bupa', status: 'decline_likely', loadingPercent: 60, note: 'Decline likely. May consider after remission with loading.' },
      { insurerId: 'HDFC_ERGO', insurerName: 'HDFC ERGO', status: 'decline_likely', loadingPercent: 60, note: 'Decline likely. Post-remission cases may be considered.' },
      { insurerId: 'ADITYA_BIRLA', insurerName: 'Aditya Birla Health', status: 'decline_likely', loadingPercent: 55, note: 'Decline likely. Critical illness rider may be unavailable.' },
      { insurerId: 'ACKO', insurerName: 'ACKO', status: 'decline_likely', loadingPercent: 60, note: 'Decline likely for active or recent cancer.' },
      { insurerId: 'ICICI_LOMBARD', insurerName: 'ICICI Lombard', status: 'decline_likely', loadingPercent: 60, note: 'Decline likely. Very limited acceptance.' },
      { insurerId: 'STAR', insurerName: 'Star Health', status: 'decline_likely', loadingPercent: 55, note: 'Cancer-specific plans available. Standard policy decline likely.' },
    ],
  },
  thyroid: {
    diseaseId: 'thyroid',
    diseaseName: 'Thyroid',
    insurers: [
      { insurerId: 'CARE', insurerName: 'Care Health', status: 'accepted', loadingPercent: 10, note: 'Accepted with 10% loading. Common condition.' },
      { insurerId: 'NIVA_BUPA', insurerName: 'Niva Bupa', status: 'accepted', loadingPercent: 10, note: 'Accepted with minor loading.' },
      { insurerId: 'HDFC_ERGO', insurerName: 'HDFC ERGO', status: 'accepted', loadingPercent: 10, note: 'Accepted. Standard loading applies.' },
      { insurerId: 'ADITYA_BIRLA', insurerName: 'Aditya Birla Health', status: 'accepted', loadingPercent: 5, note: 'Best for thyroid — low loading with chronic cover.' },
      { insurerId: 'ACKO', insurerName: 'ACKO', status: 'accepted', loadingPercent: 10, note: 'Accepted with loading.' },
      { insurerId: 'ICICI_LOMBARD', insurerName: 'ICICI Lombard', status: 'accepted', loadingPercent: 10, note: 'Accepted with loading.' },
      { insurerId: 'STAR', insurerName: 'Star Health', status: 'accepted', loadingPercent: 10, note: 'Accepted with loading.' },
    ],
  },
  asthma: {
    diseaseId: 'asthma',
    diseaseName: 'Asthma',
    insurers: [
      { insurerId: 'CARE', insurerName: 'Care Health', status: 'accepted', loadingPercent: 10, note: 'Accepted with 10% loading.' },
      { insurerId: 'NIVA_BUPA', insurerName: 'Niva Bupa', status: 'accepted', loadingPercent: 10, note: 'Accepted with minor loading.' },
      { insurerId: 'HDFC_ERGO', insurerName: 'HDFC ERGO', status: 'accepted', loadingPercent: 10, note: 'Accepted. Standard loading applies.' },
      { insurerId: 'ADITYA_BIRLA', insurerName: 'Aditya Birla Health', status: 'accepted', loadingPercent: 5, note: 'Low loading. Chronic cover available.' },
      { insurerId: 'ACKO', insurerName: 'ACKO', status: 'accepted', loadingPercent: 10, note: 'Accepted with loading. No copay.' },
      { insurerId: 'ICICI_LOMBARD', insurerName: 'ICICI Lombard', status: 'accepted', loadingPercent: 10, note: 'Accepted with loading.' },
      { insurerId: 'STAR', insurerName: 'Star Health', status: 'accepted', loadingPercent: 10, note: 'Accepted with loading.' },
    ],
  },
};

// ---------------------------------------------------------------------------
// Status badge helper
// ---------------------------------------------------------------------------
function StatusBadge({ status }: { status: InsurerPEDInfo['status'] }) {
  const config: Record<string, { icon: typeof CheckCircle2; text: string; color: string }> = {
    accepted: {
      icon: CheckCircle2,
      text: 'Accepted',
      color: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700',
    },
    loading: {
      icon: AlertTriangle,
      text: 'Loading',
      color: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700',
    },
    decline_likely: {
      icon: XCircle,
      text: 'Decline Likely',
      color: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700',
    },
  };

  const c = config[status] ?? config['loading'];
  const Icon = c.icon;

  return (
    <Badge className={`${c.color} border text-[9px] h-5 px-1.5 gap-0.5`}>
      <Icon className="h-2.5 w-2.5" />
      {c.text}
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// Disease Recommendations Component
// ---------------------------------------------------------------------------
export function DiseaseRecommendations({ ped, className }: DiseaseRecommendationsProps) {
  // Filter out "none" and get relevant recommendations
  const activePED = ped.filter((p) => p !== 'none' && DISEASE_RECOMMENDATIONS[p]);

  if (activePED.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={className}
    >
      <Card className="border-emerald-200 dark:border-emerald-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="text-lg">🩺</span>
            Disease-Specific Recommendations
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Insurer acceptance varies by pre-existing condition. Here's what to expect.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {activePED.map((diseaseId, idx) => {
            const rec = DISEASE_RECOMMENDATIONS[diseaseId];
            if (!rec) return null;

            // Sort: accepted first, then loading, then decline_likely
            const sorted = [...rec.insurers].sort((a, b) => {
              const order = { accepted: 0, loading: 1, decline_likely: 2 };
              return (order[a.status] ?? 1) - (order[b.status] ?? 1);
            });

            return (
              <div key={diseaseId}>
                {idx > 0 && <Separator className="mb-4" />}

                <div className="space-y-2.5">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    For {rec.diseaseName}:
                    <Badge variant="outline" className="text-[10px]">
                      {rec.insurers.filter((i) => i.status !== 'decline_likely').length}/{rec.insurers.length} insurers accept
                    </Badge>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {sorted.map((ins) => (
                      <motion.div
                        key={ins.insurerId}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: 0.05 }}
                        className={`flex items-start gap-2 p-2.5 rounded-lg border ${
                          ins.status === 'accepted'
                            ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20'
                            : ins.status === 'decline_likely'
                              ? 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20'
                              : 'border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-xs font-medium">{ins.insurerName}</span>
                            <StatusBadge status={ins.status} />
                          </div>
                          <p className="text-[10px] text-muted-foreground leading-tight">
                            {ins.note}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
