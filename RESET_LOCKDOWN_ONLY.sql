-- Clears lockdown state in Supabase if site_settings exists.
-- Browser local lockdown will also clear automatically after the updated site sees no $1M ad.
update public.site_settings
set value = '0'
where key in ('lockdown_end','lockdown_active','lockdown_until');
