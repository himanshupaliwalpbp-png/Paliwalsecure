'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/lib/i18n';

// ── Insurer data with brand details ──────────────────────────────────
interface InsurerItem {
  name: string;
  color: string;
  secondaryColor: string;
  logoType: 'shield' | 'circle' | 'hexagon' | 'diamond' | 'crest' | 'oval' | 'pill' | 'badge';
  initials: string;
  symbol: string; // SVG path or element key for unique design
}

const INSURERS: InsurerItem[] = [
  {
    name: 'HDFC Ergo',
    color: '#003B73',
    secondaryColor: '#0066CC',
    logoType: 'shield',
    initials: 'HE',
    symbol: 'shield-bold',
  },
  {
    name: 'ICICI Lombard',
    color: '#F7941D',
    secondaryColor: '#FFB347',
    logoType: 'circle',
    initials: 'IL',
    symbol: 'sun',
  },
  {
    name: 'Star Health',
    color: '#C8102E',
    secondaryColor: '#FF3D5A',
    logoType: 'diamond',
    initials: 'SH',
    symbol: 'star',
  },
  {
    name: 'Bajaj Allianz',
    color: '#003399',
    secondaryColor: '#3366CC',
    logoType: 'hexagon',
    initials: 'BA',
    symbol: 'hex',
  },
  {
    name: 'New India Assurance',
    color: '#1B5E20',
    secondaryColor: '#4CAF50',
    logoType: 'crest',
    initials: 'NI',
    symbol: 'ashoka',
  },
  {
    name: 'SBI General',
    color: '#00529B',
    secondaryColor: '#2196F3',
    logoType: 'circle',
    initials: 'SB',
    symbol: 'keyhole',
  },
  {
    name: 'Niva Bupa',
    color: '#6A1B9A',
    secondaryColor: '#AB47BC',
    logoType: 'oval',
    initials: 'NB',
    symbol: 'heart',
  },
  {
    name: 'Care Health',
    color: '#E65100',
    secondaryColor: '#FF8A50',
    logoType: 'pill',
    initials: 'CH',
    symbol: 'cross',
  },
  {
    name: 'Digit Insurance',
    color: '#0D47A1',
    secondaryColor: '#42A5F5',
    logoType: 'diamond',
    initials: 'DI',
    symbol: 'digit',
  },
  {
    name: 'Go Digit',
    color: '#00695C',
    secondaryColor: '#26A69A',
    logoType: 'circle',
    initials: 'GD',
    symbol: 'check',
  },
  {
    name: 'Tata AIG',
    color: '#0E1220',
    secondaryColor: '#37474F',
    logoType: 'shield',
    initials: 'TA',
    symbol: 'tata',
  },
  {
    name: 'Magma HDI',
    color: '#B71C1C',
    secondaryColor: '#EF5350',
    logoType: 'hexagon',
    initials: 'MH',
    symbol: 'flame',
  },
  {
    name: 'Royal Sundaram',
    color: '#1565C0',
    secondaryColor: '#64B5F6',
    logoType: 'crest',
    initials: 'RS',
    symbol: 'crown',
  },
  {
    name: 'Reliance General',
    color: '#1A237E',
    secondaryColor: '#5C6BC0',
    logoType: 'oval',
    initials: 'RG',
    symbol: 'reliance',
  },
  {
    name: 'Universal Sompo',
    color: '#004D40',
    secondaryColor: '#26A69A',
    logoType: 'badge',
    initials: 'US',
    symbol: 'globe',
  },
];

// ── SVG Logo Renderers ────────────────────────────────────────────────

function ShieldLogo({ insurer }: { insurer: InsurerItem }) {
  return (
    <svg viewBox="0 0 48 56" width="44" height="50" className="shrink-0 drop-shadow-md">
      <defs>
        <linearGradient id={`sg-${insurer.initials}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={insurer.secondaryColor} />
          <stop offset="100%" stopColor={insurer.color} />
        </linearGradient>
      </defs>
      {/* Shield body */}
      <path
        d="M24 2 L44 12 L44 30 Q44 46 24 54 Q4 46 4 30 L4 12 Z"
        fill={`url(#sg-${insurer.initials})`}
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
      />
      {/* Inner highlight */}
      <path
        d="M24 6 L40 14 L40 29 Q40 43 24 50 Q8 43 8 29 L8 14 Z"
        fill="rgba(255,255,255,0.08)"
      />
      {/* Symbol area */}
      {insurer.symbol === 'shield-bold' && (
        <text x="24" y="30" textAnchor="middle" fill="white" fontSize="14" fontWeight="800" fontFamily="system-ui" opacity="0.95">HE</text>
      )}
      {insurer.symbol === 'tata' && (
        <>
          <text x="24" y="28" textAnchor="middle" fill="white" fontSize="12" fontWeight="800" fontFamily="system-ui" opacity="0.95">T</text>
          <line x1="18" y1="33" x2="30" y2="33" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
          <text x="24" y="42" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="8" fontWeight="600" fontFamily="system-ui">AIG</text>
        </>
      )}
    </svg>
  );
}

function CircleLogo({ insurer }: { insurer: InsurerItem }) {
  return (
    <svg viewBox="0 0 52 52" width="46" height="46" className="shrink-0 drop-shadow-md">
      <defs>
        <linearGradient id={`cg-${insurer.initials}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={insurer.secondaryColor} />
          <stop offset="100%" stopColor={insurer.color} />
        </linearGradient>
      </defs>
      {/* Outer ring */}
      <circle cx="26" cy="26" r="24" fill={`url(#cg-${insurer.initials})`} />
      <circle cx="26" cy="26" r="22" fill="rgba(255,255,255,0.06)" />
      <circle cx="26" cy="26" r="20" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

      {insurer.symbol === 'sun' && (
        <>
          <circle cx="26" cy="24" r="7" fill="rgba(255,255,255,0.15)" />
          <text x="26" y="28" textAnchor="middle" fill="white" fontSize="12" fontWeight="800" fontFamily="system-ui">i</text>
          {/* Sun rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 26 + Math.cos(rad) * 11;
            const y1 = 24 + Math.sin(rad) * 11;
            const x2 = 26 + Math.cos(rad) * 14;
            const y2 = 24 + Math.sin(rad) * 14;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />;
          })}
        </>
      )}
      {insurer.symbol === 'keyhole' && (
        <>
          <circle cx="26" cy="20" r="6" fill="none" stroke="white" strokeWidth="2" opacity="0.9" />
          <line x1="26" y1="26" x2="26" y2="36" stroke="white" strokeWidth="2" opacity="0.9" />
          <line x1="23" y1="32" x2="29" y2="32" stroke="white" strokeWidth="1.5" opacity="0.7" />
        </>
      )}
      {insurer.symbol === 'check' && (
        <>
          <circle cx="26" cy="26" r="12" fill="rgba(255,255,255,0.12)" />
          <polyline points="19,26 24,31 34,21" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
        </>
      )}
    </svg>
  );
}

function DiamondLogo({ insurer }: { insurer: InsurerItem }) {
  return (
    <svg viewBox="0 0 52 52" width="46" height="46" className="shrink-0 drop-shadow-md">
      <defs>
        <linearGradient id={`dg-${insurer.initials}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={insurer.secondaryColor} />
          <stop offset="100%" stopColor={insurer.color} />
        </linearGradient>
      </defs>
      {/* Diamond shape */}
      <polygon
        points="26,2 50,26 26,50 2,26"
        fill={`url(#dg-${insurer.initials})`}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
      />
      <polygon
        points="26,6 46,26 26,46 6,26"
        fill="rgba(255,255,255,0.06)"
      />

      {insurer.symbol === 'star' && (
        <>
          <polygon
            points="26,10 28.5,19 38,19 30.5,24 33,33 26,28 19,33 21.5,24 14,19 23.5,19"
            fill="rgba(255,255,255,0.2)"
          />
          <text x="26" y="30" textAnchor="middle" fill="white" fontSize="10" fontWeight="800" fontFamily="system-ui" opacity="0.95">★</text>
        </>
      )}
      {insurer.symbol === 'digit' && (
        <text x="26" y="31" textAnchor="middle" fill="white" fontSize="14" fontWeight="800" fontFamily="system-ui" opacity="0.95">D</text>
      )}
    </svg>
  );
}

function HexagonLogo({ insurer }: { insurer: InsurerItem }) {
  return (
    <svg viewBox="0 0 52 52" width="46" height="46" className="shrink-0 drop-shadow-md">
      <defs>
        <linearGradient id={`hg-${insurer.initials}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={insurer.secondaryColor} />
          <stop offset="100%" stopColor={insurer.color} />
        </linearGradient>
      </defs>
      {/* Hexagon */}
      <polygon
        points="26,2 48,14 48,38 26,50 4,38 4,14"
        fill={`url(#hg-${insurer.initials})`}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
      />
      <polygon
        points="26,6 44,16 44,36 26,46 8,36 8,16"
        fill="rgba(255,255,255,0.06)"
      />

      {insurer.symbol === 'hex' && (
        <text x="26" y="30" textAnchor="middle" fill="white" fontSize="13" fontWeight="800" fontFamily="system-ui" opacity="0.95">BA</text>
      )}
      {insurer.symbol === 'flame' && (
        <>
          <path
            d="M26 12 C30 18 34 22 32 30 C31 34 28 36 26 38 C24 36 21 34 20 30 C18 22 22 18 26 12Z"
            fill="rgba(255,255,255,0.25)"
          />
          <text x="26" y="32" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="system-ui" opacity="0.9">MH</text>
        </>
      )}
    </svg>
  );
}

function CrestLogo({ insurer }: { insurer: InsurerItem }) {
  return (
    <svg viewBox="0 0 52 58" width="46" height="50" className="shrink-0 drop-shadow-md">
      <defs>
        <linearGradient id={`cr-${insurer.initials}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={insurer.secondaryColor} />
          <stop offset="100%" stopColor={insurer.color} />
        </linearGradient>
      </defs>
      {/* Crest / award badge shape */}
      <path
        d="M26 2 L46 10 L46 34 Q46 50 26 56 Q6 50 6 34 L6 10 Z"
        fill={`url(#cr-${insurer.initials})`}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
      />
      <path
        d="M26 6 L42 12 L42 33 Q42 47 26 52 Q10 47 10 33 L10 12 Z"
        fill="rgba(255,255,255,0.06)"
      />

      {insurer.symbol === 'ashoka' && (
        <>
          <circle cx="26" cy="24" r="10" fill="rgba(255,255,255,0.1)" />
          {/* Simplified Ashoka wheel */}
          <circle cx="26" cy="24" r="7" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
          <circle cx="26" cy="24" r="2" fill="rgba(255,255,255,0.6)" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x2 = 26 + Math.cos(rad) * 7;
            const y2 = 24 + Math.sin(rad) * 7;
            return <line key={i} x1="26" y1="24" x2={x2} y2={y2} stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />;
          })}
          <text x="26" y="44" textAnchor="middle" fill="white" fontSize="7" fontWeight="700" fontFamily="system-ui" opacity="0.85">NI</text>
        </>
      )}
      {insurer.symbol === 'crown' && (
        <>
          {/* Crown */}
          <polygon
            points="16,20 20,14 24,18 26,12 28,18 32,14 36,20"
            fill="rgba(255,255,255,0.3)"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="0.5"
          />
          <rect x="16" y="20" width="20" height="6" fill="rgba(255,255,255,0.15)" rx="1" />
          <text x="26" y="42" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="system-ui" opacity="0.85">RS</text>
        </>
      )}
    </svg>
  );
}

function OvalLogo({ insurer }: { insurer: InsurerItem }) {
  return (
    <svg viewBox="0 0 56 48" width="50" height="42" className="shrink-0 drop-shadow-md">
      <defs>
        <linearGradient id={`ov-${insurer.initials}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={insurer.secondaryColor} />
          <stop offset="100%" stopColor={insurer.color} />
        </linearGradient>
      </defs>
      {/* Oval / stadium shape */}
      <rect
        x="2" y="2" width="52" height="44" rx="22" ry="22"
        fill={`url(#ov-${insurer.initials})`}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
      />
      <rect
        x="5" y="5" width="46" height="38" rx="19" ry="19"
        fill="rgba(255,255,255,0.06)"
      />

      {insurer.symbol === 'heart' && (
        <>
          <path
            d="M28 18 C28 14 22 10 19 16 C16 22 28 32 28 32 C28 32 40 22 37 16 C34 10 28 14 28 18Z"
            fill="rgba(255,255,255,0.2)"
          />
          <text x="28" y="27" textAnchor="middle" fill="white" fontSize="7" fontWeight="700" fontFamily="system-ui" opacity="0.9">NB</text>
        </>
      )}
      {insurer.symbol === 'reliance' && (
        <>
          <circle cx="28" cy="20" r="8" fill="rgba(255,255,255,0.12)" />
          <path d="M28 12 L28 28 M22 20 L34 20" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
          <text x="28" y="40" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="system-ui" opacity="0.85">RG</text>
        </>
      )}
    </svg>
  );
}

function PillLogo({ insurer }: { insurer: InsurerItem }) {
  return (
    <svg viewBox="0 0 56 48" width="50" height="42" className="shrink-0 drop-shadow-md">
      <defs>
        <linearGradient id={`pl-${insurer.initials}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={insurer.secondaryColor} />
          <stop offset="100%" stopColor={insurer.color} />
        </linearGradient>
      </defs>
      {/* Rounded pill shape */}
      <rect
        x="2" y="4" width="52" height="40" rx="10" ry="10"
        fill={`url(#pl-${insurer.initials})`}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
      />
      <rect
        x="5" y="7" width="46" height="34" rx="8" ry="8"
        fill="rgba(255,255,255,0.06)"
      />

      {insurer.symbol === 'cross' && (
        <>
          <rect x="24" y="12" width="8" height="24" rx="2" fill="rgba(255,255,255,0.3)" />
          <rect x="18" y="18" width="20" height="12" rx="2" fill="rgba(255,255,255,0.3)" />
          <text x="28" y="40" textAnchor="middle" fill="white" fontSize="7" fontWeight="700" fontFamily="system-ui" opacity="0.85">CH</text>
        </>
      )}
    </svg>
  );
}

function BadgeLogo({ insurer }: { insurer: InsurerItem }) {
  return (
    <svg viewBox="0 0 52 52" width="46" height="46" className="shrink-0 drop-shadow-md">
      <defs>
        <linearGradient id={`bd-${insurer.initials}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={insurer.secondaryColor} />
          <stop offset="100%" stopColor={insurer.color} />
        </linearGradient>
      </defs>
      {/* Badge / rounded square */}
      <rect
        x="2" y="2" width="48" height="48" rx="12" ry="12"
        fill={`url(#bd-${insurer.initials})`}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
      />
      <rect
        x="5" y="5" width="42" height="42" rx="10" ry="10"
        fill="rgba(255,255,255,0.06)"
      />

      {insurer.symbol === 'globe' && (
        <>
          <circle cx="26" cy="22" r="10" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          <ellipse cx="26" cy="22" rx="5" ry="10" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          <line x1="16" y1="22" x2="36" y2="22" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          <text x="26" y="42" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="system-ui" opacity="0.85">US</text>
        </>
      )}
    </svg>
  );
}

// ── Logo renderer switch ──────────────────────────────────────────────
function InsurerLogo({ insurer }: { insurer: InsurerItem }) {
  switch (insurer.logoType) {
    case 'shield':
      return <ShieldLogo insurer={insurer} />;
    case 'circle':
      return <CircleLogo insurer={insurer} />;
    case 'diamond':
      return <DiamondLogo insurer={insurer} />;
    case 'hexagon':
      return <HexagonLogo insurer={insurer} />;
    case 'crest':
      return <CrestLogo insurer={insurer} />;
    case 'oval':
      return <OvalLogo insurer={insurer} />;
    case 'pill':
      return <PillLogo insurer={insurer} />;
    case 'badge':
      return <BadgeLogo insurer={insurer} />;
    default:
      return <ShieldLogo insurer={insurer} />;
  }
}

// ── Component ─────────────────────────────────────────────────────────
export default function InsurerLogoMarquee() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const isEnglish = language === 'en';
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const ariaLabel = isHindi
    ? 'AI तैयार | IRDAI सत्यापित | पूरे भारत में परिवारों का भरोसा'
    : isEnglish
      ? 'AI Ready | IRDAI Verified | Families trust across India'
      : 'AI Ready | IRDAI Verified | Poori India mein parivaron ka bharosa';

  const allInsurers = [...INSURERS, ...INSURERS];

  return (
    <section
      dir="ltr"
      className="relative w-full py-8 sm:py-10 overflow-hidden bg-background dark:bg-[#111111] section-luxury-divider"
      aria-label={ariaLabel}
    >
      {/* Fade edges - using bg-background for theme support */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-background dark:from-[#111111] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-background dark:from-[#111111] to-transparent z-10 pointer-events-none" />

      <div ref={ref} className="relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="group flex"
          style={{ width: 'max-content' }}
        >
          <div
            className="flex animate-marquee-left group-hover:[animation-play-state:paused]"
            style={{ animationDuration: '45s' }}
          >
            {allInsurers.map((insurer, idx) => (
              <div
                key={`insurer-${idx}`}
                className="flex items-center gap-3 px-5 sm:px-6 py-3 sm:py-4 shrink-0 mx-2 sm:mx-2.5 rounded-2xl bg-white dark:bg-white/5 border border-[#E8E2D6] dark:border-white/8 transition-all duration-300 hover:-translate-y-1 hover:shadow-premium hover:border-[#2563EB]/20 dark:hover:bg-white/8 dark:hover:border-[#3B82F6]/20 cursor-default"
              >
                {/* SVG Logo */}
                <InsurerLogo insurer={insurer} />
                {/* Full company name */}
                <span className="text-sm sm:text-[15px] font-semibold text-[#111111]/80 dark:text-[#F3EADB]/80 whitespace-nowrap transition-colors duration-300 font-heading tracking-tight">
                  {insurer.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
