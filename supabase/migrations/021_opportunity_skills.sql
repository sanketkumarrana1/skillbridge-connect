-- ==============================================================================
-- Migration: 021_opportunity_skills.sql
-- Description: Structured opportunity skill requirements linked to central skills taxonomy with weights.
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE public.opportunity_skill_requirement_type AS ENUM (
    'required',
    'preferred'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.opportunity_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE RESTRICT,
  requirement_type public.opportunity_skill_requirement_type NOT NULL DEFAULT 'required',
  minimum_level public.skill_self_level,
  weight INT NOT NULL DEFAULT 3 CHECK (weight >= 1 AND weight <= 10),
  mandatory BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_opportunity_skill UNIQUE (opportunity_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_opportunity_skills_opp ON public.opportunity_skills(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_skills_skill ON public.opportunity_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_skills_req_type ON public.opportunity_skills(requirement_type);

