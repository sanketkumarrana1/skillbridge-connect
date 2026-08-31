-- ==============================================================================
-- Migration: 036_opportunity_recruiters.sql
-- Description: Opportunity hiring team assignments linking recruiters and interviewers to specific opportunities.
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE public.opportunity_assignment_role AS ENUM (
    'lead_recruiter',
    'recruiter',
    'hiring_manager',
    'interviewer'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.opportunity_recruiters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assignment_role public.opportunity_assignment_role NOT NULL DEFAULT 'recruiter',
  assigned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_opp_recruiter UNIQUE (opportunity_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_opp_recruiters_opp ON public.opportunity_recruiters(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opp_recruiters_user ON public.opportunity_recruiters(user_id);

