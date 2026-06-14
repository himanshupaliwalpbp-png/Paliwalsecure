import { Metadata } from "next";
import PageLayout from '@/components/PageLayout';
import { generatePageMetadata } from "@/lib/seo-utils";
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: "₹1 Crore Term Insurance — Is It Enough? 2026 | Paliwal Secure",
  description: "Is ₹1 Crore term insurance enough? Calculate how much cover you need, compare premiums from top insurers, and understand riders. Expert guide by Himanshu Paliwal, IRDAI Certified Advisor.",
  slug: "/1-crore-term-insurance",
});

export default function OneCroreTermInsurancePage() {
  return (<PageLayout><ClientContent /></PageLayout>);
}
