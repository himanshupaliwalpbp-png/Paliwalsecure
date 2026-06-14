import { Metadata } from "next";
import PageLayout from '@/components/PageLayout';
import { generatePageMetadata } from "@/lib/seo-utils";
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: "15 Insurance Mistakes That Cost You Lakhs | Paliwal Secure",
  description:
    "Don't make these 15 common insurance mistakes — from choosing wrong sum insured to ignoring room rent limits and co-pay. Each mistake can cost you ₹50,000 to ₹5,00,000. Expert advice by Himanshu Paliwal, IRDAI Certified Advisor.",
  slug: "/insurance-mistakes-to-avoid",
});

export default function InsuranceMistakesPage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
