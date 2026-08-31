import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  GraduationCap,
  Layers,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppState } from "@/context/app-state";

export function StudentLearningRoadmap() {
  const {
    dynamicRoadmapItems,
    updateRoadmapProgress,
    toggleRoadmapModule,
    completeRoadmapItem,
    careerReadiness,
  } = useAppState();

  const totalItems = dynamicRoadmapItems.length;
  const completedItems = dynamicRoadmapItems.filter((i) => i.status === "completed").length;
  const inProgressItems = dynamicRoadmapItems.filter((i) => i.status === "in_progress").length;
  const overallProgress =
    totalItems > 0
      ? Math.round(dynamicRoadmapItems.reduce((acc, i) => acc + i.progress, 0) / totalItems)
      : 0;

  const handleStart = (id: string, skillName: string) => {
    updateRoadmapProgress(id, 33);
    toast.success(`Started learning path for ${skillName}.`);
  };

  const handleContinue = (id: string, currentProgress: number, skillName: string) => {
    const nextProg = Math.min(100, currentProgress + 33);
    updateRoadmapProgress(id, nextProg);
    if (nextProg >= 100) {
      toast.success(`Milestone completed for ${skillName}! Career Readiness boosted.`);
    } else {
      toast.info(`Progress updated for ${skillName} (${nextProg}%).`);
    }
  };

  const handleComplete = (id: string, skillName: string) => {
    completeRoadmapItem(id);
    toast.success(`Congratulations! Mastered ${skillName}. Career Readiness score updated!`);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Badge className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs px-3 py-1">
            <Compass className="size-3.5 mr-1.5" /> Stage 3 · Dynamic Learning Roadmap
          </Badge>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Personalized Skill Gap Roadmap
          </h1>
          <p className="mt-1.5 text-sm text-slate-400 max-w-2xl">
            Targeted learning paths dynamically derived from missing competencies in your target
            career roles. Advancing milestones boosts your live Career Readiness score.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            className="border-white/10 bg-slate-900/60 text-slate-300 hover:text-white text-xs"
          >
            <Link to="/student/analysis">
              <Target className="size-3.5 mr-1.5" /> View Skill Gaps
            </Link>
          </Button>
          <Button
            asChild
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
          >
            <Link to="/student/passport">
              <ShieldCheck className="size-3.5 mr-1.5" /> Skill Passport
            </Link>
          </Button>
        </div>
      </div>

      {/* Roadmap Summary Card */}
      <div className="rounded-3xl border border-indigo-500/40 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/60 p-6 sm:p-8 shadow-[0_0_40px_rgba(99,102,241,0.2)]">
        <div className="grid gap-6 md:grid-cols-4 items-center">
          <div className="space-y-1 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Overall Roadmap
            </p>
            <p className="font-display text-3xl font-black text-white">{overallProgress}%</p>
            <p className="text-[11px] text-indigo-300">
              {completedItems} of {totalItems} Milestones Completed
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-400">In Progress</p>
            <p className="font-display text-xl font-bold text-amber-400">
              {inProgressItems} Active
            </p>
            <p className="text-[11px] text-slate-500">Incremental modules</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-400">Live Career Readiness</p>
            <p className="font-display text-xl font-bold text-emerald-400">
              {careerReadiness.overallScore}/100
            </p>
            <p className="text-[11px] text-emerald-300 flex items-center gap-1">
              <TrendingUp className="size-3" /> Real-time reactivity enabled
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Badge
              variant="outline"
              className="border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-xs py-1.5 justify-center"
            >
              <Zap className="size-3.5 mr-1" /> +{completedItems * 3}% Score Impact Active
            </Badge>
          </div>
        </div>
      </div>

      {/* Dynamic Milestones List */}
      {dynamicRoadmapItems.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-4">
          <CheckCircle2 className="mx-auto size-12 text-emerald-400" />
          <h3 className="font-display text-lg font-bold text-white">No Skill Gaps Detected</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Your declared and assessed skills fully align with your current target roles. Add new
            target career trajectories in Profile Settings to unlock advanced learning tracks.
          </p>
          <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs">
            <Link to="/student/settings">Update Career Target Roles</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {dynamicRoadmapItems.map((item, idx) => {
            const isCompleted = item.status === "completed";
            const isInProgress = item.status === "in_progress";

            return (
              <div
                key={item.id}
                className={cn(
                  "glass-card-interactive rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300",
                  isCompleted
                    ? "border-emerald-500/40 bg-emerald-950/10"
                    : isInProgress
                      ? "border-indigo-500/40 bg-indigo-950/10"
                      : "border-white/10",
                )}
              >
                <div className="space-y-4">
                  {/* Item Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "grid size-10 place-items-center rounded-2xl border text-sm font-bold shrink-0",
                          isCompleted
                            ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                            : isInProgress
                              ? "border-indigo-500 bg-indigo-500/20 text-indigo-300"
                              : "border-white/10 bg-slate-900 text-slate-400",
                        )}
                      >
                        {isCompleted ? <Check className="size-5" /> : idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-display text-lg font-bold text-white">
                            {item.skillName}
                          </h3>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] font-semibold",
                              isCompleted
                                ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-300"
                                : isInProgress
                                  ? "border-indigo-500/40 bg-indigo-500/20 text-indigo-300"
                                  : "border-slate-700 bg-slate-800 text-slate-400",
                            )}
                          >
                            {isCompleted
                              ? "Completed"
                              : isInProgress
                                ? "In Progress"
                                : "Not Started"}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="border-white/10 bg-slate-900 text-slate-400 text-[10px]"
                          >
                            {item.difficulty}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{item.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5 text-slate-500" /> {item.estimatedDuration}
                      </span>
                      <span className="font-bold text-indigo-300">
                        +{item.readinessImpact}% Readiness
                      </span>
                    </div>
                  </div>

                  {/* Why it matters */}
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 rounded-2xl p-3 border border-white/5">
                    <strong className="text-white">Why it matters:</strong> {item.whyItMatters}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Milestone Progress</span>
                      <span className="font-bold text-white">{item.progress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-300",
                          isCompleted
                            ? "bg-emerald-400"
                            : "bg-gradient-to-r from-indigo-500 to-purple-500",
                        )}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Interactive Sub-Modules Checklist */}
                  <div className="space-y-2 pt-1">
                    <p className="text-[11px] uppercase font-bold text-slate-400">
                      Core Learning Modules ({item.modules.filter((m) => m.completed).length}/
                      {item.modules.length})
                    </p>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {item.modules.map((mod) => (
                        <button
                          key={mod.id}
                          type="button"
                          onClick={() => toggleRoadmapModule(item.id, mod.id)}
                          className={cn(
                            "p-3 rounded-2xl border text-left text-xs transition flex items-start gap-2.5",
                            mod.completed
                              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                              : "border-white/10 bg-slate-900/80 text-slate-400 hover:border-white/20 hover:text-white",
                          )}
                        >
                          <span
                            className={cn(
                              "grid size-4 place-items-center rounded border text-[10px] shrink-0 mt-0.5",
                              mod.completed
                                ? "border-emerald-400 bg-emerald-500 text-white font-bold"
                                : "border-white/20 bg-slate-800",
                            )}
                          >
                            {mod.completed && <Check className="size-3" />}
                          </span>
                          <span className="leading-snug text-[11px]">{mod.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Controls */}
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-3 flex-wrap">
                  <span className="text-[11px] text-slate-400">
                    Associated Target Roles:{" "}
                    <strong className="text-slate-300">
                      {item.associatedTargetRoles.join(", ") || "General Engineering"}
                    </strong>
                  </span>

                  <div className="flex items-center gap-2">
                    {!isCompleted && !isInProgress && (
                      <Button
                        size="sm"
                        onClick={() => handleStart(item.id, item.skillName)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                      >
                        <Play className="size-3.5 mr-1 fill-current" /> Start Learning
                      </Button>
                    )}

                    {isInProgress && (
                      <Button
                        size="sm"
                        onClick={() => handleContinue(item.id, item.progress, item.skillName)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                      >
                        <ArrowRight className="size-3.5 mr-1" /> Continue Next Module
                      </Button>
                    )}

                    {!isCompleted && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleComplete(item.id, item.skillName)}
                        className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 text-xs"
                      >
                        <CheckCircle2 className="size-3.5 mr-1" /> Mark Complete
                      </Button>
                    )}

                    {isCompleted && (
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs py-1">
                        <CheckCircle2 className="size-3.5 mr-1" /> Skill Gap Closed
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
