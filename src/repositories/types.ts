import type {
  StudentProfile,
  Opportunity,
  ApplicationSnapshot,
  CollaborationRecord,
  CollaborationLifecycle,
  ApplicationStatus,
} from "@/types";
import type {
  AssessmentAttempt,
  AssessmentQuestion,
  AssessmentSetupConfig,
} from "@/types/assessment";

export interface IStudentRepository {
  getProfile(studentId?: string): Promise<StudentProfile | null>;
  updateProfile(profile: Partial<StudentProfile>): Promise<StudentProfile>;
}

export interface IAssessmentRepository {
  createAssessment(
    studentId: string,
    config: AssessmentSetupConfig,
  ): Promise<{ attemptId: string; questions: AssessmentQuestion[] }>;
  submitAttempt(
    attemptId: string,
    answers: Record<string, number>,
    timeUsedSeconds: number,
  ): Promise<AssessmentAttempt>;
  getHistory(studentId: string): Promise<AssessmentAttempt[]>;
  getLatestResult(studentId: string): Promise<AssessmentAttempt | null>;
}

export interface IOpportunityRepository {
  getAll(): Promise<Opportunity[]>;
  getById(id: string): Promise<Opportunity | null>;
  search(filters?: {
    type?: string;
    skills?: string[];
    workMode?: string;
    location?: string;
    query?: string;
  }): Promise<Opportunity[]>;
  create(opportunity: Omit<Opportunity, "id">): Promise<Opportunity>;
  update(id: string, patch: Partial<Opportunity>): Promise<Opportunity>;
  delete(id: string): Promise<boolean>;
  publish(id: string): Promise<boolean>;
  close(id: string): Promise<boolean>;
}

export interface ISavedOpportunityRepository {
  getSavedIds(studentId: string): Promise<string[]>;
  save(studentId: string, opportunityId: string): Promise<boolean>;
  unsave(studentId: string, opportunityId: string): Promise<boolean>;
}

export interface ApplicationTimelineEvent {
  id: string;
  from_status: string | null;
  to_status: string;
  changed_at: string;
  reason?: string | null | undefined;
  changed_by_name?: string | null | undefined;
  metadata?: Record<string, any> | null | undefined;
}

export interface IApplicationRepository {
  getAll(): Promise<ApplicationSnapshot[]>;
  getById(id: string): Promise<ApplicationSnapshot | null>;
  getByStudentId(studentId: string): Promise<ApplicationSnapshot[]>;
  getByOpportunityId(opportunityId: string): Promise<ApplicationSnapshot[]>;
  submit(application: Omit<ApplicationSnapshot, "id" | "submittedAt">, answers?: Record<string, any>): Promise<ApplicationSnapshot>;
  updateStatus(id: string, status: ApplicationStatus, reason?: string, metadata?: Record<string, any>): Promise<ApplicationSnapshot | null>;
  withdraw(id: string, reason?: string): Promise<boolean>;
  getTimeline(applicationId: string): Promise<ApplicationTimelineEvent[]>;
}

export interface ICollaborationRepository {
  getAll(): Promise<CollaborationRecord[]>;
  getById(id: string): Promise<CollaborationRecord | null>;
  create(collab: Omit<CollaborationRecord, "id">): Promise<CollaborationRecord>;
  updateStatus(id: string, status: CollaborationLifecycle): Promise<CollaborationRecord | null>;
}

export interface ICompanyRepository {
  getProfile(companyIdOrSlug: string): Promise<import("@/types/opportunity").CompanyProfile | null>;
  updateProfile(companyId: string, patch: Partial<import("@/types/opportunity").CompanyProfile>): Promise<boolean>;
  submitVerification(companyId: string, notes?: string): Promise<boolean>;
  getMembers(companyId: string): Promise<import("@/services/company-service").CompanyMember[]>;
  addRecruiter(companyId: string, userId: string, role?: string): Promise<boolean>;
  assignOpportunityRecruiter(opportunityId: string, userId: string, role?: string): Promise<boolean>;
  getRecruitmentMetrics(companyId: string): Promise<import("@/services/company-service").CompanyRecruitmentMetrics | null>;
  getOpportunityPerformance(opportunityId: string): Promise<import("@/services/company-service").OpportunityPerformanceMetrics | null>;
}

export interface IInstitutionRepository {
  getOverview(institutionId: string): Promise<import("@/services/institution-service").InstitutionOverviewMetrics>;
  getDepartments(institutionId: string): Promise<import("@/types").Department[]>;
  createReportSnapshot(
    institutionId: string,
    reportType: string,
    periodStart: string,
    periodEnd: string,
    data: any,
  ): Promise<{ success: boolean; snapshotId?: string; error?: string }>;
  getReportSnapshots(institutionId: string): Promise<import("@/types").InstitutionReportSnapshot[]>;
}

export interface IAdminRepository {
  getMetrics(): Promise<import("@/types").PlatformMetrics>;
  getUsers(role?: string, status?: string, search?: string): Promise<import("@/types").PlatformUserRecord[]>;
  updateUserStatus(userId: string, status: import("@/types").PlatformUserStatus, reason?: string): Promise<{ success: boolean; error?: string }>;
  getCompanies(verificationStatus?: string, search?: string): Promise<import("@/types").CompanyVerificationRecord[]>;
  verifyCompany(
    companyId: string,
    status: import("@/types").CompanyVerificationActionStatus,
    reason?: string,
    notes?: string,
  ): Promise<{ success: boolean; error?: string }>;
  getInstitutions(status?: string, search?: string): Promise<import("@/types").InstitutionManagementRecord[]>;
  updateInstitutionStatus(institutionId: string, status: string, reason?: string): Promise<{ success: boolean; error?: string }>;
  getOpportunities(status?: string, search?: string): Promise<import("@/types").ModeratedOpportunityRecord[]>;
  moderateOpportunity(
    opportunityId: string,
    status: import("@/types").OpportunityModerationStatus,
    reason?: string,
  ): Promise<{ success: boolean; error?: string }>;
  manageSkill(action: "create" | "update" | "delete", skillData: any): Promise<{ success: boolean; skillId?: string; error?: string }>;
  getAuditLogs(limit?: number, offset?: number): Promise<import("@/types").AdminAuditLogEntry[]>;
  getModerationQueue(): Promise<import("@/types").ModerationItemRecord[]>;
}

