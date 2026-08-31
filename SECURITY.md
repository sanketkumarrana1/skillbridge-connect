# AcadIn — Platform Security Policy & Architecture

This document describes the security model, authorization standards, data protection guidelines, and vulnerability reporting procedures for **AcadIn**.

---

## 1. Core Security Principles

AcadIn adheres to five core security tenets:

1. **Authenticate → Authorize → Validate Ownership → Execute → Audit**:
   - Every request is authenticated via Supabase JWT tokens.
   - Authorization is verified server-side on PostgreSQL via Row Level Security (RLS) and stored procedures.
   - Resource ownership is derived strictly from `auth.uid()` and verified organization memberships, never from client-provided payload IDs.
   - Sensitive modifications are recorded in immutable audit logs (`platform_audit_logs`, `company_audit_logs`).

2. **Least Privilege & Role Boundaries**:
   - `student`: Access strictly limited to own profile, assessment attempts, applications, offers, and documents.
   - `industry`: Access strictly limited to opportunities, applicant pools, interviews, and offers belonging to their verified company organization.
   - `academician`: Access limited to authorized mentoring sessions and research collaborations.
   - `institution`: Access limited to student cohorts, aggregated placement analytics, and department programs for their verified college.
   - `admin`: Platform governance, moderation queue, and company verification protected by server-enforced `is_admin(auth.uid())`.

3. **Zero Secrets in Client Bundle**:
   - `GEMINI_API_KEY` and Supabase Service Role keys are **never** present in the frontend bundle or client environment (`VITE_*`).
   - All AI interactions pass through the secure Supabase Edge Function (`ai-gateway`) with rate-limiting, JWT authentication, and data minimization.

4. **Authoritative Backend Decision Making**:
   - AI serves as an advisory assistant, never the authority.
   - Gemini cannot directly hire, reject, verify skills, issue offers, or mutate application statuses.
   - Assessment scoring, deadline validation, and eligibility checks remain purely deterministic and backend-enforced.

5. **Defense in Depth**:
   - Storage buckets enforce non-public access on sensitive student documents (resumes, certificates, marksheets).
   - All PostgreSQL `SECURITY DEFINER` functions enforce explicit `SET search_path = public, pg_temp;`.
   - Audit logs revoke `UPDATE`, `DELETE`, and `TRUNCATE` permissions from regular authenticated roles.

---

## 2. Environment Variables & Secret Separation

| Variable | Scope | Description |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Public / Client | Supabase project API gateway endpoint URL. |
| `VITE_SUPABASE_ANON_KEY` | Public / Client | Supabase public anonymous API key (governed by RLS). |
| `GEMINI_API_KEY` | **Server-Side Only** | Google Gemini API key hosted in Supabase Edge Functions. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-Side Only** | Supabase database administrator key (never exposed to client). |

---

## 3. Vulnerability Reporting

If you discover a potential security vulnerability within AcadIn:
- **Do not open public GitHub issues**.
- Please send a report to the security team at `security@acadin.internal`.
- Include reproducible proof-of-concept steps, affected endpoints/tables, and impact assessment.

