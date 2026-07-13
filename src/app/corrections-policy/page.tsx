import type { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';

export const metadata: Metadata = {
  title: 'Corrections Policy — Paliwal Secure',
  description: 'How Paliwal Secure handles errors and corrections.',
  alternates: { canonical: 'https://paliwalsecure.in/corrections-policy' },
};

export default function PolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <BreadcrumbSchema items={[{ name: 'Home', url: 'https://paliwalsecure.in' }, { name: 'Corrections Policy', url: 'https://paliwalsecure.in/corrections-policy' }]} />
      <h1 className="text-3xl font-bold mb-6">Corrections Policy</h1>
      <p className="text-slate-600 mb-4">Last updated: January 2026</p>
      <div className="prose prose-slate max-w-none">
        <p className="text-slate-700 leading-relaxed mb-4">If we discover a factual error in our content, we correct it within 48 hours and add a correction notice at the bottom of the article with the date and description of the change. Users can report errors via email (himanshupaliwalpbp@gmail.com) or WhatsApp (+91-92587-77312). We take error reports seriously and verify all claims before making corrections. Significant corrections (wrong CSR, wrong tax rule, wrong premium) are prioritized immediately.</p>
      </div>
    </div>
  );
}
