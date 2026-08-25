import { useMemo, useState } from "react";
import {
  Award,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  MapPin,
  Plus,
  Search,
  Sparkles,
  UserCheck,
  UserX,
  Users,
  Video,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
import { SectionCard, Stat, WorkspaceHeader } from "@/components/skillbridge/student-ui";
import { useAppState } from "@/context/app-state";
import type { GuestLectureSession } from "@/types";

export function AcademicianLectures() {
  const { guestLectures, respondGuestLecture, scheduleGuestLecture } = useAppState();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Schedule Modal
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [host, setHost] = useState("");
  const [dept, setDept] = useState("Computer Science & Engineering");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("11:00 AM - 01:00 PM IST");
  const [mode, setMode] = useState<"Virtual (Google Meet)" | "Virtual (Zoom)" | "In-Person">(
    "Virtual (Google Meet)",
  );
  const [honorarium, setHonorarium] = useState("₹10,000");
  const [attendees, setAttendees] = useState("120");
  const [notes, setNotes] = useState("");

  const handleRespond = (id: string, action: "Accepted" | "Declined") => {
    respondGuestLecture(id, action);
    if (action === "Accepted") {
      toast.success("🎉 Guest lecture invitation accepted!");
    } else {
      toast.success("Invitation declined.");
    }
  };

  const handleScheduleNew = () => {
    if (!topic.trim() || !host.trim()) {
      toast.error("Please fill in topic and host institution.");
      return;
    }

    scheduleGuestLecture({
      id: `lec-${Date.now()}`,
      topic: topic.trim(),
      hostInstitutionOrOrg: host.trim(),
      department: dept.trim(),
      date: date.trim() || "15 Oct 2026",
      time: time.trim() || "11:00 AM - 01:00 PM IST",
      mode,
      honorarium: honorarium.trim() || "₹10,000",
      status: "Accepted",
      notes: notes.trim() || "Interactive keynote and hands-on case study review.",
      attendeesExpected: parseInt(attendees, 10) || 100,
      meetingLink: mode.includes("Virtual") ? "https://meet.google.com/sb-new-lec" : undefined,
    });

    setScheduleOpen(false);
    setTopic("");
    setHost("");
    setNotes("");
    toast.success("📅 Keynote lecture scheduled successfully!");
  };

  const filtered = useMemo(() => {
    return guestLectures.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hostInstitutionOrOrg.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [guestLectures, searchQuery, statusFilter]);

  const pendingCount = guestLectures.filter((l) => l.status === "Invitation Received").length;
  const acceptedCount = guestLectures.filter((l) => l.status === "Accepted").length;
  const completedCount = guestLectures.filter((l) => l.status === "Completed").length;

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        eyebrow="Keynote & Academic Outreach"
        title="Guest Lectures & Masterclasses"
        description="Deliver industry-aligned expert sessions, keynote talks, and inter-university seminars."
        action={
          <Button onClick={() => setScheduleOpen(true)} className="gap-2">
            <Plus className="size-4" /> Schedule New Session
          </Button>
        }
      />

      {/* KPI Ribbon */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Total Invitations"
          value={guestLectures.length.toString()}
          trend="Inter-campus outreach"
          icon={GraduationCap}
        />
        <Stat
          label="Pending Invites"
          value={pendingCount.toString()}
          trend="Action required"
          icon={Clock}
        />
        <Stat
          label="Upcoming Sessions"
          value={acceptedCount.toString()}
          trend="Confirmed calendar"
          icon={Calendar}
        />
        <Stat
          label="Delivered Lectures"
          value={completedCount.toString()}
          trend="Archived recordings"
          icon={CheckCircle2}
        />
      </div>

      {/* Main Directory */}
      <SectionCard
        title={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold">
              Guest Lecture Engagements ({filtered.length})
            </h2>

            <div className="flex items-center gap-2">
              <div className="relative w-48 sm:w-60">
                <Search className="absolute left-2.5 top-2 size-3.5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search lecture, campus..."
                  className="pl-8 h-8 text-xs"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8 rounded-md border border-input bg-transparent px-2 text-xs shadow-xs"
              >
                <option value="all">All Statuses</option>
                <option value="Invitation Received">Pending ({pendingCount})</option>
                <option value="Accepted">Accepted ({acceptedCount})</option>
                <option value="Completed">Completed ({completedCount})</option>
                <option value="Declined">Declined</option>
              </select>
            </div>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-2 pt-2">
          {filtered.length === 0 ? (
            <div className="col-span-full py-12 text-center text-xs text-muted-foreground">
              No guest lecture engagements match your filter.
            </div>
          ) : (
            filtered.map((lec) => {
              const isPending = lec.status === "Invitation Received";
              const isAccepted = lec.status === "Accepted";
              const isCompleted = lec.status === "Completed";

              return (
                <Card
                  key={lec.id}
                  className="flex flex-col justify-between border border-border bg-card transition hover:border-primary/40 hover:shadow-md"
                >
                  <CardContent className="p-5 space-y-3.5 flex flex-col justify-between h-full">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <Badge
                          variant="outline"
                          className={
                            isAccepted
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]"
                              : isCompleted
                                ? "bg-purple-500/10 text-purple-600 border-purple-500/20 text-[10px]"
                                : isPending
                                  ? "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]"
                                  : "text-muted-foreground text-[10px]"
                          }
                        >
                          {lec.status}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px]">
                          {lec.mode}
                        </Badge>
                      </div>

                      <h3 className="font-display text-base font-bold text-foreground line-clamp-2 leading-snug">
                        {lec.topic}
                      </h3>

                      <p className="text-xs font-semibold text-primary">
                        {lec.hostInstitutionOrOrg}
                      </p>
                      <p className="text-xs text-muted-foreground">{lec.department}</p>

                      {lec.notes && (
                        <p className="text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-border line-clamp-2 leading-relaxed">
                          {lec.notes}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3 text-primary" /> {lec.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3 text-primary" /> {lec.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="size-3 text-emerald-600" /> ~
                          {lec.attendeesExpected ?? 100} Attendees
                        </span>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-border flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-semibold text-muted-foreground">
                          Honorarium
                        </p>
                        <p className="text-xs font-bold text-emerald-600">
                          {lec.honorarium || "Complimentary"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isPending ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs text-destructive hover:bg-destructive/10"
                              onClick={() => handleRespond(lec.id, "Declined")}
                            >
                              Decline
                            </Button>
                            <Button
                              size="sm"
                              className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                              onClick={() => handleRespond(lec.id, "Accepted")}
                            >
                              Accept Invitation
                            </Button>
                          </>
                        ) : isAccepted ? (
                          lec.meetingLink ? (
                            <Button
                              size="sm"
                              className="h-8 text-xs gap-1.5"
                              onClick={() => {
                                window.open(lec.meetingLink, "_blank");
                                toast.success("Opening video session...");
                              }}
                            >
                              <Video className="size-3.5" /> Join Session
                            </Button>
                          ) : (
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs py-1 px-2">
                              <CheckCircle2 className="size-3 mr-1" /> Confirmed In-Person
                            </Badge>
                          )
                        ) : isCompleted ? (
                          <Badge variant="outline" className="text-xs py-1 px-2">
                            Session Delivered
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            Declined
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </SectionCard>

      {/* Schedule New Session Modal */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Guest Lecture Session</DialogTitle>
            <DialogDescription>
              Create and confirm a keynote or technical masterclass.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid gap-2">
              <Label>Lecture Topic / Title *</Label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Distributed Event-Driven Architectures"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Host Institution *</Label>
                <Input
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="e.g. NIT Surathkal"
                />
              </div>
              <div className="grid gap-2">
                <Label>Department</Label>
                <Input
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  placeholder="CSE / ECE"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Date</Label>
                <Input
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="e.g. 28 Sep 2026"
                />
              </div>
              <div className="grid gap-2">
                <Label>Time</Label>
                <Input
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 02:00 PM IST"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Delivery Mode</Label>
                <select
                  value={mode}
                  onChange={(e) =>
                    setMode(
                      e.target.value as "Virtual (Google Meet)" | "Virtual (Zoom)" | "In-Person",
                    )
                  }
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                >
                  <option value="Virtual (Google Meet)">Virtual (Google Meet)</option>
                  <option value="Virtual (Zoom)">Virtual (Zoom)</option>
                  <option value="In-Person">In-Person</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Honorarium</Label>
                <Input
                  value={honorarium}
                  onChange={(e) => setHonorarium(e.target.value)}
                  placeholder="₹10,000"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Session Notes & Target Audience</Label>
              <Textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Audience background, prerequisite knowledge, and live coding demos..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleNew} className="gap-1.5">
              <Sparkles className="size-4" /> Confirm & Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
