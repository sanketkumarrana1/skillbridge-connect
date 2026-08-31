-- ==============================================================================
-- Migration: 060_ai_persistence_indexes.sql
-- Description: Composite and lookup indexes on AI persistence tables.
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_ai_skill_gap_student_date ON public.ai_skill_gap_results(student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_career_student_date ON public.ai_career_recommendations(student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_learning_student_date ON public.ai_learning_recommendations(student_id, created_at DESC);

