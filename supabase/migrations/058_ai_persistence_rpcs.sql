-- ==============================================================================
-- Migration: 058_ai_persistence_rpcs.sql
-- Description: Stored procedures for saving and fetching student AI results.
-- ==============================================================================

-- 1. Save AI Skill Gap Result
CREATE OR REPLACE FUNCTION public.save_ai_skill_gap_result(
  p_student_id UUID,
  p_target_role_title TEXT,
  p_data JSONB,
  p_attempt_id UUID DEFAULT NULL,
  p_provider public.ai_provider_type DEFAULT 'gemini',
  p_model TEXT DEFAULT 'gemini-1.5-flash',
  p_is_fallback BOOLEAN DEFAULT FALSE
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_inserted_id UUID;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  IF v_caller_id != p_student_id AND NOT public.is_admin(v_caller_id) THEN
    RAISE EXCEPTION 'Unauthorized to save skill gap result for another student.';
  END IF;

  INSERT INTO public.ai_skill_gap_results (
    student_id,
    attempt_id,
    target_role_title,
    provider,
    model,
    overall_score,
    strengths,
    weaknesses,
    skill_scores,
    priority_skills,
    diagnostic_summary,
    recommended_actions,
    is_fallback
  ) VALUES (
    p_student_id,
    p_attempt_id,
    p_target_role_title,
    p_provider,
    p_model,
    (p_data->>'overallScore')::numeric,
    COALESCE(p_data->'strengths', '[]'::jsonb),
    COALESCE(p_data->'weaknesses', '[]'::jsonb),
    COALESCE(p_data->'skillScores', '[]'::jsonb),
    COALESCE(p_data->'prioritySkills', '[]'::jsonb),
    COALESCE(p_data->>'diagnosticSummary', 'Skill gap analysis complete.'),
    COALESCE(p_data->'recommendedActions', '[]'::jsonb),
    p_is_fallback
  ) RETURNING id INTO v_inserted_id;

  RETURN jsonb_build_object('success', true, 'id', v_inserted_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 2. Get Latest AI Skill Gap Result
CREATE OR REPLACE FUNCTION public.get_latest_ai_skill_gap_result(p_student_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_row RECORD;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  IF v_caller_id != p_student_id AND NOT public.is_admin(v_caller_id) THEN
    RAISE EXCEPTION 'Unauthorized to view skill gap result for another student.';
  END IF;

  SELECT * INTO v_row
  FROM public.ai_skill_gap_results
  WHERE student_id = p_student_id
  ORDER BY created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('found', false);
  END IF;

  RETURN jsonb_build_object(
    'found', true,
    'id', v_row.id,
    'overallScore', v_row.overall_score,
    'strengths', v_row.strengths,
    'weaknesses', v_row.weaknesses,
    'skillScores', v_row.skill_scores,
    'prioritySkills', v_row.priority_skills,
    'diagnosticSummary', v_row.diagnostic_summary,
    'recommendedActions', v_row.recommended_actions,
    'isFallback', v_row.is_fallback,
    'createdAt', v_row.created_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 3. Save AI Career Recommendations
CREATE OR REPLACE FUNCTION public.save_ai_career_recommendations(
  p_student_id UUID,
  p_data JSONB,
  p_provider public.ai_provider_type DEFAULT 'gemini',
  p_model TEXT DEFAULT 'gemini-1.5-flash',
  p_is_fallback BOOLEAN DEFAULT FALSE
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_inserted_id UUID;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  IF v_caller_id != p_student_id AND NOT public.is_admin(v_caller_id) THEN
    RAISE EXCEPTION 'Unauthorized to save career recommendations for another student.';
  END IF;

  INSERT INTO public.ai_career_recommendations (
    student_id,
    provider,
    model,
    recommended_roles,
    is_fallback
  ) VALUES (
    p_student_id,
    p_provider,
    p_model,
    COALESCE(p_data->'recommendedRoles', '[]'::jsonb),
    p_is_fallback
  ) RETURNING id INTO v_inserted_id;

  RETURN jsonb_build_object('success', true, 'id', v_inserted_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 4. Get Latest AI Career Recommendations
CREATE OR REPLACE FUNCTION public.get_latest_ai_career_recommendations(p_student_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_row RECORD;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  IF v_caller_id != p_student_id AND NOT public.is_admin(v_caller_id) THEN
    RAISE EXCEPTION 'Unauthorized to view career recommendations for another student.';
  END IF;

  SELECT * INTO v_row
  FROM public.ai_career_recommendations
  WHERE student_id = p_student_id
  ORDER BY created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('found', false);
  END IF;

  RETURN jsonb_build_object(
    'found', true,
    'id', v_row.id,
    'recommendedRoles', v_row.recommended_roles,
    'isFallback', v_row.is_fallback,
    'createdAt', v_row.created_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 5. Save AI Learning Recommendations
CREATE OR REPLACE FUNCTION public.save_ai_learning_recommendations(
  p_student_id UUID,
  p_target_role_title TEXT,
  p_data JSONB,
  p_provider public.ai_provider_type DEFAULT 'gemini',
  p_model TEXT DEFAULT 'gemini-1.5-flash',
  p_is_fallback BOOLEAN DEFAULT FALSE
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_inserted_id UUID;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  IF v_caller_id != p_student_id AND NOT public.is_admin(v_caller_id) THEN
    RAISE EXCEPTION 'Unauthorized to save learning recommendations for another student.';
  END IF;

  INSERT INTO public.ai_learning_recommendations (
    student_id,
    target_role_title,
    provider,
    model,
    milestones,
    is_fallback
  ) VALUES (
    p_student_id,
    p_target_role_title,
    p_provider,
    p_model,
    COALESCE(p_data->'milestones', '[]'::jsonb),
    p_is_fallback
  ) RETURNING id INTO v_inserted_id;

  RETURN jsonb_build_object('success', true, 'id', v_inserted_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 6. Get Latest AI Learning Recommendations
CREATE OR REPLACE FUNCTION public.get_latest_ai_learning_recommendations(p_student_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_row RECORD;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  IF v_caller_id != p_student_id AND NOT public.is_admin(v_caller_id) THEN
    RAISE EXCEPTION 'Unauthorized to view learning recommendations for another student.';
  END IF;

  SELECT * INTO v_row
  FROM public.ai_learning_recommendations
  WHERE student_id = p_student_id
  ORDER BY created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('found', false);
  END IF;

  RETURN jsonb_build_object(
    'found', true,
    'id', v_row.id,
    'targetRoleTitle', v_row.target_role_title,
    'milestones', v_row.milestones,
    'isFallback', v_row.is_fallback,
    'createdAt', v_row.created_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

