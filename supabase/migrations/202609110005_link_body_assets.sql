-- Preserve every body image used by an immutable publication revision.

begin;

create or replace function public.link_revision_body_assets()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  insert into public.revision_assets (
    revision_id,
    asset_id,
    usage,
    caption,
    position
  )
  select
    new.id,
    asset.id,
    'body'::public.asset_usage,
    nullif(btrim(image_node.node #>> '{attrs,caption}'), ''),
    (image_node.position - 1)::integer
  from jsonb_path_query(
    new.body_json,
    '$.** ? (@.type == "image")'
  ) with ordinality as image_node(node, position)
  join public.assets as asset
    on asset.id::text = image_node.node #>> '{attrs,assetId}'
  where asset.deleted_at is null
  on conflict (revision_id, asset_id, usage) do nothing;

  return new;
end;
$$;

drop trigger if exists content_revision_link_body_assets
on public.content_revisions;

create trigger content_revision_link_body_assets
after insert on public.content_revisions
for each row
execute function public.link_revision_body_assets();

commit;
