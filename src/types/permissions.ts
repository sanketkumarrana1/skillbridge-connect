import type { Role } from "./index";

export type Permission =
  | "viewOpportunities"
  | "applyOpportunity"
  | "manageProfile"
  | "takeAssessment"
  | "viewSkillPassport"
  | "requestMentorship"
  | "viewPlacementTimeline"
  | "createOpportunity"
  | "editOpportunity"
  | "deleteOpportunity"
  | "manageApplicants"
  | "scheduleInterviews"
  | "submitInterviewFeedback"
  | "issueCorporateOffers"
  | "manageFacultyPrograms"
  | "applyFacultyInternship"
  | "provideMentorship"
  | "viewInstitutionAnalytics"
  | "viewDepartmentReports"
  | "exportAccreditationReports"
  | "manageRecruiterPartners"
  | "managePlatformUsers"
  | "verifyCompanies"
  | "managePlatformSkills"
  | "moderateOpportunities"
  | "viewPlatformReports"
  | "viewAuditLog";

export interface RolePolicy {
  role: Role;
  permissions: Permission[];
}
