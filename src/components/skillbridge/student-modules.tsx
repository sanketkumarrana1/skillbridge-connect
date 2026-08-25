import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkX,
  Briefcase,
  Calendar,
  Check,
  Clock,
  Download,
  FileText,
  IndianRupee,
  MapPin,
  Plus,
  Search,
  Sparkles,
  Target,
  Trash2,
  Users,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InternshipCard } from "@/components/skillbridge/internship-card";
import {
  CompanyMark,
  EmptyState,
  SkillTag,
  StatusBadge,
} from "@/components/skillbridge/primitives";
import { SectionCard, Stat, WorkspaceHeader } from "@/components/skillbridge/student-ui";
import { StudentPortfolio } from "@/components/skillbridge/student-portfolio";
import { StudentCertificates } from "@/components/skillbridge/student-certificates";
import { StudentResumeBuilder } from "@/components/skillbridge/student-resume-builder";
import { useAppState } from "@/context/app-state";
import { mcqAssessmentQuestions } from "@/data/mock";
import type { Application, ApplicationStatus, Internship, Job } from "@/types";

const formatTime = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

export function StudentAssessment() {
  const navigate = useNavigate();
  const { answers, setAnswer, submitFullAssessment, resetAnswers, assessmentSubmitted } =
    useAppState();
  const [current, setCurrent] = useState(0);
  const [remaining, setRemaining] = useState(15 * 60);
  const question = mcqAssessmentQuestions[current];
  const answered = Object.keys(answers).length;
  const total = mcqAssessmentQuestions.length;

  const submit = useCallback(
    (automatic = false) => {
      if (assessmentSubmitted) return;
      if (!automatic) {
        if (answered < total) {
          const unanswered = total - answered;
          if (
            !window.confirm(
              `You have ${unanswered} unanswered question${unanswered > 1 ? "s" : ""} — submit anyway?`,
            )
          )
            return;
        }
        if (!window.confirm("Submit your assessment?")) return;
      }
      submitFullAssessment(answers);
      toast.success("Assessment submitted. Your Skill Report is ready.");
      navigate({ to: "/student/analysis" });
    },
    [answers, answered, assessmentSubmitted, navigate, submitFullAssessment, total],
  );

  useEffect(() => {
    if (assessmentSubmitted) return;
    const timer = window.setInterval(
      () =>
        setRemaining((value) => {
          if (value <= 1) {
            window.clearInterval(timer);
            submit(true);
            return 0;
          }
          return value - 1;
        }),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [assessmentSubmitted, submit]);

  if (assessmentSubmitted) {
    return (
      <>
        <WorkspaceHeader
          eyebrow="Timed assessment"
          title="AI Skill Assessment"
          description="Your assessment has already been submitted."
        />
        <SectionCard title="Already submitted">
          <div className="mt-4 rounded-2xl border border-dashed border-border bg-muted/40 p-8 text-center">
            <Check className="mx-auto size-8 text-primary" />
            <p className="mt-4 font-display text-xl font-semibold">
              Your assessment has been submitted
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              You can retake the assessment to generate a fresh Skill Report at any time.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button onClick={() => resetAnswers()}>Retake Assessment</Button>
              <Button variant="outline" onClick={() => navigate({ to: "/student/analysis" })}>
                View Skill Report <ArrowRight />
              </Button>
            </div>
          </div>
        </SectionCard>
      </>
    );
  }

  if (!question) return null;

  return (
    <>
      <WorkspaceHeader
        eyebrow="Timed assessment"
        title="AI Skill Assessment"
        description="20 industry-oriented questions. Your report is generated when you submit."
        action={
          <Badge
            className={
              remaining < 60
                ? "bg-destructive text-destructive-foreground"
                : "bg-primary/10 text-primary"
            }
          >
            {formatTime(remaining)} remaining
          </Badge>
        }
      />
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
          style={{ width: `${(answered / total) * 100}%` }}
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
        <section className="rounded-3xl border border-border bg-card p-6 sm:p-9">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">
              Question {current + 1} of {total}
            </p>
            <span className="text-sm text-muted-foreground">{question.category}</span>
          </div>
          <h2 className="mt-5 font-display text-2xl font-semibold leading-tight sm:text-3xl">
            {question.question}
          </h2>
          <div className="mt-8 grid gap-3">
            {question.options.map((option, index) => (
              <button
                key={option}
                type="button"
                onClick={() => setAnswer(question.id, index)}
                className={`flex items-center gap-3 rounded-2xl border p-4 text-left text-sm transition ${
                  answers[question.id] === index
                    ? "border-primary bg-primary/10 ring-2 ring-primary/15"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <span className="grid size-8 place-items-center rounded-lg bg-muted font-semibold">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option}</span>
                {answers[question.id] === index && <Check className="size-4 text-primary" />}
              </button>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-between gap-3">
            <Button
              variant="outline"
              disabled={current === 0}
              onClick={() => setCurrent((value) => value - 1)}
            >
              <ArrowLeft /> Previous
            </Button>
            {current === total - 1 ? (
              <Button onClick={() => submit()}>
                Submit Assessment <Check />
              </Button>
            ) : (
              <Button onClick={() => setCurrent((value) => value + 1)}>
                Next <ArrowRight />
              </Button>
            )}
          </div>
        </section>
        <aside className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold">Question palette</h2>
            <span className="text-xs text-muted-foreground">
              {answered}/{total}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {mcqAssessmentQuestions.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrent(index)}
                className={`grid aspect-square place-items-center rounded-lg text-xs font-semibold ${
                  current === index
                    ? "bg-primary text-primary-foreground"
                    : answers[item.id] !== undefined
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            {answered < total
              ? `Answer ${total - answered} more to submit.`
              : "All questions answered."}
          </p>
          <Button className="mt-5 w-full" onClick={() => submit()}>
            Submit Assessment <Check />
          </Button>
          <Button
            variant="ghost"
            className="mt-2 w-full text-destructive hover:text-destructive"
            onClick={resetAnswers}
          >
            Reset assessment
          </Button>
        </aside>
      </div>
    </>
  );
}

const TIMELINE_STAGES: ApplicationStatus[] = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Selected",
];

const NEXT_STEP_TEXT: Record<ApplicationStatus, string> = {
  Applied: "Await recruiter review — your profile is being screened.",
  "Under Review": "Complete any take-home test or coding challenge shared via email.",
  Shortlisted: "Prepare for the interview — review your projects and fundamentals.",
  Interview: "Attend your scheduled interview and follow up with a thank-you note.",
  "Interview Scheduled": "Your interview is scheduled. Check date, time, and video link.",
  "Interview Completed": "Interview evaluation completed. Await offer letter or next steps.",
  Offered: "Congratulations! Review your offer package and accept/decline.",
  Selected: "Congratulations! Review your offer letter and accept/decline.",
  Hired: "Offer accepted! Welcome to your new role.",
  Rejected: "Keep building your skills and apply to similar roles.",
};

const parseCTC = (ctc: string): number => {
  const matches = ctc.match(/\d+/g);
  if (!matches) return 0;
  const nums = matches.map(Number);
  return nums.reduce((a, b) => a + b, 0) / nums.length;
};

const computeJobMatch = (job: Job, profileSkills: { name: string; score: number }[]): number => {
  const skillNames = profileSkills.map((s) => s.name.toLowerCase());
  const skillScores = new Map(profileSkills.map((s) => [s.name.toLowerCase(), s.score]));
  const requiredLower = job.requiredSkills.map((s) => s.toLowerCase());
  let matchingCount = 0;
  let scoreSum = 0;
  for (let i = 0; i < requiredLower.length; i++) {
    const req = requiredLower[i]!;
    const idx = skillNames.indexOf(req);
    if (idx !== -1) {
      matchingCount++;
      scoreSum += skillScores.get(req) ?? 0;
    }
  }
  const coverage = requiredLower.length > 0 ? (matchingCount / requiredLower.length) * 100 : 0;
  const avgScore = matchingCount > 0 ? scoreSum / matchingCount : 0;
  return Math.round(coverage * 0.6 + avgScore * 0.4);
};

function ApplicationTimeline({ current }: { current: ApplicationStatus }) {
  const currentIdx = current === "Rejected" ? -1 : TIMELINE_STAGES.indexOf(current);
  return (
    <div className="flex items-center gap-1 overflow-x-auto">
      {TIMELINE_STAGES.map((stage, idx) => {
        const isActive = idx <= currentIdx;
        const isCurrent = idx === currentIdx;
        return (
          <div key={stage} className="flex items-center gap-1">
            <span
              className={
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium " +
                (isCurrent
                  ? "bg-primary text-primary-foreground ring-2 ring-primary/20"
                  : isActive
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground")
              }
            >
              {isActive && <Check className="size-3" />}
              {stage}
            </span>
            {idx < TIMELINE_STAGES.length - 1 && (
              <span
                className={
                  "mx-1 h-px w-4 shrink-0 " +
                  (idx < currentIdx ? "bg-primary" : "bg-muted-foreground/20")
                }
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function FunctionalStudentModule({ section }: { section: string }) {
  const navigate = useNavigate();
  const {
    internships,
    savedInternships,
    isInternshipSaved,
    saveInternship,
    unsaveInternship,
    applyToInternship,
    assessmentResult,
    profile,
    jobs,
    savedJobs,
    isJobSaved,
    saveJob,
    unsaveJob,
    applyToJob,
    applications,
    advanceApplication,
    updateProfile,
    hasApplied,
    careerMatches,
    roadmapItems,
    updateRoadmapItem,
    getRoadmapCompletion,
  } = useAppState();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [paidFilter, setPaidFilter] = useState<"All" | "Paid" | "Unpaid">("All");
  const [locationFilter, setLocationFilter] = useState("");
  const [workTypeFilter, setWorkTypeFilter] = useState<"All" | "Remote" | "Hybrid" | "On-site">(
    "All",
  );
  const [experienceFilter, setExperienceFilter] = useState<
    "All" | "Freshers" | "0-1 yr" | "1-2 yr"
  >("All");
  const [ctcFilter, setCtcFilter] = useState<"All" | "<₹8L" | "₹8-12L" | ">₹12L">("All");

  const filteredInternships = useMemo(() => {
    return internships
      .filter((item) => {
        const searchText =
          `${item.title} ${item.company} ${item.location} ${item.requiredSkills.join(" ")}`.toLowerCase();
        const matchesQuery = searchText.includes(query.toLowerCase());
        const matchesType = filter === "All" || item.type === filter;
        const matchesPaid =
          paidFilter === "All" || (paidFilter === "Paid" ? item.paid : !item.paid);
        const matchesLocation =
          !locationFilter.trim() ||
          item.location.toLowerCase().includes(locationFilter.toLowerCase());
        return matchesQuery && matchesType && matchesPaid && matchesLocation;
      })
      .sort((a, b) => b.match - a.match);
  }, [internships, query, filter, paidFilter, locationFilter]);

  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        const searchText =
          `${job.title} ${job.company} ${job.location} ${job.requiredSkills.join(" ")}`.toLowerCase();
        const matchesQuery = searchText.includes(query.toLowerCase());
        const matchesWorkType = workTypeFilter === "All" || job.workType === workTypeFilter;
        const matchesExperience =
          experienceFilter === "All" ||
          (experienceFilter === "Freshers"
            ? job.experience === "0-1 yr"
            : job.experience === experienceFilter);
        const matchesCTC =
          ctcFilter === "All" ||
          (() => {
            const avg = parseCTC(job.ctc);
            if (ctcFilter === "<₹8L") return avg < 8;
            if (ctcFilter === "₹8-12L") return avg >= 8 && avg <= 12;
            if (ctcFilter === ">₹12L") return avg > 12;
            return true;
          })();
        return matchesQuery && matchesWorkType && matchesExperience && matchesCTC;
      })
      .map((job) => ({ ...job, match: computeJobMatch(job, profile.skills) }))
      .sort((a, b) => b.match - a.match);
  }, [jobs, query, workTypeFilter, experienceFilter, ctcFilter, profile.skills]);

  const sortedApplications = useMemo(() => {
    return [...applications].sort((a, b) => {
      const dateA = new Date(a.appliedDate.split(" ").reverse().join(" "));
      const dateB = new Date(b.appliedDate.split(" ").reverse().join(" "));
      return dateB.getTime() - dateA.getTime();
    });
  }, [applications]);

  const getOpportunity = (app: Application): Internship | Job | undefined => {
    const type = app.opportunityType ?? "Internship";
    if (type === "Internship") {
      return internships.find((i) => i.id === app.internshipId);
    }
    return jobs.find((j) => j.id === app.internshipId);
  };

  if (section === "internships")
    return (
      <>
        <WorkspaceHeader
          eyebrow="Marketplace"
          title="Internship Search"
          description="Search roles, filter by preferences, and apply with one clear action."
          action={
            <Badge className="bg-primary/10 text-primary">
              <Bookmark className="mr-1 size-3 inline" />
              Saving {savedInternships.length} bookmarked
            </Badge>
          }
        />
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search roles, companies, skills..."
              />
            </div>
            <div className="relative sm:w-64">
              <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                value={locationFilter}
                onChange={(event) => setLocationFilter(event.target.value)}
                placeholder="Location (e.g. Bengaluru)"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["All", "Remote", "Hybrid", "On-site"] as const).map((item) => (
              <Button
                key={item}
                size="sm"
                variant={filter === item ? "default" : "outline"}
                onClick={() => setFilter(item)}
              >
                {item}
              </Button>
            ))}
            <span className="mx-2 w-px bg-border" />
            {(["All", "Paid", "Unpaid"] as const).map((item) => (
              <Button
                key={item}
                size="sm"
                variant={paidFilter === item ? "default" : "outline"}
                onClick={() => setPaidFilter(item)}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {filteredInternships.map((item) => (
            <InternshipCard key={item.id} internship={item} />
          ))}
        </div>
        {filteredInternships.length === 0 && (
          <div className="mt-6">
            <EmptyState
              title="No internships match your filters"
              description="Try clearing some filters or broadening your search keywords."
            />
          </div>
        )}
      </>
    );

  if (section === "jobs")
    return (
      <>
        <WorkspaceHeader
          eyebrow="Marketplace"
          title="Job Search"
          description="Explore early-career full-time roles matched to your profile."
          action={
            <Badge className="bg-primary/10 text-primary">
              <Bookmark className="mr-1 size-3 inline" />
              {savedJobs.length} saved
            </Badge>
          }
        />
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search job titles, companies, or skills..."
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Work
            </span>
            {(["All", "Remote", "Hybrid", "On-site"] as const).map((item) => (
              <Button
                key={`wt-${item}`}
                size="sm"
                variant={workTypeFilter === item ? "default" : "outline"}
                onClick={() => setWorkTypeFilter(item)}
              >
                {item}
              </Button>
            ))}
            <span className="mx-2 w-px bg-border" />
            <span className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Exp
            </span>
            {(["All", "Freshers", "0-1 yr", "1-2 yr"] as const).map((item) => (
              <Button
                key={`exp-${item}`}
                size="sm"
                variant={experienceFilter === item ? "default" : "outline"}
                onClick={() => setExperienceFilter(item)}
              >
                {item}
              </Button>
            ))}
            <span className="mx-2 w-px bg-border" />
            <span className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              CTC
            </span>
            {(["All", "<₹8L", "₹8-12L", ">₹12L"] as const).map((item) => (
              <Button
                key={`ctc-${item}`}
                size="sm"
                variant={ctcFilter === item ? "default" : "outline"}
                onClick={() => setCtcFilter(item)}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {filteredJobs.map((job) => {
            const jobSaved = isJobSaved(job.id);
            const jobApplied = hasApplied(job.id);
            const appEntry = applications.find(
              (a) => a.internshipId === job.id && a.opportunityType === "Job",
            );
            const toggleSave = () => {
              if (jobSaved) {
                unsaveJob(job.id);
                toast.success(`Removed ${job.title} from saved`);
              } else {
                saveJob(job.id);
                toast.success(`Saved ${job.title}`);
              }
            };
            const handleApply = () => {
              const added = applyToJob(job.id);
              if (added) {
                toast.success(`Applied to ${job.title}`);
              } else {
                toast.info("You have already applied to this job");
              }
            };
            return (
              <SectionCard
                key={job.id}
                title={
                  <div className="flex items-start gap-3">
                    <CompanyMark name={job.company} hue={job.companyLogoHue} />
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-base font-semibold">{job.title}</h3>
                      <p className="truncate text-sm text-muted-foreground">{job.company}</p>
                    </div>
                  </div>
                }
                action={
                  <div className="flex flex-col items-end gap-2">
                    <Badge className="bg-primary/10 text-primary tabular-nums">
                      {job.match}% match
                    </Badge>
                    {jobApplied && appEntry && <StatusBadge status={appEntry.status} />}
                    {!jobApplied && <Badge className="bg-success/10 text-success">Open</Badge>}
                  </div>
                }
              >
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{job.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {job.requiredSkills.slice(0, 5).map((s) => (
                    <SkillTag key={s} muted>
                      {s}
                    </SkillTag>
                  ))}
                  {job.requiredSkills.length > 5 && (
                    <SkillTag muted>+{job.requiredSkills.length - 5}</SkillTag>
                  )}
                </div>
                <dl className="mt-4 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <IndianRupee className="size-3.5 shrink-0 text-emerald-600" />
                    <span className="truncate font-medium text-foreground">{job.ctc}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="size-3.5 shrink-0 text-primary" />
                    <span className="truncate">{job.experience}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="size-3.5 shrink-0 text-amber-600" />
                    <span className="truncate">{job.location.split(",")[0]}</span>
                  </div>
                </dl>
                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                  {!jobApplied ? (
                    <Button size="sm" onClick={handleApply}>
                      Apply now <Check className="ml-1 size-3.5" />
                    </Button>
                  ) : (
                    <Badge className="bg-success/10 text-success">Applied</Badge>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={toggleSave}
                    aria-label={jobSaved ? "Unsave job" : "Save job"}
                  >
                    {jobSaved ? <BookmarkX className="size-4" /> : <Bookmark className="size-4" />}
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/student/jobs">
                      View Job <ArrowRight className="ml-1 size-3.5" />
                    </Link>
                  </Button>
                </div>
              </SectionCard>
            );
          })}
        </div>
        {filteredJobs.length === 0 && (
          <div className="mt-6">
            <EmptyState
              title="No jobs match your filters"
              description="Try broadening your search or clearing some experience/CTC filters."
            />
          </div>
        )}
      </>
    );

  if (section === "applications")
    return (
      <>
        <WorkspaceHeader
          eyebrow="Progress tracker"
          title="Applications"
          description="Track every application from first review to final outcome."
          action={
            <Badge className="bg-primary/10 text-primary tabular-nums">
              {sortedApplications.length} total
            </Badge>
          }
        />
        {sortedApplications.length === 0 ? (
          <EmptyState
            title="No applications yet"
            description="Start by browsing internships or jobs — when you apply, they appear here."
          />
        ) : (
          <div className="space-y-4">
            {sortedApplications.map((app) => {
              const opportunity = getOpportunity(app);
              const oppType: "Internship" | "Job" = app.opportunityType ?? "Internship";
              const title = app.internship ?? opportunity?.title ?? "Opportunity";
              const company = app.company ?? opportunity?.company ?? "";
              const oppUrl =
                oppType === "Internship"
                  ? `/student/internships/${app.internshipId}`
                  : `/student/jobs/${app.internshipId}`;
              const salaryOrStipend =
                app.salaryOrStipend ??
                (oppType === "Internship"
                  ? (opportunity as Internship | undefined)?.stipend
                  : (opportunity as Job | undefined)?.ctc) ??
                "";

              const handleAdvance = () => {
                advanceApplication(app.id);
                toast.success(`Status advanced for ${title}`);
              };

              const nextStep = app.nextStep ?? NEXT_STEP_TEXT[app.status];

              return (
                <SectionCard
                  key={app.id}
                  title={
                    <div className="flex items-start gap-3">
                      <CompanyMark
                        name={company || title}
                        hue={
                          oppType === "Internship"
                            ? ((opportunity as Internship | undefined)?.companyLogoHue ?? 220)
                            : ((opportunity as Job | undefined)?.companyLogoHue ?? 220)
                        }
                      />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate font-display text-base font-semibold">{title}</h3>
                          <Badge
                            variant="outline"
                            className={
                              oppType === "Internship"
                                ? "bg-accent/10 text-accent-foreground"
                                : "bg-primary/10 text-primary"
                            }
                          >
                            {oppType}
                          </Badge>
                        </div>
                        <p className="truncate text-sm text-muted-foreground">{company}</p>
                      </div>
                    </div>
                  }
                  action={<StatusBadge status={app.status} />}
                >
                  <dl className="mt-3 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <IndianRupee className="size-3.5 shrink-0 text-emerald-600" />
                      <span className="truncate font-medium text-foreground">
                        {salaryOrStipend || "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="size-3.5 shrink-0 text-amber-600" />
                      <span className="truncate">Applied {app.appliedDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="size-3.5 shrink-0 text-primary" />
                      <span className="truncate">{app.status}</span>
                    </div>
                  </dl>

                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Pipeline
                    </p>
                    <ApplicationTimeline current={app.status} />
                  </div>

                  <div className="mt-4 rounded-xl border border-border bg-muted/40 p-3">
                    <div className="flex items-start gap-2 text-sm">
                      <span className="grid size-6 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                        {app.status === "Selected" ? (
                          <Check className="size-3.5" />
                        ) : app.status === "Rejected" ? (
                          <Target className="size-3.5" />
                        ) : (
                          <ArrowRight className="size-3.5" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground">Next step</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                          {nextStep}
                        </p>
                      </div>
                    </div>
                  </div>

                  {app.status === "Interview" && (
                    <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                        Interview Details
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Date</p>
                          <p className="font-medium">
                            {app.interviewDetails?.date ?? "To be shared via email"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Time</p>
                          <p className="font-medium">
                            {app.interviewDetails?.time ?? "11:00 AM (tentative)"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Mode</p>
                          <p className="font-medium">
                            {app.interviewDetails?.mode ?? "Virtual · Google Meet"}
                          </p>
                        </div>
                      </div>
                      {app.interviewDetails?.notes && (
                        <p className="mt-3 text-xs text-muted-foreground">
                          Note: {app.interviewDetails.notes}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                    {app.status !== "Selected" && app.status !== "Rejected" && (
                      <Button size="sm" onClick={handleAdvance}>
                        Advance Status <ArrowRight className="ml-1 size-3.5" />
                      </Button>
                    )}
                    <Button asChild size="sm" variant="outline">
                      <Link to={oppUrl}>
                        View Opportunity <ArrowRight className="ml-1 size-3.5" />
                      </Link>
                    </Button>
                  </div>
                </SectionCard>
              );
            })}
          </div>
        )}
      </>
    );
  if (section === "portfolio" || section === "settings") {
    return <StudentPortfolio />;
  }

  if (section === "certificates") {
    return <StudentCertificates />;
  }

  if (section === "resume") {
    return <StudentResumeBuilder />;
  }

  return (
    <>
      <WorkspaceHeader
        eyebrow="Student workspace"
        title="Career & Learning"
        description="Your personalized path to stronger opportunities based on your skill profile."
      />

      <div className="space-y-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold">Career Matches</h2>
            {!assessmentResult && (
              <Button
                variant="link"
                size="sm"
                onClick={() => navigate({ to: "/student/assessment" })}
              >
                Take assessment for better matches <ArrowRight className="ml-1 size-3" />
              </Button>
            )}
          </div>
          {careerMatches.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {careerMatches.map((match) => (
                <SectionCard
                  key={match.roleId}
                  title={match.roleTitle}
                  action={
                    <Badge className="bg-primary/10 text-primary tabular-nums">
                      {match.matchPercentage}% match
                    </Badge>
                  }
                >
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {match.roleDescription}
                  </p>
                  <div className="mt-4 space-y-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Matching Skills
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {match.matchingSkills.slice(0, 3).map((s) => (
                          <SkillTag key={s} muted>
                            {s}
                          </SkillTag>
                        ))}
                        {match.matchingSkills.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{match.matchingSkills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    {match.missingSkills.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 mb-1.5">
                          Gaps to Close
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {match.missingSkills.slice(0, 2).map((s) => (
                            <Badge
                              key={s}
                              variant="outline"
                              className="text-[10px] border-amber-200 bg-amber-50 text-amber-700"
                            >
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-5 pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-muted-foreground">Placement Readiness</span>
                      <span className="font-semibold text-primary">
                        {match.placementReadiness}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${match.placementReadiness}%` }}
                      />
                    </div>
                  </div>
                </SectionCard>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No career matches yet"
              description="Complete your profile and assessment to see roles that fit your skills."
            />
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold">Learning Roadmap</h2>
            <Badge variant="outline" className="tabular-nums">
              {getRoadmapCompletion()}% Overall Progress
            </Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {roadmapItems.map((item) => (
              <SectionCard
                key={item.id}
                title={item.title}
                action={
                  <Badge
                    className={
                      item.completed ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
                    }
                  >
                    {item.completed ? "Completed" : `${item.progress}%`}
                  </Badge>
                }
              >
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-primary">{item.skill}</span>
                  <span>•</span>
                  <span>{item.difficulty}</span>
                  <span>•</span>
                  <span>{item.estimatedDuration}</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {!item.completed ? (
                    <>
                      <Button
                        size="sm"
                        variant={item.progress > 0 ? "default" : "outline"}
                        onClick={() => {
                          const nextProgress = Math.min(100, item.progress + 25);
                          updateRoadmapItem(item.id, {
                            progress: nextProgress,
                            completed: nextProgress === 100,
                          });
                          toast.success(
                            nextProgress === 100
                              ? `Completed: ${item.title}`
                              : `Progress updated for ${item.title}`,
                          );
                        }}
                      >
                        {item.progress > 0 ? "Continue Learning" : "Start Learning"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          window.open(item.learningResource.url, "_blank");
                          toast.info(`Opening resource: ${item.learningResource.title}`);
                        }}
                      >
                        View Lesson <ArrowRight className="ml-1 size-3" />
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" disabled className="gap-1.5">
                      <Check className="size-3.5" /> Completed
                    </Button>
                  )}
                </div>
              </SectionCard>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export function StudentSkillReport() {
  const { assessmentResult, assessmentScores, profile } = useAppState();
  const navigate = useNavigate();

  if (!assessmentResult) {
    return (
      <>
        <WorkspaceHeader
          eyebrow="Skill intelligence"
          title="Skill Report"
          description="Complete the AI Skill Assessment to unlock your category scores, strengths, skill gaps, and career matches."
          action={
            <Button onClick={() => navigate({ to: "/student/assessment" })}>
              Start assessment <ArrowRight />
            </Button>
          }
        />
        <SectionCard title="Assessment required">
          <div className="mt-4 rounded-2xl border border-dashed border-border bg-muted/40 p-8 text-center">
            <Sparkles className="mx-auto size-8 text-primary" />
            <p className="mt-4 font-display text-xl font-semibold">
              Take the 20-question assessment to generate your report
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Answer all 20 questions in the timed assessment and submit it to generate a
              personalized employability report with detailed category scores, strengths, and skill
              gap recommendations.
            </p>
            <Button className="mt-6" onClick={() => navigate({ to: "/student/assessment" })}>
              Begin 20-question assessment <ArrowRight />
            </Button>
          </div>
        </SectionCard>
      </>
    );
  }

  const { categoryScores, technicalScore, softSkillScore, employabilityScore } = assessmentResult;
  const scores = assessmentScores ?? { technical: 0, softSkills: 0, employability: 0 };

  const categories = [
    "Programming",
    "Problem Solving",
    "Analytical Thinking",
    "Domain Knowledge",
    "Communication",
    "Teamwork",
    "Leadership",
  ] as const;

  const radar = categories.map((cat) => ({
    subject: cat,
    score: categoryScores[cat] ?? 0,
  }));

  const topCategory = categories.reduce((best, cat) =>
    (categoryScores[cat] ?? 0) > (categoryScores[best] ?? 0) ? cat : best,
  );

  const strengths = categories.filter((cat) => (categoryScores[cat] ?? 0) >= 70);
  const weaknesses = categories.filter((cat) => (categoryScores[cat] ?? 0) < 55);

  const careerReadinessLabel =
    employabilityScore < 50
      ? "Building up"
      : employabilityScore <= 70
        ? "Nearly ready"
        : "Industry ready";
  const careerReadinessDesc =
    employabilityScore < 50
      ? "Focus on building foundational skills and completing the roadmap lessons to strengthen your profile."
      : employabilityScore <= 70
        ? "You have solid fundamentals. Target specific gaps and gain hands-on experience to cross the finish line."
        : "Your profile is well-positioned for industry roles. Continue refining and exploring advanced topics.";

  const gapRecommendations: Record<string, string> = {
    Programming: "Practice production-quality code through small projects with testing and review.",
    "Problem Solving":
      "Work through structured problem sets using a repeatable framework (reproduce → isolate → fix).",
    "Analytical Thinking":
      "Pick one product or funnel and practice measuring outcomes using a clear baseline.",
    "Domain Knowledge":
      "Deep dive into CI/CD, auth patterns, and observability via a hands-on tutorial.",
    Communication: "Practice writing concise status updates with progress, risks, and next steps.",
    Teamwork: "Collaborate with a peer on a short task using PR reviews and shared goals.",
    Leadership:
      "Lead one small deliverable end-to-end and surface tradeoffs early with stakeholders.",
  };

  return (
    <>
      <WorkspaceHeader
        eyebrow="Generated report"
        title="Skill Report"
        description="Your report is generated from the completed 20-question assessment."
        action={
          <Button asChild>
            <Link to="/student/assessment">
              Retake assessment <ArrowRight />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Employability Score"
          value={`${employabilityScore}%`}
          trend={careerReadinessLabel}
          icon={Target}
        />
        <Stat
          label="Technical Score"
          value={`${technicalScore}%`}
          trend="Assessed"
          icon={Sparkles}
        />
        <Stat label="Soft Skill Score" value={`${softSkillScore}%`} trend="Assessed" icon={Users} />
        <Stat
          label="Top Category"
          value={topCategory}
          trend={`${categoryScores[topCategory] ?? 0}%`}
          icon={Check}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_.85fr]">
        <SectionCard title="Capability radar">
          <div className="h-[320px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radar}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} />
                <Radar
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Category scores">
          <div className="mt-4 space-y-4">
            {categories.map((cat) => {
              const score = categoryScores[cat] ?? 0;
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{cat}</span>
                    <span className="font-semibold text-primary">{score}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SectionCard title="Strengths">
          {strengths.length > 0 ? (
            <div className="mt-4 space-y-3">
              {strengths.map((cat) => (
                <div key={cat} className="flex gap-2 text-sm">
                  <Check className="size-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>
                    <span className="font-semibold">Strong in {cat}</span> — use this in interviews
                    and highlight on your resume.
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              No categories scored 70%+ yet. Keep practicing to unlock your strengths.
            </p>
          )}
        </SectionCard>

        <SectionCard title="Weaknesses / Gaps">
          {weaknesses.length > 0 ? (
            <div className="mt-4 space-y-3">
              {weaknesses.map((cat) => (
                <div key={cat} className="rounded-xl bg-muted/60 p-3 text-sm">
                  <div className="flex gap-2">
                    <Target className="size-4 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold">{cat}</span>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {gapRecommendations[cat] ?? "Build targeted practice to improve this area."}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              No significant gaps detected. Continue refining across all categories.
            </p>
          )}
        </SectionCard>
      </div>

      <SectionCard
        title="Career Readiness"
        action={
          <Button onClick={() => navigate({ to: "/student/roadmap" })}>
            See Career Matches <ArrowRight />
          </Button>
        }
      >
        <div className="mt-4 rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                {careerReadinessLabel}
              </p>
              <p className="mt-1 font-display text-2xl font-semibold">
                {employabilityScore}% Employability
              </p>
            </div>
            <Badge className="text-sm px-3 py-1 bg-primary/10 text-primary">
              {careerReadinessLabel}
            </Badge>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {careerReadinessDesc}
          </p>
        </div>
      </SectionCard>
    </>
  );
}

function AwardIcon() {
  return (
    <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
      <FileText className="size-5" />
    </span>
  );
}
