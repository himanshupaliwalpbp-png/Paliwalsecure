'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle2, type LucideIcon } from 'lucide-react';

interface SourcedFactProps {
  fact: string;
  source: string;
  icon?: LucideIcon;
  className?: string;
}

export function SourcedFact({ fact, source, icon: Icon = CheckCircle2, className }: SourcedFactProps) {
  return (
    <Card
      className={cn(
        'border-l-4 border-l-primary/60 bg-gradient-to-r from-primary/5 to-transparent',
        className,
      )}
      itemScope
      itemType="https://schema.org/Claim"
    >
      <CardContent className="p-3 sm:p-4 flex items-start gap-3">
        <Icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground leading-relaxed" itemProp="text">
            {fact}
          </p>
          <p
            className="text-xs text-muted-foreground mt-1.5"
            itemProp="citation"
            itemScope
            itemType="https://schema.org/CreativeWork"
          >
            <span itemProp="name">{source}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
