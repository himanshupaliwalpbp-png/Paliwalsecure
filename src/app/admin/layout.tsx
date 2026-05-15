"use client";

import { useEffect } from "react";
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
  const { isAuthenticated, initialize, isLoading } = useAuthStore();

  // Initialize auth store on mount — checks for refresh cookie
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Login page is rendered without the dashboard shell
  const isLoginPage = pathname === "/admin/login";

  // Redirect unauthenticated users to login (except when already on login)
  useEffect(() => {
    if (!isLoginPage && !isAuthenticated && !isLoading) {
      router.push("/admin/login");
    }
  }, [isLoginPage, isAuthenticated, isLoading, router]);

  // Show loading while checking auth
  if (isLoading && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-slate-400 text-sm">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Login page renders directly without dashboard chrome
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Authenticated pages get the dashboard layout
  if (isAuthenticated) {
    return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
  }

  // Fallback: still loading or redirecting
  return null;
}
