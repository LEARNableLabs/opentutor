-- #117 — take the last of the runtime state off the filesystem.
--
-- SupabaseStore moved kv to Postgres and left three writes on disk. On Vercel
-- everything outside /tmp is read-only, so all three threw EROFS, api/lesson.js
-- swallowed the error, and the student was told their lesson was complete:
--
--   markLessonComplete  → workspace/tutor/completions.json
--   writeDomainFile     → workspace/tutor/domains/<slug>/learning.md
--   writeCurriculum     → skills/tutor/domains/<slug>/curriculum.json
--
-- Verified against the live deployment: a full four-step lesson left
-- `completed: 0 of 29` and an empty history.
--
-- Idempotent. Safe to re-run.

-- ── Lesson completion ───────────────────────────────────────
-- The table has existed since 001 and nothing ever wrote to it. It also
-- predates per-student state (#80), so it needs the same user_id treatment kv got.

DO $$
DECLARE
  pk_name TEXT;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'lessons_completed'
      AND column_name = 'user_id'
  ) THEN
    ALTER TABLE lessons_completed ADD COLUMN user_id TEXT NOT NULL DEFAULT '';

    SELECT conname INTO pk_name
    FROM pg_constraint
    WHERE conrelid = 'lessons_completed'::regclass AND contype = 'p';

    IF pk_name IS NOT NULL THEN
      EXECUTE format('ALTER TABLE lessons_completed DROP CONSTRAINT %I', pk_name);
    END IF;

    ALTER TABLE lessons_completed ADD PRIMARY KEY (user_id, slug, day);
  END IF;
END $$;

-- ── Runtime domain files ────────────────────────────────────
-- learning.md and practice-feedback.md describe one student, not the shared
-- curriculum, which is why they never belonged in the tracked domains tree.
-- The other domain files ship with the package and stay read-only on disk.

CREATE TABLE IF NOT EXISTS domain_files (
  user_id TEXT NOT NULL DEFAULT '',
  slug TEXT NOT NULL,
  filename TEXT NOT NULL,
  content TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, slug, filename)
);

-- ── Generated curricula ─────────────────────────────────────
-- `curricula` has also existed since 001 unused. Curricula generated at runtime
-- go here; the 293 that ship stay on disk, where read-only is no obstacle.

ALTER TABLE curricula ADD COLUMN IF NOT EXISTS user_id TEXT NOT NULL DEFAULT '';

DO $$
DECLARE
  pk_name TEXT;
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'curricula'::regclass AND contype = 'p'
      AND array_length(conkey, 1) = 1
  ) THEN
    SELECT conname INTO pk_name
    FROM pg_constraint
    WHERE conrelid = 'curricula'::regclass AND contype = 'p';

    EXECUTE format('ALTER TABLE curricula DROP CONSTRAINT %I', pk_name);
    ALTER TABLE curricula ADD PRIMARY KEY (user_id, slug);
  END IF;
END $$;

-- ── RLS ─────────────────────────────────────────────────────
-- Same posture as 002: the app reaches Postgres with the secret key and
-- enforces the student boundary in SupabaseStore. A new table defaults to no
-- policies, which with RLS enabled means nothing can read it at all.

ALTER TABLE domain_files ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'domain_files' AND policyname = 'domain_files_service_role'
  ) THEN
    CREATE POLICY domain_files_service_role ON domain_files
      FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

UPDATE kv SET value = to_jsonb('4'::text) WHERE user_id = '' AND key = 'schema_version';
