import { Metadata } from "next";
import PageLayout from '@/components/PageLayout';
import { generatePageMetadata } from "@/lib/seo-utils";
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: "Best Health Insurance India 2026 – Detailed Comparison & Recommendations",
  description:
    "Detailed comparison of top 5 health insurance plans in India for 2026: Care Supreme, Niva Bupa ReAssure 2.0, HDFC ERGO Optima Secure, Star Health Comprehensive & ICICI Lombard Complete Health. Pros, cons, premium tables & personalized recommendations by Himanshu Paliwal, IRDAI Certified Advisor.",
  slug: "/best-health-insurance-india",
});

export default function BestHealthInsuranceIndiaPage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
