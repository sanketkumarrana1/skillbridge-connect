-- ==============================================================================
-- Migration: 049_ai_prompt_templates.sql
-- Description: Centralized versioned prompt templates for system instructions and structured schemas.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.ai_prompt_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation public.ai_operation NOT NULL,
  version INT NOT NULL DEFAULT 1,
  system_prompt TEXT NOT NULL,
  user_prompt_template TEXT NOT NULL,
  schema_version TEXT NOT NULL DEFAULT '1.0',
  status public.ai_prompt_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_ai_prompt_op_version UNIQUE (operation, version)
);

CREATE INDEX IF NOT EXISTS idx_ai_prompt_templates_op ON public.ai_prompt_templates(operation, status);

