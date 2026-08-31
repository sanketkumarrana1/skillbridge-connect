import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

export type OrganizationRow = Database["public"]["Tables"]["organizations"]["Row"];
export type MembershipRow = Database["public"]["Tables"]["organization_memberships"]["Row"];

export class OrganizationService {
  /**
   * Fetch all active organizations.
   */
  static async getActiveOrganizations(type?: "institution" | "company"): Promise<OrganizationRow[]> {
    if (!isSupabaseConfigured) return [];

    try {
      let query = supabase
        .from("organizations")
        .select("*")
        .eq("status", "active");

      if (type) {
        query = query.eq("organization_type", type);
      }

      const { data, error } = await query;
      if (error) {
        console.error("[OrganizationService] Error fetching organizations:", error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error("[OrganizationService] Exception fetching organizations:", err);
      return [];
    }
  }

  /**
   * Fetch memberships for a user.
   */
  static async getUserMemberships(userId: string): Promise<MembershipRow[]> {
    if (!isSupabaseConfigured) return [];

    try {
      const { data, error } = await supabase
        .from("organization_memberships")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active");

      if (error) {
        console.error("[OrganizationService] Error fetching user memberships:", error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error("[OrganizationService] Exception fetching user memberships:", err);
      return [];
    }
  }
}

