-- ==============================================================================
-- Migration: 057_ai_persistence_rls.sql
-- Description: Row Level Security for student AI intelligence tables.
-- ==============================================================================

ALTER TABLE public.ai_skill_gap_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_career_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_learning_recommendations ENABLE ROW LEVEL SECURITY;

-- 1. Skill Gap Results
DROP POLICY IF EXISTS "Students view own skill gap results" ON public.ai_skill_gap_results;
CREATE POLICY "Students view own skill gap results"
  ON public.ai_skill_gap_results FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Students insert own skill gap results" ON public.ai_skill_gap_results;
CREATE POLICY "Students insert own skill gap results"
  ON public.ai_skill_gap_results FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

-- 2. Career Recommendations
DROP POLICY IF EXISTS "Students view own career recommendations" ON public.ai_career_recommendations;
CREATE POLICY "Students view own career recommendations"
  ON public.ai_career_recommendations FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Students insert own career recommendations" ON public.ai_career_recommendations;
CREATE POLICY "Students insert own career recommendations"
  ON public.ai_career_recommendations FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

-- 3. Learning Recommendations
DROP POLICY IF EXISTS "Students view own learning recommendations" ON public.ai_learning_recommendations;
CREATE POLICY "Students view own learning recommendations"
  ON public.ai_learning_recommendations FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Students insert own learning recommendations" ON public.ai_learning_recommendations;
CREATE POLICY "Students insert own learning recommendations"
  ON public.ai_learning_recommendations FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

