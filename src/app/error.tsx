'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error for debugging
    console.error('[PaliwalSecure] Page error:', error?.message, error?.digest, error?.stack);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1330] p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C98A1C] to-[#E0A830] flex items-center justify-center shadow-lg">
            <span className="font-bold text-[#060B1E] text-2xl leading-none">P</span>
          </div>
          <span className="font-heading text-2xl font-bold text-white">
            Paliwal <span className="gradient-text">Secure</span>
          </span>
        </div>

        {/* Error message */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Something went wrong!</h2>
          <p className="text-muted-foreground text-sm">
            Koi technical issue aaya hai. Please try again.
          </p>
          {error?.message && (
            <p className="text-xs text-red-400/80 bg-red-400/10 rounded-lg px-3 py-2 font-mono break-all">
              {error.message}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-[#0A1330] font-semibold text-sm hover:shadow-[0_0_20px_rgba(201,138,28,0.3)] transition-shadow"
          >
            Try Again
          </button>
          <a
            href="/"
            className="block w-full py-3 rounded-xl border border-white/10 text-muted-foreground text-sm hover:text-foreground hover:border-white/20 transition-colors"
          >
            Go Home
          </a>
          <a
            href="https://wa.me/919257877312"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors"
          >
            📞 WhatsApp: 9257877312
          </a>
        </div>
      </div>
    </div>
  );
}
