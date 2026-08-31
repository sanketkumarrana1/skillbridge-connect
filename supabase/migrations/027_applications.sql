-- ==============================================================================
-- Migration: 027_applications.sql
-- Description: Core applications table for student recruitment lifecycle.
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE public.application_status AS ENUM (
    'draft',
    'applied',
    'under_review',
    'shortlisted',
    'interview_scheduled',
    'interview_completed',
    'offered',
    'accepted',
    'declined',
    'rejected',
    'withdrawn'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  status public.application_status NOT NULL DEFAULT 'applied',
  cover_note TEXT,
  resume_url TEXT,
  match_score NUMERIC(5,2),
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_student_opportunity UNIQUE(student_id, opportunity_id)
);

CREATE INDEX IF NOT EXISTS idx_applications_student ON public.applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_opportunity ON public.applications(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);

