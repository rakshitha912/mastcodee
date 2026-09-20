-- ============ Roles ============
create type public.app_role as enum ('super_admin', 'content_manager', 'recruiter', 'trainer');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.is_staff(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id)
$$;

create policy "Users can read their own roles" on public.user_roles
  for select to authenticated using (auth.uid() = user_id);
create policy "Super admins manage roles" on public.user_roles
  for all to authenticated using (public.has_role(auth.uid(), 'super_admin'))
  with check (public.has_role(auth.uid(), 'super_admin'));

-- ============ Profiles ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  location text,
  education text,
  skills text[] default '{}',
  linkedin text,
  github text,
  portfolio text,
  resume_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "Users read own profile" on public.profiles for select to authenticated
  using (auth.uid() = id or public.is_staff(auth.uid()));
create policy "Users update own profile" on public.profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users insert own profile" on public.profiles for insert to authenticated
  with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ updated_at helper ============
create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============ Courses ============
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text not null default '',
  full_description text not null default '',
  thumbnail_path text,
  instructor text,
  category text not null default 'General',
  level text not null default 'Beginner' check (level in ('Beginner','Intermediate','Advanced','All Levels')),
  duration text not null default '',
  price numeric(10,2) not null default 0,
  discount_price numeric(10,2),
  language text not null default 'English',
  status text not null default 'draft' check (status in ('draft','published','archived')),
  featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index courses_status_idx on public.courses (status);
grant select on public.courses to anon;
grant select, insert, update, delete on public.courses to authenticated;
grant all on public.courses to service_role;
alter table public.courses enable row level security;
create policy "Public reads published courses" on public.courses for select to anon, authenticated
  using (status = 'published' or public.is_staff(auth.uid()));
create policy "Staff manage courses" on public.courses for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger courses_updated_at before update on public.courses
  for each row execute function public.update_updated_at_column();

-- ============ Internships ============
create table public.internships (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  department text not null default 'Engineering',
  description text not null default '',
  responsibilities text not null default '',
  requirements text not null default '',
  skills text[] not null default '{}',
  duration text not null default '',
  stipend text not null default '',
  location text not null default 'Bangalore',
  work_mode text not null default 'Hybrid' check (work_mode in ('Remote','On-site','Hybrid')),
  eligibility text not null default '',
  application_deadline date,
  openings integer not null default 1,
  experience_level text not null default 'Fresher',
  status text not null default 'draft' check (status in ('draft','published','closed','archived')),
  featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index internships_status_idx on public.internships (status);
grant select on public.internships to anon;
grant select, insert, update, delete on public.internships to authenticated;
grant all on public.internships to service_role;
alter table public.internships enable row level security;
create policy "Public reads published internships" on public.internships for select to anon, authenticated
  using (status = 'published' or public.is_staff(auth.uid()));
create policy "Staff manage internships" on public.internships for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger internships_updated_at before update on public.internships
  for each row execute function public.update_updated_at_column();

-- ============ Jobs ============
create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  department text not null default 'Engineering',
  location text not null default 'Bangalore',
  work_mode text not null default 'Hybrid' check (work_mode in ('Remote','On-site','Hybrid')),
  employment_type text not null default 'Full-time' check (employment_type in ('Full-time','Part-time','Internship','Contract','Freelance')),
  experience text not null default '',
  salary_range text not null default '',
  description text not null default '',
  responsibilities text not null default '',
  requirements text not null default '',
  skills text[] not null default '{}',
  benefits text not null default '',
  application_deadline date,
  openings integer not null default 1,
  status text not null default 'draft' check (status in ('draft','published','closed','archived')),
  featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index jobs_status_idx on public.jobs (status);
grant select on public.jobs to anon;
grant select, insert, update, delete on public.jobs to authenticated;
grant all on public.jobs to service_role;
alter table public.jobs enable row level security;
create policy "Public reads published jobs" on public.jobs for select to anon, authenticated
  using (status = 'published' or public.is_staff(auth.uid()));
create policy "Staff manage jobs" on public.jobs for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger jobs_updated_at before update on public.jobs
  for each row execute function public.update_updated_at_column();

-- ============ Applications ============
create table public.applications (
  id uuid primary key default gen_random_uuid(),
  position_type text not null check (position_type in ('job','internship')),
  position_id uuid,
  position_title text not null,
  full_name text not null,
  email text not null,
  phone text not null,
  location text,
  qualification text,
  skills text,
  experience text,
  linkedin text,
  github text,
  portfolio text,
  resume_path text,
  cover_letter text,
  status text not null default 'Applied' check (status in ('Applied','Under Review','Shortlisted','Interview Scheduled','Selected','Rejected','Withdrawn')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index applications_status_idx on public.applications (status);
create index applications_email_idx on public.applications (lower(email));
grant insert on public.applications to anon;
grant select, insert, update, delete on public.applications to authenticated;
grant all on public.applications to service_role;
alter table public.applications enable row level security;
create policy "Anyone can apply" on public.applications for insert to anon, authenticated
  with check (true);
create policy "Staff manage applications" on public.applications for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger applications_updated_at before update on public.applications
  for each row execute function public.update_updated_at_column();

-- Duplicate-application guard (callable without read access)
create or replace function public.recent_application_exists(_email text, _position_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.applications
    where lower(email) = lower(_email) and position_id = _position_id
      and created_at > now() - interval '7 days'
  )
$$;
grant execute on function public.recent_application_exists(text, uuid) to anon, authenticated;

create table public.application_status_history (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  status text not null,
  note text,
  changed_by uuid,
  created_at timestamptz not null default now()
);
grant select, insert on public.application_status_history to authenticated;
grant all on public.application_status_history to service_role;
alter table public.application_status_history enable row level security;
create policy "Staff manage status history" on public.application_status_history for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- ============ Team ============
create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text not null default '',
  photo_path text,
  linkedin text,
  github text,
  display_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.team_members to anon;
grant select, insert, update, delete on public.team_members to authenticated;
grant all on public.team_members to service_role;
alter table public.team_members enable row level security;
create policy "Public reads published team" on public.team_members for select to anon, authenticated
  using (published = true or public.is_staff(auth.uid()));
create policy "Staff manage team" on public.team_members for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger team_members_updated_at before update on public.team_members
  for each row execute function public.update_updated_at_column();

-- ============ Testimonials ============
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  course text not null default '',
  quote text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  photo_path text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.testimonials to anon;
grant select, insert, update, delete on public.testimonials to authenticated;
grant all on public.testimonials to service_role;
alter table public.testimonials enable row level security;
create policy "Public reads published testimonials" on public.testimonials for select to anon, authenticated
  using (published = true or public.is_staff(auth.uid()));
create policy "Staff manage testimonials" on public.testimonials for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger testimonials_updated_at before update on public.testimonials
  for each row execute function public.update_updated_at_column();

-- ============ Announcements ============
create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  image_path text,
  category text not null default 'General',
  publish_date date not null default current_date,
  expiry_date date,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  featured boolean not null default false,
  show_banner boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.announcements to anon;
grant select, insert, update, delete on public.announcements to authenticated;
grant all on public.announcements to service_role;
alter table public.announcements enable row level security;
create policy "Public reads live announcements" on public.announcements for select to anon, authenticated
  using ((status = 'published' and publish_date <= current_date and (expiry_date is null or expiry_date >= current_date))
    or public.is_staff(auth.uid()));
create policy "Staff manage announcements" on public.announcements for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger announcements_updated_at before update on public.announcements
  for each row execute function public.update_updated_at_column();

-- ============ Contact messages ============
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null default '',
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
grant insert on public.messages to anon;
grant select, insert, update, delete on public.messages to authenticated;
grant all on public.messages to service_role;
alter table public.messages enable row level security;
create policy "Anyone can send a message" on public.messages for insert to anon, authenticated
  with check (true);
create policy "Staff manage messages" on public.messages for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- ============ Settings ============
create table public.settings (
  key text primary key,
  value jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
grant select on public.settings to anon;
grant select, insert, update, delete on public.settings to authenticated;
grant all on public.settings to service_role;
alter table public.settings enable row level security;
create policy "Public reads settings" on public.settings for select to anon, authenticated using (true);
create policy "Staff manage settings" on public.settings for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- ============ Storage policies ============
create policy "Public reads media files" on storage.objects for select to anon, authenticated
  using (bucket_id = 'media');
create policy "Staff manage media files" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_staff(auth.uid()));
create policy "Staff update media files" on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_staff(auth.uid()));
create policy "Staff delete media files" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_staff(auth.uid()));

create policy "Anyone can upload a resume" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'resumes' and (lower(name) ~* '\.(pdf|doc|docx)$'));
create policy "Staff read resumes" on storage.objects for select to authenticated
  using (bucket_id = 'resumes' and public.is_staff(auth.uid()));
create policy "Staff delete resumes" on storage.objects for delete to authenticated
  using (bucket_id = 'resumes' and public.is_staff(auth.uid()));

-- ============ Seed data ============
insert into public.courses (title, slug, short_description, full_description, category, level, duration, price, discount_price, status, featured, published_at) values
('Python Programming', 'python-programming', 'Master Python from fundamentals to advanced concepts with hands-on coding exercises.', 'Learn Python programming from scratch: syntax, data structures, OOP, file handling, and popular libraries. Build real scripts and mini-projects in every module.', 'Programming', 'Beginner', '8 weeks', 15000, 15000, 'published', true, now()),
('SQL & Database Management', 'sql-database-management', 'Design, query and manage relational databases used in real applications.', 'Covers SQL queries, joins, indexing, normalization, transactions and PostgreSQL administration with practical datasets.', 'Data', 'Beginner', '6 weeks', 8000, 8000, 'published', false, now()),
('Full Stack Development', 'full-stack-development', 'Build complete web applications with React, Node.js and modern databases.', 'End-to-end web development: HTML/CSS, JavaScript, React, Node.js APIs, authentication, databases and deployment.', 'Development', 'Intermediate', '16 weeks', 10000, 10000, 'published', true, now()),
('Artificial Intelligence', 'artificial-intelligence', 'Understand AI fundamentals, search, reasoning and intelligent agents.', 'Foundations of AI: problem solving, knowledge representation, planning, and an introduction to neural networks with Python labs.', 'AI/ML', 'Intermediate', '10 weeks', 9999, 6999, 'published', false, now()),
('Machine Learning', 'machine-learning', 'Train, evaluate and deploy machine learning models on real datasets.', 'Supervised and unsupervised learning, feature engineering, model evaluation, scikit-learn and an end-to-end capstone project.', 'AI/ML', 'Intermediate', '12 weeks', 11999, 7999, 'published', true, now()),
('Data Analytics', 'data-analytics', 'Turn raw data into decisions with SQL, Python and dashboards.', 'Data cleaning, exploratory analysis, visualization, statistics and dashboarding with real business datasets.', 'Data', 'Beginner', '8 weeks', 16000, 16000, 'published', false, now()),
('Web Development', 'web-development', 'Create responsive, modern websites with HTML, CSS and JavaScript.', 'Semantic HTML, modern CSS, responsive layouts, JavaScript fundamentals and deploying your first sites.', 'Development', 'Beginner', '8 weeks', 10000, 10000, 'published', false, now()),
('Cloud Computing', 'cloud-computing', 'Deploy and scale applications on modern cloud platforms.', 'Cloud fundamentals, compute, storage, networking, CI/CD and deploying production workloads.', 'Infrastructure', 'Intermediate', '8 weeks', 8999, 5999, 'published', false, now()),
('Git & GitHub', 'git-github', 'Version control and collaboration workflows every developer needs.', 'Git fundamentals, branching, pull requests, code review and team collaboration on GitHub.', 'Tools', 'Beginner', '2 weeks', 1000, 1000, 'published', false, now());

insert into public.internships (title, slug, department, description, responsibilities, requirements, skills, duration, stipend, location, work_mode, eligibility, openings, experience_level, status, featured, published_at) values
('AI/ML Intern', 'ai-ml-intern', 'AI/ML', 'Work on real machine learning projects — data preparation, model training and evaluation — guided by mentors. This is an unpaid internship with the opportunity to be considered for a full-time role based on performance.', 'Build and evaluate ML models; prepare datasets; document experiments; present results to the team; receive a joining certificate and an internship completion certificate.', 'Python basics, statistics fundamentals, eagerness to learn. Familiarity with scikit-learn is a plus. This is an unpaid opportunity; high-performing interns may be considered for a full-time position.', array['Python','Machine Learning','scikit-learn','Pandas'], '6 months', 'Unpaid', 'Bangalore', 'Hybrid', 'Students or recent graduates in CS/related fields', 4, 'Fresher', 'published', true, now()),
('Full Stack Developer Intern', 'full-stack-developer-intern', 'Engineering', 'Ship features across the MastCode platform using React, TypeScript and Postgres.', 'Implement UI features, build API endpoints, write tests, participate in code reviews.', 'JavaScript/TypeScript basics, React fundamentals, Git workflow.', array['React','TypeScript','Node.js','PostgreSQL'], '6 months', 'Unpaid', 'Bangalore', 'Hybrid', 'Final-year students or recent graduates', 3, 'Fresher', 'published', true, now()),
('Web Developer Intern', 'web-developer-intern', 'Engineering', 'Build responsive marketing pages and learning-platform interfaces.', 'Convert designs to responsive pages, optimize performance, fix UI bugs.', 'HTML, CSS, basic JavaScript. Portfolio of any kind is a plus.', array['HTML','CSS','JavaScript','Tailwind'], '90 days', 'Unpaid', 'Remote', 'Remote', 'Open to all students', 5, 'Fresher', 'published', false, now()),
('Digital Marketing Intern', 'digital-marketing-intern', 'Marketing', 'Grow MastCode''s reach across LinkedIn, Instagram and YouTube.', 'Plan content calendars, write posts, analyze campaign metrics, support SEO.', 'Strong written communication, interest in tech education, basic analytics.', array['Content Writing','SEO','Social Media','Analytics'], '90 days', 'Unpaid', 'Remote', 'Remote', 'Open to all students', 2, 'Fresher', 'published', false, now()),
('Data Analyst Intern', 'data-analyst-intern', 'Data', 'Analyze learner and product data to guide decisions.', 'Build dashboards, write SQL queries, prepare weekly insight reports.', 'SQL basics, spreadsheet skills, curiosity about data.', array['SQL','Excel','Python','Dashboards'], '4 months', 'Unpaid', 'Bangalore', 'Hybrid', 'Students or recent graduates', 2, 'Fresher', 'published', false, now());

insert into public.jobs (title, slug, department, location, work_mode, employment_type, experience, salary_range, description, responsibilities, requirements, skills, benefits, openings, status, featured, published_at) values
('AI Developer', 'ai-developer', 'AI/ML', 'Bangalore', 'Hybrid', 'Full-time', '1-3 years', '₹6-10 LPA', 'Design and ship AI-powered features across the MastCode learning platform.', 'Build ML pipelines, integrate LLM features, evaluate model quality, mentor interns.', 'Strong Python, ML fundamentals, experience with modern AI tooling.', array['Python','Machine Learning','LLMs','FastAPI'], 'Flexible hours, learning budget, mentorship culture', 1, 'published', true, now()),
('Full Stack Developer', 'full-stack-developer', 'Engineering', 'Bangalore', 'Hybrid', 'Full-time', '1-4 years', '₹5-9 LPA', 'Own features end-to-end across our education platform.', 'Design APIs, build React interfaces, manage database schema, review code.', 'TypeScript, React, Node.js, Postgres. Startup mindset.', array['TypeScript','React','Node.js','PostgreSQL'], 'Flexible hours, equity options, learning budget', 2, 'published', true, now()),
('Software Developer', 'software-developer', 'Engineering', 'Remote', 'Remote', 'Full-time', '0-2 years', '₹4-7 LPA', 'Build tools and services that power the MastCode learning experience.', 'Implement product features, write tests, fix bugs, improve performance.', 'Solid programming fundamentals in any modern language; willingness to learn TypeScript.', array['TypeScript','Git','SQL','Problem Solving'], 'Remote-first, learning budget', 2, 'published', false, now()),
('Technical Trainer', 'technical-trainer', 'Training', 'Bangalore', 'On-site', 'Full-time', '2+ years', '₹5-8 LPA', 'Teach and mentor the next generation of developers at MastCode.', 'Deliver courses, create curriculum, mentor learners, review projects.', 'Deep knowledge in at least one of: Python, web development, data/ML. Excellent communication.', array['Teaching','Python','Web Development','Communication'], 'Teaching-focused role, curriculum ownership', 1, 'published', false, now());

insert into public.team_members (name, role, bio, display_order, published) values
('Rakshitha S.', 'Founder & Technology Lead', 'Building practical technology education and career opportunities through MastCode.', 1, true);

insert into public.testimonials (name, course, quote, rating, published) values
('Ananya R.', 'Full Stack Development', 'The project-based approach at MastCode helped me build a portfolio that actually got me interviews. The mentorship made all the difference.', 5, true),
('Karthik M.', 'Python Programming', 'I went from zero coding knowledge to writing automation scripts for my college projects in eight weeks. Clear, practical teaching.', 5, true),
('Divya P.', 'Data Analytics', 'The SQL and dashboarding modules mirror exactly what I now use at work. Best practical analytics course I have taken.', 4, true);

insert into public.announcements (title, description, category, status, featured, show_banner) values
('New AI/ML Internship Applications Open!', 'Applications are now open for the 2026 AI/ML Internship cohort. Work on real machine learning projects with mentorship from industry practitioners. Limited seats — apply early.', 'Internships', 'published', true, true);

insert into public.settings (key, value) values
('site', '{"company_name": "MastCode", "tagline": "Learn. Build. Get Hired.", "email": "hello@mastcode.in", "phone": "+91 90000 00000", "address": "Bangalore, Karnataka, India", "linkedin": "https://www.linkedin.com/company/mastcode", "instagram": "https://www.instagram.com/mastcode", "youtube": "https://www.youtube.com/@mastcode", "github": "https://github.com/mastcode", "seo_title": "MastCode | Learn. Build. Get Hired.", "seo_description": "MastCode is a technology education and career platform helping learners build practical skills, real-world projects, and successful technology careers.", "footer_text": "© 2026 MastCode. All Rights Reserved."}'),
('stats', '{"learners": 500, "projects": 25, "courses": 10, "opportunities": 50}');