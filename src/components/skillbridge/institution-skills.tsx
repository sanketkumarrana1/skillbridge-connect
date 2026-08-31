import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Flame,
  Layers,
  LineChart,
  Lightbulb,
  Radar as RadarIcon,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
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

export function InstitutionSkills() {
  const { departmentReports, institutionStudents, industrySkillDemand, skillDemandVsSupply } =
    useAppState();

  const [selectedDeptId, setSelectedDeptId] = useState("all");

  // Institution-wide averages across 6 competencies
  const institutionRadarData = [
    { subject: "Programming", score: 82, benchmark: 85, fullMark: 100 },
    { subject: "Communication", score: 83, benchmark: 80, fullMark: 100 },
    { subject: "Problem Solving", score: 85, benchmark: 88, fullMark: 100 },
    { subject: "Leadership", score: 80, benchmark: 75, fullMark: 100 },
    { subject: "Analytical", score: 86, benchmark: 85, fullMark: 100 },
    { subject: "Domain Core", score: 87, benchmark: 85, fullMark: 100 },
  ];

  // Department comparison across Programming vs Problem Solving vs Communication
  const deptSkillComparisonData = departmentReports.map((d) => ({
    name: d.code,
    Programming: d.skillAverages.programming,
    ProblemSolving: d.skillAverages.problemSolving,
    Communication: d.skillAverages.communication,
    DomainCore: d.skillAverages.domainKnowledge,
  }));

  // Selected department specific radar
  const selectedDept = departmentReports.find((d) => d.id === selectedDeptId);
  const deptRadarData = selectedDept
    ? [
        { subject: "Programming", score: selectedDept.skillAverages.programming, benchmark: 85 },
        {
          subject: "Communication",
          score: selectedDept.skillAverages.communication,
          benchmark: 80,
        },
        {
          subject: "Problem Solving",
          score: selectedDept.skillAverages.problemSolving,
          benchmark: 88,
        },
        { subject: "Leadership", score: selectedDept.skillAverages.leadership, benchmark: 75 },
        {
          subject: "Analytical",
          score: selectedDept.skillAverages.analyticalThinking,
          benchmark: 85,
        },
        {
          subject: "Domain Core",
          score: selectedDept.skillAverages.domainKnowledge,
          benchmark: 85,
        },
      ]
    : institutionRadarData;

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        eyebrow="Curriculum Optimization & Blindspot Analysis"
        title="Institution-Wide Skill Gap Analytics"
        description="Diagnose foundational and emerging skill gaps across departments from real AI assessment telemetry to upgrade academic syllabi and bootcamps."
      />

      {/* KPI Ribbon */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Top Competency"
          value="Domain Core"
          trend="87% Average"
          icon={Award}
        />
        <Stat
          label="Primary Skill Gap"
          value="Cloud & DevOps"
          trend="38% Deficit"
          icon={AlertTriangle}
        />
        <Stat
          label="Problem Solving Fitness"
          value="85%"
          trend="Algorithmic DSA"
          icon={Target}
        />
        <Stat
          label="Remedial Interventions"
          value="6"
          trend="Active Tracks"
          icon={Sparkles}
        />
      </div>

      {/* Primary Visualizations 2-Column Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left 6 Cols: Radar Competency Graph */}
        <div className="space-y-6 lg:col-span-6">
          <SectionCard
            title={
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <RadarIcon className="size-5 text-primary" />
                  <h3 className="font-display text-base font-semibold">
                    Institutional Capability Radar
                  </h3>
                </div>
                <select
                  value={selectedDeptId}
                  onChange={(e) => setSelectedDeptId(e.target.value)}
                  className="h-7 rounded-md border border-input bg-transparent px-2 text-xs shadow-xs"
                >
                  <option value="all">Campus Average</option>
                  {departmentReports.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>
            }
          >
            <div className="pt-2">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={deptRadarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "currentColor", fontSize: 11 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    />
                    <Radar
                      name="Student Cohort Score"
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.4}
                    />
                    <Radar
                      name="Industry Benchmark Target"
                      dataKey="benchmark"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.15}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Right 6 Cols: Department Benchmarking Bar Chart */}
        <div className="space-y-6 lg:col-span-6">
          <SectionCard
            title={
              <div className="flex items-center gap-2">
                <LineChart className="size-5 text-primary" />
                <h3 className="font-display text-base font-semibold">
                  Competency Comparison Across Departments
                </h3>
              </div>
            }
          >
            <div className="pt-2">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={deptSkillComparisonData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
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
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                    <Bar dataKey="Programming" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="ProblemSolving" fill="#38bdf8" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="DomainCore" fill="#10b981" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Industry Demand vs. Student Supply Intelligence */}
      <SectionCard
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              <h3 className="font-display text-base font-semibold">
                Industry Market Demand vs. Campus Student Proficiency
              </h3>
            </div>
            <Badge variant="outline" className="text-xs">
              Live Opportunity Aggregation
            </Badge>
          </div>
        }
      >
        <div className="space-y-3 pt-2">
          <p className="text-xs text-muted-foreground">
            Comparing aggregated skills demanded across published industry roles against average assessed student proficiencies.
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            {skillDemandVsSupply.map((item) => (
              <div
                key={item.skill}
                className="rounded-xl border border-border/80 bg-card p-3.5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">{item.skill}</span>
                    <Badge
                      className={`text-[10px] ${
                        item.status === "Critical Gap"
                          ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                          : item.status === "Moderate Gap"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : item.status === "Surplus"
                              ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                              : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      }`}
                    >
                      {item.status} ({item.gap > 0 ? `+${item.gap}% Need` : "Balanced"})
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Proficiency: <strong className="text-foreground">{item.studentProficiencyScore}%</strong> / Demand: <strong className="text-primary">{item.industryDemandScore}%</strong>
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Student Supply</span>
                    <span>Industry Demand Benchmark</span>
                  </div>
                  <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 left-0 bg-primary/40 rounded-full"
                      style={{ width: `${item.industryDemandScore}%` }}
                    />
                    <div
                      className="absolute top-0 bottom-0 left-0 bg-primary rounded-full"
                      style={{ width: `${item.studentProficiencyScore}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Strongest vs Weakest Skill Insights per Department */}
      <SectionCard title="Departmental Strengths vs. Curriculum Blindspots">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-2">
          {departmentReports.map((dept) => (
            <Card key={dept.id} className="border border-border bg-card">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-primary text-[10px]">
                    {dept.code}
                  </Badge>
                  <span className="text-xs font-semibold text-muted-foreground">{dept.name}</span>
                </div>

                {/* Strongest Skills */}
                <div className="space-y-1 bg-emerald-500/5 p-2.5 rounded-xl border border-emerald-500/15 text-xs">
                  <p className="font-bold text-emerald-600 flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="size-3.5" /> Top Departmental Strengths
                  </p>
                  <ul className="text-muted-foreground list-disc list-inside text-[11px] space-y-0.5 pt-1">
                    {dept.topSkills.map((sk) => (
                      <li key={sk}>{sk}</li>
                    ))}
                  </ul>
                </div>

                {/* Weakest Skills / Skill Gaps */}
                <div className="space-y-1 bg-amber-500/5 p-2.5 rounded-xl border border-amber-500/15 text-xs">
                  <p className="font-bold text-amber-600 flex items-center gap-1 text-[11px]">
                    <AlertTriangle className="size-3.5" /> Identified Skill Gaps (Interventions
                    Needed)
                  </p>
                  <ul className="text-muted-foreground list-disc list-inside text-[11px] space-y-0.5 pt-1">
                    {dept.weakSkills.map((sk) => (
                      <li key={sk}>{sk}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionCard>

      {/* Actionable Curriculum Intervention Recommendations */}
      <SectionCard title="Recommended Remedial Academic Interventions">
        <div className="grid gap-4 sm:grid-cols-3 pt-2">
          {[
            {
              title: "Cloud Native & DevOps Bootcamp",
              target: "CSE & IT 3rd Year Cohorts",
              gapAddressed: "Bridge 38% deficit in Kubernetes & Terraform deployment experience.",
              action: "Schedule 4-Week AWS/GCP Hands-on Lab",
            },
            {
              title: "System Verilog & FPGA Tapeout Sprint",
              target: "ECE 3rd & 4th Year Cohorts",
              gapAddressed:
                "Upgrade lab coursework from 8-bit controllers to modern RISC-V SoC design.",
              action: "Launch Cadence & Texas Inst Workshop",
            },
            {
              title: "Python for Engineering Analytics",
              target: "Mechanical & Civil Cohorts",
              gapAddressed: "Automate parametric simulations and finite element data analysis.",
              action: "Implement 2-Credit Micro-Credential",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-4 rounded-2xl border border-border bg-muted/20 space-y-2"
            >
              <div className="flex items-center gap-2 text-primary font-bold text-xs">
                <Lightbulb className="size-4" />
                <h4>{item.title}</h4>
              </div>
              <Badge variant="outline" className="text-[10px]">
                {item.target}
              </Badge>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.gapAddressed}</p>
              <div className="pt-2 border-t border-border flex items-center justify-between text-xs font-semibold text-primary">
                <span>{item.action}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
