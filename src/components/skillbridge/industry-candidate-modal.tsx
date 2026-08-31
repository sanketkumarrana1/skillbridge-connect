import { useState } from "react";
import {
  AlertCircle,
  Award,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Code2,
  ExternalLink,
  Eye,
  FileCheck,
  FileText,
  Github,
  Globe,
  GraduationCap,
  Layers,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { SkillTag } from "@/components/skillbridge/primitives";
import { useAppState } from "@/context/app-state";
import type {
  Candidate,
  OpportunityWorkMode,
  RecruiterAssessmentAssignment,
} from "@/types";

export interface CandidateModalProps {
  candidate: Candidate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CandidateDetailsModal({
  candidate,
  open,
  onOpenChange,
}: CandidateModalProps) {
  const {
    companyProfile,
    shortlistCandidate,
    rejectCandidate,
    hireCandidate,
    setCandidateApplicationStatus,
    assignRecruiterAssessment,
    scheduleRecruiterInterview,
    submitInterviewFeedback,
    createAndSendOffer,
    interviews,
    corporateOffers,
  } = useAppState();

  const [activeTab, setActiveTab] = useState<
    "match" | "passport" | "portfolio" | "workflow"
  >("match");

  // Workflow Form States
  const [assessmentType, setAssessmentType] = useState<
    "Technical" | "Skill-Specific" | "Custom"
  >("Technical");
  const [assessmentTitle, setAssessmentTitle] = useState("Frontend Architecture & Component Test");
  const [assessmentDeadline, setAssessmentDeadline] = useState("2026-09-05");

  // Interview Schedule State
  const [intvDate, setIntvDate] = useState("2026-09-02");
  const [intvTime, setIntvTime] = useState("11:00 AM - 12:00 PM");
  const [intvMode, setIntvMode] = useState<"Google Meet" | "Zoom" | "On-site">("Google Meet");
  const [interviewerName, setInterviewerName] = useState(
    companyProfile.name + " Engineering Panel",
  );
  const [intvNotes, setIntvNotes] = useState(
    "Technical architecture and system design interview.",
  );

  // Interview Feedback State
  const [techRating, setTechRating] = useState(5);
  const [problemSolvingRating, setProblemSolvingRating] = useState(4);
  const [commRating, setCommRating] = useState(5);
  const [teamworkRating, setTeamworkRating] = useState(4);
  const [roleFitRating, setRoleFitRating] = useState(5);
  const [feedbackNotes, setFeedbackNotes] = useState(
    "Demonstrated exceptional code clarity and deep understanding of component lifecycle.",
  );
  const [feedbackRecommendation, setFeedbackRecommendation] = useState<
    "Strong Hire" | "Hire" | "Hold" | "No Hire"
  >("Strong Hire");

  // Offer Generation State
  const [offerDesignation, setOfferDesignation] = useState(
    candidate?.appliedFor || "Frontend Engineering Intern",
  );
  const [offerCompensation, setOfferCompensation] = useState("₹45,000 / mo");
  const [offerJoiningDate, setOfferJoiningDate] = useState("2026-10-01");
  const [offerWorkMode, setOfferWorkMode] = useState<OpportunityWorkMode>("Hybrid");

  if (!candidate) return null;

  const match = candidate.match ?? 88;
  const empScore = candidate.employabilityScore ?? 86;
  const techScore = candidate.technicalScore ?? 88;
  const softScore = candidate.softSkillScore ?? 82;

  // Existing interview or offer for this candidate
  const existingInterview = interviews.find(
    (i) =>
      i.candidateId === candidate.id ||
      i.candidateName.toLowerCase() === candidate.name.toLowerCase(),
  );

  const existingOffer = corporateOffers.find(
    (o) =>
      o.candidateId === candidate.id ||
      o.candidateName.toLowerCase() === candidate.name.toLowerCase(),
  );

  const handleShortlist = () => {
    shortlistCandidate(candidate.id);
    toast.success(`🎉 ${candidate.name} has been shortlisted.`);
  };

  const handleReject = () => {
    rejectCandidate(candidate.id);
    toast.error(`${candidate.name} marked as rejected.`);
  };

  const handleAssignAssessment = () => {
    assignRecruiterAssessment(candidate.id, {
      type: assessmentType,
      assessmentTitle: assessmentTitle.trim(),
      durationMinutes: 60,
      deadline: assessmentDeadline,
    });
    toast.success(`Technical assessment assigned to ${candidate.name}.`);
  };

  const handleScheduleInterview = () => {
    scheduleRecruiterInterview(candidate.id, {
      candidateName: candidate.name,
      candidateId: candidate.id,
      role: candidate.appliedFor,
      date: intvDate,
      time: intvTime,
      mode: intvMode,
      interviewer: interviewerName.trim(),
      notes: intvNotes.trim(),
    });
    toast.success(`Interview scheduled with ${candidate.name} for ${intvDate}.`);
  };

  const handleSubmitFeedback = () => {
    if (!existingInterview) {
      toast.error("Please schedule the interview before recording feedback.");
      return;
    }
    submitInterviewFeedback(existingInterview.id, {
      ratings: {
        technical: techRating,
        problemSolving: problemSolvingRating,
        communication: commRating,
        teamwork: teamworkRating,
        roleFit: roleFitRating,
      },
      strengths: ["Clean component architecture", "High responsiveness empathy"],
      concerns: [],
      notes: feedbackNotes.trim(),
      recommendation: feedbackRecommendation,
      submittedBy: interviewerName,
    });
    toast.success(`Interview feedback recorded for ${candidate.name}.`);
  };

  const handleSendOffer = () => {
    createAndSendOffer(candidate.id, {
      designation: offerDesignation.trim(),
      compensation: offerCompensation.trim(),
      joiningDate: offerJoiningDate.trim(),
      workMode: offerWorkMode,
      location: companyProfile.location,
    });
    toast.success(`🎉 Formal offer extended to ${candidate.name} (${offerCompensation})!`);
  };

  const handleHireDirect = () => {
    hireCandidate(candidate.id);
    toast.success(`🎉 Congratulations! ${candidate.name} has been hired.`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0 border-border bg-card">
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-primary/15 via-primary/5 to-card p-6 border-b border-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <Avatar className="size-16 border-2 border-primary/30 shadow-md shrink-0">
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
                        ? "bg-purple-500/10 text-purple-600 border-purple-500/20 font-bold"
                        : candidate.status === "Offered"
                          ? "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 font-bold"
                          : (candidate.status as string) === "Interview Completed" ||
                              (candidate.status as string) === "Interview Scheduled"
                            ? "bg-blue-500/10 text-blue-600 border-blue-500/20 font-bold"
                            : (candidate.status as string) === "Assessment"
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold"
                              : candidate.status === "Shortlisted"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold"
                                : candidate.status === "Rejected"
                                  ? "bg-rose-500/10 text-rose-600 border-rose-500/20 font-bold"
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
                    <Briefcase className="size-3 text-primary" /> Applied for: {candidate.appliedFor}
                  </span>
                  {candidate.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="size-3" /> {candidate.email}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Match Dial Hero Pill */}
            <div className="flex items-center gap-3 bg-card border border-border p-3 rounded-2xl shrink-0">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-muted-foreground">AI Match Score</div>
                <div className="text-2xl font-bold font-display text-emerald-600">{match}%</div>
              </div>
              <div className="size-10 rounded-full grid place-items-center bg-emerald-500/10 text-emerald-600 font-bold text-sm">
                <Sparkles className="size-5" />
              </div>
            </div>
          </div>
        </div>

        {/* 4-Tab Navigation */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <div className="px-6 border-b border-border bg-card/50">
            <TabsList className="bg-transparent h-12 gap-6 p-0">
              <TabsTrigger
                value="match"
                className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-2 text-xs font-semibold"
              >
                Match Intelligence
              </TabsTrigger>
              <TabsTrigger
                value="passport"
                className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-2 text-xs font-semibold"
              >
                Skill Passport & Diagnostics
              </TabsTrigger>
              <TabsTrigger
                value="portfolio"
                className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-2 text-xs font-semibold"
              >
                Evidence & Portfolio
              </TabsTrigger>
              <TabsTrigger
                value="workflow"
                className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-2 text-xs font-semibold"
              >
                Recruitment Action & Decision
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6 space-y-6">
            {/* Tab 1: Match Intelligence */}
            <TabsContent value="match" className="space-y-6 mt-0">
              {/* 6 Dimension Fit Gauges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { label: "Skill Fit (35%)", val: match > 80 ? 94 : 72 },
                  { label: "Eligibility (15%)", val: 100 },
                  { label: "Career Fit (20%)", val: match > 80 ? 92 : 75 },
                  { label: "Readiness (20%)", val: empScore },
                  { label: "Evidence (5%)", val: candidate.projects && candidate.projects.length > 1 ? 90 : 50 },
                  { label: "Preference (5%)", val: 85 },
                ].map((gauge) => (
                  <div key={gauge.label} className="rounded-xl border border-border/80 bg-card p-3 space-y-1.5">
                    <div className="text-[11px] font-medium text-muted-foreground truncate">{gauge.label}</div>
                    <div className="text-lg font-bold font-display text-foreground">{gauge.val}%</div>
                    <Progress value={gauge.val} className="h-1.5" />
                  </div>
                ))}
              </div>

              {/* Matching Skills vs Missing Prerequisites */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
                  <h4 className="font-semibold text-xs text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5" /> Matching & Demonstrated Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {candidate.skills.map((s) => (
                      <Badge key={s} className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
                  <h4 className="font-semibold text-xs text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="size-3.5" /> Missing Prerequisites / Identified Gaps
                  </h4>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {candidate.gaps && candidate.gaps.length > 0 ? (
                      candidate.gaps.map((g) => (
                        <Badge key={g} variant="outline" className="text-amber-600 border-amber-500/30 text-xs">
                          {g}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">None · Candidate fulfills 100% of prerequisites.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Recruiter Grounded Explanation */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
                <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" /> Why Should You Interview This Candidate?
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>
                    High assessed skill alignment across declared core technologies ({candidate.skills.slice(0, 3).join(", ")}).
                  </li>
                  <li>
                    Career readiness score of <strong>{empScore}/100</strong> places candidate in top campus tier.
                  </li>
                  <li>
                    Portfolio evidence verifies hands-on implementation capabilities with production-grade engineering practices.
                  </li>
                </ul>
              </div>
            </TabsContent>

            {/* Tab 2: Skill Passport & Diagnostics */}
            <TabsContent value="passport" className="space-y-6 mt-0">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-border p-4 space-y-2">
                  <div className="text-xs text-muted-foreground">Technical Mastery</div>
                  <div className="text-2xl font-bold font-display text-primary">{techScore}/100</div>
                  <Progress value={techScore} className="h-1.5" />
                  <p className="text-[11px] text-muted-foreground pt-1">Derived from AcadIn Diagnostic MCQ & Coding engines</p>
                </div>
                <div className="rounded-xl border border-border p-4 space-y-2">
                  <div className="text-xs text-muted-foreground">Communication & Teamwork</div>
                  <div className="text-2xl font-bold font-display text-emerald-600">{softScore}/100</div>
                  <Progress value={softScore} className="h-1.5" />
                  <p className="text-[11px] text-muted-foreground pt-1">Assessed through situational collaboration challenges</p>
                </div>
                <div className="rounded-xl border border-border p-4 space-y-2">
                  <div className="text-xs text-muted-foreground">Overall Career Readiness</div>
                  <div className="text-2xl font-bold font-display text-indigo-600">{empScore}/100</div>
                  <Progress value={empScore} className="h-1.5" />
                  <p className="text-[11px] text-muted-foreground pt-1">Multi-dimensional Stage 3 composite benchmark</p>
                </div>
              </div>

              {/* Skill Verification Ledger */}
              <div className="rounded-xl border border-border p-4 space-y-3">
                <h4 className="font-semibold text-sm text-foreground">Verified Skill Competencies</h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  {candidate.skills.map((s, idx) => (
                    <div key={s} className="flex items-center justify-between p-2.5 rounded-lg border border-border/80 bg-muted/20 text-xs">
                      <span className="font-semibold text-foreground">{s}</span>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                          Score: {85 + ((idx * 3) % 12)}%
                        </Badge>
                        <ShieldCheck className="size-3.5 text-emerald-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Tab 3: Evidence & Portfolio */}
            <TabsContent value="portfolio" className="space-y-6 mt-0">
              {/* Projects */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                  <Layers className="size-4 text-primary" /> Verified Engineering Projects
                </h4>
                {candidate.projects && candidate.projects.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {candidate.projects.map((proj) => (
                      <div key={proj.title} className="rounded-xl border border-border p-4 space-y-2 bg-card">
                        <h5 className="font-semibold text-xs text-foreground">{proj.title}</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed">{proj.description}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {proj.tech.map((t) => (
                            <SkillTag key={t} muted>
                              {t}
                            </SkillTag>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No projects attached.</p>
                )}
              </div>

              {/* Certifications */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                  <Award className="size-4 text-emerald-600" /> Verified Certifications
                </h4>
                {candidate.certifications && candidate.certifications.length > 0 ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {candidate.certifications.map((c) => (
                      <div key={c.title} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20 text-xs">
                        <div>
                          <p className="font-semibold text-foreground">{c.title}</p>
                          <p className="text-[11px] text-muted-foreground">{c.issuer}</p>
                        </div>
                        <Badge variant="outline" className="text-[10px]">{c.year}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No certifications recorded.</p>
                )}
              </div>
            </TabsContent>

            {/* Tab 4: Recruitment Decision Workflow */}
            <TabsContent value="workflow" className="space-y-6 mt-0">
              <div className="grid gap-6 md:grid-cols-2">
                {/* 1. Recruiter Assessment Stage */}
                <div className="rounded-xl border border-border p-4 space-y-3 bg-card">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Code2 className="size-3.5 text-amber-500" /> 1. Recruiter Assessment Stage
                    </h4>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Assessment Format</Label>
                    <select
                      aria-label="Assessment Format"
                      value={assessmentType}
                      onChange={(e) => setAssessmentType(e.target.value as any)}
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs"
                    >
                      <option value="Technical">Technical MCQ & Fundamentals</option>
                      <option value="Skill-Specific">Role-Specific Coding Challenge</option>
                      <option value="Custom">Custom Enterprise Assessment</option>
                    </select>

                    <Label className="text-xs">Assessment Title</Label>
                    <Input
                      value={assessmentTitle}
                      onChange={(e) => setAssessmentTitle(e.target.value)}
                      className="h-9 text-xs"
                    />

                    <Label className="text-xs">Completion Deadline</Label>
                    <Input
                      type="date"
                      value={assessmentDeadline}
                      onChange={(e) => setAssessmentDeadline(e.target.value)}
                      className="h-9 text-xs"
                    />

                    <Button size="sm" className="w-full h-8 text-xs mt-2" onClick={handleAssignAssessment}>
                      Assign Assessment to Candidate
                    </Button>
                  </div>
                </div>

                {/* 2. Schedule Interview Stage */}
                <div className="rounded-xl border border-border p-4 space-y-3 bg-card">
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-blue-500" /> 2. Interview Scheduling
                  </h4>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Date</Label>
                        <Input
                          type="date"
                          value={intvDate}
                          onChange={(e) => setIntvDate(e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Time Slot</Label>
                        <Input
                          value={intvTime}
                          onChange={(e) => setIntvTime(e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Meeting Mode</Label>
                        <select
                          aria-label="Meeting Mode"
                          value={intvMode}
                          onChange={(e) => setIntvMode(e.target.value as any)}
                          className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs"
                        >
                          <option value="Google Meet">Google Meet</option>
                          <option value="Zoom">Zoom Video</option>
                          <option value="On-site">On-site Campus</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-xs">Interviewer Panel</Label>
                        <Input
                          value={interviewerName}
                          onChange={(e) => setInterviewerName(e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>
                    </div>

                    <Button size="sm" className="w-full h-8 text-xs mt-2" onClick={handleScheduleInterview}>
                      Schedule & Notify Candidate
                    </Button>
                  </div>
                </div>

                {/* 3. Post-Interview Structured Feedback */}
                <div className="rounded-xl border border-border p-4 space-y-3 bg-card">
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <MessageSquare className="size-3.5 text-purple-500" /> 3. Post-Interview Feedback
                  </h4>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <Label className="text-[11px]">Technical Skills (1-5)</Label>
                        <Input
                          type="number"
                          min="1"
                          max="5"
                          value={techRating}
                          onChange={(e) => setTechRating(parseInt(e.target.value, 10))}
                          className="h-8 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-[11px]">Problem Solving (1-5)</Label>
                        <Input
                          type="number"
                          min="1"
                          max="5"
                          value={problemSolvingRating}
                          onChange={(e) => setProblemSolvingRating(parseInt(e.target.value, 10))}
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>

                    <Label className="text-xs">Recommendation</Label>
                    <select
                      aria-label="Recommendation"
                      value={feedbackRecommendation}
                      onChange={(e) => setFeedbackRecommendation(e.target.value as any)}
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs"
                    >
                      <option value="Strong Hire">Strong Hire</option>
                      <option value="Hire">Hire</option>
                      <option value="Hold">Hold</option>
                      <option value="No Hire">No Hire</option>
                    </select>

                    <Label className="text-xs">Feedback Notes</Label>
                    <Textarea
                      rows={2}
                      value={feedbackNotes}
                      onChange={(e) => setFeedbackNotes(e.target.value)}
                      className="text-xs"
                    />

                    <Button size="sm" variant="secondary" className="w-full h-8 text-xs mt-2" onClick={handleSubmitFeedback}>
                      Record Evaluation Feedback
                    </Button>
                  </div>
                </div>

                {/* 4. Formal Corporate Offer */}
                <div className="rounded-xl border border-border p-4 space-y-3 bg-card">
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <FileCheck className="size-3.5 text-emerald-500" /> 4. Extend Formal Offer
                  </h4>
                  <div className="space-y-2">
                    <Label className="text-xs">Offered Designation</Label>
                    <Input
                      value={offerDesignation}
                      onChange={(e) => setOfferDesignation(e.target.value)}
                      className="h-9 text-xs"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Compensation / Stipend</Label>
                        <Input
                          value={offerCompensation}
                          onChange={(e) => setOfferCompensation(e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Joining Date</Label>
                        <Input
                          type="date"
                          value={offerJoiningDate}
                          onChange={(e) => setOfferJoiningDate(e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>
                    </div>

                    <Button size="sm" className="w-full h-8 text-xs mt-2 bg-emerald-600 hover:bg-emerald-700 text-white gap-1" onClick={handleSendOffer}>
                      <Send className="size-3" /> Send Formal Offer to Candidate
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Modal Bottom Action Bar */}
        <div className="p-4 bg-muted/20 border-t border-border flex items-center justify-between gap-3">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Close Dossier
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
              onClick={handleReject}
            >
              <UserX className="size-3.5 mr-1" /> Reject
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-emerald-600 hover:bg-emerald-500/10"
              onClick={handleShortlist}
            >
              <UserCheck className="size-3.5 mr-1" /> Shortlist
            </Button>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleHireDirect}>
              <CheckCircle2 className="size-3.5 mr-1" /> Direct Hire
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
