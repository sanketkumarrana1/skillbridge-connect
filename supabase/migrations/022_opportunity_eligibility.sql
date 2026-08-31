-- ==============================================================================
-- Migration: 022_opportunity_eligibility.sql
-- Description: Structured opportunity eligibility rules for deterministic student evaluation.
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE public.eligibility_rule_type AS ENUM (
    'degree',
    'program',
    'department',
    'graduation_year',
    'minimum_cgpa',
    'experience',
    'location'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.opportunity_eligibility_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  rule_type public.eligibility_rule_type NOT NULL,
  operator TEXT NOT NULL DEFAULT 'in' CHECK (operator IN ('in', 'eq', 'gte', 'lte', 'contains')),
  value JSONB NOT NULL,
  is_mandatory BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_opp_eligibility_opp ON public.opportunity_eligibility_rules(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opp_eligibility_type ON public.opportunity_eligibility_rules(rule_type);

