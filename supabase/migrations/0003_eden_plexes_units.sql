-- ============================================================
-- 0003_eden_plexes_units.sql
-- Delta migration for Doc 4 proposal #12. Applies on top of the
-- already-live 0001_init.sql + 0002_farm_gardens_units_places.sql —
-- does not repeat anything from either.
--
-- Corresponds to the additions documented in docs/schema-current.sql
-- (the authoritative full-schema reference, kept in sync with this
-- file but not itself pushed).
-- ============================================================

-- ---------- #12: unit_types.bathrooms ----------

alter table unit_types add column bathrooms numeric(3,1);

-- Note: unit_types.layout already exists (docs/schema-current.sql, never
-- populated by Farm Gardens) — no schema change needed there, just a
-- populated-data convention: '{facade_style}-{label}', e.g. 'spruce-a'.

-- ---------- #12: plexes table ----------
-- Represents one physical plex/building row (6/8/9/10-plex townhouse
-- configuration), the structural unit every plex-organized cluster
-- (Eden, and others since confirmed) is built from. Deliberately
-- separate from `units` — plex-level facts (size, street-facing side,
-- the unit-number range it spans) describe the row, not a single unit.

create table plexes (
  id            uuid primary key default gen_random_uuid(),
  cluster_id    uuid not null references clusters(id) on delete cascade,
  plex_size     smallint not null,
  street_side   text check (street_side in ('up','down','left','right')),
  range_start   int,
  range_end     int,
  notes         text,
  confidence    confidence_level not null default 'unverified',
  source_id     uuid references sources(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger plexes_updated_at before update on plexes
  for each row execute function set_updated_at();
create trigger plexes_audit after insert or update or delete on plexes
  for each row execute function log_audit();

create index plexes_cluster_idx on plexes (cluster_id);

alter table plexes enable row level security;

create policy pub_plexes on plexes for select to anon, authenticated
  using (exists (select 1 from clusters c
                 where c.id = cluster_id and c.state = 'published' and c.deleted_at is null));
create policy staff_read_plexes on plexes for select to authenticated using (can_edit());
create policy staff_ins_plexes on plexes for insert to authenticated with check (can_edit());
create policy staff_upd_plexes on plexes for update to authenticated using (can_edit()) with check (can_edit());
create policy staff_del_plexes on plexes for delete to authenticated using (can_edit());

grant select on plexes to anon, authenticated;
grant insert, update, delete on plexes to authenticated;

-- ---------- #12: units.bua / th_position / plex_id ----------

alter table units
  add column bua numeric,
  add column th_position text,
  add column plex_id uuid references plexes(id) on delete set null;

create index units_plex_idx on units (plex_id);
