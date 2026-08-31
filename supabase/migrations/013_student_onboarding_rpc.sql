-- ==============================================================================
-- Migration: 013_student_onboarding_rpc.sql
-- Description: Transactional PostgreSQL RPC to atomically save multi-step student onboarding.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.save_student_onboarding(payload JSONB)
RETURNS JSONB AS $$
DECLARE
  target_user_id UUID;
  auth_caller_id UUID;
  item_record JSONB;
  evidence_record JSONB;
  matched_skill_id UUID;
  created_skill_row_id UUID;
  matched_interest_id UUID;
  matched_role_id UUID;
  inst_id UUID;
  dept_id UUID;
BEGIN
  -- 1. Security Check: Authenticated caller validation
  auth_caller_id := auth.uid();
  target_user_id := (payload->>'student_id')::UUID;

  IF auth_caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthenticated request.';
  END IF;

  IF target_user_id != auth_caller_id AND NOT public.is_admin(auth_caller_id) THEN
    RAISE EXCEPTION 'Unauthorized: You can only save your own onboarding profile.';
  END IF;

  -- 2. Update Base Profile
  UPDATE public.profiles
  SET
    full_name = COALESCE(payload->'personal'->>'full_name', full_name),
    phone = payload->'personal'->>'phone',
    city = payload->'personal'->>'city',
    state = payload->'personal'->>'state',
    country = COALESCE(payload->'personal'->>'country', 'India'),
    avatar_url = payload->'personal'->>'avatar_url',
    updated_at = NOW()
  WHERE id = target_user_id;

  -- 3. Resolve Optional Institution / Department
  inst_id := NULL;
  IF (payload->'academic'->>'institution_id') IS NOT NULL AND (payload->'academic'->>'institution_id') != '' THEN
    inst_id := (payload->'academic'->>'institution_id')::UUID;
  END IF;

  dept_id := NULL;
  IF (payload->'academic'->>'department_id') IS NOT NULL AND (payload->'academic'->>'department_id') != '' THEN
    dept_id := (payload->'academic'->>'department_id')::UUID;
  END IF;

  -- 4. Upsert Student Profile
  INSERT INTO public.student_profiles (
    user_id,
    institution_id,
    department_id,
    degree,
    program,
    academic_year,
    graduation_year,
    academic_status,
    grade,
    headline,
    about,
    onboarding_completed,
    updated_at
  ) VALUES (
    target_user_id,
    inst_id,
    dept_id,
    payload->'academic'->>'degree',
    payload->'academic'->>'program',
    payload->'academic'->>'academic_year',
    NULLIF(payload->'academic'->>'graduation_year', '')::INT,
    COALESCE(payload->'academic'->>'academic_status', 'Enrolled'),
    payload->'academic'->>'grade',
    payload->'personal'->>'headline',
    payload->'personal'->>'about',
    TRUE,
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    institution_id = EXCLUDED.institution_id,
    department_id = EXCLUDED.department_id,
    degree = EXCLUDED.degree,
    program = EXCLUDED.program,
    academic_year = EXCLUDED.academic_year,
    graduation_year = EXCLUDED.graduation_year,
    academic_status = EXCLUDED.academic_status,
    grade = EXCLUDED.grade,
    headline = EXCLUDED.headline,
    about = EXCLUDED.about,
    onboarding_completed = TRUE,
    updated_at = NOW();

  -- 5. Sync Career Interests
  DELETE FROM public.student_career_interests WHERE student_id = target_user_id;
  IF payload->'career_preferences'->'career_interests' IS NOT NULL THEN
    FOR item_record IN SELECT * FROM jsonb_array_elements_text(payload->'career_preferences'->'career_interests')
    LOOP
      SELECT id INTO matched_interest_id FROM public.career_interests WHERE name ILIKE item_record #>> '{}' OR slug ILIKE item_record #>> '{}' LIMIT 1;
      IF matched_interest_id IS NOT NULL THEN
        INSERT INTO public.student_career_interests (student_id, career_interest_id)
        VALUES (target_user_id, matched_interest_id)
        ON CONFLICT DO NOTHING;
      END IF;
    END LOOP;
  END IF;

  -- 6. Sync Target Roles
  DELETE FROM public.student_target_roles WHERE student_id = target_user_id;
  IF payload->'career_preferences'->'target_roles' IS NOT NULL THEN
    FOR item_record IN SELECT * FROM jsonb_array_elements_text(payload->'career_preferences'->'target_roles')
    LOOP
      SELECT id INTO matched_role_id FROM public.target_roles WHERE title ILIKE item_record #>> '{}' OR slug ILIKE item_record #>> '{}' LIMIT 1;
      IF matched_role_id IS NOT NULL THEN
        INSERT INTO public.student_target_roles (student_id, target_role_id)
        VALUES (target_user_id, matched_role_id)
        ON CONFLICT DO NOTHING;
      END IF;
    END LOOP;
  END IF;

  -- 7. Upsert Opportunity Preferences
  INSERT INTO public.student_opportunity_preferences (
    student_id,
    preferred_work_types,
    preferred_work_modes,
    preferred_cities,
    availability,
    preferred_opportunity_types,
    updated_at
  ) VALUES (
    target_user_id,
    ARRAY(SELECT jsonb_array_elements_text(COALESCE(payload->'career_preferences'->'preferred_work_types', '[]'::jsonb))),
    ARRAY(SELECT jsonb_array_elements_text(COALESCE(payload->'career_preferences'->'preferred_work_modes', '[]'::jsonb))),
    ARRAY(SELECT jsonb_array_elements_text(COALESCE(payload->'career_preferences'->'preferred_cities', '[]'::jsonb))),
    COALESCE(payload->'career_preferences'->>'availability', 'Immediate (Summer 2026)'),
    ARRAY(SELECT jsonb_array_elements_text(COALESCE(payload->'career_preferences'->'preferred_opportunity_types', '[]'::jsonb))),
    NOW()
  )
  ON CONFLICT (student_id) DO UPDATE SET
    preferred_work_types = EXCLUDED.preferred_work_types,
    preferred_work_modes = EXCLUDED.preferred_work_modes,
    preferred_cities = EXCLUDED.preferred_cities,
    availability = EXCLUDED.availability,
    preferred_opportunity_types = EXCLUDED.preferred_opportunity_types,
    updated_at = NOW();

  -- 8. Sync Declared Skills & Evidence
  IF payload->'declared_skills' IS NOT NULL THEN
    FOR item_record IN SELECT * FROM jsonb_array_elements(payload->'declared_skills')
    LOOP
      -- Resolve skill ID by UUID or Name
      matched_skill_id := NULL;
      IF (item_record->>'skill_id') ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
        matched_skill_id := (item_record->>'skill_id')::UUID;
      ELSE
        SELECT id INTO matched_skill_id FROM public.skills
        WHERE name ILIKE item_record->>'name' OR slug ILIKE item_record->>'name'
        LIMIT 1;
      END IF;

      IF matched_skill_id IS NOT NULL THEN
        -- Upsert student_skills
        INSERT INTO public.student_skills (
          student_id,
          skill_id,
          self_level,
          self_score,
          last_updated_at
        ) VALUES (
          target_user_id,
          matched_skill_id,
          COALESCE((item_record->>'proficiency')::public.skill_self_level, 'intermediate'::public.skill_self_level),
          COALESCE((item_record->>'proficiency_level')::INT, 50),
          NOW()
        )
        ON CONFLICT (student_id, skill_id) DO UPDATE SET
          self_level = EXCLUDED.self_level,
          self_score = EXCLUDED.self_score,
          last_updated_at = NOW()
        RETURNING id INTO created_skill_row_id;

        -- Insert Evidence records
        IF item_record->'evidence' IS NOT NULL THEN
          FOR evidence_record IN SELECT * FROM jsonb_array_elements(item_record->'evidence')
          LOOP
            INSERT INTO public.skill_evidence (
              student_skill_id,
              student_id,
              evidence_type,
              title,
              description,
              url,
              verification_status
            ) VALUES (
              created_skill_row_id,
              target_user_id,
              COALESCE(evidence_record->>'type', 'project'),
              COALESCE(evidence_record->>'title', 'Skill Evidence Item'),
              evidence_record->>'description',
              evidence_record->>'url',
              'evidence_added'
            );
          END LOOP;
        END IF;
      END IF;
    END LOOP;
  END IF;

  RETURN jsonb_build_object(
    'success', TRUE,
    'student_id', target_user_id,
    'message', 'Onboarding completed and profile persisted successfully.'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

