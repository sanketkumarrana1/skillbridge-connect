import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader, StatCard, StatusBadge } from "@/components/skillbridge/primitives";
import { useAppState } from "@/context/app-state";
import type { ApplicationStatus } from "@/types";

const STATUSES: ApplicationStatus[] = ["Applied", "Under Review", "Shortlisted", "Rejected"];

export const Route = createFileRoute("/student/applications")({
  head: () => ({
    meta: [
      { title: "My Applications — SkillBridge" },
      {
        name: "description",
        content:
          "Track every internship application you have submitted, with live status from applied to shortlisted.",
      },
      { property: "og:title", content: "My Applications — SkillBridge" },
      {
        property: "og:description",
        content: "Every application you submitted and where it stands.",
      },
    ],
  }),
  component: ApplicationsPage,
});

function ApplicationsPage() {
  const { applications } = useAppState();

  return (
    <>
      <PageHeader
        title="My applications"
        description="Every internship you applied to, with its current status."
        action={
          <Button asChild variant="outline">
            <Link to="/student/internships">Find internships</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATUSES.map((s) => (
          <StatCard
            key={s}
            label={s}
            value={applications.filter((a) => a.status === s).length}
          />
        ))}
      </div>

      {applications.length ? (
        <section className="rounded-2xl border border-border bg-card shadow-soft">
          <ul className="divide-y divide-border">
            {applications.map((a) => (
              <li
                key={a.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-5"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{a.internship}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {a.company} · Applied {a.appliedDate}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <StatusBadge status={a.status} />
                  <Button asChild size="sm" variant="ghost">
                    <Link to="/student/internships/$id" params={{ id: a.internshipId }}>
                      View
                    </Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <EmptyState
          title="No applications yet"
          description="Apply to a matching internship and it will show up here."
        />
      )}
    </>
  );
}
