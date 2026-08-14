-- Nara Batch 006. Ray authorized 2026-08-13: publish the 8 Batch 003 amenities.
-- Places trigger revalidates /, /places, /living — not /clusters/nara.
-- After applying, POST /api/revalidate for /clusters/nara.

update places
set state = 'published'
where cluster_id = (select id from clusters where slug = 'nara')
  and slug in (
    'nara-community-centre',
    'nara-green-sikkas',
    'nara-community-gardens',
    'nara-outdoor-fitness',
    'nara-pocket-parks',
    'nara-picnic-area',
    'nara-lawn-area',
    'nara-mosque'
  )
  and state = 'draft';
