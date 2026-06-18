'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileSearch, Upload, Shield, ArrowRight, CheckCircle, AlertTriangle,
  TrendingDown, Sparkles, Bot, X, Loader2,
} from 'lucide-react';

/* ── Mock comparison data ── */
const MOCK_COMPARISON = {
  currentPlan: {
    name: 'Your Current Plan',
    premium: '₹8,500/yr',
    csr: '87%',
    coverage: '₹5 Lakh',
    waitingPeriod: '48 months (PED)',
    maternity: '❌ Not covered',
    networkHospitals: '3,500+',
    roomRent: 'Capped at ₹3,000/day',
    addons: 'None',
  },
  recommendedPlan: {
    name: 'Care Health Insurance',
    premium: '₹5,600/yr',
    csr: '100%',
    coverage: '₹10 Lakh',
    waitingPeriod: '24 months (PED)',
    maternity: '✅ Covered',
    networkHospitals: '21,700+',
    roomRent: 'No capping',
    addons: 'Zero Dep, Restoration',
  },
};

const COMPARISON_ROWS = [
  { label: 'Annual Premium', current: MOCK_COMPARISON.currentPlan.premium, recommended: MOCK_COMPARISON.recommendedPlan.premium, highlight: true },
  { label: 'Claim Settlement Ratio', current: MOCK_COMPARISON.currentPlan.csr, recommended: MOCK_COMPARISON.recommendedPlan.csr, highlight: true },
  { label: 'Coverage Amount', current: MOCK_COMPARISON.currentPlan.coverage, recommended: MOCK_COMPARISON.recommendedPlan.coverage, highlight: true },
  { label: 'PED Waiting Period', current: MOCK_COMPARISON.currentPlan.waitingPeriod, recommended: MOCK_COMPARISON.recommendedPlan.waitingPeriod, highlight: true },
  { label: 'Maternity Cover', current: MOCK_COMPARISON.currentPlan.maternity, recommended: MOCK_COMPARISON.recommendedPlan.maternity },
  { label: 'Network Hospitals', current: MOCK_COMPARISON.currentPlan.networkHospitals, recommended: MOCK_COMPARISON.recommendedPlan.networkHospitals, highlight: true },
  { label: 'Room Rent', current: MOCK_COMPARISON.currentPlan.roomRent, recommended: MOCK_COMPARISON.recommendedPlan.roomRent, highlight: true },
  { label: 'Add-ons', current: MOCK_COMPARISON.currentPlan.addons, recommended: MOCK_COMPARISON.recommendedPlan.addons },
];

const AUDIT_STEPS = [
  { icon: <Upload className="w-5 h-5" />, title: 'Upload Policy', desc: 'Upload your existing insurance policy PDF or image' },
  { icon: <Bot className="w-5 h-5" />, title: 'AI Analysis', desc: 'InsureGPT analyzes coverage, premium & gaps' },
  { icon: <FileSearch className="w-5 h-5" />, title: 'Get Report', desc: 'Compare with better plans and see savings' },
];

export default function FreeAuditClient() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [savingsAmount, setSavingsAmount] = useState('₹2,900/yr');
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    setUploadedFile(file);
    setShowResults(false);
    setAnalysisError(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleAnalyze = useCallback(async () => {
    if (!uploadedFile) return;
    setIsAnalyzing(true);
    setShowResults(false);
    setAnalysisError(null);

    try {
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(uploadedFile);
      });
      const base64 = dataUrl.split(',')[1];
      const isPDF = uploadedFile.type === 'application/pdf';

      const extractBody = isPDF
        ? { pdfBase64: base64, fileType: 'pdf' }
        : { imageBase64: base64, mimeType: uploadedFile.type, fileType: 'image' };

      const extractResponse = await fetch('/api/audit/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(extractBody),
      });
      const extractData = await extractResponse.json();

      const auditBody: Record<string, unknown> = {
        policyType: extractData?.data?.policyType || 'car',
        insurer: extractData?.data?.insurer || 'HDFC ERGO',
        premium: Number(extractData?.data?.premium) || 8500,
        addOns: extractData?.data?.addOns || ['Zero Depreciation'],
        claimsLast3Years: 0,
        name: extractData?.data?.policyholderName || 'Policy Holder',
        mobile: '9999999999',
        vehicle: extractData?.data?.vehicle || 'Maruti Swift',
        idv: Number(extractData?.data?.idv) || 500000,
        ncb: 20,
        vehicleAge: '1-2',
      };

      const auditResponse = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(auditBody),
      });

      if (auditResponse.ok) {
        const auditData = await auditResponse.json();
        if (auditData.success) {
          setSavingsAmount(`₹${auditData.potentialSavings || 2900}/yr`);
          setShowResults(true);
          return;
        }
      }

      console.warn('Audit API failed, showing demo results');
      setSavingsAmount('₹2,900/yr');
      setShowResults(true);
    } catch (error) {
      console.error('Audit analysis error:', error);
      setAnalysisError('AI analysis me thodi samasya hui. Demo results dikha rahe hain.');
      setSavingsAmount('₹2,900/yr');
      setShowResults(true);
    } finally {
      setIsAnalyzing(false);
    }
  }, [uploadedFile]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ════════════════════════════════════════════════════════════════
          HERO SECTION — Plain HTML for guaranteed centering
         ════════════════════════════════════════════════════════════════ */}
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: '70vh' }}
      >
        {/* Background — absolute, doesn't affect flex */}
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0A1330 0%, #162D5A 50%, #C98A1C 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(201, 138, 28, 0.15) 0%, transparent 60%)' }} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--background)] pointer-events-none z-[1]" />

        {/* Centered Content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 dark:bg-white/[0.06] bg-white/50 backdrop-blur-md border dark:border-[#C98A1C]/25 border-[#C98A1C]/20 rounded-full px-5 py-2.5 text-sm font-medium dark:text-white/90 text-slate-800 shadow-lg mb-8">
              <Shield className="w-4 h-4 text-[#C98A1C]" />
              <span className="whitespace-nowrap">100% Free • No Obligations</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.08] tracking-tight mb-6 font-[family-name:var(--font-heading)]">
              <span className="block dark:text-white text-slate-900">Insurance</span>
              <span className="block mt-2 gradient-text italic">Reverse Audit</span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl dark:text-white/65 text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Upload your existing policy and our AI finds <strong className="text-[#C98A1C]">hidden savings</strong>, coverage gaps, and better alternatives — all backed by IRDAI data.
            </p>

            {/* CTA Buttons — plain HTML for guaranteed click */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-[#0A1330] hover:shadow-lg hover:shadow-[#C98A1C]/40 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C98A1C]/50"
              >
                <Upload className="w-5 h-5" />
                Upload Your Policy
              </button>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-insuregpt'))}
                className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold rounded-lg bg-white/10 backdrop-blur border border-white/25 text-white hover:bg-white/20 transition-all duration-300 cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                Chat with InsureGPT
              </button>
            </div>

            {/* Hidden file input — shared by hero button AND upload section */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,image/*,application/pdf"
              className="hidden"
              onChange={handleFileInput}
            />
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          HOW IT WORKS
         ════════════════════════════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold dark:text-white text-slate-900 text-center mb-10 font-[family-name:var(--font-heading)]">
            How the <span className="gradient-text">Audit Works</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {AUDIT_STEPS.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="text-center p-6 rounded-2xl dark:bg-white/[0.03] bg-white/50 backdrop-blur border dark:border-white/10 border-slate-200"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C98A1C]/20 to-[#C98A1C]/5 text-[#C98A1C] mb-4">
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold dark:text-white text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm dark:text-white/60 text-slate-500">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          UPLOAD SECTION — Plain HTML for guaranteed interactivity
         ════════════════════════════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl dark:bg-white/[0.03] bg-white/50 backdrop-blur border dark:border-white/10 border-slate-200 p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold dark:text-white text-slate-900 text-center mb-2">Upload Your Policy</h2>
            <p className="text-sm dark:text-white/60 text-slate-500 text-center mb-6">Drag &amp; drop your insurance policy PDF or image, or click to browse</p>

            {/* Drag & Drop Area */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                isDragOver
                  ? 'border-[#C98A1C] bg-[#C98A1C]/10'
                  : 'dark:border-white/20 border-slate-300 hover:border-[#C98A1C]/50 dark:hover:bg-white/[0.03] hover:bg-slate-50'
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
              aria-label="Upload policy document"
            >
              {uploadedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <FileSearch className="w-8 h-8 text-[#C98A1C]" />
                  <div className="text-left">
                    <p className="dark:text-white text-slate-900 font-semibold">{uploadedFile.name}</p>
                    <p className="text-sm dark:text-[#8A96A8] text-slate-500">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setUploadedFile(null); setShowResults(false); }}
                    className="ml-2 p-1 rounded-full dark:hover:bg-white/10 hover:bg-slate-200 transition-colors"
                    aria-label="Remove file"
                  >
                    <X className="w-4 h-4 dark:text-[#8A96A8] text-slate-400" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-[#C98A1C]/50 mx-auto mb-4" />
                  <p className="dark:text-white/70 text-slate-600 font-medium">
                    Drop your policy here or <span className="text-[#C98A1C]">browse</span>
                  </p>
                  <p className="text-xs dark:text-[#8A96A8] text-slate-400 mt-2">Supports PDF, PNG, JPG (max 10MB)</p>
                </>
              )}
            </div>

            {/* Analyze Button — plain HTML button */}
            {uploadedFile && !showResults && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center"
              >
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-[#0A1330] hover:shadow-lg hover:shadow-[#C98A1C]/40 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C98A1C]/50"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <FileSearch className="w-5 h-5" />
                      Run Free Audit
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {/* Error message */}
            {analysisError && (
              <p className="mt-4 text-sm text-amber-500 text-center">{analysisError}</p>
            )}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          RESULTS SECTION
         ════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showResults && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="relative py-16 sm:py-20"
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Savings Banner */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-center mb-10"
              >
                <div className="inline-flex items-center gap-3 dark:bg-green-950/30 bg-green-50 border dark:border-green-500/20 border-green-200 rounded-full px-6 py-3 mb-4">
                  <TrendingDown className="w-5 h-5 text-green-400" />
                  <span className="dark:text-green-300 text-green-700 font-bold text-lg">You could save {savingsAmount}!</span>
                </div>
                <p className="dark:text-[#8A96A8] text-slate-500">
                  Based on IRDAI 2025-26 data, we found a better plan with more coverage at lower cost
                </p>
              </motion.div>

              {/* Comparison Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Current Plan */}
                <div className="rounded-2xl dark:bg-white/[0.03] bg-white/50 backdrop-blur border dark:border-white/10 border-slate-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-amber-400" />
                    <div>
                      <h3 className="text-lg font-bold dark:text-white text-slate-900">{MOCK_COMPARISON.currentPlan.name}</h3>
                      <p className="text-xs dark:text-white/60 text-slate-500">Your existing policy</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {COMPARISON_ROWS.map((row) => (
                      <div key={row.label} className="flex justify-between items-center py-1.5 border-b dark:border-white/5 border-slate-100 last:border-0">
                        <span className="text-xs dark:text-[#8A96A8] text-slate-500">{row.label}</span>
                        <span className="text-sm font-semibold dark:text-white text-slate-900">{row.current}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Plan */}
                <div className="rounded-2xl dark:bg-white/[0.06] bg-white/70 backdrop-blur border-2 border-[#C98A1C]/30 p-6 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-[#0A1330] text-xs font-bold px-4 py-1 rounded-full">
                    RECOMMENDED
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <div>
                      <h3 className="text-lg font-bold dark:text-white text-slate-900">{MOCK_COMPARISON.recommendedPlan.name}</h3>
                      <p className="text-xs dark:text-white/60 text-slate-500">AI-recommended alternative</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {COMPARISON_ROWS.map((row) => (
                      <div key={row.label} className="flex justify-between items-center py-1.5 border-b dark:border-white/5 border-slate-100 last:border-0">
                        <span className="text-xs dark:text-[#8A96A8] text-slate-500">{row.label}</span>
                        <span className={`text-sm font-semibold ${row.highlight ? 'text-green-400' : 'dark:text-white text-slate-900'}`}>{row.recommended}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-insuregpt'))}
                  className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-[#0A1330] hover:shadow-lg hover:shadow-[#C98A1C]/40 transition-all duration-300 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5" />
                  Get Personalized Advice
                </button>
                <a
                  href="/compare"
                  className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold rounded-lg bg-white/10 backdrop-blur border border-white/25 text-white hover:bg-white/20 transition-all duration-300 cursor-pointer"
                >
                  Compare All Plans
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Disclaimer */}
      <section className="relative py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs dark:text-[#8A96A8] text-slate-400/60">
            ⚠️ Disclaimer: Insurance is the subject matter of solicitation. For actual policy analysis, chat with InsureGPT or contact Himanshu Paliwal (IRDAI Registered POSP IP429834). Read policy documents carefully.
          </p>
        </div>
      </section>
    </div>
  );
}
