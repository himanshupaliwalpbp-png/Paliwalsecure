/**
 * Paliwal Secure — Design Token System
 * ======================================
 * Comprehensive token system for the insurance website redesign.
 * Inspired by top Indian fintech (Aegon Life, Digit)
 * and global insurtech leaders (Lemonade).
 *
 * Philosophy: Modern, trustworthy, approachable.
 * Grid: 8px base. Radius: large & friendly. Shadows: subtle elevation.
 */

// ────────────────────────────────────────────────────────────────
// 1. COLOR PALETTE
// ────────────────────────────────────────────────────────────────

export const colors = {
  /** Primary gold — Golden Honey Amber #C98A1C, trust, authority, warmth */
  primary: {
    50:  '#FDF8ED',
    100: '#FAECC8',
    200: '#F5D88F',
    300: '#EFC95C',
    400: '#E0A830',  // Light Honey Gold — gradient highlight
    500: '#C98A1C',  // Golden Honey Amber — brand gold (CMYK: 0,32,86,21)
    600: '#A87516',  // Deep Honey — gradient shadow
    700: '#0F1C40',  // hover state
    800: '#162D5A',  // dark navy-blue
    900: '#1E3A8A',
    950: '#172554',
  },

  /** Accent amber/orange — CTAs, energy, urgency */
  accent: {
    50:  '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',  // primary CTA
    600: '#D97706',  // hover / pressed CTA
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
    950: '#451A03',
  },

  /** Teal — Arctic Glacier Cyan, brand accent, secondary actions, trust badges */
  teal: {
    50:  '#F0FDFA',
    100: '#CCFBF1',
    200: '#E8F7FB',
    300: '#9DDFEE',
    400: '#7ED3E6',  // Arctic Glacier Cyan — brand accent
    500: '#5CC1D8',  // deeper cyan
    600: '#0D9488',
    700: '#0F766E',
    800: '#115E59',
    900: '#134E4A',
    950: '#042F2E',
  },

  /** Success — confirmations, positive states */
  success: {
    50:  '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#059669',  // anchor
    600: '#047857',
    700: '#065F46',
    800: '#064E3B',
    900: '#022C22',
    950: '#011E17',
  },

  /** Danger — errors, destructive actions, alerts */
  danger: {
    50:  '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#DC2626',  // anchor
    600: '#B91C1C',
    700: '#991B1B',
    800: '#7F1D1D',
    900: '#450A0A',
    950: '#2A0505',
  },

  /** Warning — caution states */
  warning: {
    50:  '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#EAB308',
    600: '#CA8A04',
    700: '#A16207',
    800: '#854D0E',
    900: '#713F12',
    950: '#422006',
  },

  /** Info — informational states */
  info: {
    50:  '#FDF8ED',
    100: '#FAECC8',
    200: '#F5D88F',
    300: '#EFC95C',
    400: '#E0A830',
    500: '#C98A1C',
    600: '#0F1C40',
    700: '#0A1330',
    800: '#162D5A',
    900: '#1E3A8A',
    950: '#172554',
  },

  /** Neutral — Slate scale for backgrounds, text, borders */
  neutral: {
    50:  '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },

  /** Satin Graphite — silky black with subtle highlights & cracked detail */
  graphite: {
    50:  '#E8E9F0',
    100: '#C8C9D8',
    200: '#8A8CA8',
    300: '#5C5E78',
    400: '#2E3048',  // subtle highlight
    500: '#24253A',  // mid graphite
    600: '#1A1B2E',  // primary graphite
    700: '#13141F',  // deep graphite
    800: '#0E0F1A',  // darkest graphite
    900: '#080912',
    950: '#040508',
  },

  /** Semantic surface colors — quick-reference aliases */
  surface: {
    default:     '#FFFFFF',
    raised:      '#F8FAFC',
    overlay:     '#F1F5F9',
    sunken:      '#E2E8F0',
    inverted:    '#0F172A',
    'inverted-soft': '#1E293B',
  },

  /** Semantic text colors */
  text: {
    primary:    '#0F172A',
    secondary:  '#475569',
    tertiary:   '#94A3B8',
    disabled:   '#CBD5E1',
    inverted:   '#FFFFFF',
    'inverted-muted': '#94A3B8',
    link:       '#C98A1C',
    'link-hover': '#0F1C40',
  },

  /** Gradient definitions */
  gradient: {
    /** Hero / hero section background */
    hero: 'linear-gradient(135deg, #0A1330 0%, #C98A1C 50%, #00A9A6 100%)',
    /** CTA button gradient */
    cta: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    /** CTA button hover gradient */
    ctaHover: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
    /** Accent teal gradient */
    teal: 'linear-gradient(135deg, #00A9A6 0%, #0D9488 100%)',
    /** Trust badge / subtle bg */
    trust: 'linear-gradient(135deg, #EFF6FF 0%, #F0FDFA 100%)',
    /** Dark mode hero */
    heroDark: 'linear-gradient(135deg, #0A1330 0%, #162D5A 50%, #042F2E 100%)',
    /** Warm glow for feature cards */
    warm: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #F0FDFA 100%)',
  },
} as const;

export type ColorPalette = typeof colors;
export type PrimaryColorShade = keyof typeof colors.primary;
export type AccentColorShade = keyof typeof colors.accent;
export type TealColorShade = keyof typeof colors.teal;
export type NeutralColorShade = keyof typeof colors.neutral;
export type SurfaceColor = keyof typeof colors.surface;
export type TextColor = keyof typeof colors.text;
export type GradientName = keyof typeof colors.gradient;

// ────────────────────────────────────────────────────────────────
// 2. TYPOGRAPHY SCALE
// ────────────────────────────────────────────────────────────────

export const typography = {
  /**
   * Font families
   * - Cabinet Grotesk → Sora as fallback (already loaded)
   * - Inter for body text
   */
  fontFamily: {
    heading: "'Sora', 'Cabinet Grotesk', ui-sans-serif, system-ui, -apple-system, sans-serif",
    body:    "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
    mono:    "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
  },

  /** Font weight scale */
  fontWeight: {
    light:      300,
    regular:    400,
    medium:     500,
    semibold:   600,
    bold:       700,
    extrabold:  800,
    black:      900,
  },

  /**
   * Type scale — mobile-first.
   * Each entry: [fontSize, lineHeight]
   * Line heights are unitless multiples.
   */
  fontSize: {
    xs:   ['0.75rem',  1.5],   // 12px
    sm:   ['0.875rem', 1.5],   // 14px
    base: ['1rem',     1.6],   // 16px
    lg:   ['1.125rem', 1.6],   // 18px
    xl:   ['1.25rem',  1.5],   // 20px
    '2xl': ['1.5rem',  1.4],   // 24px
    '3xl': ['1.875rem', 1.3],  // 30px
    '4xl': ['2.25rem',  1.25], // 36px
    '5xl': ['3rem',     1.2],  // 48px
    '6xl': ['3.75rem',  1.1],  // 60px
    '7xl': ['4.5rem',   1.05], // 72px
  },

  /** Letter spacing */
  letterSpacing: {
    tighter: '-0.02em',
    tight:   '-0.01em',
    normal:  '0em',
    wide:    '0.025em',
    wider:   '0.05em',
    widest:  '0.1em',
  },

  /** Pre-composed heading styles — apply directly */
  heading: {
    display: {
      fontFamily: "'Sora', 'Cabinet Grotesk', ui-sans-serif, system-ui, sans-serif",
      fontSize:   '4.5rem',
      lineHeight: 1.05,
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h1: {
      fontFamily: "'Sora', 'Cabinet Grotesk', ui-sans-serif, system-ui, sans-serif",
      fontSize:   '3rem',
      lineHeight: 1.1,
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: "'Sora', 'Cabinet Grotesk', ui-sans-serif, system-ui, sans-serif",
      fontSize:   '2.25rem',
      lineHeight: 1.2,
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: "'Sora', 'Cabinet Grotesk', ui-sans-serif, system-ui, sans-serif",
      fontSize:   '1.875rem',
      lineHeight: 1.3,
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontFamily: "'Sora', 'Cabinet Grotesk', ui-sans-serif, system-ui, sans-serif",
      fontSize:   '1.5rem',
      lineHeight: 1.4,
      fontWeight: 600,
      letterSpacing: '0em',
    },
    h5: {
      fontFamily: "'Sora', 'Cabinet Grotesk', ui-sans-serif, system-ui, sans-serif",
      fontSize:   '1.25rem',
      lineHeight: 1.5,
      fontWeight: 600,
      letterSpacing: '0em',
    },
    h6: {
      fontFamily: "'Sora', 'Cabinet Grotesk', ui-sans-serif, system-ui, sans-serif",
      fontSize:   '1.125rem',
      lineHeight: 1.5,
      fontWeight: 600,
      letterSpacing: '0em',
    },
  },

  /** Pre-composed body styles */
  body: {
    large: {
      fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
      fontSize:   '1.125rem',
      lineHeight: 1.6,
      fontWeight: 400,
      letterSpacing: '0em',
    },
    default: {
      fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
      fontSize:   '1rem',
      lineHeight: 1.6,
      fontWeight: 400,
      letterSpacing: '0em',
    },
    small: {
      fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
      fontSize:   '0.875rem',
      lineHeight: 1.5,
      fontWeight: 400,
      letterSpacing: '0em',
    },
    caption: {
      fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
      fontSize:   '0.75rem',
      lineHeight: 1.5,
      fontWeight: 500,
      letterSpacing: '0.025em',
    },
    overline: {
      fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
      fontSize:   '0.75rem',
      lineHeight: 1.5,
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase' as const,
    },
  },
} as const;

export type Typography = typeof typography;
export type FontSizeStep = keyof typeof typography.fontSize;
export type HeadingStyle = keyof typeof typography.heading;
export type BodyStyle = keyof typeof typography.body;

// ────────────────────────────────────────────────────────────────
// 3. SPACING — 8px grid system
// ────────────────────────────────────────────────────────────────

export const spacing = {
  0:   '0px',
  0.5: '2px',
  1:   '4px',
  1.5: '6px',
  2:   '8px',
  3:   '12px',
  4:   '16px',
  5:   '20px',
  6:   '24px',
  8:   '32px',
  10:  '40px',
  12:  '48px',
  16:  '64px',
  20:  '80px',
  24:  '96px',
  32:  '128px',
  40:  '160px',
  48:  '192px',
} as const;

/** Numeric spacing values (px) for JS calculations */
export const spacingPx = {
  0:   0,
  2:   2,
  4:   4,
  6:   6,
  8:   8,
  12:  12,
  16:  16,
  20:  20,
  24:  24,
  32:  32,
  40:  40,
  48:  48,
  64:  64,
  80:  80,
  96:  96,
  128: 128,
  160: 160,
  192: 192,
} as const;

export type Spacing = typeof spacing;
export type SpacingKey = keyof typeof spacing;
export type SpacingPxKey = keyof typeof spacingPx;

// ────────────────────────────────────────────────────────────────
// 4. BORDER RADIUS — large friendly corners
// ────────────────────────────────────────────────────────────────

export const radius = {
  none:   '0px',
  xs:     '4px',
  sm:     '6px',
  md:     '8px',
  lg:     '12px',
  xl:     '16px',
  '2xl':  '20px',
  '3xl':  '24px',
  full:   '9999px',
} as const;

export type Radius = typeof radius;
export type RadiusKey = keyof typeof radius;

// ────────────────────────────────────────────────────────────────
// 5. SHADOWS — subtle elevation system
// ────────────────────────────────────────────────────────────────

export const shadows = {
  none: 'none',

  /** Extra subtle — for dividers, hairline elevation */
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.04)',

  /** Small — cards at rest */
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',

  /** Medium — cards on hover, dropdowns */
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.07)',

  /** Large — modals, popovers */
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.08)',

  /** Extra large — hero floating elements */
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',

  /** Glassmorphism — frosted glass effect */
  glass: '0 8px 32px 0 rgba(10, 22, 40, 0.12)',

  /** Inner shadow for inset elements */
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',

  /** Colored shadow — primary */
  primary: '0 8px 24px -4px rgba(201, 138, 28, 0.24)',

  /** Colored shadow — accent/CTA */
  accent: '0 8px 24px -4px rgba(245, 158, 11, 0.32)',

  /** Colored shadow — teal */
  teal: '0 8px 24px -4px rgba(0, 169, 166, 0.24)',
} as const;

export type Shadows = typeof shadows;
export type ShadowKey = keyof typeof shadows;

// ────────────────────────────────────────────────────────────────
// 6. ANIMATION TIMING
// ────────────────────────────────────────────────────────────────

export const animation = {
  /** Duration scale (ms) */
  duration: {
    instant:  75,
    fast:     150,
    normal:   250,
    slow:     350,
    slower:   500,
    slowest:  700,
    crawl:    1000,
  },

  /** Easing curves */
  easing: {
    linear:       'linear',
    easeIn:       'cubic-bezier(0.4, 0, 1, 1)',
    easeOut:      'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut:    'cubic-bezier(0.4, 0, 0.2, 1)',
    /** Snappy deceleration — default for most UI transitions */
    default:      'cubic-bezier(0.25, 0.1, 0.25, 1)',
    /** Smooth entrance with overshoot */
    overshoot:    'cubic-bezier(0.34, 1.56, 0.64, 1)',
    /** Bouncy entrance */
    bounce:       'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    /** Smooth deceleration for fading in */
    fadeOut:      'cubic-bezier(0.4, 0, 0.6, 1)',
    /** Smooth acceleration for fading out */
    fadeIn:       'cubic-bezier(0.4, 0, 0.2, 1)',
    /** Spring-like for interactive elements */
    spring:       'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },

  /** Pre-composed transition presets */
  transition: {
    fast:     '150ms cubic-bezier(0.25, 0.1, 0.25, 1)',
    default:  '250ms cubic-bezier(0.25, 0.1, 0.25, 1)',
    slow:     '350ms cubic-bezier(0.25, 0.1, 0.25, 1)',
    bounce:   '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    spring:   '400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    fade:     '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slide:    '350ms cubic-bezier(0.25, 0.1, 0.25, 1)',
    scale:    '200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  },
} as const;

export type Animation = typeof animation;
export type DurationKey = keyof typeof animation.duration;
export type EasingKey = keyof typeof animation.easing;
export type TransitionPreset = keyof typeof animation.transition;

// ────────────────────────────────────────────────────────────────
// 7. BREAKPOINTS
// ────────────────────────────────────────────────────────────────

export const breakpoints = {
  xs:  '475px',
  sm:  '640px',
  md:  '768px',
  lg:  '1024px',
  xl:  '1280px',
  '2xl': '1536px',
} as const;

/** Numeric breakpoint values for JS logic */
export const breakpointsPx = {
  xs:  475,
  sm:  640,
  md:  768,
  lg:  1024,
  xl:  1280,
  '2xl': 1536,
} as const;

export type Breakpoints = typeof breakpoints;
export type BreakpointKey = keyof typeof breakpoints;

// ────────────────────────────────────────────────────────────────
// 8. Z-INDEX SCALE
// ────────────────────────────────────────────────────────────────

export const zIndex = {
  base:       0,
  dropdown:   10,
  sticky:     20,
  fixed:      30,
  overlay:    40,
  modal:      50,
  popover:    60,
  toast:      70,
  tooltip:    80,
  navbar:     90,
  sidebar:    95,
  sheet:      100,
  max:        9999,
} as const;

export type ZIndex = typeof zIndex;
export type ZIndexKey = keyof typeof zIndex;

// ────────────────────────────────────────────────────────────────
// 9. COMPONENT-SPECIFIC TOKENS
// ────────────────────────────────────────────────────────────────

export const components = {
  /** Navbar / Header */
  navbar: {
    height:         '72px',
    heightMobile:   '64px',
    paddingX:       '24px',
    paddingXMobile: '16px',
    bg:             'rgba(255, 255, 255, 0.85)',
    bgDark:         'rgba(15, 23, 42, 0.9)',
    blur:           '12px',
    border:         '1px solid rgba(226, 232, 240, 0.6)',
    borderDark:     '1px solid rgba(51, 65, 85, 0.6)',
    shadow:         '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
    logoHeight:     '36px',
    logoHeightMobile: '28px',
    zIndex:         90,
  },

  /** Cards */
  card: {
    padding:        '24px',
    paddingMobile:  '16px',
    borderRadius:   '16px',
    border:         '1px solid #E2E8F0',
    borderDark:     '1px solid #334155',
    bg:             '#FFFFFF',
    bgDark:         '#1E293B',
    shadow:         '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
    shadowHover:    '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.08)',
    transition:     '250ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  },

  /** Buttons */
  button: {
    /** Primary — gold CTA */
    primary: {
      bg:             '#C98A1C',
      bgHover:        '#0F1C40',
      bgActive:       '#0A1330',
      text:           '#FFFFFF',
      borderRadius:   '12px',
      paddingX:       '24px',
      paddingY:       '12px',
      fontSize:       '0.9375rem',  // 15px — slightly larger than sm
      fontWeight:     600,
      shadow:         '0 2px 4px -1px rgba(201, 138, 28, 0.2)',
      shadowHover:    '0 8px 24px -4px rgba(201, 138, 28, 0.24)',
      transition:     '250ms cubic-bezier(0.25, 0.1, 0.25, 1)',
    },
    /** Accent — amber/orange CTA (highest energy) */
    accent: {
      bg:             '#F59E0B',
      bgHover:        '#D97706',
      bgActive:       '#B45309',
      text:           '#FFFFFF',
      borderRadius:   '12px',
      paddingX:       '24px',
      paddingY:       '12px',
      fontSize:       '0.9375rem',
      fontWeight:     600,
      shadow:         '0 2px 4px -1px rgba(245, 158, 11, 0.2)',
      shadowHover:    '0 8px 24px -4px rgba(245, 158, 11, 0.32)',
      transition:     '250ms cubic-bezier(0.25, 0.1, 0.25, 1)',
    },
    /** Secondary — outlined */
    secondary: {
      bg:             'transparent',
      bgHover:        '#F8FAFC',
      bgActive:       '#F1F5F9',
      text:           '#C98A1C',
      border:         '1.5px solid #C98A1C',
      borderRadius:   '12px',
      paddingX:       '24px',
      paddingY:       '12px',
      fontSize:       '0.9375rem',
      fontWeight:     600,
      transition:     '250ms cubic-bezier(0.25, 0.1, 0.25, 1)',
    },
    /** Ghost — minimal */
    ghost: {
      bg:             'transparent',
      bgHover:        '#FDF8ED',
      bgActive:       '#FAECC8',
      text:           '#C98A1C',
      borderRadius:   '12px',
      paddingX:       '16px',
      paddingY:       '8px',
      fontSize:       '0.9375rem',
      fontWeight:     500,
      transition:     '150ms cubic-bezier(0.25, 0.1, 0.25, 1)',
    },
    /** Size variants */
    sizes: {
      sm: {
        paddingX:     '16px',
        paddingY:     '8px',
        fontSize:     '0.8125rem',  // 13px
        borderRadius: '8px',
      },
      md: {
        paddingX:     '24px',
        paddingY:     '12px',
        fontSize:     '0.9375rem',  // 15px
        borderRadius: '12px',
      },
      lg: {
        paddingX:     '32px',
        paddingY:     '16px',
        fontSize:     '1.0625rem',  // 17px
        borderRadius: '16px',
      },
      xl: {
        paddingX:     '40px',
        paddingY:     '20px',
        fontSize:     '1.125rem',   // 18px
        borderRadius: '20px',
      },
    },
  },

  /** Input fields */
  input: {
    bg:             '#FFFFFF',
    bgDark:         '#1E293B',
    border:         '1.5px solid #E2E8F0',
    borderDark:     '1.5px solid #475569',
    borderFocus:    '1.5px solid #C98A1C',
    borderError:    '1.5px solid #DC2626',
    borderRadius:   '12px',
    paddingX:       '16px',
    paddingY:       '12px',
    fontSize:       '1rem',
    placeholder:    '#94A3B8',
    text:           '#0F172A',
    textDark:       '#F8FAFC',
    shadow:         'none',
    shadowFocus:    '0 0 0 3px rgba(201, 138, 28, 0.12)',
    transition:     '200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  },

  /** Badge / tag */
  badge: {
    borderRadius:   '9999px',
    paddingX:       '10px',
    paddingY:       '4px',
    fontSize:       '0.75rem',
    fontWeight:     600,
    letterSpacing:  '0.025em',
    variants: {
      default:  { bg: '#F1F5F9', text: '#475569' },
      primary:  { bg: '#FDF8ED', text: '#C98A1C' },
      accent:   { bg: '#FFFBEB', text: '#B45309' },
      teal:     { bg: '#F0FDFA', text: '#0F766E' },
      success:  { bg: '#ECFDF5', text: '#065F46' },
      danger:   { bg: '#FEF2F2', text: '#991B1B' },
      warning:  { bg: '#FFFBEB', text: '#854D0E' },
    },
  },

  /** Trust badges / seal */
  trustBadge: {
    borderRadius:   '16px',
    padding:        '16px',
    bg:             'linear-gradient(135deg, #EFF6FF 0%, #F0FDFA 100%)',
    border:         '1px solid rgba(201, 138, 28, 0.08)',
    iconSize:       '32px',
    fontSize:       '0.8125rem',
  },

  /** Insurance product card */
  productCard: {
    borderRadius:   '20px',
    padding:        '24px',
    paddingMobile:  '16px',
    border:         '1px solid #E2E8F0',
    borderHover:    '1px solid #C98A1C',
    bg:             '#FFFFFF',
    shadow:         '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
    shadowHover:    '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
    iconBg:         '#FDF8ED',
    iconSize:       '48px',
    transition:     '350ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  },

  /** Testimonial card */
  testimonial: {
    borderRadius:   '20px',
    padding:        '32px',
    paddingMobile:  '20px',
    bg:             '#FFFFFF',
    border:         '1px solid #E2E8F0',
    shadow:         '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
    starColor:      '#F59E0B',
    avatarSize:     '48px',
  },

  /** Section layout */
  section: {
    paddingY:       '96px',
    paddingYMobile: '64px',
    paddingX:       '24px',
    maxWidth:       '1280px',
    maxWidthNarrow: '960px',
  },

  /** Hero section */
  hero: {
    minHeight:      '600px',
    minHeightMobile:'520px',
    paddingY:       '80px',
    paddingYMobile: '48px',
  },

  /** Feature grid */
  featureGrid: {
    gap:            '24px',
    gapMobile:      '16px',
    columns:        3,
    columnsMobile:  1,
    columnsTablet:  2,
  },

  /** Footer */
  footer: {
    bg:             '#0F172A',
    text:           '#94A3B8',
    textHeading:    '#F8FAFC',
    linkHover:      '#C98A1C',
    paddingY:       '64px',
    paddingYMobile: '48px',
    divider:        '1px solid #1E293B',
  },

  /** Tooltip */
  tooltip: {
    bg:             '#1E293B',
    bgDark:         '#334155',
    text:           '#F8FAFC',
    borderRadius:   '8px',
    padding:        '8px 12px',
    fontSize:       '0.8125rem',
    shadow:         '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    arrowSize:      '6px',
  },

  /** Modal / Dialog */
  modal: {
    overlayBg:      'rgba(15, 23, 42, 0.6)',
    overlayBlur:    '4px',
    bg:             '#FFFFFF',
    bgDark:         '#1E293B',
    borderRadius:   '24px',
    padding:        '32px',
    shadow:         '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    maxWidth:       '520px',
  },

  /** Toast / notification */
  toast: {
    borderRadius:   '12px',
    padding:        '16px',
    shadow:         '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.08)',
    variants: {
      success: { bg: '#ECFDF5', border: '#059669', text: '#065F46', icon: '#059669' },
      error:   { bg: '#FEF2F2', border: '#DC2626', text: '#991B1B', icon: '#DC2626' },
      warning: { bg: '#FFFBEB', border: '#EAB308', text: '#854D0E', icon: '#EAB308' },
      info:    { bg: '#FDF8ED', border: '#C98A1C', text: '#C98A1C', icon: '#C98A1C' },
    },
  },

  /** Checkbox / Radio */
  checkbox: {
    size:           '20px',
    borderRadius:   '6px',
    border:         '2px solid #CBD5E1',
    borderChecked:  '2px solid #C98A1C',
    bgChecked:      '#C98A1C',
    checkColor:     '#FFFFFF',
    transition:     '200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  },

  /** Toggle / Switch */
  switch: {
    width:          '44px',
    height:         '24px',
    borderRadius:   '9999px',
    bgOff:          '#CBD5E1',
    bgOn:           '#C98A1C',
    thumbSize:      '18px',
    thumbOffset:    '3px',
    transition:     '250ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  },
} as const;

export type Components = typeof components;
export type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost';
export type ButtonSize = keyof typeof components.button.sizes;
export type BadgeVariant = keyof typeof components.badge.variants;
export type ToastVariant = keyof typeof components.toast.variants;

// ────────────────────────────────────────────────────────────────
// AGGREGATE EXPORT
// ────────────────────────────────────────────────────────────────

/**
 * Complete design token system — single source of truth.
 * Import individual groups or the aggregate object.
 */
export const designTokens = {
  colors,
  typography,
  spacing,
  spacingPx,
  radius,
  shadows,
  animation,
  breakpoints,
  breakpointsPx,
  zIndex,
  components,
} as const;

export type DesignTokens = typeof designTokens;

// ────────────────────────────────────────────────────────────────
// UTILITY HELPERS
// ────────────────────────────────────────────────────────────────

/**
 * Get a color value by palette and shade.
 * Usage: `getColor('primary', 500)` → '#C98A1C'
 */
export function getColor(
  palette: 'primary' | 'accent' | 'teal' | 'success' | 'danger' | 'warning' | 'info' | 'neutral',
  shade: number
): string {
  const shadeKey = String(shade) as keyof typeof colors[typeof palette];
  return colors[palette][shadeKey];
}

/**
 * Get a CSS custom property string for a color.
 * Assumes you've registered these as CSS variables.
 * Usage: `cssVar('primary', 500)` → 'var(--color-primary-500)'
 */
export function cssVar(
  palette: string,
  shade?: number | string
): string {
  return shade !== undefined
    ? `var(--color-${palette}-${shade})`
    : `var(--color-${palette})`;
}

/**
 * Responsive spacing multiplier — returns spacing value
 * multiplied by the given factor on the 8px grid.
 * Usage: `gridUnits(3)` → '24px'
 */
export function gridUnits(multiplier: number): string {
  return `${multiplier * 8}px`;
}

/**
 * Build a CSS transition string from preset.
 * Usage: `transition('default')` → '250ms cubic-bezier(0.25, 0.1, 0.25, 1)'
 */
export function transition(preset: TransitionPreset): string {
  return animation.transition[preset];
}

/**
 * Build a responsive media query string.
 * Usage: `mq('md')` → '@media (min-width: 768px)'
 */
export function mq(breakpoint: BreakpointKey): string {
  return `@media (min-width: ${breakpoints[breakpoint]})`;
}

/**
 * Compose shadow + colored shadow for hover states.
 * Usage: `hoverShadow('primary')` → combined shadow string
 */
export function hoverShadow(color: 'primary' | 'accent' | 'teal'): string {
  return `${shadows.md}, ${shadows[color]}`;
}

/**
 * Generate CSS custom property declarations from all tokens.
 * Useful for injecting into :root or [data-theme="dark"].
 */
export function generateCSSVariables(): Record<string, string> {
  const vars: Record<string, string> = {};

  // Color palettes
  const palettes = ['primary', 'accent', 'teal', 'success', 'danger', 'warning', 'info', 'neutral'] as const;
  for (const palette of palettes) {
    for (const [shade, value] of Object.entries(colors[palette])) {
      vars[`--color-${palette}-${shade}`] = value;
    }
  }

  // Surface colors
  for (const [key, value] of Object.entries(colors.surface)) {
    vars[`--color-surface-${key}`] = value;
  }

  // Text colors
  for (const [key, value] of Object.entries(colors.text)) {
    vars[`--color-text-${key}`] = value;
  }

  // Spacing
  for (const [key, value] of Object.entries(spacing)) {
    vars[`--spacing-${key}`] = value;
  }

  // Radius
  for (const [key, value] of Object.entries(radius)) {
    vars[`--radius-${key}`] = value;
  }

  // Shadows
  for (const [key, value] of Object.entries(shadows)) {
    vars[`--shadow-${key}`] = value;
  }

  // Z-index
  for (const [key, value] of Object.entries(zIndex)) {
    vars[`--z-${key}`] = String(value);
  }

  return vars;
}
