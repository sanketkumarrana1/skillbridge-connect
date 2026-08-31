-- ==============================================================================
-- Migration: 050_ai_requests_and_usage_logs.sql
-- Description: Idempotent AI request tracking and fine-grained token/latency usage logs.
-- ==============================================================================

-- 1. AI Requests (Idempotency and lifecycle tracking)
CREATE TABLE IF NOT EXISTS public.ai_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  operation public.ai_operation NOT NULL,
  status public.ai_request_status NOT NULL DEFAULT 'pending',
  model TEXT NOT NULL,
  prompt_version INT NOT NULL DEFAULT 1,
  schema_version TEXT NOT NULL DEFAULT '1.0',
  latency_ms INT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ai_requests_user ON public.ai_requests(user_id, operation, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_requests_status ON public.ai_requests(status);

-- 2. AI Usage Logs (Token counts, performance, and cost tracking)
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id TEXT NOT NULL REFERENCES public.ai_requests(request_id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  operation public.ai_operation NOT NULL,
  model TEXT NOT NULL,
  status public.ai_request_status NOT NULL,
  latency_ms INT,
  input_tokens INT,
  output_tokens INT,
  estimated_cost NUMERIC(10, 6) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user ON public.ai_usage_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_created ON public.ai_usage_logs(created_at DESC);

