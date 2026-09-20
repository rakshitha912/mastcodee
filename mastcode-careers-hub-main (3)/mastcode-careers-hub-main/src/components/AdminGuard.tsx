import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { isSuperAdmin } from "@/lib/admin-auth";

interface AdminGuardProps {
  children: ReactNode;
}

/**
 * AdminGuard component - protects admin content
 * Shows loading state while checking auth, redirects if not admin
 */
export function AdminGuard({ children }: AdminGuardProps) {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const isUserAdmin = await isSuperAdmin();
      if (!isUserAdmin) {
        await navigate({ to: "/auth/login" });
      } else {
        setIsAdmin(true);
      }
    };

    checkAdmin();
  }, [navigate]);

  if (isAdmin === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-border border-t-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
