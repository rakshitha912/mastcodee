import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Github, Linkedin, ExternalLink, ArrowRight } from "lucide-react";

import { PageHero, SiteFooter, SiteNav } from "@/components/site-chrome";
import { Reveal } from "@/components/Reveal";
import { SafeImage } from "@/components/SafeImage";
import { teamMembersQuery } from "@/lib/queries";
import { socialMeta } from "@/lib/site";
import { ASSETS } from "@/lib/assets";

export const Route = createFileRoute("/teams")({
  loader: ({ context }) => context.queryClient.ensureQueryData(teamMembersQuery()),
  head: () => ({
    meta: socialMeta({
      title: "Meet the MastCode Team — Leadership & Mentors",
      description:
        "Meet the team at MastCode leading technology education and career development across India.",
      url: "/teams",
    }),
    links: [{ rel: "canonical", href: "/teams" }],
  }),
  component: TeamsPage,
});

function TeamsPage() {
  const { data: members } = useSuspenseQuery(teamMembersQuery());
  const visibleMembers = members.length > 0 ? members : [
    {
      id: "founder",
      name: "Rakshitha S",
      role: "Founder & CEO",
      bio: "Building MastCode with a vision to bridge technology education, practical experience, and real career opportunities.",
      photo_path: ASSETS.CEO_PHOTO,
      linkedin: null,
      github: null,
      published: true,
    },
  ];

  return (
    <>
      <SiteNav />
      <main>
        <PageHero
          eyebrow="Our people"
          title="Meet the team"
          highlight="building MastCode"
          description="Industry leaders, mentors, and passionate educators dedicated to transforming technology education and career pathways."
        />
        <section className="mx-auto max-w-7xl px-6 py-24">
          {visibleMembers.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {visibleMembers.map((member: any, i: number) => (
                <Reveal key={member.id} delay={i * 70}>
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
                    {/* Photo */}
                    {member.photo_path && (
                      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-card to-secondary">
                        <SafeImage
                          src={member.photo_path}
                          alt={member.name}
                          fallbackLabel={member.name}
                          loading="lazy"
                          containerClassName="h-full w-full"
                          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                    )}

                    <div className="flex flex-1 flex-col px-6 py-6">
                      <h2 className="font-display text-xl font-semibold leading-tight">
                        {member.name}
                      </h2>
                      <p className="mt-1 text-sm font-medium text-accent">
                        {member.designation || member.role}
                      </p>
                      {member.department && (
                        <p className="text-xs text-muted-foreground uppercase tracking-widest">
                          {member.department}
                        </p>
                      )}
                      {member.bio && (
                        <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                          {member.bio}
                        </p>
                      )}

                      {/* Social Links */}
                      {(member.linkedin_url ||
                        member.linkedin ||
                        member.github_url ||
                        member.github ||
                        member.portfolio_url) && (
                        <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-4">
                          {(member.linkedin_url || member.linkedin) && (
                            <a
                              href={member.linkedin_url || member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:text-foreground hover:border-accent/60"
                              title="LinkedIn"
                            >
                              <Linkedin className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">LinkedIn</span>
                            </a>
                          )}
                          {(member.github_url || member.github) && (
                            <a
                              href={member.github_url || member.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:text-foreground hover:border-accent/60"
                              title="GitHub"
                            >
                              <Github className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">GitHub</span>
                            </a>
                          )}
                          {member.portfolio_url && (
                            <a
                              href={member.portfolio_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:text-foreground hover:border-accent/60"
                              title="Portfolio"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Portfolio</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}

          <Reveal delay={400} className="mt-20 text-center">
            <p className="text-muted-foreground mb-6">
              Want to join our team? We're always looking for passionate educators and builders.
            </p>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-accent"
            >
              View Open Roles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
