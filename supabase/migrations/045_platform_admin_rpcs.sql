-- ==============================================================================
-- Migration: 045_platform_admin_rpcs.sql
-- Description: Server-authoritative platform administration, moderation, and verification RPCs.
-- ==============================================================================

-- 1. Admin Moderate Opportunity RPC
CREATE OR REPLACE FUNCTION public.admin_moderate_opportunity(
  p_opportunity_id UUID,
  p_new_status public.opportunity_status_enum,
  p_moderator_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL OR NOT public.is_admin(v_caller_id) THEN
    RAISE EXCEPTION 'Access denied. Platform Admin authorization required.';
  END IF;

  UPDATE public.opportunities
  SET status = p_new_status, updated_at = NOW()
  WHERE id = p_opportunity_id;

  -- Log action
  INSERT INTO public.platform_audit_logs (
    actor_user_id,
    action_type,
    entity_type,
    entity_id,
    details
  ) VALUES (
    v_caller_id,
    'MODERATE_OPPORTUNITY',
    'opportunity',
    p_opportunity_id,
    jsonb_build_object('new_status', p_new_status, 'notes', p_moderator_notes)
  );

  RETURN jsonb_build_object('success', true, 'opportunity_id', p_opportunity_id, 'status', p_new_status);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 2. Admin Verify Company RPC
CREATE OR REPLACE FUNCTION public.admin_verify_company(
  p_company_id UUID,
  p_status public.company_verification_status_enum,
  p_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL OR NOT public.is_admin(v_caller_id) THEN
    RAISE EXCEPTION 'Access denied. Platform Admin authorization required.';
  END IF;

  UPDATE public.companies
  SET verification_status = p_status, updated_at = NOW()
  WHERE organization_id = p_company_id;

  -- Log action
  INSERT INTO public.platform_audit_logs (
    actor_user_id,
    action_type,
    entity_type,
    entity_id,
    details
  ) VALUES (
    v_caller_id,
    'VERIFY_COMPANY',
    'company',
    p_company_id,
    jsonb_build_object('verification_status', p_status, 'notes', p_notes)
  );

  RETURN jsonb_build_object('success', true, 'company_id', p_company_id, 'verification_status', p_status);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 3. Admin Get Platform Overview Metrics RPC
CREATE OR REPLACE FUNCTION public.admin_get_platform_metrics()
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_total_users INT;
  v_total_students INT;
  v_total_companies INT;
  v_total_opportunities INT;
  v_total_applications INT;
  v_total_placements INT;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL OR NOT public.is_admin(v_caller_id) THEN
    RAISE EXCEPTION 'Access denied. Platform Admin authorization required.';
  END IF;

  SELECT COUNT(*) INTO v_total_users FROM public.profiles;
  SELECT COUNT(*) INTO v_total_students FROM public.student_profiles;
  SELECT COUNT(*) INTO v_total_companies FROM public.companies;
  SELECT COUNT(*) INTO v_total_opportunities FROM public.opportunities;
  SELECT COUNT(*) INTO v_total_applications FROM public.applications;
  SELECT COUNT(*) INTO v_total_placements FROM public.placements;

  RETURN jsonb_build_object(
    'total_users', v_total_users,
    'total_students', v_total_students,
    'total_companies', v_total_companies,
    'total_opportunities', v_total_opportunities,
    'total_applications', v_total_applications,
    'total_placements', v_total_placements
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

