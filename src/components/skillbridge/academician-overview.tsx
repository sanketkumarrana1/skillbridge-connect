import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  Layers,
  LineChart,
  MessageSquare,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  Video,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SectionCard, Stat, WorkspaceHeader } from "@/components/skillbridge/student-ui";
import { useAppState } from "@/context/app-state";

export function AcademicianOverview() {
  const {
    facultyInternships,
    facultyTrainings,
    facultyFDPs,
    consultancyProjects,
    researchProjects,
    guestLectures,
    studentMentorships,
  } = useAppState();

  // Real KPI Calculations from synchronized state
  const activeInternshipsCount = facultyInternships.filter(
    (i) =>
      i.registered || i.applicationStatus === "Accepted" || i.applicationStatus === "Under Review",
  ).length;

  const activeTrainingCount = facultyTrainings.filter((t) => t.registered).length;
  const fdpEnrollmentsCount = facultyFDPs.filter((f) => f.registered).length;
  const activeConsultancyCount = consultancyProjects.filter(
    (c) => c.applied || c.participationStatus === "In Progress",
  ).length;
  const activeResearchCount = researchProjects.filter(
    (r) => r.applied || r.participationStatus === "In Progress",
  ).length;
  const mentorshipSessionsCount = studentMentorships.filter((m) => m.status === "Active").length;

  // Total ongoing engagements
  const totalEngagements =
    activeInternshipsCount +
    activeTrainingCount +
    fdpEnrollmentsCount +
    activeConsultancyCount +
    activeResearchCount;

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        eyebrow="Faculty & Academic Leadership"
        title="Academician Collaboration Hub"
        description="Bridge academic pedagogy with cutting-edge industry practice through corporate fellowships, funded research, FDPs, and active student mentorship."
        action={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/academician/internships">Explore Fellowships</Link>
            </Button>
            <Button asChild size="sm" className="gap-1.5">
              <Link to="/academician/mentorship">
                <Users className="size-3.5" /> Mentee Sessions
              </Link>
            </Button>
          </div>
        }
      />

      {/* 6 Real KPI Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Stat
          label="Faculty Internships"
          value={activeInternshipsCount.toString()}
          trend="Industry Fellowships"
          icon={Briefcase}
        />
        <Stat
          label="Industrial Training"
          value={activeTrainingCount.toString()}
          trend="Active Tracks"
          icon={Award}
        />
        <Stat
          label="FDP Enrollments"
          value={fdpEnrollmentsCount.toString()}
          trend="National Programs"
          icon={BookOpen}
        />
        <Stat
          label="Consultancy"
          value={activeConsultancyCount.toString()}
          trend="Funded Industry Projects"
          icon={Building2}
        />
        <Stat
          label="Research Collabs"
          value={activeResearchCount.toString()}
          trend="Joint R&D Grants"
          icon={Sparkles}
        />
        <Stat
          label="Mentorship Mentees"
          value={mentorshipSessionsCount.toString()}
          trend="Active Student Mentees"
          icon={Users}
        />
      </div>

      {/* Active Engagements Spotlight */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Col: Active Industrial Fellowships & Training Progress */}
        <div className="space-y-6 lg:col-span-7">
          {/* Active Faculty Training Progress */}
          <SectionCard
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="size-5 text-primary" />
                  <h3 className="font-display text-base font-semibold">
                    Active Industrial Training Programs
                  </h3>
                </div>
                <Button asChild variant="ghost" size="sm" className="text-xs h-7">
                  <Link to="/academician/training">
                    View all ({facultyTrainings.length}) <ArrowRight className="size-3 ml-1" />
                  </Link>
                </Button>
              </div>
            }
          >
            <div className="space-y-3 pt-2">
              {facultyTrainings.filter((t) => t.registered).length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">
                  No active training programs enrolled. Browse catalog to upskill.
                </p>
              ) : (
                facultyTrainings
                  .filter((t) => t.registered)
                  .map((prog) => (
                    <div
                      key={prog.id}
                      className="rounded-2xl border border-border p-4 bg-card/60 space-y-2.5 transition hover:border-primary/30"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Badge
                            variant="outline"
                            className="text-[10px] text-primary border-primary/30 mb-1"
                          >
                            {prog.domain}
                          </Badge>
                          <h4 className="text-sm font-semibold text-foreground">{prog.title}</h4>
                          <p className="text-xs text-muted-foreground">{prog.provider}</p>
                        </div>
                        <Badge
                          variant={prog.progress === 100 ? "default" : "secondary"}
                          className={
                            prog.progress === 100
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]"
                              : "text-[10px]"
                          }
                        >
                          {prog.progress === 100 ? "Completed" : `${prog.progress ?? 0}% Complete`}
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-muted-foreground">
                          <span>Syllabus Completion</span>
                          <span className="font-semibold text-foreground">
                            {prog.progress ?? 0}%
                          </span>
                        </div>
                        <Progress value={prog.progress ?? 0} className="h-1.5" />
                      </div>

                      <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
                        <span>{prog.duration}</span>
                        <span>{prog.mode}</span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </SectionCard>

          {/* Active Industry Fellowships */}
          <SectionCard
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="size-5 text-primary" />
                  <h3 className="font-display text-base font-semibold">
                    Faculty Immersion & Fellowships
                  </h3>
                </div>
                <Button asChild variant="ghost" size="sm" className="text-xs h-7">
                  <Link to="/academician/internships">
                    Marketplace <ArrowRight className="size-3 ml-1" />
                  </Link>
                </Button>
              </div>
            }
          >
            <div className="space-y-3 pt-2">
              {facultyInternships.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-border p-4 bg-card/60 space-y-2 transition hover:border-primary/30"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {item.organization} • {item.location} ({item.mode})
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        item.applicationStatus === "Accepted"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]"
                          : item.applicationStatus === "Under Review"
                            ? "bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]"
                            : "bg-muted text-muted-foreground text-[10px]"
                      }
                    >
                      {item.applicationStatus || "Available"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
                    <span className="font-medium text-emerald-600">{item.stipendOrHonorarium}</span>
                    <span>Duration: {item.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Right Col: Mentorship Sessions & Guest Lectures */}
        <div className="space-y-6 lg:col-span-5">
          {/* Upcoming Mentorship Sessions */}
          <SectionCard
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="size-5 text-primary" />
                  <h3 className="font-display text-base font-semibold">Active Student Mentees</h3>
                </div>
                <Button asChild variant="ghost" size="sm" className="text-xs h-7">
                  <Link to="/academician/mentorship">
                    Manage <ArrowRight className="size-3 ml-1" />
                  </Link>
                </Button>
              </div>
            }
          >
            <div className="space-y-3 pt-2">
              {studentMentorships.slice(0, 3).map((mentee) => (
                <div
                  key={mentee.id}
                  className="flex items-center justify-between rounded-xl border border-border p-3 bg-muted/20"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 border border-border">
                      {mentee.studentAvatar ? <AvatarImage src={mentee.studentAvatar} /> : null}
                      <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                        {mentee.studentName.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{mentee.studentName}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {mentee.branch} ({mentee.year})
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    {mentee.nextMeetingDate ? (
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-blue-500/10 text-blue-600 border-blue-500/20"
                      >
                        {mentee.nextMeetingDate}
                      </Badge>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">No session booked</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Guest Lecture Invitations */}
          <SectionCard
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="size-5 text-primary" />
                  <h3 className="font-display text-base font-semibold">
                    Guest Lecture Invitations
                  </h3>
                </div>
                <Button asChild variant="ghost" size="sm" className="text-xs h-7">
                  <Link to="/academician/lectures">
                    View All <ArrowRight className="size-3 ml-1" />
                  </Link>
                </Button>
              </div>
            }
          >
            <div className="space-y-3 pt-2">
              {guestLectures.slice(0, 2).map((lec) => (
                <div
                  key={lec.id}
                  className="rounded-xl border border-border p-3.5 space-y-2 bg-card"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-semibold text-foreground line-clamp-1">
                      {lec.topic}
                    </h4>
                    <Badge
                      variant="outline"
                      className={
                        lec.status === "Accepted"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[9px]"
                          : lec.status === "Completed"
                            ? "bg-purple-500/10 text-purple-600 border-purple-500/20 text-[9px]"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[9px]"
                      }
                    >
                      {lec.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{lec.hostInstitutionOrOrg}</p>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border">
                    <span>
                      {lec.date} • {lec.time}
                    </span>
                    <span className="font-semibold text-primary">{lec.honorarium}</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <SectionCard title="Collaboration & Upskilling Modules">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2">
          {[
            {
              title: "Faculty Internships",
              desc: "Apply for 4-6 week corporate research residencies.",
              href: "/academician/internships",
              icon: Briefcase,
              count: `${facultyInternships.length} Open`,
            },
            {
              title: "Industrial Training",
              desc: "Hands-on tech stacks with syllabus & certifications.",
              href: "/academician/training",
              icon: Award,
              count: `${facultyTrainings.length} Tracks`,
            },
            {
              title: "FDP Enrollments",
              desc: "AICTE & Industry accredited development programs.",
              href: "/academician/fdps",
              icon: BookOpen,
              count: `${facultyFDPs.length} FDPs`,
            },
            {
              title: "Consultancy & Research",
              desc: "Solve industrial problem statements with grants.",
              href: "/academician/consultancy",
              icon: Building2,
              count: `${consultancyProjects.length + researchProjects.length} Projects`,
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                to={card.href}
                className="group rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40 hover:shadow-md space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-4.5" />
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {card.count}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition">
                    {card.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
                </div>
                <div className="pt-2 flex items-center text-xs font-semibold text-primary gap-1">
                  Open module{" "}
                  <ArrowRight className="size-3.5 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
