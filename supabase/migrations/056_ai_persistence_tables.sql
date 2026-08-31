-- ==============================================================================
-- Migration: 056_ai_persistence_tables.sql
-- Description: Caching tables for AI skill-gap, career, and learning recommendations.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.ai_skill_gap_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  attempt_id UUID REFERENCES public.assessment_attempts(id) ON DELETE SET NULL,
  target_role_id UUID REFERENCES public.career_roles(id) ON DELETE SET NULL,
  target_role_title TEXT NOT NULL,
  provider public.ai_provider_type NOT NULL DEFAULT 'gemini',
  model TEXT NOT NULL,
  overall_score NUMERIC(5,2),
  strengths JSONB NOT NULL DEFAULT '[]',
  weaknesses JSONB NOT NULL DEFAULT '[]',
  skill_scores JSONB NOT NULL DEFAULT '[]',
  priority_skills JSONB NOT NULL DEFAULT '[]',
  diagnostic_summary TEXT NOT NULL,
  recommended_actions JSONB NOT NULL DEFAULT '[]',
  is_fallback BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_career_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider public.ai_provider_type NOT NULL DEFAULT 'gemini',
  model TEXT NOT NULL,
  recommended_roles JSONB NOT NULL DEFAULT '[]',
  is_fallback BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_learning_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_role_title TEXT NOT NULL,
  provider public.ai_provider_type NOT NULL DEFAULT 'gemini',
  model TEXT NOT NULL,
  milestones JSONB NOT NULL DEFAULT '[]',
  is_fallback BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

