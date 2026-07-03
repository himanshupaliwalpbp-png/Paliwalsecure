'use client';

/**
 * HealthFeaturedBanner — Featured Health Insurance banner on homepage.
 * Shows the health insurance image with a CTA to explore health plans.
 */
import Link from 'next/link';
import { ArrowRight, Shield } from 'lucide-react';

export default function HealthFeaturedBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FAF7F2] dark:bg-[#0E1116] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[rgba(14,17,22,0.08)] dark:border-[rgba(250,247,242,0.10)] order-first lg:order-last">
            <picture>
              <source srcSet="/images/health-homepage.webp" type="image/webp" />
              <img
                src="/images/health-homepage.jpg"
                alt="Health Insurance — Paliwal Secure AI offers comprehensive family health coverage with cashless treatment, family floater plans, and pre-existing disease coverage across 51+ IRDAI insurers"
                className="w-full h-auto block"
                loading="lazy"
                width={1536}
                height={1024}
              />
            </picture>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E6EFEE] dark:bg-[#0F2A28] text-[#1B4D4A] dark:text-[#2D7A77] text-sm font-medium w-fit">
              <Shield className="w-3.5 h-3.5" />
              Health Insurance
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0E1116] dark:text-white">
              Apne parivaar ki health ki{' '}
              <span className="text-[#2D6A4F] dark:text-[#6EE7B7]">raksha karein</span>
            </h2>

            <p className="text-base sm:text-lg text-[#4A4F57] dark:text-[#A8B0C2] leading-relaxed max-w-lg">
              Cashless treatment, family floater, critical illness cover — 51+ insurers se best
              health plan chunein. Premium starting ₹499/month. Pre-existing disease cover bhi
              available.
            </p>

            <div className="flex flex-wrap gap-3 items-center">
              <Link
                href="/health-insurance"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2D6A4F] text-white font-semibold text-sm hover:bg-[#1B4D4A] transition-colors"
              >
                Explore Health Plans
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-sm text-[#8B9099]">
                Starting ₹499/mo · Cashless at 10,000+ hospitals
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
