-- 04_places.sql — Annex E places directory (47 rows: E.1=7, E.2=7, E.3=8, E.4=3, E.5=4, E.6=4, E.7=7, E.8=7)
-- source_id operator for most rows; developer source only for dubai-outlet-mall (Emaar drive note).
-- drive_verified true only for dubai-outlet-mall (drive_minutes=8). masabih-masjid is draft.

insert into places (
  slug, name, category, subcategory, in_community, operator, address,
  lat, lng, phone, hours, drive_minutes, drive_verified, notes,
  confidence, source_id, state, sort_order
) values
-- E.1 In-community (7)
(
  'medcare-the-valley',
  'Medcare Medical Centre – The Valley',
  'clinic', null, true, 'Medcare',
  'The Valley Pavilion, Al Yufrah 1, Dubai',
  25.015367, 55.454088, '+971 800 6332273',
  '{"mon":{"open":"09:00","close":"22:00"},"tue":{"open":"09:00","close":"22:00"},"wed":{"open":"09:00","close":"22:00"},"thu":{"open":"09:00","close":"22:00"},"fri":{"open":"09:00","close":"22:00"},"sat":{"open":"09:00","close":"22:00"},"sun":{"open":"09:00","close":"22:00"}}'::jsonb,
  null, false,
  'Offers family medicine and physiotherapy.',
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 10
),
(
  'aster-pharmacy-the-valley',
  'Aster Pharmacy – The Valley',
  'pharmacy', null, true, 'Aster',
  'The Valley Pavilion, Al Yufrah 1, Dubai, Shops 11 & 12',
  25.015282, 55.454520, '+971 4 329 1310',
  '{"mon":{"open":"10:00","close":"22:00"},"tue":{"open":"10:00","close":"22:00"},"wed":{"open":"10:00","close":"22:00"},"thu":{"open":"10:00","close":"22:00"},"fri":{"open":"10:00","close":"22:00"},"sat":{"open":"10:00","close":"22:00"},"sun":{"open":"10:00","close":"22:00"}}'::jsonb,
  null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 20
),
(
  'binsina-pharmacy-valley',
  'BinSina Pharmacy Valley',
  'pharmacy', null, true, 'BinSina',
  'The Valley Pavilion, Al Yufrah 1, Dubai',
  25.015445, 55.454578, '+971 4 256 7991',
  '{"mon":{"open":"09:00","close":"23:00"},"tue":{"open":"09:00","close":"23:00"},"wed":{"open":"09:00","close":"23:00"},"thu":{"open":"09:00","close":"23:00"},"fri":{"open":"09:00","close":"23:00"},"sat":{"open":"10:00","close":"22:00"},"sun":{"open":"10:00","close":"22:00"}}'::jsonb,
  null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 30
),
(
  'maple-bear-the-valley',
  'Maple Bear Nursery The Valley',
  'nursery', null, true, 'Maple Bear',
  'The Valley Pavilion, Al Yufrah 1, Dubai, Shops GF13 & 13-1',
  25.015339, 55.454045, '+971 58 156 3537',
  '{"mon":{"open":"08:00","close":"18:00"},"tue":{"open":"08:00","close":"18:00"},"wed":{"open":"08:00","close":"18:00"},"thu":{"open":"08:00","close":"18:00"},"fri":{"open":"08:00","close":"18:00"},"sat":null,"sun":null}'::jsonb,
  null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 40
),
(
  'monoprix-the-valley',
  'Monoprix, The Valley',
  'grocery', null, true, 'Monoprix',
  'The Valley Pavilion, Al Yufrah 1, Dubai',
  25.015355, 55.454559, '+971 4 558 6054',
  '{"mon":{"open":"07:00","close":"23:00"},"tue":{"open":"07:00","close":"23:00"},"wed":{"open":"07:00","close":"23:00"},"thu":{"open":"07:00","close":"23:00"},"fri":{"open":"07:00","close":"23:00"},"sat":{"open":"07:00","close":"23:00"},"sun":{"open":"07:00","close":"23:00"}}'::jsonb,
  null, false,
  'Only in-community grocery; public reviews are mixed (4.1) with recurring comments on fresh bakery availability.',
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 50
),
(
  'emarat-raed',
  'Emarat – Raed',
  'fuel', null, true, 'Emarat',
  null,
  25.016110, 55.455767, '+971 4 832 6099',
  '{"mon":{"open":"00:00","close":"23:59"},"tue":{"open":"00:00","close":"23:59"},"wed":{"open":"00:00","close":"23:59"},"thu":{"open":"00:00","close":"23:59"},"fri":{"open":"00:00","close":"23:59"},"sat":{"open":"00:00","close":"23:59"},"sun":{"open":"00:00","close":"23:59"}}'::jsonb,
  null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 60
),
(
  'masabih-masjid',
  'Masabih Rashid Al Fattan Masjid',
  'mosque', null, true, null,
  null,
  null, null, null,
  null,
  null, false, null,
  'corroborated', 'a1000000-0000-4000-8000-000000000004', 'draft', 70
),

-- E.2 Healthcare nearby (7)
(
  'fakeeh-university-hospital',
  'Fakeeh University Hospital',
  'hospital', null, false, null, null,
  25.122177, 55.386400, '+971 4 414 4444',
  '{"mon":{"open":"00:00","close":"23:59"},"tue":{"open":"00:00","close":"23:59"},"wed":{"open":"00:00","close":"23:59"},"thu":{"open":"00:00","close":"23:59"},"fri":{"open":"00:00","close":"23:59"},"sat":{"open":"00:00","close":"23:59"},"sun":{"open":"00:00","close":"23:59"}}'::jsonb,
  null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 10
),
(
  'aster-clinic-dubailand',
  'Aster Clinic, Dubailand',
  'clinic', null, false, null, null,
  25.091824, 55.384682, '+971 4 440 0500',
  '{"mon":{"open":"08:30","close":"22:00"},"tue":{"open":"08:30","close":"22:00"},"wed":{"open":"08:30","close":"22:00"},"thu":{"open":"08:30","close":"22:00"},"fri":{"open":"08:30","close":"22:00"},"sat":{"open":"08:30","close":"22:00"},"sun":{"open":"08:30","close":"21:00"}}'::jsonb,
  null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 20
),
(
  'saudi-german-clinic-dh2',
  'Saudi German Clinic, DAMAC Hills 2',
  'clinic', 'dental', false, null, null,
  24.997230, 55.383471, '+971 800 2211',
  '{"mon":{"open":"10:00","close":"21:00"},"tue":{"open":"10:00","close":"21:00"},"wed":{"open":"10:00","close":"21:00"},"thu":{"open":"10:00","close":"21:00"},"fri":{"open":"10:00","close":"21:00"},"sat":{"open":"10:00","close":"21:00"},"sun":{"open":"10:00","close":"21:00"}}'::jsonb,
  null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 30
),
(
  'medcare-damac-hills',
  'Medcare Medical Centre – DAMAC Hills',
  'clinic', null, false, null, null,
  25.016995, 55.247357, '+971 800 6332273',
  '{"mon":{"open":"09:00","close":"21:00"},"tue":{"open":"09:00","close":"21:00"},"wed":{"open":"09:00","close":"21:00"},"thu":{"open":"09:00","close":"21:00"},"fri":{"open":"09:00","close":"21:00"},"sat":{"open":"09:00","close":"21:00"},"sun":{"open":"09:00","close":"21:00"}}'::jsonb,
  null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 40
),
(
  'medcare-arabian-ranches-3',
  'Medcare Medical Centre – Arabian Ranches 3',
  'clinic', null, false, null, null,
  25.069450, 55.323083, '+971 800 6332273',
  '{"mon":{"open":"09:00","close":"22:00"},"tue":{"open":"09:00","close":"22:00"},"wed":{"open":"09:00","close":"22:00"},"thu":{"open":"09:00","close":"22:00"},"fri":{"open":"09:00","close":"22:00"},"sat":{"open":"09:00","close":"22:00"},"sun":{"open":"09:00","close":"22:00"}}'::jsonb,
  null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 50
),
(
  'saudi-german-clinic-damac-hills',
  'Saudi German Clinic, DAMAC Hills',
  'clinic', null, false, null, null,
  25.019034, 55.245667, '+971 800 2211',
  '{"mon":{"open":"10:00","close":"20:00"},"tue":{"open":"10:00","close":"20:00"},"wed":{"open":"10:00","close":"20:00"},"thu":{"open":"10:00","close":"20:00"},"fri":{"open":"10:00","close":"18:00"},"sat":{"open":"10:00","close":"20:00"},"sun":{"open":"10:00","close":"20:00"}}'::jsonb,
  null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 60
),
(
  'medcare-town-square',
  'Medcare Medical Centre, Town Square',
  'clinic', null, false, null, null,
  25.006551, 55.295336, '+971 800 6332273',
  '{"mon":{"open":"09:00","close":"21:00"},"tue":{"open":"09:00","close":"21:00"},"wed":{"open":"09:00","close":"21:00"},"thu":{"open":"09:00","close":"21:00"},"fri":{"open":"09:00","close":"21:00"},"sat":{"open":"09:00","close":"21:00"},"sun":{"open":"09:00","close":"21:00"}}'::jsonb,
  null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 70
),

-- E.3 Schools (8) — hours null; no drive times
(
  'gems-firstpoint-school',
  'GEMS FirstPoint School',
  'school', 'British', false, null, null,
  25.089368, 55.375475, '+971 4 278 9700',
  null, null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 10
),
(
  'the-aquila-school',
  'The Aquila School',
  'school', 'British', false, null, null,
  25.089334, 55.383180, '+971 4 586 2700',
  null, null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 20
),
(
  'vernus-international-school',
  'Vernus International School',
  'school', 'American', false, null, null,
  25.123406, 55.402590, '+971 4 320 8000',
  null, null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 30
),
(
  'gems-wellington-academy-dso',
  'GEMS Wellington Academy',
  'school', 'British', false, null, null,
  25.118119, 55.388107, '+971 4 515 9000',
  null, null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 40
),
(
  'dunecrest-american-school',
  'Dunecrest American School',
  'school', 'American', false, null, null,
  25.090882, 55.306521, '+971 4 508 7444',
  null, null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 50
),
(
  'gems-winchester-school',
  'GEMS Winchester School',
  'school', 'Indian/British', false, null, null,
  25.080880, 55.331792, '+971 4 595 2555',
  null, null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 60
),
(
  'ranches-primary-school',
  'Ranches Primary School',
  'school', 'British primary', false, null, null,
  25.029586, 55.271662, '+971 4 442 9765',
  null, null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 70
),
(
  'jess-arabian-ranches',
  'JESS Arabian Ranches',
  'school', 'British', false, null, null,
  25.057162, 55.272546, '+971 4 361 9019',
  null, null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 80
),

-- E.4 Nurseries nearby (3)
(
  'cherry-tree-nursery-dh2',
  'Cherry Tree Nursery – DAMAC Hills 2',
  'nursery', null, false, null, null,
  24.997160, 55.383570, '+971 4 399 9169',
  '{"mon":{"open":"07:45","close":"17:30"},"tue":{"open":"07:45","close":"17:30"},"wed":{"open":"07:45","close":"17:30"},"thu":{"open":"07:45","close":"17:30"},"fri":{"open":"07:45","close":"17:30"}}'::jsonb,
  null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 10
),
(
  'emirates-british-nursery-dso',
  'Emirates British Nursery – DSO',
  'nursery', null, false, null, null,
  25.128367, 55.397266, '+971 4 342 3399',
  '{"mon":{"open":"07:30","close":"17:30"},"tue":{"open":"07:30","close":"17:30"},"wed":{"open":"07:30","close":"17:30"},"thu":{"open":"07:30","close":"17:30"},"fri":{"open":"07:30","close":"17:30"}}'::jsonb,
  null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 20
),
(
  'british-orchard-nursery-dso',
  'British Orchard Nursery – DSO',
  'nursery', null, false, null, null,
  25.116529, 55.389851, '+971 4 388 6602',
  '{"mon":{"open":"07:00","close":"18:00"},"tue":{"open":"07:00","close":"18:00"},"wed":{"open":"07:00","close":"18:00"},"thu":{"open":"07:00","close":"18:00"},"fri":{"open":"07:00","close":"18:00"},"sat":{"open":"09:00","close":"16:00"}}'::jsonb,
  null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 30
),

-- E.5 Veterinary (4)
(
  '2feet4paws',
  '2Feet4Paws (& Exotics) Veterinary Clinic',
  'vet', null, false, null, null,
  25.091163, 55.384293, '+971 4 552 0213',
  '{"mon":{"open":"08:00","close":"20:00"},"tue":{"open":"08:00","close":"20:00"},"wed":{"open":"08:00","close":"20:00"},"thu":{"open":"08:00","close":"20:00"},"fri":{"open":"08:00","close":"20:00"},"sat":{"open":"09:00","close":"17:00"},"sun":{"open":"09:00","close":"17:00"}}'::jsonb,
  null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 10
),
(
  'pet-bond-veterinary',
  'Pet Bond Veterinary Clinic',
  'vet', null, false, null, null,
  25.016297, 55.247793, '+971 56 272 7225',
  '{"mon":{"open":"09:00","close":"21:00"},"tue":{"open":"09:00","close":"21:00"},"wed":{"open":"09:00","close":"21:00"},"thu":{"open":"09:00","close":"21:00"},"fri":{"open":"09:00","close":"21:00"},"sat":{"open":"09:00","close":"21:00"},"sun":{"open":"09:00","close":"21:00"}}'::jsonb,
  null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 20
),
(
  'little-hearts-veterinary',
  'Little Hearts Veterinary Clinic',
  'vet', null, false, null, null,
  25.013089, 55.251180, '+971 4 321 4430',
  '{"mon":{"open":"09:30","close":"20:00"},"tue":{"open":"09:30","close":"20:00"},"wed":{"open":"09:30","close":"20:00"},"thu":{"open":"09:30","close":"20:00"},"fri":{"open":"09:30","close":"20:00"},"sat":{"open":"09:30","close":"20:00"},"sun":{"open":"11:00","close":"20:00"}}'::jsonb,
  null, false,
  'Handles pet travel documentation.',
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 30
),
(
  'vet-clinic-uae-town-square',
  'Vet Clinic UAE – Town Square',
  'vet', null, false, null, null,
  25.005252, 55.297094, '+971 4 614 7058',
  '{"mon":{"open":"08:00","close":"23:00"},"tue":{"open":"08:00","close":"23:00"},"wed":{"open":"08:00","close":"23:00"},"thu":{"open":"08:00","close":"23:00"},"fri":{"open":"08:00","close":"23:00"},"sat":{"open":"08:00","close":"23:00"},"sun":{"open":"08:00","close":"23:00"}}'::jsonb,
  null, false,
  'Latest closing in the corridor.',
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 40
),

-- E.6 Optical (4)
(
  'yateem-optician-dso',
  'Yateem Optician',
  'optical', null, false, null, null,
  25.111582, 55.374885, '+971 4 283 3862',
  '{"mon":{"open":"10:00","close":"22:00"},"tue":{"open":"10:00","close":"22:00"},"wed":{"open":"10:00","close":"22:00"},"thu":{"open":"10:00","close":"23:00"},"fri":{"open":"10:00","close":"23:00"},"sat":{"open":"10:00","close":"23:00"},"sun":{"open":"10:00","close":"23:00"}}'::jsonb,
  null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 10
),
(
  'reliable-eyecare-optics',
  'Reliable Eyecare Optics – RTA Eye Test Centre',
  'optical', null, false, null, null,
  25.119313, 55.395563, '+971 58 949 1810',
  '{"mon":{"open":"10:00","close":"22:00"},"tue":{"open":"10:00","close":"22:00"},"wed":{"open":"10:00","close":"22:00"},"thu":{"open":"10:00","close":"23:00"},"fri":{"open":"10:00","close":"23:00"},"sat":{"open":"10:00","close":"23:00"},"sun":{"open":"10:00","close":"22:00"}}'::jsonb,
  null, false,
  'RTA-approved eye test centre for driving licence renewal.',
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 20
),
(
  'gulf-optic-dso',
  'Gulf Optic Silicon Oasis',
  'optical', null, false, null, null,
  25.112141, 55.375004, '+971 4 834 7401',
  '{"mon":{"open":"10:00","close":"22:00"},"tue":{"open":"10:00","close":"22:00"},"wed":{"open":"10:00","close":"22:00"},"thu":{"open":"10:00","close":"22:00"},"fri":{"open":"10:00","close":"22:00"},"sat":{"open":"10:00","close":"22:00"},"sun":{"open":"10:00","close":"22:00"}}'::jsonb,
  null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 30
),
(
  'al-jaber-optical-dso',
  'Al Jaber Optical – Dubai Silicon Oasis',
  'optical', null, false, null, null,
  25.110939, 55.374907, '+971 4 261 4762',
  '{"mon":{"open":"10:00","close":"22:00"},"tue":{"open":"10:00","close":"22:00"},"wed":{"open":"10:00","close":"22:00"},"thu":{"open":"10:00","close":"23:00"},"fri":{"open":"10:00","close":"23:00"},"sat":{"open":"10:00","close":"23:00"},"sun":{"open":"10:00","close":"23:00"}}'::jsonb,
  null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 40
),

-- E.7 Salon, spa, gym (7) — hours not in Doc 1
(
  'le-vendome-dh2',
  'Le Vendôme Ladies Beauty Lounge',
  'salon', null, false, null, null,
  24.997836, 55.383104, '+971 4 567 1596',
  null, null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 10
),
(
  'zendaya-beauty-lounge',
  'Zendaya Beauty Lounge',
  'salon', null, false, null, null,
  24.984259, 55.392210, '+971 4 267 8868',
  null, null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 20
),
(
  '4her-ladies-salon',
  '4Her Ladies Salon',
  'salon', null, false, null, null,
  25.018788, 55.246138, '+971 58 616 3630',
  null, null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 30
),
(
  'epure-wellness-spa',
  'Epure Wellness & Spa',
  'spa', null, false, null, null,
  24.984784, 55.393624, '+971 55 344 5742',
  null, null, false,
  'Women only; hammam available.',
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 40
),
(
  'dreamworks-spa-damac-hills',
  'Dreamworks Spa, Radisson DAMAC Hills',
  'spa', null, false, null, null,
  25.018866, 55.246212, '+971 4 879 1144',
  null, null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 50
),
(
  'the-training-room-dh2',
  'The Training Room',
  'gym', null, false, null, null,
  24.997267, 55.383367, '+971 56 879 3270',
  null, null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 60
),
(
  'elvt-fitness-dh2',
  'ELVT Fitness',
  'gym', null, false, null, null,
  24.997286, 55.383359, '+971 58 500 5962',
  null, null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 70
),

-- E.8 Fuel and retail (7)
(
  'enoc-1071',
  'ENOC 1071 – Dubai Al Ain Road',
  'fuel', null, false, null, null,
  25.055085, 55.418790, null,
  '{"mon":{"open":"00:00","close":"23:59"},"tue":{"open":"00:00","close":"23:59"},"wed":{"open":"00:00","close":"23:59"},"thu":{"open":"00:00","close":"23:59"},"fri":{"open":"00:00","close":"23:59"},"sat":{"open":"00:00","close":"23:59"},"sun":{"open":"00:00","close":"23:59"}}'::jsonb,
  null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 10
),
(
  'enoc-50',
  'ENOC 50 – Dubai Al Ain Road',
  'fuel', null, false, null, null,
  24.958780, 55.497589, null,
  '{"mon":{"open":"00:00","close":"23:59"},"tue":{"open":"00:00","close":"23:59"},"wed":{"open":"00:00","close":"23:59"},"thu":{"open":"00:00","close":"23:59"},"fri":{"open":"00:00","close":"23:59"},"sat":{"open":"00:00","close":"23:59"},"sun":{"open":"00:00","close":"23:59"}}'::jsonb,
  null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 20
),
(
  'eppco-49',
  'EPPCO 49 – Al Ain Road DSO',
  'fuel', null, false, null, null,
  25.109421, 55.374924, null,
  '{"mon":{"open":"00:00","close":"23:59"},"tue":{"open":"00:00","close":"23:59"},"wed":{"open":"00:00","close":"23:59"},"thu":{"open":"00:00","close":"23:59"},"fri":{"open":"00:00","close":"23:59"},"sat":{"open":"00:00","close":"23:59"},"sun":{"open":"00:00","close":"23:59"}}'::jsonb,
  null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 30
),
(
  'dubai-outlet-mall',
  'Dubai Outlet Mall',
  'mall', null, false, null, null,
  25.072599, 55.400175, null,
  '{"mon":{"open":"10:00","close":"22:00"},"tue":{"open":"10:00","close":"22:00"},"wed":{"open":"10:00","close":"22:00"},"thu":{"open":"10:00","close":"22:00"},"fri":{"open":"10:00","close":"22:00"},"sat":{"open":"10:00","close":"22:00"},"sun":{"open":"10:00","close":"22:00"}}'::jsonb,
  8, true, null,
  'official', 'a1000000-0000-4000-8000-000000000001', 'published', 40
),
(
  'dubai-hills-mall',
  'Dubai Hills Mall',
  'mall', null, false, null, null,
  25.101694, 55.239938, null,
  null, null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 50
),
(
  'mall-of-the-emirates',
  'Mall of the Emirates',
  'mall', null, false, null, null,
  25.118107, 55.200608, null,
  null, null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 60
),
(
  'dubai-mall',
  'Dubai Mall',
  'mall', null, false, null, null,
  25.197230, 55.279747, null,
  null, null, false, null,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published', 70
);
