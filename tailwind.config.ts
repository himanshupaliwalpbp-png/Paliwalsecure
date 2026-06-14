import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
    darkMode: "class",
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
        extend: {
                colors: {
                        background: 'hsl(var(--background))',
                        foreground: 'hsl(var(--foreground))',
                        card: {
                                DEFAULT: 'hsl(var(--card))',
                                foreground: 'hsl(var(--card-foreground))'
                        },
                        popover: {
                                DEFAULT: 'hsl(var(--popover))',
                                foreground: 'hsl(var(--popover-foreground))'
                        },
                        primary: {
                                DEFAULT: 'hsl(var(--primary))',
                                foreground: 'hsl(var(--primary-foreground))'
                        },
                        secondary: {
                                DEFAULT: 'hsl(var(--secondary))',
                                foreground: 'hsl(var(--secondary-foreground))'
                        },
                        muted: {
                                DEFAULT: 'hsl(var(--muted))',
                                foreground: 'hsl(var(--muted-foreground))'
                        },
                        accent: {
                                DEFAULT: 'hsl(var(--accent))',
                                foreground: 'hsl(var(--accent-foreground))'
                        },
                        destructive: {
                                DEFAULT: 'hsl(var(--destructive))',
                                foreground: 'hsl(var(--destructive-foreground))'
                        },
                        border: 'hsl(var(--border))',
                        input: 'hsl(var(--input))',
                        ring: 'hsl(var(--ring))',
                        chart: {
                                '1': 'hsl(var(--chart-1))',
                                '2': 'hsl(var(--chart-2))',
                                '3': 'hsl(var(--chart-3))',
                                '4': 'hsl(var(--chart-4))',
                                '5': 'hsl(var(--chart-5))'
                        },
                        /* Paliwal Secure brand colors */
                        navy: '#0B2B5B',
                        gold: '#D4A017',
                        teal: '#0E7C7B',
                        cream: '#F8F9FA',
                },
                borderRadius: {
                        lg: 'var(--radius)',
                        md: 'calc(var(--radius) - 2px)',
                        sm: 'calc(var(--radius) - 4px)'
                },
                fontFamily: {
                        sans: ['var(--font-geist-sans)', 'Inter', 'system-ui', 'sans-serif'],
                        heading: ['var(--font-heading)', 'Sora', 'system-ui', 'sans-serif'],
                        mono: ['var(--font-geist-mono)', 'IBM Plex Mono', 'monospace'],
                },
                animation: {
                        'fade-in': 'fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                        'float': 'float 3s ease-in-out infinite',
                        'shimmer': 'shimmer 2s ease-in-out infinite',
                        'glow-pulse': 'glowPulse 2.5s ease-in-out infinite',
                        'gradient': 'gradientShift 8s ease infinite',
                },
                keyframes: {
                        fadeIn: {
                                '0%': { opacity: '0', transform: 'translateY(12px)' },
                                '100%': { opacity: '1', transform: 'translateY(0)' },
                        },
                        slideUp: {
                                '0%': { opacity: '0', transform: 'translateY(20px)' },
                                '100%': { opacity: '1', transform: 'translateY(0)' },
                        },
                        float: {
                                '0%, 100%': { transform: 'translateY(0)' },
                                '50%': { transform: 'translateY(-10px)' },
                        },
                        shimmer: {
                                '0%': { backgroundPosition: '-200% center' },
                                '100%': { backgroundPosition: '200% center' },
                        },
                        glowPulse: {
                                '0%, 100%': { boxShadow: '0 0 5px rgba(212, 160, 23, 0.25), 0 0 15px rgba(212, 160, 23, 0.08)' },
                                '50%': { boxShadow: '0 0 10px rgba(212, 160, 23, 0.4), 0 0 30px rgba(212, 160, 23, 0.15)' },
                        },
                        gradientShift: {
                                '0%': { backgroundPosition: '0% 50%' },
                                '50%': { backgroundPosition: '100% 50%' },
                                '100%': { backgroundPosition: '0% 50%' },
                        },
                },
        }
  },
  plugins: [tailwindcssAnimate],
};
export default config;
