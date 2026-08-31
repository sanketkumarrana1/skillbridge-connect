-- ==============================================================================
-- Migration: 028_application_snapshots_and_history.sql
-- Description: Immutable point-in-time application snapshots and state transition history.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.application_profile_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  college TEXT NOT NULL,
  degree TEXT NOT NULL,
  branch TEXT NOT NULL,
  graduation_year TEXT NOT NULL,
  cgpa NUMERIC(4,2),
  skills JSONB NOT NULL DEFAULT '[]',
  assessed_skills JSONB NOT NULL DEFAULT '[]',
  projects JSONB NOT NULL DEFAULT '[]',
  certifications JSONB NOT NULL DEFAULT '[]',
  captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_app_snapshot UNIQUE(application_id)
);

CREATE TABLE IF NOT EXISTS public.application_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  from_status public.application_status,
  to_status public.application_status NOT NULL,
  changed_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_app_history_app ON public.application_status_history(application_id);

