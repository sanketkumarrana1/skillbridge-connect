// ==============================================================================
// AcadIn AI Service Contracts & Structured Output Definitions
// Description: Strongly-typed request envelopes, structured response schemas, and service contracts for Phase 2.10 AI modules.
// ==============================================================================

import type { MCQAssessmentQuestion, StudentProfile, TargetRoleAnalysis, SkillGapDetail } from "@/types";

export type AIOperation =
  | "assessment_generate"
  | "skill_analysis"
  | "career_recommendation"
  | "learning_recommendation"
  | "opportunity_explanation"
  | "candidate_summary"
  | "candidate_comparison"
  | "resume_feedback"
  | "resume_analysis"
  | "portfolio_feedback"
  | "interview_preparation"
  | "interview_practice";

export interface AIRequestEnvelope<T = any> {
  operation: AIOperation;
  input: T;
  requestId?: string | undefined;
  schemaVersion?: string | undefined;
}

export interface AIResponseEnvelope<T = any> {
  success: boolean;
  requestId: string;
  operation: AIOperation;
  model: string;
  latencyMs: number;
  provider: "gemini" | "openai" | "mock";
  isFallback?: boolean | undefined;
  data: T;
  error?: string | undefined;
  message?: string | undefined;
}

// 1. Assessment Generation Schema
export interface AssessmentGenerationResult {
  domain: string;
  questions: MCQAssessmentQuestion[];
}

export interface AssessmentGenerateParams {
  domain: string;
  declaredSkills: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  count?: number | undefined;
}

// 2. Skill Analysis Schema
export interface SkillAnalysisResult {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  skillScores: Array<{
    skillName: string;
    score: number;
    level: "beginner" | "intermediate" | "advanced" | "expert";
  }>;
  prioritySkills?: string[] | undefined;
  diagnosticSummary: string;
  recommendedActions?: string[] | undefined;
}

// 3. Career Recommendation Schema
export interface CareerRecommendationResult {
  recommendedRoles: Array<{
    roleTitle: string;
    fitScore: number;
    readinessLevel: "High Readiness" | "Moderate Readiness" | "Developing";
    keySkillMatches: string[];
    gapSkills: string[];
    rationale: string;
  }>;
}

// 4. Learning Recommendation Schema
export interface LearningRecommendationResult {
  milestones: Array<{
    title: string;
    estimatedWeeks: number;
    topics: string[];
    projectIdea: string;
  }>;
}

// 5. Opportunity Match Explanation Schema
export interface OpportunityExplanationResult {
  overallMatchPercentage: number;
  category: "ready_to_apply" | "nearly_ready" | "build_skills_first" | "best_match" | "quick_win" | "skill_building" | "general_match" | "not_eligible";
  whyYouMatch: string[];
  missingRequirements: string[];
  recommendedActions: string[];
  applicationAdvice?: string | undefined;
}

// 6. Recruiter Candidate Summary Schema
export interface CandidateSummaryResult {
  summary: string;
  strongestEvidence: string[];
  matchingSkills: string[];
  missingSkills: string[];
  concerns: string[];
  interviewFocus: string[];
  fitRecommendation: "strong_fit" | "good_fit" | "moderate_fit" | "limited_fit";
  confidence: "high" | "medium" | "low";
}

// 7. Recruiter Candidate Comparison Schema
export interface CandidateComparisonResult {
  comparisonSummary: string;
  candidateEvaluations: Array<{
    candidateId: string;
    candidateName: string;
    keyStrengths: string[];
    gapAreas: string[];
    recommendedFocus: string;
  }>;
  overallRecommendation: string;
}

// 8. Resume Feedback & Analysis Schema
export interface ResumeFeedbackResult {
  overallScore: number;
  atsCompatibilityScore: number;
  strengths: string[];
  improvements: string[];
  keywordMatches: string[];
  missingKeywords: string[];
  summary: string;
}

export type ResumeAnalysisResult = ResumeFeedbackResult;

// 9. Portfolio Feedback Schema
export interface PortfolioFeedbackResult {
  strengths: string[];
  weakProjectDescriptions: string[];
  missingEvidence: string[];
  recommendedImprovements: string[];
  projectEvaluations: Array<{
    title: string;
    evidenceStrength: "weak" | "moderate" | "strong";
    rationale: string;
  }>;
  summary: string;
}

// 10. Interview Preparation Schema
export interface InterviewPreparationResult {
  focusAreas: string[];
  suggestedQuestions: Array<{
    question: string;
    type: "Technical Deep Dive" | "System Design" | "Behavioral & Culture Fit";
    keyPointsToCover: string[];
  }>;
  preparationChecklist?: string[] | undefined;
}

// 11. Interview Practice Feedback Schema
export interface InterviewPracticeResult {
  technicalAccuracy: number;
  communicationClarity: number;
  strengths: string[];
  weaknesses: string[];
  suggestedModelAnswer: string;
  improvementTips: string[];
}

// 12. AI User Feedback & Admin Telemetry
export interface AIUserFeedbackPayload {
  requestId: string;
  operation: AIOperation;
  isHelpful: boolean;
  reason?: string | undefined;
  comments?: string | undefined;
}

export interface AdminAITelemetryResult {
  totalRequests: number;
  completedRequests: number;
  failedRequests: number;
  rateLimitedRequests: number;
  avgLatencyMs: number;
  totalTokensConsumed: number;
  helpfulFeedbackCount: number;
  unhelpfulFeedbackCount: number;
}

// AI Service Boundary Interfaces
export interface IAssessmentAIService {
  generateQuestions(params: AssessmentGenerateParams): Promise<AssessmentGenerationResult>;
}

export interface ISkillAnalysisAIService {
  analyzeSkills(params: { profile: StudentProfile; targetRoleTitle?: string | undefined }): Promise<SkillAnalysisResult>;
}

export interface ICareerAIService {
  recommendCareerPaths(params: { profile: StudentProfile; targetRoles?: string[] | undefined }): Promise<CareerRecommendationResult>;
}

export interface ILearningAIService {
  recommendLearningPlan(params: { currentSkills: string[]; targetRole: string }): Promise<LearningRecommendationResult>;
}

export interface IOpportunityAIService {
  explainOpportunityFit(params: {
    studentId?: string | undefined;
    opportunityId: string;
    opportunityTitle: string;
    candidateSkills: string[];
    requiredSkills: string[];
  }): Promise<OpportunityExplanationResult>;
}

export interface IRecruiterAIService {
  summarizeCandidate(params: {
    applicationId: string;
    recruiterId: string;
    candidateProfile: any;
    assessedSkills: any[];
    opportunityRequirements: any;
  }): Promise<CandidateSummaryResult>;

  compareCandidates(params: {
    opportunityTitle: string;
    candidates: any[];
  }): Promise<CandidateComparisonResult>;
}

export interface IResumeAIService {
  analyzeResume(params: {
    studentId?: string | undefined;
    resumeText: string;
    targetRole?: string | undefined;
    skills?: string[] | undefined;
  }): Promise<ResumeAnalysisResult>;
}

export interface IPortfolioAIService {
  evaluatePortfolio(params: {
    studentId?: string | undefined;
    projects: any[];
    skills?: string[] | undefined;
  }): Promise<PortfolioFeedbackResult>;
}

export interface IInterviewAIService {
  prepareInterview(params: {
    studentId?: string | undefined;
    targetRole: string;
    opportunityId?: string | undefined;
    skillGaps?: string[] | undefined;
  }): Promise<InterviewPreparationResult>;

  evaluatePracticeAnswer(params: {
    question: string;
    type: string;
    answer: string;
  }): Promise<InterviewPracticeResult>;
}
