'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface LiquidButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export default function LiquidButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
}: LiquidButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-white hover:shadow-lg hover:shadow-[#C98A1C]/50 dark:from-[#FACC15] dark:to-[#F0D060] dark:text-[#0A192F]',
    secondary:
      'dark:bg-[#1A4A8A] bg-white text-slate-900 dark:text-white border dark:border-[#FACC15]/30 border-[#C98A1C]/30 dark:hover:border-[#FACC15] hover:border-[#C98A1C]',
    ghost:
      'bg-transparent dark:text-[#FACC15] text-[#C98A1C] border dark:border-[#FACC15]/50 border-[#C98A1C]/50 dark:hover:bg-[#FACC15]/10 hover:bg-[#C98A1C]/10',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative font-semibold rounded-lg transition-all duration-300
        ${variantStyles[variant]} ${sizeStyles[size]} ${className}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {/* Liquid ripple effect */}
      {isHovered && !disabled && (
        <motion.div
          className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        </motion.div>
      )}

      {/* Text content */}
      <motion.span
        className="relative z-10 flex items-center justify-center gap-2"
        animate={{ y: isHovered ? -2 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
}
