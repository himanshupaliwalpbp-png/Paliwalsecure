import { Metadata } from "next";
import PageLayout from '@/components/PageLayout';
import { generatePageMetadata } from "@/lib/seo-utils";
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: "Family Floater vs Individual Health Insurance 2026 | Paliwal Secure",
  description: "Should you buy family floater or individual health insurance? Compare pros, cons, premiums, and claim scenarios. Expert guide by Himanshu Paliwal, IRDAI Certified Advisor.",
  slug: "/family-floater-vs-individual-health-insurance",
});

export default function FamilyFloaterVsIndividualPage() {
  return (<PageLayout><ClientContent /></PageLayout>);
}
