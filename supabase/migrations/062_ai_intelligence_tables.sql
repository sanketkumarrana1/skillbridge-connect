-- ==============================================================================
-- Migration: 062_ai_intelligence_tables.sql
-- Description: Result caching tables for Opportunity, Candidate, Resume, Portfolio, Interview, and User Feedback.
-- ==============================================================================

-- 1. AI Opportunity Explanations Table
CREATE TABLE IF NOT EXISTS public.ai_opportunity_explanations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  provider public.ai_provider_type NOT NULL DEFAULT 'gemini',
  model TEXT NOT NULL,
  overall_match_percentage NUMERIC(5,2) NOT NULL,
  readiness_category TEXT NOT NULL,
  why_you_match JSONB NOT NULL DEFAULT '[]',
  missing_requirements JSONB NOT NULL DEFAULT '[]',
  recommended_actions JSONB NOT NULL DEFAULT '[]',
  application_advice TEXT,
  is_fallback BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. AI Candidate Summaries Table (for Recruiters)
CREATE TABLE IF NOT EXISTS public.ai_candidate_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  recruiter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider public.ai_provider_type NOT NULL DEFAULT 'gemini',
  model TEXT NOT NULL,
  summary TEXT NOT NULL,
  strongest_evidence JSONB NOT NULL DEFAULT '[]',
  matching_skills JSONB NOT NULL DEFAULT '[]',
  missing_skills JSONB NOT NULL DEFAULT '[]',
  concerns JSONB NOT NULL DEFAULT '[]',
  interview_focus JSONB NOT NULL DEFAULT '[]',
  fit_recommendation TEXT NOT NULL,
  confidence TEXT NOT NULL DEFAULT 'medium',
  is_fallback BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. AI Resume Analyses Table
CREATE TABLE IF NOT EXISTS public.ai_resume_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_role_title TEXT,
  provider public.ai_provider_type NOT NULL DEFAULT 'gemini',
  model TEXT NOT NULL,
  overall_score NUMERIC(5,2) NOT NULL,
  ats_compatibility_score NUMERIC(5,2) NOT NULL,
  strengths JSONB NOT NULL DEFAULT '[]',
  improvements JSONB NOT NULL DEFAULT '[]',
  keyword_matches JSONB NOT NULL DEFAULT '[]',
  missing_keywords JSONB NOT NULL DEFAULT '[]',
  summary TEXT NOT NULL,
  is_fallback BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. AI Portfolio Feedbacks Table
CREATE TABLE IF NOT EXISTS public.ai_portfolio_feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider public.ai_provider_type NOT NULL DEFAULT 'gemini',
  model TEXT NOT NULL,
  strengths JSONB NOT NULL DEFAULT '[]',
  weak_project_descriptions JSONB NOT NULL DEFAULT '[]',
  missing_evidence JSONB NOT NULL DEFAULT '[]',
  recommended_improvements JSONB NOT NULL DEFAULT '[]',
  project_evaluations JSONB NOT NULL DEFAULT '[]',
  summary TEXT NOT NULL,
  is_fallback BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. AI Interview Preparations Table
CREATE TABLE IF NOT EXISTS public.ai_interview_preparations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_role_title TEXT NOT NULL,
  opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE SET NULL,
  provider public.ai_provider_type NOT NULL DEFAULT 'gemini',
  model TEXT NOT NULL,
  focus_areas JSONB NOT NULL DEFAULT '[]',
  suggested_questions JSONB NOT NULL DEFAULT '[]',
  preparation_checklist JSONB NOT NULL DEFAULT '[]',
  practice_feedback JSONB NOT NULL DEFAULT '[]',
  is_fallback BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. AI User Feedback Table (for Quality Auditing)
CREATE TABLE IF NOT EXISTS public.ai_user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  request_id TEXT NOT NULL,
  operation public.ai_operation NOT NULL,
  is_helpful BOOLEAN NOT NULL,
  reason TEXT,
  comments TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

