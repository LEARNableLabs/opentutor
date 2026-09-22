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
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'kv' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE kv ADD COLUMN user_id TEXT NOT NULL DEFAULT '';

    -- The primary key moves from (key) to (user_id, key). Postgres names the
    -- old one kv_pkey by convention; drop by lookup rather than assuming.
    EXECUTE (
      SELECT format('ALTER TABLE kv DROP CONSTRAINT %I', conname)
      FROM pg_constraint
      WHERE conrelid = 'kv'::regclass AND contype = 'p'
    );
    ALTER TABLE kv ADD PRIMARY KEY (user_id, key);
  END IF;
END $$;

-- Looking up one student's keys is the hot path for every request.
CREATE INDEX IF NOT EXISTS idx_kv_user ON kv (user_id);

-- Students are the tenant registry. The table already existed for Telegram
-- group learning; these columns make it usable for provisioning (#80).
ALTER TABLE students ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE students ADD COLUMN IF NOT EXISTS provisioned_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE students ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ;

-- RLS stays scoped to service_role (002). The app reaches Postgres with the
-- secret key and enforces the student boundary in SupabaseStore, so a policy
-- per student would be enforcing the same thing twice in a weaker place.
-- If anonymous clients are ever given direct access, that changes and these
-- policies must gain a user_id predicate.
