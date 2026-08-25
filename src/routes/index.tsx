import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/skillbridge/portal";

export const Route = createFileRoute("/")({ component: LandingPage });
/* import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  Briefcase,
  Building2,
  GraduationCap,
  Radar,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/skillbridge/dashboard-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VedaaX — Bridge Campus Skills to Industry Roles" },
      {
        name: "description",
        content:
          "VedaaX maps verified student skills to live internship requirements, so colleges and companies hire on evidence instead of resumes.",
      },
      { property: "og:title", content: "VedaaX — Bridge Campus Skills to Industry Roles" },
      {
        property: "og:description",
        content:
          "Skill mapping, AI recommendations and internship matching for students and industry teams.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Target,
    title: "Skill Mapping",
    body: "Every student skill is scored and mapped against the exact requirements companies publish — no guesswork, no keyword stuffing.",
  },
  {
    icon: Brain,
    title: "AI Recommendations",
    body: "A readiness engine highlights strong areas, moderate areas and gaps, then recommends what to learn next and why it matters.",
  },
  {
    icon: Briefcase,
    title: "Internships",
    body: "Curated internship listings with a transparent match percentage and a plain explanation of why each role fits.",
  },
  {
    icon: Radar,
    title: "Industry Talent Matching",
    body: "Hiring teams see ranked candidates with skill overlap and skill gaps side by side, and shortlist in one click.",
  },
];

const steps = [
  { n: "01", t: "Build your skill profile", d: "Add projects, certifications and interests, then take a 10-question assessment." },
  { n: "02", t: "Get analysed", d: "VedaaX scores career readiness and surfaces the gaps holding your matches back." },
  { n: "03", t: "Match and apply", d: "Apply to internships ranked by real skill overlap and track every application." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
          <BrandMark />
          <div className="flex shrink-0 items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/student">Open demo</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(60% 55% at 15% 0%, oklch(0.9 0.08 265 / 0.7), transparent 70%), radial-gradient(45% 45% at 90% 10%, oklch(0.9 0.08 300 / 0.6), transparent 70%)",
            }}
          />
          <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <GraduationCap className="size-3.5" /> Academia × Industry
                </span>
                <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Campus skills, matched to real industry roles.
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Colleges produce capable students; companies struggle to find them. VedaaX
                  sits between the two — it turns coursework, projects and assessments into a
                  measurable skill profile, then matches that profile against live internship
                  requirements from industry partners.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" className="gap-2">
                    <Link to="/student">
                      Find Opportunities <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link to="/industry">
                      <Building2 className="size-4" /> For Industry
                    </Link>
                  </Button>
                </div>
                <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-6">
                  {[
                    ["120+", "Partner companies"],
                    ["18k", "Mapped student skills"],
                    ["94%", "Top match accuracy"],
                  ].map(([v, l]) => (
                    <div key={l} className="min-w-0">
                      <dt className="font-display text-2xl font-semibold text-foreground">{v}</dt>
                      <dd className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{l}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="min-w-0 rounded-3xl border border-border bg-card p-6 shadow-lift">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Live match preview
                </p>
                <div className="mt-4 space-y-3">
                  {[
                    ["Frontend Engineering Intern", "Nexora Labs", 94],
                    ["Product Engineering Intern", "BrightPath EdTech", 88],
                    ["Machine Learning Intern", "Quantile AI", 81],
                  ].map(([title, company, match]) => (
                    <div
                      key={title as string}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-border bg-background p-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{title}</p>
                        <p className="truncate text-xs text-muted-foreground">{company}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold tabular-nums text-primary">
                        {match}% match
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-2xl bg-muted p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Why the top match works
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    React and TypeScript scores sit in the role's top band, and one project mirrors
                    the team's dashboard work. Only gap: automated testing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            What the platform does
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Four capabilities, built for both sides of the bridge.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, body }) => (
              <article
                key={title}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-card">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              How it works
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {steps.map((s) => (
                <div key={s.n} className="min-w-0">
                  <span className="font-display text-sm font-semibold text-primary">{s.n}</span>
                  <h3 className="mt-2 font-display text-lg font-semibold text-foreground">{s.t}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-6 rounded-3xl border border-border bg-primary p-8 text-primary-foreground sm:p-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="min-w-0">
              <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                Ready to see your matches?
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed opacity-90 sm:text-base">
                Use the demo accounts to explore both the student journey and the industry hiring
                pipeline — no signup required.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" variant="secondary">
                <Link to="/login">Student login</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to="/industry">Industry portal</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6">
          <BrandMark />
          <p className="text-xs text-muted-foreground">
            © 2026 VedaaX · Academia–Industry Collaboration Portal
          </p>
        </div>
      </footer>
    </div>
  );
} */
