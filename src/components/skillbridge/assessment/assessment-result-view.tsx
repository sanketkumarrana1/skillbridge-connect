import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BarChart3,
  CheckCircle2,
  Clock,
  Compass,
  FileCheck,
  History,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  AssessmentAttempt,
  ConfidenceLevel,
  GapStatus,
  SkillAssessmentResult,
} from "@/types/assessment";
import type { SkillProficiency } from "@/types";

interface AssessmentResultViewProps {
  attempt: AssessmentAttempt;
  onRetake: () => void;
  onViewHistory: () => void;
}

const GAP_STATUS_META: Record<GapStatus, { label: string; color: string; desc: string }> = {
  Confirmed: {
    label: "Confirmed",
    color: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
    desc: "Demonstrated test performance matches or exceeds your self-declared proficiency.",
  },
  "Above Self-Assessment": {
    label: "Above Self-Declared",
    color: "border-purple-500/40 bg-purple-500/15 text-purple-300",
    desc: "Assessed competency is higher than your self-declared level.",
  },
  "Below Self-Assessment": {
    label: "Below Self-Declared",
    color: "border-amber-500/40 bg-amber-500/15 text-amber-300",
    desc: "Gap detected between self-rating and test answers. Targeted review recommended.",
  },
  "Needs More Evidence": {
    label: "Needs More Data",
    color: "border-sky-500/40 bg-sky-500/15 text-sky-300",
    desc: "Single question sample size. Further questions or projects needed for high confidence.",
  },
};

const PROFICIENCY_BADGE: Record<SkillProficiency, string> = {
  beginner: "border-sky-500/40 bg-sky-500/10 text-sky-300",
  intermediate: "border-indigo-500/40 bg-indigo-500/10 text-indigo-300",
  advanced: "border-purple-500/40 bg-purple-500/10 text-purple-300",
};

export function AssessmentResultView({
  attempt,
  onRetake,
  onViewHistory,
}: AssessmentResultViewProps) {
  const timeUsedMins = Math.floor(attempt.timeUsedSeconds / 60);
  const timeUsedSecs = attempt.timeUsedSeconds % 60;
  const formattedTime = `${timeUsedMins}m ${timeUsedSecs}s`;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs px-3 py-1">
            <CheckCircle2 className="size-3.5 mr-1.5" /> Assessment Evaluated & Stored
          </Badge>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Assessment Diagnostic Report
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Competency signals calculated from your live test submission and synchronized with your
            Skill Passport.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewHistory}
            className="border-white/10 bg-slate-900/60 text-slate-300 hover:text-white text-xs gap-1.5"
          >
            <History className="size-3.5" /> Attempt History
          </Button>
          <Button
            size="sm"
            onClick={onRetake}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold gap-1.5"
          >
            <RotateCcw className="size-3.5" /> Retake Assessment
          </Button>
        </div>
      </div>

      {/* Summary Score Card */}
      <div className="rounded-3xl border border-indigo-500/40 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/60 p-6 sm:p-8 shadow-[0_0_40px_rgba(99,102,241,0.25)]">
        <div className="grid gap-6 md:grid-cols-4 items-center">
          {/* Main Score Dial */}
          <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
            <div className="grid size-20 place-items-center rounded-2xl border-2 border-indigo-400 bg-indigo-500/20 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]">
              <span className="font-display text-3xl font-black">{attempt.overallScore}%</span>
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-slate-400">Overall Score</p>
              <p className="text-sm font-bold text-white mt-0.5">
                {attempt.overallScore >= 80
                  ? "Distinction Mastery"
                  : attempt.overallScore >= 60
                    ? "Proficient Capability"
                    : "Foundational Progress"}
              </p>
              <p className="text-[11px] text-emerald-400 mt-0.5">{attempt.accuracy}% Accuracy</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-400">Questions Answered</p>
            <p className="font-display text-xl font-bold text-white">
              {Object.keys(attempt.answers).length} / {attempt.questionCount}
            </p>
            <p className="text-[11px] text-slate-400">Completed in {formattedTime}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-400">Skills Evaluated</p>
            <p className="font-display text-xl font-bold text-indigo-300">
              {attempt.skillsAssessed.length} Core Skills
            </p>
            <p className="text-[11px] text-slate-400 capitalize">
              {attempt.mode.replace("_", " ")}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              asChild
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-md"
            >
              <Link to="/student/passport">
                <ShieldCheck className="size-3.5 mr-1.5" /> View Updated Passport
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full border-white/10 bg-slate-900/80 text-slate-300 hover:text-white text-xs"
            >
              <Link to="/student/roadmap">
                <Compass className="size-3.5 mr-1.5" /> Open Learning Path
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Comparison Statement Banner */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Sparkles className="size-4 text-indigo-400 shrink-0" />
          <span className="text-slate-300">
            <strong className="text-white">Proficiency Comparison Ledger:</strong> Comparing{" "}
            <span className="text-indigo-300 font-semibold">what you declared</span> vs{" "}
            <span className="text-purple-300 font-semibold">what your assessment demonstrated</span>
            .
          </span>
        </div>
        <Badge variant="outline" className="border-indigo-500/30 text-indigo-300 shrink-0">
          Stage 2 Assessed Baseline
        </Badge>
      </div>

      {/* Skill-by-Skill Performance Matrix */}
      <div className="space-y-4">
        <h3 className="font-display text-lg font-bold text-white">Skill Competency Breakdown</h3>

        <div className="grid gap-4 md:grid-cols-2">
          {attempt.skillResults.map((res) => {
            const gapMeta = GAP_STATUS_META[res.gapStatus] ?? GAP_STATUS_META.Confirmed;
            return (
              <div
                key={res.skillName}
                className="glass-card-interactive rounded-3xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h4 className="font-display text-base font-bold text-white">
                        {res.skillName}
                      </h4>
                      <p className="text-[11px] text-slate-400">{res.category}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn("text-[10px] font-semibold", gapMeta.color)}
                    >
                      {gapMeta.label}
                    </Badge>
                  </div>

                  {/* Level Comparison Columns */}
                  <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-slate-900/80 p-3 my-3">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500">
                        Declared Level
                      </p>
                      <Badge
                        variant="outline"
                        className={cn(
                          "mt-1 text-[10px] font-semibold capitalize",
                          PROFICIENCY_BADGE[res.selfRatedLevel],
                        )}
                      >
                        {res.selfRatedLevel}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500">
                        Assessed Level
                      </p>
                      <Badge
                        variant="outline"
                        className={cn(
                          "mt-1 text-[10px] font-semibold capitalize",
                          PROFICIENCY_BADGE[res.assessedLevel],
                        )}
                      >
                        {res.assessedLevel} ({res.score}%)
                      </Badge>
                    </div>
                  </div>

                  {/* Accuracy Bar */}
                  <div className="space-y-1 mt-3">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Test Score</span>
                      <span className="font-bold text-white">{res.score}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-pink-500"
                        style={{ width: `${res.score}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{res.evidenceSummary}</span>
                  <span className="text-slate-300">Confidence: {res.confidence}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strengths & Gaps Analysis */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass-panel rounded-3xl p-6 space-y-3">
          <h4 className="font-display font-bold text-base text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-400" /> Key Verified Strengths
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {attempt.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold mt-0.5">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-panel rounded-3xl p-6 space-y-3">
          <h4 className="font-display font-bold text-base text-amber-300 flex items-center gap-2">
            <AlertTriangle className="size-4 text-amber-400" /> Recommended Growth Areas
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {attempt.detectedGaps.length > 0 ? (
              attempt.detectedGaps.map((gap, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold mt-0.5">•</span>
                  <span>{gap}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-400 italic">
                No significant gaps detected! Your declared skills align well with test performance.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
