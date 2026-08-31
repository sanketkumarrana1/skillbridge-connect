-- ==============================================================================
-- Migration: 023_opportunity_target_roles_and_saved.sql
-- Description: Opportunity target role mappings and student saved opportunities persistence.
-- ==============================================================================

-- 1. Opportunity Target Roles Mapping
CREATE TABLE IF NOT EXISTS public.opportunity_target_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  target_role_id UUID NOT NULL REFERENCES public.target_roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_opp_target_role UNIQUE (opportunity_id, target_role_id)
);

CREATE INDEX IF NOT EXISTS idx_opp_target_roles_opp ON public.opportunity_target_roles(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opp_target_roles_role ON public.opportunity_target_roles(target_role_id);

-- 2. Saved Opportunities Table
CREATE TABLE IF NOT EXISTS public.saved_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_saved_opportunity UNIQUE (student_id, opportunity_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_opp_student ON public.saved_opportunities(student_id);
CREATE INDEX IF NOT EXISTS idx_saved_opp_opp ON public.saved_opportunities(opportunity_id);

