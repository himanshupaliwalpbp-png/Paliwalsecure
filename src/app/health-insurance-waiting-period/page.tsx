import { Metadata } from "next";
import PageLayout from '@/components/PageLayout';
import { generatePageMetadata } from "@/lib/seo-utils";
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: "Health Insurance Waiting Period Explained 2026 | Paliwal Secure",
  description:
    "Complete guide to health insurance waiting periods — initial, pre-existing disease, maternity, and disease-specific waiting periods. How to reduce waiting periods and which plans have the shortest waits. By Himanshu Paliwal, IRDAI Certified Advisor.",
  slug: "/health-insurance-waiting-period",
});

export default function WaitingPeriodPage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
