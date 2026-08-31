# AcadIn — Supabase Backend Foundation (Phases 2.1, 2.2, 2.3, & 2.4)

This directory contains the production-grade PostgreSQL migrations, trigger definitions, Row Level Security (RLS) policies, stored procedures, and seed data for **AcadIn**.

---

## 1. Migrations Overview

| Migration File | Stage | Description |
| :--- | :--- | :--- |
| [`001_initial_profiles.sql`](./migrations/001_initial_profiles.sql) | 2.1 | Creates the base `public.profiles` table linked to `auth.users(id)` with auto-updating timestamps. |
| [`002_roles_and_enums.sql`](./migrations/002_roles_and_enums.sql) | 2.1 | Declares the `app_role` enum (`student`, `industry`, `academician`, `institution`, `admin`), `user_roles` table, and `is_admin()` function. |
| [`003_organizations.sql`](./migrations/003_organizations.sql) | 2.1 | Creates `public.organizations` for multi-college and multi-company registry with status lifecycle. |
| [`004_memberships.sql`](./migrations/004_memberships.sql) | 2.1 | Creates `public.organization_memberships` mapping staff, recruiters, and faculty to verified organizations. |
| [`005_role_profiles.sql`](./migrations/005_role_profiles.sql) | 2.1 | Creates lightweight role-specific foundation tables (`student_profiles`, `industry_profiles`, `academician_profiles`, `institution_profiles`). |
| [`006_auth_triggers_and_rls.sql`](./migrations/006_auth_triggers_and_rls.sql) | 2.1 | Attaches the `handle_new_user()` security trigger to `auth.users` on signup and activates granular RLS policies. |
| [`007_departments.sql`](./migrations/007_departments.sql) | 2.2 | Institutional `public.departments` table with unique code/name constraints and scoped RLS. |
| [`008_student_profile_expansion.sql`](./migrations/008_student_profile_expansion.sql) | 2.2 | Extends `student_profiles` with academic credentials, program details, graduation year, and onboarding status. |
| [`009_career_taxonomy.sql`](./migrations/009_career_taxonomy.sql) | 2.2 | Normalizes career interests, target roles, student choices, and opportunity preferences. |
| [`010_skill_taxonomy.sql`](./migrations/010_skill_taxonomy.sql) | 2.2 | Hierarchical skill categories, skills taxonomy, search aliases, and directional skill relationships. |
| [`011_student_skills.sql`](./migrations/011_student_skills.sql) | 2.2 | Declared student skills with proficiency ratings, score levels, and unique constraints. |
| [`012_skill_evidence.sql`](./migrations/012_skill_evidence.sql) | 2.2 | Verifiable evidence items linked to declared skills with lifecycle verification states. |
| [`013_student_onboarding_rpc.sql`](./migrations/013_student_onboarding_rpc.sql) | 2.2 | Transactional PostgreSQL RPC `save_student_onboarding()` guaranteeing atomic multi-table persistence. |
| [`014_taxonomy_seeds.sql`](./migrations/014_taxonomy_seeds.sql) | 2.2 | Comprehensive seed data for categories, core skills library, aliases, career tracks, and target roles. |
| [`015_assessment_definitions.sql`](./migrations/015_assessment_definitions.sql) | 2.3 | Assessment templates (`skill_verification`, `career_readiness`, `comprehensive`). |
| [`016_assessment_questions.sql`](./migrations/016_assessment_questions.sql) | 2.3 | Domain-calibrated question bank and options with secure server-side answer verification. |
| [`017_assessment_configs_attempts.sql`](./migrations/017_assessment_configs_attempts.sql) | 2.3 | Profile config snapshots, attempt lifecycles, assigned attempt questions, student answers, and skill results. |
| [`018_assessment_rpcs.sql`](./migrations/018_assessment_rpcs.sql) | 2.3 | Security definer RPCs: `create_personalized_assessment()`, `submit_assessment_attempt()`, `get_assessment_attempt_questions()`. |
| [`019_assessment_question_seeds.sql`](./migrations/019_assessment_question_seeds.sql) | 2.3 | Standard seed questions across all core skills (React, TypeScript, Python, SQL, DSA, OS, Networks, Git, Cloud, AI/ML). |
| [`020_opportunities.sql`](./migrations/020_opportunities.sql) | 2.4 | Canonical `opportunities` table supporting internships, jobs, live projects, apprenticeships, and training. |
| [`021_opportunity_skills.sql`](./migrations/021_opportunity_skills.sql) | 2.4 | Structured opportunity skill requirements linked to central skills taxonomy with weights (1-10) and minimum levels. |
| [`022_opportunity_eligibility.sql`](./migrations/022_opportunity_eligibility.sql) | 2.4 | Structured eligibility rules for degrees, departments, graduation batches, and minimum CGPA criteria. |
| [`023_opportunity_target_roles_and_saved.sql`](./migrations/023_opportunity_target_roles_and_saved.sql) | 2.4 | Target role taxonomy mappings and student saved opportunities with unique constraints. |
| [`024_opportunity_matching.sql`](./migrations/024_opportunity_matching.sql) | 2.4 | Multi-dimensional fit score snapshots, categorizations (`best_match`, `quick_win`), and explainable matching vectors. |
| [`025_opportunity_rls_and_rpcs.sql`](./migrations/025_opportunity_rls_and_rpcs.sql) | 2.4 | Security definer RPCs: `check_opportunity_eligibility()`, `calculate_opportunity_match()`, `publish_opportunity()`, `close_opportunity()`. |
| [`026_opportunity_seeds.sql`](./migrations/026_opportunity_seeds.sql) | 2.4 | Standard seed catalog across companies (TechCorp, DataPulse, CloudNative Labs, NextGen AI, FinSecure). |
| [`027_applications.sql`](./migrations/027_applications.sql) | 2.5 | Canonical `applications` table connecting student profiles to opportunities with lifecycle statuses. |
| [`028_application_snapshots_and_history.sql`](./migrations/028_application_snapshots_and_history.sql) | 2.5 | Immutable application-time match snapshots and state transition audit trail for Placement Timeline. |
| [`029_interviews_and_feedback.sql`](./migrations/029_interviews_and_feedback.sql) | 2.5 | Interview scheduling and interviewer evaluation feedback with multi-dimensional rating scores. |
| [`030_offers_and_placements.sql`](./migrations/030_offers_and_placements.sql) | 2.5 | Corporate offers and permanent student hire placements table with cycle and compensation tracking. |
| [`031_recruitment_rls.sql`](./migrations/031_recruitment_rls.sql) | 2.5 | Granular RLS policies safeguarding candidate applications, interview feedback, and corporate offers. |
| [`032_recruitment_rpcs.sql`](./migrations/032_recruitment_rpcs.sql) | 2.5 | Transactional RPCs: `submit_application()`, `transition_application_status()`, `schedule_interview()`, `create_and_send_offer()`, `respond_to_offer()`, `get_placement_timeline()`. |
| [`033_recruitment_seeds.sql`](./migrations/033_recruitment_seeds.sql) | 2.5 | Realistic student application lifecycle seed catalog across interview stages, offers, and confirmed placements. |
| [`034_company_extensions.sql`](./migrations/034_company_extensions.sql) | 2.6 | Company organization extensions, legal name, size, verification lifecycle (`unverified`, `pending`, `verified`, `suspended`). |
| [`035_recruiter_roles_and_permissions.sql`](./migrations/035_recruiter_roles_and_permissions.sql) | 2.6 | Recruiter roles (`owner`, `admin`, `recruiter`, `hiring_manager`, `interviewer`) and centralized permission matrix. |
| [`036_opportunity_recruiters.sql`](./migrations/036_opportunity_recruiters.sql) | 2.6 | Opportunity hiring team assignments linking recruiters and interviewers to specific opportunities. |
| [`037_company_audit_logs.sql`](./migrations/037_company_audit_logs.sql) | 2.6 | Audit logging for company profile updates, recruiter role modifications, and opportunity lifecycle actions. |
| [`038_company_rls.sql`](./migrations/038_company_rls.sql) | 2.6 | Strict multi-tenant RLS isolating recruiter company data and applications. |
| [`039_company_functions_and_rpcs.sql`](./migrations/039_company_functions_and_rpcs.sql) | 2.6 | Helper functions & RPCs: `get_company_profile()`, `update_company_profile()`, `submit_company_verification()`, `get_company_recruitment_metrics()`, `get_opportunity_performance()`. |
| [`040_company_seeds.sql`](./migrations/040_company_seeds.sql) | 2.6 | Multi-company seed catalog across tech sectors and verification stages. |
| [`041_institution_extensions.sql`](./migrations/041_institution_extensions.sql) | 2.8 | Institution organization attributes, institution roles, permission matrix, and report snapshots table. |
| [`042_platform_admin_and_moderation.sql`](./migrations/042_platform_admin_and_moderation.sql) | 2.8 | Platform central audit logs and moderation queue for moderation workflows. |
| [`043_institution_and_admin_rls.sql`](./migrations/043_institution_and_admin_rls.sql) | 2.8 | Multi-tenant RLS for institutional data isolation and server-enforced admin authorization. |
| [`044_institution_analytics_rpcs.sql`](./migrations/044_institution_analytics_rpcs.sql) | 2.8 | Live aggregation RPCs: overview, department analytics, skill gaps, industry demand, placements, and recruiter engagement. |
| [`045_platform_admin_rpcs.sql`](./migrations/045_platform_admin_rpcs.sql) | 2.8 | Admin management procedures: metrics, user management, company verification, institution status, and moderation. |
| [`046_institution_and_admin_seeds.sql`](./migrations/046_institution_and_admin_seeds.sql) | 2.8 | Multi-institution seed catalog (NITK, IIIT Allahabad, DTU), admin profile, moderation queue, and audit logs. |
| [`047_analytics_indexes.sql`](./migrations/047_analytics_indexes.sql) | 2.8 | Performance optimization indexes for real-time institutional queries and department aggregations. |
| [`048_ai_enums_and_foundation.sql`](./migrations/048_ai_enums_and_foundation.sql) | 2.10.1 | AI enums for 7 canonical operations, request statuses, providers, and prompt management. |
| [`049_ai_prompt_templates.sql`](./migrations/049_ai_prompt_templates.sql) | 2.10.1 | Versioned system instructions and prompt templates table `ai_prompt_templates`. |
| [`050_ai_requests_and_usage_logs.sql`](./migrations/050_ai_requests_and_usage_logs.sql) | 2.10.1 | Idempotent request tracker `ai_requests` and token/cost logger `ai_usage_logs`. |
| [`051_ai_rls.sql`](./migrations/051_ai_rls.sql) | 2.10.1 | Multi-tenant RLS isolating AI usage records to the authenticated user. |
| [`052_ai_functions_and_rpcs.sql`](./migrations/052_ai_functions_and_rpcs.sql) | 2.10.1 | Procedures for recording request starts/completions, checking rate limits, and querying active prompt templates. |
| [`053_ai_prompt_seeds.sql`](./migrations/053_ai_prompt_seeds.sql) | 2.10.1 | Seed active Version 1 prompt templates for the 7 canonical operations. |
| [`054_ai_indexes.sql`](./migrations/054_ai_indexes.sql) | 2.10.1 | High-performance indexes on `ai_requests`, `ai_usage_logs`, and `ai_prompt_templates`. |
| [`055_ai_provider_gemini.sql`](./migrations/055_ai_provider_gemini.sql) | 2.10.2 | Extend `ai_provider_type` enum to include Google Gemini AI (`'gemini'`). |
| [`056_ai_persistence_tables.sql`](./migrations/056_ai_persistence_tables.sql) | 2.10.2 | Result caching tables for `ai_skill_gap_results`, `ai_career_recommendations`, `ai_learning_recommendations`. |
| [`057_ai_persistence_rls.sql`](./migrations/057_ai_persistence_rls.sql) | 2.10.2 | Scoped RLS isolating AI results to the authenticated student owner. |
| [`058_ai_persistence_rpcs.sql`](./migrations/058_ai_persistence_rpcs.sql) | 2.10.2 | Stored procedures for saving and fetching cached AI skill gaps, career roles, and learning roadmaps. |
| [`059_ai_prompt_templates_v2.sql`](./migrations/059_ai_prompt_templates_v2.sql) | 2.10.2 | Version 2 Gemini prompt templates with strict JSON schema definitions and taxonomy constraints. |
| [`060_ai_persistence_indexes.sql`](./migrations/060_ai_persistence_indexes.sql) | 2.10.2 | Performance indexes on student AI skill gap, career, and learning results. |
| [`061_ai_operations_expansion.sql`](./migrations/061_ai_operations_expansion.sql) | 2.10.3 | Expand `ai_operation` enum for candidate summaries, comparisons, resume analysis, portfolio feedback, interview practice. |
| [`062_ai_intelligence_tables.sql`](./migrations/062_ai_intelligence_tables.sql) | 2.10.3 | Result caching tables for Opportunity, Recruiter Candidate, Resume, Portfolio, Interview, and User Feedback. |
| [`063_ai_intelligence_rls.sql`](./migrations/063_ai_intelligence_rls.sql) | 2.10.3 | Multi-tenant RLS isolating candidate data and student documents. |
| [`064_ai_intelligence_rpcs.sql`](./migrations/064_ai_intelligence_rpcs.sql) | 2.10.3 | Stored procedures for persisting, fetching cached intelligence, submitting user feedback, and aggregating admin AI telemetry. |
| [`065_ai_prompt_templates_v3.sql`](./migrations/065_ai_prompt_templates_v3.sql) | 2.10.3 | Version 3 Gemini prompt templates with JSON schema definitions for all remaining operations. |
| [`066_ai_intelligence_indexes.sql`](./migrations/066_ai_intelligence_indexes.sql) | 2.10.3 | Performance indexes across all AI intelligence and feedback tables. |
| [`067_security_hardening_and_final_rls.sql`](./migrations/067_security_hardening_and_final_rls.sql) | 3.1 | Phase 3.1 Security Hardening: explicit `search_path` locking, public execute revoking, storage bucket policies, immutable audit logs. |

---

## 2. Setup & Execution Guide

### Option A: Using Supabase Cloud Dashboard
1. Open your Supabase Project Dashboard at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** tab on the left menu.
3. Open and run the migration files in numerical order:
   - `001_initial_profiles.sql` through `066_ai_intelligence_indexes.sql`

### Option B: Using Supabase CLI
```bash
# Link your local project to your remote Supabase instance
supabase link --project-ref your-project-id

# Push all migrations
supabase db push
```
