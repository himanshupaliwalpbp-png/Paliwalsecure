import { Metadata } from "next";
import PageLayout from '@/components/PageLayout';
import { generatePageMetadata } from "@/lib/seo-utils";
import ClientContent from './ClientContent';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';

export const metadata: Metadata = generatePageMetadata({
  title: "NCB Meaning — No Claim Bonus Explained 2026 | Paliwal Secure",
  description: "What is NCB (No Claim Bonus) in insurance? How it works, NCB rates, how to protect NCB, and how much you save. Complete guide by Himanshu Paliwal, IRDAI Certified Advisor.",
  slug: "/ncb-meaning",
});

export default function NCBMeaningPage() {
  return (<PageLayout><ClientContent /></PageLayout>);
}
