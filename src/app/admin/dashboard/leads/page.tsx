'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Users,
  Search,
  Download,
  Phone,
  Mail,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  StickyNote,
  Edit3,
  Plus,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from '@/hooks/use-toast';

// ── Types ────────────────────────────────────────────────────────────────────
interface LeadNote {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string; email: string } | null;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  insuranceType: string | null;
  status: string;
  source: string;
  message: string | null;
  followUpDate: string | null;
  assignedTo: string | null;
  notes: string | null;
  lastContactedAt: string | null;
  createdAt: string;
  leadNotes: LeadNote[];
}

type StatusFilter = 'all' | 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'QUALIFIED', label: 'Qualified' },
  { value: 'CONVERTED', label: 'Converted' },
  { value: 'LOST', label: 'Lost' },
];

const SOURCES = ['website', 'whatsapp', 'referral', 'ads'];

// ── Status badge helper ──────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { className: string }> = {
    NEW: { className: 'bg-blue-100 text-blue-700 border-blue-200' },
    CONTACTED: { className: 'bg-amber-100 text-amber-700 border-amber-200' },
    QUALIFIED: { className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    CONVERTED: { className: 'bg-teal-100 text-teal-700 border-teal-200' },
    LOST: { className: 'bg-red-100 text-red-700 border-red-200' },
  };
  const c = config[status] || { className: 'bg-slate-100 text-slate-700 border-slate-200' };
  return (
    <Badge variant="outline" className={`text-xs ${c.className}`}>
      {status}
    </Badge>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function LeadsManagementPage() {
  const { accessToken, user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  // State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [source, setSource] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  // Edit dialog
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [editStatus, setEditStatus] = useState('');
  const [editFollowUp, setEditFollowUp] = useState('');
  const [editAssignedTo, setEditAssignedTo] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Notes dialog
  const [notesLead, setNotesLead] = useState<Lead | null>(null);
  const [newNote, setNewNote] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);
  const [leadNotes, setLeadNotes] = useState<LeadNote[]>([]);

  // ── Fetch leads ────────────────────────────────────────────────────────
  const fetchLeads = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (source !== 'all') params.set('source', source);
      if (search) params.set('search', search);

      const res = await fetch(`/api/admin/leads?${params}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      setLeads(data.data || []);
      setTotal(data.pagination?.total || 0);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch {
      toast({ title: 'Error', description: 'Failed to load leads', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [accessToken, page, statusFilter, source, search]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, source, search]);

  // ── Selection ──────────────────────────────────────────────────────────
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === leads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(leads.map((l) => l.id)));
    }
  };

  // ── Update lead ────────────────────────────────────────────────────────
  const updateLead = async (id: string, payload: Record<string, unknown>) => {
    if (!accessToken) return;
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Update failed');
      toast({ title: 'Success', description: 'Lead updated' });
      fetchLeads();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update lead',
        variant: 'destructive',
      });
    }
  };

  const deleteLead = async (id: string) => {
    if (!accessToken || !isAdmin) return;
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Delete failed');
      toast({ title: 'Success', description: 'Lead deleted' });
      fetchLeads();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to delete lead',
        variant: 'destructive',
      });
    }
  };

  // ── Bulk action ────────────────────────────────────────────────────────
  const bulkAction = async (action: string) => {
    if (!accessToken || selectedIds.size === 0) return;
    if (action === 'delete' && !confirm(`Delete ${selectedIds.size} leads?`)) return;

    setBulkLoading(true);
    try {
      const res = await fetch('/api/admin/leads/bulk', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leadIds: Array.from(selectedIds), action }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Bulk action failed');
      toast({ title: 'Success', description: `${data.affected} lead(s) updated` });
      setSelectedIds(new Set());
      fetchLeads();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Bulk action failed',
        variant: 'destructive',
      });
    } finally {
      setBulkLoading(false);
    }
  };

  // ── Export CSV ─────────────────────────────────────────────────────────
  const exportCsv = async () => {
    if (!accessToken) return;
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (source !== 'all') params.set('source', source);

      const res = await fetch(`/api/admin/leads/export?${params}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast({ title: 'Success', description: 'Leads exported' });
    } catch {
      toast({ title: 'Error', description: 'Failed to export leads', variant: 'destructive' });
    }
  };

  // ── Edit dialog ────────────────────────────────────────────────────────
  const openEdit = (lead: Lead) => {
    setEditLead(lead);
    setEditStatus(lead.status);
    setEditFollowUp(lead.followUpDate ? lead.followUpDate.split('T')[0] : '');
    setEditAssignedTo(lead.assignedTo || '');
    setEditNotes(lead.notes || '');
  };

  const saveEdit = async () => {
    if (!editLead) return;
    setEditLoading(true);
    try {
      const payload: Record<string, unknown> = {};
      if (editStatus !== editLead.status) payload.status = editStatus;
      if (editFollowUp !== (editLead.followUpDate ? editLead.followUpDate.split('T')[0] : ''))
        payload.followUpDate = editFollowUp || null;
      if (editAssignedTo !== (editLead.assignedTo || '')) payload.assignedTo = editAssignedTo || null;
      if (editNotes !== (editLead.notes || '')) payload.notes = editNotes;

      await updateLead(editLead.id, payload);
      setEditLead(null);
    } finally {
      setEditLoading(false);
    }
  };

  // ── Notes dialog ───────────────────────────────────────────────────────
  const openNotes = (lead: Lead) => {
    setNotesLead(lead);
    setLeadNotes(lead.leadNotes || []);
    setNewNote('');
  };

  const addNote = async () => {
    if (!notesLead || !newNote.trim() || !accessToken) return;
    setNoteLoading(true);
    try {
      const res = await fetch(`/api/admin/leads/${notesLead.id}/notes`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newNote.trim() }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to add note');

      setLeadNotes((prev) => [data.data, ...prev]);
      setNewNote('');
      toast({ title: 'Success', description: 'Note added' });
      fetchLeads(); // Refresh to get updated lead notes
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to add note',
        variant: 'destructive',
      });
    } finally {
      setNoteLoading(false);
    }
  };

  // ── Search ─────────────────────────────────────────────────────────────
  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* ── Top Bar: Filters ────────────────────────────────────────────────── */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          {/* Status pills */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  statusFilter === f.value
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-3">
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {SOURCES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Input
                placeholder="Search leads..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="max-w-sm"
              />
              <Button variant="outline" size="icon" onClick={handleSearch}>
                <Search className="w-4 h-4" />
              </Button>
            </div>

            <Button variant="outline" size="sm" onClick={exportCsv}>
              <Download className="w-4 h-4 mr-1.5" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Bulk Action Toolbar ─────────────────────────────────────────────── */}
      {selectedIds.size > 0 && (
        <Card className="border-amber-200 bg-amber-50 shadow-md">
          <CardContent className="p-3 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-amber-800">
              {selectedIds.size} selected
            </span>
            <div className="h-4 w-px bg-amber-200 mx-1" />
            <Button
              size="sm"
              variant="outline"
              className="text-amber-700 border-amber-300 hover:bg-amber-100"
              onClick={() => bulkAction('contacted')}
              disabled={bulkLoading}
            >
              Mark Contacted
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-emerald-700 border-emerald-300 hover:bg-emerald-50"
              onClick={() => bulkAction('qualified')}
              disabled={bulkLoading}
            >
              Mark Qualified
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-teal-700 border-teal-300 hover:bg-teal-50"
              onClick={() => bulkAction('converted')}
              disabled={bulkLoading}
            >
              Mark Converted
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-700 border-red-300 hover:bg-red-50"
              onClick={() => bulkAction('lost')}
              disabled={bulkLoading}
            >
              Mark Lost
            </Button>
            {isAdmin && (
              <Button
                size="sm"
                variant="outline"
                className="text-red-700 border-red-300 hover:bg-red-50"
                onClick={() => bulkAction('delete')}
                disabled={bulkLoading}
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Delete
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="ml-auto text-slate-500"
              onClick={() => setSelectedIds(new Set())}
            >
              Clear
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── Leads Table ─────────────────────────────────────────────────────── */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p>No leads found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={selectedIds.size === leads.length && leads.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Insurance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Follow Up</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id} className="hover:bg-slate-50/50">
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(lead.id)}
                          onCheckedChange={() => toggleSelect(lead.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-sm text-slate-700">{lead.name}</p>
                        {lead.assignedTo && (
                          <p className="text-xs text-slate-400">Assignee: {lead.assignedTo}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <p className="text-sm text-slate-600 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {lead.email}
                          </p>
                          {lead.phone && (
                            <p className="text-xs text-slate-400 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {lead.phone}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-600 capitalize">
                          {lead.insuranceType || '—'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={lead.status} />
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-600 capitalize">{lead.source}</span>
                      </TableCell>
                      <TableCell>
                        {lead.followUpDate ? (
                          <span className="text-sm text-slate-600">
                            {new Date(lead.followUpDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                            onClick={() => openEdit(lead)}
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => openNotes(lead)}
                            title="Notes"
                          >
                            <StickyNote className="w-4 h-4" />
                          </Button>
                          {isAdmin && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => deleteLead(lead.id)}
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
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

      {/* ── Edit Dialog ─────────────────────────────────────────────────────── */}
      <Dialog open={!!editLead} onOpenChange={(open) => !open && setEditLead(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-amber-500" />
              Edit Lead
            </DialogTitle>
          </DialogHeader>

          {editLead && (
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-slate-800">{editLead.name}</p>
                <p className="text-sm text-slate-500">{editLead.email}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Status</Label>
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="CONTACTED">Contacted</SelectItem>
                    <SelectItem value="QUALIFIED">Qualified</SelectItem>
                    <SelectItem value="CONVERTED">Converted</SelectItem>
                    <SelectItem value="LOST">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Follow Up Date</Label>
                <Input
                  type="date"
                  className="mt-1"
                  value={editFollowUp}
                  onChange={(e) => setEditFollowUp(e.target.value)}
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Assigned To</Label>
                <Input
                  className="mt-1"
                  value={editAssignedTo}
                  onChange={(e) => setEditAssignedTo(e.target.value)}
                  placeholder="Admin name..."
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Notes</Label>
                <Textarea
                  className="mt-1"
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Internal notes..."
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditLead(null)}>
              Cancel
            </Button>
            <Button
              className="bg-amber-500 hover:bg-amber-600 text-white"
              onClick={saveEdit}
              disabled={editLoading}
            >
              {editLoading && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Notes Dialog ────────────────────────────────────────────────────── */}
      <Dialog open={!!notesLead} onOpenChange={(open) => !open && setNotesLead(null)}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <StickyNote className="w-5 h-5 text-amber-500" />
              Notes — {notesLead?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Add note form */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Add Note</Label>
              <Textarea
                rows={2}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write a note..."
              />
              <Button
                size="sm"
                className="bg-amber-500 hover:bg-amber-600 text-white"
                onClick={addNote}
                disabled={!newNote.trim() || noteLoading}
              >
                {noteLoading ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                ) : (
                  <Plus className="w-3.5 h-3.5 mr-1" />
                )}
                Add Note
              </Button>
            </div>

            {/* Notes list */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {leadNotes.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">No notes yet</p>
              ) : (
                leadNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-100"
                  >
                    <p className="text-sm text-slate-700">{note.content}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                      <span>{note.author?.name || 'Unknown'}</span>
                      <span>·</span>
                      <span>
                        {new Date(note.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
