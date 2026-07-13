import { Metadata } from "next";
import PageLayout from '@/components/PageLayout';
import { generatePageMetadata } from "@/lib/seo-utils";
import ClientContent from './ClientContent';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';

export const metadata: Metadata = generatePageMetadata({
  title: "Travel Insurance India – Compare Plans & Premiums for Domestic & International Trips",
  description:
    "Compare travel insurance plans from Star Health, ICICI Lombard, Bajaj Allianz, TATA AIG & HDFC ERGO. Premiums from ₹449/trip. Coverage up to ₹10 lakh. Get AI-powered recommendations from PaliwalSecure.in.",
  slug: "/travel-insurance",
});

export default function TravelInsurancePage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
