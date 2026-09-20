// Admin authentication and authorization utilities
import { supabase } from "@/integrations/supabase/client";

export type UserRole = "super_admin" | "content_manager" | "recruiter" | "trainer" | null;

/**
 * Check if current user is super_admin
 */
export async function isSuperAdmin(): Promise<boolean> {
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
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
