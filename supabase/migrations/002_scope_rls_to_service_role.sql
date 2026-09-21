-- Scope the RLS policies to service_role.
--
-- 001 created each policy as `FOR ALL USING (true) WITH CHECK (true)` with no
-- `TO` clause. A policy without `TO` applies to EVERY role, including `anon` —
-- the key that ships in a browser — so on a deployed project every table below
-- was readable and writable by anyone holding the public anon key, including
-- `sessions` (conversation history) and `memory`.
--
-- 001 is fixed for new projects; this migration repairs projects that already
-- ran it. Safe to re-run.

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'kv', 'curricula', 'lessons_completed', 'students', 'student_exercises',
    'groups', 'group_members', 'sessions', 'memory', 'jobs'
  ]
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', 'service_role_all', t);
    EXECUTE format(
      'CREATE POLICY %I ON %I FOR ALL TO service_role USING (true) WITH CHECK (true)',
      'service_role_all', t
    );
  END LOOP;
END
$$;

-- Verify: this should return 10 rows, every one with roles = {service_role}.
--
--   SELECT tablename, policyname, roles FROM pg_policies
--   WHERE schemaname = 'public' ORDER BY tablename;
--
-- Any row showing {public} means an unscoped policy survived — investigate before
-- exposing the anon key.
