import { describe, it, expect } from 'vitest';
import { buildStudentModel } from '../lib/core/student-model.js';
import { evaluatePractice } from '../lib/core/deliberate-practice.js';

// scripts/bot/lesson.js writes the log with one of: minimal | brief | engaged | high
const learningLog = (label) => `## Accuracy Trend\n- **Last 5:** no data yet\n- **Engagement:** ${label}\n`;

describe('engagement read back from the learning log', () => {
  it.each([
    ['minimal', 'low'],
    ['brief', 'low'],
    ['engaged', 'engaged'],
    ['high', 'high'],
  ])('reads a logged "%s" as %s', (logged, expected) => {
    expect(buildStudentModel(learningLog(logged), null, '').engagement).toBe(expected);
  });

  it('gets a disengaged student a change of lesson format', () => {
    const { directives } = evaluatePractice(learningLog('minimal'), { lessons: [] }, '');
    expect(directives).toContainEqual(expect.objectContaining({ type: 'VARY', target: 'real-world' }));
  });
});
