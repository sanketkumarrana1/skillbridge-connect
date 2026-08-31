import type {
  AssessmentAttempt,
  AssessmentMode,
  AssessmentQuestion,
  ConfidenceLevel,
  GapStatus,
  SkillAssessmentResult,
} from "@/types/assessment";
import type { SkillCategory, SkillProficiency, StudentProfile } from "@/types";

export class ScoringEngine {
  calculateResult(
    questions: AssessmentQuestion[],
    answers: Record<string, number>,
    profile: StudentProfile,
    timeUsedSeconds: number,
    durationMinutes: number,
    mode: AssessmentMode = "skill_verification",
  ): AssessmentAttempt {
    const declaredSkills = profile.declaredSkills ?? [];
    const skillSelfRatingMap = new Map<string, SkillProficiency>();
    declaredSkills.forEach((s) => skillSelfRatingMap.set(s.name.toLowerCase(), s.proficiency));

    // Group questions by skill
    const skillGroups = new Map<string, AssessmentQuestion[]>();
    questions.forEach((q) => {
      const existing = skillGroups.get(q.skillName) ?? [];
      skillGroups.set(q.skillName, [...existing, q]);
    });

    const skillResults: SkillAssessmentResult[] = [];
    const categoryTotals = new Map<string, { totalScore: number; count: number }>();
    let totalScoreSum = 0;
    let totalQuestionsAnswered = 0;
    let totalCorrectAnswers = 0;

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const detectedGaps: string[] = [];

    skillGroups.forEach((skillQuestions, skillName) => {
      const category: SkillCategory = skillQuestions[0]?.category ?? "Programming Languages";
      const selfRated: SkillProficiency =
        skillSelfRatingMap.get(skillName.toLowerCase()) ?? "intermediate";

      let skillCorrect = 0;
      let skillAttempted = 0;
      let weightedPointsEarned = 0;
      let maxWeightedPoints = 0;

      skillQuestions.forEach((q) => {
        const userChoice = answers[q.id];
        const isAttempted = userChoice !== undefined;
        const isCorrect = userChoice === q.correctAnswer;

        const maxPoints =
          q.difficulty === "advanced" ? 30 : q.difficulty === "intermediate" ? 20 : 10;
        maxWeightedPoints += maxPoints;

        if (isAttempted) {
          skillAttempted += 1;
          totalQuestionsAnswered += 1;
          if (isCorrect) {
            skillCorrect += 1;
            totalCorrectAnswers += 1;
            weightedPointsEarned += maxPoints;
          }
        }
      });

      const accuracy = skillAttempted > 0 ? Math.round((skillCorrect / skillAttempted) * 100) : 0;
      const skillScore =
        maxWeightedPoints > 0 ? Math.round((weightedPointsEarned / maxWeightedPoints) * 100) : 0;
      totalScoreSum += skillScore;

      // Determine assessed proficiency level
      let assessedLevel: SkillProficiency = "intermediate";
      if (skillScore >= 80 || (accuracy >= 85 && skillAttempted >= 2)) {
        assessedLevel = "advanced";
      } else if (skillScore >= 55 || (accuracy >= 60 && skillAttempted >= 1)) {
        assessedLevel = "intermediate";
      } else {
        assessedLevel = "beginner";
      }

      // Determine confidence level
      const confidence: ConfidenceLevel =
        skillAttempted >= 3 ? "High" : skillAttempted === 2 ? "Medium" : "Low";

      // Determine gap status compared to self-declared rating
      let gapStatus: GapStatus = "Confirmed";
      const levelRank: Record<SkillProficiency, number> = {
        beginner: 1,
        intermediate: 2,
        advanced: 3,
      };

      if (skillAttempted <= 1) {
        gapStatus = "Needs More Evidence";
      } else if (levelRank[assessedLevel] > levelRank[selfRated]) {
        gapStatus = "Above Self-Assessment";
        strengths.push(`${skillName} (Assessed ${assessedLevel} vs Self-Declared ${selfRated})`);
      } else if (levelRank[assessedLevel] < levelRank[selfRated] || skillScore < 50) {
        gapStatus = "Below Self-Assessment";
        weaknesses.push(`${skillName} (${skillScore}% accuracy)`);
        detectedGaps.push(
          `${skillName}: Declared ${selfRated}, but scored ${skillScore}% (${assessedLevel})`,
        );
      } else {
        gapStatus = "Confirmed";
        if (skillScore >= 75) {
          strengths.push(`${skillName} (${selfRated} verified by test)`);
        }
      }

      // Add to category scores
      const catEntry = categoryTotals.get(category) ?? { totalScore: 0, count: 0 };
      categoryTotals.set(category, {
        totalScore: catEntry.totalScore + skillScore,
        count: catEntry.count + 1,
      });

      skillResults.push({
        skillName,
        category,
        selfRatedLevel: selfRated,
        assessedLevel,
        score: skillScore,
        accuracy,
        questionsAttempted: skillAttempted,
        correctCount: skillCorrect,
        confidence,
        gapStatus,
        evidenceSummary: `${skillCorrect}/${skillQuestions.length} questions correct · ${confidence} confidence`,
      });
    });

    const overallScore =
      skillResults.length > 0 ? Math.round(totalScoreSum / skillResults.length) : 0;
    const overallAccuracy =
      totalQuestionsAnswered > 0
        ? Math.round((totalCorrectAnswers / totalQuestionsAnswered) * 100)
        : 0;

    const categoryScores: Record<string, number> = {};
    categoryTotals.forEach((val, key) => {
      categoryScores[key] = Math.round(val.totalScore / val.count);
    });

    return {
      id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      studentId: profile.email,
      completedAt: new Date().toISOString(),
      mode,
      questionCount: questions.length,
      durationMinutes,
      timeUsedSeconds,
      overallScore,
      accuracy: overallAccuracy,
      skillsAssessed: Array.from(skillGroups.keys()),
      categoryScores,
      skillResults,
      strengths: strengths.length > 0 ? strengths : ["Demonstrated solid core understanding"],
      weaknesses: weaknesses.length > 0 ? weaknesses : ["No critical failure areas detected"],
      detectedGaps,
      answers,
      questions,
    };
  }
}

export const scoringEngine = new ScoringEngine();
