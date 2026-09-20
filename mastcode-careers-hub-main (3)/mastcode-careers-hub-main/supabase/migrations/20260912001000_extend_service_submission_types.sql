ALTER TABLE public.service_submissions
  DROP CONSTRAINT IF EXISTS service_submissions_service_type_check;

ALTER TABLE public.service_submissions
  ADD CONSTRAINT service_submissions_service_type_check
  CHECK (service_type IN ('career_counselling', 'placement_assistance', 'institution_partnership', 'website_development', 'digital_marketing', 'contact_enquiry', 'course_registration'));
