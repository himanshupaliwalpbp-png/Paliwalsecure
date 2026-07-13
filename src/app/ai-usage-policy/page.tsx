import type { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';

export const metadata: Metadata = {
  title: 'AI Usage Policy — Paliwal Secure',
  description: 'How Paliwal Secure uses AI in content and tools.',
  alternates: { canonical: 'https://paliwalsecure.in/ai-usage-policy' },
};

export default function PolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <BreadcrumbSchema items={[{ name: 'Home', url: 'https://paliwalsecure.in' }, { name: 'AI Usage Policy', url: 'https://paliwalsecure.in/ai-usage-policy' }]} />
      <h1 className="text-3xl font-bold mb-6">AI Usage Policy</h1>
      <p className="text-slate-600 mb-4">Last updated: January 2026</p>
      <div className="prose prose-slate max-w-none">
        <p className="text-slate-700 leading-relaxed mb-4">Paliwal Secure uses AI (InsureGPT) for: (1) answering user insurance questions via chatbot — all AI responses are based on verified IRDAI data, (2) generating article drafts — every AI-assisted draft is reviewed and verified by Himanshu Paliwal (IRDAI POSP IP429834) before publication, (3) PII redaction — user phone numbers, emails, Aadhaar, and PAN are redacted before sending to AI models. We do NOT use AI to generate fake reviews, fake ratings, or fake testimonials. We do NOT use AI to create content without human review. All AI-generated content is clearly marked or reviewed by a human expert. Our AI tools (protection score, compare, claim guidance, policy audit) use rule-based logic — not generative AI — for factual outputs.</p>
      </div>
    </div>
  );
}
