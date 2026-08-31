-- ==============================================================================
-- Migration: 063_ai_intelligence_rls.sql
-- Description: Multi-tenant Row Level Security policies for AI intelligence tables.
-- ==============================================================================

-- 1. Enable RLS on all tables
ALTER TABLE public.ai_opportunity_explanations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_candidate_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_resume_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_portfolio_feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_interview_preparations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_user_feedback ENABLE ROW LEVEL SECURITY;

-- 2. AI Opportunity Explanations
DROP POLICY IF EXISTS "Students can view own opportunity explanations" ON public.ai_opportunity_explanations;
CREATE POLICY "Students can view own opportunity explanations"
  ON public.ai_opportunity_explanations FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() OR public.is_admin(auth.uid()));

-- 3. AI Candidate Summaries (Recruiters & Admins)
DROP POLICY IF EXISTS "Recruiters can view candidate summaries for own company applications" ON public.ai_candidate_summaries;
CREATE POLICY "Recruiters can view candidate summaries for own company applications"
  ON public.ai_candidate_summaries FOR SELECT
  TO authenticated
  USING (
    recruiter_id = auth.uid() OR
    public.is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.applications app
      JOIN public.opportunities opp ON opp.id = app.opportunity_id
      JOIN public.memberships mem ON mem.organization_id = opp.company_id
      WHERE app.id = ai_candidate_summaries.application_id
        AND mem.user_id = auth.uid()
    )
  );

-- 4. AI Resume Analyses
DROP POLICY IF EXISTS "Students can view own resume analyses" ON public.ai_resume_analyses;
CREATE POLICY "Students can view own resume analyses"
  ON public.ai_resume_analyses FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() OR public.is_admin(auth.uid()));

-- 5. AI Portfolio Feedbacks
DROP POLICY IF EXISTS "Students can view own portfolio feedbacks" ON public.ai_portfolio_feedbacks;
CREATE POLICY "Students can view own portfolio feedbacks"
  ON public.ai_portfolio_feedbacks FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() OR public.is_admin(auth.uid()));

-- 6. AI Interview Preparations
DROP POLICY IF EXISTS "Students can view own interview preparations" ON public.ai_interview_preparations;
CREATE POLICY "Students can view own interview preparations"
  ON public.ai_interview_preparations FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() OR public.is_admin(auth.uid()));

-- 7. AI User Feedback
DROP POLICY IF EXISTS "Users can insert own AI feedback" ON public.ai_user_feedback;
CREATE POLICY "Users can insert own AI feedback"
  ON public.ai_user_feedback FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view own AI feedback" ON public.ai_user_feedback;
CREATE POLICY "Users can view own AI feedback"
  ON public.ai_user_feedback FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

