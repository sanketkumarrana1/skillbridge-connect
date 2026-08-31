import { useMemo } from "react";
import {
  Award,
  BarChart3,
  Briefcase,
  Building2,
  CheckCircle2,
  DollarSign,
  GraduationCap,
  IndianRupee,
  LineChart,
  PieChart as PieIcon,
  Sparkles,
  TrendingUp,
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
  Pie,
  PieChart,
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

export function InstitutionPlacements() {
  const { departmentReports, institutionStudents, recruiterPartners } = useAppState();

  // Placement Momentum Trend
  const placementTrendData = [
    { month: "May", offers: 18, cumulativeOffers: 18, avgCTC: 10.5 },
    { month: "Jun", offers: 42, cumulativeOffers: 60, avgCTC: 11.2 },
    { month: "Jul", offers: 85, cumulativeOffers: 145, avgCTC: 12.8 },
    { month: "Aug", offers: 124, cumulativeOffers: 269, avgCTC: 13.9 },
    { month: "Sep (Live)", offers: 75, cumulativeOffers: 344, avgCTC: 14.2 },
  ];

  // Department-wise Placement Conversion
  const deptPlacedData = departmentReports.map((d) => ({
    name: d.code,
    placedCount: Math.round((d.totalStudents * d.placementRate) / 100),
    totalStudents: d.totalStudents,
    rate: d.placementRate,
    avgCTC: d.averageCTC,
  }));

  // CTC Distribution
  const ctcDistributionData = [
    { range: "5 - 8 LPA", count: 85, fill: "#94a3b8" },
    { range: "8 - 12 LPA", count: 142, fill: "#38bdf8" },
    { range: "12 - 18 LPA", count: 98, fill: "hsl(var(--primary))" },
    { range: "18 - 25 LPA", count: 36, fill: "#10b981" },
    { range: "> 25 LPA (Dream)", count: 18, fill: "#8b5cf6" },
  ];

  // Readiness Levels Distribution
  const readinessPieData = [
    { name: "High Readiness", value: 180, color: "#10b981" },
    { name: "Moderate Readiness", value: 120, color: "#38bdf8" },
    { name: "Developing", value: 44, color: "#f59e0b" },
  ];

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        eyebrow="Accredited Placement Office Analytics"
        title="Placement Outcomes & CTC Analytics"
        description="Comprehensive campus placement performance metrics, salary package distribution, department conversions, and hiring velocity."
      />

      {/* KPI Ribbon */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Highest Domestic Package"
          value="₹44.0 LPA"
          trend="Tier-1 Dream"
          icon={Award}
        />
        <Stat
          label="Average Campus CTC"
          value="₹13.4 LPA"
          trend="+14.2% YoY"
          icon={IndianRupee}
        />
        <Stat
          label="Total Offers Released"
          value="344"
          trend="86.4% Placed"
          icon={TrendingUp}
        />
        <Stat
          label="Hiring Enterprises"
          value="64"
          trend="Active Partners"
          icon={Building2}
        />
      </div>

      {/* Primary Visualizations 2-Column Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left 7 Cols: Placement Trend & Department Rate */}
        <div className="space-y-6 lg:col-span-7">
          {/* Monthly Placement Momentum */}
          <SectionCard
            title={
              <div className="flex items-center gap-2">
                <LineChart className="size-5 text-primary" />
                <h3 className="font-display text-base font-semibold">
                  Cumulative Placement Velocity (2026 Season)
                </h3>
              </div>
            }
          >
            <div className="pt-2">
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={placementTrendData}
                    margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorCumul" x1="0" y1="0" x2="0" y2="1">
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
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                    <Area
                      type="monotone"
                      dataKey="cumulativeOffers"
                      name="Cumulative Offers Released"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorCumul)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </SectionCard>

          {/* Students Placed by Department */}
          <SectionCard
            title={
              <div className="flex items-center gap-2">
                <BarChart3 className="size-5 text-primary" />
                <h3 className="font-display text-base font-semibold">
                  Department Student Placements & Conversion
                </h3>
              </div>
            }
          >
            <div className="pt-2">
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={deptPlacedData}
                    margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="hsl(var(--border))"
                    />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
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
                    <Bar
                      dataKey="placedCount"
                      name="Placed Students"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="totalStudents"
                      name="Total Eligible Students"
                      fill="hsl(var(--muted))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Right 5 Cols: CTC Distribution & Placement Readiness */}
        <div className="space-y-6 lg:col-span-5">
          {/* CTC Package Distribution */}
          <SectionCard
            title={
              <div className="flex items-center gap-2">
                <IndianRupee className="size-5 text-emerald-600" />
                <h3 className="font-display text-base font-semibold">
                  Annual CTC Bracket Distribution
                </h3>
              </div>
            }
          >
            <div className="pt-2 space-y-3">
              <div className="h-[230px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ctcDistributionData}
                    layout="vertical"
                    margin={{ top: 5, right: 15, left: 35, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="hsl(var(--border))"
                    />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <YAxis
                      type="category"
                      dataKey="range"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      width={90}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                      formatter={(val: number | string | (number | string)[] | undefined) => [
                        `${val} Students`,
                        "Offers",
                      ]}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {ctcDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-muted/30 border border-border">
                <span className="text-muted-foreground">Median CTC</span>
                <span className="font-bold text-foreground">₹12.0 LPA</span>
              </div>
            </div>
          </SectionCard>

          {/* Placement Readiness Levels */}
          <SectionCard
            title={
              <div className="flex items-center gap-2">
                <PieIcon className="size-5 text-primary" />
                <h3 className="font-display text-base font-semibold">
                  Cohort Placement Readiness Levels
                </h3>
              </div>
            }
          >
            <div className="pt-2">
              <div className="h-[210px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={readinessPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {readinessPieData.map((entry, index) => (
                        <Cell key={`pie-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Department-Wise Placement Statistics Table */}
      <SectionCard title="Department-Wise Placement Summary (NAAC & NBA Metrics)">
        <div className="pt-2 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Head of Department</TableHead>
                <TableHead className="text-center">Total Students</TableHead>
                <TableHead className="text-center">Placement Rate</TableHead>
                <TableHead className="text-right">Average CTC</TableHead>
                <TableHead className="text-right">Highest CTC</TableHead>
                <TableHead className="text-center">Status</TableHead>
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
                  <TableCell className="text-xs text-muted-foreground">
                    {dept.headOfDepartment}
                  </TableCell>
                  <TableCell className="text-center text-xs font-medium">
                    {dept.totalStudents}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-bold text-emerald-600 text-xs">
                      {dept.placementRate}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-xs">
                    ₹{dept.averageCTC} LPA
                  </TableCell>
                  <TableCell className="text-right font-bold text-primary text-xs">
                    ₹{dept.highestCTC} LPA
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="text-[10px]">
                      Accredited
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
