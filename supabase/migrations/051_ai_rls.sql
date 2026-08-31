-- ==============================================================================
-- Migration: 051_ai_rls.sql
-- Description: Row Level Security policies for AI requests, usage logs, and prompt templates.
-- ==============================================================================

-- 1. Enable RLS
ALTER TABLE public.ai_prompt_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- 2. Prompt Templates Policies
DROP POLICY IF EXISTS "Authenticated users can read active prompt templates" ON public.ai_prompt_templates;
CREATE POLICY "Authenticated users can read active prompt templates"
  ON public.ai_prompt_templates FOR SELECT
  TO authenticated
  USING (status = 'active' OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Superadmins can manage prompt templates" ON public.ai_prompt_templates;
CREATE POLICY "Superadmins can manage prompt templates"
  ON public.ai_prompt_templates FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- 3. AI Requests Policies
DROP POLICY IF EXISTS "Users can view own AI requests" ON public.ai_requests;
CREATE POLICY "Users can view own AI requests"
  ON public.ai_requests FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

-- 4. AI Usage Logs Policies
DROP POLICY IF EXISTS "Users can view own AI usage logs" ON public.ai_usage_logs;
CREATE POLICY "Users can view own AI usage logs"
  ON public.ai_usage_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

