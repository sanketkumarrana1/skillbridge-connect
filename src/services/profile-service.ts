import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Database, AppRole } from "@/lib/database.types";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
export type UserRoleRow = Database["public"]["Tables"]["user_roles"]["Row"];

export class ProfileService {
  /**
   * Fetch a user profile by ID.
   */
  static async getProfile(userId: string): Promise<ProfileRow | null> {
    if (!isSupabaseConfigured) return null;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("[ProfileService] Error fetching profile:", error);
        return null;
      }
      return data as ProfileRow | null;
    } catch (err) {
      console.error("[ProfileService] Exception fetching profile:", err);
      return null;
    }
  }

  /**
   * Update a user profile by ID.
   */
  static async updateProfile(userId: string, patch: ProfileUpdate): Promise<ProfileRow | null> {
    if (!isSupabaseConfigured) return null;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(patch)
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        console.error("[ProfileService] Error updating profile:", error);
        return null;
      }
      return data as ProfileRow | null;
    } catch (err) {
      console.error("[ProfileService] Exception updating profile:", err);
      return null;
    }
  }

  /**
   * Fetch user roles by user ID.
   */
  static async getUserRoles(userId: string): Promise<AppRole[]> {
    if (!isSupabaseConfigured) return [];

    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      if (error) {
        console.error("[ProfileService] Error fetching roles:", error);
        return [];
      }
      return (data as Array<{ role: AppRole }> | null || []).map((r) => r.role);
    } catch (err) {
      console.error("[ProfileService] Exception fetching roles:", err);
      return [];
    }
  }

  /**
   * Fetch primary role for a user.
   */
  static async getPrimaryRole(userId: string): Promise<AppRole | null> {
    if (!isSupabaseConfigured) return null;

    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("is_primary", true)
        .maybeSingle();

      if (error) {
        console.error("[ProfileService] Error fetching primary role:", error);
        return null;
      }

      if (data) return (data as { role: AppRole }).role;

      // Fallback to first role if is_primary is not flagged
      const allRoles = await this.getUserRoles(userId);
      return allRoles[0] || null;
    } catch (err) {
      console.error("[ProfileService] Exception fetching primary role:", err);
      return null;
    }
  }
}

