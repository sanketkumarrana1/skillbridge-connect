-- ==============================================================================
-- Migration: 041_institution_extensions.sql
-- Description: Institution academic structure, departments, programs, and student batch rosters.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.institution_academic_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  program_name TEXT NOT NULL,
  degree_level TEXT NOT NULL, -- 'B.Tech', 'M.Tech', 'B.Sc', 'MCA', etc.
  duration_years INT NOT NULL DEFAULT 4,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.institution_student_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  program_id UUID REFERENCES public.institution_academic_programs(id) ON DELETE CASCADE,
  graduation_year INT NOT NULL,
  batch_name TEXT NOT NULL,
  total_students INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_institution_batch UNIQUE(institution_id, program_id, graduation_year)
);

CREATE INDEX IF NOT EXISTS idx_inst_programs_inst ON public.institution_academic_programs(institution_id);
CREATE INDEX IF NOT EXISTS idx_inst_batches_inst ON public.institution_student_batches(institution_id);

