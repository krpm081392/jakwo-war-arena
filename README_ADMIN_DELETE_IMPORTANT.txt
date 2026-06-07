IMPORTANT ADMIN DELETE FIX

1. Deploy this zip to GitHub/Vercel.
2. Open admin from your live website, not from Downloads:
   https://your-vercel-site.vercel.app/admin.html
3. Run supabase-schema.sql once in Supabase SQL Editor.
4. Delete now verifies Supabase. It will NOT say success unless the live database is really changed or marked deleted.

Only fixes included:
- Admin delete verification / stronger Supabase delete
- Arena hides soft-deleted ads
- No random text effect added
