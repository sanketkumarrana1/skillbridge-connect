-- ==============================================================================
-- Migration: 020_opportunities.sql
-- Description: Canonical opportunities table supporting internships, jobs, live projects, apprenticeships, and training programs.
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE public.opportunity_type AS ENUM (
    'internship',
    'job',
    'live_project',
    'apprenticeship',
    'training'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.opportunity_status AS ENUM (
    'draft',
    'pending_review',
    'published',
    'closed',
    'rejected',
    'archived'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.opportunity_work_mode AS ENUM (
    'remote',
    'hybrid',
    'onsite'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.opportunity_experience_level AS ENUM (
    'fresher',
    '0-1 yr',
    '1-2 yr',
    '2+ yr',
    'any'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 1. Canonical Opportunities Table
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  type public.opportunity_type NOT NULL DEFAULT 'internship',
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  description TEXT NOT NULL,
  responsibilities TEXT[] DEFAULT '{}',
  domain TEXT,
  category_id UUID REFERENCES public.skill_categories(id) ON DELETE SET NULL,
  status public.opportunity_status NOT NULL DEFAULT 'draft',
  location TEXT,
  work_mode public.opportunity_work_mode NOT NULL DEFAULT 'hybrid',
  experience_level public.opportunity_experience_level NOT NULL DEFAULT 'any',
  duration_value INT,
  duration_unit TEXT CHECK (duration_unit IN ('weeks', 'months', 'years', 'full_time')),
  duration_text TEXT,
  compensation_type TEXT NOT NULL DEFAULT 'Stipend' CHECK (compensation_type IN ('Stipend', 'Salary', 'Unpaid', 'Completion Bonus', 'Free')),
  compensation_min NUMERIC(12,2),
  compensation_max NUMERIC(12,2),
  compensation_currency TEXT NOT NULL DEFAULT 'INR',
  compensation_formatted TEXT,
  openings INT NOT NULL DEFAULT 1,
  hiring_process TEXT[] DEFAULT '{"Application Review", "Skill Assessment", "Technical Interview", "HR Round"}',
  application_deadline TIMESTAMPTZ NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  live_project_details JSONB,
  training_details JSONB,
  posted_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_opportunities_updated_at
  BEFORE UPDATE ON public.opportunities
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_opportunities_company ON public.opportunities(company_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON public.opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opportunities_type ON public.opportunities(type);
CREATE INDEX IF NOT EXISTS idx_opportunities_deadline ON public.opportunities(application_deadline);
CREATE INDEX IF NOT EXISTS idx_opportunities_published ON public.opportunities(published_at);
CREATE INDEX IF NOT EXISTS idx_opportunities_work_mode ON public.opportunities(work_mode);
CREATE INDEX IF NOT EXISTS idx_opportunities_category ON public.opportunities(category_id);

