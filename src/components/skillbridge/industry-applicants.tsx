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
    setIndustryStatus,
    shortlistCandidate,
    rejectCandidate,
    internships,
    jobs,
    profile,
  } = useAppState();

  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [skillFilter, setSkillFilter] = useState("");
  const [sortBy, setSortBy] = useState<"match-desc" | "match-asc" | "recent">("match-desc");

  // Dossier Modal states
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [modalType, setModalType] = useState<"resume" | "portfolio" | null>(null);

  // Combine application with rich candidate dossier
  const applicantRows = useMemo(() => {
    return industryApps.map((app) => {
      const candidateInfo = candidates.find(
        (c) =>
          c.name.toLowerCase() === app.candidate?.toLowerCase() ||
          c.id === app.candidate ||
          c.id === app.id,
      );

      // If matches the logged-in student, combine live profile
      const isStudentProfile = app.candidate?.toLowerCase() === profile.name.toLowerCase();

      const candidateData: Candidate = candidateInfo || {
        id: `cand-${app.id}`,
        name: app.candidate || "Student Applicant",
        college: app.branch || "Partner Institute",
        branch: app.branch || "Computer Science",
        year: "3rd Year",
        skills: isStudentProfile
          ? profile.skills.map((s) => s.name)
          : ["React", "TypeScript", "Python"],
        gaps: isStudentProfile ? [] : ["Testing"],
        match: app.match ?? 85,
        appliedFor: app.internship,
        shortlisted: app.status === "Shortlisted",
        status: app.status,
        employabilityScore: isStudentProfile ? 88 : 82,
        technicalScore: isStudentProfile ? 90 : 85,
        softSkillScore: isStudentProfile ? 84 : 80,
        email: isStudentProfile ? profile.email : "candidate@partner.edu",
        phone: isStudentProfile ? profile.phone : "+91 98765 43210",
        about: isStudentProfile
          ? profile.about
          : "Aspiring software engineer with strong technical foundations.",
        projects: isStudentProfile
          ? profile.projects.map((p) => ({
              title: p.title,
              tech: p.tech,
              description: p.description,
            }))
          : [
              {
                title: "Capstone Project",
                tech: ["React", "Node.js"],
                description: "Full-stack web application.",
              },
            ],
        certifications: isStudentProfile
          ? profile.certifications.map((c) => ({
              title: c.name || c.title || "Certificate",
              issuer: c.issuer,
              year: c.issueDate || "2025",
            }))
          : [],
        appliedDate: app.appliedDate,
        avatar: isStudentProfile ? profile.avatar : undefined,
      };

      return {
        app,
        candidate: candidateData,
      };
    });
  }, [industryApps, candidates, profile]);

  // Unique roles for filter dropdown
  const uniqueRoles = useMemo(() => {
    const roles = new Set<string>();
    for (const row of applicantRows) {
      if (row.app.internship) roles.add(row.app.internship);
    }
    return Array.from(roles);
  }, [applicantRows]);

  // Filter & Sort
  const filteredApplicants = useMemo(() => {
    return applicantRows
      .filter(({ app, candidate }) => {
        const matchesQuery =
          query.trim() === "" ||
          candidate.name.toLowerCase().includes(query.toLowerCase()) ||
          candidate.college.toLowerCase().includes(query.toLowerCase()) ||
          candidate.branch.toLowerCase().includes(query.toLowerCase()) ||
          candidate.skills.some((s) => s.toLowerCase().includes(query.toLowerCase()));

        const matchesRole = roleFilter === "all" || app.internship === roleFilter;

        const matchesStatus = statusFilter === "all" || app.status === statusFilter;

        const matchesSkill =
          skillFilter.trim() === "" ||
          candidate.skills.some((s) => s.toLowerCase().includes(skillFilter.toLowerCase()));

        return matchesQuery && matchesRole && matchesStatus && matchesSkill;
      })
      .sort((a, b) => {
        if (sortBy === "match-desc") return (b.app.match ?? 0) - (a.app.match ?? 0);
        if (sortBy === "match-asc") return (a.app.match ?? 0) - (b.app.match ?? 0);
        return b.app.id.localeCompare(a.app.id);
      });
  }, [applicantRows, query, roleFilter, statusFilter, skillFilter, sortBy]);

  const handleStatusChange = (appId: string, candName: string, status: ApplicationStatus) => {
    setIndustryStatus(appId, status);
    toast.success(`Applicant ${candName} marked as "${status}"`);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case "Shortlisted":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            Shortlisted
          </Badge>
        );
      case "Interview":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
            Interview Scheduled
          </Badge>
        );
      case "Selected":
        return (
          <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">
            Selected / Hired
          </Badge>
        );
      case "Rejected":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Rejected
          </Badge>
        );
      case "Under Review":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Under Review</Badge>
        );
      default:
        return <Badge variant="secondary">Applied</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        eyebrow="Talent Pipeline"
        title="Applicant Tracking & Review"
        description="Review student submissions, inspect full dossiers and resumes, and update recruitment stages in real time."
      />

      {/* Filter & Search Bar */}
      <SectionCard title="Filter & Search Applicants">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by student name, college..."
              className="pl-9"
            />
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="all">All Opportunities ({uniqueRoles.length})</option>
              {uniqueRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="all">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview Scheduled</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "match-desc" | "match-asc" | "recent")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="match-desc">Sort: Highest Match %</option>
              <option value="match-asc">Sort: Lowest Match %</option>
              <option value="recent">Sort: Most Recent</option>
            </select>
          </div>
        </div>

        {/* Skill filter chip bar */}
        <div className="mt-3 flex flex-wrap items-center gap-2 pt-3 border-t border-border">
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <SlidersHorizontal className="size-3.5" /> Quick Skill Filter:
          </span>
          {["React", "TypeScript", "Python", "SQL", "Docker", "AWS", "Node.js"].map((skill) => {
            const active = skillFilter.toLowerCase() === skill.toLowerCase();
            return (
              <button
                key={skill}
                onClick={() => setSkillFilter(active ? "" : skill)}
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition ${
                  active
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {skill}
              </button>
            );
          })}
          {skillFilter && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setSkillFilter("")}
            >
              Clear Filter
            </Button>
          )}
        </div>
      </SectionCard>

      {/* Applicants List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-bold text-foreground">{filteredApplicants.length}</span>{" "}
            applicants
          </p>
        </div>

        {filteredApplicants.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <UserRound className="mx-auto size-12 text-muted-foreground/50" />
            <h3 className="mt-3 font-semibold text-foreground">No applicants found</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Try adjusting your query, role selection, or status filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredApplicants.map(({ app, candidate }) => {
              const match = app.match ?? candidate.match ?? 85;
              const isExcellent = match >= 85;
              const isStrong = match >= 70 && match < 85;

              return (
                <Card
                  key={app.id}
                  className="overflow-hidden border-border/80 bg-card/90 transition hover:border-primary/40 hover:shadow-md"
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      {/* Left: Avatar & Candidate Info */}
                      <div className="flex items-start gap-4">
                        <Avatar className="size-14 border border-border shrink-0">
                          {candidate.avatar ? (
                            <AvatarImage src={candidate.avatar} alt={candidate.name} />
                          ) : null}
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-base">
                            {candidate.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-display font-semibold text-base text-foreground">
                              {candidate.name}
                            </h3>
                            {getStatusBadge(app.status)}
                            <Badge
                              variant="outline"
                              className={
                                isExcellent
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]"
                                  : isStrong
                                    ? "bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]"
                                    : "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]"
                              }
                            >
                              <Sparkles className="size-3 mr-1" />
                              {isExcellent
                                ? "Excellent Fit"
                                : isStrong
                                  ? "Strong Fit"
                                  : "Moderate Fit"}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1 font-medium text-foreground">
                              <GraduationCap className="size-3.5 text-primary" />
                              {candidate.college}
                            </span>
                            <span>•</span>
                            <span>{candidate.branch}</span>
                            <span>•</span>
                            <span>{candidate.year}</span>
                            <span>•</span>
                            <span>Applied: {app.appliedDate}</span>
                          </div>

                          <p className="text-xs font-semibold text-primary">
                            Applied For: {app.internship} ({app.opportunityType ?? "Internship"})
                          </p>

                          {/* Skills preview */}
                          <div className="flex flex-wrap gap-1 pt-1">
                            {candidate.skills.slice(0, 6).map((skill) => (
                              <SkillTag key={skill} muted>
                                {skill}
                              </SkillTag>
                            ))}
                            {candidate.skills.length > 6 && (
                              <span className="text-[11px] text-muted-foreground font-medium self-center">
                                +{candidate.skills.length - 6} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Match Stats & Actions */}
                      <div className="flex flex-col sm:flex-row lg:flex-col items-end gap-3 justify-between border-t lg:border-t-0 pt-3 lg:pt-0 border-border">
                        {/* Score badges */}
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                              AI Match
                            </p>
                            <p
                              className={`text-xl font-bold font-display ${
                                isExcellent
                                  ? "text-emerald-600"
                                  : isStrong
                                    ? "text-blue-600"
                                    : "text-amber-600"
                              }`}
                            >
                              {match}%
                            </p>
                          </div>
                          <div className="h-8 w-px bg-border" />
                          <div className="text-right">
                            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                              Employability
                            </p>
                            <p className="text-xl font-bold font-display text-primary">
                              {candidate.employabilityScore ?? 84}%
                            </p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 gap-1.5 text-xs"
                            onClick={() => {
                              setSelectedCandidate(candidate);
                              setModalType("resume");
                            }}
                          >
                            <FileText className="size-3.5" /> View Resume
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 gap-1.5 text-xs"
                            onClick={() => {
                              setSelectedCandidate(candidate);
                              setModalType("portfolio");
                            }}
                          >
                            <Eye className="size-3.5" /> View Portfolio
                          </Button>

                          {/* Quick Status Dropdown */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" className="h-8 gap-1 text-xs">
                                Action <ChevronDown className="size-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-emerald-600 gap-2 font-medium"
                                onClick={() =>
                                  handleStatusChange(app.id, candidate.name, "Shortlisted")
                                }
                              >
                                <UserCheck className="size-4" /> Shortlist Candidate
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-blue-600 gap-2 font-medium"
                                onClick={() =>
                                  handleStatusChange(app.id, candidate.name, "Interview")
                                }
                              >
                                <Calendar className="size-4" /> Schedule Interview
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-purple-600 gap-2 font-medium"
                                onClick={() =>
                                  handleStatusChange(app.id, candidate.name, "Selected")
                                }
                              >
                                <CheckCircle2 className="size-4" /> Make Offer / Select
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive gap-2 font-medium"
                                onClick={() =>
                                  handleStatusChange(app.id, candidate.name, "Rejected")
                                }
                              >
                                <UserX className="size-4" /> Reject Application
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* View Resume Modal */}
      <Dialog
        open={modalType === "resume" && !!selectedCandidate}
        onOpenChange={(open) => !open && setModalType(null)}
      >
        {selectedCandidate && (
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between gap-2 border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="size-5 text-primary" />
                  <span>Applicant Resume: {selectedCandidate.name}</span>
                </div>
                <Badge variant="outline">{selectedCandidate.branch}</Badge>
              </DialogTitle>
              <DialogDescription className="sr-only">Resume view for candidate</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-2">
              {/* Header Contact Block */}
              <div className="rounded-xl bg-muted/40 p-4 space-y-2">
                <h2 className="text-xl font-bold font-display text-foreground">
                  {selectedCandidate.name}
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {selectedCandidate.about}
                </p>
                <div className="flex flex-wrap gap-4 pt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Mail className="size-3.5 text-primary" />
                    {selectedCandidate.email || "student@partner.edu"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="size-3.5 text-primary" />
                    {selectedCandidate.phone || "+91 98765 43210"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="size-3.5 text-primary" />
                    {selectedCandidate.college}
                  </span>
                </div>
              </div>

              {/* Education */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                  <GraduationCap className="size-4" /> Education
                </h3>
                <div className="rounded-xl border border-border p-3 space-y-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-sm text-foreground">
                      {selectedCandidate.college}
                    </h4>
                    <span className="text-xs text-muted-foreground">2022 - 2026</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedCandidate.branch} • {selectedCandidate.year}
                  </p>
                  <p className="text-xs font-semibold text-emerald-600">8.72 CGPA (Verified)</p>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                  <Code2 className="size-4" /> Technical Proficiency
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCandidate.skills.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs font-medium">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                  <BookOpen className="size-4" /> Engineering Projects
                </h3>
                <div className="space-y-3">
                  {(selectedCandidate.projects || []).map((p, idx) => (
                    <div key={idx} className="rounded-xl border border-border p-3 space-y-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-sm text-foreground">{p.title}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {p.description}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {p.tech.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] bg-muted px-2 py-0.5 rounded-sm font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              {(selectedCandidate.certifications || []).length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                    <Award className="size-4" /> Verified Credentials
                  </h3>
                  <div className="space-y-2">
                    {selectedCandidate.certifications?.map((c, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-xs p-2 rounded-lg bg-muted/40"
                      >
                        <span className="font-semibold text-foreground">{c.title}</span>
                        <span className="text-muted-foreground">
                          {c.issuer} ({c.year})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Candidate Profile Dossier Modal */}
      <CandidateDetailsModal
        candidate={selectedCandidate}
        open={modalType === "portfolio" && !!selectedCandidate}
        onOpenChange={(open) => !open && setModalType(null)}
      />
    </div>
  );
}
