import { useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  Briefcase,
  Check,
  CheckCircle2,
  ChevronRight,
  Code2,
  Eye,
  FileText,
  Filter,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Search,
  Sparkles,
  Star,
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
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkillTag } from "@/components/skillbridge/primitives";
import { SectionCard, WorkspaceHeader } from "@/components/skillbridge/student-ui";
import { useAppState } from "@/context/app-state";
import type { Candidate } from "@/types";

export function IndustryCandidates() {
  const { candidates, internships, jobs, profile, shortlistCandidate, rejectCandidate } =
    useAppState();

  const [selectedRoleTitle, setSelectedRoleTitle] = useState<string>("Frontend Engineering Intern");
  const [candidateTab, setCandidateTab] = useState<"all" | "shortlisted">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals for Resume / Profile
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [modalType, setModalType] = useState<"resume" | "portfolio" | null>(null);

  // Available roles for matching target
  const availableRoles = useMemo(() => {
    const rolesList: { title: string; requiredSkills: string[]; type: string }[] = [];

    internships.forEach((i) => {
      rolesList.push({
        title: i.title,
        requiredSkills: i.requiredSkills,
        type: "Internship",
      });
    });

    jobs.forEach((j) => {
      rolesList.push({
        title: j.title,
        requiredSkills: j.requiredSkills,
        type: "Job",
      });
    });

    return rolesList;
  }, [internships, jobs]);

  // Current active role definition
  const currentRole = useMemo(() => {
    return (
      availableRoles.find((r) => r.title === selectedRoleTitle) ||
      availableRoles[0] || {
        title: "Frontend Engineering Intern",
        requiredSkills: ["React", "TypeScript", "Tailwind CSS", "Node.js"],
        type: "Internship",
      }
    );
  }, [availableRoles, selectedRoleTitle]);

  // Deterministic AI Matching computation
  const rankedCandidates = useMemo(() => {
    const targetSkills = currentRole.requiredSkills.map((s) => s.toLowerCase());

    return candidates
      .map((cand) => {
        // If candidate is logged in student, use real profile data
        const isStudent = cand.name.toLowerCase() === profile.name.toLowerCase();
        const candSkills = isStudent
          ? (profile.declaredSkills ?? profile.skills ?? []).map((s) => s.name)
          : cand.skills;
        const candSkillsLower = candSkills.map((s) => s.toLowerCase());

        // Find matching skills
        const matchingSkills = candSkills.filter((s) =>
          targetSkills.some(
            (ts) =>
              ts === s.toLowerCase() ||
              s.toLowerCase().includes(ts) ||
              ts.includes(s.toLowerCase()),
          ),
        );

        // Find missing skills
        const missingSkills = currentRole.requiredSkills.filter(
          (rs) =>
            !candSkillsLower.some(
              (cs) =>
                cs === rs.toLowerCase() ||
                cs.includes(rs.toLowerCase()) ||
                rs.toLowerCase().includes(cs),
            ),
        );

        // Skill overlap score (0 - 100)
        const skillOverlapRatio =
          targetSkills.length > 0 ? (matchingSkills.length / targetSkills.length) * 100 : 80;

        // Employability factor
        const empScore = isStudent ? 88 : (cand.employabilityScore ?? 82);
        const techScore = isStudent ? 90 : (cand.technicalScore ?? 85);

        // Overall deterministic Match % calculation
        const calculatedMatch = Math.min(
          98,
          Math.max(45, Math.round(skillOverlapRatio * 0.55 + empScore * 0.25 + techScore * 0.2)),
        );

        // Recommendation label
        let recommendation: "Excellent Fit" | "Strong Fit" | "Moderate Fit" = "Moderate Fit";
        if (calculatedMatch >= 85) recommendation = "Excellent Fit";
        else if (calculatedMatch >= 70) recommendation = "Strong Fit";

        // Key Strengths generation
        const strengths: string[] = [];
        if (matchingSkills.length >= 3) {
          strengths.push(`Covers ${matchingSkills.length} key required competencies`);
        }
        if (empScore >= 85) {
          strengths.push("High Employability & Assessment Readiness score");
        }
        if (cand.certifications && cand.certifications.length > 0) {
          strengths.push("Verified domain credential portfolio");
        }
        if (strengths.length === 0) {
          strengths.push("Solid foundation in core engineering principles");
        }

        const enrichedCandidate: Candidate = {
          ...cand,
          match: calculatedMatch,
          skills: candSkills,
          employabilityScore: empScore,
          technicalScore: techScore,
          about: isStudent ? profile.about : cand.about,
          projects: isStudent
            ? profile.projects.map((p) => ({
                title: p.title,
                tech: p.tech,
                description: p.description,
              }))
            : cand.projects,
          certifications: isStudent
            ? profile.certifications.map((c) => ({
                title: c.name || c.title || "Certificate",
                issuer: c.issuer,
                year: c.issueDate || "2025",
              }))
            : cand.certifications,
          avatar: isStudent ? profile.avatar : cand.avatar,
        };

        return {
          candidate: enrichedCandidate,
          matchPercentage: calculatedMatch,
          matchingSkills,
          missingSkills,
          recommendation,
          strengths,
        };
      })
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [candidates, currentRole, profile]);

  // Filter by Tab and Search
  const filteredCandidates = useMemo(() => {
    return rankedCandidates.filter(({ candidate }) => {
      const matchesTab = candidateTab === "all" ? true : candidate.shortlisted;

      const matchesSearch =
        searchQuery.trim() === "" ||
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesTab && matchesSearch;
    });
  }, [rankedCandidates, candidateTab, searchQuery]);

  const handleToggleShortlist = (candidate: Candidate) => {
    if (candidate.shortlisted) {
      rejectCandidate(candidate.id);
      toast.success(`${candidate.name} removed from shortlist.`);
    } else {
      shortlistCandidate(candidate.id);
      toast.success(`🎉 ${candidate.name} shortlisted for ${currentRole.title}!`);
    }
  };

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        eyebrow="AI Intelligence"
        title="AI Candidate Matching & Shortlisting"
        description="Deterministic skill vector analysis matching candidate portfolios with your role requirements."
      />

      {/* Target Role Selector & KPI Strip */}
      <SectionCard title="Target Role & Matching Criteria">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
              Select Opportunity
            </label>
            <select
              value={selectedRoleTitle}
              onChange={(e) => setSelectedRoleTitle(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            >
              {availableRoles.map((r) => (
                <option key={r.title} value={r.title}>
                  {r.title} ({r.type})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
              Required Competency Vector ({currentRole.requiredSkills.length} skills)
            </label>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {currentRole.requiredSkills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs font-medium">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Search and Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs
          value={candidateTab}
          onValueChange={(v) => setCandidateTab(v as "all" | "shortlisted")}
        >
          <TabsList>
            <TabsTrigger value="all" className="gap-2">
              All Matched Candidates ({rankedCandidates.length})
            </TabsTrigger>
            <TabsTrigger value="shortlisted" className="gap-2">
              <Star className="size-3.5 fill-amber-500 text-amber-500" /> Shortlisted Pool (
              {rankedCandidates.filter((c) => c.candidate.shortlisted).length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidates..."
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Ranked Candidate Cards */}
      <div className="space-y-4">
        {filteredCandidates.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <UserRound className="mx-auto size-12 text-muted-foreground/50" />
            <h3 className="mt-3 font-semibold text-foreground">No candidates in this view</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {candidateTab === "shortlisted"
                ? "No candidates have been shortlisted for this role yet."
                : "Try searching with different keywords."}
            </p>
          </div>
        ) : (
          filteredCandidates.map(
            ({
              candidate,
              matchPercentage,
              matchingSkills,
              missingSkills,
              recommendation,
              strengths,
            }) => {
              const isExcellent = recommendation === "Excellent Fit";
              const isStrong = recommendation === "Strong Fit";

              return (
                <Card
                  key={candidate.id}
                  className={`overflow-hidden border transition hover:shadow-md ${
                    candidate.shortlisted
                      ? "border-primary/50 bg-primary/5"
                      : "border-border/80 bg-card/90"
                  }`}
                >
                  <CardContent className="p-5">
                    <div className="grid gap-5 lg:grid-cols-12">
                      {/* Left 5 Cols: Candidate identity & Scores */}
                      <div className="lg:col-span-5 space-y-3">
                        <div className="flex items-start gap-3.5">
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

                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-display font-semibold text-base text-foreground">
                                {candidate.name}
                              </h3>
                              {candidate.shortlisted && (
                                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                                  Shortlisted
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {candidate.college} • {candidate.branch}
                            </p>
                            <p className="text-xs text-muted-foreground">{candidate.year}</p>
                          </div>
                        </div>

                        {/* Match & Employability Gauge */}
                        <div className="rounded-xl bg-muted/40 p-3 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-muted-foreground">
                              AI Role Alignment
                            </span>
                            <span
                              className={`font-bold font-display ${
                                isExcellent
                                  ? "text-emerald-600"
                                  : isStrong
                                    ? "text-blue-600"
                                    : "text-amber-600"
                              }`}
                            >
                              {matchPercentage}% Match
                            </span>
                          </div>
                          <Progress
                            value={matchPercentage}
                            className={`h-2 ${
                              isExcellent
                                ? "[&>div]:bg-emerald-600"
                                : isStrong
                                  ? "[&>div]:bg-blue-600"
                                  : "[&>div]:bg-amber-600"
                            }`}
                          />
                          <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
                            <span>Employability: {candidate.employabilityScore ?? 84}%</span>
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
                              <Sparkles className="size-3 mr-1" /> {recommendation}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Middle 4 Cols: Skill Breakdown & Strengths */}
                      <div className="lg:col-span-4 space-y-2.5 border-t lg:border-t-0 lg:border-l border-border pt-3 lg:pt-0 lg:pl-5">
                        {/* Matching Skills */}
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="size-3" /> Matching Skills (
                            {matchingSkills.length})
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {matchingSkills.length > 0 ? (
                              matchingSkills.map((s) => (
                                <span
                                  key={s}
                                  className="text-[10px] bg-emerald-500/10 text-emerald-700 font-semibold px-2 py-0.5 rounded-sm"
                                >
                                  {s}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                No direct matches
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Missing Skills */}
                        {missingSkills.length > 0 && (
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1">
                              <XCircle className="size-3" /> Missing Competencies (
                              {missingSkills.length})
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {missingSkills.map((s) => (
                                <span
                                  key={s}
                                  className="text-[10px] bg-amber-500/10 text-amber-700 font-medium px-2 py-0.5 rounded-sm"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Key Strengths */}
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                            Key Strengths
                          </p>
                          <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground list-disc list-inside">
                            {strengths.map((str, idx) => (
                              <li key={idx} className="line-clamp-1">
                                {str}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Right 3 Cols: Actions */}
                      <div className="lg:col-span-3 flex flex-col justify-between gap-3 border-t lg:border-t-0 lg:border-l border-border pt-3 lg:pt-0 lg:pl-5">
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <p className="font-semibold text-foreground">Candidate Actions</p>
                          <p>Inspect verified dossier or advance recruitment stage.</p>
                        </div>

                        <div className="space-y-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full h-8 text-xs gap-1.5"
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
                            className="w-full h-8 text-xs gap-1.5"
                            onClick={() => {
                              setSelectedCandidate(candidate);
                              setModalType("portfolio");
                            }}
                          >
                            <Eye className="size-3.5" /> View Portfolio
                          </Button>
                          <Button
                            size="sm"
                            variant={candidate.shortlisted ? "outline" : "default"}
                            className={`w-full h-8 text-xs gap-1.5 ${
                              candidate.shortlisted
                                ? "text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                                : ""
                            }`}
                            onClick={() => handleToggleShortlist(candidate)}
                          >
                            {candidate.shortlisted ? (
                              <>
                                <Check className="size-3.5" /> Shortlisted
                              </>
                            ) : (
                              <>
                                <UserCheck className="size-3.5" /> Shortlist Candidate
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            },
          )
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
                  <span>Resume: {selectedCandidate.name}</span>
                </div>
                <Badge variant="outline">{selectedCandidate.branch}</Badge>
              </DialogTitle>
              <DialogDescription className="sr-only">Resume view for candidate</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-2">
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

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                  <Code2 className="size-4" /> Technical Competencies
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCandidate.skills.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs font-medium">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                  <BookOpen className="size-4" /> Engineering Projects
                </h3>
                <div className="space-y-3">
                  {(selectedCandidate.projects || []).map((p, idx) => (
                    <div key={idx} className="rounded-xl border border-border p-3 space-y-1">
                      <h4 className="font-semibold text-sm text-foreground">{p.title}</h4>
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
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* View Portfolio Modal */}
      <Dialog
        open={modalType === "portfolio" && !!selectedCandidate}
        onOpenChange={(open) => !open && setModalType(null)}
      >
        {selectedCandidate && (
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 border-b border-border pb-3">
                <Eye className="size-5 text-primary" />
                <span>Verified Dossier: {selectedCandidate.name}</span>
              </DialogTitle>
              <DialogDescription className="sr-only">
                Portfolio view for candidate
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-2">
              <div className="flex items-center gap-4 rounded-xl bg-primary/5 border border-primary/20 p-4">
                <Avatar className="size-16 border border-border">
                  {selectedCandidate.avatar ? <AvatarImage src={selectedCandidate.avatar} /> : null}
                  <AvatarFallback className="bg-primary/20 text-primary font-bold text-lg">
                    {selectedCandidate.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold font-display text-foreground">
                    {selectedCandidate.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedCandidate.college} • {selectedCandidate.branch}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[11px]">
                      Employability: {selectedCandidate.employabilityScore ?? 85}%
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                  Professional Summary
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed rounded-xl border border-border p-3">
                  {selectedCandidate.about}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                  Featured Projects
                </h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(selectedCandidate.projects || []).map((proj, idx) => (
                    <div key={idx} className="rounded-xl border border-border p-3 space-y-2">
                      <h5 className="font-semibold text-xs text-foreground">{proj.title}</h5>
                      <p className="text-[11px] text-muted-foreground line-clamp-3">
                        {proj.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
