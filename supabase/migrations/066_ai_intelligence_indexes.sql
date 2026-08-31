-- ==============================================================================
-- Migration: 066_ai_intelligence_indexes.sql
-- Description: Indexes for caching lookups on Opportunity, Candidate, Resume, Portfolio, Interview, and User Feedback tables.
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_ai_opp_exp_student_opp ON public.ai_opportunity_explanations(student_id, opportunity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_cand_summary_app ON public.ai_candidate_summaries(application_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_resume_analysis_student ON public.ai_resume_analyses(student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_portfolio_feedback_student ON public.ai_portfolio_feedbacks(student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_interview_prep_student ON public.ai_interview_preparations(student_id, target_role_title, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_user_feedback_req ON public.ai_user_feedback(request_id, created_at DESC);

