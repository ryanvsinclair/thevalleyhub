-- ============================================================
-- Eden — Doc 4 #12 / staging.md Batch 002 promotion
-- Ready to run once Doc 4 #12 is APPROVED and pushed live via
-- supabase/migrations/0003_eden_plexes_units.sql.
-- (0001_init.sql / 0002 are unchanged — already applied, do not
-- re-run them.)
--
-- Source: docs/clusters/eden/staging.md, Batch 002.
-- All facts below: source_id = a1000000-0000-4000-8000-000000000001
-- (Emaar Properties, developer).
--
-- Run in order. Section 1 removes the 2 generic seed unit_types rows
-- (supabase/seed/03_unit_types.sql) superseded by the 15 style-
-- specific rows in Section 2. Sections 2-6 insert new rows.
-- Section 7 (media) requires the 22 images in eden-floorplans/ to
-- already be uploaded to the `media` storage bucket first.
-- ============================================================

-- ---------- 1. unit_types: remove the 2 generic seed rows ----------
-- These predate per-style/per-layout tracking (supabase/seed/03_unit_types.sql,
-- bedrooms=3/4 only, no facade_style or layout distinction). Superseded
-- by the 15 rows in Section 2 below, which subsume their bua_min/max
-- ranges with per-style/per-layout precision.

delete from unit_types
where cluster_id = (select id from clusters where slug = 'eden')
  and layout is null;

-- ---------- 2. unit_types: 15 style/bedroom/layout rows ----------

insert into unit_types (
  cluster_id, bedrooms, label, layout, bua_min, bua_max, unit_count,
  bathrooms, maids_room, confidence, source_id, sort_order
)
select c.id, v.bedrooms, v.label, v.layout, v.bua_min, v.bua_max, v.unit_count,
       v.bathrooms, true, 'corroborated', 'a1000000-0000-4000-8000-000000000001'::uuid, v.sort_order
from clusters c
join (values
  (3, 'A', 'spruce-a', 1930, 1937, 63, 3.5, 10),
  (3, 'B', 'spruce-b', 1988, 1997, 63, 3.5, 20),
  (3, 'C', 'spruce-c', 2039, 2039, 11, 3.5, 30),
  (3, 'D', 'spruce-d', 1972, 1972, 11, 3.5, 40),
  (4, 'A', 'spruce-a', 2323, 2323, 21, 4.0, 50),
  (4, 'B', 'spruce-b', 2325, 2325, 21, 4.0, 60),
  (3, 'A', 'iris-a', 2050, 2082, 50, 3.5, 70),
  (3, 'B', 'iris-b', 2058, 2087, 44, 3.5, 80),
  (4, 'A', 'iris-a', 2335, 2336, 16, 4.0, 90),
  (4, 'B', 'iris-b', 2335, 2335, 5, 4.0, 100),
  (4, 'C', 'iris-c', 2337, 2337, 11, 4.0, 110),
  (3, 'A', 'may_bell-a', 2028, 2066, 23, 3.5, 120),
  (3, 'B', 'may_bell-b', 2028, 2028, 11, 3.5, 130),
  (4, 'A', 'may_bell-a', 2311, 2311, 6, 4.0, 140),
  (4, 'B', 'may_bell-b', 2311, 2311, 6, 4.0, 150)
) as v(bedrooms, label, layout, bua_min, bua_max, unit_count, bathrooms, sort_order) on true
where c.slug = 'eden';

-- ---------- 3. plexes: 43 rows ----------

insert into plexes (cluster_id, plex_size, street_side, range_start, range_end, confidence, source_id)
select c.id, v.plex_size, v.street_side, v.range_start, v.range_end,
       'corroborated', 'a1000000-0000-4000-8000-000000000001'::uuid
from clusters c
join (values
  (1, 8, 8, 'down'),
  (9, 16, 8, 'down'),
  (17, 24, 8, 'down'),
  (25, 32, 8, 'right'),
  (33, 38, 6, 'right'),
  (39, 44, 6, 'right'),
  (45, 50, 6, 'right'),
  (51, 58, 8, 'left'),
  (59, 68, 10, 'left'),
  (69, 78, 10, 'right'),
  (79, 86, 8, 'right'),
  (87, 94, 8, 'up'),
  (95, 102, 8, 'left'),
  (103, 112, 10, 'left'),
  (113, 121, 9, 'right'),
  (122, 129, 8, 'right'),
  (130, 137, 8, 'up'),
  (138, 145, 8, 'left'),
  (146, 154, 9, 'left'),
  (155, 163, 9, 'right'),
  (164, 171, 8, 'right'),
  (172, 179, 8, 'up'),
  (180, 187, 8, 'left'),
  (188, 196, 9, 'left'),
  (197, 204, 8, 'right'),
  (205, 214, 10, 'right'),
  (215, 224, 10, 'left'),
  (225, 232, 8, 'left'),
  (233, 240, 8, 'right'),
  (241, 250, 10, 'right'),
  (251, 256, 6, 'up'),
  (257, 265, 9, 'up'),
  (266, 275, 10, 'left'),
  (276, 283, 8, 'left'),
  (284, 291, 8, 'right'),
  (292, 301, 10, 'right'),
  (302, 309, 8, 'up'),
  (310, 319, 10, 'left'),
  (320, 327, 8, 'right'),
  (328, 336, 9, 'left'),
  (337, 342, 6, 'left'),
  (343, 352, 10, 'down'),
  (353, 362, 10, 'down')
) as v(range_start, range_end, plex_size, street_side) on true
where c.slug = 'eden';

-- ---------- 4. units: 362 rows ----------
-- unit_type_id resolved by (bedrooms, layout) match against Section 2.
-- plex_id resolved by range containment against Section 3.
-- confidence = unverified throughout: unit_number/plot_number is
-- reliably read OCR text, but facade_style/layout/th_position/bua are
-- visually and geometrically classified from the developer's site
-- plan and floor-plan PDFs, not independently field-verified — same
-- posture as Farm Gardens Batch 001's units rows.

insert into units (
  cluster_id, unit_type_id, unit_number, plot_number, facade_style, bua,
  plex_id, th_position, confidence, source_id
)
select c.id, ut.id, v.unit_number, v.unit_number::int, v.facade_style, v.bua,
       p.id, v.th_position, 'unverified', 'a1000000-0000-4000-8000-000000000001'::uuid
from clusters c
join (values
  ('8', 'spruce', 4, 'spruce-a', 2322.52, 'TH01'),
  ('7', 'spruce', 3, 'spruce-a', 1937.39, 'TH02'),
  ('6', 'spruce', 3, 'spruce-b', 1988.41, 'TH03'),
  ('5', 'spruce', 3, 'spruce-a', 1929.75, 'TH04'),
  ('4', 'spruce', 3, 'spruce-b', 1988.41, 'TH05'),
  ('3', 'spruce', 3, 'spruce-a', 1929.75, 'TH06'),
  ('2', 'spruce', 3, 'spruce-b', 1996.81, 'TH07'),
  ('1', 'spruce', 4, 'spruce-b', 2325.32, 'TH08'),
  ('16', 'spruce', 4, 'spruce-a', 2322.52, 'TH01'),
  ('15', 'spruce', 3, 'spruce-a', 1937.39, 'TH02'),
  ('14', 'spruce', 3, 'spruce-b', 1988.41, 'TH03'),
  ('13', 'spruce', 3, 'spruce-a', 1929.75, 'TH04'),
  ('12', 'spruce', 3, 'spruce-b', 1988.41, 'TH05'),
  ('11', 'spruce', 3, 'spruce-a', 1929.75, 'TH06'),
  ('10', 'spruce', 3, 'spruce-b', 1996.81, 'TH07'),
  ('9', 'spruce', 4, 'spruce-b', 2325.32, 'TH08'),
  ('24', 'spruce', 4, 'spruce-a', 2322.52, 'TH01'),
  ('23', 'spruce', 3, 'spruce-a', 1937.39, 'TH02'),
  ('22', 'spruce', 3, 'spruce-b', 1988.41, 'TH03'),
  ('21', 'spruce', 3, 'spruce-a', 1929.75, 'TH04'),
  ('20', 'spruce', 3, 'spruce-b', 1988.41, 'TH05'),
  ('19', 'spruce', 3, 'spruce-a', 1929.75, 'TH06'),
  ('18', 'spruce', 3, 'spruce-b', 1996.81, 'TH07'),
  ('17', 'spruce', 4, 'spruce-b', 2325.32, 'TH08'),
  ('32', 'spruce', 4, 'spruce-a', 2322.52, 'TH01'),
  ('31', 'spruce', 3, 'spruce-a', 1937.39, 'TH02'),
  ('30', 'spruce', 3, 'spruce-b', 1988.41, 'TH03'),
  ('29', 'spruce', 3, 'spruce-a', 1929.75, 'TH04'),
  ('28', 'spruce', 3, 'spruce-b', 1988.41, 'TH05'),
  ('27', 'spruce', 3, 'spruce-a', 1929.75, 'TH06'),
  ('26', 'spruce', 3, 'spruce-b', 1996.81, 'TH07'),
  ('25', 'spruce', 4, 'spruce-b', 2325.32, 'TH08'),
  ('58', 'spruce', 4, 'spruce-a', 2322.52, 'TH01'),
  ('57', 'spruce', 3, 'spruce-a', 1937.39, 'TH02'),
  ('56', 'spruce', 3, 'spruce-b', 1988.41, 'TH03'),
  ('55', 'spruce', 3, 'spruce-a', 1929.75, 'TH04'),
  ('54', 'spruce', 3, 'spruce-b', 1988.41, 'TH05'),
  ('53', 'spruce', 3, 'spruce-a', 1929.75, 'TH06'),
  ('52', 'spruce', 3, 'spruce-b', 1996.81, 'TH07'),
  ('51', 'spruce', 4, 'spruce-b', 2325.32, 'TH08'),
  ('86', 'spruce', 4, 'spruce-a', 2322.52, 'TH01'),
  ('85', 'spruce', 3, 'spruce-a', 1937.39, 'TH02'),
  ('84', 'spruce', 3, 'spruce-b', 1988.41, 'TH03'),
  ('83', 'spruce', 3, 'spruce-a', 1929.75, 'TH04'),
  ('82', 'spruce', 3, 'spruce-b', 1988.41, 'TH05'),
  ('81', 'spruce', 3, 'spruce-a', 1929.75, 'TH06'),
  ('80', 'spruce', 3, 'spruce-b', 1996.81, 'TH07'),
  ('79', 'spruce', 4, 'spruce-b', 2325.32, 'TH08'),
  ('94', 'spruce', 4, 'spruce-a', 2322.52, 'TH01'),
  ('93', 'spruce', 3, 'spruce-a', 1937.39, 'TH02'),
  ('92', 'spruce', 3, 'spruce-b', 1988.41, 'TH03'),
  ('91', 'spruce', 3, 'spruce-a', 1929.75, 'TH04'),
  ('90', 'spruce', 3, 'spruce-b', 1988.41, 'TH05'),
  ('89', 'spruce', 3, 'spruce-a', 1929.75, 'TH06'),
  ('88', 'spruce', 3, 'spruce-b', 1996.81, 'TH07'),
  ('87', 'spruce', 4, 'spruce-b', 2325.32, 'TH08'),
  ('102', 'spruce', 4, 'spruce-a', 2322.52, 'TH01'),
  ('101', 'spruce', 3, 'spruce-a', 1937.39, 'TH02'),
  ('100', 'spruce', 3, 'spruce-b', 1988.41, 'TH03'),
  ('99', 'spruce', 3, 'spruce-a', 1929.75, 'TH04'),
  ('98', 'spruce', 3, 'spruce-b', 1988.41, 'TH05'),
  ('97', 'spruce', 3, 'spruce-a', 1929.75, 'TH06'),
  ('96', 'spruce', 3, 'spruce-b', 1996.81, 'TH07'),
  ('95', 'spruce', 4, 'spruce-b', 2325.32, 'TH08'),
  ('129', 'spruce', 4, 'spruce-a', 2322.52, 'TH01'),
  ('128', 'spruce', 3, 'spruce-a', 1937.39, 'TH02'),
  ('127', 'spruce', 3, 'spruce-b', 1988.41, 'TH03'),
  ('126', 'spruce', 3, 'spruce-a', 1929.75, 'TH04'),
  ('125', 'spruce', 3, 'spruce-b', 1988.41, 'TH05'),
  ('124', 'spruce', 3, 'spruce-a', 1929.75, 'TH06'),
  ('123', 'spruce', 3, 'spruce-b', 1996.81, 'TH07'),
  ('122', 'spruce', 4, 'spruce-b', 2325.32, 'TH08'),
  ('137', 'spruce', 4, 'spruce-a', 2322.52, 'TH01'),
  ('136', 'spruce', 3, 'spruce-a', 1937.39, 'TH02'),
  ('135', 'spruce', 3, 'spruce-b', 1988.41, 'TH03'),
  ('134', 'spruce', 3, 'spruce-a', 1929.75, 'TH04'),
  ('133', 'spruce', 3, 'spruce-b', 1988.41, 'TH05'),
  ('132', 'spruce', 3, 'spruce-a', 1929.75, 'TH06'),
  ('131', 'spruce', 3, 'spruce-b', 1996.81, 'TH07'),
  ('130', 'spruce', 4, 'spruce-b', 2325.32, 'TH08'),
  ('145', 'spruce', 4, 'spruce-a', 2322.52, 'TH01'),
  ('144', 'spruce', 3, 'spruce-a', 1937.39, 'TH02'),
  ('143', 'spruce', 3, 'spruce-b', 1988.41, 'TH03'),
  ('142', 'spruce', 3, 'spruce-a', 1929.75, 'TH04'),
  ('141', 'spruce', 3, 'spruce-b', 1988.41, 'TH05'),
  ('140', 'spruce', 3, 'spruce-a', 1929.75, 'TH06'),
  ('139', 'spruce', 3, 'spruce-b', 1996.81, 'TH07'),
  ('138', 'spruce', 4, 'spruce-b', 2325.32, 'TH08'),
  ('171', 'spruce', 4, 'spruce-a', 2322.52, 'TH01'),
  ('170', 'spruce', 3, 'spruce-a', 1937.39, 'TH02'),
  ('169', 'spruce', 3, 'spruce-b', 1988.41, 'TH03'),
  ('168', 'spruce', 3, 'spruce-a', 1929.75, 'TH04'),
  ('167', 'spruce', 3, 'spruce-b', 1988.41, 'TH05'),
  ('166', 'spruce', 3, 'spruce-a', 1929.75, 'TH06'),
  ('165', 'spruce', 3, 'spruce-b', 1996.81, 'TH07'),
  ('164', 'spruce', 4, 'spruce-b', 2325.32, 'TH08'),
  ('179', 'spruce', 4, 'spruce-a', 2322.52, 'TH01'),
  ('178', 'spruce', 3, 'spruce-a', 1937.39, 'TH02'),
  ('177', 'spruce', 3, 'spruce-b', 1988.41, 'TH03'),
  ('176', 'spruce', 3, 'spruce-a', 1929.75, 'TH04'),
  ('175', 'spruce', 3, 'spruce-b', 1988.41, 'TH05'),
  ('174', 'spruce', 3, 'spruce-a', 1929.75, 'TH06'),
  ('173', 'spruce', 3, 'spruce-b', 1996.81, 'TH07'),
  ('172', 'spruce', 4, 'spruce-b', 2325.32, 'TH08'),
  ('187', 'spruce', 4, 'spruce-a', 2322.52, 'TH01'),
  ('186', 'spruce', 3, 'spruce-a', 1937.39, 'TH02'),
  ('185', 'spruce', 3, 'spruce-b', 1988.41, 'TH03'),
  ('184', 'spruce', 3, 'spruce-a', 1929.75, 'TH04'),
  ('183', 'spruce', 3, 'spruce-b', 1988.41, 'TH05'),
  ('182', 'spruce', 3, 'spruce-a', 1929.75, 'TH06'),
  ('181', 'spruce', 3, 'spruce-b', 1996.81, 'TH07'),
  ('180', 'spruce', 4, 'spruce-b', 2325.32, 'TH08'),
  ('204', 'spruce', 4, 'spruce-a', 2322.52, 'TH01'),
  ('203', 'spruce', 3, 'spruce-a', 1937.39, 'TH02'),
  ('202', 'spruce', 3, 'spruce-b', 1988.41, 'TH03'),
  ('201', 'spruce', 3, 'spruce-a', 1929.75, 'TH04'),
  ('200', 'spruce', 3, 'spruce-b', 1988.41, 'TH05'),
  ('199', 'spruce', 3, 'spruce-a', 1929.75, 'TH06'),
  ('198', 'spruce', 3, 'spruce-b', 1996.81, 'TH07'),
  ('197', 'spruce', 4, 'spruce-b', 2325.32, 'TH08'),
  ('232', 'spruce', 4, 'spruce-a', 2322.52, 'TH01'),
  ('231', 'spruce', 3, 'spruce-a', 1937.39, 'TH02'),
  ('230', 'spruce', 3, 'spruce-b', 1988.41, 'TH03'),
  ('229', 'spruce', 3, 'spruce-a', 1929.75, 'TH04'),
  ('228', 'spruce', 3, 'spruce-b', 1988.41, 'TH05'),
  ('227', 'spruce', 3, 'spruce-a', 1929.75, 'TH06'),
  ('226', 'spruce', 3, 'spruce-b', 1996.81, 'TH07'),
  ('225', 'spruce', 4, 'spruce-b', 2325.32, 'TH08'),
  ('240', 'spruce', 4, 'spruce-a', 2322.52, 'TH01'),
  ('239', 'spruce', 3, 'spruce-a', 1937.39, 'TH02'),
  ('238', 'spruce', 3, 'spruce-b', 1988.41, 'TH03'),
  ('237', 'spruce', 3, 'spruce-a', 1929.75, 'TH04'),
  ('236', 'spruce', 3, 'spruce-b', 1988.41, 'TH05'),
  ('235', 'spruce', 3, 'spruce-a', 1929.75, 'TH06'),
  ('234', 'spruce', 3, 'spruce-b', 1996.81, 'TH07'),
  ('233', 'spruce', 4, 'spruce-b', 2325.32, 'TH08'),
  ('327', 'spruce', 4, 'spruce-a', 2322.52, 'TH01'),
  ('326', 'spruce', 3, 'spruce-a', 1937.39, 'TH02'),
  ('325', 'spruce', 3, 'spruce-b', 1988.41, 'TH03'),
  ('324', 'spruce', 3, 'spruce-a', 1929.75, 'TH04'),
  ('323', 'spruce', 3, 'spruce-b', 1988.41, 'TH05'),
  ('322', 'spruce', 3, 'spruce-a', 1929.75, 'TH06'),
  ('321', 'spruce', 3, 'spruce-b', 1996.81, 'TH07'),
  ('320', 'spruce', 4, 'spruce-b', 2325.32, 'TH08'),
  ('283', 'spruce', 4, 'spruce-a', 2322.52, 'TH01'),
  ('282', 'spruce', 3, 'spruce-a', 1937.39, 'TH02'),
  ('281', 'spruce', 3, 'spruce-b', 1988.41, 'TH03'),
  ('280', 'spruce', 3, 'spruce-a', 1929.75, 'TH04'),
  ('279', 'spruce', 3, 'spruce-b', 1988.41, 'TH05'),
  ('278', 'spruce', 3, 'spruce-a', 1929.75, 'TH06'),
  ('277', 'spruce', 3, 'spruce-b', 1996.81, 'TH07'),
  ('276', 'spruce', 4, 'spruce-b', 2325.32, 'TH08'),
  ('291', 'spruce', 4, 'spruce-a', 2322.52, 'TH01'),
  ('290', 'spruce', 3, 'spruce-a', 1937.39, 'TH02'),
  ('289', 'spruce', 3, 'spruce-b', 1988.41, 'TH03'),
  ('288', 'spruce', 3, 'spruce-a', 1929.75, 'TH04'),
  ('287', 'spruce', 3, 'spruce-b', 1988.41, 'TH05'),
  ('286', 'spruce', 3, 'spruce-a', 1929.75, 'TH06'),
  ('285', 'spruce', 3, 'spruce-b', 1996.81, 'TH07'),
  ('284', 'spruce', 4, 'spruce-b', 2325.32, 'TH08'),
  ('309', 'spruce', 4, 'spruce-a', 2322.52, 'TH01'),
  ('308', 'spruce', 3, 'spruce-a', 1937.39, 'TH02'),
  ('307', 'spruce', 3, 'spruce-b', 1988.41, 'TH03'),
  ('306', 'spruce', 3, 'spruce-a', 1929.75, 'TH04'),
  ('305', 'spruce', 3, 'spruce-b', 1988.41, 'TH05'),
  ('304', 'spruce', 3, 'spruce-a', 1929.75, 'TH06'),
  ('303', 'spruce', 3, 'spruce-b', 1996.81, 'TH07'),
  ('302', 'spruce', 4, 'spruce-b', 2325.32, 'TH08'),
  ('38', 'iris', 4, 'iris-a', 2336.19, 'TH01'),
  ('37', 'iris', 3, 'iris-a', 2052.03, 'TH02'),
  ('36', 'iris', 3, 'iris-b', 2058.92, 'TH03'),
  ('35', 'iris', 3, 'iris-a', 2051.06, 'TH04'),
  ('34', 'iris', 3, 'iris-b', 2058.38, 'TH05'),
  ('33', 'iris', 4, 'iris-b', 2334.79, 'TH06'),
  ('44', 'iris', 4, 'iris-a', 2336.19, 'TH01'),
  ('43', 'iris', 3, 'iris-a', 2052.03, 'TH02'),
  ('42', 'iris', 3, 'iris-b', 2058.92, 'TH03'),
  ('41', 'iris', 3, 'iris-a', 2051.06, 'TH04'),
  ('40', 'iris', 3, 'iris-b', 2058.38, 'TH05'),
  ('39', 'iris', 4, 'iris-b', 2334.79, 'TH06'),
  ('50', 'iris', 4, 'iris-a', 2336.19, 'TH01'),
  ('49', 'iris', 3, 'iris-a', 2052.03, 'TH02'),
  ('48', 'iris', 3, 'iris-b', 2058.92, 'TH03'),
  ('47', 'iris', 3, 'iris-a', 2051.06, 'TH04'),
  ('46', 'iris', 3, 'iris-b', 2058.38, 'TH05'),
  ('45', 'iris', 4, 'iris-b', 2334.79, 'TH06'),
  ('256', 'iris', 4, 'iris-a', 2336.19, 'TH01'),
  ('255', 'iris', 3, 'iris-a', 2052.03, 'TH02'),
  ('254', 'iris', 3, 'iris-b', 2058.92, 'TH03'),
  ('253', 'iris', 3, 'iris-a', 2051.06, 'TH04'),
  ('252', 'iris', 3, 'iris-b', 2058.38, 'TH05'),
  ('251', 'iris', 4, 'iris-b', 2334.79, 'TH06'),
  ('342', 'iris', 4, 'iris-a', 2336.19, 'TH01'),
  ('341', 'iris', 3, 'iris-a', 2052.03, 'TH02'),
  ('340', 'iris', 3, 'iris-b', 2058.92, 'TH03'),
  ('339', 'iris', 3, 'iris-a', 2051.06, 'TH04'),
  ('338', 'iris', 3, 'iris-b', 2058.38, 'TH05'),
  ('337', 'iris', 4, 'iris-b', 2334.79, 'TH06'),
  ('68', 'iris', 4, 'iris-a', 2335.33, 'TH01'),
  ('67', 'iris', 3, 'iris-a', 2054.18, 'TH02'),
  ('66', 'spruce', 3, 'spruce-c', 2038.68, 'TH03'),
  ('65', 'spruce', 3, 'spruce-d', 1972.48, 'TH04'),
  ('64', 'iris', 3, 'iris-b', 2086.58, 'TH05'),
  ('63', 'iris', 3, 'iris-a', 2081.09, 'TH06'),
  ('62', 'iris', 3, 'iris-b', 2057.73, 'TH07'),
  ('61', 'may_bell', 3, 'may_bell-a', 2028.13, 'TH08'),
  ('60', 'may_bell', 3, 'may_bell-b', 2028.13, 'TH09'),
  ('59', 'iris', 4, 'iris-c', 2336.73, 'TH10'),
  ('78', 'iris', 4, 'iris-a', 2335.33, 'TH01'),
  ('77', 'iris', 3, 'iris-a', 2054.18, 'TH02'),
  ('76', 'spruce', 3, 'spruce-c', 2038.68, 'TH03'),
  ('75', 'spruce', 3, 'spruce-d', 1972.48, 'TH04'),
  ('74', 'iris', 3, 'iris-b', 2086.58, 'TH05'),
  ('73', 'iris', 3, 'iris-a', 2081.09, 'TH06'),
  ('72', 'iris', 3, 'iris-b', 2057.73, 'TH07'),
  ('71', 'may_bell', 3, 'may_bell-a', 2028.13, 'TH08'),
  ('70', 'may_bell', 3, 'may_bell-b', 2028.13, 'TH09'),
  ('69', 'iris', 4, 'iris-c', 2336.73, 'TH10'),
  ('112', 'iris', 4, 'iris-a', 2335.33, 'TH01'),
  ('111', 'iris', 3, 'iris-a', 2054.18, 'TH02'),
  ('110', 'spruce', 3, 'spruce-c', 2038.68, 'TH03'),
  ('109', 'spruce', 3, 'spruce-d', 1972.48, 'TH04'),
  ('108', 'iris', 3, 'iris-b', 2086.58, 'TH05'),
  ('107', 'iris', 3, 'iris-a', 2081.09, 'TH06'),
  ('106', 'iris', 3, 'iris-b', 2057.73, 'TH07'),
  ('105', 'may_bell', 3, 'may_bell-a', 2028.13, 'TH08'),
  ('104', 'may_bell', 3, 'may_bell-b', 2028.13, 'TH09'),
  ('103', 'iris', 4, 'iris-c', 2336.73, 'TH10'),
  ('121', 'may_bell', 4, 'may_bell-a', 2311.11, 'TH01'),
  ('120', 'iris', 3, 'iris-a', 2051.17, 'TH02'),
  ('119', 'iris', 3, 'iris-b', 2058.92, 'TH03'),
  ('118', 'may_bell', 3, 'may_bell-a', 2040.94, 'TH04'),
  ('117', 'may_bell', 3, 'may_bell-a', 2066.13, 'TH05'),
  ('116', 'iris', 3, 'iris-a', 2081.74, 'TH06'),
  ('115', 'iris', 3, 'iris-b', 2058.92, 'TH07'),
  ('114', 'iris', 3, 'iris-a', 2049.87, 'TH08'),
  ('113', 'may_bell', 4, 'may_bell-b', 2310.68, 'TH09'),
  ('154', 'may_bell', 4, 'may_bell-a', 2311.11, 'TH01'),
  ('153', 'iris', 3, 'iris-a', 2051.17, 'TH02'),
  ('152', 'iris', 3, 'iris-b', 2058.92, 'TH03'),
  ('151', 'may_bell', 3, 'may_bell-a', 2040.94, 'TH04'),
  ('150', 'may_bell', 3, 'may_bell-a', 2066.13, 'TH05'),
  ('149', 'iris', 3, 'iris-a', 2081.74, 'TH06'),
  ('148', 'iris', 3, 'iris-b', 2058.92, 'TH07'),
  ('147', 'iris', 3, 'iris-a', 2049.87, 'TH08'),
  ('146', 'may_bell', 4, 'may_bell-b', 2310.68, 'TH09'),
  ('163', 'may_bell', 4, 'may_bell-a', 2311.11, 'TH01'),
  ('162', 'iris', 3, 'iris-a', 2051.17, 'TH02'),
  ('161', 'iris', 3, 'iris-b', 2058.92, 'TH03'),
  ('160', 'may_bell', 3, 'may_bell-a', 2040.94, 'TH04'),
  ('159', 'may_bell', 3, 'may_bell-a', 2066.13, 'TH05'),
  ('158', 'iris', 3, 'iris-a', 2081.74, 'TH06'),
  ('157', 'iris', 3, 'iris-b', 2058.92, 'TH07'),
  ('156', 'iris', 3, 'iris-a', 2049.87, 'TH08'),
  ('155', 'may_bell', 4, 'may_bell-b', 2310.68, 'TH09'),
  ('196', 'may_bell', 4, 'may_bell-a', 2311.11, 'TH01'),
  ('195', 'iris', 3, 'iris-a', 2051.17, 'TH02'),
  ('194', 'iris', 3, 'iris-b', 2058.92, 'TH03'),
  ('193', 'may_bell', 3, 'may_bell-a', 2040.94, 'TH04'),
  ('192', 'may_bell', 3, 'may_bell-a', 2066.13, 'TH05'),
  ('191', 'iris', 3, 'iris-a', 2081.74, 'TH06'),
  ('190', 'iris', 3, 'iris-b', 2058.92, 'TH07'),
  ('189', 'iris', 3, 'iris-a', 2049.87, 'TH08'),
  ('188', 'may_bell', 4, 'may_bell-b', 2310.68, 'TH09'),
  ('214', 'iris', 4, 'iris-a', 2335.33, 'TH01'),
  ('213', 'iris', 3, 'iris-a', 2054.18, 'TH02'),
  ('212', 'spruce', 3, 'spruce-c', 2038.68, 'TH03'),
  ('211', 'spruce', 3, 'spruce-d', 1972.48, 'TH04'),
  ('210', 'iris', 3, 'iris-b', 2086.58, 'TH05'),
  ('209', 'iris', 3, 'iris-a', 2081.09, 'TH06'),
  ('208', 'iris', 3, 'iris-b', 2057.73, 'TH07'),
  ('207', 'may_bell', 3, 'may_bell-a', 2028.13, 'TH08'),
  ('206', 'may_bell', 3, 'may_bell-b', 2028.13, 'TH09'),
  ('205', 'iris', 4, 'iris-c', 2336.73, 'TH10'),
  ('224', 'iris', 4, 'iris-a', 2335.33, 'TH01'),
  ('223', 'iris', 3, 'iris-a', 2054.18, 'TH02'),
  ('222', 'spruce', 3, 'spruce-c', 2038.68, 'TH03'),
  ('221', 'spruce', 3, 'spruce-d', 1972.48, 'TH04'),
  ('220', 'iris', 3, 'iris-b', 2086.58, 'TH05'),
  ('219', 'iris', 3, 'iris-a', 2081.09, 'TH06'),
  ('218', 'iris', 3, 'iris-b', 2057.73, 'TH07'),
  ('217', 'may_bell', 3, 'may_bell-a', 2028.13, 'TH08'),
  ('216', 'may_bell', 3, 'may_bell-b', 2028.13, 'TH09'),
  ('215', 'iris', 4, 'iris-c', 2336.73, 'TH10'),
  ('250', 'iris', 4, 'iris-a', 2335.33, 'TH01'),
  ('249', 'iris', 3, 'iris-a', 2054.18, 'TH02'),
  ('248', 'spruce', 3, 'spruce-c', 2038.68, 'TH03'),
  ('247', 'spruce', 3, 'spruce-d', 1972.48, 'TH04'),
  ('246', 'iris', 3, 'iris-b', 2086.58, 'TH05'),
  ('245', 'iris', 3, 'iris-a', 2081.09, 'TH06'),
  ('244', 'iris', 3, 'iris-b', 2057.73, 'TH07'),
  ('243', 'may_bell', 3, 'may_bell-a', 2028.13, 'TH08'),
  ('242', 'may_bell', 3, 'may_bell-b', 2028.13, 'TH09'),
  ('241', 'iris', 4, 'iris-c', 2336.73, 'TH10'),
  ('265', 'may_bell', 4, 'may_bell-a', 2311.11, 'TH01'),
  ('264', 'iris', 3, 'iris-a', 2051.17, 'TH02'),
  ('263', 'iris', 3, 'iris-b', 2058.92, 'TH03'),
  ('262', 'may_bell', 3, 'may_bell-a', 2040.94, 'TH04'),
  ('261', 'may_bell', 3, 'may_bell-a', 2066.13, 'TH05'),
  ('260', 'iris', 3, 'iris-a', 2081.74, 'TH06'),
  ('259', 'iris', 3, 'iris-b', 2058.92, 'TH07'),
  ('258', 'iris', 3, 'iris-a', 2049.87, 'TH08'),
  ('257', 'may_bell', 4, 'may_bell-b', 2310.68, 'TH09'),
  ('275', 'iris', 4, 'iris-a', 2335.33, 'TH01'),
  ('274', 'iris', 3, 'iris-a', 2054.18, 'TH02'),
  ('273', 'spruce', 3, 'spruce-c', 2038.68, 'TH03'),
  ('272', 'spruce', 3, 'spruce-d', 1972.48, 'TH04'),
  ('271', 'iris', 3, 'iris-b', 2086.58, 'TH05'),
  ('270', 'iris', 3, 'iris-a', 2081.09, 'TH06'),
  ('269', 'iris', 3, 'iris-b', 2057.73, 'TH07'),
  ('268', 'may_bell', 3, 'may_bell-a', 2028.13, 'TH08'),
  ('267', 'may_bell', 3, 'may_bell-b', 2028.13, 'TH09'),
  ('266', 'iris', 4, 'iris-c', 2336.73, 'TH10'),
  ('301', 'iris', 4, 'iris-a', 2335.33, 'TH01'),
  ('300', 'iris', 3, 'iris-a', 2054.18, 'TH02'),
  ('299', 'spruce', 3, 'spruce-c', 2038.68, 'TH03'),
  ('298', 'spruce', 3, 'spruce-d', 1972.48, 'TH04'),
  ('297', 'iris', 3, 'iris-b', 2086.58, 'TH05'),
  ('296', 'iris', 3, 'iris-a', 2081.09, 'TH06'),
  ('295', 'iris', 3, 'iris-b', 2057.73, 'TH07'),
  ('294', 'may_bell', 3, 'may_bell-a', 2028.13, 'TH08'),
  ('293', 'may_bell', 3, 'may_bell-b', 2028.13, 'TH09'),
  ('292', 'iris', 4, 'iris-c', 2336.73, 'TH10'),
  ('319', 'iris', 4, 'iris-a', 2335.33, 'TH01'),
  ('318', 'iris', 3, 'iris-a', 2054.18, 'TH02'),
  ('317', 'spruce', 3, 'spruce-c', 2038.68, 'TH03'),
  ('316', 'spruce', 3, 'spruce-d', 1972.48, 'TH04'),
  ('315', 'iris', 3, 'iris-b', 2086.58, 'TH05'),
  ('314', 'iris', 3, 'iris-a', 2081.09, 'TH06'),
  ('313', 'iris', 3, 'iris-b', 2057.73, 'TH07'),
  ('312', 'may_bell', 3, 'may_bell-a', 2028.13, 'TH08'),
  ('311', 'may_bell', 3, 'may_bell-b', 2028.13, 'TH09'),
  ('310', 'iris', 4, 'iris-c', 2336.73, 'TH10'),
  ('336', 'may_bell', 4, 'may_bell-a', 2311.11, 'TH01'),
  ('335', 'iris', 3, 'iris-a', 2051.17, 'TH02'),
  ('334', 'iris', 3, 'iris-b', 2058.92, 'TH03'),
  ('333', 'may_bell', 3, 'may_bell-a', 2040.94, 'TH04'),
  ('332', 'may_bell', 3, 'may_bell-a', 2066.13, 'TH05'),
  ('331', 'iris', 3, 'iris-a', 2081.74, 'TH06'),
  ('330', 'iris', 3, 'iris-b', 2058.92, 'TH07'),
  ('329', 'iris', 3, 'iris-a', 2049.87, 'TH08'),
  ('328', 'may_bell', 4, 'may_bell-b', 2310.68, 'TH09'),
  ('352', 'iris', 4, 'iris-a', 2335.33, 'TH01'),
  ('351', 'iris', 3, 'iris-a', 2054.18, 'TH02'),
  ('350', 'spruce', 3, 'spruce-c', 2038.68, 'TH03'),
  ('349', 'spruce', 3, 'spruce-d', 1972.48, 'TH04'),
  ('348', 'iris', 3, 'iris-b', 2086.58, 'TH05'),
  ('347', 'iris', 3, 'iris-a', 2081.09, 'TH06'),
  ('346', 'iris', 3, 'iris-b', 2057.73, 'TH07'),
  ('345', 'may_bell', 3, 'may_bell-a', 2028.13, 'TH08'),
  ('344', 'may_bell', 3, 'may_bell-b', 2028.13, 'TH09'),
  ('343', 'iris', 4, 'iris-c', 2336.73, 'TH10'),
  ('362', 'iris', 4, 'iris-a', 2335.33, 'TH01'),
  ('361', 'iris', 3, 'iris-a', 2054.18, 'TH02'),
  ('360', 'spruce', 3, 'spruce-c', 2038.68, 'TH03'),
  ('359', 'spruce', 3, 'spruce-d', 1972.48, 'TH04'),
  ('358', 'iris', 3, 'iris-b', 2086.58, 'TH05'),
  ('357', 'iris', 3, 'iris-a', 2081.09, 'TH06'),
  ('356', 'iris', 3, 'iris-b', 2057.73, 'TH07'),
  ('355', 'may_bell', 3, 'may_bell-a', 2028.13, 'TH08'),
  ('354', 'may_bell', 3, 'may_bell-b', 2028.13, 'TH09'),
  ('353', 'iris', 4, 'iris-c', 2336.73, 'TH10')
) as v(unit_number, facade_style, bedrooms, layout, bua, th_position) on true
join unit_types ut on ut.cluster_id = c.id and ut.bedrooms = v.bedrooms and ut.layout = v.layout
join plexes p on p.cluster_id = c.id and v.unit_number::int between p.range_start and p.range_end
where c.slug = 'eden';

-- ---------- 5. facade_style_descriptions ----------

insert into facade_style_descriptions (cluster_id, style_name, description, confidence, source_id)
select id, 'Spruce',
  'Whether you''re arriving on foot or by car, the sight of SPRUCE is truly special. As its warm and earthy tones welcome you, you will feel grounded in the magic of home.',
  'corroborated', 'a1000000-0000-4000-8000-000000000001'
from clusters where slug = 'eden';

insert into facade_style_descriptions (cluster_id, style_name, description, confidence, source_id)
select id, 'Iris',
  'Picture this — you, parking your car in front of this stunning masterpiece at sunset. The IRIS collection is sleek, light and simply what dreams are made of.',
  'corroborated', 'a1000000-0000-4000-8000-000000000001'
from clusters where slug = 'eden';

insert into facade_style_descriptions (cluster_id, style_name, description, confidence, source_id)
select id, 'May Bell',
  'Imagine waking up at MAY BELL and heading downstairs to your loved ones having breakfast in a sun-soaked sanctuary. Purist and minimal, MAY BELL focuses on what truly matters – family.',
  'corroborated', 'a1000000-0000-4000-8000-000000000001'
from clusters where slug = 'eden';

-- ---------- 6. media + media_links: 15 floor plans + 1 cluster map + 6 style photos ----------
-- Upload eden-floorplans/*.png and *.jpg to the `media` storage bucket
-- under path prefix 'eden/' first (paths below assume that prefix).
-- Floor plans link to their unit_types row (bedrooms + layout match,
-- same join pattern as Section 4). Cluster map links to the cluster
-- itself. Facade/interior promo photos link to their
-- facade_style_descriptions row.

-- 6a. floor plans -> unit_types (one image per unit_types row; ground + first floor combined)
insert into media (storage_path, kind, alt_text, caption, credit)
values
  ('eden/eden-spruce-3br-a.png', 'floorplan', 'Eden Spruce 3-bedroom A floor plan — ground and first floor', 'Spruce 3BR-A floor plan', 'Emaar Properties'),
  ('eden/eden-spruce-3br-b.png', 'floorplan', 'Eden Spruce 3-bedroom B floor plan — ground and first floor', 'Spruce 3BR-B floor plan', 'Emaar Properties'),
  ('eden/eden-spruce-3br-c.png', 'floorplan', 'Eden Spruce 3-bedroom C floor plan — ground and first floor', 'Spruce 3BR-C floor plan', 'Emaar Properties'),
  ('eden/eden-spruce-3br-d.png', 'floorplan', 'Eden Spruce 3-bedroom D floor plan — ground and first floor', 'Spruce 3BR-D floor plan', 'Emaar Properties'),
  ('eden/eden-spruce-4br-a.png', 'floorplan', 'Eden Spruce 4-bedroom A floor plan — ground and first floor', 'Spruce 4BR-A floor plan', 'Emaar Properties'),
  ('eden/eden-spruce-4br-b.png', 'floorplan', 'Eden Spruce 4-bedroom B floor plan — ground and first floor', 'Spruce 4BR-B floor plan', 'Emaar Properties'),
  ('eden/eden-iris-3br-a.png', 'floorplan', 'Eden Iris 3-bedroom A floor plan — ground and first floor', 'Iris 3BR-A floor plan', 'Emaar Properties'),
  ('eden/eden-iris-3br-b.png', 'floorplan', 'Eden Iris 3-bedroom B floor plan — ground and first floor', 'Iris 3BR-B floor plan', 'Emaar Properties'),
  ('eden/eden-iris-4br-a.png', 'floorplan', 'Eden Iris 4-bedroom A floor plan — ground and first floor', 'Iris 4BR-A floor plan', 'Emaar Properties'),
  ('eden/eden-iris-4br-b.png', 'floorplan', 'Eden Iris 4-bedroom B floor plan — ground and first floor', 'Iris 4BR-B floor plan', 'Emaar Properties'),
  ('eden/eden-iris-4br-c.png', 'floorplan', 'Eden Iris 4-bedroom C floor plan — ground and first floor', 'Iris 4BR-C floor plan', 'Emaar Properties'),
  ('eden/eden-may-bell-3br-a.png', 'floorplan', 'Eden May Bell 3-bedroom A floor plan — ground and first floor', 'May Bell 3BR-A floor plan', 'Emaar Properties'),
  ('eden/eden-may-bell-3br-b.png', 'floorplan', 'Eden May Bell 3-bedroom B floor plan — ground and first floor', 'May Bell 3BR-B floor plan', 'Emaar Properties'),
  ('eden/eden-may-bell-4br-a.png', 'floorplan', 'Eden May Bell 4-bedroom A floor plan — ground and first floor', 'May Bell 4BR-A floor plan', 'Emaar Properties'),
  ('eden/eden-may-bell-4br-b.png', 'floorplan', 'Eden May Bell 4-bedroom B floor plan — ground and first floor', 'May Bell 4BR-B floor plan', 'Emaar Properties');

-- Explicit per-row links (filename alone doesn't cleanly encode
-- bedrooms, so it's joined via this values list rather than parsed).
insert into media_links (media_id, subject_type, subject_id, is_primary)
select m.id, 'unit_type', ut.id, true
from media m
join unit_types ut on ut.cluster_id = (select id from clusters where slug = 'eden')
join (values
  ('eden/eden-spruce-3br-a.png', 3, 'spruce-a'),
  ('eden/eden-spruce-3br-b.png', 3, 'spruce-b'),
  ('eden/eden-spruce-3br-c.png', 3, 'spruce-c'),
  ('eden/eden-spruce-3br-d.png', 3, 'spruce-d'),
  ('eden/eden-spruce-4br-a.png', 4, 'spruce-a'),
  ('eden/eden-spruce-4br-b.png', 4, 'spruce-b'),
  ('eden/eden-iris-3br-a.png', 3, 'iris-a'),
  ('eden/eden-iris-3br-b.png', 3, 'iris-b'),
  ('eden/eden-iris-4br-a.png', 4, 'iris-a'),
  ('eden/eden-iris-4br-b.png', 4, 'iris-b'),
  ('eden/eden-iris-4br-c.png', 4, 'iris-c'),
  ('eden/eden-may-bell-3br-a.png', 3, 'may_bell-a'),
  ('eden/eden-may-bell-3br-b.png', 3, 'may_bell-b'),
  ('eden/eden-may-bell-4br-a.png', 4, 'may_bell-a'),
  ('eden/eden-may-bell-4br-b.png', 4, 'may_bell-b')
) as v(storage_path, bedrooms, layout) on v.storage_path = m.storage_path
where ut.bedrooms = v.bedrooms and ut.layout = v.layout;

-- 6b. cluster map -> cluster
insert into media (storage_path, kind, alt_text, caption, credit)
values ('eden/eden-cluster-map.jpg', 'document', 'Eden cluster site plan showing all 362 units color-coded by facade style (Spruce/Iris/May Bell)', 'Eden site plan', 'Emaar Properties');

insert into media_links (media_id, subject_type, subject_id, is_primary)
select m.id, 'cluster', c.id, false
from media m, clusters c
where m.storage_path = 'eden/eden-cluster-map.jpg' and c.slug = 'eden';

-- 6c. facade + interior promo photos -> facade_style_descriptions
insert into media (storage_path, kind, alt_text, caption, credit)
values
  ('eden/eden-spruce-facade.jpg', 'photo', 'Eden Spruce facade exterior render', 'Spruce exterior', 'Emaar Properties'),
  ('eden/eden-spruce-interior.jpg', 'photo', 'Eden Spruce interior render', 'Spruce interior', 'Emaar Properties'),
  ('eden/eden-iris-facade.jpg', 'photo', 'Eden Iris facade exterior render', 'Iris exterior', 'Emaar Properties'),
  ('eden/eden-iris-interior.jpg', 'photo', 'Eden Iris interior render', 'Iris interior', 'Emaar Properties'),
  ('eden/eden-may-bell-facade.jpg', 'photo', 'Eden May Bell facade exterior render', 'May Bell exterior', 'Emaar Properties'),
  ('eden/eden-may-bell-interior.jpg', 'photo', 'Eden May Bell interior render', 'May Bell interior', 'Emaar Properties');

insert into media_links (media_id, subject_type, subject_id, is_primary)
select m.id, 'facade_style_description', fsd.id, (m.storage_path like '%-facade.jpg')
from media m
join facade_style_descriptions fsd on fsd.cluster_id = (select id from clusters where slug = 'eden')
join (values
  ('eden/eden-spruce-facade.jpg', 'Spruce'),
  ('eden/eden-spruce-interior.jpg', 'Spruce'),
  ('eden/eden-iris-facade.jpg', 'Iris'),
  ('eden/eden-iris-interior.jpg', 'Iris'),
  ('eden/eden-may-bell-facade.jpg', 'May Bell'),
  ('eden/eden-may-bell-interior.jpg', 'May Bell')
) as v(storage_path, style_name) on v.storage_path = m.storage_path
where fsd.style_name = v.style_name;
