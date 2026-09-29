import { describe, it, expect } from 'vitest';
import { parseAssessment, assessmentFilter } from '../lib/core/assessment.js';

// The grading block is emitted BEFORE the student-facing reply, so a stream that
// forwards tokens naively would show it. Nothing here may leak to the student.

const ASSESS = '<assessment>{"understanding":"full","score":0.9}</assessment>';

const streamThrough = (chunks) => {
  const out = [];
  const feed = assessmentFilter((t) => out.push(t));
  for (const c of chunks) feed(c);
  return out.join('');
};

describe('parseAssessment', () => {
  it('splits the block from the reply', () => {
    const { assessment, visible } = parseAssessment(`${ASSESS}\nGood — why?`);
    expect(assessment).toEqual({ understanding: 'full', score: 0.9 });
    expect(visible).toBe('Good — why?');
  });

  it('handles a reply with no block', () => {
    expect(parseAssessment('Just text')).toEqual({ assessment: null, visible: 'Just text' });
  });

  it('drops an unparseable block rather than showing it', () => {
    const { assessment, visible } = parseAssessment('<assessment>{broken</assessment>Hello');
    expect(assessment).toBeNull();
    expect(visible).toBe('Hello');
  });
});

describe('assessmentFilter', () => {
  it('suppresses the block and streams the rest', () => {
    expect(streamThrough([ASSESS, '\nGood', ' — why?'])).toBe('Good — why?');
  });

  it('suppresses it when split across many chunks', () => {
    const chunks = `${ASSESS}\nNice work`.match(/.{1,3}/gs);
    expect(streamThrough(chunks)).toBe('Nice work');
  });

  it('streams immediately when there is no block', () => {
    const out = [];
    const feed = assessmentFilter((t) => out.push(t));
    feed('Hello ');
    expect(out).toEqual(['Hello ']);   // not withheld waiting for a block
    feed('there');
    expect(out.join('')).toBe('Hello there');
  });

  it('never emits any part of the tag', () => {
    for (const size of [1, 2, 5, 13, 40]) {
      const chunks = `${ASSESS}Visible text`.match(new RegExp(`.{1,${size}}`, 'gs'));
      const result = streamThrough(chunks);
      expect(result).toBe('Visible text');
      expect(result).not.toMatch(/assessment|score|understanding|[<>]/);
    }
  });

  it('tolerates leading whitespace before the block', () => {
    expect(streamThrough(['\n\n', ASSESS, 'Text'])).toBe('Text');
  });
});

// #224: the model sometimes writes its block after some of the reply, not first.
describe('assessmentFilter, a block anywhere', () => {
  const run = (chunks) => { const out = []; const feed = assessmentFilter((t) => out.push(t)); chunks.forEach(feed); return out.join(''); };

  it('removes a block in the middle of a reply, split across chunks', () => {
    expect(run(["Why doesn't it?\n\n<asse", 'ssment>{"score":1}</assess', 'ment>\n\nGood, go on.'])).toBe("Why doesn't it?\n\nGood, go on.");
  });

  it('lets through a "<" that starts no block', () => {
    expect(run(['a < b, and <b>bold</b> too'])).toBe('a < b, and <b>bold</b> too');
  });

  // Review of #231: a tag with spaces inside is still a grade, on the stream and in the final reply.
  it('removes a block whose tags have spaces inside, split across chunks', () => {
    expect(run(['Good. <assess', 'ment >{"score":0.4}</ assessment', ' >\nWhy?'])).toBe('Good. Why?');
  });
});

describe('parseAssessment, tags with spaces inside', () => {
  it('reads the grade and keeps it out of the reply', () => {
    expect(parseAssessment('< assessment >{"score":0.4}</assessment >\nWhy?')).toEqual({ assessment: { score: 0.4 }, visible: 'Why?' });
  });
});

// Second review of #231.
describe('only the first block is the grade', () => {
  const example = 'For this schema, <assessment>{"score":1}</assessment> is the element to validate.';

  it('keeps a later block, the tutor\'s own example, in the reply and out of the grade', () => {
    expect(parseAssessment(`<assessment>{"score":0.6}</assessment>\n${example}`)).toEqual({ assessment: { score: 0.6 }, visible: example });
  });

  it('streams a later block as the tutor wrote it', () => {
    const out = [];
    const feed = assessmentFilter((t) => out.push(t));
    ['<assessment>{"score":0.6}</assessment>\nFor this schema, <assess', 'ment>{"score":1}</assessment> is the element to validate.'].forEach(feed);
    expect(out.join('')).toBe(example);
  });

  it('reads a block the model never closed, and keeps it out of the reply', () => {
    expect(parseAssessment('<assessment>{"understanding":"partial","score":0.8}\n\nGood — why?')).toEqual({ assessment: { understanding: 'partial', score: 0.8 }, visible: 'Good — why?' });
  });
});
