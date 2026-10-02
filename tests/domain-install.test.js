import { it, expect, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildTopicSlug, installDomain, SHIPPED_DOMAIN_FILES } from '../lib/core/domain-install.js';
import { publicCatalog } from '../lib/core/catalog.js';

it('gives non-ASCII topics a stable safe slug and rejects explicit path escapes', () => {
  expect(buildTopicSlug('量子力学')).toMatch(/^topic-[a-f0-9]{12}$/);
  expect(buildTopicSlug('量子力学')).toBe(buildTopicSlug('量子力学'));
  for (const slug of ['', '../x', '/tmp/x', 'a/b']) expect(() => buildTopicSlug('T', slug)).toThrow('Invalid topic slug');
});

it('leaves an existing installation untouched if any required file is missing', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-install-'));
  try {
    const source = path.join(root, 'source'), destination = path.join(root, 'destination');
    fs.mkdirSync(source); fs.mkdirSync(destination);
    fs.writeFileSync(path.join(destination, 'curriculum.json'), 'old course');
    for (const file of SHIPPED_DOMAIN_FILES.filter((f) => f !== 'teaching-notes.md')) fs.writeFileSync(path.join(source, file), 'new content');
    expect(() => installDomain(source, destination)).toThrow();
    expect(fs.readFileSync(path.join(destination, 'curriculum.json'), 'utf8')).toBe('old course');
    expect(fs.readdirSync(destination)).toEqual(['curriculum.json']);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

it.each(['write', 'publish'])('preserves all previous files after a %s failure', (failure) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-install-fail-'));
  let spy;
  try {
    const source = path.join(root, 'source'), destination = path.join(root, 'domains', 'course');
    fs.mkdirSync(source); fs.mkdirSync(destination, { recursive: true });
    for (const file of SHIPPED_DOMAIN_FILES) {
      fs.writeFileSync(path.join(source, file), 'new content');
      fs.writeFileSync(path.join(destination, file), 'old content');
    }
    if (failure === 'write') {
      const write = fs.writeFileSync;
      spy = vi.spyOn(fs, 'writeFileSync').mockImplementation((filename, ...args) => {
        if (path.basename(filename) === 'teacher.md' && path.basename(path.dirname(filename)) === 'domain') throw Object.assign(new Error('disk full'), { code: 'ENOSPC' });
        return write(filename, ...args);
      });
    } else {
      const rename = fs.renameSync;
      spy = vi.spyOn(fs, 'renameSync').mockImplementation((from, to) => {
        if (path.basename(from) === 'domain') throw new Error('publication failed');
        return rename(from, to);
      });
    }
    expect(() => installDomain(source, destination)).toThrow();
    for (const file of SHIPPED_DOMAIN_FILES) expect(fs.readFileSync(path.join(destination, file), 'utf8')).toBe('old content');
    expect(fs.readdirSync(path.dirname(destination)).some((name) => name.startsWith('.opentutor-install-'))).toBe(false);
  } finally { spy?.mockRestore(); fs.rmSync(root, { recursive: true, force: true }); }
});

it('stages within the destination filesystem without exposing temporary courses to catalogs', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-install-mount-'));
  const source = path.join(root, 'source'), parent = path.join(root, 'skills', 'tutor', 'domains'), destination = path.join(parent, 'course');
  let renameSpy, writeSpy;
  try {
    fs.mkdirSync(source); fs.mkdirSync(destination, { recursive: true });
    for (const name of SHIPPED_DOMAIN_FILES) {
      fs.writeFileSync(path.join(source, name), name === 'curriculum.json' ? JSON.stringify({ topic: 'New', lessons: [{ title: 'New' }] }) : 'new');
      fs.writeFileSync(path.join(destination, name), name === 'curriculum.json' ? JSON.stringify({ topic: 'Old', lessons: [{ title: 'Old' }] }) : 'old');
    }
    const rename = fs.renameSync, write = fs.writeFileSync;
    renameSpy = vi.spyOn(fs, 'renameSync').mockImplementation((from, to) => {
      // Simulate domains being a separate mount: crossing its boundary is EXDEV.
      if ([from, to].some((p) => path.relative(parent, p).startsWith('..'))) throw Object.assign(new Error('cross-device rename'), { code: 'EXDEV' });
      return rename(from, to);
    });
    writeSpy = vi.spyOn(fs, 'writeFileSync').mockImplementation((filename, ...args) => {
      write(filename, ...args);
      expect(publicCatalog(root).map((c) => c.slug)).toEqual(['course']);
      expect(publicCatalog(root)[0].topic).toBe('Old');
    });
    installDomain(source, destination);
    expect(publicCatalog(root).map((c) => [c.slug, c.topic])).toEqual([['course', 'New']]);
  } finally { renameSpy?.mockRestore(); writeSpy?.mockRestore(); fs.rmSync(root, { recursive: true, force: true }); }
});

it('reports retained recovery files without failing an already published installation', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-install-cleanup-'));
  const source = path.join(root, 'source'), destination = path.join(root, 'domains', 'course');
  let removeSpy, warning;
  try {
    fs.mkdirSync(source); fs.mkdirSync(destination, { recursive: true });
    for (const name of SHIPPED_DOMAIN_FILES) { fs.writeFileSync(path.join(source, name), 'new'); fs.writeFileSync(path.join(destination, name), 'old'); }
    const remove = fs.rmSync;
    removeSpy = vi.spyOn(fs, 'rmSync').mockImplementation((filename, ...args) => {
      if (path.basename(filename).startsWith('.opentutor-install-')) throw new Error('cleanup denied');
      return remove(filename, ...args);
    });
    warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(() => installDomain(source, destination)).not.toThrow();
    for (const name of SHIPPED_DOMAIN_FILES) expect(fs.readFileSync(path.join(destination, name), 'utf8')).toBe('new');
    const work = fs.readdirSync(path.dirname(destination)).find((name) => name.startsWith('.opentutor-install-'));
    expect(warning).toHaveBeenCalledWith(expect.stringContaining(path.join(path.dirname(destination), work)));
    expect(fs.readFileSync(path.join(path.dirname(destination), work, 'previous', 'curriculum.json'), 'utf8')).toBe('old');
  } finally { removeSpy?.mockRestore(); warning?.mockRestore(); fs.rmSync(root, { recursive: true, force: true }); }
});
