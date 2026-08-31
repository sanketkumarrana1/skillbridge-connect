import { useState, useMemo } from "react";
import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  Plus,
  Sparkles,
  Star,
  User,
  Video,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAppState } from "@/context/app-state";
import { cn } from "@/lib/utils";
import type { MentorshipRequest, MentorshipSession } from "@/types";

export function IndustryMentorship() {
  const {
    companyProfile,
    mentorshipRequests,
    mentorshipSessions,
    updateMentorshipRequestStatus,
    completeMentorshipSession,
  } = useAppState();

  const [activeTab, setActiveTab] = useState<"requests" | "upcoming" | "completed">("requests");

  // Outcome Completion Modal
  const [completingSession, setCompletingSession] = useState<MentorshipSession | null>(null);
  const [outcomeSummary, setOutcomeSummary] = useState("");
  const [topicsDiscussed, setTopicsDiscussed] = useState("");
  const [followUps, setFollowUps] = useState("");
  const [privateNotes, setPrivateNotes] = useState("");

  // Filter requests & sessions for industry mentors
  const industryRequests = useMemo(() => {
    return mentorshipRequests.filter(
      (r) =>
        r.mentorType === "industry" ||
        r.mentorOrganization.toLowerCase().includes(companyProfile.name.toLowerCase()),
    );
  }, [mentorshipRequests, companyProfile]);

  const industryUpcomingSessions = useMemo(() => {
    return mentorshipSessions.filter(
      (s) =>
        (s.mentorType === "industry" ||
          s.mentorOrganization.toLowerCase().includes(companyProfile.name.toLowerCase())) &&
        s.status === "Scheduled",
    );
  }, [mentorshipSessions, companyProfile]);

  const industryCompletedSessions = useMemo(() => {
    return mentorshipSessions.filter(
      (s) =>
        (s.mentorType === "industry" ||
          s.mentorOrganization.toLowerCase().includes(companyProfile.name.toLowerCase())) &&
        s.status === "Completed",
    );
  }, [mentorshipSessions, companyProfile]);

  const handleOpenComplete = (session: MentorshipSession) => {
    setCompletingSession(session);
    setOutcomeSummary(
      "Student demonstrated strong technical fundamentals and architectural clarity.",
    );
    setTopicsDiscussed(
      "Production React state management, API latency profiling, GitHub project structure",
    );
    setFollowUps(
      "Build unit tests with Vitest, explore database indexing, apply for Summer 2027 internship cohort",
    );
    setPrivateNotes("High potential student from NITK. Fast track for interview rounds.");
  };

  const handleSaveOutcome = () => {
    if (!completingSession || !outcomeSummary.trim()) {
      toast.error("Please provide an outcome summary.");
      return;
    }

    const topics = topicsDiscussed
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const recs = followUps
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);

    completeMentorshipSession(
      completingSession.id,
      {
        summary: outcomeSummary.trim(),
        topicsDiscussed: topics.length > 0 ? topics : ["Technical review"],
        followUpRecommendations: recs.length > 0 ? recs : ["Continue project work"],
      },
      privateNotes.trim() || undefined,
    );

    toast.success(`Outcomes recorded for session with ${completingSession.studentName}!`);
    setCompletingSession(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <Badge variant="outline" className="border-blue-500/30 text-blue-400 text-xs mb-1.5">
            <Sparkles className="size-3 mr-1" /> Industry Mentorship Hub
          </Badge>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Student Guidance & Mentorship
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review student mentorship requests, host 1-on-1 career discussions, and identify top
            talent before official recruitment cycles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-border bg-card px-3.5 py-2 text-center">
            <p className="text-xs text-muted-foreground font-medium">Pending Requests</p>
            <p className="text-xl font-bold text-amber-500">
              {industryRequests.filter((r) => r.status === "Requested").length}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card px-3.5 py-2 text-center">
            <p className="text-xs text-muted-foreground font-medium">Scheduled</p>
            <p className="text-xl font-bold text-primary">{industryUpcomingSessions.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid grid-cols-3 max-w-md">
          <TabsTrigger value="requests" className="text-xs">
            Requests ({industryRequests.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="text-xs">
            Upcoming ({industryUpcomingSessions.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs">
            Completed ({industryCompletedSessions.length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* 1. REQUESTS TAB */}
      {activeTab === "requests" && (
        <div className="space-y-4">
          {industryRequests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <Calendar className="size-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-semibold text-foreground">No Pending Requests</p>
              <p className="text-xs text-muted-foreground mt-1">
                Student mentorship bookings will appear here when submitted.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {industryRequests.map((req) => (
                <Card key={req.id} className="p-5 space-y-3.5 border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display font-bold text-base text-foreground">
                        {req.studentName}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Targeting {req.mentorName} ({req.mentorOrganization})
                      </p>
                    </div>
                    <Badge
                      className={cn(
                        "text-[10px] uppercase font-semibold",
                        req.status === "Requested" && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                        req.status === "Accepted" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                        req.status === "Declined" && "bg-destructive/10 text-destructive border-destructive/20",
                      )}
                    >
                      {req.status}
                    </Badge>
                  </div>

                  <div className="rounded-xl border border-border bg-muted/40 p-3 text-xs space-y-1">
                    <p className="font-semibold text-foreground">Purpose:</p>
                    <p className="text-muted-foreground">{req.purpose}</p>
                    <p className="text-[11px] text-muted-foreground pt-1 flex items-center gap-1">
                      <Clock className="size-3 text-primary" /> Requested Date: {req.preferredDate} ({req.preferredTime})
                    </p>
                  </div>

                  {req.status === "Requested" && (
                    <div className="flex items-center gap-2 pt-2 border-t border-border">
                      <Button
                        size="sm"
                        className="w-full h-8 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                        onClick={() => {
                          updateMentorshipRequestStatus(req.id, "Accepted");
                          toast.success(`Accepted mentorship request from ${req.studentName}`);
                        }}
                      >
                        <Check className="size-3.5 mr-1" /> Accept & Schedule
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-8 text-xs text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          updateMentorshipRequestStatus(req.id, "Declined", "Schedule conflict");
                          toast.info(`Declined mentorship request from ${req.studentName}`);
                        }}
                      >
                        <X className="size-3.5 mr-1" /> Decline
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. UPCOMING SESSIONS TAB */}
      {activeTab === "upcoming" && (
        <div className="space-y-4">
          {industryUpcomingSessions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <Calendar className="size-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-semibold text-foreground">No Upcoming Sessions</p>
              <p className="text-xs text-muted-foreground mt-1">
                Accepted mentorship sessions will appear here with active meeting links.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {industryUpcomingSessions.map((session) => (
                <Card key={session.id} className="p-5 space-y-4 border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-semibold">
                        <CheckCircle2 className="size-2.5 mr-1" /> Scheduled Meeting
                      </Badge>
                      <h3 className="mt-2 font-display font-bold text-lg text-foreground">
                        {session.studentName}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Mentor: {session.mentorName} · {session.date} ({session.startTime} - {session.endTime})
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-muted/40 p-3 text-xs">
                    <p className="font-semibold text-foreground">Session Focus:</p>
                    <p className="text-muted-foreground mt-0.5">{session.purpose}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    {session.meetingLink && (
                      <Button size="sm" asChild className="h-8 text-xs font-semibold">
                        <a href={session.meetingLink} target="_blank" rel="noreferrer">
                          <Video className="size-3.5 mr-1.5" /> Start Meeting
                        </a>
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs border-primary text-primary hover:bg-primary/10 font-semibold"
                      onClick={() => handleOpenComplete(session)}
                    >
                      <CheckCircle2 className="size-3.5 mr-1.5" /> Mark Completed & Log Outcomes
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. COMPLETED TAB */}
      {activeTab === "completed" && (
        <div className="space-y-4">
          {industryCompletedSessions.map((session) => (
            <Card key={session.id} className="p-5 space-y-3.5 border-border">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-foreground">
                    {session.studentName}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Completed on {session.date} · Mentor: {session.mentorName}
                  </p>
                </div>

                {session.studentFeedback && (
                  <div className="flex items-center gap-1 font-bold text-amber-500 text-xs">
                    <Star className="size-3.5 fill-amber-500" />
                    <span>{session.studentFeedback.rating} / 5</span>
                    <span className="text-muted-foreground font-normal">
                      ({session.studentFeedback.helpfulness})
                    </span>
                  </div>
                )}
              </div>

              {session.outcome && (
                <div className="rounded-xl border border-border bg-muted/30 p-3.5 text-xs space-y-2">
                  <p className="font-semibold text-foreground">Summary & Recommendations:</p>
                  <p className="text-muted-foreground">{session.outcome.summary}</p>
                  {session.mentorPrivateNotes && (
                    <p className="text-[11px] text-primary italic pt-1 border-t border-border/50">
                      Private Recruiter Note: "{session.mentorPrivateNotes}"
                    </p>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* OUTCOME MODAL */}
      <Dialog open={!!completingSession} onOpenChange={(open) => !open && setCompletingSession(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold flex items-center gap-2">
              <CheckCircle2 className="size-5 text-primary" />
              Record Mentorship Outcomes for {completingSession?.studentName}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Document key discussion points, student capabilities, and actionable next steps.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Executive Summary *</Label>
              <Textarea
                value={outcomeSummary}
                onChange={(e) => setOutcomeSummary(e.target.value)}
                placeholder="Summarize the candidate's performance, strengths, and areas of promise..."
                rows={2}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Topics Discussed (comma-separated)</Label>
              <Input
                value={topicsDiscussed}
                onChange={(e) => setTopicsDiscussed(e.target.value)}
                placeholder="e.g. Distributed Caching, React Fiber, System Design"
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Follow-Up Recommendations (comma-separated)</Label>
              <Input
                value={followUps}
                onChange={(e) => setFollowUps(e.target.value)}
                placeholder="e.g. Add unit test coverage, Benchmark p99 query latency"
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Private Recruiter Notes (Confidential)</Label>
              <Textarea
                value={privateNotes}
                onChange={(e) => setPrivateNotes(e.target.value)}
                placeholder="Confidential notes for your hiring team (never shown to student or college)..."
                rows={2}
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter className="pt-2 border-t border-border">
            <Button variant="outline" size="sm" onClick={() => setCompletingSession(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveOutcome} className="font-semibold">
              Save & Complete Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

