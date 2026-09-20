import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Clock, Sparkles, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHero, SiteFooter, SiteNav } from "@/components/site-chrome";
import { Reveal } from "@/components/Reveal";
import { trainingProgramsQuery } from "@/lib/queries";
import { socialMeta } from "@/lib/site";

export const Route = createFileRoute("/training-programs")({
  loader: ({ context }) => context.queryClient.ensureQueryData(trainingProgramsQuery()),
  head: () => ({
    meta: socialMeta({
      title: "Training Programs - MastCode",
      description:
        "Intensive bootcamps and 6-month training programs in full stack development, data science, AI, and more at MastCode.",
      url: "/training-programs",
    }),
    links: [{ rel: "canonical", href: "/training-programs" }],
  }),
  component: TrainingProgramsPage,
});

function TrainingProgramsPage() {
  const { data: programs } = useSuspenseQuery(trainingProgramsQuery());
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(programs.map((p) => p.category).filter(Boolean)))],
    [programs],
  );
  const levels = useMemo(
    () => ["All", ...Array.from(new Set(programs.map((p) => p.level).filter(Boolean)))],
    [programs],
  );

  const filteredCategories = categories.filter((c): c is string => typeof c === "string");
  const filteredLevels = levels.filter((l): l is string => typeof l === "string");

  const filtered = programs.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      (level === "All" || p.level === level),
  );

  return (
    <>
      <SiteNav />
      <main>
        <PageHero
          eyebrow="Intensive training"
          title="Master technology in"
          highlight="six months"
          description="Comprehensive bootcamps designed to turn ambitious learners into job-ready professionals with real-world project experience."
        />
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <Reveal className="flex flex-wrap items-center gap-3">
              <FilterRow label="Track" value={category} options={filteredCategories} onChange={setCategory} />
            </Reveal>
            <Reveal delay={80} className="mt-3 flex flex-wrap items-center gap-3">
              <FilterRow label="Level" value={level} options={filteredLevels} onChange={setLevel} />
            </Reveal>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p: any, i: number) => (
              <Reveal key={p.id} delay={(i % 6) * 70}>
                <Link
                  to="/training-programs/$slug"
                  params={{ slug: p.slug }}
                  className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                >
                  <div className="relative flex items-center justify-between">
                    <span className="rounded-full border border-primary/20 bg-secondary px-3 py-1 text-xs font-semibold text-primary">
                      {p.category || "Training"}
                    </span>
                    {p.featured && <Sparkles className="h-4 w-4 animate-flame-pulse text-primary" />}
                  </div>
                  <h2 className="relative mt-5 font-display text-xl font-semibold leading-snug">{p.title}</h2>
                  <p className="relative mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {p.short_description || p.description}
                  </p>
                  <div className="relative mt-6 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{p.duration || "24 weeks"}</span>
                    <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{p.level || "All"}</span>
                  </div>
                  <div className="relative mt-5 flex items-center justify-between border-t border-border pt-5">
                    <span className="font-display text-lg font-bold text-foreground">
                      {p.discount_price ? (
                        <>
                          Rs {p.discount_price.toLocaleString("en-IN")}{" "}
                          <s className="text-sm font-normal text-muted-foreground">Rs {p.price?.toLocaleString("en-IN")}</s>
                        </>
                      ) : (
                        <>Rs {p.price?.toLocaleString("en-IN") || "Contact"}</>
                      )}
                    </span>
                    <ArrowRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="mt-16 text-center text-muted-foreground">No training programs match these filters yet.</p>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function FilterRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <>
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`rounded-full border px-4 py-1.5 text-sm transition-all duration-300 hover:-translate-y-0.5 ${
            value === o
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-white text-muted-foreground hover:text-foreground"
          }`}
        >
          {o}
        </button>
      ))}
    </>
  );
}

