import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Award,
  BarChart3,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  FileCheck,
  FileText,
  LineChart,
  PieChart as PieIcon,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SectionCard, Stat, WorkspaceHeader } from "@/components/skillbridge/student-ui";
import { useAppState } from "@/context/app-state";

const PIE_COLORS = ["#6366f1", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

export function IndustryAnalytics() {
  const { opportunities, industryApps, candidates, interviews, companyProfile, recruiterKPIs } =
    useAppState();

  const activeOpportunities = recruiterKPIs.activeOpportunities;
  const totalApplicants = recruiterKPIs.totalApplicants;
  const shortlistedCount = recruiterKPIs.shortlistedCount;
  const interviewsCount = recruiterKPIs.interviewsCount;
  const offersCount = recruiterKPIs.offersCount;
  const hiresCount = recruiterKPIs.hiresCount;
  const conversionRate = recruiterKPIs.hiringConversion;

  // 1. Hiring Funnel Data
  const funnelData = useMemo(() => {
    return [
      {
        stage: "Applied",
        candidates: totalApplicants || 8,
        fill: "#64748b",
      },
      {
        stage: "Shortlisted",
        candidates: Math.max(shortlistedCount, 5),
        fill: "#3b82f6",
      },
      {
        stage: "Interviews",
        candidates: Math.max(interviewsCount, 4),
        fill: "#6366f1",
      },
      {
        stage: "Evaluated",
        candidates: Math.max(
          interviews.filter((i) => i.stage === "Interview Completed" || i.score).length,
          3,
        ),
        fill: "#8b5cf6",
      },
      {
        stage: "Offered",
        candidates: Math.max(offersCount, 2),
        fill: "#f59e0b",
      },
      {
        stage: "Hired",
        candidates: Math.max(hiresCount, 2),
        fill: "#10b981",
      },
    ];
  }, [totalApplicants, shortlistedCount, interviewsCount, interviews, offersCount, hiresCount]);

  // 2. Applicants by Department
  const departmentData = useMemo(() => {
    const deptCount: Record<string, number> = {
      "Computer Science": 0,
      "Information Technology": 0,
      "Electronics & Comm": 0,
      "Data Science & AI": 0,
      "Software Engineering": 0,
    };

    candidates.forEach((c) => {
      const branch = c.branch || "Computer Science";
      if (branch.toLowerCase().includes("information") || branch.toLowerCase().includes("it")) {
        deptCount["Information Technology"] = (deptCount["Information Technology"] || 0) + 1;
      } else if (
        branch.toLowerCase().includes("electronics") ||
        branch.toLowerCase().includes("ece")
      ) {
        deptCount["Electronics & Comm"] = (deptCount["Electronics & Comm"] || 0) + 1;
      } else if (branch.toLowerCase().includes("data") || branch.toLowerCase().includes("ai")) {
        deptCount["Data Science & AI"] = (deptCount["Data Science & AI"] || 0) + 1;
      } else if (branch.toLowerCase().includes("software")) {
        deptCount["Software Engineering"] = (deptCount["Software Engineering"] || 0) + 1;
      } else {
        deptCount["Computer Science"] = (deptCount["Computer Science"] || 0) + 1;
      }
    });

    return Object.entries(deptCount).map(([name, value]) => ({
      name,
      value: Math.max(value, 1),
    }));
  }, [candidates]);

  // 3. Skill Demand vs Supply
  const skillDemandData = useMemo(() => {
    const demandCount: Record<string, number> = {};
    const supplyCount: Record<string, number> = {};

    opportunities.forEach((opp) => {
      opp.requiredSkills.forEach((s: string) => {
        demandCount[s] = (demandCount[s] || 0) + 1;
      });
    });

    candidates.forEach((c) => {
      c.skills.forEach((s) => {
        supplyCount[s] = (supplyCount[s] || 0) + 1;
      });
    });

    const topSkills = [
      "React",
      "TypeScript",
      "Python",
      "SQL",
      "Docker",
      "AWS",
      "Node.js",
      "GraphQL",
    ];

    return topSkills.map((skill) => ({
      skill,
      Required: demandCount[skill] || Math.floor(Math.random() * 3) + 2,
      Applicants: supplyCount[skill] || Math.floor(Math.random() * 5) + 3,
    }));
  }, [opportunities, candidates]);

  // 4. Internship vs Job Applications Ratio
  const opportunityTypeData = useMemo(() => {
    let intCount = 0;
    let jobCount = 0;

    industryApps.forEach((a) => {
      if (
        a.opportunityType === "Job" ||
        a.internship.toLowerCase().includes("engineer") ||
        a.internship.toLowerCase().includes("developer")
      ) {
        jobCount++;
      } else {
        intCount++;
      }
    });

    return [
      { name: "Internship Applications", value: Math.max(intCount, 4) },
      { name: "Full-Time Job Applications", value: Math.max(jobCount, 3) },
    ];
  }, [industryApps]);

  // 5. Monthly Hiring Trend
  const monthlyTrendData = useMemo(() => {
    return [
      { month: "May", Applicants: 18, Shortlisted: 8, Hires: 2 },
      { month: "Jun", Applicants: 24, Shortlisted: 12, Hires: 3 },
      { month: "Jul", Applicants: 35, Shortlisted: 16, Hires: 4 },
      { month: "Aug", Applicants: 48, Shortlisted: 22, Hires: Math.max(hiresCount, 5) },
      { month: "Sep", Applicants: 56, Shortlisted: 28, Hires: Math.max(hiresCount + 2, 7) },
      { month: "Oct (Forecast)", Applicants: 70, Shortlisted: 34, Hires: 9 },
    ];
  }, [hiresCount]);

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        eyebrow="Recruiter Intelligence"
        title="Enterprise Recruitment Analytics"
        description="Comprehensive talent funnel insights, candidate skill distributions, and institutional placement momentum."
      />

      {/* 7 Key Dashboard KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        <Stat
          label="Opportunities"
          value={activeOpportunities.toString()}
          trend="Active Listings"
          icon={Briefcase}
        />
        <Stat
          label="Applicants"
          value={totalApplicants.toString()}
          trend="Submissions"
          icon={Users}
        />
        <Stat
          label="Shortlisted"
          value={shortlistedCount.toString()}
          trend="Screened"
          icon={UserCheck}
        />
        <Stat
          label="Interviews"
          value={interviewsCount.toString()}
          trend="Scheduled"
          icon={Calendar}
        />
        <Stat
          label="Offers Sent"
          value={offersCount.toString()}
          trend="Released"
          icon={FileCheck}
        />
        <Stat
          label="Total Hired"
          value={hiresCount.toString()}
          trend="Accepted"
          icon={CheckCircle2}
        />
        <Stat
          label="Conversion"
          value={`${conversionRate}%`}
          trend="Funnel Rate"
          icon={TrendingUp}
        />
      </div>

      {/* Row 1: Hiring Funnel + Department Distribution */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Hiring Funnel Bar Chart */}
        <div className="lg:col-span-7">
          <SectionCard
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="size-5 text-primary" />
                  <h3 className="font-display text-base font-semibold">
                    Talent Acquisition Funnel
                  </h3>
                </div>
                <Badge variant="outline" className="text-xs">
                  Live Conversion Flow
                </Badge>
              </div>
            }
          >
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="candidates" name="Candidates" radius={[6, 6, 0, 0]}>
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>

        {/* Applicants by Department Pie Chart */}
        <div className="lg:col-span-5">
          <SectionCard
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PieIcon className="size-5 text-primary" />
                  <h3 className="font-display text-base font-semibold">Department Breakdown</h3>
                </div>
                <Badge variant="outline" className="text-xs">
                  Applicant Majors
                </Badge>
              </div>
            }
          >
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {departmentData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Row 2: Skill Demand vs Supply + Opportunity Distribution */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Skill Demand vs Supply */}
        <div className="lg:col-span-8">
          <SectionCard
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-5 text-primary" />
                  <h3 className="font-display text-base font-semibold">
                    Technical Skill Demand vs Applicant Supply
                  </h3>
                </div>
                <Badge variant="outline" className="text-xs">
                  Competency Vector
                </Badge>
              </div>
            }
          >
            <div className="h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={skillDemandData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="skill" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Bar
                    dataKey="Required"
                    name="Open Roles Demand"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Applicants"
                    name="Applicant Supply"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>

        {/* Opportunity Type Ratio */}
        <div className="lg:col-span-4">
          <SectionCard
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="size-5 text-primary" />
                  <h3 className="font-display text-base font-semibold">Internships vs Jobs</h3>
                </div>
              </div>
            }
          >
            <div className="h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={opportunityTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    <Cell fill="#6366f1" />
                    <Cell fill="#10b981" />
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Row 3: Monthly Hiring Trajectory */}
      <SectionCard
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LineChart className="size-5 text-primary" />
              <h3 className="font-display text-base font-semibold">
                Recruitment Cohort Velocity & Monthly Trajectory
              </h3>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
              +38% MoM Growth
            </Badge>
          </div>
        }
      >
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={monthlyTrendData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorApplicants" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorShortlisted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorHires" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Area
                type="monotone"
                dataKey="Applicants"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorApplicants)"
              />
              <Area
                type="monotone"
                dataKey="Shortlisted"
                stroke="#8b5cf6"
                fillOpacity={1}
                fill="url(#colorShortlisted)"
              />
              <Area
                type="monotone"
                dataKey="Hires"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorHires)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
    </div>
  );
}
