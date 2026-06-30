import type { Metadata } from 'next';
import CalculatorHubClient from './CalculatorHubClient';

// ────────────────────────────────────────────────────────────────────────────
// SEO Metadata — `/calculators` hub page
// Target keywords: insurance calculator india, premium calculator, health
// insurance premium calculator, term insurance calculator, car insurance
// calculator, tax savings calculator 80D, claim settlement predictor
// ────────────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Insurance Calculators India 2026 | Premium, Tax, Claim & IDV — Paliwal Secure',
  description:
    'Free, accurate insurance calculators for Indians. Health insurance premium calculator, motor insurance calculator, term life calculator, Section 80D tax savings calculator, and claim settlement predictor. Real-time data, IRDAI-verified. By IRDAI POSP IP429834.',
  keywords: [
    'insurance calculator india',
    'health insurance premium calculator',
    'motor insurance calculator',
    'car insurance calculator',
    'bike insurance calculator',
    'term insurance calculator',
    'life insurance premium calculator',
    'tax savings calculator 80D',
    'Section 80D calculator',
    'claim settlement ratio calculator',
    'IDV calculator',
    'insurance premium estimator india',
    'Paliwal Secure calculator',
    'InsureGPT calculator',
    'IRDAI POSP IP429834',
  ],
  alternates: {
    canonical: 'https://paliwalsecure.in/calculators',
  },
  openGraph: {
    title: 'Insurance Calculators India 2026 — Paliwal Secure',
    description:
      'Free, accurate insurance calculators. Health, Motor, Term Life, Tax Savings (80D), Claim Settlement Predictor. Real-time data, IRDAI-verified.',
    url: 'https://paliwalsecure.in/calculators',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insurance Calculators India — Paliwal Secure',
    description: 'Free, accurate insurance calculators. Real-time data, IRDAI-verified.',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
};

export default function CalculatorsPage() {
  return <CalculatorHubClient />;
}
