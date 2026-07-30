'use client';

import { Phone, ExternalLink, X } from 'lucide-react';

export type AlertType = 'claim_rejected' | 'claim_delayed' | 'mis_selling' | 'portability' | 'waiting_period';

interface ChatAlertProps {
  type: AlertType;
  onClose?: () => void;
}

const alertData: Record<AlertType, { title: string; message: string; actions: { label: string; link: string }[]; color: string }> = {
  claim_rejected: {
    title: '⚠️ Claim Rejected? You Have Rights!',
    message: 'IRDAI rules: After 5 continuous years (moratorium), no claim can be rejected for non-disclosure (except fraud). If rejected unfairly:',
    actions: [
      { label: 'File complaint on Bima Bharosa', link: 'https://bimabharosa.irda.gov.in' },
      { label: 'Contact Insurance Ombudsman (Free)', link: 'https://www.irdai.gov.in/omudsman' },
      { label: 'Call IRDAI helpline: bimabharosa.irda.gov.in', link: 'https://bimabharosa.irda.gov.in' },
    ],
    color: 'red',
  },
  claim_delayed: {
    title: '⏳ Claim Delayed? Insurer Must Pay Penalty',
    message: "IRDAI mandates: Cashless pre-authorisation within 1 hour, discharge within 3 hours, final settlement within 30 days. Delays attract penalty from shareholders' funds.",
    actions: [
      { label: 'Escalate to IRDAI', link: 'https://bimabharosa.irda.gov.in' },
      { label: 'Know your timelines', link: '#policyholder-rights' },
    ],
    color: 'orange',
  },
  mis_selling: {
    title: '🚨 Mis-selling Alert! Know Your Rights',
    message: "Banks earn high commissions (HDFC Bank ₹6,467 Cr in FY24). Don't buy under pressure. Use free-look period (15-30 days) to cancel.",
    actions: [
      { label: 'Read Mis-selling Guide', link: '#mis-selling' },
      { label: 'Complaint Portal', link: 'https://bimabharosa.irda.gov.in' },
    ],
    color: 'amber',
  },
  portability: {
    title: '🔄 Port Your Policy, Keep Benefits!',
    message: 'You can switch insurers without losing waiting period credit or no-claim bonus. New insurer cannot impose fresh waiting for existing conditions.',
    actions: [
      { label: 'How to Port?', link: '#knowledge-base' },
      { label: 'IRDAI Portability Rules', link: '#policyholder-rights' },
    ],
    color: 'blue',
  },
  waiting_period: {
    title: '⏱️ PED Waiting Period Explained',
    message: 'IRDAI has capped PED waiting period at 3 years (max). Many plans offer day-1 coverage for diabetes/BP. Ask your insurer for details.',
    actions: [
      { label: 'Compare PED Waiting Periods', link: '#plan-compare' },
      { label: 'Insurer-wise PED Data', link: '#claims-dashboard' },
    ],
    color: 'purple',
  },
};

const colorClasses: Record<string, { border: string; bg: string; title: string; text: string }> = {
  red: {
    border: 'border-red-500',
    bg: 'bg-red-50 dark:bg-red-950/30',
    title: 'text-red-700 dark:text-red-300',
    text: 'text-red-600 dark:text-red-400',
  },
  orange: {
    border: 'border-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    title: 'text-orange-700 dark:text-orange-300',
    text: 'text-orange-600 dark:text-orange-400',
  },
  amber: {
    border: 'border-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    title: 'text-amber-700 dark:text-amber-300',
    text: 'text-amber-600 dark:text-amber-400',
  },
  blue: {
    border: 'border-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    title: 'text-blue-700 dark:text-blue-300',
    text: 'text-blue-600 dark:text-blue-400',
  },
  purple: {
    border: 'border-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    title: 'text-purple-700 dark:text-purple-300',
    text: 'text-purple-600 dark:text-purple-400',
  },
};

// ── Keyword-to-Alert mapping for detection ────────────────────────────────
export const keywordAlertMap: { keywords: string[]; alertType: AlertType }[] = [
  { keywords: ['claim rejected', 'reject claim', 'claim deny', 'denied', 'claim repudiated', 'claim nahi mila', 'paisa nahi mila', 'company ne mana'], alertType: 'claim_rejected' },
  { keywords: ['claim delay', 'delayed', 'late claim', 'pending claim', 'claim pending', 'claim late', 'claim nahi aaya'], alertType: 'claim_delayed' },
  { keywords: ['mis sell', 'missell', 'mis-selling', 'bank sold', 'agent pressure', 'commission', 'forcefully sold', 'bina mangwaya', 'zaroori nahi tha'], alertType: 'mis_selling' },
  { keywords: ['portability', 'switch insurer', 'change company', 'port policy', 'insurer badalna', 'company change'], alertType: 'portability' },
  { keywords: ['waiting period', 'ped waiting', 'pre existing waiting', 'diabetes waiting', 'bp waiting', 'waiting khatam', 'intzaar'], alertType: 'waiting_period' },
];

export function detectAlertType(userMessage: string): AlertType | null {
  const lowerMsg = userMessage.toLowerCase();
  for (const item of keywordAlertMap) {
    if (item.keywords.some(keyword => lowerMsg.includes(keyword))) {
      return item.alertType;
    }
  }
  return null;
}

export default function ChatAlert({ type, onClose }: ChatAlertProps) {
  const alert = alertData[type];
  const colors = colorClasses[alert.color];

  return (
    <div className={`border-l-4 rounded-lg p-3 my-2 ${colors.border} ${colors.bg} shadow-sm`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className={`font-bold text-xs sm:text-sm mb-1 ${colors.title}`}>{alert.title}</h4>
          <p className="text-[11px] sm:text-xs text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">{alert.message}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {alert.actions.map((action, idx) => (
              <a
                key={idx}
                href={action.link}
                target={action.link.startsWith('http') ? '_blank' : undefined}
                rel={action.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="text-[10px] sm:text-xs bg-white/80 dark:bg-gray-800/80 px-2.5 py-1 rounded-full flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
              >
                {action.link.startsWith('tel') ? (
                  <Phone className="h-3 w-3 shrink-0" />
                ) : (
                  <ExternalLink className="h-3 w-3 shrink-0" />
                )}
                {action.label}
              </a>
            ))}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm ml-2 shrink-0"
            aria-label="Close alert"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
