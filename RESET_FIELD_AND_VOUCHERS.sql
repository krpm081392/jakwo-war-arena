-- JAKWO fresh reset: clears battlefield ads, chat messages, and all voucher codes.
-- Run in Supabase SQL Editor when you want a clean test arena.
truncate table if exists public.ads restart identity cascade;
truncate table if exists public.chat_messages restart identity cascade;
truncate table if exists public.voucher_codes restart identity cascade;
truncate table if exists public.promo_codes restart identity cascade;
truncate table if exists public.promo_claims restart identity cascade;
