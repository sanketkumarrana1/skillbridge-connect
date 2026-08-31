-- ==============================================================================
-- Migration: 003_organizations.sql
-- Description: Foundation for institutional universities/colleges and industry companies.
-- ==============================================================================

-- 1. Organization Type Enum
DO $$ BEGIN
  CREATE TYPE public.organization_type AS ENUM (
    'institution',
    'company'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Organization Status Enum
DO $$ BEGIN
  CREATE TYPE public.organization_status AS ENUM (
    'active',
    'pending_verification',
    'suspended'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. Organizations Table
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  organization_type public.organization_type NOT NULL,
  status public.organization_status NOT NULL DEFAULT 'active',
  website TEXT,
  logo_url TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Trigger for updated_at
DROP TRIGGER IF EXISTS set_organizations_updated_at ON public.organizations;
CREATE TRIGGER set_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_organizations_type ON public.organizations(organization_type);
CREATE INDEX IF NOT EXISTS idx_organizations_status ON public.organizations(status);
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON public.organizations(slug);

-- 6. Enable Row Level Security
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

