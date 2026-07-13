import { Metadata } from "next";
import PageLayout from '@/components/PageLayout';
import { generatePageMetadata } from "@/lib/seo-utils";
import ClientContent from './ClientContent';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';

export const metadata: Metadata = generatePageMetadata({
  title: "Policyholder Rights – IRDAI Regulations, Grievance Redressal & Timelines",
  description:
    "Know your insurance rights under IRDAI regulations. Free-look period, moratorium, portability, claim timelines, grievance redressal process, and key regulations for policyholders in India.",
  slug: "/policyholder-rights",
});

export default function PolicyholderRightsPage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
