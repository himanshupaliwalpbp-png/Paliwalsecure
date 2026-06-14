'use client';

import { cn } from '@/lib/utils';

interface DefinedTermProps {
  term: string;
  definition: string;
  className?: string;
}

export function DefinedTerm({ term, definition, className }: DefinedTermProps) {
  return (
    <span
      className={cn('inline-flex items-baseline gap-1', className)}
      itemScope
      itemType="https://schema.org/DefinedTerm"
    >
      <dfn
        className="font-semibold not-italic bg-primary/10 text-primary px-1.5 py-0.5 rounded text-sm"
        itemProp="name"
        title={definition}
      >
        {term}
      </dfn>
      <span className="text-sm text-muted-foreground" itemProp="description">
        — {definition}
      </span>
      <meta itemProp="inDefinedTermSet" content="https://paliwalsecure.com/insurance-glossary" />
    </span>
  );
}
