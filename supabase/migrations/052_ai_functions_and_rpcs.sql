-- ==============================================================================
-- Migration: 052_ai_functions_and_rpcs.sql
-- Description: Stored procedures for tracking AI requests, logging token usage, prompt retrieval, and rate limiting.
-- ==============================================================================

-- 1. RPC: record_ai_request_start
CREATE OR REPLACE FUNCTION public.record_ai_request_start(
  p_request_id TEXT,
  p_user_id UUID,
  p_operation TEXT,
  p_model TEXT,
  p_prompt_version INT DEFAULT 1,
  p_schema_version TEXT DEFAULT '1.0'
)
RETURNS JSONB AS $$
DECLARE
  v_rec_id UUID;
BEGIN
  INSERT INTO public.ai_requests (
    request_id,
    user_id,
    operation,
    status,
    model,
    prompt_version,
    schema_version,
    created_at
  ) VALUES (
    p_request_id,
    p_user_id,
    p_operation::public.ai_operation,
    'processing'::public.ai_request_status,
    p_model,
    p_prompt_version,
    p_schema_version,
    NOW()
  )
  ON CONFLICT (request_id) DO UPDATE SET
    status = 'processing'::public.ai_request_status,
    model = EXCLUDED.model
  RETURNING id INTO v_rec_id;

  RETURN jsonb_build_object('success', true, 'id', v_rec_id, 'requestId', p_request_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. RPC: record_ai_request_complete
CREATE OR REPLACE FUNCTION public.record_ai_request_complete(
  p_request_id TEXT,
  p_status TEXT,
  p_latency_ms INT DEFAULT NULL,
  p_input_tokens INT DEFAULT NULL,
  p_output_tokens INT DEFAULT NULL,
  p_cost NUMERIC DEFAULT 0,
  p_error_message TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_req public.ai_requests%ROWTYPE;
BEGIN
  SELECT * INTO v_req FROM public.ai_requests WHERE request_id = p_request_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Request not found.');
  END IF;

  UPDATE public.ai_requests
  SET
    status = p_status::public.ai_request_status,
    latency_ms = p_latency_ms,
    error_message = p_error_message,
    completed_at = NOW()
  WHERE request_id = p_request_id;

  INSERT INTO public.ai_usage_logs (
    request_id,
    user_id,
    operation,
    model,
    status,
    latency_ms,
    input_tokens,
    output_tokens,
    estimated_cost,
    created_at
  ) VALUES (
    p_request_id,
    v_req.user_id,
    v_req.operation,
    v_req.model,
    p_status::public.ai_request_status,
    p_latency_ms,
    p_input_tokens,
    p_output_tokens,
    COALESCE(p_cost, 0),
    NOW()
  );

  RETURN jsonb_build_object('success', true, 'requestId', p_request_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. RPC: get_active_ai_prompt
CREATE OR REPLACE FUNCTION public.get_active_ai_prompt(p_operation TEXT)
RETURNS JSONB AS $$
DECLARE
  v_prompt public.ai_prompt_templates%ROWTYPE;
BEGIN
  SELECT * INTO v_prompt
  FROM public.ai_prompt_templates
  WHERE operation = p_operation::public.ai_operation AND status = 'active'
  ORDER BY version DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'found', false,
      'operation', p_operation
    );
  END IF;

  RETURN jsonb_build_object(
    'found', true,
    'id', v_prompt.id,
    'operation', v_prompt.operation,
    'version', v_prompt.version,
    'systemPrompt', v_prompt.system_prompt,
    'userPromptTemplate', v_prompt.user_prompt_template,
    'schemaVersion', v_prompt.schema_version
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 4. RPC: check_ai_rate_limit
CREATE OR REPLACE FUNCTION public.check_ai_rate_limit(
  p_user_id UUID,
  p_operation TEXT,
  p_max_requests_per_hour INT DEFAULT 30
)
RETURNS JSONB AS $$
DECLARE
  v_count INT := 0;
  v_is_allowed BOOLEAN := true;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM public.ai_requests
  WHERE user_id = p_user_id
    AND operation = p_operation::public.ai_operation
    AND created_at >= NOW() - INTERVAL '1 hour';

  IF v_count >= p_max_requests_per_hour THEN
    v_is_allowed := false;
  END IF;

  RETURN jsonb_build_object(
    'allowed', v_is_allowed,
    'currentHourCount', v_count,
    'limitPerHour', p_max_requests_per_hour
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 5. RPC: get_user_ai_usage_summary
CREATE OR REPLACE FUNCTION public.get_user_ai_usage_summary(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_total_requests INT := 0;
  v_total_tokens INT := 0;
  v_by_operation JSONB;
BEGIN
  IF auth.uid() <> p_user_id AND NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Unauthorized: Cannot view another user''s AI usage.';
  END IF;

  SELECT
    COUNT(*),
    COALESCE(SUM(COALESCE(input_tokens, 0) + COALESCE(output_tokens, 0)), 0)
  INTO
    v_total_requests,
    v_total_tokens
  FROM public.ai_usage_logs
  WHERE user_id = p_user_id;

  SELECT jsonb_agg(
    jsonb_build_object(
      'operation', operation,
      'requestsCount', COUNT(*),
      'tokensUsed', SUM(COALESCE(input_tokens, 0) + COALESCE(output_tokens, 0))
    )
  ) INTO v_by_operation
  FROM public.ai_usage_logs
  WHERE user_id = p_user_id
  GROUP BY operation;

  RETURN jsonb_build_object(
    'totalRequests', v_total_requests,
    'totalTokens', v_total_tokens,
    'byOperation', COALESCE(v_by_operation, '[]'::jsonb)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

