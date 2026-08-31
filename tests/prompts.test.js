import { describe, it, expect } from 'vitest';
import {
  buildPlanPrompt,
  buildCurriculumBuilderPrompt,
  buildDomainFilesPrompt,
  buildCriticPrompt,
  buildTeacherPrompt,
  untrustedData,
  clip,
  escapeXml,
} from '../lib/core/prompts.js';

// Mock skills map
const skills = new Map([
  ['domain-template', '# Domain Template\nHow to generate domains.'],
  ['curriculum-format', '# Curriculum Format\nJSON schema for curricula.'],
  ['teaching-method', '# Teaching Method\nDeliberate practice principles.'],
  ['source-verification', '# Source Verification\nCitation rules.'],
  ['lesson-delivery', '# Lesson Delivery\nDelivery modes and formatting.'],
]);

// Mock state for buildTeacherPrompt
const mockState = {
  readDomainFile: (slug, filename) => {
    const files = {
      'teacher.md': '# Teacher Config\nExercise style: multiple choice',
      'teaching-notes.md': '# Teaching Notes\nCommon misconceptions...',
      'concept-map.md': '# Concept Map\n1. Concept A\n2. Concept B',
      'resources.md': '# Resources\n- Textbook A',
      'research.md': '# Research\nKey papers...',
      'learning.md': '# Learning Log\nLast lesson: Day 3',
    };
    return files[filename] || null;
  },
  readUser: () => '# Student\nName: Alice\nLevel: intermediate',
};

describe('Utility functions', () => {
  it('clip truncates long text', () => {
    const long = 'a'.repeat(100);
    expect(clip(long, 50)).toContain('[reference data truncated]');
    expect(clip(long, 50).length).toBeLessThan(100);
  });

  it('clip passes short text through', () => {
    expect(clip('hello', 100)).toBe('hello');
  });

  it('clip handles null/undefined', () => {
    expect(clip(null)).toBe('');
    expect(clip(undefined)).toBe('');
  });

  it('escapeXml escapes special characters', () => {
    expect(escapeXml('<b>test & "quote"</b>')).toBe('&lt;b&gt;test &amp; "quote"&lt;/b&gt;');
  });

  it('untrustedData wraps content in tags', () => {
    const result = untrustedData('test-label', 'content here', 1000);
    expect(result).toContain('## test-label');
    expect(result).toContain('<untrusted_data type="test-label">');
    expect(result).toContain('</untrusted_data>');
  });

  it('untrustedData returns empty string for falsy value', () => {
    expect(untrustedData('label', null)).toBe('');
    expect(untrustedData('label', '')).toBe('');
  });
});

describe('buildPlanPrompt', () => {
  it('returns correct structure', () => {
    const result = buildPlanPrompt(skills, 'Math', 'intermediate', 'research data');
    expect(result.model).toBe('strong');
    expect(result.outputMode).toBe('json');
    expect(typeof result.system).toBe('string');
  });

  it('includes research context', () => {
    const result = buildPlanPrompt(skills, 'Math', 'intermediate', 'arxiv paper about algebra');
    expect(result.system).toContain('arxiv paper about algebra');
  });

  it('includes skill file content', () => {
    const result = buildPlanPrompt(skills, 'Math', 'intermediate', 'research');
    expect(result.system).toContain('Domain Template');
    expect(result.system).toContain('Curriculum Format');
    expect(result.system).toContain('Teaching Method');
  });

  it('includes critique text on revision pass', () => {
    const result = buildPlanPrompt(skills, 'Math', 'intermediate', 'research', 'Fix sequencing in module 2');
    expect(result.system).toContain('Fix sequencing in module 2');
    expect(result.system).toContain('Revision Pass');
  });

  it('marks first pass when no critique', () => {
    const result = buildPlanPrompt(skills, 'Math', 'intermediate', 'research', null);
    expect(result.system).toContain('FIRST pass');
  });
});

describe('buildCurriculumBuilderPrompt', () => {
  it('returns correct structure', () => {
    const result = buildCurriculumBuilderPrompt(skills, 'Math', 'math', 'intermediate', 'research', 'plan text');
    expect(result.model).toBe('strong');
    expect(result.outputMode).toBe('json');
  });

  it('includes plan text', () => {
    const result = buildCurriculumBuilderPrompt(skills, 'Math', 'math', 'intermediate', 'research', 'Module 1: Algebra');
    expect(result.system).toContain('Module 1: Algebra');
  });

  it('includes untrusted_data tags', () => {
    const result = buildCurriculumBuilderPrompt(skills, 'Math', 'math', 'intermediate', 'research', 'plan');
    expect(result.system).toContain('untrusted_data');
  });
});

describe('buildDomainFilesPrompt', () => {
  it('returns cheap model', () => {
    const result = buildDomainFilesPrompt(skills, 'Math', 'intermediate', 'research', 'plan');
    expect(result.model).toBe('cheap');
    expect(result.outputMode).toBe('json');
  });
});

describe('buildCriticPrompt', () => {
  it('returns cheap model', () => {
    const result = buildCriticPrompt('plan', '{}', 'map', 'notes', 'resources');
    expect(result.model).toBe('cheap');
    expect(result.outputMode).toBe('json');
  });

  it('includes all domain files in untrusted_data', () => {
    const result = buildCriticPrompt('plan text', '{"lessons":[]}', 'concept map', 'teaching notes', 'resources list');
    expect(result.system).toContain('plan text');
    expect(result.system).toContain('concept map');
    expect(result.system).toContain('teaching notes');
    expect(result.system).toContain('resources list');
  });

  it('includes syllabi when passed in options', () => {
    const result = buildCriticPrompt('plan', '{}', 'map', 'notes', 'resources', {
      syllabi: 'MIT OCW 18.01: Calculus I\nCoursera: Math for ML',
    });
    expect(result.system).toContain('MIT OCW 18.01');
    expect(result.system).toContain('reference-syllabi');
    expect(result.system).toContain('Syllabus comparison');
  });

  it('includes dead URLs when passed in options', () => {
    const result = buildCriticPrompt('plan', '{}', 'map', 'notes', 'resources', {
      deadUrls: ['https://dead.link/1', 'https://dead.link/2'],
    });
    expect(result.system).toContain('dead.link/1');
    expect(result.system).toContain('dead-urls');
    expect(result.system).toContain('failed verification');
  });

  it('includes wiki concepts when passed in options', () => {
    const result = buildCriticPrompt('plan', '{}', 'map', 'notes', 'resources', {
      wikiConcepts: 'algebra, calculus, linear algebra',
    });
    expect(result.system).toContain('algebra, calculus');
    expect(result.system).toContain('wikipedia-concept-graph');
    expect(result.system).toContain('Concept coverage');
  });

  it('omits optional sections when not provided', () => {
    const result = buildCriticPrompt('plan', '{}', 'map', 'notes', 'resources');
    expect(result.system).not.toContain('reference-syllabi');
    expect(result.system).not.toContain('dead-urls');
    expect(result.system).not.toContain('wikipedia-concept-graph');
  });
});

describe('buildTeacherPrompt', () => {
  const lesson = {
    day: 5,
    title: 'Why does entropy increase?',
    module: 'Thermodynamics',
    concepts: ['entropy', 'second law'],
    resources: ['https://example.com'],
    type: 'mini-lesson',
    difficulty: 3,
  };

  it('returns strong model and student output mode', () => {
    const result = buildTeacherPrompt(mockState, skills, lesson, 'physics');
    expect(result.model).toBe('strong');
    expect(result.outputMode).toBe('student');
  });

  it('includes teacher.md content when available', () => {
    const result = buildTeacherPrompt(mockState, skills, lesson, 'physics');
    expect(result.system).toContain('Exercise style: multiple choice');
  });

  it('includes teaching notes', () => {
    const result = buildTeacherPrompt(mockState, skills, lesson, 'physics');
    expect(result.system).toContain('Common misconceptions');
  });

  it('includes learning.md for session continuity', () => {
    const result = buildTeacherPrompt(mockState, skills, lesson, 'physics');
    expect(result.system).toContain('Last lesson: Day 3');
  });

  it('includes student profile', () => {
    const result = buildTeacherPrompt(mockState, skills, lesson, 'physics');
    expect(result.system).toContain('Name: Alice');
  });

  it('includes lesson data', () => {
    const result = buildTeacherPrompt(mockState, skills, lesson, 'physics');
    expect(result.system).toContain('entropy increase');
    expect(result.system).toContain('Thermodynamics');
  });

  it('handles missing domain files gracefully', () => {
    const emptyState = {
      readDomainFile: () => null,
      readUser: () => '',
    };
    const result = buildTeacherPrompt(emptyState, skills, lesson, 'no-topic');
    expect(result.system).toBeTruthy();
    expect(result.model).toBe('strong');
  });
});
