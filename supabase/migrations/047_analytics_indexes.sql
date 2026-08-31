-- ==============================================================================
-- Migration: 047_analytics_indexes.sql
-- Description: Composite and covering indexes for institutional and platform analytics queries.
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_opportunities_org_status ON public.opportunities(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_applications_opp_status ON public.applications(opportunity_id, status);
CREATE INDEX IF NOT EXISTS idx_placements_comp_status ON public.placements(company_id, status);

