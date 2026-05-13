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
import { useToast } from '@/hooks/use-toast';
import {
  categoryInfo,
  getPlansByCategory,
  formatCurrency,
  type InsuranceCategory,
  type UserProfile,
  IRDAI_MANDATORY_DISCLAIMER,
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
const ChatBot = dynamic(() => import('@/components/ChatBot'), {
  ssr: false,
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

// ── Stat Data ──────────────────────────────────────────────────────────────
const heroStats = [
  { label: 'Uninsured Indians', value: 700, suffix: 'M+', prefix: '' },
  { label: 'Claim Settlement', value: 87, suffix: '%', prefix: '' },
  { label: 'Avg Hospital Bill', value: 2, suffix: 'L', prefix: '₹' },
];

// ── Feature Data ───────────────────────────────────────────────────────────
const features = [
  {
    icon: Brain,
    title: 'AI-Powered',
    description:
      'Personalized recommendations using AI that understands your unique needs',
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
  },
  {
    icon: ShieldCheck,
    title: 'IRDAI Compliant',
    description:
      'All recommendations follow IRDAI guidelines with full transparency',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  {
    icon: Mic,
    title: 'Voice-First',
    description:
      "Speak your questions in your language - our AI understands you",
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  {
    icon: MessageSquare,
    title: 'Zero Jargon',
    description:
      'Complex insurance terms explained simply for every Indian',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
  },
];

// ============================================================================
// Main Page Component
// ============================================================================

export default function InsureGPTPage() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeCategory, setActiveCategory] = useState<InsuranceCategory>('health');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

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
  const stat2 = useAnimatedCounter(heroVisible ? 87 : 0, 2000);
  const stat3 = useAnimatedCounter(heroVisible ? 2 : 0, 1500);

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

  return (
    <div className="min-h-screen flex flex-col bg-white">
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
                Insure<span className="text-emerald-600">GPT</span>
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection('features')}
                className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('products')}
                className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
              >
                Products
              </button>
              <button
                onClick={() => scrollToSection('game-of-life')}
                className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
              >
                Game of Life
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
              >
                Contact
              </button>
            </div>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowOnboarding(true)}
                className="hidden sm:inline-flex bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-sm"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
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
              className="md:hidden border-t border-slate-200/60 bg-white/95 backdrop-blur-lg overflow-hidden"
            >
              <div className="px-4 py-4 space-y-3">
                {[
                  { id: 'features', label: 'Features' },
                  { id: 'products', label: 'Products' },
                  { id: 'game-of-life', label: 'Game of Life' },
                  { id: 'contact', label: 'Contact' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
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
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-0">
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
                  AI-Powered Insurance Advisor
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight"
              >
                Smart Insurance{' '}
                <span className="text-emerald-600">for Every Indian</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 text-lg sm:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                AI-powered recommendations tailored to your life. No jargon, no
                confusion — just the right coverage.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Button
                  size="lg"
                  onClick={() => setShowOnboarding(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-lg shadow-emerald-200 h-12 px-8 text-base"
                >
                  Get Personalized Recommendations
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection('game-of-life')}
                  className="gap-2 border-slate-300 hover:border-emerald-400 hover:text-emerald-600 h-12 px-8 text-base"
                >
                  Talk to InsureGPT
                  <MessageSquare className="w-5 h-5" />
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-12 grid grid-cols-3 gap-4 sm:gap-8"
              >
                <div className="text-center lg:text-left">
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                    {stat1}M+
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Uninsured
                  </p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                    {stat2}%
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Claim Settlement
                  </p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                    ₹{stat3}L
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Avg Hospital Bill
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right: Hero illustration placeholder */}
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
                      💡 2 gaps found in your coverage
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
      {/* FEATURES SECTION                                                   */}
      {/* ================================================================== */}
      <section id="features" className="py-20 sm:py-28 bg-white">
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
              Why InsureGPT
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Insurance Made{' '}
              <span className="text-emerald-600">Intelligent</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              We combine cutting-edge AI with deep insurance expertise to make
              insurance accessible, transparent, and personalized for every
              Indian.
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
      {/* INSURANCE CATEGORIES SECTION                                       */}
      {/* ================================================================== */}
      <section id="products" className="py-20 sm:py-28 bg-slate-50">
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
              Find the Right{' '}
              <span className="text-emerald-600">Coverage</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Compare plans from India&apos;s top insurers across every category.
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
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`
                    inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {cat.name}
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
                    className="hover:shadow-lg transition-all duration-300 group border-slate-200"
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
                      {/* Premium Range */}
                      <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                        <span className="text-xs text-slate-500">Premium</span>
                        <span className="text-sm font-semibold text-emerald-600">
                          {formatCurrency(plan.premium.min)} -{' '}
                          {formatCurrency(plan.premium.max)}/yr
                        </span>
                      </div>

                      {/* CSR */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">CSR</span>
                        <span className="text-sm font-semibold text-slate-700">
                          {plan.claimSettlementRatio}%
                        </span>
                      </div>

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
                    <CardFooter className="pt-0">
                      <Button
                        variant="outline"
                        className="w-full group-hover:border-emerald-400 group-hover:text-emerald-600 transition-colors"
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
      <section id="game-of-life" className="py-20 sm:py-28 bg-white">
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
              See how insurance protects you at every stage of life
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
        className="py-20 sm:py-28 bg-slate-50"
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
              Get <span className="text-emerald-600">Expert Advice</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Our insurance advisors are ready to help you find the perfect
              plan.
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
                      <Label htmlFor="contact-phone">Phone</Label>
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
                      />
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
                      placeholder="Tell us about your insurance needs..."
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

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-base gap-2"
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
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="grid sm:grid-cols-3 gap-4 mt-8">
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200">
                <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Call us</p>
                  <p className="text-sm font-semibold text-slate-700">
                    1800-XXX-XXXX
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200">
                <Mail className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Email us</p>
                  <p className="text-sm font-semibold text-slate-700">
                    help@insuregpt.in
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200">
                <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Visit us</p>
                  <p className="text-sm font-semibold text-slate-700">
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
                  Insure<span className="text-emerald-400">GPT</span>
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                AI-powered insurance recommendations for every Indian. Making
                insurance simple, transparent, and accessible.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                Quick Links
              </h4>
              <ul className="space-y-2.5">
                {[
                  { id: 'features', label: 'Features' },
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
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-slate-800">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500 text-center sm:text-left">
                © {new Date().getFullYear()} InsureGPT. All rights reserved.
                Insurance is the subject matter of solicitation.
              </p>
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
            <p className="mt-4 text-[10px] text-slate-600 leading-relaxed text-center sm:text-left max-w-4xl">
              {IRDAI_MANDATORY_DISCLAIMER} Tax benefits are subject to changes
              in tax laws. Please consult your tax advisor for details. Claim
              settlement ratio is based on previous year&apos;s data. Past
              performance is not indicative of future results.
            </p>
          </div>
        </div>
      </footer>

      {/* ================================================================== */}
      {/* FLOATING COMPONENTS                                                */}
      {/* ================================================================== */}

      {/* ChatBot */}
      <ChatBot profile={userProfile} />

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
