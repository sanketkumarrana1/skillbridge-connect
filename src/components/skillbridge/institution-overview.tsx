import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Download,
  FileText,
  GraduationCap,
  LineChart,
  Percent,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SectionCard, Stat, WorkspaceHeader } from "@/components/skillbridge/student-ui";
import { useAppState } from "@/context/app-state";

export function InstitutionOverview() {
  const {
    institutionStudents,
    departmentReports,
    recruiterPartners,
    facultyInternships,
    facultyTrainings,
    facultyFDPs,
  } = useAppState();

  // Real KPI Calculations
  const totalStudentsCount = departmentReports.reduce((acc, d) => acc + d.totalStudents, 0);

  const placedStudentsCount = institutionStudents.filter(
    (s) => s.placementStatus === "Placed",
  ).length;

  const totalCalculatedPlacementRate =
    institutionStudents.length > 0
      ? Math.round((placedStudentsCount / institutionStudents.length) * 100 * 10) / 10
      : 86.4;

  const internshipActiveCount = institutionStudents.filter(
    (s) => s.internshipStatus === "Active" || s.internshipStatus === "Completed",
  ).length;

  const internshipRate =
    institutionStudents.length > 0
      ? Math.round((internshipActiveCount / institutionStudents.length) * 100 * 10) / 10
      : 84.8;

  const avgEmployabilityScore =
    institutionStudents.length > 0
      ? Math.round(
          institutionStudents.reduce((acc, s) => acc + s.employabilityScore, 0) /
            institutionStudents.length,
        )
      : 82;

  const facultyEngagementCount =
    facultyInternships.length + facultyTrainings.length + facultyFDPs.length;

  // Department Placement Bar Chart Data
  const deptChartData = departmentReports.map((dept) => ({
    name: dept.code,
    placementRate: dept.placementRate,
    internshipRate: dept.internshipParticipation,
    avgCTC: dept.averageCTC,
  }));

  // Monthly Placement Momentum
  const monthlyTrendData = [
    { month: "Jun", offers: 45, highest: 24.0, avg: 11.2 },
    { month: "Jul", offers: 112, highest: 32.0, avg: 12.4 },
    { month: "Aug", offers: 198, highest: 44.0, avg: 13.8 },
    { month: "Sep (Proj)", offers: 280, highest: 44.0, avg: 14.2 },
  ];

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        eyebrow="Campus Leadership & Academic Governance"
        title="Institution Executive Command Hub"
        description="Monitor campus-wide skill progression, accredited placement outcomes, enterprise recruiter engagement, and multi-department performance benchmarks."
        action={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <Link to="/institution/reports">
                <Download className="size-3.5" /> Export Accreditation Pack
              </Link>
            </Button>
            <Button asChild size="sm" className="gap-1.5">
              <Link to="/institution/outcomes">
                <Users className="size-3.5" /> Student Analytics
              </Link>
            </Button>
          </div>
        }
      />

      {/* 6 Real Connected KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Stat
          label="Total Enrolled"
          value={totalStudentsCount.toLocaleString()}
          trend="5 Departments"
          icon={Users}
        />
        <Stat
          label="Placement Rate"
          value={`${totalCalculatedPlacementRate}%`}
          trend="+5.2% YoY"
          icon={TrendingUp}
        />
        <Stat
          label="Internship Reach"
          value={`${internshipRate}%`}
          trend="Cohort Placed"
          icon={Briefcase}
        />
        <Stat
          label="Employability Index"
          value={`${avgEmployabilityScore}%`}
          trend="Assessed Score"
          icon={Target}
        />
        <Stat
          label="Active Recruiters"
          value={`${recruiterPartners.length}+`}
          trend="Enterprise Network"
          icon={Building2}
        />
        <Stat
          label="Faculty Immersion"
          value={facultyEngagementCount.toString()}
          trend="Fellowships & FDPs"
          icon={Award}
        />
      </div>

      {/* Main Analytical Visualizations Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left 7 Cols: Placement & Internship Rates by Department */}
        <div className="space-y-6 lg:col-span-7">
          <SectionCard
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="size-5 text-primary" />
                  <h3 className="font-display text-base font-semibold">
                    Department Placement & Internship Benchmarks
                  </h3>
                </div>
                <Button asChild variant="ghost" size="sm" className="text-xs h-7">
                  <Link to="/institution/departments">
                    Departments <ArrowRight className="size-3 ml-1" />
                  </Link>
                </Button>
              </div>
            }
          >
            <div className="pt-2">
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={deptChartData}
                    margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="hsl(var(--border))"
                    />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                      formatter={(val: number | string | (number | string)[] | undefined) => [
                        `${val}%`,
                        "",
                      ]}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                    <Bar
                      dataKey="placementRate"
                      name="Placement Rate (%)"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="internshipRate"
                      name="Internship Rate (%)"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </SectionCard>

          {/* Department Quick Performance Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {departmentReports.slice(0, 4).map((dept) => (
              <Card
                key={dept.id}
                className="border border-border bg-card/60 transition hover:border-primary/40"
              >
                <CardContent className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge
                        variant="outline"
                        className="text-[10px] text-primary border-primary/30"
                      >
                        {dept.code}
                      </Badge>
                      <h4 className="text-sm font-semibold text-foreground mt-0.5">{dept.name}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-600">{dept.placementRate}%</p>
                      <p className="text-[10px] text-muted-foreground">Placement</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>Avg CTC: ₹{dept.averageCTC} LPA</span>
                      <span>Highest: ₹{dept.highestCTC} LPA</span>
                    </div>
                    <Progress value={dept.placementRate} className="h-1.5" />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border">
                    <span>{dept.totalStudents} Students</span>
                    <span>{dept.activeIndustryPartners} Recruiters</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Placement Momentum & Recruiter Tiering */}
        <div className="space-y-6 lg:col-span-5">
          {/* Monthly Placement Momentum */}
          <SectionCard
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LineChart className="size-5 text-primary" />
                  <h3 className="font-display text-base font-semibold">
                    Placement Momentum (2026 Cohort)
                  </h3>
                </div>
                <Button asChild variant="ghost" size="sm" className="text-xs h-7">
                  <Link to="/institution/placements">
                    Deep Dive <ArrowRight className="size-3 ml-1" />
                  </Link>
                </Button>
              </div>
            }
          >
            <div className="pt-2 space-y-3">
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={monthlyTrendData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorOffers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="hsl(var(--border))"
                    />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="offers"
                      name="Total Offers Released"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorOffers)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border text-center text-xs">
                <div className="p-2 rounded-xl bg-muted/30">
                  <p className="text-muted-foreground text-[10px]">Average CTC</p>
                  <p className="text-sm font-bold text-foreground">₹13.4 LPA</p>
                </div>
                <div className="p-2 rounded-xl bg-muted/30">
                  <p className="text-muted-foreground text-[10px]">Dream Offers (&gt;₹15 LPA)</p>
                  <p className="text-sm font-bold text-emerald-600">84 Offers</p>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Active Recruiter Partners Spotlight */}
          <SectionCard
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="size-5 text-primary" />
                  <h3 className="font-display text-base font-semibold">
                    Top Corporate Hiring Partners
                  </h3>
                </div>
                <Button asChild variant="ghost" size="sm" className="text-xs h-7">
                  <Link to="/institution/recruiters">
                    Manage ({recruiterPartners.length}) <ArrowRight className="size-3 ml-1" />
                  </Link>
                </Button>
              </div>
            }
          >
            <div className="space-y-3 pt-2">
              {recruiterPartners.slice(0, 3).map((rec) => (
                <div
                  key={rec.id}
                  className="rounded-xl border border-border p-3 space-y-1.5 bg-card"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-semibold text-foreground">{rec.companyName}</h4>
                      <p className="text-[10px] text-muted-foreground">{rec.industry}</p>
                    </div>
                    <Badge variant="secondary" className="text-[9px]">
                      {rec.tier}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border">
                    <span>{rec.hiresCount} Hires Confirmed</span>
                    <span className="font-semibold text-emerald-600">
                      Avg ₹{rec.avgPackageLPA} LPA
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Institutional Modules Quick Switcher */}
      <SectionCard title="Campus Governance & Intelligence Modules">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2">
          {[
            {
              title: "Student Analytics",
              desc: "Filter 1,280+ students by department, CGPA, and readiness.",
              href: "/institution/outcomes",
              icon: Users,
              count: `${institutionStudents.length} Profiles`,
            },
            {
              title: "Placement Dashboard",
              desc: "CTC histograms, department conversion, and offer analytics.",
              href: "/institution/placements",
              icon: TrendingUp,
              count: `${totalCalculatedPlacementRate}% Placed`,
            },
            {
              title: "Skill Gap Analytics",
              desc: "Identify curriculum blindspots across 6 skill dimensions.",
              href: "/institution/skills",
              icon: Target,
              count: "Radar Analysis",
            },
            {
              title: "Export Reports",
              desc: "Generate compliant CSV and PDF reports for NBA/NAAC.",
              href: "/institution/reports",
              icon: FileText,
              count: "CSV & PDF",
            },
          ].map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.title}
                to={mod.href}
                className="group rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40 hover:shadow-md space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-4.5" />
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {mod.count}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition">
                    {mod.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{mod.desc}</p>
                </div>
                <div className="pt-2 flex items-center text-xs font-semibold text-primary gap-1">
                  Open module{" "}
                  <ArrowRight className="size-3.5 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
