import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  Code2,
  Flame,
  GraduationCap,
  Mail,
  Phone,
  Rocket,
  School,
  Send,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  X,
  Instagram,
  Linkedin,
} from "lucide-react";
import { ASSETS } from "@/lib/assets";
import { teamMembersQuery } from "@/lib/queries";
import { SafeImage } from "@/components/SafeImage";
import { Reveal } from "@/components/Reveal";
import { submitJsonForm } from "@/lib/form-submit";
import { SiteFooter, SiteNav } from "@/components/site-chrome";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(teamMembersQuery()),
  head: () => ({
    meta: [
      { title: "MastCode — Your Growth Partner for Skills, Careers & Business" },
      {
        name: "description",
        content:
          "MastCode empowers students, professionals, institutions, and businesses through career guidance, technical training, placement support, and digital growth solutions.",
      },
      { property: "og:title", content: "MastCode — Your Growth Partner for Skills, Careers & Business" },
      {
        property: "og:description",
        content:
          "MastCode helps people learn, grow their careers, institutions develop their students, and businesses grow digitally.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const stats = [
  { value: "Career guidance", label: "Personalized direction" },
  { value: "Skills training", label: "Industry-relevant learning" },
  { value: "Institution support", label: "Campus and workforce growth" },
  { value: "Business growth", label: "Technology and digital solutions" },
];

const serviceCards = [
  {
    icon: Target,
    title: "Career Counselling & Guidance",
    description: "Personalized guidance to help students and professionals find the right career direction.",
    accent: "text-flame-cyan",
    href: "/career-counselling",
  },
  {
    icon: Code2,
    title: "Technical Training",
    description:
      "Industry-oriented training in frontend, backend, Python, AI, machine learning, and full-stack development.",
    accent: "text-flame-blue",
    href: "/courses",
  },
  {
    icon: Briefcase,
    title: "Placement Assistance",
    description: "Resume, interview, and job-readiness support to help candidates pursue career opportunities.",
    accent: "text-flame-violet",
    href: "/placement-assistance",
  },
  {
    icon: School,
    title: "Educational Institution Partnerships",
    description:
      "Workshops, college programs, student development initiatives, and placement preparation tailored to institutions.",
    accent: "text-flame-cyan",
    href: "/institution-partnerships",
  },
  {
    icon: Rocket,
    title: "Website Development & Enhancement",
    description: "Professional, responsive websites and practical enhancements designed around business goals.",
    accent: "text-flame-blue",
    href: "/website-development",
  },
  {
    icon: TrendingUp,
    title: "Digital Marketing",
    description: "SEO, social media, content, branding, and campaign support to help businesses grow.",
    accent: "text-flame-violet",
    href: "/digital-marketing",
  },
];

const studentJourney = [
  { title: "Discover Your Path", text: "Career counselling and guidance to align your strengths with the right opportunities." },
  { title: "Learn Industry-Relevant Skills", text: "Technical and professional training shaped around real-world requirements." },
  { title: "Build Real Projects", text: "Work on practical projects that deepen capability and confidence." },
  { title: "Prepare for Opportunities", text: "Resume support, interview readiness, and career-focused preparation." },
  { title: "Launch Your Career", text: "Internships, placement support, and career opportunities to help you begin strong." },
];

function AboutIntro() {
  const audienceCards = [
    { icon: GraduationCap, title: "Students", text: "Build skills, gain confidence, shape your future.", tone: "bg-sky-50 text-sky-700" },
    { icon: Briefcase, title: "Professionals", text: "Upgrade your skills, boost your career.", tone: "bg-violet-50 text-violet-700" },
    { icon: Building2, title: "Businesses", text: "Get skilled talent, drive digital growth.", tone: "bg-emerald-50 text-emerald-700" },
  ];
  const highlights = [
    { icon: Target, label: "Career Guidance", detail: "Right direction. Better future." },
    { icon: Code2, label: "Technical Training", detail: "Hands-on. Industry-ready." },
    { icon: TrendingUp, label: "Digital Growth", detail: "Build your online presence." },
  ];

  return (
    <section className="relative overflow-hidden border-b border-border bg-white">
      <div className="pointer-events-none absolute -left-24 bottom-[-10rem] h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute left-[38%] top-[-8rem] h-72 w-72 rounded-full bg-sky-100/80 blur-3xl" />
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl md:grid-cols-2">
        <div className="mastcode-brand-panel relative flex items-center justify-center overflow-hidden border-b border-border px-6 py-12 md:border-b-0 md:border-r md:px-12 md:py-16">
          <div className="pointer-events-none absolute left-8 top-12 grid grid-cols-5 gap-2 opacity-40" aria-hidden="true">
            {Array.from({ length: 25 }).map((_, index) => <span key={index} className="h-1 w-1 rounded-full bg-primary" />)}
          </div>
          <div className="mastcode-brand-orb mastcode-brand-orb-top" aria-hidden="true" />
          <div className="mastcode-brand-orb mastcode-brand-orb-left" aria-hidden="true" />
          <div className="mastcode-brand-wave" aria-hidden="true" />
          <div className="pointer-events-none absolute bottom-10 right-10 text-5xl font-light text-primary/35" aria-hidden="true">&lt;/&gt;</div>
          <div className="relative flex w-full max-w-md items-center">
            <img
              src={ASSETS.LOGO}
              alt="MastCode logo"
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
        <div className="flex items-center px-6 py-12 md:px-10 md:py-16 lg:px-14">
          <div className="w-full max-w-2xl">
            <p className="inline-flex rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">About MastCode</p>
            <h1 className="mt-4 max-w-xl font-display text-4xl font-bold leading-[1.08] tracking-tight md:text-5xl lg:text-6xl">
              Your Growth Partner for Skills, Careers &amp; Business
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              MastCode helps students, professionals, institutions, and businesses move forward with practical skills, clear guidance, and digital solutions.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {audienceCards.map(({ icon: Icon, title, text, tone }) => (
                <article key={title} className="rounded-xl border border-border bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                  <span className={`inline-flex rounded-lg p-2 ${tone}`}><Icon className="h-4 w-4" /></span>
                  <h2 className="mt-3 text-sm font-bold text-foreground">{title}</h2>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p>
                </article>
              ))}
            </div>
            <div className="mt-7 grid gap-4 border-t border-border pt-5 sm:grid-cols-3">
              {highlights.map(({ icon: Icon, label, detail }) => (
                <div key={label} className="flex gap-2.5">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-xs font-bold text-foreground">{label}</p>
                    <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Hero() {
  const heroTracks = ["Python", "Full Stack", "AI/ML", "Cloud", "Data"];
  const consoleItems = [
    { title: "Full Stack Development", detail: "React, APIs, database, deployment", href: "/courses/full-stack-development" },
    { title: "AI/ML Internship", detail: "Python, models, reports, mentoring", href: "/internships" },
    { title: "Career Counselling", detail: "Resume, interview, career roadmap", href: "/career-counselling" },
  ];

  return (
    <section className="border-b border-border bg-white">
      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1.02fr_0.98fr] md:items-center md:py-20">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Skills, internships, careers, and digital growth
          </div>
          <h1 className="max-w-4xl font-display text-5xl font-bold leading-[1.05] md:text-7xl">
            Build · Code · <span className="text-flame-gradient">Grow.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            MastCode helps learners and professionals build practical technology skills, complete real projects, and move toward internships, jobs, and stronger career outcomes.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-accent"
            >
              <Flame className="h-5 w-5" />
              Explore Courses
            </Link>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-6 py-3 text-base font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              View Careers
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <dl className="mt-14 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <dd className="font-display text-lg font-bold text-flame-gradient">{s.value}</dd>
                <dt className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-md">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-14 w-24 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-border">
                  <img src={ASSETS.LOGO} alt="MastCode logo" className="h-full w-full object-contain" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">MastCode Career Console</p>
                  <p className="text-xs text-muted-foreground">Live learning and hiring pipeline</p>
                </div>
              </div>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Open</span>
            </div>
            <div className="grid gap-px bg-border sm:grid-cols-2">
              <div className="bg-card p-5">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Active tracks</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {heroTracks.map((track) => (
                    <span key={track} className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                      {track}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-card p-5">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Application status</p>
                <div className="mt-4 space-y-3 text-sm">
                  {["Applied", "Under Review", "Interview", "Selected"].map((item, index) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className={`h-2.5 w-2.5 rounded-full ${index < 2 ? "bg-accent" : "bg-border"}`} />
                      <span className={index < 2 ? "text-foreground" : "text-muted-foreground"}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4 p-5">
              {consoleItems.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="group block rounded-xl border border-border bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold transition-colors group-hover:text-accent">{item.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-accent transition-transform group-hover:translate-x-1" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhoWeHelp() {
  const [activeCategory, setActiveCategory] = useState<"students" | "institutions" | "professionals" | "businesses" | null>(null);

  const cards = [
    {
      key: "students",
      title: "Students",
      icon: GraduationCap,
      description: "Build skills, gain confidence, and prepare for your career.",
    },
    {
      key: "institutions",
      title: "Educational Institutions",
      icon: School,
      description: "Partner with MastCode to provide industry-focused training and career development programs.",
    },
    {
      key: "professionals",
      title: "Professionals",
      icon: Users,
      description: "Upskill, grow professionally, and prepare for better opportunities.",
    },
    {
      key: "businesses",
      title: "Businesses",
      icon: Building2,
      description: "Build a stronger digital presence and grow your business with technology and marketing solutions.",
    },
  ] as const;

  const details = {
    students: {
      eyebrow: "Students",
      title: "Build Skills. Gain Confidence. Prepare for Your Future.",
      paragraphs: [
        "MastCode helps students build the skills, confidence, and direction needed to grow in a competitive career landscape. Our programs combine practical knowledge, technical training, career guidance, and real-world exposure.",
        "Students can explore frontend development, backend development, Python, artificial intelligence, machine learning, and full-stack development based on their interests and career goals.",
        "We also support resume building, portfolio development, interview preparation, and career planning so students can move from learning to opportunity with clarity.",
      ],
    },
    institutions: {
      eyebrow: "Educational Institutions",
      title: "Empowering Institutions. Preparing Future Talent.",
      paragraphs: [
        "MastCode partners with educational institutions to create stronger learning and career development opportunities for students.",
        "We provide industry-focused training programs, workshops, technical sessions, career guidance, and skill-development initiatives designed to complement academic education.",
        "Our partnerships help institutions build confident, industry-ready students by connecting classroom learning with practical skills and career exposure.",
      ],
      cta: "Partner With MastCode",
      ctaHref: "/#contact",
    },
    professionals: {
      eyebrow: "Professionals",
      title: "Upskill Today. Grow Tomorrow.",
      paragraphs: [
        "The professional world changes quickly, and continuous upskilling is essential for long-term career growth.",
        "MastCode helps professionals strengthen technical capability through practical programs in web development, Python, artificial intelligence, machine learning, and modern development workflows.",
        "Beyond technical learning, we support resume improvement, interview readiness, portfolio building, and career direction so professionals can move toward stronger opportunities.",
      ],
    },
    businesses: {
      eyebrow: "Businesses",
      title: "Build Your Digital Presence. Grow Your Business.",
      paragraphs: [
        "A strong digital presence helps businesses communicate clearly, reach the right audience, and grow with confidence.",
        "MastCode supports businesses through website development, website enhancement, SEO, social media marketing, content strategy, branding, and digital growth solutions.",
        "Our goal is to create practical digital experiences that improve visibility, strengthen brand identity, and support business growth.",
      ],
    },
  } as const;

  useEffect(() => {
    if (!activeCategory) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveCategory(null);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeCategory]);

  const handleLearnMore = (key: "students" | "institutions" | "professionals" | "businesses") => {
    setActiveCategory(key);
  };

  const active = activeCategory ? details[activeCategory] : null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Who we help</p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">Empowering Growth at Every Stage</h2>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ key, title, icon: Icon, description }) => (
          <article
            key={title}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
          >
            <div className="mb-5 inline-flex rounded-xl bg-secondary p-3">
              <Icon className="h-6 w-6 text-flame-cyan" />
            </div>
            <h3 className="font-display text-2xl font-semibold">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
            <button
              type="button"
              onClick={() => handleLearnMore(key)}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              Learn More <ArrowRight className="h-4 w-4" />
            </button>
          </article>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/45 p-4 animate-in fade-in duration-300 md:p-8"
          role="presentation"
          onClick={() => setActiveCategory(null)}
        >
          <article
            role="dialog"
            aria-modal="true"
            aria-labelledby="who-we-help-dialog-title"
            className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-white text-foreground shadow-2xl animate-in zoom-in-95 duration-300 md:max-h-[calc(100vh-4rem)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-4 md:px-10">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{active.eyebrow}</p>
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/40"
                aria-label="Close document"
              >
                <X className="h-4 w-4" />
                Close
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-10 md:px-16 md:py-14">
              <h3 id="who-we-help-dialog-title" className="max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
                {active.title}
              </h3>
              <div className="mt-8 max-w-3xl space-y-6 text-base leading-8 text-muted-foreground md:text-lg">
                {active.paragraphs.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>
              {"cta" in active && active.cta && active.ctaHref && (
                <div className="mt-10">
                  <Link
                    to={active.ctaHref}
                    onClick={() => setActiveCategory(null)}
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-accent"
                  >
                    {active.cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </article>
        </div>
      )}
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="border-y border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">What we do</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">What We Do</h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {serviceCards.map(({ icon: Icon, title, description, accent, href }) => {
            const cardContent = (
              <>
                <div className="mb-5 inline-flex rounded-xl bg-secondary p-3">
                  <Icon className={`h-6 w-6 ${accent}`} />
                </div>
                <h3 className="font-display text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </>
            );

            if (href) {
              return (
                <Link
                  key={title}
                  to={href}
                  className="group rounded-2xl border border-border bg-background p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                >
                  {cardContent}
                </Link>
              );
            }

            return (
              <div key={title} className="rounded-2xl border border-border bg-background p-6">
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WhyChooseMastCode() {
  const reasons = [
    ["Practical Approach", "Learning and solutions focused on real-world requirements."],
    ["Personalized Support", "Guidance based on individual and organizational needs."],
    ["Growth-Focused", "We focus on meaningful career, educational, and business growth."],
    ["Industry-Relevant Skills", "Training aligned with current industry requirements."],
    ["Institutional Collaboration", "Professional programs designed for educational institutions."],
    ["Complete Growth Solutions", "Supporting both individuals and businesses through practical engagement."],
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Why choose MastCode</p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">Why Choose MastCode?</h2>
      </div>
      <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {reasons.map(([title, text]) => (
          <div key={title} className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-accent">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function StudentsJourney() {
  return (
    <section id="students" className="border-y border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">For students</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">Your Career Journey Starts Here</h2>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {studentJourney.map((step, index) => (
            <div key={step.title} className="rounded-2xl border border-border bg-background p-5">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 font-bold text-accent">
                {index + 1}
              </div>
              <h3 className="font-display text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground"
          >
            Start Your Journey <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function InstitutionsSection() {
  return (
    <section id="institutions" className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">For institutions</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">Partner With MastCode</h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            MastCode collaborates with educational institutions to bridge the gap between education and industry requirements. Our programs are designed to help students develop practical skills, career awareness, confidence, and job readiness.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            {[
              "Technical Training Programs",
              "Career Guidance Sessions",
              "Industry-Oriented Workshops",
              "Student Webinars",
              "Placement Preparation",
              "Resume Building",
              "Interview Preparation",
              "Internship Opportunities",
              "Frontend, Backend, Python and AI/ML Training",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Link
              to="/#contact"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground"
            >
              Partner With MastCode <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h3 className="font-display text-3xl font-semibold">Institution Enquiry</h3>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Share your institution's requirements through our dedicated partnership form.</p>
          <Link to="/institution-partnerships" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 font-semibold text-accent-foreground">Open Institution Partnership Form <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  );
}

function BusinessesSection() {
  return (
    <section id="businesses" className="border-y border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">For businesses</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">Grow Your Business With MastCode</h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            We help businesses strengthen their digital presence through technology, professional websites, digital marketing, branding, and growth-focused solutions.
          </p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[
            "Website Development",
            "Website Enhancement",
            "Digital Marketing",
            "SEO",
            "Social Media Marketing",
            "Branding & Content",
          ].map((service) => (
            <div key={service} className="rounded-2xl border border-border bg-background p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-accent">
                <Rocket className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl font-semibold">{service}</h3>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/#contact"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground"
          >
            Discuss Your Business Requirements <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function MastCodeGallery() {
  const actionCards = [
    {
      title: "Workshops",
      detail: "Hands-on sessions for web, Python, AI, databases, and career-ready project practice.",
      label: "Skill building",
      icon: Code2,
    },
    {
      title: "College Visits",
      detail: "Campus sessions, student guidance, placement preparation, and institution collaboration.",
      label: "Campus connect",
      icon: School,
    },
    {
      title: "Training Sessions",
      detail: "Structured learning tracks with practical tasks, mentoring, and portfolio outcomes.",
      label: "Live training",
      icon: GraduationCap,
    },
    {
      title: "Webinars",
      detail: "Online sessions for career clarity, technology awareness, resumes, and interviews.",
      label: "Online support",
      icon: Users,
    },
    {
      title: "Events",
      detail: "Community learning moments that connect students, mentors, colleges, and businesses.",
      label: "Community",
      icon: Sparkles,
    },
    {
      title: "Team Activity",
      detail: "Planning, mentoring, and delivery work behind MastCode programs and services.",
      label: "Mentor led",
      icon: Target,
    },
  ];

  return (
    <section id="mastcode-action" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">MastCode in action</p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">MastCode in Action</h2>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Real work, training formats, and collaboration moments from MastCode programs.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {actionCards.map((item) => {
          const Icon = item.icon;

          return (
            <article key={item.title} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
              <div className="relative flex h-48 items-center justify-center overflow-hidden border-b border-border bg-secondary">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-white text-primary shadow-sm">
                  <Icon className="h-9 w-9" />
                </div>
                <span className="absolute left-4 top-4 rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold text-primary shadow-sm">
                  {item.label}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    {
      quote: "The sessions made technical concepts easier to understand because every topic connected back to a real project or career use case.",
      name: "Student Learner",
      role: "Technical Training",
    },
    {
      quote: "MastCode's workshop format is practical, structured, and useful for students who need exposure beyond classroom theory.",
      name: "Institution Partner",
      role: "Campus Program",
    },
    {
      quote: "The team understood our business requirements clearly and helped us think through a better digital presence.",
      name: "Business Client",
      role: "Digital Solutions",
    },
  ];

  return (
    <section className="border-y border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Testimonials</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">What Our Community Says</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <article key={item.name} className="flex h-full flex-col rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="mb-5 flex gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="flex-1 text-sm leading-relaxed text-muted-foreground">"{item.quote}"</p>
              <div className="mt-6 border-t border-border pt-4">
                <p className="font-display text-base font-semibold text-foreground">{item.name}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent">{item.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CEOSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl border-2 border-accent/30">
            <SafeImage
              src={ASSETS.CEO_PHOTO}
              alt="Rakshitha S — Founder & CEO"
              fallbackLabel="Rakshitha S"
              loading="lazy"
              containerClassName="h-96 w-full"
              className="relative z-10 h-96 w-full bg-secondary/50 object-contain object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Meet our founder</p>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">Rakshitha S</h2>
            <p className="mt-2 text-lg font-medium text-primary">Founder & CEO</p>
          </div>

          <p className="text-lg leading-relaxed text-muted-foreground">
            “MastCode was created with a vision to help students, professionals, educational institutions, and businesses unlock new opportunities through the right skills, guidance, technology, and growth strategies.”
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Focus</p>
              <p className="mt-2 font-semibold">Growth & Skills</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Mission</p>
              <p className="mt-2 font-semibold">Career & Business Growth</p>
            </div>
          </div>

          <a
            href="https://www.linkedin.com/in/rakshitha-s-619496247/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground transition-all hover:brightness-110"
          >
            <Star className="h-5 w-5" />
            Connect on LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}

function TeamPreview() {
  const { data: members } = useSuspenseQuery(teamMembersQuery());
  const preview = members.slice(0, 3);

  if (preview.length === 0) return null;

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">The people behind the platform</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">Meet the MastCode team</h2>
          </div>
          <Link to="/teams" className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-foreground">
            View full team <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {preview.map((member: any) => (
            <article key={member.id} className="overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/60">
              {member.photo_path && (
                <img src={member.photo_path} alt={member.name} loading="lazy" className="h-56 w-full object-cover" />
              )}
              <div className="p-5">
                <h3 className="font-display text-xl font-semibold">{member.name}</h3>
                <p className="mt-1 text-sm text-accent">{member.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookCallSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    service: "Student Programs",
    message: "",
    consent: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    const checked = (event.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.message.trim()) {
      return;
    }

    if (!formData.consent) {
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      await submitJsonForm({
        form_type: "contact_enquiry",
        service_type: "contact_enquiry",
        full_name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.service,
        interested_service: formData.service,
        message: formData.message.trim(),
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to submit your enquiry.");
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      service: "Student Programs",
      message: "",
      consent: false,
    });
  };

  const fieldClass =
    "w-full rounded-lg border border-input bg-white px-4 py-3.5 text-base text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15";
  const labelClass = "mb-2 block text-sm font-semibold text-foreground";

  return (
    <section id="contact" className="border-y border-border bg-secondary px-4 py-16 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-border bg-white shadow-md">
        <div className="flex flex-col gap-4 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-20 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm">
              <img src={ASSETS.LOGO} alt="MastCode logo" className="h-full w-full object-contain" />
            </span>
            <div>
              <p className="font-display text-2xl font-black tracking-tight text-foreground">MastCode</p>
              <p className="text-sm text-muted-foreground">Programs, careers, and business support</p>
            </div>
          </div>
          <a href="tel:+917019161991" className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent">
            Book a Call
          </a>
        </div>

        <div className="grid gap-8 p-5 sm:p-6 lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
          <div className="flex flex-col justify-between">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Contact MastCode
              </p>
              <h2 className="font-display text-4xl font-black leading-tight text-foreground sm:text-5xl">
                Let's Grow <span className="text-primary">Together.</span>
              </h2>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
                Have questions about programs, campus initiatives, hiring, or business solutions? Send a message and our team will respond within 24 hours.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <a href="mailto:rakshithamastcode@gmail.com" className="group flex items-center gap-4 rounded-xl border border-border bg-secondary p-4 transition hover:border-primary/35 hover:bg-white">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-white text-primary">
                  <Mail className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-muted-foreground">Email Us</span>
                  <span className="block break-all text-base font-semibold text-foreground group-hover:text-primary">rakshithamastcode@gmail.com</span>
                </span>
              </a>
              <a href="tel:+917019161991" className="group flex items-center gap-4 rounded-xl border border-border bg-secondary p-4 transition hover:border-primary/35 hover:bg-white">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-white text-primary">
                  <Phone className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-muted-foreground">Call / WhatsApp</span>
                  <span className="block text-base font-semibold text-foreground group-hover:text-primary">+91 7019161991</span>
                </span>
              </a>
              <a href="tel:+917483645279" className="group flex items-center gap-4 rounded-xl border border-border bg-secondary p-4 transition hover:border-primary/35 hover:bg-white">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-white text-primary">
                  <Phone className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-muted-foreground">Alternate Call / WhatsApp</span>
                  <span className="block text-base font-semibold text-foreground group-hover:text-primary">+91 7483 645 279</span>
                </span>
              </a>
            </div>

            <div className="mt-8">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Connect on social media</p>
              <div className="flex gap-3">
                <a href="https://www.linkedin.com/in/rakshitha-s-619496247/" target="_blank" rel="noreferrer" aria-label="Rakshitha S LinkedIn" className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-white text-muted-foreground transition hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="https://www.instagram.com/srakshitha_21/" target="_blank" rel="noreferrer" aria-label="Instagram" className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-white text-muted-foreground transition hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h3 className="text-3xl font-bold tracking-tight text-foreground">Send a Message</h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                Share a few details and we will guide you to the right program, partnership, or service.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Full Name *</span>
                  <input name="fullName" value={formData.fullName} onChange={handleChange} type="text" placeholder="Your Name" className={fieldClass} />
                </label>
                <label className="block">
                  <span className={labelClass}>Email Address *</span>
                  <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="your.email@example.com" className={fieldClass} />
                </label>
                <label className="block">
                  <span className={labelClass}>Phone Number *</span>
                  <input name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="+91 98765 43210" className={fieldClass} />
                </label>
                <label className="block">
                  <span className={labelClass}>I am interested in *</span>
                  <select name="service" value={formData.service} onChange={handleChange} className={fieldClass}>
                    <option>Student Programs</option>
                    <option>Institution Partnership</option>
                    <option>Business Solutions</option>
                    <option>Career Opportunities</option>
                    <option>Technical Training</option>
                    <option>Placement Assistance</option>
                    <option>Website Development</option>
                    <option>Digital Marketing</option>
                  </select>
                </label>
              </div>
              <label className="mt-4 block">
                <span className={labelClass}>Message *</span>
                <textarea name="message" value={formData.message} onChange={handleChange} rows={5} placeholder="How can MastCode help you?" className={fieldClass} />
              </label>
              <label className="mt-5 flex items-start gap-3 rounded-xl border border-border bg-secondary p-3">
                <input name="consent" checked={formData.consent} onChange={handleChange} type="checkbox" className="mt-1 h-4 w-4 rounded accent-primary" />
                <span className="text-sm leading-6 text-muted-foreground">I grant explicit consent to MastCode to collect and process my personal data only for the purpose of responding to my inquiry.</span>
              </label>
              {submitted && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  Your enquiry has been submitted successfully. The MastCode team will contact you soon.
                </div>
              )}
              {submitError && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>}
              <button type="submit" disabled={submitting} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-lg font-bold text-primary-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60">
                <Send className="h-5 w-5" />
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section id="careers" className="mx-auto max-w-7xl px-6 py-24">
      <div className="rounded-2xl border border-border bg-card p-10 shadow-sm md:p-16">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
              <Users className="h-3.5 w-3.5 text-accent" />
              Careers & growth opportunities
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Ready to Grow With MastCode?</h2>
            <p className="mt-4 text-muted-foreground">Explore our services, connect with our team, or start your journey with career guidance, technical learning, and business support.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/#services" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-accent">Explore Our Services <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/#contact" className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary">Partner With Us</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main>
        <AboutIntro />
        <Hero />
        <WhoWeHelp />
        <Services />
        <WhyChooseMastCode />
        <StudentsJourney />
        <InstitutionsSection />
        <BusinessesSection />
        <MastCodeGallery />
        <Testimonials />
        <CEOSection />
        <TeamPreview />
        <BookCallSection />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
