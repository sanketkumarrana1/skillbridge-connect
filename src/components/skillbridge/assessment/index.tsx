import { useState } from "react";
import { useAppState } from "@/context/app-state";
import { AssessmentSetup } from "./assessment-setup";
import { AssessmentRunner } from "./assessment-runner";
import { AssessmentResultView } from "./assessment-result-view";
import { AssessmentHistoryView } from "./assessment-history-view";
import type {
  AssessmentAttempt,
  AssessmentQuestion,
  AssessmentSetupConfig,
} from "@/types/assessment";

export function StudentAssessment() {
  const { latestAssessmentResult, assessmentAttempts } = useAppState();

  // If student already has a previous assessment result, default to result view, else setup
  const [view, setView] = useState<"setup" | "running" | "result" | "history">(() =>
    latestAssessmentResult ? "result" : "setup",
  );
  const [activeQuestions, setActiveQuestions] = useState<AssessmentQuestion[]>([]);
  const [activeConfig, setActiveConfig] = useState<AssessmentSetupConfig | null>(null);
  const [viewingAttempt, setViewingAttempt] = useState<AssessmentAttempt | null>(
    latestAssessmentResult,
  );

  const handleStartAssessment = (
    questions: AssessmentQuestion[],
    config: AssessmentSetupConfig,
  ) => {
    setActiveQuestions(questions);
    setActiveConfig(config);
    setView("running");
  };

  const handleCompleteAssessment = (attempt: AssessmentAttempt) => {
    setViewingAttempt(attempt);
    setView("result");
  };

  if (view === "running" && activeConfig && activeQuestions.length > 0) {
    return (
      <AssessmentRunner
        questions={activeQuestions}
        config={activeConfig}
        onComplete={handleCompleteAssessment}
        onExit={() => setView("setup")}
      />
    );
  }

  if (view === "result" && viewingAttempt) {
    return (
      <AssessmentResultView
        attempt={viewingAttempt}
        onRetake={() => setView("setup")}
        onViewHistory={() => setView("history")}
      />
    );
  }

  if (view === "history") {
    return (
      <AssessmentHistoryView
        onSelectAttempt={(att) => {
          setViewingAttempt(att);
          setView("result");
        }}
        onNewAssessment={() => setView("setup")}
      />
    );
  }

  return <AssessmentSetup onStartAssessment={handleStartAssessment} />;
}
