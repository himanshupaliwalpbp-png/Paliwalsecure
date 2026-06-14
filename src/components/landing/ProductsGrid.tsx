'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Heart, Car, Users, Plane, Home, Star } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { useThemeAware } from '@/lib/use-theme-aware';

/* ═══════════════════════════════════════════════════════════════════════════
   ProductsGrid — 6 Insurance Product Cards
   "Sabhi Insurance Products" — 3x2 grid with hover glow & stagger animations
   ═══════════════════════════════════════════════════════════════════════════ */

/* Product data */
interface ProductData {
  titleKey: string;
  descKey: string;
  icon: React.ElementType;
  color: string;
  href: string;
}

const products: ProductData[] = [
  {
    titleKey: 'products.health.title',
    descKey: 'products.health.desc',
    icon: Heart,
    color: '#ef4444',
    href: '/compare/health',
  },
  {
    titleKey: 'products.motor.title',
    descKey: 'products.motor.desc',
    icon: Car,
    color: '#162D5A',
    href: '/compare/motor',
  },
  {
    titleKey: 'products.life.title',
    descKey: 'products.life.desc',
    icon: Users,
    color: '#22c55e',
    href: '/compare/life',
  },
  {
    titleKey: 'products.travel.title',
    descKey: 'products.travel.desc',
    icon: Plane,
    color: '#162D5A',
    href: '/compare/travel',
  },
  {
    titleKey: 'products.home.title',
    descKey: 'products.home.desc',
    icon: Home,
    color: '#f97316',
    href: '/compare/home',
  },
  {
    titleKey: 'products.special.title',
    descKey: 'products.special.desc',
    icon: Star,
    color: '#C98A1C',
    href: '/compare',
  },
];

/* ─── Product Card Component ─── */
function ProductCard({
  product,
  index,
  isInView,
  isDark,
}: {
  product: ProductData;
  index: number;
  isInView: boolean;
  isDark: boolean;
}) {
  const { t } = useLanguage();
  const Icon = product.icon;

  return (
    <motion.div
      className="group relative flex flex-col items-center text-center p-6 sm:p-8"
      style={{
        background: isDark ? '#1a2332' : '#FFFFFF',
        border: isDark ? '1px solid rgba(201,138,28,0.1)' : '1px solid #E5E2DB',
        borderRadius: '1.5rem',
        transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease, border-color 0.3s ease',
        boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.06)',
      }}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: 0.15 + index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        y: -6,
        borderColor: 'rgba(201,138,28,0.4)',
        boxShadow: `0 20px 40px -10px rgba(201,138,28,0.3), 0 0 30px rgba(201,138,28,0.15)`,
      }}
    >
      {/* ─── Icon Glow Backdrop (on hover) ─── */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        aria-hidden="true"
        style={{
          background: `radial-gradient(circle at 50% 35%, ${product.color}18 0%, transparent 60%)`,
        }}
      />

      {/* ─── Icon Circle (96px, slate-800 bg, colored border, colored icon) ─── */}
      <div
        className="relative z-10 flex items-center justify-center w-24 h-24 rounded-full mb-6 transition-all duration-300"
        style={{
          background: isDark ? '#1e293b' : '#F5F4F0',
          border: `2px solid ${product.color}40`,
        }}
      >
        <Icon
          className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
          style={{ color: product.color }}
          aria-hidden="true"
        />
      </div>

      {/* ─── Product Name ─── */}
      <h3 className={`relative z-10 text-lg sm:text-xl lg:text-xl font-bold mb-3 font-[family-name:var(--font-heading)] ${isDark ? 'text-white' : 'text-[#0A1330]'}`}>
        {t(product.titleKey)}
      </h3>

      {/* ─── Description ─── */}
      <p className={`relative z-10 text-sm sm:text-base lg:text-lg ${isDark ? 'text-white/85' : 'text-[#1A1A2E]/75'} leading-relaxed mb-5`}>
        {t(product.descKey)}
      </p>

      {/* ─── "Aur Jaaniye →" Link ─── */}
      <Link
        href={product.href}
        className="relative z-10 inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-300 group-hover:gap-3"
        style={{ color: '#C98A1C' }}
      >
        {t('products.learnMore')}
        <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
          →
        </span>
      </Link>
    </motion.div>
  );
}

/* ─── Main Component ─── */
export default function ProductsGrid() {
  const { t } = useLanguage();
  const { isDark } = useThemeAware();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-20 lg:py-28 overflow-hidden"
      style={{
        background: isDark
          ? 'linear-gradient(180deg, #0F1D30 0%, #0A1330 50%, #0F1D30 100%)'
          : 'linear-gradient(180deg, #F0F4FF 0%, #FAFAF8 50%, #F0F4FF 100%)',
      }}
    >
      {/* ─── Background Glow ─── */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(201,138,28,0.06) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── Section Header ─── */}
        <motion.div
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.h2
            className={`text-3xl sm:text-4xl lg:text-4xl font-extrabold mb-4 font-[family-name:var(--font-heading)] ${isDark ? 'text-white' : 'text-[#0A1330]'}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t('products.heading')}
          </motion.h2>
          <motion.p
            className={`text-base sm:text-lg lg:text-xl ${isDark ? 'text-white/90' : 'text-[#1A1A2E]/80'} max-w-2xl mx-auto leading-relaxed`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('products.subheading')}
          </motion.p>
        </motion.div>

        {/* ─── Product Cards Grid: 3x2 (desktop), 2x3 (tablet), 1 col (mobile) ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={product.titleKey}
              product={product}
              index={index}
              isInView={isInView}
              isDark={isDark}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
