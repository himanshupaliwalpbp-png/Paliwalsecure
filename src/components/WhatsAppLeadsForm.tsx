'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  MessageCircle, Phone, ShieldCheck, Users, Zap,
  CheckCircle2, Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/lib/i18n';

// ── Insurance type options (keys for i18n lookup) ───────────────────────────
const insuranceTypeKeys = [
  { value: 'health', labelKey: 'whatsappForm.type.health' },
  { value: 'term', labelKey: 'whatsappForm.type.term' },
  { value: 'life', labelKey: 'whatsappForm.type.life' },
  { value: 'car', labelKey: 'whatsappForm.type.car' },
  { value: 'bike', labelKey: 'whatsappForm.type.bike' },
  { value: 'travel', labelKey: 'whatsappForm.type.travel' },
  { value: 'home', labelKey: 'whatsappForm.type.home' },
  { value: 'critical-illness', labelKey: 'whatsappForm.type.criticalIllness' },
  { value: 'personal-accident', labelKey: 'whatsappForm.type.personalAccident' },
  { value: 'pension', labelKey: 'whatsappForm.type.pension' },
  { value: 'corporate', labelKey: 'whatsappForm.type.corporate' },
  { value: 'fire-marine', labelKey: 'whatsappForm.type.fireMarine' },
  { value: 'crop', labelKey: 'whatsappForm.type.crop' },
  { value: 'other', labelKey: 'whatsappForm.type.other' },
];

// ── Trust Indicators (keys for i18n lookup) ─────────────────────────────────
const trustIndicatorKeys = [
  { icon: Users, labelKey: 'whatsappForm.trust.500families', color: 'text-[#1E40AF]' },
  { icon: ShieldCheck, labelKey: 'whatsappForm.trust.irdaiCertified', color: 'text-[#0D9488]' },
  { icon: Zap, labelKey: 'whatsappForm.trust.freeConsultation', color: 'text-[#D97706]' },
  { icon: CheckCircle2, labelKey: 'whatsappForm.trust.irdaiPOSP', color: 'text-[#1E40AF]' },
];

// ============================================================================
// WhatsAppLeadsForm Component
// ============================================================================
export default function WhatsAppLeadsForm() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    insuranceType: '',
    city: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Build translated insurance types list
  const insuranceTypes = useMemo(
    () => insuranceTypeKeys.map((item) => ({ value: item.value, label: t(item.labelKey) })),
    [t],
  );

  // Build translated trust indicators list
  const trustIndicators = useMemo(
    () => trustIndicatorKeys.map((item) => ({ icon: item.icon, label: t(item.labelKey), color: item.color })),
    [t],
  );

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const isFormValid = formData.name.trim() && formData.phone.trim().length >= 10 && formData.insuranceType;

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // 1. Save lead to database via API
      await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          mobile: formData.phone.trim(),
          preferredTime: 'asap',
          message: `[${insuranceTypes.find((type) => type.value === formData.insuranceType)?.label || formData.insuranceType}] ${formData.city ? `City: ${formData.city}. ` : ''}${formData.message.trim()}`,
          source: 'whatsapp',
        }),
      }).catch(() => {
        // Silently fail — WhatsApp redirect is the primary action
      });

      // 2. Open WhatsApp with pre-filled message
      const insuranceLabel = insuranceTypes.find((type) => type.value === formData.insuranceType)?.label || formData.insuranceType;
      const waMessage = `Namaste! 🙏\n\nName: ${formData.name.trim()}\nPhone: +91 ${formData.phone.trim()}\nInsurance: ${insuranceLabel}${formData.city ? `\nCity: ${formData.city.trim()}` : ''}${formData.message ? `\nMessage: ${formData.message.trim()}` : ''}\n\nI'd like to know more about insurance options.`;
      const waUrl = `https://wa.me/919257877312?text=${encodeURIComponent(waMessage)}`;
      window.open(waUrl, '_blank');

      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isFormValid, isSubmitting, insuranceTypes]);

  return (
    <section id="whatsapp-form" className="py-16 sm:py-24 lg:py-20 bg-background scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <Badge className="mb-4 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800 rounded-full px-4 py-1">
            <MessageCircle className="w-3.5 h-3.5 mr-1" />
            {t('whatsappForm.badge')}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            <span className="text-[#0D9488]">{t('whatsappForm.headingHighlight')}</span>{' '}{t('whatsappForm.headingAfter')}
          </h2>
          <p className="mt-3 text-base sm:text-lg font-semibold text-[#0D9488] dark:text-emerald-400">
            {t('whatsappForm.subheading')}
          </p>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            {t('whatsappForm.description')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          {/* ── Left: Trust & Info ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-5"
          >
            {/* Trust Indicators */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4">{t('whatsappForm.whyChoose')}</h3>
              <div className="space-y-3.5">
                {trustIndicators.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.labelKey} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-muted/80 flex items-center justify-center">
                        <Icon className={`w-4.5 h-4.5 ${item.color}`} />
                      </div>
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* How it works */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4">{t('whatsappForm.howItWorks')}</h3>
              <div className="space-y-4">
                {[
                  { step: '1', text: t('whatsappForm.step1'), highlight: '' },
                  { step: '2', text: t('whatsappForm.step2'), highlight: '' },
                  { step: '3', text: t('whatsappForm.step3'), highlight: '100% Free' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#1E40AF]/10 text-[#1E40AF] flex items-center justify-center text-xs font-bold shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">{item.text}</span>
                      {item.highlight && (
                        <Badge className="ml-2 bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] px-1.5 py-0">
                          {item.highlight}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Phone CTA */}
            <div className="rounded-2xl bg-gradient-to-br from-[#1E40AF] to-[#1E3A8A] p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <Phone className="w-5 h-5" />
                <span className="font-semibold">{t('whatsappForm.preferCall')}</span>
              </div>
              <p className="text-sm text-white/80 mb-3">{t('whatsappForm.callDesc')}</p>
              <a href="tel:9257877312">
                <Button className="bg-white text-[#1E40AF] hover:bg-white/90 rounded-xl font-semibold">
                  <Phone className="w-4 h-4 mr-1.5" /> Call 9257877312
                </Button>
              </a>
            </div>
          </motion.div>

          {/* ── Right: Form ─────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{t('whatsappForm.successTitle')}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('whatsappForm.successDesc')}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', phone: '', insuranceType: '', city: '', message: '' });
                    }}
                    className="rounded-xl"
                  >
                    {t('whatsappForm.submitAnother')}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      {t('whatsappForm.nameLabel')} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder={t('whatsappForm.namePlaceholder')}
                      className="rounded-xl h-11"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      {t('whatsappForm.phoneLabel')} <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="flex items-center px-3 h-11 rounded-xl border border-border bg-muted/50 text-sm font-medium text-muted-foreground shrink-0">
                        +91
                      </div>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          handleInputChange('phone', val);
                        }}
                        placeholder="9876543210"
                        className="rounded-xl h-11 flex-1"
                        required
                      />
                    </div>
                  </div>

                  {/* Insurance Type */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      {t('whatsappForm.insuranceTypeLabel')} <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={formData.insuranceType}
                      onValueChange={(val) => handleInputChange('insuranceType', val)}
                    >
                      <SelectTrigger className="rounded-xl h-11 w-full">
                        <SelectValue placeholder={t('whatsappForm.insuranceTypePlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        {insuranceTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* City */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      {t('whatsappForm.cityLabel')}
                    </label>
                    <Input
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder={t('whatsappForm.cityPlaceholder')}
                      className="rounded-xl h-11"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      {t('whatsappForm.messageLabel')} <span className="text-xs text-muted-foreground">{t('whatsappForm.messageOptional')}</span>
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder={t('whatsappForm.messagePlaceholder')}
                      rows={3}
                      className="flex w-full rounded-xl border border-border bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className="w-full h-12 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold text-base shadow-lg shadow-green-600/20 gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <MessageCircle className="w-5 h-5" />
                        {t('whatsappForm.submitButton')}
                      </>
                    )}
                  </Button>

                  <p className="text-[10px] text-muted-foreground text-center">
                    {t('whatsappForm.securityNote')}
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
