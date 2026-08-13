-- Talia Batches 001–003 promotion. Ray authorized 2026-08-13.
-- source_id = a1000000-0000-4000-8000-000000000001 (Emaar Properties).
-- No units/plexes in this promote (site-plan colour pass still open).
-- After Storage upload of talia/*, run §5 media + media_links.

-- 1. Remove placeholder unit_types
delete from unit_types
where cluster_id = (select id from clusters where slug = 'talia')
  and layout is null;

-- 2. unit_types: 14 rows (Batch 001). unit_count null until map pass.
insert into unit_types (
  cluster_id, bedrooms, label, layout, bua_min, bua_max, unit_count,
  bathrooms, maids_room, ground_floor_bedroom, confidence, source_id, sort_order
)
select c.id, v.bedrooms, v.label, v.layout, v.bua_min, v.bua_max, null,
       v.bathrooms, v.maids_room, v.gf_bed, 'corroborated',
       'a1000000-0000-4000-8000-000000000001'::uuid, v.sort_order
from clusters c
join (values
  (3, 'A', 'cyrus-a', 2097, 2097, 3.5, true,  false, 10),
  (3, 'B', 'cyrus-b', 2100, 2100, 3.5, true,  false, 20),
  (4, 'A', 'cyrus-a', 2217, 2217, 4.0, true,  true,  30),
  (4, 'B', 'cyrus-b', 2248, 2248, 4.0, true,  true,  40),
  (3, 'A', 'elio-a',  1864, 1897, 3.5, true,  false, 50),
  (3, 'B', 'elio-b',  1862, 1921, 3.5, true,  false, 60),
  (4, 'A', 'elio-a',  2210, 2210, 4.0, true,  true,  70),
  (4, 'B', 'elio-b',  2210, 2210, 4.0, true,  true,  80),
  (3, 'A', 'pharo-a', 2090, 2090, 3.5, true,  false, 90),
  (3, 'B', 'pharo-b', 2035, 2064, 3.5, true,  false, 100),
  (3, 'C', 'pharo-c', 2036, 2040, 3.5, true,  false, 110),
  (4, 'A', 'pharo-a', 2187, 2187, 4.0, true,  true,  120),
  (4, 'D', 'pharo-d', 2189, 2189, 4.0, true,  true,  130),
  (4, 'E', 'pharo-e', 2189, 2189, 4.0, true,  true,  140)
) as v(bedrooms, label, layout, bua_min, bua_max, bathrooms, maids_room, gf_bed, sort_order) on true
where c.slug = 'talia';

-- 3. facade_style_descriptions (Batch 001)
insert into facade_style_descriptions (
  cluster_id, style_name, description, sort_order, confidence, source_id
)
select c.id, v.style_name, v.description, v.sort_order, 'corroborated',
       'a1000000-0000-4000-8000-000000000001'::uuid
from clusters c
join (values
  ('Pharo', $pharo$A contemporary blend of bold, rich tones, beautiful accents and sleek lines are complemented by sophisticated wooden fixtures and large windows, which welcome natural light in – making these stylish townhouses homes to fall in love with.$pharo$, 10),
  ('Cyrus', $cyrus$The secret is in the details – and every architectural detail of these pristine townhouses has been meticulously crafted with elegance to the fore. Minimalism and luxury coalesce and contrast beautifully with the lush green surroundings, making Cyrus homes to be truly proud of.$cyrus$, 20),
  ('Elio', $elio$Elio's timeless design is effortless yet elegant and simple yet sophisticated. Large windows allow natural light to pour in, while contemporary accents and intricate touches make this the ideal space to call home.$elio$, 30)
) as v(style_name, description, sort_order) on true
where c.slug = 'talia';

-- 4. on-site amenities (Batch 002) — draft
insert into places (
  slug, name, category, subcategory, cluster_id, in_community,
  confidence, source_id, state, sort_order
)
select
  v.slug, v.name, v.category, v.subcategory,
  (select id from clusters where slug = 'talia'),
  true, 'corroborated', 'a1000000-0000-4000-8000-000000000001'::uuid, 'draft', v.sort_order
from (values
  ('talia-gatehouse', 'Talia Gatehouse', 'gathering', 'gatehouse', 1),
  ('talia-outdoor-games-area-and-lawn', 'Outdoor Games Area and Lawn', 'recreation', 'outdoor-games', 2),
  ('talia-pocket-park', 'Pocket Park', 'nature', 'pocket-parks', 3),
  ('talia-kids-play-area-and-lawn', 'Kids Play Area and Lawn', 'family', 'kids-play', 4),
  ('talia-community-clubhouse', 'Community Clubhouse', 'gathering', 'community-centre', 5),
  ('talia-green-sikkas', 'Green Sikkas', 'nature', 'sikkas', 6),
  ('talia-picnic-lawn', 'Picnic Lawn', 'gathering', 'picnic', 7)
) as v(slug, name, category, subcategory, sort_order);

-- 5. payment / summary / body (Batch 003). positioning unchanged.
update clusters
set
  payment_plan = $pay$10% Down Payment (on booking) · 10% 1st Instalment (Mar 2022) · 5% 2nd Instalment (Sep 2022) · 10% 3rd Instalment (Mar 2023) · 10% 4th Instalment (Sep 2023) · 5% 5th Instalment (Mar 2024) · 10% 6th Instalment (Sep 2024) · 40% 7th Instalment (100% construction, estimated Mar 2025)$pay$,
  summary = $sum$The Valley's third neighbourhood of elegant townhouses – TALIA comprises stylish, family-friendly homes connected to nature and situated just footsteps away from Golden Beach.$sum$,
  body = $body$From verdant open spaces and green pocket parks, to pristine lawns and lush sikkas, TALIA is a suburban utopia for families who seek an active, healthy and fulfilling lifestyle, with everything they need within easy reach.

TALIA's three and four-bedroom townhouses come in a choice of three contemporary designs. Adjoining communal pocket parks seamlessly connect your dream home to nature and provide beautiful green spaces for your suburban lifestyle to bloom.$body$
where slug = 'talia';

-- 6. media + media_links (run after upload to storage bucket media under talia/*)
insert into media (storage_path, kind, alt_text, caption, credit) values
  ('talia/talia-cyrus-3br-a.png', 'floorplan', 'Talia Cyrus 3BR-A floor plan — ground and first floor', 'Cyrus 3BR-A floor plan', 'Emaar Properties'),
  ('talia/talia-cyrus-3br-b.png', 'floorplan', 'Talia Cyrus 3BR-B floor plan — ground and first floor', 'Cyrus 3BR-B floor plan', 'Emaar Properties'),
  ('talia/talia-cyrus-4br-a.png', 'floorplan', 'Talia Cyrus 4BR-A floor plan — ground and first floor', 'Cyrus 4BR-A floor plan', 'Emaar Properties'),
  ('talia/talia-cyrus-4br-b.png', 'floorplan', 'Talia Cyrus 4BR-B floor plan — ground and first floor', 'Cyrus 4BR-B floor plan', 'Emaar Properties'),
  ('talia/talia-elio-3br-a.png', 'floorplan', 'Talia Elio 3BR-A floor plan — ground and first floor', 'Elio 3BR-A floor plan', 'Emaar Properties'),
  ('talia/talia-elio-3br-b.png', 'floorplan', 'Talia Elio 3BR-B floor plan — ground and first floor', 'Elio 3BR-B floor plan', 'Emaar Properties'),
  ('talia/talia-elio-4br-a.png', 'floorplan', 'Talia Elio 4BR-A floor plan — ground and first floor', 'Elio 4BR-A floor plan', 'Emaar Properties'),
  ('talia/talia-elio-4br-b.png', 'floorplan', 'Talia Elio 4BR-B floor plan — ground and first floor', 'Elio 4BR-B floor plan', 'Emaar Properties'),
  ('talia/talia-pharo-3br-a.png', 'floorplan', 'Talia Pharo 3BR-A floor plan — ground and first floor', 'Pharo 3BR-A floor plan', 'Emaar Properties'),
  ('talia/talia-pharo-3br-b.png', 'floorplan', 'Talia Pharo 3BR-B floor plan — ground and first floor', 'Pharo 3BR-B floor plan', 'Emaar Properties'),
  ('talia/talia-pharo-3br-c.png', 'floorplan', 'Talia Pharo 3BR-C floor plan — ground and first floor', 'Pharo 3BR-C floor plan', 'Emaar Properties'),
  ('talia/talia-pharo-4br-a.png', 'floorplan', 'Talia Pharo 4BR-A floor plan — ground and first floor', 'Pharo 4BR-A floor plan', 'Emaar Properties'),
  ('talia/talia-pharo-4br-d.png', 'floorplan', 'Talia Pharo 4BR-D floor plan — ground and first floor', 'Pharo 4BR-D floor plan', 'Emaar Properties'),
  ('talia/talia-pharo-4br-e.png', 'floorplan', 'Talia Pharo 4BR-E floor plan — ground and first floor', 'Pharo 4BR-E floor plan', 'Emaar Properties');

insert into media_links (media_id, subject_type, subject_id, is_primary)
select m.id, 'unit_type', ut.id, true
from media m
join unit_types ut on ut.cluster_id = (select id from clusters where slug = 'talia')
join (values
  ('talia/talia-cyrus-3br-a.png', 3, 'cyrus-a'),
  ('talia/talia-cyrus-3br-b.png', 3, 'cyrus-b'),
  ('talia/talia-cyrus-4br-a.png', 4, 'cyrus-a'),
  ('talia/talia-cyrus-4br-b.png', 4, 'cyrus-b'),
  ('talia/talia-elio-3br-a.png', 3, 'elio-a'),
  ('talia/talia-elio-3br-b.png', 3, 'elio-b'),
  ('talia/talia-elio-4br-a.png', 4, 'elio-a'),
  ('talia/talia-elio-4br-b.png', 4, 'elio-b'),
  ('talia/talia-pharo-3br-a.png', 3, 'pharo-a'),
  ('talia/talia-pharo-3br-b.png', 3, 'pharo-b'),
  ('talia/talia-pharo-3br-c.png', 3, 'pharo-c'),
  ('talia/talia-pharo-4br-a.png', 4, 'pharo-a'),
  ('talia/talia-pharo-4br-d.png', 4, 'pharo-d'),
  ('talia/talia-pharo-4br-e.png', 4, 'pharo-e')
) as v(storage_path, bedrooms, layout) on v.storage_path = m.storage_path
where ut.bedrooms = v.bedrooms and ut.layout = v.layout;

insert into media (storage_path, kind, alt_text, caption, credit) values
  ('talia/talia-cluster-map.jpg', 'document', 'Talia cluster site plan', 'Talia site plan', 'Emaar Properties'),
  ('talia/talia-valley-context-map.png', 'document', 'Talia location within The Valley', 'Talia Valley context map', 'Emaar Properties');

insert into media_links (media_id, subject_type, subject_id, is_primary)
select m.id, 'cluster', c.id, m.storage_path = 'talia/talia-cluster-map.jpg'
from media m, clusters c
where m.storage_path in ('talia/talia-cluster-map.jpg', 'talia/talia-valley-context-map.png')
  and c.slug = 'talia';

insert into media (storage_path, kind, alt_text, caption, credit) values
  ('talia/talia-pharo-facade.jpg', 'photo', 'Talia Pharo facade exterior render', 'Pharo exterior', 'Emaar Properties'),
  ('talia/talia-cyrus-facade.jpg', 'photo', 'Talia Cyrus facade exterior render', 'Cyrus exterior', 'Emaar Properties'),
  ('talia/talia-elio-facade.jpg', 'photo', 'Talia Elio facade exterior render', 'Elio exterior', 'Emaar Properties');

insert into media_links (media_id, subject_type, subject_id, is_primary)
select m.id, 'facade_style_description', f.id, true
from media m
join facade_style_descriptions f on f.cluster_id = (select id from clusters where slug = 'talia')
join (values
  ('talia/talia-pharo-facade.jpg', 'Pharo'),
  ('talia/talia-cyrus-facade.jpg', 'Cyrus'),
  ('talia/talia-elio-facade.jpg', 'Elio')
) as v(storage_path, style_name) on v.storage_path = m.storage_path and v.style_name = f.style_name;
