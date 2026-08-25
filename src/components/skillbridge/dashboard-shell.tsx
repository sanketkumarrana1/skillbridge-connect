import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
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
    <Link to="/" className="flex min-w-0 items-center gap-2.5">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
        <GraduationCap className="size-5" />
      </span>
      {!compact ? (
        <span className="min-w-0 truncate font-display text-lg font-semibold tracking-tight text-foreground">
          AcadIn
        </span>
      ) : null}
    </Link>
  );
}

function NavLinks({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      {items.map(({ to, label, icon: Icon }) => {
        const active =
          to === pathname || (to !== "/student" && to !== "/industry" && pathname.startsWith(to));
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
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
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 lg:flex">
        <BrandMark />
        <p className="mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {role === "student" ? "Student" : "Industry"}
        </p>
        <div className="mt-2 flex-1 min-h-0 overflow-y-auto">
          <NavLinks items={items} />
        </div>
        <div className="mt-5 border-t border-border pt-5 space-y-3">
          <div className="rounded-2xl border border-border bg-muted/50 p-3">
            <p className="truncate text-sm font-semibold text-foreground">{identity.name}</p>
            <p className="truncate text-xs text-muted-foreground">{identity.sub}</p>
          </div>
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground"
          >
            <Link to="/">
              <GraduationCap className="size-4" /> Back to home
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground"
          >
            <Link to="/login">
              <LogOut className="size-4" /> Sign out
            </Link>
          </Button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
                  <Menu className="size-4" />
                  <span className="sr-only">Open navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex h-full w-72 flex-col bg-sidebar p-4">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <BrandMark />
                <div className="flex-1 min-h-0 overflow-y-auto mt-6">
                  <NavLinks items={items} onNavigate={() => setOpen(false)} />
                </div>
                <div className="mt-5 border-t border-border pt-5 space-y-3">
                  <div className="rounded-2xl border border-border bg-muted/50 p-3">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {identity.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{identity.sub}</p>
                  </div>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start gap-3 text-muted-foreground"
                  >
                    <Link to="/" onClick={() => setOpen(false)}>
                      <GraduationCap className="size-4" /> Back to home
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start gap-3 text-muted-foreground"
                  >
                    <Link to="/login" onClick={() => setOpen(false)}>
                      <LogOut className="size-4" /> Sign out
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <div className="min-w-0 lg:hidden">
              <BrandMark />
            </div>
            <p className="hidden min-w-0 truncate text-sm text-muted-foreground lg:block">
              {role === "student"
                ? "Your skill-to-opportunity workspace"
                : "Talent pipeline overview"}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link to={role === "student" ? "/industry" : "/student"}>
                <BarChart3 className="size-4" />
                {role === "student" ? "Industry view" : "Student view"}
              </Link>
            </Button>
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 font-display text-sm font-semibold text-primary">
              {identity.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
