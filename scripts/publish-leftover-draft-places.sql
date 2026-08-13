-- Publish all leftover draft places (2026-08-13).
-- Ray authorized: publish Talia on-site, Farm Gardens on-site,
-- Golden Beach strip (valley-wide), and masabih-masjid.
-- Places trigger revalidates /, /places, /living — not /clusters/*.

update places
set state = 'published',
    updated_at = now()
where state = 'draft';
