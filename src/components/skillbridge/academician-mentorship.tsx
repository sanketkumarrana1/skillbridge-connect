import { useMemo, useState } from "react";
import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Edit2,
  ExternalLink,
  GraduationCap,
  MessageSquare,
  Plus,
  Search,
  Sparkles,
  UserCheck,
  Users,
  Video,
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionCard, Stat, WorkspaceHeader } from "@/components/skillbridge/student-ui";
import { useAppState } from "@/context/app-state";
import type { StudentMentorship } from "@/types";

export function AcademicianMentorship() {
  const {
    studentMentorships,
    scheduleMentorshipMeeting,
    addMentorshipNote,
    recordMentorshipSession,
  } = useAppState();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMentee, setSelectedMentee] = useState<StudentMentorship | null>(null);

  // Add Note Modal
  const [noteModal, setNoteModal] = useState<StudentMentorship | null>(null);
  const [newNote, setNewNote] = useState("");

  // Schedule Session Modal
  const [scheduleModal, setScheduleModal] = useState<StudentMentorship | null>(null);
  const [meetDate, setMeetDate] = useState("28 Sep 2026");
  const [meetMode, setMeetMode] = useState("Google Meet");

  // Record Past Session Modal
  const [recordModal, setRecordModal] = useState<StudentMentorship | null>(null);
  const [recSummary, setRecSummary] = useState("");
  const [recActionItems, setRecActionItems] = useState("");

  const handleAddNote = () => {
    if (!noteModal || !newNote.trim()) return;
    addMentorshipNote(noteModal.id, newNote);
    if (selectedMentee && selectedMentee.id === noteModal.id) {
      setSelectedMentee((prev) =>
        prev ? { ...prev, notes: [newNote.trim(), ...prev.notes] } : null,
      );
    }
    setNoteModal(null);
    setNewNote("");
    toast.success("📝 Mentor feedback note recorded.");
  };

  const handleConfirmSchedule = () => {
    if (!scheduleModal || !meetDate.trim()) return;
    scheduleMentorshipMeeting(scheduleModal.id, meetDate.trim(), meetMode);
    if (selectedMentee && selectedMentee.id === scheduleModal.id) {
      setSelectedMentee((prev) =>
        prev ? { ...prev, nextMeetingDate: meetDate.trim(), meetingMode: meetMode } : null,
      );
    }
    setScheduleModal(null);
    toast.success(`📅 Mentorship session booked with ${scheduleModal.studentName} for ${meetDate}`);
  };

  const handleConfirmRecord = () => {
    if (!recordModal || !recSummary.trim()) return;
    const sessionData = {
      date: "Today",
      summary: recSummary.trim(),
      actionItems: recActionItems.trim() || "Review milestone checklist by next week.",
    };
    recordMentorshipSession(recordModal.id, sessionData);
    if (selectedMentee && selectedMentee.id === recordModal.id) {
      setSelectedMentee((prev) =>
        prev
          ? {
              ...prev,
              lastMeetingDate: "Today",
              meetingHistory: [sessionData, ...prev.meetingHistory],
            }
          : null,
      );
    }
    setRecordModal(null);
    setRecSummary("");
    setRecActionItems("");
    toast.success("✅ Meeting notes & action items logged.");
  };

  const filtered = useMemo(() => {
    return studentMentorships.filter((item) => {
      return (
        searchQuery.trim() === "" ||
        item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.goal.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [studentMentorships, searchQuery]);

  const activeMenteesCount = studentMentorships.filter((m) => m.status === "Active").length;
  const totalMeetingsLogged = studentMentorships.reduce(
    (acc, m) => acc + (m.meetingHistory ? m.meetingHistory.length : 0),
    0,
  );

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        eyebrow="Student Development & Career Guidance"
        title="Student Mentorship Roster"
        description="Provide 1-on-1 career navigation, technical code reviews, and industry placement guidance to undergraduate and graduate mentees."
      />

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Total Mentees"
          value={studentMentorships.length.toString()}
          trend="Assigned cohort"
          icon={Users}
        />
        <Stat
          label="Active Mentees"
          value={activeMenteesCount.toString()}
          trend="Ongoing sprints"
          icon={UserCheck}
        />
        <Stat
          label="Meetings Logged"
          value={totalMeetingsLogged.toString()}
          trend="Recorded sessions"
          icon={Calendar}
        />
        <Stat label="Avg Mentee Rating" value="4.9 / 5.0" trend="Student feedback" icon={Award} />
      </div>

      {/* Main Mentee Directory */}
      <SectionCard
        title={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold">
              Assigned Student Mentees ({filtered.length})
            </h2>
            <div className="relative w-48 sm:w-64">
              <Search className="absolute left-2.5 top-2 size-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mentee name, branch..."
                className="pl-8 h-8 text-xs"
              />
            </div>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-2">
          {filtered.map((mentee) => {
            return (
              <Card
                key={mentee.id}
                className="flex flex-col justify-between border border-border bg-card transition hover:border-primary/40 hover:shadow-md"
              >
                <CardContent className="p-5 space-y-4 flex flex-col justify-between h-full">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="size-12 border border-border shrink-0">
                        {mentee.studentAvatar ? <AvatarImage src={mentee.studentAvatar} /> : null}
                        <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
                          {mentee.studentName.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="space-y-0.5">
                        <h3 className="font-display text-sm font-bold text-foreground line-clamp-1">
                          {mentee.studentName}
                        </h3>
                        <p className="text-xs text-muted-foreground">{mentee.branch}</p>
                        <Badge variant="secondary" className="text-[10px]">
                          {mentee.year}
                        </Badge>
                      </div>
                    </div>

                    <div className="rounded-xl bg-muted/30 p-2.5 border border-border text-xs space-y-1">
                      <p className="font-semibold text-primary text-[10px] uppercase">
                        Career Target
                      </p>
                      <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                        {mentee.goal}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-[11px] text-muted-foreground pt-1">
                      <span>Last: {mentee.lastMeetingDate}</span>
                      {mentee.nextMeetingDate ? (
                        <span className="text-emerald-600 font-semibold">
                          Next: {mentee.nextMeetingDate}
                        </span>
                      ) : (
                        <span>No upcoming session</span>
                      )}
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs"
                      onClick={() => setSelectedMentee(mentee)}
                    >
                      Mentorship Log
                    </Button>

                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-xs px-2"
                        onClick={() => {
                          setNoteModal(mentee);
                          setNewNote("");
                        }}
                      >
                        <Edit2 className="size-3 mr-1" /> Note
                      </Button>

                      <Button
                        size="sm"
                        className="h-8 text-xs gap-1"
                        onClick={() => {
                          setScheduleModal(mentee);
                          setMeetDate("28 Sep 2026");
                          setMeetMode("Google Meet");
                        }}
                      >
                        <Calendar className="size-3" /> Meet
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </SectionCard>

      {/* Mentee Full Dossier & History Modal */}
      <Dialog open={!!selectedMentee} onOpenChange={(open) => !open && setSelectedMentee(null)}>
        {selectedMentee && (
          <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <Avatar className="size-12 border border-border">
                  {selectedMentee.studentAvatar ? (
                    <AvatarImage src={selectedMentee.studentAvatar} />
                  ) : null}
                  <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
                    {selectedMentee.studentName.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-lg font-bold font-display text-foreground">
                    {selectedMentee.studentName}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    {selectedMentee.branch} • {selectedMentee.year}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-5 py-2">
              <div className="p-3 bg-muted/30 rounded-xl border border-border text-xs space-y-1">
                <p className="font-semibold text-primary uppercase text-[10px]">
                  Mentee Career Aspiration
                </p>
                <p className="text-muted-foreground leading-relaxed">{selectedMentee.goal}</p>
              </div>

              {/* Mentor Notes Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                    Mentor Observations & Feedback Notes
                  </h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-[10px] text-primary"
                    onClick={() => {
                      setNoteModal(selectedMentee);
                      setNewNote("");
                    }}
                  >
                    <Plus className="size-3 mr-1" /> Add Note
                  </Button>
                </div>

                <div className="space-y-2">
                  {selectedMentee.notes.map((note, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-border bg-card text-xs text-muted-foreground"
                    >
                      {note}
                    </div>
                  ))}
                </div>
              </div>

              {/* Meeting History Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                    Past Meeting Logs ({selectedMentee.meetingHistory.length})
                  </h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-[10px] text-primary"
                    onClick={() => {
                      setRecordModal(selectedMentee);
                      setRecSummary("");
                      setRecActionItems("");
                    }}
                  >
                    <Plus className="size-3 mr-1" /> Log Meeting
                  </Button>
                </div>

                <div className="space-y-2.5">
                  {selectedMentee.meetingHistory.map((hist, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-border bg-muted/20 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between font-semibold text-foreground">
                        <span>Session on {hist.date}</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{hist.summary}</p>
                      <div className="p-2 rounded-md bg-card border border-border/80 text-[11px] text-primary">
                        <strong>Action Items: </strong> {hist.actionItems}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="border-t border-border pt-3">
              <Button variant="outline" onClick={() => setSelectedMentee(null)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  setScheduleModal(selectedMentee);
                  setMeetDate("28 Sep 2026");
                  setMeetMode("Google Meet");
                }}
                className="gap-1.5"
              >
                <Calendar className="size-4" /> Book Next Meeting
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Add Note Modal */}
      <Dialog open={!!noteModal} onOpenChange={(open) => !open && setNoteModal(null)}>
        {noteModal && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Mentorship Note</DialogTitle>
              <DialogDescription>
                Record feedback, code review observations, or guidance for{" "}
                <strong className="text-foreground">{noteModal.studentName}</strong>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <Textarea
                rows={4}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Candidate shows excellent problem-solving fundamentals. Suggested exploring distributed stream processing..."
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNoteModal(null)}>
                Cancel
              </Button>
              <Button onClick={handleAddNote}>Save Note</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Schedule Meeting Modal */}
      <Dialog open={!!scheduleModal} onOpenChange={(open) => !open && setScheduleModal(null)}>
        {scheduleModal && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule Mentorship Session</DialogTitle>
              <DialogDescription>
                Book 1-on-1 consultation with{" "}
                <strong className="text-foreground">{scheduleModal.studentName}</strong>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="grid gap-2">
                <Label>Meeting Date</Label>
                <Input
                  value={meetDate}
                  onChange={(e) => setMeetDate(e.target.value)}
                  placeholder="e.g. 28 Sep 2026"
                />
              </div>
              <div className="grid gap-2">
                <Label>Session Mode / Link</Label>
                <select
                  value={meetMode}
                  onChange={(e) => setMeetMode(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                >
                  <option value="Google Meet">Virtual (Google Meet)</option>
                  <option value="Zoom">Virtual (Zoom)</option>
                  <option value="In-Person Office Hours">In-Person Office Hours</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setScheduleModal(null)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmSchedule} className="gap-1.5">
                <Sparkles className="size-4" /> Confirm Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Record Past Meeting Modal */}
      <Dialog open={!!recordModal} onOpenChange={(open) => !open && setRecordModal(null)}>
        {recordModal && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Log Meeting Session Notes</DialogTitle>
              <DialogDescription>
                Record discussion points with{" "}
                <strong className="text-foreground">{recordModal.studentName}</strong>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="grid gap-2">
                <Label>Session Discussion Summary</Label>
                <Textarea
                  rows={3}
                  value={recSummary}
                  onChange={(e) => setRecSummary(e.target.value)}
                  placeholder="Discussed system design tradeoffs for high concurrency applications..."
                />
              </div>
              <div className="grid gap-2">
                <Label>Action Items for Student</Label>
                <Input
                  value={recActionItems}
                  onChange={(e) => setRecActionItems(e.target.value)}
                  placeholder="Complete Redis caching assignment by next Friday"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRecordModal(null)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmRecord}>Save Meeting Log</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
