-- ==============================================================================
-- Migration: 054_ai_indexes.sql
-- Description: Performance optimization indexes for AI request logging and prompt template lookups.
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_ai_requests_op_status ON public.ai_requests(operation, status);
CREATE INDEX IF NOT EXISTS idx_ai_requests_created ON public.ai_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_op ON public.ai_usage_logs(operation, status);
CREATE INDEX IF NOT EXISTS idx_ai_prompt_templates_lookup ON public.ai_prompt_templates(operation, version DESC, status);

