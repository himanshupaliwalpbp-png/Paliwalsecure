'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Lightbulb, MessageCircle } from 'lucide-react';

interface ExpertInsightProps {
  insight: string;
  author?: string;
  title?: string;
  topic?: string;
  className?: string;
}

export function ExpertInsight({
  insight,
  author = 'Himanshu Paliwal, IRDAI Certified Advisor',
  title,
  topic,
  className,
}: ExpertInsightProps) {
  const displayTitle = title || topic || 'Expert Insight';
  return (
    <Card className={cn('border-amber-200 dark:border-amber-900/50 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10', className)}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <h3 className="font-bold text-amber-900 dark:text-amber-200">{displayTitle}</h3>
        </div>
        <blockquote className="text-sm text-foreground/90 leading-relaxed border-l-3 border-amber-400 pl-4">
          &ldquo;{insight}&rdquo;
        </blockquote>
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-amber-200/50 dark:border-amber-800/30">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
            HP
          </div>
          <div>
            <p className="text-xs font-semibold">{author}</p>
            <p className="text-xs text-muted-foreground">POSP Code: IP429834</p>
          </div>
          <a
            href="https://wa.me/919257877312"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1 text-xs font-medium text-green-600 hover:text-green-700"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
