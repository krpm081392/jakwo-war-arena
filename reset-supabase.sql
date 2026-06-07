-- JAKWO FULL RESET: clears arena, chat, and ALL voucher codes so counters go back to 0 / 0 / 0 / 0.
-- Run this in Supabase SQL Editor when you want to start fresh.
-- After running, refresh /admin.html and generate new vouchers again.

delete from public.ads;
delete from public.war_ads;
delete from public.chat_messages;
delete from public.voucher_codes;
delete from public.promo_codes;
delete from public.promo_claims;

-- Reset lockdown/site state if your table exists.
update public.site_settings
set value = '0'
where key in ('lockdown_end','lockdown_active');
