import type { SkillCategory, SkillProficiency } from "./index";

export type CareerReadinessTier =
  "Emerging" | "Developing" | "Proficient" | "Job Ready" | "Distinction Ready";

export interface ReadinessDimensionBreakdown {
  technicalSkills: number; // 0-100
  problemSolving: number; // 0-100
  communication: number; // 0-100
  teamwork: number; // 0-100
  leadership: number; // 0-100
  evidenceQuality: number; // 0-100
  portfolioStrength: number; // 0-100
  assessmentPerformance: number; // 0-100
}

export interface CareerReadinessScore {
  overallScore: number; // 0-100
  tier: CareerReadinessTier;
  dimensions: ReadinessDimensionBreakdown;
  topStrengths: string[];
  criticalGaps: string[];
  readinessDelta?: number | undefined;
}

export type SkillPassportItemStatus =
  "Strong" | "Needs Improvement" | "Developing" | "High Confidence" | "Unassessed";

export interface TargetRoleAnalysis {
  roleId: string;
  title: string;
  category: string;
  matchPercentage: number; // 0-100
  readinessPercentage: number; // 0-100
  matchingSkills: string[];
  missingSkills: string[];
  prioritySkills: string[];
  difficultyLevel: "Entry Level" | "Mid Level" | "Senior Track";
  suitabilityReason: string;
  estimatedReadinessImpact: string;
}

export interface SkillGapDetail {
  skillName: string;
  category: SkillCategory;
  priority: "high" | "medium" | "low";
  targetRolesAffected: string[];
  currentStatus?: string | undefined;
  currentProficiency?: SkillProficiency | undefined;
  assessedScore?: number | undefined;
  requiredForTopRole: boolean;
  recommendedAction: string;
  readinessBoost: number;
}

export interface RoadmapModule {
  id: string;
  title: string;
  completed: boolean;
}

export interface PersonalizedRoadmapItem {
  id: string;
  skillName: string;
  category: SkillCategory;
  whyItMatters: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedDuration: string;
  progress: number; // 0-100
  status: "not_started" | "in_progress" | "completed";
  modules: RoadmapModule[];
  associatedTargetRoles: string[];
  readinessImpact: number; // point impact on completion e.g. 5
}

export interface AssessmentHistoryItem {
  attemptId: string;
  completedAt: string;
  mode: string;
  questionCount: number;
  score: number;
  accuracy: number;
  readinessScore: number;
  improvementDelta: number;
  skillsAssessed: string[];
}
