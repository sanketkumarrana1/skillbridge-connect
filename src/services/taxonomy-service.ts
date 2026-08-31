import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { SKILL_CATEGORIES, SKILLS_LIBRARY } from "@/data/skills-catalog";
import { CAREER_INTERESTS, TARGET_ROLES } from "@/data/career-catalog";
import type { CareerInterest, SkillCategory, SkillDefinition, TargetRole } from "@/types";

export interface SkillCategoryRow {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  status: string;
  display_order: number;
}

export interface SkillRow {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;
  tags: string[];
  aliases?: string[];
  related_skills?: string[];
}

export class TaxonomyService {
  /**
   * Fetch all active skill categories.
   */
  static async getCategories(): Promise<SkillCategory[]> {
    if (!isSupabaseConfigured) {
      return [...SKILL_CATEGORIES];
    }

    try {
      const { data, error } = await supabase
        .from("skill_categories")
        .select("*")
        .eq("status", "active")
        .order("display_order", { ascending: true });

      if (error || !data || data.length === 0) {
        return [...SKILL_CATEGORIES];
      }

      return data.map((d) => d.name as SkillCategory);
    } catch {
      return [...SKILL_CATEGORIES];
    }
  }

  /**
   * Fetch all active skills or filter by category.
   */
  static async getSkills(categoryName?: string): Promise<SkillDefinition[]> {
    if (!isSupabaseConfigured) {
      if (!categoryName) return [...SKILLS_LIBRARY];
      return SKILLS_LIBRARY.filter((s) => s.category === categoryName);
    }

    try {
      let query = supabase
        .from("skills")
        .select(`
          id,
          name,
          slug,
          description,
          tags,
          status,
          skill_categories ( name ),
          skill_aliases ( alias ),
          skill_relations!skill_relations_skill_id_fkey (
            relation_type,
            related_skill:skills!skill_relations_related_skill_id_fkey ( name )
          )
        `)
        .eq("status", "active");

      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        if (!categoryName) return [...SKILLS_LIBRARY];
        return SKILLS_LIBRARY.filter((s) => s.category === categoryName);
      }

      const formatted: SkillDefinition[] = data.map((row: any) => {
        const catName = row.skill_categories?.name || "Programming Languages";
        const aliases = (row.skill_aliases || []).map((a: any) => a.alias);
        const related = (row.skill_relations || [])
          .map((r: any) => r.related_skill?.name)
          .filter(Boolean);

        return {
          id: row.id,
          name: row.name,
          category: catName as SkillCategory,
          aliases,
          relatedSkills: related,
          description: row.description || "",
          tags: row.tags || [],
          isActive: row.status === "active",
        };
      });

      if (categoryName) {
        return formatted.filter((s) => s.category === categoryName);
      }
      return formatted;
    } catch {
      if (!categoryName) return [...SKILLS_LIBRARY];
      return SKILLS_LIBRARY.filter((s) => s.category === categoryName);
    }
  }

  /**
   * Fetch all active career interests.
   */
  static async getCareerInterests(): Promise<CareerInterest[]> {
    if (!isSupabaseConfigured) {
      return [...CAREER_INTERESTS];
    }

    try {
      const { data, error } = await supabase
        .from("career_interests")
        .select("*")
        .eq("status", "active");

      if (error || !data || data.length === 0) {
        return [...CAREER_INTERESTS];
      }

      return data.map((d) => ({
        id: d.id,
        name: d.name,
        description: d.description || "",
        icon: d.icon || "Compass",
        popularRoles: [],
      }));
    } catch {
      return [...CAREER_INTERESTS];
    }
  }

  /**
   * Fetch all active target roles.
   */
  static async getTargetRoles(): Promise<TargetRole[]> {
    if (!isSupabaseConfigured) {
      return [...TARGET_ROLES];
    }

    try {
      const { data, error } = await supabase
        .from("target_roles")
        .select("*")
        .eq("status", "active");

      if (error || !data || data.length === 0) {
        return [...TARGET_ROLES];
      }

      return data.map((d) => ({
        id: d.id,
        title: d.title,
        category: d.category,
        description: d.description || "",
        recommendedSkills: [],
        demandLevel: (d.demand_level as TargetRole["demandLevel"]) || "high",
      }));
    } catch {
      return [...TARGET_ROLES];
    }
  }
}

