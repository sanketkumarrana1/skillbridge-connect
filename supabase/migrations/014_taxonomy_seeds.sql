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

