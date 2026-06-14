'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GlassmorphismCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  hoverEffect?: boolean;
  featured?: boolean;
}

/**
 * Premium glassmorphic card with hover effects.
 * Adapted for Paliwal Secure AI's gold/navy palette with dark/light mode support.
 */
const GlassmorphismCard: React.FC<GlassmorphismCardProps> = ({
  title,
  description,
  icon,
  children,
  onClick,
  className = '',
  hoverEffect = true,
  featured = false,
}) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hoverEffect ? { y: -6, boxShadow: '0 25px 50px -12px rgba(201, 138, 28, 0.2)' } : {}}
      className={`
        relative group
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
    >
      {/* Glassmorphism Background */}
      <div
        className={`
          absolute inset-0 rounded-2xl
          dark:bg-white/[0.06] bg-white/70
          backdrop-blur-xl
          border dark:border-white/10 border-slate-200/60
          shadow-xl
          transition-all duration-500
          dark:group-hover:bg-white/[0.10] group-hover:bg-white/90
          dark:group-hover:border-[#C98A1C]/30 group-hover:border-[#C98A1C]/30
          ${featured ? 'dark:border-[#C98A1C]/25 border-[#C98A1C]/30' : ''}
        `}
      />

      {/* Gradient Overlay (subtle) on hover */}
      <div
        className={`
          absolute inset-0 rounded-2xl
          bg-gradient-to-br from-[#C98A1C]/5 via-transparent to-[#162D5A]/5
          opacity-0 group-hover:opacity-100 transition-opacity duration-500
        `}
      />

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8">
        {/* Featured badge */}
        {featured && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-[#0A1330] text-xs font-bold">
              ⭐ Featured
            </span>
          </div>
        )}

        {/* Icon */}
        {icon && (
          <motion.div
            className="mb-4 dark:text-[#C98A1C] text-amber-600 text-4xl"
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            {icon}
          </motion.div>
        )}

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold dark:text-white text-slate-900 mb-2 group-hover:text-[#C98A1C] transition-colors duration-300 font-[family-name:var(--font-heading)]">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm md:text-base dark:text-[#8A96A8] text-slate-500 mb-4 leading-relaxed">
            {description}
          </p>
        )}

        {/* Children (additional content) */}
        {children && <div className="mt-4">{children}</div>}

        {/* Subtle bottom accent line */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#C98A1C] to-[#E0A830] rounded-b-2xl"
          initial={{ width: 0 }}
          whileHover={{ width: '100%' }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
};

export default GlassmorphismCard;
