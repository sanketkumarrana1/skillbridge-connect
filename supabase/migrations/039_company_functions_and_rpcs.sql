-- ==============================================================================
-- Migration: 039_company_functions_and_rpcs.sql
-- Description: Company authorization helpers, profile management, verification, team assignments, and recruitment analytics RPCs.
-- ==============================================================================

-- 1. Helper: is_company_member
CREATE OR REPLACE FUNCTION public.is_company_member(p_company_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_memberships
    WHERE organization_id = p_company_id
      AND user_id = p_user_id
      AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 2. Helper: is_company_admin
CREATE OR REPLACE FUNCTION public.is_company_admin(p_company_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_memberships
    WHERE organization_id = p_company_id
      AND user_id = p_user_id
      AND membership_role IN ('owner', 'admin')
      AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 3. Helper: has_company_permission
CREATE OR REPLACE FUNCTION public.has_company_permission(p_company_id UUID, p_user_id UUID, p_permission TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_role public.membership_role;
BEGIN
  IF public.is_admin(p_user_id) THEN
    RETURN TRUE;
  END IF;

  SELECT membership_role INTO v_role
  FROM public.organization_memberships
  WHERE organization_id = p_company_id
    AND user_id = p_user_id
    AND status = 'active';

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Match against recruiter_role_permissions
  RETURN EXISTS (
    SELECT 1 FROM public.recruiter_role_permissions
    WHERE role::TEXT = v_role::TEXT
      AND permission::TEXT = p_permission
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 4. RPC: get_company_profile
CREATE OR REPLACE FUNCTION public.get_company_profile(p_company_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_org RECORD;
  v_recruiters JSONB;
BEGIN
  SELECT * INTO v_org FROM public.organizations WHERE id = p_company_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Company not found.';
  END IF;

  -- If caller is a member, include recruiter roster
  IF public.is_company_member(p_company_id, auth.uid()) OR public.is_admin(auth.uid()) THEN
    SELECT jsonb_agg(
      jsonb_build_object(
        'user_id', p.id,
        'name', p.full_name,
        'email', p.email,
        'role', om.membership_role,
        'status', om.status,
        'joined_at', om.created_at
      )
    ) INTO v_recruiters
    FROM public.organization_memberships om
    JOIN public.profiles p ON p.id = om.user_id
    WHERE om.organization_id = p_company_id;
  ELSE
    v_recruiters := '[]'::jsonb;
  END IF;

  RETURN jsonb_build_object(
    'id', v_org.id,
    'name', v_org.name,
    'display_name', COALESCE(v_org.display_name, v_org.name),
    'slug', v_org.slug,
    'industry', v_org.industry,
    'company_size', v_org.company_size,
    'founded_year', v_org.founded_year,
    'description', v_org.description,
    'headquarters_location', COALESCE(v_org.headquarters_location, v_org.city || ', ' || v_org.state),
    'website', v_org.website,
    'logo_url', v_org.logo_url,
    'logo_hue', v_org.logo_hue,
    'verification_status', v_org.verification_status,
    'verified_at', v_org.verified_at,
    'recruiters', COALESCE(v_recruiters, '[]'::jsonb)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. RPC: update_company_profile
CREATE OR REPLACE FUNCTION public.update_company_profile(
  p_company_id UUID,
  p_data JSONB
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthenticated request.';
  END IF;

  IF NOT (public.has_company_permission(p_company_id, v_caller_id, 'manage_company_profile') OR public.is_admin(v_caller_id)) THEN
    RAISE EXCEPTION 'Unauthorized: You do not have permission to update this company profile.';
  END IF;

  UPDATE public.organizations
  SET
    name = COALESCE(p_data->>'name', name),
    display_name = COALESCE(p_data->>'display_name', p_data->>'name', display_name),
    industry = COALESCE(p_data->>'industry', industry),
    company_size = COALESCE(p_data->>'company_size', company_size),
    founded_year = COALESCE(p_data->>'founded_year', founded_year),
    description = COALESCE(p_data->>'description', description),
    headquarters_location = COALESCE(p_data->>'location', p_data->>'headquarters_location', headquarters_location),
    website = COALESCE(p_data->>'website', website),
    logo_hue = COALESCE((p_data->>'logo_hue')::INTEGER, (p_data->>'logoHue')::INTEGER, logo_hue),
    updated_at = NOW()
  WHERE id = p_company_id;

  INSERT INTO public.company_audit_logs (
    company_id,
    actor_id,
    action,
    target_type,
    target_id,
    details
  ) VALUES (
    p_company_id,
    v_caller_id,
    'company_profile_updated',
    'organization',
    p_company_id::TEXT,
    p_data
  );

  RETURN jsonb_build_object('success', true, 'company_id', p_company_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. RPC: submit_company_verification
CREATE OR REPLACE FUNCTION public.submit_company_verification(
  p_company_id UUID,
  p_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthenticated request.';
  END IF;

  IF NOT (public.is_company_admin(p_company_id, v_caller_id) OR public.is_admin(v_caller_id)) THEN
    RAISE EXCEPTION 'Unauthorized: Only company admins can submit verification requests.';
  END IF;

  UPDATE public.organizations
  SET
    verification_status = 'pending',
    verification_submitted_at = NOW(),
    verification_notes = p_notes,
    updated_at = NOW()
  WHERE id = p_company_id;

  INSERT INTO public.company_audit_logs (
    company_id,
    actor_id,
    action,
    target_type,
    target_id,
    details
  ) VALUES (
    p_company_id,
    v_caller_id,
    'verification_submitted',
    'organization',
    p_company_id::TEXT,
    jsonb_build_object('notes', p_notes)
  );

  RETURN jsonb_build_object('success', true, 'status', 'pending');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. RPC: add_company_recruiter
CREATE OR REPLACE FUNCTION public.add_company_recruiter(
  p_company_id UUID,
  p_user_id UUID,
  p_role TEXT DEFAULT 'recruiter'
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthenticated request.';
  END IF;

  IF NOT (public.has_company_permission(p_company_id, v_caller_id, 'manage_recruiters') OR public.is_admin(v_caller_id)) THEN
    RAISE EXCEPTION 'Unauthorized to manage company recruiters.';
  END IF;

  INSERT INTO public.organization_memberships (
    organization_id,
    user_id,
    membership_role,
    status
  ) VALUES (
    p_company_id,
    p_user_id,
    p_role::public.membership_role,
    'active'
  )
  ON CONFLICT (organization_id, user_id) DO UPDATE SET
    membership_role = p_role::public.membership_role,
    status = 'active',
    updated_at = NOW();

  INSERT INTO public.company_audit_logs (
    company_id,
    actor_id,
    action,
    target_type,
    target_id,
    details
  ) VALUES (
    p_company_id,
    v_caller_id,
    'recruiter_added',
    'membership',
    p_user_id::TEXT,
    jsonb_build_object('role', p_role)
  );

  RETURN jsonb_build_object('success', true, 'user_id', p_user_id, 'role', p_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. RPC: assign_opportunity_recruiter
CREATE OR REPLACE FUNCTION public.assign_opportunity_recruiter(
  p_opportunity_id UUID,
  p_user_id UUID,
  p_role TEXT DEFAULT 'recruiter'
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_opp RECORD;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthenticated request.';
  END IF;

  SELECT * INTO v_opp FROM public.opportunities WHERE id = p_opportunity_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Opportunity not found.';
  END IF;

  IF NOT (public.has_company_permission(v_opp.company_id, v_caller_id, 'manage_recruiters') OR public.is_admin(v_caller_id)) THEN
    RAISE EXCEPTION 'Unauthorized to assign hiring team members.';
  END IF;

  INSERT INTO public.opportunity_recruiters (
    opportunity_id,
    user_id,
    assignment_role,
    assigned_by
  ) VALUES (
    p_opportunity_id,
    p_user_id,
    p_role::public.opportunity_assignment_role,
    v_caller_id
  )
  ON CONFLICT (opportunity_id, user_id) DO UPDATE SET
    assignment_role = p_role::public.opportunity_assignment_role;

  RETURN jsonb_build_object('success', true, 'opportunity_id', p_opportunity_id, 'user_id', p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. RPC: get_company_recruitment_metrics (Dynamic aggregation from live tables)
CREATE OR REPLACE FUNCTION public.get_company_recruitment_metrics(p_company_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_active_opps INTEGER := 0;
  v_total_apps INTEGER := 0;
  v_under_review INTEGER := 0;
  v_shortlisted INTEGER := 0;
  v_interviews INTEGER := 0;
  v_offers INTEGER := 0;
  v_hires INTEGER := 0;
  v_rejected INTEGER := 0;
  v_shortlist_rate INTEGER := 0;
  v_interview_conv INTEGER := 0;
  v_offer_conv INTEGER := 0;
  v_hiring_conv INTEGER := 0;
BEGIN
  -- Active published opportunities
  SELECT COUNT(*) INTO v_active_opps
  FROM public.opportunities
  WHERE company_id = p_company_id AND status = 'published';

  -- Aggregate application pipeline counts
  SELECT
    COUNT(*),
    COUNT(*) FILTER (WHERE a.status IN ('under_review', 'applied')),
    COUNT(*) FILTER (WHERE a.status = 'shortlisted'),
    COUNT(*) FILTER (WHERE a.status = 'interview'),
    COUNT(*) FILTER (WHERE a.status = 'offer'),
    COUNT(*) FILTER (WHERE a.status = 'hired'),
    COUNT(*) FILTER (WHERE a.status = 'rejected')
  INTO
    v_total_apps,
    v_under_review,
    v_shortlisted,
    v_interviews,
    v_offers,
    v_hires,
    v_rejected
  FROM public.applications a
  JOIN public.opportunities o ON o.id = a.opportunity_id
  WHERE o.company_id = p_company_id;

  IF v_total_apps > 0 THEN
    v_shortlist_rate := ROUND((v_shortlisted::NUMERIC / v_total_apps::NUMERIC) * 100);
    v_hiring_conv := ROUND((v_hires::NUMERIC / v_total_apps::NUMERIC) * 100);
  END IF;

  IF v_shortlisted > 0 THEN
    v_interview_conv := ROUND((v_interviews::NUMERIC / v_shortlisted::NUMERIC) * 100);
  END IF;

  IF v_interviews > 0 THEN
    v_offer_conv := ROUND((v_offers::NUMERIC / v_interviews::NUMERIC) * 100);
  END IF;

  RETURN jsonb_build_object(
    'activeOpportunities', v_active_opps,
    'totalApplicants', v_total_apps,
    'underReviewCount', v_under_review,
    'shortlistedCount', v_shortlisted,
    'assessmentCount', 0,
    'interviewsCount', v_interviews,
    'offersCount', v_offers,
    'hiresCount', v_hires,
    'rejectedCount', v_rejected,
    'shortlistRate', v_shortlist_rate,
    'interviewConversion', v_interview_conv,
    'offerConversion', v_offer_conv,
    'hiringConversion', v_hiring_conv
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. RPC: get_opportunity_performance
CREATE OR REPLACE FUNCTION public.get_opportunity_performance(p_opportunity_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_opp RECORD;
  v_total INTEGER := 0;
  v_shortlisted INTEGER := 0;
  v_interviews INTEGER := 0;
  v_offers INTEGER := 0;
  v_hires INTEGER := 0;
  v_avg_match NUMERIC(5,2) := 0;
BEGIN
  SELECT * INTO v_opp FROM public.opportunities WHERE id = p_opportunity_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Opportunity not found.';
  END IF;

  SELECT
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'shortlisted'),
    COUNT(*) FILTER (WHERE status = 'interview'),
    COUNT(*) FILTER (WHERE status = 'offer'),
    COUNT(*) FILTER (WHERE status = 'hired')
  INTO
    v_total,
    v_shortlisted,
    v_interviews,
    v_offers,
    v_hires
  FROM public.applications
  WHERE opportunity_id = p_opportunity_id;

  SELECT COALESCE(AVG(overall_match), 0) INTO v_avg_match
  FROM public.application_match_snapshots ms
  JOIN public.applications a ON a.id = ms.application_id
  WHERE a.opportunity_id = p_opportunity_id;

  RETURN jsonb_build_object(
    'opportunityId', p_opportunity_id,
    'title', v_opp.title,
    'totalApplicants', v_total,
    'shortlistedCount', v_shortlisted,
    'interviewsCount', v_interviews,
    'offersCount', v_offers,
    'hiresCount', v_hires,
    'averageMatch', v_avg_match
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

