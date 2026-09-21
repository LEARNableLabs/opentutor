import { describe, it, expect, beforeAll } from 'vitest';
import { execFileSync } from 'child_process';

// `files` in package.json overrides .gitignore, so anything under a whitelisted
// directory ships — including runtime state written by a local bot. This guards
// the publish boundary in both directions: nothing private leaks, nothing the
// package needs at runtime is missing.

let packed;

beforeAll(() => {
  const out = execFileSync('npm', ['pack', '--dry-run', '--json'], {
    cwd: process.cwd(),
    encoding: 'utf-8',
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  packed = JSON.parse(out)[0].files.map((f) => f.path);
}, 120_000);

describe('published package', () => {
  it('ships no runtime or private state', () => {
    const leaked = packed.filter((f) => (
      f.startsWith('workspace/sessions/')          // conversation logs
      || f.startsWith('workspace/memory/')         // daily session notes
      || f.startsWith('workspace/students/')
      || f.startsWith('workspace/groups/')
      || /\.db($|-wal$|-shm$)/.test(f)             // local SQLite
      || f.endsWith('completions.json')            // per-student lesson progress
      || f.endsWith('.backup')
      || f === '.env'
    ) && !f.endsWith('.gitkeep'));

    expect(leaked).toEqual([]);
  });

  it('ships everything needed to run', () => {
    for (const required of [
      'package.json',
      'lib/core/progress.js',
      'scripts/setup.js',
      'scripts/web/server.js',
      'public/index.html',                          // npm run web 404s without it
      'api/lesson.js',
      'vercel.json',
      'supabase/migrations/001_initial_schema.sql',
      'skills/tutor/SKILL.md',
      'skills/tutor/domains/sourdough-science/curriculum.json',
    ]) {
      expect(packed, `missing ${required}`).toContain(required);
    }
  });

  it('ships the workspace templates the installer copies', () => {
    // scripts/setup.js installWorkspace() reads exactly these.
    for (const template of ['workspace/IDENTITY.md', 'workspace/SOUL.md', 'workspace/AGENTS.md', 'workspace/tutor/progress.json']) {
      expect(packed, `missing ${template}`).toContain(template);
    }
  });
});
