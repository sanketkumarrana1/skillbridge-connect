import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { OPPORTUNITIES_CATALOG } from "@/data/opportunities-catalog";
import type {
  Opportunity,
  OpportunityType,
  OpportunityWorkMode,
  OpportunityStatus,
  OpportunityExperienceLevel,
  EligibilityCheckResult,
  OpportunityMatchResult,
} from "@/types/opportunity";
import type { SkillCategory } from "@/types";

export class OpportunityService {
  /**
   * Transforms a Supabase database row with nested relations into the frontend Opportunity domain model.
   */
  static mapDatabaseRowToOpportunity(row: any): Opportunity {
    const org = row.organizations || {};
    const oppSkills = row.opportunity_skills || [];
    const eligibilityRules = row.opportunity_eligibility_rules || [];

    const requiredSkills: string[] = [];
    const preferredSkills: string[] = [];
    oppSkills.forEach((os: any) => {
      const sName = os.skills?.name || os.skill_name;
      if (!sName) return;
      if (os.requirement_type === "required") {
        requiredSkills.push(sName);
      } else {
        preferredSkills.push(sName);
      }
    });

    const degreeReq: string[] = [];
    const deptReq: string[] = [];
    const gradReq: string[] = [];
    let minCgpa: number | undefined = undefined;

    eligibilityRules.forEach((rule: any) => {
      if (rule.rule_type === "degree") {
        if (Array.isArray(rule.value)) degreeReq.push(...rule.value);
        else if (typeof rule.value === "string") degreeReq.push(rule.value);
      } else if (rule.rule_type === "department" || rule.rule_type === "program") {
        if (Array.isArray(rule.value)) deptReq.push(...rule.value);
        else if (typeof rule.value === "string") deptReq.push(rule.value);
      } else if (rule.rule_type === "graduation_year") {
        if (Array.isArray(rule.value)) gradReq.push(...rule.value);
        else if (typeof rule.value === "string") gradReq.push(rule.value);
      } else if (rule.rule_type === "minimum_cgpa") {
        minCgpa = typeof rule.value === "number" ? rule.value : parseFloat(String(rule.value));
      }
    });

    const typeMap: Record<string, OpportunityType> = {
      internship: "Internship",
      job: "Job",
      live_project: "Live Project",
      apprenticeship: "Apprenticeship",
      training: "Training Program",
    };

    const statusMap: Record<string, OpportunityStatus> = {
      published: "Published",
      draft: "Draft",
      closed: "Closed",
      pending_review: "Draft",
      rejected: "Draft",
      archived: "Closed",
    };

    const workModeMap: Record<string, OpportunityWorkMode> = {
      remote: "Remote",
      hybrid: "Hybrid",
      onsite: "On-site",
    };

    const expLevelMap: Record<string, OpportunityExperienceLevel> = {
      fresher: "Fresher",
      "0-1 yr": "0-1 yr",
      "1-2 yr": "1-2 yr",
      "2+ yr": "2+ yr",
      any: "Any",
    };

    return {
      id: row.id,
      title: row.title,
      company: org.name || "Enterprise Partner",
      companyId: row.company_id,
      companyWebsite: org.website || undefined,
      type: typeMap[row.type] || "Internship",
      category: (row.skill_categories?.name || "Web & Frontend") as SkillCategory,
      domain: row.domain || "Software Engineering",
      experienceLevel: expLevelMap[row.experience_level] || "Fresher",
      description: row.description,
      responsibilities: row.responsibilities || [],
      requiredSkills,
      preferredSkills,
      eligibility: {
        degreeRequirements: degreeReq.length > 0 ? degreeReq : ["Any Degree"],
        departmentRequirements: deptReq.length > 0 ? deptReq : ["All Disciplines"],
        graduationRequirements: gradReq.length > 0 ? gradReq : ["All Batches"],
        minCgpa,
      },
      location: row.location || "Bengaluru, Karnataka",
      workMode: workModeMap[row.work_mode] || "Hybrid",
      duration: row.duration_text || `${row.duration_value || 6} ${row.duration_unit || "Months"}`,
      compensation: {
        type: (row.compensation_type as any) || "Stipend",
        currency: row.compensation_currency || "INR",
        formatted: row.compensation_formatted || "Competitive Stipend",
      },
      applicationDeadline: row.application_deadline ? row.application_deadline.split("T")[0]! : "2026-12-31",
      openings: row.openings || 1,
      hiringProcess: row.hiring_process || ["Application Review", "Skill Assessment", "Interview"],
      status: statusMap[row.status] || "Published",
      postedDate: row.posted_at ? row.posted_at.split("T")[0]! : new Date().toISOString().split("T")[0]!,
      featured: Boolean(row.featured),
      liveProjectDetails: row.live_project_details || undefined,
      trainingDetails: row.training_details || undefined,
    };
  }

  /**
   * Fetch all opportunities from Supabase with fallback to local catalog.
   */
  static async getAllOpportunities(): Promise<Opportunity[]> {
    if (!isSupabaseConfigured) {
      return [...OPPORTUNITIES_CATALOG];
    }

    try {
      const { data, error } = await supabase
        .from("opportunities")
        .select(`
          *,
          organizations ( id, name, slug, logo_url, website, city, state ),
          skill_categories ( id, name ),
          opportunity_skills (
            requirement_type,
            weight,
            mandatory,
            skills ( id, name, slug )
          ),
          opportunity_eligibility_rules (
            rule_type,
            operator,
            value
          )
        `)
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        console.warn("[OpportunityService] Supabase opportunities query failed, using catalog:", error);
        return [...OPPORTUNITIES_CATALOG];
      }

      return data.map((row) => this.mapDatabaseRowToOpportunity(row));
    } catch (err) {
      console.error("[OpportunityService] Exception querying opportunities:", err);
      return [...OPPORTUNITIES_CATALOG];
    }
  }

  /**
   * Fetch a single opportunity by ID.
   */
  static async getOpportunityById(id: string): Promise<Opportunity | null> {
    if (!isSupabaseConfigured || id.startsWith("opp-")) {
      const found = OPPORTUNITIES_CATALOG.find((o) => o.id === id);
      return found ? { ...found } : null;
    }

    try {
      const { data, error } = await supabase
        .from("opportunities")
        .select(`
          *,
          organizations ( id, name, slug, logo_url, website, city, state ),
          skill_categories ( id, name ),
          opportunity_skills (
            requirement_type,
            weight,
            mandatory,
            skills ( id, name, slug )
          ),
          opportunity_eligibility_rules (
            rule_type,
            operator,
            value
          )
        `)
        .eq("id", id)
        .single();

      if (error || !data) {
        const found = OPPORTUNITIES_CATALOG.find((o) => o.id === id);
        return found ? { ...found } : null;
      }

      return this.mapDatabaseRowToOpportunity(data);
    } catch (err) {
      console.error("[OpportunityService] Error fetching opportunity by ID:", err);
      return null;
    }
  }

  /**
   * Create a new corporate opportunity in Supabase.
   */
  static async createOpportunity(opp: Omit<Opportunity, "id">, companyId: string, userId?: string): Promise<Opportunity> {
    if (!isSupabaseConfigured) {
      const mockOpp: Opportunity = { ...opp, id: `opp-${Date.now()}` };
      return mockOpp;
    }

    try {
      const typeReverseMap: Record<string, string> = {
        Internship: "internship",
        Job: "job",
        "Live Project": "live_project",
        Apprenticeship: "apprenticeship",
        "Training Program": "training",
      };

      const statusReverseMap: Record<string, string> = {
        Published: "published",
        Draft: "draft",
        Closed: "closed",
      };

      const workModeReverseMap: Record<string, string> = {
        Remote: "remote",
        Hybrid: "hybrid",
        "On-site": "onsite",
      };

      const slug = `${opp.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;

      const { data: inserted, error: insertErr } = await (supabase.from("opportunities") as any)
        .insert({
          company_id: companyId,
          created_by: userId || null,
          type: typeReverseMap[opp.type] || "internship",
          title: opp.title,
          slug,
          short_description: opp.description.slice(0, 180),
          description: opp.description,
          responsibilities: opp.responsibilities,
          domain: opp.domain,
          status: statusReverseMap[opp.status] || "draft",
          location: opp.location,
          work_mode: workModeReverseMap[opp.workMode] || "hybrid",
          experience_level: opp.experienceLevel === "Fresher" ? "fresher" : "0-1 yr",
          duration_text: opp.duration,
          compensation_type: opp.compensation?.type || "Stipend",
          compensation_formatted: opp.compensation?.formatted || "Competitive",
          openings: opp.openings || 1,
          hiring_process: opp.hiringProcess || [],
          application_deadline: opp.applicationDeadline || new Date(Date.now() + 30 * 86400000).toISOString(),
          featured: Boolean(opp.featured),
          live_project_details: opp.liveProjectDetails || null,
          training_details: opp.trainingDetails || null,
          posted_at: new Date().toISOString(),
          published_at: opp.status === "Published" ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (insertErr || !inserted) {
        console.warn("[OpportunityService] Insert error:", insertErr);
        return { ...opp, id: `opp-${Date.now()}` };
      }

      return this.mapDatabaseRowToOpportunity(inserted);
    } catch (err) {
      console.error("[OpportunityService] Error creating opportunity:", err);
      return { ...opp, id: `opp-${Date.now()}` };
    }
  }

  /**
   * Save an opportunity for a student.
   */
  static async saveOpportunity(studentId: string, opportunityId: string): Promise<boolean> {
    if (!isSupabaseConfigured || opportunityId.startsWith("opp-")) {
      return true;
    }

    try {
      const { error } = await supabase.from("saved_opportunities").insert({
        student_id: studentId,
        opportunity_id: opportunityId,
      });
      return !error;
    } catch (err) {
      console.error("[OpportunityService] Error saving opportunity:", err);
      return false;
    }
  }

  /**
   * Unsave an opportunity for a student.
   */
  static async unsaveOpportunity(studentId: string, opportunityId: string): Promise<boolean> {
    if (!isSupabaseConfigured || opportunityId.startsWith("opp-")) {
      return true;
    }

    try {
      const { error } = await supabase
        .from("saved_opportunities")
        .delete()
        .eq("student_id", studentId)
        .eq("opportunity_id", opportunityId);
      return !error;
    } catch (err) {
      console.error("[OpportunityService] Error unsaving opportunity:", err);
      return false;
    }
  }

  /**
   * Get all saved opportunity IDs for a student.
   */
  static async getSavedOpportunityIds(studentId: string): Promise<string[]> {
    if (!isSupabaseConfigured) return [];

    try {
      const { data, error } = await supabase
        .from("saved_opportunities")
        .select("opportunity_id")
        .eq("student_id", studentId);

      if (error || !data) return [];
      return data.map((d: any) => d.opportunity_id);
    } catch (err) {
      console.error("[OpportunityService] Error fetching saved IDs:", err);
      return [];
    }
  }

  /**
   * Run server-side eligibility check via PostgreSQL RPC.
   */
  static async checkEligibility(studentId: string, opportunityId: string): Promise<EligibilityCheckResult | null> {
    if (!isSupabaseConfigured || opportunityId.startsWith("opp-")) {
      return null;
    }

    try {
      const { data, error } = await (supabase.rpc as any)("check_opportunity_eligibility", {
        p_student_id: studentId,
        p_opportunity_id: opportunityId,
      });

      if (error || !data) return null;

      return {
        isEligible: data.is_eligible,
        score: data.score,
        passedCriteria: data.passed_criteria || [],
        disqualifyingCriteria: data.disqualifying_criteria || [],
        notes: data.notes || [],
      };
    } catch (err) {
      console.error("[OpportunityService] Error checking eligibility RPC:", err);
      return null;
    }
  }

  /**
   * Run server-side deterministic matching via PostgreSQL RPC.
   */
  static async calculateMatch(studentId: string, opportunityId: string): Promise<OpportunityMatchResult | null> {
    if (!isSupabaseConfigured || opportunityId.startsWith("opp-")) {
      return null;
    }

    try {
      const { data, error } = await (supabase.rpc as any)("calculate_opportunity_match", {
        p_student_id: studentId,
        p_opportunity_id: opportunityId,
      });

      if (error || !data) return null;

      return {
        opportunityId: data.opportunity_id,
        overallMatch: Number(data.overall_match) || 0,
        categoryTag: (data.category_tag === "best_match"
          ? "Best Match"
          : data.category_tag === "quick_win"
            ? "Quick Win"
            : data.category_tag === "skill_building"
              ? "Skill-Building"
              : data.category_tag === "not_eligible"
                ? "Not Eligible"
                : "General Match") as any,
        skillFit: Number(data.skill_fit) || 0,
        eligibilityFit: Number(data.eligibility_fit) || 0,
        careerFit: Number(data.career_fit) || 0,
        readinessFit: Number(data.readiness_fit) || 0,
        evidenceFit: Number(data.evidence_fit) || 0,
        preferenceFit: Number(data.preference_fit) || 0,
        matchingSkills: (data.matching_skills || []).map((m: any) => ({
          name: m.name,
          level: m.level,
          score: m.score,
          isAssessed: Boolean(m.is_assessed),
          evidenceCount: 0,
        })),
        missingSkills: data.missing_skills || [],
        strengths: data.strengths || [],
        concerns: data.concerns || [],
        whyYouMatch: data.why_you_match || [],
        whatIsMissing: data.what_is_missing || [],
        whatWouldImproveYourMatch: data.what_would_improve || [],
        eligibilityResult: {
          isEligible: data.eligibility_result?.is_eligible ?? true,
          score: data.eligibility_result?.score ?? 100,
          passedCriteria: data.eligibility_result?.passed_criteria || [],
          disqualifyingCriteria: data.eligibility_result?.disqualifying_criteria || [],
          notes: data.eligibility_result?.notes || [],
        },
      };
    } catch (err) {
      console.error("[OpportunityService] Error calculating match RPC:", err);
      return null;
    }
  }
}
