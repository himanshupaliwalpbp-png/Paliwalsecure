import React from 'react';

/**
 * AIReadableContent — Structured Content Wrapper for AI Overviews
 *
 * Wraps insurance content with semantic HTML and structured data markers
 * that help LLMs and AI Overviews parse and cite our content.
 *
 * Features:
 * - Proper semantic HTML (article, section, aside, header, footer)
 * - data-* attributes for AI parsing (data-content-type, data-topic, etc.)
 * - Proper heading hierarchy enforcement
 * - <dfn> tags for key insurance definitions
 * - <aside> for related/supplementary content
 * - <mark> for highlighted key information
 * - Schema.org compatible structure
 *
 * Usage:
 * ```tsx
 * <AIReadableContent topic="health-insurance" contentType="guide">
 *   <AIReadableSection title="What is Health Insurance?">
 *     <AIDefinition term="Health Insurance">...</AIDefinition>
 *   </AIReadableSection>
 * </AIReadableContent>
 * ```
 */

// ============================================================================
// Main Content Wrapper
// ============================================================================

interface AIReadableContentProps {
  children: React.ReactNode;
  topic: string;
  contentType: 'guide' | 'comparison' | 'faq' | 'definition' | 'article' | 'tool';
  keywords?: string[];
  className?: string;
}

export function AIReadableContent({
  children,
  topic,
  contentType,
  keywords,
  className = '',
}: AIReadableContentProps) {
  return (
    <article
      data-content-type={contentType}
      data-topic={topic}
      data-keywords={keywords?.join(',')}
      itemScope
      itemType="https://schema.org/Article"
      className={className}
    >
      {children}
    </article>
  );
}

// ============================================================================
// Section Wrapper
// ============================================================================

interface AIReadableSectionProps {
  children: React.ReactNode;
  title: string;
  headingLevel?: 'h2' | 'h3' | 'h4';
  sectionType?: 'main' | 'sidebar' | 'summary' | 'cta' | 'definition' | 'comparison';
  className?: string;
}

export function AIReadableSection({
  children,
  title,
  headingLevel = 'h2',
  sectionType = 'main',
  className = '',
}: AIReadableSectionProps) {
  const HeadingTag = headingLevel;

  if (sectionType === 'sidebar') {
    return (
      <aside
        data-section-type={sectionType}
        data-section-title={title}
        className={className}
        aria-label={title}
      >
        <HeadingTag className="sr-only">{title}</HeadingTag>
        {children}
      </aside>
    );
  }

  return (
    <section
      data-section-type={sectionType}
      data-section-title={title}
      className={className}
      aria-labelledby={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <HeadingTag
        id={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}
        className="sr-only"
      >
        {title}
      </HeadingTag>
      {children}
    </section>
  );
}

// ============================================================================
// Definition Component — Marks key insurance terms
// ============================================================================

interface AIDefinitionProps {
  term: string;
  children: React.ReactNode;
  className?: string;
}

export function AIDefinition({ term, children, className = '' }: AIDefinitionProps) {
  return (
    <span className={className}>
      <dfn
        title={term}
        data-term={term}
        data-definition-type="insurance"
        className="font-semibold text-foreground not-italic"
      >
        {term}
      </dfn>
      <span data-definition-of={term}>{children}</span>
    </span>
  );
}

// ============================================================================
// Key Fact / Highlight Component
// ============================================================================

interface AIKeyFactProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function AIKeyFact({ label, children, className = '' }: AIKeyFactProps) {
  return (
    <div
      data-fact-type={label}
      className={className}
      role="note"
      aria-label={`Key fact: ${label}`}
    >
      <mark
        data-highlight="key-fact"
        className="bg-amber-100 dark:bg-amber-900/30 text-foreground px-1 rounded"
      >
        {children}
      </mark>
    </div>
  );
}

// ============================================================================
// Comparison Table Component
// ============================================================================

interface AIComparisonProps {
  title: string;
  items: { name: string; values: Record<string, string | number> }[];
  columns: string[];
  className?: string;
}

export function AIComparison({ title, items, columns, className = '' }: AIComparisonProps) {
  return (
    <div
      data-content-type="comparison"
      data-comparison-topic={title}
      className={className}
    >
      <table
        role="table"
        aria-label={`Comparison: ${title}`}
        className="w-full text-sm"
      >
        <thead>
          <tr>
            <th scope="col" className="text-left p-2 font-semibold">Feature</th>
            {items.map((item) => (
              <th key={item.name} scope="col" className="text-left p-2 font-semibold">
                {item.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {columns.map((col) => (
            <tr key={col} data-comparison-feature={col}>
              <td className="p-2 font-medium text-muted-foreground">{col}</td>
              {items.map((item) => (
                <td key={`${item.name}-${col}`} className="p-2">
                  {item.values[col] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// FAQ Component — Structured for AI parsing
// ============================================================================

interface AIFAQProps {
  question: string;
  answer: string;
  className?: string;
}

export function AIFAQ({ question, answer, className = '' }: AIFAQProps) {
  return (
    <div
      data-content-type="faq"
      data-question={question}
      className={className}
      itemScope
      itemProp="mainEntity"
      itemType="https://schema.org/Question"
    >
      <h3 itemProp="name" className="font-semibold text-foreground">
        {question}
      </h3>
      <div
        itemScope
        itemProp="acceptedAnswer"
        itemType="https://schema.org/Answer"
      >
        <div itemProp="text" className="text-muted-foreground text-sm mt-1">
          {answer}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// List Component — Structured for AI parsing
// ============================================================================

interface AIListProps {
  title: string;
  items: string[];
  ordered?: boolean;
  className?: string;
}

export function AIList({ title, items, ordered = false, className = '' }: AIListProps) {
  const Tag = ordered ? 'ol' : 'ul';

  return (
    <div data-list-topic={title} className={className}>
      <Tag
        className="space-y-1.5"
        role="list"
        aria-label={title}
      >
        {items.map((item, index) => (
          <li
            key={index}
            data-list-item={item}
            role="listitem"
            className="text-sm text-muted-foreground"
          >
            {item}
          </li>
        ))}
      </Tag>
    </div>
  );
}
