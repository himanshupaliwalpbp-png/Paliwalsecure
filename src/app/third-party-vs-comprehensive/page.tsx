import { Metadata } from "next";
import PageLayout from '@/components/PageLayout';
import { generatePageMetadata } from "@/lib/seo-utils";
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: "Third Party vs Comprehensive Insurance — Which is Better? 2026 | Paliwal Secure",
  description: "Compare third party vs comprehensive car insurance — coverage, cost, pros and cons. Find out which type is best for your car. Expert guide by Himanshu Paliwal, IRDAI Certified Advisor.",
  slug: "/third-party-vs-comprehensive",
});

export default function ThirdPartyVsComprehensivePage() {
  return (<PageLayout><ClientContent /></PageLayout>);
}
