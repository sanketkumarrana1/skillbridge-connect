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

