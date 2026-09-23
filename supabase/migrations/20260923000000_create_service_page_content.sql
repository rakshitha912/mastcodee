CREATE TABLE public.service_page_content (
  page_type text PRIMARY KEY CHECK (page_type IN ('career_counselling', 'placement_assistance', 'institution_partnership', 'website_development', 'digital_marketing')),
  eyebrow text NOT NULL,
  title text NOT NULL,
  price text,
  paragraphs jsonb NOT NULL DEFAULT '[]'::jsonb,
  fields jsonb NOT NULL DEFAULT '[]'::jsonb,
  submit_label text NOT NULL,
  success_message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX service_page_content_updated_idx ON public.service_page_content (updated_at);

GRANT SELECT ON public.service_page_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.service_page_content TO authenticated;
GRANT ALL ON public.service_page_content TO service_role;

ALTER TABLE public.service_page_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read service page content"
  ON public.service_page_content FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Staff manage service page content"
  ON public.service_page_content FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER service_page_content_updated_at
  BEFORE UPDATE ON public.service_page_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
