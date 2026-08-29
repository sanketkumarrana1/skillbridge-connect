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
  Compass,
  Cpu,
  FileText,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Lightbulb,
  LineChart,
  Lock,
  Menu,
  Pencil,
  Plus,
  Rocket,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  UserCheck,
  UserRound,
  Users,
  Workflow,
  Zap,
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
    description: "Verify skills, construct ATS resume, and unlock high-fit internships.",
    icon: GraduationCap,
  },
  {
    value: "industry",
    label: "Industry",
    description: "Discover verified talent, manage pipelines, and sponsor R&D projects.",
    icon: Building2,
  },
  {
    value: "academician",
    label: "Academician",
    description: "Access industry training, FDPs, consultancy, and student mentorship.",
    icon: BookOpen,
  },
  {
    value: "institution",
    label: "Institution",
    description:
      "Monitor campus placement analytics, audit departments, and export NBA/NAAC reports.",
    icon: LineChart,
  },
];

const students = [
  ["Aarav Menon", "Frontend Engineering", "93%", "React · TypeScript · UI Systems"],
  ["Priya Nair", "Machine Learning", "89%", "Python · PyTorch · Data Pipelines"],
  ["Sanket Kumar Rana", "Product Engineering", "94%", "Full-Stack · Cloud · AI Models"],
];

const jobs = [
  ["Senior Product Engineer", "Orbit Labs", "Bengaluru · Full-time", "₹14–22 LPA"],
  ["AI / Software Engineer", "Northstar Cloud", "Remote · Full-time", "₹12–18 LPA"],
  ["Data Systems Analyst", "Meridian Retail", "Hyderabad · Hybrid", "₹9–14 LPA"],
];

const internships = [
  ["Frontend Engineering Intern", "Nexora Labs", "94%", "Bengaluru · 6 months", "₹35k / month"],
  ["Applied AI / ML Intern", "Quantile AI", "91%", "Remote · 3 months", "₹30k / month"],
  ["Cloud Infrastructure Intern", "Vertex Cloudworks", "86%", "Remote · 6 months", "₹32k / month"],
  ["Full-Stack Product Intern", "BrightPath Labs", "88%", "Delhi NCR · 5 months", "₹28k / month"],
];

export function Brand() {
  return (
    <Link to="/" className="group flex items-center gap-3">
      <span className="relative grid size-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.45)] transition-transform duration-300 group-hover:scale-105">
        <GraduationCap className="size-5" />
      </span>
      <span className="font-display text-xl font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
        Acad<span className="text-gradient">In</span>
      </span>
    </Link>
  );
}

function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070A13]/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Brand />
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 lg:flex">
          <Link to="/about" className="transition hover:text-indigo-400">
            About
          </Link>
          <Link to="/features" className="transition hover:text-indigo-400">
            Platform Capabilities
          </Link>
          <Link to="/internships" className="transition hover:text-indigo-400">
            Internships
          </Link>
          <Link to="/jobs" className="transition hover:text-indigo-400">
            Career Postings
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden text-slate-300 hover:text-white hover:bg-white/5 sm:inline-flex"
          >
            <Link to="/login">Sign In</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:brightness-110 hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] border-0"
          >
            <Link to="/roles">
              Launch Portal <ArrowRight className="size-4 ml-1.5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function PageFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#070A13] text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2 space-y-3">
            <Brand />
            <p className="max-w-md text-sm text-slate-400 leading-relaxed">
              AcadIn is the unified intelligence layer connecting higher education with industry
              hiring, transforming curriculum outcomes into verified talent signals.
            </p>
          </div>
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-wider text-white">
              Workspaces
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/roles" className="hover:text-indigo-300">
                  Student Portal
                </Link>
              </li>
              <li>
                <Link to="/roles" className="hover:text-indigo-300">
                  Industry Recruiter
                </Link>
              </li>
              <li>
                <Link to="/roles" className="hover:text-indigo-300">
                  Academician Suite
                </Link>
              </li>
              <li>
                <Link to="/roles" className="hover:text-indigo-300">
                  Institution Analytics
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-wider text-white">
              Platform
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-indigo-300">
                  About AcadIn
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-indigo-300">
                  Features & Intelligence
                </Link>
              </li>
              <li>
                <Link to="/internships" className="hover:text-indigo-300">
                  Browse Internships
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-indigo-300">
                  Browse Jobs
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© 2026 AcadIn Platform. Built for academia and industry collaboration.</p>
          <p className="text-slate-400">Dark Enterprise SaaS Edition</p>
        </div>
      </div>
    </footer>
  );
}

function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#070A13] text-white">
      <PublicHeader />
      {children}
      <PageFooter />
    </div>
  );
}

export function LandingPage() {
  const [activeEcosystem, setActiveEcosystem] = useState<Role>("student");

  return (
    <PublicLayout>
      <main>
        {/* Futuristic Hero Section */}
        <section className="relative overflow-hidden border-b border-white/10 py-20 sm:py-28">
          <div className="hero-grid absolute inset-0 pointer-events-none" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <motion.div
              initial="hidden"
              animate="show"
              variants={fade}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.25)] backdrop-blur-sm">
                <Sparkles className="size-3.5 text-indigo-400 animate-pulse" />
                AI Skill & Placement Intelligence Engine
              </div>

              <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">
                Where Academia <br />
                <span className="text-gradient">Meets Industry.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
                The unified intelligence platform connecting students, academicians, industry
                recruiters, and institutions in one living skills and placement ecosystem.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold shadow-[0_0_25px_rgba(99,102,241,0.45)] hover:shadow-[0_0_35px_rgba(168,85,247,0.6)] border-0 h-12 px-6"
                >
                  <Link to="/roles">
                    Explore All Workspaces <ArrowRight className="size-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 h-12 px-6 backdrop-blur-sm"
                >
                  <Link to="/features">Platform Architecture</Link>
                </Button>
              </div>

              {/* Connected Ecosystem Status Bar */}
              <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-white/10 pt-6">
                <div>
                  <p className="font-display text-2xl font-bold text-white">24k+</p>
                  <p className="text-xs font-medium text-slate-400">Skills Mapped</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-indigo-400">520+</p>
                  <p className="text-xs font-medium text-slate-400">Partner Companies</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-purple-400">96.4%</p>
                  <p className="text-xs font-medium text-slate-400">Match Confidence</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-emerald-400">3.4x</p>
                  <p className="text-xs font-medium text-slate-400">Placement Velocity</p>
                </div>
              </div>
            </motion.div>

            {/* Interactive Futuristic Live Signal Radar Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-8"
            >
              <div className="absolute -right-16 -top-16 size-48 rounded-full bg-purple-500/20 blur-3xl" />
              <div className="absolute -left-16 -bottom-16 size-48 rounded-full bg-cyan-500/20 blur-3xl" />

              <div className="relative flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                    <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-300">
                      Live AI Talent Signal
                    </p>
                  </div>
                  <p className="mt-1 font-display text-xl font-bold text-white">
                    Frontend & Applied ML Specialist
                  </p>
                  <p className="text-xs text-slate-400">
                    Candidate: Sanket Kumar Rana · NIT Raipur
                  </p>
                </div>
                <span className="grid size-12 place-items-center rounded-2xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                  <Cpu className="size-6" />
                </span>
              </div>

              <div className="relative mt-6 grid grid-cols-[auto_1fr] items-center gap-6">
                <div className="relative grid place-items-center rounded-full border-[10px] border-indigo-500/15 p-4 shadow-[0_0_25px_rgba(99,102,241,0.2)]">
                  <div className="grid size-24 place-items-center rounded-full border-[8px] border-indigo-500 bg-slate-950 font-display text-2xl font-extrabold text-white shadow-[0_0_15px_rgba(99,102,241,0.6)]">
                    94<span className="text-xs text-indigo-300">%</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Verified Capability Overlap</span>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {["React", "TypeScript", "PyTorch", "APIs"].map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 font-medium text-indigo-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-400">
                      <span>Role Readiness Index</span>
                      <span className="text-emerald-400 font-semibold">Tier 1 · High Fit</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative mt-6 rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-inner">
                <div className="flex items-start gap-3">
                  <Sparkles className="size-5 shrink-0 text-pink-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-slate-200">
                      Explainable AI Match Breakdown
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      Project portfolio demonstrates hands-on distributed state and ATS parsing
                      matching Nexora Labs' active requisition.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Four Connected Ecosystem Possibilities */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-semibold text-purple-300">
              <Workflow className="size-3.5 text-purple-400" />
              Connected Ecosystem Architecture
            </div>
            <h2 className="mt-4 font-display text-4xl font-extrabold text-white sm:text-5xl">
              One ecosystem. <span className="text-gradient">Four possibilities.</span>
            </h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              Every participant operates within a tailored workspace that feeds verified data back
              into the network.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {roles.map(({ value, label, description, icon: Icon }) => (
              <motion.div
                key={value}
                whileHover={{ y: -4 }}
                className={cn(
                  "glass-card-interactive group relative flex flex-col justify-between rounded-3xl p-6",
                  activeEcosystem === value &&
                    "border-indigo-500/50 shadow-[0_0_25px_rgba(99,102,241,0.25)]",
                )}
                onClick={() => setActiveEcosystem(value)}
              >
                <div>
                  <span className="grid size-12 place-items-center rounded-2xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)] group-hover:scale-110 transition-transform">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mt-6 font-display text-2xl font-bold text-white">{label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10">
                  <Link
                    to="/roles"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Open {label} Suite <ChevronRight className="size-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Skill Intelligence Engine */}
        <section className="border-y border-white/10 bg-slate-950/60 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <Badge className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
                  Real-Time Competency Modeling
                </Badge>
                <h2 className="mt-4 font-display text-3xl font-extrabold text-white sm:text-5xl">
                  Skill Intelligence <br />
                  <span className="text-gradient">Engineered for Trust.</span>
                </h2>
                <p className="mt-4 text-slate-300 leading-relaxed">
                  Assessments are no longer static scores. AcadIn models student problem-solving,
                  code telemetry, and coursework into explainable radar vectors and growth roadmaps.
                </p>
                <div className="mt-8 space-y-4">
                  {[
                    [
                      "AI-Adaptive 20-Question Assessments",
                      "Evaluates core fundamentals, technical agility, and systems thinking in timed sessions.",
                    ],
                    [
                      "Dynamic Employability Index",
                      "Continuous scoring based on verifiable milestones, GitHub repos, and peer certifications.",
                    ],
                    [
                      "Targeted Skill Gap Remedies",
                      "Personalized week-by-week learning roadmaps to close high-impact gaps for target roles.",
                    ],
                  ].map(([title, desc]) => (
                    <div key={title} className="flex items-start gap-3.5">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-indigo-500/20 text-indigo-400 mt-1">
                        <Check className="size-3.5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">{title}</p>
                        <p className="text-xs text-slate-400 leading-relaxed mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Radar Graphic Card */}
              <div className="glass-panel rounded-3xl p-6 sm:p-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Competency Vector
                    </p>
                    <p className="text-lg font-bold text-white">Full-Stack Intelligence Index</p>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                  >
                    Validated
                  </Badge>
                </div>
                <div className="mt-6 h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      data={[
                        { subject: "Problem Solving", A: 92 },
                        { subject: "Full-Stack Web", A: 95 },
                        { subject: "AI / ML Pipelines", A: 88 },
                        { subject: "Cloud DevOps", A: 74 },
                        { subject: "System Design", A: 82 },
                        { subject: "Communication", A: 89 },
                      ]}
                    >
                      <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#94A3B8", fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name="Competency"
                        dataKey="A"
                        stroke="#818CF8"
                        fill="#6366F1"
                        fillOpacity={0.35}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Opportunity Engine Section */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <Badge className="border-purple-500/30 bg-purple-500/10 text-purple-300">
                High-Fit Matching
              </Badge>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl">
                Live Opportunity Engine
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Discover verified internships and jobs filtered by AI compatibility.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="border-white/15 bg-white/5 text-white hover:bg-white/10"
            >
              <Link to="/internships">
                View All Opportunities <ArrowRight className="size-4 ml-1.5" />
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {internships.slice(0, 3).map((item) => (
              <div
                key={item[0]}
                className="glass-card-interactive rounded-3xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="border-indigo-500/30 bg-indigo-500/15 text-indigo-300"
                    >
                      {item[2]} Match
                    </Badge>
                    <span className="text-xs font-semibold text-emerald-400">{item[4]}</span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold text-white">{item[0]}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {item[1]} · {item[3]}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Verified Recruiter</span>
                  <Button
                    asChild
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white"
                  >
                    <Link to="/roles">Apply Now</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* High-Impact Closing CTA Banner */}
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/80 via-slate-900/90 to-purple-950/80 p-8 sm:p-14 shadow-[0_0_50px_rgba(99,102,241,0.3)]">
            <div className="absolute -right-20 -bottom-20 size-64 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="relative max-w-2xl">
              <Badge className="border-pink-500/30 bg-pink-500/15 text-pink-300">
                Empowering Higher Ed & Enterprise
              </Badge>
              <h2 className="mt-4 font-display text-4xl font-extrabold text-white sm:text-5xl">
                Ready to transform campus collaboration?
              </h2>
              <p className="mt-4 text-slate-300 leading-relaxed">
                Join students, academicians, and hiring teams already leveraging AcadIn to make
                potential visible.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold shadow-[0_0_25px_rgba(99,102,241,0.5)] border-0"
                >
                  <Link to="/roles">
                    Get Started Now <ArrowRight className="size-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  <Link to="/login">Sign In to Workspace</Link>
                </Button>
              </div>
            </div>
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
          <Badge className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
            The Intelligence Layer
          </Badge>
          <h1 className="mt-5 font-display text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
            A clearer path from campus to contribution.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-300">
            AcadIn is a comprehensive academia–industry collaboration platform: a shared operating
            layer where students, educators, institutions, and industry partners work from the same
            verifiable evidence.
          </p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            [
              "01",
              "For Students",
              "Build a living digital portfolio that proves what you can actually build, accompanied by verified skill assessments and an ATS resume studio.",
            ],
            [
              "02",
              "For Educators",
              "Access structured faculty internships, industrial training programs, sponsored R&D projects, and guide student cohorts with real data.",
            ],
            [
              "03",
              "For Industry",
              "Reach top-tier pre-screened talent with explainable AI matching, manage hiring pipelines, and sponsor real-world collegiate research.",
            ],
          ].map(([n, t, d]) => (
            <div key={n} className="glass-card-interactive rounded-3xl p-8">
              <span className="font-display text-sm font-bold text-indigo-400">{n}</span>
              <h2 className="mt-6 font-display text-2xl font-bold text-white">{t}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{d}</p>
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
      "AI Skill Intelligence",
      "Adaptive 20-question assessments that turn problem-solving telemetry into actionable readiness scores.",
    ],
    [
      BriefcaseBusiness,
      "Opportunity Marketplace",
      "Internships, career jobs, and faculty training programs ranked with transparent reasoning.",
    ],
    [
      LineChart,
      "Institutional Outcomes",
      "Campus-wide placement funnels, department audit metrics, and one-click NAAC/NBA compliance exports.",
    ],
    [
      ShieldCheck,
      "Verified Credential Vault",
      "Role-aware security, verifiable certificate badges, and high-confidence recruiting pipelines.",
    ],
  ] as const;

  return (
    <PublicLayout>
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Badge className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
          Platform Architecture
        </Badge>
        <h1 className="mt-4 max-w-3xl font-display text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
          Everything that makes a talent signal useful.
        </h1>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {features.map(([Icon, title, body]) => (
            <article key={title} className="glass-card-interactive rounded-3xl p-8 sm:p-10">
              <span className="grid size-12 place-items-center rounded-2xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                <Icon className="size-6" />
              </span>
              <h2 className="mt-8 font-display text-2xl font-bold text-white">{title}</h2>
              <p className="mt-3 leading-relaxed text-slate-400 text-sm">{body}</p>
              <Link
                to="/roles"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Launch workspace demo <ChevronRight className="size-4" />
              </Link>
            </article>
          ))}
        </div>
      </main>
    </PublicLayout>
  );
}

function OpportunityCard({
  item,
  job,
}: {
  item: readonly string[] | string[];
  job?: boolean | undefined;
}) {
  return (
    <article className="glass-card-interactive flex flex-col justify-between rounded-3xl p-6">
      <div>
        <div className="flex items-center justify-between gap-3">
          <Badge
            variant="outline"
            className="border-indigo-500/30 bg-indigo-500/15 text-indigo-300"
          >
            {job ? "Full-Time" : item[2]}
          </Badge>
          <span className="text-xs font-semibold text-emerald-400">{item[4] ?? item[3]}</span>
        </div>
        <h3 className="mt-4 font-display text-lg font-bold text-white">{item[0]}</h3>
        <p className="mt-1 text-xs text-slate-400">{item[1]}</p>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-xs text-slate-400">{job ? item[2] : item[3]}</span>
        <Button
          asChild
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
        >
          <Link to="/roles">Apply</Link>
        </Button>
      </div>
    </article>
  );
}

export function MarketplacePage({ job }: { job?: boolean }) {
  const [query, setQuery] = useState("");
  const raw = job ? jobs : internships;
  const data = raw.filter((item) =>
    query
      ? item[0]?.toLowerCase().includes(query.toLowerCase()) ||
        item[1]?.toLowerCase().includes(query.toLowerCase())
      : true,
  );

  return (
    <PublicLayout>
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Badge className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
              {job ? "Verified Careers" : "Industry Internships"}
            </Badge>
            <h1 className="mt-3 font-display text-4xl font-extrabold text-white sm:text-5xl">
              {job ? "Explore Career Opportunities" : "Discover Verified Internships"}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Search roles with transparent requirements and AI fit scoring.
            </p>
          </div>
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search roles or companies..."
              className="pl-10 border-white/10 bg-slate-900/80 text-white placeholder:text-slate-500"
            />
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {["All Opportunities", "Remote", "Engineering", "Machine Learning", "Product Design"].map(
            (tag, idx) => (
              <Badge
                key={tag}
                variant="outline"
                className={cn(
                  "cursor-pointer border-white/10 bg-slate-900/60 text-slate-300 hover:border-indigo-500/50 hover:text-white",
                  idx === 0 && "border-indigo-500/50 bg-indigo-500/15 text-indigo-300",
                )}
              >
                {tag}
              </Badge>
            ),
          )}
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
    ["/industry/post", "Post Opportunity", Plus],
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
    <nav className="space-y-1.5">
      {items.map(([to, label, Icon]) => {
        const active = path === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={close}
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
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function PortalShell({ role, children }: { role: Role; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const title = roles.find((item) => item.value === role)?.label ?? "Workspace";
  const { profile } = useAppState();

  return (
    <div className="min-h-screen bg-[#070A13] text-white">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-white/10 bg-[#0B0F19]/90 px-5 py-6 backdrop-blur-2xl lg:flex">
        <Brand />
        <p className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-[.2em] text-slate-500">
          {title} Workspace
        </p>
        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          <ShellNav role={role} />
        </div>
        <div className="mt-5 border-t border-white/10 pt-5 space-y-3">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/80 p-3 shadow-inner">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-300">
              <CircleUserRound className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {profile.name || "Sanket Kumar Rana"}
              </p>
              <p className="truncate text-xs text-slate-400 capitalize">{role} Account</p>
            </div>
          </div>
          <div className="flex items-center justify-between px-1">
            <Link
              to="/"
              className="text-xs font-medium text-slate-400 hover:text-indigo-300 transition-colors"
            >
              ← Return Home
            </Link>
            <Link
              to="/login"
              className="text-xs font-medium text-slate-400 hover:text-rose-400 transition-colors"
            >
              Switch Role
            </Link>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[#070A13]/80 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden border-white/10 bg-slate-900/60 text-white"
                >
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="flex h-full w-72 flex-col bg-[#0B0F19] border-white/10 p-5 text-white"
              >
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <Brand />
                <div className="flex-1 min-h-0 overflow-y-auto mt-8">
                  <ShellNav role={role} close={() => setOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
            <span className="font-display text-lg font-bold text-white lg:hidden">AcadIn</span>
            <div className="hidden items-center gap-2 text-sm text-slate-400 lg:flex">
              <span className="font-semibold text-white">{title}</span>
              <ChevronRight className="size-4" />
              <span className="text-slate-400">Live Workspace</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected
            </span>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              className="text-slate-400 hover:text-white hover:bg-white/5"
            >
              <Bell className="size-4" />
            </Button>
            <span className="grid size-9 place-items-center rounded-full border border-purple-500/40 bg-purple-500/20 text-xs font-bold text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              SK
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:py-10">{children}</main>
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
          <p className="text-xs font-bold uppercase tracking-[.2em] text-indigo-400">{eyebrow}</p>
        )}
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-2xl">{description}</p>
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
    <div className="glass-card-interactive rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <span className="grid size-10 place-items-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.2)]">
          <Icon className="size-5" />
        </span>
        <span className="text-xs font-semibold text-emerald-400">{trend}</span>
      </div>
      <p className="mt-4 font-display text-3xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{label}</p>
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
    <section className="glass-panel rounded-3xl p-6 sm:p-7">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <h2 className="font-display text-lg font-bold text-white">{title}</h2>
        {action}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function StudentOverview() {
  return (
    <>
      <WorkspaceHeader
        eyebrow="Student Command Center"
        title="Good morning, Sanket."
        description="Your verified competency graph and live applications are actively matching top partner teams."
        action={
          <Button
            asChild
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-[0_0_20px_rgba(99,102,241,0.4)]"
          >
            <Link to="/student/assessment">
              Take AI Assessment <ArrowRight className="size-4 ml-1.5" />
            </Link>
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Profile Strength" value="94%" trend="+12% verified" icon={UserRound} />
        <Stat label="Skill Readiness" value="88 pts" trend="+8 this month" icon={Sparkles} />
        <Stat label="Recommended Roles" value="28" trend="6 high fit" icon={Target} />
        <Stat label="Active Applications" value="08" trend="3 shortlisted" icon={FileText} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <SectionCard
          title="Capability Readiness Matrix"
          action={
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-indigo-400 hover:text-indigo-300"
            >
              <Link to="/student/analysis">
                Full Report <ArrowRight className="size-4 ml-1" />
              </Link>
            </Button>
          }
        >
          <div className="space-y-4">
            {[
              ["Problem Solving & DSA", 92],
              ["Frontend & React Systems", 95],
              ["Python & ML Pipelines", 86],
              ["Cloud Infrastructure & APIs", 78],
            ].map(([name, value]) => (
              <div key={name as string}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-300">{name as string}</span>
                  <span className="font-display font-semibold text-indigo-300">
                    {value as number}%
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-900 border border-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Targeted Weekly Focus">
          <div className="flex items-center gap-6">
            <div className="grid size-28 place-items-center rounded-full border-[8px] border-indigo-500/20 bg-slate-950 shadow-[0_0_20px_rgba(99,102,241,0.25)]">
              <div className="font-display text-3xl font-extrabold text-white">
                4<span className="text-sm text-indigo-300">/5</span>
              </div>
            </div>
            <div>
              <p className="font-display text-base font-bold text-white">
                High Placement Trajectory
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                Complete 1 cloud fundamentals module to unlock Tier-1 engineering requisitions.
              </p>
              <Button
                asChild
                variant="link"
                className="mt-2 h-auto p-0 text-indigo-400 hover:text-indigo-300"
              >
                <Link to="/student/roadmap">
                  Open Learning Roadmap <ArrowRight className="size-3.5 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </SectionCard>
      </div>
      <SectionCard
        title="High-Fit Opportunities For You"
        action={
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-indigo-400 hover:text-indigo-300"
          >
            <Link to="/student/internships">
              View All <ArrowRight className="size-4 ml-1" />
            </Link>
          </Button>
        }
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {internships.slice(0, 3).map((item) => (
            <OpportunityCard key={item[0]} item={item} />
          ))}
        </div>
      </SectionCard>
    </>
  );
}

function StudentSection({ section }: { section: string }) {
  if (section === "overview") return <StudentOverview />;
  if (section === "assessment") return <StudentAssessment />;
  if (section === "analysis") return <StudentSkillReport />;
  return <FunctionalStudentModule section={section} />;
}

function IndustrySection({ section }: { section: string }) {
  if (section === "post") return <IndustryPostOpportunity />;
  if (section === "applications") return <IndustryApplicants />;
  if (section === "candidates") return <IndustryCandidates />;
  if (section === "interviews") return <IndustryInterviews />;
  if (section === "workshops") return <IndustryWorkshops />;
  if (section === "analytics") return <IndustryAnalytics />;
  return <IndustryOverview />;
}

function AcademicianSection({ section }: { section: string }) {
  if (section === "internships") return <AcademicianInternships />;
  if (section === "training") return <AcademicianTraining />;
  if (section === "fdps") return <AcademicianFDPs />;
  if (section === "consultancy") return <AcademicianConsultancy />;
  if (section === "research") return <AcademicianResearch />;
  if (section === "lectures") return <AcademicianLectures />;
  if (section === "mentorship") return <AcademicianMentorship />;
  return <AcademicianOverview />;
}

function InstitutionSection({ section }: { section: string }) {
  if (section === "outcomes") return <InstitutionStudents />;
  if (section === "placements") return <InstitutionPlacements />;
  if (section === "internships") return <InstitutionInternships />;
  if (section === "skills") return <InstitutionSkills />;
  if (section === "departments") return <InstitutionDepartments />;
  if (section === "recruiters" || section === "partners") return <InstitutionRecruiters />;
  if (section === "reports") return <InstitutionReports />;
  return <InstitutionOverview />;
}

export function PortalPage({ role, section = "overview" }: { role: Role; section?: string }) {
  if (role === "student") return <StudentSection section={section} />;
  if (role === "industry") return <IndustrySection section={section} />;
  if (role === "academician") return <AcademicianSection section={section} />;
  if (role === "institution") return <InstitutionSection section={section} />;
  return <StudentSection section={section} />;
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
  return message ? <p className="text-xs text-rose-400 mt-1">{message}</p> : null;
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
    <div className="grid min-h-screen lg:grid-cols-2 bg-[#070A13] text-white">
      <div className="hero-grid hidden bg-slate-950 p-12 lg:flex lg:flex-col lg:justify-between border-r border-white/10">
        <Brand />
        <div className="max-w-lg space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300">
            <Sparkles className="size-3.5" />
            AcadIn Intelligence Cloud
          </div>
          <h1 className="font-display text-5xl font-extrabold leading-tight text-white">
            The right signal <br />
            <span className="text-gradient">changes everything.</span>
          </h1>
          <p className="text-slate-400 leading-relaxed text-base">
            One unified workspace connecting capability, verified credentials, and institutional
            outcomes.
          </p>
        </div>
        <p className="text-xs text-slate-500">AcadIn · Academia–Industry Collaboration Platform</p>
      </div>

      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel w-full max-w-md rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.6)]"
        >
          <div className="mb-8 lg:hidden">
            <Brand />
          </div>
          <h2 className="font-display text-3xl font-extrabold text-white">{title}</h2>
          <p className="mt-2 text-sm text-slate-400">{description}</p>
          {children}
          <p className="mt-6 text-center text-xs text-slate-500">
            <Link className="font-medium text-indigo-400 hover:text-indigo-300" to="/">
              ← Back to homepage
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function RolePicker({ value, onChange }: { value: Role; onChange: (role: Role) => void }) {
  return (
    <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
      {roles.map(({ value: role, label, icon: Icon }) => (
        <button
          key={role}
          type="button"
          onClick={() => onChange(role)}
          className={cn(
            "flex items-center gap-3 rounded-2xl border p-3.5 text-left text-sm transition-all duration-200",
            value === role
              ? "border-indigo-500 bg-gradient-to-r from-indigo-600/30 to-purple-600/20 text-white shadow-[0_0_15px_rgba(99,102,241,0.25)]"
              : "border-white/10 bg-slate-900/60 text-slate-400 hover:border-white/20 hover:text-white",
          )}
        >
          <Icon className={cn("size-4", value === role ? "text-indigo-400" : "text-slate-400")} />
          <span className="flex-1 font-semibold">{label}</span>
          {value === role && <Check className="size-4 text-indigo-400" />}
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
  const submit = () => {
    authenticate(role);
    toast.success(`Signed in as ${roles.find((item) => item.value === role)?.label}`);
    navigate({ to: destination(role) });
  };

  return (
    <AuthFrame title="Welcome back" description="Sign in to your AcadIn workspace.">
      <RolePicker value={role} onChange={setRole} />
      <form className="mt-6 space-y-4" onSubmit={form.handleSubmit(submit)}>
        <div className="space-y-1.5">
          <Label htmlFor="login-email" className="text-xs font-semibold text-slate-300">
            Email Address
          </Label>
          <Input
            id="login-email"
            type="email"
            className="border-white/10 bg-slate-900/80 text-white"
            {...form.register("email")}
          />
          <FieldError message={form.formState.errors.email?.message} />
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <Label htmlFor="login-password" className="text-xs font-semibold text-slate-300">
              Password
            </Label>
            <Link
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300"
              to="/forgot-password"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="login-password"
            type="password"
            className="border-white/10 bg-slate-900/80 text-white"
            {...form.register("password")}
          />
          <FieldError message={form.formState.errors.password?.message} />
        </div>
        <Button
          className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:brightness-110"
          type="submit"
        >
          Sign In to Workspace <ArrowRight className="size-4 ml-1.5" />
        </Button>
      </form>
      <p className="mt-6 text-center text-xs text-slate-400">
        New to AcadIn?{" "}
        <Link className="font-semibold text-indigo-400 hover:text-indigo-300" to="/register">
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
      description="Start with an intelligent role-specific workspace."
    >
      <RolePicker value={role} onChange={setRole} />
      <form className="mt-6 space-y-4" onSubmit={form.handleSubmit(submit)}>
        <div className="space-y-1.5">
          <Label htmlFor="register-name" className="text-xs font-semibold text-slate-300">
            Full Name
          </Label>
          <Input
            id="register-name"
            className="border-white/10 bg-slate-900/80 text-white"
            {...form.register("name")}
          />
          <FieldError message={form.formState.errors.name?.message} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="register-email" className="text-xs font-semibold text-slate-300">
            Work or University Email
          </Label>
          <Input
            id="register-email"
            type="email"
            className="border-white/10 bg-slate-900/80 text-white"
            {...form.register("email")}
          />
          <FieldError message={form.formState.errors.email?.message} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="register-password" className="text-xs font-semibold text-slate-300">
            Password
          </Label>
          <Input
            id="register-password"
            type="password"
            className="border-white/10 bg-slate-900/80 text-white"
            {...form.register("password")}
          />
          <FieldError message={form.formState.errors.password?.message} />
        </div>
        <label className="flex items-start gap-2 text-xs text-slate-400">
          <input
            type="checkbox"
            className="mt-0.5 accent-indigo-500"
            {...form.register("accepted")}
          />
          <span>I agree to the AcadIn terms of service and privacy policy.</span>
        </label>
        <FieldError message={form.formState.errors.accepted?.message} />
        <Button
          className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:brightness-110"
          type="submit"
        >
          Create Account <ArrowRight className="size-4 ml-1.5" />
        </Button>
      </form>
      <p className="mt-6 text-center text-xs text-slate-400">
        Already registered?{" "}
        <Link className="font-semibold text-indigo-400 hover:text-indigo-300" to="/login">
          Sign In
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
          ? "A mock reset link has been dispatched to your email address."
          : "Enter your registered email and we will send a recovery link."
      }
    >
      {sent ? (
        <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-xs text-emerald-300 leading-relaxed">
          Reset instructions sent. In this demo workspace, you can directly sign in.
        </div>
      ) : (
        <form className="mt-6 space-y-4" onSubmit={form.handleSubmit(submit)}>
          <div className="space-y-1.5">
            <Label htmlFor="forgot-email" className="text-xs font-semibold text-slate-300">
              Email Address
            </Label>
            <Input
              id="forgot-email"
              type="email"
              className="border-white/10 bg-slate-900/80 text-white"
              {...form.register("email")}
            />
            <FieldError message={form.formState.errors.email?.message} />
          </div>
          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
            type="submit"
          >
            Send Reset Link <ArrowRight className="size-4 ml-1.5" />
          </Button>
        </form>
      )}
      <p className="mt-6 text-center text-xs text-slate-400">
        <Link className="font-semibold text-indigo-400 hover:text-indigo-300" to="/login">
          Return to Sign In
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
      <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/80 p-5 space-y-3">
        <span className="grid size-11 place-items-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-300">
          <Check className="size-5" />
        </span>
        <p className="font-display text-base font-bold text-white">Verification Link Sent</p>
        <p className="text-xs leading-relaxed text-slate-400">
          Open the verification link sent to your inbox, then continue as a{" "}
          <strong className="text-indigo-300 capitalize">
            {roles.find((item) => item.value === role)?.label ?? "Student"}
          </strong>
          .
        </p>
      </div>
      <Button
        className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold"
        onClick={() => {
          authenticate(role);
          navigate({ to: destination(role) });
        }}
      >
        I Verified My Email <ArrowRight className="size-4 ml-1.5" />
      </Button>
      <Button
        variant="outline"
        className="mt-3 w-full border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
        onClick={() => setResent(true)}
      >
        {resent ? "Verification link resent" : "Resend Verification Link"}
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
      description="Select the role you want to explore in this interactive demo."
    >
      <RolePicker value={role} onChange={setRole} />
      <Button
        className="mt-7 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:brightness-110"
        onClick={() => {
          authenticate(role);
          navigate({ to: destination(role) });
        }}
      >
        Launch {roles.find((item) => item.value === role)?.label} Suite{" "}
        <ArrowRight className="size-4 ml-1.5" />
      </Button>
    </AuthFrame>
  );
}

export { ForgotPasswordForm, VerifyEmailPage };
