'use client';

import { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Lock,
  UserPlus,
  Save,
  Loader2,
  Shield,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
