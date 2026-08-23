export type Role = "student" | "industry";

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export const SKILL_LEVELS: SkillLevel[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
];

export interface Skill {
  name: string;
  score: number; // 0-100
}

export interface Project {
  title: string;
  description: string;
  tech: string[];
}

export interface Certification {
  title: string;
  issuer: string;
  year: string;
}

export interface StudentProfile {
  name: string;
  email: string;
  college: string;
  degree: string;
  branch: string;
  year: string;
  about: string;
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  interests: string[];
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  logoHue: number;
  description: string;
  requiredSkills: string[];
  eligibility: string;
  duration: string;
  location: string;
  type: "Remote" | "Hybrid" | "On-site";
  stipend: string;
  match: number;
  posted: string;
  reasons: string[];
}

export type ApplicationStatus =
  | "Applied"
  | "Under Review"
  | "Shortlisted"
  | "Rejected";

export interface Application {
  id: string;
  internshipId: string;
  internship: string;
  company: string;
  appliedDate: string;
  status: ApplicationStatus;
  candidate?: string;
  branch?: string;
  match?: number;
}

export interface Candidate {
  id: string;
  name: string;
  college: string;
  branch: string;
  year: string;
  skills: string[];
  gaps: string[];
  match: number;
  appliedFor: string;
  shortlisted: boolean;
}

export interface AssessmentQuestion {
  id: string;
  skill: string;
  category: string;
  prompt: string;
}
