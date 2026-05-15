'use client';

import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
  Shield,
  Brain,
  FileWarning,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// ── Extracted Policy Data Interface ──────────────────────────────────────────
export interface ExtractedPolicyData {
  id: string;
  insurer: string;
  policyType: string;
  sumInsured: number | null;
  premium: number | null;
  premiumFrequency: string;
  waitingPeriods: Record<string, number>;
  exclusions: string[];
  keyCoverages: string[];
  ncbDetails: string | null;
  networkHospitals: string | null;
  startDate: string | null;
  endDate: string | null;
  missingBenefits: string[];
  llmSummary: string;
}

// ── Component Props ──────────────────────────────────────────────────────────
interface PolicyUploadProps {
  onAnalysisComplete: (data: ExtractedPolicyData) => void;
}

// ── Upload States ────────────────────────────────────────────────────────────
type UploadState = 'idle' | 'selected' | 'uploading' | 'analyzing' | 'success' | 'error';

// ── Max file size constant ───────────────────────────────────────────────────
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// ── Animation variants ───────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const dropzoneContentVariants = {
  idle: { scale: 1 },
  dragActive: { scale: 1.02 },
};

const successVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    transition: { duration: 0.2 },
  },
};

const errorVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
};

// ── PolicyUpload Component ───────────────────────────────────────────────────
export default function PolicyUpload({ onAnalysisComplete }: PolicyUploadProps) {
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Validate file before upload ──────────────────────────────────────────
  const validateFile = useCallback((file: File): string | null => {
    // Validate file type
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      return 'Sirf PDF files accept hoti hain. Kripaya PDF document upload karein.';
    }
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return `File bahut badi hai (${sizeMB}MB). Maximum size 10MB hai. Kripaya chhoti file upload karein.`;
    }
    // Validate file is not empty
    if (file.size === 0) {
      return 'Yeh file khaali hai. Kripaya valid PDF document upload karein.';
    }
    return null;
  }, []);

  // ── Simulate upload progress ─────────────────────────────────────────────
  const simulateProgress = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 90) {
          progress = 90; // Hold at 90% until real response
          clearInterval(interval);
          setUploadProgress(90);
          resolve();
        } else {
          setUploadProgress(Math.round(progress));
        }
      }, 300);
    });
  }, []);

  // ── Handle file drop / selection ─────────────────────────────────────────
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Clear any pending reset
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = null;
      }

      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      const validationError = validateFile(file);

      if (validationError) {
        setErrorMessage(validationError);
        setUploadState('error');
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setErrorMessage(null);
      setUploadState('selected');
      setUploadProgress(0);
    },
    [validateFile]
  );

  // ── Handle upload and analysis ───────────────────────────────────────────
  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    setUploadState('uploading');
    setUploadProgress(0);
    setErrorMessage(null);

    try {
      // Start simulated progress alongside the real upload
      const progressPromise = simulateProgress();

      // Create form data
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Make the API call
      const [response] = await Promise.all([
        fetch('/api/upload-policy', {
          method: 'POST',
          body: formData,
        }),
        progressPromise,
      ]);

      // Complete the progress bar
      setUploadProgress(100);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Kuch gadbad ho gayi. Dobara try karein.');
      }

      if (!data.success || !data.policy) {
        throw new Error('Analysis mein problem aayi. Kripaya dobara try karein.');
      }

      // Move to analyzing state briefly for UX
      setUploadState('analyzing');

      // Small delay to show the analyzing animation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success state
      setUploadState('success');

      // Brief success display, then callback
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Call the parent callback with extracted data
      onAnalysisComplete(data.policy as ExtractedPolicyData);
    } catch (error) {
      setUploadProgress(0);
      const message =
        error instanceof Error
          ? error.message
          : 'Server se connect nahi ho paaya. Internet check karein aur dobara try karein.';
      setErrorMessage(message);
      setUploadState('error');
    }
  }, [selectedFile, simulateProgress, onAnalysisComplete]);

  // ── Reset the upload state ───────────────────────────────────────────────
  const handleReset = useCallback(() => {
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }
    setUploadState('idle');
    setSelectedFile(null);
    setUploadProgress(0);
    setErrorMessage(null);
  }, []);

  // ── Dropzone configuration ───────────────────────────────────────────────
  const { getRootProps, getInputProps, isDragAccept, open } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    disabled: uploadState === 'uploading' || uploadState === 'analyzing',
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => {
      setIsDragActive(false);
      setErrorMessage('Sirf PDF files accept hoti hain (max 10MB).');
      setUploadState('error');
    },
  });

  // ── Determine dropzone styling based on state ────────────────────────────
  const getDropzoneClasses = () => {
    const base =
      'relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer outline-none';

    if (uploadState === 'error') {
      return `${base} border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-950/20`;
    }
    if (isDragActive || isDragAccept) {
      return `${base} border-emerald-400 dark:border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 shadow-lg shadow-emerald-500/10`;
    }
    if (uploadState === 'uploading' || uploadState === 'analyzing') {
      return `${base} border-blue-300 dark:border-blue-600 bg-blue-50/30 dark:bg-blue-950/20 cursor-default`;
    }
    if (uploadState === 'success') {
      return `${base} border-emerald-400 dark:border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20`;
    }
    return `${base} border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/30 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-950/20`;
  };

  // ── Format file size ─────────────────────────────────────────────────────
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ── Is the component busy? ───────────────────────────────────────────────
  const isBusy = uploadState === 'uploading' || uploadState === 'analyzing';

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <Card className="overflow-hidden border-border/60 shadow-lg shadow-blue-500/5 dark:shadow-blue-500/10">
        {/* ── Card Header ────────────────────────────────────────────────── */}
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-xl font-bold text-foreground">
                  Policy Document Upload
                </CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Apni policy PDF upload karein — AI analyze karega
                </p>
              </div>
            </div>
            <Badge
              className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800 rounded-full px-3 py-0.5 text-[10px] sm:text-xs font-medium"
            >
              <Brain className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
          </div>
        </CardHeader>

        {/* ── Card Content ───────────────────────────────────────────────── */}
        <CardContent className="pt-2 pb-6">
          {/* ── Dropzone Area ────────────────────────────────────────────── */}
          <div
            {...getRootProps({
              className: getDropzoneClasses(),
              role: 'button',
              tabIndex: 0,
              'aria-label': 'Policy PDF document upload karne ke liye click karein ya drag karein',
              'aria-disabled': isBusy,
            })}
          >
            <input {...getInputProps()} aria-hidden="true" />

            <motion.div
              variants={dropzoneContentVariants}
              animate={isDragActive ? 'dragActive' : 'idle'}
              className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6"
            >
              <AnimatePresence mode="wait">
                {/* ── Idle / Drag Active State ──────────────────────────── */}
                {(uploadState === 'idle' || uploadState === 'selected') && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center text-center"
                  >
                    <motion.div
                      animate={isDragActive ? { scale: 1.15, y: -4 } : { scale: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300 ${
                        isDragActive
                          ? 'bg-emerald-100 dark:bg-emerald-900/40'
                          : 'bg-blue-100 dark:bg-blue-900/30'
                      }`}
                    >
                      <Upload
                        className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors duration-300 ${
                          isDragActive
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-blue-600 dark:text-blue-400'
                        }`}
                      />
                    </motion.div>
                    <p className="text-sm sm:text-base font-semibold text-foreground mb-1">
                      {isDragActive
                        ? 'Yahan chhod dijiye!'
                        : 'PDF yahan drop karein ya click karein'}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground max-w-xs">
                      Sirf PDF files • Maximum 10MB • Single document
                    </p>
                    {!isDragActive && uploadState === 'idle' && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-4 rounded-full gap-1.5 text-xs border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/30"
                        onClick={(e) => {
                          e.stopPropagation();
                          open();
                        }}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        File Choose Karein
                      </Button>
                    )}
                  </motion.div>
                )}

                {/* ── Uploading State ──────────────────────────────────── */}
                {uploadState === 'uploading' && (
                  <motion.div
                    key="uploading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center text-center w-full"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-4"
                    >
                      <Loader2 className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
                    </motion.div>
                    <p className="text-sm sm:text-base font-semibold text-foreground mb-1">
                      Uploading ho raha hai...
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                      {selectedFile ? selectedFile.name : 'Document'}
                    </p>
                    <div className="w-full max-w-xs">
                      <Progress
                        value={uploadProgress}
                        className="h-2.5 rounded-full bg-blue-100 dark:bg-blue-900/40"
                      />
                      <p className="text-xs text-muted-foreground mt-1.5 text-center">
                        {uploadProgress}% complete
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* ── Analyzing State ──────────────────────────────────── */}
                {uploadState === 'analyzing' && (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center text-center"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center mb-4"
                    >
                      <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600 dark:text-amber-400" />
                    </motion.div>
                    <motion.p
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="text-sm sm:text-base font-semibold text-foreground mb-1"
                    >
                      AI se analyze ho raha hai...
                    </motion.p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      InsureGPT aapki policy ko deeply scan kar raha hai
                    </p>
                    <div className="flex items-center gap-1.5 mt-3">
                      <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-1.5 h-1.5 rounded-full bg-amber-500"
                      />
                      <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                        className="w-1.5 h-1.5 rounded-full bg-amber-500"
                      />
                      <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                        className="w-1.5 h-1.5 rounded-full bg-amber-500"
                      />
                    </div>
                  </motion.div>
                )}

                {/* ── Success State ────────────────────────────────────── */}
                {uploadState === 'success' && (
                  <motion.div
                    key="success"
                    variants={successVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex flex-col items-center text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4"
                    >
                      <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11 text-emerald-600 dark:text-emerald-400" />
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-sm sm:text-base font-semibold text-emerald-700 dark:text-emerald-400 mb-1"
                    >
                      Analysis Complete!
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-xs sm:text-sm text-muted-foreground"
                    >
                      Aapki policy details load ho rahi hain...
                    </motion.p>
                  </motion.div>
                )}

                {/* ── Error State (inside dropzone) ────────────────────── */}
                {uploadState === 'error' && (
                  <motion.div
                    key="error"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex flex-col items-center text-center"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                      <FileWarning className="w-8 h-8 sm:w-10 sm:h-10 text-red-500 dark:text-red-400" />
                    </div>
                    <p className="text-sm sm:text-base font-semibold text-red-700 dark:text-red-400 mb-1">
                      Upload Fail!
                    </p>
                    <p className="text-xs sm:text-sm text-red-600/80 dark:text-red-400/80 max-w-sm">
                      {errorMessage || 'Kuch gadbad ho gayi. Dobara try karein.'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* ── Selected File Info (between dropzone and action buttons) ── */}
          <AnimatePresence>
            {selectedFile && (uploadState === 'selected' || uploadState === 'idle') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 overflow-hidden"
              >
                <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(selectedFile.size)} • PDF Document
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
                    onClick={handleReset}
                    aria-label="Selected file hataayein"
                    disabled={isBusy}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Error Message (outside dropzone for API errors) ──────────── */}
          <AnimatePresence>
            {uploadState === 'error' && errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="mt-4 flex items-start gap-2.5 p-3 sm:p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40"
              >
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-red-700 dark:text-red-400 font-medium">
                    {errorMessage}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 shrink-0 text-red-600 hover:text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-950/30 text-xs rounded-lg px-2"
                  onClick={handleReset}
                >
                  Dobara Try
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Progress Bar (visible during upload/analyze) ──────────────── */}
          <AnimatePresence>
            {(uploadState === 'uploading') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 overflow-hidden"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-muted-foreground">
                    Analyzing your policy document...
                  </span>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {uploadProgress}%
                  </span>
                </div>
                <Progress
                  value={uploadProgress}
                  className="h-2 rounded-full"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Action Buttons ────────────────────────────────────────────── */}
          <AnimatePresence>
            {uploadState === 'selected' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="mt-5 flex flex-col sm:flex-row gap-3"
              >
                <Button
                  onClick={handleUpload}
                  className="flex-1 btn-ripple bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl gap-2 h-11 sm:h-12 font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 transition-all duration-300 text-sm sm:text-base"
                  size="lg"
                >
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5" />
                  AI se Analyze Karein
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="sm:flex-initial rounded-xl gap-1.5 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 h-11 sm:h-12 text-sm"
                  size="lg"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Helper Tips ───────────────────────────────────────────────── */}
          {(uploadState === 'idle' || uploadState === 'selected') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3"
            >
              {[
                {
                  icon: Shield,
                  label: '100% Secure',
                  desc: 'Aapka data private hai',
                },
                {
                  icon: Brain,
                  label: 'AI Analysis',
                  desc: 'Smart policy breakdown',
                },
                {
                  icon: CheckCircle2,
                  label: 'Instant Results',
                  desc: 'Seconds mein ready',
                },
              ].map((tip) => (
                <div
                  key={tip.label}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50/80 dark:bg-slate-800/40 border border-border/40"
                >
                  <tip.icon className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs font-semibold text-foreground leading-tight">
                      {tip.label}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground leading-tight">
                      {tip.desc}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
