JAKWO realtime sync fix

Changed only the cross-device update behavior:
- Supabase is now treated as the source of truth when available.
- Other devices reload ads/stats/ticker automatically when ads table changes.
- Added 3-second fallback polling so new ads still appear without manual refresh if Supabase Realtime is not enabled.
- Removed local backup duplication after Supabase confirms save.
- No UI/payment/voucher/arena-size redesign changes.

Important: In Supabase, enable Realtime for the ads table for instant updates:
Database > Replication > enable ads.
