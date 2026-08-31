// ==============================================================================
// AcadIn Institution Repository
// Description: Implementation of IInstitutionRepository for Supabase and Mock data
// ==============================================================================

import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { InstitutionService, type InstitutionOverviewMetrics } from "@/services/institution-service";
import type { IInstitutionRepository } from "./types";
import type { Department, InstitutionReportSnapshot } from "@/types";

export class SupabaseInstitutionRepository implements IInstitutionRepository {
  async getOverview(institutionId: string): Promise<InstitutionOverviewMetrics> {
    return InstitutionService.getOverview(institutionId);
  }

  async getDepartments(institutionId: string): Promise<Department[]> {
    return InstitutionService.getDepartments(institutionId);
  }

  async createReportSnapshot(
    institutionId: string,
    reportType: string,
    periodStart: string,
    periodEnd: string,
    data: any,
  ): Promise<{ success: boolean; snapshotId?: string; error?: string }> {
    return InstitutionService.createReportSnapshot(institutionId, reportType, periodStart, periodEnd, data);
  }

  async getReportSnapshots(institutionId: string): Promise<InstitutionReportSnapshot[]> {
    return InstitutionService.getReportSnapshots(institutionId);
  }
}

export class MockInstitutionRepository implements IInstitutionRepository {
  private mockSnapshots: InstitutionReportSnapshot[] = [
    {
      id: "snap-1",
      institutionId: "inst-nitk",
      reportType: "nirf_annual_report",
      periodStart: "2025-06-01",
      periodEnd: "2026-05-31",
      dataPayload: {
        totalEnrolled: 840,
        placedCount: 714,
        placementRate: 85.0,
        medianPackageLpa: 14.5,
      },
      generatedBy: "system_admin",
      createdAt: "2026-06-01T10:00:00Z",
    },
  ];

  async getOverview(institutionId: string): Promise<InstitutionOverviewMetrics> {
    return {
      institutionId,
      institutionName: "National Institute of Technology Karnataka (NITK)",
      totalStudents: 840,
      totalFaculty: 124,
      totalDepartments: 6,
      activeAssessmentTakers: 620,
      verifiedSkillsCount: 2450,
      internshipParticipationRate: 74.2,
      placementRate: 85.0,
      medianSalaryLpa: 14.5,
      topSkillGaps: [
        { skillName: "Kubernetes", gapPercentage: 42 },
        { skillName: "System Design", gapPercentage: 35 },
      ],
      recruiterEngagementCount: 48,
    };
  }

  async getDepartments(_institutionId: string): Promise<Department[]> {
    return [
      { id: "dept-cse", name: "Computer Science & Engineering", code: "CSE" },
      { id: "dept-it", name: "Information Technology", code: "IT" },
      { id: "dept-ece", name: "Electronics & Communication", code: "ECE" },
      { id: "dept-eee", name: "Electrical & Electronics", code: "EEE" },
      { id: "dept-mech", name: "Mechanical Engineering", code: "MECH" },
      { id: "dept-civil", name: "Civil Engineering", code: "CIVIL" },
    ];
  }

  async createReportSnapshot(
    institutionId: string,
    reportType: string,
    periodStart: string,
    periodEnd: string,
    data: any,
  ): Promise<{ success: boolean; snapshotId?: string; error?: string }> {
    const newSnap: InstitutionReportSnapshot = {
      id: `snap-${Date.now()}`,
      institutionId,
      reportType,
      periodStart,
      periodEnd,
      dataPayload: data,
      generatedBy: "admin_user",
      createdAt: new Date().toISOString(),
    };
    this.mockSnapshots.unshift(newSnap);
    return { success: true, snapshotId: newSnap.id };
  }

  async getReportSnapshots(_institutionId: string): Promise<InstitutionReportSnapshot[]> {
    return this.mockSnapshots;
  }
}

export const mockInstitutionRepository = new MockInstitutionRepository();
export const supabaseInstitutionRepository = new SupabaseInstitutionRepository();

export const institutionRepository: IInstitutionRepository = isSupabaseConfigured
  ? supabaseInstitutionRepository
  : mockInstitutionRepository;

