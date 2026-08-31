// ==============================================================================
// AcadIn Unit Test Suite: Assessment Scoring Engine
// Description: Validates deterministic scoring algorithms, difficulty scaling,
//              unanswered handling, attempt expiry, and skill level mapping.
// ==============================================================================

export interface AssessmentQuestionFixture {
  id: string;
  skillId: string;
  skillName: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  weight: number;
  correctAnswer: number;
}

export interface QuestionAnswerSubmission {
  questionId: string;
  selectedOption: number | null;
}

export function evaluateAssessmentSubmission(
  questions: AssessmentQuestionFixture[],
  answers: QuestionAnswerSubmission[],
  isExpired: boolean = false
): {
  isExpired: boolean;
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  scorePercentage: number;
  skillScores: { skillName: string; score: number; level: "beginner" | "intermediate" | "advanced" }[];
} {
  if (isExpired) {
    return {
      isExpired: true,
      totalQuestions: questions.length,
      answeredCount: 0,
      correctCount: 0,
      scorePercentage: 0,
      skillScores: [],
    };
  }

  const answerMap = new Map(answers.map((a) => [a.questionId, a.selectedOption]));
  let totalWeightedPossible = 0;
  let totalWeightedEarned = 0;
  let answeredCount = 0;
  let correctCount = 0;

  const skillAggregation: Record<string, { earned: number; possible: number }> = {};

  for (const q of questions) {
    const diffMultiplier = q.difficulty === "advanced" ? 1.5 : q.difficulty === "intermediate" ? 1.2 : 1.0;
    const itemWeight = q.weight * diffMultiplier;
    totalWeightedPossible += itemWeight;

    const currentSkill = skillAggregation[q.skillName] || { earned: 0, possible: 0 };
    currentSkill.possible += itemWeight;
    skillAggregation[q.skillName] = currentSkill;

    const chosen = answerMap.get(q.id);
    if (chosen !== undefined && chosen !== null) {
      answeredCount++;
      if (chosen === q.correctAnswer) {
        correctCount++;
        totalWeightedEarned += itemWeight;
        currentSkill.earned += itemWeight;
      }
    }
  }

  const scorePercentage = totalWeightedPossible > 0
    ? Math.round((totalWeightedEarned / totalWeightedPossible) * 100)
    : 0;

  const skillScores = Object.entries(skillAggregation).map(([skillName, data]) => {
    const pct = data.possible > 0 ? Math.round((data.earned / data.possible) * 100) : 0;
    let level: "beginner" | "intermediate" | "advanced" = "beginner";
    if (pct >= 80) level = "advanced";
    else if (pct >= 60) level = "intermediate";

    return { skillName, score: pct, level };
  });

  return {
    isExpired: false,
    totalQuestions: questions.length,
    answeredCount,
    correctCount,
    scorePercentage,
    skillScores,
  };
}

// Sample Test Fixtures
const sampleQuestions: AssessmentQuestionFixture[] = [
  { id: "q1", skillId: "react", skillName: "React", difficulty: "beginner", weight: 1, correctAnswer: 0 },
  { id: "q2", skillId: "react", skillName: "React", difficulty: "intermediate", weight: 2, correctAnswer: 1 },
  { id: "q3", skillId: "ts", skillName: "TypeScript", difficulty: "intermediate", weight: 2, correctAnswer: 2 },
  { id: "q4", skillId: "ts", skillName: "TypeScript", difficulty: "advanced", weight: 3, correctAnswer: 3 },
  { id: "q5", skillId: "sql", skillName: "SQL", difficulty: "beginner", weight: 1, correctAnswer: 0 },
];

export async function runAssessmentScoringTests(): Promise<{ passed: number; failed: number; tests: { name: string; passed: boolean }[] }> {
  const tests: { name: string; passed: boolean }[] = [];
  let passed = 0;

  // Test 1: 100% Perfect Score
  {
    const answers: QuestionAnswerSubmission[] = [
      { questionId: "q1", selectedOption: 0 },
      { questionId: "q2", selectedOption: 1 },
      { questionId: "q3", selectedOption: 2 },
      { questionId: "q4", selectedOption: 3 },
      { questionId: "q5", selectedOption: 0 },
    ];
    const res = evaluateAssessmentSubmission(sampleQuestions, answers);
    const ok = res.scorePercentage === 100 && res.correctCount === 5 && res.answeredCount === 5;
    tests.push({ name: "Assessment: 100% all correct answers produces 100 score", passed: ok });
    if (ok) passed++;
  }

  // Test 2: 0% All Incorrect
  {
    const answers: QuestionAnswerSubmission[] = [
      { questionId: "q1", selectedOption: 3 },
      { questionId: "q2", selectedOption: 3 },
      { questionId: "q3", selectedOption: 0 },
      { questionId: "q4", selectedOption: 0 },
      { questionId: "q5", selectedOption: 3 },
    ];
    const res = evaluateAssessmentSubmission(sampleQuestions, answers);
    const ok = res.scorePercentage === 0 && res.correctCount === 0;
    tests.push({ name: "Assessment: 0% all incorrect answers produces 0 score", passed: ok });
    if (ok) passed++;
  }

  // Test 3: Partial / Unanswered Questions Handled Gracefully
  {
    const answers: QuestionAnswerSubmission[] = [
      { questionId: "q1", selectedOption: 0 }, // Correct
      { questionId: "q2", selectedOption: null }, // Unanswered
      { questionId: "q3", selectedOption: 2 }, // Correct
      // q4 omitted (unanswered)
      { questionId: "q5", selectedOption: 0 }, // Correct
    ];
    const res = evaluateAssessmentSubmission(sampleQuestions, answers);
    const ok = res.answeredCount === 3 && res.correctCount === 3 && res.scorePercentage > 0 && res.scorePercentage < 100;
    tests.push({ name: "Assessment: Unanswered questions counted as 0 without runtime errors", passed: ok });
    if (ok) passed++;
  }

  // Test 4: Expired Attempt Handling
  {
    const answers: QuestionAnswerSubmission[] = [
      { questionId: "q1", selectedOption: 0 },
    ];
    const res = evaluateAssessmentSubmission(sampleQuestions, answers, true);
    const ok = res.isExpired === true && res.scorePercentage === 0;
    tests.push({ name: "Assessment: Expired attempt immediately returns zeroed result", passed: ok });
    if (ok) passed++;
  }

  // Test 5: Skill Level Calibration (Advanced threshold >= 80%)
  {
    const answers: QuestionAnswerSubmission[] = [
      { questionId: "q1", selectedOption: 0 },
      { questionId: "q2", selectedOption: 1 },
      { questionId: "q3", selectedOption: 0 }, // Wrong TS
      { questionId: "q4", selectedOption: 0 }, // Wrong TS
      { questionId: "q5", selectedOption: 0 },
    ];
    const res = evaluateAssessmentSubmission(sampleQuestions, answers);
    const reactSkill = res.skillScores.find((s) => s.skillName === "React");
    const tsSkill = res.skillScores.find((s) => s.skillName === "TypeScript");
    const ok = reactSkill?.level === "advanced" && tsSkill?.level === "beginner";
    tests.push({ name: "Assessment: Skill levels properly calibrated by domain percentage", passed: ok });
    if (ok) passed++;
  }

  return {
    passed,
    failed: tests.length - passed,
    tests,
  };
}

