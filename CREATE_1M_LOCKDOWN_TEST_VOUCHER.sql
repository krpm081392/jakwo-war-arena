-- Temporary $1,000,000 lockdown test voucher.
-- Use this ONCE to test the 1-hour WAR LOCKDOWN without real payment.
-- After testing, run DELETE_1M_LOCKDOWN_TEST_VOUCHER.sql.

insert into voucher_codes (code, tier, used, disabled)
values ('JAKWO-1000000-LOCKDOWN-TEST-001', 1000000, false, false)
on conflict (code) do update
set tier = 1000000,
    used = false,
    disabled = false,
    used_by = null,
    used_at = null;
