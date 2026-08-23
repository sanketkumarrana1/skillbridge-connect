import { Link } from "@tanstack/react-router";
import { Clock, MapPin, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CompanyMark, SkillTag } from "@/components/skillbridge/primitives";
import { useAppState } from "@/context/app-state";
import type { Internship } from "@/types";

export function InternshipCard({ internship }: { internship: Internship }) {
  const { applyTo, hasApplied } = useAppState();
  const applied = hasApplied(internship.id);

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <CompanyMark name={internship.company} hue={internship.logoHue} />
          <div className="min-w-0">
            <h3 className="truncate font-display text-base font-semibold text-foreground">
              {internship.title}
            </h3>
            <p className="truncate text-sm text-muted-foreground">{internship.company}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold tabular-nums text-primary">
          {internship.match}% match
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {internship.requiredSkills.map((s) => (
          <SkillTag key={s} muted>
            {s}
          </SkillTag>
        ))}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-y-2 text-sm text-muted-foreground">
        <div className="flex min-w-0 items-center gap-1.5">
          <Clock className="size-4 shrink-0" />
          <span className="truncate">{internship.duration}</span>
        </div>
        <div className="flex min-w-0 items-center gap-1.5">
          <MapPin className="size-4 shrink-0" />
          <span className="truncate">{internship.location}</span>
        </div>
        <div className="flex min-w-0 items-center gap-1.5">
          <Wallet className="size-4 shrink-0" />
          <span className="truncate">{internship.stipend}</span>
        </div>
        <div className="min-w-0 truncate">{internship.type}</div>
      </dl>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
        <Button
          size="sm"
          disabled={applied}
          onClick={() => {
            if (applyTo(internship)) toast.success(`Applied to ${internship.title}`);
          }}
        >
          {applied ? "Applied" : "Apply"}
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link to="/student/internships/$id" params={{ id: internship.id }}>
            View details
          </Link>
        </Button>
      </div>
    </article>
  );
}
