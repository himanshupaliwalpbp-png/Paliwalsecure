'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from 'recharts';
import {
  Shield, Users, FileText, Scale, Calendar, Home, Plus, Search,
  Upload, Download, Phone, MessageCircle, ChevronRight, ChevronLeft,
  AlertTriangle, CheckCircle2, X, Loader2, Edit, Trash2, Eye,
  Car, Bike, Zap, IndianRupee, TrendingUp, ArrowRight, Camera,
  FileUp, Star, Award, BadgeCheck,
  Send, Clock, AlertCircle, Settings, Menu, Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

// ─── Types ───────────────────────────────────────────────────────────────────
type ViewType = 'dashboard' | 'clients' | 'policies' | 'compare' | 'renewals';

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
  policies?: Policy[];
}

interface Policy {
  id: string;
  clientId: string;
  clientName?: string;
  policyNumber: string;
  insurer: string;
  category: 'car' | 'bike' | 'ev_car' | 'ev_bike' | 'health' | 'term';
  vehicle: string;
  premium: number;
  odPremium: number;
  tpPremium: number;
  idv: number;
  ncb: number;
  addOns: string[];
  status: 'active' | 'expired' | 'lapsed';
  startDate: string;
  endDate: string;
  registrationNumber: string;
  fuelType: string;
  vehicleAge: string;
  commission: number;
}

interface DashboardData {
  totalClients: number;
  activePolicies: number;
  renewalsThisMonth: number;
  renewalPremiumValue: number;
  totalCommission: number;
  expiring7Days: number;
  expiring30Days: number;
  revenueChart: { month: string; premium: number }[];
  policyMix: { insurer: string; count: number }[];
  vehicleTypeSplit: { type: string; count: number }[];
  recentActivity: { id: string; client: string; policyNo: string; action: string; date: string }[];
  urgentRenewals: Policy[];
}

interface ComparisonResult {
  insurer: string;
  planName: string;
  basicOD: number;
  addOnCosts: Record<string, number>;
  tp: number;
  paCover: number;
  gst: number;
  totalPremium: number;
  csr: number;
  cashlessGarages: number;
  badge: 'Lowest Price' | 'Best Value' | 'Best Claims' | null;
}

interface AuditReport {
  healthScore: number;
  potentialSavings: number;
  redFlags: { issue: string; impact: string; severity: 'high' | 'medium' | 'low' }[];
  recommendations: string[];
  comparisonPlans: {
    insurer: string; planName: string; premium: number; idv: number;
    csr: number; cashlessGarages: number; addOnsIncluded: string[];
    keyFeatures: string[]; savings: number;
    badge: 'Best Value' | 'Lowest Price' | 'Best Coverage' | null;
  }[];
  aiInsights: {
    summary: string; isOverpaying: boolean; overpayingAmount: number;
    coverageGaps: string[]; moneySavingTips: string[];
    personalizedNote: string; detailedBreakdown?: string;
  } | null;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const CHART_COLORS = ['#f0b429', '#1E40AF', '#0D9488', '#dc2626', '#C98A1C', '#16a34a'];

const INSURERS = [
  'HDFC ERGO', 'ICICI Lombard', 'Bajaj Allianz', 'Acko',
  'TATA AIG', 'Digit', 'Niva Bupa', 'Star Health',
  'Care Health', 'New India Assurance', 'Magma HDI', 'Shriram',
  'Royal Sundaram', 'Liberty', 'Other',
];

const MOTOR_ADD_ONS = [
  'Zero Depreciation', 'Engine Cover', 'Roadside Assistance',
  'Return to Invoice', 'Consumables Cover', 'NCB Protection',
  'Passenger Cover', 'Key Replacement',
];

const EV_ADD_ONS = [
  ...MOTOR_ADD_ONS, 'Battery Degradation Cover', 'Charging Cable Cover',
  'Charging Station RSA', 'EV Motor Cover',
];

const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
const VEHICLE_TYPES = ['Car', 'Bike', 'EV Car', 'EV Bike'];
const ZONES = ['A (Metro)', 'B (Non-Metro)'];
const NCB_OPTIONS = ['0', '20', '25', '35', '45', '50'];

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

// ─── Helper Functions ────────────────────────────────────────────────────────
const formatCurrency = (n: number) => `₹${n.toLocaleString('en-IN')}`;
const formatDate = (d: string | Date) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const getDaysToExpiry = (endDate: string | Date) => Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
const getExpiryStatus = (days: number) => days < 0 ? 'EXPIRED' : days <= 7 ? 'CRITICAL' : days <= 30 ? 'WARNING' : 'ACTIVE';

function getScoreColor(score: number): string {
  if (score <= 40) return '#dc2626';
  if (score <= 60) return '#ea580c';
  if (score <= 80) return '#1E40AF';
  return '#16a34a';
}

function getScoreLabel(score: number): string {
  if (score <= 40) return 'Poor';
  if (score <= 60) return 'Fair';
  if (score <= 80) return 'Good';
  return 'Excellent';
}

// ─── Health Score Gauge Sub-component ────────────────────────────────────────
function HealthScoreGauge({ score }: { score: number }) {
  const color = getScoreColor(score);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative w-44 h-44 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#1e293b" strokeWidth="10" />
        <motion.circle
          cx="80" cy="80" r={radius} fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span className="text-4xl font-extrabold" style={{ color }}
          initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}>{score}</motion.span>
        <span className="text-xs font-medium text-slate-400 mt-1">{getScoreLabel(score)}</span>
      </div>
    </div>
  );
}

// ─── Skeleton Loaders ────────────────────────────────────────────────────────
function KPISkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="bg-[#131929] border-slate-700/50">
          <CardContent className="p-4"><Skeleton className="h-16 w-full bg-slate-700/50" /></CardContent>
        </Card>
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <Card className="bg-[#131929] border-slate-700/50">
      <CardContent className="p-4"><Skeleton className="h-64 w-full bg-slate-700/50" /></CardContent>
    </Card>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function InsuranceOS() {
  // ── Navigation State ────────────────────────────────────────────────────
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── Dashboard State ─────────────────────────────────────────────────────
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // ── Clients State ───────────────────────────────────────────────────────
  const [clients, setClients] = useState<Client[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', phone: '', email: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // ── Policies State ──────────────────────────────────────────────────────
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [policiesLoading, setPoliciesLoading] = useState(false);
  const [policySearch, setPolicySearch] = useState('');
  const [policyFilter, setPolicyFilter] = useState<string>('all');
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [policySubView, setPolicySubView] = useState<'list' | 'upload' | 'detail'>('list');

  // Upload & Audit state
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [extractionLoading, setExtractionLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditReport, setAuditReport] = useState<AuditReport | null>(null);
  const [auditForm, setAuditForm] = useState({
    policyType: '', insurer: '', vehicle: '', idv: '', premium: '',
    addOns: [] as string[], ncb: '', claimsLast3Years: '0', vehicleAge: '',
    name: '', mobile: '', email: '',
  });

  // ── Compare State ───────────────────────────────────────────────────────
  const [compareForm, setCompareForm] = useState({
    vehicleType: 'Car', fuelType: 'Petrol', idv: '500000', zone: 'A (Metro)',
    addOns: [] as string[], ncb: '0',
  });
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareResults, setCompareResults] = useState<ComparisonResult[]>([]);

  // ── Renewals State ──────────────────────────────────────────────────────
  const [renewals, setRenewals] = useState<Policy[]>([]);
  const [renewalsLoading, setRenewalsLoading] = useState(false);

  // ── Refs ────────────────────────────────────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Sidebar Nav Items ───────────────────────────────────────────────────
  const navItems: { key: ViewType; label: string; icon: typeof Home }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: Home },
    { key: 'clients', label: 'Clients', icon: Users },
    { key: 'policies', label: 'Policies', icon: FileText },
    { key: 'compare', label: 'Compare Insurers', icon: Scale },
    { key: 'renewals', label: 'Renewals', icon: Calendar },
  ];

  // ── Data Fetching ───────────────────────────────────────────────────────
  const fetchDashboard = useCallback(async () => {
    setDashboardLoading(true);
    try {
      const res = await fetch('/api/insuranceos/dashboard');
      if (res.ok) {
        const json = await res.json();
        const apiData = json.data || json;
        // Map API response to DashboardData format
        setDashboard({
          totalClients: apiData.totalClients || 0,
          activePolicies: apiData.activePolicies || 0,
          renewalsThisMonth: apiData.renewalsThisMonth || 0,
          renewalPremiumValue: apiData.renewalPremiumValue || 0,
          totalCommission: apiData.estimatedCommission || 0,
          expiring7Days: apiData.expiring7Days || 0,
          expiring30Days: apiData.expiring30Days || 0,
          revenueChart: apiData.monthlyPremiums || [],
          policyMix: (apiData.policyMix || []).map((p: { insurer: string; _count: { id: number } }) => ({
            insurer: p.insurer, count: p._count?.id || 0,
          })),
          vehicleTypeSplit: (apiData.categorySplit || []).map((p: { category: string; _count: { id: number } }) => ({
            type: p.category, count: p._count?.id || 0,
          })),
          recentActivity: (apiData.recentPolicies || []).map((p: { id: string; client: { name: string }; policyNo: string; insurer: string; createdAt: string }) => ({
            id: p.id, client: p.client?.name || 'Unknown', policyNo: p.policyNo,
            action: `Policy with ${p.insurer}`, date: p.createdAt,
          })),
          urgentRenewals: (apiData.urgentRenewals || []).map((p: { id: string; client: { name: string; phone: string }; policyNo: string; insurer: string; premium: number; totalPremium: number; odEndDate: string; vehicleMake: string; vehicleModel: string; registrationNo: string }) => ({
            id: p.id, clientId: '', clientName: p.client?.name || '',
            policyNumber: p.policyNo, insurer: p.insurer, category: 'car',
            vehicle: `${p.vehicleMake || ''} ${p.vehicleModel || ''}`.trim(),
            premium: p.totalPremium || p.premium, odPremium: 0, tpPremium: 0,
            idv: 0, ncb: 0, addOns: [], status: 'active',
            startDate: '', endDate: p.odEndDate || '',
            registrationNumber: p.registrationNo || '', fuelType: '', vehicleAge: '', commission: 0,
          })),
        });
      } else {
        setDashboard(generateDemoDashboard());
      }
    } catch {
      setDashboard(generateDemoDashboard());
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  const fetchClients = useCallback(async () => {
    setClientsLoading(true);
    try {
      const res = await fetch('/api/insuranceos/clients');
      if (res.ok) {
        const json = await res.json();
        const apiClients = json.data || json;
        const mapped: Client[] = Array.isArray(apiClients) ? apiClients.map((c: { id: string; name: string; phone: string; email: string | null; createdAt: string }) => ({
          id: c.id, name: c.name, phone: c.phone, email: c.email || '', createdAt: c.createdAt,
        })) : [];
        setClients(mapped.length > 0 ? mapped : generateDemoClients());
      } else { setClients(generateDemoClients()); }
    } catch { setClients(generateDemoClients()); }
    finally { setClientsLoading(false); }
  }, []);

  const fetchPolicies = useCallback(async () => {
    setPoliciesLoading(true);
    try {
      const res = await fetch('/api/insuranceos/policies');
      if (res.ok) {
        const json = await res.json();
        const apiPolicies = json.data || json;
        const mapped: Policy[] = Array.isArray(apiPolicies) ? apiPolicies.map((p: { id: string; clientId: string; client: { name: string }; policyNo: string; insurer: string; category: string; vehicleMake: string; vehicleModel: string; premium: number; totalPremium: number; idv: number; ncbPercent: number; addOns: string; status: string; odEndDate: string; registrationNo: string; fuelType: string }) => ({
          id: p.id, clientId: p.clientId, clientName: p.client?.name || '',
          policyNumber: p.policyNo, insurer: p.insurer,
          category: p.category || 'car', vehicle: `${p.vehicleMake || ''} ${p.vehicleModel || ''}`.trim(),
          premium: p.totalPremium || p.premium, odPremium: 0, tpPremium: 0,
          idv: p.idv || 0, ncb: p.ncbPercent || 0,
          addOns: p.addOns ? JSON.parse(p.addOns) : [],
          status: (p.status || 'ACTIVE').toLowerCase() as Policy['status'],
          startDate: '', endDate: p.odEndDate || '',
          registrationNumber: p.registrationNo || '', fuelType: p.fuelType || '', vehicleAge: '', commission: 0,
        })) : [];
        setPolicies(mapped.length > 0 ? mapped : generateDemoPolicies());
      } else { setPolicies(generateDemoPolicies()); }
    } catch { setPolicies(generateDemoPolicies()); }
    finally { setPoliciesLoading(false); }
  }, []);

  const fetchRenewals = useCallback(async () => {
    setRenewalsLoading(true);
    try {
      const res = await fetch('/api/insuranceos/policies');
      if (res.ok) {
        const json = await res.json();
        const apiPolicies = json.data || json;
        if (Array.isArray(apiPolicies) && apiPolicies.length > 0) {
          const mapped: Policy[] = apiPolicies.map((p: { id: string; clientId: string; client: { name: string }; policyNo: string; insurer: string; category: string; vehicleMake: string; vehicleModel: string; premium: number; totalPremium: number; idv: number; ncbPercent: number; addOns: string; status: string; odEndDate: string; registrationNo: string; fuelType: string }) => ({
            id: p.id, clientId: p.clientId, clientName: p.client?.name || '',
            policyNumber: p.policyNo, insurer: p.insurer,
            category: p.category || 'car', vehicle: `${p.vehicleMake || ''} ${p.vehicleModel || ''}`.trim(),
            premium: p.totalPremium || p.premium, odPremium: 0, tpPremium: 0,
            idv: p.idv || 0, ncb: p.ncbPercent || 0,
            addOns: p.addOns ? JSON.parse(p.addOns) : [],
            status: (p.status || 'ACTIVE').toLowerCase() as Policy['status'],
            startDate: '', endDate: p.odEndDate || '',
            registrationNumber: p.registrationNo || '', fuelType: p.fuelType || '', vehicleAge: '', commission: 0,
          }));
          setRenewals(mapped.filter(p => getDaysToExpiry(p.endDate) <= 60));
        } else {
          const demo = generateDemoPolicies();
          setRenewals(demo.filter(p => getDaysToExpiry(p.endDate) <= 60));
        }
      } else {
        const demo = generateDemoPolicies();
        setRenewals(demo.filter(p => getDaysToExpiry(p.endDate) <= 60));
      }
    } catch {
      const demo = generateDemoPolicies();
      setRenewals(demo.filter(p => getDaysToExpiry(p.endDate) <= 60));
    }
    finally { setRenewalsLoading(false); }
  }, []);

  // Load data on view change
  useEffect(() => {
    if (currentView === 'dashboard' && !dashboard) fetchDashboard();
    if (currentView === 'clients' && clients.length === 0) fetchClients();
    if (currentView === 'policies' && policies.length === 0) fetchPolicies();
    if (currentView === 'renewals' && renewals.length === 0) fetchRenewals();
  }, [currentView, dashboard, clients.length, policies.length, renewals.length, fetchDashboard, fetchClients, fetchPolicies, fetchRenewals]);

  // ── Client CRUD ─────────────────────────────────────────────────────────
  const handleAddClient = useCallback(async () => {
    if (!newClient.name || !newClient.phone) return;
    try {
      const res = await fetch('/api/insuranceos/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      });
      if (res.ok) {
        const client = await res.json();
        setClients(prev => [...prev, client]);
      } else {
        // Add locally
        const local: Client = {
          id: `local-${Date.now()}`, ...newClient, createdAt: new Date().toISOString(), policies: [],
        };
        setClients(prev => [...prev, local]);
      }
    } catch {
      const local: Client = {
        id: `local-${Date.now()}`, ...newClient, createdAt: new Date().toISOString(), policies: [],
      };
      setClients(prev => [...prev, local]);
    }
    setNewClient({ name: '', phone: '', email: '' });
    setShowAddClient(false);
  }, [newClient]);

  const handleDeleteClient = useCallback(async (id: string) => {
    try {
      await fetch(`/api/insuranceos/clients/${id}`, { method: 'DELETE' });
    } catch { /* local fallback */ }
    setClients(prev => prev.filter(c => c.id !== id));
    if (selectedClient?.id === id) setSelectedClient(null);
    setDeleteConfirm(null);
  }, [selectedClient]);

  // ── File Upload & VLM Extraction ────────────────────────────────────────
  const processFile = useCallback(async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) return;
    if (file.size > MAX_FILE_SIZE) return;
    setExtractionLoading(true);
    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      const base64 = dataUrl.split(',')[1];
      const isPDF = file.type === 'application/pdf';
      if (!isPDF) setUploadedFile(dataUrl);

      try {
        const body = isPDF
          ? { pdfBase64: base64, fileType: 'pdf' }
          : { imageBase64: base64, mimeType: file.type, fileType: 'image' };

        const res = await fetch('/api/audit/extract', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (data.success && data.data) {
          const ext = data.data;
          setAuditForm(prev => ({
            ...prev,
            policyType: ext.policyType || prev.policyType,
            insurer: ext.insurer || prev.insurer,
            vehicle: ext.vehicle || prev.vehicle,
            idv: ext.idv ? String(ext.idv) : prev.idv,
            premium: ext.premium ? String(ext.premium) : (ext.totalPremium ? String(ext.totalPremium) : prev.premium),
            addOns: Array.isArray(ext.addOns) ? ext.addOns : prev.addOns,
            ncb: ext.ncb ? String(ext.ncb) : prev.ncb,
            name: ext.policyholderName || prev.name,
          }));
        }
      } catch { /* extraction failed, user fills manually */ }
      finally { setExtractionLoading(false); }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  // ── Audit Submit ────────────────────────────────────────────────────────
  const handleAuditSubmit = useCallback(async () => {
    setAuditLoading(true);
    try {
      const body: Record<string, unknown> = {
        policyType: auditForm.policyType || 'car',
        insurer: auditForm.insurer,
        premium: Number(auditForm.premium),
        addOns: auditForm.addOns,
        claimsLast3Years: Number(auditForm.claimsLast3Years),
        name: auditForm.name, mobile: auditForm.mobile, email: auditForm.email,
        vehicle: auditForm.vehicle, idv: Number(auditForm.idv),
        ncb: Number(auditForm.ncb), vehicleAge: auditForm.vehicleAge,
      };

      const res = await fetch('/api/audit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setAuditReport({
          healthScore: data.healthScore || 65,
          potentialSavings: data.potentialSavings || 0,
          redFlags: data.redFlags || [],
          recommendations: data.recommendations || [],
          comparisonPlans: data.comparisonPlans || [],
          aiInsights: data.aiInsights || null,
        });
        setPolicySubView('detail');
      }
    } catch { /* audit failed */ }
    finally { setAuditLoading(false); }
  }, [auditForm]);

  // ── Compare Submit ──────────────────────────────────────────────────────
  const handleCompareSubmit = useCallback(async () => {
    setCompareLoading(true);
    try {
      const res = await fetch('/api/insuranceos/compare', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleType: compareForm.vehicleType.includes('Bike') ? 'two_wheeler' : 'four_wheeler',
          fuelType: compareForm.fuelType.toUpperCase(),
          idv: Number(compareForm.idv),
          zone: compareForm.zone.startsWith('A') ? 'A' : 'B',
          addOns: compareForm.addOns,
          ncbPercent: Number(compareForm.ncb),
        }),
      });
      if (res.ok) {
        const json = await res.json();
        const apiResults = json.data || json.results || [];
        const mapped: ComparisonResult[] = Array.isArray(apiResults) ? apiResults.map((r: { insurer: string; totalOD: number; tpPremium: number; paCover: number; gst: number; totalPremium: number; csr: number; cashlessGarages: number; badge: string | null; basicOD: number; addOns: { name: string; premium: number }[] }) => ({
          insurer: r.insurer, planName: `Comprehensive`,
          basicOD: r.basicOD || r.totalOD || 0,
          addOnCosts: Object.fromEntries((r.addOns || []).map((a: { name: string; premium: number }) => [a.name, a.premium])),
          tp: r.tpPremium || 0, paCover: r.paCover || 0, gst: r.gst || 0,
          totalPremium: r.totalPremium || 0, csr: r.csr || 95,
          cashlessGarages: r.cashlessGarages || 0,
          badge: r.badge as ComparisonResult['badge'],
        })) : [];
        setCompareResults(mapped.length > 0 ? mapped : generateDemoComparison());
      } else {
        setCompareResults(generateDemoComparison());
      }
    } catch {
      setCompareResults(generateDemoComparison());
    }
    finally { setCompareLoading(false); }
  }, [compareForm]);

  // ── WhatsApp Reminder ───────────────────────────────────────────────────
  const sendWhatsAppReminder = useCallback((policy: Policy) => {
    const days = getDaysToExpiry(policy.endDate);
    const message = `Hello! 🙏 Your vehicle insurance policy (${policy.policyNumber}) with ${policy.insurer} is expiring in ${days} days on ${formatDate(policy.endDate)}. Please renew to stay protected. — InsuranceOS`;
    window.open(`https://wa.me/91${policy.registrationNumber ? '919876543210' : '919876543210'}?text=${encodeURIComponent(message)}`, '_blank');
  }, []);

  // ── PDF Downloads ───────────────────────────────────────────────────────
  const downloadAuditPDF = useCallback(() => {
    if (!auditReport) return;
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 14;
    const contentW = pageW - margin * 2;
    let y = 20;

    const addText = (text: string, size: number, style: string, color: [number, number, number] = [0, 0, 0]) => {
      doc.setFontSize(size); doc.setFont('helvetica', style as 'bold' | 'normal' | 'italic');
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(text, contentW);
      if (y + lines.length * (size * 0.5) > 270) { doc.addPage(); y = 20; }
      doc.text(lines, margin, y); y += lines.length * (size * 0.45) + 3;
    };

    // Header
    doc.setFillColor(30, 64, 175); doc.rect(0, 0, pageW, 35, 'F');
    doc.setTextColor(255, 255, 255); doc.setFontSize(18); doc.setFont('helvetica', 'bold');
    doc.text('Insurance Audit Report', margin, 15);
    doc.setFontSize(9); doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${formatDate(new Date().toISOString())}`, margin, 25);
    y = 42;

    addText(`Health Score: ${auditReport.healthScore}/100 — ${getScoreLabel(auditReport.healthScore)}`, 14, 'bold',
      getScoreColor(auditReport.healthScore).startsWith('#16') ? [22, 163, 74] : getScoreColor(auditReport.healthScore).startsWith('#dc') ? [220, 38, 38] : [30, 64, 175]);
    addText(`Potential Savings: ${formatCurrency(auditReport.potentialSavings)}/year`, 11, 'normal', [22, 163, 74]);
    y += 5;

    if (auditReport.redFlags.length > 0) {
      addText('RED FLAGS', 13, 'bold', [220, 38, 38]);
      auditReport.redFlags.forEach(f => {
        addText(`${f.severity === 'high' ? '🔴' : f.severity === 'medium' ? '🟠' : '🟡'} ${f.issue}`, 10, 'bold');
        addText(`   Impact: ${f.impact}`, 9, 'normal', [100, 100, 100]);
      });
      y += 3;
    }

    if (auditReport.recommendations.length > 0) {
      addText('RECOMMENDATIONS', 13, 'bold', [30, 64, 175]);
      auditReport.recommendations.forEach((r, i) => addText(`${i + 1}. ${r}`, 10, 'normal'));
      y += 3;
    }

    if (auditReport.comparisonPlans.length > 0) {
      addText('COMPARISON PLANS', 13, 'bold', [240, 180, 41]);
      auditReport.comparisonPlans.forEach((p, i) => {
        const badge = p.badge ? ` [${p.badge}]` : '';
        addText(`${i + 1}. ${p.insurer} - ${p.planName}${badge}`, 10, 'bold');
        addText(`   Premium: ${formatCurrency(p.premium)}/yr | CSR: ${p.csr}% | Savings: ${formatCurrency(p.savings)}/yr`, 9, 'normal');
      });
      y += 3;
    }

    if (auditReport.aiInsights) {
      addText('AI DEEP ANALYSIS', 13, 'bold', [124, 58, 237]);
      addText(auditReport.aiInsights.summary, 10, 'normal');
      if (auditReport.aiInsights.isOverpaying) {
        addText(`OVERPAYING: ~${formatCurrency(auditReport.aiInsights.overpayingAmount)}/year`, 11, 'bold', [220, 38, 38]);
      }
      if (auditReport.aiInsights.coverageGaps.length > 0) {
        addText('Coverage Gaps:', 10, 'bold');
        auditReport.aiInsights.coverageGaps.forEach(g => addText(`• ${g}`, 9, 'normal'));
      }
      if (auditReport.aiInsights.moneySavingTips.length > 0) {
        addText('Money Saving Tips:', 10, 'bold');
        auditReport.aiInsights.moneySavingTips.forEach(t => addText(`• ${t}`, 9, 'normal'));
      }
    }

    doc.save(`Insurance-Audit-${new Date().toISOString().split('T')[0]}.pdf`);
  }, [auditReport]);

  const downloadComparisonPDF = useCallback(() => {
    if (compareResults.length === 0) return;
    const doc = new jsPDF('landscape');
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 14;
    let y = 20;

    doc.setFillColor(30, 64, 175); doc.rect(0, 0, pageW, 30, 'F');
    doc.setTextColor(255, 255, 255); doc.setFontSize(16); doc.setFont('helvetica', 'bold');
    doc.text('Insurance Comparison Report', margin, 18);
    y = 38;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9); doc.setFont('helvetica', 'bold');
    const cols = ['Insurer', 'Basic OD', 'TP', 'PA Cover', 'GST', 'Total', 'CSR', 'Garages', 'Badge'];
    const colX = [margin, margin + 40, margin + 70, margin + 95, margin + 120, margin + 148, margin + 178, margin + 200, margin + 228];
    cols.forEach((c, i) => doc.text(c, colX[i], y));
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    compareResults.forEach((r) => {
      if (y > 190) { doc.addPage(); y = 20; }
      doc.text(r.insurer.substring(0, 18), colX[0], y);
      doc.text(formatCurrency(r.basicOD), colX[1], y);
      doc.text(formatCurrency(r.tp), colX[2], y);
      doc.text(formatCurrency(r.paCover), colX[3], y);
      doc.text(formatCurrency(r.gst), colX[4], y);
      doc.text(formatCurrency(r.totalPremium), colX[5], y);
      doc.text(`${r.csr}%`, colX[6], y);
      doc.text(String(r.cashlessGarages), colX[7], y);
      doc.text(r.badge || '-', colX[8], y);
      y += 5;
    });

    doc.save(`Insurance-Comparison-${new Date().toISOString().split('T')[0]}.pdf`);
  }, [compareResults]);

  // ── Filtered Data ───────────────────────────────────────────────────────
  const filteredClients = useMemo(() => {
    if (!clientSearch) return clients;
    const q = clientSearch.toLowerCase();
    return clients.filter(c =>
      c.name.toLowerCase().includes(q) || c.phone.includes(q)
    );
  }, [clients, clientSearch]);

  const filteredPolicies = useMemo(() => {
    let result = policies;
    if (policySearch) {
      const q = policySearch.toLowerCase();
      result = result.filter(p =>
        p.policyNumber.toLowerCase().includes(q) ||
        p.clientName?.toLowerCase().includes(q) ||
        p.insurer.toLowerCase().includes(q)
      );
    }
    if (policyFilter !== 'all') {
      result = result.filter(p => p.status === policyFilter || p.category === policyFilter);
    }
    return result;
  }, [policies, policySearch, policyFilter]);

  // ── Render: Sidebar ─────────────────────────────────────────────────────
  const renderSidebar = () => (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileSidebar && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setMobileSidebar(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 left-0 h-full z-50 bg-[#0b0f1a] border-r border-slate-800/60 flex flex-col transition-all duration-300
          ${sidebarOpen ? 'w-60' : 'w-16'}
          ${mobileSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800/60">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shrink-0 shadow-lg shadow-amber-600/25">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-lg font-extrabold text-white tracking-tight">
              Insurance<span className="text-amber-400">OS</span>
            </motion.span>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map(item => {
            const isActive = currentView === item.key;
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => { setCurrentView(item.key); setMobileSidebar(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-amber-500/15 text-amber-400 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-amber-400' : ''}`} />
                {sidebarOpen && <span>{item.label}</span>}
                {isActive && sidebarOpen && <ChevronRight className="w-4 h-4 ml-auto text-amber-400/60" />}
              </button>
            );
          })}
        </nav>

        {/* Collapse toggle (desktop) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex items-center justify-center p-3 border-t border-slate-800/60 text-slate-500 hover:text-white transition-colors"
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </motion.aside>
    </>
  );

  // ── Render: Dashboard View ──────────────────────────────────────────────
  const renderDashboard = () => {
    if (dashboardLoading) return (
      <div className="space-y-6">
        <KPISkeleton />
        <div className="grid lg:grid-cols-2 gap-6"><ChartSkeleton /><ChartSkeleton /></div>
      </div>
    );

    if (!dashboard) return (
      <div className="text-center py-20 text-slate-400">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Unable to load dashboard data</p>
        <Button variant="outline" onClick={fetchDashboard} className="mt-3">Retry</Button>
      </div>
    );

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Total Clients', value: dashboard.totalClients, icon: Users, color: '#f0b429' },
            { label: 'Active Policies', value: dashboard.activePolicies, icon: FileText, color: '#1E40AF' },
            { label: 'Renewals This Month', value: `${dashboard.renewalsThisMonth}`, sub: formatCurrency(dashboard.renewalPremiumValue), icon: Calendar, color: '#0D9488' },
            { label: 'Total Commission', value: formatCurrency(dashboard.totalCommission), icon: IndianRupee, color: '#16a34a' },
            { label: 'Expiring 7 Days', value: dashboard.expiring7Days, icon: AlertTriangle, color: '#dc2626' },
            { label: 'Expiring 30 Days', value: dashboard.expiring30Days, icon: Clock, color: '#ea580c' },
          ].map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="bg-[#131929] border-slate-700/50 hover:border-slate-600/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400 font-medium">{kpi.label}</span>
                    <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
                  </div>
                  <p className="text-xl font-bold text-white">{kpi.value}</p>
                  {kpi.sub && <p className="text-xs text-slate-500 mt-0.5">{kpi.sub}</p>}
                  {(kpi.label.includes('7 Days') || kpi.label.includes('30 Days')) && (
                    <Badge className={`mt-1 text-[10px] px-1.5 py-0 ${kpi.label.includes('7') ? 'bg-red-500/15 text-red-400' : 'bg-orange-500/15 text-orange-400'}`}>
                      {kpi.label.includes('7') ? '🔴 Urgent' : '🟡 Warning'}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card className="bg-[#131929] border-slate-700/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-200">Revenue Trend (12 Months)</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={dashboard.revenueChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}K`} />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ background: '#131929', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' }} />
                  <Line type="monotone" dataKey="premium" stroke="#f0b429" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Policy Mix Pie */}
          <Card className="bg-[#131929] border-slate-700/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-200">Policy Mix by Insurer</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={dashboard.policyMix} dataKey="count" nameKey="insurer" cx="50%" cy="50%" outerRadius={80}
                    label={({ insurer, count }: { insurer: string; count: number }) => `${insurer.split(' ')[0]} (${count})`}>
                    {dashboard.policyMix.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#131929', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Type Split */}
        <Card className="bg-[#131929] border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-200">Vehicle Type Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dashboard.vehicleTypeSplit}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="type" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#131929', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {dashboard.vehicleTypeSplit.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity + Urgent Renewals */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="bg-[#131929] border-slate-700/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-200">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                {dashboard.recentActivity.map((act, i) => (
                  <div key={act.id || i} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-200 truncate">{act.client} — {act.action}</p>
                      <p className="text-[10px] text-slate-500">{act.policyNo} • {formatDate(act.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Urgent Renewals */}
          <Card className="bg-[#131929] border-slate-700/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" /> Urgent Renewals
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                {dashboard.urgentRenewals.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">No urgent renewals</p>
                ) : dashboard.urgentRenewals.map((p, i) => {
                  const days = getDaysToExpiry(p.endDate);
                  return (
                    <div key={p.id || i} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                      <Badge className={`shrink-0 text-[10px] ${days <= 7 ? 'bg-red-500/15 text-red-400' : 'bg-orange-500/15 text-orange-400'}`}>
                        {days}d
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-200 truncate">{p.clientName} — {p.vehicle}</p>
                        <p className="text-[10px] text-slate-500">{p.insurer} • {formatCurrency(p.premium)}</p>
                      </div>
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-green-400 hover:text-green-300 hover:bg-green-500/10"
                        onClick={() => sendWhatsAppReminder(p)}>
                        <MessageCircle className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    );
  };

  // ── Render: Clients View ────────────────────────────────────────────────
  const renderClients = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search by name or phone..." value={clientSearch}
            onChange={e => setClientSearch(e.target.value)}
            className="pl-10 bg-[#131929] border-slate-700/50 text-white placeholder:text-slate-500" />
        </div>
        <Dialog open={showAddClient} onOpenChange={setShowAddClient}>
          <DialogTrigger asChild>
            <Button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold gap-2">
              <Plus className="w-4 h-4" /> Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#131929] border-slate-700/50 text-white">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label className="text-slate-300 text-sm">Full Name *</Label>
                <Input value={newClient.name} onChange={e => setNewClient(p => ({ ...p, name: e.target.value }))}
                  className="bg-[#0b0f1a] border-slate-700/50 text-white mt-1" placeholder="Rahul Sharma" />
              </div>
              <div>
                <Label className="text-slate-300 text-sm">Phone *</Label>
                <Input value={newClient.phone} onChange={e => setNewClient(p => ({ ...p, phone: e.target.value }))}
                  className="bg-[#0b0f1a] border-slate-700/50 text-white mt-1" placeholder="9876543210" />
              </div>
              <div>
                <Label className="text-slate-300 text-sm">Email</Label>
                <Input value={newClient.email} onChange={e => setNewClient(p => ({ ...p, email: e.target.value }))}
                  className="bg-[#0b0f1a] border-slate-700/50 text-white mt-1" placeholder="rahul@example.com" />
              </div>
              <Button onClick={handleAddClient} className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                Add Client
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Client List */}
      {clientsLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-[#131929] border-slate-700/50">
              <CardContent className="p-4"><Skeleton className="h-24 w-full bg-slate-700/50" /></CardContent>
            </Card>
          ))}
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No clients found</p>
          <p className="text-sm text-slate-500 mt-1">Add your first client to get started</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client, i) => {
            const clientPolicies = policies.filter(p => p.clientId === client.id);
            const totalPremium = clientPolicies.reduce((s, p) => s + p.premium, 0);
            const nextRenewal = clientPolicies
              .filter(p => new Date(p.endDate) > new Date())
              .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())[0];
            return (
              <motion.div key={client.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className="bg-[#131929] border-slate-700/50 hover:border-amber-500/30 transition-all cursor-pointer group"
                  onClick={() => setSelectedClient(selectedClient?.id === client.id ? null : client)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center">
                          <Users className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{client.name}</p>
                          <p className="text-xs text-slate-400">{client.phone}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-400 hover:text-red-400"
                          onClick={e => { e.stopPropagation(); setDeleteConfirm(client.id); }}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                      <div className="bg-slate-800/30 rounded-lg p-1.5">
                        <p className="text-xs text-slate-400">Policies</p>
                        <p className="text-sm font-bold text-white">{clientPolicies.length}</p>
                      </div>
                      <div className="bg-slate-800/30 rounded-lg p-1.5">
                        <p className="text-xs text-slate-400">Premium</p>
                        <p className="text-sm font-bold text-white">{totalPremium > 0 ? formatCurrency(totalPremium) : '—'}</p>
                      </div>
                      <div className="bg-slate-800/30 rounded-lg p-1.5">
                        <p className="text-xs text-slate-400">Next Renewal</p>
                        <p className="text-[11px] font-bold text-white">{nextRenewal ? formatDate(nextRenewal.endDate) : '—'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Expanded client detail */}
                <AnimatePresence>
                  {selectedClient?.id === client.id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <Card className="bg-[#0e1322] border-slate-700/30 border-t-0 rounded-t-none">
                        <CardContent className="p-4">
                          <p className="text-xs font-semibold text-slate-300 mb-2">Client Policies</p>
                          {clientPolicies.length === 0 ? (
                            <p className="text-xs text-slate-500">No policies yet</p>
                          ) : (
                            <div className="space-y-2">
                              {clientPolicies.map(p => (
                                <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/30 text-xs">
                                  <div>
                                    <span className="text-slate-200 font-medium">{p.insurer}</span>
                                    <span className="text-slate-500 ml-2">{p.policyNumber}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge className={`text-[9px] ${p.status === 'active' ? 'bg-green-500/15 text-green-400' : p.status === 'expired' ? 'bg-red-500/15 text-red-400' : 'bg-orange-500/15 text-orange-400'}`}>
                                      {p.status}
                                    </Badge>
                                    <span className="text-amber-400 font-medium">{formatCurrency(p.premium)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Delete confirmation */}
                <Dialog open={deleteConfirm === client.id} onOpenChange={() => setDeleteConfirm(null)}>
                  <DialogContent className="bg-[#131929] border-slate-700/50 text-white">
                    <DialogHeader>
                      <DialogTitle>Delete Client?</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-slate-400">Are you sure you want to delete <strong className="text-white">{client.name}</strong>? This action cannot be undone.</p>
                    <div className="flex gap-3 pt-2">
                      <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1 border-slate-700">Cancel</Button>
                      <Button onClick={() => handleDeleteClient(client.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white">Delete</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );

  // ── Render: Policies View ───────────────────────────────────────────────
  const renderPolicies = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Sub-view tabs */}
      <Tabs value={policySubView} onValueChange={v => setPolicySubView(v as typeof policySubView)}>
        <TabsList className="bg-[#131929] border border-slate-700/50">
          <TabsTrigger value="list" className="data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-400">
            <FileText className="w-3.5 h-3.5 mr-1" /> All Policies
          </TabsTrigger>
          <TabsTrigger value="upload" className="data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-400">
            <Upload className="w-3.5 h-3.5 mr-1" /> Upload & Audit
          </TabsTrigger>
          {selectedPolicy && (
            <TabsTrigger value="detail" className="data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-400">
              <Eye className="w-3.5 h-3.5 mr-1" /> Detail
            </TabsTrigger>
          )}
        </TabsList>

        {/* ─── Policy List ─── */}
        <TabsContent value="list">
          <div className="space-y-4">
            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="Search policy number, client, insurer..."
                  value={policySearch} onChange={e => setPolicySearch(e.target.value)}
                  className="pl-10 bg-[#131929] border-slate-700/50 text-white placeholder:text-slate-500" />
              </div>
              <Select value={policyFilter} onValueChange={setPolicyFilter}>
                <SelectTrigger className="w-44 bg-[#131929] border-slate-700/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#131929] border-slate-700/50">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="lapsed">Lapsed</SelectItem>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="bike">Bike</SelectItem>
                  <SelectItem value="ev_car">EV Car</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {policiesLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="bg-[#131929] border-slate-700/50">
                    <CardContent className="p-4"><Skeleton className="h-32 w-full bg-slate-700/50" /></CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredPolicies.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No policies found</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPolicies.map((p, i) => {
                  const days = getDaysToExpiry(p.endDate);
                  const status = getExpiryStatus(days);
                  return (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                      <Card className="bg-[#131929] border-slate-700/50 hover:border-amber-500/30 transition-all cursor-pointer"
                        onClick={() => { setSelectedPolicy(p); setPolicySubView('detail'); }}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="text-sm font-semibold text-white">{p.clientName || 'Unknown'}</p>
                              <p className="text-[11px] text-slate-500">{p.policyNumber}</p>
                            </div>
                            <Badge className={`text-[9px] ${status === 'ACTIVE' ? 'bg-green-500/15 text-green-400' : status === 'CRITICAL' ? 'bg-red-500/15 text-red-400' : status === 'WARNING' ? 'bg-orange-500/15 text-orange-400' : 'bg-slate-500/15 text-slate-400'}`}>
                              {status}
                            </Badge>
                          </div>
                          <div className="space-y-1.5 text-xs">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Insurer</span>
                              <span className="text-slate-200 font-medium">{p.insurer}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Premium</span>
                              <span className="text-amber-400 font-semibold">{formatCurrency(p.premium)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">OD Expiry</span>
                              <span className={`font-medium ${days <= 7 ? 'text-red-400' : days <= 30 ? 'text-orange-400' : 'text-slate-200'}`}>
                                {formatDate(p.endDate)}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>

        {/* ─── Upload & Audit ─── */}
        <TabsContent value="upload">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* File Upload Area */}
            <Card className="bg-[#131929] border-slate-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-amber-400" /> Upload Policy Document
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  Upload a photo or PDF of your policy — AI will auto-extract details
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!uploadedFile && !extractionLoading ? (
                  <div
                    onDrop={handleDrop} onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all
                      ${dragOver ? 'border-amber-500 bg-amber-500/5 scale-[1.01]' : 'border-slate-700/50 hover:border-amber-500/30 bg-slate-800/20'}`}
                  >
                    <Upload className="w-10 h-10 mx-auto text-slate-500 mb-3" />
                    <p className="text-sm text-slate-300 font-medium">Drag & drop your policy document</p>
                    <p className="text-xs text-slate-500 mt-1">Photo (JPEG, PNG, WebP) or PDF • Max 10MB</p>
                    <Button variant="outline" size="sm" className="mt-4 border-slate-600 text-slate-300 hover:text-white">
                      <FileUp className="w-4 h-4 mr-2" /> Choose File
                    </Button>
                    <input ref={fileInputRef} type="file" accept={ACCEPTED_TYPES.join(',')} className="hidden"
                      onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); }} />
                  </div>
                ) : (
                  <div className="text-center p-6">
                    {extractionLoading ? (
                      <>
                        <Loader2 className="w-8 h-8 mx-auto text-amber-400 animate-spin mb-3" />
                        <p className="text-sm text-slate-300">Extracting policy details with AI...</p>
                        <p className="text-xs text-slate-500 mt-1">{uploadedFileName}</p>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-8 h-8 mx-auto text-green-400 mb-3" />
                        <p className="text-sm text-slate-300">Document uploaded & processed</p>
                        <Button variant="ghost" size="sm" className="mt-2 text-slate-400"
                          onClick={() => { setUploadedFile(null); setUploadedFileName(null); }}>
                          <X className="w-4 h-4 mr-1" /> Remove
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Audit Form */}
            <Card className="bg-[#131929] border-slate-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                  <Edit className="w-5 h-5 text-blue-400" /> Policy Details
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  Review & edit the auto-filled details, then submit for AI audit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300 text-xs">Policy Type</Label>
                    <Select value={auditForm.policyType} onValueChange={v => setAuditForm(p => ({ ...p, policyType: v }))}>
                      <SelectTrigger className="bg-[#0b0f1a] border-slate-700/50 text-white mt-1">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#131929] border-slate-700/50">
                        <SelectItem value="car">Car Insurance</SelectItem>
                        <SelectItem value="bike">Bike Insurance</SelectItem>
                        <SelectItem value="ev_car">EV Car Insurance</SelectItem>
                        <SelectItem value="ev_bike">EV Bike Insurance</SelectItem>
                        <SelectItem value="health">Health Insurance</SelectItem>
                        <SelectItem value="term">Term Insurance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-300 text-xs">Insurer</Label>
                    <Select value={auditForm.insurer} onValueChange={v => setAuditForm(p => ({ ...p, insurer: v }))}>
                      <SelectTrigger className="bg-[#0b0f1a] border-slate-700/50 text-white mt-1">
                        <SelectValue placeholder="Select insurer" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#131929] border-slate-700/50">
                        {INSURERS.map(ins => <SelectItem key={ins} value={ins}>{ins}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-300 text-xs">Vehicle / Plan Name</Label>
                    <Input value={auditForm.vehicle} onChange={e => setAuditForm(p => ({ ...p, vehicle: e.target.value }))}
                      className="bg-[#0b0f1a] border-slate-700/50 text-white mt-1" placeholder="e.g. Hyundai Creta SX" />
                  </div>
                  <div>
                    <Label className="text-slate-300 text-xs">IDV / Sum Insured</Label>
                    <Input type="number" value={auditForm.idv} onChange={e => setAuditForm(p => ({ ...p, idv: e.target.value }))}
                      className="bg-[#0b0f1a] border-slate-700/50 text-white mt-1" placeholder="500000" />
                  </div>
                  <div>
                    <Label className="text-slate-300 text-xs">Annual Premium (₹)</Label>
                    <Input type="number" value={auditForm.premium} onChange={e => setAuditForm(p => ({ ...p, premium: e.target.value }))}
                      className="bg-[#0b0f1a] border-slate-700/50 text-white mt-1" placeholder="15000" />
                  </div>
                  <div>
                    <Label className="text-slate-300 text-xs">NCB %</Label>
                    <Select value={auditForm.ncb} onValueChange={v => setAuditForm(p => ({ ...p, ncb: v }))}>
                      <SelectTrigger className="bg-[#0b0f1a] border-slate-700/50 text-white mt-1">
                        <SelectValue placeholder="Select NCB" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#131929] border-slate-700/50">
                        {NCB_OPTIONS.map(n => <SelectItem key={n} value={n}>{n}%</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-300 text-xs">Vehicle Age</Label>
                    <Select value={auditForm.vehicleAge} onValueChange={v => setAuditForm(p => ({ ...p, vehicleAge: v }))}>
                      <SelectTrigger className="bg-[#0b0f1a] border-slate-700/50 text-white mt-1">
                        <SelectValue placeholder="Select age" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#131929] border-slate-700/50">
                        <SelectItem value="< 1 year">&lt; 1 year</SelectItem>
                        <SelectItem value="1-2 years">1-2 years</SelectItem>
                        <SelectItem value="2-3 years">2-3 years</SelectItem>
                        <SelectItem value="3-5 years">3-5 years</SelectItem>
                        <SelectItem value="5-7 years">5-7 years</SelectItem>
                        <SelectItem value="7+ years">7+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-300 text-xs">Your Name</Label>
                    <Input value={auditForm.name} onChange={e => setAuditForm(p => ({ ...p, name: e.target.value }))}
                      className="bg-[#0b0f1a] border-slate-700/50 text-white mt-1" placeholder="Rahul Sharma" />
                  </div>
                  <div>
                    <Label className="text-slate-300 text-xs">Mobile Number</Label>
                    <Input value={auditForm.mobile} onChange={e => setAuditForm(p => ({ ...p, mobile: e.target.value }))}
                      className="bg-[#0b0f1a] border-slate-700/50 text-white mt-1" placeholder="9876543210" />
                  </div>
                </div>

                {/* Add-ons */}
                <div>
                  <Label className="text-slate-300 text-xs mb-2 block">Add-ons / Riders</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(auditForm.policyType?.startsWith('ev') ? EV_ADD_ONS : MOTOR_ADD_ONS).map(addon => (
                      <label key={addon} className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 cursor-pointer transition-colors">
                        <Checkbox checked={auditForm.addOns.includes(addon)}
                          onCheckedChange={() => setAuditForm(prev => ({
                            ...prev,
                            addOns: prev.addOns.includes(addon)
                              ? prev.addOns.filter(a => a !== addon)
                              : [...prev.addOns, addon],
                          }))} />
                        <span className="text-xs text-slate-300">{addon}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button onClick={handleAuditSubmit} disabled={auditLoading}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold h-11">
                  {auditLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</> : <><Shield className="w-4 h-4 mr-2" /> Run AI Audit</>}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── Policy Detail / Audit Report ─── */}
        <TabsContent value="detail">
          {selectedPolicy && !auditReport ? (
            <Card className="bg-[#131929] border-slate-700/50 max-w-2xl mx-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">{selectedPolicy.policyNumber}</CardTitle>
                    <CardDescription className="text-slate-400">{selectedPolicy.clientName} — {selectedPolicy.insurer}</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-300"
                    onClick={() => { setPolicySubView('upload'); }}>
                    <Upload className="w-4 h-4 mr-1" /> Run Audit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  ['Category', selectedPolicy.category.toUpperCase()],
                  ['Vehicle', selectedPolicy.vehicle],
                  ['Premium', formatCurrency(selectedPolicy.premium)],
                  ['IDV', formatCurrency(selectedPolicy.idv)],
                  ['NCB', `${selectedPolicy.ncb}%`],
                  ['Status', selectedPolicy.status.toUpperCase()],
                  ['Start Date', formatDate(selectedPolicy.startDate)],
                  ['End Date', formatDate(selectedPolicy.endDate)],
                  ['Add-ons', selectedPolicy.addOns.join(', ') || 'None'],
                  ['Commission (est.)', formatCurrency(selectedPolicy.commission)],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-1.5 border-b border-slate-800/50">
                    <span className="text-xs text-slate-400">{label}</span>
                    <span className="text-xs text-white font-medium">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : auditReport ? (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Health Score */}
              <Card className="bg-[#131929] border-slate-700/50">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-white mb-4">Policy Health Score</h3>
                    <HealthScoreGauge score={auditReport.healthScore} />
                    {auditReport.potentialSavings > 0 && (
                      <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                        <p className="text-sm text-green-400 font-semibold">
                          💰 Potential Savings: {formatCurrency(auditReport.potentialSavings)}/year
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Red Flags */}
              {auditReport.redFlags.length > 0 && (
                <Card className="bg-[#131929] border-red-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-red-400 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Red Flags
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {auditReport.redFlags.map((flag, i) => (
                      <div key={i} className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                        <p className="text-sm text-white font-medium">{flag.severity === 'high' ? '🔴' : flag.severity === 'medium' ? '🟠' : '🟡'} {flag.issue}</p>
                        <p className="text-xs text-slate-400 mt-1">{flag.impact}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Recommendations */}
              {auditReport.recommendations.length > 0 && (
                <Card className="bg-[#131929] border-blue-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-blue-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1.5">
                    {auditReport.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-slate-200">
                        <span className="text-blue-400 mt-0.5 shrink-0">•</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Comparison Plans */}
              {auditReport.comparisonPlans.length > 0 && (
                <Card className="bg-[#131929] border-amber-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                      <Scale className="w-4 h-4" /> Comparison Plans (Lowest Premium First)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {auditReport.comparisonPlans
                        .sort((a, b) => a.premium - b.premium)
                        .map((plan, i) => (
                          <div key={i} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <span className="text-sm text-white font-semibold">{plan.insurer}</span>
                                <span className="text-xs text-slate-400 ml-2">{plan.planName}</span>
                              </div>
                              {plan.badge && (
                                <Badge className={`text-[9px] ${plan.badge === 'Lowest Price' ? 'bg-green-500/15 text-green-400' : plan.badge === 'Best Value' ? 'bg-amber-500/15 text-amber-400' : 'bg-blue-500/15 text-blue-400'}`}>
                                  <Star className="w-2.5 h-2.5 mr-1" /> {plan.badge}
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div><span className="text-slate-400">Premium:</span> <span className="text-amber-400 font-bold">{formatCurrency(plan.premium)}</span></div>
                              <div><span className="text-slate-400">IDV:</span> <span className="text-white">{formatCurrency(plan.idv)}</span></div>
                              <div><span className="text-slate-400">Savings:</span> <span className="text-green-400 font-bold">{formatCurrency(plan.savings)}</span></div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* AI Deep Analysis */}
              {auditReport.aiInsights && (
                <Card className="bg-[#131929] border-purple-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-purple-400 flex items-center gap-2">
                      <Zap className="w-4 h-4" /> AI Deep Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-slate-200">{auditReport.aiInsights.summary}</p>
                    {auditReport.aiInsights.isOverpaying && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                        <p className="text-sm text-red-400 font-semibold">
                          ⚠️ Overpaying by ~{formatCurrency(auditReport.aiInsights.overpayingAmount)}/year
                        </p>
                      </div>
                    )}
                    {auditReport.aiInsights.coverageGaps.length > 0 && (
                      <div>
                        <p className="text-xs text-slate-300 font-semibold mb-1">Coverage Gaps:</p>
                        {auditReport.aiInsights.coverageGaps.map((g, i) => (
                          <p key={i} className="text-xs text-red-300 ml-2">• {g}</p>
                        ))}
                      </div>
                    )}
                    {auditReport.aiInsights.moneySavingTips.length > 0 && (
                      <div>
                        <p className="text-xs text-slate-300 font-semibold mb-1">Money Saving Tips:</p>
                        {auditReport.aiInsights.moneySavingTips.map((t, i) => (
                          <p key={i} className="text-xs text-green-300 ml-2">• {t}</p>
                        ))}
                      </div>
                    )}
                    {auditReport.aiInsights.personalizedNote && (
                      <p className="text-xs text-slate-400 italic mt-2">💡 {auditReport.aiInsights.personalizedNote}</p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Download PDF */}
              <Button onClick={downloadAuditPDF} className="w-full bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-900 hover:to-blue-700 text-white font-semibold h-11">
                <Download className="w-4 h-4 mr-2" /> Download Audit Report (PDF)
              </Button>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400">
              <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Select a policy to view details</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );

  // ── Render: Compare View ────────────────────────────────────────────────
  const renderCompare = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Card className="bg-[#131929] border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-400" /> Compare Insurers
          </CardTitle>
          <CardDescription className="text-slate-400">
            Enter vehicle details to compare premiums across 6 insurers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-slate-300 text-xs">Vehicle Type</Label>
              <Select value={compareForm.vehicleType} onValueChange={v => setCompareForm(p => ({ ...p, vehicleType: v }))}>
                <SelectTrigger className="bg-[#0b0f1a] border-slate-700/50 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#131929] border-slate-700/50">
                  {VEHICLE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-slate-300 text-xs">Fuel Type</Label>
              <Select value={compareForm.fuelType} onValueChange={v => setCompareForm(p => ({ ...p, fuelType: v }))}>
                <SelectTrigger className="bg-[#0b0f1a] border-slate-700/50 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#131929] border-slate-700/50">
                  {FUEL_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-slate-300 text-xs">IDV (₹)</Label>
              <Input type="number" value={compareForm.idv} onChange={e => setCompareForm(p => ({ ...p, idv: e.target.value }))}
                className="bg-[#0b0f1a] border-slate-700/50 text-white mt-1" />
            </div>
            <div>
              <Label className="text-slate-300 text-xs">Zone</Label>
              <Select value={compareForm.zone} onValueChange={v => setCompareForm(p => ({ ...p, zone: v }))}>
                <SelectTrigger className="bg-[#0b0f1a] border-slate-700/50 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#131929] border-slate-700/50">
                  {ZONES.map(z => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-slate-300 text-xs">NCB %</Label>
              <Select value={compareForm.ncb} onValueChange={v => setCompareForm(p => ({ ...p, ncb: v }))}>
                <SelectTrigger className="bg-[#0b0f1a] border-slate-700/50 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#131929] border-slate-700/50">
                  {NCB_OPTIONS.map(n => <SelectItem key={n} value={n}>{n}%</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Add-ons multi-select */}
          <div>
            <Label className="text-slate-300 text-xs mb-2 block">Add-ons (multi-select)</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {MOTOR_ADD_ONS.map(addon => (
                <label key={addon} className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 cursor-pointer transition-colors">
                  <Checkbox checked={compareForm.addOns.includes(addon)}
                    onCheckedChange={() => setCompareForm(prev => ({
                      ...prev,
                      addOns: prev.addOns.includes(addon)
                        ? prev.addOns.filter(a => a !== addon)
                        : [...prev.addOns, addon],
                    }))} />
                  <span className="text-xs text-slate-300">{addon}</span>
                </label>
              ))}
            </div>
          </div>

          <Button onClick={handleCompareSubmit} disabled={compareLoading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold h-11">
            {compareLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Comparing...</> : <><Scale className="w-4 h-4 mr-2" /> Compare Now</>}
          </Button>
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {compareResults.length > 0 && (
        <Card className="bg-[#131929] border-slate-700/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-base">Side-by-Side Comparison</CardTitle>
              <Button size="sm" variant="outline" onClick={downloadComparisonPDF}
                className="border-slate-600 text-slate-300 hover:text-white">
                <Download className="w-3.5 h-3.5 mr-1" /> PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left text-slate-400 py-2 px-2 font-medium">Feature</th>
                    {compareResults.map(r => (
                      <th key={r.insurer} className="text-center py-2 px-2">
                        <div className="flex flex-col items-center">
                          <span className="text-white font-semibold">{r.insurer.split(' ')[0]}</span>
                          {r.badge && (
                            <Badge className={`text-[8px] mt-0.5 px-1 ${r.badge === 'Lowest Price' ? 'bg-green-500/15 text-green-400' : r.badge === 'Best Value' ? 'bg-amber-500/15 text-amber-400' : 'bg-blue-500/15 text-blue-400'}`}>
                              <Award className="w-2 h-2 mr-0.5" /> {r.badge}
                            </Badge>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Basic OD', key: 'basicOD' },
                    { label: 'Third Party', key: 'tp' },
                    { label: 'PA Cover', key: 'paCover' },
                    { label: 'GST (18%)', key: 'gst' },
                    { label: 'Total Premium', key: 'totalPremium', bold: true },
                    { label: 'CSR', key: 'csr', suffix: '%' },
                    { label: 'Cashless Garages', key: 'cashlessGarages' },
                  ].map(row => (
                    <tr key={row.key} className="border-b border-slate-800/30">
                      <td className={`py-2 px-2 text-slate-400 ${row.bold ? 'font-bold text-white' : ''}`}>{row.label}</td>
                      {compareResults.map(r => {
                        const val = r[row.key as keyof ComparisonResult];
                        const isMin = row.key === 'totalPremium' && val === Math.min(...compareResults.map(x => x.totalPremium));
                        return (
                          <td key={r.insurer + row.key}
                            className={`text-center py-2 px-2 ${row.bold ? 'font-bold' : ''} ${isMin ? 'text-green-400' : 'text-white'}`}>
                            {typeof val === 'number'
                              ? row.suffix ? `${val}${row.suffix}` : formatCurrency(val)
                              : String(val)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {compareResults.length === 0 && !compareLoading && (
        <div className="text-center py-12 text-slate-400">
          <Scale className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Enter your vehicle details above to compare insurers</p>
        </div>
      )}
    </motion.div>
  );

  // ── Render: Renewals View ───────────────────────────────────────────────
  const renderRenewals = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Calendar-like header */}
      <Card className="bg-[#131929] border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" /> Upcoming Renewals
          </CardTitle>
          <CardDescription className="text-slate-400">
            Color-coded: 🔴 7 days • 🟡 30 days • 🟢 Active • ⚪ Expired
          </CardDescription>
        </CardHeader>
      </Card>

      {renewalsLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="bg-[#131929] border-slate-700/50">
              <CardContent className="p-4"><Skeleton className="h-12 w-full bg-slate-700/50" /></CardContent>
            </Card>
          ))}
        </div>
      ) : renewals.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No upcoming renewals</p>
        </div>
      ) : (
        <div className="space-y-2">
          {renewals
            .sort((a, b) => getDaysToExpiry(a.endDate) - getDaysToExpiry(b.endDate))
            .map((policy, i) => {
              const days = getDaysToExpiry(policy.endDate);
              const status = getExpiryStatus(days);
              const statusEmoji = status === 'CRITICAL' ? '🔴' : status === 'WARNING' ? '🟡' : status === 'ACTIVE' ? '🟢' : '⚪';
              const statusColor = status === 'CRITICAL' ? 'text-red-400' : status === 'WARNING' ? 'text-orange-400' : status === 'ACTIVE' ? 'text-green-400' : 'text-slate-400';

              return (
                <motion.div key={policy.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                  <Card className={`bg-[#131929] border-slate-700/50 hover:border-slate-600/50 transition-all ${status === 'CRITICAL' ? 'border-red-500/20' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-lg">{statusEmoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-white truncate">{policy.clientName}</p>
                              <Badge className={`text-[9px] ${status === 'CRITICAL' ? 'bg-red-500/15 text-red-400' : status === 'WARNING' ? 'bg-orange-500/15 text-orange-400' : status === 'ACTIVE' ? 'bg-green-500/15 text-green-400' : 'bg-slate-500/15 text-slate-400'}`}>
                                {status}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-400 truncate">
                              {policy.vehicle} • {policy.insurer} • {policy.policyNumber}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 sm:gap-6">
                          <div className="text-center">
                            <p className="text-[10px] text-slate-500">OD Expiry</p>
                            <p className={`text-xs font-medium ${statusColor}`}>{formatDate(policy.endDate)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-slate-500">Premium</p>
                            <p className="text-xs font-medium text-amber-400">{formatCurrency(policy.premium)}</p>
                          </div>
                          <div className="text-center min-w-[50px]">
                            <p className="text-[10px] text-slate-500">Days</p>
                            <p className={`text-sm font-bold ${statusColor}`}>{days < 0 ? 'Expired' : `${days}d`}</p>
                          </div>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-1.5 h-8 px-3 text-xs shrink-0"
                            onClick={() => sendWhatsAppReminder(policy)}>
                            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
        </div>
      )}
    </motion.div>
  );

  // ── View Title Map ──────────────────────────────────────────────────────
  const viewTitles: Record<ViewType, string> = {
    dashboard: 'Dashboard',
    clients: 'Clients',
    policies: 'Policies',
    compare: 'Compare Insurers',
    renewals: 'Renewals',
  };

  // ── Main Render ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white flex">
      {/* Custom scrollbar styling */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>

      {renderSidebar()}

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-60' : 'lg:ml-16'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#0b0f1a]/80 backdrop-blur-xl border-b border-slate-800/60">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="lg:hidden text-slate-400 hover:text-white"
                onClick={() => setMobileSidebar(!mobileSidebar)}>
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg font-bold text-white">{viewTitles[currentView]}</h1>
                <p className="text-[11px] text-slate-500">Insurance Agent Management Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/20 text-xs">
                <Shield className="w-3 h-3 mr-1" /> InsuranceOS Pro
              </Badge>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={currentView} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {currentView === 'dashboard' && renderDashboard()}
              {currentView === 'clients' && renderClients()}
              {currentView === 'policies' && renderPolicies()}
              {currentView === 'compare' && renderCompare()}
              {currentView === 'renewals' && renderRenewals()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// ─── Demo Data Generators ────────────────────────────────────────────────────
function generateDemoDashboard(): DashboardData {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  return {
    totalClients: 47,
    activePolicies: 83,
    renewalsThisMonth: 12,
    renewalPremiumValue: 184500,
    totalCommission: 42350,
    expiring7Days: 4,
    expiring30Days: 11,
    revenueChart: months.map((m, i) => ({
      month: m,
      premium: Math.round(120000 + Math.sin(i * 0.8) * 40000 + Math.random() * 20000),
    })),
    policyMix: [
      { insurer: 'HDFC ERGO', count: 18 },
      { insurer: 'ICICI Lombard', count: 15 },
      { insurer: 'Bajaj Allianz', count: 12 },
      { insurer: 'Acko', count: 10 },
      { insurer: 'TATA AIG', count: 8 },
      { insurer: 'Digit', count: 7 },
      { insurer: 'Others', count: 13 },
    ],
    vehicleTypeSplit: [
      { type: 'Petrol', count: 34 },
      { type: 'Diesel', count: 22 },
      { type: 'EV', count: 15 },
      { type: 'CNG', count: 12 },
    ],
    recentActivity: [
      { id: '1', client: 'Rahul Sharma', policyNo: 'HDFC-MOT-23456', action: 'Policy Renewed', date: new Date(now.getTime() - 86400000).toISOString() },
      { id: '2', client: 'Priya Patel', policyNo: 'ICICI-CAR-78901', action: 'New Policy Issued', date: new Date(now.getTime() - 172800000).toISOString() },
      { id: '3', client: 'Amit Kumar', policyNo: 'BAJAJ-BKE-34567', action: 'Claim Filed', date: new Date(now.getTime() - 259200000).toISOString() },
      { id: '4', client: 'Sunita Devi', policyNo: 'ACKO-EVC-11223', action: 'Policy Renewed', date: new Date(now.getTime() - 345600000).toISOString() },
      { id: '5', client: 'Vikram Singh', policyNo: 'TATA-HEA-44556', action: 'Endorsement', date: new Date(now.getTime() - 432000000).toISOString() },
      { id: '6', client: 'Meena Joshi', policyNo: 'DIG-MOT-66778', action: 'New Policy Issued', date: new Date(now.getTime() - 518400000).toISOString() },
      { id: '7', client: 'Arjun Reddy', policyNo: 'HDFC-CAR-99001', action: 'NCB Updated', date: new Date(now.getTime() - 604800000).toISOString() },
      { id: '8', client: 'Kavita Nair', policyNo: 'ICICI-HEA-22334', action: 'Premium Paid', date: new Date(now.getTime() - 691200000).toISOString() },
    ],
    urgentRenewals: generateDemoPolicies().filter(p => getDaysToExpiry(p.endDate) <= 30).slice(0, 5),
  };
}

function generateDemoClients(): Client[] {
  return [
    { id: 'c1', name: 'Rahul Sharma', phone: '9876543210', email: 'rahul@example.com', createdAt: '2024-01-15' },
    { id: 'c2', name: 'Priya Patel', phone: '9123456789', email: 'priya@example.com', createdAt: '2024-02-20' },
    { id: 'c3', name: 'Amit Kumar', phone: '9988776655', email: 'amit@example.com', createdAt: '2024-03-10' },
    { id: 'c4', name: 'Sunita Devi', phone: '8877665544', email: 'sunita@example.com', createdAt: '2024-04-05' },
    { id: 'c5', name: 'Vikram Singh', phone: '7766554433', email: 'vikram@example.com', createdAt: '2024-05-12' },
    { id: 'c6', name: 'Meena Joshi', phone: '6655443322', email: 'meena@example.com', createdAt: '2024-06-18' },
    { id: 'c7', name: 'Arjun Reddy', phone: '5544332211', email: 'arjun@example.com', createdAt: '2024-07-22' },
    { id: 'c8', name: 'Kavita Nair', phone: '4433221100', email: 'kavita@example.com', createdAt: '2024-08-30' },
  ];
}

function generateDemoPolicies(): Policy[] {
  const now = new Date();
  const clients = generateDemoClients();
  return [
    { id: 'p1', clientId: 'c1', clientName: 'Rahul Sharma', policyNumber: 'HDFC-MOT-23456', insurer: 'HDFC ERGO', category: 'car', vehicle: 'Hyundai Creta SX', premium: 18250, odPremium: 12400, tpPremium: 4216, idv: 850000, ncb: 35, addOns: ['Zero Depreciation', 'Roadside Assistance'], status: 'active', startDate: '2024-06-15', endDate: '2025-06-14', registrationNumber: 'DL01AB1234', fuelType: 'Petrol', vehicleAge: '3-5 years', commission: 1488 },
    { id: 'p2', clientId: 'c2', clientName: 'Priya Patel', policyNumber: 'ICICI-CAR-78901', insurer: 'ICICI Lombard', category: 'car', vehicle: 'Maruti Swift VXI', premium: 12400, odPremium: 8200, tpPremium: 3416, idv: 520000, ncb: 20, addOns: ['Zero Depreciation'], status: 'active', startDate: '2024-08-01', endDate: '2025-07-31', registrationNumber: 'MH02CD5678', fuelType: 'Petrol', vehicleAge: '1-2 years', commission: 984 },
    { id: 'p3', clientId: 'c3', clientName: 'Amit Kumar', policyNumber: 'BAJAJ-BKE-34567', insurer: 'Bajaj Allianz', category: 'bike', vehicle: 'Royal Enfield Classic 350', premium: 4850, odPremium: 2800, tpPremium: 1366, idv: 125000, ncb: 25, addOns: ['Engine Cover', 'Roadside Assistance'], status: 'active', startDate: '2024-03-20', endDate: '2025-03-19', registrationNumber: 'UP06EF9012', fuelType: 'Petrol', vehicleAge: '2-3 years', commission: 336 },
    { id: 'p4', clientId: 'c4', clientName: 'Sunita Devi', policyNumber: 'ACKO-EVC-11223', insurer: 'Acko', category: 'ev_car', vehicle: 'Tata Nexon EV XZ+', premium: 22100, odPremium: 15600, tpPremium: 4764, idv: 1200000, ncb: 0, addOns: ['Zero Depreciation', 'Battery Degradation Cover'], status: 'active', startDate: '2024-09-10', endDate: '2025-09-09', registrationNumber: 'KA03GH3456', fuelType: 'Electric', vehicleAge: '< 1 year', commission: 1872 },
    { id: 'p5', clientId: 'c5', clientName: 'Vikram Singh', policyNumber: 'TATA-HEA-44556', insurer: 'TATA AIG', category: 'health', vehicle: 'Health Plus', premium: 18500, odPremium: 18500, tpPremium: 0, idv: 500000, ncb: 0, addOns: ['Critical Illness Rider', 'Hospital Cash'], status: 'active', startDate: '2024-04-01', endDate: '2025-03-31', registrationNumber: '', fuelType: '', vehicleAge: '', commission: 2220 },
    { id: 'p6', clientId: 'c1', clientName: 'Rahul Sharma', policyNumber: 'DIG-MOT-66778', insurer: 'Digit', category: 'car', vehicle: 'Honda City ZX CVT', premium: 15800, odPremium: 10200, tpPremium: 4216, idv: 780000, ncb: 45, addOns: ['Zero Depreciation', 'Consumables Cover', 'NCB Protection'], status: 'active', startDate: '2024-11-01', endDate: '2025-10-31', registrationNumber: 'DL08IJ7890', fuelType: 'Petrol', vehicleAge: '3-5 years', commission: 1224 },
    { id: 'p7', clientId: 'c6', clientName: 'Meena Joshi', policyNumber: 'HDFC-CAR-99001', insurer: 'HDFC ERGO', category: 'car', vehicle: 'Kia Seltos HTX', premium: 19200, odPremium: 13000, tpPremium: 4764, idv: 900000, ncb: 20, addOns: ['Zero Depreciation', 'Return to Invoice'], status: 'active', startDate: new Date(now.getTime() + 5 * 86400000).toISOString().split('T')[0], endDate: new Date(now.getTime() + 5 * 86400000 + 365 * 86400000).toISOString().split('T')[0], registrationNumber: 'RJ14KL1234', fuelType: 'Diesel', vehicleAge: '1-2 years', commission: 1560 },
    { id: 'p8', clientId: 'c7', clientName: 'Arjun Reddy', policyNumber: 'ICICI-HEA-22334', insurer: 'ICICI Lombard', category: 'health', vehicle: 'Family Floater', premium: 32000, odPremium: 32000, tpPremium: 0, idv: 1000000, ncb: 0, addOns: ['Maternity Plus', 'OPD Cover'], status: 'active', startDate: '2024-07-01', endDate: '2025-06-30', registrationNumber: '', fuelType: '', vehicleAge: '', commission: 3840 },
    // Expiring soon policies
    { id: 'p9', clientId: 'c2', clientName: 'Priya Patel', policyNumber: 'BAJAJ-BKE-99887', insurer: 'Bajaj Allianz', category: 'bike', vehicle: 'Honda Activa 6G', premium: 2100, odPremium: 1050, tpPremium: 714, idv: 65000, ncb: 20, addOns: [], status: 'active', startDate: new Date(now.getTime() - 360 * 86400000).toISOString().split('T')[0], endDate: new Date(now.getTime() + 3 * 86400000).toISOString().split('T')[0], registrationNumber: 'GJ05MN5678', fuelType: 'Petrol', vehicleAge: '5-7 years', commission: 126 },
    { id: 'p10', clientId: 'c3', clientName: 'Amit Kumar', policyNumber: 'HDFC-CAR-55443', insurer: 'HDFC ERGO', category: 'car', vehicle: 'Tata Harrier XZA', premium: 24500, odPremium: 17500, tpPremium: 5564, idv: 1100000, ncb: 35, addOns: ['Zero Depreciation', 'Engine Cover', 'Roadside Assistance'], status: 'active', startDate: new Date(now.getTime() - 355 * 86400000).toISOString().split('T')[0], endDate: new Date(now.getTime() + 10 * 86400000).toISOString().split('T')[0], registrationNumber: 'TS09OP9012', fuelType: 'Diesel', vehicleAge: '2-3 years', commission: 2100 },
    { id: 'p11', clientId: 'c5', clientName: 'Vikram Singh', policyNumber: 'ACKO-BKE-33221', insurer: 'Acko', category: 'ev_bike', vehicle: 'Ather 450X', premium: 3600, odPremium: 2100, tpPremium: 607, idv: 95000, ncb: 0, addOns: ['Battery Degradation Cover'], status: 'active', startDate: new Date(now.getTime() - 340 * 86400000).toISOString().split('T')[0], endDate: new Date(now.getTime() + 25 * 86400000).toISOString().split('T')[0], registrationNumber: 'KA01QR3456', fuelType: 'Electric', vehicleAge: '1-2 years', commission: 252 },
    { id: 'p12', clientId: 'c8', clientName: 'Kavita Nair', policyNumber: 'DIG-HEA-77665', insurer: 'Digit', category: 'health', vehicle: 'Individual Health', premium: 8500, odPremium: 8500, tpPremium: 0, idv: 300000, ncb: 0, addOns: ['Personal Accident'], status: 'active', startDate: new Date(now.getTime() - 350 * 86400000).toISOString().split('T')[0], endDate: new Date(now.getTime() + 15 * 86400000).toISOString().split('T')[0], registrationNumber: '', fuelType: '', vehicleAge: '', commission: 1020 },
  ];
}

function generateDemoComparison(): ComparisonResult[] {
  const idv = Number(500000 || 500000);
  const baseODRate = 0.035;
  const tpBase = 3416;
  const paCover = 500;
  const gstRate = 0.18;

  const insurers = [
    { name: 'HDFC ERGO', rate: 0.038, csr: 97.8, garages: 13000, plan: 'Comprehensive' },
    { name: 'ICICI Lombard', rate: 0.036, csr: 96.5, garages: 9500, plan: 'Comprehensive' },
    { name: 'Bajaj Allianz', rate: 0.035, csr: 97.2, garages: 11000, plan: 'Comprehensive' },
    { name: 'Acko', rate: 0.028, csr: 98.1, garages: 5000, plan: 'Comprehensive' },
    { name: 'TATA AIG', rate: 0.037, csr: 96.8, garages: 10000, plan: 'Comprehensive' },
    { name: 'Digit', rate: 0.030, csr: 97.5, garages: 7500, plan: 'Comprehensive' },
  ];

  const results: ComparisonResult[] = insurers.map(ins => {
    const basicOD = Math.round(idv * ins.rate);
    const addOnCosts: Record<string, number> = { 'Zero Depreciation': Math.round(3500 + Math.random() * 1000) };
    const tp = tpBase;
    const addOnTotal = Object.values(addOnCosts).reduce((s, v) => s + v, 0);
    const subtotal = basicOD + tp + paCover + addOnTotal;
    const gst = Math.round(subtotal * gstRate);
    const totalPremium = subtotal + gst;

    return {
      insurer: ins.name,
      planName: ins.plan,
      basicOD,
      addOnCosts,
      tp,
      paCover,
      gst,
      totalPremium,
      csr: ins.csr,
      cashlessGarages: ins.garages,
      badge: null,
    };
  });

  // Assign badges
  const sorted = [...results].sort((a, b) => a.totalPremium - b.totalPremium);
  sorted[0].badge = 'Lowest Price';
  const bestValue = [...results].sort((a, b) => (b.csr * 1000 + b.cashlessGarages) / a.totalPremium - (a.csr * 1000 + a.cashlessGarages) / b.totalPremium);
  if (bestValue[0] !== sorted[0]) bestValue[0].badge = 'Best Value';
  const bestClaims = [...results].sort((a, b) => b.csr - a.csr);
  if (!bestClaims[0].badge) bestClaims[0].badge = 'Best Claims';

  return results;
}
