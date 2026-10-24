create table if not exists post_views (
  slug text primary key,
  views integer not null default 0,
  updated_at timestamptz not null default now()
);
