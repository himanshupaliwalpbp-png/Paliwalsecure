"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Loader2, Eye, EyeOff, Lock, Mail, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth-store";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, verifyMfa, isAuthenticated, isLoading, mfaRequired, mfaUser } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // MFA state
  const [totpCode, setTotpCode] = useState("");
  const [mfaError, setMfaError] = useState("");
  const [isMfaSubmitting, setIsMfaSubmitting] = useState(false);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password);
      // If MFA is required, the store will update mfaRequired to true
      // and the UI will switch to the MFA verification form
      if (!useAuthStore.getState().mfaRequired) {
        router.push("/admin/dashboard");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMfaError("");

    if (totpCode.length !== 6) {
      setMfaError("Please enter a 6-digit verification code");
      return;
    }

    setIsMfaSubmitting(true);
    try {
      await verifyMfa(totpCode);
      router.push("/admin/dashboard");
    } catch (err) {
      setMfaError(
        err instanceof Error ? err.message : "Verification failed. Please try again."
      );
    } finally {
      setIsMfaSubmitting(false);
    }
  };

  // ── MFA Verification Step ───────────────────────────────────────────────────
  if (mfaRequired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800 px-4 py-8">
        {/* Animated background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        </div>

        {/* MFA Card */}
        <div className="relative w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
            {/* Logo & Heading */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-4">
                <Key className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Two-Factor Authentication
              </h1>
              <p className="text-blue-200/70 text-sm mt-1">
                Enter the code from your authenticator app
              </p>
            </div>

            {/* User info */}
            {mfaUser && (
              <div className="mb-6 flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">{mfaUser.name}</p>
                  <p className="text-xs text-blue-200/50">{mfaUser.email}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {mfaError && (
              <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-300 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                {mfaError}
              </div>
            )}

            {/* MFA Form */}
            <form onSubmit={handleMfaSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="totpCode" className="text-blue-100 text-sm font-medium">
                  Verification Code
                </Label>
                <Input
                  id="totpCode"
                  type="text"
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  placeholder="000000"
                  value={totpCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setTotpCode(val);
                  }}
                  className="text-center text-2xl tracking-[0.5em] font-mono bg-white/5 border-white/10 text-white placeholder:text-blue-300/40 focus:border-emerald-400/50 focus:ring-emerald-400/20 h-14"
                  required
                  autoComplete="one-time-code"
                  disabled={isMfaSubmitting}
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                disabled={isMfaSubmitting || totpCode.length !== 6}
                className="w-full h-11 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isMfaSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Sign In"
                )}
              </Button>
            </form>

            {/* Back to login */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  useAuthStore.setState({
                    mfaRequired: false,
                    mfaToken: null,
                    mfaUser: null,
                  });
                  setTotpCode("");
                  setMfaError("");
                }}
                className="text-blue-200/50 text-xs hover:text-blue-200/80 transition-colors underline"
              >
                Back to login
              </button>
            </div>

            {/* Footer */}
            <div className="mt-4 text-center">
              <p className="text-blue-200/40 text-xs">
                Open your authenticator app to get the 6-digit code
              </p>
            </div>
          </div>

          {/* Bottom glow effect */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-emerald-500/20 rounded-full blur-2xl" />
        </div>
      </div>
    );
  }

  // ── Regular Login Form ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800 px-4 py-8">
      {/* Animated background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
          {/* Logo & Heading */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Paliwal Secure
            </h1>
            <p className="text-blue-200/70 text-sm mt-1">Admin Dashboard</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-300 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-100 text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/50" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@paliwalsecure.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-blue-300/40 focus:border-amber-400/50 focus:ring-amber-400/20"
                  required
                  autoComplete="email"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-blue-100 text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/50" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-blue-300/40 focus:border-amber-400/50 focus:ring-amber-400/20"
                  required
                  autoComplete="current-password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300/50 hover:text-blue-200 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full h-11 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold shadow-lg shadow-amber-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-blue-200/40 text-xs">
              Protected admin area. Unauthorized access is prohibited.
            </p>
          </div>
        </div>

        {/* Bottom glow effect */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-amber-500/20 rounded-full blur-2xl" />
      </div>
    </div>
  );
}
