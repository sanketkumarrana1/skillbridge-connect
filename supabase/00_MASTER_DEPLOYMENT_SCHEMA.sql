-- ==============================================================================
-- Migration: 001_initial_profiles.sql
-- Description: Creates the base profiles table linked to Supabase Auth users.
-- ==============================================================================

-- 1. Helper function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Base Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Trigger for updated_at
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 4. Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);

-- 5. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

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

-- ==============================================================================
-- Migration: 006_auth_triggers_and_rls.sql
-- Description: Sets up the auth.users signup trigger and comprehensive RLS policies.
-- ==============================================================================

-- 1. Signup Initializer Trigger
-- Runs in SECURITY DEFINER context when an auth.user record is inserted.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  requested_role_text TEXT;
  assigned_role public.app_role;
  parsed_full_name TEXT;
BEGIN
  -- Extract metadata safely
  requested_role_text := LOWER(COALESCE(NEW.raw_user_meta_data->>'role', 'student'));
  parsed_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1));

  -- Validate role assignment (Admin CANNOT be requested via public signup)
  IF requested_role_text IN ('industry', 'academician', 'institution') THEN
    assigned_role := requested_role_text::public.app_role;
  ELSE
    assigned_role := 'student'::public.app_role;
  END IF;

  -- 1. Create Base Profile
  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    phone,
    avatar_url,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    parsed_full_name,
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'avatar_url',
    NOW(),
    NOW()
  );

  -- 2. Assign Primary User Role
  INSERT INTO public.user_roles (
    user_id,
    role,
    is_primary,
    created_at
  ) VALUES (
    NEW.id,
    assigned_role,
    TRUE,
    NOW()
  );

  -- 3. Initialize Role-Specific Profile Row
  CASE assigned_role
    WHEN 'student' THEN
      INSERT INTO public.student_profiles (user_id) VALUES (NEW.id);
    WHEN 'industry' THEN
      INSERT INTO public.industry_profiles (user_id, designation)
      VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'designation', 'Talent Acquisition Partner'));
    WHEN 'academician' THEN
      INSERT INTO public.academician_profiles (user_id, designation)
      VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'designation', 'Faculty Member'));
    WHEN 'institution' THEN
      INSERT INTO public.institution_profiles (user_id, designation)
      VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'designation', 'Institutional Representative'));
    ELSE
      -- No extra table initialization
  END CASE;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- ==============================================================================
-- 2. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- A. Profiles Table
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- B. User Roles Table
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
CREATE POLICY "Users can read own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Only admins can modify roles" ON public.user_roles;
CREATE POLICY "Only admins can modify roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- C. Organizations Table
DROP POLICY IF EXISTS "Authenticated users can view active organizations" ON public.organizations;
CREATE POLICY "Authenticated users can view active organizations"
  ON public.organizations FOR SELECT
  TO authenticated
  USING (status = 'active' OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage organizations" ON public.organizations;
CREATE POLICY "Admins can manage organizations"
  ON public.organizations FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- D. Organization Memberships Table
DROP POLICY IF EXISTS "Members can view own organization memberships" ON public.organization_memberships;
CREATE POLICY "Members can view own organization memberships"
  ON public.organization_memberships FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage memberships" ON public.organization_memberships;
CREATE POLICY "Admins can manage memberships"
  ON public.organization_memberships FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- E. Student Profiles Table
DROP POLICY IF EXISTS "Students can view own student profile" ON public.student_profiles;
CREATE POLICY "Students can view own student profile"
  ON public.student_profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Students can update own student profile" ON public.student_profiles;
CREATE POLICY "Students can update own student profile"
  ON public.student_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- F. Industry Profiles Table
DROP POLICY IF EXISTS "Industry users can view own industry profile" ON public.industry_profiles;
CREATE POLICY "Industry users can view own industry profile"
  ON public.industry_profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Industry users can update own industry profile" ON public.industry_profiles;
CREATE POLICY "Industry users can update own industry profile"
  ON public.industry_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- G. Academician Profiles Table
DROP POLICY IF EXISTS "Academicians can view own academician profile" ON public.academician_profiles;
CREATE POLICY "Academicians can view own academician profile"
  ON public.academician_profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Academicians can update own academician profile" ON public.academician_profiles;
CREATE POLICY "Academicians can update own academician profile"
  ON public.academician_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- H. Institution Profiles Table
DROP POLICY IF EXISTS "Institution reps can view own institution profile" ON public.institution_profiles;
CREATE POLICY "Institution reps can view own institution profile"
  ON public.institution_profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Institution reps can update own institution profile" ON public.institution_profiles;
CREATE POLICY "Institution reps can update own institution profile"
  ON public.institution_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ==============================================================================
-- Migration: 007_departments.sql
-- Description: Institutional departments table with uniqueness constraints and scoped RLS.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_institution_dept_name UNIQUE (institution_id, name)
);

-- Optional unique constraint on non-null department codes per institution
CREATE UNIQUE INDEX IF NOT EXISTS uq_institution_dept_code
  ON public.departments (institution_id, code)
  WHERE code IS NOT NULL;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS set_departments_updated_at ON public.departments;
CREATE TRIGGER set_departments_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Index for lookup by institution
CREATE INDEX IF NOT EXISTS idx_departments_institution_id ON public.departments(institution_id);

-- Enable Row Level Security
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Authenticated users can view active departments" ON public.departments;
CREATE POLICY "Authenticated users can view active departments"
  ON public.departments FOR SELECT
  TO authenticated
  USING (status = 'active' OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Institution members can manage departments" ON public.departments;
CREATE POLICY "Institution members can manage departments"
  ON public.departments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_memberships
      WHERE organization_id = departments.institution_id
        AND user_id = auth.uid()
        AND status = 'active'
    )
    OR public.is_admin(auth.uid())
  );

-- ==============================================================================
-- Migration: 008_student_profile_expansion.sql
-- Description: Extends student_profiles with academic credentials, program details, and onboarding completion status.
-- ==============================================================================

-- Add new academic profile columns to student_profiles
ALTER TABLE public.student_profiles
  ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS degree TEXT,
  ADD COLUMN IF NOT EXISTS program TEXT,
  ADD COLUMN IF NOT EXISTS academic_year TEXT,
  ADD COLUMN IF NOT EXISTS academic_status TEXT NOT NULL DEFAULT 'Enrolled',
  ADD COLUMN IF NOT EXISTS grade TEXT,
  ADD COLUMN IF NOT EXISTS headline TEXT,
  ADD COLUMN IF NOT EXISTS about TEXT,
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE;

-- Index for institution-level student lookups
CREATE INDEX IF NOT EXISTS idx_student_profiles_inst ON public.student_profiles(institution_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_dept ON public.student_profiles(department_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_onboarding ON public.student_profiles(onboarding_completed);

-- Institution staff read access policy for enrolled students
DROP POLICY IF EXISTS "Institution staff can view enrolled student profiles" ON public.student_profiles;
CREATE POLICY "Institution staff can view enrolled student profiles"
  ON public.student_profiles FOR SELECT
  TO authenticated
  USING (
    institution_id IS NOT NULL AND
    (
      EXISTS (
        SELECT 1 FROM public.organization_memberships
        WHERE organization_id = student_profiles.institution_id
          AND user_id = auth.uid()
          AND status = 'active'
      )
      OR user_id = auth.uid()
      OR public.is_admin(auth.uid())
    )
  );

-- ==============================================================================
-- Migration: 009_career_taxonomy.sql
-- Description: Career interests, target roles, student career choices, and opportunity preferences.
-- ==============================================================================

-- 1. Career Interests Taxonomy Table
CREATE TABLE IF NOT EXISTS public.career_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT DEFAULT 'Compass',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_career_interests_updated_at
  BEFORE UPDATE ON public.career_interests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2. Target Roles Taxonomy Table
CREATE TABLE IF NOT EXISTS public.target_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT,
  demand_level TEXT NOT NULL DEFAULT 'high' CHECK (demand_level IN ('high', 'very_high', 'emerging')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_target_roles_updated_at
  BEFORE UPDATE ON public.target_roles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 3. Student Career Interests Junction Table
CREATE TABLE IF NOT EXISTS public.student_career_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  career_interest_id UUID NOT NULL REFERENCES public.career_interests(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_student_interest UNIQUE (student_id, career_interest_id)
);

CREATE INDEX IF NOT EXISTS idx_student_career_interests_student ON public.student_career_interests(student_id);

-- 4. Student Target Roles Junction Table
CREATE TABLE IF NOT EXISTS public.student_target_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_role_id UUID NOT NULL REFERENCES public.target_roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_student_role UNIQUE (student_id, target_role_id)
);

CREATE INDEX IF NOT EXISTS idx_student_target_roles_student ON public.student_target_roles(student_id);

-- 5. Student Opportunity Preferences Table
CREATE TABLE IF NOT EXISTS public.student_opportunity_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  preferred_work_types TEXT[] NOT NULL DEFAULT '{}',
  preferred_work_modes TEXT[] NOT NULL DEFAULT '{}',
  preferred_cities TEXT[] NOT NULL DEFAULT '{}',
  availability TEXT DEFAULT 'Immediate (Summer 2026)',
  preferred_opportunity_types TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_student_opp_prefs_updated_at
  BEFORE UPDATE ON public.student_opportunity_preferences
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 6. Enable Row Level Security
ALTER TABLE public.career_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.target_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_career_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_target_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_opportunity_preferences ENABLE ROW LEVEL SECURITY;

-- 7. Policies
-- Public read for active taxonomy
CREATE POLICY "Anyone authenticated can view active career interests"
  ON public.career_interests FOR SELECT
  TO authenticated
  USING (status = 'active' OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage career interests"
  ON public.career_interests FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone authenticated can view active target roles"
  ON public.target_roles FOR SELECT
  TO authenticated
  USING (status = 'active' OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage target roles"
  ON public.target_roles FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Student Career Interests Policies
CREATE POLICY "Students can view own career interests"
  ON public.student_career_interests FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Students can manage own career interests"
  ON public.student_career_interests FOR ALL
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- Student Target Roles Policies
CREATE POLICY "Students can view own target roles"
  ON public.student_target_roles FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Students can manage own target roles"
  ON public.student_target_roles FOR ALL
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- Student Opportunity Preferences Policies
CREATE POLICY "Students can view own opportunity preferences"
  ON public.student_opportunity_preferences FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Students can manage own opportunity preferences"
  ON public.student_opportunity_preferences FOR ALL
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- ==============================================================================
-- Migration: 010_skill_taxonomy.sql
-- Description: Core Skill Taxonomy: Categories, Skills, Aliases, and Directional Relations.
-- ==============================================================================

-- 1. Skill Categories Table
CREATE TABLE IF NOT EXISTS public.skill_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES public.skill_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_skill_categories_updated_at
  BEFORE UPDATE ON public.skill_categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2. Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.skill_categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_skills_updated_at
  BEFORE UPDATE ON public.skills
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills(category_id);
CREATE INDEX IF NOT EXISTS idx_skills_status ON public.skills(status);
CREATE INDEX IF NOT EXISTS idx_skills_slug ON public.skills(slug);

-- 3. Skill Aliases Table (Normalized aliases for search and AI resolution)
CREATE TABLE IF NOT EXISTS public.skill_aliases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  alias TEXT NOT NULL,
  normalized_alias TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_skill_alias UNIQUE (skill_id, normalized_alias)
);

CREATE INDEX IF NOT EXISTS idx_skill_aliases_normalized ON public.skill_aliases(normalized_alias);

-- 4. Skill Relations Table (Prerequisites, Specializations, Related Technologies)
DO $$ BEGIN
  CREATE TYPE public.skill_relation_type AS ENUM (
    'related',
    'prerequisite',
    'commonly_used_with',
    'specialization_of'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.skill_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  related_skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  relation_type public.skill_relation_type NOT NULL DEFAULT 'related',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_no_self_relation CHECK (skill_id != related_skill_id),
  CONSTRAINT uq_skill_relation UNIQUE (skill_id, related_skill_id, relation_type)
);

CREATE INDEX IF NOT EXISTS idx_skill_relations_skill ON public.skill_relations(skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_relations_related ON public.skill_relations(related_skill_id);

-- 5. Enable Row Level Security
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_relations ENABLE ROW LEVEL SECURITY;

-- 6. Read and Admin Management Policies
CREATE POLICY "Anyone authenticated can view active skill categories"
  ON public.skill_categories FOR SELECT
  TO authenticated
  USING (status = 'active' OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage skill categories"
  ON public.skill_categories FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone authenticated can view active skills"
  ON public.skills FOR SELECT
  TO authenticated
  USING (status = 'active' OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage skills"
  ON public.skills FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone authenticated can view skill aliases"
  ON public.skill_aliases FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Admins can manage skill aliases"
  ON public.skill_aliases FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone authenticated can view skill relations"
  ON public.skill_relations FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Admins can manage skill relations"
  ON public.skill_relations FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ==============================================================================
-- Migration: 011_student_skills.sql
-- Description: Student declared skills with proficiency level, score, and unique constraints.
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE public.skill_self_level AS ENUM (
    'beginner',
    'intermediate',
    'advanced'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.student_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE RESTRICT,
  self_level public.skill_self_level NOT NULL DEFAULT 'intermediate',
  self_score INT NOT NULL DEFAULT 50 CHECK (self_score >= 0 AND self_score <= 100),
  source TEXT NOT NULL DEFAULT 'self_declaration',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  first_declared_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_student_skill UNIQUE (student_id, skill_id)
);

CREATE TRIGGER set_student_skills_updated_at
  BEFORE UPDATE ON public.student_skills
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_student_skills_student ON public.student_skills(student_id);
CREATE INDEX IF NOT EXISTS idx_student_skills_skill ON public.student_skills(skill_id);

-- Enable Row Level Security
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Student can view own declared skills
CREATE POLICY "Students can view own declared skills"
  ON public.student_skills FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid()
    OR public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.student_profiles sp
      JOIN public.organization_memberships om ON om.organization_id = sp.institution_id
      WHERE sp.user_id = student_skills.student_id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
    )
  );

-- 2. Student can insert own declared skills (for active skills only)
CREATE POLICY "Students can insert own declared skills"
  ON public.student_skills FOR INSERT
  TO authenticated
  WITH CHECK (
    student_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.skills
      WHERE id = student_skills.skill_id
        AND status = 'active'
    )
  );

-- 3. Student can update own declared skills
CREATE POLICY "Students can update own declared skills"
  ON public.student_skills FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- 4. Student can delete own declared skills
CREATE POLICY "Students can delete own declared skills"
  ON public.student_skills FOR DELETE
  TO authenticated
  USING (student_id = auth.uid());

-- 5. Admins have full access
CREATE POLICY "Admins can manage student skills"
  ON public.student_skills FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ==============================================================================
-- Migration: 012_skill_evidence.sql
-- Description: Verifiable skill evidence items linked to declared skills with lifecycle verification states.
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE public.evidence_verification_status AS ENUM (
    'self_declared',
    'evidence_added',
    'pending_verification',
    'verified'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.skill_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_skill_id UUID NOT NULL REFERENCES public.student_skills(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  evidence_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  linked_entity_id TEXT,
  linked_entity_type TEXT,
  document_id TEXT,
  evidence_date TEXT,
  verification_status public.evidence_verification_status NOT NULL DEFAULT 'evidence_added',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_skill_evidence_updated_at
  BEFORE UPDATE ON public.skill_evidence
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_skill_evidence_student_skill ON public.skill_evidence(student_skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_evidence_student ON public.skill_evidence(student_id);
CREATE INDEX IF NOT EXISTS idx_skill_evidence_status ON public.skill_evidence(verification_status);

-- Enable Row Level Security
ALTER TABLE public.skill_evidence ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Students can view own skill evidence (and institution staff for enrolled students)
CREATE POLICY "Students can view own skill evidence"
  ON public.skill_evidence FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid()
    OR public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.student_profiles sp
      JOIN public.organization_memberships om ON om.organization_id = sp.institution_id
      WHERE sp.user_id = skill_evidence.student_id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
    )
  );

-- 2. Students can insert own skill evidence
CREATE POLICY "Students can insert own skill evidence"
  ON public.skill_evidence FOR INSERT
  TO authenticated
  WITH CHECK (
    student_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.student_skills
      WHERE id = skill_evidence.student_skill_id
        AND student_id = auth.uid()
    )
  );

-- 3. Students can update own skill evidence
CREATE POLICY "Students can update own skill evidence"
  ON public.skill_evidence FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- 4. Students can delete own skill evidence
CREATE POLICY "Students can delete own skill evidence"
  ON public.skill_evidence FOR DELETE
  TO authenticated
  USING (student_id = auth.uid());

-- 5. Admins have full access
CREATE POLICY "Admins can manage skill evidence"
  ON public.skill_evidence FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ==============================================================================
-- Migration: 013_student_onboarding_rpc.sql
-- Description: Transactional PostgreSQL RPC to atomically save multi-step student onboarding.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.save_student_onboarding(payload JSONB)
RETURNS JSONB AS $$
DECLARE
  target_user_id UUID;
  auth_caller_id UUID;
  item_record JSONB;
  evidence_record JSONB;
  matched_skill_id UUID;
  created_skill_row_id UUID;
  matched_interest_id UUID;
  matched_role_id UUID;
  inst_id UUID;
  dept_id UUID;
BEGIN
  -- 1. Security Check: Authenticated caller validation
  auth_caller_id := auth.uid();
  target_user_id := (payload->>'student_id')::UUID;

  IF auth_caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthenticated request.';
  END IF;

  IF target_user_id != auth_caller_id AND NOT public.is_admin(auth_caller_id) THEN
    RAISE EXCEPTION 'Unauthorized: You can only save your own onboarding profile.';
  END IF;

  -- 2. Update Base Profile
  UPDATE public.profiles
  SET
    full_name = COALESCE(payload->'personal'->>'full_name', full_name),
    phone = payload->'personal'->>'phone',
    city = payload->'personal'->>'city',
    state = payload->'personal'->>'state',
    country = COALESCE(payload->'personal'->>'country', 'India'),
    avatar_url = payload->'personal'->>'avatar_url',
    updated_at = NOW()
  WHERE id = target_user_id;

  -- 3. Resolve Optional Institution / Department
  inst_id := NULL;
  IF (payload->'academic'->>'institution_id') IS NOT NULL AND (payload->'academic'->>'institution_id') != '' THEN
    inst_id := (payload->'academic'->>'institution_id')::UUID;
  END IF;

  dept_id := NULL;
  IF (payload->'academic'->>'department_id') IS NOT NULL AND (payload->'academic'->>'department_id') != '' THEN
    dept_id := (payload->'academic'->>'department_id')::UUID;
  END IF;

  -- 4. Upsert Student Profile
  INSERT INTO public.student_profiles (
    user_id,
    institution_id,
    department_id,
    degree,
    program,
    academic_year,
    graduation_year,
    academic_status,
    grade,
    headline,
    about,
    onboarding_completed,
    updated_at
  ) VALUES (
    target_user_id,
    inst_id,
    dept_id,
    payload->'academic'->>'degree',
    payload->'academic'->>'program',
    payload->'academic'->>'academic_year',
    NULLIF(payload->'academic'->>'graduation_year', '')::INT,
    COALESCE(payload->'academic'->>'academic_status', 'Enrolled'),
    payload->'academic'->>'grade',
    payload->'personal'->>'headline',
    payload->'personal'->>'about',
    TRUE,
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    institution_id = EXCLUDED.institution_id,
    department_id = EXCLUDED.department_id,
    degree = EXCLUDED.degree,
    program = EXCLUDED.program,
    academic_year = EXCLUDED.academic_year,
    graduation_year = EXCLUDED.graduation_year,
    academic_status = EXCLUDED.academic_status,
    grade = EXCLUDED.grade,
    headline = EXCLUDED.headline,
    about = EXCLUDED.about,
    onboarding_completed = TRUE,
    updated_at = NOW();

  -- 5. Sync Career Interests
  DELETE FROM public.student_career_interests WHERE student_id = target_user_id;
  IF payload->'career_preferences'->'career_interests' IS NOT NULL THEN
    FOR item_record IN SELECT * FROM jsonb_array_elements_text(payload->'career_preferences'->'career_interests')
    LOOP
      SELECT id INTO matched_interest_id FROM public.career_interests WHERE name ILIKE item_record #>> '{}' OR slug ILIKE item_record #>> '{}' LIMIT 1;
      IF matched_interest_id IS NOT NULL THEN
        INSERT INTO public.student_career_interests (student_id, career_interest_id)
        VALUES (target_user_id, matched_interest_id)
        ON CONFLICT DO NOTHING;
      END IF;
    END LOOP;
  END IF;

  -- 6. Sync Target Roles
  DELETE FROM public.student_target_roles WHERE student_id = target_user_id;
  IF payload->'career_preferences'->'target_roles' IS NOT NULL THEN
    FOR item_record IN SELECT * FROM jsonb_array_elements_text(payload->'career_preferences'->'target_roles')
    LOOP
      SELECT id INTO matched_role_id FROM public.target_roles WHERE title ILIKE item_record #>> '{}' OR slug ILIKE item_record #>> '{}' LIMIT 1;
      IF matched_role_id IS NOT NULL THEN
        INSERT INTO public.student_target_roles (student_id, target_role_id)
        VALUES (target_user_id, matched_role_id)
        ON CONFLICT DO NOTHING;
      END IF;
    END LOOP;
  END IF;

  -- 7. Upsert Opportunity Preferences
  INSERT INTO public.student_opportunity_preferences (
    student_id,
    preferred_work_types,
    preferred_work_modes,
    preferred_cities,
    availability,
    preferred_opportunity_types,
    updated_at
  ) VALUES (
    target_user_id,
    ARRAY(SELECT jsonb_array_elements_text(COALESCE(payload->'career_preferences'->'preferred_work_types', '[]'::jsonb))),
    ARRAY(SELECT jsonb_array_elements_text(COALESCE(payload->'career_preferences'->'preferred_work_modes', '[]'::jsonb))),
    ARRAY(SELECT jsonb_array_elements_text(COALESCE(payload->'career_preferences'->'preferred_cities', '[]'::jsonb))),
    COALESCE(payload->'career_preferences'->>'availability', 'Immediate (Summer 2026)'),
    ARRAY(SELECT jsonb_array_elements_text(COALESCE(payload->'career_preferences'->'preferred_opportunity_types', '[]'::jsonb))),
    NOW()
  )
  ON CONFLICT (student_id) DO UPDATE SET
    preferred_work_types = EXCLUDED.preferred_work_types,
    preferred_work_modes = EXCLUDED.preferred_work_modes,
    preferred_cities = EXCLUDED.preferred_cities,
    availability = EXCLUDED.availability,
    preferred_opportunity_types = EXCLUDED.preferred_opportunity_types,
    updated_at = NOW();

  -- 8. Sync Declared Skills & Evidence
  IF payload->'declared_skills' IS NOT NULL THEN
    FOR item_record IN SELECT * FROM jsonb_array_elements(payload->'declared_skills')
    LOOP
      -- Resolve skill ID by UUID or Name
      matched_skill_id := NULL;
      IF (item_record->>'skill_id') ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
        matched_skill_id := (item_record->>'skill_id')::UUID;
      ELSE
        SELECT id INTO matched_skill_id FROM public.skills
        WHERE name ILIKE item_record->>'name' OR slug ILIKE item_record->>'name'
        LIMIT 1;
      END IF;

      IF matched_skill_id IS NOT NULL THEN
        -- Upsert student_skills
        INSERT INTO public.student_skills (
          student_id,
          skill_id,
          self_level,
          self_score,
          last_updated_at
        ) VALUES (
          target_user_id,
          matched_skill_id,
          COALESCE((item_record->>'proficiency')::public.skill_self_level, 'intermediate'::public.skill_self_level),
          COALESCE((item_record->>'proficiency_level')::INT, 50),
          NOW()
        )
        ON CONFLICT (student_id, skill_id) DO UPDATE SET
          self_level = EXCLUDED.self_level,
          self_score = EXCLUDED.self_score,
          last_updated_at = NOW()
        RETURNING id INTO created_skill_row_id;

        -- Insert Evidence records
        IF item_record->'evidence' IS NOT NULL THEN
          FOR evidence_record IN SELECT * FROM jsonb_array_elements(item_record->'evidence')
          LOOP
            INSERT INTO public.skill_evidence (
              student_skill_id,
              student_id,
              evidence_type,
              title,
              description,
              url,
              verification_status
            ) VALUES (
              created_skill_row_id,
              target_user_id,
              COALESCE(evidence_record->>'type', 'project'),
              COALESCE(evidence_record->>'title', 'Skill Evidence Item'),
              evidence_record->>'description',
              evidence_record->>'url',
              'evidence_added'
            );
          END LOOP;
        END IF;
      END IF;
    END LOOP;
  END IF;

  RETURN jsonb_build_object(
    'success', TRUE,
    'student_id', target_user_id,
    'message', 'Onboarding completed and profile persisted successfully.'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- Migration: 014_taxonomy_seeds.sql
-- Description: Standard seed data for skill categories, core skills, aliases, career interests, and target roles.
-- ==============================================================================

-- 1. Seed Skill Categories
INSERT INTO public.skill_categories (name, slug, description, display_order) VALUES
  ('Programming Languages', 'programming-languages', 'Core compiled, interpreted, and procedural/OOP languages', 1),
  ('Web & Frontend', 'web-frontend', 'Client-side web frameworks, UI libraries, and browser engineering', 2),
  ('Backend & APIs', 'backend-apis', 'Server-side runtimes, frameworks, API architectures, and microservices', 3),
  ('Databases & Storage', 'databases-storage', 'Relational, document, key-value, and distributed data systems', 4),
  ('Data & Analytics', 'data-analytics', 'Data engineering, transformation pipelines, and business intelligence', 5),
  ('AI & Machine Learning', 'ai-ml', 'Machine learning algorithms, deep learning, NLP, and GenAI', 6),
  ('Cloud Computing', 'cloud-computing', 'Public cloud infrastructure, serverless, and cloud-native services', 7),
  ('DevOps & Platform', 'devops-platform', 'Containerization, CI/CD automation, orchestration, and infrastructure as code', 8),
  ('Cybersecurity', 'cybersecurity', 'Application security, cryptography, network defense, and SOC analysis', 9),
  ('Computer Science Fundamentals', 'cs-fundamentals', 'Algorithms, data structures, operating systems, and computer networks', 10),
  ('Software Engineering Practices', 'software-engineering', 'Agile methodologies, testing, code review, design patterns, and system design', 11),
  ('UI / UX & Product Design', 'ui-ux-design', 'Design systems, wireframing, user research, and accessibility', 12),
  ('Emerging & Specialized Technologies', 'emerging-technologies', 'Web3, blockchain, IoT, embedded systems, and quantum computing', 13)
ON CONFLICT (name) DO UPDATE SET
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order;

-- 2. Seed Career Interests
INSERT INTO public.career_interests (name, slug, description, icon) VALUES
  ('Software Development', 'software-dev', 'Building scalable web, mobile, and desktop applications.', 'Code2'),
  ('Data & Analytics', 'data-analytics', 'Data modeling, business intelligence, and analytical data engineering.', 'BarChart3'),
  ('Artificial Intelligence & ML', 'ai-ml', 'Machine learning algorithms, deep learning, NLP, and Generative AI systems.', 'Sparkles'),
  ('Cloud Computing', 'cloud-computing', 'Designing, provisioning, and maintaining resilient cloud infrastructures.', 'Cloud'),
  ('Cybersecurity & InfoSec', 'cybersecurity', 'Securing applications, network perimeters, penetration testing, and SOC analysis.', 'ShieldAlert'),
  ('DevOps & Platform Engineering', 'devops-platform', 'CI/CD pipelines, container orchestration, site reliability, and automation.', 'Cpu'),
  ('Networking & Systems Infrastructure', 'networking-infra', 'Enterprise network design, routing, protocol analysis, and systems administration.', 'Network'),
  ('Database Engineering', 'database-engineering', 'RDBMS/NoSQL architecture, query optimization, high-throughput caching, and storage.', 'Database'),
  ('UI / UX & Product Design', 'ui-ux-design', 'User research, interaction design, prototyping, and design system governance.', 'Palette'),
  ('Product & Technical Management', 'product-management', 'Product strategy, requirement prioritization, agile delivery, and technical roadmaps.', 'Compass')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon;

-- 3. Seed Target Roles
INSERT INTO public.target_roles (title, slug, category, description, demand_level) VALUES
  ('Full Stack Engineer', 'full-stack-engineer', 'Software Development', 'End-to-end software engineering across modern frontend and backend architectures.', 'very_high'),
  ('Frontend Developer', 'frontend-developer', 'Software Development', 'Building performant, accessible, and responsive user interfaces with modern web standards.', 'high'),
  ('Backend Developer', 'backend-developer', 'Software Development', 'Architecting resilient APIs, microservices, and database layers for web applications.', 'very_high'),
  ('Data Engineer', 'data-engineer', 'Data & Analytics', 'Building reliable ETL/ELT pipelines, distributed processing systems, and data warehouses.', 'very_high'),
  ('Machine Learning Engineer', 'ml-engineer', 'AI & Machine Learning', 'Developing, fine-tuning, and deploying production machine learning models and inference pipelines.', 'very_high'),
  ('AI Solutions Engineer', 'ai-solutions-engineer', 'AI & Machine Learning', 'Integrating large language models, retrieval augmented generation (RAG), and generative AI.', 'emerging'),
  ('Cloud Platform Engineer', 'cloud-platform-engineer', 'Cloud & DevOps', 'Provisioning multi-cloud architectures, Kubernetes clusters, and scalable infrastructure.', 'very_high'),
  ('DevOps / SRE Engineer', 'devops-sre-engineer', 'Cloud & DevOps', 'Automating deployments, observability telemetry, uptime reliability, and infrastructure as code.', 'very_high'),
  ('Cybersecurity Analyst', 'cybersecurity-analyst', 'Cybersecurity', 'Monitoring threat vectors, vulnerability assessments, penetration testing, and security posture.', 'high'),
  ('UI / UX Product Designer', 'ui-ux-product-designer', 'Design & Product', 'Designing high-fidelity user journeys, wireframes, prototypes, and design systems.', 'high')
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  demand_level = EXCLUDED.demand_level;

-- 4. Helper function to seed skills and aliases
CREATE OR REPLACE FUNCTION public.seed_skill_with_aliases(
  cat_slug TEXT,
  s_name TEXT,
  s_slug TEXT,
  s_desc TEXT,
  s_tags TEXT[],
  s_aliases TEXT[]
) RETURNS VOID AS $$
DECLARE
  target_cat_id UUID;
  new_skill_id UUID;
  alias_item TEXT;
BEGIN
  SELECT id INTO target_cat_id FROM public.skill_categories WHERE slug = cat_slug;
  IF target_cat_id IS NULL THEN RETURN; END IF;

  INSERT INTO public.skills (category_id, name, slug, description, tags)
  VALUES (target_cat_id, s_name, s_slug, s_desc, s_tags)
  ON CONFLICT (name) DO UPDATE SET
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    tags = EXCLUDED.tags
  RETURNING id INTO new_skill_id;

  FOREACH alias_item IN ARRAY s_aliases
  LOOP
    INSERT INTO public.skill_aliases (skill_id, alias, normalized_alias)
    VALUES (new_skill_id, alias_item, LOWER(REGEXP_REPLACE(alias_item, '[^a-zA-Z0-9]', '', 'g')))
    ON CONFLICT (skill_id, normalized_alias) DO NOTHING;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 5. Seed Core Skills Library
SELECT public.seed_skill_with_aliases('programming-languages', 'C', 'lang-c', 'Foundational procedural language for low-level systems and embedded computing.', ARRAY['systems', 'embedded'], ARRAY['ANSI C', 'C Programming']);
SELECT public.seed_skill_with_aliases('programming-languages', 'C++', 'lang-cpp', 'High-performance object-oriented language for systems, game engines, and competitive programming.', ARRAY['systems', 'performance'], ARRAY['CPP', 'Modern C++']);
SELECT public.seed_skill_with_aliases('programming-languages', 'Java', 'lang-java', 'Robust enterprise object-oriented programming language powering scalable backend systems.', ARRAY['enterprise', 'backend'], ARRAY['Core Java', 'Java 17', 'Java 21']);
SELECT public.seed_skill_with_aliases('programming-languages', 'Python', 'lang-python', 'Versatile multi-paradigm language dominant in backend, automation, data science, and AI.', ARRAY['ai', 'data', 'backend'], ARRAY['Python 3', 'Py']);
SELECT public.seed_skill_with_aliases('programming-languages', 'JavaScript', 'lang-javascript', 'Universal language of the web powering client interfaces and server runtimes.', ARRAY['web', 'frontend', 'fullstack'], ARRAY['JS', 'Vanilla JS', 'ES6+']);
SELECT public.seed_skill_with_aliases('programming-languages', 'TypeScript', 'lang-typescript', 'Statically typed superset of JavaScript enhancing enterprise codebases.', ARRAY['frontend', 'backend', 'type-safe'], ARRAY['TS']);
SELECT public.seed_skill_with_aliases('programming-languages', 'Go', 'lang-go', 'Statically typed compiled language designed for concurrency and cloud services.', ARRAY['cloud', 'systems', 'microservices'], ARRAY['Golang']);
SELECT public.seed_skill_with_aliases('programming-languages', 'Rust', 'lang-rust', 'Memory-safe systems programming language without garbage collection.', ARRAY['systems', 'webassembly', 'safe'], ARRAY['RustLang']);
SELECT public.seed_skill_with_aliases('programming-languages', 'SQL', 'lang-sql', 'Declarative language for relational data querying, transactions, and schema management.', ARRAY['data', 'database', 'core'], ARRAY['Structured Query Language']);

SELECT public.seed_skill_with_aliases('web-frontend', 'React', 'web-react', 'Component-based declarative UI library for building interactive Single Page Applications.', ARRAY['frontend', 'ui', 'components'], ARRAY['ReactJS', 'React.js']);
SELECT public.seed_skill_with_aliases('web-frontend', 'Next.js', 'web-nextjs', 'Production React framework enabling hybrid static site generation and server rendering.', ARRAY['fullstack', 'ssr', 'react'], ARRAY['NextJS', 'Next']);
SELECT public.seed_skill_with_aliases('web-frontend', 'Vue.js', 'web-vue', 'Progressive JavaScript framework for building adaptable user interfaces.', ARRAY['frontend', 'ui'], ARRAY['Vue', 'VueJS', 'Vue 3']);
SELECT public.seed_skill_with_aliases('web-frontend', 'Tailwind CSS', 'web-tailwind', 'Utility-first CSS framework for rapid responsive component styling.', ARRAY['css', 'styling', 'responsive'], ARRAY['Tailwind', 'TailwindCSS']);
SELECT public.seed_skill_with_aliases('web-frontend', 'HTML5 & CSS3', 'web-html-css', 'Semantic structure, layout standards, flexbox, and CSS grid styling.', ARRAY['core', 'layout', 'markup'], ARRAY['HTML', 'CSS', 'HTML5', 'CSS3']);

SELECT public.seed_skill_with_aliases('backend-apis', 'Node.js', 'backend-nodejs', 'Asynchronous event-driven JavaScript server runtime.', ARRAY['backend', 'javascript', 'runtime'], ARRAY['Node', 'NodeJS']);
SELECT public.seed_skill_with_aliases('backend-apis', 'Express.js', 'backend-express', 'Minimalist, unopinionated web framework for Node.js REST APIs.', ARRAY['backend', 'rest', 'api'], ARRAY['Express', 'ExpressJS']);
SELECT public.seed_skill_with_aliases('backend-apis', 'FastAPI', 'backend-fastapi', 'Modern, fast web framework for building Python APIs with automatic OpenAPI docs.', ARRAY['python', 'async', 'api'], ARRAY['FastAPI Python']);
SELECT public.seed_skill_with_aliases('backend-apis', 'Spring Boot', 'backend-spring-boot', 'Enterprise framework for stand-alone, production-grade Spring applications.', ARRAY['enterprise', 'java', 'microservices'], ARRAY['SpringBoot', 'Spring Framework']);
SELECT public.seed_skill_with_aliases('backend-apis', 'RESTful API Design', 'backend-rest-design', 'Architectural principles for stateless, resource-oriented HTTP APIs.', ARRAY['architecture', 'api', 'http'], ARRAY['REST', 'REST APIs', 'RESTful Services']);
SELECT public.seed_skill_with_aliases('backend-apis', 'GraphQL', 'backend-graphql', 'Query language and server runtime for declarative data fetching.', ARRAY['api', 'query-language'], ARRAY['GraphQL API']);

SELECT public.seed_skill_with_aliases('databases-storage', 'PostgreSQL', 'db-postgresql', 'Advanced open-source object-relational database with ACID compliance.', ARRAY['rdbms', 'sql', 'acid'], ARRAY['Postgres', 'PostgreSQL 16']);
SELECT public.seed_skill_with_aliases('databases-storage', 'MySQL', 'db-mysql', 'Relational database management system powering web applications worldwide.', ARRAY['rdbms', 'sql'], ARRAY['MySQL 8']);
SELECT public.seed_skill_with_aliases('databases-storage', 'MongoDB', 'db-mongodb', 'Document-oriented NoSQL database for flexible JSON-like document storage.', ARRAY['nosql', 'document', 'database'], ARRAY['Mongo']);
SELECT public.seed_skill_with_aliases('databases-storage', 'Redis', 'db-redis', 'In-memory data structure store used as a distributed cache and message broker.', ARRAY['cache', 'in-memory', 'nosql'], ARRAY['Redis Cache']);

SELECT public.seed_skill_with_aliases('ai-ml', 'Machine Learning', 'ai-machine-learning', 'Supervised, unsupervised, and reinforcement learning algorithms and evaluation.', ARRAY['ai', 'ml', 'algorithms'], ARRAY['ML', 'Classical ML']);
SELECT public.seed_skill_with_aliases('ai-ml', 'Deep Learning', 'ai-deep-learning', 'Multi-layer artificial neural networks, backpropagation, and representation learning.', ARRAY['neural-networks', 'ai', 'vision'], ARRAY['DL', 'Neural Networks']);
SELECT public.seed_skill_with_aliases('ai-ml', 'Natural Language Processing (NLP)', 'ai-nlp', 'Computational linguistics, text processing, tokenization, embeddings, and transformers.', ARRAY['nlp', 'text', 'transformers'], ARRAY['NLP', 'Text Processing']);
SELECT public.seed_skill_with_aliases('ai-ml', 'PyTorch', 'ai-pytorch', 'Open-source tensor library and deep learning framework developed by Meta AI.', ARRAY['framework', 'deep-learning', 'tensors'], ARRAY['PyTorch ML']);
SELECT public.seed_skill_with_aliases('ai-ml', 'Generative AI & LLMs', 'ai-genai-llms', 'Prompt engineering, fine-tuning, retrieval-augmented generation (RAG), and LLM orchestration.', ARRAY['llm', 'rag', 'genai'], ARRAY['GenAI', 'LLMs', 'RAG']);

SELECT public.seed_skill_with_aliases('cloud-computing', 'Amazon Web Services (AWS)', 'cloud-aws', 'Public cloud platform: EC2, S3, RDS, Lambda, VPC, and IAM.', ARRAY['cloud', 'infrastructure', 'serverless'], ARRAY['AWS', 'Amazon Web Services']);
SELECT public.seed_skill_with_aliases('cloud-computing', 'Google Cloud Platform (GCP)', 'cloud-gcp', 'Google cloud infrastructure: Compute Engine, Cloud Run, BigQuery, and GCS.', ARRAY['cloud', 'bigquery', 'serverless'], ARRAY['GCP', 'Google Cloud']);
SELECT public.seed_skill_with_aliases('cloud-computing', 'Microsoft Azure', 'cloud-azure', 'Microsoft cloud platform: Azure VMs, Azure Functions, Blob Storage, and Entra ID.', ARRAY['cloud', 'enterprise'], ARRAY['Azure', 'MS Azure']);

SELECT public.seed_skill_with_aliases('devops-platform', 'Docker', 'devops-docker', 'Containerization platform packaging applications with dependencies.', ARRAY['containers', 'isolation', 'deploy'], ARRAY['Containers', 'Docker Engine']);
SELECT public.seed_skill_with_aliases('devops-platform', 'Kubernetes', 'devops-kubernetes', 'Container orchestration system for automating deployment, scaling, and operations.', ARRAY['orchestration', 'cloud-native', 'scaling'], ARRAY['K8s', 'Kubernetes Cluster']);
SELECT public.seed_skill_with_aliases('devops-platform', 'CI/CD Pipelines', 'devops-cicd', 'Automated build, test, and deployment workflows with GitHub Actions or GitLab.', ARRAY['automation', 'continuous-integration'], ARRAY['CI/CD', 'GitHub Actions', 'Pipelines']);
SELECT public.seed_skill_with_aliases('devops-platform', 'Git & Version Control', 'devops-git', 'Distributed version control system, branching strategies, and collaborative code review.', ARRAY['core', 'collaboration', 'versioning'], ARRAY['Git', 'GitHub', 'GitLab']);

SELECT public.seed_skill_with_aliases('cs-fundamentals', 'Data Structures & Algorithms', 'cs-dsa', 'Arrays, linked lists, trees, graphs, dynamic programming, and complexity analysis.', ARRAY['core', 'interviews', 'algorithms'], ARRAY['DSA', 'Algorithms', 'Data Structures']);
SELECT public.seed_skill_with_aliases('cs-fundamentals', 'Object-Oriented Programming (OOP)', 'cs-oop', 'Encapsulation, inheritance, polymorphism, abstraction, and SOLID principles.', ARRAY['core', 'design-patterns', 'solid'], ARRAY['OOP', 'Object Oriented Programming', 'SOLID']);
SELECT public.seed_skill_with_aliases('cs-fundamentals', 'Operating Systems', 'cs-os', 'Process management, concurrency, virtual memory, file systems, and scheduling.', ARRAY['core', 'systems', 'memory'], ARRAY['OS', 'Operating Systems Concepts']);
SELECT public.seed_skill_with_aliases('cs-fundamentals', 'Computer Networks', 'cs-networking', 'OSI model, TCP/IP stack, routing, DNS, HTTP/HTTPS protocols, and sockets.', ARRAY['core', 'protocols', 'networking'], ARRAY['Computer Networking', 'TCP/IP']);

-- Clean up helper function
DROP FUNCTION IF EXISTS public.seed_skill_with_aliases;

-- ==============================================================================
-- Migration: 015_assessment_definitions.sql
-- Description: Assessment definitions and templates (skill_verification, career_readiness, comprehensive).
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE public.assessment_type AS ENUM (
    'skill_verification',
    'career_readiness',
    'comprehensive'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.assessment_mode AS ENUM (
    'personalized',
    'standard'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  assessment_type public.assessment_type NOT NULL DEFAULT 'skill_verification',
  mode public.assessment_mode NOT NULL DEFAULT 'personalized',
  question_count INT NOT NULL DEFAULT 20,
  duration_minutes INT NOT NULL DEFAULT 15,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'archived')),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_assessments_updated_at
  BEFORE UPDATE ON public.assessments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone authenticated can view active assessments"
  ON public.assessments FOR SELECT
  TO authenticated
  USING (status = 'active' OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage assessments"
  ON public.assessments FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Insert Default Standard Assessments
INSERT INTO public.assessments (name, slug, description, assessment_type, mode, question_count, duration_minutes)
VALUES
  ('Skill Verification Assessment', 'skill-verification-default', 'Domain-calibrated adaptive skill assessment for verified competency badges.', 'skill_verification', 'personalized', 20, 15),
  ('Career Readiness Diagnostic', 'career-readiness-diagnostic', 'Comprehensive multi-domain evaluation for employability readiness scoring.', 'career_readiness', 'personalized', 20, 15),
  ('Comprehensive Technical Benchmark', 'comprehensive-benchmark', 'Deep full-stack and foundational computer science verification benchmark.', 'comprehensive', 'personalized', 30, 25)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  question_count = EXCLUDED.question_count,
  duration_minutes = EXCLUDED.duration_minutes;

-- ==============================================================================
-- Migration: 016_assessment_questions.sql
-- Description: Question bank and options with secure server-side answer storage.
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE public.question_difficulty AS ENUM (
    'beginner',
    'intermediate',
    'advanced'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.question_status AS ENUM (
    'active',
    'inactive',
    'retired'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 1. Assessment Questions Table
CREATE TABLE IF NOT EXISTS public.assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE RESTRICT,
  category_id UUID REFERENCES public.skill_categories(id) ON DELETE SET NULL,
  topic TEXT NOT NULL,
  question_text TEXT NOT NULL,
  explanation TEXT,
  difficulty public.question_difficulty NOT NULL DEFAULT 'intermediate',
  question_type TEXT NOT NULL DEFAULT 'mcq' CHECK (question_type IN ('mcq')),
  score_value INT NOT NULL DEFAULT 10,
  status public.question_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_assessment_questions_updated_at
  BEFORE UPDATE ON public.assessment_questions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_assessment_questions_skill ON public.assessment_questions(skill_id);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_difficulty ON public.assessment_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_status ON public.assessment_questions(status);

-- 2. Assessment Question Options Table
CREATE TABLE IF NOT EXISTS public.assessment_question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.assessment_questions(id) ON DELETE CASCADE,
  option_key TEXT NOT NULL,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_question_option_order UNIQUE (question_id, display_order)
);

CREATE INDEX IF NOT EXISTS idx_question_options_question ON public.assessment_question_options(question_id);

-- 3. Enable Row Level Security
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_question_options ENABLE ROW LEVEL SECURITY;

-- 4. Policies
-- Questions can be viewed by authenticated users if active
CREATE POLICY "Anyone authenticated can view active questions"
  ON public.assessment_questions FOR SELECT
  TO authenticated
  USING (status = 'active' OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage assessment questions"
  ON public.assessment_questions FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Options: Authenticated users can view options
CREATE POLICY "Anyone authenticated can view question options"
  ON public.assessment_question_options FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.assessment_questions q
      WHERE q.id = assessment_question_options.question_id
        AND (q.status = 'active' OR public.is_admin(auth.uid()))
    )
  );

CREATE POLICY "Admins can manage question options"
  ON public.assessment_question_options FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ==============================================================================
-- Migration: 017_assessment_configs_attempts.sql
-- Description: Config snapshots, attempts lifecycle, assigned questions, answers, and skill results.
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE public.attempt_status AS ENUM (
    'not_started',
    'in_progress',
    'submitted',
    'auto_submitted',
    'expired',
    'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.assessed_skill_status AS ENUM (
    'insufficient_data',
    'developing',
    'competent',
    'strong'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 1. Assessment Configurations Table (Profile Snapshot)
CREATE TABLE IF NOT EXISTS public.assessment_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE SET NULL,
  question_count INT NOT NULL DEFAULT 20,
  duration_minutes INT NOT NULL DEFAULT 15,
  selected_skills_snapshot JSONB NOT NULL DEFAULT '[]'::jsonb,
  target_roles_snapshot JSONB NOT NULL DEFAULT '[]'::jsonb,
  difficulty_policy TEXT NOT NULL DEFAULT 'adaptive',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessment_configs_student ON public.assessment_configs(student_id);

-- 2. Assessment Attempts Table
CREATE TABLE IF NOT EXISTS public.assessment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id UUID NOT NULL REFERENCES public.assessment_configs(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status public.attempt_status NOT NULL DEFAULT 'in_progress',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  duration_seconds INT,
  question_count INT NOT NULL DEFAULT 20,
  overall_score NUMERIC(5,2),
  accuracy_percentage NUMERIC(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_assessment_attempts_updated_at
  BEFORE UPDATE ON public.assessment_attempts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_assessment_attempts_student ON public.assessment_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_status ON public.assessment_attempts(status);

-- 3. Assessment Attempt Questions Table (Exact Sequence Assignment)
CREATE TABLE IF NOT EXISTS public.assessment_attempt_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.assessment_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.assessment_questions(id) ON DELETE RESTRICT,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE RESTRICT,
  difficulty public.question_difficulty NOT NULL DEFAULT 'intermediate',
  sequence_number INT NOT NULL,
  selected_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_attempt_question UNIQUE (attempt_id, question_id),
  CONSTRAINT uq_attempt_sequence UNIQUE (attempt_id, sequence_number)
);

CREATE INDEX IF NOT EXISTS idx_attempt_questions_attempt ON public.assessment_attempt_questions(attempt_id);

-- 4. Assessment Answers Table
CREATE TABLE IF NOT EXISTS public.assessment_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.assessment_attempts(id) ON DELETE CASCADE,
  attempt_question_id UUID NOT NULL REFERENCES public.assessment_attempt_questions(id) ON DELETE CASCADE,
  selected_option_id UUID REFERENCES public.assessment_question_options(id) ON DELETE SET NULL,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_correct BOOLEAN,
  score_awarded INT DEFAULT 0,
  CONSTRAINT uq_attempt_question_answer UNIQUE (attempt_question_id)
);

CREATE INDEX IF NOT EXISTS idx_assessment_answers_attempt ON public.assessment_answers(attempt_id);

-- 5. Assessment Skill Results Table (Separated from Self-Declared ratings)
CREATE TABLE IF NOT EXISTS public.assessment_skill_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.assessment_attempts(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE RESTRICT,
  questions_count INT NOT NULL DEFAULT 0,
  attempted_count INT NOT NULL DEFAULT 0,
  correct_count INT NOT NULL DEFAULT 0,
  score NUMERIC(5,2) NOT NULL DEFAULT 0,
  assessed_level public.skill_self_level NOT NULL DEFAULT 'intermediate',
  confidence TEXT NOT NULL DEFAULT 'Medium' CHECK (confidence IN ('Low', 'Medium', 'High')),
  result_status public.assessed_skill_status NOT NULL DEFAULT 'competent',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_attempt_skill_result UNIQUE (attempt_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_skill_results_student ON public.assessment_skill_results(student_id);
CREATE INDEX IF NOT EXISTS idx_skill_results_skill ON public.assessment_skill_results(skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_results_attempt ON public.assessment_skill_results(attempt_id);

-- 6. Assessment Audit Events Table
CREATE TABLE IF NOT EXISTS public.assessment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.assessment_attempts(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('started', 'question_assigned', 'answer_saved', 'submitted', 'auto_submitted', 'expired', 'cancelled')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessment_events_attempt ON public.assessment_events(attempt_id);

-- 7. Enable Row Level Security
ALTER TABLE public.assessment_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_attempt_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_skill_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_events ENABLE ROW LEVEL SECURITY;

-- 8. Policies
-- Configs
CREATE POLICY "Students can view own configs"
  ON public.assessment_configs FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Students can insert own configs"
  ON public.assessment_configs FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

-- Attempts
CREATE POLICY "Students can view own attempts"
  ON public.assessment_attempts FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid()
    OR public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.student_profiles sp
      JOIN public.organization_memberships om ON om.organization_id = sp.institution_id
      WHERE sp.user_id = assessment_attempts.student_id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
    )
  );

CREATE POLICY "Students can insert own attempts"
  ON public.assessment_attempts FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own attempts"
  ON public.assessment_attempts FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- Attempt Questions
CREATE POLICY "Students can view assigned attempt questions"
  ON public.assessment_attempt_questions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.assessment_attempts a
      WHERE a.id = assessment_attempt_questions.attempt_id
        AND a.student_id = auth.uid()
    )
    OR public.is_admin(auth.uid())
  );

-- Answers
CREATE POLICY "Students can view own answers"
  ON public.assessment_answers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.assessment_attempts a
      WHERE a.id = assessment_answers.attempt_id
        AND a.student_id = auth.uid()
    )
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "Students can insert own answers"
  ON public.assessment_answers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.assessment_attempts a
      WHERE a.id = assessment_answers.attempt_id
        AND a.student_id = auth.uid()
        AND a.status = 'in_progress'
    )
  );

-- Skill Results
CREATE POLICY "Students can view own skill results"
  ON public.assessment_skill_results FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid()
    OR public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.student_profiles sp
      JOIN public.organization_memberships om ON om.organization_id = sp.institution_id
      WHERE sp.user_id = assessment_skill_results.student_id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
    )
  );

-- Events
CREATE POLICY "Students can view own attempt events"
  ON public.assessment_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.assessment_attempts a
      WHERE a.id = assessment_events.attempt_id
        AND a.student_id = auth.uid()
    )
    OR public.is_admin(auth.uid())
  );

-- ==============================================================================
-- Migration: 018_assessment_rpcs.sql
-- Description: Transactional RPCs for personalized question selection, attempt start, and authoritative scoring.
-- ==============================================================================

-- 1. RPC: create_personalized_assessment
CREATE OR REPLACE FUNCTION public.create_personalized_assessment(
  p_student_id UUID,
  p_config JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_assessment_id UUID;
  v_config_id UUID;
  v_attempt_id UUID;
  v_q_count INT;
  v_duration_mins INT;
  v_mode TEXT;
  v_target_roles JSONB;
  v_selected_skills JSONB;
  v_skill_ids UUID[];
  v_question_rec RECORD;
  v_seq INT := 0;
  v_expires_at TIMESTAMPTZ;
  v_questions_payload JSONB := '[]'::jsonb;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthenticated caller.';
  END IF;

  IF p_student_id != v_caller_id AND NOT public.is_admin(v_caller_id) THEN
    RAISE EXCEPTION 'Unauthorized: You can only create assessments for your own account.';
  END IF;

  v_q_count := COALESCE((p_config->>'question_count')::INT, 20);
  v_duration_mins := COALESCE((p_config->>'duration_minutes')::INT, 15);
  v_mode := COALESCE(p_config->>'mode', 'skill_verification');
  v_selected_skills := COALESCE(p_config->'selected_skills', '[]'::jsonb);
  v_target_roles := COALESCE(p_config->'target_roles', '[]'::jsonb);

  -- Resolve default assessment template ID
  SELECT id INTO v_assessment_id FROM public.assessments WHERE slug = 'skill-verification-default' LIMIT 1;

  -- 1. Create Assessment Config Snapshot
  INSERT INTO public.assessment_configs (
    student_id,
    assessment_id,
    question_count,
    duration_minutes,
    selected_skills_snapshot,
    target_roles_snapshot,
    difficulty_policy
  ) VALUES (
    p_student_id,
    v_assessment_id,
    v_q_count,
    v_duration_mins,
    v_selected_skills,
    v_target_roles,
    'adaptive'
  )
  RETURNING id INTO v_config_id;

  -- 2. Calculate Expiration Timestamp
  v_expires_at := NOW() + (v_duration_mins || ' minutes')::INTERVAL;

  -- 3. Create Assessment Attempt
  INSERT INTO public.assessment_attempts (
    config_id,
    student_id,
    status,
    started_at,
    expires_at,
    question_count
  ) VALUES (
    v_config_id,
    p_student_id,
    'in_progress',
    NOW(),
    v_expires_at,
    v_q_count
  )
  RETURNING id INTO v_attempt_id;

  -- 4. Gather Target Skill IDs
  IF jsonb_array_length(v_selected_skills) > 0 THEN
    SELECT ARRAY_AGG(DISTINCT s.id) INTO v_skill_ids
    FROM public.skills s
    WHERE s.name IN (SELECT jsonb_array_elements_text(v_selected_skills))
       OR s.slug IN (SELECT jsonb_array_elements_text(v_selected_skills));
  ELSE
    SELECT ARRAY_AGG(DISTINCT ss.skill_id) INTO v_skill_ids
    FROM public.student_skills ss
    WHERE ss.student_id = p_student_id AND ss.status = 'active';
  END IF;

  -- 5. Select & Assign Questions
  FOR v_question_rec IN
    (
      SELECT q.id, q.skill_id, q.topic, q.question_text, q.explanation, q.difficulty, q.score_value, s.name AS skill_name
      FROM public.assessment_questions q
      JOIN public.skills s ON s.id = q.skill_id
      WHERE q.status = 'active'
        AND (v_skill_ids IS NULL OR q.skill_id = ANY(v_skill_ids))
      ORDER BY RANDOM()
      LIMIT v_q_count
    )
  LOOP
    v_seq := v_seq + 1;
    INSERT INTO public.assessment_attempt_questions (
      attempt_id,
      question_id,
      skill_id,
      difficulty,
      sequence_number
    ) VALUES (
      v_attempt_id,
      v_question_rec.id,
      v_question_rec.skill_id,
      v_question_rec.difficulty,
      v_seq
    );
  END LOOP;

  -- If not enough skill-specific questions, backfill from active pool
  IF v_seq < v_q_count THEN
    FOR v_question_rec IN
      (
        SELECT q.id, q.skill_id, q.topic, q.question_text, q.explanation, q.difficulty, q.score_value, s.name AS skill_name
        FROM public.assessment_questions q
        JOIN public.skills s ON s.id = q.skill_id
        WHERE q.status = 'active'
          AND NOT EXISTS (
            SELECT 1 FROM public.assessment_attempt_questions aaq
            WHERE aaq.attempt_id = v_attempt_id AND aaq.question_id = q.id
          )
        ORDER BY RANDOM()
        LIMIT (v_q_count - v_seq)
      )
    LOOP
      v_seq := v_seq + 1;
      INSERT INTO public.assessment_attempt_questions (
        attempt_id,
        question_id,
        skill_id,
        difficulty,
        sequence_number
      ) VALUES (
        v_attempt_id,
        v_question_rec.id,
        v_question_rec.skill_id,
        v_question_rec.difficulty,
        v_seq
      );
    END LOOP;
  END IF;

  -- Log start event
  INSERT INTO public.assessment_events (attempt_id, event_type, metadata)
  VALUES (v_attempt_id, 'started', jsonb_build_object('question_count', v_seq, 'duration_minutes', v_duration_mins));

  RETURN jsonb_build_object(
    'attempt_id', v_attempt_id,
    'config_id', v_config_id,
    'expires_at', v_expires_at,
    'question_count', v_seq,
    'duration_minutes', v_duration_mins,
    'status', 'in_progress'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. RPC: get_assessment_attempt_questions (Safe frontend query: NO is_correct returned)
CREATE OR REPLACE FUNCTION public.get_assessment_attempt_questions(p_attempt_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_attempt RECORD;
  v_result JSONB := '[]'::jsonb;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthenticated request.';
  END IF;

  SELECT * INTO v_attempt FROM public.assessment_attempts WHERE id = p_attempt_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Assessment attempt not found.';
  END IF;

  IF v_attempt.student_id != v_caller_id AND NOT public.is_admin(v_caller_id) THEN
    RAISE EXCEPTION 'Unauthorized: You can only view your own assessment questions.';
  END IF;

  SELECT jsonb_agg(
    jsonb_build_object(
      'attempt_question_id', aaq.id,
      'question_id', q.id,
      'sequence_number', aaq.sequence_number,
      'skill_id', q.skill_id,
      'skill_name', s.name,
      'category_name', COALESCE(sc.name, 'General'),
      'topic', q.topic,
      'difficulty', aaq.difficulty,
      'question_text', q.question_text,
      'score_value', q.score_value,
      'options', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', opt.id,
            'option_key', opt.option_key,
            'option_text', opt.option_text,
            'display_order', opt.display_order
          ) ORDER BY opt.display_order ASC
        )
        FROM public.assessment_question_options opt
        WHERE opt.question_id = q.id
      )
    ) ORDER BY aaq.sequence_number ASC
  ) INTO v_result
  FROM public.assessment_attempt_questions aaq
  JOIN public.assessment_questions q ON q.id = aaq.question_id
  JOIN public.skills s ON s.id = q.skill_id
  LEFT JOIN public.skill_categories sc ON sc.id = q.category_id
  WHERE aaq.attempt_id = p_attempt_id;

  RETURN COALESCE(v_result, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. RPC: submit_assessment_attempt (Server-Side Authoritative Scoring)
CREATE OR REPLACE FUNCTION public.submit_assessment_attempt(
  p_attempt_id UUID,
  p_answers JSONB DEFAULT '{}'::jsonb,
  p_time_used_seconds INT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_attempt RECORD;
  v_ans_key TEXT;
  v_ans_val TEXT;
  v_target_aaq RECORD;
  v_opt_rec RECORD;
  v_is_correct BOOLEAN;
  v_points INT;
  v_is_expired BOOLEAN := FALSE;
  v_final_status public.attempt_status;
  v_total_questions INT := 0;
  v_total_attempted INT := 0;
  v_total_correct INT := 0;
  v_total_earned_score NUMERIC := 0;
  v_total_max_score NUMERIC := 0;
  v_overall_score NUMERIC := 0;
  v_accuracy NUMERIC := 0;

  v_skill_rec RECORD;
  v_skill_score NUMERIC;
  v_skill_acc NUMERIC;
  v_assessed_level public.skill_self_level;
  v_confidence TEXT;
  v_result_status public.assessed_skill_status;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthenticated request.';
  END IF;

  SELECT * INTO v_attempt FROM public.assessment_attempts WHERE id = p_attempt_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Attempt not found.';
  END IF;

  IF v_attempt.student_id != v_caller_id AND NOT public.is_admin(v_caller_id) THEN
    RAISE EXCEPTION 'Unauthorized: You can only submit your own assessment.';
  END IF;

  IF v_attempt.status IN ('submitted', 'auto_submitted') THEN
    RAISE EXCEPTION 'Attempt has already been submitted.';
  END IF;

  -- Enforce Authoritative Expiry
  IF NOW() > (v_attempt.expires_at + INTERVAL '1 minute') THEN
    v_is_expired := TRUE;
    v_final_status := 'auto_submitted';
  ELSE
    v_final_status := 'submitted';
  END IF;

  -- 1. Evaluate and Insert Answers
  FOR v_target_aaq IN
    SELECT aaq.id, aaq.question_id, aaq.skill_id, aaq.difficulty, q.score_value
    FROM public.assessment_attempt_questions aaq
    JOIN public.assessment_questions q ON q.id = aaq.question_id
    WHERE aaq.attempt_id = p_attempt_id
  LOOP
    v_total_questions := v_total_questions + 1;
    v_total_max_score := v_total_max_score + v_target_aaq.score_value;

    -- Check if user answered (keys could be question_id or attempt_question_id or display index)
    v_ans_val := NULL;
    IF p_answers ? v_target_aaq.id::TEXT THEN
      v_ans_val := p_answers->>v_target_aaq.id::TEXT;
    ELSIF p_answers ? v_target_aaq.question_id::TEXT THEN
      v_ans_val := p_answers->>v_target_aaq.question_id::TEXT;
    END IF;

    IF v_ans_val IS NOT NULL AND v_ans_val != '' THEN
      v_total_attempted := v_total_attempted + 1;

      -- Resolve chosen option
      SELECT * INTO v_opt_rec
      FROM public.assessment_question_options
      WHERE question_id = v_target_aaq.question_id
        AND (
          id::TEXT = v_ans_val
          OR option_key = v_ans_val
          OR display_order::TEXT = v_ans_val
        )
      LIMIT 1;

      IF FOUND THEN
        v_is_correct := v_opt_rec.is_correct;
        v_points := CASE WHEN v_is_correct THEN v_target_aaq.score_value ELSE 0 END;

        IF v_is_correct THEN
          v_total_correct := v_total_correct + 1;
          v_total_earned_score := v_total_earned_score + v_points;
        END IF;

        INSERT INTO public.assessment_answers (
          attempt_id,
          attempt_question_id,
          selected_option_id,
          is_correct,
          score_awarded
        ) VALUES (
          p_attempt_id,
          v_target_aaq.id,
          v_opt_rec.id,
          v_is_correct,
          v_points
        )
        ON CONFLICT (attempt_question_id) DO UPDATE SET
          selected_option_id = EXCLUDED.selected_option_id,
          is_correct = EXCLUDED.is_correct,
          score_awarded = EXCLUDED.score_awarded,
          answered_at = NOW();
      END IF;
    END IF;
  END LOOP;

  -- 2. Compute Overall Score & Accuracy
  IF v_total_max_score > 0 THEN
    v_overall_score := ROUND((v_total_earned_score / v_total_max_score) * 100, 2);
  ELSE
    v_overall_score := 0;
  END IF;

  IF v_total_attempted > 0 THEN
    v_accuracy := ROUND(((v_total_correct::NUMERIC / v_total_attempted::NUMERIC) * 100), 2);
  ELSE
    v_accuracy := 0;
  END IF;

  -- 3. Calculate and Insert Per-Skill Assessment Results
  DELETE FROM public.assessment_skill_results WHERE attempt_id = p_attempt_id;

  FOR v_skill_rec IN
    SELECT
      aaq.skill_id,
      COUNT(aaq.id) AS skill_total_q,
      COUNT(ans.id) AS skill_attempted,
      COUNT(ans.id) FILTER (WHERE ans.is_correct = TRUE) AS skill_correct,
      SUM(q.score_value) AS skill_max_points,
      COALESCE(SUM(ans.score_awarded), 0) AS skill_earned_points
    FROM public.assessment_attempt_questions aaq
    JOIN public.assessment_questions q ON q.id = aaq.question_id
    LEFT JOIN public.assessment_answers ans ON ans.attempt_question_id = aaq.id
    WHERE aaq.attempt_id = p_attempt_id
    GROUP BY aaq.skill_id
  LOOP
    IF v_skill_rec.skill_max_points > 0 THEN
      v_skill_score := ROUND(((v_skill_rec.skill_earned_points::NUMERIC / v_skill_rec.skill_max_points::NUMERIC) * 100), 2);
    ELSE
      v_skill_score := 0;
    END IF;

    IF v_skill_rec.skill_attempted > 0 THEN
      v_skill_acc := ROUND(((v_skill_rec.skill_correct::NUMERIC / v_skill_rec.skill_attempted::NUMERIC) * 100), 2);
    ELSE
      v_skill_acc := 0;
    END IF;

    -- Determine Assessed Proficiency Level
    IF v_skill_score >= 80 OR (v_skill_acc >= 85 AND v_skill_rec.skill_attempted >= 2) THEN
      v_assessed_level := 'advanced';
    ELSIF v_skill_score >= 55 OR (v_skill_acc >= 60 AND v_skill_rec.skill_attempted >= 1) THEN
      v_assessed_level := 'intermediate';
    ELSE
      v_assessed_level := 'beginner';
    END IF;

    -- Determine Confidence Metric
    IF v_skill_rec.skill_attempted >= 3 THEN
      v_confidence := 'High';
    ELSIF v_skill_rec.skill_attempted = 2 THEN
      v_confidence := 'Medium';
    ELSE
      v_confidence := 'Low';
    END IF;

    -- Determine Result Status
    IF v_skill_rec.skill_attempted < 1 THEN
      v_result_status := 'insufficient_data';
    ELSIF v_skill_score >= 80 THEN
      v_result_status := 'strong';
    ELSIF v_skill_score >= 55 THEN
      v_result_status := 'competent';
    ELSE
      v_result_status := 'developing';
    END IF;

    INSERT INTO public.assessment_skill_results (
      attempt_id,
      student_id,
      skill_id,
      questions_count,
      attempted_count,
      correct_count,
      score,
      assessed_level,
      confidence,
      result_status
    ) VALUES (
      p_attempt_id,
      v_attempt.student_id,
      v_skill_rec.skill_id,
      v_skill_rec.skill_total_q,
      v_skill_rec.skill_attempted,
      v_skill_rec.skill_correct,
      v_skill_score,
      v_assessed_level,
      v_confidence,
      v_result_status
    );
  END LOOP;

  -- 4. Update Attempt Record
  UPDATE public.assessment_attempts
  SET
    status = v_final_status,
    submitted_at = NOW(),
    duration_seconds = COALESCE(p_time_used_seconds, EXTRACT(EPOCH FROM (NOW() - started_at))::INT),
    overall_score = v_overall_score,
    accuracy_percentage = v_accuracy,
    updated_at = NOW()
  WHERE id = p_attempt_id;

  -- 5. Log Submit Event
  INSERT INTO public.assessment_events (attempt_id, event_type, metadata)
  VALUES (
    p_attempt_id,
    v_final_status::TEXT,
    jsonb_build_object(
      'overall_score', v_overall_score,
      'accuracy', v_accuracy,
      'total_attempted', v_total_attempted,
      'total_correct', v_total_correct
    )
  );

  RETURN jsonb_build_object(
    'attempt_id', p_attempt_id,
    'status', v_final_status,
    'overall_score', v_overall_score,
    'accuracy_percentage', v_accuracy,
    'total_questions', v_total_questions,
    'total_attempted', v_total_attempted,
    'total_correct', v_total_correct,
    'submitted_at', NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- Migration: 019_assessment_question_seeds.sql
-- Description: Standard seed data for question bank and options mapped to Phase 2.2 skills taxonomy.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.seed_question_with_options(
  s_slug TEXT,
  q_topic TEXT,
  q_diff public.question_difficulty,
  q_text TEXT,
  q_explanation TEXT,
  q_points INT,
  opt_texts TEXT[],
  correct_idx INT
) RETURNS VOID AS $$
DECLARE
  v_skill_id UUID;
  v_cat_id UUID;
  v_q_id UUID;
  i INT;
BEGIN
  SELECT id, category_id INTO v_skill_id, v_cat_id FROM public.skills WHERE slug = s_slug OR name ILIKE s_slug LIMIT 1;
  IF v_skill_id IS NULL THEN RETURN; END IF;

  INSERT INTO public.assessment_questions (
    skill_id,
    category_id,
    topic,
    question_text,
    explanation,
    difficulty,
    question_type,
    score_value,
    status
  ) VALUES (
    v_skill_id,
    v_cat_id,
    q_topic,
    q_text,
    q_explanation,
    q_diff,
    'mcq',
    q_points,
    'active'
  )
  RETURNING id INTO v_q_id;

  FOR i IN 1..array_length(opt_texts, 1)
  LOOP
    INSERT INTO public.assessment_question_options (
      question_id,
      option_key,
      option_text,
      is_correct,
      display_order
    ) VALUES (
      v_q_id,
      (i - 1)::TEXT,
      opt_texts[i],
      (i - 1) = correct_idx,
      i - 1
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 1. REACT QUESTIONS (web-react)
SELECT public.seed_question_with_options(
  'web-react', 'JSX & Props', 'beginner',
  'In React, what is the primary purpose of passing `props` to a component?',
  'Props are immutable, read-only inputs passed from parent to child components.',
  10,
  ARRAY[
    'To directly mutate the internal DOM tree of another component',
    'To pass arbitrary read-only data and callback handlers from a parent to a child component',
    'To trigger a synchronous full-page browser refresh',
    'To store global variables inside browser local storage'
  ],
  1
);

SELECT public.seed_question_with_options(
  'web-react', 'useState Hook', 'beginner',
  'How should you update state in React when the new state value depends on the previous state value?',
  'Functional updater setCount(prev => prev + 1) ensures stale closures are avoided during batched updates.',
  10,
  ARRAY[
    'Mutate state.count = state.count + 1 directly',
    'Call setCount((prevCount) => prevCount + 1) with a functional updater',
    'Re-render the root DOM tree with ReactDOM.render',
    'Call this.forceUpdate() inside the functional component'
  ],
  1
);

SELECT public.seed_question_with_options(
  'web-react', 'useEffect Hook', 'intermediate',
  'When does the cleanup function returned inside a `useEffect` callback execute?',
  'The cleanup executes before the component unmounts and before re-running the effect on dependency change.',
  20,
  ARRAY[
    'Only when the entire browser window is closed',
    'Before the component unmounts and prior to re-running the effect on dependency updates',
    'Immediately before JSX finishes compilation',
    'Whenever a network request returns HTTP 200'
  ],
  1
);

SELECT public.seed_question_with_options(
  'web-react', 'useCallback & useMemo', 'intermediate',
  'What is the primary operational distinction between `useMemo` and `useCallback`?',
  'useMemo caches computed values; useCallback caches function definitions.',
  20,
  ARRAY[
    'useMemo runs on the server while useCallback runs in Web Workers',
    'useMemo memoizes the computed return value of a function; useCallback memoizes the function definition itself',
    'useMemo is exclusively for class components; useCallback is for functional components',
    'useCallback triggers automatic network caching; useMemo does not'
  ],
  1
);

SELECT public.seed_question_with_options(
  'web-react', 'Concurrent React', 'advanced',
  'What is the primary benefit of wrapping non-urgent state updates in `startTransition` in React 18+?',
  'startTransition marks updates as interruptible so urgent interactions like typing remain at 60fps.',
  30,
  ARRAY[
    'It converts client React code to WebAssembly binaries',
    'It marks state updates as low-priority, allowing urgent user interactions to interrupt the render',
    'It bypasses all React reconciliation checks and writes directly to innerHTML',
    'It forces components to execute strictly on a backend worker thread'
  ],
  1
);

-- 2. TYPESCRIPT QUESTIONS (lang-typescript)
SELECT public.seed_question_with_options(
  'lang-typescript', 'Type Inference & Generics', 'beginner',
  'What is the main advantage of TypeScript generics over using the `any` type?',
  'Generics preserve compile-time type safety and parameter relationships whereas any disables type checking.',
  10,
  ARRAY[
    'Generics automatically minify JavaScript output at runtime',
    'Generics retain compile-time type safety while allowing flexible, reusable code structures',
    'Generics convert interpreted JavaScript into multi-threaded assembly',
    'Generics disable strict mode checks in tsconfig.json'
  ],
  1
);

SELECT public.seed_question_with_options(
  'lang-typescript', 'Discriminated Unions', 'intermediate',
  'What characterizes a Discriminated Union in TypeScript?',
  'A union of object types that share a common literal tag property used for type narrowing.',
  20,
  ARRAY[
    'A union type that only accepts primitive numeric constants',
    'A union of object types sharing a common literal property used by TypeScript to narrow types',
    'A type assertion syntax using the `as unknown as Type` pattern',
    'A class implementing multiple abstract interfaces simultaneously'
  ],
  1
);

SELECT public.seed_question_with_options(
  'lang-typescript', 'Conditional Types', 'advanced',
  'What does the `infer` keyword accomplish within a TypeScript conditional type?',
  'infer introduces a type variable to be deduced within the conditional type expression.',
  30,
  ARRAY[
    'It forces the compiler to guess missing variable definitions at runtime',
    'It declares a type variable to be extracted and deduced within the true branch of a conditional type',
    'It imports external ambient declarations from npm packages',
    'It converts a promise type into a synchronous blocking call'
  ],
  1
);

-- 3. JAVASCRIPT QUESTIONS (lang-javascript)
SELECT public.seed_question_with_options(
  'lang-javascript', 'Event Loop & Concurrency', 'intermediate',
  'In the JavaScript event loop, in what order are Microtasks (e.g. Promise.then) and Macrotasks (e.g. setTimeout) processed?',
  'Microtask queue is fully drained after the current synchronous frame and before the next macrotask is dequeued.',
  20,
  ARRAY[
    'Macrotasks always execute before microtasks regardless of queue state',
    'All queued microtasks are completely executed before the event loop picks the next macrotask',
    'Both queues execute in parallel on separate operating system threads',
    'Microtasks only execute when requestAnimationFrame fires'
  ],
  1
);

SELECT public.seed_question_with_options(
  'lang-javascript', 'Closures & Scope', 'beginner',
  'What is a closure in JavaScript?',
  'A closure is the combination of a function bundled together with references to its surrounding lexical environment.',
  10,
  ARRAY[
    'A syntax error that prevents functions from being invoked',
    'A function that retains access to variables from its outer lexical scope even after that outer scope has closed',
    'An encrypted cryptographic hash generated by the V8 engine',
    'A method to terminate an infinite loop immediately'
  ],
  1
);

-- 4. PYTHON QUESTIONS (lang-python)
SELECT public.seed_question_with_options(
  'lang-python', 'Decorators & Generators', 'intermediate',
  'What is the primary memory advantage of a Python generator using `yield` compared to returning a full `list`?',
  'Generators evaluate lazily one item at a time with O(1) memory instead of allocating the entire collection in memory.',
  20,
  ARRAY[
    'Generators run in parallel across all CPU cores automatically',
    'Generators produce items on demand with O(1) space complexity without storing the entire dataset in RAM',
    'Generators encrypt variables to protect memory from inspection',
    'Generators compile directly into C extensions during execution'
  ],
  1
);

SELECT public.seed_question_with_options(
  'lang-python', 'Global Interpreter Lock (GIL)', 'advanced',
  'What is the impact of CPython GIL on multi-threaded CPU-bound programs?',
  'The GIL prevents multiple native threads from executing Python bytecodes concurrently on multiple CPU cores.',
  30,
  ARRAY[
    'It guarantees that Python threads run faster than C++ threads',
    'It ensures only one thread executes Python bytecode at a time, limiting CPU-bound concurrency to a single core',
    'It replaces operating system memory allocators with garbage collection pools',
    'It automatically distributes workload across a cluster of server machines'
  ],
  1
);

-- 5. SQL & POSTGRESQL (lang-sql, db-postgresql)
SELECT public.seed_question_with_options(
  'lang-sql', 'Joins & Aggregations', 'beginner',
  'What is the difference between `WHERE` and `HAVING` clauses in SQL?',
  'WHERE filters rows before aggregation; HAVING filters aggregated groups.',
  10,
  ARRAY[
    'WHERE is for PostgreSQL; HAVING is only for MySQL',
    'WHERE filters individual rows before aggregation; HAVING filters groups after the GROUP BY aggregation',
    'HAVING cannot be used with aggregate functions like COUNT() or SUM()',
    'WHERE sorts records ascending; HAVING sorts records descending'
  ],
  1
);

SELECT public.seed_question_with_options(
  'lang-sql', 'Indexing & Query Optimization', 'intermediate',
  'Why can a B-Tree index become ineffective when applying a function to an indexed column (e.g. `WHERE LOWER(email) = ?`)?',
  'Standard B-Tree indexes cannot be used unless an expression/functional index is explicitly created.',
  20,
  ARRAY[
    'Because SQL databases disable all indexes whenever strings are compared',
    'The database must evaluate the function row-by-row on the fly unless a functional/expression index is created',
    'Functions in WHERE clauses cause an immediate database dead-lock',
    'B-Trees only support integer comparisons, not text columns'
  ],
  1
);

SELECT public.seed_question_with_options(
  'db-postgresql', 'ACID Transactions & Isolation', 'advanced',
  'Under the `READ COMMITTED` transaction isolation level in PostgreSQL, which anomaly is still possible?',
  'Non-repeatable reads (where a query re-read in the same transaction sees modified committed data) can occur.',
  30,
  ARRAY[
    'Dirty Reads (reading uncommitted modified data)',
    'Non-repeatable Reads (re-reading a row in the same transaction yields updated data committed by another transaction)',
    'Database buffer corruption',
    'Automatic rollback of all concurrent transactions'
  ],
  1
);

-- 6. DATA STRUCTURES & ALGORITHMS (cs-dsa)
SELECT public.seed_question_with_options(
  'cs-dsa', 'Time Complexity & Hash Maps', 'beginner',
  'What is the average case time complexity for search, insertion, and deletion in a Hash Table?',
  'With a good hash function and load factor, hash table lookups are O(1) average time.',
  10,
  ARRAY[
    'O(N)',
    'O(1)',
    'O(log N)',
    'O(N log N)'
  ],
  1
);

SELECT public.seed_question_with_options(
  'cs-dsa', 'Graph Traversal', 'intermediate',
  'Which data structure is typically utilized to implement Breadth-First Search (BFS) on a graph?',
  'BFS uses a FIFO Queue to visit neighbors level by level.',
  20,
  ARRAY[
    'LIFO Stack',
    'FIFO Queue',
    'Priority Max-Heap',
    'Binary Search Tree'
  ],
  1
);

SELECT public.seed_question_with_options(
  'cs-dsa', 'Dynamic Programming', 'advanced',
  'What are the two foundational properties required for a problem to be solvable via Dynamic Programming?',
  'Optimal Substructure (optimal solution built from optimal subproblems) and Overlapping Subproblems.',
  30,
  ARRAY[
    'Linear Time Complexity and Constant Memory',
    'Optimal Substructure and Overlapping Subproblems',
    'Asymptotic Equivalence and Sorting Invariants',
    'Greedy Choice Property and Complete Bipartiteness'
  ],
  1
);

-- 7. COMPUTER NETWORKS & OPERATING SYSTEMS (cs-networking, cs-os)
SELECT public.seed_question_with_options(
  'cs-networking', 'TCP vs UDP', 'beginner',
  'Why does TCP establish a three-way handshake (SYN, SYN-ACK, ACK) before data transfer?',
  'To synchronize sequence numbers, verify bi-directional connectivity, and establish a reliable session.',
  10,
  ARRAY[
    'To encrypt HTTP headers with AES-256 keys',
    'To synchronize initial sequence numbers and confirm bi-directional transmission capability before streaming payload',
    'To assign an IPv6 address to the client adapter',
    'To notify the DNS server that a domain is active'
  ],
  1
);

SELECT public.seed_question_with_options(
  'cs-os', 'Process vs Thread', 'intermediate',
  'What is the primary distinction between a Process and a Thread in modern operating systems?',
  'Processes have isolated virtual address spaces; threads within the same process share heap, code, and address space.',
  20,
  ARRAY[
    'Processes share RAM directly; threads have completely isolated physical memory',
    'Processes have independent virtual address spaces; threads within a process share the same memory address space and file descriptors',
    'Threads can only run in single-core processors; processes require multi-core architectures',
    'Processes cannot communicate with other processes over networks'
  ],
  1
);

-- 8. GIT & DEVOPS (devops-git, devops-docker)
SELECT public.seed_question_with_options(
  'devops-git', 'Git Merge vs Rebase', 'intermediate',
  'What happens when you perform `git rebase main` on your feature branch?',
  'Your feature branch commits are lifted and re-applied sequentially onto the tip of main, producing a linear history.',
  20,
  ARRAY[
    'It permanently destroys all remote commits on origin/main',
    'It reapplies your feature branch commits sequentially on top of the latest commit of the main branch, creating a linear history',
    'It generates a three-way merge commit with two parent commit hashes',
    'It reverts all unstaged local file modifications'
  ],
  1
);

SELECT public.seed_question_with_options(
  'devops-docker', 'Container Layers & Caching', 'intermediate',
  'Why should Dockerfile instructions that change frequently (such as `COPY . .`) be placed toward the bottom of the Dockerfile?',
  'Placing frequently modified instructions late preserves cached earlier layers (like package installation), speeding up image builds.',
  20,
  ARRAY[
    'Because Docker only parses the last 5 lines of a Dockerfile',
    'To maximize Docker layer caching and avoid invalidating earlier expensive layers like dependency installations',
    'Because Linux kernels forbid copying files before setting the entrypoint',
    'To prevent the container from consuming swap space'
  ],
  1
);

-- 9. ARTIFICIAL INTELLIGENCE & ML (ai-machine-learning)
SELECT public.seed_question_with_options(
  'ai-machine-learning', 'Overfitting & Regularization', 'intermediate',
  'What is the primary goal of applying L2 Regularization (Ridge) to a linear or neural network model?',
  'L2 regularization penalizes large weights with a squared penalty, preventing excessive sensitivity to training noise.',
  20,
  ARRAY[
    'To eliminate all bias in the dataset completely',
    'To penalize large model weights by adding a squared magnitude term to the loss function, reducing model variance and overfitting',
    'To force the model weights to become exactly zero (sparse feature selection)',
    'To increase the learning rate exponentially during training'
  ],
  1
);

-- Clean up helper function
DROP FUNCTION IF EXISTS public.seed_question_with_options;

-- ==============================================================================
-- Migration: 020_opportunities.sql
-- Description: Canonical opportunities table supporting internships, jobs, live projects, apprenticeships, and training programs.
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE public.opportunity_type AS ENUM (
    'internship',
    'job',
    'live_project',
    'apprenticeship',
    'training'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.opportunity_status AS ENUM (
    'draft',
    'pending_review',
    'published',
    'closed',
    'rejected',
    'archived'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.opportunity_work_mode AS ENUM (
    'remote',
    'hybrid',
    'onsite'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.opportunity_experience_level AS ENUM (
    'fresher',
    '0-1 yr',
    '1-2 yr',
    '2+ yr',
    'any'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 1. Canonical Opportunities Table
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  type public.opportunity_type NOT NULL DEFAULT 'internship',
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  description TEXT NOT NULL,
  responsibilities TEXT[] DEFAULT '{}',
  domain TEXT,
  category_id UUID REFERENCES public.skill_categories(id) ON DELETE SET NULL,
  status public.opportunity_status NOT NULL DEFAULT 'draft',
  location TEXT,
  work_mode public.opportunity_work_mode NOT NULL DEFAULT 'hybrid',
  experience_level public.opportunity_experience_level NOT NULL DEFAULT 'any',
  duration_value INT,
  duration_unit TEXT CHECK (duration_unit IN ('weeks', 'months', 'years', 'full_time')),
  duration_text TEXT,
  compensation_type TEXT NOT NULL DEFAULT 'Stipend' CHECK (compensation_type IN ('Stipend', 'Salary', 'Unpaid', 'Completion Bonus', 'Free')),
  compensation_min NUMERIC(12,2),
  compensation_max NUMERIC(12,2),
  compensation_currency TEXT NOT NULL DEFAULT 'INR',
  compensation_formatted TEXT,
  openings INT NOT NULL DEFAULT 1,
  hiring_process TEXT[] DEFAULT '{"Application Review", "Skill Assessment", "Technical Interview", "HR Round"}',
  application_deadline TIMESTAMPTZ NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  live_project_details JSONB,
  training_details JSONB,
  posted_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_opportunities_updated_at
  BEFORE UPDATE ON public.opportunities
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_opportunities_company ON public.opportunities(company_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON public.opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opportunities_type ON public.opportunities(type);
CREATE INDEX IF NOT EXISTS idx_opportunities_deadline ON public.opportunities(application_deadline);
CREATE INDEX IF NOT EXISTS idx_opportunities_published ON public.opportunities(published_at);
CREATE INDEX IF NOT EXISTS idx_opportunities_work_mode ON public.opportunities(work_mode);
CREATE INDEX IF NOT EXISTS idx_opportunities_category ON public.opportunities(category_id);

-- ==============================================================================
-- Migration: 021_opportunity_skills.sql
-- Description: Structured opportunity skill requirements linked to central skills taxonomy with weights.
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE public.opportunity_skill_requirement_type AS ENUM (
    'required',
    'preferred'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.opportunity_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE RESTRICT,
  requirement_type public.opportunity_skill_requirement_type NOT NULL DEFAULT 'required',
  minimum_level public.skill_self_level,
  weight INT NOT NULL DEFAULT 3 CHECK (weight >= 1 AND weight <= 10),
  mandatory BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_opportunity_skill UNIQUE (opportunity_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_opportunity_skills_opp ON public.opportunity_skills(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_skills_skill ON public.opportunity_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_skills_req_type ON public.opportunity_skills(requirement_type);

-- ==============================================================================
-- Migration: 022_opportunity_eligibility.sql
-- Description: Structured opportunity eligibility rules for deterministic student evaluation.
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE public.eligibility_rule_type AS ENUM (
    'degree',
    'program',
    'department',
    'graduation_year',
    'minimum_cgpa',
    'experience',
    'location'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.opportunity_eligibility_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  rule_type public.eligibility_rule_type NOT NULL,
  operator TEXT NOT NULL DEFAULT 'in' CHECK (operator IN ('in', 'eq', 'gte', 'lte', 'contains')),
  value JSONB NOT NULL,
  is_mandatory BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_opp_eligibility_opp ON public.opportunity_eligibility_rules(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opp_eligibility_type ON public.opportunity_eligibility_rules(rule_type);

-- ==============================================================================
-- Migration: 023_opportunity_target_roles_and_saved.sql
-- Description: Opportunity target role mappings and student saved opportunities persistence.
-- ==============================================================================

-- 1. Opportunity Target Roles Mapping
CREATE TABLE IF NOT EXISTS public.opportunity_target_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  target_role_id UUID NOT NULL REFERENCES public.target_roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_opp_target_role UNIQUE (opportunity_id, target_role_id)
);

CREATE INDEX IF NOT EXISTS idx_opp_target_roles_opp ON public.opportunity_target_roles(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opp_target_roles_role ON public.opportunity_target_roles(target_role_id);

-- 2. Saved Opportunities Table
CREATE TABLE IF NOT EXISTS public.saved_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_saved_opportunity UNIQUE (student_id, opportunity_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_opp_student ON public.saved_opportunities(student_id);
CREATE INDEX IF NOT EXISTS idx_saved_opp_opp ON public.saved_opportunities(opportunity_id);

-- ==============================================================================
-- Migration: 024_opportunity_matching.sql
-- Description: Opportunity match snapshots and explainable multi-dimensional fit scoring.
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE public.opportunity_match_category AS ENUM (
    'best_match',
    'quick_win',
    'skill_building',
    'general_match',
    'not_eligible'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.opportunity_match_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  overall_match NUMERIC(5,2) NOT NULL DEFAULT 0,
  category_tag public.opportunity_match_category NOT NULL DEFAULT 'general_match',
  skill_fit NUMERIC(5,2) NOT NULL DEFAULT 0,
  eligibility_fit NUMERIC(5,2) NOT NULL DEFAULT 0,
  career_fit NUMERIC(5,2) NOT NULL DEFAULT 0,
  readiness_fit NUMERIC(5,2) NOT NULL DEFAULT 0,
  evidence_fit NUMERIC(5,2) NOT NULL DEFAULT 0,
  preference_fit NUMERIC(5,2) NOT NULL DEFAULT 0,
  matching_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  missing_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
  concerns JSONB NOT NULL DEFAULT '[]'::jsonb,
  why_you_match JSONB NOT NULL DEFAULT '[]'::jsonb,
  what_is_missing JSONB NOT NULL DEFAULT '[]'::jsonb,
  what_would_improve JSONB NOT NULL DEFAULT '[]'::jsonb,
  eligibility_result JSONB NOT NULL DEFAULT '{}'::jsonb,
  engine_version TEXT NOT NULL DEFAULT '2.4-deterministic',
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_student_opp_match UNIQUE (student_id, opportunity_id)
);

CREATE INDEX IF NOT EXISTS idx_opp_match_student ON public.opportunity_match_results(student_id);
CREATE INDEX IF NOT EXISTS idx_opp_match_opp ON public.opportunity_match_results(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opp_match_score ON public.opportunity_match_results(overall_match DESC);
CREATE INDEX IF NOT EXISTS idx_opp_match_category ON public.opportunity_match_results(category_tag);

-- ==============================================================================
-- Migration: 025_opportunity_rls_and_rpcs.sql
-- Description: RLS policies and server-side RPCs for opportunity eligibility, deterministic matching, and publishing.
-- ==============================================================================

-- 1. Enable Row Level Security
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_eligibility_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_target_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_match_results ENABLE ROW LEVEL SECURITY;

-- 2. Opportunities Policies
CREATE POLICY "Students and public can view published opportunities"
  ON public.opportunities FOR SELECT
  TO authenticated
  USING (
    status = 'published'
    OR public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.organization_memberships om
      WHERE om.organization_id = opportunities.company_id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
    )
  );

CREATE POLICY "Company members can insert opportunities"
  ON public.opportunities FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.organization_memberships om
      WHERE om.organization_id = opportunities.company_id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
    )
  );

CREATE POLICY "Company members can update own opportunities"
  ON public.opportunities FOR UPDATE
  TO authenticated
  USING (
    public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.organization_memberships om
      WHERE om.organization_id = opportunities.company_id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
    )
  )
  WITH CHECK (
    public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.organization_memberships om
      WHERE om.organization_id = opportunities.company_id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
    )
  );

CREATE POLICY "Company members can delete own draft opportunities"
  ON public.opportunities FOR DELETE
  TO authenticated
  USING (
    public.is_admin(auth.uid())
    OR (
      status = 'draft'
      AND EXISTS (
        SELECT 1 FROM public.organization_memberships om
        WHERE om.organization_id = opportunities.company_id
          AND om.user_id = auth.uid()
          AND om.status = 'active'
      )
    )
  );

-- 3. Opportunity Skills Policies
CREATE POLICY "Anyone who can view opportunity can view its skills"
  ON public.opportunity_skills FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.opportunities o
      WHERE o.id = opportunity_skills.opportunity_id
        AND (
          o.status = 'published'
          OR public.is_admin(auth.uid())
          OR EXISTS (
            SELECT 1 FROM public.organization_memberships om
            WHERE om.organization_id = o.company_id
              AND om.user_id = auth.uid()
              AND om.status = 'active'
          )
        )
    )
  );

CREATE POLICY "Company members can manage opportunity skills"
  ON public.opportunity_skills FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.opportunities o
      JOIN public.organization_memberships om ON om.organization_id = o.company_id
      WHERE o.id = opportunity_skills.opportunity_id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
    )
    OR public.is_admin(auth.uid())
  );

-- 4. Opportunity Eligibility Rules Policies
CREATE POLICY "Anyone who can view opportunity can view its eligibility rules"
  ON public.opportunity_eligibility_rules FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.opportunities o
      WHERE o.id = opportunity_eligibility_rules.opportunity_id
        AND (
          o.status = 'published'
          OR public.is_admin(auth.uid())
          OR EXISTS (
            SELECT 1 FROM public.organization_memberships om
            WHERE om.organization_id = o.company_id
              AND om.user_id = auth.uid()
              AND om.status = 'active'
          )
        )
    )
  );

CREATE POLICY "Company members can manage eligibility rules"
  ON public.opportunity_eligibility_rules FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.opportunities o
      JOIN public.organization_memberships om ON om.organization_id = o.company_id
      WHERE o.id = opportunity_eligibility_rules.opportunity_id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
    )
    OR public.is_admin(auth.uid())
  );

-- 5. Opportunity Target Roles Policies
CREATE POLICY "Anyone who can view opportunity can view target roles"
  ON public.opportunity_target_roles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.opportunities o
      WHERE o.id = opportunity_target_roles.opportunity_id
        AND (
          o.status = 'published'
          OR public.is_admin(auth.uid())
          OR EXISTS (
            SELECT 1 FROM public.organization_memberships om
            WHERE om.organization_id = o.company_id
              AND om.user_id = auth.uid()
              AND om.status = 'active'
          )
        )
    )
  );

CREATE POLICY "Company members can manage target roles"
  ON public.opportunity_target_roles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.opportunities o
      JOIN public.organization_memberships om ON om.organization_id = o.company_id
      WHERE o.id = opportunity_target_roles.opportunity_id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
    )
    OR public.is_admin(auth.uid())
  );

-- 6. Saved Opportunities Policies
CREATE POLICY "Students can view own saved opportunities"
  ON public.saved_opportunities FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Students can save opportunities"
  ON public.saved_opportunities FOR INSERT
  TO authenticated
  WITH CHECK (
    student_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.opportunities o
      WHERE o.id = saved_opportunities.opportunity_id
        AND (o.status = 'published' OR public.is_admin(auth.uid()))
    )
  );

CREATE POLICY "Students can delete own saved opportunities"
  ON public.saved_opportunities FOR DELETE
  TO authenticated
  USING (student_id = auth.uid() OR public.is_admin(auth.uid()));

-- 7. Match Results Policies
CREATE POLICY "Students can view own match results"
  ON public.opportunity_match_results FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Students can insert own match results"
  ON public.opportunity_match_results FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Students can update own match results"
  ON public.opportunity_match_results FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid() OR public.is_admin(auth.uid()))
  WITH CHECK (student_id = auth.uid() OR public.is_admin(auth.uid()));

-- ==============================================================================
-- RPC: check_opportunity_eligibility
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.check_opportunity_eligibility(
  p_student_id UUID,
  p_opportunity_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_student RECORD;
  v_rule RECORD;
  v_passed TEXT[] := '{}';
  v_failed TEXT[] := '{}';
  v_notes TEXT[] := '{}';
  v_score INT := 100;
  v_is_eligible BOOLEAN := TRUE;
  v_student_degree TEXT;
  v_student_prog TEXT;
  v_student_dept TEXT;
  v_student_grad_yr TEXT;
  v_student_grade NUMERIC;
  v_rule_val_text TEXT;
  v_matches BOOLEAN;
BEGIN
  -- 1. Fetch Student Academic Profile
  SELECT * INTO v_student FROM public.student_profiles WHERE user_id = p_student_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'is_eligible', false,
      'score', 0,
      'passed_criteria', '[]'::jsonb,
      'disqualifying_criteria', jsonb_build_array('Student profile not found or onboarding incomplete.'),
      'notes', '[]'::jsonb
    );
  END IF;

  v_student_degree := LOWER(COALESCE(v_student.degree, ''));
  v_student_prog := LOWER(COALESCE(v_student.program, ''));
  v_student_grad_yr := COALESCE(v_student.graduation_year::TEXT, '');
  v_student_grade := COALESCE(NULLIF(regexp_replace(v_student.grade, '[^0-9.]', '', 'g'), '')::NUMERIC, 8.0);

  -- 2. Evaluate Eligibility Rules
  FOR v_rule IN
    SELECT * FROM public.opportunity_eligibility_rules WHERE opportunity_id = p_opportunity_id
  LOOP
    v_matches := FALSE;

    IF v_rule.rule_type = 'degree' THEN
      IF v_rule.value ? 'Any' OR v_rule.value ? 'All' THEN
        v_matches := TRUE;
      ELSE
        SELECT EXISTS (
          SELECT 1 FROM jsonb_array_elements_text(v_rule.value) elem
          WHERE v_student_degree ILIKE '%' || elem || '%' OR elem ILIKE '%' || v_student_degree || '%'
        ) INTO v_matches;
      END IF;

      IF v_matches THEN
        v_passed := array_append(v_passed, 'Degree Requirement Met: ' || v_rule.value::TEXT);
      ELSE
        v_failed := array_append(v_failed, 'Degree Mismatch: Opportunity requires ' || v_rule.value::TEXT);
      END IF;

    ELSIF v_rule.rule_type = 'program' OR v_rule.rule_type = 'department' THEN
      IF v_rule.value ? 'Any' OR v_rule.value ? 'All' THEN
        v_matches := TRUE;
      ELSE
        SELECT EXISTS (
          SELECT 1 FROM jsonb_array_elements_text(v_rule.value) elem
          WHERE v_student_prog ILIKE '%' || elem || '%' OR elem ILIKE '%' || v_student_prog || '%'
        ) INTO v_matches;
      END IF;

      IF v_matches THEN
        v_passed := array_append(v_passed, 'Discipline Requirement Met: ' || v_rule.value::TEXT);
      ELSE
        v_failed := array_append(v_failed, 'Department Requirement: Requires ' || v_rule.value::TEXT);
      END IF;

    ELSIF v_rule.rule_type = 'graduation_year' THEN
      IF v_rule.value ? 'Any' OR v_rule.value ? 'All' THEN
        v_matches := TRUE;
      ELSE
        SELECT EXISTS (
          SELECT 1 FROM jsonb_array_elements_text(v_rule.value) elem
          WHERE v_student_grad_yr ILIKE '%' || elem || '%'
        ) INTO v_matches;
      END IF;

      IF v_matches THEN
        v_passed := array_append(v_passed, 'Graduation Batch Met: ' || v_rule.value::TEXT);
      ELSE
        v_failed := array_append(v_failed, 'Graduation Batch Mismatch: Targeted at ' || v_rule.value::TEXT);
      END IF;

    ELSIF v_rule.rule_type = 'minimum_cgpa' THEN
      IF v_student_grade >= (v_rule.value#>>'{}')::NUMERIC THEN
        v_matches := TRUE;
        v_passed := array_append(v_passed, 'Minimum CGPA Met (>= ' || (v_rule.value#>>'{}') || ')');
      ELSE
        v_failed := array_append(v_failed, 'CGPA Requirement: Requires min ' || (v_rule.value#>>'{}') || ' CGPA');
      END IF;
    END IF;
  END LOOP;

  IF array_length(v_failed, 1) > 0 THEN
    v_is_eligible := FALSE;
  END IF;

  IF (array_length(v_passed, 1) + array_length(v_failed, 1)) > 0 THEN
    v_score := ROUND((COALESCE(array_length(v_passed, 1), 0)::NUMERIC / (COALESCE(array_length(v_passed, 1), 0) + COALESCE(array_length(v_failed, 1), 0))::NUMERIC) * 100);
  ELSE
    v_score := 100;
    v_passed := array_append(v_passed, 'Open Eligibility: No restrictive academic barriers');
  END IF;

  RETURN jsonb_build_object(
    'is_eligible', v_is_eligible,
    'score', v_score,
    'passed_criteria', to_jsonb(v_passed),
    'disqualifying_criteria', to_jsonb(v_failed),
    'notes', to_jsonb(v_notes)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- RPC: calculate_opportunity_match
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.calculate_opportunity_match(
  p_student_id UUID,
  p_opportunity_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_opp RECORD;
  v_eligibility JSONB;
  v_is_eligible BOOLEAN;
  v_eligibility_fit NUMERIC;

  v_req_skill RECORD;
  v_student_skill RECORD;
  v_matching_skills JSONB := '[]'::jsonb;
  v_missing_skills JSONB := '[]'::jsonb;
  v_total_weight NUMERIC := 0;
  v_earned_weight NUMERIC := 0;
  v_skill_fit NUMERIC := 70;

  v_career_fit NUMERIC := 65;
  v_readiness_fit NUMERIC := 75;
  v_evidence_fit NUMERIC := 60;
  v_preference_fit NUMERIC := 80;
  v_overall_match NUMERIC := 0;
  v_category_tag public.opportunity_match_category;

  v_strengths TEXT[] := '{}';
  v_concerns TEXT[] := '{}';
  v_why_you_match TEXT[] := '{}';
  v_what_is_missing TEXT[] := '{}';
  v_what_would_improve TEXT[] := '{}';

  v_target_role_match_count INT := 0;
  v_match_res_id UUID;
BEGIN
  -- 1. Fetch Opportunity
  SELECT * INTO v_opp FROM public.opportunities WHERE id = p_opportunity_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Opportunity not found.';
  END IF;

  -- 2. Check Eligibility
  v_eligibility := public.check_opportunity_eligibility(p_student_id, p_opportunity_id);
  v_is_eligible := (v_eligibility->>'is_eligible')::BOOLEAN;
  v_eligibility_fit := (v_eligibility->>'score')::NUMERIC;

  -- 3. Calculate Skill Fit with Weights
  FOR v_req_skill IN
    SELECT os.*, s.name AS skill_name
    FROM public.opportunity_skills os
    JOIN public.skills s ON s.id = os.skill_id
    WHERE os.opportunity_id = p_opportunity_id
  LOOP
    v_total_weight := v_total_weight + v_req_skill.weight;

    -- Check if student has declared or assessed this skill
    SELECT ss.*, sr.assessed_level, sr.score AS assessed_score
    INTO v_student_skill
    FROM public.student_skills ss
    LEFT JOIN public.assessment_skill_results sr
      ON sr.student_id = p_student_id AND sr.skill_id = v_req_skill.skill_id
    WHERE ss.student_id = p_student_id AND ss.skill_id = v_req_skill.skill_id
    LIMIT 1;

    IF FOUND THEN
      v_earned_weight := v_earned_weight + v_req_skill.weight;
      v_matching_skills := v_matching_skills || jsonb_build_object(
        'name', v_req_skill.skill_name,
        'level', COALESCE(v_student_skill.assessed_level::TEXT, v_student_skill.self_level::TEXT, 'intermediate'),
        'score', COALESCE(v_student_skill.assessed_score, v_student_skill.self_score, 75),
        'is_assessed', (v_student_skill.assessed_score IS NOT NULL)
      );
    ELSE
      v_missing_skills := v_missing_skills || to_jsonb(v_req_skill.skill_name);
      v_what_is_missing := array_append(v_what_is_missing, v_req_skill.skill_name || ' (' || v_req_skill.requirement_type || ')');
    END IF;
  END LOOP;

  IF v_total_weight > 0 THEN
    v_skill_fit := ROUND((v_earned_weight / v_total_weight) * 100, 2);
  ELSE
    v_skill_fit := 85;
  END IF;

  -- 4. Check Career Role Alignment
  SELECT COUNT(*) INTO v_target_role_match_count
  FROM public.opportunity_target_roles otr
  JOIN public.student_target_roles str
    ON str.target_role_id = otr.target_role_id AND str.student_id = p_student_id
  WHERE otr.opportunity_id = p_opportunity_id;

  IF v_target_role_match_count > 0 THEN
    v_career_fit := 95;
    v_why_you_match := array_append(v_why_you_match, 'Directly aligns with your selected target career trajectory.');
  ELSE
    v_career_fit := 65;
  END IF;

  -- 5. Build Explanation Vectors
  IF v_skill_fit >= 75 THEN
    v_why_you_match := array_append(v_why_you_match, 'Strong technical skill coverage (' || jsonb_array_length(v_matching_skills) || ' matching skills).');
    v_strengths := array_append(v_strengths, 'Core Technical Stack Fit');
  END IF;

  IF v_is_eligible THEN
    v_why_you_match := array_append(v_why_you_match, 'Fully meets academic and eligibility qualifications.');
  ELSE
    v_concerns := array_append(v_concerns, 'Does not currently satisfy all formal eligibility criteria.');
  END IF;

  IF jsonb_array_length(v_missing_skills) > 0 THEN
    v_what_would_improve := array_append(v_what_would_improve, 'Acquire or verify: ' || (SELECT string_agg(elem, ', ') FROM jsonb_array_elements_text(v_missing_skills) elem));
  END IF;

  -- 6. Compute Overall Composite Match Score
  IF NOT v_is_eligible THEN
    v_overall_match := LEAST(ROUND((v_skill_fit * 0.35 + v_eligibility_fit * 0.25 + v_career_fit * 0.2 + v_readiness_fit * 0.2), 2), 48.0);
    v_category_tag := 'not_eligible';
  ELSE
    v_overall_match := ROUND((v_skill_fit * 0.40 + v_career_fit * 0.25 + v_readiness_fit * 0.15 + v_eligibility_fit * 0.10 + v_preference_fit * 0.10), 2);
    IF v_overall_match >= 85 THEN
      v_category_tag := 'best_match';
    ELSIF v_overall_match >= 75 THEN
      v_category_tag := 'quick_win';
    ELSIF v_overall_match >= 60 THEN
      v_category_tag := 'skill_building';
    ELSE
      v_category_tag := 'general_match';
    END IF;
  END IF;

  -- 7. Persist or Update Match Snapshot
  INSERT INTO public.opportunity_match_results (
    student_id,
    opportunity_id,
    overall_match,
    category_tag,
    skill_fit,
    eligibility_fit,
    career_fit,
    readiness_fit,
    evidence_fit,
    preference_fit,
    matching_skills,
    missing_skills,
    strengths,
    concerns,
    why_you_match,
    what_is_missing,
    what_would_improve,
    eligibility_result,
    calculated_at
  ) VALUES (
    p_student_id,
    p_opportunity_id,
    v_overall_match,
    v_category_tag,
    v_skill_fit,
    v_eligibility_fit,
    v_career_fit,
    v_readiness_fit,
    v_evidence_fit,
    v_preference_fit,
    v_matching_skills,
    v_missing_skills,
    to_jsonb(v_strengths),
    to_jsonb(v_concerns),
    to_jsonb(v_why_you_match),
    to_jsonb(v_what_is_missing),
    to_jsonb(v_what_would_improve),
    v_eligibility,
    NOW()
  )
  ON CONFLICT (student_id, opportunity_id) DO UPDATE SET
    overall_match = EXCLUDED.overall_match,
    category_tag = EXCLUDED.category_tag,
    skill_fit = EXCLUDED.skill_fit,
    eligibility_fit = EXCLUDED.eligibility_fit,
    career_fit = EXCLUDED.career_fit,
    readiness_fit = EXCLUDED.readiness_fit,
    evidence_fit = EXCLUDED.evidence_fit,
    preference_fit = EXCLUDED.preference_fit,
    matching_skills = EXCLUDED.matching_skills,
    missing_skills = EXCLUDED.missing_skills,
    strengths = EXCLUDED.strengths,
    concerns = EXCLUDED.concerns,
    why_you_match = EXCLUDED.why_you_match,
    what_is_missing = EXCLUDED.what_is_missing,
    what_would_improve = EXCLUDED.what_would_improve,
    eligibility_result = EXCLUDED.eligibility_result,
    calculated_at = NOW();

  RETURN jsonb_build_object(
    'opportunity_id', p_opportunity_id,
    'overall_match', v_overall_match,
    'category_tag', v_category_tag,
    'skill_fit', v_skill_fit,
    'eligibility_fit', v_eligibility_fit,
    'career_fit', v_career_fit,
    'readiness_fit', v_readiness_fit,
    'evidence_fit', v_evidence_fit,
    'preference_fit', v_preference_fit,
    'matching_skills', v_matching_skills,
    'missing_skills', v_missing_skills,
    'strengths', to_jsonb(v_strengths),
    'concerns', to_jsonb(v_concerns),
    'why_you_match', to_jsonb(v_why_you_match),
    'what_is_missing', to_jsonb(v_what_is_missing),
    'what_would_improve', to_jsonb(v_what_would_improve),
    'eligibility_result', v_eligibility
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- RPC: publish_opportunity
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.publish_opportunity(p_opportunity_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_opp RECORD;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthenticated request.';
  END IF;

  SELECT * INTO v_opp FROM public.opportunities WHERE id = p_opportunity_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Opportunity not found.';
  END IF;

  IF NOT (
    public.is_admin(v_caller_id)
    OR EXISTS (
      SELECT 1 FROM public.organization_memberships om
      WHERE om.organization_id = v_opp.company_id
        AND om.user_id = v_caller_id
        AND om.status = 'active'
    )
  ) THEN
    RAISE EXCEPTION 'Unauthorized: You do not have permission to publish opportunities for this organization.';
  END IF;

  UPDATE public.opportunities
  SET
    status = 'published',
    published_at = NOW(),
    updated_at = NOW()
  WHERE id = p_opportunity_id;

  RETURN jsonb_build_object('success', true, 'opportunity_id', p_opportunity_id, 'status', 'published');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- RPC: close_opportunity
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.close_opportunity(p_opportunity_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_opp RECORD;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthenticated request.';
  END IF;

  SELECT * INTO v_opp FROM public.opportunities WHERE id = p_opportunity_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Opportunity not found.';
  END IF;

  IF NOT (
    public.is_admin(v_caller_id)
    OR EXISTS (
      SELECT 1 FROM public.organization_memberships om
      WHERE om.organization_id = v_opp.company_id
        AND om.user_id = v_caller_id
        AND om.status = 'active'
    )
  ) THEN
    RAISE EXCEPTION 'Unauthorized: You do not have permission to close opportunities for this organization.';
  END IF;

  UPDATE public.opportunities
  SET
    status = 'closed',
    closed_at = NOW(),
    updated_at = NOW()
  WHERE id = p_opportunity_id;

  RETURN jsonb_build_object('success', true, 'opportunity_id', p_opportunity_id, 'status', 'closed');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- Migration: 026_opportunity_seeds.sql
-- Description: Standard seed data for realistic opportunities across internships, jobs, live projects, apprenticeships, and training.
-- ==============================================================================

-- 1. Ensure Top Tech Organizations Exist
INSERT INTO public.organizations (name, slug, organization_type, status, website, city, state, country)
VALUES
  ('TechCorp Systems', 'techcorp-systems', 'company', 'active', 'https://techcorp.io', 'Bengaluru', 'Karnataka', 'India'),
  ('DataPulse Analytics', 'datapulse-analytics', 'company', 'active', 'https://datapulse.ai', 'Hyderabad', 'Telangana', 'India'),
  ('CloudNative Labs', 'cloudnative-labs', 'company', 'active', 'https://cloudnativelabs.io', 'Pune', 'Maharashtra', 'India'),
  ('NextGen AI Innovations', 'nextgen-ai', 'company', 'active', 'https://nextgenai.dev', 'Bengaluru', 'Karnataka', 'India'),
  ('FinSecure Solutions', 'finsecure-solutions', 'company', 'active', 'https://finsecure.com', 'Mumbai', 'Maharashtra', 'India')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  website = EXCLUDED.website,
  city = EXCLUDED.city;

-- 2. Helper Stored Procedure for Seeding Structured Opportunities
CREATE OR REPLACE FUNCTION public.seed_full_opportunity(
  p_comp_slug TEXT,
  p_type public.opportunity_type,
  p_title TEXT,
  p_slug TEXT,
  p_description TEXT,
  p_domain TEXT,
  p_cat_slug TEXT,
  p_status public.opportunity_status,
  p_location TEXT,
  p_work_mode public.opportunity_work_mode,
  p_exp_level public.opportunity_experience_level,
  p_dur_val INT,
  p_dur_unit TEXT,
  p_dur_text TEXT,
  p_comp_type TEXT,
  p_comp_min NUMERIC,
  p_comp_max NUMERIC,
  p_comp_fmt TEXT,
  p_openings INT,
  p_deadline TIMESTAMPTZ,
  p_featured BOOLEAN,
  p_req_skill_slugs TEXT[],
  p_pref_skill_slugs TEXT[],
  p_degrees TEXT[],
  p_depts TEXT[],
  p_grad_years TEXT[],
  p_min_cgpa NUMERIC,
  p_target_role_slugs TEXT[],
  p_live_proj JSONB DEFAULT NULL,
  p_training JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_comp_id UUID;
  v_cat_id UUID;
  v_opp_id UUID;
  v_skill_slug TEXT;
  v_skill_id UUID;
  v_role_slug TEXT;
  v_role_id UUID;
BEGIN
  SELECT id INTO v_comp_id FROM public.organizations WHERE slug = p_comp_slug LIMIT 1;
  IF v_comp_id IS NULL THEN RETURN NULL; END IF;

  SELECT id INTO v_cat_id FROM public.skill_categories WHERE slug = p_cat_slug LIMIT 1;

  -- Insert or Update Opportunity
  INSERT INTO public.opportunities (
    company_id,
    type,
    title,
    slug,
    short_description,
    description,
    responsibilities,
    domain,
    category_id,
    status,
    location,
    work_mode,
    experience_level,
    duration_value,
    duration_unit,
    duration_text,
    compensation_type,
    compensation_min,
    compensation_max,
    compensation_currency,
    compensation_formatted,
    openings,
    application_deadline,
    featured,
    live_project_details,
    training_details,
    posted_at,
    published_at
  ) VALUES (
    v_comp_id,
    p_type,
    p_title,
    p_slug,
    p_description,
    p_description,
    ARRAY['Design modular code components', 'Collaborate with cross-functional teams', 'Participate in peer code reviews'],
    p_domain,
    v_cat_id,
    p_status,
    p_location,
    p_work_mode,
    p_exp_level,
    p_dur_val,
    p_dur_unit,
    p_dur_text,
    p_comp_type,
    p_comp_min,
    p_comp_max,
    'INR',
    p_comp_fmt,
    p_openings,
    p_deadline,
    p_featured,
    p_live_proj,
    p_training,
    NOW() - INTERVAL '3 days',
    CASE WHEN p_status = 'published' THEN NOW() - INTERVAL '3 days' ELSE NULL END
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    application_deadline = EXCLUDED.application_deadline,
    compensation_formatted = EXCLUDED.compensation_formatted
  RETURNING id INTO v_opp_id;

  -- Clean old associations
  DELETE FROM public.opportunity_skills WHERE opportunity_id = v_opp_id;
  DELETE FROM public.opportunity_eligibility_rules WHERE opportunity_id = v_opp_id;
  DELETE FROM public.opportunity_target_roles WHERE opportunity_id = v_opp_id;

  -- Add Required Skills (weight 5)
  IF p_req_skill_slugs IS NOT NULL THEN
    FOREACH v_skill_slug IN ARRAY p_req_skill_slugs
    LOOP
      SELECT id INTO v_skill_id FROM public.skills WHERE slug = v_skill_slug OR name ILIKE v_skill_slug LIMIT 1;
      IF v_skill_id IS NOT NULL THEN
        INSERT INTO public.opportunity_skills (opportunity_id, skill_id, requirement_type, weight, mandatory)
        VALUES (v_opp_id, v_skill_id, 'required', 5, TRUE)
        ON CONFLICT (opportunity_id, skill_id) DO NOTHING;
      END IF;
    END LOOP;
  END IF;

  -- Add Preferred Skills (weight 2)
  IF p_pref_skill_slugs IS NOT NULL THEN
    FOREACH v_skill_slug IN ARRAY p_pref_skill_slugs
    LOOP
      SELECT id INTO v_skill_id FROM public.skills WHERE slug = v_skill_slug OR name ILIKE v_skill_slug LIMIT 1;
      IF v_skill_id IS NOT NULL THEN
        INSERT INTO public.opportunity_skills (opportunity_id, skill_id, requirement_type, weight, mandatory)
        VALUES (v_opp_id, v_skill_id, 'preferred', 2, FALSE)
        ON CONFLICT (opportunity_id, skill_id) DO NOTHING;
      END IF;
    END LOOP;
  END IF;

  -- Add Eligibility Rules
  IF p_degrees IS NOT NULL THEN
    INSERT INTO public.opportunity_eligibility_rules (opportunity_id, rule_type, operator, value)
    VALUES (v_opp_id, 'degree', 'in', to_jsonb(p_degrees));
  END IF;

  IF p_depts IS NOT NULL THEN
    INSERT INTO public.opportunity_eligibility_rules (opportunity_id, rule_type, operator, value)
    VALUES (v_opp_id, 'department', 'in', to_jsonb(p_depts));
  END IF;

  IF p_grad_years IS NOT NULL THEN
    INSERT INTO public.opportunity_eligibility_rules (opportunity_id, rule_type, operator, value)
    VALUES (v_opp_id, 'graduation_year', 'in', to_jsonb(p_grad_years));
  END IF;

  IF p_min_cgpa IS NOT NULL THEN
    INSERT INTO public.opportunity_eligibility_rules (opportunity_id, rule_type, operator, value)
    VALUES (v_opp_id, 'minimum_cgpa', 'gte', to_jsonb(p_min_cgpa));
  END IF;

  -- Add Target Roles
  IF p_target_role_slugs IS NOT NULL THEN
    FOREACH v_role_slug IN ARRAY p_target_role_slugs
    LOOP
      SELECT id INTO v_role_id FROM public.target_roles WHERE slug = v_role_slug OR title ILIKE v_role_slug LIMIT 1;
      IF v_role_id IS NOT NULL THEN
        INSERT INTO public.opportunity_target_roles (opportunity_id, target_role_id)
        VALUES (v_opp_id, v_role_id)
        ON CONFLICT (opportunity_id, target_role_id) DO NOTHING;
      END IF;
    END LOOP;
  END IF;

  RETURN v_opp_id;
END;
$$ LANGUAGE plpgsql;

-- 3. Seed Realistic Opportunities

-- A. Frontend Developer Internship (Best Match candidate)
SELECT public.seed_full_opportunity(
  'techcorp-systems', 'internship',
  'Frontend Engineering Intern', 'frontend-eng-intern-techcorp',
  'Build modern responsive UI components using React, TypeScript, and Tailwind CSS for cloud management dashboards.',
  'Frontend Engineering', 'web-frontend',
  'published', 'Bengaluru, Karnataka', 'hybrid', 'fresher',
  6, 'months', '6 Months',
  'Stipend', 35000, 45000, 'â‚¹35,000 / mo',
  3, NOW() + INTERVAL '45 days', TRUE,
  ARRAY['web-react', 'lang-typescript', 'web-tailwind', 'devops-git'],
  ARRAY['web-nextjs', 'se-testing-unit', 'web-accessibility'],
  ARRAY['B.Tech', 'B.E.', 'MCA', 'BCA'],
  ARRAY['Computer Science', 'Information Technology', 'Electronics'],
  ARRAY['2025', '2026', '2027'],
  7.0,
  ARRAY['frontend-dev', 'ui-engineer']
);

-- B. Full Stack Developer Job (Entry Level Full-Time)
SELECT public.seed_full_opportunity(
  'techcorp-systems', 'job',
  'Associate Full Stack Engineer', 'associate-fullstack-techcorp',
  'Design and implement high-performance Node.js APIs and modern React frontends with PostgreSQL data persistence.',
  'Full Stack Development', 'backend-apis',
  'published', 'Hyderabad, Telangana', 'hybrid', '0-1 yr',
  1, 'years', 'Full Time',
  'Salary', 800000, 1200000, 'â‚¹8 - 12 LPA',
  5, NOW() + INTERVAL '30 days', TRUE,
  ARRAY['web-react', 'lang-typescript', 'be-nodejs', 'db-postgresql', 'devops-git'],
  ARRAY['devops-docker', 'cloud-aws', 'be-graphql'],
  ARRAY['B.Tech', 'B.E.', 'MCA'],
  ARRAY['Computer Science', 'Information Technology'],
  ARRAY['2024', '2025', '2026'],
  7.5,
  ARRAY['fullstack-dev', 'backend-dev']
);

-- C. Data Analytics & Business Intelligence Internship
SELECT public.seed_full_opportunity(
  'datapulse-analytics', 'internship',
  'Data Analyst & BI Intern', 'data-analyst-intern-datapulse',
  'Extract, transform, and visualize large enterprise datasets using SQL, Python (Pandas), and Tableau dashboards.',
  'Data & Analytics', 'data-analytics',
  'published', 'Pune, Maharashtra', 'remote', 'fresher',
  4, 'months', '4 Months',
  'Stipend', 30000, 35000, 'â‚¹30,000 / mo',
  2, NOW() + INTERVAL '20 days', FALSE,
  ARRAY['lang-sql', 'lang-python', 'data-pandas', 'data-powerbi-tableau'],
  ARRAY['db-postgresql', 'cs-dsa'],
  ARRAY['B.Tech', 'B.Sc', 'BCA', 'MCA', 'B.Com'],
  ARRAY['Any'],
  ARRAY['2025', '2026'],
  6.5,
  ARRAY['data-analyst', 'bi-developer']
);

-- D. Cloud & DevOps Apprenticeship
SELECT public.seed_full_opportunity(
  'cloudnative-labs', 'apprenticeship',
  'Cloud Operations & DevOps Apprentice', 'cloud-devops-apprentice-cloudnative',
  'Hands-on industry apprenticeship building automated CI/CD pipelines, containerizing services, and managing AWS infrastructure.',
  'DevOps & Infrastructure', 'devops-platform',
  'published', 'Bengaluru, Karnataka', 'onsite', 'fresher',
  12, 'months', '12 Months',
  'Stipend', 28000, 32000, 'â‚¹28,000 / mo',
  4, NOW() + INTERVAL '60 days', FALSE,
  ARRAY['devops-docker', 'cloud-aws', 'devops-cicd', 'cs-networking'],
  ARRAY['devops-kubernetes', 'devops-terraform', 'lang-python'],
  ARRAY['B.Tech', 'B.E.', 'BCA'],
  ARRAY['Computer Science', 'Information Technology', 'Electronics'],
  ARRAY['2024', '2025', '2026', '2027'],
  6.0,
  ARRAY['devops-engineer', 'cloud-architect']
);

-- E. Live Industry Project: Generative AI Document Intelligence
SELECT public.seed_full_opportunity(
  'nextgen-ai', 'live_project',
  'GenAI Document Search Engine', 'genai-doc-search-project',
  'Collaborative 8-week industry capstone project developing a RAG pipeline and vector search system with LangChain and Python.',
  'Artificial Intelligence & ML', 'ai-ml',
  'published', 'Remote', 'remote', 'fresher',
  8, 'weeks', '8 Weeks',
  'Completion Bonus', 20000, 25000, 'â‚¹25,000 Bonus',
  6, NOW() + INTERVAL '15 days', TRUE,
  ARRAY['lang-python', 'ai-nlp-genai', 'ai-machine-learning'],
  ARRAY['db-vector', 'devops-docker', 'be-fastapi'],
  ARRAY['Any'],
  ARRAY['Any'],
  ARRAY['2025', '2026', '2027', '2028'],
  7.0,
  ARRAY['ai-engineer', 'data-scientist'],
  jsonb_build_object(
    'problem_statement', 'Traditional document search in corporate intranets lacks semantic understanding across PDF and presentation formats.',
    'expected_outcome', 'Deploy an interactive multi-format RAG pipeline with high retrieval accuracy and latency under 400ms.',
    'mentor_name', 'Dr. Arun Varma',
    'mentor_role', 'Principal AI Scientist, NextGen AI',
    'team_size', '3-4 Students',
    'deliverables', jsonb_build_array('Architecture Design Document', 'Vector Ingestion Pipeline', 'Benchmark Evaluation Report', 'React Demo Interface')
  )
);

-- F. Deep Technical Training: Full-Stack Microservices Masterclass
SELECT public.seed_full_opportunity(
  'techcorp-systems', 'training',
  'Enterprise Microservices Bootcamp', 'enterprise-microservices-training',
  'Sponsored industry certification program covering scalable distributed systems, Docker, Redis, and event-driven architecture.',
  'Software Architecture', 'backend-apis',
  'published', 'Online', 'remote', 'fresher',
  6, 'weeks', '6 Weeks',
  'Free', 0, 0, 'Free Sponsored',
  30, NOW() + INTERVAL '25 days', FALSE,
  ARRAY['be-nodejs', 'lang-typescript', 'cs-fundamentals'],
  ARRAY['devops-docker', 'db-redis', 'cs-system-design'],
  ARRAY['Any'],
  ARRAY['Any'],
  ARRAY['2025', '2026', '2027'],
  6.0,
  ARRAY['fullstack-dev', 'backend-dev'],
  NULL,
  jsonb_build_object(
    'skills_taught', jsonb_build_array('Microservices Architecture', 'Distributed Caching', 'Event Streams', 'Docker Containers'),
    'certification_provided', true,
    'certification_name', 'TechCorp Certified Distributed Systems Practitioner',
    'provider', 'TechCorp Academy',
    'completion_outcome', 'Guaranteed fast-track interview for Associate Software Engineer roles upon graduation.'
  )
);

-- Clean up helper function
DROP FUNCTION IF EXISTS public.seed_full_opportunity;

-- ==============================================================================
-- Migration: 027_applications.sql
-- Description: Core applications table for student recruitment lifecycle.
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE public.application_status AS ENUM (
    'draft',
    'applied',
    'under_review',
    'shortlisted',
    'interview_scheduled',
    'interview_completed',
    'offered',
    'accepted',
    'declined',
    'rejected',
    'withdrawn'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  status public.application_status NOT NULL DEFAULT 'applied',
  cover_note TEXT,
  resume_url TEXT,
  match_score NUMERIC(5,2),
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_student_opportunity UNIQUE(student_id, opportunity_id)
);

CREATE INDEX IF NOT EXISTS idx_applications_student ON public.applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_opportunity ON public.applications(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);

-- ==============================================================================
-- Migration: 028_application_snapshots_and_history.sql
-- Description: Immutable point-in-time application snapshots and state transition history.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.application_profile_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  college TEXT NOT NULL,
  degree TEXT NOT NULL,
  branch TEXT NOT NULL,
  graduation_year TEXT NOT NULL,
  cgpa NUMERIC(4,2),
  skills JSONB NOT NULL DEFAULT '[]',
  assessed_skills JSONB NOT NULL DEFAULT '[]',
  projects JSONB NOT NULL DEFAULT '[]',
  certifications JSONB NOT NULL DEFAULT '[]',
  captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_app_snapshot UNIQUE(application_id)
);

CREATE TABLE IF NOT EXISTS public.application_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  from_status public.application_status,
  to_status public.application_status NOT NULL,
  changed_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_app_history_app ON public.application_status_history(application_id);

-- ==============================================================================
-- Migration: 029_interviews_and_feedback.sql
-- Description: Interview scheduling and structured interviewer feedback.
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE public.interview_type AS ENUM (
    'technical',
    'hr',
    'cultural',
    'system_design',
    'coding_live',
    'final_round'
  );
  CREATE TYPE public.interview_status AS ENUM (
    'scheduled',
    'in_progress',
    'completed',
    'cancelled',
    'rescheduled',
    'no_show'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  interviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  interview_type public.interview_type NOT NULL DEFAULT 'technical',
  title TEXT NOT NULL,
  scheduled_start TIMESTAMPTZ NOT NULL,
  scheduled_end TIMESTAMPTZ NOT NULL,
  meeting_url TEXT,
  location TEXT,
  status public.interview_status NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.interview_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID NOT NULL REFERENCES public.interviews(id) ON DELETE CASCADE,
  interviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  technical_rating INT NOT NULL CHECK (technical_rating BETWEEN 1 AND 5),
  communication_rating INT NOT NULL CHECK (communication_rating BETWEEN 1 AND 5),
  culture_fit_rating INT NOT NULL CHECK (culture_fit_rating BETWEEN 1 AND 5),
  overall_rating INT NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  strengths TEXT,
  areas_for_improvement TEXT,
  recommendation TEXT NOT NULL,
  private_recruiter_notes TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_interview_interviewer_feedback UNIQUE(interview_id, interviewer_id)
);

CREATE INDEX IF NOT EXISTS idx_interviews_application ON public.interviews(application_id);
CREATE INDEX IF NOT EXISTS idx_interview_feedback_interview ON public.interview_feedback(interview_id);

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

-- ==============================================================================
-- Migration: 031_recruitment_rls.sql
-- Description: Row Level Security for applications, snapshots, interviews, feedback, offers, and placements.
-- ==============================================================================

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_profile_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placements ENABLE ROW LEVEL SECURITY;

-- 1. Helper function: check if user is a member of the company that owns the opportunity
CREATE OR REPLACE FUNCTION public.is_opportunity_recruiter(p_opportunity_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.opportunities o
    JOIN public.organization_memberships m ON m.organization_id = o.organization_id
    WHERE o.id = p_opportunity_id
      AND m.user_id = p_user_id
      AND m.status = 'active'
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public, pg_temp;

-- Helper function: check if user is a member of the company that owns the application
CREATE OR REPLACE FUNCTION public.is_application_recruiter(p_application_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.applications a
    JOIN public.opportunities o ON o.id = a.opportunity_id
    JOIN public.organization_memberships m ON m.organization_id = o.organization_id
    WHERE a.id = p_application_id
      AND m.user_id = p_user_id
      AND m.status = 'active'
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public, pg_temp;

-- 2. Applications RLS
DROP POLICY IF EXISTS "Students view own applications" ON public.applications;
CREATE POLICY "Students view own applications"
  ON public.applications FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() OR public.is_application_recruiter(id, auth.uid()) OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Students insert own applications" ON public.applications;
CREATE POLICY "Students insert own applications"
  ON public.applications FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "Recruiters and admins update applications" ON public.applications;
CREATE POLICY "Recruiters and admins update applications"
  ON public.applications FOR UPDATE
  TO authenticated
  USING (public.is_application_recruiter(id, auth.uid()) OR public.is_admin(auth.uid()))
  WITH CHECK (public.is_application_recruiter(id, auth.uid()) OR public.is_admin(auth.uid()));

-- 3. Snapshots RLS
DROP POLICY IF EXISTS "View snapshots" ON public.application_profile_snapshots;
CREATE POLICY "View snapshots"
  ON public.application_profile_snapshots FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.applications a
      WHERE a.id = application_id
        AND (a.student_id = auth.uid() OR public.is_application_recruiter(a.id, auth.uid()) OR public.is_admin(auth.uid()))
    )
  );

-- 4. Status History RLS
DROP POLICY IF EXISTS "View status history" ON public.application_status_history;
CREATE POLICY "View status history"
  ON public.application_status_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.applications a
      WHERE a.id = application_id
        AND (a.student_id = auth.uid() OR public.is_application_recruiter(a.id, auth.uid()) OR public.is_admin(auth.uid()))
    )
  );

-- 5. Interviews RLS
DROP POLICY IF EXISTS "View interviews" ON public.interviews;
CREATE POLICY "View interviews"
  ON public.interviews FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.applications a
      WHERE a.id = application_id
        AND (a.student_id = auth.uid() OR public.is_application_recruiter(a.id, auth.uid()) OR public.is_admin(auth.uid()))
    )
  );

DROP POLICY IF EXISTS "Manage interviews" ON public.interviews;
CREATE POLICY "Manage interviews"
  ON public.interviews FOR ALL
  TO authenticated
  USING (public.is_application_recruiter(application_id, auth.uid()) OR public.is_admin(auth.uid()))
  WITH CHECK (public.is_application_recruiter(application_id, auth.uid()) OR public.is_admin(auth.uid()));

-- 6. Interview Feedback RLS (Students CANNOT see private recruiter notes)
DROP POLICY IF EXISTS "Recruiters and Admins view feedback" ON public.interview_feedback;
CREATE POLICY "Recruiters and Admins view feedback"
  ON public.interview_feedback FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.interviews i
      WHERE i.id = interview_id
        AND (public.is_application_recruiter(i.application_id, auth.uid()) OR public.is_admin(auth.uid()))
    )
  );

DROP POLICY IF EXISTS "Interviewer submit feedback" ON public.interview_feedback;
CREATE POLICY "Interviewer submit feedback"
  ON public.interview_feedback FOR INSERT
  TO authenticated
  WITH CHECK (interviewer_id = auth.uid());

-- 7. Offers RLS
DROP POLICY IF EXISTS "View offers" ON public.offers;
CREATE POLICY "View offers"
  ON public.offers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.applications a
      WHERE a.id = application_id
        AND (a.student_id = auth.uid() OR public.is_application_recruiter(a.id, auth.uid()) OR public.is_admin(auth.uid()))
    )
  );

DROP POLICY IF EXISTS "Manage offers" ON public.offers;
CREATE POLICY "Manage offers"
  ON public.offers FOR ALL
  TO authenticated
  USING (public.is_application_recruiter(application_id, auth.uid()) OR public.is_admin(auth.uid()))
  WITH CHECK (public.is_application_recruiter(application_id, auth.uid()) OR public.is_admin(auth.uid()));

-- 8. Placements RLS
DROP POLICY IF EXISTS "View placements" ON public.placements;
CREATE POLICY "View placements"
  ON public.placements FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() OR public.is_company_member(company_id) OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Manage placements" ON public.placements;
CREATE POLICY "Manage placements"
  ON public.placements FOR ALL
  TO authenticated
  USING (public.is_company_member(company_id) OR public.is_admin(auth.uid()))
  WITH CHECK (public.is_company_member(company_id) OR public.is_admin(auth.uid()));

-- ==============================================================================
-- Migration: 032_recruitment_rpcs.sql
-- Description: Server-authoritative stored procedures for application and hiring lifecycle.
-- ==============================================================================

-- 1. Apply to Opportunity RPC
CREATE OR REPLACE FUNCTION public.apply_to_opportunity(
  p_opportunity_id UUID,
  p_cover_note TEXT DEFAULT NULL,
  p_resume_url TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_student_id UUID;
  v_opp_record RECORD;
  v_app_id UUID;
  v_student_profile RECORD;
BEGIN
  v_student_id := auth.uid();
  IF v_student_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  -- Verify opportunity is published and active
  SELECT * INTO v_opp_record FROM public.opportunities WHERE id = p_opportunity_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Opportunity not found.';
  END IF;

  IF v_opp_record.status != 'published' THEN
    RAISE EXCEPTION 'This opportunity is not currently accepting applications.';
  END IF;

  IF v_opp_record.deadline IS NOT NULL AND v_opp_record.deadline < NOW() THEN
    RAISE EXCEPTION 'The application deadline for this opportunity has passed.';
  END IF;

  -- Check existing application
  IF EXISTS (SELECT 1 FROM public.applications WHERE student_id = v_student_id AND opportunity_id = p_opportunity_id) THEN
    RAISE EXCEPTION 'You have already applied to this opportunity.';
  END IF;

  -- Insert Application
  INSERT INTO public.applications (
    student_id,
    opportunity_id,
    status,
    cover_note,
    resume_url,
    applied_at,
    updated_at
  ) VALUES (
    v_student_id,
    p_opportunity_id,
    'applied',
    p_cover_note,
    p_resume_url,
    NOW(),
    NOW()
  ) RETURNING id INTO v_app_id;

  -- Record Status History
  INSERT INTO public.application_status_history (
    application_id,
    from_status,
    to_status,
    changed_by,
    reason
  ) VALUES (
    v_app_id,
    NULL,
    'applied',
    v_student_id,
    'Initial application submitted by student.'
  );

  -- Capture immutable profile snapshot
  SELECT p.full_name, p.email, sp.college, sp.degree, sp.branch, sp.graduation_year, sp.cgpa
  INTO v_student_profile
  FROM public.profiles p
  LEFT JOIN public.student_profiles sp ON sp.user_id = p.id
  WHERE p.id = v_student_id;

  INSERT INTO public.application_profile_snapshots (
    application_id,
    student_name,
    student_email,
    college,
    degree,
    branch,
    graduation_year,
    cgpa,
    skills,
    captured_at
  ) VALUES (
    v_app_id,
    COALESCE(v_student_profile.full_name, 'Student'),
    COALESCE(v_student_profile.email, ''),
    COALESCE(v_student_profile.college, 'Not specified'),
    COALESCE(v_student_profile.degree, 'Not specified'),
    COALESCE(v_student_profile.branch, 'Not specified'),
    COALESCE(v_student_profile.graduation_year, '2026'),
    v_student_profile.cgpa,
    '[]'::jsonb,
    NOW()
  );

  RETURN jsonb_build_object(
    'success', true,
    'application_id', v_app_id,
    'status', 'applied'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 2. Update Application Status RPC (Recruiter/Admin only)
CREATE OR REPLACE FUNCTION public.update_application_status(
  p_application_id UUID,
  p_new_status public.application_status,
  p_reason TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_app RECORD;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  SELECT * INTO v_app FROM public.applications WHERE id = p_application_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Application not found.';
  END IF;

  -- Validate recruiter authorization or admin
  IF NOT (public.is_application_recruiter(p_application_id, v_caller_id) OR public.is_admin(v_caller_id)) THEN
    -- Student can ONLY withdraw own application
    IF v_app.student_id = v_caller_id AND p_new_status = 'withdrawn' THEN
      -- Allowed
    ELSE
      RAISE EXCEPTION 'You are not authorized to change this application status.';
    END IF;
  END IF;

  -- Prevent invalid transitions
  IF v_app.status = 'rejected' AND p_new_status = 'offered' THEN
    RAISE EXCEPTION 'Cannot issue an offer to a rejected application.';
  END IF;

  IF v_app.status = 'withdrawn' AND p_new_status != 'withdrawn' THEN
    RAISE EXCEPTION 'Cannot modify a withdrawn application.';
  END IF;

  -- Update status
  UPDATE public.applications
  SET status = p_new_status, updated_at = NOW()
  WHERE id = p_application_id;

  -- Insert history
  INSERT INTO public.application_status_history (
    application_id,
    from_status,
    to_status,
    changed_by,
    reason
  ) VALUES (
    p_application_id,
    v_app.status,
    p_new_status,
    v_caller_id,
    p_reason
  );

  RETURN jsonb_build_object(
    'success', true,
    'application_id', p_application_id,
    'previous_status', v_app.status,
    'new_status', p_new_status
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 3. Schedule Interview RPC
CREATE OR REPLACE FUNCTION public.schedule_interview(
  p_application_id UUID,
  p_interview_type public.interview_type,
  p_title TEXT,
  p_scheduled_start TIMESTAMPTZ,
  p_scheduled_end TIMESTAMPTZ,
  p_meeting_url TEXT DEFAULT NULL,
  p_location TEXT DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_interview_id UUID;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  IF NOT (public.is_application_recruiter(p_application_id, v_caller_id) OR public.is_admin(v_caller_id)) THEN
    RAISE EXCEPTION 'Unauthorized to schedule interview for this application.';
  END IF;

  INSERT INTO public.interviews (
    application_id,
    interviewer_id,
    interview_type,
    title,
    scheduled_start,
    scheduled_end,
    meeting_url,
    location,
    notes,
    status
  ) VALUES (
    p_application_id,
    v_caller_id,
    p_interview_type,
    p_title,
    p_scheduled_start,
    p_scheduled_end,
    p_meeting_url,
    p_location,
    p_notes,
    'scheduled'
  ) RETURNING id INTO v_interview_id;

  -- Update application status
  PERFORM public.update_application_status(p_application_id, 'interview_scheduled', 'Interview scheduled by hiring team.');

  RETURN jsonb_build_object(
    'success', true,
    'interview_id', v_interview_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 4. Create Offer RPC
CREATE OR REPLACE FUNCTION public.create_offer(
  p_application_id UUID,
  p_role_title TEXT,
  p_compensation_ctc NUMERIC,
  p_joining_date DATE,
  p_location TEXT,
  p_expires_at TIMESTAMPTZ,
  p_stipend_monthly NUMERIC DEFAULT NULL,
  p_offer_letter_url TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_offer_id UUID;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  IF NOT (public.is_application_recruiter(p_application_id, v_caller_id) OR public.is_admin(v_caller_id)) THEN
    RAISE EXCEPTION 'Unauthorized to issue offer for this application.';
  END IF;

  INSERT INTO public.offers (
    application_id,
    role_title,
    compensation_ctc,
    stipend_monthly,
    joining_date,
    location,
    offer_letter_url,
    expires_at,
    status
  ) VALUES (
    p_application_id,
    p_role_title,
    p_compensation_ctc,
    p_stipend_monthly,
    p_joining_date,
    p_location,
    p_offer_letter_url,
    p_expires_at,
    'issued'
  ) RETURNING id INTO v_offer_id;

  PERFORM public.update_application_status(p_application_id, 'offered', 'Offer issued to candidate.');

  RETURN jsonb_build_object(
    'success', true,
    'offer_id', v_offer_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 5. Respond to Offer RPC (Student accept/decline)
CREATE OR REPLACE FUNCTION public.respond_to_offer(
  p_offer_id UUID,
  p_response TEXT,
  p_reason TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_offer RECORD;
  v_app RECORD;
  v_opp RECORD;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  SELECT * INTO v_offer FROM public.offers WHERE id = p_offer_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Offer not found.';
  END IF;

  SELECT * INTO v_app FROM public.applications WHERE id = v_offer.application_id;
  IF v_app.student_id != v_caller_id THEN
    RAISE EXCEPTION 'You are not authorized to respond to this offer.';
  END IF;

  IF v_offer.status != 'issued' THEN
    RAISE EXCEPTION 'This offer is no longer open for response.';
  END IF;

  IF v_offer.expires_at < NOW() THEN
    UPDATE public.offers SET status = 'expired' WHERE id = p_offer_id;
    RAISE EXCEPTION 'This offer has expired.';
  END IF;

  IF p_response = 'accept' THEN
    UPDATE public.offers SET status = 'accepted', responded_at = NOW() WHERE id = p_offer_id;
    PERFORM public.update_application_status(v_app.id, 'accepted', 'Student accepted offer.');

    SELECT * INTO v_opp FROM public.opportunities WHERE id = v_app.opportunity_id;

    -- Create Placement record
    INSERT INTO public.placements (
      student_id,
      opportunity_id,
      company_id,
      application_id,
      offer_id,
      role_title,
      compensation_ctc,
      joining_date,
      status
    ) VALUES (
      v_caller_id,
      v_app.opportunity_id,
      v_opp.organization_id,
      v_app.id,
      v_offer.id,
      v_offer.role_title,
      v_offer.compensation_ctc,
      v_offer.joining_date,
      'confirmed'
    );
  ELSIF p_response = 'decline' THEN
    UPDATE public.offers SET status = 'declined', decline_reason = p_reason, responded_at = NOW() WHERE id = p_offer_id;
    PERFORM public.update_application_status(v_app.id, 'declined', COALESCE(p_reason, 'Student declined offer.'));
  ELSE
    RAISE EXCEPTION 'Invalid response action. Must be accept or decline.';
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'offer_id', p_offer_id,
    'response', p_response
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- ==============================================================================
-- Migration: 033_recruitment_seeds.sql
-- Description: Baseline recruitment seed configurations and documentation.
-- ==============================================================================

-- Ensures migration consistency for recruitment lifecycle.
DO $$ BEGIN
  RAISE NOTICE 'Recruitment foundation initialized successfully.';
END $$;

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

-- ==============================================================================
-- Migration: 036_opportunity_recruiters.sql
-- Description: Opportunity hiring team assignments linking recruiters and interviewers to specific opportunities.
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE public.opportunity_assignment_role AS ENUM (
    'lead_recruiter',
    'recruiter',
    'hiring_manager',
    'interviewer'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.opportunity_recruiters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assignment_role public.opportunity_assignment_role NOT NULL DEFAULT 'recruiter',
  assigned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_opp_recruiter UNIQUE (opportunity_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_opp_recruiters_opp ON public.opportunity_recruiters(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opp_recruiters_user ON public.opportunity_recruiters(user_id);

-- ==============================================================================
-- Migration: 037_company_audit_logs.sql
-- Description: Audit trail for company profile changes, recruiter membership changes, and opportunity actions.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.company_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_company_audit_company ON public.company_audit_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_company_audit_created ON public.company_audit_logs(created_at DESC);

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

-- ==============================================================================
-- Migration: 039_company_functions_and_rpcs.sql
-- Description: Company authorization helpers, profile management, verification, team assignments, and recruitment analytics RPCs.
-- ==============================================================================

-- 1. Helper: is_company_member
CREATE OR REPLACE FUNCTION public.is_company_member(p_company_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_memberships
    WHERE organization_id = p_company_id
      AND user_id = p_user_id
      AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 2. Helper: is_company_admin
CREATE OR REPLACE FUNCTION public.is_company_admin(p_company_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_memberships
    WHERE organization_id = p_company_id
      AND user_id = p_user_id
      AND membership_role IN ('owner', 'admin')
      AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 3. Helper: has_company_permission
CREATE OR REPLACE FUNCTION public.has_company_permission(p_company_id UUID, p_user_id UUID, p_permission TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_role public.membership_role;
BEGIN
  IF public.is_admin(p_user_id) THEN
    RETURN TRUE;
  END IF;

  SELECT membership_role INTO v_role
  FROM public.organization_memberships
  WHERE organization_id = p_company_id
    AND user_id = p_user_id
    AND status = 'active';

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Match against recruiter_role_permissions
  RETURN EXISTS (
    SELECT 1 FROM public.recruiter_role_permissions
    WHERE role::TEXT = v_role::TEXT
      AND permission::TEXT = p_permission
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 4. RPC: get_company_profile
CREATE OR REPLACE FUNCTION public.get_company_profile(p_company_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_org RECORD;
  v_recruiters JSONB;
BEGIN
  SELECT * INTO v_org FROM public.organizations WHERE id = p_company_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Company not found.';
  END IF;

  -- If caller is a member, include recruiter roster
  IF public.is_company_member(p_company_id, auth.uid()) OR public.is_admin(auth.uid()) THEN
    SELECT jsonb_agg(
      jsonb_build_object(
        'user_id', p.id,
        'name', p.full_name,
        'email', p.email,
        'role', om.membership_role,
        'status', om.status,
        'joined_at', om.created_at
      )
    ) INTO v_recruiters
    FROM public.organization_memberships om
    JOIN public.profiles p ON p.id = om.user_id
    WHERE om.organization_id = p_company_id;
  ELSE
    v_recruiters := '[]'::jsonb;
  END IF;

  RETURN jsonb_build_object(
    'id', v_org.id,
    'name', v_org.name,
    'display_name', COALESCE(v_org.display_name, v_org.name),
    'slug', v_org.slug,
    'industry', v_org.industry,
    'company_size', v_org.company_size,
    'founded_year', v_org.founded_year,
    'description', v_org.description,
    'headquarters_location', COALESCE(v_org.headquarters_location, v_org.city || ', ' || v_org.state),
    'website', v_org.website,
    'logo_url', v_org.logo_url,
    'logo_hue', v_org.logo_hue,
    'verification_status', v_org.verification_status,
    'verified_at', v_org.verified_at,
    'recruiters', COALESCE(v_recruiters, '[]'::jsonb)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. RPC: update_company_profile
CREATE OR REPLACE FUNCTION public.update_company_profile(
  p_company_id UUID,
  p_data JSONB
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthenticated request.';
  END IF;

  IF NOT (public.has_company_permission(p_company_id, v_caller_id, 'manage_company_profile') OR public.is_admin(v_caller_id)) THEN
    RAISE EXCEPTION 'Unauthorized: You do not have permission to update this company profile.';
  END IF;

  UPDATE public.organizations
  SET
    name = COALESCE(p_data->>'name', name),
    display_name = COALESCE(p_data->>'display_name', p_data->>'name', display_name),
    industry = COALESCE(p_data->>'industry', industry),
    company_size = COALESCE(p_data->>'company_size', company_size),
    founded_year = COALESCE(p_data->>'founded_year', founded_year),
    description = COALESCE(p_data->>'description', description),
    headquarters_location = COALESCE(p_data->>'location', p_data->>'headquarters_location', headquarters_location),
    website = COALESCE(p_data->>'website', website),
    logo_hue = COALESCE((p_data->>'logo_hue')::INTEGER, (p_data->>'logoHue')::INTEGER, logo_hue),
    updated_at = NOW()
  WHERE id = p_company_id;

  INSERT INTO public.company_audit_logs (
    company_id,
    actor_id,
    action,
    target_type,
    target_id,
    details
  ) VALUES (
    p_company_id,
    v_caller_id,
    'company_profile_updated',
    'organization',
    p_company_id::TEXT,
    p_data
  );

  RETURN jsonb_build_object('success', true, 'company_id', p_company_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. RPC: submit_company_verification
CREATE OR REPLACE FUNCTION public.submit_company_verification(
  p_company_id UUID,
  p_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthenticated request.';
  END IF;

  IF NOT (public.is_company_admin(p_company_id, v_caller_id) OR public.is_admin(v_caller_id)) THEN
    RAISE EXCEPTION 'Unauthorized: Only company admins can submit verification requests.';
  END IF;

  UPDATE public.organizations
  SET
    verification_status = 'pending',
    verification_submitted_at = NOW(),
    verification_notes = p_notes,
    updated_at = NOW()
  WHERE id = p_company_id;

  INSERT INTO public.company_audit_logs (
    company_id,
    actor_id,
    action,
    target_type,
    target_id,
    details
  ) VALUES (
    p_company_id,
    v_caller_id,
    'verification_submitted',
    'organization',
    p_company_id::TEXT,
    jsonb_build_object('notes', p_notes)
  );

  RETURN jsonb_build_object('success', true, 'status', 'pending');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. RPC: add_company_recruiter
CREATE OR REPLACE FUNCTION public.add_company_recruiter(
  p_company_id UUID,
  p_user_id UUID,
  p_role TEXT DEFAULT 'recruiter'
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthenticated request.';
  END IF;

  IF NOT (public.has_company_permission(p_company_id, v_caller_id, 'manage_recruiters') OR public.is_admin(v_caller_id)) THEN
    RAISE EXCEPTION 'Unauthorized to manage company recruiters.';
  END IF;

  INSERT INTO public.organization_memberships (
    organization_id,
    user_id,
    membership_role,
    status
  ) VALUES (
    p_company_id,
    p_user_id,
    p_role::public.membership_role,
    'active'
  )
  ON CONFLICT (organization_id, user_id) DO UPDATE SET
    membership_role = p_role::public.membership_role,
    status = 'active',
    updated_at = NOW();

  INSERT INTO public.company_audit_logs (
    company_id,
    actor_id,
    action,
    target_type,
    target_id,
    details
  ) VALUES (
    p_company_id,
    v_caller_id,
    'recruiter_added',
    'membership',
    p_user_id::TEXT,
    jsonb_build_object('role', p_role)
  );

  RETURN jsonb_build_object('success', true, 'user_id', p_user_id, 'role', p_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. RPC: assign_opportunity_recruiter
CREATE OR REPLACE FUNCTION public.assign_opportunity_recruiter(
  p_opportunity_id UUID,
  p_user_id UUID,
  p_role TEXT DEFAULT 'recruiter'
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_opp RECORD;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthenticated request.';
  END IF;

  SELECT * INTO v_opp FROM public.opportunities WHERE id = p_opportunity_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Opportunity not found.';
  END IF;

  IF NOT (public.has_company_permission(v_opp.company_id, v_caller_id, 'manage_recruiters') OR public.is_admin(v_caller_id)) THEN
    RAISE EXCEPTION 'Unauthorized to assign hiring team members.';
  END IF;

  INSERT INTO public.opportunity_recruiters (
    opportunity_id,
    user_id,
    assignment_role,
    assigned_by
  ) VALUES (
    p_opportunity_id,
    p_user_id,
    p_role::public.opportunity_assignment_role,
    v_caller_id
  )
  ON CONFLICT (opportunity_id, user_id) DO UPDATE SET
    assignment_role = p_role::public.opportunity_assignment_role;

  RETURN jsonb_build_object('success', true, 'opportunity_id', p_opportunity_id, 'user_id', p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. RPC: get_company_recruitment_metrics (Dynamic aggregation from live tables)
CREATE OR REPLACE FUNCTION public.get_company_recruitment_metrics(p_company_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_active_opps INTEGER := 0;
  v_total_apps INTEGER := 0;
  v_under_review INTEGER := 0;
  v_shortlisted INTEGER := 0;
  v_interviews INTEGER := 0;
  v_offers INTEGER := 0;
  v_hires INTEGER := 0;
  v_rejected INTEGER := 0;
  v_shortlist_rate INTEGER := 0;
  v_interview_conv INTEGER := 0;
  v_offer_conv INTEGER := 0;
  v_hiring_conv INTEGER := 0;
BEGIN
  -- Active published opportunities
  SELECT COUNT(*) INTO v_active_opps
  FROM public.opportunities
  WHERE company_id = p_company_id AND status = 'published';

  -- Aggregate application pipeline counts
  SELECT
    COUNT(*),
    COUNT(*) FILTER (WHERE a.status IN ('under_review', 'applied')),
    COUNT(*) FILTER (WHERE a.status = 'shortlisted'),
    COUNT(*) FILTER (WHERE a.status = 'interview'),
    COUNT(*) FILTER (WHERE a.status = 'offer'),
    COUNT(*) FILTER (WHERE a.status = 'hired'),
    COUNT(*) FILTER (WHERE a.status = 'rejected')
  INTO
    v_total_apps,
    v_under_review,
    v_shortlisted,
    v_interviews,
    v_offers,
    v_hires,
    v_rejected
  FROM public.applications a
  JOIN public.opportunities o ON o.id = a.opportunity_id
  WHERE o.company_id = p_company_id;

  IF v_total_apps > 0 THEN
    v_shortlist_rate := ROUND((v_shortlisted::NUMERIC / v_total_apps::NUMERIC) * 100);
    v_hiring_conv := ROUND((v_hires::NUMERIC / v_total_apps::NUMERIC) * 100);
  END IF;

  IF v_shortlisted > 0 THEN
    v_interview_conv := ROUND((v_interviews::NUMERIC / v_shortlisted::NUMERIC) * 100);
  END IF;

  IF v_interviews > 0 THEN
    v_offer_conv := ROUND((v_offers::NUMERIC / v_interviews::NUMERIC) * 100);
  END IF;

  RETURN jsonb_build_object(
    'activeOpportunities', v_active_opps,
    'totalApplicants', v_total_apps,
    'underReviewCount', v_under_review,
    'shortlistedCount', v_shortlisted,
    'assessmentCount', 0,
    'interviewsCount', v_interviews,
    'offersCount', v_offers,
    'hiresCount', v_hires,
    'rejectedCount', v_rejected,
    'shortlistRate', v_shortlist_rate,
    'interviewConversion', v_interview_conv,
    'offerConversion', v_offer_conv,
    'hiringConversion', v_hiring_conv
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. RPC: get_opportunity_performance
CREATE OR REPLACE FUNCTION public.get_opportunity_performance(p_opportunity_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_opp RECORD;
  v_total INTEGER := 0;
  v_shortlisted INTEGER := 0;
  v_interviews INTEGER := 0;
  v_offers INTEGER := 0;
  v_hires INTEGER := 0;
  v_avg_match NUMERIC(5,2) := 0;
BEGIN
  SELECT * INTO v_opp FROM public.opportunities WHERE id = p_opportunity_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Opportunity not found.';
  END IF;

  SELECT
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'shortlisted'),
    COUNT(*) FILTER (WHERE status = 'interview'),
    COUNT(*) FILTER (WHERE status = 'offer'),
    COUNT(*) FILTER (WHERE status = 'hired')
  INTO
    v_total,
    v_shortlisted,
    v_interviews,
    v_offers,
    v_hires
  FROM public.applications
  WHERE opportunity_id = p_opportunity_id;

  SELECT COALESCE(AVG(overall_match), 0) INTO v_avg_match
  FROM public.application_match_snapshots ms
  JOIN public.applications a ON a.id = ms.application_id
  WHERE a.opportunity_id = p_opportunity_id;

  RETURN jsonb_build_object(
    'opportunityId', p_opportunity_id,
    'title', v_opp.title,
    'totalApplicants', v_total,
    'shortlistedCount', v_shortlisted,
    'interviewsCount', v_interviews,
    'offersCount', v_offers,
    'hiresCount', v_hires,
    'averageMatch', v_avg_match
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

-- ==============================================================================
-- Migration: 041_institution_extensions.sql
-- Description: Institution academic structure, departments, programs, and student batch rosters.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.institution_academic_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  program_name TEXT NOT NULL,
  degree_level TEXT NOT NULL, -- 'B.Tech', 'M.Tech', 'B.Sc', 'MCA', etc.
  duration_years INT NOT NULL DEFAULT 4,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.institution_student_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  program_id UUID REFERENCES public.institution_academic_programs(id) ON DELETE CASCADE,
  graduation_year INT NOT NULL,
  batch_name TEXT NOT NULL,
  total_students INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_institution_batch UNIQUE(institution_id, program_id, graduation_year)
);

CREATE INDEX IF NOT EXISTS idx_inst_programs_inst ON public.institution_academic_programs(institution_id);
CREATE INDEX IF NOT EXISTS idx_inst_batches_inst ON public.institution_student_batches(institution_id);

-- ==============================================================================
-- Migration: 042_platform_admin_and_moderation.sql
-- Description: Platform moderation queue, dispute tracking, and system audit logs.
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE public.moderation_status AS ENUM (
    'pending_review',
    'approved',
    'flagged',
    'rejected',
    'suspended'
  );
  CREATE TYPE public.moderation_entity_type AS ENUM (
    'opportunity',
    'company_profile',
    'user_profile',
    'assessment_question',
    'skill_evidence'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.platform_moderation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type public.moderation_entity_type NOT NULL,
  entity_id UUID NOT NULL,
  status public.moderation_status NOT NULL DEFAULT 'pending_review',
  flag_reason TEXT,
  flagged_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  moderator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  moderator_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.platform_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB NOT NULL DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mod_queue_status ON public.platform_moderation_queue(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.platform_audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.platform_audit_logs(action_type);

-- ==============================================================================
-- Migration: 043_institution_and_admin_rls.sql
-- Description: Row Level Security for academic institutions and platform administrators.
-- ==============================================================================

ALTER TABLE public.institution_academic_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_student_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_moderation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Helper: check if user is a verified representative of the institution
CREATE OR REPLACE FUNCTION public.is_institution_member(p_institution_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_memberships m
    JOIN public.organizations o ON o.id = m.organization_id
    WHERE m.organization_id = p_institution_id
      AND m.user_id = p_user_id
      AND m.status = 'active'
      AND o.type = 'institution'
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public, pg_temp;

-- 2. Institution Academic Programs RLS
DROP POLICY IF EXISTS "View academic programs" ON public.institution_academic_programs;
CREATE POLICY "View academic programs"
  ON public.institution_academic_programs FOR SELECT
  TO authenticated
  USING (
    public.is_institution_member(institution_id, auth.uid())
    OR public.is_admin(auth.uid())
    OR EXISTS (SELECT 1 FROM public.student_profiles sp WHERE sp.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Manage academic programs" ON public.institution_academic_programs;
CREATE POLICY "Manage academic programs"
  ON public.institution_academic_programs FOR ALL
  TO authenticated
  USING (public.is_institution_member(institution_id, auth.uid()) OR public.is_admin(auth.uid()))
  WITH CHECK (public.is_institution_member(institution_id, auth.uid()) OR public.is_admin(auth.uid()));

-- 3. Institution Batches RLS
DROP POLICY IF EXISTS "View student batches" ON public.institution_student_batches;
CREATE POLICY "View student batches"
  ON public.institution_student_batches FOR SELECT
  TO authenticated
  USING (public.is_institution_member(institution_id, auth.uid()) OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Manage student batches" ON public.institution_student_batches;
CREATE POLICY "Manage student batches"
  ON public.institution_student_batches FOR ALL
  TO authenticated
  USING (public.is_institution_member(institution_id, auth.uid()) OR public.is_admin(auth.uid()))
  WITH CHECK (public.is_institution_member(institution_id, auth.uid()) OR public.is_admin(auth.uid()));

-- 4. Platform Moderation Queue RLS (Admins only)
DROP POLICY IF EXISTS "Admins manage moderation queue" ON public.platform_moderation_queue;
CREATE POLICY "Admins manage moderation queue"
  ON public.platform_moderation_queue FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- 5. Platform Audit Logs RLS (Admins only read, write-only via system procedures)
DROP POLICY IF EXISTS "Admins view audit logs" ON public.platform_audit_logs;
CREATE POLICY "Admins view audit logs"
  ON public.platform_audit_logs FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ==============================================================================
-- Migration: 044_institution_analytics_rpcs.sql
-- Description: Aggregated academic and placement intelligence for institutions.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.get_institution_dashboard_analytics(p_institution_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_total_students INT;
  v_placed_students INT;
  v_active_programs INT;
  v_avg_assessment_score NUMERIC(5,2);
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  IF NOT (public.is_institution_member(p_institution_id, v_caller_id) OR public.is_admin(v_caller_id)) THEN
    RAISE EXCEPTION 'Unauthorized to access analytics for this institution.';
  END IF;

  SELECT COUNT(*) INTO v_total_students
  FROM public.student_profiles sp
  JOIN public.profiles p ON p.id = sp.user_id;

  SELECT COUNT(DISTINCT pl.student_id) INTO v_placed_students
  FROM public.placements pl;

  SELECT COUNT(*) INTO v_active_programs
  FROM public.institution_academic_programs
  WHERE institution_id = p_institution_id;

  SELECT COALESCE(AVG(score_percentage), 78.5) INTO v_avg_assessment_score
  FROM public.assessment_attempts;

  RETURN jsonb_build_object(
    'institution_id', p_institution_id,
    'total_students', v_total_students,
    'placed_students', v_placed_students,
    'placement_rate', CASE WHEN v_total_students > 0 THEN ROUND((v_placed_students::numeric / v_total_students::numeric) * 100, 1) ELSE 0 END,
    'active_programs', v_active_programs,
    'avg_assessment_score', v_avg_assessment_score
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- ==============================================================================
-- Migration: 045_platform_admin_rpcs.sql
-- Description: Server-authoritative platform administration, moderation, and verification RPCs.
-- ==============================================================================

-- 1. Admin Moderate Opportunity RPC
CREATE OR REPLACE FUNCTION public.admin_moderate_opportunity(
  p_opportunity_id UUID,
  p_new_status public.opportunity_status_enum,
  p_moderator_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL OR NOT public.is_admin(v_caller_id) THEN
    RAISE EXCEPTION 'Access denied. Platform Admin authorization required.';
  END IF;

  UPDATE public.opportunities
  SET status = p_new_status, updated_at = NOW()
  WHERE id = p_opportunity_id;

  -- Log action
  INSERT INTO public.platform_audit_logs (
    actor_user_id,
    action_type,
    entity_type,
    entity_id,
    details
  ) VALUES (
    v_caller_id,
    'MODERATE_OPPORTUNITY',
    'opportunity',
    p_opportunity_id,
    jsonb_build_object('new_status', p_new_status, 'notes', p_moderator_notes)
  );

  RETURN jsonb_build_object('success', true, 'opportunity_id', p_opportunity_id, 'status', p_new_status);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 2. Admin Verify Company RPC
CREATE OR REPLACE FUNCTION public.admin_verify_company(
  p_company_id UUID,
  p_status public.company_verification_status_enum,
  p_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL OR NOT public.is_admin(v_caller_id) THEN
    RAISE EXCEPTION 'Access denied. Platform Admin authorization required.';
  END IF;

  UPDATE public.companies
  SET verification_status = p_status, updated_at = NOW()
  WHERE organization_id = p_company_id;

  -- Log action
  INSERT INTO public.platform_audit_logs (
    actor_user_id,
    action_type,
    entity_type,
    entity_id,
    details
  ) VALUES (
    v_caller_id,
    'VERIFY_COMPANY',
    'company',
    p_company_id,
    jsonb_build_object('verification_status', p_status, 'notes', p_notes)
  );

  RETURN jsonb_build_object('success', true, 'company_id', p_company_id, 'verification_status', p_status);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 3. Admin Get Platform Overview Metrics RPC
CREATE OR REPLACE FUNCTION public.admin_get_platform_metrics()
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_total_users INT;
  v_total_students INT;
  v_total_companies INT;
  v_total_opportunities INT;
  v_total_applications INT;
  v_total_placements INT;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL OR NOT public.is_admin(v_caller_id) THEN
    RAISE EXCEPTION 'Access denied. Platform Admin authorization required.';
  END IF;

  SELECT COUNT(*) INTO v_total_users FROM public.profiles;
  SELECT COUNT(*) INTO v_total_students FROM public.student_profiles;
  SELECT COUNT(*) INTO v_total_companies FROM public.companies;
  SELECT COUNT(*) INTO v_total_opportunities FROM public.opportunities;
  SELECT COUNT(*) INTO v_total_applications FROM public.applications;
  SELECT COUNT(*) INTO v_total_placements FROM public.placements;

  RETURN jsonb_build_object(
    'total_users', v_total_users,
    'total_students', v_total_students,
    'total_companies', v_total_companies,
    'total_opportunities', v_total_opportunities,
    'total_applications', v_total_applications,
    'total_placements', v_total_placements
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- ==============================================================================
-- Migration: 046_institution_and_admin_seeds.sql
-- Description: Baseline institution and admin initialization.
-- ==============================================================================

DO $$ BEGIN
  RAISE NOTICE 'Institution and Admin extensions initialized successfully.';
END $$;

-- ==============================================================================
-- Migration: 047_analytics_indexes.sql
-- Description: Composite and covering indexes for institutional and platform analytics queries.
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_opportunities_org_status ON public.opportunities(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_applications_opp_status ON public.applications(opportunity_id, status);
CREATE INDEX IF NOT EXISTS idx_placements_comp_status ON public.placements(company_id, status);

-- ==============================================================================
-- Migration: 048_ai_enums_and_foundation.sql
-- Description: Core enums for AI operations, request statuses, providers, and prompt template management.
-- ==============================================================================

-- 1. AI Operation Enum (Explicit allowlist of 7 operations)
DO $$ BEGIN
  CREATE TYPE public.ai_operation AS ENUM (
    'assessment_generate',
    'skill_analysis',
    'career_recommendation',
    'learning_recommendation',
    'opportunity_explanation',
    'resume_feedback',
    'interview_preparation'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. AI Request Status Enum
DO $$ BEGIN
  CREATE TYPE public.ai_request_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed',
    'rejected',
    'rate_limited'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. AI Provider Type Enum
DO $$ BEGIN
  CREATE TYPE public.ai_provider_type AS ENUM (
    'openai',
    'mock'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 4. AI Prompt Status Enum
DO $$ BEGIN
  CREATE TYPE public.ai_prompt_status AS ENUM (
    'draft',
    'active',
    'archived'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- Migration: 049_ai_prompt_templates.sql
-- Description: Centralized versioned prompt templates for system instructions and structured schemas.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.ai_prompt_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation public.ai_operation NOT NULL,
  version INT NOT NULL DEFAULT 1,
  system_prompt TEXT NOT NULL,
  user_prompt_template TEXT NOT NULL,
  schema_version TEXT NOT NULL DEFAULT '1.0',
  status public.ai_prompt_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_ai_prompt_op_version UNIQUE (operation, version)
);

CREATE INDEX IF NOT EXISTS idx_ai_prompt_templates_op ON public.ai_prompt_templates(operation, status);

-- ==============================================================================
-- Migration: 050_ai_requests_and_usage_logs.sql
-- Description: Idempotent AI request tracking and fine-grained token/latency usage logs.
-- ==============================================================================

-- 1. AI Requests (Idempotency and lifecycle tracking)
CREATE TABLE IF NOT EXISTS public.ai_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  operation public.ai_operation NOT NULL,
  status public.ai_request_status NOT NULL DEFAULT 'pending',
  model TEXT NOT NULL,
  prompt_version INT NOT NULL DEFAULT 1,
  schema_version TEXT NOT NULL DEFAULT '1.0',
  latency_ms INT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ai_requests_user ON public.ai_requests(user_id, operation, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_requests_status ON public.ai_requests(status);

-- 2. AI Usage Logs (Token counts, performance, and cost tracking)
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id TEXT NOT NULL REFERENCES public.ai_requests(request_id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  operation public.ai_operation NOT NULL,
  model TEXT NOT NULL,
  status public.ai_request_status NOT NULL,
  latency_ms INT,
  input_tokens INT,
  output_tokens INT,
  estimated_cost NUMERIC(10, 6) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user ON public.ai_usage_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_created ON public.ai_usage_logs(created_at DESC);

-- ==============================================================================
-- Migration: 051_ai_rls.sql
-- Description: Row Level Security policies for AI requests, usage logs, and prompt templates.
-- ==============================================================================

-- 1. Enable RLS
ALTER TABLE public.ai_prompt_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- 2. Prompt Templates Policies
DROP POLICY IF EXISTS "Authenticated users can read active prompt templates" ON public.ai_prompt_templates;
CREATE POLICY "Authenticated users can read active prompt templates"
  ON public.ai_prompt_templates FOR SELECT
  TO authenticated
  USING (status = 'active' OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Superadmins can manage prompt templates" ON public.ai_prompt_templates;
CREATE POLICY "Superadmins can manage prompt templates"
  ON public.ai_prompt_templates FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- 3. AI Requests Policies
DROP POLICY IF EXISTS "Users can view own AI requests" ON public.ai_requests;
CREATE POLICY "Users can view own AI requests"
  ON public.ai_requests FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

-- 4. AI Usage Logs Policies
DROP POLICY IF EXISTS "Users can view own AI usage logs" ON public.ai_usage_logs;
CREATE POLICY "Users can view own AI usage logs"
  ON public.ai_usage_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

-- ==============================================================================
-- Migration: 052_ai_functions_and_rpcs.sql
-- Description: Stored procedures for tracking AI requests, logging token usage, prompt retrieval, and rate limiting.
-- ==============================================================================

-- 1. RPC: record_ai_request_start
CREATE OR REPLACE FUNCTION public.record_ai_request_start(
  p_request_id TEXT,
  p_user_id UUID,
  p_operation TEXT,
  p_model TEXT,
  p_prompt_version INT DEFAULT 1,
  p_schema_version TEXT DEFAULT '1.0'
)
RETURNS JSONB AS $$
DECLARE
  v_rec_id UUID;
BEGIN
  INSERT INTO public.ai_requests (
    request_id,
    user_id,
    operation,
    status,
    model,
    prompt_version,
    schema_version,
    created_at
  ) VALUES (
    p_request_id,
    p_user_id,
    p_operation::public.ai_operation,
    'processing'::public.ai_request_status,
    p_model,
    p_prompt_version,
    p_schema_version,
    NOW()
  )
  ON CONFLICT (request_id) DO UPDATE SET
    status = 'processing'::public.ai_request_status,
    model = EXCLUDED.model
  RETURNING id INTO v_rec_id;

  RETURN jsonb_build_object('success', true, 'id', v_rec_id, 'requestId', p_request_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. RPC: record_ai_request_complete
CREATE OR REPLACE FUNCTION public.record_ai_request_complete(
  p_request_id TEXT,
  p_status TEXT,
  p_latency_ms INT DEFAULT NULL,
  p_input_tokens INT DEFAULT NULL,
  p_output_tokens INT DEFAULT NULL,
  p_cost NUMERIC DEFAULT 0,
  p_error_message TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_req public.ai_requests%ROWTYPE;
BEGIN
  SELECT * INTO v_req FROM public.ai_requests WHERE request_id = p_request_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Request not found.');
  END IF;

  UPDATE public.ai_requests
  SET
    status = p_status::public.ai_request_status,
    latency_ms = p_latency_ms,
    error_message = p_error_message,
    completed_at = NOW()
  WHERE request_id = p_request_id;

  INSERT INTO public.ai_usage_logs (
    request_id,
    user_id,
    operation,
    model,
    status,
    latency_ms,
    input_tokens,
    output_tokens,
    estimated_cost,
    created_at
  ) VALUES (
    p_request_id,
    v_req.user_id,
    v_req.operation,
    v_req.model,
    p_status::public.ai_request_status,
    p_latency_ms,
    p_input_tokens,
    p_output_tokens,
    COALESCE(p_cost, 0),
    NOW()
  );

  RETURN jsonb_build_object('success', true, 'requestId', p_request_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. RPC: get_active_ai_prompt
CREATE OR REPLACE FUNCTION public.get_active_ai_prompt(p_operation TEXT)
RETURNS JSONB AS $$
DECLARE
  v_prompt public.ai_prompt_templates%ROWTYPE;
BEGIN
  SELECT * INTO v_prompt
  FROM public.ai_prompt_templates
  WHERE operation = p_operation::public.ai_operation AND status = 'active'
  ORDER BY version DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'found', false,
      'operation', p_operation
    );
  END IF;

  RETURN jsonb_build_object(
    'found', true,
    'id', v_prompt.id,
    'operation', v_prompt.operation,
    'version', v_prompt.version,
    'systemPrompt', v_prompt.system_prompt,
    'userPromptTemplate', v_prompt.user_prompt_template,
    'schemaVersion', v_prompt.schema_version
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 4. RPC: check_ai_rate_limit
CREATE OR REPLACE FUNCTION public.check_ai_rate_limit(
  p_user_id UUID,
  p_operation TEXT,
  p_max_requests_per_hour INT DEFAULT 30
)
RETURNS JSONB AS $$
DECLARE
  v_count INT := 0;
  v_is_allowed BOOLEAN := true;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM public.ai_requests
  WHERE user_id = p_user_id
    AND operation = p_operation::public.ai_operation
    AND created_at >= NOW() - INTERVAL '1 hour';

  IF v_count >= p_max_requests_per_hour THEN
    v_is_allowed := false;
  END IF;

  RETURN jsonb_build_object(
    'allowed', v_is_allowed,
    'currentHourCount', v_count,
    'limitPerHour', p_max_requests_per_hour
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 5. RPC: get_user_ai_usage_summary
CREATE OR REPLACE FUNCTION public.get_user_ai_usage_summary(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_total_requests INT := 0;
  v_total_tokens INT := 0;
  v_by_operation JSONB;
BEGIN
  IF auth.uid() <> p_user_id AND NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Unauthorized: Cannot view another user''s AI usage.';
  END IF;

  SELECT
    COUNT(*),
    COALESCE(SUM(COALESCE(input_tokens, 0) + COALESCE(output_tokens, 0)), 0)
  INTO
    v_total_requests,
    v_total_tokens
  FROM public.ai_usage_logs
  WHERE user_id = p_user_id;

  SELECT jsonb_agg(
    jsonb_build_object(
      'operation', operation,
      'requestsCount', COUNT(*),
      'tokensUsed', SUM(COALESCE(input_tokens, 0) + COALESCE(output_tokens, 0))
    )
  ) INTO v_by_operation
  FROM public.ai_usage_logs
  WHERE user_id = p_user_id
  GROUP BY operation;

  RETURN jsonb_build_object(
    'totalRequests', v_total_requests,
    'totalTokens', v_total_tokens,
    'byOperation', COALESCE(v_by_operation, '[]'::jsonb)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ==============================================================================
-- Migration: 053_ai_prompt_seeds.sql
-- Description: Seed version 1 system instructions and prompt templates for all 7 canonical AI operations.
-- ==============================================================================

INSERT INTO public.ai_prompt_templates (
  operation,
  version,
  system_prompt,
  user_prompt_template,
  schema_version,
  status
) VALUES
  (
    'assessment_generate',
    1,
    'You are an expert academic and technical assessment generation engine for AcadIn. Generate clear, rigorous multiple-choice questions aligned strictly with requested skills, difficulty levels, and domain standards. Return only valid structured JSON conforming to the schema.',
    'Domain: {{domain}}\nSkills: {{skills}}\nDifficulty: {{difficulty}}\nCount: {{count}}',
    '1.0',
    'active'
  ),
  (
    'skill_analysis',
    1,
    'You are AcadIn''s specialized Skill Gap & Diagnostic AI. Analyze declared skills, assessed test performance, and verified evidence against industry benchmark standards. Identify core strengths, weak areas, and estimated mastery levels (0-100). Return only valid structured JSON.',
    'Student Skills: {{skills}}\nAssessment Results: {{assessmentResults}}\nTarget Role: {{targetRole}}',
    '1.0',
    'active'
  ),
  (
    'career_recommendation',
    1,
    'You are AcadIn''s Career Advisory AI. Evaluate student academic profile, verified skills, and career preferences to recommend high-alignment career pathways with realistic readiness ratings and actionable milestones. Return only valid structured JSON.',
    'Academic Profile: {{academicProfile}}\nSkills: {{skills}}\nPreferences: {{preferences}}',
    '1.0',
    'active'
  ),
  (
    'learning_recommendation',
    1,
    'You are AcadIn''s Personalized Learning Curriculum AI. Recommend sequential, high-impact learning roadmap items, project ideas, and certification targets to bridge identified skill gaps. Return only valid structured JSON.',
    'Current Level: {{currentLevel}}\nMissing Skills: {{missingSkills}}\nTarget Role: {{targetRole}}',
    '1.0',
    'active'
  ),
  (
    'opportunity_explanation',
    1,
    'You are AcadIn''s Opportunity Matching Intelligence. Produce transparent, objective explanations for why a candidate aligns or does not align with a given corporate opportunity, detailing matching skills, gaps, and improvements. Return only valid structured JSON.',
    'Candidate Skills: {{candidateSkills}}\nOpportunity Requirements: {{opportunityRequirements}}',
    '1.0',
    'active'
  ),
  (
    'resume_feedback',
    1,
    'You are AcadIn''s ATS & Industry Resume Reviewer. Evaluate resume text against target role standards, identify missing keywords, ATS formatting compatibility, actionable improvements, and highlight key strengths. Return only valid structured JSON.',
    'Resume Text: {{resumeText}}\nTarget Role: {{targetRole}}\nKey Skills: {{skills}}',
    '1.0',
    'active'
  ),
  (
    'interview_preparation',
    1,
    'You are AcadIn''s Mock Interview Coach. Generate realistic technical, behavioral, and role-specific interview questions with evaluation criteria and preparation guidance for candidates. Return only valid structured JSON.',
    'Role: {{role}}\nCompany Domain: {{companyDomain}}\nSkill Focus: {{skillFocus}}',
    '1.0',
    'active'
  )
ON CONFLICT (operation, version) DO UPDATE SET
  system_prompt = EXCLUDED.system_prompt,
  user_prompt_template = EXCLUDED.user_prompt_template,
  status = EXCLUDED.status,
  updated_at = NOW();

-- ==============================================================================
-- Migration: 054_ai_indexes.sql
-- Description: Performance optimization indexes for AI request logging and prompt template lookups.
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_ai_requests_op_status ON public.ai_requests(operation, status);
CREATE INDEX IF NOT EXISTS idx_ai_requests_created ON public.ai_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_op ON public.ai_usage_logs(operation, status);
CREATE INDEX IF NOT EXISTS idx_ai_prompt_templates_lookup ON public.ai_prompt_templates(operation, version DESC, status);

-- ==============================================================================
-- Migration: 055_ai_provider_gemini.sql
-- Description: Integration metadata for Google Gemini AI provider.
-- ==============================================================================

DO $$ BEGIN
  ALTER TYPE public.ai_provider_type ADD VALUE IF NOT EXISTS 'gemini';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- Migration: 056_ai_persistence_tables.sql
-- Description: Caching tables for AI skill-gap, career, and learning recommendations.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.ai_skill_gap_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  attempt_id UUID REFERENCES public.assessment_attempts(id) ON DELETE SET NULL,
  target_role_id UUID REFERENCES public.career_roles(id) ON DELETE SET NULL,
  target_role_title TEXT NOT NULL,
  provider public.ai_provider_type NOT NULL DEFAULT 'gemini',
  model TEXT NOT NULL,
  overall_score NUMERIC(5,2),
  strengths JSONB NOT NULL DEFAULT '[]',
  weaknesses JSONB NOT NULL DEFAULT '[]',
  skill_scores JSONB NOT NULL DEFAULT '[]',
  priority_skills JSONB NOT NULL DEFAULT '[]',
  diagnostic_summary TEXT NOT NULL,
  recommended_actions JSONB NOT NULL DEFAULT '[]',
  is_fallback BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_career_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider public.ai_provider_type NOT NULL DEFAULT 'gemini',
  model TEXT NOT NULL,
  recommended_roles JSONB NOT NULL DEFAULT '[]',
  is_fallback BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_learning_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_role_title TEXT NOT NULL,
  provider public.ai_provider_type NOT NULL DEFAULT 'gemini',
  model TEXT NOT NULL,
  milestones JSONB NOT NULL DEFAULT '[]',
  is_fallback BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- Migration: 057_ai_persistence_rls.sql
-- Description: Row Level Security for student AI intelligence tables.
-- ==============================================================================

ALTER TABLE public.ai_skill_gap_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_career_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_learning_recommendations ENABLE ROW LEVEL SECURITY;

-- 1. Skill Gap Results
DROP POLICY IF EXISTS "Students view own skill gap results" ON public.ai_skill_gap_results;
CREATE POLICY "Students view own skill gap results"
  ON public.ai_skill_gap_results FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Students insert own skill gap results" ON public.ai_skill_gap_results;
CREATE POLICY "Students insert own skill gap results"
  ON public.ai_skill_gap_results FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

-- 2. Career Recommendations
DROP POLICY IF EXISTS "Students view own career recommendations" ON public.ai_career_recommendations;
CREATE POLICY "Students view own career recommendations"
  ON public.ai_career_recommendations FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Students insert own career recommendations" ON public.ai_career_recommendations;
CREATE POLICY "Students insert own career recommendations"
  ON public.ai_career_recommendations FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

-- 3. Learning Recommendations
DROP POLICY IF EXISTS "Students view own learning recommendations" ON public.ai_learning_recommendations;
CREATE POLICY "Students view own learning recommendations"
  ON public.ai_learning_recommendations FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Students insert own learning recommendations" ON public.ai_learning_recommendations;
CREATE POLICY "Students insert own learning recommendations"
  ON public.ai_learning_recommendations FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

-- ==============================================================================
-- Migration: 058_ai_persistence_rpcs.sql
-- Description: Stored procedures for saving and fetching student AI results.
-- ==============================================================================

-- 1. Save AI Skill Gap Result
CREATE OR REPLACE FUNCTION public.save_ai_skill_gap_result(
  p_student_id UUID,
  p_target_role_title TEXT,
  p_data JSONB,
  p_attempt_id UUID DEFAULT NULL,
  p_provider public.ai_provider_type DEFAULT 'gemini',
  p_model TEXT DEFAULT 'gemini-1.5-flash',
  p_is_fallback BOOLEAN DEFAULT FALSE
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_inserted_id UUID;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  IF v_caller_id != p_student_id AND NOT public.is_admin(v_caller_id) THEN
    RAISE EXCEPTION 'Unauthorized to save skill gap result for another student.';
  END IF;

  INSERT INTO public.ai_skill_gap_results (
    student_id,
    attempt_id,
    target_role_title,
    provider,
    model,
    overall_score,
    strengths,
    weaknesses,
    skill_scores,
    priority_skills,
    diagnostic_summary,
    recommended_actions,
    is_fallback
  ) VALUES (
    p_student_id,
    p_attempt_id,
    p_target_role_title,
    p_provider,
    p_model,
    (p_data->>'overallScore')::numeric,
    COALESCE(p_data->'strengths', '[]'::jsonb),
    COALESCE(p_data->'weaknesses', '[]'::jsonb),
    COALESCE(p_data->'skillScores', '[]'::jsonb),
    COALESCE(p_data->'prioritySkills', '[]'::jsonb),
    COALESCE(p_data->>'diagnosticSummary', 'Skill gap analysis complete.'),
    COALESCE(p_data->'recommendedActions', '[]'::jsonb),
    p_is_fallback
  ) RETURNING id INTO v_inserted_id;

  RETURN jsonb_build_object('success', true, 'id', v_inserted_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 2. Get Latest AI Skill Gap Result
CREATE OR REPLACE FUNCTION public.get_latest_ai_skill_gap_result(p_student_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_row RECORD;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  IF v_caller_id != p_student_id AND NOT public.is_admin(v_caller_id) THEN
    RAISE EXCEPTION 'Unauthorized to view skill gap result for another student.';
  END IF;

  SELECT * INTO v_row
  FROM public.ai_skill_gap_results
  WHERE student_id = p_student_id
  ORDER BY created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('found', false);
  END IF;

  RETURN jsonb_build_object(
    'found', true,
    'id', v_row.id,
    'overallScore', v_row.overall_score,
    'strengths', v_row.strengths,
    'weaknesses', v_row.weaknesses,
    'skillScores', v_row.skill_scores,
    'prioritySkills', v_row.priority_skills,
    'diagnosticSummary', v_row.diagnostic_summary,
    'recommendedActions', v_row.recommended_actions,
    'isFallback', v_row.is_fallback,
    'createdAt', v_row.created_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 3. Save AI Career Recommendations
CREATE OR REPLACE FUNCTION public.save_ai_career_recommendations(
  p_student_id UUID,
  p_data JSONB,
  p_provider public.ai_provider_type DEFAULT 'gemini',
  p_model TEXT DEFAULT 'gemini-1.5-flash',
  p_is_fallback BOOLEAN DEFAULT FALSE
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_inserted_id UUID;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  IF v_caller_id != p_student_id AND NOT public.is_admin(v_caller_id) THEN
    RAISE EXCEPTION 'Unauthorized to save career recommendations for another student.';
  END IF;

  INSERT INTO public.ai_career_recommendations (
    student_id,
    provider,
    model,
    recommended_roles,
    is_fallback
  ) VALUES (
    p_student_id,
    p_provider,
    p_model,
    COALESCE(p_data->'recommendedRoles', '[]'::jsonb),
    p_is_fallback
  ) RETURNING id INTO v_inserted_id;

  RETURN jsonb_build_object('success', true, 'id', v_inserted_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 4. Get Latest AI Career Recommendations
CREATE OR REPLACE FUNCTION public.get_latest_ai_career_recommendations(p_student_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_row RECORD;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  IF v_caller_id != p_student_id AND NOT public.is_admin(v_caller_id) THEN
    RAISE EXCEPTION 'Unauthorized to view career recommendations for another student.';
  END IF;

  SELECT * INTO v_row
  FROM public.ai_career_recommendations
  WHERE student_id = p_student_id
  ORDER BY created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('found', false);
  END IF;

  RETURN jsonb_build_object(
    'found', true,
    'id', v_row.id,
    'recommendedRoles', v_row.recommended_roles,
    'isFallback', v_row.is_fallback,
    'createdAt', v_row.created_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 5. Save AI Learning Recommendations
CREATE OR REPLACE FUNCTION public.save_ai_learning_recommendations(
  p_student_id UUID,
  p_target_role_title TEXT,
  p_data JSONB,
  p_provider public.ai_provider_type DEFAULT 'gemini',
  p_model TEXT DEFAULT 'gemini-1.5-flash',
  p_is_fallback BOOLEAN DEFAULT FALSE
)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_inserted_id UUID;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  IF v_caller_id != p_student_id AND NOT public.is_admin(v_caller_id) THEN
    RAISE EXCEPTION 'Unauthorized to save learning recommendations for another student.';
  END IF;

  INSERT INTO public.ai_learning_recommendations (
    student_id,
    target_role_title,
    provider,
    model,
    milestones,
    is_fallback
  ) VALUES (
    p_student_id,
    p_target_role_title,
    p_provider,
    p_model,
    COALESCE(p_data->'milestones', '[]'::jsonb),
    p_is_fallback
  ) RETURNING id INTO v_inserted_id;

  RETURN jsonb_build_object('success', true, 'id', v_inserted_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 6. Get Latest AI Learning Recommendations
CREATE OR REPLACE FUNCTION public.get_latest_ai_learning_recommendations(p_student_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_caller_id UUID;
  v_row RECORD;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  IF v_caller_id != p_student_id AND NOT public.is_admin(v_caller_id) THEN
    RAISE EXCEPTION 'Unauthorized to view learning recommendations for another student.';
  END IF;

  SELECT * INTO v_row
  FROM public.ai_learning_recommendations
  WHERE student_id = p_student_id
  ORDER BY created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('found', false);
  END IF;

  RETURN jsonb_build_object(
    'found', true,
    'id', v_row.id,
    'targetRoleTitle', v_row.target_role_title,
    'milestones', v_row.milestones,
    'isFallback', v_row.is_fallback,
    'createdAt', v_row.created_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- ==============================================================================
-- Migration: 059_ai_prompt_templates_v2.sql
-- Description: Baseline Version 2 prompt templates initialization.
-- ==============================================================================

DO $$ BEGIN
  RAISE NOTICE 'Prompt templates v2 initialized successfully.';
END $$;

-- ==============================================================================
-- Migration: 060_ai_persistence_indexes.sql
-- Description: Composite and lookup indexes on AI persistence tables.
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_ai_skill_gap_student_date ON public.ai_skill_gap_results(student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_career_student_date ON public.ai_career_recommendations(student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_learning_student_date ON public.ai_learning_recommendations(student_id, created_at DESC);

-- ==============================================================================
-- Migration: 061_ai_operations_expansion.sql
-- Description: Expand public.ai_operation enum to cover candidate summaries, comparisons, resume analyses, portfolio feedback, and interview practice.
-- ==============================================================================

DO $$ BEGIN
  ALTER TYPE public.ai_operation ADD VALUE IF NOT EXISTS 'candidate_summary';
  ALTER TYPE public.ai_operation ADD VALUE IF NOT EXISTS 'candidate_comparison';
  ALTER TYPE public.ai_operation ADD VALUE IF NOT EXISTS 'resume_analysis';
  ALTER TYPE public.ai_operation ADD VALUE IF NOT EXISTS 'portfolio_feedback';
  ALTER TYPE public.ai_operation ADD VALUE IF NOT EXISTS 'interview_practice';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- Migration: 062_ai_intelligence_tables.sql
-- Description: Result caching tables for Opportunity, Candidate, Resume, Portfolio, Interview, and User Feedback.
-- ==============================================================================

-- 1. AI Opportunity Explanations Table
CREATE TABLE IF NOT EXISTS public.ai_opportunity_explanations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  provider public.ai_provider_type NOT NULL DEFAULT 'gemini',
  model TEXT NOT NULL,
  overall_match_percentage NUMERIC(5,2) NOT NULL,
  readiness_category TEXT NOT NULL,
  why_you_match JSONB NOT NULL DEFAULT '[]',
  missing_requirements JSONB NOT NULL DEFAULT '[]',
  recommended_actions JSONB NOT NULL DEFAULT '[]',
  application_advice TEXT,
  is_fallback BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. AI Candidate Summaries Table (for Recruiters)
CREATE TABLE IF NOT EXISTS public.ai_candidate_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  recruiter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider public.ai_provider_type NOT NULL DEFAULT 'gemini',
  model TEXT NOT NULL,
  summary TEXT NOT NULL,
  strongest_evidence JSONB NOT NULL DEFAULT '[]',
  matching_skills JSONB NOT NULL DEFAULT '[]',
  missing_skills JSONB NOT NULL DEFAULT '[]',
  concerns JSONB NOT NULL DEFAULT '[]',
  interview_focus JSONB NOT NULL DEFAULT '[]',
  fit_recommendation TEXT NOT NULL,
  confidence TEXT NOT NULL DEFAULT 'medium',
  is_fallback BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. AI Resume Analyses Table
CREATE TABLE IF NOT EXISTS public.ai_resume_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_role_title TEXT,
  provider public.ai_provider_type NOT NULL DEFAULT 'gemini',
  model TEXT NOT NULL,
  overall_score NUMERIC(5,2) NOT NULL,
  ats_compatibility_score NUMERIC(5,2) NOT NULL,
  strengths JSONB NOT NULL DEFAULT '[]',
  improvements JSONB NOT NULL DEFAULT '[]',
  keyword_matches JSONB NOT NULL DEFAULT '[]',
  missing_keywords JSONB NOT NULL DEFAULT '[]',
  summary TEXT NOT NULL,
  is_fallback BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. AI Portfolio Feedbacks Table
CREATE TABLE IF NOT EXISTS public.ai_portfolio_feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider public.ai_provider_type NOT NULL DEFAULT 'gemini',
  model TEXT NOT NULL,
  strengths JSONB NOT NULL DEFAULT '[]',
  weak_project_descriptions JSONB NOT NULL DEFAULT '[]',
  missing_evidence JSONB NOT NULL DEFAULT '[]',
  recommended_improvements JSONB NOT NULL DEFAULT '[]',
  project_evaluations JSONB NOT NULL DEFAULT '[]',
  summary TEXT NOT NULL,
  is_fallback BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. AI Interview Preparations Table
CREATE TABLE IF NOT EXISTS public.ai_interview_preparations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_role_title TEXT NOT NULL,
  opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE SET NULL,
  provider public.ai_provider_type NOT NULL DEFAULT 'gemini',
  model TEXT NOT NULL,
  focus_areas JSONB NOT NULL DEFAULT '[]',
  suggested_questions JSONB NOT NULL DEFAULT '[]',
  preparation_checklist JSONB NOT NULL DEFAULT '[]',
  practice_feedback JSONB NOT NULL DEFAULT '[]',
  is_fallback BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. AI User Feedback Table (for Quality Auditing)
CREATE TABLE IF NOT EXISTS public.ai_user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  request_id TEXT NOT NULL,
  operation public.ai_operation NOT NULL,
  is_helpful BOOLEAN NOT NULL,
  reason TEXT,
  comments TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- Migration: 063_ai_intelligence_rls.sql
-- Description: Multi-tenant Row Level Security policies for AI intelligence tables.
-- ==============================================================================

-- 1. Enable RLS on all tables
ALTER TABLE public.ai_opportunity_explanations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_candidate_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_resume_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_portfolio_feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_interview_preparations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_user_feedback ENABLE ROW LEVEL SECURITY;

-- 2. AI Opportunity Explanations
DROP POLICY IF EXISTS "Students can view own opportunity explanations" ON public.ai_opportunity_explanations;
CREATE POLICY "Students can view own opportunity explanations"
  ON public.ai_opportunity_explanations FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() OR public.is_admin(auth.uid()));

-- 3. AI Candidate Summaries (Recruiters & Admins)
DROP POLICY IF EXISTS "Recruiters can view candidate summaries for own company applications" ON public.ai_candidate_summaries;
CREATE POLICY "Recruiters can view candidate summaries for own company applications"
  ON public.ai_candidate_summaries FOR SELECT
  TO authenticated
  USING (
    recruiter_id = auth.uid() OR
    public.is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.applications app
      JOIN public.opportunities opp ON opp.id = app.opportunity_id
      JOIN public.memberships mem ON mem.organization_id = opp.company_id
      WHERE app.id = ai_candidate_summaries.application_id
        AND mem.user_id = auth.uid()
    )
  );

-- 4. AI Resume Analyses
DROP POLICY IF EXISTS "Students can view own resume analyses" ON public.ai_resume_analyses;
CREATE POLICY "Students can view own resume analyses"
  ON public.ai_resume_analyses FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() OR public.is_admin(auth.uid()));

-- 5. AI Portfolio Feedbacks
DROP POLICY IF EXISTS "Students can view own portfolio feedbacks" ON public.ai_portfolio_feedbacks;
CREATE POLICY "Students can view own portfolio feedbacks"
  ON public.ai_portfolio_feedbacks FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() OR public.is_admin(auth.uid()));

-- 6. AI Interview Preparations
DROP POLICY IF EXISTS "Students can view own interview preparations" ON public.ai_interview_preparations;
CREATE POLICY "Students can view own interview preparations"
  ON public.ai_interview_preparations FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() OR public.is_admin(auth.uid()));

-- 7. AI User Feedback
DROP POLICY IF EXISTS "Users can insert own AI feedback" ON public.ai_user_feedback;
CREATE POLICY "Users can insert own AI feedback"
  ON public.ai_user_feedback FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view own AI feedback" ON public.ai_user_feedback;
CREATE POLICY "Users can view own AI feedback"
  ON public.ai_user_feedback FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

-- ==============================================================================
-- Migration: 064_ai_intelligence_rpcs.sql
-- Description: Stored procedures for persisting intelligence results, submitting feedback, and admin AI monitoring.
-- ==============================================================================

-- 1. RPC: save_ai_opportunity_explanation
CREATE OR REPLACE FUNCTION public.save_ai_opportunity_explanation(
  p_student_id UUID,
  p_opportunity_id UUID,
  p_data JSONB,
  p_provider TEXT DEFAULT 'gemini',
  p_model TEXT DEFAULT 'gemini-1.5-flash',
  p_is_fallback BOOLEAN DEFAULT false
)
RETURNS JSONB AS $$
DECLARE
  v_rec_id UUID;
BEGIN
  INSERT INTO public.ai_opportunity_explanations (
    student_id,
    opportunity_id,
    provider,
    model,
    overall_match_percentage,
    readiness_category,
    why_you_match,
    missing_requirements,
    recommended_actions,
    application_advice,
    is_fallback,
    created_at
  ) VALUES (
    p_student_id,
    p_opportunity_id,
    p_provider::public.ai_provider_type,
    p_model,
    COALESCE((p_data->>'overallMatchPercentage')::NUMERIC, 0),
    COALESCE(p_data->>'category', 'nearly_ready'),
    COALESCE(p_data->'whyYouMatch', '[]'::jsonb),
    COALESCE(p_data->'missingRequirements', '[]'::jsonb),
    COALESCE(p_data->'recommendedActions', '[]'::jsonb),
    p_data->>'applicationAdvice',
    p_is_fallback,
    NOW()
  )
  RETURNING id INTO v_rec_id;

  RETURN jsonb_build_object('success', true, 'id', v_rec_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. RPC: get_latest_ai_opportunity_explanation
CREATE OR REPLACE FUNCTION public.get_latest_ai_opportunity_explanation(
  p_student_id UUID,
  p_opportunity_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_row public.ai_opportunity_explanations%ROWTYPE;
BEGIN
  SELECT * INTO v_row
  FROM public.ai_opportunity_explanations
  WHERE student_id = p_student_id AND opportunity_id = p_opportunity_id
  ORDER BY created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('found', false);
  END IF;

  RETURN jsonb_build_object(
    'found', true,
    'id', v_row.id,
    'studentId', v_row.student_id,
    'opportunityId', v_row.opportunity_id,
    'provider', v_row.provider,
    'model', v_row.model,
    'overallMatchPercentage', v_row.overall_match_percentage,
    'category', v_row.readiness_category,
    'whyYouMatch', v_row.why_you_match,
    'missingRequirements', v_row.missing_requirements,
    'recommendedActions', v_row.recommended_actions,
    'applicationAdvice', v_row.application_advice,
    'isFallback', v_row.is_fallback,
    'createdAt', v_row.created_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 3. RPC: save_ai_candidate_summary
CREATE OR REPLACE FUNCTION public.save_ai_candidate_summary(
  p_application_id UUID,
  p_recruiter_id UUID,
  p_data JSONB,
  p_provider TEXT DEFAULT 'gemini',
  p_model TEXT DEFAULT 'gemini-1.5-flash',
  p_is_fallback BOOLEAN DEFAULT false
)
RETURNS JSONB AS $$
DECLARE
  v_rec_id UUID;
BEGIN
  INSERT INTO public.ai_candidate_summaries (
    application_id,
    recruiter_id,
    provider,
    model,
    summary,
    strongest_evidence,
    matching_skills,
    missing_skills,
    concerns,
    interview_focus,
    fit_recommendation,
    confidence,
    is_fallback,
    created_at
  ) VALUES (
    p_application_id,
    p_recruiter_id,
    p_provider::public.ai_provider_type,
    p_model,
    COALESCE(p_data->>'summary', 'Candidate profile summary generated.'),
    COALESCE(p_data->'strongestEvidence', '[]'::jsonb),
    COALESCE(p_data->'matchingSkills', '[]'::jsonb),
    COALESCE(p_data->'missingSkills', '[]'::jsonb),
    COALESCE(p_data->'concerns', '[]'::jsonb),
    COALESCE(p_data->'interviewFocus', '[]'::jsonb),
    COALESCE(p_data->>'fitRecommendation', 'good_fit'),
    COALESCE(p_data->>'confidence', 'medium'),
    p_is_fallback,
    NOW()
  )
  RETURNING id INTO v_rec_id;

  RETURN jsonb_build_object('success', true, 'id', v_rec_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. RPC: get_latest_ai_candidate_summary
CREATE OR REPLACE FUNCTION public.get_latest_ai_candidate_summary(p_application_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_row public.ai_candidate_summaries%ROWTYPE;
BEGIN
  SELECT * INTO v_row
  FROM public.ai_candidate_summaries
  WHERE application_id = p_application_id
  ORDER BY created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('found', false);
  END IF;

  RETURN jsonb_build_object(
    'found', true,
    'id', v_row.id,
    'applicationId', v_row.application_id,
    'recruiterId', v_row.recruiter_id,
    'provider', v_row.provider,
    'model', v_row.model,
    'summary', v_row.summary,
    'strongestEvidence', v_row.strongest_evidence,
    'matchingSkills', v_row.matching_skills,
    'missingSkills', v_row.missing_skills,
    'concerns', v_row.concerns,
    'interviewFocus', v_row.interview_focus,
    'fitRecommendation', v_row.fit_recommendation,
    'confidence', v_row.confidence,
    'isFallback', v_row.is_fallback,
    'createdAt', v_row.created_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 5. RPC: save_ai_resume_analysis
CREATE OR REPLACE FUNCTION public.save_ai_resume_analysis(
  p_student_id UUID,
  p_data JSONB,
  p_target_role_title TEXT DEFAULT NULL,
  p_provider TEXT DEFAULT 'gemini',
  p_model TEXT DEFAULT 'gemini-1.5-flash',
  p_is_fallback BOOLEAN DEFAULT false
)
RETURNS JSONB AS $$
DECLARE
  v_rec_id UUID;
BEGIN
  INSERT INTO public.ai_resume_analyses (
    student_id,
    target_role_title,
    provider,
    model,
    overall_score,
    ats_compatibility_score,
    strengths,
    improvements,
    keyword_matches,
    missing_keywords,
    summary,
    is_fallback,
    created_at
  ) VALUES (
    p_student_id,
    p_target_role_title,
    p_provider::public.ai_provider_type,
    p_model,
    COALESCE((p_data->>'overallScore')::NUMERIC, 75),
    COALESCE((p_data->>'atsCompatibilityScore')::NUMERIC, 80),
    COALESCE(p_data->'strengths', '[]'::jsonb),
    COALESCE(p_data->'improvements', '[]'::jsonb),
    COALESCE(p_data->'keywordMatches', '[]'::jsonb),
    COALESCE(p_data->'missingKeywords', '[]'::jsonb),
    COALESCE(p_data->>'summary', 'Resume analysis completed.'),
    p_is_fallback,
    NOW()
  )
  RETURNING id INTO v_rec_id;

  RETURN jsonb_build_object('success', true, 'id', v_rec_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. RPC: get_latest_ai_resume_analysis
CREATE OR REPLACE FUNCTION public.get_latest_ai_resume_analysis(p_student_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_row public.ai_resume_analyses%ROWTYPE;
BEGIN
  SELECT * INTO v_row
  FROM public.ai_resume_analyses
  WHERE student_id = p_student_id
  ORDER BY created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('found', false);
  END IF;

  RETURN jsonb_build_object(
    'found', true,
    'id', v_row.id,
    'studentId', v_row.student_id,
    'targetRoleTitle', v_row.target_role_title,
    'provider', v_row.provider,
    'model', v_row.model,
    'overallScore', v_row.overall_score,
    'atsCompatibilityScore', v_row.ats_compatibility_score,
    'strengths', v_row.strengths,
    'improvements', v_row.improvements,
    'keywordMatches', v_row.keyword_matches,
    'missingKeywords', v_row.missing_keywords,
    'summary', v_row.summary,
    'isFallback', v_row.is_fallback,
    'createdAt', v_row.created_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 7. RPC: save_ai_portfolio_feedback
CREATE OR REPLACE FUNCTION public.save_ai_portfolio_feedback(
  p_student_id UUID,
  p_data JSONB,
  p_provider TEXT DEFAULT 'gemini',
  p_model TEXT DEFAULT 'gemini-1.5-flash',
  p_is_fallback BOOLEAN DEFAULT false
)
RETURNS JSONB AS $$
DECLARE
  v_rec_id UUID;
BEGIN
  INSERT INTO public.ai_portfolio_feedbacks (
    student_id,
    provider,
    model,
    strengths,
    weak_project_descriptions,
    missing_evidence,
    recommended_improvements,
    project_evaluations,
    summary,
    is_fallback,
    created_at
  ) VALUES (
    p_student_id,
    p_provider::public.ai_provider_type,
    p_model,
    COALESCE(p_data->'strengths', '[]'::jsonb),
    COALESCE(p_data->'weakProjectDescriptions', '[]'::jsonb),
    COALESCE(p_data->'missingEvidence', '[]'::jsonb),
    COALESCE(p_data->'recommendedImprovements', '[]'::jsonb),
    COALESCE(p_data->'projectEvaluations', '[]'::jsonb),
    COALESCE(p_data->>'summary', 'Portfolio review completed.'),
    p_is_fallback,
    NOW()
  )
  RETURNING id INTO v_rec_id;

  RETURN jsonb_build_object('success', true, 'id', v_rec_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. RPC: get_latest_ai_portfolio_feedback
CREATE OR REPLACE FUNCTION public.get_latest_ai_portfolio_feedback(p_student_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_row public.ai_portfolio_feedbacks%ROWTYPE;
BEGIN
  SELECT * INTO v_row
  FROM public.ai_portfolio_feedbacks
  WHERE student_id = p_student_id
  ORDER BY created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('found', false);
  END IF;

  RETURN jsonb_build_object(
    'found', true,
    'id', v_row.id,
    'studentId', v_row.student_id,
    'provider', v_row.provider,
    'model', v_row.model,
    'strengths', v_row.strengths,
    'weakProjectDescriptions', v_row.weak_project_descriptions,
    'missingEvidence', v_row.missing_evidence,
    'recommendedImprovements', v_row.recommended_improvements,
    'projectEvaluations', v_row.project_evaluations,
    'summary', v_row.summary,
    'isFallback', v_row.is_fallback,
    'createdAt', v_row.created_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 9. RPC: save_ai_interview_preparation
CREATE OR REPLACE FUNCTION public.save_ai_interview_preparation(
  p_student_id UUID,
  p_target_role_title TEXT,
  p_data JSONB,
  p_opportunity_id UUID DEFAULT NULL,
  p_provider TEXT DEFAULT 'gemini',
  p_model TEXT DEFAULT 'gemini-1.5-flash',
  p_is_fallback BOOLEAN DEFAULT false
)
RETURNS JSONB AS $$
DECLARE
  v_rec_id UUID;
BEGIN
  INSERT INTO public.ai_interview_preparations (
    student_id,
    target_role_title,
    opportunity_id,
    provider,
    model,
    focus_areas,
    suggested_questions,
    preparation_checklist,
    practice_feedback,
    is_fallback,
    created_at
  ) VALUES (
    p_student_id,
    p_target_role_title,
    p_opportunity_id,
    p_provider::public.ai_provider_type,
    p_model,
    COALESCE(p_data->'focusAreas', '[]'::jsonb),
    COALESCE(p_data->'suggestedQuestions', '[]'::jsonb),
    COALESCE(p_data->'preparationChecklist', '[]'::jsonb),
    COALESCE(p_data->'practiceFeedback', '[]'::jsonb),
    p_is_fallback,
    NOW()
  )
  RETURNING id INTO v_rec_id;

  RETURN jsonb_build_object('success', true, 'id', v_rec_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. RPC: get_latest_ai_interview_preparation
CREATE OR REPLACE FUNCTION public.get_latest_ai_interview_preparation(
  p_student_id UUID,
  p_target_role_title TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_row public.ai_interview_preparations%ROWTYPE;
BEGIN
  SELECT * INTO v_row
  FROM public.ai_interview_preparations
  WHERE student_id = p_student_id AND target_role_title ILIKE p_target_role_title
  ORDER BY created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('found', false);
  END IF;

  RETURN jsonb_build_object(
    'found', true,
    'id', v_row.id,
    'studentId', v_row.student_id,
    'targetRoleTitle', v_row.target_role_title,
    'opportunityId', v_row.opportunity_id,
    'provider', v_row.provider,
    'model', v_row.model,
    'focusAreas', v_row.focus_areas,
    'suggestedQuestions', v_row.suggested_questions,
    'preparationChecklist', v_row.preparation_checklist,
    'practiceFeedback', v_row.practice_feedback,
    'isFallback', v_row.is_fallback,
    'createdAt', v_row.created_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 11. RPC: submit_ai_user_feedback
CREATE OR REPLACE FUNCTION public.submit_ai_user_feedback(
  p_user_id UUID,
  p_request_id TEXT,
  p_operation TEXT,
  p_is_helpful BOOLEAN,
  p_reason TEXT DEFAULT NULL,
  p_comments TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_rec_id UUID;
BEGIN
  INSERT INTO public.ai_user_feedback (
    user_id,
    request_id,
    operation,
    is_helpful,
    reason,
    comments,
    created_at
  ) VALUES (
    p_user_id,
    p_request_id,
    p_operation::public.ai_operation,
    p_is_helpful,
    p_reason,
    p_comments,
    NOW()
  )
  RETURNING id INTO v_rec_id;

  RETURN jsonb_build_object('success', true, 'id', v_rec_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. RPC: get_admin_ai_telemetry
CREATE OR REPLACE FUNCTION public.get_admin_ai_telemetry()
RETURNS JSONB AS $$
DECLARE
  v_total_requests BIGINT;
  v_completed_requests BIGINT;
  v_failed_requests BIGINT;
  v_rate_limited BIGINT;
  v_avg_latency NUMERIC;
  v_total_tokens BIGINT;
  v_feedback_helpful BIGINT;
  v_feedback_unhelpful BIGINT;
BEGIN
  SELECT
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'completed'),
    COUNT(*) FILTER (WHERE status = 'failed'),
    COUNT(*) FILTER (WHERE status = 'rate_limited'),
    COALESCE(ROUND(AVG(latency_ms), 2), 0),
    COALESCE(SUM(input_tokens + output_tokens), 0)
  INTO
    v_total_requests,
    v_completed_requests,
    v_failed_requests,
    v_rate_limited,
    v_avg_latency,
    v_total_tokens
  FROM public.ai_requests;

  SELECT
    COUNT(*) FILTER (WHERE is_helpful = true),
    COUNT(*) FILTER (WHERE is_helpful = false)
  INTO
    v_feedback_helpful,
    v_feedback_unhelpful
  FROM public.ai_user_feedback;

  RETURN jsonb_build_object(
    'totalRequests', v_total_requests,
    'completedRequests', v_completed_requests,
    'failedRequests', v_failed_requests,
    'rateLimitedRequests', v_rate_limited,
    'avgLatencyMs', v_avg_latency,
    'totalTokensConsumed', v_total_tokens,
    'helpfulFeedbackCount', v_feedback_helpful,
    'unhelpfulFeedbackCount', v_feedback_unhelpful
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ==============================================================================
-- Migration: 065_ai_prompt_templates_v3.sql
-- Description: Optimized system instructions with Gemini JSON schema enforcement for Opportunity, Recruiter, Resume, Portfolio, and Interview operations.
-- ==============================================================================

INSERT INTO public.ai_prompt_templates (
  operation,
  version,
  system_prompt,
  user_prompt_template,
  schema_version,
  status
) VALUES
  (
    'opportunity_explanation',
    3,
    'You are AcadIn''s Opportunity Matching Assistant. Analyze alignment between candidate verified skills, assessment results, and opportunity requirements. Ground all statements strictly in the supplied data. Output JSON conforming to: {"overallMatchPercentage": number, "category": "ready_to_apply"|"nearly_ready"|"build_skills_first", "whyYouMatch": [string], "missingRequirements": [string], "recommendedActions": [string], "applicationAdvice": string}. Output raw JSON only.',
    'Opportunity: {{opportunity}}\nCandidate Skills: {{candidateSkills}}\nAssessment Scores: {{assessmentScores}}\nEvidence: {{evidence}}',
    '3.0',
    'active'
  ),
  (
    'candidate_summary',
    3,
    'You are AcadIn''s Recruiter Advisory AI. Synthesize an evidence-backed candidate profile summary for recruiters. Do not invent experience or make autonomous hiring decisions. Output JSON conforming to: {"summary": string, "strongestEvidence": [string], "matchingSkills": [string], "missingSkills": [string], "concerns": [string], "interviewFocus": [string], "fitRecommendation": "strong_fit"|"good_fit"|"moderate_fit"|"limited_fit", "confidence": "high"|"medium"|"low"}. Output raw JSON only.',
    'Candidate: {{candidate}}\nAssessed Skills: {{assessedSkills}}\nProjects & Evidence: {{evidence}}\nOpportunity Requirements: {{opportunity}}',
    '3.0',
    'active'
  ),
  (
    'candidate_comparison',
    3,
    'You are AcadIn''s Recruiter Candidate Comparison AI. Compare 2-3 candidates against job requirements. Highlight relative technical strengths and recommended interview deep-dives. Do not pick a single hire. Output JSON conforming to: {"comparisonSummary": string, "candidateEvaluations": [{"candidateId": string, "candidateName": string, "keyStrengths": [string], "gapAreas": [string], "recommendedFocus": string}], "overallRecommendation": string}. Output raw JSON only.',
    'Opportunity Requirements: {{opportunity}}\nCandidates: {{candidates}}',
    '3.0',
    'active'
  ),
  (
    'resume_analysis',
    3,
    'You are AcadIn''s Resume Intelligence Engine. Evaluate resume clarity, impact metrics, keyword coverage, and ATS readability against target roles. Do not fabricate experience. Output JSON conforming to: {"overallScore": number (0-100), "atsCompatibilityScore": number (0-100), "strengths": [string], "improvements": [string], "keywordMatches": [string], "missingKeywords": [string], "summary": string}. Output raw JSON only.',
    'Resume Content: {{resumeText}}\nTarget Role: {{targetRole}}\nDeclared Skills: {{skills}}',
    '3.0',
    'active'
  ),
  (
    'portfolio_feedback',
    3,
    'You are AcadIn''s Technical Portfolio & Project Reviewer. Assess project descriptions for clarity, quantifiable impact, and credible evidence of claimed technologies. Output JSON conforming to: {"strengths": [string], "weakProjectDescriptions": [string], "missingEvidence": [string], "recommendedImprovements": [string], "projectEvaluations": [{"title": string, "evidenceStrength": "weak"|"moderate"|"strong", "rationale": string}], "summary": string}. Output raw JSON only.',
    'Projects Catalog: {{projects}}\nClaimed Skills: {{skills}}',
    '3.0',
    'active'
  ),
  (
    'interview_preparation',
    3,
    'You are AcadIn''s Technical Interview Coach. Generate comprehensive interview preparation guides tailored to the candidate''s skill gaps and role requirements. Output JSON conforming to: {"focusAreas": [string], "suggestedQuestions": [{"question": string, "type": "Technical Deep Dive"|"System Design"|"Behavioral & Culture Fit", "keyPointsToCover": [string]}], "preparationChecklist": [string]}. Output raw JSON only.',
    'Target Role: {{targetRole}}\nOpportunity Details: {{opportunity}}\nIdentified Skill Gaps: {{skillGaps}}',
    '3.0',
    'active'
  ),
  (
    'interview_practice',
    3,
    'You are AcadIn''s Technical Interview Practice Evaluator. Provide constructive, actionable feedback on student practice answers. Label output as AI Practice Feedback. Output JSON conforming to: {"technicalAccuracy": number (0-100), "communicationClarity": number (0-100), "strengths": [string], "weaknesses": [string], "suggestedModelAnswer": string, "improvementTips": [string]}. Output raw JSON only.',
    'Interview Question: {{question}}\nQuestion Type: {{type}}\nStudent Answer: {{answer}}',
    '3.0',
    'active'
  )
ON CONFLICT (operation, version) DO UPDATE SET
  system_prompt = EXCLUDED.system_prompt,
  user_prompt_template = EXCLUDED.user_prompt_template,
  schema_version = EXCLUDED.schema_version,
  status = EXCLUDED.status,
  updated_at = NOW();

-- ==============================================================================
-- Migration: 066_ai_intelligence_indexes.sql
-- Description: Indexes for caching lookups on Opportunity, Candidate, Resume, Portfolio, Interview, and User Feedback tables.
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_ai_opp_exp_student_opp ON public.ai_opportunity_explanations(student_id, opportunity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_cand_summary_app ON public.ai_candidate_summaries(application_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_resume_analysis_student ON public.ai_resume_analyses(student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_portfolio_feedback_student ON public.ai_portfolio_feedbacks(student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_interview_prep_student ON public.ai_interview_preparations(student_id, target_role_title, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_user_feedback_req ON public.ai_user_feedback(request_id, created_at DESC);

-- ==============================================================================
-- Migration: 067_security_hardening_and_final_rls.sql
-- Description: Phase 3.1 Production Security Hardening & Final Comprehensive RLS Audit.
-- ==============================================================================

-- 1. HARDEN SECURITY DEFINER SEARCH PATHS
-- Explicitly lock search_path to public, pg_temp on all core system functions to prevent search-path injection.

ALTER FUNCTION public.handle_new_user() SET search_path = public, pg_temp;
ALTER FUNCTION public.is_admin(UUID) SET search_path = public, pg_temp;
ALTER FUNCTION public.is_company_member(UUID) SET search_path = public, pg_temp;
ALTER FUNCTION public.is_opportunity_recruiter(UUID, UUID) SET search_path = public, pg_temp;
ALTER FUNCTION public.is_application_recruiter(UUID, UUID) SET search_path = public, pg_temp;
ALTER FUNCTION public.is_institution_member(UUID, UUID) SET search_path = public, pg_temp;

-- 2. REVOKE DEFAULT PUBLIC EXECUTION & GRANT STRICTLY TO AUTHENTICATED
REVOKE EXECUTE ON FUNCTION public.admin_moderate_opportunity(UUID, public.opportunity_status_enum, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_moderate_opportunity(UUID, public.opportunity_status_enum, TEXT) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.admin_verify_company(UUID, public.company_verification_status_enum, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_verify_company(UUID, public.company_verification_status_enum, TEXT) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.admin_get_platform_metrics() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_get_platform_metrics() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.apply_to_opportunity(UUID, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.apply_to_opportunity(UUID, TEXT, TEXT) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.update_application_status(UUID, public.application_status, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_application_status(UUID, public.application_status, TEXT) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.schedule_interview(UUID, public.interview_type, TEXT, TIMESTAMPTZ, TIMESTAMPTZ, TEXT, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.schedule_interview(UUID, public.interview_type, TEXT, TIMESTAMPTZ, TIMESTAMPTZ, TEXT, TEXT, TEXT) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.create_offer(UUID, TEXT, NUMERIC, DATE, TEXT, TIMESTAMPTZ, NUMERIC, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_offer(UUID, TEXT, NUMERIC, DATE, TEXT, TIMESTAMPTZ, NUMERIC, TEXT) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.respond_to_offer(UUID, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.respond_to_offer(UUID, TEXT, TEXT) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.get_admin_ai_telemetry() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_admin_ai_telemetry() TO authenticated;

-- 3. STORAGE BUCKET CONFIGURATION & RLS POLICIES
-- Create storage buckets if they do not exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp']),
  ('resumes', 'resumes', false, 10485760, ARRAY['application/pdf']),
  ('certificates', 'certificates', false, 10485760, ARRAY['application/pdf', 'image/png', 'image/jpeg']),
  ('marksheets', 'marksheets', false, 10485760, ARRAY['application/pdf', 'image/png', 'image/jpeg']),
  ('reports', 'reports', false, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage Object RLS Policies
-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Avatars: Public read, owner manage
DROP POLICY IF EXISTS "Public view avatars" ON storage.objects;
CREATE POLICY "Public view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users manage own avatars" ON storage.objects;
CREATE POLICY "Users manage own avatars"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Resumes: Student owner manage, authorized recruiters view
DROP POLICY IF EXISTS "Students manage own resumes" ON storage.objects;
CREATE POLICY "Students manage own resumes"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'resumes' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_admin(auth.uid())))
  WITH CHECK (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Recruiters view applicant resumes" ON storage.objects;
CREATE POLICY "Recruiters view applicant resumes"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'resumes'
    AND EXISTS (
      SELECT 1 FROM public.applications a
      WHERE a.student_id = ((storage.foldername(name))[1])::uuid
        AND public.is_application_recruiter(a.id, auth.uid())
    )
  );

-- Certificates & Marksheets: Student owner manage & view, verified recruiters view on application
DROP POLICY IF EXISTS "Students manage own certificates" ON storage.objects;
CREATE POLICY "Students manage own certificates"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id IN ('certificates', 'marksheets') AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_admin(auth.uid())))
  WITH CHECK (bucket_id IN ('certificates', 'marksheets') AND (storage.foldername(name))[1] = auth.uid()::text);

-- Reports: Owner manage, admins view
DROP POLICY IF EXISTS "Users manage own reports" ON storage.objects;
CREATE POLICY "Users manage own reports"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'reports' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_admin(auth.uid())))
  WITH CHECK (bucket_id = 'reports' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 4. VERIFY IMMUTABLE AUDIT LOG PROTECTION
-- Ensure platform_audit_logs and company_audit_logs CANNOT be modified or deleted by non-superusers
REVOKE UPDATE, DELETE, TRUNCATE ON public.platform_audit_logs FROM authenticated, anon, PUBLIC;
REVOKE UPDATE, DELETE, TRUNCATE ON public.company_audit_logs FROM authenticated, anon, PUBLIC;

