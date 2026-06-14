'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ClipboardList,
  Filter,
  Download,
  ChevronDown,
  ChevronRight,
  Loader2,
  Search,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  PlusCircle,
  Lock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from '@/hooks/use-toast';

// ── Types ──────────────────────────────────────────────────────────────────
interface AuditLogEntry {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: string | null;
  userId: string | null;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: string;
  user: { name: string; email: string } | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ── Action badge config ────────────────────────────────────────────────────
function getActionBadge(action: string) {
  const config: Record<string, { color: string; icon: React.ElementType }> = {
    LOGIN: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
    MFA_ENABLED: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: Shield },
    MFA_DISABLED: { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
    LOGIN_FAILED: { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
    ACCOUNT_LOCKED: { color: 'bg-red-100 text-red-700 border-red-200', icon: AlertTriangle },
    IP_BLOCKED: { color: 'bg-red-100 text-red-700 border-red-200', icon: AlertTriangle },
    LOGIN_MFA_REQUIRED: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Lock },
    MFA_LOGIN_FAILED: { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
    MFA_SETUP_INITIATED: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Shield },
    CREATE: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: PlusCircle },
    UPDATE: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Edit },
    DELETE: { color: 'bg-red-100 text-red-700 border-red-200', icon: Trash2 },
    APPROVE: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: CheckCircle2 },
    REJECT: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: XCircle },
  };
  return config[action] || { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: ClipboardList };
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function AuditLogsPage() {
  const { accessToken } = useAuthStore();

  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Expanded row
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
      });
      if (actionFilter !== 'all') params.set('action', actionFilter);
      if (entityFilter !== 'all') params.set('entity', entityFilter);
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(`/api/admin/audit-logs?${params}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
        setPagination(data.pagination);
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load audit logs', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [accessToken, pagination.page, pagination.limit, actionFilter, entityFilter, search]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // ── CSV Export ──────────────────────────────────────────────────────────
  const exportCSV = () => {
    const headers = ['Timestamp', 'Action', 'Entity', 'Entity ID', 'User', 'IP Address', 'Details'];
    const rows = logs.map((log) => [
      new Date(log.createdAt).toISOString(),
      log.action,
      log.entity,
      log.entityId || '',
      log.user?.name || 'System',
      log.ipAddress || '',
      (log.details || '').replace(/"/g, '""'),
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const actionOptions = [
    'LOGIN', 'LOGIN_FAILED', 'ACCOUNT_LOCKED', 'IP_BLOCKED',
    'MFA_ENABLED', 'MFA_DISABLED', 'MFA_SETUP_INITIATED', 'MFA_LOGIN_FAILED',
    'CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT',
  ];

  const entityOptions = ['AdminUser', 'Review', 'Lead', 'GlossaryTerm', 'Article', 'SiteSetting'];

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600">
          <ClipboardList className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Audit Logs</h2>
          <p className="text-sm text-slate-500">Track all admin activities and security events</p>
        </div>
      </div>

      {/* ── Filters ─────────────────────────────────────────────────────────── */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-600">Filters:</span>
            </div>

            <Select value={actionFilter} onValueChange={(v) => { setActionFilter(v); setPagination((p) => ({ ...p, page: 1 })); }}>
              <SelectTrigger className="w-[180px] h-9 text-sm">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {actionOptions.map((a) => (
                  <SelectItem key={a} value={a}>{a.replace(/_/g, ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={entityFilter} onValueChange={(v) => { setEntityFilter(v); setPagination((p) => ({ ...p, page: 1 })); }}>
              <SelectTrigger className="w-[160px] h-9 text-sm">
                <SelectValue placeholder="Entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                {entityOptions.map((e) => (
                  <SelectItem key={e} value={e}>{e}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <Input
                placeholder="Search in details..."
                className="pl-8 h-9 text-sm"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }}
              />
            </div>

            <Select
              value={String(pagination.limit)}
              onValueChange={(v) => setPagination((p) => ({ ...p, limit: parseInt(v), page: 1 }))}
            >
              <SelectTrigger className="w-[80px] h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={exportCSV} disabled={logs.length === 0}>
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Logs Table ──────────────────────────────────────────────────────── */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <ClipboardList className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm font-medium">No audit logs found</p>
              <p className="text-xs">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="text-left px-4 py-3 font-semibold text-slate-600 w-8"></th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Time</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Action</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Entity</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">User</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">IP</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => {
                    const badge = getActionBadge(log.action);
                    const BadgeIcon = badge.icon;
                    const isExpanded = expandedId === log.id;

                    return (
                      <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : log.id)}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={`text-[10px] ${badge.color} border`}>
                            <BadgeIcon className="w-2.5 h-2.5 mr-1" />
                            {log.action.replace(/_/g, ' ')}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-slate-700">{log.entity}</td>
                        <td className="px-4 py-3 text-slate-600">
                          {log.user ? (
                            <span>{log.user.name}</span>
                          ) : (
                            <span className="text-slate-400">System</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-500 font-mono text-xs">
                          {log.ipAddress || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Expanded Details */}
              {expandedId && (() => {
                const log = logs.find((l) => l.id === expandedId);
                if (!log) return null;
                return (
                  <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {log.entityId && (
                        <div>
                          <span className="font-semibold text-slate-500">Entity ID:</span>{' '}
                          <code className="bg-slate-100 px-1.5 py-0.5 rounded">{log.entityId}</code>
                        </div>
                      )}
                      {log.userAgent && (
                        <div className="sm:col-span-2">
                          <span className="font-semibold text-slate-500">User Agent:</span>{' '}
                          <span className="text-slate-400 break-all">{log.userAgent}</span>
                        </div>
                      )}
                      {log.details && (
                        <div className="sm:col-span-2">
                          <span className="font-semibold text-slate-500">Details:</span>
                          <pre className="mt-1 bg-white p-2 rounded border text-[11px] overflow-x-auto max-h-40">
                            {(() => {
                              try {
                                return JSON.stringify(JSON.parse(log.details), null, 2);
                              } catch {
                                return log.details;
                              }
                            })()}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Pagination ──────────────────────────────────────────────────────── */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
          </p>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === 1}
              onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
