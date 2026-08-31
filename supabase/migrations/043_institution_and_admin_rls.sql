-- ==============================================================================
-- Migration: 043_institution_and_admin_rls.sql
-- Description: Row Level Security for academic institutions and platform administrators.
-- ==============================================================================

ALTER TABLE public.institution_academic_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_student_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_moderation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Helper: check if user is a verified representative of the institution
CREATE OR REPLACE FUNCTION public.is_institution_member(p_institution_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_memberships m
    JOIN public.organizations o ON o.id = m.organization_id
    WHERE m.organization_id = p_institution_id
      AND m.user_id = p_user_id
      AND m.status = 'active'
      AND o.type = 'institution'
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public, pg_temp;

-- 2. Institution Academic Programs RLS
DROP POLICY IF EXISTS "View academic programs" ON public.institution_academic_programs;
CREATE POLICY "View academic programs"
  ON public.institution_academic_programs FOR SELECT
  TO authenticated
  USING (
    public.is_institution_member(institution_id, auth.uid())
    OR public.is_admin(auth.uid())
    OR EXISTS (SELECT 1 FROM public.student_profiles sp WHERE sp.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Manage academic programs" ON public.institution_academic_programs;
CREATE POLICY "Manage academic programs"
  ON public.institution_academic_programs FOR ALL
  TO authenticated
  USING (public.is_institution_member(institution_id, auth.uid()) OR public.is_admin(auth.uid()))
  WITH CHECK (public.is_institution_member(institution_id, auth.uid()) OR public.is_admin(auth.uid()));

-- 3. Institution Batches RLS
DROP POLICY IF EXISTS "View student batches" ON public.institution_student_batches;
CREATE POLICY "View student batches"
  ON public.institution_student_batches FOR SELECT
  TO authenticated
  USING (public.is_institution_member(institution_id, auth.uid()) OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Manage student batches" ON public.institution_student_batches;
CREATE POLICY "Manage student batches"
  ON public.institution_student_batches FOR ALL
  TO authenticated
  USING (public.is_institution_member(institution_id, auth.uid()) OR public.is_admin(auth.uid()))
  WITH CHECK (public.is_institution_member(institution_id, auth.uid()) OR public.is_admin(auth.uid()));

-- 4. Platform Moderation Queue RLS (Admins only)
DROP POLICY IF EXISTS "Admins manage moderation queue" ON public.platform_moderation_queue;
CREATE POLICY "Admins manage moderation queue"
  ON public.platform_moderation_queue FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- 5. Platform Audit Logs RLS (Admins only read, write-only via system procedures)
DROP POLICY IF EXISTS "Admins view audit logs" ON public.platform_audit_logs;
CREATE POLICY "Admins view audit logs"
  ON public.platform_audit_logs FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

