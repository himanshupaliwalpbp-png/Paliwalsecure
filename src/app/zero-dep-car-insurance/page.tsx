import { Metadata } from "next";
import PageLayout from '@/components/PageLayout';
import { generatePageMetadata } from "@/lib/seo-utils";
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: "Zero Depreciation Car Insurance in India | Complete Guide 2025",
  description:
    "Understand zero depreciation car insurance (bumper-to-bumper cover). Compare plans from top insurers, learn claim process, and see how zero dep saves you ₹50,000+ on claims. Expert advice by Himanshu Paliwal.",
  slug: "/zero-dep-car-insurance",
});

export default function ZeroDepCarInsurancePage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
