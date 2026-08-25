import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronRight,
  CircleUserRound,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Lightbulb,
  LineChart,
  Menu,
  Pencil,
  Plus,
  Search,
  Settings,
  Sparkles,
  Target,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";
import { useAppState } from "@/context/app-state";
import {
  FunctionalStudentModule,
  StudentAssessment,
  StudentSkillReport,
} from "@/components/skillbridge/student-modules";
import { IndustryOverview } from "@/components/skillbridge/industry-overview";
import { IndustryPostOpportunity } from "@/components/skillbridge/industry-post-opportunity";
import { IndustryApplicants } from "@/components/skillbridge/industry-applicants";
import { IndustryCandidates } from "@/components/skillbridge/industry-candidates";
import { IndustryInterviews } from "@/components/skillbridge/industry-interviews";
import { IndustryWorkshops } from "@/components/skillbridge/industry-workshops";
import { IndustryAnalytics } from "@/components/skillbridge/industry-analytics";
import { AcademicianOverview } from "@/components/skillbridge/academician-overview";
import { AcademicianInternships } from "@/components/skillbridge/academician-internships";
import { AcademicianTraining } from "@/components/skillbridge/academician-training";
import { AcademicianFDPs } from "@/components/skillbridge/academician-fdps";
import { AcademicianConsultancy } from "@/components/skillbridge/academician-consultancy";
import { AcademicianResearch } from "@/components/skillbridge/academician-research";
import { AcademicianLectures } from "@/components/skillbridge/academician-lectures";
import { AcademicianMentorship } from "@/components/skillbridge/academician-mentorship";
import { InstitutionOverview } from "@/components/skillbridge/institution-overview";
import { InstitutionStudents } from "@/components/skillbridge/institution-students";
import { InstitutionPlacements } from "@/components/skillbridge/institution-placements";
import { InstitutionInternships } from "@/components/skillbridge/institution-internships";
import { InstitutionSkills } from "@/components/skillbridge/institution-skills";
import { InstitutionDepartments } from "@/components/skillbridge/institution-departments";
import { InstitutionRecruiters } from "@/components/skillbridge/institution-recruiters";
import { InstitutionReports } from "@/components/skillbridge/institution-reports";

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const roles: { value: Role; label: string; description: string; icon: typeof GraduationCap }[] = [
  {
    value: "student",
    label: "Student",
    description: "Build skills and find your next opportunity.",
    icon: GraduationCap,
  },
  {
    value: "industry",
    label: "Industry",
    description: "Find verified talent for high-impact teams.",
    icon: Building2,
  },
  {
    value: "academician",
    label: "Academician",
    description: "Turn learning outcomes into employability signals.",
    icon: BookOpen,
  },
  {
    value: "institution",
    label: "Institution",
    description: "Coordinate outcomes across your campus.",
    icon: LineChart,
  },
];

const students = [
  ["Aarav Menon", "Frontend Engineering", "93%", "React · TypeScript"],
  ["Priya Nair", "Machine Learning", "87%", "Python · SQL"],
  ["Sanket Kumar Rana", "Product Engineering", "84%", "React · Python"],
];

const jobs = [
  ["Product Engineer", "Orbit Labs", "Bengaluru · Full-time", "₹12–18 LPA"],
  ["Software Engineer I", "Northstar Cloud", "Remote · Full-time", "₹10–15 LPA"],
  ["Data Analyst", "Meridian Retail", "Hyderabad · Hybrid", "₹7–11 LPA"],
];

const internships = [
  ["Frontend Engineering Intern", "Nexora Labs", "94%", "Bengaluru · 6 months", "₹35k / month"],
  ["Machine Learning Intern", "Quantile AI", "81%", "Remote · 3 months", "₹28k / month"],
  [
    "Product Engineering Intern",
    "BrightPath EdTech",
    "88%",
    "Delhi NCR · 5 months",
    "₹26k / month",
  ],
  ["Cloud Infrastructure Intern", "Vertex Cloudworks", "72%", "Remote · 6 months", "₹32k / month"],
];

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
        <GraduationCap className="size-5" />
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">AcadIn</span>
    </Link>
  );
}

function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Brand />
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground lg:flex">
          <Link to="/about" className="hover:text-foreground">
            About
          </Link>
          <Link to="/features" className="hover:text-foreground">
            Features
          </Link>
          <Link to="/internships" className="hover:text-foreground">
            Internships
          </Link>
          <Link to="/jobs" className="hover:text-foreground">
            Jobs
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/roles">
              Get started <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function PageFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Brand />
        <span>Built for the next generation of academic and industry collaboration.</span>
      </div>
    </footer>
  );
}

function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicHeader />
      {children}
      <PageFooter />
    </div>
  );
}

export function LandingPage() {
  return (
    <PublicLayout>
      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div className="hero-grid absolute inset-0" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-28">
            <motion.div
              initial="hidden"
              animate="show"
              variants={fade}
              transition={{ duration: 0.5 }}
            >
              <Badge className="rounded-full border-primary/20 bg-primary/10 text-primary">
                AI Skill & Placement Intelligence
              </Badge>
              <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl">
                Make potential <span className="text-gradient">visible.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                AcadIn connects student capability with the teams building tomorrow's innovations.
                One intelligent platform for skills, opportunities, and outcomes.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/roles">
                    Explore the platform <ArrowRight />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/about">See how it works</Link>
                </Button>
              </div>
              <div className="mt-12 flex gap-8 border-t border-border pt-6">
                <div>
                  <p className="font-display text-2xl font-semibold">18k+</p>
                  <p className="text-xs text-muted-foreground">Skills mapped</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-semibold">420+</p>
                  <p className="text-xs text-muted-foreground">Partner teams</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-semibold">94%</p>
                  <p className="text-xs text-muted-foreground">Match confidence</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.15 }}
              className="glass-panel relative overflow-hidden rounded-[2rem] p-5 sm:p-7"
            >
              <div className="absolute -right-12 -top-12 size-40 rounded-full bg-accent/20 blur-3xl" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">
                    Live talent signal
                  </p>
                  <p className="mt-2 font-display text-xl font-semibold">
                    Frontend Engineering Intern
                  </p>
                  <p className="text-sm text-muted-foreground">Nexora Labs · Bengaluru</p>
                </div>
                <span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
                  <BriefcaseBusiness />
                </span>
              </div>
              <div className="relative mt-8 grid grid-cols-[1fr_auto] items-center gap-6">
                <div className="grid place-items-center rounded-full border-[12px] border-primary/15 p-5">
                  <div className="grid size-28 place-items-center rounded-full border-[10px] border-primary/80 font-display text-3xl font-semibold">
                    94<span className="text-sm">%</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Skill overlap</p>
                    <p className="mt-1 text-sm font-semibold">React · TypeScript · APIs</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Candidate readiness</p>
                    <div className="mt-2 h-2 w-40 overflow-hidden rounded-full bg-muted">
                      <div className="h-full w-[88%] rounded-full bg-accent" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">One gap to close</p>
                    <p className="mt-1 text-sm font-semibold">Automated testing</p>
                  </div>
                </div>
              </div>
              <div className="relative mt-7 flex items-center gap-3 rounded-2xl bg-muted/80 p-4">
                <Sparkles className="size-5 shrink-0 text-primary" />
                <p className="text-sm text-muted-foreground">
                  AI insight: this candidate’s project mirrors the team’s dashboard stack.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[.18em] text-primary">
              One shared language
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-5xl">
              From learning signals to career outcomes.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {(
              [
                [
                  Target,
                  "Map capability",
                  "Turn projects, assessments, and coursework into a living skills graph.",
                ],
                [
                  Users,
                  "Match with intent",
                  "Give students and hiring teams the context behind every recommendation.",
                ],
                [
                  BarChart3,
                  "Measure outcomes",
                  "Help institutions see what is working and where the next intervention matters.",
                ],
              ] as const
            ).map(([Icon, title, body]) => (
              <motion.article
                whileHover={{ y: -4 }}
                key={title}
                className="border-t-2 border-primary/20 pt-5"
              >
                <span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Icon />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </motion.article>
            ))}
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}

export function AboutPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="max-w-3xl">
          <Badge className="rounded-full bg-primary/10 text-primary">The bridge layer</Badge>
          <h1 className="mt-5 font-display text-5xl font-semibold tracking-tight sm:text-6xl">
            A clearer path from campus to contribution.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            AcadIn is a comprehensive academia–industry collaboration platform: a shared operating
            layer where students, educators, institutions, and industry partners work from the same
            evidence.
          </p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            [
              "01",
              "For students",
              "Build a profile that reflects what you can actually do, not just what you studied.",
            ],
            [
              "02",
              "For educators",
              "Spot skills gaps early and guide cohorts with data instead of anecdotes.",
            ],
            [
              "03",
              "For industry",
              "Reach relevant talent with explainable matching and less noise.",
            ],
          ].map(([n, t, d]) => (
            <div key={n} className="rounded-3xl border border-border bg-card p-7">
              <span className="font-display text-sm font-semibold text-primary">{n}</span>
              <h2 className="mt-8 font-display text-2xl font-semibold">{t}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </main>
    </PublicLayout>
  );
}

export function FeaturesPage() {
  const features = [
    [
      Sparkles,
      "AI skill intelligence",
      "A transparent readiness layer that turns assessments into actionable signals.",
    ],
    [
      BriefcaseBusiness,
      "Opportunity marketplace",
      "Internships and jobs ranked by fit, with the reasoning visible to every user.",
    ],
    [
      GraduationCap,
      "Institutional outcomes",
      "Cohort-level insights for academicians and placement teams.",
    ],
    [
      ShieldIcon,
      "Trust by design",
      "Role-aware workspaces and verification-ready records for high-confidence decisions.",
    ],
  ] as const;
  return (
    <PublicLayout>
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-[.18em] text-primary">
          Platform capabilities
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold tracking-tight sm:text-6xl">
          Everything that makes a signal useful.
        </h1>
        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2">
          {features.map(([Icon, title, body]) => (
            <article key={title} className="bg-card p-8 sm:p-10">
              <span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
                <Icon />
              </span>
              <h2 className="mt-8 font-display text-2xl font-semibold">{title}</h2>
              <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">{body}</p>
              <Link
                to="/roles"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >
                Try this workflow <ChevronRight className="size-4" />
              </Link>
            </article>
          ))}
        </div>
      </main>
    </PublicLayout>
  );
}

function ShieldIcon() {
  return <Check className="size-5" />;
}

function OpportunityCard({ item, job = false }: { item: string[]; job?: boolean }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            {job ? <BriefcaseBusiness className="size-5" /> : <Building2 className="size-5" />}
          </span>
          <div>
            <h3 className="font-display font-semibold">{item[0]}</h3>
            <p className="text-sm text-muted-foreground">{item[1]}</p>
          </div>
        </div>
        {!job && <Badge className="bg-primary/10 text-primary">{item[2]} fit</Badge>}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
        <span>{job ? item[2] : item[3]}</span>
        <span className="text-right font-semibold text-foreground">{job ? item[3] : item[4]}</span>
      </div>
      <Button className="mt-5 w-full" variant="outline">
        View opportunity <ArrowRight />
      </Button>
    </article>
  );
}

export function MarketplacePage({ job = false }: { job?: boolean }) {
  const [query, setQuery] = useState("");
  const data = (job ? jobs : internships).filter((item) =>
    item.join(" ").toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <PublicLayout>
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Badge className="rounded-full bg-primary/10 text-primary">
              {job ? "Career marketplace" : "Internship marketplace"}
            </Badge>
            <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
              Find work that fits.
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Explore opportunities matched to your skills, interests, and next career move.
            </p>
          </div>
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search roles or companies"
              className="pl-9"
            />
          </div>
        </div>
        <div className="mt-10 flex flex-wrap gap-2">
          <Badge variant="outline">All opportunities</Badge>
          <Badge variant="outline">Remote</Badge>
          <Badge variant="outline">Engineering</Badge>
          <Badge variant="outline">Data</Badge>
          <Badge variant="outline">Product</Badge>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => (
            <OpportunityCard key={item[0]} item={item} job={job} />
          ))}
        </div>
      </main>
    </PublicLayout>
  );
}

const studentItems = [
  ["/student", "Overview", LayoutDashboard],
  ["/student/assessment", "AI Assessment", ClipboardCheck],
  ["/student/analysis", "Skill Report", BarChart3],
  ["/student/roadmap", "Learning Roadmap", BookOpen],
  ["/student/internships", "Internship Search", BriefcaseBusiness],
  ["/student/jobs", "Job Search", Search],
  ["/student/applications", "Applications", FileText],
  ["/student/portfolio", "Portfolio", UserRound],
  ["/student/resume", "Resume Builder", Pencil],
  ["/student/certificates", "Certificates", Award],
  ["/student/settings", "Profile Settings", Settings],
] as const;
const roleItems: Record<
  Exclude<Role, "student">,
  readonly [string, string, typeof LayoutDashboard][]
> = {
  industry: [
    ["/industry", "Company Overview", LayoutDashboard],
    ["/industry/post", "Post Internship / Job", Plus],
    ["/industry/applications", "Applicants", FileText],
    ["/industry/candidates", "AI Shortlisting", Sparkles],
    ["/industry/interviews", "Interview Pipeline", ClipboardCheck],
    ["/industry/workshops", "Workshops & Mentorship", Users],
    ["/industry/analytics", "Analytics", LineChart],
  ],
  academician: [
    ["/academician", "Overview", LayoutDashboard],
    ["/academician/internships", "Faculty Internships", BriefcaseBusiness],
    ["/academician/training", "Industrial Training", ClipboardCheck],
    ["/academician/fdps", "FDPs", BookOpen],
    ["/academician/consultancy", "Consultancy", Building2],
    ["/academician/research", "Research Collaboration", Sparkles],
    ["/academician/lectures", "Guest Lectures", GraduationCap],
    ["/academician/mentorship", "Student Mentorship", Users],
  ],
  institution: [
    ["/institution", "Overview", LayoutDashboard],
    ["/institution/outcomes", "Student Analytics", Users],
    ["/institution/placements", "Placement Analytics", BarChart3],
    ["/institution/internships", "Internship Dashboard", BriefcaseBusiness],
    ["/institution/skills", "Skill Gap Analytics", Target],
    ["/institution/departments", "Department Reports", Building2],
    ["/institution/recruiters", "Recruiter Engagement", Users],
    ["/institution/reports", "Export Reports", FileText],
  ],
};

function ShellNav({ role, close }: { role: Role; close?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const items = role === "student" ? studentItems : roleItems[role];
  return (
    <nav className="space-y-1">
      {items.map(([to, label, Icon]) => (
        <Link
          key={to}
          to={to}
          onClick={close}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
            path === to
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/15"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <Icon className="size-4 shrink-0" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}

export function PortalShell({ role, children }: { role: Role; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const title = roles.find((item) => item.value === role)?.label ?? "Workspace";
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex flex-col border-r border-border bg-card/80 px-5 py-6 backdrop-blur-xl lg:flex">
        <Brand />
        <p className="mb-3 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[.2em] text-muted-foreground">
          Workspace
        </p>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <ShellNav role={role} />
        </div>
        <div className="mt-5 border-t border-border pt-5 space-y-3">
          <div className="flex items-center gap-3 rounded-2xl bg-muted/60 p-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <CircleUserRound />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Sanket Kumar Rana</p>
              <p className="truncate text-xs text-muted-foreground">{title} workspace</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
              Back to home
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/80 bg-background/85 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex h-full w-72 flex-col bg-card p-5">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <Brand />
                <div className="flex-1 min-h-0 overflow-y-auto mt-10">
                  <ShellNav role={role} close={() => setOpen(false)} />
                </div>
                <div className="mt-5 border-t border-border pt-5 space-y-3">
                  <div className="flex items-center gap-3 rounded-2xl bg-muted/60 p-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <CircleUserRound />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">Sanket Kumar Rana</p>
                      <p className="truncate text-xs text-muted-foreground">{title} workspace</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Link
                      to="/"
                      onClick={() => setOpen(false)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Back to home
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <span className="font-display text-lg font-semibold lg:hidden">AcadIn</span>
            <div className="hidden items-center gap-2 text-sm text-muted-foreground lg:flex">
              <span>{title} workspace</span>
              <ChevronRight className="size-4" />
              <span className="text-foreground">Today</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell />
            </Button>
            <span className="grid size-9 place-items-center rounded-full bg-accent/15 text-sm font-semibold text-accent">
              SK
            </span>
          </div>
        </header>
        <main className="mx-auto max-w-7xl space-y-7 px-4 py-7 sm:px-6 lg:py-9">{children}</main>
      </div>
    </div>
  );
}
export function RoleLayout({ role }: { role: Role }) {
  const navigate = useNavigate();
  const { isAuthenticated, role: activeRole } = useAppState();

  useEffect(() => {
    if (!isAuthenticated || activeRole !== role) navigate({ to: "/login" });
  }, [activeRole, isAuthenticated, navigate, role]);

  if (!isAuthenticated || activeRole !== role) return null;

  return (
    <PortalShell role={role}>
      <Outlet />
    </PortalShell>
  );
}

export function WorkspaceHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">{eyebrow}</p>
        )}
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}
export function Stat({
  label,
  value,
  trend,
  icon: Icon,
}: {
  label: string;
  value: string;
  trend: string;
  icon: typeof Target;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-4" />
        </span>
        <span className="text-xs font-semibold text-emerald-600">{trend}</span>
      </div>
      <p className="mt-5 font-display text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
export function SectionCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function StudentOverview() {
  return (
    <>
      <WorkspaceHeader
        eyebrow="Student dashboard"
        title="Good morning, Sanket."
        description="Your next opportunity is getting clearer by the day."
        action={
          <Button asChild>
            <Link to="/student/assessment">
              Continue assessment <ArrowRight />
            </Link>
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Profile strength" value="82%" trend="+12%" icon={UserRound} />
        <Stat label="Skill readiness" value="78" trend="+8 pts" icon={Sparkles} />
        <Stat label="Recommended roles" value="24" trend="+6 this week" icon={Target} />
        <Stat label="Active applications" value="08" trend="2 shortlisted" icon={FileText} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <SectionCard
          title="Your skill signal"
          action={
            <Button asChild variant="ghost" size="sm">
              <Link to="/student/analysis">
                View report <ArrowRight />
              </Link>
            </Button>
          }
        >
          <div className="mt-6 space-y-4">
            {[
              ["Problem solving", 86],
              ["Frontend engineering", 82],
              ["Python & data", 74],
              ["Cloud fundamentals", 48],
            ].map(([name, value]) => (
              <div key={name as string}>
                <div className="flex justify-between text-sm">
                  <span>{name as string}</span>
                  <span className="font-semibold">{value as number}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Weekly focus">
          <div className="mt-6 flex items-center gap-5">
            <div className="grid size-28 place-items-center rounded-full border-[10px] border-primary/15">
              <div className="font-display text-3xl font-semibold">
                3<span className="text-sm">/5</span>
              </div>
            </div>
            <div>
              <p className="font-semibold">Keep the momentum</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Complete two roadmap tasks to unlock three higher-fit roles.
              </p>
              <Button asChild variant="link" className="mt-2 h-auto p-0">
                <Link to="/student/roadmap">
                  Open roadmap <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </SectionCard>
      </div>
      <SectionCard
        title="Recommended for you"
        action={
          <Button asChild variant="ghost" size="sm">
            <Link to="/student/internships">
              View all <ArrowRight />
            </Link>
          </Button>
        }
      >
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {internships.slice(0, 3).map((item) => (
            <OpportunityCard key={item[0]} item={item} />
          ))}
        </div>
      </SectionCard>
    </>
  );
}

function LegacyStudentAssessment() {
  const [step, setStep] = useState(1);
  return (
    <>
      <WorkspaceHeader
        eyebrow="AI assessment"
        title="Show what you can do."
        description="A five-step reflection that sharpens your skill signal."
        action={<Badge variant="outline">Step {step} of 5</Badge>}
      />
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${step * 20}%` }}
        />
      </div>
      <section className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-6 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">
          {step === 1
            ? "Problem solving"
            : step === 2
              ? "Technical craft"
              : step === 3
                ? "Collaboration"
                : step === 4
                  ? "Learning agility"
                  : "Career direction"}
        </p>
        <h2 className="mt-5 font-display text-3xl font-semibold">
          Tell us about a challenge you solved.
        </h2>
        <p className="mt-3 text-muted-foreground">
          Think of a recent project, assignment, or moment where you had to make a meaningful
          decision.
        </p>
        <div className="mt-8 grid gap-3">
          {[
            "I can explain the tradeoffs clearly",
            "I found a solution with guidance",
            "I am still learning this area",
          ].map((answer) => (
            <button
              key={answer}
              className="flex items-center justify-between rounded-2xl border border-border p-4 text-left text-sm transition hover:border-primary hover:bg-primary/5"
              onClick={() => setStep((value) => Math.min(5, value + 1))}
            >
              {answer}
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          ))}
        </div>
        <div className="mt-8 flex justify-between">
          <Button
            variant="ghost"
            disabled={step === 1}
            onClick={() => setStep((value) => value - 1)}
          >
            Back
          </Button>
          <Button onClick={() => setStep((value) => Math.min(5, value + 1))}>
            {step === 5 ? "Complete assessment" : "Save and continue"} <ArrowRight />
          </Button>
        </div>
      </section>
    </>
  );
}

function LegacySkillReport() {
  const data = [
    { subject: "Frontend", A: 88 },
    { subject: "Data", A: 74 },
    { subject: "Cloud", A: 48 },
    { subject: "Systems", A: 68 },
    { subject: "Product", A: 82 },
    { subject: "Communication", A: 79 },
  ];
  return (
    <>
      <WorkspaceHeader
        eyebrow="Skill intelligence"
        title="Your skill report"
        description="A clear view of where you are strong and where focused practice compounds."
        action={
          <Button asChild>
            <Link to="/student/roadmap">
              Build my roadmap <ArrowRight />
            </Link>
          </Button>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_.8fr]">
        <SectionCard title="Capability radar">
          <div className="mt-4 h-[330px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "currentColor", fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Readiness"
                  dataKey="A"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
        <SectionCard title="Signal summary">
          <div className="mt-5 space-y-4">
            {[
              ["Strongest signal", "Frontend engineering", "88%"],
              ["Fastest lift", "Cloud fundamentals", "+18 pts"],
              ["Role unlock", "System design", "2 roles"],
            ].map(([label, value, score]) => (
              <div key={label} className="border-b border-border pb-4 last:border-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <div className="mt-1 flex justify-between gap-3">
                  <span className="font-semibold">{value}</span>
                  <span className="font-display text-primary">{score}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}

function StudentSection({ section }: { section: string }) {
  if (section === "overview") return <StudentOverview />;
  if (section === "assessment") return <StudentAssessment />;
  if (section === "analysis") return <StudentSkillReport />;
  return <FunctionalStudentModule section={section} />;
}

const enterpriseModules: Record<
  string,
  {
    title: string;
    description: string;
    action: string;
    rows: string[];
    metric: string;
    value: string;
  }
> = {
  post: {
    title: "Post Internship / Job",
    description: "Create a structured opportunity that attracts the right signal.",
    action: "Save opportunity",
    rows: [
      "Opportunity title",
      "Type and work mode",
      "Skills and eligibility",
      "Compensation and timeline",
    ],
    metric: "Draft readiness",
    value: "72%",
  },
  applications: {
    title: "Applicants",
    description: "Review incoming applications with fit, evidence, and next actions together.",
    action: "Export applicants",
    rows: [
      "Aarav Menon · Frontend Engineering · 93%",
      "Priya Nair · Machine Learning · 87%",
      "Sanket Kumar Rana · Product Engineering · 84%",
      "Meera Iyer · Cloud Infrastructure · 78%",
    ],
    metric: "Total applicants",
    value: "146",
  },
  candidates: {
    title: "AI Shortlisting",
    description: "Use explainable matching to focus your team on the strongest candidates.",
    action: "Run shortlist",
    rows: ["Skill overlap", "Project evidence", "Role readiness", "Growth potential"],
    metric: "High-confidence matches",
    value: "24",
  },
  interviews: {
    title: "Interview Pipeline",
    description: "Move candidates from review to offer with a shared recruiting view.",
    action: "Schedule interview",
    rows: [
      "New · 18 candidates",
      "Screening · 12 candidates",
      "Technical round · 8 candidates",
      "Offer stage · 3 candidates",
    ],
    metric: "Time to next stage",
    value: "2.4 days",
  },
  workshops: {
    title: "Workshops & Mentorship",
    description: "Build stronger pathways with focused sessions and mentor touchpoints.",
    action: "Plan a session",
    rows: [
      "Modern frontend systems · 42 attendees",
      "Resume studio · 28 attendees",
      "Women in product engineering · 35 attendees",
      "Mentor office hours · 16 bookings",
    ],
    metric: "Engagement this month",
    value: "86%",
  },
  analytics: {
    title: "Analytics",
    description: "Understand where your hiring funnel is healthy and where it slows down.",
    action: "Download report",
    rows: [
      "Applications increased 18% this month",
      "Frontend roles have the highest fit",
      "Shortlist conversion is up 11%",
      "Cloud roles need broader outreach",
    ],
    metric: "Average match",
    value: "86%",
  },
  internships: {
    title: "Faculty Internships",
    description: "Coordinate faculty-led industry exposure and student placements.",
    action: "Add internship",
    rows: [
      "Industry immersion · 32 students",
      "Faculty fellowship · 8 faculty",
      "Summer research placement · 14 students",
      "Partner review pending · 5 requests",
    ],
    metric: "Active programs",
    value: "18",
  },
  training: {
    title: "Industrial Training",
    description: "Track training plans, attendance, outcomes, and employer feedback.",
    action: "Create training plan",
    rows: [
      "CSE · Cloud engineering · 84% complete",
      "ECE · Embedded systems · 71% complete",
      "MBA · Product analytics · 92% complete",
      "Assessment reviews due · 12 learners",
    ],
    metric: "Completion rate",
    value: "84%",
  },
  fdps: {
    title: "Faculty Development Programs",
    description: "Plan and measure faculty development aligned to emerging industry skills.",
    action: "Schedule FDP",
    rows: [
      "AI in curriculum · 48 registrations",
      "Outcome-based education · 32 registrations",
      "Industry co-teaching · 18 registrations",
      "Certificates ready · 26 faculty",
    ],
    metric: "Faculty engaged",
    value: "126",
  },
  consultancy: {
    title: "Consultancy",
    description: "Manage industry problem statements, experts, and delivery milestones.",
    action: "Start engagement",
    rows: [
      "Nexora Labs · Product research",
      "Vertex Cloudworks · Reliability audit",
      "Meridian Retail · Data strategy",
      "BrightPath EdTech · Learning analytics",
    ],
    metric: "Active engagements",
    value: "09",
  },
  research: {
    title: "Research Collaboration",
    description: "Bring academic research and industry priorities into the same workspace.",
    action: "Add collaboration",
    rows: [
      "Responsible AI lab · 4 partners",
      "Climate data systems · 3 partners",
      "Assistive technology · 2 partners",
      "Proposals awaiting review · 6",
    ],
    metric: "Research partners",
    value: "21",
  },
  lectures: {
    title: "Guest Lectures",
    description: "Give learners direct access to practitioners and domain leaders.",
    action: "Invite speaker",
    rows: [
      "Building for Bharat · 240 attendees",
      "From prototype to production · 180 attendees",
      "Careers in data · 210 attendees",
      "Upcoming speakers · 4 confirmed",
    ],
    metric: "Learner reach",
    value: "1,240",
  },
  mentorship: {
    title: "Student Mentorship",
    description: "Match learners with mentors and keep every conversation actionable.",
    action: "Match mentors",
    rows: [
      "Needs portfolio review · 18 learners",
      "Interview preparation · 24 learners",
      "Career direction · 12 learners",
      "Mentor check-ins due · 31",
    ],
    metric: "Active mentees",
    value: "284",
  },
  placements: {
    title: "Placement Analytics",
    description: "Track placement outcomes, offers, and department-level momentum.",
    action: "Export placement report",
    rows: [
      "Computer Science · 91% placed",
      "Electronics · 76% placed",
      "Mechanical · 68% placed",
      "Average package · ₹11.4 LPA",
    ],
    metric: "Placement rate",
    value: "84%",
  },
  skills: {
    title: "Skill Gap Analytics",
    description: "See the capabilities employers need and where cohorts need support.",
    action: "Create intervention",
    rows: [
      "Cloud & DevOps · 38% gap",
      "System design · 31% gap",
      "Communication · 18% gap",
      "Data literacy · 14% gap",
    ],
    metric: "Skills mapped",
    value: "18k+",
  },
  departments: {
    title: "Department Reports",
    description: "Compare department performance and turn findings into action plans.",
    action: "Generate report",
    rows: [
      "CSE · 1,240 active learners",
      "ECE · 684 active learners",
      "Mechanical · 520 active learners",
      "Civil · 396 active learners",
    ],
    metric: "Departments reporting",
    value: "12",
  },
  recruiters: {
    title: "Recruiter Engagement",
    description: "Build a reliable partner network around relevant talent and outcomes.",
    action: "Invite recruiter",
    rows: [
      "Nexora Labs · 8 open roles",
      "Quantile AI · 4 open roles",
      "BrightPath EdTech · 6 open roles",
      "New partner requests · 7",
    ],
    metric: "Active recruiters",
    value: "64",
  },
  reports: {
    title: "Export Reports",
    description: "Prepare clear, shareable reports for leadership, departments, and partners.",
    action: "Generate export",
    rows: [
      "Placement outcomes · Updated today",
      "Internship participation · Updated yesterday",
      "Skill gap summary · Updated 3 days ago",
      "Recruiter engagement · Updated 1 week ago",
    ],
    metric: "Reports ready",
    value: "18",
  },
};

function EnterpriseModule({ role, section }: { role: Exclude<Role, "student">; section: string }) {
  const overview =
    role === "industry"
      ? {
          title: "Company Overview",
          description: "A focused view of your hiring activity, talent signals, and next actions.",
          action: "Create opportunity",
          rows: [
            "18 open opportunities",
            "146 applicants in review",
            "24 high-confidence matches",
            "3 interviews scheduled today",
          ],
          metric: "Open opportunities",
          value: "18",
        }
      : role === "academician"
        ? {
            title: "Academician Overview",
            description:
              "Coordinate learning, industry exposure, and student outcomes from one workspace.",
            action: "Create program",
            rows: [
              "24 active cohorts",
              "126 faculty engaged",
              "21 research partners",
              "31 mentorship check-ins due",
            ],
            metric: "Active programs",
            value: "24",
          }
        : {
            title: "Institution Overview",
            description:
              "See placement momentum, skill gaps, and partner engagement across campus.",
            action: "Generate report",
            rows: [
              "84% placement rate",
              "18k+ skills mapped",
              "64 active recruiters",
              "12 departments reporting",
            ],
            metric: "Placement rate",
            value: "84%",
          };
  const fallbackInfo = enterpriseModules["applications"] ?? {
    title: "Enterprise Workspace",
    description: "Manage operations, cohorts, and candidate signals.",
    action: "Action",
    rows: ["Operations", "Reporting", "Analytics"],
    metric: "Active",
    value: "100%",
  };
  const info = section === "overview" ? overview : (enterpriseModules[section] ?? fallbackInfo);
  const [saved, setSaved] = useState(false);
  return (
    <>
      <WorkspaceHeader
        eyebrow={`${roles.find((item) => item.value === role)?.label} portal`}
        title={info.title}
        description={info.description}
        action={
          <Button onClick={() => setSaved(true)}>
            {saved ? <Check /> : <Plus />}
            {saved ? "Saved" : info.action}
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label={info.metric}
          value={info.value}
          trend="+12%"
          icon={
            role === "industry"
              ? BriefcaseBusiness
              : role === "academician"
                ? GraduationCap
                : BarChart3
          }
        />
        <Stat label="Active this month" value="24" trend="+18%" icon={Users} />
        <Stat label="Completion" value="86%" trend="+6 pts" icon={Target} />
        <Stat label="Action items" value="12" trend="This week" icon={Bell} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <SectionCard
          title={
            role === "industry" && section === "candidates" ? "Shortlist criteria" : "Current work"
          }
          action={
            <Button variant="ghost" size="sm" onClick={() => setSaved(true)}>
              {saved ? "Saved" : "Mark reviewed"} <Check />
            </Button>
          }
        >
          <div className="mt-4 divide-y divide-border">
            {info.rows.map((row, index) => (
              <div key={row} className="flex items-center justify-between gap-4 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                    0{index + 1}
                  </span>
                  <p className="truncate text-sm font-medium">{row}</p>
                </div>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Action center">
          <div className="mt-5 space-y-3">
            {[
              "Review the latest signal",
              "Share an update with your team",
              "Set the next milestone",
            ].map((item) => (
              <button
                key={item}
                onClick={() => setSaved(true)}
                className="flex w-full items-center gap-3 rounded-xl bg-muted/60 p-3 text-left text-sm transition hover:bg-primary/10"
              >
                <Lightbulb className="size-4 shrink-0 text-primary" />
                <span className="flex-1">{item}</span>
                <ArrowRight className="size-4 text-muted-foreground" />
              </button>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-primary/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-primary">
              Workspace signal
            </p>
            <p className="mt-2 font-display text-2xl font-semibold">On track</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your latest activity is ahead of the team baseline.
            </p>
          </div>
        </SectionCard>
      </div>
    </>
  );
}

function IndustrySection({ section }: { section: string }) {
  if (section === "post") {
    return <IndustryPostOpportunity />;
  }
  if (section === "applications") {
    return <IndustryApplicants />;
  }
  if (section === "candidates") {
    return <IndustryCandidates />;
  }
  if (section === "interviews") {
    return <IndustryInterviews />;
  }
  if (section === "workshops") {
    return <IndustryWorkshops />;
  }
  if (section === "analytics") {
    return <IndustryAnalytics />;
  }
  if (section === "overview") {
    return <IndustryOverview />;
  }
  return <EnterpriseModule role="industry" section={section} />;
}

function AcademicianSection({ section }: { section: string }) {
  if (section === "internships") {
    return <AcademicianInternships />;
  }
  if (section === "training") {
    return <AcademicianTraining />;
  }
  if (section === "fdps") {
    return <AcademicianFDPs />;
  }
  if (section === "consultancy") {
    return <AcademicianConsultancy />;
  }
  if (section === "research") {
    return <AcademicianResearch />;
  }
  if (section === "lectures") {
    return <AcademicianLectures />;
  }
  if (section === "mentorship") {
    return <AcademicianMentorship />;
  }
  if (section === "overview") {
    return <AcademicianOverview />;
  }
  return <EnterpriseModule role="academician" section={section} />;
}

function InstitutionSection({ section }: { section: string }) {
  if (section === "outcomes") {
    return <InstitutionStudents />;
  }
  if (section === "placements") {
    return <InstitutionPlacements />;
  }
  if (section === "internships") {
    return <InstitutionInternships />;
  }
  if (section === "skills") {
    return <InstitutionSkills />;
  }
  if (section === "departments") {
    return <InstitutionDepartments />;
  }
  if (section === "recruiters" || section === "partners") {
    return <InstitutionRecruiters />;
  }
  if (section === "reports") {
    return <InstitutionReports />;
  }
  if (section === "overview") {
    return <InstitutionOverview />;
  }
  return <EnterpriseModule role="institution" section={section} />;
}

export function PortalPage({ role, section = "overview" }: { role: Role; section?: string }) {
  if (role === "student") {
    return <StudentSection section={section} />;
  }
  if (role === "industry") {
    return <IndustrySection section={section} />;
  }
  if (role === "academician") {
    return <AcademicianSection section={section} />;
  }
  if (role === "institution") {
    return <InstitutionSection section={section} />;
  }
  return <EnterpriseModule role={role} section={section} />;
}

function LegacyAuthPage({ mode = "login" }: { mode?: "login" | "register" | "roles" }) {
  const [selected, setSelected] = useState<Role>("student");
  const heading =
    mode === "register"
      ? "Create your AcadIn account"
      : mode === "roles"
        ? "Choose your workspace"
        : "Welcome back to AcadIn";
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hero-grid hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <Brand />
        <div className="max-w-lg">
          <p className="text-sm font-semibold uppercase tracking-[.18em] text-primary-foreground/70">
            AcadIn Platform
          </p>
          <h1 className="mt-5 font-display text-5xl font-semibold leading-tight">
            The right signal changes everything.
          </h1>
          <p className="mt-5 text-primary-foreground/75">
            Connect your skills, people, and outcomes in one intelligent workspace.
          </p>
        </div>
        <p className="text-xs text-primary-foreground/60">
          AcadIn · Academia–Industry Collaboration Portal
        </p>
      </div>
      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <Brand />
          </div>
          <h2 className="font-display text-3xl font-semibold">{heading}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "roles"
              ? "You can switch workspaces any time."
              : "Use the demo workspace to explore the experience."}
          </p>
          <div className="mt-8 grid gap-3">
            {roles.map(({ value, label, description, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setSelected(value)}
                className={cn(
                  "flex items-center gap-4 rounded-2xl border p-4 text-left transition",
                  selected === value
                    ? "border-primary bg-primary/5 ring-2 ring-primary/15"
                    : "border-border hover:border-primary/50",
                )}
              >
                <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{label}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{description}</span>
                </span>
                {selected === value && <Check className="size-5 text-primary" />}
              </button>
            ))}
          </div>
          {mode !== "roles" && (
            <div className="mt-6 space-y-3">
              <Input type="email" placeholder="you@college.edu" />
              <Input type="password" placeholder="Password" />
              <Button className="mt-2 w-full" asChild>
                <Link to={selected === "student" ? "/student" : `/${selected}`}>
                  {mode === "register" ? "Create account" : "Continue to demo"} <ArrowRight />
                </Link>
              </Button>
            </div>
          )}
          {mode === "login" && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              New here?{" "}
              <Link className="font-semibold text-primary" to="/register">
                Create an account
              </Link>
            </p>
          )}
          {mode === "register" && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already registered?{" "}
              <Link className="font-semibold text-primary" to="/login">
                Log in
              </Link>
            </p>
          )}
          {mode === "roles" && (
            <Button className="mt-7 w-full" asChild>
              <Link to={selected === "student" ? "/student" : `/${selected}`}>
                Open {roles.find((item) => item.value === selected)?.label} workspace <ArrowRight />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Use at least 6 characters"),
});
const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Enter your full name"),
  accepted: z.boolean().refine((val) => val === true, "Accept the terms to continue"),
});
const emailSchema = z.object({ email: z.string().email("Enter a valid email address") });
type AuthMode = "login" | "register" | "roles";
const destination = (role: Role) =>
  role === "student" ? "/student" : (`/${role}` as "/industry" | "/academician" | "/institution");

function FieldError({ message }: { message?: string | undefined }) {
  return message ? <p className="text-xs text-destructive">{message}</p> : null;
}

function AuthFrame({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hero-grid hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <Brand />
        <div className="max-w-lg">
          <p className="text-sm font-semibold uppercase tracking-[.18em] text-primary-foreground/70">
            AcadIn Platform
          </p>
          <h1 className="mt-5 font-display text-5xl font-semibold leading-tight">
            The right signal changes everything.
          </h1>
          <p className="mt-5 text-primary-foreground/75">
            One trusted workspace for skills, opportunities, and outcomes.
          </p>
        </div>
        <p className="text-xs text-primary-foreground/60">
          AcadIn · Academia–Industry Collaboration Portal
        </p>
      </div>
      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 lg:hidden">
            <Brand />
          </div>
          <h2 className="font-display text-3xl font-semibold">{title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          {children}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link className="font-semibold text-primary" to="/">
              Back to home
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function RolePicker({ value, onChange }: { value: Role; onChange: (role: Role) => void }) {
  return (
    <div className="mt-6 grid gap-2 sm:grid-cols-2">
      {roles.map(({ value: role, label, icon: Icon }) => (
        <button
          key={role}
          type="button"
          onClick={() => onChange(role)}
          className={cn(
            "flex items-center gap-3 rounded-xl border p-3 text-left text-sm transition",
            value === role
              ? "border-primary bg-primary/5 ring-2 ring-primary/15"
              : "border-border hover:border-primary/50",
          )}
        >
          <Icon className="size-4 text-primary" />
          <span className="flex-1 font-medium">{label}</span>
          {value === role && <Check className="size-4 text-primary" />}
        </button>
      ))}
    </div>
  );
}

function LoginForm() {
  const navigate = useNavigate();
  const { authenticate } = useAppState();
  const [role, setRole] = useState<Role>("student");
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "demo@acadin.in", password: "password" },
  });
  const submit = (values: z.infer<typeof loginSchema>) => {
    authenticate(role);
    toast.success(`Signed in as ${roles.find((item) => item.value === role)?.label}`);
    navigate({ to: destination(role) });
  };
  return (
    <AuthFrame title="Welcome back" description="Sign in to your AcadIn workspace.">
      <RolePicker value={role} onChange={setRole} />
      <form className="mt-6 space-y-4" onSubmit={form.handleSubmit(submit)}>
        <div className="space-y-2">
          <Label htmlFor="login-email">Email</Label>
          <Input id="login-email" type="email" {...form.register("email")} />
          <FieldError message={form.formState.errors.email?.message} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="login-password">Password</Label>
            <Link className="text-xs font-medium text-primary" to="/forgot-password">
              Forgot password?
            </Link>
          </div>
          <Input id="login-password" type="password" {...form.register("password")} />
          <FieldError message={form.formState.errors.password?.message} />
        </div>
        <Button className="w-full" type="submit">
          Sign in <ArrowRight />
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to AcadIn?{" "}
        <Link className="font-semibold text-primary" to="/register">
          Create an account
        </Link>
      </p>
    </AuthFrame>
  );
}

function RegisterForm() {
  const navigate = useNavigate();
  const { authenticate } = useAppState();
  const [role, setRole] = useState<Role>("student");
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", accepted: false },
  });
  const submit = (values: z.infer<typeof registerSchema>) => {
    void values;
    authenticate(role);
    navigate({ to: "/verify-email" });
  };
  return (
    <AuthFrame
      title="Create your account"
      description="Start with a role-specific AcadIn workspace."
    >
      <RolePicker value={role} onChange={setRole} />
      <form className="mt-6 space-y-4" onSubmit={form.handleSubmit(submit)}>
        <div className="space-y-2">
          <Label htmlFor="register-name">Full name</Label>
          <Input id="register-name" {...form.register("name")} />
          <FieldError message={form.formState.errors.name?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-email">Work or college email</Label>
          <Input id="register-email" type="email" {...form.register("email")} />
          <FieldError message={form.formState.errors.email?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-password">Password</Label>
          <Input id="register-password" type="password" {...form.register("password")} />
          <FieldError message={form.formState.errors.password?.message} />
        </div>
        <label className="flex items-start gap-2 text-xs text-muted-foreground">
          <input type="checkbox" className="mt-0.5 accent-primary" {...form.register("accepted")} />
          <span>I agree to the AcadIn terms and privacy policy.</span>
        </label>
        <FieldError message={form.formState.errors.accepted?.message} />
        <Button className="w-full" type="submit">
          Create account <ArrowRight />
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already registered?{" "}
        <Link className="font-semibold text-primary" to="/login">
          Sign in
        </Link>
      </p>
    </AuthFrame>
  );
}

function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });
  const submit = () => setSent(true);
  return (
    <AuthFrame
      title={sent ? "Check your inbox" : "Reset your password"}
      description={
        sent
          ? "A mock reset link is ready in your email."
          : "Enter your email and we will send a password reset link."
      }
    >
      {sent ? (
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
          Reset instructions sent. This frontend demo does not send real email.
        </div>
      ) : (
        <form className="mt-8 space-y-4" onSubmit={form.handleSubmit(submit)}>
          <div className="space-y-2">
            <Label htmlFor="forgot-email">Email</Label>
            <Input id="forgot-email" type="email" {...form.register("email")} />
            <FieldError message={form.formState.errors.email?.message} />
          </div>
          <Button className="w-full" type="submit">
            Send reset link <ArrowRight />
          </Button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link className="font-semibold text-primary" to="/login">
          Back to sign in
        </Link>
      </p>
    </AuthFrame>
  );
}

function VerifyEmailPage() {
  const navigate = useNavigate();
  const { role, authenticate } = useAppState();
  const [resent, setResent] = useState(false);
  return (
    <AuthFrame
      title="Verify your email"
      description="Confirm your email to activate your selected workspace."
    >
      <div className="mt-8 rounded-2xl border border-border bg-muted/50 p-5">
        <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
          <Check />
        </span>
        <p className="mt-4 font-semibold">Verification link sent</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Open the mock verification link in your inbox, then continue as a{" "}
          {roles.find((item) => item.value === role)?.label ?? "Student"}.
        </p>
      </div>
      <Button
        className="mt-5 w-full"
        onClick={() => {
          authenticate(role);
          navigate({ to: destination(role) });
        }}
      >
        I verified my email <ArrowRight />
      </Button>
      <Button variant="outline" className="mt-3 w-full" onClick={() => setResent(true)}>
        {resent ? "Verification link resent" : "Resend verification link"}
      </Button>
    </AuthFrame>
  );
}

export function AuthPage({ mode = "login" }: { mode?: AuthMode }) {
  if (mode === "register") return <RegisterForm />;
  if (mode === "roles") return <RoleSelectionPage />;
  return <LoginForm />;
}

export function RoleSelectionPage() {
  const navigate = useNavigate();
  const { authenticate } = useAppState();
  const [role, setRole] = useState<Role>("student");
  return (
    <AuthFrame
      title="Choose your workspace"
      description="Select the role you want to explore in this demo."
    >
      <RolePicker value={role} onChange={setRole} />
      <Button
        className="mt-7 w-full"
        onClick={() => {
          authenticate(role);
          navigate({ to: destination(role) });
        }}
      >
        Open {roles.find((item) => item.value === role)?.label} workspace <ArrowRight />
      </Button>
    </AuthFrame>
  );
}

export { ForgotPasswordForm, VerifyEmailPage };
