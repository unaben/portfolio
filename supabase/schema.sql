-- Run once in the Supabase SQL editor.
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  role text,
  stack text[] not null default '{}',
  live_url text,
  repo_url text,
  screenshot text,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS on with no policies: only the server's service-role key can read/write.
alter table projects enable row level security;

-- Public bucket so screenshots load via plain URLs.
insert into storage.buckets (id, name, public)
values ('screenshots', 'screenshots', true)
on conflict (id) do nothing;
