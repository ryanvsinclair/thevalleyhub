-- 02_clusters.sql — 25 clusters from Doc 1 Annex C
-- source_id: developer for Emaar-sourced cluster register

insert into clusters (
  slug, name, phase, product_type, unit_count, facade_styles, single_row, plex_config,
  handover_actual, handover_target, price_from_aed, positioning, notes,
  confidence, source_id, state, sort_order
) values
-- C.1 Original Valley (12) — published
(
  'eden', 'Eden', 1, 'townhouse', 362,
  array['May Bell','Iris','Spruce'], null, null,
  '2023-11-01', null, null,
  'the only genuinely mature cluster. Delivered 2023, grown-in landscaping, established resident base, direct Golden Beach access. Three facade styles.',
  null, 'corroborated', 'a1000000-0000-4000-8000-000000000001', 'published', 10
),
(
  'nara', 'Nara', 1, 'townhouse', 372,
  array['Aston','Palma','Charm'], true, null,
  '2024-12-01', null, null,
  'the value entry point. Smallest footprints, lowest price, every home single-row with no back-to-back neighbours.',
  null, 'corroborated', 'a1000000-0000-4000-8000-000000000001', 'published', 20
),
(
  'talia', 'Talia', 1, 'townhouse', 330,
  array['Pharo','Cyrus','Elio'], null, null,
  '2025-03-01', null, null,
  'same footprint as Nara; the difference is location. Closest of the early clusters to Golden Beach, Town Centre and Sports Village. Best walkability.',
  null, 'corroborated', 'a1000000-0000-4000-8000-000000000001', 'published', 30
),
(
  'orania', 'Orania', 1, 'townhouse', 308,
  null, true, '43 clusters in 4, 6, 8 and 10-plex rows',
  null, '2025-12-31', null,
  'the layout-choice cluster. 43 clusters across four plex configurations, widest variety of orientation and plot shape. No back-to-back units.',
  'Target was Q4 2025 and is now past. Completion unconfirmed. handover_actual left null.',
  'corroborated', 'a1000000-0000-4000-8000-000000000001', 'published', 40
),
(
  'elora', 'Elora', 1, 'townhouse', 430,
  array['Moon','Mysk'], true, null,
  null, '2026-09-30', null,
  'meaningfully larger 3-bed than the earlier clusters; the floor starts where they peak. All 430 units single-row, every home a corner or end unit.',
  null, 'corroborated', 'a1000000-0000-4000-8000-000000000001', 'published', 50
),
(
  'lillia', 'Lillia', 1, 'townhouse', null,
  array['Jade','Pearl'], true, null,
  null, '2027-03-31', null,
  'largest 3-bed in the original Valley. 3-beds are middle units, 4-beds are corners with a ground-floor bedroom and larger L-shaped garden.',
  null, 'unverified', 'a1000000-0000-4000-8000-000000000001', 'published', 60
),
(
  'nima', 'Nima', 1, 'townhouse', null,
  null, null, null,
  null, null, null,
  null,
  'No published specifications in Doc 1. All specs null (Annex K).',
  'unverified', 'a1000000-0000-4000-8000-000000000001', 'published', 70
),
(
  'elva', 'Elva', 1, 'townhouse', null,
  null, null, null,
  null, null, null,
  'largest townhouse 4-bed and the only cluster publishing plot figures. Genuine outdoor space rather than a strip of garden.',
  'Sources conflict on handover (Q3 2028 vs Q4 2028). handover_target left null.',
  'unverified', 'a1000000-0000-4000-8000-000000000001', 'published', 80
),
(
  'rivana', 'Rivana', 1, 'twin_villa', null,
  null, null, null,
  null, null, null,
  'widest bedroom range at The Valley. Its 3-bed is larger than the biggest 4-bed townhouse.',
  null, 'unverified', 'a1000000-0000-4000-8000-000000000001', 'published', 90
),
(
  'alana', 'Alana', 1, 'twin_villa', null,
  null, null, null,
  null, '2027-06-30', null,
  'the premium twin villa. Ground + 2, full published plot matrix.',
  null, 'unverified', 'a1000000-0000-4000-8000-000000000001', 'published', 100
),
(
  'farm-gardens', 'Farm Gardens', 1, 'villa', 146,
  array['Horizon','Earth'], null, null,
  null, '2026-09-30', null,
  'top of the original Valley. 146 homes only, farm-style landscaping, hydroponics greenhouse, community gardening.',
  null, 'corroborated', 'a1000000-0000-4000-8000-000000000001', 'published', 110
),
(
  'farm-grove', 'Farm Grove', 1, 'villa', 482,
  null, null, null,
  null, '2028-12-31', null,
  'the accessible standalone, set among ghaf trees.',
  'May belong to phase 2; phase set to 1 per Doc 1 with uncertainty noted.',
  'corroborated', 'a1000000-0000-4000-8000-000000000001', 'published', 120
),

-- C.2 Valley 2 (11) — draft
(
  'avena', 'Avena', 2, 'villa', null,
  null, null, null,
  null, '2028-06-30', 4360000,
  null, null, 'corroborated', 'a1000000-0000-4000-8000-000000000001', 'draft', 200
),
(
  'avena-2', 'Avena 2', 2, 'villa', null,
  null, null, null,
  null, null, null,
  null, null, 'unverified', 'a1000000-0000-4000-8000-000000000001', 'draft', 210
),
(
  'rivera', 'Rivera', 2, 'twin_villa', 378,
  null, null, null,
  null, '2029-06-30', null,
  null,
  'price_from_aed conflict: 4,780,000 vs 4,980,000 — left null.',
  'unverified', 'a1000000-0000-4000-8000-000000000001', 'draft', 220
),
(
  'velora', 'Velora', 2, 'townhouse', null,
  null, null, null,
  null, '2028-12-31', 2480000,
  null, null, 'unverified', 'a1000000-0000-4000-8000-000000000001', 'draft', 230
),
(
  'velora-2', 'Velora 2', 2, 'townhouse', null,
  null, null, null,
  null, '2028-09-30', 2930000,
  null, null, 'unverified', 'a1000000-0000-4000-8000-000000000001', 'draft', 240
),
(
  'venera', 'Venera', 2, 'townhouse', null,
  null, null, null,
  null, '2028-12-31', 2480000,
  null, null, 'unverified', 'a1000000-0000-4000-8000-000000000001', 'draft', 250
),
(
  'vindera', 'Vindera', 2, 'townhouse', null,
  null, null, null,
  null, '2029-12-31', 3070000,
  null, null, 'unverified', 'a1000000-0000-4000-8000-000000000001', 'draft', 260
),
(
  'farm-gardens-2', 'Farm Gardens 2', 2, 'villa', null,
  null, null, null,
  null, null, 7260000,
  null,
  'handover_target conflict: Q3 2026 vs Q2 2028 — left null.',
  'unverified', 'a1000000-0000-4000-8000-000000000001', 'draft', 270
),
(
  'farm-grove-2', 'Farm Grove 2', 2, 'villa', null,
  null, null, null,
  null, '2028-12-31', null,
  null, null, 'unverified', 'a1000000-0000-4000-8000-000000000001', 'draft', 280
),
(
  'elea', 'Elea', 2, 'townhouse', null,
  null, null, null,
  null, null, 2990000,
  null,
  'handover_target conflict: Q2 2028 vs Q3 2028 — left null.',
  'unverified', 'a1000000-0000-4000-8000-000000000001', 'draft', 290
),
(
  'kaia', 'Kaia', 2, 'villa', null,
  null, null, null,
  null, '2028-09-30', 2720000,
  null, null, 'unverified', 'a1000000-0000-4000-8000-000000000001', 'draft', 300
),

-- C.3 Valley 3 (2) — draft
(
  'avelia', 'Avelia', 3, null, null,
  null, null, null,
  null, '2029-12-31', null,
  null, null, 'unverified', 'a1000000-0000-4000-8000-000000000001', 'draft', 400
),
(
  'ovelle', 'Ovelle', 3, null, null,
  null, null, null,
  null, null, 8855888,
  null, null, 'unverified', 'a1000000-0000-4000-8000-000000000001', 'draft', 410
);
