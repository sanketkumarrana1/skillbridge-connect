import { createFileRoute } from "@tanstack/react-router";
import { PortalPage } from "@/components/skillbridge/portal";

export const Route = createFileRoute("/student/analysis")({
  component: () => <PortalPage role="student" section="analysis" />,
});
/* import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, CircleCheck, Lightbulb, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MatchRing, PageHeader, SkillBar, SkillTag } from "@/components/skillbridge/primitives";
import { recommendedSkills } from "@/data/mock";
import { useAppState } from "@/context/app-state";
import { SKILL_LEVELS } from "@/types";

export const Route = createFileRoute("/student/analysis")({
  head: () => ({
    meta: [
      { title: "AI Skill Analysis — VedaaX" },
      {
        name: "description",
        content:
          "Career readiness score, strong skills, moderate skills, gaps and recommended skills to learn with reasoning.",
      },
      { property: "og:title", content: "AI Skill Analysis — VedaaX" },
      {
        property: "og:description",
        content: "Where you are strong, where you are short, and what to learn next.",
      },
    ],
  }),
  component: AnalysisPage,
});

function AnalysisPage() {
  const { profile, answers } = useAppState();

  const answered = Object.keys(answers).length;
  const boost =
    answered === 0
      ? 0
      : Math.round(
          Object.values(answers).reduce((s, l) => s + SKILL_LEVELS.indexOf(l) * 2, 0) / answered,
        );

  const readiness = Math.min(
    98,
    Math.round(profile.skills.reduce((s, x) => s + x.score, 0) / profile.skills.length) + boost,
  );

  const strong = profile.skills.filter((s) => s.score >= 75);
  const moderate = profile.skills.filter((s) => s.score >= 55 && s.score < 75);
  const gaps = profile.skills.filter((s) => s.score < 55);

  return (
    <>
      <PageHeader
        title="AI Skill Analysis"
        description={
          answered > 0
            ? `Generated from your profile and ${answered} assessment responses.`
            : "Generated from your profile. Take the assessment for a sharper result."
        }
        action={
          <Button asChild variant="outline">
            <Link to="/student/assessment">Retake assessment</Link>
          </Button>
        }
      />

      <section className="grid gap-6 rounded-3xl border border-border bg-card p-6 shadow-soft lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
        <div className="flex items-center gap-5">
          <MatchRing value={readiness} size={132} />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Career readiness
            </p>
            <p className="mt-1 font-display text-2xl font-semibold text-foreground">
              {readiness >= 80 ? "Industry ready" : readiness >= 65 ? "Nearly ready" : "Building up"}
            </p>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground lg:border-l lg:border-border lg:pl-6">
          Your profile clusters strongly around frontend and applied Python work. Across the roles
          in your feed, you clear the bar on {strong.length} of {profile.skills.length} assessed
          skills. The largest single lever on your match percentage is system design, which appears
          as a screening topic in four of six recommended internships.
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          {
            title: "Strong skills",
            icon: CircleCheck,
            tone: "text-success",
            items: strong,
            note: "Lead with these in interviews.",
          },
          {
            title: "Moderate skills",
            icon: TrendingUp,
            tone: "text-accent",
            items: moderate,
            note: "Close to role-ready with practice.",
          },
          {
            title: "Skill gaps",
            icon: AlertTriangle,
            tone: "text-warning",
            items: gaps,
            note: "These lower your match percentage.",
          },
        ].map(({ title, icon: Icon, tone, items, note }) => (
          <section key={title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
              <Icon className={`size-4 ${tone}`} /> {title}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">{note}</p>
            <div className="mt-5 space-y-4">
              {items.length ? (
                items.map((s) => <SkillBar key={s.name} name={s.name} score={s.score} />)
              ) : (
                <p className="text-sm text-muted-foreground">Nothing in this band.</p>
              )}
            </div>
          </section>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
          <Lightbulb className="size-4 text-primary" /> Recommended skills to learn
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {recommendedSkills.map((r) => (
            <article key={r.skill} className="rounded-2xl border border-border bg-background p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <h3 className="min-w-0 font-display text-base font-semibold text-foreground">
                  {r.skill}
                </h3>
                <SkillTag>{r.impact}</SkillTag>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.reason}</p>
            </article>
          ))}
        </div>
        <Button asChild className="mt-6 gap-2">
          <Link to="/student/internships">
            See matching internships <ArrowRight className="size-4" />
          </Link>
        </Button>
      </section>
    </>
  );
} */
