-- ==============================================================================
-- Migration: 007_departments.sql
-- Description: Institutional departments table with uniqueness constraints and scoped RLS.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_institution_dept_name UNIQUE (institution_id, name)
);

-- Optional unique constraint on non-null department codes per institution
CREATE UNIQUE INDEX IF NOT EXISTS uq_institution_dept_code
  ON public.departments (institution_id, code)
  WHERE code IS NOT NULL;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS set_departments_updated_at ON public.departments;
CREATE TRIGGER set_departments_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Index for lookup by institution
CREATE INDEX IF NOT EXISTS idx_departments_institution_id ON public.departments(institution_id);

-- Enable Row Level Security
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Authenticated users can view active departments" ON public.departments;
CREATE POLICY "Authenticated users can view active departments"
  ON public.departments FOR SELECT
  TO authenticated
  USING (status = 'active' OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Institution members can manage departments" ON public.departments;
CREATE POLICY "Institution members can manage departments"
  ON public.departments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_memberships
      WHERE organization_id = departments.institution_id
        AND user_id = auth.uid()
        AND status = 'active'
    )
    OR public.is_admin(auth.uid())
  );

