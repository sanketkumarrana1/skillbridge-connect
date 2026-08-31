// ==============================================================================
// AcadIn AI Configuration & Error Standards
// Description: Client-safe AI settings, operation definitions, and normalized error codes.
// ==============================================================================

import type { AIOperation } from "./ai-service-contracts";

export const AI_OPERATIONS: Record<AIOperation, { title: string; description: string; requiresAuth: boolean }> = {
  assessment_generate: {
    title: "Assessment Question Generation",
    description: "Generates tailored domain assessment questions based on declared skill levels.",
    requiresAuth: true,
  },
  skill_analysis: {
    title: "Skill Gap & Diagnostic Analysis",
    description: "Evaluates strengths and growth areas against benchmark requirements.",
    requiresAuth: true,
  },
  career_recommendation: {
    title: "Career Pathway Advisory",
    description: "Recommends high-alignment career roles and readiness roadmap milestones.",
    requiresAuth: true,
  },
  learning_recommendation: {
    title: "Curated Learning Recommendations",
    description: "Generates structured learning milestones and project ideas.",
    requiresAuth: true,
  },
  opportunity_explanation: {
    title: "Opportunity Match Transparency",
    description: "Explains fit percentage, matching competencies, and missing requirements.",
    requiresAuth: true,
  },
  candidate_summary: {
    title: "Recruiter Candidate Summary",
    description: "Evidence-based candidate summary synthesizing assessment scores and project deliverables.",
    requiresAuth: true,
  },
  candidate_comparison: {
    title: "Recruiter Candidate Comparison",
    description: "Compares relative strengths and gap areas of candidates for an opportunity.",
    requiresAuth: true,
  },
  resume_feedback: {
    title: "ATS & Resume Scoring Feedback",
    description: "Scores resume readability, keywords, and suggests concrete improvements.",
    requiresAuth: true,
  },
  resume_analysis: {
    title: "In-Depth Resume Intelligence",
    description: "Comprehensive ATS compatibility and role alignment analysis.",
    requiresAuth: true,
  },
  portfolio_feedback: {
    title: "Portfolio & Project Review",
    description: "Evaluates project clarity, impact metrics, and evidence credibility.",
    requiresAuth: true,
  },
  interview_preparation: {
    title: "Mock Interview Coaching",
    description: "Provides realistic technical and behavioral interview preparation questions.",
    requiresAuth: true,
  },
  interview_practice: {
    title: "Interview Practice Evaluation",
    description: "Actionable feedback on student mock interview answers.",
    requiresAuth: true,
  },
};

export const AI_ERROR_CODES = {
  AI_UNAVAILABLE: "AI service is temporarily unavailable. Using deterministic engine.",
  AI_RATE_LIMITED: "Request limit reached for current hour. Please try again shortly.",
  AI_TIMEOUT: "The AI request took longer than expected to process.",
  AI_INVALID_RESPONSE: "Received an invalid or malformed response structure from the AI provider.",
  AI_VALIDATION_FAILED: "The response did not meet our strict domain verification standards.",
  AI_UNAUTHORIZED: "You are not authorized to perform this AI operation.",
  AI_QUOTA_EXCEEDED: "Monthly platform AI allocation exceeded.",
} as const;

export type AIErrorCode = keyof typeof AI_ERROR_CODES;

export const DEFAULT_AI_TIMEOUT_MS = 25000;
