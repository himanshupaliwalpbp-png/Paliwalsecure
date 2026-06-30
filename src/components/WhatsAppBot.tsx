'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, ScanLine, Phone, Sparkles, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ============================================================================
// WhatsApp Helper — builds deep link URLs with pre-filled messages
// ============================================================================

const WHATSAPP_NUMBER = '919257877312'; // Himanshu Paliwal — IRDAI POSP IP429834

/**
 * Build a WhatsApp deep link URL with pre-filled message.
 * Format: https://wa.me/{number}?text={urlEncodedMessage}
 */
export function buildWhatsAppLink(message: string, phoneNumber: string = WHATSAPP_NUMBER): string {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Pre-defined WhatsApp message templates for common scenarios.
 * Hinglish-first (most natural for Indian users).
 */
export const WHATSAPP_TEMPLATES = {
  general: 'Namaste Himanshu! 🙏 Main Paliwal Secure se insurance ke baare me jaanna chahta hu.',
  healthConsult: 'Hi Himanshu! Mujhe health insurance chahiye. Best plans ke baare me bataiye.',
  carInsurance: 'Hi! Meri car ke liye insurance chahiye. Best comprehensive plans bataiye.',
  bikeInsurance: 'Hi! Meri bike ke liye insurance chahiye. Premium bataiye.',
  lifeInsurance: 'Namaste! Term insurance lena chahta hu. ₹1 Crore cover ke best plans bataiye.',
  travelInsurance: 'Hi! International trip ke liye travel insurance chahiye.',
  homeInsurance: 'Hi! Ghar ke liye insurance chahiye. Details bataiye.',
  claimHelp: 'Hi Himanshu! Mujhe insurance claim file karna hai. Madad kariye.',
  policyReview: 'Hi! Main apni existing policy review karwana chahta hu. Free audit possible hai?',
  taxSavings: 'Hi! Section 80D ke under tax bachat ke baare me jaanna hai.',
  diseaseSpecific: (disease: string) => `Hi! Mujhe ${disease} hai. Best health insurance plan suggest kariye.`,
  citySpecific: (city: string) => `Hi Himanshu! Main ${city} me rehta hu. Insurance consultation chahiye.`,
  calculatorResult: (calcType: string, summary: string) =>
    `Hi! Maine ${calcType} use kiya. Result: ${summary}. Ab plan choose karne me madad kariye.`,
} as const;

// ============================================================================
// WhatsApp QR Code Component
// ============================================================================

interface WhatsAppQRProps {
  message?: string;
  size?: number;
  className?: string;
  showLabel?: boolean;
}

/**
 * Renders a QR code that, when scanned, opens WhatsApp with pre-filled message.
 * Uses api.qrserver.com (free, no API key needed) to generate QR image.
 */
export function WhatsAppQR({
  message = WHATSAPP_TEMPLATES.general,
  size = 180,
  className = '',
  showLabel = true,
}: WhatsAppQRProps) {
  const link = buildWhatsAppLink(message);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(link)}&bgcolor=FAF7F2&color=0E1116&margin=10&qzone=2`;

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="relative p-3 bg-white rounded-2xl shadow-lg border-2 border-[#2D6A4F]/20">
        <img
          src={qrUrl}
          alt="WhatsApp QR Code"
          width={size}
          height={size}
          className="rounded-lg"
          loading="lazy"
        />
        {/* WhatsApp icon overlay */}
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#2D6A4F] rounded-full flex items-center justify-center shadow-md">
          <MessageCircle className="w-4 h-4 text-white" fill="white" />
        </div>
      </div>
      {showLabel && (
        <div className="text-center">
          <p className="text-sm font-semibold text-[#0E1116] dark:text-[#FAF7F2] flex items-center gap-1.5 justify-center">
            <ScanLine className="w-4 h-4 text-[#2D6A4F]" />
            Scan to Chat
          </p>
          <p className="text-xs text-[#4A4F57] dark:text-[#A8B0C2] mt-0.5">
            Open WhatsApp & scan this code
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// WhatsApp Floating Action Button (with expandable menu)
// ============================================================================

interface WhatsAppFABProps {
  className?: string;
}

/**
 * Floating WhatsApp button (bottom-right).
 * Click to expand menu with quick-message templates.
 * Mobile: direct deep link. Desktop: shows QR + quick links.
 */
export function WhatsAppFAB({ className = '' }: WhatsAppFABProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Don't render if InsureGPT is open (avoid overlap)
  useEffect(() => {
    const checkInsureGPT = () => {
      const trigger = document.querySelector('[data-insuregpt-trigger]');
      // If InsureGPT chat is open, hide FAB
      const chatInterface = document.querySelector('[data-insuregpt-open]');
      if (chatInterface) {
        (document.body).style.setProperty('--whatsapp-fab-display', 'none');
      } else {
        (document.body).style.setProperty('--whatsapp-fab-display', 'flex');
      }
    };
    const interval = setInterval(checkInsureGPT, 500);
    return () => clearInterval(interval);
  }, []);

  const quickLinks = [
    { label: '🏥 Health Insurance', message: WHATSAPP_TEMPLATES.healthConsult },
    { label: '🚗 Car Insurance', message: WHATSAPP_TEMPLATES.carInsurance },
    { label: '🏍️ Bike Insurance', message: WHATSAPP_TEMPLATES.bikeInsurance },
    { label: '🛡️ Term Insurance', message: WHATSAPP_TEMPLATES.lifeInsurance },
    { label: '📄 Claim Help', message: WHATSAPP_TEMPLATES.claimHelp },
    { label: '🔍 Policy Review', message: WHATSAPP_TEMPLATES.policyReview },
  ];

  return (
    <div
      className={`fixed bottom-6 left-4 md:left-6 z-[55] ${className}`}
      style={{ display: 'var(--whatsapp-fab-display, flex)' }}
    >
      {/* Expandable Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 left-0 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-[#161A24] rounded-2xl shadow-2xl border border-[rgba(15,19,32,0.10)] dark:border-[rgba(232,200,114,0.18)] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#2D6A4F] to-[#235541] p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" fill="white" />
                  <div>
                    <p className="font-bold text-sm">Chat with Himanshu</p>
                    <p className="text-xs opacity-90 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                      Usually replies in 5 min
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white"
                  aria-label="Close WhatsApp menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3">
              {/* Desktop: Show QR */}
              {isDesktop && (
                <div className="flex flex-col items-center py-3 border-b border-[rgba(15,19,32,0.06)] dark:border-[rgba(232,200,114,0.10)]">
                  <WhatsAppQR size={140} showLabel={true} />
                  <p className="text-xs text-[#4A4F57] dark:text-[#A8B0C2] mt-2 text-center">
                    Scan with your phone camera
                  </p>
                </div>
              )}

              {/* Quick message templates */}
              <div>
                <p className="text-xs font-semibold text-[#4A4F57] dark:text-[#A8B0C2] mb-2 uppercase tracking-wide">
                  Quick Messages
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  {quickLinks.map((link, i) => (
                    <a
                      key={i}
                      href={buildWhatsAppLink(link.message)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#FAF7F2] dark:bg-[#1A1F27] hover:bg-[#E6F4EF] dark:hover:bg-[rgba(45,106,79,0.18)] text-sm font-medium text-[#0E1116] dark:text-[#FAF7F2] transition-colors"
                    >
                      <span>{link.label}</span>
                      <ChevronDown className="w-3 h-3 -rotate-90 opacity-50" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Direct call option */}
              <a
                href="tel:+919257877312"
                className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg border border-[#B8482C]/30 text-[#B8482C] dark:text-[#F0A88B] text-sm font-semibold hover:bg-[#FBE8E1] dark:hover:bg-[rgba(184,72,44,0.10)]"
              >
                <Phone className="w-4 h-4" />
                Call: +91-92587-77312
              </a>

              {/* InsureGPT alternative */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  // Trigger InsureGPT open
                  const event = new CustomEvent('open-insuregpt');
                  window.dispatchEvent(event);
                }}
                className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-[#FBF3DD] dark:bg-[rgba(184,134,11,0.15)] border border-[rgba(184,134,11,0.25)] text-[#8B6508] dark:text-[#E8C872] text-sm font-semibold hover:bg-[#F8EAC4]"
              >
                <Sparkles className="w-4 h-4" />
                Try InsureGPT AI (Instant)
              </button>
            </div>

            {/* Footer */}
            <div className="bg-[#FAF7F2] dark:bg-[#1A1F27] px-4 py-2 border-t border-[rgba(15,19,32,0.06)] dark:border-[rgba(232,200,114,0.10)]">
              <p className="text-[10px] text-center text-[#8B9099]">
                IRDAI POSP IP429834 · 500+ families served · 4.9★
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        onClick={() => {
          if (isDesktop) {
            setIsOpen(!isOpen);
          } else {
            // Mobile: direct WhatsApp link
            window.open(buildWhatsAppLink(WHATSAPP_TEMPLATES.general), '_blank', 'noopener,noreferrer');
          }
        }}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#2D6A4F] hover:bg-[#235541] shadow-2xl shadow-[#2D6A4F]/40 flex items-center justify-center transition-colors"
        aria-label="Chat on WhatsApp with Himanshu Paliwal"
      >
        {/* Pulse animation */}
        <span className="absolute inset-0 rounded-full bg-[#2D6A4F] animate-ping opacity-25" />

        {/* WhatsApp icon */}
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 md:w-8 md:h-8 text-white relative z-10"
          fill="currentColor"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>

        {/* Notification dot */}
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white dark:border-[#0E1116]">
          1
        </span>
      </motion.button>
    </div>
  );
}

// ============================================================================
// WhatsApp CTA Button — for inline use in pages
// ============================================================================

interface WhatsAppButtonProps {
  message?: string;
  label?: string;
  variant?: 'default' | 'outline' | 'compact';
  className?: string;
  showIcon?: boolean;
}

export function WhatsAppButton({
  message = WHATSAPP_TEMPLATES.general,
  label = 'Chat on WhatsApp',
  variant = 'default',
  className = '',
  showIcon = true,
}: WhatsAppButtonProps) {
  const baseClasses = 'inline-flex items-center gap-2 font-semibold transition-all';
  const variantClasses = {
    default: 'px-5 py-2.5 rounded-full bg-[#2D6A4F] hover:bg-[#235541] text-white shadow-lg shadow-[#2D6A4F]/30',
    outline: 'px-5 py-2.5 rounded-full border-2 border-[#2D6A4F] text-[#2D6A4F] hover:bg-[#E6F4EF]',
    compact: 'px-3 py-1.5 rounded-lg bg-[#2D6A4F] hover:bg-[#235541] text-white text-sm',
  };

  return (
    <a
      href={buildWhatsAppLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {showIcon && (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      )}
      {label}
    </a>
  );
}

// ============================================================================
// WhatsApp Landing Page Hero Section
// ============================================================================

export function WhatsAppHero() {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6F4EF] dark:bg-[rgba(45,106,79,0.18)] border border-[rgba(45,106,79,0.25)] text-[#2D6A4F] dark:text-[#6EE7B7] text-xs font-semibold mb-6">
        <span className="w-2 h-2 bg-[#2D6A4F] rounded-full animate-pulse" />
        WhatsApp Bot · 24/7 Available
      </div>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0E1116] dark:text-[#FAF7F2] mb-4">
        InsureGPT on{' '}
        <span className="text-[#2D6A4F]">WhatsApp</span>
      </h1>

      <p className="text-base sm:text-lg text-[#4A4F57] dark:text-[#A8B0C2] mb-8">
        Chat directly with Himanshu Paliwal — IRDAI Registered POSP (IP429834) — on WhatsApp.
        Get instant insurance advice, compare plans, file claims, and more.
        Hinglish/Hindi/English support.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        <WhatsAppButton
          message={WHATSAPP_TEMPLATES.general}
          label="Start WhatsApp Chat"
          variant="default"
        />
        <a href="tel:+919257877312">
          <Button variant="outline" className="border-[#B8482C] text-[#B8482C] hover:bg-[#FBE8E1]">
            <Phone className="w-4 h-4 mr-2" />
            Call Instead
          </Button>
        </a>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#4A4F57] dark:text-[#A8B0C2]">
        <span className="flex items-center gap-1.5">
          <MessageCircle className="w-4 h-4 text-[#2D6A4F]" />
          500+ families served
        </span>
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#B8860B]" />
          4.9★ rating
        </span>
        <span className="flex items-center gap-1.5">
          <ScanLine className="w-4 h-4 text-[#B8482C]" />
          QR code available
        </span>
      </div>
    </div>
  );
}
