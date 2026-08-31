-- ==============================================================================
-- Migration: 004_memberships.sql
-- Description: Maps users to organizations with membership roles and statuses.
-- ==============================================================================

-- 1. Membership Role Enum
DO $$ BEGIN
  CREATE TYPE public.membership_role AS ENUM (
    'owner',
    'admin',
    'member',
    'recruiter',
    'faculty',
    'placement_officer'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Organization Memberships Table
CREATE TABLE IF NOT EXISTS public.organization_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  membership_role public.membership_role NOT NULL DEFAULT 'member',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'invited', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_org_user UNIQUE (organization_id, user_id)
);

-- 3. Trigger for updated_at
DROP TRIGGER IF EXISTS set_memberships_updated_at ON public.organization_memberships;
CREATE TRIGGER set_memberships_updated_at
  BEFORE UPDATE ON public.organization_memberships
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_memberships_org ON public.organization_memberships(organization_id);
CREATE INDEX IF NOT EXISTS idx_memberships_user ON public.organization_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_status ON public.organization_memberships(status);

-- 5. Enable Row Level Security
ALTER TABLE public.organization_memberships ENABLE ROW LEVEL SECURITY;

