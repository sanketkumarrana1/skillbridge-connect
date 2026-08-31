export type CollaborationType =
  | "Live Industry Project"
  | "Faculty Internship"
  | "Industrial Training"
  | "FDP"
  | "Consultancy"
  | "Research"
  | "Guest Lecture"
  | "Mentorship";

export type CollaborationLifecycle =
  | "Proposed"
  | "Requested"
  | "Approved"
  | "Active"
  | "Completed"
  | "Outcome Recorded";

export interface CollaborationOutcome {
  participantsCount: number;
  skillsDeveloped: string[];
  completionRate: number; // 0 - 100%
  industryFeedbackScore: number; // 1 - 5
  facultyFeedbackScore?: number | undefined;
  studentFeedbackScore?: number | undefined;
  deliverablesCompleted: string[];
  placementImpactNotes?: string | undefined;
  recordedAt: string;
}

export interface CollaborationRecord {
  id: string;
  title: string;
  type: CollaborationType;
  partnerCompany: string;
  partnerLogoHue?: number | undefined;
  facultyLead: string;
  facultyDepartment: string;
  participatingStudentIds?: string[] | undefined;
  participatingStudentsCount?: number | undefined;
  status: CollaborationLifecycle;
  startDate: string;
  endDate: string;
  fundingOrBudget?: string | undefined;
  description: string;
  deliverables: string[];
  outcome?: CollaborationOutcome | undefined;
}

