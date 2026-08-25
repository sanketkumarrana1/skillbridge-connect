import { useState } from "react";
import {
  Award,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Code2,
  FileCheck,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  UserCheck,
  UserX,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkillTag } from "@/components/skillbridge/primitives";
import { useAppState } from "@/context/app-state";
import type { Candidate } from "@/types";

export interface CandidateModalProps {
  candidate: Candidate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduleInterview?: (candidate: Candidate) => void;
  onSendOffer?: (candidate: Candidate) => void;
}

export function CandidateDetailsModal({
  candidate,
  open,
  onOpenChange,
  onScheduleInterview,
  onSendOffer,
}: CandidateModalProps) {
  const { shortlistCandidate, rejectCandidate, hireCandidate } = useAppState();
  const [activeTab, setActiveTab] = useState<"overview" | "resume" | "assessment">("overview");

  if (!candidate) return null;

  const empScore = candidate.employabilityScore ?? 86;
  const techScore = candidate.technicalScore ?? 88;
  const softScore = candidate.softSkillScore ?? 82;

  const handleShortlist = () => {
    shortlistCandidate(candidate.id);
    toast.success(`🎉 ${candidate.name} shortlisted!`);
  };

  const handleReject = () => {
    rejectCandidate(candidate.id);
    toast.success(`${candidate.name} marked as rejected.`);
    onOpenChange(false);
  };

  const handleHire = () => {
    hireCandidate(candidate.id);
    toast.success(`🎉 Congratulations! ${candidate.name} has been hired.`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-primary/15 via-primary/5 to-card p-6 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <Avatar className="size-16 border-2 border-primary/30 shadow-md">
                {candidate.avatar ? <AvatarImage src={candidate.avatar} /> : null}
                <AvatarFallback className="bg-primary/20 text-primary font-bold text-xl">
                  {candidate.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold font-display text-foreground">
                    {candidate.name}
                  </h2>
                  <Badge
                    variant="outline"
                    className={
                      candidate.status === "Hired"
                        ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                        : candidate.status === "Offered"
                          ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                          : candidate.status === "Shortlisted"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-muted text-muted-foreground"
                    }
                  >
                    {candidate.status || (candidate.shortlisted ? "Shortlisted" : "Applied")}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {candidate.college} • {candidate.branch} ({candidate.year})
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="size-3 text-primary" />{" "}
                    {candidate.email || "candidate@partner.edu"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="size-3 text-primary" /> {candidate.phone || "+91 98765 43210"}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-primary">
                    <Briefcase className="size-3" /> {candidate.appliedFor}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center bg-card/80 backdrop-blur-xs border border-border p-3 rounded-2xl">
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                  AI Fit Match
                </p>
                <p className="text-xl font-bold font-display text-emerald-600">
                  {candidate.match}%
                </p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                  Employability
                </p>
                <p className="text-xl font-bold font-display text-primary">{empScore}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="border-b border-border bg-card px-6 pt-4">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "overview" | "resume" | "assessment")}
          >
            <TabsList className="grid w-full grid-cols-3 sm:max-w-md">
              <TabsTrigger value="overview">Dossier Overview</TabsTrigger>
              <TabsTrigger value="resume">Resume Preview</TabsTrigger>
              <TabsTrigger value="assessment">Assessment & Gaps</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Modal Tab Body */}
        <div className="p-6 space-y-6">
          {/* Tab 1: Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Bio */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                  Professional Bio & About
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 p-3.5 rounded-xl border border-border">
                  {candidate.about ||
                    "Passionate engineering student with practical experience building modern web applications, scalable APIs, and applied machine learning tools."}
                </p>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                  <Code2 className="size-3.5" /> Technical Competencies
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.skills.map((s) => (
                    <SkillTag key={s} muted>
                      {s}
                    </SkillTag>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                  <BookOpen className="size-3.5" /> Featured Engineering Projects
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(
                    candidate.projects || [
                      {
                        title: "Production Dashboard App",
                        tech: ["React", "TypeScript", "Tailwind CSS"],
                        description:
                          "Enterprise monitoring dashboard with real-time analytics widgets.",
                      },
                      {
                        title: "Applied AI Classifier",
                        tech: ["Python", "FastAPI", "TensorFlow"],
                        description:
                          "High accuracy diagnostic neural model deployed with sub-100ms latency.",
                      },
                    ]
                  ).map((p, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-border p-3.5 space-y-1.5 bg-card"
                    >
                      <h4 className="font-semibold text-xs text-foreground">{p.title}</h4>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {p.tech.map((t) => (
                          <span
                            key={t}
                            className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm font-semibold"
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
              {(candidate.certifications || []).length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                    <Award className="size-3.5" /> Verified Industry Credentials
                  </h3>
                  <div className="space-y-2">
                    {candidate.certifications?.map((c, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-muted/40 border border-border"
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
          )}

          {/* Tab 2: Resume */}
          {activeTab === "resume" && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-5">
              <div className="border-b border-border pb-4 text-center space-y-1">
                <h2 className="text-2xl font-bold font-display text-foreground">
                  {candidate.name}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {candidate.appliedFor} • {candidate.college}
                </p>
                <p className="text-xs text-muted-foreground">
                  {candidate.email} • {candidate.phone} • Raipur / Bengaluru, India
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border pb-1 mb-2">
                  Education
                </h3>
                <div className="flex justify-between text-xs font-semibold">
                  <span>{candidate.college}</span>
                  <span className="text-muted-foreground">2022 - 2026</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {candidate.branch} • {candidate.year}
                </p>
                <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                  8.72 CGPA (First Class Distinction)
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border pb-1 mb-2">
                  Technical Expertise
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Languages & Frameworks: </strong>
                  {candidate.skills.join(", ")}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border pb-1 mb-2">
                  Engineering Projects
                </h3>
                <div className="space-y-3">
                  {(candidate.projects || []).map((p, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>{p.title}</span>
                        <span className="text-muted-foreground text-[10px]">
                          ({p.tech.join(", ")})
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Assessment & Skill Gaps */}
          {activeTab === "assessment" && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border p-4 bg-muted/20 space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">Employability Index</p>
                  <p className="text-2xl font-bold font-display text-primary">{empScore}%</p>
                  <Progress value={empScore} className="h-1.5" />
                </div>
                <div className="rounded-xl border border-border p-4 bg-muted/20 space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">Technical Readiness</p>
                  <p className="text-2xl font-bold font-display text-emerald-600">{techScore}%</p>
                  <Progress value={techScore} className="h-1.5 [&>div]:bg-emerald-600" />
                </div>
                <div className="rounded-xl border border-border p-4 bg-muted/20 space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">Soft Skills & Comms</p>
                  <p className="text-2xl font-bold font-display text-blue-600">{softScore}%</p>
                  <Progress value={softScore} className="h-1.5 [&>div]:bg-blue-600" />
                </div>
              </div>

              {/* Assessment Category breakdown */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
                  Category Proficiency Breakdown
                </h3>
                <div className="space-y-3">
                  {[
                    { cat: "Programming & Code Quality", val: 92 },
                    { cat: "Data Structures & Problem Solving", val: 88 },
                    { cat: "System Design & Architecture", val: 74 },
                    { cat: "Analytical Thinking", val: 86 },
                    { cat: "Communication & Teamwork", val: 84 },
                  ].map((row) => (
                    <div key={row.cat} className="space-y-1 text-xs">
                      <div className="flex justify-between font-medium">
                        <span className="text-foreground">{row.cat}</span>
                        <span className="text-primary font-bold">{row.val}%</span>
                      </div>
                      <Progress value={row.val} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Gaps */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-2 flex items-center gap-1.5">
                  <XCircle className="size-3.5" /> Identified Competency Gaps
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(candidate.gaps && candidate.gaps.length > 0
                    ? candidate.gaps
                    : ["Advanced Kubernetes", "Distributed Tracing"]
                  ).map((gap) => (
                    <Badge
                      key={gap}
                      variant="outline"
                      className="bg-amber-500/10 text-amber-700 border-amber-500/20 text-xs"
                    >
                      {gap}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-muted/40 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:bg-destructive/10"
            onClick={handleReject}
          >
            <UserX className="size-3.5 mr-1.5" /> Reject
          </Button>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShortlist}>
              <UserCheck className="size-3.5 mr-1.5 text-emerald-600" /> Shortlist
            </Button>
            {onScheduleInterview && (
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-500/30 hover:bg-blue-500/10"
                onClick={() => {
                  onOpenChange(false);
                  onScheduleInterview(candidate);
                }}
              >
                <Calendar className="size-3.5 mr-1.5" /> Schedule Interview
              </Button>
            )}
            {onSendOffer && (
              <Button
                variant="outline"
                size="sm"
                className="text-purple-600 border-purple-500/30 hover:bg-purple-500/10"
                onClick={() => {
                  onOpenChange(false);
                  onSendOffer(candidate);
                }}
              >
                <FileCheck className="size-3.5 mr-1.5" /> Send Offer
              </Button>
            )}
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleHire}
            >
              <CheckCircle2 className="size-3.5 mr-1.5" /> Hire Candidate
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
