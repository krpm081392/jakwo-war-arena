-- Run this once in Supabase SQL Editor if paid ads do not appear on other devices.
alter table ads add column if not exists display_amount numeric default 0;
alter table ads add column if not exists x_percent numeric;
alter table ads add column if not exists y_percent numeric;
alter table ads add column if not exists w_percent numeric;
alter table ads add column if not exists h_percent numeric;
alter table ads add column if not exists voucher_code text;
alter table ads add column if not exists tx_signature text;
alter table ads add column if not exists is_deleted boolean default false;
alter table ads add column if not exists deleted boolean default false;
alter table ads add column if not exists deleted_at timestamptz;

alter table ads enable row level security;
drop policy if exists "public read ads" on ads;
create policy "public read ads" on ads for select using (true);
drop policy if exists "public insert ads" on ads;
create policy "public insert ads" on ads for insert with check (true);
drop policy if exists "public update violating ads" on ads;
create policy "public update violating ads" on ads for update using (true) with check (true);
drop policy if exists "public delete violating ads" on ads;
create policy "public delete violating ads" on ads for delete using (true);
