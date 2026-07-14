"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Bell,
  X,
  Users,
  Phone,
  Star,
  AlertTriangle,
  Shield,
  CheckCircle2,
  Settings as SettingsIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export type NotificationType = 'lead' | 'callback' | 'review' | 'policy' | 'system';
export type Severity = 'info' | 'warning' | 'success' | 'critical';

export interface AdminNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  severity: Severity;
  createdAt: string;
  link?: string;
}

interface Stats {
  newLeadsToday: number;
  pendingCallbacks: number;
  newReviewsToday: number;
  expiringPolicies7d: number;
  expiringPolicies30d: number;
}

// ── Ringtone (Web Audio API — no audio file needed) ────────────────────────
function playNotificationSound(severity: Severity = 'info') {
  try {
    const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    const freqs: Record<Severity, number[]> = {
      info: [880, 1320],
      success: [660, 990, 1320],
      warning: [740, 622],
      critical: [1108, 1108, 1480],
    };
    const notes = freqs[severity] || freqs.info;
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const startTime = now + i * 0.15;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
    setTimeout(() => ctx.close().catch(() => {}), notes.length * 200 + 500);
  } catch { /* silent */ }
}

const ICON_MAP: Record<NotificationType, typeof Users> = {
  lead: Users,
  callback: Phone,
  review: Star,
  policy: AlertTriangle,
  system: Shield,
};

const SEVERITY_COLORS: Record<Severity, { bg: string; text: string; border: string }> = {
  info:    { bg: 'bg-blue-500/10',    text: 'text-blue-300',    border: 'border-blue-500/30' },
  warning: { bg: 'bg-amber-500/10',   text: 'text-amber-300',   border: 'border-amber-500/30' },
  success: { bg: 'bg-emerald-500/10', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  critical:{ bg: 'bg-red-500/10',     text: 'text-red-300',     border: 'border-red-500/30' },
};

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function AdminNotificationCenter() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [unread, setUnread] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastSeenId, setLastSeenId] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('admin_notification_sound');
    if (stored !== null) setSoundEnabled(stored === 'true');
  }, []);
  useEffect(() => {
    localStorage.setItem('admin_notification_sound', String(soundEnabled));
  }, [soundEnabled]);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/notifications?limit=20', { credentials: 'include' });
      if (!res.ok) return;
      const data = await res.json();
      if (!data.success) return;
      setNotifications(data.notifications);
      setStats(data.stats);

      if (data.notifications.length > 0) {
        const newestId = data.notifications[0].id;
        if (lastSeenId && newestId !== lastSeenId) {
          const newItems: AdminNotification[] = [];
          for (const n of data.notifications) {
            if (n.id === lastSeenId) break;
            newItems.push(n);
          }
          if (newItems.length > 0) {
            const highestSeverity = newItems.reduce<Severity>((s, n) => {
              const order: Severity[] = ['info', 'success', 'warning', 'critical'];
              return order.indexOf(n.severity) > order.indexOf(s) ? n.severity : s;
            }, 'info');
            if (soundEnabled) playNotificationSound(highestSeverity);

            if ('Notification' in window && Notification.permission === 'granted') {
              for (const n of newItems.slice(0, 3)) {
                new Notification(n.title, { body: n.message, icon: '/icon-192.png', tag: n.id });
              }
            }
          }
        }
        setLastSeenId(newestId);
        setUnread(data.notifications.length);
      }
    } catch { /* silent */ }
  }, [lastSeenId, soundEnabled]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  const handleMarkAllRead = () => {
    setUnread(0);
    if (notifications.length > 0) setLastSeenId(notifications[0].id);
  };

  const handleNotificationClick = (n: AdminNotification) => {
    setOpen(false);
    if (n.link) router.push(n.link);
  };

  const requestBrowserPermission = () => {
    if ('Notification' in window) Notification.requestPermission();
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold text-white bg-gradient-to-br from-red-500 to-rose-600 rounded-full shadow-lg shadow-red-500/40"
          >
            {unread > 9 ? '9+' : unread}
          </motion.span>
        )}
        {notifications.some(n => n.severity === 'critical') && (
          <span className="absolute inset-0 rounded-lg ring-2 ring-red-500/50 animate-ping" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-[380px] max-w-[calc(100vw-2rem)] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <div>
                <h3 className="text-white font-semibold text-sm">Notifications</h3>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  {unread > 0 ? `${unread} new` : 'All caught up'} · Updates every 30s
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSoundEnabled(s => !s)}
                  className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                  title={soundEnabled ? 'Mute notifications' : 'Unmute notifications'}
                >
                  {soundEnabled ? '🔊' : '🔇'}
                </button>
                <button
                  onClick={handleMarkAllRead}
                  className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                  title="Mark all as read"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {stats && (
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-800/50 border-b border-slate-700/50">
                <StatPill label="Leads Today" value={stats.newLeadsToday} tone="emerald" />
                <StatPill label="Callbacks" value={stats.pendingCallbacks} tone="amber" />
                <StatPill label="Expiring 7d" value={stats.expiringPolicies7d} tone="red" />
              </div>
            )}

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                  <p className="text-slate-400 text-sm">No notifications yet</p>
                  <p className="text-slate-500 text-xs mt-1">New leads & alerts will appear here</p>
                </div>
              ) : (
                notifications.map(n => {
                  const Icon = ICON_MAP[n.type] || Bell;
                  const colors = SEVERITY_COLORS[n.severity];
                  return (
                    <button
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`w-full flex items-start gap-3 p-3 hover:bg-slate-800/60 transition-colors border-b border-slate-800/50 text-left ${n.severity === 'critical' ? 'bg-red-950/20' : ''}`}
                    >
                      <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${colors.bg} ${colors.border} border`}>
                        <Icon className={`w-4 h-4 ${colors.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-white text-[13px] font-medium truncate">{n.title}</p>
                          <span className="text-slate-500 text-[10px] shrink-0">{formatRelative(n.createdAt)}</span>
                        </div>
                        <p className="text-slate-400 text-[12px] mt-0.5 line-clamp-2">{n.message}</p>
                        {n.link && (
                          <p className="text-blue-400 text-[11px] mt-1 hover:underline">View details →</p>
                        )}
                      </div>
                      {n.severity === 'critical' && (
                        <span className="shrink-0 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            <div className="p-3 border-t border-slate-700 bg-slate-900/80">
              <button
                onClick={requestBrowserPermission}
                className="w-full flex items-center justify-center gap-2 py-2 text-[11px] text-slate-400 hover:text-white transition-colors"
              >
                <SettingsIcon className="w-3 h-3" />
                Enable desktop notifications for real-time alerts
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatPill({ label, value, tone }: { label: string; value: number; tone: 'emerald' | 'amber' | 'red' }) {
  const tones = {
    emerald: 'text-emerald-400 bg-emerald-500/10',
    amber:   'text-amber-400 bg-amber-500/10',
    red:     'text-red-400 bg-red-500/10',
  };
  return (
    <div className={`rounded-lg p-2 ${tones[tone]}`}>
      <p className="text-[10px] uppercase tracking-wider opacity-80">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}
