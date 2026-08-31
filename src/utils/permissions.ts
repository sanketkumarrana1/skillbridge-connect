import type { Role, Permission } from "@/types";

export const ROLE_POLICIES: Record<Role, Permission[]> = {
  student: [
    "viewOpportunities",
    "applyOpportunity",
    "manageProfile",
    "takeAssessment",
    "viewSkillPassport",
    "requestMentorship",
    "viewPlacementTimeline",
  ],
  industry: [
    "viewOpportunities",
    "createOpportunity",
    "editOpportunity",
    "deleteOpportunity",
    "manageApplicants",
    "scheduleInterviews",
    "submitInterviewFeedback",
    "issueCorporateOffers",
    "provideMentorship",
  ],
  academician: [
    "manageProfile",
    "manageFacultyPrograms",
    "applyFacultyInternship",
    "provideMentorship",
    "viewOpportunities",
  ],
  institution: [
    "viewInstitutionAnalytics",
    "viewDepartmentReports",
    "exportAccreditationReports",
    "manageRecruiterPartners",
    "viewOpportunities",
  ],
};

export const ADMIN_PERMISSIONS: Permission[] = [
  "viewOpportunities",
  "managePlatformUsers",
  "verifyCompanies",
  "managePlatformSkills",
  "moderateOpportunities",
  "viewPlatformReports",
  "viewAuditLog",
  "exportAccreditationReports",
  "viewInstitutionAnalytics",
];

export function hasPermission(role: Role | "admin", permission: Permission): boolean {
  if (role === "admin") {
    return ADMIN_PERMISSIONS.includes(permission);
  }
  const allowed = ROLE_POLICIES[role] || [];
  return allowed.includes(permission);
}

export function getRolePermissions(role: Role | "admin"): Permission[] {
  if (role === "admin") {
    return ADMIN_PERMISSIONS;
  }
  return ROLE_POLICIES[role] || [];
}
