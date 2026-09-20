CREATE TABLE public.service_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_type text NOT NULL CHECK (service_type IN ('career_counselling', 'placement_assistance', 'institution_partnership', 'website_development', 'digital_marketing', 'contact_enquiry', 'course_registration')),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  resume_path text,
  status text NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'In Progress', 'Completed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX service_submissions_type_idx ON public.service_submissions (service_type);
CREATE INDEX service_submissions_status_idx ON public.service_submissions (status);
CREATE INDEX service_submissions_email_idx ON public.service_submissions (lower(email));

GRANT INSERT ON public.service_submissions TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.service_submissions TO authenticated;
GRANT ALL ON public.service_submissions TO service_role;

ALTER TABLE public.service_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit service enquiries"
  ON public.service_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Staff manage service submissions"
  ON public.service_submissions FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER service_submissions_updated_at
  BEFORE UPDATE ON public.service_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
