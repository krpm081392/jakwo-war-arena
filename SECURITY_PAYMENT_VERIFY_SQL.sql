-- JAKWO security patch: paid/voucher ads must be inserted by the Supabase Edge Function only.
-- Run this AFTER deploying the Edge Function: verify-and-insert-ad

alter table ads enable row level security;
alter table voucher_codes enable row level security;

-- Stop public users from inserting fake paid ads directly with the anon key.
drop policy if exists "public insert ads" on ads;

-- Stop public users from creating/updating vouchers directly with the anon key.
-- Voucher burning is now handled by the Edge Function using the service role.
drop policy if exists "public insert vouchers" on voucher_codes;
drop policy if exists "public update vouchers" on voucher_codes;

-- Keep public read so the arena, admin counters, and voucher check can still work.
do $$ begin
  create policy "public read ads" on ads for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "public read vouchers" on voucher_codes for select using (true);
exception when duplicate_object then null; end $$;
