'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Zap } from 'lucide-react';

interface MetricItem {
  label: string;
  value: string;
  highlight?: boolean;
}

interface QuickAnswerBoxProps {
  title: string;
  answer?: string;
  summary?: string; // alias for answer
  bestOption?: string;
  costRange?: string;
  keyTip?: string;
  answers?: MetricItem[]; // alternative: pass metrics directly
  vehicle?: { brand: string; name: string; year: number; isEV: boolean };
  className?: string;
}

export function QuickAnswerBox({ title, answer, summary, bestOption, costRange, keyTip, answers, vehicle, className }: QuickAnswerBoxProps) {
  const displayAnswer = answer || summary || '';
  
  // Build metrics from either `answers` array or individual props
  const metrics: MetricItem[] = answers && answers.length > 0
    ? answers
    : [
        bestOption ? { label: 'Best Option', value: bestOption, highlight: false } : null,
        costRange ? { label: 'Cost Range', value: costRange, highlight: true } : null,
        keyTip ? { label: 'Key Tip', value: keyTip, highlight: false } : null,
      ].filter(Boolean) as MetricItem[];

  return (
    <Card className={cn('border-l-4 border-l-[#C98A1C] bg-gradient-to-br from-[#C98A1C]/5 to-[#E0A830]/10 dark:from-[#C98A1C]/10 dark:to-[#E0A830]/5', className)}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#C98A1C]/10">
            <Zap className="h-4 w-4 text-[#C98A1C]" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#C98A1C]">{title}</h2>
          <Badge variant="secondary" className="ml-auto text-[10px] bg-[#C98A1C]/15 text-[#C98A1C] border-[#C98A1C]/30">⚡ Key Takeaway</Badge>
        </div>
        
        {vehicle && (
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="text-[10px]">
              {vehicle.year} {vehicle.brand} {vehicle.name}
            </Badge>
            {vehicle.isEV && (
              <Badge className="text-[10px] bg-green-100 text-green-700 border-green-200">Electric</Badge>
            )}
          </div>
        )}

        {displayAnswer && (
          <p className="text-sm text-foreground/90 leading-relaxed mb-4">{displayAnswer}</p>
        )}
        
        {metrics.length > 0 && (
          <div className={cn(
            "grid gap-3",
            metrics.length <= 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-4"
          )}>
            {metrics.map((m) => (
              <div key={m.label} className="text-center p-3 rounded-lg bg-background/60">
                <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">{m.label}</p>
                <p className={cn(
                  'text-sm font-bold',
                  m.highlight ? 'text-primary' : 'text-foreground'
                )}>
                  {m.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
