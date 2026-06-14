'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface LiquidButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  href?: string;
}

/**
 * Premium CTA button with liquid ripple effects and smooth animations.
 * Adapted for Paliwal Secure AI's gold/navy palette.
 */
const LiquidButton: React.FC<LiquidButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  href,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const variantStyles = {
    primary: 'bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-[#0A1330] hover:shadow-lg hover:shadow-[#C98A1C]/40',
    secondary: 'bg-[#162D5A] text-white border border-[#C98A1C]/30 hover:border-[#C98A1C]',
    ghost: 'bg-transparent text-[#C98A1C] border border-[#C98A1C]/50 hover:bg-[#C98A1C]/10',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const ButtonComponent = (
    <motion.button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative font-semibold rounded-lg transition-all duration-300
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C98A1C]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background
        ${variantStyles[variant]} ${sizeStyles[size]} ${className}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      aria-disabled={disabled}
    >
      {/* Liquid ripple effect on hover */}
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
        animate={{ y: isHovered ? -1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
    </motion.button>
  );

  // If href is provided, wrap in Link
  if (href && !disabled) {
    return (
      <Link href={href} className="inline-block">
        {ButtonComponent}
      </Link>
    );
  }

  return ButtonComponent;
};

export default LiquidButton;
