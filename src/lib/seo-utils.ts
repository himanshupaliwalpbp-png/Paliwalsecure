import { Metadata } from "next";
import { siteConfig } from "@/config/site";

type PageMeta = {
  title: string;
  description: string;
  slug?: string;
  noIndex?: boolean;
  image?: string;
};

export function generatePageMetadata({
  title,
  description,
  slug = "",
  noIndex = false,
  image,
}: PageMeta): Metadata {
  const url = `${siteConfig.url}${slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: image ? [{ url: image }] : [{ url: siteConfig.ogImage }],
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [siteConfig.ogImage],
    },
  };
}
