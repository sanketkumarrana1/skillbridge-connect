import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Clock, MapPin, Sparkles, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CompanyMark, EmptyState, MatchRing, SkillTag } from "@/components/skillbridge/primitives";
import { useAppState } from "@/context/app-state";

export const Route = createFileRoute("/student/internships/$id")({
  head: () => ({
    meta: [
      { title: "Internship Details — AcadIn" },
      {
        name: "description",
        content:
          "Full internship description, required skills, eligibility and why this role matches your skill profile.",
      },
      { property: "og:title", content: "Internship Details — AcadIn" },
      {
        property: "og:description",
        content: "Role details, requirements and your personalised match reasoning.",
      },
    ],
  }),
  notFoundComponent: () => (
    <EmptyState
      title="Internship not found"
      description="This role is no longer listed. Head back to your matches to find another one."
    />
  ),
  component: InternshipDetail,
});

function InternshipDetail() {
  const { id } = Route.useParams();
  const { internships, applyTo, hasApplied } = useAppState();
  const internship = internships.find((i) => i.id === id);

  if (!internship) throw notFound();
  const applied = hasApplied(internship.id);

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="w-fit gap-2 px-2">
        <Link to="/student/internships">
          <ArrowLeft className="size-4" /> Back to internships
        </Link>
      </Button>

      <section className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="flex min-w-0 items-start gap-4">
            <CompanyMark name={internship.company} hue={internship.logoHue} />
            <div className="min-w-0">
              <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                {internship.title}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {internship.company} · Posted {internship.posted}
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4" /> {internship.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4" /> {internship.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Wallet className="size-4" /> {internship.stipend}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-4" /> {internship.type}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 lg:flex-col">
            <MatchRing value={internship.match} size={104} />
            <Button
              disabled={applied}
              onClick={() => {
                if (applyTo(internship)) toast.success(`Applied to ${internship.title}`);
              }}
            >
              {applied ? "Applied" : "Apply now"}
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <section className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-lg font-semibold text-foreground">About the role</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {internship.description}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-lg font-semibold text-foreground">Required skills</h2>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {internship.requiredSkills.map((s) => (
                <SkillTag key={s} muted>
                  {s}
                </SkillTag>
              ))}
            </div>
            <h3 className="mt-6 text-sm font-semibold text-foreground">Eligibility</h3>
            <p className="mt-1 text-sm text-muted-foreground">{internship.eligibility}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
            <Sparkles className="size-4 text-primary" /> Why you match
          </h2>
          <ul className="mt-4 space-y-3">
            {internship.reasons.map((r) => (
              <li key={r} className="text-sm leading-relaxed text-muted-foreground">
                {r}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
