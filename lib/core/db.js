/**
 * SQLite database — schema init, migrations, and query helpers.
 * Single-file database for local dev. Same schema maps to Postgres for production.
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const SCHEMA_VERSION = 3;

const SCHEMA = `
-- Core state
-- Per-student runtime state: profile, progress, in-flight lesson.
-- user_id '' is the unnamed single-user install (#80).
CREATE TABLE IF NOT EXISTS kv (
  user_id TEXT NOT NULL DEFAULT '',
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  PRIMARY KEY (user_id, key)
);

-- Curricula
CREATE TABLE IF NOT EXISTS curricula (
  slug TEXT PRIMARY KEY,
  topic TEXT,
  data TEXT NOT NULL,
  preliminary INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Lesson completion
CREATE TABLE IF NOT EXISTS lessons_completed (
  slug TEXT NOT NULL,
  day INTEGER NOT NULL,
  date TEXT NOT NULL,
  engagement TEXT DEFAULT 'delivered',
  PRIMARY KEY (slug, day)
);

-- Students (for group learning)
CREATE TABLE IF NOT EXISTS students (
  user_id INTEGER PRIMARY KEY,
  name TEXT,
  profile TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Student exercise results
CREATE TABLE IF NOT EXISTS student_exercises (
  user_id INTEGER NOT NULL,
  slug TEXT NOT NULL,
  day INTEGER NOT NULL,
  result TEXT NOT NULL,
  date TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, slug, day)
);

-- Groups
CREATE TABLE IF NOT EXISTS groups (
  chat_id INTEGER PRIMARY KEY,
  topic TEXT,
  config TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Group members
CREATE TABLE IF NOT EXISTS group_members (
  chat_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  name TEXT,
  dm_enabled INTEGER DEFAULT 0,
  joined_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (chat_id, user_id)
);

-- Session history
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chat_id INTEGER NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  ts TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_sessions_chat ON sessions(chat_id);

-- Memory
CREATE TABLE IF NOT EXISTS memory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  entry TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_memory_user_date ON memory(user_id, date);
CREATE INDEX IF NOT EXISTS idx_memory_date ON memory(date);

-- Job queue (durable background tasks)
CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  payload TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TEXT DEFAULT (datetime('now')),
  started_at TEXT,
  completed_at TEXT,
  error TEXT
);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);

-- Schema version
INSERT OR IGNORE INTO kv (user_id, key, value) VALUES ('', 'schema_version', '${SCHEMA_VERSION}');
`;

export function openDatabase(dbPath) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  migrate(db);
  db.exec(SCHEMA);
  return db;
}

/**
 * Bring an existing database up to the current schema.
 *
 * Runs before CREATE TABLE IF NOT EXISTS, which by definition does nothing to a
 * table that already exists — so a database created before v2 would keep its
 * single-tenant `kv` forever and every student would share one row per key.
 *
 * SQLite cannot add a column to a PRIMARY KEY, so the table is rebuilt. Existing
 * rows belong to the unnamed install, which is user_id ''.
 */
function migrate(db) {
  const kv = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='kv'").get();
  if (!kv) return;   // fresh database; SCHEMA creates it correctly

  // memory carries a surrogate key, so a plain ADD COLUMN is enough. Checked
  // before the kv early-return: the two tables migrate independently.
  const memoryColumns = db.prepare('PRAGMA table_info(memory)').all().map((c) => c.name);
  if (memoryColumns.length && !memoryColumns.includes('user_id')) {
    db.exec("ALTER TABLE memory ADD COLUMN user_id TEXT NOT NULL DEFAULT ''");
  }

  const columns = db.prepare('PRAGMA table_info(kv)').all().map((c) => c.name);
  if (columns.includes('user_id')) return;

  db.exec(`
    ALTER TABLE kv RENAME TO kv_v1;
    CREATE TABLE kv (
      user_id TEXT NOT NULL DEFAULT '',
      key TEXT NOT NULL,
      value TEXT NOT NULL,
      PRIMARY KEY (user_id, key)
    );
    INSERT INTO kv (user_id, key, value) SELECT '', key, value FROM kv_v1;
    DROP TABLE kv_v1;
  `);
}

export function openDatabaseFromEnv(rootDir) {
  const dataDir = process.env.OPENTUTOR_DATA_DIR || rootDir;
  const dbPath = path.join(dataDir, 'workspace', 'tutor', 'opentutor.db');
  return openDatabase(dbPath);
}
