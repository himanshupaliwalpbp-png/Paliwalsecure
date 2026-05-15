'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Shield,
  Lock,
  Key,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Copy,
  QrCode,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from '@/hooks/use-toast';

// ── Main Component ───────────────────────────────────────────────────────────
export default function SecurityPage() {
  const { accessToken } = useAuthStore();

  // MFA state
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaFetching, setMfaFetching] = useState(true);
  const [setupStep, setSetupStep] = useState<'idle' | 'setup' | 'verify'>('idle');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [setupLoading, setSetupLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  // Disable MFA state
  const [showDisable, setShowDisable] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  const [disableCode, setDisableCode] = useState('');
  const [disableLoading, setDisableLoading] = useState(false);

  // ── Fetch MFA status ───────────────────────────────────────────────────
  const fetchMfaStatus = useCallback(async () => {
    if (!accessToken) return;
    setMfaFetching(true);
    try {
      // We can check the current user's MFA status by reading the user data
      // For simplicity, we'll use the auth/me endpoint or check via the setup response
      const res = await fetch('/api/admin/auth/mfa/setup', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (data.success) {
        // MFA not enabled yet, setup was initiated
        setMfaEnabled(false);
      } else if (data.error?.includes('already enabled')) {
        setMfaEnabled(true);
      } else {
        setMfaEnabled(false);
      }
    } catch {
      setMfaEnabled(false);
    } finally {
      setMfaFetching(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchMfaStatus();
  }, [fetchMfaStatus]);

  // ── Handle MFA Setup ───────────────────────────────────────────────────
  const handleSetup = async () => {
    if (!accessToken) return;
    setSetupLoading(true);
    try {
      const res = await fetch('/api/admin/auth/mfa/setup', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to setup MFA');

      setQrCodeUrl(data.qrCodeUrl);
      setSecretKey(data.secret);
      setSetupStep('verify');
    } catch (err) {
      toast({
        title: 'Setup Failed',
        description: err instanceof Error ? err.message : 'Failed to initiate MFA setup',
        variant: 'destructive',
      });
    } finally {
      setSetupLoading(false);
    }
  };

  // ── Handle MFA Verify (enable) ─────────────────────────────────────────
  const handleVerify = async () => {
    if (!accessToken || !verifyCode) return;
    setVerifyLoading(true);
    try {
      const res = await fetch('/api/admin/auth/mfa/verify', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verifyCode }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Verification failed');

      setMfaEnabled(true);
      setSetupStep('idle');
      setVerifyCode('');
      setQrCodeUrl('');
      setSecretKey('');
      toast({
        title: 'MFA Enabled! 🔐',
        description: 'Two-factor authentication is now active on your account.',
      });
    } catch (err) {
      toast({
        title: 'Verification Failed',
        description: err instanceof Error ? err.message : 'Invalid code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setVerifyLoading(false);
    }
  };

  // ── Handle MFA Disable ─────────────────────────────────────────────────
  const handleDisable = async () => {
    if (!accessToken || !disablePassword || !disableCode) return;
    setDisableLoading(true);
    try {
      const res = await fetch('/api/admin/auth/mfa/disable', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: disablePassword, token: disableCode }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to disable MFA');

      setMfaEnabled(false);
      setShowDisable(false);
      setDisablePassword('');
      setDisableCode('');
      toast({
        title: 'MFA Disabled',
        description: 'Two-factor authentication has been removed from your account.',
      });
    } catch (err) {
      toast({
        title: 'Disable Failed',
        description: err instanceof Error ? err.message : 'Failed to disable MFA',
        variant: 'destructive',
      });
    } finally {
      setDisableLoading(false);
    }
  };

  // ── Copy secret to clipboard ──────────────────────────────────────────
  const copySecret = () => {
    navigator.clipboard.writeText(secretKey);
    toast({ title: 'Copied!', description: 'Secret key copied to clipboard' });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Security</h2>
          <p className="text-sm text-slate-500">Manage two-factor authentication and security settings</p>
        </div>
      </div>

      {/* ── MFA Status Card ────────────────────────────────────────────────── */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-500" />
              <CardTitle className="text-base">Two-Factor Authentication (2FA)</CardTitle>
            </div>
            {!mfaFetching && (
              <Badge
                className={`text-xs ${
                  mfaEnabled
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    : 'bg-amber-100 text-amber-700 border-amber-200'
                }`}
              >
                {mfaEnabled ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Enabled
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 mr-1" />
                    Disabled
                  </>
                )}
              </Badge>
            )}
          </div>
          <CardDescription>
            Add an extra layer of security to your account with TOTP-based two-factor authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mfaFetching ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
            </div>
          ) : mfaEnabled ? (
            /* ── MFA is Enabled ─────────────────────────────────────────────── */
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-emerald-700 font-medium">
                      Two-factor authentication is active
                    </p>
                    <p className="text-xs text-emerald-600 mt-1">
                      You will be asked for a verification code each time you log in.
                      Use your authenticator app (Google Authenticator, Authy, etc.) to generate codes.
                    </p>
                  </div>
                </div>
              </div>

              {!showDisable ? (
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  onClick={() => setShowDisable(true)}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Disable 2FA
                </Button>
              ) : (
                <div className="space-y-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-red-700 font-medium">
                      Are you sure? Disabling 2FA reduces your account security.
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Current Password</Label>
                    <Input
                      type="password"
                      className="mt-1"
                      value={disablePassword}
                      onChange={(e) => setDisablePassword(e.target.value)}
                      placeholder="Enter your current password"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Authentication Code</Label>
                    <Input
                      className="mt-1"
                      value={disableCode}
                      onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="6-digit code from authenticator"
                      maxLength={6}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      onClick={handleDisable}
                      disabled={disableLoading || !disablePassword || disableCode.length !== 6}
                    >
                      {disableLoading ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-1" />
                      )}
                      Disable 2FA
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowDisable(false);
                        setDisablePassword('');
                        setDisableCode('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── MFA is Disabled ─────────────────────────────────────────────── */
            <div className="space-y-4">
              {setupStep === 'idle' && (
                <>
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-amber-700 font-medium">
                          Your account is not protected with 2FA
                        </p>
                        <p className="text-xs text-amber-600 mt-1">
                          Enable two-factor authentication to prevent unauthorized access even if your password is compromised.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    onClick={handleSetup}
                    disabled={setupLoading}
                  >
                    {setupLoading ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <Key className="w-4 h-4 mr-1" />
                    )}
                    Enable 2FA
                  </Button>
                </>
              )}

              {setupStep === 'verify' && (
                <>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <QrCode className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-blue-700 font-medium">
                          Step 1: Scan the QR code
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Use Google Authenticator, Authy, or any TOTP app to scan this QR code.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Display */}
                  {qrCodeUrl && (
                    <div className="flex flex-col items-center gap-3 py-4">
                      <div className="p-3 bg-white rounded-xl shadow-sm border">
                        <img
                          src={qrCodeUrl}
                          alt="MFA QR Code"
                          className="w-48 h-48"
                        />
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Secret Key */}
                  {secretKey && (
                    <div>
                      <Label className="text-sm font-medium">Manual Entry Key</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="flex-1 bg-slate-100 px-3 py-2 rounded-lg text-xs font-mono break-all select-all">
                          {secretKey}
                        </code>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={copySecret}
                          className="shrink-0"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Save this key in a safe place. You can use it to recover your authenticator if you lose your device.
                      </p>
                    </div>
                  )}

                  <Separator />

                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Key className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-emerald-700 font-medium">
                          Step 2: Enter the verification code
                        </p>
                        <p className="text-xs text-emerald-600 mt-1">
                          Enter the 6-digit code from your authenticator app to confirm setup.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Verification Code</Label>
                    <Input
                      className="mt-1 text-center text-lg tracking-widest font-mono"
                      value={verifyCode}
                      onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      maxLength={6}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="bg-emerald-500 hover:bg-emerald-600 text-white"
                      onClick={handleVerify}
                      disabled={verifyLoading || verifyCode.length !== 6}
                    >
                      {verifyLoading ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                      )}
                      Verify & Enable
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSetupStep('idle');
                        setVerifyCode('');
                        setQrCodeUrl('');
                        setSecretKey('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Security Tips Card ──────────────────────────────────────────────── */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-500" />
            <CardTitle className="text-base">Security Best Practices</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { label: 'Use a strong password', desc: 'Minimum 8 characters with uppercase, lowercase, and numbers', done: true },
              { label: 'Enable two-factor authentication', desc: 'Protect your account with TOTP-based 2FA', done: mfaEnabled },
              { label: 'Never share your credentials', desc: 'Don\'t share your password or TOTP secret with anyone', done: true },
              { label: 'Review audit logs regularly', desc: 'Check the audit logs for suspicious activity', done: false },
              { label: 'Use a password manager', desc: 'Store passwords securely instead of reusing them', done: false },
            ].map((tip) => (
              <div key={tip.label} className="flex items-start gap-3">
                <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  tip.done ? 'bg-emerald-100' : 'bg-slate-100'
                }`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${tip.done ? 'text-emerald-600' : 'text-slate-400'}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{tip.label}</p>
                  <p className="text-xs text-slate-500">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
