create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  fields jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.inquiries enable row level security;

grant insert on public.inquiries to anon, authenticated;
grant select on public.inquiries to authenticated;

create policy "Anyone can submit inquiries"
  on public.inquiries for insert to anon, authenticated
  with check (true);

create policy "Super admins can read inquiries"
  on public.inquiries for select to authenticated
  using (public.has_role(auth.uid(), 'super_admin'));