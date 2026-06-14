import Head from "next/head";
import { siteConfig } from "@/config/site";

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  noIndex?: boolean;
  schema?: Record<string, unknown>;
}

export default function SEO({
  title,
  description,
  canonicalUrl,
  ogImage,
  noIndex = false,
  schema,
}: SEOProps) {
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const metaDesc = description || siteConfig.description;
  const metaUrl = canonicalUrl || siteConfig.url;
  const metaImage = ogImage || siteConfig.ogImage;

  return (
    <>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDesc} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={metaUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={metaImage} />
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </>
  );
}
