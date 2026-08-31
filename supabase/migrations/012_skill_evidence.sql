-- ==============================================================================
-- Migration: 012_skill_evidence.sql
-- Description: Verifiable skill evidence items linked to declared skills with lifecycle verification states.
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE public.evidence_verification_status AS ENUM (
    'self_declared',
    'evidence_added',
    'pending_verification',
    'verified'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.skill_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_skill_id UUID NOT NULL REFERENCES public.student_skills(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  evidence_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  linked_entity_id TEXT,
  linked_entity_type TEXT,
  document_id TEXT,
  evidence_date TEXT,
  verification_status public.evidence_verification_status NOT NULL DEFAULT 'evidence_added',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_skill_evidence_updated_at
  BEFORE UPDATE ON public.skill_evidence
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_skill_evidence_student_skill ON public.skill_evidence(student_skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_evidence_student ON public.skill_evidence(student_id);
CREATE INDEX IF NOT EXISTS idx_skill_evidence_status ON public.skill_evidence(verification_status);

-- Enable Row Level Security
ALTER TABLE public.skill_evidence ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Students can view own skill evidence (and institution staff for enrolled students)
CREATE POLICY "Students can view own skill evidence"
  ON public.skill_evidence FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid()
    OR public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.student_profiles sp
      JOIN public.organization_memberships om ON om.organization_id = sp.institution_id
      WHERE sp.user_id = skill_evidence.student_id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
    )
  );

-- 2. Students can insert own skill evidence
CREATE POLICY "Students can insert own skill evidence"
  ON public.skill_evidence FOR INSERT
  TO authenticated
  WITH CHECK (
    student_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.student_skills
      WHERE id = skill_evidence.student_skill_id
        AND student_id = auth.uid()
    )
  );

-- 3. Students can update own skill evidence
CREATE POLICY "Students can update own skill evidence"
  ON public.skill_evidence FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- 4. Students can delete own skill evidence
CREATE POLICY "Students can delete own skill evidence"
  ON public.skill_evidence FOR DELETE
  TO authenticated
  USING (student_id = auth.uid());

-- 5. Admins have full access
CREATE POLICY "Admins can manage skill evidence"
  ON public.skill_evidence FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

