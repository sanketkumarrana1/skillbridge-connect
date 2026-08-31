import { supabase } from "@/lib/supabase";
import type { CompanyProfile, CompanyVerificationStatus } from "@/types/opportunity";

export interface CompanyMember {
  userId: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joinedAt: string;
}

export interface CompanyRecruitmentMetrics {
  activeOpportunities: number;
  totalApplicants: number;
  underReviewCount: number;
  shortlistedCount: number;
  assessmentCount: number;
  interviewsCount: number;
  offersCount: number;
  hiresCount: number;
  rejectedCount: number;
  shortlistRate: number;
  interviewConversion: number;
  offerConversion: number;
  hiringConversion: number;
}

export interface OpportunityPerformanceMetrics {
  opportunityId: string;
  title: string;
  totalApplicants: number;
  shortlistedCount: number;
  interviewsCount: number;
  offersCount: number;
  hiresCount: number;
  averageMatch: number;
}

export class CompanyService {
  /**
   * Fetch company profile by companyId or slug
   */
  public static async getCompanyProfile(companyIdOrSlug: string): Promise<CompanyProfile | null> {
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(companyIdOrSlug);

      if (isUuid) {
        const { data, error } = await supabase.rpc("get_company_profile", {
          p_company_id: companyIdOrSlug,
        });

        if (!error && data) {
          const res = data as any;
          return {
            name: res.name || res.display_name || "Company",
            industry: res.industry || "Technology",
            location: res.headquarters_location || "Bengaluru, Karnataka",
            logoHue: Number(res.logo_hue ?? 220),
            logoUrl: res.logo_url || undefined,
            description: res.description || "",
            website: res.website || undefined,
            companySize: res.company_size || "100 - 500 Employees",
            foundedYear: res.founded_year || "2018",
            verificationStatus: this.mapDbVerificationStatus(res.verification_status),
          };
        }
      }

      // Fallback direct table query by id or slug
      const query = supabase.from("organizations").select("*");
      const { data: org, error: orgError } = isUuid
        ? await query.eq("id", companyIdOrSlug).maybeSingle()
        : await query.eq("slug", companyIdOrSlug).maybeSingle();

      if (orgError || !org) {
        return null;
      }

      return {
        name: org.display_name || org.name,
        industry: org.industry || "Technology",
        location: org.headquarters_location || `${org.city || "Bengaluru"}, ${org.state || "Karnataka"}`,
        logoHue: Number(org.logo_hue ?? 220),
        logoUrl: org.logo_url || undefined,
        description: org.description || "",
        website: org.website || undefined,
        companySize: org.company_size || "100 - 500 Employees",
        foundedYear: org.founded_year || "2018",
        verificationStatus: this.mapDbVerificationStatus(org.verification_status),
      };
    } catch (err) {
      console.warn("[CompanyService.getCompanyProfile] Error:", err);
      return null;
    }
  }

  /**
   * Update company profile attributes
   */
  public static async updateCompanyProfile(
    companyId: string,
    updates: Partial<CompanyProfile>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.rpc("update_company_profile", {
        p_company_id: companyId,
        p_data: updates as any,
      });

      if (error) {
        console.warn("[CompanyService.updateCompanyProfile] RPC error, attempting fallback:", error.message);
        const updatePayload: Record<string, any> = {
          updated_at: new Date().toISOString(),
        };
        if (updates.name !== undefined) {
          updatePayload["name"] = updates.name;
          updatePayload["display_name"] = updates.name;
        }
        if (updates.industry !== undefined) updatePayload["industry"] = updates.industry;
        if (updates.companySize !== undefined) updatePayload["company_size"] = updates.companySize;
        if (updates.foundedYear !== undefined) updatePayload["founded_year"] = updates.foundedYear;
        if (updates.description !== undefined) updatePayload["description"] = updates.description;
        if (updates.location !== undefined) updatePayload["headquarters_location"] = updates.location;
        if (updates.website !== undefined) updatePayload["website"] = updates.website;
        if (updates.logoHue !== undefined) updatePayload["logo_hue"] = updates.logoHue;

        const { error: updateError } = await supabase
          .from("organizations")
          .update(updatePayload as any)
          .eq("id", companyId);

        if (updateError) {
          return { success: false, error: updateError.message };
        }
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to update company profile" };
    }
  }

  /**
   * Submit company for Platform Verification
   */
  public static async submitVerification(
    companyId: string,
    notes?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.rpc("submit_company_verification", {
        p_company_id: companyId,
        p_notes: notes || null,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to submit verification" };
    }
  }

  /**
   * Get members/recruiters for a company
   */
  public static async getCompanyMembers(companyId: string): Promise<CompanyMember[]> {
    try {
      const { data, error } = await supabase
        .from("organization_memberships")
        .select(`
          user_id,
          membership_role,
          status,
          created_at,
          profiles (
            full_name,
            email
          )
        `)
        .eq("organization_id", companyId);

      if (error || !data) {
        return [];
      }

      return data.map((row: any) => ({
        userId: row.user_id,
        name: row.profiles?.full_name || "Recruiter",
        email: row.profiles?.email || "",
        role: row.membership_role,
        status: row.status,
        joinedAt: row.created_at,
      }));
    } catch (err) {
      console.warn("[CompanyService.getCompanyMembers] Error:", err);
      return [];
    }
  }

  /**
   * Add a recruiter to company
   */
  public static async addRecruiter(
    companyId: string,
    userId: string,
    role: string = "recruiter"
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.rpc("add_company_recruiter", {
        p_company_id: companyId,
        p_user_id: userId,
        p_role: role,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to add recruiter" };
    }
  }

  /**
   * Assign recruiter / interviewer to specific opportunity
   */
  public static async assignOpportunityRecruiter(
    opportunityId: string,
    userId: string,
    role: string = "recruiter"
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.rpc("assign_opportunity_recruiter", {
        p_opportunity_id: opportunityId,
        p_user_id: userId,
        p_role: role,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to assign opportunity recruiter" };
    }
  }

  /**
   * Get dynamic recruitment analytics for company
   */
  public static async getCompanyRecruitmentMetrics(companyId: string): Promise<CompanyRecruitmentMetrics | null> {
    try {
      const { data, error } = await supabase.rpc("get_company_recruitment_metrics", {
        p_company_id: companyId,
      });

      if (error || !data) {
        console.warn("[CompanyService.getCompanyRecruitmentMetrics] Error:", error?.message);
        return null;
      }

      return data as unknown as CompanyRecruitmentMetrics;
    } catch (err) {
      console.warn("[CompanyService.getCompanyRecruitmentMetrics] Error:", err);
      return null;
    }
  }

  /**
   * Get opportunity-specific performance funnel metrics
   */
  public static async getOpportunityPerformance(
    opportunityId: string
  ): Promise<OpportunityPerformanceMetrics | null> {
    try {
      const { data, error } = await supabase.rpc("get_opportunity_performance", {
        p_opportunity_id: opportunityId,
      });

      if (error || !data) {
        return null;
      }

      return data as unknown as OpportunityPerformanceMetrics;
    } catch (err) {
      console.warn("[CompanyService.getOpportunityPerformance] Error:", err);
      return null;
    }
  }

  private static mapDbVerificationStatus(status?: string): CompanyVerificationStatus {
    switch (status?.toLowerCase()) {
      case "verified":
        return "Verified";
      case "pending":
        return "Pending";
      default:
        return "Rejected";
    }
  }
}
