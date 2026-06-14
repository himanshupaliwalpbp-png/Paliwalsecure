import { Metadata } from 'next';
import SearchClientWrapper from './SearchClientWrapper';

// ✅ Prevent prerendering — this page is dynamic-only
// Using both force-dynamic AND revalidate = 0 for maximum Vercel safety
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Search Insurance Plans | Paliwal Secure AI',
  description: 'Search across vehicle insurance, health insurance by city/age/profession, insurer comparisons, and claim guides. Find the best insurance plan for you.',
  alternates: {
    canonical: 'https://paliwalsecure.in/search',
  },
  openGraph: {
    title: 'Search Insurance Plans | Paliwal Secure AI',
    description: 'Search across vehicle insurance, health insurance by city/age/profession, insurer comparisons, and claim guides.',
    url: 'https://paliwalsecure.in/search',
    siteName: 'Paliwal Secure AI',
    type: 'website',
  },
};

// JSON-LD schemas — static data only, no .toLocaleString() or dynamic values
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://paliwalsecure.in/#website-search',
  name: 'Paliwal Secure AI',
  url: 'https://paliwalsecure.in',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://paliwalsecure.in/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://paliwalsecure.in' },
    { '@type': 'ListItem', position: 2, name: 'Search', item: 'https://paliwalsecure.in/search' },
  ],
};

export default function SearchPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SearchClientWrapper />
    </>
  );
}
