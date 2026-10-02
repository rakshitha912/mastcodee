alter table public.internships
  add column if not exists thumbnail_path text;
alter table public.courses
  add column if not exists skills text[] not null default '{}';
alter table public.internships
  add column if not exists application_fee numeric(10,2) not null default 2000;