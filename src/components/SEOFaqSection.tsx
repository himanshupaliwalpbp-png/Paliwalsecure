'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Heart, Shield, Car, FileText, IndianRupee, ChevronDown, Search, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { seoFAQs, getFAQCategories, type SEOFAQItem } from '@/data/seoFAQ';
import { useLanguage } from '@/lib/i18n';

// Category icon mapping
const categoryIcons: Record<string, React.ElementType> = {
  health: Heart,
  'term-life': Shield,
  motor: Car,
  claims: FileText,
  tax: IndianRupee,
};

// Category gradient mapping
const categoryGradients: Record<string, string> = {
  health: 'from-rose-500 to-pink-600',
  'term-life': 'from-blue-800 to-blue-600',
  motor: 'from-amber-600 to-orange-600',
  claims: 'from-teal-600 to-emerald-600',
  tax: 'from-violet-600 to-purple-600',
};

// Category badge style mapping
const categoryBadgeStyles: Record<string, string> = {
  health: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800',
  'term-life': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
  motor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
  claims: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800',
  tax: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800',
};

export default function SEOFaqSection() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();

  const categories = getFAQCategories();

  // Filter FAQs based on category and search
  const filteredFAQs = useMemo(() => {
    let faqs = seoFAQs;

    if (activeCategory !== 'all') {
      faqs = faqs.filter((faq) => faq.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      faqs = faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query)
      );
    }

    return faqs;
  }, [activeCategory, searchQuery]);

  // Group FAQs by category for display
  const groupedFAQs = useMemo(() => {
    const groups: Record<string, SEOFAQItem[]> = {};
    filteredFAQs.forEach((faq) => {
      if (!groups[faq.category]) {
        groups[faq.category] = [];
      }
      groups[faq.category].push(faq);
    });
    return groups;
  }, [filteredFAQs]);

  return (
    <section id="faq" className="py-16 sm:py-24 bg-gradient-to-b from-background via-muted/20 to-background scroll-mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-14"
        >
          <Badge className="mb-4 bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800 rounded-full px-4 py-1">
            <HelpCircle className="w-3.5 h-3.5 mr-1" />
            {t('faq.badge')}
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            {t('faq.heading')}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            {t('faq.description')}
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6 max-w-lg mx-auto"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('faq.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-11 rounded-full border-border/60 bg-card focus-visible:ring-teal-400/30"
              aria-label="Search FAQ questions"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                aria-label={t('faq.clear')}
              >
                {t('faq.clear')}
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {filteredFAQs.length} {filteredFAQs.length !== 1 ? t('faq.resultsFound') : t('faq.resultFound')}
            </p>
          )}
        </motion.div>

        {/* Category Filter Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          <Button
            variant={activeCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory('all')}
            className={`rounded-full text-xs h-8 ${
              activeCategory === 'all'
                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white border-0'
                : 'hover:bg-teal-50 dark:hover:bg-teal-950/30'
            }`}
          >
            <HelpCircle className="w-3 h-3 mr-1" />
            {t('faq.all')} ({seoFAQs.length})
          </Button>
          {categories.map((cat) => {
            const CatIcon = categoryIcons[cat.value] || HelpCircle;
            const count = seoFAQs.filter((f) => f.category === cat.value).length;
            return (
              <Button
                key={cat.value}
                variant={activeCategory === cat.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(cat.value)}
                className={`rounded-full text-xs h-8 ${
                  activeCategory === cat.value
                    ? `bg-gradient-to-r ${categoryGradients[cat.value]} text-white border-0`
                    : 'hover:bg-muted'
                }`}
              >
                <CatIcon className="w-3 h-3 mr-1" />
                {cat.label} ({count})
              </Button>
            );
          })}
        </motion.div>

        {/* FAQ Accordion Groups */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + searchQuery}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">{t('faq.noResults')}</p>
              </div>
            ) : (
              Object.entries(groupedFAQs).map(([category, faqs]) => {
                const CatIcon = categoryIcons[category] || HelpCircle;
                const categoryData = categories.find((c) => c.value === category);
                return (
                  <div key={category} className="mb-8 last:mb-0">
                    {/* Category Header */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${categoryGradients[category]} flex items-center justify-center shadow-md`}>
                        <CatIcon className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground">{categoryData?.label || category}</h3>
                      <Badge variant="outline" className={`text-[10px] ${categoryBadgeStyles[category]}`}>
                        {faqs.length} Q&A
                      </Badge>
                    </div>

                    {/* Accordion */}
                    <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                      <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                          <AccordionItem
                            key={faq.id}
                            value={faq.id}
                            className={`border-border/40 ${index === faqs.length - 1 ? 'border-b-0' : ''}`}
                          >
                            <AccordionTrigger
                              className="px-4 sm:px-6 py-4 hover:no-underline hover:bg-muted/30 transition-colors text-left"
                              aria-label={`Question: ${faq.question}`}
                            >
                              <div className="flex items-start gap-3 text-left flex-1 pr-2" data-faq-question>
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/20 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs font-bold mt-0.5">
                                  {index + 1}
                                </span>
                                <span className="text-sm sm:text-base font-medium text-foreground leading-snug">
                                  {faq.question}
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 sm:px-6 pb-4">
                              <div className="pl-9 border-l-2 border-teal-200 dark:border-teal-800/50 ml-3" data-faq-answer role="region" aria-label={`Answer to: ${faq.question}`}>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {faq.answer}
                                </p>
                                <div className="mt-3 flex items-center gap-2">
                                  <MessageCircle className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                                  <span className="text-xs text-teal-700 dark:text-teal-300 font-medium">
                                    {t('faq.stillConfused')}
                                  </span>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </div>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-10 text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">
            {t('faq.notHere')}
          </p>
          <a href="https://wa.me/919257877312?text=Namaste!%20Mera%20ek%20insurance%20sawal%20hai" target="_blank" rel="noopener noreferrer">
            <Button className="cta-amber btn-ripple rounded-full gap-2 shadow-lg shadow-amber-600/20">
              <MessageCircle className="w-4 h-4" />
              {t('faq.whatsappCta')}
            </Button>
          </a>
          <p className="text-xs text-muted-foreground mt-3">
            {t('faq.certifiedAdvisor')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
