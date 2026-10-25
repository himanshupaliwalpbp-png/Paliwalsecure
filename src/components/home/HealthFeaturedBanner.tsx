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
          <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[rgba(201,138,28,0.35)] dark:border-[rgba(232,200,114,0.25)] order-first lg:order-last nl-rise nl-rise-2">
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
            <div className="nl-eyebrow dark:text-[#E8C97E]! w-fit nl-rise nl-rise-1">
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span>Health Insurance</span>
            </div>

            <h2 className="nl-h2 dark:text-[#FAF7F2]! nl-rise nl-rise-2">
              Apne parivaar ki health ki{' '}
              <span className="bg-gradient-to-r from-[#B8482C] via-[#D0672F] to-[#C98A1C] bg-clip-text text-transparent dark:from-[#F0A88B] dark:via-[#E8A06B] dark:to-[#E8C872]">raksha karein</span>
            </h2>

            <p className="nl-sub dark:text-[#A8B0C2]! max-w-lg nl-rise nl-rise-3">
              Cashless treatment, family floater, critical illness cover — 51+ insurers se best
              health plan chunein. Premium starting ₹499/month. Pre-existing disease cover bhi
              available.
            </p>

            <div className="flex flex-wrap gap-3 items-center nl-rise nl-rise-4">
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
