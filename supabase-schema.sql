create table if not exists public.war_ads (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Untitled War',
  image_url text not null,
  link_url text,
  x numeric not null default 100,
  y numeric not null default 100,
  w numeric not null default 80,
  h numeric not null default 80,
  price numeric not null default 0.5,
  wallet text,
  tx_signature text,
  created_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  wallet text,
  name text default 'Warrior',
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.war_ads enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists "war ads read" on public.war_ads;
create policy "war ads read" on public.war_ads for select using (true);
drop policy if exists "war ads insert" on public.war_ads;
create policy "war ads insert" on public.war_ads for insert with check (true);

drop policy if exists "chat read" on public.chat_messages;
create policy "chat read" on public.chat_messages for select using (true);
drop policy if exists "chat insert" on public.chat_messages;
create policy "chat insert" on public.chat_messages for insert with check (true);

grant select, insert on public.war_ads to anon, authenticated;
grant select, insert on public.chat_messages to anon, authenticated;

-- Storage bucket must be public and named: jakwo
-- Add storage policies in Supabase dashboard if uploads fail.
