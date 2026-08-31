import type { AssessmentDifficulty, AssessmentQuestion } from "@/types/assessment";

export interface AdaptiveSkillState {
  skillName: string;
  questionsAnswered: number;
  correctAnswers: number;
  currentStreak: number; // positive for consecutive correct, negative for consecutive wrong
  currentDifficulty: AssessmentDifficulty;
  adaptiveAdjustment: "increased" | "decreased" | "stable";
}

export class AdaptiveEngine {
  /**
   * Evaluates the adaptive difficulty state for a given skill based on previous answers.
   */
  evaluateSkillDifficulty(
    skillName: string,
    questions: AssessmentQuestion[],
    answers: Record<string, number>, // questionId -> selectedOption
    baseProficiency: AssessmentDifficulty = "intermediate",
  ): AdaptiveSkillState {
    const answeredForSkill = questions.filter(
      (q) => q.skillName.toLowerCase() === skillName.toLowerCase() && answers[q.id] !== undefined,
    );

    if (answeredForSkill.length === 0) {
      return {
        skillName,
        questionsAnswered: 0,
        correctAnswers: 0,
        currentStreak: 0,
        currentDifficulty: baseProficiency,
        adaptiveAdjustment: "stable",
      };
    }

    let correctCount = 0;
    let streak = 0;
    let currentDifficulty: AssessmentDifficulty = baseProficiency;

    for (const q of answeredForSkill) {
      const isCorrect = answers[q.id] === q.correctAnswer;
      if (isCorrect) {
        correctCount += 1;
        streak = streak > 0 ? streak + 1 : 1;
      } else {
        streak = streak < 0 ? streak - 1 : -1;
      }
    }

    // Adaptive step-up / step-down logic
    let adjustment: "increased" | "decreased" | "stable" = "stable";

    if (streak >= 2) {
      // Step up difficulty
      if (baseProficiency === "beginner") {
        currentDifficulty = "intermediate";
        adjustment = "increased";
      } else if (baseProficiency === "intermediate") {
        currentDifficulty = "advanced";
        adjustment = "increased";
      } else {
        currentDifficulty = "advanced";
      }
    } else if (streak <= -1) {
      // Step down difficulty on incorrect answer
      if (baseProficiency === "advanced") {
        currentDifficulty = "intermediate";
        adjustment = "decreased";
      } else if (streak <= -2 && baseProficiency === "intermediate") {
        currentDifficulty = "beginner";
        adjustment = "decreased";
      } else {
        currentDifficulty = "beginner";
      }
    }

    return {
      skillName,
      questionsAnswered: answeredForSkill.length,
      correctAnswers: correctCount,
      currentStreak: streak,
      currentDifficulty,
      adaptiveAdjustment: adjustment,
    };
  }

  /**
   * Returns a concise summary of the active session's adaptation signals.
   */
  getSessionAdaptation(
    questions: AssessmentQuestion[],
    answers: Record<string, number>,
  ): {
    totalAnswered: number;
    totalCorrect: number;
    currentAccuracy: number;
    activeLevel: AssessmentDifficulty;
  } {
    const answered = questions.filter((q) => answers[q.id] !== undefined);
    const correct = answered.filter((q) => answers[q.id] === q.correctAnswer).length;
    const accuracy = answered.length > 0 ? Math.round((correct / answered.length) * 100) : 0;

    let activeLevel: AssessmentDifficulty = "intermediate";
    if (accuracy >= 80 && answered.length >= 3) {
      activeLevel = "advanced";
    } else if (accuracy < 50 && answered.length >= 3) {
      activeLevel = "beginner";
    }

    return {
      totalAnswered: answered.length,
      totalCorrect: correct,
      currentAccuracy: accuracy,
      activeLevel,
    };
  }
}

export const adaptiveEngine = new AdaptiveEngine();
