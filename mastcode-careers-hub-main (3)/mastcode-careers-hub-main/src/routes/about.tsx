import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Flame, Target, Users } from "lucide-react";

import { PageHero, SiteFooter, SiteNav } from "@/components/site-chrome";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About MastCode - Growth Partner for Students, Institutions & Business" },
      {
        name: "description",
        content: "MastCode is a growth-focused organization empowering students, professionals, institutions, and businesses through practical skills, guidance, technology, and opportunity.",
      },
      { property: "og:title", content: "About MastCode - Growth Partner for Students, Institutions & Business" },
      {
        property: "og:description",
        content: "MastCode connects education, careers, technology, and business through practical learning and growth-focused support.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <SiteNav />
      <main>
        <PageHero
          eyebrow="About us"
          title="MastCode is a"
          highlight="growth partner"
          description="MastCode is a growth-focused organization committed to empowering students, professionals, educational institutions, and businesses through practical guidance, learning, technology, and opportunity."
        />
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-8 md:grid-cols-2">
            <Reveal>
              <article className="rounded-lg border border-border bg-card p-8">
                <Target className="h-7 w-7 text-primary" />
                <h2 className="mt-5 font-display text-2xl font-semibold">Our mission</h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  To empower individuals and organizations with the skills, guidance, technology, and opportunities needed to grow confidently in a rapidly changing world.
                </p>
              </article>
            </Reveal>
            <Reveal delay={120}>
              <article className="rounded-lg border border-border bg-card p-8">
                <Users className="h-7 w-7 text-accent" />
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Leadership</p>
                <h2 className="mt-4 font-display text-2xl font-semibold">Rakshitha S</h2>
                <p className="mt-1 text-sm text-primary">Founder & CEO</p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Leading MastCode with a learner-first vision and a commitment to turning education into tangible career and business momentum.
                </p>
              </article>
            </Reveal>
          </div>

          <Reveal delay={220} className="mt-12 rounded-2xl border border-border bg-card p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Our vision</p>
            <h2 className="mt-4 font-display text-3xl font-semibold">To become a trusted growth partner connecting education, careers, technology, and business.</h2>
            <p className="mt-5 max-w-3xl leading-relaxed text-muted-foreground">
              Through career counselling, technical training, placement support, institutional partnerships, website development, and digital marketing, MastCode works to create meaningful pathways for personal, professional, and business growth.
            </p>
          </Reveal>

          <Reveal delay={260} className="mt-12 flex items-center justify-between gap-6 border-t border-border pt-10">
            <div className="flex items-center gap-3"><Flame className="h-6 w-6 text-primary" /><span className="font-display font-semibold">Learn. Build. Grow.</span></div>
            <Link to="/courses" className="inline-flex items-center gap-2 font-semibold text-primary hover:text-accent">
              Explore services <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
