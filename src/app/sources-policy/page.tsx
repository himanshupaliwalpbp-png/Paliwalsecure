import type { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';

export const metadata: Metadata = {
  title: 'Sources Policy — Paliwal Secure',
  description: 'What sources Paliwal Secure uses and how we cite them.',
  alternates: { canonical: 'https://paliwalsecure.in/sources-policy' },
};

export default function PolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <BreadcrumbSchema items={[{ name: 'Home', url: 'https://paliwalsecure.in' }, { name: 'Sources Policy', url: 'https://paliwalsecure.in/sources-policy' }]} />
      <h1 className="text-3xl font-bold mb-6">Sources Policy</h1>
      <p className="text-slate-600 mb-4">Last updated: January 2026</p>
      <div className="prose prose-slate max-w-none">
        <p className="text-slate-700 leading-relaxed mb-4">Our primary sources: IRDAI Annual Report (claim settlement ratios, industry statistics), IRDAI Guidelines and Circulars (regulatory rules), Income Tax Act 1961 (tax rules — 80D, 80C, 10(10D)), Motor Vehicles Act 1988 (motor insurance mandates), Consumer Protection Act 2019 (liability rules), insurer websites (premium estimates, network hospitals, policy features), and DPDP Act 2023 (data protection). We cite sources at the bottom of every article. We do not fabricate statistics or invent IRDAI regulations. If a source is unavailable or outdated, we state "needs verification from official source."</p>
      </div>
    </div>
  );
}
