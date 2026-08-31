-- ==============================================================================
-- Migration: 011_student_skills.sql
-- Description: Student declared skills with proficiency level, score, and unique constraints.
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE public.skill_self_level AS ENUM (
    'beginner',
    'intermediate',
    'advanced'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.student_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE RESTRICT,
  self_level public.skill_self_level NOT NULL DEFAULT 'intermediate',
  self_score INT NOT NULL DEFAULT 50 CHECK (self_score >= 0 AND self_score <= 100),
  source TEXT NOT NULL DEFAULT 'self_declaration',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  first_declared_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_student_skill UNIQUE (student_id, skill_id)
);

CREATE TRIGGER set_student_skills_updated_at
  BEFORE UPDATE ON public.student_skills
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_student_skills_student ON public.student_skills(student_id);
CREATE INDEX IF NOT EXISTS idx_student_skills_skill ON public.student_skills(skill_id);

-- Enable Row Level Security
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Student can view own declared skills
CREATE POLICY "Students can view own declared skills"
  ON public.student_skills FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid()
    OR public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.student_profiles sp
      JOIN public.organization_memberships om ON om.organization_id = sp.institution_id
      WHERE sp.user_id = student_skills.student_id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
    )
  );

-- 2. Student can insert own declared skills (for active skills only)
CREATE POLICY "Students can insert own declared skills"
  ON public.student_skills FOR INSERT
  TO authenticated
  WITH CHECK (
    student_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.skills
      WHERE id = student_skills.skill_id
        AND status = 'active'
    )
  );

-- 3. Student can update own declared skills
CREATE POLICY "Students can update own declared skills"
  ON public.student_skills FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- 4. Student can delete own declared skills
CREATE POLICY "Students can delete own declared skills"
  ON public.student_skills FOR DELETE
  TO authenticated
  USING (student_id = auth.uid());

-- 5. Admins have full access
CREATE POLICY "Admins can manage student skills"
  ON public.student_skills FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

