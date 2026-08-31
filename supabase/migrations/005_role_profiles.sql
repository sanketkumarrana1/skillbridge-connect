-- ==============================================================================
-- Migration: 005_role_profiles.sql
-- Description: Lightweight role-specific profile extensions.
-- ==============================================================================

-- 1. Student Profiles Foundation
CREATE TABLE IF NOT EXISTS public.student_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  institution_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  roll_number TEXT,
  graduation_year INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Industry Profiles Foundation
CREATE TABLE IF NOT EXISTS public.industry_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  designation TEXT,
  department TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Academician Profiles Foundation
CREATE TABLE IF NOT EXISTS public.academician_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  institution_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  department_id UUID,
  designation TEXT,
  faculty_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Institution Profiles Foundation
CREATE TABLE IF NOT EXISTS public.institution_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  institution_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  designation TEXT,
  office_role TEXT DEFAULT 'Administrator',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Attach updated_at triggers
CREATE TRIGGER set_student_profiles_updated_at
  BEFORE UPDATE ON public.student_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_industry_profiles_updated_at
  BEFORE UPDATE ON public.industry_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_academician_profiles_updated_at
  BEFORE UPDATE ON public.academician_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_institution_profiles_updated_at
  BEFORE UPDATE ON public.institution_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 6. Enable Row Level Security
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academician_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_profiles ENABLE ROW LEVEL SECURITY;

