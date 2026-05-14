'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Star,
  Search,
  CheckCircle2,
  XCircle,
  Flag,
  Trash2,
  ShieldCheck,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
interface Review {
  id: string;
  productName: string;
  insuranceType: string;
  rating: number;
  title: string;
  body: string;
  photoUrl: string | null;
  reviewerName: string;
  reviewerEmail: string;
  isVerifiedPurchase: boolean;
  status: string;
  helpfulYes: number;
  helpfulNo: number;
  adminNotes: string | null;
  createdAt: string;
  votes: { voteType: string }[];
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected' | 'flagged';

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'flagged', label: 'Flagged' },
];

const INSURANCE_TYPES = ['health', 'life', 'motor', 'travel', 'home'];

// ── Status badge helper ──────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { className: string }> = {
    pending: { className: 'bg-amber-100 text-amber-700 border-amber-200' },
    approved: { className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    rejected: { className: 'bg-red-100 text-red-700 border-red-200' },
    flagged: { className: 'bg-orange-100 text-orange-700 border-orange-200' },
  };
  const c = config[status] || { className: 'bg-slate-100 text-slate-700 border-slate-200' };
  return (
    <Badge variant="outline" className={`text-xs ${c.className}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

// ── Star display ─────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
          }`}
        />
      ))}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function ReviewsModerationPage() {
  const { accessToken, user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  // State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [insuranceType, setInsuranceType] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  // Detail dialog
  const [detailReview, setDetailReview] = useState<Review | null>(null);
  const [detailNotes, setDetailNotes] = useState('');
  const [detailStatus, setDetailStatus] = useState('');
  const [detailLoading, setDetailLoading] = useState(false);

  // ── Fetch reviews ──────────────────────────────────────────────────────
  const fetchReviews = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (insuranceType !== 'all') params.set('insuranceType', insuranceType);
      if (search) params.set('search', search);

      const res = await fetch(`/api/admin/reviews?${params}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      setReviews(data.reviews || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch {
      toast({ title: 'Error', description: 'Failed to load reviews', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [accessToken, page, statusFilter, insuranceType, search]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, insuranceType, search]);

  // ── Selection handlers ─────────────────────────────────────────────────
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === reviews.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(reviews.map((r) => r.id)));
    }
  };

  // ── Single review action ───────────────────────────────────────────────
  const updateReview = async (id: string, payload: Record<string, unknown>) => {
    if (!accessToken) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Update failed');
      toast({ title: 'Success', description: 'Review updated' });
      fetchReviews();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update review',
        variant: 'destructive',
      });
    }
  };

  const deleteReview = async (id: string) => {
    if (!accessToken || !isAdmin) return;
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Delete failed');
      toast({ title: 'Success', description: 'Review deleted' });
      fetchReviews();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to delete review',
        variant: 'destructive',
      });
    }
  };

  // ── Bulk action ────────────────────────────────────────────────────────
  const bulkAction = async (action: string) => {
    if (!accessToken || selectedIds.size === 0) return;
    if (action === 'delete' && !confirm(`Delete ${selectedIds.size} reviews?`)) return;

    setBulkLoading(true);
    try {
      const res = await fetch('/api/admin/reviews/bulk', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewIds: Array.from(selectedIds), action }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Bulk action failed');
      toast({
        title: 'Success',
        description: `${data.affected} review(s) updated`,
      });
      setSelectedIds(new Set());
      fetchReviews();
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

  // ── Detail dialog save ─────────────────────────────────────────────────
  const saveDetail = async () => {
    if (!detailReview) return;
    setDetailLoading(true);
    try {
      const payload: Record<string, unknown> = {};
      if (detailStatus !== detailReview.status) payload.status = detailStatus;
      if (detailNotes !== (detailReview.adminNotes || '')) payload.adminNotes = detailNotes;

      if (Object.keys(payload).length > 0) {
        await updateReview(detailReview.id, payload);
      }
      setDetailReview(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const openDetail = (review: Review) => {
    setDetailReview(review);
    setDetailNotes(review.adminNotes || '');
    setDetailStatus(review.status);
  };

  // ── Search handler ─────────────────────────────────────────────────────
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
            <Select value={insuranceType} onValueChange={setInsuranceType}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Insurance Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {INSURANCE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Input
                placeholder="Search reviews..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="max-w-sm"
              />
              <Button variant="outline" size="icon" onClick={handleSearch}>
                <Search className="w-4 h-4" />
              </Button>
            </div>
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
              className="text-emerald-700 border-emerald-300 hover:bg-emerald-50"
              onClick={() => bulkAction('approve')}
              disabled={bulkLoading}
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-700 border-red-300 hover:bg-red-50"
              onClick={() => bulkAction('reject')}
              disabled={bulkLoading}
            >
              <XCircle className="w-3.5 h-3.5 mr-1" />
              Reject
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-orange-700 border-orange-300 hover:bg-orange-50"
              onClick={() => bulkAction('flag')}
              disabled={bulkLoading}
            >
              <Flag className="w-3.5 h-3.5 mr-1" />
              Flag
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

      {/* ── Reviews Table ───────────────────────────────────────────────────── */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Star className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p>No reviews found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={selectedIds.size === reviews.length && reviews.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Reviewer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="max-w-[200px]">Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow
                      key={review.id}
                      className="cursor-pointer hover:bg-slate-50/50"
                      onClick={() => openDetail(review)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedIds.has(review.id)}
                          onCheckedChange={() => toggleSelect(review.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm text-slate-700">
                            {review.reviewerName}
                          </p>
                          <p className="text-xs text-slate-400">{review.reviewerEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm text-slate-700">{review.productName}</p>
                          <p className="text-xs text-slate-400 capitalize">
                            {review.insuranceType}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StarRating rating={review.rating} />
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <p className="text-sm text-slate-700 truncate">{review.title}</p>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={review.status} />
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {new Date(review.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          {review.status !== 'approved' && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              onClick={() => updateReview(review.id, { status: 'approved' })}
                              title="Approve"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                          )}
                          {review.status !== 'rejected' && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => updateReview(review.id, { status: 'rejected' })}
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          )}
                          {review.status !== 'flagged' && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                              onClick={() => updateReview(review.id, { status: 'flagged' })}
                              title="Flag"
                            >
                              <Flag className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() =>
                              updateReview(review.id, {
                                isVerifiedPurchase: !review.isVerifiedPurchase,
                              })
                            }
                            title={review.isVerifiedPurchase ? 'Unverify' : 'Mark Verified'}
                          >
                            <ShieldCheck
                              className={`w-4 h-4 ${
                                review.isVerifiedPurchase ? 'fill-blue-500' : ''
                              }`}
                            />
                          </Button>
                          {isAdmin && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => deleteReview(review.id)}
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

      {/* ── Review Detail Dialog ────────────────────────────────────────────── */}
      <Dialog open={!!detailReview} onOpenChange={(open) => !open && setDetailReview(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-500" />
              Review Details
            </DialogTitle>
          </DialogHeader>

          {detailReview && (
            <div className="space-y-4">
              {/* Review Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{detailReview.reviewerName}</p>
                    <p className="text-xs text-slate-400">{detailReview.reviewerEmail}</p>
                  </div>
                  <StatusBadge status={detailReview.status} />
                </div>

                <div className="flex items-center gap-3">
                  <StarRating rating={detailReview.rating} />
                  <span className="text-sm text-slate-500">{detailReview.rating}/5</span>
                </div>

                <div>
                  <p className="font-medium text-slate-800">{detailReview.title}</p>
                  <p className="text-sm text-slate-600 mt-1">{detailReview.body}</p>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>
                    Product: <strong>{detailReview.productName}</strong>
                  </span>
                  <span>
                    Type: <strong className="capitalize">{detailReview.insuranceType}</strong>
                  </span>
                </div>

                {detailReview.isVerifiedPurchase && (
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    Verified Purchase
                  </Badge>
                )}

                <div className="text-xs text-slate-400">
                  Created:{' '}
                  {new Date(detailReview.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>

              {/* Separator */}
              <div className="border-t" />

              {/* Admin Controls */}
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Select value={detailStatus} onValueChange={setDetailStatus}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="flagged">Flagged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Admin Notes</Label>
                  <Textarea
                    className="mt-1"
                    rows={3}
                    value={detailNotes}
                    onChange={(e) => setDetailNotes(e.target.value)}
                    placeholder="Add internal notes..."
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailReview(null)}>
              Cancel
            </Button>
            <Button
              className="bg-amber-500 hover:bg-amber-600 text-white"
              onClick={saveDetail}
              disabled={detailLoading}
            >
              {detailLoading && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
