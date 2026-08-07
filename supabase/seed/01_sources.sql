-- 01_sources.sql — one row per source kind referenced in Doc 1
-- Fixed UUIDs so later seeds can reference source_id stably.

insert into sources (id, label, url, kind, retrieved_at, notes) values
  (
    'a1000000-0000-4000-8000-000000000001',
    'Emaar Properties',
    null,
    'developer',
    current_date,
    'Official developer materials and community page. Primary source for Annex A–C official values.'
  ),
  (
    'a1000000-0000-4000-8000-000000000002',
    'Dubai Land Department (DLD)',
    null,
    'government',
    current_date,
    'Ejari community name and registered transaction figures (often via Bayut).'
  ),
  (
    'a1000000-0000-4000-8000-000000000003',
    'Bayut',
    null,
    'portal',
    current_date,
    'Portal market data in Annex G. DLD figures via Bayut where noted.'
  ),
  (
    'a1000000-0000-4000-8000-000000000004',
    'Place / amenity operators',
    null,
    'operator',
    current_date,
    'Operator-published hours, phones, and coordinates for places (Medcare, Aster, Maple Bear, etc.). Includes ECM as community manager.'
  ),
  (
    'a1000000-0000-4000-8000-000000000005',
    'Broker listings (non-authoritative)',
    null,
    'broker',
    current_date,
    'Referenced only to discard stale amenity figures (Annex J). Never used as a fact source for seeded values.'
  ),
  (
    'a1000000-0000-4000-8000-000000000006',
    'Site visit',
    null,
    'site_visit',
    current_date,
    'Reserved for physical verification. No amenity status_log rows until a site visit (Annex B/K).'
  ),
  (
    'a1000000-0000-4000-8000-000000000007',
    'Resident / public reviews',
    null,
    'resident',
    current_date,
    'Used only where Doc 1 cites documented public reviews (e.g. Monoprix notes, DAMAC Hills 2 gym rating in Annex H).'
  )
on conflict (id) do nothing;
