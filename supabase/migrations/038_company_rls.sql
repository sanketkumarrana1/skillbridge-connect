-- ==============================================================================
-- Migration: 038_company_rls.sql
-- Description: Multi-tenant Row Level Security policies for companies, memberships, opportunity recruiters, and audit logs.
-- ==============================================================================

-- 1. Enable RLS on newly created tables
ALTER TABLE public.opportunity_recruiters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_audit_logs ENABLE ROW LEVEL SECURITY;

-- 2. Organizations RLS Policies
DROP POLICY IF EXISTS "Public can view active and verified organizations" ON public.organizations;
CREATE POLICY "Public can view active and verified organizations"
  ON public.organizations FOR SELECT
  TO authenticated
  USING (
    status = 'active'
    OR public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.organization_memberships om
      WHERE om.organization_id = organizations.id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
    )
  );

DROP POLICY IF EXISTS "Company admins can update own company profile" ON public.organizations;
CREATE POLICY "Company admins can update own company profile"
  ON public.organizations FOR UPDATE
  TO authenticated
  USING (
    public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.organization_memberships om
      WHERE om.organization_id = organizations.id
        AND om.user_id = auth.uid()
        AND om.membership_role IN ('owner', 'admin', 'recruiter')
        AND om.status = 'active'
    )
  )
  WITH CHECK (
    public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.organization_memberships om
      WHERE om.organization_id = organizations.id
        AND om.user_id = auth.uid()
        AND om.membership_role IN ('owner', 'admin', 'recruiter')
        AND om.status = 'active'
    )
  );

-- 3. Opportunity Recruiters Policies
CREATE POLICY "Company members can view opportunity recruiters"
  ON public.opportunity_recruiters FOR SELECT
  TO authenticated
  USING (
    public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.opportunities o
      JOIN public.organization_memberships om ON om.organization_id = o.company_id
      WHERE o.id = opportunity_recruiters.opportunity_id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
    )
  );

CREATE POLICY "Company admins can manage opportunity recruiters"
  ON public.opportunity_recruiters FOR ALL
  TO authenticated
  USING (
    public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.opportunities o
      JOIN public.organization_memberships om ON om.organization_id = o.company_id
      WHERE o.id = opportunity_recruiters.opportunity_id
        AND om.user_id = auth.uid()
        AND om.membership_role IN ('owner', 'admin', 'recruiter')
        AND om.status = 'active'
    )
  );

-- 4. Company Audit Logs Policies
CREATE POLICY "Company members can view own audit logs"
  ON public.company_audit_logs FOR SELECT
  TO authenticated
  USING (
    public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.organization_memberships om
      WHERE om.organization_id = company_audit_logs.company_id
        AND om.user_id = auth.uid()
        AND om.membership_role IN ('owner', 'admin')
        AND om.status = 'active'
    )
  );

