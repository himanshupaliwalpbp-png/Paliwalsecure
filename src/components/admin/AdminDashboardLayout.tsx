"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  Star,
  Users,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/auth-store";

// ── Navigation items ────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Reviews",
    href: "/admin/dashboard/reviews",
    icon: Star,
  },
  {
    label: "Leads",
    href: "/admin/dashboard/leads",
    icon: Users,
  },
  {
    label: "Content",
    href: "/admin/dashboard/content",
    icon: FileText,
  },
  {
    label: "Analytics",
    href: "/admin/dashboard/analytics",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/admin/dashboard/settings",
    icon: Settings,
  },
] as const;

// ── Sidebar Content (shared between desktop & mobile) ───────────────────────
function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleNav = (href: string) => {
    router.push(href);
    onNavigate?.();
  };

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
    onNavigate?.();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col h-full">
      {/* ── Sidebar Header ─────────────────────────────────────────────── */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-bold text-lg leading-tight truncate">
              Paliwal Secure
            </h2>
            <Badge
              variant="secondary"
              className="mt-0.5 bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px] px-1.5 py-0"
            >
              Admin
            </Badge>
          </div>
        </div>
      </div>

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin/dashboard" &&
              pathname.startsWith(item.href));

          return (
            <button
              key={item.href}
              onClick={() => handleNav(item.href)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white border border-transparent"
              }`}
            >
              <item.icon
                className={`w-5 h-5 shrink-0 ${
                  isActive ? "text-amber-400" : "text-slate-400 group-hover:text-slate-200"
                }`}
              />
              <span className="truncate">{item.label}</span>
              {isActive && (
                <ChevronRight className="w-4 h-4 ml-auto text-amber-400/60" />
              )}
            </button>
          );
        })}
      </nav>

      {/* ── User Info ──────────────────────────────────────────────────── */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9 border border-slate-600">
            <AvatarFallback className="bg-slate-700 text-slate-200 text-xs font-semibold">
              {user?.name ? getInitials(user.name) : "AD"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name || "Admin User"}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {user?.email || "admin@paliwalsecure.com"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <Badge
            variant="outline"
            className="text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
          >
            {user?.role || "ADMIN"}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="ml-auto h-7 text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="w-3.5 h-3.5 mr-1" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard Layout Component ─────────────────────────────────────────
export function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuthStore();

  // Derive page title from pathname
  const getPageTitle = () => {
    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    if (lastSegment === "admin" || lastSegment === "dashboard") {
      return "Dashboard";
    }

    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ── Desktop Sidebar ─────────────────────────────────────────────── */}
      <aside className="hidden lg:flex lg:w-[280px] lg:flex-col lg:fixed lg:inset-y-0 bg-slate-900 border-r border-slate-800 z-30">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar (Sheet) ──────────────────────────────────────── */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-[280px] bg-slate-900 border-slate-800">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* ── Main Content Area ───────────────────────────────────────────── */}
      <div className="flex-1 lg:pl-[280px]">
        {/* ── Top Bar ──────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            {/* Mobile menu button + Page title */}
            <div className="flex items-center gap-3">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden h-9 w-9"
                  >
                    <Menu className="w-5 h-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
              </Sheet>

              <div>
                <h1 className="text-lg font-semibold text-slate-900">
                  {getPageTitle()}
                </h1>
              </div>
            </div>

            {/* User avatar */}
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8 border border-slate-200">
                <AvatarFallback className="bg-amber-100 text-amber-700 text-xs font-semibold">
                  {user?.name ? getInitials(user.name) : "AD"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* ── Page Content ─────────────────────────────────────────────── */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
