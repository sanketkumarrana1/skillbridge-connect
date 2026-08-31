-- ==============================================================================
-- Migration: 018_assessment_rpcs.sql
-- Description: Transactional RPCs for personalized question selection, attempt start, and authoritative scoring.
-- ==============================================================================

-- 1. RPC: create_personalized_assessment
CREATE OR REPLACE FUNCTION public.create_personalized_assessment(
  p_student_id UUID,
  p_config JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_assessment_id UUID;
  v_config_id UUID;
  v_attempt_id UUID;
  v_q_count INT;
  v_duration_mins INT;
  v_mode TEXT;
  v_target_roles JSONB;
  v_selected_skills JSONB;
  v_skill_ids UUID[];
  v_question_rec RECORD;
  v_seq INT := 0;
  v_expires_at TIMESTAMPTZ;
  v_questions_payload JSONB := '[]'::jsonb;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthenticated caller.';
  END IF;

  IF p_student_id != v_caller_id AND NOT public.is_admin(v_caller_id) THEN
    RAISE EXCEPTION 'Unauthorized: You can only create assessments for your own account.';
  END IF;

  v_q_count := COALESCE((p_config->>'question_count')::INT, 20);
  v_duration_mins := COALESCE((p_config->>'duration_minutes')::INT, 15);
  v_mode := COALESCE(p_config->>'mode', 'skill_verification');
  v_selected_skills := COALESCE(p_config->'selected_skills', '[]'::jsonb);
  v_target_roles := COALESCE(p_config->'target_roles', '[]'::jsonb);

  -- Resolve default assessment template ID
  SELECT id INTO v_assessment_id FROM public.assessments WHERE slug = 'skill-verification-default' LIMIT 1;

  -- 1. Create Assessment Config Snapshot
  INSERT INTO public.assessment_configs (
    student_id,
    assessment_id,
    question_count,
    duration_minutes,
    selected_skills_snapshot,
    target_roles_snapshot,
    difficulty_policy
  ) VALUES (
    p_student_id,
    v_assessment_id,
    v_q_count,
    v_duration_mins,
    v_selected_skills,
    v_target_roles,
    'adaptive'
  )
  RETURNING id INTO v_config_id;

  -- 2. Calculate Expiration Timestamp
  v_expires_at := NOW() + (v_duration_mins || ' minutes')::INTERVAL;

  -- 3. Create Assessment Attempt
  INSERT INTO public.assessment_attempts (
    config_id,
    student_id,
    status,
    started_at,
    expires_at,
    question_count
  ) VALUES (
    v_config_id,
    p_student_id,
    'in_progress',
    NOW(),
    v_expires_at,
    v_q_count
  )
  RETURNING id INTO v_attempt_id;

  -- 4. Gather Target Skill IDs
  IF jsonb_array_length(v_selected_skills) > 0 THEN
    SELECT ARRAY_AGG(DISTINCT s.id) INTO v_skill_ids
    FROM public.skills s
    WHERE s.name IN (SELECT jsonb_array_elements_text(v_selected_skills))
       OR s.slug IN (SELECT jsonb_array_elements_text(v_selected_skills));
  ELSE
    SELECT ARRAY_AGG(DISTINCT ss.skill_id) INTO v_skill_ids
    FROM public.student_skills ss
    WHERE ss.student_id = p_student_id AND ss.status = 'active';
  END IF;

  -- 5. Select & Assign Questions
  FOR v_question_rec IN
    (
      SELECT q.id, q.skill_id, q.topic, q.question_text, q.explanation, q.difficulty, q.score_value, s.name AS skill_name
      FROM public.assessment_questions q
      JOIN public.skills s ON s.id = q.skill_id
      WHERE q.status = 'active'
        AND (v_skill_ids IS NULL OR q.skill_id = ANY(v_skill_ids))
      ORDER BY RANDOM()
      LIMIT v_q_count
    )
  LOOP
    v_seq := v_seq + 1;
    INSERT INTO public.assessment_attempt_questions (
      attempt_id,
      question_id,
      skill_id,
      difficulty,
      sequence_number
    ) VALUES (
      v_attempt_id,
      v_question_rec.id,
      v_question_rec.skill_id,
      v_question_rec.difficulty,
      v_seq
    );
  END LOOP;

  -- If not enough skill-specific questions, backfill from active pool
  IF v_seq < v_q_count THEN
    FOR v_question_rec IN
      (
        SELECT q.id, q.skill_id, q.topic, q.question_text, q.explanation, q.difficulty, q.score_value, s.name AS skill_name
        FROM public.assessment_questions q
        JOIN public.skills s ON s.id = q.skill_id
        WHERE q.status = 'active'
          AND NOT EXISTS (
            SELECT 1 FROM public.assessment_attempt_questions aaq
            WHERE aaq.attempt_id = v_attempt_id AND aaq.question_id = q.id
          )
        ORDER BY RANDOM()
        LIMIT (v_q_count - v_seq)
      )
    LOOP
      v_seq := v_seq + 1;
      INSERT INTO public.assessment_attempt_questions (
        attempt_id,
        question_id,
        skill_id,
        difficulty,
        sequence_number
      ) VALUES (
        v_attempt_id,
        v_question_rec.id,
        v_question_rec.skill_id,
        v_question_rec.difficulty,
        v_seq
      );
    END LOOP;
  END IF;

  -- Log start event
  INSERT INTO public.assessment_events (attempt_id, event_type, metadata)
  VALUES (v_attempt_id, 'started', jsonb_build_object('question_count', v_seq, 'duration_minutes', v_duration_mins));

  RETURN jsonb_build_object(
    'attempt_id', v_attempt_id,
    'config_id', v_config_id,
    'expires_at', v_expires_at,
    'question_count', v_seq,
    'duration_minutes', v_duration_mins,
    'status', 'in_progress'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. RPC: get_assessment_attempt_questions (Safe frontend query: NO is_correct returned)
CREATE OR REPLACE FUNCTION public.get_assessment_attempt_questions(p_attempt_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_attempt RECORD;
  v_result JSONB := '[]'::jsonb;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthenticated request.';
  END IF;

  SELECT * INTO v_attempt FROM public.assessment_attempts WHERE id = p_attempt_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Assessment attempt not found.';
  END IF;

  IF v_attempt.student_id != v_caller_id AND NOT public.is_admin(v_caller_id) THEN
    RAISE EXCEPTION 'Unauthorized: You can only view your own assessment questions.';
  END IF;

  SELECT jsonb_agg(
    jsonb_build_object(
      'attempt_question_id', aaq.id,
      'question_id', q.id,
      'sequence_number', aaq.sequence_number,
      'skill_id', q.skill_id,
      'skill_name', s.name,
      'category_name', COALESCE(sc.name, 'General'),
      'topic', q.topic,
      'difficulty', aaq.difficulty,
      'question_text', q.question_text,
      'score_value', q.score_value,
      'options', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', opt.id,
            'option_key', opt.option_key,
            'option_text', opt.option_text,
            'display_order', opt.display_order
          ) ORDER BY opt.display_order ASC
        )
        FROM public.assessment_question_options opt
        WHERE opt.question_id = q.id
      )
    ) ORDER BY aaq.sequence_number ASC
  ) INTO v_result
  FROM public.assessment_attempt_questions aaq
  JOIN public.assessment_questions q ON q.id = aaq.question_id
  JOIN public.skills s ON s.id = q.skill_id
  LEFT JOIN public.skill_categories sc ON sc.id = q.category_id
  WHERE aaq.attempt_id = p_attempt_id;

  RETURN COALESCE(v_result, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. RPC: submit_assessment_attempt (Server-Side Authoritative Scoring)
CREATE OR REPLACE FUNCTION public.submit_assessment_attempt(
  p_attempt_id UUID,
  p_answers JSONB DEFAULT '{}'::jsonb,
  p_time_used_seconds INT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_attempt RECORD;
  v_ans_key TEXT;
  v_ans_val TEXT;
  v_target_aaq RECORD;
  v_opt_rec RECORD;
  v_is_correct BOOLEAN;
  v_points INT;
  v_is_expired BOOLEAN := FALSE;
  v_final_status public.attempt_status;
  v_total_questions INT := 0;
  v_total_attempted INT := 0;
  v_total_correct INT := 0;
  v_total_earned_score NUMERIC := 0;
  v_total_max_score NUMERIC := 0;
  v_overall_score NUMERIC := 0;
  v_accuracy NUMERIC := 0;

  v_skill_rec RECORD;
  v_skill_score NUMERIC;
  v_skill_acc NUMERIC;
  v_assessed_level public.skill_self_level;
  v_confidence TEXT;
  v_result_status public.assessed_skill_status;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthenticated request.';
  END IF;

  SELECT * INTO v_attempt FROM public.assessment_attempts WHERE id = p_attempt_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Attempt not found.';
  END IF;

  IF v_attempt.student_id != v_caller_id AND NOT public.is_admin(v_caller_id) THEN
    RAISE EXCEPTION 'Unauthorized: You can only submit your own assessment.';
  END IF;

  IF v_attempt.status IN ('submitted', 'auto_submitted') THEN
    RAISE EXCEPTION 'Attempt has already been submitted.';
  END IF;

  -- Enforce Authoritative Expiry
  IF NOW() > (v_attempt.expires_at + INTERVAL '1 minute') THEN
    v_is_expired := TRUE;
    v_final_status := 'auto_submitted';
  ELSE
    v_final_status := 'submitted';
  END IF;

  -- 1. Evaluate and Insert Answers
  FOR v_target_aaq IN
    SELECT aaq.id, aaq.question_id, aaq.skill_id, aaq.difficulty, q.score_value
    FROM public.assessment_attempt_questions aaq
    JOIN public.assessment_questions q ON q.id = aaq.question_id
    WHERE aaq.attempt_id = p_attempt_id
  LOOP
    v_total_questions := v_total_questions + 1;
    v_total_max_score := v_total_max_score + v_target_aaq.score_value;

    -- Check if user answered (keys could be question_id or attempt_question_id or display index)
    v_ans_val := NULL;
    IF p_answers ? v_target_aaq.id::TEXT THEN
      v_ans_val := p_answers->>v_target_aaq.id::TEXT;
    ELSIF p_answers ? v_target_aaq.question_id::TEXT THEN
      v_ans_val := p_answers->>v_target_aaq.question_id::TEXT;
    END IF;

    IF v_ans_val IS NOT NULL AND v_ans_val != '' THEN
      v_total_attempted := v_total_attempted + 1;

      -- Resolve chosen option
      SELECT * INTO v_opt_rec
      FROM public.assessment_question_options
      WHERE question_id = v_target_aaq.question_id
        AND (
          id::TEXT = v_ans_val
          OR option_key = v_ans_val
          OR display_order::TEXT = v_ans_val
        )
      LIMIT 1;

      IF FOUND THEN
        v_is_correct := v_opt_rec.is_correct;
        v_points := CASE WHEN v_is_correct THEN v_target_aaq.score_value ELSE 0 END;

        IF v_is_correct THEN
          v_total_correct := v_total_correct + 1;
          v_total_earned_score := v_total_earned_score + v_points;
        END IF;

        INSERT INTO public.assessment_answers (
          attempt_id,
          attempt_question_id,
          selected_option_id,
          is_correct,
          score_awarded
        ) VALUES (
          p_attempt_id,
          v_target_aaq.id,
          v_opt_rec.id,
          v_is_correct,
          v_points
        )
        ON CONFLICT (attempt_question_id) DO UPDATE SET
          selected_option_id = EXCLUDED.selected_option_id,
          is_correct = EXCLUDED.is_correct,
          score_awarded = EXCLUDED.score_awarded,
          answered_at = NOW();
      END IF;
    END IF;
  END LOOP;

  -- 2. Compute Overall Score & Accuracy
  IF v_total_max_score > 0 THEN
    v_overall_score := ROUND((v_total_earned_score / v_total_max_score) * 100, 2);
  ELSE
    v_overall_score := 0;
  END IF;

  IF v_total_attempted > 0 THEN
    v_accuracy := ROUND(((v_total_correct::NUMERIC / v_total_attempted::NUMERIC) * 100), 2);
  ELSE
    v_accuracy := 0;
  END IF;

  -- 3. Calculate and Insert Per-Skill Assessment Results
  DELETE FROM public.assessment_skill_results WHERE attempt_id = p_attempt_id;

  FOR v_skill_rec IN
    SELECT
      aaq.skill_id,
      COUNT(aaq.id) AS skill_total_q,
      COUNT(ans.id) AS skill_attempted,
      COUNT(ans.id) FILTER (WHERE ans.is_correct = TRUE) AS skill_correct,
      SUM(q.score_value) AS skill_max_points,
      COALESCE(SUM(ans.score_awarded), 0) AS skill_earned_points
    FROM public.assessment_attempt_questions aaq
    JOIN public.assessment_questions q ON q.id = aaq.question_id
    LEFT JOIN public.assessment_answers ans ON ans.attempt_question_id = aaq.id
    WHERE aaq.attempt_id = p_attempt_id
    GROUP BY aaq.skill_id
  LOOP
    IF v_skill_rec.skill_max_points > 0 THEN
      v_skill_score := ROUND(((v_skill_rec.skill_earned_points::NUMERIC / v_skill_rec.skill_max_points::NUMERIC) * 100), 2);
    ELSE
      v_skill_score := 0;
    END IF;

    IF v_skill_rec.skill_attempted > 0 THEN
      v_skill_acc := ROUND(((v_skill_rec.skill_correct::NUMERIC / v_skill_rec.skill_attempted::NUMERIC) * 100), 2);
    ELSE
      v_skill_acc := 0;
    END IF;

    -- Determine Assessed Proficiency Level
    IF v_skill_score >= 80 OR (v_skill_acc >= 85 AND v_skill_rec.skill_attempted >= 2) THEN
      v_assessed_level := 'advanced';
    ELSIF v_skill_score >= 55 OR (v_skill_acc >= 60 AND v_skill_rec.skill_attempted >= 1) THEN
      v_assessed_level := 'intermediate';
    ELSE
      v_assessed_level := 'beginner';
    END IF;

    -- Determine Confidence Metric
    IF v_skill_rec.skill_attempted >= 3 THEN
      v_confidence := 'High';
    ELSIF v_skill_rec.skill_attempted = 2 THEN
      v_confidence := 'Medium';
    ELSE
      v_confidence := 'Low';
    END IF;

    -- Determine Result Status
    IF v_skill_rec.skill_attempted < 1 THEN
      v_result_status := 'insufficient_data';
    ELSIF v_skill_score >= 80 THEN
      v_result_status := 'strong';
    ELSIF v_skill_score >= 55 THEN
      v_result_status := 'competent';
    ELSE
      v_result_status := 'developing';
    END IF;

    INSERT INTO public.assessment_skill_results (
      attempt_id,
      student_id,
      skill_id,
      questions_count,
      attempted_count,
      correct_count,
      score,
      assessed_level,
      confidence,
      result_status
    ) VALUES (
      p_attempt_id,
      v_attempt.student_id,
      v_skill_rec.skill_id,
      v_skill_rec.skill_total_q,
      v_skill_rec.skill_attempted,
      v_skill_rec.skill_correct,
      v_skill_score,
      v_assessed_level,
      v_confidence,
      v_result_status
    );
  END LOOP;

  -- 4. Update Attempt Record
  UPDATE public.assessment_attempts
  SET
    status = v_final_status,
    submitted_at = NOW(),
    duration_seconds = COALESCE(p_time_used_seconds, EXTRACT(EPOCH FROM (NOW() - started_at))::INT),
    overall_score = v_overall_score,
    accuracy_percentage = v_accuracy,
    updated_at = NOW()
  WHERE id = p_attempt_id;

  -- 5. Log Submit Event
  INSERT INTO public.assessment_events (attempt_id, event_type, metadata)
  VALUES (
    p_attempt_id,
    v_final_status::TEXT,
    jsonb_build_object(
      'overall_score', v_overall_score,
      'accuracy', v_accuracy,
      'total_attempted', v_total_attempted,
      'total_correct', v_total_correct
    )
  );

  RETURN jsonb_build_object(
    'attempt_id', p_attempt_id,
    'status', v_final_status,
    'overall_score', v_overall_score,
    'accuracy_percentage', v_accuracy,
    'total_questions', v_total_questions,
    'total_attempted', v_total_attempted,
    'total_correct', v_total_correct,
    'submitted_at', NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

