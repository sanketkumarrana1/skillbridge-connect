import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { AuthService, type SignUpParams, type AuthResponse } from "@/services/auth-service";
import { ProfileService, type ProfileRow } from "@/services/profile-service";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { AppRole } from "@/lib/database.types";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: ProfileRow | null;
  role: AppRole | null;
  roles: AppRole[];
  isAdmin: boolean;
  loading: boolean;
  isConfigured: boolean;
  isEmailVerified: boolean;
  signUp: (params: SignUpParams) => Promise<AuthResponse<{ user: User | null; session: Session | null }>>;
  signIn: (email: string, password: string) => Promise<AuthResponse<{ user: User | null; session: Session | null }>>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResponse<boolean>>;
  updatePassword: (newPassword: string) => Promise<AuthResponse<boolean>>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = useCallback(async (authUser: User | null) => {
    if (!authUser) {
      setProfile(null);
      setRoles([]);
      setRole(null);
      return;
    }

    try {
      const [fetchedProfile, fetchedRoles, primaryRole] = await Promise.all([
        ProfileService.getProfile(authUser.id),
        ProfileService.getUserRoles(authUser.id),
        ProfileService.getPrimaryRole(authUser.id),
      ]);

      const metaRole = authUser.user_metadata ? (authUser.user_metadata["role"] as AppRole) : null;
      setProfile(fetchedProfile);
      setRoles(fetchedRoles);
      setRole(primaryRole || metaRole || "student");
    } catch (err) {
      console.error("[AuthProvider] Error loading user profile & roles:", err);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await loadUserData(user);
    }
  }, [loadUserData, user]);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (!isSupabaseConfigured) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const initialSession = await AuthService.getSession();
        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          if (initialSession?.user) {
            await loadUserData(initialSession.user);
          }
        }
      } catch (err) {
        console.error("[AuthProvider] Initial session fetch failed:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void initAuth();

    const { data: authListener } = AuthService.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        await loadUserData(newSession.user);
      } else {
        setProfile(null);
        setRoles([]);
        setRole(null);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, [loadUserData]);

  const signUp = useCallback(async (params: SignUpParams) => {
    setLoading(true);
    const res = await AuthService.signUp(params);
    if (res.data?.user) {
      setUser(res.data.user);
      setSession(res.data.session);
      await loadUserData(res.data.user);
    }
    setLoading(false);
    return res;
  }, [loadUserData]);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    const res = await AuthService.signIn(email, password);
    if (res.data?.user) {
      setUser(res.data.user);
      setSession(res.data.session);
      await loadUserData(res.data.user);
    }
    setLoading(false);
    return res;
  }, [loadUserData]);

  const signOut = useCallback(async () => {
    setLoading(true);
    await AuthService.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRoles([]);
    setRole(null);
    setLoading(false);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    return AuthService.resetPasswordForEmail(email);
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    return AuthService.updatePassword(newPassword);
  }, []);

  const isEmailVerified = Boolean(user?.email_confirmed_at);
  const isAdmin = roles.includes("admin") || role === "admin";

  const value: AuthContextValue = {
    user,
    session,
    profile,
    role,
    roles,
    isAdmin,
    loading,
    isConfigured: isSupabaseConfigured,
    isEmailVerified,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
