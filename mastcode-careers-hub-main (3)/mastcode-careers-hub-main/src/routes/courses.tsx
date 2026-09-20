import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Clock, GraduationCap, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHero, SiteFooter, SiteNav } from "@/components/site-chrome";
import { Reveal } from "@/components/Reveal";
import { coursesQuery } from "@/lib/queries";
import { socialMeta } from "@/lib/site";

export const Route = createFileRoute("/courses")({
  loader: ({ context }) => context.queryClient.ensureQueryData(coursesQuery()),
  head: () => ({
    meta: socialMeta({
      title: "Technology Courses - MastCode",
      description:
        "Mentor-led, project-based technology courses in development, data, cloud, and AI. Build job-ready skills at MastCode.",
      url: "/courses",
    }),
    links: [{ rel: "canonical", href: "/courses" }],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { data: courses } = useSuspenseQuery(coursesQuery());
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(courses.map((c) => c.category)))],
    [courses],
  );
  const levels = useMemo(
    () => ["All", ...Array.from(new Set(courses.map((c) => c.level)))],
    [courses],
  );

  const filtered = courses.filter(
    (c) =>
      (category === "All" || c.category === category) && (level === "All" || c.level === level),
  );

  if (pathname !== "/courses") {
    return <Outlet />;
  }

  return (
    <>
      <SiteNav />
      <main>
        <PageHero
          eyebrow="Technical training"
          title="Build Skills."
          highlight="Build Your Future."
          description="Explore industry-focused technical training programs designed to help students and professionals build practical, job-ready skills."
        />
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <Reveal className="flex flex-wrap items-center gap-3">
              <FilterRow label="Track" value={category} options={categories} onChange={setCategory} />
            </Reveal>
            <Reveal delay={80} className="mt-3 flex flex-wrap items-center gap-3">
              <FilterRow label="Level" value={level} options={levels} onChange={setLevel} />
            </Reveal>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c, i) => (
              <Reveal key={c.id} delay={(i % 6) * 70}>
                <Link
                  to="/courses/$slug"
                  params={{ slug: c.slug }}
                  className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                >
                  {c.thumbnail_path && (
                    <img
                      src={c.thumbnail_path}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover opacity-10 transition-opacity duration-500 group-hover:opacity-20"
                    />
                  )}
                  <div className="relative flex items-center justify-between">
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {c.category}
                    </span>
                    {c.featured && <Sparkles className="h-4 w-4 animate-flame-pulse text-accent" />}
                  </div>
                  <h2 className="relative mt-5 font-display text-xl font-semibold leading-snug">
                    {c.slug === "data-analytics" ? "Data Analysis" : c.title}
                  </h2>
                  <p className="relative mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {c.short_description}
                  </p>
                  {(c.slug === "data-analytics" || c.slug === "data-analysis") && (
                    <p className="relative mt-3 text-xs leading-relaxed text-muted-foreground">
                      Excel | SQL | Python | Pandas | NumPy | Power BI | Statistics
                    </p>
                  )}
                  {c.slug === "machine-learning" && (
                    <p className="relative mt-3 text-xs leading-relaxed text-muted-foreground">
                      Python | Pandas | NumPy | Scikit-learn | TensorFlow | PyTorch |
                      NLP | Computer Vision
                    </p>
                  )}
                  {c.slug === "artificial-intelligence" && (
                    <p className="relative mt-3 text-xs leading-relaxed text-muted-foreground">
                      Python | Machine Learning | GenAI | LLMs | RAG | AI Agents
                    </p>
                  )}
                  {c.slug === "cloud-computing" && (
                    <p className="relative mt-3 text-xs leading-relaxed text-muted-foreground">
                      AWS | Azure | Linux | Docker | Kubernetes | Terraform | DevOps
                    </p>
                  )}
                  {c.slug === "git-github" && (
                    <p className="relative mt-3 text-xs leading-relaxed text-muted-foreground">
                      Version Control | Git | GitHub | Branching | Collaboration
                    </p>
                  )}
                  {c.slug === "sql-database-management" && (
                    <p className="relative mt-3 text-xs leading-relaxed text-muted-foreground">
                      SQL | MySQL | PostgreSQL | DBMS | Database Design | Optimization
                    </p>
                  )}
                  {c.slug === "web-development" && (
                    <p className="relative mt-3 text-xs leading-relaxed text-muted-foreground">
                      HTML | CSS | JavaScript | React | Node.js | Express | PostgreSQL
                      | APIs | Docker
                    </p>
                  )}
                  <div className="relative mt-6 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {c.slug === "full-stack-development" ||
                      c.slug === "data-analytics" ||
                      c.slug === "machine-learning" ||
                      c.slug === "artificial-intelligence" ||
                      c.slug === "cloud-computing" ||
                      c.slug === "web-development" ||
                      c.slug === "git-github" ||
                      c.slug === "sql-database-management"
                        ? "90 Days"
                        : c.duration}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5" />
                      {c.level}
                    </span>
                  </div>
                  <div className="relative mt-5 flex items-center justify-between border-t border-border pt-5">
                    <span className="font-display text-lg font-bold text-foreground">
                      {c.discount_price ? (
                        <>
                          {c.discount_price.toLocaleString("en-IN")} {" "}
                          <s className="text-sm font-normal text-muted-foreground">
                            {c.price.toLocaleString("en-IN")}
                          </s>
                        </>
                      ) : (
                        <>{c.price.toLocaleString("en-IN")}</>
                      )}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      View Course{" "}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="mt-16 text-center text-muted-foreground">
              No courses match these filters yet.
            </p>
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
      <span className="min-w-12 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
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
