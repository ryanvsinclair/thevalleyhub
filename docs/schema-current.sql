-- ============================================================
-- 0001_init.sql — The Valley community site
-- Complete schema, RLS, triggers, views, grants
--
-- v1.1 amendments (7 Aug 2026, second review):
--   1. Audit trigger loop now includes media_links, communities,
--      redirects, sources — log_audit()'s media_links branch was
--      previously unreachable, and every admin-editable table
--      (Doc 2 §5.2) is now uniformly audited.
--   2. staff_read policies use can_edit(), not is_staff() —
--      a self-registered viewer profile must not see drafts.
--      is_staff() is retained for roadmap viewer-tier access.
--   3. Storage block carries the Doc 2 step 2.2 fallback note.
-- ============================================================

create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- ---------- enums ----------

create type app_role         as enum ('owner', 'editor', 'viewer');
create type publish_state    as enum ('draft', 'published', 'archived');
create type confidence_level as enum ('official', 'corroborated', 'unverified');

-- ---------- shared helpers ----------

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------- profiles & role helpers ----------

create table profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        citext,
  display_name text,
  role         app_role not null default 'viewer',
  unit_id      uuid, -- fkey added after `units` exists, see below
  created_at   timestamptz not null default now()
);

create or replace function app_role_of(uid uuid default auth.uid())
returns app_role
language sql stable security definer
set search_path = public
as $$ select role from profiles where id = uid $$;

-- Retained for roadmap viewer-tier access (resident verification etc.).
-- No V1 policy uses it — V1 draft visibility is can_edit() only.
create or replace function is_staff()
returns boolean language sql stable
as $$ select app_role_of() is not null $$;

create or replace function can_edit()
returns boolean language sql stable
as $$ select app_role_of() in ('owner', 'editor') $$;

create or replace function handle_new_user()
returns trigger language plpgsql security definer
set search_path = public
as $$
begin
  insert into profiles (id, email, role)
  values (
    new.id,
    new.email,
    case when (select count(*) from profiles) = 0 then 'owner'::app_role
         else 'viewer'::app_role end
  );
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------- sources ----------

create table sources (
  id           uuid primary key default gen_random_uuid(),
  label        text not null,
  url          text,
  kind         text not null check (kind in
                 ('developer','government','operator','portal','site_visit','broker','resident')),
  retrieved_at date not null default current_date,
  notes        text,
  created_at   timestamptz not null default now()
);

-- ---------- clusters ----------

create table clusters (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null check (slug ~ '^[a-z0-9-]+$'),
  name             text not null,
  phase            smallint,
  product_type     text check (product_type in ('townhouse','twin_villa','villa')),
  unit_count       int,
  facade_styles    text[],
  single_row       boolean,
  plex_config      text,
  launch_date      date,
  handover_target  date,
  handover_actual  date,
  price_from_aed   bigint,
  payment_plan     text,
  summary          text,
  positioning      text,
  body             text,
  notes            text,
  meta_title       text,
  meta_description text,
  sort_order       int not null default 0,
  confidence       confidence_level not null default 'unverified',
  source_id        uuid references sources(id) on delete set null,
  verified_at      date,
  state            publish_state not null default 'draft',
  deleted_at       timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ---------- facade style descriptions ----------
-- Styles aren't shared vocabulary across clusters (Eden's May Bell/
-- Iris/Spruce have nothing to do with Farm Gardens' Horizon/Earth),
-- so this is scoped per cluster rather than a Valley-wide catalog.
-- Deliberately additive/separate from clusters.facade_styles (text[])
-- rather than restructuring that column — it's already populated for
-- six clusters (Doc 4 #07).

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

create table unit_types (
  id                   uuid primary key default gen_random_uuid(),
  cluster_id           uuid not null references clusters(id) on delete cascade,
  bedrooms             smallint not null,
  label                text,
  bua_min              int,
  bua_max              int,
  plot_min             int,
  plot_max             int,
  suite_area           int,
  garage_area          int,
  balcony_area         int,
  roof_terrace_area    int,
  unit_count           int,
  layout               text,
  bathrooms            numeric(3,1),
  maids_room           boolean,
  ground_floor_bedroom boolean,
  private_pool         boolean,
  corner_unit          boolean,
  notes                text,
  sort_order           int not null default 0,
  confidence           confidence_level not null default 'unverified',
  source_id            uuid references sources(id) on delete set null,
  verified_at          date,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- ---------- plexes ----------
-- One physical plex/building row (6/8/9/10-plex townhouse
-- configuration) — the structural unit every plex-organized cluster
-- (Eden, and others confirmed since) is built from. Plex-level facts
-- (size, street-facing side, the unit-number range it spans) describe
-- the row, not any single unit (Doc 4 #12).

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

-- ---------- units ----------
-- Individual physical units, distinct from unit_types (a floor-plan
-- template). Foundation for the future interactive map / per-unit
-- drive times (Doc 4 #06). `plex_id`/`th_position` (Doc 4 #12) are
-- null for standalone-villa clusters (e.g. Farm Gardens) — they only
-- apply where units are organized into plex rows.

create table units (
  id             uuid primary key default gen_random_uuid(),
  cluster_id     uuid not null references clusters(id) on delete cascade,
  unit_type_id   uuid not null references unit_types(id) on delete restrict,
  unit_number    text not null,
  plot_number    int,
  facade_style   text,
  bua            numeric,
  plex_id        uuid references plexes(id) on delete set null,
  th_position    text,
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

-- ---------- places ----------

create table places (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null check (slug ~ '^[a-z0-9-]+$'),
  name             text not null,
  category         text not null,
  subcategory      text,
  cluster_id       uuid references clusters(id) on delete cascade,
  parent_place_id  uuid references places(id) on delete set null,
  google_place_id  text,
  in_community     boolean not null default false,
  operator         text,
  address          text,
  lat              numeric(9,6),
  lng              numeric(9,6),
  phone            text,
  website          text,
  hours            jsonb,
  drive_minutes    int,
  drive_verified   boolean not null default false,
  summary          text,
  notes            text,
  meta_title       text,
  meta_description text,
  sort_order       int not null default 0,
  confidence       confidence_level not null default 'unverified',
  source_id        uuid references sources(id) on delete set null,
  verified_at      date,
  state            publish_state not null default 'draft',
  deleted_at       timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ---------- status log ----------

create table status_log (
  id           uuid primary key default gen_random_uuid(),
  subject_type text not null check (subject_type in ('cluster','amenity','place','community')),
  subject_id   uuid,
  amenity_key  text,
  status       text not null check (status in
                 ('planned','under_construction','partially_open','open','delivered','closed')),
  observed_on  date not null default current_date,
  note         text,
  confidence   confidence_level not null default 'unverified',
  source_id    uuid references sources(id) on delete set null,
  created_at   timestamptz not null default now()
);

create view current_status
with (security_invoker = on) as
select distinct on (subject_type, subject_id, amenity_key)
  subject_type, subject_id, amenity_key, status, observed_on, note, confidence
from status_log
order by subject_type, subject_id, amenity_key, observed_on desc;

-- ---------- questions ----------

-- is_generated: Q24 ("what's open late") is computed from places.hours
-- rather than stored; Doc 2 step 3.7 requires it flagged.
create table questions (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null check (slug ~ '^[a-z0-9-]+$'),
  question         text not null,
  answer_short     text,
  answer_long      text,
  audience         text not null check (audience in ('prospect','resident','both')),
  topic            text not null,
  cluster_id       uuid references clusters(id) on delete set null,
  place_id         uuid references places(id) on delete set null,
  ask_count        int not null default 0,
  is_generated     boolean not null default false,
  meta_title       text,
  meta_description text,
  sort_order       int not null default 0,
  confidence       confidence_level not null default 'unverified',
  source_id        uuid references sources(id) on delete set null,
  verified_at      date,
  state            publish_state not null default 'draft',
  deleted_at       timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ---------- competitor set ----------

create table communities (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null check (slug ~ '^[a-z0-9-]+$'),
  name       text not null,
  developer  text,
  summary    text,
  sort_order int not null default 0,
  state      publish_state not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table comparisons (
  id               uuid primary key default gen_random_uuid(),
  community_id     uuid not null references communities(id) on delete cascade,
  dimension        text not null,
  valley_advantage text,
  other_advantage  text,
  honest_read      text,
  sort_order       int not null default 0,
  confidence       confidence_level not null default 'unverified',
  source_id        uuid references sources(id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ---------- blog ----------

create table posts (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null check (slug ~ '^[a-z0-9-]+$'),
  title            text not null,
  excerpt          text,
  body             text,
  topic            text,
  cluster_id       uuid references clusters(id) on delete set null,
  meta_title       text,
  meta_description text,
  published_at     timestamptz,
  state            publish_state not null default 'draft',
  deleted_at       timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ---------- media ----------

create table media (
  id           uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  kind         text not null default 'photo'
                 check (kind in ('photo','floorplan','document','brochure')),
  alt_text     text,
  caption      text,
  credit       text,
  captured_on  date,
  lat          numeric(9,6),
  lng          numeric(9,6),
  width        int,
  height       int,
  uploaded_by  uuid references profiles(id) on delete set null,
  created_at   timestamptz not null default now()
);

create table media_links (
  media_id     uuid not null references media(id) on delete cascade,
  subject_type text not null check (subject_type in
                 ('cluster','place','question','status_log','community','post',
                  'unit_type','facade_style_description')),
  subject_id   uuid not null,
  sort_order   int not null default 0,
  is_primary   boolean not null default false,
  primary key (media_id, subject_type, subject_id)
);
-- unit_type / facade_style_description (Doc 4 #08): an image is linked
-- to the shared template (unit_types row) or the shared style
-- (facade_style_descriptions row), never duplicated across every
-- individual units row that happens to match — e.g. all 79 Farm
-- Gardens 4-bed units share one floor-plan image via unit_type_id,
-- not 79 separate links. 'unit' deliberately not added — no
-- per-physical-unit photos planned yet.

-- Doc 2 step 2.2: if db push fails on this block with
-- "must be owner of table objects", comment out from here to the
-- end of the storage policies, re-push, and create the bucket plus
-- the three policies via the dashboard [R]. Managed-schema
-- restriction, not a schema error. Never `alter table storage.*`.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- ---------- redirects ----------

create table redirects (
  id          uuid primary key default gen_random_uuid(),
  from_path   text unique not null,
  to_path     text not null,
  status_code int not null default 301 check (status_code in (301, 302, 308)),
  reason      text,
  created_at  timestamptz not null default now()
);

-- ---------- audit ----------

create table audit_log (
  id         bigserial primary key,
  actor_id   uuid references profiles(id) on delete set null,
  table_name text not null,
  record_id  uuid,
  action     text not null,
  diff       jsonb,
  created_at timestamptz not null default now()
);

-- media_links has no id column (composite primary key) — branch on
-- table name for record_id.
create or replace function log_audit()
returns trigger language plpgsql security definer
set search_path = public
as $$
declare rec_id uuid;
begin
  if tg_table_name = 'media_links' then
    rec_id := coalesce(new.media_id, old.media_id);
  else
    rec_id := coalesce(new.id, old.id);
  end if;

  insert into audit_log (actor_id, table_name, record_id, action, diff)
  values (
    auth.uid(),
    tg_table_name,
    rec_id,
    lower(tg_op),
    case when tg_op = 'UPDATE'
      then jsonb_build_object('before', to_jsonb(old), 'after', to_jsonb(new))
      else to_jsonb(coalesce(new, old)) end
  );
  return coalesce(new, old);
end $$;

-- ---------- triggers ----------

do $$
declare t text;
begin
  foreach t in array array['clusters','unit_types','units','plexes','places',
                           'facade_style_descriptions','questions',
                           'communities','comparisons','posts'] loop
    execute format(
      'create trigger %I_updated_at before update on %I
       for each row execute function set_updated_at()', t, t);
  end loop;

  -- Every admin-editable table is audited (Doc 2 §5.2), including
  -- media_links — the log_audit() branch above exists for it.
  foreach t in array array['clusters','unit_types','units','plexes','places',
                           'facade_style_descriptions','questions',
                           'status_log','communities','comparisons','posts',
                           'media','media_links','redirects','sources'] loop
    execute format(
      'create trigger %I_audit after insert or update or delete on %I
       for each row execute function log_audit()', t, t);
  end loop;
end $$;

-- ---------- indexes ----------

create index clusters_state_idx     on clusters (state) where deleted_at is null;
create index clusters_phase_idx     on clusters (phase);
create index unit_types_cluster_idx on unit_types (cluster_id, bedrooms);

create index units_cluster_idx      on units (cluster_id, unit_type_id);
create index units_geo_idx          on units (lat, lng);
create index units_plex_idx         on units (plex_id);

create index plexes_cluster_idx     on plexes (cluster_id);

create index fsd_cluster_idx        on facade_style_descriptions (cluster_id);

create index places_category_idx    on places (category, in_community) where deleted_at is null;
create index places_state_idx       on places (state) where deleted_at is null;
create index places_geo_idx         on places (lat, lng);
create index places_cluster_idx     on places (cluster_id);
create index places_parent_idx      on places (parent_place_id);

create index questions_audience_idx on questions (audience, topic) where deleted_at is null;
create index questions_ask_idx      on questions (ask_count desc);
create index questions_cluster_idx  on questions (cluster_id);
create index questions_place_idx    on questions (place_id);

create index status_subject_idx     on status_log (subject_type, subject_id, observed_on desc);
create index status_amenity_idx     on status_log (amenity_key, observed_on desc);

create index posts_published_idx    on posts (published_at desc) where state = 'published';
create index media_links_subj_idx   on media_links (subject_type, subject_id, sort_order);
create index audit_record_idx       on audit_log (table_name, record_id, created_at desc);

-- ---------- RLS ----------

alter table profiles     enable row level security;
alter table sources      enable row level security;
alter table clusters     enable row level security;
alter table unit_types   enable row level security;
alter table units        enable row level security;
alter table plexes       enable row level security;
alter table facade_style_descriptions enable row level security;
alter table places       enable row level security;
alter table status_log   enable row level security;
alter table questions    enable row level security;
alter table communities  enable row level security;
alter table comparisons  enable row level security;
alter table posts        enable row level security;
alter table media        enable row level security;
alter table media_links  enable row level security;
alter table redirects    enable row level security;
alter table audit_log    enable row level security;

create policy pub_clusters on clusters for select to anon, authenticated
  using (state = 'published' and deleted_at is null);
create policy pub_places on places for select to anon, authenticated
  using (
    state = 'published' and deleted_at is null
    and (
      cluster_id is null
      or exists (select 1 from clusters c
                 where c.id = cluster_id and c.state = 'published' and c.deleted_at is null)
    )
  );
create policy pub_questions on questions for select to anon, authenticated
  using (state = 'published' and deleted_at is null);
create policy pub_posts on posts for select to anon, authenticated
  using (state = 'published' and deleted_at is null
         and (published_at is null or published_at <= now()));
create policy pub_communities on communities for select to anon, authenticated
  using (state = 'published');

create policy pub_unit_types on unit_types for select to anon, authenticated
  using (exists (select 1 from clusters c
                 where c.id = cluster_id and c.state = 'published' and c.deleted_at is null));
create policy pub_units on units for select to anon, authenticated
  using (exists (select 1 from clusters c
                 where c.id = cluster_id and c.state = 'published' and c.deleted_at is null));
create policy pub_plexes on plexes for select to anon, authenticated
  using (exists (select 1 from clusters c
                 where c.id = cluster_id and c.state = 'published' and c.deleted_at is null));
create policy pub_fsd on facade_style_descriptions for select to anon, authenticated
  using (exists (select 1 from clusters c
                 where c.id = cluster_id and c.state = 'published' and c.deleted_at is null));
create policy pub_comparisons on comparisons for select to anon, authenticated
  using (exists (select 1 from communities m
                 where m.id = community_id and m.state = 'published'));

create policy pub_sources     on sources     for select to anon, authenticated using (true);
create policy pub_status      on status_log  for select to anon, authenticated using (true);
-- Doc 4 #18: public media only when linked to a published subject.
create or replace function public.media_subject_is_published(
  p_subject_type text,
  p_subject_id uuid
) returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select case p_subject_type
    when 'cluster' then exists (
      select 1 from clusters c
      where c.id = p_subject_id and c.state = 'published' and c.deleted_at is null
    )
    when 'place' then exists (
      select 1 from places p
      where p.id = p_subject_id and p.state = 'published' and p.deleted_at is null
        and (
          p.cluster_id is null
          or exists (
            select 1 from clusters c
            where c.id = p.cluster_id and c.state = 'published' and c.deleted_at is null
          )
        )
    )
    when 'question' then exists (
      select 1 from questions q
      where q.id = p_subject_id and q.state = 'published' and q.deleted_at is null
    )
    when 'post' then exists (
      select 1 from posts po
      where po.id = p_subject_id and po.state = 'published' and po.deleted_at is null
    )
    when 'community' then exists (
      select 1 from communities m
      where m.id = p_subject_id and m.state = 'published'
    )
    when 'status_log' then exists (
      select 1 from status_log s where s.id = p_subject_id
    )
    when 'unit_type' then exists (
      select 1 from unit_types ut
      join clusters c on c.id = ut.cluster_id
      where ut.id = p_subject_id
        and c.state = 'published' and c.deleted_at is null
    )
    when 'facade_style_description' then exists (
      select 1 from facade_style_descriptions f
      join clusters c on c.id = f.cluster_id
      where f.id = p_subject_id
        and c.state = 'published' and c.deleted_at is null
    )
    else false
  end;
$$;

create policy pub_media_links on media_links for select to anon, authenticated
  using (public.media_subject_is_published(subject_type, subject_id));

create policy pub_media on media for select to anon, authenticated
  using (
    exists (
      select 1 from media_links ml
      where ml.media_id = media.id
        and public.media_subject_is_published(ml.subject_type, ml.subject_id)
    )
  );
create policy pub_redirects   on redirects   for select to anon, authenticated using (true);

-- Draft visibility is can_edit() only. is_staff() would admit any
-- self-registered viewer profile; drafts hold unverified content
-- that must not be readable by anyone but the editor(s).
do $$
declare t text;
begin
  foreach t in array array['clusters','places','questions','posts','communities',
                           'unit_types','units','plexes','facade_style_descriptions','comparisons',
                           'media','media_links'] loop
    execute format(
      'create policy staff_read_%I on %I for select to authenticated using (can_edit())', t, t);
  end loop;

  foreach t in array array['clusters','unit_types','units','plexes','facade_style_descriptions',
                           'places','questions','status_log',
                           'communities','comparisons','posts','media','media_links',
                           'redirects','sources'] loop
    execute format('create policy staff_ins_%I on %I for insert to authenticated with check (can_edit())', t, t);
    execute format('create policy staff_upd_%I on %I for update to authenticated using (can_edit()) with check (can_edit())', t, t);
    execute format('create policy staff_del_%I on %I for delete to authenticated using (can_edit())', t, t);
  end loop;
end $$;

create policy own_profile on profiles for select to authenticated using (id = auth.uid());
create policy read_audit  on audit_log for select to authenticated using (can_edit());

-- Storage policies — covered by the same Doc 2 step 2.2 fallback as
-- the bucket insert above.
create policy media_public_read on storage.objects for select to anon, authenticated
  using (bucket_id = 'media');
create policy media_staff_write on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and can_edit());
create policy media_staff_del on storage.objects for delete to authenticated
  using (bucket_id = 'media' and can_edit());

-- ---------- grants (auto-expose is OFF) ----------

grant usage on schema public to anon, authenticated;

grant select on
  clusters, unit_types, units, facade_style_descriptions, places, questions,
  status_log, current_status,
  communities, comparisons, posts, media, media_links, redirects, sources
to anon, authenticated;

grant insert, update, delete on
  clusters, unit_types, units, facade_style_descriptions, places, questions, status_log,
  communities, comparisons, posts, media, media_links, redirects, sources
to authenticated;

grant select on profiles, audit_log to authenticated;
grant usage, select on all sequences in schema public to authenticated;
grant execute on function public.media_subject_is_published(text, uuid) to anon, authenticated;
