'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Lock,
  UserPlus,
  Save,
  Loader2,
  Shield,
  BarChart3,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Search,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from '@/hooks/use-toast';

// ── Main Component ───────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { user, accessToken } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Create admin state
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('MODERATOR');
  const [createLoading, setCreateLoading] = useState(false);

  // Google Analytics state
  const [gaMeasurementId, setGaMeasurementId] = useState('');
  const [gaLoading, setGaLoading] = useState(false);
  const [gaFetching, setGaFetching] = useState(true);
  const [gaConnected, setGaConnected] = useState(false);
  const [showGaId, setShowGaId] = useState(false);

  // ── Google Search Console verification + GA4 service account state ──────
  const [googleVerification, setGoogleVerification] = useState('');
  const [gtmContainerId, setGtmContainerId] = useState('');
  const [gaServiceAccountJson, setGaServiceAccountJson] = useState('');
  const [searchConsoleProperty, setSearchConsoleProperty] = useState('');
  const [googleConfigLoading, setGoogleConfigLoading] = useState(false);
  const [googleConfigFetching, setGoogleConfigFetching] = useState(true);
  const [showServiceAccount, setShowServiceAccount] = useState(false);

  // ── Fetch GA settings on mount ─────────────────────────────────────────
  const fetchGaSettings = useCallback(async () => {
    if (!accessToken) return;
    setGaFetching(true);
    setGoogleConfigFetching(true);
    try {
      // Fetch all site config in one call
      const [oldRes, newRes] = await Promise.all([
        fetch('/api/admin/settings?key=ga_measurement_id', {
          headers: { Authorization: `Bearer ${accessToken}` },
        }).catch(() => null),
        fetch('/api/admin/site-config', {
          headers: { Authorization: `Bearer ${accessToken}` },
        }).catch(() => null),
      ]);

      if (oldRes?.ok) {
        const data = await oldRes.json();
        if (data.success && data.setting?.value) {
          setGaMeasurementId(data.setting.value);
          setGaConnected(true);
        } else {
          setGaConnected(false);
        }
      }

      if (newRes?.ok) {
        const data = await newRes.json();
        if (data.success && data.config) {
          const c = data.config;
          if (c.ga_measurement_id?.value) {
            setGaMeasurementId(c.ga_measurement_id.value);
            setGaConnected(true);
          }
          if (c.google_site_verification?.value) {
            setGoogleVerification(c.google_site_verification.value);
          }
          if (c.gtm_container_id?.value) {
            setGtmContainerId(c.gtm_container_id.value);
          }
          if (c.ga_service_account_json?.value) {
            // Show only a placeholder for security — never display full JSON
            setGaServiceAccountJson(c.ga_service_account_json.value);
          }
          if (c.search_console_property_id?.value) {
            setSearchConsoleProperty(c.search_console_property_id.value);
          }
        }
      }
    } catch {
      // Silently fail
    } finally {
      setGaFetching(false);
      setGoogleConfigFetching(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchGaSettings();
  }, [fetchGaSettings]);

  // ── Save GA settings handler ───────────────────────────────────────────
  const handleSaveGaId = async () => {
    if (!accessToken) return;

    const trimmedId = gaMeasurementId.trim();

    // Validate GA ID format (G-XXXXXXXXXX or GT-XXXXXXXXXX or UA-XXXXX-X)
    if (trimmedId && !/^(G|GT|UA)-[A-Z0-9]+(-[A-Z0-9]+)?$/i.test(trimmedId)) {
      toast({
        title: 'Invalid GA ID',
        description: 'Format should be G-XXXXXXXXXX, GT-XXXXXXXXXX, or UA-XXXXX-X',
        variant: 'destructive',
      });
      return;
    }

    setGaLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: 'ga_measurement_id',
          value: trimmedId,
          description: 'Google Analytics Measurement ID',
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to save GA ID');

      setGaConnected(!!trimmedId);
      toast({
        title: trimmedId ? 'Google Analytics Connected! 🎉' : 'Google Analytics Disconnected',
        description: trimmedId
          ? `Tracking ID ${trimmedId} is now active on your website`
          : 'GA tracking has been removed from your website',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to save GA settings',
        variant: 'destructive',
      });
    } finally {
      setGaLoading(false);
    }
  };

  // ── Change password handler ────────────────────────────────────────────
  const handleChangePassword = async () => {
    if (!accessToken) return;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({ title: 'Validation Error', description: 'All password fields are required', variant: 'destructive' });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({ title: 'Validation Error', description: 'New passwords do not match', variant: 'destructive' });
      return;
    }

    if (newPassword.length < 8) {
      toast({ title: 'Validation Error', description: 'Password must be at least 8 characters', variant: 'destructive' });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch('/api/admin/auth/change-password', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to change password');

      toast({ title: 'Success', description: 'Password changed successfully' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to change password',
        variant: 'destructive',
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // ── Create admin handler ───────────────────────────────────────────────
  const handleCreateAdmin = async () => {
    if (!accessToken || !isAdmin) return;

    if (!newAdminName || !newAdminEmail || !newAdminPassword) {
      toast({ title: 'Validation Error', description: 'All fields are required', variant: 'destructive' });
      return;
    }

    if (newAdminPassword.length < 8) {
      toast({ title: 'Validation Error', description: 'Password must be at least 8 characters', variant: 'destructive' });
      return;
    }

    setCreateLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newAdminName,
          email: newAdminEmail,
          password: newAdminPassword,
          role: newAdminRole,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to create admin user');

      toast({ title: 'Success', description: `${newAdminRole} account created for ${newAdminName}` });
      setNewAdminName('');
      setNewAdminEmail('');
      setNewAdminPassword('');
      setNewAdminRole('MODERATOR');
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to create admin user',
        variant: 'destructive',
      });
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600">
          <SettingsIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Settings</h2>
          <p className="text-sm text-slate-500">Manage your account and preferences</p>
        </div>
      </div>

      {/* ── Google Analytics Section ────────────────────────────────────────── */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-500" />
              <CardTitle className="text-base">Google Analytics</CardTitle>
            </div>
            {!gaFetching && (
              <Badge
                className={`text-xs ${
                  gaConnected
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {gaConnected ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Connected
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 mr-1" />
                    Not Connected
                  </>
                )}
              </Badge>
            )}
          </div>
          <CardDescription>
            Connect Google Analytics to track website visitors and page views
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">GA Measurement ID</Label>
            <div className="flex gap-2 mt-1">
              <div className="relative flex-1">
                <Input
                  type={showGaId ? 'text' : 'password'}
                  className="pr-10"
                  value={gaMeasurementId}
                  onChange={(e) => setGaMeasurementId(e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  disabled={gaFetching}
                />
                <button
                  type="button"
                  onClick={() => setShowGaId(!showGaId)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showGaId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button
                className="bg-amber-500 hover:bg-amber-600 text-white shrink-0"
                onClick={handleSaveGaId}
                disabled={gaLoading || gaFetching}
              >
                {gaLoading ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-1" />
                )}
                Save
              </Button>
            </div>
          </div>

          {gaConnected && gaMeasurementId && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-emerald-700 font-medium">
                    Google Analytics is active
                  </p>
                  <p className="text-xs text-emerald-600 mt-0.5">
                    Tracking ID: <code className="bg-emerald-100 px-1 py-0.5 rounded text-[11px]">{showGaId ? gaMeasurementId : 'G-••••••••••'}</code>
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>How to get your GA Measurement ID:</strong>
            </p>
            <ol className="text-xs text-blue-600 mt-1 space-y-0.5 list-decimal list-inside">
              <li>Go to{' '}
                <a
                  href="https://analytics.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline inline-flex items-center gap-0.5"
                >
                  Google Analytics <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>Create a new property or select an existing one</li>
              <li>Copy the Measurement ID (starts with G-)</li>
              <li>Paste it above and click Save</li>
            </ol>
          </div>

          {gaMeasurementId && !gaConnected && (
            <p className="text-xs text-amber-600">
              💡 Click &quot;Save&quot; to activate Google Analytics tracking on your website
            </p>
          )}
        </CardContent>
      </Card>

      {/* ── Profile Section ─────────────────────────────────────────────────── */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-amber-500" />
            <CardTitle className="text-base">Profile</CardTitle>
          </div>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Name</Label>
              <Input className="mt-1 bg-slate-50" value={user?.name || ''} disabled />
            </div>
            <div>
              <Label className="text-sm font-medium">Email</Label>
              <Input className="mt-1 bg-slate-50" value={user?.email || ''} disabled />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Role</Label>
            <div className="mt-1">
              <Badge
                className={`text-xs ${
                  isAdmin
                    ? 'bg-amber-100 text-amber-700 border-amber-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                <Shield className="w-3 h-3 mr-1" />
                {user?.role || 'MODERATOR'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Change Password Section ─────────────────────────────────────────── */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-500" />
            <CardTitle className="text-base">Change Password</CardTitle>
          </div>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Current Password</Label>
            <Input
              type="password"
              className="mt-1"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">New Password</Label>
              <Input
                type="password"
                className="mt-1"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 8 characters"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Confirm New Password</Label>
              <Input
                type="password"
                className="mt-1"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Button
              className="bg-amber-500 hover:bg-amber-600 text-white"
              onClick={handleChangePassword}
              disabled={passwordLoading}
            >
              {passwordLoading ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-1" />
              )}
              Update Password
            </Button>
            {newPassword && confirmPassword && newPassword === confirmPassword && (
              <span className="text-xs text-emerald-600">✓ Passwords match</span>
            )}
            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <span className="text-xs text-red-600">✗ Passwords do not match</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Create Admin/Moderator Section ──────────────────────────────────── */}
      {isAdmin && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-amber-500" />
              <CardTitle className="text-base">Create New User</CardTitle>
            </div>
            <CardDescription>
              Create a new admin or moderator account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Full Name</Label>
                <Input
                  className="mt-1"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <Input
                  type="email"
                  className="mt-1"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="user@example.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Password</Label>
                <Input
                  type="password"
                  className="mt-1"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  placeholder="Min 8 characters"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Role</Label>
                <Select value={newAdminRole} onValueChange={setNewAdminRole}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MODERATOR">Moderator</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="pt-2">
              <Button
                className="bg-amber-500 hover:bg-amber-600 text-white"
                onClick={handleCreateAdmin}
                disabled={
                  createLoading ||
                  !newAdminName.trim() ||
                  !newAdminEmail.trim() ||
                  !newAdminPassword.trim()
                }
              >
                {createLoading ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4 mr-1" />
                )}
                Create {newAdminRole === 'ADMIN' ? 'Admin' : 'Moderator'}
              </Button>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-700">
                <strong>Note:</strong> Admin users have full access including deletion capabilities.
                Moderators can review content, manage leads, and update records but cannot delete
                items or create new admin users.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Google Search Console + Service Account ───────────────────────────── */}
      {isAdmin && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                <Search className="w-4 h-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-base">Google Search Console + GA4 Service Account</CardTitle>
                <CardDescription>
                  Verify site ownership in Google Search Console and connect GA4 Data API for real analytics
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {googleConfigFetching ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              </div>
            ) : (
              <>
                {/* Google Site Verification Code */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Google Site Verification Code</Label>
                  <Input
                    value={googleVerification}
                    onChange={(e) => setGoogleVerification(e.target.value)}
                    placeholder="google8fc09a8ee177a7d9"
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-slate-500">
                    Get this from <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-0.5">Google Search Console <ExternalLink className="w-3 h-3" /></a> → Add Property → URL prefix → Verify → HTML tag method → copy the <code className="bg-slate-100 px-1 rounded">content</code> value.
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-4" />

                {/* GTM Container ID */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Google Tag Manager Container ID</Label>
                  <Input
                    value={gtmContainerId}
                    onChange={(e) => setGtmContainerId(e.target.value)}
                    placeholder="GTM-P47L386Z"
                    className="font-mono text-sm"
                  />
                </div>

                <div className="border-t border-slate-100 pt-4" />

                {/* Search Console Property ID */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">GA4 Property ID (optional)</Label>
                  <Input
                    value={searchConsoleProperty}
                    onChange={(e) => setSearchConsoleProperty(e.target.value)}
                    placeholder="123456789"
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-slate-500">
                    Found in GA4 → Admin → Property settings. Leave blank to auto-discover.
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-4" />

                {/* GA4 Service Account JSON */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">GA4 Service Account JSON</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowServiceAccount(s => !s)}
                      className="h-7 text-xs"
                    >
                      {showServiceAccount ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
                      {showServiceAccount ? 'Hide' : 'Show'}
                    </Button>
                  </div>
                  <textarea
                    value={showServiceAccount ? gaServiceAccountJson : (gaServiceAccountJson ? '•••••••••••••••••••••••• (hidden — click Show to view/edit)' : '')}
                    onChange={(e) => setGaServiceAccountJson(e.target.value)}
                    onFocus={() => setShowServiceAccount(true)}
                    placeholder='{"type": "service_account", "project_id": "...", "private_key": "-----BEGIN PRIVATE KEY-----\n...", "client_email": "...@....iam.gserviceaccount.com", ...}'
                    rows={6}
                    className="w-full px-3 py-2 rounded-md border border-slate-200 font-mono text-xs resize-y focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-700 font-medium mb-1">📋 How to get this:</p>
                    <ol className="text-xs text-blue-600 space-y-0.5 list-decimal list-inside">
                      <li>Go to <a href="https://console.cloud.google.com/iam-admin/serviceaccounts" target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-0.5">Google Cloud Console <ExternalLink className="w-3 h-3" /></a></li>
                      <li>Create or select a project</li>
                      <li>Enable "Google Analytics Data API" (analyticsdata.googleapis.com)</li>
                      <li>Create Service Account → Keys → Add Key → JSON (downloads file)</li>
                      <li>Open the JSON file → copy entire content → paste here</li>
                      <li>In GA4: Admin → Property Access Management → Add the service account email as "Viewer"</li>
                    </ol>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    onClick={async () => {
                      setGoogleConfigLoading(true);
                      try {
                        const settings = [
                          { key: 'google_site_verification', value: googleVerification, description: 'Google Search Console verification code' },
                          { key: 'gtm_container_id', value: gtmContainerId, description: 'Google Tag Manager Container ID' },
                          { key: 'search_console_property_id', value: searchConsoleProperty, description: 'GA4 Property ID' },
                        ];
                        if (gaServiceAccountJson && gaServiceAccountJson !== '•••••••••••••••••••••••• (hidden — click Show to view/edit)') {
                          settings.push({ key: 'ga_service_account_json', value: gaServiceAccountJson, description: 'GA4 service account credentials JSON' });
                        }
                        for (const s of settings) {
                          if (s.value !== undefined) {
                            await fetch('/api/admin/site-config', {
                              method: 'POST',
                              headers: {
                                Authorization: `Bearer ${accessToken}`,
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify(s),
                            });
                          }
                        }
                        toast({ title: 'Google Configuration Saved! ✅', description: 'Search Console + Analytics settings updated.' });
                      } catch (err) {
                        toast({ title: 'Save Failed', description: err instanceof Error ? err.message : 'Unknown error', variant: 'destructive' });
                      } finally {
                        setGoogleConfigLoading(false);
                      }
                    }}
                    disabled={googleConfigLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {googleConfigLoading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                    Save Google Configuration
                  </Button>
                  <Link href="/admin/dashboard/analytics">
                    <Button variant="outline">
                      <BarChart3 className="w-4 h-4 mr-1" />
                      View Analytics Dashboard
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Non-admin notice ────────────────────────────────────────────────── */}
      {!isAdmin && (
        <Card className="border-0 shadow-md bg-slate-50">
          <CardContent className="p-6 text-center">
            <Shield className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">
              User management is only available for Admin accounts.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Contact your system administrator to create new admin/moderator accounts.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
