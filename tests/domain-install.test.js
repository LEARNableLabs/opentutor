import { it, expect } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildTopicSlug, installDomain, SHIPPED_DOMAIN_FILES } from '../lib/core/domain-install.js';

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
