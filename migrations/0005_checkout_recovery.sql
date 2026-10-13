alter table checkout_orders add column if not exists last_reconciled_at timestamptz;
