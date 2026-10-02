import { describe, it, expect, vi } from 'vitest';
import { findResources, withResources, resourcesSection } from '../lib/core/resource-finder.js';
import { plan } from '../lib/core/link-check.js';

// #334: resources come from a web search, and a URL that is not real never reaches a lesson.

const lessons = [{ lesson: 1, title: 'One', concepts: ['a'], resources: ['https://old.example/a'] }, { lesson: 2, title: 'Two', concepts: ['b'] }];
const reply = (text) => ({ generate: vi.fn(async () => ({ text })) });
const R = (url, type = 'video') => ({ url, type, title: `T ${url}`, why: 'because' });

describe('findResources', () => {
  it('asks for the web tools, and keeps only real URLs', async () => {
    const adapter = reply(JSON.stringify({ lessons: [{ lesson: 1, resources: [R('https://youtu.be/AAAAAAAAAAA'), R('https://made.up/x'), R('http://insecure.example/y'), R('https://youtu.be/AAAAAAAAAAA')] }] }));
    const notes = [];
    const found = await findResources({ adapter, topic: 'T', level: 'beginner', lessons, isReal: async (u) => !u.includes('made.up'), onNote: (k, d) => notes.push([k, d.url]) });
    expect(adapter.generate.mock.calls[0][2]).toMatchObject({ tools: 'WebSearch,WebFetch', model: 'strong' });
    expect(found).toEqual([{ lesson: 1, resources: [R('https://youtu.be/AAAAAAAAAAA')] }]);
    expect(notes).toEqual([['resource-dropped', 'https://made.up/x']]);
  });

  it('yields nothing, and says so, for a batch that does not parse or fails', async () => {
    const notes = [];
    expect(await findResources({ adapter: reply('sorry, no json'), topic: 'T', level: 'x', lessons, isReal: async () => true, onNote: (k) => notes.push(k) })).toEqual([]);
    const failing = { generate: async () => { throw new Error('boom'); } };
    expect(await findResources({ adapter: failing, topic: 'T', level: 'x', lessons, onNote: (k) => notes.push(k) })).toEqual([]);
    expect(notes).toEqual(['resource-search-failed']);
  });
});

describe('applying what was found', () => {
  const found = [{ lesson: 1, resources: [R('https://a.example/1'), R('https://a.example/2', 'article')] }];

  it('puts the found URLs first, keeps what a lesson had, and caps at five', () => {
    const out = withResources({ lessons: [{ ...lessons[0], resources: ['https://old.example/a', 'https://a.example/1', 'x1', 'x2', 'x3', 'x4'] }, lessons[1]] }, found);
    expect(out.lessons[0].resources).toEqual(['https://a.example/1', 'https://a.example/2', 'https://old.example/a', 'x1', 'x2']);
    expect(out.lessons[1].resources).toEqual([]);
  });

  it('writes a markdown section with the hook, only for lessons that have resources', () => {
    const md = resourcesSection([...found, { lesson: 2, resources: [] }], lessons);
    expect(md).toContain('### Lesson 1: One');
    expect(md).toContain('- ▶ [T https://a.example/1](https://a.example/1) — because');
    expect(md).not.toContain('Lesson 2');
    expect(resourcesSection([], lessons)).toBe('');
  });
});

describe('YouTube Shorts', () => {
  it('are checked as the video they are', () => {
    expect(plan('https://www.youtube.com/shorts/dQw4w9WgXcQ').url).toContain(encodeURIComponent('watch?v=dQw4w9WgXcQ'));
    expect(plan('https://www.youtube.com/shorts/not-an-id').kind).toBe('dead');
  });
});
