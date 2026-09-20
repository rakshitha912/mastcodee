import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, BadgeCheck, CalendarClock, FileText, GraduationCap, MapPin, Wallet } from "lucide-react";
import { useState } from "react";

import { SiteFooter, SiteNav } from "@/components/site-chrome";
import { Reveal } from "@/components/Reveal";
import { submitMultipartForm } from "@/lib/form-submit";
import { internshipQuery } from "@/lib/queries";
import { socialMeta } from "@/lib/site";

export const Route = createFileRoute("/internships/$slug")({
  loader: async ({ context, params }) => {
    const internship = await context.queryClient.ensureQueryData(internshipQuery(params.slug));
    if (!internship) throw notFound();
    return { internship };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Internship unavailable - MastCode" }, { name: "robots", content: "noindex" }] };
    }
    const it = loaderData.internship;
    return {
      meta: socialMeta({
        title: `${it.title} Internship - ${it.location} - MastCode`,
        description: it.description,
        url: `/internships/${params.slug}`,
        type: "article",
      }),
      links: [{ rel: "canonical", href: `/internships/${params.slug}` }],
    };
  },
  component: InternshipDetail,
});

function InternshipDetail() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(internshipQuery(slug));
  const it = data!;
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [resumeName, setResumeName] = useState("");

  const blocks = [
    { title: "Responsibilities", body: it.responsibilities },
    { title: "Requirements", body: it.requirements },
    { title: "Eligibility", body: it.eligibility },
  ].filter((b) => b.body?.trim());

  return (
    <>
      <SiteNav />
      <main>
        <section className="border-b border-border bg-secondary">
          <div className="relative mx-auto max-w-5xl px-6 py-16 md:py-20">
            <Reveal>
              <Link to="/internships" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> All internships
              </Link>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 font-display text-4xl font-bold leading-tight md:text-5xl">{it.title}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">{it.description}</p>
            </Reveal>
            <Reveal delay={160} className="mt-8 flex flex-wrap gap-3">
              {[
                { icon: MapPin, text: `${it.location} - ${it.work_mode}` },
                { icon: CalendarClock, text: it.duration },
                { icon: Wallet, text: "Unpaid" },
                { icon: GraduationCap, text: it.experience_level },
              ].map((m) => (
                <span key={m.text} className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm transition-transform duration-300 hover:-translate-y-0.5">
                  <m.icon className="h-4 w-4 text-accent" /> {m.text}
                </span>
              ))}
            </Reveal>
            <Reveal delay={220}>
              <a
                href="#application-form"
                className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-accent"
              >
                Apply for this internship
              </a>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-5xl space-y-12 px-6 py-16">
          <Reveal>
            <div className="rounded-xl border border-accent/40 bg-accent/10 p-6">
              <h2 className="font-display text-2xl font-semibold">Internship terms</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                This is an unpaid internship. Based on performance, selected interns may receive a full-time employment offer.
              </p>
              <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <span className="inline-flex items-center gap-2 text-foreground"><FileText className="h-4 w-4 text-accent" />Offer letter</span>
                <span className="inline-flex items-center gap-2 text-foreground"><BadgeCheck className="h-4 w-4 text-accent" />Completion certificate</span>
              </div>
              <p className="mt-5 border-t border-border/70 pt-4 text-sm text-muted-foreground">
                Document processing fee: <strong className="text-foreground">Rs 2,000</strong> for the internship offer letter and completion certificate. The internship itself is unpaid.
              </p>
            </div>
          </Reveal>

          {it.skills?.length > 0 && (
            <Reveal>
              <h2 className="font-display text-2xl font-semibold">Skills you'll use</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {it.skills.map((s) => (
                  <span key={s} className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-sm text-accent">{s}</span>
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
              id="application-form"
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

                form.set("form_type", "internship_application");
                form.set("full_name", String(form.get("name") || ""));
                form.set("position_id", it.id);
                form.set("position_slug", it.slug);
                form.set("position_title", it.title);

                try {
                  await submitMultipartForm(form);
                } catch (error) {
                  setSubmitError(error instanceof Error ? error.message : "Unable to submit your application.");
                  setSubmitting(false);
                  return;
                }

                setSubmitted(true);
                setSubmitting(false);
              }}
            >
              <h2 className="font-display text-2xl font-semibold">Apply for this internship</h2>
              <p className="mt-2 text-sm text-muted-foreground">Share your name, phone number, email, and resume. The Rs 2,000 document processing fee covers the offer letter and completion certificate.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 text-sm font-medium">
                  Full name
                  <input name="name" required placeholder="Your full name" className="w-full rounded-lg border border-border bg-background px-4 py-3 font-normal outline-none focus:border-accent" />
                </label>
                <label className="space-y-1.5 text-sm font-medium">
                  Email address
                  <input name="email" type="email" required pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$" placeholder="you@gmail.com" title="Enter a valid email such as you@gmail.com" className="w-full rounded-lg border border-border bg-background px-4 py-3 font-normal outline-none focus:border-accent" />
                </label>
                <label className="space-y-1.5 text-sm font-medium">
                  Phone number
                  <input name="phone" type="tel" required inputMode="tel" pattern="[0-9+()\s-]{7,20}" placeholder="7019161991" title="Enter a valid phone number" className="w-full rounded-lg border border-border bg-background px-4 py-3 font-normal outline-none focus:border-accent" />
                </label>
                <label className="space-y-1.5 text-sm font-medium">
                  Resume
                  <span className="flex cursor-pointer items-center rounded-lg border border-border bg-background px-4 py-3 font-normal text-muted-foreground transition hover:border-accent">
                    <span className="truncate">{resumeName || "Choose PDF/DOC resume"}</span>
                    <input name="resume" type="file" required accept=".pdf,.doc,.docx" className="sr-only" onChange={(event) => setResumeName(event.target.files?.[0]?.name || "")} />
                  </span>
                </label>
              </div>
              <button type="submit" disabled={submitting || submitted} className="mt-5 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Submitting..." : submitted ? "Application submitted" : "Submit application"}</button>
              {submitError && <p className="mt-3 text-sm text-red-400">{submitError}</p>}
              {submitted && <p className="mt-3 text-sm text-accent">Application submitted successfully. Your resume was uploaded and saved for review.</p>}
            </form>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}


