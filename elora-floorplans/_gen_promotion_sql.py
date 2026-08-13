#!/usr/bin/env python3
import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parent
units = list(csv.DictReader(open(ROOT / "elora-units.csv")))
plexes = []
seen = set()
for u in units:
    pr = u["plex_range"]
    if pr in seen:
        continue
    seen.add(pr)
    rs, re = pr.split("-")
    plexes.append((int(rs), int(re), int(u["plex_size"]), u["street_side"]))
plexes.sort()

pay = (
    "10% Down Payment (Jan 2023) · 10% 1st Instalment (Mar 2023) · "
    "10% 2nd Instalment (Sep 2023) · 10% 3rd Instalment (upon 20% construction, Mar 2024) · "
    "10% 4th Instalment (upon 40% construction, Sep 2024) · 10% 5th Instalment (Mar 2025) · "
    "10% 6th Instalment (upon 60% construction, Aug 2025) · "
    "10% 7th Instalment (upon 80% construction, Jan 2026) · "
    "20% 8th Instalment (upon 100% construction, estimated Sep 2026)"
)
summary = (
    "Elora consists of 3 and 4-bedroom townhouses ideally located in a tranquil "
    "family haven far from the commotion of the city yet conveniently close to all "
    "that Dubai has to offer."
)
body = (
    "A community where you can take in the beauty of each day, Elora is a paradise "
    "where residents can seek comfort by engaging with nature in the beautifully "
    "designed lush surroundings. Here, you will enjoy sustainable buildings, fully "
    "harmonised with the natural environment and surrounded by the stunning beauty "
    "of the green earth. It's the perfect setting to cultivate a tranquil mind and "
    "an active body, providing you with the highest quality of life.\n\n"
    "Elora offers you the choice of three and four-bedroom townhouses in two distinct "
    "architectural styles: Moon and Mysk. Every townhouse is characterised by exquisite "
    "quality, and each makes a personal statement. Premium materials and attention to "
    "detail throughout ensure tasteful and timeless elegance."
)

amenities = [
    ("elora-gatehouse", "Elora Gatehouse", "gathering", "gatehouse", 1),
    ("elora-lawn", "Lawn", "gathering", "lawn", 2),
    ("elora-kids-playground", "Kids Playground", "family", "kids-play", 3),
    ("elora-community-clubhouse", "Community Clubhouse", "gathering", "community-centre", 4),
    ("elora-nature-trail", "Nature Trail", "nature", "trails", 5),
    ("elora-trampoline-park", "Trampoline Park", "family", "trampoline", 6),
    ("elora-outdoor-living-room", "Outdoor Living Room", "gathering", "outdoor-living", 7),
    ("elora-running-track", "Running Track", "recreation", "running-track", 8),
    ("elora-community-garden", "Community Garden", "nature", "gardens", 9),
    ("elora-table-tennis", "Table Tennis", "recreation", "table-tennis", 10),
    ("elora-half-basketball-court", "Half Basketball Court", "recreation", "basketball", 11),
    ("elora-multi-use-gaming-court", "Multi-Use Gaming Court", "recreation", "multi-use-court", 12),
    ("elora-outdoor-communal-table", "Outdoor Communal Table", "gathering", "communal-table", 13),
]

out = []
add = out.append
add("-- Elora Batches 001–004 promotion. Ray authorized 2026-08-13.")
add("-- Includes layouts, facades, draft amenities, payment/summary/body, price_from_aed,")
add("-- 73 plexes, 430 units. Media § after Storage upload to media/elora/*.")
add("")
add("do $$ begin")
add("  if (select count(*) from plexes p join clusters c on c.id=p.cluster_id where c.slug='elora') > 0")
add("     or (select count(*) from units u join clusters c on c.id=u.cluster_id where c.slug='elora') > 0 then")
add("    raise exception 'Elora units/plexes already present';")
add("  end if;")
add("end $$;")
add("")
add("delete from unit_types")
add("where cluster_id = (select id from clusters where slug = 'elora')")
add("  and layout is null;")
add("")
add(
    """insert into unit_types (
  cluster_id, bedrooms, label, layout, bua_min, bua_max, unit_count,
  bathrooms, maids_room, ground_floor_bedroom, confidence, source_id, sort_order
)
select c.id, v.bedrooms, v.label, v.layout, v.bua_min, v.bua_max, v.unit_count,
       v.bathrooms, v.maids_room, v.gf_bed, 'corroborated',
       'a1000000-0000-4000-8000-000000000001'::uuid, v.sort_order
from clusters c
join (values
  (3, 'A', 'moon-a', 2180, 2180, 16, 3.5, true,  false, 10),
  (3, 'B', 'moon-b', 2180, 2180, 16, 3.5, false, false, 20),
  (3, 'A', 'mysk-a', 2095, 2112, 126, 3.5, false, false, 30),
  (3, 'B', 'mysk-b', 2095, 2112, 126, 3.5, false, false, 40),
  (4, 'A', 'moon-a', 2608, 2608, 57, 4.0, true,  true,  50),
  (4, 'B', 'moon-b', 2608, 2608, 57, 4.0, true,  true,  60),
  (4, 'A', 'mysk-a', 2586, 2586, 16, 4.0, true,  true,  70),
  (4, 'B', 'mysk-b', 2586, 2586, 16, 4.0, true,  true,  80)
) as v(bedrooms, label, layout, bua_min, bua_max, unit_count, bathrooms, maids_room, gf_bed, sort_order) on true
where c.slug = 'elora';"""
)
add("")
add(
    """insert into facade_style_descriptions (
  cluster_id, style_name, description, sort_order, confidence, source_id
)
select c.id, v.style_name, v.description, v.sort_order, 'corroborated',
       'a1000000-0000-4000-8000-000000000001'::uuid
from clusters c
join (values
  ('Moon', $moon$Moon design aesthetic is an alluring interplay of planes and masses accented to highlight a tranquil style of living.$moon$, 10),
  ('Mysk', $mysk$Mysk is a collection of townhouses with rich-toned and open corners to capture the enchanting rays of the golden hour and create a sense of calmness and warmth.$mysk$, 20)
) as v(style_name, description, sort_order) on true
where c.slug = 'elora';"""
)
add("")
add(
    """insert into places (
  slug, name, category, subcategory, cluster_id, in_community,
  confidence, source_id, state, sort_order
)
select
  v.slug, v.name, v.category, v.subcategory,
  (select id from clusters where slug = 'elora'),
  true, 'corroborated', 'a1000000-0000-4000-8000-000000000001'::uuid, 'draft', v.sort_order
from (values"""
)
for i, (slug, name, cat, sub, so) in enumerate(amenities):
    comma = "," if i < len(amenities) - 1 else ""
    add(f"  ('{slug}', '{name}', '{cat}', '{sub}', {so}){comma}")
add(") as v(slug, name, category, subcategory, sort_order);")
add("")
add("update clusters set")
add(f"  payment_plan = $pay${pay}$pay$,")
add(f"  summary = $sum${summary}$sum$,")
add(f"  body = $body${body}$body$,")
add("  price_from_aed = 1600000,")
add("  updated_at = now()")
add("where slug = 'elora';")
add("")
add(f"-- plexes: {len(plexes)}")
add(
    "insert into plexes (cluster_id, plex_size, street_side, range_start, range_end, confidence, source_id)"
)
add("select c.id, v.plex_size, v.street_side, v.range_start, v.range_end,")
add("       'unverified', 'a1000000-0000-4000-8000-000000000001'::uuid")
add("from clusters c")
add("join (values")
for i, (rs, re, sz, side) in enumerate(plexes):
    comma = "," if i < len(plexes) - 1 else ""
    add(f"  ({rs}, {re}, {sz}, '{side}'){comma}")
add(") as v(range_start, range_end, plex_size, street_side) on true")
add("where c.slug = 'elora';")
add("")
add(f"-- units: {len(units)}")
add(
    """insert into units (
  cluster_id, unit_type_id, unit_number, plot_number, facade_style, bua,
  plex_id, th_position, confidence, source_id
)
select c.id, ut.id, v.unit_number::text, v.plot_number, v.facade_style, v.bua,
       p.id, v.th_position, 'unverified', 'a1000000-0000-4000-8000-000000000001'::uuid
from clusters c
join (values"""
)
for i, u in enumerate(units):
    comma = "," if i < len(units) - 1 else ""
    rs, re = u["plex_range"].split("-")
    add(
        f"  ({u['unit_number']}, {u['plot_number']}, '{u['facade_style']}', {u['bedrooms']}, "
        f"'{u['layout']}', {u['bua']}, {rs}, {re}, '{u['th_position']}'){comma}"
    )
add(
    ") as v(unit_number, plot_number, facade_style, bedrooms, layout, bua, range_start, range_end, th_position) on true"
)
add(
    "join unit_types ut on ut.cluster_id = c.id and ut.bedrooms = v.bedrooms and ut.layout = v.layout"
)
add(
    "join plexes p on p.cluster_id = c.id and p.range_start = v.range_start and p.range_end = v.range_end"
)
add("where c.slug = 'elora';")
add("")

core = "\n".join(out) + "\n"
(ROOT / "elora-batches-001-004-core.sql").write_text(core)

media = """-- MEDIA (run after Storage upload)
insert into media (storage_path, kind, alt_text, caption, credit) values
  ('elora/elora-moon-3br-a.png', 'floorplan', 'Elora Moon 3BR-A floor plan', 'Moon 3BR-A floor plan', 'Emaar Properties'),
  ('elora/elora-moon-3br-b.png', 'floorplan', 'Elora Moon 3BR-B floor plan', 'Moon 3BR-B floor plan', 'Emaar Properties'),
  ('elora/elora-mysk-3br-a.png', 'floorplan', 'Elora Mysk 3BR-A floor plan', 'Mysk 3BR-A floor plan', 'Emaar Properties'),
  ('elora/elora-mysk-3br-b.png', 'floorplan', 'Elora Mysk 3BR-B floor plan', 'Mysk 3BR-B floor plan', 'Emaar Properties'),
  ('elora/elora-moon-4br-a.png', 'floorplan', 'Elora Moon 4BR-A floor plan', 'Moon 4BR-A floor plan', 'Emaar Properties'),
  ('elora/elora-moon-4br-b.png', 'floorplan', 'Elora Moon 4BR-B floor plan', 'Moon 4BR-B floor plan', 'Emaar Properties'),
  ('elora/elora-mysk-4br-a.png', 'floorplan', 'Elora Mysk 4BR-A floor plan', 'Mysk 4BR-A floor plan', 'Emaar Properties'),
  ('elora/elora-mysk-4br-b.png', 'floorplan', 'Elora Mysk 4BR-B floor plan', 'Mysk 4BR-B floor plan', 'Emaar Properties'),
  ('elora/elora-moon-facade.jpeg', 'photo', 'Elora Moon facade', 'Moon facade', 'Emaar Properties'),
  ('elora/elora-mysk-facade.jpeg', 'photo', 'Elora Mysk facade', 'Mysk facade', 'Emaar Properties'),
  ('elora/elora-cluster-map.jpeg', 'map', 'Elora cluster map', 'Elora cluster map', 'Emaar Properties'),
  ('elora/elora-valley-context-map.png', 'map', 'Elora valley context map', 'Valley context map', 'Emaar Properties'),
  ('elora/elora-master-plan.jpeg', 'map', 'Elora master plan', 'Elora master plan', 'Emaar Properties');

insert into media_links (media_id, subject_type, subject_id, is_primary)
select m.id, 'unit_type', ut.id, true
from media m
join unit_types ut on ut.cluster_id = (select id from clusters where slug = 'elora')
join (values
  ('elora/elora-moon-3br-a.png', 3, 'moon-a'),
  ('elora/elora-moon-3br-b.png', 3, 'moon-b'),
  ('elora/elora-mysk-3br-a.png', 3, 'mysk-a'),
  ('elora/elora-mysk-3br-b.png', 3, 'mysk-b'),
  ('elora/elora-moon-4br-a.png', 4, 'moon-a'),
  ('elora/elora-moon-4br-b.png', 4, 'moon-b'),
  ('elora/elora-mysk-4br-a.png', 4, 'mysk-a'),
  ('elora/elora-mysk-4br-b.png', 4, 'mysk-b')
) as v(storage_path, bedrooms, layout) on v.storage_path = m.storage_path
where ut.bedrooms = v.bedrooms and ut.layout = v.layout;

insert into media_links (media_id, subject_type, subject_id, is_primary, sort_order)
select m.id, 'facade_style_description', f.id, true, 0
from media m
join facade_style_descriptions f on f.cluster_id = (select id from clusters where slug = 'elora')
join (values
  ('elora/elora-moon-facade.jpeg', 'Moon'),
  ('elora/elora-mysk-facade.jpeg', 'Mysk')
) as v(storage_path, style_name) on v.storage_path = m.storage_path and f.style_name = v.style_name;

insert into media_links (media_id, subject_type, subject_id, is_primary, sort_order)
select m.id, 'cluster', c.id, (m.storage_path = 'elora/elora-cluster-map.jpeg'), v.sort_order
from media m
join clusters c on c.slug = 'elora'
join (values
  ('elora/elora-cluster-map.jpeg', 10),
  ('elora/elora-valley-context-map.png', 20),
  ('elora/elora-master-plan.jpeg', 30)
) as v(storage_path, sort_order) on v.storage_path = m.storage_path;
"""
(ROOT / "elora-batches-001-004-promotion.sql").write_text(core + "\n" + media)
print(f"wrote core={len(core)} full={len(core)+len(media)} plexes={len(plexes)} units={len(units)}")
