import { Metadata } from "next";
import PageLayout from '@/components/PageLayout';
import { generatePageMetadata } from "@/lib/seo-utils";
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: "Top 10 Health Insurance Mistakes to Avoid in 2026 | Paliwal Secure",
  description: "Avoid these 10 critical health insurance mistakes — from choosing wrong sum insured to ignoring waiting periods and co-pay. Each mistake costs ₹50K-5L. By Himanshu Paliwal, IRDAI Certified Advisor.",
  slug: "/health-insurance-mistakes",
});

export default function HealthInsuranceMistakesPage() {
  return (<PageLayout><ClientContent /></PageLayout>);
}
