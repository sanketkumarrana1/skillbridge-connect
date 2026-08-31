import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type {
  AcademicProfile,
  CareerPreferences,
  DeclaredSkill,
  SkillCategory,
  SkillEvidenceItem,
  SkillEvidenceType,
  SkillProficiency,
  StudentProfile,
} from "@/types";

export interface OnboardingSavePayload {
  student_id: string;
  personal: {
    full_name: string;
    phone?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    country?: string | undefined;
    avatar_url?: string | undefined;
    headline?: string | undefined;
    about?: string | undefined;
  };
  academic: {
    institution_name?: string | undefined;
    institution_id?: string | undefined;
    department_id?: string | undefined;
    degree?: string | undefined;
    program?: string | undefined;
    academic_year?: string | undefined;
    graduation_year?: number | string | undefined;
    academic_status?: string | undefined;
    grade?: string | undefined;
  };
  career_preferences: {
    career_interests: string[];
    target_roles: string[];
    preferred_work_types: string[];
    preferred_work_modes: string[];
    preferred_cities: string[];
    availability?: string | undefined;
    preferred_opportunity_types: string[];
  };
  declared_skills: Array<{
    skill_id?: string | undefined;
    name: string;
    proficiency: SkillProficiency;
    proficiency_level: number;
    evidence: Array<{
      type: SkillEvidenceType;
      title: string;
      description?: string | undefined;
      url?: string | undefined;
    }>;
  }>;
}

export class StudentService {
  /**
   * Fetch complete student profile with academic data, career preferences, declared skills, and evidence.
   */
  static async getFullStudentProfile(studentId: string): Promise<Partial<StudentProfile> | null> {
    if (!isSupabaseConfigured) return null;

    try {
      // 1. Fetch Base Profile & Student Profile
      const [profileRes, studentProfileRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", studentId).maybeSingle(),
        supabase.from("student_profiles").select("*, organizations(name)").eq("user_id", studentId).maybeSingle(),
      ]);

      if (profileRes.error || !profileRes.data) return null;

      const profileRow = profileRes.data;
      const spRow = studentProfileRes.data;

      // 2. Fetch Career Preferences & Choices
      const [careerInterestsRes, targetRolesRes, oppPrefsRes] = await Promise.all([
        supabase
          .from("student_career_interests")
          .select("career_interests(name)")
          .eq("student_id", studentId),
        supabase
          .from("student_target_roles")
          .select("target_roles(title)")
          .eq("student_id", studentId),
        supabase
          .from("student_opportunity_preferences")
          .select("*")
          .eq("student_id", studentId)
          .maybeSingle(),
      ]);

      const careerInterests = (careerInterestsRes.data || [])
        .map((r: any) => r.career_interests?.name)
        .filter(Boolean);

      const targetRoles = (targetRolesRes.data || [])
        .map((r: any) => r.target_roles?.title)
        .filter(Boolean);

      const oppPrefs = oppPrefsRes.data;

      const careerPreferences: CareerPreferences = {
        careerInterests,
        targetRoles,
        preferredWorkTypes: (oppPrefs?.preferred_work_types || ["Internship", "Full-time"]) as any,
        preferredLocations: (oppPrefs?.preferred_work_modes || ["Hybrid", "Remote"]) as any,
        preferredCities: oppPrefs?.preferred_cities || [],
        availability: oppPrefs?.availability || "Immediate (Summer 2026)",
        targetOpportunityTypes: (oppPrefs?.preferred_opportunity_types || ["Internship", "Live Project"]) as any,
      };

      // 3. Fetch Declared Skills & Evidence
      const declaredSkills = await this.getDeclaredSkills(studentId);

      const academicProfile: AcademicProfile | undefined = spRow
        ? {
            institution: (spRow as any).organizations?.name || spRow.degree || "Indian Institute of Technology",
            degree: spRow.degree || "B.Tech",
            program: spRow.program || "Computer Science & Engineering",
            currentYear: spRow.academic_year || "3rd Year",
            graduationYear: spRow.graduation_year ? String(spRow.graduation_year) : "2026",
            academicStatus: spRow.academic_status || "Enrolled",
            grade: spRow.grade || undefined,
          }
        : undefined;

      return {
        name: profileRow.full_name,
        email: profileRow.email,
        phone: profileRow.phone || undefined,
        city: profileRow.city || undefined,
        state: profileRow.state || undefined,
        country: profileRow.country || "India",
        avatar: profileRow.avatar_url || undefined,
        headline: spRow?.headline || undefined,
        about: spRow?.about || "",
        college: academicProfile?.institution || "IIT Delhi",
        degree: academicProfile?.degree || "B.Tech",
        branch: academicProfile?.program || "Computer Science",
        year: academicProfile?.currentYear || "3rd Year",
        academicProfile,
        careerPreferences,
        declaredSkills,
        skills: declaredSkills.map((s) => ({
          name: s.name,
          score: s.proficiencyLevel,
        })),
        onboardingCompleted: Boolean(spRow?.onboarding_completed),
      };
    } catch (err) {
      console.error("[StudentService] Error loading full profile:", err);
      return null;
    }
  }

  /**
   * Fetch declared skills with attached evidence for a student.
   */
  static async getDeclaredSkills(studentId: string): Promise<DeclaredSkill[]> {
    if (!isSupabaseConfigured) return [];

    try {
      const { data, error } = await supabase
        .from("student_skills")
        .select(`
          id,
          skill_id,
          self_level,
          self_score,
          first_declared_at,
          last_updated_at,
          skills (
            id,
            name,
            skill_categories ( name )
          ),
          skill_evidence (
            id,
            evidence_type,
            title,
            description,
            url,
            linked_entity_id,
            verification_status,
            created_at
          )
        `)
        .eq("student_id", studentId)
        .eq("status", "active");

      if (error || !data) {
        console.error("[StudentService] Error fetching student skills:", error);
        return [];
      }

      return data.map((row: any) => {
        const skillName = row.skills?.name || "Unknown Skill";
        const catName = row.skills?.skill_categories?.name || "Programming Languages";
        const evidenceItems: SkillEvidenceItem[] = (row.skill_evidence || []).map((e: any) => ({
          id: e.id,
          type: e.evidence_type as SkillEvidenceType,
          title: e.title,
          description: e.description || undefined,
          url: e.url || undefined,
          linkedEntityId: e.linked_entity_id || undefined,
          date: e.created_at,
        }));

        return {
          id: row.id,
          skillId: row.skill_id,
          name: skillName,
          category: catName as SkillCategory,
          proficiency: row.self_level as SkillProficiency,
          proficiencyLevel: row.self_score,
          selfDeclared: true,
          verificationStatus: evidenceItems.length > 0 ? "evidence_added" : "self_declared",
          evidence: evidenceItems,
          addedAt: row.first_declared_at,
        };
      });
    } catch (err) {
      console.error("[StudentService] Exception fetching declared skills:", err);
      return [];
    }
  }

  /**
   * Add a declared skill for a student.
   */
  static async addSkill(studentId: string, skill: DeclaredSkill): Promise<string | null> {
    if (!isSupabaseConfigured) return skill.id;

    try {
      // Find skill ID
      let skillId = skill.skillId;
      if (!skillId || !skillId.includes("-")) {
        const { data: foundSkill } = await supabase
          .from("skills")
          .select("id")
          .eq("name", skill.name)
          .maybeSingle();

        if (foundSkill) {
          skillId = foundSkill.id;
        } else {
          return null;
        }
      }

      const { data, error } = await supabase
        .from("student_skills")
        .upsert(
          {
            student_id: studentId,
            skill_id: skillId,
            self_level: skill.proficiency,
            self_score: skill.proficiencyLevel,
            last_updated_at: new Date().toISOString(),
          },
          { onConflict: "student_id,skill_id" },
        )
        .select("id")
        .single();

      if (error) {
        console.error("[StudentService] Error adding student skill:", error);
        return null;
      }
      return data.id;
    } catch (err) {
      console.error("[StudentService] Exception adding skill:", err);
      return null;
    }
  }

  /**
   * Update proficiency of a declared skill.
   */
  static async updateSkillProficiency(
    studentId: string,
    skillName: string,
    proficiency: SkillProficiency,
  ): Promise<boolean> {
    if (!isSupabaseConfigured) return true;

    try {
      const scoreMap: Record<SkillProficiency, number> = {
        beginner: 40,
        intermediate: 70,
        advanced: 90,
      };

      const { data: foundSkill } = await supabase
        .from("skills")
        .select("id")
        .eq("name", skillName)
        .maybeSingle();

      if (!foundSkill) return false;

      const { error } = await supabase
        .from("student_skills")
        .update({
          self_level: proficiency,
          self_score: scoreMap[proficiency],
          last_updated_at: new Date().toISOString(),
        })
        .eq("student_id", studentId)
        .eq("skill_id", foundSkill.id);

      return !error;
    } catch (err) {
      console.error("[StudentService] Error updating proficiency:", err);
      return false;
    }
  }

  /**
   * Remove a declared skill.
   */
  static async removeSkill(studentId: string, skillName: string): Promise<boolean> {
    if (!isSupabaseConfigured) return true;

    try {
      const { data: foundSkill } = await supabase
        .from("skills")
        .select("id")
        .eq("name", skillName)
        .maybeSingle();

      if (!foundSkill) return false;

      const { error } = await supabase
        .from("student_skills")
        .delete()
        .eq("student_id", studentId)
        .eq("skill_id", foundSkill.id);

      return !error;
    } catch (err) {
      console.error("[StudentService] Error removing skill:", err);
      return false;
    }
  }

  /**
   * Add evidence to a declared skill.
   */
  static async addEvidence(
    studentId: string,
    studentSkillId: string,
    evidence: SkillEvidenceItem,
  ): Promise<string | null> {
    if (!isSupabaseConfigured) return evidence.id;

    try {
      const { data, error } = await supabase
        .from("skill_evidence")
        .insert({
          student_skill_id: studentSkillId,
          student_id: studentId,
          evidence_type: evidence.type,
          title: evidence.title,
          description: evidence.description || null,
          url: evidence.url || null,
          linked_entity_id: evidence.linkedEntityId || null,
          verification_status: "evidence_added",
        })
        .select("id")
        .single();

      if (error) {
        console.error("[StudentService] Error adding evidence:", error);
        return null;
      }
      return data.id;
    } catch (err) {
      console.error("[StudentService] Exception adding evidence:", err);
      return null;
    }
  }

  /**
   * Remove evidence from a skill.
   */
  static async removeEvidence(studentId: string, evidenceId: string): Promise<boolean> {
    if (!isSupabaseConfigured) return true;

    try {
      const { error } = await supabase
        .from("skill_evidence")
        .delete()
        .eq("id", evidenceId)
        .eq("student_id", studentId);

      return !error;
    } catch (err) {
      console.error("[StudentService] Error deleting evidence:", err);
      return false;
    }
  }

  /**
   * Transactionally save student onboarding using the Postgres RPC.
   */
  static async saveOnboarding(payload: OnboardingSavePayload): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured) {
      return { success: true };
    }

    try {
      const { data, error } = await (supabase.rpc as any)("save_student_onboarding", {
        payload,
      });

      if (error) {
        console.error("[StudentService] RPC save_student_onboarding error:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error("[StudentService] Exception in saveOnboarding:", err);
      return { success: false, error: (err as Error).message };
    }
  }
}
