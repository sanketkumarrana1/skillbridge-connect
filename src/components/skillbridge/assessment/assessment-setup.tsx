import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Compass,
  FileCheck,
  GraduationCap,
  HelpCircle,
  Layers,
  Play,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppState } from "@/context/app-state";
import { useAuth } from "@/context/auth-context";
import { AssessmentService } from "@/services/assessment-service";
import { assessmentGenerator } from "@/services/assessment/mock-generator";
import type { AssessmentMode, AssessmentQuestion, AssessmentSetupConfig } from "@/types/assessment";

interface AssessmentSetupProps {
  onStartAssessment: (questions: AssessmentQuestion[], config: AssessmentSetupConfig) => void;
}

const QUESTION_COUNT_OPTIONS: {
  count: 10 | 20 | 30;
  timeMins: number;
  label: string;
  desc: string;
}[] = [
  {
    count: 10,
    timeMins: 10,
    label: "Quick Check",
    desc: "10 core questions · 10 minutes limit · Ideal for rapid pulse validation.",
  },
  {
    count: 20,
    timeMins: 15,
    label: "Standard Readiness",
    desc: "20 multi-skill questions · 15 minutes limit · Recommended for comprehensive profile signal.",
  },
  {
    count: 30,
    timeMins: 25,
    label: "Deep Verification",
    desc: "30 adaptive questions · 25 minutes limit · Rigorous multi-domain depth assessment.",
  },
];

const MODES: { id: AssessmentMode; title: string; desc: string; icon: typeof ShieldCheck }[] = [
  {
    id: "skill_verification",
    title: "Skill Verification",
    desc: "Focuses strictly on verifying the specific technical proficiencies declared in your profile.",
    icon: ShieldCheck,
  },
  {
    id: "career_readiness",
    title: "Career Readiness",
    desc: "Combines your declared skills with target-role prerequisites and core engineering problem solving.",
    icon: Target,
  },
  {
    id: "comprehensive",
    title: "Comprehensive Audit",
    desc: "Full-spectrum evaluation spanning declared skills, algorithms, architecture, and cloud tools.",
    icon: Layers,
  },
];

export function AssessmentSetup({ onStartAssessment }: AssessmentSetupProps) {
  const { profile } = useAppState();
  const { user } = useAuth();
  const [isLaunching, setIsLaunching] = useState(false);

  const declaredSkills = useMemo(() => profile.declaredSkills ?? [], [profile.declaredSkills]);
  const targetRoles = profile.careerPreferences?.targetRoles ?? [
    "Full Stack Developer",
    "Frontend Developer",
  ];

  const [questionCount, setQuestionCount] = useState<10 | 20 | 30>(20);
  const [selectedMode, setSelectedMode] = useState<AssessmentMode>("skill_verification");
  const [selectedSkillNames, setSelectedSkillNames] = useState<string[]>(() =>
    declaredSkills.map((s) => s.name),
  );

  const selectedCountConfig =
    QUESTION_COUNT_OPTIONS.find((opt) => opt.count === questionCount) ?? QUESTION_COUNT_OPTIONS[1]!;

  const handleToggleSkillFilter = (skillName: string) => {
    setSelectedSkillNames((prev) =>
      prev.includes(skillName)
        ? prev.length > 1
          ? prev.filter((s) => s !== skillName)
          : prev
        : [...prev, skillName],
    );
  };

  const handleLaunch = async () => {
    if (declaredSkills.length === 0) {
      toast.error("Please declare skills in your profile before starting an assessment.");
      return;
    }

    const config: AssessmentSetupConfig = {
      questionCount,
      mode: selectedMode,
      timeLimitMinutes: selectedCountConfig.timeMins,
      selectedSkillNames,
      targetRoles,
    };

    setIsLaunching(true);
    try {
      const studentId = user?.id || profile.email || "student";
      const { questions } = await AssessmentService.createAssessment(studentId, config, profile);

      if (questions.length === 0) {
        toast.error("Unable to generate questions. Please ensure your profile has declared skills.");
        return;
      }

      toast.success(`Personalized assessment ready with ${questions.length} questions.`);
      onStartAssessment(questions, config);
    } catch (err) {
      console.error("Launch assessment error:", err);
      const fallbackQuestions = assessmentGenerator.generateAssessment(profile, config);
      onStartAssessment(fallbackQuestions, config);
    } finally {
      setIsLaunching(false);
    }
  };

  // Edge case: No skills declared yet
  if (declaredSkills.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6">
        <div className="mx-auto grid size-16 place-items-center rounded-3xl border border-amber-500/30 bg-amber-500/15 text-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
          <ShieldAlert className="size-8" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Skill Declaration Required</h2>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            AcadIn assesses your genuine competency based on your declared technical skills and
            target career trajectory. You haven't declared any skills in your profile yet.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            asChild
            className="bg-gradient-to-r from-indigo-600 to-purple-600 font-bold text-white shadow-lg"
          >
            <Link to="/student/onboarding">
              <Sparkles className="size-4 mr-1.5" /> Complete Skill Onboarding
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-white/10 text-slate-300">
            <Link to="/student/passport">
              <ShieldCheck className="size-4 mr-1.5" /> Go to Skill Passport
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <Badge className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs px-3 py-1">
          <Sparkles className="size-3.5 mr-1.5" /> Stage 2 · Adaptive Assessment Engine
        </Badge>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Adaptive Skill Assessment Setup
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Personalized questions tailored to your declared skills, testing your genuine capability
          against self-reported proficiencies.
        </p>
      </div>

      {/* Info Notice Card */}
      <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 p-6 shadow-[0_0_30px_rgba(99,102,241,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
            <Target className="size-4" /> Personalization Blueprint
          </p>
          <p className="text-sm font-semibold text-white">
            {profile.name} · {profile.academicProfile?.degree || profile.degree} in{" "}
            {profile.academicProfile?.program || profile.branch}
          </p>
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-xs text-slate-400">Target Roles:</span>
            {targetRoles.map((role) => (
              <Badge
                key={role}
                className="border-purple-500/40 bg-purple-500/15 text-purple-300 text-[11px] py-0.5"
              >
                {role}
              </Badge>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-2.5 text-center shrink-0">
          <p className="text-[10px] uppercase font-bold text-slate-400">Declared Skills</p>
          <p className="text-lg font-bold text-white mt-0.5">{declaredSkills.length} in Passport</p>
        </div>
      </div>

      {/* 1. Skill Selection Grid */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-white">
              1. Skills Included in This Assessment
            </h3>
            <p className="text-xs text-slate-400">
              Click to include or exclude specific declared skills from this test run.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              setSelectedSkillNames(
                selectedSkillNames.length === declaredSkills.length
                  ? [declaredSkills[0]!.name]
                  : declaredSkills.map((s) => s.name),
              )
            }
            className="text-xs text-indigo-400 hover:text-indigo-300"
          >
            {selectedSkillNames.length === declaredSkills.length ? "Select Minimum" : "Select All"}
          </Button>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {declaredSkills.map((s) => {
            const isIncluded = selectedSkillNames.includes(s.name);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleToggleSkillFilter(s.name)}
                className={cn(
                  "p-3 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between",
                  isIncluded
                    ? "border-indigo-500 bg-indigo-500/15 text-white shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                    : "border-white/10 bg-slate-900/50 text-slate-500 hover:border-white/20 hover:text-slate-400",
                )}
              >
                <div>
                  <p className="font-bold text-xs text-white truncate">{s.name}</p>
                  <p className="text-[10px] text-slate-400 capitalize">
                    Self-Rated: {s.proficiency} ({s.proficiencyLevel}%)
                  </p>
                </div>
                <span
                  className={cn(
                    "grid size-6 place-items-center rounded-lg border text-xs shrink-0",
                    isIncluded
                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                      : "border-white/10 bg-slate-800 text-slate-500",
                  )}
                >
                  {isIncluded ? <Check className="size-3.5" /> : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Assessment Mode Selection */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 space-y-4">
        <h3 className="font-display text-base font-bold text-white">2. Select Assessment Mode</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {MODES.map((m) => {
            const isSelected = selectedMode === m.id;
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMode(m.id)}
                className={cn(
                  "p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between",
                  isSelected
                    ? "border-purple-500 bg-purple-500/15 text-white shadow-[0_0_15px_rgba(168,85,247,0.25)]"
                    : "border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/20",
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={cn(
                        "grid size-8 place-items-center rounded-xl border text-xs",
                        isSelected
                          ? "border-purple-400 bg-purple-500/30 text-purple-300"
                          : "border-white/10 bg-slate-800 text-slate-400",
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    {isSelected && <CheckCircle2 className="size-4 text-purple-400" />}
                  </div>
                  <p className="font-display font-bold text-sm text-white">{m.title}</p>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{m.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Question Count & Duration */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 space-y-4">
        <h3 className="font-display text-base font-bold text-white">
          3. Question Volume & Time Limit
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {QUESTION_COUNT_OPTIONS.map((opt) => {
            const isSelected = questionCount === opt.count;
            return (
              <button
                key={opt.count}
                type="button"
                onClick={() => setQuestionCount(opt.count)}
                className={cn(
                  "p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between",
                  isSelected
                    ? "border-indigo-500 bg-indigo-500/20 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                    : "border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/20",
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-display text-2xl font-bold text-white">
                      {opt.count}{" "}
                      <span className="text-xs font-normal text-slate-400">Questions</span>
                    </span>
                    <Badge
                      variant="outline"
                      className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-[10px]"
                    >
                      <Clock className="size-3 mr-1" /> {opt.timeMins} min
                    </Badge>
                  </div>
                  <p className="font-semibold text-xs text-indigo-200">{opt.label}</p>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{opt.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Launch Action */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <ShieldCheck className="size-4 text-emerald-400" />
          <span>
            {selectedSkillNames.length} skills selected · {questionCount} questions ·{" "}
            {selectedCountConfig.timeMins} mins time limit
          </span>
        </div>

        <Button
          size="lg"
          onClick={handleLaunch}
          className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:brightness-110 font-bold text-white shadow-[0_0_30px_rgba(99,102,241,0.5)] px-8 text-sm"
        >
          <Play className="size-4 mr-2 fill-current" /> Start Adaptive Assessment
        </Button>
      </div>
    </div>
  );
}
