-- OpenTutor initial schema for Supabase (Postgres)
-- Mirrors the SQLite schema in lib/core/db.js

-- Core key-value state
CREATE TABLE IF NOT EXISTS kv (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

-- Curricula metadata (curriculum content lives on disk as JSON files)
CREATE TABLE IF NOT EXISTS curricula (
  slug TEXT PRIMARY KEY,
  topic TEXT,
  data JSONB NOT NULL,
  preliminary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Lesson completion tracking
CREATE TABLE IF NOT EXISTS lessons_completed (
  slug TEXT NOT NULL,
  day INTEGER NOT NULL,
  date TEXT NOT NULL,
  engagement TEXT DEFAULT 'delivered',
  PRIMARY KEY (slug, day)
);

-- Students (for group learning)
CREATE TABLE IF NOT EXISTS students (
  user_id TEXT PRIMARY KEY,
  name TEXT,
  profile JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Student exercise results
CREATE TABLE IF NOT EXISTS student_exercises (
  user_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  day INTEGER NOT NULL,
  result TEXT NOT NULL,
  date TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, slug, day)
);

-- Groups
CREATE TABLE IF NOT EXISTS groups (
  chat_id TEXT PRIMARY KEY,
  topic TEXT,
  config JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Group members
CREATE TABLE IF NOT EXISTS group_members (
  chat_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  name TEXT,
  dm_enabled BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (chat_id, user_id)
);

-- Session history
CREATE TABLE IF NOT EXISTS sessions (
  id BIGSERIAL PRIMARY KEY,
  chat_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  ts TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sessions_chat ON sessions(chat_id);

-- Memory
CREATE TABLE IF NOT EXISTS memory (
  id BIGSERIAL PRIMARY KEY,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  entry TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_memory_date ON memory(date);

-- Job queue (durable background tasks)
CREATE TABLE IF NOT EXISTS jobs (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error TEXT
);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);

-- RLS policies (permissive for now — tighten per deployment needs)
ALTER TABLE kv ENABLE ROW LEVEL SECURITY;
ALTER TABLE curricula ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons_completed ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (bot/server uses service role key)
CREATE POLICY "service_role_all" ON kv FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON curricula FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON lessons_completed FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON student_exercises FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON groups FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON group_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON memory FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON jobs FOR ALL USING (true) WITH CHECK (true);

-- Schema version
INSERT INTO kv (key, value) VALUES ('schema_version', '"1"')
ON CONFLICT (key) DO NOTHING;
