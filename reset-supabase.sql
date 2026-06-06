-- JAKWO CLEAN RESET SCRIPT
-- Run this in Supabase SQL Editor only when you want a fresh arena.
-- This clears ads, chat, and voucher/generated promo data.

truncate table if exists public.ads restart identity cascade;
truncate table if exists public.chat_messages restart identity cascade;
truncate table if exists public.voucher_codes restart identity cascade;
truncate table if exists public.promo_codes restart identity cascade;
truncate table if exists public.promo_claims restart identity cascade;

-- After running this, open the site with ?reset=1 once to clear browser local test cache:
-- https://your-site.vercel.app/?reset=1
