/**
 * SQLite database — schema init, migrations, and query helpers.
 * Single-file database for local dev. Same schema maps to Postgres for production.
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const SCHEMA_VERSION = 1;

const SCHEMA = `
-- Core state
CREATE TABLE IF NOT EXISTS kv (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
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
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  entry TEXT NOT NULL
);
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
INSERT OR IGNORE INTO kv (key, value) VALUES ('schema_version', '${SCHEMA_VERSION}');
`;

export function openDatabase(dbPath) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(SCHEMA);
  return db;
}

export function openDatabaseFromEnv(rootDir) {
  const dataDir = process.env.OPENTUTOR_DATA_DIR || rootDir;
  const dbPath = path.join(dataDir, 'workspace', 'tutor', 'opentutor.db');
  return openDatabase(dbPath);
}
