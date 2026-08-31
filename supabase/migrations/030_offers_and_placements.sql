-- ==============================================================================
-- Migration: 030_offers_and_placements.sql
-- Description: Job offers, candidate response handling, and confirmed placements.
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE public.offer_status AS ENUM (
    'draft',
    'issued',
    'accepted',
    'declined',
    'expired',
    'rescinded'
  );
  CREATE TYPE public.placement_status AS ENUM (
    'confirmed',
    'onboarding',
    'joined',
    'completed',
    'reneged',
    'terminated'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  role_title TEXT NOT NULL,
  compensation_ctc NUMERIC(12,2) NOT NULL,
  stipend_monthly NUMERIC(10,2),
  joining_date DATE NOT NULL,
  location TEXT NOT NULL,
  offer_letter_url TEXT,
  status public.offer_status NOT NULL DEFAULT 'issued',
  expires_at TIMESTAMPTZ NOT NULL,
  responded_at TIMESTAMPTZ,
  decline_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_app_offer UNIQUE(application_id)
);

CREATE TABLE IF NOT EXISTS public.placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  offer_id UUID NOT NULL REFERENCES public.offers(id) ON DELETE CASCADE,
  role_title TEXT NOT NULL,
  compensation_ctc NUMERIC(12,2) NOT NULL,
  joining_date DATE NOT NULL,
  status public.placement_status NOT NULL DEFAULT 'confirmed',
  confirmed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_app_placement UNIQUE(application_id)
);

CREATE INDEX IF NOT EXISTS idx_offers_application ON public.offers(application_id);
CREATE INDEX IF NOT EXISTS idx_placements_student ON public.placements(student_id);
CREATE INDEX IF NOT EXISTS idx_placements_company ON public.placements(company_id);

