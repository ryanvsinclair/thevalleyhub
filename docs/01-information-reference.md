# DOC 1 — INFORMATION REFERENCE

**Status:** Authoritative factual source
**Version:** 1.1 · 7 August 2026 — *amended: confidence/state interaction rule added under Confidence markers*

> **This is the only permitted source of facts about The Valley.**
> The agent does not use web search, training knowledge, or inference to fill gaps.
> If a value is not in this document, it is `null` and must be flagged — never estimated.

---

## HOW TO USE

| You need | Go to |
|---|---|
| Community-level facts | Annex A |
| Masterplan amenity names and sizes | Annex B |
| Cluster list, specs, handover (overview only) | Annex C |
| Full detail on a specific cluster | `docs/clusters/<slug>/reference.md` |
| Unit types, sizes, plots | Annex D |
| Places: coordinates, hours, phone | Annex E |
| Development timeline | Annex F |
| Rents, prices, yields | Annex G |
| Competitor comparisons | Annex H |
| The 52 launch questions | Annex I |
| **Things that must never be published** | **Annex J** |
| Known gaps — expect nulls here | Annex K |
| Controlled vocabularies | Annex L |

### Confidence markers

| Marker | Meaning | Publishable |
|---|---|---|
| `official` | Emaar, DLD, or the operator itself | Yes |
| `corroborated` | Two or more independent sources agree | Yes |
| `unverified` | Single source or sources conflict | **Raw values: no — hidden at render. See rule below.** |

**How confidence interacts with `state`:** Confidence gates the rendering of raw data values; it does not set `state`. Rows are seeded draft or published exactly as Doc 2 instructs — a published row may carry `confidence = 'unverified'` (e.g. Lillia, Nima, Elva, Rivana, Alana are published per Doc 2 §3.2). On such rows the application hides unverified spec values at render (ConfidenceGate, Doc 2 steps 4.2 and 4.5) while still rendering approved copy. **Approved copy in this document — Annex C.4 positioning, the Annex D cross-collection comparison, Annex H reads, and question answers built from them — is publishable as written even where underlying values are `unverified`: inclusion here is the publish decision.** Where this document and Doc 2 are both silent on a row's state, default to `draft` and flag.

### Superseded documents

`valley-master-reference.md`, `valley-site-spec.md`, `valley-portal-addendum.md` are **historical**. Where they conflict with this document or with the Section 2 migration, this document and the migration win. Do not read them for facts.

---

## ANNEX A — COMMUNITY FUNDAMENTALS

| Key | Value | Confidence |
|---|---|---|
| Developer | Emaar Properties | official |
| Location | Dubai–Al Ain Road (E66), at the E66/E77 junction | official |
| DLD / Ejari community name | Al Yufrah 1 | official |
| Master launch | November 2019 | corroborated |
| Total area | 200+ hectares / 2,000,000+ sqm | corroborated |
| Tenure | Freehold, all nationalities | corroborated |
| Product types | Townhouse, twin villa, standalone villa | official |
| Apartments | **None in the master plan** | official |
| Bedroom range | 3 to 5 | official |
| Gating | Gated, 24-hour security | corroborated |
| Parking | Two spaces per home | corroborated |
| Community management | Emaar Community Management (ECM) | official |
| Public transport | None. Nearest metro ~25 min drive | official |

**Positioning statement (approved wording):** Emaar's value-tier family villa community — the entry point into the Emaar villa ecosystem, trading a longer commute for roughly half the per-square-foot cost of Dubai Hills Estate, in a low-density, amenity-complete master plan.

---

## ANNEX B — MASTERPLAN AMENITIES

All figures from Emaar's own community page. Broker sites circulate stale numbers — see Annex J.

| amenity_key | Name | Size | Contents | Confidence |
|---|---|---|---|---|
| `town-centre` | Town Centre | 32,000 sqm | Indoor/outdoor retail, cafés, boutiques, alfresco dining, farmers' market | official |
| `golden-beach` | Golden Beach | 47,000 sqm | Beach lagoon, sandy shore, water activities, splash park, F&B | official |
| `sports-village` | Sports Village | 25,000 sqm | Sports courts, playground, outdoor gym, bicycle and running tracks | official |
| `kids-dale` | Kids' Dale | 13,000 sqm | Rock climbing, amphitheatre, archaeological play zones | official |
| `pocket-parks` | Pocket Parks | 3,000 sqm | Green pockets through clusters | official |
| `pavilion` | The Pavilion | — | Zen garden, oasis garden, observation tower, maze | corroborated |
| `pet-park` | Pet Park | — | Dedicated pet area | official |
| `jogging-trails` | Jogging trails | — | Throughout community | official |
| `cycling-tracks` | Cycling tracks | — | Throughout community | official |

**Operational status: UNKNOWN for all of the above.** These are specified, not confirmed open. All amenity content must be written as *what is planned/specified*. `status_log` stays empty until a site visit. See Annex K.

---

## ANNEX C — CLUSTER REGISTER

### C.1 Original Valley clusters (12)

**Migrated to `docs/clusters/<slug>/reference.md`** (2026-08-09) — Eden, Nara, Talia, Orania, Elora, Lillia, Farm Gardens. Overview only below; full detail (facade styles, positioning, unit types, and for Farm Gardens the in-progress Batch 001 corrections) lives in each cluster's reference file.

| slug | name | phase | product_type | unit_count | state | confidence | reference |
|---|---|---|---|---|---|---|---|
| `eden` | Eden | 1 | townhouse | 362 | published | corroborated | [`docs/clusters/eden/reference.md`](clusters/eden/reference.md) |
| `nara` | Nara | 1 | townhouse | 372 | published | corroborated | [`docs/clusters/nara/reference.md`](clusters/nara/reference.md) |
| `talia` | Talia | 1 | townhouse | 330 | published | corroborated | [`docs/clusters/talia/reference.md`](clusters/talia/reference.md) |
| `orania` | Orania | 1 | townhouse | 308 | published | corroborated | [`docs/clusters/orania/reference.md`](clusters/orania/reference.md) |
| `elora` | Elora | 1 | townhouse | 430 | published | corroborated | [`docs/clusters/elora/reference.md`](clusters/elora/reference.md) |
| `lillia` | Lillia | 1 | townhouse | null | published | unverified | [`docs/clusters/lillia/reference.md`](clusters/lillia/reference.md) |
| `farm-gardens` | Farm Gardens | 1 | villa | 146 | published | corroborated | [`docs/clusters/farm-gardens/reference.md`](clusters/farm-gardens/reference.md) |

**Not yet migrated** — still full detail here, same as before:

| slug | name | phase | product_type | unit_count | facade_styles | single_row | handover_actual | handover_target | confidence |
|---|---|---|---|---|---|---|---|---|---|
| `nima` | Nima | 1 | townhouse | null | null | null | null | null | unverified |
| `elva` | Elva | 1 | townhouse | null | null | null | null | **CONFLICT** | unverified |
| `rivana` | Rivana | 1 | twin_villa | null | null | null | null | null | unverified |
| `alana` | Alana | 1 | twin_villa | null | null | null | null | 2027-06-30 | unverified |
| `farm-grove` | Farm Grove | 1 | villa | 482 | null | null | null | 2028-12-31 | corroborated |

**Elva:** sources say Q3 2028 and Q4 2028. Leave `handover_target` null, flag.
**Farm Grove phase:** may belong to phase 2. Set `phase = 1`, note the uncertainty in `notes`.

(Orania's completion-status note and `plex_config` moved to `docs/clusters/orania/reference.md`.)

### C.2 Valley 2 clusters (11) — all `state = 'draft'`

| slug | name | product_type | price_from_aed | handover_target | confidence |
|---|---|---|---|---|---|
| `avena` | Avena | villa | 4360000 | 2028-06-30 | corroborated |
| `avena-2` | Avena 2 | villa | null | null | unverified |
| `rivera` | Rivera | twin_villa | **CONFLICT** | 2029-06-30 | unverified |
| `velora` | Velora | townhouse | 2480000 | 2028-12-31 | unverified |
| `velora-2` | Velora 2 | townhouse | 2930000 | 2028-09-30 | unverified |
| `venera` | Venera | townhouse | 2480000 | 2028-12-31 | unverified |
| `vindera` | Vindera | townhouse | 3070000 | 2029-12-31 | unverified |
| `farm-gardens-2` | Farm Gardens 2 | villa | 7260000 | **CONFLICT** | unverified |
| `farm-grove-2` | Farm Grove 2 | villa | null | 2028-12-31 | unverified |
| `elea` | Elea | townhouse | 2990000 | **CONFLICT** | unverified |
| `kaia` | Kaia | villa | 2720000 | 2028-09-30 | unverified |

Rivera: 4,780,000 vs 4,980,000. Farm Gardens 2: Q3 2026 vs Q2 2028. Elea: Q2 2028 vs Q3 2028. Leave all conflicting fields null.

Rivera `unit_count` = 378 (corroborated).

### C.3 Valley 3 clusters (2) — `state = 'draft'`

| slug | name | price_from_aed | handover_target | confidence |
|---|---|---|---|---|
| `avelia` | Avelia | null | 2029-12-31 | unverified |
| `ovelle` | Ovelle | 8855888 | null | unverified |

### C.4 Positioning text (approved, for `positioning` field)

Eden, Nara, Talia, Orania, Elora, Lillia, and Farm Gardens' positioning text moved to their `docs/clusters/<slug>/reference.md` (content unchanged in the move — Farm Gardens' remains exactly as Ray specified, untouched by Batch 001 too).

- **Elva** — largest townhouse 4-bed and the only cluster publishing plot figures. Genuine outdoor space rather than a strip of garden.
- **Rivana** — widest bedroom range at The Valley. Its 3-bed is larger than the biggest 4-bed townhouse.
- **Alana** — the premium twin villa. Ground + 2, full published plot matrix.
- **Farm Grove** — the accessible standalone, set among ghaf trees.

---

## ANNEX D — UNIT TYPES

Only rows with data. Everything absent is a genuine gap — do not invent.

**Eden, Nara, Talia, Orania, Elora, Lillia, and Farm Gardens' unit type rows moved to their `docs/clusters/<slug>/reference.md`** (values unchanged — Farm Gardens' still shows the known `bua_max` error there, pending Batch 001 promotion).

| cluster | bedrooms | bua_min | bua_max | plot_min | plot_max | layout | notes | confidence |
|---|---|---|---|---|---|---|---|---|
| elva | 3 | 2241 | 2416 | 1938 | 1961 | — | Saleable area | unverified |
| elva | 4 | 2706 | 2711 | 2968 | 3376 | — | BUA | unverified |
| rivana | 3 | 3152 | — | — | — | — | — | unverified |
| rivana | 5 | — | 5192 | — | — | — | — | unverified |
| alana | 3 | 3788 | — | 3456 | — | G+2 | — | unverified |
| alana | 4 | 4157 | — | 4147 | — | G+2 | — | unverified |
| alana | 5 | 4859 | — | 5096 | — | G+2 | — | unverified |
| farm-grove | 4 | 3741 | — | — | — | — | — | corroborated |
| farm-grove | 5 | — | 6078 | — | — | — | — | corroborated |
| avena | 4 | 3685 | 3685 | — | — | — | — | corroborated |
| rivera | 4 | 3688 | 3714 | — | — | — | — | unverified |
| velora | 3 | 2456 | — | — | — | — | — | unverified |
| velora | 4 | — | 2731 | — | — | — | — | unverified |
| velora-2 | 3 | 2457 | — | — | — | — | — | unverified |
| vindera | 3 | 2396 | — | — | — | — | — | unverified |

**No unit_type rows exist for:** nima, farm-gardens-2, farm-grove-2, elea, kaia, avena-2, venera, avelia, ovelle.

**Alana private pools:** one source indicates standard. `unverified` — leave `private_pool` null.

### Cross-collection comparison (approved copy)

| Comparison | Difference |
|---|---|
| Nara/Talia 4BR → Elora 4BR | ~350 sq ft, single-row guarantee, newer build |
| Elora 4BR → Lillia 4BR | Corner position, ground-floor bedroom, L-shaped garden |
| Lillia 4BR → Elva 4BR | ~3,000 sq ft plot, but 2028 delivery |
| Elva 4BR → Alana 4BR | +1,450 sq ft, third floor, twin-villa format |
| Alana 4BR → Farm Grove 4BR | Full detachment, but **loses ~400 sq ft of built area** |
| Farm Grove 4BR → Farm Gardens 4BR | +1,200 sq ft, scarcity (146 vs 482 units) |

---

## ANNEX E — PLACES DIRECTORY

`hours` format: `{"mon":{"open":"09:00","close":"22:00"},"sat":null}` — null = closed, omit = unknown.

### E.1 In-community (`in_community = true`)

| slug | name | category | operator | lat | lng | phone | hours | confidence |
|---|---|---|---|---|---|---|---|---|
| `medcare-the-valley` | Medcare Medical Centre – The Valley | clinic | Medcare | 25.015367 | 55.454088 | +971 800 6332273 | 09:00–22:00 all 7 days | official |
| `aster-pharmacy-the-valley` | Aster Pharmacy – The Valley | pharmacy | Aster | 25.015282 | 55.454520 | +971 4 329 1310 | 10:00–22:00 all 7 days | official |
| `binsina-pharmacy-valley` | BinSina Pharmacy Valley | pharmacy | BinSina | 25.015445 | 55.454578 | +971 4 256 7991 | Mon–Fri 09:00–23:00; Sat–Sun 10:00–22:00 | official |
| `maple-bear-the-valley` | Maple Bear Nursery The Valley | nursery | Maple Bear | 25.015339 | 55.454045 | +971 58 156 3537 | Mon–Fri 08:00–18:00; Sat–Sun closed | official |
| `monoprix-the-valley` | Monoprix, The Valley | grocery | Monoprix | 25.015355 | 55.454559 | +971 4 558 6054 | 07:00–23:00 all 7 days | official |
| `emarat-raed` | Emarat – Raed | fuel | Emarat | 25.016110 | 55.455767 | +971 4 832 6099 | 24 hours | official |
| `masabih-masjid` | Masabih Rashid Al Fattan Masjid | mosque | — | null | null | null | null | corroborated |

Addresses: Pavilion units are `The Valley Pavilion, Al Yufrah 1, Dubai`. Aster is Shops 11 & 12; Maple Bear is Shops GF13 & 13-1.

**Notes:** Medcare offers family medicine and physiotherapy. Monoprix is the only in-community grocery; public reviews are mixed (4.1) with recurring comments on fresh bakery availability.

### E.2 Healthcare nearby

| slug | name | category | lat | lng | phone | hours | confidence |
|---|---|---|---|---|---|---|---|
| `fakeeh-university-hospital` | Fakeeh University Hospital | hospital | 25.122177 | 55.386400 | +971 4 414 4444 | 24 hours | official |
| `aster-clinic-dubailand` | Aster Clinic, Dubailand | clinic | 25.091824 | 55.384682 | +971 4 440 0500 | Mon–Sat 08:30–22:00; Sun 08:30–21:00 | official |
| `saudi-german-clinic-dh2` | Saudi German Clinic, DAMAC Hills 2 | clinic | 24.997230 | 55.383471 | +971 800 2211 | 10:00–21:00 all 7 days | official |
| `medcare-damac-hills` | Medcare Medical Centre – DAMAC Hills | clinic | 25.016995 | 55.247357 | +971 800 6332273 | 09:00–21:00 all 7 days | official |
| `medcare-arabian-ranches-3` | Medcare Medical Centre – Arabian Ranches 3 | clinic | 25.069450 | 55.323083 | +971 800 6332273 | 09:00–22:00 all 7 days | official |
| `saudi-german-clinic-damac-hills` | Saudi German Clinic, DAMAC Hills | clinic | 25.019034 | 55.245667 | +971 800 2211 | Mon–Thu, Sat–Sun 10:00–20:00; Fri 10:00–18:00 | official |
| `medcare-town-square` | Medcare Medical Centre, Town Square | clinic | 25.006551 | 55.295336 | +971 800 6332273 | 09:00–21:00 all 7 days | official |

`saudi-german-clinic-dh2` subcategory: `dental` also available.

### E.3 Schools

| slug | name | subcategory | lat | lng | phone | confidence |
|---|---|---|---|---|---|---|
| `gems-firstpoint-school` | GEMS FirstPoint School | British | 25.089368 | 55.375475 | +971 4 278 9700 | official |
| `the-aquila-school` | The Aquila School | British | 25.089334 | 55.383180 | +971 4 586 2700 | official |
| `vernus-international-school` | Vernus International School | American | 25.123406 | 55.402590 | +971 4 320 8000 | official |
| `gems-wellington-academy-dso` | GEMS Wellington Academy | British | 25.118119 | 55.388107 | +971 4 515 9000 | official |
| `dunecrest-american-school` | Dunecrest American School | American | 25.090882 | 55.306521 | +971 4 508 7444 | official |
| `gems-winchester-school` | GEMS Winchester School | Indian/British | 25.080880 | 55.331792 | +971 4 595 2555 | official |
| `ranches-primary-school` | Ranches Primary School | British primary | 25.029586 | 55.271662 | +971 4 442 9765 | official |
| `jess-arabian-ranches` | JESS Arabian Ranches | British | 25.057162 | 55.272546 | +971 4 361 9019 | official |

**No drive times.** `drive_minutes` null, `drive_verified` false, for every school.

### E.4 Nurseries nearby

| slug | name | lat | lng | phone | hours | confidence |
|---|---|---|---|---|---|---|
| `cherry-tree-nursery-dh2` | Cherry Tree Nursery – DAMAC Hills 2 | 24.997160 | 55.383570 | +971 4 399 9169 | Mon–Fri 07:45–17:30 | official |
| `emirates-british-nursery-dso` | Emirates British Nursery – DSO | 25.128367 | 55.397266 | +971 4 342 3399 | Mon–Fri 07:30–17:30 | official |
| `british-orchard-nursery-dso` | British Orchard Nursery – DSO | 25.116529 | 55.389851 | +971 4 388 6602 | Mon–Fri 07:00–18:00; Sat 09:00–16:00 | official |

### E.5 Veterinary

| slug | name | lat | lng | phone | hours | confidence |
|---|---|---|---|---|---|---|
| `2feet4paws` | 2Feet4Paws (& Exotics) Veterinary Clinic | 25.091163 | 55.384293 | +971 4 552 0213 | Mon–Fri 08:00–20:00; Sat–Sun 09:00–17:00 | official |
| `pet-bond-veterinary` | Pet Bond Veterinary Clinic | 25.016297 | 55.247793 | +971 56 272 7225 | 09:00–21:00 all 7 days | official |
| `little-hearts-veterinary` | Little Hearts Veterinary Clinic | 25.013089 | 55.251180 | +971 4 321 4430 | Mon–Sat 09:30–20:00; Sun 11:00–20:00 | official |
| `vet-clinic-uae-town-square` | Vet Clinic UAE – Town Square | 25.005252 | 55.297094 | +971 4 614 7058 | 08:00–23:00 all 7 days | official |

`little-hearts-veterinary` note: handles pet travel documentation. `vet-clinic-uae-town-square`: latest closing in the corridor.

### E.6 Optical

| slug | name | lat | lng | phone | hours | confidence |
|---|---|---|---|---|---|---|
| `yateem-optician-dso` | Yateem Optician | 25.111582 | 55.374885 | +971 4 283 3862 | Mon–Wed 10:00–22:00; Thu–Sun 10:00–23:00 | official |
| `reliable-eyecare-optics` | Reliable Eyecare Optics – RTA Eye Test Centre | 25.119313 | 55.395563 | +971 58 949 1810 | Mon–Wed, Sun 10:00–22:00; Thu–Sat 10:00–23:00 | official |
| `gulf-optic-dso` | Gulf Optic Silicon Oasis | 25.112141 | 55.375004 | +971 4 834 7401 | 10:00–22:00 all 7 days | official |
| `al-jaber-optical-dso` | Al Jaber Optical – Dubai Silicon Oasis | 25.110939 | 55.374907 | +971 4 261 4762 | Mon–Wed 10:00–22:00; Thu–Sun 10:00–23:00 | official |

`reliable-eyecare-optics` note: RTA-approved eye test centre for driving licence renewal.

### E.7 Salon, spa, gym

| slug | name | category | lat | lng | phone | confidence |
|---|---|---|---|---|---|---|
| `le-vendome-dh2` | Le Vendôme Ladies Beauty Lounge | salon | 24.997836 | 55.383104 | +971 4 567 1596 | official |
| `zendaya-beauty-lounge` | Zendaya Beauty Lounge | salon | 24.984259 | 55.392210 | +971 4 267 8868 | official |
| `4her-ladies-salon` | 4Her Ladies Salon | salon | 25.018788 | 55.246138 | +971 58 616 3630 | official |
| `epure-wellness-spa` | Epure Wellness & Spa | spa | 24.984784 | 55.393624 | +971 55 344 5742 | official |
| `dreamworks-spa-damac-hills` | Dreamworks Spa, Radisson DAMAC Hills | spa | 25.018866 | 55.246212 | +971 4 879 1144 | official |
| `the-training-room-dh2` | The Training Room | gym | 24.997267 | 55.383367 | +971 56 879 3270 | official |
| `elvt-fitness-dh2` | ELVT Fitness | gym | 24.997286 | 55.383359 | +971 58 500 5962 | official |

`epure-wellness-spa` note: women only, hammam available.

### E.8 Fuel and retail

| slug | name | category | lat | lng | hours | drive_minutes | confidence |
|---|---|---|---|---|---|---|---|
| `enoc-1071` | ENOC 1071 – Dubai Al Ain Road | fuel | 25.055085 | 55.418790 | 24 hours | null | official |
| `enoc-50` | ENOC 50 – Dubai Al Ain Road | fuel | 24.958780 | 55.497589 | 24 hours | null | official |
| `eppco-49` | EPPCO 49 – Al Ain Road DSO | fuel | 25.109421 | 55.374924 | 24 hours | null | official |
| `dubai-outlet-mall` | Dubai Outlet Mall | mall | 25.072599 | 55.400175 | 10:00–22:00 all 7 days | **8** | official |
| `dubai-hills-mall` | Dubai Hills Mall | mall | 25.101694 | 55.239938 | — | null | official |
| `mall-of-the-emirates` | Mall of the Emirates | mall | 25.118107 | 55.200608 | — | null | official |
| `dubai-mall` | Dubai Mall | mall | 25.197230 | 55.279747 | — | null | official |

`dubai-outlet-mall` is the **only** place with a verified drive time (`drive_verified = true`, source: Emaar). All others false.

---

## ANNEX F — TIMELINE

`status_log` seed rows — `subject_type = 'cluster'`, `status = 'delivered'`:

| cluster | observed_on | confidence |
|---|---|---|
| eden | 2023-11-01 | corroborated |
| nara | 2024-12-01 | corroborated |
| talia | 2025-03-01 | corroborated |

**No other status_log rows at seed.** Amenity status is unknown; cluster status beyond these three is unconfirmed.

**Supply note (approved copy):** Delivered stock is approximately 1,064 homes across Eden, Nara and Talia, rising to ~1,370 if Orania has completed. The Q3 2026 target adds 430 Elora townhouses and 146 Farm Gardens villas — roughly a 40% increase in delivered stock.

---

## ANNEX G — MARKET DATA

| Metric | Value | Source | Confidence |
|---|---|---|---|
| New rental contracts, trailing 12 months | 720 | DLD via Bayut | official |
| Average registered rent, trailing 12 months | AED 146,571 | DLD via Bayut | official |
| Average asking rent | AED 159,282 | Bayut | corroborated |
| Asking rent range | AED 120,000 – 700,000 | Bayut | corroborated |
| Townhouse asking rent range | AED 130,000 – 255,000 | Bayut | corroborated |
| Asking rent movement, 6 months | −4% (villas −5%) | Bayut | corroborated |
| Average townhouse sale price | AED 3,366,507 | Bayut | corroborated |
| Average 3BR townhouse sale price | AED 2,965,389 | Bayut | corroborated |
| 3BR townhouse asking range | AED 2,350,000 – 5,700,000 | Bayut | corroborated |
| 3BR sale price movement | +3% | Bayut | corroborated |
| Townhouse gross ROI | **5.06%** | Bayut | corroborated |

**Approved framing:** Sale prices up 3%, asking rents down 4–5%. The gap reflects incoming supply — buyers pricing the future, tenants pricing today's competition.

---

## ANNEX H — COMPETITORS

Seed `communities` then `comparisons`. Dimensions: `price`, `commute`, `schools`, `amenities`, `maturity`.

| slug | name | developer |
|---|---|---|
| `arabian-ranches-3` | Arabian Ranches 3 | Emaar |
| `villanova` | Villanova | Dubai Properties |
| `town-square-dubai` | Town Square Dubai | Nshama |
| `damac-hills-2` | DAMAC Hills 2 | DAMAC |
| `tilal-al-ghaf` | Tilal Al Ghaf | Majid Al Futtaim |

### Arabian Ranches 3
- **Other:** Shorter commute to Downtown/DIFC. Schools inside and adjacent (JESS, Ranches Primary). Mature brand. 30,000 sqm Central Park. Settled tenant base.
- **Valley:** Materially cheaper. Larger, lower-density master plan. Golden Beach has no AR3 equivalent. In-community medical centre, two pharmacies, nursery and grocery already trading.
- **Honest read:** AR3 averages ~AED 194,889 new-contract villa rent vs The Valley's registered ~AED 146,571 — roughly AED 48,000/yr, mostly buying commute time and maturity. DIFC commuter → AR3. Remote, Silicon Oasis or Academic City → The Valley. *(Note: AR3 figure is Property Finder listing data, not like-for-like with DLD. Directional only.)*

### Villanova
- **Other:** Fully delivered, no construction-zone problem. GEMS school inside the community. Closer to Academic City and Silicon Oasis. Cheaper. Reported yields 5.8–7.0%.
- **Valley:** Emaar brand and build quality. Far superior amenity programme. Larger units. Newer stock.
- **Honest read:** Villanova is the pragmatist's choice and cheaper. The Valley asks a premium for Emaar plus amenities that are partly still being built — defensible only once amenity status is verified.

### Town Square Dubai
- **Other:** Cheaper entry. Mature and delivered. Walkable central square with real F&B density. Established retail. Medcare on site.
- **Valley:** Much larger homes. Emaar vs Nshama on build quality and resale liquidity. Lower density. Villa product Town Square lacks entirely.
- **Honest read:** Town Square wins on price and on being finished. The Valley's counter is space and product tier — no Town Square equivalent to Rivana, Alana, Farm Grove or Farm Gardens. Different tenant.

### DAMAC Hills 2
- **Other:** Lowest entry price in the corridor. Fully delivered. Large community centre with Carrefour, clinic, gym, nursery, salons and spas. Real retail density.
- **Valley:** Substantially better build quality and finish. Emaar community management. Far lower density. Better landscaping. Stronger resale and rental liquidity. Larger plots.
- **Honest read:** DAMAC Hills 2's community amenities are publicly criticised by residents — the community gym holds a 2.0 rating across 44 reviews for a community of roughly 30,000. That is documented, not opinion. But it is much cheaper, and for a budget-constrained family that trade is rational. Quantify the difference; don't disparage.

### Tilal Al Ghaf
- **Other:** Lagoon Al Ghaf beats Golden Beach. Closer to Sheikh Zayed Road. Higher-tier finish. Stronger prestige.
- **Valley:** Considerably cheaper. Larger master plan. Emaar's delivery record vs MAF's shorter residential history. Better value per sq ft.
- **Honest read:** Different market. Useful mainly as a reference point — equivalent lifestyle at roughly double the cost.

---

## ANNEX I — QUESTION BANK (52)

`topic` values: `basics`, `amenities`, `services`, `connectivity`, `clusters`, `market`, `comparison`.
All rows `state = 'published'` unless marked otherwise.

### Basics — 10 · audience `both`
| # | slug | question |
|---|---|---|
| 1 | `who-developed-the-valley` | Who is the developer of The Valley? |
| 2 | `where-is-the-valley` | Where exactly is The Valley located? |
| 3 | `is-the-valley-freehold` | Is The Valley freehold? |
| 4 | `property-types-in-the-valley` | What types of property are in The Valley? |
| 5 | `are-there-apartments-in-the-valley` | Are there apartments in The Valley? |
| 6 | `how-big-is-the-valley` | How big is The Valley? |
| 7 | `when-did-the-valley-launch` | When did The Valley launch? |
| 8 | `is-the-valley-gated` | Is The Valley a gated community? |
| 9 | `parking-in-the-valley` | How many parking spaces does each home get? |
| 10 | `ejari-community-name-the-valley` | What community name do I use for Ejari and DEWA? |

### Amenities — 6 · audience `both`
| # | slug | question |
|---|---|---|
| 11 | `what-amenities-does-the-valley-have` | What amenities does The Valley have? |
| 12 | `golden-beach-the-valley` | What is Golden Beach at The Valley? |
| 13 | `kids-dale-the-valley` | What is Kids' Dale? |
| 14 | `sports-village-the-valley` | What's in the Sports Village? |
| 15 | `town-centre-the-valley` | What's in the Town Centre? |
| 16 | `is-the-valley-pet-friendly` | Is The Valley pet friendly? |

⚠️ All six answered as **specified/planned**, never as open. No operational claims.

### Services in community — 8 · audience `both`
| # | slug | question |
|---|---|---|
| 17 | `pharmacy-in-the-valley` | Is there a pharmacy in The Valley? |
| 18 | `doctor-clinic-in-the-valley` | Is there a doctor or clinic in The Valley? |
| 19 | `nursery-in-the-valley` | Is there a nursery in The Valley? |
| 20 | `supermarket-in-the-valley` | Is there a supermarket in The Valley? |
| 21 | `mosque-in-the-valley` | Is there a mosque in The Valley? |
| 22 | `petrol-station-near-the-valley` | Where is the nearest petrol station? |
| 23 | `physiotherapy-in-the-valley` | Is there physiotherapy in The Valley? |
| 24 | `whats-open-late-in-the-valley` | What's open late in The Valley? |

Q24 is generated from `places.hours` — not a static answer.

### Services nearby — 8 · audience `both`
| # | slug | question |
|---|---|---|
| 25 | `is-there-a-school-in-the-valley` | Is there a school in The Valley? |
| 26 | `schools-near-the-valley` | What schools are near The Valley? |
| 27 | `nearest-hospital-to-the-valley` | Where is the nearest hospital? |
| 28 | `vet-near-the-valley` | Is there a vet in The Valley? |
| 29 | `optician-near-the-valley` | Is there an optician near The Valley? |
| 30 | `rta-eye-test-near-the-valley` | Where can I do an RTA eye test? |
| 31 | `nearest-supermarket-to-the-valley` | Where's the nearest big supermarket? |
| 32 | `salons-spas-near-the-valley` | Where are the nearest salons and spas? |

Q25, Q28, Q29 are **honest negatives** — answer "no" plainly, then give alternatives.

### Connectivity — 6 · audience `both`
| # | slug | question |
|---|---|---|
| 33 | `how-far-is-the-valley-from-downtown` | How far is The Valley from Downtown Dubai? |
| 34 | `the-valley-to-dxb-airport` | How far from Dubai International Airport? |
| 35 | `the-valley-to-dubai-outlet-mall` | How far to Dubai Outlet Mall? |
| 36 | `the-valley-to-the-sevens` | How far to The Sevens Stadium? |
| 37 | `metro-near-the-valley` | Is there a metro near The Valley? |
| 38 | `can-i-live-in-the-valley-without-a-car` | Can I live in The Valley without a car? |

Q33 approved wording: Emaar states 20 minutes; realistically 25–30 depending on traffic.

### Clusters — 11 · audience `prospect`
| # | slug | question |
|---|---|---|
| 39 | `communities-within-the-valley` | What are the communities within The Valley? |
| 40 | `which-valley-clusters-are-completed` | Which clusters are completed and handed over? |
| 41 | `when-did-eden-hand-over` | When did Eden hand over? |
| 42 | `eden-vs-nara-vs-talia` | What's the difference between Eden, Nara and Talia? |
| 43 | `largest-3-bedroom-in-the-valley` | Which cluster has the largest 3-bedroom? |
| 44 | `largest-4-bedroom-townhouse-in-the-valley` | Which cluster has the largest 4-bedroom townhouse? |
| 45 | `single-row-townhouses-the-valley` | Which clusters have single-row townhouses? |
| 46 | `how-many-homes-in-each-valley-cluster` | How many homes are in each cluster? |
| 47 | `facade-styles-the-valley` | What are the facade styles in each cluster? |
| 48 | `townhouse-vs-twin-villa-the-valley` | What's the difference between a townhouse and a twin villa? |
| 49 | `standalone-villas-in-the-valley` | Which clusters have standalone villas? |

### Market — 3 · audience `prospect`
| # | slug | question |
|---|---|---|
| 50 | `rent-prices-in-the-valley` | How much is rent in The Valley? |
| 51 | `rental-yield-the-valley` | What's the rental yield in The Valley? |
| 52 | `3-bedroom-townhouse-price-the-valley` | How much does a 3-bed townhouse cost? |

Q51: **5.06% only.** See Annex J.

---

## ANNEX J — PROHIBITED CONTENT

**Never generate, seed, or publish any of the following. No exceptions.**

### Fabricated cluster names
`Floresta` · `Sola` · `Terra Heights` — **do not exist at The Valley.** They appear in an unreliable source. Any source using them is discarded entirely.

### Stale or unsourced figures
| Do not use | Correct value |
|---|---|
| Kids' Dale 10,000 sqm | 13,000 sqm |
| Sports Village 20,000 sqm | 25,000 sqm |
| 250,000 sqm Central Park | Does not appear on Emaar's site — omit |
| Pavilion 33,000 sqm | Single-source — omit |
| "61,000 sqm Area" | Unexplained on Emaar's page — omit |
| ROI 6%, 7%, 7.5% | 5.06% |

### Never-repeat claims
- Any appreciation percentage: "25–40%", "10–20% over launch", "12–18% in 18 months". All unsourced.
- Any inter-emirate drive time. None verified.
- School drive times. None verified.
- "Metro planned by 2030." Unsourced.
- Dubai 2040 Master Plan designation for the E66 corridor. Unverified.
- Any claim that a masterplan amenity is currently open.

### Geographic errors from discarded sources
The Valley is **not** near Expo City, City Centre Me'aisem, or Dubai South. That is Emaar South, a different community.

### Portal artefacts
Bayut lists four "apartments" in The Valley. There is no apartment product. Mis-tagged — do not use as comparables or seed data.

---

## ANNEX K — KNOWN GAPS

Expect nulls. Do not fill.

| Gap | Affects |
|---|---|
| **Amenity operational status — all** | `status_log`, all amenity questions |
| **Service charges — all clusters** | No question exists. Highest-value gap |
| Nima — every specification | `clusters`, `unit_types` |
| Orania handover confirmation | `clusters.handover_actual` |
| Unit counts: Lillia, Nima, Elva, Rivana, Alana | `clusters.unit_count` |
| Plot dimensions: Rivana, Farm Gardens, Farm Grove | `unit_types` |
| Farm Grove facade styles | `clusters.facade_styles` |
| Indoor gym in community | Would be place + question |
| Floor plans, all clusters | Future `media` |
| Current payment plans | `clusters.payment_plan` |
| ECM operational info — waste, maintenance, pool rules | Future questions |
| All drive times except Dubai Outlet Mall | `places.drive_minutes` |
| Masjid hours | `places.hours` |

---

## ANNEX L — CONTROLLED VOCABULARIES

**`questions.topic`** — `basics` · `amenities` · `services` · `connectivity` · `clusters` · `market` · `comparison`

**`places.category`** — `pharmacy` · `clinic` · `hospital` · `dental` · `optical` · `nursery` · `school` · `vet` · `grocery` · `mall` · `salon` · `spa` · `gym` · `fuel` · `mosque`

**`status_log.amenity_key`** — `town-centre` · `golden-beach` · `sports-village` · `kids-dale` · `pocket-parks` · `pavilion` · `pet-park` · `jogging-trails` · `cycling-tracks`

**`comparisons.dimension`** — `price` · `commute` · `schools` · `amenities` · `maturity`

**`living/[category]` routes** — `schools` · `healthcare` · `groceries` · `services` · `getting-around`

No value outside these lists without a proposal.

---

*End of Doc 1. Update only when new verified information is confirmed. Every addition needs a source and a confidence marker.*
