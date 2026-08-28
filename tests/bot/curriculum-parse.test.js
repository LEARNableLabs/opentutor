import { describe, expect, it } from 'vitest';
import { parseGeneratedDomain, slugify } from '../../scripts/bot/curriculum.js';

describe('parseGeneratedDomain', () => {
  it('rejects generated curricula with no lessons', () => {
    expect(() => parseGeneratedDomain('{"curriculum":{"lessons":[]}}', 'Test', 'test'))
      .toThrow('Could not parse curriculum');
  });

  it('accepts a non-empty generated curriculum', () => {
    const parsed = parseGeneratedDomain(
      '{"curriculum":{"lessons":[{"day":1,"title":"Start"}]}}',
      'Test',
      'test',
    );

    expect(parsed.curriculum.lessons).toHaveLength(1);
    expect(parsed.curriculum.lessons[0].status).toBe('pending');
  });

  it('creates a safe non-empty slug for non-Latin topics', () => {
    expect(slugify('日本史')).toMatch(/^topic-[a-f0-9]{12}$/);
    expect(slugify('Political Economy')).toBe('political-economy');
  });
});
