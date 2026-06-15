'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, User, MessageSquare, Shield, Phone, Mail, MapPin,
  ChevronDown, CheckCircle2, MessageCircle, Sparkles, Loader2,
  AlertCircle, X, Zap, Heart, PartyPopper
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';
import { useThemeAware } from '@/lib/use-theme-aware';

// ── Types ───────────────────────────────────────────────────────────────
interface FormError {
  title: string;
  message: string;
}

// ── Rating Label Map ────────────────────────────────────────────────────
const RATING_LABELS: Record<number, string> = {
  1: 'ratingForm.poor',
  2: 'ratingForm.fair',
  3: 'ratingForm.good',
  4: 'ratingForm.veryGood',
  5: 'ratingForm.excellent',
};

// ── Popular Indian Cities ───────────────────────────────────────────────
const POPULAR_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Chandigarh', 'Indore', 'Bhopal', 'Nagpur', 'Kochi',
  'Coimbatore', 'Vadodara', 'Visakhapatnam', 'Surat', 'Vijayawada',
  'Mysore', 'Goa', 'Thiruvananthapuram', 'Dehradun', 'Amritsar',
  'Varanasi', 'Agra', 'Madurai', 'Nashik', 'Rajkot',
  'Kanpur', 'Faridabad', 'Ghaziabad', 'Noida', 'Gurgaon',
  'Jodhpur', 'Raipur', 'Guwahati', 'Patna', 'Bhubaneswar',
  'Mangalore', 'Udaipur', 'Aurangabad', 'Srinagar', 'Shimla',
];

// ── Insurance type options ──────────────────────────────────────────────
const INSURANCE_TYPE_KEYS = [
  { value: 'health', key: 'ratingForm.typeHealth' },
  { value: 'motor', key: 'ratingForm.typeMotor' },
  { value: 'life', key: 'ratingForm.typeLife' },
  { value: 'travel', key: 'ratingForm.typeTravel' },
  { value: 'home', key: 'ratingForm.typeHome' },
];

const INSURANCE_NEED_KEYS = [
  { value: 'health', key: 'ratingForm.typeHealth' },
  { value: 'car', key: 'leadForm.needCar' },
  { value: 'bike', key: 'leadForm.needBike' },
  { value: 'life', key: 'ratingForm.typeLife' },
  { value: 'travel', key: 'ratingForm.typeTravel' },
  { value: 'home', key: 'ratingForm.typeHome' },
  { value: 'other', key: 'leadForm.needOther' },
];

// ══════════════════════════════════════════════════════════════════════
// ── FLOATING GOLD PARTICLE ──────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════
function GoldParticle({ delay, x, size, duration }: {
  delay: number; x: number; size: number; duration: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        bottom: '-10px',
        background: `radial-gradient(circle, hsl(var(--primary) 0.7) 0%, hsl(var(--primary) 0.3) 40%, hsl(var(--primary) 0) 70%)`,
      }}
      animate={{
        y: [0, -700],
        opacity: [0, 0.9, 0.6, 0],
        scale: [0.3, 1.2, 0.6],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    />
  );
}


// ══════════════════════════════════════════════════════════════════════
// ── CONFETTI PARTICLE ───────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════
function ConfettiParticle({ index }: { index: number }) {
  const colors = ['hsl(var(--primary))', 'hsl(var(--primary))', '#FF6B6B', '#4ECDC4', '#45B7D1', '#F9CA24', '#FF9FF3', '#54A0FF'];
  const color = colors[index % colors.length];
  const angle = (index * 45) % 360;
  const rad = (angle * Math.PI) / 180;
  const distance = 80 + Math.random() * 60;

  return (
    <motion.div
      className="absolute rounded-sm pointer-events-none"
      style={{
        width: 6 + Math.random() * 6,
        height: 6 + Math.random() * 6,
        backgroundColor: color,
        left: '50%',
        top: '50%',
        borderRadius: Math.random() > 0.5 ? '50%' : '0%',
      }}
      animate={{
        x: [0, Math.cos(rad) * distance],
        y: [0, Math.sin(rad) * distance - 40],
        opacity: [1, 1, 0],
        rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
        scale: [0.5, 1.5, 0],
      }}
      transition={{
        duration: 1.2,
        delay: index * 0.04,
        ease: 'easeOut',
      }}
    />
  );
}

// ══════════════════════════════════════════════════════════════════════
// ── SPARKLE BURST ───────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════
function SparkleBurst() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(12)].map((_, i) => (
        <ConfettiParticle key={i} index={i} />
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// ── 3D TILT CARD WRAPPER ────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -12, y: x * 12 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
      }}
      transition={{ type: 'spring', stiffness: 250, damping: 25 }}
      style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// ── ANIMATED BORDER ─────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════
function AnimatedBorder({ children, className = '', isDark: isDarkProp }: { children: React.ReactNode; className?: string; isDark?: boolean }) {
  return (
    <>
      <div className={`relative rounded-2xl ${className}`}>
        <div
          className="absolute inset-0 rounded-2xl p-[1.5px] animated-border-gradient"
        >
          <div className={`w-full h-full rounded-2xl ${isDarkProp ? 'bg-[#0E1220]' : 'bg-white'}`} />
        </div>
        <div
          className="absolute -inset-1 rounded-2xl opacity-20 pointer-events-none animated-border-glow"
        />
        <div className="relative z-10">
          {children}
        </div>
      </div>
      <style>{`
        @property --border-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        .animated-border-gradient {
          background: conic-gradient(from var(--border-angle), hsl(var(--primary)), hsl(var(--primary)), transparent, hsl(var(--primary)), transparent, hsl(var(--primary)), hsl(var(--primary)));
          animation: border-angle-spin 12s linear infinite;
        }
        .animated-border-glow {
          background: conic-gradient(from var(--border-angle), hsl(var(--primary)), transparent, hsl(var(--primary)));
          filter: blur(12px);
          animation: border-angle-spin 12s linear infinite;
        }
        @keyframes border-angle-spin {
          to { --border-angle: 360deg; }
        }
      `}</style>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════
// ── STAR RATING COMPONENT ───────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════
function StarRating({ value, onChange, hoverValue, onHover, t }: {
  value: number;
  onChange: (v: number) => void;
  hoverValue: number;
  onHover: (v: number) => void;
  t: (key: string) => string;
}) {
  const [burstStar, setBurstStar] = useState(0);

  const handleClick = (star: number) => {
    onChange(star);
    setBurstStar(star);
    setTimeout(() => setBurstStar(0), 600);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2 lg:gap-4 py-3">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= (hoverValue || value);
          const isBurst = star === burstStar;
          return (
            <motion.button
              key={star}
              type="button"
              className="relative focus:outline-none"
              onMouseEnter={() => onHover(star)}
              onMouseLeave={() => onHover(0)}
              onClick={() => handleClick(star)}
              whileHover={{ scale: 1.4, rotate: 8 }}
              whileTap={{ scale: 0.85 }}
              animate={isBurst ? {
                scale: [1, 1.6, 1],
                rotate: [0, 15, -15, 0],
              } : {}}
              transition={isBurst ? { duration: 0.5 } : { type: 'spring', stiffness: 400, damping: 15 }}
            >
              {/* Burst effect on click */}
              {isBurst && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, hsl(var(--primary) 0.6) 0%, hsl(var(--primary) 0) 70%)',
                  }}
                  initial={{ scale: 0.5, opacity: 1 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                />
              )}
              {/* Glow effect */}
              {isFilled && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, hsl(var(--primary) 0.5) 0%, hsl(var(--primary) 0.2) 40%, hsl(var(--primary) 0) 70%)',
                    filter: 'blur(6px)',
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 2 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              <Star
                className={`relative z-10 transition-all duration-200 ${isFilled ? 'text-[#E8C872] dark:text-[#D4A853]' : 'text-[#CBD5E1] dark:text-white/20'}`}
                size={44}
                fill={isFilled ? 'currentColor' : 'none'}
                strokeWidth={1.5}
                style={{
                  filter: isFilled ? 'drop-shadow(0 0 8px rgba(232, 200, 114, 0.5))' : 'none',
                }}
              />
            </motion.button>
          );
        })}
      </div>
      {/* Rating label */}
      <AnimatePresence mode="wait">
        {(hoverValue || value) > 0 && (
          <motion.p
            key={hoverValue || value}
            initial={{ opacity: 0, y: -10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="text-[#E8C872] dark:text-[#D4A853] text-base md:text-lg font-bold"
          >
            {t(RATING_LABELS[(hoverValue || value) as keyof typeof RATING_LABELS])}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// ── GLASS INPUT FIELD ───────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════
function GlassInput({
  icon: Icon,
  placeholder,
  type = 'text',
  value,
  onChange,
  prefix,
  isDark: isDarkProp,
}: {
  icon: React.ElementType;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: React.ReactNode;
  isDark?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const dk = isDarkProp ?? true;

  return (
    <motion.div
      className="relative group"
      animate={focused ? { scale: 1.01 } : { scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Golden focus ring */}
      <motion.div
        className="absolute -inset-[1.5px] rounded-xl pointer-events-none"
        animate={focused
          ? { opacity: 1, boxShadow: '0 0 20px hsl(var(--primary) 0.4), 0 0 40px hsl(var(--primary) 0.15)' }
          : { opacity: 0, boxShadow: 'none' }}
        transition={{ duration: 0.3 }}
      />
      <div className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-300 ${
        focused
          ? 'border-[#2563EB] dark:border-[#3B82F6]'
          : 'border-[#E2E8F0] dark:border-white/10 hover:border-[#CBD5E1] dark:hover:border-white/18'
      }`}>
        <Icon className={`w-5 h-5 flex-shrink-0 transition-colors duration-300 ${
          focused ? 'text-[#2563EB] dark:text-[#60A5FA]' : 'text-[#94A3B8] dark:text-[#64748B]'
        }`} />
        {prefix && <div className="flex-shrink-0">{prefix}</div>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="input-premium border-0 bg-transparent p-0 shadow-none focus:ring-0 focus:shadow-none"
        />
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// ── GLASS SELECT FIELD ──────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════
function GlassSelect({
  icon: Icon,
  placeholder,
  value,
  onChange,
  options,
  isDark: isDarkProp,
}: {
  icon: React.ElementType;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  isDark?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const dk = isDarkProp ?? true;

  return (
    <motion.div
      className="relative group"
      animate={focused ? { scale: 1.01 } : { scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="absolute -inset-[1.5px] rounded-xl pointer-events-none"
        animate={focused
          ? { opacity: 1, boxShadow: '0 0 20px hsl(var(--primary) 0.4), 0 0 40px hsl(var(--primary) 0.15)' }
          : { opacity: 0, boxShadow: 'none' }}
        transition={{ duration: 0.3 }}
      />
      <div className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-300 ${
        focused
          ? 'border-[#2563EB] dark:border-[#3B82F6]'
          : 'border-[#E2E8F0] dark:border-white/10 hover:border-[#CBD5E1] dark:hover:border-white/18'
      }`}>
        <Icon className={`w-5 h-5 flex-shrink-0 transition-colors duration-300 ${
          focused ? 'text-[#2563EB] dark:text-[#60A5FA]' : 'text-[#94A3B8] dark:text-[#64748B]'
        }`} />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="input-premium border-0 bg-transparent p-0 shadow-none focus:ring-0 focus:shadow-none appearance-none cursor-pointer"
          style={{ colorScheme: dk ? 'dark' : 'light' }}
        >
          <option value="" className={dk ? 'bg-[#1E293B] text-[#94A3B8]' : 'bg-white text-[#64748B]'}>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className={dk ? 'bg-[#1E293B] text-[#F8FAFC]' : 'bg-white text-[#0F172A]'}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-colors duration-300 pointer-events-none ${
          focused ? 'text-[#2563EB] dark:text-[#60A5FA]' : 'text-[#94A3B8] dark:text-[#64748B]'
        }`} />
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// ── GLASS TEXTAREA FIELD ────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════
function GlassTextarea({
  icon: Icon,
  placeholder,
  value,
  onChange,
  isDark: isDarkProp,
}: {
  icon: React.ElementType;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  isDark?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const dk = isDarkProp ?? true;

  return (
    <motion.div
      className="relative group"
      animate={focused ? { scale: 1.01 } : { scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="absolute -inset-[1.5px] rounded-xl pointer-events-none"
        animate={focused
          ? { opacity: 1, boxShadow: '0 0 20px hsl(var(--primary) 0.4), 0 0 40px hsl(var(--primary) 0.15)' }
          : { opacity: 0, boxShadow: 'none' }}
        transition={{ duration: 0.3 }}
      />
      <div className={`relative flex gap-3 px-4 py-3.5 rounded-xl border transition-all duration-300 ${
        focused
          ? 'border-[#2563EB] dark:border-[#3B82F6]'
          : 'border-[#E2E8F0] dark:border-white/10 hover:border-[#CBD5E1] dark:hover:border-white/18'
      }`}>
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 transition-colors duration-300 ${
          focused ? 'text-[#2563EB] dark:text-[#60A5FA]' : 'text-[#94A3B8] dark:text-[#64748B]'
        }`} />
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={3}
          className="input-premium border-0 bg-transparent p-0 shadow-none focus:ring-0 focus:shadow-none resize-none"
        />
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// ── GOLDEN GRADIENT BUTTON ──────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════
function GoldenButton({ children, onClick, disabled = false, loading = false }: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="relative w-full py-4 rounded-xl font-bold text-base overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
      whileHover={disabled || loading ? {} : { scale: 1.03, boxShadow: '0 0 35px rgba(15,28,64,0.5)' }}
      whileTap={disabled || loading ? {} : { scale: 0.97 }}
    >
      {/* Dark blue gradient background */}
      <div className="absolute inset-0 bg-primary" />
      {/* Gold border accent */}
      <div className="absolute inset-0 rounded-xl border border-primary/40" />
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
        }}
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
      <span className="relative z-10 text-white font-bold flex items-center justify-center gap-2">
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </span>
    </motion.button>
  );
}

// ══════════════════════════════════════════════════════════════════════
// ── ERROR BANNER ────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════
function ErrorBanner({ error, onDismiss }: { error: FormError; onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 mb-4"
    >
      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-red-300 font-semibold text-sm">{error.title}</p>
        <p className="text-red-400/70 text-xs mt-0.5">{error.message}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="text-red-400/60 hover:text-red-300 transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// ── SUCCESS STATE ───────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════
function SuccessState({ message, showWhatsApp = false, whatsappLabel, t, isDark: isDarkProp }: {
  message: string;
  showWhatsApp?: boolean;
  whatsappLabel?: string;
  t: (key: string) => string;
  isDark?: boolean;
}) {
  const dk = isDarkProp ?? true;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
      className="relative flex flex-col items-center justify-center py-8 gap-5 text-center overflow-hidden"
    >
      {/* Confetti burst */}
      <SparkleBurst />

      {/* Success icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        className="relative"
      >
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl scale-150" />
        <div className="relative w-20 h-20 rounded-full bg-primary flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-primary-foreground" />
        </div>
      </motion.div>

      {/* Success message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-foreground text-xl md:text-2xl font-bold mb-1">{message}</p>
        <p className={`${dk ? 'text-gray-400' : 'text-muted-foreground'} text-sm flex items-center justify-center gap-1`}>
          <PartyPopper className="w-4 h-4 text-primary" />
          <span>{t('ratingForm.successExtra')}</span>
        </p>
      </motion.div>

      {/* Floating emojis */}
      {[...Array(5)].map((_, i) => {
        return (
          <motion.span
            key={i}
            className="absolute pointer-events-none"
            style={{ left: '50%', top: '40%' }}
            initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              x: [0, Math.cos((i * 72) * (Math.PI / 180)) * (60 + Math.random() * 40)],
              y: [0, Math.sin((i * 72) * (Math.PI / 180)) * (60 + Math.random() * 40) - 30],
              scale: [0, 1.3, 1, 0],
            }}
            transition={{ duration: 1.5, delay: 0.3 + i * 0.12 }}
          >
            <Star className="w-6 h-6 text-primary" />
          </motion.span>
        );
      })}

      {showWhatsApp && whatsappLabel && (
        <motion.a
          href="https://wa.me/919257877312"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold text-base transition-all shadow-lg shadow-green-600/20 mt-2"
          whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(34,197,94,0.4)' }}
          whileTap={{ scale: 0.97 }}
        >
          <MessageCircle className="w-5 h-5" />
          {whatsappLabel}
        </motion.a>
      )}
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// ── CITY INPUT WITH SUGGESTIONS ─────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════
function CityInput({ value, onChange, placeholder, t, isDark: isDarkProp }: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  t: (key: string) => string;
  isDark?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLDivElement>(null);
  const dk = isDarkProp ?? true;

  const filteredCities = value.length > 0
    ? POPULAR_CITIES.filter(c =>
        c.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 12)
    : POPULAR_CITIES.slice(0, 12);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || filteredCities.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.min(prev + 1, filteredCities.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      onChange(filteredCities[highlightedIndex]);
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div ref={inputRef} className="relative">
      <motion.div
        className="relative group"
        animate={focused ? { scale: 1.01 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="absolute -inset-[1.5px] rounded-xl pointer-events-none"
          animate={focused
            ? { opacity: 1, boxShadow: '0 0 20px hsl(var(--primary) 0.4), 0 0 40px hsl(var(--primary) 0.15)' }
            : { opacity: 0, boxShadow: 'none' }}
          transition={{ duration: 0.3 }}
        />
        <div className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-300 ${
          focused
            ? 'border-[#2563EB] dark:border-[#3B82F6]'
            : 'border-[#E2E8F0] dark:border-white/10 hover:border-[#CBD5E1] dark:hover:border-white/18'
        }`}>
          <MapPin className={`w-5 h-5 flex-shrink-0 transition-colors duration-300 ${
            focused ? 'text-[#2563EB] dark:text-[#60A5FA]' : 'text-[#94A3B8] dark:text-[#64748B]'
          }`} />
          <input
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setShowSuggestions(true);
              setHighlightedIndex(-1);
            }}
            onFocus={() => {
              setFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKeyDown}
            className="input-premium border-0 bg-transparent p-0 shadow-none focus:ring-0 focus:shadow-none"
          />
        </div>
      </motion.div>

      {/* City suggestions */}
      <AnimatePresence>
        {showSuggestions && filteredCities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            className={`absolute z-50 w-full mt-2 py-2 rounded-xl backdrop-blur-sm border max-h-64 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-primary/30 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-primary/50 ${dk ? 'bg-[#0E1220]/95 border-primary/20 shadow-xl shadow-black/30' : 'bg-white/95 border-border shadow-xl shadow-black/10'}`}
          >
            <p className="px-4 py-1 text-[10px] font-semibold text-primary/70 uppercase tracking-wider">
              {t('leadForm.popularCities')}
            </p>
            {filteredCities.map((city, idx) => (
              <button
                key={city}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(city);
                  setShowSuggestions(false);
                  setHighlightedIndex(-1);
                }}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2 ${
                  idx === highlightedIndex
                    ? 'bg-primary/15 text-primary'
                    : dk
                      ? 'text-white hover:bg-primary/10 hover:text-primary'
                      : 'text-foreground hover:bg-primary/10 hover:text-[#A67C1A]'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-primary/50" />
                {city}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// ── CONNECTING LINE (Desktop) ──────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════
function ConnectingLine({ isDark: isDarkProp }: { isDark?: boolean }) {
  const dk = isDarkProp ?? true;
  return (
    <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 items-center justify-center pointer-events-none">
      <motion.div
        className="w-[2px] h-24 rounded-full"
        style={{
          background: 'linear-gradient(to bottom, transparent, hsl(var(--primary)), hsl(var(--primary)), hsl(var(--primary)), transparent)',
        }}
        initial={{ opacity: 0, scaleY: 0 }}
        whileInView={{ opacity: 1, scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
      {/* Center diamond */}
      <motion.div
        className={`absolute w-4 h-4 rotate-45 border border-primary/60 ${dk ? 'bg-[#0E1220]' : 'bg-white'}`}
        style={{ boxShadow: '0 0 15px hsl(var(--primary) 0.3)' }}
        initial={{ scale: 0, rotate: 0 }}
        whileInView={{ scale: 1, rotate: 45 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.8 }}
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// ── MAIN COMPONENT ──────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════

export default function RatingLeadForm() {
  const { t } = useLanguage();
  const { isDark } = useThemeAware();

  // ── Rating Form State ───────────────────────────────────────────────
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingName, setRatingName] = useState('');
  const [ratingReview, setRatingReview] = useState('');
  const [ratingInsuranceType, setRatingInsuranceType] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingError, setRatingError] = useState<FormError | null>(null);

  // ── Lead Form State ─────────────────────────────────────────────────
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadInsuranceNeed, setLeadInsuranceNeed] = useState('');
  const [leadCity, setLeadCity] = useState('');
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadError, setLeadError] = useState<FormError | null>(null);

  // ── Particle data ──────────────────────────────────────────────────
  const particles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    delay: i * 1.2,
    x: 10 + i * 15,
    size: 3 + (i % 3) * 2,
    duration: 6 + i,
  }));

  // ── API Handlers ──────────────────────────────────────────────────
  const handleRatingSubmit = async () => {
    if (rating === 0 || !ratingName.trim()) return;
    setRatingLoading(true);
    setRatingError(null);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: `${ratingInsuranceType || 'general'} Insurance`,
          insuranceType: ratingInsuranceType || 'health',
          rating,
          title: ratingReview.trim().slice(0, 100) || `${rating}-star rating`,
          body: ratingReview.trim() || `${ratingName.trim()} rated us ${rating} stars`,
          reviewerName: ratingName.trim(),
          reviewerEmail: `${ratingName.trim().toLowerCase().replace(/\s+/g, '.')}@rating.paliwalinsure.in`,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setRatingSubmitted(true);
    } catch (err) {
      setRatingError({
        title: t('ratingForm.errorTitle'),
        message: err instanceof Error ? err.message : t('ratingForm.errorRetry'),
      });
    } finally {
      setRatingLoading(false);
    }
  };

  const handleLeadSubmit = async () => {
    if (!leadName.trim() || !leadPhone.trim()) return;
    setLeadLoading(true);
    setLeadError(null);

    try {
      const res = await fetch('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadName.trim(),
          email: leadEmail.trim() || undefined,
          phone: leadPhone.trim(),
          insuranceType: leadInsuranceNeed || undefined,
          city: leadCity.trim() || undefined,
          source: 'website',
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit lead');
      }

      setLeadSubmitted(true);
    } catch (err) {
      setLeadError({
        title: t('leadForm.errorTitle'),
        message: err instanceof Error ? err.message : t('leadForm.errorRetry'),
      });
    } finally {
      setLeadLoading(false);
    }
  };

  // ── Indian flag prefix for phone ──────────────────────────────────
  const phonePrefix = (
    <span className={`text-sm font-semibold text-primary flex items-center gap-1 pr-2 border-r ${isDark ? 'border-white/10' : 'border-border'}`}>
      🇮🇳 +91
    </span>
  );

  return (
    <section className="relative section-luxury section-luxury-alt overflow-hidden">
      {/* ── Background ────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Mesh gradient */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            background: `
              radial-gradient(ellipse at 20% 50%, hsl(var(--primary) 0.3) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, hsl(var(--primary) 0.2) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 80%, hsl(var(--primary) 0.15) 0%, transparent 50%)
            `,
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary) 0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) 0.4) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Radial gold glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] opacity-[0.08]"
          style={{
            background: 'radial-gradient(ellipse, hsl(var(--primary) 0.5) 0%, hsl(var(--primary) 0.1) 40%, transparent 70%)',
          }}
        />
        {/* Floating gold particles — desktop only */}
        <div className="hidden lg:block">
          {particles.map((p) => (
            <GoldParticle key={p.id} delay={p.delay} x={p.x} size={p.size} duration={p.duration} />
          ))}
        </div>
      </div>

      {/* ── Section Header ───────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mb-12 md:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="badge-premium-blue mb-6"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-3.5 h-3.5" />
            </motion.div>
            <span>
              {t('ratingForm.sectionBadge')}
            </span>
            <Zap className="w-3 h-3" />
          </motion.div>

          {/* Title */}
          <h2 className="text-hero mb-4">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block"
            >
              {t('ratingForm.sectionTitle1')}
            </motion.span>{' '}
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-block text-[#E8C872] dark:text-[#D4A853]"
            >
              {t('ratingForm.sectionTitle2')}
            </motion.span>
          </h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-body-lg max-w-3xl mx-auto"
          >
            {t('ratingForm.sectionDesc')}
          </motion.p>
        </motion.div>
      </div>

      {/* ── Forms Container ──────────────────────────────────────────── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative">

          {/* Connecting line between cards (desktop only) */}
          <ConnectingLine isDark={isDark} />

          {/* ═══════ LEFT CARD: Rating Form ═════════════════════════════ */}
          <TiltCard className="relative">
            <motion.div
              initial={{ opacity: 0, x: -50, rotateY: 5 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative"
            >
              <AnimatedBorder isDark={isDark}>
                <div className="premium-card premium-card-featured p-6 md:p-8 lg:p-10">

                  {/* Header */}
                  <div className="text-center mb-8">
                    <motion.div
                      className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#E8C872]/10 border border-[#E8C872]/20 mb-4 dark:bg-[#D4A853]/10 dark:border-[#D4A853]/20"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      <Star className="w-7 h-7 text-[#E8C872] dark:text-[#D4A853]" />
                    </motion.div>
                    <h3 className="text-card-title mb-2">
                      {t('ratingForm.heading')}
                    </h3>
                    <p className="text-sm md:text-base text-[#475569] dark:text-[#94A3B8]">
                      {t('ratingForm.subheading')}
                    </p>
                  </div>

                  <AnimatePresence mode="wait">
                    {ratingSubmitted ? (
                      <SuccessState message={t('ratingForm.success')} t={t} isDark={isDark} />
                    ) : (
                      <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-5"
                      >
                        {/* Error Banner */}
                        <AnimatePresence>
                          {ratingError && (
                            <ErrorBanner
                              error={ratingError}
                              onDismiss={() => setRatingError(null)}
                            />
                          )}
                        </AnimatePresence>

                        {/* Star Rating */}
                        <div className="flex flex-col items-center py-2">
                          <StarRating
                            value={rating}
                            onChange={setRating}
                            hoverValue={hoverRating}
                            onHover={setHoverRating}
                            t={t}
                          />
                        </div>

                        {/* Name */}
                        <GlassInput
                          icon={User}
                          placeholder={t('ratingForm.name')}
                          value={ratingName}
                          onChange={setRatingName}
                          isDark={isDark}
                        />

                        {/* Review */}
                        <GlassTextarea
                          icon={MessageSquare}
                          placeholder={t('ratingForm.review')}
                          value={ratingReview}
                          onChange={setRatingReview}
                          isDark={isDark}
                        />

                        {/* Insurance Type */}
                        <GlassSelect
                          icon={Shield}
                          placeholder={t('ratingForm.selectType')}
                          value={ratingInsuranceType}
                          onChange={setRatingInsuranceType}
                          options={INSURANCE_TYPE_KEYS.map(o => ({ value: o.value, label: t(o.key) }))}
                          isDark={isDark}
                        />

                        {/* Submit */}
                        <button
                          onClick={handleRatingSubmit}
                          disabled={rating === 0 || !ratingName.trim() || ratingLoading}
                          className="btn-luxury-primary btn-luxury-lg w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {ratingLoading ? t('ratingForm.submitting') : t('ratingForm.submit')}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </AnimatedBorder>
            </motion.div>
          </TiltCard>

          {/* ═══════ RIGHT CARD: Lead Form ══════════════════════════════ */}
          <TiltCard className="relative">
            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: -5 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <AnimatedBorder isDark={isDark}>
                <div className="premium-card premium-card-gold p-6 md:p-8 lg:p-10">

                  {/* Header */}
                  <div className="text-center mb-8">
                    <motion.div
                      className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/20 mb-4 dark:bg-[#3B82F6]/10 dark:border-[#3B82F6]/20"
                      whileHover={{ rotate: -10, scale: 1.1 }}
                    >
                      <Phone className="w-7 h-7 text-[#2563EB] dark:text-[#60A5FA]" />
                    </motion.div>
                    <h3 className="text-card-title mb-2">
                      {t('leadForm.heading')}
                    </h3>
                    <p className="text-sm md:text-base text-[#475569] dark:text-[#94A3B8]">
                      {t('leadForm.subheading')}
                    </p>
                  </div>

                  <AnimatePresence mode="wait">
                    {leadSubmitted ? (
                      <SuccessState
                        message={t('leadForm.success')}
                        showWhatsApp
                        whatsappLabel={t('leadForm.whatsappCta')}
                        t={t}
                        isDark={isDark}
                      />
                    ) : (
                      <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-5"
                      >
                        {/* Error Banner */}
                        <AnimatePresence>
                          {leadError && (
                            <ErrorBanner
                              error={leadError}
                              onDismiss={() => setLeadError(null)}
                            />
                          )}
                        </AnimatePresence>

                        {/* Name */}
                        <GlassInput
                          icon={User}
                          placeholder={t('leadForm.name')}
                          value={leadName}
                          onChange={setLeadName}
                          isDark={isDark}
                        />

                        {/* Phone with Indian flag */}
                        <GlassInput
                          icon={Phone}
                          placeholder={t('leadForm.phone')}
                          type="tel"
                          value={leadPhone}
                          onChange={setLeadPhone}
                          prefix={phonePrefix}
                          isDark={isDark}
                        />

                        {/* Email */}
                        <GlassInput
                          icon={Mail}
                          placeholder={t('leadForm.email')}
                          type="email"
                          value={leadEmail}
                          onChange={setLeadEmail}
                          isDark={isDark}
                        />

                        {/* Insurance Need */}
                        <GlassSelect
                          icon={Shield}
                          placeholder={t('leadForm.selectNeed')}
                          value={leadInsuranceNeed}
                          onChange={setLeadInsuranceNeed}
                          options={INSURANCE_NEED_KEYS.map(o => ({ value: o.value, label: t(o.key) }))}
                          isDark={isDark}
                        />

                        {/* City with suggestions */}
                        <CityInput
                          value={leadCity}
                          onChange={setLeadCity}
                          placeholder={t('leadForm.city')}
                          t={t}
                          isDark={isDark}
                        />

                        {/* Submit */}
                        <button
                          onClick={handleLeadSubmit}
                          disabled={!leadName.trim() || !leadPhone.trim() || leadLoading}
                          className="btn-luxury-gold btn-luxury-lg w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {leadLoading ? t('leadForm.submitting') : t('leadForm.submit')}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </AnimatedBorder>
            </motion.div>
          </TiltCard>

        </div>
      </div>

      {/* ── Section Divider ──────────────────────────────────────────── */}
      <div className="section-luxury-divider" />
    </section>
  );
}
