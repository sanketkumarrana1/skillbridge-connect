// ==============================================================================
// AcadIn Admin Repository
// Description: Implementation of IAdminRepository for Supabase and Mock data
// ==============================================================================

import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { AdminService } from "@/services/admin-service";
import type { IAdminRepository } from "./types";
import type {
  PlatformMetrics,
  PlatformUserRecord,
  PlatformUserStatus,
  CompanyVerificationRecord,
  CompanyVerificationActionStatus,
  InstitutionManagementRecord,
  ModeratedOpportunityRecord,
  OpportunityModerationStatus,
  SkillDefinition,
  AdminAuditLogEntry,
  ModerationItemRecord,
} from "@/types";

export class SupabaseAdminRepository implements IAdminRepository {
  async getMetrics(): Promise<PlatformMetrics> {
    return AdminService.getPlatformMetrics();
  }

  async getUsers(role?: string, status?: string, search?: string): Promise<PlatformUserRecord[]> {
    return AdminService.listUsers({ role, status, search });
  }

  async updateUserStatus(userId: string, status: PlatformUserStatus, reason?: string): Promise<{ success: boolean; error?: string }> {
    return AdminService.updateUserStatus(userId, status, reason);
  }

  async getCompanies(verificationStatus?: string, search?: string): Promise<CompanyVerificationRecord[]> {
    return AdminService.listCompanies({ verificationStatus, search });
  }

  async verifyCompany(
    companyId: string,
    status: CompanyVerificationActionStatus,
    reason?: string,
    notes?: string,
  ): Promise<{ success: boolean; error?: string }> {
    return AdminService.verifyCompany(companyId, status, reason, notes);
  }

  async getInstitutions(status?: string, search?: string): Promise<InstitutionManagementRecord[]> {
    return AdminService.listInstitutions({ status, search });
  }

  async updateInstitutionStatus(institutionId: string, status: string, reason?: string): Promise<{ success: boolean; error?: string }> {
    return AdminService.updateInstitutionStatus(institutionId, status, reason);
  }

  async getOpportunities(status?: string, search?: string): Promise<ModeratedOpportunityRecord[]> {
    return AdminService.listOpportunities({ status, search });
  }

  async moderateOpportunity(
    opportunityId: string,
    status: OpportunityModerationStatus,
    reason?: string,
  ): Promise<{ success: boolean; error?: string }> {
    return AdminService.moderateOpportunity(opportunityId, status, reason);
  }

  async manageSkill(action: "create" | "update" | "delete", skillData: any): Promise<{ success: boolean; skillId?: string; error?: string }> {
    return AdminService.manageSkill(action, skillData);
  }

  async getAuditLogs(limit?: number, offset?: number): Promise<AdminAuditLogEntry[]> {
    return AdminService.getAuditLogs(limit, offset);
  }

  async getModerationQueue(): Promise<ModerationItemRecord[]> {
    return AdminService.getModerationQueue();
  }
}

export class MockAdminRepository implements IAdminRepository {
  async getMetrics(): Promise<PlatformMetrics> {
    return {
      totalUsers: 1420,
      totalStudents: 1040,
      totalAcademicians: 170,
      totalInstitutions: 45,
      totalCompanies: 65,
      activeOpportunities: 180,
      totalApplications: 4500,
      totalPlacements: 320,
      activeCollaborations: 24,
      pendingVerifications: 8,
      pendingModerations: 2,
    };
  }

  async getUsers(_role?: string, _status?: string, _search?: string): Promise<PlatformUserRecord[]> {
    return [
      {
        id: "usr-1",
        name: "Aarav Sharma",
        email: "aarav.sharma@example.com",
        role: "student",
        organizationOrCollege: "NITK Surathkal",
        status: "Active",
        joinedAt: "2026-08-01T10:00:00Z",
        verified: true,
      },
      {
        id: "usr-2",
        name: "Priya Nair",
        email: "priya.nair@techcorp.com",
        role: "industry",
        organizationOrCollege: "TechCorp Systems",
        status: "Active",
        joinedAt: "2026-08-05T14:30:00Z",
        verified: true,
      },
    ];
  }

  async updateUserStatus(_userId: string, _status: PlatformUserStatus, _reason?: string): Promise<{ success: boolean; error?: string }> {
    return { success: true };
  }

  async getCompanies(_verificationStatus?: string, _search?: string): Promise<CompanyVerificationRecord[]> {
    return [
      {
        id: "comp-1",
        companyName: "TechCorp Systems",
        website: "https://techcorp.com",
        industry: "Enterprise Software",
        cinOrRegistration: "U72200KA2024PTC123456",
        contactPerson: "Priya Nair",
        contactEmail: "priya.nair@techcorp.com",
        verificationStatus: "Verified",
        submittedAt: "2026-08-01T10:00:00Z",
        reviewerNotes: "CIN and domain verified.",
      },
    ];
  }

  async verifyCompany(
    _companyId: string,
    _status: CompanyVerificationActionStatus,
    _reason?: string,
    _notes?: string,
  ): Promise<{ success: boolean; error?: string }> {
    return { success: true };
  }

  async getInstitutions(_status?: string, _search?: string): Promise<InstitutionManagementRecord[]> {
    return [
      {
        id: "inst-1",
        name: "National Institute of Technology Karnataka",
        type: "Institute of National Importance",
        city: "Surathkal",
        state: "Karnataka",
        status: "Active",
        studentCount: 840,
        facultyCount: 124,
      },
    ];
  }

  async updateInstitutionStatus(_institutionId: string, _status: string, _reason?: string): Promise<{ success: boolean; error?: string }> {
    return { success: true };
  }

  async getOpportunities(_status?: string, _search?: string): Promise<ModeratedOpportunityRecord[]> {
    return [
      {
        id: "opp-1",
        title: "Frontend Engineering Intern",
        company: "TechCorp Systems",
        type: "Internship",
        stipendOrSalary: "₹45,000/month",
        location: "Bangalore (Hybrid)",
        skills: ["React", "TypeScript", "Tailwind CSS"],
        status: "Published",
        submittedAt: "2026-08-20T09:00:00Z",
        moderationNotes: "Complies with compensation standards.",
      },
      {
        id: "opp-2",
        title: "Cloud Infrastructure Engineer",
        company: "CloudNative Labs",
        type: "Job",
        stipendOrSalary: "₹18 - ₹24 LPA",
        location: "Gurgaon (On-site)",
        skills: ["Docker", "Kubernetes", "AWS"],
        status: "Pending Review",
        submittedAt: "2026-08-29T11:30:00Z",
        moderationNotes: "Reviewing company verification status first.",
      },
    ];
  }

  async moderateOpportunity(
    _opportunityId: string,
    _status: OpportunityModerationStatus,
    _reason?: string,
  ): Promise<{ success: boolean; error?: string }> {
    return { success: true };
  }

  async manageSkill(_action: "create" | "update" | "delete", _skillData: any): Promise<{ success: boolean; skillId?: string; error?: string }> {
    return { success: true, skillId: "skill-adm-mock" };
  }

  async getAuditLogs(_limit?: number, _offset?: number): Promise<AdminAuditLogEntry[]> {
    return [
      {
        id: "audit-1",
        timestamp: "2026-08-30 11:30 IST",
        admin: "Platform Administrator",
        action: "Company Verification Approved",
        entity: "Company",
        entityId: "comp-1",
        details: "Verified CIN and tax registration for TechCorp Systems.",
      },
    ];
  }

  async getModerationQueue(): Promise<ModerationItemRecord[]> {
    return [
      {
        id: "mod-1",
        entityType: "company",
        entityId: "comp-2",
        reason: "New company registration pending CIN verification.",
        status: "open",
        createdAt: "2026-08-30T10:00:00Z",
      },
    ];
  }
}

export const mockAdminRepository = new MockAdminRepository();
export const supabaseAdminRepository = new SupabaseAdminRepository();

export const adminRepository: IAdminRepository = isSupabaseConfigured
  ? supabaseAdminRepository
  : mockAdminRepository;
