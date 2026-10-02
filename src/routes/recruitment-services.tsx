import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Reveal } from "@/components/Reveal";
import { submitJsonForm } from "@/lib/form-submit";

export const Route = createFileRoute("/recruitment-services")({
  head: () => ({ meta: [{ title: "Recruitment Services - MastCode" }] }),
  component: RecruitmentServicesPage,
});

function RecruitmentServicesPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form).entries());

    setSubmitting(true);
    setError("");
    try {
      await submitJsonForm({
        ...fields,
        form_type: "recruitment_enquiry",
        service_type: "recruitment_enquiry",
        subject: "Recruitment Service Enquiry",
      });
      form.reset();
      setSubmitted(true);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to submit your recruitment enquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = "mt-2 w-full rounded-lg border border-input bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-secondary">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <Link to="/" hash="services" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Services
          </Link>
          <Reveal className="mt-14 max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Recruitment services</p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-6xl">Find the Right People for Your Team</h1>
            <p className="mt-7 inline-flex rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-bold text-accent">₹100 per application</p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <Reveal as="article" className="space-y-6 text-base leading-8 text-muted-foreground md:text-lg">
          <p>Tell us about the role you are hiring for and the kind of applicants your team needs. Our recruitment team will follow up to discuss your requirements and next steps.</p>
          <p>Share your company and role details using the form, and our team will get in touch to discuss the recruitment process and next steps.</p>
          <div className="flex items-center gap-3 border-t border-border pt-8 text-sm font-semibold text-foreground">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" /> Recruitment support tailored to your team
          </div>
        </Reveal>

        {submitted ? (
          <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center text-emerald-900">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-700" />
            <h2 className="mt-4 font-display text-2xl font-bold">Enquiry received</h2>
            <p className="mt-3 text-sm leading-relaxed">Thank you. Our recruitment team will contact you shortly.</p>
            <button type="button" onClick={() => setSubmitted(false)} className="mt-6 rounded-lg border border-emerald-200 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-100">
              Submit another enquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Get in touch</p>
              <h2 className="mt-2 font-display text-2xl font-bold">Tell us who you are hiring</h2>
            </div>
            <label className="block text-sm font-semibold">Company name
              <input name="company_name" required autoComplete="organization" className={fieldClass} />
            </label>
            <label className="block text-sm font-semibold">Contact person
              <input name="full_name" required autoComplete="name" className={fieldClass} />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-semibold">Email
                <input name="email" type="email" required autoComplete="email" className={fieldClass} />
              </label>
              <label className="block text-sm font-semibold">Phone number
                <input name="phone" type="tel" required autoComplete="tel" className={fieldClass} />
              </label>
            </div>
            <label className="block text-sm font-semibold">Role you are hiring for
              <input name="job_title" required className={fieldClass} />
            </label>
            <label className="block text-sm font-semibold">Hiring requirements
              <textarea name="hiring_requirements" required rows={4} className={`${fieldClass} resize-y`} placeholder="Skills, experience, number of openings, or other details" />
            </label>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <button type="submit" disabled={submitting} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-accent disabled:cursor-wait disabled:opacity-60">
              {submitting ? "Submitting..." : "Submit recruitment enquiry"}
              {!submitting && <Send className="h-4 w-4" />}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}