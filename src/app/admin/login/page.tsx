"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Loader2, Eye, EyeOff, Lock, Mail, Key, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth-store";

const OWNER_EMAIL = "himanshupaliwalpbp@gmail.com";

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

  // Owner recovery state
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [recoveryError, setRecoveryError] = useState("");
  const [recoveryNotice, setRecoveryNotice] = useState("");
  const [recoverySubmitting, setRecoverySubmitting] = useState(false);

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

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError("");
    setRecoveryNotice("");

    if (!recoveryCode.trim()) {
      setRecoveryError("Recovery code daalein.");
      return;
    }
    if (newPassword.length < 12) {
      setRecoveryError("Naya password kam se kam 12 characters ka ho (uppercase + lowercase + number).");
      return;
    }

    setRecoverySubmitting(true);
    try {
      const res = await fetch("/api/admin/auth/owner-recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recoveryCode: recoveryCode.trim(), newPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Recovery failed.");
      }
      setRecoveryNotice(
        `Password reset ho gaya (${OWNER_EMAIL}). Ab sign in karein.`
      );
      setPassword("");
      setTimeout(() => {
        setRecoveryMode(false);
        setRecoveryCode("");
        setNewPassword("");
        setRecoveryNotice("");
        setEmail(OWNER_EMAIL);
      }, 2600);
    } catch (err) {
      setRecoveryError(err instanceof Error ? err.message : "Recovery failed.");
    } finally {
      setRecoverySubmitting(false);
    }
  };

  // ── Shared warm-glass input classes (SAFFRON DAWN) ──────────────────────────
  const inputCls =
    "bg-white/5 border-[#E8C97E]/25 text-white placeholder:text-[#E8C97E]/40 focus-visible:border-[#E8C97E]/60 focus-visible:ring-[#E8C97E]/25 h-11";

  // ── MFA Verification Step ───────────────────────────────────────────────────
  if (mfaRequired) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-[#1A130C] flex items-center justify-center px-4 py-8">
        {/* Warm background composition */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#1A130C_0%,#8B3520_55%,#0E1116_100%)] opacity-80" />
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#B8482C]/25 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#C98A1C]/20 blur-3xl" />
        </div>

        <div className="relative w-full max-w-md">
          <div className="bg-[#0E1116]/80 backdrop-blur-xl border border-[#E8C97E]/25 rounded-2xl shadow-2xl p-8">
            {/* Logo & Heading */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E8C97E] to-[#C98A1C] flex items-center justify-center shadow-lg shadow-[#C98A1C]/30 mb-4">
                <Key className="w-8 h-8 text-[#1A130C]" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Two-Factor Authentication
              </h1>
              <p className="text-[#E8C97E]/70 text-sm mt-1">
                Authenticator app se 6-digit code daalein
              </p>
            </div>

            {/* User info */}
            {mfaUser && (
              <div className="mb-6 flex items-center gap-3 bg-white/5 border border-[#E8C97E]/15 rounded-lg p-3">
                <div className="w-8 h-8 rounded-full bg-[#C98A1C]/25 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-[#E8C97E]" />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">{mfaUser.name}</p>
                  <p className="text-xs text-[#E8C97E]/50">{mfaUser.email}</p>
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
                <Label htmlFor="totpCode" className="text-[#F7E8B8] text-sm font-medium">
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
                  className="text-center text-2xl tracking-[0.5em] font-mono bg-white/5 border-[#E8C97E]/25 text-white placeholder:text-[#E8C97E]/40 focus-visible:border-[#E8C97E]/60 focus-visible:ring-[#E8C97E]/25 h-14"
                  required
                  autoComplete="one-time-code"
                  disabled={isMfaSubmitting}
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                disabled={isMfaSubmitting || totpCode.length !== 6}
                className="w-full h-11 bg-gradient-to-r from-[#E8C97E] to-[#C98A1C] hover:from-[#F0D48A] hover:to-[#B8482C] text-[#1A130C] font-bold shadow-lg shadow-[#C98A1C]/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="text-[#E8C97E]/60 text-xs hover:text-[#E8C97E] transition-colors underline cursor-pointer"
              >
                Back to login
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-[#E8C97E]/40 text-xs">
                Open your authenticator app to get the 6-digit code
              </p>
            </div>
          </div>

          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-[#C98A1C]/25 rounded-full blur-2xl" />
        </div>
      </div>
    );
  }

  // ── Owner Recovery Mode ─────────────────────────────────────────────────────
  if (recoveryMode) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-[#1A130C] flex items-center justify-center px-4 py-8">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#1A130C_0%,#8B3520_55%,#0E1116_100%)] opacity-80" />
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#B8482C]/25 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#C98A1C]/20 blur-3xl" />
        </div>

        <div className="relative w-full max-w-md">
          <div className="bg-[#0E1116]/80 backdrop-blur-xl border border-[#E8C97E]/25 rounded-2xl shadow-2xl p-8">
            {/* Gold top edge */}
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#C98A1C]/70 to-transparent rounded-full" />

            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E8C97E] to-[#C98A1C] flex items-center justify-center shadow-lg shadow-[#C98A1C]/30 mb-4">
                <Key className="w-8 h-8 text-[#1A130C]" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Owner Recovery</h1>
              <p className="text-[#E8C97E]/70 text-sm mt-1">
                Naya admin password set karein — recovery code se
              </p>
            </div>

            {recoveryNotice && (
              <div className="mb-6 bg-[#C98A1C]/15 border border-[#E8C97E]/40 rounded-lg p-3 text-sm text-[#F7E8B8] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#E8C97E]" />
                {recoveryNotice}
              </div>
            )}

            {recoveryError && (
              <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-300 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                {recoveryError}
              </div>
            )}

            <form onSubmit={handleRecoverySubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="recoveryCode" className="text-[#F7E8B8] text-sm font-medium">
                  Recovery Code
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E8C97E]/60" />
                  <Input
                    id="recoveryCode"
                    type="text"
                    placeholder="Paste your recovery code"
                    value={recoveryCode}
                    onChange={(e) => setRecoveryCode(e.target.value)}
                    className={`pl-10 ${inputCls}`}
                    required
                    disabled={recoverySubmitting}
                    autoComplete="off"
                  />
                </div>
                <p className="text-xs text-[#E8C97E]/50">
                  Account: <strong className="text-[#F7E8B8]">{OWNER_EMAIL}</strong> (owner)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-[#F7E8B8] text-sm font-medium">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E8C97E]/60" />
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Min 12 chars, upper + lower + number"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`pl-10 pr-10 ${inputCls}`}
                    required
                    autoComplete="new-password"
                    disabled={recoverySubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#E8C97E]/60 hover:text-[#E8C97E] transition-colors"
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={recoverySubmitting}
                className="w-full h-11 bg-gradient-to-r from-[#E8C97E] to-[#C98A1C] hover:from-[#F0D48A] hover:to-[#B8482C] text-[#1A130C] font-bold shadow-lg shadow-[#C98A1C]/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {recoverySubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setRecoveryMode(false);
                  setRecoveryError("");
                  setRecoveryNotice("");
                }}
                className="text-[#E8C97E]/60 text-xs hover:text-[#E8C97E] transition-colors underline cursor-pointer"
              >
                Back to login
              </button>
            </div>
          </div>

          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-[#C98A1C]/25 rounded-full blur-2xl" />
        </div>
      </div>
    );
  }

  // ── Regular Login Form ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#1A130C] flex items-center justify-center px-4 py-8">
      {/* Warm background composition — SAFFRON DAWN */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#1A130C_0%,#8B3520_55%,#0E1116_100%)] opacity-80" />
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#B8482C]/25 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#C98A1C]/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] rounded-full bg-[#8B3520]/15 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="relative bg-[#0E1116]/80 backdrop-blur-xl border border-[#E8C97E]/25 rounded-2xl shadow-2xl p-8 overflow-hidden">
          {/* Gold top edge — lit from above */}
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#C98A1C]/70 to-transparent rounded-full" />

          {/* Logo & Heading */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E8C97E] to-[#C98A1C] flex items-center justify-center shadow-lg shadow-[#C98A1C]/30 mb-4">
              <ShieldCheck className="w-8 h-8 text-[#1A130C]" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Paliwal Secure</h1>
            <p className="text-[#E8C97E] text-sm mt-1 tracking-[0.14em] uppercase font-semibold">
              Admin Console
            </p>
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
              <Label htmlFor="email" className="text-[#F7E8B8] text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E8C97E]/60" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 ${inputCls}`}
                  required
                  autoComplete="email"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#F7E8B8] text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E8C97E]/60" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 pr-10 ${inputCls}`}
                  required
                  autoComplete="current-password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#E8C97E]/60 hover:text-[#E8C97E] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full h-11 bg-gradient-to-r from-[#E8C97E] to-[#C98A1C] hover:from-[#F0D48A] hover:to-[#B8482C] text-[#1A130C] font-bold shadow-lg shadow-[#C98A1C]/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Owner Recovery */}
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => setRecoveryMode(true)}
              className="text-[#E8C97E]/60 text-xs hover:text-[#E8C97E] transition-colors underline cursor-pointer"
            >
              Password bhool gaye? Owner Recovery
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-5 border-t border-[#E8C97E]/10 text-center">
            <p className="text-[#E8C97E]/40 text-xs">
              Protected admin area · IRDAI POSP IP429834 · Paliwal Secure
            </p>
          </div>
        </div>

        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-[#C98A1C]/25 rounded-full blur-2xl" />
      </div>
    </div>
  );
}
