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
  locked boolean default true,
  voucher_code text,
  created_at timestamptz default now()
);
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
