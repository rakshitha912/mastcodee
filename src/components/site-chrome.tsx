import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Loader2, Menu, X } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

export const LOGO_URL = "/og/mast_code_logo_2_corrected.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/courses", label: "Courses" },
  { to: "/training-programs", label: "Training Programs" },
  { to: "/internships", label: "Internships" },
  { to: "/jobs", label: "Careers" },
  { to: "/teams", label: "Team" },
  { to: "/#contact", label: "Contact" },
] as const;

function isValidPhoneNumber(value: string) {
  const digitsOnly = value.replace(/[^\d+]/g, "");
  return /^\+?[0-9]{10,15}$/.test(digitsOnly);
}

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [getStartedOpen, setGetStartedOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const resetForm = () => {
    setForm({ fullName: "", phone: "", message: "" });
    setSubmitError("");
    setSuccessMessage("");
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fullName = form.fullName.trim();
    const phone = form.phone.trim();
    const message = form.message.trim();

    if (!fullName || !phone || !message) {
      setSubmitError("Please fill in all required fields.");
      return;
    }

    if (!isValidPhoneNumber(phone)) {
      setSubmitError("Please enter a valid phone number.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/form-submissions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          form_type: "contact_enquiry",
          subject: "Get Started",
          full_name: fullName,
          email: "not-provided@get-started.mastcode.local",
          phone,
          message,
          source_page: window.location.pathname,
        }),
      });

      const result = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || "Unable to submit your request.");
      }

      setSuccessMessage(
        "Thank you! Your request has been submitted successfully. Our team will contact you soon.",
      );
      setForm({ fullName: "", phone: "", message: "" });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Unable to submit your request.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b bg-white transition-all duration-300 ${
          scrolled ? "border-border shadow-sm" : "border-border"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="flex h-16 w-28 items-center justify-center rounded-lg bg-white p-1 shadow-sm ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-105 sm:h-20 sm:w-36">
              <img
                src={LOGO_URL}
                alt="MastCode logo"
                className="h-full w-full object-contain drop-shadow-sm"
              />
            </span>
            <span className="font-display text-lg font-bold tracking-[0.2em] text-foreground sm:text-xl">
              MASTCODE
            </span>
          </Link>
          <div className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="story-link transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setGetStartedOpen(true);
                setSubmitError("");
                setSuccessMessage("");
              }}
              className="hidden items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-accent sm:inline-flex"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
              className="inline-flex rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:text-foreground md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
        {mobileOpen && (
          <div className="border-t border-border bg-white px-6 py-4 shadow-lg md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setGetStartedOpen(true);
                  setSubmitError("");
                  setSuccessMessage("");
                }}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {getStartedOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4"
          onClick={() => setGetStartedOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-lg rounded-2xl border border-border bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Get Started
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold text-foreground">
                  Talk to MastCode
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setGetStartedOpen(false);
                  resetForm();
                }}
                className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Full Name *
                </label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 outline-none focus:border-primary"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Phone Number *
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 outline-none focus:border-primary"
                  placeholder="+91 98765 43210"
                  inputMode="tel"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Message / Requirement *
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 outline-none focus:border-primary"
                  placeholder="Tell us how we can help..."
                  required
                />
              </div>

              {submitError && (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {submitError}
                </p>
              )}

              {successMessage && (
                <p className="flex items-start gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{successMessage}</span>
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-16 w-28 items-center justify-center rounded-lg bg-white p-1 shadow-sm ring-1 ring-white/20 sm:h-20 sm:w-36">
                <img
                  src={LOGO_URL}
                  alt="MastCode logo"
                  className="h-full w-full object-contain drop-shadow-sm"
                />
              </span>
              <span className="font-display text-base font-bold tracking-[0.2em] sm:text-lg">MASTCODE</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              MastCode helps learners, institutions, professionals, and businesses grow through skills,
              guidance, technology, and digital opportunities.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-12 text-sm sm:grid-cols-3">
            <div>
              <h3 className="font-semibold text-foreground">Platform</h3>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                <li>
                  <Link to="/courses" className="transition-colors hover:text-foreground">
                    Courses
                  </Link>
                </li>
                <li>
                  <Link to="/training-programs" className="transition-colors hover:text-foreground">
                    Training
                  </Link>
                </li>
                <li>
                  <Link to="/internships" className="transition-colors hover:text-foreground">
                    Internships
                  </Link>
                </li>
                <li>
                  <Link to="/jobs" className="transition-colors hover:text-foreground">
                    Jobs
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Company</h3>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                <li>
                  <Link to="/about" className="transition-colors hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="transition-colors hover:text-foreground">
                    Leadership
                  </Link>
                </li>
                <li>
                  <Link to="/jobs" className="transition-colors hover:text-foreground">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Contact</h3>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                <li>rakshithamastcode@gmail.com</li>
                <li>+91 7019161991</li>
                <li>+91 7483 645 279</li>
                <li>Bangalore, Karnataka, India</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>(c) 2026 MastCode. All rights reserved.</p>
          <p>Built for growth. Powered by learners.</p>
        </div>
      </div>
    </footer>
  );
}

/** Shared hero band for interior pages */
export function PageHero({
  eyebrow,
  title,
  highlight,
  description,
}: {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
}) {
  return (
    <section className="border-b border-border bg-secondary">
      <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-24">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">{eyebrow}</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight md:text-6xl">
            {title} <span className="text-flame-gradient animate-gradient-text">{highlight}</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

import { Reveal } from "./Reveal";

