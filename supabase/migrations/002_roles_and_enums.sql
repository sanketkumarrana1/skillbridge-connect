-- ==============================================================================
-- Migration: 002_roles_and_enums.sql
-- Description: Establishes strong role types and user role mappings.
-- ==============================================================================

-- 1. App Role Enum
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM (
    'student',
    'industry',
    'academician',
    'institution',
    'admin'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. User Roles Table (Supports primary role & future multi-role expansion)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_user_role UNIQUE (user_id, role)
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- 4. Enable Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 5. Helper function: Check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = check_user_id
      AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

