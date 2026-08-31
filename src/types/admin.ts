import type { Role, OpportunityType } from "./index";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "moderator" | "auditor";
  avatar?: string | undefined;
  lastLogin: string;
}

export type PlatformUserStatus = "Active" | "Pending" | "Suspended";

export interface PlatformUserRecord {
  id: string;
  name: string;
  email: string;
  role: Role;
  organizationOrCollege: string;
  status: PlatformUserStatus;
  joinedAt: string;
  verified: boolean;
}

export type CompanyVerificationActionStatus = "Pending" | "Verified" | "Rejected";

export interface CompanyVerificationRecord {
  id: string;
  companyName: string;
  industry: string;
  website: string;
  cinOrRegistration: string;
  contactPerson: string;
  contactEmail: string;
  verificationStatus: CompanyVerificationActionStatus;
  submittedAt: string;
  reviewedAt?: string | undefined;
  reviewerNotes?: string | undefined;
}

export type OpportunityModerationStatus = "Pending Review" | "Published" | "Rejected" | "Closed";

export interface ModeratedOpportunityRecord {
  id: string;
  title: string;
  company: string;
  type: OpportunityType;
  stipendOrSalary: string;
  location: string;
  skills: string[];
  status: OpportunityModerationStatus;
  submittedAt: string;
  moderationNotes?: string | undefined;
}

export interface AdminAuditLogEntry {
  id: string;
  timestamp: string;
  admin: string;
  action: string;
  entity: "User" | "Company" | "Institution" | "Skill" | "Opportunity" | "System";
  entityId: string;
  details: string;
}

export interface PlatformMetrics {
  totalUsers: number;
  totalStudents: number;
  totalAcademicians: number;
  totalInstitutions: number;
  totalCompanies: number;
  activeOpportunities: number;
  totalApplications: number;
  totalPlacements: number;
  activeCollaborations: number;
  pendingVerifications: number;
  pendingModerations: number;
}

export interface InstitutionManagementRecord {
  id: string;
  name: string;
  type: string;
  city: string;
  state: string;
  status: string;
  studentCount: number;
  facultyCount: number;
}

export interface ModerationItemRecord {
  id: string;
  entityType: string;
  entityId: string;
  reason: string;
  status: "open" | "reviewing" | "resolved" | "dismissed";
  assignedTo?: string | undefined;
  resolution?: string | undefined;
  notes?: string | undefined;
  createdAt: string;
  resolvedAt?: string | undefined;
}


