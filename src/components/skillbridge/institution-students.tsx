import { useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Eye,
  FileCheck,
  FileText,
  Filter,
  GraduationCap,
  Percent,
  Search,
  Sparkles,
  Target,
  UserCheck,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { SectionCard, Stat, WorkspaceHeader } from "@/components/skillbridge/student-ui";
import { useAppState } from "@/context/app-state";
import type { InstitutionStudent } from "@/types";

export function InstitutionStudents() {
  const { institutionStudents } = useAppState();

  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [placementFilter, setPlacementFilter] = useState("all");

  const [selectedStudent, setSelectedStudent] = useState<InstitutionStudent | null>(null);

  const filtered = useMemo(() => {
    return institutionStudents.filter((stu) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        stu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stu.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stu.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stu.skills.some((sk) => sk.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDept = deptFilter === "all" || stu.department === deptFilter;
      const matchesYear = yearFilter === "all" || stu.year === yearFilter;
      const matchesPlacement = placementFilter === "all" || stu.placementStatus === placementFilter;

      let matchesScore = true;
      if (scoreFilter === "high") matchesScore = stu.employabilityScore >= 85;
      else if (scoreFilter === "mid")
        matchesScore = stu.employabilityScore >= 75 && stu.employabilityScore < 85;
      else if (scoreFilter === "low") matchesScore = stu.employabilityScore < 75;

      return matchesSearch && matchesDept && matchesYear && matchesPlacement && matchesScore;
    });
  }, [institutionStudents, searchQuery, deptFilter, yearFilter, scoreFilter, placementFilter]);

  const placedCount = institutionStudents.filter((s) => s.placementStatus === "Placed").length;
  const highReadinessCount = institutionStudents.filter(
    (s) => s.readinessLevel === "High Readiness",
  ).length;

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        eyebrow="Talent Intelligence & Student Profiling"
        title="Student Analytics & Placement Readiness"
        description="Filter, inspect, and evaluate student skill assessments, competency radar metrics, and industry placement progression across departments."
      />

      {/* KPI Ribbon */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Total Student Roster"
          value={institutionStudents.length.toString()}
          trend="Profiles in Database"
          icon={Users}
        />
        <Stat
          label="Confirmed Placed"
          value={placedCount.toString()}
          trend="Tier 1 & Dream Offers"
          icon={CheckCircle2}
        />
        <Stat
          label="High Readiness Cohort"
          value={highReadinessCount.toString()}
          trend="Employability Score &gt;85"
          icon={Target}
        />
        <Stat
          label="Avg Employability"
          value="82.5 / 100"
          trend="Assessment verified"
          icon={Sparkles}
        />
      </div>

      {/* Filter Controls & Directory */}
      <SectionCard
        title={
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="font-display text-lg font-semibold">
                Student Directory ({filtered.length} of {institutionStudents.length})
              </h2>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, roll no, skill..."
                  className="pl-8 h-9 text-xs"
                />
              </div>
            </div>

            {/* Filter Dropdowns Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="h-8 rounded-md border border-input bg-transparent px-2.5 text-xs shadow-xs"
              >
                <option value="all">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Comm">Electronics & Comm</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
              </select>

              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="h-8 rounded-md border border-input bg-transparent px-2.5 text-xs shadow-xs"
              >
                <option value="all">All Years</option>
                <option value="4th Year">4th Year (Graduating)</option>
                <option value="3rd Year">3rd Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="1st Year">1st Year</option>
              </select>

              <select
                value={scoreFilter}
                onChange={(e) => setScoreFilter(e.target.value)}
                className="h-8 rounded-md border border-input bg-transparent px-2.5 text-xs shadow-xs"
              >
                <option value="all">All Employability Scores</option>
                <option value="high">&gt; 85 (High Readiness)</option>
                <option value="mid">75 - 85 (Moderate)</option>
                <option value="low">&lt; 75 (Developing)</option>
              </select>

              <select
                value={placementFilter}
                onChange={(e) => setPlacementFilter(e.target.value)}
                className="h-8 rounded-md border border-input bg-transparent px-2.5 text-xs shadow-xs"
              >
                <option value="all">All Placement Statuses</option>
                <option value="Placed">Placed</option>
                <option value="In Process">In Process</option>
                <option value="Not Placed">Not Placed</option>
              </select>
            </div>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-2">
          {filtered.length === 0 ? (
            <div className="col-span-full py-12 text-center text-xs text-muted-foreground">
              No students match the selected filter combination.
            </div>
          ) : (
            filtered.map((stu) => {
              const isPlaced = stu.placementStatus === "Placed";

              return (
                <Card
                  key={stu.id}
                  className="flex flex-col justify-between border border-border bg-card transition hover:border-primary/40 hover:shadow-md"
                >
                  <CardContent className="p-5 space-y-3.5 flex flex-col justify-between h-full">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-11 border border-border shrink-0">
                            {stu.avatar ? <AvatarImage src={stu.avatar} /> : null}
                            <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                              {stu.name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-display text-sm font-bold text-foreground line-clamp-1">
                              {stu.name}
                            </h3>
                            <p className="text-[11px] text-muted-foreground">
                              Roll: {stu.rollNo} • {stu.department}
                            </p>
                            <Badge variant="secondary" className="text-[9px] mt-0.5">
                              {stu.year} • CGPA {stu.cgpa}
                            </Badge>
                          </div>
                        </div>

                        <Badge
                          variant="outline"
                          className={
                            isPlaced
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]"
                              : "bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]"
                          }
                        >
                          {stu.placementStatus}
                        </Badge>
                      </div>

                      {/* Employability Score Progress */}
                      <div className="space-y-1 bg-muted/20 p-2.5 rounded-xl border border-border">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground text-[11px]">
                            Employability Index
                          </span>
                          <span className="font-bold text-primary">
                            {stu.employabilityScore} / 100
                          </span>
                        </div>
                        <Progress value={stu.employabilityScore} className="h-1.5" />
                      </div>

                      {/* Top Skills Badges */}
                      <div className="flex flex-wrap gap-1">
                        {stu.skills.slice(0, 3).map((sk) => (
                          <Badge key={sk} variant="outline" className="text-[10px] bg-background">
                            {sk}
                          </Badge>
                        ))}
                        {stu.skills.length > 3 && (
                          <span className="text-[10px] text-muted-foreground self-center">
                            +{stu.skills.length - 3} more
                          </span>
                        )}
                      </div>

                      {isPlaced && stu.placedCompany && (
                        <div className="text-[11px] text-emerald-600 font-semibold bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/15 flex items-center justify-between">
                          <span>Placed: {stu.placedCompany}</span>
                          <span>₹{stu.packageLPA} LPA</span>
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-border flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className={
                          stu.readinessLevel === "High Readiness"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[9px]"
                            : stu.readinessLevel === "Moderate Readiness"
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[9px]"
                              : "bg-muted text-muted-foreground text-[9px]"
                        }
                      >
                        {stu.readinessLevel}
                      </Badge>

                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs gap-1"
                        onClick={() => setSelectedStudent(stu)}
                      >
                        Full Dossier <ChevronRight className="size-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </SectionCard>

      {/* Student Dossier Modal */}
      <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
        {selectedStudent && (
          <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <Avatar className="size-14 border border-border">
                  {selectedStudent.avatar ? <AvatarImage src={selectedStudent.avatar} /> : null}
                  <AvatarFallback className="text-base font-bold bg-primary/10 text-primary">
                    {selectedStudent.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-lg font-bold font-display text-foreground">
                    {selectedStudent.name}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Roll: {selectedStudent.rollNo} • {selectedStudent.department} •{" "}
                    {selectedStudent.year}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Placement & Academic Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-muted/30 border border-border text-center text-xs">
                <div>
                  <p className="text-[10px] text-muted-foreground">CGPA</p>
                  <p className="font-bold text-foreground text-sm">{selectedStudent.cgpa}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Employability</p>
                  <p className="font-bold text-primary text-sm">
                    {selectedStudent.employabilityScore} / 100
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Projects</p>
                  <p className="font-bold text-foreground text-sm">
                    {selectedStudent.projectsCount}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Certificates</p>
                  <p className="font-bold text-foreground text-sm">
                    {selectedStudent.certificationsCount}
                  </p>
                </div>
              </div>

              {/* Placement Details */}
              {selectedStudent.placementStatus === "Placed" && (
                <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-xs space-y-1">
                  <p className="font-bold text-emerald-700 dark:text-emerald-400">
                    🎉 Confirmed Campus Placement
                  </p>
                  <p className="text-muted-foreground">
                    Placed at{" "}
                    <strong className="text-foreground">{selectedStudent.placedCompany}</strong>{" "}
                    with an annual compensation of{" "}
                    <strong className="text-emerald-600">₹{selectedStudent.packageLPA} LPA</strong>.
                  </p>
                </div>
              )}

              {/* Assessment Breakdown Across 6 Dimensions */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                  Comprehensive Assessment Breakdown
                </h4>
                <div className="space-y-2.5 p-3.5 rounded-xl border border-border bg-card">
                  {[
                    {
                      label: "Programming & Code Quality",
                      score: selectedStudent.assessmentScores.programming,
                    },
                    {
                      label: "Communication & Articulation",
                      score: selectedStudent.assessmentScores.communication,
                    },
                    {
                      label: "Algorithmic Problem Solving",
                      score: selectedStudent.assessmentScores.problemSolving,
                    },
                    {
                      label: "Leadership & Collaboration",
                      score: selectedStudent.assessmentScores.leadership,
                    },
                    {
                      label: "Analytical & Quantitative Thinking",
                      score: selectedStudent.assessmentScores.analyticalThinking,
                    },
                    {
                      label: "Core Domain Engineering",
                      score: selectedStudent.assessmentScores.domainKnowledge,
                    },
                  ].map((dim) => (
                    <div key={dim.label} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{dim.label}</span>
                        <span className="font-bold text-foreground">{dim.score}%</span>
                      </div>
                      <Progress value={dim.score} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Technical Skills */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-1.5">
                  Verified Technical Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStudent.skills.map((sk) => (
                    <Badge key={sk} variant="secondary" className="text-xs">
                      {sk}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="border-t border-border pt-3">
              <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                Close Dossier
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
