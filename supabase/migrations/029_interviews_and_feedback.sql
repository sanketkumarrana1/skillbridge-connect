-- ==============================================================================
-- Migration: 029_interviews_and_feedback.sql
-- Description: Interview scheduling and structured interviewer feedback.
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE public.interview_type AS ENUM (
    'technical',
    'hr',
    'cultural',
    'system_design',
    'coding_live',
    'final_round'
  );
  CREATE TYPE public.interview_status AS ENUM (
    'scheduled',
    'in_progress',
    'completed',
    'cancelled',
    'rescheduled',
    'no_show'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  interviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  interview_type public.interview_type NOT NULL DEFAULT 'technical',
  title TEXT NOT NULL,
  scheduled_start TIMESTAMPTZ NOT NULL,
  scheduled_end TIMESTAMPTZ NOT NULL,
  meeting_url TEXT,
  location TEXT,
  status public.interview_status NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.interview_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID NOT NULL REFERENCES public.interviews(id) ON DELETE CASCADE,
  interviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  technical_rating INT NOT NULL CHECK (technical_rating BETWEEN 1 AND 5),
  communication_rating INT NOT NULL CHECK (communication_rating BETWEEN 1 AND 5),
  culture_fit_rating INT NOT NULL CHECK (culture_fit_rating BETWEEN 1 AND 5),
  overall_rating INT NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  strengths TEXT,
  areas_for_improvement TEXT,
  recommendation TEXT NOT NULL,
  private_recruiter_notes TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_interview_interviewer_feedback UNIQUE(interview_id, interviewer_id)
);

CREATE INDEX IF NOT EXISTS idx_interviews_application ON public.interviews(application_id);
CREATE INDEX IF NOT EXISTS idx_interview_feedback_interview ON public.interview_feedback(interview_id);

