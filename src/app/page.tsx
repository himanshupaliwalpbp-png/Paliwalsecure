'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Brain,
  ShieldCheck,
  Mic,
  MessageSquare,
  Menu,
  X,
  ArrowRight,
  Star,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Heart,
  Car,
  Plane,
  Home as HomeIcon,
  Search,
  BookOpen,
  AlertTriangle,
  TrendingUp,
  QrCode,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
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
  policyGlossary,
  blogArticles,
  mythBusters,
  dripCampaigns,
  complianceChecklist,
  marketInsights,
} from '@/lib/insurance-data';
import dynamic from 'next/dynamic';

const GameOfLife = dynamic(() => import('@/components/GameOfLife'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full" />
    </div>
  ),
});
const EmbeddedChatBot = dynamic(() => import('@/components/EmbeddedChatBot'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full" />
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
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
  },
  {
    icon: ShieldCheck,
    title: 'IRDAI Compliant',
    description:
      'Saari recommendations IRDAI guidelines ke according — poori transparency, koi chhupana nahi',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  {
    icon: Mic,
    title: 'Voice-First / Boliye',
    description:
      'Apni bhasha mein poochiye — Hindi, English, ya Hinglish, hum samajh lenge',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  {
    icon: MessageSquare,
    title: 'Zero Jargon / Aasan Bhasha',
    description:
      'Insurance ki complex terms ko aasan Hindi/Hinglish mein samjhiye — koi confusion nahi',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
  },
];

// ── Glossary Category Colors ───────────────────────────────────────────────
function getGlossaryCategoryColor(cat: string) {
  switch (cat) {
    case 'health':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'life':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'motor':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
}

// ── Market Insight Category Config ─────────────────────────────────────────
function getInsightStyle(cat: string) {
  switch (cat) {
    case 'opportunity':
      return { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: TrendingUp };
    case 'pain-point':
      return { color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', icon: AlertTriangle };
    case 'regulatory':
      return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: ShieldCheck };
    case 'competitor-gap':
      return { color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200', icon: Sparkles };
    default:
      return { color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200', icon: TrendingUp };
  }
}

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
  const [glossarySearch, setGlossarySearch] = useState('');
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
    const phone = whatsappPhone.replace(/\D/g, '');
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
          toast({
            title: 'Message sent!',
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
      title: 'Profile saved!',
      description: 'Your personalized recommendations are ready.',
    });
  }, [toast]);

  const handleOnboardingSkip = useCallback(() => {
    setShowOnboarding(false);
  }, []);

  // Get current category plans
  const currentPlans = getPlansByCategory(activeCategory);
  const currentCategoryInfo = categoryInfo.find((c) => c.id === activeCategory);

  // Filtered glossary
  const filteredGlossary = glossarySearch.trim()
    ? policyGlossary.filter(
        (g) =>
          g.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
          (g.hindiTerm && g.hindiTerm.includes(glossarySearch)) ||
          g.explanation.toLowerCase().includes(glossarySearch.toLowerCase()) ||
          g.category.toLowerCase().includes(glossarySearch.toLowerCase())
      )
    : policyGlossary;

  // Nav links
  const navLinks = [
    { id: 'insuregpt-chat', label: 'InsureGPT' },
    { id: 'features', label: 'Features' },
    { id: 'insuregyaan', label: 'InsureGyaan' },
    { id: 'products', label: 'Products' },
    { id: 'game-of-life', label: 'Game of Life' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      {/* ================================================================== */}
      {/* NAVIGATION BAR                                                     */}
      {/* ================================================================== */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">
                Paliwal<span className="text-emerald-600"> Secure</span>
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
                >
                  {link.label}
                </button>
              ))}
              {/* WhatsApp icon in nav */}
              <button
                onClick={handleWhatsAppClick}
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1"
                aria-label="Chat on WhatsApp"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden lg:inline">WhatsApp</span>
              </button>
            </div>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowOnboarding(true)}
                className="inline-flex bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-sm text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2"
              >
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Start</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-200/60 bg-white/95 backdrop-blur-lg overflow-hidden z-50 relative"
            >
              <div className="px-4 py-4 space-y-3">
                {navLinks.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="flex items-center w-full text-left px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors min-h-[44px]"
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleWhatsAppClick();
                  }}
                  className="flex items-center w-full text-left px-3 py-2.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors min-h-[44px] gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Chat on WhatsApp
                </button>
                <Button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowOnboarding(true);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 mt-2"
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
      {/* HERO SECTION                                                       */}
      {/* ================================================================== */}
      <section className="relative flex items-center overflow-hidden pt-20 sm:pt-24 lg:pt-28 pb-12 sm:pb-16 lg:pb-20">
        {/* Background gradient & shapes */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-amber-50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-rose-100/20 rounded-full blur-2xl animate-pulse" />

        {/* Floating decorative shapes */}
        <motion.div
          className="absolute top-32 left-[15%] w-16 h-16 bg-emerald-400/10 rounded-xl rotate-12"
          animate={{ y: [-10, 10, -10], rotate: [12, 20, 12] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-40 right-[20%] w-20 h-20 bg-amber-400/10 rounded-full"
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-[8%] w-12 h-12 bg-violet-400/10 rounded-lg -rotate-12"
          animate={{ y: [-8, 8, -8], rotate: [-12, -20, -12] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text content */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge
                  variant="secondary"
                  className="mb-6 bg-emerald-50 text-emerald-700 border-emerald-200 px-4 py-1.5 text-sm font-medium"
                >
                  India ka pehla AI-powered Bima Gyaan — by Himanshu Paliwal
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 tracking-tight leading-tight"
              >
                Samjho Bima,{' '}
                <span className="text-emerald-600">Sahi Bima</span>
                <span className="block text-lg sm:text-xl lg:text-2xl font-medium text-slate-500 mt-2">
                  Smart Insurance for Every Indian
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 text-lg sm:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                Insurance samajhna ab aasan hai. AI-powered recommendations, zero jargon — bas sahi coverage paao.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                {/* Primary CTA: WhatsApp */}
                <Button
                  size="lg"
                  onClick={handleWhatsAppClick}
                  className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-lg shadow-green-200 h-12 px-6 sm:px-8 text-sm sm:text-base"
                >
                  <Phone className="w-5 h-5" />
                  Free Insurance Guide on WhatsApp
                </Button>
                {/* Secondary CTA: Recommendations */}
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setShowOnboarding(true)}
                  className="gap-2 border-slate-300 hover:border-emerald-400 hover:text-emerald-600 h-12 px-5 sm:px-8 text-sm sm:text-base"
                >
                  Get Recommendations
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </motion.div>

              {/* WhatsApp phone input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-6 flex items-center gap-3 justify-center lg:justify-start"
              >
                <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm max-w-xs">
                  <span className="px-3 py-2.5 text-sm text-slate-500 bg-slate-50 border-r border-slate-200 font-medium">+91</span>
                  <Input
                    type="tel"
                    placeholder="WhatsApp number"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-11 text-sm"
                    maxLength={10}
                  />
                </div>
                <Button
                  onClick={handleWhatsAppClick}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white gap-1.5 h-11"
                >
                  Chat
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </motion.div>

              {/* QR Code Placeholder */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-4 flex items-center gap-2 justify-center lg:justify-start"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-slate-400" />
                </div>
                <span className="text-xs text-slate-400">Scan to chat on WhatsApp</span>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-10 grid grid-cols-3 gap-4 sm:gap-8"
              >
                <div className="text-center lg:text-left">
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
                    {stat1}M+
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Uninsured
                  </p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
                    {stat2}.7%
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Insurance Penetration
                  </p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
                    {stat3}%
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Claim Settlement
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right: Hero illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative w-full max-w-md">
                {/* Main card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">
                        Your Coverage Score
                      </h3>
                      <p className="text-sm text-slate-500">AI Analysis</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-slate-600">Health</span>
                        <span className="font-semibold text-emerald-600">85%</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '85%' }}
                          transition={{ duration: 1.5, delay: 0.8 }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-slate-600">Life</span>
                        <span className="font-semibold text-amber-600">60%</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '60%' }}
                          transition={{ duration: 1.5, delay: 1.0 }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-slate-600">Motor</span>
                        <span className="font-semibold text-violet-600">92%</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-violet-400 to-violet-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '92%' }}
                          transition={{ duration: 1.5, delay: 1.2 }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-sm text-emerald-700 font-medium">
                      2 gaps found in your coverage
                    </p>
                  </div>
                </div>

                {/* Floating badge */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 border border-slate-100"
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-violet-600" />
                    <span className="text-sm font-semibold text-slate-700">AI Ready</span>
                  </div>
                </motion.div>

                {/* Floating badge 2 */}
                <motion.div
                  className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3 border border-slate-100"
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-semibold text-slate-700">IRDAI Verified</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* PALIWAL SECURE CHAT SECTION                                         */}
      {/* ================================================================== */}
      <section id="insuregpt-chat" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-emerald-50/60 via-white to-white scroll-mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center max-w-2xl mx-auto mb-8 sm:mb-10"
          >
            <Badge
              variant="secondary"
              className="mb-4 bg-emerald-50 text-emerald-700 border-emerald-200"
            >
              <Brain className="w-3.5 h-3.5 mr-1" />
              InsureGPT AI Assistant
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
              Apna Insurance Guide —{' '}
              <span className="text-emerald-600">Chat karo</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base lg:text-lg text-slate-600">
              Insurance ke baare mein koi bhi sawaal poochiye — Hindi, English ya Hinglish mein. InsureGPT turant jawab dega!
            </p>
          </motion.div>

          <EmbeddedChatBot profile={userProfile} />
        </div>
      </section>

      {/* ================================================================== */}
      {/* MARKET INSIGHTS SECTION                                            */}
      {/* ================================================================== */}
      <section id="market-insights" className="py-16 sm:py-20 bg-slate-900 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <Badge
              variant="secondary"
              className="mb-4 bg-emerald-900/50 text-emerald-300 border-emerald-800"
            >
              Market Insights
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              India ka Insurance <span className="text-emerald-400">Picture</span>
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
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
          >
            {marketInsights.slice(0, 5).map((insight) => {
              const style = getInsightStyle(insight.category);
              const IconComp = style.icon;
              return (
                <motion.div key={insight.id} variants={staggerItem}>
                  <Card className="h-full bg-slate-800/50 border-slate-700/50 hover:border-emerald-600/40 transition-all duration-300 group">
                    <CardContent className="pt-5 pb-5 px-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-8 h-8 rounded-lg ${style.bg} flex items-center justify-center`}>
                          <IconComp className={`w-4 h-4 ${style.color}`} />
                        </div>
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${style.border} ${style.color}`}>
                          {insight.category.replace('-', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm font-semibold text-white leading-snug mb-2">
                        {insight.stat}
                      </p>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                        {insight.context}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-2 truncate">
                        {insight.source}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Additional insights row - show on larger screens */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-4"
          >
            {marketInsights.slice(5, 10).map((insight) => {
              const style = getInsightStyle(insight.category);
              const IconComp = style.icon;
              return (
                <motion.div key={insight.id} variants={staggerItem}>
                  <Card className="h-full bg-slate-800/50 border-slate-700/50 hover:border-emerald-600/40 transition-all duration-300 group">
                    <CardContent className="pt-5 pb-5 px-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-8 h-8 rounded-lg ${style.bg} flex items-center justify-center`}>
                          <IconComp className={`w-4 h-4 ${style.color}`} />
                        </div>
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${style.border} ${style.color}`}>
                          {insight.category.replace('-', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm font-semibold text-white leading-snug mb-2">
                        {insight.stat}
                      </p>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                        {insight.context}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-2 truncate">
                        {insight.source}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FEATURES SECTION                                                   */}
      {/* ================================================================== */}
      <section id="features" className="py-20 sm:py-28 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <Badge
              variant="secondary"
              className="mb-4 bg-emerald-50 text-emerald-700 border-emerald-200"
            >
              Kyun Paliwal Secure
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Insurance Ab Hai{' '}
              <span className="text-emerald-600">Aasan</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600">
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
            {features.map((feature) => (
              <motion.div key={feature.title} variants={staggerItem}>
                <Card
                  className={`h-full border ${feature.borderColor} hover:shadow-lg transition-all duration-300 cursor-default group`}
                >
                  <CardContent className="pt-6 pb-6">
                    <div
                      className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* INSUREGYAAN VAULT SECTION                                          */}
      {/* ================================================================== */}
      <section id="insuregyaan" className="py-20 sm:py-28 bg-slate-50 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <Badge
              variant="secondary"
              className="mb-4 bg-violet-50 text-violet-700 border-violet-200"
            >
              InsureGyaan Vault
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Bima ka <span className="text-emerald-600">Gyaan</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Insurance ki har term, har myth, aur har zaroori article — sab ek jagah, Hinglish mein.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Tabs defaultValue="glossary" className="w-full">
              <TabsList className="w-full sm:w-auto mx-auto flex mb-8 bg-white border border-slate-200 p-1 rounded-xl h-auto flex-wrap">
                <TabsTrigger
                  value="glossary"
                  className="flex-1 sm:flex-none px-4 py-2.5 text-xs sm:text-sm rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white min-h-[44px]"
                >
                  <BookOpen className="w-4 h-4 mr-1.5" />
                  Policy Glossary
                </TabsTrigger>
                <TabsTrigger
                  value="articles"
                  className="flex-1 sm:flex-none px-4 py-2.5 text-xs sm:text-sm rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white min-h-[44px]"
                >
                  <BookOpen className="w-4 h-4 mr-1.5" />
                  Bima ki ABCD
                </TabsTrigger>
                <TabsTrigger
                  value="myths"
                  className="flex-1 sm:flex-none px-4 py-2.5 text-xs sm:text-sm rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white min-h-[44px]"
                >
                  <AlertTriangle className="w-4 h-4 mr-1.5" />
                  Myth-Busters
                </TabsTrigger>
              </TabsList>

              {/* ─── TAB 1: GLOSSARY ─── */}
              <TabsContent value="glossary">
                {/* Search */}
                <div className="mb-6 max-w-md mx-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search glossary... (e.g., CSR, PED, IDV)"
                      value={glossarySearch}
                      onChange={(e) => setGlossarySearch(e.target.value)}
                      className="pl-10 h-11 bg-white border-slate-200"
                    />
                  </div>
                  {glossarySearch && (
                    <p className="text-xs text-slate-500 mt-2 text-center">
                      {filteredGlossary.length} result{filteredGlossary.length !== 1 ? 's' : ''} found
                    </p>
                  )}
                </div>

                {/* Glossary Accordion */}
                <div className="max-w-4xl mx-auto">
                  <Accordion type="single" collapsible className="space-y-3">
                    {filteredGlossary.map((term, idx) => (
                      <AccordionItem
                        key={term.term}
                        value={term.term}
                        className="bg-white border border-slate-200 rounded-xl px-4 sm:px-6 overflow-hidden data-[state=open]:shadow-md transition-shadow"
                      >
                        <AccordionTrigger className="hover:no-underline py-4">
                          <div className="flex items-center gap-3 text-left flex-1 min-w-0">
                            <span className="text-sm font-bold text-slate-900 shrink-0">{idx + 1}.</span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-slate-900 text-sm sm:text-base">{term.term}</span>
                                {term.hindiTerm && (
                                  <span className="text-xs text-slate-500 font-medium">{term.hindiTerm}</span>
                                )}
                              </div>
                              <div className="mt-1">
                                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getGlossaryCategoryColor(term.category)}`}>
                                  {term.category}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                          <div className="pl-7 sm:pl-9 space-y-3">
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {term.explanation}
                            </p>
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                              <p className="text-xs font-semibold text-emerald-700 mb-1">Example:</p>
                              <p className="text-xs text-emerald-600 leading-relaxed">{term.example}</p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  {filteredGlossary.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                      <Search className="w-10 h-10 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Koi term nahi mili. Kuch aur try karein!</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* ─── TAB 2: ARTICLES (BIMA KI ABCD) ─── */}
              <TabsContent value="articles">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {blogArticles.map((article) => (
                    <motion.div
                      key={article.id}
                      variants={staggerItem}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      <Card className="h-full hover:shadow-lg transition-all duration-300 group border-slate-200 flex flex-col">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getGlossaryCategoryColor(article.category)}`}>
                              {article.category}
                            </Badge>
                            <span className="flex items-center gap-1 text-[10px] text-slate-400">
                              <Clock className="w-3 h-3" />
                              {article.readTime}
                            </span>
                          </div>
                          <CardTitle className="text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-emerald-600 transition-colors">
                            {article.titleHi || article.title}
                          </CardTitle>
                          <CardDescription className="text-xs text-slate-500 mt-1">
                            {article.title}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-4 flex-1">
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                            {article.summary}
                          </p>
                          <div className="space-y-1.5">
                            {article.keyPoints.slice(0, 3).map((point, i) => (
                              <div key={i} className="flex items-start gap-1.5 text-xs text-slate-500">
                                <ChevronRight className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                                <span>{point}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0 mt-auto">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 min-h-[44px] text-xs"
                          >
                            Read More
                            <ArrowRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              {/* ─── TAB 3: MYTH-BUSTERS ─── */}
              <TabsContent value="myths">
                <div className="max-w-3xl mx-auto space-y-4">
                  {mythBusters.map((myth, idx) => (
                    <motion.div
                      key={myth.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                    >
                      <Card className="overflow-hidden border-slate-200 hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row">
                          {/* Myth side */}
                          <div className="flex-1 bg-red-50 p-4 sm:p-5 border-b sm:border-b-0 sm:border-r border-red-200">
                            <div className="flex items-center gap-2 mb-2">
                              <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                              <span className="text-xs font-bold text-red-600 uppercase tracking-wide">Myth</span>
                            </div>
                            <p className="text-sm font-semibold text-red-800 leading-snug">
                              {myth.mythHi}
                            </p>
                            <p className="text-xs text-red-600/70 mt-1 italic">
                              {myth.myth}
                            </p>
                          </div>
                          {/* Reality side */}
                          <div className="flex-1 bg-emerald-50 p-4 sm:p-5">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Reality</span>
                            </div>
                            <p className="text-sm text-emerald-800 leading-relaxed">
                              {myth.reality}
                            </p>
                            <div className="mt-3 pt-2 border-t border-emerald-200">
                              <p className="text-[10px] text-emerald-600 font-medium">
                                {myth.stat}
                              </p>
                              <p className="text-[10px] text-emerald-500/60 mt-0.5">
                                Source: {myth.source}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* INSURANCE CATEGORIES SECTION                                       */}
      {/* ================================================================== */}
      <section id="products" className="py-20 sm:py-28 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <Badge
              variant="secondary"
              className="mb-4 bg-amber-50 text-amber-700 border-amber-200"
            >
              Insurance Products
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Sahi <span className="text-emerald-600">Coverage</span> Dhundhiye
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              India ke top insurers ke plans compare karein — har category mein.
            </p>
          </motion.div>

          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            {categoryInfo.map((cat) => {
              const Icon = getCategoryIcon(cat.icon);
              const isActive = activeCategory === cat.id;
              const shortName = cat.name.replace(' Insurance', '');
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`
                    inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 min-h-[44px]
                    ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50'
                    }
                  `}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="sm:hidden">{shortName}</span>
                  <span className="hidden sm:inline">{cat.name}</span>
                </button>
              );
            })}
          </motion.div>

          {/* Category Info + Plan Cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Category description */}
              {currentCategoryInfo && (
                <div className="text-center mb-8">
                  <p className="text-slate-600 max-w-2xl mx-auto">
                    {currentCategoryInfo.description}
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-3 text-sm">
                    <span className="text-slate-500">
                      <span className="font-semibold text-slate-700">
                        {currentCategoryInfo.planCount}
                      </span>{' '}
                      plans
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="text-slate-500">
                      Avg CSR:{' '}
                      <span className="font-semibold text-emerald-600">
                        {currentCategoryInfo.avgClaimSettlementRatio}%
                      </span>
                    </span>
                  </div>
                </div>
              )}

              {/* Plan Cards Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentPlans.slice(0, 6).map((plan) => (
                  <Card
                    key={plan.id}
                    className="h-full hover:shadow-lg transition-all duration-300 group border-slate-200 flex flex-col"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <CardTitle className="text-base font-bold text-slate-900 leading-tight">
                            {plan.name}
                          </CardTitle>
                          <CardDescription className="text-sm text-slate-500 mt-1">
                            {plan.provider}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-0.5 shrink-0">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="text-sm font-semibold text-slate-700">
                            {plan.rating}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4 space-y-3">
                      {/* Premium */}
                      <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                        <span className="text-xs text-slate-500">Premium</span>
                        <span className="text-sm font-semibold text-emerald-600">
                          ₹{plan.premium.monthly}/mo
                        </span>
                      </div>

                      {/* CSR */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">CSR</span>
                        <span className="text-sm font-semibold text-slate-700">
                          {plan.claimSettlementRatio}%
                        </span>
                      </div>

                      {/* Solvency Ratio */}
                      {plan.solvencyRatio && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">Solvency</span>
                          <span className="text-sm font-semibold text-slate-700">
                            {plan.solvencyRatio}
                          </span>
                        </div>
                      )}

                      {/* Key Features */}
                      <div className="space-y-1.5">
                        {plan.features.slice(0, 3).map((f, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-xs text-slate-600"
                          >
                            <ChevronRight className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 mt-auto">
                      <Button
                        variant="outline"
                        className="w-full min-h-[44px] group-hover:border-emerald-400 group-hover:text-emerald-600 transition-colors"
                        onClick={() =>
                          toast({
                            title: plan.name,
                            description: plan.tagline,
                          })
                        }
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ================================================================== */}
      {/* GAME OF LIFE SECTION                                               */}
      {/* ================================================================== */}
      <section id="game-of-life" className="py-20 sm:py-28 bg-slate-50 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <Badge
              variant="secondary"
              className="mb-4 bg-rose-50 text-rose-700 border-rose-200"
            >
              Interactive
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Play the{' '}
              <span className="text-emerald-600">Game of Life</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Dekhiye insurance har stage par kaise protect karta hai
            </p>
          </motion.div>

          <GameOfLife />
        </div>
      </section>

      {/* ================================================================== */}
      {/* CONTACT SECTION                                                    */}
      {/* ================================================================== */}
      <section
        id="contact"
        ref={contactRef}
        className="py-20 sm:py-28 bg-white scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <Badge
              variant="secondary"
              className="mb-4 bg-emerald-50 text-emerald-700 border-emerald-200"
            >
              Get in Touch
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Expert <span className="text-emerald-600">Advice</span> Paayein
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Humare insurance advisors aapki madad ke liye taiyaar hain. WhatsApp par bhi sampark karein!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="pt-6">
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name">
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="contact-name"
                        placeholder="Your full name"
                        value={contactForm.name}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-email">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="contact-email"
                        type="email"
                        placeholder="you@example.com"
                        value={contactForm.email}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="contact-phone">
                        WhatsApp Number <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-200 bg-slate-50 text-sm text-slate-500 font-medium">
                          +91
                        </span>
                        <Input
                          id="contact-phone"
                          type="tel"
                          placeholder="10-digit mobile number"
                          value={contactForm.phone}
                          onChange={(e) =>
                            setContactForm((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          className="rounded-l-none"
                          maxLength={10}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-type">Insurance Type</Label>
                      <Select
                        value={contactForm.insuranceType}
                        onValueChange={(val) =>
                          setContactForm((prev) => ({
                            ...prev,
                            insuranceType: val,
                          }))
                        }
                      >
                        <SelectTrigger id="contact-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="health">Health Insurance</SelectItem>
                          <SelectItem value="life">Life Insurance</SelectItem>
                          <SelectItem value="motor">Motor Insurance</SelectItem>
                          <SelectItem value="travel">Travel Insurance</SelectItem>
                          <SelectItem value="home">Home Insurance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-message">
                      Message <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="contact-message"
                      placeholder="Apni insurance needs ke baare mein bataiye..."
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                      rows={4}
                      required
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-base gap-2"
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
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleWhatsAppClick}
                      className="flex-1 sm:flex-none border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800 h-12 gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      WhatsApp par baat karein
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-8">
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200">
                <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Call us</p>
                  <p className="text-sm font-semibold text-slate-700 truncate">
                    1800-XXX-XXXX
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200">
                <Mail className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Email us</p>
                  <p className="text-sm font-semibold text-slate-700 truncate">
                    help@paliwalsecure.in
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200">
                <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Visit us</p>
                  <p className="text-sm font-semibold text-slate-700 truncate">
                    Mumbai, India
                  </p>
                </div>
              </div>
            </div>

            {/* IRDAI Disclaimer */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-xs text-amber-700 leading-relaxed">
                <strong>IRDAI Disclaimer:</strong> {IRDAI_MANDATORY_DISCLAIMER}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FOOTER                                                             */}
      {/* ================================================================== */}
      <footer className="mt-auto bg-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  Paliwal<span className="text-emerald-400"> Secure</span>
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                AI-powered insurance recommendations for every Indian. Making
                insurance simple, transparent, and accessible.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-px bg-emerald-500/40 flex-1 max-w-[2rem]" />
                <span className="text-xs font-semibold text-emerald-400 tracking-wide">
                  Powered by Himanshu Paliwal
                </span>
                <div className="h-px bg-emerald-500/40 flex-1 max-w-[2rem]" />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                Quick Links
              </h4>
              <ul className="space-y-2.5">
                {[
                  { id: 'features', label: 'Features' },
                  { id: 'insuregyaan', label: 'InsureGyaan' },
                  { id: 'products', label: 'Products' },
                  { id: 'game-of-life', label: 'Game of Life' },
                  { id: 'contact', label: 'Contact Us' },
                ].map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Insurance Types */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                Insurance Types
              </h4>
              <ul className="space-y-2.5">
                {categoryInfo.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => {
                        setActiveCategory(cat.id);
                        scrollToSection('products');
                      }}
                      className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Compliance */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                Compliance
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>IRDAI Registered</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Grievance Redressal</li>
                <li>DPDP Act Compliant</li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-slate-800">
            <div className="flex flex-col items-center gap-4">
              {/* Powered by branding */}
              <div className="flex items-center gap-2 bg-slate-800/60 px-4 py-2 rounded-full border border-slate-700/50">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-white">
                  Powered by{' '}
                  <span className="text-emerald-400">Himanshu Paliwal</span>
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3">
                <div className="flex flex-col items-center sm:items-start gap-1">
                  <p className="text-xs text-slate-500 text-center sm:text-left">
                    &copy; {new Date().getFullYear()} Paliwal Secure. All rights reserved.
                    Insurance is the subject matter of solicitation. Read all policy documents carefully.
                  </p>
                  <p className="text-xs text-slate-400 text-center sm:text-left">
                    Designed &amp; Developed by{' '}
                    <span className="font-semibold text-emerald-400">Himanshu Paliwal</span>
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-500">
                    IRDAI Regulated Platform
                  </span>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-emerald-400 font-medium">
                      Compliant
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Full IRDAI Disclaimers */}
            <div className="mt-4 space-y-1">
              <p className="text-xs text-slate-600 leading-relaxed text-center sm:text-left max-w-4xl">
                {IRDAI_MANDATORY_DISCLAIMER} Tax benefits are subject to changes
                in tax laws. Please consult your tax advisor for details. Claim
                settlement ratio is based on previous year&apos;s data. Past
                performance is not indicative of future results.
              </p>
              <p className="text-xs text-slate-600 leading-relaxed text-center sm:text-left max-w-4xl">
                Insurance is a subject matter of solicitation. Read all policy documents carefully before concluding a sale.
                IRDAI Reg No: This platform is for educational purposes only and does not sell insurance directly.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* ================================================================== */}
      {/* FLOATING COMPONENTS                                                */}
      {/* ================================================================== */}

      {/* Onboarding Flow */}
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
