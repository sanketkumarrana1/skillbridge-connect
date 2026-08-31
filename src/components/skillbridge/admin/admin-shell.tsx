import { type ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  Award,
  Building2,
  CheckCircle2,
  ChevronRight,
  Database,
  FileCheck,
  FileSpreadsheet,
  GraduationCap,
  History,
  Home,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/context/app-state";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

interface AdminShellProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  {
    to: "/admin/dashboard",
    label: "Platform Overview",
    icon: LayoutDashboard,
  },
  {
    to: "/admin/users",
    label: "User Management",
    icon: Users,
  },
  {
    to: "/admin/companies",
    label: "Company Verifications",
    icon: Building2,
    badgeKey: "pendingVerifications",
  },
  {
    to: "/admin/institutions",
    label: "Universities & Colleges",
    icon: GraduationCap,
  },
  {
    to: "/admin/skills",
    label: "Skill Taxonomy Library",
    icon: Database,
  },
  {
    to: "/admin/opportunities",
    label: "Opportunity Moderation",
    icon: Layers,
    badgeKey: "pendingModerations",
  },
  {
    to: "/admin/moderation",
    label: "Platform Moderation Queue",
    icon: ShieldAlert,
  },
  {
    to: "/admin/reports",
    label: "Analytics & Reports",
    icon: FileSpreadsheet,
  },
  {
    to: "/admin/audit",
    label: "Admin Audit Trail",
    icon: History,
  },
];

export function AdminShell({ children }: AdminShellProps) {
  const { adminUser, logoutAdmin, platformMetrics } = useAppState();
  const { user, isConfigured, loading, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (loading) return;
    if (isConfigured) {
      if (!user) {
        navigate({ to: "/admin/login" });
      }
    } else {
      if (!adminUser) {
        navigate({ to: "/admin/login" });
      }
    }
  }, [adminUser, isConfigured, loading, navigate, user]);

  const handleLogout = async () => {
    if (isConfigured) {
      await signOut();
    }
    logoutAdmin();
    toast.info("Logged out of Admin Portal.");
    navigate({ to: "/admin/login" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090E] flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="size-4 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
          <span className="text-sm font-medium">Authorizing governance session...</span>
        </div>
      </div>
    );
  }

  if (isConfigured && !user) return null;
  if (!isConfigured && !adminUser) return null;

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Security Banner */}
      <header className="h-14 border-b border-white/10 bg-[#0B0E17]/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-rose-600 flex items-center justify-center text-white font-extrabold shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              <ShieldCheck className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-sm tracking-wider text-white flex items-center gap-1.5">
                AcadIn <span className="text-indigo-400 font-mono text-xs">ADMIN</span>
              </span>
              <span className="text-[9px] text-slate-400 font-mono tracking-tight uppercase">
                Enterprise Platform Console
              </span>
            </div>
          </Link>

          <Badge className="hidden sm:inline-flex border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-[10px] font-semibold py-0.5 px-2">
            <ShieldCheck className="size-3 mr-1" /> Superadmin Protected
          </Badge>
        </div>

        {/* Right Admin Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 border-r border-white/10 pr-3 text-xs text-slate-400">
            <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Audit Engine: Active</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Avatar className="size-8 border border-white/20">
              <AvatarFallback className="bg-indigo-950 text-indigo-300 font-bold text-xs">
                {adminUser?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("") || "AD"}
              </AvatarFallback>
            </Avatar>

            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-white leading-none">
                {adminUser?.name || "Dr. Arvind Subramanian"}
              </p>
              <p className="text-[10px] text-indigo-400 font-mono mt-0.5">superadmin</p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="h-8 px-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 text-xs ml-1"
              title="Logout from Admin Panel"
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex-1 flex">
        {/* Sidebar Navigation */}
        <aside
          className={cn(
            "fixed inset-y-14 left-0 z-30 w-64 border-r border-white/10 bg-[#0A0D15] p-4 flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3 py-1">
                Administration Modules
              </p>
              <nav className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    location.pathname === item.to ||
                    (item.to === "/admin/dashboard" && location.pathname === "/admin");
                  const badgeCount =
                    item.badgeKey === "pendingVerifications"
                      ? platformMetrics.pendingVerifications
                      : item.badgeKey === "pendingModerations"
                        ? platformMetrics.pendingModerations
                        : 0;

                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-150",
                        isActive
                          ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.35)]"
                          : "text-slate-400 hover:bg-white/5 hover:text-slate-200",
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={cn(
                            "size-4",
                            isActive ? "text-white" : "text-slate-400",
                          )}
                        />
                        <span>{item.label}</span>
                      </div>

                      {badgeCount > 0 && (
                        <Badge
                          className={cn(
                            "text-[10px] font-extrabold px-1.5 py-0.2 rounded-full",
                            isActive
                              ? "bg-white text-indigo-900"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30",
                          )}
                        >
                          {badgeCount}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Bottom Sidebar Meta */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <Link
              to="/student"
              className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/60 p-2.5 text-xs text-slate-400 hover:text-white hover:bg-slate-900 transition"
            >
              <div className="flex items-center gap-2">
                <Home className="size-3.5 text-indigo-400" />
                <span>Return to Public App</span>
              </div>
              <ChevronRight className="size-3" />
            </Link>

            <p className="text-[10px] text-slate-400 text-center font-mono">
              AcadIn v2.4.0-admin · Isolated Mode
            </p>
          </div>
        </aside>

        {/* Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

