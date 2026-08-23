import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/skillbridge/primitives";
import { assessmentQuestions } from "@/data/mock";
import { useAppState } from "@/context/app-state";
import { cn } from "@/lib/utils";
import { SKILL_LEVELS, type SkillLevel } from "@/types";

export const Route = createFileRoute("/student/assessment")({
  head: () => ({
    meta: [
      { title: "Skill Assessment — SkillBridge" },
      {
        name: "description",
        content:
          "Rate yourself across ten core engineering skills from Beginner to Expert and generate an AI skill analysis.",
      },
      { property: "og:title", content: "Skill Assessment — SkillBridge" },
      {
        property: "og:description",
        content: "A ten-question self-assessment that powers your career readiness score.",
      },
    ],
  }),
  component: AssessmentPage,
});

function AssessmentPage() {
  const { answers, setAnswer, resetAnswers } = useAppState();
  const navigate = useNavigate();
  const total = assessmentQuestions.length;
  const done = Object.keys(answers).length;
  const complete = done === total;

  return (
    <>
      <PageHeader
        title="Skill Assessment"
        description="Ten questions. Rate your current level honestly — the analysis is only as good as the input."
        action={
          done > 0 ? (
            <Button variant="outline" onClick={resetAnswers}>
              <RotateCcw className="size-4" /> Reset
            </Button>
          ) : undefined
        }
      />

      <div className="sticky top-16 z-10 rounded-2xl border border-border bg-card p-4 shadow-soft">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <p className="min-w-0 truncate text-sm font-medium text-foreground">
            {done} of {total} answered
          </p>
          <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
            {Math.round((done / total) * 100)}%
          </span>
        </div>
        <Progress value={(done / total) * 100} className="mt-3 h-2" />
      </div>

      <div className="space-y-4">
        {assessmentQuestions.map((q, idx) => (
          <article key={q.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Q{idx + 1} · {q.category}
                </p>
                <h3 className="mt-1.5 font-display text-base font-semibold text-foreground">
                  {q.skill}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{q.prompt}</p>
              </div>
              {answers[q.id] ? (
                <CheckCircle2 className="size-5 shrink-0 text-success" />
              ) : null}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {SKILL_LEVELS.map((level: SkillLevel) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setAnswer(q.id, level)}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
                    answers[q.id] === level
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
        <p className="text-sm text-muted-foreground">
          {complete
            ? "All questions answered. Generate your analysis."
            : `Answer all ${total} questions to unlock your analysis.`}
        </p>
        <Button
          size="lg"
          className="mt-4 gap-2"
          disabled={!complete}
          onClick={() => {
            toast.success("Skill analysis generated");
            navigate({ to: "/student/analysis" });
          }}
        >
          <Sparkles className="size-4" /> Analyze My Skills
        </Button>
      </div>
    </>
  );
}
