# SkillBridge — Academia–Industry Collaboration Portal (Frontend MVP)

A fully clickable, mock-data-driven React + TypeScript + Tailwind app with two role flows (Student, Industry). No backend, no external APIs.

## Design direction

Professional SaaS dashboard with an academic-tech identity: light background, deep blue primary with violet accent, rounded cards, generous spacing, restrained motion. Semantic color tokens defined in `src/styles.css`; a clean geometric/grotesk display font paired with a readable body font loaded via a `<link>` in the root route.

## Pages and routes

Public

- `/` Landing — hero, what academia–industry collaboration means, "Find Opportunities" and "For Industry" CTAs, four feature cards (Skill Mapping, AI Recommendations, Internships, Industry Talent Matching), how-it-works strip, footer.
- `/login` — email, password, Student/Industry role selector, Login, and one-click demo login for each role.

Student (sidebar shell)

- `/student` Dashboard — profile completion ring, overall skill score, recommended internships count, applications count, skill overview bars, recommended internship previews, recent applications.
- `/student/profile` — name, college, degree, branch, year, skills, projects, certifications, career interests, Edit profile (inline editable form, saved to local state).
- `/student/assessment` — 10 questions, each rated Beginner → Expert, progress bar, "Analyze My Skills" at the end which routes to the analysis page.
- `/student/analysis` — career readiness score, strong / moderate / gap skill groups, recommended skills to learn with a one-line rationale each (mock AI output derived from assessment answers when present, otherwise seeded defaults).
- `/student/internships` — filterable grid of internship cards: title, company, required skills, match %, duration, location, type, Apply / View Details.
- `/student/internships/$id` — full description, required skills, eligibility, duration, location, match %, "Why this matches you" breakdown, Apply button (updates applications state + toast).
- `/student/applications` — cards on mobile / table on desktop with company, internship, applied date, status badge (Applied, Under Review, Shortlisted, Rejected).

Industry (sidebar shell)

- `/industry` Dashboard — active internships, total applications, shortlisted candidates, average candidate match, recent applications list.
- `/industry/post` — form: title, description, required skills (tag input), eligibility, duration, location, type, stipend, Post Internship (adds to mock list + toast + redirect to dashboard).
- `/industry/applications` — applications received table with status controls.
- `/industry/candidates` — candidate cards/table: name, branch, skills, match %, skill gaps, View Profile (dialog), Shortlist (state toggle + toast).

## Technical approach

- TanStack Router file routes under `src/routes/`; `/` replaces the placeholder index. Student and Industry sections use pathless-layout route files rendering a shared `DashboardShell` (collapsible sidebar on desktop, sheet drawer on mobile, topbar with role switcher and avatar).
- Mock data in `src/data/` (students, internships, applications, candidates, assessment questions, analysis results) typed in `src/types/`.
- A single `AppStateProvider` (React context + `useState`) holds mutable demo state: applications, posted internships, shortlists, assessment answers, profile edits. Resets on reload — no persistence needed for the demo.
- Reusable components: `StatCard`, `SkillBar`, `SkillTag`, `MatchRing`, `InternshipCard`, `CandidateCard`, `StatusBadge`, `PageHeader`, `EmptyState`.
- shadcn/ui primitives (card, button, input, select, dialog, sheet, tabs, table, progress, badge) plus sonner toasts mounted once in `__root.tsx`.
- Each route defines its own `head()` with unique title/description/og tags.
- Every button and link resolves to a real route or a visible state change — no dead ends or empty screens.

## Out of scope for this MVP

No database, auth backend, real AI calls, file uploads, or payments. Login accepts any input and routes by selected role.
