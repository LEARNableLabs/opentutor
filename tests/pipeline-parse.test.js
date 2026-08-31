import { describe, it, expect } from 'vitest';
import { CurriculumPipeline } from '../lib/core/pipeline.js';

// Create a pipeline with a dummy adapter to access parsing methods
const dummyAdapter = { name: 'test', generate: async () => ({ text: '', model: 'test', usage: null }) };
const dummyState = {
  writeDomainFile: () => {},
  writeCurriculum: () => {},
  readCurriculum: () => null,
};
const dummySkills = new Map();
const pipeline = new CurriculumPipeline({ adapter: dummyAdapter, state: dummyState, skills: dummySkills });

describe('_parsePipelineOutput', () => {
  it('parses valid curriculum JSON', () => {
    const text = JSON.stringify({
      curriculum: {
        topic: 'Math',
        slug: 'math',
        lessons: [
          { lesson: 1, title: 'Intro', concepts: ['numbers'], status: 'pending' },
          { lesson: 2, title: 'Addition', concepts: ['addition'] },
        ],
      },
      conceptMap: '# Concept Map\n...',
      teachingNotes: '# Teaching Notes\n...',
      resources: '# Resources\n...',
      teacher: '# Teacher Config\n...',
    });

    const result = pipeline._parsePipelineOutput(text, 'Math', 'math');
    expect(result.curriculum.topic).toBe('Math');
    expect(result.curriculum.lessons).toHaveLength(2);
    expect(result.curriculum.lessons[1].status).toBe('pending');
    expect(result.conceptMap).toContain('Concept Map');
    expect(result.teachingNotes).toContain('Teaching Notes');
    expect(result.resources).toContain('Resources');
    expect(result.teacher).toContain('Teacher Config');
  });

  it('fills in missing topic and slug', () => {
    const text = JSON.stringify({
      curriculum: {
        lessons: [{ lesson: 1, title: 'Intro' }],
      },
    });
    const result = pipeline._parsePipelineOutput(text, 'Physics', 'physics');
    expect(result.curriculum.topic).toBe('Physics');
    expect(result.curriculum.slug).toBe('physics');
    expect(result.curriculum.created).toBeTruthy();
  });

  it('sets default status to pending', () => {
    const text = JSON.stringify({
      curriculum: {
        lessons: [{ lesson: 1, title: 'Intro' }],
      },
    });
    const result = pipeline._parsePipelineOutput(text, 'X', 'x');
    expect(result.curriculum.lessons[0].status).toBe('pending');
  });

  it('throws when no JSON found', () => {
    expect(() => pipeline._parsePipelineOutput('no json here', 'X', 'x')).toThrow('no JSON');
  });

  it('throws when curriculum has no lessons', () => {
    const text = JSON.stringify({ curriculum: { topic: 'Empty', lessons: [] } });
    expect(() => pipeline._parsePipelineOutput(text, 'X', 'x')).toThrow('no lessons');
  });

  it('throws when lessons is not an array', () => {
    const text = JSON.stringify({ curriculum: { topic: 'Bad', lessons: 'not an array' } });
    expect(() => pipeline._parsePipelineOutput(text, 'X', 'x')).toThrow();
  });

  it('handles snake_case keys (concept_map, teaching_notes)', () => {
    const text = JSON.stringify({
      curriculum: { lessons: [{ lesson: 1, title: 'A' }] },
      concept_map: 'snake case map',
      teaching_notes: 'snake case notes',
    });
    const result = pipeline._parsePipelineOutput(text, 'X', 'x');
    expect(result.conceptMap).toBe('snake case map');
    expect(result.teachingNotes).toBe('snake case notes');
  });

  it('extracts JSON from surrounding prose', () => {
    const text = `Here is the curriculum:\n${JSON.stringify({
      curriculum: { lessons: [{ lesson: 1, title: 'A' }] },
    })}\nEnd of response.`;
    const result = pipeline._parsePipelineOutput(text, 'X', 'x');
    expect(result.curriculum.lessons).toHaveLength(1);
  });
});

describe('_parseCriticOutput', () => {
  it('parses APPROVED status', () => {
    const text = JSON.stringify({
      critique: 'Looks good overall.',
      status: 'APPROVED',
      severity: 'minor',
    });
    const result = pipeline._parseCriticOutput(text);
    expect(result.status).toBe('APPROVED');
    expect(result.critique).toBe('Looks good overall.');
    expect(result.severity).toBe('minor');
  });

  it('parses REVISE status', () => {
    const text = JSON.stringify({
      critique: '## Issues\n1. Missing topics\n2. Bad sequencing',
      status: 'REVISE',
      severity: 'major',
    });
    const result = pipeline._parseCriticOutput(text);
    expect(result.status).toBe('REVISE');
    expect(result.severity).toBe('major');
    expect(result.critique).toContain('Missing topics');
  });

  it('treats non-APPROVED status as REVISE', () => {
    const text = JSON.stringify({ critique: 'needs work', status: 'NEEDS_WORK' });
    const result = pipeline._parseCriticOutput(text);
    expect(result.status).toBe('REVISE');
  });

  it('falls back to REVISE for malformed text', () => {
    const result = pipeline._parseCriticOutput('This is just plain text critique');
    expect(result.status).toBe('REVISE');
    expect(result.critique).toBe('This is just plain text critique');
    expect(result.severity).toBe('minor');
  });

  it('falls back to REVISE for invalid JSON', () => {
    const result = pipeline._parseCriticOutput('{ broken json');
    expect(result.status).toBe('REVISE');
  });

  it('defaults severity to minor', () => {
    const text = JSON.stringify({ critique: 'ok', status: 'REVISE' });
    const result = pipeline._parseCriticOutput(text);
    expect(result.severity).toBe('minor');
  });

  it('extracts JSON from surrounding prose', () => {
    const text = `My review:\n${JSON.stringify({ critique: 'found issues', status: 'APPROVED' })}\nDone.`;
    const result = pipeline._parseCriticOutput(text);
    expect(result.status).toBe('APPROVED');
  });
});
