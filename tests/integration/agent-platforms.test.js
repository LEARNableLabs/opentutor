import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

// The agent platforms — OpenClaw, Hermes, NemoClaw, NanoClaw, Claude Code,
// Codex, Claude Web — had zero test coverage. Their "product" is a set of
// instructions plus the files those instructions point at, so nothing compiles
// and nothing fails loudly when a path moves underneath them.
//
// That is not hypothetical. #105 moved workspace/USER.md to
// workspace/templates/, and codex/README.md kept telling people to
// `cp workspace/USER.md .codex/` for weeks. The whole suite stayed green; the
// only reason it was found was someone reading the file.
//
// These tests read the instructions the way a user would and check that every
// path mentioned still exists.

const REPO = path.resolve('.');
const PLATFORMS = ['claude-code', 'codex', 'claude-web', 'hermes', 'openclaw', 'nemoclaw', 'nanoclaw'];

const read = (f) => fs.readFileSync(path.join(REPO, f), 'utf-8');
const tracked = new Set(execFileSync('git', ['ls-files'], { cwd: REPO, encoding: 'utf-8' }).split('\n'));

/**
 * Repo-relative paths a reader would try to copy or open.
 *
 * Only paths rooted at a directory that actually exists in the repo, so prose
 * like `~/.hermes/skills/` (a destination, not a source) is left alone.
 */
const ROOTS = ['skills/', 'workspace/', 'lib/', 'scripts/', 'api/', 'docs/', 'public/', 'supabase/'];

function referencedPaths(markdown) {
  const found = new Set();
  // Inside backticks or a fenced block: `workspace/templates/USER.md`, cp lines, etc.
  for (const m of markdown.matchAll(/[`\s(]([a-z-]+\/[A-Za-z0-9_./-]+)/g)) {
    const p = m[1].replace(/[.,)]+$/, '');
    if (!ROOTS.some((r) => p.startsWith(r))) continue;
    if (p.includes('*') || p.includes('<') || p.endsWith('/')) continue;   // globs and placeholders
    found.add(p);
  }
  return [...found];
}

describe.each(PLATFORMS)('%s setup guide', (platform) => {
  const file = `${platform}/README.md`;

  it('exists and is tracked', () => {
    expect(tracked.has(file), `${file} should ship`).toBe(true);
  });

  it('only tells the reader to copy files that ship', () => {
    // Tracked, not merely present. workspace/USER.md exists on a machine where
    // the tutor has run — it is seeded at runtime and gitignored — so an
    // existsSync check passed locally and failed in CI, which is precisely the
    // "works on my machine" this suite exists to prevent.
    // A guide may name a directory to copy (`cp -r skills/tutor/ …`), and
    // ls-files lists files, so a directory counts when anything ships under it.
    const ships = (p) => tracked.has(p) || [...tracked].some((f) => f.startsWith(`${p}/`));
    const missing = referencedPaths(read(file)).filter((p) => !ships(p));
    expect(missing, `${file} points at paths that are not in the repo`).toEqual([]);
  });

  it('does not advertise `npx opentutor`, which was never published', () => {
    // #99 removed this claim; it crept back into two platform guides once.
    expect(read(file)).not.toMatch(/npx opentutor\b/);
  });
});

describe('the skill every agent platform loads', () => {
  const skill = () => read('skills/tutor/SKILL.md');

  it('opens with frontmatter a loader can parse', () => {
    const m = skill().match(/^---\n([\s\S]*?)\n---\n/);
    expect(m, 'SKILL.md must open with YAML frontmatter').not.toBeNull();
    expect(m[1]).toMatch(/^name: /m);
    expect(m[1]).toMatch(/^description: /m);
  });

  it('links only to references it ships', () => {
    const links = [...skill().matchAll(/\]\((references|templates)\/([\w-]+\.md)\)/g)]
      .map((m) => `skills/tutor/${m[1]}/${m[2]}`);

    expect(links.length, 'SKILL.md should route to its references').toBeGreaterThan(3);
    expect(links.filter((f) => !fs.existsSync(path.join(REPO, f)))).toEqual([]);
  });

  it('describes domain files that the shipped domains actually have', () => {
    // SKILL.md tells the agent which files to load for a topic. If it names one
    // the 293 domains do not carry, every agent path silently reads nothing.
    const shipped = fs.readdirSync(path.join(REPO, 'skills/tutor/domains/game-theory'));
    for (const f of ['curriculum.json', 'concept-map.md', 'teaching-notes.md', 'resources.md']) {
      expect(shipped, `SKILL.md routes to ${f}`).toContain(f);
    }
  });
});

describe('what the installer copies', () => {
  it('every template setup.js reads is present', () => {
    const setup = read('scripts/setup.js');
    const templates = [...setup.matchAll(/'([A-Za-z0-9_.-]+\.(?:md|json))'/g)].map((m) => m[1]);

    const dir = path.join(REPO, 'workspace', 'templates');
    const available = new Set([...fs.readdirSync(dir), ...fs.readdirSync(path.join(REPO, 'workspace'))]);

    for (const t of new Set(templates)) {
      if (!/USER\.md|progress\.json|AGENTS\.md|IDENTITY\.md|SOUL\.md/.test(t)) continue;
      expect(available, `setup.js copies ${t}`).toContain(t);
    }
  });

  it('ships a SOUL.md override for each OpenClaw-like platform it claims to', () => {
    // setupOpenClawLike() swaps in a platform SOUL.md when one exists. If the
    // file is missing the install silently falls back to the generic persona.
    for (const p of ['openclaw', 'hermes']) {
      expect(fs.existsSync(path.join(REPO, p, 'SOUL.md')), `${p}/SOUL.md`).toBe(true);
    }
  });
});
