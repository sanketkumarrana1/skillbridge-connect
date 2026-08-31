export type MentorType = "faculty" | "industry";

export type MentorshipRequestStatus =
  | "Requested"
  | "Accepted"
  | "Declined"
  | "Reschedule Requested"
  | "Scheduled"
  | "Completed"
  | "Cancelled";

export type MentorshipSessionMode = "Online" | "In Person";

export type MentorshipSessionStatus = "Scheduled" | "Completed" | "Cancelled";

export interface MentorAvailabilitySlot {
  dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  timeSlots: string[]; // e.g. ["10:00 AM - 11:00 AM", "04:00 PM - 05:00 PM"]
}

export interface MentorRatingSummary {
  averageRating: number; // e.g. 4.9
  totalReviews: number;
  helpfulCount: number;
}

export interface Mentor {
  id: string;
  name: string;
  type: MentorType;
  organization: string;
  departmentOrTitle: string;
  avatar?: string | undefined;
  expertise: string[];
  skills: string[];
  experienceYears: number;
  areasOfMentorship: string[];
  sessionDurationMinutes: number;
  availability: MentorAvailabilitySlot[];
  bio: string;
  ratingSummary?: MentorRatingSummary | undefined;
  linkedInUrl?: string | undefined;
}

export interface MentorshipRequest {
  id: string;
  studentId: string;
  studentName: string;
  mentorId: string;
  mentorName: string;
  mentorType: MentorType;
  mentorOrganization: string;
  requestedAt: string;
  purpose: string;
  preferredDate: string;
  preferredTime: string;
  status: MentorshipRequestStatus;
  notes?: string | undefined;
  proposedRescheduleDate?: string | undefined;
  proposedRescheduleTime?: string | undefined;
}

export interface MentorshipOutcome {
  topicsDiscussed: string[];
  followUpRecommendations: string[];
  summary: string;
  recordedAt: string;
}

export interface MentorshipStudentFeedback {
  rating: number; // 1 to 5
  helpfulness: "Extremely Helpful" | "Very Helpful" | "Moderately Helpful" | "Slightly Helpful";
  comment: string;
  submittedAt: string;
}

export interface MentorshipSession {
  id: string;
  requestId: string;
  studentId: string;
  studentName: string;
  mentorId: string;
  mentorName: string;
  mentorType: MentorType;
  mentorOrganization: string;
  date: string;
  startTime: string;
  endTime: string;
  mode: MentorshipSessionMode;
  meetingLink?: string | undefined;
  location?: string | undefined;
  status: MentorshipSessionStatus;
  purpose: string;
  mentorPrivateNotes?: string | undefined;
  outcome?: MentorshipOutcome | undefined;
  studentFeedback?: MentorshipStudentFeedback | undefined;
}

export interface PlacementHistoryItem {
  id: string;
  studentId: string;
  company: string;
  role: string;
  opportunityType: "Internship" | "Full-time" | "Contract" | "Live Project";
  joiningDate: string;
  placementCycle: string;
  compensation?: string | undefined;
  relevantSkills: string[];
  verifiedAt: string;
  status: "Offer Accepted" | "Onboarded" | "Completed";
}

