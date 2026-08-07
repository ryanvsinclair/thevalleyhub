-- 05_status_log.sql — Annex F: exactly 3 cluster delivered rows (eden, nara, talia). No amenity rows.

insert into status_log (subject_type, subject_id, status, observed_on, confidence, source_id)
select
  'cluster',
  c.id,
  'delivered',
  v.observed_on::date,
  v.confidence::confidence_level,
  'a1000000-0000-4000-8000-000000000001'::uuid
from clusters c
join (
  values
    ('eden',  '2023-11-01', 'corroborated'),
    ('nara',  '2024-12-01', 'corroborated'),
    ('talia', '2025-03-01', 'corroborated')
) as v(slug, observed_on, confidence)
  on c.slug = v.slug;
