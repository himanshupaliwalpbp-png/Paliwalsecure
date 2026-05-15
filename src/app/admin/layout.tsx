"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { AdminDashboardLayout } from "@/components/admin/AdminDashboardLayout";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, initialize } = useAuthStore();
  const initRef = useRef(false);

  // Initialize auth store once on mount — restore from localStorage or try refresh
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    try {
      initialize();
    } catch {
      // Silently fail
    }
  }, [initialize]);

  // Login page is rendered without the dashboard shell
  const isLoginPage = pathname === "/admin/login";

  // Redirect unauthenticated users to login (except when already on login)
  useEffect(() => {
    if (!isLoginPage && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isLoginPage, isAuthenticated, router]);

  // Login page renders directly without dashboard chrome
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Not authenticated — show loading (will redirect to login via effect above)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Authenticated pages get the dashboard layout
  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}
