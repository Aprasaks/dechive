begin;

create or replace function public.save_content_draft(
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

  update public.contents as content_row
  set slug = p_slug
  where content_row.id = p_content_id
    and content_row.deleted_at is null;

  if not found then
    raise exception 'Content not found.'
      using errcode = 'P0002';
  end if;

  update public.content_drafts as draft_row
  set
    title = coalesce(p_title, ''),
    summary = coalesce(p_summary, ''),
    body_json = p_body_json,
    metadata = p_metadata,
    updated_by = actor_id
  where draft_row.content_id = p_content_id
    and draft_row.version = p_expected_version
  returning draft_row.* into saved_draft;

  if saved_draft.content_id is null then
    raise exception 'Draft version conflict. Reload before saving again.'
      using errcode = '40001';
  end if;

  return query
  select saved_draft.version, saved_draft.updated_at;
end;
$$;

comment on function public.save_content_draft(
  uuid,
  integer,
  text,
  text,
  text,
  jsonb,
  jsonb
) is 'Saves a draft with unambiguous column references and optimistic version checks.';

commit;
