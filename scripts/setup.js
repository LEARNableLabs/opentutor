#!/usr/bin/env node
/**
 * OpenTutor setup script
 * Usage: npx opentutor setup
 */

import { createInterface } from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, '..');
const SKILL_DIR = path.join(REPO_ROOT, 'skills', 'tutor');
const WORKSPACE_TEMPLATE = path.join(REPO_ROOT, 'workspace');

const rl = createInterface({ input, output });
const ask = (q) => rl.question(q);

// ─── helpers ────────────────────────────────────────────────────────────────

function copyDir(src, dst) {
  fs.cpSync(src, dst, { recursive: true, force: true });
}

function copyFileIfMissing(src, dst) {
  try {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst, fs.constants.COPYFILE_EXCL);
    return true;
  } catch (e) {
    if (e.code === 'EEXIST') return false;
    throw e;
  }
}

function expandHome(p) {
  return p.replace(/^~/, os.homedir());
}

function appendIfMissing(file, marker, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (fs.existsSync(file)) {
    if (fs.readFileSync(file, 'utf-8').includes(marker)) return false;
    fs.appendFileSync(file, '\n' + content);
  } else {
    fs.writeFileSync(file, content);
  }
  return true;
}

function tick(msg) { console.log(`  ✓ ${msg}`); }
function warn(msg) { console.log(`  ⚠ ${msg}`); }
function fail(msg) { console.log(`  ✗ ${msg}`); }

const TUTOR_BOOT_MD = `
## Tutor

You are a personalized tutor. At the start of every session:

1. Read your \`tutor\` skill (SKILL.md) — teaching methodology
2. Read \`USER.md\` — who you're teaching
3. Read \`tutor/progress.json\` — current learning state
4. Read \`memory/YYYY-MM-DD.md\` (today + yesterday) for recent context

Never narrate your boot-up. Use these files silently and jump straight into the conversation.
`;

// ─── workspace installer ─────────────────────────────────────────────────────

function installWorkspace(dir, { includeAgentsMd = false, overrides = {}, student = {} } = {}) {
  const files = ['IDENTITY.md', 'SOUL.md'];
  if (includeAgentsMd) files.push('AGENTS.md');

  for (const file of files) {
    const src = overrides[file] ?? path.join(WORKSPACE_TEMPLATE, file);
    const copied = copyFileIfMissing(
      src,
      path.join(dir, file),
    );
    if (copied) tick(`${file} → ${path.join(dir, file)}`);
    else warn(`${file} already exists, skipped`);
  }

  // USER.md — pre-fill with student info if provided
  const userDst = path.join(dir, 'USER.md');
  if (!fs.existsSync(userDst)) {
    const name = student.name || '';
    const timezone = student.timezone || '';
    const level = student.level || '';
    const levelDisplay = level || '_(middle school / high school / undergrad / grad / PhD / professional / self-taught)_';
    const content = `# USER.md - About Your Student

- **Name:** ${name}
- **What to call them:** ${name}
- **Timezone:** ${timezone}
- **Educational level:** ${levelDisplay}
- **Notes:**

## Context

_(Fill this in as you learn about the student — interests, background, learning style, what motivates them.)_
`;
    fs.writeFileSync(userDst, content);
    tick(`USER.md → ${userDst}${name ? ` (${name}, ${timezone})` : ''}`);
  } else {
    warn('USER.md already exists, skipped');
  }

  fs.mkdirSync(path.join(dir, 'tutor', 'curricula'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'memory'), { recursive: true });

  const copied = copyFileIfMissing(
    path.join(WORKSPACE_TEMPLATE, 'tutor', 'progress.json'),
    path.join(dir, 'tutor', 'progress.json'),
  );
  if (copied) tick(`progress.json → ${path.join(dir, 'tutor', 'progress.json')}`);
}

// ─── platform setups ─────────────────────────────────────────────────────────

async function setupAgentSkills(platformId, isGlobal, student) {
  const dirs = {
    'claude-code': ['.claude',  path.join(os.homedir(), '.claude')],
    'codex':       ['.codex',   path.join(os.homedir(), '.codex')],
  };
  const [projectDir, globalDir] = dirs[platformId];
  const baseDir = isGlobal ? globalDir : path.join(process.cwd(), projectDir);

  const skillDst = path.join(baseDir, 'skills', 'tutor');
  copyDir(SKILL_DIR, skillDst);
  tick(`skill → ${skillDst}`);

  const wsDir = isGlobal
    ? path.join(baseDir, 'tutor')
    : path.join(process.cwd(), '.tutor');
  installWorkspace(wsDir, { student });

  const claudeMd = isGlobal
    ? path.join(baseDir, 'CLAUDE.md')
    : path.join(process.cwd(), 'CLAUDE.md');
  const added = appendIfMissing(claudeMd, '## Tutor', TUTOR_BOOT_MD);
  if (added) tick(`boot instructions → ${claudeMd}`);
  else warn(`tutor section already in ${claudeMd}, skipped`);
}

function setupOpenClawLike(platformId, student) {
  const root = path.join(os.homedir(), `.${platformId}`);

  const skillDst = path.join(root, 'skills', 'tutor');
  copyDir(SKILL_DIR, skillDst);
  tick(`skill → ${skillDst}`);

  const wsDst = path.join(root, 'workspaces', 'tutor');
  const ocSoul = path.join(REPO_ROOT, 'openclaw', 'SOUL.md');
  installWorkspace(wsDst, {
    includeAgentsMd: true,
    overrides: fs.existsSync(ocSoul) ? { 'SOUL.md': ocSoul } : {},
    student,
  });

  const configFile = path.join(root, `${platformId}.json`);
  let config = {};
  try {
    config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
  } catch (e) {
    if (e.code !== 'ENOENT') warn(`Could not parse ${platformId}.json — skipping config merge`);
  }

  config.agents ??= {};
  config.agents.list ??= [];

  if (!config.agents.list.some((a) => a.id === 'tutor')) {
    config.agents.list.push({
      id: 'tutor',
      name: 'OpenTutor',
      skills: ['tutor'],
      workspace: wsDst,
      model: { primary: 'anthropic/claude-opus-4-6' },
    });
    config.tools ??= {};
    config.tools.web ??= {};
    config.tools.web.search ??= { enabled: true };
    config.tools.web.fetch ??= { enabled: true };

    fs.writeFileSync(configFile, JSON.stringify(config, null, 2) + '\n');
    tick(`agent registered → ${configFile}`);
  } else {
    warn(`tutor agent already in ${configFile}, skipped`);
  }

}

async function setupNanoClaw(student) {
  let ncRoot = process.cwd();
  if (!fs.existsSync(path.join(ncRoot, 'container', 'skills'))) {
    const raw = await ask('  Path to your NanoClaw project root: ');
    ncRoot = expandHome(raw.trim());
    if (!fs.existsSync(path.join(ncRoot, 'container', 'skills'))) {
      fail(`container/skills/ not found in ${ncRoot}`);
      return;
    }
  }

  const skillDst = path.join(ncRoot, 'container', 'skills', 'tutor');
  copyDir(SKILL_DIR, skillDst);
  tick(`skill → ${skillDst}`);

  const groupRaw = await ask('  Group folder to install workspace into? [main] ');
  const group = groupRaw.trim() || 'main';
  const groupDir = path.join(ncRoot, 'groups', group);

  if (!fs.existsSync(groupDir)) {
    fail(`groups/${group}/ not found`);
    console.log('  Create the group folder and re-run setup.');
    return;
  }

  installWorkspace(groupDir, { student });

  console.log('\n  The skill will be synced into the container on next spawn — no restart needed.');
}

// ─── main ─────────────────────────────────────────────────────────────────────

const PLATFORMS = [
  { id: 'claude-code', name: 'Claude Code', hasScope: true,  run: (isGlobal, student) => setupAgentSkills('claude-code', isGlobal, student) },
  { id: 'codex',       name: 'Codex',       hasScope: true,  run: (isGlobal, student) => setupAgentSkills('codex', isGlobal, student) },
  { id: 'openclaw',   name: 'OpenClaw',    hasScope: false, run: (_ig, student) => setupOpenClawLike('openclaw', student) },
  { id: 'nemoclaw',   name: 'NemoClaw',    hasScope: false, run: (_ig, student) => setupOpenClawLike('nemoclaw', student) },
  { id: 'nanoclaw',   name: 'NanoClaw',    hasScope: false, run: (_ig, student) => setupNanoClaw(student) },
];

async function main() {
  console.log('\nOpenTutor Setup\n');

  PLATFORMS.forEach((p, i) => console.log(`  ${i + 1}. ${p.name}`));
  console.log(`  ${PLATFORMS.length + 1}. All`);

  const raw = await ask('\nPlatform: ');
  const str = raw.trim().toLowerCase();

  let selected = [];
  if (str === 'all' || str === String(PLATFORMS.length + 1)) {
    selected = [...PLATFORMS];
  } else {
    selected = str
      .split(',')
      .map((s) => parseInt(s.trim()) - 1)
      .filter((n) => n >= 0 && n < PLATFORMS.length)
      .map((n) => PLATFORMS[n]);
  }

  if (!selected.length) {
    console.log('\nNothing selected. Exiting.');
    rl.close();
    return;
  }

  let isGlobal = true;
  if (selected.some((p) => p.hasScope)) {
    const scopeRaw = await ask('\nScope — global or project? [global] ');
    isGlobal = !scopeRaw.trim().toLowerCase().startsWith('p');
  }

  // Ask for student info upfront
  console.log('\n── Student Info ─────────────────────────');
  const nameRaw = await ask('  Your name: ');
  const tzRaw = await ask('  Your timezone (e.g. America/New_York): ');
  const levelRaw = await ask('  Educational level (e.g. undergrad, PhD, self-taught) [optional]: ');
  const student = {
    name: nameRaw.trim(),
    timezone: tzRaw.trim(),
    level: levelRaw.trim() || '',
  };

  for (const platform of selected) {
    console.log(`\n── ${platform.name} ${'─'.repeat(40 - platform.name.length)}`);
    await platform.run(isGlobal, student);
  }

  console.log('\n══════════════════════════════');
  console.log('OpenTutor setup complete.');
  console.log('══════════════════════════════\n');
  rl.close();
}

main().catch((err) => {
  console.error('\nSetup failed:', err.message);
  rl.close();
  process.exit(1);
});
