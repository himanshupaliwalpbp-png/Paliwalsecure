'use client';

import { motion } from 'framer-motion';

interface GlassmorphismCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  hoverEffect?: boolean;
}

export default function GlassmorphismCard({
  title,
  description,
  icon,
  children,
  onClick,
  className = '',
  hoverEffect = true,
}: GlassmorphismCardProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={
        hoverEffect
          ? {
              y: -8,
              boxShadow:
                '0 25px 50px -12px rgba(201, 138, 28, 0.15)',
            }
          : {}
      }
      className={`relative group cursor-pointer ${className}`}
    >
      {/* Glassmorphism Background */}
      <div
        className={`
          absolute inset-0 rounded-2xl
          dark:bg-white/5 bg-white/70 backdrop-blur-xl
          dark:border-white/10 border-slate-200/50
          shadow-xl
          transition-all duration-500
          dark:group-hover:bg-white/10 group-hover:bg-white/90
          dark:group-hover:border-white/20 group-hover:border-[#C98A1C]/30
        `}
      />

      {/* Gradient Overlay (subtle) */}
      <div
        className={`
          absolute inset-0 rounded-2xl
          bg-gradient-to-br dark:from-[#FACC15]/5 from-[#C98A1C]/5 via-transparent dark:to-[#00BFA5]/5 to-sky-200/5
          opacity-0 group-hover:opacity-100 transition-opacity duration-500
        `}
      />

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8">
        {/* Icon */}
        {icon && (
          <motion.div
            className="mb-4 text-[#C98A1C] text-4xl"
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            {icon}
          </motion.div>
        )}

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold dark:text-white text-slate-900 mb-2 group-hover:text-[#C98A1C] transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm md:text-base dark:text-gray-300 text-slate-600 mb-4 leading-relaxed">
            {description}
          </p>
        )}

        {/* Children (additional content) */}
        {children && <div className="mt-4">{children}</div>}

        {/* Subtle bottom accent line */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#C98A1C] to-[#00BFA5] rounded-b-2xl"
          initial={{ width: 0 }}
          whileHover={{ width: '100%' }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
}
