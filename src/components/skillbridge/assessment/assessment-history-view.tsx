import {
  ArrowLeft,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  History,
  Layers,
  Play,
  RotateCcw,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppState } from "@/context/app-state";
import type { AssessmentAttempt } from "@/types/assessment";

interface AssessmentHistoryViewProps {
  onSelectAttempt: (attempt: AssessmentAttempt) => void;
  onNewAssessment: () => void;
}

export function AssessmentHistoryView({
  onSelectAttempt,
  onNewAssessment,
}: AssessmentHistoryViewProps) {
  const { assessmentAttempts, clearAssessmentHistory } = useAppState();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Badge className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs px-3 py-1">
            <History className="size-3.5 mr-1.5" /> Assessment Attempts History
          </Badge>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Past Assessment Records
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Chronological audit log of all completed skill assessments and diagnostic tests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={onNewAssessment}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs shadow-md"
          >
            <Play className="size-3.5 mr-1.5 fill-current" /> Start New Assessment
          </Button>
          {assessmentAttempts.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAssessmentHistory}
              className="border-white/10 text-slate-400 hover:text-rose-400 text-xs"
            >
              <Trash2 className="size-3.5 mr-1" /> Clear
            </Button>
          )}
        </div>
      </div>

      {assessmentAttempts.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-4">
          <History className="mx-auto size-12 text-slate-500" />
          <h3 className="font-display text-lg font-bold text-white">No Past Assessment Attempts</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Take your first adaptive skill assessment to establish measured competency scores across
            your declared skills.
          </p>
          <Button
            onClick={onNewAssessment}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs"
          >
            <Play className="size-3.5 mr-1.5 fill-current" /> Launch First Assessment
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {assessmentAttempts.map((att, idx) => {
            const dateStr = new Date(att.completedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
            const isLatest = idx === 0;
            const previousAttempt = assessmentAttempts[idx + 1];
            const scoreDelta = previousAttempt
              ? att.overallScore - previousAttempt.overallScore
              : null;

            // Approximate readiness at that attempt
            const attemptReadiness = Math.min(
              100,
              Math.round(att.overallScore * 0.75 + att.accuracy * 0.25),
            );

            return (
              <div
                key={att.id}
                className="glass-card-interactive rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-bold text-base text-white">
                      Attempt #{assessmentAttempts.length - idx}
                    </span>
                    {isLatest && (
                      <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/40 text-[10px]">
                        Latest Result
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className="border-white/10 text-slate-400 text-[10px] capitalize"
                    >
                      {att.mode.replace("_", " ")}
                    </Badge>
                    {scoreDelta !== null ? (
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] font-bold",
                          scoreDelta >= 0
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                            : "border-rose-500/40 bg-rose-500/10 text-rose-300",
                        )}
                      >
                        {scoreDelta >= 0 ? `+${scoreDelta}%` : `${scoreDelta}%`} vs previous
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-slate-700 bg-slate-800 text-slate-400 text-[10px]"
                      >
                        Baseline Attempt
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5" /> {dateStr}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" /> {Math.floor(att.timeUsedSeconds / 60)}m{" "}
                      {att.timeUsedSeconds % 60}s duration
                    </span>
                    <span>{att.questionCount} Questions</span>
                    <span className="text-indigo-300 font-semibold">
                      Readiness: {attemptReadiness}%
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {att.skillsAssessed.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="border-slate-800 bg-slate-900/80 text-slate-300 text-[10px]"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right">
                    <p className="font-display text-2xl font-bold text-indigo-300">
                      {att.overallScore}%
                    </p>
                    <p className="text-[11px] text-emerald-400 font-semibold">
                      {att.accuracy}% Accuracy
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSelectAttempt(att)}
                    className="border-white/10 bg-slate-900/60 text-slate-300 hover:text-white text-xs gap-1.5"
                  >
                    View Report <ExternalLink className="size-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
