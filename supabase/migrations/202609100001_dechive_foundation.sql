-- Dechive 2026 rebuild: canonical content, immutable revisions, provenance,
-- explicit knowledge relations, media metadata, and Jarvis change events.

begin;

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create type public.content_type as enum (
  'knowledge', 'lecture', 'practice', 'ai_update', 'book'
);
create type public.content_status as enum ('draft', 'published', 'archived');
create type public.content_visibility as enum ('public', 'private', 'unlisted');
create type public.member_role as enum ('owner');
create type public.verification_status as enum (
  'unverified', 'reviewed', 'verified', 'needs_review'
);
create type public.source_type as enum (
  'official_documentation', 'research_paper', 'book', 'article',
  'video', 'dataset', 'other'
);
create type public.source_relationship as enum (
  'supports', 'contradicts', 'background', 'example', 'further_reading'
);
create type public.content_relation_type as enum (
  'prerequisite', 'next', 'uses', 'explains', 'practice_for', 'affected_by'
);
create type public.asset_usage as enum (
  'cover', 'body', 'card_news', 'result', 'material', 'download', 'preview'
);
create type public.change_type as enum (
  'created', 'updated', 'reverified', 'unpublished', 'deleted'
);
create type public.suggestion_type as enum (
  'reverify', 'source_outdated', 'possible_contradiction',
  'broken_source', 'update_candidate'
);
create type public.suggestion_status as enum ('open', 'accepted', 'rejected', 'ignored');

create table public.site_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role public.member_role not null default 'owner',
  created_at timestamptz not null default now()
);

create table public.contents (
  id uuid primary key default gen_random_uuid(),
  type public.content_type not null,
  slug text not null,
  status public.content_status not null default 'draft',
  visibility public.content_visibility not null default 'private',
  current_revision_id uuid,
  jarvis_sync_enabled boolean not null default false,
  created_by uuid not null references auth.users(id),
  published_at timestamptz,
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint contents_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint contents_slug_unique unique (slug)
);

create table public.content_drafts (
  content_id uuid primary key references public.contents(id) on delete cascade,
  title text not null default '',
  summary text not null default '',
  body_json jsonb not null default '{"type":"doc","content":[]}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  version integer not null default 1 check (version > 0),
  updated_by uuid not null references auth.users(id),
  updated_at timestamptz not null default now()
);

create table public.content_revisions (
  id uuid primary key default gen_random_uuid(),
  content_id uuid not null references public.contents(id) on delete restrict,
  revision_number integer not null check (revision_number > 0),
  slug text not null,
  title text not null,
  summary text not null default '',
  body_json jsonb not null,
  body_checksum text not null,
  verification_status public.verification_status not null default 'unverified',
  verified_at timestamptz,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  published_at timestamptz not null default now(),
  constraint content_revisions_checksum_format check (body_checksum ~ '^[0-9a-f]{64}$'),
  constraint content_revisions_content_number_unique unique (content_id, revision_number)
);

alter table public.contents
  add constraint contents_current_revision_fk
  foreign key (current_revision_id)
  references public.content_revisions(id)
  on delete restrict;

create table public.content_artifacts (
  revision_id uuid primary key references public.content_revisions(id) on delete restrict,
  html text not null,
  plain_text text not null,
  markdown text not null,
  search_text text not null,
  search_vector tsvector generated always as (
    to_tsvector('simple', coalesce(search_text, ''))
  ) stored,
  generated_at timestamptz not null default now()
);

create table public.knowledge_revision_details (
  revision_id uuid primary key references public.content_revisions(id) on delete restrict,
  learning_objectives jsonb not null default '[]'::jsonb,
  toc_enabled boolean not null default true
);

create table public.lecture_revision_details (
  revision_id uuid primary key references public.content_revisions(id) on delete restrict,
  introduction text not null default '',
  learning_objectives jsonb not null default '[]'::jsonb,
  youtube_url text,
  timestamps jsonb not null default '[]'::jsonb,
  materials jsonb not null default '[]'::jsonb
);

create table public.practice_revision_details (
  revision_id uuid primary key references public.content_revisions(id) on delete restrict,
  result_description text not null default '',
  demo_url text,
  requirements text not null default '',
  tools jsonb not null default '[]'::jsonb,
  estimated_cost text
);

create table public.ai_update_revision_details (
  revision_id uuid primary key references public.content_revisions(id) on delete restrict,
  update_date date not null,
  change_summary text not null
);

create table public.book_revision_details (
  revision_id uuid primary key references public.content_revisions(id) on delete restrict,
  author text not null,
  publisher text,
  publication_date date,
  isbn text,
  page_count integer check (page_count is null or page_count > 0),
  format text,
  purchase_links jsonb not null default '[]'::jsonb,
  table_of_contents jsonb not null default '[]'::jsonb,
  preview text
);

create table public.sources (
  id uuid primary key default gen_random_uuid(),
  type public.source_type not null,
  url text not null,
  title text not null,
  publisher text,
  author text,
  published_at timestamptz,
  captured_at timestamptz,
  accessed_at timestamptz not null default now(),
  archived_url text,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  constraint sources_url_unique unique (url)
);

create table public.revision_sources (
  revision_id uuid not null references public.content_revisions(id) on delete restrict,
  source_id uuid not null references public.sources(id) on delete restrict,
  relationship public.source_relationship not null default 'supports',
  claim_note text,
  position integer not null default 0 check (position >= 0),
  primary key (revision_id, source_id)
);

create table public.content_relations (
  id uuid primary key default gen_random_uuid(),
  from_revision_id uuid not null references public.content_revisions(id) on delete restrict,
  to_content_id uuid not null references public.contents(id) on delete restrict,
  relation_type public.content_relation_type not null,
  note text,
  position integer not null default 0 check (position >= 0),
  constraint content_relations_unique unique (from_revision_id, to_content_id, relation_type)
);

create table public.verification_events (
  id uuid primary key default gen_random_uuid(),
  revision_id uuid not null references public.content_revisions(id) on delete restrict,
  status public.verification_status not null,
  method text not null,
  note text,
  evidence jsonb not null default '[]'::jsonb,
  verified_by uuid not null references auth.users(id),
  occurred_at timestamptz not null default now()
);

create table public.assets (
  id uuid primary key default gen_random_uuid(),
  bucket_id text not null,
  object_path text not null,
  original_filename text not null,
  mime_type text not null,
  byte_size bigint not null check (byte_size >= 0),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  alt_text text,
  checksum text not null,
  uploaded_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint assets_checksum_format check (checksum ~ '^[0-9a-f]{64}$'),
  constraint assets_bucket_path_unique unique (bucket_id, object_path)
);

create table public.revision_assets (
  revision_id uuid not null references public.content_revisions(id) on delete restrict,
  asset_id uuid not null references public.assets(id) on delete restrict,
  usage public.asset_usage not null,
  caption text,
  position integer not null default 0 check (position >= 0),
  primary key (revision_id, asset_id, usage)
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  created_at timestamptz not null default now(),
  constraint tags_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);
create unique index tags_label_lower_unique on public.tags (lower(label));

create table public.revision_tags (
  revision_id uuid not null references public.content_revisions(id) on delete restrict,
  tag_id uuid not null references public.tags(id) on delete restrict,
  position integer not null default 0 check (position >= 0),
  primary key (revision_id, tag_id)
);

create table public.change_events (
  cursor bigint generated always as identity primary key,
  content_id uuid not null references public.contents(id) on delete restrict,
  revision_id uuid references public.content_revisions(id) on delete restrict,
  change_type public.change_type not null,
  visibility public.content_visibility not null,
  checksum text,
  payload jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  constraint change_events_checksum_format check (
    checksum is null or checksum ~ '^[0-9a-f]{64}$'
  )
);

create table public.integration_tokens (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  token_hash text not null unique,
  scopes text[] not null default array['knowledge:read']::text[],
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  last_used_at timestamptz,
  expires_at timestamptz,
  revoked_at timestamptz,
  constraint integration_tokens_hash_format check (token_hash ~ '^[0-9a-f]{64}$')
);

create table public.jarvis_suggestions (
  id uuid primary key default gen_random_uuid(),
  content_id uuid not null references public.contents(id) on delete restrict,
  revision_id uuid references public.content_revisions(id) on delete restrict,
  type public.suggestion_type not null,
  reason text not null,
  evidence jsonb not null default '[]'::jsonb,
  status public.suggestion_status not null default 'open',
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id)
);

create table public.embedding_chunks (
  id uuid primary key default gen_random_uuid(),
  revision_id uuid not null references public.content_revisions(id) on delete cascade,
  chunk_index integer not null check (chunk_index >= 0),
  heading_path text[] not null default '{}'::text[],
  plain_text text not null,
  token_count integer check (token_count is null or token_count >= 0),
  embedding_model text,
  embedding jsonb,
  checksum text not null,
  created_at timestamptz not null default now(),
  constraint embedding_chunks_checksum_format check (checksum ~ '^[0-9a-f]{64}$'),
  constraint embedding_chunks_revision_index_unique unique (revision_id, chunk_index)
);

create index contents_public_listing_idx
  on public.contents (type, published_at desc)
  where status = 'published' and visibility = 'public' and deleted_at is null;
create index content_revisions_content_idx
  on public.content_revisions (content_id, revision_number desc);
create index content_artifacts_search_vector_idx
  on public.content_artifacts using gin (search_vector);
create index content_artifacts_search_trgm_idx
  on public.content_artifacts using gin (search_text gin_trgm_ops);
create index content_relations_from_idx
  on public.content_relations (from_revision_id, position);
create index content_relations_to_idx
  on public.content_relations (to_content_id, relation_type);
create index verification_events_revision_idx
  on public.verification_events (revision_id, occurred_at desc);
create index revision_assets_revision_idx
  on public.revision_assets (revision_id, usage, position);
create index revision_tags_revision_idx
  on public.revision_tags (revision_id, position);
create index change_events_content_idx
  on public.change_events (content_id, cursor desc);
create index jarvis_suggestions_status_idx
  on public.jarvis_suggestions (status, created_at desc);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create function public.set_draft_updated_at_and_version()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  new.version = old.version + 1;
  return new;
end;
$$;

create function public.reject_immutable_revision_mutation()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'Published revision records are immutable; create a new revision instead.';
end;
$$;

create trigger contents_set_updated_at
before update on public.contents
for each row execute function public.set_updated_at();
create trigger content_drafts_set_updated_at
before update on public.content_drafts
for each row execute function public.set_draft_updated_at_and_version();

create trigger content_revisions_immutable
before update or delete on public.content_revisions
for each row execute function public.reject_immutable_revision_mutation();
create trigger content_artifacts_immutable
before update or delete on public.content_artifacts
for each row execute function public.reject_immutable_revision_mutation();
create trigger knowledge_revision_details_immutable
before update or delete on public.knowledge_revision_details
for each row execute function public.reject_immutable_revision_mutation();
create trigger lecture_revision_details_immutable
before update or delete on public.lecture_revision_details
for each row execute function public.reject_immutable_revision_mutation();
create trigger practice_revision_details_immutable
before update or delete on public.practice_revision_details
for each row execute function public.reject_immutable_revision_mutation();
create trigger ai_update_revision_details_immutable
before update or delete on public.ai_update_revision_details
for each row execute function public.reject_immutable_revision_mutation();
create trigger book_revision_details_immutable
before update or delete on public.book_revision_details
for each row execute function public.reject_immutable_revision_mutation();
create trigger revision_sources_immutable
before update or delete on public.revision_sources
for each row execute function public.reject_immutable_revision_mutation();
create trigger content_relations_immutable
before update or delete on public.content_relations
for each row execute function public.reject_immutable_revision_mutation();
create trigger verification_events_immutable
before update or delete on public.verification_events
for each row execute function public.reject_immutable_revision_mutation();
create trigger revision_assets_immutable
before update or delete on public.revision_assets
for each row execute function public.reject_immutable_revision_mutation();
create trigger revision_tags_immutable
before update or delete on public.revision_tags
for each row execute function public.reject_immutable_revision_mutation();
create trigger change_events_immutable
before update or delete on public.change_events
for each row execute function public.reject_immutable_revision_mutation();

create function public.is_dechive_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.site_members
    where user_id = (select auth.uid()) and role = 'owner'
  );
$$;

create function public.is_public_current_revision(candidate_revision_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.contents
    where current_revision_id = candidate_revision_id
      and status = 'published'
      and visibility = 'public'
      and deleted_at is null
  );
$$;

revoke all on function public.is_dechive_owner() from public;
grant execute on function public.is_dechive_owner() to anon, authenticated;
revoke all on function public.is_public_current_revision(uuid) from public;
grant execute on function public.is_public_current_revision(uuid) to anon, authenticated;

alter table public.site_members enable row level security;
alter table public.contents enable row level security;
alter table public.content_drafts enable row level security;
alter table public.content_revisions enable row level security;
alter table public.content_artifacts enable row level security;
alter table public.knowledge_revision_details enable row level security;
alter table public.lecture_revision_details enable row level security;
alter table public.practice_revision_details enable row level security;
alter table public.ai_update_revision_details enable row level security;
alter table public.book_revision_details enable row level security;
alter table public.sources enable row level security;
alter table public.revision_sources enable row level security;
alter table public.content_relations enable row level security;
alter table public.verification_events enable row level security;
alter table public.assets enable row level security;
alter table public.revision_assets enable row level security;
alter table public.tags enable row level security;
alter table public.revision_tags enable row level security;
alter table public.change_events enable row level security;
alter table public.integration_tokens enable row level security;
alter table public.jarvis_suggestions enable row level security;
alter table public.embedding_chunks enable row level security;

grant usage on schema public to anon, authenticated;

revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;

grant select on table
  public.contents,
  public.content_revisions,
  public.content_artifacts,
  public.knowledge_revision_details,
  public.lecture_revision_details,
  public.practice_revision_details,
  public.ai_update_revision_details,
  public.book_revision_details,
  public.sources,
  public.revision_sources,
  public.content_relations,
  public.verification_events,
  public.assets,
  public.revision_assets,
  public.tags,
  public.revision_tags
to anon;

grant select, insert, update, delete on table
  public.site_members,
  public.contents,
  public.content_drafts,
  public.content_revisions,
  public.content_artifacts,
  public.knowledge_revision_details,
  public.lecture_revision_details,
  public.practice_revision_details,
  public.ai_update_revision_details,
  public.book_revision_details,
  public.sources,
  public.revision_sources,
  public.content_relations,
  public.verification_events,
  public.assets,
  public.revision_assets,
  public.tags,
  public.revision_tags,
  public.change_events,
  public.integration_tokens,
  public.jarvis_suggestions,
  public.embedding_chunks
to authenticated;

grant usage, select on all sequences in schema public to authenticated;

create policy site_members_owner_all on public.site_members
for all to authenticated using (public.is_dechive_owner())
with check (public.is_dechive_owner());

create policy contents_public_read on public.contents
for select to anon, authenticated
using (
  status = 'published' and visibility = 'public'
  and current_revision_id is not null and deleted_at is null
);
create policy contents_owner_all on public.contents
for all to authenticated using (public.is_dechive_owner())
with check (public.is_dechive_owner());

create policy content_drafts_owner_all on public.content_drafts
for all to authenticated using (public.is_dechive_owner())
with check (public.is_dechive_owner());

create policy content_revisions_public_read on public.content_revisions
for select to anon, authenticated using (public.is_public_current_revision(id));
create policy content_revisions_owner_all on public.content_revisions
for all to authenticated using (public.is_dechive_owner())
with check (public.is_dechive_owner());

create policy content_artifacts_public_read on public.content_artifacts
for select to anon, authenticated using (public.is_public_current_revision(revision_id));
create policy content_artifacts_owner_all on public.content_artifacts
for all to authenticated using (public.is_dechive_owner())
with check (public.is_dechive_owner());

create policy knowledge_details_public_read on public.knowledge_revision_details
for select to anon, authenticated using (public.is_public_current_revision(revision_id));
create policy knowledge_details_owner_all on public.knowledge_revision_details
for all to authenticated using (public.is_dechive_owner()) with check (public.is_dechive_owner());
create policy lecture_details_public_read on public.lecture_revision_details
for select to anon, authenticated using (public.is_public_current_revision(revision_id));
create policy lecture_details_owner_all on public.lecture_revision_details
for all to authenticated using (public.is_dechive_owner()) with check (public.is_dechive_owner());
create policy practice_details_public_read on public.practice_revision_details
for select to anon, authenticated using (public.is_public_current_revision(revision_id));
create policy practice_details_owner_all on public.practice_revision_details
for all to authenticated using (public.is_dechive_owner()) with check (public.is_dechive_owner());
create policy ai_update_details_public_read on public.ai_update_revision_details
for select to anon, authenticated using (public.is_public_current_revision(revision_id));
create policy ai_update_details_owner_all on public.ai_update_revision_details
for all to authenticated using (public.is_dechive_owner()) with check (public.is_dechive_owner());
create policy book_details_public_read on public.book_revision_details
for select to anon, authenticated using (public.is_public_current_revision(revision_id));
create policy book_details_owner_all on public.book_revision_details
for all to authenticated using (public.is_dechive_owner()) with check (public.is_dechive_owner());

create policy revision_sources_public_read on public.revision_sources
for select to anon, authenticated using (public.is_public_current_revision(revision_id));
create policy revision_sources_owner_all on public.revision_sources
for all to authenticated using (public.is_dechive_owner()) with check (public.is_dechive_owner());
create policy sources_public_read on public.sources
for select to anon, authenticated
using (exists (
  select 1 from public.revision_sources
  where revision_sources.source_id = sources.id
    and public.is_public_current_revision(revision_sources.revision_id)
));
create policy sources_owner_all on public.sources
for all to authenticated using (public.is_dechive_owner()) with check (public.is_dechive_owner());

create policy content_relations_public_read on public.content_relations
for select to anon, authenticated
using (
  public.is_public_current_revision(from_revision_id)
  and exists (
    select 1 from public.contents target
    where target.id = to_content_id
      and target.status = 'published'
      and target.visibility = 'public'
      and target.deleted_at is null
  )
);
create policy content_relations_owner_all on public.content_relations
for all to authenticated using (public.is_dechive_owner()) with check (public.is_dechive_owner());

create policy verification_events_public_read on public.verification_events
for select to anon, authenticated using (public.is_public_current_revision(revision_id));
create policy verification_events_owner_all on public.verification_events
for all to authenticated using (public.is_dechive_owner()) with check (public.is_dechive_owner());

create policy revision_assets_public_read on public.revision_assets
for select to anon, authenticated using (public.is_public_current_revision(revision_id));
create policy revision_assets_owner_all on public.revision_assets
for all to authenticated using (public.is_dechive_owner()) with check (public.is_dechive_owner());
create policy assets_public_read on public.assets
for select to anon, authenticated
using (
  deleted_at is null and exists (
    select 1 from public.revision_assets
    where revision_assets.asset_id = assets.id
      and public.is_public_current_revision(revision_assets.revision_id)
  )
);
create policy assets_owner_all on public.assets
for all to authenticated using (public.is_dechive_owner()) with check (public.is_dechive_owner());

create policy revision_tags_public_read on public.revision_tags
for select to anon, authenticated using (public.is_public_current_revision(revision_id));
create policy revision_tags_owner_all on public.revision_tags
for all to authenticated using (public.is_dechive_owner()) with check (public.is_dechive_owner());
create policy tags_public_read on public.tags
for select to anon, authenticated
using (exists (
  select 1 from public.revision_tags
  where revision_tags.tag_id = tags.id
    and public.is_public_current_revision(revision_tags.revision_id)
));
create policy tags_owner_all on public.tags
for all to authenticated using (public.is_dechive_owner()) with check (public.is_dechive_owner());

create policy change_events_owner_all on public.change_events
for all to authenticated using (public.is_dechive_owner()) with check (public.is_dechive_owner());
create policy integration_tokens_owner_all on public.integration_tokens
for all to authenticated using (public.is_dechive_owner()) with check (public.is_dechive_owner());
create policy jarvis_suggestions_owner_all on public.jarvis_suggestions
for all to authenticated using (public.is_dechive_owner()) with check (public.is_dechive_owner());
create policy embedding_chunks_owner_all on public.embedding_chunks
for all to authenticated using (public.is_dechive_owner()) with check (public.is_dechive_owner());

insert into storage.buckets (id, name, public, file_size_limit)
values
  ('dechive-public', 'dechive-public', true, 52428800),
  ('dechive-private', 'dechive-private', false, 104857600)
on conflict (id) do nothing;

create policy storage_public_read on storage.objects
for select to anon, authenticated using (bucket_id = 'dechive-public');
create policy storage_owner_insert on storage.objects
for insert to authenticated
with check (
  bucket_id in ('dechive-public', 'dechive-private')
  and public.is_dechive_owner()
);
create policy storage_owner_update on storage.objects
for update to authenticated
using (public.is_dechive_owner())
with check (
  bucket_id in ('dechive-public', 'dechive-private')
  and public.is_dechive_owner()
);
create policy storage_owner_delete on storage.objects
for delete to authenticated
using (
  bucket_id in ('dechive-public', 'dechive-private')
  and public.is_dechive_owner()
);
create policy storage_owner_private_read on storage.objects
for select to authenticated
using (
  bucket_id = 'dechive-private'
  and public.is_dechive_owner()
);

comment on table public.contents is 'Stable identity and publication pointer for every Dechive content item.';
comment on table public.content_drafts is 'Mutable autosave workspace; never exposed publicly.';
comment on table public.content_revisions is 'Immutable publication snapshots.';
comment on table public.content_artifacts is 'Derived render and search formats; TipTap JSON remains canonical.';
comment on table public.change_events is 'Monotonic feed used by the read-only Jarvis sync API.';

commit;
