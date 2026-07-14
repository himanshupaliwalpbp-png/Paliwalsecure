'use client';

import { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  Zap,
  Cloud,
  Server,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/auth-store';
import Link from 'next/link';

export default function DatabaseSetupPage() {
  const { accessToken } = useAuthStore();
  const [dbStatus, setDbStatus] = useState<{ dbConnected: boolean; databaseType: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    fetch('/api/admin/db-status', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setDbStatus({ dbConnected: d.dbConnected, databaseType: d.databaseType });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [accessToken]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div>
        <Link href="/admin/dashboard" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-3">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Database className="w-7 h-7 text-blue-500" />
          Database Setup
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Set up PostgreSQL to enable lead management, reviews, analytics, and all admin features.
        </p>
      </div>

      {/* ── Status Card ────────────────────────────────────────────────────── */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className={`h-1 ${dbStatus?.dbConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              <p className="text-sm text-slate-600">Checking database connection...</p>
            </div>
          ) : dbStatus?.dbConnected ? (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Database Connected</p>
                <p className="text-sm text-slate-500">
                  Type: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">{dbStatus.databaseType}</code>
                  {' · '}All admin features are active.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900">Database Not Connected</p>
                <p className="text-sm text-slate-500 mt-1">
                  You're running in <strong>demo mode</strong>. The admin panel shows sample data.
                  To save real leads, reviews, and settings, you need to connect a PostgreSQL database.
                </p>
                <Badge variant="outline" className="mt-2 bg-amber-50 text-amber-700 border-amber-200">
                  Current: {dbStatus?.databaseType || 'unknown'} — not supported on Vercel
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Why PostgreSQL? ────────────────────────────────────────────────── */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            Why PostgreSQL?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 mb-4">
            Vercel serverless functions don't have a persistent filesystem, so SQLite (file-based) doesn't work in production.
            PostgreSQL is the industry standard — it's fast, reliable, and works perfectly with Vercel.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { icon: Cloud, title: 'Cloud-hosted', desc: 'No server maintenance' },
              { icon: Zap, title: 'Fast', desc: '<10ms latency from Vercel' },
              { icon: Server, title: 'Scalable', desc: 'Handles millions of records' },
            ].map((f, i) => (
              <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <f.icon className="w-4 h-4 text-blue-500 mb-2" />
                <p className="text-sm font-medium text-slate-800">{f.title}</p>
                <p className="text-xs text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Setup Wizard: Neon (recommended) ───────────────────────────────── */}
      <Card className="border-2 border-blue-200 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-gradient-to-bl from-blue-500 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
          ⭐ RECOMMENDED
        </div>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Database className="w-4 h-4 text-white" />
            </div>
            Option 1: Neon Postgres (Free, 2 minutes)
          </CardTitle>
          <CardDescription>
            Serverless PostgreSQL with generous free tier — perfect for Paliwal Secure.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="space-y-3">
            {[
              {
                title: 'Create a Neon account',
                desc: 'Sign up at neon.tech with GitHub or Google',
                link: 'https://neon.tech',
                linkText: 'Go to Neon.tech',
              },
              {
                title: 'Create a new project',
                desc: 'Click "New Project" → name it "paliwal-secure" → pick region "AWS Asia Pacific (Mumbai)" for lowest latency',
              },
              {
                title: 'Copy the connection string',
                desc: 'On the project dashboard, find "Connection string" — it looks like postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require',
              },
              {
                title: 'Set DATABASE_URL in Vercel',
                desc: 'Vercel → Project → Settings → Environment Variables → add DATABASE_URL with the Neon connection string → set for Production, Preview, Development',
              },
              {
                title: 'Update Prisma schema provider',
                desc: 'Change provider from "sqlite" to "postgresql" in prisma/schema.prisma (or use the multi-provider approach below)',
              },
              {
                title: 'Run database migration',
                desc: 'After deploy: npx prisma db push (or use Vercel build hook to auto-migrate)',
              },
              {
                title: 'Redeploy on Vercel',
                desc: 'Vercel → Deployments → latest → Redeploy. Admin panel will now save real data.',
              },
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div className="flex-1 pt-0.5">
                  <p className="text-sm font-medium text-slate-800">{step.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                  {step.link && (
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1"
                    >
                      {step.linkText} <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* ── Option 2: Vercel Postgres ──────────────────────────────────────── */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Cloud className="w-4 h-4 text-slate-700" />
            Option 2: Vercel Postgres (Native integration)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ol className="space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-slate-400">1.</span> Vercel Dashboard → Project → Storage tab</li>
            <li className="flex gap-2"><span className="text-slate-400">2.</span> Click "Create Database" → Postgres (free tier: 60h compute, 256MB storage)</li>
            <li className="flex gap-2"><span className="text-slate-400">3.</span> Click "Connect to Project" — Vercel auto-adds DATABASE_URL env var</li>
            <li className="flex gap-2"><span className="text-slate-400">4.</span> Update Prisma schema provider to "postgresql"</li>
            <li className="flex gap-2"><span className="text-slate-400">5.</span> Redeploy</li>
          </ol>
        </CardContent>
      </Card>

      {/* ── Prisma schema code ─────────────────────────────────────────────── */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-base">Update Prisma Schema</CardTitle>
          <CardDescription>Change the provider in <code className="bg-slate-100 px-1 rounded">prisma/schema.prisma</code></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs overflow-x-auto font-mono">
{`datasource db {
  provider = "postgresql"  // was "sqlite"
  url      = env("DATABASE_URL")
}`}
            </pre>
            <button
              onClick={() => copyToClipboard(`datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}`, 'prisma')}
              className="absolute top-2 right-2 p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200"
              aria-label="Copy"
            >
              {copied === 'prisma' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            ⚠️ This is a code change. Push to GitHub, then Vercel will auto-deploy.
          </p>
        </CardContent>
      </Card>

      {/* ── Need help? ─────────────────────────────────────────────────────── */}
      <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-slate-700 mb-3">
            Need help with database setup? Himanshu Paliwal will personally assist you.
          </p>
          <a href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              💬 WhatsApp Himanshu for Help
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
