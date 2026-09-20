-- MastCode founder/admin access
-- Run this in Supabase Dashboard -> SQL Editor after creating the Gmail user
-- in Authentication -> Users.

insert into public.user_roles (user_id, role)
select id, 'super_admin'::public.app_role
from auth.users
where lower(email) = 'rakshithamastcode@gmail.com'
on conflict (user_id, role) do nothing;

-- Verify the role was added:
select u.email, r.role
from auth.users as u
join public.user_roles as r on r.user_id = u.id
where lower(u.email) = 'rakshithamastcode@gmail.com';
