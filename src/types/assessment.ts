import type { SkillCategory, SkillProficiency } from "./index";

export type AssessmentDifficulty = "beginner" | "intermediate" | "advanced";

export type AssessmentMode = "skill_verification" | "career_readiness" | "comprehensive";

export type GapStatus =
  "Confirmed" | "Above Self-Assessment" | "Below Self-Assessment" | "Needs More Evidence";

export type ConfidenceLevel = "Low" | "Medium" | "High";

export interface AssessmentQuestion {
  id: string;
  skillId: string;
  skillName: string;
  category: SkillCategory;
  topic: string;
  difficulty: AssessmentDifficulty;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number; // 0, 1, 2, or 3
  explanation: string;
  score: number; // point value (e.g. 10 for beginner, 20 for intermediate, 30 for advanced)
  relatedSkills?: string[] | undefined;
}

export interface AssessmentSetupConfig {
  questionCount: 10 | 20 | 30;
  mode: AssessmentMode;
  timeLimitMinutes: number;
  selectedSkillNames: string[];
  targetRoles: string[];
}

export interface AssessmentAnswerRecord {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  timeSpentSeconds?: number | undefined;
  difficultyAtTime: AssessmentDifficulty;
  skillName: string;
}

export interface SkillAssessmentResult {
  skillName: string;
  category: SkillCategory;
  selfRatedLevel: SkillProficiency;
  assessedLevel: SkillProficiency;
  score: number; // 0-100%
  accuracy: number; // 0-100%
  questionsAttempted: number;
  correctCount: number;
  confidence: ConfidenceLevel;
  gapStatus: GapStatus;
  evidenceSummary?: string | undefined;
}

export interface AssessmentAttempt {
  id: string;
  studentId?: string | undefined;
  completedAt: string;
  mode: AssessmentMode;
  questionCount: number;
  durationMinutes: number;
  timeUsedSeconds: number;
  overallScore: number; // 0-100%
  accuracy: number; // 0-100%
  skillsAssessed: string[];
  categoryScores: Record<string, number>;
  skillResults: SkillAssessmentResult[];
  strengths: string[];
  weaknesses: string[];
  detectedGaps: string[];
  answers: Record<string, number>; // questionId -> option index
  questions: AssessmentQuestion[];
}
