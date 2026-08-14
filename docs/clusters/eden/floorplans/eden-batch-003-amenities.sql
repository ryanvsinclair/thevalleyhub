-- Eden Batch 003 — cluster-scoped amenity places (brochure p15 peach boundary).
-- Ray authorized go-live 2026-08-10. state = published (show on /clusters/eden).

insert into places (
  slug, name, category, subcategory, cluster_id, in_community,
  confidence, source_id, state, sort_order
)
select
  'eden-' || v.slug,
  v.name,
  v.category,
  v.subcategory,
  (select id from clusters where slug = 'eden'),
  true,
  'corroborated',
  'a1000000-0000-4000-8000-000000000001',
  'published',
  v.sort_order
from (values
  ('community-centre', 'Community Centre', 'gathering', 'community-centre', 11),
  ('central-gardens', 'Central Gardens', 'nature', 'gardens', 12),
  ('food-trucks', 'Food Trucks', 'gathering', 'food-trucks', 13),
  ('kiosks', 'Kiosks', 'gathering', 'kiosks', 14)
) as v(slug, name, category, subcategory, sort_order);
