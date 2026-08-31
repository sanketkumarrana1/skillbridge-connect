import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { AppRole } from "@/lib/database.types";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";

export interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
  role: AppRole;
  phone?: string;
}

export interface AuthResponse<T = unknown> {
  data: T | null;
  error: string | null;
}

export class AuthService {
  /**
   * Register a new user with role and metadata.
   */
  static async signUp({
    email,
    password,
    fullName,
    role,
    phone,
  }: SignUpParams): Promise<AuthResponse<{ user: User | null; session: Session | null }>> {
    if (!isSupabaseConfigured) {
      return {
        data: null,
        error: "Supabase credentials are not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.",
      };
    }

    try {
      const dataMeta: Record<string, string> = {
        full_name: fullName,
        role: role,
      };
      if (phone) {
        dataMeta["phone"] = phone;
      }

      const options: {
        data?: Record<string, string>;
        emailRedirectTo?: string;
      } = {
        data: dataMeta,
      };

      if (typeof window !== "undefined") {
        options.emailRedirectTo = `${window.location.origin}/verify-email`;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options,
      });

      if (error) {
        return { data: null, error: this.formatAuthError(error.message) };
      }

      return { data: { user: data.user, session: data.session }, error: null };
    } catch (err) {
      return { data: null, error: (err as Error).message || "An unexpected registration error occurred." };
    }
  }

  /**
   * Sign in user with email and password.
   */
  static async signIn(
    email: string,
    password: string,
  ): Promise<AuthResponse<{ user: User | null; session: Session | null }>> {
    if (!isSupabaseConfigured) {
      return {
        data: null,
        error: "Supabase credentials are not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.",
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { data: null, error: this.formatAuthError(error.message) };
      }

      return { data: { user: data.user, session: data.session }, error: null };
    } catch (err) {
      return { data: null, error: (err as Error).message || "An unexpected sign-in error occurred." };
    }
  }

  /**
   * Sign out current user.
   */
  static async signOut(): Promise<AuthResponse<boolean>> {
    if (!isSupabaseConfigured) {
      return { data: true, error: null };
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { data: false, error: error.message };
      }
      return { data: true, error: null };
    } catch (err) {
      return { data: false, error: (err as Error).message };
    }
  }

  /**
   * Trigger password reset email.
   */
  static async resetPasswordForEmail(email: string): Promise<AuthResponse<boolean>> {
    if (!isSupabaseConfigured) {
      return {
        data: null,
        error: "Supabase credentials are not configured in .env.local.",
      };
    }

    try {
      const options: { redirectTo?: string } = {};
      if (typeof window !== "undefined") {
        options.redirectTo = `${window.location.origin}/reset-password`;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, options);

      if (error) {
        return { data: false, error: this.formatAuthError(error.message) };
      }

      return { data: true, error: null };
    } catch (err) {
      return { data: false, error: (err as Error).message };
    }
  }

  /**
   * Update password for authenticated user (e.g. from password reset link).
   */
  static async updatePassword(newPassword: string): Promise<AuthResponse<boolean>> {
    if (!isSupabaseConfigured) {
      return {
        data: null,
        error: "Supabase credentials are not configured in .env.local.",
      };
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { data: false, error: this.formatAuthError(error.message) };
      }

      return { data: true, error: null };
    } catch (err) {
      return { data: false, error: (err as Error).message };
    }
  }

  /**
   * Get current session.
   */
  static async getSession(): Promise<Session | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data } = await supabase.auth.getSession();
      return data.session;
    } catch {
      return null;
    }
  }

  /**
   * Get current authenticated user.
   */
  static async getUser(): Promise<User | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data } = await supabase.auth.getUser();
      return data.user;
    } catch {
      return null;
    }
  }

  /**
   * Listen to auth state changes.
   */
  static onAuthStateChange(
    callback: (event: AuthChangeEvent, session: Session | null) => void,
  ) {
    if (!isSupabaseConfigured) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    return supabase.auth.onAuthStateChange(callback);
  }

  /**
   * Translate raw errors into user-friendly messages.
   */
  private static formatAuthError(msg: string): string {
    const lower = msg.toLowerCase();
    if (lower.includes("invalid login credentials") || lower.includes("invalid credential")) {
      return "Incorrect email or password. Please verify your credentials and try again.";
    }
    if (lower.includes("user already registered") || lower.includes("already registered")) {
      return "An account with this email address already exists. Please sign in instead.";
    }
    if (lower.includes("email not confirmed") || lower.includes("unconfirmed")) {
      return "Your email address has not been verified yet. Please check your inbox for the confirmation link.";
    }
    if (lower.includes("password should be at least")) {
      return "Password is too weak. Please choose a password with at least 6 characters.";
    }
    if (lower.includes("rate limit") || lower.includes("too many requests")) {
      return "Too many attempts. Please wait a moment and try again.";
    }
    return msg;
  }
}

