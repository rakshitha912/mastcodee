import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Course = Database["public"]["Tables"]["courses"]["Row"];
export type Internship = Database["public"]["Tables"]["internships"]["Row"];
export type Job = Database["public"]["Tables"]["jobs"]["Row"];

export type ApplicationFormType = "course_registration" | "internship_application";
export type ApplicationFormField = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "date" | "textarea" | "select" | "file";
  required: boolean;
  placeholder?: string;
  options?: string[];
};
export type ApplicationFormConfig = {
  title: string;
  description: string;
  submitLabel: string;
  successMessage: string;
  fields: ApplicationFormField[];
};

export const DEFAULT_APPLICATION_FORMS: Record<ApplicationFormType, ApplicationFormConfig> = {
  course_registration: {
    title: "Enroll now",
    description: "Mentor-led sessions, real project briefs, and placement support.",
    submitLabel: "Enroll now",
    successMessage: "Your enrollment request was saved successfully. Our team will contact you shortly.",
    fields: [
      { name: "full_name", label: "Full Name", type: "text", required: true, placeholder: "Full Name" },
      { name: "email", label: "Email Address", type: "email", required: true, placeholder: "Email Address" },
      { name: "phone", label: "Phone Number", type: "tel", required: true, placeholder: "Phone Number" },
      { name: "message", label: "Additional message", type: "textarea", required: false, placeholder: "Additional message" },
    ],
  },
  internship_application: {
    title: "Apply for this internship",
    description: "Share your name, phone number, email, and resume.",
    submitLabel: "Submit application",
    successMessage: "Application submitted successfully. Your resume was uploaded and saved for review.",
    fields: [
      { name: "full_name", label: "Full name", type: "text", required: true, placeholder: "Your full name" },
      { name: "email", label: "Email address", type: "email", required: true, placeholder: "you@gmail.com" },
      { name: "phone", label: "Phone number", type: "tel", required: true, placeholder: "Phone number" },
      { name: "resume", label: "Resume", type: "file", required: true, placeholder: "Choose PDF/DOC resume" },
    ],
  },
};

const localApplicationFormKey = (type: ApplicationFormType) => `mastcode-application-form:${type}`;

export function getLocalApplicationForm(type: ApplicationFormType): ApplicationFormConfig | null {
  if (typeof window === "undefined") return null;

  try {
    const serialized = window.localStorage.getItem(localApplicationFormKey(type));
    if (!serialized) return null;
    const fallback = DEFAULT_APPLICATION_FORMS[type];
    const saved = JSON.parse(serialized) as Partial<ApplicationFormConfig>;
    return {
      ...fallback,
      ...saved,
      fields: Array.isArray(saved.fields) ? saved.fields : fallback.fields,
    };
  } catch {
    return null;
  }
}

export function saveLocalApplicationForm(type: ApplicationFormType, config: ApplicationFormConfig) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(localApplicationFormKey(type), JSON.stringify(config));
}

const DEFAULT_COURSES = [
  {
    id: "full-stack-development",
    slug: "full-stack-development",
    title: "Full Stack Development",
    category: "Development",
    level: "Beginner to Intermediate",
    duration: "100 Days",
    price: 4000,
    discount_price: 4000,
    short_description: "Learn modern front-end, back-end, database, and deployment skills for full stack careers.",
    full_description: "Learn the complete workflow of modern web development with practical project work, mentor guidance, and hands-on coding across frontend, backend, and database layers.\n\nThis course helps learners build confidence in HTML, CSS, JavaScript, React, APIs, deployment, and full-stack application logic.",
    thumbnail_path: "",
    instructor: "MastCode Mentors",
    language: "English",
    skills: ["HTML", "CSS", "React", "Node.js", "Databases"],
    featured: true,
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "python-programming",
    slug: "python-programming",
    title: "Python Programming",
    category: "Programming",
    level: "Beginner",
    duration: "100 Days",
    price: 4000,
    discount_price: 4000,
    short_description: "Build Python fundamentals, real projects, and problem-solving skills for tech roles.",
    full_description: "This course introduces learners to Python programming from the ground up with a strong focus on logic, functions, problem solving, and practical projects.\n\nYou will learn how to write clean code, work with data, build mini-projects, and prepare for advanced technical learning.",
    thumbnail_path: "",
    instructor: "MastCode Mentors",
    language: "English",
    skills: ["Python", "Logic", "Lists", "Functions", "Projects"],
    featured: true,
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "data-analytics",
    slug: "data-analytics",
    title: "Data Analytics",
    category: "Data",
    level: "Beginner to Intermediate",
    duration: "100 Days",
    price: 4000,
    discount_price: 4000,
    short_description: "Use Excel, SQL, Python, and dashboards to turn raw data into business insight.",
    full_description: "Students learn how to work with datasets, clean data, analyze trends, and turn business questions into clear visual insights.\n\nThe course covers SQL, Excel, Python, dashboards, and practical reporting workflows used in analytics roles.",
    thumbnail_path: "",
    instructor: "MastCode Mentors",
    language: "English",
    skills: ["SQL", "Excel", "Python", "Analytics", "Dashboards"],
    featured: true,
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "machine-learning",
    slug: "machine-learning",
    title: "Machine Learning",
    category: "AI & ML",
    level: "Intermediate",
    duration: "100 Days",
    price: 4000,
    discount_price: 4000,
    short_description: "Learn ML foundations, model building, evaluation, and practical project workflows.",
    full_description: "Machine Learning gives learners a strong foundation in model building, evaluation, and real-world predictions using data-driven workflows.\n\nYou will work through supervised learning, model tuning, case studies, and structured projects relevant to AI and data roles.",
    thumbnail_path: "",
    instructor: "MastCode Mentors",
    language: "English",
    skills: ["ML", "Python", "Modeling", "Evaluation", "Projects"],
    featured: true,
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "artificial-intelligence",
    slug: "artificial-intelligence",
    title: "Artificial Intelligence",
    category: "AI & ML",
    level: "Intermediate",
    duration: "100 Days",
    price: 4000,
    discount_price: 4000,
    short_description: "Understand AI, model logic, prompt workflows, and applied decision systems.",
    full_description: "This course introduces core AI ideas and practical applications in automation, reasoning, and intelligent systems.\n\nIt covers the foundations of AI, machine learning concepts, and how intelligent tools are applied in real business and project scenarios.",
    thumbnail_path: "",
    instructor: "MastCode Mentors",
    language: "English",
    skills: ["AI", "Modeling", "Prompting", "Python", "Problem Solving"],
    featured: true,
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cloud-computing",
    slug: "cloud-computing",
    title: "Cloud Computing",
    category: "Cloud",
    level: "Beginner to Intermediate",
    duration: "100 Days",
    price: 4000,
    discount_price: 4000,
    short_description: "Explore cloud fundamentals, deployment, automation, and scalable architecture.",
    full_description: "This course helps learners understand cloud infrastructure, hosting, deployment, and service models used in modern product teams.\n\nYou will work with core cloud concepts, application deployment, and the building blocks of scalable technical systems.",
    thumbnail_path: "",
    instructor: "MastCode Mentors",
    language: "English",
    skills: ["Cloud", "Deployment", "Linux", "DevOps", "Architecture"],
    featured: true,
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "web-development",
    slug: "web-development",
    title: "Web Development",
    category: "Development",
    level: "Beginner",
    duration: "100 Days",
    price: 4000,
    discount_price: 4000,
    short_description: "Build responsive websites and front-end interfaces with modern tools and best practices.",
    full_description: "Learners build hands-on website projects and progressively understand the building blocks of modern web experiences.\n\nThis course focuses on design, frontend structure, responsiveness, and practical portfolio-ready work for web roles.",
    thumbnail_path: "",
    instructor: "MastCode Mentors",
    language: "English",
    skills: ["HTML", "CSS", "Responsive Design", "Frontend", "Websites"],
    featured: true,
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "git-github",
    slug: "git-github",
    title: "Git, GitHub & LinkedIn",
    category: "Development",
    level: "Beginner",
    duration: "2 Days",
    price: 1000,
    discount_price: 1000,
    short_description: "Learn Git and GitHub workflows, build a documented project portfolio, and present your work professionally on LinkedIn in two practical days.",
    full_description: "Learn version control with Git, publish and document projects on GitHub, and present your work through LinkedIn.\n\nThis two-day practical course covers commits, branches, pull requests, conflict resolution, repository documentation, profile security, and connecting project work to a professional LinkedIn profile.",
    thumbnail_path: "",
    instructor: "MastCode Mentors",
    language: "English",
    skills: ["Git", "GitHub", "LinkedIn", "Collaboration", "Version Control", "Portfolio"],
    featured: false,
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "sql-database-management",
    slug: "sql-database-management",
    title: "SQL & Database Management",
    category: "Data",
    level: "Beginner to Intermediate",
    duration: "100 Days",
    price: 4000,
    discount_price: 4000,
    short_description: "Learn SQL, relational data modeling, queries, and database operations confidently.",
    full_description: "This course gives learners a practical understanding of relational databases, SQL queries, data relationships, and database logic used across software products.\n\nIt focuses on reading, writing, structuring, and managing data in a way that supports application and analytics work.",
    thumbnail_path: "",
    instructor: "MastCode Mentors",
    language: "English",
    skills: ["SQL", "Database", "Queries", "Data Modeling", "PostgreSQL"],
    featured: true,
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
] as Course[];

const DEFAULT_TRAINING_PROGRAMS = [
  {
    id: "full-stack-bootcamp",
    slug: "full-stack-bootcamp",
    title: "Full Stack Bootcamp",
    short_description: "Intensive training to build modern development skills and portfolio confidence.",
    category: "Development",
    level: "Intermediate",
    duration: "6 Months",
    price: 79999,
    discount_price: 64999,
    featured: true,
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "data-science-bootcamp",
    slug: "data-science-bootcamp",
    title: "Data Science Bootcamp",
    short_description: "Learn analytics, Python, ML, dashboards, and real-world problem-solving.",
    category: "Data",
    level: "Beginner to Intermediate",
    duration: "6 Months",
    price: 79999,
    discount_price: 64999,
    featured: true,
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
] as TrainingProgram[];

const LOCAL_COURSES_KEY = "mastcode-courses";

export function getManagedCourses(): Course[] {
  if (typeof window !== "undefined") {
    try {
      const saved = window.localStorage.getItem(LOCAL_COURSES_KEY);
      if (saved) {
        const courses = JSON.parse(saved);
        if (Array.isArray(courses)) return courses as Course[];
      }
    } catch {
      // Fall through to the bundled course list if local data is unavailable.
    }
  }
  return DEFAULT_COURSES;
}

export function saveManagedCourses(courses: Course[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_COURSES_KEY, JSON.stringify(courses));
  window.dispatchEvent(new Event("mastcode-courses-updated"));
}

export const applicationFormQuery = (type: ApplicationFormType) =>
  queryOptions({
    queryKey: ["application-forms", type],
    queryFn: async () => {
      const fallback = getLocalApplicationForm(type) ?? DEFAULT_APPLICATION_FORMS[type];
      try {
        const { data, error } = await supabase
          .from("settings")
          .select("value")
          .eq("key", `application-form:${type}`)
          .maybeSingle();
        if (error || !data) return fallback;
        const saved = data.value as unknown as Partial<ApplicationFormConfig>;
        return {
          ...fallback,
          ...saved,
          fields: Array.isArray(saved.fields) ? saved.fields : fallback.fields,
        };
      } catch {
        return fallback;
      }
    },
  });

export function getCoursePrice(course: Pick<Course, "price" | "discount_price">) {
  return course.discount_price ?? course.price;
}

function logPublicDataError(source: string, error: unknown) {
  console.warn(`[Public data] ${source} unavailable; rendering fallback content.`, error);
}

async function withPublicFallback<T>(
  source: string,
  query: () => Promise<{ data: unknown; error: unknown }>,
  fallback: T,
): Promise<T> {
  try {
    const { data, error } = await query();
    if (error) {
      logPublicDataError(source, error);
      return fallback;
    }
    return data as T;
  } catch (error) {
    logPublicDataError(source, error);
    return fallback;
  }
}

export interface CourseWeek {
  id: string;
  course_id: string;
  week_number: number;
  month_number: number;
  title: string;
  topics: string[];
  practical_task: string | null;
  assignment: string | null;
  mini_project: string | null;
  expected_outcome: string;
}

// New types for training programs, etc. (defined locally until Supabase schema updates)
export interface TrainingProgram {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description?: string;
  full_description?: string;
  category?: string;
  level?: string;
  duration?: string;
  price?: number;
  discount_price?: number;
  thumbnail_path?: string;
  instructor?: string;
  featured: boolean;
  status: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TrainingProgramWeek {
  id: string;
  training_program_id: string;
  week_number: number;
  month_number?: number;
  title: string;
  topics?: string;
  practical_task?: string;
  assignment?: string;
  mini_project?: string;
  expected_outcome?: string;
  created_at: string;
  updated_at: string;
}

export interface InternshipWeek {
  id: string;
  internship_id: string;
  week_number: number;
  month_number?: number;
  title: string;
  topics?: string;
  tasks?: string;
  project?: string;
  learning_outcome?: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  slug: string;
  designation: string;
  department?: string;
  bio?: string;
  photo_path?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  display_order: number;
  status: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export const coursesQuery = () =>
  queryOptions({
    queryKey: ["courses"],
    queryFn: () => {
      return getManagedCourses()
        .filter((course) => course.status === "published")
        .sort((left, right) => Number(right.featured) - Number(left.featured) || left.title.localeCompare(right.title));
    },
  });

export const courseQuery = (slug: string) =>
  queryOptions({
    queryKey: ["courses", slug],
    queryFn: () => getManagedCourses().find((course) => course.slug === slug && course.status === "published") ?? null,
  });

export const courseWeeksQuery = (courseId: string) =>
  queryOptions({
    queryKey: ["course-weeks", courseId],
    queryFn: () =>
      withPublicFallback<CourseWeek[]>(
        `course-weeks:${courseId}`,
        () =>
          (supabase as any)
        .from("course_weeks")
        .select("*")
        .eq("course_id", courseId)
        .order("week_number"),
        [],
      ),
  });

export const internshipsQuery = () =>
  queryOptions({
    queryKey: ["internships"],
    queryFn: () =>
      withPublicFallback<Internship[]>(
        "internships",
        () =>
          supabase
        .from("internships")
        .select("*")
        .eq("status", "published")
        .order("featured", { ascending: false })
        .order("title"),
        [],
      ),
  });

export const internshipQuery = (slug: string) =>
  queryOptions({
    queryKey: ["internships", slug],
    queryFn: () =>
      withPublicFallback<Internship | null>(
        `internship:${slug}`,
        () =>
          supabase
        .from("internships")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle(),
        null,
      ),
  });

export const jobsQuery = () =>
  queryOptions({
    queryKey: ["jobs"],
    queryFn: () =>
      withPublicFallback<Job[]>(
        "jobs",
        () =>
          supabase
        .from("jobs")
        .select("*")
        .eq("status", "published")
        .order("featured", { ascending: false })
        .order("title"),
        [],
      ),
  });

export const jobQuery = (slug: string) =>
  queryOptions({
    queryKey: ["jobs", slug],
    queryFn: () =>
      withPublicFallback<Job | null>(
        `job:${slug}`,
        () =>
          supabase
        .from("jobs")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle(),
        null,
      ),
  });

// Training Programs
export const trainingProgramsQuery = () =>
  queryOptions({
    queryKey: ["training-programs"],
    queryFn: async () => {
      try {
        const { data, error } = await (supabase as any)
          .from("training_programs")
          .select("*")
          .eq("status", "published")
          .order("featured", { ascending: false })
          .order("title");

        if (error) {
          logPublicDataError("training-programs", error);
          return DEFAULT_TRAINING_PROGRAMS;
        }

        return (Array.isArray(data) && data.length > 0 ? data : DEFAULT_TRAINING_PROGRAMS) as TrainingProgram[];
      } catch (error) {
        logPublicDataError("training-programs", error);
        return DEFAULT_TRAINING_PROGRAMS;
      }
    },
  });

export const trainingProgramQuery = (slug: string) =>
  queryOptions({
    queryKey: ["training-programs", slug],
    queryFn: async () => {
      try {
        const { data, error } = await (supabase as any)
          .from("training_programs")
          .select("*")
          .eq("slug", slug)
          .eq("status", "published")
          .maybeSingle();

        if (error) {
          logPublicDataError(`training-program:${slug}`, error);
          return DEFAULT_TRAINING_PROGRAMS.find((program) => program.slug === slug) ?? null;
        }

        return (data ?? DEFAULT_TRAINING_PROGRAMS.find((program) => program.slug === slug) ?? null) as TrainingProgram | null;
      } catch (error) {
        logPublicDataError(`training-program:${slug}`, error);
        return DEFAULT_TRAINING_PROGRAMS.find((program) => program.slug === slug) ?? null;
      }
    },
  });

export const trainingProgramWeeksQuery = (trainingProgramId: string) =>
  queryOptions({
    queryKey: ["training-program-weeks", trainingProgramId],
    queryFn: () =>
      withPublicFallback<TrainingProgramWeek[]>(
        `training-program-weeks:${trainingProgramId}`,
        () =>
          (supabase as any)
        .from("training_program_weeks")
        .select("*")
        .eq("training_program_id", trainingProgramId)
        .order("week_number"),
        [],
      ),
  });

// Team Members
export const teamMembersQuery = () =>
  queryOptions({
    queryKey: ["team-members"],
    queryFn: () =>
      withPublicFallback<TeamMember[]>(
        "team-members",
        () =>
          (supabase as any)
        .from("team_members")
        .select("*")
        .eq("published", true)
        .not("role", "ilike", "%co-founder%")
        .order("display_order"),
        [],
      ),
  });

export const teamMemberQuery = (slug: string) =>
  queryOptions({
    queryKey: ["team-members", slug],
    queryFn: () =>
      withPublicFallback<TeamMember | null>(
        `team-member:${slug}`,
        () =>
          (supabase as any)
        .from("team_members")
        .select("*")
        .eq("name", slug)
        .eq("published", true)
        .maybeSingle(),
        null,
      ),
  });

// Internship Weeks
export const internshipWeeksQuery = (internshipId: string) =>
  queryOptions({
    queryKey: ["internship-weeks", internshipId],
    queryFn: () =>
      withPublicFallback<InternshipWeek[]>(
        `internship-weeks:${internshipId}`,
        () =>
          (supabase as any)
        .from("internship_weeks")
        .select("*")
        .eq("internship_id", internshipId)
        .order("week_number"),
        [],
      ),
  });
