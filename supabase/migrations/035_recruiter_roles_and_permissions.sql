-- ==============================================================================
-- Migration: 035_recruiter_roles_and_permissions.sql
-- Description: Define recruiter roles, granular platform permissions, and default role-permission matrix.
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE public.recruiter_role AS ENUM (
    'owner',
    'admin',
    'recruiter',
    'hiring_manager',
    'interviewer'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.recruiter_permission AS ENUM (
    'manage_company_profile',
    'manage_recruiters',
    'create_opportunity',
    'edit_opportunity',
    'publish_opportunity',
    'close_opportunity',
    'view_applications',
    'shortlist_candidates',
    'schedule_interviews',
    'submit_interview_feedback',
    'create_offer',
    'view_analytics'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.recruiter_role_permissions (
  role public.recruiter_role NOT NULL,
  permission public.recruiter_permission NOT NULL,
  PRIMARY KEY (role, permission)
);

-- Seed default recruiter permission matrix
INSERT INTO public.recruiter_role_permissions (role, permission) VALUES
  -- Owner: All permissions
  ('owner', 'manage_company_profile'),
  ('owner', 'manage_recruiters'),
  ('owner', 'create_opportunity'),
  ('owner', 'edit_opportunity'),
  ('owner', 'publish_opportunity'),
  ('owner', 'close_opportunity'),
  ('owner', 'view_applications'),
  ('owner', 'shortlist_candidates'),
  ('owner', 'schedule_interviews'),
  ('owner', 'submit_interview_feedback'),
  ('owner', 'create_offer'),
  ('owner', 'view_analytics'),

  -- Admin: All recruitment and profile management
  ('admin', 'manage_company_profile'),
  ('admin', 'manage_recruiters'),
  ('admin', 'create_opportunity'),
  ('admin', 'edit_opportunity'),
  ('admin', 'publish_opportunity'),
  ('admin', 'close_opportunity'),
  ('admin', 'view_applications'),
  ('admin', 'shortlist_candidates'),
  ('admin', 'schedule_interviews'),
  ('admin', 'submit_interview_feedback'),
  ('admin', 'create_offer'),
  ('admin', 'view_analytics'),

  -- Recruiter: Opportunity + Candidate pipeline + Offers
  ('recruiter', 'create_opportunity'),
  ('recruiter', 'edit_opportunity'),
  ('recruiter', 'publish_opportunity'),
  ('recruiter', 'close_opportunity'),
  ('recruiter', 'view_applications'),
  ('recruiter', 'shortlist_candidates'),
  ('recruiter', 'schedule_interviews'),
  ('recruiter', 'submit_interview_feedback'),
  ('recruiter', 'create_offer'),
  ('recruiter', 'view_analytics'),

  -- Hiring Manager: Candidate review, interviewing, offer decisions, analytics
  ('hiring_manager', 'view_applications'),
  ('hiring_manager', 'shortlist_candidates'),
  ('hiring_manager', 'schedule_interviews'),
  ('hiring_manager', 'submit_interview_feedback'),
  ('hiring_manager', 'create_offer'),
  ('hiring_manager', 'view_analytics'),

  -- Interviewer: Interview scheduling visibility and feedback submission only
  ('interviewer', 'schedule_interviews'),
  ('interviewer', 'submit_interview_feedback')
ON CONFLICT DO NOTHING;

