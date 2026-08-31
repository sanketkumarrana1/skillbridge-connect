-- ==============================================================================
-- Migration: 032_recruitment_rpcs.sql
-- Description: Server-authoritative stored procedures for application and hiring lifecycle.
-- ==============================================================================

-- 1. Apply to Opportunity RPC
CREATE OR REPLACE FUNCTION public.apply_to_opportunity(
  p_opportunity_id UUID,
  p_cover_note TEXT DEFAULT NULL,
  p_resume_url TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_student_id UUID;
  v_opp_record RECORD;
  v_app_id UUID;
  v_student_profile RECORD;
BEGIN
  v_student_id := auth.uid();
  IF v_student_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  -- Verify opportunity is published and active
  SELECT * INTO v_opp_record FROM public.opportunities WHERE id = p_opportunity_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Opportunity not found.';
  END IF;

  IF v_opp_record.status != 'published' THEN
    RAISE EXCEPTION 'This opportunity is not currently accepting applications.';
  END IF;

  IF v_opp_record.deadline IS NOT NULL AND v_opp_record.deadline < NOW() THEN
    RAISE EXCEPTION 'The application deadline for this opportunity has passed.';
  END IF;

  -- Check existing application
  IF EXISTS (SELECT 1 FROM public.applications WHERE student_id = v_student_id AND opportunity_id = p_opportunity_id) THEN
    RAISE EXCEPTION 'You have already applied to this opportunity.';
  END IF;

  -- Insert Application
  INSERT INTO public.applications (
    student_id,
    opportunity_id,
    status,
    cover_note,
    resume_url,
    applied_at,
    updated_at
  ) VALUES (
    v_student_id,
    p_opportunity_id,
    'applied',
    p_cover_note,
    p_resume_url,
    NOW(),
    NOW()
  ) RETURNING id INTO v_app_id;

  -- Record Status History
  INSERT INTO public.application_status_history (
    application_id,
    from_status,
    to_status,
    changed_by,
    reason
  ) VALUES (
    v_app_id,
    NULL,
    'applied',
    v_student_id,
    'Initial application submitted by student.'
  );

  -- Capture immutable profile snapshot
  SELECT p.full_name, p.email, sp.college, sp.degree, sp.branch, sp.graduation_year, sp.cgpa
  INTO v_student_profile
  FROM public.profiles p
  LEFT JOIN public.student_profiles sp ON sp.user_id = p.id
  WHERE p.id = v_student_id;

  INSERT INTO public.application_profile_snapshots (
    application_id,
    student_name,
    student_email,
    college,
    degree,
    branch,
    graduation_year,
    cgpa,
    skills,
    captured_at
  ) VALUES (
    v_app_id,
    COALESCE(v_student_profile.full_name, 'Student'),
    COALESCE(v_student_profile.email, ''),
    COALESCE(v_student_profile.college, 'Not specified'),
    COALESCE(v_student_profile.degree, 'Not specified'),
    COALESCE(v_student_profile.branch, 'Not specified'),
    COALESCE(v_student_profile.graduation_year, '2026'),
    v_student_profile.cgpa,
    '[]'::jsonb,
    NOW()
  );

  RETURN jsonb_build_object(
    'success', true,
    'application_id', v_app_id,
    'status', 'applied'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 2. Update Application Status RPC (Recruiter/Admin only)
CREATE OR REPLACE FUNCTION public.update_application_status(
  p_application_id UUID,
  p_new_status public.application_status,
  p_reason TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_app RECORD;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  SELECT * INTO v_app FROM public.applications WHERE id = p_application_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Application not found.';
  END IF;

  -- Validate recruiter authorization or admin
  IF NOT (public.is_application_recruiter(p_application_id, v_caller_id) OR public.is_admin(v_caller_id)) THEN
    -- Student can ONLY withdraw own application
    IF v_app.student_id = v_caller_id AND p_new_status = 'withdrawn' THEN
      -- Allowed
    ELSE
      RAISE EXCEPTION 'You are not authorized to change this application status.';
    END IF;
  END IF;

  -- Prevent invalid transitions
  IF v_app.status = 'rejected' AND p_new_status = 'offered' THEN
    RAISE EXCEPTION 'Cannot issue an offer to a rejected application.';
  END IF;

  IF v_app.status = 'withdrawn' AND p_new_status != 'withdrawn' THEN
    RAISE EXCEPTION 'Cannot modify a withdrawn application.';
  END IF;

  -- Update status
  UPDATE public.applications
  SET status = p_new_status, updated_at = NOW()
  WHERE id = p_application_id;

  -- Insert history
  INSERT INTO public.application_status_history (
    application_id,
    from_status,
    to_status,
    changed_by,
    reason
  ) VALUES (
    p_application_id,
    v_app.status,
    p_new_status,
    v_caller_id,
    p_reason
  );

  RETURN jsonb_build_object(
    'success', true,
    'application_id', p_application_id,
    'previous_status', v_app.status,
    'new_status', p_new_status
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 3. Schedule Interview RPC
CREATE OR REPLACE FUNCTION public.schedule_interview(
  p_application_id UUID,
  p_interview_type public.interview_type,
  p_title TEXT,
  p_scheduled_start TIMESTAMPTZ,
  p_scheduled_end TIMESTAMPTZ,
  p_meeting_url TEXT DEFAULT NULL,
  p_location TEXT DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_interview_id UUID;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  IF NOT (public.is_application_recruiter(p_application_id, v_caller_id) OR public.is_admin(v_caller_id)) THEN
    RAISE EXCEPTION 'Unauthorized to schedule interview for this application.';
  END IF;

  INSERT INTO public.interviews (
    application_id,
    interviewer_id,
    interview_type,
    title,
    scheduled_start,
    scheduled_end,
    meeting_url,
    location,
    notes,
    status
  ) VALUES (
    p_application_id,
    v_caller_id,
    p_interview_type,
    p_title,
    p_scheduled_start,
    p_scheduled_end,
    p_meeting_url,
    p_location,
    p_notes,
    'scheduled'
  ) RETURNING id INTO v_interview_id;

  -- Update application status
  PERFORM public.update_application_status(p_application_id, 'interview_scheduled', 'Interview scheduled by hiring team.');

  RETURN jsonb_build_object(
    'success', true,
    'interview_id', v_interview_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 4. Create Offer RPC
CREATE OR REPLACE FUNCTION public.create_offer(
  p_application_id UUID,
  p_role_title TEXT,
  p_compensation_ctc NUMERIC,
  p_joining_date DATE,
  p_location TEXT,
  p_expires_at TIMESTAMPTZ,
  p_stipend_monthly NUMERIC DEFAULT NULL,
  p_offer_letter_url TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_offer_id UUID;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  IF NOT (public.is_application_recruiter(p_application_id, v_caller_id) OR public.is_admin(v_caller_id)) THEN
    RAISE EXCEPTION 'Unauthorized to issue offer for this application.';
  END IF;

  INSERT INTO public.offers (
    application_id,
    role_title,
    compensation_ctc,
    stipend_monthly,
    joining_date,
    location,
    offer_letter_url,
    expires_at,
    status
  ) VALUES (
    p_application_id,
    p_role_title,
    p_compensation_ctc,
    p_stipend_monthly,
    p_joining_date,
    p_location,
    p_offer_letter_url,
    p_expires_at,
    'issued'
  ) RETURNING id INTO v_offer_id;

  PERFORM public.update_application_status(p_application_id, 'offered', 'Offer issued to candidate.');

  RETURN jsonb_build_object(
    'success', true,
    'offer_id', v_offer_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 5. Respond to Offer RPC (Student accept/decline)
CREATE OR REPLACE FUNCTION public.respond_to_offer(
  p_offer_id UUID,
  p_response TEXT,
  p_reason TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_offer RECORD;
  v_app RECORD;
  v_opp RECORD;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  SELECT * INTO v_offer FROM public.offers WHERE id = p_offer_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Offer not found.';
  END IF;

  SELECT * INTO v_app FROM public.applications WHERE id = v_offer.application_id;
  IF v_app.student_id != v_caller_id THEN
    RAISE EXCEPTION 'You are not authorized to respond to this offer.';
  END IF;

  IF v_offer.status != 'issued' THEN
    RAISE EXCEPTION 'This offer is no longer open for response.';
  END IF;

  IF v_offer.expires_at < NOW() THEN
    UPDATE public.offers SET status = 'expired' WHERE id = p_offer_id;
    RAISE EXCEPTION 'This offer has expired.';
  END IF;

  IF p_response = 'accept' THEN
    UPDATE public.offers SET status = 'accepted', responded_at = NOW() WHERE id = p_offer_id;
    PERFORM public.update_application_status(v_app.id, 'accepted', 'Student accepted offer.');

    SELECT * INTO v_opp FROM public.opportunities WHERE id = v_app.opportunity_id;

    -- Create Placement record
    INSERT INTO public.placements (
      student_id,
      opportunity_id,
      company_id,
      application_id,
      offer_id,
      role_title,
      compensation_ctc,
      joining_date,
      status
    ) VALUES (
      v_caller_id,
      v_app.opportunity_id,
      v_opp.organization_id,
      v_app.id,
      v_offer.id,
      v_offer.role_title,
      v_offer.compensation_ctc,
      v_offer.joining_date,
      'confirmed'
    );
  ELSIF p_response = 'decline' THEN
    UPDATE public.offers SET status = 'declined', decline_reason = p_reason, responded_at = NOW() WHERE id = p_offer_id;
    PERFORM public.update_application_status(v_app.id, 'declined', COALESCE(p_reason, 'Student declined offer.'));
  ELSE
    RAISE EXCEPTION 'Invalid response action. Must be accept or decline.';
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'offer_id', p_offer_id,
    'response', p_response
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

