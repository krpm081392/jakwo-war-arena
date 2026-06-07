create table if not exists ads (
  id uuid primary key default gen_random_uuid(),
  image_url text,
  link text,
  wallet text,
  amount numeric default 0,
  x numeric default 10,
  y numeric default 10,
  w numeric default 120,
  h numeric default 120,
  name text,
  locked boolean default true,
  voucher_code text,
  tx_signature text,
  created_at timestamptz default now()
);

alter table ads add column if not exists name text;
alter table ads add column if not exists tx_signature text;

create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  wallet text,
  message text,
  created_at timestamptz default now()
);

create table if not exists voucher_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  tier numeric not null,
  used boolean default false,
  disabled boolean default false,
  used_by text,
  created_at timestamptz default now(),
  used_at timestamptz
);

alter table ads enable row level security;
alter table chat_messages enable row level security;
alter table voucher_codes enable row level security;

do $$ begin
  create policy "public read ads" on ads for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public insert ads" on ads for insert with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public read chat" on chat_messages for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public insert chat" on chat_messages for insert with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public read vouchers" on voucher_codes for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public insert vouchers" on voucher_codes for insert with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public update vouchers" on voucher_codes for update using (true) with check (true);
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table chat_messages;
exception when duplicate_object then null; when undefined_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table ads;
exception when duplicate_object then null; when undefined_object then null; end $$;

-- Position persistence patch: store ad placement as arena percentages so ads return to the same spot after refresh/device changes.
alter table ads add column if not exists x_percent numeric;
alter table ads add column if not exists y_percent numeric;
alter table ads add column if not exists w_percent numeric;
alter table ads add column if not exists h_percent numeric;


-- Admin moderation patch: allow hidden admin panel to remove unsafe ads and log the action.
create table if not exists admin_actions (
  id uuid primary key default gen_random_uuid(),
  action text,
  ad_id uuid,
  wallet text,
  reason text,
  ad_name text,
  link text,
  created_at timestamptz default now()
);

alter table admin_actions enable row level security;

do $$ begin
  create policy "public insert admin actions" on admin_actions for insert with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public read admin actions" on admin_actions for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "admin delete ads" on ads for delete using (true);
exception when duplicate_object then null; end $$;
