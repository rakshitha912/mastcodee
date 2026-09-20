import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Course = Database["public"]["Tables"]["courses"]["Row"];
export type Internship = Database["public"]["Tables"]["internships"]["Row"];
export type Job = Database["public"]["Tables"]["jobs"]["Row"];

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
    queryFn: () =>
      withPublicFallback<Course[]>(
        "courses",
        () =>
          supabase
        .from("courses")
        .select("*")
        .eq("status", "published")
        .order("featured", { ascending: false })
        .order("title"),
        [],
      ),
  });

export const courseQuery = (slug: string) =>
  queryOptions({
    queryKey: ["courses", slug],
    queryFn: () =>
      withPublicFallback<Course | null>(
        `course:${slug}`,
        () =>
          supabase
        .from("courses")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle(),
        null,
      ),
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
    queryFn: () =>
      withPublicFallback<TrainingProgram[]>(
        "training-programs",
        () =>
          (supabase as any)
        .from("training_programs")
        .select("*")
        .eq("status", "published")
        .order("featured", { ascending: false })
        .order("title"),
        [],
      ),
  });

export const trainingProgramQuery = (slug: string) =>
  queryOptions({
    queryKey: ["training-programs", slug],
    queryFn: () =>
      withPublicFallback<TrainingProgram | null>(
        `training-program:${slug}`,
        () =>
          (supabase as any)
        .from("training_programs")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle(),
        null,
      ),
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
