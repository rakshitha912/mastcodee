import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Briefcase, MapPin, Sparkles, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHero, SiteFooter, SiteNav } from "@/components/site-chrome";
import { Reveal } from "@/components/Reveal";
import { jobsQuery } from "@/lib/queries";
import { socialMeta } from "@/lib/site";

export const Route = createFileRoute("/jobs")({
  loader: ({ context }) => context.queryClient.ensureQueryData(jobsQuery()),
  head: () => ({
    meta: socialMeta({
      title: "Technology Careers - MastCode",
      description:
        "Explore open full-time technology roles at MastCode and help learners move from capability to opportunity.",
      url: "/jobs",
    }),
    links: [{ rel: "canonical", href: "/jobs" }],
  }),
  component: JobsPage,
});

function JobsPage() {
  const { data: jobs } = useSuspenseQuery(jobsQuery());
  const [dept, setDept] = useState("All");
  const [mode, setMode] = useState("All");

  const depts = useMemo(() => ["All", ...Array.from(new Set(jobs.map((j) => j.department)))], [jobs]);
  const modes = useMemo(() => ["All", ...Array.from(new Set(jobs.map((j) => j.work_mode)))], [jobs]);

  const filtered = jobs.filter(
    (j) => (dept === "All" || j.department === dept) && (mode === "All" || j.work_mode === mode),
  );

  return (
    <>
      <SiteNav />
      <main>
        <PageHero
          eyebrow="Careers at MastCode"
          title="Build the pathway to"
          highlight="possibility"
          description="Work with a focused team helping learners move from curiosity to capability, and from capability to opportunity."
        />
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <Reveal className="flex flex-wrap items-center gap-2">
              <span className="mr-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Department</span>
              {depts.map((d) => (
                <Chip key={d} active={dept === d} onClick={() => setDept(d)}>{d}</Chip>
              ))}
            </Reveal>
            <Reveal delay={80} className="mt-3 flex flex-wrap items-center gap-2">
              <span className="mr-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Work mode</span>
              {modes.map((m) => (
                <Chip key={m} active={mode === m} onClick={() => setMode(m)}>{m}</Chip>
              ))}
            </Reveal>
          </div>

          <div className="mt-10 space-y-5">
            {filtered.map((j, i) => (
              <Reveal key={j.id} delay={(i % 6) * 70}>
                <Link
                  to="/jobs/$slug"
                  params={{ slug: j.slug }}
                  className="group flex flex-col gap-5 rounded-xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-4 w-4 text-primary" />
                      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{j.department}</span>
                      {j.featured && <Sparkles className="h-4 w-4 animate-flame-pulse text-accent" />}
                    </div>
                    <h2 className="mt-3 font-display text-2xl font-semibold">{j.title}</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{j.description}</p>
                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{j.location} - {j.work_mode}</span>
                      <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{j.openings} opening{j.openings > 1 ? "s" : ""}</span>
                      <span>{j.employment_type}</span>
                      <span>{j.experience}</span>
                    </div>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-primary/40 px-5 py-2.5 text-sm font-semibold text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    View role <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
          {filtered.length === 0 && <p className="mt-16 text-center text-muted-foreground">No roles match these filters.</p>}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

export function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm transition-all duration-300 hover:-translate-y-0.5 ${
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

