'use client';

import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, ChevronDown, ChevronUp, Lightbulb, Tag } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useThemeAware } from '@/lib/use-theme-aware';

// ── Glossary Term IDs ──────────────────────────────────────────────────────
const GLOSSARY_TERMS = [
  'idv', 'zeroDep', 'ncb', 'thirdParty', 'comprehensive', 'premium',
  'deductible', 'cashless', 'reimbursement', 'waitingPeriod', 'ped',
  'copay', 'roomRent', 'csr', 'rider', 'freeLook', 'portability',
  'termInsurance', 'floater', 'gracePeriod', 'sumInsured',
  'endorsement', 'depreciation', 'superTopUp', 'irdai',
] as const;

type TermId = typeof GLOSSARY_TERMS[number];

// ── Category colors ────────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  health:   { bg: 'bg-emerald-500/15',  text: 'text-emerald-400',  border: 'border-emerald-500/30' },
  motor:    { bg: 'bg-[#162D5A]/15',     text: 'text-[#162D5A] dark:text-[#3A5090]',  border: 'border-[#162D5A]/30' },
  life:     { bg: 'bg-[#C98A1C]/15',   text: 'text-[#C98A1C] dark:text-[#C98A1C]',   border: 'border-[#C98A1C]/30' },
  claims:   { bg: 'bg-amber-500/15',    text: 'text-amber-400',    border: 'border-amber-500/30' },
  general:  { bg: 'bg-rose-500/15',     text: 'text-rose-300',     border: 'border-rose-500/30' },
};

const CATEGORIES = ['all', 'health', 'motor', 'life', 'claims', 'general'] as const;

// ── Category icons (emoji for simple inline) ──────────────────────────────
const CATEGORY_ICONS: Record<string, string> = {
  health: '🏥',
  motor: '🚗',
  life: '🛡️',
  claims: '📋',
  general: '📖',
};

export default function InsuranceGlossarySection() {
  const { language, t } = useLanguage();
  const { isDark } = useThemeAware();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedTerms, setExpandedTerms] = useState<Set<TermId>>(new Set());

  // ── Debounce search ────────────────────────────────────────────────────
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onSearchChange = (value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(value), 250);
  };

  // ── Filter terms ───────────────────────────────────────────────────────
  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter((id) => {
      const name = t(`glossary.term.${id}.name`);
      const hindi = t(`glossary.term.${id}.hindi`);
      const explanation = t(`glossary.term.${id}.explanation`);
      const category = t(`glossary.term.${id}.category`);

      const query = debouncedQuery.toLowerCase();
      const matchesSearch =
        !query ||
        name.toLowerCase().includes(query) ||
        hindi.toLowerCase().includes(query) ||
        explanation.toLowerCase().includes(query);

      const matchesCategory =
        activeCategory === 'all' || category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [debouncedQuery, activeCategory, t]);

  // ── Toggle expand ──────────────────────────────────────────────────────
  const toggleExpand = (id: TermId) => {
    setExpandedTerms((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ── Animation variants ─────────────────────────────────────────────────
  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.04, duration: 0.4, ease: 'easeOut' },
    }),
    exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
  };

  return (
    <section className="relative py-16 md:py-24 lg:py-28 overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 ${isDark ? 'bg-[#0a1628]' : 'bg-[#FAFAF8]'}`} />
      <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-b from-[#0F1D30]/50 via-transparent to-[#0a1628]' : 'bg-gradient-to-b from-[#F0F4FF]/50 via-transparent to-[#FAFAF8]'}`} />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#c8922a 1px, transparent 1px), linear-gradient(90deg, #c8922a 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c8922a]/10 border border-[#c8922a]/25 mb-4">
            <BookOpen className="w-4 h-4 text-[#c8922a]" />
            <span className="text-sm font-medium text-[#c8922a]">
              {t('glossary.title', language)} / {t('glossary.titleDictionary', language)}
            </span>
          </div>

          <h2 className={`text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold ${isDark ? 'text-white' : 'text-[#0A1330]'} mb-4`}>
            {t('glossary.titleInsurance', language)}{' '}
            <span className="text-[#c8922a]">{t('glossary.titleDictionary', language)}</span>
          </h2>

          <p className={`${isDark ? 'text-gray-400' : 'text-[#6B7280]'} max-w-2xl mx-auto text-base md:text-lg lg:text-xl leading-relaxed`}>
            {t('glossary.subtitle', language)}
          </p>
        </motion.div>

        {/* ── Search Bar ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-xl mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t('glossary.searchPlaceholder', language)}
              className="pl-12 pr-4 py-3.5 border text-base rounded-xl focus:border-[#c8922a]/50 focus:ring-[#c8922a]/20"
              style={{
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                color: isDark ? 'white' : '#0A1330',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setDebouncedQuery('');
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-sm"
              >
                ✕
              </button>
            )}
          </div>
        </motion.div>

        {/* ── Category Tabs ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent justify-start md:justify-center"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const label =
              cat === 'all'
                ? t('glossary.categoryAll', language)
                : t(`glossary.categories.${cat}`, language);
            const icon = cat === 'all' ? '📚' : (CATEGORY_ICONS[cat] ?? '');
            const colors = cat === 'all'
              ? { bg: 'bg-[#c8922a]/20', text: 'text-[#c8922a]', border: 'border-[#c8922a]/40' }
              : CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.general;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  flex items-center gap-1.5 px-4 py-2 rounded-lg border whitespace-nowrap
                  text-sm font-medium transition-all duration-200 shrink-0
                  ${isActive
                    ? `${colors.bg} ${colors.text} ${colors.border}`
                    : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* ── Results Count ───────────────────────────────────────────────── */}
        <div className="text-center mb-6">
          <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-[#6B7280]'}`}>
            {filteredTerms.length} {filteredTerms.length === 1 ? t('glossary.termSingular', language) : t('glossary.termsCount', language)}
            {activeCategory !== 'all' && ` · ${t(`glossary.categories.${activeCategory}`, language)}`}
            {debouncedQuery && ` · "${debouncedQuery}"`}
          </span>
        </div>

        {/* ── Glossary Grid ───────────────────────────────────────────────── */}
        {filteredTerms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-5xl mb-4">🔍</div>
            <p className={`${isDark ? 'text-gray-400' : 'text-[#6B7280]'} text-lg`}>
              {t('glossary.noResults', language)}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            <AnimatePresence mode="popLayout">
              {filteredTerms.map((id, index) => {
                const name = t(`glossary.term.${id}.name`, language);
                const hindi = t(`glossary.term.${id}.hindi`, language);
                const explanation = t(`glossary.term.${id}.explanation`, language);
                const example = t(`glossary.term.${id}.example`, language);
                const category = t(`glossary.term.${id}.category`, language);
                const isExpanded = expandedTerms.has(id);
                const colors = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.general;

                return (
                  <motion.div
                    key={id}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className={`
                      relative group rounded-xl border overflow-hidden
                      backdrop-blur-md transition-all duration-300
                      ${isDark ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-white border-[#E5E2DB] shadow-sm'}
                      hover:bg-white/[0.06] hover:border-[#c8922a]/30
                      hover:shadow-lg hover:shadow-[#c8922a]/5
                    `}
                  >
                    {/* Golden accent line on top */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c8922a]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="p-5">
                      {/* Header: Name + Badge */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-lg lg:text-xl font-bold ${isDark ? 'text-white' : 'text-[#0A1330]'} leading-tight truncate`}>
                            {name}
                          </h3>
                          <p className="text-[#c8922a] text-sm font-medium mt-0.5">
                            {hindi}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={`
                            shrink-0 text-[11px] px-2 py-0.5 font-medium
                            ${colors.bg} ${colors.text} ${colors.border}
                          `}
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {CATEGORY_ICONS[category]} {t(`glossary.categories.${category}`, language)}
                        </Badge>
                      </div>

                      {/* Explanation */}
                      <p className={`${isDark ? 'text-gray-300' : 'text-[#1A1A2E]/75'} text-sm lg:text-base leading-relaxed mb-3`}>
                        {explanation}
                      </p>

                      {/* Expand/Collapse toggle */}
                      <button
                        onClick={() => toggleExpand(id)}
                        className="flex items-center gap-1.5 text-[#c8922a] text-sm font-medium hover:text-[#d9a63e] transition-colors"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            {t('glossary.showLess', language)}
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            {t('glossary.learnMore', language)}
                          </>
                        )}
                      </button>

                      {/* Expandable Example Section */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 p-3.5 rounded-lg bg-[#c8922a]/5 border border-[#c8922a]/15">
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <Lightbulb className="w-3.5 h-3.5 text-[#c8922a]" />
                                <span className="text-[#c8922a] text-xs font-semibold uppercase tracking-wide">
                                  {t('glossary.example', language)}
                                </span>
                              </div>
                              <p className={`${isDark ? 'text-gray-300' : 'text-[#1A1A2E]/75'} text-sm leading-relaxed`}>
                                {example}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* ── Bottom CTA ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className={`${isDark ? 'text-gray-500' : 'text-[#6B7280]'} text-sm`}>
            💡 {t('glossary.askInsureGPT', language)}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
