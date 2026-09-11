-- Dechive 2026 rebuild: atomic content creation and conflict-safe draft saves.

begin;

create function public.create_content_draft(
  p_type public.content_type,
  p_slug text,
  p_title text default ''
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  new_content_id uuid;
begin
  if actor_id is null or not public.is_dechive_owner() then
    raise exception 'Dechive owner access is required.'
      using errcode = '42501';
  end if;

  if p_slug is null or p_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then
    raise exception 'Slug must contain lowercase letters, numbers, and hyphens only.'
      using errcode = '22023';
  end if;

  insert into public.contents (
    type,
    slug,
    status,
    visibility,
    created_by
  )
  values (
    p_type,
    p_slug,
    'draft',
    'private'::public.content_visibility,
    actor_id
  )
  returning id into new_content_id;

  insert into public.content_drafts (
    content_id,
    title,
    updated_by
  )
  values (
    new_content_id,
    coalesce(p_title, ''),
    actor_id
  );

  return new_content_id;
end;
$$;

create function public.save_content_draft(
  p_content_id uuid,
  p_expected_version integer,
  p_slug text,
  p_title text,
  p_summary text,
  p_body_json jsonb,
  p_metadata jsonb
)
returns table (
  version integer,
  updated_at timestamptz
)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  saved_draft public.content_drafts%rowtype;
begin
  if actor_id is null or not public.is_dechive_owner() then
    raise exception 'Dechive owner access is required.'
      using errcode = '42501';
  end if;

  if p_expected_version is null or p_expected_version < 1 then
    raise exception 'A valid draft version is required.'
      using errcode = '22023';
  end if;

  if p_slug is null or p_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then
    raise exception 'Slug must contain lowercase letters, numbers, and hyphens only.'
      using errcode = '22023';
  end if;

  if jsonb_typeof(p_body_json) <> 'object'
    or p_body_json ->> 'type' <> 'doc' then
    raise exception 'The draft body must be a TipTap document.'
      using errcode = '22023';
  end if;

  if jsonb_typeof(p_metadata) <> 'object' then
    raise exception 'Draft metadata must be a JSON object.'
      using errcode = '22023';
  end if;

  update public.contents
  set slug = p_slug
  where id = p_content_id
    and deleted_at is null;

  if not found then
    raise exception 'Content not found.'
      using errcode = 'P0002';
  end if;

  update public.content_drafts
  set
    title = coalesce(p_title, ''),
    summary = coalesce(p_summary, ''),
    body_json = p_body_json,
    metadata = p_metadata,
    updated_by = actor_id
  where content_id = p_content_id
    and version = p_expected_version
  returning * into saved_draft;

  if saved_draft.content_id is null then
    raise exception 'Draft version conflict. Reload before saving again.'
      using errcode = '40001';
  end if;

  return query
  select saved_draft.version, saved_draft.updated_at;
end;
$$;

revoke all on function public.create_content_draft(
  public.content_type,
  text,
  text
) from public;
grant execute on function public.create_content_draft(
  public.content_type,
  text,
  text
) to authenticated;

revoke all on function public.save_content_draft(
  uuid,
  integer,
  text,
  text,
  text,
  jsonb,
  jsonb
) from public;
grant execute on function public.save_content_draft(
  uuid,
  integer,
  text,
  text,
  text,
  jsonb,
  jsonb
) to authenticated;

comment on function public.create_content_draft(
  public.content_type,
  text,
  text
) is 'Creates the stable content identity and its first mutable draft atomically.';

comment on function public.save_content_draft(
  uuid,
  integer,
  text,
  text,
  text,
  jsonb,
  jsonb
) is 'Saves a draft only when the caller has the expected version, preventing stale overwrites.';

commit;
