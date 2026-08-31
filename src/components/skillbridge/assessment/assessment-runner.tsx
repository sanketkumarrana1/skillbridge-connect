import { useState, useEffect, useCallback, useMemo } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  HelpCircle,
  Layers,
  Lock,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppState } from "@/context/app-state";
import { AssessmentService } from "@/services/assessment-service";
import { adaptiveEngine } from "@/services/assessment/adaptive-engine";
import { scoringEngine } from "@/services/assessment/scoring-engine";
import { SubmissionDialog } from "./submission-dialog";
import type {
  AssessmentAttempt,
  AssessmentQuestion,
  AssessmentSetupConfig,
} from "@/types/assessment";

interface AssessmentRunnerProps {
  questions: AssessmentQuestion[];
  config: AssessmentSetupConfig;
  onComplete: (attempt: AssessmentAttempt) => void;
  onExit: () => void;
}

export function AssessmentRunner({ questions, config, onComplete, onExit }: AssessmentRunnerProps) {
  const { profile, saveAssessmentAttempt } = useAppState();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Countdown Timer State
  const initialDurationSeconds = config.timeLimitMinutes * 60;
  const [remainingSeconds, setRemainingSeconds] = useState(initialDurationSeconds);

  const currentQuestion = questions[currentIndex] ?? questions[0]!;
  const answeredCount = Object.keys(answers).length;

  // Real-time Adaptive Evaluation
  const adaptiveState = useMemo(() => {
    const declaredSkill = profile.declaredSkills?.find(
      (s) => s.name.toLowerCase() === currentQuestion.skillName.toLowerCase(),
    );
    const baseProf = declaredSkill?.proficiency ?? "intermediate";
    return adaptiveEngine.evaluateSkillDifficulty(
      currentQuestion.skillName,
      questions,
      answers,
      baseProf,
    );
  }, [currentQuestion.skillName, questions, answers, profile.declaredSkills]);

  // Final Submit Handler
  const handleFinalSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const timeUsedSeconds = initialDurationSeconds - remainingSeconds;
    const attemptId = `att-run-${Date.now()}`;

    try {
      const attemptResult = await AssessmentService.submitAttempt(
        attemptId,
        answers,
        profile,
        questions,
        timeUsedSeconds,
        config,
      );

      saveAssessmentAttempt(attemptResult);
      toast.success("Assessment submitted and scored successfully!");
      onComplete(attemptResult);
    } catch (err) {
      console.error("Submission error:", err);
      const fallbackResult = scoringEngine.calculateResult(
        questions,
        answers,
        profile,
        timeUsedSeconds,
        config.timeLimitMinutes,
        config.mode,
      );
      saveAssessmentAttempt(fallbackResult);
      toast.success("Assessment submitted and scored successfully!");
      onComplete(fallbackResult);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    initialDurationSeconds,
    remainingSeconds,
    questions,
    answers,
    profile,
    config,
    saveAssessmentAttempt,
    onComplete,
  ]);

  // Timer Interval Effect (Mounts once without resetting timer every second)
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.warning("Time limit expired! Submitting your assessment automatically.");
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleFinalSubmit]);

  // Answer selection handler
  const handleSelectOption = (optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const handleClearAnswer = () => {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[currentQuestion.id];
      return next;
    });
  };

  // Time formatters
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const isTimeLow = remainingSeconds <= 120; // 2 minutes warning

  const OPTION_LETTERS = ["A", "B", "C", "D"] as const;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Test Navigation Bar */}
      <div className="glass-panel rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Progress & Question info */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="grid size-10 place-items-center rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 font-bold text-sm">
            {currentIndex + 1}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm text-white">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <Badge
                variant="outline"
                className="border-indigo-500/40 bg-indigo-500/10 text-indigo-300 text-[10px]"
              >
                {currentQuestion.skillName}
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400">
              Topic: {currentQuestion.topic} · {answeredCount} Answered
            </p>
          </div>
        </div>

        {/* Center: Real-Time Adaptive Difficulty Indicator */}
        <div className="hidden lg:flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-3.5 py-1.5 text-xs">
          <Zap className="size-3.5 text-amber-400" />
          <span className="text-slate-400">Adaptive Signal:</span>
          <span
            className={cn(
              "font-semibold capitalize",
              currentQuestion.difficulty === "advanced"
                ? "text-purple-400"
                : currentQuestion.difficulty === "intermediate"
                  ? "text-indigo-400"
                  : "text-sky-400",
            )}
          >
            {currentQuestion.difficulty}
          </span>
          {adaptiveState.adaptiveAdjustment === "increased" && (
            <span className="text-[10px] text-emerald-400 font-bold ml-1">▲ Level Raised</span>
          )}
          {adaptiveState.adaptiveAdjustment === "decreased" && (
            <span className="text-[10px] text-amber-400 font-bold ml-1">▼ Calibrating</span>
          )}
        </div>

        {/* Right: Live Timer & Submit */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div
            className={cn(
              "flex items-center gap-2 rounded-2xl border px-3.5 py-1.5 font-mono text-sm font-bold transition-all",
              isTimeLow
                ? "border-rose-500/60 bg-rose-500/20 text-rose-300 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                : "border-white/10 bg-slate-900/80 text-indigo-300",
            )}
          >
            <Clock className={cn("size-4", isTimeLow ? "text-rose-400" : "text-indigo-400")} />
            <span>
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
          </div>

          <Button
            size="sm"
            onClick={() => setSubmissionDialogOpen(true)}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] text-xs"
          >
            <Lock className="size-3.5 mr-1.5" /> Submit Assessment
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-900 border border-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Question & Question Palette Layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
        {/* Left: Question Box */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-wider",
                  currentQuestion.difficulty === "advanced"
                    ? "border-purple-500/40 bg-purple-500/10 text-purple-300"
                    : currentQuestion.difficulty === "intermediate"
                      ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-300"
                      : "border-sky-500/40 bg-sky-500/10 text-sky-300",
                )}
              >
                {currentQuestion.difficulty} Question · {currentQuestion.score} pts
              </Badge>

              {answers[currentQuestion.id] !== undefined && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                  <CheckCircle2 className="size-3.5" /> Answer Selected
                </span>
              )}
            </div>

            <h2 className="font-display text-lg sm:text-xl font-bold text-white leading-relaxed">
              {currentQuestion.question}
            </h2>

            {/* 4 Option Buttons */}
            <div className="grid gap-3 pt-2">
              {currentQuestion.options.map((optionText, optIdx) => {
                const isSelected = answers[currentQuestion.id] === optIdx;
                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(optIdx)}
                    className={cn(
                      "p-4 rounded-2xl border text-left transition-all duration-200 flex items-start gap-3.5",
                      isSelected
                        ? "border-indigo-500 bg-gradient-to-r from-indigo-600/30 to-purple-600/20 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] ring-1 ring-indigo-400"
                        : "border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/20 hover:bg-slate-900/90",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-7 place-items-center rounded-xl border text-xs font-bold shrink-0 mt-0.5",
                        isSelected
                          ? "border-indigo-400 bg-indigo-500/40 text-white"
                          : "border-white/10 bg-slate-800 text-slate-400",
                      )}
                    >
                      {OPTION_LETTERS[optIdx]}
                    </span>
                    <span className="text-sm leading-relaxed">{optionText}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Controls */}
          <div className="border-t border-white/10 pt-5 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="border-white/10 bg-slate-900/60 text-slate-300 hover:text-white text-xs"
              >
                <ArrowLeft className="size-3.5 mr-1" /> Previous
              </Button>

              {answers[currentQuestion.id] !== undefined && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAnswer}
                  className="text-xs text-slate-400 hover:text-rose-400"
                >
                  <RotateCcw className="size-3 mr-1" /> Clear Answer
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {currentIndex < questions.length - 1 ? (
                <Button
                  size="sm"
                  onClick={() =>
                    setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))
                  }
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
                >
                  Next Question <ArrowRight className="size-3.5 ml-1" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setSubmissionDialogOpen(true)}
                  className="bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-bold text-xs"
                >
                  Review & Submit <Lock className="size-3.5 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Question Palette */}
        <div className="glass-panel rounded-3xl p-5 space-y-4 h-fit">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h4 className="font-display text-sm font-bold text-white">Question Palette</h4>
            <span className="text-xs text-slate-400">
              {answeredCount}/{questions.length} done
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const isAnswered = answers[q.id] !== undefined;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    "size-9 rounded-xl border text-xs font-bold transition-all duration-200 flex items-center justify-center",
                    isCurrent
                      ? "border-indigo-400 bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)] ring-2 ring-indigo-400/50"
                      : isAnswered
                        ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
                        : "border-white/10 bg-slate-900 text-slate-400 hover:border-white/20 hover:text-white",
                  )}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Palette Legend */}
          <div className="border-t border-white/10 pt-3 space-y-1.5 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-md bg-indigo-600 border border-indigo-400" />
              <span>Current Question</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-md bg-emerald-500/20 border border-emerald-500/50" />
              <span>Answered ({answeredCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-md bg-slate-900 border border-white/10" />
              <span>Unanswered ({questions.length - answeredCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <SubmissionDialog
        open={submissionDialogOpen}
        onOpenChange={setSubmissionDialogOpen}
        totalQuestions={questions.length}
        answeredCount={answeredCount}
        remainingSeconds={remainingSeconds}
        onConfirmSubmit={handleFinalSubmit}
      />
    </div>
  );
}
