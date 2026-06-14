'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AlertTriangle, Phone, FileText, Clock } from 'lucide-react';

interface ClaimTip {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface ClaimTipsProps {
  tips?: ClaimTip[];
  category?: string;
  insuranceType?: string;
  className?: string;
}

const defaultTips: ClaimTip[] = [
  {
    icon: <Phone className="h-5 w-5" />,
    title: 'Inform Insurer Within 24-48 Hours',
    description: 'Call the insurer helpline or use the app immediately. Delayed intimation can lead to claim rejection.',
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: 'Keep All Documents Ready',
    description: 'Policy copy, ID proof, hospital bills, discharge summary, FIR (for accidents), and photographs of damage.',
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: 'Choose Cashless Over Reimbursement',
    description: 'Cashless claims at network hospitals/garages mean zero upfront payment. Pre-approval typically comes in 2-4 hours.',
  },
  {
    icon: <AlertTriangle className="h-5 w-5" />,
    title: 'Don\'t Accept First Rejection',
    description: 'IRDAI mandates 30-day claim settlement. If rejected, ask for written reason and approach grievance cell or Insurance Ombudsman.',
  },
];

export function ClaimTips({ tips = defaultTips, category, insuranceType, className }: ClaimTipsProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Claim Filing Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tips.map((tip) => (
            <div key={tip.title} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="text-primary mt-0.5 shrink-0">{tip.icon}</div>
              <div>
                <p className="font-semibold text-sm">{tip.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-lg bg-primary/10 text-xs text-center">
          <span className="font-medium">Need claim help? </span>
          Call Paliwal Secure at <a href="tel:+919257877312" className="font-bold text-primary">+91 9257877312</a> — Free assistance for all policyholders.
        </div>
      </CardContent>
    </Card>
  );
}
