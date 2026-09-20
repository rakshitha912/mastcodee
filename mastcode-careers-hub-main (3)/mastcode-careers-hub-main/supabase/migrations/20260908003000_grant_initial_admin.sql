insert into public.user_roles (user_id, role)
select id, 'super_admin'::public.app_role
from auth.users
where lower(email) = 'rakshithamastcode@gmail.com'
on conflict (user_id, role) do nothing;
