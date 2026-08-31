-- ==============================================================================
-- Migration: 037_company_audit_logs.sql
-- Description: Audit trail for company profile changes, recruiter membership changes, and opportunity actions.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.company_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_company_audit_company ON public.company_audit_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_company_audit_created ON public.company_audit_logs(created_at DESC);

