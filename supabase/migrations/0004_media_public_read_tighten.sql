-- Doc 4 #18 — Tighten anon/authenticated read on media + media_links
-- so only assets linked to published subjects are publicly selectable.
-- Staff keep full read via new staff_read_* policies (can_edit()).

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

drop policy if exists pub_media on media;
drop policy if exists pub_media_links on media_links;

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

create policy staff_read_media on media for select to authenticated
  using (can_edit());

create policy staff_read_media_links on media_links for select to authenticated
  using (can_edit());

grant execute on function public.media_subject_is_published(text, uuid) to anon, authenticated;
