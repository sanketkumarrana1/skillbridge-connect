-- ==============================================================================
-- Migration: 040_company_seeds.sql
-- Description: Multi-company seed data, verification statuses, and hiring team assignments.
-- ==============================================================================

DO $$
DECLARE
  v_recruiter_techcorp UUID;
  v_recruiter_datapulse UUID;
  v_recruiter_cloudnative UUID;
  v_org_techcorp UUID;
  v_org_datapulse UUID;
  v_org_cloudnative UUID;
  v_org_cybershield UUID;
  v_opp_frontend UUID;
  v_opp_ml UUID;
BEGIN
  -- 1. Fetch Recruiters
  SELECT id INTO v_recruiter_techcorp FROM public.profiles WHERE email = 'recruiter.techcorp@acadin.internal';
  SELECT id INTO v_recruiter_datapulse FROM public.profiles WHERE email = 'recruiter.datapulse@acadin.internal';
  SELECT id INTO v_recruiter_cloudnative FROM public.profiles WHERE email = 'recruiter.cloudnative@acadin.internal';

  -- 2. Update / Seed Companies with Rich Attributes
  -- TechCorp Systems (Verified)
  UPDATE public.organizations
  SET
    legal_name = 'TechCorp Systems Private Limited',
    display_name = 'TechCorp Systems',
    industry = 'Enterprise Cloud & SaaS',
    company_size = '1,000 - 5,000 Employees',
    founded_year = '2014',
    description = 'Leading digital innovation partner building high-scale enterprise cloud infrastructure and modern web applications for Fortune 500 companies.',
    headquarters_location = 'Bengaluru, Karnataka',
    logo_hue = 220,
    verification_status = 'verified',
    verified_at = NOW() - INTERVAL '60 days'
  WHERE slug = 'techcorp-systems'
  RETURNING id INTO v_org_techcorp;

  -- DataPulse Analytics (Verified)
  UPDATE public.organizations
  SET
    legal_name = 'DataPulse Analytics India Private Limited',
    display_name = 'DataPulse Analytics',
    industry = 'Artificial Intelligence & Data Intelligence',
    company_size = '500 - 1,000 Employees',
    founded_year = '2018',
    description = 'Pioneering end-to-end data intelligence and real-time streaming analytics systems across fintech and e-commerce.',
    headquarters_location = 'Hyderabad, Telangana',
    logo_hue = 150,
    verification_status = 'verified',
    verified_at = NOW() - INTERVAL '30 days'
  WHERE slug = 'datapulse-analytics'
  RETURNING id INTO v_org_datapulse;

  -- CloudNative Labs (Pending Verification)
  UPDATE public.organizations
  SET
    legal_name = 'CloudNative Labs Tech LLP',
    display_name = 'CloudNative Labs',
    industry = 'DevOps & Cloud Infrastructure',
    company_size = '50 - 200 Employees',
    founded_year = '2021',
    description = 'Kubernetes and cloud resilience engineering accelerator providing site-reliability solutions.',
    headquarters_location = 'Pune, Maharashtra',
    logo_hue = 280,
    verification_status = 'pending',
    verification_submitted_at = NOW() - INTERVAL '3 days'
  WHERE slug = 'cloudnative-labs'
  RETURNING id INTO v_org_cloudnative;

  -- CyberShield Global (Suspended Company Example)
  INSERT INTO public.organizations (
    name,
    slug,
    organization_type,
    status,
    legal_name,
    display_name,
    industry,
    company_size,
    founded_year,
    description,
    headquarters_location,
    logo_hue,
    verification_status,
    website
  ) VALUES (
    'CyberShield Global',
    'cybershield-global',
    'company',
    'suspended',
    'CyberShield Global Security Corp',
    'CyberShield Global',
    'Cybersecurity & Network Defense',
    '200 - 500 Employees',
    '2016',
    'Cybersecurity auditing and managed vulnerability assessment.',
    'Gurugram, Haryana',
    0,
    'suspended',
    'https://cybershield.example.com'
  )
  ON CONFLICT (slug) DO UPDATE SET
    status = 'suspended',
    verification_status = 'suspended'
  RETURNING id INTO v_org_cybershield;

  -- 3. Assign Opportunity Recruiters (Hiring Team)
  SELECT id INTO v_opp_frontend FROM public.opportunities WHERE title ILIKE '%Frontend%' LIMIT 1;
  SELECT id INTO v_opp_ml FROM public.opportunities WHERE title ILIKE '%Machine Learning%' LIMIT 1;

  IF v_opp_frontend IS NOT NULL AND v_recruiter_techcorp IS NOT NULL THEN
    INSERT INTO public.opportunity_recruiters (
      opportunity_id,
      user_id,
      assignment_role,
      assigned_by
    ) VALUES (
      v_opp_frontend,
      v_recruiter_techcorp,
      'lead_recruiter',
      v_recruiter_techcorp
    )
    ON CONFLICT (opportunity_id, user_id) DO NOTHING;
  END IF;

  IF v_opp_ml IS NOT NULL AND v_recruiter_datapulse IS NOT NULL THEN
    INSERT INTO public.opportunity_recruiters (
      opportunity_id,
      user_id,
      assignment_role,
      assigned_by
    ) VALUES (
      v_opp_ml,
      v_recruiter_datapulse,
      'lead_recruiter',
      v_recruiter_datapulse
    )
    ON CONFLICT (opportunity_id, user_id) DO NOTHING;
  END IF;
END $$;

