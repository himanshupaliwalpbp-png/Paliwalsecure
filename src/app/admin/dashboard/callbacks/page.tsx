'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  PhoneCall,
  AlertCircle,
  User,
  MessageSquare,
  Filter,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

// ── Types ────────────────────────────────────────────────────────────────────
interface CallbackRequest {
  id: string;
  name: string;
  mobile: string;
  preferredTime: string;
  message: string | null;
  status: string;
  source: string;
  createdAt: string;
  updatedAt: string;
}

type StatusFilter = 'ALL' | 'PENDING' | 'COMPLETED' | 'CANCELLED';

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

// ── Status badge helper ──────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { className: string; icon: React.ReactNode }> = {
    PENDING: {
      className: 'bg-amber-100 text-amber-700 border-amber-200',
      icon: <Clock className="w-3 h-3" />,
    },
    COMPLETED: {
      className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    CANCELLED: {
      className: 'bg-red-100 text-red-700 border-red-200',
      icon: <XCircle className="w-3 h-3" />,
    },
  };
  const c = config[status] || {
    className: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: <AlertCircle className="w-3 h-3" />,
  };
  return (
    <Badge variant="outline" className={`text-xs flex items-center gap-1 ${c.className}`}>
      {c.icon}
      {status}
    </Badge>
  );
}

// ── Preferred time label ─────────────────────────────────────────────────────
function PreferredTimeLabel({ value }: { value: string }) {
  const labels: Record<string, { text: string; emoji: string }> = {
    asap: { text: 'ASAP', emoji: '⚡' },
    '1hour': { text: 'Within 1 Hour', emoji: '🕐' },
    '2-5pm': { text: '2-5 PM', emoji: '📅' },
  };
  const config = labels[value] || { text: value, emoji: '🕐' };
  return (
    <span className="flex items-center gap-1 text-sm text-slate-600">
      <span>{config.emoji}</span>
      {config.text}
    </span>
  );
}

// ── Source badge ─────────────────────────────────────────────────────────────
function SourceBadge({ source }: { source: string }) {
  const config: Record<string, { className: string }> = {
    chatbot: { className: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    website: { className: 'bg-blue-100 text-blue-700 border-blue-200' },
    whatsapp: { className: 'bg-green-100 text-green-700 border-green-200' },
  };
  const c = config[source] || { className: 'bg-slate-100 text-slate-700 border-slate-200' };
  return (
    <Badge variant="outline" className={`text-xs capitalize ${c.className}`}>
      {source}
    </Badge>
  );
}

// ── Stats Card ───────────────────────────────────────────────────────────────
function StatsCard({
  title,
  value,
  icon,
  className,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  className: string;
}) {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${className}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          <p className="text-xs text-slate-500">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function CallbacksManagementPage() {
  // State
  const [callbacks, setCallbacks] = useState<CallbackRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completedToday: 0,
  });

  // ── Fetch callbacks ────────────────────────────────────────────────────
  const fetchCallbacks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (statusFilter !== 'ALL') params.set('status', statusFilter);

      const res = await fetch(`/api/callback?${params}`);
      const data = await res.json();
      if (data.success) {
        setCallbacks(data.data || []);
        setTotal(data.pagination?.total || 0);
        setTotalPages(data.pagination?.pages || 1);
      }
    } catch {
      toast({ title: 'Error', description: 'Callback requests load nahi ho payi', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  // ── Fetch stats ────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const [allRes, pendingRes, completedRes] = await Promise.all([
        fetch('/api/callback?limit=1'),
        fetch('/api/callback?status=PENDING&limit=1'),
        fetch('/api/callback?status=COMPLETED&limit=1'),
      ]);
      const [allData, pendingData, completedData] = await Promise.all([
        allRes.json(),
        pendingRes.json(),
        completedRes.json(),
      ]);
      setStats({
        total: allData.pagination?.total || 0,
        pending: pendingData.pagination?.total || 0,
        completedToday: completedData.pagination?.total || 0,
      });
    } catch {
      // Stats fetch failed silently
    }
  }, []);

  useEffect(() => {
    fetchCallbacks();
  }, [fetchCallbacks]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  // ── Update status ──────────────────────────────────────────────────────
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/callback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: `Callback request ${newStatus === 'COMPLETED' ? 'complete' : newStatus === 'CANCELLED' ? 'cancel' : 'update'} ho gayi`,
        });
        fetchCallbacks();
        fetchStats();
      } else {
        throw new Error(data.error || 'Update failed');
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Status update nahi ho paya',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* ── Stats Cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Total Requests"
          value={stats.total}
          icon={<PhoneCall className="w-5 h-5 text-indigo-600" />}
          className="bg-indigo-100 dark:bg-indigo-950/30"
        />
        <StatsCard
          title="Pending Callbacks"
          value={stats.pending}
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          className="bg-amber-100 dark:bg-amber-950/30"
        />
        <StatsCard
          title="Completed"
          value={stats.completedToday}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          className="bg-emerald-100 dark:bg-emerald-950/30"
        />
      </div>

      {/* ── Filters ────────────────────────────────────────────────────────── */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filter:</span>
            </div>
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  statusFilter === f.value
                    ? 'bg-indigo-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Callbacks Table ────────────────────────────────────────────────── */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
            </div>
          ) : callbacks.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Phone className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p>Koi callback request nahi mili</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Preferred Time</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {callbacks.map((cb) => (
                    <TableRow key={cb.id} className="hover:bg-slate-50/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center">
                            <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <span className="font-medium text-sm text-slate-700">{cb.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <a
                          href={`tel:+91${cb.mobile}`}
                          className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          +91 {cb.mobile.replace(/(\d{5})(\d{5})/, '$1-$2')}
                        </a>
                      </TableCell>
                      <TableCell>
                        <PreferredTimeLabel value={cb.preferredTime} />
                      </TableCell>
                      <TableCell>
                        <SourceBadge source={cb.source} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={cb.status} />
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        {cb.message ? (
                          <div className="flex items-start gap-1">
                            <MessageSquare className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                            <span className="text-xs text-slate-500 line-clamp-2">{cb.message}</span>
                          </div>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {new Date(cb.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        {cb.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                              onClick={() => updateStatus(cb.id, 'COMPLETED')}
                            >
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Done
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => updateStatus(cb.id, 'CANCELLED')}
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            <Select onValueChange={(val) => updateStatus(cb.id, val)}>
                              <SelectTrigger className="h-7 w-[110px] text-xs">
                                <SelectValue placeholder="Change" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Pagination ──────────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-slate-600">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
