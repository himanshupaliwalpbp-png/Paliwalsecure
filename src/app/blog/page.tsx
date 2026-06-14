import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import BlogPageClient from './BlogPageClient';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Insurance Blog – Tips, Guides & Comparisons | Paliwal Secure AI',
  description:
    'Expert insurance guides, plan comparisons, claim tips, and tax-saving strategies for Indian policyholders. Written by Himanshu Paliwal, IRDAI Certified Insurance Advisor (POSP Code: IP429834). Available in Hindi, English & Hinglish.',
  keywords: [
    'insurance blog india', 'health insurance guide', 'car insurance tips', 'term insurance comparison',
    'insurance claim guide', 'section 80D tax saving', 'IRDAI rules 2026', 'best insurance plans india',
    'insurance hindi blog', 'bima guide hindi', 'insurance tips hinglish', 'family health insurance guide',
  ],
  alternates: {
    canonical: 'https://paliwalsecure.in/blog',
    languages: {
      'en': 'https://paliwalsecure.in/blog',
      'hi': 'https://paliwalsecure.in/blog',
    },
  },
  openGraph: {
    title: 'Insurance Blog – Tips, Guides & Comparisons | Paliwal Secure AI',
    description:
      'Expert insurance guides, plan comparisons, claim tips, and tax-saving strategies for Indian policyholders.',
    url: 'https://paliwalsecure.in/blog',
    siteName: siteConfig.name,
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insurance Blog – Tips, Guides & Comparisons | Paliwal Secure AI',
    description:
      'Expert insurance guides, plan comparisons, claim tips, and tax-saving strategies for Indian policyholders.',
  },
};

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

export interface BlogPostData {
  frontmatter: BlogFrontmatter;
  content: string;
  category: string;
  categoryColor: string;
  readTime: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────
const BLOG_DIR = path.join(process.cwd(), 'content/blog');

function getAllPosts(): BlogPostData[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
  return files.map((filename) => {
    const filePath = path.join(BLOG_DIR, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    const cat = getCategory(data.slug || filename.replace('.md', ''));
    return {
      frontmatter: data as BlogFrontmatter,
      content,
      category: cat.name,
      categoryColor: cat.color,
      readTime: estimateReadTime(content),
    };
  }).sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
}

function getCategory(slug: string): { name: string; color: string } {
  if (slug.includes('ev') || slug.includes('ola-electric') || slug.includes('ather') || slug.includes('tvs-iqube') || slug.includes('mahindra-be')) return { name: 'EV Insurance', color: 'lime' };
  if (slug.includes('maruti-swift') || slug.includes('hyundai-creta') || slug.includes('tata-nexon') || slug.includes('honda-activa') || slug.includes('royal-enfield') || slug.includes('tata-curvv') || slug.includes('maruti-fronx') || slug.includes('hyundai-venue') || slug.includes('tata-punch') || slug.includes('mahindra-xuv700') || slug.includes('kia-seltos') || slug.includes('toyota-fortuner') || slug.includes('mg-hector') || slug.includes('maruti-brezza') || slug.includes('skoda-kushaq') || slug.includes('honda-city') || slug.includes('suzuki-access') || slug.includes('tvs-raider') || slug.includes('bajaj-pulsar') || slug.includes('hero-splendor') || slug.includes('yamaha-r15') || slug.includes('ktm-duke') || slug.includes('maruti-baleno') || slug.includes('hyundai-i20') || slug.includes('car-insurance-renewal')) return { name: 'Vehicle Guide', color: 'pink' };
  if (slug.includes('delhi') || slug.includes('mumbai') || slug.includes('bangalore') || slug.includes('jaipur')) return { name: 'City Guide', color: 'indigo' };
  if (slug.includes('health') || slug.includes('mediclaim') || slug.includes('senior') || slug.includes('maternity') || slug.includes('ayush') || slug.includes('diabetic') || slug.includes('room-rent') || slug.includes('super-top') || slug.includes('ped') || slug.includes('pre-existing') || slug.includes('age-') || slug.includes('software-engineer') || slug.includes('teacher') || slug.includes('portability') || slug.includes('group-health') || slug.includes('waiting-period')) return { name: 'Health Insurance', color: 'rose' };
  if (slug.includes('car-insurance') || slug.includes('motor-insurance') || slug.includes('zero-dep') || slug.includes('ncb') || slug.includes('bike-insurance') || slug.includes('idv-in') || slug.includes('add-on') || slug.includes('bike-insurance-renewal') || slug.includes('bike-insurance-guide') || slug.includes('bike-insurance-claim') || slug.includes('car-insurance-claim') || slug.includes('car-insurance-add')) return { name: 'Motor Insurance', color: 'amber' };
  if (slug.includes('term') || slug.includes('life') || slug.includes('critical-illness')) return { name: 'Life Insurance', color: 'violet' };
  if (slug.includes('travel')) return { name: 'Travel Insurance', color: 'sky' };
  if (slug.includes('home') || slug.includes('property')) return { name: 'Home Insurance', color: 'orange' };
  if (slug.includes('claim') || slug.includes('cashless') || slug.includes('reimbursement') || slug.includes('ombudsman')) return { name: 'Claims Guide', color: 'teal' };
  if (slug.includes('tax')) return { name: 'Tax Saving', color: 'emerald' };
  return { name: 'Insurance Basics', color: 'cyan' };
}

function estimateReadTime(content: string): string {
  const words = content.split(/\s+/).length;
  return `${Math.ceil(words / 200)} min read`;
}

// ── Page Component ─────────────────────────────────────────────────────────
export default function BlogPage() {
  const posts = getAllPosts();

  // Get unique categories from actual posts
  const categories = [...new Set(posts.map((p) => p.category))];

  // JSON-LD Schemas
  const blogPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Paliwal Secure AI Insurance Blog',
    description: 'Expert insurance guides, plan comparisons, claim tips, and tax-saving strategies for Indian policyholders.',
    url: 'https://paliwalsecure.in/blog',
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
      logo: { '@type': 'ImageObject', url: 'https://paliwalsecure.in/logo.svg' },
    },
    author: {
      '@type': 'Person',
      name: 'Himanshu Paliwal',
      jobTitle: 'IRDAI Certified POSP Insurance Advisor',
      url: 'https://paliwalsecure.in',
    },
    inLanguage: ['en', 'hi'],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://paliwalsecure.in' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://paliwalsecure.in/blog' },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BlogPageClient posts={posts} categories={categories} />
    </>
  );
}
