import type { Metadata } from 'next';
import FreeAuditClient from './FreeAuditClient';

export const metadata: Metadata = {
  title: 'Free Insurance Audit — Paliwal Secure AI',
  description: 'Upload your existing insurance policy and get a free AI-powered reverse audit. Find better plans, hidden savings, and coverage gaps. By IRDAI Registered POSP (IP429834).',
  keywords: ['insurance audit', 'reverse audit', 'free insurance review', 'policy comparison', 'save money insurance', 'insurance savings India'],
  alternates: {
    canonical: 'https://paliwalsecure.in/free-audit',
  },
};

export default function FreeAuditPage() {
  return <FreeAuditClient />;
}
