-- Courses and curriculum are public to view only after publication; writes are
-- reserved for super_admin accounts.
DROP POLICY IF EXISTS "Staff manage courses" ON public.courses;
DROP POLICY IF EXISTS "Public reads published courses" ON public.courses;

CREATE POLICY "Public reads published courses" ON public.courses
  FOR SELECT TO anon, authenticated
  USING (status = 'published' OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins manage courses" ON public.courses
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

DROP POLICY IF EXISTS "Staff manage media files" ON storage.objects;
DROP POLICY IF EXISTS "Staff update media files" ON storage.objects;
DROP POLICY IF EXISTS "Staff delete media files" ON storage.objects;

CREATE POLICY "Super admins upload media files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins update media files" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins delete media files" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'super_admin'));
