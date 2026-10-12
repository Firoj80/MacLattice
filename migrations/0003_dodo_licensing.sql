alter table licenses add column if not exists provider_id text unique;
alter table licenses add column if not exists product_id text;
alter table licenses add column if not exists provider_mode text;
alter table license_devices add column if not exists provider_instance_id text;
create table if not exists checkout_orders (id text primary key,access_hash text not null,session_id text,payment_id text unique,created_at timestamptz not null default now());
create table if not exists verified_payments (payment_id text primary key,product_id text,status text not null,provider_mode text not null);
create table if not exists dodo_webhook_events (event_id text primary key,processed_at timestamptz not null default now());
