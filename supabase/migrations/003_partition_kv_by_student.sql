-- #80 — partition per-student state.
--
-- `kv` held the student profile and progress keyed on `key` alone, so every
-- student on an instance shared one row per key: one profile, one progress,
-- one in-flight lesson. Two students were not merely unsupported, they
-- silently overwrote each other.
--
-- Existing rows belong to the unnamed single-user install, which is user_id ''.
-- Idempotent: safe to re-run against a database that already has the column.

DO $$
DECLARE
  pk_name TEXT;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'kv'
      AND column_name = 'user_id'
  ) THEN
    ALTER TABLE kv ADD COLUMN user_id TEXT NOT NULL DEFAULT '';

    -- The primary key moves from (key) to (user_id, key). Look the constraint
    -- up rather than assuming it is called kv_pkey — and tolerate its absence,
    -- since EXECUTE of a NULL string raises rather than doing nothing.
    SELECT conname INTO pk_name
    FROM pg_constraint
    WHERE conrelid = 'kv'::regclass AND contype = 'p';

    IF pk_name IS NOT NULL THEN
      EXECUTE format('ALTER TABLE kv DROP CONSTRAINT %I', pk_name);
    END IF;

    ALTER TABLE kv ADD PRIMARY KEY (user_id, key);
  END IF;
END $$;

-- Session memory was shared by every student on the instance: no column, no
-- predicate. It is the Teacher's cross-session context, so one student's
-- struggles were being read into another student's prompt.
ALTER TABLE memory ADD COLUMN IF NOT EXISTS user_id TEXT NOT NULL DEFAULT '';
CREATE INDEX IF NOT EXISTS idx_memory_user_date ON memory (user_id, date);

-- No index on kv (user_id) alone: it is the leading column of the new primary
-- key, so that index already serves these lookups.

-- No columns added to `students`: the provisioning registry lives in kv (see
-- lib/core/students.js), because kv is the one durable store all three backends
-- share. `students` stays what it was — Telegram group learning.

-- RLS stays scoped to service_role (002). The app reaches Postgres with the
-- secret key and enforces the student boundary in SupabaseStore, so a policy
-- per student would be enforcing the same thing twice in a weaker place.
-- If anonymous clients are ever given direct access, that changes and these
-- policies must gain a user_id predicate.

-- Keep the recorded version in step with lib/core/db.js.
UPDATE kv SET value = to_jsonb('3'::text) WHERE user_id = '' AND key = 'schema_version';
