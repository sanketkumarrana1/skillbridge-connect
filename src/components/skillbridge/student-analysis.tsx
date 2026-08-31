import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Code2,
  Compass,
  FileCheck,
  GraduationCap,
  Layers,
  Lightbulb,
  Play,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppState } from "@/context/app-state";
import type { SkillGapDetail, TargetRoleAnalysis } from "@/types";

const DIMENSION_META: {
  key: keyof import("@/types").ReadinessDimensionBreakdown;
  label: string;
  desc: string;
  weight: string;
}[] = [
  {
    key: "technicalSkills",
    label: "Technical Depth",
    desc: "Declared core capabilities and verified coding skill level.",
    weight: "25%",
  },
  {
    key: "assessmentPerformance",
    label: "Diagnostic Assessment",
    desc: "Demonstrated test accuracy and adaptive benchmark consistency.",
    weight: "20%",
  },
  {
    key: "problemSolving",
    label: "Problem Solving & DSA",
    desc: "Algorithmic thinking, complexity analysis, and CS fundamentals.",
    weight: "15%",
  },
  {
    key: "portfolioStrength",
    label: "Portfolio & Live Demos",
    desc: "Completed repositories, deployed URLs, and full-stack projects.",
    weight: "15%",
  },
  {
    key: "evidenceQuality",
    label: "Evidence Trail",
    desc: "Proof items, linked certifications, credentials, and pull requests.",
    weight: "10%",
  },
  {
    key: "communication",
    label: "Professional Profile",
    desc: "Profile narrative, headline quality, and technical communication.",
    weight: "5%",
  },
  {
    key: "teamwork",
    label: "Collaboration & Git",
    desc: "Version control workflows, group builds, and team experience.",
    weight: "5%",
  },
  {
    key: "leadership",
    label: "Leadership & Impact",
    desc: "Achievements, mentorship sessions, and project ownership.",
    weight: "5%",
  },
];

export function StudentSkillAnalysis() {
  const { profile, careerReadiness, targetRoleAnalyses, skillGaps, latestAssessmentResult } =
    useAppState();

  const [selectedRole, setSelectedRole] = useState<string | null>(
    targetRoleAnalyses[0]?.title ?? null,
  );

  const activeRoleAnalysis = useMemo(
    () => targetRoleAnalyses.find((r) => r.title === selectedRole) ?? targetRoleAnalyses[0],
    [targetRoleAnalyses, selectedRole],
  );

  const declaredCount = profile.declaredSkills?.length ?? 0;
  const assessedCount =
    profile.declaredSkills?.filter((s) => s.assessedScore !== undefined).length ?? 0;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Badge className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs px-3 py-1">
            <Sparkles className="size-3.5 mr-1.5" /> Stage 3 · Career Readiness & Gap Intelligence
          </Badge>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Career Readiness & Skill Gap Diagnostic
          </h1>
          <p className="mt-1.5 text-sm text-slate-400 max-w-2xl">
            Unified multi-dimensional evaluation combining declared skills, verified evidence,
            adaptive assessment signals, and target-role prerequisite models.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            asChild
            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold text-xs shadow-[0_0_20px_rgba(99,102,241,0.4)]"
          >
            <Link to="/student/roadmap">
              <Compass className="size-3.5 mr-1.5" /> Open Learning Roadmap
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-white/10 bg-slate-900/60 text-slate-300 hover:text-white text-xs"
          >
            <Link to="/student/assessment">
              <RotateCcw className="size-3.5 mr-1.5" /> Retake Test
            </Link>
          </Button>
        </div>
      </div>

      {/* 1. Multi-Dimensional Overall Readiness Dial Card */}
      <div className="rounded-3xl border border-indigo-500/40 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/60 p-6 sm:p-8 shadow-[0_0_50px_rgba(99,102,241,0.25)]">
        <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] items-center">
          {/* Left Column: Overall Score Dial */}
          <div className="flex items-center gap-5">
            <div className="relative grid size-24 place-items-center rounded-3xl border-2 border-indigo-400 bg-gradient-to-br from-indigo-600/30 to-purple-600/20 text-white shadow-[0_0_30px_rgba(99,102,241,0.4)]">
              <span className="font-display text-4xl font-black">
                {careerReadiness.overallScore}
              </span>
              <span className="text-[10px] text-indigo-300 font-semibold uppercase tracking-wider">
                out of 100
              </span>
            </div>
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Career Readiness Index
              </p>
              <h2 className="font-display text-2xl font-bold text-white mt-0.5">
                {careerReadiness.tier}
              </h2>
              <p className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1">
                <TrendingUp className="size-3.5" />
                {careerReadiness.readinessDelta
                  ? `+${careerReadiness.readinessDelta}% boost from assessment verification`
                  : "Baseline competency establishing"}
              </p>
            </div>
          </div>

          <div className="hidden md:block h-20 w-px bg-white/10" />

          {/* Right Column: Key Signal Snapshot */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <p className="text-slate-400">Declared in Passport</p>
              <p className="font-display text-lg font-bold text-white">{declaredCount} Skills</p>
              <p className="text-[11px] text-slate-500">Stage 1 Foundation</p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-400">Assessed by Test</p>
              <p className="font-display text-lg font-bold text-indigo-300">
                {assessedCount} Verified
              </p>
              <p className="text-[11px] text-indigo-400">
                {latestAssessmentResult
                  ? `${latestAssessmentResult.accuracy}% accuracy`
                  : "Pending test"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Eight Readiness Dimensions Grid */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <Layers className="size-5 text-indigo-400" />
              8-Dimension Readiness Breakdown
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Evaluated across technical mastery, problem solving, evidence quality, and soft
              skills.
            </p>
          </div>
          <Badge
            variant="outline"
            className="border-indigo-500/30 text-indigo-300 text-xs shrink-0"
          >
            Weighted Algorithm
          </Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DIMENSION_META.map((dim) => {
            const scoreVal = careerReadiness.dimensions[dim.key];
            const isHigh = scoreVal >= 75;
            const isMedium = scoreVal >= 55 && scoreVal < 75;

            return (
              <div
                key={dim.key}
                className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Weight: {dim.weight}
                    </span>
                    <span
                      className={cn(
                        "font-display text-base font-bold",
                        isHigh
                          ? "text-emerald-400"
                          : isMedium
                            ? "text-indigo-300"
                            : "text-amber-400",
                      )}
                    >
                      {scoreVal}%
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs text-white mt-1">{dim.label}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{dim.desc}</p>
                </div>

                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isHigh
                        ? "bg-emerald-500"
                        : isMedium
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                          : "bg-amber-500",
                    )}
                    style={{ width: `${scoreVal}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Target Role Match & Readiness (Sorted highest to lowest) */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <Target className="size-5 text-purple-400" />
              Target Role Compatibility Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked from highest career readiness to lowest based on your matching competencies.
            </p>
          </div>
          <span className="text-xs text-slate-400">
            {targetRoleAnalyses.length} Roles Evaluated
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {targetRoleAnalyses.map((role, idx) => {
            const isSelected = selectedRole === role.title;
            const isTopMatch = idx === 0;

            return (
              <button
                key={role.roleId}
                type="button"
                onClick={() => setSelectedRole(role.title)}
                className={cn(
                  "p-5 rounded-3xl border text-left transition-all duration-200 flex flex-col justify-between relative",
                  isSelected
                    ? "border-purple-500 bg-gradient-to-br from-purple-900/20 via-slate-900 to-slate-950 text-white shadow-[0_0_25px_rgba(168,85,247,0.3)] ring-1 ring-purple-400"
                    : "border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/20 hover:bg-slate-900/90",
                )}
              >
                {isTopMatch && (
                  <span className="absolute -top-2.5 right-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                    Top Career Match
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="outline" className="border-white/10 text-slate-400 text-[10px]">
                      {role.difficultyLevel}
                    </Badge>
                    <span className="font-display text-lg font-bold text-purple-300">
                      {role.readinessPercentage}% Readiness
                    </span>
                  </div>

                  <h4 className="font-display text-base font-bold text-white">{role.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {role.suitabilityReason}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Requirements Match:</span>
                    <span className="font-semibold text-emerald-400">{role.matchPercentage}%</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {role.matchingSkills.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 text-[10px] text-emerald-300"
                      >
                        ✓ {s}
                      </span>
                    ))}
                    {role.missingSkills.slice(0, 2).map((s) => (
                      <span
                        key={s}
                        className="rounded-md bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 text-[10px] text-amber-300"
                      >
                        + {s}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Role Detailed Diagnostic */}
        {activeRoleAnalysis && (
          <div className="rounded-3xl border border-purple-500/30 bg-slate-900/90 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-purple-300">
                  Role Gap Deep Dive
                </p>
                <h4 className="font-display text-xl font-bold text-white">
                  {activeRoleAnalysis.title}
                </h4>
              </div>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 text-xs w-fit">
                {activeRoleAnalysis.estimatedReadinessImpact}
              </Badge>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeRoleAnalysis.suitabilityReason}
            </p>

            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2">
                <p className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="size-4" /> Demonstrated Strengths (
                  {activeRoleAnalysis.matchingSkills.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {activeRoleAnalysis.matchingSkills.map((s) => (
                    <Badge
                      key={s}
                      className="border-emerald-500/40 bg-emerald-500/20 text-emerald-300 text-xs"
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2">
                <p className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="size-4" /> Missing Prerequisite Skills (
                  {activeRoleAnalysis.missingSkills.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {activeRoleAnalysis.missingSkills.map((s) => (
                    <Badge
                      key={s}
                      className="border-amber-500/40 bg-amber-500/20 text-amber-300 text-xs"
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Concrete Prioritized Skill Gaps */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="size-5 text-amber-400" />
              Prioritized Skill Gaps
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Specific missing competencies required across your target roles, with estimated
              impact.
            </p>
          </div>
          <Badge variant="outline" className="border-amber-500/30 text-amber-300 text-xs">
            {skillGaps.length} Gaps Detected
          </Badge>
        </div>

        <div className="space-y-3">
          {skillGaps.map((gap) => (
            <div
              key={gap.skillName}
              className="glass-card-interactive rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-display font-bold text-sm text-white">{gap.skillName}</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] font-semibold uppercase",
                      gap.priority === "high"
                        ? "border-rose-500/40 bg-rose-500/15 text-rose-300"
                        : gap.priority === "medium"
                          ? "border-amber-500/40 bg-amber-500/15 text-amber-300"
                          : "border-sky-500/40 bg-sky-500/15 text-sky-300",
                    )}
                  >
                    {gap.priority} Priority
                  </Badge>
                  <span className="text-[11px] text-slate-400">{gap.category}</span>
                </div>

                <p className="text-xs text-slate-300">{gap.recommendedAction}</p>

                {gap.targetRolesAffected.length > 0 && (
                  <p className="text-[11px] text-slate-400">
                    Required for:{" "}
                    <strong className="text-slate-300">{gap.targetRolesAffected.join(", ")}</strong>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Badge className="border-indigo-500/30 bg-indigo-500/15 text-indigo-300 text-xs">
                  +{gap.readinessBoost}% Readiness Boost
                </Badge>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="border-white/10 text-xs text-slate-300 hover:text-white"
                >
                  <Link to="/student/roadmap">
                    Add to Roadmap <ChevronRight className="size-3.5 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
