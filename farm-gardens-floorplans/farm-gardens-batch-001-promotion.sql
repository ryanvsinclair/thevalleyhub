-- ============================================================
-- Farm Gardens — Doc 7 Batch 001 promotion
-- Ready to run once Doc 4 #05, #06, #07, #08 are pushed live
-- (docs/0001_init.sql / supabase/migrations/0001_init.sql).
--
-- Source: Doc 7 (docs/07-data-staging.md), Batch 001.
-- All facts below: source_id = a1000000-0000-4000-8000-000000000001
-- (Emaar Properties, developer).
--
-- Run in order. Sections 1-2 update/correct already-published rows.
-- Sections 3-6 insert new rows. Section 7 (media) requires the 8
-- images in this same folder to already be uploaded to the `media`
-- storage bucket first — see the paths and instructions at the
-- bottom before running that section.
--
-- This file intentionally lives outside supabase/seed/ — those
-- files mirror Doc 1, and Doc 1 itself hasn't been updated yet
-- (guarded, Ray-only). Once Doc 1 is updated to match, the relevant
-- pieces here should be folded into 02_clusters.sql / 03_unit_types.sql
-- so the seed set stays a mirror of Doc 1, per the project's own
-- convention (README: "Seeds ... Doc 1 only").
-- ============================================================

-- ---------- 1. clusters: correct/add Farm Gardens fields ----------

update clusters set
  price_from_aed = 5100000,
  payment_plan = '10% Down Payment (Dec 2022) · 10% 1st Instalment (Feb 2023) · 10% 2nd Instalment (Aug 2023) · 10% 3rd Instalment (Feb 2024) · 10% 4th Instalment (Aug 2024, 20% construction) · 10% 5th Instalment (Feb 2025, 40% construction) · 10% 6th Instalment (Jul 2025, 60% construction) · 10% 7th Instalment (Dec 2025, 80% construction) · 20% 8th Instalment (Aug 2026, 100% construction)',
  summary = 'Farm Gardens is the original Valley''s standalone villa cluster — 146 four- and five-bedroom homes on 8,000–10,000 sq ft plots, built around a working farm-to-table lifestyle with its own hydroponics greenhouse and community farming plots.',
  body = E'Farm Gardens sits at the top of the original Valley masterplan, on the Dubai–Al Ain Road. It''s a 146-home, gated standalone-villa community built around a farm-style concept: residents can grow and harvest their own food in community garden plots, supported by full-time onsite farmers, a hydroponics greenhouse, and community farming allotments.\n\nHomes come in two styles — Horizon and Earth — as 4-bedroom (4,950 sq ft BUA, ~8,914 sq ft plot) or 5-bedroom (5,657 sq ft BUA, ~10,004 sq ft plot) villas, 79 and 67 units respectively.\n\nOn-site amenities include a Grand Lawn, petting zoo and animal farm, desert majlis with bonfire area, stargazing platforms, picnic spots, a mosque, and a private Wellness Centre with gym, spa, restaurant and pool decks overlooking the farmland. Residents also have access to The Valley''s shared amenities — Golden Beach, Town Centre, Sports Village and Kids'' Dale.\n\nTarget handover: 30 September 2026.',
  confidence = 'corroborated'
where slug = 'farm-gardens';
-- positioning intentionally NOT touched, per Ray's instruction.

-- ---------- 2. unit_types: fix + fill Farm Gardens rows ----------

-- 4-bed: add plot_min, floor-plan breakdown, unit_count
update unit_types set
  plot_min = 8914,
  suite_area = 3843, garage_area = 608, balcony_area = 500, roof_terrace_area = 423,
  unit_count = 79,
  confidence = 'corroborated'
where cluster_id = (select id from clusters where slug = 'farm-gardens') and bedrooms = 4;

-- 5-bed: FIX bua_max (was 10004 — that's the plot area, not BUA), add plot_max, breakdown, unit_count
update unit_types set
  bua_max = 5657,
  plot_max = 10004,
  suite_area = 4520, garage_area = 622, balcony_area = 515, roof_terrace_area = 441,
  unit_count = 67,
  confidence = 'corroborated'
where cluster_id = (select id from clusters where slug = 'farm-gardens') and bedrooms = 5;

-- ---------- 3. facade_style_descriptions ----------

insert into facade_style_descriptions (cluster_id, style_name, description, confidence, source_id)
select id, 'Horizon',
  'The peace and stability of these luxurious four and five-bedroom villas can be felt in the air. As the developed area merges into its natural surroundings, the smooth horizontal lines serve as a seamless transition.',
  'corroborated', 'a1000000-0000-4000-8000-000000000001'
from clusters where slug = 'farm-gardens';

insert into facade_style_descriptions (cluster_id, style_name, description, confidence, source_id)
select id, 'Earth',
  'The Earth villas master indoor-outdoor living. Developed with a unique relationship with the external natural environment, these modern four and five-bedroom residences create a feeling of privilege in this exceptional setting of a luscious desert farming community.',
  'corroborated', 'a1000000-0000-4000-8000-000000000001'
from clusters where slug = 'farm-gardens';

-- ---------- 4. places: 19 cluster-specific amenities ----------
-- category/subcategory are a provisional taxonomy (not sourced from
-- Emaar material) — review before treating as final, per Doc 7.

insert into places (slug, name, category, subcategory, cluster_id, in_community, confidence, source_id, state)
select 'farm-gardens-' || v.slug, v.name, v.category, v.subcategory,
       (select id from clusters where slug = 'farm-gardens'), true,
       'corroborated', 'a1000000-0000-4000-8000-000000000001', 'draft'
from (values
  ('grand-lawn', 'Grand Lawn', 'outdoor', 'lawn'),
  ('petting-zoo-animal-farm', 'Petting Zoo & Animal Farm', 'family', 'petting-zoo'),
  ('kids-play-area', 'Kids Play Area', 'family', 'play-area'),
  ('hydroponics-greenhouse', 'Hydroponics Greenhouse', 'farming', 'greenhouse'),
  ('community-farming-allotments', 'Community Farming Allotments', 'farming', 'allotments'),
  ('desert-majlis-bonfire', 'Desert Majlis & Bonfire', 'outdoor', 'majlis'),
  ('stargazing-platforms', 'Stargazing Platforms', 'outdoor', 'stargazing'),
  ('picnic-spots', 'Picnic Spots', 'outdoor', 'picnic'),
  ('outdoor-fitness-station', 'Outdoor Fitness Station', 'sports', 'fitness-station'),
  ('yoga-events-lawn', 'Yoga/Events Lawn', 'sports', 'yoga-lawn'),
  ('xeriscape-botanical-garden', 'Xeriscape Botanical Garden', 'nature', 'botanical-garden'),
  ('events-plaza', 'Events Plaza', 'community', 'events-plaza'),
  ('pool-deck', 'Pool Deck', 'sports', 'pool'),
  ('padel-court', 'Padel Court', 'sports', 'padel-court'),
  ('volleyball-court', 'Volleyball Court', 'sports', 'volleyball'),
  ('ghaf-forest', 'Ghaf Forest', 'nature', 'ghaf-forest'),
  ('mosque', 'Mosque', 'community', 'mosque'),
  ('wellness-centre', 'Wellness Centre', 'wellness', 'wellness-centre'),
  ('arrival-plaza', 'Arrival Plaza', 'community', 'arrival-plaza')
) as v(slug, name, category, subcategory);
-- NOTE: state = 'draft' deliberately, not 'published' — Ray should
-- flip these once the category/subcategory taxonomy is reviewed.

-- ---------- 5. units: all 146 Farm Gardens plots ----------
-- confidence = 'unverified': plot/unit numbers are reliably read as
-- printed text, but unit_type_id and facade_style are visually
-- classified from the site-plan render, not independently sourced —
-- the row takes the more conservative tier. Style classified with
-- wide margins (min 69.9) across all 146; type validated exactly
-- against the published 79/67 split; plots 45, 50, 92 individually
-- confirmed by Ray.

with fg as (
  select id as cluster_id from clusters where slug = 'farm-gardens'
),
ut as (
  select bedrooms, id as unit_type_id from unit_types
  where cluster_id = (select cluster_id from fg)
)
insert into units (cluster_id, unit_type_id, unit_number, plot_number, facade_style, confidence, source_id)
select fg.cluster_id, ut.unit_type_id, v.unit_number, v.plot_number, v.facade_style,
       'unverified', 'a1000000-0000-4000-8000-000000000001'
from (values
  ('1', 1, 4, 'Earth'),
  ('2', 2, 4, 'Horizon'),
  ('3', 3, 4, 'Horizon'),
  ('4', 4, 4, 'Earth'),
  ('5', 5, 4, 'Horizon'),
  ('6', 6, 5, 'Horizon'),
  ('7', 7, 5, 'Horizon'),
  ('8', 8, 5, 'Horizon'),
  ('9', 9, 5, 'Earth'),
  ('10', 10, 4, 'Earth'),
  ('11', 11, 4, 'Earth'),
  ('12', 12, 4, 'Earth'),
  ('13', 13, 4, 'Horizon'),
  ('14', 14, 4, 'Earth'),
  ('15', 15, 4, 'Horizon'),
  ('16', 16, 4, 'Earth'),
  ('17', 17, 4, 'Earth'),
  ('18', 18, 5, 'Earth'),
  ('19', 19, 5, 'Horizon'),
  ('20', 20, 5, 'Horizon'),
  ('21', 21, 5, 'Horizon'),
  ('22', 22, 5, 'Earth'),
  ('23', 23, 4, 'Earth'),
  ('24', 24, 4, 'Earth'),
  ('25', 25, 4, 'Horizon'),
  ('26', 26, 4, 'Horizon'),
  ('27', 27, 4, 'Earth'),
  ('28', 28, 4, 'Earth'),
  ('29', 29, 5, 'Earth'),
  ('30', 30, 5, 'Horizon'),
  ('31', 31, 5, 'Horizon'),
  ('32', 32, 5, 'Horizon'),
  ('33', 33, 5, 'Horizon'),
  ('34', 34, 5, 'Horizon'),
  ('35', 35, 5, 'Earth'),
  ('36', 36, 5, 'Earth'),
  ('37', 37, 5, 'Horizon'),
  ('38', 38, 5, 'Horizon'),
  ('39', 39, 5, 'Earth'),
  ('40', 40, 5, 'Earth'),
  ('41', 41, 5, 'Horizon'),
  ('42', 42, 5, 'Horizon'),
  ('43', 43, 5, 'Horizon'),
  ('44', 44, 5, 'Horizon'),
  ('45', 45, 5, 'Earth'),
  ('46', 46, 4, 'Earth'),
  ('47', 47, 4, 'Earth'),
  ('48', 48, 4, 'Earth'),
  ('49', 49, 4, 'Horizon'),
  ('50', 50, 4, 'Horizon'),
  ('51', 51, 4, 'Earth'),
  ('52', 52, 4, 'Earth'),
  ('53', 53, 4, 'Earth'),
  ('54', 54, 5, 'Earth'),
  ('55', 55, 5, 'Horizon'),
  ('56', 56, 5, 'Horizon'),
  ('57', 57, 5, 'Horizon'),
  ('58', 58, 4, 'Earth'),
  ('59', 59, 4, 'Earth'),
  ('60', 60, 4, 'Earth'),
  ('61', 61, 4, 'Horizon'),
  ('62', 62, 4, 'Earth'),
  ('63', 63, 4, 'Horizon'),
  ('64', 64, 4, 'Earth'),
  ('65', 65, 4, 'Earth'),
  ('66', 66, 5, 'Earth'),
  ('67', 67, 5, 'Horizon'),
  ('68', 68, 5, 'Horizon'),
  ('69', 69, 5, 'Horizon'),
  ('70', 70, 4, 'Horizon'),
  ('71', 71, 4, 'Horizon'),
  ('72', 72, 4, 'Earth'),
  ('73', 73, 4, 'Horizon'),
  ('74', 74, 4, 'Earth'),
  ('75', 75, 4, 'Earth'),
  ('76', 76, 4, 'Horizon'),
  ('77', 77, 4, 'Earth'),
  ('78', 78, 4, 'Horizon'),
  ('79', 79, 4, 'Horizon'),
  ('80', 80, 5, 'Horizon'),
  ('81', 81, 5, 'Horizon'),
  ('82', 82, 5, 'Horizon'),
  ('83', 83, 5, 'Earth'),
  ('84', 84, 4, 'Earth'),
  ('85', 85, 4, 'Earth'),
  ('86', 86, 4, 'Earth'),
  ('87', 87, 4, 'Horizon'),
  ('88', 88, 4, 'Earth'),
  ('89', 89, 4, 'Horizon'),
  ('90', 90, 4, 'Earth'),
  ('91', 91, 4, 'Earth'),
  ('92', 92, 4, 'Earth'),
  ('93', 93, 5, 'Earth'),
  ('94', 94, 5, 'Horizon'),
  ('95', 95, 5, 'Horizon'),
  ('96', 96, 5, 'Horizon'),
  ('97', 97, 5, 'Earth'),
  ('98', 98, 4, 'Earth'),
  ('99', 99, 4, 'Earth'),
  ('100', 100, 4, 'Earth'),
  ('101', 101, 4, 'Horizon'),
  ('102', 102, 4, 'Horizon'),
  ('103', 103, 4, 'Earth'),
  ('104', 104, 5, 'Earth'),
  ('105', 105, 5, 'Horizon'),
  ('106', 106, 5, 'Horizon'),
  ('107', 107, 5, 'Horizon'),
  ('108', 108, 5, 'Earth'),
  ('109', 109, 5, 'Earth'),
  ('110', 110, 5, 'Horizon'),
  ('111', 111, 5, 'Horizon'),
  ('112', 112, 5, 'Earth'),
  ('113', 113, 5, 'Earth'),
  ('114', 114, 5, 'Horizon'),
  ('115', 115, 5, 'Horizon'),
  ('116', 116, 5, 'Horizon'),
  ('117', 117, 5, 'Horizon'),
  ('118', 118, 5, 'Earth'),
  ('119', 119, 4, 'Earth'),
  ('120', 120, 4, 'Earth'),
  ('121', 121, 4, 'Horizon'),
  ('122', 122, 4, 'Horizon'),
  ('123', 123, 4, 'Earth'),
  ('124', 124, 4, 'Earth'),
  ('125', 125, 5, 'Earth'),
  ('126', 126, 5, 'Horizon'),
  ('127', 127, 5, 'Horizon'),
  ('128', 128, 5, 'Horizon'),
  ('129', 129, 5, 'Earth'),
  ('130', 130, 4, 'Earth'),
  ('131', 131, 4, 'Earth'),
  ('132', 132, 4, 'Horizon'),
  ('133', 133, 4, 'Earth'),
  ('134', 134, 4, 'Horizon'),
  ('135', 135, 4, 'Earth'),
  ('136', 136, 4, 'Earth'),
  ('137', 137, 4, 'Earth'),
  ('138', 138, 5, 'Earth'),
  ('139', 139, 5, 'Horizon'),
  ('140', 140, 5, 'Horizon'),
  ('141', 141, 5, 'Horizon'),
  ('142', 142, 4, 'Horizon'),
  ('143', 143, 4, 'Horizon'),
  ('144', 144, 4, 'Earth'),
  ('145', 145, 4, 'Horizon'),
  ('146', 146, 4, 'Earth')
) as v(unit_number, plot_number, bedrooms, facade_style)
cross join fg
join ut on ut.bedrooms = v.bedrooms;

-- ---------- 6. sanity checks — run these after section 5 ----------
-- select count(*) from units where cluster_id = (select id from clusters where slug='farm-gardens');
--   expect 146
-- select ut.bedrooms, count(*) from units u join unit_types ut on ut.id = u.unit_type_id
--   where u.cluster_id = (select id from clusters where slug='farm-gardens') group by ut.bedrooms;
--   expect 4 -> 79, 5 -> 67
-- select facade_style, count(*) from units
--   where cluster_id = (select id from clusters where slug='farm-gardens') group by facade_style;
--   expect Horizon -> 72, Earth -> 74

-- ============================================================
-- 7. media + media_links — REQUIRES the 8 images uploaded first
-- ============================================================
-- Upload each file in this folder to the `media` storage bucket at
-- the storage_path shown below (e.g. via the Supabase dashboard,
-- `supabase storage cp`, or the /admin/media UI). Only after upload
-- do the paths below resolve to real objects — the inserts will
-- succeed either way (storage_path is just text), but the images
-- won't actually render until the files exist at those paths.
--
-- Suggested storage_path convention: farm-gardens/<filename>
--
--   farm-gardens-4bed-floorplan.png            -> farm-gardens/4bed-floorplan.png
--   farm-gardens-4bed-floorplan-mirrored.png   -> farm-gardens/4bed-floorplan-mirrored.png
--   farm-gardens-5bed-floorplan.png            -> farm-gardens/5bed-floorplan.png
--   farm-gardens-5bed-floorplan-mirrored.png   -> farm-gardens/5bed-floorplan-mirrored.png
--   farm-gardens-site-plan.png                 -> farm-gardens/site-plan.png
--   farm-gardens-master-plan.png               -> farm-gardens/master-plan.png
--   farm-gardens-horizon-exterior.png          -> farm-gardens/horizon-exterior.png
--   farm-gardens-earth-exterior.png            -> farm-gardens/earth-exterior.png

-- 4-bed floor plans -> linked to the 4-bed unit_types row
insert into media (storage_path, kind, alt_text, caption, credit)
values ('farm-gardens/4bed-floorplan.png', 'floorplan', 'Farm Gardens 4-bedroom villa floor plan — ground, first, and roof floor layouts', '4-Bedroom floor plan', 'Emaar Properties')
returning id \gset fp4_
insert into media_links (media_id, subject_type, subject_id, sort_order, is_primary)
select :'fp4_id', 'unit_type', id, 1, true from unit_types
where cluster_id = (select id from clusters where slug = 'farm-gardens') and bedrooms = 4;

insert into media (storage_path, kind, alt_text, caption, credit)
values ('farm-gardens/4bed-floorplan-mirrored.png', 'floorplan', 'Farm Gardens 4-bedroom villa floor plan, mirrored layout', '4-Bedroom floor plan (mirrored)', 'Emaar Properties')
returning id \gset fp4m_
insert into media_links (media_id, subject_type, subject_id, sort_order, is_primary)
select :'fp4m_id', 'unit_type', id, 2, false from unit_types
where cluster_id = (select id from clusters where slug = 'farm-gardens') and bedrooms = 4;

-- 5-bed floor plans -> linked to the 5-bed unit_types row
insert into media (storage_path, kind, alt_text, caption, credit)
values ('farm-gardens/5bed-floorplan.png', 'floorplan', 'Farm Gardens 5-bedroom villa floor plan — ground, first, and roof floor layouts', '5-Bedroom floor plan', 'Emaar Properties')
returning id \gset fp5_
insert into media_links (media_id, subject_type, subject_id, sort_order, is_primary)
select :'fp5_id', 'unit_type', id, 1, true from unit_types
where cluster_id = (select id from clusters where slug = 'farm-gardens') and bedrooms = 5;

insert into media (storage_path, kind, alt_text, caption, credit)
values ('farm-gardens/5bed-floorplan-mirrored.png', 'floorplan', 'Farm Gardens 5-bedroom villa floor plan, mirrored layout', '5-Bedroom floor plan (mirrored)', 'Emaar Properties')
returning id \gset fp5m_
insert into media_links (media_id, subject_type, subject_id, sort_order, is_primary)
select :'fp5m_id', 'unit_type', id, 2, false from unit_types
where cluster_id = (select id from clusters where slug = 'farm-gardens') and bedrooms = 5;

-- site plan + master plan -> linked to the cluster
insert into media (storage_path, kind, alt_text, caption, credit)
values ('farm-gardens/site-plan.png', 'document', 'Farm Gardens community site plan showing all 146 numbered plots and on-site amenities', 'Site plan', 'Emaar Properties')
returning id \gset sp_
insert into media_links (media_id, subject_type, subject_id, sort_order, is_primary)
select :'sp_id', 'cluster', id, 1, true from clusters where slug = 'farm-gardens';

insert into media (storage_path, kind, alt_text, caption, credit)
values ('farm-gardens/master-plan.png', 'document', 'Farm Gardens location within The Valley masterplan', 'Location map', 'Emaar Properties')
returning id \gset mp_
insert into media_links (media_id, subject_type, subject_id, sort_order, is_primary)
select :'mp_id', 'cluster', id, 2, false from clusters where slug = 'farm-gardens';

-- Horizon / Earth exteriors -> linked to their facade_style_descriptions row
insert into media (storage_path, kind, alt_text, caption, credit)
values ('farm-gardens/horizon-exterior.png', 'photo', 'Farm Gardens Horizon-style villa exterior render', 'Horizon style', 'Emaar Properties')
returning id \gset hz_
insert into media_links (media_id, subject_type, subject_id, sort_order, is_primary)
select :'hz_id', 'facade_style_description', id, 1, true from facade_style_descriptions
where cluster_id = (select id from clusters where slug = 'farm-gardens') and style_name = 'Horizon';

insert into media (storage_path, kind, alt_text, caption, credit)
values ('farm-gardens/earth-exterior.png', 'photo', 'Farm Gardens Earth-style villa exterior render', 'Earth style', 'Emaar Properties')
returning id \gset er_
insert into media_links (media_id, subject_type, subject_id, sort_order, is_primary)
select :'er_id', 'facade_style_description', id, 1, true from facade_style_descriptions
where cluster_id = (select id from clusters where slug = 'farm-gardens') and style_name = 'Earth';
