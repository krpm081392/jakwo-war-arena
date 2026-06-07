UPDATE NOTES
- Removed the wrong RANDOM WAR EFFECT text banner.
- Normal attacks now use visual-only effects on photos/arena: shake, crack, fall, dust, flash. No random words.
- $1M lockdown still shows the required warning, huge countdown, red flashing, and blocks new ads until timer ends.
- Admin delete now tries hard delete first, then soft delete backup if Supabase RLS blocks it.

IMPORTANT FOR ADMIN DELETE:
Run supabase-schema.sql once in Supabase SQL Editor after uploading this zip. This adds the delete/update policies and deleted flags so spam/wallet-drainer ads can be removed from arena.
