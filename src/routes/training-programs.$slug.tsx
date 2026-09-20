import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, Users } from "lucide-react";
import { useState } from "react";

import { SiteFooter, SiteNav } from "@/components/site-chrome";
import { Reveal } from "@/components/Reveal";
import { trainingProgramQuery, trainingProgramWeeksQuery } from "@/lib/queries";
import { socialMeta } from "@/lib/site";

export const Route = createFileRoute("/training-programs/$slug")({
  loader: async ({ context, params }) => {
    const program = await context.queryClient.ensureQueryData(trainingProgramQuery(params.slug));
    if (!program) throw notFound();
    // Optionally preload weeks if program exists
    if (program.id) {
      await context.queryClient.ensureQueryData(trainingProgramWeeksQuery(program.id));
    }
    return { program };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Program unavailable - MastCode" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.program;
    return {
      meta: socialMeta({
        title: `${p.title} Training Program - MastCode`,
        description: p.short_description,
        url: `/training-programs/${params.slug}`,
        type: "article",
      }),
      links: [{ rel: "canonical", href: `/training-programs/${params.slug}` }],
    };
  },
  component: TrainingProgramDetail,
});

function TrainingProgramDetail() {
  const { slug } = Route.useParams();
  const { data: program } = useSuspenseQuery(trainingProgramQuery(slug));
  const { data: weeks } = useSuspenseQuery(trainingProgramWeeksQuery(program!.id));
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);

  const p = program!;

  // Group weeks by month
  const monthsData = Array.from({ length: 6 }, (_, i) => {
    const monthNum = i + 1;
    const monthWeeks = weeks.filter((w) => w.month_number === monthNum).sort((a, b) => a.week_number - b.week_number);
    return {
      month: monthNum,
      monthName: ["January", "February", "March", "April", "May", "June"][i],
      weeks: monthWeeks,
    };
  }).filter((m) => m.weeks.length > 0);

  return (
    <>
      <SiteNav />
      <main>
        <section className="border-b border-border bg-secondary">
          <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
            <Reveal>
              <Link to="/training-programs" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> All programs
              </Link>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 font-display text-4xl font-bold leading-tight md:text-5xl">{p.title}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">{p.full_description || p.short_description || p.description}</p>
            </Reveal>
            <Reveal delay={160} className="mt-8 flex flex-wrap gap-3">
              {[
                { icon: Clock, text: p.duration || "24 weeks" },
                { icon: Users, text: p.level || "All" },
              ].map((m) => (
                <span key={m.text} className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm transition-transform duration-300 hover:-translate-y-0.5">
                  <m.icon className="h-4 w-4 text-accent" /> {m.text}
                </span>
              ))}
            </Reveal>
            <Reveal delay={220}>
              <a
                href="mailto:hello@mastcode.dev"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-accent"
              >
                Enroll Now
              </a>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-5xl space-y-12 px-6 py-16">
          <Reveal>
            <h2 className="font-display text-3xl font-bold">6-Month Curriculum</h2>
            <p className="mt-2 text-muted-foreground">Complete week-by-week breakdown of what you'll learn and build</p>
          </Reveal>

          <div className="space-y-6">
            {monthsData.map((monthData, monthIdx) => (
              <Reveal key={monthData.month} delay={monthIdx * 100}>
                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                  <div className="px-6 py-4 border-b border-border">
                    <h3 className="font-display text-xl font-semibold">
                      Month {monthData.month}: {monthData.monthName}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {monthData.weeks.length} weeks
                    </p>
                  </div>
                  <div className="divide-y divide-border">
                    {monthData.weeks.map((week) => (
                      <div key={week.id} className="border-b border-border last:border-b-0">
                        <button
                          onClick={() => setExpandedWeek(expandedWeek === week.week_number ? null : week.week_number)}
                          className="w-full px-6 py-4 flex items-center justify-between hover:bg-secondary transition-colors text-left group"
                        >
                          <div>
                            <h4 className="font-semibold">Week {week.week_number}: {week.title}</h4>
                            {!expandedWeek && week.week_number !== expandedWeek && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{week.topics}</p>
                            )}
                          </div>
                          <div className={`transition-transform duration-300 ${expandedWeek === week.week_number ? "rotate-180" : ""}`}>
                            <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          </div>
                        </button>
                        {expandedWeek === week.week_number && (
                          <div className="px-6 py-4 bg-secondary space-y-4 border-t border-border">
                            {week.topics && (
                              <div>
                                <h5 className="font-semibold text-sm">Topics</h5>
                                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                                  {week.topics.split("\n").filter(Boolean).map((topic: string, i: number) => (
                                    <li key={i} className="flex gap-2">
                                      <span className="text-accent">-</span>
                                      <span>{topic.replace(/^[--]\s*/, "")}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {week.practical_task && (
                              <div>
                                <h5 className="font-semibold text-sm">Practical Task</h5>
                                <p className="mt-1 text-sm text-muted-foreground">{week.practical_task}</p>
                              </div>
                            )}
                            {week.assignment && (
                              <div>
                                <h5 className="font-semibold text-sm">Assignment</h5>
                                <p className="mt-1 text-sm text-muted-foreground">{week.assignment}</p>
                              </div>
                            )}
                            {week.mini_project && (
                              <div>
                                <h5 className="font-semibold text-sm">Mini Project</h5>
                                <p className="mt-1 text-sm text-muted-foreground">{week.mini_project}</p>
                              </div>
                            )}
                            {week.expected_outcome && (
                              <div>
                                <h5 className="font-semibold text-sm">Expected Outcome</h5>
                                <p className="mt-1 text-sm text-muted-foreground">{week.expected_outcome}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {weeks.length === 0 && (
            <Reveal>
              <div className="text-center py-12">
                <p className="text-muted-foreground">Curriculum details coming soon</p>
              </div>
            </Reveal>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

