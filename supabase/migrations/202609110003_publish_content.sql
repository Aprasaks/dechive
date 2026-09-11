-- Dechive 2026 rebuild: atomic immutable publication from the current draft.

begin;

create function public.publish_content(
  p_content_id uuid,
  p_expected_version integer,
  p_body_checksum text,
  p_html text,
  p_plain_text text,
  p_markdown text
)
returns table (
  revision_id uuid,
  revision_number integer,
  published_at timestamptz
)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  content_row public.contents%rowtype;
  draft_row public.content_drafts%rowtype;
  next_revision_number integer;
  new_revision_id uuid;
  publication_time timestamptz := now();
  event_type public.change_type;
  update_date_text text;
  book_author text;
  current_checksum text;
begin
  if actor_id is null or not public.is_dechive_owner() then
    raise exception 'Dechive owner access is required.'
      using errcode = '42501';
  end if;

  if p_body_checksum is null or p_body_checksum !~ '^[0-9a-f]{64}$' then
    raise exception 'A valid SHA-256 checksum is required.'
      using errcode = '22023';
  end if;

  select * into content_row
  from public.contents
  where id = p_content_id and deleted_at is null
  for update;

  if content_row.id is null then
    raise exception 'Content not found.' using errcode = 'P0002';
  end if;

  select * into draft_row
  from public.content_drafts
  where content_id = p_content_id
  for update;

  if draft_row.content_id is null then
    raise exception 'Draft not found.' using errcode = 'P0002';
  end if;

  if draft_row.version <> p_expected_version then
    raise exception 'Draft version conflict. Save before publishing.'
      using errcode = '40001';
  end if;

  if nullif(btrim(draft_row.title), '') is null then
    raise exception 'A title is required.' using errcode = '22023';
  end if;

  if nullif(btrim(p_plain_text), '') is null then
    raise exception 'Body content is required.' using errcode = '22023';
  end if;

  if content_row.current_revision_id is not null then
    select cr.body_checksum into current_checksum
    from public.content_revisions cr
    where cr.id = content_row.current_revision_id;

    if current_checksum = p_body_checksum then
      raise exception 'Nothing changed since the current revision.'
        using errcode = '23505';
    end if;
  end if;

  select coalesce(max(cr.revision_number), 0) + 1
    into next_revision_number
  from public.content_revisions cr
  where cr.content_id = p_content_id;

  insert into public.content_revisions (
    content_id,
    revision_number,
    slug,
    title,
    summary,
    body_json,
    body_checksum,
    verification_status,
    created_by,
    published_at
  )
  values (
    p_content_id,
    next_revision_number,
    content_row.slug,
    btrim(draft_row.title),
    btrim(draft_row.summary),
    draft_row.body_json,
    p_body_checksum,
    'reviewed',
    actor_id,
    publication_time
  )
  returning id into new_revision_id;

  insert into public.content_artifacts (
    revision_id,
    html,
    plain_text,
    markdown,
    search_text
  )
  values (
    new_revision_id,
    coalesce(p_html, ''),
    p_plain_text,
    coalesce(p_markdown, ''),
    concat_ws(E'\n', draft_row.title, draft_row.summary, p_plain_text)
  );

  case content_row.type
    when 'knowledge' then
      insert into public.knowledge_revision_details (
        revision_id,
        learning_objectives,
        toc_enabled
      )
      values (
        new_revision_id,
        case
          when jsonb_typeof(draft_row.metadata -> 'learningObjectives') = 'array'
            then draft_row.metadata -> 'learningObjectives'
          else '[]'::jsonb
        end,
        case
          when draft_row.metadata ->> 'tocEnabled' in ('true', 'false')
            then (draft_row.metadata ->> 'tocEnabled')::boolean
          else true
        end
      );
    when 'lecture' then
      insert into public.lecture_revision_details (
        revision_id,
        introduction,
        learning_objectives,
        youtube_url,
        timestamps,
        materials
      )
      values (
        new_revision_id,
        coalesce(draft_row.metadata ->> 'introduction', ''),
        case when jsonb_typeof(draft_row.metadata -> 'learningObjectives') = 'array'
          then draft_row.metadata -> 'learningObjectives' else '[]'::jsonb end,
        nullif(btrim(draft_row.metadata ->> 'youtubeUrl'), ''),
        case when jsonb_typeof(draft_row.metadata -> 'timestamps') = 'array'
          then draft_row.metadata -> 'timestamps' else '[]'::jsonb end,
        case when jsonb_typeof(draft_row.metadata -> 'materials') = 'array'
          then draft_row.metadata -> 'materials' else '[]'::jsonb end
      );
    when 'practice' then
      insert into public.practice_revision_details (
        revision_id,
        result_description,
        demo_url,
        requirements,
        tools,
        estimated_cost
      )
      values (
        new_revision_id,
        coalesce(draft_row.metadata ->> 'resultDescription', ''),
        nullif(btrim(draft_row.metadata ->> 'demoUrl'), ''),
        coalesce(draft_row.metadata ->> 'requirements', ''),
        case when jsonb_typeof(draft_row.metadata -> 'tools') = 'array'
          then draft_row.metadata -> 'tools' else '[]'::jsonb end,
        nullif(btrim(draft_row.metadata ->> 'estimatedCost'), '')
      );
    when 'ai_update' then
      update_date_text := draft_row.metadata ->> 'updateDate';
      if update_date_text is null
        or update_date_text !~ '^\d{4}-\d{2}-\d{2}$' then
        raise exception 'AI Update requires a valid update date.'
          using errcode = '22023';
      end if;
      insert into public.ai_update_revision_details (
        revision_id,
        update_date,
        change_summary
      )
      values (
        new_revision_id,
        update_date_text::date,
        coalesce(draft_row.metadata ->> 'changeSummary', '')
      );
    when 'book' then
      book_author := nullif(btrim(draft_row.metadata ->> 'author'), '');
      if book_author is null then
        raise exception 'A book author is required.' using errcode = '22023';
      end if;
      insert into public.book_revision_details (
        revision_id,
        author,
        publisher,
        publication_date,
        isbn,
        page_count,
        format,
        purchase_links,
        table_of_contents,
        preview
      )
      values (
        new_revision_id,
        book_author,
        nullif(btrim(draft_row.metadata ->> 'publisher'), ''),
        nullif(draft_row.metadata ->> 'publicationDate', '')::date,
        nullif(btrim(draft_row.metadata ->> 'isbn'), ''),
        nullif(draft_row.metadata ->> 'pageCount', '')::integer,
        nullif(btrim(draft_row.metadata ->> 'format'), ''),
        case when jsonb_typeof(draft_row.metadata -> 'purchaseLinks') = 'array'
          then draft_row.metadata -> 'purchaseLinks' else '[]'::jsonb end,
        case when jsonb_typeof(draft_row.metadata -> 'tableOfContents') = 'array'
          then draft_row.metadata -> 'tableOfContents' else '[]'::jsonb end,
        nullif(btrim(draft_row.metadata ->> 'preview'), '')
      );
  end case;

  event_type := case
    when content_row.current_revision_id is null then 'created'::public.change_type
    else 'updated'::public.change_type
  end;

  update public.contents
  set
    status = 'published',
    visibility = 'public',
    current_revision_id = new_revision_id,
    published_at = coalesce(content_row.published_at, publication_time)
  where id = p_content_id;

  insert into public.change_events (
    content_id,
    revision_id,
    change_type,
    visibility,
    checksum,
    payload
  )
  values (
    p_content_id,
    new_revision_id,
    event_type,
    'public',
    p_body_checksum,
    jsonb_build_object(
      'type', content_row.type,
      'slug', content_row.slug,
      'revisionNumber', next_revision_number
    )
  );

  return query
  select new_revision_id, next_revision_number, publication_time;
end;
$$;

revoke all on function public.publish_content(
  uuid,
  integer,
  text,
  text,
  text,
  text
) from public;
grant execute on function public.publish_content(
  uuid,
  integer,
  text,
  text,
  text,
  text
) to authenticated;

comment on function public.publish_content(
  uuid,
  integer,
  text,
  text,
  text,
  text
) is 'Atomically creates an immutable revision and makes it the public current revision.';

commit;
