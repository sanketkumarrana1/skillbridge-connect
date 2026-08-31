-- ==============================================================================
-- Migration: 031_recruitment_rls.sql
-- Description: Row Level Security for applications, snapshots, interviews, feedback, offers, and placements.
-- ==============================================================================

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_profile_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placements ENABLE ROW LEVEL SECURITY;

-- 1. Helper function: check if user is a member of the company that owns the opportunity
CREATE OR REPLACE FUNCTION public.is_opportunity_recruiter(p_opportunity_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.opportunities o
    JOIN public.organization_memberships m ON m.organization_id = o.organization_id
    WHERE o.id = p_opportunity_id
      AND m.user_id = p_user_id
      AND m.status = 'active'
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public, pg_temp;

-- Helper function: check if user is a member of the company that owns the application
CREATE OR REPLACE FUNCTION public.is_application_recruiter(p_application_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.applications a
    JOIN public.opportunities o ON o.id = a.opportunity_id
    JOIN public.organization_memberships m ON m.organization_id = o.organization_id
    WHERE a.id = p_application_id
      AND m.user_id = p_user_id
      AND m.status = 'active'
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public, pg_temp;

-- 2. Applications RLS
DROP POLICY IF EXISTS "Students view own applications" ON public.applications;
CREATE POLICY "Students view own applications"
  ON public.applications FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() OR public.is_application_recruiter(id, auth.uid()) OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Students insert own applications" ON public.applications;
CREATE POLICY "Students insert own applications"
  ON public.applications FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "Recruiters and admins update applications" ON public.applications;
CREATE POLICY "Recruiters and admins update applications"
  ON public.applications FOR UPDATE
  TO authenticated
  USING (public.is_application_recruiter(id, auth.uid()) OR public.is_admin(auth.uid()))
  WITH CHECK (public.is_application_recruiter(id, auth.uid()) OR public.is_admin(auth.uid()));

-- 3. Snapshots RLS
DROP POLICY IF EXISTS "View snapshots" ON public.application_profile_snapshots;
CREATE POLICY "View snapshots"
  ON public.application_profile_snapshots FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.applications a
      WHERE a.id = application_id
        AND (a.student_id = auth.uid() OR public.is_application_recruiter(a.id, auth.uid()) OR public.is_admin(auth.uid()))
    )
  );

-- 4. Status History RLS
DROP POLICY IF EXISTS "View status history" ON public.application_status_history;
CREATE POLICY "View status history"
  ON public.application_status_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.applications a
      WHERE a.id = application_id
        AND (a.student_id = auth.uid() OR public.is_application_recruiter(a.id, auth.uid()) OR public.is_admin(auth.uid()))
    )
  );

-- 5. Interviews RLS
DROP POLICY IF EXISTS "View interviews" ON public.interviews;
CREATE POLICY "View interviews"
  ON public.interviews FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.applications a
      WHERE a.id = application_id
        AND (a.student_id = auth.uid() OR public.is_application_recruiter(a.id, auth.uid()) OR public.is_admin(auth.uid()))
    )
  );

DROP POLICY IF EXISTS "Manage interviews" ON public.interviews;
CREATE POLICY "Manage interviews"
  ON public.interviews FOR ALL
  TO authenticated
  USING (public.is_application_recruiter(application_id, auth.uid()) OR public.is_admin(auth.uid()))
  WITH CHECK (public.is_application_recruiter(application_id, auth.uid()) OR public.is_admin(auth.uid()));

-- 6. Interview Feedback RLS (Students CANNOT see private recruiter notes)
DROP POLICY IF EXISTS "Recruiters and Admins view feedback" ON public.interview_feedback;
CREATE POLICY "Recruiters and Admins view feedback"
  ON public.interview_feedback FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.interviews i
      WHERE i.id = interview_id
        AND (public.is_application_recruiter(i.application_id, auth.uid()) OR public.is_admin(auth.uid()))
    )
  );

DROP POLICY IF EXISTS "Interviewer submit feedback" ON public.interview_feedback;
CREATE POLICY "Interviewer submit feedback"
  ON public.interview_feedback FOR INSERT
  TO authenticated
  WITH CHECK (interviewer_id = auth.uid());

-- 7. Offers RLS
DROP POLICY IF EXISTS "View offers" ON public.offers;
CREATE POLICY "View offers"
  ON public.offers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.applications a
      WHERE a.id = application_id
        AND (a.student_id = auth.uid() OR public.is_application_recruiter(a.id, auth.uid()) OR public.is_admin(auth.uid()))
    )
  );

DROP POLICY IF EXISTS "Manage offers" ON public.offers;
CREATE POLICY "Manage offers"
  ON public.offers FOR ALL
  TO authenticated
  USING (public.is_application_recruiter(application_id, auth.uid()) OR public.is_admin(auth.uid()))
  WITH CHECK (public.is_application_recruiter(application_id, auth.uid()) OR public.is_admin(auth.uid()));

-- 8. Placements RLS
DROP POLICY IF EXISTS "View placements" ON public.placements;
CREATE POLICY "View placements"
  ON public.placements FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() OR public.is_company_member(company_id) OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Manage placements" ON public.placements;
CREATE POLICY "Manage placements"
  ON public.placements FOR ALL
  TO authenticated
  USING (public.is_company_member(company_id) OR public.is_admin(auth.uid()))
  WITH CHECK (public.is_company_member(company_id) OR public.is_admin(auth.uid()));

