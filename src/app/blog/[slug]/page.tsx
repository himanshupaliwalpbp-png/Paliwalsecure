import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import PageLayout from '@/components/PageLayout';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/config/site';
import BlogPostClient from '../BlogPostClient';

// ── Types ──────────────────────────────────────────────────────────────────
interface BlogFrontmatter {
  title: string;
  date: string;
  author: string;
  slug: string;
  keywords: string[];
  description: string;
  image: string;
}

interface BlogPost {
  frontmatter: BlogFrontmatter;
  content: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────
const BLOG_DIR = path.join(process.cwd(), 'content/blog');

function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
  return files.map((filename) => {
    const filePath = path.join(BLOG_DIR, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    return {
      frontmatter: data as BlogFrontmatter,
      content,
    };
  });
}

function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.frontmatter.slug === slug);
}

function getRelatedPosts(currentSlug: string, count: number = 3): BlogPost[] {
  const allPosts = getAllPosts().filter((p) => p.frontmatter.slug !== currentSlug);
  allPosts.sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
  return allPosts.slice(0, count);
}

function estimateReadTime(content: string): string {
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

// ── Static Params ──────────────────────────────────────────────────────────
export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.frontmatter.slug,
  }));
}

// ── Dynamic Metadata ───────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: 'Post Not Found | Paliwal Secure AI' };
  }

  const fm = post.frontmatter;
  const url = `https://paliwalsecure.in/blog/${fm.slug}`;

  return {
    title: `${fm.title} | Paliwal Secure AI`,
    description: fm.description,
    keywords: fm.keywords,
    alternates: {
      canonical: url,
      languages: {
        'en': url,
        'hi': url,
      },
    },
    openGraph: {
      title: fm.title,
      description: fm.description,
      url,
      siteName: siteConfig.name,
      type: 'article',
      locale: 'en_IN',
      publishedTime: fm.date,
      authors: [fm.author],
      images: fm.image ? [{ url: fm.image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: fm.title,
      description: fm.description,
    },
  };
}

// Determine category from slug
function getCategory(slug: string): string {
  if (slug.includes('ev') || slug.includes('ola-electric') || slug.includes('ather') || slug.includes('tvs-iqube') || slug.includes('mahindra-be') || slug.includes('e-vitara') || slug.includes('byd-atto') || slug.includes('mg-zs-ev') || slug.includes('ioniq') || slug.includes('mercedes-eqb')) return 'EV Insurance';
  if (slug.includes('maruti-swift') || slug.includes('hyundai-creta') || slug.includes('tata-nexon') || slug.includes('honda-activa') || slug.includes('royal-enfield') || slug.includes('tata-curvv') || slug.includes('tata-harrier') || slug.includes('creta-n-line') || slug.includes('xuv-3xo') || slug.includes('seltos-2026') || slug.includes('hyryder') || slug.includes('honda-elevate') || slug.includes('mg-astor') || slug.includes('skoda-kodiaq') || slug.includes('volkswagen-taigun') || slug.includes('renault-kiger') || slug.includes('nissan-magnite') || slug.includes('grand-vitara') || slug.includes('tata-safari') || slug.includes('kia-seltos') || slug.includes('mahindra-xuv700') || slug.includes('maruti-fronx') || slug.includes('maruti-brezza') || slug.includes('maruti-baleno') || slug.includes('hyundai-venue') || slug.includes('hyundai-i20') || slug.includes('honda-city') || slug.includes('skoda-kushaq') || slug.includes('mg-hector') || slug.includes('toyota-fortuner') || slug.includes('tata-punch')) return 'Vehicle Guide';
  if (slug.includes('delhi') || slug.includes('mumbai') || slug.includes('bangalore') || slug.includes('jaipur')) return 'City Guide';
  if (slug.includes('health') || slug.includes('mediclaim') || slug.includes('senior') || slug.includes('maternity') || slug.includes('ayush') || slug.includes('diabetic') || slug.includes('room-rent') || slug.includes('super-top') || slug.includes('ped') || slug.includes('pre-existing') || slug.includes('age-') || slug.includes('software-engineer') || slug.includes('teacher') || slug.includes('portability') || slug.includes('group-health') || slug.includes('waiting-period')) return 'Health Insurance';
  if (slug.includes('car') || slug.includes('motor') || slug.includes('zero-dep') || slug.includes('ncb') || slug.includes('bike') || slug.includes('idv') || slug.includes('add-on') || slug.includes('renewal')) return 'Motor Insurance';
  if (slug.includes('term') || slug.includes('life') || slug.includes('critical-illness')) return 'Life Insurance';
  if (slug.includes('travel')) return 'Travel Insurance';
  if (slug.includes('home') || slug.includes('property')) return 'Home Insurance';
  if (slug.includes('claim') || slug.includes('cashless') || slug.includes('reimbursement') || slug.includes('ombudsman')) return 'Claims Guide';
  if (slug.includes('tax')) return 'Tax Saving';
  return 'Insurance Basics';
}

// ── Blog Post Page ─────────────────────────────────────────────────────────
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const fm = post.frontmatter;
  const relatedPosts = getRelatedPosts(slug, 3);
  const readTime = estimateReadTime(post.content);
  const category = getCategory(fm.slug);

  // JSON-LD Article Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: fm.title,
    description: fm.description,
    datePublished: fm.date,
    dateModified: fm.date,
    author: {
      '@type': 'Person',
      name: fm.author,
      url: 'https://paliwalsecure.in',
      jobTitle: 'IRDAI Certified POSP Insurance Advisor',
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        '@type': 'ImageObject',
        url: 'https://paliwalsecure.in/logo.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://paliwalsecure.in/blog/${fm.slug}`,
    },
    keywords: fm.keywords.join(', '),
    image: fm.image ? `https://paliwalsecure.in${fm.image}` : undefined,
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://paliwalsecure.in' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://paliwalsecure.in/blog' },
      { '@type': 'ListItem', position: 3, name: fm.title, item: `https://paliwalsecure.in/blog/${fm.slug}` },
    ],
  };

  // Prepare related posts data
  const relatedPostsData = relatedPosts.map((related) => ({
    slug: related.frontmatter.slug,
    title: related.frontmatter.title,
    description: related.frontmatter.description,
    category: getCategory(related.frontmatter.slug),
    readTime: estimateReadTime(related.content),
  }));

  return (
    <PageLayout>
      <div>
        {/* JSON-LD Schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />

        {/* Client Component with Language Support */}
        <BlogPostClient
          slug={fm.slug}
          title={fm.title}
          description={fm.description}
          content={post.content}
          author={fm.author}
          date={fm.date}
          category={category}
          readTime={readTime}
          relatedPosts={relatedPostsData}
        />
      </div>
    </PageLayout>
  );
}
