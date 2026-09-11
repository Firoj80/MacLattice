create table if not exists licenses (
  id serial primary key,
  license_key text not null unique,
  payment_id text unique,
  customer_email text,
  customer_name text,
  chip text,
  status text not null default 'active',
  activations_limit integer not null default 1,
  created_at timestamptz not null default now()
);

create index if not exists licenses_email_idx on licenses (lower(customer_email));

create table if not exists license_devices (
  id serial primary key,
  license_key text not null,
  instance_id text not null,
  machine_name text,
  activated_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  deactivated_at timestamptz,
  unique (license_key, instance_id)
);

create index if not exists license_devices_key_idx on license_devices (license_key);
