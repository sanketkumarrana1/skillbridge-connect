-- ==============================================================================
-- Migration: 061_ai_operations_expansion.sql
-- Description: Expand public.ai_operation enum to cover candidate summaries, comparisons, resume analyses, portfolio feedback, and interview practice.
-- ==============================================================================

DO $$ BEGIN
  ALTER TYPE public.ai_operation ADD VALUE IF NOT EXISTS 'candidate_summary';
  ALTER TYPE public.ai_operation ADD VALUE IF NOT EXISTS 'candidate_comparison';
  ALTER TYPE public.ai_operation ADD VALUE IF NOT EXISTS 'resume_analysis';
  ALTER TYPE public.ai_operation ADD VALUE IF NOT EXISTS 'portfolio_feedback';
  ALTER TYPE public.ai_operation ADD VALUE IF NOT EXISTS 'interview_practice';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

