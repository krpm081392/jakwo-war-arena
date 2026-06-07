-- One-time War Chat nickname per wallet.
-- Run once in Supabase SQL Editor.

alter table chat_messages
add column if not exists nickname text;

create table if not exists war_chat_names (
  wallet text primary key,
  nickname text not null unique,
  created_at timestamptz default now()
);

alter table war_chat_names enable row level security;

drop policy if exists "allow read war chat names" on war_chat_names;
create policy "allow read war chat names"
on war_chat_names
for select
using (true);

drop policy if exists "allow insert war chat names" on war_chat_names;
create policy "allow insert war chat names"
on war_chat_names
for insert
with check (true);
