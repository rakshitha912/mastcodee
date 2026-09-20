-- 1. Training programs
CREATE TABLE public.training_programs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT 'Technical',
  description text NOT NULL DEFAULT '',
  skills text[] NOT NULL DEFAULT '{}',
  duration text NOT NULL DEFAULT '',
  mode text NOT NULL DEFAULT 'Hybrid',
  eligibility text NOT NULL DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',
  featured boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.training_programs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.training_programs TO authenticated;
GRANT ALL ON public.training_programs TO service_role;
ALTER TABLE public.training_programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published training" ON public.training_programs FOR SELECT TO anon, authenticated USING ((status = 'published') OR is_staff(auth.uid()));
CREATE POLICY "Staff manage training" ON public.training_programs FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER training_programs_updated_at BEFORE UPDATE ON public.training_programs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Course / training registrations (enrollments)
CREATE TABLE public.registrations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_type text NOT NULL,
  item_id uuid,
  item_title text NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'New',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.registrations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.registrations TO authenticated;
GRANT ALL ON public.registrations TO service_role;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can register" ON public.registrations FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Users read own registrations" ON public.registrations FOR SELECT TO authenticated USING (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));
CREATE POLICY "Staff manage registrations" ON public.registrations FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER registrations_updated_at BEFORE UPDATE ON public.registrations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Organization (client / college) registrations
CREATE TABLE public.organization_registrations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_name text NOT NULL,
  contact_person text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  org_type text NOT NULL DEFAULT 'company',
  requirements text NOT NULL DEFAULT '',
  training_requirements text NOT NULL DEFAULT '',
  hiring_requirements text NOT NULL DEFAULT '',
  headcount integer NOT NULL DEFAULT 0,
  preferred_program text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'New',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.organization_registrations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.organization_registrations TO authenticated;
GRANT ALL ON public.organization_registrations TO service_role;
ALTER TABLE public.organization_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can register an organization" ON public.organization_registrations FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Staff manage organization registrations" ON public.organization_registrations FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER organization_registrations_updated_at BEFORE UPDATE ON public.organization_registrations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Hiring requests from clients
CREATE TABLE public.hiring_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name text NOT NULL,
  contact_person text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  position text NOT NULL,
  openings integer NOT NULL DEFAULT 1,
  required_skills text NOT NULL DEFAULT '',
  qualification text NOT NULL DEFAULT '',
  experience text NOT NULL DEFAULT '',
  salary_range text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  job_type text NOT NULL DEFAULT 'Full-time',
  joining_timeline text NOT NULL DEFAULT '',
  additional_requirements text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'New',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.hiring_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hiring_requests TO authenticated;
GRANT ALL ON public.hiring_requests TO service_role;
ALTER TABLE public.hiring_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a hiring request" ON public.hiring_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Staff manage hiring requests" ON public.hiring_requests FOR ALL TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER hiring_requests_updated_at BEFORE UPDATE ON public.hiring_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Saved / bookmarked positions
CREATE TABLE public.saved_positions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  position_type text NOT NULL,
  position_id uuid NOT NULL,
  position_title text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, position_type, position_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_positions TO authenticated;
GRANT ALL ON public.saved_positions TO service_role;
ALTER TABLE public.saved_positions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own saved positions" ON public.saved_positions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 6. Candidates can read their own applications (powers status tracking + portal)
CREATE POLICY "Users read own applications" ON public.applications FOR SELECT TO authenticated USING (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

-- 7. Security hardening: lock down function EXECUTE grants
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
REVOKE ALL ON FUNCTION public.is_staff(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO anon, authenticated;
REVOKE ALL ON FUNCTION public.recent_application_exists(text, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.recent_application_exists(text, uuid) TO anon, authenticated;

-- 8. Seed training programs
INSERT INTO public.training_programs (title, slug, category, description, skills, duration, mode, eligibility, price, status, featured, published_at) VALUES
('Full-Stack Project Bootcamp', 'full-stack-project-bootcamp', 'Project', 'Build and deploy three production-grade projects with code reviews, Git workflows, and deployment pipelines. You graduate with a portfolio recruiters can verify.', '{React,Node.js,PostgreSQL,Git,Docker}', '8 weeks', 'Hybrid', 'Students and graduates with basic programming knowledge', 4999, 'published', true, now()),
('Corporate Technology Training', 'corporate-technology-training', 'Corporate', 'Customized upskilling programs for engineering teams: modern web stacks, Python automation, data tooling, and cloud fundamentals, delivered on-site or remote.', '{Python,Web Development,SQL,Cloud}', 'Custom (1-6 weeks)', 'On-site / Remote', 'Companies and teams of 5+', 0, 'published', true, now()),
('College Campus Training Program', 'college-campus-training-program', 'College', 'Semester-aligned training for colleges: hands-on labs, faculty coordination, assessments, and placement-oriented project tracks for pre-final and final year students.', '{Python,Frontend Development,Data Analysis,Aptitude}', '2-12 weeks', 'On-campus', 'Colleges and institutions', 0, 'published', false, now()),
('Weekend AI/ML Workshop Series', 'weekend-ai-ml-workshops', 'Workshop', 'Four intensive weekend workshops covering ML fundamentals, model building with scikit-learn, and an introduction to LLM-powered applications.', '{Python,scikit-learn,ML Fundamentals,LLM Apps}', '4 weekends', 'Online', 'Open to all with basic Python knowledge', 999, 'published', false, now()),
('Placement Skill-Development Track', 'placement-skill-development-track', 'Skill Development', 'A focused track combining DSA practice, system design basics, resume building, mock interviews, and communication coaching to convert interviews into offers.', '{DSA,System Design,Communication,Interview Prep}', '6 weeks', 'Hybrid', 'Final-year students and recent graduates', 2999, 'published', true, now());

-- 9. Notification settings
INSERT INTO public.settings (key, value) VALUES
  ('notification_email', '"mastcode.notifications@gmail.com"'::jsonb),
  ('site', '{"name": "MastCode", "tagline": "Learn. Build. Get Hired."}'::jsonb)
ON CONFLICT (key) DO NOTHING;