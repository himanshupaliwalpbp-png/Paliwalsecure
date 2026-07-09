"use client";

import { useState, useEffect } from "react";
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
  ClipboardList,
  ShieldCheck,
  Phone,
  Zap,
  Database,
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
import { AdminNotificationCenter } from "./AdminNotificationCenter";

// ── Navigation items ────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Dashboard",  href: "/admin/dashboard",                icon: LayoutDashboard, group: "Overview" },
  { label: "Leads",      href: "/admin/dashboard/leads",          icon: Users,           group: "Sales" },
  { label: "Callbacks",  href: "/admin/dashboard/callbacks",      icon: Phone,           group: "Sales" },
  { label: "Reviews",    href: "/admin/dashboard/reviews",        icon: Star,            group: "Content" },
  { label: "Content",    href: "/admin/dashboard/content",        icon: FileText,        group: "Content" },
  { label: "Analytics",  href: "/admin/dashboard/analytics",      icon: BarChart3,       group: "Insights" },
  { label: "Audit Logs", href: "/admin/dashboard/audit-logs",     icon: ClipboardList,   group: "Insights" },
  { label: "Security",   href: "/admin/dashboard/security",       icon: ShieldCheck,     group: "System" },
  { label: "Database",   href: "/admin/dashboard/setup",          icon: Database,        group: "System" },
  { label: "Settings",   href: "/admin/dashboard/settings",       icon: Settings,        group: "System" },
] as const;

const NAV_GROUPS = ["Overview", "Sales", "Content", "Insights", "System"] as const;

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

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Brand header */}
      <div className="p-5 border-b border-slate-800/70">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-bold text-base leading-tight">Paliwal Secure</h2>
            <p className="text-slate-400 text-[11px] mt-0.5">Admin Control Center</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto">
        {NAV_GROUPS.map(group => {
          const items = NAV_ITEMS.filter(i => i.group === group);
          if (items.length === 0) return null;
          return (
            <div key={group} className="mb-4">
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">{group}</p>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const isActive = pathname === item.href ||
                    (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
                  return (
                    <button
                      key={item.href}
                      onClick={() => handleNav(item.href)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 group relative ${
                        isActive
                          ? "bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-300 border border-amber-500/30 shadow-sm"
                          : "text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-amber-400 rounded-r-full" />
                      )}
                      <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-amber-300" : "text-slate-400 group-hover:text-slate-200"}`} />
                      <span className="truncate">{item.label}</span>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-amber-400/60" />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User card */}
      <div className="p-3 border-t border-slate-800/70">
        <div className="rounded-xl bg-slate-800/50 p-3 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-2.5">
            <Avatar className="w-9 h-9 border border-slate-600 shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-800 text-slate-200 text-xs font-semibold">
                {user?.name ? getInitials(user.name) : "AD"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-white truncate">{user?.name || "Admin"}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email || "admin@paliwalsecure.com"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10 px-1.5 py-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
              {user?.role || "ADMIN"}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="ml-auto h-7 px-2 text-[11px] text-slate-400 hover:text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-3 h-3 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const { user } = useAuthStore();

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('en-IN', {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric',
        month: 'short',
      }));
    };
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  const getPageTitle = () => {
    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    if (lastSegment === "admin" || lastSegment === "dashboard") return "Dashboard";
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-[260px] lg:flex-col lg:fixed lg:inset-y-0 border-r border-slate-800 z-30 shadow-2xl shadow-slate-950/30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-[280px] border-slate-800">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 lg:pl-[260px] flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center gap-3 min-w-0">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9 shrink-0">
                    <Menu className="w-5 h-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
              </Sheet>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-base lg:text-lg font-semibold text-slate-900 truncate">
                    {getPageTitle()}
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-medium border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                  </span>
                </div>
                {currentTime && (
                  <p className="hidden sm:block text-[11px] text-slate-500 mt-0.5">{currentTime}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <AdminNotificationCenter />
              <Avatar className="w-8 h-8 border border-slate-200">
                <AvatarFallback className="bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 text-xs font-semibold">
                  {user?.name ? getInitials(user.name) : "AD"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">{children}</main>

        <footer className="border-t border-slate-200 bg-white py-3 px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} Paliwal Secure · IRDAI POSP IP429834 · Admin Panel v2.0</p>
            <p className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" />
              All actions are logged in audit trail
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
