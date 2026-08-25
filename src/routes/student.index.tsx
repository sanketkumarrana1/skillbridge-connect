import { createFileRoute } from "@tanstack/react-router";
import { PortalPage } from "@/components/skillbridge/portal";

export const Route = createFileRoute("/student/")({
  component: () => <PortalPage role="student" />,
});
/* import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, FileText, Gauge, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  MatchRing,
  PageHeader,
  SkillBar,
  StatCard,
  StatusBadge,
} from "@/components/skillbridge/primitives";
import { InternshipCard } from "@/components/skillbridge/internship-card";
import { useAppState } from "@/context/app-state";

export const Route = createFileRoute("/student/")({
  head: () => ({
    meta: [
      { title: "Student Dashboard — VedaaX" },
      {
        name: "description",
        content:
          "Track profile completion, overall skill score, recommended internships and recent applications in one student workspace.",
      },
      { property: "og:title", content: "Student Dashboard — VedaaX" },
      {
        property: "og:description",
        content: "Your skill score, matches and applications at a glance.",
      },
    ],
  }),
  component: StudentDashboard,
});

function StudentDashboard() {
  const { profile, internships, applications } = useAppState();
  const skillScore = Math.round(
    profile.skills.reduce((s, x) => s + x.score, 0) / profile.skills.length,
  );
  const recommended = internships.filter((i) => i.match >= 65);

  return (
    <>
      <PageHeader
        title={`Welcome back, ${profile.name.split(" ")[0]}`}
        description="Here is where your skill profile stands today."
        action={
          <Button asChild>
            <Link to="/student/assessment">Take assessment</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Profile completion"
          value="82%"
          hint="Add 2 more certifications"
          icon={<UserCheck className="size-4" />}
        />
        <StatCard
          label="Overall skill score"
          value={`${skillScore}`}
          hint="Across 8 assessed skills"
          icon={<Gauge className="size-4" />}
        />
        <StatCard
          label="Recommended internships"
          value={recommended.length}
          hint="Matching 65% or higher"
          icon={<Briefcase className="size-4" />}
        />
        <StatCard
          label="Applications"
          value={applications.length}
          hint={`${applications.filter((a) => a.status === "Shortlisted").length} shortlisted`}
          icon={<FileText className="size-4" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <h2 className="min-w-0 font-display text-lg font-semibold text-foreground">
              Skill overview
            </h2>
            <Button asChild variant="ghost" size="sm" className="shrink-0">
              <Link to="/student/analysis">Full analysis</Link>
            </Button>
          </div>
          <div className="mt-5 space-y-4">
            {profile.skills.map((s) => (
              <SkillBar key={s.name} name={s.name} score={s.score} />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display text-lg font-semibold text-foreground">Career readiness</h2>
          <div className="mt-5 flex items-center gap-5">
            <MatchRing value={78} size={104} />
            <div className="min-w-0">
              <p className="text-sm leading-relaxed text-muted-foreground">
                You are ready for most frontend and product engineering internships. Closing your
                system design gap would unlock two more high-match roles.
              </p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-5 text-center">
            {[
              ["3", "Strong"],
              ["3", "Moderate"],
              ["2", "Gaps"],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="font-display text-xl font-semibold text-foreground">{v}</p>
                <p className="text-xs text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="space-y-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <h2 className="min-w-0 font-display text-lg font-semibold text-foreground">
            Recommended internships
          </h2>
          <Button asChild variant="ghost" size="sm" className="shrink-0">
            <Link to="/student/internships">View all</Link>
          </Button>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {recommended.slice(0, 2).map((i) => (
            <InternshipCard key={i.id} internship={i} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <h2 className="min-w-0 font-display text-lg font-semibold text-foreground">
            Recent applications
          </h2>
          <Button asChild variant="ghost" size="sm" className="shrink-0">
            <Link to="/student/applications">All applications</Link>
          </Button>
        </div>
        <ul className="mt-4 divide-y divide-border">
          {applications.slice(0, 4).map((a) => (
            <li
              key={a.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{a.internship}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {a.company} · {a.appliedDate}
                </p>
              </div>
              <StatusBadge status={a.status} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
} */
