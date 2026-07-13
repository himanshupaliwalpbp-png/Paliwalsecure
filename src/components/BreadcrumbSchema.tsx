import { generateBreadcrumbSchema, BREADCRUMB_PATHS } from '@/lib/breadcrumb-schema';

/**
 * BreadcrumbSchema component — emits BreadcrumbList JSON-LD.
 *
 * Usage in any page:
 * <BreadcrumbSchema path="/health-insurance" />
 *
 * Or with custom items:
 * <BreadcrumbSchema items={[{ name: 'Home', url: '...' }, { name: 'Page', url: '...' }]} />
 *
 * If the path is not in BREADCRUMB_PATHS, pass custom items.
 * If neither path nor items match, renders nothing (no empty schema).
 */

interface BreadcrumbSchemaProps {
  /** Pre-defined path key from BREADCRUMB_PATHS (e.g., "/health-insurance") */
  path?: string;
  /** Custom breadcrumb items (overrides path) */
  items?: Array<{ name: string; url: string }>;
}

export function BreadcrumbSchema({ path, items }: BreadcrumbSchemaProps) {
  let breadcrumbItems = items;

  if (!breadcrumbItems && path) {
    breadcrumbItems = BREADCRUMB_PATHS[path];
  }

  if (!breadcrumbItems || breadcrumbItems.length === 0) {
    return null; // No breadcrumb to emit
  }

  const schema = generateBreadcrumbSchema(breadcrumbItems);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
