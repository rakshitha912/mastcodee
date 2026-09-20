import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({
    meta: [
      { title: "Create Admin Account - MastCode" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", designation: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [resending, setResending] = useState(false);

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(form.email.trim())) {
      setError("Use a valid Gmail address, for example admin@gmail.com.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        options: {
          data: {
            full_name: form.name.trim(),
            phone: form.phone.trim(),
            designation: form.designation.trim(),
          },
        },
      });

      if (signupError) {
        setError(signupError.message);
        setLoading(false);
        return;
      }

      if (data.user && data.session) {
        const profileUpdate = await (supabase.from("profiles") as any).update({
          full_name: form.name.trim(),
          phone: form.phone.trim(),
          designation: form.designation.trim(),
        }).eq("id", data.user.id);
        if (profileUpdate.error) {
          setError(`Account created, but profile details could not be saved: ${profileUpdate.error.message}`);
          setLoading(false);
          return;
        }
        await supabase.auth.signOut();
        setSuccess("Account created. Ask a super admin to assign your access, then sign in.");
      } else {
        setConfirmationEmail(form.email.trim().toLowerCase());
        setSuccess("Account created. Check your Gmail to confirm your email, then sign in.");
      }
    } catch (signupError) {
      setError("Could not connect to Supabase. Check that the project is active and try again.");
    }
    setLoading(false);
  };

  const resendConfirmation = async () => {
    if (!confirmationEmail) return;
    setResending(true);
    setError("");
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: confirmationEmail,
    });
    setResending(false);
    if (resendError) {
      setError(resendError.message);
    } else {
      setSuccess("Confirmation email sent again. Check Inbox, Spam, and Promotions.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl border border-border bg-white shadow-sm">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold">Create account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Register with your Gmail address.</p>
        </div>
        <form onSubmit={handleSignup} className="space-y-4 rounded-xl border border-border bg-card p-8 shadow-sm">
          {error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {success && <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p>}
          {confirmationEmail && (
            <button type="button" onClick={() => void resendConfirmation()} disabled={resending} className="w-full rounded-lg border border-border px-4 py-2 text-sm font-semibold text-primary hover:border-primary disabled:opacity-50">
              {resending ? "Sending..." : "Resend confirmation email"}
            </button>
          )}
          <label className="block space-y-1.5 text-sm font-medium">Full name<input required value={form.name} onChange={(event) => update("name", event.target.value)} className="w-full rounded-lg border border-input bg-white px-4 py-2 font-normal outline-none focus:border-primary" /></label>
          <label className="block space-y-1.5 text-sm font-medium">Gmail address<input required type="email" pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$" placeholder="name@gmail.com" value={form.email} onChange={(event) => update("email", event.target.value)} className="w-full rounded-lg border border-input bg-white px-4 py-2 font-normal outline-none focus:border-primary" /></label>
          <label className="block space-y-1.5 text-sm font-medium">Phone number<input required type="tel" inputMode="tel" pattern="[0-9+()\s-]{7,20}" placeholder="7019161991" value={form.phone} onChange={(event) => update("phone", event.target.value)} className="w-full rounded-lg border border-input bg-white px-4 py-2 font-normal outline-none focus:border-primary" /></label>
          <label className="block space-y-1.5 text-sm font-medium">Designation<input required placeholder="Content manager" value={form.designation} onChange={(event) => update("designation", event.target.value)} className="w-full rounded-lg border border-input bg-white px-4 py-2 font-normal outline-none focus:border-primary" /></label>
          <label className="block space-y-1.5 text-sm font-medium">
            Password
            <span className="relative block">
              <input required minLength={8} type={showPassword ? "text" : "password"} value={form.password} onChange={(event) => update("password", event.target.value)} className="w-full rounded-lg border border-input bg-white px-4 py-2 pr-12 font-normal outline-none focus:border-primary" />
              <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} title={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((visible) => !visible)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </span>
          </label>
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground transition hover:bg-accent disabled:opacity-50">{loading ? "Creating account..." : "Create account"}</button>
        </form>
        <p className="text-center text-sm text-muted-foreground">Already registered? <Link to="/auth/login" className="font-semibold text-primary hover:underline">Sign in</Link></p>
      </div>
    </div>
  );
}
