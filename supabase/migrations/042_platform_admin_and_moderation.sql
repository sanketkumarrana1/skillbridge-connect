-- ==============================================================================
-- Migration: 042_platform_admin_and_moderation.sql
-- Description: Platform moderation queue, dispute tracking, and system audit logs.
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE public.moderation_status AS ENUM (
    'pending_review',
    'approved',
    'flagged',
    'rejected',
    'suspended'
  );
  CREATE TYPE public.moderation_entity_type AS ENUM (
    'opportunity',
    'company_profile',
    'user_profile',
    'assessment_question',
    'skill_evidence'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.platform_moderation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type public.moderation_entity_type NOT NULL,
  entity_id UUID NOT NULL,
  status public.moderation_status NOT NULL DEFAULT 'pending_review',
  flag_reason TEXT,
  flagged_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  moderator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  moderator_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.platform_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB NOT NULL DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mod_queue_status ON public.platform_moderation_queue(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.platform_audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.platform_audit_logs(action_type);

