import { useMemo, useState } from "react";
import {
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  Eye,
  FileCheck,
  FileText,
  Filter,
  GraduationCap,
  Mail,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Plus,
  Radio,
  Search,
  Sparkles,
  Star,
  Trash2,
  UserCheck,
  UserRound,
  UserX,
  Users,
  Video,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CandidateDetailsModal } from "@/components/skillbridge/industry-candidate-modal";
import { SectionCard, Stat, WorkspaceHeader } from "@/components/skillbridge/student-ui";
import { useAppState } from "@/context/app-state";
import type { Candidate, InterviewSchedule, PipelineStage } from "@/types";

const STAGES: { id: PipelineStage; label: string; color: string }[] = [
  { id: "Applied", label: "Applied", color: "bg-slate-500/10 text-slate-700 border-slate-300" },
  {
    id: "Shortlisted",
    label: "Shortlisted",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  },
  {
    id: "Interview Scheduled",
    label: "Interview Scheduled",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  },
  {
    id: "Interview Completed",
    label: "Interview Completed",
    color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/30",
  },
  {
    id: "Offered",
    label: "Offer Released",
    color: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  },
  {
    id: "Hired",
    label: "Hired / Accepted",
    color: "bg-purple-500/10 text-purple-600 border-purple-500/30",
  },
  {
    id: "Rejected",
    label: "Archived / Rejected",
    color: "bg-rose-500/10 text-rose-600 border-rose-500/30",
  },
];

export function IndustryInterviews() {
  const {
    interviews,
    scheduleRecruiterInterview,
    submitInterviewFeedback,
    createAndSendOffer,
    corporateOffers,
    candidates,
    industryApps,
    setCandidateApplicationStatus,
    recruiterKPIs,
  } = useAppState();

  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");

  // Dossier Modal State
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [dossierOpen, setDossierOpen] = useState(false);

  // Quick Schedule Modal State
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [candIdToSchedule, setCandIdToSchedule] = useState("");
  const [intvDate, setIntvDate] = useState("2026-09-02");
  const [intvTime, setIntvTime] = useState("02:00 PM - 03:00 PM");
  const [intvInterviewer, setIntvInterviewer] = useState("Technical Hiring Panel");

  // Quick Feedback Modal State
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [activeInterviewId, setActiveInterviewId] = useState("");
  const [fbNotes, setFbNotes] = useState("Excellent problem solving and clear articulation.");
  const [fbRec, setFbRec] = useState<"Strong Hire" | "Hire" | "Hold" | "No Hire">("Strong Hire");

  // Filtered Interviews List
  const filteredInterviews = useMemo(() => {
    return interviews.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStage = stageFilter === "all" || item.stage === stageFilter;
      return matchesSearch && matchesStage;
    });
  }, [interviews, searchQuery, stageFilter]);

  const handleScheduleSubmit = () => {
    if (!candIdToSchedule) return;
    const cand = candidates.find((c) => c.id === candIdToSchedule);
    scheduleRecruiterInterview(candIdToSchedule, {
      candidateName: cand?.name || "Candidate",
      candidateId: candIdToSchedule,
      role: cand?.appliedFor || "Engineering Opportunity",
      date: intvDate,
      time: intvTime,
      mode: "Google Meet",
      interviewer: intvInterviewer,
      notes: "Technical architecture and live coding session.",
    });
    toast.success(`Interview scheduled with ${cand?.name || "Candidate"}.`);
    setScheduleModalOpen(false);
  };

  const handleFeedbackSubmit = () => {
    if (!activeInterviewId) return;
    submitInterviewFeedback(activeInterviewId, {
      ratings: { technical: 5, problemSolving: 4, communication: 5, teamwork: 4, roleFit: 5 },
      strengths: ["Strong architectural foundations"],
      concerns: [],
      notes: fbNotes,
      recommendation: fbRec,
      submittedBy: "Senior Panel",
    });
    toast.success("Interview feedback recorded successfully.");
    setFeedbackModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        eyebrow="Industry Portal"
        title="Interviews & Offer Management"
        description="Schedule candidate evaluations, submit structured panel scorecards, and extend formal corporate offers."
        action={
          <Button size="sm" className="gap-1.5" onClick={() => setScheduleModalOpen(true)}>
            <Plus className="size-3.5" /> Schedule Interview
          </Button>
        }
      />

      {/* 4 Pipeline Stat Gauges */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Interviews Scheduled"
          value={recruiterKPIs.interviewsCount.toString()}
          trend="Upcoming sessions"
          icon={Calendar}
        />
        <Stat
          label="Feedback Recorded"
          value={interviews.filter((i) => i.stage === "Interview Completed" || i.score).length.toString()}
          trend="Panel evaluations"
          icon={MessageSquare}
        />
        <Stat
          label="Formal Offers"
          value={corporateOffers.length.toString()}
          trend={`${corporateOffers.filter((o) => o.status === "Accepted").length} Accepted`}
          icon={FileCheck}
        />
        <Stat
          label="Hired Candidates"
          value={recruiterKPIs.hiresCount.toString()}
          trend={`${recruiterKPIs.hiringConversion}% Final Conversion`}
          icon={CheckCircle2}
        />
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-border/80 bg-card p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search scheduled interviews by candidate name or position..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <select
            aria-label="Filter Stage"
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-xs sm:w-52"
          >
            <option value="all">All Pipeline Stages</option>
            {STAGES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Scheduled Interviews List */}
      <SectionCard
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="size-5 text-primary" />
              <h3 className="font-display text-base font-semibold">
                Scheduled Interviews & Feedback Panel ({filteredInterviews.length})
              </h3>
            </div>
          </div>
        }
      >
        <div className="divide-y divide-border pt-1">
          {filteredInterviews.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">No scheduled interviews found.</p>
          ) : (
            filteredInterviews.map((item) => {
              const matchedCand = candidates.find(
                (c) =>
                  c.id === item.candidateId ||
                  c.name.toLowerCase() === item.candidateName.toLowerCase(),
              );

              return (
                <div
                  key={item.id}
                  className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="size-10 border border-border shrink-0">
                      {matchedCand?.avatar ? <AvatarImage src={matchedCand.avatar} /> : null}
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                        {item.candidateName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold text-sm text-foreground">{item.candidateName}</h4>
                        <Badge
                          variant="outline"
                          className={
                            item.stage === "Hired"
                              ? "bg-purple-500/10 text-purple-600 border-purple-500/20 text-[10px]"
                              : item.stage === "Offered"
                                ? "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]"
                                : item.stage === "Interview Completed"
                                  ? "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 text-[10px]"
                                  : "bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]"
                          }
                        >
                          {item.stage}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        {item.role} • Match: <span className="text-emerald-600 font-bold">{item.match}%</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3 text-primary" /> {item.date || "Scheduled"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3 text-primary" /> {item.time || "11:00 AM"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Video className="size-3 text-emerald-600" /> {item.mode || "Google Meet"}
                        </span>
                      </div>

                      {item.feedback && (
                        <p className="text-xs text-foreground bg-muted/40 p-2 rounded-md mt-1 italic border border-border">
                          "{item.feedback}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs"
                      onClick={() => {
                        if (matchedCand) {
                          setSelectedCandidate(matchedCand);
                          setDossierOpen(true);
                        }
                      }}
                    >
                      Dossier
                    </Button>

                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 text-xs gap-1"
                      onClick={() => {
                        setActiveInterviewId(item.id);
                        setFeedbackModalOpen(true);
                      }}
                    >
                      <MessageSquare className="size-3" /> Record Feedback
                    </Button>

                    <Button
                      size="sm"
                      className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                      onClick={() => {
                        if (matchedCand) {
                          createAndSendOffer(matchedCand.id, {
                            designation: item.role,
                            compensation: "₹45,000 / mo",
                            joiningDate: "2026-10-01",
                          });
                          toast.success(`Formal offer sent to ${item.candidateName}`);
                        }
                      }}
                    >
                      <Send className="size-3" /> Send Offer
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </SectionCard>

      {/* Corporate Offers Ledger */}
      <SectionCard
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="size-5 text-emerald-600" />
              <h3 className="font-display text-base font-semibold">Extended Corporate Offers ({corporateOffers.length})</h3>
            </div>
          </div>
        }
      >
        <div className="divide-y divide-border pt-1">
          {corporateOffers.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">No offers generated yet.</p>
          ) : (
            corporateOffers.map((offer) => (
              <div key={offer.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground">{offer.candidateName}</span>
                    <Badge
                      className={`text-[10px] ${
                        offer.status === "Accepted"
                          ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                          : offer.status === "Sent"
                            ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      Offer {offer.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    {offer.designation} • {offer.compensation} • Joining: {offer.joiningDate}
                  </p>
                </div>
                <div className="text-muted-foreground text-right">
                  <span>Sent: {offer.sentAt || "Recent"}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </SectionCard>

      {/* Quick Schedule Modal */}
      <Dialog open={scheduleModalOpen} onOpenChange={setScheduleModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Candidate Interview</DialogTitle>
            <DialogDescription>Set up a panel session with meeting details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="grid gap-1">
              <Label className="text-xs">Select Candidate</Label>
              <select
                aria-label="Select Candidate"
                value={candIdToSchedule}
                onChange={(e) => setCandIdToSchedule(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs"
              >
                <option value="">Select a candidate...</option>
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.appliedFor} · {c.match}% Match)
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1">
                <Label className="text-xs">Date</Label>
                <Input
                  type="date"
                  value={intvDate}
                  onChange={(e) => setIntvDate(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs">Time</Label>
                <Input
                  value={intvTime}
                  onChange={(e) => setIntvTime(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>
            <div className="grid gap-1">
              <Label className="text-xs">Interviewer / Panel Name</Label>
              <Input
                value={intvInterviewer}
                onChange={(e) => setIntvInterviewer(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleSubmit}>Confirm & Notify</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Feedback Modal */}
      <Dialog open={feedbackModalOpen} onOpenChange={setFeedbackModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record Panel Feedback</DialogTitle>
            <DialogDescription>Submit evaluation comments and hiring recommendation.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="grid gap-1">
              <Label className="text-xs">Recommendation</Label>
              <select
                aria-label="Recommendation"
                value={fbRec}
                onChange={(e) => setFbRec(e.target.value as any)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs"
              >
                <option value="Strong Hire">Strong Hire</option>
                <option value="Hire">Hire</option>
                <option value="Hold">Hold</option>
                <option value="No Hire">No Hire</option>
              </select>
            </div>
            <div className="grid gap-1">
              <Label className="text-xs">Panel Notes & Strengths</Label>
              <Textarea
                rows={3}
                value={fbNotes}
                onChange={(e) => setFbNotes(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleFeedbackSubmit}>Save Evaluation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
