-- ==============================================================================
-- Migration: 017_assessment_configs_attempts.sql
-- Description: Config snapshots, attempts lifecycle, assigned questions, answers, and skill results.
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE public.attempt_status AS ENUM (
    'not_started',
    'in_progress',
    'submitted',
    'auto_submitted',
    'expired',
    'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.assessed_skill_status AS ENUM (
    'insufficient_data',
    'developing',
    'competent',
    'strong'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 1. Assessment Configurations Table (Profile Snapshot)
CREATE TABLE IF NOT EXISTS public.assessment_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE SET NULL,
  question_count INT NOT NULL DEFAULT 20,
  duration_minutes INT NOT NULL DEFAULT 15,
  selected_skills_snapshot JSONB NOT NULL DEFAULT '[]'::jsonb,
  target_roles_snapshot JSONB NOT NULL DEFAULT '[]'::jsonb,
  difficulty_policy TEXT NOT NULL DEFAULT 'adaptive',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessment_configs_student ON public.assessment_configs(student_id);

-- 2. Assessment Attempts Table
CREATE TABLE IF NOT EXISTS public.assessment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id UUID NOT NULL REFERENCES public.assessment_configs(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status public.attempt_status NOT NULL DEFAULT 'in_progress',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  duration_seconds INT,
  question_count INT NOT NULL DEFAULT 20,
  overall_score NUMERIC(5,2),
  accuracy_percentage NUMERIC(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_assessment_attempts_updated_at
  BEFORE UPDATE ON public.assessment_attempts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_assessment_attempts_student ON public.assessment_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_status ON public.assessment_attempts(status);

-- 3. Assessment Attempt Questions Table (Exact Sequence Assignment)
CREATE TABLE IF NOT EXISTS public.assessment_attempt_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.assessment_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.assessment_questions(id) ON DELETE RESTRICT,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE RESTRICT,
  difficulty public.question_difficulty NOT NULL DEFAULT 'intermediate',
  sequence_number INT NOT NULL,
  selected_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_attempt_question UNIQUE (attempt_id, question_id),
  CONSTRAINT uq_attempt_sequence UNIQUE (attempt_id, sequence_number)
);

CREATE INDEX IF NOT EXISTS idx_attempt_questions_attempt ON public.assessment_attempt_questions(attempt_id);

-- 4. Assessment Answers Table
CREATE TABLE IF NOT EXISTS public.assessment_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.assessment_attempts(id) ON DELETE CASCADE,
  attempt_question_id UUID NOT NULL REFERENCES public.assessment_attempt_questions(id) ON DELETE CASCADE,
  selected_option_id UUID REFERENCES public.assessment_question_options(id) ON DELETE SET NULL,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_correct BOOLEAN,
  score_awarded INT DEFAULT 0,
  CONSTRAINT uq_attempt_question_answer UNIQUE (attempt_question_id)
);

CREATE INDEX IF NOT EXISTS idx_assessment_answers_attempt ON public.assessment_answers(attempt_id);

-- 5. Assessment Skill Results Table (Separated from Self-Declared ratings)
CREATE TABLE IF NOT EXISTS public.assessment_skill_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.assessment_attempts(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE RESTRICT,
  questions_count INT NOT NULL DEFAULT 0,
  attempted_count INT NOT NULL DEFAULT 0,
  correct_count INT NOT NULL DEFAULT 0,
  score NUMERIC(5,2) NOT NULL DEFAULT 0,
  assessed_level public.skill_self_level NOT NULL DEFAULT 'intermediate',
  confidence TEXT NOT NULL DEFAULT 'Medium' CHECK (confidence IN ('Low', 'Medium', 'High')),
  result_status public.assessed_skill_status NOT NULL DEFAULT 'competent',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_attempt_skill_result UNIQUE (attempt_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_skill_results_student ON public.assessment_skill_results(student_id);
CREATE INDEX IF NOT EXISTS idx_skill_results_skill ON public.assessment_skill_results(skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_results_attempt ON public.assessment_skill_results(attempt_id);

-- 6. Assessment Audit Events Table
CREATE TABLE IF NOT EXISTS public.assessment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.assessment_attempts(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('started', 'question_assigned', 'answer_saved', 'submitted', 'auto_submitted', 'expired', 'cancelled')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessment_events_attempt ON public.assessment_events(attempt_id);

-- 7. Enable Row Level Security
ALTER TABLE public.assessment_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_attempt_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_skill_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_events ENABLE ROW LEVEL SECURITY;

-- 8. Policies
-- Configs
CREATE POLICY "Students can view own configs"
  ON public.assessment_configs FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Students can insert own configs"
  ON public.assessment_configs FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

-- Attempts
CREATE POLICY "Students can view own attempts"
  ON public.assessment_attempts FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid()
    OR public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.student_profiles sp
      JOIN public.organization_memberships om ON om.organization_id = sp.institution_id
      WHERE sp.user_id = assessment_attempts.student_id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
    )
  );

CREATE POLICY "Students can insert own attempts"
  ON public.assessment_attempts FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own attempts"
  ON public.assessment_attempts FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- Attempt Questions
CREATE POLICY "Students can view assigned attempt questions"
  ON public.assessment_attempt_questions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.assessment_attempts a
      WHERE a.id = assessment_attempt_questions.attempt_id
        AND a.student_id = auth.uid()
    )
    OR public.is_admin(auth.uid())
  );

-- Answers
CREATE POLICY "Students can view own answers"
  ON public.assessment_answers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.assessment_attempts a
      WHERE a.id = assessment_answers.attempt_id
        AND a.student_id = auth.uid()
    )
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "Students can insert own answers"
  ON public.assessment_answers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.assessment_attempts a
      WHERE a.id = assessment_answers.attempt_id
        AND a.student_id = auth.uid()
        AND a.status = 'in_progress'
    )
  );

-- Skill Results
CREATE POLICY "Students can view own skill results"
  ON public.assessment_skill_results FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid()
    OR public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.student_profiles sp
      JOIN public.organization_memberships om ON om.organization_id = sp.institution_id
      WHERE sp.user_id = assessment_skill_results.student_id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
    )
  );

-- Events
CREATE POLICY "Students can view own attempt events"
  ON public.assessment_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.assessment_attempts a
      WHERE a.id = assessment_events.attempt_id
        AND a.student_id = auth.uid()
    )
    OR public.is_admin(auth.uid())
  );

