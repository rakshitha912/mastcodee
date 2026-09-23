import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { ServicePage as ServicePageConfig, ServiceType } from "@/lib/service-pages";
import { DEFAULT_SERVICE_PAGES, fetchServicePageConfig } from "@/lib/service-pages";
import { ServiceInquiryForm } from "@/components/ServiceInquiryForm";

export function ServicePage({ page, type }: { page?: ServicePageConfig; type?: ServiceType }) {
  const resolvedType = type ?? page?.type ?? "career_counselling";
  const [currentPage, setCurrentPage] = useState<ServicePageConfig | null>(page ?? DEFAULT_SERVICE_PAGES[resolvedType]);

  useEffect(() => {
    let active = true;

    const loadPage = async () => {
      try {
        const nextPage = page ?? (await fetchServicePageConfig(resolvedType));
        if (active) {
          setCurrentPage(nextPage);
        }
      } catch {
        if (active) {
          setCurrentPage(DEFAULT_SERVICE_PAGES[resolvedType]);
        }
      }
    };

    void loadPage();
    return () => {
      active = false;
    };
  }, [page, resolvedType]);

  const activePage = currentPage ?? DEFAULT_SERVICE_PAGES[resolvedType];

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-secondary">
        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-24">
          <Link to="/#services" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Services
          </Link>
          <div className="mt-14 max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">{activePage.eyebrow}</p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">{activePage.title}</h1>
            {activePage.price && <p className="mt-7 inline-flex rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-bold text-accent">{activePage.price}</p>}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-start md:py-24">
        <article className="space-y-6 text-base leading-8 text-muted-foreground md:text-lg">
          {activePage.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className="flex items-center gap-3 border-t border-border pt-8 text-sm font-semibold text-foreground">
            <CheckCircle2 className="h-5 w-5 text-accent" /> Practical guidance designed around your goals
          </div>
        </article>
        <ServiceInquiryForm page={activePage} />
      </section>
    </main>
  );
}
