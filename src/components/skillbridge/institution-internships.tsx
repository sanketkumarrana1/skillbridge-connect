import { useMemo } from "react";
import {
  Award,
  BarChart3,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  LineChart,
  Sparkles,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SectionCard, Stat, WorkspaceHeader } from "@/components/skillbridge/student-ui";
import { useAppState } from "@/context/app-state";

export function InstitutionInternships() {
  const { departmentReports, institutionStudents, internships } = useAppState();

  // Metrics
  const appliedCount = institutionStudents.filter((s) => s.internshipStatus === "Applied").length;
  const activeCount = institutionStudents.filter((s) => s.internshipStatus === "Active").length;
  const completedCount = institutionStudents.filter(
    (s) => s.internshipStatus === "Completed",
  ).length;
  const totalEngaged = appliedCount + activeCount + completedCount;

  // Monthly Internship Progression Data
  const monthlyInternshipData = [
    { month: "Apr", applications: 35, onboarded: 12, completed: 5 },
    { month: "May", applications: 92, onboarded: 45, completed: 18 },
    { month: "Jun", applications: 185, onboarded: 110, completed: 42 },
    { month: "Jul", applications: 240, onboarded: 165, completed: 88 },
    { month: "Aug", applications: 310, onboarded: 220, completed: 145 },
  ];

  // Department Internship Rates
  const deptInternData = departmentReports.map((d) => ({
    name: d.code,
    rate: d.internshipParticipation,
    studentsCount: Math.round((d.totalStudents * d.internshipParticipation) / 100),
    total: d.totalStudents,
  }));

  // Top Internship Recruiting Partners
  const topCompanies = [
    { company: "Nexora Labs", internsHired: 32, stipend: "₹35,000 / mo", conversionRate: "88%" },
    { company: "Quantile AI", internsHired: 24, stipend: "₹28,000 / mo", conversionRate: "92%" },
    {
      company: "Vertex Cloudworks",
      internsHired: 20,
      stipend: "₹32,000 / mo",
      conversionRate: "85%",
    },
    {
      company: "BrightPath EdTech",
      internsHired: 18,
      stipend: "₹26,000 / mo",
      conversionRate: "80%",
    },
    {
      company: "Qualcomm / Texas Inst.",
      internsHired: 16,
      stipend: "₹45,000 / mo",
      conversionRate: "95%",
    },
    {
      company: "Tata Motors / L&T",
      internsHired: 28,
      stipend: "₹20,000 / mo",
      conversionRate: "78%",
    },
  ];

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        eyebrow="Experiential Learning & Industry Residencies"
        title="Campus Internship Analytics Dashboard"
        description="Track semester and summer internship participation, corporate conversions to full-time offers, and department engagement."
      />

      {/* KPI Ribbon */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Applied for Internships"
          value={`${appliedCount} Students`}
          trend="Summer & Fall cycles"
          icon={Briefcase}
        />
        <Stat
          label="Active in Corporate Labs"
          value={`${activeCount} Active`}
          trend="Currently engaged"
          icon={Clock}
        />
        <Stat
          label="Completed Fellowships"
          value={`${completedCount} Certified`}
          trend="With project credits"
          icon={CheckCircle2}
        />
        <Stat
          label="Avg Monthly Stipend"
          value="₹28,500 / mo"
          trend="Corporate sponsored"
          icon={Award}
        />
      </div>

      {/* Primary Visualizations 2-Column Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left 7 Cols: Monthly Internship Trends */}
        <div className="space-y-6 lg:col-span-7">
          <SectionCard
            title={
              <div className="flex items-center gap-2">
                <LineChart className="size-5 text-primary" />
                <h3 className="font-display text-base font-semibold">
                  Monthly Internship Application & Onboarding Velocity
                </h3>
              </div>
            }
          >
            <div className="pt-2">
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={monthlyInternshipData}
                    margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorOnboard" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
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
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                    <Area
                      type="monotone"
                      dataKey="applications"
                      name="Applications Submitted"
                      stroke="hsl(var(--primary))"
                      fill="url(#colorApps)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="onboarded"
                      name="Interns Onboarded"
                      stroke="#10b981"
                      fill="url(#colorOnboard)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </SectionCard>

          {/* Department Internship Rate Chart */}
          <SectionCard
            title={
              <div className="flex items-center gap-2">
                <BarChart3 className="size-5 text-primary" />
                <h3 className="font-display text-base font-semibold">
                  Department Internship Participation Percentages
                </h3>
              </div>
            }
          >
            <div className="pt-2">
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={deptInternData}
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
                        "Participation Rate",
                      ]}
                    />
                    <Bar
                      dataKey="rate"
                      name="Participation Rate (%)"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Right 5 Cols: Top Recruiting Companies for Internships */}
        <div className="space-y-6 lg:col-span-5">
          <SectionCard
            title={
              <div className="flex items-center gap-2">
                <Building2 className="size-5 text-primary" />
                <h3 className="font-display text-base font-semibold">
                  Top Internship Providers & PPO Conversion
                </h3>
              </div>
            }
          >
            <div className="space-y-3 pt-2">
              {topCompanies.map((item) => (
                <div
                  key={item.company}
                  className="rounded-xl border border-border p-3.5 space-y-2 bg-card transition hover:border-primary/30"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{item.company}</h4>
                      <p className="text-[10px] text-muted-foreground">{item.stipend}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]"
                    >
                      {item.conversionRate} PPO Rate
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border">
                    <span>{item.internsHired} Interns Placed</span>
                    <span className="font-semibold text-primary">Pre-Placement Track</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Department Breakdown Table */}
      <SectionCard title="Department-Level Internship Participation Breakdown">
        <div className="pt-2 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead className="text-center">Total Students</TableHead>
                <TableHead className="text-center">Internship Participation</TableHead>
                <TableHead className="text-center">Active Interns</TableHead>
                <TableHead className="text-center">PPO Conversion Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departmentReports.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell className="font-semibold text-foreground">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] text-primary">
                        {dept.code}
                      </Badge>
                      <span>{dept.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-xs">{dept.totalStudents}</TableCell>
                  <TableCell className="text-center font-bold text-emerald-600 text-xs">
                    {dept.internshipParticipation}%
                  </TableCell>
                  <TableCell className="text-center text-xs font-semibold text-foreground">
                    {Math.round((dept.totalStudents * dept.internshipParticipation) / 100)} Students
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="text-[10px]">
                      {dept.code === "CSE" ? "88%" : dept.code === "IT" ? "84%" : "76%"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}
