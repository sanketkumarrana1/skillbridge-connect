import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Award,
  Building2,
  CheckCircle2,
  Clock,
  Database,
  FileCheck,
  GraduationCap,
  History,
  Layers,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppState } from "@/context/app-state";

const ROLE_COLORS = ["#6366F1", "#A855F7", "#3B82F6", "#10B981"];

export function AdminDashboardView() {
  const {
    platformMetrics,
    companyVerifications,
    moderatedOpportunities,
    adminAuditLogs,
  } = useAppState();

  const userDistributionData = [
    { name: "Students", count: platformMetrics.totalStudents },
    { name: "Academicians", count: platformMetrics.totalAcademicians },
    { name: "Recruiters", count: platformMetrics.totalCompanies },
    { name: "Institutions", count: platformMetrics.totalInstitutions },
  ];

  const placementPipelineData = [
    { stage: "Applications", volume: platformMetrics.totalApplications },
    { stage: "Shortlisted", volume: Math.round(platformMetrics.totalApplications * 0.65) },
    { stage: "Interviews", volume: Math.round(platformMetrics.totalApplications * 0.4) },
    { stage: "Offers", volume: Math.round(platformMetrics.totalApplications * 0.25) },
    { stage: "Placements", volume: platformMetrics.totalPlacements },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Badge className="border-indigo-500/30 bg-indigo-500/15 text-indigo-300 font-semibold mb-2">
              <ShieldCheck className="size-3 mr-1.5" /> Platform Governance Console
            </Badge>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Platform Health & Oversight
            </h1>
            <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
              Global administration telemetry across student portfolios, faculty research grants,
              recruiter company authentications, and institutional accreditation tracking.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs h-9"
            >
              <Link to="/admin/companies">
                <Building2 className="size-3.5 mr-1.5" /> Review Companies (
                {platformMetrics.pendingVerifications})
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/10 bg-slate-900 text-slate-300 hover:text-white text-xs h-9"
            >
              <Link to="/admin/skills">
                <Database className="size-3.5 mr-1.5" /> Manage Skills
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-white/10 bg-slate-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Registered Users</span>
            <Users className="size-4 text-indigo-400" />
          </div>
          <p className="font-display text-3xl font-extrabold text-white">
            {platformMetrics.totalUsers + 280}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
            <TrendingUp className="size-3" /> +14.2% platform growth this month
          </div>
        </Card>

        <Card className="rounded-2xl border-white/10 bg-slate-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Partner Companies</span>
            <Building2 className="size-4 text-blue-400" />
          </div>
          <p className="font-display text-3xl font-extrabold text-white">
            {platformMetrics.totalCompanies}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-medium">
            <Clock className="size-3" /> {platformMetrics.pendingVerifications} verification requests pending
          </div>
        </Card>

        <Card className="rounded-2xl border-white/10 bg-slate-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Opportunities</span>
            <Layers className="size-4 text-purple-400" />
          </div>
          <p className="font-display text-3xl font-extrabold text-white">
            {platformMetrics.activeOpportunities}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-indigo-300 font-medium">
            <Activity className="size-3" /> {platformMetrics.totalApplications} student applications
          </div>
        </Card>

        <Card className="rounded-2xl border-white/10 bg-slate-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Placements</span>
            <Award className="size-4 text-emerald-400" />
          </div>
          <p className="font-display text-3xl font-extrabold text-emerald-400">
            {platformMetrics.totalPlacements}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 font-medium">
            <CheckCircle2 className="size-3" /> 86.4% institutional conversion rate
          </div>
        </Card>
      </div>

      {/* Visual Telemetry Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Distribution */}
        <Card className="rounded-2xl border-white/10 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Platform Cohort Distribution
              </h3>
              <p className="text-xs text-slate-400">Active users across participating stakeholders</p>
            </div>
            <Badge variant="outline" className="border-white/10 text-xs text-slate-400">
              Live
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0B0E17",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recruitment Pipeline Conversion */}
        <Card className="rounded-2xl border-white/10 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Recruitment Pipeline Telemetry
              </h3>
              <p className="text-xs text-slate-400">Application funnel from submission to verified hire</p>
            </div>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-xs">
              Synchronous
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={placementPipelineData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis dataKey="stage" type="category" stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0B0E17",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="volume" fill="#10B981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Moderation & Audit Overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pending Company Verifications */}
        <Card className="rounded-2xl border-white/10 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
              <Building2 className="size-4 text-blue-400" /> Company Verifications
            </h3>
            <Link
              to="/admin/companies"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              View All →
            </Link>
          </div>

          <div className="space-y-2.5">
            {companyVerifications.slice(0, 3).map((comp) => (
              <div
                key={comp.id}
                className="rounded-xl border border-white/10 bg-slate-950/60 p-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-white leading-tight">{comp.companyName}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{comp.industry}</p>
                </div>
                <Badge
                  className={
                    comp.verificationStatus === "Verified"
                      ? "bg-emerald-500/10 text-emerald-300 text-[10px]"
                      : "bg-amber-500/10 text-amber-300 text-[10px]"
                  }
                >
                  {comp.verificationStatus}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Opportunity Moderations */}
        <Card className="rounded-2xl border-white/10 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
              <Layers className="size-4 text-purple-400" /> Moderation Queue
            </h3>
            <Link
              to="/admin/opportunities"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Review →
            </Link>
          </div>

          <div className="space-y-2.5">
            {moderatedOpportunities.slice(0, 3).map((opp) => (
              <div
                key={opp.id}
                className="rounded-xl border border-white/10 bg-slate-950/60 p-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-white leading-tight">{opp.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{opp.company} · {opp.type}</p>
                </div>
                <Badge
                  className={
                    opp.status === "Published"
                      ? "bg-emerald-500/10 text-emerald-300 text-[10px]"
                      : "bg-amber-500/10 text-amber-300 text-[10px]"
                  }
                >
                  {opp.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Audit Logs */}
        <Card className="rounded-2xl border-white/10 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
              <History className="size-4 text-emerald-400" /> Recent Audit Events
            </h3>
            <Link
              to="/admin/audit"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Full Log →
            </Link>
          </div>

          <div className="space-y-2.5">
            {adminAuditLogs.slice(0, 3).map((log) => (
              <div key={log.id} className="rounded-xl border border-white/10 bg-slate-950/60 p-3 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-200">{log.action}</span>
                  <span className="text-slate-500 font-mono">{log.timestamp.split(",")[0]}</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">{log.details}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

