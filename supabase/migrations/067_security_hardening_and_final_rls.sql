-- ==============================================================================
-- Migration: 067_security_hardening_and_final_rls.sql
-- Description: Phase 3.1 Production Security Hardening & Final Comprehensive RLS Audit.
-- ==============================================================================

-- 1. HARDEN SECURITY DEFINER SEARCH PATHS
-- Explicitly lock search_path to public, pg_temp on all core system functions to prevent search-path injection.

ALTER FUNCTION public.handle_new_user() SET search_path = public, pg_temp;
ALTER FUNCTION public.is_admin(UUID) SET search_path = public, pg_temp;
ALTER FUNCTION public.is_company_member(UUID) SET search_path = public, pg_temp;
ALTER FUNCTION public.is_opportunity_recruiter(UUID, UUID) SET search_path = public, pg_temp;
ALTER FUNCTION public.is_application_recruiter(UUID, UUID) SET search_path = public, pg_temp;
ALTER FUNCTION public.is_institution_member(UUID, UUID) SET search_path = public, pg_temp;

-- 2. REVOKE DEFAULT PUBLIC EXECUTION & GRANT STRICTLY TO AUTHENTICATED
REVOKE EXECUTE ON FUNCTION public.admin_moderate_opportunity(UUID, public.opportunity_status_enum, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_moderate_opportunity(UUID, public.opportunity_status_enum, TEXT) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.admin_verify_company(UUID, public.company_verification_status_enum, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_verify_company(UUID, public.company_verification_status_enum, TEXT) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.admin_get_platform_metrics() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_get_platform_metrics() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.apply_to_opportunity(UUID, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.apply_to_opportunity(UUID, TEXT, TEXT) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.update_application_status(UUID, public.application_status, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_application_status(UUID, public.application_status, TEXT) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.schedule_interview(UUID, public.interview_type, TEXT, TIMESTAMPTZ, TIMESTAMPTZ, TEXT, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.schedule_interview(UUID, public.interview_type, TEXT, TIMESTAMPTZ, TIMESTAMPTZ, TEXT, TEXT, TEXT) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.create_offer(UUID, TEXT, NUMERIC, DATE, TEXT, TIMESTAMPTZ, NUMERIC, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_offer(UUID, TEXT, NUMERIC, DATE, TEXT, TIMESTAMPTZ, NUMERIC, TEXT) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.respond_to_offer(UUID, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.respond_to_offer(UUID, TEXT, TEXT) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.get_admin_ai_telemetry() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_admin_ai_telemetry() TO authenticated;

-- 3. STORAGE BUCKET CONFIGURATION & RLS POLICIES
-- Create storage buckets if they do not exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp']),
  ('resumes', 'resumes', false, 10485760, ARRAY['application/pdf']),
  ('certificates', 'certificates', false, 10485760, ARRAY['application/pdf', 'image/png', 'image/jpeg']),
  ('marksheets', 'marksheets', false, 10485760, ARRAY['application/pdf', 'image/png', 'image/jpeg']),
  ('reports', 'reports', false, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage Object RLS Policies
-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Avatars: Public read, owner manage
DROP POLICY IF EXISTS "Public view avatars" ON storage.objects;
CREATE POLICY "Public view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users manage own avatars" ON storage.objects;
CREATE POLICY "Users manage own avatars"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Resumes: Student owner manage, authorized recruiters view
DROP POLICY IF EXISTS "Students manage own resumes" ON storage.objects;
CREATE POLICY "Students manage own resumes"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'resumes' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_admin(auth.uid())))
  WITH CHECK (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Recruiters view applicant resumes" ON storage.objects;
CREATE POLICY "Recruiters view applicant resumes"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'resumes'
    AND EXISTS (
      SELECT 1 FROM public.applications a
      WHERE a.student_id = ((storage.foldername(name))[1])::uuid
        AND public.is_application_recruiter(a.id, auth.uid())
    )
  );

-- Certificates & Marksheets: Student owner manage & view, verified recruiters view on application
DROP POLICY IF EXISTS "Students manage own certificates" ON storage.objects;
CREATE POLICY "Students manage own certificates"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id IN ('certificates', 'marksheets') AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_admin(auth.uid())))
  WITH CHECK (bucket_id IN ('certificates', 'marksheets') AND (storage.foldername(name))[1] = auth.uid()::text);

-- Reports: Owner manage, admins view
DROP POLICY IF EXISTS "Users manage own reports" ON storage.objects;
CREATE POLICY "Users manage own reports"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'reports' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_admin(auth.uid())))
  WITH CHECK (bucket_id = 'reports' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 4. VERIFY IMMUTABLE AUDIT LOG PROTECTION
-- Ensure platform_audit_logs and company_audit_logs CANNOT be modified or deleted by non-superusers
REVOKE UPDATE, DELETE, TRUNCATE ON public.platform_audit_logs FROM authenticated, anon, PUBLIC;
REVOKE UPDATE, DELETE, TRUNCATE ON public.company_audit_logs FROM authenticated, anon, PUBLIC;

