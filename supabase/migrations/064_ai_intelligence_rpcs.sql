-- ==============================================================================
-- Migration: 064_ai_intelligence_rpcs.sql
-- Description: Stored procedures for persisting intelligence results, submitting feedback, and admin AI monitoring.
-- ==============================================================================

-- 1. RPC: save_ai_opportunity_explanation
CREATE OR REPLACE FUNCTION public.save_ai_opportunity_explanation(
  p_student_id UUID,
  p_opportunity_id UUID,
  p_data JSONB,
  p_provider TEXT DEFAULT 'gemini',
  p_model TEXT DEFAULT 'gemini-1.5-flash',
  p_is_fallback BOOLEAN DEFAULT false
)
RETURNS JSONB AS $$
DECLARE
  v_rec_id UUID;
BEGIN
  INSERT INTO public.ai_opportunity_explanations (
    student_id,
    opportunity_id,
    provider,
    model,
    overall_match_percentage,
    readiness_category,
    why_you_match,
    missing_requirements,
    recommended_actions,
    application_advice,
    is_fallback,
    created_at
  ) VALUES (
    p_student_id,
    p_opportunity_id,
    p_provider::public.ai_provider_type,
    p_model,
    COALESCE((p_data->>'overallMatchPercentage')::NUMERIC, 0),
    COALESCE(p_data->>'category', 'nearly_ready'),
    COALESCE(p_data->'whyYouMatch', '[]'::jsonb),
    COALESCE(p_data->'missingRequirements', '[]'::jsonb),
    COALESCE(p_data->'recommendedActions', '[]'::jsonb),
    p_data->>'applicationAdvice',
    p_is_fallback,
    NOW()
  )
  RETURNING id INTO v_rec_id;

  RETURN jsonb_build_object('success', true, 'id', v_rec_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. RPC: get_latest_ai_opportunity_explanation
CREATE OR REPLACE FUNCTION public.get_latest_ai_opportunity_explanation(
  p_student_id UUID,
  p_opportunity_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_row public.ai_opportunity_explanations%ROWTYPE;
BEGIN
  SELECT * INTO v_row
  FROM public.ai_opportunity_explanations
  WHERE student_id = p_student_id AND opportunity_id = p_opportunity_id
  ORDER BY created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('found', false);
  END IF;

  RETURN jsonb_build_object(
    'found', true,
    'id', v_row.id,
    'studentId', v_row.student_id,
    'opportunityId', v_row.opportunity_id,
    'provider', v_row.provider,
    'model', v_row.model,
    'overallMatchPercentage', v_row.overall_match_percentage,
    'category', v_row.readiness_category,
    'whyYouMatch', v_row.why_you_match,
    'missingRequirements', v_row.missing_requirements,
    'recommendedActions', v_row.recommended_actions,
    'applicationAdvice', v_row.application_advice,
    'isFallback', v_row.is_fallback,
    'createdAt', v_row.created_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 3. RPC: save_ai_candidate_summary
CREATE OR REPLACE FUNCTION public.save_ai_candidate_summary(
  p_application_id UUID,
  p_recruiter_id UUID,
  p_data JSONB,
  p_provider TEXT DEFAULT 'gemini',
  p_model TEXT DEFAULT 'gemini-1.5-flash',
  p_is_fallback BOOLEAN DEFAULT false
)
RETURNS JSONB AS $$
DECLARE
  v_rec_id UUID;
BEGIN
  INSERT INTO public.ai_candidate_summaries (
    application_id,
    recruiter_id,
    provider,
    model,
    summary,
    strongest_evidence,
    matching_skills,
    missing_skills,
    concerns,
    interview_focus,
    fit_recommendation,
    confidence,
    is_fallback,
    created_at
  ) VALUES (
    p_application_id,
    p_recruiter_id,
    p_provider::public.ai_provider_type,
    p_model,
    COALESCE(p_data->>'summary', 'Candidate profile summary generated.'),
    COALESCE(p_data->'strongestEvidence', '[]'::jsonb),
    COALESCE(p_data->'matchingSkills', '[]'::jsonb),
    COALESCE(p_data->'missingSkills', '[]'::jsonb),
    COALESCE(p_data->'concerns', '[]'::jsonb),
    COALESCE(p_data->'interviewFocus', '[]'::jsonb),
    COALESCE(p_data->>'fitRecommendation', 'good_fit'),
    COALESCE(p_data->>'confidence', 'medium'),
    p_is_fallback,
    NOW()
  )
  RETURNING id INTO v_rec_id;

  RETURN jsonb_build_object('success', true, 'id', v_rec_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. RPC: get_latest_ai_candidate_summary
CREATE OR REPLACE FUNCTION public.get_latest_ai_candidate_summary(p_application_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_row public.ai_candidate_summaries%ROWTYPE;
BEGIN
  SELECT * INTO v_row
  FROM public.ai_candidate_summaries
  WHERE application_id = p_application_id
  ORDER BY created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('found', false);
  END IF;

  RETURN jsonb_build_object(
    'found', true,
    'id', v_row.id,
    'applicationId', v_row.application_id,
    'recruiterId', v_row.recruiter_id,
    'provider', v_row.provider,
    'model', v_row.model,
    'summary', v_row.summary,
    'strongestEvidence', v_row.strongest_evidence,
    'matchingSkills', v_row.matching_skills,
    'missingSkills', v_row.missing_skills,
    'concerns', v_row.concerns,
    'interviewFocus', v_row.interview_focus,
    'fitRecommendation', v_row.fit_recommendation,
    'confidence', v_row.confidence,
    'isFallback', v_row.is_fallback,
    'createdAt', v_row.created_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 5. RPC: save_ai_resume_analysis
CREATE OR REPLACE FUNCTION public.save_ai_resume_analysis(
  p_student_id UUID,
  p_data JSONB,
  p_target_role_title TEXT DEFAULT NULL,
  p_provider TEXT DEFAULT 'gemini',
  p_model TEXT DEFAULT 'gemini-1.5-flash',
  p_is_fallback BOOLEAN DEFAULT false
)
RETURNS JSONB AS $$
DECLARE
  v_rec_id UUID;
BEGIN
  INSERT INTO public.ai_resume_analyses (
    student_id,
    target_role_title,
    provider,
    model,
    overall_score,
    ats_compatibility_score,
    strengths,
    improvements,
    keyword_matches,
    missing_keywords,
    summary,
    is_fallback,
    created_at
  ) VALUES (
    p_student_id,
    p_target_role_title,
    p_provider::public.ai_provider_type,
    p_model,
    COALESCE((p_data->>'overallScore')::NUMERIC, 75),
    COALESCE((p_data->>'atsCompatibilityScore')::NUMERIC, 80),
    COALESCE(p_data->'strengths', '[]'::jsonb),
    COALESCE(p_data->'improvements', '[]'::jsonb),
    COALESCE(p_data->'keywordMatches', '[]'::jsonb),
    COALESCE(p_data->'missingKeywords', '[]'::jsonb),
    COALESCE(p_data->>'summary', 'Resume analysis completed.'),
    p_is_fallback,
    NOW()
  )
  RETURNING id INTO v_rec_id;

  RETURN jsonb_build_object('success', true, 'id', v_rec_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. RPC: get_latest_ai_resume_analysis
CREATE OR REPLACE FUNCTION public.get_latest_ai_resume_analysis(p_student_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_row public.ai_resume_analyses%ROWTYPE;
BEGIN
  SELECT * INTO v_row
  FROM public.ai_resume_analyses
  WHERE student_id = p_student_id
  ORDER BY created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('found', false);
  END IF;

  RETURN jsonb_build_object(
    'found', true,
    'id', v_row.id,
    'studentId', v_row.student_id,
    'targetRoleTitle', v_row.target_role_title,
    'provider', v_row.provider,
    'model', v_row.model,
    'overallScore', v_row.overall_score,
    'atsCompatibilityScore', v_row.ats_compatibility_score,
    'strengths', v_row.strengths,
    'improvements', v_row.improvements,
    'keywordMatches', v_row.keyword_matches,
    'missingKeywords', v_row.missing_keywords,
    'summary', v_row.summary,
    'isFallback', v_row.is_fallback,
    'createdAt', v_row.created_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 7. RPC: save_ai_portfolio_feedback
CREATE OR REPLACE FUNCTION public.save_ai_portfolio_feedback(
  p_student_id UUID,
  p_data JSONB,
  p_provider TEXT DEFAULT 'gemini',
  p_model TEXT DEFAULT 'gemini-1.5-flash',
  p_is_fallback BOOLEAN DEFAULT false
)
RETURNS JSONB AS $$
DECLARE
  v_rec_id UUID;
BEGIN
  INSERT INTO public.ai_portfolio_feedbacks (
    student_id,
    provider,
    model,
    strengths,
    weak_project_descriptions,
    missing_evidence,
    recommended_improvements,
    project_evaluations,
    summary,
    is_fallback,
    created_at
  ) VALUES (
    p_student_id,
    p_provider::public.ai_provider_type,
    p_model,
    COALESCE(p_data->'strengths', '[]'::jsonb),
    COALESCE(p_data->'weakProjectDescriptions', '[]'::jsonb),
    COALESCE(p_data->'missingEvidence', '[]'::jsonb),
    COALESCE(p_data->'recommendedImprovements', '[]'::jsonb),
    COALESCE(p_data->'projectEvaluations', '[]'::jsonb),
    COALESCE(p_data->>'summary', 'Portfolio review completed.'),
    p_is_fallback,
    NOW()
  )
  RETURNING id INTO v_rec_id;

  RETURN jsonb_build_object('success', true, 'id', v_rec_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. RPC: get_latest_ai_portfolio_feedback
CREATE OR REPLACE FUNCTION public.get_latest_ai_portfolio_feedback(p_student_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_row public.ai_portfolio_feedbacks%ROWTYPE;
BEGIN
  SELECT * INTO v_row
  FROM public.ai_portfolio_feedbacks
  WHERE student_id = p_student_id
  ORDER BY created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('found', false);
  END IF;

  RETURN jsonb_build_object(
    'found', true,
    'id', v_row.id,
    'studentId', v_row.student_id,
    'provider', v_row.provider,
    'model', v_row.model,
    'strengths', v_row.strengths,
    'weakProjectDescriptions', v_row.weak_project_descriptions,
    'missingEvidence', v_row.missing_evidence,
    'recommendedImprovements', v_row.recommended_improvements,
    'projectEvaluations', v_row.project_evaluations,
    'summary', v_row.summary,
    'isFallback', v_row.is_fallback,
    'createdAt', v_row.created_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 9. RPC: save_ai_interview_preparation
CREATE OR REPLACE FUNCTION public.save_ai_interview_preparation(
  p_student_id UUID,
  p_target_role_title TEXT,
  p_data JSONB,
  p_opportunity_id UUID DEFAULT NULL,
  p_provider TEXT DEFAULT 'gemini',
  p_model TEXT DEFAULT 'gemini-1.5-flash',
  p_is_fallback BOOLEAN DEFAULT false
)
RETURNS JSONB AS $$
DECLARE
  v_rec_id UUID;
BEGIN
  INSERT INTO public.ai_interview_preparations (
    student_id,
    target_role_title,
    opportunity_id,
    provider,
    model,
    focus_areas,
    suggested_questions,
    preparation_checklist,
    practice_feedback,
    is_fallback,
    created_at
  ) VALUES (
    p_student_id,
    p_target_role_title,
    p_opportunity_id,
    p_provider::public.ai_provider_type,
    p_model,
    COALESCE(p_data->'focusAreas', '[]'::jsonb),
    COALESCE(p_data->'suggestedQuestions', '[]'::jsonb),
    COALESCE(p_data->'preparationChecklist', '[]'::jsonb),
    COALESCE(p_data->'practiceFeedback', '[]'::jsonb),
    p_is_fallback,
    NOW()
  )
  RETURNING id INTO v_rec_id;

  RETURN jsonb_build_object('success', true, 'id', v_rec_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. RPC: get_latest_ai_interview_preparation
CREATE OR REPLACE FUNCTION public.get_latest_ai_interview_preparation(
  p_student_id UUID,
  p_target_role_title TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_row public.ai_interview_preparations%ROWTYPE;
BEGIN
  SELECT * INTO v_row
  FROM public.ai_interview_preparations
  WHERE student_id = p_student_id AND target_role_title ILIKE p_target_role_title
  ORDER BY created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('found', false);
  END IF;

  RETURN jsonb_build_object(
    'found', true,
    'id', v_row.id,
    'studentId', v_row.student_id,
    'targetRoleTitle', v_row.target_role_title,
    'opportunityId', v_row.opportunity_id,
    'provider', v_row.provider,
    'model', v_row.model,
    'focusAreas', v_row.focus_areas,
    'suggestedQuestions', v_row.suggested_questions,
    'preparationChecklist', v_row.preparation_checklist,
    'practiceFeedback', v_row.practice_feedback,
    'isFallback', v_row.is_fallback,
    'createdAt', v_row.created_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 11. RPC: submit_ai_user_feedback
CREATE OR REPLACE FUNCTION public.submit_ai_user_feedback(
  p_user_id UUID,
  p_request_id TEXT,
  p_operation TEXT,
  p_is_helpful BOOLEAN,
  p_reason TEXT DEFAULT NULL,
  p_comments TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_rec_id UUID;
BEGIN
  INSERT INTO public.ai_user_feedback (
    user_id,
    request_id,
    operation,
    is_helpful,
    reason,
    comments,
    created_at
  ) VALUES (
    p_user_id,
    p_request_id,
    p_operation::public.ai_operation,
    p_is_helpful,
    p_reason,
    p_comments,
    NOW()
  )
  RETURNING id INTO v_rec_id;

  RETURN jsonb_build_object('success', true, 'id', v_rec_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. RPC: get_admin_ai_telemetry
CREATE OR REPLACE FUNCTION public.get_admin_ai_telemetry()
RETURNS JSONB AS $$
DECLARE
  v_total_requests BIGINT;
  v_completed_requests BIGINT;
  v_failed_requests BIGINT;
  v_rate_limited BIGINT;
  v_avg_latency NUMERIC;
  v_total_tokens BIGINT;
  v_feedback_helpful BIGINT;
  v_feedback_unhelpful BIGINT;
BEGIN
  SELECT
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'completed'),
    COUNT(*) FILTER (WHERE status = 'failed'),
    COUNT(*) FILTER (WHERE status = 'rate_limited'),
    COALESCE(ROUND(AVG(latency_ms), 2), 0),
    COALESCE(SUM(input_tokens + output_tokens), 0)
  INTO
    v_total_requests,
    v_completed_requests,
    v_failed_requests,
    v_rate_limited,
    v_avg_latency,
    v_total_tokens
  FROM public.ai_requests;

  SELECT
    COUNT(*) FILTER (WHERE is_helpful = true),
    COUNT(*) FILTER (WHERE is_helpful = false)
  INTO
    v_feedback_helpful,
    v_feedback_unhelpful
  FROM public.ai_user_feedback;

  RETURN jsonb_build_object(
    'totalRequests', v_total_requests,
    'completedRequests', v_completed_requests,
    'failedRequests', v_failed_requests,
    'rateLimitedRequests', v_rate_limited,
    'avgLatencyMs', v_avg_latency,
    'totalTokensConsumed', v_total_tokens,
    'helpfulFeedbackCount', v_feedback_helpful,
    'unhelpfulFeedbackCount', v_feedback_unhelpful
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

