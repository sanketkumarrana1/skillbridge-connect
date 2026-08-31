import type { ICompanyRepository } from "./types";
import type { CompanyProfile } from "@/types/opportunity";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  CompanyService,
  type CompanyMember,
  type CompanyRecruitmentMetrics,
  type OpportunityPerformanceMetrics,
} from "@/services/company-service";

export class SupabaseCompanyRepository implements ICompanyRepository {
  async getProfile(companyIdOrSlug: string): Promise<CompanyProfile | null> {
    return CompanyService.getCompanyProfile(companyIdOrSlug);
  }

  async updateProfile(companyId: string, patch: Partial<CompanyProfile>): Promise<boolean> {
    const res = await CompanyService.updateCompanyProfile(companyId, patch);
    return res.success;
  }

  async submitVerification(companyId: string, notes?: string): Promise<boolean> {
    const res = await CompanyService.submitVerification(companyId, notes);
    return res.success;
  }

  async getMembers(companyId: string): Promise<CompanyMember[]> {
    return CompanyService.getCompanyMembers(companyId);
  }

  async addRecruiter(companyId: string, userId: string, role: string = "recruiter"): Promise<boolean> {
    const res = await CompanyService.addRecruiter(companyId, userId, role);
    return res.success;
  }

  async assignOpportunityRecruiter(
    opportunityId: string,
    userId: string,
    role: string = "recruiter"
  ): Promise<boolean> {
    const res = await CompanyService.assignOpportunityRecruiter(opportunityId, userId, role);
    return res.success;
  }

  async getRecruitmentMetrics(companyId: string): Promise<CompanyRecruitmentMetrics | null> {
    return CompanyService.getCompanyRecruitmentMetrics(companyId);
  }

  async getOpportunityPerformance(opportunityId: string): Promise<OpportunityPerformanceMetrics | null> {
    return CompanyService.getOpportunityPerformance(opportunityId);
  }
}

export class MockCompanyRepository implements ICompanyRepository {
  private profiles: Map<string, CompanyProfile> = new Map();
  private members: Map<string, CompanyMember[]> = new Map();

  constructor() {
    const techcorp: CompanyProfile = {
      name: "TechCorp Systems",
      industry: "Enterprise Cloud & SaaS",
      location: "Bengaluru, Karnataka",
      logoHue: 220,
      description: "Leading digital innovation partner building high-scale enterprise cloud infrastructure.",
      website: "https://techcorp.example.com",
      companySize: "1,000 - 5,000 Employees",
      foundedYear: "2014",
      verificationStatus: "Verified",
    };
    this.profiles.set("techcorp-systems", techcorp);
    this.profiles.set("default", techcorp);

    this.members.set("techcorp-systems", [
      {
        userId: "recruiter-1",
        name: "Priya Sharma",
        email: "priya.sharma@techcorp.example.com",
        role: "owner",
        status: "active",
        joinedAt: new Date().toISOString(),
      },
      {
        userId: "recruiter-2",
        name: "Arjun Verma",
        email: "arjun.verma@techcorp.example.com",
        role: "recruiter",
        status: "active",
        joinedAt: new Date().toISOString(),
      },
    ]);
  }

  async getProfile(companyIdOrSlug: string): Promise<CompanyProfile | null> {
    return this.profiles.get(companyIdOrSlug) || this.profiles.get("default") || null;
  }

  async updateProfile(companyId: string, patch: Partial<CompanyProfile>): Promise<boolean> {
    const current = (await this.getProfile(companyId)) || {
      name: "TechCorp Systems",
      industry: "Technology",
      location: "Bengaluru, Karnataka",
      logoHue: 220,
      description: "",
      verificationStatus: "Verified",
    };
    this.profiles.set(companyId, { ...current, ...patch });
    this.profiles.set("default", { ...current, ...patch });
    return true;
  }

  async submitVerification(companyId: string, _notes?: string): Promise<boolean> {
    const current = await this.getProfile(companyId);
    if (current) {
      current.verificationStatus = "Pending";
      this.profiles.set(companyId, current);
    }
    return true;
  }

  async getMembers(companyId: string): Promise<CompanyMember[]> {
    return this.members.get(companyId) || this.members.get("techcorp-systems") || [];
  }

  async addRecruiter(companyId: string, userId: string, role: string = "recruiter"): Promise<boolean> {
    const current = await this.getMembers(companyId);
    current.push({
      userId,
      name: "New Recruiter",
      email: `${userId}@company.internal`,
      role,
      status: "active",
      joinedAt: new Date().toISOString(),
    });
    this.members.set(companyId, current);
    return true;
  }

  async assignOpportunityRecruiter(
    _opportunityId: string,
    _userId: string,
    _role: string = "recruiter"
  ): Promise<boolean> {
    return true;
  }

  async getRecruitmentMetrics(_companyId: string): Promise<CompanyRecruitmentMetrics | null> {
    return {
      activeOpportunities: 6,
      totalApplicants: 42,
      underReviewCount: 18,
      shortlistedCount: 12,
      assessmentCount: 5,
      interviewsCount: 8,
      offersCount: 3,
      hiresCount: 2,
      rejectedCount: 4,
      shortlistRate: 29,
      interviewConversion: 67,
      offerConversion: 38,
      hiringConversion: 5,
    };
  }

  async getOpportunityPerformance(opportunityId: string): Promise<OpportunityPerformanceMetrics | null> {
    return {
      opportunityId,
      title: "Frontend Engineering Intern",
      totalApplicants: 14,
      shortlistedCount: 6,
      interviewsCount: 3,
      offersCount: 1,
      hiresCount: 1,
      averageMatch: 86.5,
    };
  }
}

export const companyRepository: ICompanyRepository = isSupabaseConfigured
  ? new SupabaseCompanyRepository()
  : new MockCompanyRepository();

export const mockCompanyRepository: ICompanyRepository = new MockCompanyRepository();
