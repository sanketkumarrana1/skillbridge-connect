import type { DeclaredSkill, SkillCategory, SkillProficiency, StudentProfile } from "./index";
import type { CareerReadinessScore } from "./career-readiness";

export type OpportunityType =
  | "Internship"
  | "Job"
  | "Live Project"
  | "Apprenticeship"
  | "Training Program";

export type OpportunityWorkMode = "Remote" | "Hybrid" | "On-site";

export type OpportunityStatus = "Published" | "Draft" | "Closed";

export type OpportunityExperienceLevel = "Fresher" | "0-1 yr" | "1-2 yr" | "2+ yr" | "Any";

export interface OpportunityEligibility {
  degreeRequirements: string[]; // e.g. ["B.Tech", "B.E.", "BCA", "MCA", "B.Sc"]
  departmentRequirements: string[]; // e.g. ["Computer Science", "Information Technology", "Electronics"]
  graduationRequirements: string[]; // e.g. ["2024", "2025", "2026", "2027"]
  minCgpa?: number | undefined; // e.g. 7.0
  experienceRequirements?: string | undefined; // e.g. "Fresher / 0-1 yr"
  mandatorySkills?: string[] | undefined; // critical must-have skills
}

export interface OpportunityCompensation {
  type: "Stipend" | "Salary" | "Unpaid" | "Completion Bonus" | "Free";
  amount?: string | undefined; // e.g. "₹25,000 / month" or "₹8 - ₹12 LPA"
  currency?: string | undefined; // "INR"
  formatted: string; // e.g. "₹35,000 / mo" or "₹10-14 LPA" or "Performance Bonus"
}

export interface OpportunityLiveProjectDetails {
  problemStatement: string;
  expectedOutcome: string;
  mentorName: string;
  mentorRole: string;
  mentorCompany: string;
  mentorAvatar?: string | undefined;
  teamSize: string; // e.g. "2-4 Students"
  deliverables: string[];
  weeklyCommitmentHours?: number | undefined;
}

export interface OpportunityTrainingDetails {
  skillsTaught: string[];
  prerequisites: string[];
  certificationProvided: boolean;
  certificationName?: string | undefined;
  provider: string;
  completionOutcome: string;
  batchStartDate?: string | undefined;
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  companyId: string;
  companyLogoHue?: number | undefined;
  companyWebsite?: string | undefined;
  type: OpportunityType;
  category: SkillCategory;
  domain: string; // e.g. "Frontend Engineering", "Full Stack", "DevOps & Cloud"
  experienceLevel: OpportunityExperienceLevel;
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  eligibility: OpportunityEligibility;
  location: string;
  workMode: OpportunityWorkMode;
  duration: string; // e.g. "6 Months", "Full Time", "8 Weeks"
  compensation: OpportunityCompensation;
  applicationDeadline: string; // ISO date string e.g. "2026-09-30"
  openings: number;
  hiringProcess: string[]; // e.g. ["Application Review", "Skill Assessment", "Technical Interview", "HR Round"]
  status: OpportunityStatus;
  postedDate: string; // ISO date string e.g. "2026-08-20"
  featured?: boolean | undefined;

  // Type-specific extensions
  liveProjectDetails?: OpportunityLiveProjectDetails | undefined;
  trainingDetails?: OpportunityTrainingDetails | undefined;
}

export interface EligibilityCheckResult {
  isEligible: boolean;
  score: number; // 0-100
  passedCriteria: string[];
  disqualifyingCriteria: string[];
  notes: string[];
}

export type OpportunityMatchCategory =
  | "Best Match"
  | "Quick Win"
  | "Skill-Building"
  | "General Match"
  | "Not Eligible";

export interface OpportunityMatchResult {
  opportunityId: string;
  overallMatch: number; // 0-100
  categoryTag: OpportunityMatchCategory;
  skillFit: number; // 0-100
  eligibilityFit: number; // 0-100
  careerFit: number; // 0-100
  readinessFit: number; // 0-100
  evidenceFit: number; // 0-100
  preferenceFit: number; // 0-100

  matchingSkills: {
    name: string;
    level?: SkillProficiency | undefined;
    score?: number | undefined;
    isAssessed: boolean;
    evidenceCount: number;
  }[];
  missingSkills: string[];

  strengths: string[];
  concerns: string[];

  // Detailed Grounded Explanation
  whyYouMatch: string[];
  whatIsMissing: string[];
  whatWouldImproveYourMatch: string[];

  eligibilityResult: EligibilityCheckResult;
}

export interface ApplicationSnapshot {
  id: string;
  studentId: string;
  opportunityId: string;
  opportunityTitle: string;
  opportunityType: OpportunityType;
  company: string;
  companyLogoHue?: number | undefined;
  submittedAt: string; // ISO timestamp
  status: import("./index").ApplicationStatus;
  matchScore: number;
  skillFit: number;
  eligibilityFit: number;
  readinessScore: number;
  salaryOrStipend: string;
  answers?: Record<string, string> | undefined;
  nextStep?: string | undefined;
  snapshotProfile: {
    name: string;
    email?: string | undefined;
    degree: string;
    branch: string;
    college: string;
    graduationYear: string;
    cgpa?: string | undefined;
    skillsCount: number;
    assessedSkillsCount: number;
    projectsCount: number;
    certificationsCount: number;
    careerReadinessScore: number;
  };
}

export type CompanyVerificationStatus = "Verified" | "Pending" | "Rejected";

export interface CompanyProfile {
  name: string;
  industry: string;
  location: string;
  logoHue: number;
  logoUrl?: string | undefined;
  description: string;
  website?: string | undefined;
  companySize?: string | undefined;
  foundedYear?: string | undefined;
  verificationStatus: CompanyVerificationStatus;
}

export interface RecruiterAssessmentAssignment {
  id: string;
  applicationId: string;
  candidateName: string;
  type: "Technical" | "Skill-Specific" | "Custom";
  assessmentTitle: string;
  durationMinutes: number;
  deadline: string;
  status: "Assigned" | "Completed" | "Pending";
  score?: number | undefined;
  assignedAt: string;
  completedAt?: string | undefined;
}

export interface InterviewFeedbackRecord {
  id: string;
  interviewId: string;
  candidateId: string;
  candidateName: string;
  role: string;
  ratings: {
    technical: number; // 1-5 or 0-100
    problemSolving: number;
    communication: number;
    teamwork: number;
    roleFit: number;
  };
  strengths: string[];
  concerns: string[];
  notes: string;
  recommendation: "Strong Hire" | "Hire" | "Hold" | "No Hire";
  submittedBy: string;
  submittedAt: string;
}

export type CorporateOfferStatus = "Draft" | "Sent" | "Accepted" | "Declined" | "Expired";

export interface CorporateOffer {
  id: string;
  candidateId: string;
  candidateName: string;
  opportunityId: string;
  opportunityTitle: string;
  designation: string;
  company: string;
  joiningDate: string;
  compensation: string;
  workMode: OpportunityWorkMode;
  location: string;
  offerExpiry: string;
  status: CorporateOfferStatus;
  terms?: string | undefined;
  sentAt?: string | undefined;
  respondedAt?: string | undefined;
}

export interface RecruiterNotificationEvent {
  id: string;
  type:
    | "application_received"
    | "candidate_shortlisted"
    | "assessment_completed"
    | "interview_scheduled"
    | "interview_completed"
    | "offer_sent"
    | "offer_accepted"
    | "offer_declined"
    | "candidate_rejected";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string | undefined;
}

