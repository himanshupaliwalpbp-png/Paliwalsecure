'use client';

import { generateOrganizationSchema, generatePersonSchema } from '@/lib/entity-seo/knowledge-graph';
import { generateEEATSignalsSchema } from '@/lib/entity-seo/eeat-signals';

/**
 * EntitySchema — Renders Organization + Person + E-E-A-T JSON-LD scripts
 * Injects structured data into every page for Google Knowledge Graph and AI entity recognition.
 */
export default function EntitySchema() {
  const organizationSchema = generateOrganizationSchema();
  const personSchema = generatePersonSchema();
  const eeatSchema = generateEEATSignalsSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eeatSchema),
        }}
      />
    </>
  );
}
