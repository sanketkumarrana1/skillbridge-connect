import { Link, useNavigate } from "@tanstack/react-router";
import { Bookmark, BookmarkX, Clock, MapPin, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CompanyMark, SkillTag, StatusBadge } from "@/components/skillbridge/primitives";
import { useAppState } from "@/context/app-state";
import type { Internship } from "@/types";

export function InternshipCard({ internship }: { internship: Internship }) {
  const navigate = useNavigate();
  const {
    saveInternship,
    unsaveInternship,
    isInternshipSaved,
    applyToInternship,
    advanceApplication,
    hasApplied,
    applications,
  } = useAppState();

  const applied = hasApplied(internship.id);
  const saved = isInternshipSaved(internship.id);
  const application = applications.find((a) => a.internshipId === internship.id);

  const handleApply = () => {
    const added = applyToInternship(internship.id);
    if (added) {
      toast.success(`Applied to ${internship.title}`);
    } else if (applied) {
      toast.info("You have already applied to this internship");
    }
  };

  const handleToggleSave = () => {
    if (saved) {
      unsaveInternship(internship.id);
      toast.success(`Removed ${internship.title} from saved`);
    } else {
      saveInternship(internship.id);
      toast.success(`Saved ${internship.title}`);
    }
  };

  const handleAdvance = () => {
    if (application) {
      advanceApplication(application.id);
      toast.success(`Application status advanced for ${internship.title}`);
    }
  };

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <CompanyMark
            name={internship.company}
            hue={internship.companyLogoHue ?? internship.logoHue}
          />
          <div className="min-w-0">
            <h3 className="truncate font-display text-base font-semibold text-foreground">
              {internship.title}
            </h3>
            <p className="truncate text-sm text-muted-foreground">{internship.company}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold tabular-nums text-primary">
            {internship.match}% match
          </span>
          {application && <StatusBadge status={application.status} />}
        </div>
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
        <div className="min-w-0">
          <Badge variant="outline" className="rounded-full text-xs">
            {internship.type}
          </Badge>
        </div>
      </dl>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
        {!applied ? (
          <Button size="sm" onClick={handleApply}>
            Apply
          </Button>
        ) : (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate({ to: "/student/applications" })}
            >
              View Application
            </Button>
            {application &&
              application.status !== "Selected" &&
              application.status !== "Rejected" && (
                <Button size="sm" variant="secondary" onClick={handleAdvance}>
                  Advance Status
                </Button>
              )}
          </>
        )}
        <Button
          size="icon"
          variant="ghost"
          onClick={handleToggleSave}
          aria-label={saved ? "Unsave internship" : "Save internship"}
        >
          {saved ? <BookmarkX className="size-4" /> : <Bookmark className="size-4" />}
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link to="/student/internships">View details</Link>
        </Button>
      </div>
    </article>
  );
}
