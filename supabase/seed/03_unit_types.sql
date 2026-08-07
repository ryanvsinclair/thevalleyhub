-- 03_unit_types.sql — Annex D only. private_pool null everywhere.
-- No rows for: nima, farm-gardens-2, farm-grove-2, elea, kaia, avena-2, venera, avelia, ovelle

insert into unit_types (
  cluster_id, bedrooms, bua_min, bua_max, plot_min, plot_max, layout,
  maids_room, ground_floor_bedroom, private_pool, notes, confidence, source_id, sort_order
)
select c.id, v.bedrooms, v.bua_min, v.bua_max, v.plot_min, v.plot_max, v.layout,
       v.maids_room, v.ground_floor_bedroom, null, v.notes, v.confidence::confidence_level,
       'a1000000-0000-4000-8000-000000000001'::uuid, v.sort_order
from clusters c
join (values
  ('eden', 3, 1929, 2057, null::int, null::int, null::text, null::boolean, null::boolean, null::text, 'corroborated', 10),
  ('eden', 4, 2311, 2336, null, null, null, null, null, null, 'corroborated', 20),
  ('nara', 3, 1866, null, null, null, null, null, null, null, 'corroborated', 10),
  ('nara', 4, null, 2249, null, null, null, null, null, null, 'corroborated', 20),
  ('talia', 3, 1862, null, null, null, null, null, null, null, 'corroborated', 10),
  ('talia', 4, null, 2248, null, null, null, null, null, null, 'corroborated', 20),
  ('orania', 3, 1898, null, null, null, null, null, null, null, 'corroborated', 10),
  ('orania', 4, null, 2345, null, null, null, null, null, null, 'corroborated', 20),
  ('elora', 3, 2095, 2179, null, null, null, null, null, null, 'corroborated', 10),
  ('elora', 4, 2586, 2608, null, null, null, null, null, null, 'corroborated', 20),
  ('lillia', 3, 2344, null, null, null, 'G+1', true, null, 'Middle units. Maid''s room ground floor', 'unverified', 10),
  ('lillia', 4, null, null, null, null, 'G+1', true, true, 'Corner units. Ground-floor bedroom + maid''s room. L-shaped garden', 'unverified', 20),
  ('elva', 3, 2241, 2416, 1938, 1961, null, null, null, 'Saleable area', 'unverified', 10),
  ('elva', 4, 2706, 2711, 2968, 3376, null, null, null, 'BUA', 'unverified', 20),
  ('rivana', 3, 3152, null, null, null, null, null, null, null, 'unverified', 10),
  ('rivana', 5, null, 5192, null, null, null, null, null, null, 'unverified', 20),
  ('alana', 3, 3788, null, 3456, null, 'G+2', null, null, null, 'unverified', 10),
  ('alana', 4, 4157, null, 4147, null, 'G+2', null, null, null, 'unverified', 20),
  ('alana', 5, 4859, null, 5096, null, 'G+2', null, null, null, 'unverified', 30),
  ('farm-gardens', 4, 4950, null, null, null, null, null, null, null, 'corroborated', 10),
  ('farm-gardens', 5, null, 10004, null, null, null, null, null, null, 'corroborated', 20),
  ('farm-grove', 4, 3741, null, null, null, null, null, null, null, 'corroborated', 10),
  ('farm-grove', 5, null, 6078, null, null, null, null, null, null, 'corroborated', 20),
  ('avena', 4, 3685, 3685, null, null, null, null, null, null, 'corroborated', 10),
  ('rivera', 4, 3688, 3714, null, null, null, null, null, null, 'unverified', 10),
  ('velora', 3, 2456, null, null, null, null, null, null, null, 'unverified', 10),
  ('velora', 4, null, 2731, null, null, null, null, null, null, 'unverified', 20),
  ('velora-2', 3, 2457, null, null, null, null, null, null, null, 'unverified', 10),
  ('vindera', 3, 2396, null, null, null, null, null, null, null, 'unverified', 10)
) as v(slug, bedrooms, bua_min, bua_max, plot_min, plot_max, layout, maids_room, ground_floor_bedroom, notes, confidence, sort_order)
  on c.slug = v.slug;
