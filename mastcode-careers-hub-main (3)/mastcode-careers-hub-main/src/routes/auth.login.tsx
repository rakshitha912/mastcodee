import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Building2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_NAME = "Rakshitha S";
const ADMIN_PASSWORD = "Rakshitha@03";

export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [
      { title: "Admin Login - MastCode" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/admin" });
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (adminName.trim() !== ADMIN_NAME) {
      setError("Incorrect admin name.");
      setLoading(false);
      return;
    }

    if (password !== ADMIN_PASSWORD) {
      setError("Incorrect password.");
      setLoading(false);
      return;
    }

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: "rakshithamastcode@gmail.com",
        password,
      });
      if (authError) {
        setError(authError.message);
        return;
      }

      localStorage.setItem("mastcode-admin-name", adminName.trim());
      localStorage.setItem("mastcode-login-banner", "You have been logged in.");

      await navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        {/* Logo & Branding */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-xl border border-border bg-white mb-6 mx-auto shadow-sm">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold">MastCode Admin</h1>
          <p className="mt-2 text-sm text-muted-foreground">Owner-only access</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 rounded-xl border border-border bg-card p-8 shadow-sm">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium">Admin Name</label>
            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-input bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Rakshitha S"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-input bg-white px-4 py-2 pr-12 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Rakshitha@03"
                disabled={loading}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold transition hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Use the registered admin name and password to access the MastCode dashboard.
        </p>
        <p className="text-center text-sm text-muted-foreground">
          Back to site: <Link to="/" className="font-semibold text-primary hover:underline">Home</Link>
        </p>
      </div>
    </div>
  );
}

