-- JAKWO fresh launch reset
-- This removes all deployed ads/chat and deletes voucher codes so admin supply goes back to 0 generated.
-- After running this, open admin.html and generate fresh vouchers again.

delete from ads;
delete from war_ads;
delete from chat_messages;
delete from voucher_codes;
