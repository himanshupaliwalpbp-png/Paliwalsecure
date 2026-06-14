import { Metadata } from "next";
import PageLayout from '@/components/PageLayout';
import { generatePageMetadata } from "@/lib/seo-utils";
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: "Room Rent Limit in Health Insurance Explained 2026 | Paliwal Secure",
  description:
    "Understand room rent limit in health insurance — how it affects your claim amount, types of limits (capping, percentage, no limit), and which plans have no room rent cap. Expert guide by Himanshu Paliwal, IRDAI Certified Advisor.",
  slug: "/room-rent-limit-health-insurance",
});

export default function RoomRentLimitPage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
