import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, BadgeIndianRupee, Briefcase, MapPin, Users } from "lucide-react";
import { useState } from "react";

import { SiteFooter, SiteNav } from "@/components/site-chrome";
import { Reveal } from "@/components/Reveal";
import { submitMultipartForm } from "@/lib/form-submit";
import { jobQuery } from "@/lib/queries";
import { socialMeta } from "@/lib/site";

export const Route = createFileRoute("/jobs/$slug")({
  loader: async ({ context, params }) => {
    const job = await context.queryClient.ensureQueryData(jobQuery(params.slug));
    if (!job) throw notFound();
    return { job };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Role unavailable - MastCode" }, { name: "robots", content: "noindex" }] };
    }
    const j = loaderData.job;
    const title = `${j.title} - ${j.location} - MastCode Careers`;
    return {
      meta: socialMeta({ title, description: j.description, url: `/jobs/${params.slug}`, type: "article" }),
      links: [{ rel: "canonical", href: `/jobs/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "JobPosting",
            title: j.title,
            description: j.description,
            employmentType: j.employment_type,
            hiringOrganization: { "@type": "Organization", name: "MastCode" },
            jobLocation: { "@type": "Place", address: j.location },
            datePosted: j.published_at,
          }),
        },
      ],
    };
  },
  component: JobDetail,
});

function JobDetail() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(jobQuery(slug));
  const j = data!;
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [resumeName, setResumeName] = useState("");

  const blocks = [
    { title: "Responsibilities", body: j.responsibilities },
    { title: "Requirements", body: j.requirements },
    { title: "Benefits", body: j.benefits },
  ].filter((b) => b.body?.trim());

  return (
    <>
      <SiteNav />
      <main>
        <section className="border-b border-border bg-secondary">
          <div className="relative mx-auto max-w-5xl px-6 py-16 md:py-20">
            <Reveal>
              <Link to="/jobs" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> All roles
              </Link>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 font-display text-4xl font-bold leading-tight md:text-5xl">{j.title}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">{j.description}</p>
            </Reveal>
            <Reveal delay={160} className="mt-8 flex flex-wrap gap-3">
              {[
                { icon: Briefcase, text: `${j.department} - ${j.employment_type}` },
                { icon: MapPin, text: `${j.location} - ${j.work_mode}` },
                { icon: BadgeIndianRupee, text: j.salary_range },
                { icon: Users, text: `${j.openings} opening${j.openings > 1 ? "s" : ""}` },
              ].map((m) => (
                <span key={m.text} className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm transition-transform duration-300 hover:-translate-y-0.5">
                  <m.icon className="h-4 w-4 text-accent" /> {m.text}
                </span>
              ))}
            </Reveal>
            <Reveal delay={220}>
              <a
                href="#job-application-form"
                className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-accent"
              >
                Apply for this role
              </a>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-5xl space-y-12 px-6 py-16">
          {j.skills?.length > 0 && (
            <Reveal>
              <h2 className="font-display text-2xl font-semibold">Skills</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {j.skills.map((s) => (
                  <span key={s} className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary">{s}</span>
                ))}
              </div>
            </Reveal>
          )}
          {blocks.map((b, i) => (
            <Reveal key={b.title} delay={i * 100}>
              <h2 className="font-display text-2xl font-semibold">{b.title}</h2>
              <ul className="mt-4 space-y-3 leading-relaxed text-muted-foreground">
                {b.body.split("\n").filter(Boolean).map((line, k) => (
                  <li key={k} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {line.replace(/^[--]\s*/, "")}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}

          <Reveal>
            <form
              id="job-application-form"
              className="scroll-mt-24 rounded-xl border border-border bg-card p-6 md:p-8"
              onSubmit={async (event) => {
                event.preventDefault();
                setSubmitting(true);
                setSubmitError("");

                const form = new FormData(event.currentTarget);
                const resume = form.get("resume");
                if (!(resume instanceof File) || resume.size === 0) {
                  setSubmitError("Please choose a resume file before submitting.");
                  setSubmitting(false);
                  return;
                }

                form.set("form_type", "job_application");
                form.set("full_name", String(form.get("name") || ""));
                form.set("position_id", j.id);
                form.set("position_slug", j.slug);
                form.set("position_title", j.title);

                try {
                  await submitMultipartForm(form);
                  setSubmitted(true);
                } catch (error) {
                  setSubmitError(error instanceof Error ? error.message : "Unable to submit your application.");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              <h2 className="font-display text-2xl font-semibold">Apply for this role</h2>
              <p className="mt-2 text-sm text-muted-foreground">Share your contact details and resume. The MastCode team will review your profile and contact you if it matches the role.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 text-sm font-medium">
                  Full name
                  <input name="name" required placeholder="Your full name" className="w-full rounded-lg border border-border bg-background px-4 py-3 font-normal outline-none focus:border-accent" />
                </label>
                <label className="space-y-1.5 text-sm font-medium">
                  Email address
                  <input name="email" type="email" required placeholder="you@gmail.com" className="w-full rounded-lg border border-border bg-background px-4 py-3 font-normal outline-none focus:border-accent" />
                </label>
                <label className="space-y-1.5 text-sm font-medium">
                  Phone number
                  <input name="phone" type="tel" required inputMode="tel" placeholder="+91 98765 43210" className="w-full rounded-lg border border-border bg-background px-4 py-3 font-normal outline-none focus:border-accent" />
                </label>
                <label className="space-y-1.5 text-sm font-medium">
                  Current location
                  <input name="location" placeholder="Bangalore / Remote / City" className="w-full rounded-lg border border-border bg-background px-4 py-3 font-normal outline-none focus:border-accent" />
                </label>
                <label className="space-y-1.5 text-sm font-medium">
                  Highest qualification
                  <input name="qualification" placeholder="B.Tech, MCA, etc." className="w-full rounded-lg border border-border bg-background px-4 py-3 font-normal outline-none focus:border-accent" />
                </label>
                <label className="space-y-1.5 text-sm font-medium">
                  LinkedIn
                  <input name="linkedin" type="url" placeholder="https://linkedin.com/in/..." className="w-full rounded-lg border border-border bg-background px-4 py-3 font-normal outline-none focus:border-accent" />
                </label>
                <label className="space-y-1.5 text-sm font-medium sm:col-span-2">
                  Skills
                  <input name="skills" placeholder="React, Python, SQL..." className="w-full rounded-lg border border-border bg-background px-4 py-3 font-normal outline-none focus:border-accent" />
                </label>
                <label className="space-y-1.5 text-sm font-medium sm:col-span-2">
                  Resume
                  <span className="flex cursor-pointer items-center rounded-lg border border-border bg-background px-4 py-3 font-normal text-muted-foreground transition hover:border-accent">
                    <span className="truncate">{resumeName || "Choose PDF/DOC resume"}</span>
                    <input name="resume" type="file" required accept=".pdf,.doc,.docx" className="sr-only" onChange={(event) => setResumeName(event.target.files?.[0]?.name || "")} />
                  </span>
                </label>
                <label className="space-y-1.5 text-sm font-medium sm:col-span-2">
                  Cover letter
                  <textarea name="cover_letter" rows={4} placeholder="Tell us briefly why this role fits you" className="w-full rounded-lg border border-border bg-background px-4 py-3 font-normal outline-none focus:border-accent" />
                </label>
              </div>
              <button type="submit" disabled={submitting || submitted} className="mt-5 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Submitting..." : submitted ? "Application submitted" : "Submit application"}</button>
              {submitError && <p className="mt-3 text-sm text-red-400">{submitError}</p>}
              {submitted && <p className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">Application submitted successfully. Your resume was saved for review.</p>}
            </form>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}


