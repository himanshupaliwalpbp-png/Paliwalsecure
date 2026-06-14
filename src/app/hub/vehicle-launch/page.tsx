import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import ClientContent from './ClientContent';

export const metadata: Metadata = {
  title: 'Vehicle Launch Hub 2025 — New Car, Bike & EV Insurance Guide | Paliwal Secure',
  description: 'New vehicle insurance guide 2025 — Maruti Swift, Hyundai Creta, Tata Nexon, Ola Electric, Ather 450X, Mahindra BE 6. Compare insurance for newly launched vehicles in India. IRDAI-certified advisor Himanshu Paliwal (POSP IP429834).',
  keywords: [
    'vehicle launch hub', 'new car insurance 2025', 'new bike insurance', 'ev insurance india',
    'tata nexon insurance', 'hyundai creta insurance', 'maruti swift insurance',
    'ola electric insurance', 'ather 450x insurance', 'mahindra be 6 insurance',
    'ev scooter insurance', 'new vehicle insurance quotes',
  ],
  alternates: { canonical: 'https://paliwalsecure.in/hub/vehicle-launch' },
  openGraph: {
    title: 'Vehicle Launch Hub 2025 — New Car, Bike & EV Insurance Guide',
    description: 'Insurance for newly launched vehicles in India. Cars, bikes, and EVs — premium calculator, add-on guide, and insurer comparison.',
    url: 'https://paliwalsecure.in/hub/vehicle-launch',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://paliwalsecure.in/hub/vehicle-launch#article',
      headline: 'Vehicle Launch Hub 2025 — New Car, Bike & EV Insurance Guide',
      description: 'Insurance for newly launched vehicles in India. Cars, bikes, and EVs — premium calculator, add-on guide, and insurer comparison.',
      author: { '@type': 'Person', name: 'Himanshu Paliwal' },
      publisher: { '@type': 'Organization', name: 'Paliwal Secure AI' },
      dateModified: '2025-07-01',
      mainEntityOfPage: 'https://paliwalsecure.in/hub/vehicle-launch',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://paliwalsecure.in' },
        { '@type': 'ListItem', position: 2, name: 'Vehicle Launch Hub', item: 'https://paliwalsecure.in/hub/vehicle-launch' },
      ],
    },
  ],
};

export default function VehicleLaunchHubPage() {
  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ClientContent />
    </PageLayout>
  );
}
