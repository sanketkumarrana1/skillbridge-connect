-- ==============================================================================
-- Migration: 048_ai_enums_and_foundation.sql
-- Description: Core enums for AI operations, request statuses, providers, and prompt template management.
-- ==============================================================================

-- 1. AI Operation Enum (Explicit allowlist of 7 operations)
DO $$ BEGIN
  CREATE TYPE public.ai_operation AS ENUM (
    'assessment_generate',
    'skill_analysis',
    'career_recommendation',
    'learning_recommendation',
    'opportunity_explanation',
    'resume_feedback',
    'interview_preparation'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. AI Request Status Enum
DO $$ BEGIN
  CREATE TYPE public.ai_request_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed',
    'rejected',
    'rate_limited'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. AI Provider Type Enum
DO $$ BEGIN
  CREATE TYPE public.ai_provider_type AS ENUM (
    'openai',
    'mock'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 4. AI Prompt Status Enum
DO $$ BEGIN
  CREATE TYPE public.ai_prompt_status AS ENUM (
    'draft',
    'active',
    'archived'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

