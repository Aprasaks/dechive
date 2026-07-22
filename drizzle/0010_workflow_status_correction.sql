-- 0009 is already recorded in migration history and must remain immutable.
-- This migration makes the final common workflow state consistent without
-- deleting rows or changing published content versions.

DO $$
DECLARE
  existing_definition text;
BEGIN
  SELECT pg_get_constraintdef(pc.oid)
    INTO existing_definition
    FROM pg_constraint pc
   WHERE pc.conrelid = 'public.content_localizations'::regclass
     AND pc.conname = 'knowledge_workflow_status_valid';

  IF existing_definition IS NULL THEN
    ALTER TABLE public.content_localizations
      ADD CONSTRAINT knowledge_workflow_status_valid
      CHECK (workflow_status IN ('draft', 'published', 'withdrawn', 'archived'))
      NOT VALID;
  ELSIF position('workflow_status' IN existing_definition) = 0
     OR position('draft' IN lower(existing_definition)) = 0
     OR position('published' IN lower(existing_definition)) = 0
     OR position('withdrawn' IN lower(existing_definition)) = 0
     OR position('archived' IN lower(existing_definition)) = 0 THEN
    RAISE EXCEPTION 'workflow_status constraint has an unexpected definition';
  END IF;
END $$;

-- A published workflow state is valid only when the current pointer resolves
-- to an existing content version whose own status is published.
UPDATE public.content_localizations cl
   SET workflow_status = 'draft'
 WHERE cl.workflow_status = 'published'
   AND NOT EXISTS (
     SELECT 1
       FROM public.content_versions cv
      WHERE cv.id = cl.current_published_version_id
        AND cv.status = 'published'
   );

-- Preserve the common workflow semantics for valid published pointers.
UPDATE public.content_localizations cl
   SET workflow_status = 'published'
 WHERE cl.workflow_status = 'draft'
   AND EXISTS (
     SELECT 1
       FROM public.content_versions cv
      WHERE cv.id = cl.current_published_version_id
        AND cv.status = 'published'
   );

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
      FROM pg_constraint pc
     WHERE pc.conrelid = 'public.content_localizations'::regclass
       AND pc.conname = 'knowledge_workflow_status_valid'
       AND NOT pc.convalidated
  ) THEN
    ALTER TABLE public.content_localizations
      VALIDATE CONSTRAINT knowledge_workflow_status_valid;
  END IF;
END $$;
