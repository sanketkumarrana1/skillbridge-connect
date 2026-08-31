-- ==============================================================================
-- Migration: 024_opportunity_matching.sql
-- Description: Opportunity match snapshots and explainable multi-dimensional fit scoring.
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE public.opportunity_match_category AS ENUM (
    'best_match',
    'quick_win',
    'skill_building',
    'general_match',
    'not_eligible'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.opportunity_match_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  overall_match NUMERIC(5,2) NOT NULL DEFAULT 0,
  category_tag public.opportunity_match_category NOT NULL DEFAULT 'general_match',
  skill_fit NUMERIC(5,2) NOT NULL DEFAULT 0,
  eligibility_fit NUMERIC(5,2) NOT NULL DEFAULT 0,
  career_fit NUMERIC(5,2) NOT NULL DEFAULT 0,
  readiness_fit NUMERIC(5,2) NOT NULL DEFAULT 0,
  evidence_fit NUMERIC(5,2) NOT NULL DEFAULT 0,
  preference_fit NUMERIC(5,2) NOT NULL DEFAULT 0,
  matching_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  missing_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
  concerns JSONB NOT NULL DEFAULT '[]'::jsonb,
  why_you_match JSONB NOT NULL DEFAULT '[]'::jsonb,
  what_is_missing JSONB NOT NULL DEFAULT '[]'::jsonb,
  what_would_improve JSONB NOT NULL DEFAULT '[]'::jsonb,
  eligibility_result JSONB NOT NULL DEFAULT '{}'::jsonb,
  engine_version TEXT NOT NULL DEFAULT '2.4-deterministic',
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_student_opp_match UNIQUE (student_id, opportunity_id)
);

CREATE INDEX IF NOT EXISTS idx_opp_match_student ON public.opportunity_match_results(student_id);
CREATE INDEX IF NOT EXISTS idx_opp_match_opp ON public.opportunity_match_results(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opp_match_score ON public.opportunity_match_results(overall_match DESC);
CREATE INDEX IF NOT EXISTS idx_opp_match_category ON public.opportunity_match_results(category_tag);

