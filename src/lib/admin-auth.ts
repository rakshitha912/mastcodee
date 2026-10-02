// Admin authentication and authorization utilities
import { supabase } from "@/integrations/supabase/client";

export type UserRole = "super_admin" | "content_manager" | "recruiter" | "trainer" | null;

function isSupabaseConfigured(): boolean {
  const url = import.meta.env?.VITE_SUPABASE_URL || process.env?.SUPABASE_URL;
  const key = import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY || process.env?.SUPABASE_PUBLISHABLE_KEY;
  return Boolean(url && key);
}

function readLocalAdminSession() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("mastcode-admin-session") === "true";
}

/**
 * Check if current user is super_admin
 */
export async function isSuperAdmin(): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return readLocalAdminSession();
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }

    return data?.role === "super_admin";
  } catch (error) {
    console.error("Error in isSuperAdmin:", error);
    return false;
  }
}

/**
 * Get current user's role
 */
export async function getUserRole(): Promise<UserRole> {
  if (!isSupabaseConfigured()) {
    return readLocalAdminSession() ? "super_admin" : null;
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error getting user role:", error);
      return null;
    }

    return (data?.role as UserRole) || null;
  } catch (error) {
    console.error("Error in getUserRole:", error);
    return null;
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
  if (!isSupabaseConfigured()) {
    if (typeof window === "undefined") return null;
    const email = localStorage.getItem("mastcode-admin-name") || "Rakshitha S";
    return readLocalAdminSession() ? { email } : null;
  }

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error getting current user:", error);
    return null;
  }
  return user;
}

/**
 * Verify admin access - returns true if user is super_admin
 * Use this to protect admin routes
 */
export async function verifyAdminAccess(): Promise<boolean> {
  const isAdmin = await isSuperAdmin();
  return isAdmin;
}

/**
 * Logout current user
 */
export async function logout() {
  if (!isSupabaseConfigured()) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("mastcode-admin-session");
      localStorage.removeItem("mastcode-admin-name");
      localStorage.removeItem("mastcode-login-banner");
    }
    return;
  }

  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
