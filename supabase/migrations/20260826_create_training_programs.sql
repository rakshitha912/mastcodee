-- Training Programs table
CREATE TABLE IF NOT EXISTS training_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  category TEXT,
  duration TEXT,
  mode TEXT NOT NULL DEFAULT 'Online',
  eligibility TEXT NOT NULL DEFAULT '',
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  skills TEXT[] NOT NULL DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Training Program Weeks/Curriculum
CREATE TABLE IF NOT EXISTS training_program_weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_program_id UUID NOT NULL REFERENCES training_programs(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  month_number INTEGER,
  title TEXT NOT NULL,
  topics TEXT,
  practical_task TEXT,
  assignment TEXT,
  mini_project TEXT,
  expected_outcome TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(training_program_id, week_number)
);

-- Internship Weeks/Roadmap
CREATE TABLE IF NOT EXISTS internship_weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internship_id UUID NOT NULL REFERENCES internships(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  month_number INTEGER,
  title TEXT NOT NULL,
  topics TEXT,
  tasks TEXT,
  project TEXT,
  learning_outcome TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(internship_id, week_number)
);

-- Team Members
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  photo_path TEXT,
  linkedin TEXT,
  github TEXT,
  display_order INTEGER DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_training_programs_status ON training_programs(status);
CREATE INDEX idx_training_programs_featured ON training_programs(featured);
CREATE INDEX idx_training_programs_slug ON training_programs(slug);
CREATE INDEX idx_training_program_weeks_program ON training_program_weeks(training_program_id);
CREATE INDEX idx_internship_weeks_internship ON internship_weeks(internship_id);
CREATE INDEX IF NOT EXISTS idx_team_members_published ON team_members(published);
CREATE INDEX idx_team_members_display_order ON team_members(display_order);

-- RLS Policies for training_programs
ALTER TABLE training_programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_can_view_published_training_programs" ON training_programs
  FOR SELECT
  USING (status = 'published' AND published_at IS NOT NULL);

CREATE POLICY "super_admin_can_manage_training_programs" ON training_programs
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- RLS Policies for training_program_weeks
ALTER TABLE training_program_weeks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_can_view_training_program_weeks" ON training_program_weeks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM training_programs
      WHERE id = training_program_weeks.training_program_id
      AND status = 'published'
    )
  );

CREATE POLICY "super_admin_can_manage_training_program_weeks" ON training_program_weeks
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- RLS Policies for internship_weeks
ALTER TABLE internship_weeks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_can_view_internship_weeks" ON internship_weeks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM internships
      WHERE id = internship_weeks.internship_id
      AND status = 'published'
    )
  );

CREATE POLICY "super_admin_can_manage_internship_weeks" ON internship_weeks
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- RLS Policies for team_members
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_can_view_published_team_members" ON team_members
  FOR SELECT
  USING (published = TRUE);

CREATE POLICY "super_admin_can_manage_team_members" ON team_members
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );
