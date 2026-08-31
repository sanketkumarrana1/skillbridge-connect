-- ==============================================================================
-- Migration: 025_opportunity_rls_and_rpcs.sql
-- Description: RLS policies and server-side RPCs for opportunity eligibility, deterministic matching, and publishing.
-- ==============================================================================

-- 1. Enable Row Level Security
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_eligibility_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_target_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_match_results ENABLE ROW LEVEL SECURITY;

-- 2. Opportunities Policies
CREATE POLICY "Students and public can view published opportunities"
  ON public.opportunities FOR SELECT
  TO authenticated
  USING (
    status = 'published'
    OR public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.organization_memberships om
      WHERE om.organization_id = opportunities.company_id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
    )
  );

CREATE POLICY "Company members can insert opportunities"
  ON public.opportunities FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.organization_memberships om
      WHERE om.organization_id = opportunities.company_id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
    )
  );

CREATE POLICY "Company members can update own opportunities"
  ON public.opportunities FOR UPDATE
  TO authenticated
  USING (
    public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.organization_memberships om
      WHERE om.organization_id = opportunities.company_id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
    )
  )
  WITH CHECK (
    public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.organization_memberships om
      WHERE om.organization_id = opportunities.company_id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
    )
  );

CREATE POLICY "Company members can delete own draft opportunities"
  ON public.opportunities FOR DELETE
  TO authenticated
  USING (
    public.is_admin(auth.uid())
    OR (
      status = 'draft'
      AND EXISTS (
        SELECT 1 FROM public.organization_memberships om
        WHERE om.organization_id = opportunities.company_id
          AND om.user_id = auth.uid()
          AND om.status = 'active'
      )
    )
  );

-- 3. Opportunity Skills Policies
CREATE POLICY "Anyone who can view opportunity can view its skills"
  ON public.opportunity_skills FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.opportunities o
      WHERE o.id = opportunity_skills.opportunity_id
        AND (
          o.status = 'published'
          OR public.is_admin(auth.uid())
          OR EXISTS (
            SELECT 1 FROM public.organization_memberships om
            WHERE om.organization_id = o.company_id
              AND om.user_id = auth.uid()
              AND om.status = 'active'
          )
        )
    )
  );

CREATE POLICY "Company members can manage opportunity skills"
  ON public.opportunity_skills FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.opportunities o
      JOIN public.organization_memberships om ON om.organization_id = o.company_id
      WHERE o.id = opportunity_skills.opportunity_id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
    )
    OR public.is_admin(auth.uid())
  );

-- 4. Opportunity Eligibility Rules Policies
CREATE POLICY "Anyone who can view opportunity can view its eligibility rules"
  ON public.opportunity_eligibility_rules FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.opportunities o
      WHERE o.id = opportunity_eligibility_rules.opportunity_id
        AND (
          o.status = 'published'
          OR public.is_admin(auth.uid())
          OR EXISTS (
            SELECT 1 FROM public.organization_memberships om
            WHERE om.organization_id = o.company_id
              AND om.user_id = auth.uid()
              AND om.status = 'active'
          )
        )
    )
  );

CREATE POLICY "Company members can manage eligibility rules"
  ON public.opportunity_eligibility_rules FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.opportunities o
      JOIN public.organization_memberships om ON om.organization_id = o.company_id
      WHERE o.id = opportunity_eligibility_rules.opportunity_id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
    )
    OR public.is_admin(auth.uid())
  );

-- 5. Opportunity Target Roles Policies
CREATE POLICY "Anyone who can view opportunity can view target roles"
  ON public.opportunity_target_roles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.opportunities o
      WHERE o.id = opportunity_target_roles.opportunity_id
        AND (
          o.status = 'published'
          OR public.is_admin(auth.uid())
          OR EXISTS (
            SELECT 1 FROM public.organization_memberships om
            WHERE om.organization_id = o.company_id
              AND om.user_id = auth.uid()
              AND om.status = 'active'
          )
        )
    )
  );

CREATE POLICY "Company members can manage target roles"
  ON public.opportunity_target_roles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.opportunities o
      JOIN public.organization_memberships om ON om.organization_id = o.company_id
      WHERE o.id = opportunity_target_roles.opportunity_id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
    )
    OR public.is_admin(auth.uid())
  );

-- 6. Saved Opportunities Policies
CREATE POLICY "Students can view own saved opportunities"
  ON public.saved_opportunities FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Students can save opportunities"
  ON public.saved_opportunities FOR INSERT
  TO authenticated
  WITH CHECK (
    student_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.opportunities o
      WHERE o.id = saved_opportunities.opportunity_id
        AND (o.status = 'published' OR public.is_admin(auth.uid()))
    )
  );

CREATE POLICY "Students can delete own saved opportunities"
  ON public.saved_opportunities FOR DELETE
  TO authenticated
  USING (student_id = auth.uid() OR public.is_admin(auth.uid()));

-- 7. Match Results Policies
CREATE POLICY "Students can view own match results"
  ON public.opportunity_match_results FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Students can insert own match results"
  ON public.opportunity_match_results FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Students can update own match results"
  ON public.opportunity_match_results FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid() OR public.is_admin(auth.uid()))
  WITH CHECK (student_id = auth.uid() OR public.is_admin(auth.uid()));

-- ==============================================================================
-- RPC: check_opportunity_eligibility
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.check_opportunity_eligibility(
  p_student_id UUID,
  p_opportunity_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_student RECORD;
  v_rule RECORD;
  v_passed TEXT[] := '{}';
  v_failed TEXT[] := '{}';
  v_notes TEXT[] := '{}';
  v_score INT := 100;
  v_is_eligible BOOLEAN := TRUE;
  v_student_degree TEXT;
  v_student_prog TEXT;
  v_student_dept TEXT;
  v_student_grad_yr TEXT;
  v_student_grade NUMERIC;
  v_rule_val_text TEXT;
  v_matches BOOLEAN;
BEGIN
  -- 1. Fetch Student Academic Profile
  SELECT * INTO v_student FROM public.student_profiles WHERE user_id = p_student_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'is_eligible', false,
      'score', 0,
      'passed_criteria', '[]'::jsonb,
      'disqualifying_criteria', jsonb_build_array('Student profile not found or onboarding incomplete.'),
      'notes', '[]'::jsonb
    );
  END IF;

  v_student_degree := LOWER(COALESCE(v_student.degree, ''));
  v_student_prog := LOWER(COALESCE(v_student.program, ''));
  v_student_grad_yr := COALESCE(v_student.graduation_year::TEXT, '');
  v_student_grade := COALESCE(NULLIF(regexp_replace(v_student.grade, '[^0-9.]', '', 'g'), '')::NUMERIC, 8.0);

  -- 2. Evaluate Eligibility Rules
  FOR v_rule IN
    SELECT * FROM public.opportunity_eligibility_rules WHERE opportunity_id = p_opportunity_id
  LOOP
    v_matches := FALSE;

    IF v_rule.rule_type = 'degree' THEN
      IF v_rule.value ? 'Any' OR v_rule.value ? 'All' THEN
        v_matches := TRUE;
      ELSE
        SELECT EXISTS (
          SELECT 1 FROM jsonb_array_elements_text(v_rule.value) elem
          WHERE v_student_degree ILIKE '%' || elem || '%' OR elem ILIKE '%' || v_student_degree || '%'
        ) INTO v_matches;
      END IF;

      IF v_matches THEN
        v_passed := array_append(v_passed, 'Degree Requirement Met: ' || v_rule.value::TEXT);
      ELSE
        v_failed := array_append(v_failed, 'Degree Mismatch: Opportunity requires ' || v_rule.value::TEXT);
      END IF;

    ELSIF v_rule.rule_type = 'program' OR v_rule.rule_type = 'department' THEN
      IF v_rule.value ? 'Any' OR v_rule.value ? 'All' THEN
        v_matches := TRUE;
      ELSE
        SELECT EXISTS (
          SELECT 1 FROM jsonb_array_elements_text(v_rule.value) elem
          WHERE v_student_prog ILIKE '%' || elem || '%' OR elem ILIKE '%' || v_student_prog || '%'
        ) INTO v_matches;
      END IF;

      IF v_matches THEN
        v_passed := array_append(v_passed, 'Discipline Requirement Met: ' || v_rule.value::TEXT);
      ELSE
        v_failed := array_append(v_failed, 'Department Requirement: Requires ' || v_rule.value::TEXT);
      END IF;

    ELSIF v_rule.rule_type = 'graduation_year' THEN
      IF v_rule.value ? 'Any' OR v_rule.value ? 'All' THEN
        v_matches := TRUE;
      ELSE
        SELECT EXISTS (
          SELECT 1 FROM jsonb_array_elements_text(v_rule.value) elem
          WHERE v_student_grad_yr ILIKE '%' || elem || '%'
        ) INTO v_matches;
      END IF;

      IF v_matches THEN
        v_passed := array_append(v_passed, 'Graduation Batch Met: ' || v_rule.value::TEXT);
      ELSE
        v_failed := array_append(v_failed, 'Graduation Batch Mismatch: Targeted at ' || v_rule.value::TEXT);
      END IF;

    ELSIF v_rule.rule_type = 'minimum_cgpa' THEN
      IF v_student_grade >= (v_rule.value#>>'{}')::NUMERIC THEN
        v_matches := TRUE;
        v_passed := array_append(v_passed, 'Minimum CGPA Met (>= ' || (v_rule.value#>>'{}') || ')');
      ELSE
        v_failed := array_append(v_failed, 'CGPA Requirement: Requires min ' || (v_rule.value#>>'{}') || ' CGPA');
      END IF;
    END IF;
  END LOOP;

  IF array_length(v_failed, 1) > 0 THEN
    v_is_eligible := FALSE;
  END IF;

  IF (array_length(v_passed, 1) + array_length(v_failed, 1)) > 0 THEN
    v_score := ROUND((COALESCE(array_length(v_passed, 1), 0)::NUMERIC / (COALESCE(array_length(v_passed, 1), 0) + COALESCE(array_length(v_failed, 1), 0))::NUMERIC) * 100);
  ELSE
    v_score := 100;
    v_passed := array_append(v_passed, 'Open Eligibility: No restrictive academic barriers');
  END IF;

  RETURN jsonb_build_object(
    'is_eligible', v_is_eligible,
    'score', v_score,
    'passed_criteria', to_jsonb(v_passed),
    'disqualifying_criteria', to_jsonb(v_failed),
    'notes', to_jsonb(v_notes)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- RPC: calculate_opportunity_match
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.calculate_opportunity_match(
  p_student_id UUID,
  p_opportunity_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_opp RECORD;
  v_eligibility JSONB;
  v_is_eligible BOOLEAN;
  v_eligibility_fit NUMERIC;

  v_req_skill RECORD;
  v_student_skill RECORD;
  v_matching_skills JSONB := '[]'::jsonb;
  v_missing_skills JSONB := '[]'::jsonb;
  v_total_weight NUMERIC := 0;
  v_earned_weight NUMERIC := 0;
  v_skill_fit NUMERIC := 70;

  v_career_fit NUMERIC := 65;
  v_readiness_fit NUMERIC := 75;
  v_evidence_fit NUMERIC := 60;
  v_preference_fit NUMERIC := 80;
  v_overall_match NUMERIC := 0;
  v_category_tag public.opportunity_match_category;

  v_strengths TEXT[] := '{}';
  v_concerns TEXT[] := '{}';
  v_why_you_match TEXT[] := '{}';
  v_what_is_missing TEXT[] := '{}';
  v_what_would_improve TEXT[] := '{}';

  v_target_role_match_count INT := 0;
  v_match_res_id UUID;
BEGIN
  -- 1. Fetch Opportunity
  SELECT * INTO v_opp FROM public.opportunities WHERE id = p_opportunity_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Opportunity not found.';
  END IF;

  -- 2. Check Eligibility
  v_eligibility := public.check_opportunity_eligibility(p_student_id, p_opportunity_id);
  v_is_eligible := (v_eligibility->>'is_eligible')::BOOLEAN;
  v_eligibility_fit := (v_eligibility->>'score')::NUMERIC;

  -- 3. Calculate Skill Fit with Weights
  FOR v_req_skill IN
    SELECT os.*, s.name AS skill_name
    FROM public.opportunity_skills os
    JOIN public.skills s ON s.id = os.skill_id
    WHERE os.opportunity_id = p_opportunity_id
  LOOP
    v_total_weight := v_total_weight + v_req_skill.weight;

    -- Check if student has declared or assessed this skill
    SELECT ss.*, sr.assessed_level, sr.score AS assessed_score
    INTO v_student_skill
    FROM public.student_skills ss
    LEFT JOIN public.assessment_skill_results sr
      ON sr.student_id = p_student_id AND sr.skill_id = v_req_skill.skill_id
    WHERE ss.student_id = p_student_id AND ss.skill_id = v_req_skill.skill_id
    LIMIT 1;

    IF FOUND THEN
      v_earned_weight := v_earned_weight + v_req_skill.weight;
      v_matching_skills := v_matching_skills || jsonb_build_object(
        'name', v_req_skill.skill_name,
        'level', COALESCE(v_student_skill.assessed_level::TEXT, v_student_skill.self_level::TEXT, 'intermediate'),
        'score', COALESCE(v_student_skill.assessed_score, v_student_skill.self_score, 75),
        'is_assessed', (v_student_skill.assessed_score IS NOT NULL)
      );
    ELSE
      v_missing_skills := v_missing_skills || to_jsonb(v_req_skill.skill_name);
      v_what_is_missing := array_append(v_what_is_missing, v_req_skill.skill_name || ' (' || v_req_skill.requirement_type || ')');
    END IF;
  END LOOP;

  IF v_total_weight > 0 THEN
    v_skill_fit := ROUND((v_earned_weight / v_total_weight) * 100, 2);
  ELSE
    v_skill_fit := 85;
  END IF;

  -- 4. Check Career Role Alignment
  SELECT COUNT(*) INTO v_target_role_match_count
  FROM public.opportunity_target_roles otr
  JOIN public.student_target_roles str
    ON str.target_role_id = otr.target_role_id AND str.student_id = p_student_id
  WHERE otr.opportunity_id = p_opportunity_id;

  IF v_target_role_match_count > 0 THEN
    v_career_fit := 95;
    v_why_you_match := array_append(v_why_you_match, 'Directly aligns with your selected target career trajectory.');
  ELSE
    v_career_fit := 65;
  END IF;

  -- 5. Build Explanation Vectors
  IF v_skill_fit >= 75 THEN
    v_why_you_match := array_append(v_why_you_match, 'Strong technical skill coverage (' || jsonb_array_length(v_matching_skills) || ' matching skills).');
    v_strengths := array_append(v_strengths, 'Core Technical Stack Fit');
  END IF;

  IF v_is_eligible THEN
    v_why_you_match := array_append(v_why_you_match, 'Fully meets academic and eligibility qualifications.');
  ELSE
    v_concerns := array_append(v_concerns, 'Does not currently satisfy all formal eligibility criteria.');
  END IF;

  IF jsonb_array_length(v_missing_skills) > 0 THEN
    v_what_would_improve := array_append(v_what_would_improve, 'Acquire or verify: ' || (SELECT string_agg(elem, ', ') FROM jsonb_array_elements_text(v_missing_skills) elem));
  END IF;

  -- 6. Compute Overall Composite Match Score
  IF NOT v_is_eligible THEN
    v_overall_match := LEAST(ROUND((v_skill_fit * 0.35 + v_eligibility_fit * 0.25 + v_career_fit * 0.2 + v_readiness_fit * 0.2), 2), 48.0);
    v_category_tag := 'not_eligible';
  ELSE
    v_overall_match := ROUND((v_skill_fit * 0.40 + v_career_fit * 0.25 + v_readiness_fit * 0.15 + v_eligibility_fit * 0.10 + v_preference_fit * 0.10), 2);
    IF v_overall_match >= 85 THEN
      v_category_tag := 'best_match';
    ELSIF v_overall_match >= 75 THEN
      v_category_tag := 'quick_win';
    ELSIF v_overall_match >= 60 THEN
      v_category_tag := 'skill_building';
    ELSE
      v_category_tag := 'general_match';
    END IF;
  END IF;

  -- 7. Persist or Update Match Snapshot
  INSERT INTO public.opportunity_match_results (
    student_id,
    opportunity_id,
    overall_match,
    category_tag,
    skill_fit,
    eligibility_fit,
    career_fit,
    readiness_fit,
    evidence_fit,
    preference_fit,
    matching_skills,
    missing_skills,
    strengths,
    concerns,
    why_you_match,
    what_is_missing,
    what_would_improve,
    eligibility_result,
    calculated_at
  ) VALUES (
    p_student_id,
    p_opportunity_id,
    v_overall_match,
    v_category_tag,
    v_skill_fit,
    v_eligibility_fit,
    v_career_fit,
    v_readiness_fit,
    v_evidence_fit,
    v_preference_fit,
    v_matching_skills,
    v_missing_skills,
    to_jsonb(v_strengths),
    to_jsonb(v_concerns),
    to_jsonb(v_why_you_match),
    to_jsonb(v_what_is_missing),
    to_jsonb(v_what_would_improve),
    v_eligibility,
    NOW()
  )
  ON CONFLICT (student_id, opportunity_id) DO UPDATE SET
    overall_match = EXCLUDED.overall_match,
    category_tag = EXCLUDED.category_tag,
    skill_fit = EXCLUDED.skill_fit,
    eligibility_fit = EXCLUDED.eligibility_fit,
    career_fit = EXCLUDED.career_fit,
    readiness_fit = EXCLUDED.readiness_fit,
    evidence_fit = EXCLUDED.evidence_fit,
    preference_fit = EXCLUDED.preference_fit,
    matching_skills = EXCLUDED.matching_skills,
    missing_skills = EXCLUDED.missing_skills,
    strengths = EXCLUDED.strengths,
    concerns = EXCLUDED.concerns,
    why_you_match = EXCLUDED.why_you_match,
    what_is_missing = EXCLUDED.what_is_missing,
    what_would_improve = EXCLUDED.what_would_improve,
    eligibility_result = EXCLUDED.eligibility_result,
    calculated_at = NOW();

  RETURN jsonb_build_object(
    'opportunity_id', p_opportunity_id,
    'overall_match', v_overall_match,
    'category_tag', v_category_tag,
    'skill_fit', v_skill_fit,
    'eligibility_fit', v_eligibility_fit,
    'career_fit', v_career_fit,
    'readiness_fit', v_readiness_fit,
    'evidence_fit', v_evidence_fit,
    'preference_fit', v_preference_fit,
    'matching_skills', v_matching_skills,
    'missing_skills', v_missing_skills,
    'strengths', to_jsonb(v_strengths),
    'concerns', to_jsonb(v_concerns),
    'why_you_match', to_jsonb(v_why_you_match),
    'what_is_missing', to_jsonb(v_what_is_missing),
    'what_would_improve', to_jsonb(v_what_would_improve),
    'eligibility_result', v_eligibility
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- RPC: publish_opportunity
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.publish_opportunity(p_opportunity_id UUID)
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

  IF NOT (
    public.is_admin(v_caller_id)
    OR EXISTS (
      SELECT 1 FROM public.organization_memberships om
      WHERE om.organization_id = v_opp.company_id
        AND om.user_id = v_caller_id
        AND om.status = 'active'
    )
  ) THEN
    RAISE EXCEPTION 'Unauthorized: You do not have permission to publish opportunities for this organization.';
  END IF;

  UPDATE public.opportunities
  SET
    status = 'published',
    published_at = NOW(),
    updated_at = NOW()
  WHERE id = p_opportunity_id;

  RETURN jsonb_build_object('success', true, 'opportunity_id', p_opportunity_id, 'status', 'published');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- RPC: close_opportunity
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.close_opportunity(p_opportunity_id UUID)
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

  IF NOT (
    public.is_admin(v_caller_id)
    OR EXISTS (
      SELECT 1 FROM public.organization_memberships om
      WHERE om.organization_id = v_opp.company_id
        AND om.user_id = v_caller_id
        AND om.status = 'active'
    )
  ) THEN
    RAISE EXCEPTION 'Unauthorized: You do not have permission to close opportunities for this organization.';
  END IF;

  UPDATE public.opportunities
  SET
    status = 'closed',
    closed_at = NOW(),
    updated_at = NOW()
  WHERE id = p_opportunity_id;

  RETURN jsonb_build_object('success', true, 'opportunity_id', p_opportunity_id, 'status', 'closed');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

