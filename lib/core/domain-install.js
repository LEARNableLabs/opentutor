import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { generatedTopicKey } from './generated-topics.js';

export const SHIPPED_DOMAIN_FILES = ['curriculum.json', 'concept-map.md', 'teaching-notes.md', 'resources.md', 'research.md', 'teacher.md'];

export function buildTopicSlug(topic, explicit) {
  const generated = String(topic).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80).replace(/-$/g, '');
  const slug = explicit ?? (generated || `topic-${createHash('sha256').update(String(topic)).digest('hex').slice(0, 12)}`);
  generatedTopicKey(slug); // validate before any path is formed
  return slug;
}

export function installDomain(source, destination) {
  // Read the complete set before touching an existing course. A missing file cannot leave a
  // mixture of new and old content behind or be reported as a successful installation.
  const files = SHIPPED_DOMAIN_FILES.map((name) => {
    const content = fs.readFileSync(path.join(source, name));
    if (!content.toString().trim()) throw new Error(`Empty required domain file: ${name}`);
    return [name, content];
  });
  const parent = path.dirname(destination);
  fs.mkdirSync(parent, { recursive: true });
  // Keep renames on the destination filesystem, including when domains is a mount.
  // This container has no curriculum.json: catalogs only discover the nested course
  // after it is published at destination, never the staging or backup directories.
  const work = fs.mkdtempSync(path.join(parent, '.opentutor-install-'));
  const staged = path.join(work, 'domain');
  const previous = path.join(work, 'previous');
  let oldMoved = false;
  let installed = false;
  let retainBackup = false;
  try {
    fs.mkdirSync(staged);
    if (fs.existsSync(destination)) fs.cpSync(destination, staged, { recursive: true });
    for (const [name, content] of files) {
      fs.rmSync(path.join(staged, name), { force: true });
      fs.writeFileSync(path.join(staged, name), content);
    }
    if (fs.existsSync(destination)) {
      fs.renameSync(destination, previous);
      oldMoved = true;
    }
    fs.renameSync(staged, destination);
    installed = true;
  } catch (error) {
    if (oldMoved && !installed) {
      try { fs.renameSync(previous, destination); }
      catch (restoreError) {
        retainBackup = true;
        throw new Error(`Could not restore domain; previous installation retained at ${previous}`, { cause: restoreError });
      }
    }
    throw error;
  } finally {
    if (!retainBackup) {
      try { fs.rmSync(work, { recursive: true, force: true }); }
      catch {
        // Publication has already succeeded or its original failure is propagating.
        // Cleanup must not misreport either result; preserve the path for recovery.
        console.warn(`[install] ${installed ? 'Domain installed; cleanup failed' : 'Cleanup failed'}; recovery files retained at ${work}`);
      }
    }
  }
}
