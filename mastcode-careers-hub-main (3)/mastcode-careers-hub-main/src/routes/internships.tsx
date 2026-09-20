import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarClock, MapPin, Sparkles, Wallet } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHero, SiteFooter, SiteNav } from "@/components/site-chrome";
import { Reveal } from "@/components/Reveal";
import { Chip } from "@/routes/jobs";
import { internshipsQuery } from "@/lib/queries";
import { socialMeta } from "@/lib/site";

export const Route = createFileRoute("/internships")({
  loader: ({ context }) => context.queryClient.ensureQueryData(internshipsQuery()),
  head: () => ({
    meta: socialMeta({
      title: "Technology Internships - MastCode",
      description:
        "Mentored, project-based technology internships. Contribute to real products and graduate with a portfolio.",
      url: "/internships",
    }),
    links: [{ rel: "canonical", href: "/internships" }],
  }),
  component: InternshipsPage,
});

function InternshipsPage() {
  const location = useLocation();
  const { data: internships } = useSuspenseQuery(internshipsQuery());
  const [dept, setDept] = useState("All");
  const [mode, setMode] = useState("All");

  if (location.pathname !== "/internships") {
    return <Outlet />;
  }

  const depts = useMemo(() => ["All", ...Array.from(new Set(internships.map((i) => i.department)))], [internships]);
  const modes = useMemo(() => ["All", ...Array.from(new Set(internships.map((i) => i.work_mode)))], [internships]);

  const filtered = internships.filter(
    (i) => (dept === "All" || i.department === dept) && (mode === "All" || i.work_mode === mode),
  );

  return (
    <>
      <SiteNav />
      <main>
        <PageHero
          eyebrow="Experience that counts"
          title="Intern on work that"
          highlight="matters"
          description="Join mentored teams, solve real product problems, and graduate with evidence of what you can build."
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

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {filtered.map((it, i) => (
              <Reveal key={it.id} delay={(i % 6) * 70}>
                <Link
                  to="/internships/$slug"
                  params={{ slug: it.slug }}
                  className="group flex h-full flex-col rounded-xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{it.department}</span>
                    {it.featured && <Sparkles className="h-4 w-4 animate-flame-pulse text-accent" />}
                  </div>
                  <h2 className="mt-3 font-display text-xl font-semibold">{it.title}</h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{it.description}</p>
                  <div className="mt-5 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{it.location} - {it.work_mode}</span>
                    <span className="inline-flex items-center gap-1.5"><CalendarClock className="h-3.5 w-3.5" />{it.duration}</span>
                    <span className="inline-flex items-center gap-1.5"><Wallet className="h-3.5 w-3.5" />Unpaid</span>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 border-t border-border pt-5 text-sm font-semibold text-primary">
                    View internship <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
          {filtered.length === 0 && <p className="mt-16 text-center text-muted-foreground">No internships match these filters.</p>}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

