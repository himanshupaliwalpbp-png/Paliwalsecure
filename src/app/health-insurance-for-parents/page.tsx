import { Metadata } from "next";
import PageLayout from '@/components/PageLayout';
import { generatePageMetadata } from "@/lib/seo-utils";
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: "Best Health Insurance for Parents in India 2026 | Paliwal Secure",
  description: "Compare the best health insurance plans for parents in India — covering pre-existing diseases, senior citizens, low waiting periods, and cashless hospitals. By Himanshu Paliwal, IRDAI Certified Advisor.",
  slug: "/health-insurance-for-parents",
});

export default function HealthInsuranceForParentsPage() {
  return (<PageLayout><ClientContent /></PageLayout>);
}
