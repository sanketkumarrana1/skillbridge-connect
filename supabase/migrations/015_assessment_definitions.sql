-- ==============================================================================
-- Migration: 015_assessment_definitions.sql
-- Description: Assessment definitions and templates (skill_verification, career_readiness, comprehensive).
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE public.assessment_type AS ENUM (
    'skill_verification',
    'career_readiness',
    'comprehensive'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.assessment_mode AS ENUM (
    'personalized',
    'standard'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  assessment_type public.assessment_type NOT NULL DEFAULT 'skill_verification',
  mode public.assessment_mode NOT NULL DEFAULT 'personalized',
  question_count INT NOT NULL DEFAULT 20,
  duration_minutes INT NOT NULL DEFAULT 15,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'archived')),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_assessments_updated_at
  BEFORE UPDATE ON public.assessments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone authenticated can view active assessments"
  ON public.assessments FOR SELECT
  TO authenticated
  USING (status = 'active' OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage assessments"
  ON public.assessments FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Insert Default Standard Assessments
INSERT INTO public.assessments (name, slug, description, assessment_type, mode, question_count, duration_minutes)
VALUES
  ('Skill Verification Assessment', 'skill-verification-default', 'Domain-calibrated adaptive skill assessment for verified competency badges.', 'skill_verification', 'personalized', 20, 15),
  ('Career Readiness Diagnostic', 'career-readiness-diagnostic', 'Comprehensive multi-domain evaluation for employability readiness scoring.', 'career_readiness', 'personalized', 20, 15),
  ('Comprehensive Technical Benchmark', 'comprehensive-benchmark', 'Deep full-stack and foundational computer science verification benchmark.', 'comprehensive', 'personalized', 30, 25)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  question_count = EXCLUDED.question_count,
  duration_minutes = EXCLUDED.duration_minutes;

