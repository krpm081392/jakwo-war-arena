RESET VOUCHERS BACK TO ZERO

Run reset-supabase.sql in Supabase SQL Editor.
This version deletes voucher_codes instead of only marking them unused.
After that Admin counters become:
Total Vouchers: 0
Unused: 0
Used: 0
Disabled: 0

Then generate fresh voucher codes again from admin.html.
Open the live admin URL, not the file:/// downloaded admin.
