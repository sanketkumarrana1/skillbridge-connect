-- ==============================================================================
-- Migration: 055_ai_provider_gemini.sql
-- Description: Integration metadata for Google Gemini AI provider.
-- ==============================================================================

DO $$ BEGIN
  ALTER TYPE public.ai_provider_type ADD VALUE IF NOT EXISTS 'gemini';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

