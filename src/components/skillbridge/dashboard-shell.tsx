import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Briefcase,
  ClipboardList,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import { useState, type ComponentType } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAppState } from "@/context/app-state";
import type { Role } from "@/types";

interface NavItem {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

const studentNav: NavItem[] = [
  { to: "/student", label: "Dashboard", icon: LayoutDashboard },
  { to: "/student/profile", label: "Profile", icon: User },
  { to: "/student/assessment", label: "Skill Assessment", icon: ClipboardList },
  { to: "/student/analysis", label: "Skill Analysis", icon: Sparkles },
  { to: "/student/internships", label: "Internships", icon: Briefcase },
  { to: "/student/applications", label: "Applications", icon: FileText },
];

const industryNav: NavItem[] = [
  { to: "/industry", label: "Dashboard", icon: LayoutDashboard },
  { to: "/industry/post", label: "Post Internship", icon: PlusCircle },
  { to: "/industry/applications", label: "Applications", icon: FileText },
  { to: "/industry/candidates", label: "Candidate Matches", icon: Users },
];

export function BrandMark({ compact }: { compact?: boolean }) {
  return (
    <Link to="/" className="group flex min-w-0 items-center gap-3">
      <span className="relative grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-transform duration-300 group-hover:scale-105">
        <GraduationCap className="size-5" />
      </span>
      {!compact ? (
        <span className="min-w-0 truncate font-display text-xl font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
          Acad<span className="text-gradient">In</span>
        </span>
      ) : null}
    </Link>
  );
}

function NavLinks({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1.5">
      {items.map(({ to, label, icon: Icon }) => {
        const active =
          to === pathname || (to !== "/student" && to !== "/industry" && pathname.startsWith(to));
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
              active
                ? "bg-gradient-to-r from-indigo-600/30 to-purple-600/20 text-white border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.25)]"
                : "text-slate-400 hover:bg-slate-800/60 hover:text-white border border-transparent",
            )}
          >
            {active && (
              <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-indigo-400 to-pink-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            )}
            <Icon
              className={cn(
                "size-4 shrink-0 transition-colors",
                active ? "text-indigo-400" : "text-slate-400 group-hover:text-indigo-300",
              )}
            />
            <span className="min-w-0 truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardShell({ role }: { role: Role }) {
  const items = role === "student" ? studentNav : industryNav;
  const { profile } = useAppState();
  const [open, setOpen] = useState(false);

  const identity =
    role === "student"
      ? { name: profile.name, sub: profile.branch }
      : { name: "Nexora Labs", sub: "Hiring Team" };

  return (
    <div className="min-h-screen bg-[#070A13] text-white">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-white/10 bg-[#0B0F19]/90 px-4 py-5 backdrop-blur-2xl lg:flex">
        <BrandMark />
        <p className="mt-6 px-3 text-[11px] font-bold uppercase tracking-widest text-slate-500">
          {role === "student" ? "Student Workspace" : "Industry Workspace"}
        </p>
        <div className="mt-3 flex-1 min-h-0 overflow-y-auto">
          <NavLinks items={items} />
        </div>
        <div className="mt-5 border-t border-white/10 pt-5 space-y-3">
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-3 shadow-inner">
            <p className="truncate text-sm font-semibold text-white">{identity.name}</p>
            <p className="truncate text-xs text-slate-400">{identity.sub}</p>
          </div>
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-slate-800/60"
          >
            <Link to="/">
              <GraduationCap className="size-4 text-indigo-400" /> Back to home
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start gap-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
          >
            <Link to="/login">
              <LogOut className="size-4" /> Sign out
            </Link>
          </Button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-white/10 bg-[#070A13]/80 px-4 py-3.5 backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 lg:hidden border-white/10 bg-slate-900/60 text-white"
                >
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-72 bg-[#0B0F19] p-5 border-white/10 text-white"
              >
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <BrandMark />
                <div className="mt-8 flex-1 min-h-0 overflow-y-auto">
                  <NavLinks items={items} onNavigate={() => setOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
            <span className="truncate text-sm font-medium text-slate-400">
              <span className="text-white font-semibold capitalize">{role}</span> Dashboard
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Workspace
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
          {role ? <Outlet /> : null}
        </main>
      </div>
    </div>
  );
}
