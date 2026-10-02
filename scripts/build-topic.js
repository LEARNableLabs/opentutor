#!/usr/bin/env node
/**
 * Build one topic's curriculum with the full pipeline and log every step (#330).
 *
 *   node scripts/build-topic.js "Behavioral economics" [--level intermediate] [--slug behavioral-economics] [--install]
 *
 * Meant for the shipped topics, so it asks Claude Code (`claude -p`) for the model: set
 * OPENTUTOR_CLI_STRONG_MODEL and OPENTUTOR_CLI_CHEAP_MODEL (for example "opus" and "sonnet") to
 * choose. Set OPENTUTOR_PIPELINE_LLM yourself to use another backend. The build runs on a scratch
 * store; the files and a log of every model call land in .build-logs/<slug>-<time>/. --install
 * copies the result into skills/tutor/domains/<slug>/.
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const topic = args.find((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
if (!topic) { console.error('usage: build-topic.js "<topic>" [--level L] [--slug S] [--install]'); process.exit(1); }
const level = flag('--level') || 'intermediate';
const slug = flag('--slug') || topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
process.env.OPENTUTOR_PIPELINE_LLM ||= 'cli';

const { TutorStore } = await import('../lib/core/store.js');
const { CurriculumPipeline } = await import('../lib/core/pipeline.js');
const { researchTopic, formatResearchContext, verifyUrls } = await import('../lib/core/research.js');
const { createPipelineAdapterFromEnv } = await import('../lib/adapters/index.js');

const logDir = path.join(REPO, '.build-logs', `${slug}-${new Date().toISOString().replace(/[:.]/g, '-')}`);
fs.mkdirSync(path.join(logDir, 'calls'), { recursive: true });
const t0 = Date.now();
const events = [];
const note = (kind, data = {}) => {
  events.push({ t: Math.round((Date.now() - t0) / 1000), kind, ...data });
  fs.writeFileSync(path.join(logDir, 'events.json'), JSON.stringify(events, null, 1));
  console.log(`[${events.at(-1).t}s] ${kind}`, JSON.stringify(data).slice(0, 160));
};

const skills = new Map();
const tutor = path.join(REPO, 'skills', 'tutor');
for (const [key, file] of [['domain-template', 'templates/domain-template.md'], ['curriculum-format', 'references/curriculum-format.md'], ['teaching-method', 'references/teaching-method.md'], ['lesson-delivery', 'references/lesson-delivery.md'], ['source-verification', 'references/source-verification.md'], ['onboarding', 'references/onboarding.md']]) {
  skills.set(key, fs.readFileSync(path.join(tutor, file), 'utf8'));
}

const real = createPipelineAdapterFromEnv();
let calls = 0;
const adapter = Object.create(real);
adapter.generate = async (system, messages, options = {}) => {
  const id = String(++calls).padStart(2, '0');
  const start = Date.now();
  let res, error;
  try { res = await real.generate(system, messages, options); } catch (e) { error = e; }
  const rec = { id, ms: Date.now() - start, tier: options.model, systemChars: system.length, replyChars: res?.text?.length ?? 0, usage: res?.usage, error: error?.message };
  fs.writeFileSync(path.join(logDir, 'calls', `${id}.json`), JSON.stringify({ ...rec, system, messages, reply: res?.text }, null, 1));
  note('llm', rec);
  if (error) throw error;
  return res;
};

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-build-'));
fs.mkdirSync(path.join(root, 'skills', 'tutor', 'domains'), { recursive: true });
const state = new TutorStore(root);
try {
  const research = await researchTopic(topic, { level });
  const sources = Object.fromEntries(Object.entries(research).map(([k, v]) => [k, Array.isArray(v) ? v.length : Boolean(v)]));
  note('research', sources);
  fs.writeFileSync(path.join(logDir, 'research.json'), JSON.stringify(research, null, 1));
  const verifying = async (urls) => {
    const out = await verifyUrls(urls);
    note('verifyUrls', { checked: out.length, dead: out.filter((r) => !r.ok).map((r) => r.url) });
    return out;
  };
  const researchContext = `# Research: ${topic}\n\n${formatResearchContext(research)}`;
  state.writeDomainFile(slug, 'research.md', researchContext); // the Teacher reads it for every later lesson
  const pipeline = new CurriculumPipeline({
    adapter, state, skills, timeoutMs: 900_000, onProgress: (p) => note('progress', p),
  });
  const result = await pipeline.run(topic, slug, level, researchContext, {
    syllabi: research.syllabi?.length ? research.syllabi.map((s) => `- ${s.title} (${s.provider}): ${s.url}`).join('\n') : null,
    wikiConcepts: research.wikiLinks?.join(', ') || null,
    verifyUrls: verifying,
  });
  note('done', { calls, iterations: result.iterations, approved: result.approved, lessons: result.curriculum.lessons.length });
  const built = path.join(root, 'skills', 'tutor', 'domains', slug);
  fs.cpSync(built, path.join(logDir, 'domain'), { recursive: true });
  if (args.includes('--install')) {
    // The six files a shipped domain has. plan.md and critique.md stay in the log: they are build-time notes.
    // An unapproved build is installed only on purpose; its critique says what is still wrong.
    const dest = path.join(tutor, 'domains', slug);
    fs.mkdirSync(dest, { recursive: true });
    for (const file of ['curriculum.json', 'concept-map.md', 'teaching-notes.md', 'resources.md', 'research.md', 'teacher.md']) {
      if (fs.existsSync(path.join(built, file))) fs.copyFileSync(path.join(built, file), path.join(dest, file));
    }
    console.log(`installed into skills/tutor/domains/${slug}${result.approved ? '' : ' (NOT approved by the Critic, see domain/critique.md in the log)'}`);
  }
  console.log(`log: ${logDir}`);
} finally {
  state.close();
}
