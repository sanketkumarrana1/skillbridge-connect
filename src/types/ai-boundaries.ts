import type { StudentProfile, MCQAssessmentQuestion, TargetRoleAnalysis, SkillGapDetail } from "./index";
import type {
  OpportunityExplanationResult,
  CandidateSummaryResult,
  CandidateComparisonResult,
  ResumeAnalysisResult,
  PortfolioFeedbackResult,
  InterviewPreparationResult,
  InterviewPracticeResult,
  AIUserFeedbackPayload,
  AdminAITelemetryResult,
} from "@/services/ai/ai-service-contracts";

export interface IAssessmentGenerator {
  generateAdaptiveQuestions(params: {
    domain: string;
    declaredSkills: string[];
    difficulty: "beginner" | "intermediate" | "advanced";
    count?: number | undefined;
  }): Promise<MCQAssessmentQuestion[]>;
}

export interface ICareerRecommendationService {
  recommendCareerPaths(params: {
    profile: StudentProfile;
    targetRoles?: string[] | undefined;
  }): Promise<TargetRoleAnalysis[]>;
}

export interface ISkillGapService {
  diagnoseGaps(params: {
    profile: StudentProfile;
    targetRoleTitle: string;
  }): Promise<SkillGapDetail[]>;
}

export interface ResumeFeedbackResult {
  overallScore: number; // 0 - 100
  strengths: string[];
  improvements: string[];
  atsCompatibilityScore: number;
  keywordMatches: string[];
  missingKeywords: string[];
  summary: string;
}

export interface IResumeFeedbackService {
  analyzeResume(params: {
    studentId?: string | undefined;
    resumeText: string;
    targetRole?: string | undefined;
    skills?: string[] | undefined;
  }): Promise<ResumeFeedbackResult>;
}

export interface IOpportunityIntelligenceService {
  explainOpportunityFit(params: {
    studentId?: string | undefined;
    opportunityId: string;
    opportunityTitle: string;
    candidateSkills: string[];
    requiredSkills: string[];
  }): Promise<OpportunityExplanationResult>;
}

export interface IRecruiterCandidateIntelligenceService {
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

export interface IPortfolioIntelligenceService {
  evaluatePortfolio(params: {
    studentId?: string | undefined;
    projects: any[];
    skills?: string[] | undefined;
  }): Promise<PortfolioFeedbackResult>;
}

export interface IInterviewIntelligenceService {
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

export interface IAIFeedbackService {
  submitFeedback(feedback: AIUserFeedbackPayload & { userId: string }): Promise<boolean>;
  getTelemetry(): Promise<AdminAITelemetryResult | null>;
}
