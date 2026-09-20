# Supabase SQL

The migration files in `supabase/migrations` are the complete database history for this project. Supabase applies them in timestamp order.

Use `admin-access.sql` when the founder Gmail account has been created in Supabase Authentication. It grants `super_admin` access to `rakshithamastcode@gmail.com` and includes a verification query.

Important tables:

- `auth.users`: Gmail accounts and securely hashed passwords, managed by Supabase Auth.
- `public.profiles`: name, phone number, and designation.
- `public.user_roles`: admin permissions such as `super_admin`.
- `public.courses`: courses and prices.
- `public.internships`: internship listings.
- `public.applications`: internship applications and resume paths.

Run SQL files from the Supabase Dashboard SQL Editor. Do not store passwords in SQL files.
