'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Quote, BookOpen, Shield, FileText } from 'lucide-react';

type CitationType = 'statistic' | 'regulation' | 'guideline';

interface AICitationBlockProps {
  content: string;
  source: string;
  type?: CitationType;
  className?: string;
}

const typeConfig: Record<CitationType, {
  icon: React.ElementType;
  label: string;
  borderColor: string;
  bgColor: string;
  badgeVariant: string;
  iconColor: string;
}> = {
  statistic: {
    icon: BookOpen,
    label: 'Data Point',
    borderColor: 'border-emerald-300 dark:border-emerald-800',
    bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/10',
    badgeVariant: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  regulation: {
    icon: Shield,
    label: 'Regulation',
    borderColor: 'border-blue-300 dark:border-blue-800',
    bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10',
    badgeVariant: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  guideline: {
    icon: FileText,
    label: 'Guideline',
    borderColor: 'border-amber-300 dark:border-amber-800',
    bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10',
    badgeVariant: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
};

export function AICitationBlock({
  content,
  source,
  type = 'statistic',
  className,
}: AICitationBlockProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <Card
      className={cn(
        config.borderColor,
        config.bgColor,
        'overflow-hidden',
        className,
      )}
      itemScope
      itemType={type === 'regulation' ? 'https://schema.org/Legislation' : 'https://schema.org/CreativeWork'}
    >
      <CardContent className="p-4 sm:p-6">
        {/* Header with type badge and icon */}
        <div className="flex items-center gap-2 mb-3">
          <Icon className={cn('h-4 w-4', config.iconColor)} />
          <Badge className={cn('text-xs font-medium', config.badgeVariant)} variant="secondary">
            {config.label}
          </Badge>
        </div>

        {/* Quoted content with microdata */}
        <blockquote
          className="text-sm leading-relaxed text-foreground/90 border-l-3 pl-4"
          style={{ borderLeftColor: 'currentColor' }}
          itemProp="text"
        >
          <Quote className="h-3 w-3 opacity-30 mb-1" />
          {content}
        </blockquote>

        {/* Source attribution with microdata */}
        <div
          className="flex items-center gap-2 mt-4 pt-3 border-t border-foreground/10"
          itemProp="citation"
          itemScope
          itemType="https://schema.org/CreativeWork"
        >
          <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
          <p className="text-xs text-muted-foreground" itemProp="name">
            Source: {source}
          </p>
          <meta itemProp="url" content="https://paliwalsecure.in" />
        </div>
      </CardContent>
    </Card>
  );
}
