JAKWO PAYMENT SECURITY PATCH

What changed:
- Browser no longer inserts paid/voucher ads directly into Supabase.
- Browser calls Supabase Edge Function: verify-and-insert-ad
- Edge Function verifies:
  1. real USDC transaction signature for paid ads
  2. receiver wallet gained the correct USDC amount
  3. transaction signature was not used before
  4. voucher exists, is not disabled, and was not used before
- Only after verification does the function insert the ad.

Deploy steps:
1. In Supabase, deploy the Edge Function folder:
   supabase/functions/verify-and-insert-ad

   If using Supabase CLI:
   supabase functions deploy verify-and-insert-ad

2. In Supabase SQL Editor, run:
   SECURITY_PAYMENT_VERIFY_SQL.sql

3. Redeploy this ZIP to Vercel.

Important:
- Do not run SECURITY_PAYMENT_VERIFY_SQL.sql before deploying the Edge Function, or new paid/voucher ads will fail to save.
- This patch does not change placement, zoom, lockdown visuals, admin UI, or War Chat UI.
