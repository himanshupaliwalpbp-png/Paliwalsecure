'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Brain, ShieldCheck, Mic, MessageSquare, Menu, X, ArrowRight,
  Star, ChevronRight, Phone, Mail, MapPin, Heart, Car, Plane,
  Home as HomeIcon, Search, BookOpen, AlertTriangle, TrendingUp,
  QrCode, ExternalLink, CheckCircle2, XCircle, Clock, Sparkles,
  Calculator, Zap, Users, Target, Handshake, ChevronDown, Award,
  ArrowUpRight, Globe, Play, Quote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import {
  categoryInfo,
  getPlansByCategory,
  type InsuranceCategory,
  type UserProfile,
  IRDAI_MANDATORY_DISCLAIMER,
  dripCampaigns,
  complianceChecklist,
  marketInsights,
  insuranceCompanies,
  diseaseSpecificPlans,
} from '@/lib/insurance-data';
import CompanyComparisonTable from '@/components/CompanyComparisonTable';
import KnowledgeBaseSection from '@/components/KnowledgeBaseSection';
import { ThemeToggle } from '@/components/ThemeToggle';
import { DailyTip } from '@/components/DailyTip';
import { fireConfetti } from '@/components/Confetti';
import { ProductCardSkeleton } from '@/components/SkeletonLoader';
import MobileBottomNav from '@/components/MobileBottomNav';
import dynamic from 'next/dynamic';

const ReviewSection = dynamic(() => import('@/components/ReviewSection'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
    </div>
  ),
});
const PWAInstallPrompt = dynamic(() => import('@/components/PWAInstallPrompt'), { ssr: false });
const ConnectionStatus = dynamic(() => import('@/components/ConnectionStatus'), { ssr: false });

const CalculatorSection = dynamic(() => import('@/components/CalculatorSection'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
    </div>
  ),
});
const GameOfLife = dynamic(() => import('@/components/GameOfLife'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
    </div>
  ),
});
const EmbeddedChatBot = dynamic(() => import('@/components/EmbeddedChatBot'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
    </div>
  ),
});
const OnboardingFlow = dynamic(() => import('@/components/OnboardingFlow'), {
  ssr: false,
});

// ── Animated Counter Hook ──────────────────────────────────────────────────
function useAnimatedCounter(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (target === 0 || hasStarted.current) return;
    hasStarted.current = true;

    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [target, duration]);

  return count;
}

// ── Category Icon Map ─────────────────────────────────────────────────────
function getCategoryIcon(iconName: string) {
  const icons: Record<string, React.ElementType> = {
    Heart,
    Shield,
    Car,
    Plane,
    Home: HomeIcon,
  };
  return icons[iconName] || Shield;
}

// ── Section Animation Variants ─────────────────────────────────────────────
const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ── Feature Data (Hinglish) ───────────────────────────────────────────────
const features = [
  {
    icon: Brain,
    title: 'AI-Powered Sujhav',
    description:
      'AI jo samajhta hai aapki zaroorat — personalized recommendations, bas aapke liye',
    gradient: 'from-indigo-500 to-blue-600',
    color: 'text-indigo-600',
  },
  {
    icon: ShieldCheck,
    title: 'IRDAI Compliant',
    description:
      'Saari recommendations IRDAI guidelines ke according — poori transparency, koi chhupana nahi',
    gradient: 'from-blue-500 to-cyan-500',
    color: 'text-blue-600',
  },
  {
    icon: Mic,
    title: 'Voice-First / Boliye',
    description:
      'Apni bhasha mein poochiye — Hindi, English, ya Hinglish, hum samajh lenge',
    gradient: 'from-amber-500 to-orange-500',
    color: 'text-amber-600',
  },
  {
    icon: MessageSquare,
    title: 'Zero Jargon / Aasan Bhasha',
    description:
      'Insurance ki complex terms ko aasan Hindi/Hinglish mein samjhiye — koi confusion nahi',
    gradient: 'from-rose-500 to-pink-500',
    color: 'text-rose-600',
  },
];

// ── How It Works Steps ──────────────────────────────────────────────────────
const howItWorksSteps = [
  {
    num: 1,
    icon: Target,
    title: 'Tell Your Needs',
    description: 'Apni family, budget aur zarooratein bataiye — hum sunenge aur samjhenge',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    num: 2,
    icon: Brain,
    title: 'Get Top 3 Plans',
    description: 'AI 51+ insurers compare karta hai — CSR, score aur price ke saath top 3 plans',
    gradient: 'from-indigo-500 to-violet-600',
  },
  {
    num: 3,
    icon: Handshake,
    title: 'Buy or Consult',
    description: 'Online khareedein ya expert se baat karein — dono mein aasan claim process',
    gradient: 'from-amber-500 to-orange-500',
  },
];

// ── Testimonials Data ──────────────────────────────────────────────────────
const testimonials = [
  { name: 'Rajesh Kumar', role: 'Business Owner, Delhi', rating: 5, quote: 'InsureGPT ne mujhe 15 minutes mein sahi health plan dhundh diya — jo agent 2 week nahi kar paya!', avatar: 'RK' },
  { name: 'Priya Sharma', role: 'IT Professional, Bangalore', rating: 5, quote: 'Claim process itna aasan tha ki mujhe believe nahi hua. Paliwal Secure ne 3 din mein approve karwa diya!', avatar: 'PS' },
  { name: 'Amit Patel', role: 'Teacher, Ahmedabad', rating: 4, quote: 'Hinglish mein insurance samajhna itna easy? InsureGPT ne sab clear kar diya — koi jargon nahi!', avatar: 'AP' },
  { name: 'Sunita Verma', role: 'Homemaker, Lucknow', rating: 5, quote: 'Voice feature ekdum perfect hai. Hindi mein poocha, Hindi mein jawab mila. Best experience!', avatar: 'SV' },
  { name: 'Vikram Singh', role: 'Farmer, Jaipur', rating: 5, quote: 'Crop insurance ke liye Paliwal Secure se baat ki — WhatsApp pe turant response mila. Impressive!', avatar: 'VS' },
  { name: 'Meera Reddy', role: 'Doctor, Hyderabad', rating: 5, quote: 'As a doctor, I appreciate their IRDAI compliance and transparent recommendations. Highly trustworthy!', avatar: 'MR' },
];

// ── Market Insight Category Config ─────────────────────────────────────────
function getInsightStyle(cat: string) {
  switch (cat) {
    case 'opportunity':
      return { color: 'text-blue-400', bg: 'bg-blue-900/40', border: 'border-blue-700/50', icon: TrendingUp };
    case 'pain-point':
      return { color: 'text-rose-400', bg: 'bg-rose-900/40', border: 'border-rose-700/50', icon: AlertTriangle };
    case 'regulatory':
      return { color: 'text-amber-400', bg: 'bg-amber-900/40', border: 'border-amber-700/50', icon: ShieldCheck };
    case 'competitor-gap':
      return { color: 'text-violet-400', bg: 'bg-violet-900/40', border: 'border-violet-700/50', icon: Sparkles };
    default:
      return { color: 'text-slate-400', bg: 'bg-slate-800/50', border: 'border-slate-700/50', icon: TrendingUp };
  }
}

// ── Insurer names for trust bar ────────────────────────────────────────────
const insurerNames = [
  'HDFC ERGO', 'Star Health', 'Acko', 'ICICI Lombard', 'Niva Bupa',
  'Digit', 'Bajaj Allianz', 'TATA AIG', 'Care Health', 'Aditya Birla',
  'SBI Life', 'LIC',
];

// ============================================================================
// Main Page Component
// ============================================================================

export default function PaliwalSecurePage() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeCategory, setActiveCategory] = useState<InsuranceCategory>('health');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [whatsappPhone, setWhatsappPhone] = useState('');

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    insuranceType: '',
    message: '',
  });

  const { toast } = useToast();
  const contactRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // Animated stat counters
  const stat1 = useAnimatedCounter(heroVisible ? 700 : 0, 2000);
  const stat2 = useAnimatedCounter(heroVisible ? 3 : 0, 1500);
  const stat3 = useAnimatedCounter(heroVisible ? 87 : 0, 2000);
  const trustCount = useAnimatedCounter(heroVisible ? 500 : 0, 2000);

  // Mark hero visible on mount
  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // WhatsApp handler
  const handleWhatsAppClick = useCallback(() => {
    const welcomeMsg = dripCampaigns[0]?.welcomeMessage || 'Namaste! 🙏 Main Paliwal Secure hoon — aapka insurance guide. Kaise madad kar sakta hoon?';
    const waUrl = `https://wa.me/919999999999?text=${encodeURIComponent(welcomeMsg)}`;
    window.open(waUrl, '_blank');
  }, [whatsappPhone]);

  // Contact form submit
  const handleContactSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!contactForm.name || !contactForm.email || !contactForm.message) {
        toast({
          title: 'Missing fields',
          description: 'Please fill in name, email, and message.',
          variant: 'destructive',
        });
        return;
      }

      setIsSubmitting(true);
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contactForm),
        });
        const data = await res.json();

        if (res.ok && data.success) {
          fireConfetti();
          toast({
            title: 'Message sent! 🎉',
            description: data.message,
          });
          setContactForm({
            name: '',
            email: '',
            phone: '',
            insuranceType: '',
            message: '',
          });
        } else {
          toast({
            title: 'Error',
            description: data.error || 'Something went wrong.',
            variant: 'destructive',
          });
        }
      } catch {
        toast({
          title: 'Network error',
          description: 'Please check your connection and try again.',
          variant: 'destructive',
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [contactForm, toast]
  );

  // Onboarding handlers
  const handleOnboardingComplete = useCallback((profile: UserProfile) => {
    setUserProfile(profile);
    setShowOnboarding(false);
    toast({
      title: 'Profile saved! 🎯',
      description: 'Your personalized recommendations are ready.',
    });
  }, [toast]);

  const handleOnboardingSkip = useCallback(() => {
    setShowOnboarding(false);
  }, []);

  // Get current category plans
  const currentPlans = getPlansByCategory(activeCategory);
  const currentCategoryInfo = categoryInfo.find((c) => c.id === activeCategory);

  // Nav links — InsureGyaan prominently placed
  const navLinks = [
    { id: 'knowledge-base', label: 'InsureGyaan', icon: BookOpen },
    { id: 'insuregpt-chat', label: 'InsureGPT', icon: Brain },
    { id: 'calculators', label: 'Calculators', icon: Calculator },
    { id: 'products', label: 'Products', icon: Shield },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'features', label: 'Features', icon: Sparkles },
    { id: 'contact', label: 'Contact', icon: Phone },
  ];

  // Category card config
  const categoryCards = [
    { id: 'health' as InsuranceCategory, icon: Heart, gradient: 'from-rose-500 to-pink-600', price: '₹399/mo' },
    { id: 'life' as InsuranceCategory, icon: Shield, gradient: 'from-blue-500 to-indigo-600', price: '₹999/mo' },
    { id: 'motor' as InsuranceCategory, icon: Car, gradient: 'from-amber-500 to-orange-600', price: '₹1,899/yr' },
    { id: 'travel' as InsuranceCategory, icon: Plane, gradient: 'from-violet-500 to-purple-600', price: '₹449/trip' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">

      {/* ================================================================== */}
      {/* NAVIGATION BAR — Premium Glassmorphic                              */}
      {/* ================================================================== */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button onClick={() => scrollToSection('hero')} className="flex items-center gap-2.5 group" aria-label="Go to top">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-105">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Paliwal<span className="gradient-text"> Secure</span>
              </span>
            </button>

            {/* Desktop Nav with icons + hover underline animation */}
            <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
              {navLinks.map((link) => {
                const LinkIcon = link.icon;
                const isGyaan = link.id === 'knowledge-base';
                return (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={`relative flex items-center gap-1.5 px-2.5 lg:px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
                      isGyaan
                        ? 'text-blue-700 dark:text-blue-300 bg-blue-50/60 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 border border-blue-200/60 dark:border-blue-800/40'
                        : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                    aria-label={`Navigate to ${link.label}`}
                  >
                    <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden lg:inline">{link.label}</span>
                    <span className="lg:hidden">{link.label === 'InsureGyaan' ? 'Gyaan' : link.label === 'Calculators' ? 'Calc' : link.label === 'Products' ? 'Plans' : link.label}</span>
                    {!isGyaan && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full group-hover:w-3/4 transition-all duration-300" />
                    )}
                  </button>
                );
              })}
              {/* WhatsApp quick-link button */}
              <button
                onClick={handleWhatsAppClick}
                className="px-3 py-2 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/30 rounded-lg transition-all duration-200 flex items-center gap-1.5"
                aria-label="Chat on WhatsApp"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden lg:inline">WhatsApp</span>
              </button>
            </div>

            {/* CTA + ThemeToggle + Mobile Toggle */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => setShowOnboarding(true)}
                  className="btn-ripple bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full text-xs sm:text-sm px-3 sm:px-5 py-1.5 sm:py-2 gap-1.5 font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300"
                >
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Start</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
              </motion.div>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu — Slide down animation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/20 dark:border-slate-700/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl overflow-hidden z-50 relative"
            >
              <div className="px-4 py-3 space-y-1">
                {navLinks.map((item) => {
                  const ItemIcon = item.icon;
                  const isGyaan = item.id === 'knowledge-base';
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`flex items-center w-full text-left px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 min-h-[44px] gap-3 ${
                        isGyaan
                          ? 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800'
                          : 'text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30'
                      }`}
                    >
                      <ItemIcon className="w-4 h-4 shrink-0" />
                      {item.label}
                      {isGyaan && (
                        <Badge className="ml-auto text-[9px] bg-blue-600 text-white border-0 rounded-full px-1.5 py-0.5">
                          7 Tabs
                        </Badge>
                      )}
                    </button>
                  );
                })}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleWhatsAppClick();
                  }}
                  className="flex items-center w-full text-left px-4 py-3 text-sm font-medium text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 rounded-xl transition-all duration-200 min-h-[44px] gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Chat on WhatsApp
                </button>
                <Button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowOnboarding(true);
                  }}
                  className="w-full btn-ripple bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-semibold gap-1.5 mt-2 shadow-lg shadow-amber-500/25"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ================================================================== */}
      {/* HERO SECTION — World-Class                                          */}
      {/* ================================================================== */}
      <section id="hero" className="relative flex items-center overflow-hidden pt-20 sm:pt-24 lg:pt-28 pb-16 sm:pb-24 lg:pb-32">
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800" />
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 animate-gradient-x bg-[linear-gradient(110deg,transparent_30%,rgba(99,102,241,0.1)_50%,transparent_70%)] bg-[length:200%_100%]" />

        {/* 3 Floating Orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* Floating decorative shapes */}
        <motion.div
          className="hidden lg:block absolute top-32 left-[12%] w-16 h-16 bg-blue-400/10 rounded-2xl rotate-12"
          animate={{ y: [-10, 10, -10], rotate: [12, 20, 12] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="hidden lg:block absolute bottom-40 right-[15%] w-20 h-20 bg-amber-400/10 rounded-full"
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="hidden lg:block absolute top-1/2 left-[6%] w-12 h-12 bg-violet-400/10 rounded-xl -rotate-12"
          animate={{ y: [-8, 8, -8], rotate: [-12, -20, -12] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="hidden lg:block absolute top-24 right-[25%] w-8 h-8 bg-amber-400/15 rounded-lg rotate-45"
          animate={{ y: [5, -5, 5], rotate: [45, 60, 45] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text content */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge className="badge-shimmer mb-4 sm:mb-6 bg-blue-500/20 text-blue-300 border-blue-400/30 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-full">
                  ✨ India&apos;s Most Trusted AI Advisor
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-[1.8rem] sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.15]"
              >
                <span className="text-white">AI se </span>
                <span className="gradient-text">Best Plan.</span>
                <br className="hidden sm:block" />
                <span className="text-white sm:ml-2">Humse </span>
                <span className="gradient-text-amber">Easy Claim.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-sm sm:text-xl lg:text-2xl font-medium text-blue-200 mt-2 sm:mt-3"
              >
                Smart Insurance for Every Indian
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-3 sm:mt-6 text-xs sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                AI-powered recommendations from 51+ insurers — aur claim process hum aasan bana dete hain.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    onClick={() => setShowOnboarding(true)}
                    className="btn-ripple cta-amber rounded-full gap-2 h-11 sm:h-12 px-5 sm:px-8 text-sm sm:text-base font-semibold shadow-lg shadow-amber-500/20"
                  >
                    🎯 Get My Best Plan
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleWhatsAppClick}
                    className="gap-2 border-white/20 text-white hover:bg-white/10 hover:text-white rounded-full h-11 sm:h-12 px-5 sm:px-8 text-sm sm:text-base backdrop-blur-sm"
                  >
                    <Phone className="w-4 h-4" />
                    📞 Talk to Expert
                  </Button>
                </motion.div>
              </motion.div>

              {/* Stats counter row */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-8 sm:mt-12 grid grid-cols-3 gap-4 sm:gap-8"
              >
                {[
                  { value: `${stat1}M+`, label: 'Uninsured' },
                  { value: `${stat2}.7%`, label: 'Penetration' },
                  { value: `${stat3}%`, label: 'Claim Settlement' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                      {stat.value}
                    </p>
                    <p className="text-[10px] sm:text-sm text-slate-400 mt-0.5 sm:mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Animated Shield Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative w-full max-w-md">
                {/* Main shield card */}
                <div className="glass-dark rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">Coverage Score</h3>
                      <p className="text-sm text-slate-400">AI Analysis</p>
                    </div>
                  </div>
                  <div className="space-y-5">
                    {[
                      { label: 'Health', pct: 85, gradient: 'from-rose-400 to-pink-600', color: 'text-rose-400' },
                      { label: 'Life', pct: 60, gradient: 'from-blue-400 to-indigo-600', color: 'text-blue-400' },
                      { label: 'Motor', pct: 92, gradient: 'from-amber-400 to-orange-600', color: 'text-amber-400' },
                    ].map((bar) => (
                      <div key={bar.label}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-slate-300">{bar.label}</span>
                          <span className={`font-semibold ${bar.color}`}>{bar.pct}%</span>
                        </div>
                        <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${bar.gradient} rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${bar.pct}%` }}
                            transition={{ duration: 1.5, delay: 0.8 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                    <p className="text-sm text-amber-300 font-medium">
                      2 gaps found in your coverage
                    </p>
                  </div>
                </div>

                {/* Floating badge - AI Ready */}
                <motion.div
                  className="absolute -top-4 -right-4 glass-dark rounded-xl p-3 shadow-lg"
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-indigo-400" />
                    <span className="text-sm font-semibold text-white">AI Ready</span>
                  </div>
                </motion.div>

                {/* Floating badge - IRDAI Verified */}
                <motion.div
                  className="absolute -bottom-4 -left-4 glass-dark rounded-xl p-3 shadow-lg"
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-semibold text-white">IRDAI Verified</span>
                  </div>
                </motion.div>

                {/* Floating particles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-blue-400/30"
                    style={{
                      top: `${20 + i * 12}%`,
                      left: `${-5 + i * 18}%`,
                    }}
                    animate={{
                      y: [-5, 5, -5],
                      opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                      duration: 3 + i * 0.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* TRUST BAR                                                          */}
      {/* ================================================================== */}
      <section className="py-8 sm:py-12 bg-background border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <p className="text-sm sm:text-base text-muted-foreground font-medium">
              Trusted by <span className="gradient-text font-bold">{trustCount}+</span> families across India
            </p>
          </motion.div>

          {/* Insurer logos/names */}
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-thin justify-start lg:justify-center">
            {insurerNames.map((name, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="flex-shrink-0 px-4 py-2 rounded-xl border border-border/50 bg-card hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all duration-300 cursor-default group"
              >
                <span className="text-xs sm:text-sm font-semibold text-muted-foreground group-hover:text-blue-600 transition-colors whitespace-nowrap">
                  {name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* DAILY INSURANCE TIP                                                 */}
      {/* ================================================================== */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <DailyTip />
      </div>

      {/* ================================================================== */}
      {/* PRODUCT CATEGORIES (Premium Grid)                                   */}
      {/* ================================================================== */}
      <section id="categories" className="py-16 sm:py-24 lg:py-32 bg-background scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          >
            <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800 rounded-full px-4 py-1">
              <Shield className="w-3.5 h-3.5 mr-1" />
              Insurance Categories
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              Choose Your{' '}
              <span className="gradient-text">Protection</span>
            </h2>
            <p className="mt-4 text-sm sm:text-lg text-muted-foreground">
              Health, Life, Motor, Travel — har category mein AI-powered recommendations
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {categoryCards.map((cat) => {
              const IconComp = cat.icon;
              const info = categoryInfo.find((c) => c.id === cat.id);
              return (
                <motion.div key={cat.id} variants={staggerItem} whileHover={{ y: -8 }}>
                  <div
                    onClick={() => {
                      setActiveCategory(cat.id);
                      scrollToSection('products');
                    }}
                    className="glass-card rounded-3xl p-6 sm:p-8 cursor-pointer group bg-card"
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-lg mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComp className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{info?.name || cat.id}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {info?.description.substring(0, 80)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-semibold gradient-text">
                        Starting {cat.price}
                      </span>
                      <span className="text-blue-600 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-300">
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <div className="text-center mt-8">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                onClick={() => scrollToSection('products')}
                className="rounded-full gap-2 border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950/30"
              >
                Show all 12+ products
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* INSUREGPT CHAT SECTION — Premium                                    */}
      {/* ================================================================== */}
      <section id="insuregpt-chat" className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-blue-50/60 via-background to-background dark:from-blue-950/20 dark:via-background dark:to-background scroll-mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center max-w-2xl mx-auto mb-8 sm:mb-10"
          >
            <Badge className="badge-shimmer mb-4 bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800 rounded-full px-4 py-1">
              🤖 InsureGPT AI Assistant
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
              Apna Insurance Guide —{' '}
              <span className="gradient-text">Chat karo</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base lg:text-lg text-muted-foreground">
              Insurance ke baare mein koi bhi sawaal poochiye — Hindi, English ya Hinglish mein. InsureGPT turant jawab dega!
            </p>
          </motion.div>

          <EmbeddedChatBot profile={userProfile} />
        </div>
      </section>

      {/* ================================================================== */}
      {/* CALCULATORS SECTION                                                 */}
      {/* ================================================================== */}
      <section id="calculators" className="py-16 sm:py-24 lg:py-32 bg-slate-50 dark:bg-slate-900/50 scroll-mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center max-w-2xl mx-auto mb-8 sm:mb-10"
          >
            <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800 rounded-full px-4 py-1">
              <Calculator className="w-3.5 h-3.5 mr-1" />
              Insurance Calculators
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
              Calculate Karo,{' '}
              <span className="gradient-text">Sahi Premium Paao</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base lg:text-lg text-muted-foreground">
              Health, Motor, Term, Tax aur Claim — sab calculator ek jagah. IRDAI 2025-26 data ke saath accurate estimates!
            </p>
          </motion.div>

          <CalculatorSection />
        </div>
      </section>

      {/* ================================================================== */}
      {/* HOW IT WORKS (3 Steps) — Premium                                    */}
      {/* ================================================================== */}
      <section id="how-it-works" className="py-16 sm:py-24 lg:py-32 bg-background scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          >
            <Badge className="mb-4 bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800 rounded-full px-4 py-1">
              <Zap className="w-3.5 h-3.5 mr-1" />
              How It Works
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              3 Simple Steps to{' '}
              <span className="gradient-text-amber">Smart Insurance</span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Connecting gradient line */}
            <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500 -translate-y-1/2 z-0 opacity-20 rounded-full" />

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid sm:grid-cols-3 gap-8 relative z-10"
            >
              {howItWorksSteps.map((step) => {
                const StepIcon = step.icon;
                return (
                  <motion.div key={step.num} variants={staggerItem} whileHover={{ y: -8 }}>
                    <div className="card-premium rounded-3xl p-6 sm:p-8 text-center bg-card">
                      {/* Gradient icon circle with number badge */}
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mx-auto mb-5 shadow-lg relative`}>
                        <StepIcon className="w-7 h-7 text-white" />
                        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 text-white text-xs font-bold flex items-center justify-center shadow-lg">
                          {step.num}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* TESTIMONIALS CAROUSEL — New Premium Section                         */}
      {/* ================================================================== */}
      <section id="testimonials" className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-background via-blue-50/30 to-background dark:from-background dark:via-blue-950/10 dark:to-background scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <Badge className="badge-shimmer mb-4 bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800 rounded-full px-4 py-1">
              <Star className="w-3.5 h-3.5 mr-1 fill-amber-500" />
              Customer Stories
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              Log Kya <span className="gradient-text-amber">Kehte Hain</span>
            </h2>
            <p className="mt-4 text-sm sm:text-lg text-muted-foreground">
              Real stories from real people — Paliwal Secure ne unka insurance experience kaise badla
            </p>
          </motion.div>

          {/* Auto-scrolling carousel */}
          <div className="overflow-hidden relative">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            <div className="animate-carousel flex gap-6 w-max">
              {/* Duplicate items for infinite scroll */}
              {[...testimonials, ...testimonials].map((t, i) => (
                <div
                  key={`${t.avatar}-${i}`}
                  className="w-[300px] sm:w-[350px] flex-shrink-0 card-premium rounded-3xl p-6 sm:p-8 bg-card"
                >
                  {/* Quote icon */}
                  <Quote className="w-8 h-8 text-blue-200 dark:text-blue-800 mb-4" />

                  {/* Quote text */}
                  <p className="text-sm sm:text-base text-foreground leading-relaxed mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {/* Star rating */}
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, si) => (
                      <Star
                        key={si}
                        className={`w-4 h-4 ${si < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'}`}
                      />
                    ))}
                  </div>

                  {/* Avatar + Name */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* MARKET INSIGHTS SECTION — Dark                                      */}
      {/* ================================================================== */}
      <section id="market-insights" className="py-16 sm:py-24 bg-slate-900 dark:bg-slate-950 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <Badge className="mb-4 bg-blue-900/50 text-blue-300 border-blue-700/50 rounded-full px-4 py-1">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              Market Insights
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              India ka Insurance <span className="gradient-text">Picture</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-400">
              Yeh stats dikhate hain ki insurance awareness kitni zaroori hai — aur Paliwal Secure kyun faaydemand hai.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4"
          >
            {marketInsights.map((insight) => {
              const style = getInsightStyle(insight.category);
              const IconComp = style.icon;
              return (
                <motion.div key={insight.id} variants={staggerItem} whileHover={{ y: -4 }}>
                  <div className="glass-dark hover:border-blue-500/30 transition-all duration-300 group h-full rounded-2xl">
                    <div className="pt-4 pb-4 px-3 sm:pt-5 sm:pb-5 sm:px-4">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${style.bg} flex items-center justify-center shrink-0`}>
                          <IconComp className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${style.color}`} />
                        </div>
                        <Badge variant="outline" className={`text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0 ${style.border} ${style.color} truncate max-w-[80px] sm:max-w-none`}>
                          {insight.category.replace('-', ' ')}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-white leading-snug mb-1.5 sm:mb-2">
                        {insight.stat}
                      </p>
                      <p className="text-[10px] sm:text-xs text-slate-400 leading-relaxed line-clamp-2 sm:line-clamp-3">
                        {insight.context}
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-slate-500 mt-1.5 sm:mt-2 truncate">
                        {insight.source}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* COMPANY COMPARISON TABLE                                            */}
      {/* ================================================================== */}
      <section id="company-comparison" className="py-16 sm:py-24 bg-background scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800 rounded-full px-4 py-1">
              <Award className="w-3.5 h-3.5 mr-1" />
              Company Comparison
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              Insurers ka <span className="gradient-text">Scoreboard</span>
            </h2>
            <p className="mt-4 text-sm sm:text-lg text-muted-foreground">
              IRDAI 2025-26 data — CSR, ICR, Solvency Ratio se compare karein. Sort by any column!
            </p>
          </motion.div>

          <CompanyComparisonTable />
        </div>
      </section>

      {/* ================================================================== */}
      {/* DISEASE-SPECIFIC PLANS                                              */}
      {/* ================================================================== */}
      <section id="disease-plans" className="py-16 sm:py-24 bg-gradient-to-b from-blue-50/30 via-background to-background dark:from-blue-950/10 dark:via-background dark:to-background scroll-mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <Badge className="mb-4 bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800 rounded-full px-4 py-1">
              <Heart className="w-3.5 h-3.5 mr-1" />
              Disease-Specific Plans
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
              Diabetes/BP ke liye <span className="gradient-text-amber">Special Cover</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground">
              IRDAI 2024 ke baad ab diabetes aur BP ke liye Day 1 coverage wale plans available hain
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid md:grid-cols-3 gap-6"
          >
            {diseaseSpecificPlans.map((plan) => (
              <motion.div key={plan.name} variants={staggerItem}>
                <div className="card-premium rounded-3xl p-6 bg-card h-full">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{plan.name}</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">{plan.insurer}</p>
                  <Badge className="mb-3 bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800 text-xs">
                    {plan.disease}
                  </Badge>
                  <div className="space-y-2 mb-4">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-xs text-muted-foreground">{f}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
                    <span className="text-sm font-bold text-foreground">{plan.startingPremium}</span>
                    <span className="text-[10px] text-muted-foreground">{plan.waitingPeriod}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FEATURES SECTION — Premium                                          */}
      {/* ================================================================== */}
      <section id="features" className="py-16 sm:py-24 lg:py-32 bg-background scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          >
            <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800 rounded-full px-4 py-1">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Kyun Paliwal Secure
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              Insurance Ab Hai{' '}
              <span className="gradient-text">Aasan</span>
            </h2>
            <p className="mt-4 text-sm sm:text-lg text-muted-foreground">
              AI aur insurance expertise ka combination — har Indian ke liye simple, transparent, aur personalized insurance.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature) => {
              const FeatureIcon = feature.icon;
              return (
                <motion.div key={feature.title} variants={staggerItem} whileHover={{ y: -8 }}>
                  <div className="card-premium rounded-3xl p-6 sm:p-8 h-full cursor-default group bg-card">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <FeatureIcon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* KNOWLEDGE BASE SECTION — Comprehensive                              */}
      {/* ================================================================== */}
      <section id="knowledge-base" className="py-16 sm:py-24 lg:py-32 bg-slate-50 dark:bg-slate-900/50 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center max-w-3xl mx-auto mb-10"
          >
            <Badge className="badge-shimmer mb-4 bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800 rounded-full px-4 py-1">
              <BookOpen className="w-3.5 h-3.5 mr-1" />
              InsureGyaan
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              Insurance Ki{' '}
              <span className="gradient-text">Complete Knowledge Base</span>
            </h2>
            <p className="mt-4 text-sm sm:text-lg text-muted-foreground">
              Glossary, Articles, Myth Busters aur Company Comparison — sab Hinglish mein, koi jargon nahi!
            </p>
          </motion.div>

          <KnowledgeBaseSection />
        </div>
      </section>

      {/* ================================================================== */}
      {/* GAME OF LIFE SECTION                                                */}
      {/* ================================================================== */}
      <section id="game-of-life" className="py-16 sm:py-24 lg:py-32 bg-background scroll-mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center max-w-2xl mx-auto mb-8"
          >
            <Badge className="mb-4 bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800 rounded-full px-4 py-1">
              <Play className="w-3.5 h-3.5 mr-1" />
              Game of Life
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
              Zindagi ke{' '}
              <span className="gradient-text">Insurance Scenarios</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground">
              Interactive simulation — dekhein insurance kaise kaam karta hai life ke different stages mein
            </p>
          </motion.div>

          <GameOfLife />
        </div>
      </section>

      {/* ================================================================== */}
      {/* PRODUCTS SECTION with Tabs                                          */}
      {/* ================================================================== */}
      <section id="products" className="py-16 sm:py-24 lg:py-32 bg-slate-50 dark:bg-slate-900/50 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800 rounded-full px-4 py-1">
              <Award className="w-3.5 h-3.5 mr-1" />
              Insurance Plans
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              Compare &{' '}
              <span className="gradient-text">Choose</span>
            </h2>
            <p className="mt-4 text-sm sm:text-lg text-muted-foreground">
              IRDAI-verified plans from top insurers — transparent pricing, real CSR data
            </p>
          </motion.div>

          {/* Category Tabs */}
          <Tabs
            defaultValue="health"
            value={activeCategory}
            onValueChange={(val) => setActiveCategory(val as InsuranceCategory)}
            className="w-full"
          >
            <TabsList className="flex flex-wrap justify-center gap-2 bg-transparent h-auto p-0 mb-8">
              {categoryInfo.map((cat) => {
                const CatIcon = getCategoryIcon(cat.icon);
                return (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.id}
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-full px-4 py-2 text-sm font-medium data-[state=inactive]:bg-card data-[state=inactive]:border data-[state=inactive]:border-border"
                  >
                    <CatIcon className="w-4 h-4 mr-1.5" />
                    {cat.name}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {categoryInfo.map((cat) => (
              <TabsContent key={cat.id} value={cat.id}>
                {/* Category info card */}
                {currentCategoryInfo && activeCategory === cat.id && (
                  <div className="card-premium rounded-3xl p-6 sm:p-8 bg-card mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${categoryCards.find(c => c.id === cat.id)?.gradient || 'from-blue-500 to-indigo-600'} flex items-center justify-center shadow-lg shrink-0`}>
                        {(() => {
                          const CatIcon = getCategoryIcon(cat.icon);
                          return <CatIcon className="w-7 h-7 text-white" />;
                        })()}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground">{cat.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>
                        <div className="flex flex-wrap gap-3 mt-3">
                          <Badge variant="outline" className="text-xs rounded-full border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300">
                            Avg CSR: {cat.avgClaimSettlementRatio}%
                          </Badge>
                          <Badge variant="outline" className="text-xs rounded-full border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-300">
                            {cat.planCount} plans
                          </Badge>
                          <Badge variant="outline" className="text-xs rounded-full border-green-200 text-green-700 dark:border-green-800 dark:text-green-300">
                            Starting ₹{cat.premiumRange.min}/{cat.premiumRange.frequency.replace('yearly', 'yr').replace('monthly', 'mo')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Plan cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {getPlansByCategory(cat.id as InsuranceCategory).map((plan) => (
                    <motion.div key={plan.id} whileHover={{ y: -8 }} className="card-premium rounded-2xl p-5 sm:p-6 bg-card group">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-foreground text-sm sm:text-base group-hover:text-blue-600 transition-colors">
                            {plan.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">{plan.provider}</p>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-semibold text-foreground">{plan.rating}</span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">CSR</span>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">{plan.claimSettlementRatio}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Premium</span>
                          <span className="font-semibold text-foreground">₹{plan.premium.monthly}/mo</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Sum Insured</span>
                          <span className="font-semibold text-foreground">₹{(plan.sumInsured.min / 100000).toFixed(0)}L – ₹{(plan.sumInsured.max / 100000).toFixed(0)}L</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {plan.features.slice(0, 3).map((f) => (
                          <Badge key={f} variant="secondary" className="text-[10px] rounded-full px-2">
                            {f}
                          </Badge>
                        ))}
                      </div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          className="w-full cta-glow rounded-xl text-xs font-semibold"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: `${plan.name}`,
                              description: `CSR: ${plan.claimSettlementRatio}% | Premium: ₹${plan.premium.monthly}/mo | ${plan.tagline}`,
                            });
                          }}
                        >
                          View Details
                          <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </motion.div>

                      <p className="text-[9px] text-muted-foreground/60 mt-2 text-center">
                        IRDAI Reg: {plan.irdaRegistrationNo}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* IRDAI Disclaimer under products */}
          <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-300">{IRDAI_MANDATORY_DISCLAIMER}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* CONTACT SECTION — Premium                                           */}
      {/* ================================================================== */}
      <section id="contact" ref={contactRef} className="py-16 sm:py-24 lg:py-32 bg-background scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800 rounded-full px-4 py-1">
              <Mail className="w-3.5 h-3.5 mr-1" />
              Get in Touch
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              Questions?{' '}
              <span className="gradient-text">Let&apos;s Talk</span>
            </h2>
            <p className="mt-4 text-sm sm:text-lg text-muted-foreground">
              Insurance ke baare mein koi bhi sawaal — hum zaroor madad karenge
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {/* Contact Form */}
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="glass rounded-3xl p-6 sm:p-8 shadow-lg">
                {/* Gradient header accent */}
                <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 rounded-full mb-6 -mt-2" />
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-foreground mb-1.5 block">
                        Name *
                      </Label>
                      <Input
                        id="name"
                        placeholder="Aapka naam"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-foreground mb-1.5 block">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="aapka@email.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-foreground mb-1.5 block">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 99999 99999"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="insurance-type" className="text-sm font-medium text-foreground mb-1.5 block">
                        Insurance Type
                      </Label>
                      <Select
                        value={contactForm.insuranceType}
                        onValueChange={(val) => setContactForm({ ...contactForm, insuranceType: val })}
                      >
                        <SelectTrigger id="insurance-type" className="rounded-xl">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="health">Health Insurance</SelectItem>
                          <SelectItem value="life">Life Insurance</SelectItem>
                          <SelectItem value="motor">Motor Insurance</SelectItem>
                          <SelectItem value="travel">Travel Insurance</SelectItem>
                          <SelectItem value="home">Home Insurance</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm font-medium text-foreground mb-1.5 block">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Aapka sawaal ya message..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="rounded-xl min-h-[100px]"
                    />
                  </div>

                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-ripple cta-amber rounded-xl h-11 sm:h-12 text-sm sm:text-base font-semibold gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              <motion.div whileHover={{ y: -4 }} className="card-premium rounded-2xl p-5 bg-card">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Call / WhatsApp</h4>
                    <p className="text-xs text-muted-foreground mt-1">Mon–Sat, 9AM–7PM IST</p>
                    <Button
                      variant="link"
                      className="text-blue-600 p-0 h-auto text-sm font-semibold mt-1"
                      onClick={handleWhatsAppClick}
                    >
                      +91 99999 99999
                    </Button>
                  </div>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -4 }} className="card-premium rounded-2xl p-5 bg-card">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Email</h4>
                    <p className="text-xs text-muted-foreground mt-1">24hr response time</p>
                    <p className="text-sm text-blue-600 font-semibold mt-1">hello@paliwalsecure.com</p>
                  </div>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -4 }} className="card-premium rounded-2xl p-5 bg-card">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Office</h4>
                    <p className="text-xs text-muted-foreground mt-1">New Delhi, India</p>
                  </div>
                </div>
              </motion.div>

              {/* QR Code */}
              <motion.div whileHover={{ y: -4 }} className="card-premium rounded-2xl p-5 bg-card">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 border border-border flex items-center justify-center shrink-0">
                    <QrCode className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Scan to Chat</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">WhatsApp QR Code</p>
                  </div>
                </div>
              </motion.div>

              {/* IRDAI Disclaimer */}
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] sm:text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                    {IRDAI_MANDATORY_DISCLAIMER}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* REVIEWS & RATINGS SECTION                                           */}
      {/* ================================================================== */}
      <section id="reviews" className="py-16 sm:py-24 lg:py-32 bg-slate-50 dark:bg-slate-900/50 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ReviewSection />
        </div>
      </section>

      {/* ================================================================== */}
      {/* FOOTER — Premium Dark                                               */}
      {/* ================================================================== */}
      <footer className="bg-slate-900 dark:bg-slate-950 pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  Paliwal<span className="gradient-text"> Secure</span>
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                AI-powered insurance recommendations for every Indian. IRDAI-compliant, transparent, aur aasan.
              </p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleWhatsAppClick}
                  variant="outline"
                  className="border-green-600 text-green-400 hover:bg-green-900/30 rounded-full gap-2 text-xs"
                  size="sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  WhatsApp
                </Button>
              </motion.div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Quick Links</h4>
              <ul className="space-y-2.5">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Products</h4>
              <ul className="space-y-2.5">
                {categoryInfo.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => {
                        setActiveCategory(cat.id);
                        scrollToSection('products');
                      }}
                      className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Compliance */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Compliance</h4>
              <ul className="space-y-2.5">
                {complianceChecklist.slice(0, 5).map((item) => (
                  <li key={item.id} className="flex items-center gap-1.5">
                    {item.status === 'compliant' ? (
                      <CheckCircle2 className="w-3 h-3 text-blue-400 shrink-0" />
                    ) : (
                      <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                    )}
                    <span className="text-xs text-slate-400 truncate">{item.requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-slate-800">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500">
                Powered by <span className="text-blue-400 font-semibold">Himanshu Paliwal</span>
              </p>
              <p className="text-[10px] text-slate-600 text-center max-w-lg leading-relaxed">
                {IRDAI_MANDATORY_DISCLAIMER}
              </p>
              <p className="text-xs text-slate-600">
                © {new Date().getFullYear()} Paliwal Secure
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* ================================================================== */}
      {/* MOBILE BOTTOM NAV                                                   */}
      {/* ================================================================== */}
      <MobileBottomNav onNavigate={scrollToSection} />

      {/* ================================================================== */}
      {/* PWA & CONNECTION STATUS                                             */}
      {/* ================================================================== */}
      <PWAInstallPrompt />
      <ConnectionStatus />

      {/* ================================================================== */}
      {/* ONBOARDING FLOW                                                     */}
      {/* ================================================================== */}
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingFlow
            onComplete={handleOnboardingComplete}
            onSkip={handleOnboardingSkip}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
