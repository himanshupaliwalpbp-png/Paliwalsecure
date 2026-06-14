'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Sparkles, ChevronDown, CheckCircle2, BookOpen } from 'lucide-react';

/**
 * AIOverviewOptimizer — GEO Component for Google AI Overviews
 *
 * Renders answer-first content optimized for Google AI Overviews,
 * Featured Snippets, and voice search.
 *
 * Features:
 * - Quick answer box (answer-first format for AI extraction)
 * - Key points list (structured for snippet eligibility)
 * - Source citations (trust signals for AI crawlers)
 * - Schema markup for SpeakableSpecification
 * - Microdata attributes for semantic extraction
 * - Collapsible "Read more" for detailed answer
 */

interface AIOverviewOptimizerProps {
  question: string;
  answer: string;
  keyPoints: string[];
  sources: string[];
  detailedAnswer?: string;
  className?: string;
}

export function AIOverviewOptimizer({
  question,
  answer,
  keyPoints,
  sources,
  detailedAnswer,
  className,
}: AIOverviewOptimizerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Build SpeakableSpecification schema
  const speakableSchema = {
    '@context': 'https://schema.org',
    '@type': 'SpeakableSpecification',
    cssSelector: [
      '.geo-quick-answer',
      '.geo-key-points',
    ],
    xpath: [
      '/html/body/main/section/div/div[@class="geo-quick-answer"]',
      '/html/body/main/section/div/div[@class="geo-key-points"]',
    ],
  };

  return (
    <>
      {/* SpeakableSpecification JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(speakableSchema),
        }}
      />

      <section
        itemScope
        itemType="https://schema.org/Question"
        className={cn('w-full', className)}
      >
        {/* Question — visible as H2 for semantic extraction */}
        <h2
          itemProp="name"
          className="text-xl sm:text-2xl font-bold text-foreground mb-4"
        >
          {question}
        </h2>

        {/* Key Takeaway Box — answer-first for AI Overviews */}
        <Card className="border-l-4 border-l-[#C98A1C] bg-gradient-to-br from-[#C98A1C]/5 to-[#E0A830]/10 dark:from-[#C98A1C]/10 dark:to-[#E0A830]/5 mb-4">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#C98A1C]/10">
                <Sparkles className="h-4 w-4 text-[#C98A1C]" />
              </div>
              <Badge
                variant="secondary"
                className="text-[10px] bg-[#C98A1C]/15 text-[#C98A1C] border-[#C98A1C]/30"
              >
                Key Takeaway
              </Badge>
            </div>

            <div
              className="geo-quick-answer"
              itemProp="acceptedAnswer"
              itemScope
              itemType="https://schema.org/Answer"
            >
              <p
                itemProp="text"
                className="text-sm sm:text-base text-foreground/90 leading-relaxed font-medium dark:text-white/90"
              >
                {answer}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Key Points List — structured for snippet eligibility */}
        {keyPoints.length > 0 && (
          <div className="geo-key-points mb-4" itemProp="suggestedAnswer" itemScope itemType="https://schema.org/Answer">
            <Card className="bg-background/60">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-sm font-bold text-foreground">
                    Key Points
                  </h3>
                </div>
                <ul className="space-y-2" itemProp="text">
                  {keyPoints.map((point, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-foreground/80"
                    >
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px] font-bold mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Source Citations — trust signals for AI crawlers */}
        {sources.length > 0 && (
          <div className="mb-4">
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Sources
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sources.map((source, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="text-[10px] font-normal"
                    >
                      {source}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Collapsible Detailed Answer */}
        {detailedAnswer && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#C98A1C] hover:bg-[#C98A1C]/10 gap-1"
              >
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform',
                    isOpen && 'rotate-180'
                  )}
                />
                {isOpen ? 'Show Less' : 'Read More — Detailed Answer'}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="mt-2 bg-muted/20">
                <CardContent className="p-4 sm:p-6">
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none text-foreground/80 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: detailedAnswer }}
                  />
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        )}
      </section>
    </>
  );
}
