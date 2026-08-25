import { useState } from "react";
import {
  AlertTriangle,
  Award,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  IndianRupee,
  Layers,
  LineChart,
  Percent,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionCard, Stat, WorkspaceHeader } from "@/components/skillbridge/student-ui";
import { useAppState } from "@/context/app-state";
import type { DepartmentReport } from "@/types";

export function InstitutionDepartments() {
  const { departmentReports, institutionStudents } = useAppState();

  const [selectedDeptId, setSelectedDeptId] = useState<string>(
    departmentReports[0]?.id ?? "dept-cse",
  );

  const currentDept =
    departmentReports.find((d) => d.id === selectedDeptId) ?? departmentReports[0];

  if (!currentDept) {
    return null;
  }

  const deptStudents = institutionStudents.filter((s) => s.department === currentDept.name);

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        eyebrow="Academic Department Governance"
        title="Department Performance & Audit Reports"
        description="Comprehensive audit of student enrollment, employability indices, placement records, and industry partnerships across engineering branches."
      />

      {/* Department Selector Tabs */}
      <div className="flex overflow-x-auto pb-2">
        <Tabs value={selectedDeptId} onValueChange={setSelectedDeptId} className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full h-auto p-1.5 gap-1">
            {departmentReports.map((dept) => (
              <TabsTrigger
                key={dept.id}
                value={dept.id}
                className="py-2.5 px-3 flex flex-col items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition rounded-xl"
              >
                <span className="font-bold text-xs">{dept.code}</span>
                <span className="text-[10px] opacity-85 truncate max-w-[120px]">{dept.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Department Performance Overview Banner */}
      <div className="rounded-2xl border border-border bg-gradient-to-r from-primary/10 via-card to-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary text-xs font-bold border-primary/30">
                {currentDept.code}
              </Badge>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Department of {currentDept.name}
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Head of Department:{" "}
              <strong className="text-foreground">{currentDept.headOfDepartment}</strong> •{" "}
              {currentDept.facultyCount} Faculty Members • {currentDept.activeIndustryPartners}{" "}
              Active Corporate Partners
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs px-3 py-1 font-semibold">
              NBA / NAAC Tier-1 Accredited
            </Badge>
          </div>
        </div>

        {/* 4 Key Department Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-card border border-border space-y-0.5">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase">
              Total Enrollment
            </p>
            <p className="text-xl font-bold font-display text-foreground">
              {currentDept.totalStudents}
            </p>
            <p className="text-[10px] text-muted-foreground">Undergraduates</p>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border space-y-0.5">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase">
              Placement Rate
            </p>
            <p className="text-xl font-bold font-display text-emerald-600">
              {currentDept.placementRate}%
            </p>
            <p className="text-[10px] text-muted-foreground">
              {Math.round((currentDept.totalStudents * currentDept.placementRate) / 100)} Placed
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border space-y-0.5">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase">Average CTC</p>
            <p className="text-xl font-bold font-display text-foreground">
              ₹{currentDept.averageCTC} LPA
            </p>
            <p className="text-[10px] text-emerald-600 font-medium">
              Highest ₹{currentDept.highestCTC} LPA
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border space-y-0.5">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase">
              Employability Score
            </p>
            <p className="text-xl font-bold font-display text-primary">
              {currentDept.averageEmployability} / 100
            </p>
            <p className="text-[10px] text-muted-foreground">Cohort Average</p>
          </div>
        </div>
      </div>

      {/* Competency & Skill Gap Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Department Top Skills */}
        <SectionCard
          title={
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-emerald-600" />
              <h3 className="font-display text-base font-semibold">Core Curriculum Competencies</h3>
            </div>
          }
        >
          <div className="space-y-3 pt-2">
            <p className="text-xs text-muted-foreground">
              Strongest technical skill clusters verified by industry testing:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {currentDept.topSkills.map((sk) => (
                <Badge
                  key={sk}
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs py-1 px-2.5"
                >
                  {sk}
                </Badge>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t border-border">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Programming Competency</span>
                  <span className="font-bold text-foreground">
                    {currentDept.skillAverages.programming}%
                  </span>
                </div>
                <Progress value={currentDept.skillAverages.programming} className="h-1.5" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Problem Solving Mastery</span>
                  <span className="font-bold text-foreground">
                    {currentDept.skillAverages.problemSolving}%
                  </span>
                </div>
                <Progress value={currentDept.skillAverages.problemSolving} className="h-1.5" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Domain Core Engineering</span>
                  <span className="font-bold text-foreground">
                    {currentDept.skillAverages.domainKnowledge}%
                  </span>
                </div>
                <Progress value={currentDept.skillAverages.domainKnowledge} className="h-1.5" />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Department Weak Skills / Remedial Focus */}
        <SectionCard
          title={
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-amber-600" />
              <h3 className="font-display text-base font-semibold">Targeted Skill Blindspots</h3>
            </div>
          }
        >
          <div className="space-y-3 pt-2">
            <p className="text-xs text-muted-foreground">
              Areas requiring faculty intervention and corporate workshop sprints:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {currentDept.weakSkills.map((sk) => (
                <Badge
                  key={sk}
                  variant="outline"
                  className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs py-1 px-2.5"
                >
                  {sk}
                </Badge>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t border-border">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Communication & Pitching</span>
                  <span className="font-bold text-foreground">
                    {currentDept.skillAverages.communication}%
                  </span>
                </div>
                <Progress value={currentDept.skillAverages.communication} className="h-1.5" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Leadership & Initiative</span>
                  <span className="font-bold text-foreground">
                    {currentDept.skillAverages.leadership}%
                  </span>
                </div>
                <Progress value={currentDept.skillAverages.leadership} className="h-1.5" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Analytical Thinking</span>
                  <span className="font-bold text-foreground">
                    {currentDept.skillAverages.analyticalThinking}%
                  </span>
                </div>
                <Progress value={currentDept.skillAverages.analyticalThinking} className="h-1.5" />
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Department Student Roster Spotlight */}
      <SectionCard title={`Department Student Roster (${deptStudents.length} Samples)`}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-2">
          {deptStudents.map((stu) => (
            <div key={stu.id} className="p-3.5 rounded-xl border border-border bg-card space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Avatar className="size-9 border border-border">
                    {stu.avatar ? <AvatarImage src={stu.avatar} /> : null}
                    <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                      {stu.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{stu.name}</h4>
                    <p className="text-[10px] text-muted-foreground">
                      {stu.year} • CGPA {stu.cgpa}
                    </p>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className={
                    stu.placementStatus === "Placed"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[9px]"
                      : "bg-blue-500/10 text-blue-600 border-blue-500/20 text-[9px]"
                  }
                >
                  {stu.placementStatus}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border">
                <span>
                  Score: <strong className="text-primary">{stu.employabilityScore}%</strong>
                </span>
                {stu.packageLPA ? (
                  <span className="text-emerald-600 font-bold">₹{stu.packageLPA} LPA</span>
                ) : (
                  <span>{stu.internshipStatus} Intern</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
