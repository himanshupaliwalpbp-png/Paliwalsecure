import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import ClientContent from './ClientContent';

export const metadata: Metadata = {
  title: 'Insurance News Hub — IRDAI Updates, GST Changes & Regulation News 2025 | Paliwal Secure',
  description: 'Latest insurance news India 2025. IRDAI regulation updates, GST on health insurance, medical inflation impact, TP rate revisions, and policyholder rights. Expert analysis by IRDAI-certified advisor Himanshu Paliwal (POSP IP429834).',
  keywords: ['insurance news india', 'irdai news 2025', 'gst on health insurance', 'insurance regulation india', 'irdai updates', 'medical inflation india'],
  alternates: { canonical: 'https://paliwalsecure.in/hub/news' },
  openGraph: {
    title: 'Insurance News Hub — IRDAI Updates, GST Changes & Regulation News 2025',
    description: 'Latest insurance news India 2025. IRDAI regulation updates, GST on health insurance, medical inflation, and policyholder rights.',
    url: 'https://paliwalsecure.in/hub/news',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Article', '@id': 'https://paliwalsecure.in/hub/news#article', headline: 'Insurance News Hub — IRDAI Updates & Regulation News 2025', description: 'Latest insurance news India 2025. IRDAI regulation updates, GST on health insurance, medical inflation, and policyholder rights.', author: { '@type': 'Person', name: 'Himanshu Paliwal' }, publisher: { '@type': 'Organization', name: 'Paliwal Secure AI' }, dateModified: '2025-07-01', mainEntityOfPage: 'https://paliwalsecure.in/hub/news' },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://paliwalsecure.in' }, { '@type': 'ListItem', position: 2, name: 'Insurance News Hub', item: 'https://paliwalsecure.in/hub/news' }] },
  ],
};

export default function InsuranceNewsHubPage() {
  return (
    <PageLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ClientContent />
    </PageLayout>
  );
}
