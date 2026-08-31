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

