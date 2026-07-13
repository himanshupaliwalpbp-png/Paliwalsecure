import type { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';

export const metadata: Metadata = {
  title: 'Fact-Checking Policy — Paliwal Secure',
  description: 'How Paliwal Secure verifies insurance facts and data.',
  alternates: { canonical: 'https://paliwalsecure.in/fact-checking-policy' },
};

export default function PolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <BreadcrumbSchema items={[{ name: 'Home', url: 'https://paliwalsecure.in' }, { name: 'Fact-Checking Policy', url: 'https://paliwalsecure.in/fact-checking-policy' }]} />
      <h1 className="text-3xl font-bold mb-6">Fact-Checking Policy</h1>
      <p className="text-slate-600 mb-4">Last updated: January 2026</p>
      <div className="prose prose-slate max-w-none">
        <p className="text-slate-700 leading-relaxed mb-4">Every insurance fact in our content is verified against primary sources: IRDAI Annual Report (for CSR and industry data), insurer websites (for premium, network hospitals, policy features), Income Tax Act 1961 (for tax rules), Motor Vehicles Act 1988 (for motor insurance rules), and Consumer Protection Act 2019 (for liability rules). We do not publish unverified claims. If data varies by insurer, we state "varies by insurer and policy — verify policy wording." Premium estimates are marked as "indicative, ±15% variance."</p>
      </div>
    </div>
  );
}
