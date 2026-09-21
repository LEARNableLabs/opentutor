import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { setupAgentSkills } from '../scripts/setup.js';

// #99/#60 — setup.js wrote the tutor boot instructions into CLAUDE.md for every
// agent, including Codex. Codex reads AGENTS.md, so a Codex install put the
// instructions in a file the agent never opens: the skill was on disk, the
// tutor never booted, and nothing errored to say why.

let cwd, root;

beforeEach(() => {
  cwd = process.cwd();
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-setup-'));
  process.chdir(root);
});
afterEach(() => {
  process.chdir(cwd);
  fs.rmSync(root, { recursive: true, force: true });
});

const bootFileFor = (platform) => {
  setupAgentSkills(platform, false, { name: 'Ada', timezone: 'Europe/Rome', level: '' });
  return ['CLAUDE.md', 'AGENTS.md'].filter((f) => fs.existsSync(path.join(root, f)));
};

describe('installing for an agent', () => {
  it('boots Codex from AGENTS.md, the file Codex actually reads', () => {
    expect(bootFileFor('codex')).toEqual(['AGENTS.md']);
  });

  it('boots Claude Code from CLAUDE.md', () => {
    expect(bootFileFor('claude-code')).toEqual(['CLAUDE.md']);
  });

  it('writes instructions a reader can act on, not an empty heading', () => {
    setupAgentSkills('codex', false, { name: 'Ada', timezone: 'Europe/Rome', level: '' });
    const boot = fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf-8');
    expect(boot).toContain('## Tutor');
    expect(boot.length).toBeGreaterThan(100);
  });

  it('does not duplicate the section when run twice', () => {
    const opts = { name: 'Ada', timezone: 'Europe/Rome', level: '' };
    setupAgentSkills('codex', false, opts);
    setupAgentSkills('codex', false, opts);
    const boot = fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf-8');
    expect(boot.match(/## Tutor/g)).toHaveLength(1);
  });

  it('seeds the profile from the template rather than leaving nothing', () => {
    setupAgentSkills('codex', false, { name: 'Ada', timezone: 'Europe/Rome', level: '' });
    expect(fs.readFileSync(path.join(root, '.tutor', 'USER.md'), 'utf-8')).toContain('Ada');
  });
});
