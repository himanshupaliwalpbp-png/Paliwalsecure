import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { vehicles, getVehicleBySlug } from '@/data/vehicles';
import Schema, { generateBreadcrumbSchema, generateFAQSchema } from '@/components/Schema';
import VehicleInsuranceClient from './VehicleInsuranceClient';

// ── Static Params ────────────────────────────────────────────────────
export function generateStaticParams() {
  return vehicles.map((v) => ({ model: v.slug }));
}

// ── Metadata ─────────────────────────────────────────────────────────
export function generateMetadata({ params }: { params: Promise<{ model: string }> }): Promise<Metadata> {
  return params.then(({ model }) => {
    const vehicle = getVehicleBySlug(model);
    if (!vehicle) return { title: 'Vehicle Not Found | Paliwal Secure AI' };

    const typeLabel = vehicle.category === 'car' ? 'Car' : vehicle.category === 'bike' ? 'Bike' : 'Scooter';
    const evLabel = vehicle.isEV ? ' Electric' : '';
    const odEstimate = Math.round(vehicle.idv * 0.035);

    return {
      title: `${vehicle.brand} ${vehicle.name} Insurance ${new Date().getFullYear()} | Premium from ₹${odEstimate.toLocaleString('en-IN')} | Paliwal Secure AI`,
      description: `Best ${vehicle.brand} ${vehicle.name}${evLabel} ${typeLabel.toLowerCase()} insurance in India ${new Date().getFullYear()}. Compare premiums from 6+ insurers. IDV ₹${(vehicle.idv / 100000).toFixed(1)}L, TP ₹${vehicle.tp_base.toLocaleString('en-IN')}/yr. Zero dep, RSA, cashless claims.`,
      keywords: [
        vehicle.primaryKeyword,
        ...vehicle.relatedKeywords,
        `${vehicle.brand} ${vehicle.name} insurance premium`,
        `${vehicle.brand} ${vehicle.name} insurance cost ${new Date().getFullYear()}`,
        `${vehicle.brand} ${vehicle.name} comprehensive insurance`,
        `${vehicle.brand} ${vehicle.name} zero dep insurance`,
        `${vehicle.brand} ${vehicle.name} IDV`,
        vehicle.isEV ? `${vehicle.brand} ${vehicle.name} EV insurance` : '',
        `best insurance for ${vehicle.brand} ${vehicle.name}`,
      ].filter(Boolean),
      openGraph: {
        title: `${vehicle.brand} ${vehicle.name} Insurance — ₹${odEstimate.toLocaleString('en-IN')}/yr | Paliwal Secure AI`,
        description: `Compare ${vehicle.brand} ${vehicle.name} insurance from 6+ insurers. IDV ₹${(vehicle.idv / 100000).toFixed(1)}L. Get best quote now.`,
        url: `https://paliwalsecure.in/insurance/${vehicle.slug}`,
        siteName: 'Paliwal Secure AI',
        type: 'article',
        locale: 'en_IN',
      },
      alternates: {
        canonical: `https://paliwalsecure.in/insurance/${vehicle.slug}`,
      },
    };
  });
}

// ── Page Component ───────────────────────────────────────────────────
export default async function VehicleInsurancePage({ params }: { params: Promise<{ model: string }> }) {
  const { model } = await params;
  const vehicle = getVehicleBySlug(model);
  if (!vehicle) notFound();

  const typeLabel = vehicle.category === 'car' ? 'Car' : vehicle.category === 'bike' ? 'Bike' : 'Scooter';

  const faqs = [
    {
      question: `What is the insurance cost for ${vehicle.brand} ${vehicle.name} in ${new Date().getFullYear()}?`,
      answer: `The comprehensive insurance for ${vehicle.brand} ${vehicle.name} starts from approximately ₹${(Math.round(vehicle.idv * 0.035) + vehicle.tp_base + 200).toLocaleString('en-IN')}/yr (new vehicle). This includes Own Damage (₹${Math.round(vehicle.idv * 0.035).toLocaleString('en-IN')}), Third-Party (₹${vehicle.tp_base.toLocaleString('en-IN')}), and PA cover.`,
    },
    {
      question: `What is the IDV of ${vehicle.brand} ${vehicle.name}?`,
      answer: `For a new ${vehicle.brand} ${vehicle.name} (${vehicle.year}), the IDV (Insured Declared Value) is approximately ₹${(vehicle.idv / 100000).toFixed(1)}L (ex-showroom ₹${(vehicle.exShowroom / 100000).toFixed(1)}L × 95%).`,
    },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: `${typeLabel} Insurance`, url: `https://paliwalsecure.in/insurance` },
    { name: `${vehicle.brand} ${vehicle.name}`, url: `https://paliwalsecure.in/insurance/${vehicle.slug}` },
  ]);

  const faqSchema = generateFAQSchema(faqs);

  // Pass only serializable data to the client component
  const vehicleData = {
    slug: vehicle.slug,
    brand: vehicle.brand,
    name: vehicle.name,
    category: vehicle.category,
    isEV: vehicle.isEV,
    year: vehicle.year,
    engineCC: vehicle.engineCC,
    idv: vehicle.idv,
    exShowroom: vehicle.exShowroom,
    tp_base: vehicle.tp_base,
    primaryKeyword: vehicle.primaryKeyword,
    relatedKeywords: vehicle.relatedKeywords,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <VehicleInsuranceClient vehicle={vehicleData} />
    </>
  );
}
