import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import ClientContent from './ClientContent';

export const metadata: Metadata = {
  title: 'Insurance Glossary Hub — Terms Explained (IDV, NCB, CSR, PED) Hindi/English | Paliwal Secure',
  description: 'Complete insurance glossary in Hindi, English & Hinglish. 30+ terms explained: IDV, NCB, PED, CSR, ICR, copay, Zero Dep, TP, OD, and more. By IRDAI-certified advisor Himanshu Paliwal (POSP IP429834).',
  keywords: ['insurance glossary', 'insurance terms hindi', 'idv full form', 'ncb meaning', 'ped insurance meaning'],
  alternates: { canonical: 'https://paliwalsecure.in/hub/glossary' },
  openGraph: { title: 'Insurance Glossary Hub — Terms Explained in Hindi/English/Hinglish', description: 'Complete insurance glossary: IDV, NCB, PED, CSR, ICR, copay, Zero Dep, and 30+ more terms explained in simple language.', url: 'https://paliwalsecure.in/hub/glossary', type: 'website' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Article', '@id': 'https://paliwalsecure.in/hub/glossary#article', headline: 'Insurance Glossary Hub — Terms Explained (IDV, NCB, CSR, PED)', description: 'Complete insurance glossary in Hindi, English & Hinglish.', author: { '@type': 'Person', name: 'Himanshu Paliwal' }, publisher: { '@type': 'Organization', name: 'Paliwal Secure AI' }, dateModified: '2025-07-01', mainEntityOfPage: 'https://paliwalsecure.in/hub/glossary' },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://paliwalsecure.in' }, { '@type': 'ListItem', position: 2, name: 'Insurance Glossary Hub', item: 'https://paliwalsecure.in/hub/glossary' }] },
  ],
};

export default function GlossaryHubPage() {
  return (
    <PageLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ClientContent />
    </PageLayout>
  );
}
