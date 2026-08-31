-- ==============================================================================
-- Migration: 034_company_extensions.sql
-- Description: Extend organizations table with company-level attributes, verification lifecycle, and branding.
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE public.company_verification_status AS ENUM (
    'unverified',
    'pending',
    'verified',
    'rejected',
    'suspended'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS legal_name TEXT,
  ADD COLUMN IF NOT EXISTS display_name TEXT,
  ADD COLUMN IF NOT EXISTS industry TEXT,
  ADD COLUMN IF NOT EXISTS company_size TEXT DEFAULT '100 - 500 Employees',
  ADD COLUMN IF NOT EXISTS founded_year TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS headquarters_location TEXT,
  ADD COLUMN IF NOT EXISTS logo_hue INTEGER DEFAULT 220,
  ADD COLUMN IF NOT EXISTS verification_status public.company_verification_status NOT NULL DEFAULT 'unverified',
  ADD COLUMN IF NOT EXISTS verification_submitted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS verification_notes TEXT;

CREATE INDEX IF NOT EXISTS idx_organizations_verification ON public.organizations(verification_status);
CREATE INDEX IF NOT EXISTS idx_organizations_industry ON public.organizations(industry);

