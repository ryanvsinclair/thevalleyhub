-- 08_questions.sql — Annex I: all 52 launch questions
-- Facts only from Doc 1. state=published. sort_order = question# * 10.
-- source_id: developer (most), operator (service place Q17–32), portal (market Q50–52).

insert into questions (
  slug, question, answer_short, answer_long, audience, topic,
  cluster_id, place_id, is_generated, sort_order, confidence, source_id, state
) values

-- ========== Basics — audience both (Q1–10) ==========
(
  'who-developed-the-valley',
  'Who is the developer of The Valley?',
  'The Valley is developed by Emaar Properties.',
  $md$The Valley is developed by **Emaar Properties**. Community management is by Emaar Community Management (ECM).$md$,
  'both', 'basics',
  null, null, false, 10,
  'official', 'a1000000-0000-4000-8000-000000000001', 'published'
),
(
  'where-is-the-valley',
  'Where exactly is The Valley located?',
  'The Valley is on the Dubai–Al Ain Road (E66), at the E66/E77 junction.',
  $md$The Valley sits on the **Dubai–Al Ain Road (E66)**, at the **E66/E77 junction**.

The DLD / Ejari community name is **Al Yufrah 1**.$md$,
  'both', 'basics',
  null, null, false, 20,
  'official', 'a1000000-0000-4000-8000-000000000001', 'published'
),
(
  'is-the-valley-freehold',
  'Is The Valley freehold?',
  'Yes. Tenure is freehold for all nationalities.',
  $md$Yes. The Valley is **freehold**, available to **all nationalities**.$md$,
  'both', 'basics',
  null, null, false, 30,
  'corroborated', 'a1000000-0000-4000-8000-000000000001', 'published'
),
(
  'property-types-in-the-valley',
  'What types of property are in The Valley?',
  'The master plan covers townhouses, twin villas and standalone villas, in a 3- to 5-bedroom range.',
  $md$Product types in the master plan are:

- **Townhouse**
- **Twin villa**
- **Standalone villa**

Bedroom range is **3 to 5**.$md$,
  'both', 'basics',
  null, null, false, 40,
  'official', 'a1000000-0000-4000-8000-000000000001', 'published'
),
(
  'are-there-apartments-in-the-valley',
  'Are there apartments in The Valley?',
  'No. There are no apartments in the master plan.',
  $md$**No.** There are **none in the master plan**.

Portal listings that show apartments in The Valley are mis-tagged and should not be treated as product.$md$,
  'both', 'basics',
  null, null, false, 50,
  'official', 'a1000000-0000-4000-8000-000000000001', 'published'
),
(
  'how-big-is-the-valley',
  'How big is The Valley?',
  'The Valley is 200+ hectares / 2,000,000+ sqm.',
  $md$Total area is **200+ hectares** / **2,000,000+ sqm**.$md$,
  'both', 'basics',
  null, null, false, 60,
  'corroborated', 'a1000000-0000-4000-8000-000000000001', 'published'
),
(
  'when-did-the-valley-launch',
  'When did The Valley launch?',
  'The master launch was November 2019.',
  $md$The Valley’s master launch was **November 2019**.$md$,
  'both', 'basics',
  null, null, false, 70,
  'corroborated', 'a1000000-0000-4000-8000-000000000001', 'published'
),
(
  'is-the-valley-gated',
  'Is The Valley a gated community?',
  'Yes. It is gated with 24-hour security.',
  $md$Yes. The Valley is **gated**, with **24-hour security**.$md$,
  'both', 'basics',
  null, null, false, 80,
  'corroborated', 'a1000000-0000-4000-8000-000000000001', 'published'
),
(
  'parking-in-the-valley',
  'How many parking spaces does each home get?',
  'Each home has two parking spaces.',
  $md$Parking is **two spaces per home**.$md$,
  'both', 'basics',
  null, null, false, 90,
  'corroborated', 'a1000000-0000-4000-8000-000000000001', 'published'
),
(
  'ejari-community-name-the-valley',
  'What community name do I use for Ejari and DEWA?',
  'Use Al Yufrah 1 — the DLD / Ejari community name.',
  $md$For Ejari and DEWA, use **Al Yufrah 1** — the official DLD / Ejari community name.$md$,
  'both', 'basics',
  null, null, false, 100,
  'official', 'a1000000-0000-4000-8000-000000000001', 'published'
),

-- ========== Amenities — audience both (Q11–16) — specified/planned only ==========
(
  'what-amenities-does-the-valley-have',
  'What amenities does The Valley have?',
  'The master plan specifies a Town Centre, Golden Beach, Sports Village, Kids’ Dale, pocket parks, The Pavilion, a pet park, and jogging and cycling tracks. Operational status is not confirmed.',
  $md$Emaar’s community page specifies these masterplan amenities (sizes where published):

| Amenity | Size | Specified contents |
|---|---|---|
| Town Centre | 32,000 sqm | Indoor/outdoor retail, cafés, boutiques, alfresco dining, farmers’ market |
| Golden Beach | 47,000 sqm | Beach lagoon, sandy shore, water activities, splash park, F&B |
| Sports Village | 25,000 sqm | Sports courts, playground, outdoor gym, bicycle and running tracks |
| Kids’ Dale | 13,000 sqm | Rock climbing, amphitheatre, archaeological play zones |
| Pocket Parks | 3,000 sqm | Green pockets through clusters |
| The Pavilion | — | Zen garden, oasis garden, observation tower, maze |
| Pet Park | — | Dedicated pet area |
| Jogging trails | — | Throughout community |
| Cycling tracks | — | Throughout community |

**These are specified / planned.** Operational status is unknown for all of the above; do not treat them as confirmed open.$md$,
  'both', 'amenities',
  null, null, false, 110,
  'official', 'a1000000-0000-4000-8000-000000000001', 'published'
),
(
  'golden-beach-the-valley',
  'What is Golden Beach at The Valley?',
  'Golden Beach is a specified 47,000 sqm beach lagoon with sandy shore, water activities, splash park and F&B. It is planned, not confirmed open.',
  $md$**Golden Beach** is specified at **47,000 sqm**, with beach lagoon, sandy shore, water activities, splash park and F&B (Emaar community page).

This is **planned / specified**. Operational status is unknown — do not assume it is open.$md$,
  'both', 'amenities',
  null, null, false, 120,
  'official', 'a1000000-0000-4000-8000-000000000001', 'published'
),
(
  'kids-dale-the-valley',
  'What is Kids’ Dale?',
  'Kids’ Dale is a specified 13,000 sqm kids’ area with rock climbing, an amphitheatre and archaeological play zones. Planned, not confirmed open.',
  $md$**Kids’ Dale** is specified at **13,000 sqm**, with rock climbing, amphitheatre and archaeological play zones (Emaar community page).

This is **planned / specified**. Operational status is unknown.$md$,
  'both', 'amenities',
  null, null, false, 130,
  'official', 'a1000000-0000-4000-8000-000000000001', 'published'
),
(
  'sports-village-the-valley',
  'What''s in the Sports Village?',
  'Sports Village is specified at 25,000 sqm with sports courts, playground, outdoor gym, and bicycle and running tracks. Planned, not confirmed open.',
  $md$**Sports Village** is specified at **25,000 sqm**, with sports courts, playground, outdoor gym, and bicycle and running tracks (Emaar community page).

This is **planned / specified**. Operational status is unknown.$md$,
  'both', 'amenities',
  null, null, false, 140,
  'official', 'a1000000-0000-4000-8000-000000000001', 'published'
),
(
  'town-centre-the-valley',
  'What''s in the Town Centre?',
  'Town Centre is specified at 32,000 sqm with indoor/outdoor retail, cafés, boutiques, alfresco dining and a farmers’ market. Planned, not confirmed open.',
  $md$**Town Centre** is specified at **32,000 sqm**, with indoor/outdoor retail, cafés, boutiques, alfresco dining and a farmers’ market (Emaar community page).

This is **planned / specified**. Operational status is unknown.

Separately, in-community retail and services at The Pavilion (clinic, pharmacies, nursery, grocery) are documented as trading — that is distinct from the Town Centre amenity programme.$md$,
  'both', 'amenities',
  null, null, false, 150,
  'official', 'a1000000-0000-4000-8000-000000000001', 'published'
),
(
  'is-the-valley-pet-friendly',
  'Is The Valley pet friendly?',
  'The master plan specifies a dedicated Pet Park. That amenity is planned; operational status is not confirmed.',
  $md$Emaar’s community page specifies a **Pet Park** — a dedicated pet area.

Like other masterplan amenities, this is **planned / specified**. Operational status is unknown.

There is no in-community vet; nearby veterinary clinics are listed separately in the places directory.$md$,
  'both', 'amenities',
  null, null, false, 160,
  'official', 'a1000000-0000-4000-8000-000000000001', 'published'
),

-- ========== Services in community — audience both (Q17–24) ==========
(
  'pharmacy-in-the-valley',
  'Is there a pharmacy in The Valley?',
  'Yes. Aster Pharmacy and BinSina Pharmacy both trade at The Valley Pavilion.',
  $md$Yes. Two pharmacies are at **The Valley Pavilion, Al Yufrah 1**:

- **Aster Pharmacy – The Valley** (Shops 11 & 12) — +971 4 329 1310; 10:00–22:00 all 7 days
- **BinSina Pharmacy Valley** — +971 4 256 7991; Mon–Fri 09:00–23:00, Sat–Sun 10:00–22:00$md$,
  'both', 'services',
  null, (select id from places where slug = 'aster-pharmacy-the-valley'), false, 170,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published'
),
(
  'doctor-clinic-in-the-valley',
  'Is there a doctor or clinic in The Valley?',
  'Yes. Medcare Medical Centre – The Valley is at The Pavilion and offers family medicine.',
  $md$Yes. **Medcare Medical Centre – The Valley** is at The Valley Pavilion, Al Yufrah 1.

- Phone: +971 800 6332273
- Hours: 09:00–22:00 all 7 days
- Notes: offers family medicine and physiotherapy$md$,
  'both', 'services',
  null, (select id from places where slug = 'medcare-the-valley'), false, 180,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published'
),
(
  'nursery-in-the-valley',
  'Is there a nursery in The Valley?',
  'Yes. Maple Bear Nursery The Valley is at The Pavilion (Shops GF13 & 13-1).',
  $md$Yes. **Maple Bear Nursery The Valley** is at The Valley Pavilion, Al Yufrah 1, Shops GF13 & 13-1.

- Phone: +971 58 156 3537
- Hours: Mon–Fri 08:00–18:00; Sat–Sun closed$md$,
  'both', 'services',
  null, (select id from places where slug = 'maple-bear-the-valley'), false, 190,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published'
),
(
  'supermarket-in-the-valley',
  'Is there a supermarket in The Valley?',
  'Yes. Monoprix at The Pavilion is the only in-community grocery.',
  $md$Yes. **Monoprix, The Valley** at The Valley Pavilion is the only in-community grocery.

- Phone: +971 4 558 6054
- Hours: 07:00–23:00 all 7 days
- Notes: public reviews are mixed (4.1) with recurring comments on fresh bakery availability$md$,
  'both', 'services',
  null, (select id from places where slug = 'monoprix-the-valley'), false, 200,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published'
),
(
  'mosque-in-the-valley',
  'Is there a mosque in The Valley?',
  'Yes. Masabih Rashid Al Fattan Masjid is listed in-community; hours and coordinates are not yet published in our reference.',
  $md$Yes. **Masabih Rashid Al Fattan Masjid** is listed as in-community.

Coordinates, phone and hours are not in the reference (known gap). Treat operational detail as incomplete until verified.$md$,
  'both', 'services',
  null, (select id from places where slug = 'masabih-masjid'), false, 210,
  'corroborated', 'a1000000-0000-4000-8000-000000000004', 'published'
),
(
  'petrol-station-near-the-valley',
  'Where is the nearest petrol station?',
  'Emarat – Raed is in-community and open 24 hours. Additional ENOC/EPPCO stations are on the Al Ain Road corridor.',
  $md$**In-community:** **Emarat – Raed** — +971 4 832 6099; 24 hours.

**Nearby on the corridor** (drive times not verified):

- ENOC 1071 – Dubai Al Ain Road (24 hours)
- ENOC 50 – Dubai Al Ain Road (24 hours)
- EPPCO 49 – Al Ain Road DSO (24 hours)$md$,
  'both', 'services',
  null, (select id from places where slug = 'emarat-raed'), false, 220,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published'
),
(
  'physiotherapy-in-the-valley',
  'Is there physiotherapy in The Valley?',
  'Yes. Medcare Medical Centre – The Valley offers physiotherapy alongside family medicine.',
  $md$Yes. **Medcare Medical Centre – The Valley** (The Pavilion) offers **physiotherapy** as well as family medicine.

- Phone: +971 800 6332273
- Hours: 09:00–22:00 all 7 days$md$,
  'both', 'services',
  null, (select id from places where slug = 'medcare-the-valley'), false, 230,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published'
),
(
  'whats-open-late-in-the-valley',
  'What''s open late in The Valley?',
  null,
  null,
  'both', 'services',
  null, null, true, 240,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published'
),

-- ========== Services nearby — audience both (Q25–32) ==========
(
  'is-there-a-school-in-the-valley',
  'Is there a school in The Valley?',
  'No. There is no school inside The Valley. Nearby schools are listed separately; we do not publish school drive times.',
  $md$**No.** There is no school inside The Valley.

Nearby schools (British, American and Indian/British curricula) are documented in the places directory — including GEMS FirstPoint, The Aquila School, Vernus International, GEMS Wellington Academy (DSO), Dunecrest American, GEMS Winchester, Ranches Primary and JESS Arabian Ranches.

**No school drive times** are published in this reference.$md$,
  'both', 'services',
  null, null, false, 250,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published'
),
(
  'schools-near-the-valley',
  'What schools are near The Valley?',
  'Several British, American and Indian/British schools are nearby; we list them without drive times.',
  $md$Schools in the directory (no drive times published):

| School | Curriculum | Phone |
|---|---|---|
| GEMS FirstPoint School | British | +971 4 278 9700 |
| The Aquila School | British | +971 4 586 2700 |
| Vernus International School | American | +971 4 320 8000 |
| GEMS Wellington Academy | British | +971 4 515 9000 |
| Dunecrest American School | American | +971 4 508 7444 |
| GEMS Winchester School | Indian/British | +971 4 595 2555 |
| Ranches Primary School | British primary | +971 4 442 9765 |
| JESS Arabian Ranches | British | +971 4 361 9019 |

There is **no school inside** The Valley.$md$,
  'both', 'services',
  null, (select id from places where slug = 'gems-firstpoint-school'), false, 260,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published'
),
(
  'nearest-hospital-to-the-valley',
  'Where is the nearest hospital?',
  'Fakeeh University Hospital is the hospital listed in our nearby healthcare directory (24 hours). Drive time is not verified.',
  $md$**Fakeeh University Hospital** is the hospital entry in the nearby healthcare directory.

- Phone: +971 4 414 4444
- Hours: 24 hours
- Drive minutes: not verified in this reference

Additional clinics nearby include Aster Clinic (Dubailand), Saudi German clinics, and several Medcare centres.$md$,
  'both', 'services',
  null, (select id from places where slug = 'fakeeh-university-hospital'), false, 270,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published'
),
(
  'vet-near-the-valley',
  'Is there a vet in The Valley?',
  'No. There is no vet inside The Valley. Nearby clinics include 2Feet4Paws, Pet Bond, Little Hearts and Vet Clinic UAE (Town Square).',
  $md$**No.** There is no veterinary clinic inside The Valley.

Nearby options in the directory:

| Clinic | Phone | Hours |
|---|---|---|
| 2Feet4Paws (& Exotics) Veterinary Clinic | +971 4 552 0213 | Mon–Fri 08:00–20:00; Sat–Sun 09:00–17:00 |
| Pet Bond Veterinary Clinic | +971 56 272 7225 | 09:00–21:00 all 7 days |
| Little Hearts Veterinary Clinic | +971 4 321 4430 | Mon–Sat 09:30–20:00; Sun 11:00–20:00 (handles pet travel documentation) |
| Vet Clinic UAE – Town Square | +971 4 614 7058 | 08:00–23:00 all 7 days (latest closing in the corridor) |

Drive times are not verified.$md$,
  'both', 'services',
  null, (select id from places where slug = '2feet4paws'), false, 280,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published'
),
(
  'optician-near-the-valley',
  'Is there an optician near The Valley?',
  'No. There is no optician inside The Valley. Nearby options include Yateem, Reliable Eyecare (RTA), Gulf Optic and Al Jaber Optical in the DSO area.',
  $md$**No.** There is no optician inside The Valley.

Nearby optical places in the directory:

| Place | Phone | Hours |
|---|---|---|
| Yateem Optician | +971 4 283 3862 | Mon–Wed 10:00–22:00; Thu–Sun 10:00–23:00 |
| Reliable Eyecare Optics – RTA Eye Test Centre | +971 58 949 1810 | Mon–Wed, Sun 10:00–22:00; Thu–Sat 10:00–23:00 |
| Gulf Optic Silicon Oasis | +971 4 834 7401 | 10:00–22:00 all 7 days |
| Al Jaber Optical – Dubai Silicon Oasis | +971 4 261 4762 | Mon–Wed 10:00–22:00; Thu–Sun 10:00–23:00 |

Drive times are not verified.$md$,
  'both', 'services',
  null, (select id from places where slug = 'yateem-optician-dso'), false, 290,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published'
),
(
  'rta-eye-test-near-the-valley',
  'Where can I do an RTA eye test?',
  'Reliable Eyecare Optics is an RTA-approved eye test centre for driving licence renewal.',
  $md$**Reliable Eyecare Optics – RTA Eye Test Centre** is listed as an RTA-approved eye test centre for driving licence renewal.

- Phone: +971 58 949 1810
- Hours: Mon–Wed, Sun 10:00–22:00; Thu–Sat 10:00–23:00
- Drive time: not verified$md$,
  'both', 'services',
  null, (select id from places where slug = 'reliable-eyecare-optics'), false, 300,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published'
),
(
  'nearest-supermarket-to-the-valley',
  'Where''s the nearest big supermarket?',
  'Monoprix at The Pavilion is the only in-community grocery (07:00–23:00). Larger mall retail such as Dubai Outlet Mall is about 8 minutes away per Emaar.',
  $md$**In-community:** **Monoprix, The Valley** at The Pavilion is the only in-community grocery — 07:00–23:00 all 7 days (+971 4 558 6054).

**Nearby retail:** **Dubai Outlet Mall** has a verified drive time of **8 minutes** (Emaar). Hours 10:00–22:00 all 7 days.

Other malls in the directory (Dubai Hills Mall, Mall of the Emirates, Dubai Mall) have no verified drive times.$md$,
  'both', 'services',
  null, (select id from places where slug = 'monoprix-the-valley'), false, 310,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published'
),
(
  'salons-spas-near-the-valley',
  'Where are the nearest salons and spas?',
  'No in-community salon or spa is listed. Nearby options include Le Vendôme, Zendaya, 4Her, Epure Wellness and Dreamworks Spa.',
  $md$No salon or spa is listed inside The Valley. Nearby directory entries:

**Salons**

| Place | Phone |
|---|---|
| Le Vendôme Ladies Beauty Lounge | +971 4 567 1596 |
| Zendaya Beauty Lounge | +971 4 267 8868 |
| 4Her Ladies Salon | +971 58 616 3630 |

**Spas**

| Place | Phone | Notes |
|---|---|---|
| Epure Wellness & Spa | +971 55 344 5742 | Women only; hammam available |
| Dreamworks Spa, Radisson DAMAC Hills | +971 4 879 1144 | — |

Drive times are not verified.$md$,
  'both', 'services',
  null, (select id from places where slug = 'le-vendome-dh2'), false, 320,
  'official', 'a1000000-0000-4000-8000-000000000004', 'published'
),

-- ========== Connectivity — audience both (Q33–38) ==========
(
  'how-far-is-the-valley-from-downtown',
  'How far is The Valley from Downtown Dubai?',
  'Emaar states 20 minutes; realistically 25–30 depending on traffic.',
  $md$**Emaar states 20 minutes** to Downtown Dubai; **realistically 25–30 depending on traffic**.

That is the approved wording for this commute figure.$md$,
  'both', 'connectivity',
  null, null, false, 330,
  'official', 'a1000000-0000-4000-8000-000000000001', 'published'
),
(
  'the-valley-to-dxb-airport',
  'How far from Dubai International Airport?',
  'No verified drive time to Dubai International Airport is published in our reference.',
  $md$**No verified drive time** to Dubai International Airport (DXB) is published in this reference.

We do not invent or estimate airport drive times.$md$,
  'both', 'connectivity',
  null, null, false, 340,
  'unverified', 'a1000000-0000-4000-8000-000000000001', 'published'
),
(
  'the-valley-to-dubai-outlet-mall',
  'How far to Dubai Outlet Mall?',
  'About 8 minutes’ drive — the only place with a verified drive time (Emaar).',
  $md$**Dubai Outlet Mall** is about **8 minutes** by car.

This is the **only** place in the directory with a verified drive time (`drive_verified`), sourced from Emaar. Mall hours: 10:00–22:00 all 7 days.$md$,
  'both', 'connectivity',
  null, (select id from places where slug = 'dubai-outlet-mall'), false, 350,
  'official', 'a1000000-0000-4000-8000-000000000001', 'published'
),
(
  'the-valley-to-the-sevens',
  'How far to The Sevens Stadium?',
  'Distance and drive time to The Sevens Stadium are not verified in our reference; we do not publish an unverified figure.',
  $md$Distance and drive time to **The Sevens Stadium** are **not verified** in this reference.

We do not invent a number or publish an unverified drive time.$md$,
  'both', 'connectivity',
  null, null, false, 360,
  'unverified', 'a1000000-0000-4000-8000-000000000001', 'published'
),
(
  'metro-near-the-valley',
  'Is there a metro near The Valley?',
  'There is no public transport in the community. The nearest metro is about a 25-minute drive (Emaar).',
  $md$**None** inside the community.

Emaar states the **nearest metro is about a 25-minute drive**. No further metro timeline is published in this reference.$md$,
  'both', 'connectivity',
  null, null, false, 370,
  'official', 'a1000000-0000-4000-8000-000000000001', 'published'
),
(
  'can-i-live-in-the-valley-without-a-car',
  'Can I live in The Valley without a car?',
  'Practically no — there is no public transport in the community, and the nearest metro is about a 25-minute drive.',
  $md$Practically **no** for day-to-day life without private transport.

Annex A states **public transport: none** in the community, with the **nearest metro ~25 minutes’ drive**. In-community services (clinic, pharmacies, nursery, grocery, fuel) reduce some trips, but there is no metro or bus network inside the gates.$md$,
  'both', 'connectivity',
  null, null, false, 380,
  'official', 'a1000000-0000-4000-8000-000000000001', 'published'
),

-- ========== Clusters — audience prospect (Q39–49) ==========
(
  'communities-within-the-valley',
  'What are the communities within The Valley?',
  'The Valley is organised as named clusters — original Valley townhouses, twin villas and farm villas, plus later Valley 2 and Valley 3 phases.',
  $md$The Valley is a master plan of named **clusters**, not a single product line.

**Original Valley (phase 1 examples):** Eden, Nara, Talia, Orania, Elora, Lillia, Nima, Elva, Rivana, Alana, Farm Gardens, Farm Grove — spanning townhouses, twin villas and standalone villas.

**Later phases** (Valley 2 / Valley 3) add further clusters (e.g. Avena, Rivera, Velora, Farm Gardens 2, Avelia, Ovelle and others). Many later-phase rows remain draft or have incomplete specs in this reference.

See the cluster directory for product type, handover and unit counts where published.$md$,
  'prospect', 'clusters',
  null, null, false, 390,
  'corroborated', 'a1000000-0000-4000-8000-000000000001', 'published'
),
(
  'which-valley-clusters-are-completed',
  'Which clusters are completed and handed over?',
  'Eden, Nara and Talia are delivered. Delivered stock is about 1,064 homes across those three, rising to ~1,370 if Orania has completed.',
  $md$Confirmed delivered (status log):

| Cluster | Observed on |
|---|---|
| Eden | 2023-11-01 |
| Nara | 2024-12-01 |
| Talia | 2025-03-01 |

**Supply note:** Delivered stock is approximately **1,064 homes** across Eden, Nara and Talia, rising to **~1,370 if Orania has completed**. The Q3 2026 target adds **430 Elora** townhouses and **146 Farm Gardens** villas — roughly a **40% increase** in delivered stock.

Orania’s target was Q4 2025 and is now past; completion remains **unconfirmed** (`handover_actual` null). No other cluster delivery rows are seeded.$md$,
  'prospect', 'clusters',
  null, null, false, 400,
  'corroborated', 'a1000000-0000-4000-8000-000000000001', 'published'
),
(
  'when-did-eden-hand-over',
  'When did Eden hand over?',
  'Eden handed over in November 2023 (observed 2023-11-01).',
  $md$**Eden** handed over with `handover_actual` / status observed on **2023-11-01**.

Approved positioning: the only genuinely mature cluster — delivered 2023, grown-in landscaping, established resident base, direct Golden Beach access. Three facade styles (May Bell, Iris, Spruce). **362** townhouses.$md$,
  'prospect', 'clusters',
  (select id from clusters where slug = 'eden'), null, false, 410,
  'corroborated', 'a1000000-0000-4000-8000-000000000001', 'published'
),
(
  'eden-vs-nara-vs-talia',
  'What''s the difference between Eden, Nara and Talia?',
  'Eden is the mature 2023 delivery; Nara is the value single-row entry; Talia matches Nara’s footprint but sits closest to the main amenity spine.',
  $md$Approved positioning for the three delivered early clusters:

- **Eden** — the only genuinely mature cluster. Delivered 2023, grown-in landscaping, established resident base, direct Golden Beach access. Three facade styles. **362** homes.
- **Nara** — the value entry point. Smallest footprints, lowest price, every home single-row with no back-to-back neighbours. **372** homes; handed over 2024-12-01.
- **Talia** — same footprint as Nara; the difference is location. Closest of the early clusters to Golden Beach, Town Centre and Sports Village. Best walkability. **330** homes; handed over 2025-03-01.

Published 3-bed BUA (sq ft): Eden 1,929–2,057; Nara 1,866; Talia 1,862.$md$,
  'prospect', 'clusters',
  (select id from clusters where slug = 'eden'), null, false, 420,
  'corroborated', 'a1000000-0000-4000-8000-000000000001', 'published'
),
(
  'largest-3-bedroom-in-the-valley',
  'Which cluster has the largest 3-bedroom?',
  'Among published figures, Alana’s 3-bed twin villa is the largest at 3,788 sq ft; Lillia has the largest original-Valley townhouse 3-bed at 2,344 sq ft.',
  $md$From published unit-type BUA figures:

| Cluster | Product | 3-bed BUA (sq ft) |
|---|---|---|
| Alana | twin villa | 3,788 |
| Rivana | twin villa | 3,152 |
| Lillia | townhouse | 2,344 |
| Elva | townhouse | 2,241–2,416 |
| Elora | townhouse | 2,095–2,179 |

**Alana** has the largest published 3-bedroom. **Lillia** is positioned as the largest 3-bed in the **original Valley townhouse** set (middle units; maid’s room on the ground floor).

Some of these unit rows are `unverified` in the register — treat raw sizes accordingly.$md$,
  'prospect', 'clusters',
  (select id from clusters where slug = 'alana'), null, false, 430,
  'unverified', 'a1000000-0000-4000-8000-000000000001', 'published'
),
(
  'largest-4-bedroom-townhouse-in-the-valley',
  'Which cluster has the largest 4-bedroom townhouse?',
  'Elva is positioned as the largest townhouse 4-bed, with published BUA about 2,706–2,711 sq ft and the only townhouse cluster publishing plot figures.',
  $md$**Elva** — largest townhouse 4-bed and the only cluster publishing plot figures (genuine outdoor space rather than a strip of garden).

Published Elva 4-bed: BUA **2,706–2,711** sq ft; plot **2,968–3,376** sq ft.

For context among earlier townhouses: Elora 4-bed is 2,586–2,608; Orania up to 2,345; Eden 2,311–2,336.

Handover for Elva conflicts across sources (Q3 2028 vs Q4 2028); `handover_target` is left null. Spec confidence is `unverified`.$md$,
  'prospect', 'clusters',
  (select id from clusters where slug = 'elva'), null, false, 440,
  'unverified', 'a1000000-0000-4000-8000-000000000001', 'published'
),
(
  'single-row-townhouses-the-valley',
  'Which clusters have single-row townhouses?',
  'Nara, Orania, Elora and Lillia are flagged single-row in the cluster register.',
  $md$Clusters with `single_row = true` in the register:

| Cluster | Notes |
|---|---|
| Nara | Every home single-row; no back-to-back neighbours |
| Orania | No back-to-back units; 43 clusters in 4, 6, 8 and 10-plex rows |
| Elora | All 430 units single-row; every home a corner or end unit |
| Lillia | Single-row; 3-beds middle, 4-beds corners |

Other townhouse clusters (Eden, Talia, etc.) are not flagged single-row in this reference.$md$,
  'prospect', 'clusters',
  (select id from clusters where slug = 'nara'), null, false, 450,
  'corroborated', 'a1000000-0000-4000-8000-000000000001', 'published'
),
(
  'how-many-homes-in-each-valley-cluster',
  'How many homes are in each cluster?',
  'Published counts include Eden 362, Nara 372, Talia 330, Orania 308, Elora 430, Farm Gardens 146 and Farm Grove 482; several clusters have null counts.',
  $md$Published `unit_count` values (original Valley unless noted):

| Cluster | Homes |
|---|---|
| Eden | 362 |
| Nara | 372 |
| Talia | 330 |
| Orania | 308 |
| Elora | 430 |
| Farm Gardens | 146 |
| Farm Grove | 482 |
| Rivera (Valley 2) | 378 |

**Null / unknown in this reference:** Lillia, Nima, Elva, Rivana, Alana and several later-phase clusters.

Delivered stock context: ~1,064 across Eden, Nara and Talia (~1,370 if Orania has completed).$md$,
  'prospect', 'clusters',
  null, null, false, 460,
  'corroborated', 'a1000000-0000-4000-8000-000000000001', 'published'
),
(
  'facade-styles-the-valley',
  'What are the facade styles in each cluster?',
  'Published facades include Eden (May Bell, Iris, Spruce), Nara (Aston, Palma, Charm), Talia (Pharo, Cyrus, Elio), Elora (Moon, Mysk), Lillia (Jade, Pearl) and Farm Gardens (Horizon, Earth).',
  $md$Facade styles from the cluster register (where published):

| Cluster | Facade styles |
|---|---|
| Eden | May Bell, Iris, Spruce |
| Nara | Aston, Palma, Charm |
| Talia | Pharo, Cyrus, Elio |
| Elora | Moon, Mysk |
| Lillia | Jade, Pearl |
| Farm Gardens | Horizon, Earth |

**Not published** in this reference for: Orania, Nima, Elva, Rivana, Alana, Farm Grove and later-phase clusters.$md$,
  'prospect', 'clusters',
  null, null, false, 470,
  'corroborated', 'a1000000-0000-4000-8000-000000000001', 'published'
),
(
  'townhouse-vs-twin-villa-the-valley',
  'What''s the difference between a townhouse and a twin villa?',
  'Townhouses are the attached/plex product; twin villas are semi-detached pairs and generally larger — Rivana’s 3-bed exceeds the biggest townhouse 4-bed.',
  $md$At The Valley, both are master-plan product types (alongside standalone villas).

- **Townhouse** — the volume product across early clusters (Eden, Nara, Talia, Orania, Elora, Lillia, Elva, etc.), typically G+1 attached or plex configurations.
- **Twin villa** — semi-detached pairs. **Rivana** offers the widest bedroom range; its **3-bed is larger than the biggest 4-bed townhouse**. **Alana** is the premium twin villa (Ground + 2, full published plot matrix).

Cross-collection note (approved): Elva 4BR → Alana 4BR is about **+1,450 sq ft**, a third floor and twin-villa format.$md$,
  'prospect', 'clusters',
  (select id from clusters where slug = 'rivana'), null, false, 480,
  'unverified', 'a1000000-0000-4000-8000-000000000001', 'published'
),
(
  'standalone-villas-in-the-valley',
  'Which clusters have standalone villas?',
  'Farm Gardens and Farm Grove are the original Valley standalone villa clusters; later phases add further villa product (e.g. Avena, Kaia).',
  $md$**Original Valley standalone villas:**

- **Farm Gardens** — top of the original Valley. **146** homes only; facade styles Horizon and Earth; farm-style landscaping, hydroponics greenhouse, community gardening. Target handover 2026-09-30. 4-bed from 4,950 sq ft; 5-bed up to 10,004 sq ft.
- **Farm Grove** — the accessible standalone, set among ghaf trees. **482** homes; target 2028-12-31. 4-bed from 3,741 sq ft; 5-bed up to 6,078 sq ft.

Later phases include additional villa clusters (e.g. **Avena**, **Kaia**, Farm Gardens 2 / Farm Grove 2) — many still draft or with incomplete specs.

Approved comparison: Farm Grove 4BR → Farm Gardens 4BR is about **+1,200 sq ft**, with scarcity (146 vs 482 units).$md$,
  'prospect', 'clusters',
  (select id from clusters where slug = 'farm-gardens'), null, false, 490,
  'corroborated', 'a1000000-0000-4000-8000-000000000001', 'published'
),

-- ========== Market — audience prospect (Q50–52) ==========
(
  'rent-prices-in-the-valley',
  'How much is rent in The Valley?',
  'Average registered rent is AED 146,571 (trailing 12 months, DLD via Bayut); asking rents average AED 159,282 with townhouses roughly AED 130,000–255,000.',
  $md$Market figures (Annex G):

| Metric | Value | Source |
|---|---|---|
| New rental contracts, trailing 12 months | 720 | DLD via Bayut |
| Average registered rent, trailing 12 months | AED 146,571 | DLD via Bayut |
| Average asking rent | AED 159,282 | Bayut |
| Asking rent range | AED 120,000 – 700,000 | Bayut |
| Townhouse asking rent range | AED 130,000 – 255,000 | Bayut |
| Asking rent movement, 6 months | −4% (villas −5%) | Bayut |

**Approved framing:** sale prices up, asking rents down 4–5%. The gap reflects incoming supply — buyers pricing the future, tenants pricing today’s competition.$md$,
  'prospect', 'market',
  null, null, false, 500,
  'corroborated', 'a1000000-0000-4000-8000-000000000003', 'published'
),
(
  'rental-yield-the-valley',
  'What''s the rental yield in The Valley?',
  'Townhouse gross ROI is 5.06% (Bayut).',
  $md$**Townhouse gross ROI: 5.06%** (Bayut).

That is the only ROI figure published in this reference.$md$,
  'prospect', 'market',
  null, null, false, 510,
  'corroborated', 'a1000000-0000-4000-8000-000000000003', 'published'
),
(
  '3-bedroom-townhouse-price-the-valley',
  'How much does a 3-bed townhouse cost?',
  'Average 3BR townhouse sale price is AED 2,965,389; asking range AED 2,350,000–5,700,000 (Bayut).',
  $md$Sale / asking figures for 3-bedroom townhouses (Bayut):

| Metric | Value |
|---|---|
| Average 3BR townhouse sale price | AED 2,965,389 |
| 3BR townhouse asking range | AED 2,350,000 – 5,700,000 |
| 3BR sale price movement | +3% |
| Average townhouse sale price (all) | AED 3,366,507 |

**Approved framing:** sale prices up 3%, asking rents down 4–5%. The gap reflects incoming supply.$md$,
  'prospect', 'market',
  null, null, false, 520,
  'corroborated', 'a1000000-0000-4000-8000-000000000003', 'published'
);
