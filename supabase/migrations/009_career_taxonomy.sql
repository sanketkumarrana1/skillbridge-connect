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

