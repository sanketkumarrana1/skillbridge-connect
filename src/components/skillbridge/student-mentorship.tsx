import { useState, useMemo } from "react";
import {
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  GraduationCap,
  HelpCircle,
  Linkedin,
  MessageSquare,
  Search,
  Sparkles,
  Star,
  User,
  Video,
  X,
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
import type { Mentor, MentorshipSession, MentorshipRequest } from "@/types";

export function StudentMentorship() {
  const {
    mentors,
    mentorshipRequests,
    mentorshipSessions,
    requestMentorship,
    cancelMentorshipSession,
    submitMentorshipStudentFeedback,
  } = useAppState();

  const [activeTab, setActiveTab] = useState<"discover" | "upcoming" | "requests" | "history">(
    "discover",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "faculty" | "industry">("all");
  const [domainFilter, setDomainFilter] = useState("all");

  // Booking Modal State
  const [bookingMentor, setBookingMentor] = useState<Mentor | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [bookingPurpose, setBookingPurpose] = useState(
    "Technical Portfolio Review & System Architecture",
  );
  const [bookingNotes, setBookingNotes] = useState("");

  // Feedback Modal State
  const [feedbackSession, setFeedbackSession] = useState<MentorshipSession | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackHelpfulness, setFeedbackHelpfulness] = useState<
    "Extremely Helpful" | "Very Helpful" | "Moderately Helpful" | "Slightly Helpful"
  >("Extremely Helpful");
  const [feedbackComment, setFeedbackComment] = useState("");

  // Filtered Mentors
  const filteredMentors = useMemo(() => {
    return mentors.filter((m) => {
      const matchSearch =
        !searchQuery ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.expertise.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase())) ||
        m.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchType = typeFilter === "all" || m.type === typeFilter;
      const matchDomain =
        domainFilter === "all" ||
        m.expertise.some((e) => e.toLowerCase().includes(domainFilter.toLowerCase()));

      return matchSearch && matchType && matchDomain;
    });
  }, [mentors, searchQuery, typeFilter, domainFilter]);

  const upcomingSessions = useMemo(() => {
    return mentorshipSessions.filter((s) => s.status === "Scheduled");
  }, [mentorshipSessions]);

  const completedSessions = useMemo(() => {
    return mentorshipSessions.filter((s) => s.status === "Completed");
  }, [mentorshipSessions]);

  const handleOpenBooking = (mentor: Mentor) => {
    setBookingMentor(mentor);
    setSelectedDay(mentor.availability[0]?.dayOfWeek || "");
    setSelectedSlot(mentor.availability[0]?.timeSlots[0] || "");
    setBookingPurpose("Technical Portfolio Review & System Architecture");
    setBookingNotes("");
  };

  const handleConfirmBooking = () => {
    if (!bookingMentor || !selectedSlot) {
      toast.error("Please select an available time slot.");
      return;
    }

    const todayDate = new Date();
    // Simulate booking date next week
    const scheduledDate = new Date(todayDate.setDate(todayDate.getDate() + 4))
      .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

    const req = requestMentorship(bookingMentor.id, {
      purpose: bookingPurpose,
      preferredDate: scheduledDate,
      preferredTime: selectedSlot,
      notes: bookingNotes.trim() || undefined,
    });

    if (req) {
      toast.success(
        `Mentorship requested with ${bookingMentor.name}! You will be notified once confirmed.`,
      );
      setBookingMentor(null);
      setActiveTab("requests");
    }
  };

  const handleSubmitFeedback = () => {
    if (!feedbackSession) return;
    submitMentorshipStudentFeedback(feedbackSession.id, {
      rating: feedbackRating,
      helpfulness: feedbackHelpfulness,
      comment: feedbackComment.trim() || "Great session with actionable feedback.",
    });
    toast.success("Thank you! Your feedback has been recorded.");
    setFeedbackSession(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-950 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <Badge className="border-indigo-500/30 bg-indigo-500/15 text-indigo-300 font-semibold mb-2">
              <Sparkles className="size-3 mr-1.5" /> 1-on-1 Personalized Mentorship
            </Badge>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              AcadIn Mentor Network
            </h1>
            <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
              Connect directly with verified Industry Leaders and premier Faculty Scholars for
              portfolio reviews, systems architecture guidance, and career navigation.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-3.5 text-center">
              <p className="text-2xl font-bold text-white">{mentors.length}</p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Active Mentors</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-3.5 text-center">
              <p className="text-2xl font-bold text-indigo-400">{upcomingSessions.length}</p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Upcoming</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-3.5 text-center">
              <p className="text-2xl font-bold text-emerald-400">{completedSessions.length}</p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Completed</p>
            </div>
          </div>
        </div>

        {/* Main Tab Navigation */}
        <div className="mt-8 border-t border-white/10 pt-4">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <TabsList className="bg-slate-900/90 border border-white/10 p-1 rounded-xl">
              <TabsTrigger value="discover" className="text-xs data-[state=active]:bg-indigo-600">
                <Search className="size-3.5 mr-1.5" /> Discover Mentors ({mentors.length})
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="text-xs data-[state=active]:bg-indigo-600">
                <Calendar className="size-3.5 mr-1.5" /> Upcoming Sessions ({upcomingSessions.length})
              </TabsTrigger>
              <TabsTrigger value="requests" className="text-xs data-[state=active]:bg-indigo-600">
                <Clock className="size-3.5 mr-1.5" /> Requests ({mentorshipRequests.length})
              </TabsTrigger>
              <TabsTrigger value="history" className="text-xs data-[state=active]:bg-indigo-600">
                <CheckCircle2 className="size-3.5 mr-1.5" /> History & Feedback ({completedSessions.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* TAB 1: DISCOVER MENTORS */}
      {activeTab === "discover" && (
        <div className="space-y-6">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by mentor, company, skill..."
                className="pl-9 text-xs h-10 border-white/10 bg-slate-900 text-white"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex rounded-xl border border-white/10 bg-slate-900 p-1 text-xs">
                {(
                  [
                    { id: "all", label: "All Types" },
                    { id: "industry", label: "Industry Mentors" },
                    { id: "faculty", label: "Faculty Mentors" },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTypeFilter(t.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg font-medium transition",
                      typeFilter === t.id
                        ? "bg-indigo-600 text-white"
                        : "text-slate-400 hover:text-white",
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <select
                aria-label="Filter by Domain"
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-slate-300"
              >
                <option value="all">All Domains</option>
                <option value="frontend">Frontend & UI</option>
                <option value="systems">Systems & Backend</option>
                <option value="machine learning">Machine Learning & AI</option>
                <option value="cloud">Cloud & Distributed</option>
                <option value="cybersecurity">Cybersecurity</option>
              </select>
            </div>
          </div>

          {/* Mentors Grid */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredMentors.map((mentor) => (
              <Card
                key={mentor.id}
                className="glass-card flex flex-col justify-between rounded-2xl border-white/10 bg-slate-900/60 p-5 hover:border-indigo-500/40 transition-all duration-200"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-12 border border-indigo-500/30">
                        <AvatarFallback className="bg-indigo-600/30 text-indigo-300 font-bold text-sm">
                          {mentor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-display font-bold text-white text-base leading-tight">
                          {mentor.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[180px]">
                          {mentor.departmentOrTitle}
                        </p>
                      </div>
                    </div>

                    <Badge
                      className={cn(
                        "text-[10px] uppercase font-semibold tracking-wider",
                        mentor.type === "industry"
                          ? "border-blue-500/30 bg-blue-500/10 text-blue-300"
                          : "border-purple-500/30 bg-purple-500/10 text-purple-300",
                      )}
                    >
                      {mentor.type === "industry" ? (
                        <>
                          <Building2 className="size-2.5 mr-1" /> Industry
                        </>
                      ) : (
                        <>
                          <GraduationCap className="size-2.5 mr-1" /> Faculty
                        </>
                      )}
                    </Badge>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <Building2 className="size-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">{mentor.organization}</span>
                    <span className="text-slate-600">·</span>
                    <Clock className="size-3.5 text-slate-400 shrink-0" />
                    <span>{mentor.experienceYears}y exp</span>
                  </div>

                  <p className="mt-3 text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {mentor.bio}
                  </p>

                  <div className="mt-4 space-y-1.5">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Core Expertise
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {mentor.expertise.slice(0, 3).map((exp) => (
                        <span
                          key={exp}
                          className="rounded-md border border-white/10 bg-slate-800/80 px-2 py-0.5 text-[11px] text-slate-300 font-medium"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>

                  {mentor.ratingSummary && (
                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-slate-400">
                      <div className="flex items-center gap-1 font-semibold text-amber-300">
                        <Star className="size-3.5 fill-amber-400 text-amber-400" />
                        <span>{mentor.ratingSummary.averageRating}</span>
                        <span className="text-slate-500 font-normal">
                          ({mentor.ratingSummary.totalReviews} reviews)
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {mentor.sessionDurationMinutes} min / session
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 flex items-center gap-2">
                  <Button
                    size="sm"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold h-8"
                    onClick={() => handleOpenBooking(mentor)}
                  >
                    <Calendar className="size-3.5 mr-1.5" /> Book Session
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: UPCOMING SESSIONS */}
      {activeTab === "upcoming" && (
        <div className="space-y-4">
          {upcomingSessions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 bg-slate-900/40 p-12 text-center">
              <Calendar className="size-10 text-slate-500 mx-auto mb-3" />
              <h3 className="font-display font-bold text-white text-lg">No Upcoming Sessions</h3>
              <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
                You do not have any scheduled mentorship meetings. Discover available mentors to
                schedule your next guidance session.
              </p>
              <Button
                size="sm"
                onClick={() => setActiveTab("discover")}
                className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs"
              >
                Find a Mentor
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {upcomingSessions.map((session) => (
                <Card
                  key={session.id}
                  className="rounded-2xl border border-indigo-500/30 bg-slate-900/70 p-5 space-y-4 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-[10px] font-semibold uppercase">
                        <CheckCircle2 className="size-2.5 mr-1" /> Confirmed & Scheduled
                      </Badge>
                      <h4 className="mt-2 font-display font-bold text-white text-lg">
                        {session.mentorName}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {session.mentorOrganization} · {session.mentorType === "faculty" ? "Faculty Mentor" : "Industry Mentor"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-slate-950 p-2.5 text-center min-w-[70px]">
                      <p className="text-xs font-bold text-indigo-400">{session.date.split(" ")[1]}</p>
                      <p className="text-lg font-extrabold text-white">{session.date.split(" ")[0]}</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3 text-xs space-y-1.5">
                    <p className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Clock className="size-3.5 text-indigo-400" /> {session.startTime} - {session.endTime}
                    </p>
                    <p className="text-slate-400">{session.purpose}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    {session.meetingLink ? (
                      <Button
                        size="sm"
                        asChild
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8 font-semibold"
                      >
                        <a href={session.meetingLink} target="_blank" rel="noreferrer">
                          <Video className="size-3.5 mr-1.5" /> Join Meeting Link
                        </a>
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-slate-400 text-xs">
                        In Person
                      </Badge>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        cancelMentorshipSession(session.id, "Cancelled by student");
                        toast.success("Mentorship session cancelled.");
                      }}
                      className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs h-8"
                    >
                      Cancel Session
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: REQUESTS */}
      {activeTab === "requests" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 divide-y divide-white/10">
            {mentorshipRequests.map((req) => (
              <div key={req.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white text-sm">{req.mentorName}</h4>
                    <span className="text-xs text-slate-500">·</span>
                    <span className="text-xs text-slate-400">{req.mentorOrganization}</span>
                    <Badge
                      className={cn(
                        "text-[10px] font-semibold",
                        req.status === "Accepted" && "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
                        req.status === "Requested" && "border-amber-500/30 bg-amber-500/10 text-amber-300",
                        req.status === "Declined" && "border-rose-500/30 bg-rose-500/10 text-rose-300",
                      )}
                    >
                      {req.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{req.purpose}</p>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                    <Calendar className="size-3 text-slate-500" /> Requested: {req.preferredDate} ({req.preferredTime})
                  </p>
                  {req.notes && (
                    <p className="text-[11px] text-indigo-300 mt-1 italic">
                      Mentor note: "{req.notes}"
                    </p>
                  )}
                </div>

                <div className="text-xs text-slate-500 shrink-0">
                  Requested on {req.requestedAt}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: HISTORY & FEEDBACK */}
      {activeTab === "history" && (
        <div className="space-y-4">
          {completedSessions.map((session) => (
            <Card
              key={session.id}
              className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <Badge className="border-blue-500/30 bg-blue-500/10 text-blue-300 text-[10px] font-semibold">
                    <CheckCircle2 className="size-3 mr-1" /> Completed Session
                  </Badge>
                  <h4 className="mt-2 font-display font-bold text-white text-lg">
                    {session.mentorName}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {session.mentorOrganization} · {session.date} ({session.startTime} - {session.endTime})
                  </p>
                </div>

                {session.studentFeedback ? (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-right">
                    <div className="flex items-center gap-1 justify-end text-amber-300 font-bold text-xs">
                      <Star className="size-3.5 fill-amber-400" /> {session.studentFeedback.rating} / 5
                    </div>
                    <p className="text-[11px] text-emerald-300 mt-0.5 font-medium">
                      "{session.studentFeedback.helpfulness}"
                    </p>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-500 text-white text-xs h-8 font-semibold"
                    onClick={() => setFeedbackSession(session)}
                  >
                    <Star className="size-3 mr-1.5" /> Leave Feedback
                  </Button>
                )}
              </div>

              {session.outcome && (
                <div className="rounded-xl border border-white/10 bg-slate-950 p-4 space-y-3">
                  <div>
                    <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                      Executive Summary & Outcomes
                    </p>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {session.outcome.summary}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Topics Discussed
                    </p>
                    <ul className="mt-1 space-y-1 text-xs text-slate-300">
                      {session.outcome.topicsDiscussed.map((t, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-indigo-400 font-bold">·</span> {t}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Follow-up Recommendations
                    </p>
                    <ul className="mt-1 space-y-1 text-xs text-slate-300">
                      {session.outcome.followUpRecommendations.map((r, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 font-bold">→</span> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* BOOKING MODAL */}
      <Dialog open={!!bookingMentor} onOpenChange={(open) => !open && setBookingMentor(null)}>
        <DialogContent className="border-white/10 bg-[#0E1322]/95 text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="size-5 text-indigo-400" />
              Schedule Session with {bookingMentor?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              {bookingMentor?.departmentOrTitle} at {bookingMentor?.organization} · {bookingMentor?.sessionDurationMinutes} Minutes
            </DialogDescription>
          </DialogHeader>

          {bookingMentor && (
            <div className="space-y-4 py-3">
              {/* Slot Picker based on real mentor availability data */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-300">
                  Select Available Time Slot (Weekly Schedule)
                </Label>
                <div className="grid gap-2">
                  {bookingMentor.availability.map((avail) => (
                    <div
                      key={avail.dayOfWeek}
                      className="rounded-xl border border-white/10 bg-slate-900/80 p-3 space-y-2"
                    >
                      <p className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                        <Clock className="size-3.5" /> Every {avail.dayOfWeek}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {avail.timeSlots.map((slot) => {
                          const isSelected = selectedSlot === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => {
                                setSelectedDay(avail.dayOfWeek);
                                setSelectedSlot(slot);
                              }}
                              className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-medium border transition",
                                isSelected
                                  ? "border-indigo-500 bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                                  : "border-white/10 bg-slate-800 text-slate-300 hover:border-white/20",
                              )}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Purpose Selector */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300">Session Purpose</Label>
                <select
                  value={bookingPurpose}
                  onChange={(e) => setBookingPurpose(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Technical Portfolio Review & System Architecture">
                    Technical Portfolio Review & System Architecture
                  </option>
                  <option value="Mock Technical Interview & Algorithm Deep Dive">
                    Mock Technical Interview & Algorithm Deep Dive
                  </option>
                  <option value="Academic Research Publication Guidance">
                    Academic Research Publication Guidance
                  </option>
                  <option value="Career Transition & Industry Navigation">
                    Career Transition & Industry Navigation
                  </option>
                </select>
              </div>

              {/* Optional Notes */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300">
                  Context / Questions for Mentor (Optional)
                </Label>
                <Textarea
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="Share a link to your GitHub repo, specific questions, or topics you want to prioritize..."
                  rows={2}
                  className="border-white/10 bg-slate-900 text-xs text-white"
                />
              </div>
            </div>
          )}

          <DialogFooter className="border-t border-white/10 pt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBookingMentor(null)}
              className="text-slate-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmBooking}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
            >
              Confirm Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* FEEDBACK MODAL */}
      <Dialog open={!!feedbackSession} onOpenChange={(open) => !open && setFeedbackSession(null)}>
        <DialogContent className="border-white/10 bg-[#0E1322]/95 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold text-white flex items-center gap-2">
              <Star className="size-5 text-amber-400" />
              Rate Mentorship Session
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Provide constructive feedback on your meeting with {feedbackSession?.mentorName}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="space-y-2 text-center">
              <Label className="text-xs font-semibold text-slate-300">Overall Experience</Label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackRating(star)}
                    className="p-1 text-slate-500 hover:text-amber-400 transition"
                  >
                    <Star
                      className={cn(
                        "size-7",
                        star <= feedbackRating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-600",
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300">Helpfulness Level</Label>
              <select
                value={feedbackHelpfulness}
                onChange={(e) => setFeedbackHelpfulness(e.target.value as any)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white"
              >
                <option value="Extremely Helpful">Extremely Helpful</option>
                <option value="Very Helpful">Very Helpful</option>
                <option value="Moderately Helpful">Moderately Helpful</option>
                <option value="Slightly Helpful">Slightly Helpful</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300">Comments & Highlights</Label>
              <Textarea
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder="What was most valuable about this discussion?"
                rows={3}
                className="border-white/10 bg-slate-900 text-xs text-white"
              />
            </div>
          </div>

          <DialogFooter className="border-t border-white/10 pt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFeedbackSession(null)}
              className="text-slate-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitFeedback}
              className="bg-amber-600 hover:bg-amber-500 text-white font-semibold"
            >
              Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

