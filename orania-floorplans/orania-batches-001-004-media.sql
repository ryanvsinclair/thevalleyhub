-- MEDIA (run after Storage upload)
insert into media (storage_path, kind, alt_text, caption, credit) values
  ('orania/orania-bold-3br-a.png', 'floorplan', 'Orania Bold 3BR-A floor plan', 'Bold 3BR-A floor plan', 'Emaar Properties'),
  ('orania/orania-bold-3br-b.png', 'floorplan', 'Orania Bold 3BR-B floor plan', 'Bold 3BR-B floor plan', 'Emaar Properties'),
  ('orania/orania-bold-3br-c.png', 'floorplan', 'Orania Bold 3BR-C floor plan', 'Bold 3BR-C floor plan', 'Emaar Properties'),
  ('orania/orania-bold-3br-d.png', 'floorplan', 'Orania Bold 3BR-D floor plan', 'Bold 3BR-D floor plan', 'Emaar Properties'),
  ('orania/orania-bold-4br-a.png', 'floorplan', 'Orania Bold 4BR-A floor plan', 'Bold 4BR-A floor plan', 'Emaar Properties'),
  ('orania/orania-bold-4br-b.png', 'floorplan', 'Orania Bold 4BR-B floor plan', 'Bold 4BR-B floor plan', 'Emaar Properties'),
  ('orania/orania-bold-4br-c.png', 'floorplan', 'Orania Bold 4BR-C floor plan', 'Bold 4BR-C floor plan', 'Emaar Properties'),
  ('orania/orania-bold-4br-d.png', 'floorplan', 'Orania Bold 4BR-D floor plan', 'Bold 4BR-D floor plan', 'Emaar Properties'),
  ('orania/orania-sleek-3br-a.png', 'floorplan', 'Orania Sleek 3BR-A floor plan', 'Sleek 3BR-A floor plan', 'Emaar Properties'),
  ('orania/orania-sleek-3br-b.png', 'floorplan', 'Orania Sleek 3BR-B floor plan', 'Sleek 3BR-B floor plan', 'Emaar Properties'),
  ('orania/orania-sleek-3br-c.png', 'floorplan', 'Orania Sleek 3BR-C floor plan', 'Sleek 3BR-C floor plan', 'Emaar Properties'),
  ('orania/orania-sleek-3br-d.png', 'floorplan', 'Orania Sleek 3BR-D floor plan', 'Sleek 3BR-D floor plan', 'Emaar Properties'),
  ('orania/orania-sleek-4br-a.png', 'floorplan', 'Orania Sleek 4BR-A floor plan', 'Sleek 4BR-A floor plan', 'Emaar Properties'),
  ('orania/orania-sleek-4br-b.png', 'floorplan', 'Orania Sleek 4BR-B floor plan', 'Sleek 4BR-B floor plan', 'Emaar Properties'),
  ('orania/orania-sleek-4br-c.png', 'floorplan', 'Orania Sleek 4BR-C floor plan', 'Sleek 4BR-C floor plan', 'Emaar Properties'),
  ('orania/orania-sleek-4br-d.png', 'floorplan', 'Orania Sleek 4BR-D floor plan', 'Sleek 4BR-D floor plan', 'Emaar Properties'),
  ('orania/orania-bold-facade.jpeg', 'photo', 'Orania Bold facade', 'Bold facade', 'Emaar Properties'),
  ('orania/orania-sleek-facade.jpeg', 'photo', 'Orania Sleek facade', 'Sleek facade', 'Emaar Properties'),
  ('orania/orania-cluster-map.jpeg', 'document', 'Orania cluster map', 'Orania cluster map', 'Emaar Properties'),
  ('orania/orania-valley-context-map.png', 'document', 'Orania valley context map', 'Valley context map', 'Emaar Properties'),
  ('orania/orania-master-plan.jpeg', 'document', 'Orania master plan', 'Orania master plan', 'Emaar Properties');

insert into media_links (media_id, subject_type, subject_id, is_primary)
select m.id, 'unit_type', ut.id, true
from media m
join unit_types ut on ut.cluster_id = (select id from clusters where slug = 'orania')
join (values
  ('orania/orania-bold-3br-a.png', 3, 'bold-a'),
  ('orania/orania-bold-3br-b.png', 3, 'bold-b'),
  ('orania/orania-bold-3br-c.png', 3, 'bold-c'),
  ('orania/orania-bold-3br-d.png', 3, 'bold-d'),
  ('orania/orania-bold-4br-a.png', 4, 'bold-a'),
  ('orania/orania-bold-4br-b.png', 4, 'bold-b'),
  ('orania/orania-bold-4br-c.png', 4, 'bold-c'),
  ('orania/orania-bold-4br-d.png', 4, 'bold-d'),
  ('orania/orania-sleek-3br-a.png', 3, 'sleek-a'),
  ('orania/orania-sleek-3br-b.png', 3, 'sleek-b'),
  ('orania/orania-sleek-3br-c.png', 3, 'sleek-c'),
  ('orania/orania-sleek-3br-d.png', 3, 'sleek-d'),
  ('orania/orania-sleek-4br-a.png', 4, 'sleek-a'),
  ('orania/orania-sleek-4br-b.png', 4, 'sleek-b'),
  ('orania/orania-sleek-4br-c.png', 4, 'sleek-c'),
  ('orania/orania-sleek-4br-d.png', 4, 'sleek-d')
) as v(storage_path, bedrooms, layout) on v.storage_path = m.storage_path
where ut.bedrooms = v.bedrooms and ut.layout = v.layout;

insert into media_links (media_id, subject_type, subject_id, is_primary, sort_order)
select m.id, 'facade_style_description', f.id, true, 0
from media m
join facade_style_descriptions f on f.cluster_id = (select id from clusters where slug = 'orania')
join (values
  ('orania/orania-bold-facade.jpeg', 'Bold'),
  ('orania/orania-sleek-facade.jpeg', 'Sleek')
) as v(storage_path, style_name) on v.storage_path = m.storage_path and f.style_name = v.style_name;

insert into media_links (media_id, subject_type, subject_id, is_primary, sort_order)
select m.id, 'cluster', c.id, (m.storage_path = 'orania/orania-cluster-map.jpeg'), v.sort_order
from media m
join clusters c on c.slug = 'orania'
join (values
  ('orania/orania-cluster-map.jpeg', 10),
  ('orania/orania-valley-context-map.png', 20),
  ('orania/orania-master-plan.jpeg', 30)
) as v(storage_path, sort_order) on v.storage_path = m.storage_path;

