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
  'Stipend', 35000, 45000, '₹35,000 / mo',
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
  'Salary', 800000, 1200000, '₹8 - 12 LPA',
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
  'Stipend', 30000, 35000, '₹30,000 / mo',
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
  'Stipend', 28000, 32000, '₹28,000 / mo',
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
  'Completion Bonus', 20000, 25000, '₹25,000 Bonus',
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

