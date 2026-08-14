#!/usr/bin/env python3
"""Generate Orania Batches 001–004 promotion SQL."""

from __future__ import annotations

import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parent
units = list(csv.DictReader((ROOT / "orania-units.csv").open()))
plex_rows = list(csv.DictReader((ROOT / "orania-plexes.csv").open()))

pay = (
    "10% Down Payment (10 Jun 2022) · 10% 1st Instalment (8 Aug 2022) · "
    "10% 2nd Instalment (8 Feb 2023) · 10% 3rd Instalment (upon 10% construction, 12 Sep 2023) · "
    "10% 4th Instalment (upon 30% construction, 27 Apr 2024) · "
    "10% 5th Instalment (upon 50% construction, 1 Oct 2024) · "
    "15% 6th Instalment (upon 70% construction, 10 Feb 2025) · "
    "25% 7th Instalment (upon 100% construction, estimated 31 Dec 2025)"
)
summary = (
    "The Valley’s fourth neighbourhood of modern townhouses, ORANIA brings balance "
    "to your lifestyle, in a community you can feel proud to call home."
)
body = (
    "With a wide array of indoor and outdoor retail options, The Valley's Golden Beach, "
    "lush linear parks, a local farmers’ market, and gourmet dining options just footsteps "
    "away, your family can embrace a true sense of community amidst the serenity of nature.\n\n"
    "ORANIA offers you the choice of three and four-bedroom townhouses in two distinct "
    "architectural styles: Bold and Sleek. Choose the ideal home to match your lifestyle "
    "and enjoy direct access to linear parks and lush green open spaces in a setting of "
    "absolute tranquillity."
)

amenities = [
    ("orania-gatehouse", "Orania Gatehouse", "gathering", "gatehouse", 1),
    ("orania-pocket-park", "Pocket Park", "nature", "pocket-parks", 2),
    ("orania-kids-play-area-and-lawn", "Kids Play Area and Lawn", "family", "kids-play", 3),
    ("orania-community-clubhouse", "Community Clubhouse", "gathering", "community-centre", 4),
    ("orania-green-sikka", "Green Sikka", "nature", "sikkas", 5),
    ("orania-splash-pad", "Splash Pad", "family", "splash-pad", 6),
    ("orania-picnic-lawn", "Picnic Lawn", "gathering", "picnic", 7),
    ("orania-jogging-track", "Jogging Track", "recreation", "running-track", 8),
    ("orania-outdoor-living-room", "Outdoor Living Room", "gathering", "outdoor-living", 9),
    ("orania-palm-grove", "Palm Grove", "nature", "gardens", 10),
    ("orania-yoga-deck", "Yoga Deck", "wellness", "yoga", 11),
    ("orania-events-lawn", "Events Lawn", "gathering", "lawn", 12),
    ("orania-sports-court", "Sports Court", "recreation", "multi-use-court", 13),
    ("orania-skate-park", "Skate Park", "recreation", "skate", 14),
]

# layout table from staging Batch 001 + unit_count from Batch 004
unit_types = [
    # bedrooms, label, layout, bua_min, bua_max, unit_count, bathrooms, maids, gf_bed, sort
    (3, "A", "bold-a", 1960, 1992, 24, 3.5, True, False, 10),
    (3, "B", "bold-b", 1959, 1960, 24, 3.5, True, False, 20),
    (3, "C", "bold-c", 1896, 1899, 36, 3.5, True, False, 30),
    (3, "D", "bold-d", 1896, 1929, 36, 3.5, True, False, 40),
    (4, "A", "bold-a", 2284, 2284, 12, 4.0, True, True, 50),
    (4, "B", "bold-b", 2284, 2284, 12, 4.0, True, True, 60),
    (4, "C", "bold-c", 2346, 2346, 6, 4.0, True, True, 70),
    (4, "D", "bold-d", 2346, 2346, 6, 4.0, True, True, 80),
    (3, "A", "sleek-a", 2009, 2044, 24, 3.5, True, False, 90),
    (3, "B", "sleek-b", 2009, 2011, 24, 3.5, True, False, 100),
    (3, "C", "sleek-c", 1903, 1906, 34, 3.5, True, False, 110),
    (3, "D", "sleek-d", 1903, 1938, 34, 3.5, True, False, 120),
    (4, "A", "sleek-a", 2264, 2265, 12, 4.0, True, True, 130),
    (4, "B", "sleek-b", 2265, 2265, 12, 4.0, True, True, 140),
    (4, "C", "sleek-c", 2345, 2345, 6, 4.0, True, True, 150),
    (4, "D", "sleek-d", 2346, 2346, 6, 4.0, True, True, 160),
]

out: list[str] = []
add = out.append
add("-- Orania Batches 001–004 promotion. Ray authorized 2026-08-13 (promote + publish).")
add("-- 16 unit_types, 2 facades, 14 published places, payment/summary/body,")
add("-- price_from_aed, facade_styles, plex_config, 36 plexes, 308 units.")
add("-- Media § after Storage upload to media/orania/*.")
add("")
add("do $$ begin")
add("  if (select count(*) from plexes p join clusters c on c.id=p.cluster_id where c.slug='orania') > 0")
add("     or (select count(*) from units u join clusters c on c.id=u.cluster_id where c.slug='orania') > 0 then")
add("    raise exception 'Orania units/plexes already present';")
add("  end if;")
add("end $$;")
add("")
add("delete from unit_types")
add("where cluster_id = (select id from clusters where slug = 'orania')")
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
join (values"""
)
for i, row in enumerate(unit_types):
    beds, label, layout, bmin, bmax, uc, baths, maid, gf, so = row
    comma = "," if i < len(unit_types) - 1 else ""
    add(
        f"  ({beds}, '{label}', '{layout}', {bmin}, {bmax}, {uc}, {baths}, "
        f"{str(maid).lower()}, {str(gf).lower()}, {so}){comma}"
    )
add(
    ") as v(bedrooms, label, layout, bua_min, bua_max, unit_count, bathrooms, maids_room, gf_bed, sort_order) on true"
)
add("where c.slug = 'orania';")
add("")
add(
    """insert into facade_style_descriptions (
  cluster_id, style_name, description, sort_order, confidence, source_id
)
select c.id, v.style_name, v.description, v.sort_order, 'corroborated',
       'a1000000-0000-4000-8000-000000000001'::uuid
from clusters c
join (values
  ('Bold', $bold$Come home to a bold architectural aesthetic that harmoniously blends pure solids and voids for a design that exudes sophistication and beautifully complements its natural surroundings.$bold$, 10),
  ('Sleek', $sleek$Wake up to an elegant and inviting architectural design, boasting iconic frames that stand out in a sleek exterior composition, creating a sense of calmness and modernity.$sleek$, 20)
) as v(style_name, description, sort_order) on true
where c.slug = 'orania';"""
)
add("")
add(
    """insert into places (
  slug, name, category, subcategory, cluster_id, in_community,
  confidence, source_id, state, sort_order
)
select
  v.slug, v.name, v.category, v.subcategory,
  (select id from clusters where slug = 'orania'),
  true, 'corroborated', 'a1000000-0000-4000-8000-000000000001'::uuid, 'published', v.sort_order
from (values"""
)
for i, (slug, name, cat, sub, so) in enumerate(amenities):
    comma = "," if i < len(amenities) - 1 else ""
    add(f"  ('{slug}', '{name}', '{cat}', '{sub}', {so}){comma}")
add(") as v(slug, name, category, subcategory, sort_order);")
add("")
add("update clusters set")
add("  facade_styles = array['Bold','Sleek'],")
add("  plex_config = '36 plexes in 6, 8 and 10-plex rows',")
add(
    "  positioning = $pos$The layout-choice cluster. 36 plexes across 6, 8 and 10-plex configurations, widest variety of orientation and plot shape. No back-to-back units.$pos$,"
)
add(f"  payment_plan = $pay${pay}$pay$,")
add(f"  summary = $sum${summary}$sum$,")
add(f"  body = $body${body}$body$,")
add("  price_from_aed = 1528888,")
add("  updated_at = now()")
add("where slug = 'orania';")
add("")
add(f"-- plexes: {len(plex_rows)}")
add(
    "insert into plexes (cluster_id, plex_size, street_side, range_start, range_end, confidence, source_id)"
)
add("select c.id, v.plex_size, v.street_side, v.range_start, v.range_end,")
add("       'unverified', 'a1000000-0000-4000-8000-000000000001'::uuid")
add("from clusters c")
add("join (values")
for i, r in enumerate(plex_rows):
    comma = "," if i < len(plex_rows) - 1 else ""
    add(
        f"  ({r['range_start']}, {r['range_end']}, {r['plex_size']}, '{r['street_side']}'){comma}"
    )
add(") as v(range_start, range_end, plex_size, street_side) on true")
add("where c.slug = 'orania';")
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
        f"'{u['layout']}', {u['bua']}, {rs}, {re}, {u['th_position']}){comma}"
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
add("where c.slug = 'orania';")
add("")

core = "\n".join(out) + "\n"
(ROOT / "orania-batches-001-004-core.sql").write_text(core)

media_files = [
    ("orania/orania-bold-3br-a.png", "floorplan", "Orania Bold 3BR-A floor plan", "Bold 3BR-A floor plan"),
    ("orania/orania-bold-3br-b.png", "floorplan", "Orania Bold 3BR-B floor plan", "Bold 3BR-B floor plan"),
    ("orania/orania-bold-3br-c.png", "floorplan", "Orania Bold 3BR-C floor plan", "Bold 3BR-C floor plan"),
    ("orania/orania-bold-3br-d.png", "floorplan", "Orania Bold 3BR-D floor plan", "Bold 3BR-D floor plan"),
    ("orania/orania-bold-4br-a.png", "floorplan", "Orania Bold 4BR-A floor plan", "Bold 4BR-A floor plan"),
    ("orania/orania-bold-4br-b.png", "floorplan", "Orania Bold 4BR-B floor plan", "Bold 4BR-B floor plan"),
    ("orania/orania-bold-4br-c.png", "floorplan", "Orania Bold 4BR-C floor plan", "Bold 4BR-C floor plan"),
    ("orania/orania-bold-4br-d.png", "floorplan", "Orania Bold 4BR-D floor plan", "Bold 4BR-D floor plan"),
    ("orania/orania-sleek-3br-a.png", "floorplan", "Orania Sleek 3BR-A floor plan", "Sleek 3BR-A floor plan"),
    ("orania/orania-sleek-3br-b.png", "floorplan", "Orania Sleek 3BR-B floor plan", "Sleek 3BR-B floor plan"),
    ("orania/orania-sleek-3br-c.png", "floorplan", "Orania Sleek 3BR-C floor plan", "Sleek 3BR-C floor plan"),
    ("orania/orania-sleek-3br-d.png", "floorplan", "Orania Sleek 3BR-D floor plan", "Sleek 3BR-D floor plan"),
    ("orania/orania-sleek-4br-a.png", "floorplan", "Orania Sleek 4BR-A floor plan", "Sleek 4BR-A floor plan"),
    ("orania/orania-sleek-4br-b.png", "floorplan", "Orania Sleek 4BR-B floor plan", "Sleek 4BR-B floor plan"),
    ("orania/orania-sleek-4br-c.png", "floorplan", "Orania Sleek 4BR-C floor plan", "Sleek 4BR-C floor plan"),
    ("orania/orania-sleek-4br-d.png", "floorplan", "Orania Sleek 4BR-D floor plan", "Sleek 4BR-D floor plan"),
    ("orania/orania-bold-facade.jpeg", "photo", "Orania Bold facade", "Bold facade"),
    ("orania/orania-sleek-facade.jpeg", "photo", "Orania Sleek facade", "Sleek facade"),
    ("orania/orania-cluster-map.jpeg", "document", "Orania cluster map", "Orania cluster map"),
    ("orania/orania-valley-context-map.png", "document", "Orania valley context map", "Valley context map"),
    ("orania/orania-master-plan.jpeg", "document", "Orania master plan", "Orania master plan"),
]

media_sql = ["-- MEDIA (run after Storage upload)", "insert into media (storage_path, kind, alt_text, caption, credit) values"]
for i, (path, kind, alt, cap) in enumerate(media_files):
    comma = "," if i < len(media_files) - 1 else ";"
    media_sql.append(
        f"  ('{path}', '{kind}', '{alt}', '{cap}', 'Emaar Properties'){comma}"
    )
media_sql.append(
    """
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
"""
)
media = "\n".join(media_sql)
(ROOT / "orania-batches-001-004-media.sql").write_text(media + "\n")
(ROOT / "orania-batches-001-004-promotion.sql").write_text(core + "\n" + media + "\n")
print(f"wrote core={len(core)} media={len(media)} plexes={len(plex_rows)} units={len(units)}")
