import { useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Code2,
  ExternalLink,
  Eye,
  FileCheck,
  FileText,
  Filter,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Search,
  SlidersHorizontal,
  Sparkles,
  UserCheck,
  UserRound,
  UserX,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SkillTag } from "@/components/skillbridge/primitives";
import { CandidateDetailsModal } from "@/components/skillbridge/industry-candidate-modal";
import { SectionCard, WorkspaceHeader } from "@/components/skillbridge/student-ui";
import { useAppState } from "@/context/app-state";
import type { Application, ApplicationStatus, Candidate } from "@/types";

export function IndustryApplicants() {
  const {
    industryApps,
    candidates,
    opportunities,
    setCandidateApplicationStatus,
    bulkShortlistCandidates,
    shortlistCandidate,
    rejectCandidate,
    profile,
    careerReadiness,
  } = useAppState();

  const [query, setQuery] = useState("");
  const [opportunityFilter, setOpportunityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [minMatchFilter, setMinMatchFilter] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"match-desc" | "match-asc" | "recent" | "readiness-desc">(
    "match-desc",
  );

  // Bulk Selection State
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);

  // Dossier Modal State
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [dossierOpen, setDossierOpen] = useState(false);

  // Merge each application with full candidate profile and stage 4/5 match scores
  const applicantRows = useMemo(() => {
    return industryApps.map((app) => {
      const candidateInfo = (candidates as Candidate[]).find(
        (c: Candidate) =>
          c.name.toLowerCase() === app.candidate?.toLowerCase() ||
          c.id === app.candidate ||
          c.id === app.id,
      );

      const isStudentProfile = app.candidate?.toLowerCase() === profile.name.toLowerCase();

      let candidateData: Candidate;
      if (candidateInfo) {
        candidateData = {
          ...candidateInfo,
          match: app.match ?? candidateInfo.match ?? 85,
          appliedFor: app.internship || candidateInfo.appliedFor,
          opportunityType: app.opportunityType || candidateInfo.opportunityType || "Internship",
          status: app.status,
          shortlisted:
            app.status === "Shortlisted" ||
            app.status === "Interview" ||
            (app.status as string) === "Interview Scheduled" ||
            (app.status as string) === "Interview Completed" ||
            app.status === "Offered" ||
            app.status === "Hired",
        };
      } else {
        candidateData = {
          id: `cand-${app.id}`,
          name: app.candidate || "Student Applicant",
          college: isStudentProfile
            ? profile.academicProfile?.institution || profile.college
            : app.branch || "Partner Institute",
          branch: isStudentProfile
            ? profile.academicProfile?.program || profile.branch
            : app.branch || "Computer Science",
          year: isStudentProfile
            ? `Batch ${profile.academicProfile?.graduationYear || profile.year || "2026"}`
            : "3rd Year",
          skills: isStudentProfile
            ? (profile.declaredSkills ?? []).map((s) => s.name)
            : ["React", "TypeScript", "Python"],
          gaps: isStudentProfile ? [] : ["Testing"],
          match: app.match ?? 85,
          appliedFor: app.internship,
          opportunityType: app.opportunityType || "Internship",
          shortlisted:
            app.status === "Shortlisted" ||
            app.status === "Interview" ||
            (app.status as string) === "Interview Scheduled" ||
            (app.status as string) === "Interview Completed" ||
            app.status === "Offered" ||
            app.status === "Hired",
          status: app.status,
          employabilityScore: isStudentProfile ? careerReadiness.overallScore : 84,
          technicalScore: isStudentProfile ? careerReadiness.dimensions.technicalSkills : 88,
          softSkillScore: isStudentProfile ? careerReadiness.dimensions.communication : 80,
          about: isStudentProfile ? profile.about : "Aspiring Software Engineer",
          projects: isStudentProfile
            ? (profile.projects ?? []).map((p) => ({
                title: p.title,
                tech: p.tech,
                description: p.description,
              }))
            : [],
          certifications: isStudentProfile
            ? (profile.certifications ?? []).map((c) => ({
                title: c.name,
                issuer: c.issuer,
                year: c.issueDate,
              }))
            : [],
          appliedDate: app.appliedDate,
        };
      }

      return {
        application: app,
        candidate: candidateData,
      };
    });
  }, [industryApps, candidates, profile, careerReadiness]);

  // Filtered & Sorted Applicant Rows
  const filteredApplicants = useMemo(() => {
    return applicantRows
      .filter(({ application, candidate }) => {
        // Query Search across Name, Skills, Degree, Branch, College, Target Role
        const q = query.toLowerCase().trim();
        const matchesQuery =
          !q ||
          candidate.name.toLowerCase().includes(q) ||
          candidate.college.toLowerCase().includes(q) ||
          candidate.branch.toLowerCase().includes(q) ||
          candidate.appliedFor.toLowerCase().includes(q) ||
          candidate.skills.some((s) => s.toLowerCase().includes(q));

        // Opportunity filter
        const matchesOpp =
          opportunityFilter === "all" ||
          application.internshipId === opportunityFilter ||
          application.internship.toLowerCase().includes(opportunityFilter.toLowerCase());

        // Status Filter
        const matchesStatus = statusFilter === "all" || application.status === statusFilter;

        // Min Match Filter
        const matchesMatch = (application.match ?? candidate.match ?? 0) >= minMatchFilter;

        return matchesQuery && matchesOpp && matchesStatus && matchesMatch;
      })
      .sort((a, b) => {
        if (sortBy === "match-desc") {
          return (b.application.match ?? b.candidate.match ?? 0) - (a.application.match ?? a.candidate.match ?? 0);
        }
        if (sortBy === "match-asc") {
          return (a.application.match ?? a.candidate.match ?? 0) - (b.application.match ?? b.candidate.match ?? 0);
        }
        if (sortBy === "readiness-desc") {
          return (b.candidate.employabilityScore ?? 0) - (a.candidate.employabilityScore ?? 0);
        }
        return 0; // default recent
      });
  }, [applicantRows, query, opportunityFilter, statusFilter, minMatchFilter, sortBy]);

  // Handle Multi-Select Checkboxes
  const handleToggleSelectAll = () => {
    if (selectedAppIds.length === filteredApplicants.length) {
      setSelectedAppIds([]);
    } else {
      setSelectedAppIds(filteredApplicants.map((r) => r.application.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedAppIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleBulkShortlist = () => {
    if (selectedAppIds.length === 0) return;
    bulkShortlistCandidates(selectedAppIds);
    toast.success(`🎉 ${selectedAppIds.length} candidate(s) shortlisted in bulk!`);
    setSelectedAppIds([]);
  };

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        eyebrow="Industry Portal"
        title="Application Inbox & Screening"
        description="Filter, evaluate, and shortlist campus candidates with real-time match analytics and candidate dossiers."
      />

      {/* Filter and Search Control Bar */}
      <Card className="border-border/80 bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates by name, skill, degree, department, or college..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Opportunity Filter */}
            <select
              aria-label="Filter by Opportunity"
              value={opportunityFilter}
              onChange={(e) => setOpportunityFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-xs md:w-56"
            >
              <option value="all">All Opportunities ({opportunities.length})</option>
              {opportunities.map((opp) => (
                <option key={opp.id} value={opp.id}>
                  {opp.title} ({opp.company})
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              aria-label="Filter by Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-xs md:w-44"
            >
              <option value="all">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Assessment">Assessment</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Interview Completed">Interview Completed</option>
              <option value="Offered">Offered</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>

            {/* Match Filter */}
            <select
              aria-label="Filter by Match Score"
              value={minMatchFilter}
              onChange={(e) => setMinMatchFilter(parseInt(e.target.value, 10))}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-xs md:w-40"
            >
              <option value={0}>All Matches</option>
              <option value={85}>85%+ (Best Match)</option>
              <option value={75}>75%+ (High Fit)</option>
              <option value={60}>60%+ (Eligible)</option>
            </select>

            {/* Sort Selector */}
            <select
              aria-label="Sort Candidates"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-xs md:w-44"
            >
              <option value="match-desc">Match: High to Low</option>
              <option value="match-asc">Match: Low to High</option>
              <option value="readiness-desc">Readiness Score</option>
              <option value="recent">Most Recent</option>
            </select>
          </div>

          {/* Bulk Action Sticky Bar if any selected */}
          {selectedAppIds.length > 0 && (
            <div className="flex items-center justify-between bg-primary/10 border border-primary/30 rounded-xl p-3 animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground font-bold text-xs">
                  {selectedAppIds.length} Selected
                </Badge>
                <span className="text-xs text-foreground font-medium">candidates selected for batch decision</span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setSelectedAppIds([])}>
                  Deselect All
                </Button>
                <Button size="sm" className="h-8 text-xs gap-1.5" onClick={handleBulkShortlist}>
                  <UserCheck className="size-3.5" /> Shortlist Selected ({selectedAppIds.length})
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Applicant Records Table / Cards */}
      <SectionCard
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              <h3 className="font-display text-base font-semibold">
                Candidates ({filteredApplicants.length})
              </h3>
            </div>
            {filteredApplicants.length > 0 && (
              <button
                type="button"
                onClick={handleToggleSelectAll}
                className="text-xs text-muted-foreground hover:text-foreground font-medium"
              >
                {selectedAppIds.length === filteredApplicants.length ? "Deselect All" : "Select All Visible"}
              </button>
            )}
          </div>
        }
      >
        {filteredApplicants.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <UserRound className="size-10 text-muted-foreground/50 mx-auto" />
            <p className="text-sm font-semibold text-foreground">No applicants matching your criteria.</p>
            <p className="text-xs text-muted-foreground">Try clearing filters or search terms.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredApplicants.map(({ application, candidate }) => {
              const isSelected = selectedAppIds.includes(application.id);
              const matchScore = application.match ?? candidate.match ?? 85;
              const readiness = candidate.employabilityScore ?? 84;

              return (
                <div
                  key={application.id}
                  onClick={() => {
                    setSelectedCandidate(candidate);
                    setDossierOpen(true);
                  }}
                  className={`py-4 px-3 rounded-xl transition cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                    isSelected ? "bg-primary/5 border border-primary/30" : "hover:bg-muted/20"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleToggleSelectOne(application.id);
                      }}
                      className="size-4 rounded mt-1 border-muted-foreground text-primary focus:ring-primary cursor-pointer"
                    />

                    {/* Avatar */}
                    <Avatar className="size-12 border border-border shrink-0">
                      {candidate.avatar ? <AvatarImage src={candidate.avatar} /> : null}
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                        {candidate.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    {/* Information */}
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold text-sm text-foreground hover:text-primary transition truncate">
                          {candidate.name}
                        </h4>
                        <Badge
                          variant="outline"
                          className={
                            application.status === "Shortlisted"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]"
                              : (application.status as string) === "Interview Scheduled" ||
                                  (application.status as string) === "Interview Completed" ||
                                  application.status === "Interview"
                                ? "bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]"
                                : (application.status as string) === "Assessment"
                                  ? "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]"
                                  : application.status === "Offered"
                                    ? "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 text-[10px]"
                                    : application.status === "Hired"
                                      ? "bg-purple-500/10 text-purple-600 border-purple-500/20 text-[10px]"
                                      : application.status === "Rejected"
                                        ? "bg-rose-500/10 text-rose-600 border-rose-500/20 text-[10px]"
                                        : "bg-muted text-muted-foreground text-[10px]"
                          }
                        >
                          {application.status}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground truncate">
                        {candidate.college} • {candidate.branch} ({candidate.year})
                      </p>

                      <p className="text-[11px] text-foreground font-medium flex items-center gap-1.5 pt-0.5">
                        <Briefcase className="size-3 text-primary" /> Applied for: {application.internship}
                      </p>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {candidate.skills.slice(0, 5).map((s) => (
                          <SkillTag key={s} muted>
                            {s}
                          </SkillTag>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Metrics & Quick Actions */}
                  <div
                    className="flex flex-wrap sm:flex-nowrap items-center justify-between lg:justify-end gap-4 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-border"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Readiness Gauge */}
                    <div className="text-right">
                      <div className="text-[11px] text-muted-foreground">Readiness</div>
                      <div className="font-bold text-xs text-foreground">{readiness}/100</div>
                    </div>

                    {/* Match Score */}
                    <div className="text-right">
                      <div className="text-[11px] text-muted-foreground">AI Match</div>
                      <div className="font-display font-bold text-sm text-emerald-600">
                        {matchScore}%
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs gap-1"
                        onClick={() => {
                          setSelectedCandidate(candidate);
                          setDossierOpen(true);
                        }}
                      >
                        <Eye className="size-3.5" /> Dossier
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="default" className="h-8 text-xs">
                            Decision <ChevronDown className="size-3 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => {
                              shortlistCandidate(candidate.id, application.id);
                              toast.success(`🎉 ${candidate.name} shortlisted!`);
                            }}
                          >
                            <UserCheck className="size-3.5 mr-2 text-emerald-600" /> Shortlist
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setCandidateApplicationStatus(application.id, "Assessment" as any, {
                                nextStep: "Technical MCQ & Coding Assessment assigned",
                              });
                              toast.info(`Assessment assigned to ${candidate.name}.`);
                            }}
                          >
                            <Sparkles className="size-3.5 mr-2 text-amber-600" /> Move to Assessment
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedCandidate(candidate);
                              setDossierOpen(true);
                            }}
                          >
                            <Calendar className="size-3.5 mr-2 text-blue-600" /> Schedule Interview
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              rejectCandidate(candidate.id, application.id);
                              toast.error(`${candidate.name} marked as rejected.`);
                            }}
                            className="text-rose-600"
                          >
                            <UserX className="size-3.5 mr-2" /> Reject Candidate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* Candidate Evaluation Dossier Modal */}
      {selectedCandidate && (
        <CandidateDetailsModal
          candidate={selectedCandidate}
          open={dossierOpen}
          onOpenChange={setDossierOpen}
        />
      )}
    </div>
  );
}
