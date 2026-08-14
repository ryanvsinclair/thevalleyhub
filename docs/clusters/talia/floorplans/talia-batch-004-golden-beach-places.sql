-- Talia Batch 004. Ray authorized 2026-08-13:
-- Valley-wide Golden Beach strip places from Talia cluster-map legend (G–I, K–O).
-- cluster_id null; children parented to golden-beach; notes record adjacency to Talia.
-- state = draft.

insert into places (
  slug, name, category, subcategory, cluster_id, parent_place_id,
  in_community, confidence, source_id, state, sort_order, notes
)
values (
  'golden-beach',
  'Golden Beach',
  'recreation',
  'beach',
  null,
  null,
  true,
  'corroborated',
  'a1000000-0000-4000-8000-000000000001'::uuid,
  'draft',
  1,
  'Directly next to Talia (shown on the Talia cluster map legend as the western Golden Beach / leisure strip). Valley-wide amenity; not a Talia cluster-scoped place.'
);

insert into places (
  slug, name, category, subcategory, cluster_id, parent_place_id,
  in_community, confidence, source_id, state, sort_order, notes
)
select
  v.slug,
  v.name,
  v.category,
  v.subcategory,
  null,
  (select id from places where slug = 'golden-beach'),
  true,
  'corroborated',
  'a1000000-0000-4000-8000-000000000001'::uuid,
  'draft',
  v.sort_order,
  'Directly next to Talia (shown on the Talia cluster map legend as the western Golden Beach / leisure strip). Child of Golden Beach; not a Talia cluster-scoped place.'
from (values
  ('golden-beach-wave-pool', 'Wave Pool', 'recreation', 'wave-pool', 2),
  ('golden-beach-splash-pad', 'Splash Pad', 'family', 'splash-pad', 3),
  ('golden-beach-retail-outdoor-dining-plaza', 'Retail / Outdoor Dining Plaza', 'gathering', 'retail-dining', 4),
  ('golden-beach-mini-golf', 'Mini Golf', 'recreation', 'mini-golf', 5),
  ('golden-beach-jogging-track', 'Jogging Track', 'recreation', 'jogging-track', 6),
  ('golden-beach-kids-play-area', 'Kids Play Area', 'family', 'kids-play', 7),
  ('golden-beach-multi-purpose-courts', 'Multi-Purpose Courts', 'recreation', 'multi-purpose-courts', 8)
) as v(slug, name, category, subcategory, sort_order);
