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
import { cn } from "@/lib/utils";
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
          <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full h-auto p-1.5 gap-1.5 border border-white/10 bg-slate-950">
            {departmentReports.map((dept) => (
              <TabsTrigger
                key={dept.id}
                value={dept.id}
                className="py-2.5 px-3 flex flex-col items-center gap-1 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition rounded-xl"
              >
                <span className="font-bold text-xs">{dept.code}</span>
                <span className="text-[10px] opacity-85 truncate max-w-[120px]">{dept.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Department Performance Overview Banner */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 p-6 space-y-4 shadow-[0_0_25px_rgba(99,102,241,0.15)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-500/20 text-indigo-300 text-xs font-bold border-indigo-500/30">
                {currentDept.code}
              </Badge>
              <h2 className="font-display text-2xl font-bold text-white">
                Department of {currentDept.name}
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Head of Department:{" "}
              <strong className="text-slate-200">{currentDept.headOfDepartment}</strong> •{" "}
              {currentDept.facultyCount} Faculty Members • {currentDept.activeIndustryPartners}{" "}
              Active Corporate Partners
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20 text-xs px-3 py-1 font-semibold">
              NBA / NAAC Tier-1 Accredited
            </Badge>
          </div>
        </div>

        {/* 4 Key Department Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 space-y-0.5">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">
              Total Enrollment
            </p>
            <p className="text-xl font-bold font-display text-white">
              {currentDept.totalStudents}
            </p>
            <p className="text-[10px] text-slate-500">Undergraduates</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 space-y-0.5">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">
              Placement Rate
            </p>
            <p className="text-xl font-bold font-display text-emerald-400">
              {currentDept.placementRate}%
            </p>
            <p className="text-[10px] text-slate-500">
              {Math.round((currentDept.totalStudents * currentDept.placementRate) / 100)} Placed
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 space-y-0.5">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Average CTC</p>
            <p className="text-xl font-bold font-display text-white">
              ₹{currentDept.averageCTC} LPA
            </p>
            <p className="text-[10px] text-indigo-400 font-medium">
              Highest ₹{currentDept.highestCTC} LPA
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 space-y-0.5">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">
              Employability Score
            </p>
            <p className="text-xl font-bold font-display text-indigo-400">
              {currentDept.averageEmployability}%
            </p>
            <p className="text-[10px] text-slate-500">Cohort Average</p>
          </div>
        </div>
      </div>

      {/* Competency & Skill Gap Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Department Top Skills */}
        <SectionCard
          title={
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-emerald-400" />
              <h3 className="font-display text-base font-semibold text-white">Core Curriculum Competencies</h3>
            </div>
          }
        >
          <div className="space-y-3 pt-2">
            <p className="text-xs text-slate-400">
              Strongest technical skill clusters verified by industry testing:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {currentDept.topSkills.map((sk) => (
                <Badge
                  key={sk}
                  className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20 text-xs py-1 px-2.5"
                >
                  {sk}
                </Badge>
              ))}
            </div>

            <div className="space-y-2.5 pt-3 border-t border-white/10">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Programming Competency</span>
                  <span className="font-bold text-white">
                    {currentDept.skillAverages.programming}%
                  </span>
                </div>
                <Progress value={currentDept.skillAverages.programming} className="h-1.5 bg-slate-800" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Problem Solving Mastery</span>
                  <span className="font-bold text-white">
                    {currentDept.skillAverages.problemSolving}%
                  </span>
                </div>
                <Progress value={currentDept.skillAverages.problemSolving} className="h-1.5 bg-slate-800" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Domain Core Engineering</span>
                  <span className="font-bold text-white">
                    {currentDept.skillAverages.domainKnowledge}%
                  </span>
                </div>
                <Progress value={currentDept.skillAverages.domainKnowledge} className="h-1.5 bg-slate-800" />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Department Weak Skills / Remedial Focus */}
        <SectionCard
          title={
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-amber-400" />
              <h3 className="font-display text-base font-semibold text-white">Targeted Skill Blindspots</h3>
            </div>
          }
        >
          <div className="space-y-3 pt-2">
            <p className="text-xs text-slate-400">
              Areas requiring faculty intervention and corporate workshop sprints:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {currentDept.weakSkills.map((sk) => (
                <Badge
                  key={sk}
                  className="bg-amber-500/10 text-amber-300 border-amber-500/20 text-xs py-1 px-2.5"
                >
                  {sk}
                </Badge>
              ))}
            </div>

            <div className="space-y-2.5 pt-3 border-t border-white/10">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Communication & Pitching</span>
                  <span className="font-bold text-white">
                    {currentDept.skillAverages.communication}%
                  </span>
                </div>
                <Progress value={currentDept.skillAverages.communication} className="h-1.5 bg-slate-800" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Leadership & Initiative</span>
                  <span className="font-bold text-white">
                    {currentDept.skillAverages.leadership}%
                  </span>
                </div>
                <Progress value={currentDept.skillAverages.leadership} className="h-1.5 bg-slate-800" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Analytical Thinking</span>
                  <span className="font-bold text-white">
                    {currentDept.skillAverages.analyticalThinking}%
                  </span>
                </div>
                <Progress value={currentDept.skillAverages.analyticalThinking} className="h-1.5 bg-slate-800" />
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Department Student Roster Spotlight */}
      <SectionCard title={`Department Student Roster (${deptStudents.length} Samples)`}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-2">
          {deptStudents.map((stu) => (
            <div key={stu.id} className="p-3.5 rounded-xl border border-white/10 bg-slate-900/60 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Avatar className="size-9 border border-white/10">
                    {stu.avatar ? <AvatarImage src={stu.avatar} /> : null}
                    <AvatarFallback className="text-xs font-bold bg-indigo-500/20 text-indigo-300">
                      {stu.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-xs font-bold text-white">{stu.name}</h4>
                    <p className="text-[10px] text-slate-400">
                      {stu.year} • CGPA {stu.cgpa}
                    </p>
                  </div>
                </div>

                <Badge
                  className={cn(
                    "text-[9px]",
                    stu.placementStatus === "Placed"
                      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                      : "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
                  )}
                >
                  {stu.placementStatus}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-white/10">
                <span>
                  Score: <strong className="text-indigo-400">{stu.employabilityScore}%</strong>
                </span>
                {stu.packageLPA ? (
                  <span className="text-emerald-400 font-bold">₹{stu.packageLPA} LPA</span>
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
