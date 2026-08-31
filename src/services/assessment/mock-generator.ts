import { QUESTION_BANK } from "@/data/question-bank";
import type {
  AssessmentDifficulty,
  AssessmentQuestion,
  AssessmentSetupConfig,
} from "@/types/assessment";
import type { DeclaredSkill, StudentProfile } from "@/types";
import type { IAssessmentGenerator } from "./generator-interface";

export class MockAssessmentGenerator implements IAssessmentGenerator {
  generateAssessment(profile: StudentProfile, config: AssessmentSetupConfig): AssessmentQuestion[] {
    const declaredSkills: DeclaredSkill[] = profile.declaredSkills ?? [];

    // Filter student skills by config selection or use all declared skills
    const activeDeclared =
      config.selectedSkillNames.length > 0
        ? declaredSkills.filter((s) => config.selectedSkillNames.includes(s.name))
        : declaredSkills;

    if (activeDeclared.length === 0) {
      // Return empty if no skills are declared
      return [];
    }

    const skillMap = new Map<string, DeclaredSkill>();
    activeDeclared.forEach((s) => skillMap.set(s.name.toLowerCase(), s));

    // Find all questions in the bank that match declared skills or closely related skills
    const matchingQuestions = QUESTION_BANK.filter((q) => {
      const isDirectMatch = skillMap.has(q.skillName.toLowerCase());
      const isRelatedMatch = q.relatedSkills?.some((rs) => skillMap.has(rs.toLowerCase()));
      return isDirectMatch || isRelatedMatch;
    });

    if (matchingQuestions.length === 0) {
      // Fallback: take generic foundational questions from bank
      return QUESTION_BANK.slice(0, config.questionCount);
    }

    // Weight and order questions based on declared self-ratings
    const prioritizedQuestions: AssessmentQuestion[] = [];

    // For each declared skill, pick questions matching desired starting difficulty
    for (const declared of activeDeclared) {
      const skillQuestions = matchingQuestions.filter(
        (q) => q.skillName.toLowerCase() === declared.name.toLowerCase(),
      );

      if (skillQuestions.length > 0) {
        // Preferred starting difficulty based on self-reported proficiency
        const preferredDiff: AssessmentDifficulty =
          declared.proficiency === "advanced"
            ? "advanced"
            : declared.proficiency === "intermediate"
              ? "intermediate"
              : "beginner";

        // Sort: preferred difficulty first, then other difficulties
        const sorted = [...skillQuestions].sort((a, b) => {
          if (a.difficulty === preferredDiff && b.difficulty !== preferredDiff) return -1;
          if (b.difficulty === preferredDiff && a.difficulty !== preferredDiff) return 1;
          return 0;
        });

        prioritizedQuestions.push(...sorted);
      }
    }

    // Fill remaining slots from related matching questions without duplicates
    const selectedIds = new Set<string>(prioritizedQuestions.map((q) => q.id));
    for (const q of matchingQuestions) {
      if (!selectedIds.has(q.id)) {
        prioritizedQuestions.push(q);
        selectedIds.add(q.id);
      }
    }

    // If still need more questions up to target count, take any remaining questions
    if (prioritizedQuestions.length < config.questionCount) {
      for (const q of QUESTION_BANK) {
        if (!selectedIds.has(q.id)) {
          prioritizedQuestions.push(q);
          selectedIds.add(q.id);
          if (prioritizedQuestions.length >= config.questionCount) break;
        }
      }
    }

    // Return exact target count requested
    return prioritizedQuestions.slice(0, config.questionCount);
  }
}

export const assessmentGenerator = new MockAssessmentGenerator();
