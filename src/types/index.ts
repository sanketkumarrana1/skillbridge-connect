export type Role = "student" | "industry" | "academician" | "institution";

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export const SKILL_LEVELS: SkillLevel[] = ["Beginner", "Intermediate", "Advanced", "Expert"];

export interface Skill {
  name: string;
  score: number; // 0-100
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  duration?: string | undefined;
  githubUrl?: string | undefined;
  liveUrl?: string | undefined;
}

export type CertificateVerificationStatus = "Verified" | "Pending" | "Not Verified";

export interface Certification {
  id: string;
  name: string;
  title?: string | undefined; // backward compat alias
  issuer: string;
  issueDate: string;
  year?: string | undefined; // backward compat alias
  credentialId?: string | undefined;
  credentialUrl?: string | undefined;
  skillsEarned?: string[] | undefined;
  verificationStatus: CertificateVerificationStatus;
}

export interface Achievement {
  id: string;
  title: string;
  description?: string | undefined;
  date?: string | undefined;
  issuer?: string | undefined;
}

export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  duration: string;
  location?: string | undefined;
  description?: string | undefined;
  type?: ("Internship" | "Full-time" | "Part-time" | "Contract") | undefined;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear?: string | undefined;
  endYear?: string | undefined;
  grade?: string | undefined;
}

export interface SocialLinks {
  github?: string | undefined;
  linkedin?: string | undefined;
  website?: string | undefined;
  twitter?: string | undefined;
}

export interface StudentProfile {
  name: string;
  email: string;
  phone?: string | undefined;
  location?: string | undefined;
  avatar?: string | undefined;
  headline?: string | undefined;
  college: string;
  degree: string;
  branch: string;
  year: string;
  about: string;
  socialLinks?: SocialLinks | undefined;
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  achievements?: Achievement[] | undefined;
  experience?: WorkExperience[] | undefined;
  education?: Education[] | undefined;
  interests: string[];
}

export type AssessmentCategory =
  | "Programming"
  | "Problem Solving"
  | "Analytical Thinking"
  | "Domain Knowledge"
  | "Communication"
  | "Teamwork"
  | "Leadership";

export interface MCQAssessmentQuestion {
  id: string;
  category: AssessmentCategory;
  question: string;
  options: string[];
  correct: number;
  weight?: number;
}

export interface AssessmentResult {
  submittedAt: string;
  categoryScores: Record<AssessmentCategory, number>;
  technicalScore: number;
  softSkillScore: number;
  employabilityScore: number;
  answers: Record<string, number>;
}

export interface CareerRole {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  categoryWeights: Partial<Record<AssessmentCategory, number>>;
  minimumSkillScore: number;
}

export interface CareerMatch {
  roleId: string;
  roleTitle: string;
  roleDescription: string;
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
  placementReadiness: number;
}

export interface RoadmapItem {
  id: string;
  title: string;
  skill: string;
  category: AssessmentCategory | string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedDuration: string;
  learningResource: {
    title: string;
    url: string;
    type: "Course" | "Video" | "Article" | "Book";
  };
  progress: number;
  completed: boolean;
  order: number;
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  companyLogoHue?: number | undefined;
  /** @deprecated Use companyLogoHue instead */
  logoHue?: number | undefined;
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
  deadline?: string | undefined;
  paid?: boolean | undefined;
  status?: ("Published" | "Draft") | undefined;
}

export type InternshipBackwardCompat = Internship & { logoHue?: number | undefined };

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogoHue: number;
  description: string;
  requiredSkills: string[];
  qualifications: string[];
  experience: string;
  ctc: string;
  location: string;
  workType: "Remote" | "Hybrid" | "On-site";
  deadline: string;
  posted: string;
  reasons: string[];
  status?: ("Published" | "Draft") | undefined;
}

export type ApplicationStatus =
  | "Applied"
  | "Under Review"
  | "Shortlisted"
  | "Interview"
  | "Interview Scheduled"
  | "Interview Completed"
  | "Offered"
  | "Selected"
  | "Hired"
  | "Rejected";

export type PipelineStage =
  | "Applied"
  | "Shortlisted"
  | "Interview Scheduled"
  | "Interview Completed"
  | "Offered"
  | "Hired"
  | "Rejected";

export interface InterviewSchedule {
  id: string;
  candidateId: string;
  candidateName: string;
  role: string;
  match: number;
  stage: PipelineStage;
  date?: string | undefined;
  time?: string | undefined;
  mode: "Google Meet" | "Zoom" | "On-site" | "Phone";
  interviewer: string;
  notes?: string | undefined;
  feedback?: string | undefined;
  score?: number | undefined;
  offerDetails?:
    | {
        designation: string;
        ctcOrStipend: string;
        startDate: string;
        deadline: string;
      }
    | undefined;
}

export type TrainingProgramType =
  | "Workshop"
  | "Bootcamp"
  | "Certification Program"
  | "Mentorship Program"
  | "Live Industry Project";

export interface TrainingProgram {
  id: string;
  company: string;
  companyLogoHue?: number | undefined;
  title: string;
  type: TrainingProgramType;
  description: string;
  skills: string[];
  duration: string;
  capacity: number;
  enrolledCount: number;
  mode: "Online" | "Hybrid" | "In-person";
  startDate: string;
  instructor?: string | undefined;
  status?: ("Published" | "Draft") | undefined;
  registrationDeadline?: string | undefined;
}

export interface Application {
  id: string;
  internshipId: string;
  internship: string;
  company: string;
  appliedDate: string;
  status: ApplicationStatus;
  candidate?: string | undefined;
  branch?: string | undefined;
  match?: number | undefined;
  opportunityType?: ("Internship" | "Job") | undefined;
  salaryOrStipend?: string | undefined;
  nextStep?: string | undefined;
  interviewDetails?:
    | {
        date?: string | undefined;
        time?: string | undefined;
        mode?: string | undefined;
        notes?: string | undefined;
      }
    | undefined;
}

export interface Candidate {
  id: string;
  name: string;
  email?: string | undefined;
  phone?: string | undefined;
  college: string;
  branch: string;
  year: string;
  skills: string[];
  gaps?: string[] | undefined;
  match: number;
  appliedFor: string;
  opportunityType?: ("Internship" | "Job") | undefined;
  shortlisted: boolean;
  status?: ApplicationStatus | undefined;
  employabilityScore?: number | undefined;
  technicalScore?: number | undefined;
  softSkillScore?: number | undefined;
  about?: string | undefined;
  projects?: { title: string; tech: string[]; description: string }[] | undefined;
  certifications?: { title: string; issuer: string; year: string }[] | undefined;
  appliedDate?: string | undefined;
  avatar?: string | undefined;
}

export interface CompanyProfile {
  name: string;
  industry: string;
  location: string;
  logoHue: number;
  description: string;
  website?: string | undefined;
}

export interface AssessmentQuestion {
  id: string;
  skill: string;
  category: string;
  prompt: string;
}

export interface FacultyInternship {
  id: string;
  title: string;
  organization: string;
  orgLogoHue?: number | undefined;
  domain: string;
  industry: string;
  duration: string;
  location: string;
  mode: "Remote" | "On-site" | "Hybrid";
  stipendOrHonorarium: string;
  description: string;
  objectives: string[];
  eligibility: string;
  deadline: string;
  startDate: string;
  registered?: boolean | undefined;
  applicationStatus?: ("Registered" | "Under Review" | "Accepted" | "Completed") | undefined;
}

export interface FacultyTraining {
  id: string;
  title: string;
  provider: string;
  providerLogoHue?: number | undefined;
  domain: string;
  duration: string;
  mode: "Online" | "Hybrid" | "In-person";
  startDate: string;
  endDate: string;
  description: string;
  syllabus: { week: number; topic: string; details: string }[];
  schedule: string;
  capacity: number;
  enrolledCount: number;
  registered?: boolean | undefined;
  progress?: number | undefined;
  certificateUrl?: string | undefined;
}

export interface FacultyFDP {
  id: string;
  title: string;
  organizer: string;
  domain: string;
  duration: string;
  mode: "Online" | "Hybrid" | "In-person";
  startDate: string;
  endDate: string;
  description: string;
  learningOutcomes: string[];
  capacity: number;
  enrolledCount: number;
  registered?: boolean | undefined;
  status?: ("Upcoming" | "In Progress" | "Completed") | undefined;
  certificateEarned?: boolean | undefined;
}

export interface ConsultancyProject {
  id: string;
  title: string;
  organization: string;
  orgLogoHue?: number | undefined;
  domain: string;
  duration: string;
  funding: string;
  description: string;
  deliverables: string[];
  deadline: string;
  applied?: boolean | undefined;
  participationStatus?: ("Open" | "Applied" | "In Progress" | "Completed") | undefined;
}

export interface ResearchProject {
  id: string;
  title: string;
  organization: string;
  orgLogoHue?: number | undefined;
  domain: string;
  duration: string;
  funding: string;
  principalInvestigator?: string | undefined;
  description: string;
  keyOutcomes: string[];
  deadline: string;
  applied?: boolean | undefined;
  participationStatus?: ("Open" | "Applied" | "In Progress" | "Completed") | undefined;
}

export interface GuestLectureSession {
  id: string;
  topic: string;
  hostInstitutionOrOrg: string;
  department: string;
  date: string;
  time: string;
  mode: "Virtual (Google Meet)" | "Virtual (Zoom)" | "In-Person";
  honorarium?: string | undefined;
  status: "Invitation Received" | "Accepted" | "Completed" | "Declined";
  notes?: string | undefined;
  attendeesExpected?: number | undefined;
  meetingLink?: string | undefined;
}

export interface StudentMentorship {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string | undefined;
  branch: string;
  year: string;
  goal: string;
  lastMeetingDate: string;
  nextMeetingDate?: string | undefined;
  meetingMode?: string | undefined;
  status: "Active" | "Completed" | "Scheduled";
  notes: string[];
  meetingHistory: { date: string; summary: string; actionItems: string }[];
}

export type DepartmentName =
  "Computer Science" | "Information Technology" | "Electronics & Comm" | "Mechanical" | "Civil";

export interface InstitutionStudent {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  avatar?: string | undefined;
  department: DepartmentName;
  year: "1st Year" | "2nd Year" | "3rd Year" | "4th Year";
  cgpa: number;
  employabilityScore: number;
  placementStatus: "Placed" | "In Process" | "Not Placed" | "Higher Studies";
  placedCompany?: string | undefined;
  packageLPA?: number | undefined;
  internshipStatus: "Completed" | "Active" | "Applied" | "Not Started";
  internshipCompany?: string | undefined;
  skills: string[];
  assessmentScores: {
    programming: number;
    communication: number;
    problemSolving: number;
    leadership: number;
    analyticalThinking: number;
    domainKnowledge: number;
  };
  readinessLevel: "High Readiness" | "Moderate Readiness" | "Developing";
  certificationsCount: number;
  projectsCount: number;
}

export interface DepartmentReport {
  id: string;
  name: DepartmentName;
  code: string;
  headOfDepartment: string;
  totalStudents: number;
  averageEmployability: number;
  placementRate: number;
  averageCTC: number;
  highestCTC: number;
  internshipParticipation: number;
  topSkills: string[];
  weakSkills: string[];
  skillAverages: {
    programming: number;
    communication: number;
    problemSolving: number;
    leadership: number;
    analyticalThinking: number;
    domainKnowledge: number;
  };
  facultyCount: number;
  activeIndustryPartners: number;
}

export interface RecruiterPartner {
  id: string;
  companyName: string;
  industry: string;
  tier: "Tier 1 (Dream)" | "Tier 2 (Super Dream)" | "Tier 3 (Core)";
  status: "Active" | "Partner" | "New Request";
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  logoHue: number;
  jobsPosted: number;
  internshipsPosted: number;
  hiresCount: number;
  avgPackageLPA: number;
  workshopsConducted: number;
  mentorshipPrograms: number;
  openRoles: string[];
  lastEngagementDate: string;
  website: string;
  description: string;
}
