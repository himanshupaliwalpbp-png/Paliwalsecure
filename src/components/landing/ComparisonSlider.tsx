'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { useThemeAware } from '@/lib/use-theme-aware';

/* ═══════════════════════════════════════════════════════════════════════════
   ComparisonSlider — "Confused vs Protected" Dramatic Before/After
   Interactive slider with clip-path reveal, auto-animate on scroll
   ═══════════════════════════════════════════════════════════════════════════ */

export default function ComparisonSlider() {
  const { t } = useLanguage();
  const { isDark } = useThemeAware();
  const sectionRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const hasAutoAnimatedRef = useRef(false);

  /* ─── Auto-animate once when scrolled into view ─── */
  useEffect(() => {
    if (isInView && !hasAutoAnimatedRef.current) {
      hasAutoAnimatedRef.current = true;
      const startTime = performance.now();
      const duration = 3000;
      const startPosition = 0;
      const endPosition = 60;

      function animate(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutCubic for smooth deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        const position = startPosition + (endPosition - startPosition) * eased;
        setSliderPosition(position);
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      }
      requestAnimationFrame(animate);
    }
  }, [isInView]);

  /* ─── Drag Handlers ─── */
  const getPositionFromEvent = useCallback((clientX: number) => {
    if (!sliderRef.current) return 50;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    return Math.max(5, Math.min(95, percentage));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setSliderPosition(getPositionFromEvent(e.clientX));
  }, [getPositionFromEvent]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setSliderPosition(getPositionFromEvent(e.clientX));
  }, [isDragging, getPositionFromEvent]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    setSliderPosition(getPositionFromEvent(e.touches[0].clientX));
  }, [getPositionFromEvent]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    setSliderPosition(getPositionFromEvent(e.touches[0].clientX));
  }, [isDragging, getPositionFromEvent]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  /* ─── Pain Points (Left / Before) ─── */
  const painPoints = [
    { key: 'comparison.pain1', icon: '❌' },
    { key: 'comparison.pain2', icon: '❌' },
    { key: 'comparison.pain3', icon: '❌' },
    { key: 'comparison.pain4', icon: '❌' },
  ];

  /* ─── Benefits (Right / After) ─── */
  const benefits = [
    { key: 'comparison.benefit1', icon: '✅' },
    { key: 'comparison.benefit2', icon: '✅' },
    { key: 'comparison.benefit3', icon: '✅' },
    { key: 'comparison.benefit4', icon: '✅' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-20 lg:py-28 overflow-hidden"
      style={{
        background: isDark
          ? 'linear-gradient(180deg, #0F1D30 0%, #0A1330 50%, #0F1D30 100%)'
          : 'linear-gradient(180deg, #F0F4FF 0%, #FAFAF8 50%, #F0F4FF 100%)',
      }}
    >
      {/* ─── Wave Pattern Background Overlay ─── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='60' viewBox='0 0 120 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 30 Q30 0 60 30 Q90 60 120 30' fill='none' stroke='%23C8922A' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '120px 60px',
        }}
      />

      {/* ─── Radial Glow ─── */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(201,138,28,0.08) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── Section Header ─── */}
        <motion.div
          className="text-center mb-10 lg:mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.h2
            className={`text-3xl sm:text-4xl lg:text-4xl font-extrabold mb-4 font-[family-name:var(--font-heading)] ${isDark ? 'text-white' : 'text-[#0A1330]'}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t('comparison.heading')}
          </motion.h2>
          <motion.p
            className={`text-base sm:text-lg lg:text-xl ${isDark ? 'text-white/90' : 'text-[#1A1A2E]/80'} max-w-2xl mx-auto leading-relaxed`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('comparison.subheading')}
          </motion.p>
        </motion.div>

        {/* ─── Desktop Slider (hidden on mobile) ─── */}
        <motion.div
          className="hidden md:block"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div
            ref={sliderRef}
            className="relative w-full h-[520px] lg:h-[720px] rounded-3xl overflow-hidden cursor-col-resize select-none"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(201,138,28,0.15)',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            role="slider"
            aria-label={t('comparison.sliderLabel')}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(sliderPosition)}
            tabIndex={0}
          >
            {/* ─── LEFT SIDE: "BINA AI KE" (Full background layer) ─── */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center p-8"
              style={{
                background: 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(10,22,40,0.6) 100%)',
              }}
            >
              <h3
                className="text-xl sm:text-2xl lg:text-2xl font-bold mb-3 lg:mb-5 font-[family-name:var(--font-heading)]"
                style={{ color: '#EF4444' }}
              >
                {t('comparison.leftLabel')}
              </h3>
              <div className="space-y-2 lg:space-y-3 w-full max-w-md">
                {painPoints.map((point, index) => (
                  <motion.div
                    key={point.key}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  >
                    <span className="text-lg flex-shrink-0 mt-0.5">{point.icon}</span>
                    <span className={`text-sm sm:text-base lg:text-base ${isDark ? 'text-white/90' : 'text-[#1A1A2E]/85'} leading-relaxed`}>
                      {t(point.key)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ─── RIGHT SIDE: "PALIWALSECURE KE SAATH" (Clip-path reveal) ─── */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center p-8"
              style={{
                clipPath: `inset(0 0 0 ${sliderPosition}%)`,
                background: 'linear-gradient(135deg, rgba(201,138,28,0.12) 0%, rgba(10,22,40,0.8) 100%)',
              }}
            >
              <h3
                className="text-xl sm:text-2xl lg:text-2xl font-bold mb-3 lg:mb-5 font-[family-name:var(--font-heading)] gradient-text"
              >
                {t('comparison.rightLabel')}
              </h3>
              <div className="space-y-2 lg:space-y-3 w-full max-w-md">
                {benefits.map((point, index) => (
                  <motion.div
                    key={point.key}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  >
                    <span className="text-lg flex-shrink-0 mt-0.5">{point.icon}</span>
                    <span className={`text-sm sm:text-base lg:text-base ${isDark ? 'text-white/95' : 'text-[#1A1A2E]/90'} leading-relaxed`}>
                      {t(point.key)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ─── Slider Handle ─── */}
            <div
              className="absolute top-0 bottom-0 z-20 pointer-events-none"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
              {/* Golden Vertical Line */}
              <div
                className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2"
                style={{
                  width: '4px',
                  background: 'linear-gradient(180deg, transparent 0%, #C98A1C 15%, #C98A1C 50%, #C98A1C 85%, transparent 100%)',
                  boxShadow: '0 0 12px rgba(201,138,28,0.5)',
                }}
              />

              {/* Golden Circle with Chevrons */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #C98A1C, #C98A1C)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                  boxShadow: '0 0 20px rgba(201,138,28,0.6), 0 4px 12px rgba(0,0,0,0.3)',
                  cursor: 'col-resize',
                }}
              >
                <ChevronLeft className="w-4 h-4 text-[#0A1330]" aria-hidden="true" />
                <ChevronRight className="w-4 h-4 text-[#0A1330]" aria-hidden="true" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Mobile Stacked Layout (hidden on desktop) ─── */}
        <div className="md:hidden space-y-6">
          {/* Before Card */}
          <motion.div
            className="rounded-3xl p-6 sm:p-8"
            style={{
              background: 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(10,22,40,0.6) 100%)',
              border: '1px solid rgba(239,68,68,0.2)',
            }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3
              className="text-xl sm:text-2xl font-bold mb-5 font-[family-name:var(--font-heading)]"
              style={{ color: '#EF4444' }}
            >
              {t('comparison.leftLabel')}
            </h3>
            <div className="space-y-4">
              {painPoints.map((point) => (
                <div key={point.key} className="flex items-start gap-3">
                  <span className="text-base flex-shrink-0 mt-0.5">{point.icon}</span>
                  <span className={`text-sm sm:text-base ${isDark ? 'text-white/90' : 'text-[#1A1A2E]/85'} leading-relaxed`}>
                    {t(point.key)}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* After Card */}
          <motion.div
            className="rounded-3xl p-6 sm:p-8"
            style={{
              background: 'linear-gradient(135deg, rgba(201,138,28,0.12) 0%, rgba(10,22,40,0.8) 100%)',
              border: '1px solid rgba(201,138,28,0.25)',
            }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-5 font-[family-name:var(--font-heading)] gradient-text">
              {t('comparison.rightLabel')}
            </h3>
            <div className="space-y-4">
              {benefits.map((point) => (
                <div key={point.key} className="flex items-start gap-3">
                  <span className="text-base flex-shrink-0 mt-0.5">{point.icon}</span>
                  <span className={`text-sm sm:text-base ${isDark ? 'text-white/95' : 'text-[#1A1A2E]/90'} leading-relaxed`}>
                    {t(point.key)}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
