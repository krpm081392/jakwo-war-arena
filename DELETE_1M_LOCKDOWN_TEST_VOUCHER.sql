-- Delete the temporary $1,000,000 lockdown test voucher after testing.
-- This removes the test voucher so nobody can use it later.

delete from voucher_codes
where code = 'JAKWO-1000000-LOCKDOWN-TEST-001';
