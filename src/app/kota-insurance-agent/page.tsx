import { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import ClientContent from './ClientContent';

export const metadata: Metadata = {
  title: 'Insurance Agent in Kota — Best Health, Motor & Life Insurance Advisor | Paliwal Secure AI',
  description:
    'Trusted insurance advisor in Kota, Rajasthan. Compare 51+ insurers, get free consultation. By Himanshu Paliwal — IRDAI Registered POSP (IP429834). Near MBS Hospital, Kota. Call 9257877312.',
  keywords: [
    'insurance agent Kota',
    'insurance advisor Kota Rajasthan',
    'health insurance Kota',
    'car insurance Kota',
    'term insurance Kota',
    'IRDAI POSP Kota',
    'insurance consultant near me Kota',
    'best health insurance advisor Kota',
    'motor insurance Kota Rajasthan',
    'life insurance agent Kota',
    'travel insurance Kota',
    'insurance comparison Kota',
    'cashless hospital Kota',
    'insurance agent near MBS Hospital Kota',
    'IRDAI certified insurance advisor Kota',
  ],
  alternates: {
    canonical: 'https://paliwalsecure.in/kota-insurance-agent',
  },
  openGraph: {
    title: 'Insurance Agent in Kota — Best Health, Motor & Life Insurance Advisor | Paliwal Secure AI',
    description:
      'Trusted insurance advisor in Kota, Rajasthan. Compare 51+ insurers, get free consultation. IRDAI Registered POSP (IP429834). Call 9257877312.',
    url: 'https://paliwalsecure.in/kota-insurance-agent',
    siteName: 'Paliwal Secure AI',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insurance Agent in Kota — Paliwal Secure AI',
    description:
      'Trusted insurance advisor in Kota, Rajasthan. IRDAI Registered POSP (IP429834). Free consultation. Call 9257877312.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function KotaInsuranceAgentPage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
