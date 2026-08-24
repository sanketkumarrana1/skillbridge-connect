# SkillBridge Connect

Build a modern responsive web application called "SkillBridge" for an Academia–Industry Collaboration Portal.

IMPORTANT:

This is an MVP for a college hackathon.

Focus primarily on the FRONTEND.

Do not build a complex backend or database yet.

Use realistic mock data so that every screen can be demonstrated without a backend.

TECH STACK:

- React

- TypeScript

- Tailwind CSS

- Modern component-based architecture

- Responsive design for laptop and mobile

MAIN PURPOSE:

The platform connects students with industry opportunities by mapping student skills to internship/job requirements.

USER ROLES:

1. Student

2. Industry

MVP STUDENT FLOW:

Landing Page

→ Login

→ Student Dashboard

→ Student Profile

→ Skills / Skill Assessment

→ AI Skill Analysis

→ Recommended Internships

→ Internship Details

→ Apply

→ My Applications

MVP INDUSTRY FLOW:

Industry Login

→ Industry Dashboard

→ Post Internship

→ View Applications

→ Candidate Skill Match

PAGES TO CREATE:

1. Landing Page

- Hero section

- Clear explanation of Academia–Industry collaboration

- "Find Opportunities" CTA

- "For Industry" CTA

- Feature cards:

  Skill Mapping

  AI Recommendations

  Internships

  Industry Talent Matching

2. Login Page

- Email

- Password

- Role selector: Student / Industry

- Login button

- Demo login option

3. Student Dashboard

   Show:

- Profile completion

- Overall skill score

- Number of recommended internships

- Number of applications

- Skill overview

- Recommended internships

- Recent applications

4. Student Profile

   Sections:

- Name

- College

- Degree

- Branch

- Year

- Skills

- Projects

- Certifications

- Career interests

- Edit profile button

5. Skill Assessment

   Create a simple assessment interface with 10 sample questions.

   Each question should allow the student to select a skill level from Beginner to Expert.

   Show progress.

   At the end show a "Analyze My Skills" button.

6. AI Skill Analysis

   Create a visually impressive dashboard showing:

- Overall career readiness score

- Strong skills

- Moderate skills

- Skill gaps

- Recommended skills to learn

- Short explanation of why each skill is recommended

Use mock AI-generated results for now.

7. Recommended Internships

   Create internship cards containing:

- Internship title

- Company

- Required skills

- Match percentage

- Duration

- Location

- Internship type

- Apply/View Details buttons

8. Internship Details

   Show:

- Company

- Internship title

- Description

- Required skills

- Eligibility

- Duration

- Location

- Match percentage

- Why this internship matches the student

- Apply button

9. My Applications

   Show application cards/table with:

- Company

- Internship

- Applied date

- Status

  Statuses:

  Applied

  Under Review

  Shortlisted

  Rejected

10. Industry Dashboard

    Show:

- Active internships

- Total applications

- Shortlisted candidates

- Average candidate match

- Recent applications

11. Post Internship

    Form fields:

- Internship title

- Description

- Required skills

- Eligibility

- Duration

- Location

- Internship type

- Stipend

- Post Internship button

12. Candidate Matches

    Show candidate cards/table:

- Student name

- Branch

- Skills

- Match percentage

- Skill gaps

- View Profile

- Shortlist button

DESIGN:

- Professional SaaS dashboard

- Clean academic + technology visual identity

- White/light background

- Blue/purple accent colors

- Rounded cards

- Good spacing

- Modern typography

- Clear navigation sidebar for dashboards

- Responsive layout

- Avoid excessive animations

- Make it look like a serious college hackathon product, not a generic template.

NAVIGATION:

Student:

Dashboard

Profile

Skill Assessment

Skill Analysis

Internships

Applications

Industry:

Dashboard

Post Internship

Applications

Candidate Matches

IMPORTANT:

Use mock data and mock interactions for now.

Do not connect any external API yet.

Do not add unnecessary features.

Make all navigation and buttons work visually.

After generating the app, make sure there are no obvious broken routes or empty screens.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fa0bf337-db80-442d-bd03-08778fd4a37b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
