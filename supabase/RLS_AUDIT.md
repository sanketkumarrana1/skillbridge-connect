# AcadIn — Comprehensive Row Level Security (RLS) Audit & Policy Reference

This document provides a detailed mapping of every table in the AcadIn database, its Row Level Security status, and the exact authorization logic governing `SELECT`, `INSERT`, `UPDATE`, and `DELETE` access across all user roles (`student`, `industry`, `academician`, `institution`, `admin`).

---

## 1. Multi-Tenant Role & Permission Architecture

AcadIn enforces **least-privilege access** using PostgreSQL Row Level Security combined with security definer authorization helper functions:

- `public.is_admin(auth.uid())`: Authoritative check for platform administrators.
- `public.is_company_member(company_id)`: Checks if the user is an active verified member of the specified company organization.
- `public.is_opportunity_recruiter(opportunity_id, auth.uid())`: Checks if the recruiter belongs to the company owning the opportunity.
- `public.is_application_recruiter(application_id, auth.uid())`: Checks if the recruiter belongs to the company receiving the student's application.
- `public.is_institution_member(institution_id, auth.uid())`: Checks if the user is an active representative of the academic institution.

---

## 2. Table-by-Table RLS Matrix

| Table Name | RLS Status | Student Access | Recruiter / Industry Access | Institution Rep Access | Platform Admin Access |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `profiles` | **ENABLED** | Read own; Update own | Read own; Update own | Read own; Update own | Read/Manage All |
| `user_roles` | **ENABLED** | Read own | Read own | Read own | Read/Manage All |
| `organizations` | **ENABLED** | Read active | Read active; Manage own company | Read active; Manage own institution | Read/Manage All |
| `organization_memberships` | **ENABLED** | Read own | Read own company memberships | Read own institution memberships | Read/Manage All |
| `student_profiles` | **ENABLED** | Read own; Update own | Read public/applicant data | Read enrolled students in college | Read/Manage All |
| `industry_profiles` | **ENABLED** | Read company public profile | Read own; Update own | Read verified company profile | Read/Manage All |
| `academician_profiles` | **ENABLED** | Read public faculty directory | Read collaboration profiles | Read own institution faculty | Read/Manage All |
| `institution_profiles` | **ENABLED** | Read college profile | Read verified college profile | Read own; Update own | Read/Manage All |
| `departments` | **ENABLED** | Read all active | Read all active | Manage own institution depts | Read/Manage All |
| `skills` & `skill_categories` | **ENABLED** | Read all | Read all | Read all | Read/Manage All |
| `student_skills` | **ENABLED** | Read own; Manage own | Read applicant declared skills | Read student skills in college | Read/Manage All |
| `skill_evidence` | **ENABLED** | Read own; Manage own | Read applicant evidence | Read student evidence in college | Read/Manage All |
| `assessment_definitions` | **ENABLED** | Read active templates | Read active templates | Read active templates | Read/Manage All |
| `assessment_questions` | **ENABLED** | Read assigned attempt questions | Read assigned questions | Read assigned questions | Read/Manage All |
| `assessment_attempts` | **ENABLED** | Read own; Insert own | Read applicant attempt scores | Read aggregated student scores | Read/Manage All |
| `assessment_answers` | **ENABLED** | Read own; Insert own | None (answers protected) | None | Read/Manage All |
| `opportunities` | **ENABLED** | Read published opportunities | Read own; Manage own company opps | Read published opportunities | Read/Manage All |
| `opportunity_skills` | **ENABLED** | Read published opp requirements| Manage own opp requirements | Read published opp requirements | Read/Manage All |
| `saved_opportunities` | **ENABLED** | Read own; Manage own | None | None | Read/Manage All |
| `opportunity_match_scores` | **ENABLED** | Read own fit scores | Read applicant match scores | Read aggregated fit scores | Read/Manage All |
| `applications` | **ENABLED** | Read own; Submit own | Read company applicant pool | Read enrolled student applications | Read/Manage All |
| `application_profile_snapshots`| **ENABLED**| Read own snapshot | Read applicant snapshot | Read enrolled student snapshot | Read/Manage All |
| `application_status_history` | **ENABLED** | Read own status history | Read/Append applicant history | Read enrolled student history | Read/Manage All |
| `interviews` | **ENABLED** | Read own interviews | Schedule/Manage company interviews | None | Read/Manage All |
| `interview_feedback` | **ENABLED** | None (Private recruiter notes) | Submit/View company feedback | None | Read/Manage All |
| `offers` | **ENABLED** | Read own; Accept/Decline own | Create/Manage company offers | Read placement outcomes | Read/Manage All |
| `placements` | **ENABLED** | Read own confirmed placement | Read company confirmed hires | Read college confirmed hires | Read/Manage All |
| `companies` (extensions) | **ENABLED** | Read verified directory | Read own; Update own | Read verified directory | Read/Manage All |
| `company_audit_logs` | **ENABLED** | None | Read own company audit trail | None | Read/Manage All |
| `platform_moderation_queue` | **ENABLED** | None | None | None | Read/Manage All |
| `platform_audit_logs` | **ENABLED** | None | None | None | Read All |
| `ai_requests` & `usage_logs`| **ENABLED** | Read own request logs | Read own request logs | Read own request logs | Read/Manage All |
| `ai_prompt_templates` | **ENABLED** | Read active templates | Read active templates | Read active templates | Read/Manage All |
| `ai_skill_gap_results` | **ENABLED** | Read own; Insert own | Read applicant skill gap summary | Read college student summaries | Read/Manage All |
| `ai_career_recommendations` | **ENABLED**| Read own; Insert own | None | Read college student summaries | Read/Manage All |
| `ai_learning_recommendations`| **ENABLED**| Read own; Insert own | None | Read college student summaries | Read/Manage All |
| `ai_opportunity_explanations`| **ENABLED**| Read own match explanation | None | None | Read/Manage All |
| `ai_candidate_summaries` | **ENABLED** | None | Read own application summary | None | Read/Manage All |
| `ai_resume_analyses` | **ENABLED** | Read own; Insert own | Read applicant resume score | None | Read/Manage All |
| `ai_portfolio_feedbacks` | **ENABLED** | Read own; Insert own | Read applicant portfolio score | None | Read/Manage All |
| `ai_interview_preparations` | **ENABLED** | Read own prep sets | None | None | Read/Manage All |
| `ai_user_feedback` | **ENABLED** | Read own ratings; Submit own | Read own ratings; Submit own | Read own ratings; Submit own | Read/Manage All |

---

## 3. Storage Bucket Security Specifications

| Bucket Name | Access Model | File Size Limit | Allowed MIME Types | Ownership Verification Condition |
| :--- | :--- | :--- | :--- | :--- |
| `avatars` | Public Read / Authenticated Write | 5 MB | `image/png`, `image/jpeg`, `image/webp` | `(storage.foldername(name))[1] = auth.uid()::text` |
| `resumes` | Private Read / Private Write | 10 MB | `application/pdf` | Owner manage: `(storage.foldername(name))[1] = auth.uid()::text`<br>Recruiter read: `is_application_recruiter(application_id)` |
| `certificates` | Private Read / Private Write | 10 MB | `application/pdf`, `image/png`, `image/jpeg` | Owner manage: `(storage.foldername(name))[1] = auth.uid()::text` |
| `marksheets` | Private Read / Private Write | 10 MB | `application/pdf`, `image/png`, `image/jpeg` | Owner manage: `(storage.foldername(name))[1] = auth.uid()::text` |
| `reports` | Private Read / Private Write | 10 MB | `application/pdf` | Owner manage: `(storage.foldername(name))[1] = auth.uid()::text`<br>Admin read: `is_admin(auth.uid())` |

---

## 4. Stored Procedure Security & Search Path Protections

All `SECURITY DEFINER` functions in AcadIn are locked with:
```sql
SET search_path = public, pg_temp;
```
This guarantees that unprivileged users cannot manipulate schema search order to execute malicious interceptor functions.

