-- ============================================================
-- 0002_farm_gardens_units_places.sql
-- Delta migration for Doc 4 proposals #05-#08. Applies on top of
-- the already-live 0001_init.sql — does not repeat anything from it.
--
-- Corresponds to the additions documented in docs/0001_init.sql
-- (the authoritative full-schema reference, kept in sync with this
-- file but not itself pushed).
-- ============================================================

-- ---------- #05: unit_types.unit_count ----------
-- (clusters.amenities text[] half of #05 superseded by #06 — not applied)

alter table unit_types add column unit_count int;

-- ---------- #06: unit_types floor-plan breakdown ----------

alter table unit_types
  add column suite_area int,
  add column garage_area int,
  add column balcony_area int,
  add column roof_terrace_area int;

-- ---------- #06: units table ----------

alter table profiles add column unit_id uuid; -- fkey added below, after units exists

create table units (
  id             uuid primary key default gen_random_uuid(),
  cluster_id     uuid not null references clusters(id) on delete cascade,
  unit_type_id   uuid not null references unit_types(id) on delete restrict,
  unit_number    text not null,
  plot_number    int,
  facade_style   text,
  lat            numeric(9,6),
  lng            numeric(9,6),
  notes          text,
  sort_order     int not null default 0,
  confidence     confidence_level not null default 'unverified',
  source_id      uuid references sources(id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table profiles
  add constraint profiles_unit_id_fkey
  foreign key (unit_id) references units(id) on delete set null;

create trigger units_updated_at before update on units
  for each row execute function set_updated_at();
create trigger units_audit after insert or update or delete on units
  for each row execute function log_audit();

create index units_cluster_idx on units (cluster_id, unit_type_id);
create index units_geo_idx     on units (lat, lng);

alter table units enable row level security;

create policy pub_units on units for select to anon, authenticated
  using (exists (select 1 from clusters c
                 where c.id = cluster_id and c.state = 'published' and c.deleted_at is null));
create policy staff_read_units on units for select to authenticated using (can_edit());
create policy staff_ins_units on units for insert to authenticated with check (can_edit());
create policy staff_upd_units on units for update to authenticated using (can_edit()) with check (can_edit());
create policy staff_del_units on units for delete to authenticated using (can_edit());

grant select on units to anon, authenticated;
grant insert, update, delete on units to authenticated;

-- ---------- #06: facade_style_descriptions table ----------
-- Styles aren't shared vocabulary across clusters (Eden's May Bell/
-- Iris/Spruce have nothing to do with Farm Gardens' Horizon/Earth),
-- so this is scoped per cluster rather than a Valley-wide catalog.

create table facade_style_descriptions (
  id           uuid primary key default gen_random_uuid(),
  cluster_id   uuid not null references clusters(id) on delete cascade,
  style_name   text not null,
  description  text,
  sort_order   int not null default 0,
  confidence   confidence_level not null default 'unverified',
  source_id    uuid references sources(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (cluster_id, style_name)
);

create trigger facade_style_descriptions_updated_at before update on facade_style_descriptions
  for each row execute function set_updated_at();
create trigger facade_style_descriptions_audit after insert or update or delete on facade_style_descriptions
  for each row execute function log_audit();

create index fsd_cluster_idx on facade_style_descriptions (cluster_id);

alter table facade_style_descriptions enable row level security;

create policy pub_fsd on facade_style_descriptions for select to anon, authenticated
  using (exists (select 1 from clusters c
                 where c.id = cluster_id and c.state = 'published' and c.deleted_at is null));
create policy staff_read_facade_style_descriptions on facade_style_descriptions for select to authenticated using (can_edit());
create policy staff_ins_facade_style_descriptions on facade_style_descriptions for insert to authenticated with check (can_edit());
create policy staff_upd_facade_style_descriptions on facade_style_descriptions for update to authenticated using (can_edit()) with check (can_edit());
create policy staff_del_facade_style_descriptions on facade_style_descriptions for delete to authenticated using (can_edit());

grant select on facade_style_descriptions to anon, authenticated;
grant insert, update, delete on facade_style_descriptions to authenticated;

-- ---------- #06: places.cluster_id / parent_place_id / google_place_id ----------

alter table places
  add column cluster_id uuid references clusters(id) on delete cascade,
  add column parent_place_id uuid references places(id) on delete set null,
  add column google_place_id text;

create index places_cluster_idx on places (cluster_id);
create index places_parent_idx  on places (parent_place_id);

-- Replace pub_places: a cluster-scoped place also requires its cluster
-- to be published, closing the gap where a draft cluster's place could
-- otherwise leak (mirrors pub_unit_types' existing pattern).
drop policy pub_places on places;
create policy pub_places on places for select to anon, authenticated
  using (
    state = 'published' and deleted_at is null
    and (
      cluster_id is null
      or exists (select 1 from clusters c
                 where c.id = cluster_id and c.state = 'published' and c.deleted_at is null)
    )
  );

-- ---------- #08: media_links.subject_type ----------
-- Verify the constraint name below matches the live database before
-- running (\d media_links in psql) — Postgres auto-names unnamed
-- inline CHECK constraints as <table>_<column>_check, which is what
-- this assumes, but confirm rather than trust blindly.

alter table media_links drop constraint media_links_subject_type_check;
alter table media_links add constraint media_links_subject_type_check
  check (subject_type in
         ('cluster','place','question','status_log','community','post',
          'unit_type','facade_style_description'));
