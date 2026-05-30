-- JAKWO War Ads Arena schema
-- Paste this in Supabase SQL Editor and Run.

create table if not exists public.war_ads (
  id uuid primary key default gen_random_uuid(),
  ad_name text default 'Untitled War',
  name text default 'Untitled War',
  image_url text not null,
  link text,
  link_url text,
  x numeric not null default 100,
  y numeric not null default 100,
  width numeric not null default 80,
  height numeric not null default 80,
  w numeric not null default 80,
  h numeric not null default 80,
  price numeric not null default 0.5,
  wallet text,
  tx_signature text,
  payment_type text default 'paid',
  promo_code text,
  created_at timestamptz not null default now()
);

alter table public.war_ads add column if not exists ad_name text default 'Untitled War';
alter table public.war_ads add column if not exists name text default 'Untitled War';
alter table public.war_ads add column if not exists link text;
alter table public.war_ads add column if not exists link_url text;
alter table public.war_ads add column if not exists width numeric default 80;
alter table public.war_ads add column if not exists height numeric default 80;
alter table public.war_ads add column if not exists w numeric default 80;
alter table public.war_ads add column if not exists h numeric default 80;
alter table public.war_ads add column if not exists payment_type text default 'paid';
alter table public.war_ads add column if not exists promo_code text;

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  wallet text,
  name text default 'Warrior',
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  tier text not null,
  value numeric not null,
  max_value numeric not null,
  used boolean not null default false,
  disabled boolean not null default false,
  used_by text,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.promo_claims (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  wallet text not null,
  used_at timestamptz not null default now(),
  unique(wallet),
  unique(code)
);

alter table public.war_ads enable row level security;
alter table public.chat_messages enable row level security;
alter table public.promo_codes enable row level security;
alter table public.promo_claims enable row level security;

drop policy if exists "war ads read" on public.war_ads;
create policy "war ads read" on public.war_ads for select using (true);
drop policy if exists "war ads insert" on public.war_ads;
create policy "war ads insert" on public.war_ads for insert with check (true);

drop policy if exists "chat read" on public.chat_messages;
create policy "chat read" on public.chat_messages for select using (true);
drop policy if exists "chat insert" on public.chat_messages;
create policy "chat insert" on public.chat_messages for insert with check (true);

drop policy if exists "promo read" on public.promo_codes;
create policy "promo read" on public.promo_codes for select using (true);
drop policy if exists "promo insert" on public.promo_codes;
create policy "promo insert" on public.promo_codes for insert with check (true);
drop policy if exists "promo update" on public.promo_codes;
create policy "promo update" on public.promo_codes for update using (true) with check (true);

drop policy if exists "claims read" on public.promo_claims;
create policy "claims read" on public.promo_claims for select using (true);
drop policy if exists "claims insert" on public.promo_claims;
create policy "claims insert" on public.promo_claims for insert with check (true);

grant select, insert, update on public.war_ads to anon, authenticated;
grant select, insert on public.chat_messages to anon, authenticated;
grant select, insert, update on public.promo_codes to anon, authenticated;
grant select, insert on public.promo_claims to anon, authenticated;
