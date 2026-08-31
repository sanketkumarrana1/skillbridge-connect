-- ==============================================================================
-- Migration: 016_assessment_questions.sql
-- Description: Question bank and options with secure server-side answer storage.
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE public.question_difficulty AS ENUM (
    'beginner',
    'intermediate',
    'advanced'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.question_status AS ENUM (
    'active',
    'inactive',
    'retired'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 1. Assessment Questions Table
CREATE TABLE IF NOT EXISTS public.assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE RESTRICT,
  category_id UUID REFERENCES public.skill_categories(id) ON DELETE SET NULL,
  topic TEXT NOT NULL,
  question_text TEXT NOT NULL,
  explanation TEXT,
  difficulty public.question_difficulty NOT NULL DEFAULT 'intermediate',
  question_type TEXT NOT NULL DEFAULT 'mcq' CHECK (question_type IN ('mcq')),
  score_value INT NOT NULL DEFAULT 10,
  status public.question_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_assessment_questions_updated_at
  BEFORE UPDATE ON public.assessment_questions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_assessment_questions_skill ON public.assessment_questions(skill_id);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_difficulty ON public.assessment_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_status ON public.assessment_questions(status);

-- 2. Assessment Question Options Table
CREATE TABLE IF NOT EXISTS public.assessment_question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.assessment_questions(id) ON DELETE CASCADE,
  option_key TEXT NOT NULL,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_question_option_order UNIQUE (question_id, display_order)
);

CREATE INDEX IF NOT EXISTS idx_question_options_question ON public.assessment_question_options(question_id);

-- 3. Enable Row Level Security
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_question_options ENABLE ROW LEVEL SECURITY;

-- 4. Policies
-- Questions can be viewed by authenticated users if active
CREATE POLICY "Anyone authenticated can view active questions"
  ON public.assessment_questions FOR SELECT
  TO authenticated
  USING (status = 'active' OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage assessment questions"
  ON public.assessment_questions FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Options: Authenticated users can view options
CREATE POLICY "Anyone authenticated can view question options"
  ON public.assessment_question_options FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.assessment_questions q
      WHERE q.id = assessment_question_options.question_id
        AND (q.status = 'active' OR public.is_admin(auth.uid()))
    )
  );

CREATE POLICY "Admins can manage question options"
  ON public.assessment_question_options FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

