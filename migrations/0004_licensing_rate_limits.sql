create table if not exists licensing_rate_limits (bucket text primary key,window_start timestamptz not null default now(),attempts integer not null default 1);
