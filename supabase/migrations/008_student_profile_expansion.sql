-- ==============================================================================
-- Migration: 008_student_profile_expansion.sql
-- Description: Extends student_profiles with academic credentials, program details, and onboarding completion status.
-- ==============================================================================

-- Add new academic profile columns to student_profiles
ALTER TABLE public.student_profiles
  ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS degree TEXT,
  ADD COLUMN IF NOT EXISTS program TEXT,
  ADD COLUMN IF NOT EXISTS academic_year TEXT,
  ADD COLUMN IF NOT EXISTS academic_status TEXT NOT NULL DEFAULT 'Enrolled',
  ADD COLUMN IF NOT EXISTS grade TEXT,
  ADD COLUMN IF NOT EXISTS headline TEXT,
  ADD COLUMN IF NOT EXISTS about TEXT,
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE;

-- Index for institution-level student lookups
CREATE INDEX IF NOT EXISTS idx_student_profiles_inst ON public.student_profiles(institution_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_dept ON public.student_profiles(department_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_onboarding ON public.student_profiles(onboarding_completed);

-- Institution staff read access policy for enrolled students
DROP POLICY IF EXISTS "Institution staff can view enrolled student profiles" ON public.student_profiles;
CREATE POLICY "Institution staff can view enrolled student profiles"
  ON public.student_profiles FOR SELECT
  TO authenticated
  USING (
    institution_id IS NOT NULL AND
    (
      EXISTS (
        SELECT 1 FROM public.organization_memberships
        WHERE organization_id = student_profiles.institution_id
          AND user_id = auth.uid()
          AND status = 'active'
      )
      OR user_id = auth.uid()
      OR public.is_admin(auth.uid())
    )
  );

